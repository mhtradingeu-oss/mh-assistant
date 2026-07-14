#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const storage = require("../runtime/orchestrator-service/lib/workspace/workspace-storage");

const TIMESTAMP_1 = "2026-07-14T12:00:00.000Z";
const TIMESTAMP_2 = "2026-07-14T12:01:00.000Z";
const TEMP_BASE = fs.mkdtempSync(path.join(os.tmpdir(), "mh-workspace-storage-"));
const WORKSPACE_ROOT = path.join(TEMP_BASE, "isolated", "workspaces");

function workspaceId(hexCharacter) {
  return `ws_${hexCharacter.repeat(32)}`;
}

function evidence(index = 0) {
  return {
    reference_type: "workspace_creation",
    reference_id: `workspace-storage-evidence-${index}`,
    source_owner: "workspace-storage-verification",
    recorded_at: TIMESTAMP_1
  };
}

function workspace(id, overrides = {}) {
  return {
    schema_version: 1,
    workspace_id: id,
    workspace_version: 1,
    workspace_name: `Workspace ${id.slice(-4)}`,
    status: "CREATING",
    ownership_state: "UNCLAIMED",
    created_at: TIMESTAMP_1,
    updated_at: TIMESTAMP_1,
    project_relationships: [],
    evidence_references: [evidence()],
    ...overrides
  };
}

function writeRaw(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function assertStorageError(fn, code) {
  assert.throws(fn, (error) => {
    assert.equal(error.name, "WorkspaceStorageError");
    assert.equal(error.code, code);
    return true;
  });
}

function assertInsideTemporaryRoot(targetPath) {
  const relative = path.relative(TEMP_BASE, targetPath);
  assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative), false);
}

function cleanup() {
  fs.rmSync(TEMP_BASE, { recursive: true, force: true });
}

function run() {
  assert.deepEqual(storage.RECOVERY_CLASSIFICATIONS, [
    "HEALTHY",
    "MISSING_NEW",
    "MISSING_AFTER_QUARANTINE",
    "CORRUPT",
    "TEMP_PRESENT",
    "BACKUP_AVAILABLE",
    "RECOVERY_REQUIRED"
  ]);

  const missingRoot = path.join(TEMP_BASE, "missing", "workspaces");
  assert.deepEqual(storage.discoverWorkspaces(missingRoot), []);
  assert.equal(fs.existsSync(missingRoot), false);
  assert.equal(storage.readWorkspace(missingRoot, workspaceId("0")), null);
  assert.equal(fs.existsSync(missingRoot), false);

  fs.mkdirSync(WORKSPACE_ROOT, { recursive: true });
  for (const ignoredDirectory of [".hidden", "tmp", "backup", "corrupt", "test", "ws_BAD"]) {
    fs.mkdirSync(path.join(WORKSPACE_ROOT, ignoredDirectory));
  }
  writeRaw(path.join(WORKSPACE_ROOT, "direct-file"), "not a Workspace directory");
  writeRaw(path.join(WORKSPACE_ROOT, "workspaces.json"), "[]");

  const symlinkId = workspaceId("a");
  const symlinkTarget = path.join(TEMP_BASE, "outside-workspace");
  fs.mkdirSync(symlinkTarget);
  fs.symlinkSync(symlinkTarget, path.join(WORKSPACE_ROOT, symlinkId), "dir");

  const validId = workspaceId("1");
  const firstRecord = workspace(validId);
  const firstWrite = storage.writeWorkspace(WORKSPACE_ROOT, firstRecord);
  assertInsideTemporaryRoot(firstWrite.canonical_path);
  assert.equal(fs.existsSync(firstWrite.canonical_path), true);
  assert.equal(fs.existsSync(`${firstWrite.canonical_path}.tmp`), false);
  assert.equal(firstWrite.backup.attempted, false);

  const discovered = storage.discoverWorkspaces(WORKSPACE_ROOT);
  assert.deepEqual(discovered.map((item) => item.workspace_id), [validId]);
  const discoveryDiagnostics = storage.discoverWorkspacesWithDiagnostics(WORKSPACE_ROOT);
  assert.deepEqual(discoveryDiagnostics.workspaces.map((item) => item.workspace_id), [validId]);
  assert.equal(discoveryDiagnostics.diagnostics.some((item) => item.reason === "HIDDEN_ENTRY"), true);
  assert.equal(discoveryDiagnostics.diagnostics.some((item) => item.reason === "MALFORMED_WORKSPACE_ID"), true);
  assert.equal(discoveryDiagnostics.diagnostics.some((item) => item.entry === symlinkId), true);

  const invalidJsonId = workspaceId("2");
  const invalidPaths = storage.resolveWorkspacePaths(WORKSPACE_ROOT, invalidJsonId);
  writeRaw(invalidPaths.canonicalPath, "{ invalid Workspace JSON");
  assertStorageError(
    () => storage.readWorkspace(WORKSPACE_ROOT, invalidJsonId),
    storage.STORAGE_ERROR_CODES.WORKSPACE_CORRUPT
  );
  assert.equal(fs.existsSync(invalidPaths.canonicalPath), true);
  assert.equal(storage.discoverWorkspaces(WORKSPACE_ROOT).some((item) => item.workspace_id === invalidJsonId), false);

  const invalidSchemaId = workspaceId("6");
  const invalidSchemaPaths = storage.resolveWorkspacePaths(WORKSPACE_ROOT, invalidSchemaId);
  writeRaw(invalidSchemaPaths.canonicalPath, JSON.stringify({
    ...workspace(invalidSchemaId),
    unknown_field: true
  }));
  assertStorageError(
    () => storage.readWorkspace(WORKSPACE_ROOT, invalidSchemaId),
    storage.STORAGE_ERROR_CODES.WORKSPACE_CORRUPT
  );
  assert.equal(storage.inspectWorkspaceStorage(WORKSPACE_ROOT, invalidSchemaId).classification, "CORRUPT");

  const replacementRecord = workspace(validId, {
    workspace_version: 2,
    workspace_name: "Workspace replacement",
    updated_at: TIMESTAMP_2
  });
  const replacementWrite = storage.writeWorkspace(WORKSPACE_ROOT, replacementRecord);
  assert.equal(replacementWrite.backup.attempted, true);
  assert.equal(replacementWrite.backup.created, true);
  assert.equal(replacementWrite.backup.error, null);
  assert.equal(storage.readWorkspace(WORKSPACE_ROOT, validId).workspace_version, 2);
  const backupInspection = storage.inspectWorkspaceBackup(WORKSPACE_ROOT, validId);
  assert.equal(backupInspection.classification, "BACKUP_AVAILABLE");
  assert.equal(backupInspection.valid, true);
  assert.equal(backupInspection.workspace.workspace_version, 1);

  writeRaw(firstWrite.canonical_path, "{ canonical corruption");
  assertStorageError(
    () => storage.readWorkspace(WORKSPACE_ROOT, validId),
    storage.STORAGE_ERROR_CODES.WORKSPACE_CORRUPT
  );
  assert.equal(fs.existsSync(firstWrite.canonical_path), true);
  assert.equal(storage.inspectWorkspaceStorage(WORKSPACE_ROOT, validId).classification, "CORRUPT");

  const quarantine = storage.quarantineCorruptWorkspace(WORKSPACE_ROOT, validId, { now: () => 1000 });
  assert.equal(quarantine.classification, "MISSING_AFTER_QUARANTINE");
  assert.equal(quarantine.recovery_required, true);
  assert.equal(quarantine.states.includes("BACKUP_AVAILABLE"), true);
  assert.equal(quarantine.states.includes("RECOVERY_REQUIRED"), true);
  assert.equal(fs.existsSync(firstWrite.canonical_path), false);
  assert.equal(fs.existsSync(quarantine.quarantine_path), true);
  assert.equal(fs.existsSync(firstWrite.canonical_path), false);
  assertStorageError(
    () => storage.readWorkspace(WORKSPACE_ROOT, validId),
    storage.STORAGE_ERROR_CODES.WORKSPACE_CORRUPT
  );
  assert.equal(fs.existsSync(firstWrite.canonical_path), false);

  const recovered = storage.recoverWorkspaceFromBackup(WORKSPACE_ROOT, validId, {
    now: () => TIMESTAMP_2,
    referenceId: "workspace-recovery-verification"
  });
  assert.equal(recovered.classification, "HEALTHY");
  assert.equal(recovered.workspace.status, "FAILED");
  assert.equal(recovered.workspace.workspace_version, 2);
  assert.equal(recovered.workspace.evidence_references.at(-1).reference_type, "workspace_recovery");
  assert.equal(storage.readWorkspace(WORKSPACE_ROOT, validId).status, "FAILED");

  const tempOnlyId = workspaceId("3");
  const tempOnlyPaths = storage.resolveWorkspacePaths(WORKSPACE_ROOT, tempOnlyId);
  writeRaw(tempOnlyPaths.tempPath, JSON.stringify(workspace(tempOnlyId)));
  const tempInspection = storage.inspectWorkspaceStorage(WORKSPACE_ROOT, tempOnlyId);
  assert.equal(tempInspection.classification, "TEMP_PRESENT");
  assert.equal(tempInspection.states.includes("RECOVERY_REQUIRED"), true);

  const backupOnlyId = workspaceId("4");
  const backupOnlyPaths = storage.resolveWorkspacePaths(WORKSPACE_ROOT, backupOnlyId);
  writeRaw(backupOnlyPaths.backupPath, JSON.stringify(workspace(backupOnlyId)));
  const backupOnlyInspection = storage.inspectWorkspaceStorage(WORKSPACE_ROOT, backupOnlyId);
  assert.equal(backupOnlyInspection.classification, "BACKUP_AVAILABLE");
  assert.equal(backupOnlyInspection.states.includes("RECOVERY_REQUIRED"), true);
  assert.equal(fs.existsSync(backupOnlyPaths.canonicalPath), false);

  const corruptBackupId = workspaceId("7");
  const corruptBackupPaths = storage.resolveWorkspacePaths(WORKSPACE_ROOT, corruptBackupId);
  writeRaw(corruptBackupPaths.backupPath, "{ corrupt backup");
  const corruptBackupInspection = storage.inspectWorkspaceStorage(WORKSPACE_ROOT, corruptBackupId);
  assert.equal(corruptBackupInspection.classification, "CORRUPT");
  assert.equal(corruptBackupInspection.states.includes("RECOVERY_REQUIRED"), true);
  assert.equal(storage.inspectWorkspaceBackup(WORKSPACE_ROOT, corruptBackupId).valid, false);
  assertStorageError(
    () => storage.readWorkspace(WORKSPACE_ROOT, backupOnlyId),
    storage.STORAGE_ERROR_CODES.WORKSPACE_CORRUPT
  );
  assert.equal(fs.existsSync(backupOnlyPaths.canonicalPath), false);

  const noTruncationId = workspaceId("5");
  const evidenceReferences = Array.from({ length: 75 }, (_, index) => evidence(index));
  storage.writeWorkspace(WORKSPACE_ROOT, workspace(noTruncationId, {
    evidence_references: evidenceReferences
  }));
  assert.equal(storage.readWorkspace(WORKSPACE_ROOT, noTruncationId).evidence_references.length, 75);

  assert.throws(() => storage.resolveWorkspacePaths(WORKSPACE_ROOT, "../escape"));
  assert.throws(() => storage.resolveWorkspacePaths(WORKSPACE_ROOT, validId.toUpperCase()));
  assertStorageError(
    () => storage.writeWorkspace(WORKSPACE_ROOT, workspace(symlinkId)),
    storage.STORAGE_ERROR_CODES.SYMLINK_FORBIDDEN
  );
  assert.equal(fs.existsSync(path.join(TEMP_BASE, "escape", "workspace.json")), false);

  const sourcePath = path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/workspace/workspace-storage.js"
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  assert.doesNotMatch(source, /workspaces\.json/);
  assert.doesNotMatch(source, /(?:require|import)\s*\(?["'][^"']*(?:frontend|control-center|public\/)/i);
  assert.doesNotMatch(source, /\b(?:express|router|app)\s*\.\s*(?:use|get|post|put|patch|delete|route)\s*\(/i);
  assert.doesNotMatch(source, /(?:require|import)\s*\(?["'][^"']*(?:project-runtime|project-store|project-service)/i);
  assert.doesNotMatch(source, /legacy|dualWrite|dual_write/);
  assert.doesNotMatch(source, /MAX_ITEMS|\.slice\s*\(/);
  assertInsideTemporaryRoot(WORKSPACE_ROOT);
  assert.notEqual(storage.resolveWorkspaceRoot(WORKSPACE_ROOT), storage.DEFAULT_WORKSPACE_ROOT);

  console.log(JSON.stringify({
    result: "pass",
    temporary_root: WORKSPACE_ROOT,
    production_data_touched: false,
    checks: {
      missingRootPureDiscovery: "pass",
      ignoredDiscoveryEntries: "pass",
      symlinkExclusion: "pass",
      validWorkspaceDiscovery: "pass",
      invalidJsonRejection: "pass",
      readDoesNotInitialize: "pass",
      atomicReplacement: "pass",
      bestEffortBackup: "pass",
      explicitQuarantine: "pass",
      noEmptyReplacement: "pass",
      recoveryClassifications: "pass",
      explicitBackupRecovery: "pass",
      recoveredFailedState: "pass",
      recoveredVersionIncrement: "pass",
      rootContainment: "pass",
      noSilentTruncation: "pass",
      authorityBoundaries: "pass"
    }
  }, null, 2));
}

try {
  run();
} finally {
  cleanup();
}

#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const runtime = require("../runtime/orchestrator-service/lib/workspace/workspace-runtime");
const contract = require("../runtime/orchestrator-service/lib/workspace/workspace-contract");
const storage = require("../runtime/orchestrator-service/lib/workspace/workspace-storage");

const TEMP_BASE = fs.mkdtempSync(path.join(os.tmpdir(), "mh-workspace-runtime-"));
const ROOT = path.join(TEMP_BASE, "workspaces");
const T1 = "2026-07-14T12:00:00.000Z";
const T2 = "2026-07-14T12:01:00.000Z";
const T3 = "2026-07-14T12:02:00.000Z";

function workspaceId(character) {
  return `ws_${character.repeat(32)}`;
}

function idGenerator(...ids) {
  let index = 0;
  return () => ids[Math.min(index++, ids.length - 1)];
}

function evidence(referenceType, suffix = "1", overrides = {}) {
  return {
    reference_type: referenceType,
    reference_id: `evt_${referenceType}_${suffix}`,
    source_owner: "workspace-runtime-verifier",
    recorded_at: T1,
    ...overrides
  };
}

function record(id, overrides = {}) {
  return {
    schema_version: 1,
    workspace_id: id,
    workspace_version: 1,
    workspace_name: "Verification Workspace",
    status: "CREATING",
    ownership_state: "UNCLAIMED",
    created_at: T1,
    updated_at: T1,
    project_relationships: [],
    evidence_references: [],
    ...overrides
  };
}

function options(id, overrides = {}) {
  return {
    root: ROOT,
    now: () => T1,
    generateWorkspaceId: () => id,
    ...overrides
  };
}

async function assertRejectsCode(operation, code, name) {
  await assert.rejects(operation, (error) => {
    if (name) assert.equal(error.name, name);
    assert.equal(error.code, code);
    return true;
  });
}

function memoryStorage(initialRecords = []) {
  const records = new Map(initialRecords.map((item) => [item.workspace_id, structuredClone(item)]));
  const writes = [];
  return {
    records,
    writes,
    inspectWorkspaceStorage(_root, id) {
      const value = records.get(id);
      return {
        workspace_id: id,
        classification: value ? "HEALTHY" : "MISSING_NEW",
        states: [value ? "HEALTHY" : "MISSING_NEW"],
        recovery_required: false,
        workspace: value ? structuredClone(value) : null,
        canonical: { present: Boolean(value), valid: Boolean(value) }
      };
    },
    readWorkspace(_root, id) {
      const value = records.get(id);
      return value ? structuredClone(value) : null;
    },
    writeWorkspace(_root, value) {
      writes.push(structuredClone(value));
      records.set(value.workspace_id, structuredClone(value));
      return { workspace_id: value.workspace_id, backup: { attempted: false, created: false, error: null } };
    }
  };
}

async function verifyCreation() {
  const creationEvidence = evidence("workspace_creation");
  const firstId = workspaceId("1");
  const created = await runtime.createWorkspace({
    workspace_name: "Primary Workspace",
    evidence_references: [creationEvidence]
  }, options(firstId));
  assert.equal(created.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.SUCCESS);
  assert.equal(created.changed, true);
  assert.equal(created.previous_version, 0);
  assert.equal(created.workspace.workspace_id, firstId);
  assert.match(created.workspace.workspace_id, /^ws_[0-9a-f]{32}$/);
  assert.equal(created.workspace.workspace_id, created.workspace.workspace_id.toLowerCase());
  assert.equal(created.workspace.schema_version, 1);
  assert.equal(created.workspace.workspace_version, 1);
  assert.equal(created.workspace.status, "CREATING");
  assert.equal(created.workspace.ownership_state, "UNCLAIMED");
  assert.equal(created.workspace.created_at, T1);
  assert.equal(created.workspace.updated_at, T1);
  assert.deepEqual(created.workspace.project_relationships, []);
  assert.deepEqual(created.workspace.evidence_references, [creationEvidence]);
  assert.ok(created.persistence && typeof created.persistence === "object");

  const fresh = await runtime.getWorkspace(firstId, { root: ROOT });
  assert.deepEqual(fresh, created.workspace);
  const noEvidenceId = workspaceId("2");
  const noEvidence = await runtime.createWorkspace({ workspace_name: "No fabricated evidence" }, options(noEvidenceId));
  assert.deepEqual(noEvidence.workspace.evidence_references, []);
  const shadowId = workspaceId("3");
  assert.equal((await runtime.createWorkspace({
    workspace_name: "Shadow Workspace",
    ownership_state: "SHADOW"
  }, options(shadowId))).workspace.ownership_state, "SHADOW");

  for (const state of ["CLAIMED", "VERIFIED", "TRANSFER_PENDING"]) {
    await assertRejectsCode(
      () => runtime.createWorkspace({ workspace_name: "Rejected", ownership_state: state }, options(workspaceId("4"))),
      contract.ERROR_CODES.OWNERSHIP_STATE_NOT_OPERATIONAL,
      "WorkspaceContractError"
    );
  }
  for (const [field, value] of Object.entries({
    workspace_id: workspaceId("f"), status: "ACTIVE", workspace_version: 7,
    schema_version: 1, created_at: T1, updated_at: T1, project_relationships: []
  })) {
    await assertRejectsCode(
      () => runtime.createWorkspace({ workspace_name: "Rejected", [field]: value }, options(workspaceId("4"))),
      contract.ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED,
      "WorkspaceContractError"
    );
  }
  await assertRejectsCode(
    () => runtime.createWorkspace({ workspace_name: "Rejected", evidence_references: [evidence("invalid_type")] }, options(workspaceId("4"))),
    contract.ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
    "WorkspaceContractError"
  );

  const collisionStorage = memoryStorage([record(workspaceId("5"))]);
  const retryId = workspaceId("6");
  const retried = await runtime.createWorkspace(
    { workspace_name: "Collision retry" },
    options(retryId, { storage: collisionStorage, generateWorkspaceId: idGenerator(workspaceId("5"), retryId) })
  );
  assert.equal(retried.workspace.workspace_id, retryId);
  assert.equal(collisionStorage.records.get(workspaceId("5")).workspace_name, "Verification Workspace");

  const recoveryStorage = memoryStorage();
  recoveryStorage.inspectWorkspaceStorage = (_root, id) => ({
    workspace_id: id,
    classification: "TEMP_PRESENT",
    states: ["TEMP_PRESENT", "RECOVERY_REQUIRED"],
    recovery_required: true,
    workspace: null,
    canonical: { present: false, valid: false }
  });
  await assertRejectsCode(
    () => runtime.createWorkspace({ workspace_name: "Never written" }, options(workspaceId("7"), {
      storage: recoveryStorage,
      generateWorkspaceId: () => workspaceId("7")
    })),
    runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_ID_GENERATION_EXHAUSTED,
    "WorkspaceRuntimeError"
  );
  assert.equal(recoveryStorage.writes.length, 0);

  let attempts = 0;
  const occupied = memoryStorage([record(workspaceId("8"))]);
  await assertRejectsCode(
    () => runtime.createWorkspace({ workspace_name: "Bounded" }, options(workspaceId("8"), {
      storage: occupied,
      generateWorkspaceId: () => { attempts += 1; return workspaceId("8"); }
    })),
    runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_ID_GENERATION_EXHAUSTED,
    "WorkspaceRuntimeError"
  );
  assert.equal(attempts, 5);

  const releasing = memoryStorage();
  let failOnce = true;
  const originalWrite = releasing.writeWorkspace;
  releasing.writeWorkspace = (...args) => {
    if (failOnce) { failOnce = false; throw new Error("injected creation write failure"); }
    return originalWrite(...args);
  };
  await assertRejectsCode(
    () => runtime.createWorkspace({ workspace_name: "Fails once" }, options(workspaceId("9"), { storage: releasing })),
    runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_PERSISTENCE_FAILED,
    "WorkspaceRuntimeError"
  );
  assert.equal((await runtime.createWorkspace({ workspace_name: "Succeeds next" }, options(workspaceId("9"), {
    storage: releasing
  }))).outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.SUCCESS);
}

async function verifyReadAndInspection() {
  const missingId = workspaceId("a");
  const missingRoot = path.join(TEMP_BASE, "missing-root");
  await assertRejectsCode(
    () => runtime.getWorkspace(missingId, { root: missingRoot }),
    runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_NOT_FOUND,
    "WorkspaceRuntimeError"
  );
  assert.equal(fs.existsSync(missingRoot), false);

  const id = workspaceId("1");
  const before = storage.readWorkspace(ROOT, id);
  const returned = await runtime.getWorkspace(id, { root: ROOT });
  returned.workspace_name = "Caller mutation";
  returned.evidence_references.push(evidence("workspace_creation", "caller"));
  assert.deepEqual(storage.readWorkspace(ROOT, id), before);
  assert.equal((await runtime.getWorkspace(id, { root: ROOT })).workspace_version, 1);

  const inspectionBefore = fs.readFileSync(storage.resolveWorkspacePaths(ROOT, id).canonicalPath);
  const state = await runtime.inspectWorkspaceRuntimeState(id, { root: ROOT });
  assert.deepEqual(state, {
    storage_classification: "HEALTHY",
    recovery_required: false,
    exists: true,
    valid: true,
    workspace_id: id,
    workspace_version: 1,
    status: "CREATING",
    ownership_state: "UNCLAIMED",
    evidence_count: 1
  });
  assert.deepEqual(fs.readFileSync(storage.resolveWorkspacePaths(ROOT, id).canonicalPath), inspectionBefore);

  const corruptId = workspaceId("b");
  const corruptPaths = storage.resolveWorkspacePaths(ROOT, corruptId);
  fs.mkdirSync(corruptPaths.workspaceDirectory, { recursive: true });
  fs.writeFileSync(corruptPaths.canonicalPath, "{ corrupt", "utf8");
  await assertRejectsCode(
    () => runtime.getWorkspace(corruptId, { root: ROOT }),
    runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_RECOVERY_REQUIRED,
    "WorkspaceRuntimeError"
  );
  const corruptState = await runtime.inspectWorkspaceRuntimeState(corruptId, { root: ROOT });
  assert.equal(corruptState.recovery_required, true);
  assert.equal(corruptState.valid, false);
  assert.equal(fs.readFileSync(corruptPaths.canonicalPath, "utf8"), "{ corrupt");
}

async function createLifecycleWorkspace(id, storageOwner, status = "CREATING", version = 1, relationships = []) {
  const value = record(id, { status, workspace_version: version, project_relationships: relationships });
  storageOwner.records.set(id, structuredClone(value));
  return value;
}

async function verifyLifecycle() {
  const transitions = [
    ["CREATING", "ACTIVE", "workspace_activation"],
    ["CREATING", "FAILED", "workspace_failure"],
    ["ACTIVE", "SUSPENDED", "workspace_suspension"],
    ["ACTIVE", "ARCHIVED", "workspace_archive"],
    ["SUSPENDED", "ACTIVE", "workspace_resumption"],
    ["SUSPENDED", "ARCHIVED", "workspace_archive"],
    ["FAILED", "ARCHIVED", "workspace_archive"],
    ["FAILED", "CREATING", "workspace_recovery"]
  ];
  let digit = 0;
  for (const [from, to, evidenceType] of transitions) {
    const id = workspaceId("c");
    const relation = {
      relationship_id: `wpr_${String(digit).padStart(32, "0")}`,
      project_id: `prj_${String(digit + 1).padStart(32, "0")}`,
      relationship_status: "PENDING_ATTACH",
      validation_state: "VALID",
      created_at: T1, updated_at: T1, attached_at: null, detached_at: null, archived_at: null
    };
    const owner = memoryStorage([record(id, { status: from, project_relationships: [relation] })]);
    const result = await runtime.transitionWorkspace(id, {
      target_status: to,
      expected_workspace_version: 1,
      evidence_reference: evidence(evidenceType, String(digit))
    }, { root: "unused", storage: owner, now: () => T2 });
    assert.equal(result.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.SUCCESS);
    assert.equal(result.changed, true);
    assert.equal(result.previous_version, 1);
    assert.equal(result.workspace_version, 2);
    assert.equal(result.previous_status, from);
    assert.equal(result.status, to);
    assert.equal(result.workspace.created_at, T1);
    assert.equal(result.workspace.schema_version, 1);
    assert.deepEqual(result.workspace.project_relationships, [relation]);
    assert.equal(result.workspace.evidence_references.at(-1).reference_type, evidenceType);
    assert.equal(owner.writes.length, 1);
    for (const unsupported of ["activated_at", "suspended_at", "archived_at", "failed_at"]) {
      assert.equal(Object.prototype.hasOwnProperty.call(result.workspace, unsupported), false);
    }
    digit += 1;
  }

  const states = contract.WORKSPACE_LIFECYCLE_STATES;
  for (const from of states) {
    for (const to of states) {
      if (from === to || contract.isWorkspaceTransitionAllowed(from, to)) continue;
      const id = workspaceId("d");
      const owner = memoryStorage([record(id, { status: from })]);
      await assertRejectsCode(
        () => runtime.transitionWorkspace(id, { target_status: to, expected_workspace_version: 1 }, {
          root: "unused", storage: owner, now: () => T2
        }),
        contract.ERROR_CODES.INVALID_WORKSPACE_TRANSITION,
        "WorkspaceContractError"
      );
      assert.equal(owner.writes.length, 0);
    }
  }

  const archivedId = workspaceId("e");
  const archivedOwner = memoryStorage([record(archivedId, { status: "ARCHIVED" })]);
  for (const target of states.filter((state) => state !== "ARCHIVED")) {
    await assertRejectsCode(
      () => runtime.transitionWorkspace(archivedId, { target_status: target, expected_workspace_version: 1 }, {
        root: "unused", storage: archivedOwner
      }),
      contract.ERROR_CODES.INVALID_WORKSPACE_TRANSITION,
      "WorkspaceContractError"
    );
  }

  const activeId = workspaceId("f");
  const activeOwner = memoryStorage([record(activeId, { status: "ACTIVE" })]);
  await assertRejectsCode(
    () => runtime.markWorkspaceFailed(activeId, { expected_workspace_version: 1 }, { root: "unused", storage: activeOwner }),
    contract.ERROR_CODES.INVALID_WORKSPACE_TRANSITION,
    "WorkspaceContractError"
  );
  const noop = await runtime.activateWorkspace(activeId, { expected_workspace_version: 1 }, {
    root: "unused", storage: activeOwner
  });
  assert.equal(noop.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.NOOP);
  assert.equal(noop.changed, false);
  assert.equal(noop.workspace_version, 1);
  assert.equal(noop.persistence, null);
  assert.equal(activeOwner.writes.length, 0);
  await assertRejectsCode(
    () => runtime.activateWorkspace(activeId, {
      expected_workspace_version: 1,
      evidence_reference: evidence("workspace_activation", "same-state")
    }, { root: "unused", storage: activeOwner }),
    contract.ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
    "WorkspaceContractError"
  );

  const mismatchId = workspaceId("0");
  const mismatchOwner = memoryStorage([record(mismatchId)]);
  await assertRejectsCode(
    () => runtime.activateWorkspace(mismatchId, {
      expected_workspace_version: 1,
      evidence_reference: evidence("workspace_suspension")
    }, { root: "unused", storage: mismatchOwner }),
    contract.ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
    "WorkspaceContractError"
  );
  assert.equal(mismatchOwner.writes.length, 0);
}

async function verifyVersioningAndMutations() {
  const id = workspaceId("2");
  const owner = memoryStorage([record(id)]);
  await assertRejectsCode(
    () => runtime.updateWorkspaceName(id, { workspace_name: "Missing version" }, { root: "unused", storage: owner }),
    contract.ERROR_CODES.INVALID_WORKSPACE_VERSION,
    "WorkspaceContractError"
  );
  await assertRejectsCode(
    () => runtime.updateWorkspaceName(id, { workspace_name: "Invalid version", expected_workspace_version: 0 }, {
      root: "unused", storage: owner
    }),
    contract.ERROR_CODES.INVALID_WORKSPACE_VERSION,
    "WorkspaceContractError"
  );
  const stale = await runtime.updateWorkspaceName(id, {
    workspace_name: "Stale", expected_workspace_version: 2
  }, { root: "unused", storage: owner });
  assert.equal(stale.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.CONFLICT);
  assert.equal(stale.code, contract.ERROR_CODES.WORKSPACE_VERSION_CONFLICT);
  assert.equal(stale.persistence, null);

  const named = await runtime.updateWorkspaceName(id, {
    workspace_name: "  Normalized Name  ", expected_workspace_version: 1
  }, { root: "unused", storage: owner, now: () => T2 });
  assert.equal(named.workspace.workspace_name, "Normalized Name");
  assert.equal(named.workspace.workspace_version, 2);
  assert.equal(named.workspace.status, "CREATING");
  assert.equal(named.workspace.updated_at, T2);
  const normalizedNoop = await runtime.updateWorkspaceName(id, {
    workspace_name: " Normalized Name ", expected_workspace_version: 2
  }, { root: "unused", storage: owner, now: () => T3 });
  assert.equal(normalizedNoop.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.NOOP);
  assert.equal(normalizedNoop.workspace_version, 2);
  for (const invalidName of ["   ", "x".repeat(121)]) {
    await assertRejectsCode(
      () => runtime.updateWorkspaceName(id, { workspace_name: invalidName, expected_workspace_version: 2 }, {
        root: "unused", storage: owner
      }),
      contract.ERROR_CODES.INVALID_WORKSPACE_NAME,
      "WorkspaceContractError"
    );
  }

  const firstEvidence = evidence("workspace_creation", "append-1");
  const secondEvidence = evidence("workspace_ownership_shadow", "append-2");
  const appended = await runtime.addWorkspaceEvidenceReference(id, {
    evidence_reference: firstEvidence, expected_workspace_version: 2
  }, { root: "unused", storage: owner, now: () => T3 });
  assert.equal(appended.workspace_version, 3);
  assert.deepEqual(appended.workspace.evidence_references, [firstEvidence]);
  const duplicate = await runtime.addWorkspaceEvidenceReference(id, {
    evidence_reference: { ...firstEvidence }, expected_workspace_version: 3
  }, { root: "unused", storage: owner });
  assert.equal(duplicate.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.NOOP);
  assert.equal(duplicate.workspace_version, 3);
  assert.equal(owner.writes.length, 2);
  const appendedAgain = await runtime.addWorkspaceEvidenceReference(id, {
    evidence_reference: secondEvidence, expected_workspace_version: 3
  }, { root: "unused", storage: owner, now: () => T3 });
  assert.deepEqual(appendedAgain.workspace.evidence_references, [firstEvidence, secondEvidence]);
  await assertRejectsCode(
    () => runtime.addWorkspaceEvidenceReference(id, {
      evidence_reference: { ...evidence("workspace_creation", "bad"), credentials: "secret" },
      expected_workspace_version: 4
    }, { root: "unused", storage: owner }),
    contract.ERROR_CODES.SENSITIVE_EVIDENCE_DATA,
    "WorkspaceContractError"
  );

  const failedWriteId = workspaceId("3");
  const failedOwner = memoryStorage([record(failedWriteId)]);
  failedOwner.writeWorkspace = () => { throw new Error("injected persistence failure"); };
  await assert.rejects(
    () => runtime.updateWorkspaceName(failedWriteId, {
      workspace_name: "Not committed", expected_workspace_version: 1
    }, { root: "unused", storage: failedOwner }),
    (error) => {
      assert.equal(error.code, runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_PERSISTENCE_FAILED);
      assert.equal(error.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.FAILED);
      assert.equal(error.lower_level_error.message, "injected persistence failure");
      return true;
    }
  );
  assert.equal(failedOwner.records.get(failedWriteId).workspace_version, 1);

  const uncertainId = workspaceId("4");
  const uncertainOwner = memoryStorage([record(uncertainId)]);
  const commitThenThrow = uncertainOwner.writeWorkspace;
  uncertainOwner.writeWorkspace = (...args) => {
    commitThenThrow(...args);
    throw new Error("response lost after commit");
  };
  await assertRejectsCode(
    () => runtime.updateWorkspaceName(uncertainId, {
      workspace_name: "Actually committed", expected_workspace_version: 1
    }, { root: "unused", storage: uncertainOwner }),
    runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_PERSISTENCE_FAILED,
    "WorkspaceRuntimeError"
  );
  const retry = await runtime.updateWorkspaceName(uncertainId, {
    workspace_name: "Actually committed", expected_workspace_version: 1
  }, { root: "unused", storage: uncertainOwner });
  assert.equal(retry.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.CONFLICT);
}

async function verifyConcurrencyAndRecovery() {
  const events = [];
  let releaseFirst;
  const firstGate = new Promise((resolve) => { releaseFirst = resolve; });
  const sameFirst = runtime.withWorkspaceMutationLock("same", async () => {
    events.push("same-first-start");
    await firstGate;
    events.push("same-first-end");
  });
  const sameSecond = runtime.withWorkspaceMutationLock("same", async () => events.push("same-second"));
  const different = runtime.withWorkspaceMutationLock("different", async () => events.push("different"));
  await different;
  assert.deepEqual(events, ["same-first-start", "different"]);
  releaseFirst();
  await Promise.all([sameFirst, sameSecond]);
  assert.deepEqual(events, ["same-first-start", "different", "same-first-end", "same-second"]);
  await assert.rejects(() => runtime.withWorkspaceMutationLock("failure", async () => { throw new Error("lock failure"); }));
  assert.equal(await runtime.withWorkspaceMutationLock("failure", async () => "released"), "released");

  const recoveryId = workspaceId("5");
  const recoveryOwner = memoryStorage([record(recoveryId)]);
  recoveryOwner.inspectWorkspaceStorage = () => ({
    workspace_id: recoveryId,
    classification: "BACKUP_AVAILABLE",
    states: ["BACKUP_AVAILABLE", "RECOVERY_REQUIRED"],
    recovery_required: true,
    workspace: null,
    canonical: { present: false, valid: false }
  });
  await assert.rejects(
    () => runtime.updateWorkspaceName(recoveryId, {
      workspace_name: "Blocked", expected_workspace_version: 1
    }, { root: "unused", storage: recoveryOwner }),
    (error) => {
      assert.equal(error.code, runtime.WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_RECOVERY_REQUIRED);
      assert.equal(error.outcome, runtime.WORKSPACE_MUTATION_OUTCOMES.RECOVERY_REQUIRED);
      return true;
    }
  );
  assert.equal(recoveryOwner.writes.length, 0);
}

function verifyBoundaries() {
  const sourcePath = path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/workspace/workspace-runtime.js"
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  const absent = [
    [/(?:require|import)\s*\(?["'](?:node:)?(?:fs|path)["']/, "filesystem import"],
    [/(?:require|import)\s*\(?["'][^"']*(?:frontend|control-center|public\/)/i, "frontend import"],
    [/(?:require|import)\s*\(?["'][^"']*project-identity/i, "Project Identity import"],
    [/\b(?:express|router|app)\s*\.\s*(?:use|get|post|put|patch|delete|route)\s*\(/i, "route registration"],
    [/\b(?:attach|detach)(?:Workspace|Project|Relationship)\s*\(/, "attach or detach implementation"],
    [/\b(?:grant|assign|revoke)(?:Role|Permission|Access)\b/, "role or permission grant"],
    [/\b(?:writeFile|appendFile|rename|unlink|mkdir)(?:Sync)?\s*\(/, "direct file write"],
    [/(?:\/data\/|\\data\\|workspace\.json)/i, "direct storage path"]
  ];
  for (const [pattern, label] of absent) assert.doesNotMatch(source, pattern, label);
  assert.equal(contract.doesWorkspaceStatusGrantAuthorization("ACTIVE"), false);
  assert.match(source, /cross_process_guarantee:\s*false/);
  assert.match(source, /workspace_version_compare_and_swap:\s*false/);
  assert.deepEqual(Object.keys(runtime).sort(), [
    "SINGLE_WRITER_ASSUMPTION", "WORKSPACE_MUTATION_OUTCOMES", "WORKSPACE_RUNTIME_ERROR_CODES",
    "WorkspaceRuntimeError", "activateWorkspace", "addWorkspaceEvidenceReference", "archiveWorkspace",
    "createWorkspace", "getWorkspace", "inspectWorkspaceRuntimeState", "markWorkspaceFailed",
    "resumeWorkspace", "suspendWorkspace", "transitionWorkspace", "updateWorkspaceName",
    "withWorkspaceMutationLock"
  ].sort());
  assert.equal(Object.isFrozen(runtime.WORKSPACE_MUTATION_OUTCOMES), true);
  assert.deepEqual(Object.values(runtime.WORKSPACE_MUTATION_OUTCOMES), [
    "WORKSPACE_MUTATION_SUCCESS", "WORKSPACE_MUTATION_NOOP", "WORKSPACE_MUTATION_CONFLICT",
    "WORKSPACE_MUTATION_RECOVERY_REQUIRED", "WORKSPACE_MUTATION_FAILED"
  ]);
}

async function run() {
  await verifyCreation();
  await verifyReadAndInspection();
  await verifyLifecycle();
  await verifyVersioningAndMutations();
  await verifyConcurrencyAndRecovery();
  verifyBoundaries();
  const relative = path.relative(TEMP_BASE, ROOT);
  assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative), false);
  assert.notEqual(storage.resolveWorkspaceRoot(ROOT), storage.DEFAULT_WORKSPACE_ROOT);
  console.log(JSON.stringify({
    result: "pass",
    temporary_root: ROOT,
    production_data_touched: false,
    checks: {
      creation: "pass",
      read_and_inspection: "pass",
      lifecycle: "pass",
      versioning: "pass",
      name_mutation: "pass",
      evidence_append: "pass",
      concurrency: "pass",
      error_outcomes: "pass",
      authority_boundaries: "pass"
    }
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

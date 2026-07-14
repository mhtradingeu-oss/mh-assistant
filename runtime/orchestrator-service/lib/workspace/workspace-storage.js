"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  validateWorkspaceId,
  validateWorkspaceRecord
} = require("./workspace-contract");

const DEFAULT_WORKSPACE_ROOT = path.resolve(__dirname, "../../../../data/workspaces");
const WORKSPACE_FILE_NAME = "workspace.json";
const WORKSPACE_TEMP_FILE_NAME = "workspace.json.tmp";
const WORKSPACE_BACKUP_FILE_NAME = "workspace.json.backup";
const CORRUPT_FILE_PATTERN = /^workspace\.json\.[0-9]+(?:-[0-9]+)?\.corrupt$/;

const RECOVERY_CLASSIFICATIONS = Object.freeze([
  "HEALTHY",
  "MISSING_NEW",
  "MISSING_AFTER_QUARANTINE",
  "CORRUPT",
  "TEMP_PRESENT",
  "BACKUP_AVAILABLE",
  "RECOVERY_REQUIRED"
]);

const STORAGE_ERROR_CODES = Object.freeze({
  INVALID_ROOT: "WORKSPACE_STORAGE_INVALID_ROOT",
  ROOT_NOT_DIRECTORY: "WORKSPACE_STORAGE_ROOT_NOT_DIRECTORY",
  PATH_OUTSIDE_ROOT: "WORKSPACE_STORAGE_PATH_OUTSIDE_ROOT",
  SYMLINK_FORBIDDEN: "WORKSPACE_STORAGE_SYMLINK_FORBIDDEN",
  WORKSPACE_DIRECTORY_INVALID: "WORKSPACE_STORAGE_WORKSPACE_DIRECTORY_INVALID",
  WORKSPACE_NOT_FOUND: "WORKSPACE_STORAGE_WORKSPACE_NOT_FOUND",
  WORKSPACE_CORRUPT: "WORKSPACE_STORAGE_WORKSPACE_CORRUPT",
  WORKSPACE_ID_MISMATCH: "WORKSPACE_STORAGE_WORKSPACE_ID_MISMATCH",
  TEMP_PRESENT: "WORKSPACE_STORAGE_TEMP_PRESENT",
  WRITE_FAILED: "WORKSPACE_STORAGE_WRITE_FAILED",
  QUARANTINE_NOT_REQUIRED: "WORKSPACE_STORAGE_QUARANTINE_NOT_REQUIRED",
  QUARANTINE_FAILED: "WORKSPACE_STORAGE_QUARANTINE_FAILED",
  BACKUP_NOT_AVAILABLE: "WORKSPACE_STORAGE_BACKUP_NOT_AVAILABLE",
  BACKUP_INVALID: "WORKSPACE_STORAGE_BACKUP_INVALID",
  RECOVERY_CANONICAL_PRESENT: "WORKSPACE_STORAGE_RECOVERY_CANONICAL_PRESENT",
  RECOVERY_FAILED: "WORKSPACE_STORAGE_RECOVERY_FAILED"
});

class WorkspaceStorageError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "WorkspaceStorageError";
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

function fail(code, message, details) {
  throw new WorkspaceStorageError(code, message, details);
}

function resolveWorkspaceRoot(root = DEFAULT_WORKSPACE_ROOT) {
  if (typeof root !== "string" || root.trim() === "") {
    fail(STORAGE_ERROR_CODES.INVALID_ROOT, "Workspace root must be a non-empty path string");
  }
  return path.resolve(root);
}

function assertContained(root, candidate) {
  const relative = path.relative(root, candidate);
  if (relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) {
    return candidate;
  }
  fail(STORAGE_ERROR_CODES.PATH_OUTSIDE_ROOT, "Resolved Workspace path is outside the configured root", {
    root,
    candidate
  });
}

function resolveWorkspacePaths(root, workspaceId) {
  validateWorkspaceId(workspaceId);
  const resolvedRoot = resolveWorkspaceRoot(root);
  const workspaceDirectory = assertContained(resolvedRoot, path.resolve(resolvedRoot, workspaceId));
  return Object.freeze({
    root: resolvedRoot,
    workspaceDirectory,
    canonicalPath: assertContained(resolvedRoot, path.join(workspaceDirectory, WORKSPACE_FILE_NAME)),
    tempPath: assertContained(resolvedRoot, path.join(workspaceDirectory, WORKSPACE_TEMP_FILE_NAME)),
    backupPath: assertContained(resolvedRoot, path.join(workspaceDirectory, WORKSPACE_BACKUP_FILE_NAME))
  });
}

function lstatIfPresent(targetPath) {
  try {
    return fs.lstatSync(targetPath);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function assertNonSymlinkDirectory(targetPath, code) {
  const stat = lstatIfPresent(targetPath);
  if (!stat) return false;
  if (stat.isSymbolicLink()) {
    fail(STORAGE_ERROR_CODES.SYMLINK_FORBIDDEN, "Workspace storage cannot traverse symbolic links", {
      path: targetPath
    });
  }
  if (!stat.isDirectory()) fail(code, "Workspace storage path must be a directory", { path: targetPath });
  return true;
}

function inspectRegularFile(targetPath) {
  const stat = lstatIfPresent(targetPath);
  if (!stat) return Object.freeze({ present: false, regular: false, symlink: false });
  return Object.freeze({
    present: true,
    regular: stat.isFile() && !stat.isSymbolicLink(),
    symlink: stat.isSymbolicLink()
  });
}

function parseAndValidateWorkspaceFile(filePath, expectedWorkspaceId) {
  const file = inspectRegularFile(filePath);
  if (!file.present) return Object.freeze({ present: false, valid: false, record: null, error: null });
  if (!file.regular) {
    return Object.freeze({
      present: true,
      valid: false,
      record: null,
      error: Object.freeze({
        code: file.symlink ? STORAGE_ERROR_CODES.SYMLINK_FORBIDDEN : STORAGE_ERROR_CODES.WORKSPACE_CORRUPT,
        message: "Workspace record is not a regular non-symlink file"
      })
    });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const record = JSON.parse(raw);
    validateWorkspaceRecord(record);
    if (record.workspace_id !== expectedWorkspaceId) {
      fail(STORAGE_ERROR_CODES.WORKSPACE_ID_MISMATCH, "Workspace record ID does not match its directory", {
        expected_workspace_id: expectedWorkspaceId,
        record_workspace_id: record.workspace_id
      });
    }
    return Object.freeze({ present: true, valid: true, record, error: null });
  } catch (error) {
    return Object.freeze({
      present: true,
      valid: false,
      record: null,
      error: Object.freeze({ code: error.code || STORAGE_ERROR_CODES.WORKSPACE_CORRUPT, message: error.message })
    });
  }
}

function listCorruptFiles(workspaceDirectory) {
  if (!assertNonSymlinkDirectory(workspaceDirectory, STORAGE_ERROR_CODES.WORKSPACE_DIRECTORY_INVALID)) return [];
  return fs.readdirSync(workspaceDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.isSymbolicLink() && CORRUPT_FILE_PATTERN.test(entry.name))
    .map((entry) => path.join(workspaceDirectory, entry.name))
    .sort();
}

function inspectWorkspaceStorage(root, workspaceId) {
  const paths = resolveWorkspacePaths(root, workspaceId);
  const rootExists = assertNonSymlinkDirectory(paths.root, STORAGE_ERROR_CODES.ROOT_NOT_DIRECTORY);
  if (!rootExists) {
    return Object.freeze({
      workspace_id: workspaceId,
      classification: "MISSING_NEW",
      states: Object.freeze(["MISSING_NEW"]),
      recovery_required: false,
      workspace: null,
      paths,
      canonical: Object.freeze({ present: false, valid: false }),
      temp: Object.freeze({ present: false }),
      backup: Object.freeze({ present: false, valid: false }),
      corrupt_files: Object.freeze([])
    });
  }

  const directoryExists = assertNonSymlinkDirectory(
    paths.workspaceDirectory,
    STORAGE_ERROR_CODES.WORKSPACE_DIRECTORY_INVALID
  );
  if (!directoryExists) {
    return Object.freeze({
      workspace_id: workspaceId,
      classification: "MISSING_NEW",
      states: Object.freeze(["MISSING_NEW"]),
      recovery_required: false,
      workspace: null,
      paths,
      canonical: Object.freeze({ present: false, valid: false }),
      temp: Object.freeze({ present: false }),
      backup: Object.freeze({ present: false, valid: false }),
      corrupt_files: Object.freeze([])
    });
  }

  const canonical = parseAndValidateWorkspaceFile(paths.canonicalPath, workspaceId);
  const tempFile = inspectRegularFile(paths.tempPath);
  const backup = parseAndValidateWorkspaceFile(paths.backupPath, workspaceId);
  const corruptFiles = listCorruptFiles(paths.workspaceDirectory);
  const states = [];
  let classification;

  if (canonical.present && canonical.valid) {
    classification = "HEALTHY";
    states.push("HEALTHY");
  } else if (canonical.present) {
    classification = "CORRUPT";
    states.push("CORRUPT");
  } else if (corruptFiles.length > 0) {
    classification = "MISSING_AFTER_QUARANTINE";
    states.push("MISSING_AFTER_QUARANTINE");
  } else if (tempFile.present) {
    classification = "TEMP_PRESENT";
  } else if (backup.present && backup.valid) {
    classification = "BACKUP_AVAILABLE";
  } else if (backup.present) {
    classification = "CORRUPT";
    states.push("CORRUPT");
  } else {
    classification = "MISSING_NEW";
    states.push("MISSING_NEW");
  }

  if (tempFile.present) states.push("TEMP_PRESENT");
  if (backup.present && backup.valid) states.push("BACKUP_AVAILABLE");
  const recoveryRequired = classification === "CORRUPT"
    || classification === "MISSING_AFTER_QUARANTINE"
    || classification === "TEMP_PRESENT"
    || classification === "BACKUP_AVAILABLE"
    || tempFile.present;
  if (recoveryRequired) states.push("RECOVERY_REQUIRED");

  return Object.freeze({
    workspace_id: workspaceId,
    classification,
    states: Object.freeze([...new Set(states)]),
    recovery_required: recoveryRequired,
    workspace: canonical.valid ? canonical.record : null,
    paths,
    canonical,
    temp: tempFile,
    backup,
    corrupt_files: Object.freeze(corruptFiles)
  });
}

function discoverWorkspaceRecords(root, includeDiagnostics) {
  const resolvedRoot = resolveWorkspaceRoot(root);
  const diagnostics = [];
  const workspaces = [];
  const rootStat = lstatIfPresent(resolvedRoot);
  if (!rootStat) return { workspaces, diagnostics };
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    diagnostics.push(Object.freeze({ entry: resolvedRoot, reason: "INVALID_OR_SYMLINK_ROOT" }));
    return { workspaces, diagnostics };
  }

  for (const entry of fs.readdirSync(resolvedRoot, { withFileTypes: true })) {
    const entryPath = path.join(resolvedRoot, entry.name);
    if (entry.name.startsWith(".")) {
      diagnostics.push(Object.freeze({ entry: entry.name, reason: "HIDDEN_ENTRY" }));
      continue;
    }
    if (!entry.isDirectory() || entry.isSymbolicLink()) {
      diagnostics.push(Object.freeze({ entry: entry.name, reason: "NOT_REAL_DIRECTORY" }));
      continue;
    }
    try {
      validateWorkspaceId(entry.name);
    } catch (error) {
      diagnostics.push(Object.freeze({ entry: entry.name, reason: "MALFORMED_WORKSPACE_ID" }));
      continue;
    }
    try {
      const stat = fs.lstatSync(entryPath);
      if (stat.isSymbolicLink() || !stat.isDirectory()) {
        diagnostics.push(Object.freeze({ entry: entry.name, reason: "NOT_REAL_DIRECTORY" }));
        continue;
      }
      const inspection = inspectWorkspaceStorage(resolvedRoot, entry.name);
      if (inspection.classification === "HEALTHY") {
        workspaces.push(inspection.workspace);
      } else {
        diagnostics.push(Object.freeze({
          entry: entry.name,
          reason: inspection.classification,
          states: inspection.states
        }));
      }
    } catch (error) {
      diagnostics.push(Object.freeze({ entry: entry.name, reason: error.code || "INSPECTION_FAILED" }));
    }
  }

  workspaces.sort((left, right) => left.workspace_id.localeCompare(right.workspace_id));
  return includeDiagnostics ? { workspaces, diagnostics } : { workspaces, diagnostics: [] };
}

function discoverWorkspaces(root) {
  return discoverWorkspaceRecords(root, false).workspaces;
}

function discoverWorkspacesWithDiagnostics(root) {
  return discoverWorkspaceRecords(root, true);
}

function readWorkspace(root, workspaceId) {
  const inspection = inspectWorkspaceStorage(root, workspaceId);
  if (inspection.classification === "HEALTHY") return inspection.workspace;
  if (inspection.classification === "MISSING_NEW") return null;
  fail(STORAGE_ERROR_CODES.WORKSPACE_CORRUPT, "Workspace requires explicit storage recovery", {
    workspace_id: workspaceId,
    classification: inspection.classification,
    states: inspection.states,
    error: inspection.canonical.error || null
  });
}

function ensureWritableDirectory(targetPath, code) {
  const stat = lstatIfPresent(targetPath);
  if (stat) {
    if (stat.isSymbolicLink()) {
      fail(STORAGE_ERROR_CODES.SYMLINK_FORBIDDEN, "Workspace writes cannot traverse symbolic links", {
        path: targetPath
      });
    }
    if (!stat.isDirectory()) fail(code, "Workspace write path must be a directory", { path: targetPath });
    return;
  }
  fs.mkdirSync(targetPath, { recursive: false, mode: 0o700 });
}

function fsyncFileBestEffort(filePath) {
  let descriptor;
  try {
    descriptor = fs.openSync(filePath, "r+");
    fs.fsyncSync(descriptor);
  } catch (_) {
    // Durability flush is best-effort and does not create a transaction guarantee.
  } finally {
    if (descriptor !== undefined) {
      try { fs.closeSync(descriptor); } catch (_) { /* best-effort close */ }
    }
  }
}

function writeWorkspace(root, workspace) {
  validateWorkspaceRecord(workspace);
  const paths = resolveWorkspacePaths(root, workspace.workspace_id);
  const parent = path.dirname(paths.root);
  if (!lstatIfPresent(paths.root)) {
    if (!lstatIfPresent(parent)) fs.mkdirSync(parent, { recursive: true, mode: 0o700 });
    ensureWritableDirectory(paths.root, STORAGE_ERROR_CODES.ROOT_NOT_DIRECTORY);
  } else {
    ensureWritableDirectory(paths.root, STORAGE_ERROR_CODES.ROOT_NOT_DIRECTORY);
  }
  ensureWritableDirectory(paths.workspaceDirectory, STORAGE_ERROR_CODES.WORKSPACE_DIRECTORY_INVALID);

  const temp = inspectRegularFile(paths.tempPath);
  if (temp.present) {
    fail(STORAGE_ERROR_CODES.TEMP_PRESENT, "A Workspace temp file already requires reconciliation", {
      temp_path: paths.tempPath
    });
  }

  const canonical = parseAndValidateWorkspaceFile(paths.canonicalPath, workspace.workspace_id);
  if (canonical.present && !canonical.valid) {
    fail(STORAGE_ERROR_CODES.WORKSPACE_CORRUPT, "Cannot replace a corrupt Workspace without quarantine", {
      canonical_path: paths.canonicalPath,
      error: canonical.error
    });
  }

  const serialized = `${JSON.stringify(workspace, null, 2)}\n`;
  let backupAttempted = false;
  let backupCreated = false;
  let backupError = null;
  try {
    fs.writeFileSync(paths.tempPath, serialized, { encoding: "utf8", flag: "wx", mode: 0o600 });
    fsyncFileBestEffort(paths.tempPath);

    if (canonical.present) {
      backupAttempted = true;
      try {
        const backupFile = inspectRegularFile(paths.backupPath);
        if (backupFile.present && !backupFile.regular) {
          throw new Error("Backup path is not a regular non-symlink file");
        }
        fs.copyFileSync(paths.canonicalPath, paths.backupPath);
        backupCreated = true;
      } catch (error) {
        backupError = error.message;
      }
    }

    fs.renameSync(paths.tempPath, paths.canonicalPath);
  } catch (error) {
    try {
      const tempFile = inspectRegularFile(paths.tempPath);
      if (tempFile.present && tempFile.regular) fs.unlinkSync(paths.tempPath);
    } catch (_) { /* recovery classification handles cleanup failures */ }
    fail(STORAGE_ERROR_CODES.WRITE_FAILED, `Atomic Workspace replacement failed: ${error.message}`, {
      canonical_path: paths.canonicalPath,
      temp_path: paths.tempPath
    });
  }

  return Object.freeze({
    workspace_id: workspace.workspace_id,
    canonical_path: paths.canonicalPath,
    backup: Object.freeze({ attempted: backupAttempted, created: backupCreated, error: backupError })
  });
}

function quarantineCorruptWorkspace(root, workspaceId, options = {}) {
  const inspection = inspectWorkspaceStorage(root, workspaceId);
  if (inspection.classification !== "CORRUPT") {
    fail(STORAGE_ERROR_CODES.QUARANTINE_NOT_REQUIRED, "Only a corrupt canonical Workspace may be quarantined", {
      classification: inspection.classification
    });
  }
  const timestamp = typeof options.now === "function" ? options.now() : Date.now();
  if (!Number.isSafeInteger(timestamp) || timestamp < 0) {
    fail(STORAGE_ERROR_CODES.QUARANTINE_FAILED, "Quarantine timestamp must be a non-negative safe integer");
  }
  let sequence = 0;
  let quarantinePath;
  do {
    const suffix = sequence === 0 ? `${timestamp}` : `${timestamp}-${sequence}`;
    quarantinePath = assertContained(
      inspection.paths.root,
      path.join(inspection.paths.workspaceDirectory, `${WORKSPACE_FILE_NAME}.${suffix}.corrupt`)
    );
    sequence += 1;
  } while (lstatIfPresent(quarantinePath));

  try {
    fs.renameSync(inspection.paths.canonicalPath, quarantinePath);
  } catch (error) {
    fail(STORAGE_ERROR_CODES.QUARANTINE_FAILED, `Workspace quarantine failed: ${error.message}`);
  }
  const after = inspectWorkspaceStorage(root, workspaceId);
  return Object.freeze({
    workspace_id: workspaceId,
    quarantine_path: quarantinePath,
    classification: after.classification,
    states: after.states,
    recovery_required: after.recovery_required
  });
}

function inspectWorkspaceBackup(root, workspaceId) {
  const inspection = inspectWorkspaceStorage(root, workspaceId);
  return Object.freeze({
    workspace_id: workspaceId,
    classification: inspection.backup.present && inspection.backup.valid
      ? "BACKUP_AVAILABLE"
      : inspection.backup.present ? "CORRUPT" : "MISSING_NEW",
    available: inspection.backup.present,
    valid: inspection.backup.valid,
    workspace: inspection.backup.valid ? inspection.backup.record : null,
    error: inspection.backup.error || null,
    backup_path: inspection.paths.backupPath
  });
}

function recoverWorkspaceFromBackup(root, workspaceId, options = {}) {
  const inspection = inspectWorkspaceStorage(root, workspaceId);
  if (inspection.canonical.present) {
    fail(
      STORAGE_ERROR_CODES.RECOVERY_CANONICAL_PRESENT,
      "Explicit backup recovery requires the canonical Workspace to be absent"
    );
  }
  if (inspection.temp.present) {
    fail(STORAGE_ERROR_CODES.TEMP_PRESENT, "Explicit temp reconciliation is required before backup recovery");
  }
  const backup = inspectWorkspaceBackup(root, workspaceId);
  if (!backup.available) fail(STORAGE_ERROR_CODES.BACKUP_NOT_AVAILABLE, "No Workspace backup is available");
  if (!backup.valid) fail(STORAGE_ERROR_CODES.BACKUP_INVALID, "Workspace backup is invalid", backup.error);

  const now = typeof options.now === "function" ? options.now() : new Date().toISOString();
  const referenceId = typeof options.referenceId === "string"
    ? options.referenceId
    : `workspace-recovery-${crypto.randomUUID().replace(/-/g, "").toLowerCase()}`;
  const recovered = {
    ...backup.workspace,
    workspace_version: backup.workspace.workspace_version + 1,
    status: "FAILED",
    updated_at: now,
    project_relationships: backup.workspace.project_relationships.map((item) => ({ ...item })),
    evidence_references: [
      ...backup.workspace.evidence_references.map((item) => ({ ...item })),
      {
        reference_type: "workspace_recovery",
        reference_id: referenceId,
        source_owner: "workspace-storage",
        recorded_at: now
      }
    ]
  };
  validateWorkspaceRecord(recovered);
  try {
    const writeResult = writeWorkspace(root, recovered);
    return Object.freeze({
      workspace: recovered,
      classification: "HEALTHY",
      recovered_from: backup.backup_path,
      write: writeResult
    });
  } catch (error) {
    if (error instanceof WorkspaceStorageError) throw error;
    fail(STORAGE_ERROR_CODES.RECOVERY_FAILED, `Workspace recovery failed: ${error.message}`);
  }
}

module.exports = Object.freeze({
  DEFAULT_WORKSPACE_ROOT,
  WORKSPACE_FILE_NAME,
  WORKSPACE_TEMP_FILE_NAME,
  WORKSPACE_BACKUP_FILE_NAME,
  RECOVERY_CLASSIFICATIONS,
  STORAGE_ERROR_CODES,
  WorkspaceStorageError,
  resolveWorkspaceRoot,
  resolveWorkspacePaths,
  discoverWorkspaces,
  discoverWorkspacesWithDiagnostics,
  inspectWorkspaceStorage,
  readWorkspace,
  writeWorkspace,
  quarantineCorruptWorkspace,
  inspectWorkspaceBackup,
  recoverWorkspaceFromBackup
});

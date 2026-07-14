"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  validateProjectId,
  validateWorkspaceId,
  validateProjectRelationshipId
} = require("../workspace/workspace-contract");
const committedProjectIdentity = require("./project-identity");

const PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION = 1;
const PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER = "workspace-runtime";
const PROJECT_WORKSPACE_PROJECTION_STATUSES = Object.freeze([
  "ATTACHED",
  "DETACHED",
  "ARCHIVED"
]);
const PROJECT_WORKSPACE_PROJECTION_FIELDS = Object.freeze([
  "projection_schema_version",
  "workspace_id",
  "relationship_id",
  "relationship_status",
  "workspace_version",
  "projected_at",
  "authoritative",
  "source_owner"
]);
const PROJECT_WORKSPACE_PROJECTION_FINGERPRINT_FIELDS = Object.freeze([
  "projection_schema_version",
  "workspace_id",
  "relationship_id",
  "relationship_status",
  "workspace_version"
]);

const PROJECT_WORKSPACE_PROJECTION_OUTCOMES = Object.freeze({
  WRITE_SUCCESS: "PROJECT_PROJECTION_WRITE_SUCCESS",
  WRITE_NOOP: "PROJECT_PROJECTION_WRITE_NOOP",
  CONFLICT: "PROJECT_PROJECTION_CONFLICT",
  STALE: "PROJECT_PROJECTION_STALE",
  RECOVERY_REQUIRED: "PROJECT_PROJECTION_RECOVERY_REQUIRED",
  UNRESOLVED: "PROJECT_PROJECTION_UNRESOLVED",
  FAILED: "PROJECT_PROJECTION_FAILED"
});

const PROJECT_WORKSPACE_PROJECTION_ERROR_CODES = Object.freeze({
  INPUT_INVALID: "PROJECT_PROJECTION_INPUT_INVALID",
  SCHEMA_INVALID: "PROJECT_PROJECTION_SCHEMA_INVALID",
  UNKNOWN_FIELD: "PROJECT_PROJECTION_UNKNOWN_FIELD",
  STATUS_INVALID: "PROJECT_PROJECTION_STATUS_INVALID",
  VERSION_INVALID: "PROJECT_PROJECTION_VERSION_INVALID",
  SOURCE_INVALID: "PROJECT_PROJECTION_SOURCE_INVALID",
  AUTHORITY_FLAG_INVALID: "PROJECT_PROJECTION_AUTHORITY_FLAG_INVALID",
  PROJECT_NOT_FOUND: "PROJECT_PROJECTION_PROJECT_NOT_FOUND",
  PROJECT_IDENTITY_INVALID: "PROJECT_PROJECTION_PROJECT_IDENTITY_INVALID",
  PROJECT_ID_COLLISION: "PROJECT_PROJECTION_PROJECT_ID_COLLISION",
  PROJECTION_MISSING: "PROJECT_PROJECTION_MISSING",
  EXPECTATION_REQUIRED: "PROJECT_PROJECTION_EXPECTATION_REQUIRED",
  EXPECTATION_MISMATCH: "PROJECT_PROJECTION_EXPECTATION_MISMATCH",
  CONFLICT: "PROJECT_PROJECTION_CONFLICT",
  STALE: "PROJECT_PROJECTION_STALE",
  TEMP_PRESENT: "PROJECT_PROJECTION_TEMP_PRESENT",
  RECOVERY_REQUIRED: "PROJECT_PROJECTION_RECOVERY_REQUIRED",
  PERSISTENCE_FAILED: "PROJECT_PROJECTION_PERSISTENCE_FAILED",
  UNCERTAIN_COMMIT: "PROJECT_PROJECTION_UNCERTAIN_COMMIT",
  PATH_OUTSIDE_ROOT: "PROJECT_PROJECTION_PATH_OUTSIDE_ROOT",
  SYMLINK_FORBIDDEN: "PROJECT_PROJECTION_SYMLINK_FORBIDDEN"
});

const SINGLE_WRITER_ASSUMPTION = Object.freeze({
  process_local_per_project_mutex: true,
  synchronous_final_reread_to_rename: true,
  cross_process_guarantee: false,
  transactional_guarantee: false,
  multiprocess_writer_certified: false,
  required_writer_model: "SINGLE_WRITER"
});

const INSPECTION_CLASSIFICATIONS = Object.freeze(["MATCH", "MISSING", "STALE", "CONFLICTING"]);
const projectMutationTails = new Map();

class ProjectWorkspaceProjectionError extends Error {
  constructor(code, message, details, options = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "ProjectWorkspaceProjectionError";
    this.code = code;
    this.outcome = options.outcome || PROJECT_WORKSPACE_PROJECTION_OUTCOMES.FAILED;
    if (details !== undefined) this.details = deepCopy(details);
    if (options.persistence !== undefined) this.persistence = deepCopy(options.persistence);
    if (options.lower_level_error !== undefined) this.lower_level_error = deepCopy(options.lower_level_error);
  }
}

function deepCopy(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

function error(code, message, details, options) {
  return new ProjectWorkspaceProjectionError(code, message, details, options);
}

function lowerLevelError(cause) {
  return {
    name: cause && cause.name,
    code: cause && cause.code,
    message: cause && cause.message,
    details: deepCopy(cause && cause.details)
  };
}

function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, `${label} must be a plain object`);
  }
}

function assertExactFields(value, fields, label, code = PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.UNKNOWN_FIELD) {
  assertPlainObject(value, label);
  const keys = Object.keys(value);
  for (const key of keys) {
    if (!fields.includes(key)) throw error(code, `${label} contains unknown field: ${key}`, { field: key });
  }
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(value, field)) {
      throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SCHEMA_INVALID, `${label} is missing field: ${field}`, {
        field
      });
    }
  }
}

function validateUtcTimestamp(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && !Number.isNaN(Date.parse(value));
}

function mapContractValidation(validation, code, field) {
  try {
    validation();
  } catch (cause) {
    throw error(code, `workspace_projection ${field} is invalid`, { field }, {
      cause,
      lower_level_error: lowerLevelError(cause)
    });
  }
}

function validateProjectWorkspaceProjection(projection) {
  assertExactFields(projection, PROJECT_WORKSPACE_PROJECTION_FIELDS, "workspace_projection");
  if (projection.projection_schema_version !== PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION) {
    throw error(
      PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SCHEMA_INVALID,
      "workspace_projection projection_schema_version must equal 1"
    );
  }
  mapContractValidation(
    () => validateWorkspaceId(projection.workspace_id),
    PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SCHEMA_INVALID,
    "workspace_id"
  );
  mapContractValidation(
    () => validateProjectRelationshipId(projection.relationship_id),
    PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SCHEMA_INVALID,
    "relationship_id"
  );
  if (!PROJECT_WORKSPACE_PROJECTION_STATUSES.includes(projection.relationship_status)) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.STATUS_INVALID, "workspace_projection status is invalid", {
      relationship_status: projection.relationship_status
    });
  }
  if (!Number.isSafeInteger(projection.workspace_version) || projection.workspace_version < 1) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.VERSION_INVALID, "workspace_projection version is invalid");
  }
  if (!validateUtcTimestamp(projection.projected_at)) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SCHEMA_INVALID, "workspace_projection projected_at is invalid");
  }
  if (projection.authoritative !== false) {
    throw error(
      PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.AUTHORITY_FLAG_INVALID,
      "workspace_projection must be explicitly non-authoritative"
    );
  }
  if (projection.source_owner !== PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SOURCE_INVALID, "workspace_projection source_owner is invalid");
  }
  return deepCopy(projection);
}

function createProjectWorkspaceProjectionFingerprint(projection) {
  const valid = validateProjectWorkspaceProjection(projection);
  const fingerprint = {};
  for (const field of PROJECT_WORKSPACE_PROJECTION_FINGERPRINT_FIELDS) fingerprint[field] = valid[field];
  return Object.freeze(fingerprint);
}

function validateFingerprint(value, label = "expected_current_projection") {
  assertExactFields(value, PROJECT_WORKSPACE_PROJECTION_FINGERPRINT_FIELDS, label);
  const syntheticProjection = {
    ...value,
    projected_at: "2000-01-01T00:00:00.000Z",
    authoritative: false,
    source_owner: PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER
  };
  validateProjectWorkspaceProjection(syntheticProjection);
  return deepCopy(value);
}

function sameFingerprint(left, right) {
  return PROJECT_WORKSPACE_PROJECTION_FINGERPRINT_FIELDS.every((field) => left[field] === right[field]);
}

function normalizeOptions(options) {
  if (options === undefined) return {};
  assertPlainObject(options, "options");
  return options;
}

function dependencies(options) {
  const normalized = normalizeOptions(options);
  const filesystem = normalized.filesystem || fs;
  const projectIdentity = normalized.projectIdentity || committedProjectIdentity;
  const now = normalized.now || (() => new Date().toISOString());
  if (typeof projectIdentity.findProjectById !== "function"
    || typeof projectIdentity.resolveProjectIdentityPaths !== "function"
    || typeof projectIdentity.validateProjectIdentityRecord !== "function") {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, "Project Identity owner is incomplete");
  }
  if (typeof now !== "function") {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, "now must be a function");
  }
  return {
    filesystem,
    projectIdentity,
    projectsRoot: normalized.projectsRoot === undefined
      ? committedProjectIdentity.DEFAULT_PROJECTS_ROOT
      : normalized.projectsRoot,
    now,
    hooks: normalized.hooks || {}
  };
}

function validateProjectIdForRuntime(projectId) {
  mapContractValidation(
    () => validateProjectId(projectId),
    PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_IDENTITY_INVALID,
    "project_id"
  );
  return projectId;
}

function mapIdentityError(cause) {
  const identityCodes = committedProjectIdentity.PROJECT_IDENTITY_ERROR_CODES;
  let code = PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_IDENTITY_INVALID;
  let outcome = PROJECT_WORKSPACE_PROJECTION_OUTCOMES.FAILED;
  if (cause && cause.code === identityCodes.PROJECT_ID_COLLISION) {
    code = PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_ID_COLLISION;
    outcome = PROJECT_WORKSPACE_PROJECTION_OUTCOMES.CONFLICT;
  } else if (cause && cause.code === identityCodes.PROJECT_NOT_FOUND) {
    code = PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_NOT_FOUND;
    outcome = PROJECT_WORKSPACE_PROJECTION_OUTCOMES.UNRESOLVED;
  } else if (cause && cause.code === identityCodes.PROJECT_PATH_OUTSIDE_ROOT) {
    code = PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PATH_OUTSIDE_ROOT;
  } else if (cause && cause.code === identityCodes.PROJECT_SYMLINK_FORBIDDEN) {
    code = PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SYMLINK_FORBIDDEN;
    outcome = PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED;
  }
  throw error(code, `Project identity resolution failed: ${cause.message}`, undefined, {
    cause,
    outcome,
    lower_level_error: lowerLevelError(cause)
  });
}

function resolveProject(projectId, deps) {
  validateProjectIdForRuntime(projectId);
  let resolution;
  try {
    resolution = deps.projectIdentity.findProjectById(projectId, { projectsRoot: deps.projectsRoot });
  } catch (cause) {
    mapIdentityError(cause);
  }
  if (!resolution || resolution.resolution !== "RESOLVED" || !resolution.project) {
    throw error(
      PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_NOT_FOUND,
      "Project ID is unresolved",
      { project_id: projectId },
      { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.UNRESOLVED }
    );
  }
  let paths;
  try {
    paths = deps.projectIdentity.resolveProjectIdentityPaths(resolution.project.project_slug, {
      projectsRoot: deps.projectsRoot
    });
  } catch (cause) {
    mapIdentityError(cause);
  }
  return { resolution, paths };
}

function lstatIfPresent(filesystem, targetPath) {
  try {
    return filesystem.lstatSync(targetPath);
  } catch (cause) {
    if (cause.code === "ENOENT") return null;
    throw cause;
  }
}

function assertContained(root, candidate) {
  const absoluteRoot = path.resolve(root);
  const absoluteCandidate = path.resolve(candidate);
  const relative = path.relative(absoluteRoot, absoluteCandidate);
  if (relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) {
    return absoluteCandidate;
  }
  throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PATH_OUTSIDE_ROOT, "Project path escaped its root", {
    root: absoluteRoot,
    candidate: absoluteCandidate
  }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED });
}

function trustedPaths(resolved, deps) {
  const projectsRoot = assertContained(deps.projectsRoot, resolved.paths.projectsRoot);
  const projectDirectory = assertContained(projectsRoot, resolved.paths.projectDirectory);
  const projectFile = assertContained(projectsRoot, resolved.paths.projectFile);
  const tempFile = assertContained(projectsRoot, path.join(projectDirectory, "project.json.workspace-projection.tmp"));
  const backupFile = assertContained(projectsRoot, path.join(projectDirectory, "project.json.backup"));
  return { projectsRoot, projectDirectory, projectFile, tempFile, backupFile };
}

function assertRegularPathState(paths, deps, includeRecoveryFiles) {
  const { filesystem } = deps;
  for (const [target, type] of [
    [paths.projectsRoot, "directory"],
    [paths.projectDirectory, "directory"],
    [paths.projectFile, "file"]
  ]) {
    const stat = lstatIfPresent(filesystem, target);
    if (!stat) {
      throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_NOT_FOUND, "Project path is missing", {
        path: target
      }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.UNRESOLVED });
    }
    if (stat.isSymbolicLink()) {
      throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SYMLINK_FORBIDDEN, "Project paths cannot be symlinks", {
        path: target
      }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED });
    }
    if ((type === "directory" && !stat.isDirectory()) || (type === "file" && !stat.isFile())) {
      throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.RECOVERY_REQUIRED, "Project path type is invalid", {
        path: target,
        expected: type
      }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED });
    }
  }
  if (!includeRecoveryFiles) return;
  const tempStat = lstatIfPresent(filesystem, paths.tempFile);
  if (tempStat) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.TEMP_PRESENT, "Projection temp file requires recovery", {
      temp_file: paths.tempFile
    }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED });
  }
  const backupStat = lstatIfPresent(filesystem, paths.backupFile);
  if (backupStat && (backupStat.isSymbolicLink() || !backupStat.isFile())) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.RECOVERY_REQUIRED, "Projection backup state is invalid", {
      backup_file: paths.backupFile
    }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED });
  }
}

function readRecord(paths, deps) {
  assertRegularPathState(paths, deps, false);
  let record;
  try {
    record = JSON.parse(deps.filesystem.readFileSync(paths.projectFile, "utf8"));
  } catch (cause) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.RECOVERY_REQUIRED, "Project record is invalid JSON", {
      project_file: paths.projectFile
    }, {
      cause,
      outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED,
      lower_level_error: lowerLevelError(cause)
    });
  }
  if (!isPlainObject(record)) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.RECOVERY_REQUIRED, "Project record must be an object", {
      project_file: paths.projectFile
    }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED });
  }
  let identity;
  try {
    identity = deps.projectIdentity.validateProjectIdentityRecord(record);
  } catch (cause) {
    mapIdentityError(cause);
  }
  if (!identity || identity.state === "MISSING") {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_IDENTITY_INVALID, "Project identity is missing");
  }
  return { record, identity };
}

function verifyResolvedIdentity(projectId, resolved, recordRead) {
  if (recordRead.identity.project_id !== projectId) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_IDENTITY_INVALID, "Resolved Project identity changed", {
      expected_project_id: projectId,
      actual_project_id: recordRead.identity.project_id
    }, { outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.CONFLICT });
  }
  return resolved.resolution.project.project_slug;
}

async function withProjectRecordMutationLock(projectId, operation) {
  validateProjectIdForRuntime(projectId);
  if (typeof operation !== "function") {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, "operation must be a function");
  }
  const previous = projectMutationTails.get(projectId) || Promise.resolve();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const tail = previous.catch(() => undefined).then(() => gate);
  projectMutationTails.set(projectId, tail);
  await previous.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (projectMutationTails.get(projectId) === tail) projectMutationTails.delete(projectId);
  }
}

function readProjectWorkspaceProjection(projectId, options) {
  const deps = dependencies(options);
  const resolved = resolveProject(projectId, deps);
  const paths = trustedPaths(resolved, deps);
  const recordRead = readRecord(paths, deps);
  verifyResolvedIdentity(projectId, resolved, recordRead);
  if (!Object.prototype.hasOwnProperty.call(recordRead.record, "workspace_projection")) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECTION_MISSING, "Project has no workspace_projection", {
      project_id: projectId
    });
  }
  const projection = validateProjectWorkspaceProjection(recordRead.record.workspace_projection);
  return Object.freeze({
    project_id: projectId,
    project_slug: resolved.resolution.project.project_slug,
    workspace_projection: deepCopy(projection),
    projection_fingerprint: createProjectWorkspaceProjectionFingerprint(projection)
  });
}

function compareProjection(stored, expected) {
  const storedFingerprint = createProjectWorkspaceProjectionFingerprint(stored);
  const expectedFingerprint = createProjectWorkspaceProjectionFingerprint(expected);
  if (sameFingerprint(storedFingerprint, expectedFingerprint)) return "MATCH";
  const sameAuthority = stored.workspace_id === expected.workspace_id
    && stored.relationship_id === expected.relationship_id;
  if (!sameAuthority) return "CONFLICTING";
  if (stored.workspace_version < expected.workspace_version) return "STALE";
  return "CONFLICTING";
}

function inspectProjectWorkspaceProjection(input, options) {
  assertPlainObject(input, "inspection input");
  const allowed = ["project_id", "expected_projection"];
  for (const field of Object.keys(input)) {
    if (!allowed.includes(field)) {
      throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, `inspection input contains unknown field: ${field}`);
    }
  }
  if (!Object.prototype.hasOwnProperty.call(input, "project_id")) {
    throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, "inspection input requires project_id");
  }
  const deps = dependencies(options);
  const resolved = resolveProject(input.project_id, deps);
  const paths = trustedPaths(resolved, deps);
  const recordRead = readRecord(paths, deps);
  verifyResolvedIdentity(input.project_id, resolved, recordRead);
  let classification = "MISSING";
  let projection = null;
  let fingerprint = null;
  if (Object.prototype.hasOwnProperty.call(recordRead.record, "workspace_projection")) {
    try {
      projection = validateProjectWorkspaceProjection(recordRead.record.workspace_projection);
      fingerprint = createProjectWorkspaceProjectionFingerprint(projection);
      classification = Object.prototype.hasOwnProperty.call(input, "expected_projection")
        ? compareProjection(projection, validateProjectWorkspaceProjection(input.expected_projection))
        : "MATCH";
    } catch (cause) {
      if (Object.prototype.hasOwnProperty.call(input, "expected_projection")) {
        validateProjectWorkspaceProjection(input.expected_projection);
      }
      classification = "CONFLICTING";
      projection = deepCopy(recordRead.record.workspace_projection);
    }
  } else if (Object.prototype.hasOwnProperty.call(input, "expected_projection")) {
    validateProjectWorkspaceProjection(input.expected_projection);
  }
  return Object.freeze({
    classification,
    project_id: input.project_id,
    project_slug: resolved.resolution.project.project_slug,
    exists: projection !== null,
    workspace_projection: deepCopy(projection),
    projection_fingerprint: fingerprint && Object.freeze(deepCopy(fingerprint))
  });
}

function validateWriteInput(input) {
  assertPlainObject(input, "write input");
  const fields = ["project_id", "desired_projection", "expected_current_projection"];
  for (const field of Object.keys(input)) {
    if (!fields.includes(field)) {
      throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, `write input contains unknown field: ${field}`, {
        field
      });
    }
  }
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      const code = field === "expected_current_projection"
        ? PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_REQUIRED
        : PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID;
      throw error(code, `write input is missing required field: ${field}`, { field });
    }
  }
  validateProjectIdForRuntime(input.project_id);
  const desired = validateProjectWorkspaceProjection(input.desired_projection);
  const expected = input.expected_current_projection === null
    ? null
    : validateFingerprint(input.expected_current_projection);
  return { project_id: input.project_id, desired, expected };
}

function conflict(code, message, details, outcome = PROJECT_WORKSPACE_PROJECTION_OUTCOMES.CONFLICT) {
  throw error(code, message, details, { outcome });
}

function evaluatePrecondition(currentProjection, expected, desired) {
  const currentFingerprint = currentProjection
    ? createProjectWorkspaceProjectionFingerprint(currentProjection)
    : null;
  const desiredFingerprint = createProjectWorkspaceProjectionFingerprint(desired);
  if (expected === null && currentFingerprint !== null) {
    conflict(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_MISMATCH, "Existing projection requires exact expectation", {
      current_fingerprint: currentFingerprint
    });
  }
  if (expected !== null && currentFingerprint === null) {
    conflict(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_MISMATCH, "Expected projection is missing");
  }
  if (expected !== null && !sameFingerprint(expected, currentFingerprint)) {
    conflict(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_MISMATCH, "Projection expectation does not match", {
      expected_fingerprint: expected,
      current_fingerprint: currentFingerprint
    });
  }
  if (currentFingerprint && sameFingerprint(currentFingerprint, desiredFingerprint)) {
    return { kind: "NOOP", currentFingerprint, desiredFingerprint };
  }
  if (currentProjection) {
    const sameAuthority = currentProjection.workspace_id === desired.workspace_id
      && currentProjection.relationship_id === desired.relationship_id;
    const tombstone = ["DETACHED", "ARCHIVED"].includes(currentProjection.relationship_status);
    if (!sameAuthority && !tombstone) {
      conflict(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.CONFLICT, "Active projection authority cannot be replaced", {
        current_fingerprint: currentFingerprint,
        desired_fingerprint: desiredFingerprint
      });
    }
    if (sameAuthority && desired.workspace_version < currentProjection.workspace_version) {
      conflict(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.STALE, "Desired projection is behind the Project projection", {
        current_fingerprint: currentFingerprint,
        desired_fingerprint: desiredFingerprint
      }, PROJECT_WORKSPACE_PROJECTION_OUTCOMES.STALE);
    }
    if (sameAuthority && desired.workspace_version === currentProjection.workspace_version) {
      conflict(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.CONFLICT, "A status change requires newer Workspace authority", {
        current_fingerprint: currentFingerprint,
        desired_fingerprint: desiredFingerprint
      });
    }
  }
  return { kind: "WRITE", currentFingerprint, desiredFingerprint };
}

function fsyncBestEffort(filesystem, filePath, warnings) {
  let descriptor;
  try {
    descriptor = filesystem.openSync(filePath, "r+");
    filesystem.fsyncSync(descriptor);
  } catch (cause) {
    warnings.push({ code: "PROJECT_PROJECTION_FSYNC_WARNING", message: cause.message });
  } finally {
    if (descriptor !== undefined) {
      try { filesystem.closeSync(descriptor); } catch (cause) {
        warnings.push({ code: "PROJECT_PROJECTION_CLOSE_WARNING", message: cause.message });
      }
    }
  }
}

function createBackupBestEffort(paths, deps, warnings) {
  const existing = lstatIfPresent(deps.filesystem, paths.backupFile);
  if (existing) {
    warnings.push({
      code: "PROJECT_PROJECTION_BACKUP_ALREADY_PRESENT",
      message: "Existing non-authoritative Project backup was preserved"
    });
    return { attempted: false, created: false, existing: true };
  }
  try {
    deps.filesystem.copyFileSync(paths.projectFile, paths.backupFile, fs.constants.COPYFILE_EXCL);
    return { attempted: true, created: true, existing: false };
  } catch (cause) {
    warnings.push({ code: "PROJECT_PROJECTION_BACKUP_WARNING", message: cause.message });
    return { attempted: true, created: false, existing: false };
  }
}

function cleanupOwnTemp(paths, deps) {
  try {
    const stat = lstatIfPresent(deps.filesystem, paths.tempFile);
    if (stat && !stat.isSymbolicLink() && stat.isFile()) deps.filesystem.unlinkSync(paths.tempFile);
  } catch (_) {
    // Recovery is explicit; never delete anything except this writer's own confirmed temp file.
  }
}

function persistProjection(paths, currentRecord, nextRecord, precondition, deps, projectId) {
  const warnings = [];
  const serialized = `${JSON.stringify(nextRecord, null, 2)}\n`;
  const currentStat = deps.filesystem.lstatSync(paths.projectFile);
  let tempCreated = false;
  let renameAttempted = false;
  let renamed = false;
  let backup;
  try {
    deps.filesystem.writeFileSync(paths.tempFile, serialized, {
      encoding: "utf8",
      flag: "wx",
      mode: currentStat.mode & 0o777
    });
    tempCreated = true;
    fsyncBestEffort(deps.filesystem, paths.tempFile, warnings);
    backup = createBackupBestEffort(paths, deps, warnings);
    renameAttempted = true;
    deps.filesystem.renameSync(paths.tempFile, paths.projectFile);
    renamed = true;
    tempCreated = false;
    if (typeof deps.hooks.afterRename === "function") deps.hooks.afterRename();
  } catch (cause) {
    if (tempCreated && !renamed) cleanupOwnTemp(paths, deps);
    const persistence = {
      committed: renamed,
      atomic_rename_attempted: renameAttempted,
      atomic_rename_completed: renamed,
      backup: backup || null,
      warnings
    };
    if (renamed) {
      throw error(
        PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.UNCERTAIN_COMMIT,
        "Project projection may have committed; reread before retry",
        {
          project_id: projectId,
          desired_fingerprint: precondition.desiredFingerprint,
          expected_previous_fingerprint: precondition.currentFingerprint
        }, {
          cause,
          outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.FAILED,
          persistence,
          lower_level_error: lowerLevelError(cause)
        }
      );
    }
    throw error(
      PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PERSISTENCE_FAILED,
      `Project projection persistence failed: ${cause.message}`,
      { project_id: projectId },
      {
        cause,
        outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.FAILED,
        persistence,
        lower_level_error: lowerLevelError(cause)
      }
    );
  }
  return {
    committed: true,
    atomic_rename_attempted: true,
    atomic_rename_completed: true,
    temp_file_present: false,
    backup,
    warnings
  };
}

async function writeProjectWorkspaceProjection(input, options) {
  const validated = validateWriteInput(input);
  const deps = dependencies(options);
  resolveProject(validated.project_id, deps);
  return withProjectRecordMutationLock(validated.project_id, () => {
    // Deliberately synchronous from this authoritative reread through rename: no await is permitted here.
    const resolved = resolveProject(validated.project_id, deps);
    const paths = trustedPaths(resolved, deps);
    assertRegularPathState(paths, deps, true);
    const recordRead = readRecord(paths, deps);
    const projectSlug = verifyResolvedIdentity(validated.project_id, resolved, recordRead);
    let previousProjection = null;
    if (Object.prototype.hasOwnProperty.call(recordRead.record, "workspace_projection")) {
      try {
        previousProjection = validateProjectWorkspaceProjection(recordRead.record.workspace_projection);
      } catch (cause) {
        throw error(
          PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.RECOVERY_REQUIRED,
          "Existing workspace_projection is invalid and cannot be overwritten",
          { project_id: validated.project_id },
          {
            cause,
            outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED,
            lower_level_error: lowerLevelError(cause)
          }
        );
      }
    }
    const precondition = evaluatePrecondition(previousProjection, validated.expected, validated.desired);
    if (precondition.kind === "NOOP") {
      return Object.freeze({
        outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.WRITE_NOOP,
        changed: false,
        previous_projection: deepCopy(previousProjection),
        workspace_projection: deepCopy(previousProjection),
        previous_fingerprint: Object.freeze(deepCopy(precondition.currentFingerprint)),
        projection_fingerprint: Object.freeze(deepCopy(precondition.desiredFingerprint)),
        persistence: Object.freeze({ committed: false, write_attempted: false, warnings: [] }),
        project_id: validated.project_id,
        project_slug: projectSlug
      });
    }
    const projectedAt = deps.now();
    if (!validateUtcTimestamp(projectedAt)) {
      throw error(PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.INPUT_INVALID, "Injected clock returned an invalid timestamp");
    }
    const committedProjection = { ...validated.desired, projected_at: projectedAt };
    validateProjectWorkspaceProjection(committedProjection);
    const nextRecord = { ...recordRead.record, workspace_projection: committedProjection };
    const persistence = persistProjection(
      paths,
      recordRead.record,
      nextRecord,
      precondition,
      deps,
      validated.project_id
    );
    return Object.freeze({
      outcome: PROJECT_WORKSPACE_PROJECTION_OUTCOMES.WRITE_SUCCESS,
      changed: true,
      previous_projection: deepCopy(previousProjection),
      workspace_projection: deepCopy(committedProjection),
      previous_fingerprint: precondition.currentFingerprint && Object.freeze(deepCopy(precondition.currentFingerprint)),
      projection_fingerprint: Object.freeze(deepCopy(precondition.desiredFingerprint)),
      persistence: Object.freeze(deepCopy(persistence)),
      project_id: validated.project_id,
      project_slug: projectSlug
    });
  });
}

module.exports = Object.freeze({
  validateProjectWorkspaceProjection,
  createProjectWorkspaceProjectionFingerprint,
  readProjectWorkspaceProjection,
  inspectProjectWorkspaceProjection,
  writeProjectWorkspaceProjection,
  withProjectRecordMutationLock,
  ProjectWorkspaceProjectionError,
  PROJECT_WORKSPACE_PROJECTION_ERROR_CODES,
  PROJECT_WORKSPACE_PROJECTION_OUTCOMES,
  PROJECT_WORKSPACE_PROJECTION_FIELDS,
  PROJECT_WORKSPACE_PROJECTION_STATUSES,
  PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER,
  PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION,
  SINGLE_WRITER_ASSUMPTION
});

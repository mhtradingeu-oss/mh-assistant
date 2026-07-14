"use strict";

const contract = require("./workspace-contract");
const committedStorage = require("./workspace-storage");

const {
  ERROR_CODES,
  WORKSPACE_SCHEMA_VERSION,
  WorkspaceContractError,
  doesWorkspaceStatusGrantAuthorization,
  generateWorkspaceId: generateCommittedWorkspaceId,
  validateEvidenceReference,
  validateExpectedWorkspaceVersion,
  validateOperationalOwnershipState,
  validateWorkspaceCreationInput,
  validateWorkspaceRecord,
  validateWorkspaceTransition
} = contract;

const WORKSPACE_MUTATION_OUTCOMES = Object.freeze({
  SUCCESS: "WORKSPACE_MUTATION_SUCCESS",
  NOOP: "WORKSPACE_MUTATION_NOOP",
  CONFLICT: "WORKSPACE_MUTATION_CONFLICT",
  RECOVERY_REQUIRED: "WORKSPACE_MUTATION_RECOVERY_REQUIRED",
  FAILED: "WORKSPACE_MUTATION_FAILED"
});

const WORKSPACE_RUNTIME_ERROR_CODES = Object.freeze({
  INVALID_INPUT: "WORKSPACE_RUNTIME_INVALID_INPUT",
  WORKSPACE_NOT_FOUND: "WORKSPACE_RUNTIME_WORKSPACE_NOT_FOUND",
  WORKSPACE_RECOVERY_REQUIRED: "WORKSPACE_RUNTIME_WORKSPACE_RECOVERY_REQUIRED",
  WORKSPACE_VERSION_CONFLICT: ERROR_CODES.WORKSPACE_VERSION_CONFLICT,
  WORKSPACE_PERSISTENCE_FAILED: "WORKSPACE_RUNTIME_WORKSPACE_PERSISTENCE_FAILED",
  WORKSPACE_ID_GENERATION_EXHAUSTED: "WORKSPACE_RUNTIME_WORKSPACE_ID_GENERATION_EXHAUSTED"
});

const SINGLE_WRITER_ASSUMPTION = Object.freeze({
  process_local_creation_mutex: true,
  process_local_per_workspace_mutex: true,
  cross_process_guarantee: false,
  transactional_guarantee: false,
  workspace_version_compare_and_swap: false,
  required_writer_model: "SINGLE_WRITER"
});

const MAX_ID_GENERATION_ATTEMPTS = 5;
const CREATION_FIELDS = new Set(["workspace_name", "ownership_state", "evidence_references"]);
const AUTHORITATIVE_CREATION_FIELDS = new Set([
  "id", "workspace_id", "workspaceId", "schema_version", "workspace_version", "status",
  "created_at", "updated_at", "project_relationships", "roles", "permissions", "membership"
]);
const TRANSITION_EVIDENCE_TYPES = Object.freeze({
  "CREATING->ACTIVE": "workspace_activation",
  "ACTIVE->SUSPENDED": "workspace_suspension",
  "SUSPENDED->ACTIVE": "workspace_resumption",
  "CREATING->FAILED": "workspace_failure",
  "FAILED->CREATING": "workspace_recovery",
  "ACTIVE->ARCHIVED": "workspace_archive",
  "SUSPENDED->ARCHIVED": "workspace_archive",
  "FAILED->ARCHIVED": "workspace_archive"
});

class WorkspaceRuntimeError extends Error {
  constructor(code, message, details, options = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "WorkspaceRuntimeError";
    this.code = code;
    this.outcome = options.outcome || WORKSPACE_MUTATION_OUTCOMES.FAILED;
    if (details !== undefined) this.details = details;
    if (options.lower_level_error !== undefined) this.lower_level_error = options.lower_level_error;
  }
}

const mutationLocks = new Map();
let creationLockTail = Promise.resolve();

function deepCopy(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function lowerLevelError(error) {
  return Object.freeze({
    name: error && error.name,
    code: error && error.code,
    message: error && error.message,
    details: deepCopy(error && error.details)
  });
}

function runtimeError(code, message, details, options) {
  return new WorkspaceRuntimeError(code, message, details, options);
}

function assertPlainObject(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)
    || (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)) {
    throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, `${label} must be a plain object`);
  }
}

function assertExactInput(value, allowed, label) {
  assertPlainObject(value, label);
  for (const field of Object.keys(value)) {
    if (!allowed.has(field)) {
      throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, `${label} contains unknown field: ${field}`, {
        field
      });
    }
  }
}

function getDependencies(options = {}) {
  assertPlainObject(options, "options");
  const storage = options.storage || committedStorage;
  for (const method of ["inspectWorkspaceStorage", "readWorkspace", "writeWorkspace"]) {
    if (!storage || typeof storage[method] !== "function") {
      throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, `storage.${method} must be a function`);
    }
  }
  const now = options.now || (() => new Date().toISOString());
  const idGenerator = options.generateWorkspaceId || generateCommittedWorkspaceId;
  if (typeof now !== "function" || typeof idGenerator !== "function") {
    throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, "now and generateWorkspaceId must be functions");
  }
  return {
    root: options.root === undefined ? committedStorage.DEFAULT_WORKSPACE_ROOT : options.root,
    now,
    generateWorkspaceId: idGenerator,
    storage
  };
}

async function withCreationLock(operation) {
  if (typeof operation !== "function") {
    throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, "creation operation must be a function");
  }
  const predecessor = creationLockTail;
  let release;
  creationLockTail = new Promise((resolve) => { release = resolve; });
  await predecessor.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
  }
}

async function withWorkspaceMutationLock(workspaceId, operation) {
  if (typeof operation !== "function") {
    throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, "mutation operation must be a function");
  }
  const predecessor = mutationLocks.get(workspaceId) || Promise.resolve();
  let release;
  const tail = new Promise((resolve) => { release = resolve; });
  mutationLocks.set(workspaceId, tail);
  await predecessor.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (mutationLocks.get(workspaceId) === tail) mutationLocks.delete(workspaceId);
  }
}

function isRecoveryRequired(inspection) {
  return Boolean(inspection && (inspection.recovery_required
    || (Array.isArray(inspection.states) && inspection.states.includes("RECOVERY_REQUIRED"))));
}

function recoveryError(workspaceId, inspection) {
  return runtimeError(
    WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_RECOVERY_REQUIRED,
    "Workspace storage requires explicit recovery",
    {
      workspace_id: workspaceId,
      classification: inspection && inspection.classification,
      states: deepCopy(inspection && inspection.states)
    },
    { outcome: WORKSPACE_MUTATION_OUTCOMES.RECOVERY_REQUIRED }
  );
}

async function inspect(dependencies, workspaceId) {
  return dependencies.storage.inspectWorkspaceStorage(dependencies.root, workspaceId);
}

async function strictRead(dependencies, workspaceId) {
  let workspace;
  try {
    workspace = await dependencies.storage.readWorkspace(dependencies.root, workspaceId);
  } catch (error) {
    if (error instanceof committedStorage.WorkspaceStorageError
      && error.code === committedStorage.STORAGE_ERROR_CODES.WORKSPACE_CORRUPT) {
      throw runtimeError(
        WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_RECOVERY_REQUIRED,
        "Workspace storage requires explicit recovery",
        { workspace_id: workspaceId },
        {
          cause: error,
          outcome: WORKSPACE_MUTATION_OUTCOMES.RECOVERY_REQUIRED,
          lower_level_error: lowerLevelError(error)
        }
      );
    }
    throw error;
  }
  if (workspace === null) {
    throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_NOT_FOUND, "Workspace was not found", {
      workspace_id: workspaceId
    });
  }
  validateWorkspaceRecord(workspace);
  return workspace;
}

function timestamp(now) {
  const value = now();
  return value instanceof Date ? value.toISOString() : value;
}

function mutationResult(outcome, changed, previous, workspace, persistence = null) {
  const result = {
    outcome,
    changed,
    previous_version: previous.workspace_version,
    workspace_version: workspace.workspace_version,
    status: workspace.status,
    workspace: deepCopy(workspace),
    persistence: deepCopy(persistence)
  };
  if (previous.status !== undefined) result.previous_status = previous.status;
  return Object.freeze(result);
}

function conflictResult(workspace, error) {
  return Object.freeze({
    outcome: WORKSPACE_MUTATION_OUTCOMES.CONFLICT,
    changed: false,
    code: WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_VERSION_CONFLICT,
    previous_version: workspace.workspace_version,
    workspace_version: workspace.workspace_version,
    previous_status: workspace.status,
    status: workspace.status,
    workspace: deepCopy(workspace),
    persistence: null,
    error: lowerLevelError(error)
  });
}

async function persist(dependencies, workspaceId, workspace) {
  try {
    return await dependencies.storage.writeWorkspace(dependencies.root, workspace);
  } catch (error) {
    throw runtimeError(
      WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_PERSISTENCE_FAILED,
      "Workspace persistence failed",
      { workspace_id: workspaceId },
      {
        cause: error,
        outcome: WORKSPACE_MUTATION_OUTCOMES.FAILED,
        lower_level_error: lowerLevelError(error)
      }
    );
  }
}

async function createWorkspace(input, options = {}) {
  validateWorkspaceCreationInput(input);
  assertPlainObject(input, "Workspace creation input");
  for (const field of Object.keys(input)) {
    if (AUTHORITATIVE_CREATION_FIELDS.has(field)) {
      throw new WorkspaceContractError(
        ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED,
        `Caller-provided authoritative creation field is not allowed: ${field}`,
        { field }
      );
    }
    if (!CREATION_FIELDS.has(field)) {
      throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, `Workspace creation input contains unknown field: ${field}`, {
        field
      });
    }
  }
  if (!Object.prototype.hasOwnProperty.call(input, "workspace_name")) {
    throw runtimeError(WORKSPACE_RUNTIME_ERROR_CODES.INVALID_INPUT, "workspace_name is required", {
      field: "workspace_name"
    });
  }
  const ownershipState = input.ownership_state === undefined ? "UNCLAIMED" : input.ownership_state;
  validateOperationalOwnershipState(ownershipState);
  const evidenceReferences = input.evidence_references === undefined ? [] : input.evidence_references;
  if (!Array.isArray(evidenceReferences)) {
    throw new WorkspaceContractError(ERROR_CODES.INVALID_INPUT, "evidence_references must be an array");
  }
  evidenceReferences.forEach(validateEvidenceReference);
  const dependencies = getDependencies(options);

  return withCreationLock(async () => {
    let lastInspection = null;
    for (let attempt = 1; attempt <= MAX_ID_GENERATION_ATTEMPTS; attempt += 1) {
      const workspaceId = dependencies.generateWorkspaceId();
      const inspection = await inspect(dependencies, workspaceId);
      lastInspection = inspection;
      if (!inspection || inspection.classification !== "MISSING_NEW" || inspection.recovery_required) continue;
      const now = timestamp(dependencies.now);
      const workspace = {
        schema_version: WORKSPACE_SCHEMA_VERSION,
        workspace_id: workspaceId,
        workspace_version: 1,
        workspace_name: input.workspace_name,
        status: "CREATING",
        ownership_state: ownershipState,
        created_at: now,
        updated_at: now,
        project_relationships: [],
        evidence_references: evidenceReferences.map(deepCopy)
      };
      validateWorkspaceRecord(workspace);
      const persistence = await persist(dependencies, workspaceId, workspace);
      return Object.freeze({
        outcome: WORKSPACE_MUTATION_OUTCOMES.SUCCESS,
        changed: true,
        previous_version: 0,
        workspace_version: 1,
        status: workspace.status,
        workspace: deepCopy(workspace),
        persistence: deepCopy(persistence)
      });
    }
    throw runtimeError(
      WORKSPACE_RUNTIME_ERROR_CODES.WORKSPACE_ID_GENERATION_EXHAUSTED,
      `No available Workspace ID was generated in ${MAX_ID_GENERATION_ATTEMPTS} attempts`,
      {
        attempts: MAX_ID_GENERATION_ATTEMPTS,
        last_classification: lastInspection && lastInspection.classification,
        last_recovery_required: Boolean(lastInspection && lastInspection.recovery_required)
      }
    );
  });
}

async function getWorkspace(workspaceId, options = {}) {
  const dependencies = getDependencies(options);
  const inspection = await inspect(dependencies, workspaceId);
  if (isRecoveryRequired(inspection)) throw recoveryError(workspaceId, inspection);
  return deepCopy(await strictRead(dependencies, workspaceId));
}

async function inspectWorkspaceRuntimeState(workspaceId, options = {}) {
  const dependencies = getDependencies(options);
  const inspection = await inspect(dependencies, workspaceId);
  const workspace = inspection && inspection.workspace;
  let valid = false;
  if (workspace) {
    try {
      validateWorkspaceRecord(workspace);
      valid = true;
    } catch (_) {
      valid = false;
    }
  }
  return Object.freeze({
    storage_classification: inspection && inspection.classification,
    recovery_required: isRecoveryRequired(inspection),
    exists: Boolean(inspection && inspection.canonical && inspection.canonical.present),
    valid,
    workspace_id: workspace ? workspace.workspace_id : workspaceId,
    workspace_version: workspace ? workspace.workspace_version : null,
    status: workspace ? workspace.status : null,
    ownership_state: workspace ? workspace.ownership_state : null,
    evidence_count: workspace && Array.isArray(workspace.evidence_references)
      ? workspace.evidence_references.length
      : 0
  });
}

async function mutateWorkspace(workspaceId, expectedVersion, options, compute) {
  const dependencies = getDependencies(options);
  return withWorkspaceMutationLock(workspaceId, async () => {
    const inspection = await inspect(dependencies, workspaceId);
    if (isRecoveryRequired(inspection)) throw recoveryError(workspaceId, inspection);
    const current = await strictRead(dependencies, workspaceId);
    try {
      validateExpectedWorkspaceVersion(current.workspace_version, expectedVersion);
    } catch (error) {
      if (error instanceof WorkspaceContractError && error.code === ERROR_CODES.WORKSPACE_VERSION_CONFLICT) {
        return conflictResult(current, error);
      }
      throw error;
    }
    const computed = compute(deepCopy(current));
    if (!computed.changed) {
      return mutationResult(WORKSPACE_MUTATION_OUTCOMES.NOOP, false, current, current, null);
    }
    const next = computed.workspace;
    next.workspace_version = current.workspace_version + 1;
    next.updated_at = timestamp(dependencies.now);
    next.workspace_id = current.workspace_id;
    next.schema_version = current.schema_version;
    next.created_at = current.created_at;
    next.project_relationships = deepCopy(current.project_relationships);
    next.ownership_state = current.ownership_state;
    validateWorkspaceRecord(next);
    const persistence = await persist(dependencies, workspaceId, next);
    return mutationResult(WORKSPACE_MUTATION_OUTCOMES.SUCCESS, true, current, next, persistence);
  });
}

async function transitionWorkspace(workspaceId, input, options = {}) {
  assertExactInput(input, new Set(["target_status", "expected_workspace_version", "evidence_reference"]), "transition input");
  return mutateWorkspace(workspaceId, input.expected_workspace_version, options, (current) => {
    if (input.evidence_reference !== undefined) validateEvidenceReference(input.evidence_reference);
    if (current.status === input.target_status) {
      if (input.evidence_reference !== undefined) {
        throw new WorkspaceContractError(
          ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
          "A same-state lifecycle no-op cannot record transition evidence"
        );
      }
      return { changed: false, workspace: current };
    }
    validateWorkspaceTransition(current.status, input.target_status);
    if (input.evidence_reference !== undefined) {
      const expectedType = TRANSITION_EVIDENCE_TYPES[`${current.status}->${input.target_status}`];
      if (input.evidence_reference.reference_type !== expectedType) {
        throw new WorkspaceContractError(
          ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
          `Transition evidence must use reference_type ${expectedType}`,
          { expected_reference_type: expectedType, actual_reference_type: input.evidence_reference.reference_type }
        );
      }
      current.evidence_references.push(deepCopy(input.evidence_reference));
    }
    current.status = input.target_status;
    return { changed: true, workspace: current };
  });
}

function transitionWrapper(targetStatus) {
  return function workspaceTransitionWrapper(workspaceId, input, options = {}) {
    assertExactInput(input, new Set(["expected_workspace_version", "evidence_reference"]), "transition input");
    return transitionWorkspace(workspaceId, { ...input, target_status: targetStatus }, options);
  };
}

const activateWorkspace = transitionWrapper("ACTIVE");
const suspendWorkspace = transitionWrapper("SUSPENDED");
const resumeWorkspace = transitionWrapper("ACTIVE");
const markWorkspaceFailed = transitionWrapper("FAILED");
const archiveWorkspace = transitionWrapper("ARCHIVED");

async function updateWorkspaceName(workspaceId, input, options = {}) {
  assertExactInput(input, new Set(["workspace_name", "expected_workspace_version", "evidence_reference"]), "name update input");
  if (typeof input.workspace_name !== "string") {
    throw new WorkspaceContractError(ERROR_CODES.INVALID_WORKSPACE_NAME, "workspace_name must be a string");
  }
  const normalizedName = input.workspace_name.trim();
  if (normalizedName.length < 1 || normalizedName.length > 120) {
    throw new WorkspaceContractError(
      ERROR_CODES.INVALID_WORKSPACE_NAME,
      "workspace_name must normalize to between 1 and 120 characters"
    );
  }
  if (input.evidence_reference !== undefined) validateEvidenceReference(input.evidence_reference);
  return mutateWorkspace(workspaceId, input.expected_workspace_version, options, (current) => {
    if (current.workspace_name === normalizedName) return { changed: false, workspace: current };
    current.workspace_name = normalizedName;
    if (input.evidence_reference !== undefined) current.evidence_references.push(deepCopy(input.evidence_reference));
    return { changed: true, workspace: current };
  });
}

function evidenceEqual(left, right) {
  return left.reference_type === right.reference_type
    && left.reference_id === right.reference_id
    && left.source_owner === right.source_owner
    && left.recorded_at === right.recorded_at;
}

async function addWorkspaceEvidenceReference(workspaceId, input, options = {}) {
  assertExactInput(input, new Set(["evidence_reference", "expected_workspace_version"]), "evidence append input");
  validateEvidenceReference(input.evidence_reference);
  return mutateWorkspace(workspaceId, input.expected_workspace_version, options, (current) => {
    if (current.evidence_references.some((item) => evidenceEqual(item, input.evidence_reference))) {
      return { changed: false, workspace: current };
    }
    current.evidence_references.push(deepCopy(input.evidence_reference));
    return { changed: true, workspace: current };
  });
}

module.exports = Object.freeze({
  createWorkspace,
  getWorkspace,
  inspectWorkspaceRuntimeState,
  transitionWorkspace,
  activateWorkspace,
  suspendWorkspace,
  resumeWorkspace,
  markWorkspaceFailed,
  archiveWorkspace,
  updateWorkspaceName,
  addWorkspaceEvidenceReference,
  withWorkspaceMutationLock,
  WorkspaceRuntimeError,
  WORKSPACE_RUNTIME_ERROR_CODES,
  WORKSPACE_MUTATION_OUTCOMES,
  SINGLE_WRITER_ASSUMPTION
});

// Lifecycle status is operational metadata only; the contract always denies authorization by status.
void doesWorkspaceStatusGrantAuthorization;

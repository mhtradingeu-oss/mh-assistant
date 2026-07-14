"use strict";

const contract = require("./workspace-contract");
const workspaceRuntime = require("./workspace-runtime");
const committedStorage = require("./workspace-storage");
const committedProjectIdentity = require("../projects/project-identity");

const {
  PROJECT_RELATIONSHIP_SCHEMA_VERSION,
  generateProjectRelationshipId: generateCommittedProjectRelationshipId,
  validateProjectRelationship,
  validateProjectRelationshipTransition,
  validateExpectedWorkspaceVersion,
  validateEvidenceReference,
  validateWorkspaceRecord,
  validateProjectId,
  validateProjectRelationshipStatus,
  validateValidationState,
  assertRelationshipIdImmutable,
  assertRelationshipIdNotReused,
  validateAttachOutcome,
  validateDetachOutcome,
  ATTACH_OUTCOMES,
  DETACH_OUTCOMES,
  ERROR_CODES,
  WorkspaceContractError
} = contract;

const {
  withWorkspaceMutationLock,
  SINGLE_WRITER_ASSUMPTION: WORKSPACE_SINGLE_WRITER_ASSUMPTION
} = workspaceRuntime;

const WORKSPACE_RELATIONSHIP_OUTCOMES = Object.freeze({
  ATTACH_PENDING: "ATTACH_PENDING",
  ATTACH_SUCCESS: "ATTACH_SUCCESS",
  ATTACH_CONFLICT: "ATTACH_CONFLICT",
  ATTACH_RECOVERY_REQUIRED: "ATTACH_RECOVERY_REQUIRED",
  ATTACH_FAILED: "ATTACH_FAILED",
  DETACH_PENDING: "DETACH_PENDING",
  DETACH_SUCCESS: "DETACH_SUCCESS",
  DETACH_CONFLICT: "DETACH_CONFLICT",
  DETACH_RECOVERY_REQUIRED: "DETACH_RECOVERY_REQUIRED",
  DETACH_FAILED: "DETACH_FAILED"
});

for (const outcome of Object.values(WORKSPACE_RELATIONSHIP_OUTCOMES)) {
  if (outcome.startsWith("ATTACH_")) validateAttachOutcome(outcome);
  else validateDetachOutcome(outcome);
}

const ACTIVE_RELATIONSHIP_STATES = Object.freeze([
  "PENDING_ATTACH",
  "ATTACHED",
  "PENDING_DETACH"
]);

const WORKSPACE_RELATIONSHIP_ERROR_CODES = Object.freeze({
  INVALID_INPUT: "WORKSPACE_RELATIONSHIP_INVALID_INPUT",
  WORKSPACE_NOT_FOUND: "WORKSPACE_RELATIONSHIP_WORKSPACE_NOT_FOUND",
  RELATIONSHIP_NOT_FOUND: "WORKSPACE_RELATIONSHIP_NOT_FOUND",
  WORKSPACE_RECOVERY_REQUIRED: "WORKSPACE_RELATIONSHIP_WORKSPACE_RECOVERY_REQUIRED",
  WORKSPACE_VERSION_CONFLICT: ERROR_CODES.WORKSPACE_VERSION_CONFLICT,
  RELATIONSHIP_CONFLICT: "WORKSPACE_RELATIONSHIP_CONFLICT",
  RELATIONSHIP_ID_SCAN_INCOMPLETE: "WORKSPACE_RELATIONSHIP_ID_SCAN_INCOMPLETE",
  RELATIONSHIP_ID_GENERATION_EXHAUSTED: "WORKSPACE_RELATIONSHIP_ID_GENERATION_EXHAUSTED",
  PROJECT_IDENTITY_FAILED: "WORKSPACE_RELATIONSHIP_PROJECT_IDENTITY_FAILED",
  PERSISTENCE_FAILED: "WORKSPACE_RELATIONSHIP_PERSISTENCE_FAILED"
});

const SINGLE_WRITER_ASSUMPTION = Object.freeze({
  process_local_per_workspace_mutex: WORKSPACE_SINGLE_WRITER_ASSUMPTION.process_local_per_workspace_mutex === true,
  process_local_relationship_id_allocation_mutex: true,
  project_identity_uses_process_local_per_project_mutex: true,
  cross_process_guarantee: false,
  transactional_guarantee: false,
  relationship_id_cross_process_uniqueness_guarantee: false,
  required_writer_model: "SINGLE_WRITER"
});

const MAX_RELATIONSHIP_ID_GENERATION_ATTEMPTS = 5;
const NON_AUTHORITATIVE_DISCOVERY_REASONS = new Set([
  "HIDDEN_ENTRY",
  "NOT_REAL_DIRECTORY",
  "MALFORMED_WORKSPACE_ID"
]);
const ATTACH_ALLOWED_WORKSPACE_STATES = new Set(["CREATING", "ACTIVE"]);

class WorkspaceRelationshipRuntimeError extends Error {
  constructor(code, message, details, options = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "WorkspaceRelationshipRuntimeError";
    this.code = code;
    this.outcome = options.outcome || WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED;
    this.identity = options.identity === undefined ? null : deepCopy(options.identity);
    this.persistence = options.persistence === undefined ? null : deepCopy(options.persistence);
    if (details !== undefined) this.details = deepCopy(details);
    if (options.lower_level_error !== undefined) {
      this.lower_level_error = deepCopy(options.lower_level_error);
    }
  }
}

let relationshipIdAllocationTail = Promise.resolve();

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
  return new WorkspaceRelationshipRuntimeError(code, message, details, options);
}

function assertPlainObject(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)
    || (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)) {
    throw runtimeError(WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT, `${label} must be a plain object`);
  }
}

function assertExactInput(input, required, optional, label) {
  assertPlainObject(input, label);
  const allowed = new Set([...required, ...optional]);
  for (const field of Object.keys(input)) {
    if (!allowed.has(field)) {
      throw runtimeError(WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT, `${label} contains unknown field: ${field}`, {
        field
      });
    }
  }
  for (const field of required) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      throw runtimeError(WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT, `${label} is missing required field: ${field}`, {
        field
      });
    }
  }
}

function dependencies(options = {}) {
  assertPlainObject(options, "options");
  const storage = options.storage || committedStorage;
  const projectIdentity = options.projectIdentity || committedProjectIdentity;
  for (const method of [
    "inspectWorkspaceStorage",
    "readWorkspace",
    "writeWorkspace",
    "discoverWorkspacesWithDiagnostics"
  ]) {
    if (!storage || typeof storage[method] !== "function") {
      throw runtimeError(WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT, `storage.${method} must be a function`);
    }
  }
  if (!projectIdentity || typeof projectIdentity.ensureProjectIdentityForAttach !== "function") {
    throw runtimeError(
      WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT,
      "projectIdentity.ensureProjectIdentityForAttach must be a function"
    );
  }
  const now = options.now || (() => new Date().toISOString());
  const generateProjectRelationshipId = options.generateProjectRelationshipId
    || generateCommittedProjectRelationshipId;
  if (typeof now !== "function" || typeof generateProjectRelationshipId !== "function") {
    throw runtimeError(
      WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT,
      "now and generateProjectRelationshipId must be functions"
    );
  }
  return {
    root: options.root === undefined ? committedStorage.DEFAULT_WORKSPACE_ROOT : options.root,
    projectsRoot: options.projectsRoot === undefined
      ? committedProjectIdentity.DEFAULT_PROJECTS_ROOT
      : options.projectsRoot,
    storage,
    projectIdentity,
    now,
    generateProjectRelationshipId
  };
}

function timestamp(now) {
  const value = now();
  return value instanceof Date ? value.toISOString() : value;
}

function isRecoveryRequired(inspection) {
  return Boolean(inspection && (inspection.recovery_required
    || (Array.isArray(inspection.states) && inspection.states.includes("RECOVERY_REQUIRED"))));
}

function recoveryError(workspaceId, inspection, family) {
  return runtimeError(
    WORKSPACE_RELATIONSHIP_ERROR_CODES.WORKSPACE_RECOVERY_REQUIRED,
    "Workspace storage requires explicit recovery",
    {
      workspace_id: workspaceId,
      classification: inspection && inspection.classification,
      states: inspection && inspection.states
    },
    { outcome: family.recovery }
  );
}

async function strictRead(deps, workspaceId, family) {
  let workspace;
  try {
    workspace = await deps.storage.readWorkspace(deps.root, workspaceId);
  } catch (error) {
    if (error.code === committedStorage.STORAGE_ERROR_CODES.WORKSPACE_CORRUPT) {
      throw runtimeError(
        WORKSPACE_RELATIONSHIP_ERROR_CODES.WORKSPACE_RECOVERY_REQUIRED,
        "Workspace storage requires explicit recovery",
        { workspace_id: workspaceId },
        {
          cause: error,
          outcome: family.recovery,
          lower_level_error: lowerLevelError(error)
        }
      );
    }
    throw error;
  }
  if (workspace === null) {
    throw runtimeError(
      WORKSPACE_RELATIONSHIP_ERROR_CODES.WORKSPACE_NOT_FOUND,
      "Workspace was not found",
      { workspace_id: workspaceId },
      { outcome: family.failed }
    );
  }
  validateWorkspaceRecord(workspace);
  return workspace;
}

async function readForMutation(deps, workspaceId, expectedVersion, family) {
  const inspection = await deps.storage.inspectWorkspaceStorage(deps.root, workspaceId);
  if (isRecoveryRequired(inspection)) throw recoveryError(workspaceId, inspection, family);
  const workspace = await strictRead(deps, workspaceId, family);
  try {
    validateExpectedWorkspaceVersion(workspace.workspace_version, expectedVersion);
  } catch (error) {
    if (error instanceof WorkspaceContractError && error.code === ERROR_CODES.WORKSPACE_VERSION_CONFLICT) {
      return { workspace, conflict: true, error };
    }
    throw error;
  }
  return { workspace, conflict: false, error: null };
}

async function persist(deps, workspace, family, identity) {
  try {
    return await deps.storage.writeWorkspace(deps.root, workspace);
  } catch (error) {
    throw runtimeError(
      WORKSPACE_RELATIONSHIP_ERROR_CODES.PERSISTENCE_FAILED,
      "Workspace relationship persistence failed",
      { workspace_id: workspace.workspace_id },
      {
        cause: error,
        outcome: family.failed,
        identity,
        persistence: { committed: "UNKNOWN", error: lowerLevelError(error) },
        lower_level_error: lowerLevelError(error)
      }
    );
  }
}

function family(kind) {
  return kind === "attach"
    ? {
      pending: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_PENDING,
      success: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_SUCCESS,
      conflict: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_CONFLICT,
      recovery: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_RECOVERY_REQUIRED,
      failed: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED
    }
    : {
      pending: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_PENDING,
      success: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_SUCCESS,
      conflict: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_CONFLICT,
      recovery: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_RECOVERY_REQUIRED,
      failed: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_FAILED
    };
}

function findRelationship(
  workspace,
  relationshipId,
  failedOutcome = WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED
) {
  const relationship = workspace.project_relationships.find((item) => item.relationship_id === relationshipId);
  if (!relationship) {
    throw runtimeError(
      WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_NOT_FOUND,
      "Workspace relationship was not found",
      { workspace_id: workspace.workspace_id, relationship_id: relationshipId },
      { outcome: failedOutcome }
    );
  }
  validateProjectRelationship(relationship);
  return relationship;
}

function result(outcome, changed, previousWorkspace, workspace, relationship, persistence, identity, extras = {}) {
  const previousRelationship = Object.prototype.hasOwnProperty.call(extras, "previous_relationship")
    ? extras.previous_relationship
    : relationship;
  return Object.freeze({
    outcome,
    changed,
    identity: identity === undefined ? null : deepCopy(identity),
    persistence: persistence === undefined ? null : deepCopy(persistence),
    previous_workspace_version: previousWorkspace.workspace_version,
    workspace_version: workspace.workspace_version,
    previous_relationship_status: previousRelationship ? previousRelationship.relationship_status : null,
    relationship_status: relationship ? relationship.relationship_status : null,
    relationship: relationship ? deepCopy(relationship) : null,
    workspace: deepCopy(workspace),
    ...extras.fields
  });
}

function conflictResult(outcome, workspace, relationship, error, identity = null) {
  return Object.freeze({
    outcome,
    changed: false,
    code: error && error.code ? error.code : WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_CONFLICT,
    identity: deepCopy(identity),
    persistence: null,
    previous_workspace_version: workspace.workspace_version,
    workspace_version: workspace.workspace_version,
    previous_relationship_status: relationship ? relationship.relationship_status : null,
    relationship_status: relationship ? relationship.relationship_status : null,
    relationship: relationship ? deepCopy(relationship) : null,
    workspace: deepCopy(workspace),
    error: error ? lowerLevelError(error) : null
  });
}

async function withWorkspaceRelationshipMutation(workspaceId, operation) {
  if (typeof operation !== "function") {
    throw runtimeError(WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT, "relationship mutation must be a function");
  }
  return withWorkspaceMutationLock(workspaceId, operation);
}

async function withRelationshipIdAllocationLock(operation) {
  const predecessor = relationshipIdAllocationTail;
  let release;
  relationshipIdAllocationTail = new Promise((resolve) => { release = resolve; });
  await predecessor.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
  }
}

function assertCompleteAuthoritativeScan(discovery) {
  const diagnostics = Array.isArray(discovery && discovery.diagnostics) ? discovery.diagnostics : [];
  const blocking = diagnostics.filter((item) => !NON_AUTHORITATIVE_DISCOVERY_REASONS.has(item.reason));
  if (blocking.length > 0) {
    throw runtimeError(
      WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_ID_SCAN_INCOMPLETE,
      "Relationship ID allocation cannot establish a complete authoritative Workspace scan",
      { diagnostics: blocking },
      { outcome: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED }
    );
  }
}

async function withAllocatedRelationshipId(deps, currentRelationships, operation) {
  return withRelationshipIdAllocationLock(async () => {
    for (let attempt = 1; attempt <= MAX_RELATIONSHIP_ID_GENERATION_ATTEMPTS; attempt += 1) {
      const candidate = deps.generateProjectRelationshipId();
      const discovery = await deps.storage.discoverWorkspacesWithDiagnostics(deps.root);
      assertCompleteAuthoritativeScan(discovery);
      const workspaces = Array.isArray(discovery.workspaces) ? discovery.workspaces : [];
      const globallyUsed = workspaces.some((workspace) => workspace.project_relationships
        .some((relationship) => relationship.relationship_id === candidate));
      if (globallyUsed) continue;
      try {
        assertRelationshipIdNotReused(currentRelationships, candidate);
      } catch (error) {
        if (error instanceof WorkspaceContractError && error.code === ERROR_CODES.RELATIONSHIP_ID_REUSE) continue;
        throw error;
      }
      return operation(candidate);
    }
    throw runtimeError(
      WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_ID_GENERATION_EXHAUSTED,
      `Unable to allocate a relationship ID after ${MAX_RELATIONSHIP_ID_GENERATION_ATTEMPTS} attempts`,
      { attempts: MAX_RELATIONSHIP_ID_GENERATION_ATTEMPTS },
      { outcome: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED }
    );
  });
}

function appendEvidence(workspace, evidenceReference, requiredType) {
  if (evidenceReference === undefined) return;
  validateEvidenceReference(evidenceReference);
  if (evidenceReference.reference_type !== requiredType) {
    throw new WorkspaceContractError(
      ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
      `Relationship evidence must use reference_type ${requiredType}`,
      { expected_reference_type: requiredType, actual_reference_type: evidenceReference.reference_type }
    );
  }
  workspace.evidence_references.push(deepCopy(evidenceReference));
}

function semanticWorkspace(current, now) {
  const next = deepCopy(current);
  next.workspace_version = current.workspace_version + 1;
  next.updated_at = now;
  return next;
}

async function beginWorkspaceProjectAttach(input, options = {}) {
  assertExactInput(input, ["workspace_id", "project_slug", "expected_workspace_version"], [], "begin attach input");
  const deps = dependencies(options);
  const outcomes = family("attach");
  return withWorkspaceRelationshipMutation(input.workspace_id, async () => {
    const read = await readForMutation(deps, input.workspace_id, input.expected_workspace_version, outcomes);
    if (read.conflict) return conflictResult(outcomes.conflict, read.workspace, null, read.error);
    const current = read.workspace;
    if (!ATTACH_ALLOWED_WORKSPACE_STATES.has(current.status)) {
      return conflictResult(outcomes.conflict, current, null, {
        code: WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_CONFLICT,
        message: `Workspace status ${current.status} does not permit relationship attachment`
      });
    }

    let identity;
    try {
      identity = await deps.projectIdentity.ensureProjectIdentityForAttach(input.project_slug, {
        projectsRoot: deps.projectsRoot
      });
    } catch (error) {
      throw runtimeError(
        WORKSPACE_RELATIONSHIP_ERROR_CODES.PROJECT_IDENTITY_FAILED,
        "Project identity could not be established for relationship attachment",
        { workspace_id: input.workspace_id, project_slug: input.project_slug },
        {
          cause: error,
          outcome: outcomes.failed,
          lower_level_error: lowerLevelError(error)
        }
      );
    }

    const active = current.project_relationships.find((relationship) => (
      relationship.project_id === identity.project_id
      && ACTIVE_RELATIONSHIP_STATES.includes(relationship.relationship_status)
    ));
    if (active) {
      validateProjectRelationship(active);
      if (active.relationship_status === "PENDING_ATTACH") {
        return result(outcomes.pending, false, current, current, active, null, identity);
      }
      return conflictResult(outcomes.conflict, current, active, {
        code: WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_CONFLICT,
        message: "An active relationship already exists for this Project"
      }, identity);
    }

    return withAllocatedRelationshipId(deps, current.project_relationships, async (relationshipId) => {
      const now = timestamp(deps.now);
      const relationship = {
        relationship_schema_version: PROJECT_RELATIONSHIP_SCHEMA_VERSION,
        relationship_id: relationshipId,
        project_id: identity.project_id,
        relationship_status: "PENDING_ATTACH",
        validation_state: "VALID",
        created_at: now,
        updated_at: now,
        attached_at: null,
        detached_at: null,
        archived_at: null
      };
      validateProjectRelationship(relationship);
      const next = semanticWorkspace(current, now);
      next.project_relationships.push(relationship);
      validateWorkspaceRecord(next);
      const persistence = await persist(deps, next, outcomes, identity);
      return result(outcomes.pending, true, current, next, relationship, persistence, identity, {
        previous_relationship: null
      });
    });
  });
}

async function transitionRelationship(input, options, configuration) {
  assertExactInput(
    input,
    ["workspace_id", "relationship_id", "expected_workspace_version"],
    configuration.evidenceType ? ["evidence_reference"] : [],
    configuration.label
  );
  const deps = dependencies(options);
  const outcomes = family(configuration.family);
  return withWorkspaceRelationshipMutation(input.workspace_id, async () => {
    const read = await readForMutation(deps, input.workspace_id, input.expected_workspace_version, outcomes);
    if (read.conflict) return conflictResult(outcomes.conflict, read.workspace, null, read.error);
    const current = read.workspace;
    const currentRelationship = findRelationship(current, input.relationship_id, outcomes.failed);
    if (input.evidence_reference !== undefined) {
      validateEvidenceReference(input.evidence_reference);
      if (input.evidence_reference.reference_type !== configuration.evidenceType) {
        throw new WorkspaceContractError(
          ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
          `Relationship evidence must use reference_type ${configuration.evidenceType}`
        );
      }
    }
    if (currentRelationship.relationship_status === configuration.targetStatus) {
      return result(
        configuration.noopOutcome,
        false,
        current,
        current,
        currentRelationship,
        null,
        null
      );
    }
    if (!configuration.allowedFrom.includes(currentRelationship.relationship_status)) {
      return conflictResult(outcomes.conflict, current, currentRelationship, {
        code: WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_CONFLICT,
        message: `Relationship cannot ${configuration.action} from ${currentRelationship.relationship_status}`
      });
    }
    validateProjectRelationshipTransition(currentRelationship.relationship_status, configuration.targetStatus);
    const now = timestamp(deps.now);
    const next = semanticWorkspace(current, now);
    const index = next.project_relationships.findIndex((item) => item.relationship_id === input.relationship_id);
    const previousRelationship = deepCopy(currentRelationship);
    const relationship = next.project_relationships[index];
    relationship.relationship_status = configuration.targetStatus;
    relationship.updated_at = now;
    configuration.update(relationship, now);
    assertRelationshipIdImmutable(previousRelationship, relationship);
    validateProjectRelationship(relationship);
    appendEvidence(next, input.evidence_reference, configuration.evidenceType);
    validateWorkspaceRecord(next);
    const persistence = await persist(deps, next, outcomes, null);
    const changedOutcome = typeof configuration.changedOutcome === "function"
      ? configuration.changedOutcome(previousRelationship)
      : configuration.changedOutcome;
    const fields = typeof configuration.fields === "function"
      ? configuration.fields(previousRelationship)
      : configuration.fields || {};
    return result(
      changedOutcome,
      true,
      current,
      next,
      relationship,
      persistence,
      null,
      { previous_relationship: previousRelationship, fields }
    );
  });
}

function completeWorkspaceProjectAttach(input, options = {}) {
  return transitionRelationship(input, options, {
    label: "complete attach input",
    family: "attach",
    action: "complete attachment",
    allowedFrom: ["PENDING_ATTACH"],
    targetStatus: "ATTACHED",
    evidenceType: "workspace_attach",
    changedOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_SUCCESS,
    noopOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_SUCCESS,
    update(relationship, now) {
      relationship.attached_at = now;
      relationship.detached_at = null;
      relationship.archived_at = null;
    }
  });
}

function abandonWorkspaceProjectAttach(input, options = {}) {
  return transitionRelationship(input, options, {
    label: "abandon attach input",
    family: "attach",
    action: "be abandoned",
    allowedFrom: ["PENDING_ATTACH"],
    targetStatus: "ARCHIVED",
    evidenceType: "workspace_relationship_archive",
    changedOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED,
    noopOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED,
    fields: { abandonment_committed: true },
    update(relationship, now) {
      relationship.archived_at = now;
    }
  });
}

function beginWorkspaceProjectDetach(input, options = {}) {
  return transitionRelationship(input, options, {
    label: "begin detach input",
    family: "detach",
    action: "begin detachment",
    allowedFrom: ["ATTACHED"],
    targetStatus: "PENDING_DETACH",
    evidenceType: null,
    changedOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_PENDING,
    noopOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_PENDING,
    update(relationship) {
      relationship.detached_at = null;
      relationship.archived_at = null;
    }
  });
}

function completeWorkspaceProjectDetach(input, options = {}) {
  return transitionRelationship(input, options, {
    label: "complete detach input",
    family: "detach",
    action: "complete detachment",
    allowedFrom: ["PENDING_DETACH"],
    targetStatus: "DETACHED",
    evidenceType: "workspace_detach",
    changedOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_SUCCESS,
    noopOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_SUCCESS,
    update(relationship, now) {
      relationship.detached_at = now;
      relationship.archived_at = null;
    }
  });
}

function rollbackWorkspaceProjectDetach(input, options = {}) {
  return transitionRelationship(input, options, {
    label: "rollback detach input",
    family: "detach",
    action: "roll back detachment",
    allowedFrom: ["PENDING_DETACH"],
    targetStatus: "ATTACHED",
    evidenceType: null,
    changedOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_FAILED,
    noopOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_FAILED,
    fields: { rollback_committed: true },
    update(relationship) {
      relationship.detached_at = null;
      relationship.archived_at = null;
    }
  });
}

async function archiveWorkspaceProjectRelationship(input, options = {}) {
  return transitionRelationship(input, options, {
    label: "archive relationship input",
    family: "detach",
    action: "be archived",
    allowedFrom: ["PENDING_ATTACH", "DETACHED"],
    targetStatus: "ARCHIVED",
    evidenceType: "workspace_relationship_archive",
    changedOutcome: (previous) => previous.relationship_status === "PENDING_ATTACH"
      ? WORKSPACE_RELATIONSHIP_OUTCOMES.ATTACH_FAILED
      : WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_SUCCESS,
    noopOutcome: WORKSPACE_RELATIONSHIP_OUTCOMES.DETACH_SUCCESS,
    fields: (previous) => previous.relationship_status === "PENDING_ATTACH"
      ? { abandonment_committed: true }
      : {},
    update(target, now) {
      target.archived_at = now;
    }
  });
}

async function getWorkspaceProjectRelationship(input, options = {}) {
  assertExactInput(input, ["workspace_id", "relationship_id"], [], "relationship read input");
  const deps = dependencies(options);
  const inspection = await deps.storage.inspectWorkspaceStorage(deps.root, input.workspace_id);
  if (isRecoveryRequired(inspection)) throw recoveryError(input.workspace_id, inspection, family("attach"));
  const workspace = await strictRead(deps, input.workspace_id, family("attach"));
  return deepCopy(findRelationship(workspace, input.relationship_id));
}

async function listWorkspaceProjectRelationships(input, options = {}) {
  assertExactInput(
    input,
    ["workspace_id"],
    ["project_id", "relationship_status", "validation_state"],
    "relationship list input"
  );
  if (input.project_id !== undefined) validateProjectId(input.project_id);
  if (input.relationship_status !== undefined) validateProjectRelationshipStatus(input.relationship_status);
  if (input.validation_state !== undefined) validateValidationState(input.validation_state);
  const deps = dependencies(options);
  const inspection = await deps.storage.inspectWorkspaceStorage(deps.root, input.workspace_id);
  if (isRecoveryRequired(inspection)) throw recoveryError(input.workspace_id, inspection, family("attach"));
  const workspace = await strictRead(deps, input.workspace_id, family("attach"));
  return workspace.project_relationships
    .filter((relationship) => input.project_id === undefined || relationship.project_id === input.project_id)
    .filter((relationship) => input.relationship_status === undefined
      || relationship.relationship_status === input.relationship_status)
    .filter((relationship) => input.validation_state === undefined
      || relationship.validation_state === input.validation_state)
    .map((relationship) => deepCopy(relationship));
}

module.exports = Object.freeze({
  beginWorkspaceProjectAttach,
  completeWorkspaceProjectAttach,
  abandonWorkspaceProjectAttach,
  beginWorkspaceProjectDetach,
  completeWorkspaceProjectDetach,
  rollbackWorkspaceProjectDetach,
  archiveWorkspaceProjectRelationship,
  getWorkspaceProjectRelationship,
  listWorkspaceProjectRelationships,
  withWorkspaceRelationshipMutation,
  WorkspaceRelationshipRuntimeError,
  WORKSPACE_RELATIONSHIP_ERROR_CODES,
  WORKSPACE_RELATIONSHIP_OUTCOMES,
  ACTIVE_RELATIONSHIP_STATES,
  SINGLE_WRITER_ASSUMPTION
});

void ATTACH_OUTCOMES;
void DETACH_OUTCOMES;
void committedStorage.WorkspaceStorageError;
void committedProjectIdentity.ProjectIdentityError;
void committedProjectIdentity.PROJECT_IDENTITY_ERROR_CODES;

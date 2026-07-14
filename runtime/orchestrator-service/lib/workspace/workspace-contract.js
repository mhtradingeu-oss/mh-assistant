"use strict";

const crypto = require("node:crypto");

const WORKSPACE_ID_REGEX = /^ws_[0-9a-f]{32}$/;
const PROJECT_ID_REGEX = /^prj_[0-9a-f]{32}$/;
const PROJECT_RELATIONSHIP_ID_REGEX = /^wpr_[0-9a-f]{32}$/;

const WORKSPACE_SCHEMA_VERSION = 1;

const WORKSPACE_LIFECYCLE_STATES = Object.freeze([
  "CREATING",
  "ACTIVE",
  "SUSPENDED",
  "ARCHIVED",
  "FAILED"
]);

const WORKSPACE_OWNERSHIP_STATES = Object.freeze([
  "UNCLAIMED",
  "SHADOW",
  "CLAIMED",
  "VERIFIED",
  "TRANSFER_PENDING"
]);

const P1_1_OPERATIONAL_OWNERSHIP_STATES = Object.freeze([
  "UNCLAIMED",
  "SHADOW"
]);

const PROJECT_RELATIONSHIP_STATES = Object.freeze([
  "PENDING_ATTACH",
  "ATTACHED",
  "PENDING_DETACH",
  "DETACHED",
  "ARCHIVED"
]);

const EVIDENCE_REFERENCE_TYPES = Object.freeze([
  "workspace_creation",
  "workspace_activation",
  "workspace_suspension",
  "workspace_resumption",
  "workspace_failure",
  "workspace_archive",
  "workspace_attach",
  "workspace_detach",
  "workspace_relationship_archive",
  "workspace_recovery",
  "workspace_projection_rebuild",
  "workspace_ownership_shadow"
]);

const ATTACH_OUTCOMES = Object.freeze([
  "ATTACH_SUCCESS",
  "ATTACH_PENDING",
  "ATTACH_PROJECTION_PARTIAL",
  "ATTACH_CONFLICT",
  "ATTACH_RECOVERY_REQUIRED",
  "ATTACH_FAILED"
]);

const DETACH_OUTCOMES = Object.freeze([
  "DETACH_SUCCESS",
  "DETACH_PENDING",
  "DETACH_PROJECTION_PARTIAL",
  "DETACH_CONFLICT",
  "DETACH_RECOVERY_REQUIRED",
  "DETACH_FAILED"
]);

const VALIDATION_STATES = Object.freeze([
  "VALID",
  "UNRESOLVED_PROJECT",
  "PROJECT_ID_COLLISION",
  "MATCH",
  "MISSING",
  "STALE",
  "CONFLICTING"
]);

const WORKSPACE_TRANSITIONS = Object.freeze({
  CREATING: Object.freeze(["ACTIVE", "FAILED"]),
  ACTIVE: Object.freeze(["SUSPENDED", "ARCHIVED"]),
  SUSPENDED: Object.freeze(["ACTIVE", "ARCHIVED"]),
  ARCHIVED: Object.freeze([]),
  FAILED: Object.freeze(["ARCHIVED", "CREATING"])
});

const PROJECT_RELATIONSHIP_TRANSITIONS = Object.freeze({
  PENDING_ATTACH: Object.freeze(["ATTACHED", "ARCHIVED"]),
  ATTACHED: Object.freeze(["PENDING_DETACH"]),
  PENDING_DETACH: Object.freeze(["DETACHED", "ATTACHED"]),
  DETACHED: Object.freeze(["ARCHIVED"]),
  ARCHIVED: Object.freeze([])
});

const WORKSPACE_FIELDS = Object.freeze([
  "schema_version",
  "workspace_id",
  "workspace_version",
  "workspace_name",
  "status",
  "ownership_state",
  "created_at",
  "updated_at",
  "project_relationships",
  "evidence_references"
]);

const PROJECT_RELATIONSHIP_FIELDS = Object.freeze([
  "relationship_id",
  "project_id",
  "relationship_status",
  "validation_state",
  "created_at",
  "updated_at",
  "attached_at",
  "detached_at",
  "archived_at"
]);

const EVIDENCE_REFERENCE_FIELDS = Object.freeze([
  "reference_type",
  "reference_id",
  "source_owner",
  "recorded_at"
]);

const ERROR_CODES = Object.freeze({
  INVALID_INPUT: "WORKSPACE_CONTRACT_INVALID_INPUT",
  MISSING_FIELD: "WORKSPACE_CONTRACT_MISSING_FIELD",
  UNKNOWN_WORKSPACE_FIELD: "WORKSPACE_CONTRACT_UNKNOWN_WORKSPACE_FIELD",
  UNKNOWN_RELATIONSHIP_FIELD: "WORKSPACE_CONTRACT_UNKNOWN_RELATIONSHIP_FIELD",
  UNKNOWN_EVIDENCE_FIELD: "WORKSPACE_CONTRACT_UNKNOWN_EVIDENCE_FIELD",
  INVALID_WORKSPACE_ID: "WORKSPACE_CONTRACT_INVALID_WORKSPACE_ID",
  INVALID_PROJECT_ID: "WORKSPACE_CONTRACT_INVALID_PROJECT_ID",
  INVALID_RELATIONSHIP_ID: "WORKSPACE_CONTRACT_INVALID_RELATIONSHIP_ID",
  AUTHORITATIVE_ID_NOT_ALLOWED: "WORKSPACE_CONTRACT_AUTHORITATIVE_ID_NOT_ALLOWED",
  INVALID_SCHEMA_VERSION: "WORKSPACE_CONTRACT_INVALID_SCHEMA_VERSION",
  INVALID_WORKSPACE_VERSION: "WORKSPACE_CONTRACT_INVALID_WORKSPACE_VERSION",
  INVALID_WORKSPACE_NAME: "WORKSPACE_CONTRACT_INVALID_WORKSPACE_NAME",
  INVALID_TIMESTAMP: "WORKSPACE_CONTRACT_INVALID_TIMESTAMP",
  INVALID_WORKSPACE_STATUS: "WORKSPACE_CONTRACT_INVALID_WORKSPACE_STATUS",
  INVALID_OWNERSHIP_STATE: "WORKSPACE_CONTRACT_INVALID_OWNERSHIP_STATE",
  OWNERSHIP_STATE_NOT_OPERATIONAL: "WORKSPACE_CONTRACT_OWNERSHIP_STATE_NOT_OPERATIONAL",
  INVALID_RELATIONSHIP_STATUS: "WORKSPACE_CONTRACT_INVALID_RELATIONSHIP_STATUS",
  INVALID_VALIDATION_STATE: "WORKSPACE_CONTRACT_INVALID_VALIDATION_STATE",
  INVALID_EVIDENCE_REFERENCE_TYPE: "WORKSPACE_CONTRACT_INVALID_EVIDENCE_REFERENCE_TYPE",
  INVALID_EVIDENCE_REFERENCE: "WORKSPACE_CONTRACT_INVALID_EVIDENCE_REFERENCE",
  SENSITIVE_EVIDENCE_DATA: "WORKSPACE_CONTRACT_SENSITIVE_EVIDENCE_DATA",
  PROJECT_SLUG_FORBIDDEN: "WORKSPACE_CONTRACT_PROJECT_SLUG_FORBIDDEN",
  DUPLICATE_RELATIONSHIP_ID: "WORKSPACE_CONTRACT_DUPLICATE_RELATIONSHIP_ID",
  RELATIONSHIP_ID_IMMUTABLE: "WORKSPACE_CONTRACT_RELATIONSHIP_ID_IMMUTABLE",
  RELATIONSHIP_ID_REUSE: "WORKSPACE_CONTRACT_RELATIONSHIP_ID_REUSE",
  INVALID_WORKSPACE_TRANSITION: "WORKSPACE_CONTRACT_INVALID_WORKSPACE_TRANSITION",
  INVALID_RELATIONSHIP_TRANSITION: "WORKSPACE_CONTRACT_INVALID_RELATIONSHIP_TRANSITION",
  INVALID_ATTACH_OUTCOME: "WORKSPACE_CONTRACT_INVALID_ATTACH_OUTCOME",
  INVALID_DETACH_OUTCOME: "WORKSPACE_CONTRACT_INVALID_DETACH_OUTCOME",
  WORKSPACE_VERSION_CONFLICT: "WORKSPACE_CONTRACT_WORKSPACE_VERSION_CONFLICT"
});

class WorkspaceContractError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "WorkspaceContractError";
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

function fail(code, message, details) {
  throw new WorkspaceContractError(code, message, details);
}

function isPlainObject(value) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    fail(ERROR_CODES.INVALID_INPUT, `${label} must be a plain object`);
  }
}

function assertExactFields(value, allowedFields, unknownCode, label) {
  assertPlainObject(value, label);
  const allowed = new Set(allowedFields);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      fail(unknownCode, `${label} contains unknown field: ${key}`, { field: key });
    }
  }
  for (const key of allowedFields) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      fail(ERROR_CODES.MISSING_FIELD, `${label} is missing required field: ${key}`, { field: key });
    }
  }
}

function validateId(value, regex, errorCode, label) {
  if (typeof value !== "string" || !regex.test(value)) {
    fail(errorCode, `${label} has an invalid format`);
  }
  return value;
}

function isValidWorkspaceId(value) {
  return typeof value === "string" && WORKSPACE_ID_REGEX.test(value);
}

function isValidProjectId(value) {
  return typeof value === "string" && PROJECT_ID_REGEX.test(value);
}

function isValidProjectRelationshipId(value) {
  return typeof value === "string" && PROJECT_RELATIONSHIP_ID_REGEX.test(value);
}

function validateWorkspaceId(value) {
  return validateId(value, WORKSPACE_ID_REGEX, ERROR_CODES.INVALID_WORKSPACE_ID, "workspace_id");
}

function validateProjectId(value) {
  return validateId(value, PROJECT_ID_REGEX, ERROR_CODES.INVALID_PROJECT_ID, "project_id");
}

function validateProjectRelationshipId(value) {
  return validateId(
    value,
    PROJECT_RELATIONSHIP_ID_REGEX,
    ERROR_CODES.INVALID_RELATIONSHIP_ID,
    "relationship_id"
  );
}

function generateId(prefix, regex, errorCode, randomUUID) {
  const uuid = randomUUID().replace(/-/g, "").toLowerCase();
  return validateId(`${prefix}${uuid}`, regex, errorCode, `${prefix} identifier`);
}

function generateWorkspaceId(randomUUID = crypto.randomUUID) {
  return generateId("ws_", WORKSPACE_ID_REGEX, ERROR_CODES.INVALID_WORKSPACE_ID, randomUUID);
}

function generateProjectId(randomUUID = crypto.randomUUID) {
  return generateId("prj_", PROJECT_ID_REGEX, ERROR_CODES.INVALID_PROJECT_ID, randomUUID);
}

function generateProjectRelationshipId(randomUUID = crypto.randomUUID) {
  return generateId(
    "wpr_",
    PROJECT_RELATIONSHIP_ID_REGEX,
    ERROR_CODES.INVALID_RELATIONSHIP_ID,
    randomUUID
  );
}

function rejectCallerProvidedId(input, fields) {
  assertPlainObject(input, "creation input");
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      fail(
        ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED,
        `Caller-provided authoritative creation field is not allowed: ${field}`,
        { field }
      );
    }
  }
}

function validateWorkspaceCreationInput(input) {
  rejectCallerProvidedId(input, [
    "id",
    "workspace_id",
    "workspaceId",
    "workspace_version",
    "schema_version"
  ]);
  if (Object.prototype.hasOwnProperty.call(input, "ownership_state")) {
    validateOperationalOwnershipState(input.ownership_state);
  }
  return input;
}

function validateProjectCreationInput(input) {
  rejectCallerProvidedId(input, ["id", "project_id", "projectId"]);
  return input;
}

function validateProjectRelationshipCreationInput(input) {
  rejectCallerProvidedId(input, ["id", "relationship_id", "relationshipId"]);
  if (Object.prototype.hasOwnProperty.call(input, "project_slug")
    || Object.prototype.hasOwnProperty.call(input, "slug")) {
    fail(ERROR_CODES.PROJECT_SLUG_FORBIDDEN, "Project slug cannot be relationship identity");
  }
  if (Object.prototype.hasOwnProperty.call(input, "project_id")) validateProjectId(input.project_id);
  return input;
}

function validateEnum(value, values, code, label) {
  if (!values.includes(value)) fail(code, `${label} is not recognized`, { value });
  return value;
}

function validateWorkspaceStatus(value) {
  return validateEnum(value, WORKSPACE_LIFECYCLE_STATES, ERROR_CODES.INVALID_WORKSPACE_STATUS, "status");
}

function validateOwnershipState(value) {
  return validateEnum(value, WORKSPACE_OWNERSHIP_STATES, ERROR_CODES.INVALID_OWNERSHIP_STATE, "ownership_state");
}

function validateOperationalOwnershipState(value) {
  validateOwnershipState(value);
  if (!P1_1_OPERATIONAL_OWNERSHIP_STATES.includes(value)) {
    fail(
      ERROR_CODES.OWNERSHIP_STATE_NOT_OPERATIONAL,
      `Ownership state is outside the P1.1 operational contract: ${value}`
    );
  }
  return value;
}

function validateProjectRelationshipStatus(value) {
  return validateEnum(
    value,
    PROJECT_RELATIONSHIP_STATES,
    ERROR_CODES.INVALID_RELATIONSHIP_STATUS,
    "relationship_status"
  );
}

function validateValidationState(value) {
  return validateEnum(value, VALIDATION_STATES, ERROR_CODES.INVALID_VALIDATION_STATE, "validation_state");
}

function validateAttachOutcome(value) {
  return validateEnum(value, ATTACH_OUTCOMES, ERROR_CODES.INVALID_ATTACH_OUTCOME, "attach outcome");
}

function validateDetachOutcome(value) {
  return validateEnum(value, DETACH_OUTCOMES, ERROR_CODES.INVALID_DETACH_OUTCOME, "detach outcome");
}

function validateTimestamp(value, label, nullable = false) {
  if (nullable && value === null) return value;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    || Number.isNaN(Date.parse(value))) {
    fail(ERROR_CODES.INVALID_TIMESTAMP, `${label} must be a UTC ISO-8601 timestamp`);
  }
  return value;
}

function validateWorkspaceName(value) {
  if (typeof value !== "string" || value.length < 1 || value.length > 200 || value.trim() !== value) {
    fail(ERROR_CODES.INVALID_WORKSPACE_NAME, "workspace_name must be a trimmed string of 1 to 200 characters");
  }
  return value;
}

const SENSITIVE_EVIDENCE_KEY = /^(authorization|credentials?|password|secret|token|api[_-]?key|access[_-]?key|control[_-]?key|write[_-]?key|read[_-]?key)$/i;
const SENSITIVE_EVIDENCE_VALUE = /(?:\bbearer\s+\S+|(?:password|secret|token|api[_-]?key|authorization)\s*[:=])/i;

function assertNoSensitiveEvidence(value) {
  for (const [key, nestedValue] of Object.entries(value)) {
    if (SENSITIVE_EVIDENCE_KEY.test(key)) {
      fail(ERROR_CODES.SENSITIVE_EVIDENCE_DATA, `Evidence cannot contain sensitive field: ${key}`);
    }
    if (typeof nestedValue === "string" && SENSITIVE_EVIDENCE_VALUE.test(nestedValue)) {
      fail(ERROR_CODES.SENSITIVE_EVIDENCE_DATA, "Evidence cannot contain raw authorization or credential data");
    }
  }
}

function validateEvidenceReference(reference) {
  assertPlainObject(reference, "evidence reference");
  assertNoSensitiveEvidence(reference);
  assertExactFields(
    reference,
    EVIDENCE_REFERENCE_FIELDS,
    ERROR_CODES.UNKNOWN_EVIDENCE_FIELD,
    "evidence reference"
  );
  validateEnum(
    reference.reference_type,
    EVIDENCE_REFERENCE_TYPES,
    ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE,
    "reference_type"
  );
  if (typeof reference.reference_id !== "string" || reference.reference_id.length < 1
    || reference.reference_id.length > 200) {
    fail(ERROR_CODES.INVALID_EVIDENCE_REFERENCE, "reference_id must be a non-empty bounded string");
  }
  if (typeof reference.source_owner !== "string" || reference.source_owner.length < 1
    || reference.source_owner.length > 120) {
    fail(ERROR_CODES.INVALID_EVIDENCE_REFERENCE, "source_owner must be a non-empty bounded string");
  }
  validateTimestamp(reference.recorded_at, "recorded_at");
  return reference;
}

function validateProjectRelationship(relationship) {
  assertPlainObject(relationship, "project relationship");
  if (Object.prototype.hasOwnProperty.call(relationship, "project_slug")
    || Object.prototype.hasOwnProperty.call(relationship, "slug")) {
    fail(ERROR_CODES.PROJECT_SLUG_FORBIDDEN, "Project slug cannot be stored in a Workspace relationship");
  }
  assertExactFields(
    relationship,
    PROJECT_RELATIONSHIP_FIELDS,
    ERROR_CODES.UNKNOWN_RELATIONSHIP_FIELD,
    "project relationship"
  );
  validateProjectRelationshipId(relationship.relationship_id);
  validateProjectId(relationship.project_id);
  validateProjectRelationshipStatus(relationship.relationship_status);
  validateValidationState(relationship.validation_state);
  validateTimestamp(relationship.created_at, "relationship.created_at");
  validateTimestamp(relationship.updated_at, "relationship.updated_at");
  validateTimestamp(relationship.attached_at, "relationship.attached_at", true);
  validateTimestamp(relationship.detached_at, "relationship.detached_at", true);
  validateTimestamp(relationship.archived_at, "relationship.archived_at", true);
  return relationship;
}

function assertRelationshipIdImmutable(previous, next) {
  validateProjectRelationship(previous);
  validateProjectRelationship(next);
  if (previous.relationship_id !== next.relationship_id) {
    fail(ERROR_CODES.RELATIONSHIP_ID_IMMUTABLE, "relationship_id cannot change");
  }
  return true;
}

function assertRelationshipIdNotReused(relationships, relationshipId) {
  if (!Array.isArray(relationships)) fail(ERROR_CODES.INVALID_INPUT, "relationships must be an array");
  validateProjectRelationshipId(relationshipId);
  if (relationships.some((relationship) => relationship.relationship_id === relationshipId)) {
    fail(ERROR_CODES.RELATIONSHIP_ID_REUSE, "relationship_id values are never reusable");
  }
  return true;
}

function validateWorkspaceRecord(workspace) {
  assertExactFields(workspace, WORKSPACE_FIELDS, ERROR_CODES.UNKNOWN_WORKSPACE_FIELD, "workspace");
  if (workspace.schema_version !== WORKSPACE_SCHEMA_VERSION) {
    fail(ERROR_CODES.INVALID_SCHEMA_VERSION, `schema_version must equal ${WORKSPACE_SCHEMA_VERSION}`);
  }
  validateWorkspaceId(workspace.workspace_id);
  if (!Number.isSafeInteger(workspace.workspace_version) || workspace.workspace_version < 1) {
    fail(ERROR_CODES.INVALID_WORKSPACE_VERSION, "workspace_version must be a positive safe integer");
  }
  validateWorkspaceName(workspace.workspace_name);
  validateWorkspaceStatus(workspace.status);
  validateOwnershipState(workspace.ownership_state);
  validateTimestamp(workspace.created_at, "created_at");
  validateTimestamp(workspace.updated_at, "updated_at");
  if (!Array.isArray(workspace.project_relationships)) {
    fail(ERROR_CODES.INVALID_INPUT, "project_relationships must be an array");
  }
  if (!Array.isArray(workspace.evidence_references)) {
    fail(ERROR_CODES.INVALID_INPUT, "evidence_references must be an array");
  }
  const relationshipIds = new Set();
  for (const relationship of workspace.project_relationships) {
    validateProjectRelationship(relationship);
    if (relationshipIds.has(relationship.relationship_id)) {
      fail(ERROR_CODES.DUPLICATE_RELATIONSHIP_ID, "relationship_id must be unique within a Workspace");
    }
    relationshipIds.add(relationship.relationship_id);
  }
  workspace.evidence_references.forEach(validateEvidenceReference);
  return workspace;
}

function isWorkspaceTransitionAllowed(from, to) {
  return WORKSPACE_LIFECYCLE_STATES.includes(from)
    && WORKSPACE_LIFECYCLE_STATES.includes(to)
    && WORKSPACE_TRANSITIONS[from].includes(to);
}

function validateWorkspaceTransition(from, to) {
  validateWorkspaceStatus(from);
  validateWorkspaceStatus(to);
  if (!isWorkspaceTransitionAllowed(from, to)) {
    fail(ERROR_CODES.INVALID_WORKSPACE_TRANSITION, `Workspace transition is not allowed: ${from} -> ${to}`);
  }
  return true;
}

function isProjectRelationshipTransitionAllowed(from, to) {
  return PROJECT_RELATIONSHIP_STATES.includes(from)
    && PROJECT_RELATIONSHIP_STATES.includes(to)
    && PROJECT_RELATIONSHIP_TRANSITIONS[from].includes(to);
}

function validateProjectRelationshipTransition(from, to) {
  validateProjectRelationshipStatus(from);
  validateProjectRelationshipStatus(to);
  if (!isProjectRelationshipTransitionAllowed(from, to)) {
    fail(
      ERROR_CODES.INVALID_RELATIONSHIP_TRANSITION,
      `Project relationship transition is not allowed: ${from} -> ${to}`
    );
  }
  return true;
}

function validateExpectedWorkspaceVersion(currentVersion, expectedVersion) {
  if (!Number.isSafeInteger(currentVersion) || currentVersion < 1
    || !Number.isSafeInteger(expectedVersion) || expectedVersion < 1) {
    fail(ERROR_CODES.INVALID_WORKSPACE_VERSION, "Workspace versions must be positive safe integers");
  }
  if (currentVersion !== expectedVersion) {
    fail(ERROR_CODES.WORKSPACE_VERSION_CONFLICT, "expected_workspace_version is stale", {
      current_workspace_version: currentVersion,
      expected_workspace_version: expectedVersion
    });
  }
  return true;
}

function doesWorkspaceStatusGrantAuthorization() {
  return false;
}

module.exports = Object.freeze({
  WORKSPACE_ID_REGEX,
  PROJECT_ID_REGEX,
  PROJECT_RELATIONSHIP_ID_REGEX,
  WORKSPACE_SCHEMA_VERSION,
  WORKSPACE_LIFECYCLE_STATES,
  WORKSPACE_OWNERSHIP_STATES,
  P1_1_OPERATIONAL_OWNERSHIP_STATES,
  PROJECT_RELATIONSHIP_STATES,
  EVIDENCE_REFERENCE_TYPES,
  ATTACH_OUTCOMES,
  DETACH_OUTCOMES,
  VALIDATION_STATES,
  DRIFT_VALIDATION_STATES: VALIDATION_STATES,
  WORKSPACE_TRANSITIONS,
  PROJECT_RELATIONSHIP_TRANSITIONS,
  WORKSPACE_FIELDS,
  PROJECT_RELATIONSHIP_FIELDS,
  EVIDENCE_REFERENCE_FIELDS,
  ERROR_CODES,
  WorkspaceContractError,
  isValidWorkspaceId,
  isValidProjectId,
  isValidProjectRelationshipId,
  validateWorkspaceId,
  validateProjectId,
  validateProjectRelationshipId,
  generateWorkspaceId,
  generateProjectId,
  generateProjectRelationshipId,
  validateWorkspaceCreationInput,
  validateProjectCreationInput,
  validateProjectRelationshipCreationInput,
  validateWorkspaceStatus,
  validateOwnershipState,
  validateOperationalOwnershipState,
  validateProjectRelationshipStatus,
  validateValidationState,
  validateAttachOutcome,
  validateDetachOutcome,
  validateEvidenceReference,
  validateProjectRelationship,
  validateWorkspaceRecord,
  assertRelationshipIdImmutable,
  assertRelationshipIdNotReused,
  isWorkspaceTransitionAllowed,
  validateWorkspaceTransition,
  isProjectRelationshipTransitionAllowed,
  validateProjectRelationshipTransition,
  validateExpectedWorkspaceVersion,
  doesWorkspaceStatusGrantAuthorization
});

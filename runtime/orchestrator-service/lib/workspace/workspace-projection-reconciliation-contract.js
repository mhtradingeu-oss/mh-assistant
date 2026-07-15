"use strict";

const {
  validateWorkspaceId,
  validateProjectRelationshipId,
  validateExpectedWorkspaceVersion,
  validateEvidenceReference
} = require("./workspace-contract");

const RECONCILIATION_ACTIONS = Object.freeze([
  "WRITE_MISSING_PROJECTION",
  "UPDATE_STALE_PROJECTION",
  "COMPLETE_PENDING_ATTACH",
  "COMPLETE_PENDING_DETACH"
]);

const RECONCILIATION_CONTRACT_OUTCOMES = Object.freeze({
  VALID: "CONTRACT_VALID",
  INVALID: "CONTRACT_INVALID",
  STALE_INSPECTION: "CONTRACT_STALE_INSPECTION",
  INELIGIBLE: "CONTRACT_INELIGIBLE",
  CONFLICT: "CONTRACT_CONFLICT",
  RECOVERY_REQUIRED: "CONTRACT_RECOVERY_REQUIRED"
});

const RECONCILIATION_EXECUTION_OWNERS = Object.freeze({
  WRITE_MISSING_PROJECTION: "project-workspace-projection-writer",
  UPDATE_STALE_PROJECTION: "project-workspace-projection-writer",
  COMPLETE_PENDING_ATTACH: "workspace-projection-orchestrator",
  COMPLETE_PENDING_DETACH: "workspace-projection-orchestrator"
});

const RECONCILIATION_CONTRACT_ERROR_CODES = Object.freeze({
  INPUT_INVALID: "RECONCILIATION_CONTRACT_INPUT_INVALID",
  UNKNOWN_FIELD: "RECONCILIATION_CONTRACT_UNKNOWN_FIELD",
  ACTION_INVALID: "RECONCILIATION_CONTRACT_ACTION_INVALID",
  INSPECTION_INVALID: "RECONCILIATION_CONTRACT_INSPECTION_INVALID",
  INSPECTION_FINGERPRINT_INVALID:
    "RECONCILIATION_CONTRACT_INSPECTION_FINGERPRINT_INVALID",
  INSPECTION_FINGERPRINT_MISMATCH:
    "RECONCILIATION_CONTRACT_INSPECTION_FINGERPRINT_MISMATCH",
  WORKSPACE_VERSION_MISMATCH:
    "RECONCILIATION_CONTRACT_WORKSPACE_VERSION_MISMATCH",
  RECOMMENDATION_MISMATCH:
    "RECONCILIATION_CONTRACT_RECOMMENDATION_MISMATCH",
  INELIGIBLE: "RECONCILIATION_CONTRACT_INELIGIBLE",
  RESOLUTION_BLOCKED: "RECONCILIATION_CONTRACT_RESOLUTION_BLOCKED",
  ALIGNMENT_CONFLICT: "RECONCILIATION_CONTRACT_ALIGNMENT_CONFLICT",
  RECOVERY_REQUIRED: "RECONCILIATION_CONTRACT_RECOVERY_REQUIRED",
  EVIDENCE_INVALID: "RECONCILIATION_CONTRACT_EVIDENCE_INVALID"
});

const REQUEST_FIELDS = Object.freeze([
  "workspace_id",
  "relationship_id",
  "action",
  "expected_workspace_version",
  "expected_inspection_fingerprint",
  "evidence_reference"
]);

const INSPECTION_FINGERPRINT_FIELDS = Object.freeze([
  "workspace_id",
  "relationship_id",
  "project_id",
  "observed_relationship_status",
  "observed_workspace_version",
  "resolution_state",
  "authority_alignment",
  "operation_readiness",
  "observed_projection_fingerprint",
  "expected_projection_fingerprint",
  "recommended_action"
]);

class WorkspaceProjectionReconciliationContractError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "WorkspaceProjectionReconciliationContractError";
    this.code = code;
    this.details = Object.freeze(deepCopy(details));
  }
}

function deepCopy(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function freezeCopy(value) {
  return Object.freeze(deepCopy(value));
}

function fail(code, message, details) {
  throw new WorkspaceProjectionReconciliationContractError(
    code,
    message,
    details
  );
}

function assertPlainObject(value, label) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.INPUT_INVALID,
      `${label} must be an object`
    );
  }
}

function assertExactFields(value, fields, label) {
  assertPlainObject(value, label);

  const allowed = new Set(fields);

  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      fail(
        RECONCILIATION_CONTRACT_ERROR_CODES.UNKNOWN_FIELD,
        `${label} contains unknown field: ${key}`,
        { field: key }
      );
    }
  }

  for (const key of fields) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      fail(
        RECONCILIATION_CONTRACT_ERROR_CODES.INPUT_INVALID,
        `${label} is missing required field: ${key}`,
        { field: key }
      );
    }
  }
}

function normalizeFingerprintPart(value) {
  if (value === undefined) return null;
  return value;
}

function createReconciliationInspectionFingerprint(inspection) {
  assertPlainObject(inspection, "inspection");

  const normalized = {};

  for (const field of INSPECTION_FINGERPRINT_FIELDS) {
    normalized[field] = normalizeFingerprintPart(inspection[field]);
  }

  return Object.freeze(normalized);
}

function fingerprintsEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateAction(action) {
  if (!RECONCILIATION_ACTIONS.includes(action)) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.ACTION_INVALID,
      `Unsupported reconciliation action: ${action}`,
      { action }
    );
  }

  return action;
}

function validateReconciliationRequest(input) {
  assertExactFields(input, REQUEST_FIELDS, "reconciliation request");

  try {
    validateWorkspaceId(input.workspace_id);
    validateProjectRelationshipId(input.relationship_id);
    validateExpectedWorkspaceVersion(
      input.expected_workspace_version,
      input.expected_workspace_version
    );
  } catch (error) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.INPUT_INVALID,
      error.message,
      {
        owner_code: error.code || null,
        owner_details: error.details || null
      }
    );
  }

  validateAction(input.action);

  assertPlainObject(
    input.expected_inspection_fingerprint,
    "expected_inspection_fingerprint"
  );

  try {
    validateEvidenceReference(input.evidence_reference);
  } catch (error) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.EVIDENCE_INVALID,
      error.message,
      {
        owner_code: error.code || null,
        owner_details: error.details || null
      }
    );
  }

  if (
    input.evidence_reference.reference_type !==
    "workspace_projection_rebuild"
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.EVIDENCE_INVALID,
      "Reconciliation requires workspace_projection_rebuild evidence",
      {
        reference_type:
          input.evidence_reference.reference_type
      }
    );
  }

  return freezeCopy(input);
}

function validateInspectionForAction(request, inspection) {
  assertPlainObject(inspection, "inspection");

  if (
    inspection.workspace_id !== request.workspace_id ||
    inspection.relationship_id !== request.relationship_id
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.INSPECTION_INVALID,
      "Inspection identity does not match reconciliation request"
    );
  }

  if (
    inspection.observed_workspace_version !==
    request.expected_workspace_version
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.WORKSPACE_VERSION_MISMATCH,
      "Observed Workspace version does not match expected version",
      {
        expected_workspace_version:
          request.expected_workspace_version,
        observed_workspace_version:
          inspection.observed_workspace_version
      }
    );
  }

  const actualFingerprint =
    createReconciliationInspectionFingerprint(inspection);

  if (
    !fingerprintsEqual(
      actualFingerprint,
      request.expected_inspection_fingerprint
    )
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES
        .INSPECTION_FINGERPRINT_MISMATCH,
      "Inspection fingerprint no longer matches approved state",
      {
        expected_inspection_fingerprint:
          request.expected_inspection_fingerprint,
        actual_inspection_fingerprint:
          actualFingerprint
      }
    );
  }

  if (inspection.storage_health !== "HEALTHY") {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.RECOVERY_REQUIRED,
      "Storage recovery is required before reconciliation",
      { storage_health: inspection.storage_health }
    );
  }

  if (inspection.resolution_state !== "RESOLVED") {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.RESOLUTION_BLOCKED,
      "Project resolution must be RESOLVED",
      { resolution_state: inspection.resolution_state }
    );
  }

  if (inspection.repair_eligibility !== "ELIGIBLE") {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.INELIGIBLE,
      "Inspection is not eligible for reconciliation",
      { repair_eligibility: inspection.repair_eligibility }
    );
  }

  if (inspection.recommended_action !== request.action) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.RECOMMENDATION_MISMATCH,
      "Requested action does not match inspector recommendation",
      {
        requested_action: request.action,
        recommended_action: inspection.recommended_action
      }
    );
  }

  if (inspection.authority_alignment === "CONFLICTING") {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.ALIGNMENT_CONFLICT,
      "Conflicting authority cannot be reconciled automatically"
    );
  }

  return actualFingerprint;
}

function expectedActionContract(action) {
  switch (action) {
    case "WRITE_MISSING_PROJECTION":
      return Object.freeze({
        authority_alignment: "MISSING",
        allowed_relationship_statuses:
          Object.freeze(["ATTACHED", "DETACHED", "ARCHIVED"]),
        operation_readiness:
          Object.freeze(["READY_TO_PROJECT", "PARTIAL"])
      });

    case "UPDATE_STALE_PROJECTION":
      return Object.freeze({
        authority_alignment: "STALE",
        allowed_relationship_statuses:
          Object.freeze(["ATTACHED", "DETACHED", "ARCHIVED"]),
        operation_readiness:
          Object.freeze(["READY_TO_PROJECT", "PARTIAL"])
      });

    case "COMPLETE_PENDING_ATTACH":
      return Object.freeze({
        authority_alignment: "AHEAD_OF_AUTHORITY",
        allowed_relationship_statuses:
          Object.freeze(["PENDING_ATTACH"]),
        operation_readiness:
          Object.freeze(["READY_TO_COMPLETE_TERMINAL"])
      });

    case "COMPLETE_PENDING_DETACH":
      return Object.freeze({
        authority_alignment: "AHEAD_OF_AUTHORITY",
        allowed_relationship_statuses:
          Object.freeze(["PENDING_DETACH"]),
        operation_readiness:
          Object.freeze(["READY_TO_COMPLETE_TERMINAL"])
      });

    default:
      validateAction(action);
      return null;
  }
}

function validateActionSemantics(action, inspection) {
  const contract = expectedActionContract(action);

  if (
    inspection.authority_alignment !==
    contract.authority_alignment
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.ALIGNMENT_CONFLICT,
      "Inspection alignment does not satisfy action contract",
      {
        expected_alignment: contract.authority_alignment,
        actual_alignment: inspection.authority_alignment
      }
    );
  }

  if (
    !contract.allowed_relationship_statuses.includes(
      inspection.observed_relationship_status
    )
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.INELIGIBLE,
      "Relationship status does not satisfy action contract",
      {
        relationship_status:
          inspection.observed_relationship_status
      }
    );
  }

  if (
    !contract.operation_readiness.includes(
      inspection.operation_readiness
    )
  ) {
    fail(
      RECONCILIATION_CONTRACT_ERROR_CODES.INELIGIBLE,
      "Operation readiness does not satisfy action contract",
      {
        operation_readiness:
          inspection.operation_readiness
      }
    );
  }

  return contract;
}

function buildWorkspaceProjectionReconciliationPlan(
  input,
  inspection
) {
  const request = validateReconciliationRequest(input);
  const fingerprint =
    validateInspectionForAction(request, inspection);
  const actionContract =
    validateActionSemantics(request.action, inspection);

  return Object.freeze({
    outcome:
      RECONCILIATION_CONTRACT_OUTCOMES.VALID,
    executable: false,
    execution_deferred_to: "P1.1F-D4",
    direction: "WORKSPACE_AUTHORITY_TO_PROJECT_PROJECTION",
    action: request.action,
    execution_owner:
      RECONCILIATION_EXECUTION_OWNERS[request.action],
    workspace_id: request.workspace_id,
    relationship_id: request.relationship_id,
    project_id: inspection.project_id,
    expected_workspace_version:
      request.expected_workspace_version,
    inspection_fingerprint: fingerprint,
    evidence_reference:
      freezeCopy(request.evidence_reference),
    action_contract: actionContract,
    before: freezeCopy({
      resolution_state: inspection.resolution_state,
      authority_alignment: inspection.authority_alignment,
      operation_readiness: inspection.operation_readiness,
      storage_health: inspection.storage_health,
      observed_relationship_status:
        inspection.observed_relationship_status,
      observed_projection_fingerprint:
        inspection.observed_projection_fingerprint,
      expected_projection_fingerprint:
        inspection.expected_projection_fingerprint
    })
  });
}

module.exports = Object.freeze({
  RECONCILIATION_ACTIONS,
  RECONCILIATION_CONTRACT_OUTCOMES,
  RECONCILIATION_EXECUTION_OWNERS,
  RECONCILIATION_CONTRACT_ERROR_CODES,
  INSPECTION_FINGERPRINT_FIELDS,
  WorkspaceProjectionReconciliationContractError,
  createReconciliationInspectionFingerprint,
  validateReconciliationRequest,
  buildWorkspaceProjectionReconciliationPlan
});

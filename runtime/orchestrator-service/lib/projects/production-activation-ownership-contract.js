"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const { validateActivationExecutorResult } = require("./activation-executor-contract");

const PRODUCTION_ACTIVATION_OWNERSHIP_SCHEMA_VERSION = 1;
const OWNERSHIP_STATES = Object.freeze([
  "BLOCKED_ACTIVATION",
  "MISSING_REQUESTER",
  "MISSING_ACTIVATION_APPROVER",
  "MISSING_EXECUTION_OWNER",
  "MISSING_AUDIT_OWNER",
  "OWNERSHIP_CHAIN_ACCEPTED"
]);

class ProductionActivationOwnershipContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ProductionActivationOwnershipContractError";
    this.code = "PRODUCTION_ACTIVATION_OWNERSHIP_CONTRACT_INVALID";
    this.details = Object.freeze(copy(details));
  }
}

function copy(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function fail(message, details) {
  throw new ProductionActivationOwnershipContractError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the ownership contract`, { actual, expected });
  }
}

function present(value) {
  return typeof value === "string" && value.length > 0;
}

function validateAbsentRole(value, fields, state, sourceOwner, label) {
  if (value.state !== state || value.source_owner !== sourceOwner
    || fields.some((field) => value[field] !== null) || value.evidence_ref !== null) {
    fail(`${label} absence projection is invalid`);
  }
}

function validateRequester(value, applicable, executorBoundary) {
  const fields = ["requester_id", "requester_type"];
  assertExactFields(value, ["state", ...fields, "source_owner", "evidence_ref"], "requester");
  if (!applicable) return validateAbsentRole(value, fields, "NOT_APPLICABLE", "backend-request-context", "requester");
  const source = executorBoundary.source_evidence.authority_model.requester;
  if (source.state !== "PRESENT") return validateAbsentRole(value, fields, "MISSING", "backend-request-context", "requester");
  if (value.state !== "PRESENT" || value.requester_id !== source.requester_id
    || value.requester_type !== source.requester_type || value.source_owner !== "backend-request-context"
    || value.evidence_ref !== source.evidence_ref) fail("requester does not project Phase I evidence");
}

function validateApprover(value, applicable, executorBoundary) {
  const fields = ["approver_id", "approval_id", "decision", "decided_at"];
  assertExactFields(value, ["state", ...fields, "source_owner", "evidence_ref"], "activation_approver");
  if (!applicable) return validateAbsentRole(value, fields, "NOT_APPLICABLE", "operations-backbone", "activation approver");
  const source = executorBoundary.approval_evidence;
  if (source.state !== "VALID") return validateAbsentRole(value, fields, "MISSING", "operations-backbone", "activation approver");
  if (value.state !== "PRESENT" || value.approver_id !== source.decided_by
    || value.approval_id !== source.approval_id || value.decision !== "APPROVED"
    || value.decided_at !== source.decided_at || value.source_owner !== "operations-backbone"
    || value.evidence_ref !== source.evidence_ref) fail("activation approver does not project Governance evidence");
}

function validateExecutionOwner(value, applicable, executorBoundary) {
  const fields = ["owner", "project_id", "mode"];
  assertExactFields(value, ["state", ...fields, "source_owner", "evidence_ref"], "execution_owner");
  if (!applicable) return validateAbsentRole(value, fields, "NOT_APPLICABLE", "workspace-runtime", "execution owner");
  const source = executorBoundary.execution_authority;
  if (source.state !== "VALID") return validateAbsentRole(value, fields, "MISSING", "workspace-runtime", "execution owner");
  if (value.state !== "PRESENT" || value.owner !== "workspace-runtime"
    || value.project_id !== source.project_id || value.mode !== "DRY_RUN"
    || value.source_owner !== "workspace-runtime" || value.evidence_ref !== source.evidence_ref) {
    fail("execution owner does not project Workspace Runtime evidence");
  }
}

function validateAuditOwner(value, applicable, projectSlug) {
  const fields = ["owner", "project_slug"];
  assertExactFields(value, ["state", ...fields, "source_owner", "evidence_ref"], "audit_owner");
  if (!applicable) return validateAbsentRole(value, fields, "NOT_APPLICABLE", "operations-backbone", "audit owner");
  if (value.state === "MISSING") return validateAbsentRole(value, fields, "MISSING", "operations-backbone", "audit owner");
  if (value.state !== "PRESENT" || value.owner !== "operations-backbone"
    || value.project_slug !== projectSlug
    || value.source_owner !== "operations-backbone" || !present(value.evidence_ref)) {
    fail("audit owner must be existing Governance evidence custody");
  }
}

function validateAuthority(value) {
  assertExactFields(value, [
    "requester_source", "activation_approver_source", "execution_owner_source",
    "audit_owner_source", "project_id_owner", "workspace_project_owner",
    "executor_boundary_owner", "creates_approval", "executes_activation",
    "creates_workspace", "creates_project", "creates_identity", "mutates_permissions",
    "mutates_roles", "mutates_data", "mutates_filesystem", "backend_authoritative",
    "frontend_projection_only"
  ], "authority");
  const expected = {
    requester_source: "backend-request-context",
    activation_approver_source: "operations-backbone",
    execution_owner_source: "workspace-runtime",
    audit_owner_source: "operations-backbone",
    project_id_owner: "project-identity",
    workspace_project_owner: "workspace-relationship-runtime",
    executor_boundary_owner: "activation-executor-boundary",
    creates_approval: false,
    executes_activation: false,
    creates_workspace: false,
    creates_project: false,
    creates_identity: false,
    mutates_permissions: false,
    mutates_roles: false,
    mutates_data: false,
    mutates_filesystem: false,
    backend_authoritative: true,
    frontend_projection_only: true
  };
  if (Object.entries(expected).some(([field, item]) => value[field] !== item)) fail("authority declaration is invalid");
}

function validateProductionActivationOwnership(value) {
  assertExactFields(value, [
    "schema_version", "kind", "ownership_state", "project_slug", "requester",
    "activation_approver", "execution_owner", "audit_owner", "source_evidence",
    "safety", "authority"
  ], "production activation ownership decision");
  if (value.schema_version !== PRODUCTION_ACTIVATION_OWNERSHIP_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "read_only_production_activation_ownership_decision") fail("kind is invalid");
  if (!OWNERSHIP_STATES.includes(value.ownership_state)) fail("ownership_state is invalid");

  let projectSlug;
  try { projectSlug = normalizeProjectSlug(value.project_slug); } catch { fail("project_slug is invalid"); }
  if (projectSlug !== value.project_slug) fail("project_slug is not canonical");

  assertExactFields(value.source_evidence, ["source_owner", "executor_boundary"], "source_evidence");
  let executorBoundary;
  try { executorBoundary = validateActivationExecutorResult(value.source_evidence.executor_boundary); } catch (error) {
    fail("Phase I executor-boundary evidence is invalid", { cause: error.code || null });
  }
  if (value.source_evidence.source_owner !== "activation-executor-boundary"
    || executorBoundary.project_slug !== projectSlug) fail("Phase I evidence is not scoped to the requested Project");

  const workflowReady = executorBoundary.source_evidence.authority_model.source_evidence.workflow.readiness.ready;
  validateRequester(value.requester, workflowReady, executorBoundary);
  validateApprover(value.activation_approver, workflowReady, executorBoundary);
  validateExecutionOwner(value.execution_owner, workflowReady, executorBoundary);

  let expectedState = "BLOCKED_ACTIVATION";
  if (workflowReady) {
    if (value.requester.state !== "PRESENT") expectedState = "MISSING_REQUESTER";
    else if (value.activation_approver.state !== "PRESENT") expectedState = "MISSING_ACTIVATION_APPROVER";
    else if (value.execution_owner.state !== "PRESENT") expectedState = "MISSING_EXECUTION_OWNER";
    else expectedState = "PENDING_AUDIT_OWNER";
  }
  const auditApplicable = expectedState === "PENDING_AUDIT_OWNER";
  validateAuditOwner(value.audit_owner, auditApplicable, projectSlug);
  if (auditApplicable) expectedState = value.audit_owner.state === "PRESENT"
    ? "OWNERSHIP_CHAIN_ACCEPTED"
    : "MISSING_AUDIT_OWNER";
  if (value.ownership_state !== expectedState) fail("ownership_state contradicts validated role evidence");

  const accepted = expectedState === "OWNERSHIP_CHAIN_ACCEPTED";
  assertExactFields(value.safety, [
    "ownership_chain_complete", "ownership_chain_accepted", "production_authorized",
    "activation_executable", "activation_executed", "workspace_mutated", "project_mutated",
    "identity_generated", "permissions_mutated", "roles_mutated", "approval_created",
    "filesystem_mutated"
  ], "safety");
  const expectedSafety = {
    ownership_chain_complete: accepted,
    ownership_chain_accepted: accepted,
    production_authorized: executorBoundary.safety.production_authorized,
    activation_executable: false,
    activation_executed: false,
    workspace_mutated: false,
    project_mutated: false,
    identity_generated: false,
    permissions_mutated: false,
    roles_mutated: false,
    approval_created: false,
    filesystem_mutated: false
  };
  if (Object.entries(expectedSafety).some(([field, item]) => value.safety[field] !== item)) fail("safety declaration is invalid");
  validateAuthority(value.authority);
  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  PRODUCTION_ACTIVATION_OWNERSHIP_SCHEMA_VERSION,
  OWNERSHIP_STATES,
  ProductionActivationOwnershipContractError,
  validateProductionActivationOwnership
});

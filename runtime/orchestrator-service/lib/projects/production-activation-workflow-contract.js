"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const { validateOnboardingOrchestration } = require("./onboarding-orchestration-contract");

const PRODUCTION_ACTIVATION_WORKFLOW_SCHEMA_VERSION = 1;
const WORKFLOW_STATES = Object.freeze([
  "PREREQUISITES_REQUIRED",
  "MISSING_AUTHORITY"
]);

class ProductionActivationWorkflowContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ProductionActivationWorkflowContractError";
    this.code = "PRODUCTION_ACTIVATION_WORKFLOW_CONTRACT_INVALID";
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
  throw new ProductionActivationWorkflowContractError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the production activation workflow contract`, { actual, expected });
  }
}

function isSortedUniqueStrings(values) {
  return Array.isArray(values)
    && values.every((value) => typeof value === "string" && value.length > 0)
    && JSON.stringify(values) === JSON.stringify([...new Set(values)].sort());
}

function validateAuthority(value) {
  assertExactFields(value, [
    "workspace_id_owner", "project_id_owner", "workspace_project_owner", "contract_owner",
    "readiness_owner", "bootstrap_owner", "onboarding_owner", "workflow_owner",
    "authorization_owner", "approval_owner", "execution_owner", "creates_workspace",
    "creates_project", "creates_identity", "writes_binding", "writes_registry",
    "writes_project_files", "writes_approval", "executes_activation", "migrates_data",
    "mutates_data", "mutates_filesystem", "backend_authoritative", "frontend_projection_only"
  ], "authority");
  const expected = {
    workspace_id_owner: "workspace-runtime",
    project_id_owner: "project-identity",
    workspace_project_owner: "workspace-relationship-runtime",
    contract_owner: "universal-project-contract",
    readiness_owner: "project-activation-assessment",
    bootstrap_owner: "bootstrap-authority-assessment",
    onboarding_owner: "onboarding-orchestration",
    workflow_owner: "production-activation-workflow",
    authorization_owner: null,
    approval_owner: "operations-backbone",
    execution_owner: null,
    creates_workspace: false,
    creates_project: false,
    creates_identity: false,
    writes_binding: false,
    writes_registry: false,
    writes_project_files: false,
    writes_approval: false,
    executes_activation: false,
    migrates_data: false,
    mutates_data: false,
    mutates_filesystem: false,
    backend_authoritative: true,
    frontend_projection_only: true
  };
  if (Object.entries(expected).some(([field, expectedValue]) => value[field] !== expectedValue)) {
    fail("authority declaration is invalid");
  }
}

function validateProductionActivationWorkflow(value) {
  assertExactFields(value, [
    "schema_version", "kind", "workflow_state", "activation_request", "authorization",
    "readiness", "required_authority", "approval_requirement", "execution_owner",
    "source_evidence", "authority"
  ], "production activation workflow");
  if (value.schema_version !== PRODUCTION_ACTIVATION_WORKFLOW_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "governed_production_activation_workflow") fail("kind is invalid");
  if (!WORKFLOW_STATES.includes(value.workflow_state)) fail("workflow_state is invalid");

  assertExactFields(value.activation_request, ["type", "project_slug", "state"], "activation_request");
  if (value.activation_request.type !== "REQUEST_PRODUCTION_ACTIVATION"
    || value.activation_request.state !== "ASSESSED_READ_ONLY") {
    fail("activation request is invalid");
  }
  let projectSlug;
  try { projectSlug = normalizeProjectSlug(value.activation_request.project_slug); } catch { fail("project_slug is invalid"); }
  if (projectSlug !== value.activation_request.project_slug) fail("project_slug is not canonical");

  assertExactFields(value.source_evidence, ["source_owner", "orchestration"], "source_evidence");
  let orchestration;
  try { orchestration = validateOnboardingOrchestration(value.source_evidence.orchestration); } catch (error) {
    fail("Phase F onboarding evidence is invalid", { cause: error.code || null });
  }
  if (value.source_evidence.source_owner !== "onboarding-orchestration"
    || orchestration.user_intent.project_slug !== projectSlug) {
    fail("source evidence is not scoped to the activation request");
  }

  assertExactFields(value.authorization, ["state", "authorized", "source_owner", "reason"], "authorization");
  if (value.authorization.state !== "MISSING_AUTHORITY"
    || value.authorization.authorized !== false
    || value.authorization.source_owner !== null
    || value.authorization.reason !== "PRODUCTION_ACTIVATION_AUTHORIZATION_OWNER_NOT_PROVEN") {
    fail("authorization must fail closed while its owner is unproven");
  }

  assertExactFields(value.readiness, ["state", "ready", "blockers", "source_owner"], "readiness");
  if (typeof value.readiness.ready !== "boolean"
    || !isSortedUniqueStrings(value.readiness.blockers)
    || value.readiness.source_owner !== "project-activation-assessment"
    || value.readiness.state !== orchestration.activation_outcome.state
    || value.readiness.ready !== orchestration.activation_outcome.ready
    || JSON.stringify(value.readiness.blockers) !== JSON.stringify(orchestration.activation_outcome.blockers)) {
    fail("readiness contradicts Phase D evidence projected through Phase F");
  }

  assertExactFields(value.required_authority, ["state", "owners", "source_owner"], "required_authority");
  const prerequisiteRequired = orchestration.required_next_step.required;
  const expectedAuthorityState = prerequisiteRequired ? "PREREQUISITE_AUTHORITY_REQUIRED" : "PRODUCTION_ACTIVATION_AUTHORITY_UNRESOLVED";
  const expectedOwners = prerequisiteRequired
    ? orchestration.required_next_step.responsible_authorities
    : [];
  if (value.required_authority.state !== expectedAuthorityState
    || !isSortedUniqueStrings(value.required_authority.owners)
    || JSON.stringify(value.required_authority.owners) !== JSON.stringify(expectedOwners)
    || value.required_authority.source_owner !== "bootstrap-authority-assessment") {
    fail("required authority contradicts Phase E evidence projected through Phase F");
  }

  assertExactFields(value.approval_requirement, ["state", "required", "satisfied", "source_owner"], "approval_requirement");
  const approvalRequired = value.readiness.ready;
  if (value.approval_requirement.state !== (approvalRequired ? "REQUIRED" : "NOT_APPLICABLE")
    || value.approval_requirement.required !== approvalRequired
    || value.approval_requirement.satisfied !== false
    || value.approval_requirement.source_owner !== "operations-backbone") {
    fail("approval requirement is invalid");
  }

  assertExactFields(value.execution_owner, ["state", "owner", "executable", "reason"], "execution_owner");
  if (value.execution_owner.state !== "UNRESOLVED"
    || value.execution_owner.owner !== null
    || value.execution_owner.executable !== false
    || value.execution_owner.reason !== "PRODUCTION_ACTIVATION_EXECUTION_OWNER_NOT_PROVEN") {
    fail("execution owner must remain unresolved");
  }

  const expectedWorkflowState = prerequisiteRequired ? "PREREQUISITES_REQUIRED" : "MISSING_AUTHORITY";
  if (value.workflow_state !== expectedWorkflowState) fail("workflow state contradicts Phase F evidence");
  if (value.readiness.ready && value.workflow_state !== "MISSING_AUTHORITY") {
    fail("a ready Project must fail closed without authorization and execution ownership");
  }

  validateAuthority(value.authority);
  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  PRODUCTION_ACTIVATION_WORKFLOW_SCHEMA_VERSION,
  WORKFLOW_STATES,
  ProductionActivationWorkflowContractError,
  validateProductionActivationWorkflow
});

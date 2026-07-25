"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const { validateActivationAuthorityModel } = require("./activation-authority-contract");

const ACTIVATION_EXECUTOR_SCHEMA_VERSION = 1;
const EXECUTION_RESULT_STATES = Object.freeze([
  "BLOCKED_ACTIVATION",
  "MISSING_APPROVAL",
  "MISSING_EXECUTOR",
  "DRY_RUN_READY"
]);

class ActivationExecutorContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ActivationExecutorContractError";
    this.code = "ACTIVATION_EXECUTOR_CONTRACT_INVALID";
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
  throw new ActivationExecutorContractError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the activation executor contract`, { actual, expected });
  }
}

function present(value) {
  return typeof value === "string" && value.length > 0;
}

function validateApproval(value, projectSlug, applicable) {
  assertExactFields(value, [
    "state", "approval_id", "decision", "project_slug", "action", "policy_version",
    "decided_by", "decided_at", "source_owner", "evidence_ref"
  ], "approval_evidence");
  const approved = value.state === "VALID";
  if (!applicable) {
    if (value.state !== "NOT_APPLICABLE" || Object.entries(value).some(([field, item]) => field !== "state" && item !== null)) {
      fail("blocked activation must not invent approval evidence");
    }
    return;
  }
  if (!["VALID", "MISSING"].includes(value.state)) fail("approval evidence state is invalid");
  if (!approved) {
    if (Object.entries(value).some(([field, item]) => field !== "state" && item !== null)) {
      fail("missing approval must not contain partial or invented evidence");
    }
    return;
  }
  if (![value.approval_id, value.policy_version, value.decided_by, value.decided_at, value.evidence_ref].every(present)
    || value.decision !== "APPROVED"
    || value.project_slug !== projectSlug
    || value.action !== "ACTIVATE_PROJECT"
    || value.source_owner !== "operations-backbone") {
    fail("approval evidence is invalid or not scoped to the requested Project");
  }
}

function validateExecutor(value, projectSlug, projectId, applicable) {
  assertExactFields(value, [
    "state", "executor_id", "project_slug", "project_id", "action", "mode",
    "source_owner", "evidence_ref"
  ], "execution_authority");
  const valid = value.state === "VALID";
  if (!applicable) {
    if (value.state !== "NOT_APPLICABLE" || Object.entries(value).some(([field, item]) => field !== "state" && item !== null)) {
      fail("blocked activation must not invent executor evidence");
    }
    return;
  }
  if (!["VALID", "MISSING"].includes(value.state)) fail("execution authority state is invalid");
  if (!valid) {
    if (Object.entries(value).some(([field, item]) => field !== "state" && item !== null)) {
      fail("missing executor must not contain partial or invented evidence");
    }
    return;
  }
  if (!present(value.evidence_ref)
    || value.executor_id !== "workspace-runtime"
    || value.project_slug !== projectSlug
    || value.project_id !== projectId
    || value.action !== "ACTIVATE_PROJECT"
    || value.mode !== "DRY_RUN"
    || value.source_owner !== "workspace-runtime") {
    fail("execution authority is invalid or not scoped to the requested Project");
  }
}

function validatePlan(value, ready, projectSlug) {
  assertExactFields(value, ["state", "mode", "project_slug", "steps"], "execution_plan");
  if (value.mode !== "DRY_RUN" || value.project_slug !== projectSlug) fail("execution plan scope or mode is invalid");
  if (!ready) {
    if (value.state !== "NOT_CREATED" || !Array.isArray(value.steps) || value.steps.length !== 0) {
      fail("an incomplete boundary must not create an execution plan");
    }
    return;
  }
  if (value.state !== "CREATED" || !Array.isArray(value.steps) || value.steps.length !== 4) {
    fail("dry-run plan is incomplete");
  }
  const expected = [
    [1, "VALIDATE_PROJECT_IDENTITY", "project-identity"],
    [2, "VALIDATE_WORKSPACE_STATE", "workspace-runtime"],
    [3, "VALIDATE_WORKSPACE_PROJECT_BINDING", "workspace-relationship-runtime"],
    [4, "SIMULATE_ACTIVATION_RESULT", "activation-executor-boundary"]
  ];
  value.steps.forEach((step, index) => {
    assertExactFields(step, ["order", "action", "authority_owner", "mutation_allowed"], `execution_plan.steps[${index}]`);
    const [order, action, owner] = expected[index];
    if (step.order !== order || step.action !== action || step.authority_owner !== owner || step.mutation_allowed !== false) {
      fail("dry-run plan changes order, authority, or mutation safety");
    }
  });
}

function validateAuthority(value) {
  assertExactFields(value, [
    "approval_owner", "execution_owner", "project_id_owner", "workspace_project_owner",
    "boundary_owner", "validates_evidence", "creates_plan", "executes_activation",
    "creates_workspace", "creates_project", "creates_identity", "writes_binding",
    "writes_registry", "writes_approval", "mutates_data", "mutates_filesystem",
    "backend_authoritative", "frontend_projection_only"
  ], "authority");
  const expected = {
    approval_owner: "operations-backbone",
    execution_owner: "workspace-runtime",
    project_id_owner: "project-identity",
    workspace_project_owner: "workspace-relationship-runtime",
    boundary_owner: "activation-executor-boundary",
    validates_evidence: true,
    creates_plan: true,
    executes_activation: false,
    creates_workspace: false,
    creates_project: false,
    creates_identity: false,
    writes_binding: false,
    writes_registry: false,
    writes_approval: false,
    mutates_data: false,
    mutates_filesystem: false,
    backend_authoritative: true,
    frontend_projection_only: true
  };
  if (Object.entries(expected).some(([field, expectedValue]) => value[field] !== expectedValue)) {
    fail("authority declaration is invalid");
  }
}

function validateActivationExecutorResult(value) {
  assertExactFields(value, [
    "schema_version", "kind", "result_state", "project_slug", "approval_evidence",
    "execution_authority", "execution_plan", "activation_result", "source_evidence",
    "safety", "authority"
  ], "activation executor result");
  if (value.schema_version !== ACTIVATION_EXECUTOR_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "read_only_activation_executor_result") fail("kind is invalid");
  if (!EXECUTION_RESULT_STATES.includes(value.result_state)) fail("result_state is invalid");

  let projectSlug;
  try { projectSlug = normalizeProjectSlug(value.project_slug); } catch { fail("project_slug is invalid"); }
  if (projectSlug !== value.project_slug) fail("project_slug is not canonical");

  assertExactFields(value.source_evidence, ["source_owner", "authority_model"], "source_evidence");
  let authorityModel;
  try { authorityModel = validateActivationAuthorityModel(value.source_evidence.authority_model); } catch (error) {
    fail("Phase H authority evidence is invalid", { cause: error.code || null });
  }
  if (value.source_evidence.source_owner !== "activation-authority-model" || authorityModel.project_slug !== projectSlug) {
    fail("Phase H evidence is not scoped to the requested Project");
  }

  const applicable = authorityModel.authority_state === "FULLY_SPECIFIED_READY_ACTIVATION";
  const projectId = authorityModel.source_evidence.workflow.source_evidence.orchestration.current_state.project_id;
  validateApproval(value.approval_evidence, projectSlug, applicable);
  validateExecutor(value.execution_authority, projectSlug, projectId, applicable);

  let expectedState = "BLOCKED_ACTIVATION";
  if (applicable) {
    if (value.approval_evidence.state !== "VALID") expectedState = "MISSING_APPROVAL";
    else if (value.execution_authority.state !== "VALID") expectedState = "MISSING_EXECUTOR";
    else expectedState = "DRY_RUN_READY";
  }
  if (value.result_state !== expectedState) fail("result_state contradicts validated evidence");
  const ready = expectedState === "DRY_RUN_READY";
  validatePlan(value.execution_plan, ready, projectSlug);

  assertExactFields(value.activation_result, ["state", "mode", "activated", "reason"], "activation_result");
  if (value.activation_result.state !== (ready ? "SIMULATED" : "NOT_RUN")
    || value.activation_result.mode !== "DRY_RUN"
    || value.activation_result.activated !== false
    || value.activation_result.reason !== (ready ? "DRY_RUN_PLAN_VALIDATED_NO_ACTIVATION" : expectedState)) {
    fail("activation result is invalid");
  }

  assertExactFields(value.safety, [
    "production_authorized", "dry_run_only", "activation_executable", "activation_executed",
    "workspace_mutated", "project_mutated", "identity_generated", "binding_mutated",
    "registry_mutated", "filesystem_mutated"
  ], "safety");
  const expectedSafety = {
    production_authorized: authorityModel.authorization.authorized,
    dry_run_only: true,
    activation_executable: false,
    activation_executed: false,
    workspace_mutated: false,
    project_mutated: false,
    identity_generated: false,
    binding_mutated: false,
    registry_mutated: false,
    filesystem_mutated: false
  };
  if (Object.entries(expectedSafety).some(([field, expectedValue]) => value.safety[field] !== expectedValue)) {
    fail("safety declaration is invalid");
  }
  validateAuthority(value.authority);
  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  ACTIVATION_EXECUTOR_SCHEMA_VERSION,
  EXECUTION_RESULT_STATES,
  ActivationExecutorContractError,
  validateActivationExecutorResult
});

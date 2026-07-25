"use strict";

const crypto = require("node:crypto");
const { validateWorkspaceRecord } = require("./workspace-contract");
const {
  isGovernedCreationRequest,
  markGovernedCreationRequest
} = require("./workspace-approval-authority-provenance");

const CONTROLLED_WORKSPACE_CREATION_SCHEMA_VERSION = 1;
const TARGET_WORKSPACE_NAME = "MH Trading";
const RESULT_STATES = Object.freeze(["DRY_RUN_READY", "CREATED", "ALREADY_EXISTS"]);

const AUTHORITY = Object.freeze({
  contract_owner: "controlled-workspace-creation-contract",
  boundary_owner: "controlled-workspace-creation-boundary",
  workspace_writer_owner: "workspace-runtime",
  approval_evidence_owner: "governance-approval-engine",
  creates_project: false,
  creates_identity: false,
  creates_binding: false,
  migrates_data: false
});

class ControlledWorkspaceCreationContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ControlledWorkspaceCreationContractError";
    this.code = "CONTROLLED_WORKSPACE_CREATION_CONTRACT_INVALID";
    this.details = deepFreeze(copy(details));
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
  throw new ControlledWorkspaceCreationContractError(message, details);
}

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
}

function exact(value, fields, label) {
  object(value, label);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields are invalid`, { actual, expected });
  }
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function workspaceCreationPlanId(planSeed) {
  const semanticSeed = copy(planSeed);
  delete semanticSeed.plan_id;
  return `wscplan_${crypto.createHash("sha256").update(canonical(semanticSeed)).digest("hex")}`;
}

function validateTimestamp(value, label) {
  if (typeof value !== "string"
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    || Number.isNaN(Date.parse(value))) {
    fail(`${label} must be a UTC ISO-8601 timestamp`);
  }
}

function validateOwnershipEvidence(value) {
  exact(
    value,
    ["evidence_id", "workspace_name", "action", "decision", "owner", "decided_by", "decided_at", "source_owner"],
    "ownership_evidence"
  );
  if (typeof value.evidence_id !== "string"
    || !/^approval[_-][A-Za-z0-9][A-Za-z0-9:_-]{2,191}$/.test(value.evidence_id)) {
    fail("ownership_evidence.evidence_id is invalid");
  }
  if (value.workspace_name !== TARGET_WORKSPACE_NAME
    || value.action !== "CREATE_WORKSPACE"
    || value.decision !== "APPROVED"
    || value.owner !== "MH Trading Owner"
    || value.source_owner !== "governance-approval-engine") {
    fail("ownership evidence does not authorize the MH Trading Workspace creation");
  }
  if (typeof value.decided_by !== "string" || value.decided_by.trim() !== value.decided_by
    || value.decided_by.length < 1 || value.decided_by.length > 120) {
    fail("ownership_evidence.decided_by is invalid");
  }
  validateTimestamp(value.decided_at, "ownership_evidence.decided_at");
  return deepFreeze(copy(value));
}

function validateCreationRequest(value) {
  if (!isGovernedCreationRequest(value)) {
    fail("Creation request must come from the governed approval handoff");
  }
  exact(value, ["workspace_name", "ownership_evidence"], "creation request");
  if (value.workspace_name !== TARGET_WORKSPACE_NAME) fail("Only the MH Trading Workspace is in scope");
  const ownershipEvidence = validateOwnershipEvidence(value.ownership_evidence);
  if (ownershipEvidence.workspace_name !== value.workspace_name) fail("ownership evidence is cross-Workspace");
  return markGovernedCreationRequest(deepFreeze(copy(value)));
}

function validatePlan(plan, evidenceId) {
  exact(plan, ["plan_id", "mode", "workspace_name", "evidence_id", "steps"], "plan");
  if (plan.mode !== "DRY_RUN" || plan.workspace_name !== TARGET_WORKSPACE_NAME
    || plan.evidence_id !== evidenceId || !/^wscplan_[a-f0-9]{64}$/.test(plan.plan_id)) {
    fail("plan identity or scope is invalid");
  }
  const expected = [
    [1, "REVALIDATE_GOVERNANCE_APPROVAL", "governance-approval-engine", false],
    [2, "LOOK_UP_CREATION_EVIDENCE", "workspace-runtime", false],
    [3, "CREATE_WORKSPACE", "workspace-runtime", true]
  ];
  if (!Array.isArray(plan.steps) || plan.steps.length !== expected.length) {
    fail("plan must contain exactly three ordered steps");
  }
  plan.steps.forEach((step, index) => {
    exact(step, ["order", "action", "authority_owner", "mutation_allowed"], `plan.steps[${index}]`);
    if (JSON.stringify([step.order, step.action, step.authority_owner, step.mutation_allowed])
      !== JSON.stringify(expected[index])) fail("plan step is invalid");
  });
  if (workspaceCreationPlanId(plan) !== plan.plan_id) fail("plan is not deterministic");
}

function validateSnapshot(value, label) {
  exact(value, ["exists", "workspace_id", "workspace_version", "workspace_name", "status", "creation_evidence_present"], label);
  if (typeof value.exists !== "boolean" || typeof value.creation_evidence_present !== "boolean") {
    fail(`${label} booleans are invalid`);
  }
  if (!value.exists) {
    if (value.workspace_id !== null || value.workspace_version !== null || value.workspace_name !== null
      || value.status !== null || value.creation_evidence_present) fail(`${label} invents Workspace evidence`);
    return;
  }
  if (!/^ws_[a-f0-9]{32}$/.test(value.workspace_id) || value.workspace_name !== TARGET_WORKSPACE_NAME
    || !Number.isSafeInteger(value.workspace_version) || value.workspace_version < 1
    || typeof value.status !== "string" || !value.creation_evidence_present) {
    fail(`${label} Workspace evidence is invalid`);
  }
}

function validateControlledWorkspaceCreationResult(value) {
  exact(
    value,
    ["schema_version", "kind", "mode", "result_state", "workspace_name", "plan", "before", "after", "mutation", "source_evidence", "safety", "authority"],
    "creation result"
  );
  if (value.schema_version !== CONTROLLED_WORKSPACE_CREATION_SCHEMA_VERSION
    || value.kind !== "controlled_workspace_creation_result") fail("result schema or kind is invalid");
  if (!["DRY_RUN", "APPLY"].includes(value.mode) || !RESULT_STATES.includes(value.result_state)
    || value.workspace_name !== TARGET_WORKSPACE_NAME) fail("result mode, state, or scope is invalid");
  exact(value.source_evidence, ["source_owner", "ownership"], "source_evidence");
  const ownership = validateOwnershipEvidence(value.source_evidence.ownership);
  if (value.source_evidence.source_owner !== "governance-approval-engine") fail("source evidence owner is invalid");
  validatePlan(value.plan, ownership.evidence_id);
  validateSnapshot(value.before, "before");
  validateSnapshot(value.after, "after");
  exact(value.mutation, ["attempted", "owner", "workspace_created", "workspace_id"], "mutation");
  exact(
    value.safety,
    ["dry_run_first", "plan_matched", "project_mutated", "hairoticmen_mutated", "identity_generated", "binding_created", "data_migrated", "duplicate_workspace", "unrelated_writes"],
    "safety"
  );
  if (!value.safety.dry_run_first || value.safety.project_mutated || value.safety.hairoticmen_mutated
    || value.safety.identity_generated || value.safety.binding_created || value.safety.data_migrated
    || value.safety.duplicate_workspace || value.safety.unrelated_writes) fail("safety declaration is invalid");
  exact(value.authority, Object.keys(AUTHORITY), "authority");
  if (Object.entries(AUTHORITY).some(([key, expected]) => value.authority[key] !== expected)) {
    fail("authority declaration is invalid");
  }
  if (value.mode === "DRY_RUN") {
    if (value.result_state !== "DRY_RUN_READY" || JSON.stringify(value.before) !== JSON.stringify(value.after)
      || value.mutation.attempted || value.mutation.owner !== null || value.mutation.workspace_created
      || value.mutation.workspace_id !== null || value.safety.plan_matched) fail("dry-run result is invalid");
  } else {
    if (!["CREATED", "ALREADY_EXISTS"].includes(value.result_state) || !value.safety.plan_matched
      || !value.after.exists || !value.after.creation_evidence_present) fail("apply result is invalid");
    if (value.result_state === "CREATED") {
      if (value.before.exists || !value.mutation.attempted || value.mutation.owner !== "workspace-runtime"
        || !value.mutation.workspace_created || value.mutation.workspace_id !== value.after.workspace_id) {
        fail("created result mutation evidence is invalid");
      }
    } else if (!value.before.exists || value.mutation.attempted || value.mutation.owner !== null
      || value.mutation.workspace_created || value.mutation.workspace_id !== value.after.workspace_id
      || JSON.stringify(value.before) !== JSON.stringify(value.after)) {
      fail("already-existing result mutation evidence is invalid");
    }
  }
  return deepFreeze(copy(value));
}

function validateCreatedWorkspace(workspace, evidenceReference) {
  try {
    validateWorkspaceRecord(workspace);
  } catch (error) {
    fail("Workspace Runtime returned an invalid Workspace", { cause: error.code });
  }
  if (workspace.workspace_name !== TARGET_WORKSPACE_NAME || workspace.project_relationships.length !== 0
    || !workspace.evidence_references.some((item) => JSON.stringify(item) === JSON.stringify(evidenceReference))) {
    fail("Workspace Runtime result violates the controlled creation scope");
  }
  return deepFreeze(copy(workspace));
}

module.exports = Object.freeze({
  AUTHORITY,
  CONTROLLED_WORKSPACE_CREATION_SCHEMA_VERSION,
  RESULT_STATES,
  TARGET_WORKSPACE_NAME,
  ControlledWorkspaceCreationContractError,
  deepFreeze,
  validateControlledWorkspaceCreationResult,
  validateCreatedWorkspace,
  validateCreationRequest,
  validateOwnershipEvidence,
  workspaceCreationPlanId
});

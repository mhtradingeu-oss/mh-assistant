"use strict";

const crypto = require("node:crypto");
const { normalizeProjectSlug } = require("../security/project-isolation");
const { validateProductionActivationOwnership } = require("./production-activation-ownership-contract");

const CONTROLLED_ACTIVATION_WRITER_SCHEMA_VERSION = 1;
const RESULT_STATES = Object.freeze(["BLOCKED", "DRY_RUN_READY", "APPLIED", "ALREADY_APPLIED"]);

class ControlledActivationWriterContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ControlledActivationWriterContractError";
    this.code = "CONTROLLED_ACTIVATION_WRITER_CONTRACT_INVALID";
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

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function activationPlanId(planSeed) {
  const semanticSeed = copy(planSeed);
  delete semanticSeed.plan_id;
  delete semanticSeed.event_id;
  return `actplan_${crypto.createHash("sha256").update(canonical(semanticSeed)).digest("hex")}`;
}

function fail(message, details) {
  throw new ControlledActivationWriterContractError(message, details);
}

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
}

function exact(value, fields, label) {
  object(value, label);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`${label} fields are invalid`, { actual, expected });
}

function validateEvidence(value, label) {
  exact(value, ["project_id", "identity_state", "workspace_id", "workspace_version", "relationship_id", "relationship_status", "validation_state", "audit_event_present"], label);
  if (typeof value.audit_event_present !== "boolean") fail(`${label}.audit_event_present must be boolean`);
}

function validatePlan(plan, projectSlug) {
  exact(plan, ["plan_id", "mode", "project_slug", "project_id", "workspace_id", "workspace_version", "relationship_id", "approval_id", "activation_at", "event_id", "steps"], "plan");
  if (plan.mode !== "DRY_RUN" || plan.project_slug !== projectSlug || !/^actplan_[a-f0-9]{64}$/.test(plan.plan_id)) fail("plan identity or scope is invalid");
  if (!Array.isArray(plan.steps) || plan.steps.length !== 3) fail("plan must contain exactly three ordered steps");
  const expected = [
    [1, "REVALIDATE_PROJECT_IDENTITY", "project-identity", false],
    [2, "REVALIDATE_WORKSPACE_RELATIONSHIP", "workspace-relationship-runtime", false],
    [3, "APPEND_PRODUCTION_ACTIVATION_EVENT", "existing-audit-event-system", true]
  ];
  plan.steps.forEach((step, index) => {
    exact(step, ["order", "action", "authority_owner", "mutation_allowed"], `plan.steps[${index}]`);
    if (JSON.stringify([step.order, step.action, step.authority_owner, step.mutation_allowed]) !== JSON.stringify(expected[index])) fail("plan step is invalid");
  });
  if (activationPlanId(plan) !== plan.plan_id || plan.event_id !== `activation_${plan.plan_id.slice(8)}`) fail("plan is not deterministic");
}

function validateControlledActivationWriterResult(value) {
  exact(value, ["schema_version", "kind", "mode", "result_state", "project_slug", "plan", "before", "after", "mutation", "source_evidence", "safety", "authority"], "writer result");
  if (value.schema_version !== CONTROLLED_ACTIVATION_WRITER_SCHEMA_VERSION || value.kind !== "controlled_production_activation_writer_result") fail("writer schema or kind is invalid");
  if (!["DRY_RUN", "APPLY"].includes(value.mode) || !RESULT_STATES.includes(value.result_state)) fail("writer mode or result state is invalid");
  let slug;
  try { slug = normalizeProjectSlug(value.project_slug); } catch { fail("project_slug is invalid"); }
  if (slug !== value.project_slug) fail("project_slug is not canonical");
  exact(value.source_evidence, ["source_owner", "ownership"], "source_evidence");
  let ownership;
  try { ownership = validateProductionActivationOwnership(value.source_evidence.ownership); } catch (error) { fail("Phase J ownership evidence is invalid", { cause: error.code }); }
  if (value.source_evidence.source_owner !== "production-activation-ownership-model" || ownership.project_slug !== slug) fail("ownership evidence is cross-project");
  const ready = ownership.ownership_state === "OWNERSHIP_CHAIN_ACCEPTED";
  if (!ready) {
    if (value.result_state !== "BLOCKED" || value.plan !== null || value.before !== null || value.after !== null) fail("blocked result invented an activation plan or evidence");
  } else {
    validatePlan(value.plan, slug);
    validateEvidence(value.before, "before");
    validateEvidence(value.after, "after");
    if (value.before.project_id !== value.plan.project_id || value.before.workspace_id !== value.plan.workspace_id || value.before.relationship_id !== value.plan.relationship_id) fail("before evidence does not match plan");
    if (value.mode === "DRY_RUN" && (value.result_state !== "DRY_RUN_READY" || JSON.stringify(value.before) !== JSON.stringify(value.after))) fail("dry run must preserve before evidence");
    if (value.mode === "APPLY" && !["APPLIED", "ALREADY_APPLIED"].includes(value.result_state)) fail("apply result state is invalid");
    const beforeStable = { ...value.before, audit_event_present: false };
    const afterStable = { ...value.after, audit_event_present: false };
    if (JSON.stringify(beforeStable) !== JSON.stringify(afterStable)) fail("apply changed authoritative identity or Workspace evidence");
  }
  exact(value.mutation, ["attempted", "owner", "event_created", "event_id"], "mutation");
  exact(value.safety, ["single_project", "dry_run_first", "plan_matched", "project_mutated", "workspace_mutated", "identity_generated", "workspace_created", "registry_mutated", "data_migrated", "unrelated_writes", "rollback_safe"], "safety");
  if (!value.safety.single_project || !value.safety.dry_run_first || value.safety.project_mutated || value.safety.workspace_mutated || value.safety.identity_generated || value.safety.workspace_created || value.safety.registry_mutated || value.safety.data_migrated || value.safety.unrelated_writes || !value.safety.rollback_safe) fail("safety declaration is invalid");
  exact(value.authority, ["project_identity_owner", "workspace_relationship_owner", "audit_event_owner", "writer_owner", "creates_project", "creates_workspace", "creates_identity", "writes_registry", "migrates_data"], "authority");
  const expectedAuthority = {
    project_identity_owner: "project-identity",
    workspace_relationship_owner: "workspace-relationship-runtime",
    audit_event_owner: "existing-audit-event-system",
    writer_owner: "controlled-production-activation-writer-boundary",
    creates_project: false,
    creates_workspace: false,
    creates_identity: false,
    writes_registry: false,
    migrates_data: false
  };
  if (Object.entries(expectedAuthority).some(([field, item]) => value.authority[field] !== item)) fail("authority declaration is invalid");
  if (value.result_state === "BLOCKED" || value.mode === "DRY_RUN") {
    if (value.mutation.attempted || value.mutation.owner !== null || value.mutation.event_created || value.mutation.event_id !== null || value.safety.plan_matched) fail("non-applying result claims a mutation");
  } else {
    if (!value.mutation.attempted || value.mutation.owner !== "existing-audit-event-system" || value.mutation.event_id !== value.plan.event_id || !value.safety.plan_matched || !value.after.audit_event_present) fail("apply mutation evidence is invalid");
    if (value.result_state === "APPLIED" && (!value.mutation.event_created || value.before.audit_event_present)) fail("APPLIED evidence is invalid");
    if (value.result_state === "ALREADY_APPLIED" && (value.mutation.event_created || !value.before.audit_event_present)) fail("ALREADY_APPLIED evidence is invalid");
  }
  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  CONTROLLED_ACTIVATION_WRITER_SCHEMA_VERSION,
  RESULT_STATES,
  ControlledActivationWriterContractError,
  activationPlanId,
  validateControlledActivationWriterResult
});

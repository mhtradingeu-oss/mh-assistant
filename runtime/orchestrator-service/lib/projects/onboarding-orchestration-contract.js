"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const {
  validateBootstrapAuthorityAssessment
} = require("./bootstrap-authority-contract");

const ONBOARDING_ORCHESTRATION_SCHEMA_VERSION = 1;
const ONBOARDING_INTENTS = Object.freeze(["ONBOARD_PROJECT"]);
const ONBOARDING_NEXT_STEPS = Object.freeze([
  "USE_EXISTING_LIFECYCLES",
  "ESTABLISH_PROJECT_IDENTITY",
  "RESOLVE_ACTIVATION_PREREQUISITES",
  "NONE"
]);
const ONBOARDING_OUTCOMES = Object.freeze([
  "NOT_ASSESSABLE",
  "BLOCKED",
  "READY_FOR_ACTIVATION"
]);

const SCENARIO_PROJECTION = Object.freeze({
  NEW_PROJECT_REQUEST: Object.freeze({
    next_step: "USE_EXISTING_LIFECYCLES",
    outcome: "NOT_ASSESSABLE",
    required: true
  }),
  EXISTING_PROJECT_WITHOUT_IDENTITY: Object.freeze({
    next_step: "ESTABLISH_PROJECT_IDENTITY",
    outcome: "BLOCKED",
    required: true
  }),
  EXISTING_PROJECT_NOT_READY: Object.freeze({
    next_step: "RESOLVE_ACTIVATION_PREREQUISITES",
    outcome: "BLOCKED",
    required: true
  }),
  READY_PROJECT: Object.freeze({
    next_step: "NONE",
    outcome: "READY_FOR_ACTIVATION",
    required: false
  })
});

class OnboardingOrchestrationContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "OnboardingOrchestrationContractError";
    this.code = "ONBOARDING_ORCHESTRATION_CONTRACT_INVALID";
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
  throw new OnboardingOrchestrationContractError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the onboarding orchestration contract`, { actual, expected });
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
    "activation_owner", "bootstrap_owner", "orchestration_owner", "creates_workspace",
    "creates_project", "creates_identity", "writes_binding", "writes_registry",
    "writes_project_files", "migrates_data", "mutates_data", "mutates_filesystem",
    "backend_authoritative", "frontend_projection_only"
  ], "authority");
  const expected = {
    workspace_id_owner: "workspace-runtime",
    project_id_owner: "project-identity",
    workspace_project_owner: "workspace-relationship-runtime",
    contract_owner: "universal-project-contract",
    activation_owner: "project-activation-assessment",
    bootstrap_owner: "bootstrap-authority-assessment",
    orchestration_owner: "onboarding-orchestration",
    creates_workspace: false,
    creates_project: false,
    creates_identity: false,
    writes_binding: false,
    writes_registry: false,
    writes_project_files: false,
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

function validateOnboardingOrchestration(value) {
  assertExactFields(value, [
    "schema_version", "kind", "user_intent", "current_state", "authority_owner",
    "required_next_step", "activation_outcome", "authority"
  ], "onboarding orchestration");
  if (value.schema_version !== ONBOARDING_ORCHESTRATION_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "production_onboarding_orchestration") fail("kind is invalid");

  assertExactFields(value.user_intent, ["type", "project_slug"], "user_intent");
  if (!ONBOARDING_INTENTS.includes(value.user_intent.type)) fail("user intent is invalid");
  let projectSlug;
  try { projectSlug = normalizeProjectSlug(value.user_intent.project_slug); } catch { fail("project_slug is invalid"); }
  if (projectSlug !== value.user_intent.project_slug) fail("project_slug is not canonical");

  assertExactFields(value.current_state, [
    "scenario", "project_exists", "project_id", "bootstrap_decision", "source_owner", "assessment"
  ], "current_state");
  let bootstrap;
  try { bootstrap = validateBootstrapAuthorityAssessment(value.current_state.assessment); } catch (error) {
    fail("Phase E bootstrap evidence is invalid", { cause: error.code || null });
  }
  if (value.current_state.source_owner !== "bootstrap-authority-assessment"
    || value.current_state.scenario !== bootstrap.scenario
    || value.current_state.project_exists !== bootstrap.project.exists
    || value.current_state.project_id !== bootstrap.project.project_id
    || value.current_state.bootstrap_decision !== bootstrap.decision.state
    || projectSlug !== bootstrap.project.project_slug) {
    fail("current state contradicts Phase E evidence");
  }

  assertExactFields(value.authority_owner, ["source_owner", "responsible_authorities"], "authority_owner");
  if (value.authority_owner.source_owner !== "bootstrap-authority-assessment"
    || !isSortedUniqueStrings(value.authority_owner.responsible_authorities)
    || JSON.stringify(value.authority_owner.responsible_authorities)
      !== JSON.stringify(bootstrap.decision.responsible_authorities)) {
    fail("authority owner contradicts Phase E decision");
  }

  assertExactFields(value.required_next_step, ["state", "required", "responsible_authorities"], "required_next_step");
  if (!ONBOARDING_NEXT_STEPS.includes(value.required_next_step.state)
    || typeof value.required_next_step.required !== "boolean"
    || !isSortedUniqueStrings(value.required_next_step.responsible_authorities)
    || JSON.stringify(value.required_next_step.responsible_authorities)
      !== JSON.stringify(value.authority_owner.responsible_authorities)) {
    fail("required next step is invalid");
  }

  assertExactFields(value.activation_outcome, ["state", "ready", "blockers", "source_owner"], "activation_outcome");
  if (!ONBOARDING_OUTCOMES.includes(value.activation_outcome.state)
    || typeof value.activation_outcome.ready !== "boolean"
    || !isSortedUniqueStrings(value.activation_outcome.blockers)
    || value.activation_outcome.source_owner !== "project-activation-assessment"
    || value.activation_outcome.ready !== bootstrap.activation_readiness.ready
    || JSON.stringify(value.activation_outcome.blockers)
      !== JSON.stringify(bootstrap.activation_readiness.blockers)) {
    fail("activation outcome contradicts Phase D evidence projected by Phase E");
  }

  const expected = SCENARIO_PROJECTION[bootstrap.scenario];
  if (!expected
    || value.required_next_step.state !== expected.next_step
    || value.required_next_step.required !== expected.required
    || value.activation_outcome.state !== expected.outcome
    || value.activation_outcome.ready !== (expected.outcome === "READY_FOR_ACTIVATION")) {
    fail("orchestration decision contradicts the bootstrap scenario");
  }

  validateAuthority(value.authority);
  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  ONBOARDING_ORCHESTRATION_SCHEMA_VERSION,
  ONBOARDING_INTENTS,
  ONBOARDING_NEXT_STEPS,
  ONBOARDING_OUTCOMES,
  OnboardingOrchestrationContractError,
  validateOnboardingOrchestration
});

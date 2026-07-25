"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const projectIdentity = require("./project-identity");
const { validateProjectActivationContract } = require("./project-activation-contract");

const BOOTSTRAP_AUTHORITY_SCHEMA_VERSION = 1;
const BOOTSTRAP_SCENARIOS = Object.freeze([
  "NEW_PROJECT_REQUEST",
  "EXISTING_PROJECT_WITHOUT_IDENTITY",
  "EXISTING_PROJECT_NOT_READY",
  "READY_PROJECT"
]);
const BOOTSTRAP_DECISIONS = Object.freeze([
  "EXISTING_LIFECYCLE_REQUIRED",
  "PROJECT_IDENTITY_REQUIRED",
  "ACTIVATION_PREREQUISITES_REQUIRED",
  "NO_BOOTSTRAP_REQUIRED"
]);

class BootstrapAuthorityContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "BootstrapAuthorityContractError";
    this.code = "BOOTSTRAP_AUTHORITY_CONTRACT_INVALID";
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
  throw new BootstrapAuthorityContractError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the bootstrap authority contract`, { actual, expected });
  }
}

function isSortedUniqueStrings(values) {
  return Array.isArray(values)
    && values.every((value) => typeof value === "string" && value.length > 0)
    && JSON.stringify(values) === JSON.stringify([...new Set(values)].sort());
}

function validateBootstrapAuthorityAssessment(value) {
  assertExactFields(value, [
    "schema_version", "kind", "scenario", "project", "required_workspace_state",
    "required_project_state", "identity_readiness", "activation_readiness", "decision", "authority"
  ], "bootstrap assessment");
  if (value.schema_version !== BOOTSTRAP_AUTHORITY_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "bootstrap_authority_assessment") fail("kind is invalid");
  if (!BOOTSTRAP_SCENARIOS.includes(value.scenario)) fail("scenario is invalid");

  assertExactFields(value.project, ["project_slug", "project_id", "exists"], "project");
  let normalizedSlug;
  try { normalizedSlug = normalizeProjectSlug(value.project.project_slug); } catch { fail("project_slug is invalid"); }
  if (normalizedSlug !== value.project.project_slug) fail("project_slug is not canonical");
  if (typeof value.project.exists !== "boolean") fail("project existence is invalid");
  if (value.project.project_id !== null && !projectIdentity.PROJECT_ID_REGEX.test(value.project.project_id)) {
    fail("project_id is invalid");
  }

  assertExactFields(value.required_workspace_state, [
    "required_state", "current_state", "satisfied", "responsible_authorities"
  ], "required_workspace_state");
  if (value.required_workspace_state.required_state !== "ACTIVE_WITH_ATTACHED_VALID_PROJECT_RELATIONSHIP"
    || typeof value.required_workspace_state.current_state !== "string"
    || !value.required_workspace_state.current_state
    || typeof value.required_workspace_state.satisfied !== "boolean"
    || JSON.stringify(value.required_workspace_state.responsible_authorities)
      !== JSON.stringify(["workspace-relationship-runtime", "workspace-runtime"])) {
    fail("required Workspace state or authority is invalid");
  }

  assertExactFields(value.required_project_state, [
    "required_state", "current_state", "satisfied", "responsible_authority"
  ], "required_project_state");
  if (value.required_project_state.required_state !== "EXISTING_WITH_VALID_AUTHORITATIVE_IDENTITY"
    || typeof value.required_project_state.current_state !== "string"
    || !value.required_project_state.current_state
    || typeof value.required_project_state.satisfied !== "boolean"
    || value.required_project_state.responsible_authority !== "project-identity") {
    fail("required Project state or authority is invalid");
  }

  assertExactFields(value.identity_readiness, ["state", "ready", "responsible_authority"], "identity_readiness");
  if (typeof value.identity_readiness.state !== "string" || !value.identity_readiness.state
    || typeof value.identity_readiness.ready !== "boolean"
    || value.identity_readiness.responsible_authority !== "project-identity") {
    fail("identity readiness is invalid");
  }

  assertExactFields(value.activation_readiness, [
    "state", "ready", "blockers", "source_owner", "assessment"
  ], "activation_readiness");
  if (typeof value.activation_readiness.state !== "string" || !value.activation_readiness.state
    || typeof value.activation_readiness.ready !== "boolean"
    || !isSortedUniqueStrings(value.activation_readiness.blockers)
    || value.activation_readiness.source_owner !== "project-activation-assessment") {
    fail("activation readiness is invalid");
  }

  assertExactFields(value.decision, ["state", "ready", "responsible_authorities"], "decision");
  if (!BOOTSTRAP_DECISIONS.includes(value.decision.state)
    || typeof value.decision.ready !== "boolean"
    || !isSortedUniqueStrings(value.decision.responsible_authorities)) {
    fail("bootstrap decision is invalid");
  }

  assertExactFields(value.authority, [
    "workspace_id_owner", "project_id_owner", "workspace_project_owner", "contract_owner",
    "activation_owner", "decision_owner", "creates_workspace", "creates_project", "creates_identity",
    "writes_binding", "writes_registry", "writes_project_files", "migrates_data", "mutates_data",
    "mutates_filesystem", "backend_authoritative", "frontend_projection_only"
  ], "authority");
  const expectedAuthority = {
    workspace_id_owner: "workspace-runtime",
    project_id_owner: "project-identity",
    workspace_project_owner: "workspace-relationship-runtime",
    contract_owner: "universal-project-contract",
    activation_owner: "project-activation-assessment",
    decision_owner: "bootstrap-authority-assessment",
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
  if (Object.entries(expectedAuthority).some(([field, expected]) => value.authority[field] !== expected)) {
    fail("authority declaration is invalid");
  }

  const isNew = value.scenario === "NEW_PROJECT_REQUEST";
  if (isNew) {
    if (value.project.exists || value.project.project_id !== null
      || value.activation_readiness.assessment !== null
      || value.required_workspace_state.current_state !== "NOT_ASSESSABLE"
      || value.required_project_state.current_state !== "NOT_FOUND"
      || value.identity_readiness.state !== "NOT_ASSESSABLE"
      || value.activation_readiness.state !== "NOT_ASSESSABLE"
      || value.activation_readiness.ready
      || JSON.stringify(value.activation_readiness.blockers) !== JSON.stringify(["project:PROJECT_NOT_FOUND"])
      || value.decision.state !== "EXISTING_LIFECYCLE_REQUIRED"
      || value.decision.ready) {
      fail("new Project request evidence is contradictory");
    }
  } else {
    let activation;
    try { activation = validateProjectActivationContract(value.activation_readiness.assessment); } catch (error) {
      fail("Phase D activation evidence is invalid", { cause: error.code || null });
    }
    const workspaceStage = activation.activation_path.find((stage) => stage.name === "workspace");
    const identityStage = activation.activation_path.find((stage) => stage.name === "project_identity");
    if (!value.project.exists
      || value.project.project_id !== activation.project.project_id
      || value.required_workspace_state.current_state !== workspaceStage.state
      || value.required_workspace_state.satisfied !== workspaceStage.ready
      || value.required_project_state.current_state !== identityStage.state
      || value.required_project_state.satisfied !== identityStage.ready
      || value.identity_readiness.state !== identityStage.state
      || value.identity_readiness.ready !== identityStage.ready
      || value.activation_readiness.state !== activation.activation_status.state
      || value.activation_readiness.ready !== activation.activation_status.ready
      || JSON.stringify(value.activation_readiness.blockers) !== JSON.stringify(activation.activation_status.blockers)) {
      fail("Phase E projection contradicts Phase D evidence");
    }
  }

  const expectedByScenario = {
    NEW_PROJECT_REQUEST: ["EXISTING_LIFECYCLE_REQUIRED", false, ["project-identity", "workspace-relationship-runtime", "workspace-runtime"]],
    EXISTING_PROJECT_WITHOUT_IDENTITY: ["PROJECT_IDENTITY_REQUIRED", false, ["project-identity"]],
    EXISTING_PROJECT_NOT_READY: ["ACTIVATION_PREREQUISITES_REQUIRED", false, ["project-activation-assessment"]],
    READY_PROJECT: ["NO_BOOTSTRAP_REQUIRED", true, []]
  }[value.scenario];
  if (value.decision.state !== expectedByScenario[0]
    || value.decision.ready !== expectedByScenario[1]
    || JSON.stringify(value.decision.responsible_authorities) !== JSON.stringify(expectedByScenario[2])) {
    fail("decision contradicts scenario");
  }
  if ((value.scenario === "EXISTING_PROJECT_WITHOUT_IDENTITY") !== (value.project.exists && !value.identity_readiness.ready)) {
    fail("identity scenario contradicts identity evidence");
  }
  if ((value.scenario === "READY_PROJECT") !== value.activation_readiness.ready) {
    fail("ready scenario contradicts activation evidence");
  }

  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  BOOTSTRAP_AUTHORITY_SCHEMA_VERSION,
  BOOTSTRAP_SCENARIOS,
  BOOTSTRAP_DECISIONS,
  BootstrapAuthorityContractError,
  validateBootstrapAuthorityAssessment
});

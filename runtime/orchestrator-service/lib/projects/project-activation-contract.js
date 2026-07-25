"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const projectIdentity = require("./project-identity");

const PROJECT_ACTIVATION_CONTRACT_SCHEMA_VERSION = 1;
const PROJECT_ACTIVATION_STAGE_NAMES = Object.freeze([
  "workspace",
  "project_identity",
  "binding",
  "universal_project_contract",
  "capabilities"
]);
const PROJECT_ACTIVATION_STATUSES = Object.freeze([
  "READY_FOR_ACTIVATION",
  "BLOCKED"
]);

class ProjectActivationContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ProjectActivationContractError";
    this.code = "PROJECT_ACTIVATION_CONTRACT_INVALID";
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
  throw new ProjectActivationContractError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the activation contract`, { actual, expected });
  }
}

function isSortedUniqueStrings(values) {
  return Array.isArray(values)
    && values.every((value) => typeof value === "string" && value.length > 0)
    && JSON.stringify(values) === JSON.stringify([...new Set(values)].sort());
}

function validateProjectActivationContract(value) {
  assertExactFields(value, [
    "schema_version", "kind", "project", "activation_path", "capabilities",
    "lifecycle_prerequisites", "activation_status", "authority"
  ], "activation assessment");
  if (value.schema_version !== PROJECT_ACTIVATION_CONTRACT_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "workspace_project_activation_assessment") fail("kind is invalid");

  assertExactFields(value.project, ["project_slug", "project_id"], "project");
  let normalizedSlug;
  try { normalizedSlug = normalizeProjectSlug(value.project.project_slug); } catch { fail("project_slug is invalid"); }
  if (normalizedSlug !== value.project.project_slug) fail("project_slug is not canonical");
  if (value.project.project_id !== null && !projectIdentity.PROJECT_ID_REGEX.test(value.project.project_id)) {
    fail("project_id is invalid");
  }

  if (!Array.isArray(value.activation_path) || value.activation_path.length !== PROJECT_ACTIVATION_STAGE_NAMES.length) {
    fail("activation_path must contain every canonical stage exactly once");
  }
  const expectedOwners = Object.freeze([
    ["workspace-runtime", true],
    ["project-identity", true],
    ["workspace-relationship-runtime", true],
    ["universal-project-contract", false],
    ["universal-project-contract", false]
  ]);
  value.activation_path.forEach((stage, index) => {
    assertExactFields(stage, ["order", "name", "state", "ready", "authoritative", "source_owner"], `activation_path[${index}]`);
    if (stage.order !== index + 1 || stage.name !== PROJECT_ACTIVATION_STAGE_NAMES[index]) {
      fail("activation stage order is invalid", { index, stage });
    }
    if (typeof stage.state !== "string" || !stage.state || typeof stage.ready !== "boolean") {
      fail("activation stage state is invalid", { stage: stage.name });
    }
    if (stage.source_owner !== expectedOwners[index][0] || stage.authoritative !== expectedOwners[index][1]) {
      fail("activation stage ownership was changed", { stage: stage.name });
    }
  });

  assertExactFields(value.capabilities, ["enabled", "partial", "unavailable", "authoritative", "source_owner"], "capabilities");
  if (!isSortedUniqueStrings(value.capabilities.enabled)
    || !isSortedUniqueStrings(value.capabilities.partial)
    || !isSortedUniqueStrings(value.capabilities.unavailable)) {
    fail("capability lists must contain deterministic unique strings");
  }
  const capabilityNames = [
    ...value.capabilities.enabled,
    ...value.capabilities.partial,
    ...value.capabilities.unavailable
  ];
  if (new Set(capabilityNames).size !== capabilityNames.length) fail("capability states overlap");
  if (value.capabilities.authoritative !== false || value.capabilities.source_owner !== "universal-project-contract") {
    fail("capability projection ownership is invalid");
  }

  assertExactFields(value.lifecycle_prerequisites, ["state", "ready", "blockers", "authoritative", "source_owner"], "lifecycle_prerequisites");
  if (typeof value.lifecycle_prerequisites.state !== "string" || !value.lifecycle_prerequisites.state) {
    fail("lifecycle prerequisite state is invalid");
  }
  if (typeof value.lifecycle_prerequisites.ready !== "boolean"
    || !isSortedUniqueStrings(value.lifecycle_prerequisites.blockers)
    || value.lifecycle_prerequisites.authoritative !== false
    || value.lifecycle_prerequisites.source_owner !== "project-lifecycle-readiness") {
    fail("lifecycle prerequisite projection is invalid");
  }
  if (value.lifecycle_prerequisites.ready !== (value.lifecycle_prerequisites.state === "READY")) {
    fail("lifecycle prerequisite readiness contradicts its state");
  }

  assertExactFields(value.activation_status, ["state", "ready", "blockers"], "activation_status");
  if (!PROJECT_ACTIVATION_STATUSES.includes(value.activation_status.state)) fail("activation status is invalid");
  if (!isSortedUniqueStrings(value.activation_status.blockers)) fail("activation blockers must be deterministic unique strings");
  const expectedReady = value.lifecycle_prerequisites.ready && value.activation_path.every((stage) => stage.ready);
  if (value.activation_status.ready !== expectedReady
    || value.activation_status.ready !== (value.activation_status.state === "READY_FOR_ACTIVATION")) {
    fail("activation status contradicts lifecycle evidence");
  }
  if (JSON.stringify(value.activation_status.blockers) !== JSON.stringify(value.lifecycle_prerequisites.blockers)) {
    fail("activation blockers must preserve Phase C lifecycle blockers");
  }
  if (value.activation_status.ready && value.activation_status.blockers.length !== 0) {
    fail("ready activation cannot contain blockers");
  }
  if (!value.activation_status.ready && value.activation_status.blockers.length === 0) {
    fail("blocked activation must expose at least one blocker");
  }

  assertExactFields(value.authority, [
    "creates_identity", "creates_workspace", "writes_binding", "writes_registry",
    "writes_project_files", "mutates_filesystem", "backend_authoritative", "frontend_projection_only"
  ], "authority");
  if (value.authority.creates_identity !== false
    || value.authority.creates_workspace !== false
    || value.authority.writes_binding !== false
    || value.authority.writes_registry !== false
    || value.authority.writes_project_files !== false
    || value.authority.mutates_filesystem !== false
    || value.authority.backend_authoritative !== true
    || value.authority.frontend_projection_only !== true) {
    fail("activation authority declaration is invalid");
  }

  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  PROJECT_ACTIVATION_CONTRACT_SCHEMA_VERSION,
  PROJECT_ACTIVATION_STAGE_NAMES,
  PROJECT_ACTIVATION_STATUSES,
  ProjectActivationContractError,
  validateProjectActivationContract
});

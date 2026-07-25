"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { normalizeProjectSlug } = require("../security/project-isolation");
const workspaceProjectBinding = require("./workspace-project-identity-binding");
const projectIdentity = require("./project-identity");
const workspaceStorage = require("../workspace/workspace-storage");

const PROJECT_LIFECYCLE_READINESS_SCHEMA_VERSION = 1;
const PROJECT_LIFECYCLE_STAGE_NAMES = Object.freeze([
  "workspace",
  "workspace_binding",
  "project_identity",
  "project_registry",
  "projection",
  "universal_project_contract",
  "capabilities"
]);
const PROJECT_LIFECYCLE_READINESS_STATES = Object.freeze([
  "READY",
  "MISSING_PROJECT_IDENTITY",
  "SOURCE_INVALID",
  "MISSING_WORKSPACE_BINDING",
  "AMBIGUOUS_WORKSPACE_BINDING",
  "BINDING_NOT_ATTACHED",
  "PROJECT_NOT_REGISTERED",
  "DUPLICATE_PROJECT_REGISTRATION",
  "REGISTRY_INVALID",
  "PROJECTION_MISSING",
  "PROJECTION_MISMATCH",
  "NO_READY_CAPABILITIES"
]);
const TOP_LEVEL_FIELDS = Object.freeze([
  "schema_version",
  "kind",
  "project",
  "lifecycle",
  "capabilities",
  "readiness",
  "authority"
]);
const STAGE_FIELDS = Object.freeze([
  "order", "name", "state", "ready", "authoritative", "source_owner"
]);
const DEFAULT_REGISTRY_PATH = path.join(projectIdentity.DEFAULT_PROJECTS_ROOT, "registry.json");

class ProjectLifecycleReadinessError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ProjectLifecycleReadinessError";
    this.code = "PROJECT_LIFECYCLE_READINESS_INVALID";
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
  throw new ProjectLifecycleReadinessError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the lifecycle contract`, { actual, expected });
  }
}

function isSortedUniqueStrings(values) {
  return Array.isArray(values)
    && values.every((value) => typeof value === "string" && value.length > 0)
    && JSON.stringify(values) === JSON.stringify([...new Set(values)].sort());
}

function validateProjectLifecycleReadiness(value) {
  assertExactFields(value, TOP_LEVEL_FIELDS, "lifecycle readiness");
  if (value.schema_version !== PROJECT_LIFECYCLE_READINESS_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "project_lifecycle_activation_readiness") fail("kind is invalid");

  assertExactFields(value.project, ["project_slug", "project_id"], "project");
  let normalizedSlug;
  try { normalizedSlug = normalizeProjectSlug(value.project.project_slug); } catch { fail("project_slug is invalid"); }
  if (normalizedSlug !== value.project.project_slug) fail("project_slug is not canonical");
  if (value.project.project_id !== null && !projectIdentity.PROJECT_ID_REGEX.test(value.project.project_id)) {
    fail("project_id is invalid");
  }

  if (!Array.isArray(value.lifecycle) || value.lifecycle.length !== PROJECT_LIFECYCLE_STAGE_NAMES.length) {
    fail("lifecycle must contain every canonical stage exactly once");
  }
  value.lifecycle.forEach((stage, index) => {
    assertExactFields(stage, STAGE_FIELDS, `lifecycle[${index}]`);
    if (stage.order !== index + 1 || stage.name !== PROJECT_LIFECYCLE_STAGE_NAMES[index]) {
      fail("lifecycle stage order is invalid", { index, stage });
    }
    if (typeof stage.state !== "string" || !stage.state || typeof stage.ready !== "boolean") {
      fail("lifecycle stage state is invalid", { stage: stage.name });
    }
    if (typeof stage.authoritative !== "boolean" || typeof stage.source_owner !== "string" || !stage.source_owner) {
      fail("lifecycle stage ownership is invalid", { stage: stage.name });
    }
  });

  const expectedOwners = [
    ["workspace-runtime", true],
    ["workspace-relationship-runtime", true],
    ["project-identity", true],
    ["backend-project-registry", true],
    ["project-workspace-projection", false],
    ["universal-project-contract", false],
    ["project-lifecycle-readiness", false]
  ];
  value.lifecycle.forEach((stage, index) => {
    if (stage.source_owner !== expectedOwners[index][0] || stage.authoritative !== expectedOwners[index][1]) {
      fail("canonical lifecycle ownership was changed", { stage: stage.name });
    }
  });

  assertExactFields(value.capabilities, ["enabled", "partial", "unavailable", "authoritative", "source_owner"], "capabilities");
  if (!isSortedUniqueStrings(value.capabilities.enabled)
    || !isSortedUniqueStrings(value.capabilities.partial)
    || !isSortedUniqueStrings(value.capabilities.unavailable)) {
    fail("capability lists must contain deterministic unique strings");
  }
  const allCapabilities = [
    ...value.capabilities.enabled,
    ...value.capabilities.partial,
    ...value.capabilities.unavailable
  ];
  if (new Set(allCapabilities).size !== allCapabilities.length) fail("capability states overlap");
  if (value.capabilities.authoritative !== false || value.capabilities.source_owner !== "universal-project-contract") {
    fail("capability projection ownership is invalid");
  }

  assertExactFields(value.readiness, ["state", "ready", "blockers"], "readiness");
  if (!PROJECT_LIFECYCLE_READINESS_STATES.includes(value.readiness.state)) fail("readiness state is invalid");
  if (value.readiness.ready !== (value.readiness.state === "READY")) fail("readiness boolean conflicts with state");
  if (!isSortedUniqueStrings(value.readiness.blockers)) fail("blockers must be deterministic unique strings");
  if (value.readiness.ready) {
    if (value.readiness.blockers.length !== 0 || value.lifecycle.some((stage) => !stage.ready)) {
      fail("READY requires every lifecycle stage and no blockers");
    }
  } else if (value.readiness.blockers.length === 0) {
    fail("non-ready lifecycle must expose a blocker");
  }

  assertExactFields(value.authority, [
    "creates_identity", "creates_workspace", "registers_project", "writes_projection",
    "mutates_data", "backend_authoritative", "frontend_projection_only"
  ], "authority");
  if (value.authority.creates_identity !== false
    || value.authority.creates_workspace !== false
    || value.authority.registers_project !== false
    || value.authority.writes_projection !== false
    || value.authority.mutates_data !== false
    || value.authority.backend_authoritative !== true
    || value.authority.frontend_projection_only !== true) {
    fail("lifecycle authority declaration is invalid");
  }

  return deepFreeze(copy(value));
}

function inspectRegistry(projectSlug, registryPath) {
  let parsed;
  try {
    const stat = fs.lstatSync(registryPath);
    if (!stat.isFile() || stat.isSymbolicLink()) return { state: "REGISTRY_INVALID", matches: 0 };
    parsed = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  } catch {
    return { state: "REGISTRY_INVALID", matches: 0 };
  }
  if (!Array.isArray(parsed)) return { state: "REGISTRY_INVALID", matches: 0 };

  const names = [];
  for (const record of parsed) {
    if (!isObject(record) || typeof record.project_name !== "string") {
      return { state: "REGISTRY_INVALID", matches: 0 };
    }
    try {
      const normalized = normalizeProjectSlug(record.project_name);
      if (normalized !== record.project_name.trim().toLowerCase()) return { state: "REGISTRY_INVALID", matches: 0 };
      names.push(normalized);
    } catch {
      return { state: "REGISTRY_INVALID", matches: 0 };
    }
  }
  const matches = names.filter((name) => name === projectSlug).length;
  if (matches > 1) return { state: "DUPLICATE_PROJECT_REGISTRATION", matches };
  if (matches === 0) return { state: "PROJECT_NOT_REGISTERED", matches };
  return { state: "REGISTERED", matches };
}

function stage(order, name, state, ready, sourceOwner, authoritative) {
  return { order, name, state, ready, authoritative, source_owner: sourceOwner };
}

function inspectProjectLifecycleReadiness(projectSlug, options = {}) {
  if (!isObject(options)) fail("options must be an object");
  const projectsRoot = options.projectsRoot === undefined ? projectIdentity.DEFAULT_PROJECTS_ROOT : path.resolve(options.projectsRoot);
  const workspaceRoot = options.workspaceRoot === undefined ? workspaceStorage.DEFAULT_WORKSPACE_ROOT : path.resolve(options.workspaceRoot);
  const registryPath = options.registryPath === undefined ? path.join(projectsRoot, "registry.json") : path.resolve(options.registryPath);
  const binding = workspaceProjectBinding.inspectWorkspaceProjectIdentityBinding(projectSlug, {
    projectsRoot,
    workspaceRoot,
    runtimeRoot: options.runtimeRoot
  });
  const registry = inspectRegistry(binding.project.project_slug, registryPath);
  const universal = require("./universal-project-contract").inspectUniversalProjectContract(
    binding.project.project_slug,
    { projectsRoot, runtimeRoot: options.runtimeRoot }
  );

  const capabilities = {
    enabled: universal.domains.filter((domain) => domain.status === "READY").map((domain) => domain.id).sort(),
    partial: universal.domains.filter((domain) => domain.status === "PARTIAL").map((domain) => domain.id).sort(),
    unavailable: universal.domains.filter((domain) => domain.status === "MISSING").map((domain) => domain.id).sort(),
    authoritative: false,
    source_owner: "universal-project-contract"
  };
  const identityReady = binding.project.identity_state === "VALID";
  const workspaceReady = Boolean(binding.workspace_binding);
  const bindingReady = workspaceReady
    && binding.workspace_binding.relationship_status === "ATTACHED"
    && binding.workspace_binding.validation_state === "VALID";
  const registryReady = registry.state === "REGISTERED";
  const projectionReady = binding.project_projection.present === true && binding.project_projection.aligned === true;
  const capabilitiesReady = capabilities.enabled.length > 0;

  const lifecycle = [
    stage(1, "workspace", workspaceReady ? "RESOLVED" : (identityReady ? "UNRESOLVED" : "BLOCKED_BY_PROJECT_IDENTITY"), workspaceReady, "workspace-runtime", true),
    stage(2, "workspace_binding", bindingReady ? "ATTACHED_VALID" : binding.readiness.state, bindingReady, "workspace-relationship-runtime", true),
    stage(3, "project_identity", binding.project.identity_state, identityReady, "project-identity", true),
    stage(4, "project_registry", registry.state, registryReady, "backend-project-registry", true),
    stage(5, "projection", projectionReady ? "ALIGNED" : (binding.project_projection.present ? "MISMATCH" : "MISSING"), projectionReady, "project-workspace-projection", false),
    stage(6, "universal_project_contract", "AVAILABLE", true, "universal-project-contract", false),
    stage(7, "capabilities", capabilitiesReady ? "AVAILABLE" : "NONE_READY", capabilitiesReady, "project-lifecycle-readiness", false)
  ];

  let readinessState = "READY";
  if (!identityReady) readinessState = binding.readiness.state;
  else if (!workspaceReady || !bindingReady) readinessState = binding.readiness.state;
  else if (!registryReady) readinessState = registry.state;
  else if (!projectionReady) readinessState = binding.readiness.state;
  else if (!capabilitiesReady) readinessState = "NO_READY_CAPABILITIES";

  const blockers = lifecycle
    .filter((item) => !item.ready)
    .map((item) => `${item.name}:${item.state}`)
    .sort();

  return validateProjectLifecycleReadiness({
    schema_version: PROJECT_LIFECYCLE_READINESS_SCHEMA_VERSION,
    kind: "project_lifecycle_activation_readiness",
    project: {
      project_slug: binding.project.project_slug,
      project_id: binding.project.project_id
    },
    lifecycle,
    capabilities,
    readiness: {
      state: readinessState,
      ready: readinessState === "READY",
      blockers
    },
    authority: {
      creates_identity: false,
      creates_workspace: false,
      registers_project: false,
      writes_projection: false,
      mutates_data: false,
      backend_authoritative: true,
      frontend_projection_only: true
    }
  });
}

module.exports = Object.freeze({
  PROJECT_LIFECYCLE_READINESS_SCHEMA_VERSION,
  PROJECT_LIFECYCLE_STAGE_NAMES,
  PROJECT_LIFECYCLE_READINESS_STATES,
  DEFAULT_REGISTRY_PATH,
  ProjectLifecycleReadinessError,
  validateProjectLifecycleReadiness,
  inspectProjectLifecycleReadiness
});

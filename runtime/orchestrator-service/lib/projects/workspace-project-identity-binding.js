"use strict";

const projectIdentity = require("./project-identity");
const projectWorkspaceProjection = require("./project-workspace-projection");
const universalProjectContract = require("./universal-project-contract");
const workspaceContract = require("../workspace/workspace-contract");
const workspaceStorage = require("../workspace/workspace-storage");

const WORKSPACE_PROJECT_IDENTITY_BINDING_SCHEMA_VERSION = 1;
const WORKSPACE_PROJECT_IDENTITY_BINDING_STATES = Object.freeze([
  "READY",
  "MISSING_PROJECT_IDENTITY",
  "MISSING_WORKSPACE_BINDING",
  "AMBIGUOUS_WORKSPACE_BINDING",
  "BINDING_NOT_ATTACHED",
  "PROJECTION_MISSING",
  "PROJECTION_MISMATCH",
  "SOURCE_INVALID"
]);
const ACTIVE_RELATIONSHIP_STATES = new Set(["PENDING_ATTACH", "ATTACHED", "PENDING_DETACH"]);
const TOP_LEVEL_FIELDS = Object.freeze([
  "schema_version", "kind", "project", "workspace_binding", "project_projection",
  "universal_project_contract", "readiness", "authority"
]);

class WorkspaceProjectIdentityBindingError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "WorkspaceProjectIdentityBindingError";
    this.code = "WORKSPACE_PROJECT_IDENTITY_BINDING_INVALID";
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
  throw new WorkspaceProjectIdentityBindingError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the canonical contract`, { actual, expected });
  }
}

function validateWorkspaceProjectIdentityBinding(value) {
  assertExactFields(value, TOP_LEVEL_FIELDS, "binding");
  if (value.schema_version !== WORKSPACE_PROJECT_IDENTITY_BINDING_SCHEMA_VERSION) {
    fail("binding schema_version is unsupported");
  }
  if (value.kind !== "workspace_project_identity_binding") fail("binding kind is invalid");

  assertExactFields(value.project, ["project_slug", "project_id", "identity_state", "authoritative", "source_owner"], "project");
  if (typeof value.project.project_slug !== "string" || !value.project.project_slug) fail("project_slug is invalid");
  if (value.project.project_id !== null) {
    try { workspaceContract.validateProjectId(value.project.project_id); } catch { fail("project_id is invalid"); }
  }
  if (!projectIdentity.PROJECT_IDENTITY_STATES.includes(value.project.identity_state)) fail("identity_state is invalid");
  if ((value.project.identity_state === "MISSING") !== (value.project.project_id === null)) {
    fail("project_id presence conflicts with identity_state");
  }
  if (value.project.authoritative !== true || value.project.source_owner !== "project-identity") {
    fail("Project identity authority is invalid");
  }

  if (value.workspace_binding !== null) {
    assertExactFields(value.workspace_binding, [
      "workspace_id", "relationship_id", "relationship_status", "validation_state",
      "workspace_version", "authoritative", "source_owner"
    ], "workspace_binding");
    try {
      workspaceContract.validateWorkspaceId(value.workspace_binding.workspace_id);
      workspaceContract.validateProjectRelationshipId(value.workspace_binding.relationship_id);
      workspaceContract.validateProjectRelationshipStatus(value.workspace_binding.relationship_status);
      workspaceContract.validateValidationState(value.workspace_binding.validation_state);
    } catch { fail("workspace_binding identity or state is invalid"); }
    if (!Number.isSafeInteger(value.workspace_binding.workspace_version) || value.workspace_binding.workspace_version < 1) {
      fail("workspace_binding workspace_version is invalid");
    }
    if (value.workspace_binding.authoritative !== true
      || value.workspace_binding.source_owner !== "workspace-relationship-runtime") {
      fail("Workspace relationship authority is invalid");
    }
  }

  assertExactFields(value.project_projection, ["present", "aligned", "authoritative", "source_owner"], "project_projection");
  if (typeof value.project_projection.present !== "boolean"
    || ![true, false, null].includes(value.project_projection.aligned)
    || value.project_projection.authoritative !== false
    || value.project_projection.source_owner !== "workspace-runtime") {
    fail("Project Workspace projection contract is invalid");
  }
  if (!value.project_projection.present && value.project_projection.aligned !== null) {
    fail("A missing Project Workspace projection cannot be aligned");
  }

  assertExactFields(value.universal_project_contract, ["schema_version", "kind", "project", "authoritative"], "universal_project_contract");
  if (value.universal_project_contract.schema_version !== universalProjectContract.UNIVERSAL_PROJECT_CONTRACT_SCHEMA_VERSION
    || value.universal_project_contract.kind !== "universal_project_readiness_projection"
    || value.universal_project_contract.project !== value.project.project_slug
    || value.universal_project_contract.authoritative !== false) {
    fail("Universal Project Contract binding is invalid");
  }

  assertExactFields(value.readiness, ["state", "ready", "gaps"], "readiness");
  if (!WORKSPACE_PROJECT_IDENTITY_BINDING_STATES.includes(value.readiness.state)) fail("readiness state is invalid");
  if (value.readiness.ready !== (value.readiness.state === "READY")) fail("readiness boolean conflicts with state");
  if (!Array.isArray(value.readiness.gaps)
    || value.readiness.gaps.some((gap) => typeof gap !== "string" || !gap)
    || JSON.stringify(value.readiness.gaps) !== JSON.stringify([...new Set(value.readiness.gaps)].sort())) {
    fail("readiness gaps must be unique deterministic strings");
  }
  if (value.readiness.ready) {
    if (value.project.identity_state !== "VALID" || value.workspace_binding === null
      || value.workspace_binding.relationship_status !== "ATTACHED"
      || value.workspace_binding.validation_state !== "VALID"
      || value.project_projection.present !== true || value.project_projection.aligned !== true
      || value.readiness.gaps.length !== 0) {
      fail("READY requires valid identity, attached binding, aligned projection, and no gaps");
    }
  } else if (value.readiness.gaps.length === 0) {
    fail("A non-ready binding must expose at least one gap");
  }

  assertExactFields(value.authority, ["creates_identity", "mutates_data", "project_identity_owner", "workspace_relationship_owner"], "authority");
  if (value.authority.creates_identity !== false || value.authority.mutates_data !== false
    || value.authority.project_identity_owner !== "project-identity"
    || value.authority.workspace_relationship_owner !== "workspace-relationship-runtime") {
    fail("binding authority declaration is invalid");
  }
  return deepFreeze(copy(value));
}

function relationshipBinding(workspace, relationship) {
  return {
    workspace_id: workspace.workspace_id,
    relationship_id: relationship.relationship_id,
    relationship_status: relationship.relationship_status,
    validation_state: relationship.validation_state,
    workspace_version: workspace.workspace_version,
    authoritative: true,
    source_owner: "workspace-relationship-runtime"
  };
}

function inspectWorkspaceProjectIdentityBinding(projectSlug, options = {}) {
  const projectsRoot = options.projectsRoot === undefined ? projectIdentity.DEFAULT_PROJECTS_ROOT : options.projectsRoot;
  const workspaceRoot = options.workspaceRoot === undefined ? workspaceStorage.DEFAULT_WORKSPACE_ROOT : options.workspaceRoot;
  const identity = projectIdentity.inspectProjectIdentity(projectSlug, { projectsRoot });
  const universal = universalProjectContract.inspectUniversalProjectContract(identity.project_slug, {
    projectsRoot,
    runtimeRoot: options.runtimeRoot
  });
  const gaps = [];
  let state = "READY";
  let binding = null;
  let projection = { present: false, aligned: null, authoritative: false, source_owner: "workspace-runtime" };

  if (identity.state !== "VALID") {
    state = identity.state === "MISSING" ? "MISSING_PROJECT_IDENTITY" : "SOURCE_INVALID";
    gaps.push(identity.state === "MISSING"
      ? "Project identity has not been assigned by project-identity"
      : "Project identity metadata is incomplete");
  } else {
    const discovery = workspaceStorage.discoverWorkspacesWithDiagnostics(workspaceRoot);
    const sourceDiagnostics = discovery.diagnostics.filter((item) => !["HIDDEN_ENTRY", "NOT_REAL_DIRECTORY", "MALFORMED_WORKSPACE_ID"].includes(item.reason));
    if (sourceDiagnostics.length > 0) {
      state = "SOURCE_INVALID";
      gaps.push("Workspace authority scan is incomplete");
    }
    const matches = discovery.workspaces.flatMap((workspace) => workspace.project_relationships
      .filter((relationship) => relationship.project_id === identity.project_id && ACTIVE_RELATIONSHIP_STATES.has(relationship.relationship_status))
      .map((relationship) => ({ workspace, relationship })))
      .sort((left, right) => `${left.workspace.workspace_id}:${left.relationship.relationship_id}`
        .localeCompare(`${right.workspace.workspace_id}:${right.relationship.relationship_id}`));

    if (matches.length === 0 && state !== "SOURCE_INVALID") {
      state = "MISSING_WORKSPACE_BINDING";
      gaps.push("No active Workspace relationship references the authoritative project_id");
    } else if (matches.length > 1) {
      state = "AMBIGUOUS_WORKSPACE_BINDING";
      gaps.push("More than one active Workspace relationship references the authoritative project_id");
    } else if (matches.length === 1) {
      binding = relationshipBinding(matches[0].workspace, matches[0].relationship);
      if (binding.relationship_status !== "ATTACHED" || binding.validation_state !== "VALID") {
        if (state === "READY") state = "BINDING_NOT_ATTACHED";
        gaps.push("Workspace relationship is not terminally ATTACHED and VALID");
      }
    }

    const inspectedProjection = projectWorkspaceProjection.inspectProjectWorkspaceProjection(
      { project_id: identity.project_id },
      { projectsRoot }
    );
    projection.present = inspectedProjection.exists;
    if (binding && binding.relationship_status === "ATTACHED" && inspectedProjection.exists) {
      const stored = inspectedProjection.workspace_projection;
      projection.aligned = stored.workspace_id === binding.workspace_id
        && stored.relationship_id === binding.relationship_id
        && stored.relationship_status === "ATTACHED"
        && stored.workspace_version === binding.workspace_version
        && stored.authoritative === false
        && stored.source_owner === "workspace-runtime";
    }
    if (binding && binding.relationship_status === "ATTACHED" && !projection.present) {
      if (state === "READY") state = "PROJECTION_MISSING";
      gaps.push("Attached Workspace relationship has no Project-side projection");
    } else if (binding && binding.relationship_status === "ATTACHED" && projection.aligned === false) {
      if (state === "READY") state = "PROJECTION_MISMATCH";
      gaps.push("Project-side Workspace projection does not match Workspace relationship authority");
    }
  }

  const result = {
    schema_version: WORKSPACE_PROJECT_IDENTITY_BINDING_SCHEMA_VERSION,
    kind: "workspace_project_identity_binding",
    project: {
      project_slug: identity.project_slug,
      project_id: identity.project_id,
      identity_state: identity.state,
      authoritative: true,
      source_owner: "project-identity"
    },
    workspace_binding: binding,
    project_projection: projection,
    universal_project_contract: {
      schema_version: universal.schema_version,
      kind: universal.kind,
      project: universal.project,
      authoritative: universal.authoritative
    },
    readiness: { state, ready: state === "READY", gaps: [...new Set(gaps)].sort() },
    authority: {
      creates_identity: false,
      mutates_data: false,
      project_identity_owner: "project-identity",
      workspace_relationship_owner: "workspace-relationship-runtime"
    }
  };
  return validateWorkspaceProjectIdentityBinding(result);
}

module.exports = Object.freeze({
  WORKSPACE_PROJECT_IDENTITY_BINDING_SCHEMA_VERSION,
  WORKSPACE_PROJECT_IDENTITY_BINDING_STATES,
  WorkspaceProjectIdentityBindingError,
  validateWorkspaceProjectIdentityBinding,
  inspectWorkspaceProjectIdentityBinding
});

"use strict";

const {
  validateWorkspaceId,
  validateProjectRelationshipId
} = require("./workspace-contract");
const relationshipRuntime = require("./workspace-relationship-runtime");
const workspaceRuntime = require("./workspace-runtime");
const projectIdentity = require("../projects/project-identity");
const projectionRuntime = require("../projects/project-workspace-projection");

const DEFAULT_ACTIVE_STATUSES = Object.freeze([
  "PENDING_ATTACH",
  "ATTACHED",
  "PENDING_DETACH"
]);

const HISTORY_STATUSES = Object.freeze([
  "DETACHED",
  "ARCHIVED"
]);

const SNAPSHOT_CONSISTENCY = "BEST_EFFORT";

function deepCopy(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

function normalizeOptions(options) {
  if (options === undefined) return {};
  if (!isPlainObject(options)) {
    throw new TypeError("options must be a plain object");
  }
  return options;
}

function dependencies(options) {
  const normalized = normalizeOptions(options);
  const relationships = normalized.relationshipRuntime || relationshipRuntime;
  const workspaces = normalized.workspaceRuntime || workspaceRuntime;
  const identity = normalized.projectIdentity || projectIdentity;
  const projections = normalized.projectionRuntime || projectionRuntime;
  const now = normalized.now || (() => new Date().toISOString());

  if (typeof relationships.getWorkspaceProjectRelationship !== "function") {
    throw new TypeError("relationshipRuntime.getWorkspaceProjectRelationship must be a function");
  }
  if (typeof relationships.listWorkspaceProjectRelationships !== "function") {
    throw new TypeError("relationshipRuntime.listWorkspaceProjectRelationships must be a function");
  }
  if (typeof workspaces.getWorkspace !== "function") {
    throw new TypeError("workspaceRuntime.getWorkspace must be a function");
  }
  if (typeof identity.findProjectById !== "function") {
    throw new TypeError("projectIdentity.findProjectById must be a function");
  }
  if (typeof projections.inspectProjectWorkspaceProjection !== "function") {
    throw new TypeError("projectionRuntime.inspectProjectWorkspaceProjection must be a function");
  }
  if (typeof projections.createProjectWorkspaceProjectionFingerprint !== "function") {
    throw new TypeError("projectionRuntime.createProjectWorkspaceProjectionFingerprint must be a function");
  }
  if (typeof now !== "function") {
    throw new TypeError("now must be a function");
  }

  return {
    relationships,
    workspaces,
    identity,
    projections,
    now,
    forwardedOptions: normalized
  };
}

function assertExactFields(input, required, optional, label) {
  if (!isPlainObject(input)) {
    throw new TypeError(`${label} must be a plain object`);
  }
  const allowed = new Set([...required, ...optional]);
  for (const field of Object.keys(input)) {
    if (!allowed.has(field)) {
      throw new TypeError(`${label} contains unknown field: ${field}`);
    }
  }
  for (const field of required) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      throw new TypeError(`${label} is missing required field: ${field}`);
    }
  }
}

function normalizeInspectInput(input) {
  assertExactFields(input, ["workspace_id", "relationship_id"], [], "inspection input");
  validateWorkspaceId(input.workspace_id);
  validateProjectRelationshipId(input.relationship_id);
  return Object.freeze({
    workspace_id: input.workspace_id,
    relationship_id: input.relationship_id
  });
}

function normalizeListInput(input) {
  assertExactFields(input, ["workspace_id"], ["include_history"], "list input");
  validateWorkspaceId(input.workspace_id);
  if (Object.prototype.hasOwnProperty.call(input, "include_history")
    && typeof input.include_history !== "boolean") {
    throw new TypeError("list input include_history must be a boolean");
  }
  return Object.freeze({
    workspace_id: input.workspace_id,
    include_history: input.include_history === true
  });
}

function expectedProjection(relationship, workspaceVersion, projections) {
  const targetStatusByRelationship = {
    PENDING_ATTACH: "ATTACHED",
    ATTACHED: "ATTACHED",
    PENDING_DETACH: "DETACHED",
    DETACHED: "DETACHED",
    ARCHIVED: "ARCHIVED"
  };
  const target = targetStatusByRelationship[relationship.relationship_status];
  if (!target) return null;

  const targetVersion = relationship.relationship_status === "PENDING_ATTACH"
    || relationship.relationship_status === "PENDING_DETACH"
    ? workspaceVersion + 1
    : workspaceVersion;

  return {
    projection_schema_version: projections.PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION,
    workspace_id: relationship.workspace_id,
    relationship_id: relationship.relationship_id,
    relationship_status: target,
    workspace_version: targetVersion,
    projected_at: relationship.updated_at,
    authoritative: false,
    source_owner: projections.PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER
  };
}

function baseResult(input, observedAt) {
  return {
    workspace_id: input.workspace_id,
    relationship_id: input.relationship_id,
    project_id: null,
    resolution_state: "RESOLVED",
    authority_alignment: "NOT_APPLICABLE",
    operation_readiness: "BLOCKED",
    storage_health: "UNKNOWN",
    recommended_action: "NONE",
    repair_eligibility: "UNKNOWN",
    blocker: null,
    observed_workspace_version: null,
    observed_relationship_status: null,
    observed_projection_fingerprint: null,
    expected_projection_fingerprint: null,
    observed_at: observedAt,
    snapshot_consistency: SNAPSHOT_CONSISTENCY,
    evidence: null,
    error: null
  };
}

function assignRecovery(result, error, source) {
  if (source === "workspace") {
    result.storage_health = "WORKSPACE_RECOVERY_REQUIRED";
    result.recommended_action = "RECOVER_WORKSPACE_STORAGE";
  } else {
    result.storage_health = "PROJECT_PROJECTION_RECOVERY_REQUIRED";
    result.recommended_action = "RECOVER_PROJECT_STORAGE";
  }
  result.operation_readiness = "RECOVERY_REQUIRED";
  result.repair_eligibility = "ELIGIBLE";
  result.authority_alignment = "NOT_APPLICABLE";
  result.blocker = {
    code: error.code || null,
    source
  };
  result.error = serializeError(error);
  return result;
}

function serializeError(error) {
  if (!error) return null;
  return {
    name: error.name,
    code: error.code,
    message: error.message,
    outcome: error.outcome,
    details: deepCopy(error.details)
  };
}

function isWorkspaceRecoveryError(error) {
  return error
    && (error.code === "WORKSPACE_RELATIONSHIP_WORKSPACE_RECOVERY_REQUIRED"
      || error.code === "WORKSPACE_RUNTIME_WORKSPACE_RECOVERY_REQUIRED");
}

function isProjectRecoveryError(error) {
  return error
    && (error.code === "PROJECT_PROJECTION_RECOVERY_REQUIRED"
      || error.code === "PROJECT_PROJECTION_PATH_OUTSIDE_ROOT"
      || error.code === "PROJECT_PROJECTION_SYMLINK_FORBIDDEN");
}

function aheadOfAuthority(relationship, workspaceVersion, inspection) {
  if (!inspection || !inspection.workspace_projection) return false;
  const projection = inspection.workspace_projection;
  if (relationship.relationship_status === "PENDING_ATTACH") {
    return projection.workspace_id === relationship.workspace_id
      && projection.relationship_id === relationship.relationship_id
      && projection.relationship_status === "ATTACHED"
      && projection.workspace_version === workspaceVersion + 1;
  }
  if (relationship.relationship_status === "PENDING_DETACH") {
    return projection.workspace_id === relationship.workspace_id
      && projection.relationship_id === relationship.relationship_id
      && projection.relationship_status === "DETACHED"
      && projection.workspace_version === workspaceVersion + 1;
  }
  return false;
}

function applyAlignmentOutcome(result, relationshipStatus, alignment) {
  result.authority_alignment = alignment;
  result.storage_health = "HEALTHY";

  if (alignment === "AHEAD_OF_AUTHORITY") {
    result.operation_readiness = "READY_TO_COMPLETE_TERMINAL";
    result.recommended_action = relationshipStatus === "PENDING_ATTACH"
      ? "COMPLETE_PENDING_ATTACH"
      : "COMPLETE_PENDING_DETACH";
    result.repair_eligibility = "ELIGIBLE";
    return result;
  }

  const isPending = relationshipStatus === "PENDING_ATTACH" || relationshipStatus === "PENDING_DETACH";
  const isTerminal = relationshipStatus === "ATTACHED"
    || relationshipStatus === "DETACHED"
    || relationshipStatus === "ARCHIVED";

  if (alignment === "MATCH") {
    result.operation_readiness = "COMPLETE";
    result.recommended_action = "NONE";
    result.repair_eligibility = "INELIGIBLE";
    return result;
  }

  if (alignment === "MISSING") {
    if (isPending) {
      result.operation_readiness = "READY_TO_PROJECT";
      result.recommended_action = "WRITE_MISSING_PROJECTION";
      result.repair_eligibility = "ELIGIBLE";
      return result;
    }
    if (isTerminal) {
      result.operation_readiness = "PARTIAL";
      result.recommended_action = "WRITE_MISSING_PROJECTION";
      result.repair_eligibility = "ELIGIBLE";
      return result;
    }
  }

  if (alignment === "STALE") {
    if (isPending) {
      result.operation_readiness = "READY_TO_PROJECT";
      result.recommended_action = "UPDATE_STALE_PROJECTION";
      result.repair_eligibility = "ELIGIBLE";
      return result;
    }
    if (isTerminal) {
      result.operation_readiness = "PARTIAL";
      result.recommended_action = "UPDATE_STALE_PROJECTION";
      result.repair_eligibility = "ELIGIBLE";
      return result;
    }
  }

  if (alignment === "CONFLICTING") {
    result.operation_readiness = "BLOCKED";
    result.recommended_action = "INVESTIGATE_CONFLICT";
    result.repair_eligibility = "INELIGIBLE";
    return result;
  }

  result.operation_readiness = "BLOCKED";
  result.recommended_action = "NONE";
  result.repair_eligibility = "UNKNOWN";
  return result;
}

async function inspectWorkspaceProjectProjectionDrift(input, options = {}) {
  const normalized = normalizeInspectInput(input);
  const deps = dependencies(options);
  const observedAt = deps.now();
  const result = baseResult(normalized, observedAt);

  let relationship;
  try {
    relationship = await deps.relationships.getWorkspaceProjectRelationship(
      {
        workspace_id: normalized.workspace_id,
        relationship_id: normalized.relationship_id
      },
      deps.forwardedOptions
    );
  } catch (error) {
    if (isWorkspaceRecoveryError(error)) return assignRecovery(result, error, "workspace");
    result.storage_health = "UNKNOWN";
    result.repair_eligibility = "UNKNOWN";
    result.operation_readiness = "BLOCKED";
    result.recommended_action = "NONE";
    result.error = serializeError(error);
    result.blocker = {
      code: error.code || null,
      source: "relationship"
    };
    return result;
  }

  result.project_id = relationship.project_id;
  result.observed_relationship_status = relationship.relationship_status;
  result.evidence = {
    relationship_id: relationship.relationship_id,
    project_id: relationship.project_id,
    relationship_status: relationship.relationship_status
  };

  let workspace;
  try {
    workspace = await deps.workspaces.getWorkspace(normalized.workspace_id, deps.forwardedOptions);
  } catch (error) {
    if (isWorkspaceRecoveryError(error)) return assignRecovery(result, error, "workspace");
    result.storage_health = "UNKNOWN";
    result.repair_eligibility = "UNKNOWN";
    result.operation_readiness = "BLOCKED";
    result.recommended_action = "NONE";
    result.error = serializeError(error);
    result.blocker = {
      code: error.code || null,
      source: "workspace"
    };
    return result;
  }

  result.observed_workspace_version = workspace.workspace_version;

  let identityResolution;
  try {
    identityResolution = deps.identity.findProjectById(relationship.project_id, deps.forwardedOptions);
  } catch (error) {
    if (error && error.code === "PROJECT_ID_COLLISION") {
      result.resolution_state = "PROJECT_ID_COLLISION";
      result.storage_health = "HEALTHY";
      result.operation_readiness = "BLOCKED";
      result.recommended_action = "RESOLVE_PROJECT_IDENTITY";
      result.repair_eligibility = "INELIGIBLE";
      result.error = serializeError(error);
      result.blocker = { code: error.code, source: "project-identity" };
      return result;
    }
    result.storage_health = "UNKNOWN";
    result.operation_readiness = "BLOCKED";
    result.recommended_action = "NONE";
    result.repair_eligibility = "UNKNOWN";
    result.error = serializeError(error);
    result.blocker = { code: error.code || null, source: "project-identity" };
    return result;
  }

  if (!identityResolution || identityResolution.resolution === "UNRESOLVED") {
    result.resolution_state = "UNRESOLVED_PROJECT";
    result.storage_health = "HEALTHY";
    result.operation_readiness = "BLOCKED";
    result.recommended_action = "RESOLVE_PROJECT_IDENTITY";
    result.repair_eligibility = "INELIGIBLE";
    result.blocker = { code: "UNRESOLVED_PROJECT", source: "project-identity" };
    return result;
  }

  const expected = expectedProjection(relationship, workspace.workspace_version, deps.projections);
  if (expected === null) {
    result.authority_alignment = "NOT_APPLICABLE";
    result.storage_health = "HEALTHY";
    result.operation_readiness = "BLOCKED";
    result.recommended_action = "NONE";
    result.repair_eligibility = "UNKNOWN";
    result.blocker = {
      code: "RELATIONSHIP_STATUS_UNSUPPORTED",
      source: "relationship"
    };
    return result;
  }

  result.expected_projection_fingerprint = deps.projections.createProjectWorkspaceProjectionFingerprint(expected);

  let inspection;
  try {
    inspection = await deps.projections.inspectProjectWorkspaceProjection(
      {
        project_id: relationship.project_id,
        expected_projection: expected
      },
      deps.forwardedOptions
    );
  } catch (error) {
    if (isProjectRecoveryError(error)) return assignRecovery(result, error, "project");
    if (error && error.code === "PROJECT_PROJECTION_PROJECT_ID_COLLISION") {
      result.resolution_state = "PROJECT_ID_COLLISION";
      result.storage_health = "HEALTHY";
      result.operation_readiness = "BLOCKED";
      result.recommended_action = "RESOLVE_PROJECT_IDENTITY";
      result.repair_eligibility = "INELIGIBLE";
      result.error = serializeError(error);
      result.blocker = { code: error.code, source: "project-identity" };
      return result;
    }
    if (error && error.code === "PROJECT_PROJECTION_PROJECT_NOT_FOUND") {
      result.storage_health = "HEALTHY";
      result.operation_readiness = "BLOCKED";
      result.recommended_action = "RESOLVE_PROJECT_IDENTITY";
      result.repair_eligibility = "INELIGIBLE";
      result.error = serializeError(error);
      result.blocker = { code: error.code, source: "projection" };
      return result;
    }
    result.storage_health = "UNKNOWN";
    result.operation_readiness = "BLOCKED";
    result.recommended_action = "NONE";
    result.repair_eligibility = "UNKNOWN";
    result.error = serializeError(error);
    result.blocker = { code: error.code || null, source: "projection" };
    return result;
  }

  result.observed_projection_fingerprint = inspection.projection_fingerprint || null;

  if (aheadOfAuthority(relationship, workspace.workspace_version, inspection)) {
    return applyAlignmentOutcome(result, relationship.relationship_status, "AHEAD_OF_AUTHORITY");
  }

  return applyAlignmentOutcome(result, relationship.relationship_status, inspection.classification || "NOT_APPLICABLE");
}

function activeStatuses(includeHistory) {
  return includeHistory
    ? [...DEFAULT_ACTIVE_STATUSES, ...HISTORY_STATUSES]
    : [...DEFAULT_ACTIVE_STATUSES];
}

async function listWorkspaceProjectionDrift(input, options = {}) {
  const normalized = normalizeListInput(input);
  const deps = dependencies(options);
  const statuses = new Set(activeStatuses(normalized.include_history));
  const observedAt = deps.now();

  const output = {
    workspace_id: normalized.workspace_id,
    include_history: normalized.include_history,
    statuses: Array.from(statuses),
    observed_at: observedAt,
    snapshot_consistency: SNAPSHOT_CONSISTENCY,
    items: [],
    errors: []
  };

  let relationships;
  try {
    relationships = await deps.relationships.listWorkspaceProjectRelationships(
      { workspace_id: normalized.workspace_id },
      deps.forwardedOptions
    );
  } catch (error) {
    output.errors.push({
      relationship_id: null,
      error: serializeError(error)
    });
    return output;
  }

  for (const relationship of relationships) {
    if (!statuses.has(relationship.relationship_status)) continue;
    try {
      const item = await inspectWorkspaceProjectProjectionDrift(
        {
          workspace_id: normalized.workspace_id,
          relationship_id: relationship.relationship_id
        },
        options
      );
      output.items.push(item);
      if (item.error) {
        output.errors.push({
          relationship_id: relationship.relationship_id,
          error: deepCopy(item.error)
        });
      }
    } catch (error) {
      const failed = {
        workspace_id: normalized.workspace_id,
        relationship_id: relationship.relationship_id,
        project_id: relationship.project_id || null,
        resolution_state: "RESOLVED",
        authority_alignment: "NOT_APPLICABLE",
        operation_readiness: "BLOCKED",
        storage_health: "UNKNOWN",
        recommended_action: "NONE",
        repair_eligibility: "UNKNOWN",
        blocker: {
          code: error.code || null,
          source: "inspector"
        },
        observed_workspace_version: null,
        observed_relationship_status: relationship.relationship_status || null,
        observed_projection_fingerprint: null,
        expected_projection_fingerprint: null,
        observed_at: deps.now(),
        snapshot_consistency: SNAPSHOT_CONSISTENCY,
        evidence: {
          relationship_id: relationship.relationship_id,
          project_id: relationship.project_id || null,
          relationship_status: relationship.relationship_status || null
        },
        error: serializeError(error)
      };
      output.items.push(failed);
      output.errors.push({
        relationship_id: relationship.relationship_id,
        error: deepCopy(failed.error)
      });
    }
  }

  return output;
}

function incrementCount(map, key) {
  map[key] = (map[key] || 0) + 1;
}

async function summarizeWorkspaceProjectionDrift(input, options = {}) {
  const list = await listWorkspaceProjectionDrift(input, options);
  const summary = {
    workspace_id: list.workspace_id,
    include_history: list.include_history,
    statuses: deepCopy(list.statuses),
    observed_at: list.observed_at,
    snapshot_consistency: list.snapshot_consistency,
    inspected_relationships: list.items.length,
    error_count: list.errors.length,
    counts: {
      resolution_state: {},
      authority_alignment: {},
      operation_readiness: {},
      storage_health: {},
      recommended_action: {},
      repair_eligibility: {}
    },
    errors: deepCopy(list.errors)
  };

  for (const item of list.items) {
    incrementCount(summary.counts.resolution_state, item.resolution_state);
    incrementCount(summary.counts.authority_alignment, item.authority_alignment);
    incrementCount(summary.counts.operation_readiness, item.operation_readiness);
    incrementCount(summary.counts.storage_health, item.storage_health);
    incrementCount(summary.counts.recommended_action, item.recommended_action);
    incrementCount(summary.counts.repair_eligibility, item.repair_eligibility);
  }

  return summary;
}

module.exports = Object.freeze({
  inspectWorkspaceProjectProjectionDrift,
  listWorkspaceProjectionDrift,
  summarizeWorkspaceProjectionDrift
});

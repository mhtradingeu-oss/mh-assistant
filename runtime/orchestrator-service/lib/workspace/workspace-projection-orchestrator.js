"use strict";

const relationshipRuntime = require("./workspace-relationship-runtime");
const workspaceRuntime = require("./workspace-runtime");
const projectionRuntime = require("../projects/project-workspace-projection");

function ownerOptions(options) {
  if (options === undefined) return {};
  return options;
}

function owners(options) {
  return {
    relationships: (options && options.relationshipRuntime) || relationshipRuntime,
    workspaces: (options && options.workspaceRuntime) || workspaceRuntime,
    projections: (options && options.projectionRuntime) || projectionRuntime
  };
}

function errorDetails(error) {
  if (!error) return null;
  return Object.freeze({
    name: error.name,
    code: error.code,
    message: error.message,
    outcome: error.outcome,
    details: error.details,
    persistence: error.persistence,
    lower_level_error: error.lower_level_error
  });
}

function relationshipFailure(kind, error, relationship = null) {
  const failed = kind === "attach" ? "ATTACH_FAILED" : "DETACH_FAILED";
  const ownerOutcomes = kind === "attach"
    ? new Set([
      "ATTACH_PENDING",
      "ATTACH_CONFLICT",
      "ATTACH_RECOVERY_REQUIRED",
      "ATTACH_FAILED"
    ])
    : new Set([
      "DETACH_PENDING",
      "DETACH_CONFLICT",
      "DETACH_RECOVERY_REQUIRED",
      "DETACH_FAILED"
    ]);
  return Object.freeze({
    outcome: ownerOutcomes.has(error && error.outcome) ? error.outcome : failed,
    relationship_result: null,
    relationship,
    projection_inspection: null,
    projection_result: null,
    projection_attempted: false,
    error: errorDetails(error)
  });
}

function relationshipIncomplete(kind, result, relationship = null) {
  const allowed = kind === "attach"
    ? new Set(["ATTACH_PENDING", "ATTACH_CONFLICT", "ATTACH_RECOVERY_REQUIRED", "ATTACH_FAILED"])
    : new Set(["DETACH_PENDING", "DETACH_CONFLICT", "DETACH_RECOVERY_REQUIRED", "DETACH_FAILED"]);
  return Object.freeze({
    outcome: allowed.has(result.outcome)
      ? result.outcome
      : kind === "attach" ? "ATTACH_FAILED" : "DETACH_FAILED",
    relationship_result: result,
    relationship: result.relationship || relationship,
    projection_inspection: null,
    projection_result: null,
    projection_attempted: false,
    error: null
  });
}

function pendingConflict(kind, relationship, workspaceVersion) {
  const outcome = kind === "attach" ? "ATTACH_CONFLICT" : "DETACH_CONFLICT";
  return relationshipIncomplete(kind, {
    outcome,
    changed: false,
    workspace_version: workspaceVersion,
    relationship
  }, relationship);
}

function desiredProjection(relationship, workspaceVersion, projections) {
  return {
    projection_schema_version: projections.PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION,
    workspace_id: relationship.workspace_id,
    relationship_id: relationship.relationship_id,
    relationship_status: relationship.relationship_status,
    workspace_version: workspaceVersion,
    projected_at: relationship.updated_at,
    authoritative: false,
    source_owner: projections.PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER
  };
}

function projectionPartial(kind, relationshipResult, relationship, inspection, projectionResult, error) {
  return Object.freeze({
    outcome: kind === "attach" ? "ATTACH_PROJECTION_PARTIAL" : "DETACH_PROJECTION_PARTIAL",
    relationship_result: relationshipResult,
    relationship,
    projection_inspection: inspection,
    projection_result: projectionResult,
    projection_attempted: relationship !== null,
    error: errorDetails(error)
  });
}

function success(kind, relationshipResult, relationship, inspection, projectionResult) {
  return Object.freeze({
    outcome: kind === "attach" ? "ATTACH_SUCCESS" : "DETACH_SUCCESS",
    relationship_result: relationshipResult,
    relationship,
    projection_inspection: inspection,
    projection_result: projectionResult,
    projection_attempted: true,
    error: null
  });
}

async function complete(kind, input, options = {}) {
  const selected = owners(options);
  const forwardedOptions = ownerOptions(options);
  const completeRelationship = kind === "attach"
    ? selected.relationships.completeWorkspaceProjectAttach
    : selected.relationships.completeWorkspaceProjectDetach;
  const successOutcome = kind === "attach" ? "ATTACH_SUCCESS" : "DETACH_SUCCESS";
  const pendingStatus = kind === "attach" ? "PENDING_ATTACH" : "PENDING_DETACH";
  const terminalStatus = kind === "attach" ? "ATTACHED" : "DETACHED";

  let relationship;
  try {
    relationship = await selected.relationships.getWorkspaceProjectRelationship.call(
      selected.relationships,
      { workspace_id: input.workspace_id, relationship_id: input.relationship_id },
      forwardedOptions
    );
  } catch (error) {
    return relationshipFailure(kind, error);
  }
  if (relationship.relationship_status !== pendingStatus) {
    return pendingConflict(kind, relationship, null);
  }

  let workspace;
  try {
    workspace = await selected.workspaces.getWorkspace.call(
      selected.workspaces,
      input.workspace_id,
      forwardedOptions
    );
  } catch (error) {
    return relationshipFailure(kind, error, relationship);
  }
  if (workspace.workspace_version !== input.expected_workspace_version) {
    return pendingConflict(kind, relationship, workspace.workspace_version);
  }

  const desired = desiredProjection(
    { ...relationship, workspace_id: input.workspace_id, relationship_status: terminalStatus },
    workspace.workspace_version + 1,
    selected.projections
  );
  let inspection;
  try {
    inspection = await selected.projections.inspectProjectWorkspaceProjection.call(
      selected.projections,
      { project_id: relationship.project_id, expected_projection: desired },
      forwardedOptions
    );
  } catch (error) {
    return projectionPartial(kind, null, relationship, null, null, error);
  }

  let projectionResult;
  try {
    projectionResult = await selected.projections.writeProjectWorkspaceProjection.call(
      selected.projections,
      {
        project_id: relationship.project_id,
        desired_projection: desired,
        expected_current_projection: inspection.projection_fingerprint
      },
      forwardedOptions
    );
  } catch (error) {
    return projectionPartial(kind, null, relationship, inspection, null, error);
  }

  let relationshipResult;
  try {
    relationshipResult = await completeRelationship.call(selected.relationships, input, forwardedOptions);
  } catch (error) {
    return projectionPartial(kind, null, relationship, inspection, projectionResult, error);
  }
  if (!relationshipResult || relationshipResult.outcome !== successOutcome) {
    return projectionPartial(kind, relationshipResult || null, relationship, inspection, projectionResult, null);
  }
  return success(
    kind,
    relationshipResult,
    relationshipResult.relationship || relationship,
    inspection,
    projectionResult
  );
}

function completeWorkspaceProjectAttach(input, options = {}) {
  return complete("attach", input, options);
}

function completeWorkspaceProjectDetach(input, options = {}) {
  return complete("detach", input, options);
}

module.exports = Object.freeze({
  completeWorkspaceProjectAttach,
  completeWorkspaceProjectDetach
});

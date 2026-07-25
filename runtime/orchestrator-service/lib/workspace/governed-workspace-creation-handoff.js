"use strict";

const {
  projectWorkspaceCreationApproval
} = require("./workspace-creation-approval-projection");
const {
  assessWorkspaceCreationApproval
} = require("./workspace-creation-approval-model");
const {
  prepareControlledWorkspaceCreation
} = require("./controlled-workspace-creation-boundary");
const {
  markGovernedCreationRequest
} = require("./workspace-approval-authority-provenance");

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

async function prepareGovernedWorkspaceCreationHandoff(query, options = {}) {
  const projection = await projectWorkspaceCreationApproval(query, {
    approvalReader: options.approvalReader
  });
  const assessment = assessWorkspaceCreationApproval(projection);
  if (assessment.approval_state !== "APPROVED") {
    const error = new Error("Authoritative Workspace creation approval is not approved");
    error.code = "WORKSPACE_CREATION_NOT_APPROVED";
    error.assessment = assessment;
    throw error;
  }
  const creationRequest = markGovernedCreationRequest(deepFreeze({
    workspace_name: assessment.workspace_name,
    ownership_evidence: {
      evidence_id: assessment.evidence_reference.reference_id,
      workspace_name: assessment.workspace_name,
      action: assessment.action,
      decision: assessment.decision,
      owner: assessment.owner,
      decided_by: assessment.approver.approver_id,
      decided_at: assessment.approver.decided_at,
      source_owner: "governance-approval-engine"
    }
  }));
  const runtimeOptions = {
    workspaceRuntime: options.workspaceRuntime,
    workspaceRoot: options.workspaceRoot,
    storage: options.storage,
    now: options.now,
    generateWorkspaceId: options.generateWorkspaceId
  };
  const firstDryRun = await prepareControlledWorkspaceCreation(creationRequest, runtimeOptions);
  const secondDryRun = await prepareControlledWorkspaceCreation(creationRequest, runtimeOptions);
  if (JSON.stringify(firstDryRun) !== JSON.stringify(secondDryRun)) {
    throw new Error("Controlled Workspace creation dry-run plan is not deterministic");
  }
  return deepFreeze({
    kind: "governed_workspace_creation_handoff",
    approval_projection: projection,
    approval_assessment: assessment,
    creation_request: creationRequest,
    dry_run: firstDryRun,
    safety: {
      read_only: true,
      approval_written: false,
      workspace_created: false,
      workspace_id_created: false,
      workspace_storage_written: false
    }
  });
}

module.exports = Object.freeze({ prepareGovernedWorkspaceCreationHandoff });

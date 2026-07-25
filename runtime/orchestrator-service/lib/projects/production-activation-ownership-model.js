"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const { executeActivationDryRun } = require("./activation-executor-boundary");
const {
  PRODUCTION_ACTIVATION_OWNERSHIP_SCHEMA_VERSION,
  validateProductionActivationOwnership
} = require("./production-activation-ownership-contract");

const AUTHORITY = Object.freeze({
  requester_source: "backend-request-context",
  activation_approver_source: "operations-backbone",
  execution_owner_source: "workspace-runtime",
  audit_owner_source: "operations-backbone",
  project_id_owner: "project-identity",
  workspace_project_owner: "workspace-relationship-runtime",
  executor_boundary_owner: "activation-executor-boundary",
  creates_approval: false,
  executes_activation: false,
  creates_workspace: false,
  creates_project: false,
  creates_identity: false,
  mutates_permissions: false,
  mutates_roles: false,
  mutates_data: false,
  mutates_filesystem: false,
  backend_authoritative: true,
  frontend_projection_only: true
});

function text(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function emptyRole(fields, state, sourceOwner) {
  return Object.fromEntries([
    ["state", state],
    ...fields.map((field) => [field, null]),
    ["source_owner", sourceOwner],
    ["evidence_ref", null]
  ]);
}

function requesterProjection(authorityModel, applicable) {
  const fields = ["requester_id", "requester_type"];
  if (!applicable) return emptyRole(fields, "NOT_APPLICABLE", "backend-request-context");
  const requester = authorityModel.requester;
  if (requester.state !== "PRESENT") {
    return emptyRole(fields, "MISSING", "backend-request-context");
  }
  return {
    state: "PRESENT",
    requester_id: requester.requester_id,
    requester_type: requester.requester_type,
    source_owner: "backend-request-context",
    evidence_ref: requester.evidence_ref
  };
}

function approverProjection(executorResult, applicable) {
  const fields = ["approver_id", "approval_id", "decision", "decided_at"];
  if (!applicable) return emptyRole(fields, "NOT_APPLICABLE", "operations-backbone");
  const approval = executorResult.approval_evidence;
  if (approval.state !== "VALID") return emptyRole(fields, "MISSING", "operations-backbone");
  return {
    state: "PRESENT",
    approver_id: approval.decided_by,
    approval_id: approval.approval_id,
    decision: approval.decision,
    decided_at: approval.decided_at,
    source_owner: "operations-backbone",
    evidence_ref: approval.evidence_ref
  };
}

function executionOwnerProjection(executorResult, applicable) {
  const fields = ["owner", "project_id", "mode"];
  if (!applicable) return emptyRole(fields, "NOT_APPLICABLE", "workspace-runtime");
  const executor = executorResult.execution_authority;
  if (executor.state !== "VALID") return emptyRole(fields, "MISSING", "workspace-runtime");
  return {
    state: "PRESENT",
    owner: executor.executor_id,
    project_id: executor.project_id,
    mode: executor.mode,
    source_owner: "workspace-runtime",
    evidence_ref: executor.evidence_ref
  };
}

function auditOwnerProjection(evidence, projectSlug, applicable) {
  const fields = ["owner", "project_slug"];
  if (!applicable) return emptyRole(fields, "NOT_APPLICABLE", "operations-backbone");
  const owner = text(evidence.owner);
  const evidenceProjectSlug = text(evidence.project_slug);
  const evidenceRef = text(evidence.evidence_ref);
  if (owner !== "operations-backbone" || evidenceProjectSlug !== projectSlug || !evidenceRef) {
    return emptyRole(fields, "MISSING", "operations-backbone");
  }
  return {
    state: "PRESENT",
    owner,
    project_slug: evidenceProjectSlug,
    source_owner: "operations-backbone",
    evidence_ref: evidenceRef
  };
}

function assessProductionActivationOwnership(projectSlug, evidence = {}, options = {}) {
  const normalizedSlug = normalizeProjectSlug(projectSlug);
  const executorBoundary = executeActivationDryRun(normalizedSlug, evidence, options);
  const authorityModel = executorBoundary.source_evidence.authority_model;
  const workflowReady = authorityModel.source_evidence.workflow.readiness.ready;
  const requester = requesterProjection(authorityModel, workflowReady);
  const activationApprover = approverProjection(executorBoundary, workflowReady);
  const executionOwner = executionOwnerProjection(executorBoundary, workflowReady);

  let ownershipState = "BLOCKED_ACTIVATION";
  if (workflowReady) {
    if (requester.state !== "PRESENT") ownershipState = "MISSING_REQUESTER";
    else if (activationApprover.state !== "PRESENT") ownershipState = "MISSING_ACTIVATION_APPROVER";
    else if (executionOwner.state !== "PRESENT") ownershipState = "MISSING_EXECUTION_OWNER";
    else ownershipState = "PENDING_AUDIT_OWNER";
  }
  const ownershipPrerequisitesComplete = ownershipState === "PENDING_AUDIT_OWNER";
  const auditOwner = auditOwnerProjection(
    evidence.audit_owner || {},
    normalizedSlug,
    ownershipPrerequisitesComplete
  );
  if (ownershipPrerequisitesComplete) {
    ownershipState = auditOwner.state === "PRESENT"
      ? "OWNERSHIP_CHAIN_ACCEPTED"
      : "MISSING_AUDIT_OWNER";
  }
  const accepted = ownershipState === "OWNERSHIP_CHAIN_ACCEPTED";

  return validateProductionActivationOwnership({
    schema_version: PRODUCTION_ACTIVATION_OWNERSHIP_SCHEMA_VERSION,
    kind: "read_only_production_activation_ownership_decision",
    ownership_state: ownershipState,
    project_slug: normalizedSlug,
    requester,
    activation_approver: activationApprover,
    execution_owner: executionOwner,
    audit_owner: auditOwner,
    source_evidence: {
      source_owner: "activation-executor-boundary",
      executor_boundary: executorBoundary
    },
    safety: {
      ownership_chain_complete: accepted,
      ownership_chain_accepted: accepted,
      production_authorized: executorBoundary.safety.production_authorized,
      activation_executable: false,
      activation_executed: false,
      workspace_mutated: false,
      project_mutated: false,
      identity_generated: false,
      permissions_mutated: false,
      roles_mutated: false,
      approval_created: false,
      filesystem_mutated: false
    },
    authority: AUTHORITY
  });
}

module.exports = Object.freeze({ assessProductionActivationOwnership });

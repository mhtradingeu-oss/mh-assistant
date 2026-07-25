"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const {
  assessProductionActivationWorkflow
} = require("./production-activation-workflow");
const {
  ACTIVATION_AUTHORITY_SCHEMA_VERSION,
  validateActivationAuthorityModel
} = require("./activation-authority-contract");

const AUTHORITY = Object.freeze({
  request_context_owner: "backend-request-context",
  authorization_decision_owner: "production-activation-workflow",
  approval_owner_source: "operations-backbone",
  execution_owner_source: "workspace-runtime",
  project_id_owner: "project-identity",
  workspace_project_owner: "workspace-relationship-runtime",
  creates_approval: false,
  executes_activation: false,
  mutates_roles: false,
  mutates_permissions: false,
  mutates_workspace: false,
  mutates_project: false,
  mutates_data: false,
  mutates_filesystem: false,
  backend_authoritative: true,
  frontend_projection_only: true
});

function text(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function requesterProjection(evidence) {
  const requesterId = text(evidence.requester_id);
  const requesterType = text(evidence.requester_type);
  const evidenceRef = text(evidence.evidence_ref);
  const present = Boolean(requesterId && requesterType && evidenceRef);
  return {
    state: present ? "PRESENT" : "MISSING",
    requester_id: present ? requesterId : null,
    requester_type: present ? requesterType : null,
    source_owner: "backend-request-context",
    evidence_ref: present ? evidenceRef : null
  };
}

function ownerProjection(evidence, sourceOwner, blocked, fixedOwner = null) {
  if (blocked) {
    return { state: "NOT_APPLICABLE", owner: null, source_owner: sourceOwner, evidence_ref: null };
  }
  const suppliedOwner = text(evidence.owner);
  const owner = fixedOwner && suppliedOwner ? fixedOwner : suppliedOwner;
  const evidenceRef = text(evidence.evidence_ref);
  const assigned = Boolean(owner && evidenceRef && (!fixedOwner || suppliedOwner === fixedOwner));
  return {
    state: assigned ? "ASSIGNED" : "MISSING",
    owner: assigned ? owner : null,
    source_owner: sourceOwner,
    evidence_ref: assigned ? evidenceRef : null
  };
}

function assessActivationAuthority(projectSlug, backendEvidence = {}, options = {}) {
  const normalizedSlug = normalizeProjectSlug(projectSlug);
  const workflow = assessProductionActivationWorkflow(normalizedSlug, options);
  const blocked = !workflow.readiness.ready;
  const requester = requesterProjection(backendEvidence.requester || {});
  const approvalOwner = ownerProjection(
    backendEvidence.approval_owner || {},
    "operations-backbone",
    blocked,
    "operations-backbone"
  );
  const executionOwner = ownerProjection(
    backendEvidence.execution_owner || {},
    "workspace-runtime",
    blocked,
    "workspace-runtime"
  );

  let authorityState = "BLOCKED_ACTIVATION";
  if (!blocked) {
    if (requester.state === "MISSING") authorityState = "MISSING_REQUESTER";
    else if (approvalOwner.state === "MISSING") authorityState = "MISSING_APPROVAL_OWNER";
    else if (executionOwner.state === "MISSING") authorityState = "MISSING_EXECUTION_OWNER";
    else authorityState = "FULLY_SPECIFIED_READY_ACTIVATION";
  }

  const references = [...new Set([
    `phase-g:${normalizedSlug}`,
    requester.evidence_ref,
    approvalOwner.evidence_ref,
    executionOwner.evidence_ref
  ].filter(Boolean))].sort();
  const ownershipComplete = authorityState === "FULLY_SPECIFIED_READY_ACTIVATION";
  const handoffReady = ownershipComplete && workflow.authorization.authorized;

  return validateActivationAuthorityModel({
    schema_version: ACTIVATION_AUTHORITY_SCHEMA_VERSION,
    kind: "read_only_activation_authority_model",
    authority_state: authorityState,
    project_slug: normalizedSlug,
    requester,
    authorization: {
      state: workflow.authorization.state,
      authorized: workflow.authorization.authorized,
      decision_owner: "production-activation-workflow",
      source_owner: workflow.authorization.source_owner,
      reason: workflow.authorization.reason,
      evidence_ref: `phase-g:${normalizedSlug}`
    },
    approval_owner: approvalOwner,
    execution_owner: executionOwner,
    audit_evidence: {
      complete: ownershipComplete,
      references,
      source_owner: "activation-authority-model"
    },
    source_evidence: {
      source_owner: "production-activation-workflow",
      workflow
    },
    safety: {
      ownership_complete: ownershipComplete,
      authorized: workflow.authorization.authorized,
      handoff_ready: handoffReady,
      activation_executable: false,
      activation_executed: false,
      reason: handoffReady
        ? "READ_ONLY_MODEL_REQUIRES_EXISTING_EXECUTION_OWNER_HANDOFF"
        : "ACTIVATION_AUTHORITY_CHAIN_NOT_AUTHORIZED"
    },
    authority: AUTHORITY
  });
}

module.exports = Object.freeze({ assessActivationAuthority });

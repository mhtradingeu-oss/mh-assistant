"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const { assessActivationAuthority } = require("./activation-authority-model");
const {
  ACTIVATION_EXECUTOR_SCHEMA_VERSION,
  validateActivationExecutorResult
} = require("./activation-executor-contract");

const AUTHORITY = Object.freeze({
  approval_owner: "operations-backbone",
  execution_owner: "workspace-runtime",
  project_id_owner: "project-identity",
  workspace_project_owner: "workspace-relationship-runtime",
  boundary_owner: "activation-executor-boundary",
  validates_evidence: true,
  creates_plan: true,
  executes_activation: false,
  creates_workspace: false,
  creates_project: false,
  creates_identity: false,
  writes_binding: false,
  writes_registry: false,
  writes_approval: false,
  mutates_data: false,
  mutates_filesystem: false,
  backend_authoritative: true,
  frontend_projection_only: true
});

function text(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function emptyEvidence(fields, state) {
  return Object.fromEntries([["state", state], ...fields.map((field) => [field, null])]);
}

function approvalProjection(evidence, projectSlug, applicable) {
  const fields = [
    "approval_id", "decision", "project_slug", "action", "policy_version",
    "decided_by", "decided_at", "source_owner", "evidence_ref"
  ];
  if (!applicable) return emptyEvidence(fields, "NOT_APPLICABLE");
  const projection = {
    state: "VALID",
    approval_id: text(evidence.approval_id),
    decision: text(evidence.decision),
    project_slug: text(evidence.project_slug),
    action: text(evidence.action),
    policy_version: text(evidence.policy_version),
    decided_by: text(evidence.decided_by),
    decided_at: text(evidence.decided_at),
    source_owner: text(evidence.source_owner),
    evidence_ref: text(evidence.evidence_ref)
  };
  const valid = projection.approval_id
    && projection.decision === "APPROVED"
    && projection.project_slug === projectSlug
    && projection.action === "ACTIVATE_PROJECT"
    && projection.policy_version
    && projection.decided_by
    && projection.decided_at
    && projection.source_owner === "operations-backbone"
    && projection.evidence_ref;
  return valid ? projection : emptyEvidence(fields, "MISSING");
}

function executorProjection(evidence, projectSlug, projectId, applicable) {
  const fields = ["executor_id", "project_slug", "project_id", "action", "mode", "source_owner", "evidence_ref"];
  if (!applicable) return emptyEvidence(fields, "NOT_APPLICABLE");
  const projection = {
    state: "VALID",
    executor_id: text(evidence.executor_id),
    project_slug: text(evidence.project_slug),
    project_id: text(evidence.project_id),
    action: text(evidence.action),
    mode: text(evidence.mode),
    source_owner: text(evidence.source_owner),
    evidence_ref: text(evidence.evidence_ref)
  };
  const valid = projection.executor_id === "workspace-runtime"
    && projection.project_slug === projectSlug
    && projection.project_id === projectId
    && projection.action === "ACTIVATE_PROJECT"
    && projection.mode === "DRY_RUN"
    && projection.source_owner === "workspace-runtime"
    && projection.evidence_ref;
  return valid ? projection : emptyEvidence(fields, "MISSING");
}

function createDryRunPlan(projectSlug, ready) {
  return {
    state: ready ? "CREATED" : "NOT_CREATED",
    mode: "DRY_RUN",
    project_slug: projectSlug,
    steps: ready ? [
      { order: 1, action: "VALIDATE_PROJECT_IDENTITY", authority_owner: "project-identity", mutation_allowed: false },
      { order: 2, action: "VALIDATE_WORKSPACE_STATE", authority_owner: "workspace-runtime", mutation_allowed: false },
      { order: 3, action: "VALIDATE_WORKSPACE_PROJECT_BINDING", authority_owner: "workspace-relationship-runtime", mutation_allowed: false },
      { order: 4, action: "SIMULATE_ACTIVATION_RESULT", authority_owner: "activation-executor-boundary", mutation_allowed: false }
    ] : []
  };
}

function executeActivationDryRun(projectSlug, evidence = {}, options = {}) {
  const normalizedSlug = normalizeProjectSlug(projectSlug);
  const authorityModel = assessActivationAuthority(normalizedSlug, evidence.authority || {}, options);
  const applicable = authorityModel.authority_state === "FULLY_SPECIFIED_READY_ACTIVATION";
  const projectId = authorityModel.source_evidence.workflow.source_evidence.orchestration.current_state.project_id;
  const approvalEvidence = approvalProjection(evidence.approval || {}, normalizedSlug, applicable);
  const executionAuthority = executorProjection(evidence.executor || {}, normalizedSlug, projectId, applicable);

  let resultState = "BLOCKED_ACTIVATION";
  if (applicable) {
    if (approvalEvidence.state !== "VALID") resultState = "MISSING_APPROVAL";
    else if (executionAuthority.state !== "VALID") resultState = "MISSING_EXECUTOR";
    else resultState = "DRY_RUN_READY";
  }
  const ready = resultState === "DRY_RUN_READY";

  return validateActivationExecutorResult({
    schema_version: ACTIVATION_EXECUTOR_SCHEMA_VERSION,
    kind: "read_only_activation_executor_result",
    result_state: resultState,
    project_slug: normalizedSlug,
    approval_evidence: approvalEvidence,
    execution_authority: executionAuthority,
    execution_plan: createDryRunPlan(normalizedSlug, ready),
    activation_result: {
      state: ready ? "SIMULATED" : "NOT_RUN",
      mode: "DRY_RUN",
      activated: false,
      reason: ready ? "DRY_RUN_PLAN_VALIDATED_NO_ACTIVATION" : resultState
    },
    source_evidence: {
      source_owner: "activation-authority-model",
      authority_model: authorityModel
    },
    safety: {
      production_authorized: authorityModel.authorization.authorized,
      dry_run_only: true,
      activation_executable: false,
      activation_executed: false,
      workspace_mutated: false,
      project_mutated: false,
      identity_generated: false,
      binding_mutated: false,
      registry_mutated: false,
      filesystem_mutated: false
    },
    authority: AUTHORITY
  });
}

module.exports = Object.freeze({ executeActivationDryRun });

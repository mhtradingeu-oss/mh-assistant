"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const { orchestrateOnboarding } = require("./onboarding-orchestration");
const {
  PRODUCTION_ACTIVATION_WORKFLOW_SCHEMA_VERSION,
  validateProductionActivationWorkflow
} = require("./production-activation-workflow-contract");

const AUTHORITY = Object.freeze({
  workspace_id_owner: "workspace-runtime",
  project_id_owner: "project-identity",
  workspace_project_owner: "workspace-relationship-runtime",
  contract_owner: "universal-project-contract",
  readiness_owner: "project-activation-assessment",
  bootstrap_owner: "bootstrap-authority-assessment",
  onboarding_owner: "onboarding-orchestration",
  workflow_owner: "production-activation-workflow",
  authorization_owner: null,
  approval_owner: "operations-backbone",
  execution_owner: null,
  creates_workspace: false,
  creates_project: false,
  creates_identity: false,
  writes_binding: false,
  writes_registry: false,
  writes_project_files: false,
  writes_approval: false,
  executes_activation: false,
  migrates_data: false,
  mutates_data: false,
  mutates_filesystem: false,
  backend_authoritative: true,
  frontend_projection_only: true
});

function assessProductionActivationWorkflow(projectSlug, options = {}) {
  const normalizedSlug = normalizeProjectSlug(projectSlug);
  const onboarding = orchestrateOnboarding(normalizedSlug, options);
  const prerequisitesRequired = onboarding.required_next_step.required;
  const readiness = onboarding.activation_outcome;

  return validateProductionActivationWorkflow({
    schema_version: PRODUCTION_ACTIVATION_WORKFLOW_SCHEMA_VERSION,
    kind: "governed_production_activation_workflow",
    workflow_state: prerequisitesRequired ? "PREREQUISITES_REQUIRED" : "MISSING_AUTHORITY",
    activation_request: {
      type: "REQUEST_PRODUCTION_ACTIVATION",
      project_slug: normalizedSlug,
      state: "ASSESSED_READ_ONLY"
    },
    authorization: {
      state: "MISSING_AUTHORITY",
      authorized: false,
      source_owner: null,
      reason: "PRODUCTION_ACTIVATION_AUTHORIZATION_OWNER_NOT_PROVEN"
    },
    readiness: {
      state: readiness.state,
      ready: readiness.ready,
      blockers: readiness.blockers,
      source_owner: readiness.source_owner
    },
    required_authority: {
      state: prerequisitesRequired
        ? "PREREQUISITE_AUTHORITY_REQUIRED"
        : "PRODUCTION_ACTIVATION_AUTHORITY_UNRESOLVED",
      owners: prerequisitesRequired
        ? onboarding.required_next_step.responsible_authorities
        : [],
      source_owner: "bootstrap-authority-assessment"
    },
    approval_requirement: {
      state: readiness.ready ? "REQUIRED" : "NOT_APPLICABLE",
      required: readiness.ready,
      satisfied: false,
      source_owner: "operations-backbone"
    },
    execution_owner: {
      state: "UNRESOLVED",
      owner: null,
      executable: false,
      reason: "PRODUCTION_ACTIVATION_EXECUTION_OWNER_NOT_PROVEN"
    },
    source_evidence: {
      source_owner: "onboarding-orchestration",
      orchestration: onboarding
    },
    authority: AUTHORITY
  });
}

module.exports = Object.freeze({ assessProductionActivationWorkflow });

"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const { assessBootstrapAuthority } = require("./bootstrap-authority-assessment");
const {
  ONBOARDING_ORCHESTRATION_SCHEMA_VERSION,
  validateOnboardingOrchestration
} = require("./onboarding-orchestration-contract");

const NEXT_STEP_BY_SCENARIO = Object.freeze({
  NEW_PROJECT_REQUEST: "USE_EXISTING_LIFECYCLES",
  EXISTING_PROJECT_WITHOUT_IDENTITY: "ESTABLISH_PROJECT_IDENTITY",
  EXISTING_PROJECT_NOT_READY: "RESOLVE_ACTIVATION_PREREQUISITES",
  READY_PROJECT: "NONE"
});

const OUTCOME_BY_SCENARIO = Object.freeze({
  NEW_PROJECT_REQUEST: "NOT_ASSESSABLE",
  EXISTING_PROJECT_WITHOUT_IDENTITY: "BLOCKED",
  EXISTING_PROJECT_NOT_READY: "BLOCKED",
  READY_PROJECT: "READY_FOR_ACTIVATION"
});

const AUTHORITY = Object.freeze({
  workspace_id_owner: "workspace-runtime",
  project_id_owner: "project-identity",
  workspace_project_owner: "workspace-relationship-runtime",
  contract_owner: "universal-project-contract",
  activation_owner: "project-activation-assessment",
  bootstrap_owner: "bootstrap-authority-assessment",
  orchestration_owner: "onboarding-orchestration",
  creates_workspace: false,
  creates_project: false,
  creates_identity: false,
  writes_binding: false,
  writes_registry: false,
  writes_project_files: false,
  migrates_data: false,
  mutates_data: false,
  mutates_filesystem: false,
  backend_authoritative: true,
  frontend_projection_only: true
});

function orchestrateOnboarding(projectSlug, options = {}) {
  const normalizedSlug = normalizeProjectSlug(projectSlug);
  const bootstrap = assessBootstrapAuthority(normalizedSlug, options);
  const responsibleAuthorities = bootstrap.decision.responsible_authorities;

  return validateOnboardingOrchestration({
    schema_version: ONBOARDING_ORCHESTRATION_SCHEMA_VERSION,
    kind: "production_onboarding_orchestration",
    user_intent: {
      type: "ONBOARD_PROJECT",
      project_slug: normalizedSlug
    },
    current_state: {
      scenario: bootstrap.scenario,
      project_exists: bootstrap.project.exists,
      project_id: bootstrap.project.project_id,
      bootstrap_decision: bootstrap.decision.state,
      source_owner: "bootstrap-authority-assessment",
      assessment: bootstrap
    },
    authority_owner: {
      source_owner: "bootstrap-authority-assessment",
      responsible_authorities: responsibleAuthorities
    },
    required_next_step: {
      state: NEXT_STEP_BY_SCENARIO[bootstrap.scenario],
      required: !bootstrap.decision.ready,
      responsible_authorities: responsibleAuthorities
    },
    activation_outcome: {
      state: OUTCOME_BY_SCENARIO[bootstrap.scenario],
      ready: bootstrap.activation_readiness.ready,
      blockers: bootstrap.activation_readiness.blockers,
      source_owner: "project-activation-assessment"
    },
    authority: AUTHORITY
  });
}

module.exports = Object.freeze({ orchestrateOnboarding });

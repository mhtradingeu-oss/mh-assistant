"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const projectIdentity = require("./project-identity");
const { assessProjectActivation } = require("./project-activation-assessment");
const {
  BOOTSTRAP_AUTHORITY_SCHEMA_VERSION,
  validateBootstrapAuthorityAssessment
} = require("./bootstrap-authority-contract");

const AUTHORITY = Object.freeze({
  workspace_id_owner: "workspace-runtime",
  project_id_owner: "project-identity",
  workspace_project_owner: "workspace-relationship-runtime",
  contract_owner: "universal-project-contract",
  activation_owner: "project-activation-assessment",
  decision_owner: "bootstrap-authority-assessment",
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

function requiredStates(projectSlug, activation) {
  if (activation === null) {
    return validateBootstrapAuthorityAssessment({
      schema_version: BOOTSTRAP_AUTHORITY_SCHEMA_VERSION,
      kind: "bootstrap_authority_assessment",
      scenario: "NEW_PROJECT_REQUEST",
      project: { project_slug: projectSlug, project_id: null, exists: false },
      required_workspace_state: {
        required_state: "ACTIVE_WITH_ATTACHED_VALID_PROJECT_RELATIONSHIP",
        current_state: "NOT_ASSESSABLE",
        satisfied: false,
        responsible_authorities: ["workspace-relationship-runtime", "workspace-runtime"]
      },
      required_project_state: {
        required_state: "EXISTING_WITH_VALID_AUTHORITATIVE_IDENTITY",
        current_state: "NOT_FOUND",
        satisfied: false,
        responsible_authority: "project-identity"
      },
      identity_readiness: { state: "NOT_ASSESSABLE", ready: false, responsible_authority: "project-identity" },
      activation_readiness: {
        state: "NOT_ASSESSABLE",
        ready: false,
        blockers: ["project:PROJECT_NOT_FOUND"],
        source_owner: "project-activation-assessment",
        assessment: null
      },
      decision: {
        state: "EXISTING_LIFECYCLE_REQUIRED",
        ready: false,
        responsible_authorities: ["project-identity", "workspace-relationship-runtime", "workspace-runtime"]
      },
      authority: AUTHORITY
    });
  }

  const workspace = activation.activation_path.find((stage) => stage.name === "workspace");
  const identity = activation.activation_path.find((stage) => stage.name === "project_identity");
  let scenario = "EXISTING_PROJECT_NOT_READY";
  let decisionState = "ACTIVATION_PREREQUISITES_REQUIRED";
  let responsibleAuthorities = ["project-activation-assessment"];
  if (!identity.ready) {
    scenario = "EXISTING_PROJECT_WITHOUT_IDENTITY";
    decisionState = "PROJECT_IDENTITY_REQUIRED";
    responsibleAuthorities = ["project-identity"];
  } else if (activation.activation_status.ready) {
    scenario = "READY_PROJECT";
    decisionState = "NO_BOOTSTRAP_REQUIRED";
    responsibleAuthorities = [];
  }

  return validateBootstrapAuthorityAssessment({
    schema_version: BOOTSTRAP_AUTHORITY_SCHEMA_VERSION,
    kind: "bootstrap_authority_assessment",
    scenario,
    project: {
      project_slug: activation.project.project_slug,
      project_id: activation.project.project_id,
      exists: true
    },
    required_workspace_state: {
      required_state: "ACTIVE_WITH_ATTACHED_VALID_PROJECT_RELATIONSHIP",
      current_state: workspace.state,
      satisfied: workspace.ready,
      responsible_authorities: ["workspace-relationship-runtime", "workspace-runtime"]
    },
    required_project_state: {
      required_state: "EXISTING_WITH_VALID_AUTHORITATIVE_IDENTITY",
      current_state: identity.state,
      satisfied: identity.ready,
      responsible_authority: "project-identity"
    },
    identity_readiness: {
      state: identity.state,
      ready: identity.ready,
      responsible_authority: "project-identity"
    },
    activation_readiness: {
      state: activation.activation_status.state,
      ready: activation.activation_status.ready,
      blockers: activation.activation_status.blockers,
      source_owner: "project-activation-assessment",
      assessment: activation
    },
    decision: {
      state: decisionState,
      ready: activation.activation_status.ready,
      responsible_authorities: responsibleAuthorities
    },
    authority: AUTHORITY
  });
}

function assessBootstrapAuthority(projectSlug, options = {}) {
  const normalizedSlug = normalizeProjectSlug(projectSlug);
  try {
    return requiredStates(normalizedSlug, assessProjectActivation(normalizedSlug, options));
  } catch (error) {
    if (error && error.code === projectIdentity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_NOT_FOUND) {
      return requiredStates(normalizedSlug, null);
    }
    throw error;
  }
}

module.exports = Object.freeze({ assessBootstrapAuthority });

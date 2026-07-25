"use strict";

const {
  PROJECT_ACTIVATION_CONTRACT_SCHEMA_VERSION,
  validateProjectActivationContract
} = require("./project-activation-contract");
const {
  inspectProjectLifecycleReadiness
} = require("./project-lifecycle-readiness");

function stage(order, name, state, ready, sourceOwner, authoritative) {
  return { order, name, state, ready, authoritative, source_owner: sourceOwner };
}

function assessProjectActivation(projectSlug, options = {}) {
  const lifecycle = inspectProjectLifecycleReadiness(projectSlug, options);
  const byName = Object.fromEntries(lifecycle.lifecycle.map((item) => [item.name, item]));
  const activationPath = [
    stage(1, "workspace", byName.workspace.state, byName.workspace.ready, "workspace-runtime", true),
    stage(2, "project_identity", byName.project_identity.state, byName.project_identity.ready, "project-identity", true),
    stage(3, "binding", byName.workspace_binding.state, byName.workspace_binding.ready, "workspace-relationship-runtime", true),
    stage(4, "universal_project_contract", byName.universal_project_contract.state, byName.universal_project_contract.ready, "universal-project-contract", false),
    stage(5, "capabilities", byName.capabilities.state, byName.capabilities.ready, "universal-project-contract", false)
  ];
  const ready = lifecycle.readiness.ready && activationPath.every((item) => item.ready);

  return validateProjectActivationContract({
    schema_version: PROJECT_ACTIVATION_CONTRACT_SCHEMA_VERSION,
    kind: "workspace_project_activation_assessment",
    project: {
      project_slug: lifecycle.project.project_slug,
      project_id: lifecycle.project.project_id
    },
    activation_path: activationPath,
    capabilities: lifecycle.capabilities,
    lifecycle_prerequisites: {
      state: lifecycle.readiness.state,
      ready: lifecycle.readiness.ready,
      blockers: lifecycle.readiness.blockers,
      authoritative: false,
      source_owner: "project-lifecycle-readiness"
    },
    activation_status: {
      state: ready ? "READY_FOR_ACTIVATION" : "BLOCKED",
      ready,
      blockers: lifecycle.readiness.blockers
    },
    authority: {
      creates_identity: false,
      creates_workspace: false,
      writes_binding: false,
      writes_registry: false,
      writes_project_files: false,
      mutates_filesystem: false,
      backend_authoritative: true,
      frontend_projection_only: true
    }
  });
}

module.exports = Object.freeze({ assessProjectActivation });

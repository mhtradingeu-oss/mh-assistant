"use strict";

const path = require("node:path");
const { normalizeProjectSlug } = require("../security/project-isolation");
const projectIdentity = require("./project-identity");
const workspaceBinding = require("./workspace-project-identity-binding");
const workspaceRelationship = require("../workspace/workspace-relationship-runtime");
const auditLog = require("../integrations/audit-log");
const { assessProductionActivationOwnership } = require("./production-activation-ownership-model");
const {
  CONTROLLED_ACTIVATION_WRITER_SCHEMA_VERSION,
  activationPlanId,
  validateControlledActivationWriterResult
} = require("./controlled-production-activation-writer-contract");

const AUTHORITY = Object.freeze({
  project_identity_owner: "project-identity",
  workspace_relationship_owner: "workspace-relationship-runtime",
  audit_event_owner: "existing-audit-event-system",
  writer_owner: "controlled-production-activation-writer-boundary",
  creates_project: false,
  creates_workspace: false,
  creates_identity: false,
  writes_registry: false,
  migrates_data: false
});

const projectTails = new Map();

function dependencies(options = {}) {
  return {
    projectsRoot: options.projectsRoot || projectIdentity.DEFAULT_PROJECTS_ROOT,
    workspaceRoot: options.workspaceRoot,
    registryPath: options.registryPath,
    runtimeRoot: options.runtimeRoot,
    identity: options.projectIdentity || projectIdentity,
    binding: options.workspaceBinding || workspaceBinding,
    relationship: options.workspaceRelationship || workspaceRelationship,
    audit: options.audit || auditLog,
    ownership: options.ownership || assessProductionActivationOwnership
  };
}

function auditPaths(projectFile) {
  return { integrationsDir: path.join(path.dirname(projectFile), "integrations") };
}

function findAudit(entries, eventId) {
  return entries.some((entry) => entry && entry.id === eventId);
}

function evidence(identity, binding, auditEventPresent) {
  const workspace = binding.workspace_binding;
  return {
    project_id: identity.project_id,
    identity_state: identity.state,
    workspace_id: workspace.workspace_id,
    workspace_version: workspace.workspace_version,
    relationship_id: workspace.relationship_id,
    relationship_status: workspace.relationship_status,
    validation_state: workspace.validation_state,
    audit_event_present: auditEventPresent
  };
}

function planFor(slug, identity, binding, ownership) {
  const workspace = binding.workspace_binding;
  const plan = {
    mode: "DRY_RUN",
    project_slug: slug,
    project_id: identity.project_id,
    workspace_id: workspace.workspace_id,
    workspace_version: workspace.workspace_version,
    relationship_id: workspace.relationship_id,
    approval_id: ownership.activation_approver.approval_id,
    activation_at: ownership.activation_approver.decided_at,
    event_id: null,
    steps: [
      { order: 1, action: "REVALIDATE_PROJECT_IDENTITY", authority_owner: "project-identity", mutation_allowed: false },
      { order: 2, action: "REVALIDATE_WORKSPACE_RELATIONSHIP", authority_owner: "workspace-relationship-runtime", mutation_allowed: false },
      { order: 3, action: "APPEND_PRODUCTION_ACTIVATION_EVENT", authority_owner: "existing-audit-event-system", mutation_allowed: true }
    ]
  };
  plan.plan_id = activationPlanId(plan);
  plan.event_id = `activation_${plan.plan_id.slice(8)}`;
  return plan;
}

function resultBase(mode, state, slug, ownership, plan, before, after, mutation) {
  return validateControlledActivationWriterResult({
    schema_version: CONTROLLED_ACTIVATION_WRITER_SCHEMA_VERSION,
    kind: "controlled_production_activation_writer_result",
    mode,
    result_state: state,
    project_slug: slug,
    plan,
    before,
    after,
    mutation,
    source_evidence: { source_owner: "production-activation-ownership-model", ownership },
    safety: {
      single_project: true,
      dry_run_first: true,
      plan_matched: mode === "DRY_RUN" ? false : state !== "BLOCKED",
      project_mutated: false,
      workspace_mutated: false,
      identity_generated: false,
      workspace_created: false,
      registry_mutated: false,
      data_migrated: false,
      unrelated_writes: false,
      rollback_safe: true
    },
    authority: AUTHORITY
  });
}

async function prepareControlledProductionActivation(projectSlug, ownershipEvidence = {}, options = {}) {
  const slug = normalizeProjectSlug(projectSlug);
  const deps = dependencies(options);
  const ownership = await deps.ownership(slug, ownershipEvidence, options);
  if (ownership.ownership_state !== "OWNERSHIP_CHAIN_ACCEPTED") {
    return resultBase("DRY_RUN", "BLOCKED", slug, ownership, null, null, null, {
      attempted: false, owner: null, event_created: false, event_id: null
    });
  }
  const identity = deps.identity.inspectProjectIdentity(slug, { projectsRoot: deps.projectsRoot });
  const binding = deps.binding.inspectWorkspaceProjectIdentityBinding(slug, {
    projectsRoot: deps.projectsRoot,
    workspaceRoot: deps.workspaceRoot,
    runtimeRoot: deps.runtimeRoot
  });
  if (identity.state !== "VALID" || !binding.readiness.ready) throw new Error("Activation sources changed after ownership assessment");
  const relationship = await deps.relationship.getWorkspaceProjectRelationship({
    workspace_id: binding.workspace_binding.workspace_id,
    relationship_id: binding.workspace_binding.relationship_id
  }, { root: deps.workspaceRoot });
  if (relationship.project_id !== identity.project_id
    || relationship.relationship_status !== "ATTACHED"
    || relationship.validation_state !== "VALID") {
    throw new Error("Workspace Relationship Authority no longer matches the activation scope");
  }
  const plan = planFor(slug, identity, binding, ownership);
  const entries = deps.audit.readIntegrationAudit(auditPaths(identity.project_file));
  const before = evidence(identity, binding, findAudit(entries, plan.event_id));
  return resultBase("DRY_RUN", "DRY_RUN_READY", slug, ownership, plan, before, before, {
    attempted: false, owner: null, event_created: false, event_id: null
  });
}

async function withProjectLock(slug, operation) {
  const previous = projectTails.get(slug) || Promise.resolve();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  projectTails.set(slug, previous.catch(() => undefined).then(() => gate));
  await previous.catch(() => undefined);
  try { return await operation(); } finally { release(); }
}

async function executeControlledProductionActivation(projectSlug, ownershipEvidence, approvedPlan, options = {}) {
  const slug = normalizeProjectSlug(projectSlug);
  return withProjectLock(slug, async () => {
    const dryRun = await prepareControlledProductionActivation(slug, ownershipEvidence, options);
    if (dryRun.result_state !== "DRY_RUN_READY") return resultBase("APPLY", "BLOCKED", slug, dryRun.source_evidence.ownership, null, null, null, {
      attempted: false, owner: null, event_created: false, event_id: null
    });
    if (JSON.stringify(approvedPlan) !== JSON.stringify(dryRun.plan)) throw new Error("Approved activation plan does not match the current deterministic dry run");
    const deps = dependencies(options);
    const projectFile = deps.identity.inspectProjectIdentity(slug, { projectsRoot: deps.projectsRoot }).project_file;
    const event = {
      id: dryRun.plan.event_id,
      at: dryRun.plan.activation_at,
      project: slug,
      action: "production_activation",
      status: "activated",
      source_owner: "controlled-production-activation-writer-boundary",
      plan_id: dryRun.plan.plan_id,
      project_id: dryRun.plan.project_id,
      workspace_id: dryRun.plan.workspace_id,
      relationship_id: dryRun.plan.relationship_id,
      approval_id: dryRun.plan.approval_id
    };
    const append = deps.audit.appendIntegrationAuditOnce(auditPaths(projectFile), event);
    const refreshed = await prepareControlledProductionActivation(slug, ownershipEvidence, options);
    return resultBase("APPLY", append.created ? "APPLIED" : "ALREADY_APPLIED", slug, refreshed.source_evidence.ownership, dryRun.plan, dryRun.before, refreshed.before, {
      attempted: true,
      owner: "existing-audit-event-system",
      event_created: append.created,
      event_id: dryRun.plan.event_id
    });
  });
}

module.exports = Object.freeze({
  prepareControlledProductionActivation,
  executeControlledProductionActivation
});

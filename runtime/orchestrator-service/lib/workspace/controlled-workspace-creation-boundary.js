"use strict";

const workspaceRuntime = require("./workspace-runtime");
const {
  AUTHORITY,
  CONTROLLED_WORKSPACE_CREATION_SCHEMA_VERSION,
  deepFreeze,
  validateControlledWorkspaceCreationResult,
  validateCreatedWorkspace,
  validateCreationRequest,
  workspaceCreationPlanId
} = require("./controlled-workspace-creation-contract");

let creationTail = Promise.resolve();

function dependencies(options = {}) {
  return {
    runtime: options.workspaceRuntime || workspaceRuntime,
    runtimeOptions: {
      root: options.workspaceRoot,
      storage: options.storage,
      now: options.now,
      generateWorkspaceId: options.generateWorkspaceId
    }
  };
}

function compactOptions(options) {
  return Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined));
}

function creationEvidenceReference(ownership) {
  return deepFreeze({
    reference_type: "workspace_creation",
    reference_id: ownership.evidence_id,
    source_owner: ownership.source_owner,
    recorded_at: ownership.decided_at
  });
}

function planFor(request) {
  const plan = {
    plan_id: null,
    mode: "DRY_RUN",
    workspace_name: request.workspace_name,
    evidence_id: request.ownership_evidence.evidence_id,
    steps: [
      { order: 1, action: "REVALIDATE_GOVERNANCE_APPROVAL", authority_owner: "governance-approval-engine", mutation_allowed: false },
      { order: 2, action: "LOOK_UP_CREATION_EVIDENCE", authority_owner: "workspace-runtime", mutation_allowed: false },
      { order: 3, action: "CREATE_WORKSPACE", authority_owner: "workspace-runtime", mutation_allowed: true }
    ]
  };
  plan.plan_id = workspaceCreationPlanId(plan);
  return deepFreeze(plan);
}

function snapshot(workspace, evidenceReference) {
  if (!workspace) {
    return deepFreeze({
      exists: false,
      workspace_id: null,
      workspace_version: null,
      workspace_name: null,
      status: null,
      creation_evidence_present: false
    });
  }
  return deepFreeze({
    exists: true,
    workspace_id: workspace.workspace_id,
    workspace_version: workspace.workspace_version,
    workspace_name: workspace.workspace_name,
    status: workspace.status,
    creation_evidence_present: workspace.evidence_references.some(
      (item) => JSON.stringify(item) === JSON.stringify(evidenceReference)
    )
  });
}

function result(mode, state, request, plan, before, after, mutation) {
  return validateControlledWorkspaceCreationResult({
    schema_version: CONTROLLED_WORKSPACE_CREATION_SCHEMA_VERSION,
    kind: "controlled_workspace_creation_result",
    mode,
    result_state: state,
    workspace_name: request.workspace_name,
    plan,
    before,
    after,
    mutation,
    source_evidence: {
      source_owner: "governance-approval-engine",
      ownership: request.ownership_evidence
    },
    safety: {
      dry_run_first: true,
      plan_matched: mode === "APPLY",
      project_mutated: false,
      hairoticmen_mutated: false,
      identity_generated: false,
      binding_created: false,
      data_migrated: false,
      duplicate_workspace: false,
      unrelated_writes: false
    },
    authority: AUTHORITY
  });
}

async function inspectExisting(request, deps, evidenceReference) {
  if (!deps.runtime || typeof deps.runtime.findWorkspaceByCreationEvidence !== "function") {
    throw new TypeError("Workspace Runtime evidence lookup is required");
  }
  const existing = await deps.runtime.findWorkspaceByCreationEvidence({
    workspace_name: request.workspace_name,
    evidence_reference: evidenceReference
  }, compactOptions(deps.runtimeOptions));
  return existing ? validateCreatedWorkspace(existing, evidenceReference) : null;
}

async function prepareControlledWorkspaceCreation(input, options = {}) {
  const request = validateCreationRequest(input);
  const deps = dependencies(options);
  const evidenceReference = creationEvidenceReference(request.ownership_evidence);
  const existing = await inspectExisting(request, deps, evidenceReference);
  const before = snapshot(existing, evidenceReference);
  return result("DRY_RUN", "DRY_RUN_READY", request, planFor(request), before, before, {
    attempted: false,
    owner: null,
    workspace_created: false,
    workspace_id: null
  });
}

async function withCreationLock(operation) {
  const predecessor = creationTail;
  let release;
  creationTail = new Promise((resolve) => { release = resolve; });
  await predecessor.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
  }
}

async function executeControlledWorkspaceCreation(input, approvedPlan, options = {}) {
  return withCreationLock(async () => {
    const request = validateCreationRequest(input);
    const dryRun = await prepareControlledWorkspaceCreation(request, options);
    if (JSON.stringify(approvedPlan) !== JSON.stringify(dryRun.plan)) {
      throw new Error("Approved Workspace creation plan does not match the current deterministic dry run");
    }
    const deps = dependencies(options);
    const evidenceReference = creationEvidenceReference(request.ownership_evidence);
    if (dryRun.before.exists) {
      return result("APPLY", "ALREADY_EXISTS", request, dryRun.plan, dryRun.before, dryRun.before, {
        attempted: false,
        owner: null,
        workspace_created: false,
        workspace_id: dryRun.before.workspace_id
      });
    }
    if (!deps.runtime || typeof deps.runtime.createWorkspace !== "function") {
      throw new TypeError("Workspace Runtime creation authority is required");
    }
    const created = await deps.runtime.createWorkspace({
      workspace_name: request.workspace_name,
      ownership_state: "UNCLAIMED",
      evidence_references: [evidenceReference]
    }, compactOptions(deps.runtimeOptions));
    const workspace = validateCreatedWorkspace(created.workspace, evidenceReference);
    const after = snapshot(workspace, evidenceReference);
    return result("APPLY", "CREATED", request, dryRun.plan, dryRun.before, after, {
      attempted: true,
      owner: "workspace-runtime",
      workspace_created: true,
      workspace_id: workspace.workspace_id
    });
  });
}

module.exports = Object.freeze({
  prepareControlledWorkspaceCreation,
  executeControlledWorkspaceCreation
});

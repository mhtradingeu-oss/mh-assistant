#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  GOVERNANCE_AUTHORITY_PARTITION
} = require("../runtime/orchestrator-service/lib/security/governance-authority-partition");
const {
  createWorkspaceGovernanceApprovalReader
} = require("../runtime/orchestrator-service/lib/workspace/workspace-governance-approval-reader");
const {
  prepareProductionGovernanceComposition
} = require("../runtime/orchestrator-service/lib/workspace/production-governance-composition");
const {
  classifyRoute
} = require("../runtime/orchestrator-service/lib/security/route-permission-catalog");

const ROOT = path.resolve(__dirname, "..");
const APPROVAL_ID = "approval_mh_trading_workspace_001";
const PRINCIPAL_ID = "legacy-control-center-key";
const TIMESTAMP = "2026-07-24T15:00:00.000Z";

function inventory(root) {
  const result = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else result.push({
        path: path.relative(root, target),
        hash: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
      });
    }
  }
  visit(root);
  return result;
}

function approval(overrides = {}) {
  return {
    id: APPROVAL_ID,
    project: GOVERNANCE_AUTHORITY_PARTITION,
    entity_type: "workspace",
    entity_id: "MH Trading",
    mutation_type: "workspace_creation",
    approval_type: "workspace_creation",
    requested_action: "CREATE_WORKSPACE",
    requested_by: PRINCIPAL_ID,
    requested_for: "MH Trading Owner",
    reviewer: "MH Trading Owner",
    status: "approved",
    decided_by: PRINCIPAL_ID,
    decided_at: TIMESTAMP,
    decision_at: TIMESTAMP,
    ...overrides
  };
}

function context(overrides = {}) {
  return {
    principal: {
      principal_id: PRINCIPAL_ID,
      principal_type: "service",
      authenticated: true,
      authentication_method: "control_key",
      source: "protected_read_key_guard",
      ...overrides
    },
    roles: [],
    permissions: []
  };
}

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  Object.values(value).forEach(assertDeepFrozen);
}

function source(relative) {
  return fs.readFileSync(path.join(ROOT, relative), "utf8");
}

async function rejection(input, recordOverrides = {}, contextOverrides = {}) {
  await assert.rejects(
    prepareProductionGovernanceComposition(input, {
      authenticatedContext: context(contextOverrides),
      approvalReader: async () => approval(recordOverrides),
      workspaceRuntime: { findWorkspaceByCreationEvidence: async () => null }
    })
  );
}

function invokeAuthentication(middleware, key) {
  const request = {
    headers: key ? { authorization: `Bearer ${key}` } : {},
    get(name) {
      return this.headers[String(name).toLowerCase()];
    }
  };
  const result = { status: null, body: null, next: false };
  const response = {
    status(value) {
      result.status = value;
      return this;
    },
    json(value) {
      result.body = value;
      return this;
    }
  };
  middleware(request, response, () => {
    result.next = true;
  });
  return result;
}

async function run() {
  const dataBefore = inventory(path.join(ROOT, "data"));
  const workspacesBefore = inventory(path.join(ROOT, "data/workspaces"));
  const checks = {};
  let listCalls = 0;
  let listedPartition = null;
  const reader = createWorkspaceGovernanceApprovalReader({
    listApprovals(partition) {
      listCalls += 1;
      listedPartition = partition;
      return [approval()];
    }
  });
  assert.deepEqual(await reader(APPROVAL_ID), approval());
  assert.equal(listCalls, 1);
  assert.equal(listedPartition, GOVERNANCE_AUTHORITY_PARTITION);
  checks.authoritative_reader = "LIST_APPROVALS";
  checks.authority_partition = listedPartition;

  assert.throws(() => createWorkspaceGovernanceApprovalReader({
    listApprovals: () => []
  })(APPROVAL_ID), /not found/);
  assert.throws(() => createWorkspaceGovernanceApprovalReader({
    listApprovals: () => [approval(), approval()]
  })(APPROVAL_ID), /duplicated/);
  assert.throws(() => createWorkspaceGovernanceApprovalReader({
    listApprovals: () => ({ items: [approval()] })
  })(APPROVAL_ID), /malformed/);
  assert.throws(() => createWorkspaceGovernanceApprovalReader({
    listApprovals: () => [approval({ project: "other-partition" })]
  })(APPROVAL_ID), /malformed/);
  checks.reader_fail_closed = true;

  let lookupCount = 0;
  let createWorkspaceCalls = 0;
  const runtime = {
    findWorkspaceByCreationEvidence: async () => {
      lookupCount += 1;
      return null;
    },
    createWorkspace: async () => {
      createWorkspaceCalls += 1;
      throw new Error("mutation method must be unreachable");
    }
  };
  const options = {
    authenticatedContext: context(),
    approvalReader: async (approvalId) => {
      assert.equal(approvalId, APPROVAL_ID);
      return approval();
    },
    workspaceRuntime: runtime
  };
  const prepared = await prepareProductionGovernanceComposition({ approval_id: APPROVAL_ID }, options);
  const repeated = await prepareProductionGovernanceComposition({ approval_id: APPROVAL_ID }, options);
  assert.equal(prepared.workspace_name, "MH Trading");
  assert.equal(prepared.approval_id, APPROVAL_ID);
  assert.equal(prepared.authority_partition, GOVERNANCE_AUTHORITY_PARTITION);
  assert.equal(prepared.approval_state, "APPROVED");
  assert.equal(prepared.dry_run.result_state, "DRY_RUN_READY");
  assert.equal(prepared.dry_run_plans_equivalent, true);
  assert.equal(prepared.apply_executed, false);
  assert.equal(prepared.workspace_created, false);
  assert.equal(prepared.workspace_id, null);
  assert.equal(prepared.mutation_allowed_by_this_endpoint, false);
  assert.equal(JSON.stringify(prepared), JSON.stringify(repeated));
  assert.equal(lookupCount, 4);
  assert.equal(createWorkspaceCalls, 0);
  assertDeepFrozen(prepared);
  checks.positive_composition = "DRY_RUN_READY";
  checks.two_dry_runs_per_preparation = true;
  checks.repeated_determinism = true;
  checks.deeply_immutable = true;

  await assert.rejects(prepareProductionGovernanceComposition(
    { approval_id: APPROVAL_ID },
    { authenticatedContext: null, approvalReader: async () => approval(), workspaceRuntime: runtime }
  ));
  await rejection({ approval_id: APPROVAL_ID }, {}, { principal_type: "human" });
  await assert.rejects(prepareProductionGovernanceComposition(
    {},
    { authenticatedContext: context(), approvalReader: async () => approval(), workspaceRuntime: runtime }
  ));
  await rejection({ approval_id: APPROVAL_ID }, { status: "pending", decided_at: "", decision_at: "" });
  for (const status of ["rejected", "cancelled", "changes_requested", "escalated", "overridden"]) {
    await rejection({ approval_id: APPROVAL_ID }, { status });
  }
  await rejection({ approval_id: APPROVAL_ID }, { entity_id: "Other Workspace" });
  await rejection({ approval_id: APPROVAL_ID }, { requested_action: "DELETE_WORKSPACE" });
  await rejection({ approval_id: APPROVAL_ID }, { approval_type: "project_activation" });
  await rejection({ approval_id: APPROVAL_ID }, { requested_for: "Other Owner" });
  await rejection({ approval_id: APPROVAL_ID }, { requested_by: "other-requester" });
  await rejection({ approval_id: APPROVAL_ID }, { decided_by: "other-approver" });
  await rejection({ approval_id: APPROVAL_ID }, { decision_at: "" });
  for (const forbidden of [
    "approval", "ownership_evidence", "authority_partition", "workspace_name",
    "apply", "approved_plan", "plan", "requester_id", "approver_id"
  ]) {
    await rejection({ approval_id: APPROVAL_ID, [forbidden]: {} });
  }
  checks.negative_contract_matrix = "REJECTED";

  const readerSource = source("runtime/orchestrator-service/lib/workspace/workspace-governance-approval-reader.js");
  const compositionSource = source("runtime/orchestrator-service/lib/workspace/production-governance-composition.js");
  const projectionSource = source("runtime/orchestrator-service/lib/workspace/workspace-creation-approval-projection.js");
  const handoffSource = source("runtime/orchestrator-service/lib/workspace/governed-workspace-creation-handoff.js");
  const serverSource = source("runtime/orchestrator-service/server.js");
  for (const candidate of [readerSource, compositionSource, projectionSource, handoffSource]) {
    assert.equal(/\bcreateApproval\b|\bdecideApproval\b/.test(candidate), false);
  }
  assert.equal(/node:fs|writeJsonFile|writeFile|appendFile|mkdir/.test(readerSource), false);
  assert.equal(/node:fs|writeJsonFile|writeFile|appendFile|mkdir/.test(compositionSource), false);
  assert.equal(/data\/approvals\.json/.test(`${readerSource}\n${compositionSource}\n${serverSource}`), false);
  assert.equal(/executeControlledWorkspaceCreation/.test(serverSource.match(
    /async function handleGovernanceWorkspacePreparation[\s\S]*?\n}\n/
  )[0]), false);
  assert.equal(/createWorkspace\s*\(/.test(compositionSource), false);
  assert.equal(/authority_project/.test(`${projectionSource}\n${handoffSource}`), false);
  checks.static_safety = "PASS";

  const permission = classifyRoute(
    "POST",
    "/api/governance/workspaces/mh-trading/creation/prepare"
  );
  assert.equal(permission.requiredAccess, "service");
  assert.equal(permission.requiredScope, "governance.workspace_creation.prepare");
  assert.equal(permission.readWrite, "read");
  checks.route_permission = permission.requiredScope;

  const priorKey = process.env.MH_CONTROL_CENTER_WRITE_KEY;
  process.env.MH_CONTROL_CENTER_WRITE_KEY = "phase-k6-test-key";
  const {
    __governanceWorkspacePreparation: routeBoundary
  } = require("../runtime/orchestrator-service/server");
  assert.equal(routeBoundary.route, "/api/governance/workspaces/mh-trading/creation/prepare");
  const unauthenticated = invokeAuthentication(routeBoundary.requireAuthentication);
  const unauthorized = invokeAuthentication(routeBoundary.requireAuthentication, "wrong-key");
  if (priorKey === undefined) delete process.env.MH_CONTROL_CENTER_WRITE_KEY;
  else process.env.MH_CONTROL_CENTER_WRITE_KEY = priorKey;
  assert.equal(unauthenticated.status, 401);
  assert.equal(unauthenticated.body.error.code, "GOVERNANCE_PREPARATION_UNAUTHENTICATED");
  assert.equal(unauthorized.status, 403);
  assert.equal(unauthorized.body.error.code, "GOVERNANCE_PREPARATION_FORBIDDEN");
  checks.route_authentication = "401/403";

  assert.deepEqual(inventory(path.join(ROOT, "data")), dataBefore);
  assert.deepEqual(inventory(path.join(ROOT, "data/workspaces")), workspacesBefore);
  checks.data_tree = "UNCHANGED";
  checks.workspace_tree = "UNCHANGED";

  console.log(JSON.stringify({
    ok: true,
    phase: "K-6",
    checks,
    approval_created: false,
    approval_decided: false,
    k5c_apply_executed: false,
    workspace_created: false,
    workspace_id_created: false,
    data_workspaces_written: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

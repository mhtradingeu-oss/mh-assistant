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
  projectWorkspaceCreationApproval
} = require("../runtime/orchestrator-service/lib/workspace/workspace-creation-approval-projection");
const {
  assessWorkspaceCreationApproval
} = require("../runtime/orchestrator-service/lib/workspace/workspace-creation-approval-model");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const TS = "2026-07-24T10:00:00.000Z";

function inventory(root) {
  const records = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else records.push({
        path: path.relative(root, target),
        hash: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
      });
    }
  }
  visit(root);
  return records;
}

function query(overrides = {}) {
  return {
    authority_partition: GOVERNANCE_AUTHORITY_PARTITION,
    approval_id: "approval_mh_trading_workspace_001",
    requester_id: "principal_mh_trading_operator",
    approver_id: "principal_mh_trading_owner",
    ...overrides
  };
}

function record(overrides = {}) {
  return {
    id: "approval_mh_trading_workspace_001",
    project: GOVERNANCE_AUTHORITY_PARTITION,
    entity_type: "workspace",
    entity_id: "MH Trading",
    mutation_type: "workspace_creation",
    approval_type: "workspace_creation",
    requested_action: "CREATE_WORKSPACE",
    requested_by: "principal_mh_trading_operator",
    requested_for: "MH Trading Owner",
    reviewer: "MH Trading Owner",
    status: "approved",
    decided_by: "principal_mh_trading_owner",
    decided_at: TS,
    decision_at: TS,
    ...overrides
  };
}

async function project(value, queryOverrides = {}) {
  return projectWorkspaceCreationApproval(query(queryOverrides), {
    approvalReader: async () => value
  });
}

function sourceHasNoWriter(source) {
  [
    /node:fs/,
    /workspace-runtime/,
    /createApproval\s*\(/,
    /decideApproval\s*\(/,
    /createWorkspace\s*\(/,
    /writeFileSync\s*\(/,
    /appendJsonArrayEntry\s*\(/,
    /generateWorkspaceId/
  ].forEach((pattern) => assert.equal(pattern.test(source), false, `approval layer boundary violation: ${pattern}`));
}

async function run() {
  const liveData = path.join(REPOSITORY_ROOT, "data");
  const liveBefore = inventory(liveData);

  const missing = assessWorkspaceCreationApproval(await project(null));
  assert.equal(missing.approval_state, "BLOCKED");
  assert.ok(missing.blocking_reasons.includes("APPROVAL_MISSING_OR_INVALID"));

  const approvedProjection = await project(record());
  const approved = assessWorkspaceCreationApproval(approvedProjection);
  const repeated = assessWorkspaceCreationApproval(await project(record()));
  assert.equal(approved.approval_state, "APPROVED");
  assert.equal(approved.authority.evidence_owner, "governance-approval-engine");
  assert.deepEqual(repeated, approved);
  assert.equal(Object.isFrozen(approvedProjection), true);
  assert.equal(Object.isFrozen(approvedProjection.evidence_reference), true);
  assert.equal(Object.isFrozen(approved), true);

  for (const status of ["pending", "rejected", "cancelled", "changes_requested", "escalated", "overridden"]) {
    const statusRecord = record({
      status,
      decided_by: "",
      decided_at: "",
      decision_at: ""
    });
    const assessment = assessWorkspaceCreationApproval(await project(statusRecord));
    assert.equal(assessment.approval_state, "BLOCKED", `${status} must be blocked`);
  }

  assert.throws(
    () => assessWorkspaceCreationApproval(JSON.parse(JSON.stringify(approvedProjection))),
    /authoritative approval projection/
  );

  for (const [override, queryOverride] of [
    [{ entity_id: "Other Workspace" }, {}],
    [{ requested_action: "DELETE_WORKSPACE" }, {}],
    [{ requested_for: "Other Owner" }, {}],
    [{ entity_type: "project" }, {}],
    [{ requested_by: "different_requester" }, {}],
    [{ decided_by: "different_approver" }, {}],
    [{ decision_at: "" }, {}],
    [{ id: "approval_other_workspace_001" }, {}],
    [{ approval_type: "project_activation" }, {}],
    [{ project: "other-partition" }, {}],
    [{}, { requester_id: "different_requester" }],
    [{}, { approver_id: "different_approver" }]
  ]) {
    await assert.rejects(project(record(override), queryOverride));
  }

  await assert.rejects(
    projectWorkspaceCreationApproval({ ...query(), unknown: true }, { approvalReader: async () => record() })
  );

  for (const file of [
    "workspace-creation-approval-projection.js",
    "workspace-creation-approval-model.js"
  ]) {
    sourceHasNoWriter(fs.readFileSync(path.join(
      REPOSITORY_ROOT,
      "runtime/orchestrator-service/lib/workspace",
      file
    ), "utf8"));
  }
  assert.deepEqual(inventory(liveData), liveBefore, "read-only approval assessment changed live data");

  console.log(JSON.stringify({
    ok: true,
    phase: "K-5E/K-5F.1",
    missing_approval: missing.approval_state,
    approved_artifact: approved.approval_state,
    non_approved_statuses: "BLOCKED",
    raw_caller_object: "REJECTED",
    immutable_output: true,
    deterministic_output: true,
    workspace_created: false,
    workspace_storage_written: false,
    data_changed: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

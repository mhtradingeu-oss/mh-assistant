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
  WorkspaceCreationApprovalProjectionError,
  projectWorkspaceCreationApproval
} = require("../runtime/orchestrator-service/lib/workspace/workspace-creation-approval-projection");
const {
  assessWorkspaceCreationApproval
} = require("../runtime/orchestrator-service/lib/workspace/workspace-creation-approval-model");
const {
  prepareControlledWorkspaceCreation
} = require("../runtime/orchestrator-service/lib/workspace/controlled-workspace-creation-boundary");
const {
  prepareGovernedWorkspaceCreationHandoff
} = require("../runtime/orchestrator-service/lib/workspace/governed-workspace-creation-handoff");

const ROOT = path.resolve(__dirname, "..");
const TS = "2026-07-24T14:00:00.000Z";

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

async function projection(authoritativeRecord, queryOverrides = {}) {
  return projectWorkspaceCreationApproval(query(queryOverrides), {
    approvalReader: async ({ authority_partition, approval_id }) => {
      assert.equal(authority_partition, query(queryOverrides).authority_partition);
      assert.equal(approval_id, query(queryOverrides).approval_id);
      return authoritativeRecord;
    }
  });
}

async function rejectedRecord(overrides, queryOverrides = {}) {
  await assert.rejects(
    projection(record(overrides), queryOverrides),
    WorkspaceCreationApprovalProjectionError
  );
}

async function run() {
  const liveData = path.join(ROOT, "data");
  const liveBefore = inventory(liveData);
  const checks = {};

  checks.missing_approval = assessWorkspaceCreationApproval(await projection(null)).approval_state;

  for (const status of ["pending", "rejected", "cancelled", "changes_requested", "escalated", "overridden"]) {
    const candidate = record({ status, decided_by: "", decided_at: "", decision_at: "" });
    const assessment = assessWorkspaceCreationApproval(await projection(candidate));
    assert.equal(assessment.approval_state, "BLOCKED");
    checks[status] = assessment.approval_state;
  }

  await rejectedRecord({ entity_id: "Other Workspace" });
  checks.wrong_workspace = "REJECTED";
  await rejectedRecord({ requested_action: "DELETE_WORKSPACE" });
  checks.wrong_action = "REJECTED";
  await rejectedRecord({ requested_for: "Other Owner" });
  checks.wrong_owner = "REJECTED";
  await rejectedRecord({ entity_type: "project" });
  checks.wrong_scope_type = "REJECTED";
  await rejectedRecord({ entity_id: "MH Trading Replay" });
  checks.wrong_scope_key = "REJECTED";
  await rejectedRecord({ requested_by: "other_requester" });
  await rejectedRecord({}, { requester_id: "other_requester" });
  checks.mismatched_requester = "REJECTED";
  await rejectedRecord({ decided_by: "other_approver" });
  await rejectedRecord({}, { approver_id: "other_approver" });
  checks.mismatched_approver = "REJECTED";
  await rejectedRecord({ decision_at: "" });
  checks.missing_decision_timestamp = "REJECTED";

  const malformedId = "not-an-approval-reference";
  const malformed = record({ id: malformedId });
  const malformedAssessment = assessWorkspaceCreationApproval(
    await projection(malformed, { approval_id: malformedId })
  );
  assert.equal(malformedAssessment.approval_state, "BLOCKED");
  checks.malformed_evidence_reference = "BLOCKED";

  await assert.rejects(
    projectWorkspaceCreationApproval({ ...query(), unknown: "field" }, {
      approvalReader: async () => record()
    }),
    WorkspaceCreationApprovalProjectionError
  );
  checks.unknown_query_fields = "REJECTED";

  await rejectedRecord({ entity_id: "Other Workspace" });
  checks.cross_workspace_replay = "REJECTED";
  await rejectedRecord({ requested_action: "ARCHIVE_WORKSPACE" });
  checks.same_approval_different_action = "REJECTED";

  const validProjection = await projection(record());
  const copiedProjection = JSON.parse(JSON.stringify(validProjection));
  assert.throws(
    () => assessWorkspaceCreationApproval(copiedProjection),
    /authoritative approval projection/
  );
  checks.caller_crafted_object = "REJECTED";

  assert.equal(Object.isFrozen(validProjection), true);
  assert.throws(() => { validProjection.owner = "Other Owner"; }, TypeError);
  assert.equal(validProjection.owner, "MH Trading Owner");
  checks.projection_mutation = "REJECTED";

  const projectionSource = fs.readFileSync(path.join(
    ROOT,
    "runtime/orchestrator-service/lib/workspace/workspace-creation-approval-projection.js"
  ), "utf8");
  assert.equal(/workspace-runtime/.test(projectionSource), false);
  assert.equal(/node:fs|writeFile|appendFile|mkdir/.test(projectionSource), false);
  assert.equal(/createApproval\s*\(|decideApproval\s*\(/.test(projectionSource), false);
  checks.projection_runtime_import = "ABSENT";
  checks.projection_filesystem_write = "ABSENT";

  const approved = assessWorkspaceCreationApproval(validProjection);
  const repeated = assessWorkspaceCreationApproval(await projection(record()));
  assert.equal(approved.approval_state, "APPROVED");
  assert.deepEqual(repeated, approved);
  assert.equal(Object.isFrozen(approved), true);
  checks.valid_authoritative_record = "APPROVED";
  checks.assessment_deterministic = true;

  let lookupCount = 0;
  const runtime = {
    findWorkspaceByCreationEvidence: async () => {
      lookupCount += 1;
      return null;
    },
    createWorkspace: async () => {
      throw new Error("K-5F.1 must never create a Workspace");
    }
  };
  const handoff = await prepareGovernedWorkspaceCreationHandoff(query(), {
    approvalReader: async () => record(),
    workspaceRuntime: runtime
  });
  assert.equal(handoff.dry_run.result_state, "DRY_RUN_READY");
  assert.equal(lookupCount, 2, "handoff must validate two exact dry runs");
  assert.equal(handoff.safety.workspace_created, false);
  assert.equal(Object.isFrozen(handoff), true);
  checks.governed_handoff = "DRY_RUN_READY";

  await assert.rejects(
    prepareControlledWorkspaceCreation(
      JSON.parse(JSON.stringify(handoff.creation_request)),
      { workspaceRuntime: runtime }
    )
  );
  checks.raw_k5c_request = "REJECTED";

  assert.deepEqual(inventory(liveData), liveBefore, "live data tree changed");
  checks.live_data_tree = "UNCHANGED";

  console.log(JSON.stringify({
    ok: true,
    phase: "K-5F.1",
    checks,
    approval_written: false,
    workspace_created: false,
    workspace_id_created: false,
    workspace_storage_written: false,
    k5c_apply_executed: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

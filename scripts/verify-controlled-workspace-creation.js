#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  GOVERNANCE_AUTHORITY_PARTITION
} = require("../runtime/orchestrator-service/lib/security/governance-authority-partition");
const {
  ControlledWorkspaceCreationContractError
} = require("../runtime/orchestrator-service/lib/workspace/controlled-workspace-creation-contract");
const {
  prepareControlledWorkspaceCreation
} = require("../runtime/orchestrator-service/lib/workspace/controlled-workspace-creation-boundary");
const {
  prepareGovernedWorkspaceCreationHandoff
} = require("../runtime/orchestrator-service/lib/workspace/governed-workspace-creation-handoff");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const TS = "2026-07-24T12:00:00.000Z";

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

function query() {
  return {
    authority_partition: GOVERNANCE_AUTHORITY_PARTITION,
    approval_id: "approval_mh_trading_workspace_001",
    requester_id: "principal_mh_trading_operator",
    approver_id: "principal_mh_trading_owner"
  };
}

function approvedRecord() {
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
    decision_at: TS
  };
}

async function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-k5c-workspace-"));
  try {
    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const fixtureBefore = inventory(fixture);
    const runtime = {
      findWorkspaceByCreationEvidence: async () => null,
      createWorkspace: async () => {
        throw new Error("Workspace creation must not run in K-5F.1");
      }
    };
    const handoff = await prepareGovernedWorkspaceCreationHandoff(query(), {
      approvalReader: async () => approvedRecord(),
      workspaceRuntime: runtime,
      workspaceRoot: fixture
    });
    assert.equal(handoff.approval_assessment.approval_state, "APPROVED");
    assert.equal(handoff.dry_run.result_state, "DRY_RUN_READY");
    assert.equal(handoff.dry_run.plan.steps[0].authority_owner, "governance-approval-engine");
    assert.equal(handoff.safety.workspace_created, false);
    assert.equal(Object.isFrozen(handoff), true);
    assert.equal(Object.isFrozen(handoff.creation_request), true);
    assert.equal(Object.isFrozen(handoff.dry_run.plan.steps), true);
    assert.deepEqual(inventory(fixture), fixtureBefore, "governed dry run changed storage");

    await assert.rejects(
      prepareControlledWorkspaceCreation(JSON.parse(JSON.stringify(handoff.creation_request)), {
        workspaceRuntime: runtime,
        workspaceRoot: fixture
      }),
      ControlledWorkspaceCreationContractError
    );
    assert.deepEqual(inventory(liveData), liveBefore, "live data changed");

    const boundarySource = fs.readFileSync(path.join(
      REPOSITORY_ROOT,
      "runtime/orchestrator-service/lib/workspace/controlled-workspace-creation-boundary.js"
    ), "utf8");
    [
      /node:fs/,
      /writeFileSync\s*\(/,
      /createProject\s*\(/,
      /ensureProjectIdentity/,
      /attachProject/,
      /registry\.json/
    ].forEach((pattern) => assert.equal(pattern.test(boundarySource), false, `boundary bypass: ${pattern}`));

    console.log(JSON.stringify({
      ok: true,
      phase: "K-5C/K-5F.1",
      governed_handoff: "DRY_RUN_READY",
      raw_caller_request: "REJECTED",
      approval_authority: "governance-approval-engine",
      workspace_created: false,
      workspace_id_created: false,
      workspace_storage_written: false,
      project_files_changed: false,
      hairoticmen_changed: false
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

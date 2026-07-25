#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  prepareProductionGovernanceComposition
} = require("../runtime/orchestrator-service/lib/workspace/production-governance-composition");

const ROOT = path.resolve(__dirname, "..");
const APPROVAL_ID = "approval_mh_trading_workspace_k6d";
const PRINCIPAL_ID = "legacy-control-center-key";
const DECIDED_AT = "2026-07-24T15:00:00.000Z";

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

function approval() {
  return {
    id: APPROVAL_ID,
    project: "governance-system",
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
    decided_at: DECIDED_AT,
    decision_at: DECIDED_AT
  };
}

function authenticatedContext() {
  return {
    principal: {
      principal_id: PRINCIPAL_ID,
      principal_type: "service",
      authenticated: true,
      authentication_method: "control_key",
      source: "protected_read_key_guard"
    },
    roles: [],
    permissions: ["governance.workspace_creation.prepare"]
  };
}

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  Object.values(value).forEach(assertDeepFrozen);
}

function assertNoUndefined(value) {
  if (!value || typeof value !== "object") {
    assert.notEqual(value, undefined);
    return;
  }
  for (const [key, item] of Object.entries(value)) {
    assert.notEqual(item, undefined, `${key} must not be undefined`);
    assertNoUndefined(item);
  }
}

async function run() {
  const dataBefore = inventory(path.join(ROOT, "data"));
  const auditBefore = inventory(path.join(ROOT, ".mh-audit"));
  let approvalReads = 0;
  let workspaceLookups = 0;
  let workspaceWrites = 0;
  const options = {
    authenticatedContext: authenticatedContext(),
    approvalReader: async (approvalId) => {
      approvalReads += 1;
      assert.equal(approvalId, APPROVAL_ID);
      return approval();
    },
    workspaceRuntime: {
      findWorkspaceByCreationEvidence: async () => {
        workspaceLookups += 1;
        return null;
      },
      createWorkspace: async () => {
        workspaceWrites += 1;
        throw new Error("Workspace writer must remain unreachable");
      }
    }
  };

  const first = await prepareProductionGovernanceComposition(
    { approval_id: APPROVAL_ID },
    options
  );
  const second = await prepareProductionGovernanceComposition(
    { approval_id: APPROVAL_ID },
    options
  );

  assert.deepEqual(Object.keys(first), [
    "kind",
    "workspace_name",
    "approval_id",
    "authority_partition",
    "approval_state",
    "dry_run_state",
    "dry_runs_equivalent",
    "dry_run",
    "dry_run_plans_equivalent",
    "apply_executed",
    "workspace_created",
    "workspace_id",
    "mutation_allowed_by_this_endpoint"
  ]);
  assert.equal(first.dry_run_state, "DRY_RUN_READY");
  assert.equal(first.dry_runs_equivalent, true);
  assert.equal(first.dry_run_state, first.dry_run.result_state);
  assert.equal(first.dry_runs_equivalent, first.dry_run_plans_equivalent);
  assert.equal(first.apply_executed, false);
  assert.equal(first.workspace_created, false);
  assert.equal(first.workspace_id, null);
  assert.equal(first.mutation_allowed_by_this_endpoint, false);
  assertNoUndefined(first);
  assertDeepFrozen(first);
  assert.equal(JSON.stringify(first), JSON.stringify(second));

  assert.throws(() => {
    first.dry_run_state = "APPLIED";
  }, TypeError);
  assert.throws(() => {
    first.dry_run.result_state = "APPLIED";
  }, TypeError);
  assert.throws(() => {
    first.dry_runs_equivalent = false;
  }, TypeError);
  assert.throws(() => {
    first.dry_run_plans_equivalent = false;
  }, TypeError);
  assert.equal(first.dry_run_state, first.dry_run.result_state);
  assert.equal(first.dry_runs_equivalent, first.dry_run_plans_equivalent);
  assert.equal(JSON.stringify(first), JSON.stringify(second));

  let failedResponse;
  await assert.rejects(async () => {
    failedResponse = await prepareProductionGovernanceComposition({}, options);
  });
  assert.equal(failedResponse, undefined);
  assert.equal(approvalReads, 2);
  assert.equal(workspaceLookups, 4);
  assert.equal(workspaceWrites, 0);
  assert.deepEqual(inventory(path.join(ROOT, "data")), dataBefore);
  assert.deepEqual(inventory(path.join(ROOT, ".mh-audit")), auditBefore);
  assert.equal(fs.existsSync(path.join(ROOT, "data/projects/governance-system")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/workspaces")), false);

  console.log(JSON.stringify({
    ok: true,
    phase: "K-6D",
    canonical_contract: {
      dry_run_state: first.dry_run_state,
      dry_runs_equivalent: first.dry_runs_equivalent
    },
    compatibility_contract: {
      nested_dry_run_result_state: first.dry_run.result_state,
      dry_run_plans_equivalent: first.dry_run_plans_equivalent
    },
    checks: {
      exact_field_names_and_locations: "PASS",
      semantic_alias_equality: "PASS",
      contradictory_fields: "NONE",
      undefined_fields: "NONE",
      stable_object_order: "PASS",
      deterministic_serialization: "BYTE_EQUIVALENT",
      deeply_immutable: "PASS",
      failed_response_partial_contract: "NONE",
      production_data: "UNCHANGED"
    },
    approval_created: false,
    approval_decided: false,
    k5c_apply_executed: false,
    workspace_created: false,
    workspace_id_created: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

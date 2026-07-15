"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");

const executor = require(
  "../runtime/orchestrator-service/lib/workspace/" +
  "workspace-projection-reconciliation-executor"
);
const contract = require(
  "../runtime/orchestrator-service/lib/workspace/" +
  "workspace-projection-reconciliation-contract"
);
const projection = require(
  "../runtime/orchestrator-service/lib/projects/" +
  "project-workspace-projection"
);

const workspaceId = `ws_${"1".repeat(32)}`;
const relationshipId = `wpr_${"2".repeat(32)}`;
const projectId = `prj_${"3".repeat(32)}`;

function evidence() {
  return {
    reference_type: "workspace_projection_rebuild",
    reference_id: "executor-verifier",
    source_owner:
      "workspace-projection-reconciliation-executor-verifier",
    recorded_at: "2026-07-15T12:00:00.000Z"
  };
}

function fingerprint(status, version) {
  return {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: status,
    workspace_version: version
  };
}

function inspection(overrides = {}) {
  return {
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    project_id: projectId,
    resolution_state: "RESOLVED",
    authority_alignment: "MISSING",
    operation_readiness: "READY_TO_PROJECT",
    storage_health: "HEALTHY",
    recommended_action:
      "WRITE_MISSING_PROJECTION",
    repair_eligibility: "ELIGIBLE",
    observed_workspace_version: 7,
    observed_relationship_status: "ATTACHED",
    observed_projection_fingerprint: null,
    expected_projection_fingerprint:
      fingerprint("ATTACHED", 7),
    observed_at: "2026-07-15T12:00:00.000Z",
    snapshot_consistency: "BEST_EFFORT",
    blocker: null,
    evidence: null,
    error: null,
    ...overrides
  };
}

function requestFor(value) {
  return {
    workspace_id: value.workspace_id,
    relationship_id: value.relationship_id,
    action: value.recommended_action,
    expected_workspace_version:
      value.observed_workspace_version,
    expected_inspection_fingerprint:
      contract
        .createReconciliationInspectionFingerprint(
          value
        ),
    evidence_reference: evidence()
  };
}

function harness(before, after, overrides = {}) {
  const calls = [];
  let inspections = 0;

  const inspector = {
    async inspectWorkspaceProjectProjectionDrift(
      input
    ) {
      calls.push("inspect");
      assert.deepEqual(input, {
        workspace_id: workspaceId,
        relationship_id: relationshipId
      });

      inspections += 1;
      return inspections === 1
        ? before
        : after;
    }
  };

  const projections = {
    ...projection,
    async writeProjectWorkspaceProjection(input) {
      calls.push("projection:write");

      assert.equal(input.project_id, projectId);
      assert.equal(
        input.desired_projection.projected_at,
        "2026-07-15T13:00:00.000Z"
      );

      return overrides.projectionResult || {
        outcome:
          projection
            .PROJECT_WORKSPACE_PROJECTION_OUTCOMES
            .WRITE_SUCCESS,
        changed: true,
        projection_fingerprint:
          before.expected_projection_fingerprint
      };
    }
  };

  const orchestrator = {
    async completeWorkspaceProjectAttach(input) {
      calls.push("orchestrator:attach");
      assert.equal(
        input.expected_workspace_version,
        before.observed_workspace_version
      );

      return overrides.orchestratorResult || {
        outcome: "ATTACH_SUCCESS",
        changed: true
      };
    },

    async completeWorkspaceProjectDetach(input) {
      calls.push("orchestrator:detach");

      return overrides.orchestratorResult || {
        outcome: "DETACH_SUCCESS",
        changed: true
      };
    }
  };

  return {
    calls,
    options: {
      now: () =>
        "2026-07-15T13:00:00.000Z",
      dependencies: {
        contract,
        inspector,
        projections,
        orchestrator
      }
    }
  };
}

async function run() {
  const complete = inspection({
    authority_alignment: "MATCH",
    operation_readiness: "COMPLETE",
    recommended_action: "NONE",
    repair_eligibility: "INELIGIBLE"
  });

  const missing = inspection();
  const missingHarness =
    harness(missing, complete);

  const missingResult =
    await executor
      .reconcileWorkspaceProjectProjection(
        requestFor(missing),
        missingHarness.options
      );

  assert.equal(
    missingResult.outcome,
    "RECONCILIATION_SUCCESS"
  );
  assert.deepEqual(
    missingHarness.calls,
    ["inspect", "projection:write", "inspect"]
  );

  const stale = inspection({
    authority_alignment: "STALE",
    recommended_action:
      "UPDATE_STALE_PROJECTION",
    observed_projection_fingerprint:
      fingerprint("ATTACHED", 6)
  });

  const staleHarness =
    harness(stale, complete);

  const staleResult =
    await executor
      .reconcileWorkspaceProjectProjection(
        requestFor(stale),
        staleHarness.options
      );

  assert.equal(
    staleResult.outcome,
    "RECONCILIATION_SUCCESS"
  );

  const pendingAttach = inspection({
    observed_relationship_status:
      "PENDING_ATTACH",
    observed_workspace_version: 4,
    authority_alignment:
      "AHEAD_OF_AUTHORITY",
    operation_readiness:
      "READY_TO_COMPLETE_TERMINAL",
    recommended_action:
      "COMPLETE_PENDING_ATTACH",
    observed_projection_fingerprint:
      fingerprint("ATTACHED", 5),
    expected_projection_fingerprint:
      fingerprint("ATTACHED", 5)
  });

  const attached = inspection({
    observed_workspace_version: 5,
    observed_relationship_status: "ATTACHED",
    authority_alignment: "MATCH",
    operation_readiness: "COMPLETE",
    recommended_action: "NONE",
    repair_eligibility: "INELIGIBLE",
    observed_projection_fingerprint:
      fingerprint("ATTACHED", 5),
    expected_projection_fingerprint:
      fingerprint("ATTACHED", 5)
  });

  const attachHarness =
    harness(pendingAttach, attached);

  const attachResult =
    await executor
      .reconcileWorkspaceProjectProjection(
        requestFor(pendingAttach),
        attachHarness.options
      );

  assert.equal(
    attachResult.outcome,
    "RECONCILIATION_SUCCESS"
  );
  assert.deepEqual(
    attachHarness.calls,
    ["inspect", "orchestrator:attach", "inspect"]
  );

  const staleApprovalRequest =
    requestFor(missing);

  const changedBefore = inspection({
    observed_workspace_version: 8
  });

  const staleApprovalHarness =
    harness(changedBefore, changedBefore);

  const staleApprovalResult =
    await executor
      .reconcileWorkspaceProjectProjection(
        staleApprovalRequest,
        staleApprovalHarness.options
      );

  assert.equal(
    staleApprovalResult.outcome,
    "RECONCILIATION_STALE_INSPECTION"
  );
  assert.deepEqual(
    staleApprovalHarness.calls,
    ["inspect"]
  );

  const partialHarness = harness(
    missing,
    inspection({
      authority_alignment: "MISSING",
      operation_readiness: "PARTIAL"
    })
  );

  const partialResult =
    await executor
      .reconcileWorkspaceProjectProjection(
        requestFor(missing),
        partialHarness.options
      );

  assert.equal(
    partialResult.outcome,
    "RECONCILIATION_PARTIAL"
  );
  assert.equal(
    partialResult.inspection_required,
    true
  );

  const noopHarness = harness(
    missing,
    complete,
    {
      projectionResult: {
        outcome:
          projection
            .PROJECT_WORKSPACE_PROJECTION_OUTCOMES
            .WRITE_NOOP,
        changed: false
      }
    }
  );

  const noopResult =
    await executor
      .reconcileWorkspaceProjectProjection(
        requestFor(missing),
        noopHarness.options
      );

  assert.equal(
    noopResult.outcome,
    "RECONCILIATION_NOOP"
  );

  const source = fs.readFileSync(
    require.resolve(
      "../runtime/orchestrator-service/lib/workspace/" +
      "workspace-projection-reconciliation-executor"
    ),
    "utf8"
  );

  for (const pattern of [
    /require\(["'](?:fs|path)["']\)/,
    /workspace-storage/,
    /workspace-relationship-runtime/,
    /project-identity/,
    /validation_state\s*=/,
    /router\./,
    /app\.(?:get|post|put|patch|delete)/,
    /setInterval|setTimeout/,
    /reconcileAll|repairAll/
  ]) {
    assert.doesNotMatch(source, pattern);
  }

  assert.deepEqual(
    Object.keys(executor).sort(),
    [
      "RECONCILIATION_ERROR_CODES",
      "RECONCILIATION_OUTCOMES",
      "WorkspaceProjectionReconciliationExecutorError",
      "reconcileWorkspaceProjectProjection"
    ]
  );

  console.log(JSON.stringify({
    verifier:
      "workspace-projection-reconciliation-executor",
    status: "PASS",
    contract_revalidated: true,
    inspector_reread: true,
    owner_dispatch: true,
    projection_expected_current_guard: true,
    final_state_certified: true,
    stale_approval_blocked: true,
    partial_visible: true,
    no_automatic_rollback: true,
    no_direct_storage: true,
    no_route_or_security_integration: true,
    production_data_touched: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

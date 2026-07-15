"use strict";

const assert = require("assert");

const contract = require(
  "../runtime/orchestrator-service/lib/workspace/" +
  "workspace-projection-reconciliation-contract"
);

const workspaceId = `ws_${"1".repeat(32)}`;
const relationshipId = `wpr_${"2".repeat(32)}`;
const projectId = `prj_${"3".repeat(32)}`;

function evidence() {
  return {
    reference_type: "workspace_projection_rebuild",
    reference_id: "reconciliation-test-evidence",
    source_owner: "workspace-projection-reconciliation-contract-verifier",
    recorded_at: "2026-07-15T12:00:00.000Z"
  };
}

function inspection(overrides = {}) {
  return {
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    project_id: projectId,
    observed_relationship_status: "ATTACHED",
    observed_workspace_version: 7,
    resolution_state: "RESOLVED",
    authority_alignment: "MISSING",
    operation_readiness: "READY_TO_PROJECT",
    storage_health: "HEALTHY",
    observed_projection_fingerprint: null,
    expected_projection_fingerprint: {
      projection_schema_version: 1,
      workspace_id: workspaceId,
      relationship_id: relationshipId,
      relationship_status: "ATTACHED",
      workspace_version: 7
    },
    recommended_action: "WRITE_MISSING_PROJECTION",
    repair_eligibility: "ELIGIBLE",
    observed_at: "2026-07-15T12:00:00.000Z",
    snapshot_consistency: "BEST_EFFORT",
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
      contract.createReconciliationInspectionFingerprint(value),
    evidence_reference: evidence()
  };
}

function expectCode(fn, code) {
  assert.throws(
    fn,
    (error) =>
      error instanceof
        contract.WorkspaceProjectionReconciliationContractError &&
      error.code === code
  );
}

assert.deepEqual(
  [...contract.RECONCILIATION_ACTIONS],
  [
    "WRITE_MISSING_PROJECTION",
    "UPDATE_STALE_PROJECTION",
    "COMPLETE_PENDING_ATTACH",
    "COMPLETE_PENDING_DETACH"
  ]
);

const missing = inspection();
const missingPlan =
  contract.buildWorkspaceProjectionReconciliationPlan(
    requestFor(missing),
    missing
  );

assert.equal(missingPlan.outcome, "CONTRACT_VALID");
assert.equal(missingPlan.executable, false);
assert.equal(
  missingPlan.execution_owner,
  "project-workspace-projection-writer"
);
assert.equal(
  missingPlan.direction,
  "WORKSPACE_AUTHORITY_TO_PROJECT_PROJECTION"
);

const stale = inspection({
  authority_alignment: "STALE",
  recommended_action: "UPDATE_STALE_PROJECTION",
  observed_projection_fingerprint: {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: "ATTACHED",
    workspace_version: 6
  }
});

const stalePlan =
  contract.buildWorkspaceProjectionReconciliationPlan(
    requestFor(stale),
    stale
  );

assert.equal(
  stalePlan.execution_owner,
  "project-workspace-projection-writer"
);

const pendingAttach = inspection({
  observed_relationship_status: "PENDING_ATTACH",
  observed_workspace_version: 4,
  authority_alignment: "AHEAD_OF_AUTHORITY",
  operation_readiness: "READY_TO_COMPLETE_TERMINAL",
  recommended_action: "COMPLETE_PENDING_ATTACH",
  observed_projection_fingerprint: {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: "ATTACHED",
    workspace_version: 5
  },
  expected_projection_fingerprint: {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: "ATTACHED",
    workspace_version: 5
  }
});

const attachPlan =
  contract.buildWorkspaceProjectionReconciliationPlan(
    requestFor(pendingAttach),
    pendingAttach
  );

assert.equal(
  attachPlan.execution_owner,
  "workspace-projection-orchestrator"
);

const pendingDetach = inspection({
  observed_relationship_status: "PENDING_DETACH",
  observed_workspace_version: 10,
  authority_alignment: "AHEAD_OF_AUTHORITY",
  operation_readiness: "READY_TO_COMPLETE_TERMINAL",
  recommended_action: "COMPLETE_PENDING_DETACH",
  observed_projection_fingerprint: {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: "DETACHED",
    workspace_version: 11
  },
  expected_projection_fingerprint: {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: "DETACHED",
    workspace_version: 11
  }
});

contract.buildWorkspaceProjectionReconciliationPlan(
  requestFor(pendingDetach),
  pendingDetach
);

const fingerprintA =
  contract.createReconciliationInspectionFingerprint(
    inspection({ observed_at: "2026-01-01T00:00:00.000Z" })
  );

const fingerprintB =
  contract.createReconciliationInspectionFingerprint(
    inspection({ observed_at: "2027-01-01T00:00:00.000Z" })
  );

assert.deepEqual(
  fingerprintA,
  fingerprintB,
  "observed_at must not affect fingerprint"
);

const staleRequest = requestFor(missing);

expectCode(
  () =>
    contract.buildWorkspaceProjectionReconciliationPlan(
      staleRequest,
      inspection({ observed_workspace_version: 8 })
    ),
  contract.RECONCILIATION_CONTRACT_ERROR_CODES
    .WORKSPACE_VERSION_MISMATCH
);

expectCode(
  () =>
    contract.buildWorkspaceProjectionReconciliationPlan(
      {
        ...requestFor(missing),
        action: "UPDATE_STALE_PROJECTION"
      },
      missing
    ),
  contract.RECONCILIATION_CONTRACT_ERROR_CODES
    .RECOMMENDATION_MISMATCH
);

expectCode(
  () =>
    contract.buildWorkspaceProjectionReconciliationPlan(
      requestFor(
        inspection({
          repair_eligibility: "INELIGIBLE"
        })
      ),
      inspection({
        repair_eligibility: "INELIGIBLE"
      })
    ),
  contract.RECONCILIATION_CONTRACT_ERROR_CODES.INELIGIBLE
);

expectCode(
  () => {
    const value = inspection({
      storage_health: "PROJECT_PROJECTION_RECOVERY_REQUIRED",
      operation_readiness: "RECOVERY_REQUIRED",
      recommended_action: "RECOVER_PROJECT_STORAGE"
    });

    contract.buildWorkspaceProjectionReconciliationPlan(
      {
        ...requestFor(inspection()),
        expected_inspection_fingerprint:
          contract.createReconciliationInspectionFingerprint(value)
      },
      value
    );
  },
  contract.RECONCILIATION_CONTRACT_ERROR_CODES
    .RECOVERY_REQUIRED
);

expectCode(
  () =>
    contract.validateReconciliationRequest({
      ...requestFor(missing),
      unexpected: true
    }),
  contract.RECONCILIATION_CONTRACT_ERROR_CODES.UNKNOWN_FIELD
);

assert.equal(
  JSON.stringify(missingPlan).includes("writeProject"),
  false
);

console.log(JSON.stringify({
  verifier: "workspace-projection-reconciliation-contract",
  status: "PASS",
  contract_only: true,
  execution_free: true,
  storage_free: true,
  owner_mapping: true,
  stale_inspection_guard: true,
  one_way_authority: true,
  production_data_touched: false
}, null, 2));

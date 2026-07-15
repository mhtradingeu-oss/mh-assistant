"use strict";

const reconciliationContract = require(
  "./workspace-projection-reconciliation-contract"
);
const driftInspector = require(
  "./workspace-projection-drift-inspector"
);
const projectionOrchestrator = require(
  "./workspace-projection-orchestrator"
);
const projectionWriter = require(
  "../projects/project-workspace-projection"
);

const RECONCILIATION_OUTCOMES = Object.freeze({
  SUCCESS: "RECONCILIATION_SUCCESS",
  NOOP: "RECONCILIATION_NOOP",
  STALE_INSPECTION: "RECONCILIATION_STALE_INSPECTION",
  CONFLICT: "RECONCILIATION_CONFLICT",
  INELIGIBLE: "RECONCILIATION_INELIGIBLE",
  RECOVERY_REQUIRED: "RECONCILIATION_RECOVERY_REQUIRED",
  PARTIAL: "RECONCILIATION_PARTIAL",
  FAILED: "RECONCILIATION_FAILED"
});

const RECONCILIATION_ERROR_CODES = Object.freeze({
  INPUT_INVALID: "RECONCILIATION_EXECUTOR_INPUT_INVALID",
  STALE_INSPECTION: "RECONCILIATION_EXECUTOR_STALE_INSPECTION",
  CONFLICT: "RECONCILIATION_EXECUTOR_CONFLICT",
  INELIGIBLE: "RECONCILIATION_EXECUTOR_INELIGIBLE",
  RECOVERY_REQUIRED: "RECONCILIATION_EXECUTOR_RECOVERY_REQUIRED",
  OWNER_FAILED: "RECONCILIATION_EXECUTOR_OWNER_FAILED",
  FINAL_INSPECTION_FAILED:
    "RECONCILIATION_EXECUTOR_FINAL_INSPECTION_FAILED",
  PARTIAL: "RECONCILIATION_EXECUTOR_PARTIAL"
});

class WorkspaceProjectionReconciliationExecutorError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name =
      "WorkspaceProjectionReconciliationExecutorError";
    this.code = code;
    this.details = Object.freeze(deepCopy(details));
  }
}

function deepCopy(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function frozenCopy(value) {
  return Object.freeze(deepCopy(value));
}

function serializeError(error) {
  if (!error) return null;

  return Object.freeze({
    name: error.name || "Error",
    code: error.code || null,
    message: error.message || String(error),
    outcome: error.outcome || null,
    details: frozenCopy(error.details || null)
  });
}

function normalizeOptions(options) {
  if (options === undefined) return {};

  if (
    !options ||
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    throw new WorkspaceProjectionReconciliationExecutorError(
      RECONCILIATION_ERROR_CODES.INPUT_INVALID,
      "options must be an object"
    );
  }

  return options;
}

function dependencies(options) {
  const normalized = normalizeOptions(options);
  const injected = normalized.dependencies || {};

  return {
    contract:
      injected.contract || reconciliationContract,
    inspector:
      injected.inspector || driftInspector,
    orchestrator:
      injected.orchestrator || projectionOrchestrator,
    projections:
      injected.projections || projectionWriter,
    now:
      typeof normalized.now === "function"
        ? normalized.now
        : () => new Date().toISOString(),
    ownerOptions:
      normalized.ownerOptions || {}
  };
}

function contractFailureOutcome(error, contract) {
  const codes = contract.RECONCILIATION_CONTRACT_ERROR_CODES;

  if (
    error &&
    (
      error.code === codes.INSPECTION_FINGERPRINT_MISMATCH ||
      error.code === codes.WORKSPACE_VERSION_MISMATCH ||
      error.code === codes.RECOMMENDATION_MISMATCH
    )
  ) {
    return RECONCILIATION_OUTCOMES.STALE_INSPECTION;
  }

  if (
    error &&
    (
      error.code === codes.INELIGIBLE ||
      error.code === codes.RESOLUTION_BLOCKED ||
      error.code === codes.ACTION_INVALID
    )
  ) {
    return RECONCILIATION_OUTCOMES.INELIGIBLE;
  }

  if (
    error &&
    error.code === codes.RECOVERY_REQUIRED
  ) {
    return RECONCILIATION_OUTCOMES.RECOVERY_REQUIRED;
  }

  if (
    error &&
    (
      error.code === codes.ALIGNMENT_CONFLICT ||
      error.code === codes.INSPECTION_INVALID
    )
  ) {
    return RECONCILIATION_OUTCOMES.CONFLICT;
  }

  return RECONCILIATION_OUTCOMES.FAILED;
}

function ownerFailureOutcome(error, projections) {
  const code = error && error.code;
  const codes =
    projections.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES;

  if (
    code === codes.RECOVERY_REQUIRED ||
    code === codes.TEMP_PRESENT
  ) {
    return RECONCILIATION_OUTCOMES.RECOVERY_REQUIRED;
  }

  if (
    code === codes.CONFLICT ||
    code === codes.STALE ||
    code === codes.EXPECTATION_MISMATCH ||
    code === codes.EXPECTATION_REQUIRED
  ) {
    return RECONCILIATION_OUTCOMES.CONFLICT;
  }

  if (code === codes.UNCERTAIN_COMMIT) {
    return RECONCILIATION_OUTCOMES.PARTIAL;
  }

  return RECONCILIATION_OUTCOMES.FAILED;
}

function finalStateComplete(inspection) {
  return Boolean(
    inspection &&
    inspection.resolution_state === "RESOLVED" &&
    inspection.authority_alignment === "MATCH" &&
    inspection.operation_readiness === "COMPLETE" &&
    inspection.storage_health === "HEALTHY"
  );
}

function result(input) {
  return {
    outcome: RECONCILIATION_OUTCOMES.FAILED,
    changed: false,
    action: input && input.action
      ? input.action
      : null,
    workspace_id: input && input.workspace_id
      ? input.workspace_id
      : null,
    relationship_id: input && input.relationship_id
      ? input.relationship_id
      : null,
    project_id: null,
    plan: null,
    before: null,
    owner_result: null,
    after: null,
    inspection_required: false,
    retry_required: false,
    error: null
  };
}

function desiredProjection(inspection, deps) {
  const fingerprint =
    inspection.expected_projection_fingerprint;

  if (
    !fingerprint ||
    typeof fingerprint !== "object" ||
    Array.isArray(fingerprint)
  ) {
    throw new WorkspaceProjectionReconciliationExecutorError(
      RECONCILIATION_ERROR_CODES.INPUT_INVALID,
      "Expected projection fingerprint is unavailable"
    );
  }

  const desired = {
    ...deepCopy(fingerprint),
    projected_at: deps.now(),
    authoritative: false,
    source_owner:
      deps.projections
        .PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER
  };

  return deps.projections
    .validateProjectWorkspaceProjection(desired);
}

async function inspectCurrent(input, deps) {
  return deps.inspector
    .inspectWorkspaceProjectProjectionDrift(
      {
        workspace_id: input.workspace_id,
        relationship_id: input.relationship_id
      },
      deps.ownerOptions
    );
}

async function executeProjectionAction(
  plan,
  before,
  deps
) {
  const expectedCurrent =
    plan.action === "WRITE_MISSING_PROJECTION"
      ? null
      : before.observed_projection_fingerprint;

  return deps.projections.writeProjectWorkspaceProjection(
    {
      project_id: plan.project_id,
      desired_projection:
        desiredProjection(before, deps),
      expected_current_projection:
        expectedCurrent
    },
    deps.ownerOptions
  );
}

async function executePendingAction(
  plan,
  deps
) {
  const ownerInput = {
    workspace_id: plan.workspace_id,
    relationship_id: plan.relationship_id,
    expected_workspace_version:
      plan.expected_workspace_version,
    evidence_reference:
      deepCopy(plan.evidence_reference)
  };

  if (plan.action === "COMPLETE_PENDING_ATTACH") {
    return deps.orchestrator
      .completeWorkspaceProjectAttach(
        ownerInput,
        deps.ownerOptions
      );
  }

  return deps.orchestrator
    .completeWorkspaceProjectDetach(
      ownerInput,
      deps.ownerOptions
    );
}

async function reconcileWorkspaceProjectProjection(
  input,
  options = {}
) {
  const deps = dependencies(options);
  const output = result(input);

  let before;

  try {
    before = await inspectCurrent(input, deps);
    output.before = frozenCopy(before);
    output.project_id = before.project_id || null;
  } catch (error) {
    output.outcome = RECONCILIATION_OUTCOMES.FAILED;
    output.error = serializeError(error);
    return Object.freeze(output);
  }

  let plan;

  try {
    plan =
      deps.contract
        .buildWorkspaceProjectionReconciliationPlan(
          input,
          before
        );

    output.plan = frozenCopy(plan);
    output.project_id = plan.project_id || null;
  } catch (error) {
    output.outcome =
      contractFailureOutcome(error, deps.contract);
    output.retry_required =
      output.outcome ===
      RECONCILIATION_OUTCOMES.STALE_INSPECTION;
    output.inspection_required =
      output.retry_required;
    output.error = serializeError(error);
    return Object.freeze(output);
  }

  let ownerResult;

  try {
    if (
      plan.action === "WRITE_MISSING_PROJECTION" ||
      plan.action === "UPDATE_STALE_PROJECTION"
    ) {
      ownerResult =
        await executeProjectionAction(
          plan,
          before,
          deps
        );
    } else {
      ownerResult =
        await executePendingAction(plan, deps);
    }

    output.owner_result =
      frozenCopy(ownerResult);
  } catch (error) {
    output.outcome =
      ownerFailureOutcome(error, deps.projections);
    output.inspection_required =
      output.outcome ===
        RECONCILIATION_OUTCOMES.PARTIAL;
    output.retry_required =
      output.outcome ===
        RECONCILIATION_OUTCOMES.CONFLICT ||
      output.outcome ===
        RECONCILIATION_OUTCOMES.PARTIAL;
    output.error = serializeError(error);

    if (
      output.outcome !==
      RECONCILIATION_OUTCOMES.PARTIAL
    ) {
      return Object.freeze(output);
    }
  }

  try {
    output.after = frozenCopy(
      await inspectCurrent(input, deps)
    );
  } catch (error) {
    output.outcome =
      RECONCILIATION_OUTCOMES.PARTIAL;
    output.inspection_required = true;
    output.retry_required = false;
    output.error = serializeError(error);
    return Object.freeze(output);
  }

  if (!finalStateComplete(output.after)) {
    output.outcome =
      RECONCILIATION_OUTCOMES.PARTIAL;
    output.changed = Boolean(
      ownerResult &&
      (
        ownerResult.changed === true ||
        ownerResult.outcome ===
          deps.projections
            .PROJECT_WORKSPACE_PROJECTION_OUTCOMES
            .WRITE_SUCCESS
      )
    );
    output.inspection_required = true;
    output.error = output.error || null;
    return Object.freeze(output);
  }

  const ownerNoop = Boolean(
    ownerResult &&
    (
      ownerResult.changed === false ||
      ownerResult.outcome ===
        deps.projections
          .PROJECT_WORKSPACE_PROJECTION_OUTCOMES
          .WRITE_NOOP
    )
  );

  output.outcome = ownerNoop
    ? RECONCILIATION_OUTCOMES.NOOP
    : RECONCILIATION_OUTCOMES.SUCCESS;

  output.changed = !ownerNoop;
  output.inspection_required = false;
  output.retry_required = false;
  output.error = null;

  return Object.freeze(output);
}

module.exports = Object.freeze({
  RECONCILIATION_OUTCOMES,
  RECONCILIATION_ERROR_CODES,
  WorkspaceProjectionReconciliationExecutorError,
  reconcileWorkspaceProjectProjection
});

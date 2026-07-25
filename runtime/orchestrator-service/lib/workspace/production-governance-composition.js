"use strict";

const workspaceRuntime = require("./workspace-runtime");
const {
  GOVERNANCE_AUTHORITY_PARTITION
} = require("../security/governance-authority-partition");
const {
  readWorkspaceGovernanceApproval
} = require("./workspace-governance-approval-reader");
const {
  prepareGovernedWorkspaceCreationHandoff
} = require("./governed-workspace-creation-handoff");

const WORKSPACE_NAME = "MH Trading";
const INPUT_FIELDS = Object.freeze(["approval_id"]);

class ProductionGovernanceCompositionError extends Error {
  constructor(message, code, statusCode) {
    super(message);
    this.name = "ProductionGovernanceCompositionError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function fail(message, code, statusCode = 403) {
  throw new ProductionGovernanceCompositionError(message, code, statusCode);
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function exactInput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail("Request body must contain only approval_id", "GOVERNANCE_PREPARATION_INPUT_INVALID", 400);
  }
  const fields = Object.keys(value).sort();
  if (JSON.stringify(fields) !== JSON.stringify([...INPUT_FIELDS].sort())) {
    fail("Request body must contain only approval_id", "GOVERNANCE_PREPARATION_INPUT_INVALID", 400);
  }
  if (typeof value.approval_id !== "string" || value.approval_id.trim() !== value.approval_id
    || value.approval_id.length < 1 || value.approval_id.length > 160) {
    fail("approval_id is required", "GOVERNANCE_APPROVAL_ID_REQUIRED", 400);
  }
  return value.approval_id;
}

function authenticatedServicePrincipal(context) {
  const principal = context && context.principal;
  if (!principal || principal.authenticated !== true || typeof principal.principal_id !== "string"
    || !principal.principal_id || principal.principal_type !== "service") {
    fail("Authenticated Governance service principal is required", "GOVERNANCE_PRINCIPAL_FORBIDDEN");
  }
  return principal.principal_id;
}

function readOnlyWorkspaceRuntime(runtime) {
  if (!runtime || typeof runtime.findWorkspaceByCreationEvidence !== "function") {
    throw new TypeError("Workspace Runtime read-only evidence lookup is required");
  }
  return Object.freeze({
    findWorkspaceByCreationEvidence(input, options) {
      return runtime.findWorkspaceByCreationEvidence(input, options);
    }
  });
}

async function prepareProductionGovernanceComposition(input, options = {}) {
  const requestedApprovalId = exactInput(input);
  const principalId = authenticatedServicePrincipal(options.authenticatedContext);
  const approvalReader = options.approvalReader || readWorkspaceGovernanceApproval;
  if (typeof approvalReader !== "function") {
    throw new TypeError("Authoritative Governance approval reader is required");
  }
  const approval = await approvalReader(requestedApprovalId);
  if (!approval || typeof approval !== "object") {
    fail("Authoritative Governance approval is malformed", "GOVERNANCE_APPROVAL_OUTPUT_MALFORMED", 409);
  }
  if (approval.decided_by !== principalId) {
    fail("Authenticated principal does not match the durable approver", "GOVERNANCE_APPROVER_MISMATCH");
  }
  if (approval.requested_by !== principalId) {
    fail("Authenticated principal does not match the durable requester", "GOVERNANCE_REQUESTER_MISMATCH");
  }

  const handoff = await prepareGovernedWorkspaceCreationHandoff({
    authority_partition: GOVERNANCE_AUTHORITY_PARTITION,
    approval_id: requestedApprovalId,
    requester_id: principalId,
    approver_id: principalId
  }, {
    approvalReader: async ({ authority_partition, approval_id }) => {
      if (authority_partition !== GOVERNANCE_AUTHORITY_PARTITION || approval_id !== requestedApprovalId) {
        fail("Governance approval projection scope changed", "GOVERNANCE_APPROVAL_SCOPE_INVALID");
      }
      return approval;
    },
    workspaceRuntime: readOnlyWorkspaceRuntime(options.workspaceRuntime || workspaceRuntime),
    workspaceRoot: options.workspaceRoot,
    storage: options.storage
  });
  const dryRunState = handoff.dry_run.result_state;
  const dryRunsEquivalent = true;

  return deepFreeze({
    kind: "production_governance_workspace_creation_preparation",
    workspace_name: WORKSPACE_NAME,
    approval_id: requestedApprovalId,
    authority_partition: GOVERNANCE_AUTHORITY_PARTITION,
    approval_state: handoff.approval_assessment.approval_state,
    dry_run_state: dryRunState,
    dry_runs_equivalent: dryRunsEquivalent,
    dry_run: handoff.dry_run,
    dry_run_plans_equivalent: dryRunsEquivalent,
    apply_executed: false,
    workspace_created: false,
    workspace_id: null,
    mutation_allowed_by_this_endpoint: false
  });
}

module.exports = Object.freeze({
  ProductionGovernanceCompositionError,
  prepareProductionGovernanceComposition
});

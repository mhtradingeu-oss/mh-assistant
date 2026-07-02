"use strict";

const crypto = require("crypto");
const {
  getGovernancePolicy,
  listApprovals,
  createApproval
} = require("../ops/backbone");

const GOVERNANCE_APPROVAL_REQUIRED_RESPONSE = Object.freeze({
  ok: false,
  error: "forbidden",
  code: "governance_approval_required",
  message: "This backend action requires governance approval before execution."
});

const GOVERNANCE_POLICY_BLOCKED_RESPONSE = Object.freeze({
  ok: false,
  error: "forbidden",
  code: "governance_policy_blocked",
  message: "This backend action is blocked by the active governance policy."
});

const GOVERNANCE_APPROVAL_REJECTED_RESPONSE = Object.freeze({
  ok: false,
  error: "forbidden",
  code: "governance_approval_rejected",
  message: "This backend action was rejected by governance approval."
});

const ACTION_RULES = Object.freeze({
  publishing_schedule: { highRisk: true, requiresGovernance: true, requiresApproval: false, freezeSensitive: true },
  publishing_reschedule: { highRisk: true, requiresGovernance: true, requiresApproval: false, freezeSensitive: true },
  publishing_ready: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: true },
  publishing_publish: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: true },
  publishing_fail: { highRisk: true, requiresGovernance: true, requiresApproval: false, freezeSensitive: true },
  // Non-recursive by design: approvals must be decidable without requiring another approval.
  approvals_decision: { highRisk: false, requiresGovernance: true, requiresApproval: false, freezeSensitive: false },
  // Non-recursive by design: governance policy updates remain write-key + governance-checked.
  governance_policy_update: { highRisk: true, requiresGovernance: true, requiresApproval: false, freezeSensitive: false },
  workflow_run: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  ai_workflow_run: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  ai_command_run: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  ai_chat_run: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  ai_guidance_run: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  integration_connect: { highRisk: true, requiresGovernance: true, requiresApproval: false, freezeSensitive: false },
  integration_reconnect: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  integration_test: { highRisk: true, requiresGovernance: true, requiresApproval: false, freezeSensitive: false },
  integration_sync: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  integration_import_history: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  integration_disconnect: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  native_media_generate: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  execute_publish_package: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: true },
  execute_email_package: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  generate_media_from_prompt: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  build_ad_execution_package: { highRisk: true, requiresGovernance: true, requiresApproval: true, freezeSensitive: false },
  team_model_mutation: {
    highRisk: true,
    requiresGovernance: true,
    requiresApproval: true,
    freezeSensitive: false,
    policyApprovalKey: "require_approval_for_team_model_changes",
    policyBlockKey: "block_team_model_changes"
  },
  source_registry_mutation: {
    highRisk: true,
    requiresGovernance: true,
    requiresApproval: true,
    freezeSensitive: false,
    policyApprovalKey: "require_approval_for_source_registry_changes",
    policyBlockKey: "block_source_registry_changes"
  },
  project_setup_mutation: {
    highRisk: false,
    requiresGovernance: true,
    requiresApproval: false,
    freezeSensitive: false,
    policyApprovalKey: "require_approval_for_project_setup_authority_changes",
    policyBlockKey: "block_project_setup_authority_changes",
    payloadAware: true
  }
});

const HIGH_RISK_SETUP_KEY_PATTERNS = Object.freeze([
  /(^|\.)execution_mode$/i,
  /(^|\.)approval_required_actions$/i,
  /(^|\.)policy_rules/i,
  /(^|\.)governance/i,
  /(^|\.)permission/i,
  /(^|\.)role_matrix/i,
  /(^|\.)route_permissions/i,
  /(^|\.)team_model/i,
  /(^|\.)source_registry/i,
  /(^|\.)integrations?.*credential/i,
  /(^|\.)connector/i,
  /(^|\.)security/i,
  /(^|\.)write_key/i,
  /(^|\.)token/i,
  /(^|\.)secret/i,
  /(^|\.)auth/i
]);

const GOVERNANCE_APPROVAL_REDACED_KEY_PATTERN = /token|secret|key|password|credential|authorization|cookie/i;

function asString(value) {
  if (value == null) return "";
  return String(value).trim();
}

function asBoolean(value, fallback) {
  if (typeof value === "boolean") {
    return value;
  }
  if (value == null) {
    return fallback;
  }
  const normalized = asString(value).toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return Boolean(value);
}

function normalizeAction(action) {
  return asString(action).toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function getRule(action) {
  return ACTION_RULES[normalizeAction(action)] || {
    highRisk: false,
    requiresGovernance: false,
    requiresApproval: false,
    freezeSensitive: false
  };
}

function sortByNewest(items) {
  return items
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a && (a.updated_at || a.decided_at || a.created_at) || 0).getTime();
      const bTime = new Date(b && (b.updated_at || b.decided_at || b.created_at) || 0).getTime();
      return bTime - aTime;
    });
}

function findApprovedDecision(approvals, selector = {}) {
  const selectedApprovalId = asString(selector.approvalId);
  const selectedEntityType = asString(selector.entityType);
  const selectedEntityId = asString(selector.entityId);
  const selectedAction = asString(selector.requestedAction);

  const approved = sortByNewest(Array.isArray(approvals) ? approvals : [])
    .filter((entry) => {
      const status = asString(entry && entry.status).toLowerCase();
      if (!["approved", "overridden"].includes(status)) {
        return false;
      }

      if (selectedApprovalId && asString(entry && entry.id) !== selectedApprovalId) {
        return false;
      }

      if (selectedEntityType && asString(entry && entry.entity_type) !== selectedEntityType) {
        return false;
      }

      if (selectedEntityId && asString(entry && entry.entity_id) !== selectedEntityId) {
        return false;
      }

      if (selectedAction && asString(entry && entry.requested_action) !== selectedAction) {
        return false;
      }

      return true;
    });

  return approved[0] || null;
}

function buildDeniedDecision(responsePayload, reason, details = {}) {
  return {
    allowed: false,
    decision: responsePayload.code === "governance_policy_blocked" ? "policy_blocked" : "approval_required",
    reason,
    response: responsePayload,
    code: responsePayload.code,
    message: responsePayload.message,
    details
  };
}

function buildAllowedDecision(details = {}, decision = "allowed") {
  return {
    allowed: true,
    decision,
    reason: "allowed",
    response: null,
    code: null,
    message: null,
    details
  };
}

function stableStringify(value) {
  if (value == null) return JSON.stringify(null);
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function redactGovernancePayload(value, keyHint = "", depth = 0) {
  if (depth > 8) {
    return "[REDACTED]";
  }

  if (value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactGovernancePayload(item, keyHint, depth + 1));
  }

  if (typeof value !== "object") {
    if (typeof value === "string") {
      return value.length > 160 ? `${value.slice(0, 157)}...` : value;
    }
    return value;
  }

  const redacted = {};
  Object.entries(value).forEach(([key, item]) => {
    const normalizedKey = asString(key);
    if (!normalizedKey) return;
    if (GOVERNANCE_APPROVAL_REDACED_KEY_PATTERN.test(normalizedKey) || GOVERNANCE_APPROVAL_REDACED_KEY_PATTERN.test(keyHint)) {
      redacted[normalizedKey] = "[REDACTED]";
      return;
    }
    redacted[normalizedKey] = redactGovernancePayload(item, normalizedKey, depth + 1);
  });
  return redacted;
}

function buildGovernanceApprovalPayloadContext(input = {}) {
  const payload = redactGovernancePayload(input.payload || input.requestPayload || input.body || {});
  const payloadSummary = payload && typeof payload === "object" ? payload : { value: payload };
  const payloadHash = crypto.createHash("sha256").update(stableStringify(payloadSummary)).digest("hex");
  const projectName = asString(input.projectName).toLowerCase();
  const action = normalizeAction(input.action);
  const entityType = asString(input.entityType || input.entity_type || "governance_mutation");
  const entityId = asString(input.entityId || input.entity_id || action || "intended_action");
  const route = asString(input.route || input.routePath || input.path || "");
  const method = asString(input.method || "POST").toUpperCase();
  const fingerprint = crypto.createHash("sha256").update(stableStringify({
    projectName,
    action,
    entityType,
    entityId,
    route,
    method,
    payloadHash
  })).digest("hex");

  return {
    projectName,
    action,
    entityType,
    entityId,
    route,
    method,
    payloadSummary,
    payloadHash,
    approvalFingerprint: fingerprint,
    intendedActionId: fingerprint,
    linkedExecutionId: asString(input.linkedExecutionId || input.linked_execution_id) || fingerprint,
    requestedBy: asString(input.requestedBy || input.requested_by || input.actor || input.source || "control-center"),
    requestedFor: asString(input.requestedFor || input.requested_for || "admin"),
    routeTarget: asString(input.routeTarget || input.route_target || route || "governance"),
    sourcePage: asString(input.sourcePage || input.source_page || route || ""),
    serviceDomain: asString(input.serviceDomain || input.service_domain || "governance")
  };
}

function findMatchingGovernanceApproval(projectName, fingerprint, selector = {}) {
  const approvals = sortByNewest(listApprovals(projectName, { limit: 500 }) || []);
  const selectedFingerprint = asString(fingerprint);
  const selectedRoute = asString(selector.route);
  const selectedMethod = asString(selector.method).toUpperCase();
  const selectedAction = asString(selector.action);
  const selectedEntityType = asString(selector.entityType);
  const selectedEntityId = asString(selector.entityId);

  return approvals.find((item) => {
    if (selectedFingerprint && asString(item.approval_fingerprint) !== selectedFingerprint) {
      return false;
    }

    if (selectedRoute && asString(item.route) !== selectedRoute) {
      return false;
    }

    if (selectedMethod && asString(item.method).toUpperCase() !== selectedMethod) {
      return false;
    }

    if (selectedAction && normalizeAction(item.mutation_type || item.approval_type) !== selectedAction) {
      return false;
    }

    if (selectedEntityType && asString(item.entity_type) !== selectedEntityType) {
      return false;
    }

    if (selectedEntityId && asString(item.entity_id) !== selectedEntityId) {
      return false;
    }

    return true;
  }) || null;
}

function buildGovernanceApprovalResponse(approval) {
  return {
    ok: false,
    error: "approval_required",
    code: "governance_approval_required",
    message: "This backend action requires governance approval before execution.",
    approval: {
      status: "pending",
      approval_id: asString(approval && approval.id)
    }
  };
}

function buildGovernanceRejectedResponse() {
  return GOVERNANCE_APPROVAL_REJECTED_RESPONSE;
}

function issueGovernanceApprovalRequest(input = {}) {
  const context = buildGovernanceApprovalPayloadContext(input);
  const existing = findMatchingGovernanceApproval(context.projectName, context.approvalFingerprint, context);

  if (existing) {
    const status = asString(existing.status).toLowerCase();
    if (status === "approved") {
      return {
        allowed: true,
        approval: existing,
        reason: "approval_already_granted"
      };
    }

    if (status === "rejected") {
      return {
        allowed: false,
        approval: existing,
        response: buildGovernanceRejectedResponse(),
        reason: "approval_rejected"
      };
    }

    return {
      allowed: false,
      approval: existing,
      response: buildGovernanceApprovalResponse(existing),
      reason: "approval_pending"
    };
  }

  const approval = createApproval(context.projectName, {
    title: input.title || `${context.action} approval required`,
    entity_type: context.entityType,
    entity_id: context.entityId,
    mutation_type: context.action,
    route: context.route,
    method: context.method,
    approval_type: context.action,
    requested_action: context.action,
    requested_by: context.requestedBy,
    requested_for: context.requestedFor,
    source_page: context.sourcePage,
    route_target: context.routeTarget,
    service_domain: context.serviceDomain,
    risk_level: input.riskLevel || (input.highRisk ? "high" : "medium"),
    summary: input.summary || `Approval required for ${context.action}`,
    notes: input.notes || [],
    approval_fingerprint: context.approvalFingerprint,
    intended_action_id: context.intendedActionId,
    linked_execution_id: context.linkedExecutionId,
    request_payload_hash: context.payloadHash,
    request_payload_summary: context.payloadSummary,
    linked_entity: {
      entity_type: context.entityType,
      entity_id: context.entityId,
      route: context.route
    },
    actor: context.requestedBy,
    lifecycle_state: "requested",
    status: "pending"
  });

  return {
    allowed: false,
    approval,
    response: buildGovernanceApprovalResponse(approval),
    reason: "approval_created"
  };
}

function evaluateGovernanceApprovalLifecycle(input = {}) {
  const policyDecision = decideGovernanceMutation({
    ...input,
    skipApprovalGate: true
  });

  if (!policyDecision.allowed) {
    return {
      allowed: false,
      approval: null,
      response: policyDecision.response,
      reason: policyDecision.reason,
      decision: policyDecision.decision
    };
  }

  const requiresApproval = Boolean(policyDecision.details && policyDecision.details.requiresApproval);
  if (!requiresApproval) {
    return {
      allowed: true,
      approval: null,
      response: null,
      reason: policyDecision.reason,
      decision: policyDecision.decision
    };
  }

  return issueGovernanceApprovalRequest(input);
}

function collectObjectPaths(value, prefix = "", acc = [], depth = 0) {
  if (!value || typeof value !== "object" || depth > 5) {
    return acc;
  }

  Object.entries(value).forEach(([rawKey, child]) => {
    const key = asString(rawKey);
    if (!key) return;
    const nextPath = prefix ? `${prefix}.${key}` : key;
    acc.push(nextPath);

    if (child && typeof child === "object" && !Array.isArray(child)) {
      collectObjectPaths(child, nextPath, acc, depth + 1);
    }
  });

  return acc;
}

function classifyProjectSetupMutation(payload = {}) {
  const setupPayload = payload && typeof payload === "object" ? payload : {};
  const candidatePaths = collectObjectPaths(setupPayload);
  const riskyKeys = candidatePaths.filter((pathKey) =>
    HIGH_RISK_SETUP_KEY_PATTERNS.some((pattern) => pattern.test(pathKey))
  );

  return {
    highRisk: riskyKeys.length > 0,
    riskyKeys,
    safeOnly: riskyKeys.length === 0,
    checkedKeys: candidatePaths
  };
}

function decideGovernanceMutation(input = {}) {
  const action = normalizeAction(input.action);
  const projectName = asString(input.projectName).toLowerCase();
  const rule = getRule(action);
  let requiresApproval = Boolean(rule.requiresApproval);

  if (!rule.requiresGovernance) {
    return buildAllowedDecision({
      action,
      projectName,
      requiresGovernance: false,
      requiresApproval: false,
      highRisk: rule.highRisk
    }, "write_key_only_intentional");
  }

  const governance = input.governancePolicy && typeof input.governancePolicy === "object"
    ? input.governancePolicy
    : {};
  const policyRules = governance.policy_rules && typeof governance.policy_rules === "object"
    ? governance.policy_rules
    : {};

  const freezePublishing = asBoolean(policyRules.freeze_publishing, false);
  if (rule.freezeSensitive && freezePublishing) {
    return buildDeniedDecision(
      GOVERNANCE_POLICY_BLOCKED_RESPONSE,
      "freeze_publishing_enabled",
      { action, projectName }
    );
  }

  if (rule.policyBlockKey && asBoolean(policyRules[rule.policyBlockKey], false)) {
    return buildDeniedDecision(
      GOVERNANCE_POLICY_BLOCKED_RESPONSE,
      "policy_blocked_for_admin_mutation",
      { action, projectName, policy_key: rule.policyBlockKey }
    );
  }

  if (action === "project_setup_mutation") {
    const setupClassification = classifyProjectSetupMutation(input.setupPayload);
    const requiresApprovalForAuthorityChanges = asBoolean(
      policyRules.require_approval_for_project_setup_authority_changes,
      true
    );

    if (!setupClassification.highRisk) {
      return buildAllowedDecision({
        action,
        projectName,
        requiresGovernance: true,
        requiresApproval: false,
        highRisk: false,
        setupClassification
      }, "write_key_only_intentional");
    }

    if (!requiresApprovalForAuthorityChanges) {
      return buildAllowedDecision({
        action,
        projectName,
        requiresGovernance: true,
        requiresApproval: false,
        highRisk: true,
        setupClassification,
        policy_key: "require_approval_for_project_setup_authority_changes"
      }, "write_key_only_intentional");
    }

    requiresApproval = true;
  }

  if (input.skipApprovalGate === true && requiresApproval) {
    return buildAllowedDecision({
      action,
      projectName,
      requiresGovernance: true,
      requiresApproval: true,
      approvalGateDeferred: true,
      highRisk: rule.highRisk
    }, "approval_gate_deferred");
  }

  if (rule.policyApprovalKey && !asBoolean(policyRules[rule.policyApprovalKey], true)) {
    return buildAllowedDecision({
      action,
      projectName,
      requiresGovernance: true,
      requiresApproval: false,
      highRisk: rule.highRisk,
      policy_key: rule.policyApprovalKey
    }, "write_key_only_intentional");
  }

  if (!requiresApproval) {
    return buildAllowedDecision({
      action,
      projectName,
      requiresGovernance: true,
      requiresApproval: false,
      highRisk: rule.highRisk
    });
  }

  const policyLoaded = input.policyLoaded !== false;
  if (!policyLoaded && rule.highRisk) {
    return buildDeniedDecision(
      GOVERNANCE_APPROVAL_REQUIRED_RESPONSE,
      "policy_unavailable_secure_default",
      { action, projectName }
    );
  }

  const approvalSelector = {
    approvalId: input.approvalId,
    entityType: input.entityType,
    entityId: input.entityId,
    requestedAction: input.requestedAction
  };
  const hasApprovalSelector = Boolean(
    asString(approvalSelector.approvalId)
    || asString(approvalSelector.entityType)
    || asString(approvalSelector.entityId)
    || asString(approvalSelector.requestedAction)
  );

  if (!hasApprovalSelector) {
    return buildDeniedDecision(
      GOVERNANCE_APPROVAL_REQUIRED_RESPONSE,
      "missing_approval_selector",
      {
        action,
        projectName
      }
    );
  }

  const approvedDecision = findApprovedDecision(input.approvals || [], approvalSelector);

  if (!approvedDecision) {
    return buildDeniedDecision(
      GOVERNANCE_APPROVAL_REQUIRED_RESPONSE,
      "missing_approved_governance_decision",
      {
        action,
        projectName,
        selector: {
          approval_id: asString(approvalSelector.approvalId) || null,
          entity_type: asString(approvalSelector.entityType) || null,
          entity_id: asString(approvalSelector.entityId) || null,
          requested_action: asString(approvalSelector.requestedAction) || null
        }
      }
    );
  }

  return buildAllowedDecision({
    action,
    projectName,
    requiresGovernance: true,
    requiresApproval: true,
    approvedBy: asString(approvedDecision.decided_by || approvedDecision.reviewer || approvedDecision.requested_for) || null,
    approvalId: asString(approvedDecision.id) || null
  });
}

function evaluateGovernanceMutationGate(input = {}) {
  const projectName = asString(input.projectName).toLowerCase();
  const action = normalizeAction(input.action);
  let governancePolicy = null;
  let approvals = [];
  let policyLoaded = true;

  try {
    governancePolicy = getGovernancePolicy(projectName);
  } catch (_) {
    policyLoaded = false;
    governancePolicy = {};
  }

  try {
    approvals = listApprovals(projectName, { limit: 500 });
  } catch (_) {
    approvals = [];
  }

  return decideGovernanceMutation({
    ...input,
    action,
    projectName,
    policyLoaded,
    governancePolicy,
    approvals
  });
}

module.exports = {
  ACTION_RULES,
  HIGH_RISK_SETUP_KEY_PATTERNS,
  GOVERNANCE_APPROVAL_REQUIRED_RESPONSE,
  GOVERNANCE_APPROVAL_REJECTED_RESPONSE,
  GOVERNANCE_POLICY_BLOCKED_RESPONSE,
  classifyProjectSetupMutation,
  buildGovernanceApprovalPayloadContext,
  issueGovernanceApprovalRequest,
  evaluateGovernanceApprovalLifecycle,
  decideGovernanceMutation,
  evaluateGovernanceMutationGate
};

"use strict";

/**
 * Provider execution gate catalog for MH-Assistant backend.
 *
 * This module is intentionally non-enforcing in BACKEND-P1D.1.
 * It classifies provider-facing actions before any route enforcement is introduced.
 */

const PROVIDER_RISK = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
});

const PROVIDER_DECISION = Object.freeze({
  ALLOW_READ: "allow_read",
  DRY_RUN_ONLY: "dry_run_only",
  REQUIRE_APPROVAL: "require_approval",
  REQUIRE_PROVIDER_KEY: "require_provider_key",
  REQUIRE_QUEUE: "require_queue",
  BLOCK_UNTIL_CONFIGURED: "block_until_configured"
});

const PROVIDER_STATUS = Object.freeze({
  SAFE_READ: "safe_read",
  PREPARE_ONLY: "prepare_only",
  EXECUTION_GATED: "execution_gated",
  HIGH_RISK: "high_risk",
  LEGACY_REVIEW: "legacy_review"
});

const PROVIDER_RULES = Object.freeze([
  {
    provider: "ai_model",
    match: /openai|anthropic|ai\/command|ai\/chat|improve-prompt|brand-check|generate-voice-script|generate-video-brief|generate-campaign-pack/i,
    risk: PROVIDER_RISK.HIGH,
    defaultDecision: PROVIDER_DECISION.REQUIRE_APPROVAL,
    status: PROVIDER_STATUS.EXECUTION_GATED,
    requiredScope: "provider.ai.execute"
  },
  {
    provider: "native_media",
    match: /native-media|generate-image|generate_media_from_prompt|media\/generate|provider render|executeProviderRender/i,
    risk: PROVIDER_RISK.CRITICAL,
    defaultDecision: PROVIDER_DECISION.REQUIRE_QUEUE,
    status: PROVIDER_STATUS.HIGH_RISK,
    requiredScope: "provider.media.generate"
  },
  {
    provider: "email_smtp",
    match: /smtp|email|sendPreparedEmail|execute_email_package|ready_for_send|pending_provider_send/i,
    risk: PROVIDER_RISK.CRITICAL,
    defaultDecision: PROVIDER_DECISION.REQUIRE_APPROVAL,
    status: PROVIDER_STATUS.EXECUTION_GATED,
    requiredScope: "provider.email.send"
  },
  {
    provider: "woocommerce",
    match: /woocommerce|woo|product|publish-clone|replace-original-product|rollback-product|cleanup-clone|backup-and-clone-product/i,
    risk: PROVIDER_RISK.CRITICAL,
    defaultDecision: PROVIDER_DECISION.REQUIRE_APPROVAL,
    status: PROVIDER_STATUS.LEGACY_REVIEW,
    requiredScope: "provider.commerce.write"
  },
  {
    provider: "publishing",
    match: /publishing|publish|schedule|reschedule|ready|fail|execute_publish_package/i,
    risk: PROVIDER_RISK.HIGH,
    defaultDecision: PROVIDER_DECISION.REQUIRE_QUEUE,
    status: PROVIDER_STATUS.EXECUTION_GATED,
    requiredScope: "provider.publishing.execute"
  },
  {
    provider: "integrations",
    match: /integration|connect|reconnect|disconnect|sync|import-history|adapter-manager|executeAdapterAction/i,
    risk: PROVIDER_RISK.HIGH,
    defaultDecision: PROVIDER_DECISION.REQUIRE_PROVIDER_KEY,
    status: PROVIDER_STATUS.EXECUTION_GATED,
    requiredScope: "provider.integration.write"
  },
  {
    provider: "social",
    match: /meta|facebook|instagram|tiktok|google|ads/i,
    risk: PROVIDER_RISK.HIGH,
    defaultDecision: PROVIDER_DECISION.BLOCK_UNTIL_CONFIGURED,
    status: PROVIDER_STATUS.HIGH_RISK,
    requiredScope: "provider.social.write"
  }
]);

function normalizeAction(value) {
  return String(value || "");
}

function findProviderRule(value) {
  const action = normalizeAction(value);
  return PROVIDER_RULES.find((rule) => rule.match.test(action)) || {
    provider: "general",
    risk: PROVIDER_RISK.MEDIUM,
    defaultDecision: PROVIDER_DECISION.DRY_RUN_ONLY,
    status: PROVIDER_STATUS.PREPARE_ONLY,
    requiredScope: "provider.general.prepare"
  };
}

function isProviderExecutionAction(value) {
  const action = normalizeAction(value);
  return /send|execute|publish|generate|connect|disconnect|sync|import-history|rollback|replace|cleanup|spawn|exec/i.test(action);
}

function classifyProviderAction(value, options = {}) {
  const action = normalizeAction(value);
  const rule = findProviderRule(action);
  const execution = isProviderExecutionAction(action);
  const dryRun = options.dryRun === true || options.mode === "dry-run";
  const configured = options.configured === true;
  const approved = options.approved === true;

  let decision = rule.defaultDecision;
  let allowed = false;
  let reason = "provider_execution_requires_gate";

  if (!execution) {
    decision = PROVIDER_DECISION.ALLOW_READ;
    allowed = true;
    reason = "provider_read_or_prepare_action";
  } else if (dryRun) {
    decision = PROVIDER_DECISION.DRY_RUN_ONLY;
    allowed = true;
    reason = "dry_run_allowed";
  } else if (rule.defaultDecision === PROVIDER_DECISION.REQUIRE_PROVIDER_KEY && configured) {
    allowed = true;
    reason = "provider_key_configured";
  } else if (rule.defaultDecision === PROVIDER_DECISION.REQUIRE_APPROVAL && approved && configured) {
    allowed = true;
    reason = "approved_and_configured";
  } else if (rule.defaultDecision === PROVIDER_DECISION.REQUIRE_QUEUE && approved && configured) {
    allowed = true;
    reason = "queued_execution_approved_and_configured";
  } else if (rule.defaultDecision === PROVIDER_DECISION.BLOCK_UNTIL_CONFIGURED) {
    allowed = false;
    reason = "blocked_until_configured";
  }

  return {
    action,
    provider: rule.provider,
    risk: rule.risk,
    status: rule.status,
    execution,
    allowed,
    decision,
    requiredScope: rule.requiredScope,
    reason,
    auditEvent: `${rule.provider}.${execution ? "execute" : "read"}.${allowed ? "allowed" : "gated"}`
  };
}

function buildProviderGateResponse(classification) {
  return {
    ok: false,
    error: "provider_execution_gated",
    message: "Provider execution is gated until configuration, approval, and audit requirements are satisfied.",
    provider: classification.provider,
    decision: classification.decision,
    requiredScope: classification.requiredScope,
    reason: classification.reason
  };
}

module.exports = {
  PROVIDER_RISK,
  PROVIDER_DECISION,
  PROVIDER_STATUS,
  PROVIDER_RULES,
  classifyProviderAction,
  buildProviderGateResponse,
  isProviderExecutionAction
};

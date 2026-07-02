"use strict";

let orchestratorGovernance = null;

try {
  orchestratorGovernance = require("./orchestrator-service/lib/security/governance-mutation-gate");
} catch (_) {
  orchestratorGovernance = null;
}

function normalizeAction(action) {
  return String(action || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

class GovernanceCore {
  constructor() {
    this.mode = "CONTROLLED";
  }

  setMode(mode) {
    this.mode = String(mode || "CONTROLLED").trim().toUpperCase();
    return this.mode;
  }

  getRules() {
    return orchestratorGovernance?.ACTION_RULES || {};
  }

  assessRisk(intent = {}) {
    const action = normalizeAction(intent.action || intent.type);
    const rule = this.getRules()[action];

    if (rule?.highRisk || rule?.requiresApproval) {
      return { level: "HIGH", source: "orchestrator_governance_rule" };
    }

    if (["publish", "campaign", "media", "ai_generate_media", "publish_campaign"].includes(action)) {
      return { level: action === "publish" || action === "publish_campaign" ? "HIGH" : "MEDIUM", source: "core_fallback_rule" };
    }

    return { level: "LOW", source: "core_default_rule" };
  }

  predict(intent = {}) {
    const risk = this.assessRisk(intent);

    return {
      predictedRisk: `${risk.level}_RISK`,
      requiresApproval: risk.level !== "LOW",
      confidence: risk.source === "orchestrator_governance_rule" ? 0.98 : 0.91
    };
  }

  evaluate(intent = {}) {
    const risk = this.assessRisk(intent);
    const action = normalizeAction(intent.action || intent.type);
    const rule = this.getRules()[action] || {};
    const requiresGovernance = Boolean(rule.requiresGovernance || risk.level === "HIGH" || intent.forceApproval);
    const requiresApproval = Boolean(rule.requiresApproval || intent.forceApproval || (requiresGovernance && risk.level === "HIGH"));

    return {
      intent,
      action,
      risk,
      decision: this.decide({ risk, requiresApproval }),
      requiresGovernance,
      requiresApproval,
      mode: this.mode
    };
  }

  decide(input = {}) {
    if (this.mode === "SAFE") return "BLOCK";
    if (this.mode === "AUTONOMOUS") return "ALLOW";
    if (input.requiresApproval || input.risk?.level === "HIGH") return "REQUEST_APPROVAL";
    return "ALLOW";
  }

  process(intent = {}) {
    const prediction = this.predict(intent);
    const evaluation = this.evaluate(intent);

    return {
      intent,
      prediction,
      evaluation,
      allowed: evaluation.decision === "ALLOW",
      finalDecision: this.resolve(evaluation, prediction),
      status: "GOVERNANCE_CORE_ACTIVE"
    };
  }

  resolve(evaluation = {}, prediction = {}) {
    if (evaluation.decision === "BLOCK") return "BLOCKED_BY_GOVERNANCE_CORE";
    if (evaluation.requiresApproval || prediction.requiresApproval) return "ROUTE_TO_GOVERNANCE";
    return "EXECUTE_BACKEND";
  }

  evaluateMutation(input = {}) {
    if (typeof orchestratorGovernance?.evaluateGovernanceMutationGate === "function") {
      return orchestratorGovernance.evaluateGovernanceMutationGate(input);
    }
    return this.process(input);
  }

  evaluateGovernanceMutationGate(input = {}) {
    return this.evaluateMutation(input);
  }

  evaluateGovernanceApprovalLifecycle(input = {}) {
    if (typeof orchestratorGovernance?.evaluateGovernanceApprovalLifecycle === "function") {
      return orchestratorGovernance.evaluateGovernanceApprovalLifecycle(input);
    }
    return this.process(input);
  }

  interpret(response) {
    if (!response) return { status: "UNKNOWN" };
    if (response.allowed === false) {
      return {
        status: "BLOCKED",
        reason: response.reason,
        code: response.code,
        action: this.adapt(response)
      };
    }
    return {
      status: "ALLOWED",
      data: response
    };
  }

  adapt(response = {}) {
    switch (response.reason) {
      case "approval_required":
      case "missing_approved_governance_decision":
        return "REQUEST_APPROVAL_FLOW";
      case "mutation_denied":
      case "governance_policy_blocked":
        return "SWITCH_TO_SAFE_MODE";
      case "publishing_blocked":
        return "QUEUE_FOR_REVIEW";
      default:
        return "ESCALATE_TO_USER";
    }
  }
}

const governanceCore = new GovernanceCore();

module.exports = governanceCore;
module.exports.GovernanceCore = GovernanceCore;

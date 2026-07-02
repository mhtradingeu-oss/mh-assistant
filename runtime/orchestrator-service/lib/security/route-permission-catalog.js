"use strict";

/**
 * Route permission catalog for MH-Assistant backend.
 *
 * This module is intentionally non-enforcing in P1B.1.
 * It creates a single source of truth for route risk classification before
 * enforcement is introduced in later phases.
 */

const ROUTE_RISK = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
});

const ROUTE_ACCESS = Object.freeze({
  PUBLIC: "public",
  READ_KEY: "read_key",
  WRITE_KEY: "write_key",
  ADMIN: "admin",
  SERVICE: "service",
  FUTURE_RBAC: "future_rbac"
});

const ROUTE_STATUS = Object.freeze({
  ACTIVE: "active",
  COMPATIBILITY_ALIAS: "compatibility_alias",
  DEPRECATE: "deprecate",
  RETIRE: "retire",
  FUTURE: "future"
});

const DOMAIN_RULES = Object.freeze([
  {
    domain: "customer_operations",
    match: /customer-operations|customer|conversation|message|ticket|crm|call|ivr|whatsapp|sms/i,
    defaultReadScope: "customer.read",
    defaultWriteScope: "customer.write",
    dataRisk: ROUTE_RISK.CRITICAL,
    providerRisk: ROUTE_RISK.MEDIUM,
    destructiveRisk: ROUTE_RISK.HIGH
  },
  {
    domain: "publishing",
    match: /publishing|publish|approval|governance|claim|compliance/i,
    defaultReadScope: "publishing.read",
    defaultWriteScope: "publishing.write",
    dataRisk: ROUTE_RISK.HIGH,
    providerRisk: ROUTE_RISK.CRITICAL,
    destructiveRisk: ROUTE_RISK.HIGH
  },
  {
    domain: "integrations",
    match: /integration|provider|connector|oauth|token/i,
    defaultReadScope: "integration.read",
    defaultWriteScope: "integration.write",
    dataRisk: ROUTE_RISK.HIGH,
    providerRisk: ROUTE_RISK.CRITICAL,
    destructiveRisk: ROUTE_RISK.MEDIUM
  },
  {
    domain: "ai_execution",
    match: /ai\/command|ai\/chat|ai\/guidance|ai\/workflows|openai|anthropic|assistant/i,
    defaultReadScope: "ai.read",
    defaultWriteScope: "ai.execute",
    dataRisk: ROUTE_RISK.HIGH,
    providerRisk: ROUTE_RISK.HIGH,
    destructiveRisk: ROUTE_RISK.MEDIUM
  },
  {
    domain: "workflow_operations",
    match: /workflow|task|queue|job|notification|handoff|event/i,
    defaultReadScope: "operations.read",
    defaultWriteScope: "operations.write",
    dataRisk: ROUTE_RISK.MEDIUM,
    providerRisk: ROUTE_RISK.MEDIUM,
    destructiveRisk: ROUTE_RISK.MEDIUM
  },
  {
    domain: "media_library",
    match: /media|asset|library|source|upload|generated-output/i,
    defaultReadScope: "media.read",
    defaultWriteScope: "media.write",
    dataRisk: ROUTE_RISK.MEDIUM,
    providerRisk: ROUTE_RISK.MEDIUM,
    destructiveRisk: ROUTE_RISK.HIGH
  },
  {
    domain: "commerce_legacy",
    match: /woocommerce|product|clone|rollback|cleanup|blog/i,
    defaultReadScope: "commerce.read",
    defaultWriteScope: "commerce.write",
    dataRisk: ROUTE_RISK.HIGH,
    providerRisk: ROUTE_RISK.CRITICAL,
    destructiveRisk: ROUTE_RISK.CRITICAL
  },
  {
    domain: "project_setup",
    match: /project|setup|template|rename|storage|parity/i,
    defaultReadScope: "project.read",
    defaultWriteScope: "project.write",
    dataRisk: ROUTE_RISK.MEDIUM,
    providerRisk: ROUTE_RISK.LOW,
    destructiveRisk: ROUTE_RISK.MEDIUM
  },
  {
    domain: "platform_health",
    match: /health|healthz|readyz/i,
    defaultReadScope: "platform.health",
    defaultWriteScope: "platform.admin",
    dataRisk: ROUTE_RISK.LOW,
    providerRisk: ROUTE_RISK.LOW,
    destructiveRisk: ROUTE_RISK.LOW
  }
]);

function normalizeMethod(method) {
  return String(method || "GET").toUpperCase();
}

function isMutationMethod(method) {
  return ["POST", "PATCH", "PUT", "DELETE"].includes(normalizeMethod(method));
}

function isPublicAlias(pathname) {
  return String(pathname || "").startsWith("/public/");
}

function isDestructiveRoute(method, pathname) {
  const value = `${normalizeMethod(method)} ${pathname || ""}`;
  return /DELETE|delete|archive|remove|destroy|purge|replace-original|cleanup|rollback|disconnect/i.test(value);
}

function isProviderExecutionRoute(pathname) {
  return /publish|send|provider|integration|native-media|generate|openai|anthropic|workflow|scheduler|woocommerce|email|smtp|twilio|telnyx/i.test(
    String(pathname || "")
  );
}

function findDomainRule(pathname) {
  const value = String(pathname || "");
  return DOMAIN_RULES.find((rule) => rule.match.test(value)) || {
    domain: "general",
    defaultReadScope: "general.read",
    defaultWriteScope: "general.write",
    dataRisk: ROUTE_RISK.MEDIUM,
    providerRisk: ROUTE_RISK.LOW,
    destructiveRisk: ROUTE_RISK.LOW
  };
}

function classifyRoute(method, pathname) {
  const normalizedMethod = normalizeMethod(method);
  const routePath = String(pathname || "");
  const mutation = isMutationMethod(normalizedMethod);
  const publicAlias = isPublicAlias(routePath);
  const destructive = isDestructiveRoute(normalizedMethod, routePath);
  const providerExecution = isProviderExecutionRoute(routePath);
  const domainRule = findDomainRule(routePath);

  let requiredAccess = mutation ? ROUTE_ACCESS.WRITE_KEY : ROUTE_ACCESS.READ_KEY;
  let status = publicAlias ? ROUTE_STATUS.COMPATIBILITY_ALIAS : ROUTE_STATUS.ACTIVE;

  if (domainRule.domain === "platform_health" && !mutation) {
    requiredAccess = ROUTE_ACCESS.PUBLIC;
  }

  if (publicAlias && mutation) {
    status = ROUTE_STATUS.DEPRECATE;
  }

  if (publicAlias && /customer-operations|publishing|integration|governance|approval|sources/i.test(routePath)) {
    status = mutation ? ROUTE_STATUS.RETIRE : ROUTE_STATUS.DEPRECATE;
  }

  const requiredScope = mutation ? domainRule.defaultWriteScope : domainRule.defaultReadScope;
  const auditEvent = `${domainRule.domain}.${mutation ? "mutation" : "read"}.${publicAlias ? "public_alias" : "canonical"}`;

  return {
    method: normalizedMethod,
    route: routePath,
    domain: domainRule.domain,
    readWrite: mutation ? "write" : "read",
    publicAlias,
    requiredAccess,
    requiredScope,
    status,
    dataRisk: domainRule.dataRisk,
    providerRisk: providerExecution ? domainRule.providerRisk : ROUTE_RISK.LOW,
    destructiveRisk: destructive ? domainRule.destructiveRisk : ROUTE_RISK.LOW,
    providerExecution,
    destructive,
    auditEvent,
    recommendation: buildRecommendation({
      publicAlias,
      mutation,
      destructive,
      providerExecution,
      domain: domainRule.domain
    })
  };
}

function buildRecommendation({ publicAlias, mutation, destructive, providerExecution, domain }) {
  if (publicAlias && mutation) return "retire_public_mutation_alias";
  if (publicAlias) return "deprecate_public_read_alias";
  if (destructive) return "require_dual_confirmation_and_audit";
  if (providerExecution) return "require_provider_scope_audit_and_idempotency";
  if (domain === "customer_operations") return "require_pii_scope_and_access_log";
  if (mutation) return "require_write_scope_and_audit";
  return "keep_with_read_scope";
}

module.exports = {
  ROUTE_RISK,
  ROUTE_ACCESS,
  ROUTE_STATUS,
  DOMAIN_RULES,
  classifyRoute,
  isMutationMethod,
  isPublicAlias,
  isDestructiveRoute,
  isProviderExecutionRoute
};

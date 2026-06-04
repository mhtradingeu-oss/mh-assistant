"use strict";

const { classifyRoute } = require("./route-permission-catalog");
const { classifyProviderAction } = require("./provider-execution-gate");

const MUTATION_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

const SENSITIVE_MUTATION_ROUTE_PATTERNS = [
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/ai\/(?:command|chat|guidance)(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/ai\/workflows\/[^/]+\/run(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/workflows\/[^/]+\/run(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/approvals(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/approvals\/[^/]+\/decision(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/governance\/policy(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/integrations\/[^/]+\/(?:connect|reconnect|test|sync|import-history|disconnect)(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/publishing\/schedule(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/publishing\/[^/]+\/(?:reschedule|ready|publish|fail)(?:\/)?$/i,
  /^\/(?:public\/)?media-manager\/project\/[^/]+\/native-media\/generate(?:\/)?$/i,
  /^\/execute_publish_package(?:\/)?$/i,
  /^\/execute_email_package(?:\/)?$/i,
  /^\/generate_media_from_prompt(?:\/)?$/i,
  /^\/build_ad_execution_package(?:\/)?$/i,
  /^\/api\/media\//i
];

function normalizeMethod(method) {
  return String(method || "GET").trim().toUpperCase();
}

function normalizePath(pathname) {
  return String(pathname || "").trim();
}

function isMutationMethod(method) {
  return MUTATION_METHODS.has(normalizeMethod(method));
}

function isPublicMutationAlias(method, pathname) {
  return isMutationMethod(method) && /^\/public\//i.test(normalizePath(pathname));
}

function isSensitiveMutationRoute(method, pathname) {
  if (!isMutationMethod(method)) {
    return false;
  }

  if (isPublicMutationAlias(method, pathname)) {
    return true;
  }

  const routePath = normalizePath(pathname);
  if (!routePath) {
    return false;
  }

  return SENSITIVE_MUTATION_ROUTE_PATTERNS.some((pattern) => pattern.test(routePath));
}

function buildRoutePermissionDeniedResponse() {
  return {
    ok: false,
    error: "forbidden",
    code: "route_permission_denied",
    message: "This backend action requires authorization."
  };
}

function classifyRuntimeSecurityDecision(input = {}) {
  const method = normalizeMethod(input.method);
  const routePath = normalizePath(input.routePath);
  const hasAuthorizedWriteKey = Boolean(input.hasAuthorizedWriteKey);

  const routeClassification = classifyRoute(method, routePath);
  const sensitiveMutation = isSensitiveMutationRoute(method, routePath);

  if (!sensitiveMutation) {
    return {
      enforced: false,
      allowed: true,
      reason: "not_sensitive_scope",
      routeClassification,
      providerClassification: null
    };
  }

  const requiresWriteAuthorization = routeClassification.requiredAccess !== "public";
  if (requiresWriteAuthorization && !hasAuthorizedWriteKey) {
    return {
      enforced: true,
      allowed: false,
      reason: "missing_route_authorization",
      routeClassification,
      providerClassification: null
    };
  }

  const providerClassification = classifyProviderAction(routePath, {
    configured: hasAuthorizedWriteKey,
    approved: hasAuthorizedWriteKey,
    mode: input.mode
  });

  if (providerClassification.execution && !providerClassification.allowed) {
    return {
      enforced: true,
      allowed: false,
      reason: "provider_execution_gated",
      routeClassification,
      providerClassification
    };
  }

  return {
    enforced: true,
    allowed: true,
    reason: "authorized",
    routeClassification,
    providerClassification
  };
}

function createRuntimeSecurityEnforcementMiddleware(options = {}) {
  const logger = options.logger || console;
  const readProvidedControlWriteKey =
    typeof options.readProvidedControlWriteKey === "function"
      ? options.readProvidedControlWriteKey
      : () => "";
  const controlWriteKeyMatches =
    typeof options.controlWriteKeyMatches === "function"
      ? options.controlWriteKeyMatches
      : () => false;
  const controlWriteKeyEnv = String(options.controlWriteKeyEnv || "MH_CONTROL_CENTER_WRITE_KEY").trim();

  return function runtimeSecurityEnforcement(req, res, next) {
    const expectedKey = String(process.env[controlWriteKeyEnv] || "").trim();
    const providedKey = readProvidedControlWriteKey(req);
    const hasAuthorizedWriteKey = Boolean(expectedKey)
      && Boolean(providedKey)
      && controlWriteKeyMatches(expectedKey, providedKey);

    const decision = classifyRuntimeSecurityDecision({
      method: req.method,
      routePath: req.path,
      mode: req.body && typeof req.body === "object" ? req.body.mode : undefined,
      hasAuthorizedWriteKey
    });

    if (!decision.enforced || decision.allowed) {
      return next();
    }

    logger.warn("runtime_security_enforcement_denied", {
      route: req.path,
      action: "runtime_security_enforcement",
      method: req.method,
      reason: decision.reason,
      route_domain: decision.routeClassification && decision.routeClassification.domain,
      route_scope: decision.routeClassification && decision.routeClassification.requiredScope,
      provider: decision.providerClassification && decision.providerClassification.provider,
      provider_decision: decision.providerClassification && decision.providerClassification.decision
    });

    return res.status(403).json(buildRoutePermissionDeniedResponse());
  };
}

module.exports = {
  SENSITIVE_MUTATION_ROUTE_PATTERNS,
  isPublicMutationAlias,
  isSensitiveMutationRoute,
  buildRoutePermissionDeniedResponse,
  classifyRuntimeSecurityDecision,
  createRuntimeSecurityEnforcementMiddleware
};

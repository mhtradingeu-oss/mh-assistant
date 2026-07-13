"use strict";

/**
 * Passive MH-OS identity adapter.
 *
 * This module consumes authentication outcomes established elsewhere. It does
 * not inspect credentials, authorize requests, resolve roles, or replace any
 * existing runtime gate.
 */

const AUTHORITY_CONTEXT_VERSION = "mh-authority-context-v1";
const LEGACY_CONTROL_KEY_PRINCIPAL_ID = "legacy-control-center-key";
const MAX_EVIDENCE_DEPTH = 6;
const MAX_EVIDENCE_ITEMS = 50;
const MAX_TEXT_LENGTH = 500;

const ALLOWED_AUTHENTICATION_SOURCES = new Set([
  "control_key_header",
  "bearer",
  "existing_control_key_guard",
  "protected_write_key_guard",
  "protected_read_key_guard",
  "runtime_security_enforcement"
]);

const BLOCKED_EVIDENCE_KEY_PATTERN = /(?:actor|user_?id|session_?id|cookie|authorization|credential|password|secret|token|api_?key|access_?key|control_?key|write_?key|read_?key)/i;
const SENSITIVE_TEXT_PATTERNS = [
  /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi,
  /\b(?:api[_-]?key|access[_-]?key|control[_-]?key|write[_-]?key|read[_-]?key|token|secret|password)\s*[:=]\s*[^\s,;]+/gi,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g
];

function safeText(value, fallback = "") {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return fallback;
  }

  let text = String(value).trim().slice(0, MAX_TEXT_LENGTH);
  SENSITIVE_TEXT_PATTERNS.forEach((pattern) => {
    text = text.replace(pattern, "[REDACTED]");
  });
  return text || fallback;
}

function normalizeAuthenticationSource(value) {
  const source = safeText(value).toLowerCase();
  return ALLOWED_AUTHENTICATION_SOURCES.has(source)
    ? source
    : "existing_control_key_guard";
}

function createLegacyControlKeyAssertion(result = {}) {
  const authenticated =
  result &&
  result.authenticated === true &&
  result.validated_by_existing_guard === true;

  if (!authenticated) {
    return Object.freeze({
      principal_id: null,
      principal_type: null,
      authenticated: false,
      authentication_method: "none",
      source: "none"
    });
  }

  return Object.freeze({
    principal_id: LEGACY_CONTROL_KEY_PRINCIPAL_ID,
    principal_type: "service",
    authenticated: true,
    authentication_method: "control_key",
    source: normalizeAuthenticationSource(result.source)
  });
}

function sanitizeAuthorityEvidence(value, depth = 0) {
  if (depth > MAX_EVIDENCE_DEPTH || value == null) {
    return value == null ? null : "[TRUNCATED]";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return typeof value === "string" ? safeText(value) : value;
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_EVIDENCE_ITEMS)
      .map((item) => sanitizeAuthorityEvidence(item, depth + 1));
  }

  if (typeof value !== "object") {
    return null;
  }

  return Object.entries(value).reduce((sanitized, [rawKey, item]) => {
    const key = safeText(rawKey);
    if (!key || BLOCKED_EVIDENCE_KEY_PATTERN.test(key)) {
      return sanitized;
    }

    sanitized[key] = sanitizeAuthorityEvidence(item, depth + 1);
    return sanitized;
  }, {});
}

function normalizePrincipal(assertion) {
  if (!assertion || assertion.authenticated !== true) {
    return createLegacyControlKeyAssertion({ authenticated: false });
  }

  return createLegacyControlKeyAssertion({
    authenticated: true,
    validated_by_existing_guard: true,
    source: assertion.source
  });
}

function createAuthorityContext(input = {}) {
  const principal = normalizePrincipal(input.principal || input.identity_assertion);
  const projectId = input.project_id == null ? null : safeText(input.project_id) || null;
  const evidenceReferences = Array.isArray(input.evidence_references)
    ? sanitizeAuthorityEvidence(input.evidence_references)
    : [];
  const shadowObservations = Array.isArray(input.shadow_observations)
    ? sanitizeAuthorityEvidence(input.shadow_observations).slice(0, MAX_EVIDENCE_ITEMS)
    : [];

  return {
    version: AUTHORITY_CONTEXT_VERSION,
    mode: "shadow",
    principal,
    workspace_id: null,
    project_id: projectId,
    roles: [],
    permissions: [],
    authentication_source: principal.authenticated ? principal.source : "none",
    governance_decision: null,
    provider_decision: null,
    decision_context: {
      existing_runtime: sanitizeAuthorityEvidence(
        input.decision_context && input.decision_context.existing_runtime
      ) || {}
    },
    evidence_references: evidenceReferences,
    shadow_observations: shadowObservations
  };
}

function attachAuthorityContext(req, input = {}) {
  const context = createAuthorityContext(input);

  if (req && typeof req === "object") {
    req.mhAuthorityContext = context;
  }

  return context;
}

function recordShadowObservation(context, observation = {}) {
  const current = createAuthorityContext(context || {});
  const sanitizedObservation = sanitizeAuthorityEvidence(observation) || {};
  const shadowObservation = {
    ...sanitizedObservation,
    mode: "shadow",
    authoritative: false
  };

  return createAuthorityContext({
    ...current,
    shadow_observations: [
      ...current.shadow_observations,
      shadowObservation
    ].slice(-MAX_EVIDENCE_ITEMS)
  });
}

module.exports = {
  createLegacyControlKeyAssertion,
  createAuthorityContext,
  attachAuthorityContext,
  sanitizeAuthorityEvidence,
  recordShadowObservation
};

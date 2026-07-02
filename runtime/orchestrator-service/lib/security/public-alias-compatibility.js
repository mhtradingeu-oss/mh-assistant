"use strict";

/**
 * Public alias compatibility helper for MH-Assistant backend.
 *
 * This module is intentionally non-enforcing in BACKEND-P1C.2.
 * It centralizes environment flag parsing and public alias risk decisions.
 */

const DEFAULT_BLOCKED_PUBLIC_ALIAS_METHODS = Object.freeze(["POST", "PATCH", "PUT", "DELETE"]);

function normalizeMethod(method) {
  return String(method || "GET").toUpperCase();
}

function normalizePath(pathname) {
  return String(pathname || "");
}

function isPublicAliasPath(pathname) {
  return normalizePath(pathname).startsWith("/public/");
}

function readBooleanEnv(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on", "enabled"].includes(String(value).trim().toLowerCase());
}

function publicAliasCompatibilityEnabled() {
  return readBooleanEnv("MH_PUBLIC_ALIAS_COMPATIBILITY", true);
}

function blockCriticalPublicMutationsEnabled() {
  return readBooleanEnv("MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES", false);
}

function isProductionMode(options = {}) {
  if (typeof options.productionMode === "boolean") {
    return options.productionMode;
  }

  return String(process.env.NODE_ENV || "").trim().toLowerCase() === "production";
}

function isCriticalPublicAlias(pathname) {
  const value = normalizePath(pathname);
  return /customer-operations|integrations|publishing|governance|approvals|sources|workflows|ai\/workflows/i.test(value);
}

function isMutationMethod(method) {
  return DEFAULT_BLOCKED_PUBLIC_ALIAS_METHODS.includes(normalizeMethod(method));
}

function isPublicSensitiveMutationPath(pathname) {
  const value = normalizePath(pathname);
  return /ai\/|native-media|api\/media|execute_|generate_media_from_prompt|build_ad_execution_package|integrations|publishing|governance|approvals|sources|workflows/i.test(value);
}

function classifyPublicAliasAccess(method, pathname, options = {}) {
  const normalizedMethod = normalizeMethod(method);
  const normalizedPath = normalizePath(pathname);
  const publicAlias = isPublicAliasPath(normalizedPath);
  const mutation = isMutationMethod(normalizedMethod);
  const critical = publicAlias && isCriticalPublicAlias(normalizedPath);
  const sensitiveMutation = publicAlias && mutation && isPublicSensitiveMutationPath(normalizedPath);
  const hasAuthorizedWriteKey = options.hasAuthorizedWriteKey === true;

  if (!publicAlias) {
    return {
      publicAlias: false,
      allowed: true,
      status: "canonical",
      reason: "canonical_route"
    };
  }

  if (!publicAliasCompatibilityEnabled()) {
    return {
      publicAlias: true,
      allowed: false,
      status: "blocked",
      reason: "public_alias_compatibility_disabled",
      code: "public_alias_retired"
    };
  }

  if (mutation && isProductionMode(options) && !hasAuthorizedWriteKey) {
    return {
      publicAlias: true,
      allowed: false,
      status: "blocked_sensitive_mutation_unauthorized",
      reason: "public_alias_mutation_requires_authorization",
      code: "route_permission_denied"
    };
  }

  if (mutation && critical && blockCriticalPublicMutationsEnabled()) {
    return {
      publicAlias: true,
      allowed: false,
      status: "blocked",
      reason: "critical_public_mutation_alias_blocked",
      code: "route_permission_denied"
    };
  }

  if (mutation && critical) {
    return {
      publicAlias: true,
      allowed: true,
      status: "compatibility_critical",
      reason: "critical_public_mutation_alias_compatibility_enabled"
    };
  }

  if (mutation) {
    return {
      publicAlias: true,
      allowed: true,
      status: sensitiveMutation ? "compatibility_sensitive_write" : "compatibility_write",
      reason: sensitiveMutation
        ? "sensitive_public_write_alias_compatibility_enabled"
        : "public_write_alias_compatibility_enabled"
    };
  }

  if (critical) {
    return {
      publicAlias: true,
      allowed: true,
      status: "compatibility_sensitive_read",
      reason: "sensitive_public_read_alias_compatibility_enabled"
    };
  }

  return {
    publicAlias: true,
    allowed: true,
    status: "compatibility_read",
    reason: "public_read_alias_compatibility_enabled"
  };
}

function buildPublicAliasHeaders(classification) {
  if (!classification || !classification.publicAlias) return {};

  return {
    "X-MH-Public-Alias": "true",
    "X-MH-Public-Alias-Status": classification.status,
    "X-MH-Public-Alias-Reason": classification.reason,
    "Deprecation": "true"
  };
}

module.exports = {
  normalizeMethod,
  normalizePath,
  isPublicAliasPath,
  isCriticalPublicAlias,
  isMutationMethod,
  isPublicSensitiveMutationPath,
  readBooleanEnv,
  publicAliasCompatibilityEnabled,
  blockCriticalPublicMutationsEnabled,
  isProductionMode,
  classifyPublicAliasAccess,
  buildPublicAliasHeaders
};

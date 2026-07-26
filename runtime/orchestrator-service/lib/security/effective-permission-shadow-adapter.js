"use strict";

const crypto = require("node:crypto");

const {
  EFFECTIVE_PERMISSION_CONTRACT_VERSION,
  EVALUATION_MODE,
  ENFORCEMENT_EFFECT,
  OUTCOMES,
  REASON_CODES,
  SUPPORTED_ROUTE_CONTRACT,
  resolveEffectivePermission
} = require("./effective-permission-resolver");

const SHADOW_ADAPTER_VERSION =
  "selected-route-shadow-adapter/v1";

const SELECTED_ROUTE_TEMPLATE =
  "/media-manager/project/:project/customer-operations/health";

const PUBLIC_ALIAS_TEMPLATE =
  "/public/media-manager/project/:project/customer-operations/health";

const SELECTED_ROUTE_CONTRACT_ID =
  "customer-operations.health.get/v1";

const ADMISSION_REASONS = Object.freeze({
  CANONICAL_ROUTE_ADMITTED:
    "CANONICAL_ROUTE_ADMITTED",

  SHADOW_DISABLED:
    "SHADOW_DISABLED",

  KILL_SWITCH_ENGAGED:
    "KILL_SWITCH_ENGAGED",

  METHOD_EXCLUDED:
    "METHOD_EXCLUDED",

  PUBLIC_ALIAS_EXCLUDED:
    "PUBLIC_ALIAS_EXCLUDED",

  ROUTE_TEMPLATE_UNSUPPORTED:
    "ROUTE_TEMPLATE_UNSUPPORTED",

  ROUTE_CONTRACT_UNSUPPORTED:
    "ROUTE_CONTRACT_UNSUPPORTED",

  PROJECT_CONTEXT_UNESTABLISHED:
    "PROJECT_CONTEXT_UNESTABLISHED",

  ROUTE_CLASSIFICATION_UNESTABLISHED:
    "ROUTE_CLASSIFICATION_UNESTABLISHED",

  ROUTE_CLASSIFICATION_MISMATCH:
    "ROUTE_CLASSIFICATION_MISMATCH",

  RESOLVER_BOUNDARY_VIOLATION:
    "RESOLVER_BOUNDARY_VIOLATION",

  RESOLVER_POSITIVE_OUTCOME_FORBIDDEN:
    "RESOLVER_POSITIVE_OUTCOME_FORBIDDEN"
});

const REQUIRED_ROUTE_CLASSIFICATION = Object.freeze({
  domain: "customer_operations",
  required_access: "read_key",
  required_scope: "customer.read",
  public_alias: false
});

function isPlainObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function safeText(value, maximumLength = 240) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maximumLength);
}

function upperText(value) {
  return safeText(value).toUpperCase();
}

function normalizeTimestamp(value) {
  const text = safeText(value, 80);

  if (!text) {
    return "1970-01-01T00:00:00.000Z";
  }

  const milliseconds = Date.parse(text);

  if (!Number.isFinite(milliseconds)) {
    return "1970-01-01T00:00:00.000Z";
  }

  return new Date(milliseconds).toISOString();
}

function normalizeProjectSlug(value) {
  const text = safeText(value, 80)
    .toLowerCase();

  if (
    !/^[a-z0-9][a-z0-9._-]{0,79}$/.test(
      text
    )
  ) {
    return "";
  }

  return text;
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (isPlainObject(value)) {
    const result = {};

    for (
      const key
      of Object.keys(value).sort()
    ) {
      result[key] =
        canonicalize(value[key]);
    }

    return result;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  return null;
}

function stableStringify(value) {
  return JSON.stringify(
    canonicalize(value)
  );
}

function deterministicId(prefix, value) {
  const digest = crypto
    .createHash("sha256")
    .update(stableStringify(value))
    .digest("hex")
    .slice(0, 32);

  return `${prefix}_${digest}`;
}

function deepFreeze(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return value;
}

function normalizeDispositionContext(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    disposition:
      safeText(
        value.disposition ||
        value.state ||
        value.status,
        80
      ),

    canonical:
      value.canonical === true
  };
}

function normalizeMembership(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    state:
      safeText(
        value.state ||
        value.status ||
        value.disposition,
        80
      ),

    canonical:
      value.canonical === true
  };
}

function normalizePrincipal(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    principal_id:
      safeText(
        value.principal_id,
        200
      ),

    principal_type:
      safeText(
        value.principal_type,
        80
      ),

    state:
      safeText(
        value.state ||
        value.status,
        80
      ),

    authenticated:
      value.authenticated === true,

    canonical:
      value.canonical === true
  };
}

function normalizeAuthentication(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    state:
      safeText(
        value.state ||
        value.status ||
        value.disposition,
        80
      ),

    method_class:
      safeText(
        value.method_class,
        80
      ),

    canonical:
      value.canonical === true
  };
}

function normalizeWorkspaceContext(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    workspace_id:
      safeText(
        value.workspace_id,
        200
      ) || null,

    membership:
      normalizeMembership(
        value.membership
      )
  };
}

function normalizeProjectContext(
  value,
  fallbackProjectSlug
) {
  if (!isPlainObject(value)) {
    return {
      project_slug:
        fallbackProjectSlug,

      project_id:
        null,

      workspace_id:
        null,

      membership:
        null
    };
  }

  return {
    project_slug:
      normalizeProjectSlug(
        value.project_slug
      ) || fallbackProjectSlug,

    project_id:
      safeText(
        value.project_id,
        200
      ) || null,

    workspace_id:
      safeText(
        value.workspace_id,
        200
      ) || null,

    membership:
      normalizeMembership(
        value.membership
      )
  };
}

function normalizeRuntimeSecurity(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    disposition:
      safeText(
        value.disposition ||
        value.state ||
        value.status,
        80
      ),

    binding_match:
      value.binding_match === true
        ? true
        : value.binding_match === false
          ? false
          : null,

    canonical:
      value.canonical === true
  };
}

function normalizeEvidenceBundle(value) {
  if (!isPlainObject(value)) {
    return {
      bundle_id: null
    };
  }

  return {
    bundle_id:
      safeText(
        value.bundle_id,
        200
      ) || null
  };
}

function normalizeAuthorityContext(
  value,
  projectSlug
) {
  const context =
    isPlainObject(value)
      ? value
      : {};

  return {
    principal_assertion:
      normalizePrincipal(
        context.principal_assertion
      ),

    authentication_state:
      normalizeAuthentication(
        context.authentication_state
      ),

    workspace_context:
      normalizeWorkspaceContext(
        context.workspace_context
      ),

    project_context:
      normalizeProjectContext(
        context.project_context,
        projectSlug
      ),

    grant_context:
      normalizeDispositionContext(
        context.grant_context
      ),

    governance_context:
      normalizeDispositionContext(
        context.governance_context
      ),

    provider_context:
      normalizeDispositionContext(
        context.provider_context
      ),

    execution_context:
      normalizeDispositionContext(
        context.execution_context
      ),

    authority_evidence_bundle:
      normalizeEvidenceBundle(
        context.authority_evidence_bundle
      )
  };
}

function normalizeRouteClassification(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    domain:
      safeText(
        value.domain,
        120
      ),

    required_access:
      safeText(
        value.required_access ||
        value.requiredAccess,
        120
      ),

    required_scope:
      safeText(
        value.required_scope ||
        value.requiredScope,
        160
      ),

    public_alias:
      value.public_alias === true ||
      value.publicAlias === true
  };
}

function routeClassificationMatches(
  classification
) {
  if (!classification) {
    return false;
  }

  return (
    classification.domain ===
      REQUIRED_ROUTE_CLASSIFICATION.domain &&
    classification.required_access ===
      REQUIRED_ROUTE_CLASSIFICATION
        .required_access &&
    classification.required_scope ===
      REQUIRED_ROUTE_CLASSIFICATION
        .required_scope &&
    classification.public_alias === false
  );
}

function safeRequestMetadata(input) {
  return {
    decision_request_id:
      safeText(
        input.decision_request_id,
        200
      ) || "unestablished",

    correlation_id:
      safeText(
        input.correlation_id,
        200
      ) || null,

    requested_at:
      normalizeTimestamp(
        input.requested_at
      ),

    request_method:
      upperText(
        input.request_method
      ),

    route_contract_id:
      safeText(
        input.route_contract_id,
        200
      ),

    route_template:
      safeText(
        input.route_template,
        320
      ),

    project_slug:
      normalizeProjectSlug(
        input.project_slug
      )
  };
}

function buildObservation({
  metadata,
  admitted,
  admissionReason,
  resolverInvoked,
  decision
}) {
  const decisionOutcome =
    decision &&
    typeof decision.outcome === "string"
      ? decision.outcome
      : null;

  const primaryReason =
    decision &&
    typeof decision.primary_reason_code ===
      "string"
      ? decision.primary_reason_code
      : null;

  const reasonCodes =
    decision &&
    Array.isArray(decision.reason_codes)
      ? decision.reason_codes.slice()
      : [];

  const seed = {
    adapter_version:
      SHADOW_ADAPTER_VERSION,

    decision_request_id:
      metadata.decision_request_id,

    correlation_id:
      metadata.correlation_id,

    requested_at:
      metadata.requested_at,

    request_method:
      metadata.request_method,

    route_contract_id:
      metadata.route_contract_id,

    route_template:
      metadata.route_template,

    project_slug:
      metadata.project_slug,

    admitted,

    admission_reason:
      admissionReason,

    resolver_invoked:
      resolverInvoked,

    decision_id:
      decision?.decision_id || null,

    decision_outcome:
      decisionOutcome,

    reason_codes:
      reasonCodes
  };

  return {
    observation_id:
      deterministicId(
        "shadow_observation",
        seed
      ),

    adapter_version:
      SHADOW_ADAPTER_VERSION,

    decision_request_id:
      metadata.decision_request_id,

    correlation_id:
      metadata.correlation_id,

    requested_at:
      metadata.requested_at,

    request_method:
      metadata.request_method || null,

    route_contract_id:
      metadata.route_contract_id || null,

    route_template:
      metadata.route_template || null,

    project_slug:
      metadata.project_slug || null,

    admitted,

    admission_reason:
      admissionReason,

    resolver_invoked:
      resolverInvoked,

    decision_id:
      decision?.decision_id || null,

    decision_outcome:
      decisionOutcome,

    primary_reason_code:
      primaryReason,

    reason_codes:
      reasonCodes,

    shadow:
      true,

    enforcement_effect:
      "NONE",

    current_result_changed:
      false,

    handler_result_changed:
      false,

    response_changed:
      false,

    persistent_sink:
      null
  };
}

function buildResult({
  metadata,
  admitted,
  admissionReason,
  resolverInvoked,
  decision
}) {
  const observation = buildObservation({
    metadata,
    admitted,
    admissionReason,
    resolverInvoked,
    decision
  });

  return deepFreeze({
    admitted,
    admission_reason:
      admissionReason,

    resolver_invoked:
      resolverInvoked,

    decision:
      decision || null,

    observation,

    shadow:
      true,

    enforcement_effect:
      "NONE",

    current_result_changed:
      false,

    handler_result_changed:
      false,

    response_changed:
      false
  });
}

function rejectBeforeResolver(
  metadata,
  admissionReason
) {
  return buildResult({
    metadata,
    admitted: false,
    admissionReason,
    resolverInvoked: false,
    decision: null
  });
}

function buildResolverRequest(
  input,
  metadata
) {
  const authority =
    normalizeAuthorityContext(
      input.authority_context,
      metadata.project_slug
    );

  return {
    contract_version:
      EFFECTIVE_PERMISSION_CONTRACT_VERSION,

    decision_request_id:
      metadata.decision_request_id,

    requested_at:
      metadata.requested_at,

    evaluation_mode:
      EVALUATION_MODE,

    route_contract_id:
      SELECTED_ROUTE_CONTRACT_ID,

    request_method:
      "GET",

    principal_assertion:
      authority.principal_assertion,

    authentication_state:
      authority.authentication_state,

    workspace_context:
      authority.workspace_context,

    project_context:
      authority.project_context,

    grant_context:
      authority.grant_context,

    resource: {
      type:
        SUPPORTED_ROUTE_CONTRACT
          .resource_type,

      project_slug:
        metadata.project_slug
    },

    action:
      SUPPORTED_ROUTE_CONTRACT.action,

    required_scope: {
      type:
        "project",

      permission:
        SUPPORTED_ROUTE_CONTRACT
          .required_scope,

      project_slug:
        metadata.project_slug,

      workspace_id:
        authority.workspace_context
          ?.workspace_id || null
    },

    governance_context:
      authority.governance_context,

    provider_context:
      authority.provider_context,

    execution_context:
      authority.execution_context,

    runtime_security_context:
      normalizeRuntimeSecurity(
        input.runtime_security_context
      ),

    authority_evidence_bundle:
      authority.authority_evidence_bundle
  };
}

function evaluateSelectedRouteShadow(
  input = {}
) {
  const request =
    isPlainObject(input)
      ? input
      : {};

  const metadata =
    safeRequestMetadata(request);

  const control =
    isPlainObject(
      request.shadow_control
    )
      ? request.shadow_control
      : {};

  if (control.enabled !== true) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS.SHADOW_DISABLED
    );
  }

  if (
    control.kill_switch_engaged === true
  ) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS
        .KILL_SWITCH_ENGAGED
    );
  }

  if (
    metadata.request_method !== "GET"
  ) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS.METHOD_EXCLUDED
    );
  }

  if (
    metadata.route_template ===
    PUBLIC_ALIAS_TEMPLATE
  ) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS
        .PUBLIC_ALIAS_EXCLUDED
    );
  }

  if (
    metadata.route_template !==
    SELECTED_ROUTE_TEMPLATE
  ) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS
        .ROUTE_TEMPLATE_UNSUPPORTED
    );
  }

  if (
    metadata.route_contract_id !==
    SELECTED_ROUTE_CONTRACT_ID
  ) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS
        .ROUTE_CONTRACT_UNSUPPORTED
    );
  }

  if (!metadata.project_slug) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS
        .PROJECT_CONTEXT_UNESTABLISHED
    );
  }

  const routeClassification =
    normalizeRouteClassification(
      request.route_classification
    );

  if (!routeClassification) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS
        .ROUTE_CLASSIFICATION_UNESTABLISHED
    );
  }

  if (
    !routeClassificationMatches(
      routeClassification
    )
  ) {
    return rejectBeforeResolver(
      metadata,
      ADMISSION_REASONS
        .ROUTE_CLASSIFICATION_MISMATCH
    );
  }

  const resolverRequest =
    buildResolverRequest(
      request,
      metadata
    );

  const decision =
    resolveEffectivePermission(
      resolverRequest
    );

  if (
    decision.shadow !== true ||
    decision.enforcement_effect !==
      ENFORCEMENT_EFFECT ||
    ENFORCEMENT_EFFECT !== "NONE"
  ) {
    return buildResult({
      metadata,
      admitted: false,
      admissionReason:
        ADMISSION_REASONS
          .RESOLVER_BOUNDARY_VIOLATION,
      resolverInvoked: true,
      decision: null
    });
  }

  if (
    decision.outcome ===
      OUTCOMES.ALLOW ||
    decision.outcome ===
      OUTCOMES.REQUIRES_APPROVAL
  ) {
    return buildResult({
      metadata,
      admitted: false,
      admissionReason:
        ADMISSION_REASONS
          .RESOLVER_POSITIVE_OUTCOME_FORBIDDEN,
      resolverInvoked: true,
      decision: null
    });
  }

  return buildResult({
    metadata,
    admitted: true,
    admissionReason:
      ADMISSION_REASONS
        .CANONICAL_ROUTE_ADMITTED,
    resolverInvoked: true,
    decision
  });
}

if (
  SUPPORTED_ROUTE_CONTRACT
    .route_contract_id !==
    SELECTED_ROUTE_CONTRACT_ID ||
  SUPPORTED_ROUTE_CONTRACT
    .request_method !== "GET" ||
  SUPPORTED_ROUTE_CONTRACT
    .route_template !==
    SELECTED_ROUTE_TEMPLATE ||
  SUPPORTED_ROUTE_CONTRACT
    .required_scope !==
    REQUIRED_ROUTE_CLASSIFICATION
      .required_scope ||
  EVALUATION_MODE !== "SHADOW" ||
  ENFORCEMENT_EFFECT !== "NONE"
) {
  throw new Error(
    "Selected-route shadow adapter contract is not aligned with the resolver"
  );
}

module.exports = Object.freeze({
  SHADOW_ADAPTER_VERSION,
  SELECTED_ROUTE_TEMPLATE,
  PUBLIC_ALIAS_TEMPLATE,
  SELECTED_ROUTE_CONTRACT_ID,
  REQUIRED_ROUTE_CLASSIFICATION,
  ADMISSION_REASONS,
  EFFECTIVE_PERMISSION_CONTRACT_VERSION,
  EVALUATION_MODE,
  ENFORCEMENT_EFFECT,
  OUTCOMES,
  REASON_CODES,
  evaluateSelectedRouteShadow
});

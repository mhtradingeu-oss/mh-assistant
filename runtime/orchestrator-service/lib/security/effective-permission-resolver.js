"use strict";

const crypto = require("node:crypto");

const EFFECTIVE_PERMISSION_CONTRACT_VERSION =
  "effective-permission/v1";

const REASON_VOCABULARY_VERSION =
  "authority-reason-codes/v1";

const RESOLVER_VERSION =
  "mhos-offline-fail-closed-resolver/v1";

const EVALUATION_MODE = "SHADOW";
const ENFORCEMENT_EFFECT = "NONE";

const OUTCOMES = Object.freeze({
  ALLOW: "ALLOW",
  DENY: "DENY",
  REQUIRES_APPROVAL: "REQUIRES_APPROVAL",
  INSUFFICIENT_CONTEXT: "INSUFFICIENT_CONTEXT",
  UNSUPPORTED_ACTION: "UNSUPPORTED_ACTION"
});

const REASON_CODES = Object.freeze({
  VERSION_UNSUPPORTED: "VERSION_UNSUPPORTED",

  UNSUPPORTED_ROUTE_CONTRACT:
    "UNSUPPORTED_ROUTE_CONTRACT",

  RESOURCE_UNSUPPORTED:
    "RESOURCE_UNSUPPORTED",

  ACTION_UNSUPPORTED:
    "ACTION_UNSUPPORTED",

  AUTHENTICATION_UNESTABLISHED:
    "AUTHENTICATION_UNESTABLISHED",

  AUTHENTICATION_REJECTED:
    "AUTHENTICATION_REJECTED",

  AUTHENTICATION_STALE:
    "AUTHENTICATION_STALE",

  PRINCIPAL_UNESTABLISHED:
    "PRINCIPAL_UNESTABLISHED",

  PRINCIPAL_INACTIVE:
    "PRINCIPAL_INACTIVE",

  PRINCIPAL_REVOKED:
    "PRINCIPAL_REVOKED",

  WORKSPACE_CONTEXT_UNESTABLISHED:
    "WORKSPACE_CONTEXT_UNESTABLISHED",

  WORKSPACE_SCOPE_MISMATCH:
    "WORKSPACE_SCOPE_MISMATCH",

  WORKSPACE_MEMBERSHIP_UNAVAILABLE:
    "WORKSPACE_MEMBERSHIP_UNAVAILABLE",

  WORKSPACE_MEMBERSHIP_INACTIVE:
    "WORKSPACE_MEMBERSHIP_INACTIVE",

  PROJECT_CONTEXT_UNESTABLISHED:
    "PROJECT_CONTEXT_UNESTABLISHED",

  PROJECT_SCOPE_MISMATCH:
    "PROJECT_SCOPE_MISMATCH",

  PROJECT_MEMBERSHIP_UNAVAILABLE:
    "PROJECT_MEMBERSHIP_UNAVAILABLE",

  PROJECT_MEMBERSHIP_INACTIVE:
    "PROJECT_MEMBERSHIP_INACTIVE",

  GRANT_SOURCE_UNAVAILABLE:
    "GRANT_SOURCE_UNAVAILABLE",

  GRANT_EXPLICIT_DENY:
    "GRANT_EXPLICIT_DENY",

  GRANT_SCOPE_MISMATCH:
    "GRANT_SCOPE_MISMATCH",

  SCOPE_UNESTABLISHED:
    "SCOPE_UNESTABLISHED",

  SCOPE_MISMATCH:
    "SCOPE_MISMATCH",

  GOVERNANCE_CONTEXT_UNESTABLISHED:
    "GOVERNANCE_CONTEXT_UNESTABLISHED",

  GOVERNANCE_DENY:
    "GOVERNANCE_DENY",

  PROVIDER_CONTEXT_UNESTABLISHED:
    "PROVIDER_CONTEXT_UNESTABLISHED",

  PROVIDER_DENY:
    "PROVIDER_DENY",

  EXECUTION_CONTEXT_UNESTABLISHED:
    "EXECUTION_CONTEXT_UNESTABLISHED",

  EXECUTION_DENY:
    "EXECUTION_DENY",

  RUNTIME_SECURITY_UNAVAILABLE:
    "RUNTIME_SECURITY_UNAVAILABLE",

  RUNTIME_SECURITY_DENY:
    "RUNTIME_SECURITY_DENY",

  RUNTIME_SECURITY_BINDING_MISMATCH:
    "RUNTIME_SECURITY_BINDING_MISMATCH",

  SOURCE_PROVENANCE_INVALID:
    "SOURCE_PROVENANCE_INVALID",

  CONTEXT_INCOMPLETE:
    "CONTEXT_INCOMPLETE",

  CONTEXT_AMBIGUOUS:
    "CONTEXT_AMBIGUOUS"
});

const SUPPORTED_ROUTE_CONTRACT = Object.freeze({
  route_contract_id:
    "customer-operations.health.get/v1",

  request_method:
    "GET",

  route_template:
    "/media-manager/project/:project/customer-operations/health",

  resource_type:
    "customer_operations_health",

  action:
    "customer_operations.health.read",

  required_scope:
    "customer.read"
});

const ALLOWED_TOP_LEVEL_FIELDS = new Set([
  "contract_version",
  "decision_request_id",
  "requested_at",
  "evaluation_mode",
  "route_contract_id",
  "request_method",
  "principal_assertion",
  "authentication_state",
  "workspace_context",
  "project_context",
  "grant_context",
  "resource",
  "action",
  "required_scope",
  "governance_context",
  "provider_context",
  "execution_context",
  "runtime_security_context",
  "authority_evidence_bundle"
]);

const REASON_ORDER = Object.freeze([
  REASON_CODES.AUTHENTICATION_REJECTED,
  REASON_CODES.PRINCIPAL_REVOKED,
  REASON_CODES.PRINCIPAL_INACTIVE,
  REASON_CODES.WORKSPACE_SCOPE_MISMATCH,
  REASON_CODES.WORKSPACE_MEMBERSHIP_INACTIVE,
  REASON_CODES.PROJECT_SCOPE_MISMATCH,
  REASON_CODES.PROJECT_MEMBERSHIP_INACTIVE,
  REASON_CODES.GRANT_EXPLICIT_DENY,
  REASON_CODES.GRANT_SCOPE_MISMATCH,
  REASON_CODES.SCOPE_MISMATCH,
  REASON_CODES.GOVERNANCE_DENY,
  REASON_CODES.PROVIDER_DENY,
  REASON_CODES.EXECUTION_DENY,
  REASON_CODES.RUNTIME_SECURITY_DENY,
  REASON_CODES.RUNTIME_SECURITY_BINDING_MISMATCH,

  REASON_CODES.VERSION_UNSUPPORTED,
  REASON_CODES.UNSUPPORTED_ROUTE_CONTRACT,
  REASON_CODES.RESOURCE_UNSUPPORTED,
  REASON_CODES.ACTION_UNSUPPORTED,

  REASON_CODES.AUTHENTICATION_UNESTABLISHED,
  REASON_CODES.AUTHENTICATION_STALE,
  REASON_CODES.PRINCIPAL_UNESTABLISHED,
  REASON_CODES.WORKSPACE_CONTEXT_UNESTABLISHED,
  REASON_CODES.WORKSPACE_MEMBERSHIP_UNAVAILABLE,
  REASON_CODES.PROJECT_CONTEXT_UNESTABLISHED,
  REASON_CODES.PROJECT_MEMBERSHIP_UNAVAILABLE,
  REASON_CODES.GRANT_SOURCE_UNAVAILABLE,
  REASON_CODES.SCOPE_UNESTABLISHED,
  REASON_CODES.GOVERNANCE_CONTEXT_UNESTABLISHED,
  REASON_CODES.PROVIDER_CONTEXT_UNESTABLISHED,
  REASON_CODES.EXECUTION_CONTEXT_UNESTABLISHED,
  REASON_CODES.RUNTIME_SECURITY_UNAVAILABLE,
  REASON_CODES.SOURCE_PROVENANCE_INVALID,
  REASON_CODES.CONTEXT_AMBIGUOUS,
  REASON_CODES.CONTEXT_INCOMPLETE
]);

const INACTIVE_MEMBERSHIP_STATES = new Set([
  "SUSPENDED",
  "REVOKED",
  "EXPIRED",
  "DECLINED",
  "INACTIVE"
]);

const EXPLICIT_DENY_DISPOSITIONS = new Set([
  "DENY",
  "DENIED",
  "REJECTED",
  "PROHIBITED",
  "EXPLICIT_DENY"
]);

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

  const normalized = String(value)
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();

  return normalized.slice(0, maximumLength);
}

function upperText(value) {
  return safeText(value).toUpperCase();
}

function normalizeIsoTimestamp(value) {
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

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (isPlainObject(value)) {
    const result = {};

    for (const key of Object.keys(value).sort()) {
      result[key] = canonicalize(value[key]);
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

function addReason(collection, reasonCode) {
  if (
    typeof reasonCode === "string" &&
    reasonCode &&
    !collection.includes(reasonCode)
  ) {
    collection.push(reasonCode);
  }
}

function orderReasons(reasons) {
  const unique = Array.from(
    new Set(reasons)
  );

  return unique.sort((left, right) => {
    const leftIndex = REASON_ORDER.indexOf(left);
    const rightIndex = REASON_ORDER.indexOf(right);

    const leftRank =
      leftIndex === -1
        ? Number.MAX_SAFE_INTEGER
        : leftIndex;

    const rightRank =
      rightIndex === -1
        ? Number.MAX_SAFE_INTEGER
        : rightIndex;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.localeCompare(right);
  });
}

function contextDisposition(value) {
  if (!isPlainObject(value)) {
    return "";
  }

  return upperText(
    value.disposition ||
    value.state ||
    value.status
  );
}

function isExplicitDeny(value) {
  return EXPLICIT_DENY_DISPOSITIONS.has(
    contextDisposition(value)
  );
}

function isCanonicalPositive(value) {
  if (!isPlainObject(value)) {
    return false;
  }

  const disposition =
    contextDisposition(value);

  return (
    value.canonical === true &&
    (
      disposition === "ALLOW" ||
      disposition === "ALLOWED" ||
      disposition === "ACTIVE" ||
      disposition === "ACCEPTED" ||
      disposition === "SATISFIED" ||
      disposition === "NOT_APPLICABLE"
    )
  );
}

function membershipState(context) {
  if (!isPlainObject(context)) {
    return "";
  }

  if (isPlainObject(context.membership)) {
    return contextDisposition(
      context.membership
    );
  }

  return contextDisposition(context);
}

function projectSlugFrom(request) {
  const candidates = [
    request.project_context?.project_slug,
    request.resource?.project_slug,
    request.required_scope?.project_slug
  ];

  for (const candidate of candidates) {
    const value = safeText(candidate, 80);

    if (value) {
      return value;
    }
  }

  return "";
}

function workspaceIdFrom(request) {
  const candidates = [
    request.workspace_context?.workspace_id,
    request.project_context?.workspace_id,
    request.required_scope?.workspace_id
  ];

  for (const candidate of candidates) {
    const value = safeText(candidate, 160);

    if (value) {
      return value;
    }
  }

  return "";
}

function collectExplicitDenyReasons(request) {
  const reasons = [];

  const authenticationState =
    contextDisposition(
      request.authentication_state
    );

  if (
    authenticationState === "REJECTED" ||
    authenticationState === "DENY" ||
    authenticationState === "DENIED"
  ) {
    addReason(
      reasons,
      REASON_CODES.AUTHENTICATION_REJECTED
    );
  }

  if (
    authenticationState === "STALE" ||
    authenticationState === "EXPIRED"
  ) {
    addReason(
      reasons,
      REASON_CODES.AUTHENTICATION_STALE
    );
  }

  const principalState =
    contextDisposition(
      request.principal_assertion
    );

  if (principalState === "REVOKED") {
    addReason(
      reasons,
      REASON_CODES.PRINCIPAL_REVOKED
    );
  }

  if (
    principalState === "INACTIVE" ||
    principalState === "SUSPENDED"
  ) {
    addReason(
      reasons,
      REASON_CODES.PRINCIPAL_INACTIVE
    );
  }

  const workspaceMembershipState =
    membershipState(
      request.workspace_context
    );

  if (
    INACTIVE_MEMBERSHIP_STATES.has(
      workspaceMembershipState
    )
  ) {
    addReason(
      reasons,
      REASON_CODES.WORKSPACE_MEMBERSHIP_INACTIVE
    );
  }

  const projectMembershipState =
    membershipState(
      request.project_context
    );

  if (
    INACTIVE_MEMBERSHIP_STATES.has(
      projectMembershipState
    )
  ) {
    addReason(
      reasons,
      REASON_CODES.PROJECT_MEMBERSHIP_INACTIVE
    );
  }

  const expectedWorkspaceId =
    workspaceIdFrom(request);

  const projectWorkspaceId =
    safeText(
      request.project_context?.workspace_id,
      160
    );

  if (
    expectedWorkspaceId &&
    projectWorkspaceId &&
    expectedWorkspaceId !== projectWorkspaceId
  ) {
    addReason(
      reasons,
      REASON_CODES.WORKSPACE_SCOPE_MISMATCH
    );
  }

  const projectContextSlug =
    safeText(
      request.project_context?.project_slug,
      80
    );

  const resourceProjectSlug =
    safeText(
      request.resource?.project_slug,
      80
    );

  const scopeProjectSlug =
    safeText(
      request.required_scope?.project_slug,
      80
    );

  const projectSlugs = [
    projectContextSlug,
    resourceProjectSlug,
    scopeProjectSlug
  ].filter(Boolean);

  if (
    new Set(projectSlugs).size > 1
  ) {
    addReason(
      reasons,
      REASON_CODES.PROJECT_SCOPE_MISMATCH
    );
  }

  const requiredPermission =
    safeText(
      request.required_scope?.permission,
      160
    );

  if (
    requiredPermission &&
    requiredPermission !==
      SUPPORTED_ROUTE_CONTRACT.required_scope
  ) {
    addReason(
      reasons,
      REASON_CODES.SCOPE_MISMATCH
    );
  }

  if (isExplicitDeny(request.grant_context)) {
    addReason(
      reasons,
      REASON_CODES.GRANT_EXPLICIT_DENY
    );
  }

  if (
    request.grant_context?.scope_match === false
  ) {
    addReason(
      reasons,
      REASON_CODES.GRANT_SCOPE_MISMATCH
    );
  }

  if (isExplicitDeny(request.governance_context)) {
    addReason(
      reasons,
      REASON_CODES.GOVERNANCE_DENY
    );
  }

  if (isExplicitDeny(request.provider_context)) {
    addReason(
      reasons,
      REASON_CODES.PROVIDER_DENY
    );
  }

  if (isExplicitDeny(request.execution_context)) {
    addReason(
      reasons,
      REASON_CODES.EXECUTION_DENY
    );
  }

  if (
    isExplicitDeny(
      request.runtime_security_context
    )
  ) {
    addReason(
      reasons,
      REASON_CODES.RUNTIME_SECURITY_DENY
    );
  }

  if (
    request.runtime_security_context
      ?.binding_match === false
  ) {
    addReason(
      reasons,
      REASON_CODES
        .RUNTIME_SECURITY_BINDING_MISMATCH
    );
  }

  return orderReasons(reasons);
}

function collectUnsupportedReasons(request) {
  const reasons = [];

  if (
    safeText(request.contract_version) !==
    EFFECTIVE_PERMISSION_CONTRACT_VERSION
  ) {
    addReason(
      reasons,
      REASON_CODES.VERSION_UNSUPPORTED
    );
  }

  if (
    safeText(request.route_contract_id) !==
      SUPPORTED_ROUTE_CONTRACT
        .route_contract_id ||
    upperText(request.request_method) !==
      SUPPORTED_ROUTE_CONTRACT
        .request_method
  ) {
    addReason(
      reasons,
      REASON_CODES.UNSUPPORTED_ROUTE_CONTRACT
    );
  }

  if (
    safeText(request.resource?.type) !==
    SUPPORTED_ROUTE_CONTRACT.resource_type
  ) {
    addReason(
      reasons,
      REASON_CODES.RESOURCE_UNSUPPORTED
    );
  }

  if (
    safeText(request.action) !==
    SUPPORTED_ROUTE_CONTRACT.action
  ) {
    addReason(
      reasons,
      REASON_CODES.ACTION_UNSUPPORTED
    );
  }

  return orderReasons(reasons);
}

function collectMissingContextReasons(request) {
  const reasons = [];

  const unknownFields = Object.keys(request)
    .filter(
      (field) =>
        !ALLOWED_TOP_LEVEL_FIELDS.has(field)
    );

  if (unknownFields.length > 0) {
    addReason(
      reasons,
      REASON_CODES.CONTEXT_AMBIGUOUS
    );
  }

  if (
    upperText(request.evaluation_mode) !==
    EVALUATION_MODE
  ) {
    addReason(
      reasons,
      REASON_CODES.CONTEXT_AMBIGUOUS
    );
  }

  const principal =
    request.principal_assertion;

  if (
    !isPlainObject(principal) ||
    !safeText(principal.principal_id) ||
    !safeText(principal.principal_type)
  ) {
    addReason(
      reasons,
      REASON_CODES.PRINCIPAL_UNESTABLISHED
    );
  } else if (
    principal.canonical !== true ||
    principal.principal_id ===
      "legacy-control-center-key"
  ) {
    addReason(
      reasons,
      REASON_CODES.SOURCE_PROVENANCE_INVALID
    );
  }

  const authentication =
    request.authentication_state;

  if (
    !isPlainObject(authentication) ||
    contextDisposition(authentication) !==
      "ACCEPTED"
  ) {
    addReason(
      reasons,
      REASON_CODES.AUTHENTICATION_UNESTABLISHED
    );
  } else if (
    authentication.canonical !== true
  ) {
    addReason(
      reasons,
      REASON_CODES.SOURCE_PROVENANCE_INVALID
    );
  }

  const workspace =
    request.workspace_context;

  if (
    !isPlainObject(workspace) ||
    !safeText(workspace.workspace_id)
  ) {
    addReason(
      reasons,
      REASON_CODES
        .WORKSPACE_CONTEXT_UNESTABLISHED
    );
  }

  if (
    !isPlainObject(workspace?.membership) ||
    contextDisposition(
      workspace.membership
    ) !== "ACTIVE"
  ) {
    addReason(
      reasons,
      REASON_CODES
        .WORKSPACE_MEMBERSHIP_UNAVAILABLE
    );
  } else if (
    workspace.membership.canonical !== true
  ) {
    addReason(
      reasons,
      REASON_CODES.SOURCE_PROVENANCE_INVALID
    );
  }

  const project =
    request.project_context;

  if (
    !isPlainObject(project) ||
    !safeText(project.project_slug) ||
    !safeText(project.project_id)
  ) {
    addReason(
      reasons,
      REASON_CODES.PROJECT_CONTEXT_UNESTABLISHED
    );
  }

  if (
    !isPlainObject(project?.membership) ||
    contextDisposition(
      project.membership
    ) !== "ACTIVE"
  ) {
    addReason(
      reasons,
      REASON_CODES
        .PROJECT_MEMBERSHIP_UNAVAILABLE
    );
  } else if (
    project.membership.canonical !== true
  ) {
    addReason(
      reasons,
      REASON_CODES.SOURCE_PROVENANCE_INVALID
    );
  }

  if (
    !isCanonicalPositive(
      request.grant_context
    )
  ) {
    addReason(
      reasons,
      REASON_CODES.GRANT_SOURCE_UNAVAILABLE
    );
  }

  if (
    !safeText(
      request.required_scope?.permission
    ) ||
    !projectSlugFrom(request)
  ) {
    addReason(
      reasons,
      REASON_CODES.SCOPE_UNESTABLISHED
    );
  }

  if (
    !isCanonicalPositive(
      request.governance_context
    )
  ) {
    addReason(
      reasons,
      REASON_CODES
        .GOVERNANCE_CONTEXT_UNESTABLISHED
    );
  }

  if (
    request.provider_context &&
    !isCanonicalPositive(
      request.provider_context
    )
  ) {
    addReason(
      reasons,
      REASON_CODES
        .PROVIDER_CONTEXT_UNESTABLISHED
    );
  }

  if (
    !isCanonicalPositive(
      request.execution_context
    )
  ) {
    addReason(
      reasons,
      REASON_CODES
        .EXECUTION_CONTEXT_UNESTABLISHED
    );
  }

  if (
    !isCanonicalPositive(
      request.runtime_security_context
    )
  ) {
    addReason(
      reasons,
      REASON_CODES.RUNTIME_SECURITY_UNAVAILABLE
    );
  }

  /*
   * Positive authorization is intentionally disabled in this
   * implementation slice. Even apparently affirmative caller
   * objects cannot establish canonical authority until bounded,
   * trusted source adapters are separately implemented and
   * certified.
   */
  addReason(
    reasons,
    REASON_CODES.SOURCE_PROVENANCE_INVALID
  );

  addReason(
    reasons,
    REASON_CODES.CONTEXT_INCOMPLETE
  );

  return orderReasons(reasons);
}

function missingEvidenceTypes(reasonCodes) {
  const types = [];

  const mapping = [
    [
      "AUTHENTICATION_",
      "authentication"
    ],
    [
      "PRINCIPAL_",
      "principal"
    ],
    [
      "WORKSPACE_",
      "workspace_membership"
    ],
    [
      "PROJECT_",
      "project_membership"
    ],
    [
      "GRANT_",
      "grant"
    ],
    [
      "SCOPE_",
      "scope"
    ],
    [
      "GOVERNANCE_",
      "governance"
    ],
    [
      "PROVIDER_",
      "provider"
    ],
    [
      "EXECUTION_",
      "execution"
    ],
    [
      "RUNTIME_SECURITY_",
      "runtime_security"
    ],
    [
      "SOURCE_",
      "source_provenance"
    ]
  ];

  for (const reason of reasonCodes) {
    for (const [prefix, type] of mapping) {
      if (
        reason.startsWith(prefix) &&
        !types.includes(type)
      ) {
        types.push(type);
      }
    }
  }

  return types.sort();
}

function buildDecision(request, outcome, reasonCodes) {
  const orderedReasons =
    orderReasons(reasonCodes);

  const projectSlug =
    projectSlugFrom(request);

  const workspaceId =
    workspaceIdFrom(request);

  const decisionRequestId =
    safeText(
      request.decision_request_id,
      200
    ) || "unestablished";

  const evaluatedAt =
    normalizeIsoTimestamp(
      request.requested_at
    );

  const resourceBinding = {
    type:
      safeText(
        request.resource?.type,
        160
      ) || null,

    project_slug:
      projectSlug || null,

    workspace_id:
      workspaceId || null
  };

  const scope = {
    type:
      safeText(
        request.required_scope?.type,
        80
      ) || null,

    permission:
      safeText(
        request.required_scope?.permission,
        160
      ) || null,

    project_slug:
      projectSlug || null,

    workspace_id:
      workspaceId || null
  };

  const decisionSeed = {
    contract_version:
      EFFECTIVE_PERMISSION_CONTRACT_VERSION,

    decision_request_id:
      decisionRequestId,

    evaluated_at:
      evaluatedAt,

    route_contract_id:
      safeText(
        request.route_contract_id,
        200
      ),

    outcome,

    reason_codes:
      orderedReasons,

    resource_binding:
      resourceBinding,

    action:
      safeText(request.action, 200),

    scope
  };

  const decision = {
    contract_version:
      EFFECTIVE_PERMISSION_CONTRACT_VERSION,

    decision_id:
      deterministicId(
        "decision",
        decisionSeed
      ),

    decision_request_id:
      decisionRequestId,

    evaluated_at:
      evaluatedAt,

    outcome,

    reason_codes:
      orderedReasons,

    primary_reason_code:
      orderedReasons[0] || null,

    scope,

    evidence_summary:
      orderedReasons.map(
        (reasonCode) => ({
          reason_code: reasonCode,
          disposition: "NON_AUTHORIZING"
        })
      ),

    policy_references: [],

    valid_until: null,

    shadow: true,

    enforcement_effect:
      ENFORCEMENT_EFFECT,

    audit_reference: null,

    resource_binding:
      resourceBinding,

    action:
      safeText(
        request.action,
        200
      ) || null,

    evidence_bundle_id:
      safeText(
        request
          .authority_evidence_bundle
          ?.bundle_id,
        200
      ) || null,

    source_revisions: [],

    missing_evidence_types:
      missingEvidenceTypes(
        orderedReasons
      ),

    evaluation_metadata: {
      resolver_version:
        RESOLVER_VERSION,

      contract_version:
        EFFECTIVE_PERMISSION_CONTRACT_VERSION,

      reason_vocabulary_version:
        REASON_VOCABULARY_VERSION,

      evaluation_mode:
        EVALUATION_MODE,

      side_effect_free:
        true,

      allow_capability_enabled:
        false,

      positive_evidence_sources_installed:
        false,

      current_result_changed:
        false,

      source_count:
        0
    }
  };

  return deepFreeze(decision);
}

function resolveEffectivePermission(input = {}) {
  const request =
    isPlainObject(input)
      ? input
      : {};

  const denyReasons =
    collectExplicitDenyReasons(request);

  if (denyReasons.length > 0) {
    return buildDecision(
      request,
      OUTCOMES.DENY,
      denyReasons
    );
  }

  const unsupportedReasons =
    collectUnsupportedReasons(request);

  if (unsupportedReasons.length > 0) {
    return buildDecision(
      request,
      OUTCOMES.UNSUPPORTED_ACTION,
      unsupportedReasons
    );
  }

  const missingReasons =
    collectMissingContextReasons(request);

  return buildDecision(
    request,
    OUTCOMES.INSUFFICIENT_CONTEXT,
    missingReasons
  );
}

module.exports = Object.freeze({
  EFFECTIVE_PERMISSION_CONTRACT_VERSION,
  REASON_VOCABULARY_VERSION,
  RESOLVER_VERSION,
  EVALUATION_MODE,
  ENFORCEMENT_EFFECT,
  OUTCOMES,
  REASON_CODES,
  SUPPORTED_ROUTE_CONTRACT,
  resolveEffectivePermission
});

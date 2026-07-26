"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
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
} = require(
  "../runtime/orchestrator-service/lib/security/effective-permission-shadow-adapter.js"
);

const ADAPTER_PATH = path.resolve(
  __dirname,
  "../runtime/orchestrator-service/lib/security/effective-permission-shadow-adapter.js"
);

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function baseInput() {
  return {
    decision_request_id:
      "shadow-request-001",

    correlation_id:
      "correlation-001",

    requested_at:
      "2026-07-26T09:00:00.000Z",

    request_method:
      "GET",

    route_contract_id:
      SELECTED_ROUTE_CONTRACT_ID,

    route_template:
      SELECTED_ROUTE_TEMPLATE,

    project_slug:
      "hairoticmen",

    shadow_control: {
      enabled: true,
      kill_switch_engaged: false
    },

    route_classification: {
      domain:
        REQUIRED_ROUTE_CLASSIFICATION
          .domain,

      required_access:
        REQUIRED_ROUTE_CLASSIFICATION
          .required_access,

      required_scope:
        REQUIRED_ROUTE_CLASSIFICATION
          .required_scope,

      public_alias: false
    },

    authority_context: {
      principal_assertion: {
        principal_id:
          "legacy-control-center-key",

        principal_type:
          "service",

        state:
          "ACTIVE",

        authenticated:
          true,

        canonical:
          false
      },

      authentication_state: {
        state:
          "ACCEPTED",

        method_class:
          "shared_key",

        canonical:
          false
      },

      workspace_context: {
        workspace_id:
          null,

        membership:
          null
      },

      project_context: {
        project_slug:
          "hairoticmen",

        project_id:
          null,

        workspace_id:
          null,

        membership:
          null
      },

      grant_context: {
        disposition:
          "UNAVAILABLE",

        canonical:
          false
      },

      governance_context: {
        disposition:
          "UNESTABLISHED",

        canonical:
          false
      },

      execution_context: {
        disposition:
          "NOT_APPLICABLE",

        canonical:
          false
      },

      authority_evidence_bundle: {
        bundle_id:
          null
      }
    },

    runtime_security_context: {
      disposition:
        "ALLOW",

      binding_match:
        true,

      canonical:
        false
    }
  };
}

function assertCommonResult(result) {
  assert.equal(
    result.shadow,
    true
  );

  assert.equal(
    result.enforcement_effect,
    ENFORCEMENT_EFFECT
  );

  assert.equal(
    result.enforcement_effect,
    "NONE"
  );

  assert.equal(
    result.current_result_changed,
    false
  );

  assert.equal(
    result.handler_result_changed,
    false
  );

  assert.equal(
    result.response_changed,
    false
  );

  assert.equal(
    result.observation.shadow,
    true
  );

  assert.equal(
    result.observation
      .enforcement_effect,
    "NONE"
  );

  assert.equal(
    result.observation
      .current_result_changed,
    false
  );

  assert.equal(
    result.observation
      .persistent_sink,
    null
  );

  assert.equal(
    result.observation
      .adapter_version,
    SHADOW_ADAPTER_VERSION
  );

  assert.equal(
    Object.isFrozen(result),
    true
  );

  assert.equal(
    Object.isFrozen(
      result.observation
    ),
    true
  );
}

function assertRejected(
  result,
  expectedReason
) {
  assertCommonResult(result);

  assert.equal(
    result.admitted,
    false
  );

  assert.equal(
    result.admission_reason,
    expectedReason
  );

  assert.equal(
    result.resolver_invoked,
    false
  );

  assert.equal(
    result.decision,
    null
  );
}

function assertNoPositiveDecision(result) {
  if (!result.decision) {
    return;
  }

  assert.notEqual(
    result.decision.outcome,
    OUTCOMES.ALLOW
  );

  assert.notEqual(
    result.decision.outcome,
    OUTCOMES.REQUIRES_APPROVAL
  );
}

const adapterSource =
  fs.readFileSync(
    ADAPTER_PATH,
    "utf8"
  );

const forbiddenAdapterSignals = [
  /\brequire\s*\(\s*["'](?:node:)?fs["']\s*\)/,
  /\brequire\s*\(\s*["'](?:node:)?http["']\s*\)/,
  /\brequire\s*\(\s*["'](?:node:)?https["']\s*\)/,
  /\brequire\s*\(\s*["'](?:node:)?net["']\s*\)/,
  /\brequire\s*\(\s*["'](?:node:)?tls["']\s*\)/,
  /\brequire\s*\(\s*["'](?:node:)?child_process["']\s*\)/,
  /\bprocess\.env\b/,
  /\bDate\.now\s*\(/,
  /\bMath\.random\s*\(/,
  /\bfetch\s*\(/,
  /\bfs\.(?:writeFile|appendFile|rename|unlink|rm|mkdir|copyFile|createWriteStream)/
];

for (
  const pattern
  of forbiddenAdapterSignals
) {
  assert.equal(
    pattern.test(adapterSource),
    false,
    `Adapter contains forbidden signal: ${pattern}`
  );
}

const results = [];

{
  const request = baseInput();

  delete request.shadow_control;

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertRejected(
    result,
    ADMISSION_REASONS.SHADOW_DISABLED
  );

  results.push({
    name:
      "shadow_disabled_by_default",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      null
  });
}

{
  const request = baseInput();

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertCommonResult(result);

  assert.equal(
    result.admitted,
    true
  );

  assert.equal(
    result.admission_reason,
    ADMISSION_REASONS
      .CANONICAL_ROUTE_ADMITTED
  );

  assert.equal(
    result.resolver_invoked,
    true
  );

  assert.equal(
    result.decision.outcome,
    OUTCOMES.INSUFFICIENT_CONTEXT
  );

  assertNoPositiveDecision(result);

  results.push({
    name:
      "canonical_exact_get_admitted",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      result.decision.outcome
  });
}

{
  const request = baseInput();

  request.request_method = "HEAD";

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertRejected(
    result,
    ADMISSION_REASONS.METHOD_EXCLUDED
  );

  results.push({
    name:
      "head_rejected_before_resolver",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      null
  });
}

{
  const request = baseInput();

  request.route_template =
    PUBLIC_ALIAS_TEMPLATE;

  request.route_classification
    .public_alias = true;

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertRejected(
    result,
    ADMISSION_REASONS
      .PUBLIC_ALIAS_EXCLUDED
  );

  results.push({
    name:
      "public_alias_rejected_before_resolver",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      null
  });
}

{
  const request = baseInput();

  request.route_contract_id =
    "unknown-route-contract/v999";

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertRejected(
    result,
    ADMISSION_REASONS
      .ROUTE_CONTRACT_UNSUPPORTED
  );

  results.push({
    name:
      "unknown_route_contract_rejected",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      null
  });
}

{
  const request = baseInput();

  request.project_slug = "";

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertRejected(
    result,
    ADMISSION_REASONS
      .PROJECT_CONTEXT_UNESTABLISHED
  );

  results.push({
    name:
      "missing_project_slug_rejected",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      null
  });
}

{
  const request = baseInput();

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertCommonResult(result);

  assert.equal(
    result.admitted,
    true
  );

  assert.equal(
    result.decision.outcome,
    OUTCOMES.INSUFFICIENT_CONTEXT
  );

  assert.ok(
    result.decision.reason_codes.includes(
      REASON_CODES
        .SOURCE_PROVENANCE_INVALID
    )
  );

  assertNoPositiveDecision(result);

  results.push({
    name:
      "legacy_compatibility_remains_non_authorizing",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      result.decision.outcome
  });
}

{
  const request = baseInput();

  request.runtime_security_context = {
    disposition:
      "DENY",

    binding_match:
      true,

    canonical:
      true
  };

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertCommonResult(result);

  assert.equal(
    result.admitted,
    true
  );

  assert.equal(
    result.decision.outcome,
    OUTCOMES.DENY
  );

  assert.equal(
    result.decision.primary_reason_code,
    REASON_CODES.RUNTIME_SECURITY_DENY
  );

  assertNoPositiveDecision(result);

  results.push({
    name:
      "runtime_security_deny_preserved",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      result.decision.outcome
  });
}

{
  const request = baseInput();

  request.authority_context = {
    principal_assertion: {
      principal_id:
        "principal-001",

      principal_type:
        "human",

      state:
        "ACTIVE",

      authenticated:
        true,

      canonical:
        true
    },

    authentication_state: {
      state:
        "ACCEPTED",

      method_class:
        "session",

      canonical:
        true
    },

    workspace_context: {
      workspace_id:
        "workspace-001",

      membership: {
        state:
          "ACTIVE",

        canonical:
          true
      }
    },

    project_context: {
      project_slug:
        "hairoticmen",

      project_id:
        "project-001",

      workspace_id:
        "workspace-001",

      membership: {
        state:
          "ACTIVE",

        canonical:
          true
      }
    },

    grant_context: {
      disposition:
        "ALLOW",

      canonical:
        true
    },

    governance_context: {
      disposition:
        "NOT_APPLICABLE",

      canonical:
        true
    },

    execution_context: {
      disposition:
        "NOT_APPLICABLE",

      canonical:
        true
    },

    authority_evidence_bundle: {
      bundle_id:
        "bundle-001"
    }
  };

  request.runtime_security_context = {
    disposition:
      "ALLOW",

    binding_match:
      true,

    canonical:
      true
  };

  const result =
    evaluateSelectedRouteShadow(
      request
    );

  assertCommonResult(result);

  assert.equal(
    result.admitted,
    true
  );

  assert.equal(
    result.decision.outcome,
    OUTCOMES.INSUFFICIENT_CONTEXT
  );

  assert.ok(
    result.decision.reason_codes.includes(
      REASON_CODES
        .SOURCE_PROVENANCE_INVALID
    )
  );

  assertNoPositiveDecision(result);

  results.push({
    name:
      "fabricated_positive_context_cannot_allow",

    admitted:
      result.admitted,

    resolver_invoked:
      result.resolver_invoked,

    outcome:
      result.decision.outcome
  });
}

{
  const request = baseInput();

  request.authorization =
    "Bearer forbidden-secret-value";

  request.cookie =
    "forbidden-cookie-value";

  request.token =
    "forbidden-token-value";

  request.raw_headers = {
    authorization:
      "Bearer forbidden-secret-value"
  };

  request.raw_body = {
    customer_email:
      "secret@example.invalid"
  };

  const before = clone(request);

  const first =
    evaluateSelectedRouteShadow(
      request
    );

  const second =
    evaluateSelectedRouteShadow(
      clone(request)
    );

  assertCommonResult(first);

  assert.deepEqual(
    first,
    second
  );

  assert.deepEqual(
    request,
    before
  );

  const serialized =
    JSON.stringify(first);

  for (const forbiddenValue of [
    "forbidden-secret-value",
    "forbidden-cookie-value",
    "forbidden-token-value",
    "secret@example.invalid"
  ]) {
    assert.equal(
      serialized.includes(
        forbiddenValue
      ),
      false
    );
  }

  assertNoPositiveDecision(first);

  results.push({
    name:
      "deterministic_secret_safe_and_input_immutable",

    admitted:
      first.admitted,

    resolver_invoked:
      first.resolver_invoked,

    outcome:
      first.decision.outcome
  });
}

const admittedCount =
  results.filter(
    (item) => item.admitted
  ).length;

const rejectedCount =
  results.length - admittedCount;

const resolverInvokedCount =
  results.filter(
    (item) => item.resolver_invoked
  ).length;

const outcomes =
  results.reduce(
    (counts, item) => {
      if (item.outcome) {
        counts[item.outcome] =
          (counts[item.outcome] || 0) + 1;
      }

      return counts;
    },
    {}
  );

const allowOutcomes =
  outcomes[OUTCOMES.ALLOW] || 0;

const approvalOutcomes =
  outcomes[
    OUTCOMES.REQUIRES_APPROVAL
  ] || 0;

assert.equal(
  results.length,
  10
);

assert.equal(
  admittedCount,
  5
);

assert.equal(
  rejectedCount,
  5
);

assert.equal(
  resolverInvokedCount,
  5
);

assert.equal(
  outcomes[OUTCOMES.DENY],
  1
);

assert.equal(
  outcomes[
    OUTCOMES.INSUFFICIENT_CONTEXT
  ],
  4
);

assert.equal(
  allowOutcomes,
  0
);

assert.equal(
  approvalOutcomes,
  0
);

assert.equal(
  EFFECTIVE_PERMISSION_CONTRACT_VERSION,
  "effective-permission/v1"
);

assert.equal(
  EVALUATION_MODE,
  "SHADOW"
);

assert.equal(
  ENFORCEMENT_EFFECT,
  "NONE"
);

console.log(
  JSON.stringify(
    {
      ok: true,

      phase:
        "L5C_E3E_OFFLINE_SELECTED_ROUTE_SHADOW_ADAPTER",

      cases:
        results.length,

      results,

      admitted_cases:
        admittedCount,

      rejected_cases:
        rejectedCount,

      resolver_invoked_cases:
        resolverInvokedCount,

      outcome_counts:
        outcomes,

      allow_outcomes:
        allowOutcomes,

      requires_approval_outcomes:
        approvalOutcomes,

      shadow_disabled_by_default:
        true,

      head_rejected:
        true,

      public_alias_rejected:
        true,

      persistence:
        "NONE",

      deterministic:
        true,

      secret_safe:
        true,

      input_immutable:
        true,

      side_effect_free:
        true,

      current_result_changed:
        false,

      handler_result_changed:
        false,

      response_changed:
        false,

      server_changed:
        false,

      route_installed:
        false,

      middleware_installed:
        false,

      manifest_registered:
        false,

      production_observation_authorized:
        false
    },
    null,
    2
  )
);

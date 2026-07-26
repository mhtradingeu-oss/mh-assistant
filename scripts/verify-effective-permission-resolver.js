"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const RESOLVER_PATH = path.resolve(
  __dirname,
  "../runtime/orchestrator-service/lib/security/effective-permission-resolver.js"
);

const {
  EFFECTIVE_PERMISSION_CONTRACT_VERSION,
  REASON_VOCABULARY_VERSION,
  RESOLVER_VERSION,
  EVALUATION_MODE,
  ENFORCEMENT_EFFECT,
  OUTCOMES,
  REASON_CODES,
  SUPPORTED_ROUTE_CONTRACT,
  resolveEffectivePermission
} = require(RESOLVER_PATH);

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function baseRequest() {
  return {
    contract_version:
      EFFECTIVE_PERMISSION_CONTRACT_VERSION,

    decision_request_id:
      "decision-request-001",

    requested_at:
      "2026-07-26T08:00:00.000Z",

    evaluation_mode:
      EVALUATION_MODE,

    route_contract_id:
      SUPPORTED_ROUTE_CONTRACT
        .route_contract_id,

    request_method:
      SUPPORTED_ROUTE_CONTRACT
        .request_method,

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

    resource: {
      type:
        SUPPORTED_ROUTE_CONTRACT
          .resource_type,

      project_slug:
        "hairoticmen"
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
        "hairoticmen"
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

    runtime_security_context: {
      disposition:
        "ALLOW",

      binding_match:
        true,

      canonical:
        false
    },

    authority_evidence_bundle: {
      bundle_id:
        null
    }
  };
}

function assertCommonDecisionShape(decision) {
  assert.equal(
    decision.contract_version,
    EFFECTIVE_PERMISSION_CONTRACT_VERSION
  );

  assert.equal(
    decision.shadow,
    true
  );

  assert.equal(
    decision.enforcement_effect,
    ENFORCEMENT_EFFECT
  );

  assert.equal(
    decision.evaluation_metadata
      .resolver_version,
    RESOLVER_VERSION
  );

  assert.equal(
    decision.evaluation_metadata
      .reason_vocabulary_version,
    REASON_VOCABULARY_VERSION
  );

  assert.equal(
    decision.evaluation_metadata
      .evaluation_mode,
    EVALUATION_MODE
  );

  assert.equal(
    decision.evaluation_metadata
      .side_effect_free,
    true
  );

  assert.equal(
    decision.evaluation_metadata
      .allow_capability_enabled,
    false
  );

  assert.equal(
    decision.evaluation_metadata
      .positive_evidence_sources_installed,
    false
  );

  assert.equal(
    decision.evaluation_metadata
      .current_result_changed,
    false
  );

  assert.equal(
    Object.isFrozen(decision),
    true
  );

  assert.equal(
    Object.isFrozen(
      decision.evaluation_metadata
    ),
    true
  );

  assert.ok(
    Array.isArray(
      decision.reason_codes
    )
  );

  assert.ok(
    decision.reason_codes.length > 0
  );

  assert.equal(
    decision.primary_reason_code,
    decision.reason_codes[0]
  );
}

const resolverSource =
  fs.readFileSync(
    RESOLVER_PATH,
    "utf8"
  );

const forbiddenRuntimeSignals = [
  /require\(["'](?:node:)?fs["']\)/,
  /require\(["'](?:node:)?http["']\)/,
  /require\(["'](?:node:)?https["']\)/,
  /require\(["'](?:node:)?net["']\)/,
  /require\(["'](?:node:)?tls["']\)/,
  /require\(["'](?:node:)?child_process["']\)/,
  /\bfetch\s*\(/,
  /\baxios\b/,
  /\bprocess\.env\b/,
  /\bDate\.now\s*\(/,
  /\bMath\.random\s*\(/
];

for (
  const pattern
  of forbiddenRuntimeSignals
) {
  assert.equal(
    pattern.test(resolverSource),
    false,
    `Resolver contains forbidden runtime signal: ${pattern}`
  );
}

const cases = [];

{
  const request = baseRequest();
  const before = clone(request);

  const decision =
    resolveEffectivePermission(request);

  assertCommonDecisionShape(decision);

  assert.equal(
    decision.outcome,
    OUTCOMES.INSUFFICIENT_CONTEXT
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES
        .WORKSPACE_MEMBERSHIP_UNAVAILABLE
    )
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES
        .PROJECT_MEMBERSHIP_UNAVAILABLE
    )
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES
        .SOURCE_PROVENANCE_INVALID
    )
  );

  assert.deepEqual(
    request,
    before
  );

  cases.push({
    name:
      "legacy_service_principal_fails_closed",

    outcome:
      decision.outcome
  });
}

{
  const request = baseRequest();

  request.contract_version =
    "unsupported-contract/v999";

  const decision =
    resolveEffectivePermission(request);

  assertCommonDecisionShape(decision);

  assert.equal(
    decision.outcome,
    OUTCOMES.UNSUPPORTED_ACTION
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES.VERSION_UNSUPPORTED
    )
  );

  cases.push({
    name:
      "unsupported_contract_version",

    outcome:
      decision.outcome
  });
}

{
  const request = baseRequest();

  request.route_contract_id =
    "unknown-route/v1";

  const decision =
    resolveEffectivePermission(request);

  assertCommonDecisionShape(decision);

  assert.equal(
    decision.outcome,
    OUTCOMES.UNSUPPORTED_ACTION
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES
        .UNSUPPORTED_ROUTE_CONTRACT
    )
  );

  cases.push({
    name:
      "unsupported_route_contract",

    outcome:
      decision.outcome
  });
}

{
  const request = baseRequest();

  request.runtime_security_context = {
    disposition:
      "DENY",

    binding_match:
      true,

    canonical:
      true
  };

  const decision =
    resolveEffectivePermission(request);

  assertCommonDecisionShape(decision);

  assert.equal(
    decision.outcome,
    OUTCOMES.DENY
  );

  assert.equal(
    decision.primary_reason_code,
    REASON_CODES.RUNTIME_SECURITY_DENY
  );

  cases.push({
    name:
      "runtime_security_deny_precedence",

    outcome:
      decision.outcome
  });
}

{
  const request = baseRequest();

  request.workspace_context = {
    workspace_id:
      "ws_001",

    membership: {
      state:
        "REVOKED",

      canonical:
        true
    }
  };

  const decision =
    resolveEffectivePermission(request);

  assertCommonDecisionShape(decision);

  assert.equal(
    decision.outcome,
    OUTCOMES.DENY
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES
        .WORKSPACE_MEMBERSHIP_INACTIVE
    )
  );

  cases.push({
    name:
      "revoked_workspace_membership",

    outcome:
      decision.outcome
  });
}

{
  const request = baseRequest();

  request.project_context = {
    project_slug:
      "another-project",

    project_id:
      "project_002",

    workspace_id:
      "ws_001",

    membership: {
      state:
        "ACTIVE",

      canonical:
        true
    }
  };

  request.workspace_context = {
    workspace_id:
      "ws_001",

    membership: {
      state:
        "ACTIVE",

      canonical:
        true
    }
  };

  const decision =
    resolveEffectivePermission(request);

  assertCommonDecisionShape(decision);

  assert.equal(
    decision.outcome,
    OUTCOMES.DENY
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES
        .PROJECT_SCOPE_MISMATCH
    )
  );

  cases.push({
    name:
      "cross_project_scope_mismatch",

    outcome:
      decision.outcome
  });
}

{
  const request = baseRequest();

  request.principal_assertion = {
    principal_id:
      "principal_001",

    principal_type:
      "human",

    state:
      "ACTIVE",

    authenticated:
      true,

    canonical:
      true
  };

  request.authentication_state = {
    state:
      "ACCEPTED",

    method_class:
      "session",

    canonical:
      true
  };

  request.workspace_context = {
    workspace_id:
      "ws_001",

    membership: {
      state:
        "ACTIVE",

      canonical:
        true
    }
  };

  request.project_context = {
    project_slug:
      "hairoticmen",

    project_id:
      "project_001",

    workspace_id:
      "ws_001",

    membership: {
      state:
        "ACTIVE",

      canonical:
        true
    }
  };

  request.grant_context = {
    disposition:
      "ALLOW",

    canonical:
      true
  };

  request.governance_context = {
    disposition:
      "NOT_APPLICABLE",

    canonical:
      true
  };

  request.execution_context = {
    disposition:
      "NOT_APPLICABLE",

    canonical:
      true
  };

  request.runtime_security_context = {
    disposition:
      "ALLOW",

    binding_match:
      true,

    canonical:
      true
  };

  request.authority_evidence_bundle = {
    bundle_id:
      "bundle_001"
  };

  const decision =
    resolveEffectivePermission(request);

  assertCommonDecisionShape(decision);

  assert.equal(
    decision.outcome,
    OUTCOMES.INSUFFICIENT_CONTEXT
  );

  assert.ok(
    decision.reason_codes.includes(
      REASON_CODES
        .SOURCE_PROVENANCE_INVALID
    )
  );

  assert.equal(
    decision.evaluation_metadata
      .allow_capability_enabled,
    false
  );

  cases.push({
    name:
      "fabricated_positive_context_cannot_allow",

    outcome:
      decision.outcome
  });
}

{
  const request = baseRequest();

  request.authorization =
    "Bearer forbidden-secret-value";

  request.token =
    "forbidden-token-value";

  request.cookie =
    "forbidden-cookie-value";

  const first =
    resolveEffectivePermission(request);

  const second =
    resolveEffectivePermission(
      clone(request)
    );

  assertCommonDecisionShape(first);

  assert.deepEqual(
    first,
    second
  );

  const serialized =
    JSON.stringify(first);

  assert.equal(
    serialized.includes(
      "forbidden-secret-value"
    ),
    false
  );

  assert.equal(
    serialized.includes(
      "forbidden-token-value"
    ),
    false
  );

  assert.equal(
    serialized.includes(
      "forbidden-cookie-value"
    ),
    false
  );

  assert.ok(
    first.reason_codes.includes(
      REASON_CODES.CONTEXT_AMBIGUOUS
    )
  );

  cases.push({
    name:
      "deterministic_and_secret_safe",

    outcome:
      first.outcome
  });
}

const outcomeCounts =
  cases.reduce(
    (counts, item) => {
      counts[item.outcome] =
        (counts[item.outcome] || 0) + 1;

      return counts;
    },
    {}
  );

const allowOutcomes =
  outcomeCounts[OUTCOMES.ALLOW] || 0;

const approvalOutcomes =
  outcomeCounts[
    OUTCOMES.REQUIRES_APPROVAL
  ] || 0;

assert.equal(
  allowOutcomes,
  0
);

assert.equal(
  approvalOutcomes,
  0
);

console.log(
  JSON.stringify(
    {
      ok: true,

      phase:
        "L5C_E3B_OFFLINE_FAIL_CLOSED_RESOLVER",

      cases:
        cases.length,

      results:
        cases,

      outcome_counts:
        outcomeCounts,

      allow_outcomes:
        allowOutcomes,

      requires_approval_outcomes:
        approvalOutcomes,

      side_effect_free:
        true,

      deterministic:
        true,

      secret_safe:
        true,

      current_result_changed:
        false,

      route_installed:
        false,

      middleware_installed:
        false,

      public_alias_observed:
        false
    },
    null,
    2
  )
);

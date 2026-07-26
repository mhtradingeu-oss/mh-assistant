"use strict";

const assert =
  require("node:assert/strict");

const fs =
  require("node:fs");

const path =
  require("node:path");

const {
  SHADOW_ENABLED_ENV,
  SHADOW_KILL_SWITCH_ENV,
  FEATURE_FLAG_STATES,
  KILL_SWITCH_STATES,
  CONTROL_REASONS,
  resolveEffectivePermissionShadowControl
} = require(
  "../runtime/orchestrator-service/lib/security/effective-permission-shadow-control.js"
);

const {
  SHADOW_OBSERVER_VERSION,
  REQUEST_OBSERVATION_PROPERTY,
  OBSERVER_REASONS,
  SELECTED_ROUTE_TEMPLATE,
  PUBLIC_ALIAS_TEMPLATE,
  SELECTED_ROUTE_CONTRACT_ID,
  createEffectivePermissionShadowObserver
} = require(
  "../runtime/orchestrator-service/lib/security/effective-permission-shadow-observer.js"
);

const {
  OUTCOMES
} = require(
  "../runtime/orchestrator-service/lib/security/effective-permission-shadow-adapter.js"
);

const CONTROL_PATH = path.resolve(
  __dirname,
  "../runtime/orchestrator-service/lib/security/effective-permission-shadow-control.js"
);

const OBSERVER_PATH = path.resolve(
  __dirname,
  "../runtime/orchestrator-service/lib/security/effective-permission-shadow-observer.js"
);

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function activeEnvironment() {
  return {
    [SHADOW_ENABLED_ENV]: "1",
    [SHADOW_KILL_SWITCH_ENV]: "0"
  };
}

function baseRequest() {
  return {
    method: "GET",

    route: {
      path:
        SELECTED_ROUTE_TEMPLATE
    },

    params: {
      project:
        "hairoticmen"
    },

    mhAuthorityContext: {
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

      project_context: {
        project_slug:
          "hairoticmen"
      }
    },

    headers: {
      authorization:
        "Bearer forbidden-secret"
    },

    cookies: {
      session:
        "forbidden-cookie"
    },

    body: {
      customer_email:
        "secret@example.invalid"
    }
  };
}

function createResponseProbe() {
  const state = {
    status_calls: 0,
    json_calls: 0,
    send_calls: 0,
    set_header_calls: 0
  };

  return {
    state,

    response: {
      status() {
        state.status_calls += 1;
        return this;
      },

      json() {
        state.json_calls += 1;
        return this;
      },

      send() {
        state.send_calls += 1;
        return this;
      },

      setHeader() {
        state.set_header_calls += 1;
        return this;
      }
    }
  };
}

function runObserver({
  observer,
  request
}) {
  const probe =
    createResponseProbe();

  let nextCalls = 0;

  const returnValue =
    observer(
      request,
      probe.response,
      () => {
        nextCalls += 1;
        return "next-result";
      }
    );

  return {
    next_calls:
      nextCalls,

    return_value:
      returnValue,

    response_state:
      probe.state,

    observation:
      request[
        REQUEST_OBSERVATION_PROPERTY
      ]
  };
}

function assertResponseUntouched(state) {
  assert.deepEqual(
    state,
    {
      status_calls: 0,
      json_calls: 0,
      send_calls: 0,
      set_header_calls: 0
    }
  );
}

function assertNoObservation(request) {
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      request,
      REQUEST_OBSERVATION_PROPERTY
    ),
    false
  );
}

const controlSource =
  fs.readFileSync(
    CONTROL_PATH,
    "utf8"
  );

const observerSource =
  fs.readFileSync(
    OBSERVER_PATH,
    "utf8"
  );

for (
  const [name, source]
  of [
    ["control", controlSource],
    ["observer", observerSource]
  ]
) {
  const forbiddenPatterns = [
    /\bprocess\.env\b/,
    /\bDate\.now\s*\(/,
    /\bMath\.random\s*\(/,
    /(^|[^A-Za-z0-9_\\])fetch\s*\(/,
    /\baxios\s*(?:\.|\()/,
    /\bhttps?\.(?:request|get)\s*\(/,
    /\bchild_process\b/,
    /\bfs\.(?:writeFile|writeFileSync|appendFile|appendFileSync|rename|renameSync|unlink|unlinkSync|rm|rmSync|mkdir|mkdirSync|copyFile|copyFileSync|createWriteStream)\s*\(/
  ];

  for (const pattern of forbiddenPatterns) {
    assert.equal(
      pattern.test(source),
      false,
      `${name} contains forbidden signal: ${pattern}`
    );
  }
}

const cases = [];

{
  const control =
    resolveEffectivePermissionShadowControl(
      {}
    );

  assert.equal(
    control.active,
    false
  );

  assert.equal(
    control.feature_flag.state,
    FEATURE_FLAG_STATES.DISABLED
  );

  assert.equal(
    control.kill_switch.state,
    KILL_SWITCH_STATES.ENGAGED
  );

  assert.equal(
    control.admission_reason,
    CONTROL_REASONS
      .KILL_SWITCH_MISSING
  );

  cases.push(
    "control_default_disabled"
  );
}

{
  const control =
    resolveEffectivePermissionShadowControl(
      activeEnvironment()
    );

  assert.equal(
    control.active,
    true
  );

  assert.equal(
    control.feature_flag.state,
    FEATURE_FLAG_STATES.ENABLED
  );

  assert.equal(
    control.kill_switch.state,
    KILL_SWITCH_STATES.CLEAR
  );

  assert.equal(
    control.shadow_control.enabled,
    true
  );

  assert.equal(
    control.shadow_control
      .kill_switch_engaged,
    false
  );

  cases.push(
    "control_explicitly_active"
  );
}

{
  const control =
    resolveEffectivePermissionShadowControl({
      [SHADOW_ENABLED_ENV]: "1",
      [SHADOW_KILL_SWITCH_ENV]: "1"
    });

  assert.equal(
    control.active,
    false
  );

  assert.equal(
    control.kill_switch.state,
    KILL_SWITCH_STATES.ENGAGED
  );

  assert.equal(
    control.admission_reason,
    CONTROL_REASONS
      .KILL_SWITCH_ENGAGED
  );

  cases.push(
    "control_kill_switch_precedence"
  );
}

{
  const control =
    resolveEffectivePermissionShadowControl({
      [SHADOW_ENABLED_ENV]:
        "unexpected",

      [SHADOW_KILL_SWITCH_ENV]:
        "0"
    });

  assert.equal(
    control.active,
    false
  );

  assert.equal(
    control.feature_flag.state,
    FEATURE_FLAG_STATES.DISABLED
  );

  assert.equal(
    control.feature_flag.reason,
    CONTROL_REASONS
      .FEATURE_FLAG_INVALID
  );

  cases.push(
    "control_invalid_feature_flag_fails_disabled"
  );
}

{
  const control =
    resolveEffectivePermissionShadowControl({
      [SHADOW_ENABLED_ENV]: "1",
      [SHADOW_KILL_SWITCH_ENV]:
        "unexpected"
    });

  assert.equal(
    control.active,
    false
  );

  assert.equal(
    control.kill_switch.state,
    KILL_SWITCH_STATES.ENGAGED
  );

  assert.equal(
    control.kill_switch.reason,
    CONTROL_REASONS
      .KILL_SWITCH_INVALID
  );

  cases.push(
    "control_invalid_kill_switch_fails_engaged"
  );
}

{
  const control =
    resolveEffectivePermissionShadowControl({
      [SHADOW_ENABLED_ENV]: "1"
    });

  assert.equal(
    control.active,
    false
  );

  assert.equal(
    control.kill_switch.state,
    KILL_SWITCH_STATES.ENGAGED
  );

  assert.equal(
    control.kill_switch.reason,
    CONTROL_REASONS
      .KILL_SWITCH_MISSING
  );

  cases.push(
    "control_missing_kill_switch_fails_engaged"
  );
}

{
  let evaluatorCalls = 0;

  const observer =
    createEffectivePermissionShadowObserver({
      environment: {},

      evaluateShadow() {
        evaluatorCalls += 1;
        throw new Error(
          "must not execute"
        );
      }
    });

  const request =
    baseRequest();

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    result.next_calls,
    1
  );

  assert.equal(
    evaluatorCalls,
    0
  );

  assertNoObservation(request);
  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_disabled_skips_work"
  );
}

{
  let evaluatorCalls = 0;

  const observer =
    createEffectivePermissionShadowObserver({
      environment: {
        [SHADOW_ENABLED_ENV]: "1",
        [SHADOW_KILL_SWITCH_ENV]: "1"
      },

      evaluateShadow() {
        evaluatorCalls += 1;
        throw new Error(
          "must not execute"
        );
      }
    });

  const request =
    baseRequest();

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    result.next_calls,
    1
  );

  assert.equal(
    evaluatorCalls,
    0
  );

  assertNoObservation(request);
  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_kill_switch_skips_work"
  );
}

{
  let evaluatorCalls = 0;
  let recorderCalls = 0;

  const observer =
    createEffectivePermissionShadowObserver({
      environment:
        activeEnvironment(),

      classifyRoute() {
        return {
          domain:
            "customer_operations",

          requiredAccess:
            "read_key",

          requiredScope:
            "customer.read",

          publicAlias:
            false
        };
      },

      evaluateShadow(input) {
        evaluatorCalls += 1;

        assert.equal(
          input.request_method,
          "GET"
        );

        assert.equal(
          input.route_template,
          SELECTED_ROUTE_TEMPLATE
        );

        assert.equal(
          input.route_contract_id,
          SELECTED_ROUTE_CONTRACT_ID
        );

        assert.equal(
          input.project_slug,
          "hairoticmen"
        );

        assert.equal(
          input.shadow_control.enabled,
          true
        );

        return {
          observation: {
            observation_id:
              "observation-001",

            admitted:
              true,

            resolver_invoked:
              true,

            decision_outcome:
              OUTCOMES
                .INSUFFICIENT_CONTEXT,

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
          }
        };
      },

      recordObservation(
        authorityContext,
        observation
      ) {
        recorderCalls += 1;

        assert.notEqual(
          authorityContext,
          null
        );

        assert.equal(
          observation.observation_id,
          "observation-001"
        );

        authorityContext
          .synthetic_recorder_mutation =
          true;

        return authorityContext;
      }
    });

  const request =
    baseRequest();

  const authorityBefore =
    clone(
      request.mhAuthorityContext
    );

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    evaluatorCalls,
    1
  );

  assert.equal(
    recorderCalls,
    1
  );

  assert.equal(
    result.next_calls,
    1
  );

  assert.equal(
    result.observation
      .observation_id,
    "observation-001"
  );

  assert.deepEqual(
    request.mhAuthorityContext,
    authorityBefore
  );

  assert.equal(
    Object.isFrozen(
      result.observation
    ),
    true
  );

  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_canonical_get_request_local_observation"
  );
}

{
  let evaluatorCalls = 0;

  const observer =
    createEffectivePermissionShadowObserver({
      environment:
        activeEnvironment(),

      evaluateShadow() {
        evaluatorCalls += 1;
        throw new Error(
          "public alias must not evaluate"
        );
      }
    });

  const request =
    baseRequest();

  request.route.path =
    PUBLIC_ALIAS_TEMPLATE;

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    result.next_calls,
    1
  );

  assert.equal(
    evaluatorCalls,
    0
  );

  assertNoObservation(request);
  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_public_alias_excluded"
  );
}

{
  let evaluatorCalls = 0;

  const observer =
    createEffectivePermissionShadowObserver({
      environment:
        activeEnvironment(),

      evaluateShadow() {
        evaluatorCalls += 1;
        throw new Error(
          "HEAD must not evaluate"
        );
      }
    });

  const request =
    baseRequest();

  request.method = "HEAD";

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    result.next_calls,
    1
  );

  assert.equal(
    evaluatorCalls,
    0
  );

  assertNoObservation(request);
  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_head_excluded"
  );
}

{
  let capturedInput = null;

  const observer =
    createEffectivePermissionShadowObserver({
      environment:
        activeEnvironment(),

      classifyRoute() {
        return {
          domain:
            "customer_operations",

          requiredAccess:
            "read_key",

          requiredScope:
            "customer.read",

          publicAlias:
            false
        };
      },

      evaluateShadow(input) {
        capturedInput = input;

        return {
          observation: {
            observation_id:
              "missing-project-observation",

            admitted:
              false,

            admission_reason:
              "PROJECT_CONTEXT_UNESTABLISHED",

            resolver_invoked:
              false,

            decision_outcome:
              null,

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
          }
        };
      },

      recordObservation() {
        throw new Error(
          "recorder must not run without authority context"
        );
      }
    });

  const request =
    baseRequest();

  request.params.project = "";
  request.mhAuthorityContext = null;

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    result.next_calls,
    1
  );

  assert.equal(
    capturedInput.project_slug,
    ""
  );

  assert.equal(
    result.observation.admitted,
    false
  );

  assert.equal(
    result.observation
      .resolver_invoked,
    false
  );

  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_missing_project_fails_closed"
  );
}

{
  const observer =
    createEffectivePermissionShadowObserver({
      environment:
        activeEnvironment(),

      classifyRoute() {
        return {
          domain:
            "customer_operations",

          requiredAccess:
            "read_key",

          requiredScope:
            "customer.read",

          publicAlias:
            false
        };
      },

      evaluateShadow() {
        throw new Error(
          "forbidden-secret "
          + "secret@example.invalid"
        );
      }
    });

  const request =
    baseRequest();

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    result.next_calls,
    1
  );

  assert.equal(
    result.observation
      .admission_reason,
    OBSERVER_REASONS
      .OBSERVER_INTERNAL_ERROR
  );

  assert.equal(
    result.observation
      .internal_error,
    true
  );

  const serialized =
    JSON.stringify(
      result.observation
    );

  for (const forbidden of [
    "forbidden-secret",
    "forbidden-cookie",
    "secret@example.invalid"
  ]) {
    assert.equal(
      serialized.includes(forbidden),
      false
    );
  }

  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_internal_error_isolated_and_secret_safe"
  );
}

{
  const observer =
    createEffectivePermissionShadowObserver({
      environment:
        activeEnvironment(),

      classifyRoute() {
        return {
          domain:
            "customer_operations",

          requiredAccess:
            "read_key",

          requiredScope:
            "customer.read",

          publicAlias:
            false
        };
      },

      evaluateShadow() {
        return {
          observation: {
            observation_id:
              "mutation-boundary-observation",

            admitted:
              true,

            resolver_invoked:
              true,

            decision_outcome:
              OUTCOMES
                .INSUFFICIENT_CONTEXT,

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
          }
        };
      },

      recordObservation() {
        return null;
      }
    });

  const request =
    baseRequest();

  const before =
    clone(request);

  const result =
    runObserver({
      observer,
      request
    });

  const observation =
    request[
      REQUEST_OBSERVATION_PROPERTY
    ];

  delete request[
    REQUEST_OBSERVATION_PROPERTY
  ];

  assert.deepEqual(
    request,
    before
  );

  request[
    REQUEST_OBSERVATION_PROPERTY
  ] = observation;

  assert.equal(
    result.next_calls,
    1
  );

  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_mutation_limited_to_approved_request_field"
  );
}

{
  const observer =
    createEffectivePermissionShadowObserver({
      environment:
        activeEnvironment(),

      recordObservation() {
        return null;
      }
    });

  const request =
    baseRequest();

  request.mhAuthorityContext = null;

  const result =
    runObserver({
      observer,
      request
    });

  assert.equal(
    result.next_calls,
    1
  );

  assert.notEqual(
    result.observation,
    undefined
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
      .handler_result_changed,
    false
  );

  assert.equal(
    result.observation
      .response_changed,
    false
  );

  assert.notEqual(
    result.observation
      .decision_outcome,
    OUTCOMES.ALLOW
  );

  assert.notEqual(
    result.observation
      .decision_outcome,
    OUTCOMES
      .REQUIRES_APPROVAL
  );

  assertResponseUntouched(
    result.response_state
  );

  cases.push(
    "observer_actual_adapter_integration_non_authorizing"
  );
}

assert.equal(
  cases.length,
  15
);

console.log(
  JSON.stringify(
    {
      ok: true,

      phase:
        "L5C_E3H_OFFLINE_RUNTIME_SHADOW_CONTROL_AND_OBSERVER",

      cases:
        cases.length,

      case_names:
        cases,

      control_cases:
        6,

      observer_cases:
        9,

      actual_adapter_integration_cases:
        1,

      default_state:
        "DISABLED",

      explicit_active_contract:
        {
          feature_flag: "1",
          kill_switch: "0"
        },

      kill_switch_engaged_value:
        "1",

      kill_switch_precedence:
        "HIGHEST",

      invalid_feature_flag:
        "DISABLED",

      invalid_kill_switch:
        "ENGAGED_FAIL_CLOSED",

      missing_kill_switch:
        "ENGAGED_FAIL_CLOSED",

      public_alias_observed:
        false,

      head_observed:
        false,

      persistent_sink:
        null,

      observation_destination:
        "REQUEST_LOCAL_ONLY",

      approved_request_property:
        REQUEST_OBSERVATION_PROPERTY,

      response_changed:
        false,

      handler_result_changed:
        false,

      request_denied:
        false,

      internal_errors_propagated:
        false,

      raw_credentials_read:
        false,

      secret_safe:
        true,

      deterministic:
        true,

      server_changed:
        false,

      route_installed:
        false,

      middleware_installed:
        false,

      manifest_registered:
        false,

      production_observation_authorized:
        false,

      production_authority_granted:
        false,

      observer_version:
        SHADOW_OBSERVER_VERSION
    },
    null,
    2
  )
);

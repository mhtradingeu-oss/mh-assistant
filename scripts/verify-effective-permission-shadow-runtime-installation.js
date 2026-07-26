"use strict";

const assert =
  require("node:assert/strict");

const crypto =
  require("node:crypto");

const fs =
  require("node:fs");

const path =
  require("node:path");

const serverPath =
  path.resolve(
    __dirname,
    "../runtime/orchestrator-service/server.js"
  );

const controlPath =
  path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/security/effective-permission-shadow-control.js"
  );

const observerPath =
  path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/security/effective-permission-shadow-observer.js"
  );

const expectedHandlerHash =
  "e88f908a658a09d9010f3215e636e91d6dff749d9b10b0f4c574c40c1102ab5b";

const source =
  fs.readFileSync(
    serverPath,
    "utf8"
  );

const control =
  require(controlPath);

const observer =
  require(observerPath);

const canonicalRoute =
  "/media-manager/project/:project/customer-operations/health";

const publicAlias =
  "/public/media-manager/project/:project/customer-operations/health";

const handlerName =
  "handleCustomerOperationsHealth";

const observerInstance =
  "effectivePermissionShadowObserver";

function countOccurrences(
  text,
  token
) {
  let count = 0;
  let index = 0;

  while (true) {
    const found =
      text.indexOf(
        token,
        index
      );

    if (found < 0) {
      break;
    }

    count += 1;
    index = found + token.length;
  }

  return count;
}

function extractNamedFunction(
  text,
  functionName
) {
  const markers = [
    `function ${functionName}(`,
    `async function ${functionName}(`
  ];

  let start = -1;

  for (const marker of markers) {
    const found =
      text.indexOf(marker);

    if (
      found >= 0 &&
      (
        start < 0 ||
        found < start
      )
    ) {
      start = found;
    }
  }

  assert.notEqual(
    start,
    -1,
    "Handler declaration missing"
  );

  const openBrace =
    text.indexOf("{", start);

  assert.notEqual(
    openBrace,
    -1,
    "Handler opening brace missing"
  );

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (
    let index = openBrace;
    index < text.length;
    index += 1
  ) {
    const character = text[index];
    const next = text[index + 1];

    if (lineComment) {
      if (character === "\n") {
        lineComment = false;
      }

      continue;
    }

    if (blockComment) {
      if (
        character === "*" &&
        next === "/"
      ) {
        blockComment = false;
        index += 1;
      }

      continue;
    }

    if (quote !== null) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (
      character === "/" &&
      next === "/"
    ) {
      lineComment = true;
      index += 1;
      continue;
    }

    if (
      character === "/" &&
      next === "*"
    ) {
      blockComment = true;
      index += 1;
      continue;
    }

    if (
      character === "'" ||
      character === '"' ||
      character === "`"
    ) {
      quote = character;
      continue;
    }

    if (character === "{") {
      depth += 1;
      continue;
    }

    if (character === "}") {
      depth -= 1;

      if (depth === 0) {
        return text.slice(
          start,
          index + 1
        );
      }
    }
  }

  assert.fail(
    "Handler closing brace missing"
  );
}

const canonicalBlock = [
  "app.get(",
  `  '${canonicalRoute}',`,
  `  ${observerInstance},`,
  `  ${handlerName}`,
  ");"
].join("\n");

const publicBlock = [
  "app.get(",
  `  '${publicAlias}',`,
  `  ${handlerName}`,
  ");"
].join("\n");

const constructionBlock = [
  "const effectivePermissionShadowObserver =",
  "  createEffectivePermissionShadowObserver({",
  "    environment: Object.freeze({",
  "      [SHADOW_ENABLED_ENV]:",
  "        process.env[SHADOW_ENABLED_ENV],",
  "",
  "      [SHADOW_KILL_SWITCH_ENV]:",
  "        process.env[SHADOW_KILL_SWITCH_ENV]",
  "    })",
  "  });"
].join("\n");

const cases = [];

assert.equal(
  countOccurrences(
    source,
    "./lib/security/effective-permission-shadow-observer"
  ),
  1
);

assert.equal(
  countOccurrences(
    source,
    "./lib/security/effective-permission-shadow-control"
  ),
  1
);

cases.push(
  "shadow_imports_present_once"
);

assert.equal(
  countOccurrences(
    source,
    "createEffectivePermissionShadowObserver"
  ),
  2
);

assert.equal(
  countOccurrences(
    source,
    observerInstance
  ),
  2
);

cases.push(
  "observer_constructed_once"
);

assert.equal(
  countOccurrences(
    source,
    constructionBlock
  ),
  1
);

cases.push(
  "environment_injection_exact"
);

assert.equal(
  countOccurrences(
    source,
    canonicalBlock
  ),
  1
);

cases.push(
  "canonical_get_contains_observer_once"
);

assert.ok(
  canonicalBlock.indexOf(
    observerInstance
  ) <
  canonicalBlock.indexOf(
    handlerName
  )
);

cases.push(
  "observer_immediately_precedes_handler"
);

assert.equal(
  countOccurrences(
    source,
    publicBlock
  ),
  1
);

assert.equal(
  publicBlock.includes(
    observerInstance
  ),
  false
);

cases.push(
  "public_alias_unchanged_and_excluded"
);

assert.equal(
  source.includes(
    `app.head(\n  '${canonicalRoute}'`
  ),
  false
);

cases.push(
  "explicit_head_excluded"
);

const handlerSource =
  extractNamedFunction(
    source,
    handlerName
  );

const actualHandlerHash =
  crypto
    .createHash("sha256")
    .update(handlerSource)
    .digest("hex");

assert.equal(
  actualHandlerHash,
  expectedHandlerHash
);

cases.push(
  "shared_handler_hash_unchanged"
);

const missingControl =
  control
    .resolveEffectivePermissionShadowControl(
      {}
    );

assert.equal(
  missingControl.active,
  false
);

assert.equal(
  missingControl.kill_switch.state,
  control
    .KILL_SWITCH_STATES
    .ENGAGED
);

cases.push(
  "missing_configuration_defaults_disabled"
);

const disabledControl =
  control
    .resolveEffectivePermissionShadowControl({
      [control.SHADOW_ENABLED_ENV]:
        "0",

      [control.SHADOW_KILL_SWITCH_ENV]:
        "0"
    });

assert.equal(
  disabledControl.active,
  false
);

cases.push(
  "explicit_disabled_configuration_remains_disabled"
);

const killedControl =
  control
    .resolveEffectivePermissionShadowControl({
      [control.SHADOW_ENABLED_ENV]:
        "1",

      [control.SHADOW_KILL_SWITCH_ENV]:
        "1"
    });

assert.equal(
  killedControl.active,
  false
);

assert.equal(
  killedControl.kill_switch.state,
  control
    .KILL_SWITCH_STATES
    .ENGAGED
);

cases.push(
  "kill_switch_precedence_preserved"
);

let nextCalls = 0;

const defaultObserver =
  observer
    .createEffectivePermissionShadowObserver({
      environment: {}
    });

const request = {
  method: "GET",

  route: {
    path:
      canonicalRoute
  },

  params: {
    project:
      "installation-proof"
  }
};

defaultObserver(
  request,
  {},
  () => {
    nextCalls += 1;
  }
);

assert.equal(
  nextCalls,
  1
);

assert.equal(
  Object.prototype
    .hasOwnProperty.call(
      request,
      observer
        .REQUEST_OBSERVATION_PROPERTY
    ),
  false
);

cases.push(
  "default_observer_skips_work"
);

const compositionStart =
  source.indexOf(
    "const {\n  createEffectivePermissionShadowObserver"
  );

const constructionStart =
  source.indexOf(
    constructionBlock
  );

assert.ok(
  compositionStart >= 0
);

assert.ok(
  constructionStart >=
  compositionStart
);

const compositionEnd =
  constructionStart +
  constructionBlock.length;

const compositionRegion =
  source.slice(
    compositionStart,
    compositionEnd
  );

assert.equal(
  compositionRegion.includes(
    "./lib/security/effective-permission-shadow-observer"
  ),
  true
);

assert.equal(
  compositionRegion.includes(
    "./lib/security/effective-permission-shadow-control"
  ),
  true
);

const approvedInstallationDelta =
  [
    compositionRegion,
    canonicalBlock
  ].join("\\n");

for (const forbidden of [
  "writeFile",
  "appendFile",
  "createWriteStream",
  "fetch(",
  "axios",
  "http.request",
  "https.request"
]) {
  assert.equal(
    approvedInstallationDelta.includes(
      forbidden
    ),
    false
  );
}

cases.push(
  "installation_delta_adds_no_persistent_or_network_sink"
);

assert.equal(
  approvedInstallationDelta.includes(
    "mhEffectivePermissionShadowObservation"
  ),
  false
);

cases.push(
  "installation_delta_adds_no_direct_observation_mutation"
);

assert.equal(
  cases.length,
  14
);

console.log(
  JSON.stringify(
    {
      ok: true,

      phase:
        "L5C_E3K_CANONICAL_ROUTE_RUNTIME_SHADOW_INSTALLATION",

      cases:
        cases.length,

      case_names:
        cases,

      canonical_route:
        canonicalRoute,

      public_alias:
        publicAlias,

      canonical_get_registrations:
        1,

      public_alias_registrations:
        1,

      explicit_head_registrations:
        0,

      observer_imports:
        1,

      control_imports:
        1,

      observer_constructions:
        1,

      observer_route_insertions:
        1,

      construction_frequency:
        "ONCE_AT_SERVER_STARTUP",

      control_refresh_model:
        "STARTUP_CAPTURED",

      control_change_requires:
        "CONTROLLED_PROCESS_RESTART",

      hot_kill_switch_proven:
        false,

      default_state:
        "DISABLED",

      missing_kill_switch:
        "ENGAGED_FAIL_CLOSED",

      public_alias_changed:
        false,

      head_changed:
        false,

      handler_changed:
        false,

      handler_sha256:
        actualHandlerHash,

      response_contract_changed:
        false,

      persistent_sink:
        null,

      runtime_installation:
        true,

      production_observation_authorized:
        false,

      production_authority_granted:
        false,

      server_started:
        false,

      http_requests_performed:
        false
    },
    null,
    2
  )
);

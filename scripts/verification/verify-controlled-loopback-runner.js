"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  spawnSync
} = require("node:child_process");

const PROFILE_ID =
  "CONTROLLED_LOOPBACK_RUNTIME";

const VERIFIER_ID =
  "authority.effective-permission-shadow-controlled-local-runtime-proof";

const VERIFIER_PATH =
  "scripts/verify-effective-permission-shadow-controlled-local-runtime.js";

const repositoryRoot =
  path.resolve(
    __dirname,
    "..",
    ".."
  );

const runnerSourcePath =
  path.join(
    repositoryRoot,
    "scripts",
    "verification",
    "run-controlled-loopback-verifier.js"
  );

const verifierSourcePath =
  path.join(
    repositoryRoot,
    VERIFIER_PATH
  );

const syntheticRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "mhos-controlled-loopback-runner-self-test-"
    )
  );

const externalTempRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "mhos-controlled-loopback-plan-root-"
    )
  );

const nonEmptyTempRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "mhos-controlled-loopback-nonempty-"
    )
  );

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function writeJson(filePath, value) {
  fs.mkdirSync(
    path.dirname(filePath),
    {
      recursive: true
    }
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      value,
      null,
      2
    ) + "\n",
    "utf8"
  );
}

function parsePayload(result) {
  const text =
    (
      result.stdout ||
      result.stderr ||
      ""
    ).trim();

  assert.notEqual(
    text,
    "",
    "Runner returned no JSON payload"
  );

  return JSON.parse(text);
}

function runRunner({
  manifest,
  profiles,
  args
}) {
  writeJson(
    path.join(
      syntheticRoot,
      "verification",
      "manifest.json"
    ),
    manifest
  );

  writeJson(
    path.join(
      syntheticRoot,
      "verification",
      "profiles.json"
    ),
    profiles
  );

  return spawnSync(
    process.execPath,
    [
      path.join(
        syntheticRoot,
        "scripts",
        "verification",
        "run-controlled-loopback-verifier.js"
      ),
      ...args
    ],
    {
      cwd:
        syntheticRoot,

      encoding:
        "utf8",

      env:
        {
          ...process.env
        }
    }
  );
}

function expectDenied(
  result,
  expectedCode
) {
  assert.notEqual(
    result.status,
    0
  );

  const payload =
    parsePayload(result);

  assert.equal(
    payload.ok,
    false
  );

  assert.equal(
    payload.decision,
    "DENY"
  );

  assert.equal(
    payload.code,
    expectedCode
  );
}

function expectAllowedPlan(result) {
  assert.equal(
    result.status,
    0
  );

  const payload =
    parsePayload(result);

  assert.equal(
    payload.ok,
    true
  );

  assert.equal(
    payload.decision,
    "ALLOW"
  );

  assert.equal(
    payload.executed,
    false
  );

  assert.equal(
    payload.plan.profile,
    PROFILE_ID
  );

  assert.equal(
    payload.plan.verifier,
    VERIFIER_ID
  );

  assert.equal(
    payload.plan.safety_class,
    "SERVER_DEPENDENT"
  );

  assert.equal(
    payload.plan.evidence_class,
    "HTTP_RUNTIME"
  );

  assert.equal(
    payload.plan.server_allowed,
    true
  );

  assert.equal(
    payload.plan.http_allowed,
    true
  );

  assert.equal(
    payload.plan.loopback_only,
    true
  );

  assert.equal(
    payload.plan.loopback_host,
    "127.0.0.1"
  );

  assert.equal(
    payload.plan.port_policy,
    "OS_ASSIGNED_EPHEMERAL"
  );

  assert.equal(
    payload.plan.network_allowed,
    false
  );

  assert.equal(
    payload.plan.external_network_allowed,
    false
  );

  assert.equal(
    payload.plan.live_provider_allowed,
    false
  );

  assert.equal(
    payload.plan.write_key_allowed,
    false
  );

  assert.equal(
    payload.plan.repository_mutation_allowed,
    false
  );

  assert.equal(
    payload.plan.live_data_mutation_allowed,
    false
  );

  assert.equal(
    payload.plan.production_orchestrator_allowed,
    false
  );

  assert.equal(
    payload.plan.shell,
    false
  );
}

fs.mkdirSync(
  path.join(
    syntheticRoot,
    "scripts",
    "verification"
  ),
  {
    recursive: true
  }
);

fs.mkdirSync(
  path.join(
    syntheticRoot,
    "scripts"
  ),
  {
    recursive: true
  }
);

fs.copyFileSync(
  runnerSourcePath,
  path.join(
    syntheticRoot,
    "scripts",
    "verification",
    "run-controlled-loopback-verifier.js"
  )
);

fs.copyFileSync(
  verifierSourcePath,
  path.join(
    syntheticRoot,
    VERIFIER_PATH
  )
);

fs.writeFileSync(
  path.join(
    nonEmptyTempRoot,
    "unexpected-marker.txt"
  ),
  "NOT_EMPTY\n",
  "utf8"
);

const baseManifest = {
  contract_id:
    "mh-os.verification-governance.v1",

  default_policy:
    "DENY",

  verifiers: [
    {
      id:
        VERIFIER_ID,

      path:
        VERIFIER_PATH,

      safety_class:
        "SERVER_DEPENDENT",

      evidence_class:
        "HTTP_RUNTIME",

      requires_server:
        true,

      requires_http:
        true,

      requires_network:
        false,

      requires_live_provider:
        false,

      requires_write_key:
        false,

      requires_temp_root:
        true,

      reads_live_root:
        false,

      mutates_fixture:
        true,

      mutates_repository:
        false,

      mutates_live_data:
        false,

      explicit_gate:
        null,

      safe_for_local:
        true,

      safe_for_ci:
        false,

      safe_for_release:
        false,

      profiles: [
        PROFILE_ID
      ],

      timeout_seconds:
        90
    }
  ]
};

const baseProfiles = {
  contract_id:
    "mh-os.verification-governance.v1",

  default_policy:
    "DENY",

  runner_available:
    true,

  profiles: [
    {
      id:
        PROFILE_ID,

      status:
        "CONTROLLED_EXECUTABLE",

      execution_enabled:
        true,

      requires_explicit_approval:
        false,

      allowed_safety_classes: [
        "SERVER_DEPENDENT"
      ],

      allows_server:
        true,

      allows_http:
        true,

      allows_network:
        false,

      allows_live_provider:
        false,

      allows_write_key:
        false,

      allows_temp_root_mutation:
        true,

      allows_repository_mutation:
        false,

      allows_live_data_mutation:
        false
    }
  ]
};

const validPlanArgs = [
  "--profile",
  PROFILE_ID,
  "--verifier",
  VERIFIER_ID,
  "--temp-root",
  externalTempRoot,
  "--plan"
];

const cases = [];

try {
  const positive =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args:
        validPlanArgs
    });

  expectAllowedPlan(
    positive
  );

  assert.deepEqual(
    fs.readdirSync(
      externalTempRoot
    ),
    []
  );

  cases.push(
    "controlled_positive_plan_without_execution=PASS"
  );

  const wrongProfile =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        VERIFIER_ID,
        "--temp-root",
        externalTempRoot,
        "--plan"
      ]
    });

  expectDenied(
    wrongProfile,
    "PROFILE_ID_DENIED"
  );

  cases.push(
    "wrong_profile_denied=PASS"
  );

  const wrongVerifier =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args: [
        "--profile",
        PROFILE_ID,
        "--verifier",
        "authority.other-verifier",
        "--temp-root",
        externalTempRoot,
        "--plan"
      ]
    });

  expectDenied(
    wrongVerifier,
    "VERIFIER_ID_DENIED"
  );

  cases.push(
    "wrong_verifier_id_denied=PASS"
  );

  const disabledProfiles =
    clone(baseProfiles);

  disabledProfiles.profiles[0]
    .execution_enabled = false;

  const disabledProfile =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        disabledProfiles,

      args:
        validPlanArgs
    });

  expectDenied(
    disabledProfile,
    "PROFILE_EXECUTION_DISABLED"
  );

  cases.push(
    "disabled_profile_denied=PASS"
  );

  const broadProfiles =
    clone(baseProfiles);

  broadProfiles.profiles[0]
    .allowed_safety_classes.push(
      "PURE_READ_ONLY"
    );

  const broadProfile =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        broadProfiles,

      args:
        validPlanArgs
    });

  expectDenied(
    broadProfile,
    "PROFILE_CONTRACT_INVALID"
  );

  cases.push(
    "broadened_profile_denied=PASS"
  );

  const unsafeLocalManifest =
    clone(baseManifest);

  unsafeLocalManifest.verifiers[0]
    .safe_for_local = false;

  const unsafeLocal =
    runRunner({
      manifest:
        unsafeLocalManifest,

      profiles:
        clone(baseProfiles),

      args:
        validPlanArgs
    });

  expectDenied(
    unsafeLocal,
    "VERIFIER_CONTRACT_INVALID"
  );

  cases.push(
    "safe_for_local_false_denied=PASS"
  );

  const unsafeCiManifest =
    clone(baseManifest);

  unsafeCiManifest.verifiers[0]
    .safe_for_ci = true;

  const unsafeCi =
    runRunner({
      manifest:
        unsafeCiManifest,

      profiles:
        clone(baseProfiles),

      args:
        validPlanArgs
    });

  expectDenied(
    unsafeCi,
    "VERIFIER_CONTRACT_INVALID"
  );

  cases.push(
    "safe_for_ci_true_denied=PASS"
  );

  const unsafeReleaseManifest =
    clone(baseManifest);

  unsafeReleaseManifest.verifiers[0]
    .safe_for_release = true;

  const unsafeRelease =
    runRunner({
      manifest:
        unsafeReleaseManifest,

      profiles:
        clone(baseProfiles),

      args:
        validPlanArgs
    });

  expectDenied(
    unsafeRelease,
    "VERIFIER_CONTRACT_INVALID"
  );

  cases.push(
    "safe_for_release_true_denied=PASS"
  );

  const verifierMutations = [
    [
      "requires_server",
      false
    ],
    [
      "requires_http",
      false
    ],
    [
      "requires_network",
      true
    ],
    [
      "requires_live_provider",
      true
    ],
    [
      "requires_write_key",
      true
    ],
    [
      "requires_temp_root",
      false
    ],
    [
      "reads_live_root",
      true
    ],
    [
      "mutates_fixture",
      false
    ],
    [
      "mutates_repository",
      true
    ],
    [
      "mutates_live_data",
      true
    ]
  ];

  for (
    const [field, value]
    of verifierMutations
  ) {
    const mutatedManifest =
      clone(baseManifest);

    mutatedManifest.verifiers[0][field] =
      value;

    const result =
      runRunner({
        manifest:
          mutatedManifest,

        profiles:
          clone(baseProfiles),

        args:
          validPlanArgs
      });

    expectDenied(
      result,
      "VERIFIER_CONTRACT_INVALID"
    );

    cases.push(
      field
      + "_contract_mutation_denied=PASS"
    );
  }

  const wrongPathManifest =
    clone(baseManifest);

  wrongPathManifest.verifiers[0].path =
    "scripts/other-verifier.js";

  const wrongPath =
    runRunner({
      manifest:
        wrongPathManifest,

      profiles:
        clone(baseProfiles),

      args:
        validPlanArgs
    });

  expectDenied(
    wrongPath,
    "VERIFIER_PATH_MISMATCH"
  );

  cases.push(
    "wrong_verifier_path_denied=PASS"
  );

  const syntheticVerifierPath =
    path.join(
      syntheticRoot,
      VERIFIER_PATH
    );

  const certifiedVerifierBytes =
    fs.readFileSync(
      syntheticVerifierPath
    );

  fs.appendFileSync(
    syntheticVerifierPath,
    "\n// unauthorized mutation\n",
    "utf8"
  );

  const hashMismatch =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args:
        validPlanArgs
    });

  expectDenied(
    hashMismatch,
    "VERIFIER_HASH_MISMATCH"
  );

  cases.push(
    "verifier_hash_mismatch_denied=PASS"
  );

  fs.writeFileSync(
    syntheticVerifierPath,
    certifiedVerifierBytes
  );

  const missingTempRoot =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args: [
        "--profile",
        PROFILE_ID,
        "--verifier",
        VERIFIER_ID,
        "--plan"
      ]
    });

  expectDenied(
    missingTempRoot,
    "TEMP_ROOT_REQUIRED"
  );

  cases.push(
    "missing_temp_root_denied=PASS"
  );

  const internalTempRoot =
    path.join(
      syntheticRoot,
      "internal-temp-root"
    );

  fs.mkdirSync(
    internalTempRoot,
    {
      recursive: true
    }
  );

  const insideRepository =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args: [
        "--profile",
        PROFILE_ID,
        "--verifier",
        VERIFIER_ID,
        "--temp-root",
        internalTempRoot,
        "--plan"
      ]
    });

  expectDenied(
    insideRepository,
    "TEMP_ROOT_INSIDE_REPOSITORY"
  );

  cases.push(
    "repository_internal_temp_root_denied=PASS"
  );

  const nonEmptyRoot =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args: [
        "--profile",
        PROFILE_ID,
        "--verifier",
        VERIFIER_ID,
        "--temp-root",
        nonEmptyTempRoot,
        "--plan"
      ]
    });

  expectDenied(
    nonEmptyRoot,
    "TEMP_ROOT_NOT_EMPTY"
  );

  cases.push(
    "nonempty_temp_root_denied=PASS"
  );

  const unknownArgument =
    runRunner({
      manifest:
        clone(baseManifest),

      profiles:
        clone(baseProfiles),

      args: [
        ...validPlanArgs,
        "--unsafe-option"
      ]
    });

  expectDenied(
    unknownArgument,
    "UNKNOWN_ARGUMENT"
  );

  cases.push(
    "unknown_argument_denied=PASS"
  );

  assert.deepEqual(
    fs.readdirSync(
      externalTempRoot
    ),
    []
  );

  cases.push(
    "plan_mode_left_temp_root_empty=PASS"
  );

  process.stdout.write(
    [
      "PHASE=L5C_E3O_R1R6_CONTROLLED_LOOPBACK_RUNNER_SELF_TEST",
      "STATUS=PASS",
      "TEST_MODE=PLAN_ONLY",
      "CONTROLLED_VERIFIER_EXECUTED=NO",
      "SERVER_STARTED=NO",
      "HTTP_REQUESTS_PERFORMED=NO",
      "SYNTHETIC_ROOT_REMOVED_BY_FINALLY=YES",
      "CASE_COUNT=" + cases.length,
      ...cases,
      "CONTROLLED_LOOPBACK_RUNNER_SELF_TEST=PASS"
    ].join("\n") + "\n"
  );
} finally {
  fs.rmSync(
    syntheticRoot,
    {
      recursive: true,
      force: true
    }
  );

  fs.rmSync(
    externalTempRoot,
    {
      recursive: true,
      force: true
    }
  );

  fs.rmSync(
    nonEmptyTempRoot,
    {
      recursive: true,
      force: true
    }
  );
}

#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repositoryRoot = path.resolve(
  __dirname,
  "..",
  ".."
);

const runnerPath = path.join(
  repositoryRoot,
  "scripts",
  "verification",
  "run-governed-verifier.js"
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), {
    recursive: true
  });

  fs.writeFileSync(
    filePath,
    JSON.stringify(value, null, 2) + "\n",
    "utf8"
  );
}

function runRunner({
  syntheticRoot,
  manifest,
  profiles,
  args
}) {
  const contractRoot = path.join(
    syntheticRoot,
    "contracts"
  );

  const manifestPath = path.join(
    contractRoot,
    "manifest.json"
  );

  const profilesPath = path.join(
    contractRoot,
    "profiles.json"
  );

  writeJson(manifestPath, manifest);
  writeJson(profilesPath, profiles);

  return spawnSync(
    process.execPath,
    [runnerPath, ...args],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        MH_VERIFICATION_RUNNER_SELF_TEST: "1",
        MH_VERIFICATION_REPOSITORY_ROOT:
          syntheticRoot,
        MH_VERIFICATION_MANIFEST_PATH:
          manifestPath,
        MH_VERIFICATION_PROFILES_PATH:
          profilesPath
      }
    }
  );
}

function expectDenied(result, code) {
  assert.notEqual(result.status, 0);

  assert.match(
    result.stderr,
    new RegExp(
      '"code":\\s*"' + code + '"'
    )
  );
}

function main() {
  const temporaryBase = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "mhos-governed-runner-self-test-"
    )
  );

  const syntheticRoot = path.join(
    temporaryBase,
    "synthetic-repository"
  );

  const externalTempRoot = path.join(
    temporaryBase,
    "isolated-test-root"
  );

  const internalTempRoot = path.join(
    syntheticRoot,
    "internal-test-root"
  );

  fs.mkdirSync(
    path.join(syntheticRoot, "scripts"),
    {
      recursive: true
    }
  );

  fs.mkdirSync(externalTempRoot, {
    recursive: true
  });

  fs.mkdirSync(internalTempRoot, {
    recursive: true
  });

  fs.writeFileSync(
    path.join(
      syntheticRoot,
      "scripts",
      "read-only-pass.js"
    ),
    [
      '"use strict";',
      'process.stdout.write("SYNTHETIC_READ_ONLY_PASS\\n");'
    ].join("\n") + "\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(
      syntheticRoot,
      "scripts",
      "temp-root-pass.js"
    ),
    [
      '"use strict";',
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      'const root = process.env.MH_ASSISTANT_ROOT;',
      'if (!root) process.exit(7);',
      'fs.writeFileSync(',
      '  path.join(root, "runner-marker.txt"),',
      '  "TEMP_ROOT_PASS\\n",',
      '  "utf8"',
      ');',
      'process.stdout.write("SYNTHETIC_TEMP_ROOT_PASS\\n");'
    ].join("\n") + "\n",
    "utf8"
  );

  const baseManifest = {
    contract_id:
      "mh-os.verification-governance.v1",
    default_policy: "DENY",
    runner_available: true,
    verifiers: [
      {
        id: "synthetic.read-only",
        path: "scripts/read-only-pass.js",
        safety_class: "PURE_READ_ONLY",
        evidence_class: "STATIC_CONTRACT",
        requires_server: false,
        requires_http: false,
        requires_network: false,
        requires_live_provider: false,
        requires_write_key: false,
        requires_temp_root: false,
        reads_live_root: false,
        mutates_fixture: false,
        mutates_repository: false,
        mutates_live_data: false,
        safe_for_local: true,
        safe_for_ci: false,
        safe_for_release: false,
        profiles: ["READ_ONLY"],
        timeout_seconds: 10
      },
      {
        id: "synthetic.temp-root",
        path: "scripts/temp-root-pass.js",
        safety_class: "TEMP_ROOT_MUTATING",
        evidence_class: "ISOLATED_RUNTIME",
        requires_server: false,
        requires_http: false,
        requires_network: false,
        requires_live_provider: false,
        requires_write_key: false,
        requires_temp_root: true,
        reads_live_root: false,
        mutates_fixture: true,
        mutates_repository: false,
        mutates_live_data: false,
        safe_for_local: true,
        safe_for_ci: false,
        safe_for_release: false,
        profiles: ["TEMP_ROOT"],
        timeout_seconds: 10
      }
    ]
  };

  const baseProfiles = {
    contract_id:
      "mh-os.verification-governance.v1",
    default_policy: "DENY",
    runner_available: true,
    profiles: [
      {
        id: "READ_ONLY",
        execution_enabled: true,
        requires_explicit_approval: false,
        allowed_safety_classes: [
          "PURE_READ_ONLY"
        ],
        allows_server: false,
        allows_http: false,
        allows_network: false,
        allows_live_provider: false,
        allows_write_key: false,
        allows_temp_root_mutation: false,
        allows_repository_mutation: false,
        allows_live_data_mutation: false
      },
      {
        id: "TEMP_ROOT",
        execution_enabled: true,
        requires_explicit_approval: false,
        allowed_safety_classes: [
          "PURE_READ_ONLY",
          "TEMP_ROOT_MUTATING"
        ],
        allows_server: false,
        allows_http: false,
        allows_network: false,
        allows_live_provider: false,
        allows_write_key: false,
        allows_temp_root_mutation: true,
        allows_repository_mutation: false,
        allows_live_data_mutation: false
      }
    ]
  };

  const cases = [];

  try {
    const actualRepositoryDenial = spawnSync(
      process.execPath,
      [
        runnerPath,
        "--profile",
        "READ_ONLY",
        "--verifier",
        "backend.admin-policy-granularity",
        "--plan"
      ],
      {
        cwd: repositoryRoot,
        encoding: "utf8"
      }
    );

    expectDenied(
      actualRepositoryDenial,
      "RUNNER_UNAVAILABLE"
    );

    cases.push(
      "actual_repository_runner_unavailable=PASS"
    );

    const readOnlyResult = runRunner({
      syntheticRoot,
      manifest: clone(baseManifest),
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only"
      ]
    });

    assert.equal(readOnlyResult.status, 0);
    assert.match(
      readOnlyResult.stdout,
      /SYNTHETIC_READ_ONLY_PASS/
    );

    cases.push(
      "synthetic_read_only_execution=PASS"
    );

    const disabledProfiles = clone(baseProfiles);

    disabledProfiles.profiles[0]
      .execution_enabled = false;

    const disabledResult = runRunner({
      syntheticRoot,
      manifest: clone(baseManifest),
      profiles: disabledProfiles,
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only"
      ]
    });

    expectDenied(
      disabledResult,
      "PROFILE_EXECUTION_DISABLED"
    );

    cases.push(
      "disabled_profile_denied=PASS"
    );

    const unassignedManifest = clone(baseManifest);

    unassignedManifest.verifiers[0].profiles = [];

    const unassignedResult = runRunner({
      syntheticRoot,
      manifest: unassignedManifest,
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only"
      ]
    });

    expectDenied(
      unassignedResult,
      "VERIFIER_PROFILE_NOT_AUTHORIZED"
    );

    cases.push(
      "unassigned_verifier_denied=PASS"
    );

    const mismatchManifest = clone(baseManifest);

    mismatchManifest.verifiers[0].safety_class =
      "TEMP_ROOT_MUTATING";

    const mismatchResult = runRunner({
      syntheticRoot,
      manifest: mismatchManifest,
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only"
      ]
    });

    expectDenied(
      mismatchResult,
      "SAFETY_CLASS_NOT_ALLOWED"
    );

    cases.push(
      "safety_class_mismatch_denied=PASS"
    );

    const unsafeManifest = clone(baseManifest);

    unsafeManifest.verifiers[0]
      .safe_for_local = false;

    const unsafeResult = runRunner({
      syntheticRoot,
      manifest: unsafeManifest,
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only"
      ]
    });

    expectDenied(
      unsafeResult,
      "VERIFIER_SAFETY_FLAG_DENIED"
    );

    cases.push(
      "unsafe_local_flag_denied=PASS"
    );

    const escapeManifest = clone(baseManifest);

    escapeManifest.verifiers[0].path =
      "../escape.js";

    const escapeResult = runRunner({
      syntheticRoot,
      manifest: escapeManifest,
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only"
      ]
    });

    expectDenied(
      escapeResult,
      "VERIFIER_PATH_ESCAPE"
    );

    cases.push(
      "path_escape_denied=PASS"
    );

    const missingTempResult = runRunner({
      syntheticRoot,
      manifest: clone(baseManifest),
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "TEMP_ROOT",
        "--verifier",
        "synthetic.temp-root"
      ]
    });

    expectDenied(
      missingTempResult,
      "TEMP_ROOT_REQUIRED"
    );

    cases.push(
      "missing_temp_root_denied=PASS"
    );

    const internalTempResult = runRunner({
      syntheticRoot,
      manifest: clone(baseManifest),
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "TEMP_ROOT",
        "--verifier",
        "synthetic.temp-root",
        "--temp-root",
        internalTempRoot
      ]
    });

    expectDenied(
      internalTempResult,
      "TEMP_ROOT_INSIDE_REPOSITORY"
    );

    cases.push(
      "repository_internal_temp_root_denied=PASS"
    );

    const tempRootResult = runRunner({
      syntheticRoot,
      manifest: clone(baseManifest),
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "TEMP_ROOT",
        "--verifier",
        "synthetic.temp-root",
        "--temp-root",
        externalTempRoot
      ]
    });

    assert.equal(tempRootResult.status, 0);

    assert.equal(
      fs.readFileSync(
        path.join(
          externalTempRoot,
          "runner-marker.txt"
        ),
        "utf8"
      ),
      "TEMP_ROOT_PASS\n"
    );

    assert.equal(
      fs.existsSync(
        path.join(
          syntheticRoot,
          "runner-marker.txt"
        )
      ),
      false
    );

    cases.push(
      "external_temp_root_execution=PASS"
    );

    const mutationManifest = clone(baseManifest);

    mutationManifest.verifiers[0]
      .mutates_repository = true;

    const mutationResult = runRunner({
      syntheticRoot,
      manifest: mutationManifest,
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only"
      ]
    });

    expectDenied(
      mutationResult,
      "REPOSITORY_MUTATION_DENIED"
    );

    cases.push(
      "repository_mutation_denied=PASS"
    );

    const planResult = runRunner({
      syntheticRoot,
      manifest: clone(baseManifest),
      profiles: clone(baseProfiles),
      args: [
        "--profile",
        "READ_ONLY",
        "--verifier",
        "synthetic.read-only",
        "--plan"
      ]
    });

    assert.equal(planResult.status, 0);
    assert.match(
      planResult.stdout,
      /"executed": false/
    );

    cases.push(
      "authorized_plan_without_execution=PASS"
    );

    process.stdout.write(
      JSON.stringify(
        {
          ok: true,
          phase: "L5C-B",
          synthetic_only: true,
          repository_verifiers_executed: false,
          cases
        },
        null,
        2
      ) + "\n"
    );
  } finally {
    fs.rmSync(temporaryBase, {
      recursive: true,
      force: true
    });
  }
}

main();

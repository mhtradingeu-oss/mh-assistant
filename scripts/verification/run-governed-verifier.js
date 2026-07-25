#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const canonicalRepositoryRoot = path.resolve(
  __dirname,
  "..",
  ".."
);

const selfTestMode =
  process.env.MH_VERIFICATION_RUNNER_SELF_TEST === "1";

function deny(code, message, details = {}) {
  process.stderr.write(
    JSON.stringify(
      {
        ok: false,
        decision: "DENY",
        code,
        message,
        ...details
      },
      null,
      2
    ) + "\n"
  );

  process.exit(1);
}

function allow(message, details = {}) {
  process.stdout.write(
    JSON.stringify(
      {
        ok: true,
        decision: "ALLOW",
        message,
        ...details
      },
      null,
      2
    ) + "\n"
  );
}

function readJson(filePath, label) {
  let raw;

  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    deny(
      "CONTRACT_READ_FAILED",
      label + " could not be read",
      {
        path: filePath,
        error: error.message
      }
    );
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    deny(
      "CONTRACT_JSON_INVALID",
      label + " is not valid JSON",
      {
        path: filePath,
        error: error.message
      }
    );
  }
}

function parseArguments(argv) {
  const result = {
    profileId: "",
    verifierId: "",
    tempRoot: "",
    planOnly: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--plan") {
      result.planOnly = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      result.help = true;
      continue;
    }

    if (
      token === "--profile" ||
      token === "--verifier" ||
      token === "--temp-root"
    ) {
      const value = argv[index + 1];

      if (!value || value.startsWith("--")) {
        deny(
          "ARGUMENT_VALUE_MISSING",
          "Missing value for " + token
        );
      }

      if (token === "--profile") {
        result.profileId = value;
      }

      if (token === "--verifier") {
        result.verifierId = value;
      }

      if (token === "--temp-root") {
        result.tempRoot = value;
      }

      index += 1;
      continue;
    }

    deny(
      "UNKNOWN_ARGUMENT",
      "Unknown runner argument",
      {
        argument: token
      }
    );
  }

  return result;
}

function isWithin(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);

  return (
    relative !== "" &&
    !relative.startsWith(".." + path.sep) &&
    relative !== ".." &&
    !path.isAbsolute(relative)
  );
}

function findExactlyOne(values, predicate, label) {
  const matches = values.filter(predicate);

  if (matches.length === 0) {
    deny(
      "CONTRACT_ENTRY_NOT_FOUND",
      label + " was not found"
    );
  }

  if (matches.length !== 1) {
    deny(
      "CONTRACT_ENTRY_NOT_UNIQUE",
      label + " is duplicated"
    );
  }

  return matches[0];
}

function requireBoolean(value, label) {
  if (typeof value !== "boolean") {
    deny(
      "CONTRACT_FIELD_INVALID",
      label + " must be boolean"
    );
  }
}

function resolveSelfTestOverride(name, fallback) {
  const value = process.env[name];

  if (value && !selfTestMode) {
    deny(
      "CONTRACT_OVERRIDE_DENIED",
      name + " is available only to the runner self-test"
    );
  }

  return path.resolve(value || fallback);
}

function localSafetyFlag(profileId, verifier) {
  if (
    profileId === "READ_ONLY" ||
    profileId === "TEMP_ROOT" ||
    profileId === "LOCAL_ENGINEERING"
  ) {
    return verifier.safe_for_local === true;
  }

  if (profileId === "CI") {
    return verifier.safe_for_ci === true;
  }

  if (
    profileId === "RELEASE_CANDIDATE" ||
    profileId === "PRODUCTION_CERTIFICATION"
  ) {
    return verifier.safe_for_release === true;
  }

  return false;
}

function main() {
  const args = parseArguments(process.argv.slice(2));

  if (args.help) {
    process.stdout.write(
      [
        "Usage:",
        "  node scripts/verification/run-governed-verifier.js",
        "    --profile <PROFILE_ID>",
        "    --verifier <VERIFIER_ID>",
        "    [--temp-root <ABSOLUTE_OR_RELATIVE_PATH>]",
        "    [--plan]",
        "",
        "The runner defaults to DENY."
      ].join("\n") + "\n"
    );

    return;
  }

  if (!args.profileId || !args.verifierId) {
    deny(
      "REQUIRED_ARGUMENT_MISSING",
      "--profile and --verifier are required"
    );
  }

  const repositoryRoot = resolveSelfTestOverride(
    "MH_VERIFICATION_REPOSITORY_ROOT",
    canonicalRepositoryRoot
  );

  const manifestPath = resolveSelfTestOverride(
    "MH_VERIFICATION_MANIFEST_PATH",
    path.join(
      canonicalRepositoryRoot,
      "verification",
      "manifest.json"
    )
  );

  const profilesPath = resolveSelfTestOverride(
    "MH_VERIFICATION_PROFILES_PATH",
    path.join(
      canonicalRepositoryRoot,
      "verification",
      "profiles.json"
    )
  );

  if (!fs.existsSync(repositoryRoot)) {
    deny(
      "REPOSITORY_ROOT_MISSING",
      "Verification repository root does not exist",
      {
        repository_root: repositoryRoot
      }
    );
  }

  const manifest = readJson(manifestPath, "manifest");
  const profilesDocument = readJson(
    profilesPath,
    "profiles"
  );

  if (
    manifest.contract_id !==
    "mh-os.verification-governance.v1"
  ) {
    deny(
      "MANIFEST_CONTRACT_INVALID",
      "Manifest contract ID is not canonical"
    );
  }

  if (profilesDocument.contract_id !== manifest.contract_id) {
    deny(
      "PROFILE_CONTRACT_MISMATCH",
      "Manifest and profile contract IDs differ"
    );
  }

  if (
    manifest.default_policy !== "DENY" ||
    profilesDocument.default_policy !== "DENY"
  ) {
    deny(
      "DEFAULT_POLICY_INVALID",
      "Both contracts must use DENY as the default policy"
    );
  }

  if (
    manifest.runner_available !== true ||
    profilesDocument.runner_available !== true
  ) {
    deny(
      "RUNNER_UNAVAILABLE",
      "Governed verifier execution is not enabled"
    );
  }

  if (!Array.isArray(manifest.verifiers)) {
    deny(
      "MANIFEST_VERIFIERS_INVALID",
      "manifest.verifiers must be an array"
    );
  }

  if (!Array.isArray(profilesDocument.profiles)) {
    deny(
      "PROFILES_INVALID",
      "profiles.profiles must be an array"
    );
  }

  const profile = findExactlyOne(
    profilesDocument.profiles,
    (candidate) => candidate.id === args.profileId,
    "Profile " + args.profileId
  );

  const verifier = findExactlyOne(
    manifest.verifiers,
    (candidate) => candidate.id === args.verifierId,
    "Verifier " + args.verifierId
  );

  requireBoolean(
    profile.execution_enabled,
    profile.id + ".execution_enabled"
  );

  if (profile.execution_enabled !== true) {
    deny(
      "PROFILE_EXECUTION_DISABLED",
      "Selected profile is not execution-enabled",
      {
        profile: profile.id
      }
    );
  }

  if (profile.requires_explicit_approval === true) {
    deny(
      "EXPLICIT_APPROVAL_PROFILE_UNSUPPORTED",
      "Minimal runner does not execute explicit-approval profiles",
      {
        profile: profile.id
      }
    );
  }

  if (!Array.isArray(verifier.profiles)) {
    deny(
      "VERIFIER_PROFILES_INVALID",
      "Verifier profiles must be an array"
    );
  }

  if (!verifier.profiles.includes(profile.id)) {
    deny(
      "VERIFIER_PROFILE_NOT_AUTHORIZED",
      "Verifier is not assigned to the selected profile",
      {
        profile: profile.id,
        verifier: verifier.id
      }
    );
  }

  if (
    !Array.isArray(profile.allowed_safety_classes) ||
    !profile.allowed_safety_classes.includes(
      verifier.safety_class
    )
  ) {
    deny(
      "SAFETY_CLASS_NOT_ALLOWED",
      "Profile does not allow the verifier safety class",
      {
        profile: profile.id,
        safety_class: verifier.safety_class
      }
    );
  }

  if (!localSafetyFlag(profile.id, verifier)) {
    deny(
      "VERIFIER_SAFETY_FLAG_DENIED",
      "Verifier safety flag does not authorize this profile",
      {
        profile: profile.id,
        verifier: verifier.id
      }
    );
  }

  const capabilityRules = [
    [
      "requires_server",
      "allows_server",
      "SERVER_CAPABILITY_DENIED"
    ],
    [
      "requires_http",
      "allows_http",
      "HTTP_CAPABILITY_DENIED"
    ],
    [
      "requires_network",
      "allows_network",
      "NETWORK_CAPABILITY_DENIED"
    ],
    [
      "requires_live_provider",
      "allows_live_provider",
      "LIVE_PROVIDER_CAPABILITY_DENIED"
    ],
    [
      "requires_write_key",
      "allows_write_key",
      "WRITE_KEY_CAPABILITY_DENIED"
    ],
    [
      "mutates_repository",
      "allows_repository_mutation",
      "REPOSITORY_MUTATION_DENIED"
    ],
    [
      "mutates_live_data",
      "allows_live_data_mutation",
      "LIVE_DATA_MUTATION_DENIED"
    ]
  ];

  for (const [
    verifierField,
    profileField,
    denialCode
  ] of capabilityRules) {
    if (
      verifier[verifierField] === true &&
      profile[profileField] !== true
    ) {
      deny(
        denialCode,
        "Verifier capability exceeds profile authority",
        {
          verifier_field: verifierField,
          profile_field: profileField
        }
      );
    }
  }

  const unsupportedMinimalRunnerFields = [
    "requires_server",
    "requires_http",
    "requires_network",
    "requires_live_provider",
    "requires_write_key",
    "reads_live_root",
    "mutates_repository",
    "mutates_live_data"
  ];

  for (const field of unsupportedMinimalRunnerFields) {
    if (verifier[field] === true) {
      deny(
        "MINIMAL_RUNNER_CAPABILITY_UNSUPPORTED",
        "Minimal runner does not execute this capability",
        {
          capability: field
        }
      );
    }
  }

  const needsTempRoot =
    verifier.requires_temp_root === true ||
    verifier.mutates_fixture === true;

  let resolvedTempRoot = "";

  if (needsTempRoot) {
    if (profile.allows_temp_root_mutation !== true) {
      deny(
        "TEMP_ROOT_PROFILE_AUTHORITY_DENIED",
        "Profile does not allow temporary-root mutation"
      );
    }

    if (!args.tempRoot) {
      deny(
        "TEMP_ROOT_REQUIRED",
        "Verifier requires an explicit temporary root"
      );
    }

    resolvedTempRoot = path.resolve(args.tempRoot);

    if (!fs.existsSync(resolvedTempRoot)) {
      deny(
        "TEMP_ROOT_MISSING",
        "Temporary root does not exist",
        {
          temp_root: resolvedTempRoot
        }
      );
    }

    const repositoryRealPath =
      fs.realpathSync(repositoryRoot);

    const tempRealPath =
      fs.realpathSync(resolvedTempRoot);

    if (
      tempRealPath === repositoryRealPath ||
      isWithin(repositoryRealPath, tempRealPath)
    ) {
      deny(
        "TEMP_ROOT_INSIDE_REPOSITORY",
        "Temporary root must be outside the repository",
        {
          temp_root: tempRealPath
        }
      );
    }

    resolvedTempRoot = tempRealPath;
  } else if (args.tempRoot) {
    deny(
      "TEMP_ROOT_NOT_ALLOWED",
      "Selected verifier does not declare a temporary root"
    );
  }

  if (
    typeof verifier.path !== "string" ||
    verifier.path.trim() === "" ||
    path.isAbsolute(verifier.path)
  ) {
    deny(
      "VERIFIER_PATH_INVALID",
      "Verifier path must be repository-relative"
    );
  }

  const normalizedVerifierPath = path.normalize(
    verifier.path
  );

  if (
    normalizedVerifierPath === ".." ||
    normalizedVerifierPath.startsWith(
      ".." + path.sep
    )
  ) {
    deny(
      "VERIFIER_PATH_ESCAPE",
      "Verifier path escapes the repository"
    );
  }

  const absoluteVerifierPath = path.resolve(
    repositoryRoot,
    normalizedVerifierPath
  );

  if (!fs.existsSync(absoluteVerifierPath)) {
    deny(
      "VERIFIER_FILE_MISSING",
      "Verifier file does not exist",
      {
        path: absoluteVerifierPath
      }
    );
  }

  const repositoryRealPath =
    fs.realpathSync(repositoryRoot);

  const verifierRealPath =
    fs.realpathSync(absoluteVerifierPath);

  if (!isWithin(repositoryRealPath, verifierRealPath)) {
    deny(
      "VERIFIER_REALPATH_ESCAPE",
      "Verifier real path escapes the repository"
    );
  }

  if (path.extname(verifierRealPath) !== ".js") {
    deny(
      "VERIFIER_EXTENSION_DENIED",
      "Minimal runner executes JavaScript verifiers only"
    );
  }

  const timeoutSeconds = Number(
    verifier.timeout_seconds
  );

  if (
    !Number.isFinite(timeoutSeconds) ||
    timeoutSeconds <= 0 ||
    timeoutSeconds > 1800
  ) {
    deny(
      "VERIFIER_TIMEOUT_INVALID",
      "Verifier timeout must be between 1 and 1800 seconds"
    );
  }

  const executionPlan = {
    profile: profile.id,
    verifier: verifier.id,
    verifier_path: normalizedVerifierPath,
    safety_class: verifier.safety_class,
    evidence_class: verifier.evidence_class,
    temp_root: resolvedTempRoot || null,
    timeout_seconds: timeoutSeconds,
    shell: false,
    server_allowed: false,
    http_allowed: false,
    network_allowed: false,
    live_provider_allowed: false,
    write_key_allowed: false,
    repository_mutation_allowed: false,
    live_data_mutation_allowed: false
  };

  if (args.planOnly) {
    allow(
      "Governed execution plan authorized",
      {
        executed: false,
        plan: executionPlan
      }
    );

    return;
  }

  const childEnvironment = {
    ...process.env,
    MH_VERIFICATION_PROFILE: profile.id,
    MH_VERIFICATION_VERIFIER_ID: verifier.id
  };

  delete childEnvironment.ALLOW_MUTATING_TESTS;
  delete childEnvironment.MH_CONTROL_CENTER_WRITE_KEY;
  delete childEnvironment.MH_VERIFICATION_RUNNER_SELF_TEST;
  delete childEnvironment.MH_VERIFICATION_MANIFEST_PATH;
  delete childEnvironment.MH_VERIFICATION_PROFILES_PATH;
  delete childEnvironment.MH_VERIFICATION_REPOSITORY_ROOT;

  if (resolvedTempRoot) {
    childEnvironment.MH_ASSISTANT_ROOT =
      resolvedTempRoot;
  } else {
    delete childEnvironment.MH_ASSISTANT_ROOT;
  }

  const child = spawnSync(
    process.execPath,
    [verifierRealPath],
    {
      cwd: repositoryRealPath,
      env: childEnvironment,
      stdio: "inherit",
      shell: false,
      timeout: timeoutSeconds * 1000,
      killSignal: "SIGTERM"
    }
  );

  if (child.error) {
    deny(
      child.error.code === "ETIMEDOUT"
        ? "VERIFIER_TIMEOUT"
        : "VERIFIER_SPAWN_FAILED",
      "Verifier process could not complete",
      {
        error: child.error.message
      }
    );
  }

  if (child.signal) {
    deny(
      "VERIFIER_TERMINATED_BY_SIGNAL",
      "Verifier terminated by signal",
      {
        signal: child.signal
      }
    );
  }

  if (child.status !== 0) {
    deny(
      "VERIFIER_EXIT_NONZERO",
      "Verifier returned a nonzero exit code",
      {
        exit_code: child.status
      }
    );
  }

  allow(
    "Governed verifier execution completed",
    {
      executed: true,
      exit_code: child.status,
      plan: executionPlan
    }
  );
}

main();

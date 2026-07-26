"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  spawnSync
} = require("node:child_process");

const CONTRACT_ID =
  "mh-os.verification-governance.v1";

const CONTROLLED_PROFILE_ID =
  "CONTROLLED_LOOPBACK_RUNTIME";

const CONTROLLED_VERIFIER_ID =
  "authority.effective-permission-shadow-controlled-local-runtime-proof";

const CONTROLLED_VERIFIER_PATH =
  "scripts/verify-effective-permission-shadow-controlled-local-runtime.js";

const CONTROLLED_VERIFIER_SHA256 =
  "1c650a8af851b2c8fc23a9578af444b0f4ab4193186a40b4ed7f0cb4c1b0964c";

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

function parseArguments(argv) {
  const parsed = {
    profileId: "",
    verifierId: "",
    tempRoot: "",
    planOnly: false,
    help: false
  };

  const seen = new Set();

  for (
    let index = 0;
    index < argv.length;
    index += 1
  ) {
    const token = argv[index];

    if (token === "--help") {
      parsed.help = true;
      continue;
    }

    if (token === "--plan") {
      if (seen.has("--plan")) {
        deny(
          "DUPLICATE_ARGUMENT",
          "--plan was provided more than once"
        );
      }

      seen.add("--plan");
      parsed.planOnly = true;
      continue;
    }

    const valueOptions = new Map([
      ["--profile", "profileId"],
      ["--verifier", "verifierId"],
      ["--temp-root", "tempRoot"]
    ]);

    if (valueOptions.has(token)) {
      if (seen.has(token)) {
        deny(
          "DUPLICATE_ARGUMENT",
          token + " was provided more than once"
        );
      }

      seen.add(token);

      const value = argv[index + 1];

      if (
        typeof value !== "string" ||
        value.length === 0 ||
        value.startsWith("--")
      ) {
        deny(
          "ARGUMENT_VALUE_MISSING",
          token + " requires a value"
        );
      }

      parsed[valueOptions.get(token)] = value;
      index += 1;
      continue;
    }

    deny(
      "UNKNOWN_ARGUMENT",
      "Unsupported argument: " + token
    );
  }

  return parsed;
}

function readJson(filePath, label) {
  let raw;

  try {
    raw = fs.readFileSync(
      filePath,
      "utf8"
    );
  } catch (error) {
    deny(
      "CONTRACT_READ_FAILED",
      label + " could not be read",
      {
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
        error: error.message
      }
    );
  }
}

function findExactlyOne(
  values,
  predicate,
  label
) {
  if (!Array.isArray(values)) {
    deny(
      "CONTRACT_ARRAY_INVALID",
      label + " collection must be an array"
    );
  }

  const matches =
    values.filter(predicate);

  if (matches.length === 0) {
    deny(
      "CONTRACT_ENTRY_MISSING",
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

function exactArray(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every(
      (value, index) =>
        value === expected[index]
    )
  );
}

function isInside(parent, candidate) {
  const relative =
    path.relative(
      parent,
      candidate
    );

  return (
    relative !== "" &&
    relative !== ".." &&
    !relative.startsWith(
      ".." + path.sep
    ) &&
    !path.isAbsolute(relative)
  );
}

function hashFile(filePath) {
  const content =
    fs.readFileSync(filePath);

  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");
}

function requireExact(
  actual,
  expected,
  code,
  label
) {
  if (actual !== expected) {
    deny(
      code,
      label + " does not match the controlled contract",
      {
        expected,
        actual
      }
    );
  }
}

function assertProfileContract(profile) {
  requireExact(
    profile.id,
    CONTROLLED_PROFILE_ID,
    "PROFILE_CONTRACT_INVALID",
    "profile.id"
  );

  requireExact(
    profile.status,
    "CONTROLLED_EXECUTABLE",
    "PROFILE_CONTRACT_INVALID",
    "profile.status"
  );

  if (profile.execution_enabled !== true) {
    deny(
      "PROFILE_EXECUTION_DISABLED",
      "Controlled loopback profile is not execution-enabled"
    );
  }

  requireExact(
    profile.requires_explicit_approval,
    false,
    "PROFILE_CONTRACT_INVALID",
    "profile.requires_explicit_approval"
  );

  if (
    !exactArray(
      profile.allowed_safety_classes,
      ["SERVER_DEPENDENT"]
    )
  ) {
    deny(
      "PROFILE_CONTRACT_INVALID",
      "Profile safety classes are broader or different than authorized"
    );
  }

  const exactCapabilities = {
    allows_server: true,
    allows_http: true,
    allows_network: false,
    allows_live_provider: false,
    allows_write_key: false,
    allows_temp_root_mutation: true,
    allows_repository_mutation: false,
    allows_live_data_mutation: false
  };

  for (
    const [field, expected]
    of Object.entries(exactCapabilities)
  ) {
    requireExact(
      profile[field],
      expected,
      "PROFILE_CONTRACT_INVALID",
      "profile." + field
    );
  }
}

function assertVerifierContract(verifier) {
  requireExact(
    verifier.id,
    CONTROLLED_VERIFIER_ID,
    "VERIFIER_CONTRACT_INVALID",
    "verifier.id"
  );

  requireExact(
    verifier.path,
    CONTROLLED_VERIFIER_PATH,
    "VERIFIER_PATH_MISMATCH",
    "verifier.path"
  );

  requireExact(
    verifier.safety_class,
    "SERVER_DEPENDENT",
    "VERIFIER_CONTRACT_INVALID",
    "verifier.safety_class"
  );

  requireExact(
    verifier.evidence_class,
    "HTTP_RUNTIME",
    "VERIFIER_CONTRACT_INVALID",
    "verifier.evidence_class"
  );

  const exactFlags = {
    requires_server: true,
    requires_http: true,
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
    safe_for_release: false
  };

  for (
    const [field, expected]
    of Object.entries(exactFlags)
  ) {
    requireExact(
      verifier[field],
      expected,
      "VERIFIER_CONTRACT_INVALID",
      "verifier." + field
    );
  }

  if (
    !exactArray(
      verifier.profiles,
      [CONTROLLED_PROFILE_ID]
    )
  ) {
    deny(
      "VERIFIER_CONTRACT_INVALID",
      "Verifier must be assigned only to the controlled loopback profile"
    );
  }

  requireExact(
    verifier.explicit_gate,
    null,
    "VERIFIER_CONTRACT_INVALID",
    "verifier.explicit_gate"
  );

  if (
    !Number.isInteger(
      verifier.timeout_seconds
    ) ||
    verifier.timeout_seconds < 1 ||
    verifier.timeout_seconds > 300
  ) {
    deny(
      "VERIFIER_TIMEOUT_INVALID",
      "Controlled verifier timeout must be between 1 and 300 seconds"
    );
  }
}

function resolveTempRoot(
  requestedPath,
  repositoryRealPath
) {
  if (!requestedPath) {
    deny(
      "TEMP_ROOT_REQUIRED",
      "Controlled loopback execution requires an explicit temporary root"
    );
  }

  if (!path.isAbsolute(requestedPath)) {
    deny(
      "TEMP_ROOT_MUST_BE_ABSOLUTE",
      "Temporary root must be an absolute path"
    );
  }

  let requestedStat;

  try {
    requestedStat =
      fs.lstatSync(requestedPath);
  } catch (error) {
    deny(
      "TEMP_ROOT_MISSING",
      "Temporary root does not exist",
      {
        error: error.message
      }
    );
  }

  if (requestedStat.isSymbolicLink()) {
    deny(
      "TEMP_ROOT_SYMLINK_DENIED",
      "Temporary root must not be a symbolic link"
    );
  }

  if (!requestedStat.isDirectory()) {
    deny(
      "TEMP_ROOT_NOT_DIRECTORY",
      "Temporary root must be a directory"
    );
  }

  let resolved;

  try {
    resolved =
      fs.realpathSync(requestedPath);

    fs.accessSync(
      resolved,
      fs.constants.R_OK |
      fs.constants.W_OK |
      fs.constants.X_OK
    );
  } catch (error) {
    deny(
      "TEMP_ROOT_ACCESS_DENIED",
      "Temporary root is not safely accessible",
      {
        error: error.message
      }
    );
  }

  if (
    resolved === repositoryRealPath ||
    isInside(
      repositoryRealPath,
      resolved
    )
  ) {
    deny(
      "TEMP_ROOT_INSIDE_REPOSITORY",
      "Temporary root must be outside the repository"
    );
  }

  const entries =
    fs.readdirSync(resolved);

  if (entries.length !== 0) {
    deny(
      "TEMP_ROOT_NOT_EMPTY",
      "Temporary root must be empty before controlled execution",
      {
        entry_count: entries.length
      }
    );
  }

  return resolved;
}

function main() {
  const args =
    parseArguments(
      process.argv.slice(2)
    );

  if (args.help) {
    process.stdout.write(
      [
        "Usage:",
        "  node scripts/verification/run-controlled-loopback-verifier.js",
        "    --profile CONTROLLED_LOOPBACK_RUNTIME",
        "    --verifier authority.effective-permission-shadow-controlled-local-runtime-proof",
        "    --temp-root <ABSOLUTE_EMPTY_DIRECTORY_OUTSIDE_REPOSITORY>",
        "    [--plan]",
        "",
        "The controlled runner defaults to DENY."
      ].join("\n") + "\n"
    );

    return;
  }

  if (
    args.profileId !==
    CONTROLLED_PROFILE_ID
  ) {
    deny(
      "PROFILE_ID_DENIED",
      "The controlled runner accepts only CONTROLLED_LOOPBACK_RUNTIME",
      {
        profile: args.profileId || null
      }
    );
  }

  if (
    args.verifierId !==
    CONTROLLED_VERIFIER_ID
  ) {
    deny(
      "VERIFIER_ID_DENIED",
      "The controlled runner accepts only the certified loopback proof",
      {
        verifier: args.verifierId || null
      }
    );
  }

  const repositoryRoot =
    path.resolve(
      __dirname,
      "..",
      ".."
    );

  const manifestPath =
    path.join(
      repositoryRoot,
      "verification",
      "manifest.json"
    );

  const profilesPath =
    path.join(
      repositoryRoot,
      "verification",
      "profiles.json"
    );

  const repositoryRealPath =
    fs.realpathSync(
      repositoryRoot
    );

  const manifest =
    readJson(
      manifestPath,
      "verification manifest"
    );

  const profilesDocument =
    readJson(
      profilesPath,
      "verification profiles"
    );

  requireExact(
    manifest.contract_id,
    CONTRACT_ID,
    "CONTRACT_ID_INVALID",
    "manifest.contract_id"
  );

  requireExact(
    profilesDocument.contract_id,
    CONTRACT_ID,
    "CONTRACT_ID_INVALID",
    "profiles.contract_id"
  );

  requireExact(
    manifest.default_policy,
    "DENY",
    "DEFAULT_POLICY_INVALID",
    "manifest.default_policy"
  );

  requireExact(
    profilesDocument.default_policy,
    "DENY",
    "DEFAULT_POLICY_INVALID",
    "profiles.default_policy"
  );

  requireExact(
    profilesDocument.runner_available,
    true,
    "RUNNER_AUTHORITY_INVALID",
    "profiles.runner_available"
  );

  const profile =
    findExactlyOne(
      profilesDocument.profiles,
      (candidate) =>
        candidate.id ===
        CONTROLLED_PROFILE_ID,
      "Controlled profile"
    );

  const verifier =
    findExactlyOne(
      manifest.verifiers,
      (candidate) =>
        candidate.id ===
        CONTROLLED_VERIFIER_ID,
      "Controlled verifier"
    );

  assertProfileContract(profile);
  assertVerifierContract(verifier);

  const normalizedVerifierPath =
    path.posix.normalize(
      verifier.path.replace(
        /\\/g,
        "/"
      )
    );

  if (
    normalizedVerifierPath !==
    CONTROLLED_VERIFIER_PATH
  ) {
    deny(
      "VERIFIER_PATH_MISMATCH",
      "Verifier path is not the certified controlled path"
    );
  }

  const verifierAbsolutePath =
    path.resolve(
      repositoryRoot,
      normalizedVerifierPath
    );

  let verifierStat;

  try {
    verifierStat =
      fs.lstatSync(
        verifierAbsolutePath
      );
  } catch (error) {
    deny(
      "VERIFIER_FILE_MISSING",
      "Controlled verifier file is missing",
      {
        error: error.message
      }
    );
  }

  if (
    verifierStat.isSymbolicLink() ||
    !verifierStat.isFile()
  ) {
    deny(
      "VERIFIER_FILE_INVALID",
      "Controlled verifier must be a regular non-symlink file"
    );
  }

  const verifierRealPath =
    fs.realpathSync(
      verifierAbsolutePath
    );

  if (
    !isInside(
      repositoryRealPath,
      verifierRealPath
    )
  ) {
    deny(
      "VERIFIER_PATH_ESCAPE",
      "Controlled verifier resolves outside the repository"
    );
  }

  const verifierHash =
    hashFile(
      verifierRealPath
    );

  if (
    verifierHash !==
    CONTROLLED_VERIFIER_SHA256
  ) {
    deny(
      "VERIFIER_HASH_MISMATCH",
      "Controlled verifier bytes differ from the certified SHA-256",
      {
        expected_sha256:
          CONTROLLED_VERIFIER_SHA256,

        actual_sha256:
          verifierHash
      }
    );
  }

  const resolvedTempRoot =
    resolveTempRoot(
      args.tempRoot,
      repositoryRealPath
    );

  const timeoutSeconds =
    verifier.timeout_seconds;

  const executionPlan = {
    profile:
      profile.id,

    verifier:
      verifier.id,

    verifier_path:
      normalizedVerifierPath,

    verifier_sha256:
      verifierHash,

    safety_class:
      verifier.safety_class,

    evidence_class:
      verifier.evidence_class,

    temp_root:
      resolvedTempRoot,

    timeout_seconds:
      timeoutSeconds,

    shell:
      false,

    server_allowed:
      true,

    http_allowed:
      true,

    loopback_only:
      true,

    loopback_host:
      "127.0.0.1",

    port_policy:
      "OS_ASSIGNED_EPHEMERAL",

    network_allowed:
      false,

    external_network_allowed:
      false,

    external_network_os_sandbox:
      false,

    external_network_guard:
      "EXACT_VERIFIER_ID_PATH_SHA256_AND_CONTRACT",

    live_provider_allowed:
      false,

    write_key_allowed:
      false,

    repository_mutation_allowed:
      false,

    live_data_mutation_allowed:
      false,

    production_orchestrator_allowed:
      false
  };

  if (args.planOnly) {
    allow(
      "Controlled loopback execution plan authorized",
      {
        executed: false,
        plan: executionPlan
      }
    );

    return;
  }

  const childEnvironment = {
    PATH:
      process.env.PATH ||
      "/usr/bin:/bin",

    HOME:
      resolvedTempRoot,

    TMPDIR:
      resolvedTempRoot,

    TMP:
      resolvedTempRoot,

    TEMP:
      resolvedTempRoot,

    LANG:
      process.env.LANG ||
      "C",

    LC_ALL:
      process.env.LC_ALL ||
      "C",

    MH_ASSISTANT_ROOT:
      resolvedTempRoot,

    MH_VERIFICATION_PROFILE:
      profile.id,

    MH_VERIFICATION_VERIFIER_ID:
      verifier.id,

    MH_CONTROLLED_LOOPBACK_RUNNER_ACTIVE:
      "1",

    NO_PROXY:
      "127.0.0.1,localhost,::1",

    no_proxy:
      "127.0.0.1,localhost,::1",

    HTTP_PROXY:
      "http://127.0.0.1:9",

    HTTPS_PROXY:
      "http://127.0.0.1:9",

    ALL_PROXY:
      "http://127.0.0.1:9"
  };

  const child =
    spawnSync(
      process.execPath,
      [verifierRealPath],
      {
        cwd:
          repositoryRealPath,

        env:
          childEnvironment,

        stdio:
          "inherit",

        shell:
          false,

        timeout:
          timeoutSeconds * 1000,

        killSignal:
          "SIGTERM"
      }
    );

  if (child.error) {
    deny(
      child.error.code === "ETIMEDOUT"
        ? "VERIFIER_TIMEOUT"
        : "VERIFIER_SPAWN_FAILED",
      "Controlled verifier process could not complete",
      {
        error: child.error.message
      }
    );
  }

  if (child.signal) {
    deny(
      "VERIFIER_TERMINATED_BY_SIGNAL",
      "Controlled verifier terminated by signal",
      {
        signal: child.signal
      }
    );
  }

  if (child.status !== 0) {
    deny(
      "VERIFIER_EXIT_NONZERO",
      "Controlled verifier returned a nonzero exit code",
      {
        exit_code: child.status
      }
    );
  }

  const verifierHashAfter =
    hashFile(
      verifierRealPath
    );

  if (
    verifierHashAfter !==
    CONTROLLED_VERIFIER_SHA256
  ) {
    deny(
      "VERIFIER_CHANGED_DURING_EXECUTION",
      "Controlled verifier bytes changed during execution"
    );
  }

  const remainingTempEntries =
    fs.readdirSync(
      resolvedTempRoot
    );

  if (
    remainingTempEntries.length !== 0
  ) {
    deny(
      "TEMP_ROOT_NOT_CLEAN",
      "Controlled verifier left temporary evidence behind",
      {
        entries:
          remainingTempEntries
      }
    );
  }

  allow(
    "Controlled loopback verifier execution completed",
    {
      executed: true,
      exit_code: child.status,
      plan: executionPlan
    }
  );
}

main();

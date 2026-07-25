"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..", "..");

const manifestPath = path.join(
  repositoryRoot,
  "verification",
  "manifest.json"
);

const profilesPath = path.join(
  repositoryRoot,
  "verification",
  "profiles.json"
);

function fail(message) {
  console.error("FAIL: " + message);
  process.exit(1);
}

function readJson(filePath, label) {
  let raw;

  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    fail(label + " could not be read: " + error.message);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    fail(label + " is not valid JSON: " + error.message);
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(label + " must be a non-empty string");
  }
}

function requireBoolean(value, label) {
  if (typeof value !== "boolean") {
    fail(label + " must be boolean");
  }
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    fail(label + " must be an array");
  }
}

function requirePositiveNumber(value, label) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    fail(label + " must be a positive finite number");
  }
}

function requireNullableString(value, label) {
  if (value !== null && typeof value !== "string") {
    fail(label + " must be a string or null");
  }

  if (typeof value === "string" && value.trim() === "") {
    fail(label + " must not be an empty string");
  }
}

function requireStringArray(value, label) {
  requireArray(value, label);

  for (let index = 0; index < value.length; index += 1) {
    requireString(value[index], label + "[" + index + "]");
  }
}

function assertKnownValue(value, allowedValues, label) {
  if (!allowedValues.includes(value)) {
    fail(label + " uses unknown value: " + String(value));
  }
}

const manifest = readJson(manifestPath, "manifest");
const profilesDocument = readJson(profilesPath, "profiles");

requireString(
  manifest.manifest_version,
  "manifest.manifest_version"
);
requireString(manifest.contract_id, "manifest.contract_id");
requireString(manifest.strategy, "manifest.strategy");
requireString(manifest.status, "manifest.status");
requireString(
  manifest.default_policy,
  "manifest.default_policy"
);
requireString(
  manifest.repository_scope,
  "manifest.repository_scope"
);
requireBoolean(
  manifest.classification_complete,
  "manifest.classification_complete"
);
requireString(
  manifest.generated_from_truth_scan,
  "manifest.generated_from_truth_scan"
);
requireStringArray(
  manifest.allowed_safety_classes,
  "manifest.allowed_safety_classes"
);
requireStringArray(
  manifest.allowed_evidence_classes,
  "manifest.allowed_evidence_classes"
);
requireStringArray(
  manifest.required_verifier_fields,
  "manifest.required_verifier_fields"
);
requireArray(manifest.verifiers, "manifest.verifiers");

if (manifest.contract_id !== "mh-os.verification-governance.v1") {
  fail("manifest contract_id is not canonical");
}

if (manifest.strategy !== "CONSOLIDATE_EXISTING") {
  fail("manifest strategy is not canonical");
}

if (manifest.default_policy !== "DENY") {
  fail("manifest default policy must be DENY");
}

if (!manifest.allowed_safety_classes.includes("UNCLASSIFIED")) {
  fail("safety vocabulary must include UNCLASSIFIED");
}

const expectedVerifierFields = [
  "id",
  "path",
  "domain",
  "purpose",
  "safety_class",
  "evidence_class",
  "requires_server",
  "requires_http",
  "requires_network",
  "requires_live_provider",
  "requires_write_key",
  "requires_temp_root",
  "reads_live_root",
  "mutates_fixture",
  "mutates_repository",
  "mutates_live_data",
  "explicit_gate",
  "safe_for_local",
  "safe_for_ci",
  "safe_for_release",
  "profiles",
  "estimated_runtime",
  "timeout_seconds",
  "limitations"
];

for (const field of expectedVerifierFields) {
  if (!manifest.required_verifier_fields.includes(field)) {
    fail("required verifier field is missing: " + field);
  }
}

requireString(
  profilesDocument.profiles_version,
  "profiles.profiles_version"
);
requireString(
  profilesDocument.contract_id,
  "profiles.contract_id"
);
requireString(profilesDocument.status, "profiles.status");
requireString(
  profilesDocument.default_policy,
  "profiles.default_policy"
);
requireBoolean(
  profilesDocument.runner_available,
  "profiles.runner_available"
);
requireArray(profilesDocument.profiles, "profiles.profiles");

if (profilesDocument.contract_id !== manifest.contract_id) {
  fail("manifest and profiles contract IDs differ");
}

if (profilesDocument.default_policy !== "DENY") {
  fail("profiles default policy must be DENY");
}

const requiredProfileIds = [
  "READ_ONLY",
  "TEMP_ROOT",
  "LOCAL_ENGINEERING",
  "CI",
  "RELEASE_CANDIDATE",
  "PRODUCTION_CERTIFICATION"
];

const profileIds = new Set();

for (const profile of profilesDocument.profiles) {
  requireString(profile.id, "profile.id");

  if (profileIds.has(profile.id)) {
    fail("duplicate profile id: " + profile.id);
  }

  profileIds.add(profile.id);

  requireString(profile.status, profile.id + ".status");
  requireBoolean(
    profile.execution_enabled,
    profile.id + ".execution_enabled"
  );
  requireString(
    profile.description,
    profile.id + ".description"
  );
  requireStringArray(
    profile.allowed_safety_classes,
    profile.id + ".allowed_safety_classes"
  );
  requireBoolean(
    profile.requires_explicit_approval,
    profile.id + ".requires_explicit_approval"
  );
  requireBoolean(
    profile.allows_server,
    profile.id + ".allows_server"
  );
  requireBoolean(
    profile.allows_http,
    profile.id + ".allows_http"
  );
  requireBoolean(
    profile.allows_network,
    profile.id + ".allows_network"
  );
  requireBoolean(
    profile.allows_live_provider,
    profile.id + ".allows_live_provider"
  );
  requireBoolean(
    profile.allows_write_key,
    profile.id + ".allows_write_key"
  );
  requireBoolean(
    profile.allows_temp_root_mutation,
    profile.id + ".allows_temp_root_mutation"
  );
  requireBoolean(
    profile.allows_repository_mutation,
    profile.id + ".allows_repository_mutation"
  );
  requireBoolean(
    profile.allows_live_data_mutation,
    profile.id + ".allows_live_data_mutation"
  );

  if (profile.allowed_safety_classes.includes("UNCLASSIFIED")) {
    fail("profile must not allow UNCLASSIFIED: " + profile.id);
  }

  for (const safetyClass of profile.allowed_safety_classes) {
    assertKnownValue(
      safetyClass,
      manifest.allowed_safety_classes,
      "profile " + profile.id
    );
  }
}

for (const requiredProfileId of requiredProfileIds) {
  if (!profileIds.has(requiredProfileId)) {
    fail("required profile is missing: " + requiredProfileId);
  }
}

const verifierIds = new Set();
const verifierPaths = new Set();

for (
  let verifierIndex = 0;
  verifierIndex < manifest.verifiers.length;
  verifierIndex += 1
) {
  const verifier = manifest.verifiers[verifierIndex];
  const prefix = "manifest.verifiers[" + verifierIndex + "]";

  if (
    verifier === null ||
    typeof verifier !== "object" ||
    Array.isArray(verifier)
  ) {
    fail(prefix + " must be an object");
  }

  for (const field of manifest.required_verifier_fields) {
    if (!Object.prototype.hasOwnProperty.call(verifier, field)) {
      fail(prefix + " is missing required field: " + field);
    }
  }

  requireString(verifier.id, prefix + ".id");
  requireString(verifier.path, prefix + ".path");
  requireString(verifier.domain, prefix + ".domain");
  requireString(verifier.purpose, prefix + ".purpose");
  requireString(
    verifier.safety_class,
    prefix + ".safety_class"
  );
  requireString(
    verifier.evidence_class,
    prefix + ".evidence_class"
  );

  if (verifierIds.has(verifier.id)) {
    fail("duplicate verifier id: " + verifier.id);
  }

  if (verifierPaths.has(verifier.path)) {
    fail("duplicate verifier path: " + verifier.path);
  }

  verifierIds.add(verifier.id);
  verifierPaths.add(verifier.path);

  assertKnownValue(
    verifier.safety_class,
    manifest.allowed_safety_classes,
    prefix + ".safety_class"
  );

  assertKnownValue(
    verifier.evidence_class,
    manifest.allowed_evidence_classes,
    prefix + ".evidence_class"
  );

  const booleanFields = [
    "requires_server",
    "requires_http",
    "requires_network",
    "requires_live_provider",
    "requires_write_key",
    "requires_temp_root",
    "reads_live_root",
    "mutates_fixture",
    "mutates_repository",
    "mutates_live_data",
    "safe_for_local",
    "safe_for_ci",
    "safe_for_release"
  ];

  for (const field of booleanFields) {
    requireBoolean(verifier[field], prefix + "." + field);
  }

  requireNullableString(
    verifier.explicit_gate,
    prefix + ".explicit_gate"
  );
  requireStringArray(
    verifier.profiles,
    prefix + ".profiles"
  );
  requireString(
    verifier.estimated_runtime,
    prefix + ".estimated_runtime"
  );
  requirePositiveNumber(
    verifier.timeout_seconds,
    prefix + ".timeout_seconds"
  );
  requireStringArray(
    verifier.limitations,
    prefix + ".limitations"
  );

  const normalizedPath = path.normalize(verifier.path);
  const absoluteVerifierPath = path.resolve(
    repositoryRoot,
    normalizedPath
  );

  const relativeToRoot = path.relative(
    repositoryRoot,
    absoluteVerifierPath
  );

  if (
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot)
  ) {
    fail(prefix + ".path escapes repository root");
  }

  if (!fs.existsSync(absoluteVerifierPath)) {
    fail("registered verifier path does not exist: " + verifier.path);
  }

  const verifierStat = fs.statSync(absoluteVerifierPath);

  if (!verifierStat.isFile()) {
    fail("registered verifier path is not a file: " + verifier.path);
  }

  for (const profileId of verifier.profiles) {
    if (!profileIds.has(profileId)) {
      fail(
        "verifier " +
          verifier.id +
          " references unknown profile: " +
          profileId
      );
    }
  }

  if (verifier.requires_http && !verifier.requires_server) {
    fail(
      "HTTP-dependent verifier must also require a server: " +
        verifier.id
    );
  }

  if (
    verifier.requires_live_provider &&
    !verifier.requires_network
  ) {
    fail(
      "live-provider verifier must require network access: " +
        verifier.id
    );
  }

  if (
    verifier.requires_write_key &&
    verifier.explicit_gate === null
  ) {
    fail(
      "write-key verifier must declare an explicit gate: " +
        verifier.id
    );
  }

  if (
    verifier.safety_class === "UNCLASSIFIED" &&
    (
      verifier.profiles.length !== 0 ||
      verifier.safe_for_local ||
      verifier.safe_for_ci ||
      verifier.safe_for_release
    )
  ) {
    fail(
      "UNCLASSIFIED verifier cannot be authorized by profile or safety flag: " +
        verifier.id
    );
  }

  if (
    verifier.mutates_repository &&
    verifier.safe_for_ci
  ) {
    fail(
      "repository-mutating verifier cannot be marked safe_for_ci: " +
        verifier.id
    );
  }

  if (
    verifier.mutates_live_data &&
    verifier.safe_for_release
  ) {
    fail(
      "live-data-mutating verifier cannot be marked safe_for_release: " +
        verifier.id
    );
  }
}

if (
  manifest.classification_complete &&
  manifest.verifiers.some(
    (verifier) => verifier.safety_class === "UNCLASSIFIED"
  )
) {
  fail(
    "classification_complete cannot be true while UNCLASSIFIED verifiers exist"
  );
}

console.log("PASS: verification manifest JSON is valid");
console.log("PASS: verification profiles JSON is valid");
console.log("PASS: canonical contract IDs match");
console.log("PASS: default policy is DENY");
console.log(
  "PASS: registered verifier count=" +
    manifest.verifiers.length
);
console.log(
  "PASS: classification_complete=" +
    manifest.classification_complete
);
console.log(
  "PASS: runner_available=" +
    profilesDocument.runner_available
);
console.log("VERIFIERS_EXECUTED=NO");
console.log("PHASE_L4F_REGISTRATION_VALIDATION=PASS");

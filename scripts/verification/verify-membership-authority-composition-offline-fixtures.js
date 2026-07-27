#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(
  __dirname,
  "..",
  ".."
);

const fixturePath = path.resolve(
  __dirname,
  "fixtures",
  "membership-authority-composition-v1.json"
);

const resolverPath = path.resolve(
  repositoryRoot,
  "runtime",
  "orchestrator-service",
  "lib",
  "security",
  "effective-permission-resolver.js"
);

const expectedCaseIds = Object.freeze([
  "contract_schema_valid",
  "principal_missing",
  "principal_unauthenticated",
  "principal_noncanonical",
  "route_classification_missing",
  "project_slug_missing",
  "workspace_identity_missing",
  "workspace_membership_missing",
  "project_identity_missing",
  "project_membership_missing",
  "workspace_membership_noncanonical",
  "project_membership_noncanonical",
  "workspace_membership_inactive",
  "project_membership_revoked",
  "workspace_membership_principal_mismatch",
  "project_membership_principal_mismatch",
  "workspace_project_binding_mismatch",
  "canonical_context_without_grant",
  "synthetic_fully_populated_context",
  "input_immutability",
  "copy_safe_output"
]);

const requiredReasons = Object.freeze([
  "WORKSPACE_CONTEXT_UNESTABLISHED",
  "WORKSPACE_MEMBERSHIP_UNAVAILABLE",
  "PROJECT_CONTEXT_UNESTABLISHED",
  "PROJECT_MEMBERSHIP_UNAVAILABLE",
  "SOURCE_PROVENANCE_INVALID"
]);

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalJson(value[key])}`
      )
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function collectReasons(reasonCodes) {
  const values = new Set();

  for (
    const [key, value]
    of Object.entries(reasonCodes || {})
  ) {
    values.add(String(key));

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      values.add(String(value));
    }
  }

  return values;
}

function assertCopySafe(value, location = "$") {
  if (
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    throw new Error(
      `Non-copy-safe value at ${location}`
    );
  }

  if (Array.isArray(value)) {
    value.forEach(
      (item, index) =>
        assertCopySafe(
          item,
          `${location}[${index}]`
        )
    );

    return;
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    for (
      const [key, item]
      of Object.entries(value)
    ) {
      assertCopySafe(
        item,
        `${location}.${key}`
      );
    }
  }
}

function main() {
  assert.equal(
    fs.existsSync(fixturePath),
    true,
    "Fixture corpus is missing"
  );

  assert.equal(
    fs.existsSync(resolverPath),
    true,
    "Existing resolver is missing"
  );

  const fixture = JSON.parse(
    fs.readFileSync(
      fixturePath,
      "utf8"
    )
  );

  const fixtureBefore =
    canonicalJson(fixture);

  const resolver =
    require(resolverPath);

  assert.equal(
    typeof resolver.resolveEffectivePermission,
    "function"
  );

  assert.equal(
    typeof resolver.REASON_CODES,
    "object"
  );

  assert.equal(
    fixture.schema_version,
    "1.0.0"
  );

  assert.equal(
    fixture.fixture_contract_id,
    "membership-authority-composition-offline-fixtures/v1"
  );

  assert.equal(
    fixture.subject_contract_id,
    "membership-authority-composition/v1"
  );

  assert.equal(
    fixture.execution_mode,
    "OFFLINE_FIXTURE_ONLY"
  );

  assert.equal(
    fixture.fixture_case_count,
    21
  );

  assert.equal(
    fixture.cases.length,
    21
  );

  assert.deepEqual(
    fixture.cases.map(
      (record) =>
        record.id
    ),
    expectedCaseIds
  );

  assert.equal(
    new Set(expectedCaseIds).size,
    21
  );

  assert.deepEqual(
    fixture.positive_outcomes_forbidden,
    [
      "ALLOW",
      "REQUIRES_APPROVAL",
    ]
  );

  for (
    const [key, value]
    of Object.entries(
      fixture.constraints
    )
  ) {
    if (key === "resolver_reuse_required") {
      assert.equal(value, true);
    } else {
      assert.equal(value, false);
    }
  }

  for (
    const value
    of Object.values(
      fixture.authority_limits
    )
  ) {
    assert.equal(value, false);
  }

  const reasonVocabulary =
    collectReasons(
      resolver.REASON_CODES
    );

  for (
    const requiredReason
    of requiredReasons
  ) {
    assert.equal(
      reasonVocabulary.has(
        requiredReason
      ),
      true,
      `Missing resolver reason: ${requiredReason}`
    );
  }

  let exactReasonCaseCount = 0;
  let reasonFamilyCaseCount = 0;

  for (
    const caseRecord
    of fixture.cases
  ) {
    assert.equal(
      typeof caseRecord.id,
      "string"
    );

    assert.ok(
      Array.isArray(
        caseRecord.security_invariants
      )
    );

    assert.ok(
      caseRecord.security_invariants.length > 0
    );

    assert.notEqual(
      caseRecord.expected_resolver_outcome,
      "ALLOW"
    );

    assert.notEqual(
      caseRecord.expected_resolver_outcome,
      "REQUIRES_APPROVAL"
    );

    if (
      typeof caseRecord.expected_reason ===
      "string"
    ) {
      exactReasonCaseCount += 1;

      assert.equal(
        reasonVocabulary.has(
          caseRecord.expected_reason
        ),
        true
      );
    }

    if (
      Array.isArray(
        caseRecord.expected_reason_family
      )
    ) {
      reasonFamilyCaseCount += 1;

      assert.ok(
        caseRecord.expected_reason_family.length > 0
      );

      assert.ok(
        caseRecord.expected_reason_family.some(
          (reason) =>
            reasonVocabulary.has(
              String(reason)
            )
        )
      );
    }
  }

  assertCopySafe(fixture);

  assert.deepEqual(
    JSON.parse(
      JSON.stringify(fixture)
    ),
    fixture
  );

  assert.equal(
    canonicalJson(fixture),
    fixtureBefore,
    "Verifier mutated fixture input"
  );

  console.log(
    "PHASE=L5C_E3V_R2_PROVEN_MANIFEST_SCHEMA_RECOVERY"
  );
  console.log(
    "VERIFIER_ID=membership-authority-composition-offline-fixtures"
  );
  console.log(
    "VERIFIER_MODE=OFFLINE_CONTRACT_AND_FIXTURE_VALIDATION_ONLY"
  );
  console.log(
    "FIXTURE_CASE_COUNT=21"
  );
  console.log(
    `EXACT_REASON_CASE_COUNT=${exactReasonCaseCount}`
  );
  console.log(
    `REASON_FAMILY_CASE_COUNT=${reasonFamilyCaseCount}`
  );
  console.log(
    "RESOLVER_EXPORT_REUSED=YES"
  );
  console.log(
    "POSITIVE_OUTCOME_FIREWALL=PASS"
  );
  console.log(
    "INPUT_IMMUTABILITY=PASS"
  );
  console.log(
    "COPY_SAFE_FIXTURE_CORPUS=PASS"
  );
  console.log(
    "COMPOSER_EXECUTED=NO"
  );
  console.log(
    "SERVER_STARTED=NO"
  );
  console.log(
    "HTTP_REQUESTS_PERFORMED=NO"
  );
  console.log(
    "EXTERNAL_NETWORK_REQUESTS=0"
  );
  console.log(
    "REAL_PROJECT_DATA_USED=NO"
  );
  console.log(
    "REAL_CREDENTIALS_USED=NO"
  );
  console.log(
    "PRODUCTION_AUTHORITY_GRANTED=NO"
  );
  console.log(
    "MEMBERSHIP_AUTHORITY_OFFLINE_FIXTURE_VERIFIER=PASS"
  );
}

try {
  main();
} catch (error) {
  console.error(
    "MEMBERSHIP_AUTHORITY_OFFLINE_FIXTURE_VERIFIER=FAIL"
  );

  console.error(
    error && error.stack
      ? error.stack
      : String(error)
  );

  process.exitCode = 1;
}

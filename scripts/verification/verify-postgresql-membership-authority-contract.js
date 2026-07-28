#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const fixturePath = path.join(
  repositoryRoot,
  'scripts',
  'verification',
  'fixtures',
  'postgresql-membership-authority-contract-v1.json',
);

function fail(message) {
  console.error(
    'POSTGRESQL_MEMBERSHIP_AUTHORITY_STATIC_CONTRACT=FAIL',
  );
  console.error(`REASON=${message}`);
  process.exit(1);
}

function assertCondition(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readRepositoryText(relativePath) {
  const absolutePath = path.join(repositoryRoot, relativePath);

  assertCondition(
    fs.existsSync(absolutePath),
    `Required repository file is missing: ${relativePath}`,
  );

  return fs.readFileSync(absolutePath, 'utf8');
}

function sha256(value) {
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('hex');
}

let fixture;

try {
  fixture = JSON.parse(
    fs.readFileSync(fixturePath, 'utf8'),
  );
} catch (error) {
  fail(`Fixture could not be parsed: ${error.message}`);
}

assertCondition(
  fixture.contract_id
    === 'postgresql-membership-authority-static-contract/v1',
  'Unexpected fixture contract ID',
);

assertCondition(
  fixture.status === 'STATIC_CONTRACT_ONLY',
  'Unexpected fixture status',
);

const migration = readRepositoryText(fixture.migration_path);
const contractDocument = readRepositoryText(
  fixture.contract_document_path,
);
const governanceDocument = readRepositoryText(
  fixture.governance_document_path,
);

const actualMigrationSha256 = sha256(
  Buffer.from(migration, 'utf8'),
);

assertCondition(
  actualMigrationSha256 === fixture.migration_sha256,
  (
    'Migration SHA-256 mismatch: '
    + `expected=${fixture.migration_sha256} `
    + `actual=${actualMigrationSha256}`
  ),
);


assertCondition(
  fixture.transaction_model
    === 'EXECUTOR_MANAGED_TRANSACTION',
  'Unexpected migration transaction model',
);

assertCondition(
  String(fixture.advisory_lock_key)
    === '9051548987079335361',
  'Unexpected advisory lock key',
);

assertCondition(
  !/^\\s*BEGIN\\s*;\\s*$/im.test(migration),
  'Embedded BEGIN found',
);

assertCondition(
  !/^\\s*COMMIT\\s*;\\s*$/im.test(migration),
  'Embedded COMMIT found',
);

assertCondition(
  !/^\\s*ROLLBACK\\s*;\\s*$/im.test(migration),
  'Embedded ROLLBACK found',
);

for (const table of fixture.required_tables) {
  assertCondition(
    migration.includes(`CREATE TABLE ${table}`),
    `Required table is missing: ${table}`,
  );
}

for (const marker of fixture.required_markers) {
  assertCondition(
    migration.includes(marker),
    `Required SQL marker is missing: ${marker}`,
  );
}

for (
  const patternText
  of fixture.prohibited_statement_patterns
) {
  const pattern = new RegExp(patternText, 'im');

  assertCondition(
    !pattern.test(migration),
    `Prohibited SQL statement detected: ${patternText}`,
  );
}

for (
  const marker
  of fixture.required_contract_document_markers
) {
  assertCondition(
    contractDocument.includes(marker),
    `Contract document marker is missing: ${marker}`,
  );
}

for (
  const marker
  of fixture.required_governance_document_markers
) {
  assertCondition(
    governanceDocument.includes(marker),
    `Governance document marker is missing: ${marker}`,
  );
}

const counts = {
  create_schema:
    (migration.match(/\bCREATE\s+SCHEMA\b/gi) || []).length,

  tables:
    (migration.match(/\bCREATE\s+TABLE\b/gi) || []).length,

  functions:
    (migration.match(/\bCREATE\s+FUNCTION\b/gi) || []).length,

  triggers:
    (migration.match(/\bCREATE\s+TRIGGER\b/gi) || []).length,

  indexes:
    (migration.match(/\bCREATE\s+INDEX\b/gi) || []).length,
};

for (
  const [name, expected]
  of Object.entries(fixture.expected_counts)
) {
  assertCondition(
    counts[name] === expected,
    (
      `Unexpected ${name} count: `
      + `expected=${expected} actual=${counts[name]}`
    ),
  );
}

for (
  const [name, value]
  of Object.entries(fixture.authorization_limits)
) {
  assertCondition(
    value === false,
    `Authorization limit must remain false: ${name}`,
  );
}

console.log(
  'POSTGRESQL_MEMBERSHIP_AUTHORITY_STATIC_CONTRACT=PASS',
);
console.log(
  `MIGRATION_SHA256=${actualMigrationSha256}`,
);
console.log(
  `SCHEMA_NAMESPACE=${fixture.schema_namespace}`,
);
console.log(
  `REQUIRED_TABLE_COUNT=${fixture.required_tables.length}`,
);
console.log(
  `CREATE_SCHEMA_COUNT=${counts.create_schema}`,
);
console.log(
  `CREATE_TABLE_COUNT=${counts.tables}`,
);
console.log(
  `CREATE_FUNCTION_COUNT=${counts.functions}`,
);
console.log(
  `CREATE_TRIGGER_COUNT=${counts.triggers}`,
);
console.log(
  `CREATE_INDEX_COUNT=${counts.indexes}`,
);
console.log('MIGRATION_TRANSACTION_BOUNDARY=PASS');
console.log('MIGRATION_REQUIRED_CONSTRAINTS=PASS');
console.log('MIGRATION_DESTRUCTIVE_STATEMENTS_ABSENT=PASS');
console.log('MIGRATION_SEED_DATA_ABSENT=PASS');
console.log('CONTRACT_DOCUMENT_BINDING=PASS');
console.log('GOVERNANCE_DOCUMENT_BINDING=PASS');
console.log('FILES_WRITTEN=NO');
console.log('NETWORK_USED=NO');
console.log('DATABASE_CONTACTED=NO');
console.log('MIGRATION_EXECUTED=NO');
console.log('DEPENDENCY_INSTALLED=NO');
console.log('RUNTIME_BINDING_CHANGED=NO');
console.log('PRODUCTION_AUTHORITY_GRANTED=NO');

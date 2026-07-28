#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

const {
  PostgreSQLMigrationAuthorityError,
  MIGRATION_TRANSACTION_MODEL,
  MIGRATION_ADVISORY_LOCK_NAMESPACE,
  MIGRATION_ADVISORY_LOCK_KEY,
  CANONICAL_MIGRATION,
  HISTORY_STATES,
  createMigrationAuthority,
} = require(path.join(
  ROOT,
  'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-migration-authority.js',
));

const SAFE_SQL = [
  'CREATE SCHEMA identity_workspace_authority;',
  'CREATE TABLE identity_workspace_authority.test_table (id text);',
].join('\n');

function descriptor(overrides = {}) {
  return Object.freeze({
    migration_id: CANONICAL_MIGRATION.migrationId,
    migration_order: CANONICAL_MIGRATION.migrationOrder,
    migration_path: CANONICAL_MIGRATION.migrationPath,
    checksum_sha256: CANONICAL_MIGRATION.migrationSha256,
    ...overrides,
  });
}

function createHarness(options = {}) {
  const calls = [];
  let sessionCreationCount = 0;
  let nowValue = 1000;

  const history = options.history || {
    state: HISTORY_STATES.ABSENT_BOOTSTRAP_ALLOWED,
  };

  const session = {
    async acquireAdvisoryLock(lockKey) {
      calls.push(['acquireAdvisoryLock', lockKey]);

      if (options.lockError) {
        throw options.lockError;
      }

      return options.lockResult || {
        acquired: true,
        timeout: false,
      };
    },

    async readMigrationHistory(migrationId) {
      calls.push(['readMigrationHistory', migrationId]);

      if (options.historyError) {
        throw options.historyError;
      }

      return history;
    },

    async beginTransaction() {
      calls.push(['beginTransaction']);

      if (options.beginError) {
        throw options.beginError;
      }
    },

    async executeMigration(sql) {
      calls.push(['executeMigration', sql]);

      if (options.executionError) {
        throw options.executionError;
      }
    },

    async recordMigrationApplied(record) {
      calls.push(['recordMigrationApplied', record]);

      if (options.historyWriteError) {
        throw options.historyWriteError;
      }
    },

    async commitTransaction() {
      calls.push(['commitTransaction']);

      if (options.commitError) {
        throw options.commitError;
      }
    },

    async rollbackTransaction() {
      calls.push(['rollbackTransaction']);

      if (options.rollbackError) {
        throw options.rollbackError;
      }
    },

    async releaseAdvisoryLock(lockKey) {
      calls.push(['releaseAdvisoryLock', lockKey]);

      if (options.releaseError) {
        throw options.releaseError;
      }
    },
  };

  const authority = createMigrationAuthority({
    dependencies: {
      async readMigrationFile(migrationPath) {
        calls.push(['readMigrationFile', migrationPath]);

        if (options.readError) {
          throw options.readError;
        }

        return options.sql || SAFE_SQL;
      },

      async sha256(content) {
        calls.push(['sha256', content]);

        if (options.checksumError) {
          throw options.checksumError;
        }

        return options.checksum || CANONICAL_MIGRATION.migrationSha256;
      },

      now() {
        nowValue += 1;
        return nowValue;
      },

      async createExecutionSession() {
        sessionCreationCount += 1;
        calls.push(['createExecutionSession']);

        if (options.sessionError) {
          throw options.sessionError;
        }

        return options.session || session;
      },
    },
  });

  return {
    authority,
    calls,
    getSessionCreationCount() {
      return sessionCreationCount;
    },
  };
}

async function expectCode(promise, code) {
  await assert.rejects(
    promise,
    (error) => {
      assert.equal(error instanceof PostgreSQLMigrationAuthorityError, true);
      assert.equal(error.code, code);
      return true;
    },
  );
}

function callNames(calls) {
  return calls.map((entry) => entry[0]);
}

async function main() {
  assert.equal(
    MIGRATION_TRANSACTION_MODEL,
    'EXECUTOR_MANAGED_TRANSACTION',
  );

  assert.equal(
    MIGRATION_ADVISORY_LOCK_NAMESPACE,
    'mh-os.identity-workspace.migration-authority.v1',
  );

  assert.equal(
    MIGRATION_ADVISORY_LOCK_KEY,
    '9051548987079335361',
  );

  assert.equal(
    CANONICAL_MIGRATION.migrationSha256,
    '987dfea602dc9d5a6d392f5e635bd39b52973e4f0f2655de5752a11650313061',
  );

  const successful = createHarness();

  const successfulResult = await successful.authority.executeMigration(
    descriptor(),
    {
      bootstrapAuthorized: true,
    },
  );

  assert.deepEqual(callNames(successful.calls), [
    'readMigrationFile',
    'sha256',
    'createExecutionSession',
    'acquireAdvisoryLock',
    'readMigrationHistory',
    'beginTransaction',
    'executeMigration',
    'recordMigrationApplied',
    'commitTransaction',
    'releaseAdvisoryLock',
  ]);

  assert.equal(successfulResult.state, 'APPLIED_OFFLINE_SIMULATION');
  assert.equal(successfulResult.applied, true);
  assert.equal(successfulResult.alreadyApplied, false);
  assert.equal(successfulResult.databaseContacted, false);
  assert.equal(successfulResult.sqlExecuted, false);
  assert.equal(successfulResult.realMigrationExecuted, false);
  assert.equal(successfulResult.productionAuthority, false);
  assert.equal(Object.isFrozen(successfulResult), true);

  const historyWriteCall = successful.calls.find(
    (entry) => entry[0] === 'recordMigrationApplied',
  );

  assert.equal(
    historyWriteCall[1].migration_id,
    CANONICAL_MIGRATION.migrationId,
  );

  assert.equal(
    historyWriteCall[1].checksum_sha256,
    CANONICAL_MIGRATION.migrationSha256,
  );

  const alreadyApplied = createHarness({
    history: {
      state: HISTORY_STATES.AVAILABLE,
      checksum_sha256: CANONICAL_MIGRATION.migrationSha256,
    },
  });

  const alreadyAppliedResult =
    await alreadyApplied.authority.executeMigration(descriptor());

  assert.equal(alreadyAppliedResult.state, 'ALREADY_APPLIED');
  assert.equal(alreadyAppliedResult.alreadyApplied, true);
  assert.equal(
    callNames(alreadyApplied.calls).includes('beginTransaction'),
    false,
  );

  assert.equal(
    callNames(alreadyApplied.calls).includes('executeMigration'),
    false,
  );

  const checksumMismatch = createHarness({
    checksum: '0'.repeat(64),
  });

  await expectCode(
    checksumMismatch.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_CHECKSUM_MISMATCH',
  );

  assert.equal(checksumMismatch.getSessionCreationCount(), 0);

  const checksumCalculationFailure = createHarness({
    checksumError: new Error('private checksum failure'),
  });

  await expectCode(
    checksumCalculationFailure.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_CHECKSUM_CALCULATION_FAILED',
  );

  assert.equal(
    checksumCalculationFailure.getSessionCreationCount(),
    0,
  );

  const sessionCreationFailure = createHarness({
    sessionError: new Error('private session creation failure'),
  });

  await expectCode(
    sessionCreationFailure.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_DEPENDENCY_INVALID',
  );

  const lockAcquisitionFailure = createHarness({
    lockError: new Error('private lock provider failure'),
  });

  await expectCode(
    lockAcquisitionFailure.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_LOCK_UNAVAILABLE',
  );

  assert.equal(
    callNames(lockAcquisitionFailure.calls).includes('beginTransaction'),
    false,
  );

  const invalidDescriptor = createHarness();

  await expectCode(
    invalidDescriptor.authority.executeMigration(
      descriptor({
        migration_id: '9999_not_admitted',
      }),
    ),
    'DATABASE_MIGRATION_NOT_ADMITTED',
  );

  assert.deepEqual(invalidDescriptor.calls, []);

  const embeddedTransaction = createHarness({
    sql: [
      'BEGIN;',
      'CREATE TABLE forbidden_test (id text);',
      'COMMIT;',
    ].join('\n'),
  });

  await expectCode(
    embeddedTransaction.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_EMBEDDED_TRANSACTION_FORBIDDEN',
  );

  assert.equal(embeddedTransaction.getSessionCreationCount(), 0);

  const unavailableLock = createHarness({
    lockResult: {
      acquired: false,
      timeout: false,
    },
  });

  await expectCode(
    unavailableLock.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_LOCK_UNAVAILABLE',
  );

  assert.equal(
    callNames(unavailableLock.calls).includes('beginTransaction'),
    false,
  );

  const timeoutLock = createHarness({
    lockResult: {
      acquired: false,
      timeout: true,
    },
  });

  await expectCode(
    timeoutLock.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_LOCK_TIMEOUT',
  );

  const historyDenied = createHarness({
    history: {
      state: HISTORY_STATES.ABSENT_NOT_ALLOWED,
    },
  });

  await expectCode(
    historyDenied.authority.executeMigration(
      descriptor(),
      {
        bootstrapAuthorized: true,
      },
    ),
    'DATABASE_MIGRATION_HISTORY_ABSENT_NOT_ALLOWED',
  );

  assert.equal(
    callNames(historyDenied.calls).at(-1),
    'releaseAdvisoryLock',
  );

  const bootstrapNotAuthorized = createHarness();

  await expectCode(
    bootstrapNotAuthorized.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_HISTORY_ABSENT_NOT_ALLOWED',
  );

  const historyFailure = createHarness({
    historyError: new Error('private history failure'),
  });

  await expectCode(
    historyFailure.authority.executeMigration(descriptor()),
    'DATABASE_MIGRATION_HISTORY_READ_FAILED',
  );

  assert.equal(
    callNames(historyFailure.calls).at(-1),
    'releaseAdvisoryLock',
  );

  const executionFailure = createHarness({
    executionError: new Error('private execution failure'),
  });

  await expectCode(
    executionFailure.authority.executeMigration(
      descriptor(),
      {
        bootstrapAuthorized: true,
      },
    ),
    'DATABASE_MIGRATION_EXECUTION_FAILED',
  );

  assert.deepEqual(callNames(executionFailure.calls).slice(-2), [
    'rollbackTransaction',
    'releaseAdvisoryLock',
  ]);

  const historyWriteFailure = createHarness({
    historyWriteError: new Error('private history write failure'),
  });

  await expectCode(
    historyWriteFailure.authority.executeMigration(
      descriptor(),
      {
        bootstrapAuthorized: true,
      },
    ),
    'DATABASE_MIGRATION_HISTORY_WRITE_FAILED',
  );

  assert.deepEqual(callNames(historyWriteFailure.calls).slice(-2), [
    'rollbackTransaction',
    'releaseAdvisoryLock',
  ]);

  const commitFailure = createHarness({
    commitError: new Error('private commit failure'),
  });

  await expectCode(
    commitFailure.authority.executeMigration(
      descriptor(),
      {
        bootstrapAuthorized: true,
      },
    ),
    'DATABASE_MIGRATION_COMMIT_FAILED',
  );

  assert.deepEqual(callNames(commitFailure.calls).slice(-2), [
    'rollbackTransaction',
    'releaseAdvisoryLock',
  ]);

  const rollbackFailure = createHarness({
    executionError: new Error('private execution failure'),
    rollbackError: new Error('private rollback failure'),
  });

  await assert.rejects(
    rollbackFailure.authority.executeMigration(
      descriptor(),
      {
        bootstrapAuthorized: true,
      },
    ),
    (error) => {
      assert.equal(error.code, 'DATABASE_MIGRATION_EXECUTION_FAILED');
      assert.deepEqual(error.details.cleanupErrors, [
        'DATABASE_MIGRATION_ROLLBACK_FAILED',
      ]);
      return true;
    },
  );

  const releaseFailure = createHarness({
    releaseError: new Error('private release failure'),
  });

  await expectCode(
    releaseFailure.authority.executeMigration(
      descriptor(),
      {
        bootstrapAuthorized: true,
      },
    ),
    'DATABASE_MIGRATION_LOCK_RELEASE_FAILED',
  );

  const contract = successful.authority.getContract();

  assert.equal(contract.state, 'OFFLINE_AUTHORITY_READY');
  assert.equal(contract.databaseContacted, false);
  assert.equal(contract.productionAuthority, false);
  assert.equal(Object.isFrozen(contract), true);

  const serializedResults = JSON.stringify({
    successfulResult,
    alreadyAppliedResult,
    contract,
  });

  assert.doesNotMatch(serializedResults, /CREATE TABLE/);
  assert.doesNotMatch(serializedResults, /private .* failure/i);
  assert.doesNotMatch(serializedResults, /password|credential|secret/i);

  const authoritySource = fs.readFileSync(
    path.join(
      ROOT,
      'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-migration-authority.js',
    ),
    'utf8',
  );

  for (const pattern of [
    /require\s*\(\s*['"]pg['"]\s*\)/,
    /from\s+['"]pg['"]/,
    /\bnew\s+Pool\s*\(/,
    /\bnew\s+Client\s*\(/,
    /process\.env/,
    /require\s*\([^)]*server/,
    /from\s+['"][^'"]*server/,
    /\.connect\s*\(/,
    /\.query\s*\(/,
  ]) {
    assert.equal(
      pattern.test(authoritySource),
      false,
      `Forbidden runtime capability found: ${pattern}`,
    );
  }

  const serverSource = fs.readFileSync(
    path.join(
      ROOT,
      'runtime/orchestrator-service/server.js',
    ),
    'utf8',
  );

  assert.doesNotMatch(
    serverSource,
    /postgresql-migration-authority/,
  );

  console.log('POSTGRESQL_MIGRATION_AUTHORITY_OFFLINE=PASS');
  console.log('CANONICAL_MIGRATION_ADMISSION=PASS');
  console.log('CHECKSUM_VALIDATION=PASS');
  console.log('EMBEDDED_TRANSACTION_REJECTION=PASS');
  console.log('ADVISORY_LOCK_HANDLING=PASS');
  console.log('HISTORY_STATE_HANDLING=PASS');
  console.log('BOOTSTRAP_GATE_HANDLING=PASS');
  console.log('IDEMPOTENCY=PASS');
  console.log('TRANSACTION_ORDERING=PASS');
  console.log('ROLLBACK_BEHAVIOR=PASS');
  console.log('LOCK_RELEASE_BEHAVIOR=PASS');
  console.log('PRIMARY_FAILURE_PRESERVATION=PASS');
  console.log('RESULT_FREEZING=PASS');
  console.log('SQL_RESULT_EXCLUSION=PASS');
  console.log('SECRET_RESULT_EXCLUSION=PASS');
  console.log('PG_IMPORT=ABSENT');
  console.log('POOL_CREATED=NO');
  console.log('CLIENT_CREATED=NO');
  console.log('SERVER_JS_CHANGED=NO');
  console.log('DATABASE_CONTACTED=NO');
  console.log('SQL_EXECUTED=NO');
  console.log('REAL_MIGRATION_EXECUTED=NO');
  console.log('RUNTIME_BINDING_CHANGED=NO');
  console.log('PRODUCTION_AUTHORITY_GRANTED=NO');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

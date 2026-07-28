'use strict';

const MIGRATION_TRANSACTION_MODEL = 'EXECUTOR_MANAGED_TRANSACTION';
const MIGRATION_ADVISORY_LOCK_NAMESPACE =
  'mh-os.identity-workspace.migration-authority.v1';
const MIGRATION_ADVISORY_LOCK_KEY = '9051548987079335361';

const CANONICAL_MIGRATION = Object.freeze({
  migrationId: '0001_initial_authority_schema',
  migrationOrder: 1,
  migrationPath:
    'runtime/orchestrator-service/migrations/identity-workspace-authority/0001_initial_authority_schema.sql',
  migrationSha256:
    '987dfea602dc9d5a6d392f5e635bd39b52973e4f0f2655de5752a11650313061',
});

const HISTORY_STATES = Object.freeze({
  AVAILABLE: 'HISTORY_AVAILABLE',
  ABSENT_BOOTSTRAP_ALLOWED: 'HISTORY_ABSENT_BOOTSTRAP_ALLOWED',
  ABSENT_NOT_ALLOWED: 'HISTORY_ABSENT_NOT_ALLOWED',
  READ_FAILED: 'HISTORY_READ_FAILED',
});

class PostgreSQLMigrationAuthorityError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'PostgreSQLMigrationAuthorityError';
    this.code = code;
    this.details = details;
  }
}

function freeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value)) {
    freeze(child);
  }

  return Object.freeze(value);
}

function validateDependencies(dependencies) {
  const required = [
    'readMigrationFile',
    'sha256',
    'now',
    'createExecutionSession',
  ];

  if (!dependencies || typeof dependencies !== 'object') {
    throw new PostgreSQLMigrationAuthorityError(
      'DATABASE_MIGRATION_DEPENDENCY_INVALID',
      'PostgreSQL migration authority dependencies are invalid',
    );
  }

  for (const key of required) {
    if (typeof dependencies[key] !== 'function') {
      throw new PostgreSQLMigrationAuthorityError(
        'DATABASE_MIGRATION_DEPENDENCY_INVALID',
        `PostgreSQL migration dependency is invalid: ${key}`,
      );
    }
  }

  return dependencies;
}

function validateDescriptor(descriptor) {
  if (
    !descriptor
    || typeof descriptor !== 'object'
    || descriptor.migration_id !== CANONICAL_MIGRATION.migrationId
    || descriptor.migration_order !== CANONICAL_MIGRATION.migrationOrder
    || descriptor.migration_path !== CANONICAL_MIGRATION.migrationPath
    || descriptor.checksum_sha256 !== CANONICAL_MIGRATION.migrationSha256
  ) {
    throw new PostgreSQLMigrationAuthorityError(
      'DATABASE_MIGRATION_NOT_ADMITTED',
      'Migration descriptor is not admitted by the canonical registry',
    );
  }

  return descriptor;
}

function assertNoEmbeddedTransactionWrappers(sql) {
  if (typeof sql !== 'string' || sql.trim() === '') {
    throw new PostgreSQLMigrationAuthorityError(
      'DATABASE_MIGRATION_FILE_READ_FAILED',
      'Migration file content is invalid',
    );
  }

  const wrapperPattern =
    /^[\t ]*(BEGIN|COMMIT|ROLLBACK)[\t ]*;[\t ]*$/gim;

  if (wrapperPattern.test(sql)) {
    throw new PostgreSQLMigrationAuthorityError(
      'DATABASE_MIGRATION_EMBEDDED_TRANSACTION_FORBIDDEN',
      'Embedded migration transaction wrappers are forbidden',
    );
  }
}

function validateSession(session) {
  const required = [
    'acquireAdvisoryLock',
    'readMigrationHistory',
    'beginTransaction',
    'executeMigration',
    'recordMigrationApplied',
    'commitTransaction',
    'rollbackTransaction',
    'releaseAdvisoryLock',
  ];

  if (!session || typeof session !== 'object') {
    throw new PostgreSQLMigrationAuthorityError(
      'DATABASE_MIGRATION_DEPENDENCY_INVALID',
      'Migration execution session is invalid',
    );
  }

  for (const key of required) {
    if (typeof session[key] !== 'function') {
      throw new PostgreSQLMigrationAuthorityError(
        'DATABASE_MIGRATION_DEPENDENCY_INVALID',
        `Migration session method is invalid: ${key}`,
      );
    }
  }

  return session;
}

function normalizeHistory(history) {
  if (!history || typeof history !== 'object') {
    throw new PostgreSQLMigrationAuthorityError(
      'DATABASE_MIGRATION_HISTORY_READ_FAILED',
      'Migration history response is invalid',
    );
  }

  if (!Object.values(HISTORY_STATES).includes(history.state)) {
    throw new PostgreSQLMigrationAuthorityError(
      'DATABASE_MIGRATION_HISTORY_READ_FAILED',
      'Migration history state is invalid',
    );
  }

  return history;
}

function createResult(overrides = {}) {
  return freeze({
    authority: 'postgresql-migration-authority',
    transactionModel: MIGRATION_TRANSACTION_MODEL,
    lockNamespace: MIGRATION_ADVISORY_LOCK_NAMESPACE,
    lockKey: MIGRATION_ADVISORY_LOCK_KEY,
    migrationId: CANONICAL_MIGRATION.migrationId,
    migrationOrder: CANONICAL_MIGRATION.migrationOrder,
    migrationSha256: CANONICAL_MIGRATION.migrationSha256,
    applied: false,
    alreadyApplied: false,
    databaseContacted: false,
    sqlExecuted: false,
    realMigrationExecuted: false,
    runtimeBindingChanged: false,
    productionAuthority: false,
    ...overrides,
  });
}

function createMigrationAuthority(options = {}) {
  const dependencies = validateDependencies(options.dependencies);

  async function executeMigration(descriptor, executionOptions = {}) {
    validateDescriptor(descriptor);

    let sql;

    try {
      sql = await dependencies.readMigrationFile(
        CANONICAL_MIGRATION.migrationPath,
      );
    } catch {
      throw new PostgreSQLMigrationAuthorityError(
        'DATABASE_MIGRATION_FILE_READ_FAILED',
        'Migration file could not be read',
      );
    }

    assertNoEmbeddedTransactionWrappers(sql);

    let actualChecksum;

    try {
      actualChecksum = await dependencies.sha256(sql);
    } catch {
      throw new PostgreSQLMigrationAuthorityError(
        'DATABASE_MIGRATION_CHECKSUM_CALCULATION_FAILED',
        'Migration checksum could not be calculated',
      );
    }

    if (actualChecksum !== CANONICAL_MIGRATION.migrationSha256) {
      throw new PostgreSQLMigrationAuthorityError(
        'DATABASE_MIGRATION_CHECKSUM_MISMATCH',
        'Migration checksum does not match the canonical registry',
      );
    }

    let session;

    try {
      session = validateSession(
        await dependencies.createExecutionSession(),
      );
    } catch (error) {
      if (error instanceof PostgreSQLMigrationAuthorityError) {
        throw error;
      }

      throw new PostgreSQLMigrationAuthorityError(
        'DATABASE_MIGRATION_DEPENDENCY_INVALID',
        'Migration execution session could not be created',
      );
    }

    let lockAcquired = false;
    let transactionStarted = false;
    let primaryError = null;
    const cleanupErrors = [];

    try {
      let lockResult;

      try {
        lockResult = await session.acquireAdvisoryLock(
          MIGRATION_ADVISORY_LOCK_KEY,
        );
      } catch {
        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_LOCK_UNAVAILABLE',
          'Migration advisory lock could not be acquired',
        );
      }

      if (!lockResult || lockResult.acquired !== true) {
        throw new PostgreSQLMigrationAuthorityError(
          lockResult && lockResult.timeout === true
            ? 'DATABASE_MIGRATION_LOCK_TIMEOUT'
            : 'DATABASE_MIGRATION_LOCK_UNAVAILABLE',
          'Migration advisory lock could not be acquired',
        );
      }

      lockAcquired = true;

      let history;

      try {
        history = normalizeHistory(
          await session.readMigrationHistory(
            CANONICAL_MIGRATION.migrationId,
          ),
        );
      } catch (error) {
        if (error instanceof PostgreSQLMigrationAuthorityError) {
          throw error;
        }

        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_HISTORY_READ_FAILED',
          'Migration history could not be read',
        );
      }

      if (history.state === HISTORY_STATES.READ_FAILED) {
        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_HISTORY_READ_FAILED',
          'Migration history read failed',
        );
      }

      if (history.state === HISTORY_STATES.AVAILABLE) {
        if (
          history.checksum_sha256
          !== CANONICAL_MIGRATION.migrationSha256
        ) {
          throw new PostgreSQLMigrationAuthorityError(
            'DATABASE_MIGRATION_CHECKSUM_MISMATCH',
            'Applied migration checksum does not match',
          );
        }

        return createResult({
          state: 'ALREADY_APPLIED',
          alreadyApplied: true,
        });
      }

      if (
        history.state === HISTORY_STATES.ABSENT_NOT_ALLOWED
        || (
          history.state === HISTORY_STATES.ABSENT_BOOTSTRAP_ALLOWED
          && executionOptions.bootstrapAuthorized !== true
        )
      ) {
        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_HISTORY_ABSENT_NOT_ALLOWED',
          'Migration history absence is not authorized',
        );
      }

      try {
        await session.beginTransaction();
        transactionStarted = true;
      } catch {
        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_TRANSACTION_BEGIN_FAILED',
          'Migration transaction could not begin',
        );
      }

      try {
        await session.executeMigration(sql);
      } catch {
        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_EXECUTION_FAILED',
          'Migration execution failed',
        );
      }

      try {
        await session.recordMigrationApplied({
          migration_id: CANONICAL_MIGRATION.migrationId,
          migration_order: CANONICAL_MIGRATION.migrationOrder,
          checksum_sha256: CANONICAL_MIGRATION.migrationSha256,
          applied_at: dependencies.now(),
        });
      } catch {
        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_HISTORY_WRITE_FAILED',
          'Migration history recording failed',
        );
      }

      try {
        await session.commitTransaction();
        transactionStarted = false;
      } catch {
        throw new PostgreSQLMigrationAuthorityError(
          'DATABASE_MIGRATION_COMMIT_FAILED',
          'Migration transaction commit failed',
        );
      }

      return createResult({
        state: 'APPLIED_OFFLINE_SIMULATION',
        applied: true,
      });
    } catch (error) {
      primaryError =
        error instanceof PostgreSQLMigrationAuthorityError
          ? error
          : new PostgreSQLMigrationAuthorityError(
            'DATABASE_MIGRATION_EXECUTION_FAILED',
            'Migration execution failed',
          );

      if (transactionStarted) {
        try {
          await session.rollbackTransaction();
          transactionStarted = false;
        } catch {
          cleanupErrors.push('DATABASE_MIGRATION_ROLLBACK_FAILED');
        }
      }

      if (cleanupErrors.length > 0) {
        primaryError.details = freeze({
          cleanupErrors: [...cleanupErrors],
        });
      }

      throw primaryError;
    } finally {
      if (lockAcquired) {
        try {
          await session.releaseAdvisoryLock(
            MIGRATION_ADVISORY_LOCK_KEY,
          );
        } catch {
          if (primaryError) {
            const priorCleanup =
              primaryError.details
              && Array.isArray(primaryError.details.cleanupErrors)
                ? primaryError.details.cleanupErrors
                : [];

            primaryError.details = freeze({
              cleanupErrors: [
                ...priorCleanup,
                'DATABASE_MIGRATION_LOCK_RELEASE_FAILED',
              ],
            });
          } else {
            throw new PostgreSQLMigrationAuthorityError(
              'DATABASE_MIGRATION_LOCK_RELEASE_FAILED',
              'Migration advisory lock release failed',
            );
          }
        }
      }
    }
  }

  return freeze({
    executeMigration,
    getContract() {
      return createResult({
        state: 'OFFLINE_AUTHORITY_READY',
      });
    },
  });
}

module.exports = Object.freeze({
  PostgreSQLMigrationAuthorityError,
  MIGRATION_TRANSACTION_MODEL,
  MIGRATION_ADVISORY_LOCK_NAMESPACE,
  MIGRATION_ADVISORY_LOCK_KEY,
  CANONICAL_MIGRATION,
  HISTORY_STATES,
  createMigrationAuthority,
});

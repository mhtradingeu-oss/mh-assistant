# PHASE_L5C_E4C_R17_MIGRATION_AUTHORITY_OFFLINE_IMPLEMENTATION

## Status

```text
STATUS=DESIGN_CANDIDATE
AUTHORITY=NOT_IMPLEMENTED
DATABASE_CONTACT=NOT_AUTHORIZED
PRODUCTION_AUTHORITY=NOT_GRANTED
## 1. Purpose

This contract defines the offline implementation boundary for the PostgreSQL
Migration Authority.

The purpose is to create a deterministic migration execution authority that
owns migration decision flow before any real PostgreSQL contact is authorized.

This phase does not execute migrations against a database.

## 2. Scope

The migration authority is responsible for:

migration descriptor validation;
checksum validation;
advisory lock coordination;
migration history decision flow;
admitted migration execution delegation;
applied migration recording;
lock release guarantees.

The migration authority is not responsible for:

PostgreSQL connection creation;
Pool creation;
Client creation;
server startup binding;
production activation.
## 3. Runtime Owner

The future runtime owner is:

runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-migration-authority.js

The authority must expose a controlled execution boundary.

Required factory:

createMigrationAuthority()

Required operation:

executeMigration(descriptor)
## 4. Migration Descriptor Contract

A migration descriptor must contain:

migration_id
migration_path
checksum_sha256
order

Validation rules:

migration_id must exist;
migration_path must be admitted;
checksum_sha256 must be valid;
order must be deterministic;
arbitrary SQL paths are forbidden.
## 5. Dependency Injection Boundary

The migration authority must use injected capabilities only.

Required injected dependencies:

readMigrationFile(path)
sha256(content)
now()
createExecutionSession()

The implementation must not create hidden dependencies.

## 6. Execution Session Contract

The execution session represents the future database boundary.

Required methods:

acquireAdvisoryLock(lockKey)

readMigrationHistory(migrationId)

beginTransaction()

executeMigration(sql)

recordMigrationApplied(record)

commitTransaction()

rollbackTransaction()

releaseAdvisoryLock(lockKey)

Offline verification must provide a fake implementation.

## 7. Execution Lifecycle

The required lifecycle:

VALIDATE_DESCRIPTOR
        |
        v
VALIDATE_CHECKSUM
        |
        v
CREATE_SESSION
        |
        v
ACQUIRE_ADVISORY_LOCK
        |
        v
READ_MIGRATION_HISTORY
        |
        +----------------------+
        |                      |
        v                      v

ALREADY_APPLIED          NOT_APPLIED

same checksum            execute migration
return result            record history

        \                      /
         \                    /
          v                  v

             RELEASE_LOCK
                  |
                  v
              RETURN_RESULT
## 8. Idempotency Rules

The authority must guarantee:

Same migration ID + same checksum:

ALREADY_APPLIED

Same migration ID + different checksum:

DATABASE_MIGRATION_CHECKSUM_CALCULATION_FAILED

DATABASE_MIGRATION_CHECKSUM_MISMATCH
## 9. Advisory Lock Rules

The canonical lock authority is:

LOCK_NAMESPACE=mh-os.identity-workspace.migration-authority.v1
LOCK_KEY=9051548987079335361

The authority must:

use the approved deterministic lock key;
prevent concurrent duplicate execution;
use bounded lock acquisition;
release acquired locks.

Required failures:

DATABASE_MIGRATION_LOCK_UNAVAILABLE

DATABASE_MIGRATION_LOCK_TIMEOUT
## 10. Transaction Ownership

After R17A reconciliation:

TRANSACTION_MODEL=EXECUTOR_MANAGED_TRANSACTION

The executor owns the atomic sequence:

BEGIN
MIGRATION_DDL
MIGRATION_HISTORY_INSERT
COMMIT

If migration execution or migration-history recording fails after transaction start, the executor must perform:

ROLLBACK

The executor owns transaction boundaries.

Migration files must not contain:

BEGIN;
COMMIT;
ROLLBACK;

The future runtime transaction model:

EXECUTOR_MANAGED_TRANSACTION

The offline implementation must verify this boundary.

## 11. Canonical Bootstrap Migration Admission

The only migration admitted by this R17 contract is:

MIGRATION_ID=0001_initial_authority_schema
MIGRATION_ORDER=1
MIGRATION_PATH=runtime/orchestrator-service/migrations/identity-workspace-authority/0001_initial_authority_schema.sql
MIGRATION_SHA256=987dfea602dc9d5a6d392f5e635bd39b52973e4f0f2655de5752a11650313061

The migration ID, order, path, and checksum are repository-governed constants.

They must not be supplied by HTTP requests, frontend state, provider responses, arbitrary environment variables, or arbitrary filesystem paths.

This contract does not authorize adding additional migrations.

## 12. Migration History States

The authority must distinguish these states:

HISTORY_AVAILABLE

HISTORY_ABSENT_BOOTSTRAP_ALLOWED

HISTORY_ABSENT_NOT_ALLOWED

HISTORY_READ_FAILED

Rules:

- HISTORY_AVAILABLE permits normal idempotency evaluation.
- HISTORY_ABSENT_BOOTSTRAP_ALLOWED is valid only for the admitted initial authority-schema migration and only under a separately approved first-contact bootstrap gate.
- HISTORY_ABSENT_NOT_ALLOWED fails closed.
- HISTORY_READ_FAILED fails closed and must never be interpreted as absent history.
- R17 models the bootstrap decision but grants no bootstrap or database-contact authority.

## 13. Error Contract

Required error codes:

DATABASE_MIGRATION_INVALID_DESCRIPTOR

DATABASE_MIGRATION_CHECKSUM_MISMATCH

DATABASE_MIGRATION_LOCK_UNAVAILABLE

DATABASE_MIGRATION_LOCK_TIMEOUT

DATABASE_MIGRATION_HISTORY_READ_FAILED

DATABASE_MIGRATION_EXECUTION_FAILED

DATABASE_MIGRATION_HISTORY_WRITE_FAILED
## 14. Forbidden Capabilities

The implementation must not:

require("pg")

new Pool()

new Client()

server import

process.env access

HTTP input SQL

frontend supplied SQL

dynamic SQL generation

arbitrary filesystem execution
## 15. Offline Verification Requirements

The verifier must prove:

checksum validation
lock handling
idempotency
history decisions
failure cleanup
result freezing
secret exclusion
SQL exclusion
database exclusion
## 16. Required Offline Test Matrix

Minimum scenarios:

T01 valid migration executes once

T02 same migration and checksum returns already applied

T03 checksum drift fails closed

T04 checksum failure happens before session creation

T05 lock unavailable blocks execution

T06 history read failure releases lock

T07 migration execution failure releases lock

T08 history write failure releases lock

T09 invalid descriptor rejected

T10 invalid checksum rejected

T11 invalid dependency rejected

T12 transaction model enforced

T13 embedded transaction wrapper rejected

T14 result recursively frozen

T15 result excludes SQL

T16 no pg import

T17 no Pool construction

T18 no Client construction

T19 no server import

T20 verifier performs no database contact
## 17. Implementation Exit Criteria

R17 implementation is complete only when:

OFFLINE_VERIFIER=PASS

DATABASE_CONTACTED=NO

SQL_EXECUTED=NO

MIGRATION_EXECUTED=NO

PG_IMPORT=ABSENT

POOL_CREATED=NO

CLIENT_CREATED=NO
## 18. Authorization Boundary

This contract authorizes design and offline implementation only.

It does not authorize:

database creation

credential creation

database contact

migration execution

production activation

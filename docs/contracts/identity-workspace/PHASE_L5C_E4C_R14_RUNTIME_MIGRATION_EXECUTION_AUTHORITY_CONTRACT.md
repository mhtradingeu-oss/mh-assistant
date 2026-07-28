# PHASE L5C E4C-R14 — PostgreSQL Runtime Migration Execution Authority Contract

## Status

**Accepted and frozen.**

This contract defines future runtime migration execution authority only.

It does not authorize:

- database contact;
- migration execution;
- SQL execution;
- database or role creation;
- credential provisioning;
- real Pool construction;
- server binding;
- runtime activation;
- production authority.

## 1. Existing source-of-truth reconciliation

The existing persistence and schema authorities remain unchanged.

### Persistence policy authority

`docs/contracts/identity-workspace/POSTGRESQL_MEMBERSHIP_AUTHORITY_PERSISTENCE_V1.md`

### Physical schema authority

`runtime/orchestrator-service/migrations/identity-workspace-authority/0001_initial_authority_schema.sql`

### Static verification authority

`scripts/verification/verify-postgresql-membership-authority-contract.js`

### Migration identity

```text
MIGRATION_ID=0001_initial_authority_schema
MIGRATION_SHA256=4dd610ae30888a95dfa3260bb0021d8bdf61a2eb000d4ce57f67d34667b00f35
SCHEMA_NAMESPACE=identity_workspace_authority

No duplicate persistence contract or alternate initial schema is authorized.

2. Sole migration execution owner

Exactly one future runtime component may own PostgreSQL migration execution for
the identity/workspace authority.

Reserved future path:

runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-migration-authority.js

Only this component may eventually:

acquire the approved migration advisory lock;
inspect applied migration history;
compare immutable checksums;
execute approved migration SQL;
record successful migration application;
project sanitized migration state;
release the migration lock.

No route, handler, repository adapter, server module, startup helper, verifier,
or Pool owner may independently execute migrations.

3. Explicit invocation only

Migration execution must require an explicit authorized caller.

The following are prohibited:

execution during module import;
execution as a side effect of configuration resolution;
execution as a side effect of Pool creation;
implicit migration during server startup;
automatic migration during health or readiness probes;
automatic migration during repository adapter creation.
4. Approved migration registry

The initial approved migration registry contains exactly:

0001_initial_authority_schema

Its approved checksum is:

4dd610ae30888a95dfa3260bb0021d8bdf61a2eb000d4ce57f67d34667b00f35

Future migrations require:

immutable ordered migration IDs;
immutable SHA-256 values;
separately reviewed SQL;
static contract verification;
exact-scope repository admission;
explicit execution authorization.

Applied migration files may never be silently edited.

5. Checksum policy

Before execution, the migration authority must:

read the approved migration file;
calculate SHA-256 from exact bytes;
compare it with the approved registry value;
refuse execution on mismatch;
avoid database contact when local checksum validation fails.

If an applied migration ID exists with a different checksum, execution must fail
closed.

Required future error code:

DATABASE_MIGRATION_CHECKSUM_MISMATCH
6. Advisory lock policy

Migration execution requires a PostgreSQL advisory lock dedicated to the
identity/workspace authority.

The exact lock key must be:

deterministic;
namespace-specific;
stable across deployments;
documented before execution;
tested for concurrent runner exclusion.

The migration authority must not wait indefinitely.

Lock acquisition requires a bounded timeout.

Required future error codes:

DATABASE_MIGRATION_LOCK_UNAVAILABLE
DATABASE_MIGRATION_LOCK_TIMEOUT
7. Transaction ownership

The migration authority is the sole owner of migration transaction execution.

The initial migration blueprint already contains:

BEGIN;
...
COMMIT;

The future executor must not create ambiguous nested transaction behavior.

Before implementation, it must explicitly decide and test one strategy:

execute the approved self-transactional SQL as a complete unit; or
use executor-managed transactions after admitting a migration format without
embedded transaction boundaries.

The two strategies may not be mixed silently.

Partial migration success is prohibited.

8. Migration history table

Applied migration history is stored in:

identity_workspace_authority.schema_migrations

Each successful record requires:

migration ID;
immutable SHA-256 checksum;
applied timestamp;
sanitized applied-by identity.

A migration must be recorded only after successful completion.

A failed migration must not be recorded as applied.

Repeated execution of an already applied migration with the same checksum must
be idempotent and return an already-applied result without re-running SQL.

9. Execution order

Migrations must execute in deterministic ascending migration order.

The executor must refuse:

unknown files;
missing registered files;
duplicate IDs;
duplicate order positions;
checksum drift;
out-of-order execution;
gaps that violate the approved registry.
10. SQL scope

The migration authority may execute only reviewed migration files admitted to
the approved registry.

It may not accept arbitrary SQL text from:

HTTP requests;
frontend input;
environment variables;
provider responses;
generic file paths;
user-supplied filesystem locations.

Dynamic SQL generation is not authorized.

11. Connection and Pool boundary

Migration execution may use only a narrow injected database interface admitted
by a future implementation phase.

The migration authority must not:

expose a mutable Pool;
create additional Pool owners;
create its own global connection cache;
bypass the PostgreSQL lifecycle owner;
share raw credentials through public APIs.

Real Pool construction and database contact remain separately gated.

12. Error taxonomy

Minimum future error codes:

DATABASE_MIGRATION_CONFIGURATION_INVALID
DATABASE_MIGRATION_REGISTRY_INVALID
DATABASE_MIGRATION_FILE_NOT_FOUND
DATABASE_MIGRATION_CHECKSUM_MISMATCH
DATABASE_MIGRATION_LOCK_UNAVAILABLE
DATABASE_MIGRATION_LOCK_TIMEOUT
DATABASE_MIGRATION_HISTORY_INVALID
DATABASE_MIGRATION_ORDER_INVALID
DATABASE_MIGRATION_EXECUTION_FAILED
DATABASE_MIGRATION_RECORD_FAILED
DATABASE_MIGRATION_ROLLBACK_FAILED
DATABASE_MIGRATION_ALREADY_APPLIED
DATABASE_MIGRATION_AUTHORITY_UNAVAILABLE

Public errors must not expose:

credentials;
database URLs;
raw Pool options;
certificate contents;
unrestricted filesystem paths;
raw provider errors containing secrets;
complete migration SQL.
13. Backup and rollback policy

Before first production migration execution, the target environment must provide:

a verified database backup or snapshot;
restore ownership;
restore command or procedure;
recovery time expectations;
recovery point expectations;
post-restore validation;
evidence that the backup belongs to the exact target database.

Routine destructive down migrations are prohibited.

Rollback strategy is:

stop further migration attempts;
preserve evidence;
use a reviewed forward repair where safe; or
restore a verified backup or snapshot.

A rotating application file backup is not database rollback evidence.

14. Concurrency and idempotency

Offline and integration tests must prove:

concurrent migration runners do not execute the same migration twice;
advisory lock ownership is exclusive;
repeated same-checksum execution is idempotent;
checksum mismatch refuses execution;
failed SQL is not recorded as applied;
failed history recording is surfaced;
lock release is attempted on all terminal paths;
retries are bounded and separately authorized.

Automatic infinite retry is prohibited.

15. Observability

Permitted migration metadata:

migration ID;
approved checksum;
lifecycle stage;
lock state;
result classification;
sanitized error code;
elapsed time;
already-applied boolean;
target environment identifier when policy permits.

Forbidden observability:

passwords;
connection strings;
certificate material;
raw SQL;
unrestricted environment dumps;
raw Pool options;
unredacted provider errors.
16. Health and readiness

Health may report migration authority lifecycle state.

Readiness must not silently execute migrations.

Before production activation, readiness may require:

migration registry valid;
local checksums valid;
required migrations applied;
no migration currently executing;
no unresolved migration failure;
schema compatibility certified.

A readiness failure must remain sanitized.

17. Dependency injection and testing

The future implementation must support injected boundaries for:

migration registry;
file reader;
checksum calculator;
clock;
timeout scheduler;
advisory-lock operations;
transaction or execution interface;
migration-history reader;
migration-history writer;
logger;
lifecycle hooks.

Offline tests must use fake database interfaces only.

Offline verification must prove:

REAL_POOL_CREATED=NO
DATABASE_CONTACTED=NO
SQL_EXECUTED=NO
MIGRATION_EXECUTED=NO
18. First database-contact gate

This contract does not authorize first database contact.

Before first contact, all of the following remain required:

this contract committed and pushed;
future migration executor implemented and tested offline;
exact target environment declared;
database and role provisioning contract approved;
credentials provisioned through an approved secret channel;
backup and restore evidence approved;
advisory lock key frozen;
migration execution command frozen;
real Pool construction separately authorized;
server binding remains absent;
explicit first-contact authorization committed.

Until then:

FIRST_DATABASE_CONTACT_AUTHORIZED=NO
19. Server and runtime binding

runtime/orchestrator-service/server.js must remain unchanged.

This phase does not authorize:

startup migration;
route exposure;
signal ownership;
health-route wiring;
readiness-route wiring;
repository runtime binding;
positive permission activation.
20. Production authority

None of the following grants production authority:

valid static SQL;
matching checksum;
implemented migration executor;
acquired advisory lock;
successful migration;
successful schema probe;
successful integration test.

Production authority requires a later explicit cutover supported by security,
recovery, parity, operational, and rollback evidence.

21. Authorization matrix
WRITE_RUNTIME_MIGRATION_CONTRACT=YES
CREATE_RUNTIME_MIGRATION_EXECUTOR=NO
MODIFY_STATIC_MIGRATION_SQL=NO
CREATE_NEW_MIGRATION_FILES=NO
IMPORT_PG=NO
CREATE_REAL_POOL=NO
CONTACT_DATABASE=NO
EXECUTE_SQL=NO
RUN_MIGRATIONS=NO
CREATE_DATABASE=NO
CREATE_DATABASE_ROLE=NO
PROVISION_CREDENTIALS=NO
CHANGE_SERVER_JS=NO
BIND_RUNTIME=NO
GRANT_PRODUCTION_AUTHORITY=NO
22. Next sequence
R14 Runtime Migration Execution Authority Contract
→ R15 Target Environment and Provisioning Contract
→ R16 Backup, Restore, and First-Contact Runbook
→ R17 Offline Migration Executor Skeleton
→ Explicit First Database Contact Authorization

No step may be interpreted as implicit permission for the next.

## R17A migration format, lock, and bootstrap reconciliation

The migration authority transaction model is now frozen.

MIGRATION_SHA256=4dd610ae30888a95dfa3260bb0021d8bdf61a2eb000d4ce57f67d34667b00f35
MIGRATION_ADVISORY_LOCK_NAMESPACE=mh-os.identity-workspace.migration-authority.v1
MIGRATION_ADVISORY_LOCK_KEY=9051548987079335361
MIGRATION_TRANSACTION_MODEL=EXECUTOR_MANAGED_TRANSACTION
MIGRATION_SQL_EMBEDDED_BEGIN_ALLOWED=NO
MIGRATION_SQL_EMBEDDED_COMMIT_ALLOWED=NO
MIGRATION_SQL_EMBEDDED_ROLLBACK_ALLOWED=NO
BOOTSTRAP_MIGRATION_ID=0001_initial_authority_schema
GENERIC_HISTORY_ERROR_AS_ABSENCE=PROHIBITED
FIRST_DATABASE_CONTACT_AUTHORIZED=NO

The future executor owns:
- advisory lock acquisition;
- bootstrap/history decision;
- transaction begin;
- admitted migration execution;
- history recording;
- commit or rollback.

No database contact or migration execution is authorized by this section.

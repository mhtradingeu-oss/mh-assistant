# PHASE L5C E4C-R16 — PostgreSQL Backup, Recovery, and First-Contact Runbook Contract

## Status

**Accepted and frozen.**

This document freezes the future local PostgreSQL provisioning and first-contact
runbook boundary.

It does not execute the runbook and does not authorize database contact.

## 1. Inherited target

```text
TARGET_ENVIRONMENT_ID=mhos-identity-workspace-local-integration-v1
TARGET_ENVIRONMENT_CLASS=LOCAL_ISOLATED_INTEGRATION
TARGET_HOST=127.0.0.1
TARGET_DATABASE=mh_identity_workspace_integration
TARGET_CONTAINER_CLASS=DISPOSABLE_LOCAL_INTEGRATION
PRODUCTION_TARGET_ENVIRONMENT=UNDECLARED

No remote, shared, staging, Odoo, VPS, or production database is eligible.

2. Current tooling truth

The R16 truth scan established:

DOCKER_ENGINE_READY_AT_TRUTH_SCAN=NO
EXISTING_POSTGRES_CONTAINER_COUNT=0
EXISTING_POSTGRES_IMAGE_COUNT=0

Therefore this contract must not invent an image digest or claim that a
container runtime is ready.

3. Docker precondition

The future execution phase must stop before all provisioning when:

DOCKER_ENGINE_READY=NO

Starting Docker Desktop or another approved local engine is an operator action,
not an MH-OS runtime action.

The execution phase must recheck:

Docker CLI availability;
Docker engine availability;
client/server version compatibility;
current container inventory;
current image inventory;
available disk space;
candidate port availability.
4. PostgreSQL image authority
TARGET_POSTGRES_IMAGE=UNSELECTED_PENDING_ENGINE_PREFLIGHT
TARGET_POSTGRES_DIGEST=UNSELECTED_PENDING_ENGINE_PREFLIGHT
FLOATING_TAG_AUTHORIZED=NO

A future execution-admission phase must:

identify an approved PostgreSQL major version;
resolve the exact image;
record its immutable repository digest;
inspect image architecture compatibility;
reject unresolved or mutable-only identity;
record the digest before container creation.

No image is pulled by R16.

5. Container identity

Reserved container name:

TARGET_CONTAINER_NAME=mhos-identity-postgres-integration-v1

The name is reserved only and no container is created.

The future container must:

be dedicated to this integration environment;
use no unrelated existing volume;
mount no repository directory;
mount no MH-OS data/ directory;
have no public or LAN exposure;
use a loopback-only host port mapping;
be disposable;
carry labels identifying its environment and non-production status.
6. Candidate port
TARGET_PORT_CANDIDATE=55432
TARGET_PORT_RESERVED=NO

Port 55432 was not observed in use during the R16 truth scan.

This is not a permanent reservation.

Immediately before container creation, the execution phase must prove again
that the port is unused. If it is occupied, execution must stop and require a
new explicitly recorded port decision.

Automatic port substitution is prohibited.

7. Local TLS decision

For this one disposable loopback-only environment:

LOCAL_TLS_MODE=disable
TLS_SCOPE=LOCAL_LOOPBACK_DISPOSABLE_ONLY
TLS_SILENT_DOWNGRADE_ALLOWED=NO
REMOTE_TLS_MODE=verify-full

This decision is valid only while all of the following remain true:

host is exactly 127.0.0.1;
PostgreSQL is exposed only through loopback;
no LAN, public, tunnel, or remote access exists;
no production or customer data exists;
the environment remains disposable;
the configuration explicitly declares disable.

The decision must not be reused for CI, staging, remote, or production systems.

8. Reserved database roles
MIGRATION_ROLE=mh_identity_workspace_migrator
RUNTIME_READ_ROLE=mh_identity_workspace_reader
RUNTIME_WRITE_ROLE=NOT_AUTHORIZED

The migration and reader roles must use separate generated credentials.

The application runtime must never use the migration role.

9. Credential generation boundary

Credentials may be generated only in the future provisioning phase.

They must be:

cryptographically random;
role-specific;
environment-specific;
non-default;
non-reused;
absent from command output;
absent from process arguments where reasonably avoidable;
absent from repository files;
absent from evidence archives.
MIGRATION_SECRET=NOT_CREATED
READER_SECRET=NOT_CREATED
DATABASE_CREDENTIALS_CREATED=NO
10. Temporary secret handling

A future execution phase may create a temporary secret workspace only outside
the repository.

Required controls:

SECRET_WORKSPACE_UMASK=077
SECRET_FILE_MODE=600
SECRET_OUTPUT_REDACTED=YES
SECRET_ARCHIVED=NO
SECRET_COMMITTED=NO

The workspace must be removed after the authorized operation.

Evidence may contain only booleans proving credential presence, never values or
reversible fingerprints.

11. Provisioning separation

Provisioning and first contact are separate gates.

Provisioning may eventually create:

one isolated PostgreSQL container;
one dedicated database;
one migration role;
one runtime reader role;
least-privilege grants.

Provisioning must stop before:

application Pool construction;
application database connection;
migration execution;
schema discovery through application code;
repository adapter binding;
server startup binding.
12. Database creation sequence

The future provisioning phase must use the container-local administrative
boundary to create the database and roles.

It must not use:

a generic host PostgreSQL administrator;
an existing shared administrator;
Odoo credentials;
production credentials;
application runtime credentials.

The exact commands remain unexecuted and require separate admission.

13. Privilege policy

Migration role privileges must be limited to the approved schema and migration
requirements.

Reader privileges must be limited to read access after migration.

The reader must not be able to:

create schema objects;
modify schema objects;
write authority records;
modify migration history;
grant privileges;
create roles;
execute migration DDL.

Privilege verification requires negative tests, not configuration claims alone.

14. Recovery model

The selected environment contains zero authorized user data.

BACKUP_CLASS=DISPOSABLE_INTEGRATION_RECREATE
RPO=ZERO_AUTHORIZED_USER_DATA
RTO=BOUNDED_RECREATE
RECOVERY_OWNER=AUTHORIZED_LOCAL_OPERATOR

Recovery is:

preserve sanitized failure evidence;
stop and remove the isolated container;
remove only its explicitly identified disposable volume;
recreate from the frozen image digest and runbook;
regenerate environment-specific credentials;
rerun separately authorized migration and verification phases.

No unrelated Docker resource may be removed.

15. Pre-migration evidence

Before migration execution, future evidence must record:

repository HEAD and origin equality;
target environment ID;
container name and ID;
immutable image digest;
PostgreSQL version;
host 127.0.0.1;
selected port;
database name;
role names;
TLS classification;
migration ID;
migration SHA-256;
empty-user-data declaration;
credential-presence booleans;
no secret values.
16. Migration identity
MIGRATION_ID=0001_initial_authority_schema
MIGRATION_SHA256=987dfea602dc9d5a6d392f5e635bd39b52973e4f0f2655de5752a11650313061

Checksum mismatch must stop before migration execution.

Provisioning success does not authorize this migration.

17. First-contact definition

A database contact includes any operation that causes a PostgreSQL client,
driver, health probe, readiness probe, migration tool, or application component
to establish or attempt a connection.

This includes:

psql;
pg_isready;
pg_dump;
pg_restore;
Node pg;
Pool initialization that connects;
migration execution;
schema or version probes.

Container-local administrative initialization performed by the PostgreSQL image
during provisioning must be classified separately and must not be misreported
as application first contact.

18. First-contact command boundary
FIRST_CONTACT_COMMAND_DECLARED=NO
FIRST_DATABASE_CONTACT_AUTHORIZED=NO

The exact first application-controlled contact command may be frozen only after:

Docker engine readiness;
immutable image digest selection;
successful isolated provisioning;
credential handling proof;
port isolation proof;
role separation proof;
offline migration executor completion;
sanitized environment declaration;
separate first-contact authorization.
19. Application configuration boundary

The future application configuration uses only:

MH_IDENTITY_DB_ENABLED
MH_IDENTITY_DB_HOST
MH_IDENTITY_DB_PORT
MH_IDENTITY_DB_NAME
MH_IDENTITY_DB_USER
MH_IDENTITY_DB_PASSWORD
MH_IDENTITY_DB_SSL_MODE
MH_IDENTITY_DB_SSL_CA_FILE
MH_IDENTITY_DB_POOL_MAX
MH_IDENTITY_DB_IDLE_TIMEOUT_MS
MH_IDENTITY_DB_CONNECT_TIMEOUT_MS
MH_IDENTITY_DB_STATEMENT_TIMEOUT_MS
MH_IDENTITY_DB_APPLICATION_NAME

For the local target:

MH_IDENTITY_DB_HOST=127.0.0.1
MH_IDENTITY_DB_PORT=55432
MH_IDENTITY_DB_NAME=mh_identity_workspace_integration
MH_IDENTITY_DB_SSL_MODE=disable

These are future configuration design values only.

No .env file is changed by R16.

20. Failure and cleanup policy

Failure before container creation requires no infrastructure cleanup.

Failure after a future container is created must clean up only resources whose
exact identity was captured by that run.

Cleanup must not use broad commands such as:

docker system prune
docker volume prune
docker container prune

Broad deletion, unrelated volume removal, and global Docker cleanup are
prohibited.

21. Production boundary

This runbook is not a production runbook.

It does not define:

a production PostgreSQL provider;
a production host;
production credentials;
production TLS trust;
production backup;
production restore;
production RPO or RTO;
production monitoring;
production cutover.
PRODUCTION_AUTHORITY=NO
22. Current authorization matrix
WRITE_R16_RUNBOOK_CONTRACT=YES
START_DOCKER_ENGINE=NO
PULL_POSTGRES_IMAGE=NO
CREATE_CONTAINER=NO
CREATE_VOLUME=NO
CREATE_DATABASE=NO
CREATE_DATABASE_ROLE=NO
GENERATE_DATABASE_CREDENTIALS=NO
WRITE_SECRET_FILE=NO
CHANGE_ENV_FILE=NO
CONTACT_DATABASE=NO
RUN_PG_ISREADY=NO
RUN_PSQL=NO
RUN_PG_DUMP=NO
RUN_PG_RESTORE=NO
CREATE_REAL_POOL=NO
EXECUTE_SQL=NO
RUN_MIGRATIONS=NO
CHANGE_SERVER_JS=NO
BIND_RUNTIME=NO
GRANT_PRODUCTION_AUTHORITY=NO
23. Next sequence
R16 Backup, Recovery, and First-Contact Runbook Contract
→ R17 Offline Migration Executor Skeleton
→ Docker Engine and Immutable Image Preflight
→ Local Isolated Provisioning Authorization
→ Explicit First Database Contact Authorization

Every step requires separate evidence and authority.

## 24. R17A transaction-authority reconciliation

MIGRATION_SHA256=987dfea602dc9d5a6d392f5e635bd39b52973e4f0f2655de5752a11650313061
MIGRATION_TRANSACTION_MODEL=EXECUTOR_MANAGED_TRANSACTION
MIGRATION_ADVISORY_LOCK_NAMESPACE=mh-os.identity-workspace.migration-authority.v1
MIGRATION_ADVISORY_LOCK_KEY=9051548987079335361
MIGRATION_SQL_EMBEDDED_TRANSACTION_WRAPPER=NO
FIRST_CONTACT_COMMAND_DECLARED=NO
FIRST_DATABASE_CONTACT_AUTHORIZED=NO
DATABASE_CONTACT=NO
RUN_MIGRATIONS=NO

The future migration executor owns atomic migration execution.

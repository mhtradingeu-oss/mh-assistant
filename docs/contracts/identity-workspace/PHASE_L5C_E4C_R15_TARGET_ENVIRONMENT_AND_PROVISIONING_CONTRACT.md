# PHASE L5C E4C-R15 — PostgreSQL Target Environment and Provisioning Contract

## Status

**Accepted and frozen.**

This contract selects the only environment class eligible for a future first
PostgreSQL contact and freezes provisioning, credentials, isolation, TLS,
recovery, and ownership boundaries.

It does not provision infrastructure, create credentials, contact PostgreSQL,
execute SQL, run migrations, bind runtime, or grant production authority.

## 1. Environment separation

The following environments are separate evidence and authority domains:

1. local isolated integration;
2. CI isolated integration;
3. staging;
4. production.

Evidence from one environment must not be relabeled as certification for another.

No staging or production PostgreSQL target is selected in R15.

## 2. Selected first-contact environment class

```text
TARGET_ENVIRONMENT_ID=mhos-identity-workspace-local-integration-v1
TARGET_ENVIRONMENT_CLASS=LOCAL_ISOLATED_INTEGRATION
TARGET_ENVIRONMENT_DURABILITY=DISPOSABLE
TARGET_ENVIRONMENT_NETWORK_SCOPE=LOOPBACK_ONLY
TARGET_ENVIRONMENT_PRODUCTION=NO

The future target must:

run on the authorized operator's local workstation;
listen only on loopback;
expose no public or LAN PostgreSQL port;
contain no production, customer, Project, Workspace, or provider data;
use deterministic synthetic fixtures only;
be disposable and reproducible;
use dedicated database and role identities;
remain isolated from Odoo and all unrelated applications.
3. Hosting model
HOSTING_MODEL=LOCAL_CONTAINERIZED_POSTGRESQL
CONTAINER_RUNTIME_REQUIRED=YES
PUBLIC_NETWORK_EXPOSURE=NO
REMOTE_DATABASE=NO
SHARED_DATABASE=NO

R15 does not select an image tag, immutable digest, container name, port,
volume, or startup command.

Those values require the later first-contact runbook.

4. Provisioning owners
DATABASE_PROVISIONING_OWNER=AUTHORIZED_LOCAL_OPERATOR
DATABASE_ROLE_PROVISIONING_OWNER=AUTHORIZED_LOCAL_OPERATOR
APPLICATION_RUNTIME_PROVISIONING_OWNER=MH_OS_RUNTIME_OWNER
MIGRATION_EXECUTION_OWNER=POSTGRESQL_MIGRATION_AUTHORITY

The application server, route handlers, repository adapters, module imports,
health checks, and readiness checks must never provision databases or roles.

5. Reserved database and schema identity
DATABASE_NAME=mh_identity_workspace_integration
SCHEMA_NAME=identity_workspace_authority

These are reserved design values only.

No database or schema is created by this contract.

6. Role separation

Reserved migration role:

MIGRATION_ROLE=mh_identity_workspace_migrator

It may later receive only privileges required to create and maintain the
approved authority schema and migration history.

Reserved runtime reader:

RUNTIME_READ_ROLE=mh_identity_workspace_reader

It must be read-only and must not:

create or alter schemas or tables;
insert, update, or delete authority records;
execute migrations;
create users or roles;
grant privileges;
own schema objects.

No runtime writer role is approved:

RUNTIME_WRITE_ROLE=NOT_AUTHORIZED
7. Canonical runtime configuration
CANONICAL_RUNTIME_CONFIGURATION=SPLIT_MH_IDENTITY_DB_KEYS

The canonical configuration owner is:

runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-config.js

The approved runtime keys are:

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

The following are non-canonical and prohibited as compatibility fallbacks:

DATABASE_URL
PGHOST
PGPORT
PGDATABASE
PGUSER
PGPASSWORD
MH_IDENTITY_WORKSPACE_AUTHORITY_DATABASE_URL

MH_IDENTITY_WORKSPACE_AUTHORITY_DATABASE_URL is superseded documentation
vocabulary and has no runtime consumer.

8. Local integration configuration classification

Approved non-secret design values:

MH_IDENTITY_DB_HOST=127.0.0.1
MH_IDENTITY_DB_NAME=mh_identity_workspace_integration
MH_IDENTITY_DB_APPLICATION_NAME=mh-os-identity-workspace-integration

The exact port, usernames, password values, TLS mode, CA path, and pool limits
remain unselected pending the runbook.

9. Secret channel
SECRET_CHANNEL=OPERATOR_INJECTED_PROCESS_ENVIRONMENT
SECRET_PERSISTENCE=NOT_REQUIRED
SECRET_COMMITTED_TO_REPOSITORY=NO
SECRET_PRINTED_TO_TERMINAL_EVIDENCE=NO

Secrets must not be:

committed;
stored in tracked files;
copied into contracts;
included in evidence archives;
printed to terminal;
reused from production;
reused from unrelated applications;
exposed in process arguments where avoidable.

A temporary local secret file may be considered only in the later runbook with
restrictive permissions, non-repository location, exact ownership, and secure
cleanup.

10. Credential policy

Future credentials must be random, environment-specific, role-specific,
non-default, non-reused, and absent from logs and evidence.

DATABASE_CREDENTIALS_CREATED=NO

R15 creates no credentials.

11. TLS classification

Loopback-only local integration may later select exactly one of:

explicit local-only TLS disablement; or
certificate-verifying TLS using an approved local CA.

Silent downgrade is prohibited.

LOCAL_TLS_MODE=UNSELECTED_PENDING_RUNBOOK
REMOTE_TLS_MODE=VERIFY_FULL_REQUIRED

Remote, staging, and production environments require hostname-verifying TLS and
a separately approved trust source.

12. Network and port boundary

The future service must:

bind to 127.0.0.1 only;
use an explicitly selected non-conflicting port;
avoid public, LAN, tunnel, and router exposure;
expose no database endpoint to external hosts.

No firewall or networking configuration is changed in R15.

13. Data classification

The local target may contain only:

the approved empty schema;
migration history;
deterministic synthetic fixtures;
non-sensitive test identifiers.

It may not contain real users, memberships, grants, customer data, provider
credentials, WooCommerce data, operational Project data, or copies of data/.

14. Recovery classification

The initial target is disposable and contains no authorized user data.

BACKUP_CLASS=DISPOSABLE_INTEGRATION_RECREATE
RPO=ZERO_AUTHORIZED_USER_DATA
RTO=BOUNDED_RECREATE

Recovery is deterministic destruction and recreation from frozen inputs.

Before migration execution, evidence must record the image identity, database
identity, role names without secrets, migration state, migration checksum, and
proof that no user data exists.

This classification is invalid for staging or production.

15. Backup and restore owners
LOCAL_INTEGRATION_RECOVERY_OWNER=AUTHORIZED_LOCAL_OPERATOR
STAGING_BACKUP_OWNER=UNDECLARED
STAGING_RESTORE_OWNER=UNDECLARED
PRODUCTION_BACKUP_OWNER=UNDECLARED
PRODUCTION_RESTORE_OWNER=UNDECLARED

Staging and production first contact therefore remain blocked.

16. Future provisioning sequence

A later runbook must:

verify the exact repository baseline;
verify the local container runtime;
select an exact PostgreSQL image and immutable digest;
select a loopback-only non-conflicting port;
generate migration and reader secrets without printing them;
create an isolated local instance;
create the dedicated database;
create separate migration and reader roles;
apply least-privilege grants;
prove network isolation;
capture sanitized evidence;
stop before database contact unless separately authorized.

Provisioning does not authorize migration execution.

17. Provisioning prohibitions

The later provisioning operation must not:

target production, staging, VPS, Odoo, or a shared database;
reuse unrelated credentials;
modify MH-OS data/;
modify server.js;
register startup migrations;
bind adapters;
create application authority records;
expose PostgreSQL publicly;
execute migration SQL without separate authorization.
18. Sanitized environment declaration

Before first contact, a declaration must record:

environment ID and class;
loopback host and port;
PostgreSQL version;
image name and immutable digest;
database name;
migration and reader role names;
TLS classification;
CA-configured boolean;
recovery classification;
credential-present booleans only;
operator and timestamp;
no secret values.
19. First-contact boundary
FIRST_CONTACT_COMMAND_DECLARED=NO
FIRST_DATABASE_CONTACT_AUTHORIZED=NO

No command may be inferred from the existence of configuration, credentials,
container code, Pool code, or migration SQL.

20. Server and runtime boundary

runtime/orchestrator-service/server.js remains unchanged.

R15 does not authorize Pool construction, runtime initialization, repository
binding, startup migration, route wiring, signal ownership, health/readiness
binding, or positive permission activation.

21. Production target status
PRODUCTION_TARGET_ENVIRONMENT=UNDECLARED
PRODUCTION_DATABASE_HOST=UNDECLARED
PRODUCTION_DATABASE_PROVIDER=UNDECLARED
PRODUCTION_SECRET_CHANNEL=UNDECLARED
PRODUCTION_BACKUP_OWNER=UNDECLARED
PRODUCTION_RPO=UNDECLARED
PRODUCTION_RTO=UNDECLARED
PRODUCTION_AUTHORITY=NO

Local integration evidence must never be presented as production evidence.

22. Authorization matrix
WRITE_TARGET_ENVIRONMENT_CONTRACT=YES
SELECT_LOCAL_INTEGRATION_ENVIRONMENT_CLASS=YES
SELECT_PRODUCTION_ENVIRONMENT=NO
INSTALL_DEPENDENCY=NO
CREATE_CONTAINER=NO
CREATE_DATABASE=NO
CREATE_DATABASE_ROLE=NO
GENERATE_DATABASE_CREDENTIALS=NO
WRITE_SECRET_FILE=NO
CHANGE_ENV_FILE=NO
CONTACT_DATABASE=NO
CREATE_REAL_POOL=NO
EXECUTE_SQL=NO
RUN_MIGRATIONS=NO
CHANGE_SERVER_JS=NO
BIND_RUNTIME=NO
GRANT_PRODUCTION_AUTHORITY=NO
23. Next sequence
R15 Target Environment and Provisioning Contract
→ R16 Backup, Recovery, and First-Contact Runbook Contract
→ R17 Offline Migration Executor Skeleton
→ Provision Local Isolated Integration Environment
→ Explicit First Database Contact Authorization

Every phase requires separate evidence and authorization.

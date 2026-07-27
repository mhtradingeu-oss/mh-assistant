# PHASE L5C E4C-R7 — Database Configuration and Read Adapter Contract

## 1. Status

Status: Contract frozen.

This record defines the approved future implementation boundary for PostgreSQL
configuration and the Identity / Workspace Membership read adapter.

This contract does not implement a database adapter, create credentials, contact
a database, execute SQL, apply migrations, bind PostgreSQL to server startup, or
grant production authority.

## 2. Certified Current Truth

At certified repository HEAD:

- `pg@8.22.0` is an exact direct dependency of `runtime/orchestrator-service`.
- no runtime source imports `pg`;
- no `Pool` or `Client` instance exists;
- no database environment authority exists;
- no server startup database binding exists;
- no migration runner exists;
- one static migration blueprint exists;
- the migration has not been executed;
- PostgreSQL is not production authority.

## 3. Authority Boundaries

The backend remains the sole authority layer.

The future PostgreSQL adapter is a backend persistence adapter only. It must not
become:

- a second authentication authority;
- a second permission policy engine;
- a frontend authority;
- an automatic Workspace creator;
- an automatic Principal creator;
- an automatic migration executor;
- an implicit fallback owner;
- a source of privilege inferred from missing data.

The frontend may consume projections but may not select credentials, connection
mode, query scope, authority source, or fallback behavior.

## 4. Configuration Owner

The future canonical configuration owner shall be:

`runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-config.js`

No other module may independently parse PostgreSQL environment variables.

The configuration owner must:

- accept an explicit environment object for deterministic tests;
- return an immutable configuration object;
- validate all values before adapter construction;
- redact credentials from errors and logs;
- perform no network operation;
- import no runtime server module;
- create no `Pool` or `Client`;
- perform no filesystem mutation.

## 5. Environment Variable Contract

The approved runtime-read environment variables are:

- `MH_IDENTITY_DB_ENABLED`
- `MH_IDENTITY_DB_HOST`
- `MH_IDENTITY_DB_PORT`
- `MH_IDENTITY_DB_NAME`
- `MH_IDENTITY_DB_USER`
- `MH_IDENTITY_DB_PASSWORD`
- `MH_IDENTITY_DB_SSL_MODE`
- `MH_IDENTITY_DB_SSL_CA_FILE`
- `MH_IDENTITY_DB_POOL_MAX`
- `MH_IDENTITY_DB_IDLE_TIMEOUT_MS`
- `MH_IDENTITY_DB_CONNECT_TIMEOUT_MS`
- `MH_IDENTITY_DB_STATEMENT_TIMEOUT_MS`
- `MH_IDENTITY_DB_APPLICATION_NAME`

No generic `DATABASE_URL` is canonical for this authority.

Generic PostgreSQL variables such as `PGHOST`, `PGUSER`, `PGPASSWORD`, and
`PGDATABASE` must not silently override the namespaced contract.

## 6. Enablement Contract

Default behavior is disabled.

When `MH_IDENTITY_DB_ENABLED` is absent, empty, false, `0`, or unknown:

- configuration state is `DISABLED`;
- no credential fields are required;
- no adapter is constructed;
- no network attempt is allowed;
- no server startup failure is caused;
- legacy authority behavior remains unchanged.

When explicitly enabled:

- all required values must pass validation;
- malformed or incomplete configuration fails closed;
- no fallback to partial generic environment variables is allowed;
- adapter construction still must not contact the database.

## 7. Required Runtime Read Credentials

The runtime read adapter must use a dedicated least-privilege database identity.

The runtime read identity must not:

- create or alter schemas;
- create or alter tables;
- insert, update, or delete authority records;
- execute migrations;
- grant roles;
- create users;
- bypass row or scope restrictions;
- own schema objects.

Migration credentials and runtime-read credentials must be separate.

Credential values must never be committed to Git, printed, serialized into
evidence, returned in APIs, or exposed to the frontend.

## 8. Validation Contract

Validation must be deterministic and fail closed.

Required when enabled:

- host: non-empty hostname or approved local address;
- port: integer from 1 through 65535;
- database name: non-empty;
- user: non-empty;
- password: non-empty secret value;
- SSL mode: one approved enum;
- pool maximum: positive bounded integer;
- timeout values: positive bounded integers;
- application name: fixed safe identifier.

Unknown configuration keys must not broaden behavior.

Invalid values must return structured errors with stable codes and redacted
metadata.

## 9. SSL Contract

Approved SSL modes:

- `disable`
- `require`
- `verify-ca`
- `verify-full`

Production must not use `disable`.

`verify-ca` and `verify-full` require a valid CA source.

The adapter must never silently change from certificate verification to
`rejectUnauthorized: false`.

TLS construction must be isolated from Pool construction and independently
testable.

## 10. Pool Contract

The future Pool owner shall be:

`runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-pool.js`

The Pool owner must:

- create at most one Pool per configured runtime authority instance;
- create no Pool at module import time;
- connect only through an explicit lifecycle action;
- expose deterministic close behavior;
- enforce connection timeout;
- enforce statement timeout;
- apply the configured application name;
- never log connection strings or passwords;
- support dependency injection for tests.

The Pool must not be created by frontend routes, request payloads, or arbitrary
callers.

## 11. Startup Contract

Server startup remains database-independent by default.

Importing `server.js` or any PostgreSQL module must not contact a database.

A future startup binding requires a separate approved phase.

No migration may run automatically during:

- process startup;
- module import;
- server listen;
- health checks;
- readiness checks;
- adapter construction;
- route registration.

## 12. Read Adapter Owner

The future canonical read adapter shall be:

`runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-membership-read-adapter.js`

The adapter must be read-only and expose only explicit methods such as:

- `getPrincipalById`
- `getOrganizationById`
- `getWorkspaceById`
- `getProjectById`
- `listWorkspaceMembershipsForPrincipal`
- `listProjectMembershipsForPrincipal`
- `listScopedPermissionGrants`

Exact method names may be finalized during implementation review, but the
adapter may not expose generic unrestricted query execution.

## 13. Query Contract

All queries must:

- use parameterized values;
- use fixed SQL owned by the adapter;
- select explicit columns;
- use deterministic ordering where collections are returned;
- enforce bounded result size;
- apply exact Principal, Workspace, Project, and scope filters;
- treat unknown authority state as deny or not-found;
- perform no writes;
- perform no schema changes;
- perform no dynamic identifier interpolation from caller input.

No method may accept raw SQL from callers.

## 14. Result Contract

Adapter results must:

- preserve canonical IDs;
- preserve source provenance;
- distinguish not-found from disabled and unavailable;
- avoid returning database-internal secrets;
- use immutable result objects;
- avoid silently inventing Principal, Membership, Role, or Grant records;
- never widen permissions due to missing or malformed rows.

## 15. Error Contract

Required stable error categories include:

- `DATABASE_AUTHORITY_DISABLED`
- `DATABASE_CONFIGURATION_INVALID`
- `DATABASE_CONNECTION_UNAVAILABLE`
- `DATABASE_QUERY_TIMEOUT`
- `DATABASE_QUERY_FAILED`
- `DATABASE_RESULT_INVALID`
- `DATABASE_AUTHORITY_NOT_READY`

Errors must not include:

- passwords;
- connection strings;
- raw credential objects;
- full certificates;
- unrestricted SQL text;
- sensitive row values.

## 16. Health and Readiness Contract

Liveness must not depend on PostgreSQL.

When PostgreSQL authority is disabled:

- service liveness may remain healthy;
- PostgreSQL authority status is `DISABLED`;
- production authority remains false.

When enabled but unavailable:

- liveness may remain healthy;
- authority readiness is false;
- no allow decision may be produced from unavailable authority;
- fallback behavior must follow a separately approved authority-selection
  contract.

A health endpoint must not open a new connection per request without a bounded,
approved probe policy.

## 17. Migration Boundary

The existing migration blueprint remains:

`runtime/orchestrator-service/migrations/identity-workspace-authority/0001_initial_authority_schema.sql`

Migration execution is not part of the read adapter.

The future migration runner must be separately designed and must include:

- dedicated migration credentials;
- immutable migration IDs;
- immutable checksums;
- advisory locking;
- transaction boundaries;
- already-applied detection;
- checksum mismatch refusal;
- explicit command invocation;
- no automatic startup execution.

## 18. Legacy Compatibility Boundary

The current runtime authority remains unchanged until a future shadow and
reconciliation phase.

PostgreSQL must not immediately replace:

- current service-principal resolution;
- current backend permission grants;
- existing Workspace and Project projections;
- legacy filesystem-backed sources;
- current governance preparation behavior.

Future adoption must be additive, feature-flagged, observable, and reversible.

## 19. Logging and Evidence

Allowed logs may include:

- configuration enabled or disabled;
- redacted host classification;
- database name classification where non-sensitive;
- pool state;
- timeout category;
- stable error code;
- query operation identifier;
- duration;
- result count where safe.

Logs must not include secrets, connection strings, complete SQL with values, or
sensitive authority records.

## 20. Implementation Scope for the Next Phase

A separately approved implementation phase may add only:

- PostgreSQL configuration parser;
- configuration validation;
- SSL option builder;
- Pool option builder;
- read-adapter interface skeleton;
- unit tests and static verifiers.

That implementation phase must still preserve:

- `DATABASE_CONTACTED=NO`;
- `SQL_EXECUTED=NO`;
- `MIGRATION_EXECUTED=NO`;
- `RUNTIME_BINDING_CHANGED=NO`;
- `PRODUCTION_AUTHORITY=NO`.

## 21. Explicitly Deferred

Deferred to later phases:

- real database credentials;
- database creation;
- PostgreSQL server selection;
- migration runner implementation;
- migration execution;
- real Pool connection;
- live query execution;
- startup integration;
- route integration;
- dual-read comparison;
- read-authority cutover;
- write authority;
- production certification.

## 22. Security Debt Boundary

Admission of `pg@8.22.0` introduced no new known vulnerabilities.

Existing dependency vulnerabilities remain separate production security debt
and must be remediated before production certification.

This contract does not waive, hide, or downgrade that debt.

## 23. Final Contract Decision

```text
PG_DEPENDENCY_ADMITTED=YES
PG_RUNTIME_IMPLEMENTED=NO
DATABASE_CONFIGURATION_AUTHORITY_IMPLEMENTED=NO
MIGRATION_RUNNER_IMPLEMENTED=NO
DATABASE_CONTACTED=NO
SQL_EXECUTED=NO
MIGRATION_EXECUTED=NO
RUNTIME_BINDING_CHANGED=NO
PRODUCTION_AUTHORITY=NO
R7_CONTRACT_FROZEN=YES
NEXT_PHASE=R8_CONFIGURATION_AND_ADAPTER_SKELETON_IMPLEMENTATION

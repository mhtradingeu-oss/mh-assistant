# PHASE L5C E4C-R8 — Configuration and Read Adapter Skeleton Implementation

## Status

Semantic correction completed. Candidate remains uncommitted and awaits final
closeout review.

## Implemented scope

- Namespaced PostgreSQL configuration parsing.
- Deterministic fail-closed validation.
- Immutable configuration results.
- Credential redaction.
- PostgreSQL SSL policy description.
- PostgreSQL Pool configuration description.
- Non-executing membership read-adapter skeleton.
- Offline verifier.

## Semantic boundaries

### SSL policy descriptor

`postgresql-ssl-options.js` does not produce runtime `pg` SSL options.

It produces an immutable policy descriptor containing:

- selected SSL mode;
- whether TLS is enabled;
- required certificate-verification level;
- optional CA-file reference;
- `runtimeMaterialized: false`.

The CA-file value remains a reference only. This phase does not read the file or
materialize certificate data.

### Pool configuration descriptor

`postgresql-pool-options.js` does not produce runtime `pg.Pool` options and does
not create a Pool.

It produces an immutable configuration descriptor containing:

- connection configuration;
- pool limits;
- an SSL policy descriptor;
- `runtimePoolOptions: false`;
- `runtimeMaterialized: false`.

The descriptor uses `sslPolicy`, not the runtime `ssl` property.

## Explicitly not implemented

- No `pg` import.
- No Pool or Client construction.
- No database connection.
- No SQL execution.
- No migration execution.
- No CA-file reading.
- No runtime certificate materialization.
- No `server.js` modification.
- No route or startup binding.
- No replacement of legacy authority.
- No production authority.

## Adapter states

The read adapter exposes only:

- `DISABLED`
- `SKELETON_ONLY`

All operations return either:

- `DATABASE_AUTHORITY_DISABLED`
- `DATABASE_AUTHORITY_NOT_READY`

No positive authority result is possible in this phase.

## Final markers

```text
POSTGRESQL_CONFIGURATION_AND_READ_ADAPTER_SKELETON=PASS
SSL_POLICY_DESCRIPTOR_CONSTRUCTION=PASS
POOL_CONFIGURATION_DESCRIPTOR_CONSTRUCTION=PASS
RUNTIME_SSL_OPTIONS_CREATED=NO
RUNTIME_POOL_OPTIONS_CREATED=NO
DATABASE_CONTACTED=NO
SQL_EXECUTED=NO
MIGRATION_EXECUTED=NO
POOL_CREATED=NO
CLIENT_CREATED=NO
SERVER_JS_CHANGED=NO
RUNTIME_BINDING_CHANGED=NO
PRODUCTION_AUTHORITY=NO
Next phase

Perform final exact-scope review and closeout before any commit or push.

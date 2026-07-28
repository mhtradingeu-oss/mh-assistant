# PostgreSQL Membership Authority Persistence Contract v1

## Status

**Accepted — architecture and implementation-boundary contract**

- Contract ID: `postgresql-membership-authority-persistence/v1`
- Baseline commit: `08c0e9e75c461664944c841d5135c13859d35e2d`
- Logical owner: `IDENTITY_WORKSPACE_AUTHORITY_DOMAIN`
- Physical persistence owner: `DEDICATED_IDENTITY_WORKSPACE_AUTHORITY_DATABASE`
- Database engine: `POSTGRESQL`
- Runtime package: `runtime/orchestrator-service/package.json`
- Package manager: `NPM`
- Driver selection: `pg`
- Schema namespace: `identity_workspace_authority`
- Binding model: `BACKEND_ONLY_REPOSITORY_ADAPTER`

This contract admits the PostgreSQL persistence architecture into the
repository. It does not install, provision, execute, connect, bind, or activate
the design.

## Source-of-truth decision

No existing canonical Workspace or Project membership persistence was proven
in tracked production scope.

Frontend state, audit evidence, Project operation JSON, browser storage,
business handlers, and the effective-permission resolver are not authority
persistence owners.

The selected production persistence class is a transactional relational
database, implemented using PostgreSQL.

## Physical schema

The design contains four authority tables:

1. `identity_workspace_authority.workspaces`
2. `identity_workspace_authority.workspace_memberships`
3. `identity_workspace_authority.project_memberships`
4. `identity_workspace_authority.membership_grants`

It contains two support tables:

1. `identity_workspace_authority.project_workspace_bindings`
2. `identity_workspace_authority.schema_migrations`

Total physical tables: `6`.

The Project/Workspace binding table is a relational enforcement mirror. It does
not replace the existing Project Identity capability and does not create a
parallel Project identity engine.

## Data and authority invariants

- Every authority record requires canonical source provenance.
- Workspace and Project scope bindings must match.
- Membership identifiers, principals, scope identifiers, source names, source
  references, and source versions must be non-empty.
- Only canonical records are admissible.
- Lifecycle states are `ACTIVE`, `INACTIVE`, `SUSPENDED`, `REVOKED`, and
  `UNRESOLVED`.
- Missing, inactive, suspended, revoked, unresolved, ambiguous, or
  non-canonical evidence remains fail-closed.
- Explicit `DENY` takes precedence over `ALLOW`.
- Grant principal and scope must match the referenced membership.
- Mutations require transactions and optimistic version checks.
- Hard deletion is not the normal lifecycle mechanism.

## Repository adapter boundary

The future adapter is CommonJS and exposes exactly:

1. `resolveWorkspaceIdentity`
2. `resolveWorkspaceMembership`
3. `resolveProjectMembership`
4. `listMembershipGrants`

Required controls:

- Parameterized queries only.
- Fully schema-qualified tables.
- No dynamic identifier interpolation.
- Backend-only database access.
- No frontend database access.
- No direct business-handler authority queries.
- No automatic schema creation.
- No automatic migration.
- No automatic seed.
- No connection during module import.
- Database failures map to fail-closed source-unavailable outcomes.

## Configuration boundary

The dedicated configuration key is:

`MH_IDENTITY_WORKSPACE_AUTHORITY_DATABASE_URL`

A generic `DATABASE_URL` fallback is prohibited unless separately reviewed and
admitted.

Credentials and complete database URLs may not be committed to the repository.
Production transport encryption may not silently downgrade.

## Migration boundary

- Migration ID: `0001_initial_authority_schema`
- Blueprint SHA-256:
  `336470771832fd7f8c53248fc35a7e5c901b253d530a065ac5d042025f687011`
- Applied migration checksums are immutable.
- Migration execution requires an advisory lock and transaction.
- Runtime startup does not automatically migrate.
- No seed records are part of the initial schema.
- Routine destructive down migrations are prohibited.
- Production rollback requires a forward repair or verified backup restore.

## Future repository targets

Existing files that may be modified only after a separate implementation
admission:

- `runtime/orchestrator-service/package.json`
- `runtime/orchestrator-service/package-lock.json`

New files that may be admitted only by subsequent scoped phases:

- `runtime/orchestrator-service/migrations/identity-workspace-authority/0001_initial_authority_schema.sql`
- `runtime/orchestrator-service/scripts/identity-workspace-authority-migrate.js`
- `runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-membership-authority-repository.js`
- `runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-membership-authority-config.js`
- `scripts/verification/verify-postgresql-membership-authority-contract.js`
- `scripts/verification/fixtures/postgresql-membership-authority-contract-v1.json`

## Verification program

The verification design has four layers:

1. Static SQL contract verification.
2. Offline adapter contract verification.
3. Isolated PostgreSQL integration verification.
4. Runtime shadow-binding verification.

Only design authority exists now. Isolated PostgreSQL execution, network use,
runtime binding, and production-positive activation require later explicit
admission.

## Current authorization

Authorized by this phase:

- Admission of this contract document.
- Admission of the E4C-R3 governance record.
- Selection of the next implementation batch.
- Future resolution of a compatible `pg` dependency version.
- Future admission of the static SQL blueprint and offline verifier, subject to
  a separate phase.

Not authorized:

- Installing `pg`.
- Modifying `package.json` or `package-lock.json`.
- Creating a PostgreSQL database or role.
- Creating or storing database credentials.
- Executing the migration.
- Creating authority records.
- Implementing the repository adapter.
- Implementing a membership write service.
- Binding the adapter into runtime.
- Changing routes or business handlers.
- Enabling a positive permission outcome.
- Granting production authority.

## Evidence hashes

- Path selection: `ab719aab3681b4b144984aa08c930dd52c67d6bdc730512432759b21db77f581`
- Persistence contract: `b1e2de00e7678bcfca906544d9f5a6ee0b49a7179eadceb9290248065b5824f0`
- Migration blueprint: `987dfea602dc9d5a6d392f5e635bd39b52973e4f0f2655de5752a11650313061`
- Migration contract: `e34692a7b427c66846e38e18bd2c082f16ce6b65a8285029163b47b33d671f97`
- Adapter contract: `e3e012aa4c8fa7e34b2bfc3db95c6975a26ee3ac1120fcbd7aff5c549077b46a`
- Environment contract: `8a2cb5f6c65ec6dde73f871f7e7439b48e131b83ca7da1d473743ddddf83b269`
- Verification contract: `1bc69d7a9a76a088ab58ac5677f898ed9ccd510d90b5e082396d3e2cd655b5e5`
- Design decision: `04267b148328eb1c9712194e502421df0d019e4aad2436872e9437c534677aac`

## R17A blueprint supersession

ORIGINAL_BLUEPRINT_SHA256=336470771832fd7f8c53248fc35a7e5c901b253d530a065ac5d042025f687011
CURRENT_CANONICAL_BLUEPRINT_SHA256=4dd610ae30888a95dfa3260bb0021d8bdf61a2eb000d4ce57f67d34667b00f35
SUPERSEDED_BY=PHASE_L5C_E4C_R17A
TRANSACTION_MODEL_PREVIOUS=SELF_TRANSACTIONAL_SQL
TRANSACTION_MODEL_CURRENT=EXECUTOR_MANAGED_TRANSACTION
DDL_SEMANTICS_CHANGED=NO
TRANSACTION_WRAPPERS_REMOVED=YES

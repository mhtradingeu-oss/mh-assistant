# PHASE L5C E4C-R3 — PostgreSQL Contract Repository Admission

## Status

**Accepted**

Baseline commit before admission:

`08c0e9e75c461664944c841d5135c13859d35e2d`

## Admitted repository documents

1. `docs/contracts/identity-workspace/POSTGRESQL_MEMBERSHIP_AUTHORITY_PERSISTENCE_V1.md`
2. `docs/contracts/verification-governance/PHASE_L5C_E4C_R3_POSTGRESQL_CONTRACT_REPOSITORY_ADMISSION.md`

No implementation file, package manifest, lockfile, migration, adapter,
configuration module, fixture, or verifier is admitted by this phase.

## Accepted architecture

- Logical authority owner:
  `IDENTITY_WORKSPACE_AUTHORITY_DOMAIN`
- Physical persistence owner:
  `DEDICATED_IDENTITY_WORKSPACE_AUTHORITY_DATABASE`
- Database engine: `POSTGRESQL`
- Driver selection: `pg`
- Runtime package:
  `runtime/orchestrator-service/package.json`
- Package manager: `NPM`
- Schema namespace:
  `identity_workspace_authority`
- Binding model:
  `BACKEND_ONLY_REPOSITORY_ADAPTER`

## Scope decision

The next implementation batch is limited to repository admission and static
validation of:

- The initial SQL migration blueprint.
- Its offline contract fixture.
- Its static read-only verifier.
- The matching verification-governance admission record.

The next batch may not:

- Install `pg`.
- Modify the package manifest or lockfile.
- Contact or start PostgreSQL.
- Provision a database or credential.
- Execute the migration.
- Implement the repository adapter.
- Bind runtime.
- Activate a positive permission outcome.

## Next action

`PHASE_L5C_E4C_R4_POSTGRESQL_STATIC_CONTRACT_AND_MIGRATION_BLUEPRINT_REPOSITORY_ADMISSION`

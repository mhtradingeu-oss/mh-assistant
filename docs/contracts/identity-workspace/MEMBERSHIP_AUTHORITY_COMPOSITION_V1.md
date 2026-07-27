# Membership Authority Composition Contract v1

## Status

- Contract ID: `membership-authority-composition/v1`
- Operating mode: `SHADOW_ONLY_FAIL_CLOSED`
- Positive authorization capability: **NO**
- Production implementation authorized: **NO**
- Production authority granted: **NO**

## Purpose

This contract defines a future read-only composition boundary for workspace
and project membership evidence. It does not implement a composer, data store,
route binding, or production authorization path.

## Existing capabilities that must be reused

- Existing identity adapter for authenticated principal evidence.
- Existing route-permission catalog for route classification.
- Existing project-identity capability.
- Existing effective-permission resolver.
- Existing shadow control, observer, and adapter chain.

No parallel identity owner, route catalog, project-identity engine, shadow
engine, or permission resolver may be created.

## Current authority truth

No authoritative workspace-membership or project-membership source was proven
inside the tracked production source and schema scope examined by E3T.

Workspace identity, membership, project membership, and grant evidence remain
unavailable or unresolved. A new membership data store is not authorized.

## Input rules

A future composition boundary may consume only:

1. Existing authenticated principal.
2. Existing route classification.
3. Validated project slug.
4. Existing project identity.
5. Separately proven workspace identity.
6. Separately proven workspace membership.
7. Separately proven project membership.

Membership may not be inferred from possession of a control key or from
project identity.

## Fail-closed rules

Missing, inactive, revoked, mismatched, or non-canonical authority evidence
must remain denied or insufficient context.

No condition may produce `ALLOW` or `REQUIRES_APPROVAL`.

## Output rules

Any future composition output must remain:

- Request-local.
- Copy-safe.
- JSON-serializable.
- Non-blocking.
- Free of secrets and functions.
- Eligible only for shadow evaluation.

It may not overwrite the existing principal or inject authority into the
business handler.

## Explicit non-goals

This contract does not authorize:

- Human login.
- Membership mutation APIs or UI.
- A new identity, workspace, project, or membership store.
- Runtime, route, handler, or resolver changes.
- Data migration.
- Production enforcement.

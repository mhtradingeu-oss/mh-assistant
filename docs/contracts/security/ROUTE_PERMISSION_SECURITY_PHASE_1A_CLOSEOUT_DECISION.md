# Route, Permission, and Security Phase 1A Closeout Decision

Status: Phase 1A documentation closeout decision

## Purpose and decision status

This decision closes Phase 1A-7 documentation by preserving federated backend enforcement and separating it from route catalogs, classifications, frontend visibility, and proof metadata. It creates no universal RBAC authority. The [universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md) controls precedence.

## Evidence baseline

- Baseline: `main` at `baf62a747f5defa51fa1376eb63272cd965a15b3`.
- Controlling evidence: `.mh-audit/phase-1a-efficient-closeout/20260720T101815Z/CODEX_RECONCILIATION.md`.
- Supporting records: [source inventory](ROUTE_PERMISSION_SECURITY_SOURCE_INVENTORY.md), [producer-consumer map](ROUTE_PERMISSION_SECURITY_CONSUMER_PRODUCER_MAP.md), [access scope matrix](ROUTE_ACCESS_SCOPE_MATRIX.md), [conflict register](ROUTE_PERMISSION_SECURITY_CONFLICT_REGISTER.md), and [vocabulary freeze](ROUTE_PERMISSION_SECURITY_VOCABULARY_FREEZE_RECOMMENDATION.md).

## Current authoritative owner and mutation owner

Installed backend middleware, handler-local security checks, governance gates, provider gates, Project guards, and protected handlers own enforcement at their exact call sites. The protected domain handler owns the business mutation after all required gates pass. Route catalogs, role matrices, frontend routing, classifiers, documentation, and shared-key UI state do not own authorization or mutation.

## Producers, consumers, and read-only projections

Producers include installed middleware, backend security/governance/provider/project guards, route composition, and denial/audit writers. Consumers are backend handlers, frontend error handling, operator diagnostics, and security reviews. Route catalogs, access matrices, authority projections, page visibility, role labels, classifiers, and reports are read-only projections.

## Scope and compatibility

- **Project scope:** slug validation and path containment provide meaningful Project isolation, but they do not prove authenticated Project membership.
- **Workspace scope:** Workspace lifecycle and Project relationships exist; authenticated Workspace membership, ownership, and effective permission resolution do not.
- **Compatibility behavior:** public route aliases, shared control keys, route-role fallbacks, proof flags, and legacy denial shapes remain explicit compatibility layers. Compatibility must never widen an installed backend grant.

## Current verified capabilities

Backend route classification, selected installed enforcement, Project path guards, provider execution gates, governance gates, and protected handler boundaries exist. Their coverage and semantics are route-specific.

## Explicit non-capabilities and unresolved contradictions

- No authenticated human/service principal service, membership authority, universal RBAC/ABAC model, or effective permission resolver is proven.
- Cataloged or classified routes may not equal installed enforcement coverage.
- Frontend visibility is not permission; a shared key is not membership; proof presence is not durable approval validity.
- Denial status, audit, freshness, revocation, and coverage remain fragmented.

## Deferred implementation gaps and proposed future owner

A future security authorization service may be proposed only after authenticated principal and membership contracts exist. Installed middleware and domain guards remain current owners until explicit adoption. Deferred work includes principal resolution, Workspace/Project membership, effective permissions, resource/action semantics, complete route coverage, consistent denials, revocation, and audit correlation.

## Adoption gate and validation requirements

Adoption requires an exhaustive current route and call-site inventory, principal/membership proof, deny-by-default policy, exact Project/Workspace scope tests, alias parity checks, bypass and hostile-input testing, approval/provider gate composition, audit correlation, shadow evaluation, migration and rollback plans, and proof that frontend metadata never grants access.

## Non-production-certification statement

This documentation closeout is not universal authorization coverage, adversarial security certification, authenticated membership proof, or production-readiness approval.

## Phase 1A closeout verdict

`PHASE_1A_7_DOCUMENTATION_CLOSED=YES` — installed federated enforcement is documented; universal identity and RBAC remain deferred.

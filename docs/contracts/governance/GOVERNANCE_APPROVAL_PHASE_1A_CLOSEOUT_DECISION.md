# Governance and Approval Phase 1A Closeout Decision

Status: Phase 1A documentation closeout decision

## Purpose and decision status

This decision closes Phase 1A-6 documentation by fixing the boundary between durable governance/approval records, installed mutation gates, proof flags, and frontend projections. It does not expand approval coverage or create identity authority. The [universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md) controls precedence.

## Evidence baseline

- Baseline: `main` at `baf62a747f5defa51fa1376eb63272cd965a15b3`.
- Controlling evidence: `.mh-audit/phase-1a-efficient-closeout/20260720T101815Z/CODEX_RECONCILIATION.md`.
- Supporting records: [source inventory](GOVERNANCE_SOURCE_INVENTORY.md), [producer-consumer map](GOVERNANCE_CONSUMER_PRODUCER_MAP.md), [approval matrix](GOVERNANCE_APPROVAL_MATRIX.md), [conflict register](GOVERNANCE_CONFLICT_REGISTER.md), and [vocabulary freeze](GOVERNANCE_VOCABULARY_FREEZE_RECOMMENDATION.md).

## Current authoritative owner and mutation owner

The Operations Backbone owns durable project governance policies and approval records. Backend approval decision functions own approval state mutations. The governance mutation gate owns enforcement only at its installed call sites; the underlying domain handler remains owner of the protected mutation. Route proof flags, UI actions, classifiers, and documentation do not approve or execute mutations.

## Producers, consumers, and read-only projections

Producers include policy/approval functions, installed mutation gates, protected domain handlers, and event/audit writers. Consumers include publishing, team/source mutations, workflows, Governance and Operations surfaces, and route handlers. Governance pages, approval lists, readiness panels, classifiers, and proof displays are read-only projections unless they invoke an installed backend decision endpoint.

## Scope and compatibility

- **Project scope:** current governance files, approval subjects, and covered mutations are Project-scoped.
- **Workspace scope:** Workspace lifecycle exists, but authenticated Workspace ownership, membership, and approver authority are not proven.
- **Compatibility behavior:** protected-route proof flags, legacy route aliases, default policy merges, and UI review flows remain compatibility inputs. A boolean/manual proof is not equivalent to validation of a durable approval for the same action.

## Current verified capabilities

Durable policy and approval records and installed governance mutation gates exist for covered paths. The system can record and project governance decisions. Coverage is boundary-specific and must not be generalized to every route or mutation.

## Explicit non-capabilities and unresolved contradictions

- No authenticated approver attribution, universal approval subject/action schema, Workspace membership resolver, or effective permission resolver is proven.
- Freshness, expiry, revocation, single-use consumption, replay prevention, execution linkage, and universal audit semantics are incomplete.
- Approval requested, approved, proof present, gate passed, mutation performed, and result audited are distinct states.
- Displaying or reading an approval neither authorizes another action nor performs the approved mutation.

## Deferred implementation gaps and proposed future owner

A future governance contract layer may normalize decision envelopes and evidence while the Operations Backbone retains records and installed gates retain enforcement. Identity and membership must be supplied by a separately approved security authority. Deferred work includes authenticated attribution, resource/action binding, expiry/revocation/consumption, replay protection, execution correlation, denial semantics, and comprehensive audit coverage.

## Adoption gate and validation requirements

Adoption requires a current route/mutation inventory, authenticated principal and membership design, exact subject/action/resource binding, coverage and bypass tests, stale/revoked/replayed approval tests, fail-closed behavior, audit correlation, compatibility migration, rollback, and proof that governance cannot mutate the protected domain directly.

## Non-production-certification statement

This closeout is not universal approval coverage, authenticated authorization proof, bypass resistance certification, or production-readiness approval.

## Phase 1A closeout verdict

`PHASE_1A_6_DOCUMENTATION_CLOSED=YES` — current durable records and installed gates are documented; universal approval semantics remain deferred.

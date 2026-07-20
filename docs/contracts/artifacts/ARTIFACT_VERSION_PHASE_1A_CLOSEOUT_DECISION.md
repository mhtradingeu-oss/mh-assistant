# Artifact and Version Phase 1A Closeout Decision

Status: Phase 1A documentation closeout decision

## Purpose and decision status

This decision closes Phase 1A-4 documentation without inventing a universal Artifact or Version runtime. Domain record writers, storage resolvers, media output storage, and the Operations Backbone retain authority. The [universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md) controls precedence.

## Evidence baseline

- Baseline: `main` at `baf62a747f5defa51fa1376eb63272cd965a15b3`.
- Controlling evidence: `.mh-audit/phase-1a-efficient-closeout/20260720T101815Z/CODEX_RECONCILIATION.md`.
- Supporting records: [source inventory](ARTIFACT_SOURCE_INVENTORY.md), [producer-consumer map](ARTIFACT_CONSUMER_PRODUCER_MAP.md), [ID/version/revision matrix](ARTIFACT_ID_VERSION_REVISION_MATRIX.md), [conflict register](ARTIFACT_CONFLICT_REGISTER.md), and [vocabulary freeze](ARTIFACT_VERSION_VOCABULARY_FREEZE_RECOMMENDATION.md).

## Current owners and mutation boundary

| Concern | Current authoritative owner | Current mutation owner |
| --- | --- | --- |
| Operations and AI records | Operations Backbone | Its domain create/update functions |
| Execution artifacts | Execution artifact writer and owning execution handler | The explicit writer invoked by that handler |
| Media outputs | Media output storage and producing media handler | Its explicit output writer |
| Project assets | Project asset registry and Project data owners | Explicit upload, ensure, classify, archive, or delete paths |
| Domain records | Campaign, content, publishing, integration, and other domain stores | Each concrete domain writer |

Storage locators, filenames, result envelopes, Library coalescing, backups, and projections do not become artifact identity or mutation authorities.

## Producers, consumers, and read-only projections

Producers are the domain writers and output handlers above. Consumers include Library, AI, Content, Media, Operations, workflow, publishing, and reporting surfaces. Frontend views, coalesced Library entries, catalogs, audit reports, and read APIs are projections. At `baf62a7`, `listProjectAssets` has a side-effect-free code shape that uses baseline paths and returns a projection without rewriting `assets-registry.json`; static verifier coverage was added, but the verifier was not run in this documentation task.

## Scope and compatibility

- **Project scope:** current assets and most durable artifact records are Project- or domain-scoped.
- **Workspace scope:** a shared Workspace asset store, identity, grant, or version head is not canonical.
- **Compatibility behavior:** canonical/legacy path resolution, dual-write adapters, coalesced read projections, disabled aliases, and backups remain explicitly named compatibility mechanisms. None establishes a new record owner.

## Current verified capabilities

The repository has durable domain records, IDs, output storage, canonical/legacy resolution, and selected version-like or status fields. Explicit mutation paths exist. The narrow asset list boundary is statically side-effect-free at the baseline noted above.

## Explicit non-capabilities and unresolved contradictions

- No universal Artifact ID, Version ID, lineage graph, checksum policy, retention policy, sensitivity/access policy, immutable ancestry, version head, rollback, or restore contract exists.
- A durable record, file locator, projected Library item, execution result, revision field, backup, and rollback are different concepts.
- Read/ensure/migrate/write semantics have historically been easy to conflate; reads must remain side-effect free.
- FC-3C7 through FC-3C11 are not independently certified by the controlling evidence.

## Deferred implementation gaps and proposed future owner

A future declarative Artifact/Version contract layer may define shared fields and validation while delegating every mutation to the existing domain writer. It must not become a second store. Deferred work includes provenance, producer/capability/provider references, lineage, checksums, retention, access policy, version ancestry, migration, and rollback semantics.

## Adoption gate and validation requirements

Adoption requires a current producer-consumer inventory, stable ID and locator mapping, read/write separation proof, compatibility and migration plans, byte-stability tests for reads, domain mutation tests, concurrency/recovery analysis, rollback proof, and evidence that each record has exactly one durable mutation owner.

## Non-production-certification statement

This closeout does not certify artifact integrity, rollback, recovery, concurrency, retention, access control, or production readiness. The static asset verifier was not executed in this documentation task.

## Phase 1A closeout verdict

`PHASE_1A_4_DOCUMENTATION_CLOSED=YES` — federated artifact/version truth is documented; universal runtime adoption remains deferred.

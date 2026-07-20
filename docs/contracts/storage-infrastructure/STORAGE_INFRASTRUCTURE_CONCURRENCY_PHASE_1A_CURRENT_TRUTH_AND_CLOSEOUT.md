# Storage, Infrastructure, and Concurrency Phase 1A Current Truth and Closeout

Status: Phase 1A documentation closeout and current-truth record

## Purpose and decision status

This record closes Phase 1A-10 documentation by preserving domain storage owners and stating their actual durability and concurrency boundaries. It creates no universal storage service, transaction manager, lock manager, or recovery authority. The [universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md) controls precedence.

## Evidence baseline

- Baseline: `main` at `baf62a747f5defa51fa1376eb63272cd965a15b3`.
- Controlling evidence: `.mh-audit/phase-1a-efficient-closeout/20260720T101815Z/CODEX_RECONCILIATION.md` and its compact storage-infrastructure index.
- Workspace persistence detail: [Identity/Workspace runtime truth supplement](../identity-workspace/IDENTITY_WORKSPACE_RUNTIME_TRUTH_SUPPLEMENT.md).

## Current owners and mutation boundary

| Storage family | Current authoritative owner | Current mutation owner |
| --- | --- | --- |
| Operations records | Operations Backbone store | Its explicit domain write functions |
| Workspace records | Workspace storage for persistence mechanics; Workspace runtime for lifecycle policy | Workspace runtime through workspace storage |
| Workspace relationships | Workspace relationship runtime through workspace storage | Attach/detach/archive lifecycle functions |
| Project identity/projection | Project identity and Project Workspace projection modules | Their explicit writers within their own boundary |
| Scheduler and integrations | Their domain storage modules | Their concrete create/update/delete functions |
| Process registries | The owning process-local model/worker/customer/queue module | Its process-local mutation functions only |

Every read must remain free of implicit ensure, migration, timestamp, normalization, or rewrite side effects unless the API is explicitly a mutation.

## Producers, consumers, and read-only projections

Producers are the domain writers, atomic replacement helpers, backup/quarantine helpers, and process registries within their stated boundaries. Consumers include backend domain handlers, workspace drift/reconciliation components, scheduler workers, integrations, Operations, Library, and diagnostics. Resolvers, status panels, readiness reports, inspectors, and file catalogs are projections unless explicitly documented as writers.

## Scope and compatibility

- **Project scope:** most file-backed operational data remains under Project-specific or domain-specific roots.
- **Workspace scope:** Workspace storage is durable and Workspace-scoped; that does not make every Project/domain store Workspace-owned.
- **Compatibility behavior:** canonical/legacy path resolution, mirror or dual writes, backup/quarantine, best-effort recovery, provider/worker wrappers, and process-local locks remain bounded adapters. Their limitations must be reported rather than generalized.

At `baf62a7`, the narrow `listProjectAssets` code shape is side-effect free and static verifier coverage exists. The verifier was not run in this documentation task, and FC-3C7 through FC-3C11 are not independently certified.

## Current verified capabilities

Multiple domain file stores are durable, Project isolation/path containment exists, Workspace storage supports contained atomic replacement and recovery classifications, and selected helpers provide atomic or backup behavior. Some model, worker, customer, and queue structures are process-memory only. Process-local locks protect only their stated process boundary.

## Explicit non-capabilities and unresolved contradictions

- No universal transaction, cross-process lock, idempotency, referential-integrity, crash-consistency, recovery, or distributed ownership contract exists.
- File durability, atomic replacement, backup presence, process-local locking, and multi-process safety are distinct claims.
- A resolver or read projection is not a storage owner; a compatibility write is not a second canonical owner.
- Native worker/model availability, queue execution, contention safety, and restore outcomes are not live-certified.

## Deferred implementation gaps and proposed future owner

Each domain remains responsible for its storage correctness. A future infrastructure contract may define common primitives and supported deployment assumptions, but it must be adopted by domain owners without taking business mutation authority. Deferred work includes lock/transaction policy, idempotency, crash recovery, backup/restore objectives, corruption handling, observability, retention, and multi-process guarantees.

## Adoption gate and validation requirements

Adoption requires a store-by-store read/write inventory, byte-stable read proof, explicit mutation APIs, containment and hostile-path tests, contention and multi-process tests, crash/fault injection, idempotency tests, backup/restore drills, compatibility migration and rollback, supported deployment constraints, and proof of one durable owner per record.

## Non-production-certification statement

This closeout does not certify multi-process safety, database-grade transactions, crash recovery, backup restoration, worker durability, queue execution, or production readiness.

## Phase 1A closeout verdict

`PHASE_1A_10_DOCUMENTATION_CLOSED=YES` — current federated storage truth is documented; universal concurrency and recovery guarantees remain deferred.

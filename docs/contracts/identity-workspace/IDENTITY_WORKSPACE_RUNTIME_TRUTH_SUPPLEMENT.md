# Identity / Workspace Runtime Truth Supplement

## Status

Canonical runtime-truth supplement for the current Identity, Workspace, Project relationship, projection, drift, and reconciliation foundations.

This supplement records runtime capabilities added after the earlier Identity / Workspace documentation package.

It does not erase or rewrite the historical documents. Where an older document conflicts with the runtime facts recorded here, this supplement is authoritative for the current implementation state.

## Scope

This supplement covers:

- Workspace contract and schema;
- Workspace storage;
- Workspace lifecycle runtime;
- Workspace to Project relationship authority;
- Project-side Workspace projection;
- projection orchestration;
- projection drift inspection;
- projection reconciliation planning;
- projection reconciliation execution.

This supplement does not create or define an Organization authority model.

Organization, Tenant, Company, Legal Entity, and billing ownership remain separate concerns until their own canonical source inventory and contract decisions are completed.

## Canonical hierarchy at the current runtime boundary

The current proven runtime boundary is:

1. Workspace is an operational authority boundary.
2. Project identity remains a separate authority.
3. Workspace to Project membership is represented by a versioned relationship.
4. Project receives a Workspace projection owned by the Workspace runtime.
5. Reconciliation is one-way from current Workspace authority toward the Project projection.
6. Reconciliation does not transfer source authority to the projection.

The broader product hierarchy may later include Organization above Workspace, but that hierarchy is not established by the Workspace runtime foundation alone.

## Canonical schema versions

The current runtime constants are:

| Contract | Canonical value |
|---|---:|
| Workspace schema version | `1` |
| Project relationship schema version | `1` |
| Project Workspace projection schema version | `1` |
| Project Workspace projection source owner | `workspace-runtime` |

Schema versions are runtime-enforced values, not documentation labels.

Records with unsupported schema versions are rejected by their owning validators.

## Canonical runtime components

### Workspace contract

Source:

`runtime/orchestrator-service/lib/workspace/workspace-contract.js`

Responsibilities:

- validates Workspace records;
- enforces Workspace schema version;
- validates ownership state;
- validates evidence references;
- validates versioned Project relationships;
- rejects unsupported relationship schema versions;
- exposes canonical Workspace and relationship constants.

It is a contract and validation boundary. It is not the persistence owner.

### Workspace storage

Source:

`runtime/orchestrator-service/lib/workspace/workspace-storage.js`

Responsibilities:

- discovers valid Workspace records;
- reads Workspace records without implicit initialization;
- performs contained and atomic replacement;
- supports best-effort backup;
- classifies recovery outcomes;
- supports explicit quarantine and backup recovery;
- preserves root containment and rejects unsafe paths.

Workspace storage owns file persistence mechanics. It does not own higher-level lifecycle policy.

### Workspace runtime

Source:

`runtime/orchestrator-service/lib/workspace/workspace-runtime.js`

Responsibilities:

- creates Workspace records;
- reads and inspects Workspace records;
- applies lifecycle transitions;
- applies optimistic version checks;
- updates mutable Workspace fields through the storage owner;
- appends evidence without replacing protected identity fields;
- preserves relationship history and schema versions;
- exposes explicit error outcomes.

Workspace runtime is the lifecycle authority for Workspace state.

### Workspace to Project relationship runtime

Source:

`runtime/orchestrator-service/lib/workspace/workspace-relationship-runtime.js`

Responsibilities:

- allocates relationship identity;
- validates Project identity before attachment;
- attaches and detaches Projects through append-only relationship history;
- enforces optimistic Workspace versioning;
- preserves relationship schema version;
- exposes filtered relationship reads;
- delegates persistence to the Workspace storage owner.

The relationship runtime is the authority for Workspace-side relationship transitions.

### Project Workspace projection writer

Source:

`runtime/orchestrator-service/lib/projects/project-workspace-projection.js`

Responsibilities:

- writes the Workspace projection into the Project boundary;
- enforces projection schema version;
- enforces `workspace-runtime` as source owner;
- validates expected-current state;
- provides idempotent outcomes;
- preserves unrelated Project fields;
- supports tombstones and replacement semantics;
- exposes uncertain-commit outcomes;
- applies path and filesystem safety.

The projection is a read model. It is not the Workspace authority.

### Projection orchestrator

Source:

`runtime/orchestrator-service/lib/workspace/workspace-projection-orchestrator.js`

Responsibilities:

- orders Workspace relationship authority and Project projection operations;
- requires projection completion before terminal relationship completion;
- exposes partial outcomes when projection succeeds but terminal completion fails;
- preserves owner boundaries;
- performs no automatic rollback.

The orchestrator coordinates owners. It does not replace them.

### Projection drift inspector

Source:

`runtime/orchestrator-service/lib/workspace/workspace-projection-drift-inspector.js`

Responsibilities:

- reads current authority and current projection;
- classifies drift using frozen dimensions;
- recognizes pending authority ahead of projection;
- distinguishes terminal relationship interpretation;
- exposes per-item failures;
- reduces summaries without hiding individual outcomes;
- performs no mutation.

The inspector is read-only.

### Projection reconciliation contract

Source:

`runtime/orchestrator-service/lib/workspace/workspace-projection-reconciliation-contract.js`

Responsibilities:

- converts an inspection result into a bounded reconciliation plan;
- maps the correct execution owner;
- blocks stale inspection approval;
- preserves one-way authority;
- performs no execution and no storage access.

The contract is execution-free and storage-free.

### Projection reconciliation executor

Source:

`runtime/orchestrator-service/lib/workspace/workspace-projection-reconciliation-executor.js`

Responsibilities:

- revalidates the reconciliation contract;
- rereads the current inspection before execution;
- blocks stale approval;
- dispatches to the existing authority owner;
- enforces expected-current protection on projection writes;
- certifies final state;
- exposes partial outcomes;
- performs no automatic rollback;
- performs no direct storage mutation.

The executor does not introduce a second relationship or projection owner.

## Producer, consumer, and authority decisions

| Concern | Producer or mutation owner | Primary consumers | Authority decision |
|---|---|---|---|
| Workspace record | Workspace runtime through Workspace storage | Workspace runtime, relationship runtime, inspectors | Workspace runtime is lifecycle authority; storage owns persistence mechanics |
| Workspace to Project relationship | Workspace relationship runtime | orchestrator, drift inspector, reconciliation planning | relationship runtime is transition authority |
| Project Workspace projection | Project Workspace projection writer | Project-side readers, drift inspector | Workspace runtime remains source owner; projection is not authoritative |
| Drift report | projection drift inspector | reconciliation contract, operators, diagnostics | read-only derived evidence |
| Reconciliation plan | reconciliation contract | reconciliation executor, approval flow | bounded plan; no mutation authority |
| Reconciliation execution | reconciliation executor through existing owners | operators, certification, diagnostics | executor coordinates; existing owners retain mutation authority |

## Write-boundary rules

The following rules are frozen for this foundation:

1. No consumer may write Workspace persistence directly.
2. Relationship mutations must use the relationship runtime.
3. Project projection writes must use the Project Workspace projection writer.
4. Drift inspection must remain read-only.
5. Reconciliation planning must remain execution-free.
6. Reconciliation execution must dispatch through existing owners.
7. No automatic rollback is performed across owner boundaries.
8. Partial outcomes must remain visible.
9. Production data must not be touched by verification suites.
10. Route, permission, and security integration are not implied by this foundation.

## Approval and stale-state protection

Reconciliation approval is valid only for the inspected state from which the plan was produced.

Before execution:

- the contract is revalidated;
- the inspector rereads current state;
- stale approval is blocked;
- expected-current protection is applied;
- final state is certified after owner execution.

Approval does not override source authority or optimistic concurrency.

## Runtime verification status

The following verifier suites pass against temporary isolated data:

- Workspace runtime;
- Workspace storage and recovery;
- Workspace to Project relationship runtime;
- Project Workspace projection;
- projection orchestrator;
- projection drift inspector;
- projection reconciliation contract;
- projection reconciliation executor.

The verifiers prove:

- no production-data mutation;
- schema and version enforcement;
- optimistic concurrency;
- filesystem containment;
- authority-boundary preservation;
- one-way projection authority;
- stale-approval rejection;
- visible partial outcomes;
- no automatic rollback;
- no direct-storage bypass by reconciliation.

## Explicit non-claims

This supplement does not claim that the following are complete:

- Organization authority;
- Tenant or billing hierarchy;
- system-wide RBAC adoption;
- route-level permission enforcement;
- provider execution authority;
- universal Artifact authority;
- system-wide status vocabulary;
- production deployment readiness.

Those concerns remain governed by their own inventories, contracts, and later program phases.

## Historical-document relationship

The earlier files in `docs/contracts/identity-workspace/` remain historical and supporting evidence.

This supplement supersedes only stale implementation-state claims about missing Workspace runtime, storage, relationship authority, projection, drift inspection, or reconciliation.

It does not supersede unresolved target-state analysis unless a statement directly conflicts with the proven runtime facts above.

## Closeout recommendation

The Identity / Workspace package may be treated as a complete Phase 1A inventory candidate after:

1. this supplement is reviewed and committed;
2. the final Phase 1A Closeout Matrix links to it;
3. Organization remains explicitly marked as unresolved outside this runtime scope;
4. no broader authority is inferred from the Workspace foundation.

# Phase K-1 — Controlled First Production Activation Writer Boundary

## Decision

Phase K-1 is the smallest production activation writer. It consumes the accepted Phase J ownership handoff, revalidates one existing Project identity and its one existing `ATTACHED` / `VALID` Workspace relationship, and records one deterministic activation event through the existing audit system.

It is not a migration or creation system. It never creates a Project, Workspace, identity, relationship, projection, registry entry, approval, endpoint, queue item, role, or permission.

## Dry-run-first protocol

1. `prepareControlledProductionActivation(projectSlug, evidence, options)` always runs in `DRY_RUN` mode.
2. It returns an explicit immutable plan scoped to one Project, Project ID, Workspace ID, relationship ID, Workspace version, approval ID, and activation timestamp.
3. `executeControlledProductionActivation(...)` reruns the dry run while holding the process-local per-Project writer lock.
4. Apply is rejected unless the supplied plan is byte-for-byte equal to the new deterministic plan.
5. The audit owner appends the deterministic event ID once. Replay returns `ALREADY_APPLIED` and creates no second event.

## Mutation boundary

| Owner | K-1 access | Mutation |
|---|---|---|
| `project-identity` | Inspect existing identity and global uniqueness | None |
| `workspace-relationship-runtime` | Inspect the exact existing relationship and Workspace version | None |
| Existing audit/event system | Read event presence; idempotently append the activation event | One scoped append only |

The audit storage helper writes atomically through a temporary file and retains its normal backup as recovery evidence. A failed append leaves Project, Workspace, identity, registry, and unrelated Project data untouched. Cross-process serialization remains an infrastructure responsibility; K-1 declares only a process-local per-Project writer lock.

## Before/after evidence

Both modes expose the authoritative Project ID and identity state, Workspace ID/version, relationship ID/status/validation state, and activation-event presence. Dry run returns identical before/after evidence. Apply may change only `audit_event_present` from `false` to `true`.

## Authority interpretation

Phase K-1 does not create or rewrite authorization. It consumes Phase J only when `ownership_state` is `OWNERSHIP_CHAIN_ACCEPTED`, including the existing approved activation decision and existing audit custody. The older Phase G authorization projection is retained inside source evidence and is not modified or concealed.

## Verification

Run:

```sh
node scripts/verify-controlled-production-activation-writer.js
```

The verifier proves deterministic dry-run output; exact-plan enforcement; a single fixture-only audit mutation; idempotent replay; unchanged Project, Workspace, registry, and unrelated Project files; unique Project and Workspace IDs; no migration; failure rollback safety; and a byte-for-byte unchanged live `data/` tree for the blocked HairoticMen assessment.

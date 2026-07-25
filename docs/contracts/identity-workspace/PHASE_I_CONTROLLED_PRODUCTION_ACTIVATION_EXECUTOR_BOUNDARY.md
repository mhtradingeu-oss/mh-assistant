# Phase I — Controlled Production Activation Executor Boundary

## Decision

Phase I is a backend-owned, read-only activation executor boundary. It composes the validated Phase H authority model, validates existing Governance approval evidence and Workspace Runtime executor evidence, creates a deterministic dry-run plan, and returns a deeply immutable simulated result.

Phase I never invokes activation. It has no writer, endpoint, queue, provider adapter, migration, or frontend authority. A `DRY_RUN_READY` result means only that the supplied read-only evidence is sufficient to construct the fixed simulation plan. It does not mean production activation is authorized or executable.

## Architecture boundary

The boundary consumes Phase H and does not call or reproduce Phases A-G. Its fixed sequence is:

```text
Phase H authority model
  -> validate Governance approval evidence
  -> validate Workspace Runtime dry-run executor evidence
  -> create ordered non-mutating plan
  -> return simulated activation result (`activated: false`)
```

Invalid, partial, wrongly owned, or cross-Project evidence is treated as missing. The contract independently rejects contradictory result objects, cross-Project evidence, executable safety claims, and mutation-enabled plan steps.

## Authority mapping

| Concern | Existing authority | Phase I behavior |
|---|---|---|
| Approval record and decision | Governance / Operations Backbone | Validates project-scoped approved evidence; creates or decides nothing |
| Authorization and ownership chain | Phase H activation authority model | Composes and preserves it; never upgrades its authorization |
| Workspace execution | Workspace Runtime | Validates only `workspace-runtime` dry-run executor evidence; invokes nothing |
| Project identity | `project-identity` | Preserves ownership; plan validation only |
| Workspace-to-Project relationship | Workspace Relationship Runtime | Preserves ownership; plan validation only |
| Execution plan and simulated result | Phase I executor boundary | Owns deterministic in-memory construction only |
| Frontend | Projection only | Has no decision or write authority |

## Deterministic states

State precedence is fixed:

1. `BLOCKED_ACTIVATION` when Phase H is not a fully specified ready activation.
2. `MISSING_APPROVAL` when applicable Governance approval evidence is absent or invalid.
3. `MISSING_EXECUTOR` when approval is valid but Workspace Runtime dry-run executor evidence is absent or invalid.
4. `DRY_RUN_READY` when both evidence sets are valid and scoped to the same Project.

Only `DRY_RUN_READY` contains a plan. Every step has `mutation_allowed: false`; every result has `activated: false`, `activation_executable: false`, and `activation_executed: false`.

## Required scenarios

- HairoticMen: `BLOCKED_ACTIVATION`; approval and executor evidence are not applicable; no plan is created.
- Missing approval: `MISSING_APPROVAL`; no plan is created.
- Missing executor: `MISSING_EXECUTOR`; no plan is created.
- Fully specified dry run: `DRY_RUN_READY`; a four-step non-mutating plan and simulated result are returned.

## Verification

Run:

```sh
node scripts/verify-activation-executor-boundary.js
```

The verifier hashes isolated multi-Project fixtures before and after all scenarios, hashes live `data/` before and after the HairoticMen assessment, checks deterministic and deeply immutable output, rejects cross-Project evidence and executable or mutating contradictions, and statically rejects known mutation entry points in the Phase I runtime files.

## Remaining gap

Phase H currently preserves Phase G's fail-closed `MISSING_AUTHORITY` authorization. Phase I validates approval and executor evidence but does not reinterpret either as that missing authorization. A real production executor, affirmative authorization source, durable audit consumption, replay protection, and any activation writer remain deliberately absent and require a separately governed phase.

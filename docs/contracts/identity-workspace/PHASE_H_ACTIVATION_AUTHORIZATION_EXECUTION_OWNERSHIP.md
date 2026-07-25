# Phase H — Activation Authorization & Execution Ownership Model

## Decision

Phase H is a backend-owned, read-only authority projection. It composes the validated Phase G production activation workflow and projects this chain:

```text
Requester
  -> Authorization
  -> Approval Owner
  -> Execution Owner
  -> Audit Evidence
```

Phase H does not activate a Project. It does not create or decide an approval, create a user, change a role or permission, mutate a Workspace or Project, change any runtime authority, migrate data, or write to the filesystem. The frontend may display the returned model but cannot supply authoritative owner evidence or change a decision.

## Architecture boundary

Phase H consumes exactly one governance decision source: Phase G. It does not call or reproduce Phases A-F. It accepts backend evidence describing the requester and existing approval and execution owners, validates that evidence, and emits a deeply immutable projection.

Owner completeness is deliberately separate from authorization. `FULLY_SPECIFIED_READY_ACTIVATION` means the ready Project has a requester, approval owner, execution owner, and audit references. It does not mean activation was authorized or executed. `safety.handoff_ready` can become true only when the validated Phase G authorization decision is true. The Phase H model itself always reports `activation_executable: false` and `activation_executed: false`.

Current Phase G truth is fail-closed: authorization is `MISSING_AUTHORITY`. Phase H preserves that result without override. Consequently, a fully specified current ownership chain remains non-executable.

## Authority mapping

| Stage | Existing owner or source | Phase H behavior |
|---|---|---|
| Requester | Backend request context | Validates and projects requester evidence; creates no identity or user |
| Authorization | Phase G production activation workflow | Projects the exact Phase G decision; never upgrades or replaces it |
| Approval Owner | Operations Backbone | Accepts only `operations-backbone` owner evidence; creates and decides no approval |
| Execution Owner | Workspace Runtime | Accepts only `workspace-runtime` as the existing Workspace execution owner; invokes no execution |
| Audit Evidence | Phase H immutable references | Links Phase G, requester, approval-owner, and execution-owner evidence |
| Project identity | `project-identity` | Preserved; never written by Phase H |
| Workspace-to-Project binding | `workspace-relationship-runtime` | Preserved; never written by Phase H |

## Deterministic states

State precedence is fixed:

1. `BLOCKED_ACTIVATION` when Phase G readiness is not ready. Owner stages are `NOT_APPLICABLE`.
2. `MISSING_REQUESTER` for a ready Project without requester evidence.
3. `MISSING_APPROVAL_OWNER` for a ready Project without existing approval-owner evidence.
4. `MISSING_EXECUTION_OWNER` for a ready Project without Workspace Runtime execution-owner evidence.
5. `FULLY_SPECIFIED_READY_ACTIVATION` when all ownership evidence is present.

No state authorizes Phase H to execute activation.

## Required scenarios

- HairoticMen: `BLOCKED_ACTIVATION`, preserving Phase G `BLOCKED` readiness and `project-identity` as the required prerequisite owner.
- Missing approval owner: ready Phase G workflow, requester present, Workspace Runtime execution owner present, approval owner missing.
- Missing execution owner: ready Phase G workflow, requester and approval owner present, execution owner missing.
- Fully specified ready activation: ready Phase G workflow with all owner evidence and complete audit references; authorization remains the Phase G result and activation remains unexecuted.

## Verification

Run:

```sh
node scripts/verify-activation-authority-model.js
```

The verifier uses isolated temporary fixtures for ready-Project scenarios and hashes them before and after assessment. It also hashes live `data/` before and after the HairoticMen assessment. Static boundary checks reject approval, Workspace, Project, identity, role, permission, and filesystem mutation entry points in the Phase H runtime modules. Contract tests reject invented authorization, execution-owner replacement, and cross-Project evidence.

## Remaining authority gap

Phase G currently proves no production activation authorization owner and no affirmative authorization decision. Phase H intentionally does not close that gap by inventing an owner. Establishing such authority requires a separately governed change to Phase G or its authoritative source and is outside this read-only phase.

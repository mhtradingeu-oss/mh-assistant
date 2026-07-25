# Phase E — Bootstrap Authority Reconciliation

## Decision

Phase E is a backend-owned, read-only decision layer. It determines which existing authority is responsible for unmet Bootstrap prerequisites; it does not perform Bootstrap, create records, generate identities, write a registry or projection, or migrate data.

For an existing Project, Phase E composes the complete Phase D assessment. It does not repeat the Phase A–D lifecycle checks. For a missing Project record, it converts only the authoritative `PROJECT_NOT_FOUND` result into a `NEW_PROJECT_REQUEST` decision. The Project-creation operation remains outside Phase E.

## Required state

Every assessment exposes these invariant target states:

- Workspace: `ACTIVE_WITH_ATTACHED_VALID_PROJECT_RELATIONSHIP`.
- Project: `EXISTING_WITH_VALID_AUTHORITATIVE_IDENTITY`.
- Identity: ready only when the Phase D `project_identity` stage reports ready.
- Activation: ready only when Phase D reports `READY_FOR_ACTIVATION`.

The embedded Phase D assessment is immutable evidence for existing Projects. A new Project request has no Phase D assessment because there is no Project record to assess.

## Scenarios

| Scenario | Decision | Responsible authority |
|---|---|---|
| New Project request | `EXISTING_LIFECYCLE_REQUIRED` | Existing Project/Workspace lifecycle owners; Phase E creates nothing |
| Existing Project data without identity | `PROJECT_IDENTITY_REQUIRED` | `project-identity` |
| Existing Project with other unmet Phase D prerequisites | `ACTIVATION_PREREQUISITES_REQUIRED` | Phase D identifies the blockers and preserves their owners |
| Ready Project | `NO_BOOTSTRAP_REQUIRED` | None |

## Preserved authority

| Concern | Authority |
|---|---|
| `workspace_id` | Workspace Runtime (`workspace-runtime`) |
| `project_id` | `project-identity.js` (`project-identity`) |
| Workspace → Project | Workspace Relationship Runtime (`workspace-relationship-runtime`) |
| Contract | Universal Project Contract (`universal-project-contract`) |
| Activation | Phase D Assessment (`project-activation-assessment`) |
| Bootstrap decision | Phase E (`bootstrap-authority-assessment`) |

The Bootstrap decision is backend authoritative. Any frontend consumer is projection-only and cannot override or persist it.

## HairoticMen

HairoticMen is assessed by the same generic function as every Project. Its existing Project data is present, but `project-identity.js` reports `MISSING`. Phase E therefore deterministically reports `EXISTING_PROJECT_WITHOUT_IDENTITY` and `PROJECT_IDENTITY_REQUIRED`. It does not generate the missing identity or modify live data.

## Verification

Run:

```sh
node scripts/verify-bootstrap-authority-assessment.js
```

The verifier covers the three required scenarios, HairoticMen, multi-Project isolation, deterministic output, deep immutability, contract contradiction rejection, forbidden mutation entry points, and content-hash stability of fixture and live data. Phase A–D verifiers remain the regression gate.

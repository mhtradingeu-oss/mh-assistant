# Phase D — Workspace & Project Activation Lifecycle

## Decision

Phase D is a backend-owned, read-only activation assessment. It composes the Phase C Project lifecycle readiness result and does not create or modify a Workspace, Project, identity, relationship, registry record, projection, capability, or activation record.

The activation path is fixed:

1. Workspace
2. Project Identity
3. Binding
4. Universal Project Contract
5. Capabilities
6. Activation Status

`project-activation-contract.js` owns only the immutable assessment schema and its validation. `project-activation-assessment.js` owns only deterministic composition and status derivation.

## Preserved authority

| Evidence | Existing owner | Phase D behavior |
|---|---|---|
| Workspace ID and record | Workspace Runtime | Read-only projection of Phase C evidence |
| Project ID | `project-identity.js` | Read-only projection; never generated |
| Workspace → Project binding | Workspace Relationship Runtime | Read-only projection through Phase B/C |
| Registry and Project projection prerequisites | Existing backend registry and projection owners | Read-only Phase C prerequisite result |
| Universal Project Contract | Phase A contract | Read-only projection |
| Capability evidence | Existing domain owners, projected by Phase A/C | Grouped without changing capability state |
| Activation status | Phase D assessment | Derived backend result; never persisted |

The frontend may display the returned contract but cannot decide, override, or persist activation status.

## Status semantics

`READY_FOR_ACTIVATION` means all five visible activation-path stages are ready and the complete Phase C lifecycle prerequisites are ready. It does not mean that Phase D activated anything.

`BLOCKED` preserves the deterministic Phase C blockers. Registry and Project-side projection checks remain visible under `lifecycle_prerequisites` instead of being duplicated or reassigned to a new owner.

The contract exact-field validates ownership and contradictions, deep-freezes the returned assessment, and explicitly declares that it performs no identity creation, Workspace creation, binding write, registry write, Project-file write, or filesystem mutation.

## HairoticMen assessment

HairoticMen uses the same generic assessment as every other Project. Its current assessment is `BLOCKED` because Phase C reports `MISSING_PROJECT_IDENTITY`. Phase D does not generate the missing ID, attach a Workspace, update the registry, or modify `data/projects/hairoticmen/project.json`.

## Verification

Run:

```sh
node scripts/verify-project-activation-assessment.js
```

The verifier proves deterministic output, exact activation ordering, authority preservation, no mutation entry points, content-hash stability for Project/Workspace/registry fixtures, live `data/` stability during the HairoticMen assessment, and isolation between two Projects. Phase A/B/C verifiers must also remain passing.

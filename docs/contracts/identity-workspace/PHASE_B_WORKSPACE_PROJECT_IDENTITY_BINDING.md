# Phase B — Workspace / Project Identity Binding

## Decision

Phase B reconciles existing identity owners; it does not create an identity system.

The canonical chain is:

`Workspace workspace_id -> Workspace relationship project_id -> Project project_id -> Universal Project Contract project slug`

## Ownership

| Concern | Authoritative owner | Phase B treatment |
|---|---|---|
| `workspace_id` and Workspace lifecycle | `workspace/workspace-runtime.js` with `workspace-storage.js` | Preserved; read only |
| `project_id` | `projects/project-identity.js` | Preserved; read only |
| Workspace-to-Project relationship | `workspace/workspace-relationship-runtime.js` | Canonical binding authority; read only |
| Project-side Workspace data | `projects/project-workspace-projection.js` | Non-authoritative projection checked against relationship authority |
| Universal Project readiness | `projects/universal-project-contract.js` | Phase A projection referenced by canonical Project slug |
| Phase B binding report | `projects/workspace-project-identity-binding.js` | Validation and reconciliation reporting only |

The Phase B report allocates no IDs, writes no records, repairs no projection, and owns no lifecycle transition.

## Canonical contract

Schema version `1` emits one deterministic `workspace_project_identity_binding` report with:

- authoritative Project identity and owner;
- zero or one unambiguous active authoritative Workspace relationship;
- non-authoritative Project projection presence/alignment;
- the bound Universal Project Contract identity;
- a deterministic readiness state and sorted gap list;
- explicit declarations that the report creates no identity and mutates no data.

Contract validation rejects unknown or missing fields, malformed IDs/states, authority inversion, an authoritative Project projection, inconsistent readiness, and a Universal Project Contract bound to a different Project slug.

## Reconciliation classifications

`READY` requires a valid Project identity, exactly one active Workspace relationship, an `ATTACHED` and `VALID` relationship, and an aligned Project-side projection.

Non-ready states are:

- `MISSING_PROJECT_IDENTITY`;
- `MISSING_WORKSPACE_BINDING`;
- `AMBIGUOUS_WORKSPACE_BINDING`;
- `BINDING_NOT_ATTACHED`;
- `PROJECTION_MISSING`;
- `PROJECTION_MISMATCH`;
- `SOURCE_INVALID`.

Detection is read-only. Existing relationship/projection orchestration remains the only approved repair path.

## HairoticMen certification

At Phase B implementation time, `data/projects/hairoticmen/project.json` has no authoritative `project_id` or Project identity metadata and there are no durable Workspace records under `data/workspaces`.

The deterministic result is therefore `MISSING_PROJECT_IDENTITY`, with `ready: false`. Phase B intentionally does not migrate or mutate HairoticMen. Its existing Project data is preserved, and readiness becomes `READY` only after the existing Project identity and Workspace relationship owners complete their normal lifecycle and projection flow.

## Safety proof

The verifier covers a ready binding, missing binding, duplicate active binding, mismatched and missing projection, malformed contract rejection, deterministic repeated output, unchanged file inventory, preservation of existing IDs, and isolation between two Projects.

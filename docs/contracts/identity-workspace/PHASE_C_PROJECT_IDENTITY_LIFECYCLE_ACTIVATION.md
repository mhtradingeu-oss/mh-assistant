# Phase C — Project Identity Lifecycle Activation & Registration

## Decision

Phase C adds a read-only backend readiness layer. It does not add a Project system, identity generator, Workspace lifecycle, registry writer, projection writer, migration, or frontend authority.

The lifecycle order is fixed:

1. Workspace
2. Workspace Binding
3. Project Identity
4. Project Registry
5. Projection
6. Universal Project Contract
7. Capabilities

`runtime/orchestrator-service/lib/projects/project-lifecycle-readiness.js` owns only validation and composition of this readiness report.

## Preserved owners

| Concern | Existing owner | Phase C behavior |
|---|---|---|
| `workspace_id` and Workspace record | Workspace runtime/storage | Read only |
| Workspace → Project relationship | `workspace-relationship-runtime.js` | Read through Phase B |
| `project_id` | `project-identity.js` | Read through Phase B; never generated here |
| Project registration | Backend Project registry (`data/projects/registry.json`, operated by `server.js`) | Membership inspection only |
| Project-side Workspace projection | `project-workspace-projection.js` | Read through Phase B; non-authoritative |
| Universal Project Contract | `universal-project-contract.js` | Read-only Phase A projection |
| Capability evidence | Existing domain owners, projected by the Universal Project Contract | Derived grouping only |

The registry is keyed by canonical Project slug because the existing registry does not own `project_id`. A registry record therefore cannot establish, replace, or correct identity.

## Readiness semantics

Activation readiness is `READY` only when:

- the existing Project identity is fully valid;
- exactly one authoritative Workspace relationship resolves and is `ATTACHED`/`VALID`;
- the Project has exactly one canonical entry in the existing backend registry;
- the Project-side Workspace projection exists and aligns with relationship authority;
- the Universal Project Contract is available; and
- at least one contract domain is `READY`, producing at least one enabled capability.

`PARTIAL` and `MISSING` Universal Project Contract domains remain visible as partial and unavailable capabilities. They do not individually prevent activation when another capability is ready. Duplicate or malformed registry evidence fails closed.

The report is exact-field validated, deeply frozen, deterministic for unchanged inputs, and declares that it creates no identity or Workspace, registers no Project, writes no projection, and mutates no data. Frontend consumers may project the report but may not decide readiness.

## HairoticMen

HairoticMen is checked through the same generic backend function as every Project. Phase C does not special-case, migrate, or modify it. At certification time it is present once in the existing Project registry but its `project.json` has no authoritative `project_id`; the deterministic result is `MISSING_PROJECT_IDENTITY`. Only the existing identity and Workspace lifecycle owners may remove that blocker through their normal mutation paths.

## Proof

Run:

```sh
node scripts/verify-project-lifecycle-readiness.js
```

The verifier proves deterministic output, read-only inspection, identity and Workspace ownership, registry failure modes, exact lifecycle order, non-authoritative projections, HairoticMen readiness, and isolation between two Projects.

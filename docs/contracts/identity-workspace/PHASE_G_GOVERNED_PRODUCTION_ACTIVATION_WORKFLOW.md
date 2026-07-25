# Phase G — Governed Production Activation Workflow

## Decision

Phase G is a backend-owned, read-only workflow projection. It accepts a Project slug, composes the complete Phase F onboarding orchestration, and returns an immutable model of an activation request, authorization, readiness, required authority, approval requirement, and execution owner.

Phase G does not activate a Project. It does not create a Workspace or Project, generate an identity, attach a relationship, create or decide an approval, write a registry or Project file, migrate data, or mutate the filesystem. The frontend may display the result but cannot decide or persist any field.

## Fail-closed production boundary

The current repository proves the readiness, bootstrap, onboarding, Workspace lifecycle, Project identity, binding, contract, and durable approval-record owners. It does not prove a dedicated production-activation authorization owner or execution owner. Phase G therefore does not invent them.

For a Project with unmet prerequisites, the workflow reports `PREREQUISITES_REQUIRED` and preserves the responsible authorities selected by Phase E and projected through Phase F. For a ready Project, readiness remains `READY_FOR_ACTIVATION`, approval is reported as `REQUIRED`, but authorization remains `MISSING_AUTHORITY`, execution ownership remains `UNRESOLVED`, and the workflow remains non-executable.

`READY_FOR_ACTIVATION` is readiness evidence only. It is never treated as authorization, approval, or execution.

## Workflow model

| Stage | Phase G projection |
|---|---|
| Activation Request | `REQUEST_PRODUCTION_ACTIVATION`, assessed read-only |
| Authorization | `MISSING_AUTHORITY` until an authoritative backend owner is separately proved |
| Readiness | Phase D evidence projected through Phases E and F |
| Required Authority | Phase E responsible authorities projected through Phase F, or unresolved production-activation authority when prerequisites are complete |
| Approval Requirement | `NOT_APPLICABLE` while blocked; `REQUIRED` when ready; never satisfied by Phase G |
| Execution Owner | `UNRESOLVED`; never executable in Phase G |

## Authority mapping

| Concern | Authority |
|---|---|
| Workspace lifecycle and `workspace_id` | Workspace Runtime (`workspace-runtime`) |
| `project_id` | `project-identity.js` (`project-identity`) |
| Workspace → Project binding | Workspace Relationship Runtime (`workspace-relationship-runtime`) |
| Contract evidence | Universal Project Contract (`universal-project-contract`) |
| Activation readiness | Phase D (`project-activation-assessment`) |
| Bootstrap decision | Phase E (`bootstrap-authority-assessment`) |
| Onboarding orchestration | Phase F (`onboarding-orchestration`) |
| Workflow composition | Phase G (`production-activation-workflow`) |
| Durable approval records and decisions | Operations Backbone; Phase G is projection-only |
| Production-activation authorization | Unproven; `null` |
| Production-activation execution | Unproven; `null` |

## Required scenarios

- HairoticMen: `PREREQUISITES_REQUIRED`, Phase D readiness `BLOCKED`, required authority `project-identity`.
- New Project request: `PREREQUISITES_REQUIRED`, readiness `NOT_ASSESSABLE`, routed to existing Project and Workspace lifecycle owners without creating anything.
- Ready Project: readiness `READY_FOR_ACTIVATION`, approval `REQUIRED`, but no execution is authorized.
- Missing authority: authorization `MISSING_AUTHORITY`, execution owner `UNRESOLVED`, executable `false`.

## Verification

Run:

```sh
node scripts/verify-production-activation-workflow.js
```

The verifier covers all required scenarios, deterministic output, deep immutability, multi-Project isolation, cross-Project evidence rejection, contract contradiction rejection, forbidden mutation entry points, content-hash stability for fixtures, and content-hash stability of live `data/` during the HairoticMen assessment. Phase A–F verifiers remain the regression gate.

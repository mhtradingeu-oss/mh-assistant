# Project Membership Contract Design

Status: Phase 1B-1B design only; not implemented or approved for runtime adoption.

## Purpose and non-goals

This contract defines future Principal-to-Project access scoped under a Workspace. It is distinct from Project identity, Project business data, the installed Workspace-to-Project relationship, path containment, authentication, Workspace membership, role/grant assignment, permission, approval, and execution safety.

It does not create routes, storage, automatic inheritance, a Project lifecycle owner, or enforcement. It does not change Project slug validation, filesystem containment, Project domain mutations, or existing guards.

## Canonical owner and identity

A future scoped Project membership authority owns this relationship and delegates Project and Workspace validation to their existing owners. It must not duplicate Project identity, Workspace lifecycle, or Workspace-to-Project relationship state.

`project_membership_id` is opaque, stable, and never reused. Its context is the tuple `(workspace_id, project_id, principal_id)`, and it references the originating active `workspace_membership_id`.

Required fields:

| Field | Semantics |
|---|---|
| `schema_version` | Supported record shape |
| `project_membership_id` | Stable scoped relationship ID |
| `workspace_id`, `project_id` | Valid authoritative scope references |
| `principal_id` | Authoritative actor reference |
| `workspace_membership_id` | Originating Workspace membership evidence |
| `status` | Project-membership lifecycle state |
| `revision` | Optimistic-concurrency token |
| `effective_from` | Earliest validity time |
| `created_at`, `updated_at` | UTC transition timestamps |
| `provenance`, `audit_reference` | Bounded origin and transition evidence |

Optional fields include `effective_until`, `assignment_references`, `suspension_reason_code`, `revocation_reason_code`, `predecessor_membership_id`, and an explicit inheritance-policy reference. A Project role label is not a grant without a valid assignment reference.

## Lifecycle and invariants

Lifecycle vocabulary is `PENDING`, `ACTIVE`, `SUSPENDED`, `REVOKED`, `EXPIRED`, and `DECLINED`. Only a time-valid `ACTIVE` record may contribute positive evidence.

Minimum transition direction is `PENDING` to `ACTIVE`, `DECLINED`, `REVOKED`, or `EXPIRED`; `ACTIVE` to `SUSPENDED`, `REVOKED`, or `EXPIRED`; and `SUSPENDED` to `ACTIVE`, `REVOKED`, or `EXPIRED`. `DECLINED`, `REVOKED`, and `EXPIRED` are terminal for that record. Any additional transition requires a later contract version.

Invariants:

1. The Workspace must authoritatively contain the Project, and the Principal must have eligible Workspace membership.
2. A safe Project slug or contained path proves safety, not membership or permission.
3. Project attachment to a Workspace is not Principal-to-Project access.
4. Workspace membership does not automatically imply Project membership. Any future inherited access requires authoritative, versioned, provenance-bearing policy evidence bound to the same Principal, Workspace, and Project; both memberships must remain active, and the derived scope cannot exceed its source grant.
5. Project membership never grants access to another Project, Workspace, action, or resource.
6. Suspension, revocation, expiry, parent-membership invalidity, detachment, ambiguity, or missing evidence fails closed.

## Sources, producers, consumers, and mutation boundaries

Only the future Project membership authority may create or transition Project membership. It consumes but does not mutate Principal, Workspace membership, Workspace-to-Project relationship, and Project identity evidence. Project/domain owners retain all Project lifecycle and business-data mutation authority.

Consumers include the future grant authority, federated permission resolver, backend administrative surfaces, and redacted audit projections. Frontend route visibility and Project selectors remain projection only.

Mutations require effective backend authorization for the exact Workspace, Project, target Principal, and action, plus every existing applicable guard. A governance approval can satisfy a policy input but cannot substitute for authentication, both memberships, grants, or resource authorization.

## Evidence, privacy, and audit

Evidence includes source authority, all scope bindings, parent membership reference and revision/freshness, relationship reference, transition, actor, timestamp, expiry, correlation, and redaction class. It excludes credentials, secrets, tokens, raw contact data, and unrelated Project content.

Audit covers creation, activation, suspension, revocation, expiry, decline, parent invalidation, Project detachment impact, assignment changes, denied attempts, stale writes, and cross-scope conflicts. Evidence must permit tracing without copying domain payloads.

## Missing context and denial semantics

An unknown Principal, Workspace, Project, parent membership, or Workspace-to-Project relationship yields `INSUFFICIENT_CONTEXT` when required evidence cannot be established. Established inactive or mismatched evidence yields `DENY`. Unsupported resource/action combinations yield `UNSUPPORTED_ACTION`. No condition falls back to broad Workspace or key-holder access.

## Idempotency and concurrency

Commands require a context-scoped idempotency key and expected `revision`. Exact replay is stable; key reuse with different content conflicts. Concurrent creates converge to one active lineage. Permission evaluation must account for races with parent suspension, Project detachment, or revocation through a future freshness/revalidation rule; uncertainty never permits.

## Compatibility and validation

Shadow adoption only; existing Project routes, response shapes, isolation safeguards, and handler checks do not change. Compatibility mappings preserve provenance and cannot manufacture membership from slugs, path access, access keys, task assignments, owner labels, or frontend state.

Validation covers schema/version, referential and scope integrity, lifecycle transitions, parent invalidation, Workspace/Project isolation, detachment, expiry, idempotency, optimistic concurrency, redaction, audit correlation, and negative cases proving path containment and Workspace-to-Project attachment are not membership.

## Deferred implementation questions

- Which bounded backend owner stores Project membership without duplicating Project or Workspace records?
- Are any explicit Workspace-level grants inheritable, and how are they versioned and revoked?
- What happens to memberships during Project transfer between Workspaces?
- What read-consistency boundary prevents stale parent membership from permitting access?

## Prohibited interpretations

This design is not current enforcement, Project attachment, path authorization, an automatic Workspace inheritance rule, a role grant, governance approval, or frontend authority.

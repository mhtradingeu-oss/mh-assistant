# Role and Grant Contract Design

Status: Phase 1B-1B design only; not implemented or approved for runtime adoption.

## Purpose and non-goals

This contract defines future scoped assignment evidence that binds a Principal, through eligible membership, to role or capability grants. It distinguishes descriptive role vocabulary from authoritative grants.

It does not create universal RBAC, replace capability or route catalogs, infer grants from labels, mutate memberships, approve governance actions, configure providers, execute work, or alter current checks.

## Canonical owner, identity, and versioning

A future scoped grant authority is the sole owner of assignment lifecycle and mutation. Workspace and Project membership authorities only validate assignment eligibility and retain ownership of their membership records. Capability definitions and route classifications remain with their existing bounded owners; the grant authority references them and does not duplicate their registries.

`assignment_id` is stable and opaque. `schema_version` versions shape; `revision` provides optimistic concurrency. A role is a versioned bundle reference. A grant is an explicit allow-capability assignment. Any future explicit deny is modeled distinctly and takes precedence; absence is never allow.

Required fields:

| Field | Semantics |
|---|---|
| `schema_version`, `assignment_id`, `revision` | Shape, identity, concurrency |
| `principal_id` | Assigned Principal |
| `membership_reference` | Eligible Workspace or Project membership |
| `scope_type`, `scope_id` | Exact `WORKSPACE` or `PROJECT` boundary |
| `assignment_type` | `ROLE`, `CAPABILITY_GRANT`, or `CAPABILITY_DENY` |
| `definition_id`, `definition_version` | Existing role/capability vocabulary reference |
| `status` | Assignment lifecycle state |
| `effective_from` | Earliest validity time |
| `provenance`, `audit_reference` | Bounded assignment evidence |

Optional fields include `effective_until`, `resource_constraints`, `action_constraints`, `condition_reference`, `delegated_by_assignment_id`, `revocation_reason_code`, and human-readable display metadata. Display metadata never participates in decisions.

## Field and lifecycle semantics

Assignment status is `PENDING`, `ACTIVE`, `SUSPENDED`, `REVOKED`, or `EXPIRED`. Only time-valid `ACTIVE` assignments backed by active membership contribute grants. Role expansion is evaluated using the pinned `definition_version`; a label without a resolvable version is invalid evidence.

Minimum transition direction is `PENDING` to `ACTIVE`, `REVOKED`, or `EXPIRED`; `ACTIVE` to `SUSPENDED`, `REVOKED`, or `EXPIRED`; and `SUSPENDED` to `ACTIVE`, `REVOKED`, or `EXPIRED`. `REVOKED` and `EXPIRED` are terminal for that assignment. Any additional transition requires a later contract version.

Invariants:

1. Role labels in routes, UI, tasks, AI teams, operational records, or policies are vocabulary only unless backed by authoritative scoped assignment evidence.
2. Access-key class and Principal type do not imply roles or capabilities.
3. Grants are explicit, bounded, time-aware, revocable, and non-transitive unless an explicit validated delegation rule applies.
4. A Workspace grant does not imply Project scope. Any future inheritance rule must be authoritative, versioned, provenance-bearing, bound to the same Principal and active source/target memberships, and incapable of producing a broader capability, action, resource, or time scope than the source assignment.
5. Governance approval, provider readiness, and capability registration do not create grants.
6. Unknown definitions, unsupported versions, missing membership, scope mismatch, or conflicting evidence fail closed.
7. `CAPABILITY_DENY` overrides an otherwise applicable allow; specificity and precedence must be deterministic and auditable.

## Producers, consumers, and mutation ownership

Only the future grant authority mutates assignment records. Membership authorities validate scope eligibility; role/capability catalog owners validate definitions; neither silently writes an assignment. The federated permission resolver consumes expanded, provenance-bearing grants without owning them.

Frontend route-role fallback, active-role projection, AI specialist names, task owner/reviewer labels, and route metadata remain projections or operational vocabulary. Current handler-local/static checks stay authoritative at their call sites during shadow adoption.

Assignment mutations require effective permission for the exact target, scope, definition, and action, plus applicable current security/governance gates. Self-assignment and privilege delegation are denied unless explicitly authorized by a bounded policy; approval evidence alone is insufficient.

Provisioning the first privileged assignment, or recovering administration when no eligible grant administrator remains, is a separate bootstrap operation. It requires an explicitly approved backend policy, current applicable gates, exact subject/scope/definition binding, and auditable provenance. Missing assignments or resolver unavailability can never authorize bootstrap, and bootstrap cannot bypass an explicit deny.

## Evidence, privacy, and audit

Evidence contains assignment and definition references, scope/membership binding, actor, reason code, timestamps, expiry, revision, delegation chain if any, source authority, correlation, and redaction class. It excludes credentials, secrets, raw policy payloads, and unrelated personal or Project data.

Audit covers assignment requests, activation, suspension, revocation, expiry, definition-version changes, expansion results, delegation, denial precedence, stale writes, and rejected privilege escalation. Consumers must be able to reconstruct the exact definition version without copying secret or mutable source data.

## Missing context and decision behavior

Missing assignment is absence of a grant, not an error-based allow. Missing or invalid required evidence produces `INSUFFICIENT_CONTEXT`; an applicable deny or established lack of required grant produces `DENY`; an unknown action/capability mapping produces `UNSUPPORTED_ACTION`. See [Permission Decision Semantics](PERMISSION_DECISION_SEMANTICS.md).

## Idempotency and concurrency

Commands use scope- and actor-bound idempotency keys plus expected `revision`. Duplicate exact commands converge; payload mismatch conflicts. Concurrent grant and revoke must not yield a positive decision under uncertainty. Role-definition updates create new versions and never retroactively rewrite evidence; adoption semantics for existing assignments must be explicit.

## Compatibility and validation

Legacy labels may be emitted as source-qualified comparison signals only. They cannot be imported as durable grants without an approved, auditable migration and subject/scope proof. Initial use is shadow-only and cannot change routes, responses, middleware, or UI access.

Validation covers schema/version, definition existence, role expansion, scope and membership binding, lifecycle, expiry, deny precedence, delegation cycles/depth, idempotency, concurrency, redaction, hostile constraints, cross-scope isolation, and negative proof against label-based authority.

## Deferred implementation questions

- Which existing catalog/version is canonical for each role and capability definition?
- Are explicit denies required in the first implementation, and what exact precedence applies?
- Which Workspace grants, if any, may inherit to Projects?
- How are definition updates migrated without silent privilege widening?
- What delegation depth, expiry, and revocation propagation rules apply?

## Prohibited interpretations

This design does not make labels into grants, register a universal capability owner, approve RBAC, infer privilege from Principal type or access keys, replace current gates, or authorize frontend decisions.

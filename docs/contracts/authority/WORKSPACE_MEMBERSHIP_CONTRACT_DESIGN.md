# Workspace Membership Contract Design

Status: Phase 1B-1B design only; not implemented or approved for runtime adoption.

## Purpose and non-goals

This contract defines the future relationship by which a Principal participates in a Workspace. Workspace owns its membership lifecycle. Membership remains distinct from the existing Workspace lifecycle, Workspace-to-Project relationship, authentication, Project membership, role/grant assignment, permission, approval, and execution.

It does not create a membership store, route, database model, invitation system, ownership transfer, permission resolver, or runtime enforcement. It does not make Workspace the owner of every Project or domain record.

## Canonical owner and identity

The future Workspace membership authority, within the Workspace domain, is the sole canonical lifecycle and mutation owner for Workspace membership. The installed Workspace runtime remains owner of Workspace lifecycle and Workspace-to-Project relationships; those records are inputs, not membership records.

`workspace_membership_id` is opaque, stable, and never reused. The uniqueness boundary is one current membership lineage per `(workspace_id, principal_id)`. Re-admission after terminal revocation requires a new record linked by `predecessor_membership_id` unless a later contract approves restoration.

Required fields:

| Field | Semantics |
|---|---|
| `schema_version` | Supported membership shape |
| `workspace_membership_id` | Stable relationship identity |
| `workspace_id` | Existing authoritative Workspace reference |
| `principal_id` | Authoritative Principal reference |
| `status` | Membership lifecycle state |
| `revision` | Optimistic-concurrency token |
| `effective_from` | Earliest validity time |
| `created_at`, `updated_at` | UTC transition timestamps |
| `provenance` | Bounded invitation/creation source |
| `audit_reference` | Evidence reference for the current transition |

Optional fields include `invited_by_principal_id`, `invitation_reference`, `effective_until`, `suspension_reason_code`, `revocation_reason_code`, `predecessor_membership_id`, and scoped `assignment_references`. Role labels are not embedded proof of grants; assignments reference the separate role/grant contract.

## Lifecycle and invariants

Lifecycle vocabulary is `INVITED`, `ACTIVE`, `SUSPENDED`, `REVOKED`, `EXPIRED`, and `DECLINED`. Only a time-valid `ACTIVE` record may contribute positive Workspace-membership evidence. `REVOKED`, `EXPIRED`, and `DECLINED` are terminal. Suspension never preserves positive authorization.

Minimum transition direction is `INVITED` to `ACTIVE`, `DECLINED`, `REVOKED`, or `EXPIRED`; `ACTIVE` to `SUSPENDED`, `REVOKED`, or `EXPIRED`; and `SUSPENDED` to `ACTIVE`, `REVOKED`, or `EXPIRED`. A terminal record is never reactivated in place. Any additional transition requires a later contract version.

Invariants:

1. Workspace existence and Workspace-to-Project attachment do not prove Principal membership.
2. An access key, owner label, frontend role, approval, task assignment, or Project path does not prove membership.
3. Membership cannot outlive a nonexistent or invalid Workspace or Principal.
4. Membership conveys participation only; permissions require authoritative scoped grants and a composed decision.
5. A Principal has no implicit membership in sibling Workspaces or their Projects.
6. Missing, stale, conflicting, inactive, or unsupported membership evidence fails closed.

## Producers, consumers, mutation and authorization

Only the future Workspace membership authority may invite, activate, suspend, revoke, expire, or decline membership. Principal and Workspace authorities provide validated references; they do not mutate the relationship. The role/grant authority may bind assignments to an active membership but cannot activate it.

Consumers include the future Project-membership authority, grant authority, federated permission resolver, backend administrative surfaces, and redacted audit views. Frontend surfaces consume backend projections only.

Every mutation requires an authenticated active Principal, an effective permission decision for the exact Workspace membership action, and all existing call-site security/governance gates. Self-acceptance may activate only a valid, unexpired invitation bound to the same Principal. Approval alone never authorizes the mutation.

Provisioning the first authorized Workspace membership, or recovering administration when no eligible administrator remains, is a separate bootstrap operation. It requires an explicitly approved Workspace-owned policy, current applicable backend gates, exact Workspace and Principal binding, and auditable provenance. Workspace creation, an owner label, an access key, absent membership, or resolver unavailability can never activate bootstrap implicitly.

## Evidence, provenance, privacy, and audit

Evidence records source authority, actor reference, Workspace and Principal bindings, transition, issued/observed time, expiry when applicable, revision, reason code, correlation, and redaction class. Invitations use opaque references; contact addresses, credentials, tokens, and secrets are excluded. Consumer projections minimize human data.

Auditing covers every attempted and completed transition, assignment binding, stale write, duplicate invitation, denial, expiry, and evidence-redaction event. Audit data must distinguish requester, target Principal, authorizing decision, governance input, mutation result, and current revision.

## Missing context and denial semantics

Unknown Workspace or Principal, absent membership, invalid transition, expired invitation, inactive status, revision conflict, or unavailable authoritative source cannot produce allow. The resolver returns `INSUFFICIENT_CONTEXT` when required authoritative context cannot be established and `DENY` when established evidence proves non-membership or inactive status, per [Permission Decision Semantics](PERMISSION_DECISION_SEMANTICS.md).

## Idempotency and concurrency

Invitation and mutation commands use actor- and Workspace-scoped idempotency keys. Exact replay returns the prior result; payload mismatch conflicts. Expected `revision` is mandatory. Concurrent invitations for the same tuple must converge to one lineage. Revocation or suspension racing with permission evaluation must never be converted into permission; future enforcement needs a defined freshness or recheck boundary.

## Compatibility and validation

Initial use is shadow-only under the [Shadow Adoption and Rollback Plan](SHADOW_ADOPTION_AND_ROLLBACK_PLAN.md). Existing Workspace schemas, lifecycle states, relationship history, route guards, and responses remain unchanged. No legacy Workspace `owner` field or UI owner label is promoted to authenticated membership without explicit authoritative evidence.

Validation covers schema/version, referential integrity, uniqueness, all transitions, expiry, revocation, idempotency, stale writes, cross-Workspace isolation, redaction, audit linkage, and negative proof that Workspace-to-Project relationship records are not treated as Principal membership.

## Deferred implementation questions

- Which Workspace-owned durable store and API will own records without duplicating Workspace lifecycle state?
- How are invitations delivered, expired, and securely bound to Principals?
- Is authenticated Workspace ownership a specialized grant or a separately contracted relationship?
- What consistency boundary is required between revocation and permission evaluation?

## Prohibited interpretations

This design is not current membership, an ownership implementation, a role grant, a permission, an access-key mapping, a Workspace-to-Project relationship replacement, or frontend authority.

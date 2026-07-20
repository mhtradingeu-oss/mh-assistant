# Principal Contract Design

Status: Phase 1B-1B design only; not implemented or approved for runtime adoption.

## Purpose and non-goals

This contract defines the future stable identity of an actor that may participate in authorization decisions. It keeps identity distinct from authentication, membership, role assignment, permission, governance approval, provider readiness, and execution safety.

It does not create login, credential, session, user-directory, membership, role, permission, or execution behavior. An accepted access or control key is authentication evidence only; it is never, by itself, a Principal, membership, role, grant, approval, or permission.

## Canonical owner and boundaries

A future dedicated backend Principal authority is the canonical owner of Principal identity and lifecycle. No such complete authority is proven at this baseline. Existing protected-key boundaries continue to own credential acceptance at their call sites.

The Principal authority may produce identity assertions for consumers, but must not mutate Workspace or Project memberships, grants, governance decisions, provider state, or protected resources. Frontend identity labels and active-role state are projections only.

## Identity and versioning

The conceptual record identity is `principal_id`, an opaque, stable identifier that is never reused. `schema_version` versions record shape; `revision` is a monotonically increasing optimistic-concurrency token. Identity-provider subject identifiers are aliases with provenance, not the canonical ID.

Required fields:

| Field | Semantics |
|---|---|
| `schema_version` | Supported Principal contract version |
| `principal_id` | Stable opaque identity |
| `principal_type` | Exactly `HUMAN`, `SERVICE`, `SYSTEM`, or `INTEGRATION` |
| `status` | Principal lifecycle state |
| `revision` | Concurrency token |
| `created_at`, `updated_at` | UTC lifecycle timestamps |
| `provenance` | Bounded source, issuer, and creation evidence |
| `audit_reference` | Reference to creation or latest transition evidence |

Optional fields include `display_name`, redacted `external_subject_refs`, `service_owner_principal_id`, `integration_owner_reference`, `expires_at`, `suspended_at`, `revoked_at`, and non-secret metadata constrained by schema.

`HUMAN` identifies a natural person. `SERVICE` identifies a workload acting under explicit ownership. `SYSTEM` identifies an MH-OS internal actor with narrowly declared purpose. `INTEGRATION` identifies an external-system actor. Types cannot be inferred from a generic key or changed merely to widen access.

## Lifecycle and invariants

Lifecycle vocabulary is `PENDING`, `ACTIVE`, `SUSPENDED`, `REVOKED`, and `EXPIRED`. Only `ACTIVE` is eligible to contribute positive identity evidence. `PENDING`, `SUSPENDED`, `REVOKED`, and `EXPIRED` never imply permission. Revocation is terminal for the record; re-entry requires a new Principal identity or an explicitly approved recovery rule.

Minimum transition direction is `PENDING` to `ACTIVE`, `REVOKED`, or `EXPIRED`; `ACTIVE` to `SUSPENDED`, `REVOKED`, or `EXPIRED`; and `SUSPENDED` to `ACTIVE`, `REVOKED`, or `EXPIRED`. `REVOKED` and `EXPIRED` are terminal for that record. Any additional transition requires a later contract version and must not reactivate a terminal record in place.

Invariants:

1. A Principal is not a Project identity, Workspace, customer, AI role, task assignee, provider account, or credential.
2. Authentication proves credential acceptance; it does not establish membership or authorization.
3. Every machine actor has an explicit non-human type and bounded owner/purpose provenance.
4. Aliases cannot silently merge Principals, and deleted or revoked IDs are not reused.
5. Missing, ambiguous, unsupported-version, inactive, or unbound identity evidence fails closed.
6. No secret, token, raw credential, session material, or credential digest appears in the contract or audit evidence.

## Sources, producers, consumers, and mutation ownership

Before adoption, the dedicated Principal authority must be the only producer and mutation owner for canonical Principal records. Authentication adapters may bind validated authentication state to a Principal; they cannot create durable membership or grants as a side effect. Membership and permission components consume a minimal Principal assertion.

Current passive identity context, request actor labels, IP-derived identifiers, access keys, frontend projections, and operational role labels remain compatibility evidence only. They are not promoted into Principal authority.

## Authorization, evidence, and privacy

Principal mutation operations require separately resolved backend authorization and applicable existing security gates. A Principal must not authorize its own activation, privilege widening, type change, or revocation recovery solely by presenting its identity.

Initial provisioning, identity recovery, and the creation of any actor needed to administer the authority system are separate bootstrap operations. A future implementation must bind each operation to an explicitly approved backend provisioning policy, current applicable gates, a named mutation owner, and auditable provenance. Absence of a Principal or permission decision is never bootstrap authorization, and bootstrap cannot be an ordinary resolver fallback.

Evidence must carry source authority, evidence type, subject binding, issued/observed time, optional expiry, schema version, correlation reference, and redaction classification. Consumers receive the minimum fields needed. Human-facing data is minimized; external subject references are masked or pseudonymized. Raw credentials and secrets are prohibited.

## Missing context and denial semantics

No Principal assertion, ambiguous binding, inactive status, unsupported type/version, expired evidence, or source failure yields `INSUFFICIENT_CONTEXT` or `DENY` according to [Permission Decision Semantics](PERMISSION_DECISION_SEMANTICS.md). None may fall back to an anonymous, admin, owner, or human Principal.

## Idempotency and concurrency

Creation uses a caller-supplied idempotency key scoped to the authoritative issuer. Repeating the same request returns the same logical result; a changed payload with the same key conflicts. Mutations require expected `revision`; stale writes fail without partial mutation. Concurrent alias claims must resolve to at most one Principal and produce auditable conflict evidence.

## Compatibility, audit, and validation

Compatibility adapters remain read-only and provenance-labeled. They cannot convert an access key, UI role, route label, or request actor string into durable Principal authority. Adoption must preserve all current response and enforcement behavior until separately approved.

Audit must cover creation, alias binding/unbinding, activation, suspension, revocation, expiry, owner changes for machine actors, denied mutations, and concurrency conflicts without sensitive payloads.

Validation requires schema/version checks, type/status transitions, identifier immutability, alias uniqueness, redaction, expiry, hostile input, replay/idempotency, concurrency, and proof that all existing gates remain unchanged during shadow use.

## Deferred implementation questions

- Which backend component and durable store will own Principal records?
- Which authenticators may bind which Principal types, with what freshness and revocation rules?
- What recovery and identity-linking process is independently authorized?
- What retention and erasure rules apply to human identity provenance?

## Prohibited interpretations

This design must not be read as proof of implementation, authentication migration, user management, automatic Principal creation, frontend authority, access-key membership, role assignment, permission, governance approval, or execution authority.

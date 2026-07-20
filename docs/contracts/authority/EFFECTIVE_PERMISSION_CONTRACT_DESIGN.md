# Effective Permission Contract Design

Status: Phase 1B-1B design only; no composite resolver is currently proven or implemented.

## Purpose and non-goals

This contract defines a future federated, compositional decision envelope. The resolver consumes evidence from existing and future canonical owners; it does not become a universal store, mutate source domains, execute actions, or replace installed enforcement.

Authentication, Principal identity, Workspace membership, Project membership, role/capability grants, resource authorization, governance approval, provider readiness, and execution safety remain independent dimensions. Passing one never implies the others.

## Canonical owner and conceptual flow

A future backend effective-permission resolver owns normalization and composition of a permission decision only. Every evidence owner retains its own mutation and validation authority. Existing route guards, protected-key checks, runtime-security enforcement, governance mutation gates, provider execution gates, handler-local checks, and Project isolation safeguards remain authoritative at their current call sites.

The required conceptual input is:

```text
Principal
→ authentication state
→ Workspace membership
→ Project membership
→ scoped role/capability grants
→ resource
→ action
→ required scope
→ governance policy
→ approval evidence
→ provider/execution constraints
→ decision
```

## Request identity, versioning, and fields

`decision_request_id` is caller-generated and unique within its issuer. `contract_version` identifies request/response semantics. Repeated evaluation may produce a new `decision_id` because source evidence can change; idempotent replay rules are explicit below.

Required request fields:

| Field | Semantics |
|---|---|
| `contract_version` | Supported resolver contract version |
| `decision_request_id`, `requested_at` | Correlation and UTC evaluation time |
| `principal_assertion` | Typed Principal reference plus provenance |
| `authentication_state` | Accepted/rejected/unknown state, method class, freshness, issuer; no credential |
| `workspace_context` | Workspace reference and membership evidence reference |
| `project_context` | Required for Project scope; Project and membership evidence references |
| `grant_context` | Scoped assignment evidence references |
| `resource` | Canonical resource type, ID, owning scope, and version when relevant |
| `action` | Canonical requested operation |
| `required_scope` | Exact scope type and identifiers |
| `governance_context` | Applicable policy and approval evidence references or explicit not-applicable result |
| `execution_context` | Provider/readiness/safety constraint evidence or explicit not-applicable result |

Optional fields include resource attributes permitted by schema, purpose, request-channel class, risk classification, expected evidence revisions, and caller trace reference. Optional absence cannot satisfy a required dimension.

An explicit not-applicable disposition is valid only when produced by the canonical, versioned resource/action/scope contract or its authoritative policy owner and carried with provenance. Caller omission, caller assertion, adapter default, frontend state, or source failure cannot mark governance, Project, provider, execution, or any other required dimension as not applicable.

## Decision output

Required response fields:

| Field | Semantics |
|---|---|
| `contract_version`, `decision_id`, `decision_request_id` | Version and correlation |
| `outcome` | `ALLOW`, `DENY`, `REQUIRES_APPROVAL`, `INSUFFICIENT_CONTEXT`, or `UNSUPPORTED_ACTION` |
| `reason_codes` | Stable, ordered, non-sensitive reasons |
| `evaluated_at` | UTC evaluation time |
| `scope` | Exact evaluated Workspace/Project/resource scope |
| `evidence_summary` | Redacted source-qualified references and dispositions |
| `policy_references` | Versions of composition rules used |
| `valid_until` | Earliest safe expiry; never open-ended by omission |
| `shadow` | Must be `true` during initial adoption |
| `enforcement_effect` | Must be `NONE` during initial adoption |
| `audit_reference` | Redacted decision evidence link |

Optional output fields include `approval_requirement`, `unsupported_dimension`, `missing_context`, `comparison_reference`, and `confidence` for observation quality. Confidence never changes outcome or widens access.

## Composition invariants

1. `ALLOW` requires affirmative, compatible, current evidence for every applicable dimension.
2. Any authoritative denial yields `DENY`; deny overrides allow and approval evidence.
3. `REQUIRES_APPROVAL` applies only when other required dimensions are sufficient and a valid policy requires approval that is absent or incomplete.
4. Approval evidence can satisfy only its bound governance requirement; it is not permission.
5. Missing, ambiguous, stale, conflicting, unavailable, or unsupported-version required evidence never yields `ALLOW`.
6. `UNSUPPORTED_ACTION` means the resolver cannot map the resource/action contract, not that the action is harmless.
7. Scope is exact; no sibling Workspace/Project, broader resource, or alternate action is implied.
8. Path containment and route classification may contribute evidence but cannot prove subject authorization.
9. Provider readiness cannot cure missing identity or grants; permission cannot cure provider or execution denial.
10. Frontend state is never an authoritative input.
11. Applicability is authoritative evidence: a dimension is skipped only when a source-qualified, versioned contract or policy proves it does not apply.

Detailed precedence and transport guidance are in [Permission Decision Semantics](PERMISSION_DECISION_SEMANTICS.md).

## Sources, producer/consumer boundaries, and mutation ownership

The resolver reads or receives validated evidence from authentication, Principal, Workspace, Workspace membership, Project identity/relationship, Project membership, grant, route classification, governance, provider, runtime-security, and resource-domain owners. The [Authority Source and Evidence Map](AUTHORITY_SOURCE_AND_EVIDENCE_MAP.md) distinguishes current sources from future gaps.

The resolver owns only its immutable decision/audit envelope. It cannot activate a Principal, change membership or grants, create approval, configure providers, change resource state, or perform the requested action. Protected handlers remain mutation owners after all current gates pass.

Initial consumers are shadow observation, comparison, audit, and operator review. No frontend or backend caller may enforce the shadow outcome until separately approved.

## Evidence, provenance, privacy, and audit

Each evidence item carries source authority, evidence type, subject/scope/resource/action binding, schema and source revision, observation/issue time, expiry, disposition, correlation reference, and redaction class. Evidence is bounded to the request. Raw credentials, secrets, tokens, provider configuration, approval contents, personal data beyond minimal identifiers, and unrestricted resource payloads are prohibited.

The audit record must reconstruct inputs by safe references, policy versions, precedence, reasons, outcome, comparison with current behavior, freshness, and errors. It must clearly label shadow evidence as non-enforcing.

## Missing context, denial, and validation

Missing-context and denial behavior follows the companion semantics contract and fails closed. Transport status mapping is deferred and cannot alter current responses during shadow mode.

Validation covers contract/schema versions; enumerations; exact subject, action, resource, and scope binding; evidence freshness; all outcome/precedence combinations; deny override; approval binding; unknown action; unavailable sources; cross-Workspace/Project isolation; redaction; replay; audit correlation; and equivalence/non-equivalence cases for current gates.

## Idempotency and concurrency

Evaluation is side-effect free. Identical requests with the same pinned evidence revisions and policy versions must yield semantically identical outcomes. A reused request ID with changed input conflicts. `valid_until` is bounded by the earliest input expiry. If source state changes or cannot be atomically observed, the resolver returns non-allow or marks the result invalid; later enforcement would require revalidation immediately before mutation.

## Compatibility and adoption

The first adoption is shadow-only under the [Shadow Adoption and Rollback Plan](SHADOW_ADOPTION_AND_ROLLBACK_PLAN.md). Shadow evaluation runs after or alongside current evidence collection, does not block or allow requests, does not change status/body/headers/timing guarantees, and cannot be used as fallback when a current guard denies or errors.

## Deferred implementation questions

- Which backend component hosts the resolver without becoming a duplicate authority?
- What canonical resource/action namespace and policy-version owner are selected?
- What consistency/freshness guarantees are required before any enforcement use?
- How are current heterogeneous denials compared without normalizing production responses prematurely?
- Which actions require Project context versus Workspace-only context?

## Prohibited interpretations

This contract is not implemented authorization, a universal permission database, enforcement migration, an allow fallback, a bypass, an approval service, provider readiness, execution authority, or frontend permission logic.

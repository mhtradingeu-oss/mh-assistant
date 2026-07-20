# Permission Decision Semantics

Status: Phase 1B-1B design only; these normalized outcomes are not current response or enforcement semantics.

## Purpose and non-goals

This contract defines deterministic future outcome meanings for [Effective Permission Contract Design](EFFECTIVE_PERMISSION_CONTRACT_DESIGN.md). It does not remap HTTP statuses, alter current denial bodies, replace gates, or authorize execution.

## Outcome vocabulary

| Outcome | Contract meaning | Never means |
|---|---|---|
| `ALLOW` | Every applicable required dimension has current, compatible, affirmative authoritative evidence | The action executed, will remain allowed, or may bypass a current gate |
| `DENY` | Authoritative evidence or policy establishes prohibition, ineligibility, invalid state, revocation, or mismatch | Missing evidence was guessed, or denial may be overridden by UI/approval |
| `REQUIRES_APPROVAL` | All other determinable prerequisites are sufficient and an applicable governance policy requires absent/incomplete approval | Approval alone would create membership, grants, provider readiness, or execution authority |
| `INSUFFICIENT_CONTEXT` | A required authoritative dimension is absent, ambiguous, stale, unavailable, conflicting, or unsupported in version | Retry should allow, anonymous/admin fallback, or a harmless action |
| `UNSUPPORTED_ACTION` | Resource/action semantics are not recognized or supported by the resolver contract | The current runtime allows it, it is low-risk, or it may bypass current checks |

All outcomes other than `ALLOW` are non-authorizing. In shadow mode, `ALLOW` is also non-authorizing because `enforcement_effect` is `NONE`.

## Canonical fail-closed rule

The permission resolver is fail-closed. Whenever authoritative evidence for any required decision dimension cannot be established, the outcome can never become `ALLOW`.

`INSUFFICIENT_CONTEXT` is a non-authorizing terminal decision for that evaluation. It carries no partial grant, cannot reuse a prior positive result, and can change only through a new evaluation against newly established authoritative evidence. Missing context is never interpreted as success.

Transport failure, timeout, resolver absence, malformed output, source error, or audit-sink failure cannot become permission. Frontend state cannot supply or compensate for missing authority. Governance approval cannot supply or compensate for missing authentication, Principal, membership, grant, resource, scope, provider, or execution authority. Unknown provider state and unknown execution readiness are insufficient authoritative evidence and can never become permission.

A decision dimension is not applicable only when the canonical, versioned resource/action/scope contract or its authoritative policy owner produces a source-qualified not-applicable disposition. Caller omission, caller assertion, adapter default, frontend projection, or source failure never establishes non-applicability.

## Precedence and composition

When multiple conditions exist, apply this order for the normalized outcome:

1. An applicable authoritative prohibition, revoked/inactive status, scope mismatch, explicit deny grant, or safety/provider denial produces `DENY`.
2. If no authoritative denial is established but resource/action semantics are unknown, produce `UNSUPPORTED_ACTION`.
3. If semantics are supported but any non-governance required context is missing, invalid, ambiguous, stale, unavailable, or conflicting, produce `INSUFFICIENT_CONTEXT`.
4. If all other prerequisites are sufficient and governance policy requires approval that is absent, pending, expired, revoked, consumed, or incorrectly bound, produce `REQUIRES_APPROVAL` only when the condition is remediable by obtaining valid approval. A definitively rejected or prohibited approval condition produces `DENY`.
5. Produce `ALLOW` only after every applicable dimension affirmatively passes.

The resolver records all safe reason codes even when precedence selects one outcome. It must not conceal an authoritative denial behind missing-context or approval language.

## Required reason-code families

Reason codes are stable, non-sensitive, and namespaced. Initial design families are:

- `AUTHENTICATION_*` and `PRINCIPAL_*`;
- `WORKSPACE_MEMBERSHIP_*` and `PROJECT_MEMBERSHIP_*`;
- `GRANT_*`, `RESOURCE_*`, `ACTION_*`, and `SCOPE_*`;
- `GOVERNANCE_*` and `APPROVAL_*`;
- `PROVIDER_*`, `EXECUTION_*`, and `RUNTIME_SECURITY_*`;
- `EVIDENCE_*`, `SOURCE_*`, `VERSION_*`, and `POLICY_*`.

Reasons must not reveal whether unrelated Principals, Workspaces, Projects, memberships, credentials, approvals, or secret configuration exist. Public-facing projection may use a coarser reason than restricted audit evidence.

## Missing-context behavior

Required context is determined from the canonical resource/action/scope contract, not from whichever fields the caller supplied. Omission never makes a dimension not applicable. Source timeout, parse failure, unsupported version, unverifiable provenance, stale evidence, multiple conflicting records, or redaction that removes a required binding is insufficient context and cannot allow.

If authoritative evidence affirmatively proves absence or inactive state—for example, a revoked membership—that is `DENY`, not merely `INSUFFICIENT_CONTEXT`.

## Approval semantics

Approval states such as requested, pending, approved, rejected, expired, revoked, consumed, proof-present, gate-passed, mutation-completed, and audited are distinct. Valid approval evidence must bind Principal or authorized actor class, action, resource, scope, policy version, time window, and replay/consumption semantics.

`REQUIRES_APPROVAL` is returned only for a known policy obligation that can be satisfied through its existing governance owner. The resolver neither requests nor records approval mutations. A presence flag, UI indicator, or unrelated approval is not valid evidence.

## Scope, time, and concurrency semantics

Decisions are valid only for the exact Principal, authentication state, Workspace, Project when applicable, memberships, grants, resource version, action, policy versions, execution constraints, and bounded time recorded. No wildcard, sibling, child, or parent scope is implied unless an explicit authoritative policy says so.

`valid_until` is no later than the earliest evidence or policy expiry. Revocation and concurrent mutation invalidate cached positive results. Unknown ordering or partial reads cannot produce `ALLOW`. Future enforcement must revalidate time-sensitive evidence at the protected mutation boundary.

## Idempotency and retries

Re-evaluating the same normalized request against identical pinned evidence and policy versions returns the same semantic outcome. A retry after evidence changes is a new evaluation and may differ. Clients must not translate transport failure, timeout, resolver absence, or malformed output into allow.

## Current-gate compatibility and transport

During shadow adoption, normalized outcomes are observations only. Current middleware and handler outcomes remain authoritative and are returned unchanged. A mismatch is recorded with bounded evidence, never resolved by changing the live result.

Future transport mappings, error bodies, caching, and user messages are deferred. `DENY`, `INSUFFICIENT_CONTEXT`, and `UNSUPPORTED_ACTION` must not disclose sensitive existence information. Frontend display may explain a backend decision but cannot recompute or override it.

## Evidence, privacy, audit, and validation

Each outcome records source-qualified evidence references, dispositions, policy versions, evaluation time, scope, and reason codes. Restricted evidence and public projection are separated. Raw credentials, secrets, tokens, unredacted approval payloads, and unrestricted resource data are prohibited.

Validation includes a complete decision table; deny precedence; approval-only remediation; missing versus affirmatively absent context; unsupported action; source failures; stale/revoked evidence; cross-scope attempts; concurrency; stable reason codes; redaction/non-disclosure; and proof that shadow outcomes cannot influence current responses.

## Deferred implementation questions

- Which exact reason codes and transport projections are stable public API?
- When does rejected approval map to `DENY` versus a policy-specific terminal outcome represented as `DENY` plus reason?
- What freshness and cache invalidation guarantees are required by action risk class?
- How are multiple independent provider or execution constraints summarized without leaking configuration?

## Prohibited interpretations

These outcomes are not current runtime claims. `ALLOW` is not execution, `REQUIRES_APPROVAL` is not partial permission, missing context is not permission, unsupported is not safe, and frontend rendering is not authority.

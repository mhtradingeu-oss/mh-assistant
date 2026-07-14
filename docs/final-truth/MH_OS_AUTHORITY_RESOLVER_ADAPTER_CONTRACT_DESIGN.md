# MH-OS Authority Resolver Adapter Contract Design

## Status

BE-6.2 architecture design proposal only.

No runtime implementation, permission runtime, authorization migration, or enforcement change is created by this document.

Existing backend security authorities remain authoritative.

---

# 1. Objective

Define a passive adapter contract that can consume current runtime decisions and a future Authority Resolver decision, normalize their evidence, and produce a shadow-only comparison record.

The adapter is an observer. It is not an authority.

---

# 2. Truth Scan Audit

## 2.1 Verified runtime foundations

| Runtime source | Verified current responsibility | Adapter implication |
|---|---|---|
| `lib/security/identity-adapter.js` | Attaches `req.mhAuthorityContext`, sanitizes evidence, and records non-authoritative shadow observations | Reuse its passive context and sanitization boundary; do not replace it |
| `lib/security/runtime-security-enforcement.js` | Produces the current sensitive-route decision and exposes a failure-isolated `observeDecision` callback | Current safe observation seam |
| `lib/security/protected-route-authority.js` | Allows or terminates protected routes from proof and route configuration | Its returned decision must be observed after evaluation, never recalculated by the adapter |
| `lib/security/provider-execution-gate.js` | Classifies provider-facing actions; runtime security currently consumes the classification | Treat the classification as source evidence, not as a substitute future permission decision |
| `lib/security/governance-mutation-gate.js` and the `server.js` wrapper | Evaluate policy and approval state; the wrapper allows or returns `403` | Governance outcome must remain authoritative and independently observable |
| `lib/security/route-permission-catalog.js` | Classifies route access, scope, risk, and status | Classification is evidence; it is not by itself an observed request outcome |

## 2.2 Verified context limitations

The current `mh-authority-context-v1` is deliberately incomplete:

- `workspace_id` is always `null`;
- `roles` and `permissions` are empty;
- governance and provider decision fields are not populated by current call sites;
- only runtime-security decisions use the existing shared shadow observer;
- protected-route middleware is registered before the write/read identity context middleware for its listed routes;
- protected-route denials and governance decisions are not currently copied into `req.mhAuthorityContext`.

Therefore absence of future context or decision evidence must never be interpreted as permission, membership, scope, or approval.

---

# 3. Adapter Responsibility

The Authority Resolver Adapter must:

- accept already-produced current runtime decisions;
- accept an already-produced future Authority Resolver decision when one exists;
- preserve source identity and decision provenance;
- normalize comparison data without changing source semantics;
- emit a deterministic shadow comparison record;
- fail to `UNTRUSTED` when comparison integrity cannot be established;
- remain side-effect free apart from bounded shadow telemetry supplied by its caller.

The adapter must never:

- authenticate a principal;
- authorize or deny a request;
- execute an action;
- calculate membership, scope, capability, or permission grants;
- treat route classification as a grant;
- modify policy or approval state;
- bypass governance or provider gates;
- call `next()`, write an HTTP response, or invoke a provider;
- become frontend authority;
- create RBAC.

---

# 4. Input Contract

Conceptual input:

```text
AuthorityResolverAdapterInput

contract_version
observation_id
observed_at
principal_context
workspace_context
membership_context
scope_context
capability_context
permission_context
policy_context
current_runtime_decision
future_authority_resolver_decision
evidence
```

## 4.1 Context envelope

Every context field uses the same envelope:

```text
ContextEnvelope

status            PRESENT | ABSENT | UNTRUSTED
value             object | null
source            string | null
evidence_refs     string[]
```

Rules:

- `ABSENT` is explicit and is never equivalent to an empty grant set.
- `UNTRUSTED` means supplied data failed provenance, validation, freshness, or correlation checks.
- The adapter may copy and normalize a `PRESENT` value, but may not enrich it by inference.
- Frontend state, actor labels, and shared credential text cannot establish membership or permission.
- Credentials and secrets are forbidden from all context and evidence values.

## 4.2 Required context meanings

| Input | Meaning | Current safe default when unavailable |
|---|---|---|
| `principal_context` | Existing authenticated principal assertion | `ABSENT`; never infer a human principal |
| `workspace_context` | Future authoritative workspace boundary | `ABSENT`; never synthesize a workspace from a project |
| `membership_context` | Future principal-to-workspace membership assertion | `ABSENT`; never derive from role strings |
| `scope_context` | Future bounded workspace, project, capability, and data scopes | `ABSENT`; route required scope is evidence only |
| `capability_context` | Future capability identity, provider, risk, and execution boundary | `ABSENT`; provider classification may be referenced as current evidence |
| `permission_context` | Future action/resource permission evaluation context | `ABSENT`; no permission runtime exists yet |
| `policy_context` | Applicable governance and provider policy snapshot | `ABSENT` unless an authoritative source supplies it |

## 4.3 Current runtime decision

```text
ObservedRuntimeDecision

decision_id
source_authority
outcome           ALLOW | DENY | NOT_APPLICABLE | UNKNOWN
enforced          boolean
reason
action
resource
project_id
policy_reference
observed_at
evidence_refs
```

Rules:

- The source decision is captured after the existing authority evaluates it.
- The adapter must not call the current authority a second time.
- `ALLOW` means only that the named authority allowed its own boundary; it is not a global grant.
- A route catalog classification is attached as evidence and cannot populate `outcome` by itself.
- When more than one authority applies, each decision retains its own record. A request-level current outcome is `DENY` if any enforcing authority denies, and is `UNKNOWN` unless observation completeness for all applicable authorities is proven.

## 4.4 Future Authority Resolver decision

```text
ObservedResolverDecision

decision_id
resolver_version
decision          ALLOW | DENY | REVIEW_REQUIRED | POLICY_BLOCKED | UNTRUSTED
reason
action
resource
evaluated_at
evidence_refs
```

This is an input produced elsewhere. The adapter does not calculate it. Until a future resolver exists, its status is absent and the comparison is `UNTRUSTED`.

## 4.5 Evidence

Evidence records follow `MH_OS_PERMISSION_EVIDENCE_CONTRACT_DESIGN.md` and must include stable references to source authority, reason, policy context, provenance, confidence, and audit reference when available.

Evidence must be:

- sanitized before recording;
- correlated to the same action and resource;
- bounded in size and retention;
- immutable within one comparison;
- explicit about missing source, time, or version;
- free of credentials, tokens, cookies, raw authorization headers, and untrusted actor identity claims.

---

# 5. Output Contract

```text
AuthorityResolverAdapterResult

contract_version
observation_id
mode                         shadow
authoritative                false
resolver_decision
confidence
evidence
comparison_status
comparison_reasons
current_runtime_summary
created_at
```

## 5.1 Resolver decision

`resolver_decision` is a normalized copy of the supplied future decision. It is not an adapter authorization outcome. It must be `UNTRUSTED` when a valid future decision was not supplied.

## 5.2 Confidence

```text
confidence

level          HIGH | MEDIUM | LOW | NONE
score          number from 0 through 1
reasons        string[]
```

Confidence describes comparison evidence quality only. It must never increase the authority of either decision.

Minimum rules:

- `HIGH`: both decisions are versioned, correlated, complete for applicable authorities, and supported by trustworthy evidence;
- `MEDIUM`: decisions correlate, but non-material context or evidence is incomplete;
- `LOW`: comparison is possible but source completeness, freshness, or coverage is weak;
- `NONE`: either side is missing, malformed, uncorrelated, or untrusted.

## 5.3 Evidence output

Output evidence contains sanitized references and material comparison facts. It must not duplicate secret-bearing request data or mutable policy documents.

## 5.4 Comparison status

The only BE-6 comparison states are:

```text
MATCH
PARTIAL
CONFLICTING
UNTRUSTED
```

Their deterministic rules are defined by `MH_OS_SHADOW_DECISION_ADAPTER_DESIGN.md`.

---

# 6. Failure Contract

Adapter failures must be fail-passive:

- never alter the current runtime decision;
- never throw across the observation boundary;
- never delay execution on external I/O;
- return or record `UNTRUSTED` when safe;
- otherwise emit no comparison and allow existing runtime control flow to continue unchanged.

`UNTRUSTED` is a telemetry state, not a runtime denial.

---

# 7. Review

## 7.1 Contract review result

The contract preserves all completed architecture foundations:

- principal, workspace, membership, scope, capability, permission, policy, and evidence remain separate contexts;
- backend gates remain authoritative;
- frontend data cannot establish authority;
- no role-to-permission engine or RBAC model is introduced;
- no permission runtime is created;
- no execution or governance bypass is exposed.

## 7.2 Acceptance criteria

BE-6.2 is ready for architecture approval when reviewers confirm:

- every source decision is observed rather than recomputed;
- absence and distrust cannot become grants;
- `resolver_decision` cannot be mistaken for enforcement;
- comparison confidence measures evidence, not authority;
- output is explicitly shadow and non-authoritative.

---

# 8. Decision Gate

Documentation review is permitted.

Runtime implementation and documentation commit remain subject to explicit approval.

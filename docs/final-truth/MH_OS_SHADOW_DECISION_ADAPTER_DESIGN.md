# MH-OS Shadow Decision Adapter Design

## Status

BE-6.3 architecture design proposal only.

No runtime behavior is changed.

---

# 1. Objective

Define a deterministic, shadow-only comparison between:

```text
Current Runtime Decision

VS

Future Authority Resolver Decision
```

The comparison explains alignment. It cannot control the request.

---

# 2. Audit

Current runtime outcomes have different shapes and lifecycles:

- runtime security returns `enforced`, `allowed`, `reason`, route classification, and provider classification;
- protected-route authority returns an allow/deny result with status, code, configured authority, and proof presence;
- governance returns an allow/deny result with decision, reason, response, and details;
- provider execution produces a classification currently consumed by runtime security;
- the route permission catalog produces classification metadata, not a final request outcome.

Only the runtime-security middleware currently exposes a failure-isolated observer. Consequently, decision completeness must be proved per request rather than assumed.

---

# 3. Normalization Boundary

The adapter may map source-specific vocabulary into comparison vocabulary without changing meaning:

| Source fact | Comparison outcome |
|---|---|
| Existing enforcing decision with `allowed: true` | `ALLOW` for that source boundary |
| Existing enforcing decision with `allowed: false` | `DENY` for that source boundary |
| Existing decision explicitly outside its applicable boundary | `NOT_APPLICABLE` |
| Missing, malformed, contradictory, or incomplete existing observations | `UNKNOWN` |
| Future `ALLOW` | `ALLOW` |
| Future `DENY` or `POLICY_BLOCKED` | Denying terminal effect, while preserving the original decision label |
| Future `REVIEW_REQUIRED` | Non-terminal; never normalize to `ALLOW` |
| Future `UNTRUSTED` or absent decision | `UNKNOWN` |

Normalization must preserve the original source payload as sanitized referenced evidence.

---

# 4. Comparison Dimensions

The adapter compares only correlated observations across these material dimensions:

- principal identity and authentication provenance;
- workspace and project boundary;
- membership status;
- action and resource identity;
- required and supplied scopes;
- capability and provider boundary;
- policy and approval state;
- terminal effect;
- evidence provenance, freshness, and source version;
- applicable-authority observation coverage.

No missing dimension may be inferred from another dimension.

---

# 5. Comparison States

State precedence is evaluated in this order:

```text
UNTRUSTED
CONFLICTING
PARTIAL
MATCH
```

## 5.1 UNTRUSTED

Return `UNTRUSTED` when a reliable comparison cannot be made, including when:

- either decision is absent, malformed, or explicitly untrusted;
- observation identifiers, action, resource, workspace, or project cannot be correlated;
- an applicable current authority may have run but its outcome was not observed;
- current authoritative sources disagree and the effective runtime outcome is not captured;
- evidence provenance or decision version is missing where required;
- context contains secret-bearing, frontend-authoritative, or actor-inferred claims;
- a future `REVIEW_REQUIRED` decision cannot be compared to a known current terminal effect safely.

`UNTRUSTED` never denies or allows the request.

## 5.2 CONFLICTING

Return `CONFLICTING` only when trusted, correlated decisions have materially opposite effects or boundaries, including:

- current runtime denies while the future resolver says `ALLOW`;
- current runtime allows its complete applicable chain while the future resolver says `DENY` or `POLICY_BLOCKED`;
- the future decision would omit a governance, approval, provider, workspace, or project boundary that the current decision enforced;
- both use the same terminal label but target materially different principal, action, resource, workspace, or project boundaries.

An allow-expansion conflict is highest review priority, but it still cannot alter runtime behavior.

## 5.3 PARTIAL

Return `PARTIAL` when trusted, correlated decisions have the same terminal effect but differ in non-terminal or coverage details, including:

- matching allow or deny effect with different reasons;
- incomplete non-material evidence that does not prevent correlation;
- one side has a more specific scope or capability description without creating an opposite effect;
- policy, risk, or source classifications differ while the enforced boundary remains equivalent;
- only a proven subset of the applicable decision chain is being compared and the subset itself agrees.

`PARTIAL` must list every known gap and may not be promoted to `MATCH` by confidence scoring.

## 5.4 MATCH

Return `MATCH` only when:

- both observations are trusted and correlated;
- terminal effects agree;
- principal, workspace/project, action, resource, scope, capability/provider, and material policy boundaries agree;
- all applicable current authority decisions were observed;
- evidence references are sufficient to reproduce the comparison;
- no material difference remains.

Matching one gate in a multi-gate request is not a request-level `MATCH`.

---

# 6. Decision Matrix

| Current effective outcome | Future resolver decision | Required comparison state |
|---|---|---|
| `UNKNOWN` | Any | `UNTRUSTED` |
| Any | absent or `UNTRUSTED` | `UNTRUSTED` |
| `ALLOW` | `ALLOW` | `MATCH` or `PARTIAL`, based on material alignment and completeness |
| `DENY` | `DENY` or `POLICY_BLOCKED` | `MATCH` or `PARTIAL`, based on reason and boundary alignment |
| `ALLOW` | `DENY` or `POLICY_BLOCKED` | `CONFLICTING` |
| `DENY` | `ALLOW` | `CONFLICTING` |
| Known terminal outcome | `REVIEW_REQUIRED` | `UNTRUSTED` unless an approved future contract defines equivalent non-terminal semantics |

---

# 7. Shadow Result

Example shape:

```text
ShadowDecisionComparison

mode                  shadow
authoritative         false
current_runtime_summary
resolver_decision
comparison_status
comparison_reasons
material_differences
confidence
evidence
```

Every result must retain source-specific decisions and explicitly state that the current runtime outcome controlled execution.

---

# 8. Safety and Isolation

The comparison function must be:

- pure for a supplied immutable snapshot;
- bounded in execution time and evidence size;
- free of provider, database, policy mutation, approval, and network calls;
- isolated so exceptions cannot reach current gate control flow;
- unable to return middleware control values or HTTP responses;
- unavailable as a frontend authorization API.

---

# 9. Review

Review confirms that the four required states are exhaustive for BE-6 shadow use:

- `MATCH` proves material alignment;
- `PARTIAL` exposes non-opposite gaps;
- `CONFLICTING` identifies trusted material opposition;
- `UNTRUSTED` contains missing, unsafe, or incomparable evidence.

No comparison state is an authorization state.

---

# 10. Decision Gate

Documentation review is permitted.

Runtime implementation and documentation commit remain subject to explicit approval.

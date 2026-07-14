# MH-OS Authority Drift Shadow Model

## Status

BE-7.3 shadow model design complete.

Documentation only. No runtime observer, resolver, enforcement migration, permission system, RBAC, database, or frontend authority is implemented.

Existing backend authority remains controlling.

---

# 1. Objective

Define a deterministic shadow-only model that compares a captured current authority decision with a captured expected Authority decision and produces an observability result.

```text
Current Decision

VS

Expected Authority Decision

↓

Drift Result
```

The result explains alignment, material drift, and comparison integrity. It cannot control execution.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

Current runtime authorities have different decision shapes and incomplete shared observation. The future Authority Resolver has no runtime decision producer. Therefore current live comparisons are expected to be `UNTRUSTED` until both decision sides, correlation, evidence, and applicable-authority coverage exist.

## 2.2 Scope

This model defines normalization, comparison order, result states, risk mapping, and review semantics only. It does not approve observer wiring or storage.

## 2.3 Authority ownership

Current decisions remain owned by:

- runtime-security enforcement;
- protected-route authority;
- provider execution gate and its current enforcing callers;
- governance mutation gate;
- route-permission catalog for classification only.

The expected decision is produced elsewhere by a future non-authoritative resolver. The drift monitor owns only the comparison description.

## 2.4 Safety boundary

Drift monitoring:

- cannot authorize;
- cannot deny;
- cannot execute;
- cannot modify security;
- cannot replace governance.

It also cannot create approvals, call providers, change middleware flow, infer permissions, or make frontend state authoritative.

---

# 3. Inputs

## 3.1 Current Decision

```text
CurrentDecisionSnapshot

observation_id
decision_id
source_authority
source_version
outcome
enforced
reason
principal_reference
workspace_reference
project_reference
action
resource
scope_references
capability_reference
policy_reference
approval_reference
decision_timestamp
evidence_references
applicable_authorities
observed_authorities
```

Rules:

- the snapshot captures the original returned decision after evaluation;
- the monitor may not reevaluate a gate, policy, catalog, or approval store;
- each source retains its own semantics;
- provider and route classifications must be marked non-enforcing unless their current caller supplies the actual enforcing result;
- one observed allow cannot represent a request-level allow when other authorities may apply;
- current request outcome is unknown unless applicable-authority coverage is proven.

## 3.2 Expected Authority Decision

```text
ExpectedAuthorityDecisionSnapshot

observation_id
decision_id
source_authority
resolver_version
decision
reason
principal_reference
workspace_reference
project_reference
action
resource
scope_references
capability_reference
policy_reference
evaluated_at
evidence_references
```

Rules:

- this input is already produced by a future Authority Resolver;
- the monitor does not calculate or enrich it;
- a design document, frontend projection, role label, route classification, or inferred policy cannot substitute for it;
- absent, malformed, unversioned, stale, or uncorrelated input is untrusted;
- expected `ALLOW`, `DENY`, `POLICY_BLOCKED`, and `REVIEW_REQUIRED` remain shadow labels and have no runtime effect.

## 3.3 Evidence and correlation

Both inputs require sanitized stable evidence references. Reliable comparison requires the same observation, principal boundary, workspace/project boundary, action, resource, and relevant decision time.

Correlation cannot be inferred from approximate timestamps, route names, project labels, HTTP status, actor-supplied identity, or frontend state.

---

# 4. Drift Result Contract

```text
AuthorityDriftShadowResult

contract_version
mode
authoritative
observation_id
current_decision
expected_authority_decision
state
drift_record
comparison_reasons
material_differences
evidence_references
applicable_authorities
observed_authorities
current_runtime_controlled_execution
created_at
```

Fixed values:

```text
mode = shadow
authoritative = false
current_runtime_controlled_execution = true
```

`drift_record` is null for a trusted `MATCH`. For another state it follows `MH_OS_AUTHORITY_DRIFT_MONITORING_CONTRACT.md` when a bounded record can be emitted safely.

The result is an observability artifact. It is not an authorization response.

---

# 5. States

State precedence:

```text
UNTRUSTED
HIGH_RISK_DRIFT
LOW_RISK_DRIFT
MATCH
```

The first satisfied state wins. Confidence scoring cannot override state precedence.

## 5.1 `MATCH`

Use `MATCH` only when:

- both decision snapshots are trustworthy, versioned, and correlated;
- terminal effects agree;
- principal, workspace/project, action, resource, scope, capability/provider, and material policy boundaries agree;
- every applicable current authority was observed;
- evidence is sufficient to reproduce the comparison;
- no material or descriptive difference remains.

Matching a single gate in a multi-gate request is not request-level `MATCH`. Absence of an emitted drift record is not itself proof of match.

## 5.2 `LOW_RISK_DRIFT`

Use `LOW_RISK_DRIFT` only for a trustworthy, correlated comparison whose terminal effect and material security boundaries agree, but which has a non-material difference that should be improved or reviewed.

Examples:

- equivalent allow or deny outcomes use different non-material reasons;
- one side has a more specific descriptive risk label without changing execution boundary;
- evidence is complete for material comparison but a non-required audit annotation differs;
- a versioned mapping preserves equivalent semantics while vocabulary differs.

Required properties:

- no allow expansion;
- no governance, approval, protected-route, provider, workspace, project, scope, capability, or permission weakening;
- evidence integrity is sufficient to prove the difference is non-material;
- severity is normally `INFO` or `REVIEW`;
- the primary mismatch type follows the drift monitoring contract.

Missing material evidence is not low-risk drift. Uncertainty cannot be classified as safety.

## 5.3 `HIGH_RISK_DRIFT`

Use `HIGH_RISK_DRIFT` when trustworthy, correlated evidence proves a material boundary or terminal-effect conflict.

Triggers include:

- current complete authority chain denies while expected authority says allow;
- current complete authority chain allows while expected authority says deny or policy-blocked;
- expected authority omits or weakens current governance or approval requirements;
- workspace, project, resource, or required scope materially differs;
- capability identity, provider boundary, execution mode, or risk boundary materially differs;
- expected authority omits a current protected-route or provider-execution boundary;
- the same terminal label applies to materially different principal, action, or resource boundaries.

Risk priority:

- potential allow expansion across a current denial is `CRITICAL`;
- other trusted material conflicts are at least `HIGH`;
- the existing current decision still controls execution;
- the record requests investigation only and cannot block or permit the request.

## 5.4 `UNTRUSTED`

Use `UNTRUSTED` when reliable comparison is not possible.

Triggers include:

- either decision is absent, malformed, or explicitly untrusted;
- the future decision producer does not exist;
- action, resource, principal, workspace/project, or observation correlation fails;
- an applicable current authority may have run but was not observed;
- current authority outcomes disagree and the effective runtime result is missing;
- material evidence or source versions are missing;
- evidence is stale, mutable without a stable reference, secret-bearing, frontend-authoritative, actor-inferred, or of invalid provenance;
- expected `REVIEW_REQUIRED` lacks an approved equivalence to a current terminal effect;
- monitor errors prevent a safe comparison.

`UNTRUSTED` is not deny, review-required enforcement, or permission failure. It reports that observability evidence is not trustworthy enough to claim match or drift.

---

# 6. Deterministic Evaluation

```text
1. Validate supplied snapshots and evidence safety.
2. Validate observation, boundary, action, and resource correlation.
3. Prove applicable current authority coverage.
4. Normalize source outcomes without changing source semantics.
5. Compare material scope, capability, policy, approval, and terminal effect.
6. Compare non-material reason and vocabulary differences.
7. Produce the first applicable state by precedence.
8. Attach a bounded DriftRecord when state is not MATCH and safe emission is possible.
9. Preserve that current runtime controlled execution.
```

The comparison must be pure for supplied immutable snapshots and must not perform network, provider, database, filesystem, approval, policy, or gate calls.

---

# 7. Decision Matrix

| Current decision | Expected decision | Evidence and boundary condition | State |
|---|---|---|---|
| Unknown or incomplete | Any | Material current coverage missing | `UNTRUSTED` |
| Any | Absent or untrusted | Expected decision unavailable | `UNTRUSTED` |
| Allow | Allow | Complete material alignment | `MATCH` |
| Deny | Deny or policy-blocked | Complete material alignment | `MATCH` |
| Allow | Allow | Same material boundary, non-material difference | `LOW_RISK_DRIFT` |
| Deny | Deny or policy-blocked | Same terminal boundary, non-material difference | `LOW_RISK_DRIFT` |
| Allow | Deny or policy-blocked | Trusted and correlated | `HIGH_RISK_DRIFT` |
| Deny | Allow | Trusted and correlated; potential allow expansion | `HIGH_RISK_DRIFT` with `CRITICAL` severity |
| Same terminal label | Same label | Material scope, capability, policy, or resource conflict | `HIGH_RISK_DRIFT` |
| Known terminal effect | Review required | No approved semantic equivalence | `UNTRUSTED` |

---

# 8. Drift Type Mapping

| Primary mismatch type | Required shadow state |
|---|---|
| `UNTRUSTED_CONTEXT` | `UNTRUSTED` |
| `MISSING_EVIDENCE` | `UNTRUSTED`, unless a future reviewed policy proves the gap non-material |
| `SCOPE_CONFLICT` | `HIGH_RISK_DRIFT` when trusted; otherwise `UNTRUSTED` |
| `POLICY_CONFLICT` | `HIGH_RISK_DRIFT` when trusted; otherwise `UNTRUSTED` |
| `CAPABILITY_CONFLICT` | `HIGH_RISK_DRIFT` when trusted; otherwise `UNTRUSTED` |
| `DECISION_MISMATCH` | `HIGH_RISK_DRIFT` when trusted; otherwise `UNTRUSTED` |

`LOW_RISK_DRIFT` may use a boundary-specific mismatch type only when evidence proves the difference is descriptive and non-material. The record must explain why the boundary and terminal effect are equivalent.

---

# 9. Compatibility with BE-6

BE-7 does not replace the BE-6 comparison model. It provides a risk-oriented projection of the same evidence-led result:

| BE-6 comparison status | BE-7 drift state |
|---|---|
| `MATCH` | `MATCH` |
| `PARTIAL` | `LOW_RISK_DRIFT` only when material comparison integrity is complete; otherwise `UNTRUSTED` |
| `CONFLICTING` | `HIGH_RISK_DRIFT` |
| `UNTRUSTED` | `UNTRUSTED` |

The stricter state wins. A historical or incomplete `PARTIAL` result cannot be automatically relabeled low risk.

---

# 10. Multi-Authority Current Decision

A request may cross several current boundaries:

```text
Protected Route
Runtime Security
Governance
Provider Classification or Execution Gate
Route Classification Evidence
```

Rules:

- each source decision remains independently visible;
- a current request summary is `DENY` when a captured enforcing authority denies;
- an effective current `ALLOW` requires proof that every applicable enforcing authority was observed and allowed or was not applicable;
- route and provider classification cannot fill a missing enforcing outcome;
- any potentially applicable but unobserved authority makes the request-level comparison `UNTRUSTED`;
- source disagreements must be preserved, not flattened into a convenient result.

---

# 11. Safety and Failure Isolation

The shadow model must be:

- unable to call `next()`, write an HTTP response, or return an enforcement instruction;
- unable to authenticate a principal or grant membership, scope, capability, or permission;
- unable to create, approve, reject, or modify approval evidence;
- unable to invoke a provider, queue, workflow, mutation, or destructive action;
- unable to alter governance policy, route policy, middleware order, or security configuration;
- unavailable to the frontend as an access-control source;
- bounded in time, size, and cardinality;
- free of secret-bearing evidence;
- failure-isolated so exceptions do not reach current control flow.

If monitoring fails, the existing current authority decision proceeds unchanged. Monitoring failure is not converted into allow or deny.

---

# 12. Review Scenarios

## 12.1 Current denial and expected allow

Provided every applicable current decision and both decision contexts are trustworthy and correlated:

- state: `HIGH_RISK_DRIFT`;
- mismatch: `DECISION_MISMATCH` or the more specific boundary conflict;
- severity: `CRITICAL`;
- execution: current denial remains controlling.

## 12.2 Matching outcomes with missing governance observation

- state: `UNTRUSTED`;
- mismatch: `UNTRUSTED_CONTEXT` or `MISSING_EVIDENCE` under the contract precedence;
- execution: current gates remain controlling;
- reason: matching visible outcomes cannot prove request-level match.

## 12.3 Equivalent denial with descriptive reason difference

When material boundaries, evidence, and coverage are complete:

- state: `LOW_RISK_DRIFT`;
- severity: `INFO` or `REVIEW`;
- execution: current denial remains controlling.

## 12.4 No future resolver decision

- state: `UNTRUSTED`;
- mismatch: `UNTRUSTED_CONTEXT`;
- evidence gap: `compared_decision_missing`;
- execution: existing backend authority remains unchanged.

---

# 13. BE-7.3 Review Result

The model distinguishes proven alignment, non-material drift, trusted material conflict, and insufficient comparison integrity without creating an enforcement result.

BE-7.3 is complete as documentation. The next safe action is an evidence coverage review that identifies complete observation paths, missing paths, and required future passive adapters.

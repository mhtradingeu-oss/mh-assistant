# MH-OS Authority Drift Monitoring Contract

## Status

BE-7.2 contract design complete.

Documentation only. The contract defines shadow observability and creates no runtime implementation, database, permission enforcement, RBAC, or frontend authority.

Existing backend authorities remain authoritative.

---

# 1. Objective

Define a bounded, explainable record for differences between an already-produced current authority decision and an already-produced expected future Authority decision.

The contract answers:

- where current runtime authority differs from the future authority model;
- which comparisons are untrusted;
- which evidence is missing;
- which authority boundaries need observation or contract improvement.

It does not answer whether a request should proceed. The existing backend decision remains controlling.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

BE-7.1 proves that current evidence is fragmented, only runtime security has a shared failure-isolated observer, and no future Authority Resolver decision producer exists. Trusted request-level drift cannot currently be emitted.

## 2.2 Scope

This contract standardizes passive drift telemetry only. It does not wire observers, evaluate permissions, alter gates, store records, define UI access control, or migrate enforcement.

## 2.3 Authority ownership

`runtime-security-enforcement`, `protected-route-authority`, `provider-execution-gate`, `governance-mutation-gate`, and `route-permission-catalog` retain their existing responsibilities. A future Authority Resolver decision remains a non-authoritative comparison input.

## 2.4 Safety boundary

A `DriftRecord`, including a high-severity record, cannot authorize, deny, execute, modify security, change policy or approval state, or replace governance. Telemetry failure is fail-passive and cannot change the current runtime outcome.

---

# 3. Conceptual Model

```text
Observed Current Decision

+ Observed Expected Authority Decision

+ Correlated Evidence and Coverage

-> DriftRecord
```

Both decisions must be produced by their own owners before comparison. The monitor may normalize supplied facts but may not call an authority again, reconstruct a decision from an HTTP status, or infer missing grants.

---

# 4. DriftRecord Contract

```text
DriftRecord

drift_id
source_authority
compared_authority
decision_type
mismatch_type
evidence_gap
severity
confidence
timestamp
```

Minimum serialized shape:

```json
{
  "drift_id": "drift_<stable-unique-id>",
  "source_authority": "runtime-security-enforcement",
  "compared_authority": "future-authority-resolver",
  "decision_type": "request_authorization",
  "mismatch_type": "UNTRUSTED_CONTEXT",
  "evidence_gap": ["compared_decision_missing"],
  "severity": "REVIEW",
  "confidence": {
    "level": "NONE",
    "score": 0,
    "reasons": ["No versioned future decision was supplied"]
  },
  "timestamp": "2026-07-14T00:00:00.000Z"
}
```

This example is telemetry only and does not describe a runtime permission result.

---

# 5. Field Definitions

## 5.1 `drift_id`

A unique opaque identifier for one comparison result.

Requirements:

- unique within the monitoring boundary;
- safe to log and reference;
- not derived from credentials, raw approval IDs, actor-supplied identity, or personal data;
- stable for one emitted record but not used as an authorization correlation key.

## 5.2 `source_authority`

The current authority or classifier whose already-produced result is being observed.

Canonical BE-7 source values:

```text
runtime-security-enforcement
protected-route-authority
provider-execution-gate
governance-mutation-gate
route-permission-catalog
identity-authority-context
current-authority-chain
```

`current-authority-chain` is allowed only when completeness for every applicable current source is proven. A classifier value must retain classifier semantics and may not be presented as an enforcing outcome.

## 5.3 `compared_authority`

The versioned expected model or non-authoritative future decision being compared.

Until a future decision producer exists, use `future-authority-resolver` with missing-decision evidence and an untrusted result. A document, route catalog, UI projection, or locally inferred policy is not an expected decision producer.

## 5.4 `decision_type`

The boundary under comparison, not a role name.

Initial vocabulary:

```text
identity_context
workspace_boundary
membership_boundary
scope_boundary
capability_boundary
permission_boundary
request_authorization
protected_route
provider_execution
governance_mutation
approval_requirement
route_classification
```

New values require a versioned contract review. `decision_type` cannot encode RBAC roles or frontend state.

## 5.5 `mismatch_type`

The primary drift classification. Exactly one primary type is emitted per record. When several conditions apply, use the precedence in Section 7 and list secondary facts in evidence references or gap reasons.

Allowed values:

```text
MISSING_EVIDENCE
DECISION_MISMATCH
POLICY_CONFLICT
SCOPE_CONFLICT
CAPABILITY_CONFLICT
UNTRUSTED_CONTEXT
```

## 5.6 `evidence_gap`

A bounded array of machine-readable reason codes describing absent, incomplete, stale, uncorrelated, or invalid comparison evidence. Use an empty array only when sufficient trustworthy evidence proves a material mismatch.

Initial reason codes:

```text
source_decision_missing
compared_decision_missing
source_version_missing
compared_version_missing
observation_id_missing
authority_coverage_incomplete
action_correlation_missing
resource_correlation_missing
principal_evidence_missing
workspace_evidence_missing
membership_evidence_missing
scope_evidence_missing
capability_evidence_missing
permission_evidence_missing
policy_reference_missing
approval_reference_missing
provider_result_missing
timestamp_missing
evidence_stale
evidence_provenance_invalid
evidence_contains_forbidden_data
```

Reason codes describe evidence quality only. They do not grant or deny access.

## 5.7 `severity`

Review priority for observability operations:

```text
INFO
REVIEW
HIGH
CRITICAL
```

Rules:

- `INFO`: complete trusted comparison with a non-material descriptive difference;
- `REVIEW`: missing evidence or incomplete context without a proven opposite decision;
- `HIGH`: trusted material conflict in policy, scope, capability, or terminal effect;
- `CRITICAL`: trusted comparison shows potential allow expansion across a current denial, governance block, protected-route boundary, or provider execution boundary.

Severity never changes request behavior. An `UNTRUSTED_CONTEXT` record cannot be upgraded to a proven conflict merely by assigning high severity.

## 5.8 `confidence`

Evidence quality for the comparison, compatible with the BE-6 adapter contract:

```text
confidence

level       HIGH | MEDIUM | LOW | NONE
score       number from 0 through 1
reasons     string[]
```

Rules:

- confidence measures provenance, completeness, freshness, and correlation;
- confidence does not measure how strongly the monitor agrees with an outcome;
- a missing or untrusted decision requires `NONE`;
- incomplete applicable-authority coverage cannot be `HIGH`;
- scoring cannot promote an untrusted record to a trusted mismatch;
- confidence does not increase the authority of either input.

## 5.9 `timestamp`

UTC ISO 8601 time at which the immutable comparison snapshot was produced.

The record should separately reference source decision times in its evidence envelope when available. `timestamp` must not be used to infer that unrelated decisions belong to the same request.

---

# 6. Drift Type Semantics

## 6.1 `MISSING_EVIDENCE`

Required evidence is absent but the supplied context is not independently proven unsafe or contradictory.

Examples:

- governance decision exists but has no stable policy reference;
- protected-route outcome has no correlation ID;
- provider classification has no execution-result reference;
- applicable-authority coverage is incomplete.

The shadow state is normally `UNTRUSTED` unless the missing evidence is explicitly non-material under a future reviewed policy.

## 6.2 `DECISION_MISMATCH`

Trusted, correlated terminal effects differ and no more specific policy, scope, or capability conflict fully explains the difference.

Examples:

- current complete chain denies while expected authority says allow;
- current complete chain allows while expected authority says deny.

## 6.3 `POLICY_CONFLICT`

Trusted decisions apply materially different governance, approval, provider, or security policy requirements.

Examples:

- expected decision omits a governance approval required by current authority;
- policy versions produce opposing terminal effects;
- expected decision treats a blocked provider mode as executable.

## 6.4 `SCOPE_CONFLICT`

Trusted decisions differ materially in workspace, project, data, action, or resource scope.

Examples:

- the expected decision authorizes a different workspace or project;
- resource identity or required scope is broader than the current enforced boundary;
- one side cannot bind the decision to the same action and resource.

Missing correlation alone remains `UNTRUSTED_CONTEXT`, not a proven scope conflict.

## 6.5 `CAPABILITY_CONFLICT`

Trusted decisions disagree about capability identity, provider boundary, risk class, execution mode, or whether the capability may execute.

Route or provider labels alone are insufficient to prove this type; both sides require trustworthy capability evidence.

## 6.6 `UNTRUSTED_CONTEXT`

The supplied context cannot safely support a comparison.

Triggers include:

- either decision is absent, malformed, unversioned where required, or explicitly untrusted;
- principal, workspace, action, resource, or observation correlation fails;
- an applicable authority may have run but was not observed;
- evidence provenance is invalid, stale beyond policy, secret-bearing, frontend-authoritative, or actor-inferred;
- current authorities disagree and the effective runtime outcome was not captured.

`UNTRUSTED_CONTEXT` is a telemetry containment state, not a denial.

---

# 7. Primary Mismatch Precedence

Evaluate primary type in this order:

```text
UNTRUSTED_CONTEXT
MISSING_EVIDENCE
SCOPE_CONFLICT
POLICY_CONFLICT
CAPABILITY_CONFLICT
DECISION_MISMATCH
```

Rules:

1. If comparison integrity is unsafe, emit `UNTRUSTED_CONTEXT`.
2. If integrity is otherwise valid but required evidence is absent, emit `MISSING_EVIDENCE`.
3. Prefer a proven material boundary-specific conflict over a generic terminal mismatch.
4. Preserve every additional difference as bounded secondary evidence; do not emit duplicate records for the same facts merely to count more drift.

This precedence classifies the record. It does not establish enforcement precedence.

---

# 8. Evidence Envelope

The minimum `DriftRecord` fields may be accompanied by a sanitized envelope:

```text
DriftEvidenceEnvelope

contract_version
observation_id
current_decision_reference
compared_decision_reference
source_evidence_references
compared_evidence_references
applicable_authorities
observed_authorities
comparison_reasons
material_differences
current_runtime_controlled_execution
```

Requirements:

- `current_runtime_controlled_execution` is always `true` for BE-7 records about live request paths;
- raw credentials, cookies, authorization headers, request bodies, secrets, and untrusted actor identity are forbidden;
- mutable approval or policy objects are not retained by reference without stable version/hash semantics;
- evidence arrays and text are bounded;
- a missing envelope field is explicit, not inferred.

---

# 9. Match Handling

`DriftRecord` is intended for drift or comparison-integrity gaps. A trusted `MATCH` may be counted as aggregate coverage telemetry without producing an individual drift record.

If an implementation emits a record for a match, it must use a separate `comparison_status: MATCH` envelope field and must not invent a mismatch type. The minimum BE-7.2 record alone is therefore not sufficient for match telemetry; the shadow model defines the full result.

---

# 10. Production and Consumption Rules

## 10.1 Producers

Only a backend passive monitor may produce authoritative drift telemetry about backend decisions. It consumes original decision snapshots; it does not own those decisions.

## 10.2 Consumers

Permitted future consumers:

- backend observability and audit review;
- evidence coverage reports;
- architecture readiness review;
- alerts that request human investigation.

Forbidden consumers:

- middleware allow/deny branches;
- permission or governance enforcement;
- provider execution routers;
- approval mutation;
- frontend access-control logic;
- any component treating absence of drift as proof of permission.

## 10.3 Failure behavior

Monitoring must fail passive:

- exceptions cannot reach gate control flow;
- record loss cannot change allow/deny;
- no synchronous database, provider, network, or policy read is permitted inside a request observer;
- unavailable comparison inputs produce `UNTRUSTED` telemetry when safe, otherwise no record;
- telemetry backpressure cannot delay security enforcement.

---

# 11. Storage and Retention Boundary

BE-7.2 creates no database and chooses no persistence implementation.

Any future storage proposal must separately define:

- backend ownership;
- bounded retention and deletion;
- access control and redaction;
- sampling and cardinality;
- immutable snapshot or stable-reference semantics;
- project/workspace isolation;
- operational failure isolation.

Logs are not automatically a durable evidence system, and a future database is not authorized by this contract.

---

# 12. Review Checklist

The contract is valid only when reviewers confirm:

- every record names both compared authorities;
- classifier evidence is not represented as an enforcing decision;
- missing evidence cannot become a match or permission grant;
- confidence and severity cannot affect runtime;
- `UNTRUSTED_CONTEXT` precedes mismatch claims when integrity fails;
- current denial remains controlling during potential allow expansion;
- no secret-bearing evidence is allowed;
- no database, runtime observer, resolver, RBAC, or frontend authority is introduced.

---

# 13. BE-7.2 Review Result

The contract can express missing evidence, trusted boundary conflict, generic decision mismatch, and untrusted comparison context while preserving current authority ownership.

BE-7.2 is complete as documentation. The next safe action is the shadow state model that maps current and expected decisions to `MATCH`, `LOW_RISK_DRIFT`, `HIGH_RISK_DRIFT`, or `UNTRUSTED`.

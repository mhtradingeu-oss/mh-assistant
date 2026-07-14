# MH-OS Authority Insight Contract

## Status

BE-9.2 Authority Insight contract design complete.

Documentation only. No insight producer, runtime observer, drift producer, API, AI integration, report, database, permission enforcement, RBAC, governance mutation, or frontend behavior is implemented.

Existing backend authorities remain authoritative. Authority insights are shadow reporting artifacts only.

---

# 1. Objective

Define a bounded, explainable `AuthorityInsight` derived from already-produced passive authority observations, drift records, and safe evidence summaries.

The required core fields are:

- `insight_id`;
- `source_authority`;
- `decision_area`;
- `drift_level`;
- `evidence_quality`;
- `recommendation`;
- `confidence`.

The contract adds version, provenance, review-routing, and time fields needed to interpret those core fields safely.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

BE-9.1 proves that no current runtime component consumes a unified authority-observation stream and no trusted request-level drift stream exists. BE-8 observation expansion remains deferred, current authority coverage remains incomplete, and the future Authority Resolver has no runtime decision producer.

Therefore this contract defines a future derived artifact over supplied inputs. It does not describe a live current report.

## 2.2 Scope

This phase defines:

- field meanings and vocabularies;
- valid input relationships;
- deterministic classification boundaries;
- evidence and confidence semantics;
- review routing;
- AI and frontend projection boundaries.

It does not select storage, transport, retention, API routes, UI implementation, or an AI model.

## 2.3 Authority ownership

An `AuthorityInsight` does not own or replace its input decisions. Source authorities retain their existing runtime ownership. Drift remains shadow comparison telemetry. The insight layer owns only a derived explanation and review recommendation.

## 2.4 Safety boundary

An insight cannot:

- authorize or deny;
- execute, queue, publish, send, sync, or invoke providers;
- approve, reject, override, escalate, or create governance state;
- change policy, permission, membership, scope, or capability;
- call middleware continuation or write a runtime response;
- be consumed by a runtime gate;
- become frontend access control;
- treat recommendation or confidence as authority.

---

# 3. Contract Principles

1. **Derived only:** inputs must already exist before insight derivation.
2. **No reevaluation:** the insight producer cannot call an authority, resolver, policy store, approval store, route catalog, or provider classifier.
3. **Source semantics survive:** enforcing outcomes remain distinct from classifications.
4. **Evidence limits language:** explanations and recommendations cannot be stronger than their evidence.
5. **Untrusted is explicit:** missing correlation or material context cannot become low drift or no action.
6. **Recommendation is advisory:** it routes human review and never controls runtime.
7. **Confidence is evidence confidence:** it is not predicted permission correctness.
8. **Backend owns meaning:** the backend produces the contract; frontend only projects it.
9. **AI is optional:** contract validity cannot depend on generated prose.
10. **No persistence assumption:** identity and lifecycle fields do not imply a database.
11. **Bounded and sanitized:** every implementation must enforce field, array, text, depth, and total-record limits.

---

# 4. AuthorityInsight

```text
AuthorityInsight

contract_version
mode
authoritative
insight_id
source_authority
source_kind
related_authorities
decision_area
drift_level
evidence_quality
recommendation
confidence
summary
observation_references
drift_references
evidence_references
review_views
input_status
derived_at
record_status
```

Fixed values:

```text
mode = shadow
authoritative = false
```

Initial conceptual contract version:

```text
mh-authority-insight-v1
```

---

# 5. Core Field Definitions

## 5.1 `insight_id`

Opaque identifier for one derived insight.

Requirements:

- unique within the producing boundary;
- safe to log and display;
- not derived from credentials, personal data, raw approval IDs, request payloads, or project names;
- not used as authentication, authorization, approval, idempotency, or execution proof;
- independent from `observation_id`, `decision_id`, and `drift_id`;
- stable only for the lifetime semantics chosen by a future implementation.

No durable identity guarantee exists until transport and persistence are separately approved.

## 5.2 `source_authority`

The primary authority or classifier whose observed behavior most directly caused the insight.

Initial values:

```text
runtime-security-enforcement
protected-route-authority
governance-mutation-gate
provider-execution-gate
route-permission-catalog
identity-authority-context
current-authority-chain
future-authority-resolver
authority-observation-layer
authority-drift-monitor
```

Rules:

- use the source value from an input observation or drift record when one source is primary;
- use `current-authority-chain` only when applicable-source coverage is proven complete;
- use `authority-observation-layer` for observation coverage or record-integrity insights without one primary runtime authority;
- use `authority-drift-monitor` for a monitor failure or comparison-integrity insight;
- never label a frontend, report, AI model, document, or recommendation as the source authority;
- never promote `provider-execution-gate` from classifier to execution authority through this field.

`related_authorities` may list other supplied sources. It cannot repair missing primary-source provenance.

## 5.3 `decision_area`

The material boundary or observability concern that needs explanation or review.

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
governance_mutation
approval_requirement
provider_classification
provider_execution
route_classification
observation_coverage
evidence_integrity
comparison_integrity
```

Rules:

- select one primary area from supplied decision types and gap evidence;
- use the most specific supported material area;
- use `observation_coverage`, `evidence_integrity`, or `comparison_integrity` when evidence cannot support a decision-boundary claim;
- `provider_execution` requires an actual provider-execution result reference and cannot be inferred from Provider Gate classification;
- the field cannot encode a role, reviewer, UI page, or desired outcome.

## 5.4 `drift_level`

Normalized reporting level for drift state.

Allowed values:

```text
NOT_EVALUATED
MATCH
LOW_RISK_DRIFT
HIGH_RISK_DRIFT
UNTRUSTED
```

Mapping:

| Supplied condition | `drift_level` |
|---|---|
| No drift comparison was supplied | `NOT_EVALUATED` |
| Trusted BE-7 state is `MATCH` | `MATCH` |
| Trusted BE-7 state is `LOW_RISK_DRIFT` | `LOW_RISK_DRIFT` |
| Trusted BE-7 state is `HIGH_RISK_DRIFT` | `HIGH_RISK_DRIFT` |
| BE-7 state is `UNTRUSTED`, inputs conflict, or comparison integrity is insufficient | `UNTRUSTED` |

Rules:

- derive from a supplied versioned drift result; do not recompute current-versus-expected authority;
- lack of a drift record is `NOT_EVALUATED`, not `MATCH`;
- incomplete request-wide coverage cannot produce request-level `MATCH`;
- `HIGH_RISK_DRIFT` never blocks or changes the current runtime decision;
- BE-7 `severity` remains available through referenced drift evidence and is not collapsed into this field.

## 5.5 `evidence_quality`

Structured assessment of whether the supplied evidence is adequate for the insight's explanation.

```text
evidence_quality

status
provenance
coverage
freshness
correlation
gaps
```

Allowed values:

```text
status       SUFFICIENT | PARTIAL | INSUFFICIENT | UNSAFE
provenance   VERIFIED | PARTIAL | INVALID | UNKNOWN
coverage     COMPLETE | PARTIAL | INCOMPLETE | UNKNOWN
freshness    CURRENT | STALE | UNKNOWN
correlation  CORRELATED | PARTIAL | UNCORRELATED | UNKNOWN
gaps         bounded string[]
```

Semantics:

- `SUFFICIENT` means sufficient for the bounded claim made by this insight, not proof of global correctness;
- `PARTIAL` supports a limited descriptive claim while material limits remain explicit;
- `INSUFFICIENT` supports only missing-context or investigation language;
- `UNSAFE` means the input contains forbidden, invalid-provenance, or unsafely exposed evidence and should not be projected beyond restricted evidence review;
- gap codes should reuse BE-7 or BE-8 vocabulary where applicable;
- unknown fields cannot be defaulted to safe or complete.

Minimum precedence for `status`:

```text
UNSAFE
INSUFFICIENT
PARTIAL
SUFFICIENT
```

The first satisfied state wins.

## 5.6 `recommendation`

Bounded, non-executable human review guidance.

```text
recommendation

type
summary
review_view
next_step
prohibited_action
```

Allowed `type` values:

```text
NO_ACTION
INVESTIGATE_SECURITY
REVIEW_GOVERNANCE
REVIEW_DRIFT
REVIEW_EVIDENCE
IMPROVE_OBSERVATION
CORRECT_REPORTING
```

Allowed `review_view` values:

```text
security
governance
drift
evidence
none
```

Rules:

- `summary` explains why review is useful;
- `next_step` names a read-only investigation or an existing human-owned backend review path;
- `prohibited_action` states what the insight cannot do, such as `do_not_change_runtime_decision`;
- `NO_ACTION` is valid only for a trusted match with sufficient evidence and no independent evidence or observation concern;
- `UNTRUSTED` drift requires investigation, evidence review, or observation improvement, never `NO_ACTION`;
- the recommendation cannot contain an executable command, approval decision, policy mutation, permission grant, or provider instruction;
- routing to Governance does not create or resolve a Governance item.

## 5.7 `confidence`

Evidence confidence for the complete insight.

```text
confidence

level
score
reasons
```

Allowed values:

```text
level    HIGH | MEDIUM | LOW | NONE
score    number from 0 through 1
reasons  bounded string[]
```

Rules:

- align with the BE-7 meaning of provenance, completeness, freshness, and correlation;
- confidence measures support for the insight's bounded statement, not probability that runtime authority is correct;
- `UNSAFE` evidence requires `NONE` for broadly projected insight meaning;
- an untrusted comparison cannot have confidence in a material drift claim;
- a missing future resolver decision can support high confidence that comparison evidence is missing, but not high confidence in a decision mismatch;
- scoring cannot override `drift_level` or `evidence_quality` precedence;
- AI self-reported confidence cannot populate this field.

---

# 6. Supporting Fields

## 6.1 `source_kind`

Allowed values:

```text
ENFORCING_AUTHORITY
CLASSIFIER
OBSERVATION_LAYER
COMPARISON_LAYER
```

This field preserves the BE-8 distinction between enforcing authority and classifier evidence.

## 6.2 `summary`

A bounded backend-produced factual explanation of:

- what was observed;
- why the insight exists;
- which evidence limitation applies;
- why the runtime decision remains unchanged.

The summary must separate observed fact from inference. It must not include secrets, raw request content, unrestricted log text, or unverified identity.

## 6.3 Reference arrays

```text
observation_references
drift_references
evidence_references
```

Requirements:

- opaque, bounded, sanitized references only;
- no embedded credentials or raw mutable source objects;
- each reference includes type and provenance status when the source contract supports it;
- a reference does not become authorization or approval proof merely because it appears in an insight;
- a missing reference is represented in `evidence_quality.gaps`.

## 6.4 `review_views`

Bounded set of applicable projections:

```text
security
governance
drift
evidence
```

One insight may appear in several views. All views must project the same `insight_id`, core meaning, and backend-produced fields.

## 6.5 `input_status`

```text
input_status

observations_supplied
drift_supplied
expected_decision_supplied
applicable_authorities_complete
contract_versions_supported
```

These are descriptive status values, not authority facts. Missing input must remain explicit.

## 6.6 Time and record fields

`derived_at` is the UTC ISO 8601 time the immutable insight snapshot was created. It does not establish correlation.

`record_status` values:

```text
COMPLETE
PARTIAL
INVALID
REDACTED
```

`record_status` describes contract construction. It does not describe runtime allow/deny or reviewer resolution.

---

# 7. Valid Inputs

An insight producer may accept only already-produced, immutable, version-supported inputs:

- `SharedAuthorityObservation` records;
- `AuthorityDriftShadowResult` or `DriftRecord` records;
- sanitized evidence summaries or references;
- explicit applicable-authority coverage supplied by an observation assembler;
- source metadata already captured at the source seam.

It may not accept as authority input:

- frontend state or UI-derived policy;
- HTTP status reconstructed after the decision;
- raw logs without stable decision correlation;
- a design document as a runtime decision;
- an AI answer;
- an actor-supplied identity claim;
- a role label as permission evidence;
- a route or provider classification as final request execution outcome.

---

# 8. Derivation Model

Conceptual pure function:

```text
deriveAuthorityInsight(input_bundle)
  -> AuthorityInsight
```

Required order:

1. Validate contract versions and record safety.
2. Preserve primary source and source kind.
3. Validate supplied correlation and applicable-authority coverage.
4. Select the most specific supportable `decision_area`.
5. Map supplied drift state to `drift_level` without reevaluation.
6. Derive `evidence_quality` using safety-first precedence.
7. Derive `confidence` for the bounded claim.
8. Choose review views and a non-executable recommendation.
9. Produce a bounded factual summary.
10. Freeze the output and hand it to a downstream reporting boundary.

The function must be deterministic for the same immutable input bundle and contract version. It performs no network, database, filesystem, provider, policy, approval, runtime-gate, or AI call.

---

# 9. Recommendation Matrix

| Drift level | Evidence quality | Primary recommendation | Constraint |
|---|---|---|---|
| `MATCH` | `SUFFICIENT` | `NO_ACTION` or bounded reporting correction | Only when no other concern exists |
| `LOW_RISK_DRIFT` | `SUFFICIENT` or `PARTIAL` | `REVIEW_DRIFT` | No runtime change |
| `HIGH_RISK_DRIFT` | `SUFFICIENT` | `INVESTIGATE_SECURITY` or `REVIEW_GOVERNANCE` | Current backend decision still controls |
| `UNTRUSTED` | `PARTIAL` or `INSUFFICIENT` | `REVIEW_EVIDENCE` or `IMPROVE_OBSERVATION` | Do not claim mismatch root cause |
| `NOT_EVALUATED` | Any non-unsafe state | `REVIEW_EVIDENCE`, `IMPROVE_OBSERVATION`, or reporting-only guidance | Absence is not match |
| Any | `UNSAFE` | Restricted `REVIEW_EVIDENCE` | Do not broadly project unsafe content |

When several recommendations apply, security and evidence safety take priority over reporting convenience. Priority affects review routing only.

---

# 10. Review View Routing

## 10.1 Security

Include when supplied evidence supports:

- trusted potential allow expansion;
- protected-route conflict;
- runtime security mismatch;
- provider execution boundary conflict;
- material permission, scope, or capability conflict.

## 10.2 Governance

Include when supplied evidence supports:

- governance mutation conflict;
- approval requirement conflict;
- policy conflict;
- override-related review;
- a human-owned governance follow-up.

## 10.3 Drift

Include when:

- a drift result exists;
- comparison integrity failed;
- vocabulary or version drift needs architecture review.

## 10.4 Evidence

Include when:

- evidence is partial, insufficient, unsafe, stale, or uncorrelated;
- observation coverage is incomplete;
- provenance or source version is missing;
- a report requires restricted evidence inspection.

Routing does not create a queue item or change review state.

---

# 11. AI Advisory Extension

AI is outside the deterministic core contract.

An optional future extension may consume a completed `AuthorityInsight` and produce:

```text
AuthorityInsightAdvisoryExplanation

insight_id
explanation
investigation_steps
uncertainty
evidence_references_used
generated_at
model_reference
authoritative
```

Fixed value:

```text
authoritative = false
```

The extension cannot change any `AuthorityInsight` core field. Its output cannot be evidence, approval rationale, runtime input, or a mutation instruction.

---

# 12. Frontend Projection Contract

Frontend consumers may:

- display core fields and summaries;
- filter by supplied source, area, drift level, evidence status, or review view;
- sort by supplied priority metadata if a future contract adds it;
- link to the existing backend-authoritative Governance surface;
- create a confirmed, destination-owned review handoff if separately approved.

Frontend consumers may not:

- compute drift level, evidence quality, or confidence;
- rewrite `UNTRUSTED` as low risk;
- hide evidence limits while showing recommendations;
- convert a recommendation into a backend mutation;
- mark an insight resolved as an authority fact;
- use insight visibility as access control.

---

# 13. Example Records

## 13.1 Missing comparison evidence

```json
{
  "contract_version": "mh-authority-insight-v1",
  "mode": "shadow",
  "authoritative": false,
  "insight_id": "insight_example_001",
  "source_authority": "authority-drift-monitor",
  "source_kind": "COMPARISON_LAYER",
  "related_authorities": ["runtime-security-enforcement"],
  "decision_area": "comparison_integrity",
  "drift_level": "UNTRUSTED",
  "evidence_quality": {
    "status": "INSUFFICIENT",
    "provenance": "PARTIAL",
    "coverage": "INCOMPLETE",
    "freshness": "UNKNOWN",
    "correlation": "PARTIAL",
    "gaps": ["compared_decision_missing", "authority_coverage_incomplete"]
  },
  "recommendation": {
    "type": "IMPROVE_OBSERVATION",
    "summary": "A trusted request-level comparison cannot be made.",
    "review_view": "evidence",
    "next_step": "Review missing expected-decision and current-authority coverage evidence.",
    "prohibited_action": "do_not_change_runtime_decision"
  },
  "confidence": {
    "level": "HIGH",
    "score": 0.95,
    "reasons": ["The supplied record explicitly reports missing comparison inputs"]
  },
  "summary": "The observation supports a missing-comparison finding, not a decision mismatch.",
  "observation_references": ["observation_example_001"],
  "drift_references": ["drift_example_001"],
  "evidence_references": [],
  "review_views": ["drift", "evidence"],
  "input_status": {
    "observations_supplied": true,
    "drift_supplied": true,
    "expected_decision_supplied": false,
    "applicable_authorities_complete": false,
    "contract_versions_supported": true
  },
  "derived_at": "2026-07-14T00:00:00.000Z",
  "record_status": "PARTIAL"
}
```

The high confidence applies only to the explicit missing-input finding. It does not express confidence that the runtime decision was correct or incorrect.

## 13.2 Trusted high-risk drift

A future trusted high-risk insight requires:

- both current and expected decisions;
- complete current authority coverage;
- version and correlation evidence;
- stable material evidence references;
- a supplied BE-7 `HIGH_RISK_DRIFT` result.

Even then:

```text
mode = shadow
authoritative = false
recommendation.prohibited_action = do_not_change_runtime_decision
```

---

# 14. Invalid Uses

The following are contract violations:

- a middleware gate branches on `drift_level`;
- Governance auto-creates an approval from `recommendation`;
- an AI model writes `confidence` into the core record;
- the frontend computes `evidence_quality` from visible fields;
- missing drift input becomes `MATCH`;
- Provider Gate classification becomes `provider_execution` evidence;
- a recommendation grants a permission or expands scope;
- `insight_id` is used to authorize a later request;
- an insight is called resolved without a separately defined review-state owner;
- raw request, credential, provider, or approval payloads are embedded as evidence.

---

# 15. Validation Requirements for Any Future Implementation

A future implementation proposal must prove:

1. deterministic output for fixed versioned inputs;
2. no authority, policy, approval, provider, or resolver reevaluation;
3. enforcing-versus-classifier preservation;
4. correct drift mapping including no-record versus match;
5. evidence-quality precedence;
6. confidence bounded to the claim actually supported;
7. sanitized and bounded references and text;
8. failure isolation from runtime execution;
9. no runtime or Governance dependency on insight output;
10. frontend projection fidelity;
11. optional AI output cannot mutate core fields;
12. no database or persistence introduced without a separate architecture decision.

---

# 16. Completion Statement

BE-9.2 is complete as a contract design.

`AuthorityInsight` is a versioned shadow reporting artifact that preserves source semantics, expresses drift and evidence limits, recommends human review, and carries evidence confidence. It has no execution authority. Live production remains blocked on the separately deferred BE-8 observation expansion, a future drift input path, and future reporting implementation decisions.

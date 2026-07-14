# MH-OS Authority Review Center Design

## Status

BE-9.3 Authority Review Center design complete.

Documentation only. No Review Center page, API, report producer, observer, drift producer, AI advisor, database, permission enforcement, RBAC, governance mutation, notification, or frontend behavior is implemented.

Existing backend authorities remain authoritative. The Review Center is a proposed reporting projection only.

---

# 1. Objective

Design an explainable Authority Review Center with four review views:

- Security Review;
- Governance Review;
- Drift Review;
- Evidence Review.

The center projects backend-produced `AuthorityInsight` records. It does not own decisions, evidence, policies, approvals, permissions, or execution.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

BE-9.1 proves:

- no live shared authority-observation consumer exists;
- no trusted request-level drift stream exists;
- Governance and Insights are adjacent future projection patterns, not current BE-9 consumers;
- an AI advisor is viable only as explanation and investigation assistance.

BE-9.2 defines a shadow-only `AuthorityInsight` with backend-owned source, decision-area, drift, evidence, recommendation, and confidence semantics.

## 2.2 Scope

This phase designs:

- backend projection boundaries;
- information architecture;
- four review views;
- filtering, grouping, detail, and navigation behavior;
- evidence and AI display boundaries;
- empty, partial, unsafe, and error states;
- future validation requirements.

It does not approve runtime integration, transport, persistence, APIs, exports, alerts, or frontend code.

## 2.3 Authority ownership

The Review Center consumes completed insights. It cannot alter:

- the current runtime source decision;
- the expected shadow decision;
- a drift result;
- evidence provenance;
- a Governance approval or policy;
- membership, scope, capability, or permission.

## 2.4 Safety boundary

The center must never:

- authorize, deny, block, or permit;
- execute or queue work;
- approve, reject, override, or update policy;
- invoke a provider;
- create an approval, task, notification, escalation, or handoff implicitly;
- calculate authority meaning in the frontend;
- treat visibility, acknowledgement, filtering, or dismissal as an authority action;
- feed reports into runtime control.

---

# 3. Architecture

```text
Already-Produced Passive Inputs
  - SharedAuthorityObservation
  - AuthorityDriftShadowResult / DriftRecord
  - sanitized evidence references
                 |
                 v
Deterministic Backend Authority Insight Deriver
                 |
                 v
Backend Review Projection Builder
  - preserves one insight identity
  - assigns supplied review views
  - redacts and bounds projection
                 |
                 v
Read-Only Authority Review Center
  +--> Security Review
  +--> Governance Review
  +--> Drift Review
  +--> Evidence Review

Runtime decisions continue on their existing backend paths.
The review branch has no return path into execution control.
```

No arrow in this design implies transport or persistence approval.

---

# 4. Component Boundaries

## 4.1 Authority Insight Deriver

Defined by BE-9.2.

Responsibility:

- accept only already-produced passive inputs;
- derive one versioned immutable `AuthorityInsight`;
- preserve source semantics;
- classify evidence and recommendation deterministically;
- perform no authority, policy, approval, provider, database, or AI call.

## 4.2 Review Projection Builder

Conceptual pure function:

```text
buildAuthorityReviewProjection(insights, projection_context)
  -> AuthorityReviewProjection
```

Responsibility:

- validate supported insight contract versions;
- select fields approved for ordinary or restricted projection;
- preserve the core fields without semantic rewriting;
- assign the same insight to its supplied `review_views`;
- calculate bounded counts from supplied insight records;
- expose missing-input and partial-projection status;
- produce no mutation controls.

It may not:

- derive new drift or evidence conclusions;
- recompute confidence;
- infer source coverage;
- query mutable authority stores to enrich an insight;
- hide `UNTRUSTED`, `INSUFFICIENT`, or `UNSAFE` labels;
- turn absence into zero risk.

## 4.3 Backend Read Boundary

A future read boundary may return a completed projection. It must be separately approved before implementation.

Requirements for any future proposal:

- backend-produced payload;
- read-only semantics;
- bounded page size and filters;
- no raw evidence or secret-bearing fields in the ordinary response;
- contract and projection version included;
- partial-result status explicit;
- read failure isolated from runtime enforcement;
- existing backend authentication and request protection remain unchanged;
- no new permission/RBAC system introduced by BE-9.

This design does not name or approve an endpoint.

## 4.4 Frontend Projection

Responsibility:

- render supplied fields;
- filter, sort, and select within the backend payload;
- display limitations next to conclusions;
- navigate to an existing backend-authoritative owner surface when appropriate;
- keep all review guidance visibly non-authoritative.

The frontend cannot generate `AuthorityInsight` records or fill missing fields.

## 4.5 Existing Governance Surface

The current Governance page remains the owner of human-triggered approval decisions and policy updates through existing backend APIs.

The Review Center may navigate to Governance with bounded context. It may not:

- embed a hidden Governance mutation;
- preselect an approval decision;
- create an approval automatically;
- represent navigation as resolution;
- claim that an insight has governance effect.

## 4.6 Existing Insights Surface

The current Insights page remains a marketing and operational performance surface. Its visual and confirmed-handoff patterns may inform UI behavior, but it does not own Authority Intelligence.

A future implementation must either:

- establish a distinct Authority Review Center projection; or
- explicitly add a separately labeled backend-owned Authority Intelligence area under another surface.

Client-side performance recommendation logic must not be reused to classify authority insights.

---

# 5. AuthorityReviewProjection Contract

```text
AuthorityReviewProjection

projection_version
insight_contract_version
mode
authoritative
generated_at
input_window
projection_status
summary
views
insights
limitations
```

Fixed values:

```text
mode = shadow
authoritative = false
```

## 5.1 `input_window`

Describes only the supplied snapshot:

```text
input_window

from
through
record_count
complete
```

`complete = false` must be shown when transport, source coverage, pagination, or supplied inputs are incomplete. A time window cannot establish request correlation.

## 5.2 `projection_status`

Allowed values:

```text
COMPLETE
PARTIAL
EMPTY
INVALID
```

`EMPTY` means no valid insight was supplied in the bounded projection. It does not mean no authority risk or drift exists.

## 5.3 `summary`

Backend-calculated counts only:

```text
summary

total_insights
security_review_count
governance_review_count
drift_review_count
evidence_review_count
untrusted_count
high_risk_drift_count
unsafe_evidence_count
```

Counts may overlap because one insight can appear in multiple views. The UI must label this and must not sum view counts into a false total.

## 5.4 `views`

Each view contains:

```text
view_id
label
description
insight_ids
view_status
limitations
```

The view is an index over `insights`, not a duplicated or rewritten copy of the records.

## 5.5 `insights`

Bounded array of `AuthorityInsight` projections. Core meanings must remain identical across every view.

## 5.6 `limitations`

Machine-readable and display-ready constraints such as:

```text
live_observation_stream_unavailable
future_resolver_decision_unavailable
authority_coverage_incomplete
projection_input_partial
persistence_not_configured
unsafe_evidence_redacted
```

Current BE-9 documentation examples would require at least the first four limitations.

---

# 6. Shared Information Architecture

## 6.1 Header

The header must display:

- `Authority Review Center`;
- `Shadow reporting only`;
- `Backend runtime decisions remain controlling`;
- projection generation time;
- input completeness;
- contract version;
- partial or empty-state limitations.

No global “resolve,” “approve,” “apply,” or “fix all” action is allowed.

## 6.2 Summary strip

Display:

- total unique insights;
- insights requiring each review lens;
- untrusted comparisons;
- trusted high-risk drift;
- unsafe evidence restricted from ordinary display.

Counts must retain qualifiers. For example:

```text
3 trusted high-risk drift insights
8 untrusted comparisons needing evidence
```

Do not combine those into `11 critical issues`.

## 6.3 View navigation

Tabs or equivalent navigation:

```text
Security
Governance
Drift
Evidence
```

Changing views changes projection only. It does not alter backend state.

## 6.4 Filter bar

Safe filters over supplied backend values:

- source authority;
- source kind;
- decision area;
- drift level;
- evidence status;
- confidence level;
- projection time window;
- record status.

Filters cannot:

- compute a new risk label;
- hide mandatory limitation banners;
- default to excluding `UNTRUSTED` or `UNSAFE` records without explicit visible state;
- become backend access rules.

## 6.5 Insight list row

Each row should show:

- insight ID or safe short reference;
- backend summary;
- source authority and source kind;
- decision area;
- drift level;
- evidence-quality status;
- confidence level with a short reason;
- primary recommendation type;
- derived time;
- applicable review-view badges.

Color alone cannot convey drift, evidence, or confidence.

## 6.6 Insight detail drawer or page

The detail view should separate:

1. **Observed facts** — supplied source and record facts.
2. **Drift interpretation** — supplied/mapped drift state and limitations.
3. **Evidence quality** — provenance, coverage, freshness, correlation, and gaps.
4. **Recommendation** — human review guidance and prohibited action.
5. **References** — safe observation, drift, and evidence references.
6. **Authority boundary** — current backend decision remained controlling.
7. **Optional advisory explanation** — only if a future architecture decision approves it.

The detail cannot expose raw credentials, headers, request payloads, provider bodies, or unrestricted approval data.

---

# 7. Security Review

## 7.1 Purpose

Explain authority insights with possible material security impact without changing enforcement.

## 7.2 Inclusion criteria

Include insights whose supplied `review_views` contains `security`, commonly involving:

- `runtime-security-enforcement`;
- `protected-route-authority`;
- trusted high-risk scope, capability, permission, or terminal-effect drift;
- trusted potential allow expansion;
- provider execution boundary conflicts backed by an actual execution result;
- material observation failure at a sensitive source.

Do not include a classifier-only discrepancy as a proven execution conflict.

## 7.3 Security summary

Display separate counts for:

- trusted high-risk drift;
- trusted potential allow expansion;
- protected-route concerns;
- runtime-security concerns;
- untrusted security comparisons;
- missing sensitive-source coverage.

## 7.4 Security detail emphasis

Show:

- current source and enforcing/classifier kind;
- supplied current and expected terminal effects when trusted;
- affected boundary;
- evidence correlation and coverage;
- BE-7 severity when available;
- why the record is or is not a proven conflict;
- investigation recommendation;
- explicit statement that runtime behavior was unchanged.

## 7.5 Allowed interactions

- inspect safe details;
- filter and sort;
- copy safe IDs or references;
- navigate to an existing read-only engineering or Governance context if separately supported;
- prepare a human review note without submitting it automatically.

## 7.6 Forbidden interactions

- block or allow the request;
- add an emergency deny rule;
- grant or revoke permission;
- change scope or capability;
- disable a route or provider;
- mark a record safe based on acknowledgement;
- invoke remediation automatically.

---

# 8. Governance Review

## 8.1 Purpose

Explain policy, approval, override, and governed-action insights while preserving the existing Governance backend as the only mutation owner.

## 8.2 Inclusion criteria

Include insights whose supplied `review_views` contains `governance`, commonly involving:

- `governance-mutation-gate`;
- `governance_mutation`;
- `approval_requirement`;
- trusted policy conflicts;
- protected actions requiring human Governance review;
- evidence gaps that materially limit an approval-related explanation.

## 8.3 Governance summary

Display separate counts for:

- trusted policy conflicts;
- approval requirement conflicts;
- override-related review;
- untrusted governance comparisons;
- governance evidence gaps.

These are Authority Intelligence counts, not the current Governance approval queue.

## 8.4 Governance detail emphasis

Show:

- observed governance decision label;
- policy or approval reference status;
- drift interpretation;
- evidence limitations;
- existing human-owned follow-up destination;
- statement that the insight is not an approval or policy decision.

## 8.5 Navigation to Governance

A future `Open Governance` link may pass only bounded non-authoritative context:

```text
insight_id
source_authority
decision_area
safe_reference_ids
```

The destination must independently load its backend-authoritative state. Passed context cannot:

- create an approval;
- select approve/reject/override;
- set policy values;
- bypass confirmation;
- prove permission;
- mark the insight resolved.

## 8.6 Forbidden interactions

- inline approval or rejection;
- inline override;
- automatic approval request creation;
- policy mutation;
- AI-generated decision submission;
- interpreting a Governance navigation as enforcement.

---

# 9. Drift Review

## 9.1 Purpose

Explain supplied shadow comparisons, including trusted drift, match, and comparison integrity failures.

## 9.2 Inclusion criteria

Include insights whose supplied `review_views` contains `drift` or whose `drift_level` is not `NOT_EVALUATED`.

## 9.3 Drift summary

Display:

- trusted matches;
- trusted low-risk drift;
- trusted high-risk drift;
- untrusted comparisons;
- comparisons by current source and decision area;
- version-support limitations.

`MATCH` counts require the BE-7 trust and complete-coverage rules. No drift record means not evaluated, not match.

## 9.4 Drift matrix

A compact comparison view may show:

| Field | Current observed side | Expected shadow side | Interpretation |
|---|---|---|---|
| Source/version | Supplied value | Supplied value | Version support or gap |
| Outcome | Source-preserved value | Resolver-preserved value | Match or terminal difference |
| Action/resource | Safe correlated reference | Safe correlated reference | Correlated or untrusted |
| Scope/capability | Safe evidence reference | Safe evidence reference | Material match, conflict, or gap |
| Policy/approval | Safe reference | Safe reference | Match, conflict, or gap |

Missing cells display `Missing`, `Unknown`, or `Not supplied`; never a guessed value.

## 9.5 Aggregation boundary

Future trend views require a separately approved bounded input window and transport. If implemented, they may summarize counts by:

- source authority;
- decision area;
- drift level;
- evidence gap;
- contract version.

They cannot claim frequency, rate, improvement, or regression when the input window is incomplete.

## 9.6 Forbidden interactions

- promote the expected shadow decision into runtime authority;
- accept a drift result as a policy change;
- suppress a current gate;
- recalculate a decision from report fields;
- let low confidence downgrade a trusted current denial;
- let high confidence control execution.

---

# 10. Evidence Review

## 10.1 Purpose

Explain why an insight is supported, limited, or unsafe and guide reviewers toward evidence-quality improvement.

## 10.2 Inclusion criteria

Include insights whose supplied `review_views` contains `evidence` or whose evidence status is:

```text
PARTIAL
INSUFFICIENT
UNSAFE
```

## 10.3 Evidence summary

Display counts by:

- missing source version;
- incomplete authority coverage;
- missing observation or action/resource correlation;
- missing principal, workspace, scope, capability, permission, policy, approval, or provider result evidence;
- stale evidence;
- invalid provenance;
- forbidden data or redaction requirement.

## 10.4 Evidence detail emphasis

Show each evidence dimension separately:

- provenance;
- coverage;
- freshness;
- correlation;
- gap codes;
- safe references;
- redaction status;
- exact bounded claim that remains supportable.

## 10.5 Restricted evidence boundary

`UNSAFE` evidence must not be broadly projected. The ordinary view should display:

- that unsafe evidence exists;
- its high-level reason code;
- whether it was redacted or excluded;
- the safe owner or process for investigation when one is separately defined.

This design does not define new access roles or RBAC. Any future restricted evidence access must use existing backend security and receive a separate privacy/security review.

## 10.6 Evidence improvement guidance

Allowed recommendations include:

- add a stable source version at the future observation seam;
- improve applicable-authority coverage;
- supply safe correlation identifiers;
- replace raw evidence with a sanitized stable reference;
- capture an actual provider execution result rather than classifier evidence;
- correct invalid provenance;
- re-observe under a future approved adapter version.

The Review Center cannot perform these changes.

## 10.7 Forbidden interactions

- upload or mutate evidence through this reporting design;
- reveal credentials or raw payloads;
- accept AI prose as evidence;
- treat evidence presence as permission;
- infer identity from actor-supplied fields;
- mark evidence trusted through a frontend toggle.

---

# 11. Cross-View Behavior

## 11.1 One insight, several views

An insight may require security and evidence review, or governance, drift, and evidence review simultaneously.

Rules:

- one `insight_id`;
- one set of core fields;
- one summary meaning;
- view-specific presentation only;
- no duplicated review state;
- no conflicting recommendation rewrite.

## 11.2 Selection links

Navigation between views should retain the selected `insight_id`. It must not mutate the insight or imply completion of either review.

## 11.3 Acknowledgement and resolution

BE-9 has no database and no approved durable review-state owner. Therefore the design does not include durable:

- acknowledged;
- assigned;
- dismissed;
- remediated;
- resolved;
- reopened.

Temporary frontend selection or session notes are not authoritative review state. A future lifecycle proposal requires its own contract, backend ownership, retention model, and architecture decision.

---

# 12. Empty, Partial, Error, and Unsafe States

## 12.1 Empty

Required copy meaning:

```text
No Authority Insight records were supplied for this projection.
This does not prove that no authority drift or risk exists.
```

## 12.2 Partial

Display:

- which inputs are partial;
- which source coverage is missing;
- whether pagination or time-window completeness is unknown;
- which conclusions remain supportable.

## 12.3 Invalid

Unsupported contracts, malformed records, or unsafe projection construction produce an invalid report state. The UI must not silently drop invalid records and show a clean report.

## 12.4 Read error

A reporting read error:

- displays unavailable state;
- does not retry through a mutation route;
- does not affect runtime authority;
- does not claim that current requests are unsafe or safe;
- cannot fall back to locally reconstructed insights.

## 12.5 Unsafe evidence

Unsafe evidence is excluded or redacted from ordinary projection, while the evidence-review count and safe reason remain visible. Redaction must not convert the record into `SUFFICIENT` evidence.

---

# 13. Optional AI Advisor Placement

The Review Center reserves, but does not approve, an optional explanation panel.

If BE-9.4 selects an AI advisory layer, the panel may display a separate `AuthorityInsightAdvisoryExplanation` containing:

- plain-language explanation;
- suggested read-only investigation steps;
- uncertainty;
- evidence references used;
- generation metadata;
- `authoritative = false`.

The AI panel must be visually and structurally separate from:

- core insight summary;
- drift level;
- evidence quality;
- confidence;
- Governance decisions;
- source evidence.

No “Apply,” “Approve,” “Fix,” or automatic action is allowed.

---

# 14. Reporting and Export Boundary

The on-screen projection is the only conceptual reporting surface accepted by this design.

CSV, JSON, PDF, email, notification, webhook, scheduled report, or external SIEM export is not approved because BE-9 has not decided:

- transport;
- persistence;
- access ownership;
- privacy handling;
- retention/deletion;
- unsafe-evidence behavior;
- rate and backpressure limits.

A future export proposal must preserve all evidence and authority qualifiers and must never export secret-bearing material.

---

# 15. Accessibility and Explanation Requirements

Any future UI must:

- use text in addition to color;
- define unfamiliar source and drift labels;
- keep evidence limitations adjacent to recommendations;
- show timestamps and version context;
- support keyboard navigation for views, rows, and detail;
- avoid urgency language unsupported by evidence;
- distinguish `UNTRUSTED` from `HIGH_RISK_DRIFT`;
- distinguish classifier evidence from enforcement;
- state that backend runtime authority remained controlling.

---

# 16. Validation Requirements for Any Future Implementation

## 16.1 Backend projection tests

- supported contract versions only;
- core insight fields preserved byte-for-byte or through a reviewed serialization mapping;
- one identity across multiple views;
- overlap counts do not inflate unique total;
- limitation codes emitted for incomplete inputs;
- empty does not become no risk;
- unsafe evidence excluded or redacted correctly;
- projection builder performs no mutable-source reads;
- failure cannot affect runtime execution.

## 16.2 Frontend projection tests

- backend fields rendered without semantic recomputation;
- `UNTRUSTED`, `NOT_EVALUATED`, and `MATCH` remain distinct;
- evidence limitations remain visible under filters;
- no mutation control exists in the Review Center;
- Governance navigation carries context only;
- no frontend acknowledgement becomes durable state;
- read failure does not produce local fallback insights;
- AI explanation, if later approved, remains visually separate and non-actionable.

## 16.3 Architecture tests

- no runtime gate imports Review Center or insight projection modules;
- no Governance mutation consumes an insight recommendation;
- no new RBAC or permission implementation;
- no database dependency;
- no observation expansion hidden inside reporting work;
- no provider call;
- no frontend authority.

---

# 17. Implementation Entry Criteria

No Review Center implementation should begin until a separate proposal defines and receives approval for:

1. a real bounded input source or an explicitly fixture-only prototype;
2. the backend projection contract version;
3. failure-isolated read delivery;
4. redaction and maximum record sizes;
5. input-window completeness semantics;
6. existing backend security applied to the read boundary;
7. exact frontend diff and rollback;
8. runtime non-interference tests;
9. whether the surface is distinct or nested under an existing page;
10. AI inclusion or exclusion under BE-9.4;
11. explicit confirmation that no persistence or database is added.

---

# 18. Completion Statement

BE-9.3 is complete as a review-center design.

The design provides four explainable review lenses over one backend-owned `AuthorityInsight` identity. Security, Governance, Drift, and Evidence views can prioritize human investigation while preserving source semantics and evidence limitations. The proposed center cannot execute, authorize, mutate Governance, invent frontend authority, or claim current live readiness.

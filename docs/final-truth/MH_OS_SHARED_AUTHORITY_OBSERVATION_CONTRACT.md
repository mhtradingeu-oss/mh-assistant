# MH-OS Shared Authority Observation Contract

## Status

BE-8.2 shared observation contract design complete.

Documentation only. No observer wiring, runtime decision change, permission enforcement, RBAC, database, governance override, provider execution, or frontend authority is implemented.

Existing backend authorities remain authoritative.

---

# 1. Objective

Define a unified passive record for decisions already produced by:

- `runtime-security-enforcement`;
- `protected-route-authority`;
- `governance-mutation-gate`;
- `provider-execution-gate`.

The contract must support:

- decision capture;
- evidence capture;
- source-aware outcome normalization;
- missing-context detection;
- authority coverage review;
- downstream BE-7 drift analysis.

The observation record describes source behavior. It does not decide runtime behavior.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

BE-8.1 proves that original decisions exist at all four sources, but only Runtime Security exposes a failure-isolated callback. Protected Route and Governance have post-evaluation seams without observers. Provider Gate output is currently classifier evidence nested in Runtime Security.

## 2.2 Scope

This phase defines data and semantic contracts only. It does not select a telemetry transport, create storage, add callbacks, change middleware order, or approve runtime integration.

## 2.3 Authority ownership

Source authorities remain owners of their current decisions and enforcement branches. The observation layer owns only a sanitized, non-authoritative description of an already-produced source result.

## 2.4 Safety boundary

The contract cannot:

- authorize or deny;
- execute or queue;
- override governance;
- replace any security gate;
- authenticate a principal;
- resolve membership, scope, capability, or permission;
- call `next()` or write an HTTP response;
- mutate source decisions, policies, approvals, providers, or request state;
- become frontend access-control input.

---

# 3. Contract Principles

1. **Capture after decision:** consume the original decision after its source evaluates it.
2. **Never reevaluate:** do not call the source authority, policy store, approval store, route catalog, or provider classifier again.
3. **Preserve source semantics:** distinguish enforcing outcomes from classifications.
4. **Missing is explicit:** absence cannot become allow, deny, not-applicable, match, or low risk.
5. **Evidence by reference:** prefer sanitized stable references over mutable source objects or raw payloads.
6. **Context-independent capture:** observation cannot require `mhAuthorityContext` to exist.
7. **Fail passive:** capture, normalization, or emission failure cannot reach runtime control flow.
8. **Backend only:** the backend owns observation production; frontend remains projection only.
9. **No persistence assumption:** the record shape is independent of transport and storage.
10. **Bounded data:** fields, arrays, text, and metadata require fixed limits in any future implementation.

---

# 4. SharedAuthorityObservation

```text
SharedAuthorityObservation

contract_version
observation_id
decision_id
parent_decision_id
mode
authoritative
source_authority
source_kind
decision_type
source_version
source_outcome
normalized_outcome
enforced
reason
action
resource
principal_context
workspace_context
project_context
scope_context
capability_context
policy_context
evidence_references
context_status
missing_context
applicability
decision_timestamp
observed_at
record_status
```

Fixed values:

```text
mode = shadow
authoritative = false
```

`authoritative = false` describes the observation record. It does not weaken or reinterpret the authority of the original source decision at its existing runtime boundary.

---

# 5. Identity and Correlation Fields

## 5.1 `contract_version`

Version of the observation record schema and normalization rules.

Initial conceptual value:

```text
mh-authority-observation-v1
```

Contract changes that alter field meaning, source mapping, or normalization require a new version.

## 5.2 `observation_id`

Opaque correlation identifier for records belonging to the same request or bounded authority operation.

Requirements:

- created independently of credentials, personal data, project names, approval IDs, or request payloads;
- available before an observed authority can terminate when future integration is approved;
- safe for logs and bounded telemetry;
- never used as authentication, idempotency, approval, or authorization proof;
- not inferred later from timestamps or route labels.

## 5.3 `decision_id`

Opaque identifier for one source decision snapshot within an observation.

Each source decision has a distinct ID. Repeated evaluation by a source would require a distinct record; the observer must not cause that evaluation.

## 5.4 `parent_decision_id`

Optional link to an already-observed containing decision.

Current example: a Provider Gate classification captured from the Runtime Security decision may reference the runtime-security `decision_id` as its parent. This relationship does not turn the provider classification into an enforcing decision.

---

# 6. Source Fields

## 6.1 `source_authority`

Allowed BE-8 values:

```text
runtime-security-enforcement
protected-route-authority
governance-mutation-gate
provider-execution-gate
```

New source values require contract review.

## 6.2 `source_kind`

```text
ENFORCING_AUTHORITY
CLASSIFIER
```

Current mapping:

| Source authority | Source kind |
|---|---|
| `runtime-security-enforcement` | `ENFORCING_AUTHORITY` |
| `protected-route-authority` | `ENFORCING_AUTHORITY` |
| `governance-mutation-gate` | `ENFORCING_AUTHORITY` |
| `provider-execution-gate` | `CLASSIFIER` |

Provider Gate remains `CLASSIFIER` until a separately governed architecture decision proves a different runtime ownership model. Observation cannot make that change.

## 6.3 `decision_type`

```text
request_authorization
protected_route
governance_mutation
approval_requirement
provider_classification
```

Governance approval-lifecycle decisions may use `approval_requirement`. Provider classification must not use `provider_execution` unless the observed source is an actual provider execution owner under a future contract.

## 6.4 `source_version`

Stable code, catalog, configuration, or policy version relevant to the source decision.

When no trustworthy version is available:

- set the field to null;
- add `source_version_missing` to `missing_context`;
- do not invent a version from process start time or document version.

---

# 7. Outcome Fields

## 7.1 `source_outcome`

Sanitized original source label, preserved without semantic rewriting.

Examples:

```text
allowed
approval_required
policy_blocked
PROTECTED_ROUTE_ALLOWED
PROTECTED_ROUTE_APPROVAL_REQUIRED
require_approval
dry_run_only
```

This field must be allowlisted and bounded. It is not a raw source object.

## 7.2 `normalized_outcome`

Allowed values:

```text
ALLOW
DENY
NOT_APPLICABLE
CLASSIFIED_ALLOWED
CLASSIFIED_GATED
CLASSIFIED_NOT_APPLICABLE
UNKNOWN
```

Semantic boundary:

- `ALLOW`, `DENY`, and `NOT_APPLICABLE` apply only to `ENFORCING_AUTHORITY` records;
- `CLASSIFIED_ALLOWED`, `CLASSIFIED_GATED`, and `CLASSIFIED_NOT_APPLICABLE` apply only to `CLASSIFIER` records;
- `UNKNOWN` applies when the original decision is missing, malformed, contradictory, or unsafe to normalize;
- normalized outcomes are observation vocabulary, not runtime instructions.

## 7.3 `enforced`

```text
true | false | null
```

Rules:

- `true` means the source decision participated in its existing enforcement boundary;
- `false` means the source explicitly reported itself outside its enforcing boundary;
- `null` is required for classifiers or when enforcement participation is unknown;
- `enforced` does not state whether the whole request was authorized.

## 7.4 `reason`

A bounded sanitized source reason code or label. Human messages may be included only through separately bounded metadata when necessary; raw responses and request-derived messages are not copied automatically.

---

# 8. Deterministic Normalization

## 8.1 Runtime Security

| Source facts | Normalized outcome |
|---|---|
| `enforced: false` and `allowed: true` | `NOT_APPLICABLE` |
| `enforced: true` and `allowed: true` | `ALLOW` |
| `enforced: true` and `allowed: false` | `DENY` |
| Missing or contradictory facts | `UNKNOWN` |

The route/provider classifications remain evidence or child records. They do not replace the Runtime Security outcome.

## 8.2 Protected Route

| Source facts | Normalized outcome |
|---|---|
| `allowed: true` | `ALLOW` |
| `allowed: false` | `DENY` |
| Missing or malformed `allowed` | `UNKNOWN` |

Proof-presence booleans remain evidence facts and do not independently determine the normalized outcome.

## 8.3 Governance Mutation

| Source facts | Normalized outcome |
|---|---|
| `allowed: true` | `ALLOW` |
| `allowed: false`, including approval-required or policy-blocked | `DENY` |
| Missing or malformed `allowed` | `UNKNOWN` |

The original governance `decision` and `reason` remain preserved. Normalizing both policy-blocked and approval-required to `DENY` does not erase their different evidence semantics.

## 8.4 Provider Gate

| Source facts | Normalized outcome |
|---|---|
| Classification applies and `allowed: true` | `CLASSIFIED_ALLOWED` |
| Classification applies and `allowed: false` | `CLASSIFIED_GATED` |
| Source explicitly reports non-applicability | `CLASSIFIED_NOT_APPLICABLE` |
| Missing or malformed classification | `UNKNOWN` |

`CLASSIFIED_ALLOWED` does not prove provider execution, request authorization, approval, configuration, queueing, or successful side effect.

---

# 9. Action and Resource Fields

## 9.1 `action`

Canonical bounded action identifier supplied by the source decision or its already-known caller context.

Rules:

- do not derive permission actions from UI labels;
- do not call a classifier to recreate an action;
- missing action adds `action_correlation_missing`;
- normalization mappings require versioning.

## 9.2 `resource`

Bounded resource reference relevant to the source boundary.

Requirements:

- use stable identifiers or sanitized route templates when available;
- exclude raw URLs containing secrets or personal data;
- do not treat a project label as a workspace boundary;
- missing resource adds `resource_correlation_missing`.

---

# 10. ContextEnvelope

Each context field uses:

```text
ContextEnvelope

status
reference
source
evidence_references
```

Allowed `status` values:

```text
PRESENT
ABSENT
UNTRUSTED
NOT_APPLICABLE
```

Rules:

- `PRESENT` requires a trustworthy backend source and stable reference;
- `ABSENT` means no context was supplied and is not equivalent to an empty grant set;
- `UNTRUSTED` means supplied context failed provenance, integrity, correlation, or redaction validation;
- `NOT_APPLICABLE` requires explicit source semantics and cannot be inferred from absence;
- frontend, actor labels, route scope requirements, or write-key presence cannot establish membership or permission context.

---

# 11. Required Context Meanings

## 11.1 `principal_context`

Reference to an authenticated principal assertion already established by an existing backend guard.

Current compatibility service identity may be referenced as such. It cannot be reinterpreted as a human user or workspace member.

## 11.2 `workspace_context`

Reference to a trustworthy workspace boundary. Current safe default is `ABSENT` because `mh-authority-context-v1.workspace_id` is null.

## 11.3 `project_context`

Reference to the project boundary supplied by the current route or source decision when trustworthy. Project context does not imply workspace authority.

## 11.4 `scope_context`

Reference to supplied and required scope evidence. Route `requiredScope` is requirement evidence only, not a granted scope.

## 11.5 `capability_context`

Reference to capability/provider classification evidence. Provider labels and risk do not prove permission or execution.

## 11.6 `policy_context`

Reference to applicable security, governance, approval, route, or provider policy evidence. Mutable policy objects require stable version or integrity references; otherwise the context is partial or untrusted.

---

# 12. EvidenceReference

```text
EvidenceReference

evidence_id
decision_reference
evidence_type
source_authority
source_reference
provenance_status
version
integrity_reference
captured_at
metadata
```

## 12.1 Evidence types

Initial vocabulary:

```text
authentication_assertion
route_classification
protected_route_configuration
protected_route_proof_presence
governance_policy
approval_decision
approval_requirement
provider_classification
provider_execution_result
source_decision_snapshot
```

`provider_execution_result` may be used only when an actual execution owner supplies that result under a separately reviewed contract. Provider Gate classification cannot produce it.

## 12.2 Provenance status

```text
VERIFIED
PARTIAL
MISSING
UNTRUSTED
```

## 12.3 Evidence rules

- evidence references bind to the same `decision_id`;
- mutable source objects require stable version/hash/reference semantics;
- observation time cannot substitute for source decision time;
- raw policy documents, approval payloads, request bodies, provider payloads, and credentials are forbidden;
- actor/requester data from request input must be labeled untrusted unless independently established;
- evidence metadata is allowlisted, bounded, and recursively sanitized;
- absence is represented by gap codes, not fabricated references.

---

# 13. Context Status and Missing Context

## 13.1 `context_status`

```text
COMPLETE
PARTIAL
MISSING
UNTRUSTED
```

Meanings:

- `COMPLETE`: all context required for this source observation and declared downstream comparison is present and trustworthy;
- `PARTIAL`: the original decision is trustworthy, but one or more non-terminal context/evidence elements are absent;
- `MISSING`: material correlation or comparison context was not supplied;
- `UNTRUSTED`: supplied context is malformed, unsafe, contradictory, secret-bearing, or lacks valid provenance.

`COMPLETE` describes observation context, not permission completeness and not request authorization.

## 13.2 `missing_context`

A bounded array using BE-7 reason codes plus two BE-8 observation-specific extensions:

```text
source_decision_missing
source_version_missing
observation_id_missing
authority_context_unavailable
authority_coverage_incomplete
authority_coverage_unknown
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

Rules:

- codes describe observation and comparison readiness only;
- a missing workspace or permission context does not change the current source outcome;
- `authority_context_unavailable` is expected for some early protected-route decisions;
- `provider_result_missing` is expected when only provider classification is observed;
- context gaps flow downstream to `MISSING_EVIDENCE` or `UNTRUSTED_CONTEXT` under the BE-7 drift contract.

BE-8 extension mapping:

| BE-8 observation code | BE-7 downstream representation |
|---|---|
| `authority_context_unavailable` | Preserve as evidence detail and emit the specific missing principal/workspace/scope/etc. BE-7 codes that apply; otherwise `UNTRUSTED_CONTEXT` |
| `authority_coverage_unknown` | `authority_coverage_incomplete` plus `UNTRUSTED_CONTEXT` when applicability cannot be established |

An adapter must not drop the specific BE-7 missing-context codes merely because an extension code is present.

---

# 14. Applicability

```text
applicability

status
source
reason
```

Allowed status values:

```text
APPLICABLE
NOT_APPLICABLE
UNKNOWN
```

Rules:

- source applicability must come from explicit current route/gate configuration or the source's own returned semantics;
- an absent decision cannot prove `NOT_APPLICABLE`;
- provider classifier applicability does not prove provider execution applicability;
- the observer cannot run authorities to discover applicability;
- unknown applicability reduces authority-chain coverage trust.

---

# 15. Time Fields

## 15.1 `decision_timestamp`

Time the source decision was produced, when the source supplies or the immediate passive adapter can attach it without reevaluation.

## 15.2 `observed_at`

UTC ISO 8601 time the passive adapter captured the snapshot.

Rules:

- keep both values distinct;
- missing source time adds `timestamp_missing` when material;
- time proximity cannot create correlation;
- wall-clock time cannot be used as authentication, ordering authority, or idempotency proof.

---

# 16. Record Status

```text
VALID
PARTIAL
UNTRUSTED
```

- `VALID`: source decision and required record semantics are trustworthy;
- `PARTIAL`: original decision is trustworthy but evidence/context is incomplete;
- `UNTRUSTED`: source decision snapshot or record integrity cannot be trusted.

Record status never changes the original decision and is not a runtime allow/deny outcome.

---

# 17. AuthorityObservationChain

Downstream coverage may assemble records without modifying them:

```text
AuthorityObservationChain

contract_version
observation_id
records
declared_applicable_authorities
observed_authorities
missing_authorities
unknown_applicability
chain_context_status
current_runtime_summary
closed_at
closure_reason
```

## 17.1 Chain rules

- every record retains its source and decision ID;
- `declared_applicable_authorities` comes from explicit configuration evidence, not observer inference;
- `observed_authorities` comes only from valid captured records;
- missing authorities remain missing;
- classifiers never fill enforcing-authority coverage;
- a captured denial may summarize the current chain as deny for reporting, but cannot itself prove later authorities were not applicable;
- a request-level allow summary requires complete applicable enforcing-authority coverage;
- unknown or incomplete coverage produces an unknown/untrusted summary;
- chain assembly cannot delay the request or require source decisions to wait for telemetry.

## 17.2 Closure reasons

```text
request_completed
source_denied
source_terminated
observation_window_closed
observer_failed
unknown
```

Closure describes observation lifecycle only. `source_denied` records a fact already decided by a current gate.

---

# 18. Drift Compatibility

The shared observation contract supplies current-side inputs for:

- BE-7 `ObservedRuntimeDecision`;
- BE-7 evidence envelopes;
- BE-7 missing-context reason codes;
- BE-7 `DriftRecord` source authority and decision type;
- BE-7 `MATCH`, `LOW_RISK_DRIFT`, `HIGH_RISK_DRIFT`, and `UNTRUSTED` evaluation.

Rules:

- BE-8 does not create the future expected decision;
- current-only observations measure coverage but cannot prove model parity;
- incomplete chain coverage maps to `UNTRUSTED` for request-level drift;
- Provider Gate classification requires capability/provider evidence on the compared side and cannot be compared as a terminal execution outcome;
- drift processing is downstream, pure for supplied records, and non-authoritative.

---

# 19. Redaction and Boundedness

Forbidden observation data:

- authorization headers;
- cookies and sessions;
- read/write/control/provider/API keys;
- passwords, tokens, secrets, and credentials;
- raw request or response bodies;
- raw provider payloads;
- mutable policy or approval objects without allowlisting;
- personal data not required for authority evidence;
- actor/user claims not independently established by backend authority.

A future implementation contract must define maximum:

- record size;
- evidence-reference count;
- missing-context count;
- text length;
- nesting depth;
- records per observation;
- telemetry rate and sampling.

Truncation must be explicit and must reduce context/record status when material.

---

# 20. Production and Consumption

## 20.1 Permitted producers

Only backend passive adapters located after current source evaluation may produce these records.

## 20.2 Permitted consumers

- backend coverage review;
- evidence-quality analysis;
- BE-7 drift analysis;
- architecture readiness reporting;
- bounded operational alerts requesting investigation.

## 20.3 Forbidden consumers

- authentication or authorization branches;
- middleware continuation or response code logic;
- permission enforcement;
- governance decisions or approval mutation;
- provider execution, queues, or workflows;
- frontend access-control or visibility decisions;
- any consumer treating absent records as permission or safety proof.

---

# 21. Failure Contract

Observation must fail passive:

- source decisions and objects are not mutated;
- adapter errors cannot escape into source control flow;
- emission loss cannot alter allow/deny or classification;
- no synchronous network, database, provider, filesystem, policy, or approval I/O occurs inside an authority callback;
- telemetry backpressure cannot delay a request;
- unsafe snapshots become `UNTRUSTED` when safe to record, otherwise they are dropped;
- drops require bounded operational counters only under a future approved transport design;
- failure never becomes allow, deny, or not-applicable.

---

# 22. Storage Boundary

BE-8.2 creates no database and approves no persistence mechanism.

Any future transport or retention proposal requires a separate decision covering:

- backend ownership;
- isolation boundaries;
- access control;
- bounded buffering and failure behavior;
- sampling and cardinality;
- retention and deletion;
- redaction verification;
- stable-reference integrity;
- operational monitoring;
- rollback.

Logs, request context, memory buffers, files, and databases are not selected by this contract.

---

# 23. Review Checklist

The contract is valid only when:

- all four source authorities retain their existing ownership;
- enforcing and classifier outcomes cannot be confused;
- normalized outcomes cannot control runtime;
- original decisions are captured without reevaluation;
- observation works without `mhAuthorityContext`;
- evidence is referenced, sanitized, and bounded;
- missing context is explicit and BE-7 compatible;
- incomplete authority coverage cannot become request-level allow or match;
- no database, permission system, RBAC, resolver, or frontend authority is introduced;
- failures are isolated from source decisions.

---

# 24. BE-8.2 Review Result

The contract defines a single passive record that preserves source authority semantics, captures evidence, normalizes outcomes safely, exposes missing context, and supplies current-side inputs for drift analysis.

It does not approve runtime integration.

BE-8.2 is complete as documentation. The next safe action is the Observation Adapter Design defining source-specific passive seams, adapter responsibilities, and validation requirements.

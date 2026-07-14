# MH-OS Authority Observation Adapter Design

## Status

BE-8.3 observation adapter design complete.

Documentation only. No adapter module, callback, runtime decision change, permission enforcement, RBAC, database, governance override, provider execution, middleware change, or frontend authority is implemented.

Existing backend authorities remain authoritative.

---

# 1. Objective

Define how future passive adapters may convert original current-source decisions into `SharedAuthorityObservation` records without changing source behavior.

Adapters in scope:

- Runtime Security Observation Adapter;
- Protected Route Observation Adapter;
- Governance Observation Adapter;
- Provider Classification Observation Adapter;
- shared normalization, evidence, correlation, and handoff boundaries.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

The active runtime provides:

- one existing failure-isolated Runtime Security callback;
- one Protected Route decision immediately before its current allow/deny branch;
- one Governance decision in each of two server wrappers immediately before their current branches;
- Provider Gate classification nested in the original Runtime Security decision;
- no unified transport, observation ID lifecycle, or storage owner.

Existing checks validate source classifications and governance lifecycle behavior, but do not yet prove observer equivalence, redaction, correlation, or callback-failure isolation across all four sources.

## 2.2 Scope

This design names conceptual components, future source seams, adapter inputs/outputs, forbidden dependencies, and required tests. It does not authorize a source patch.

## 2.3 Authority ownership

Adapters consume decisions. They do not own, recalculate, or return decisions. Every current gate and classifier retains its existing source function, caller, branch, response, and side-effect boundary.

## 2.4 Safety boundary

An adapter must never:

- authorize or deny;
- execute, queue, publish, send, sync, or mutate;
- override governance or approval state;
- replace or wrap a gate in a way that controls its result;
- call `next()`, access response-writing capability, or return middleware instructions;
- call a source authority again;
- perform synchronous external I/O;
- expose observation output to frontend authority.

---

# 3. Architecture

```text
Current Source Decision
        |
        v
Source-Specific Passive Adapter
        |
        v
Shared Pure Normalizer + Evidence Sanitizer
        |
        v
Non-Blocking Backend Handoff Boundary
        |
        +--> Coverage Assembly
        |
        +--> BE-7 Drift Analysis

Runtime control continues directly from the Current Source Decision.
The observation branch cannot return into runtime control.
```

The observation path is a side branch after source evaluation. The existing source decision proceeds to its current consumer regardless of observation success or failure.

---

# 4. Conceptual Components

## 4.1 Observation Correlation Provider

Responsibility:

- supply an opaque `observation_id` to each source adapter;
- supply a new `decision_id` per source decision;
- preserve correlation across early termination when available;
- avoid identity, permission, approval, or idempotency semantics.

Boundary:

- adapter design accepts correlation as input;
- BE-8 does not choose whether a future integration uses dedicated request metadata, an invocation envelope, or another ephemeral carrier;
- the carrier must not be consumed by any authority decision;
- the carrier must not contain credentials, principal claims, payload-derived IDs, or business state;
- a missing correlation input produces explicit gap codes rather than locally inferred correlation.

This unresolved carrier choice must be decided in a future implementation contract before any source patch.

## 4.2 Source-Specific Snapshot Adapter

Responsibility:

- receive the original decision and minimal already-known caller metadata;
- copy only allowlisted facts;
- preserve source labels and source kind;
- attach context/evidence references already available at the seam;
- report missing facts explicitly;
- call the shared normalizer once.

It may not:

- read mutable source stores;
- call classification/evaluation helpers;
- inspect credentials;
- retain `req`, `res`, or mutable decision objects beyond the callback;
- derive authority from response status.

## 4.3 Shared Observation Normalizer

Conceptual function:

```text
normalizeAuthorityObservation(adapter_input)
  -> SharedAuthorityObservation
```

Properties:

- pure for a supplied immutable snapshot;
- deterministic for a contract version;
- source-aware;
- bounded;
- no I/O;
- no access to middleware continuation or response objects;
- returns observation vocabulary only.

## 4.4 Evidence Sanitizer

Responsibility:

- allowlist keys per source;
- replace mutable objects with stable references when available;
- redact forbidden names and secret-like text;
- bound depth, array count, text length, and record size;
- mark truncation or invalid provenance;
- emit no credential or raw request/response/provider body.

The current identity-adapter sanitizer is evidence of an existing bounded approach, but reuse or extraction requires a separate implementation review. The design does not assume that its current blocked-key policy is sufficient for governance or provider evidence.

## 4.5 Non-Blocking Handoff Boundary

Conceptual interface:

```text
handoff(observation_record) -> void
```

Requirements:

- the source callback does not await it;
- it performs no network, database, filesystem, provider, policy, or approval I/O in source control flow;
- it accepts an immutable bounded record;
- backpressure, overflow, or failure returns no runtime instruction;
- throws are contained by the source adapter boundary;
- transport and retention remain undecided.

No implementation may treat this conceptual interface as approval for a process-global unbounded queue.

## 4.6 Authority Chain Assembler

Responsibility:

- group supplied records by `observation_id`;
- retain source order and independent outcomes;
- compare explicitly declared applicable sources with observed sources;
- emit missing/unknown coverage;
- provide current-side input to BE-7 drift analysis.

Boundary:

- downstream of runtime control;
- cannot wait on or block the request;
- cannot infer applicability from absence;
- cannot convert classifier records into enforcing coverage;
- cannot produce an authoritative request outcome.

---

# 5. Adapter Input Contract

```text
AuthorityObservationAdapterInput

contract_version
observation_id
decision_id
parent_decision_id
source_authority
source_kind
decision_type
source_version
decision_snapshot
request_metadata
context_references
evidence_candidates
applicability
decision_timestamp
observed_at
```

## 5.1 `decision_snapshot`

An immutable allowlisted snapshot of the original returned decision. The source adapter constructs it synchronously at the immediate seam.

## 5.2 `request_metadata`

Allowlisted correlation facts only:

```text
method
route_template_or_sanitized_path
project_reference
action
resource
```

Forbidden:

- headers;
- cookies;
- query/body payloads except already-normalized allowlisted source identifiers;
- IP addresses or user-agent strings unless a future privacy review explicitly requires them;
- actor identity from request input;
- credentials or proofs.

## 5.3 `context_references`

References already available from current trusted backend context. Absent context is valid adapter input and must be represented explicitly.

## 5.4 `evidence_candidates`

Source facts eligible for allowlisting. Candidates are not evidence until sanitized and assigned provenance status.

---

# 6. Adapter Output Contract

Each source adapter outputs exactly one of:

```text
SharedAuthorityObservation

or

No record, with a bounded observer-failure counter under a future approved handoff design
```

Rules:

- unsafe data is not emitted merely to preserve coverage;
- if a safe partial record can be built, mark it `PARTIAL` or `UNTRUSTED` with gap codes;
- a missing record remains missing in chain coverage;
- adapter failure cannot be represented as a source denial or allow;
- the adapter returns nothing to the source branch.

---

# 7. Runtime Security Observation Adapter

## 7.1 Existing seam

Future integration may reuse `createRuntimeSecurityEnforcementMiddleware(options).observeDecision`.

The existing callback runs:

```text
classifyRuntimeSecurityDecision
        ↓
observeDecision (failure isolated)
        ↓
existing allow/deny branch
```

## 7.2 Adapter input mapping

| Current fact | Observation field |
|---|---|
| `decision.enforced` | `enforced` |
| `decision.allowed` | normalized outcome input |
| `decision.reason` | `reason` and source outcome evidence |
| `decision.routeClassification` | route classification evidence reference/snapshot |
| `decision.providerClassification` | Provider Classification child input or nested evidence |
| `req.method` | allowlisted method metadata |
| `req.path` | sanitized path or reviewed route template |
| `req.mhAuthorityContext` when present | context references only |
| authority context absent | `authority_context_unavailable` and specific missing-context codes |

`hasAuthorizedWriteKey` may be represented only as a boolean source fact such as `authentication_present`. The key itself is forbidden, and the boolean cannot establish membership or permission.

## 7.3 Required behavior

- record allowed, denied, and not-applicable decisions;
- work when `mhAuthorityContext` is absent;
- retain existing callback `try/catch` isolation;
- preserve the existing decision object unchanged;
- never change the subsequent `next()` or denial response branch;
- extract Provider Gate evidence from the already-returned decision only;
- never call `classifyRoute` or `classifyProviderAction` again.

## 7.4 Forbidden behavior

- replacing the existing runtime-security decision with normalized outcome;
- attaching observer errors to the response;
- skipping enforcement when handoff fails;
- interpreting provider `allowed` as request authorization;
- persisting raw request data.

---

# 8. Protected Route Observation Adapter

## 8.1 Future seam

The safe conceptual seam is immediately after `isProtectedRouteAllowed` returns inside `enforceProtectedRouteAuthority` and before the existing branch consumes the result:

```text
isProtectedRouteAllowed
        ↓
original decision
        ├──> passive observe callback (failure isolated)
        ↓
existing allowed branch or existing denial response
```

No middleware ordering change is permitted.

## 8.2 Conceptual callback

```text
observeDecision({
  source: protected-route-authority,
  decision,
  route_authority_metadata,
  correlation,
  context_references
}) -> void
```

The observer receives no `res` or `next` capability. Request data must be reduced to allowlisted metadata before invocation.

## 8.3 Adapter input mapping

| Current fact | Observation field |
|---|---|
| `decision.allowed` | normalized outcome input |
| `decision.code` | `source_outcome` |
| `decision.status` | bounded evidence metadata, not normalization authority |
| `decision.route_id` | resource/configuration reference |
| `decision.authority` | protected-route policy evidence |
| `decision.category` | bounded classification evidence |
| `decision.forbidden_action` | action/capability evidence |
| `decision.proof` booleans | proof-presence evidence only |

## 8.4 Required behavior

- observe allow and deny;
- operate without `mhAuthorityContext`;
- preserve response status/body exactly;
- preserve allowed request-field behavior exactly;
- catch callback/normalizer/handoff failures;
- mark approval proof as presence, not validated governance approval;
- attach missing context rather than synthesize principal/workspace evidence.

## 8.5 Forbidden behavior

- moving Protected Route middleware after authentication context;
- passing raw proof/header/body/query values;
- converting proof presence into approval evidence;
- changing `enforceProtectedRouteAuthority` return value;
- allowing observer output to influence the branch.

---

# 9. Governance Observation Adapter

## 9.1 Future seams

Two server wrapper seams require equivalent observation:

```text
evaluateGovernanceMutationGate
        ↓
original decision
        ├──> passive observe callback
        ↓
existing allow or denial response
```

```text
evaluateGovernanceApprovalLifecycle
        ↓
original decision
        ├──> passive observe callback
        ↓
existing approval attachment / allow / denial response
```

Observation occurs after evaluation and before the unchanged branch. The evaluator is never called by the adapter.

## 9.2 Conceptual callback

```text
observeGovernanceDecision({
  decision,
  boundary_type,
  action,
  project_reference,
  entity_reference,
  correlation,
  context_references
}) -> void
```

## 9.3 Allowlisted mapping

| Current fact | Observation field |
|---|---|
| `decision.allowed` | normalized outcome input |
| `decision.decision` | `source_outcome` |
| `decision.reason` | `reason` |
| `decision.code` | bounded governance evidence |
| action/project from wrapper input | action and project reference |
| policy key/version when available | policy evidence reference |
| approval ID/status/time when trustworthy | approval evidence reference |
| selector entity/action identifiers | bounded resource/correlation evidence |

## 9.4 Required behavior

- observe both outcomes in both wrappers;
- snapshot the original decision before later mutation can occur;
- never retain mutable policy or approval objects directly;
- label request-derived actor/requester identity untrusted unless independently established;
- preserve policy-blocked versus approval-required source semantics;
- add missing policy/approval/version codes when references are absent;
- catch adapter failure before the existing branch continues;
- preserve logging, response, approval attachment, and return behavior exactly.

## 9.5 Forbidden behavior

- reevaluating policy or approval stores;
- creating or resolving approval records;
- changing governance denial logging;
- suppressing a denial because observation failed;
- treating an approval ID as approved status;
- copying raw setup, approval, notes, or request payloads;
- placing adapter logic inside governance decision rules.

---

# 10. Provider Classification Observation Adapter

## 10.1 Current seam

The current safe source is `decision.providerClassification` already returned inside the Runtime Security decision.

BE-8 design does not require changing `classifyProviderAction` or adding a second call.

## 10.2 Child-record strategy

When a provider classification is present, the Runtime Security adapter may create:

- one Runtime Security enforcing-authority observation;
- one Provider Gate classifier observation whose `parent_decision_id` references the Runtime Security record.

Alternatively, a future implementation may retain the classification as evidence inside the Runtime Security record. The implementation contract must choose one deterministic strategy and prevent double counting.

## 10.3 Allowlisted mapping

| Current fact | Observation field |
|---|---|
| `provider` | capability/provider evidence |
| `risk` | bounded risk metadata |
| `status` | source classification state |
| `execution` | applicability evidence |
| `allowed` | classifier normalization input |
| `decision` | `source_outcome` |
| `requiredScope` | required-scope evidence only |
| `reason` | `reason` |
| `auditEvent` | audit evidence label |

## 10.4 Required behavior

- set `source_kind: CLASSIFIER`;
- use only `CLASSIFIED_*` normalized outcomes;
- link to the containing Runtime Security decision when emitted separately;
- preserve configured/approved input limitations as evidence context;
- mark actual provider result missing when drift analysis requires it;
- avoid duplicate provider records for one classification.

## 10.5 Forbidden behavior

- calling `classifyProviderAction` from the adapter;
- treating `CLASSIFIED_ALLOWED` as execution or request allow;
- claiming an approval was validated from write-key presence;
- observing provider secrets or payloads;
- claiming queue/provider success;
- expanding BE-8 into provider execution-result integration.

---

# 11. Context Detection Adapter

The shared normalizer evaluates supplied context references without looking up missing facts.

Evaluation order:

```text
1. Validate correlation IDs.
2. Validate source decision presence and source kind.
3. Validate action and resource correlation.
4. Validate principal/project/workspace references when supplied.
5. Validate source-specific policy, approval, scope, and capability evidence.
6. Record absent context.
7. Record untrusted or forbidden context.
8. Assign context_status and record_status.
```

Rules:

- workspace remains absent when current context supplies null;
- empty roles/permissions do not become an authoritative empty grant set;
- required scope does not become supplied scope;
- project does not become workspace;
- actor labels do not become principals;
- missing context does not alter normalized source outcome;
- untrusted evidence cannot be repaired by confidence scoring.

---

# 12. Observation and Runtime Control Separation

Required control structure for every future seam:

```text
decision = current_source_evaluation(...)

try:
    passive_observation(decision_snapshot)
catch:
    ignore_for_runtime_control

consume_current_decision_exactly_as_before(decision)
```

Forbidden control structure:

```text
observation = passive_observation(...)
if observation.normalized_outcome == ALLOW:
    continue_request
```

Adapter output must be structurally unavailable to the current decision branch. A future implementation should prefer a void callback and immutable snapshot to make that boundary explicit.

---

# 13. Sequencing and Ordering

Expected observation order may be:

```text
Protected Route
Runtime Security
Provider Classification child
Governance Mutation or Approval Lifecycle
```

But the design must not assume every source runs:

- an earlier source may deny;
- a route may not be sensitive to Runtime Security;
- governance may not apply to the handler;
- provider classification may be null;
- middleware/order may differ by route.

Only explicit applicability evidence can classify a missing source as not applicable. Sequence position alone is insufficient.

---

# 14. No-Transport Decision

BE-8.3 intentionally does not choose:

- database;
- file storage;
- log format;
- message queue;
- network collector;
- in-process queue;
- retention period;
- alerting platform;
- frontend projection.

Reason: source adapters can be designed and validated independently of telemetry infrastructure. Selecting a transport requires separate ownership, privacy, failure, retention, isolation, and rollback review.

No adapter source patch is safe until a bounded handoff behavior is approved, even if the record contract is complete.

---

# 15. Future File Boundary

This section identifies a possible minimal future proposal. It does not approve file creation or edits.

| Future concern | Candidate boundary | Design disposition |
|---|---|---|
| Pure shared normalization/sanitization | New backend security helper under `runtime/orchestrator-service/lib/security/` | Candidate only |
| Runtime Security wiring | Existing `observeDecision` configuration in `server.js` | Reuse candidate |
| Protected Route callback | `protected-route-authority.js` immediately after evaluation | Candidate only |
| Governance callbacks | Two existing wrappers in `server.js` | Candidate only |
| Provider classification | Runtime Security adapter consumes existing nested result | No Provider Gate source edit expected |
| Correlation carrier | Undecided future integration boundary | Blocker |
| Handoff/transport | Undecided backend-owned boundary | Blocker |
| Tests | Existing backend check scripts plus focused new observer-equivalence checks | Required before patch |

No frontend file is a valid adapter boundary.

---

# 16. Validation Design

## 16.1 Pure contract tests

Required cases:

- every source mapping;
- all normalized outcomes;
- enforcing/classifier vocabulary rejection;
- missing and untrusted context;
- correlation and evidence-reference validation;
- deterministic output for the same immutable input;
- bounded text, depth, arrays, records, and truncation;
- forbidden-key and secret-pattern redaction;
- BE-7 gap-code mapping;
- provider child linkage and duplicate prevention.

## 16.2 Runtime equivalence tests

For each instrumented enforcing source, compare observer:

```text
absent
successful
throwing
handoff unavailable
malformed adapter output
```

The following must remain byte/behavior equivalent where applicable:

- source decision object;
- `next()` count and timing boundary;
- HTTP status;
- response JSON;
- current log behavior;
- approval attachment;
- protected-route request field;
- provider classification;
- mutation/provider side effects;
- middleware order.

## 16.3 Coverage tests

- Runtime Security allow, deny, and not-applicable;
- Protected Route allow and each denial family;
- Governance allow, approval-required, policy-blocked, rejected, pending, and approval-created;
- Provider classification allowed, gated, dry-run, read/prepare, and absent;
- early Protected Route denial without authority context;
- Runtime Security decision without authority context;
- incomplete applicable-authority chain;
- source termination before later authorities;
- unknown applicability.

## 16.4 Security tests

- credentials absent from all records;
- raw headers/body/query/provider payload absent;
- request-derived actor identity not trusted;
- approval/policy objects not retained by mutable reference;
- observation IDs contain no business or personal data;
- frontend cannot access records as authority;
- adapter output cannot reach gate branches;
- no external I/O occurs in callback paths.

## 16.5 Performance and failure tests

- bounded synchronous adapter time;
- bounded allocation and record size;
- no request delay from handoff backpressure;
- callback exception containment;
- deterministic drop/partial behavior;
- no unbounded process-global buffer;
- observer removal leaves source behavior intact.

---

# 17. Implementation Entry Criteria

A later runtime proposal must provide all of the following:

- approved correlation carrier;
- approved bounded non-blocking handoff behavior;
- exact module and callback interfaces;
- exact source-file diffs and line-level seams;
- source-specific allowlists and maximum sizes;
- schema validation strategy;
- executable tests from Section 16;
- baseline and post-patch runtime equivalence evidence;
- middleware-order proof;
- governance, approval, provider, project-isolation, and public-alias regression proof;
- rollback removing only observation wiring;
- explicit runtime-change approval.

The contract and adapter design alone do not satisfy these criteria.

---

# 18. Review Checklist

Reviewers must confirm:

- original decisions are captured once and never reevaluated;
- all adapters are post-evaluation and pre-consumption side branches;
- Runtime Security retains its current failure isolation;
- Protected Route observation covers both branches without reordering;
- Governance observation covers both wrappers and both outcomes;
- Provider Gate remains classifier evidence;
- missing context remains explicit;
- normalizer and handoff cannot influence runtime;
- no transport, database, RBAC, permission enforcement, resolver, or frontend authority is approved;
- implementation remains separately gated.

---

# 19. BE-8.3 Review Result

The design provides a unified passive adapter architecture with precise source seams, source-aware mappings, missing-context detection, evidence sanitization, chain coverage, drift compatibility, and runtime-equivalence requirements.

It preserves every current authority and leaves correlation carrier, transport, retention, and runtime wiring unapproved.

BE-8.3 is complete as documentation. The next safe action is the BE-8 Architecture Decision selecting whether the design is accepted, whether runtime observation expansion is approved, and which blockers remain controlling.

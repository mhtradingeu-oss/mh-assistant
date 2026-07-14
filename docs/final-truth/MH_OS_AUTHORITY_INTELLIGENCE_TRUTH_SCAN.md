# MH-OS Authority Intelligence Truth Scan

## Status

BE-9.1 authority intelligence truth scan complete.

Documentation only. No runtime observer, insight generator, report endpoint, AI integration, permission enforcement, RBAC, database, governance mutation, provider action, or frontend behavior is changed.

Existing backend authorities remain authoritative. Frontend surfaces remain projections.

---

# 1. Objective

Audit the current system for the architecture needed to transform passive authority observations into explainable intelligence.

The scan covers:

- observation consumers;
- reporting surfaces;
- governance and review needs;
- AI advisor opportunities;
- evidence and readiness gaps that constrain BE-9.

This scan does not approve runtime observation expansion or an intelligence implementation.

---

# 2. Authority and Safety Proof

## 2.1 Current authority ownership

Current runtime decisions remain owned by their existing backend sources:

| Source | Current responsibility | BE-9 relationship |
|---|---|---|
| `runtime-security-enforcement` | Sensitive-route decision and enforcement | Possible future observation source only |
| `protected-route-authority` | Protected-route decision and enforcement | Possible future observation source only |
| `governance-mutation-gate` | Governance, policy, and approval decision through current wrappers | Possible future observation source and review subject only |
| `provider-execution-gate` | Provider classification consumed by current callers | Possible future classifier evidence only |
| Future Authority Resolver | No runtime decision producer exists | Possible future shadow comparison source only |

BE-9 intelligence cannot become another authority in this chain.

## 2.2 Scope

BE-9.1 is a read-only architecture audit. It does not create:

- observation or drift records;
- an intelligence engine;
- an API or report route;
- persistence, a queue, or a database;
- an AI prompt path;
- a Governance or Insights panel;
- a notification or escalation;
- a runtime decision dependency.

## 2.3 Safety boundary

Authority intelligence may explain records that were already produced. It must never:

- authorize or deny;
- execute, publish, send, sync, queue, or invoke a provider;
- approve, reject, override, or create governance state;
- change policy, membership, scope, capability, or permission;
- replace a security gate or the future Authority Resolver;
- infer an allow, deny, match, or safe state from missing evidence;
- make a frontend label authoritative;
- feed a recommendation back into runtime control.

---

# 3. Foundation Truth

## 3.1 BE-7 status

BE-7 defines `DriftRecord` and the shadow drift comparison model. It proves:

- drift is telemetry only;
- comparison requires already-produced current and expected decisions;
- current request-level comparisons are `UNTRUSTED` while the future Authority Resolver decision producer is absent and current authority coverage is incomplete;
- confidence measures evidence quality, not decision correctness;
- severity is review priority, not execution policy.

## 3.2 BE-8 status

BE-8 accepts a shared passive observation contract and adapter design but explicitly defers runtime expansion. Therefore:

- no unified `SharedAuthorityObservation` is emitted in the current runtime;
- Protected Route and Governance do not emit shared observations;
- the current Runtime Security shadow observation is partial and context-dependent;
- no request-wide authority chain is complete;
- correlation carrier, handoff transport, retention, and access ownership remain undecided;
- no database or persistence owner is approved.

## 3.3 Consequence for BE-9

There is no trustworthy live authority-intelligence input stream today.

BE-9 may define:

- the shape of an explainable insight;
- deterministic transformation rules for supplied records;
- review-center projections;
- an advisory boundary;

but it cannot claim that current runtime data can populate those designs completely.

Any example insight in BE-9 documentation is illustrative and non-live.

---

# 4. Observation Consumer Audit

## 4.1 Actual current consumers

No current module consumes the BE-8 `SharedAuthorityObservation` contract because no runtime implementation exists.

No current module consumes a trusted BE-7 request-level drift stream because:

- no future Authority Resolver decision producer exists;
- current observation coverage is incomplete;
- no shared drift producer or transport is implemented.

The existing Runtime Security observer writes a bounded request-local shadow observation into `mhAuthorityContext` only when that context exists. That record is not consumed by a report, Governance, Insights, AI Command, or a durable monitoring pipeline.

Verdict: **current authority-intelligence consumers are absent**.

## 4.2 Adjacent consumers that are not BE-9 consumers

| Current component | What it consumes now | Why it is adjacent | Why it is not yet an authority-intelligence consumer |
|---|---|---|---|
| Governance backend summary | Policies, approvals, operational collections, events, team model | Already assembles review-oriented backend data | Does not consume shared authority observations or drift records |
| Governance frontend | Backend Governance summary and mutation APIs | Existing review, evidence, policy, and decision surface | Active governance authority surface; cannot derive authority from frontend intelligence |
| Insights backend | Project performance and learning inputs | Already builds read-oriented reporting payloads | Domain is marketing/operational performance, not authority evidence |
| Insights frontend | Backend insights plus client-side presentation logic | Existing reporting and recommendation projection | Does not receive authority observations and includes local derived presentation logic |
| AI Command / AI orchestrator | Project context, user prompts, recommendations, workflows | Existing explanation and handoff mechanisms | Some paths can create durable artifacts or approvals; not a safe implicit consumer without a dedicated advisory boundary |
| Audit scripts and `audits/system-truth` | Static source scans and generated audit files | Existing engineering review evidence | Build-time/manual evidence, not live observation consumption |
| Operational event and recommendation stores | Domain events and recommendations | Existing history and recommendation vocabulary | No authority insight contract, provenance, or confidence semantics |

These components demonstrate useful patterns, not authorization to connect them to BE-9.

## 4.3 Candidate future consumer classes

The system has four legitimate future consumer classes, all downstream and non-authoritative:

1. **Security reviewers** — investigate sensitive-route denials, potential allow expansion, and incomplete enforcement-chain coverage.
2. **Governance reviewers** — inspect policy, approval, override, and protected-action conflicts without changing governance automatically.
3. **Architecture and platform reviewers** — monitor drift, source coverage, contract versions, and observation health.
4. **Evidence reviewers** — resolve missing, stale, unsafe, or weakly correlated evidence.

An AI advisor may assist these consumers only through the advisory constraints in Section 7.

---

# 5. Reporting Surface Audit

## 5.1 Governance surface

The current Governance surface is backend-backed and can:

- display approval queues, policy violations, claim review, brand safety review, publish guardrails, escalations, and an audit timeline;
- create approval requests;
- record approval, rejection, changes-requested, escalation, and override decisions;
- update durable governance policy.

It also displays evidence guidance and explanation-only AI prompts.

Suitability:

- strong candidate for a future link or projection into governance-oriented authority insights;
- existing ownership, risk, evidence, and review vocabulary aligns with BE-9;
- active mutation controls make boundary separation mandatory.

Constraint:

An authority insight displayed in Governance cannot itself be an approval, policy violation, override, or decision. Any human mutation must continue through the existing backend Governance API and current enforcement.

## 5.2 Insights surface

The current Insights surface:

- projects project performance, learning, and optimization recommendations;
- supports refresh;
- creates confirmed review handoffs to other surfaces and AI Command;
- does not approve, publish, or execute AI automatically.

Suitability:

- useful pattern for read-only reporting, prioritization, explanations, and destination-owned handoffs;
- appropriate candidate for an authority-report summary if a backend authority-intelligence projection is later approved.

Constraint:

Current client-side recommendation builders are not an acceptable source of authority intelligence. BE-9 authority insight classification, drift level, evidence quality, and confidence must originate in a backend-owned contract. The frontend may sort or filter supplied projections but cannot manufacture authoritative meaning.

## 5.3 Engineering audit surfaces

The repository contains source-audit scripts and generated system-truth reports for Governance, Insights, security, runtime authority, and action paths.

Suitability:

- valuable for design validation, regression review, and implementation-readiness evidence;
- useful future consumers of aggregate coverage reports or contract conformance output.

Constraint:

Static audits cannot substitute for original runtime decision observations. Source scans can prove code shape and guard presence, not the authority result for a specific request.

## 5.4 Notifications, Home, and Operations surfaces

These surfaces can eventually project counts or review links, but they are not suitable primary owners because:

- summary counts omit evidence needed for explanation;
- notifications risk turning uncertainty into alarm without context;
- Home and Operations aggregate several domains and could blur authority ownership;
- no authority-intelligence backend payload exists.

They should remain optional secondary projections behind a dedicated review contract.

## 5.5 Reporting ownership conclusion

The backend must own:

- insight generation from supplied passive records;
- source semantics;
- drift and evidence classification;
- recommendation text or recommendation codes;
- confidence computation;
- redaction and evidence-reference safety.

The frontend may own:

- layout;
- filtering and sorting within supplied fields;
- selection state;
- navigation to the existing authoritative backend surface;
- clearly labeled report export if separately approved.

The frontend must not own authority conclusions.

---

# 6. Governance and Review Needs

## 6.1 Explainability

Every future insight must answer:

- which source authority produced the underlying record;
- which decision area is affected;
- whether the source is enforcing or classifying;
- what drift or evidence condition triggered review;
- which safe evidence references support the explanation;
- how evidence quality limits the conclusion;
- why the recommendation is advisory;
- what the reviewer should inspect next.

## 6.2 Review separation

One undifferentiated authority queue would mix materially different work. The architecture needs separate views for:

- security review;
- governance review;
- drift review;
- evidence review.

An insight may appear in more than one view, but it must retain one identity and one backend-produced meaning.

## 6.3 Priority without enforcement

Review priority may use supplied severity, drift state, evidence quality, age, and source coverage. Priority cannot:

- block a request;
- create an approval;
- automatically escalate governance;
- change a source decision;
- claim a trusted mismatch when context is untrusted.

In particular, missing evidence must remain an evidence problem. It cannot be described as proof that the runtime allowed or denied incorrectly.

## 6.4 Evidence requirements

Useful review requires:

- stable sanitized evidence references;
- source and contract versions;
- timestamps for the source decision and derived insight;
- explicit applicable-versus-observed authority coverage;
- provenance and freshness status;
- separation of source facts, normalized facts, and recommendation;
- bounded redacted text;
- no credentials, raw request bodies, provider payloads, or actor-inferred identity.

Current coverage does not meet these requirements request-wide.

## 6.5 Lifecycle requirements

A future implementation will need explicit rules for:

- duplicate observations and duplicate insights;
- superseded evidence;
- record freshness;
- acknowledgement versus resolution;
- reviewer notes;
- retention and deletion;
- report access;
- export safety;
- recalculation when contract versions change.

BE-9 does not select persistence or implement this lifecycle. Without a database, the contract must not pretend to provide durable acknowledgement or resolution state.

## 6.6 Governance conflict boundary

Authority Intelligence may recommend that a reviewer inspect or use Governance. It cannot:

- create a governance approval automatically;
- mark an insight resolved because an approval exists;
- approve or reject an item;
- update policy;
- infer that a governance decision authorizes provider or runtime execution;
- use an AI-generated rationale as approval evidence.

---

# 7. AI Advisor Opportunity Audit

## 7.1 Safe advisory opportunities

Given a bounded backend-produced insight and safe evidence references, an AI advisor could:

- explain an unfamiliar authority source in plain language;
- summarize why an insight was raised;
- distinguish enforcing decisions from classifier evidence;
- translate evidence-gap codes into reviewer checklists;
- group related insights for human review;
- suggest the next read-only investigation step;
- draft a review note for human editing;
- identify repeated observation-quality problems;
- describe which authoritative backend surface owns any follow-up action.

## 7.2 Unsafe opportunities

An AI advisor must not:

- produce or alter `drift_level`, `evidence_quality`, or contract confidence from raw runtime data without a reviewed deterministic backend layer;
- decide whether a request should be allowed;
- approve, reject, override, or create governance records;
- change policy, permission, membership, scope, or capability;
- execute a recommended action;
- invoke a provider;
- silently turn a suggestion into a task, workflow, handoff, notification, or escalation;
- treat generated prose as source evidence;
- reveal secret-bearing or personal evidence;
- claim root cause when evidence supports only correlation or missing context.

## 7.3 Existing AI paths

The repository already demonstrates two different AI boundaries:

- Governance AI prompts are explanation-only and do not directly call governance mutation APIs.
- AI orchestration can create durable recommendations, tasks, handoffs, and approvals in some action modes.

Therefore a future BE-9 advisor cannot be connected to the general AI orchestration path by implication. It requires a dedicated read-only advisory contract whose output has no mutation or execution adapter.

## 7.4 Minimum AI input

The advisor should receive only:

- the versioned `AuthorityInsight` projection;
- bounded source and drift labels;
- safe evidence summaries or references already approved for advisory use;
- explicit missing-context markers;
- the allowed review destination vocabulary.

It should not receive raw requests, credentials, approval payloads, policy stores, mutable source objects, or unrestricted logs.

## 7.5 Minimum AI output

AI output should be separately labeled and include:

- explanation;
- suggested investigation steps;
- uncertainty statement;
- evidence references used;
- prohibited-action reminder;
- no executable command or authority result.

AI-generated confidence must not replace contract confidence.

---

# 8. Readiness and Gap Matrix

| Requirement | Current state | BE-9 impact |
|---|---|---|
| Shared current observations | Designed, not implemented | No live insight input |
| Future resolver decision | Absent | No trusted current-versus-future drift intelligence |
| Request-wide authority coverage | Incomplete | Request-level conclusions remain untrusted |
| Observation correlation | Undecided | Cross-source insight grouping cannot be trusted live |
| Drift contract | Designed | Can inform insight semantics |
| Observation contract | Designed | Can inform source/evidence semantics |
| Transport/handoff | Undecided | No approved intelligence ingestion path |
| Persistence/database | Not approved | No durable review lifecycle |
| Governance reporting surface | Present | Candidate projection with strict mutation separation |
| Insights reporting surface | Present | Candidate read-only projection pattern |
| AI explanation surface | Present in adjacent domains | Candidate only under dedicated read-only contract |
| Evidence redaction contract | Conceptually designed | Implementation allowlists still required |
| Frontend authority | Prohibited | Frontend remains projection |

---

# 9. Truth Scan Verdicts

## 9.1 Observation consumers

**Verdict: absent for BE-7/BE-8 records.**

Existing consumers are adjacent domain consumers, not current authority-intelligence consumers.

## 9.2 Reporting surfaces

**Verdict: viable projection surfaces exist, but no authority-intelligence backend projection exists.**

Governance is appropriate for governed follow-up and Insights is appropriate for read-only explanation, provided backend ownership and mutation separation remain explicit.

## 9.3 Governance needs

**Verdict: four review lenses are required.**

Security, governance, drift, and evidence reviews need shared insight identity with lens-specific projections. Missing evidence and untrusted drift must not be promoted into policy or security conclusions.

## 9.4 AI advisor opportunities

**Verdict: explanation and investigation assistance are architecturally viable; autonomous action is not.**

A dedicated read-only advisory boundary is required. General AI orchestration is too broad to inherit this role implicitly.

---

# 10. Constraints Carried into BE-9.2

The Authority Insight contract must:

- remain derived, shadow, and non-authoritative;
- accept only already-produced observations, drift records, and safe evidence summaries;
- preserve `source_authority` and enforcing-versus-classifier meaning;
- define `decision_area`, `drift_level`, `evidence_quality`, `recommendation`, and `confidence` without overstating evidence;
- use stable insight identity independent of authority identity or approval identity;
- separate deterministic contract fields from optional AI explanation;
- support four review projections without duplicating meaning;
- make unknown, missing, and untrusted states explicit;
- prohibit runtime, governance, and frontend control use;
- avoid persistence assumptions.

---

# 11. Completion Statement

BE-9.1 is complete as a truth scan.

The system has strong adjacent Governance, Insights, audit, and AI explanation patterns, but it has no live shared authority-observation consumer and no trusted request-level drift stream. The next phase may define a versioned Authority Insight contract over supplied passive artifacts. It may not claim live reporting readiness, change runtime authority, or introduce execution power.

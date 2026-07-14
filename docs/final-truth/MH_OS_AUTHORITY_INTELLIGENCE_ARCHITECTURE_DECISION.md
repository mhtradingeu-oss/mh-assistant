# MH-OS Authority Intelligence Architecture Decision

## Status

BE-9.4 architecture decision complete.

Decision: **Adopt reporting-only Authority Intelligence. Defer the AI advisory layer. Reject automation and execution authority.**

BE-9 Authority Intelligence & Reporting Architecture is complete for documentation scope.

No runtime observer, drift producer, insight producer, Review Center, API, AI integration, automation, database, permission enforcement, RBAC, governance mutation, provider action, or frontend authority is approved.

Existing backend authorities remain authoritative. Frontend remains projection.

---

# 1. Decision Objective

Choose the architecture mode for turning passive authority observations into explainable intelligence:

1. reporting only;
2. an AI advisory layer;
3. future automation.

The selected mode must preserve shadow-only operation and have no execution authority.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

BE-9 establishes:

- no current consumer receives a unified live authority-observation stream;
- no trusted request-level drift stream exists;
- runtime observation expansion remains deferred under BE-8;
- the future Authority Resolver has no runtime decision producer;
- request-wide current authority coverage remains incomplete;
- correlation carrier, transport, retention, and access ownership remain undecided;
- no database or durable Authority Intelligence review lifecycle is approved;
- Governance is an active backend-authoritative mutation surface and must remain separate from reporting;
- Insights provides a useful read-only projection pattern but does not currently consume authority artifacts;
- AI Command includes both explanation patterns and broader paths that can create durable artifacts, handoffs, tasks, or approvals;
- BE-9.2 defines a deterministic shadow-only `AuthorityInsight` contract;
- BE-9.3 defines a read-only Review Center with Security, Governance, Drift, and Evidence views.

## 2.2 Scope

This decision selects an architectural mode and records consequences and future gates. It does not approve implementation of the selected reporting architecture.

## 2.3 Authority ownership

Current source ownership remains unchanged:

| Source | Ownership after BE-9 |
|---|---|
| `runtime-security-enforcement` | Existing sensitive-route decision and enforcement |
| `protected-route-authority` | Existing protected-route decision and enforcement |
| `governance-mutation-gate` | Existing Governance, policy, and approval decision through current wrappers |
| `provider-execution-gate` | Existing provider classification consumed by current callers |
| Future Authority Resolver | Future shadow decision producer only if separately implemented |
| Authority Intelligence | Derived reporting description only |

## 2.4 Safety boundary

Authority Intelligence cannot:

- authorize or deny;
- execute, queue, publish, send, sync, or invoke providers;
- create or decide approvals;
- override Governance;
- modify policy, membership, scope, capability, or permission;
- replace a security gate;
- control middleware or runtime response flow;
- promote a future shadow decision into enforcement;
- make frontend state authoritative;
- turn an insight, recommendation, confidence score, or AI explanation into control input.

---

# 3. Decision Criteria

The selected option must:

- preserve current backend runtime behavior;
- remain compatible with BE-7 shadow drift monitoring;
- remain compatible with BE-8 deferred runtime observation expansion;
- provide explainable source, drift, evidence, recommendation, and confidence semantics;
- preserve enforcing-versus-classifier distinctions;
- keep missing and untrusted evidence explicit;
- keep Governance mutations in existing human-triggered backend paths;
- keep frontend as projection;
- require no database;
- avoid implicit AI mutations or execution;
- permit staged future review without promising live readiness.

---

# 4. Options Reviewed

## 4.1 Option A — Reporting only

Definition:

- accept the deterministic `AuthorityInsight` contract;
- accept the four-view Authority Review Center design;
- use backend-produced meanings and frontend projections only;
- keep recommendations as bounded human review guidance;
- exclude an AI dependency from the core architecture;
- exclude automation and execution.

Benefits:

- smallest new trust boundary;
- deterministic and reviewable field semantics;
- evidence limits remain visible;
- no model unpredictability in the core record;
- clean separation from broad AI orchestration paths;
- compatible with no database and no runtime migration;
- supports human security, governance, drift, and evidence review;
- permits later AI evaluation without changing insight meaning.

Costs:

- explanations are limited to deterministic backend summaries;
- reviewers do not receive generated plain-language synthesis;
- repeated insight grouping and investigation suggestions remain bounded by explicit reporting logic;
- no automatic remediation or workflow creation occurs.

Disposition: **selected**.

## 4.2 Option B — AI advisory layer

Definition:

- retain the reporting-only deterministic core;
- add a separate AI explanation layer over completed `AuthorityInsight` records;
- generate summaries, investigation steps, and uncertainty statements;
- grant the AI no ability to change core fields or mutate state.

Potential benefits:

- clearer explanations for non-specialist reviewers;
- faster translation of evidence-gap codes into human checklists;
- useful grouping and review-note drafting;
- improved navigation across unfamiliar authority sources.

Current blockers:

- no live bounded Authority Insight input exists;
- advisory access to evidence has no approved data-minimization and privacy contract;
- exact model/provider, prompt, output schema, timeout, failure, and cost boundaries are undecided;
- no dedicated read-only AI execution path is proven separate from broader orchestration capabilities;
- generated-output retention and deletion are undecided;
- prompt injection and untrusted evidence handling are not designed;
- no conformance suite proves that AI output cannot modify core fields or trigger mutations;
- reviewer presentation for deterministic facts versus generated explanation is not implemented or tested;
- source references and model/version provenance are not available through a live pipeline.

Disposition: **architecturally possible as a later optional extension, but deferred and not approved**.

## 4.3 Option C — Future automation

Definition:

- use insights or recommendations to create tasks, approvals, policy changes, notifications, remediation, gate changes, provider actions, or execution behavior automatically.

Potential claimed benefits:

- faster response to repeated drift;
- reduced manual review effort;
- automated evidence collection or remediation.

Conflicts:

- violates the mission constraint of no execution authority;
- would make passive observation influence execution;
- risks circular authority where reports alter the authorities they observe;
- could convert uncertain or missing evidence into real policy or security changes;
- conflicts with shadow-only operation;
- expands Governance and provider mutation scope;
- requires persistence, lifecycle, idempotency, rollback, security, permissions, and audit ownership not approved here;
- risks frontend or AI recommendation becoming authority;
- is not supported by current observation or drift evidence.

Disposition: **rejected for BE-9 and prohibited under this architecture decision**.

Any future reconsideration would require a new architecture program and explicit authority, safety, data, governance, and rollback decisions. It cannot be introduced as an incremental BE-9 feature.

---

# 5. Option Assessment

| Criterion | Reporting only | AI advisory layer | Future automation |
|---|---|---|---|
| Preserves current runtime | Yes | Yes only if strictly isolated | No, if connected to actions |
| Deterministic core meaning | Yes | Yes only with core separation | Not sufficient for control |
| Requires live observation now | No for design | Yes for meaningful deployment | Yes |
| Requires model/provider trust boundary | No | Yes | Yes if AI-driven |
| Requires mutation ownership | No | No under strict advisory design | Yes |
| Requires database | No | Not inherently, but retention unresolved | Likely; not approved |
| Keeps Governance human/backend-owned | Yes | Yes if isolated | At risk |
| Keeps frontend projection-only | Yes | Yes if isolated | At risk |
| Compatible with shadow-only mission | Yes | Yes as a future optional explanation | No when automated |
| Supported by current evidence | Yes as documentation architecture | Not yet | No |
| BE-9 disposition | **Selected** | Deferred | Rejected |

---

# 6. Decision

Adopt **Option A — Reporting only**.

The selected architecture is:

```text
Passive, Already-Produced Authority Artifacts
                 |
                 v
Deterministic Authority Insight Contract
                 |
                 v
Backend Read-Only Review Projection
                 |
                 v
Security | Governance | Drift | Evidence

No output returns to runtime control.
No AI dependency is required.
No automation exists.
```

This decision accepts:

- `MH_OS_AUTHORITY_INTELLIGENCE_TRUTH_SCAN.md` as the BE-9 current-state audit;
- `MH_OS_AUTHORITY_INSIGHT_CONTRACT.md` as the versioned derived reporting contract;
- `MH_OS_AUTHORITY_REVIEW_CENTER_DESIGN.md` as the future read-only review projection design;
- deterministic backend ownership of authority insight meaning;
- four review views over one insight identity;
- explicit drift, evidence, confidence, and recommendation limits;
- human review routing without mutation;
- optional future AI explanation only after a new approval gate.

This decision does not accept:

- a runtime implementation;
- observation expansion;
- a drift producer;
- an insight producer;
- an API or Review Center page;
- AI generation;
- task, handoff, approval, notification, or escalation creation;
- automatic remediation;
- a database or persistence;
- new RBAC or permission behavior;
- Governance or provider mutations;
- frontend authority;
- any execution authority.

---

# 7. Reporting-Only Architecture Rules

## 7.1 Core record

`AuthorityInsight` is the only accepted BE-9 semantic unit. Core meaning must be deterministic for the same immutable versioned inputs.

## 7.2 Source inputs

The reporting layer consumes already-produced observations, drift results, and safe evidence references. It cannot call source authorities or reconstruct decisions.

## 7.3 Recommendations

Recommendations are human review guidance only. They cannot be interpreted as:

- permission;
- approval;
- denial;
- policy;
- remediation command;
- task instruction;
- provider instruction;
- runtime configuration.

## 7.4 Review views

Security, Governance, Drift, and Evidence are projection lenses. Appearing in a view has no runtime or governance effect.

## 7.5 Human follow-up

When follow-up requires Governance, the Review Center may eventually navigate to the existing Governance surface. Governance independently loads backend state and retains its existing confirmations and enforcement.

## 7.6 Failure

Insight derivation, report construction, read delivery, or frontend display failure:

- cannot change runtime behavior;
- cannot block or allow a request;
- cannot fall back to locally inferred authority;
- cannot create a Governance action;
- must display unavailable, partial, invalid, or empty status accurately.

---

# 8. AI Advisory Deferral Contract

The optional `AuthorityInsightAdvisoryExplanation` from BE-9.2 remains a reserved extension, not an approved capability.

## 8.1 Required future decision

Adding AI requires a new architecture decision that explicitly approves:

- exact read-only use cases;
- model/provider and version recording;
- a bounded input allowlist;
- safe evidence summaries;
- prompt-injection treatment;
- output schema and maximum sizes;
- timeout and failure isolation;
- generated-output retention and deletion;
- cost/rate limits;
- user presentation and uncertainty language;
- tests proving no mutation or execution path;
- rollback that leaves reporting functional.

## 8.2 Non-negotiable boundaries

Even if approved later, AI cannot:

- write or replace core `AuthorityInsight` fields;
- create confidence for the deterministic record;
- become evidence;
- approve, reject, override, or update policy;
- create tasks, approvals, workflows, notifications, or handoffs automatically;
- invoke providers;
- decide access;
- call runtime authority;
- conceal missing or unsafe evidence;
- supply a recommendation to an execution adapter.

## 8.3 Degraded operation

Reporting must remain valid and understandable when AI is disabled, unavailable, times out, or returns invalid output.

---

# 9. Automation Prohibition

Under BE-9, the following insight-triggered behaviors are prohibited:

- automatic request blocking or allowing;
- automatic permission, membership, scope, or capability change;
- automatic governance approval request;
- automatic approval, rejection, escalation, or override;
- automatic policy update;
- automatic provider disablement or execution;
- automatic workflow, task, handoff, or notification creation;
- automatic code or configuration change;
- automatic evidence trust promotion;
- automatic insight resolution;
- automatic alerting to external systems.

User-triggered navigation to existing authoritative surfaces is not automation, provided it carries only bounded context and preserves all existing backend checks and confirmations.

---

# 10. No-Database Consequences

Because BE-9 prohibits a database:

- no durable insight review queue is created;
- no durable assignment, acknowledgement, dismissal, or resolution state exists;
- no long-term trend claim is supported without a separately supplied complete bounded dataset;
- `insight_id` does not promise durable lifecycle identity;
- report generation remains defined over supplied immutable snapshots;
- retention, deletion, and access ownership remain future decisions;
- frontend session state cannot be presented as backend review state.

This is an accepted limitation, not a gap to work around with hidden filesystem or browser persistence.

---

# 11. Frontend Projection Decision

The frontend may eventually display a backend-produced Authority Review projection. It may not:

- generate insights;
- compute drift level, evidence quality, or confidence;
- rewrite recommendations;
- hide limitations while displaying risk;
- use report visibility as authorization;
- create durable review state;
- turn filtering, acknowledgement, or navigation into an authority action;
- call a mutation because an insight recommends review.

Existing Governance remains the frontend surface for explicit operator-triggered Governance mutations backed by the current backend. Authority Review remains reporting.

---

# 12. Consequences

## 12.1 Positive consequences

- Authority Intelligence gains a precise versioned reporting unit.
- Security, Governance, Drift, and Evidence reviewers share one explainable record identity.
- Source authority and classifier semantics remain intact.
- Missing, untrusted, and unsafe evidence cannot silently become safety or match.
- Recommendations remain useful without acquiring execution power.
- The frontend has a clear projection boundary.
- Governance retains human-triggered backend ownership.
- AI can be evaluated later without becoming part of core correctness.
- BE-7 and BE-8 shadow boundaries remain unchanged.
- No database, RBAC, runtime migration, or authorization change is introduced.

## 12.2 Accepted limitations

- no live Authority Insight is produced;
- no Review Center exists at runtime;
- no AI explanation is generated;
- no automation or remediation occurs;
- no durable review lifecycle exists;
- no long-term trend reporting is approved;
- current request-level drift remains untrusted;
- current observation coverage remains incomplete;
- reporting implementation still depends on future bounded input and delivery decisions.

## 12.3 Risks avoided

- observations influencing runtime execution;
- AI-generated policy or permission decisions;
- circular Governance automation;
- frontend-derived authority;
- classifier results being promoted to execution truth;
- missing evidence being misreported as low risk;
- hidden persistence bypassing data governance;
- broad AI orchestration paths inheriting authority-intelligence access implicitly.

---

# 13. Architecture Status Update

## 13.1 Completed authority foundations

- Identity Authority;
- Workspace Authority;
- Membership;
- Scope;
- Capability;
- Permission;
- Authority Resolver Design;
- Drift Monitoring;
- Unified Passive Observation Design.

## 13.2 BE-9 completed documentation

- BE-9.1 Authority Intelligence Truth Scan;
- BE-9.2 Authority Insight Contract;
- BE-9.3 Authority Review Center Design;
- BE-9.4 Architecture Decision.

## 13.3 Current architecture state

```text
Authority Resolver strategy: SHADOW ONLY
Drift monitoring strategy: CONTINUE SHADOW MONITORING
Unified observation design: ACCEPTED
Runtime observation expansion: NOT APPROVED
Authority Intelligence mode: REPORTING ONLY
Authority Insight contract: ACCEPTED AS DESIGN
Authority Review Center: ACCEPTED AS DESIGN
AI advisory layer: DEFERRED / NOT APPROVED
Automation: REJECTED / PROHIBITED
Execution authority: NONE
Correlation carrier: UNDECIDED
Transport/handoff: UNDECIDED
Persistence/database: NOT APPROVED
Durable review lifecycle: NOT APPROVED
Frontend authority: PROHIBITED
Current request-level drift trust: UNTRUSTED
```

---

# 14. Future Reporting Implementation Entry Criteria

The reporting-only decision does not approve code. A future implementation proposal must provide:

1. an approved bounded source of actual or explicitly fixture-only insight inputs;
2. an exact deterministic insight derivation module design;
3. supported contract and projection versions;
4. redaction allowlists and maximum sizes;
5. read-only delivery and failure-isolation design;
6. input completeness and pagination semantics;
7. existing backend security applied without new RBAC;
8. an exact Review Center surface ownership decision;
9. frontend projection-fidelity tests;
10. runtime non-interference and import-boundary tests;
11. proof that Governance mutations do not consume insight output;
12. proof that no database, persistence, automation, or AI is introduced;
13. rollback and operational observability for the reporting path;
14. explicit runtime-change approval if any source file must change.

Until these criteria are met, BE-9 remains documentation architecture only.

---

# 15. Rejected Shortcuts

The following do not satisfy this decision:

- generating insights in the browser from current Governance or Insights payloads;
- treating static audit reports as live request observations;
- inferring drift from HTTP status or log wording;
- using the general AI orchestrator as an Authority Advisor without a dedicated decision;
- creating a local JSON review database under another name;
- using notifications or tasks as a substitute for a review contract;
- allowing a high-confidence recommendation to trigger a mutation;
- presenting no records as no risk;
- embedding approval controls inside the Review Center;
- implementing automation under the label `advisory`.

---

# 16. Completion Statement

BE-9 Authority Intelligence & Reporting Architecture is complete for documentation scope.

MH-OS adopts a reporting-only architecture that turns supplied passive authority artifacts into deterministic, explainable, non-authoritative insights for Security, Governance, Drift, and Evidence review. The AI advisory layer remains a future optional extension behind a new architecture decision. Automation is rejected, and no Authority Intelligence output may control execution.

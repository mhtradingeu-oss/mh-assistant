# MH-OS Authority Observation Expansion Architecture Decision

## Status

BE-8.4 architecture decision complete.

Decision: **Accept the unified passive observation design; defer runtime observation expansion.**

BE-8 Authority Observation Expansion is complete for documentation scope.

No runtime adapter, callback, correlation carrier, telemetry handoff, persistence, permission enforcement, RBAC, resolver integration, governance override, provider execution, or frontend authority is approved.

Existing backend authorities remain authoritative.

---

# 1. Decision Objective

Decide whether the BE-8 shared observation contract and adapter design are architecturally accepted, and whether current evidence supports runtime observation expansion.

The decision must remain compatible with the BE-7 choice to continue shadow monitoring.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

BE-8 establishes:

- all four current sources produce decisions or classifications that can be observed after evaluation;
- Runtime Security has an existing failure-isolated callback;
- Protected Route has a viable original-decision seam but no callback;
- Governance has viable seams in two wrappers but no callback;
- Provider Gate classification is already nested in Runtime Security and must not be recomputed;
- no unified observation record currently exists at runtime;
- no context-independent observation correlation lifecycle exists;
- no bounded backend handoff/transport behavior is approved;
- no executable observer-equivalence suite proves behavior across all sources;
- no database or persistence owner is approved;
- no future Authority Resolver decision producer exists.

## 2.2 Scope

BE-8.4 may accept documentation architecture and define future entry criteria. It does not authorize source files, tests, transport, storage, or deployment changes.

## 2.3 Authority ownership

Current ownership remains:

| Source | Ownership after BE-8 |
|---|---|
| `runtime-security-enforcement` | Existing sensitive-route decision and enforcement |
| `protected-route-authority` | Existing protected-route decision and enforcement |
| `governance-mutation-gate` | Existing governance/policy/approval decision and enforcement through current wrappers |
| `provider-execution-gate` | Existing provider classification consumed by current callers |

The observation design owns only a future non-authoritative description of original source decisions.

## 2.4 Safety boundary

Observation cannot:

- authorize;
- deny;
- execute;
- override governance;
- replace security gates;
- call middleware continuation or write responses;
- resolve permissions, membership, scope, or capabilities;
- create approvals or invoke providers;
- become frontend access control.

---

# 3. Options Reviewed

## 3.1 Option A — Reject BE-8 and retain BE-7 only

Definition:

- keep BE-7 drift contracts;
- do not adopt a unified current-side observation contract;
- leave future source adapters undefined.

Benefits:

- no new architecture surface;
- current runtime remains unchanged.

Costs:

- evidence capture remains fragmented;
- future observer proposals lack shared semantics;
- enforcing and classifier outcomes could diverge across implementations;
- missing context and coverage remain inconsistently represented;
- drift analysis lacks a defined current-side input.

Disposition: not selected.

## 3.2 Option B — Accept design and defer runtime expansion

Definition:

- accept the shared observation contract;
- accept the source-specific adapter design;
- preserve all current source behavior;
- require a separate implementation-readiness and runtime-change decision;
- leave correlation carrier, handoff/transport, retention, and source edits unapproved.

Benefits:

- standardizes future decision/evidence capture;
- preserves enforcing-versus-classifier semantics;
- makes missing context and coverage explicit;
- defines passive source seams and tests before code;
- supports BE-7 drift analysis without prematurely integrating a resolver;
- introduces no runtime risk now.

Costs:

- no new live observation coverage is produced;
- current evidence gaps remain;
- runtime drift remains `UNTRUSTED` at request-chain level;
- further design and validation work is required before source patches.

Disposition: **selected**.

## 3.3 Option C — Approve limited runtime observation expansion now

Definition:

- add shared normalizer/sanitizer code;
- wire Protected Route and Governance observers;
- replace or expand current Runtime Security recording;
- emit current-side observation records.

Potential benefits:

- begins measuring current authority coverage;
- produces evidence needed for later drift comparison;
- validates passive seams under real execution.

Current blockers:

- correlation carrier is undecided;
- handoff and backpressure behavior are undecided;
- transport, retention, deletion, and access ownership are undecided;
- source allowlists and maximum sizes are not executable contracts;
- runtime-equivalence tests have not been implemented or baselined;
- Protected Route and Governance callback failure isolation is not implemented;
- provider child-record versus nested-evidence strategy is not selected;
- exact source diffs and rollback are not reviewed;
- explicit runtime-change approval has not been granted.

Disposition: deferred and not approved.

---

# 4. Option Assessment

| Criterion | Option A | Option B | Option C |
|---|---|---|---|
| Preserves current runtime | Yes | Yes | No, adds passive wiring |
| Defines unified observation semantics | No | Yes | Yes |
| Supported by present architecture evidence | Incomplete direction | Yes | No |
| Requires correlation/handoff decision now | No | No; remains future gate | Yes |
| Requires runtime equivalence evidence now | No | Defines requirement | Yes, missing |
| Produces live coverage | No | No | Potentially |
| Maintains BE-7 Continue Shadow Monitoring | Yes | Yes | Only if separately approved and proven |
| Current disposition | Not selected | Selected | Deferred |

---

# 5. Decision

Adopt **Option B — Accept design and defer runtime expansion**.

This decision accepts:

- `MH_OS_AUTHORITY_OBSERVATION_GAP_TRUTH_SCAN.md` as the BE-8 current-state audit;
- `MH_OS_SHARED_AUTHORITY_OBSERVATION_CONTRACT.md` as the future shared record contract;
- `MH_OS_AUTHORITY_OBSERVATION_ADAPTER_DESIGN.md` as the future adapter and validation design;
- enforcing-versus-classifier normalization boundaries;
- explicit missing-context and authority-coverage semantics;
- downstream compatibility with BE-7 drift analysis;
- failure isolation and runtime equivalence as mandatory future gates.

This decision does not accept:

- runtime source changes;
- creation of an adapter module;
- new callbacks;
- a correlation carrier;
- a telemetry handoff or queue;
- persistence or a database;
- provider execution-result integration;
- future resolver integration;
- permission enforcement or RBAC;
- frontend observation consumption as authority.

---

# 6. Consequences

## 6.1 Positive consequences

- Future source adapters have one versioned record contract.
- Runtime Security, Protected Route, and Governance retain enforcing semantics.
- Provider Gate remains explicit classifier evidence.
- Missing context cannot silently become permission, not-applicable, or match.
- Future drift analysis can consume current-side observations consistently.
- Runtime risk remains zero for BE-8 documentation scope.
- Transport and data-retention risks remain separately governed.

## 6.2 Accepted limitations

- No unified runtime observation is emitted.
- Protected Route and Governance coverage remains missing.
- Runtime Security shared recording still depends on existing authority context.
- Provider execution outcomes remain outside the shared design.
- No request-wide current authority chain can be proven complete.
- Live request-level drift remains `UNTRUSTED`.
- The architecture cannot be used as migration evidence until implemented and validated under a later approval.

---

# 7. Architecture Status Update

## 7.1 Completed authority foundations

- Identity;
- Workspace;
- Membership;
- Scope;
- Capability;
- Permission;
- Authority Resolver Design;
- Drift Monitoring.

## 7.2 BE-8 completed documentation

- BE-8.1 Observation Gap Truth Scan;
- BE-8.2 Shared Authority Observation Contract;
- BE-8.3 Observation Adapter Design;
- BE-8.4 Architecture Decision.

## 7.3 Current architecture state

```text
Authority Resolver strategy: SHADOW ONLY
Drift monitoring strategy: CONTINUE SHADOW MONITORING
Unified observation design: ACCEPTED
Runtime observation expansion: NOT APPROVED
Correlation carrier: UNDECIDED
Handoff/transport: UNDECIDED
Persistence/database: NOT APPROVED
Provider Gate semantics: CLASSIFIER
Request-wide observation coverage: INCOMPLETE
Current request-level drift trust: UNTRUSTED
Runtime authority migration: NOT APPROVED
Backend authority: UNCHANGED
Frontend authority: NONE; PROJECTION ONLY
```

---

# 8. Controlling Source-Specific Decisions

## 8.1 Runtime Security

- existing callback model is the reference failure-isolation pattern;
- configured recording remains unchanged;
- a future adapter must work without `mhAuthorityContext`;
- current allow/deny branch remains authoritative.

## 8.2 Protected Route

- future observation seam is after `isProtectedRouteAllowed` returns;
- both allow and deny require observation;
- no middleware reordering is permitted;
- callback receives no response or continuation capability;
- current proof and response behavior remains authoritative.

## 8.3 Governance

- both server wrappers require equivalent future observation;
- observation is after original evaluation and before unchanged consumption;
- policy and approval stores must never be reevaluated by the adapter;
- approval/policy evidence requires stable allowlisted references;
- current governance outcome remains authoritative.

## 8.4 Provider Gate

- current classification is captured from Runtime Security's returned decision;
- the adapter must not call the classifier again;
- Provider Gate uses `CLASSIFIED_*` observation outcomes only;
- `CLASSIFIED_ALLOWED` does not mean execution, permission, or request allow;
- provider execution-result integration requires a separate owner and decision.

---

# 9. Runtime Expansion Entry Criteria

A future proposal to approve source changes must include:

## 9.1 Correlation

- selected ephemeral carrier;
- lifecycle from earliest observed source through termination;
- proof that authority decisions cannot consume it;
- no credential, personal, approval, or business-data derivation;
- missing-correlation behavior.

## 9.2 Bounded handoff

- selected backend-owned handoff behavior;
- no synchronous external I/O;
- bounded time, memory, record count, and backpressure;
- explicit overflow/drop behavior;
- exception containment;
- no unbounded process-global buffer.

## 9.3 Data protection

- source-specific allowlists;
- maximum depth, count, text, and record size;
- forbidden-key and secret-pattern rules;
- approval/policy reference integrity;
- privacy review for any principal/resource metadata;
- retention/deletion/access decision if records leave request memory.

## 9.4 Exact implementation scope

- exact new module names and interfaces;
- exact source files and line-level insertion points;
- selected Provider Gate representation strategy;
- no frontend files;
- no gate replacement or middleware reordering;
- narrow rollback removing only observation wiring.

## 9.5 Executable proof

- pure schema/normalization tests;
- source allow/deny/not-applicable/classifier coverage tests;
- absent/successful/throwing/unavailable observer equivalence tests;
- identical `next()`, status, body, logs, approval attachment, request fields, and source objects;
- middleware-order regression proof;
- governance, approval, provider, project-isolation, public-alias, and failure-path proof;
- redaction and boundedness tests;
- baseline and post-patch evidence;
- explicit runtime-change approval.

Until every section is satisfied, runtime observation expansion remains not approved.

---

# 10. Drift and Resolver Boundary

BE-8 supplies architecture for current-side observation only.

It does not:

- produce a future expected Authority decision;
- establish decision parity;
- authorize `MATCH`, `LOW_RISK_DRIFT`, or `HIGH_RISK_DRIFT` for live request chains;
- change `UNTRUSTED` behavior when coverage or future context is missing;
- approve Authority Resolver integration;
- provide evidence for permission enforcement migration by documentation alone.

Only representative, trustworthy, correlated runtime observations under a future approved implementation can contribute evidence to a later resolver or migration decision.

---

# 11. Database and Retention Boundary

No database is created or approved.

Accepting the record contract does not imply that records must be persisted. Any future proposal that moves observations beyond ephemeral bounded handoff must separately decide:

- storage owner;
- project/workspace isolation;
- access control;
- retention and deletion;
- legal/privacy constraints;
- integrity and tamper evidence;
- operational recovery;
- cost and cardinality;
- independent rollback.

---

# 12. Frontend Boundary

Frontend remains projection only.

BE-8 observation records must not be used by frontend code to:

- decide route access;
- hide or enable actions as a substitute for backend authority;
- infer roles, membership, scope, capability, or permission;
- treat missing drift as safety proof;
- override backend denial or governance state.

Any future read-only observability projection requires a separate privacy and product decision and still cannot become authority.

---

# 13. Runtime Migration Prohibition

BE-8 creates no permission enforcement and no migration authority.

Even after a future observation implementation:

- observation output cannot enter gate branches;
- normalized outcomes cannot replace source outcomes;
- coverage completeness cannot authorize a request;
- drift matches cannot authorize migration;
- current backend authorities remain controlling until a separately approved enforcement-migration decision is supported by representative production evidence, adversarial validation, staged rollout, and rollback.

---

# 14. Architecture Review

The selected decision is consistent with BE-7 and the current runtime because it:

- continues shadow monitoring;
- accepts a unified observation design without pretending it exists at runtime;
- preserves each current source and its semantics;
- prevents classifier/enforcement confusion;
- treats missing context and coverage as explicit gaps;
- requires failure isolation and behavior equivalence before source changes;
- leaves correlation, transport, retention, and runtime integration separately governed;
- introduces no database, permission system, RBAC, resolver integration, or frontend authority.

---

# 15. BE-8 Closeout

BE-8 Authority Observation Expansion is complete for documentation scope.

Final decision: **Unified passive observation design accepted; runtime observation expansion deferred.**

The next permissible action is a separately authorized implementation-readiness package satisfying Section 9. It is not a runtime patch by default.

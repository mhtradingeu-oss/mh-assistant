# MH-OS Authority Drift Architecture Decision

## Status

BE-7.5 architecture decision complete.

Decision: **Option A — Continue Shadow Monitoring**.

BE-7 Authority Evidence & Drift Monitoring Architecture is complete for documentation scope.

No runtime observer expansion, Authority Resolver integration, permission enforcement migration, RBAC, database, or frontend authority is approved.

Existing backend authorities remain authoritative.

---

# 1. Decision Objective

Choose the next architecture boundary after the BE-7 evidence audit, drift contract, shadow model, and coverage review.

Options:

- Option A: Continue Shadow Monitoring;
- Option B: Limited Observer Expansion;
- Option C: Future Resolver Integration.

The choice must preserve the BE-6 `SHADOW ONLY` strategy and require evidence before any runtime migration.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

The BE-7 evidence record proves:

- current authority decisions are fragmented across several backend owners;
- runtime security has the only complete local passive observation seam;
- even that path has incomplete shared evidence and conditional context coverage;
- protected-route allow/deny lacks shared observation;
- governance allow/deny and approval lifecycle lack shared normalized observation;
- provider and route evidence is classification evidence, not complete execution or permission evidence;
- no complete shared or request-wide observation path exists;
- no future Authority Resolver decision producer exists;
- current live request-level drift must therefore remain `UNTRUSTED`.

## 2.2 Scope

BE-7 approves documentation contracts and architecture status only. It does not approve source changes, runtime telemetry wiring, persistence, resolver execution, or enforcement.

## 2.3 Authority ownership

The current runtime remains controlled by:

- `runtime-security-enforcement`;
- `protected-route-authority`;
- `provider-execution-gate` and its current enforcing callers;
- `governance-mutation-gate`;
- `route-permission-catalog` for classification.

The drift monitor owns no security decision. The frontend remains projection only.

## 2.4 Safety boundary

No option may be interpreted to let drift monitoring:

- authorize or deny;
- execute or queue an action;
- modify security, middleware, policy, approval, or provider behavior;
- infer membership, scope, capability, or permission;
- replace governance or current gates;
- create a permission database or RBAC model;
- turn frontend state into authority.

---

# 3. Decision Criteria

The options are assessed against:

1. current evidence completeness;
2. preservation of backend authority ownership;
3. observer failure isolation;
4. ability to correlate all applicable current decisions;
5. existence of a versioned expected decision;
6. redaction, retention, and telemetry ownership;
7. validation and rollback proof;
8. risk of enforcement or governance coupling;
9. readiness to produce representative drift evidence;
10. explicit authorization for runtime change.

---

# 4. Option A — Continue Shadow Monitoring

## 4.1 Definition

Retain the current runtime unchanged and adopt the BE-7 documents as the contract for future evidence and drift observability.

Under Option A:

- current gates continue to decide and enforce exactly as they do now;
- the existing runtime-security shadow observation remains unchanged;
- BE-7 records current gaps rather than concealing them;
- absent future decision and incomplete authority coverage remain `UNTRUSTED`;
- architecture work may refine contracts, test plans, and observer proposals;
- no runtime comparison is claimed.

## 4.2 Benefits

- preserves the verified authority boundary;
- introduces no new failure path in security middleware;
- prevents missing evidence from being mislabeled as parity;
- avoids premature telemetry storage or data-retention choices;
- keeps limited observer expansion small and separately reviewable;
- maintains compatibility with BE-6 `SHADOW ONLY`.

## 4.3 Cost

- no production request-wide drift records are produced;
- evidence gaps remain unresolved at runtime;
- future model parity cannot be measured;
- `MATCH`, `LOW_RISK_DRIFT`, and `HIGH_RISK_DRIFT` cannot be trusted for live request chains until inputs exist.

## 4.4 Disposition

**Selected.**

Option A is the only choice supported by current truth and authority constraints.

---

# 5. Option B — Limited Observer Expansion

## 5.1 Definition

Add narrowly placed, failure-isolated callbacks after existing decisions and emit bounded backend-only evidence without affecting current control flow.

Potential observer targets:

- protected-route allow and deny;
- runtime-security context-independent emission using its existing seam;
- governance mutation and approval-lifecycle allow and deny;
- sanitized approval and classifier evidence references;
- explicit applicable/observed authority coverage.

## 5.2 Potential value

- measures current decision coverage;
- identifies missing and uncorrelated evidence;
- proves observer isolation before future comparisons;
- creates the prerequisite current-side evidence for a later shadow resolver.

## 5.3 Current blockers

- no approved implementation contract names exact code changes and callback signatures;
- no observation-ID lifecycle is implemented;
- no shared backend telemetry owner, transport, sampling, or retention policy is approved;
- protected-route middleware order requires context-independent observation;
- governance and approval redaction/reference tests are not specified in executable form;
- provider execution-result correlation has no reviewed common seam;
- no rollback patch or runtime equivalence proof exists;
- runtime modification has not been explicitly approved;
- no future resolver decision exists, so observer expansion alone cannot produce trusted current-versus-expected drift.

## 5.4 Disposition

**Deferred, not approved.**

Option B is the next eligible architecture candidate only after its entry criteria are satisfied and a separate runtime-change approval is granted.

Observer expansion may collect current-side evidence before a future resolver exists, but it must label request-level comparison as `UNTRUSTED` and must not claim parity.

---

# 6. Option C — Future Resolver Integration

## 6.1 Definition

Connect a future versioned Authority Resolver decision to live request observations, initially for shadow comparison and potentially, under a much later decision, for runtime enforcement.

## 6.2 Potential value

- compares the current authority chain with a future unified model;
- identifies decision, policy, scope, and capability drift;
- produces evidence for a future migration decision.

## 6.3 Current blockers

- no future resolver runtime or decision producer exists;
- no permission runtime exists;
- trusted workspace and membership runtime authorities are incomplete;
- current request-wide observation coverage is incomplete;
- no production drift dataset exists;
- no parity threshold, known-difference policy, or allow-expansion tolerance is approved;
- no adversarial validation, staged rollout, or independent rollback evidence exists;
- integration could create accidental governance, provider, protected-route, or project-boundary coupling;
- no runtime integration or enforcement authority has been granted.

## 6.4 Disposition

**Rejected for BE-7 and deferred to a separately governed future decision.**

Future shadow resolver integration must not be confused with enforcement approval. Even successful shadow comparison cannot authorize migration by itself.

---

# 7. Option Assessment

| Criterion | Option A | Option B | Option C |
|---|---|---|---|
| Preserves current runtime unchanged | Yes | No, requires passive source patch | No, requires integration |
| Supported by current evidence | Yes | Partially | No |
| Produces trusted live request drift now | No | No, without future decision | No current producer |
| Requires runtime approval | No | Yes | Yes |
| Requires telemetry ownership/retention | No new requirement | Yes | Yes |
| Requires future resolver | No | Not for coverage evidence; yes for drift comparison | Yes |
| Enforcement migration risk | None introduced | Must be contained | High if boundaries blur |
| Current disposition | Selected | Deferred | Rejected for BE-7 |

---

# 8. Decision

Adopt **Option A — Continue Shadow Monitoring**.

This means:

- BE-7 remains an observability architecture, not a runtime feature;
- BE-7.1 through BE-7.5 documentation is the canonical drift-monitoring design;
- current backend decisions remain authoritative;
- the future Authority Resolver remains shadow-only;
- missing future or current evidence remains `UNTRUSTED`;
- no individual `DriftRecord` can affect execution;
- no permission enforcement migration is approved;
- no RBAC or database is created;
- frontend remains projection only;
- any runtime patch requires a new explicit decision and review.

---

# 9. Architecture Status Update

## 9.1 Completed foundations

- Identity Authority;
- Workspace Authority;
- Membership Architecture;
- Scope Authority;
- Capability Authority;
- Permission Authority;
- Authority Resolver Shadow Architecture.

## 9.2 BE-7 completed documentation

- BE-7.1 Authority Evidence Truth Scan;
- BE-7.2 Authority Drift Monitoring Contract;
- BE-7.3 Authority Drift Shadow Model;
- BE-7.4 Authority Evidence Coverage Review;
- BE-7.5 Authority Drift Architecture Decision.

## 9.3 Current architecture state

```text
Authority Resolver strategy: SHADOW ONLY
Drift monitoring strategy: CONTINUE SHADOW MONITORING
Runtime authority migration: NOT APPROVED
Limited observer expansion: DEFERRED
Future resolver integration: NOT READY
Current request-level drift trust: UNTRUSTED
Backend authority: UNCHANGED
Frontend authority: NONE; PROJECTION ONLY
```

## 9.4 Current limitation

BE-7 defines how evidence and drift must be represented but does not produce live request-wide drift observations. This is an accepted safety limitation.

---

# 10. Option B Entry Criteria

A future limited observer expansion proposal must provide:

- exact files, functions, callback shapes, and insertion points;
- proof that each observer consumes the original decision without reevaluation;
- observation/decision ID, timestamp, source-version, and authority-coverage contract;
- a context-independent path for decisions occurring before identity attachment;
- allowlisted redaction rules for governance, approvals, provider, and request metadata;
- backend telemetry ownership, bounded transport, sampling, retention, deletion, and access policy;
- no synchronous external I/O in authority control flow;
- tests proving identical allow/deny, status, body, and `next()` behavior when observers succeed, fail, or are absent;
- middleware-order, governance, approval, provider, project-isolation, and public-alias regression tests;
- cardinality and secret-leakage tests;
- a narrow rollback that removes only passive wiring;
- explicit runtime-change approval.

Until all criteria are satisfied, Option A remains controlling.

---

# 11. Future Resolver Integration Entry Criteria

Future shadow resolver integration requires:

- an independently approved, versioned, non-authoritative resolver decision producer;
- complete current-side observation for every applicable authority in the compared boundary;
- trustworthy principal, workspace, membership, scope, capability, permission, policy, and evidence context;
- stable action/resource correlation and source versions;
- proven observer failure isolation and redaction;
- representative current-side coverage evidence;
- explicit proof that resolver output is unavailable to enforcement and frontend access control;
- separate approval for integration.

The result remains shadow telemetry.

---

# 12. Runtime Migration Prohibition and Future Gate

No runtime migration may occur without evidence.

At minimum, a future enforcement-migration proposal requires:

- approved runtime authorities for workspace, membership, scope, capability, and permission;
- representative production shadow evidence across allow, deny, governance, approval, provider, destructive, public-alias, project-isolation, and failure cases;
- zero unexplained potential allow-expansion conflicts;
- reviewed match, low-risk, high-risk, and untrusted thresholds;
- an approved known-difference policy;
- adversarial security and data-isolation validation;
- staged rollout with independent rollback;
- explicit final backend authority ownership;
- explicit approval to change enforcement.

Shadow success is evidence, not authorization to migrate. Missing telemetry, absence of recorded drift, frontend behavior, or document agreement cannot substitute for runtime proof.

---

# 13. Architecture Review

The selected decision is consistent with all verified boundaries:

- it preserves existing current authorities;
- it exposes rather than infers missing evidence;
- it keeps classifiers distinct from enforcing outcomes;
- it treats absent future decisions as untrusted;
- it permits a later narrow observer proposal without pre-approving it;
- it forbids permission enforcement migration without evidence;
- it creates no RBAC or database;
- it keeps the frontend as projection only.

---

# 14. BE-7 Closeout

BE-7 Authority Evidence & Drift Monitoring Architecture is complete for documentation scope.

Final decision: **Continue Shadow Monitoring**.

The next permissible step is not implementation by default. It is a separately approved Option B proposal that satisfies Section 10, or additional documentation and validation planning while Option A remains in force.

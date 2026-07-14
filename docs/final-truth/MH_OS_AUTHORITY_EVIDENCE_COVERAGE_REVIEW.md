# MH-OS Authority Evidence Coverage Review

## Status

BE-7.4 evidence coverage review complete.

Documentation only. No observer, adapter, resolver, database, permission enforcement, RBAC, middleware, governance, provider, or frontend behavior is changed.

Existing backend authorities remain authoritative.

---

# 1. Objective

Review which current authorities emit decision evidence, identify complete and missing observation paths, and define the minimum future passive adapters needed for trustworthy shadow drift monitoring.

Authorities in scope:

- Runtime Security;
- Provider Gates;
- Governance;
- Protected Routes;
- Route Permission Catalog as supporting classification evidence;
- Identity Authority Context and approval records as evidence carriers.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

Active source inspection proves:

- protected-route middleware is registered before protected write/read key middleware and before runtime-security observation;
- successful protected write/read key guards attach `mhAuthorityContext`;
- guard failures terminate without attaching that context;
- runtime security owns the only shared `recordShadowObservation` call site;
- that call site returns without recording when `mhAuthorityContext` is absent;
- provider and route classifiers are called only inside runtime-security classification in the active runtime source;
- governance route calls funnel through mutation and approval-lifecycle wrappers, but neither wrapper emits shared authority observations;
- protected-route authority exposes no observer callback;
- `governance_decision` and `provider_decision` remain null in the current authority context.

## 2.2 Scope

This review describes evidence coverage and future passive adapter boundaries only. It does not authorize runtime integration or storage.

## 2.3 Authority ownership

Every current gate retains its decision and enforcement responsibility. Future adapters may receive an original decision snapshot after evaluation but may not calculate, override, suppress, or replay that decision.

## 2.4 Safety boundary

Coverage telemetry cannot authorize, deny, execute, modify security, alter middleware order, change policy or approvals, replace governance, invoke providers, or become frontend authority. Missing coverage always reduces comparison trust.

---

# 3. Coverage Definitions

## 3.1 Local decision production

An authority produces a decision object consumed by its current caller.

This proves that a decision exists. It does not prove that the decision is observable outside that boundary.

## 3.2 Local observation path

A passive callback or bounded log receives the original decision after evaluation without recalculation.

A path is locally complete only when:

- both allow and deny or all relevant classifications are observable;
- the original decision is captured;
- observer failure cannot change control flow;
- source identity and source semantics are preserved.

## 3.3 Shared observation path

A sanitized decision snapshot or stable evidence reference reaches a common backend observation envelope with correlation and timestamp information.

## 3.4 Request-wide complete path

A request-wide path is complete only when:

- all applicable current authorities are identified;
- every applicable original decision is observed;
- non-enforcing classifiers remain distinguishable from enforcing gates;
- decision ordering and correlation are explicit;
- approval/policy/provider evidence needed for material comparison is referenced;
- a future expected decision is versioned and correlated;
- gaps cannot be silently treated as allow or match.

No current request-wide complete path exists.

---

# 4. Coverage Summary

| Boundary | Decision produced | Local observation | Shared observation | Evidence quality | Coverage verdict |
|---|---:|---:|---:|---|---|
| Successful identity context attachment | Yes | Context attached | Yes | Principal compatibility assertion only | Partial |
| Failed read/write key guard | Yes, as response branch | No authority record | No | HTTP response only | Missing |
| Runtime Security with context | Yes | Yes, failure-isolated callback | Yes | Original decision plus nested classifications; lacks IDs/version/time | Best current path, partial |
| Runtime Security without context | Yes | Yes, callback invoked | No shared record | Decision discarded by observer | Missing shared path |
| Protected Routes allow | Yes | Request field only after allow | No | Proof-presence booleans, code, route metadata | Partial local, missing shared |
| Protected Routes deny | Yes | Response branch only | No | Proof-presence booleans, code, route metadata | Missing shared |
| Provider classification | Yes | Nested in runtime-security decision | Indirect when context exists | Classifier evidence; not execution result | Partial |
| Provider execution outcome | Varies across provider paths | No common authority observer | No | Path-specific operational results | Missing common path |
| Governance mutation allow | Yes | Wrapper branch only | No | Original decision remains local | Missing |
| Governance mutation deny | Yes | Warning log and response | No normalized record | Sanitized operational log, no stable correlation | Partial operational only |
| Approval lifecycle allow/deny | Yes | Wrapper branch and optional request field | No | May contain durable approval object | Missing normalized path |
| Approval selected by mutation gate | Yes | Embedded in decision detail/reference | No | Approval ID and decider fields may exist | Missing normalized reference |
| Route classification | Yes | Nested in runtime-security decision | Indirect when context exists | Scope/risk/status metadata only | Partial classifier evidence |
| Future Authority Resolver | No | No | No | No decision producer | Absent |

---

# 5. Authority-by-Authority Review

## 5.1 Runtime Security

### Existing evidence

The decision contains:

- `enforced`;
- `allowed`;
- `reason`;
- route classification;
- provider classification when applicable.

The middleware invokes `observeDecision` after classification and before the unchanged allow/deny branch. Observer exceptions are caught.

### Complete portion

The callback is the only currently complete local decision observation seam:

- it receives the original decision;
- it runs for allow, deny, and not-enforced results;
- it is failure-isolated;
- it cannot alter the decision merely by throwing.

### Incomplete portion

The configured shared observer records only when `req.mhAuthorityContext` exists. The resulting observation lacks:

- observation and decision IDs;
- source and catalog versions;
- decision timestamp;
- explicit applicable-authority coverage;
- stable evidence references;
- a future expected decision.

Verdict: suitable future seam, incomplete current coverage.

## 5.2 Protected Routes

### Existing evidence

Each decision includes allow/deny, response status/code/message, route ID, authority level, category, forbidden action, and proof-presence booleans.

### Complete portion

The original decision is computed once and consumed by the current enforcement wrapper. Allowed decisions may be attached to `req.protectedRouteAuthority`.

### Missing portion

- no passive observer callback;
- denied outcomes terminate locally;
- denied outcomes are not attached to shared context;
- middleware runs before current identity context attachment;
- proof presence does not validate durable approval;
- no stable decision/evidence/correlation/time metadata.

Verdict: decision production exists; shared observation is missing for both outcomes.

## 5.3 Provider Gates

### Existing evidence

Provider classification includes provider, risk, status, execution, allowed, decision, required scope, reason, and audit-event label.

### Complete portion

Runtime security retains the classification in its original decision when provider classification applies.

### Missing portion

- no independent provider observation path;
- `mhAuthorityContext.provider_decision` remains null;
- classification does not prove provider call, queue acceptance, execution success, failure, or side effect;
- active runtime-security classification currently derives configured/approved inputs from write-key presence in that path;
- no common correlation from classification to provider execution result.

Verdict: partial classification evidence only, not complete provider-execution evidence.

## 5.4 Governance Mutation Gate

### Existing evidence

Governance decisions contain allow/deny, decision, reason, code/response, and details such as action, project, policy key, approval selector, approval ID, and approving identity when applicable.

### Complete portion

The mutation wrapper receives the original decision before its current allow/deny branch. Denials create a sanitized warning log.

### Missing portion

- no failure-isolated shared observer;
- allowed decisions have no comparable operational log;
- `mhAuthorityContext.governance_decision` remains null;
- log entries are not stable decision records;
- no observation ID, source/policy version, or immutable policy reference;
- policy and approvals are mutable and cannot safely be reevaluated later.

Verdict: strong local evidence, missing normalized allow/deny observation.

## 5.5 Governance Approval Lifecycle

### Existing evidence

The lifecycle can return:

- no-approval-required allow;
- existing approved allow;
- existing rejected deny;
- existing pending deny;
- newly created pending deny.

Approval records may include identity, entity/action, route, lifecycle state, status, timestamps, fingerprint, payload hash/summary, and linked execution identifiers.

### Missing portion

- no normalized sanitized evidence reference emitted with the authority observation;
- approval mutation and authority comparison are not correlated through one observation ID;
- the wrapper attaches `req.governanceApproval` only for allowed decisions carrying an approval;
- actor/requester values can originate in request input and cannot establish trusted principal identity;
- no immutable policy/approval snapshot boundary is defined.

Verdict: durable source material exists; shared evidence adapter is missing.

## 5.6 Route Permission Catalog

### Existing evidence

Route classification includes access class, required scope, route lifecycle status, data/provider/destructive risk, provider/destructive flags, audit-event label, and recommendation.

### Coverage boundary

The catalog is called inside runtime security and can therefore be observed as nested evidence when the runtime-security record is retained.

It is not an enforcing authority and cannot prove:

- principal authentication;
- workspace membership;
- granted scope;
- capability permission;
- governance approval;
- provider execution;
- final request outcome.

Verdict: useful supporting evidence, never sufficient comparison evidence alone.

## 5.7 Identity Authority Context

### Existing evidence

The identity adapter supplies version, mode, compatibility service principal, project ID when supplied, sanitized evidence arrays, decision-context envelope, and bounded non-authoritative observations.

### Missing portion

Current attachment sites do not supply evidence references, decision context, or project ID. Workspace, roles, permissions, governance, and provider fields remain unresolved. Some earlier middleware can terminate before attachment.

Verdict: safe passive carrier for the paths it reaches, not a complete request observation envelope.

---

# 6. Complete Observation Paths

## 6.1 Complete local path

Only the runtime-security `observeDecision` seam satisfies the current definition of a complete local observation path.

This completeness is limited to the runtime-security boundary. It does not prove:

- shared persistence or record emission;
- protected-route or governance coverage;
- provider execution coverage;
- future decision availability;
- request-wide match.

## 6.2 Complete shared path

No current path is complete under the BE-7 contract.

Runtime security with an attached context is the best current shared path, but it is incomplete because it lacks identifiers, timestamps, versions, evidence references, coverage markers, and expected decision input.

## 6.3 Complete request-wide path

None exists.

Until such a path exists, request-level drift state is `UNTRUSTED`.

---

# 7. Missing Observation Paths

Priority missing paths:

1. protected-route original decision observation for allow and deny;
2. context-independent shared emission of runtime-security observations;
3. governance mutation original decision observation for allow and deny;
4. approval-lifecycle decision and sanitized approval-reference observation;
5. provider classification-to-execution-result correlation;
6. route classifier version/reference evidence;
7. successful and failed authentication-boundary evidence references without exposing credentials;
8. request observation ID and per-decision IDs;
9. applicable-versus-observed authority coverage;
10. stable source, catalog, policy, and resolver versions;
11. trusted workspace, membership, scope, capability, and permission evidence;
12. a future non-authoritative resolver decision;
13. bounded backend telemetry transport and retention policy.

---

# 8. Required Future Passive Adapters

These are architecture requirements for a later separately approved proposal. They are not approved runtime patches.

## 8.1 Observation correlation envelope

Purpose:

- create an opaque request observation ID before any observed authority can terminate;
- carry source decision IDs and timestamps;
- record applicable and observed authorities;
- avoid principal, permission, or workspace inference.

Constraints:

- no authentication or authorization behavior;
- no middleware reordering;
- no secrets or raw request bodies;
- no global mutable request state.

## 8.2 Protected-route decision adapter

Future seam: immediately after `isProtectedRouteAllowed` returns and before the existing branch consumes it.

Requirements:

- observe both allow and deny;
- pass an immutable sanitized copy;
- work without `mhAuthorityContext`;
- expose no `res` or `next` capability to the observer;
- preserve current response and status exactly;
- mark proof booleans as presence evidence, not validated approval.

## 8.3 Runtime-security evidence adapter

Future seam: the existing `observeDecision` callback.

Requirements:

- retain its failure isolation;
- emit through a context-independent bounded backend sink;
- add source version, decision time, IDs, and coverage markers outside the original decision;
- preserve nested route/provider classifier semantics;
- never change the subsequent allow/deny branch.

## 8.4 Governance decision adapter

Future seam: immediately after each wrapper receives the original governance decision and before the unchanged branch consumes it.

Requirements:

- cover mutation and approval-lifecycle wrappers;
- observe allow and deny;
- snapshot only allowlisted details;
- reference policy/approval versions or stable hashes when available;
- never reevaluate policy or approval stores;
- never expose approval mutation capability.

## 8.5 Approval evidence reference adapter

Purpose:

- convert an approval consumed by governance into a stable sanitized evidence reference;
- retain status, entity/action binding, decision time, lifecycle state, and approved/overridden provenance when trustworthy;
- explicitly label actor-supplied identity fields as untrusted where applicable.

Constraints:

- no raw approval object retention by mutable reference;
- no approval creation or status change;
- no payload, secret, or personal-data leakage;
- no equation of approval ID presence with approved status.

## 8.6 Provider classification adapter

Purpose:

- normalize provider classification as non-enforcing evidence;
- retain provider, execution mode, risk, required scope, reason, and catalog version;
- distinguish classification from current enforcing caller outcome.

This adapter may consume the nested classification already present in the runtime-security decision. It must not call the classifier again.

## 8.7 Provider execution-result reference adapter

Purpose:

- correlate an already-produced provider/queue/executor result to the earlier classified action when a future reviewed common seam exists;
- distinguish attempted, queued, executed, failed, and unknown outcomes.

Constraints:

- no provider invocation;
- no payload capture;
- no inference of success from a classification allow;
- separately reviewed for each execution owner before common aggregation.

## 8.8 Route classification evidence adapter

Purpose:

- retain the already-produced route classification and catalog version as evidence;
- explicitly mark it non-enforcing;
- avoid treating required scope as granted scope.

## 8.9 Future resolver decision adapter

Purpose:

- consume a versioned decision already produced by a future shadow resolver;
- validate correlation and evidence references;
- never calculate the decision or expose it to enforcement.

Until this producer exists, comparisons remain `UNTRUSTED`.

## 8.10 Authority-chain coverage adapter

Purpose:

- assemble supplied per-source observations by observation ID;
- compare `applicable_authorities` with `observed_authorities`;
- produce an incomplete-coverage result when any expected source is absent.

Constraints:

- cannot invent applicability from an allow outcome;
- cannot replace missing decisions with catalog metadata;
- cannot flatten source disagreements;
- cannot make a request wait for telemetry completion;
- no database is approved by this adapter description.

---

# 9. Adapter Order for a Future Proposal

If later approved, evidence coverage should expand in this risk-contained order:

1. define correlation, sanitization, versioning, and coverage tests;
2. reuse the existing runtime-security observer with context-independent emission;
3. add protected-route allow/deny observation without changing middleware order;
4. add governance mutation and approval-lifecycle observation;
5. add approval and classifier stable references;
6. prove applicable-authority coverage and failure isolation;
7. add a future resolver decision only after its separate contract is satisfied;
8. consider provider execution-result correlation separately per execution owner.

No step authorizes enforcement migration.

---

# 10. Validation Required Before Any Adapter Patch

A future limited observer proposal must prove:

- identical allow/deny, status, response body, and `next()` behavior with observers present, absent, and throwing;
- no middleware reordering;
- both outcomes observed for each instrumented authority;
- no request waits on telemetry I/O;
- no secret, credential, raw body, approval payload, or untrusted actor identity leakage;
- stable correlation and bounded cardinality;
- incomplete authority coverage yields `UNTRUSTED`;
- current denial remains controlling during expected allow;
- route/provider classifiers remain non-enforcing evidence;
- frontend cannot consume drift as access control;
- adapter removal is a narrow rollback that leaves existing gates intact.

---

# 11. BE-7.4 Review Result

Current authorities produce useful evidence, but coverage is fragmented:

- Runtime Security has the only complete local observation seam.
- Provider and route catalogs are indirectly observed classifications.
- Governance has rich local evidence but no shared allow/deny observation.
- Protected Routes have decisions but no shared observer.
- Approval records have durable source material but no normalized immutable reference path.
- No complete shared or request-wide comparison path exists.

Required future adapters can be passive and narrowly placed, but none is approved for implementation by BE-7.4. The next safe action is an architecture decision among continued shadow documentation, limited observer expansion, and future resolver integration.

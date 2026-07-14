# MH-OS Authority Evidence Truth Scan

## Status

BE-7.1 evidence audit complete.

Documentation only. No runtime implementation, permission enforcement migration, RBAC, database, or frontend authority is created by this document.

Current backend authorities remain authoritative.

---

# 1. Objective

Audit the evidence already produced by current authority paths and identify the missing or incomplete evidence needed for a future shadow-only drift comparison.

This audit covers:

- `req.mhAuthorityContext`;
- `evidence_references`;
- `decision_context`;
- `provider_decision`;
- `governance_decision`;
- approval evidence;
- runtime-security decisions;
- protected-route decisions;
- route-permission classification.

---

# 2. Pre-Implementation Proof

## 2.1 Truth

The active runtime proves:

- `identity-adapter.js` creates `mh-authority-context-v1` as a passive shadow context;
- `workspace_id` is fixed to `null`, while `roles` and `permissions` are empty;
- `governance_decision` and `provider_decision` are initialized to `null`;
- current `server.js` attachment sites do not supply `evidence_references` or `decision_context`;
- runtime-security middleware has a failure-isolated `observeDecision` callback;
- that callback records only when `req.mhAuthorityContext` already exists;
- protected-route and governance decisions are not copied into the shared context;
- provider and route catalogs classify inputs but do not independently prove the final request outcome;
- no future Authority Resolver decision producer exists.

## 2.2 Scope

BE-7 observes and documents authority evidence and drift. It does not change authentication, authorization, middleware ordering, governance, provider execution, project isolation, persistence, or frontend behavior.

## 2.3 Authority ownership

The following existing backend components retain ownership of their current boundaries:

| Authority | Current ownership |
|---|---|
| Runtime security enforcement | Sensitive-route allow/deny and HTTP enforcement |
| Protected-route authority | Proof-based protected-route allow/deny |
| Provider execution gate | Provider action classification consumed by current callers |
| Governance mutation gate | Policy and approval decision for governed mutations |
| Route-permission catalog | Route access, scope, risk, and lifecycle classification |

The future Authority Resolver remains shadow-only and has no enforcement ownership.

## 2.4 Safety boundary

Evidence and drift monitoring may describe a current decision but may not authorize, deny, execute, modify security, change approval state, bypass a gate, or replace governance. Missing evidence is not permission.

---

# 3. Existing Evidence Producers

## 3.1 Identity authority context

`runtime/orchestrator-service/lib/security/identity-adapter.js` produces:

- a versioned passive context;
- a normalized compatibility service principal after an existing guard succeeds;
- `project_id` when supplied;
- bounded and sanitized `evidence_references` when supplied;
- `decision_context.existing_runtime` when supplied;
- bounded `shadow_observations` marked `mode: shadow` and `authoritative: false`.

Current limitations:

- the active read/write attachment sites supply only an identity assertion;
- `evidence_references` is therefore empty in those paths;
- `decision_context.existing_runtime` is therefore empty in those paths;
- workspace, membership, roles, permissions, governance, and provider fields remain unresolved;
- context attachment occurs after some protected-route middleware.

## 3.2 Runtime security enforcement

`runtime-security-enforcement.js` produces a decision containing:

- whether the boundary was enforced;
- allow/deny outcome;
- reason;
- route classification;
- provider classification when applicable.

`server.js` records this decision through the shared shadow observer as `runtime_security_decision` when `mhAuthorityContext` is already present.

This is the only current shared, failure-isolated decision observation seam.

Current limitations:

- requests without an attached context are silently unobserved;
- no stable decision ID, observation ID, source version, or timestamp is added;
- evidence is embedded as a sanitized decision snapshot rather than referenced through a versioned evidence record;
- observation completeness across other applicable gates is not recorded.

## 3.3 Protected-route authority

`protected-route-authority.js` produces an allow/deny decision with:

- HTTP status and code;
- route ID, authority level, category, and forbidden action;
- boolean proof presence for approval, manual execution, owner workspace, and review output.

Allowed decisions may be attached to `req.protectedRouteAuthority`. Denied decisions terminate the route locally.

Current limitations:

- no shared observer exists;
- denied decisions can terminate before `mhAuthorityContext` exists;
- proof presence is not durable approval validation;
- no stable evidence reference, decision ID, timestamp, policy version, or correlation ID exists;
- allowed and denied coverage cannot currently be proven at request level.

## 3.4 Provider execution gate

`provider-execution-gate.js` produces a classification with:

- provider, risk, and status;
- execution indicator;
- allowed flag and decision vocabulary;
- required scope, reason, and audit-event label.

Runtime security can embed that classification in its own observed decision.

Current limitations:

- the provider gate is explicitly a classifier, not a standalone enforcement observer;
- current runtime-security inputs derive `configured` and `approved` from write-key presence in that path;
- `mhAuthorityContext.provider_decision` remains null;
- provider execution success, queue acceptance, provider response, and downstream side effects are not correlated to the classification;
- there is no independent stable provider evidence reference.

## 3.5 Governance mutation gate

`governance-mutation-gate.js` produces policy and approval decisions with:

- allowed flag, decision, reason, and response code;
- action and project detail;
- applicable policy information when evaluated;
- approval selector detail on missing approval;
- approval ID and approving identity fields when an approved decision is found.

The `server.js` wrapper enforces the returned decision and logs denied outcomes.

Current limitations:

- the original decision is local to the wrapper;
- neither allow nor deny is copied into `mhAuthorityContext.governance_decision`;
- no shared observer, observation ID, policy snapshot reference, or correlation ID exists;
- a denial log is operational evidence but is not a complete, normalized comparison record;
- mutable governance policy and approval stores must not be reevaluated later to reconstruct the original decision.

## 3.6 Approval evidence

The governance layer reads durable approval records and can select an approved decision by approval ID or entity/action selectors. Approval records can carry status, reviewer/decider, timestamps, entity identifiers, action, and approval fingerprint.

Current limitations:

- approval evidence is consumed inside governance evaluation but not emitted as a sanitized immutable evidence reference for the shared authority context;
- protected-route `approval_id` presence is only proof presence and is not equivalent to governance approval validation;
- approval creation, pending, rejection, approval, override, and consumption are not joined to one authority observation chain;
- secret-bearing or actor-supplied values require allowlisted sanitization before telemetry use.

## 3.7 Route-permission catalog

`route-permission-catalog.js` produces route metadata including access class, required scope, route status, risk, provider/destructive indicators, audit-event label, and recommendation.

Current limitation: this is classification evidence only. It cannot establish principal membership, workspace scope, capability grant, permission, or final allow/deny by itself.

---

# 4. Evidence Path Coverage

| Evidence path | Producer exists | Shared observation | Correlated evidence | Coverage verdict |
|---|---:|---:|---:|---|
| Identity context after existing read/write guard | Yes | Yes | No | Partial |
| Runtime-security allow/deny with attached context | Yes | Yes | Partial | Best current path, still incomplete |
| Runtime-security decision without attached context | Yes | No | No | Missing |
| Protected-route allow | Yes | No | No | Missing |
| Protected-route deny | Yes | No | No | Missing |
| Provider classification inside runtime security | Yes | Indirect | Partial | Partial classifier evidence |
| Provider execution result | Varies by provider path | No common path | No | Missing |
| Governance mutation allow | Yes | No | No | Missing |
| Governance mutation deny | Yes | Log only | No | Partial operational evidence |
| Approval record selected by governance | Yes | No common path | No | Missing normalized reference |
| Route classification | Yes | Indirect | Partial | Classification only |
| Future Authority Resolver decision | No | No | No | Absent |

---

# 5. Missing Evidence Paths

The following paths prevent trusted drift comparison:

1. protected-route allow and deny observation;
2. governance allow and deny observation;
3. normalized approval-evidence references bound to the decision that consumed them;
4. provider classification and execution-result correlation;
5. runtime-security observations for requests without current authority context;
6. request-wide observation and correlation IDs;
7. decision timestamps and source/policy/catalog versions;
8. explicit applicable-authority and observed-authority coverage markers;
9. trusted workspace, membership, scope, capability, and permission context;
10. a future, versioned, non-authoritative Authority Resolver decision;
11. immutable evidence snapshots or stable references that prevent later reevaluation drift;
12. evidence retention, sampling, redaction, and cardinality policy.

---

# 6. Incomplete Comparison Points

## 6.1 Current versus future decision

No future resolver decision exists. Any current-versus-future comparison must therefore be `UNTRUSTED`, not a match and not a permission result.

## 6.2 Request-wide current decision

More than one current authority may apply. A current request summary is incomplete unless every applicable enforcing authority is identified and its original outcome is observed. One observed allow cannot prove request-level allow.

## 6.3 Evidence semantics

The following pairs must not be treated as equivalent:

- approval ID presence and approved governance decision;
- route required scope and granted scope;
- provider classification and provider execution outcome;
- write-key authentication and workspace membership;
- project name and workspace authority;
- empty permissions and an authoritative denial;
- absent evidence and evidence of absence.

## 6.4 Correlation

Current evidence lacks a stable link across identity context, protected route, runtime security, governance, approval, provider classification, and provider execution. Comparisons assembled only by route, project, or timestamp would have insufficient integrity.

---

# 7. BE-7.1 Review

The audit establishes:

- current evidence producers exist but are fragmented;
- only runtime security has a shared passive observer;
- complete request-level observation does not exist;
- current context fields intentionally expose missing authority rather than a future model;
- future decision evidence is absent;
- drift monitoring must represent missing or uncorrelated evidence as `UNTRUSTED` or `MISSING_EVIDENCE`;
- no evidence path is safe to use for runtime authorization migration.

BE-7.1 is complete as a no-runtime-patch truth scan. The next safe action is a documentation-only drift monitoring contract.

# MH-OS Authority Observation Gap Truth Scan

## Status

BE-8.1 observation gap audit complete.

Documentation only. No runtime observer, decision, permission enforcement, RBAC, database, governance, provider, middleware, or frontend behavior is changed.

Existing backend authorities remain authoritative.

---

# 1. Objective

Audit the current observation capabilities and gaps for:

- `runtime-security-enforcement`;
- `protected-route-authority`;
- `governance-mutation-gate`;
- `provider-execution-gate`.

The audit establishes the factual boundary for a future unified passive observation design that can capture decisions and evidence, normalize outcomes, detect missing context, and support drift analysis without participating in runtime control.

---

# 2. Authority and Safety Proof

## 2.1 Current authority ownership

| Source | Current responsibility | Enforcement meaning |
|---|---|---|
| `runtime-security-enforcement` | Classifies sensitive mutations, consumes route/provider classifications, and allows or returns `403` | Enforcing request boundary |
| `protected-route-authority` | Evaluates configured proof requirements and allows or terminates selected protected routes | Enforcing protected-route boundary |
| `governance-mutation-gate` | Evaluates governance policy and approval state; server wrappers allow or return `403` | Enforcing governance boundary |
| `provider-execution-gate` | Classifies provider-facing actions for current callers | Classifier; not independently a provider execution result |

No BE-8 observation design owns any of these decisions.

## 2.2 Scope

BE-8.1 is read-only architecture analysis. It does not approve an implementation patch, telemetry sink, persistence mechanism, resolver integration, or enforcement migration.

## 2.3 Safety boundary

An authority observation may describe a decision already made. It must never:

- authorize;
- deny;
- execute;
- override governance;
- replace a security gate;
- call middleware continuation;
- write an HTTP response;
- mutate policy, approval, provider, or request state;
- infer membership, scope, capability, or permission;
- become frontend authority.

---

# 3. Current Request Ordering Truth

The active server establishes these relevant boundaries:

1. selected protected-route middleware is registered early;
2. protected-route decisions can allow or terminate before identity authority context is attached;
3. protected write/read key middleware later attaches `req.mhAuthorityContext` only after successful validation;
4. runtime-security middleware then evaluates sensitive routes and invokes its optional observer;
5. route handlers may later call governance mutation or approval-lifecycle wrappers;
6. provider classification is produced inside runtime-security classification when applicable;
7. provider execution results occur in path-specific owners and have no common authority observation seam.

Consequences:

- no single current request location sees every authority decision;
- `mhAuthorityContext` cannot be required for early protected-route observation;
- decisions cannot safely be reconstructed later from response status or logs;
- one request may have several independently authoritative outcomes;
- observation completeness must be explicit per authority.

---

# 4. Runtime Security Truth

## 4.1 Decision production

`classifyRuntimeSecurityDecision` returns:

- `enforced`;
- `allowed`;
- `reason`;
- `routeClassification`;
- `providerClassification` when applicable.

The middleware consumes that same decision to continue or return a denial response.

## 4.2 Existing observation

`createRuntimeSecurityEnforcementMiddleware` accepts an optional `observeDecision` callback. The callback:

- receives the original decision and write-key-presence boolean;
- runs before the unchanged enforcement branch;
- is invoked for allowed, denied, and not-enforced results;
- is protected by a local `try/catch` so callback failure cannot alter runtime behavior.

The configured server observer records a sanitized shadow observation only when `req.mhAuthorityContext` already exists.

## 4.3 Gaps

- no shared record is produced when authority context is absent;
- no observation ID or source decision ID;
- no decision timestamp or source/catalog version;
- no explicit applicable-versus-observed authority coverage;
- no stable evidence references;
- write-key presence is recorded as an authentication fact but must not become membership or permission evidence;
- nested route/provider classification semantics are not separately labeled in the shared record;
- shared context storage is request-local and is not a durable observability system.

## 4.4 Verdict

Runtime Security has the safest existing passive seam, but not a complete shared observation contract.

---

# 5. Protected Route Truth

## 5.1 Decision production

`isProtectedRouteAllowed` produces one decision containing:

- `allowed`;
- HTTP `status`, `code`, and `message`;
- route ID, configured authority, category, and forbidden action;
- boolean proof presence for approval, manual execution, owner workspace, and review output.

`enforceProtectedRouteAuthority` consumes the decision once. It attaches an allowed decision to `req.protectedRouteAuthority`; a denied decision writes the current response and returns false.

## 5.2 Existing observation

There is no passive observer callback and no shared authority observation record.

Allowed decisions remain request-local. Denied decisions may terminate before `mhAuthorityContext` exists.

## 5.3 Gaps

- no allow/deny observer;
- no context-independent observation envelope;
- no source decision ID, timestamp, or configuration version;
- no correlation with later runtime-security or governance decisions;
- proof values express presence only, not durable governance approval validation;
- no stable evidence references;
- no record of applicable/observed authority coverage;
- denial response data cannot safely substitute for the original decision snapshot.

## 5.4 Verdict

Protected Route Authority has a clear original-decision seam after evaluation, but current observation coverage is absent.

---

# 6. Governance Truth

## 6.1 Decision production

`evaluateGovernanceMutationGate` produces a decision after reading current policy and approval state. Decisions include:

- `allowed`;
- normalized governance `decision`;
- `reason`;
- response code/message when denied;
- details containing action, project, policy, approval requirement, selector, or approved-decision references as applicable.

`evaluateGovernanceApprovalLifecycle` can also return allowed, rejected, pending, or newly created approval outcomes.

## 6.2 Existing consumption

The server has two shared wrappers:

- `enforceGovernanceMutationGate`;
- `enforceGovernanceApprovalLifecycle`.

Both wrappers receive the original decision before branching. The mutation wrapper logs denials. The lifecycle wrapper may attach an approval object for an allowed result.

## 6.3 Existing observation

Neither wrapper emits a shared authority observation for both outcomes. `mhAuthorityContext.governance_decision` remains null.

## 6.4 Gaps

- allowed decisions are not normalized into observation evidence;
- denied logs are operational records, not correlated immutable decision records;
- no failure-isolated observer callback;
- no observation/source decision ID or timestamp;
- no stable policy version/reference;
- approval evidence is not emitted through an allowlisted immutable reference contract;
- actor/requester fields may originate in request input and cannot establish trusted principal identity;
- reevaluating mutable policy or approval stores later could produce a different decision;
- approval lifecycle and mutation gate outcomes are not joined into one observation chain.

## 6.5 Verdict

Governance has strong source evidence and two narrow post-evaluation seams, but no unified passive observation path.

---

# 7. Provider Gate Truth

## 7.1 Decision production

`classifyProviderAction` returns:

- action;
- provider;
- risk and status;
- execution indicator;
- `allowed` classification;
- provider decision vocabulary;
- required scope;
- reason;
- audit-event label.

## 7.2 Existing consumption and observation

In the active runtime security source, provider classification is called from `classifyRuntimeSecurityDecision` and retained as `providerClassification` in that decision.

It is indirectly included in the runtime-security shadow observation only when authority context exists.

## 7.3 Gaps

- no independent provider classification observer;
- `mhAuthorityContext.provider_decision` remains null;
- the classification is not a provider call, queue result, or execution outcome;
- current runtime-security inputs map write-key presence into `configured` and `approved` for that classification path;
- no classifier version or stable evidence reference;
- no common correlation to path-specific provider execution results;
- no explicit record distinguishing classifier allow from current enforcing authority allow.

## 7.4 Verdict

Provider Gate output is observable as nested classifier evidence at the runtime-security seam. It must not be promoted into an independent execution or permission decision.

---

# 8. Shared Context Truth

`mh-authority-context-v1` is a passive request context with bounded sanitization and shadow observations.

Current limitations relevant to BE-8:

- attachment happens only after successful current guards on selected paths;
- `workspace_id` remains null;
- roles and permissions remain empty;
- governance and provider decision fields remain null;
- active attachment sites do not populate `evidence_references` or `decision_context`;
- it is not available to some early protected-route outcomes;
- it has no request-wide completeness model;
- it is not a persistence or telemetry transport contract.

Conclusion: a unified observation design may reference or enrich a later context contract, but it cannot depend on v1 context availability and cannot overload empty fields into authority claims.

---

# 9. Cross-Authority Gap Matrix

| Requirement | Runtime Security | Protected Route | Governance | Provider Gate |
|---|---|---|---|---|
| Original decision exists | Yes | Yes | Yes | Yes, classifier |
| Passive callback exists | Yes | No | No | No independent callback |
| Both positive/negative outcomes observable | Locally yes | No | No shared path | Indirectly through Runtime Security |
| Failure isolation exists | Yes | No observer | No observer | Inherits Runtime Security only |
| Works without `mhAuthorityContext` | Callback yes; configured record no | Required but absent | Wrappers can access request | Nested callback can |
| Observation ID | No | No | No | No |
| Decision ID/time/version | No | No | No | No |
| Stable evidence references | No | No | No | No |
| Context-gap markers | No | No | No | No |
| Applicable/observed coverage | No | No | No | No |
| Unified normalized outcome | No | No | No | Must remain classifier semantics |
| Drift-ready current-side evidence | No | No | No | No |

---

# 10. Missing Unified Capabilities

A future design must define, without yet implementing:

1. an opaque observation correlation envelope available independently of authority context;
2. one source-neutral observation record with explicit source semantics;
3. capture of original decisions after evaluation and before unchanged consumption;
4. deterministic outcome normalization that preserves raw source labels;
5. evidence references rather than secret-bearing or mutable payload copies;
6. explicit missing-context and missing-authority-coverage markers;
7. source decision time and source/configuration version fields;
8. bounded sanitization and cardinality rules;
9. failure isolation and no-blocking-I/O rules;
10. authority-chain assembly that never invents missing decisions;
11. compatibility with BE-7 drift records and shadow states;
12. backend-only ownership and frontend projection restrictions;
13. a separate future transport/retention decision without database creation.

---

# 11. Forbidden Unification Shortcuts

The shared design must not:

- replace source-specific decision functions with one observer decision;
- make a shared normalized outcome authoritative;
- infer a missing protected-route outcome from later middleware;
- infer governance approval from approval ID presence;
- infer provider execution from provider classification;
- infer permission from route required scope;
- infer identity, membership, or workspace from project or actor labels;
- treat an absent observation as allow, deny, match, or not-applicable;
- reconstruct original decisions from HTTP status or logs;
- reevaluate mutable governance, approval, route, or provider sources;
- require telemetry completion before a request proceeds;
- expose observation output to frontend access-control logic.

---

# 12. BE-8.1 Review Result

The current runtime supplies viable original-decision seams but no unified passive observation layer.

Verified design direction:

- reuse Runtime Security's existing callback model;
- design a post-evaluation callback for Protected Routes;
- design post-evaluation callbacks at both Governance wrappers;
- consume Provider Gate output as nested classifier evidence unless a separately owned provider-execution result is observed;
- use a context-independent correlation envelope;
- preserve every current gate and response branch unchanged;
- convert missing context and coverage into explicit observation gaps;
- keep drift analysis downstream and non-authoritative.

BE-8.1 is complete as a no-runtime-patch truth scan. The next safe action is the documentation-only Shared Authority Observation Contract.

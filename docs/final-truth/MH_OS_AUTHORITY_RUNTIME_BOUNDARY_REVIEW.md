# MH-OS Authority Runtime Boundary Review

## Status

BE-6.4 architecture review only.

No runtime insertion is approved or implemented by this document.

---

# 1. Objective

Identify safe future observation seams, forbidden insertion points, and migration risks for the Authority Resolver Adapter.

---

# 2. Audit

## 2.1 Verified request ordering

In `server.js`:

1. selected protected-route middleware is registered near the creation of the Express application;
2. protected write-key middleware later attaches `req.mhAuthorityContext` after successful key validation;
3. protected read-key middleware later attaches the same passive context;
4. runtime-security middleware then evaluates sensitive routes and invokes its optional observer before enforcing its result;
5. route handlers may later invoke the governance wrapper before mutation;
6. provider-facing execution remains behind the existing protected-route, runtime-security, governance, and provider-specific paths that apply to each route.

This ordering means there is no single current request location that reliably sees every gate decision.

## 2.2 Verified observation coverage

| Boundary | Decision exists | Shared shadow observation exists | Current limitation |
|---|---:|---:|---|
| Identity adapter | Yes, compatibility principal context | Yes | Workspace, roles, permissions, governance, and provider context remain unresolved |
| Runtime security | Yes | Yes | Observer records only when `req.mhAuthorityContext` already exists |
| Protected route | Yes | No | Denial may terminate before identity context is attached |
| Governance mutation | Yes | No | Decision remains local to the server wrapper |
| Provider classification | Yes | Indirectly, inside runtime-security decision | Classification inputs currently derive configured/approved from write-key presence in this path |
| Route catalog | Classification only | Indirectly, inside runtime-security decision | Must not be mistaken for a final allow/deny |

---

# 3. Safe Future Insertion Points

Safe means architecturally suitable for a later, separately approved, minimal passive patch. It does not authorize a patch now.

## 3.1 Existing runtime-security observer

The `observeDecision` callback in `createRuntimeSecurityEnforcementMiddleware` is the safest existing seam because:

- the current decision already exists;
- the observer executes before the unchanged allow/deny branch;
- observer errors are caught and ignored;
- the observer does not control `next()` or the response.

A future adapter may consume a sanitized immutable snapshot here, provided it performs no I/O and its result remains shadow-only.

## 3.2 After protected-route evaluation

A future optional observer may receive the decision immediately after `isProtectedRouteAllowed` returns and before the existing branch consumes it.

Conditions:

- the existing decision object is passed through unchanged;
- observation is wrapped in failure isolation;
- both allow and deny results are observed;
- the observer has no `res`, `next`, or mutation capability;
- middleware order is not changed as part of the adapter patch.

Because protected routes currently precede identity context attachment, missing principal context must remain explicit rather than being synthesized.

## 3.3 After governance evaluation

The `server.js` governance wrapper may later expose a passive callback immediately after `evaluateGovernanceMutationGate` returns and before its existing allow/deny branch.

The snapshot may include the sanitized decision, action, project, and stable evidence references. It must not include approval secrets or mutable approval records by reference.

## 3.4 Existing identity context attachment

The successful existing read/write guard attachment points are safe context sources. They are not safe enforcement points. A future adapter may read the attached context but must not influence guard success.

## 3.5 Route and provider classification as evidence

`classifyRoute` and `classifyProviderAction` results may be carried into a comparison as source evidence after their current caller evaluates them. The adapter must not invoke either classifier as a substitute for capturing the actual current request decision.

---

# 4. Forbidden Insertion Points

The adapter must not be inserted:

- before authentication to predict or replace guard outcomes;
- inside credential comparison or credential extraction;
- as middleware that can call `next()`, terminate a response, or change status codes;
- as a replacement for `classifyRuntimeSecurityDecision`, `isProtectedRouteAllowed`, governance evaluation, or provider classification;
- between a governance denial and its existing response in a way that can suppress or alter the denial;
- inside governance policy, approval creation, approval lifecycle, or mutation persistence;
- inside provider adapters, execution routers, queues, native executors, publishing, send, sync, or destructive action code;
- inside project isolation or path resolution as a replacement for boundary validation;
- in frontend projections, route fallback, or UI state as an authority source;
- in a catch path that converts adapter failure into request allow or deny;
- after only the HTTP status is known to infer which authority decided;
- at module import time with mutable global decision state;
- anywhere that reorders existing middleware or bypasses protected public aliases.

---

# 5. Migration Risks

| Risk | Current evidence | Required mitigation before any runtime patch |
|---|---|---|
| Incomplete observation | Only runtime security has a shared observer | Per-authority coverage markers; incomplete chain becomes `UNTRUSTED` |
| Middleware ordering | Protected routes may terminate before identity context | Do not reorder; permit explicit absent principal context in shadow records |
| Context loss | Current context construction fixes workspace to `null` and resets unresolved authority fields | Version a future context contract; never silently overload v1 fields |
| Classifier/authority confusion | Route catalog is non-enforcing; provider gate is a classifier consumed by runtime security | Preserve `source_authority`, `enforced`, and source semantics |
| Double evaluation | Governance can read mutable policy and approval stores | Capture the original returned decision; never reevaluate for comparison |
| Decision-chain ambiguity | Multiple gates can apply to one request | Unique observation/correlation identifiers and explicit applicable-source coverage |
| Allow expansion | A future resolver could say allow when a current gate denies | Record `CONFLICTING`; current denial remains controlling |
| Governance/provider bypass | A unified-looking result could be consumed prematurely | No middleware return value, no execution API, no gate integration |
| Secret leakage | Existing requests contain keys, proofs, payloads, and provider data | Reuse/extend evidence sanitization with bounded allowlisted fields |
| Frontend authority drift | Existing projection and fallback vocabulary coexist | Shadow records remain backend-only telemetry; UI cannot consume them for access control |
| Vocabulary drift | Current catalogs include legacy/future labels | Version mappings and never interpret labels as membership or RBAC grants |
| Performance and availability | Observation runs in request paths | Pure bounded comparison; no synchronous external I/O; swallowed observer failures |
| Mutable evidence | Policies and approvals can change after evaluation | Snapshot stable references, hashes, timestamps, and resolver/source versions |
| Telemetry cardinality/retention | Per-request evidence can grow | Bounded fields, sampling/retention decision, no raw request bodies |

---

# 6. Minimum Validation Before Limited Integration

Any future runtime proposal must first provide:

- unit tests for all four comparison states and precedence;
- proof that adapter exceptions do not alter allow, deny, status, body, or `next()` behavior;
- middleware-order regression checks;
- allow and deny observation tests for every instrumented authority;
- governance approval and policy regression checks;
- provider execution and project-isolation regression checks;
- secret-redaction and evidence-size tests;
- tests proving absent future context produces `UNTRUSTED`;
- tests proving current denial remains controlling during an allow-expansion conflict;
- an explicit rollback patch that removes only passive observation wiring.

---

# 7. Review Result

The runtime has viable passive seams, but observation coverage is not yet complete enough for a trusted request-level comparison.

The safe next boundary is documentation-approved shadow design followed, only if explicitly authorized, by narrow observer instrumentation. Direct resolver enforcement is not safe or in scope.

---

# 8. Decision Gate

No runtime modification is approved.

Documentation review and explicit approval are required before any limited adapter integration proposal.

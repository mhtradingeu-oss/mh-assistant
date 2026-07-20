# Selected Shadow Slice Design

Status: Phase 1B-1C **DESIGN DECISION** only. No runtime attachment, resolver, flag, sink, test, or configuration is approved or created.

## Slice definition

| Property | Decision |
|---|---|
| Route | Canonical exact `GET /media-manager/project/:project/customer-operations/health` only |
| Current owner | Express route `handleCustomerOperationsHealth` (`server.js:13466-13477,13590-13593`) |
| Current authoritative guard | For exact GET, `requireProtectedReadKey` via `SENSITIVE_READ_ROUTE_PATTERNS` (`server.js:741-811`) |
| Future resource | `customer_operations_runtime_health` bound to resolved Project context only when authoritative Project evidence exists |
| Future action | `customer_operations.runtime_health.read` |
| Required scope | Project, with authoritative Workspace relationship when such evidence is available |
| Side effects | Current handler: no per-request source I/O or mutation; future observer: source-read-only comparison evidence only |
| Explicit exclusions | HEAD, `/public/...` alias, readiness/data routes, mutations, provider execution, other methods, wildcard routes |

## Complete current behavior

**CURRENT PROVED TRUTH:** The canonical route exists at `server.js:13590-13593`. On exact GET, the read guard may return 503 when the server key is absent, 401 when the caller key is absent, 403 on mismatch, or continue after a match. When the startup-captured local bypass is enabled it adds `X-MH-Control-Key-Bypass: temporary` and continues. Runtime security does not enforce GET, and the selected path does not match the installed AI rate limits.

Before the handler, Project-related middleware executes in this order: `validateRawProjectSlugPathSegment`; `validateOptionalProjectSlugFields`; and `app.param('project')` normalization (`server.js:1522-1575`). Invalid, encoded-invalid, or traversal-like raw Project segments return the existing 400 response. When a body `project` or `query.project` property is present, `validateOptionalProjectSlugFields` passes it through `normalizeProjectSlug` and returns the existing 400 on validation failure. A valid body value is replaced with its normalized form. For query input, the installed Express 5 getter reparses the simple query string on access, so validation is performed but assignment to one returned query object is not a durable normalized request field. The handler does not consume either optional field.

`normalizeProjectSlug` first string-coerces input (`project-isolation.js:46-68`). Therefore a valid scalar or single-element body array can normalize; a valid mixed-case or surrounding-whitespace value normalizes to its trimmed lowercase form. Empty, invalid, encoded/traversal-like, object-shaped, and multi-element body arrays stringify to forms rejected by the installed slug rules and return 400. Express's installed simple query parser produces a scalar for one `project` parameter and an array for repeated parameters; repeated values stringify with commas and fail the slug grammar. Bracket-shaped keys such as `project[x]` remain unrelated literal keys under the simple parser and do not create `query.project`. These upstream checks occur even though the health handler itself does not use query or body data. Unrelated non-Project query parameters are not consumed by this handler or these Project-field checks.

A syntactically valid route slug or optional Project field does not trigger a Project lookup. Project existence, canonical Project identity, Workspace relationship, membership, grant, and permission are not established.

`handleCustomerOperationsHealth` calls `customerOperationsRuntime.health()` and returns 200 with `{runtime, status, capabilities}`: an internal runtime identifier, ready status, and boolean capability map (`customer-operations-runtime.js:114-135`). It does not read customer or approval data, execute a provider, inspect provider configuration, access Project storage, or write source/evidence state. `createCustomerOperationsRuntime()` registers default channels once during module initialization, not during each request (`customer-operations-runtime.js:43-45`). On handler exception it returns 500 with `customer_operations_health_failed` and the existing error message.

The response is `INTERNAL` operational metadata. It exposes capability availability but no credential values/names, provider/model inventory, customer/approval data, filesystem paths, or Project data. No runtime internal caller of the selected handler or canonical route was found beyond its Express registration. A public compatibility alias exists at `server.js:13595-13597` but is outside the slice. No route-specific `Cache-Control` policy is installed; current Helmet/CORS/compression and Express-generated headers remain authoritative and must be identical with shadow off and on.

Express can dispatch HEAD to the registered GET route because no explicit HEAD route exists, while `isProtectedControlReadRequest` accepts only exact GET. HEAD can therefore skip the read-key guard and reach the same validators and handler, with Express suppressing the response body. This is a current guard discrepancy, not an approved change. The observer allowlist is exact-GET only and must never treat HEAD as guarded by `requireProtectedReadKey`.

## Behavior invariance

**DESIGN DECISION:** Shadow work cannot alter any status, header, body, ordering, timing contract, handler invocation count, health result, log visible to the caller, cache behavior, alias behavior, HEAD behavior, or bypass behavior. Current denial and invalid-route branches do not invoke the resolver. They may emit only a bounded current-path aggregate metric containing no key or request data if separately approved.

The observer must not ingest or persist the response or handler payload. Any future contract that permits response-derived evidence requires a separate security/privacy review and approval.

## Future invocation point

The conceptual attachment point is after successful exact-GET return from `requireProtectedReadKey`, after exact route identity and all three installed Project validation/normalization stages have succeeded, and before `handleCustomerOperationsHealth`. A raw-path, optional body/query Project, or route-parameter 400 therefore produces no shadow observation. The observer receives a newly built allowlisted context; it must not receive `req`, `res`, raw headers, query objects, cookies, raw body, handler output, or credential values.

```text
exact GET + canonical route + current read guard result = continue
  -> invoke handler path independently
  -> schedule bounded shadow evaluation from allowlisted snapshot
  -> current handler/response remains authoritative
  -> compare only after both normalized current fact and shadow result exist
```

The request path must not await an unbounded observer. Preferred future architecture is an in-process bounded snapshot handoff followed by an isolated asynchronous evaluator. If a handoff cannot be proven non-blocking and bounded, the observer remains disabled.

## Allowlisted future input projection

- contract and call-site version;
- generated correlation ID unrelated to credentials;
- exact method `GET` and canonical route ID, not raw URL;
- normalized action and resource type;
- validated route Project slug transiently plus an optional authoritative Project ID/evidence reference;
- compatibility authentication state: accepted by existing read guard, method class `control_key`, source `protected_read_key_guard`; no key/fingerprint;
- optional synthetic compatibility service assertion clearly marked `canonical=false`;
- source availability/disposition references only.

Forbidden: key values or hashes, Authorization/cookie headers, IP, raw query/body, health response/capability payload, environment/provider fields, user-agent, frontend role, approval payloads, personal data, and arbitrary `req` properties.

## Expected initial shadow semantics

Until required canonical sources exist:

| Condition | Shadow outcome |
|---|---|
| Route/action contract unsupported | `UNSUPPORTED_ACTION` |
| Principal cannot be established beyond compatibility key assertion | `INSUFFICIENT_CONTEXT` |
| Project existence, Workspace/Project membership, or source availability is missing | `INSUFFICIENT_CONTEXT` |
| Established inactive/revoked membership or explicit applicable deny | `DENY` |
| Required grant absent after authoritative sources are available | `DENY` |
| All required active, fresh, bound authority evidence exists in a later approved source set | `ALLOW` may be calculated in shadow only |
| Health/readiness/approval/provider evidence present but permission evidence missing | `INSUFFICIENT_CONTEXT` or `DENY` according to the missing authority fact; never `ALLOW` |

An initial stream dominated by `INSUFFICIENT_CONTEXT` is correct evidence of source gaps, not a resolver defect and not permission to synthesize data.

## Comparison contract

The live normalized fact for successful exact-GET attachment is `CURRENT_ALLOW_TO_HANDLER` with source `protected_read_key_guard`. Shadow categories are:

- `AGREEMENT_ALLOW`: future only; current continued and qualified shadow says `ALLOW`;
- `SHADOW_STRICTER`: current continued, shadow says `DENY`;
- `SHADOW_INSUFFICIENT`: current continued, shadow says `INSUFFICIENT_CONTEXT`;
- `SHADOW_UNSUPPORTED`: current continued, shadow says `UNSUPPORTED_ACTION`;
- `SHADOW_MORE_PERMISSIVE`: current deny vs shadow `ALLOW`; resolver is not invoked on deny paths in this slice;
- `SHADOW_UNAVAILABLE`, `MALFORMED`, `STALE_OR_CONCURRENT`, `UNCOMPARABLE`.

No category is disclosed in the response or to the frontend.

## Safety and rollback acceptance gates

Before future attachment, prove with offline fixtures and isolated tests:

1. exact GET/canonical-route allowlist rejects HEAD, aliases, and neighboring routes;
2. observer has no write-capable domain dependency;
3. disabled is the default and uncertain configuration means disabled;
4. timeout, exception, malformed result, queue full, and sink failure cannot throw into the request path;
5. on/off responses, statuses, headers, handler count, health results, and cache semantics are identical;
6. kill switch stops new snapshots without modifying current middleware or routes;
7. comparison storage access, retention, redaction, deletion, and incident ownership are approved;
8. no positive result is possible from compatibility identity, Project slug, health state, role label, approval, or provider state alone.

## Threats specific to this slice

| Threat | Required control |
|---|---|
| Project parameter mistaken for Project existence or membership | Require source-qualified Project identity/relationship/membership references; missing means non-allow. |
| Shared key mistaken for a service grant | Mark compatibility assertion non-canonical; no positive grant expansion. |
| Health response accidentally captured | Observer input excludes handler payload; comparison stores only outcome metadata. |
| Capability flags mistaken for permission | Treat them as operational metadata only and exclude them from resolver input. |
| HEAD assumed protected by GET guard | Exact-method allowlist excludes HEAD and tests preserve the installed discrepancy without endorsing it. |
| Alias accidentally included | Exact canonical call-site ID and method allowlist. |
| Observer load delays health response | Bounded non-blocking handoff, sampling, queue cap, circuit breaker. |
| Repeated requests duplicate evidence | Deterministic deduplication key and idempotent sink. |

## FUTURE IMPLEMENTATION

Requires a separately approved phase with exact code/config/test scope. It must implement the interfaces in [Authority Interface Design](AUTHORITY_INTERFACE_DESIGN.md), safety controls in [Shadow Observation and Safety Design](SHADOW_OBSERVATION_AND_SAFETY_DESIGN.md), and tests in [Future Targeted Test Matrix](FUTURE_TARGETED_TEST_MATRIX.md).

## DEFERRED / NOT PROVED

- **DEFERRED:** HEAD remediation, positive Principal/membership/grant sources, enforcement use, aliases, other routes, and frontend projection.
- **NOT PROVED:** Project existence at this handler, Workspace binding, canonical Principal, membership, grant, explicit cache policy, restricted sink, reviewer access, and production latency budget.

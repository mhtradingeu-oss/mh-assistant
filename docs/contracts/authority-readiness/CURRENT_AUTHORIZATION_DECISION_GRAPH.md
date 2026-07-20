# Current Authorization Decision Graph

Status: Phase 1B-1C current-state model at baseline `2dfd40a1d9d6efd481f85e2df66375baa161aebd`. This is **CURRENT PROVED TRUTH**, not a future ideal.

## Deterministic installed graph

```text
Request
  -> early protected-route pattern match?
       no  -> continue
       yes -> caller proof check (header/query; body unavailable at this order)
                 deny -> 403/409 legacy protected-route body -> STOP
                 allow -> continue
  -> public /public alias?
       no  -> continue
       yes -> compatibility classification
                 denied -> 403 normalized authorization body OR 410 retired body -> STOP
                 classifier error -> warning header, continue
                 allowed -> deprecation headers, continue
  -> helmet / CORS / compression
  -> JSON parser
  -> protected write pattern and POST|PATCH|DELETE?
       yes -> server key configured?
                 no -> 503 -> STOP
              -> caller key present?
                 no -> 401 -> STOP
              -> timing-safe match?
                 no -> 403 -> STOP
                 yes -> attach compatibility service assertion -> continue
       no -> continue
  -> sensitive protected exact GET?
       yes -> read bypass captured true?
                 yes -> add bypass header, continue anonymously
              -> server write key configured / caller key present / match?
                 no -> 503 / 401 / 403 -> STOP
                 yes -> attach compatibility service assertion -> continue
       no -> continue (includes HEAD; Express may later dispatch HEAD to a GET route)
  -> runtime sensitive mutation classification?
       no -> continue
       yes -> required write authorization absent?
                 yes -> 403 route_permission_denied -> STOP
              -> provider execution classification disallows?
                 yes -> 403 route_permission_denied -> STOP
                 no -> continue
  -> route-specific rate limit?
       exceeded -> 429 -> STOP
       otherwise -> continue
  -> handler-local Project/context/path check?
       fails -> heterogeneous 400/404/500 or handler body -> STOP
  -> handler-local governance/approval check applicable?
       fails -> 403 governance body -> STOP
  -> handler-local provider/readiness/execution safety check applicable?
       fails -> heterogeneous 400/403/409/5xx -> STOP
  -> handler executes
  -> response
  -> bounded logs/audit/history where explicit
```

There is no installed `Principal -> membership -> grant -> effective permission` branch. Route registration order and explicit call sites determine coverage.

## Branch ledger

| Branch / owner | Inputs | Outcomes and failure stance | Current response | Evidence | Bypass, ambiguity, duplication |
|---|---|---|---|---|---|
| Early protected-route authority / `protected-route-authority.js` | Route mount, path, caller proof strings | Allow or deny; missing proof fails closed on mounted paths | 403/409 with proof booleans | Response only; allowed decision on `req.protectedRouteAuthority` | Caller proof is unverified; body unavailable before JSON; overlaps later key/runtime/governance gates |
| Public alias classifier / `public-alias-compatibility.js` | Method/path, write-key match, env flags, production | Allow, 403, or 410; classifier exception fails open | Headers plus 403/410 body | Warning/deprecation console telemetry | Defaults preserve compatibility; overlaps key/runtime guards |
| Write-key guard / `server.js` | Method/path, server key, header/Bearer | Continue, 503, 401, 403; fail-closed on matched patterns | Legacy one-field error body | Successful match attaches request-local compatibility identity; denial not explicitly logged here | PUT omitted; pattern coverage partial; same secret used for reads |
| Read-key guard / `server.js` | Exact GET/path, same server key, caller key, captured bypass | Continue, 503, 401, 403; bypass is fail-open outside production | Legacy error body or bypass header | Request-local compatibility identity on success | Bypass; no separate verifier for `MH_CONTROL_CENTER_READ_KEY`; partial patterns; HEAD is excluded even though Express may dispatch it to GET handlers |
| Runtime security / middleware | Method/path/mode and fresh write-key match | Non-sensitive allow; sensitive allow/deny; denies fail-closed | Normalized 403 | Structured denial log; ephemeral observation only when key guard already attached context | Key boolean doubles as provider configured and approved; route catalog is heuristic |
| Rate limiter / server | IP/forwarded address, route family | Continue or 429 | Normalized rate-limit body and `Retry-After` | Structured warning | `x-forwarded-for` trust policy not proved; `anonymous` fallback |
| Project context / helpers and handlers | Param/body/query/text/env/list | Explicit/inferred/default context or missing/error | Heterogeneous | Some domain logs | Context fallback can select a Project; not membership |
| Project isolation / security helper | Slug/path | Valid contained path or 400-class error | Middleware/handler-specific | Error path only | Safety control, duplicated path helpers exist; not permission |
| Governance mutation gate / governance owner | Action, Project, policy, approvals, selector | Allow, policy block, approval required/rejected | 403 on wrappers | Structured denial; approval records | Policy load secure default for high risk; non-governed/disabled-policy branches intentionally allow after existing key guard |
| Approval lifecycle / governance owner | Bound action/route/payload fingerprint, approval store | Allow, create/reuse pending, reject | 403 with bounded approval reference | Durable approval/history data | Caller actor labels are not authenticated; approval remains separate from permission |
| Publishing inline gate / handler | Policy, status, latest approval, job | Continue or throw/block | 409/handler mapping; direct publish 403 | Structured governance block | Duplicates some governance semantics intentionally at exact call sites |
| Provider classifier / runtime security | Action string, key-derived configured/approved, mode | Read/dry-run/allow/gate | Collapsed to runtime 403 | Classification in denial log | Heuristic; key is not real readiness or approval |
| Provider/domain execution / adapters | Provider config/credentials, readiness, action | Result or domain error | Handler-specific | Project integration audit and sync history | Federated and action-specific; no universal gate |
| Handler | Route parameters/body/domain state | Success or domain error | Heterogeneous | Domain-dependent | Inline checks are authoritative where installed; coverage is not universal |
| Frontend caller | Local/browser key, selected role, Project selection | Adds headers, hides/shows routes, handles error | Does not own server response | Browser diagnostics/traces | Default `admin`, local storage, and Project selection must never become authority |

## Current outcome normalization limits

**CURRENT PROVED TRUTH:** Current outcomes cannot be losslessly reduced to a single permission result without source and call-site context. For later comparison only, the following conceptual mapping is safe:

| Current event | Comparison class | Important qualification |
|---|---|---|
| A current guard stops request for missing/invalid key or route proof | `CURRENT_DENY` | Preserve exact guard, status, body, and reason; do not claim a canonical permission denial. |
| All applicable current guards continue and handler runs | `CURRENT_ALLOW_TO_HANDLER` | Means only that installed gates allowed execution to reach handler. |
| Current gate cannot evaluate because server key/policy/source is unavailable | `CURRENT_UNAVAILABLE_OR_DENY` | Preserve exact response; do not reinterpret as resolver insufficient context. |
| No applicable current authority guard | `CURRENT_UNGUARDED` | Not implicit allow and not comparable agreement. |
| Handler safety/governance/provider block | `CURRENT_DOMAIN_BLOCK` | May be non-permission policy/safety outcome. |

## Duplication and ambiguity hotspots

1. Shared key validation occurs in the write guard, read guard, public-alias classifier, and runtime-security middleware.
2. Provider approval/readiness is represented by early proof, governance approval, runtime key-derived classification, environment readiness, and handler-specific checks; these are not equivalent.
3. Governance logic exists in the central gate plus publishing-specific checks and hard-blocked endpoints.
4. Project is represented as slug, route parameter, fallback context, Project identity, data path, and Workspace relationship; none proves caller membership.
5. Role/admin strings occur in business records and frontend navigation without authenticated assignment.
6. Denial shapes and status codes are heterogeneous. Shadow observation must preserve them exactly and compare only normalized classes plus source provenance.

## Selected route instantiation

For the future selected canonical `GET /media-manager/project/:project/customer-operations/health` slice, current GET flow is:

```text
request
-> no early protected-route mount for this GET
-> canonical path (no public-alias branch)
-> applicable shared Helmet / CORS / compression / JSON middleware
-> read-key pattern /^\/(?:public\/)?media-manager\/project\// matches
-> bypass OR configured/present/matching shared control key
-> runtime security: not a mutation, therefore not enforced
-> no AI rate limit match
-> validateRawProjectSlugPathSegment
     invalid raw/encoded/traversal-like Project segment -> 400 -> STOP
-> validateOptionalProjectSlugFields
     body.project present -> String-normalize, validate, and persist normalized value
       invalid/empty/multi-value/object-shaped value -> 400 -> STOP
     query.project present -> String-normalize and validate parsed value
       invalid/empty/repeated multi-value value -> 400 -> STOP
       valid value -> continue; Express query getter reparses on later access
-> app.param('project') normalizes the slug
     invalid Project value -> 400 -> STOP
-> handleCustomerOperationsHealth
-> customerOperationsRuntime.health()
-> 200 {runtime, status, capabilities} OR handler 500
```

The handler does not consume body or query Project fields even though upstream middleware validates them. `normalizeProjectSlug` string-coerces input: a valid body scalar or single-element body array normalizes and is written back, while empty, invalid/encoded/traversal-like, object-shaped, or multi-element body-array input fails the installed slug rules and produces 400. Express uses its simple query parser: a single `query.project` is a scalar and repeated values form an array. The middleware computes normalized validation for a valid scalar; Express 5 exposes `req.query` through a reparsing getter, so assignment to one returned query object is not a durable normalized request field. Repeated values stringify with commas and fail the slug grammar. These syntactic checks do not prove Project existence, Workspace relationship, membership, grant, or permission. The health handler performs no per-request domain or provider I/O. Its runtime object was created during module initialization, outside the request.

For `HEAD` on the same route, Express can dispatch to the registered GET handler because no explicit HEAD route exists. `isProtectedControlReadRequest` rejects methods other than exact GET, so that request skips the read-key branch before reaching the same Project validators and handler; Express suppresses the response body. This current discrepancy is not an approved runtime change.

**DESIGN DECISION:** A future observer, if separately approved, attaches only after the current read guard has made its decision for exact GET and before the handler, without changing this graph. HEAD is outside the observer allowlist unless separately designed and approved. See [Selected Shadow Slice Design](SELECTED_SHADOW_SLICE_DESIGN.md).

## FUTURE IMPLEMENTATION / DEFERRED / NOT PROVED

- **FUTURE IMPLEMENTATION:** versioned comparison normalization and restricted evidence emission.
- **DEFERRED:** route-wide adoption, response normalization, and enforcement migration.
- **NOT PROVED:** a current universal decision owner, universal audit sink, or reliable way to derive authenticated human/service/automation identity from every request.

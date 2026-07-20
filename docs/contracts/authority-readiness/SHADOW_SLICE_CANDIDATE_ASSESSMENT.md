# Shadow Slice Candidate Assessment

Status: Phase 1B-1C **DESIGN DECISION** based on **CURRENT PROVED TRUTH**. Scores use 1 (least favorable) through 5 (most favorable). For `risk`, `side-effect safety`, and `privacy safety`, 5 means safest/lowest risk.

## Mandatory constraints and common guard qualification

Every candidate is a canonical GET route currently matched by `SENSITIVE_READ_ROUTE_PATTERNS` and guarded for exact GET by `requireProtectedReadKey` (`server.js:741-811`). The future observer would not change HTTP status, headers, body, execution, source data, current guard logic, or routing. Public aliases are excluded because their environment-dependent compatibility branch adds ambiguity.

**CURRENT PROVED TRUTH:** Express can dispatch HEAD to a registered GET route when there is no explicit HEAD route, while `isProtectedControlReadRequest` accepts only exact GET. All candidates therefore share a current HEAD/read-guard discrepancy. Guard-clarity scores reflect that limitation. The first observer remains exact-GET only and cannot be used to reinterpret HEAD behavior.

## Scorecard

| Candidate | Risk | Scope clarity | Guard clarity | Evidence availability | Side-effect safety | Privacy safety | Comparison usefulness | Rollback simplicity | Implementation simplicity | First-observation suitability | Total / 50 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A. `GET /media-manager/project/:project/native-media/providers` | 4 | 3 | 4 | 3 | 5 | 3 | 4 | 5 | 5 | 4 | **40** |
| B. `GET /media-manager/project/:project/storage/parity-readiness` | 3 | 4 | 4 | 3 | 5 | 2 | 3 | 5 | 4 | 3 | **36** |
| C. `GET /media-manager/project/:project/approvals` | 2 | 4 | 4 | 4 | 2 | 1 | 5 | 5 | 3 | 2 | **32** |
| D. `GET /media-manager/project/:project/native-media/providers/readiness` | 3 | 3 | 4 | 3 | 4 | 2 | 4 | 5 | 4 | 3 | **35** |
| E. `GET /media-manager/project/:project/customer-operations/health` | 5 | 3 | 4 | 3 | 5 | 4 | 4 | 5 | 5 | 5 | **43** |

## Candidate A — deferred

**CURRENT PROVED TRUTH:** `handleGetNativeMediaProviders` at `server.js:13429-13447` calls static catalog readers and returns `{project, providers, count}`. Routes are registered at `server.js:13754-13755`; only the canonical route was assessed. The handler does not call a provider, execute a mutation, read secret values, invoke governance, or write evidence.

The catalog is bounded and per-request read-only, but its response contains provider/model inventory, `requires_api_key`, and environment-key names. Those are internal configuration metadata rather than secret credential values, so privacy safety is not maximal. The optional `media_type` query also adds comparison cases not present in Candidate E. Project existence and Workspace relationship are not established.

## Candidate B — deferred

**CURRENT PROVED TRUTH:** `server.js:9934-9943` calls `summarizeProjectParity`, which reads Project telemetry and returns absolute telemetry file paths (`server.js:2340-2448`). It performs no deliberate mutation and is key-guarded for exact GET.

Operational paths and telemetry-derived details increase disclosure risk. The handler lowercases the route value but does not establish a canonical Project identity or Workspace relationship.

## Candidate C — deferred

**CURRENT PROVED TRUTH:** `handleListApprovals` reads up to a caller-selected limit from Project approval storage (`server.js:12783-12796,12843-12844`). It is key-guarded for exact GET and does not intentionally mutate approval lifecycle state. However, `listApprovals` calls `getOperationsPaths`, whose existing initialization path ensures directories and default Operations files (`lib/ops/backbone.js:774-809,2757-2759`). A read request can therefore cause lazy filesystem creation.

Approval records may also contain actors, policy decisions, payload summaries, and operational evidence. Their security sensitivity, permission-confusion risk, query variation, and lazy storage side effects make this unsuitable as the first slice.

## Candidate D — deferred

**CURRENT PROVED TRUTH:** `handleGetNativeMediaProviderReadiness` returns environment-derived credential presence, required environment variable names, and local GPU/tool capabilities (`server.js:13449-13462,13756-13757`; `provider-readiness.js:5-21`; `local-rendering-capabilities.js:22-47`). It does not expose secret values but executes local command probes during the request.

Infrastructure fingerprinting and synchronous child-process probes increase privacy, performance, and side-effect uncertainty. Provider readiness is a non-permission dimension and is easy to misinterpret in a permission comparison.

## Candidate E — selected

**CURRENT PROVED TRUTH:** The canonical route is registered as `GET /media-manager/project/:project/customer-operations/health` at `server.js:13590-13593`, with a public alias at `server.js:13595-13597`. Public-alias classification applies only to the alias; the canonical route does not enter that mounted branch. For exact GET, the canonical chain is shared Helmet/CORS/compression and JSON middleware; write guard not applicable; `requireProtectedReadKey`; runtime mutation enforcement not applicable; no matching AI/Telegram rate limit; `validateRawProjectSlugPathSegment`; `validateOptionalProjectSlugFields`; `app.param('project')` normalization; `handleCustomerOperationsHealth`; and `customerOperationsRuntime.health()`. The raw path, optional body/query Project fields, and route parameter can each produce the existing 400 before the handler when their installed validation fails.

`validateOptionalProjectSlugFields` validates a present body `project` or `query.project` through `normalizeProjectSlug` before route dispatch (`server.js:1556-1575`). A valid body scalar or single-element body array is normalized and written back; invalid, empty, encoded/traversal-like, object-shaped, or multi-element body-array values return 400. Under the installed Express simple query parser, a single `query.project` is validated as a scalar and repeated values form an array whose comma-containing string form fails the slug grammar. Express 5 reparses `req.query` through a getter, so the middleware's assignment to one returned query object is not a durable normalized field. The health handler does not consume either optional field.

The handler calls `customerOperationsRuntime.health()`, which returns `{runtime, status, capabilities}` with a fixed runtime name, ready status, and boolean capability map (`lib/customer-operations/customer-operations-runtime.js:114-135`). It performs no per-request storage access, provider execution, governance action, source write, customer/approval read, or Project lookup. `createCustomerOperationsRuntime()` invokes `registerDefaultChannels()` once during module initialization (`lines 43-45`), not during a health request.

Privacy exposure is limited to internal runtime identity and boolean feature/capability availability. No secret, credential name/value, customer data, approval data, filesystem path, provider/model inventory, or execution result is returned. No runtime caller of the handler or canonical route was found beyond its Express registration. The handler returns 200 with the health object or 500 with `customer_operations_health_failed` and the current error message. No route-specific cache-control header is installed; Helmet/CORS/compression and normal Express response headers still apply. The route parameter and optional Project fields are syntactically validated but do not establish Project existence, Workspace binding, membership, grant, or permission. Express HEAD fallback and the exact-GET read guard create the common HEAD discrepancy described above.

## Selection decision

`FIRST_SHADOW_SLICE = GET /media-manager/project/:project/customer-operations/health` (canonical exact GET only).

Candidate E is the safest evidence-supported first slice because its per-request path returns a small deterministic health projection without Project/customer/approval/provider/storage reads, query-dependent behavior, environment-key names, model inventory, filesystem paths, command probes, or lazy storage creation. It preserves a useful negative authority comparison: a valid compatibility key and syntactically valid Project slug still cannot establish Principal, membership, grant, Project existence, or Workspace binding. Its public alias and HEAD behavior are explicitly excluded from the observer.

## FUTURE IMPLEMENTATION / DEFERRED / NOT PROVED

- **FUTURE IMPLEMENTATION:** only after separate approval and offline fixtures, attach the observer described in [Selected Shadow Slice Design](SELECTED_SHADOW_SLICE_DESIGN.md).
- **DEFERRED:** public alias, HEAD, approval, telemetry, provider catalog/readiness, mutation, and execution routes.
- **NOT PROVED:** that Candidate E has canonical Project scope, positive grant evidence, explicit cache policy, production-ready observer capacity, or a supported positive authority result.

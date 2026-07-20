# Current Authorization Pipeline Truth

Status: Phase 1B-1C audit of baseline `2dfd40a1d9d6efd481f85e2df66375baa161aebd`. **CURRENT PROVED TRUTH** unless a section is explicitly marked otherwise. This document describes installed production code, not the target authority contracts.

## Scope and method

The scan followed request behavior and capability ownership through `runtime/orchestrator-service/server.js`, its security modules, domain gates, persistence helpers, and Control Center callers. Documentation and historical audits were not treated as runtime proof. The Express application is created by `app = express()` at `server.js:278`, with routes registered in that file. When `server.js` is the direct main module, the inline startup block calls `assertProductionProfileHardening(process.env)` and then `app.listen()` (`server.js:23791-23817`). The module also exports `app` (`server.js:23819-23825`); an importer can therefore use an alternate application entry path, and importing `app` does not automatically execute the direct-main hardening assertion. Runtime evidence does not establish whether every imported-app entry is production-supported.

## Installed request pipeline

| Order | Installed boundary | Exact evidence | Current behavior |
|---:|---|---|---|
| 1 | Environment bootstrap | `server.js:29-84` `applyEnvFile`, `bootstrapEnvironment` | Loads `.env.<NODE_ENV>`, `.env.local`, then `.env` without overwriting existing variables. Load failures are ignored. |
| 2 | Early protected-route middleware | `server.js:289-387`; `lib/security/protected-route-authority.js:55-235` | Selected route patterns require caller-supplied approval/manual/owner/review proof. These middleware registrations precede `express.json()` at line 556, so body proof is not available there; headers and query are. |
| 3 | Public-alias telemetry/classification | `server.js:400-470`, `428`, `491`; `public-alias-compatibility.js:60-143` | Adds deprecation headers. It may block aliases with 403 or 410. Classification exceptions add a warning header and continue: fail-open for this compatibility classifier. |
| 4 | HTTP hardening/static middleware | `server.js:473-491` | Helmet, allowlisted CORS origins/methods/headers, compression. These are transport controls, not permission. |
| 5 | Body parsing | `server.js:556` | JSON body becomes available after early protected-route proof checks. |
| 6 | Protected write-key guard | `server.js:644-739` `isProtectedControlWriteRequest`, `requireProtectedControlWriteKey` | For enumerated POST/PATCH/DELETE patterns, missing server key gives 503, missing caller key 401, mismatch 403, match continues. PUT is not included by this guard even though other classifiers treat PUT as mutation. |
| 7 | Protected read-key guard | `server.js:741-811` `isProtectedControlReadRequest`, `requireProtectedReadKey` | Exact GET requests on selected patterns use the same `MH_CONTROL_CENTER_WRITE_KEY`; missing server key gives 503, missing caller key 401, mismatch 403. A non-production-compatible bypass can continue without authentication and adds `X-MH-Control-Key-Bypass: temporary`. The predicate excludes HEAD, while the installed Express router can dispatch HEAD to a GET route without an explicit HEAD handler; affected routes therefore have a current HEAD/guard discrepancy. |
| 8 | Runtime security enforcement | `runtime-security-enforcement.js:69-180`; mounted `server.js:813-832` | Sensitive mutations are classified. Missing write-key evidence or a failed provider classification returns a normalized 403. Non-sensitive scope continues. |
| 9 | Rate limits | `server.js:834-899` | Telegram and AI routes are keyed by forwarded address/IP/`anonymous`; denial is 429. This is execution safety, not authority. |
| 10 | Handler-local scope, governance, provider, and safety checks | Representative evidence below | Checks are heterogeneous and execute only where explicitly called. |
| 11 | Handler and response | Route registrations throughout `server.js` | Handler reach is collectively determined by all applicable installed middleware, route-parameter validation, key guards, rate limiting, runtime mutation classification, route-local checks, and handler-local gates. No composite effective-permission resolver is currently called. |
| 12 | Logs/domain evidence | `logger.js`, governance and integration modules | Evidence is fragmented; no canonical source-qualified authority-decision record is persisted. |

## Authentication and access-key behavior

**CURRENT PROVED TRUTH**

- The backend accepts either `x-mh-control-key` or `Authorization: Bearer <key>` through `readProvidedControlWriteKey` (`server.js:678-687`). Comparison is length-checked and uses `crypto.timingSafeEqual` (`server.js:689-698`).
- Protected reads and writes both compare against `MH_CONTROL_CENTER_WRITE_KEY` (`server.js:705`, `780`). `MH_CONTROL_CENTER_READ_KEY` is not a separate server-side verification source.
- `isProtectedControlReadRequest` requires method `GET` exactly (`server.js:760-768`). Express 5.2.1/router dispatch semantics map HEAD to a registered GET route when no explicit HEAD route exists (`node_modules/router/lib/route.js:54-68,107-113`). Consequently, HEAD can reach such a handler without this read-key guard. This is installed behavior, not an approved change or a statement that HEAD is authorized by the GET guard.
- On localhost only, `buildControlCenterBootstrapScript` selects `MH_CONTROL_CENTER_READ_KEY`, then `MH_CONTROL_CENTER_WRITE_KEY`, then `MH_CONTROL_KEY`, and injects the value into browser globals (`server.js:14283-14309`). This is compatibility convenience, not independent backend read-key authority.
- Control Center `buildReadHeaders` and `buildWriteHeaders` send the same resolved key in both headers (`public/control-center/api.js:268-300`). Browser globals and local storage are caller-side credential sources (`api.js:64-127`).
- Successful key checks attach `mhAuthorityContext` with a synthetic `legacy-control-center-key` service assertion (`server.js:725-731`, `800-806`; `identity-adapter.js:52-75`). This assertion is created only from an existing guard result and does not prove a durable service Principal.
- No session, user login, human identity provider, JWT validation, or canonical human actor lifecycle was found in the installed request path.

## Route guards and inline authorization

**CURRENT PROVED TRUTH**

1. `createProtectedRouteMiddleware` is installed for selected destructive, provider, AI, workflow, upload, task, campaign, and lifecycle routes (`server.js:289-387`, `502-554`).
2. `protected-route-authority.js:55-86` accepts proof values directly from headers/body/query. Presence of an approval ID is enough for this guard; it does not resolve approval status. Truthy manual, owner-workspace, or review-output values are caller-declared. These signals are **UNSAFE_FOR_AUTHORITY** beyond their current compatibility call sites.
3. `runtime-security-enforcement.js:74-120` combines route catalog classification and provider classification. For provider classification it passes the same write-key boolean as both `configured` and `approved` (`lines 98-102`). This remains an installed bounded guard but is not canonical approval or provider readiness evidence.
4. The route-permission catalog classifies domains, read/write access, scopes, alias status, and risk (`route-permission-catalog.js:154-203`). Its own header says it is non-enforcing (`lines 3-9`); only explicit consumers can enforce its output.
5. Governance handlers call `enforceGovernanceMutationGate` or `enforceGovernanceApprovalLifecycle` (`server.js:15879-15946`). Policy and approvals come from the Operations Backbone. High-risk policy-load failure denies (`governance-mutation-gate.js:583-589`); missing approval lists become empty and therefore do not establish approval (`lines 659-672`).
6. Publishing has additional inline policy/approval checks in `assertPublishingMutationAllowed` (`server.js:15961-16046`). Direct media publish and batch publish handlers are hard-blocked with 403 (`server.js:23988-24017`).
7. Integration actions call governance before `runProjectIntegrationAction` (`server.js:13390-13420`) and provider adapters emit domain audit records (`adapter-manager.js:43-150`).
8. Project isolation validates slugs and path containment (`project-isolation.js:46-108`) and global raw/optional slug middleware is installed at `server.js:1542` and `1575`. This is path safety, not proof that a caller belongs to a Project.

## Roles, admin, Workspace, and Project scope

**CURRENT PROVED TRUTH**

- No backend request-path check binds a human/service/automation Principal to a durable scoped role or direct grant.
- Operations Backbone records contain roles, reviewers, owners, actors, and route-permission projections, but the scan did not prove them as authenticated assignments.
- Control Center role behavior is caller-controlled projection: it defaults to `admin`, reads browser storage/backend projections, and permits switching for internal testing (`public/control-center/app.js:110-186`, `254-274`; `route-role-fallback.js:1-74`). The projection helper explicitly forbids frontend enforcement (`authority-projection.js:1-17`).
- The Workspace runtime owns Workspace lifecycle and Workspace-to-Project relationship records. Its inputs explicitly reject `roles`, `permissions`, and `membership` (`workspace-runtime.js:49-50`). No Principal-to-Workspace membership is proved.
- Project slugs may be taken from body, query, params, detected text, environment default, or first listed Project (`server.js:6376-6404`). This fallback is operational context selection, not membership or authorization.
- Project identity and Workspace relationship runtimes establish resource identity/relationship facts, not caller participation.

## Governance, approval, provider readiness, and execution safety

**CURRENT PROVED TRUTH**

- Governance action rules and policy defaults are centralized in `governance-mutation-gate.js:31-81,478-643`. Approval can be required, requested, found, rejected, or accepted for a specific action. It is a domain gate, not general permission.
- Approval lifecycle issuance persists a redacted payload summary and hash (`governance-mutation-gate.js:215-284,343-411`). The `requested_by`/`actor` values can originate in request bodies (`server.js:15924-15925`), so they are audit labels, not authenticated actor proof.
- `provider-execution-gate.js:34-159` is a classifier. In runtime-security enforcement, write-key presence is reused as configured/approved. Actual native provider readiness is separately derived from environment-key presence (`provider-readiness.js:5-21`), and local rendering readiness probes installed commands (`local-rendering-capabilities.js:3-47`).
- Readiness evaluators such as `evaluateExecutionReadiness` and `evaluatePreparedEmailForSend`, queue controls, rate limits, Project path isolation, direct-publish blocks, and error handling are execution/safety dimensions. None establishes permission.

## Feature flags and environment-dependent security

| Signal | Installed meaning | Failure stance |
|---|---|---|
| `MH_CONTROL_CENTER_DISABLE_ACCESS_KEY=1` | Bypasses selected protected GET checks and adds a response header (`server.js:569-575,775-778`) | Fail-open for those reads outside production; production startup hardening blocks truthy bypass-pattern flags. |
| `NODE_ENV` / `MH_ENV` | Production determination for startup hardening (`server.js:611-637`) | The direct-main startup block throws when production and a recognized bypass is truthy. Importing exported `app` does not itself invoke that assertion. |
| `MH_PUBLIC_ALIAS_COMPATIBILITY` | Defaults true; false retires public aliases (`public-alias-compatibility.js:24-35,78-85`) | Explicit disable blocks. |
| `MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES` | Defaults false (`public-alias-compatibility.js:34-35`) | Critical public mutation aliases remain compatibility-allowed unless other guards deny. |
| `NODE_ENV=production` in alias classifier | Unauthorized public mutations are denied (`public-alias-compatibility.js:88-95`) | Fail-closed for that branch. |
| `MH_DISABLE_READ_TELEMETRY=1` | Disables read-redirection telemetry (`server.js:1803-1806`) | Observability loss only; no authority effect. |

## Existing evidence and denials

**CURRENT PROVED TRUTH**

- Key guards return 503/401/403 with distinct legacy bodies (`server.js:705-723,780-797`).
- Protected-route authority returns 403 or 409 and includes route/category/proof booleans (`protected-route-authority.js:202-225`).
- Runtime security and production public-alias authorization use 403 `{ok:false,error:"forbidden",code:"route_permission_denied",message:"This backend action requires authorization."}` (`runtime-security-enforcement.js:60-67,168-180`; `server.js:453-456`).
- Retired aliases return 410; governance denials return 403 with policy/approval codes; rate limiting returns 429; readiness may return 503; handlers use heterogeneous 400/404/409/500/502 responses.
- Structured logger output redacts sensitive keys and Bearer strings (`logger.js:1-36,53-88`). Runtime-security and governance denials are logged. Integration actions have a bounded Project audit log (`integrations/audit-log.js:4-13`). General `appendAudit` writes `data/audit.json` but swallows write failure after logging (`server.js:6268-6281`).
- `mhAuthorityContext.shadow_observations` is request-local and not consumed or persisted by the installed path (`identity-adapter.js:119-175`; only call sites at `server.js:725-731,800-806,823-828`). It is not shadow comparison telemetry.

## Anonymous, fallback, and caller-side behavior

**CURRENT PROVED TRUTH**

- Routes outside explicit read/write/early/runtime guard coverage may continue anonymously; the route catalog alone does not protect them.
- HEAD requests dispatched by Express to GET handlers are outside the exact-GET read-key predicate unless another installed guard or route-local check applies.
- `/health`, `/healthz`, and `/readyz` are public because read-key patterns exclude them and the route catalog classifies health reads public (`server.js:9913-9932`; `route-permission-catalog.js:109-115,166-168`).
- The read bypass, public compatibility aliases, Project-context fallback, frontend default `admin`, caller-supplied actor/role/proof fields, and runtime key globals are compatibility or experience behavior. None can become future authority.
- Public/static Control Center delivery does not authenticate a Principal. A local request may receive an injected compatibility key.

## NOT PROVED

- Complete protection of every route; universal middleware coverage; a distinct read credential; authenticated human identity; durable service or automation identity; Principal lifecycle; Workspace/Project membership; scoped role or grant assignment; a composite effective-permission resolver; normalized permission outcomes; source-qualified permission evidence; persistent shadow comparison records; a dedicated shadow feature flag or kill switch.

## Design boundary

**DESIGN DECISION:** Current installed guards remain authoritative at every existing call site. The future design in [Selected Shadow Slice Design](SELECTED_SHADOW_SLICE_DESIGN.md) may observe one route only and cannot reinterpret the compatibility service assertion, approval, provider state, Project path, or frontend role as permission.

**FUTURE IMPLEMENTATION:** Requires separate approval.

**DEFERRED:** Universal route coverage remediation, credential redesign, enforcement normalization, Principal/membership/grant persistence, and any current-guard replacement.

# Authority Signal Producer / Consumer Map

Status: Phase 1B-1C design audit. Rows labeled **CURRENT PROVED TRUTH** describe installed behavior at baseline `2dfd40a1d9d6efd481f85e2df66375baa161aebd`.

## Classification rules

`Canonical` means canonical for the signal's present bounded domain, not universal permission. `Compatibility-only` means installed behavior that must not be promoted. `Unsafe as authority` means the value may remain useful operationally but cannot establish future permission.

## Current signal map

| Signal | Producer | Authoritative owner / persistence | Freshness and scope | Consumers / mutation owner | Failure behavior | Trust and future classification |
|---|---|---|---|---|---|---|
| Authenticated actor | No human authenticator proved | None / none | None | Caller body labels, audit/history displays | Missing actor often defaults to `control-center`, `operator`, or `mh-assistant` | **NOT PROVED; ABSENT; unsafe as authority** |
| API/access key acceptance | `requireProtectedControlWriteKey`, `requireProtectedReadKey`; runtime security recomputes match | Exact backend guard / environment `MH_CONTROL_CENTER_WRITE_KEY` | Per request; route-pattern bounded | Guards consume; deployment environment mutates key | 503 unconfigured, 401 missing, 403 mismatch; selected-read bypass can continue | **CURRENT PROVED TRUTH; canonical only for installed credential check; COMPATIBILITY_ONLY for identity/membership** |
| Runtime caller identity | `createLegacyControlKeyAssertion` after successful key guard | Request-local `req.mhAuthorityContext`; no persistence | Per request; synthetic service identity | Runtime-security observer only; no mutation owner | Unauthenticated context has null Principal | **PARTIAL, NON_CANONICAL Principal, compatibility-only** |
| Admin state | Frontend selected/projected role; Operations Backbone labels | Browser/local projection and Project operations data | Client/session or Project snapshot | Router/UI visibility; frontend user mutates selection | Defaults to `admin`; unknown routes often allowed | **UNSAFE_FOR_AUTHORITY; frontend projection only** |
| Role | Team model, task/approval records, route-role fallback | Operations records for business metadata; browser for active role | Record/client dependent; scope not authenticated | UI routing, display, orchestration metadata | Defaults and string labels | **NON_CANONICAL as scoped authority; compatibility/display only** |
| Workspace identity | Workspace runtime/storage | Workspace domain, `data/workspaces` through `workspace-storage.js` | Versioned Workspace record | Workspace runtime and relationship runtime own mutations | Strict validation/recovery errors | **Canonical for Workspace lifecycle; not caller authority** |
| Project identity | Project identity runtime and existing Project records | Project domain / Project profile metadata | Stored identity/revision; Project scope | Project domain owners mutate | Unresolved/invalid/collision errors | **Canonical bounded identity; not membership** |
| Request Project context | Route/body/query/text/env/list fallback through `resolveRequestProjectName` | Request helper; underlying Project stores vary | Per request; may be inferred/defaulted | Many handlers | Missing may throw 400; fallback may silently choose a Project | **COMPATIBILITY_ONLY; unsafe as membership/permission** |
| Workspace-to-Project relationship | Workspace relationship runtime | Workspace domain / Workspace record `project_relationships` | Versioned relationship lifecycle | Workspace relationship runtime mutates; Workspace/Project consumers read | Invalid/recovery/conflict fails | **Canonical for resource relationship only** |
| Workspace membership | No producer proved | None | None | None | Missing | **ABSENT; BLOCKED_PENDING_SOURCE_OF_TRUTH** |
| Project membership | No producer proved | None | None | None | Missing | **ABSENT; BLOCKED_PENDING_SOURCE_OF_TRUTH** |
| Direct grants | No authoritative assignment producer proved | None | None | None | Missing | **ABSENT; BLOCKED_PENDING_SOURCE_OF_TRUTH** |
| Inherited grants | No authoritative inheritance producer proved | None | None | None | Missing | **ABSENT; DEFERRED; inheritance forbidden by default** |
| Route-required scope | `classifyRoute` | Route catalog source code; no assignment store | Recomputed per request path/method | Runtime security consumes classification | Unknown routes get `general.read/write` | **Canonical only as classifier at consuming call sites; not proof of grant** |
| Early approval/manual/owner/review proof | `readProof` from caller header/body/query | Caller input; no validation store in this helper | Request-local | Protected-route middleware | Missing denies selected paths; present strings can satisfy guard | **CURRENT installed compatibility signal; UNSAFE_FOR_AUTHORITY** |
| Governance policy | Operations Backbone `getGovernancePolicy` | Project governance data / Operations Backbone mutation APIs | Read per decision; Project scope | Governance gate and publishing checks; `updateGovernancePolicy` mutates | High-risk policy load failure denies; normalized defaults otherwise | **Canonical for bounded governance policy, not permission** |
| Approval evidence | Operations Backbone approvals; governance lifecycle | Project approval records / Operations Backbone | Read per gate, latest/matched record; Project/action/entity scope | Governance gates; approval lifecycle/decision owners mutate | Missing/rejected/pending denies applicable action | **Canonical bounded approval evidence; never permission** |
| Provider readiness | Native provider readiness and integration adapters | Environment/provider/domain owner; integration records | Evaluated per request/action; provider-specific | Readiness views and execution handlers; provider owner mutates config | Missing credentials/not ready or adapter errors | **Canonical bounded provider state where exact producer is used; never permission** |
| Provider classification | `classifyProviderAction` | Source-code catalog; none | Recomputed; action string scope | Runtime security | Unknown action gets general dry-run classification | **PARTIAL classifier; runtime use conflates key with configured/approved; unsafe as universal authority** |
| Execution readiness | Readiness evaluators, queues, direct-publish blocks, rate limiters, Project isolation | Federated domain/runtime owners | Per evaluation; action/resource-specific | Execution handlers | Heterogeneous block/error responses | **Canonical only for bounded safety owner; never permission** |
| Feature flags | Environment readers at startup/request time | Deployment environment | Startup-captured for read bypass; request-time for aliases | Server middleware | Defaults vary: alias compatibility true, critical alias block false | **Canonical configuration for exact behavior; unsafe as authority evidence** |
| Environment state | `process.env`, bootstrapped env files | Deployment/process environment | Process lifetime or request-time read | Key guards, providers, hardening, paths | Env bootstrap errors ignored; production bypass flags block startup | **Trusted configuration input within bounded owners; secrets forbidden from evidence** |
| Runtime security decision | `classifyRuntimeSecurityDecision` | Middleware call site; request-local/log only | Per request | Middleware enforces and optional observer sees | Non-sensitive continues; denial 403 | **CURRENT authoritative at call site; no canonical permission envelope** |
| Governance decision | Governance gate | Request-local plus warning logs/approval records | Per action | Handler wrapper enforces | Denial 403 | **CURRENT authoritative at call site; policy dimension only** |
| Audit evidence | Structured logger, general audit JSON, Operations history, integration audit, telemetry | Multiple bounded owners/stores/stdout | Event-time; retention varies or unproved | Operators/domain consumers | Some write failures logged/swallowed | **DUPLICATED and NON_CANONICAL for permission; bounded records may remain authoritative for their events** |
| Frontend route access | Authority projection and fallback role matrix | Browser/UI code | Client state | Router and UI only | Default admin; unknown routes allowed | **Projection only; UNSAFE_FOR_AUTHORITY** |

## Producer and mutation boundaries

**CURRENT PROVED TRUTH:** The backend guard that accepts a key owns only that acceptance. Workspace storage owns Workspace lifecycle. Project owners own Project identity/business data. Workspace relationship runtime owns Workspace-to-Project relationships. Operations Backbone owns governance and approvals. Provider/execution components own their readiness and safety facts. None currently owns a composed permission.

**DESIGN DECISION:** Future adapters are read-only consumers of these bounded sources. They may emit `AuthorityEvidenceReference` objects but cannot mutate source state or relabel compatibility values as canonical facts. Only future separately approved Principal, membership, and grant owners may create those evidence families.

## Collision and unsafe-promotion register

| Collision | Required interpretation |
|---|---|
| Valid key vs Principal | Key acceptance may support authentication compatibility; it does not prove a durable Principal. |
| Access key vs membership | Never equivalent. |
| Workspace-to-Project relationship vs membership | Resource relationship does not bind any Principal. |
| Project slug/path vs scope authorization | Context and containment do not prove participation. |
| Approval ID/policy result vs permission | Approval is a policy input only. Caller-declared approval proof is not canonical approval evidence. |
| Provider configured/ready vs permission | Readiness does not authorize the caller. |
| Frontend `admin` or route visibility vs backend authority | Projection only. |
| Role labels vs grants | Labels do not establish versioned scoped assignments. |
| Runtime route scope vs effective grant | Required scope classification is not evidence that a subject holds it. |

## FUTURE IMPLEMENTATION

Source adapters, persistence choices, freshness limits, revocation propagation, restricted comparison storage, and reviewer access require separate approval and must conform to [Authority Interface Design](AUTHORITY_INTERFACE_DESIGN.md) and [Shadow Observation and Safety Design](SHADOW_OBSERVATION_AND_SAFETY_DESIGN.md).

## DEFERRED / NOT PROVED

- **DEFERRED:** exact durable Principal, membership, and grant stores; explicit deny and inheritance policy; audit retention authority.
- **NOT PROVED:** complete audit retention, authenticated audit actor, universal correlation IDs, or an installed consumer of request-local shadow observations.

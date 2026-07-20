# Future Targeted Test Matrix

Status: Phase 1B-1C **FUTURE IMPLEMENTATION** test design only. No tests were added. All live cases target only canonical exact `GET /media-manager/project/:project/customer-operations/health` unless explicitly marked offline.

**CURRENT PROVED TRUTH:** The selected route, current read guard, handler, and response behavior exist; the shadow components and these tests do not. **DESIGN DECISION:** The matrix below is the minimum future validation boundary and does not authorize test or runtime creation.

## Test oracle

The primary invariant is differential: with identical current inputs and domain state, shadow off versus on must produce the same HTTP status, headers, response bytes/JSON semantics, handler count, health calls, source writes, and current logs except separately approved non-disclosing observer telemetry. Current guard behavior remains authoritative.

## Matrix

| ID | Required case | Setup / stimulus | Expected shadow result | Required live assertion |
|---|---|---|---|---|
| T01 | Current guard unchanged | Missing server key, missing caller key, invalid key, valid key | No resolver on denial; valid-key request may be sampled | Exact existing 503/401/403/continue behavior and bodies |
| T02 | Shadow disabled | Valid current key; exact route; `ShadowFeatureFlag.state=DISABLED` | No snapshot, evaluation, comparison, or shadow evidence record | Baseline latency budget, status, headers, response, handler count, health call, and execution are unchanged |
| T03 | Shadow enabled | Valid current key; exact route; `ShadowFeatureFlag.state=ENABLED`; kill switch and sampling admit work | One bounded observation-only evaluation and comparison | Current guard remains authoritative; response/status/headers/handler count/execution match T02 except separately approved non-disclosing telemetry |
| T04 | Resolver timeout | Resolver exceeds deadline | `SHADOW_UNAVAILABLE`, reason `RESOLVER_TIMEOUT`; circuit metric | Response does not wait beyond approved snapshot budget and is unchanged |
| T05 | Resolver exception | Resolver throws | Caught; safe unavailable record/metric without stack | No throw into request; unchanged response |
| T06 | Malformed decision | Missing field, unknown outcome/code/version | Reject as `MALFORMED`; threshold may open breaker | No use as permission; unchanged response |
| T07 | Insufficient context | Compatibility key assertion but no canonical Principal/membership/grant | `INSUFFICIENT_CONTEXT` with exact missing-source codes | Handler still executes after current guard |
| T08 | Deny mismatch | Offline/qualified source says revoked membership while current guard continues | `SHADOW_STRICTER` | Current request still continues in shadow |
| T09 | Allow mismatch | Offline current-deny fixture with fabricated/qualified shadow allow | `SHADOW_MORE_PERMISSIVE`, blocking finding | Shadow cannot override denial; no handler execution |
| T10 | Unsupported action | Wrong action or neighboring route contract | `UNSUPPORTED_ACTION` / no live attachment | Neighboring route receives no observer behavior |
| T11 | Requires approval | Policy marks exact action approval-required without valid evidence | `REQUIRES_APPROVAL` | Current read behavior unchanged; approval not created |
| T12 | Stale evidence | Membership/grant past freshness bound | `INSUFFICIENT_CONTEXT`/`EVIDENCE_STALE` | No positive agreement; unchanged response |
| T13 | Revoked evidence | Revocation established before evaluation | `DENY` with source reference | No source mutation; current result unchanged |
| T14 | Cross-Workspace scope | Principal/member evidence belongs to another Workspace | `DENY` or `INSUFFICIENT_CONTEXT` per source fact | No evidence leakage; current result unchanged |
| T15 | Cross-Project scope | Grant/membership belongs to sibling Project | `DENY`; never inherited implicitly | No sibling identifier in response/record |
| T16 | Redaction | Inject secret-looking fields into rejected adapter input and source errors | Fields absent; redaction version recorded | No secret in logs, comparison, metrics, or response |
| T17 | Correlation | Two requests, duplicate delivery, spoofed caller correlation | Backend IDs distinct; duplicate converges; caller ID non-authoritative | No response correlation disclosure unless already current behavior (none expected) |
| T18 | No response mutation | Capture byte/semantic body off/on across success and handler 500 | Comparison independent | Bodies identical |
| T19 | No status mutation | Off/on for guard and handler outcome matrix | Observer cannot supply status | Statuses identical |
| T20 | No execution mutation | Instrument handler/health/source writes | One handler/health call; zero observer source writes | Counts identical off/on |
| T21 | Kill switch | Disable while load/in-flight work exists | New work stops; in-flight dropped/finishes bounded | Current requests continue; no route/config change |
| T22 | Rollback | Enable, collect approved fixture evidence, disable | Counts stop; retained records unchanged | Baseline current behavior restored without gate changes |
| T23 | Concurrency | Parallel requests plus evidence revision/revocation race | Positive decision invalidated; records isolated | No shared context, response mix-up, or source lock |
| T24 | Duplicate evaluation | Deliver same snapshot twice | One logical record via dedup key | No duplicate source calls beyond allowed pure reads; live path once |
| T25 | Idempotent evidence recording | Repeat identical comparison write | Same result/no duplicate; conflicting payload rejected | No source mutation and no response effect |
| T26 | Queue full | Exceed bounded observer queue | Work dropped, breaker/metric | All current requests follow baseline |
| T27 | Sink unavailable | Refuse writes/time out | Drop and safe health signal | No retry storm or request delay |
| T28 | Feature config malformed/expired | Invalid version, unknown route, expired flag | Fail disabled | Baseline response |
| T29 | Kill-switch source unavailable | Control cannot be read | Fail disabled | Baseline response |
| T30 | Alias exclusion | Call `/public/media-manager/project/:project/customer-operations/health` | No selected-slice evaluation | Existing alias headers/guard behavior unchanged |
| T31 | Method/neighbor exclusion | POST or customer-operations readiness/data route | No selected-slice evaluation | Existing route behavior unchanged |
| T32 | Bypass path | Existing read bypass active in allowed non-production fixture | No positive identity inference; preferably no evaluation due absent current auth evidence | Existing bypass header/status/body unchanged |
| T33 | Approval is not permission | Valid approval evidence but missing membership/grant | Non-allow | No approval mutation; current response unchanged |
| T34 | Provider readiness is not permission | Provider configured/ready but missing membership/grant | Non-allow | No provider call/config mutation |
| T35 | Access key is not membership | Valid current key only | `INSUFFICIENT_CONTEXT` | Current guard continues exactly as today |
| T36 | Frontend role is not authority | Spoof `admin`/role labels in any rejected input | Ignored/rejected; non-allow | Backend response unchanged |
| T37 | Not-applicable provenance | Caller declares membership/grant not applicable | Reject declaration; non-allow | No response mutation |
| T38 | Reason-code integrity | Outcome/code mismatch or dynamic code | Malformed; circuit accounting | No disclosure or live effect |
| T39 | Performance | Compare statistically meaningful off/on load | Within separately approved snapshot and aggregate budgets | No material latency/error regression |
| T40 | Retention/access | Unauthorized read, expiry, approved deletion, audit access | Access denied; policy enforced; access audited | No impact on source/live request |
| T41 | Invalid Project segment | Exact GET with invalid, encoded-invalid, and traversal-like Project path segments | No shadow snapshot/evaluation because route validation does not reach the selected handler path | Existing 400 status/body/headers exactly preserved |
| T42 | Nonexistent Project semantics | Exact GET with a syntactically valid slug that has no Project record | Non-allow because the slug is context only; never membership, grant, or permission | Existing health 200 remains unchanged; no Project record is created or read |
| T43 | HEAD discrepancy | HEAD on canonical selected path with missing, invalid, and valid key | No observer evaluation because allowlist is exact GET; record no claim that the GET guard authorized HEAD | Preserve installed HEAD dispatch, guard discrepancy, status, headers, body suppression, and handler count exactly |
| T44A | Non-Project query isolation | Exact GET with no query, unrelated scalar/unknown key, and unrelated repeated or multi-valued keys | Snapshot excludes raw query; no query-derived authority evidence | Current response status/body/headers, handler count, health call, and execution match the corresponding no-query baseline |
| T44B | `query.project` scalar validation | Exact GET with `query.project` absent; valid lowercase; valid mixed-case/whitespace requiring normalized validation; empty; invalid slug; encoded-invalid; traversal-like value | No raw query capture. Absent value skips optional-field validation; a valid scalar passes normalized validation but creates no authority; rejected value produces no shadow observation | Valid/absent cases reach the handler with existing 200 behavior; invalid/empty/encoded/traversal-like cases preserve existing 400 status/body/headers and do not reach the handler; verify Express's reparsing query getter does not turn the assignment into a durable normalized field |
| T44C | `query.project` repeated/multi-value validation | Exact GET with one scalar parameter, repeated parameters that the simple parser exposes as an array, and bracket-shaped keys such as `project[x]` | No raw query capture. Scalar follows T44B; repeated Project values stringify with commas and fail validation; bracket-shaped keys remain unrelated literal keys and create no authority | Repeated Project values preserve existing 400 and zero handler calls; bracket-shaped unrelated keys leave status/body/headers/handler count/execution equal to the non-Project-query baseline |
| T44D | Body `project` validation on GET | Exact GET with JSON content type and body `project` absent; valid scalar/mixed-case; empty/invalid/encoded/traversal-like; single-element array; multi-element array; object-shaped value | No body capture. Valid string-coercible value is normalized upstream but remains non-authoritative; rejected values produce no shadow observation | Absent/valid/single-valid-element cases reach the handler with existing 200 behavior; rejected cases preserve existing 400 status/body/headers and zero handler calls |
| T45 | Health metadata and cache/header equivalence | Compare shadow off/on while instrumenting snapshot, sink, response headers, and health payload | No runtime/status/capability payload field enters snapshot, comparison, log, or metric | Exact response bytes/JSON semantics and all cache, Helmet, CORS, compression, and Express headers are identical |

## Test layers and sequence

1. Pure schema/reason/outcome fixtures.
2. Resolver fixtures with fake read-only evidence sources.
3. Comparator/idempotency/redaction fixtures.
4. Feature flag, kill switch, circuit breaker, queue, and sink failure tests.
5. Isolated route differential tests with the current guard and handler.
6. Concurrency/load and hostile input tests.
7. Only after all prior gates and separate approval: bounded passive-environment validation.

No layer may require creating real Principal, membership, grant, approval, provider execution, or production source mutation.

## Exit criteria for a future implementation phase

- all T01-T45 pass;
- current response/status/header/body and execution equivalence is proved;
- secret/redaction scan passes;
- zero write-capable source dependency is present;
- malformed/timeout/overload/sink failures remain isolated;
- kill switch and rollback are proved;
- cross-scope and stale/revoked cases never allow;
- security and privacy owners approve sink/access/retention;
- success stops at shadow qualification and does not authorize enforcement.

## DEFERRED / NOT PROVED

- **DEFERRED:** test framework/file locations, exact fixtures, numeric thresholds, CI wiring, production canary, and enforcement tests.
- **NOT PROVED:** current test suite covers these cases or a future observer implementation exists.

# Shadow Observation and Safety Design

Status: Phase 1B-1C **DESIGN DECISION** only. It refines the certified [Shadow Adoption and Rollback Plan](../authority/SHADOW_ADOPTION_AND_ROLLBACK_PLAN.md) for the one selected route. Runtime work and live data collection remain unapproved.

## Non-negotiable model

```text
Current Guard Decision -> authoritative and unchanged
Future Resolver Decision -> observation only
Comparison -> restricted evidence only
Response -> unchanged
```

The observer can never authorize a current denial, deny a current continuation, call the handler, skip the handler, mutate source data, expose evidence, create Principal/membership/grant state, convert approval/readiness into permission, or treat missing context as `ALLOW`.

## Invocation and ordering

**CURRENT PROVED TRUTH:** `requireProtectedReadKey` is mounted globally before route handlers. For the selected canonical exact GET it is the current authority boundary. Successful key matching attaches a compatibility context; bypass may continue without it. Express may dispatch HEAD to the same registered GET handler, while the read-key predicate accepts only exact GET; HEAD is therefore a current guard discrepancy and is outside the selected observer.

**DESIGN DECISION:** A future exact-call-site adapter runs after the current read guard has returned `next()` and only for exact `GET` plus the canonical route contract. HEAD, aliases, and neighboring routes are excluded unless separately designed and approved. It snapshots allowlisted metadata. The handler path does not wait for resolver completion. On current 503/401/403 or invalid-Project 400, no resolver evaluation occurs; optional aggregate counts must not include key/request data.

Before/after rules:

1. Read current kill switch and feature flag; any uncertainty exits without observation.
2. Verify exact route contract and deterministic sample admission.
3. Build/redact/validate the context before handoff.
4. Hand off to a bounded isolation boundary; queue-full drops observation.
5. Current handler proceeds independently.
6. Resolver evaluates read-only evidence under its own deadline.
7. Comparator records minimal result if the sink is healthy and approved.
8. No callback has access to `res`, `next`, handler return data, or write-capable source clients.

## Failure containment

| Condition | Shadow behavior | Live behavior |
|---|---|---|
| Flag disabled, kill switch disabled state, or config uncertain | Do not snapshot/evaluate/write | Unchanged |
| Context malformed/redaction failure | Drop; safe health counter; automatically disable on any suspected leakage | Unchanged |
| Queue full/overload | Drop newest shadow work; count in bounded aggregate | Unchanged |
| Resolver timeout | Cancel/abandon observer work; classify `SHADOW_UNAVAILABLE/RESOLVER_TIMEOUT` if safe | Unchanged |
| Resolver exception | Catch at isolation boundary; no stack in comparison | Unchanged |
| Malformed/unknown decision or reason code | Reject result, classify malformed, trip threshold | Unchanged |
| Evidence source unavailable | Well-formed `INSUFFICIENT_CONTEXT` when established by resolver; transport failure is observer unavailable | Unchanged |
| Evidence stale/revoked/concurrent | Non-allow decision or `STALE_OR_CONCURRENT`; never positive agreement | Unchanged |
| Comparison sink unavailable | Drop comparison, safe health counter, circuit breaker | Unchanged |
| Observer attempts mutation | Block by capability design; immediate kill switch and security incident | Unchanged |

No observer error may be thrown, returned, logged with request secrets, or translated into an HTTP response.

## Redaction and non-disclosure

The adapter is allowlist-based, not denylist-based. It excludes raw HTTP objects, headers, Authorization, cookies, key values/hashes, IP/user-agent, query/body, response/handler payload, runtime health/capability contents, environment/provider fields, frontend state, and personal data. Project scope should use an approved opaque authoritative ID in persisted comparison; a route slug may exist transiently only to resolve that reference and must not be retained unless explicitly approved.

Comparison results are not response headers, body fields, status reasons, frontend state, public logs, analytics events, or support diagnostics. Only authorized security reviewers and aggregate operational metrics may consume them. Aggregate metrics must avoid high-cardinality subject/scope labels.

## Retention and access

**BLOCKED_PENDING_SOURCE_OF_TRUTH:** No current restricted comparison sink, retention owner, or reviewer authorization source is proved. Passive recording cannot begin until a separate data-protection/security decision defines:

- sink owner and write-only observer credential;
- read roles and break-glass audit access;
- purpose, region, retention duration, legal basis where applicable, and recoverable deletion flow;
- immutable/idempotent append semantics;
- access audit and incident response;
- aggregate/de-identified long-term metrics policy.

The minimal default proposal is short-lived restricted raw comparisons followed by aggregate mismatch counts, but no duration is approved here. Rollback never deletes evidence; disposal follows the approved retention owner.

## Sampling and correlation

- Feature flag default: disabled.
- Initial future passive sample: start at the smallest non-zero basis-point rate approved after offline tests; no numeric production rate is approved here.
- Sampling: deterministic hash of random `correlation_id` plus flag revision; never of key, Principal, Project name, or IP.
- Correlation ID: backend-generated opaque UUID/128-bit equivalent; unique per current request evaluation; not accepted from the caller as authoritative.
- Comparison ID: deterministic from contract version, call-site ID, correlation ID, and evaluation ordinal.
- Duplicate-evaluation ordinal defaults zero; retries reuse the deduplication key and do not duplicate records.

## Reason-code comparison and mismatch categories

| Category | Current class | Shadow state | Security interpretation |
|---|---|---|---|
| `AGREEMENT_ALLOW` | `CURRENT_ALLOW_TO_HANDLER` | `ALLOW` | Evidence quality must still be reviewed; never changes current behavior. |
| `SHADOW_STRICTER` | current continue | `DENY` or `REQUIRES_APPROVAL` | Potential missing live control; review only. |
| `SHADOW_INSUFFICIENT` | current continue | `INSUFFICIENT_CONTEXT` | Expected until canonical sources exist; cannot count as agreement. |
| `SHADOW_UNSUPPORTED` | current continue | `UNSUPPORTED_ACTION` | Route contract/resolver coverage gap. |
| `SHADOW_MORE_PERMISSIVE` | current deny | `ALLOW` | Blocking safety finding. Selected live slice does not evaluate deny paths, but offline tests require it. |
| `REASON_DIVERGENCE` | comparable outcome | materially different source-qualified reason | Review source semantics. |
| `UNCOMPARABLE` | any | semantically different domain outcome | Preserve explicitly; do not force agreement. |
| `SHADOW_UNAVAILABLE` | any | timeout/exception/sink/config/circuit | Observer health, not permission. |
| `MALFORMED` | any | invalid schema/version/code | Disable at threshold; never infer result. |
| `STALE_OR_CONCURRENT` | any | evidence changed/expired during evaluation | No positive qualification. |

## Concurrency and idempotency

The input snapshot pins source revisions where available. A revocation or revision change racing with evaluation invalidates positive inference. The resolver is pure/read-only and cannot lock or update source records. The queue is bounded and may drop work. One current request may create at most one logical comparison per call-site/version; duplicate delivery converges using the deduplication key. Sink conflicts with different payloads are incidents, not last-write-wins updates.

## Performance budget

No production numbers are approved. A future review must set and test:

- snapshot construction hard ceiling measured before handoff;
- zero synchronous source I/O in the request adapter;
- bounded queue depth and memory;
- resolver deadline shorter than worker capacity limit;
- p50/p95/p99 observer and request-path deltas;
- drop/error/timeout thresholds;
- source-owner query/load ceilings.

Any inability to demonstrate statistically insignificant current-path status/body/header/latency impact keeps the observer disabled. Observer work is lower priority than current traffic.

## Circuit breaker, feature flag, and kill switch

Three layers are independent:

1. `ShadowFeatureFlag`: default disabled, exact route allowlist, deterministic sampling.
2. `ShadowKillSwitch`: disabled wins; unknown state is disabled; only audited authorized operators may re-enable.
3. Automatic circuit breaker: opens and suppresses new work on timeout/error/load/queue/malformed/redaction/sink thresholds.

Immediate automatic disable triggers include suspected evidence leakage, mutation attempt, configuration uncertainty, source load risk, malformed output burst, sink integrity conflict, or request-path latency breach. Opening does not touch current gates.

## Rollback

1. Set kill switch to disabled or allow the circuit breaker to open.
2. Confirm new evaluation and comparison counts stop.
3. Allow/drop in-flight observer work; do not interrupt current requests.
4. Verify selected route responses/statuses/headers/handler executions match the pre-observer baseline.
5. Preserve existing comparison records under retention policy.
6. Emit a safe control event with configuration revision and reason only.
7. Diagnose offline. Re-enable requires a new audited revision and approval; no automatic re-enable.

Rollback changes no key, route, middleware, handler, source state, membership, grant, policy, provider, or execution setting.

## FUTURE IMPLEMENTATION / DEFERRED / NOT PROVED

- **FUTURE IMPLEMENTATION:** offline fixtures, isolated adapter/resolver/comparator/control/sink under separate approval.
- **DEFERRED:** numeric budgets, sampling rate, retention duration, sink technology, and reviewer identities.
- **NOT PROVED:** safe production queue, storage, access controls, data-protection approval, performance headroom, or positive authority sources.

# Shadow Adoption and Rollback Plan

Status: Phase 1B-1B design only; no runtime implementation or adoption is approved.

## Purpose and non-goals

This plan defines a possible future observation-only path for the contracts in this directory. Initial adoption must be shadow-only and preserve current requests, responses, decisions, mutations, timing expectations, routes, middleware, frontend behavior, and source ownership.

It does not authorize code, configuration, database, route, test, deployment, or production changes. It does not approve an enforcement cutover. Rollback means disabling future shadow observation; it never means weakening or changing existing enforcement.

## Ownership and safety invariants

Current protected-key checks, route guards, runtime-security enforcement, governance mutation gates, provider execution gates, handler-local checks, Project isolation safeguards, and protected domain handlers remain authoritative at their exact call sites.

A future shadow adapter may observe bounded redacted evidence and emit comparison records. It must not:

- allow, deny, delay, retry, reroute, or mutate a request;
- change response status, headers, body, ordering, or documented behavior;
- catch or replace a current gate error with a shadow outcome;
- write Principal, membership, grant, governance, provider, Project, or Workspace state;
- expose shadow outcomes as authoritative frontend state;
- treat missing context as permission;
- include credentials, secrets, tokens, raw request bodies, or unrestricted domain payloads.

## Proposed phases and gates

### Phase 0 — Design review

Human review confirms all eight contracts, source ownership, collision analysis, privacy model, threat model, exact future file/runtime scope, and explicit implementation approval. Exit requires no unresolved critical duplicate-authority or data-exposure risk.

### Phase 1 — Offline fixtures only

Evaluate versioned synthetic/redacted fixtures without live request integration. Validate all decision outcomes, precedence, scope isolation, evidence binding, redaction, idempotency, and source failure behavior. No production data or runtime response is used or changed.

### Phase 2 — Passive shadow observation

Under separate approval, attach a bounded, fail-silent observer at explicitly reviewed call sites. The current path completes independently. The observer receives only an allowlisted evidence projection and writes only bounded shadow comparison evidence to a separately approved sink.

Shadow unavailability, timeout, malformed input, or storage failure is recorded through safe metrics where possible and never changes the current result. The observer has no mutation credentials or source-owner write interfaces.

### Phase 3 — Comparison and review

Compare the normalized shadow outcome with the current live outcome and exact gate/source provenance. Classify agreement, stricter shadow, more-permissive shadow, insufficient context, unsupported action, source error, and uncomparable semantics. A more-permissive shadow result is a blocking safety finding, never a reason to widen access.

### Phase 4 — Coverage and stability qualification

Require a separately approved observation period and thresholds for source coverage, error rate, latency isolation, redaction, decision stability, revocation freshness, cross-scope safety, and explanation quality. Thresholds and results require human security review.

### Phase 5 — Stop for separate enforcement decision

Shadow qualification does not authorize enforcement. Any canary, dual enforcement, route migration, response normalization, or current-gate retirement requires a new phase, contract, threat model, compatibility plan, targeted tests, rollback proof, and explicit approval. This plan stops before that work.

## Comparison record

Required fields are `comparison_id`, `contract_version`, `call_site_id`, `observed_at`, redacted request correlation, current outcome class and source references, shadow outcome and reason codes, scope fingerprint safe for correlation, evidence-source versions/dispositions, mismatch class, observer health, and retention/redaction class.

The record must say `shadow=true`, `enforcement_effect=NONE`, and `current_result_changed=false`. It references evidence rather than copying secrets or payloads. Frontend consumers are prohibited during initial adoption.

## Rollback and kill-switch requirements

A future shadow observer must have one bounded, backend-owned enablement control that defaults disabled and is independent of every current gate. Disabling it must:

1. stop new shadow evaluation and comparison emission;
2. require no modification to existing enforcement, routes, handlers, membership, grants, governance, provider, or resource state;
3. leave in-flight current requests governed only by their existing paths;
4. preserve already-written audit evidence under its retention policy;
5. produce a safe operational event without exposing request data.

Automatic shadow disablement should occur on latency isolation breach, error-rate breach, evidence leakage/redaction failure, unexpected mutation attempt, source-owner load risk, malformed output, or configuration uncertainty. Rollback success is proved when current behavior remains unchanged with shadow disabled.

No rollback procedure may delete or rewrite source-domain records. Comparison evidence disposal follows separately approved retention and recoverable deletion controls; it is not part of request-path rollback.

## Missing context, failures, and denial semantics

The shadow resolver follows [Permission Decision Semantics](PERMISSION_DECISION_SEMANTICS.md). Missing or invalid context produces a non-allow shadow outcome. Observer failure is `shadow unavailable`, not a permission result. Neither condition changes the live request.

Shadow and current outcomes may be semantically uncomparable because current guards are call-site-specific. Such cases remain explicit and cannot be counted as agreement. Current denial always remains denied; shadow allow cannot override it. Current allow remains current behavior during shadow even if shadow denies, while the mismatch is reviewed as a potential future safety gap.

## Idempotency and concurrency

Observation is side-effect free and uses deterministic comparison IDs or deduplication keys per call-site evaluation. Duplicate delivery must not duplicate source mutations because no mutation interface is available. Concurrent source changes are recorded as stale/uncertain and cannot yield a positive shadow conclusion. Observation queues, if later approved, are bounded and may drop shadow work without affecting live traffic.

## Privacy, audit, retention, and access

Collection is allowlist-based, purpose-limited, minimized, redacted before persistence, provenance-aware, and separated by access class. Raw credentials, secrets, tokens, cookies, authorization headers, raw approval artifacts, unrestricted bodies, provider secrets, and unnecessary personal data are forbidden.

Audit covers observer enable/disable changes, version/configuration, evaluated and dropped counts, source errors, redaction failures, mismatch classes, access to restricted comparison evidence, rollback triggers, and rollback verification. Retention periods and deletion authority must be approved before passive observation.

## Validation requirements

Before any future passive attachment, validation must prove:

- observer disabled by default and single-control rollback;
- no response/status/header/body or source mutation difference with observer on versus off;
- no write capability to source owners;
- all five normalized outcomes and precedence rules;
- timeout, crash, malformed evidence, unavailable sink, and overload isolation;
- stale/revoked/concurrent evidence behavior;
- Workspace and Project cross-scope isolation;
- no key-to-membership, label-to-grant, approval-to-permission, or frontend-to-authority promotion;
- secret scanning, redaction, restricted access, retention, and audit correlation;
- exact call-site inventory and proof that existing guards remain installed and authoritative.

## Compatibility constraints

No current compatibility alias, access-key flow, proof flag, denial shape, route catalog, frontend role fallback, Workspace schema, Project projection, or provider/governance behavior changes during shadow adoption. Shadow schemas are versioned and additive to their isolated evidence sink only. Consumers must tolerate shadow absence.

## Deferred implementation questions

- Which explicitly approved call sites and evidence projections are safe for first observation?
- Where can comparison evidence be retained without creating a duplicate authority store?
- What latency/error budgets and qualification thresholds apply?
- Who can enable/disable the observer and review restricted mismatches?
- How are current heterogeneous results normalized without losing their exact provenance?

## Prohibited interpretations

This plan does not approve runtime work, passive production collection, canary enforcement, dual authorization, current-gate retirement, response changes, database creation, frontend permission logic, or automatic migration. Shadow success is evidence for review only.

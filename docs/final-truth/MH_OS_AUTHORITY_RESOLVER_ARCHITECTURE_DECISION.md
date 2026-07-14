# MH-OS Authority Resolver Architecture Decision

## Status

BE-6.5 proposed architecture decision.

Decision: **SHADOW ONLY**.

No runtime implementation or enforcement migration is approved by this document.

---

# 1. Decision Context Audit

Completed architecture now defines identity, workspace, membership, scope, capability, permission, policy, and evidence boundaries.

Current runtime truth remains:

- backend security gates control requests;
- `req.mhAuthorityContext` is passive and incomplete by design;
- runtime security has one failure-isolated observer;
- protected-route and governance decisions do not yet share complete observation wiring;
- no future permission or Authority Resolver runtime exists;
- current route/provider classifications do not establish workspace membership or permission grants.

---

# 2. Options Reviewed

## 2.1 Shadow only

Define the adapter and comparison contracts, preserve all current gates, and produce no runtime behavior change.

Benefits:

- preserves backend authority;
- permits evidence-led migration;
- contains incomplete future context as `UNTRUSTED`;
- introduces no permission runtime or RBAC;
- creates no governance or provider bypass path.

Cost:

- trusted request-level parity cannot be measured until later passive observation is approved and implemented.

## 2.2 Limited adapter integration

Add failure-isolated observers after current decisions and record bounded shadow comparisons.

Potential benefit:

- produces real parity and conflict evidence.

Current blockers:

- no future resolver decision producer exists;
- protected-route and governance observation is incomplete;
- context correlation and versioning are not implemented;
- runtime validation tests for adapter isolation do not yet exist;
- runtime modification has not been explicitly approved.

Disposition: deferred as the next candidate phase after architecture approval.

## 2.3 Future runtime migration

Permit a validated Authority Resolver to participate in enforcement or replace current authority paths.

Current blockers:

- no permission runtime exists;
- no production shadow evidence exists;
- no parity thresholds or rollback evidence exist;
- workspace and membership runtime authority are not implemented;
- migration would risk governance, provider, and project-boundary regression.

Disposition: rejected for BE-6 and deferred to a separately governed future migration decision.

---

# 3. Decision

Adopt **Shadow only** for BE-6.

This decision means:

- the Authority Resolver Adapter is a contract and comparison boundary only;
- current runtime decisions remain authoritative;
- future resolver decisions, when available, are observations only;
- `MATCH`, `PARTIAL`, `CONFLICTING`, and `UNTRUSTED` are telemetry states only;
- no adapter output may authorize, deny, execute, call middleware continuation, or write a response;
- governance, provider gates, protected routes, route security, authentication, and project isolation remain unchanged;
- frontend remains projection only;
- no RBAC or permission runtime is introduced.

---

# 4. Consequences

## 4.1 Positive consequences

- Existing security authority cannot be displaced accidentally.
- Missing future context is visible rather than inferred.
- Allow-expansion conflicts can be classified without granting access.
- Source-specific evidence and decision semantics remain auditable.
- Limited observer integration can later be reviewed as a small reversible change.

## 4.2 Accepted limitations

- BE-6 does not produce runtime comparisons yet.
- Current shared observations remain incomplete.
- `UNTRUSTED` will be the correct result until both sides and applicable source coverage exist.
- No user, role, membership, capability, or permission behavior changes.

---

# 5. Future Limited Integration Entry Criteria

A later proposal may request limited adapter integration only after:

- BE-6.2 through BE-6.5 documentation is explicitly approved;
- an implementation contract identifies exact files and line-level seams;
- observation identifiers and context versioning are designed;
- a future resolver can produce a non-authoritative versioned decision;
- all applicable current decision sources can expose original decisions without reevaluation;
- failure isolation, redaction, middleware order, governance, provider, and project-isolation tests are specified;
- no adapter output is consumed by enforcement or frontend authority.

---

# 6. Future Runtime Migration Entry Criteria

Runtime enforcement migration requires a new architecture decision and must not be inferred from shadow success.

At minimum it requires:

- approved workspace, membership, scope, capability, and permission runtime authorities;
- representative shadow evidence across allow, deny, governance, provider, destructive, public-alias, and failure cases;
- zero unexplained allow-expansion conflicts;
- reviewed parity thresholds and known-difference policy;
- adversarial security validation;
- staged rollout and independent rollback;
- explicit ownership of final backend authority;
- explicit approval to modify runtime enforcement.

---

# 7. Architecture Review

The decision is consistent with the completed final-truth foundations and the verified runtime:

- it consumes rather than replaces existing decisions;
- it leaves permission resolution unimplemented;
- it prevents frontend or route metadata from becoming authority;
- it preserves governance and provider gates;
- it requires evidence before migration.

---

# 8. Approval and Commit Gate

The four BE-6 design documents may be committed only after explicit architecture approval.

No runtime file may be modified without a separate explicit approval after this review.

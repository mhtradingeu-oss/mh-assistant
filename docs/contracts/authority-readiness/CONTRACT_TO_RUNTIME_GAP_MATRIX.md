# Contract-to-Runtime Gap Matrix

Status: Phase 1B-1C comparison of **CURRENT PROVED TRUTH** against the certified contracts in [`../authority/`](../authority/). A gap classification is not an implementation request.

## Classification vocabulary

- `ABSENT`: required capability is not proved.
- `PARTIAL`: some bounded elements exist but do not satisfy the contract.
- `COMPATIBILITY_ONLY`: useful legacy behavior that cannot become canonical authority.
- `DUPLICATED`: overlapping producers/checks exist without one composite owner.
- `AMBIGUOUS`: binding, semantics, or owner cannot be deterministically established.
- `NON_CANONICAL`: installed data/logic exists but is not the certified owner/evidence.
- `UNSAFE_FOR_AUTHORITY`: promotion would create a security boundary violation.
- `READY_FOR_SHADOW`: bounded current signals/call site can support non-enforcing observation after approval.
- `BLOCKED_PENDING_SOURCE_OF_TRUTH`: safe implementation cannot proceed until the canonical source exists or is selected.
- `DEFERRED`: intentionally outside this phase.

## Required capability determinations

| Certified capability | Current proof | Gap class | Readiness decision |
|---|---|---|---|
| Authenticated human Principal | No login/session/IdP-to-Principal binding in backend request path | `ABSENT`, `BLOCKED_PENDING_SOURCE_OF_TRUTH` | Not ready |
| Service Principal | Synthetic `legacy-control-center-key` service assertion is request-local and shared-key-derived | `PARTIAL`, `COMPATIBILITY_ONLY`, `NON_CANONICAL` | May be observed only as compatibility authentication evidence; not a canonical Principal |
| Automation Principal | Agent roles/actors exist as business labels; no authenticated automation lifecycle | `ABSENT`, `UNSAFE_FOR_AUTHORITY` | Not ready |
| Canonical Workspace Membership | Workspace lifecycle and Workspace-to-Project relationship exist; no Principal relationship | `ABSENT`, `BLOCKED_PENDING_SOURCE_OF_TRUTH` | Not ready |
| Canonical Project Membership | No Principal-to-Project lifecycle | `ABSENT`, `BLOCKED_PENDING_SOURCE_OF_TRUTH` | Not ready |
| Canonical scoped Role | Team/UI/approval role labels lack authenticated subject, authoritative assignment, revision, lifecycle | `PARTIAL`, `NON_CANONICAL`, `UNSAFE_FOR_AUTHORITY` | Not ready |
| Canonical direct Grant | Route scope catalog exists, but no subject/scope-bound assignment | `ABSENT`, `BLOCKED_PENDING_SOURCE_OF_TRUTH` | Not ready |
| Inherited Grant | No authoritative inheritance evidence | `ABSENT`, `DEFERRED` | Must remain absent by default |
| Composite Effective Permission resolver | Distributed guards only; no contract-versioned composition | `ABSENT`, `DUPLICATED` | Not ready for enforcement; design-only shadow interface possible |
| Normalized permission outcome | Current 401/403/409/410/503 and domain results are heterogeneous | `PARTIAL`, `AMBIGUOUS` | Comparison normalization can be designed; current semantics must be preserved |
| Source-qualified authority evidence | Some logs/records and request-local context exist without universal binding/version/freshness | `PARTIAL`, `DUPLICATED`, `NON_CANONICAL` | Bounded adapters only after source review |
| Shadow comparison telemetry | Ephemeral `shadow_observations` records one runtime-security event but has no resolver comparison/sink | `PARTIAL`, `NON_CANONICAL` | Interface is designable; persistence and production collection unapproved |
| Shadow feature flag | Existing flags govern access-key bypass/public aliases, not an authority observer | `ABSENT` | Future isolated flag required |
| Kill switch | No observer exists and no observer-specific switch exists | `ABSENT` | Future independent switch required |
| Rollback-safe adoption path | Certified plan exists; no selected runtime call site or implementation | `PARTIAL`, `READY_FOR_SHADOW` after this design | Selected slice provides design boundary only |

## Contract dimension matrix

| Contract requirement | Installed evidence | Gap classification | Consequence |
|---|---|---|---|
| Typed Principal identity and lifecycle | Compatibility service assertion has fixed ID/type, no lifecycle/store | `PARTIAL`, `COMPATIBILITY_ONLY` | Missing Principal can never produce `ALLOW`. |
| Credential acceptance separate from Principal | Existing guard result is adapted separately, but synthetic identity collapses all holders | `PARTIAL`, `AMBIGUOUS` | Preserve authentication method/source; do not infer subject identity. |
| Active Workspace membership | None | `ABSENT`, `BLOCKED_PENDING_SOURCE_OF_TRUTH` | Project-scoped shadow result is normally `INSUFFICIENT_CONTEXT`. |
| Active Project membership under Workspace relationship | Resource relationship exists; Principal membership absent | `PARTIAL`, `BLOCKED_PENDING_SOURCE_OF_TRUTH` | Relationship may validate resource context only. |
| Versioned role definitions | Route/team catalogs contain role/scope strings with differing purposes | `PARTIAL`, `DUPLICATED`, `NON_CANONICAL` | Definition owner must be selected later. |
| Scoped assignment lifecycle | None | `ABSENT` | Labels are prohibited as grants. |
| Deny precedence and no implicit inheritance | Current local gates deny independently; no grant composition | `PARTIAL`, `AMBIGUOUS` | Future resolver must implement certified semantics without reinterpreting live behavior. |
| Exact resource/action/scope contract | Route classifier heuristically maps path/method; the selected route syntactically validates/normalizes its Project segment globally, but the handler does not prove Project existence or caller binding | `PARTIAL`, `AMBIGUOUS` | Selected slice needs an exact-GET allowlisted route contract; path validation cannot establish applicability or permission. |
| Governance as one bound input | Central gate is action/Project/entity aware; early proof and runtime security conflate signals | `PARTIAL`, `DUPLICATED`, `UNSAFE_FOR_AUTHORITY` | Only Operations Backbone governance evidence may be authoritative for governance. |
| Provider/execution separate from permission | Separate domain modules exist; runtime security passes key state as configured/approved | `PARTIAL`, `DUPLICATED` | Shadow evidence must retain source and never treat readiness as permission. |
| Missing context is non-authorizing | Some current guards fail closed, but unguarded paths/bypass/fallback exist | `PARTIAL`, `COMPATIBILITY_ONLY` | Future resolver always returns non-allow for missing required evidence; live result remains unchanged. |
| Evidence provenance/version/freshness | Domain records/logs vary; request-local adapter redacts but lacks source revisions/expiry | `PARTIAL`, `NON_CANONICAL` | Positive shadow result is blocked until required sources qualify. |
| Immutable normalized decision envelope | None | `ABSENT` | Design in [Authority Interface Design](AUTHORITY_INTERFACE_DESIGN.md); no implementation now. |
| Observer cannot affect response/execution | Existing observer callback catches exceptions, but is not a resolver comparison and runs inline | `PARTIAL`, `READY_FOR_SHADOW` | Pattern is useful; selected design adds strict isolation/budget/circuit breaker. |
| Restricted comparison storage/retention | None proved | `ABSENT`, `BLOCKED_PENDING_SOURCE_OF_TRUTH` | Passive collection cannot begin until sink, access, retention, and deletion owner are approved. |
| Frontend is projection only | Explicit code comments and architecture; frontend still defaults/switches roles | `READY_FOR_SHADOW` as negative invariant, `UNSAFE_FOR_AUTHORITY` as signal | No frontend consumer in first slice. |

## Highest-risk gaps

1. **No authenticated subject binding.** A shared key can authenticate possession but cannot distinguish a human, service, or automation Principal.
2. **No memberships or grants.** Any attempted positive composite decision would have to invent authority from keys, paths, roles, or approvals.
3. **Caller proof can satisfy early guards.** Approval/manual/owner/review strings are current compatibility checks, not source-qualified evidence.
4. **Key/provider/approval conflation.** Runtime security passes one key boolean as provider configuration and approval.
5. **Coverage and status ambiguity.** Middleware patterns are partial, PUT coverage differs, HEAD can dispatch to GET handlers outside the exact-GET read guard, aliases vary by environment, and denial bodies/statuses are heterogeneous.
6. **No restricted comparison store or retention owner.** Recording live mismatches could expose security, Project, or infrastructure data.
7. **Frontend default admin and selectable roles.** Promotion would be immediate privilege escalation.
8. **Project fallback/context is not membership.** Default or inferred Project selection risks cross-scope confusion.

## Shadow readiness conclusion

**DESIGN DECISION:** The repository is not ready for a positive effective-permission decision or enforcement. It is ready only for the design of a narrow observer around one already-protected read route. Until Principal, membership, and grant sources exist, a contract-compatible resolver must return `INSUFFICIENT_CONTEXT`, `DENY`, or `UNSUPPORTED_ACTION`; never `ALLOW` from compatibility signals.

**FUTURE IMPLEMENTATION:** A separately approved offline-fixture phase precedes any passive request attachment.

**DEFERRED:** Source selection, persistence, migrations, universal adapters, enforcement, current-gate retirement, and frontend authority projection changes.

**NOT PROVED:** Production privacy readiness, shadow storage, reviewer authorization, latency capacity, or positive-decision evidence sufficiency.

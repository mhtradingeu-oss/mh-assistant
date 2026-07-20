# Authority Interface Design

Status: Phase 1B-1C **DESIGN DECISION**. These are conceptual, language-neutral data contracts using the repository's snake-case wire conventions. They are not executable definitions and do not assert current implementation.

**CURRENT PROVED TRUTH:** The installed runtime has no complete set of these interfaces; its request-local compatibility authority context is documented separately. **FUTURE IMPLEMENTATION**, **DEFERRED**, and **NOT PROVED** items are identified at the end of this document.

## Common rules

All interfaces are backend-owned, explicitly versioned, closed to unknown fields by default, and serialized without secrets. Timestamps are UTC ISO-8601. Identifiers are opaque strings. Evidence is referenced rather than copied. Unknown, missing, stale, revoked, conflicting, malformed, unsupported-version, or improperly redacted required evidence cannot produce `ALLOW`.

Privacy classes are `PUBLIC_METADATA`, `INTERNAL`, `RESTRICTED_AUTHORITY`, and `SECRET_FORBIDDEN`. Initial shadow records are `RESTRICTED_AUTHORITY`. Raw credentials, tokens, cookies, authorization headers, secret values, raw bodies, unrestricted payloads, and unnecessary personal data are always `SECRET_FORBIDDEN` and cannot appear in any interface.

## 1. `AuthorityRequestContext`

**Responsibility:** Immutable, allowlisted description of one authority evaluation request; it never represents a permission result.

**Required fields:** `schema_version`, `decision_request_id`, `correlation_id`, `requested_at`, `call_site_id`, `request_method`, `route_contract_id`, `resource`, `action`, `required_scope`, `authentication_state`, `principal_assertion_disposition`, `evidence_bundle_reference`, `shadow`.

**Optional fields:** `principal_reference`, `workspace_reference`, `project_reference`, `purpose_code`, `risk_class`, `source_revision_expectations`, `trace_reference`.

**Invariants:** `shadow=true` for this phase; exact canonical method/route/action binding; no raw URL; optional absence never satisfies a required dimension; caller cannot declare not-applicable; compatibility Principal assertions carry `canonical=false`.

**Privacy:** `RESTRICTED_AUTHORITY`.

**Producer / consumer / mutation owner:** Future exact call-site adapter / future resolver / producer creates once; nobody mutates.

**Versioning:** `schema_version` plus versioned `route_contract_id`; breaking changes require a new version and explicit dual-read plan.

**Forbidden fields:** request/response objects, headers, key values/hashes, cookies, IP, user-agent, raw query/body, frontend role, handler payload.

**Failure semantics:** Schema or binding failure yields observer `MALFORMED` or resolver `INSUFFICIENT_CONTEXT`; the live request remains unchanged.

## 2. `AuthorityEvidenceReference`

**Responsibility:** Source-qualified pointer to one immutable or revision-pinned authority fact.

**Required fields:** `evidence_reference_id`, `evidence_type`, `source_authority`, `source_contract_version`, `source_revision`, `subject_binding`, `scope_binding`, `disposition`, `observed_at`, `fresh_until`, `redaction_class`.

**Optional fields:** `issued_at`, `expires_at`, `revoked_at`, `resource_binding`, `action_binding`, `reason_code`, `audit_reference`, `provenance_reference`.

**Invariants:** Exact subject/scope binding where applicable; reference resolves only for an authorized backend consumer; earliest expiry controls; `ACTIVE` presence alone is insufficient without provenance and freshness validation.

**Privacy:** `RESTRICTED_AUTHORITY`; a redacted operational catalog version may be `INTERNAL`.

**Producer / consumer / mutation owner:** Canonical bounded source adapter / evidence bundle builder and resolver / source authority owns fact lifecycle; reference is immutable.

**Versioning:** Source contract and revision are mandatory; unsupported versions are non-authorizing.

**Forbidden fields:** credential fingerprints, lookup-enabling secret hashes, raw approval artifacts, full domain records, contact details unless separately necessary and approved.

**Failure semantics:** Unresolvable, stale, revoked, conflicting, or unbound reference yields `INSUFFICIENT_CONTEXT` or `DENY` according to established source fact; never `ALLOW`.

## 3. `AuthorityEvidenceBundle`

**Responsibility:** Immutable manifest of evidence references used for one evaluation.

**Required fields:** `schema_version`, `bundle_id`, `decision_request_id`, `assembled_at`, `evidence_references`, `required_evidence_types`, `source_dispositions`, `completeness`, `earliest_fresh_until`, `redaction_class`.

**Optional fields:** `conflicts`, `stale_references`, `unavailable_sources`, `not_applicable_references`, `bundle_hash` using a non-secret canonical representation.

**Invariants:** No embedded source payloads; every required type is present and valid or explicitly marked missing/unavailable; not-applicable evidence must come from the canonical resource/action or policy owner; order does not affect semantics.

**Privacy:** `RESTRICTED_AUTHORITY`.

**Producer / consumer / mutation owner:** Future backend evidence assembler / resolver and restricted auditor / assembler creates once; source authorities remain mutation owners.

**Versioning:** Bundle schema plus each evidence reference version; bundle revisions are new bundles, not in-place edits.

**Forbidden fields:** secrets, arbitrary request data, copied membership/grant/approval payloads, frontend state.

**Failure semantics:** Incomplete, conflicting, or freshness-uncertain bundle is non-authorizing. Assembly failure is resolver unavailable or insufficient context, never a live-path exception.

## 4. `EffectivePermissionInput`

**Responsibility:** Versioned input envelope for composition of Principal, membership, grant, policy, and safety evidence.

**Required fields:** `contract_version`, `decision_request_id`, `requested_at`, `principal_assertion`, `authentication_state`, `workspace_context`, `project_context`, `grant_context`, `resource`, `action`, `required_scope`, `governance_context`, `execution_context`, `authority_request_context`, `authority_evidence_bundle`, `evaluation_mode`.

**Optional fields:** `expected_source_revisions`, `evaluation_deadline_at`, `policy_profile_version`.

**Normative certified-field mapping:** This envelope exposes every required field from `EFFECTIVE_PERMISSION_CONTRACT_DESIGN.md` directly; the wrapper fields do not replace them. `principal_assertion` is the typed Principal reference and provenance. `authentication_state` carries accepted/rejected/unknown state, method class, freshness, and issuer without a credential. `workspace_context` carries Workspace and Workspace-membership evidence references. `project_context` carries Project and Project-membership evidence references for Project scope. `grant_context` carries scoped assignment evidence references. `resource`, `action`, and `required_scope` preserve the exact certified resource/action/scope structures. `governance_context` and `execution_context` carry source-qualified evidence or an authoritative not-applicable result. Requiredness, applicability, and failure semantics are identical to the certified contract; a wrapper, adapter default, caller omission, or caller assertion cannot weaken them.

**Invariants:** `evaluation_mode=SHADOW` for the selected slice; input is read-only; direct certified fields agree with `authority_request_context` and `authority_evidence_bundle`; no source mutation handle; no caller-created permission fact. `authority_evidence_bundle.bundle_id` must equal `authority_request_context.evidence_bundle_reference`. A missing, mismatched, stale, unsupported, or inapplicable mandatory field is non-authorizing and never hidden by the wrapper.

**Privacy:** `RESTRICTED_AUTHORITY`.

**Producer / consumer / mutation owner:** Future call-site/evidence adapter / future effective-permission resolver / envelope immutable; source owners retain state mutation.

**Versioning:** `contract_version` follows the certified Effective Permission contract; unsupported version returns `UNSUPPORTED_ACTION` or malformed/unavailable according to parse stage.

**Forbidden fields:** domain write clients, execution callbacks, response mutators, credentials, raw HTTP artifacts.

**Failure semantics:** Missing required authority context yields a non-allow decision; transport/construction failure yields observer unavailable and never affects current behavior.

## 5. `EffectivePermissionDecision`

**Responsibility:** Immutable normalized result owned by the future resolver; it never executes or enforces an action.

**Required fields:** `contract_version`, `decision_id`, `decision_request_id`, `evaluated_at`, `outcome`, `reason_codes`, `scope`, `evidence_summary`, `policy_references`, `valid_until`, `shadow`, `enforcement_effect`, `audit_reference`, `primary_reason_code`, `resource_binding`, `action`, `evidence_bundle_id`, `source_revisions`, `evaluation_metadata`.

**Optional fields:** `scope_binding`, `missing_evidence_types`, `deny_evidence_references`, `approval_disposition`, `provider_disposition`, `execution_disposition`, `explanation_reference`.

**Certified compatibility:** `scope`, `evidence_summary`, `policy_references`, `shadow`, and `audit_reference` retain their certified meanings and requiredness. If present, `scope_binding` is only a contract-versioned structured projection of `scope`; it cannot replace, broaden, or disagree with `scope`.

**Invariants:** Outcome is one of `ALLOW`, `DENY`, `REQUIRES_APPROVAL`, `INSUFFICIENT_CONTEXT`, `UNSUPPORTED_ACTION`; explicit deny takes precedence; missing context never allows; `shadow=true` and `enforcement_effect=NONE` in this phase; approval/readiness cannot compensate for permission; decision validity cannot exceed earliest evidence freshness.

**Privacy:** `RESTRICTED_AUTHORITY`; only a separately defined redacted projection may be less restricted.

**Producer / consumer / mutation owner:** Future resolver / shadow comparator and restricted auditor / resolver creates once; no mutation.

**Versioning:** Contract and reason-code vocabulary versions are pinned in metadata.

**Forbidden fields:** secrets, raw evidence, HTTP response instructions, handler callback, UI visibility instructions.

**Failure semantics:** Resolver must return a well-formed non-allow result for established missing/deny cases. Exceptions/timeouts/malformed output are observer health states, not fabricated permission decisions.

## 6. `ShadowComparisonRecord`

**Responsibility:** Minimal restricted evidence comparing a current call-site fact with an observation-only future decision.

**Required fields:** `schema_version`, `comparison_id`, `deduplication_key`, `observed_at`, `correlation_id`, `call_site_id`, `route_contract_id`, `current_outcome_class`, `current_source_reference`, `shadow_outcome`, `shadow_reason_codes`, `mismatch_category`, `observer_health`, `shadow`, `enforcement_effect`, `current_result_changed`, `redaction_class`, `retention_class`.

**Optional fields:** `shadow_decision_id`, `evidence_bundle_id`, `source_dispositions`, `duration_bucket`, `sample_bucket`, `dropped_reason`, `staleness_disposition`.

**Invariants:** `shadow=true`, `enforcement_effect=NONE`, `current_result_changed=false`; no response data; exact current provenance retained; duplicate writes converge; a missing record has no live effect.

**Privacy:** `RESTRICTED_AUTHORITY`.

**Producer / consumer / mutation owner:** Future comparator / authorized security review and aggregate metrics / comparison sink appends idempotently; no source state mutation.

**Versioning:** Additive fields only within version; semantic changes require a new schema and migration/retention decision.

**Forbidden fields:** keys/hashes, headers, bodies, response or health/capability payload, Project names where an approved opaque reference suffices, personal data, full evidence.

**Failure semantics:** Sink failure increments a safe aggregate health metric if possible, trips the circuit breaker at threshold, and never reaches the response path.

## 7. `AuthorityReasonCode`

**Responsibility:** Stable machine-readable explanation vocabulary, not free-form authority.

**Required representation:** `vocabulary_version` plus one allowlisted code.

Closed permission reason vocabulary version `authority-permission-reasons/v1` uses closed versioned sub-enums. `AuthorityPermissionReasonCodeV1` is the normative union of every concrete code in this table; family names and wildcard forms are documentation labels only and are not runtime values.

| Closed family | Concrete v1 codes |
|---|---|
| Principal | `PRINCIPAL_UNESTABLISHED`, `PRINCIPAL_INACTIVE`, `PRINCIPAL_REVOKED` |
| Authentication | `AUTHENTICATION_UNESTABLISHED`, `AUTHENTICATION_REJECTED`, `AUTHENTICATION_STALE` |
| Workspace | `WORKSPACE_CONTEXT_UNESTABLISHED`, `WORKSPACE_SCOPE_MISMATCH`, `WORKSPACE_MEMBERSHIP_UNAVAILABLE`, `WORKSPACE_MEMBERSHIP_INACTIVE` |
| Project | `PROJECT_CONTEXT_UNESTABLISHED`, `PROJECT_SCOPE_MISMATCH`, `PROJECT_MEMBERSHIP_UNAVAILABLE`, `PROJECT_MEMBERSHIP_INACTIVE` |
| Membership | `MEMBERSHIP_UNESTABLISHED`, `MEMBERSHIP_INACTIVE`, `MEMBERSHIP_SCOPE_MISMATCH` |
| Role | `ROLE_ASSIGNMENT_UNESTABLISHED`, `ROLE_INACTIVE`, `ROLE_SCOPE_MISMATCH` |
| Grant | `GRANT_SOURCE_UNAVAILABLE`, `GRANT_REQUIRED_ABSENT`, `GRANT_EXPLICIT_DENY`, `GRANT_SCOPE_MISMATCH` |
| Resource | `RESOURCE_UNSUPPORTED`, `RESOURCE_BINDING_MISMATCH`, `RESOURCE_VERSION_MISMATCH` |
| Action | `ACTION_UNSUPPORTED`, `ACTION_BINDING_MISMATCH` |
| Scope | `SCOPE_UNESTABLISHED`, `SCOPE_MISMATCH`, `SCOPE_INHERITANCE_UNPROVED` |
| Governance | `GOVERNANCE_CONTEXT_UNESTABLISHED`, `GOVERNANCE_DENY`, `GOVERNANCE_POLICY_UNAVAILABLE` |
| Approval | `APPROVAL_REQUIRED`, `APPROVAL_INVALID`, `APPROVAL_REJECTED`, `APPROVAL_EXPIRED` |
| Provider | `PROVIDER_CONTEXT_UNESTABLISHED`, `PROVIDER_UNAVAILABLE`, `PROVIDER_DENY` |
| Execution | `EXECUTION_CONTEXT_UNESTABLISHED`, `EXECUTION_UNAVAILABLE`, `EXECUTION_DENY` |
| Runtime security | `RUNTIME_SECURITY_UNAVAILABLE`, `RUNTIME_SECURITY_DENY`, `RUNTIME_SECURITY_BINDING_MISMATCH` |
| Source | `SOURCE_UNAVAILABLE`, `SOURCE_CONFLICT`, `SOURCE_PROVENANCE_INVALID` |
| Version | `VERSION_UNSUPPORTED`, `VERSION_MISMATCH` |
| Policy | `POLICY_UNAVAILABLE`, `POLICY_UNSUPPORTED`, `POLICY_DENY` |
| Evidence | `EVIDENCE_REQUIRED_SATISFIED`, `EVIDENCE_STALE`, `EVIDENCE_REVOKED_DURING_EVALUATION`, `EVIDENCE_CONFLICT`, `EVIDENCE_BINDING_MISMATCH` |
| Context | `CONTEXT_INCOMPLETE`, `CONTEXT_AMBIGUOUS`, `CONTEXT_BINDING_MISMATCH` |
| Unsupported | `UNSUPPORTED_ROUTE_CONTRACT`, `UNSUPPORTED_RESOURCE_ACTION`, `UNSUPPORTED_REQUIRED_DIMENSION` |

Every code is an uppercase ASCII snake-case constant with no identifier, dynamic suffix, or free-form component. The resolver may emit only codes from the union version declared by `reason_vocabulary_version`. The security architecture owner owns additions through reviewed vocabulary versions; callers, adapters, policies, and source owners cannot mint codes.

Closed shadow observer-health vocabulary version `authority-shadow-health/v1`: `RESOLVER_TIMEOUT`, `RESOLVER_EXCEPTION`, `MALFORMED_DECISION`, `SINK_UNAVAILABLE`, `CIRCUIT_OPEN`, `QUEUE_FULL`, `REDACTION_FAILURE`, `CONFIGURATION_INVALID`.

Closed control-plane transition vocabulary version `authority-shadow-control/v1`: `INITIAL_DEFAULT`, `OPERATOR_ENABLE`, `OPERATOR_DISABLE`, `INCIDENT_DISABLE`, `AUTOMATIC_SAFETY_DISABLE`, `CONFIGURATION_FAILURE_DISABLE`, `EXPIRY_DISABLE`.

**Optional fields:** none in the scalar form; human text belongs in a separately access-controlled catalog.

**Invariants:** Codes cannot include identifiers or dynamic strings; code category must agree with outcome; permission, observer-health, and control-transition vocabularies are disjoint. Health or control codes cannot be reported as permission reasons. Within v1, an unknown, malformed, or non-union code makes the decision malformed and non-authorizing. An unsupported newer permission-reason version is rejected as unsupported observer output; it is never downgraded, guessed, or treated as positive authorization.

**Privacy:** `INTERNAL` vocabulary; use within a record inherits that record's classification.

**Producer / consumer / mutation owner:** Versioned backend catalog / resolver, comparator, restricted reviewers / security architecture owner through reviewed version changes.

**Versioning:** The permission union, observer-health enum, and control-plane enum carry their own version identifiers. Permission-code additions are append-only within a major vocabulary version; redefinition/removal requires a major version and explicit dual-read review. A consumer that does not support the declared version fails closed for permission use.

**Forbidden fields:** free-form exception messages, resource names, personal data, secret-derived values.

**Audit representation:** Restricted decision evidence records the declared permission vocabulary version and ordered concrete codes exactly. It does not store wildcard family labels, free-form reason text, or dynamically constructed codes.

**Failure semantics:** Unknown, malformed, or unsupported-version permission codes make the decision unusable and non-authorizing; the observer records a separate allowlisted health code and disables/trips as configured without affecting live behavior.

## 8. `AuthorityEvaluationMetadata`

**Responsibility:** Bounded operational metadata about resolver execution.

**Required fields:** `resolver_version`, `contract_version`, `reason_vocabulary_version`, `started_at`, `completed_at`, `duration_ms`, `source_count`, `cache_disposition`, `concurrency_disposition`, `redaction_version`.

**Optional fields:** `deadline_ms`, `source_latency_buckets`, `retry_count` (must be zero on the live request handoff unless separately approved), `circuit_state`, `worker_class`.

**Invariants:** No high-cardinality secret/user dimensions; clock order valid; metadata cannot influence outcome except declared deadline/source validity rules; no synchronous retry may delay current response.

**Privacy:** `INTERNAL` or `RESTRICTED_AUTHORITY` when joined to a comparison.

**Producer / consumer / mutation owner:** Resolver runtime / comparator and operations / immutable per evaluation.

**Versioning:** Pinned through decision contract; metrics bucket changes are versioned.

**Forbidden fields:** stack traces, host secrets, raw source errors, request data, credential state beyond safe disposition.

**Failure semantics:** Invalid metadata makes output malformed for comparison; it does not alter live execution.

## 9. `ShadowFeatureFlag`

**Responsibility:** Backend-owned enablement and sampling policy for the exact observer; never a permission flag.

**Required fields:** `schema_version`, `flag_id`, `state`, `route_contract_allowlist`, `evaluation_mode`, `sampling_basis_points`, `configuration_revision`, `effective_at`, `owner`, `transition_reason_code`, `audit_reference`.

**Optional fields:** `expires_at`, `environment_allowlist`, `maximum_queue_depth`, `maximum_evaluation_ms`, `change_ticket_reference`.

**State enum:** Closed `shadow-feature-flag-state/v1`: `ENABLED`, `DISABLED`.

**Invariants:** Default state is `DISABLED`; only selected canonical exact-GET route contract may be allowlisted; `evaluation_mode=SHADOW`; unknown, unreachable, malformed, unsupported-version, or expired state is interpreted as disabled; sampling is deterministic and not subject/credential-derived; changing it never changes current guards. Legal transitions are `DISABLED -> ENABLED` and `ENABLED -> DISABLED` through an authorized compare-and-set revision. Automatic transitions may only move to `DISABLED`; no automatic enable is legal. Every transition requires the previous/new revision, approved control-plane reason code, owner authority reference, timestamp, and audit reference.

**Privacy:** `INTERNAL`; audit reference may be restricted.

**Producer / consumer / mutation owner:** Approved backend configuration authority / observer admission control / named operations-security owner only; automatic safety controls may disable but cannot enable.

**Versioning:** Revisioned, auditable configuration with compare-and-set mutation.

**Forbidden fields:** permission grants, subjects, credentials, response behavior, bypass instructions, public-alias controls.

**Failure semantics:** Fail disabled and emit a safe configuration-health event.

## 10. `ShadowKillSwitch`

**Responsibility:** Immediate, independently evaluated stop control for new shadow evaluations and comparison writes.

**Required fields:** `schema_version`, `switch_id`, `state`, `configuration_revision`, `changed_at`, `changed_by_authority_reference`, `transition_reason_code`, `audit_reference`.

**Optional fields:** `automatic_trigger`, `incident_reference`, `expires_at` only for a reviewed auto-disable state (never auto-enable).

**State enum:** Closed `shadow-kill-switch-state/v1`: `ENABLED`, `DISABLED`. `ENABLED` means shadow work may be admitted only if the independent feature flag and all safety gates also allow it; it grants no permission. `DISABLED` stops all new shadow snapshot, evaluation, and comparison work.

**Invariants:** Default state is `DISABLED`; `DISABLED` wins over every feature flag; unknown, unreachable, malformed, or unsupported-version state means disabled; the switch does not modify routes, handlers, keys, policy, membership, grants, or evidence sources. Legal transitions are `DISABLED -> ENABLED` and `ENABLED -> DISABLED` through an authorized compare-and-set revision. Re-enable is always a separate audited operator change. Automatic transitions may only move to `DISABLED`. Every transition requires the previous/new revision, allowlisted control-plane reason code, actor authority reference, timestamp, and audit reference.

**Privacy:** `INTERNAL`, with actor/audit references `RESTRICTED_AUTHORITY`.

**Producer / consumer / mutation owner:** Approved operations-security control plane / observer admission control and circuit breaker / named operations-security owner plus automatic safety mechanism for disable only.

**Versioning:** Monotonic revision, compare-and-set, append-only audit trail.

**Forbidden fields:** deletion commands, source mutations, enforcement settings, current-guard bypasses, raw incident payloads.

**Failure semantics:** Fail disabled. In-flight observer work may be abandoned; in-flight current requests continue under existing guards.

## Ownership summary

```text
current bounded owners -> read-only evidence references
exact call-site adapter -> AuthorityRequestContext + EffectivePermissionInput
future resolver -> EffectivePermissionDecision only
future comparator -> ShadowComparisonRecord only
feature flag + kill switch -> observer admission only
current guard + handler -> remain sole live decision/execution path
```

## FUTURE IMPLEMENTATION / DEFERRED / NOT PROVED

- **FUTURE IMPLEMENTATION:** language binding, schema validation, source adapters, resolver, comparator, control plane, and sink only under a new approval.
- **DEFERRED:** transport, queue technology, storage engine, retention duration, reviewer identities, cryptographic signing, and enforcement interfaces.
- **NOT PROVED:** any interface above exists today, that a suitable sink/config owner exists, or that positive evidence sources are available.

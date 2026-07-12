# Phase 1A-7 Route / Permission / Security Vocabulary Freeze Recommendation

“This Phase 1A-7 inventory freezes observed route, access, scope, principal, permission, authorization, security-enforcement, proof, isolation, transport-security, validation, denial, and audit vocabulary and records recommendations only. It does not approve route IDs, permission models, principal models, RBAC, scope inheritance, middleware changes, migrations, schemas, registries, or runtime changes.”

## Executive recommendation

Freeze the observed vocabulary as federated, source-qualified terms. Do not declare a universal route, principal, permission, or security contract. Preserve existing runtime behavior while future phases shadow registration, identity, permission, project isolation and audit relationships. Backend enforcement remains authoritative; frontend visibility and operational role ownership remain projections.

## Frozen runtime vocabulary

| Vocabulary | Frozen meaning |
|---|---|
| route registration | An Express method/path/handler registration in `runtime/orchestrator-service/server.js`; not a contract or permission. |
| canonical route / public alias | Path relationship inferred from paired registrations and `/public` compatibility logic; handler equivalence does not prove middleware equivalence. |
| `requiredAccess` | Classifier output: `public`, `read_key`, `write_key`, `admin`, `service`, `future_rbac`; not effective access. |
| `requiredScope` | Domain classifier/provider classifier string; not authenticated subject scope. |
| write/read key | Shared `MH_CONTROL_CENTER_WRITE_KEY` credential accepted from `x-mh-control-key` or Bearer; not principal, RBAC, or membership. |
| protected route authority | Presence-based request guard with `approval_required`, `manual_execution_only`, `owner_workspace_required`, `forbidden_from_ai_command`, `review_output_only`. |
| request proof flag | `approvalId`/`approval_id`, `manual_execution`, `owner_workspace`, `review_output` or camel/header equivalents; not validated authority. |
| governance decision | Project policy/approval lifecycle result at selected call sites; independent of route permission and provider decisions. |
| provider decision | Provider-action classifier result; independent of principal permission. |
| active/owner/reviewer role | Frontend projection or operational work-routing label; not authenticated backend authority. |
| project slug/path | Normalized storage/routing selector; not project membership. |
| public | Route/alias label; not proof of anonymous authorization for every middleware layer. |
| sensitive mutation | Match in `SENSITIVE_MUTATION_ROUTE_PATTERNS` or any public mutation; not complete sensitive-route coverage. |
| audit event/log/history | Source-local evidence only; not a universal immutable ledger. |

## Required separations

Route registration != route classification != route visibility != route access enforcement. `requiredAccess` != effective access decision. `requiredScope` != authenticated subject scope. Write key != authenticated principal != role permission != governance approval. REQUEST_PROOF_FLAG != VALIDATED_AUTHORITY_PROOF. Frontend allowed route != backend route permission. Frontend owner role != backend authority. Role alias != role grant. Role fallback != authorization fallback. Project selection/path normalization != project isolation authorization. Route alias != canonical security equivalence. Sensitive catalog membership != middleware installation. Governance decision != permission resolution. Provider gate != route permission. Input validation != authorization. CORS != CSRF. Rate limiting != authentication. Request ID/IP/actor label != authenticated principal ID. Test presence != certification.

## Classification vocabulary

Use only source-backed maturity labels: `IMPLEMENTED_PATH`, `PARTIAL`, `CLASSIFICATION_ONLY`, `PROJECTION_ONLY`, `FRONTEND_ONLY`, `PROCESS_LIFETIME_ONLY`, `CONFIG_ONLY`, `AUDIT_ONLY`, `TEST_OR_VALIDATOR`, `HISTORICAL_EVIDENCE`, `NOT_CERTIFIED`, `MISSING`, `UNKNOWN_REQUIRES_PROOF`. Fail behavior uses `FAIL_CLOSED`, `FAIL_OPEN`, `PARTIAL`, `CALL_SITE_DEPENDENT`, `UNKNOWN_REQUIRES_PROOF`.

## Future-only candidate fields

Candidates for investigation—not a schema and not approved—are: `contract_version`, `route_id`, `canonical_route_id`, `route_alias_id`, `principal_id`, `subject_type`, `subject_id`, `authenticated_identity`, `role_ids`, `project_membership`, `organization_membership`, `workspace_membership`, `required_access`, `required_scope`, `effective_permissions`, `resource_type`, `resource_id`, `action_id`, `policy_decision`, `governance_decision`, `approval_decision`, `proof_type`, `proof_id`, `decision_reason`, `denial_code`, `request_id`, `correlation_id`, `audit_event_id`, `middleware_chain`, `security_version`.

## Federated projection and shadow comparison plan

1. Phase 1A-8 Identity / Organization / Workspace / Project Inventory: discover actual identity and membership sources without inventing them.
2. Phase 1B Route / Security Contract Design: define source-qualified route identity, aliases, middleware-chain representation, unknown-route/action semantics, denial vocabulary and compatibility adapters.
3. Phase 1B Principal / Identity Contract Design and Phase 1B Authority / Permission Contract Design: keep service credentials, authenticated principals, roles, scopes, projects, governance and providers as separate inputs.
4. Phase 1B Audit Evidence Contract Design: define correlation and durable evidence without calling existing fragments one ledger.
5. Phase 1C Route Coverage Shadow Projection: enumerate every registration and compare canonical/alias chains, sensitive catalogs and key guards without enforcement changes.
6. Phase 1C Permission Decision Shadow Projection: compute candidate decisions beside current behavior; record disagreements, never alter responses.
7. Phase 1C Project Isolation Shadow Projection: compare selected project, normalized paths, storage roots and candidate membership.
8. Future Security Runtime Certification, Future Transport Security Certification, Future Abuse Protection Certification and Future Secret Management Certification: controlled runtime proof only after designs are approved.

Shadow records should contain only future-approved identifiers and redacted evidence. Required comparisons include current outcome vs candidate outcome, current middleware chain vs projected chain, flag proof vs durable proof, key authorization vs principal permission, frontend visibility vs backend decision, canonical vs alias, and project path vs membership. No shadow result may grant authority.

## Migration order and rollback principle

Inventory identity first; design contracts second; add read-only projections third; measure disagreements fourth; approve compatibility mappings fifth; migrate one route family at a time only in a later authorized phase; certify last. Rollback must restore the previous runtime decision path without deleting evidence, changing stored IDs, or silently treating projection fallbacks as authority.

## Extensibility model

Prefer federated adapters that preserve provenance: registration producer, classifier version, credential decision, principal source, project source, governance result, provider result, handler and audit sink. New route domains, principal types, scopes and gates must have explicit unknown behavior and compatibility status. Do not normalize incompatible concepts merely to fill candidate fields.

## Forbidden actions in this phase

No runtime/frontend/test/script/config edits; no route, middleware, alias, classifier, permission, role, proof, governance, provider, project, CORS, CSRF, rate-limit, validation, secret, denial or audit behavior changes; no schema/registry/RBAC/principal resolver; no server/HTTP/route execution; no keys/proofs/data writes; no commit or push.

## Unresolved decisions

Universal route identity; principal and subject types; service vs human authentication; role source and inheritance; organization/workspace/company hierarchy; project membership; effective permission algorithm; alias retirement; unknown defaults; durable proof binding/freshness/reviewer rules; middleware order; CSRF and proxy/TLS policy; rate-limit identity/storage; canonical validation/denial envelope; audit durability/retention/immutability; secret rotation/revocation/browser exposure; certification criteria.

## Phase 1A-7 exit criteria recommendation

Exit only when the five documents exist, exact freeze notice appears once per document, classifications remain non-authoritative unless backend enforcement is independently proved, all required conflicts are recorded, source references are qualified, tables validate, only these files changed, and `git diff --check` passes. Passing this inventory means current-HEAD truth is documented; it does not certify production security or approve future contracts.

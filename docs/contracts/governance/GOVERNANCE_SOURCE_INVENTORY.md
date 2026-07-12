# Governance / Approval Source Inventory (Phase 1A-6)

“This Phase 1A-6 inventory freezes observed governance, approval, policy, permission, reviewer, risk, confirmation, decision, execution-gate, mutation-gate, escalation, authorization, and audit vocabulary and records recommendations only. It does not approve IDs, state machines, authority models, expiration or freshness rules, migrations, schemas, registries, or runtime changes.”

## Scope and Baseline

- Documentation-only static inspection at `HEAD=b63c7f517d13977243fe071f0d0664a41be7bb34`, branch `main`, with `origin/main...HEAD = 0 0` and a clean pre-documentation worktree on 2026-07-12.
- Backend runtime code is implementation truth. Frontend files are projections, operator confirmations, or experience models unless a backend owner is cited.
- Historical documents, validators, mocks, and comments do not certify runtime behavior. No tests or runtime execution were performed in this phase.

## Executive Findings

| Question | Finding | Classification | Evidence | Confidence |
| --- | --- | --- | --- | --- |
| Universal Governance Contract | Disproved. Project policy, action rules, route classification, protected-route proof, and provider gates are separate models. | `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:14-36`; `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:25-100`; `runtime/orchestrator-service/lib/security/route-permission-catalog.js:12-103` | HIGH |
| Universal Approval Contract | Disproved. A durable approval record exists, while protected-route `approvalId` proof and provider `approved` booleans do not validate that record. | `IMPLEMENTED_PATH` + `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:2567-2953`; `runtime/orchestrator-service/lib/security/protected-route-authority.js:53-98`; `runtime/orchestrator-service/lib/security/provider-execution-gate.js:113-153` | HIGH |
| Universal Policy Contract | Disproved. Durable project policy is implemented, but action rules and route/provider catalogs are code-owned and are not merged into one policy. | `IMPLEMENTED_PATH` + `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:1194-1284`; `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:25-100`; `runtime/orchestrator-service/lib/security/route-permission-catalog.js:12-218`; `runtime/orchestrator-service/lib/security/provider-execution-gate.js:12-153` | HIGH |
| Universal Reviewer Contract / Authority | Disproved. Approval reviewer fields and inferred reviewer roles exist, but no reviewer identity authentication or authority verification is performed by `decideApproval`. | `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:2583-2656`, `2762-2820` | HIGH |
| Universal Risk Contract / ID | Disproved. Approval risk strings, route risk, provider risk, and setup-key classification are independent; no universal Risk ID was proved. | `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:850-884`; `runtime/orchestrator-service/lib/security/route-permission-catalog.js:12-103`; `runtime/orchestrator-service/lib/security/provider-execution-gate.js:12-89`; `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:102-121` | HIGH |
| Universal Decision Contract / ID | Disproved. Durable approval status is the closest persisted decision; gate decisions are transient objects. No universal decision entity or Decision ID was proved. | `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:2762-2953`; `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:174-205` | HIGH |
| Universal Permission Contract | Disproved. Write-key authorization is enforced for sensitive mutations; route access and scope are classified, but no authenticated-principal permission resolver was proved. | `PARTIAL` | `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js:60-155`; `runtime/orchestrator-service/lib/security/route-permission-catalog.js:105-218` | HIGH |
| Universal Execution Authorization Contract | Disproved. Governance approval, write key, protected-route headers, provider configuration, and queue requirements are distinct. | `PARTIAL` | `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:25-646`; `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js:6-155`; `runtime/orchestrator-service/lib/security/protected-route-authority.js:16-206`; `runtime/orchestrator-service/lib/security/provider-execution-gate.js:12-153` | HIGH |
| Universal Approval State Machine | Disproved. APPROVAL_STATUS vocabulary and mutation are implemented, but universal terminality and transition guards were not proved. | `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:62-65`, `2762-2781` | HIGH |
| Universal Governance Root / Aggregate / ID | Disproved. `FEDERATED_GOVERNANCE_RELATED_RECORDS=IMPLEMENTED_PATH`; `GOVERNANCE_AGGREGATE_ROOT=MISSING`; `GOVERNANCE_ROOT_ID=MISSING`; `GOVERNANCE_AGGREGATE_INVARIANT=MISSING`. | `IMPLEMENTED_PATH` + `UNKNOWN_REQUIRES_PROOF` | `runtime/orchestrator-service/lib/ops/backbone.js:780-884`, `1240-1284`, `2567-2953` | HIGH |
| Universal Approval ID | `approval.id` is DURABLE_APPROVAL_RECORD_ID only. It is not a decision, execution-authorization, execution, result, protected-route-proof, or provider-approval ID. | `IMPLEMENTED_PATH` | `runtime/orchestrator-service/lib/ops/backbone.js:2598-2607`; `runtime/orchestrator-service/lib/security/protected-route-authority.js:53-76` | HIGH |
| Universal Policy ID | Disproved. Routes use the implicit entity ID `default`; no required universal Policy ID was proved on the stored document. | `PARTIAL` | `runtime/orchestrator-service/server.js:12810-12845`; `runtime/orchestrator-service/lib/ops/backbone.js:1240-1284` | HIGH |
| Universal Expiration / Freshness Model | No expiration, freshness, timeout, or revocation enforcement was proved in the inspected current-HEAD owners and consumers. Timestamps and newest-record ordering are not freshness. | `UNKNOWN_REQUIRES_PROOF` | `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:139-172`, `280-325`; `runtime/orchestrator-service/lib/ops/backbone.js:2640-2650`; repository-wide negative evidence from the verified Phase 1A-6 inspection | HIGH |
| Universal Escalation Model | Disproved. Risk-based chains and explicit escalation tasks exist only in the approval/backbone domain; general automatic escalation was not proved. | `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:2619-2622`, `2778-2790`, `2918-2942` | HIGH |
| Universal Audit Model | Disproved. Approval history, governance events, notifications, queues, linked histories, overrides, application logs, scheduler logs, execution results, and route denials are FRAGMENTED_AUDIT_EVIDENCE. | `AUDIT_ONLY` + `PARTIAL` | `runtime/orchestrator-service/lib/ops/backbone.js:1240-1284`, `2660-2760`, `2800-2953`; `runtime/orchestrator-service/server.js:15829-15896`, `23157-23371`; `runtime/orchestrator-service/lib/execution/scheduler-storage.js:16-52` | HIGH |

## Source Register

| Source | Classification | Current implementation truth | Confidence |
| --- | --- | --- | --- |
| `runtime/orchestrator-service/lib/ops/backbone.js` | `IMPLEMENTED_PATH` | Project-scoped durable `governance.json`, `approvals.json`, policy normalization/merge, approval create/decide, ownership projection, escalation, overrides, linked-entity mutations, history/events/notifications/queue. | HIGH |
| `runtime/orchestrator-service/lib/security/governance-mutation-gate.js` | `IMPLEMENTED_PATH` | Action catalog, policy blocks, approval lookup, payload hashing/redaction/fingerprint, durable approval request issue/reuse, and transient allow/deny decisions. | HIGH |
| `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js` | `IMPLEMENTED_PATH` | Enforces configured control write key on enumerated sensitive mutation routes; consumes route/provider classifiers. | HIGH |
| `runtime/orchestrator-service/lib/security/route-permission-catalog.js` | `PARTIAL` | Classifies domain, access, scope and risk. Its own header says catalog/non-enforcing; scopes are not a proved RBAC resolver. | HIGH |
| `runtime/orchestrator-service/lib/security/protected-route-authority.js` | `IMPLEMENTED_PATH` | Enforces presence of header/body/query proof flags on routes that install it; an approval ID is presence proof, not durable approval validation. | HIGH |
| `runtime/orchestrator-service/lib/security/provider-execution-gate.js` | `PARTIAL` | Provider action/risk/decision classification; its own header says non-enforcing. Runtime security calls it with write-key-derived configured/approved booleans. | HIGH |
| `runtime/orchestrator-service/server.js` | `IMPLEMENTED_PATH` | Registers routes, installs security middleware, invokes mutation/lifecycle gates, and exposes approval and governance policy routes. | HIGH |
| `public/control-center/runtime/authority/authority-projection.js` | `PROJECTION_ONLY` | Explicitly reads projected governance, approvals and route permissions; explicitly cannot enforce or own authority. | HIGH |
| `public/control-center/pages/governance.js` | `FRONTEND_ONLY` | Governance console, browser confirmation, API calls, policy editor, and backend summary projection. | HIGH |
| `public/control-center/api.js` | `PROJECTION_ONLY` | Approval and governance HTTP client. | HIGH |
| `public/control-center/runtime/ai-team/ai-team-operating-contract.js` | `FRONTEND_ONLY` | Role/output/forbidden-action experience model; compliance reviewer is explicitly forbidden from deciding approvals. | HIGH |
| `scripts/backend/check-durable-approval-lifecycle.js` | `NOT_CERTIFIED` | Static/runtime validator source for durable lifecycle behavior; not executed by Phase 1A-6. | HIGH |
| `scripts/backend/check-governance-mutation-gates.js` | `NOT_CERTIFIED` | Validator source for action gates; not executed here. | HIGH |
| `scripts/backend/check-admin-policy-granularity.js` | `NOT_CERTIFIED` | Validator source for policy-key and setup classification; not executed here. | HIGH |
| `scripts/backend/check-runtime-security-enforcement.js` | `NOT_CERTIFIED` | Validator source for write-key enforcement; not executed here. | HIGH |
| `scripts/verify-governance-normalization.js` | `NOT_CERTIFIED` | Contains a duplicate verification model; runtime backbone remains authoritative. Not executed here. | HIGH |

## Durable Governance and Policy

- `getOperationsPaths` assigns `ops/governance.json`; initialization supplies approval actions, risk levels, execution policy, policy rules, approval owners, and a settings bridge (`runtime/orchestrator-service/lib/ops/backbone.js:800`, `850-884`).
- `normalizeGovernancePolicy` merges `DEFAULT_POLICY_RULES` at read time and explicitly coerces `freeze_publishing` and `approval_before_publish`; it does not persist normalization (`runtime/orchestrator-service/lib/ops/backbone.js:1194-1238`).
- `updateGovernancePolicy` shallow-merges the document and separately merges `execution_policy`, `policy_rules`, `approval_owners`, and `settings_bridge`; `active_overrides` is replace-or-preserve. It writes one PROJECT_GOVERNANCE_POLICY and appends an event (`runtime/orchestrator-service/lib/ops/backbone.js:1240-1284`).
- Policy update is intentionally non-recursive: write-key plus governance check, but no approval requirement (`runtime/orchestrator-service/lib/security/governance-mutation-gate.js:36-39`; `runtime/orchestrator-service/server.js:12810-12845`).
- There is no organization/workspace policy merge, inheritance chain, version, policy ID, effective-date model, or conflict-resolution precedence beyond current object merge. Classification: `PARTIAL`.

## Durable Approval and Decision

- `createApproval` requires `entity_type` and `entity_id`; generates `approval.id` as DURABLE_APPROVAL_RECORD_ID; stores mutation/action/linkage fields, REVIEWER_ROLE_METADATA, risk, ownership, escalation chain, flags, timestamps, and history (`runtime/orchestrator-service/lib/ops/backbone.js:2567-2660`).
- It also appends an event, creates a notification, upserts an approval queue item, and mutates supported linked content/media records (`runtime/orchestrator-service/lib/ops/backbone.js:2660-2760`).
- `decideApproval` accepts `approved`, `rejected`, `changes_requested`, `escalated`, `overridden`, or `cancelled`; records DECISION_ACTOR_LABEL/note/timestamps/history and mutates queue and supported linked entities (`runtime/orchestrator-service/lib/ops/backbone.js:2762-2917`).
- EXPLICIT_APPROVAL_ESCALATION creates a governance task. `overridden` is APPROVAL_STATUS and also appends a GOVERNANCE_OVERRIDE_RECORD to active overrides (`runtime/orchestrator-service/lib/ops/backbone.js:2918-2953`).
- No authenticated reviewer match, separation-of-duties check, required decision note, universal decision entity/ID, transition precondition, expiry/freshness check, durable revocation path, or compare-and-swap was proved in the inspected current-HEAD approval writer, decision route, gate consumers, and repository-wide negative evidence. Classification: `PARTIAL`, with absent semantics `UNKNOWN_REQUIRES_PROOF`.

## Mutation Gate and Approval Linkage

- `ACTION_RULES` is the code-owned GOVERNANCE_ACTION_RULES matrix. Some actions require approval, some require governance only, and publishing actions may be freeze-sensitive (`runtime/orchestrator-service/lib/security/governance-mutation-gate.js:25-100`).
- Lifecycle-gated requests hash a redacted payload and route/method/action/entity context. `approval_fingerprint` is MUTATION_APPROVAL_FINGERPRINT, `intended_action_id` is INTENDED_ACTION_LINK, and default `linked_execution_id` is PROVISIONAL_EXECUTION_LINK (`runtime/orchestrator-service/lib/security/governance-mutation-gate.js:248-279`). None proves consumption, downstream idempotency, successful execution, or a universal correlation ID.
- A matching approval is reused by fingerprint/route/method/action/entity. `approved` allows, `rejected` blocks, and every other state is returned as pending on this path (`runtime/orchestrator-service/lib/security/governance-mutation-gate.js:280-422`).
- Direct selector-based mutation checks accept the newest `approved` or `overridden` record matching supplied selector fields (`runtime/orchestrator-service/lib/security/governance-mutation-gate.js:139-172`, `560-646`). Positive proof is path-specific.
- Fingerprint linkage is strong payload identity for the lifecycle path, but it is not a universal approval linkage contract; selector paths can be less specific. No consumption marker prevents approval reuse. Classification: `IMPLEMENTED_PATH`, `PARTIAL`.

## Permission, Route, and Execution Authorization

- Runtime security enforcement protects enumerated sensitive mutation paths and requires CONTROL_WRITE_AUTHORIZATION (`runtime/orchestrator-service/lib/security/runtime-security-enforcement.js:6-155`). This shared key is not role permission resolution.
- Route catalog `requiredAccess` and `requiredScope` are ROUTE_ACCESS_CLASSIFICATION and ROUTE_SCOPE_CLASSIFICATION metadata. Neither proves principal permission resolution by itself (`runtime/orchestrator-service/lib/security/route-permission-catalog.js:105-218`).
- Protected-route authority accepts APPROVAL_PROOF_FLAG and REQUEST_PROOF_FLAG values for approval/manual execution/owner workspace/review output. It does not load `approvals.json` or verify approval state, subject, action, project, freshness, or authority (`runtime/orchestrator-service/lib/security/protected-route-authority.js:53-206`).
- Provider gate classifies provider risk and required scope. It is not itself enforcement; runtime security supplies both `configured` and the `PROVIDER_CLASSIFIER_APPROVED_FLAG` from write-key authorization (`runtime/orchestrator-service/lib/security/runtime-security-enforcement.js:106-117`).
- Therefore permission, governance approval, route proof, and execution authorization must remain separate vocabulary.

## Confirmation, Risk, Escalation, and Audit

- Browser `window.confirm` flows exist in Governance and other pages, but they are frontend operator UX and are not durable confirmation proof (`public/control-center/pages/governance.js:184-222`, `1328-1458`). Classification: `FRONTEND_ONLY`.
- Risk exists as unvalidated approval `risk_level`, fixed policy `risk_levels`, route risk constants, provider risk constants, and setup payload key patterns. No universal computation or risk ID exists. Classification: `PARTIAL`.
- Approval escalation is a decision plus generated task and risk-derived chain; automatic critical-risk escalation is stored as a policy flag but no general automatic transition was proved here. Classification: `PARTIAL`.
- Approval history, governance events, notifications, approval queue entries, linked entity history, active overrides, application logs, scheduler logs, execution results, and route denial evidence are FRAGMENTED_AUDIT_EVIDENCE. Completeness, immutability, universal retention/correlation, and legal/compliance certification were not proved. Classification: `AUDIT_ONLY`, `PARTIAL`.

## Governance Aggregate Distinction

- `FEDERATED_GOVERNANCE_RELATED_RECORDS=IMPLEMENTED_PATH`
- `GOVERNANCE_AGGREGATE_ROOT=MISSING`
- `GOVERNANCE_ROOT_ID=MISSING`
- `GOVERNANCE_AGGREGATE_INVARIANT=MISSING`

Project policy, approvals, tasks, events, notifications, queues, and overrides are separate related records. Their project/entity links do not establish a Governance Aggregate.

## Scope, Tests, Legacy, Mocks, and Placeholders

- Proven durable scope is project path scope. Organization and workspace governance ownership, inheritance, and policy merge are `UNKNOWN_REQUIRES_PROOF`.
- Frontend role matrices and route permission projections are not backend role enforcement.
- Validators are evidence of intended checks, not certification, because Phase 1A-6 executes no tests.
- `route-permission-catalog.js` and `provider-execution-gate.js` describe earlier non-enforcing phases in comments; current call sites determine present truth. The former remains classification-only, while the latter influences runtime-security decisions.
- Mocks inside validators and historical/legacy frontend files are `NOT_CERTIFIED` and do not supersede current runtime owners.

## Explicit Missing or Unproved Semantics

- Universal governance/approval/policy/reviewer/risk/decision/permission/execution-authorization contracts
- Governance, policy, decision, risk, or universal subject IDs
- Approval expiration, freshness, timeout, revocation, inheritance, or one-time consumption
- Approval replay protection or idempotent execution proof
- Retry semantics for approval requests or decisions
- Universal cancellation semantics beyond durable status `cancelled`
- Organization/workspace policy scope or merge
- Authenticated human identity, reviewer authority, role enforcement, or separation of duties
- Universal decision lineage from approval through an actual execution result

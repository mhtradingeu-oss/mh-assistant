# Governance / Approval Matrix (Phase 1A-6)

“This Phase 1A-6 inventory freezes observed governance, approval, policy, permission, reviewer, risk, confirmation, decision, execution-gate, mutation-gate, escalation, authorization, and audit vocabulary and records recommendations only. It does not approve IDs, state machines, authority models, expiration or freshness rules, migrations, schemas, registries, or runtime changes.”

## Contract Matrix

| Concept | Current owner / representation | Scope | Identity / subject / action | Persistence | Enforcement | Expiration / freshness | Audit / lineage | Classification | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PROJECT_GOVERNANCE_POLICY | Backbone `governance.json` | Project | No universal policy/governance ID proved; route uses `default` | Durable file | Consumed by governance mutation and publishing checks | No expiration/freshness semantics proved | Policy-update event | `IMPLEMENTED_PATH`, `PARTIAL` | HIGH |
| Governance-related records | Separate policy, approvals, tasks, events, notifications, queues, and overrides | Project | No root ID | Federated files | No aggregate invariant proved | No aggregate freshness model proved | FRAGMENTED_AUDIT_EVIDENCE | `FEDERATED_GOVERNANCE_RELATED_RECORDS=IMPLEMENTED_PATH`; `GOVERNANCE_AGGREGATE_ROOT=MISSING`; `GOVERNANCE_ROOT_ID=MISSING`; `GOVERNANCE_AGGREGATE_INVARIANT=MISSING` | HIGH |
| DURABLE_APPROVAL_RECORD | Backbone approval record | Project | `approval.id` is DURABLE_APPROVAL_RECORD_ID; subject is `entity_type` + `entity_id`; action is `requested_action` | `approvals.json` | Used by mutation gates | No expiration/freshness semantics proved | History, event, queue, notification | `IMPLEMENTED_PATH` | HIGH |
| Approval decision | Status fields on approval record | Project | No decision ID; actor string | Same approval record | `approved`/`overridden` can satisfy gates | None | Decision history/event | `PARTIAL` | HIGH |
| Reviewer | `reviewer`, `reviewer_role`, ownership projection | Project record | REVIEWER_ROLE_METADATA and DECISION_ACTOR_LABEL | Approval record | No authenticated reviewer authority resolver proved | N/A | `decided_by` string | `PARTIAL` | HIGH |
| Lifecycle linkage | SHA-256 over project/action/entity/route/method/payload hash | Project/action request | MUTATION_APPROVAL_FINGERPRINT, INTENDED_ACTION_LINK, PROVISIONAL_EXECUTION_LINK | Approval record | Exact reuse in lifecycle-gate path | No freshness or consumption check proved | Request summary/hash | `IMPLEMENTED_PATH`; no idempotency, consumption, success, or universal correlation guarantee | HIGH |
| Selector approval | Optional approval ID/entity/action selector | Project | One or more selector fields | Reads approvals | Newest approved/overridden match | No age check | Approval ID returned in transient decision | `PARTIAL` | HIGH |
| Mutation policy decision | `decideGovernanceMutation` object | Request | Action and optional approval selectors | Process lifetime only | Yes at installed call sites | Request lifetime | Denial app log | `PROCESS_LIFETIME_ONLY` | HIGH |
| Write authorization | Control write key | Process/environment + request | Shared key; no subject ID | Environment/config only | Yes on sensitive mutations | No user/session freshness model proved | Denial app log | `IMPLEMENTED_PATH` | HIGH |
| Route permission metadata | Route catalog `requiredAccess`, `requiredScope` | Route | Route/method; no subject | Code constants | ROUTE_ACCESS_CLASSIFICATION and ROUTE_SCOPE_CLASSIFICATION are not principal permission resolution | N/A | Suggested audit event string | `PARTIAL` | HIGH |
| Protected-route approval proof | `x-mh-approval-id` or body/query value | Request | APPROVAL_PROOF_FLAG; not DURABLE_APPROVAL_RECORD_ID validation | Request only | Presence-based where middleware installed | No freshness validation | Decision proof booleans | `PROCESS_LIFETIME_ONLY` | HIGH |
| Manual/owner/review proof | Header/body/query booleans | Request | REQUEST_PROOF_FLAG; no durable proof ID | Request only | Presence-pattern based | None | Decision proof booleans | `PROCESS_LIFETIME_ONLY` | HIGH |
| Provider authorization | Provider classifier options | Request | Action/provider/scope strings | Process only | Indirect within runtime security | None | Audit event string | `PARTIAL` | HIGH |
| Browser confirmation | `window.confirm` | Browser interaction | No confirmation ID/subject | Not durable | Frontend only | Immediate interaction | None | `FRONTEND_ONLY` | HIGH |
| Risk | Approval string, policy list, route/provider enums, setup classifier | Mixed | No universal risk ID | Mixed | Action-specific | None | Mixed flags/logs | `PARTIAL` | HIGH |
| Escalation | Approval status + chain + task | Project | Approval/task IDs | Durable | Decision-specific | No timeout trigger proved | History/event/task | `PARTIAL` | HIGH |
| Override | Approval `overridden` + active override entry | Project | Approval ID + override ID | Approval and policy files | Approved selectors accept override | No expiry | Policy event + histories | `IMPLEMENTED_PATH`, `PARTIAL` | HIGH |
| Approval expiration/freshness | No enforcement proved in inspected current-HEAD owners and consumers | — | — | — | No proved enforcement | Timestamps are not freshness | — | `UNKNOWN_REQUIRES_PROOF` based on repository-wide negative evidence from the verified Phase 1A-6 inspection | HIGH |
| Approval revocation | No durable revocation path proved in inspected writers, routes, and consumers | — | — | — | No proved enforcement | — | — | `UNKNOWN_REQUIRES_PROOF` based on repository-wide negative evidence from the verified Phase 1A-6 inspection | HIGH |
| Approval replay/retry | Reuse exists; consumption/idempotency absent | Project/request | Fingerprint or selectors | Approval persists | Same approval may satisfy later match | No freshness bound | No execution-consumption lineage | `PARTIAL` | HIGH |

## Action Approval Matrix

Source: `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:25-100`.

| Action family | Actions | High risk | Approval default | Policy/freeze behavior | Gate maturity |
| --- | --- | --- | --- | --- | --- |
| Publishing schedule/state | `publishing_schedule`, `publishing_reschedule`, `publishing_fail` | Yes | No | Freeze-sensitive | `IMPLEMENTED_PATH` |
| Publishing readiness/execution | `publishing_ready`, `publishing_publish` | Yes | Yes | Freeze-sensitive | `IMPLEMENTED_PATH` |
| Approval decision | `approvals_decision` | No | No | Non-recursive | `IMPLEMENTED_PATH` |
| Governance policy update | `governance_policy_update` | Yes | No | Non-recursive; not freeze-sensitive | `IMPLEMENTED_PATH` |
| Workflow/AI | `workflow_run`, `ai_workflow_run`, `ai_command_run`, `ai_chat_run`, `ai_guidance_run` | Yes | Yes | No freeze rule | `IMPLEMENTED_PATH` |
| Integration prepare | `integration_connect`, `integration_test` | Yes | No | Governance only | `IMPLEMENTED_PATH` |
| Integration mutations | `integration_reconnect`, `integration_sync`, `integration_import_history`, `integration_disconnect` | Yes | Yes | Governance + approval | `IMPLEMENTED_PATH` |
| Native/provider execution | `native_media_generate`, execution package actions | Yes | Yes | Publish package is freeze-sensitive | `IMPLEMENTED_PATH` |
| Team/source admin | `team_model_mutation`, `source_registry_mutation` | Yes | Policy-controlled | Dedicated approval/block keys | `IMPLEMENTED_PATH` |
| Project setup | `project_setup_mutation` | Payload-dependent | Only authority-sensitive payloads by default | Dedicated approval/block key | `IMPLEMENTED_PATH`, `PARTIAL` |
| Uncataloged action | Any action absent from GOVERNANCE_ACTION_RULES | Catalog supplies no governance rule | Catalog supplies no approval rule | This catalog returns `requiresGovernance=false` | `UNKNOWN_ACTION_COVERAGE_GAP`: other middleware, write-key enforcement, route classification, and call-site-specific guards may still apply |

## Approval State Matrix

| State | Persisted | Accepted as positive gate proof | Lifecycle written by decision | Linked-entity effect | Terminality enforced |
| --- | --- | --- | --- | --- | --- |
| `pending` | Yes | No | `requested` at creation | Content/media pending review | No |
| `approved` | Yes | Yes | `decided` | Content approved; media approved; publishing ready | No |
| `overridden` | Yes | Yes | `decided` | Similar positive linked effect + active override | No |
| `rejected` | Yes | No; lifecycle request path returns rejected | `decided` | Content/media rejected-like state | No |
| `changes_requested` | Yes | No; lifecycle request path treats it as pending | `decided` | Content/media changes state | No |
| `escalated` | Yes | No; lifecycle request path treats it as pending | `escalated` | Creates governance task | No |
| `cancelled` | Yes | No; lifecycle request path treats it as pending | `decided` | Domain-specific fallback state | No |

Documentation labels: `APPROVAL_STATUS_VOCABULARY_IMPLEMENTED`; `APPROVAL_STATUS_MUTATION_IMPLEMENTED`; `APPROVAL_STATE_MACHINE_NOT_PROVED`; `APPROVAL_TERMINALITY_NOT_PROVED`; `APPROVAL_TRANSITION_GUARDS_NOT_PROVED`.

Positive gate proof is path-specific. `approved` is not execution success; `cancelled` is not revocation; `overridden` is not time-bounded authority. The inspected decision writer accepts any listed decision for an existing record without a proved universal transition guard (`runtime/orchestrator-service/lib/ops/backbone.js:2762-2781`).

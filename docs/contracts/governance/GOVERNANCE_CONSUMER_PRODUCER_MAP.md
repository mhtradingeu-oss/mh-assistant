# Governance / Approval Consumer / Producer Map (Phase 1A-6)

“This Phase 1A-6 inventory freezes observed governance, approval, policy, permission, reviewer, risk, confirmation, decision, execution-gate, mutation-gate, escalation, authorization, and audit vocabulary and records recommendations only. It does not approve IDs, state machines, authority models, expiration or freshness rules, migrations, schemas, registries, or runtime changes.”

| Producer | Produced record / decision | Storage or lifetime | Consumers | Consumer behavior | Boundary / confidence |
| --- | --- | --- | --- | --- | --- |
| Backbone initialization | PROJECT_GOVERNANCE_POLICY defaults | Project `ops/governance.json` | Policy reader, summary builder, mutation/publishing gates | Supplies safe defaults and project settings | Backend authority; HIGH |
| `updateGovernancePolicy` | Merged project policy | Durable governance file | Governance summary, mutation gates, publishing guards, frontend API | Changes policy and emits event | No version/inheritance; HIGH |
| Governance console / Settings page | Policy patch | HTTP request | Governance policy route | Browser confirms, backend persists | Confirmation is frontend-only; HIGH |
| `createApproval` | DURABLE_APPROVAL_RECORD | Project `ops/approvals.json` | Approval list/summary, governance gate, linked entities, queue/UI | Persists subject/action/owner/risk; `approval.id` is DURABLE_APPROVAL_RECORD_ID only | Backend authority; HIGH |
| Governance lifecycle gate | MUTATION_APPROVAL_FINGERPRINT plus INTENDED_ACTION_LINK and PROVISIONAL_EXECUTION_LINK | Durable approval + request response | Retried same mutation, Governance UI | Reuses matching request; path-specifically allows approved | No expiry, consumption, idempotency, success, or universal correlation proof; HIGH |
| Governance console and other pages | Approval create/decision payload | HTTP request | Approval routes | Browser confirms then invokes backend | Actor/reviewer strings are not authenticated identity; HIGH |
| `decideApproval` | Updated APPROVAL_STATUS | Same DURABLE_APPROVAL_RECORD | Gate lookup, linked entities, queues, summary | Positive states can authorize on specific paths; other states block/pending | No universal transition, terminality, or authenticated-authority validation proved; HIGH |
| `decideApproval` escalation branch | Governance task | `ops/tasks.json` | Task Center/Governance summary | Routes escalation follow-up | Not timeout-driven; HIGH |
| `decideApproval` override branch | GOVERNANCE_OVERRIDE_RECORD plus `overridden` APPROVAL_STATUS | Project `governance.json` and approval record | Governance summary and cited policy consumers | Records override alongside positive decision | No expiration rule, revocation route, one-time consumption, universal authority model, or equal effect across all consumers was proved; HIGH |
| `decideGovernanceMutation` | Transient allow/deny object | Request/process | Server gate wrapper | Stops or permits route handler | Not a durable decision record; HIGH |
| Server lifecycle wrapper | 403 approval response or route continuation | Request | Frontend/API caller | Creates/reuses durable request when needed | Approval does not equal execution result; HIGH |
| Runtime security middleware | CONTROL_WRITE_AUTHORIZATION allow/deny | Request | Sensitive mutation routes | Requires configured matching write key | Shared key, not RBAC; HIGH |
| Route permission catalog | ROUTE_ACCESS_CLASSIFICATION / ROUTE_SCOPE_CLASSIFICATION / risk | Code/process | Runtime security and diagnostics | Supplies `requiredAccess` and `requiredScope` metadata | Neither field proves principal permission resolution; HIGH |
| Protected-route authority | APPROVAL_PROOF_FLAG / REQUEST_PROOF_FLAG decision | Request | Routes installing middleware | Checks approval/manual/owner/review proof presence | Does not validate DURABLE_APPROVAL_RECORD; HIGH |
| Provider execution catalog | Provider/risk/decision classification | Code/process | Runtime security | Adds provider gating decision | Classifier vocab differs from governance; HIGH |
| Backbone summary builder | Governance review projection | Response | Governance page, operations projection | Aggregates approvals, flags, overrides, escalations, events | Projection, not new authority; HIGH |
| Authority projection helper | Safe frontend reads | Browser state | Control Center pages | Reads backend operations payload | Explicitly projection-only; HIGH |
| AI-team operating contract | Frontend role and forbidden-action model | Browser module | AI Command/UI | Limits presented role outputs | Not backend reviewer authority; HIGH |
| Approval history, governance events, notifications, approval queue, linked history, active overrides, application/scheduler logs, execution results, route denials | FRAGMENTED_AUDIT_EVIDENCE | Separate stores and lifetimes | Governance/operations pages and operators | Displays decisions, routing, execution, or denial evidence by source | No completeness, immutability, universal retention/correlation, or compliance certification proved; HIGH |
| Server application logger | Gate denial evidence | Application log lifetime/config | Operators | Logs reason/code/context | Audit-only; retention unproved; MEDIUM |
| Backend validators | Test assertions and mocks | Test process/source | Developers | Check intended behavior when executed | `NOT_CERTIFIED` in Phase 1A-6; HIGH |

## End-to-End Implemented Lifecycle Path

1. A sensitive route passes write-key enforcement.
2. The route invokes governance policy or lifecycle gating.
3. Lifecycle gating calculates a redacted payload hash and approval fingerprint.
4. If no matching approval exists, it creates a durable pending approval and returns HTTP 403.
5. A frontend/backend caller submits a decision to the non-recursive approval decision route.
6. A retried identical mutation finds the matching approved approval and proceeds.
7. Execution success or failure remains owned by the downstream route; it is not the approval decision.

Evidence: `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js:60-155`; `runtime/orchestrator-service/lib/security/governance-mutation-gate.js:248-454`; `runtime/orchestrator-service/server.js:15829-15896`; `runtime/orchestrator-service/lib/ops/backbone.js:2567-2953`.

## Non-Universal Parallel Paths

- Direct selector gate: matches approved/overridden approval by supplied approval/entity/action selectors; fingerprint is not required.
- Protected-route authority: accepts proof presence without durable lookup.
- Provider gate: accepts classifier booleans, which runtime security currently derives from write-key authorization.
- Publishing guard: also has domain-specific approval lookup and policy checks in `runtime/orchestrator-service/server.js:15898-15925` and the immediately following `assertPublishingMutationAllowed` body.
- Frontend confirmations: stop a browser interaction but produce no durable confirmation evidence.

These paths must not be represented as one current contract.

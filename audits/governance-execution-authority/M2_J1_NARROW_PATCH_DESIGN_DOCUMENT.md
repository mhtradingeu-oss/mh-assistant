# M2-J1 — Narrow Patch Design Document

## 0. Design Status

Status: NARROW PATCH DESIGN RECORDED
Phase: M2-J — Narrow Backend Guard Enforcement Patch
Mode: design + patch boundary only
Runtime changes: none
UI changes: none
Backend behavior changes: none
Provider behavior changes: none
Publishing behavior changes: none
Ads behavior changes: none
CRM/customer send changes: none

## 1. Purpose

M2-J1 converts the M2-J0 truth scan and the M2-I enforcement plan into a precise implementation design.

M2-J1 does not apply code changes.

M2-J1 exists to prevent broad or blind backend patches.

## 2. Prior Decisions

M2-H decided:

- M2 cannot close with documentation-only confidence.
- A narrow backend guard patch phase is required before M2 closeout.

M2-I decided:

- Backend guard enforcement planning is required.
- M2-J must be scoped, route-aware, and validation-first.
- M2-J must not patch all mutating routes blindly.

M2-J0 decided:

- Truth scan is required before any patch.
- M2-J0 does not close M2.
- Do not patch blindly.

## 3. Route Table Basis

Source artifact:

`audits/governance-execution-authority/M2_G_PROTECTED_BACKEND_ROUTE_TABLE.json`

Source file analyzed:

`runtime/orchestrator-service/server.js`

Source SHA-256:

`3f161834fd0f2abebacea9c1d4109f292a3a46b0f518186f3da945f44d396136`

| Metric | Count |
|---|---:|
| Total protected routes | 237 |
| Total mutating routes | 114 |
| Total read routes | 123 |
| Total high-risk routes | 100 |
| Mutating routes without guard signals | 80 |
| High-risk routes without guard signals | 66 |

## 4. Narrow Patch Principle

M2-J1 approves a design for a narrow backend guard patch.

It does not approve a broad rewrite.

It does not approve a full route refactor.

It does not approve frontend changes.

It does not approve provider behavior changes.

It does not approve new live publishing, ads, CRM, customer send, or provider execution.

## 5. Recommended Patch Shape

M2-J2 should add one small backend guard utility and call it only from selected high-risk mutating routes.

Recommended file:

`runtime/orchestrator-service/lib/security/protected-route-authority.js`

Recommended exported function:

`enforceProtectedRouteAuthority(req, res, routeAuthority)`

Recommended support exports:

- `PROTECTED_ROUTE_AUTHORITY_LEVELS`
- `PROTECTED_ROUTE_ERROR_CODES`
- `isProtectedRouteAllowed`

## 6. Guard Contract

Recommended input:

```js
{
  routeId: "media.asset.delete",
  authority: "manual_execution_only",
  category: "destructive_or_disconnect",
  forbiddenAction: "delete_record",
  allowReviewOutput: false,
  allowPublicMirror: false,
  allowWithoutProof: false
}
```

Recommended return:

```js
{
  allowed: false,
  status: 409,
  code: "PROTECTED_ROUTE_MANUAL_EXECUTION_REQUIRED",
  message: "This protected backend route requires manual owner execution context."
}
```

## 7. Guard Behavior

The guard must:

- never mutate data itself
- never call providers
- never publish
- never send customer replies
- never launch ads
- never sync providers
- never approve itself
- never downgrade authority
- never silently allow public mirror mutation
- block protected mutation when proof is absent
- return structured error codes
- preserve read-only routes
- preserve review-only routes when explicitly allowlisted

## 8. Required Proof Signals

M2-J2 may allow a protected route only when one of these proof signals is present:

- explicit manual owner execution context
- explicit backend approval context
- explicit review-output allowlist
- explicit read-only allowlist

M2-J2 must not treat frontend UI state alone as proof.

## 9. Phase 1 Patch Scope

M2-J2 should focus only on Phase 1 routes.

Phase 1 route count:

71

Phase 1 route groups:

- destructive/delete/disconnect routes
- integration connect/sync/reconnect/test/import-history/disconnect routes
- AI command / AI chat / AI guidance / AI workflow run routes
- workflow run / scheduler / execution feedback routes
- publishing clone/blog/rollback lifecycle routes
- public mirror versions of the above

## 10. Phase 1 Candidate Routes

| Method | Path | Lines | Categories | Guard Signals | Classification |
|---|---|---:|---|---:|---|
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | 11238-11289 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/assets/:assetId/delete` | 11345-11374 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard |
| DELETE | `/media-manager/project/:project/assets/:assetId` | 11376-11405 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard |
| DELETE | `/media-manager/project/:project/sources/:sourceType` | 12930-12967 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, destructive_or_disconnect | 3 | protected-lifecycle-with-visible-guard-signals |
| DELETE | `/public/media-manager/project/:project/sources/:sourceType` | 12969-13006 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, destructive_or_disconnect | 3 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/integrations/:integrationId/disconnect` | 13639-13641 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/disconnect` | 13643-13645 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/execute_publish_package` | 9826-9912 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals |
| POST | `/execute_email_package` | 9914-10000 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals |
| POST | `/generate_media_from_prompt` | 10002-10081 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 3 | provider-execution-needs-review |
| POST | `/build_ad_execution_package` | 10083-10167 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals |
| POST | `/backup-and-clone-product/:id` | 10319-10401 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | 10403-10516 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/workflows/:workflowId/run` | 12138-12214 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals |
| POST | `/public/media-manager/project/:project/workflows/:workflowId/run` | 12139-12214 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/native-media/generate` | 13573-13583 | integration_provider_state, media_provider_generation | 0 | provider-execution-needs-review |
| POST | `/media-manager/project/:project/integrations/:integrationId/connect` | 13579-13583 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/connect` | 13585-13589 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/integrations/:integrationId` | 13591-13595 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/integrations/:integrationId` | 13597-13601 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/integrations/:integrationId/reconnect` | 13603-13607 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/reconnect` | 13609-13613 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/integrations/:integrationId/test` | 13615-13617 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/test` | 13619-13621 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/integrations/:integrationId/sync` | 13623-13625 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/sync` | 13627-13629 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/integrations/:integrationId/import-history` | 13631-13633 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/import-history` | 13635-13637 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/telegram-command` | 16331-16491 | integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 0 | provider-execution-needs-review |
| POST | `/publish-clone/:cloneId` | 22275-22316 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/replace-original-product/:originalId/:cloneId` | 22318-22405 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/cleanup-clone/:cloneId` | 22407-22452 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/publish-blog/:draftId` | 22454-22558 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/rollback-product/:productId` | 22560-22626 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/run_scheduler_worker_once` | 23080-23208 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 2 | provider-execution-needs-review |
| POST | `/generate_optimization_recommendations` | 23301-23327 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 1 | provider-execution-needs-review |
| POST | `/api/media/improve-prompt` | 23329-23357 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate |
| POST | `/api/media/brand-check` | 23359-23387 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate |
| POST | `/api/media/generate-image` | 23389-23417 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate |
| POST | `/api/media/generate-video-brief` | 23419-23447 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate |
| POST | `/api/media/generate-voice-script` | 23449-23477 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate |
| POST | `/api/media/generate-campaign-pack` | 23479-23507 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate |
| POST | `/api/ai-command/project/:project/campaign-preview` | 11691-11702 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/ai/command` | 12482-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/ai/command` | 12483-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/ai/chat` | 12484-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/ai/chat` | 12485-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/ai/guidance` | 12486-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/ai/guidance` | 12487-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/ai/workflows/:workflowId/run` | 12488-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/ai/workflows/:workflowId/run` | 12489-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/media-jobs` | 12017-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/media-jobs` | 12018-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12019-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12026-12032 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/tasks` | 12528-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/tasks` | 12529-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/record_execution_feedback` | 23210-23280 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media/upload` | 10552-10620 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/publishing/schedule` | 13649-13690 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals |
| POST | `/public/media-manager/project/:project/publishing/schedule` | 13692-13733 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/publishing/:jobId/reschedule` | 13735-13772 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals |
| POST | `/public/media-manager/project/:project/publishing/:jobId/reschedule` | 13774-13811 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/publishing/:jobId/ready` | 13813-13843 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals |
| POST | `/public/media-manager/project/:project/publishing/:jobId/ready` | 13845-13875 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/publishing/:jobId/publish` | 13877-13917 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 2 | protected-lifecycle-with-visible-guard-signals |
| POST | `/public/media-manager/project/:project/publishing/:jobId/publish` | 13919-13959 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 2 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/publishing/:jobId/fail` | 13961-14001 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 2 | protected-lifecycle-with-visible-guard-signals |
| POST | `/public/media-manager/project/:project/publishing/:jobId/fail` | 14003-14043 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 2 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/publish/asset` | 23837-23847 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, library_asset_mutation | 1 | protected-lifecycle-with-visible-guard-signals |
| POST | `/media-manager/project/:project/publish/batch` | 23853-23863 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals |

## 11. Phase 2 Deferred Routes

M2-J2 should not patch these unless Phase 1 validation is clean:

- project rename
- project template apply
- campaign local mutation
- content item local mutation
- library refresh/index if proven local-only
- notification read-state mutation
- handoff create/consume if proven internal-only
- media job draft mutations if proven local-only

Reason:

These may be local workspace state operations. They still need review, but they are not the first safest patch target unless they perform external/destructive effects.

## 12. Public Mirror Rule

Any public mirror route that mutates protected state must use the same guard as the private route.

Public routes must not bypass:

- manual_execution_only
- approval_required
- owner_workspace_required
- forbidden_from_ai_command

M2-J2 must test both private and public versions.

## 13. Recommended Error Codes

| Code | Status | Meaning |
|---|---:|---|
| PROTECTED_ROUTE_APPROVAL_REQUIRED | 409 | Route requires approval proof |
| PROTECTED_ROUTE_MANUAL_EXECUTION_REQUIRED | 409 | Route requires manual owner execution context |
| PROTECTED_ROUTE_FORBIDDEN_ACTION | 403 | Route maps to forbidden backend action |
| PROTECTED_ROUTE_PUBLIC_MIRROR_BLOCKED | 403 | Public mirror mutation is not allowed without proof |
| PROTECTED_ROUTE_PROVIDER_EXECUTION_REVIEW_REQUIRED | 409 | Provider execution requires review/approval boundary |
| PROTECTED_ROUTE_DESTRUCTIVE_ACTION_BLOCKED | 403 | Destructive action blocked without proof |

## 14. Integration With Existing Security Files

M2-J2 must not delete or rewrite:

- `governance-mutation-gate.js`
- `runtime-security-enforcement.js`

M2-J2 may import the new helper in `server.js`.

If existing utilities already expose compatible checks, M2-J2 may wrap or reuse them.

If existing utilities are frontend/governance-policy oriented but not route-blocking, M2-J2 should keep the new helper separate and minimal.

## 15. Validation Requirements After Patch

M2-J2 must run:

- `node --check runtime/orchestrator-service/server.js`
- `node --check runtime/orchestrator-service/lib/security/protected-route-authority.js`
- `node --check runtime/orchestrator-service/lib/security/governance-mutation-gate.js`
- `node --check runtime/orchestrator-service/lib/security/runtime-security-enforcement.js`
- AI Team Operating Contract validation
- AI Team Contract Conformance check
- route table rebuild
- before/after route table summary
- targeted smoke proof for private protected route
- targeted smoke proof for public mirror protected route
- targeted smoke proof that read-only routes are not changed

## 16. Commit Boundary for M2-J2

Allowed files for M2-J2:

- `runtime/orchestrator-service/lib/security/protected-route-authority.js`
- `runtime/orchestrator-service/server.js`
- `audits/governance-execution-authority/M2_J2_*.md`
- optionally one audit script if needed

Not allowed in M2-J2:

- frontend page rewrites
- provider implementation rewrites
- publishing behavior rewrite
- ads behavior rewrite
- CRM/customer operation rewrite
- broad server refactor
- route table generator rewrite unless required for validation only

## 17. M2-J1 Decision

M2-J1 approves the design only.

M2-J1 does not patch code.

M2-J1 does not close M2.

Next approved step:

`M2-J2 — Minimal Protected Route Authority Helper Patch`

M2-J2 must be narrow, validation-first, and reversible.

## 18. Safety Rules

Do not patch blindly.

Do not use broad sed rewrites.

Do not use git add dot.

Do not weaken AI Command handoff-only authority.

Do not add live publish/send/ads/CRM/provider execution.

Do not remove manual confirmations.

Do not close M2 before M2-J2 is validated or rejected with proof.



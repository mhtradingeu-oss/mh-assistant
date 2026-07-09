# M2-I — Backend Guard Enforcement Plan

## 0. Plan Status

Status: BACKEND GUARD ENFORCEMENT PLAN RECORDED
Phase: M2 — Governance + Execution Authority
Mode: planning + proof only
Runtime changes: none
UI changes: none
Backend behavior changes: none
Provider execution changes: none
Publishing behavior changes: none
Ads execution changes: none
CRM/customer send changes: none

## 1. Purpose

M2-I translates the M2-H patch decision into a narrow backend guard enforcement plan.

M2-I does not apply code changes.

M2-I defines the smallest safe route enforcement strategy needed before M2 closeout.

## 2. Prior Decision

M2-H recorded:

- M2 cannot close now.
- A narrow backend guard patch phase is required before M2 closeout.
- Do not patch blindly.
- The next phase is M2-I — Backend Guard Enforcement Plan.

M2-I accepts that decision and creates a concrete patch boundary.

## 3. Route Table Basis

Source artifact:

`audits/governance-execution-authority/M2_G_PROTECTED_BACKEND_ROUTE_TABLE.json`

Source file analyzed:

`runtime/orchestrator-service/server.js`

Source SHA-256:

`3f161834fd0f2abebacea9c1d4109f292a3a46b0f518186f3da945f44d396136`

Summary:

| Metric | Count |
|---|---:|
| Total protected routes | 237 |
| Total mutating routes | 114 |
| Total read routes | 123 |
| Total high-risk routes | 100 |
| Mutating routes without guard signals | 80 |
| High-risk routes without guard signals | 66 |

## 4. Enforcement Problem

The route table proves that the backend route surface is larger than the frontend authority model.

The frontend governance contract is strong, but M2 cannot rely on frontend-only control.

Backend enforcement must protect:

- private routes
- public mirror routes
- workflow/job execution routes
- AI command routes
- integration/provider state routes
- publishing lifecycle routes
- approval/governance mutation routes
- destructive/delete/disconnect routes
- customer/CRM/send related routes
- ads/budget/spend related routes
- provider execution routes

## 5. Route Groups

| Group | Count |
|---|---:|
| High-risk without visible guard | 66 |
| High-risk with visible guard | 34 |
| Mutating without visible guard | 80 |
| Read-only routes | 123 |
| Public mirror routes | 85 |
| Public high-risk without visible guard | 18 |
| Private high-risk without visible guard | 48 |
| Provider execution candidate routes | 11 |
| Destructive/disconnect routes | 7 |
| Integration/provider state routes | 59 |
| Workflow/job/queue execution routes | 120 |
| AI command/AI workflow routes | 19 |
| Approval/governance routes | 59 |
| Publishing lifecycle routes | 159 |
| Customer/CRM/ticket/send routes | 180 |
| Ads/budget/spend routes | 58 |
| Library/asset mutation routes | 15 |

## 6. Guard Strategy

M2-I recommends a narrow backend guard layer that is route-aware but not invasive.

The guard should be introduced as a small helper in `server.js` or a small security utility, then called only by selected protected mutating routes.

The strategy has four outcomes:

### 6.1 allow-read

For read-only routes.

Behavior:

- no patch required
- do not block
- document as read-only

### 6.2 allow-review-output

For provider/media/AI routes that only create local draft/review artifacts.

Behavior:

- allow only when output is review-oriented
- must not publish/send/launch/sync/delete externally
- should record audit metadata if available

### 6.3 approval-required

For protected lifecycle mutations.

Behavior:

- route may prepare draft/handoff/request
- route must not perform forbidden action without approval proof
- if approval proof is absent, return a safe 403/409 response with clear code

### 6.4 manual-execution-only / owner-workspace-required

For workflow/job/scheduler, AI workflow run, integration sync/disconnect, publishing, destructive routes.

Behavior:

- route requires explicit manual owner context or approved backend execution context
- public mirror routes must not bypass the same rule
- AI Command cannot be treated as automatic execution authority

## 7. Forbidden Action Boundary

Backend guard must block or require approval for:

- publish
- send_customer_reply
- send_email
- approve
- reject_approval
- launch_ads
- change_budget
- mutate_crm
- change_ticket_status
- assign_conversation
- run_provider_execution
- run_backend_job
- override_governance
- sync_provider
- delete_record

These match the existing authority model and must not be relaxed.

## 8. Minimal Patch Shape for M2-J

M2-I recommends M2-J as a narrow patch phase.

Patch shape:

1. Add a small route guard helper.
2. Add a route-to-authority map for only protected mutating routes.
3. Apply the helper only to the highest-risk route groups first.
4. Preserve all read-only routes.
5. Preserve local draft/review generation where intentionally allowed.
6. Preserve existing confirmations and frontend behavior.
7. Add audit-oriented response codes without breaking callers silently.
8. Validate syntax and route table counts after patch.

## 9. Proposed Guard Helper Contract

Recommended helper name:

`enforceProtectedRouteAuthority(req, routeAuthority)`

Recommended input:

```js
{
  routeId: "media.asset.delete",
  authority: "manual_execution_only",
  category: "destructive_or_disconnect",
  forbiddenAction: "delete_record",
  allowReviewOutput: false,
  allowReadOnly: false,
  allowPublicMirror: false
}
```

Recommended behavior:

- require project context when needed
- detect public mirror route and apply same authority
- block forbidden actions unless explicit approved/manual context is present
- return structured error codes
- never auto-approve
- never downgrade authority
- never call providers
- never mutate data itself
- only decide whether the route may proceed

## 10. Recommended Error Codes

| Code | Meaning |
|---|---|
| PROTECTED_ROUTE_APPROVAL_REQUIRED | Route needs approval before mutation |
| PROTECTED_ROUTE_MANUAL_EXECUTION_REQUIRED | Route requires manual owner execution context |
| PROTECTED_ROUTE_FORBIDDEN_ACTION | Route maps to a forbidden action |
| PROTECTED_ROUTE_PUBLIC_MIRROR_BLOCKED | Public mirror cannot perform protected mutation |
| PROTECTED_ROUTE_PROVIDER_EXECUTION_REVIEW_REQUIRED | Provider execution requires review boundary |
| PROTECTED_ROUTE_DESTRUCTIVE_ACTION_BLOCKED | Delete/destructive action blocked without proof |

## 11. M2-J Patch Priority

M2-J should not attempt to patch all 114 mutating routes at once.

Priority 1:

- destructive/delete/disconnect routes
- integration sync/disconnect/reconnect/test/import-history
- AI workflow run / AI command / AI chat routes
- workflow/job execution routes
- publishing lifecycle routes

Priority 2:

- asset mutation routes
- media jobs mutation routes
- task creation/mutation routes
- handoff consume routes
- notification mutation routes
- execution feedback mutation routes

Priority 3:

- campaign/content local draft mutation routes
- project rename/template setup routes
- local library refresh/index routes

## 12. Highest Priority Candidate Routes

| Method | Path | Lines | Categories | Guard Signal Count | Classification | Next Action |
|---|---|---:|---|---:|---|---|
| POST | `/task` | 9752-9769 | approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/api/agent-registry/register` | 9771-9792 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/api/agent-registry/resolve` | 9772-9792 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/ingest` | 9810-9824 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/backup-and-clone-product/:id` | 10319-10401 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | 10403-10516 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media/upload` | 10552-10620 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/assets/:assetId/rename` | 11208-11236 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | 11238-11289 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/assets/:assetId/source-of-truth` | 11292-11315 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/assets/:assetId/archive` | 11317-11343 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/assets/:assetId/delete` | 11345-11374 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| DELETE | `/media-manager/project/:project/assets/:assetId` | 11376-11405 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/library/refresh` | 11407-11415 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/api/ai-command/project/:project/campaign-preview` | 11691-11702 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/team` | 11838-11854 | publishing_lifecycle, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/team` | 11839-11854 | publishing_lifecycle, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/media-jobs` | 12017-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/media-jobs` | 12018-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12019-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12026-12032 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/command` | 12482-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/command` | 12483-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/chat` | 12484-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/chat` | 12485-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/guidance` | 12486-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/guidance` | 12487-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/workflows/:workflowId/run` | 12488-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/workflows/:workflowId/run` | 12489-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/tasks` | 12528-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/tasks` | 12529-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| PATCH | `/media-manager/project/:project/notifications/:notificationId` | 12699-12711 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| PATCH | `/public/media-manager/project/:project/notifications/:notificationId` | 12712-12724 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/handoffs` | 12774-12792 | publishing_lifecycle, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/handoffs` | 12775-12792 | publishing_lifecycle, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/handoffs/:handoffId/consume` | 12776-12792 | publishing_lifecycle, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/handoffs/:handoffId/consume` | 12777-12792 | publishing_lifecycle, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/native-media/generate` | 13573-13583 | integration_provider_state, media_provider_generation | 0 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/media-manager/project/:project/integrations/:integrationId/connect` | 13579-13583 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/connect` | 13585-13589 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId` | 13591-13595 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId` | 13597-13601 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/reconnect` | 13603-13607 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/reconnect` | 13609-13613 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/test` | 13615-13617 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/test` | 13619-13621 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/sync` | 13623-13625 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/sync` | 13627-13629 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/import-history` | 13631-13633 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/import-history` | 13635-13637 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/disconnect` | 13639-13641 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/disconnect` | 13643-13645 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/telegram-command` | 16331-16491 | integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 0 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/publish-clone/:cloneId` | 22275-22316 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/replace-original-product/:originalId/:cloneId` | 22318-22405 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/cleanup-clone/:cloneId` | 22407-22452 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/publish-blog/:draftId` | 22454-22558 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/rollback-product/:productId` | 22560-22626 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/record_execution_feedback` | 23210-23280 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/api/media/improve-prompt` | 23329-23357 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/brand-check` | 23359-23387 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-image` | 23389-23417 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-video-brief` | 23419-23447 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-voice-script` | 23449-23477 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-campaign-pack` | 23479-23507 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/media-manager/project/:project/library/index` | 23633-23656 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |

## 13. Destructive / Disconnect Routes

| Method | Path | Lines | Categories | Guard Signal Count | Classification | Next Action |
|---|---|---:|---|---:|---|---|
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | 11238-11289 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/assets/:assetId/delete` | 11345-11374 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| DELETE | `/media-manager/project/:project/assets/:assetId` | 11376-11405 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| DELETE | `/media-manager/project/:project/sources/:sourceType` | 12930-12967 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, destructive_or_disconnect | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| DELETE | `/public/media-manager/project/:project/sources/:sourceType` | 12969-13006 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, destructive_or_disconnect | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/media-manager/project/:project/integrations/:integrationId/disconnect` | 13639-13641 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/disconnect` | 13643-13645 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |

## 14. Integration / Provider State Routes

| Method | Path | Lines | Categories | Guard Signal Count | Classification | Next Action |
|---|---|---:|---|---:|---|---|
| POST | `/execute_publish_package` | 9826-9912 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/execute_email_package` | 9914-10000 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/generate_media_from_prompt` | 10002-10081 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 3 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/build_ad_execution_package` | 10083-10167 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| GET | `/products` | 10169-10187 | integration_provider_state, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/optimize-product/:id` | 10188-10231 | integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/prepare-product-update/:id` | 10233-10317 | approval_governance, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/backup-and-clone-product/:id` | 10319-10401 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | 10403-10516 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/media/file/:project/:type/:filename` | 10626-10659 | integration_provider_state, customer_crm_ticket_send, library_asset_mutation | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/workflows/:workflowId/run` | 12138-12214 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/public/media-manager/project/:project/workflows/:workflowId/run` | 12139-12214 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| GET | `/media-manager/project/:project/integrations/control-center` | 13201-13221 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/conversations` | 13477-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/conversations` | 13482-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/messages` | 13487-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/messages` | 13492-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/customers` | 13497-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/customers` | 13502-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/sla` | 13507-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/sla` | 13512-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/escalations` | 13517-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/escalations` | 13522-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/native-media/providers` | 13528-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/native-media/providers` | 13529-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/native-media/providers/readiness` | 13530-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/native-media/providers/readiness` | 13531-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/native-media/generate` | 13573-13583 | integration_provider_state, media_provider_generation | 0 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| GET | `/public/media-manager/project/:project/integrations/control-center` | 13577-13583 | integration_provider_state | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/integrations/:integrationId/connect` | 13579-13583 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/connect` | 13585-13589 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId` | 13591-13595 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId` | 13597-13601 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/reconnect` | 13603-13607 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/reconnect` | 13609-13613 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/test` | 13615-13617 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/test` | 13619-13621 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/sync` | 13623-13625 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/sync` | 13627-13629 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/import-history` | 13631-13633 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/import-history` | 13635-13637 | integration_provider_state | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/integrations/:integrationId/disconnect` | 13639-13641 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/integrations/:integrationId/disconnect` | 13643-13645 | integration_provider_state, destructive_or_disconnect | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/generated-output/:project/:filename` | 14123-14146 | integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/telegram-command` | 16331-16491 | integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 0 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/publish-clone/:cloneId` | 22275-22316 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/replace-original-product/:originalId/:cloneId` | 22318-22405 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/cleanup-clone/:cloneId` | 22407-22452 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/publish-blog/:draftId` | 22454-22558 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/rollback-product/:productId` | 22560-22626 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/run_scheduler_worker_once` | 23080-23208 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 2 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| GET | `/get_performance_summary` | 23282-23299 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/generate_optimization_recommendations` | 23301-23327 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 1 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/api/media/improve-prompt` | 23329-23357 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/brand-check` | 23359-23387 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-image` | 23389-23417 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-video-brief` | 23419-23447 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-voice-script` | 23449-23477 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-campaign-pack` | 23479-23507 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |

## 15. AI Command / AI Workflow Routes

| Method | Path | Lines | Categories | Guard Signal Count | Classification | Next Action |
|---|---|---:|---|---:|---|---|
| POST | `/api/ai-command/project/:project/campaign-preview` | 11691-11702 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/media-manager/project/:project/ai/commands` | 12478-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/commands` | 12479-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/ai/commands/:commandId` | 12480-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/commands/:commandId` | 12481-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/ai/command` | 12482-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/command` | 12483-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/chat` | 12484-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/chat` | 12485-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/guidance` | 12486-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/guidance` | 12487-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/workflows/:workflowId/run` | 12488-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/workflows/:workflowId/run` | 12489-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/media-manager/project/:project/ai/artifacts` | 12490-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/artifacts` | 12491-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/ai/recommendations` | 12492-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/recommendations` | 12493-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/ai/memory` | 12494-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/memory` | 12495-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |

## 16. Workflow / Job / Queue Routes

| Method | Path | Lines | Categories | Guard Signal Count | Classification | Next Action |
|---|---|---:|---|---:|---|---|
| POST | `/task` | 9752-9769 | approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/api/agent-registry/register` | 9771-9792 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/api/agent-registry/resolve` | 9772-9792 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/api/agent-registry/agents` | 9773-9792 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/today` | 9778-9792 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/next` | 9794-9808 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/ingest` | 9810-9824 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/execute_publish_package` | 9826-9912 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/execute_email_package` | 9914-10000 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/generate_media_from_prompt` | 10002-10081 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 3 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/build_ad_execution_package` | 10083-10167 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/media-manager/project/:project/setup` | 11417-11454 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/public/media-manager/project/:project/setup` | 11456-11493 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| GET | `/media-manager/project/:project/operations` | 11704-11719 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/operations` | 11705-11719 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/task-center` | 11763-11777 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/task-center` | 11764-11777 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/queue-center` | 11765-11777 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/queue-center` | 11766-11777 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/job-monitor` | 11767-11777 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/job-monitor` | 11768-11777 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/content-items/:contentItemId` | 11967-11985 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/content-items/:contentItemId` | 11968-11985 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/media-jobs` | 12015-12025 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/media-jobs` | 12016-12025 | workflow_job_queue_execution | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/media-jobs` | 12017-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/media-jobs` | 12018-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12019-12025 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12026-12032 | workflow_job_queue_execution | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12033-12049 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12034-12049 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/workflows/runs` | 12051-12066 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/workflows/runs` | 12052-12066 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/workflows/runs/:runId` | 12068-12136 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/workflows/runs/:runId` | 12069-12136 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/workflows/:workflowId/run` | 12138-12214 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/public/media-manager/project/:project/workflows/:workflowId/run` | 12139-12214 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| GET | `/media-manager/project/:project/ai/commands` | 12478-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/commands` | 12479-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/ai/commands/:commandId` | 12480-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/commands/:commandId` | 12481-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/ai/command` | 12482-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/command` | 12483-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/chat` | 12484-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/chat` | 12485-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/guidance` | 12486-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/guidance` | 12487-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/ai/workflows/:workflowId/run` | 12488-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/ai/workflows/:workflowId/run` | 12489-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/media-manager/project/:project/ai/artifacts` | 12490-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/artifacts` | 12491-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/ai/recommendations` | 12492-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/recommendations` | 12493-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/ai/memory` | 12494-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/ai/memory` | 12495-12510 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/tasks` | 12526-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/tasks` | 12527-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/tasks` | 12528-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/public/media-manager/project/:project/tasks` | 12529-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| GET | `/media-manager/project/:project/tasks/:taskId` | 12530-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/tasks/:taskId` | 12543-12555 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/insights/:project` | 12817-12874 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/api/insights/:project` | 12818-12874 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/learning/:project` | 12819-12874 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/api/learning/:project` | 12820-12874 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/sources` | 12822-12874 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| POST | `/public/media-manager/project/:project/sources` | 12876-12928 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| DELETE | `/media-manager/project/:project/sources/:sourceType` | 12930-12967 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, destructive_or_disconnect | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| DELETE | `/public/media-manager/project/:project/sources/:sourceType` | 12969-13006 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, destructive_or_disconnect | 3 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |
| GET | `/api/projects/:project/customer-operations/readiness` | 13315-13319 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/projects/:project/customer-operations/inbox` | 13321-13325 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/projects/:project/customer-operations/conversations` | 13327-13331 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/projects/:project/customer-operations/conversations/:conversationId` | 13333-13337 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/projects/:project/customer-operations/conversations/:conversationId/messages` | 13339-13343 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/projects/:project/customer-operations/customers/:customerId` | 13345-13349 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/projects/:project/customer-operations/tickets` | 13351-13355 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/api/projects/:project/customer-operations/channels` | 13357-13361 | workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/health` | 13364-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/health` | 13369-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/readiness` | 13374-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/readiness` | 13379-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/channels` | 13384-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/channels` | 13389-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/inbox` | 13394-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/inbox` | 13399-13419 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/conversations` | 13477-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/conversations` | 13482-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/messages` | 13487-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/messages` | 13492-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/customers` | 13497-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/customers` | 13502-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/sla` | 13507-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/sla` | 13512-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/customer-operations/escalations` | 13517-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/customer-operations/escalations` | 13522-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/native-media/providers` | 13528-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/native-media/providers` | 13529-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/media-manager/project/:project/native-media/providers/readiness` | 13530-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| GET | `/public/media-manager/project/:project/native-media/providers/readiness` | 13531-13571 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 1 | read-only-safe-candidate | document as read-only or confirm no mutation |
| POST | `/media-manager/project/:project/publishing/schedule` | 13649-13690 | publishing_lifecycle, approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | 1 | protected-lifecycle-with-visible-guard-signals | verify guard is backend-enforced and not copy/comment only |

## 17. Provider Execution Routes

Patch decision:

Do not block all provider routes blindly.

Provider routes must be divided into:

- review-output provider routes
- provider state mutation routes
- provider sync/test/connect/disconnect routes
- provider execution routes that may trigger external effects

Review-output routes may remain allowed if they only persist local review artifacts.

Provider state mutation routes should require manual execution or approval.

| Method | Path | Lines | Categories | Guard Signal Count | Classification | Next Action |
|---|---|---:|---|---:|---|---|
| POST | `/generate_media_from_prompt` | 10002-10081 | publishing_lifecycle, approval_governance, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 3 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/media-manager/project/:project/native-media/generate` | 13573-13583 | integration_provider_state, media_provider_generation | 0 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/telegram-command` | 16331-16491 | integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 0 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/run_scheduler_worker_once` | 23080-23208 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend, media_provider_generation | 2 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/generate_optimization_recommendations` | 23301-23327 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 1 | provider-execution-needs-review | inspect provider side effects and approval requirement |
| POST | `/api/media/improve-prompt` | 23329-23357 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/brand-check` | 23359-23387 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-image` | 23389-23417 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-video-brief` | 23419-23447 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-voice-script` | 23449-23477 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |
| POST | `/api/media/generate-campaign-pack` | 23479-23507 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, media_provider_generation | 0 | provider-execution-review-output-candidate | inspect provider boundary and confirm review-only persistence |

## 18. Public Mirror Route Rule

Any `/public/...` route that mutates protected state must have the same guard as its private equivalent.

Public mirror routes must never be a bypass.

M2-J must specifically test:

- private protected route blocked without proof
- public mirror protected route blocked without proof
- read-only public mirror still allowed
- review-only public route behavior stays unchanged if intentionally allowed

## 19. Required Validation for M2-J

After any M2-J patch:

Run:

- syntax validation
- AI team contract validation
- route table rebuild
- comparison between old and new route table
- smoke tests for blocked protected mutation
- smoke tests for allowed read-only route
- smoke tests for allowed review-output route
- public mirror bypass test

Required files to validate:

- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib/security/governance-mutation-gate.js`
- `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js`
- `public/control-center/api.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/governance.js`
- `public/control-center/pages/publishing.js`
- `public/control-center/pages/ads-manager.js`

## 20. M2-I Decision

M2-I decision:

Backend guard enforcement planning is required and recorded.

M2-I does not close M2.

M2-I does not apply runtime changes.

M2-I approves only a future narrow patch phase:

`M2-J — Narrow Backend Guard Enforcement Patch`

M2-J must be scoped, route-aware, and validation-first.

## 21. Safety Rules

Do not patch blindly.

Do not apply a broad rewrite.

Do not add external publishing.

Do not add ads launch.

Do not add customer send/reply behavior.

Do not add CRM mutation.

Do not add provider execution.

Do not relax forbidden actions.

Do not remove manual confirmations.

Do not weaken AI Command handoff-only authority.

Do not close M2 before M2-J is either validated or formally rejected with proof.



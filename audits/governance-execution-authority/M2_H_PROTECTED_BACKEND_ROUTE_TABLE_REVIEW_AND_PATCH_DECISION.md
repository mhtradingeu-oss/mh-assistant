# M2-H — Protected Backend Route Table Review and Patch Decision

## 0. Decision Status

Status: PATCH DECISION RECORDED
Phase: M2 — Governance + Execution Authority Closeout
Mode: Documentation decision
Runtime changes: none
UI changes: none
Backend behavior changes: none
Provider execution changes: none
Publishing behavior changes: none
Ads execution changes: none
CRM mutation changes: none
Customer reply/send changes: none

## 1. Purpose

M2-H reviews the machine-generated protected backend route table produced in M2-G.

M2-G created:

- `audits/governance-execution-authority/M2_G_PROTECTED_BACKEND_ROUTE_TABLE.json`
- `audits/governance-execution-authority/M2_G_PROTECTED_BACKEND_ROUTE_TABLE.md`

M2-H decides whether M2 can close with documentation only or whether a narrow backend guard patch is required.

## 2. Source Route Table Summary

Route table artifact:

`M2_G_PROTECTED_BACKEND_ROUTE_TABLE.json`

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

## 3. Classification Counts

| Classification | Count |
|---|---:|
| mutating-missing-visible-guard | 14 |
| protected-lifecycle-missing-visible-guard | 58 |
| protected-lifecycle-with-visible-guard-signals | 31 |
| provider-execution-needs-review | 5 |
| provider-execution-review-output-candidate | 6 |
| read-only-safe-candidate | 123 |

## 4. Category Counts

| Category | Count |
|---|---:|
| ads_budget_spend | 58 |
| approval_governance | 59 |
| customer_crm_ticket_send | 180 |
| destructive_or_disconnect | 7 |
| integration_provider_state | 59 |
| library_asset_mutation | 15 |
| media_provider_generation | 26 |
| publishing_lifecycle | 159 |
| workflow_job_queue_execution | 120 |

## 5. Technical Interpretation

M2-H confirms that the backend has a large protected route surface.

The route table found:

- 237 protected routes
- 114 mutating protected routes
- 100 high-risk protected routes
- 66 high-risk routes without visible guard signals

This means M2 cannot close with documentation-only confidence.

Important clarification:

The scanner result does not prove that every route is unsafe.

It proves that backend route-level guard evidence is incomplete and that a narrow guard strategy is required before M2 closeout.

## 6. Read-Only Routes

Read-only candidate routes:

123

Decision:

`read-only-safe-candidate`

Patch decision:

No patch for read-only routes in M2-H.

Reason:

Read-only routes do not directly mutate backend state. They should still remain documented, but they are not the primary patch target.

## 7. Protected Lifecycle Routes With Visible Guard Signals

Protected lifecycle routes with visible guard signals:

31

Decision:

`verify-before-closeout`

Patch decision:

No immediate patch approved in M2-H.

Reason:

Visible terms like governance, approval, risk, or policy appear in route windows, but M2-H cannot assume these are actual backend enforcement checks. They may be real guards, metadata, comments, response text, or policy copies.

Required next action:

M2-I must inspect whether visible guard signals are real backend enforcement logic.

## 8. Protected Lifecycle Routes Missing Visible Guard Signals

Protected lifecycle routes missing visible guard signals:

58

Decision:

`narrow-backend-guard-patch-required`

Patch decision:

A narrow patch phase is required, but M2-H does not apply the patch.

Reason:

These routes are high-risk and mutating, but the M2-G route window did not show obvious backend guard terms.

Representative routes:

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
| POST | `/publish-clone/:cloneId` | 22275-22316 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/replace-original-product/:originalId/:cloneId` | 22318-22405 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/cleanup-clone/:cloneId` | 22407-22452 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/publish-blog/:draftId` | 22454-22558 | publishing_lifecycle, integration_provider_state, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/rollback-product/:productId` | 22560-22626 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/record_execution_feedback` | 23210-23280 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |
| POST | `/media-manager/project/:project/library/index` | 23633-23656 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | 0 | protected-lifecycle-missing-visible-guard | manual review required; possible narrow guard patch candidate |

## 9. Mutating Routes Missing Visible Guard Signals

Mutating routes missing visible guard signals:

14

Decision:

`manual-review-required`

Patch decision:

Do not patch blindly.

Reason:

These routes mutate data but were not classified as high-risk lifecycle routes. They may still require safer validation, owner scoping, or audit logging.

Representative routes:

| Method | Path | Lines | Categories | Guard Signal Count | Classification | Next Action |
|---|---|---:|---|---:|---|---|
| POST | `/media-manager/project/:project/rename` | 10955-10956 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/public/media-manager/project/:project/rename` | 10957-10958 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/media-manager/project/:project/apply-template` | 10959-10960 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/public/media-manager/project/:project/apply-template` | 10961-10962 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/media-manager/projects` | 10963-10964 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/public/media-manager/projects` | 10965-10966 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/media-manager/project/:project/campaigns` | 11886-11894 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/public/media-manager/project/:project/campaigns` | 11887-11894 |  | 0 | mutating-missing-visible-guard | manual review required |
| PATCH | `/media-manager/project/:project/campaigns/:campaignId` | 11888-11894 |  | 0 | mutating-missing-visible-guard | manual review required |
| PATCH | `/public/media-manager/project/:project/campaigns/:campaignId` | 11895-11901 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/media-manager/project/:project/content-items` | 11951-11959 |  | 0 | mutating-missing-visible-guard | manual review required |
| POST | `/public/media-manager/project/:project/content-items` | 11952-11959 |  | 0 | mutating-missing-visible-guard | manual review required |
| PATCH | `/media-manager/project/:project/content-items/:contentItemId` | 11953-11959 |  | 0 | mutating-missing-visible-guard | manual review required |
| PATCH | `/public/media-manager/project/:project/content-items/:contentItemId` | 11960-11966 |  | 0 | mutating-missing-visible-guard | manual review required |

## 10. Provider Execution Routes

Provider execution routes:

11

Decision:

`provider-boundary-review-required`

Patch decision:

No provider patch in M2-H.

Reason:

Some provider routes appear review-output oriented, but provider execution is still execution. M2-H must not assume provider calls are safe until provider boundary and side effects are inspected.

Required next action:

- inspect provider layer side effects
- verify output is review-only
- verify no external publish/send/ads/CRM mutation
- verify persistence is local artifact/draft/review only

## 11. High-Risk Routes Without Guard Signals

High-risk routes without guard signals:

66

Decision:

`highest-priority-patch-candidates`

Patch decision:

M2-H approves a future narrow patch planning phase, not a patch in this document.

Representative routes:

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

## 12. M2-H Patch Decision

M2-H decision:

A narrow backend guard patch phase is required before M2 closeout.

M2-H does not approve a broad rewrite.

M2-H does not approve changing frontend behavior.

M2-H does not approve changing providers.

M2-H does not approve adding live publishing, ads, CRM, customer send, or provider execution.

M2-H does not approve closing M2 yet.

The next phase must be a narrow proof-and-patch planning phase focused on backend route enforcement.

## 13. Required Next Phase

Next approved phase:

M2-I — Backend Guard Enforcement Plan

M2-I must define the smallest safe enforcement strategy for:

1. high-risk mutating routes without guard signals
2. protected lifecycle routes with visible guard signals that need proof
3. provider execution routes
4. workflow/job/scheduler execution routes
5. destructive/delete/disconnect routes
6. public mirror routes
7. AI command / AI chat / AI workflow run routes
8. approval and governance policy mutation routes
9. publishing lifecycle routes
10. integration sync/disconnect/provider state routes

## 14. Patch Boundary for M2-I

M2-I may propose a patch plan, but should not patch blindly.

Patch plan should answer:

- What is the existing backend guard function?
- Is `governance-mutation-gate.js` currently usable for route enforcement?
- Is `runtime-security-enforcement.js` currently usable for route enforcement?
- Which routes require explicit guard calls?
- Which routes are read-only and should be excluded?
- Which routes are provider-review-only and should be allowlisted?
- Which routes are local-maintenance-only and should be allowlisted?
- Which public mirror routes require the same guard as private routes?
- Which routes require audit log only?
- Which routes require hard block?
- Which routes require approval-required?
- Which routes require owner-workspace-required?
- Which routes require manual-execution-only?

## 15. M2 Closeout Decision

M2 cannot close now.

M2 closeout requires one of these outcomes:

1. M2-I proves existing backend enforcement is sufficient and documents it.
2. M2-I creates a narrow patch plan, then M2-J applies and validates the patch.
3. M2-I identifies false positives and produces a verified allowlist with route-level proof.

Until then:

`M2 status: OPEN`

## 16. Safety Rules

Do not patch blindly.

Do not do broad rewrites.

Do not modify UI.

Do not modify AI Command behavior yet.

Do not modify provider behavior yet.

Do not modify publishing behavior yet.

Do not modify ads behavior yet.

Do not modify CRM/customer send behavior yet.

Do not remove manual confirmations.

Do not relax forbidden actions.

Do not close M2 before backend guard enforcement proof or narrow patch validation.



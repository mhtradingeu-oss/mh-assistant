# M2-J4 — Protected Route Authority Rebaseline and Closeout Decision

## 0. Status

Status: REBASELINE RECORDED
Phase: M2-J — Narrow Backend Guard Enforcement Patch
Mode: post-patch rebaseline + closeout decision
Runtime changes in M2-J4: none
UI changes: none
Provider changes: none
Publishing behavior changes: none
Ads/CRM/customer send changes: none

## 1. Purpose

M2-J4 rebaselines backend route authority after M2-J2 added the protected route authority guard and M2-J3 verified helper behavior.

## 2. Patch Under Review

M2-J2 commit:

`83e07a2 Add protected route authority guard`

M2-J3 verification commit:

`c87bfdd Record protected route authority verification`

## 3. Helper Proof

| Proof | Value |
|---|---|
| M2-J2 middleware present | true |
| Protected route import present | true |
| Helper exports present | true |
| Error codes present | true |
| Proof headers present | true |
| Server SHA-256 after M2-J2 | `4cc23bf58f601e896212895eab7b225ce2904dd91c49f1037fb0661315bcb4b0` |
| Helper SHA-256 | `d33a017d9f8ee884bff5e7d4b9a509856db01261bf6d5bea5d5818b74e18efe0` |

## 4. Rebaseline Summary

| Metric | Count |
|---|---:|
| Prior protected routes | 237 |
| Prior mutating routes | 114 |
| Prior high-risk routes | 100 |
| Prior high-risk without guard signals | 66 |
| Prior mutating without guard signals | 80 |
| M2-J2 middleware path patterns | 46 |
| M2-J2 middleware patterns missing from server | 0 |
| Prior route table routes covered by M2-J2 path match | 46 |
| High-risk without guard covered by M2-J2 | 38 |
| High-risk without guard remaining uncovered | 28 |
| Mutating without guard covered by M2-J2 | 38 |
| Mutating without guard remaining uncovered | 42 |
| Destructive prior routes total | 7 |
| Destructive routes covered by M2-J2 | 4 |
| Public high-risk without guard total prior | 18 |
| Public high-risk without guard covered by M2-J2 | 11 |

## 5. Middleware Pattern Completeness

Missing middleware patterns from server:

- none

## 6. Remaining High-Risk Without Guard Coverage From Prior Table

These are not necessarily unsafe after M2-J2.

They require either:

- scanner update to recognize M2-J2 middleware coverage
- false-positive/deferred-route classification
- additional narrow patch in M2-J5 if they are true remaining gaps

| Method | Path | Lines | Categories | Prior Classification |
|---|---|---:|---|---|
| POST | `/task` | 9752-9769 | approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/api/agent-registry/register` | 9771-9792 | workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/api/agent-registry/resolve` | 9772-9792 | workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/ingest` | 9810-9824 | workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/backup-and-clone-product/:id` | 10319-10401 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | 10403-10516 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/media/upload` | 10552-10620 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/assets/:assetId/rename` | 11208-11236 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | 11238-11289 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/assets/:assetId/source-of-truth` | 11292-11315 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/assets/:assetId/archive` | 11317-11343 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/library/refresh` | 11407-11415 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/api/ai-command/project/:project/campaign-preview` | 11691-11702 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/team` | 11838-11854 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/team` | 11839-11854 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/media-jobs` | 12017-12025 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/media-jobs` | 12018-12025 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12019-12025 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12026-12032 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/tasks` | 12528-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/tasks` | 12529-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| PATCH | `/media-manager/project/:project/notifications/:notificationId` | 12699-12711 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| PATCH | `/public/media-manager/project/:project/notifications/:notificationId` | 12712-12724 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/handoffs` | 12774-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/handoffs` | 12775-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/handoffs/:handoffId/consume` | 12776-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/handoffs/:handoffId/consume` | 12777-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/library/index` | 23633-23656 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |


## 7. Remaining Mutating Without Guard Coverage From Prior Table

| Method | Path | Lines | Categories | Prior Classification |
|---|---|---:|---|---|
| POST | `/task` | 9752-9769 | approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/api/agent-registry/register` | 9771-9792 | workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/api/agent-registry/resolve` | 9772-9792 | workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/ingest` | 9810-9824 | workflow_job_queue_execution, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/backup-and-clone-product/:id` | 10319-10401 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | 10403-10516 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/media/upload` | 10552-10620 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/rename` | 10955-10956 |  | mutating-missing-visible-guard |
| POST | `/public/media-manager/project/:project/rename` | 10957-10958 |  | mutating-missing-visible-guard |
| POST | `/media-manager/project/:project/apply-template` | 10959-10960 |  | mutating-missing-visible-guard |
| POST | `/public/media-manager/project/:project/apply-template` | 10961-10962 |  | mutating-missing-visible-guard |
| POST | `/media-manager/projects` | 10963-10964 |  | mutating-missing-visible-guard |
| POST | `/public/media-manager/projects` | 10965-10966 |  | mutating-missing-visible-guard |
| POST | `/media-manager/project/:project/assets/:assetId/rename` | 11208-11236 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | 11238-11289 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/assets/:assetId/source-of-truth` | 11292-11315 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/assets/:assetId/archive` | 11317-11343 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/library/refresh` | 11407-11415 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |
| POST | `/api/ai-command/project/:project/campaign-preview` | 11691-11702 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/team` | 11838-11854 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/team` | 11839-11854 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/campaigns` | 11886-11894 |  | mutating-missing-visible-guard |
| POST | `/public/media-manager/project/:project/campaigns` | 11887-11894 |  | mutating-missing-visible-guard |
| PATCH | `/media-manager/project/:project/campaigns/:campaignId` | 11888-11894 |  | mutating-missing-visible-guard |
| PATCH | `/public/media-manager/project/:project/campaigns/:campaignId` | 11895-11901 |  | mutating-missing-visible-guard |
| POST | `/media-manager/project/:project/content-items` | 11951-11959 |  | mutating-missing-visible-guard |
| POST | `/public/media-manager/project/:project/content-items` | 11952-11959 |  | mutating-missing-visible-guard |
| PATCH | `/media-manager/project/:project/content-items/:contentItemId` | 11953-11959 |  | mutating-missing-visible-guard |
| PATCH | `/public/media-manager/project/:project/content-items/:contentItemId` | 11960-11966 |  | mutating-missing-visible-guard |
| POST | `/media-manager/project/:project/media-jobs` | 12017-12025 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/media-jobs` | 12018-12025 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12019-12025 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12026-12032 | workflow_job_queue_execution | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/tasks` | 12528-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/tasks` | 12529-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| PATCH | `/media-manager/project/:project/notifications/:notificationId` | 12699-12711 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| PATCH | `/public/media-manager/project/:project/notifications/:notificationId` | 12712-12724 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/handoffs` | 12774-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/handoffs` | 12775-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/handoffs/:handoffId/consume` | 12776-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/public/media-manager/project/:project/handoffs/:handoffId/consume` | 12777-12792 | publishing_lifecycle, customer_crm_ticket_send | protected-lifecycle-missing-visible-guard |
| POST | `/media-manager/project/:project/library/index` | 23633-23656 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | protected-lifecycle-missing-visible-guard |


## 8. Closeout Decision

M2 can close now: false

Reason:

M2-J2 adds and verifies a narrow Phase 1 guard, but the old route-table classifier is not yet re-run or updated to recognize the new middleware as route-level protection. Remaining uncovered prior high-risk/mutating routes must be classified as false-positive/local-only/deferred or covered by M2-J5 before full M2 closeout.

## 9. Required Next Step

`M2-J5 — Route Authority Scanner Update or Deferred Route Classification`

## 10. Closeout Condition

M2 may close only after the rebaseline distinguishes M2-J2-covered routes from true remaining gaps and documents remaining deferred routes.

## 11. Safety Decision

No rollback is required based on M2-J3 verification.

No runtime patch is applied in M2-J4.

No frontend patch is applied in M2-J4.

No provider/publishing/ads/CRM/customer-send behavior is changed in M2-J4.

M2 remains open until M2-J5 or a final closeout proof completes the remaining classification.



# M2-J5 — Route Authority Scanner Update or Deferred Route Classification

## 0. Status

Status: DEFERRED CLASSIFICATION RECORDED
Phase: M2-J — Narrow Backend Guard Enforcement Patch
Mode: scanner decision + deferred route classification
Runtime changes in M2-J5: none
Server changes in M2-J5: none
UI changes in M2-J5: none
Provider changes in M2-J5: none
Publishing behavior changes in M2-J5: none
Ads/CRM/customer send changes in M2-J5: none

## 1. Purpose

M2-J5 classifies the remaining M2-J4 uncovered routes after the M2-J2 protected route authority guard and M2-J3 verification.

M2-J5 does not patch runtime.

M2-J5 decides whether the next step should update the scanner, defer route categories, or patch remaining true gaps.

## 2. Helper Proof

| Proof | Value |
|---|---|
| M2-J2 middleware present | true |
| Protected route import present | true |
| Helper exports present | true |
| Public mirror error code present | true |
| Destructive error code present | true |
| Server SHA-256 | `4cc23bf58f601e896212895eab7b225ce2904dd91c49f1037fb0661315bcb4b0` |
| Helper SHA-256 | `d33a017d9f8ee884bff5e7d4b9a509856db01261bf6d5bea5d5818b74e18efe0` |

## 3. Summary

| Metric | Count |
|---|---:|
| M2-J4 remaining high-risk without guard | 28 |
| M2-J4 remaining mutating without guard | 42 |
| M2-J5 unique remaining routes | 42 |
| M2-J5 true gap candidates | 42 |
| M2-J5 deferred/scanner candidates | 0 |

## 4. Classification Counts

| Classification | Count |
|---|---:|
| approval_or_draft_only_candidate_customer_crm | 12 |
| approval_required_candidate_ads_or_campaign | 10 |
| manual_execution_candidate_workflow_job | 2 |
| review_output_or_provider_execution_candidate | 10 |
| true_gap_candidate_destructive_or_disconnect | 1 |
| true_gap_candidate_public_high_risk | 7 |

## 5. Scanner Decision

Scanner update required: true

Reason:

M2-G/M2-J4 route table logic counted missing visible route-body guard signals and does not fully recognize M2-J2 app.use middleware coverage or deferred local-only/review-only semantics.

Recommended scanner update scope:

Update the audit scanner only, not runtime, to detect protected-route-authority middleware path patterns and classify remaining routes into true_gap, deferred_local_only, review_output_only, existing_gate_covered, or false_positive.

## 6. Closeout Decision

M2 can close now: false

Reason:

M2-J5 classification reduced ambiguity but still leaves true gap candidates requiring either exact route-body proof or a narrow M2-J6 coverage/false-positive classification before closeout.

Next step:

`M2-J6 — Remaining Route Body Proof Scan and Final Guard Gap Decision`

## 7. True Gap Candidates

| Method | Path | Lines | Categories | M2-J5 Classification | Recommended Action |
|---|---|---:|---|---|---|
| POST | `/task` | 9752-9769 | approval_governance, workflow_job_queue_execution, customer_crm_ticket_send | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/api/agent-registry/register` | 9771-9792 | workflow_job_queue_execution, customer_crm_ticket_send | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/api/agent-registry/resolve` | 9772-9792 | workflow_job_queue_execution, customer_crm_ticket_send | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/ingest` | 9810-9824 | workflow_job_queue_execution, customer_crm_ticket_send | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/backup-and-clone-product/:id` | 10319-10401 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | 10403-10516 | publishing_lifecycle, integration_provider_state, customer_crm_ticket_send, ads_budget_spend | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| POST | `/media/upload` | 10552-10620 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend, library_asset_mutation | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| POST | `/media-manager/project/:project/assets/:assetId/rename` | 11208-11236 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | 11238-11289 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation, destructive_or_disconnect | true_gap_candidate_destructive_or_disconnect | M2-J6 narrow middleware coverage unless proven non-destructive. |
| POST | `/media-manager/project/:project/assets/:assetId/source-of-truth` | 11292-11315 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/media-manager/project/:project/assets/:assetId/archive` | 11317-11343 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/media-manager/project/:project/library/refresh` | 11407-11415 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/api/ai-command/project/:project/campaign-preview` | 11691-11702 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| POST | `/media-manager/project/:project/team` | 11838-11854 | publishing_lifecycle, customer_crm_ticket_send | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/public/media-manager/project/:project/team` | 11839-11854 | publishing_lifecycle, customer_crm_ticket_send | true_gap_candidate_public_high_risk | M2-J6 narrow middleware coverage or prove public alias is non-mutating/review-only. |
| POST | `/media-manager/project/:project/media-jobs` | 12017-12025 | workflow_job_queue_execution | manual_execution_candidate_workflow_job | Classify as manual_execution_only; patch if backend job execution is reachable without proof. |
| POST | `/public/media-manager/project/:project/media-jobs` | 12018-12025 | workflow_job_queue_execution | true_gap_candidate_public_high_risk | M2-J6 narrow middleware coverage or prove public alias is non-mutating/review-only. |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12019-12025 | workflow_job_queue_execution | manual_execution_candidate_workflow_job | Classify as manual_execution_only; patch if backend job execution is reachable without proof. |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12026-12032 | workflow_job_queue_execution | true_gap_candidate_public_high_risk | M2-J6 narrow middleware coverage or prove public alias is non-mutating/review-only. |
| POST | `/media-manager/project/:project/tasks` | 12528-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| POST | `/public/media-manager/project/:project/tasks` | 12529-12542 | publishing_lifecycle, workflow_job_queue_execution, customer_crm_ticket_send, ads_budget_spend | true_gap_candidate_public_high_risk | M2-J6 narrow middleware coverage or prove public alias is non-mutating/review-only. |
| PATCH | `/media-manager/project/:project/notifications/:notificationId` | 12699-12711 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| PATCH | `/public/media-manager/project/:project/notifications/:notificationId` | 12712-12724 | publishing_lifecycle, customer_crm_ticket_send, ads_budget_spend | true_gap_candidate_public_high_risk | M2-J6 narrow middleware coverage or prove public alias is non-mutating/review-only. |
| POST | `/media-manager/project/:project/handoffs` | 12774-12792 | publishing_lifecycle, customer_crm_ticket_send | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/public/media-manager/project/:project/handoffs` | 12775-12792 | publishing_lifecycle, customer_crm_ticket_send | true_gap_candidate_public_high_risk | M2-J6 narrow middleware coverage or prove public alias is non-mutating/review-only. |
| POST | `/media-manager/project/:project/handoffs/:handoffId/consume` | 12776-12792 | publishing_lifecycle, customer_crm_ticket_send | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/public/media-manager/project/:project/handoffs/:handoffId/consume` | 12777-12792 | publishing_lifecycle, customer_crm_ticket_send | true_gap_candidate_public_high_risk | M2-J6 narrow middleware coverage or prove public alias is non-mutating/review-only. |
| POST | `/media-manager/project/:project/library/index` | 23633-23656 | publishing_lifecycle, customer_crm_ticket_send, library_asset_mutation | approval_or_draft_only_candidate_customer_crm | Classify as draft_only/review_only if it only drafts; patch if it sends/mutates CRM/ticket state. |
| POST | `/media-manager/project/:project/rename` | 10955-10956 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| POST | `/public/media-manager/project/:project/rename` | 10957-10958 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| POST | `/media-manager/project/:project/apply-template` | 10959-10960 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| POST | `/public/media-manager/project/:project/apply-template` | 10961-10962 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| POST | `/media-manager/projects` | 10963-10964 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| POST | `/public/media-manager/projects` | 10965-10966 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| POST | `/media-manager/project/:project/campaigns` | 11886-11894 |  | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| POST | `/public/media-manager/project/:project/campaigns` | 11887-11894 |  | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| PATCH | `/media-manager/project/:project/campaigns/:campaignId` | 11888-11894 |  | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| PATCH | `/public/media-manager/project/:project/campaigns/:campaignId` | 11895-11901 |  | approval_required_candidate_ads_or_campaign | Classify as approval_required; patch only if route can launch/spend/change budget. |
| POST | `/media-manager/project/:project/content-items` | 11951-11959 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| POST | `/public/media-manager/project/:project/content-items` | 11952-11959 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| PATCH | `/media-manager/project/:project/content-items/:contentItemId` | 11953-11959 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |
| PATCH | `/public/media-manager/project/:project/content-items/:contentItemId` | 11960-11966 |  | review_output_or_provider_execution_candidate | Classify as review_output_only if no provider execution occurs; patch if live provider execution occurs. |


## 8. Deferred / Scanner Candidates

| Method | Path | Lines | Categories | M2-J5 Classification | Recommended Action |
|---|---|---:|---|---|---|
| — | — | — | — | — | — |


## 9. Safety Decision

No runtime patch is applied in M2-J5.

No server patch is applied in M2-J5.

No frontend patch is applied in M2-J5.

No provider/publishing/ads/CRM/customer-send behavior is changed in M2-J5.

M2 remains open until M2-J6 or a final closeout proof classifies/patches the remaining true gap candidates.



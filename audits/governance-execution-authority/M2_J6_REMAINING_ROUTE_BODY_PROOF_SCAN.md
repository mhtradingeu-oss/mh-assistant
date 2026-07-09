# M2-J6 — Remaining Route Body Proof Scan and Final Guard Gap Decision

## 0. Status

Status: BODY PROOF SCAN RECORDED
Phase: M2-J — Narrow Backend Guard Enforcement Patch
Mode: route body proof scan + final guard gap decision
Runtime changes in M2-J6: none
Server changes in M2-J6: none
UI changes in M2-J6: none
Provider changes in M2-J6: none
Publishing behavior changes in M2-J6: none
Ads/CRM/customer send changes in M2-J6: none

## 1. Purpose

M2-J6 inspects the body of the 42 remaining M2-J5 route candidates to determine whether they have existing proof, can be deferred, or require a narrow authority patch.

M2-J6 does not patch runtime.

## 2. Helper Proof

| Proof | Value |
|---|---|
| M2-J2 middleware present | true |
| Protected route import present | true |
| Helper exports present | true |
| Server SHA-256 | `4cc23bf58f601e896212895eab7b225ce2904dd91c49f1037fb0661315bcb4b0` |
| Helper SHA-256 | `d33a017d9f8ee884bff5e7d4b9a509856db01261bf6d5bea5d5818b74e18efe0` |

## 3. Summary

| Metric | Count |
|---|---:|
| M2-J5 true gap candidates input | 42 |
| Route bodies found | 42 |
| Route bodies not found | 0 |
| Patch required routes | 42 |
| No patch required routes | 0 |

## 4. Final Classification Counts

| Final Classification | Count |
|---|---:|
| patch_required_approval_lifecycle | 13 |
| patch_required_destructive | 1 |
| patch_required_mutation_without_authority_proof | 21 |
| patch_required_public_high_risk | 7 |

## 5. Closeout Decision

M2 can close now: false

Reason:

Remaining routes still require narrow authority coverage or exact manual proof before M2 closeout.

Next step:

`M2-J7 — Narrow Remaining Route Authority Patch or Exact Manual Proof`

Patch required count:

42

## 6. Patch Required Routes

| Method | Path | Body Lines | Prior M2-J5 Class | Final Class | Recommended Action |
|---|---|---:|---|---|---|
| POST | `/task` | 9864-9881 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/api/agent-registry/register` | 9883-9883 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/api/agent-registry/resolve` | 9884-9884 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/ingest` | 9922-9936 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/backup-and-clone-product/:id` | 10431-10513 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | 10515-10628 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/media/upload` | 10664-10732 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/media-manager/project/:project/assets/:assetId/rename` | 11320-11348 | approval_or_draft_only_candidate_customer_crm | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | 11350-11401 | true_gap_candidate_destructive_or_disconnect | patch_required_destructive | M2-J7 narrow middleware coverage. |
| POST | `/media-manager/project/:project/assets/:assetId/source-of-truth` | 11404-11427 | approval_or_draft_only_candidate_customer_crm | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/media-manager/project/:project/assets/:assetId/archive` | 11429-11455 | approval_or_draft_only_candidate_customer_crm | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/media-manager/project/:project/library/refresh` | 11519-11527 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/api/ai-command/project/:project/campaign-preview` | 11803-11803 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/media-manager/project/:project/team` | 11950-11950 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/project/:project/team` | 11951-11951 | true_gap_candidate_public_high_risk | patch_required_public_high_risk | M2-J7 narrow middleware coverage or remove public mutation alias. |
| POST | `/media-manager/project/:project/media-jobs` | 12129-12129 | manual_execution_candidate_workflow_job | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/project/:project/media-jobs` | 12130-12130 | true_gap_candidate_public_high_risk | patch_required_public_high_risk | M2-J7 narrow middleware coverage or remove public mutation alias. |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | 12131-12137 | manual_execution_candidate_workflow_job | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | 12138-12144 | true_gap_candidate_public_high_risk | patch_required_public_high_risk | M2-J7 narrow middleware coverage or remove public mutation alias. |
| POST | `/media-manager/project/:project/tasks` | 12640-12640 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/public/media-manager/project/:project/tasks` | 12641-12641 | true_gap_candidate_public_high_risk | patch_required_public_high_risk | M2-J7 narrow middleware coverage or remove public mutation alias. |
| PATCH | `/media-manager/project/:project/notifications/:notificationId` | 12811-12823 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| PATCH | `/public/media-manager/project/:project/notifications/:notificationId` | 12824-12836 | true_gap_candidate_public_high_risk | patch_required_public_high_risk | M2-J7 narrow middleware coverage or remove public mutation alias. |
| POST | `/media-manager/project/:project/handoffs` | 12886-12886 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/project/:project/handoffs` | 12887-12887 | true_gap_candidate_public_high_risk | patch_required_public_high_risk | M2-J7 narrow middleware coverage or remove public mutation alias. |
| POST | `/media-manager/project/:project/handoffs/:handoffId/consume` | 12888-12888 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/project/:project/handoffs/:handoffId/consume` | 12889-12889 | true_gap_candidate_public_high_risk | patch_required_public_high_risk | M2-J7 narrow middleware coverage or remove public mutation alias. |
| POST | `/media-manager/project/:project/library/index` | 23745-23768 | approval_or_draft_only_candidate_customer_crm | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/media-manager/project/:project/rename` | 11067-11067 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/project/:project/rename` | 11069-11069 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/media-manager/project/:project/apply-template` | 11071-11071 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/project/:project/apply-template` | 11073-11073 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/media-manager/projects` | 11075-11075 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/projects` | 11077-11077 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/media-manager/project/:project/campaigns` | 11998-11998 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/public/media-manager/project/:project/campaigns` | 11999-11999 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| PATCH | `/media-manager/project/:project/campaigns/:campaignId` | 12000-12006 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| PATCH | `/public/media-manager/project/:project/campaigns/:campaignId` | 12007-12013 | approval_required_candidate_ads_or_campaign | patch_required_approval_lifecycle | M2-J7 approval_required middleware coverage unless exact body proves draft-only. |
| POST | `/media-manager/project/:project/content-items` | 12063-12063 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| POST | `/public/media-manager/project/:project/content-items` | 12064-12064 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| PATCH | `/media-manager/project/:project/content-items/:contentItemId` | 12065-12071 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |
| PATCH | `/public/media-manager/project/:project/content-items/:contentItemId` | 12072-12078 | review_output_or_provider_execution_candidate | patch_required_mutation_without_authority_proof | M2-J7 narrow authority middleware coverage. |


## 7. No Patch Required / Deferred Routes

| Method | Path | Body Lines | Prior M2-J5 Class | Final Class | Recommended Action |
|---|---|---:|---|---|---|
| — | — | — | — | — | — |


## 8. Safety Decision

No runtime patch is applied in M2-J6.

No server patch is applied in M2-J6.

No frontend patch is applied in M2-J6.

No provider/publishing/ads/CRM/customer-send behavior is changed in M2-J6.

M2 remains open if patch_required_count is greater than zero.



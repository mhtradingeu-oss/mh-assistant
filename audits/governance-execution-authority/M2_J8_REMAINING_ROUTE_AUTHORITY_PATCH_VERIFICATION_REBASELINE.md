# M2-J8 — Remaining Route Authority Patch Verification and Rebaseline

## 0. Status

Status: PATCH VERIFICATION REBASELINE RECORDED
Phase: M2-J — Narrow Backend Guard Enforcement Patch
Mode: verification + rebaseline only
Runtime changes in M2-J8: none
Server changes in M2-J8: none
UI changes in M2-J8: none
Provider changes in M2-J8: none
Publishing behavior changes in M2-J8: none
Ads/CRM/customer-send changes in M2-J8: none

## 1. Purpose

M2-J8 verifies that the M2-J7 middleware patch covers all 42 routes that M2-J6 classified as patch_required.

M2-J8 does not patch runtime.

## 2. Helper Proof

| Proof | Value |
|---|---|
| M2-J7 marker present | true |
| M2-J2 middleware present | true |
| Protected route import present | true |
| Helper exports present | true |
| M2-J7 doc present | true |
| Server SHA-256 | `2745f6472bdcc131a3de46bbc23609ba52408e2ad3cc4d939af57ce48760fcf5` |
| Helper SHA-256 | `d33a017d9f8ee884bff5e7d4b9a509856db01261bf6d5bea5d5818b74e18efe0` |

## 3. Summary

| Metric | Count |
|---|---:|
| M2-J6 patch required routes | 42 |
| Expected unique routes | 42 |
| Covered by M2-J7 | 42 |
| Still uncovered after M2-J7 | 0 |
| Missing from M2-J7 block | 0 |
| Manual bucket missing | 0 |
| Approval bucket missing | 0 |
| Delete bucket missing | 0 |

## 4. Coverage Counts

| Coverage | Count |
|---|---:|
| approval_required | 13 |
| destructive_manual_required | 1 |
| manual_execution_only | 28 |

## 5. Closeout Decision

M2 can close now: true

Reason:

All 42 M2-J6 patch_required routes are now covered by M2-J7 protected-route-authority middleware buckets.

Next step:

`M2-J9 — Governance Execution Authority Closeout`

## 6. Covered Routes

| Method | Path | Prior M2-J6 Classification | M2-J7 Coverage |
|---|---|---|---|
| POST | `/task` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/api/agent-registry/register` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/api/agent-registry/resolve` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/ingest` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/backup-and-clone-product/:id` | patch_required_approval_lifecycle | approval_required |
| POST | `/apply-prepared-copy-to-clone/:originalId/:cloneId` | patch_required_approval_lifecycle | approval_required |
| POST | `/media/upload` | patch_required_approval_lifecycle | approval_required |
| POST | `/media-manager/project/:project/assets/:assetId/rename` | patch_required_approval_lifecycle | approval_required |
| PATCH | `/media-manager/project/:project/assets/:assetId/classification` | patch_required_destructive | destructive_manual_required |
| POST | `/media-manager/project/:project/assets/:assetId/source-of-truth` | patch_required_approval_lifecycle | approval_required |
| POST | `/media-manager/project/:project/assets/:assetId/archive` | patch_required_approval_lifecycle | approval_required |
| POST | `/media-manager/project/:project/library/refresh` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/api/ai-command/project/:project/campaign-preview` | patch_required_approval_lifecycle | approval_required |
| POST | `/media-manager/project/:project/team` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/project/:project/team` | patch_required_public_high_risk | manual_execution_only |
| POST | `/media-manager/project/:project/media-jobs` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/project/:project/media-jobs` | patch_required_public_high_risk | manual_execution_only |
| PATCH | `/media-manager/project/:project/media-jobs/:mediaJobId` | patch_required_mutation_without_authority_proof | manual_execution_only |
| PATCH | `/public/media-manager/project/:project/media-jobs/:mediaJobId` | patch_required_public_high_risk | manual_execution_only |
| POST | `/media-manager/project/:project/tasks` | patch_required_approval_lifecycle | approval_required |
| POST | `/public/media-manager/project/:project/tasks` | patch_required_public_high_risk | manual_execution_only |
| PATCH | `/media-manager/project/:project/notifications/:notificationId` | patch_required_approval_lifecycle | approval_required |
| PATCH | `/public/media-manager/project/:project/notifications/:notificationId` | patch_required_public_high_risk | manual_execution_only |
| POST | `/media-manager/project/:project/handoffs` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/project/:project/handoffs` | patch_required_public_high_risk | manual_execution_only |
| POST | `/media-manager/project/:project/handoffs/:handoffId/consume` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/project/:project/handoffs/:handoffId/consume` | patch_required_public_high_risk | manual_execution_only |
| POST | `/media-manager/project/:project/library/index` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/media-manager/project/:project/rename` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/project/:project/rename` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/media-manager/project/:project/apply-template` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/project/:project/apply-template` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/media-manager/projects` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/projects` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/media-manager/project/:project/campaigns` | patch_required_approval_lifecycle | approval_required |
| POST | `/public/media-manager/project/:project/campaigns` | patch_required_approval_lifecycle | approval_required |
| PATCH | `/media-manager/project/:project/campaigns/:campaignId` | patch_required_approval_lifecycle | approval_required |
| PATCH | `/public/media-manager/project/:project/campaigns/:campaignId` | patch_required_approval_lifecycle | approval_required |
| POST | `/media-manager/project/:project/content-items` | patch_required_mutation_without_authority_proof | manual_execution_only |
| POST | `/public/media-manager/project/:project/content-items` | patch_required_mutation_without_authority_proof | manual_execution_only |
| PATCH | `/media-manager/project/:project/content-items/:contentItemId` | patch_required_mutation_without_authority_proof | manual_execution_only |
| PATCH | `/public/media-manager/project/:project/content-items/:contentItemId` | patch_required_mutation_without_authority_proof | manual_execution_only |


## 7. Still Uncovered Routes

| Method | Path | Prior M2-J6 Classification | M2-J7 Coverage |
|---|---|---|---|
| — | — | — | — |


## 8. Safety Decision

No runtime patch is applied in M2-J8.

No server patch is applied in M2-J8.

No frontend patch is applied in M2-J8.

No provider/publishing/ads/CRM/customer-send behavior is changed in M2-J8.

M2 may proceed to closeout only if all M2-J6 patch_required routes are covered by M2-J7 middleware.



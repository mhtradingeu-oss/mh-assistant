# M2-J7 — Narrow Remaining Route Authority Patch

## 0. Status

Status: PATCH APPLIED FOR REVIEW
Phase: M2-J — Narrow Backend Guard Enforcement Patch
Mode: targeted app.use middleware coverage only
Runtime business logic changes: none
Route handler rewrites: none
Frontend changes: none
Provider changes: none
Publishing behavior changes: none
Ads/CRM/customer-send behavior changes: none

## 1. Purpose

M2-J7 adds protected-route-authority middleware coverage for the 42 M2-J6 patch_required routes.

The patch only adds new `app.use(...)` middleware blocks using existing M2-J2 middleware functions.

It does not rewrite route handlers.

It does not add provider execution.

It does not change frontend behavior.

## 2. Summary

| Metric | Value |
|---|---:|
| M2-J6 patch required routes | 42 |
| Expected unique middleware routes | 42 |
| Manual-only route entries | 21 |
| Approval-required route entries | 13 |
| Delete/owner route entries | 1 |
| Public high-risk route entries | 7 |
| Missing after patch | 0 |
| Server SHA-256 before | `4cc23bf58f601e896212895eab7b225ce2904dd91c49f1037fb0661315bcb4b0` |
| Server SHA-256 after | `2745f6472bdcc131a3de46bbc23609ba52408e2ad3cc4d939af57ce48760fcf5` |

## 3. Middleware Buckets

### Manual Only

- `/task`
- `/api/agent-registry/register`
- `/api/agent-registry/resolve`
- `/ingest`
- `/media-manager/project/:project/library/refresh`
- `/media-manager/project/:project/team`
- `/media-manager/project/:project/media-jobs`
- `/media-manager/project/:project/media-jobs/:mediaJobId`
- `/media-manager/project/:project/handoffs`
- `/media-manager/project/:project/handoffs/:handoffId/consume`
- `/media-manager/project/:project/library/index`
- `/media-manager/project/:project/rename`
- `/public/media-manager/project/:project/rename`
- `/media-manager/project/:project/apply-template`
- `/public/media-manager/project/:project/apply-template`
- `/media-manager/projects`
- `/public/media-manager/projects`
- `/media-manager/project/:project/content-items`
- `/public/media-manager/project/:project/content-items`
- `/media-manager/project/:project/content-items/:contentItemId`
- `/public/media-manager/project/:project/content-items/:contentItemId`

### Approval Required

- `/backup-and-clone-product/:id`
- `/apply-prepared-copy-to-clone/:originalId/:cloneId`
- `/media/upload`
- `/media-manager/project/:project/assets/:assetId/rename`
- `/media-manager/project/:project/assets/:assetId/source-of-truth`
- `/media-manager/project/:project/assets/:assetId/archive`
- `/api/ai-command/project/:project/campaign-preview`
- `/media-manager/project/:project/tasks`
- `/media-manager/project/:project/notifications/:notificationId`
- `/media-manager/project/:project/campaigns`
- `/public/media-manager/project/:project/campaigns`
- `/media-manager/project/:project/campaigns/:campaignId`
- `/public/media-manager/project/:project/campaigns/:campaignId`

### Delete / Destructive

- `/media-manager/project/:project/assets/:assetId/classification`

### Public High Risk

- `/public/media-manager/project/:project/team`
- `/public/media-manager/project/:project/media-jobs`
- `/public/media-manager/project/:project/media-jobs/:mediaJobId`
- `/public/media-manager/project/:project/tasks`
- `/public/media-manager/project/:project/notifications/:notificationId`
- `/public/media-manager/project/:project/handoffs`
- `/public/media-manager/project/:project/handoffs/:handoffId/consume`

## 4. Safety Decision

M2-J7 is not a closeout.

M2 remains open until post-patch verification proves the new coverage.

Next step:

`M2-J8 — Remaining Route Authority Patch Verification and Rebaseline`


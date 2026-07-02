# Patch 12B — Publishing Backend Contract Audit

## Status

Audit-only / no production change.

This audit maps the frontend Publishing contract into backend-authoritative scheduling, readiness, manual completion, failure, local draft, handoff, asset gate, and automation boundaries before any Publishing production patch is considered.

## Production Decision

No production code was changed.

Reason:

- Publishing includes backend schedule and lifecycle functions.
- Publishing includes local draft fallback behavior.
- Publishing validates approval and required fields before risky actions.
- Publishing blocks unsafe actions when required assets are missing or need review.
- Publishing can record manual completion only after explicit confirmation.
- Publishing can mark backend items ready or failed.
- Publishing includes Auto Mode preparation and approval-gated steps.
- Any future production change must preserve backend authority, confirmation paths, approval gates, asset blockers, and the distinction between manual completion records and external provider publishing.

## Current Active File

- `public/control-center/pages/publishing.js`

## Backend Function Contract

Publishing receives and uses these backend-capable functions through route render context:

- `savePublishingSchedule`
- `reschedulePublishingItem`
- `approvePublishingItem`
- `publishPublishingItem`
- `failPublishingItem`

These functions are execution/gate-adjacent and must be treated as backend-authoritative.

## Local Draft Contract

Publishing also supports browser-local draft fallback through:

- `saveLocalDraft`
- `updateLocalDraft`
- `loadLocalDrafts`
- `buildLocalDraftPayload`

Local drafts can be saved, scheduled locally, paused, marked failed locally, or marked as manual-completion locally.

Local draft behavior must not be confused with backend provider publishing.

## Schedule / Reschedule Contract

The scheduling path uses:

- `publishingScheduleBtn`
- `data-publishing-action="schedule"`
- `data-publishing-action="retry"`
- `reschedulePublishingItem`
- `savePublishingSchedule`
- `buildSchedulePayload`
- `validateBuilder(session, "schedule")`

Scheduling requires required form fields and publish date.

Backend schedule/reschedule actions use confirmation text and then reload project data.

## Manual Completion Contract

Manual completion uses:

- `data-publishing-action="publish"`
- `publishPublishingItem`
- `validateBuilder(session, "publish")`
- `guardPublishingAssetBlockers`
- `confirmPublishingBackendAction`

Manual completion is explicitly framed as recording completion after external publishing was completed or verified outside the page.

It does not prove live external provider publishing by itself.

## Approval Readiness Contract

Approval readiness uses:

- `publishingApproveBtn`
- `approvePublishingItem`
- `approvalStatus`
- `validateBuilder`
- local draft approval update for local-only items

Manual completion requires:

- `form.approvalStatus === "approved"`

Backend readiness approval uses confirmation and states it does not replace Governance approval or external provider readiness proof.

## Failure Contract

Failure uses:

- `publishingFailBtn`
- `failPublishingItem`
- local draft failed update for local-only items

Backend failure requires confirmation and records a failure state that can stop the publishing lifecycle.

## Asset Blocker Contract

Publishing checks asset blockers through:

- `filterAssetCategories`
- `PUBLISHING_ASSET_KEYS`
- `guardPublishingAssetBlockers`
- `summarizePublishingBlockers`

If publishing assets are missing or need review, schedule/retry/publish actions can be blocked.

This is a critical readiness gate.

## Queue / Status Contract

Publishing normalizes queue states through:

- `normalizeStatus`
- `getStatusCounts`
- `filterQueue`
- `compareQueueItems`

Observed display statuses:

- `draft`
- `ready`
- `needs approval`
- `scheduled`
- `published`
- `failed`

Backend and local statuses must remain distinct when future changes are made.

## Workflow Handoff Contract

Publishing can load workflow output into a local publishing draft through:

- `getPublishingHandoff`
- `extractHandoffSummary`
- `publishingLoadHandoffBtn`
- `saveDraftLocally`

This is a projection/handoff path, not backend publish execution.

## AI Handoff Contract

Publishing can send context to AI Command through:

- `publishingPushAiBtn`
- `setSharedAiDraft`
- `setSharedHandoff`
- `navigateTo("ai-command")`

The AI handoff includes linked entity metadata and draft context.

AI does not schedule, approve, publish, fail, or execute backend actions.

## Automation Contract

Publishing has Auto Mode preparation through:

- `publishingAutoPrepareBtn`
- `publishingAutoStopBtn`
- `publishingAutoApproveBtn`
- `publishingAutoSkipBtn`
- `startAutoMode`
- `stopAutoMode`
- `approveCurrentGate`
- `skipCurrentStep`

Automation copy states it cannot publish without manual review, confirmation, and backend approval gates.

Future changes must preserve this boundary.

## Data Attribute Inventory

Observed Publishing attributes:

- `data-publishing-action`
- `data-publishing-filter`
- `data-publishing-id`
- `data-publishing-row`
- `data-publishing-select`

## Button / Handler Inventory

Key button IDs:

- `publishingOpenQueueBtn`
- `publishingSaveDraftBtn`
- `publishingPushAiBtn`
- `publishingAutoPrepareBtn`
- `publishingAutoStopBtn`
- `publishingAutoApproveBtn`
- `publishingAutoSkipBtn`
- `publishingNewItemBtn`
- `publishingBuilderSaveBtn`
- `publishingScheduleBtn`
- `publishingLoadHandoffBtn`
- `publishingApproveBtn`
- `publishingFailBtn`

These IDs should not be changed without a dedicated implementation patch and browser QA.

## Backend / Durable Authority Boundary

Backend-authoritative or backend-adjacent paths:

- save schedule
- reschedule item
- approve readiness
- record manual completion
- mark failed
- reload project data
- backend queue updates
- backend lifecycle state changes
- backend approval/readiness gate

## Frontend Projection Boundary

Frontend/local paths:

- local draft creation
- local draft update
- local queue filtering
- local queue selection
- workflow handoff loading into draft
- recommendation display
- calendar/timeline display
- AI prompt preparation
- automation preview display

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `savePublishingSchedule`
2. `reschedulePublishingItem`
3. `approvePublishingItem`
4. `publishPublishingItem`
5. `failPublishingItem`
6. `buildSchedulePayload`
7. `buildLocalDraftPayload`
8. `validateBuilder`
9. `guardPublishingAssetBlockers`
10. `confirmPublishingBackendAction`
11. `runAndRefresh`
12. `data-publishing-action`
13. `publishingScheduleBtn`
14. `publishingApproveBtn`
15. `publishingFailBtn`
16. `publishingAutoPrepareBtn`
17. `publishingAutoApproveBtn`
18. `publishingAutoSkipBtn`
19. manual completion confirmation
20. approval status validation
21. asset blocker gate
22. local draft fallback
23. workflow handoff load
24. AI handoff payload
25. queue status normalization
26. automation approval gates

## Recommended Future Patch

### Patch 12C — Publishing Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- manual completion versus external provider publishing
- backend schedule authority
- approval readiness versus Governance approval
- asset blockers
- Auto Mode preparation-only boundary
- AI handoff review-only boundary
- local draft versus backend queue record

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- handler changes
- API changes
- status transition changes
- approval gate changes
- publishing execution changes
- automation behavior changes
- local draft behavior changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/publishing.js`
- route ID: `publishing`
- `data-page="publishing"`
- all `data-publishing-*` attributes
- all button IDs
- all backend function calls
- all local draft behavior
- all schedule/reschedule behavior
- all approval readiness behavior
- all manual completion behavior
- all failure behavior
- all workflow handoff behavior
- all AI handoff behavior
- all automation behavior
- all asset blocker behavior
- all project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/publishing.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future Publishing production patch:

- Open Publishing.
- Confirm queue renders.
- Select queue items.
- Save a local publishing draft.
- Save backend schedule only in a safe test project.
- Reschedule backend item only in a safe test project.
- Record manual completion only in a safe test project.
- Confirm approval status gate blocks unsafe completion.
- Confirm asset blockers prevent unsafe actions.
- Confirm workflow handoff loads into a local draft.
- Confirm AI handoff only routes to AI Command.
- Confirm Auto Mode does not publish autonomously.
- Confirm backend confirmations appear where required.
- Confirm no direct external provider publishing is implied.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

# Patch 12 — Publishing Execution / Gate Authority Audit

## Status

Audit-only / no production change.

Publishing is a high-authority execution and gate surface. It contains draft preparation, manual publishing queue records, schedule/reschedule behavior, approval readiness, manual completion recording, fail/retry state, asset blockers, automation preview, and backend publishing schedule APIs.

## Production Decision

No production code was changed.

Reason:

- Publishing contains schedule, approve, publish/manual-completion, fail, retry, queue, gate, and automation-related behavior.
- Publishing already states that AI/context actions do not approve, publish, or execute backend actions.
- Publishing already states external provider execution requires separate proof.
- Publishing already validates approval status before manual completion.
- Publishing already blocks actions when required publishing assets are missing or need review.
- Publishing includes backend API paths and local fallback behavior.
- It should not receive a blind copy/hierarchy patch before a dedicated Publishing backend contract audit.

## Current Active File

- `public/control-center/pages/publishing.js`

## Existing Strengths

Confirmed current Publishing capabilities and safety language:

- Publishing Overview.
- Execution Destination.
- Smart Recommendation.
- Publish Queue.
- Publishing Builder.
- Workflow Handoff.
- Calendar / Timeline Snapshot.
- Execution Result Area.
- Channel & Approval Readiness.
- Publishing blockers.
- Automation Preview.
- AI context handoff.
- Local draft fallback.
- Backend schedule save.
- Manual publishing queue record.
- Manual completion recording.
- Failed item handling.
- Asset dependency blockers.
- Approval status validation.

## Authority / Risk Findings

The following require caution before any production change:

### 1. Backend publishing schedule APIs

Publishing can receive and call backend-provided functions such as:

- `savePublishingSchedule`
- `reschedulePublishingItem`
- `approvePublishingItem`
- `publishPublishingItem`
- `failPublishingItem`

These are execution/gate-adjacent and must not be changed blindly.

### 2. Manual completion path

Publishing includes a `publish` intent and manual completion wording.

The current wording correctly frames this as recording manual completion after review, not direct external provider publishing.

### 3. Schedule / reschedule / retry path

Publishing validates publish date for schedule, publish, and retry intents.

Timing changes can affect queue state and must remain explicit.

### 4. Approval readiness gate

Publishing validates that manual completion requires approval status to be approved.

This gate must remain intact.

### 5. Asset blockers

Publishing checks required publishing assets and blocks actions when assets are missing or need review.

This is an important readiness guard.

### 6. Automation preview

Publishing includes Auto Mode and approval-step UI.

Automation must remain preparation/review only and must not imply autonomous publishing.

### 7. Local draft fallback

Publishing can save local publishing drafts. This is useful but must not be confused with backend publish execution.

### 8. Workflow handoff

Publishing can load workflow output into a draft. This is a handoff/projection path, not execution.

## Backend / Durable Authority Boundary

Backend-authoritative or execution-adjacent paths include:

- save publishing schedule
- reschedule publishing item
- approve publishing item
- publish/manual completion record
- fail publishing item
- reload project data after backend action
- approval status gate
- asset blocker gate
- automation approval step

## Frontend Projection Boundary

Frontend projection / local paths include:

- queue filtering
- queue selection
- local draft preparation
- form validation display
- recommendation display
- workflow handoff preview
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
6. `runAndRefresh`
7. `validateBuilder`
8. `guardPublishingAssetBlockers`
9. `confirmPublishingBackendAction`
10. `data-publishing-action`
11. `publishingScheduleBtn`
12. `publishingBuilderSaveBtn`
13. `publishingAutoPrepareBtn`
14. `publishingAutoApproveBtn`
15. approval status validation
16. asset blocker handling
17. queue status transitions
18. manual completion wording
19. automation approval behavior
20. local draft fallback behavior

## Recommended Future Patch

### Patch 12B — Publishing Backend Contract Audit

Before any production patch, map exact backend contracts and status transitions:

- save schedule payload
- reschedule payload
- approve payload
- publish/manual completion payload
- fail payload
- queue item status model
- local draft model
- approval status gate
- asset blocker gate
- automation approval path
- workflow handoff loading

Allowed scope:

- audit documentation only unless a very narrow copy guard is proven safe

Forbidden:

- no handler changes
- no API changes
- no status transition changes
- no approval gate changes
- no publishing execution changes
- no automation behavior changes
- no local draft behavior changes
- no CSS
- no backend
- no data/projects

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/publishing.js`
- route ID: `publishing`
- `data-page="publishing"`
- all `data-publishing-*` attributes
- all publishing handlers
- all backend API calls
- all schedule/reschedule behavior
- all approval behavior
- all manual completion behavior
- all fail/retry behavior
- all local draft behavior
- all automation behavior
- all workflow handoff behavior
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
- Save publishing draft.
- Queue for Manual Publishing.
- Try manual completion only with approved status in a safe test project.
- Confirm approval status gate remains.
- Confirm asset blockers prevent unsafe actions.
- Confirm workflow handoff loads into draft only.
- Confirm AI button only routes context to AI Command.
- Confirm automation preview does not publish autonomously.
- Confirm backend confirmation appears where required.
- Confirm no direct external provider publishing is implied.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

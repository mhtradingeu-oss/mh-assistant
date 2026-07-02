# PHASE 3AD.1 — Operations Centers Consolidated Regression Decision

## Decision Status
Closed as audit-only after consolidated evidence review.

## Route Registration
Pass.

Confirmed registered routes:
- `operations-centers`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`

Confirmed source:
- `public/control-center/router.js`

Confirmed implementation source:
- `public/control-center/pages/operations-centers.js`

## Sidebar Placement
Pass.

Confirmed:
- `Operations Overview` is visible in the SYSTEM sidebar group.
- It appears above Task Center.
- It routes to `operations-centers`.
- Child surfaces remain visible:
  - Task Center.
  - Queue Center.
  - Job Monitor.
  - Notifications.
  - Governance.
  - Settings.

## Metadata Completeness
Pass.

Confirmed:
- Operations Overview route has `meta`.
- Task Center route has `meta`.
- Queue Center route has `meta`.
- Job Monitor route has `meta`.
- Notification Center route has `meta`.

The previous missing-metadata startup risk for `operations-centers` is closed.

## Surface Ownership Summary
Operations Overview owns:
- parent visibility.
- cross-center summary.
- routing to child operations surfaces.
- routing to AI Team and Workflows.
- disabled future action placeholders.

Task Center owns:
- task review/projection.
- task detail inspection.
- task handoff review.
- AI task guidance.
- refresh/read behavior.

Queue Center owns:
- queue review/projection.
- queue pressure visibility.
- route-to-owner behavior.
- AI queue guidance.
- refresh/read behavior.

Job Monitor owns:
- job state review.
- execution health visibility.
- route-to-context behavior.
- AI job guidance.
- refresh/read behavior.

Notification Center owns:
- notification review/projection.
- alert/inbox visibility.
- route-to-source behavior.
- AI notification guidance.
- Mark Read read-state update only where backend notification id exists.

## Active Mutation Summary
The only confirmed active backend mutation inside the Operations Centers group is:

- Notification Center `Mark Read`.

Boundary:
- `Mark Read` updates notification read-state only.
- It uses `markProjectNotification(projectName, notificationId, { status: "read", read: true })`.
- It must not acknowledge, resolve, dismiss, delete, send, approve, publish, trigger workers, or execute unrelated backend actions.

All other Operations Centers behavior is read, route, UI/session state, or AI prompt/context only.

## Disabled Action Summary
Confirmed disabled or deferred:
- Operations Overview:
  - create task from draft.
  - execute workflow.
  - acknowledge signal.
- Queue Center:
  - retry item.
  - approve item.
  - publish item.
  - remove item.
- Job Monitor:
  - retry job.
  - cancel job.
  - rerun job.
  - delete job.
- Notification Center:
  - acknowledge notification.
  - resolve notification.
  - dismiss notification.
  - delete notification.

These must remain disabled until future mutation safety passes define:
- owner.
- confirmation model.
- backend authority.
- audit trail.
- test dataset.
- Browser QA.

## API / Backend Boundary Summary
Frontend API boundaries:
- `fetchProjectTaskCenter` is read/projection.
- `fetchProjectQueueCenter` is read/projection.
- `fetchProjectJobMonitor` is read/projection.
- `fetchProjectNotificationCenter` is read/projection.
- `markProjectNotification` is the only active notification mutation helper.

Backend boundaries:
- GET task-center.
- GET queue-center.
- GET job-monitor.
- GET notification-center.
- PATCH notification by id exists and must be treated as backend authority for notification state.

No parent Operations Overview mutation API was confirmed.

## Browser QA Requirements
The next Browser QA matrix should verify:
- Control Center starts without `meta.eyebrow` error.
- SYSTEM sidebar order is correct:
  - Operations Overview.
  - Task Center.
  - Queue Center.
  - Job Monitor.
  - Notifications.
  - Governance.
  - Settings.
- Operations Overview opens `#operations-centers`.
- Task Center opens `#task-center`.
- Queue Center opens `#queue-center`.
- Job Monitor opens `#job-monitor`.
- Notifications opens `#notification-center`.
- Every page loads without blank/error state.
- Route cards from Operations Overview navigate correctly.
- Planned/deferred actions remain disabled.
- Refresh actions remain read-only.
- AI buttons remain context/prompt only.
- Mark Read is the only active mutation and should not be clicked unless a safe test dataset exists.
- No task mutation occurs.
- No queue mutation occurs.
- No job mutation occurs.
- No notification lifecycle mutation occurs other than controlled Mark Read if tested safely.
- No publishing mutation occurs.
- No Governance approval occurs.
- No external send occurs.
- No worker/scheduler trigger occurs.

## Regression Risks
Remaining risks:
- Notification PATCH backend route may support broader mutation than the frontend Mark Read payload. Future backend authority audit should confirm allowed fields before enabling any lifecycle actions.
- AI Command references `operations-centers` and child routes. These references should be reviewed in a later AI Command handoff audit, not in this Operations group audit.
- Empty-state visual density may still need polish if live operations data is sparse.
- Future enabling of planned/deferred controls must not be bundled into copy or visual work.

## Recommended Next Phase
`PHASE 3AD.2 — Operations Centers Browser QA Matrix / Group Closeout`

Reason:
All route/nav/action/API evidence has been captured and reviewed. The next step should create a browser QA matrix and close the Operations Centers group as a consolidated frontend wave, assuming QA passes.

## Production Safety Rules
Until 3AD.2 is complete:
- Do not enable disabled actions.
- Do not add new Operations mutation handlers.
- Do not change backend notification PATCH behavior.
- Do not broaden Mark Read.
- Do not add Overview-level execution behavior.
- Do not test destructive or lifecycle mutations on real project data.

# PHASE 3AB.3 — Notification Center Boundary Copy / Mark-Read Mutation Safety Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AB.2 — Notification Center Mutation Safety Audit`
- Previous commit: `b18c5fa Add Notification Center mutation safety audit`

## Source Truth
Notification Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `notificationCenterRoute`
- id: `notification-center`

## Purpose
Plan safe copy/label improvements for Notification Center after mutation safety audit confirmed:

- Notification Center is mostly read/review/filter/route/AI-guidance.
- Notification Center has one active backend mutation:
  - Mark Read.
- Mark Read updates notification read-state only when a real `notification_id` exists.
- Acknowledge/Resolve/Dismiss/Delete remain disabled and deferred.
- No external send/email/message control is active.
- Governance, Publishing, Queue, Task, and Job boundaries remain destination-owned.

## Evidence From PHASE 3AB.2

### Safe active actions
- Refresh reads from `fetchProjectNotificationCenter`.
- Search/focus/severity/select are local UI/session state.
- Open Source Page navigates to the owning source.
- AI prompt/context is guidance-only.

### Active mutation
- Mark Read calls:
  - `markProjectNotification(projectName, notificationId, { status: "read", read: true })`
- This uses:
  - PATCH `/media-manager/project/:project/notifications/:notificationId`

### Disabled/deferred actions
Notification Center shows but disables:
- Acknowledge notification.
- Resolve notification.
- Dismiss notification.
- Delete notification.

These must remain disabled until a future mutation design, confirmation model, backend authority review, and test dataset exist.

## Copy Risk Areas

### 1. “Notification history”
Risk:
Could imply lifecycle management.

Recommended direction:
- Notification history and read-state review.

### 2. “mark notifications as read where supported”
Risk:
Could sound vague.

Recommended direction:
- Mark Read updates read-state only for inbox notifications with a backend notification id.

### 3. “Notification actions”
Risk:
Could imply full lifecycle mutation authority.

Recommended direction:
- Notification review actions.
- Active actions are refresh, route, AI guidance, and Mark Read only where supported.

### 4. “Mark Read”
Risk:
This is an active mutation and should be explicit.

Recommended direction:
- Mark Read (updates read state).
- Optional title/nearby note: updates read-state only; does not resolve, acknowledge, dismiss, delete, send, approve, publish, or execute.

### 5. Disabled lifecycle controls
Risk:
Acknowledge/Resolve/Dismiss/Delete are high-risk lifecycle/destructive actions.

Recommended direction:
- Acknowledge notification (disabled: future lifecycle mutation safety pass).
- Resolve notification (disabled: future incident-resolution safety pass).
- Dismiss notification (disabled: future visibility mutation safety pass).
- Delete notification (disabled: future destructive mutation safety pass).

### 6. AI Panel
Risk:
Could imply AI can act on notifications.

Recommended direction:
- AI receives context/prompt only.
- AI cannot mark read, acknowledge, resolve, dismiss, delete, send, approve, publish, trigger workers, bypass Governance, or execute backend actions.

### 7. Route metadata
Risk:
Needs to clarify review/routing and Mark Read boundary.

Recommended direction:
- Review alerts, unread inbox state, approvals, provider health, publishing, claim risks, and workflow completion signals with mark-read limited to notification read state.

## Allowed Future Patch Scope
A future patch may change:
- Route metadata copy.
- Section headings.
- Helper copy.
- Panel descriptions.
- Mark Read button label/title copy.
- Disabled action explanatory copy.
- AI panel safety copy.
- Source route label copy.

A future patch must not change:
- Handlers.
- API calls.
- Backend routes.
- CSS.
- Data files.
- Notification mutation logic.
- Mark Read payload.
- Disabled/enabled state.
- Governance behavior.
- Publishing behavior.
- Queue Center behavior.
- Job Monitor behavior.
- AI behavior.
- External send behavior.

## Required Browser QA After Patch
Check:
- Notification Center page loads.
- Copy says review/projection/routing, not full notification lifecycle control.
- Refresh remains read-only.
- Search/filter/select remain UI-only.
- Mark Read appears only where supported by backend notification id.
- Mark Read copy says read-state only.
- Acknowledge/Resolve/Dismiss/Delete remain disabled.
- AI panel says context/guidance only and no mark-read/acknowledge/resolve/dismiss/delete/send/approve/publish/backend execution.
- Open Source Page remains routing-only.
- No destructive notification mutation occurs.
- No external send occurs.
- No Governance approval occurs.
- No publishing/job/queue mutation occurs.

## Recommended Next Phase
`PHASE 3AB.4 — Notification Center Copy-Only Mark-Read Boundary Safe Patch`

Do not implement until this plan is reviewed and committed.

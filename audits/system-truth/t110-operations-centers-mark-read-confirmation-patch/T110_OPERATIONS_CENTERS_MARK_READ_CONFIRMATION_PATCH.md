# T110 — Operations Centers Mark Read Confirmation Patch

## Status
Patched.

## Scope
Production file changed:

- `public/control-center/pages/operations-centers.js`

## Why patch was needed
T108/T109 confirmed that most Operations Centers actions are refresh/read-only, route-only, copy-only, prompt-only, shared-context-only, or disabled.

One supported durable backend mutation remained:

- Notification Center `Mark Read`

This action calls:

- `context.markProjectNotification(projectName, notificationId, { status: "read", read: true })`

Although this is read-state only and does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute, it still mutates durable backend notification state.

## Patch summary
Added explicit confirmation before `context.markProjectNotification`.

The confirmation message clarifies:

- the action only marks a notification as read,
- it updates durable notification read-state,
- it does not acknowledge/resolve/dismiss/delete/send/approve/publish/execute,
- the operator can cancel to keep the notification unread.

## Not changed
No redesign.
No CSS changes.
No backend changes.
No route changes.
No data/projects changes.
No new notification lifecycle controls.

## Validation
Use:

- `node --check public/control-center/pages/operations-centers.js`
- `node --check scripts/audit/operations-centers-runtime-authority-audit.mjs`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

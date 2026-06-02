# PHASE 3AB.1 — Notification Center Finalization Decision

## Decision Status
Closed as audit-only after source review.

## Source Truth
Notification Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `notificationCenterRoute`
- id: `notification-center`

It is not implemented as a standalone page file.

## Evidence Summary
Notification Center exists as a route/surface inside `operations-centers.js`.

Confirmed:
- `notificationCenterRoute` exports the route.
- route id is `notification-center`.
- page shell uses `data-page="notification-center"`.
- API includes `fetchProjectNotificationCenter`.
- Notification Center refresh uses `fetchProjectNotificationCenter`.
- Notification Center table/search/filter/select behavior is local UI/session state.
- Notification Center AI actions use prompt/context routing only.
- Notification Center route action navigates to source/owning page.
- Notification Center includes a real active `Mark Read` action when `selectedItem.notification_id` exists.
- `Mark Read` calls `context.markProjectNotification(projectName, notificationId, { status: "read", read: true })`.
- API includes `markProjectNotification`.
- Backend exposes PATCH notification routes.
- Deferred controls exist and remain disabled:
  - Acknowledge notification.
  - Resolve notification.
  - Dismiss notification.
  - Delete notification.

This means Notification Center is not purely read/review. It currently includes one active durable notification mutation: mark-read.

## Confirmed Ownership
Notification Center currently owns:
- notification visibility.
- notification metrics projection.
- alert/inbox review.
- focus filter.
- severity filter.
- notification search.
- selected notification detail review.
- source/route review.
- route guidance to source page.
- AI guidance prompt/context for notification review.
- refreshing notification center live data.
- marking a backend notification as read where a notification id is present.

## Confirmed Non-Ownership
Notification Center currently does not actively own:
- acknowledging notifications.
- resolving notifications.
- dismissing notifications.
- deleting notifications.
- sending notifications/emails/messages.
- customer operations execution.
- Governance approval.
- Publishing execution.
- worker/job execution.
- destructive notification mutation.
- silent automation execution.
- policy bypass.

## Notification Mutation Risks
Notification Center has one active mutation:
- Mark Read.

Risk level:
- Low/Medium if limited to read status.
- Higher if PATCH can update arbitrary notification fields without backend constraints.

This must be checked in 3AB.2.

Deferred disabled actions are higher risk if enabled:
- Acknowledge.
- Resolve.
- Dismiss.
- Delete.

These require explicit mutation design, confirmation model, backend authority review, and test dataset before enabling.

## Message / External Send Boundary Risks
No active send notification/email/message control was confirmed in this surface.

However, because Notification Center may display provider/customer/operations alerts, copy must not imply:
- sending messages.
- notifying external users.
- executing customer operations.
- resolving backend incidents automatically.

## Queue / Job / Governance Boundary Risks
Notification Center aggregates signals from approvals, provider health, publishing, claim risk, and workflows.

It must not bypass:
- Governance policy/approval authority.
- Publishing execution authority.
- Queue Center queue-review ownership.
- Job Monitor worker/job execution boundaries.
- Task Center durable task mutation ownership.

## Browser QA Requirements
Browser QA should confirm:
- Notification Center route loads.
- Refresh works as read/projection refresh.
- Search/filter/select are UI-only.
- Mark Read is clearly represented as an active backend mutation if available.
- Acknowledge/Resolve/Dismiss/Delete remain disabled.
- Open Source Page routes only.
- AI panel is guidance/context-only.
- No delete/resolve/dismiss/acknowledge action is executed.
- No external send is executed.
- No Governance approval is executed.
- No publishing/job/queue mutation is executed.

## Recommended Next Phase
`PHASE 3AB.2 — Notification Center Mutation Safety Audit`

Reason:
Notification Center includes a real active `Mark Read` backend mutation. Before copy patch or closeout, we need a focused mutation-safety matrix for:
- Refresh Notification Center.
- Search/filter/select.
- Open Source Page.
- AI prompt/guidance.
- Mark Read active mutation.
- Acknowledge disabled control.
- Resolve disabled control.
- Dismiss disabled control.
- Delete disabled control.
- Backend notification-center read route.
- Backend notification PATCH route.
- Cross-page Governance/Publishing/Queue/Job boundaries.

## Production Safety Rules
Until 3AB.2 is complete:
- Do not patch Notification Center UI.
- Do not enable disabled notification mutation buttons.
- Do not broaden Mark Read behavior.
- Do not change backend notification PATCH behavior.
- Do not test destructive notification mutation actions on real project data.
- Do not claim full Notification Center mutation safety.

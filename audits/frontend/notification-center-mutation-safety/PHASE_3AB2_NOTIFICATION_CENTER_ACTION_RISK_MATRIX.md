# PHASE 3AB.2 — Notification Center Mutation Action Risk Matrix

## Status
Completed from static evidence review.

No browser mutation was executed in this phase.

## Summary Decision
Notification Center is a review/projection/routing/AI-guidance surface with one active low/medium-risk backend mutation:

- Mark Read.

Confirmed:
- Notification Center reads live notification-center payload through `fetchProjectNotificationCenter`.
- Refresh is read-only.
- Search, focus, severity filter, and selection are local UI/session state.
- Open Source Page is navigation only.
- AI buttons route/prompt context only.
- Mark Read is active only when `selectedItem.notification_id` exists.
- Mark Read calls `markProjectNotification(projectName, notificationId, { status: "read", read: true })`.
- Frontend API exposes `markProjectNotification`.
- Backend exposes PATCH notification routes.
- Acknowledge/Resolve/Dismiss/Delete controls are disabled and labelled deferred.
- No active external send/email/message control was confirmed in Notification Center.
- Governance/Publishing/Queue/Job boundaries are referenced as signal sources but are not mutated by Notification Center, except notification read state.

## Action Matrix

| Action / Flow | Surface | Handler Evidence | Mutation Type | Backend/API? | Ownership Boundary | Confirmation? | Risk | Notes |
|---|---|---|---:|---:|---:|---:|---|---|
| Notification Center Refresh | Notification Center | `notificationCenterRefreshBtn`, `notificationCenterRefreshBtnHeader`, `refreshNotificationCenter`, `fetchProjectNotificationCenter` | Read/fetch only | Yes, GET `/notification-center` | Notification Center projection only | No | Low | Refreshes live notification projection. |
| Search/Focus/Severity Filter | Notification Center | `notificationCenterSearch`, `notificationCenterSeverity`, focus tabs, session fields | UI/session state only | No | Local page state | No | Low | Filters visible alerts/inbox items locally and re-renders. |
| Select Notification | Notification Center | `bindOpsSelectionButtons`, `session.selectedKey` | UI/session state only | No | Local page state | No | Low | Selects detail view only. |
| Open Source Page | Notification Center | `renderRouteAction`, `bindRouteButtons` | Navigation only | No | Destination-owned | No | Low | Routes to owning/source page. Destination surface owns its own mutations. |
| Open AI Prompt | Notification Center | `buildOpsAssistantPrompts("notification-center")`, `bindOpsAssistantButtons` | Prompt/context only | No backend mutation | AI guidance only | No | Low-medium | AI guidance only. Must not imply acknowledge/resolve/delete/send authority. |
| Mark Read | Notification Center | `[data-mark-read]`, `markProjectNotification(projectName, notificationId, { status: "read", read: true })` | Durable notification read-state mutation | Yes, PATCH `/notifications/:notificationId` | Notification Center owns read-state update only | No | Low/Medium | Acceptable only if backend constrains PATCH to read/status update. Needs clear copy and should not imply resolve/delete/acknowledge. |
| Acknowledge notification disabled control | Notification Center | Disabled button `Acknowledge notification (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned | Not applicable | Safe-disabled / High if enabled | Would require explicit mutation design and backend constraints before enabling. |
| Resolve notification disabled control | Notification Center | Disabled button `Resolve notification (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned | Not applicable | Safe-disabled / High if enabled | Resolution may close operational incidents or alerts. Must remain disabled until designed. |
| Dismiss notification disabled control | Notification Center | Disabled button `Dismiss notification (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned | Not applicable | Safe-disabled / Medium-high if enabled | Could hide/clear operational signals. Needs confirmation and audit trail if enabled. |
| Delete notification disabled control | Notification Center | Disabled button `Delete notification (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned | Not applicable | Safe-disabled / High if enabled | Destructive mutation. Must remain disabled until explicit destructive safety pass. |
| Backend Notification Center Read Route | Backend | GET `/media-manager/project/:project/notification-center` and public equivalent | Read/projection | Yes | Backend projection payload | No | Low | Reads notification center snapshot. |
| Backend Notification Patch Route | Backend | PATCH `/media-manager/project/:project/notifications/:notificationId` and public equivalent | Durable notification mutation | Yes | Backend authority | No in current Mark Read UI | Medium/High | Needs backend constraint review. If arbitrary payloads are accepted, risk is higher than Mark Read UI suggests. |
| External Send / Email / Message | System | No active Notification Center send control confirmed | None in this surface | No active handler shown | Not owned by Notification Center | Not applicable | Not active / Critical if added | Sending external notifications must stay integration/workflow-owned with confirmation and audit. |
| Governance / Publishing Boundary | Governance/Publishing | Alerts reference approvals/publishing signals; route actions navigate | Signal review only | No direct mutation from Notification Center except read state | Governance/Publishing-owned | Not applicable | Medium boundary risk | Notification Center must not approve, publish, freeze/unfreeze, or bypass policy. |

## Key Findings

### 1. Notification Center is not purely read-only
Unlike Queue Center and Job Monitor, Notification Center includes one active backend mutation: Mark Read.

### 2. Mark Read is low/medium risk if constrained
Mark Read is acceptable only if it remains limited to notification read/status state. Copy must clarify it updates read state only and does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.

### 3. Backend PATCH route requires authority clarity
The frontend sends `{ status: "read", read: true }`, but the backend PATCH route must be treated as broader-risk until constraints are confirmed. Future backend audit should verify allowed fields.

### 4. Deferred controls are correctly disabled
Acknowledge, Resolve, Dismiss, and Delete remain disabled. They are higher-risk if enabled because they can change incident/alert lifecycle or remove evidence.

### 5. No external send control confirmed
No active send notification/email/message control was confirmed in Notification Center.

### 6. Copy needs boundary clarification
Current text says “Safe actions are active” and “mark notifications as read where supported.” This should be clarified to say:
- Active actions are refresh, route, AI guidance, and mark-read only where an inbox notification id exists.
- Mark Read updates read state only.
- Acknowledge/Resolve/Dismiss/Delete remain disabled.
- AI cannot mark read, acknowledge, resolve, dismiss, delete, send, approve, publish, or execute backend actions.

## Required Decision
Proceed to:
`PHASE 3AB.3 — Notification Center Boundary Copy / Mark-Read Mutation Safety Plan`

Reason:
Notification Center has one active durable mutation, so the next step is not a generic copy patch. It must explicitly plan:
- Mark Read copy/ownership.
- Disabled lifecycle actions copy.
- AI guidance boundary.
- Route/source navigation boundary.
- Backend PATCH boundary note.
- Browser QA checks that do not execute destructive actions.

## Production Safety Rules
Until 3AB.3 and follow-up patch are complete:
- Do not broaden Mark Read behavior.
- Do not enable acknowledge/resolve/dismiss/delete.
- Do not change backend notification PATCH behavior.
- Do not add external send behavior.
- Do not claim Notification Center is read-only.

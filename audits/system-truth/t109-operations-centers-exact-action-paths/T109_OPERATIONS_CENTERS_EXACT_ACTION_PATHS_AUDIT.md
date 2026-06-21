# T109 — Operations Centers Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact runtime action paths in:

- `public/control-center/pages/operations-centers.js`

This follows T108, which confirmed Operations Centers contains task, queue, job, notification, AI, and handoff signals.

## Surfaces to classify

### 1. Task Center
Expected classification:
- Refresh/read only via fetchProjectTaskCenter.
- Copy selected task summary only.
- Copy incoming handoff summary only.
- Incoming handoff must remain review-only.
- Task create/update/delete/assign/status mutations should be disabled or absent.

### 2. Queue Center
Expected classification:
- Refresh/read only via fetchProjectQueueCenter.
- Select/filter/route only.
- Queue mutation actions should be disabled or absent.

### 3. Job Monitor
Expected classification:
- Refresh/read only via fetchProjectJobMonitor.
- Retry/cancel/rerun/delete should be disabled or absent.
- Route/AI guidance only.

### 4. Notification Center
Expected classification:
- Refresh/read only or local state only.
- Mark read/archive/delete/resolve/send actions must be absent, disabled, or confirmation-gated if backend mutation exists.

### 5. Operations Overview
Expected classification:
- Navigation/route cards only.
- No backend mutation.

### 6. AI Assistant
Expected classification:
- Prompt/context only.
- Must not create tasks, assign owners, change statuses, send notifications, approve, publish, or execute backend actions.

### 7. Shared handoffs
Expected classification:
- Review-only context or copy only.
- No durable task/queue/job/notification is created automatically.

## Decision Rule
- If actions are refresh/read-only, copy-only, route-only, prompt-only, or disabled, close without patch.
- If any backend mutation exists without confirmation, patch narrowly.
- If AI wording overclaims authority, patch wording only.
- Do not redesign Operations Centers.

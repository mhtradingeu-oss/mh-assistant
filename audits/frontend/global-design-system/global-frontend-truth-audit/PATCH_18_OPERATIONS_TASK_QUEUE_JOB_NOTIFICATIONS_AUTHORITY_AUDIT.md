# Patch 18 — Operations / Task / Queue / Job / Notifications Authority Audit

## Status

Audit-only / no production change.

This audit maps the Operations Overview, Task Center, Queue Center, Job Monitor, and Notification Center authority boundaries before any Operations production polish is considered.

## Production Decision

No production code was changed.

Reason:

- Operations pages control live operational projections.
- Task Center displays task ownership, priority, due-state, linked work, and AI review context.
- Queue Center displays queue pressure and routing context.
- Job Monitor displays job health, retry state, and execution context.
- Notification Center displays route-aware alerts, inbox history, read-state actions, and Governance decision actions.
- Most task/queue/job lifecycle mutations are explicitly disabled.
- Notification read-state is an allowed limited mutation where a backend notification id exists.
- Governance decision actions can update durable Governance approval records and are confirmation-gated.
- Any future production change must preserve no-silent-mutation boundaries and route/destination ownership.

## Current Active File

- `public/control-center/pages/operations-centers.js`

## Existing Strengths

Confirmed current Operations capabilities:

- Operations Overview route.
- Task Center route.
- Queue Center route.
- Job Monitor route.
- Notification Center route.
- Route-aware operational cards.
- Focus/filter controls.
- Selected item inspection.
- Refresh controls.
- Copy selected task summary.
- Copy task handoff summary.
- AI review prompts.
- Navigation to owning workspace.
- Disabled task mutation controls.
- Disabled queue mutation controls.
- Disabled job mutation controls.
- Disabled notification lifecycle controls.
- Notification read-state button.
- Governance approval decision buttons inside notification context.
- Confirmation text before Governance decision.

## Task Center Contract

Task Center displays and filters task data from operations state and optional live refresh.

Task Center supports:

- refresh
- focus filters
- priority filter
- owner filter
- source filter
- search
- selected task inspection
- open owning workspace
- copy selected task summary
- copy handoff summary
- AI review prompts

Task mutations are explicitly deferred and disabled:

- update status
- reassign owner
- change priority
- update due date
- delete task

These disabled controls must remain disabled until a dedicated backend policy and mutation safety pass is approved.

## Queue Center Contract

Queue Center displays and filters queue data.

Queue Center supports:

- refresh
- focus filters
- status filter
- search
- selected queue item inspection
- open owning workspace
- AI review prompts

Queue mutation actions are explicitly disabled:

- retry item
- approve item
- publish item
- remove item

Approval and publishing remain Governance/Publishing-owned.

## Job Monitor Contract

Job Monitor displays and filters job execution projections.

Job Monitor supports:

- refresh
- focus filters
- kind filter
- search
- selected job inspection
- open owning context
- AI review prompts

Job mutation actions are explicitly disabled:

- retry job
- cancel job
- rerun job
- delete job

These require future backend worker-control and destructive mutation safety review.

## Notification Center Contract

Notification Center displays route-aware alerts and inbox history.

Notification Center supports:

- refresh
- focus filters
- severity filter
- search
- selected notification inspection
- open owning source page
- AI review prompts
- limited Mark Read action where a backend notification id exists
- Governance decision actions for linked approval records

Notification lifecycle actions are explicitly disabled:

- acknowledge notification
- resolve notification
- dismiss notification
- delete notification

## Notification Read-State Boundary

Notification Center includes:

- `data-mark-read`

This action is explicitly labeled as read-state only.

It must not be confused with:

- acknowledge
- resolve
- dismiss
- delete
- send
- approve
- publish
- execute

Any future change must preserve this limited read-state boundary.

## Governance Decision Boundary

Notification Center can render Governance decision actions when a selected notification links to an approval record.

Observed actions include:

- approve
- reject
- request changes
- escalate

These use:

- `data-governance-decision`
- `data-approval-id`
- confirmation dialog

The confirmation states this updates a durable Governance approval record and does not publish, send, or execute anything directly.

This boundary must remain explicit.

## AI Review Boundary

Operations AI buttons use:

- `data-ops-ai-open`
- `data-ops-ai-prompt`

AI actions prepare context only and navigate/open AI review.

They do not create tasks, assign owners, retry jobs, approve items, publish items, resolve notifications, or execute backend operations.

## Route Boundary

Operations route buttons use:

- `data-ops-route`
- `data-ops-label`

These open owning or related workspaces only.

Route navigation must not be confused with mutation or execution.

## Data Attribute Inventory

Observed Operations attributes include:

- `data-ops-ai-open`
- `data-ops-ai-prompt`
- `data-ops-focus`
- `data-ops-label`
- `data-ops-route`
- `data-ops-select`
- `data-mark-read`
- `data-governance-action`
- `data-governance-decision`
- `data-approval-id`

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. Task mutation disabled controls
2. Queue mutation disabled controls
3. Job mutation disabled controls
4. Notification lifecycle disabled controls
5. `data-mark-read`
6. notification read-state backend behavior
7. `data-governance-decision`
8. Governance decision confirmation
9. approval id handling
10. route ownership behavior
11. AI prompt behavior
12. refresh behavior
13. task live fetch behavior
14. queue live fetch behavior
15. job live fetch behavior
16. notification live fetch behavior
17. selected item state
18. copy summary behavior
19. copy handoff behavior
20. any future retry/run/cancel/delete/approve/publish behavior

## Recommended Future Patch

### Patch 18B — Operations Read-State / Governance Decision / Mutation Boundary Contract Audit

Before any production patch, map exact functions and backend calls for:

- Task Center refresh
- Queue Center refresh
- Job Monitor refresh
- Notification Center refresh
- notification mark-read
- Governance decision handling
- Governance refresh
- route action handling
- AI prompt handling
- copy summary / handoff behavior
- disabled mutation controls

Allowed scope:

- audit documentation only unless a very narrow copy guard is proven safe

Forbidden:

- handler changes
- API changes
- read-state behavior changes
- Governance decision behavior changes
- disabled mutation activation
- route destination changes
- AI prompt behavior changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/operations-centers.js`
- route IDs:
  - `operations-centers`
  - `task-center`
  - `queue-center`
  - `job-monitor`
  - `notification-center`
- all Operations data attributes
- all refresh behavior
- all route behavior
- all AI prompt behavior
- all disabled mutation controls
- all notification read-state behavior
- all Governance decision behavior
- all backend/API behavior
- all project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/operations-centers.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future Operations production patch:

- Open Operations Overview.
- Open Task Center.
- Refresh Task Center.
- Select and filter tasks.
- Copy selected task summary.
- Open AI task review.
- Confirm task mutation buttons remain disabled.
- Open Queue Center.
- Refresh Queue Center.
- Select and filter queue items.
- Confirm queue retry/approve/publish/remove remain disabled.
- Open Job Monitor.
- Refresh Job Monitor.
- Select and filter jobs.
- Confirm retry/cancel/rerun/delete remain disabled.
- Open Notification Center.
- Refresh Notification Center.
- Select and filter notifications.
- Mark Read only in a safe test project.
- Confirm Mark Read affects read-state only.
- Use Governance decision only in a safe test project.
- Confirm Governance decision requires confirmation.
- Confirm no publish/send/execute action is introduced.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

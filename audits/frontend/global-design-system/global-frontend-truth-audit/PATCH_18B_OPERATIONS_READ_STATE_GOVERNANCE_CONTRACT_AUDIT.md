# Patch 18B — Operations Read-State / Governance Decision / Mutation Boundary Contract Audit

## Status

Audit-only / no production change.

This audit maps the Operations refresh, route, AI prompt, read-state, Governance decision, copy/handoff, and disabled mutation boundaries for Operations Overview, Task Center, Queue Center, Job Monitor, and Notification Center.

## Production Decision

No production code was changed.

Reason:

- Operations surfaces display operational state and routing context.
- Task, Queue, and Job mutation controls remain explicitly disabled.
- Notification Center has one limited read-state action where a backend notification id exists.
- Governance decision actions may update durable Governance approval records, but they are confirmation-gated.
- Operations AI prompts prepare context only.
- Operations Overview routes to owning workspaces only and does not execute jobs, mutate tasks, send notifications, approve workflows, mark notifications read, publish, or trigger workers.
- Any future production change must preserve no-silent-mutation boundaries.

## Current Active File

- `public/control-center/pages/operations-centers.js`

## Shared Operations Helper Contract

Operations uses shared helpers for:

- route buttons
- AI prompt opening
- focus filters
- item selection
- assistant prompt generation
- route action rendering
- selected item state
- search/filter behavior

Key helpers include:

- `bindRouteButtons`
- `setAiPrompt`
- `bindOpsFocusButtons`
- `bindOpsSelectionButtons`
- `bindOpsAssistantButtons`
- `buildOpsAssistantPrompts`
- `renderRouteAction`

These helpers are shared across Task, Queue, Job, Notification, and Operations Overview surfaces.

## Refresh Contract

Operations refresh behavior can use page-specific fetch functions when available:

- `fetchProjectTaskCenter`
- `fetchProjectQueueCenter`
- `fetchProjectJobMonitor`
- `fetchProjectNotificationCenter`

If page-specific live fetch is unavailable, some refresh paths can fall back to:

- `reloadProjectData(projectName)`

Refresh updates projections only. It must not mutate task status, queue state, job lifecycle, notification lifecycle, or approval decisions.

## Task Center Contract

Task Center supports:

- refresh
- focus filters
- priority filter
- owner filter
- source filter
- search
- selected task inspection
- owning workspace route
- copy selected task summary
- copy handoff summary
- AI task review prompts

Task mutation controls remain disabled:

- update status
- reassign owner
- change priority
- update due date
- delete task

These must not be enabled without a dedicated backend mutation safety pass.

## Queue Center Contract

Queue Center supports:

- refresh
- focus filters
- status filter
- search
- selected queue item inspection
- owning workspace route
- AI queue review prompts

Queue mutation controls remain disabled:

- retry item
- approve item
- publish item
- remove item

Approval remains Governance-owned. Publishing remains Publishing-owned.

## Job Monitor Contract

Job Monitor supports:

- refresh
- focus filters
- kind filter
- search
- selected job inspection
- owning context route
- AI job review prompts

Job mutation controls remain disabled:

- retry job
- cancel job
- rerun job
- delete job

These require future backend worker-control and destructive mutation safety review.

## Notification Center Contract

Notification Center supports:

- refresh
- focus filters
- severity filter
- search
- selected notification inspection
- owning source route
- AI notification review prompts
- limited Mark Read action
- Governance decision actions for linked approval records

Notification lifecycle controls remain disabled:

- acknowledge notification
- resolve notification
- dismiss notification
- delete notification

## Notification Read-State Contract

Notification read-state uses:

- `data-mark-read`
- backend notification id
- `markProjectNotificationRead`

The visible copy states:

- Mark Read updates read-state only.
- It does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.

This boundary must remain explicit.

## Governance Decision Contract

Governance decision actions use:

- `data-governance-action`
- `data-governance-decision`
- `data-approval-id`
- `fetchProjectGovernance`
- `decideProjectApproval`
- `window.confirm`

Observed decisions include:

- approved
- rejected
- changes_requested
- escalated

The confirmation states this updates a durable Governance approval record and does not publish, send, or execute anything directly.

This is a real durable authority path and must remain confirmation-gated.

## AI Prompt Contract

Operations AI prompts use:

- `data-ops-ai-open`
- `data-ops-ai-prompt`
- `quickCommandInput`
- navigation/opening to AI Command

AI actions prepare context only. They do not create tasks, assign owners, retry jobs, approve queue items, publish items, resolve notifications, or execute backend operations.

## Route Contract

Operations routes use:

- `data-ops-route`
- `data-ops-label`

These open owning workspaces or related pages only.

Route navigation must not be confused with execution or mutation.

## Disabled Mutation Contract

The following must remain disabled unless explicitly implemented with backend safety gates:

- create task from draft
- execute workflow
- acknowledge signal
- update task status
- reassign task owner
- change task priority
- update task due date
- delete task
- retry queue item
- approve queue item
- publish queue item
- remove queue item
- retry job
- cancel job
- rerun job
- delete job
- acknowledge notification
- resolve notification
- dismiss notification
- delete notification

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `markProjectNotificationRead`
2. `data-mark-read`
3. read-state messaging
4. `fetchProjectGovernance`
5. `decideProjectApproval`
6. `data-governance-decision`
7. `data-approval-id`
8. Governance confirmation wording
9. task mutation disabled controls
10. queue mutation disabled controls
11. job mutation disabled controls
12. notification lifecycle disabled controls
13. refresh fallback behavior
14. route action behavior
15. AI prompt behavior
16. copy summary / handoff behavior
17. selected item state
18. filters and search behavior
19. future retry/run/cancel/delete implementations
20. future approve/publish implementations

## Recommended Future Patch

### Patch 18C — Operations Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- Mark Read versus acknowledge/resolve/dismiss
- Governance decision versus publish/send/execute
- refresh versus mutation
- route versus execute
- AI review versus task/job/queue mutation
- disabled future mutation controls

Allowed:

- copy-only changes
- closeout documentation

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
- notification read-state behavior
- Governance decision behavior
- backend/API behavior
- project data behavior

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
- Confirm it routes only and does not execute.
- Open Task Center.
- Refresh Task Center.
- Select and filter tasks.
- Copy selected task summary.
- Confirm task mutation buttons remain disabled.
- Open Queue Center.
- Refresh Queue Center.
- Confirm retry/approve/publish/remove remain disabled.
- Open Job Monitor.
- Refresh Job Monitor.
- Confirm retry/cancel/rerun/delete remain disabled.
- Open Notification Center.
- Refresh Notification Center.
- Mark Read only in a safe test project.
- Confirm Mark Read affects read-state only.
- Use Governance decision only in a safe test project.
- Confirm Governance decision requires confirmation.
- Confirm AI prompts route to AI review only.
- Confirm no publish/send/execute action is introduced.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

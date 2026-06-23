# T152 — Operations Centers UX Contract

## Status
Contract only. No implementation.

## Baseline
- c78f1c9 Close frontend CSS foundation audit

## Prior Authority
- T150 closed Operations Centers runtime authority.
- T151 closed frontend CSS foundation and operating-surface audit.

## Scope
Define the UX contract for:
- Operations Centers
- Task Center
- Queue Center
- Job Monitor
- Notification Center

## Hard Constraints
No production code changes in this phase.
No CSS changes.
No backend changes.
No route changes.
No API changes.
No data/projects changes.
No action behavior changes.
No mutation behavior changes.
No provider execution changes.
No AI execution changes.

## CSS Ownership
Approved CSS owner for future implementation:
- `public/control-center/styles/09-operations-centers.css`

Do not expand:
- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`

## Target Operating Surface Standard

Every Operations surface should clearly expose:

1. Page mission/header
2. Current operational state
3. Main working view
4. Right-side Action Panel
5. AI guidance/context panel
6. Safe next action
7. Disabled future mutations
8. Backend-owned mutation boundaries
9. Empty/loading/error states
10. No hidden execution behind generic buttons

## Operations Centers Contract

### Purpose
A routing and operational overview surface.

### Must Communicate
- This page does not execute jobs.
- This page does not mutate tasks.
- This page does not send notifications.
- This page does not approve workflows.
- This page routes to owning workspaces.

### Primary User Outcome
The user understands operational health and chooses the right workspace.

## Task Center Contract

### Purpose
Review assigned or generated tasks safely.

### Active Allowed Actions
- Refresh
- Select task
- Copy task/handoff summary
- Open AI guidance/context
- Route/handoff

### Disabled Actions
- Update status
- Reassign owner
- Change priority
- Update due date
- Delete task

### UX Requirement
Disabled actions must remain visible but clearly explained as future mutation-safety work.

## Queue Center Contract

### Purpose
Review queue pressure and route items to the owning workspace.

### Active Allowed Actions
- Refresh
- Select queue item
- Open AI guidance/context
- Route/handoff

### Disabled Actions
- Retry item
- Approve item
- Publish item
- Remove item

### UX Requirement
Queue actions must never imply silent execution.

## Job Monitor Contract

### Purpose
Review job and worker execution state.

### Active Allowed Actions
- Refresh
- Select job
- Open AI guidance/context
- Route/handoff

### Disabled Actions
- Retry job
- Cancel job
- Rerun job
- Delete job

### UX Requirement
Worker-control actions must remain disabled until backend authority and confirmation gates are explicitly approved.

## Notification Center Contract

### Purpose
Review operational alerts, unread signals, provider health, approvals, publishing risks, and workflow completion signals.

### Active Allowed Actions
- Refresh
- Select notification
- Open AI guidance/context
- Mark Read where supported

### Limited Backend-owned Mutation
- Mark Read updates notification read-state only.
- It must not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute anything.

### Governance Approval Decisions
- Approve
- Reject
- Request Changes
- Escalate

These update durable Governance approval records only and must not publish, send, or execute directly.

## Visual UX Contract

### Layout
Prefer:
- Header/context ribbon
- Main list/table/detail area
- Right rail
- Action panel
- AI guidance panel

### Interaction
All risky actions must be:
- disabled,
- confirmed,
- or routed to the owning authority surface.

### Copy
Use explicit language:
- "review"
- "route"
- "guidance"
- "read-state only"
- "disabled until mutation safety pass"
- "does not execute"

Avoid vague language:
- "run"
- "send"
- "approve"
- "publish"
- "execute"
unless backend authority and confirmation are present.

## Implementation Gate
No patch may begin until this contract is reviewed and accepted.

## Next Step
T153 should implement the smallest safe Operations UX polish using only:
- `public/control-center/styles/09-operations-centers.css`

T153 must include Browser QA for:
- `#operations-centers`
- `#task-center`
- `#queue-center`
- `#job-monitor`
- `#notification-center`

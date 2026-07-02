# PHASE 3Y.3 — Task Center Boundary Copy / Deferred Mutation Safety Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3Y.2 — Task Center Backend / Mutation Boundary Safety Audit`
- Previous commit: `393b9c9 Add Task Center mutation safety audit`

## Source Truth
Task Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `taskCenterRoute`
- id: `task-center`

## Purpose
Plan safe copy/label improvements for Task Center after mutation boundary audit confirmed:

- Task Center itself is currently read/review/copy/filter/handoff.
- Active Task Center controls do not mutate task records.
- Task mutation controls are disabled and deferred.
- Incoming handoffs are review-only and do not create durable tasks automatically.
- AI actions route/prompt only.
- Linked route actions navigate to owning workspaces.
- Real durable task creation exists elsewhere, especially Media Studio and backend POST `/tasks`.

## Evidence From PHASE 3Y.2

### Task Center safe active actions
- Refresh Task Center reads from `fetchProjectTaskCenter`.
- Search/filter/select are local UI/session state.
- Copy selected summary writes to clipboard only.
- Copy incoming handoff writes to clipboard only.
- Open AI Workspace / prompt routes context to AI Command only.
- Open linked work navigates to the linked owner route.

### Disabled/deferred actions
Task Center shows but disables:
- Update status.
- Reassign owner.
- Change priority.
- Update due date.
- Delete task.

These are correctly marked as deferred mutation safety pass actions.

### External task mutation
Confirmed durable mutation exists outside Task Center:
- Media Studio can create a task through `createProjectTask`.
- Backend exposes POST `/media-manager/project/:project/tasks`.
- Content Studio imports task APIs and needs deeper future audit before claiming no task create path.

## Copy Risk Areas

### 1. “Durable operational tasks”
Risk:
Could imply Task Center actively manages/mutates durable tasks.

Recommended copy direction:
- Review durable operational task records.
- Inspect ownership, due-state, and linked work.
- Mutations remain deferred until safety controls are approved.

### 2. “Execution backlog”
Risk:
Could imply execution authority.

Recommended copy direction:
- Operational task backlog.
- Review task risk and follow-up readiness.

### 3. Incoming Task Handoff
Risk:
Could imply incoming handoff creates a task.

Recommended copy direction:
- Incoming review-only task handoff.
- No durable task is created automatically.
- Copy or review before creating tasks in a controlled flow.

### 4. Task actions
Risk:
Disabled buttons may look like available functionality.

Recommended copy direction:
- Active actions are refresh, copy, route, and AI guidance only.
- Mutations are disabled until backend policy and mutation safety are approved.

### 5. AI Panel
Risk:
Could imply AI creates or mutates tasks.

Recommended copy direction:
- AI receives context/prompt only.
- AI cannot create durable tasks, assign owners, change status, or delete tasks from this panel.

### 6. Linked route actions
Risk:
Could imply Task Center executes linked work.

Recommended copy direction:
- Opens owning workspace for review.
- Destination route owns any future execution/mutation authority.

### 7. Route metadata
Risk:
Route description says “Manage durable tasks,” which may imply mutation authority.

Recommended copy direction:
- Review durable tasks, owners, due dates, priorities, filters, and linked operational entities.
- Avoid “manage” unless mutation controls are live and safe.

## Allowed Future Patch Scope
A future patch may change:
- Button labels.
- Helper copy.
- Section headings.
- Panel descriptions.
- Route metadata copy.
- Disabled action explanatory copy.
- AI panel safety copy.
- Incoming handoff copy.

A future patch must not change:
- Handlers.
- API calls.
- Backend routes.
- CSS.
- Data files.
- Task creation logic.
- Task mutation logic.
- Disabled/enabled state of mutation buttons.
- Media Studio task creation behavior.
- Content Studio behavior.
- AI behavior.

## Required Browser QA After Patch
Check:
- Task Center page loads.
- Copy says review/projection/handoff, not silent mutation.
- Incoming handoff says review-only and no durable task is created automatically.
- Disabled mutation buttons remain disabled.
- AI panel says guidance/context only.
- Linked route copy says destination-owned.
- Refresh remains read-only.
- No task creation or mutation occurs during QA.

## Recommended Next Phase
`PHASE 3Y.4 — Task Center Copy-Only Deferred Mutation Boundary Safe Patch`

Do not implement until this plan is reviewed and committed.

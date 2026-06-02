# PHASE 3AC.2 — Operations Overview Boundary Copy / Routing-Only Command Hub Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AC.1 — Operations Overview / Command Hub Finalization Truth Audit`
- Previous commit: `49a3bbb Add Operations Overview finalization truth audit`

## Source Truth
Operations Overview / Command Hub is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `operationsCentersRoute`
- id: `operations-centers`

Render:
- `renderOperationsCentersOverview(context)`

## Purpose
Plan safe copy/label improvements for the parent Operations Overview after truth audit confirmed:

- Operations Overview is routing-only.
- It computes metrics from `state.data.operations`.
- It routes to Task Center, Queue Center, Job Monitor, Notification Center, AI Team, and Workflows.
- It has disabled planned actions.
- It does not execute jobs.
- It does not mutate tasks.
- It does not send notifications.
- It does not approve workflows.
- It does not trigger backend mutation APIs.

## Evidence From PHASE 3AC.1

### Safe active actions
- Open Task Center routes only.
- Open Queue Center routes only.
- Open Job Monitor routes only.
- Open Notifications routes only.
- Open AI Team routes only.
- Open Workflows routes only.

### Disabled/planned actions
Operations Overview shows but disables:
- Planned: create task from draft.
- Planned: execute workflow.
- Planned: acknowledge signal.

These must remain disabled until future ownership/mutation design exists.

## Copy Risk Areas

### 1. “Operations Command Layer”
Risk:
Could imply command execution authority.

Recommended direction:
- Operations Routing Layer.
- Operations Visibility Layer.
- Operations Command Overview with explicit routing-only boundary.

### 2. “Execution Overview”
Risk:
Could imply this page executes jobs.

Recommended direction:
- Operations Health Overview.
- Execution Health Overview.
- Cross-center Operations Overview.

### 3. “A unified entry point for execution...”
Risk:
Could imply operational execution from the parent overview.

Recommended direction:
- A unified routing entry point for tasks, queues, job health, and notification signals.

### 4. “Command Handoff”
Risk:
Could imply mutation/dispatch.

Recommended direction:
- Routing Handoff.
- Center Routing.
- Choose the owning operations surface.

### 5. “Review before execution”
Risk:
Could imply execution is available from this page.

Recommended direction:
- Routing-only safety.
- Review in owning workspace.

### 6. Planned disabled actions
Risk:
Could imply soon-to-be-active mutation.

Recommended direction:
- Planned disabled: create task from draft — future task mutation safety pass.
- Planned disabled: execute workflow — future workflow execution safety pass.
- Planned disabled: acknowledge signal — future notification lifecycle mutation safety pass.

## Allowed Future Patch Scope
A future patch may change:
- Header copy.
- Section headings.
- Helper copy.
- Center card descriptions.
- Safety panel copy.
- Disabled planned action labels.
- Route metadata/label copy if present.

A future patch must not change:
- Handlers.
- Route wiring.
- API calls.
- Backend routes.
- CSS.
- Data files.
- Task mutation logic.
- Queue mutation logic.
- Job mutation logic.
- Notification mutation logic.
- Mark Read behavior.
- Publishing behavior.
- Governance behavior.
- AI behavior.
- Worker/scheduler behavior.
- Disabled/enabled state.

## Required Browser QA After Patch
Check:
- Operations Centers page loads.
- It routes correctly to:
  - Task Center.
  - Queue Center.
  - Job Monitor.
  - Notification Center.
  - AI Team.
  - Workflows.
- Planned actions remain disabled.
- Copy says routing/visibility/overview, not silent execution authority.
- No task mutation occurs.
- No queue mutation occurs.
- No job mutation occurs.
- No notification mutation occurs.
- No Mark Read occurs.
- No external send occurs.
- No publishing mutation occurs.
- No Governance approval occurs.
- No worker/scheduler execution occurs.

## Recommended Next Phase
`PHASE 3AC.3 — Operations Overview Copy-Only Routing Boundary Safe Patch`

Do not implement until this plan is reviewed and committed.

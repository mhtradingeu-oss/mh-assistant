# PHASE 3AC.1 — Operations Overview / Command Hub Finalization Decision

## Decision Status
Closed as audit-only after source review.

## Source Truth
Operations Overview / Command Hub is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `operationsCentersRoute`
- id: `operations-centers`

Render function:
- `renderOperationsCentersOverview(context)`

It is not implemented as a standalone page file.

## Evidence Summary
Operations Overview is the parent routing hub for Operations Centers.

Confirmed:
- The route export is `operationsCentersRoute`.
- The route id is `operations-centers`.
- The render function is `renderOperationsCentersOverview(context)`.
- The page shell uses `data-page="operations-centers"`.
- The overview computes local counts from `state.data.operations`.
- It renders cards for:
  - Task Center.
  - Queue Center.
  - Job Monitor.
  - Notification Center.
- Each card uses `data-route` navigation only.
- AI Team and Workflows buttons also use route navigation only.
- The Safety panel explicitly states:
  - this overview does not execute jobs.
  - this overview does not mutate tasks.
  - this overview does not send notifications.
  - this overview does not approve workflows.
  - it only routes to the owning workspace.
- Planned actions are disabled:
  - Planned: create task from draft.
  - Planned: execute workflow.
  - Planned: acknowledge signal.
- No active API mutation call was confirmed in this overview.
- No direct backend mutation route is called by this overview.
- No task, queue, job, notification, publishing, governance, worker, or external send mutation is active from this overview.

## Confirmed Ownership
Operations Overview currently owns:
- parent Operations entry point.
- cross-center visibility.
- operations metric counts from current state.
- routing to Task Center.
- routing to Queue Center.
- routing to Job Monitor.
- routing to Notification Center.
- routing to AI Team.
- routing to Workflows.
- high-level safety framing.
- disabled planned future action placeholders.

## Confirmed Non-Ownership
Operations Overview currently does not actively own:
- task creation.
- task assignment.
- task status mutation.
- queue mutation.
- publishing mutation.
- job retry/cancel/rerun/delete.
- worker/scheduler execution.
- notification lifecycle mutation.
- Mark Read mutation.
- external notification/email/message send.
- Governance approval.
- policy changes.
- destructive mutation.
- silent automation execution.
- policy bypass.

## Mutation / Execution Risks
Current active risk is low because the overview is routing-only.

Potential future risks:
- Planned create task from draft could become durable task mutation.
- Planned execute workflow could become workflow/backend execution.
- Planned acknowledge signal could become notification lifecycle mutation.
- “Command Layer” / “Execution Overview” copy could imply execution authority if not clarified.

These future actions must remain disabled until each has:
- ownership decision.
- backend authority review.
- confirmation model.
- audit trail.
- test dataset.
- browser QA.

## Cross-Center Boundary Risks
Operations Overview must preserve child-center boundaries:

- Task Center owns task review/projection/handoff, not silent task mutation.
- Queue Center owns queue review/projection/routing/AI guidance, not publishing mutation.
- Job Monitor owns job review/projection/routing/AI guidance, not retry/cancel/rerun/delete.
- Notification Center owns notification review/projection/routing/AI guidance plus Mark Read read-state only.
- Publishing owns publishing lifecycle mutations with confirmation and Governance gates.
- Governance owns approval/policy decisions.
- Worker/scheduler execution remains backend/system-owned.

## Browser QA Requirements
Browser QA should confirm:
- Operations Centers route loads.
- Cards route correctly to Task Center, Queue Center, Job Monitor, and Notification Center.
- AI Team and Workflows buttons route only.
- Planned actions remain disabled.
- No task mutation occurs.
- No queue mutation occurs.
- No job mutation occurs.
- No notification mutation occurs.
- No external send occurs.
- No publishing mutation occurs.
- No Governance approval occurs.
- No worker/scheduler execution occurs.
- Copy does not imply silent command execution.

## Recommended Next Phase
`PHASE 3AC.2 — Operations Overview Boundary Copy / Routing-Only Command Hub Plan`

Reason:
The overview is already safe as routing-only, but copy should be tightened before closeout to clarify:
- “Command Layer” means visibility/routing, not execution authority.
- “Execution Overview” means operational health overview, not job execution.
- Planned actions are disabled future mutation candidates.
- Task/Queue/Job/Notification mutations remain destination-owned.
- AI Team and Workflows are routing-only from this surface.

## Production Safety Rules
Until 3AC.2 and any future patch are complete:
- Do not enable planned actions.
- Do not add overview-level mutation handlers.
- Do not add overview-level backend mutation calls.
- Do not execute workflow/job/task/notification actions from the parent overview.
- Do not claim parent overview can operate autonomously.

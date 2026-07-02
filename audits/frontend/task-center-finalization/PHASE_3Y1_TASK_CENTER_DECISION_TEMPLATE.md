# PHASE 3Y.1 — Task Center Finalization Decision

## Decision Status
Closed as audit-only after source correction.

## Source Truth
Task Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `taskCenterRoute`
- id: `task-center`

It is not implemented as a standalone `task-center.js` file.

## Evidence Summary
Task Center exists as a route/surface inside `operations-centers.js`.

Confirmed:
- `taskCenterRoute` exports the route.
- route id is `task-center`.
- page shell uses `data-page="task-center"`.
- router imports/registers the route.
- nav contains `data-route="task-center"`.
- CSS exists for `[data-page="task-center"]`.
- API includes `fetchProjectTaskCenter`.
- backend includes `/media-manager/project/:project/task-center`.
- Workflows sends review-only task handoffs to Task Center.
- AI Command routes task-shaped output to Task Center.
- Operations overview references Task Center as an operations workspace.

The current Task Center surface appears primarily read/review/copy/filter/handoff oriented:
- Refresh Task Center fetches live data.
- Search/filter/focus/selection are local UI/session operations.
- Copy Selected Task Summary writes to clipboard only.
- Copy Handoff Summary writes to clipboard only.
- AI buttons route/prompt AI Command only.
- Incoming handoff is explicitly review-only.
- Mutation buttons are disabled and labelled deferred:
  - Update status.
  - Reassign owner.
  - Change priority.
  - Update due date.
  - Delete task.

However, backend task creation exists elsewhere in the system, and other pages can call task creation APIs. Therefore Task Center must still be audited as part of the broader task mutation boundary.

## Confirmed Ownership
Task Center currently owns:
- task queue visibility.
- task metrics projection.
- task filters and search.
- task selection and detail review.
- owner/status/due-state projection.
- incoming review-only handoff visibility.
- copying task summaries.
- copying incoming handoff summaries.
- routing linked work through route buttons.
- routing prompts/context to AI Command.
- refreshing task center live data.

## Confirmed Non-Ownership
Task Center currently does not actively own:
- task status mutation.
- task reassignment.
- priority mutation.
- due date mutation.
- task deletion.
- automatic durable task creation from handoff.
- Governance approval authority.
- Publishing execution.
- CRM/customer mutation.
- provider authentication.
- silent automation execution.
- policy bypass.

## Task Mutation Risks
Task Center itself has mutation actions disabled.

Risk remains because:
- backend task creation routes exist.
- frontend `createProjectTask` exists.
- Media Studio and Content Studio may create/link tasks.
- Workflows and AI Command route task-shaped handoffs to Task Center.
- Task Center copy says “durable operational tasks,” so copy must remain clear that the page reviews durable tasks but does not mutate them silently.

## Workflows / Automation Boundary Risks
Workflows can send review-only task handoffs to Task Center.

Current Task Center evidence says:
- incoming task handoff is review-only.
- no durable task is created automatically.
- handoff summary can be copied.
- AI Workspace can be opened for review.

This is good, but should be preserved and possibly strengthened in a future copy/boundary patch.

## Browser QA Requirements
Browser QA should confirm:
- Task Center route loads.
- Incoming handoff section, if present, says review-only.
- Task actions panel says mutation actions remain deferred and disabled.
- Disabled mutation buttons are visibly disabled.
- Refresh works without changing task state.
- Copy summary and copy handoff are non-destructive.
- AI actions route to AI Command only.
- No task mutation action is executed during QA.

## Recommended Next Phase
`PHASE 3Y.2 — Task Center Backend / Mutation Boundary Safety Audit`

Reason:
Task Center currently appears safe, but the system has backend task creation and task-related APIs used by other pages. Before copy patch or closeout, we need to map:
- `fetchProjectTaskCenter`
- `createProjectTask`
- `listProjectTasks`
- backend task routes
- Media Studio task creation
- Content Studio task creation
- Workflows task handoff
- AI Command task draft / task route
- whether any Task Center route can mutate tasks now or in deferred controls

## Production Safety Rules
Until 3Y.2 is complete:
- Do not patch Task Center UI.
- Do not enable disabled mutation buttons.
- Do not add task creation from handoff.
- Do not change backend task routes.
- Do not test mutating task actions on real project data.
- Do not claim full task mutation safety.

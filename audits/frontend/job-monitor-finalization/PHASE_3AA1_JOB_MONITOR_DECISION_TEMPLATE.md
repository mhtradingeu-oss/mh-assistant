# PHASE 3AA.1 — Job Monitor Finalization Decision

## Decision Status
Closed as audit-only after source review.

## Source Truth
Job Monitor is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `jobMonitorRoute`
- id: `job-monitor`

It is not implemented as a standalone page file.

## Evidence Summary
Job Monitor exists as a route/surface inside `operations-centers.js`.

Confirmed:
- `jobMonitorRoute` exports the route.
- route id is `job-monitor`.
- page shell uses `data-page="job-monitor"`.
- API includes `fetchProjectJobMonitor`.
- Job Monitor refresh uses `fetchProjectJobMonitor`.
- Job Monitor table/search/filter/select behavior is local UI/session state.
- Job Monitor AI actions use prompt/context routing only.
- Job Monitor route action navigates to job context.
- Job mutation buttons are disabled and labelled deferred:
  - Retry job.
  - Cancel job.
  - Rerun job.
  - Delete job.

The current Job Monitor surface appears primarily read/review/filter/route/guidance oriented.

However, Job Monitor is high-risk because its displayed concepts overlap with:
- execution monitoring.
- retry behavior.
- cancellation.
- rerun behavior.
- destructive deletion.
- worker/job lifecycle.
- media job APIs.
- publishing/workflow execution state.

## Confirmed Ownership
Job Monitor currently owns:
- job visibility.
- job metrics projection.
- running/completed/failed counts.
- job health projection.
- job item review.
- status focus filter.
- kind filter.
- job search.
- selected job detail review.
- execution log visibility.
- routing selected jobs to owning contexts.
- AI guidance prompt/context for job review.
- refreshing job monitor live data.

## Confirmed Non-Ownership
Job Monitor currently does not actively own:
- retrying jobs.
- canceling jobs.
- rerunning jobs.
- deleting jobs.
- marking jobs complete.
- resolving failures.
- worker execution.
- external provider execution.
- Publishing execution.
- Governance approval.
- destructive job mutation.
- silent automation execution.
- policy bypass.

## Job Mutation Risks
Job Monitor itself has mutation actions disabled.

Risk remains because:
- Job Monitor uses execution-oriented language.
- It displays retry counts, health state, status, and logs.
- It shows disabled retry/cancel/rerun/delete controls.
- Backend/API contains job-adjacent endpoints, including media job APIs.
- Operators may misunderstand Job Monitor as an execution console if copy is not clarified.

## Worker / Execution Boundary Risks
The highest-risk terms are:
- Execution inventory.
- Execution actions.
- Retry job.
- Cancel job.
- Rerun job.
- Delete job.
- Track running/completed/failed execution.

These terms must not imply that Job Monitor can trigger workers, rerun jobs, cancel jobs, or mutate job lifecycle directly.

## Queue / Publishing / Governance Boundary Risks
Job Monitor references workflows, media, and publishing execution.

It must not bypass:
- Queue Center ownership of queue review.
- Publishing ownership of publishing execution.
- Governance ownership of approval/policy.
- backend authority for execution/mutation.

## Browser QA Requirements
Browser QA should confirm:
- Job Monitor route loads.
- Refresh works as read-only projection.
- Search/filter/select are UI-only.
- Retry/Cancel/Rerun/Delete buttons remain disabled.
- Open Job Context routes only.
- AI panel is guidance/context-only.
- No job mutation action is executed.
- No worker execution is triggered.
- No publishing mutation is executed.
- No Governance approval is executed.

## Recommended Next Phase
`PHASE 3AA.2 — Job Monitor Execution / Mutation Safety Audit`

Reason:
Job Monitor appears safe in active UI, but it is execution-adjacent because it displays job retry/cancel/rerun/delete controls and job lifecycle concepts. Before copy patch or closeout, we need a focused mutation-safety matrix for:
- Refresh Job Monitor.
- Search/filter/select.
- Open Job Context.
- AI prompt/guidance.
- Retry job disabled control.
- Cancel job disabled control.
- Rerun job disabled control.
- Delete job disabled control.
- Backend job-monitor read route.
- Media job API routes.
- Worker/execution boundaries.
- Publishing/Governance boundary ownership.

## Production Safety Rules
Until 3AA.2 is complete:
- Do not patch Job Monitor UI.
- Do not enable disabled job mutation buttons.
- Do not connect Job Monitor to job mutation routes.
- Do not change backend job/media-job routes.
- Do not test job mutation actions on real project data.
- Do not claim full job mutation safety.

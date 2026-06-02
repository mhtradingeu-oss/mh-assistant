# PHASE 3Z.1 — Queue Center Finalization Decision

## Decision Status
Closed as audit-only after source review.

## Source Truth
Queue Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `queueCenterRoute`
- id: `queue-center`

It is not implemented as a standalone page file.

## Evidence Summary
Queue Center exists as a route/surface inside `operations-centers.js`.

Confirmed:
- `queueCenterRoute` exports the route.
- route id is `queue-center`.
- page shell uses `data-page="queue-center"`.
- router/app registers the route through the operations-center route set.
- API includes `fetchProjectQueueCenter`.
- backend includes `/media-manager/project/:project/queue-center`.
- AI Command knows `queue-center` as an operations destination.
- Operations overview references Queue Center as an operations workspace.

The current Queue Center surface appears primarily read/review/filter/route/guidance oriented:
- Refresh Queue Center fetches live queue-center data.
- Search, focus, status filter, and selected item state are local UI/session operations.
- Open Owner Page routes to the owning workspace.
- AI buttons route/prompt AI Command only.
- Queue mutation buttons are disabled and labelled deferred:
  - Retry item.
  - Approve item.
  - Publish item.
  - Remove item.

However, Queue Center is still high-risk because its displayed concepts overlap with:
- publishing queue.
- approval readiness.
- retry behavior.
- publish behavior.
- remove/destructive behavior.
- backend publishing mutation routes.
- Governance approval boundaries.

## Confirmed Ownership
Queue Center currently owns:
- queue visibility.
- queue metrics projection.
- queue item review.
- queue type focus and status filter.
- queue search.
- selected queue item detail review.
- queue pressure/risk visibility.
- routing selected items to owning pages.
- AI guidance prompt/context for queue review.
- refreshing queue center live data.

## Confirmed Non-Ownership
Queue Center currently does not actively own:
- retrying queue items.
- approving queue items.
- publishing queue items.
- removing queue items.
- external provider posting.
- Governance approval authority.
- Publishing execution authority.
- destructive queue mutation.
- silent automation execution.
- policy bypass.

## Queue Mutation Risks
Queue Center itself has mutation actions disabled.

Risk remains because:
- queue labels include approve/publish/retry/remove concepts.
- backend publishing mutation routes exist elsewhere.
- queue items may point to Publishing, Governance, Workflows, Media Studio, or other owner routes.
- operators may misunderstand Queue Center as an execution console if copy is not clarified.

## Publishing / Governance Boundary Risks
The highest risk terms are:
- Approve item.
- Publish item.
- Retry item.
- Remove item.
- Control workflow/content/media/approval/publishing queues.

These terms must not imply that Queue Center can approve Governance decisions or publish externally.

## Browser QA Requirements
Browser QA should confirm:
- Queue Center route loads.
- Refresh works as read-only projection.
- Search/filter/select are UI-only.
- Retry/Approve/Publish/Remove buttons remain disabled.
- Open Owner Page routes only.
- AI panel is guidance/context-only.
- No queue mutation action is executed.
- No publishing mutation action is executed.
- No Governance approval is executed.

## Recommended Next Phase
`PHASE 3Z.2 — Queue Center Execution / Mutation Safety Audit`

Reason:
Queue Center appears safe in active UI, but it is execution-adjacent because it displays queue actions that overlap with publishing and governance-sensitive operations. Before copy patch or closeout, we need a focused mutation-safety matrix for:
- Refresh Queue Center.
- Search/filter/select.
- Open Owner Page.
- AI prompt/guidance.
- Retry item disabled control.
- Approve item disabled control.
- Publish item disabled control.
- Remove item disabled control.
- Backend queue-center read route.
- Backend publishing schedule/reschedule/ready/publish/fail routes.
- Publishing/Governance boundary ownership.

## Production Safety Rules
Until 3Z.2 is complete:
- Do not patch Queue Center UI.
- Do not enable disabled queue mutation buttons.
- Do not connect Queue Center to publishing mutation routes.
- Do not change backend queue or publishing routes.
- Do not test publishing/queue mutation actions on real project data.
- Do not claim full queue mutation safety.

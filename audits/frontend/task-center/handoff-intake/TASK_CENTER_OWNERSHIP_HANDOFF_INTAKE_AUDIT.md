# Task Center Ownership & Handoff Intake Audit

## Purpose

Determine whether Task Center only opens as a generic operations surface or whether it consumes handoff payloads from Workflows and AI Command.

## Why this matters

Workflows can prepare task handoffs and route to Task Center. AI Command can also route task outputs to Task Center. Before visual polish, the handoff contract must be verified.

## Scope

Inspect:

- Task Center route ownership.
- Task Center module ownership.
- Shared handoff read access inside Task Center.
- Workflows handoff writes toward Task Center.
- AI Command handoff writes toward Task Center.
- Shared context contract.
- Task data source and task actions.

## Evidence files

- `01-task-center-route-ownership.txt`
- `02-task-center-handoff-read-access.txt`
- `03-workflows-task-handoff-write.txt`
- `04-ai-command-task-handoff-write.txt`
- `05-shared-context-contract.txt`
- `06-task-center-data-actions.txt`

## Questions to answer

- Is Task Center owned inside `operations-centers.js`?
- Does Task Center call `getSharedHandoff(...)`?
- Does Workflows write a handoff to destination `task-center`?
- Does AI Command write a handoff to destination `task-center`?
- Does Task Center display incoming handoff details?
- Are incoming task drafts shown separately from durable tasks?
- Are task actions local, routed, or backend-mutating?
- Should Task Center remain inside Operations Centers or become standalone later?

## Safety checklist

- [ ] No hidden durable task creation from handoff.
- [ ] No automatic task mutation when opening Task Center.
- [ ] Incoming handoff is review-only unless explicitly confirmed.
- [ ] AI-generated tasks are visually distinguished from durable tasks.
- [ ] User can see source page and payload summary.

## Current status

Pending evidence review.

## Recommendation

Do not polish Task Center until handoff intake behavior is classified.

## Evidence review result

The scan confirms that Task Center is routed and owned inside `operations-centers.js`.

Confirmed:

- `operations-centers.js` contains `renderTaskCenterLayout(...)`.
- `operations-centers.js` contains `renderTaskCenter(...)`.
- `operations-centers.js` exports `taskCenterRoute`.
- `index.html` includes the `task-center` navigation item.
- Workflows can open Task Center with `navigateTo("task-center")`.
- AI Command can route task outputs to `task-center`.
- Shared context exposes `setSharedHandoff(...)` and `getSharedHandoff(...)`.
- Task Center uses `operations.tasks` / `task_center.items` as its durable task data source.
- Sensitive mutation actions such as reassign owner, change priority, and update due date are disabled/deferred.

Not confirmed:

- Task Center does not appear to call `getSharedHandoff(...)` directly.
- Incoming handoff payloads from Workflows are not visibly rendered as a review-only intake.
- AI-generated task drafts are not clearly separated from durable operational tasks inside Task Center.

## Safety classification

Current Task Center behavior appears safe from hidden mutation:

- Opening Task Center does not automatically create durable tasks.
- Mutation-like controls are disabled/deferred.
- Refresh is the main live-data action.
- Copy summary is local/user-driven.

However, the handoff flow is incomplete:

- Workflows and AI Command can route users to Task Center.
- Task Center opens, but does not clearly display the incoming handoff as a first-class review item.

## Architectural decision

Task Center may remain inside `operations-centers.js` for now.

A standalone `task-center.js` split is not required immediately, but should remain future architecture debt if Task Center becomes a major destination-owned workflow.

## Required follow-up

Before visual polish, apply a small review-only intake visibility patch:

- Read incoming handoff using `getSharedHandoff(projectName, "task-center", operations)`.
- Display a compact "Incoming Task Handoff" card.
- Show source page, summary/title, and review-only status.
- Do not create durable tasks.
- Do not mutate backend.
- Do not alter existing task table state.
- Keep mutation controls deferred.

## Recommendation

Proceed next with:

`Task Center Incoming Handoff Visibility Patch`

This should be a small frontend-only patch inside `operations-centers.js`.

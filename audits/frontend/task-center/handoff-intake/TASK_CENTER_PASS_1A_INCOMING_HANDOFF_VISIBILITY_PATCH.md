# Task Center Pass 1A - Incoming Handoff Visibility Patch

## Summary

This patch adds review-only incoming handoff visibility to Task Center.

Task Center remains owned inside `operations-centers.js`. Workflows and AI Command can route users to Task Center, but the page previously did not visibly display incoming handoff context.

## Files changed

- public/control-center/pages/operations-centers.js
- audits/frontend/task-center/handoff-intake/TASK_CENTER_PASS_1A_INCOMING_HANDOFF_VISIBILITY_PATCH.md

## What changed

- Imported `getSharedHandoff` from shared context.
- Read incoming handoff for destination `task-center`.
- Rendered a compact "Incoming Task Handoff" card in the right rail.
- Marked the handoff as review-only.
- Added local "Copy Handoff Summary" action.
- Kept "Open AI Workspace" context action.

## What did not change

- No backend changes.
- No durable task creation.
- No operations.tasks mutation.
- No task table mutation.
- No route behavior changes.
- No refresh behavior changes.
- No mutation controls enabled.
- No automation engine changes.

## Safety decision

Incoming handoff is visibility-only. It does not create a task automatically.

## Browser QA checklist

- [ ] Task Center opens normally.
- [ ] If no handoff exists, layout remains unchanged.
- [ ] If handoff exists, Incoming Task Handoff appears in right rail.
- [ ] Handoff card says Review-only.
- [ ] Copy Handoff Summary works.
- [ ] Open AI Workspace still routes to AI Command.
- [ ] No durable task is created automatically.
- [ ] No console errors.

## Final verification result

The final pass confirms the full review-only handoff path:

### Task Center read path

- Task Center imports `getSharedHandoff`.
- Task Center reads `getSharedHandoff(projectName, "task-center", ops)`.
- Task Center renders `Incoming Task Handoff` only when a handoff exists.
- Task Center does not create durable tasks from the handoff.
- Task Center exposes `Copy Handoff Summary`.

### Workflows write paths

The following Workflows actions now write a review-only handoff to Task Center before navigation:

- `Prepare Task Handoff`
- Light `Open Task Center`
- Destination card `Open Task Center`

Each path writes:

- `source_page: "workflows"`
- `destination_page: "task-center"`
- `status: "review_only"` in the payload
- `created_at`

Then it navigates to `task-center`.

### Safety confirmation

- No automatic durable task creation.
- `createProjectTask(...)` is no longer used by `Prepare Task Handoff`.
- No backend mutation was added.
- No `operations.tasks` mutation was added.
- Mutation controls in Task Center remain disabled/deferred.
- The incoming handoff is review-only visibility.

## Browser QA checklist

- [ ] Open Workflows.
- [ ] Prepare a workflow package.
- [ ] Click `Prepare Task Handoff`.
- [ ] Confirm Task Center opens.
- [ ] Confirm `Incoming Task Handoff` appears.
- [ ] Confirm `Review-only` badge appears.
- [ ] Click `Copy Handoff Summary`.
- [ ] Confirm no durable task count increases automatically.
- [ ] Return to Workflows.
- [ ] Click light `Open Task Center`.
- [ ] Confirm incoming handoff appears.
- [ ] Return to Workflows.
- [ ] Click destination card `Open Task Center`.
- [ ] Confirm incoming handoff appears.
- [ ] Confirm no console errors.

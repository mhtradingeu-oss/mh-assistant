# PHASE 3AE.1 — AI Command / Operations Handoff Decision

## Decision Status
Closed as audit-only after evidence review.

## Route Reference Summary
AI Command references Operations routes in multiple places.

Confirmed Operations routes referenced:
- `operations-centers`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`

Confirmed sources:
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

Confirmed route usage:
- AI Command route suggestions can point to Operations surfaces.
- Tool dock metadata can identify `operations-centers` as a frontend owner page.
- AI Command output/destination maps include Operations destinations.
- AI Command can navigate users to Operations destinations after preparing draft/handoff context.

## Handoff / Destination Summary
Confirmed AI Command handoff behavior:
- AI Command prepares review-ready drafts, task previews, workflow previews, and handoff previews.
- AI Command can store local/session output previews.
- AI Command can set shared draft or handoff context.
- AI Command can navigate to the selected destination route.
- For Operations-related destinations:
  - operations/customer operations outputs can route to `operations-centers`.
  - task-like outputs route to `task-center`.
  - route suggestions may include Operations destinations.

This is treated as routing/handoff behavior, not durable Operations mutation.

## Mutation Risk Summary
No direct Operations mutation was confirmed from AI Command in this audit.

Confirmed:
- AI Command imports and uses AI service helpers:
  - `executeProjectAiChat`
  - `executeProjectAiGuidance`
- These are AI generation/guidance calls, not direct Operations task/queue/job/notification mutations.
- AI Command stores local/session previews and shared handoff context.
- AI Command can navigate to destination routes.
- AI Command does not directly call:
  - `markProjectNotification`
  - Task Center mutation APIs.
  - Queue mutation APIs.
  - Job retry/cancel/rerun/delete APIs.
  - Publishing approval APIs.
  - Governance approval APIs.
  - Worker/scheduler trigger APIs.

Risk:
- Some labels and helper text use action-oriented wording such as execute/run/action.
- Existing copy usually constrains this with safety language such as no backend execution, review-ready draft, confirmation required, or execute only in destination workspace.
- This should be reviewed in a follow-up boundary copy phase.

## Ownership Boundary Summary
AI Command owns:
- AI conversation.
- specialist selection.
- draft generation.
- local/session draft persistence.
- output preview preparation.
- route suggestion display.
- shared draft/handoff context preparation.
- navigation to destination workspace.

AI Command does not own silently:
- durable task creation.
- task assignment/status mutation.
- queue mutation.
- job retry/cancel/rerun/delete.
- notification lifecycle mutation.
- Notification Center Mark Read.
- publishing execution.
- Governance approval.
- external send.
- workflow execution.
- worker/scheduler trigger.
- backend policy bypass.

Operations surfaces remain the owning review/routing surfaces after handoff.

## Copy / Label Risk Summary
Potential copy risk areas:
- “execute”
- “run”
- “action”
- “send”
- “turn intelligence into action”
- “send to run”
- “execute the first step”
- “structured tasks”
- “workflow runs”

Current mitigation:
- Many existing labels explicitly state:
  - draft only.
  - preview only.
  - no backend execution.
  - confirmation required.
  - execution happens only in the destination workspace.
  - no publishing/task/workflow/customer/CRM/backend action is executed.

Recommended follow-up:
- Add a boundary copy plan to make AI Command Operations handoff language consistently say:
  - review-ready draft.
  - handoff preview.
  - route to owning workspace.
  - no Operations mutation from AI Command.
  - execution requires explicit confirmation in the owning destination.

## Required Browser QA
Future Browser QA should verify:
- AI Command loads without error.
- Operations Lead can prepare a task preview without creating a durable task.
- Customer Operations Lead can prepare a handoff preview without creating or mutating notifications.
- Task-like output routes to `task-center` only as navigation/handoff.
- Customer operations non-task output routes to `operations-centers`.
- Route buttons navigate only.
- Shared draft/handoff appears as review context only in destination where applicable.
- No Mark Read occurs from AI Command.
- No task mutation occurs from AI Command.
- No queue mutation occurs from AI Command.
- No job mutation occurs from AI Command.
- No notification lifecycle mutation occurs from AI Command.
- No publishing mutation occurs from AI Command.
- No Governance approval occurs from AI Command.
- No external send occurs from AI Command.
- No worker/scheduler trigger occurs from AI Command.

## Recommended Next Phase
`PHASE 3AE.2 — AI Command Operations Handoff Boundary Copy Plan`

Reason:
The audit did not confirm direct Operations mutations from AI Command, but it found enough action-oriented language around execution/run/action/send that a copy/boundary plan is needed before any patch.

The next phase should remain plan-only and target wording, labels, and safety explanations only.

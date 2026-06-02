# PHASE 3AE.2 — AI Command Operations Handoff Boundary Copy Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AE.1 — AI Command Surface / Operations Handoff Regression Audit`
- Previous commit: `0c23201 Add AI Command operations handoff audit`

## Scope
Plan safe copy/label improvements for AI Command operations handoff language.

AI Command sources:
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

Operations routes:
- `operations-centers`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`

## Purpose
PHASE 3AE.1 confirmed:
- AI Command references Operations destinations.
- AI Command can prepare local/session previews.
- AI Command can set shared draft/handoff context.
- AI Command can navigate to Operations destinations.
- No direct Operations mutation was confirmed from AI Command.
- AI Command does not directly call Mark Read, task/queue/job mutations, publishing approval, Governance approval, or worker execution APIs.

However, AI Command contains action-oriented language that could imply execution unless clarified.

This phase plans copy-only boundary improvements before any patch.

## Copy Risk Areas

### 1. “execute”
Risk:
Could imply AI Command can execute backend actions or operations mutations.

Recommended direction:
- Use “review in the owning workspace”.
- Use “prepare preview”.
- Use “route for confirmation”.
- Keep “execution requires explicit confirmation in the destination workspace” only where needed.

### 2. “run”
Risk:
Could imply workflow/job execution.

Recommended direction:
- Use “generate preview”.
- Use “send prompt to AI for draft”.
- Avoid “send to run” when the action is AI generation only.

### 3. “action”
Risk:
Could imply backend mutation.

Recommended direction:
- Use “next recommendation”, “next review step”, or “handoff”.
- Keep action language only when paired with no-backend-execution safety.

### 4. “send”
Risk:
Could imply external messaging/email/customer send.

Recommended direction:
- Use “send prompt to AI”.
- Use “generate AI draft”.
- Avoid “send” near customer/outreach/publishing unless explicitly saying not external send.

### 5. “turn intelligence into action”
Risk:
Could imply autonomous operations execution.

Recommended direction:
- “turn intelligence into review-ready plans and routed handoffs.”

### 6. “execute the first step”
Risk:
Could imply AI Command runs operational steps.

Recommended direction:
- “review the first step in the owning workspace.”
- “route the first step to the owning workspace.”

### 7. Operations outputs
Risk:
Task/workflow/handoff outputs could imply durable task creation/workflow run.

Recommended direction:
- “Task preview”.
- “Draft workflow”.
- “Handoff preview”.
- “Review before creating durable tasks or running workflows.”

## Allowed Future Patch Scope
A future patch may change:
- headings.
- helper text.
- button labels.
- status messages.
- safety labels.
- confirmation notes.
- tool subtitles.
- route action labels.
- output workspace copy.

A future patch must not change:
- handlers.
- route wiring.
- API calls.
- backend routes.
- AI service calls.
- local/session persistence behavior.
- shared draft/handoff behavior.
- destination route logic.
- task/queue/job/notification mutation behavior.
- Mark Read behavior.
- publishing behavior.
- Governance behavior.
- worker/scheduler behavior.
- external send behavior.

## Required Evidence For Future Patch
Capture current locations for:
- “send to run”.
- “execute”.
- “turn intelligence into action”.
- “execute the first step”.
- “run structured tasks”.
- output workspace route buttons.
- tool dock subtitles.
- AI safety labels.
- route/destination copy around Operations.

## Required Browser QA After Patch
Check:
- AI Command loads.
- Generating a guidance/chat response does not create tasks/workflows.
- Draft Task button prepares preview only.
- Draft Workflow button prepares preview only.
- Prepare Handoff prepares preview only.
- Route to Operations is navigation/handoff only.
- Task-like output routes to Task Center without creating durable task.
- Customer Operations output routes to Operations Overview without mutating notifications.
- AI route buttons do not call Mark Read.
- No task mutation.
- No queue mutation.
- No job mutation.
- No notification mutation.
- No publishing mutation.
- No Governance approval.
- No external send.
- No worker/scheduler trigger.

## Recommended Next Phase
`PHASE 3AE.3 — AI Command Operations Handoff Copy Target Markers / Safe Patch Decision`

Do not implement until this plan is reviewed and committed.

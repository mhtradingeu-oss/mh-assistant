# PHASE 3AE.3 — AI Command Operations Handoff Safe Patch Decision

## Decision Status
Closed as decision-only after copy target review.

## User-Facing Copy Targets
The reviewed evidence confirms several user-facing or near-user-facing strings should be clarified before AI Command / Operations handoff closeout.

Priority targets:
- “send to run”
- “turn intelligence into action”
- “execute the first step”
- “run structured tasks”
- “action”
- “send”
- “execute”
- “workflow runs”
- “Task Draft”
- “Draft Workflow”
- “Prepare Handoff”
- output workspace route labels
- tool subtitles
- safety labels
- confirmation notes around destination routing

## Internal / Already Safe Copy
Some occurrences are acceptable because they are:
- internal comments.
- route/destination mapping names.
- clearly paired with “no backend execution”.
- clearly paired with “confirmation required”.
- clearly paired with “destination workspace”.
- clearly describing AI generation/guidance rather than Operations mutation.

These do not need broad refactor in this wave.

## Operations-Specific Risks
AI Command can route to:
- `operations-centers`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`

The audit did not confirm direct Operations mutation from AI Command.

However, because Operations routes now have strict ownership boundaries, AI Command copy must not imply:
- durable task creation.
- queue mutation.
- job retry/cancel/rerun/delete.
- notification lifecycle mutation.
- Notification Center Mark Read.
- publishing execution.
- Governance approval.
- external send.
- worker/scheduler trigger.
- backend policy bypass.

AI Command handoff should consistently be described as:
- review-ready draft.
- preview.
- handoff context.
- route to owning workspace.
- confirmation required before execution.
- no backend execution from AI Command.

## Safe Patch Decision
Approved for next phase as copy-only safe patch.

Patch may modify:
- visible labels.
- helper text.
- subtitles.
- safety notes.
- confirmation notes.
- output workspace copy.
- route action labels.
- status messages.

Patch must not modify:
- handlers.
- route wiring.
- API calls.
- backend routes.
- AI service calls.
- local/session persistence behavior.
- shared draft/handoff behavior.
- destination route logic.
- task mutation behavior.
- queue mutation behavior.
- job mutation behavior.
- notification mutation behavior.
- Mark Read behavior.
- publishing behavior.
- Governance behavior.
- external send behavior.
- worker/scheduler behavior.

## Required Patch Principles
Use these wording principles:
- Replace “send to run” with “send prompt for preview” or “generate preview”.
- Replace “turn intelligence into action” with “turn intelligence into review-ready plans and routed handoffs”.
- Replace “execute the first step” with “review the first step in the owning workspace”.
- Prefer “Task preview” over ambiguous durable-task language.
- Prefer “Draft workflow preview” over workflow-run language.
- Prefer “Handoff preview” over direct handoff execution language.
- Keep “execution requires confirmation in the owning workspace” where execution is mentioned.
- Keep “AI Command does not execute backend actions” near high-risk routing areas.

## Browser QA Requirements After Patch
Browser QA must confirm:
- AI Command loads without blank/error.
- Composer still works.
- Suggested prompts still prefill only.
- AI response generation still creates preview only.
- Draft Task prepares preview only.
- Draft Workflow prepares preview only.
- Prepare Handoff prepares preview only.
- Route to Operations navigates only.
- Task-like output routes to Task Center without durable task creation.
- Customer Operations output routes to Operations Overview without notification mutation.
- No Mark Read is called.
- No task mutation occurs.
- No queue mutation occurs.
- No job mutation occurs.
- No notification lifecycle mutation occurs.
- No publishing mutation occurs.
- No Governance approval occurs.
- No external send occurs.
- No worker/scheduler trigger occurs.

## Recommended Next Phase
`PHASE 3AE.4 — AI Command Operations Handoff Copy-Only Safe Patch`

Reason:
The copy targets are clear and the approved scope is wording-only. A small patch should update visible wording without changing behavior.

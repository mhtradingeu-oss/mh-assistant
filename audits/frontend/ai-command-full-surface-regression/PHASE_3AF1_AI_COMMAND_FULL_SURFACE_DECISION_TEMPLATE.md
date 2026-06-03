# PHASE 3AF.1 — AI Command Full Surface Regression Decision

## Decision Status
Closed as audit-only after full surface evidence review.

## Route / Navigation Summary
Pass.

Confirmed:
- AI Command route is registered.
- AI Command route metadata exists.
- AI Command is available as `ai-command`.
- AI Command can route/handoff to destination workspaces through review context.
- Destination navigation is treated as route/handoff behavior, not backend mutation.

## Specialist / Tool Summary
Pass.

Confirmed:
- AI Command exposes multiple specialists.
- Full Team mode is present.
- Specialist definitions include clear can/cannot boundaries.
- Tool dock provides preview, route, and handoff style actions.
- Tool dock includes confirmation/safety language.
- Tool dock preparation is composer-ready and review-ready, not direct backend execution.

## API / Mutation Boundary Summary
Pass.

Confirmed:
- AI Command uses AI service helpers for chat/guidance.
- AI Command can prepare local/session previews.
- AI Command can save local output previews.
- AI Command can set shared draft/handoff context.
- AI Command can navigate to destination workspaces.
- AI Command does not directly own durable business mutations.

No direct calls were confirmed for:
- Mark Read.
- durable task creation.
- queue mutation.
- job lifecycle mutation.
- notification lifecycle mutation.
- publishing execution.
- Governance approval.
- external send.
- worker/scheduler trigger.

## Copy / Safety Summary
Pass with Browser QA follow-up.

Confirmed:
- 3AE.4 improved AI Command copy from execution/action wording toward preview/handoff/routing language.
- Safety copy states backend owns authority.
- Safety copy states AI Command prepares guidance, previews, and handoff context.
- Safety copy states AI Command does not mutate Operations records.
- Output workspace emphasizes previews, task previews, workflow previews, and handoffs.
- Confirmation copy remains visible around execution/publishing/approval/workflow run boundaries.

Remaining copy to observe in Browser QA:
- route draft labels.
- send draft labels.
- generic “run structured tasks” route description.
- confirmation wording in output workspace.

These do not require a patch in 3AF.1, but must be verified visually in 3AF.2.

## Browser QA Requirements
3AF.2 must verify:
- AI Command opens without blank/error.
- Sidebar AI Command route works.
- Specialists can be selected without runtime error.
- Full Team mode can be selected without runtime error.
- Suggested prompts prefill only.
- Composer draft saves locally only.
- Send prompt to specialist triggers AI chat/guidance only.
- Draft preview is generated without durable record creation.
- Task Preview does not create a durable task.
- Workflow Preview does not run a workflow.
- Handoff Preview does not execute a backend action.
- Route buttons navigate only after preparing shared context.
- Tool dock actions create composer-ready instructions only.
- No publishing mutation occurs.
- No Governance approval occurs.
- No external send occurs.
- No CRM mutation occurs.
- No Operations mutation occurs.
- No Mark Read occurs.
- No worker/scheduler trigger occurs.

## Regression Risks
Remaining risks:
- Some labels still use route/send/draft language that should be visually checked in Browser QA.
- Tool dock has broad destination lists and should be reviewed visually before full AI Command closeout.
- AI service calls depend on runtime backend availability; Browser QA should distinguish “AI route unavailable” from frontend failure.
- Speech/read preview features depend on browser support and should not block closeout if unsupported.

## Recommended Next Phase
`PHASE 3AF.2 — AI Command Full Surface Browser QA Matrix`

Reason:
The audit evidence does not require a production patch now. The next safe step is Browser QA matrix coverage for AI Command as a full surface.

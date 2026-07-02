# PHASE 3T.24B — AI Command UX Browser QA Baseline

## Status
Browser QA baseline pending.

No production implementation is approved in this phase.

## Baseline
- Previous phase: PHASE 3T.23 — AI Command Decomposition / UX Finalization Plan
- Previous commit: b99652e Plan AI Command decomposition and UX finalization
- AI Command remains production code unchanged in this phase.

## Purpose
Create a manual browser QA baseline for AI Command before any future extraction, decomposition, or UX finalization.

This is required because `public/control-center/pages/ai-command.js` is large and contains:
- team/specialist model
- full team mode
- prompt composer
- chat execution
- preview builders
- handoff builders
- route suggestions
- copy/read/save/use handlers
- safety copy
- destination routing

## Runtime URL
- `http://127.0.0.1:3000/control-center/#ai-command`

## Browser QA Scope

### 1. Page load
- [ ] AI Command loads without blank page.
- [ ] No fatal overlay remains visible.
- [ ] No console-blocking runtime error is visible.
- [ ] Header/title clearly communicates AI Team / AI Command purpose.
- [ ] Safety copy or review-only boundary is visible.

### 2. Specialist selection
- [ ] Specialist rail/cards are visible.
- [ ] Selecting a specialist updates active state.
- [ ] Specialist profile/purpose updates.
- [ ] Suggested prompts update or remain contextually correct.
- [ ] No backend mutation happens when selecting a specialist.

### 3. Full Team mode
- [ ] Solo / Full Team toggle is visible.
- [ ] Full Team mode can be selected.
- [ ] Full Team mode clearly communicates coordinated review/planning.
- [ ] Full Team mode clearly states it does not execute workflows or publish.
- [ ] Switching back to solo works.

### 4. Suggested prompt prefill
- [ ] Suggested prompt click fills the composer.
- [ ] Suggested prompt does not auto-send.
- [ ] Suggested prompt does not execute backend action.
- [ ] Prompt can be edited after prefill.

### 5. Prompt send / AI response
- [ ] User can type a prompt.
- [ ] Send button works.
- [ ] Response appears in the conversation/result area.
- [ ] Response is labeled as guidance/draft/review-ready output.
- [ ] No publish/workflow/CRM/approval execution is claimed.

### 6. Preview / handoff outputs
- [ ] Prepare/preview actions produce review-ready output.
- [ ] Handoff output is labeled as handoff/preview/draft.
- [ ] Output identifies destination workspace where relevant.
- [ ] Safety note remains visible.
- [ ] No task/workflow/publishing/CRM mutation happens from preview.

### 7. Route suggestions
- [ ] Route suggestion buttons appear when relevant.
- [ ] Route buttons navigate only.
- [ ] Route buttons do not execute destination action.
- [ ] Destination ownership remains clear.

### 8. Copy / read / use / save controls
- [ ] Copy works or fails gracefully.
- [ ] Read works or fails gracefully.
- [ ] Use/continue controls update local draft/preview only.
- [ ] Save controls do not create backend tasks or approvals.
- [ ] Clear controls only clear local/session UI state.

### 9. Safety and authority boundaries
- [ ] Page does not claim publishing happened.
- [ ] Page does not claim approval happened.
- [ ] Page does not claim workflow run happened.
- [ ] Page does not claim CRM update happened.
- [ ] Page does not claim customer reply was sent.
- [ ] Page does not claim backend task was created.
- [ ] Execution remains in owning workspaces.

### 10. UX readiness observations
- [ ] Note any visual clutter.
- [ ] Note confusing labels.
- [ ] Note duplicate panels/tools.
- [ ] Note missing safety copy.
- [ ] Note any action that feels like execution but is only draft/review.
- [ ] Note any candidate for copy-only patch.
- [ ] Note any candidate for future decomposition.

## QA Result
Pending manual browser QA.

## Production Change Policy
- No production code changes.
- No CSS changes.
- No API changes.
- No route changes.
- No backend changes.
- No data/projects changes.

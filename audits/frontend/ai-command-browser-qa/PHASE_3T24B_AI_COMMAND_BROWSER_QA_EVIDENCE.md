# PHASE 3T.24B — AI Command Browser QA Evidence

## QA Status
Pass with notes.

## Environment
- Runtime URL: `http://127.0.0.1:3000/control-center/#ai-command`
- Branch: `architecture/frontend-consolidation-v1`
- Baseline commit: `b99652e Plan AI Command decomposition and UX finalization`
- QA baseline commit: `e1c7a11 Add AI Command browser QA baseline`

## Runtime Pre-check

Result: Pass.

Evidence:
- `mh-orchestrator.service` is active/running.
- `/health` returned `status: ok`.
- `/readyz` returned `ready: true`.
- `/control-center/` returned `HTTP/1.1 200 OK`.
- Node validation passed with no visible errors.

## Manual QA Notes

### Page load
Result: Pass.

Notes:
- AI Command loads successfully.
- No blank page was observed.
- No fatal overlay was observed.
- Main AI Workspace is visible.
- Safety boundary is visible in the UI.

### Specialist selection
Result: Pass.

Notes:
- Specialist list is visible.
- Content Writer selection is active and visually highlighted.
- Specialist state updates visibly.
- No backend mutation was observed from selecting a specialist.

### Full Team mode
Result: Not fully captured in screenshot evidence.

Notes:
- Needs follow-up visual QA if the next phase touches team-mode layout.
- No production issue was confirmed in this phase.

### Suggested prompt prefill
Result: Pass with notes.

Notes:
- Suggested prompt/prefill behavior works and does not auto-send.
- However, the suggested prompt experience appears weak because prompts may feel repetitive or too similar across actions/specialists.
- Future UX pass should make suggested prompts more specialist-specific and context-aware.
- No auto-execution was observed.

### Prompt send / AI response
Result: Pass.

Notes:
- Prompt send triggers a response/loading state.
- UI shows: `Content Writer is preparing your response...`
- Response appears in the conversation/output area.
- Output is presented as guidance/review-ready content.
- No publish/workflow/CRM/approval execution was claimed.

### Preview / handoff outputs
Result: Pass with notes.

Notes:
- Output workspace shows draft/task/workflow/handoff options.
- Safety language remains visible.
- No task/workflow/publishing/CRM mutation was observed.
- Future UX pass should clarify which controls are local draft/review actions versus destination routing.

### Route suggestions
Result: Pass with notes.

Notes:
- Route-oriented actions are visible.
- No evidence of automatic execution was observed.
- Future QA should verify each route button navigates only and never executes destination actions.

### Copy / read / use / save controls
Result: Pass with notes.

Notes:
- Copy/use/save/read-style controls are visible in the AI Command output area.
- No dangerous backend mutation was observed.
- Future focused QA should test each button individually after any layout or extraction work.

### Safety and authority boundaries
Result: Pass.

Notes:
- Strong safety copy is visible:
  `Chat only. No workflow, task, handoff, approval, publish, CRM, or customer action was created.`
- Page does not claim publishing happened.
- Page does not claim approval happened.
- Page does not claim workflow run happened.
- Page does not claim CRM update happened.
- Page does not claim customer reply was sent.
- Page does not claim backend task was created.
- Execution remains positioned as destination-owned.

### UX readiness observations
Result: Pass with notes.

Notes:
- The page is powerful and functional, but visually dense.
- Suggested prompts should be improved so they are not repetitive and better match the selected specialist.
- The chat/composer typing area should be positioned closer to the conversation room, not separated in a header-like location.
- User should be able to keep the page context visible while typing.
- Future UX patch should improve:
  - composer placement
  - specialist-specific prompt variety
  - separation between chat, output workspace, and action dock
  - clarity of draft/review versus execution actions

## Final QA Decision

Pass with notes — AI Command baseline is safe for future decomposition, but a UX clarification/layout patch is recommended before extraction.

## Recommended Next Phase

PHASE 3T.25 — AI Command UX Composer + Suggested Prompts Improvement Plan

Scope should remain plan-first:
- no backend changes
- no API changes
- no route changes
- no execution behavior changes
- no extraction before UX decision
- preserve review-only boundaries

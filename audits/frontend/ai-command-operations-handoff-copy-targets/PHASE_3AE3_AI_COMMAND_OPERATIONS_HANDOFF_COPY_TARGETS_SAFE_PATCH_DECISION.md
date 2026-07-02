# PHASE 3AE.3 — AI Command Operations Handoff Copy Targets / Safe Patch Decision

## Status
Decision-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AE.2 — AI Command Operations Handoff Boundary Copy Plan`
- Previous commit: `9f5bd1c Plan AI Command operations handoff boundary copy`

## Scope
Review copy target markers captured in 3AE.2 and decide whether a copy-only safe patch is needed.

Sources:
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

## Context
3AE.1 confirmed no direct Operations mutation from AI Command.

3AE.2 confirmed action-oriented wording exists and should be reviewed:
- execute.
- run.
- action.
- send.
- send to run.
- turn intelligence into action.
- execute the first step.
- structured tasks.
- workflow runs.

## Evidence To Review
Use:
- `PHASE_3AE2_AI_COMMAND_OPERATIONS_HANDOFF_COPY_TARGET_MARKERS.md`

## Decision Questions
- Which risky copy strings are visible to users?
- Which risky strings are internal comments or already safety-bound?
- Which strings are specifically Operations-related?
- Which strings are AI-generation-related and acceptable if clarified?
- Is a copy-only patch needed now?
- Can the patch be limited to wording only without changing handlers/routes/API/destination logic?

## Expected Decision
Likely yes: proceed to a copy-only patch phase.

Reason:
AI Command is a high-visibility surface. Even if current code is safe, user-facing words like “send to run”, “turn intelligence into action”, and “execute the first step” can imply direct execution.

## Patch Boundary If Approved
Allowed:
- user-facing copy only.
- labels.
- helper text.
- safety notes.
- output workspace text.
- status messages.
- tool subtitles.

Forbidden:
- handlers.
- route wiring.
- API calls.
- backend routes.
- AI service calls.
- destination route logic.
- setSharedAiDraft behavior.
- setSharedHandoff behavior.
- local/session persistence behavior.
- Operations mutation behavior.
- Mark Read behavior.
- publishing behavior.
- Governance behavior.
- external send behavior.
- worker/scheduler behavior.

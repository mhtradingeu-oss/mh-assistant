# PHASE 3AF.1 — AI Command Full Surface Finalization / Browser QA Regression Audit

## Status
Audit-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AE.5 — AI Command Operations Handoff Browser QA Closeout`
- Previous commit: `c8a8649 Close AI Command operations handoff wave`

## Scope
Full AI Command surface regression audit after Operations handoff closeout.

AI Command sources:
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

Related sources:
- `public/control-center/api.js`
- `public/control-center/shared-context.js`
- `public/control-center/state.js`
- `public/control-center/router.js`

## Purpose
Confirm AI Command as a full surface:
- loads without runtime errors.
- exposes specialists and Full Team safely.
- keeps preview/draft/handoff boundaries clear.
- uses AI service calls only for chat/guidance.
- does not silently mutate business records.
- does not publish, approve, send, create durable tasks, run workflows, or trigger workers.
- routes to owning workspaces only after preparing review context.
- has consistent copy after 3AE.4.

## Areas To Audit
- Route registration and metadata.
- Sidebar/nav placement.
- specialist definitions.
- Full Team mode.
- composer behavior.
- suggested prompts.
- chat route usage.
- preview controls.
- output workspace.
- local/session persistence.
- shared draft/handoff context.
- route suggestions.
- tool dock.
- safety panel.
- copy consistency.
- mutation/API boundaries.
- Browser QA requirements.

## Safety Rules
- No code changes in 3AF.1.
- No CSS changes.
- No backend changes.
- No API changes.
- No AI service changes.
- No data changes.
- No handler changes.
- No mutation testing against real project data.

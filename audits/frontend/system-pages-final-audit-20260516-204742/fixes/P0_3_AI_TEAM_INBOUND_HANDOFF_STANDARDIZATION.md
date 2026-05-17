# P0.3 AI Team Inbound Handoff Standardization

## Problem
AI Command had partial inbound handoff handling, but handoffs from system pages could arrive with weak or inconsistent payloads. Some source pages send `routeSuggestions: []`, some rely on legacy `modeId` values, and cache-only handoffs from Content Studio, Media Studio, Publishing, and Campaign Studio may not include an `id`.

The prior AI Command block only applied a handoff when `handoff.id` existed, read only `payload.prompt`, and only respected `draft_context.modeId`. That meant AI Command could open with an empty or weak composer, no useful return route, and the wrong specialist.

## Evidence
- `public/control-center/pages/ai-command.js` reads shared handoffs with `getSharedHandoff(projectName, "ai-command", operations)` inside `applyDurableAiHandoff`.
- Content Studio sends to AI Command with `source_page: "content-studio"`, `draft_context.modeId: "content"`, and empty `routeSuggestions`.
- Media Studio sends to AI Command with `source_page: "media-studio"`, `draft_context.modeId: "media"`, and empty `routeSuggestions`.
- Publishing sends to AI Command with `source_page: "publishing"`, `draft_context.modeId: "operations"`, and empty `routeSuggestions`, which should normalize to the Publisher specialist.
- Several cached source handoffs do not include `id`, so the previous early return skipped them.

## Fix
- Added `normalizeAiInboundHandoff(handoff, projectName)` in AI Command near the existing inbound handoff block.
- Normalization now resolves source page, source label, title, prompt, suggested specialist, team mode, route suggestions, optional output preview, draft context, status, and safety note.
- Added source-to-specialist defaults, including Content Studio to Writer, Media Studio to Media, Publishing to Publisher, Campaign Studio to Strategist, Workflows and operations pages to Operations, Governance to Compliance Reviewer, Library to Media, and Insights/Research to the existing SEO/Insights Analyst mode.
- Added legacy specialist normalization for `designer`, `researcher`, `compliance`, `customer-ops`, and `sales-crm`.
- Added a safe fallback prompt when no prompt-like field is provided.
- Added safe fallback route suggestions that return to the source page, or Workflows for generic workspace handoffs.
- Added cache-only handoff identity tracking so id-less shared-context handoffs apply once per incoming object without requiring source-page rewrites.
- Wired `applyDurableAiHandoff` into the AI Command render flow after operations are available.

## Safety
- AI Command only fills local session state, local draft storage, shared draft context, and optional handoff-consumption for real durable handoff IDs.
- No task creation, publishing, CRM update, customer reply, workflow run, export, or backend action is executed from inbound normalization.
- Cache-only handoffs are not sent to `consumeProjectHandoff` because they do not have a real durable backend ID.
- Existing AI-generated response route suggestions remain separate from inbound `session.routeSuggestions`.

## Files Changed
- `public/control-center/pages/ai-command.js`
- `audits/frontend/system-pages-final-audit-20260516-204742/fixes/P0_3_AI_TEAM_INBOUND_HANDOFF_STANDARDIZATION.md`

## Browser QA Checklist
1. Content Studio -> Send to AI Workspace opens AI Command with a non-empty useful composer and Writer context.
2. Media Studio -> Send to AI Workspace opens AI Command with Media specialist/context.
3. Publishing -> AI route opens AI Command with Publisher/publishing review context.
4. Campaign Studio, Workflows, Library, Insights, Governance, and operations pages route to a safe specialist and return route.
5. No task, publish, CRM, customer reply, workflow execution, export, or backend mutation executes from the handoff load.
6. No duplicate IDs are introduced in AI Command markup.
7. No console error appears during route load, composer render, or handoff application.

## What Remains Planned
- Source pages can later be updated to include durable handoff IDs and richer route suggestions, but P0.3 intentionally normalizes inside AI Command.
- Browser QA should confirm the exact user-facing copy for each source path after the frontend server is running.

## Specialist Conversation Clarity Follow-Up

Browser review showed that switching specialists kept the same conversation stream visible, which could make all specialists feel identical.

### Chosen Solution

Used the low-risk shared-room model:
- Shared project / inbound handoff context remains visible to all specialists.
- The selected specialist is shown explicitly.
- The latest reply producer is shown explicitly.
- Every response card now labels which specialist or Full Team produced it.
- If the latest response was produced by a different specialist, the UI tells the user to ask the selected specialist for a specialist-specific answer.
- If the selected specialist has no reply yet, the UI says that existing room history remains visible for context.

### Why Not Full Thread Isolation Yet

Full specialist-thread filtering would require deeper changes to response action handlers because current response actions operate on the latest global response. This follow-up keeps existing actions safe while making the shared-room behavior understandable.

### Additional Browser QA

- Switch between Writer, Media, Publisher, Ads, SEO, Operations, Customer Ops, Sales/CRM, and Full Team.
- Confirm selected specialist is visible.
- Confirm latest reply producer is visible.
- Confirm shared history is labeled as shared history.
- Confirm response actions still apply to the latest visible/global response.
- Confirm no planned action became executable.

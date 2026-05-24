# AI Command Pass 1 - Home Specialist Handoff

## Summary of what changed

- Fixed the Home AI Workforce click binding so visible `.mhos-workflow-step[data-role-id]` role cards use the existing `handleAiRoleClick()` path.
- Preserved the existing prompt-based compatibility bridge from Home to AI Command.
- Added local AI Command session state to remember when a specialist was inferred from the Home prompt bridge.
- Added a visible conversation context item: Specialist context loaded from Home: [Specialist Name].
- Added a small selected-specialist context hint showing top available tools and the next suggested action from existing frontend data.

## Files changed

- `public/control-center/pages/home.js`
- `public/control-center/pages/ai-command.js`
- `audits/frontend/ai-command/AI_COMMAND_PASS_1_HOME_SPECIALIST_HANDOFF.md`

## What was intentionally not changed

- No backend changes.
- No API changes.
- No router, app, state, runtime, shared-context, project data, or tool-dock changes.
- No CSS changes and no new CSS files.
- No durable meeting-room or backend session model was added.
- `submitDurableCommand()` remains unwired.
- Existing prompt copy and safety wording in Home were preserved.

## Home-to-AI handoff behavior

- Home still writes role prompts into `quickCommandInput` with `setGlobalAiPrompt()` and navigates to `ai-command` with `openAiWithPrompt()`.
- The visible Home AI Workforce workflow steps now participate in the same click handler because the query includes `.mhos-workflow-step[data-role-id]`.
- Role IDs and `data-role-id` are preserved.
- Legacy `.home-ai-team-card` and `.mhos-specialist` selectors remain supported.

## AI Command selected specialist behavior

- AI Command still consumes `quickCommandInput` on render and runs `detectSpecialistFromBridgePrompt()`.
- When a specialist is inferred, `session.modeId` is updated as before and `session.bridgeContext` stores Home, specialist ID, specialist label, and load time in local session memory.
- The conversation context strip now shows the Home handoff acknowledgement while the inferred specialist remains selected.
- Manual specialist changes, team mode changes, loaded sessions, new sessions, durable inbound handoffs, and Clear remove the Home bridge acknowledgement to avoid stale context.
- The active specialist remains visually represented by the existing selected roster state and conversation header.

## Safety/authority notes

- AI Command remains guidance, draft, preview, and route-only.
- No publish, approval, CRM update, customer reply, task creation, workflow run, or autonomous execution behavior was added.
- Draft and handoff routing still use transient shared draft/handoff context and navigate to the owning workspace for governed review.
- Ask remains chat-only and keeps the existing safety instruction against execution actions.

## Browser QA checklist

- Home loads without console errors.
- Clicking each visible Home AI Workforce specialist opens AI Command.
- AI Command composer is prefilled with the expected role prompt.
- AI Command selects the inferred specialist after Home handoff.
- AI Command shows Specialist context loaded from Home with the expected specialist label.
- Home `designer`, `ads_operator`, and `admin` continue mapping through prompt parsing to Media, Ads, and Operations.
- Manual specialist selection clears stale Home handoff acknowledgement.
- Full Team mode still works and clears stale Home handoff acknowledgement.
- Draft, Task, Draft Workflow, and Prepare Handoff still create previews only.
- Route Draft still navigates to the owning workspace for review only.

## Remaining risks

- Home-to-AI handoff is still prompt-based and inferred from text, not a structured selected-specialist payload.
- Specialist availability remains static frontend data, not a runtime authority source.
- Recent room history is still split across local messages, response history, and recent chat sessions.
- Browser QA was not run in this pass; only syntax validation was requested.

## Recommended next step

Run browser QA for Home specialist clicks across a normal project and an empty/no-data project, then decide whether the next pass should add a structured frontend-only specialist handoff object or first improve visible room history.

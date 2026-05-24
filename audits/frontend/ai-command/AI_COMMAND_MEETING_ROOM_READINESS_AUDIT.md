# AI Command Meeting Room Readiness Audit

## Executive conclusion

AI Command is already much more than a prompt box. The mounted route renders a credible AI Team Command Center shell: top context/status, left specialist roster, center focused conversation/composer, right output workspace/tools, and a bottom status strip.

The current truth is still not a fully governed Meeting Room model. It is a frontend meeting-room UI with local per-project session state, localStorage chat persistence, a guarded chat API bridge, local preview generation, and transient shared handoff routing. It does not own execution authority and should not become an autonomous executor.

The safest next pass is a small frontend-only bridge and clarity pass: fix the Home specialist click binding, make the selected specialist explicit in AI Command, and expose each ready specialist's role/status/tools/active task/next action using existing local data. Do not touch backend, router, runtime, API, state, or project data.

## Current Home-to-AI handoff truth

- Home has `setGlobalAiPrompt($, prompt)`, which writes into `quickCommandInput` and focuses it.
- Home has `openAiWithPrompt(prompt)`, which calls `setGlobalAiPrompt()`, navigates to `ai-command`, and shows "Prompt prepared in AI Command."
- Home has `handleAiRoleClick(roleId, roleName)`, which builds role-specific prompts such as "Act as the Strategist..." and includes "Do not execute anything; prepare guidance only."
- The intended Home specialist path is prompt-based, not state-based. Home does not call `setSharedHandoff()` and does not pass a structured selected specialist object.
- Important selector risk: current Home AI Workforce markup places `data-role-id` on `.mhos-workflow-step`, but the click binding queries `.home-ai-team-card, .mhos-specialist`. The rendered worker rows use `.mhos-specialist-row` and `.mhos-specialist-summary`, not `.mhos-specialist`.
- Practical result: the handler exists, but visible Home specialist clicks may do nothing unless a matching legacy `.home-ai-team-card` or `.mhos-specialist` element is present. Browser QA should treat this as likely broken until proven otherwise.

## Current AI Command structure

- Route: `aiCommandRoute`, `data-page="ai-command"`, root `ctrlRoomRoot`, standard layout disabled.
- Top: `renderPhase1Header()` shows AI Team Command Center, project, mode, market, language, readiness, session selector, new session, settings, and flow steps.
- Left: `renderPhase1TeamRail()` shows Solo Specialist / Full Team toggle, ready specialists, and a separate planned specialist section.
- Center: `renderAiRoomConversationHeader()`, `renderPhase3SpecialistConversation()`, and `renderPhase1Composer()` create the active conversation room.
- Right: `renderAiRoomOutputWorkspace()` and `renderPhase35ToolsPanel()` create the output workspace and selected specialist tools.
- Footer: `renderAiRoomStatusStrip()` shows readiness, approval state, connected tools, integrations, and recent activity.
- CSS in `12-pages.css` already has page-scoped three-column `.aicmd-room-grid` support.

## What works today

- AI Command can maintain an active specialist via `session.modeId`.
- AI Command can switch Solo Specialist / Full Team via `session.teamMode`.
- AI Command can infer a specialist from Home-style prompt text through `detectSpecialistFromBridgePrompt()`.
- AI Command consumes `quickCommandInput`, detects role from "Act as the ...", stores the prompt as `session.draftMessage`, persists it locally, then clears the global input.
- AI Command has frontend sessions in `aiSessions`, local drafts, local outputs, recent chat sessions, messages, response history, and output previews.
- If `executeProjectAiChat` is available, Ask sends chat-only requests with explicit safety instruction: no task, workflow, handoff, approval, publish, customer, or CRM execution.
- Draft, Task, Draft Workflow, and Prepare Handoff buttons create local previews from composer/conversation context.
- Route actions create transient shared draft/handoff context and navigate to the owning workspace for review.
- Planned specialists are visibly separated from ready specialists.

## What is missing for Meeting Room

- A reliable Home click contract. Current visible Home role elements are not selected by the current handler query.
- A structured Home-to-AI selected specialist handoff. AI Command receives prompt text and infers the role; it does not receive a canonical `{ specialistId, source, task }` payload from Home.
- A durable backend meeting-room/session model. Current sessions are frontend Map/localStorage plus chat API responses.
- A source-of-truth specialist availability model. `SPECIALIST_DEFS.status` is static "Ready"; planned specialists are static.
- Per-specialist active task and next recommended action are not consistently shown in the roster.
- Every ready specialist does not show visible available tools in the roster; tools appear for the selected specialist in the right panel/dock.
- The final shell does not mount some useful existing helper panels: suggested prompts, full context panel, safety panel, and history panel.
- History exists, but it is split between recent session selector, focused chat, shared history details, and local response history rather than a clear room timeline.
- Output previews are local/transient until routed; they are not durable tasks, workflows, approvals, or publish records.
- There is no multi-specialist live orchestration. Full Team mode prepares a coordinated draft, not parallel real agents with owned work queues.

## Specialist model assessment

- Ready specialists currently defined: Strategist, Content Writer, Media Director, Video Lead, Publisher, Ads Optimizer, SEO & Insights Analyst, Compliance Reviewer, Operations Lead, Customer Operations Lead, Sales / CRM Lead.
- Planned specialists currently defined: Admin / Governance, Researcher, Automation Architect.
- Specialist definitions include role, position, summary, placeholder, canHelp, cannotDo, destinations, safetyNote, and status.
- The left rail displays label, position, summary, static status, and backend alias for some roles.
- Active specialist state is local UI state, not authority projection. AI Command imports authority projection and has a legacy `buildProjectedAgentCards()` helper, but the final mounted room uses `SPECIALIST_DEFS`.
- Home role IDs do not perfectly match AI Command IDs. Examples: Home `designer` maps by prompt text to AI Command `media`; Home `ads_operator` maps by prompt text to `ads`; Home `admin` maps by prompt text to `operations`.

## Interaction and handler safety notes

- Preserve `ctrlRoomRoot`, `data-page="ai-command"`, and `aiCommandRoute.template`.
- Preserve current IDs: `aicmdV2Input`, `aicmdV2AskBtn`, `aicmdV2PrepareBtn`, `aicmdV2DraftTaskBtn`, `aicmdV2DraftWorkflowBtn`, `aicmdV2HandoffBtn`, `aicmdV2SaveBtn`, `aicmdV2ClearBtn`, `aicmdV2PreviewSendBtn`, `aicmdV2PreviewCopyBtn`, `aicmdV2PreviewUseBtn`, `aicmdV2PreviewClearBtn`, `aicmdV2SessionSelect`, `aicmdV2NewSessionBtn`, `aicmdV2SettingsBtn`.
- Preserve data attributes: `data-aicmdv2-specialist`, `data-role`, `data-aicmdv2-team-mode`, `data-aicmdv2-output-tab`, `data-aicmdv2-tool`.
- Home should preserve all existing handler IDs and `data-role-id`.
- Do not remove prompt parsing; it is the current compatibility bridge.
- Do not add autonomous execution. Routing should continue to prepare draft context and navigate to owning workspaces.
- `submitDurableCommand()` exists but is not mounted in the final shell. Do not wire it in the first Meeting Room pass.
- `executeProjectAiGuidance` is imported but not used by the mounted shell; the mounted chat bridge uses `executeProjectAiChat`.

## Proposed final Meeting Room layout

- Top context bar:
  - Project, mode, market, conversation language, publishing language, readiness, guidance bridge, approval state.
- Left team roster:
  - Ready specialists first, planned specialists clearly separated.
  - Each ready specialist shows role, responsibility, status, available tool count/top tools, active task, and next recommended action.
  - Active specialist is visibly selected; Full Team mode is distinct.
- Center conversation room:
  - Focused chat with selected specialist.
  - Shared room context visible but not mixed into every message.
  - Room timeline/history visible enough to understand previous specialist outputs.
  - Composer remains chat-first with draft/task/workflow/handoff actions.
- Right output workspace:
  - Draft, Task, Draft Workflow, Handoff, and Export/Copy views.
  - Destination, confirmation requirement, safety note, and next safe action always visible.
  - Tools panel remains selected-specialist scoped.
- Safety contract:
  - AI prepares, reviews, suggests, drafts, and routes.
  - Execution, publishing, approvals, CRM mutations, customer replies, and workflow runs remain in governed owning surfaces.

## Smallest safe first implementation pass

1. Fix Home specialist click binding without changing behavior:
   - Bind the existing handler to `.mhos-workflow-step[data-role-id]` or add the existing expected `.mhos-specialist` class to the visible role element.
   - Keep `handleAiRoleClick()`, `openAiWithPrompt()`, `setGlobalAiPrompt()`, and all current prompt copy.
2. In AI Command, keep consuming the Home prompt bridge but make the inferred selected specialist explicit in the UI:
   - Show "Opened from Home" or "Specialist context loaded from Home" in the conversation context strip.
   - Preserve prompt parsing as compatibility.
3. Improve the left roster using existing data only:
   - For each ready specialist, show static role/responsibility/status plus tool count/top tool labels from the existing tool model.
   - Show active task as current draft/preview/session state when it belongs to that specialist, otherwise "No active task".
   - Show next recommended action from existing suggested prompts or destination mapping.
4. Surface a minimal room history affordance in the mounted shell:
   - Use existing `session.messages`, `responseHistory`, and recent sessions.
   - Do not create a new persistence model.
5. Keep route/handoff actions draft-only:
   - `setSharedAiDraft()` and `setSharedHandoff()` may continue preparing context for destination pages.
   - No task creation, workflow execution, publishing, CRM update, or customer reply.

## Files allowed for first implementation

- `public/control-center/pages/home.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css` only if existing AI Command selectors need a tiny layout/readability adjustment.

## Forbidden files

- Backend files.
- `data/projects/**`.
- `public/control-center/app.js`.
- Router files.
- `public/control-center/state.js`.
- `public/control-center/api.js`.
- Runtime/orchestrator files.
- `public/control-center/shared-context.js` unless a later explicit bridge phase is approved.
- New CSS files.
- `public/control-center/pages/ai-command/tool-dock.js` in the first pass.
- Any autonomous execution, publish, approval, CRM mutation, customer reply, or workflow-run wiring.

## Browser QA checklist

- Home loads without console errors.
- Clicking each visible Home AI Workforce specialist opens AI Command.
- The AI Command composer is prefilled with the expected role-specific prompt.
- AI Command selects the expected specialist after Home handoff: Strategist, Writer, Media, Video Lead, Publisher, Ads, Analyst, Compliance, Operations.
- Home `ads_operator`, `designer`, and `admin` still map safely to Ads, Media, and Operations.
- AI Command left roster shows ready specialists separately from planned specialists.
- Active specialist state updates when clicking roster items.
- Full Team mode still works and does not erase selected specialist history.
- Ask sends only chat requests and does not create tasks, workflows, handoffs, approvals, publishes, CRM updates, or customer replies.
- Draft, Task, Draft Workflow, and Prepare Handoff create preview output only.
- Route Draft prepares shared handoff context and navigates to the owning workspace for review.
- Recent chats can be saved, loaded, and reset.
- Mobile viewport keeps roster, conversation, composer, output, and tools readable with no text overlap.

## Recommended next prompt

Implement the smallest safe AI Command Meeting Room first pass from `audits/frontend/ai-command/AI_COMMAND_MEETING_ROOM_READINESS_AUDIT.md`.

Rules:
- Modify only `public/control-center/pages/home.js`, `public/control-center/pages/ai-command.js`, and `public/control-center/styles/12-pages.css` only if existing selectors need a tiny readability fix.
- Do not touch backend, data, runtime, router, state, API, shared context, tool-dock, or create new CSS files.
- Fix the Home specialist click binding while preserving current prompt handoff behavior.
- Make AI Command visibly show the selected specialist, ready/planned specialist separation, per-specialist status/tools/active task/next action, and draft-only output safety.
- Do not add autonomous execution. AI may prepare, review, suggest, draft, and route for governed review only.

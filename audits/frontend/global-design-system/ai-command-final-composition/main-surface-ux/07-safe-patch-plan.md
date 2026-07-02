# 07 — Safe Patch Plan

Rule: no implementation in this audit pass. Each patch below is narrow, reversible, and scoped to the active main surface.

## Patch 1 — Clarify Empty-State Next Action

Goal: make the first action obvious: choose a specialist if needed, then message the composer.

Files:
- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`

Touch:
- `renderPhase3SpecialistConversation(...)` at `ai-command.js:4291`
- `renderAiRoomOutputWorkspace(...)` at `ai-command.js:4134`
- page-scoped empty-state selectors in `12-pages.css`

Change:
- Shorten the center empty state to one direct CTA.
- Make the right output empty state quieter and dependent in copy: output appears after a chat response or preview.
- Do not change any handler or command behavior.

Acceptance criteria:
- On a fresh AI Command page, the primary visible instruction is to message the selected specialist.
- The output column no longer competes as a first-step instruction.
- No API payloads, route behavior, or Tool Drawer behavior change.

## Patch 2 — Add Main-Surface Selected Library Source Indicator

Goal: make the active Library source visible after drawer/source handoff without reopening closed drawer behavior.

Files:
- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`

Touch:
- Add a small render helper near active render helpers in `ai-command.js`.
- Mount it in one active location only, preferably inside `renderPhase1Composer(...)` or the chat context strip in `renderPhase3SpecialistConversation(...)`.
- Use existing source bridge/read behavior. Do not duplicate source selection logic.

Do not touch:
- `tool-dock.js:46`
- `tool-dock.js:276`
- `tool-dock.js:1729`
- `tool-dock.js:1776`
- `tool-dock.js:1860`

Acceptance criteria:
- After selecting a Library source and returning to AI Command, the main page shows a compact selected-source indicator without opening the drawer.
- The drawer still shows the selected source exactly as before.
- Use in Composer still injects selected source context into the composer prompt.
- Removing/changing source in the drawer remains owned by the drawer.

## Patch 3 — Reduce Specialist Rail Copy Density

Goal: keep specialist choices clear while making the rail faster to scan.

Files:
- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`

Touch:
- `renderPhase1TeamRail(...)` at `ai-command.js:3667`
- `.aicmd-room-member*` page-scoped selectors in `12-pages.css`

Change:
- Keep label and short role/status.
- Move long summary/backend alias into `title` or visually secondary truncation.
- Keep planned specialists but make them less dominant.

Acceptance criteria:
- Active specialists are readable in one scan pass.
- Selected specialist state remains obvious.
- Full Team mode remains clear.
- No specialist IDs, aliases, or routing behavior change.

## Patch 4 — Tighten Repeated Safety Copy

Goal: preserve safety truth while reducing repeated system-like explanations.

Files:
- `public/control-center/pages/ai-command.js`

Touch:
- `renderPhase1Composer(...)` at `ai-command.js:3981`
- `renderPhase3SpecialistConversation(...)` at `ai-command.js:4291`
- `renderAiRoomOutputWorkspace(...)` at `ai-command.js:4134`
- `renderAiRoomStatusStrip(...)` at `ai-command.js:4244`

Change:
- Keep one concise safety line near the composer/chat area.
- Keep output confirmation text only when a preview exists.
- Keep drawer safety text unchanged unless a later drawer-specific pass is approved.

Acceptance criteria:
- The page still communicates guidance/review-only behavior.
- Repeated long no-execution paragraphs are reduced.
- Users can identify the next action without reading multiple warnings.
- No execution safeguards or payload fields change.

## Patch 5 — Make Composer Visually Primary

Goal: strengthen the composer as the main action without changing send behavior.

Files:
- `public/control-center/styles/12-pages.css`
- optional small copy adjustment in `public/control-center/pages/ai-command.js`

Touch:
- `[data-page="ai-command"] .aicmd-unified-chat-surface`
- `[data-page="ai-command"] .aicmd-v2-composer.aicmd-room-composer.aicmd-chatgpt-composer`
- `[data-page="ai-command"] .aicmd-v2-textarea.aicmd-chatgpt-textarea`
- `[data-page="ai-command"] .aicmd-chatgpt-send-btn`

Change:
- Give the composer stronger spacing/contrast than nearby context strips.
- Keep textarea sizing responsive.
- Keep Enter-to-send and Shift+Enter behavior unchanged.

Acceptance criteria:
- On desktop and mobile, the composer reads as the primary action.
- Text does not overlap toolbar controls.
- Send button remains accessible and visually clear.
- No JS behavior changes.

## Patch 6 — Right-Column Tool Priority Polish

Goal: make Tool Dock actions understandable as secondary guided setup actions.

Files:
- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`

Touch:
- `renderPhase35ToolsPanel(...)` at `ai-command.js:3901`
- `.aicmd-room-tools*` page-scoped selectors in `12-pages.css`

Change:
- Shorten panel subtitle.
- Reduce card metadata from three labels to one or two most useful scan signals.
- Keep drawer-open behavior and metadata attributes unchanged.

Acceptance criteria:
- Tool cards still open the Tool Drawer.
- Source-required tools still require source through the existing drawer validation.
- Cards are readable at desktop, tablet, and mobile widths.

## Patch 7 — Responsive Browser QA Patch Only If Needed

Goal: fix only proven density/layout failures from browser QA.

Files:
- `public/control-center/styles/12-pages.css`

Touch:
- Page-scoped AI Command responsive selectors only.

Change:
- Patch measured overflow, cramped rail, clipped buttons, unreadable status, or hidden composer issues only.

Acceptance criteria:
- AI Command works at desktop, tablet, and mobile widths.
- No broad CSS rewrite.
- No global component regressions.

## Recommended Order

1. Patch 1 — clarify empty-state next action.
2. Patch 2 — add main-surface Library source visibility.
3. Patch 3 — reduce specialist rail density.
4. Patch 4 — tighten repeated safety copy.
5. Patch 5 — composer visual priority.
6. Patch 6 — right-column Tool priority polish.
7. Patch 7 — responsive QA fixes only after screenshots/manual QA.

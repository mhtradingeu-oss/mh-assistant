# 05 — Active Surface Ownership Map

Scope: AI Command main page visual/UX truth audit only. No runtime implementation in this pass.

## Active Render Structure

The real active AI Command surface is mounted by `aiCommandRoute.render(context)` in `public/control-center/pages/ai-command.js`.

Active shell:
- `public/control-center/pages/ai-command.js:4660` — `aiCommandRoute`
- `public/control-center/pages/ai-command.js:4760` — root shell: `.aicmd-v2-shell.aicmd-room-shell`
- `public/control-center/pages/ai-command.js:4762` — header: `renderPhase1Header(...)`
- `public/control-center/pages/ai-command.js:4764` — AI Team / specialist rail: `renderPhase1TeamRail(...)`
- `public/control-center/pages/ai-command.js:4766` — center column: `.aicmd-v2-main.aicmd-room-center`
- `public/control-center/pages/ai-command.js:4767` — unified chat surface: `.aicmd-unified-chat-surface`
- `public/control-center/pages/ai-command.js:4768` — active conversation header: `renderAiRoomConversationHeader(...)`
- `public/control-center/pages/ai-command.js:4770` — chat/history/results surface: `renderPhase3SpecialistConversation(...)`
- `public/control-center/pages/ai-command.js:4772` — primary composer: `renderPhase1Composer(...)`
- `public/control-center/pages/ai-command.js:4776` — right output column: `.aicmd-room-output`
- `public/control-center/pages/ai-command.js:4777` — output/results workspace: `renderAiRoomOutputWorkspace(...)`
- `public/control-center/pages/ai-command.js:4778` — quick tool cards: `renderPhase35ToolsPanel(...)`
- `public/control-center/pages/ai-command.js:4781` — status strip: `renderAiRoomStatusStrip(...)`
- `public/control-center/pages/ai-command.js:4782` — Tool Drawer shell: `renderAiToolDrawerShell(...)`

Active interaction binding:
- `public/control-center/pages/ai-command.js:4906` — specialist selection
- `public/control-center/pages/ai-command.js:4931` — solo/team mode toggle
- `public/control-center/pages/ai-command.js:4967` — Tool Dock / Drawer binding through `bindAiToolDock(...)`
- `public/control-center/pages/ai-command.js:4979` — composer input persistence and Enter-to-send behavior
- `public/control-center/pages/ai-command.js:5042` — Ask Specialist chat submission
- `public/control-center/pages/ai-command.js:5235` — task preview from conversation
- `public/control-center/pages/ai-command.js:5266` — workflow preview from conversation
- `public/control-center/pages/ai-command.js:5289` — handoff preview from conversation
- `public/control-center/pages/ai-command.js:5312` — right-column tool cards open the Tool Drawer
- `public/control-center/pages/ai-command.js:5437` — chat response to preview
- `public/control-center/pages/ai-command.js:5468` — route response context
- `public/control-center/pages/ai-command.js:5518` — preview action handlers

## Active CSS Owners

Primary active main-surface CSS:
- `public/control-center/styles/12-pages.css:110` — compact AI Command header overrides
- `public/control-center/styles/12-pages.css:180` — unified chat surface wrapper
- `public/control-center/styles/12-pages.css:217` — composer-in-unified-surface overrides
- `public/control-center/styles/12-pages.css:3374` — legacy `.aicmd-v2-*` AI Command phase styles still used by active render
- `public/control-center/styles/12-pages.css:5844` — final room `.aicmd-room-*` shell styles
- `public/control-center/styles/12-pages.css:5960` — final room grid/team/output layout
- `public/control-center/styles/12-pages.css:6241` — room panel/card surface styling
- `public/control-center/styles/12-pages.css:6434` — right output column and output workspace
- `public/control-center/styles/12-pages.css:6597` — right-column tool cards
- `public/control-center/styles/12-pages.css:6631` — footer status strip
- `public/control-center/styles/12-pages.css:7276` — active chat message bubbles and shared history
- `public/control-center/styles/12-pages.css:8239` — later responsive/density overrides for output/tools
- `public/control-center/styles/12-pages.css:8360` — empty conversation polish
- `public/control-center/styles/12-pages.css:8502` — output text readability refinements

Tool Dock / Drawer CSS:
- `public/control-center/styles/08-components-foundation.css:930` — `.mhos-tool-dock-*` component styles
- `public/control-center/styles/08-components-foundation.css:1208` — selected source placeholder base
- `public/control-center/styles/08-components-foundation.css:1259` — Smart Tool Drawer polish
- `public/control-center/styles/08-components-foundation.css:1342` — drawer controls
- `public/control-center/styles/08-components-foundation.css:1421` — drawer source detail fields
- `public/control-center/styles/08-components-foundation.css:1507` — source-ready drawer setup
- `public/control-center/styles/08-components-foundation.css:1642` — closed Tool Drawer selected source polish

## Tool Dock / Library Source Owners

Active Tool Drawer and Library handoff ownership is in `public/control-center/pages/ai-command/tool-dock.js`.

Closed handoff-critical owners:
- `tool-dock.js:46` — drawer restore after Library return
- `tool-dock.js:213` — selected Library source context block for composer prompt
- `tool-dock.js:276` — selected source hydration into drawer
- `tool-dock.js:1255` — Tool Drawer shell
- `tool-dock.js:1371` — standalone `renderAiToolDock(...)` helper, not mounted by current main shell
- `tool-dock.js:1617` — open drawer with active tool metadata
- `tool-dock.js:1710` — `bindAiToolDock(...)`
- `tool-dock.js:1729` — Change source / Library bridge
- `tool-dock.js:1776` — Use in Composer
- `tool-dock.js:1860` — drawer restore timers after Library navigation

## Duplicate / Competing Layers

Active mixed layers:
- `.aicmd-room-*` is the final room composition layer and should be the preferred patch target for the main page.
- `.aicmd-v2-*` is still actively used as supporting class names on header, rail, chat, composer, buttons, and preview fragments.
- `.mhos-tool-dock-*` and `.mhos-tool-drawer-*` own the Tool Dock/Drawer component system and should remain component-level.

Inactive or helper-only layers still present:
- `renderPhase1Profile(...)` at `ai-command.js:3741` is not mounted by the active shell.
- `renderPhase35WorkspaceTabs(...)` at `ai-command.js:3874` is not mounted by the active shell.
- `renderPhase35ReadinessStrip(...)` at `ai-command.js:3959` is not mounted by the active shell.
- `renderPhase2PreviewPanel(...)` at `ai-command.js:4035` is not mounted by the active shell.
- `renderPhase2MediaStatusPanel(...)` at `ai-command.js:4264` is not mounted by the active shell.
- `renderPhase1SuggestedPrompts(...)` at `ai-command.js:4503` is not mounted by the active shell.
- `renderPhase1ContextPanel(...)` at `ai-command.js:4531` is not mounted by the active shell.
- `renderPhase1SafetyPanel(...)` at `ai-command.js:4588` is not mounted by the active shell.
- `renderPhase4HistoryPanel(...)` at `ai-command.js:4617` is not mounted by the active shell.

## Files / Functions / Classes To Touch Later

Narrow next-patch targets:
- `public/control-center/pages/ai-command.js`
- `renderPhase1Header(...)`
- `renderPhase1TeamRail(...)`
- `renderAiRoomConversationHeader(...)`
- `renderPhase3SpecialistConversation(...)`
- `renderPhase1Composer(...)`
- `renderAiRoomOutputWorkspace(...)`
- `renderPhase35ToolsPanel(...)`
- `renderAiRoomStatusStrip(...)`
- active copy strings inside those functions only
- `public/control-center/styles/12-pages.css`
- `[data-page="ai-command"] .aicmd-room-*`
- `[data-page="ai-command"] .aicmd-unified-chat-surface`
- `[data-page="ai-command"] .aicmd-chatgpt-*`
- page-scoped `.aicmd-v2-*` rules only where active mixed classes require compatibility

Optional later source visibility target:
- Add a small main-surface selected source indicator in `ai-command.js`, but read from the existing shared source bridge used by `tool-dock.js`. Do not duplicate the closed drawer hydration path.

## Files / Classes Not To Touch In The Next Patch

Do not touch:
- backend/API files unless a broken frontend contract is proven
- `runtime/orchestrator-service/server.js`
- `public/control-center/api.js`
- Library source handoff behavior already closed by `ca930af` and `aad1056`
- Tool Drawer source hydration behavior in `tool-dock.js:46`, `tool-dock.js:276`, `tool-dock.js:1729`, `tool-dock.js:1776`, `tool-dock.js:1860`
- `public/control-center/legacy/*`
- global non-AI-Command CSS outside page-scoped selectors
- command execution behavior, chat payload behavior, routing behavior, or backend mutation safeguards
- inactive helper panels unless a later cleanup task explicitly removes dead code

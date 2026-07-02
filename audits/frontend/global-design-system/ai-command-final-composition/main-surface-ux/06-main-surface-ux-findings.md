# 06 — Main Surface UX Findings

Scope: static truth audit of the active AI Command main page. No browser interaction was performed in this pass.

## P0 Broken Behavior

No P0 broken behavior was proven by static audit.

The active main shell mounts, binds, and preserves the closed Tool Drawer / Library source handoff path:
- `ai-command.js:4760` mounts the final room shell.
- `ai-command.js:4782` mounts one active `renderAiToolDrawerShell(...)`.
- `ai-command.js:4967` binds `bindAiToolDock(...)`.
- `tool-dock.js:1729` opens Library through the shared source bridge.
- `tool-dock.js:1776` inserts the drawer prompt into the composer.

## P1 Confusing UX

### P1.1 Selected Library source is not visible enough on the main surface

The selected Library source is visible inside the drawer through `applySharedAiSourceToDrawer(...)` and is included in the generated composer prompt, but the main AI Command surface does not show a persistent selected-source card or chip.

Anchors:
- `tool-dock.js:276` — drawer source card hydration
- `tool-dock.js:1517` — selected source enters generated composer prompt
- `ai-command.js:4394` — chat surface context strip has project/session/specialist/tool context, not Library source context
- `ai-command.js:3981` — composer header/context row does not surface selected Library source
- `ai-command.js:4134` — output workspace does not surface selected Library source

Impact: after returning from Library, a user can confirm source selection in the drawer, but once the drawer closes the main page gives no durable visual proof of what source is active.

### P1.2 The page presents several next actions at the same time

The intended primary path is chat in the composer, then create/route a preview. The surface also presents right-column quick actions, output preview actions, shared history actions, and status guidance. These are valid controls, but they compete visually with the main composer.

Anchors:
- `ai-command.js:3981` — composer
- `ai-command.js:3901` — specialist quick actions
- `ai-command.js:4229` — output action row
- `ai-command.js:4458` — latest response action card
- `ai-command.js:4244` — footer status strip

Impact: the user does not always have one clear next action, especially in an empty state where the right output column says to create a preview while the center says to start a conversation.

### P1.3 AI Team / Specialist rail is verbose for a navigation control

Each specialist row includes label, role/status, backend alias, and summary. This is accurate, but too dense for a left rail whose job is fast selection.

Anchors:
- `ai-command.js:3670` — planned specialists include summary and authority copy
- `ai-command.js:3711` — active specialists derive long summary text
- `ai-command.js:3713` — role line includes status, position, and backend alias
- `ai-command.js:3724` — row renders label, role, and summary

Impact: the rail reads like documentation instead of a fast mode picker. Specialist choices are clear, but scan cost is high.

### P1.4 Status/safety copy repeats across chat, composer, output, drawer, and footer

The no-execution guarantee is important, but it appears repeatedly in long forms.

Anchors:
- `ai-command.js:4029` — composer hint
- `ai-command.js:4325` — chat safety line
- `ai-command.js:4217` — output confirmation block
- `ai-command.js:4236` — output planned note
- `ai-command.js:4253` — status strip
- `tool-dock.js:1350` — drawer preparation-only note
- `tool-dock.js:1565` — generated prompt safety block

Impact: repeated system-like copy reduces trust and makes the actual next action harder to scan.

## P2 Visual Hierarchy / Polish

### P2.1 Composer is present but not yet dominant enough

The composer sits after the conversation content inside `.aicmd-unified-chat-surface`, which is sensible for chat. It has a strong send button, but the surrounding conversation header, context strip, right output workspace, and Tool actions can visually outweigh it.

Anchors:
- `12-pages.css:180` — unified chat container visual weight
- `12-pages.css:217` — composer stripped into the unified surface
- `12-pages.css:274` — composer textarea sizing
- `12-pages.css:328` — send button styling
- `ai-command.js:3993` — composer DOM

Recommendation: make composer the obvious input anchor through spacing, sticky/near-bottom placement within the center surface if feasible, clearer empty-state CTA, and reduced nearby explanatory copy. Do not alter Enter-to-send behavior.

### P2.2 Active final room classes compete with older v2 classes

The active DOM intentionally mixes `.aicmd-room-*` and `.aicmd-v2-*`. This works, but CSS ownership is harder to reason about because old phase rules and final room rules both style mounted elements.

Anchors:
- `ai-command.js:4761` — `.aicmd-v2-shell.aicmd-room-shell`
- `ai-command.js:4763` — `.aicmd-v2-body.aicmd-room-grid`
- `ai-command.js:4395` — `.aicmd-v2-chat.aicmd-room-chat`
- `ai-command.js:3994` — `.aicmd-v2-composer.aicmd-room-composer.aicmd-chatgpt-composer`
- `12-pages.css:3374` — broad `.aicmd-v2-*` phase styles
- `12-pages.css:5844` — final `.aicmd-room-*` styles

Recommendation: patch active page-scoped selectors only. Do not rename classes in a broad cleanup during the visual finalization pass.

### P2.3 Right-column Tool actions are understandable, but dense

Tool cards show label, safe action, purpose, output, route, and status. This is informative but high-density for a secondary action area.

Anchors:
- `ai-command.js:3901` — `renderPhase35ToolsPanel(...)`
- `ai-command.js:3929` — tool card topline
- `ai-command.js:3933` — purpose line
- `ai-command.js:3934` — output/route/status meta
- `12-pages.css:6597` — tool grid

Recommendation: keep tool meaning, but reduce repeated labels and make the primary action clearer: “Use tool” or “Open setup” should be visually apparent without reading all metadata.

### P2.4 Output workspace empty state competes with chat empty state

On an empty page, the center chat asks the user to start a focused conversation, while the right output workspace says to create a preview. Both are true, but the page should prioritize “message the specialist” first.

Anchors:
- `ai-command.js:4451` — conversation empty state
- `ai-command.js:4222` — output empty state
- `ai-command.js:4237` — no-routed-preview note

Recommendation: make the output empty state quieter until there is a chat response or composer draft.

### P2.5 Responsive density risk remains

The final room has multiple late responsive overrides. The page likely works across widths, but there is layout risk because the shell has a left rail, center chat/composer, right output column, flow header, and footer status strip.

Anchors:
- `12-pages.css:5960` — room grid
- `12-pages.css:6667` — later shell/grid overrides
- `12-pages.css:6794` — responsive grid changes
- `12-pages.css:6850` — tighter responsive flow
- `12-pages.css:6959` — mobile layout changes
- `12-pages.css:7041` — chat min-height overrides
- `12-pages.css:7164` — additional narrow layout overrides

Recommendation: verify with browser screenshots before patching CSS. Patch only the page-scoped density rules that fail QA.

## P3 Future Enhancements

### P3.1 Dead helper panels can be documented or removed later

Several helpers are not mounted by the active final shell and should not be part of this visual finalization unless a cleanup pass is approved.

Anchors:
- `ai-command.js:3741` — `renderPhase1Profile(...)`
- `ai-command.js:3874` — `renderPhase35WorkspaceTabs(...)`
- `ai-command.js:3959` — `renderPhase35ReadinessStrip(...)`
- `ai-command.js:4035` — `renderPhase2PreviewPanel(...)`
- `ai-command.js:4264` — `renderPhase2MediaStatusPanel(...)`
- `ai-command.js:4503` — `renderPhase1SuggestedPrompts(...)`
- `ai-command.js:4531` — `renderPhase1ContextPanel(...)`
- `ai-command.js:4588` — `renderPhase1SafetyPanel(...)`
- `ai-command.js:4617` — `renderPhase4HistoryPanel(...)`

### P3.2 Suggested prompts are defined but not currently mounted

Suggested prompt definitions and `renderPhase1SuggestedPrompts(...)` exist, and prompt click handlers still bind `[data-aicmdv2-prompt]`, but no suggested prompt panel is mounted in the active final room shell.

Anchors:
- `ai-command.js:285` — specialist suggested prompt definitions
- `ai-command.js:355` — team suggested prompt definitions
- `ai-command.js:4503` — prompt panel renderer
- `ai-command.js:4942` — prompt click handler

Recommendation: decide whether prompt suggestions belong as a compact empty-state affordance near the composer. If yes, remount a shorter version. If no, leave definitions/handler for a cleanup pass.

### P3.3 Main-surface source indicator could become reusable

If Library source visibility is added to the main surface, it should use the existing shared source bridge and follow the closed drawer source card language. Later, this could become a small reusable “active source” primitive across AI surfaces.

Anchors:
- `tool-dock.js:186` — source formatting
- `tool-dock.js:194` — selected source read
- `tool-dock.js:294` — drawer card markup pattern

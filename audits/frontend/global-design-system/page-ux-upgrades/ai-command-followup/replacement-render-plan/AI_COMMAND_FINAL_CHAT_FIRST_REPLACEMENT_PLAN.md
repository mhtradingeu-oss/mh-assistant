# AI Command Final Chat-First Replacement Plan

## Status

Plan only. No production implementation, no commit.

## 1. Executive diagnosis

Old attempts failed because they changed visual styling while leaving the old AI Command render topology mounted. The current `root.innerHTML` still renders an operating-room shell with a heavy header, project/meta chip strip, flow cards, left team rail, center conversation/composer stack, right output/tools aside, and status strip. CSS overlays cannot make that become one ChatGPT-like workspace because the page still contains multiple primary surfaces before and around the chat.

The primary layout must stop mounting these old render layers:

- `renderPhase1Header(...)` as the primary page header, because it includes the large operating-room title, meta chip strip, and flow cards.
- `renderPhase1TeamRail(...)` as a left/sidebar rail, because specialists must move into the chat area selector and secondary Team tab.
- `.aicmd-room-grid` three-column layout, because desktop and mobile must share one chat-first mental model.
- `renderAiRoomConversationHeader(...)` as a separate card above chat, unless its content is reduced into the new chat header.
- `renderPhase3SpecialistConversation(...)` as a complete standalone chat card with its own header/context strip; only its message/history logic should be reused or extracted.
- `renderPhase1Composer(...)` as a separate visual card; its input/send IDs and behavior must be preserved inside the same chat shell as messages.
- `renderAiRoomOutputWorkspace(...)` and `renderPhase35ToolsPanel(...)` as a right aside; they belong under full-width secondary tabs.
- `renderAiRoomStatusStrip(...)` as a bottom dashboard strip in the primary view.
- Old context chip strips and old flow card chains before the chat.

Behavior that must be preserved:

- `aicmdV2AskBtn` click behavior and disabled/loading behavior.
- `aicmdV2Input` input, autosave, Enter-to-send, and draft hydration behavior.
- `quickCommandInput` bridge from Home to AI Command.
- Current chat route behavior through `executeProjectAiChat`.
- Current specialist selection behavior and draft replacement rules.
- Current Solo / Full Team behavior.
- Tool Drawer prompt setup behavior through `data-aicmdv2-tool`, `openAiToolDrawerFromMetadata`, and `bindAiToolDock`.
- Selected Library source/context bridge through `getSelectedLibrarySource`, drawer return context, and `setSharedLibrarySourceBridge`.
- Output review, preview conversion, copy/use/clear, and handoff navigation behavior.
- Current safety wording: chat/previews only; no publish, send, approval, CRM mutation, workflow run, durable task creation, or backend execution.
- Planned specialists remain visibly planned/destination-owned and not selectable as active runtime specialists.
- Voice remains disabled/planned unless a later confirmed capability pass explicitly wires it safely.

## 2. Current render map

`root.innerHTML` starts in `public/control-center/pages/ai-command.js` inside `aiCommandRoute.render(context)`, after session hydration, `quickCommandInput` consumption, durable handoff application, `aiContext` creation, and `bridgeStatus` resolution. The current block begins at:

```js
const root = $("ctrlRoomRoot");
if (!root) return;

root.innerHTML = `
  <div class="aicmd-v2-shell aicmd-room-shell">
    ...
  </div>
`;
```

Helpers mounted today in the primary shell:

- `renderPhase1Header(session, projectName, aiContext, bridgeStatus, escapeHtml)`
- `renderPhase1TeamRail(session, bridgeStatus, escapeHtml)`
- `renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml)`
- `renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml)`
- `renderPhase1Composer(session, aiContext, escapeHtml)`
- `renderAiRoomOutputWorkspace(session, aiContext, escapeHtml)`
- `renderPhase35ToolsPanel(session, projectName, aiContext, escapeHtml)`
- `renderAiRoomStatusStrip(aiContext, session, bridgeStatus, escapeHtml)`
- `renderAiToolDrawerShell({ escapeHtml })`

Helpers or logic that can be reused:

- `getPhase1SpecialistById`, `getAiRoomRoleId`, `getAiRoomInitials`, `renderAiRoomTeamChain` for compact selector labels.
- Message filtering/rendering logic from `renderPhase3SpecialistConversation`, but extracted into a message-only helper without its card header, context strip, and response card duplication.
- Composer internals from `renderPhase1Composer`, specifically the `textarea#aicmdV2Input`, `button#aicmdV2AskBtn`, draft value, placeholder logic, disabled state, `#aicmdV2Status`, language/source indicators, and safety line.
- `renderAiCommandMainSourceIndicator(...)` as compact source state inside the chat composer/header.
- `renderPhase35ToolsPanel(...)` content logic for the Tools secondary tab, but not as a right aside.
- `renderAiRoomOutputWorkspace(...)` content and existing button IDs for the Output secondary tab, but not as a right aside.
- Team rail specialist list data and `data-aicmdv2-specialist` / `data-aicmdv2-team-mode` attributes, but rendered as compact controls in chat and Team tab.
- `renderAiToolDrawerShell({ escapeHtml })` must remain mounted once at shell root so Tool Drawer behavior survives.

Helpers that should not be mounted in the primary chat view:

- `renderPhase1Header`
- `renderPhase1TeamRail`
- `renderPhase35WorkspaceTabs`
- `renderPhase1Profile`
- `renderPhase1ContextPanel`
- `renderPhase1SafetyPanel`
- `renderPhase2MediaStatusPanel`
- `renderPhase4HistoryPanel`
- Full `renderPhase3SpecialistConversation` as currently shaped
- Full `renderPhase1Composer` as currently shaped
- `renderAiRoomStatusStrip`

## 3. Proposed new render architecture

Add these helper names in `public/control-center/pages/ai-command.js`:

- `renderAiCommandChatFirstShell({ session, projectName, aiContext, bridgeStatus, escapeHtml })`
- `renderAiCommandCompactHeader({ session, projectName, bridgeStatus, escapeHtml })`
- `renderAiCommandChatWindow({ session, projectName, aiContext, bridgeStatus, escapeHtml })`
- `renderAiCommandChatTopbar({ session, projectName, aiContext, bridgeStatus, escapeHtml })`
- `renderAiCommandSpecialistSelect({ session, escapeHtml })`
- `renderAiCommandChatMessages({ session, bridgeStatus, escapeHtml })`
- `renderAiCommandChatComposer({ session, aiContext, escapeHtml })`
- `renderAiCommandSecondaryTabs({ session, escapeHtml })`
- `renderAiCommandSecondaryTabPanel({ session, projectName, aiContext, bridgeStatus, escapeHtml })`
- `renderAiCommandTeamTab({ session, bridgeStatus, escapeHtml })`
- `renderAiCommandToolsTab({ session, projectName, aiContext, escapeHtml })`
- `renderAiCommandOutputTab({ session, aiContext, escapeHtml })`
- `renderAiCommandFlowTab({ session, aiContext, bridgeStatus, escapeHtml })`

Replace the current primary `root.innerHTML` with this structure:

```js
root.innerHTML = renderAiCommandChatFirstShell({
  session,
  projectName,
  aiContext,
  bridgeStatus,
  escapeHtml
});
```

Primary structure:

```html
<div class="aicmd-chatfirst-shell">
  <header class="aicmd-chatfirst-header">
    <!-- compact title: AI Command; short safety line; compact Recent/New/Settings -->
  </header>

  <main class="aicmd-chatfirst-main">
    <section class="aicmd-chatfirst-window">
      <div class="aicmd-chatfirst-topbar">
        <!-- specialist dropdown; Solo/Full Team compact toggle; source icon; disabled voice icon -->
      </div>

      <div class="aicmd-chatfirst-messages">
        <!-- message/history stream -->
      </div>

      <div class="aicmd-chatfirst-composer">
        <!-- textarea#aicmdV2Input and button#aicmdV2AskBtn in same visual shell -->
      </div>
    </section>

    <nav class="aicmd-chatfirst-tabs" role="tablist">
      <!-- Team / Tools / Output / Flow full-width secondary tabs -->
    </nav>

    <section class="aicmd-chatfirst-tab-panel">
      <!-- active secondary tab content -->
    </section>
  </main>

  <!-- renderAiToolDrawerShell remains mounted once -->
</div>
```

Messages/history go in `renderAiCommandChatMessages`. This helper should reuse the selected-specialist filtering from `renderPhase3SpecialistConversation`, plus fallback response-history rendering, loading state, and error state. It must not render the old chat card header, context strip, response card as a second chat area, or shared-history details before the composer. Response action buttons may appear only in the Output tab or as compact actions on the latest assistant message if they do not create a second chat box.

Composer goes in `renderAiCommandChatComposer`, directly under the message stream inside `.aicmd-chatfirst-window`. It must render:

- `textarea#aicmdV2Input`
- `button#aicmdV2AskBtn`
- `div#aicmdV2Status`
- disabled/planned `button#aicmdV2VoiceBtn`
- optional compact source indicator
- current safety wording

Specialist selector goes in `renderAiCommandChatTopbar` via `renderAiCommandSpecialistSelect`. Preferred implementation is a compact menu/dropdown inside the chat window. Each active specialist option must preserve `data-aicmdv2-specialist="{id}"`, or the change handler must explicitly mirror the existing specialist selection logic. Planned specialists must not be selectable.

Source/voice/new/settings controls:

- Source/library icon belongs in the chat topbar or composer toolbar. It should show selected source status using `getSelectedLibrarySource(projectName)` and open the existing Tool Drawer source flow only when a tool/source action is selected. If it is a simple source-status button, it should be non-mutating and can show “Choose a source from Tool Drawer / Library” via status message.
- Voice icon is `#aicmdV2VoiceBtn`, rendered disabled with planned copy. Do not enable the current SpeechRecognition runtime in this pass.
- Recent remains `select#aicmdV2SessionSelect`, but styled as compact chat control.
- New remains `button#aicmdV2NewSessionBtn`.
- Settings remains `button#aicmdV2SettingsBtn`.

Team / Tools / Output / Flow tabs:

- Use new tab IDs such as `data-aicmd-chatfirst-tab="team|tools|output|flow"`.
- Store active tab in a frontend-only session field, for example `session.chatFirstTab`, defaulting to `"team"` or `"tools"` only if no output exists; do not reuse old backend or router state.
- Team tab contains full-width specialist/team controls, including active specialists and planned lanes as disabled/destination-owned.
- Tools tab renders `renderPhase35ToolsPanel(...)` or a new wrapper around its tool grid using existing `data-aicmdv2-tool`.
- Output tab renders `renderAiRoomOutputWorkspace(...)` content or a new wrapper preserving `aicmdV2Preview*` IDs and `data-aicmdv2-output-tab`.
- Flow tab renders a compact full-width read-only flow summary using `AI_ROOM_FLOW_STEPS`; it must not appear before the chat.

## 4. CSS strategy

Avoid old selectors for new layout:

- `.aicmd-room-shell`
- `.aicmd-room-header`
- `.aicmd-room-meta`
- `.aicmd-room-flow`
- `.aicmd-room-grid`
- `.aicmd-room-team-panel`
- `.aicmd-room-center`
- `.aicmd-room-output`
- `.aicmd-unified-chat-surface`
- `.aicmd-room-conversation-head`
- `.aicmd-room-chat` as a standalone card
- `.aicmd-room-composer` as a standalone card
- `.aicmd-room-status-strip`
- broad `.aicmd-v2-shell` or `.aicmd-v2-composer` changes that affect legacy surfaces

Use only new scoped selectors:

- `[data-page="ai-command"] .aicmd-chatfirst-shell`
- `[data-page="ai-command"] .aicmd-chatfirst-header`
- `[data-page="ai-command"] .aicmd-chatfirst-main`
- `[data-page="ai-command"] .aicmd-chatfirst-window`
- `[data-page="ai-command"] .aicmd-chatfirst-topbar`
- `[data-page="ai-command"] .aicmd-chatfirst-specialist-select`
- `[data-page="ai-command"] .aicmd-chatfirst-control`
- `[data-page="ai-command"] .aicmd-chatfirst-messages`
- `[data-page="ai-command"] .aicmd-chatfirst-message`
- `[data-page="ai-command"] .aicmd-chatfirst-composer`
- `[data-page="ai-command"] .aicmd-chatfirst-tabs`
- `[data-page="ai-command"] .aicmd-chatfirst-tab`
- `[data-page="ai-command"] .aicmd-chatfirst-tab-panel`

Desktop and mobile should keep the same mental model:

- One centered chat window first.
- Header remains compact at all widths.
- Messages and composer remain in one visual shell at all widths.
- Secondary tabs stay below the chat on desktop and mobile.
- Desktop can use wider max-width and two-column content inside secondary tab panels, but not a primary side rail or right aside.
- Mobile should stack controls inside the chat topbar without moving Team/Tools/Output/Flow above the chat.

Avoid broad CSS cleanup:

- Do not delete historical AI Command CSS in this implementation.
- Add a new scoped block near the existing AI Command CSS.
- Do not restyle shared `.btn`, `.aicmd-v2-*`, `.mhos-*`, or global page selectors unless needed for containment.
- Do not try to hide old structures with CSS; the render replacement must remove them from the mounted primary layout.

## 5. Interaction strategy

Existing handlers continue to work if the new render preserves IDs and data attributes:

- `#aicmdV2Input` remains the single composer textarea. Existing `oninput` and `onkeydown` bindings continue unchanged.
- `#aicmdV2AskBtn` remains the single send button. Existing ask route behavior continues unchanged.
- `#aicmdV2SessionSelect`, `#aicmdV2NewSessionBtn`, and `#aicmdV2SettingsBtn` remain mounted as compact controls.
- `[data-aicmdv2-specialist]` remains on active specialist choices so the existing specialist handler can be reused.
- `[data-aicmdv2-team-mode]` remains on Solo / Full Team controls so current team mode behavior is preserved.
- `[data-aicmdv2-tool]` remains on tool buttons so current Tool Drawer setup continues.
- `#aicmdV2PreviewSendBtn`, `#aicmdV2PreviewCopyBtn`, `#aicmdV2PreviewUseBtn`, and `#aicmdV2PreviewClearBtn` remain in the Output tab when preview exists.
- `[data-aicmdv2-output-tab]` remains inside Output tab if the existing output sub-tabs are retained.

New selectors/buttons needed:

- `[data-aicmd-chatfirst-tab]` for Team / Tools / Output / Flow tab switching.
- Optional `#aicmdV2SourceBtn` or `[data-aicmd-chatfirst-source]` for a compact source/library status action.
- Optional `data-aicmd-chatfirst-specialist-select` if implemented as a `<select>` instead of buttons.

Specialist dropdown mapping:

- Safest path: render dropdown menu items as buttons with `data-aicmdv2-specialist` and let the existing click handler run unchanged.
- If a native `<select>` is used, add a small change handler that mirrors the existing `[data-aicmdv2-specialist]` logic exactly: set `session.modeId`, set `session.teamMode = "solo"`, clear `session.bridgeContext`, replace role draft only under the existing bridge/`Act as the` rules, persist draft, and re-render.
- Planned specialists must appear disabled without `data-aicmdv2-specialist`.

Source button behavior:

- The button may show current selected source from `getSelectedLibrarySource(projectName)`.
- It must not invent a new source picker or mutate `data/projects`.
- To choose/change a source, route through the existing Tool Drawer Library bridge (`data-aicmd-tool-drawer-open-library`) or show a status message telling the user to choose a source through Tool Drawer.
- Source context must remain “trusted AI context only,” not approval or publish readiness.

Voice button behavior:

- Render `#aicmdV2VoiceBtn` as disabled/planned.
- Do not activate SpeechRecognition in this implementation. If the old handler remains in code, the disabled attribute prevents runtime activation.
- Copy should say “Voice planned” or “Voice input coming soon.”

Tabs without backend changes:

- Add a local post-render binding for `[data-aicmd-chatfirst-tab]`.
- It updates `session.chatFirstTab`, calls `persistSessionDraft(sessionKey, session, "AI Command tab: ...")`, and re-renders.
- No router navigation, API calls, provider calls, or durable writes.

## 6. Safety boundaries

- Do not change backend/API files.
- Do not change app/router behavior.
- Do not touch `data/projects`.
- Do not change provider behavior or AI chat request payload semantics.
- Do not activate planned specialists.
- Do not activate real voice runtime.
- Do not add publish/send/approve/execute/CRM/workflow/task behavior.
- Do not add durable action creation.
- Do not change destination workspace ownership.
- Do not change Tool Drawer source-required validation except visual placement.
- Do not add CSS overlays over the old layout.
- Do not produce mixed layouts.

## 7. Implementation phases

Phase A: add helper render functions only

- Add the new `renderAiCommandChatFirst*` helpers.
- Extract message-only logic from `renderPhase3SpecialistConversation` into `renderAiCommandChatMessages`.
- Add composer helper that preserves `aicmdV2Input`, `aicmdV2AskBtn`, `aicmdV2Status`, and disabled `aicmdV2VoiceBtn`.
- Add secondary tab helpers but do not switch `root.innerHTML` yet.
- Run syntax check.

Phase B: switch `root.innerHTML` to new structure

- Replace the current `root.innerHTML` template with `renderAiCommandChatFirstShell(...)`.
- Keep all session hydration, `quickCommandInput`, durable handoff, bridge status, and post-render behavior before/after the render block intact.
- Add the small `[data-aicmd-chatfirst-tab]` binding after existing session/settings bindings.
- Do not mount old primary header, team rail, grid, output aside, or status strip.

Phase C: add scoped CSS

- Add only `.aicmd-chatfirst-*` rules under `[data-page="ai-command"]`.
- Keep old CSS untouched.
- Ensure desktop and mobile both show one chat window first and tabs below.

Phase D: validation

- Run node syntax checks.
- Run diff checks.
- Run forbidden file checks.
- Run grep checks for required IDs and forbidden old primary render calls.

Phase E: browser QA

- Start local app only if needed.
- Test desktop and mobile.
- Capture or inspect first viewport and tabs.
- Confirm no old operating-room cards/chips/flow appear before the chat.
- Confirm there is exactly one chat window.

Phase F: commit only if browser QA passes

- Commit only after browser QA passes and the diff is limited to the intended files.
- Do not commit audit-only or failed visual overlay work as a production success.

## 8. Exact validation commands

Node checks:

```bash
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
```

Diff checks:

```bash
git diff --check -- public/control-center/pages/ai-command.js public/control-center/pages/ai-command/tool-dock.js public/control-center/styles/12-pages.css
git diff -- public/control-center/pages/ai-command.js public/control-center/pages/ai-command/tool-dock.js public/control-center/styles/12-pages.css
```

Forbidden file checks:

```bash
git diff --name-only | rg '^(public/control-center/(api|app|router)\\.js|data/projects/)'
git diff --name-only | rg -v '^(public/control-center/pages/ai-command\\.js|public/control-center/pages/ai-command/tool-dock\\.js|public/control-center/styles/12-pages\\.css|audits/frontend/global-design-system/page-ux-upgrades/ai-command-followup/replacement-render-plan/AI_COMMAND_FINAL_CHAT_FIRST_REPLACEMENT_PLAN\\.md)$'
```

Required ID grep checks:

```bash
rg -n 'id="aicmdV2Input"|id="aicmdV2AskBtn"|id="aicmdV2Status"|id="aicmdV2SessionSelect"|id="aicmdV2NewSessionBtn"|id="aicmdV2SettingsBtn"' public/control-center/pages/ai-command.js
rg -n 'data-aicmdv2-specialist|data-aicmdv2-team-mode|data-aicmdv2-tool|data-aicmd-chatfirst-tab' public/control-center/pages/ai-command.js
rg -n 'quickCommandInput|executeProjectAiChat|openAiToolDrawerFromMetadata|bindAiToolDock|getSelectedLibrarySource' public/control-center/pages/ai-command.js public/control-center/pages/ai-command/tool-dock.js
```

Forbidden primary-render grep checks after implementation:

```bash
rg -n 'renderPhase1Header\\(|renderPhase1TeamRail\\(|renderAiRoomStatusStrip\\(' public/control-center/pages/ai-command.js
rg -n 'root\\.innerHTML = `[\\s\\S]*aicmd-room-grid|root\\.innerHTML = `[\\s\\S]*aicmd-room-output|root\\.innerHTML = `[\\s\\S]*aicmd-room-team-panel' public/control-center/pages/ai-command.js
rg -n 'SpeechRecognition|webkitSpeechRecognition|recognition\\.start\\(' public/control-center/pages/ai-command.js
```

Expected interpretation:

- The helper definitions may still exist, but `root.innerHTML` must not mount old primary layout helpers.
- `SpeechRecognition` grep should either be absent from active code or documented as unreachable because `#aicmdV2VoiceBtn` is disabled/planned. Preferred future implementation removes or gates the active runtime path.

## 9. Browser QA checklist

Desktop first screen:

- First viewport shows compact `AI Command` header and one chat window.
- No Project / Active AI / Mode / Market / Language / Readiness chip strip above the chat.
- No operating flow cards above the chat.
- Recent/New/Settings appear as compact chat controls, not cards.

Desktop chat window:

- Messages/history and composer are inside the same visual shell.
- `aicmdV2Input` accepts text and autosaves.
- Enter triggers `aicmdV2AskBtn`; Shift+Enter adds a newline.
- Send preserves existing chat route behavior.
- Specialist selector is inside the chat area.
- Solo / Full Team current behavior is preserved.
- Source/library icon reflects selected source safely.
- Voice icon is disabled/planned.

Desktop tabs:

- Team / Tools / Output / Flow are full-width secondary tabs below the chat.
- Team tab shows active specialists and planned specialists as planned/destination-owned.
- Tools tab opens existing Tool Drawer prompt setup.
- Output tab preserves preview copy/use/clear/handoff behavior.
- Flow tab is compact and read-only.

Mobile first screen:

- Same mental model as desktop: compact header, one chat window first, tabs below.
- No sidebar rail appears above the chat.
- No right output aside appears before the chat.
- Controls fit without text overlap.

Mobile chat window:

- Messages/history and composer remain in one shell.
- Specialist selector, source icon, disabled voice icon, and send button remain reachable.
- Composer does not become a second standalone card.

Mobile tabs:

- Team / Tools / Output / Flow remain below chat and span full width.
- Tab content stacks cleanly without narrow side panels.

Negative checks:

- No old chips/cards/flow before chat.
- No second chat box.
- No mixed operating-room plus chat-first layout.
- No planned specialist activation.
- No real voice runtime activation.
- No backend/API/data/router/app behavior change.

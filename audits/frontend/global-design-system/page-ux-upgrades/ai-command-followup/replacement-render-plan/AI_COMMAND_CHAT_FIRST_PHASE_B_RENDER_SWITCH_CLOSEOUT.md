# AI Command Chat-First Phase B Render Switch Closeout

## Status

Phase B implemented only. No CSS change. No commit.

## Files changed

- `public/control-center/pages/ai-command.js`
- `audits/frontend/global-design-system/page-ux-upgrades/ai-command-followup/replacement-render-plan/AI_COMMAND_CHAT_FIRST_PHASE_B_RENDER_SWITCH_CLOSEOUT.md`

## What changed

The active AI Command root render now calls:

```js
root.innerHTML = renderAiCommandChatFirstShell({
        session,
        projectName,
        aiContext,
        bridgeStatus,
        escapeHtml
});
```

The old primary shell is no longer mounted by `root.innerHTML`.

## Removed from active root mount

- `renderPhase1Header(...)`
- `renderPhase1TeamRail(...)`
- `renderAiRoomConversationHeader(...)`
- `renderPhase3SpecialistConversation(...)`
- `renderPhase1Composer(...)`
- `renderAiRoomOutputWorkspace(...)`
- `renderPhase35ToolsPanel(...)`
- `renderAiRoomStatusStrip(...)`

The old helpers still exist as inactive helper functions, but they are not mounted by the root render.

## Chat-first tab behavior

Added the local frontend-only tab handler for:

```js
[data-aicmd-chatfirst-tab]
```

Allowed tabs:

- `team`
- `tools`
- `output`
- `flow`

The handler only updates `session.chatFirstTab`, persists the local session draft label, and re-renders AI Command. It does not call APIs, navigate routes, or write project data.

`session.chatFirstTab` initializes before render to:

- `output` when `session.outputPreview` exists
- `team` otherwise

## Preserved behavior

Existing post-render handlers were left in place:

- session select
- new session
- settings
- specialist selection through `[data-aicmdv2-specialist]`
- Solo / Full Team through `[data-aicmdv2-team-mode]`
- prompt buttons
- quick buttons
- `bindAiToolDock`
- input handling
- `aicmdV2VoiceBtn`
- `aicmdV2AskBtn`
- output preview/handoff handlers

## Safety boundaries kept

- No CSS change.
- No backend/API/router/app/data change.
- No provider behavior change.
- No `executeProjectAiChat` payload behavior change.
- No Tool Drawer behavior change.
- No voice activation.
- No planned specialist activation.
- No commit created.

## Validation

Passed:

```bash
node --check public/control-center/pages/ai-command.js
git diff --check -- public/control-center/pages/ai-command.js
```

Recorded:

```bash
git status --short
git diff --stat
```

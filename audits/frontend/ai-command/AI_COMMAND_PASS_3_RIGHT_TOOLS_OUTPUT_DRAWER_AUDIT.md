# AI Command Pass 3 - Right Tools / Output Drawer + CSS Consolidation Audit

## Summary

This audit reviews the AI Command right-side Output Workspace, Canonical Tools panel, tool-dock/drawer relationship, and related CSS layering after the chat-first meeting room passes.

The current implementation is functionally safe and committed. The next risk is not JavaScript behavior; it is accumulated CSS layering around right-side tools and output surfaces.

## Current baseline

- Branch: architecture/frontend-consolidation-v1
- Current HEAD includes:
  - AI Command chat-first meeting room
  - AI Command unified chat surface
  - AI Command compact header/session controls
- Git working tree was clean before this audit.
- Core validation passed:
  - public/control-center/pages/ai-command.js
  - public/control-center/pages/ai-command/tool-dock.js
  - public/control-center/app.js
  - public/control-center/router.js

## Right panel source of truth

The right-side experience is split into two official areas:

1. Output Workspace
   - Rendered by `renderAiRoomOutputWorkspace(...)`
   - Uses output preview/session state.
   - Shows draft/task/workflow/handoff/export style preview tabs.
   - Uses `data-aicmdv2-output-tab`.

2. Canonical Tools
   - Rendered by `renderPhase35ToolsPanel(...)`
   - Uses `getAiToolDockTools(...)`.
   - Shows specialist-specific tools.
   - Uses `data-aicmdv2-tool`.
   - Tool interactions are bound through AI Command handlers and tool-dock integration.

## Tool dock / drawer relationship

`tool-dock.js` contains real drawer/source-bridge logic:

- Shared Library source bridge
- Drawer return context
- Source validation
- Source-required warning
- Library source selection handoff
- Drawer focus management

Therefore the current right panel is not just decorative. It is connected to a larger tool-dock/drawer model and must not be deleted or visually replaced without a targeted plan.

## Current UX decision

Final intended layout:

- Left: AI Team / Specialists
- Center: Chat-first Meeting Room
- Right: Official Output Workspace + Canonical Tools
- Bottom: Quiet status strip

Tools must not be duplicated in the center. The right panel remains the official tool/action area.

## CSS duplication findings

The audit found significant CSS selector accumulation around the right panel:

- `.aicmd-room-output`: 67 occurrences
- `.aicmd-room-output-workspace`: 9 occurrences
- `.aicmd-room-tools`: 12 occurrences
- `.aicmd-v2-tools`: 14 occurrences
- `.aicmd-v2-tools-grid`: 4 occurrences
- `.aicmd-v2-tool-btn`: 4 occurrences
- `.aicmd-room-tools-grid`: 3 occurrences
- `.aicmd-room-tool-card`: 1 occurrence
- `.aicmd-room-output-tabs`: 3 occurrences
- `.aicmd-room-output-tab`: 9 occurrences
- `.aicmd-room-output-body`: 4 occurrences

This indicates layered CSS history rather than one canonical right-panel styling source.

## Risk assessment

### Low risk

- Keeping current right panel as-is.
- Creating an audit report.
- Small scoped visual polish.

### Medium risk

- Adding another CSS override layer without consolidation.
- Styling output tabs and tool cards separately again.

### High risk

- Deleting old CSS blocks without visual regression testing.
- Modifying `tool-dock.js` before mapping dependencies.
- Moving tool actions back into the center.
- Changing IDs or data attributes used by handlers.

## What should not change yet

- Do not remove `tool-dock.js`.
- Do not remove `bindAiToolDock`.
- Do not remove `getAiToolDockTools`.
- Do not remove `data-aicmdv2-tool`.
- Do not remove `data-aicmdv2-output-tab`.
- Do not move canonical tools into the center chat.
- Do not implement real autonomous execution.
- Do not implement real drawer behavior changes yet.

## Recommended Pass 3A

### Name

AI Command Pass 3A - Right Panel CSS Authority Map

### Goal

Create a precise CSS authority map before any CSS deletion or right-panel redesign.

### Scope

Audit only, or document-only plus selected excerpts.

### Required findings

- Which CSS blocks define the base right panel?
- Which blocks are later overrides?
- Which rules are mobile-only?
- Which selectors are still visually active?
- Which selectors are dead or superseded?
- Which CSS can be consolidated safely later?

## Recommended Pass 3B

### Name

AI Command Pass 3B - Right Output Tools Visual Polish

### Goal

After the authority map, apply a small visual polish to the right panel only.

### Intended UX

- Output Workspace stays above Canonical Tools.
- Tool cards remain specialist-specific.
- Tool cards should be calmer, more compact, and easier to scan.
- Right panel should feel like an official tools drawer/sidebar.
- No center tool duplication.

## Browser QA checklist for future right panel work

- [ ] Output tabs still switch preview modes.
- [ ] Tool cards still open/prepare correct preview.
- [ ] Source-required tools still warn correctly.
- [ ] Library source bridge still works.
- [ ] Right panel scroll remains usable.
- [ ] Center chat remains unaffected.
- [ ] Left specialist switching still updates tools.
- [ ] Full Team mode does not break right panel.
- [ ] No console errors.

## Final recommendation

Do not patch right-panel CSS yet.

Proceed first with Pass 3A: CSS Authority Map. This prevents repeating the previous pattern of adding CSS over CSS and protects the tool-dock/drawer behavior.

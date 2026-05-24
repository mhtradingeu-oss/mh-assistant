# AI Command Pass 3A - Right Panel CSS Authority Map

## Summary

This audit maps the CSS authority layers for the AI Command right-side Output Workspace and Canonical Tools panel.

The right panel is functional and should remain the official tools/output area. The next improvement must be based on a CSS authority map, because selector counts show heavy accumulated styling history.

## Current functional truth

### Output Workspace

- Rendered by `renderAiRoomOutputWorkspace(...)`.
- Uses `session.outputPreview`.
- Uses output tabs through `data-aicmdv2-output-tab`.
- Handles preview states for draft/task/workflow/handoff style outputs.
- Must stay above the Canonical Tools panel.

### Canonical Tools

- Rendered by `renderPhase35ToolsPanel(...)`.
- Uses `getPhase35ToolSet(session)`.
- Uses `getAiToolDockTools(...)`.
- Uses `data-aicmdv2-tool`.
- Tool buttons prepare local previews or route guidance.
- Tools are official right-panel actions, not center chat actions.

### Tool dock / drawer logic

- `tool-dock.js` contains source bridge and drawer logic.
- `bindAiToolDock(...)` still exists and must not be removed casually.
- Library source selection and source-required validation are part of the drawer model.

## Current CSS selector counts

- `.aicmd-room-output`: 67
- `.aicmd-room-output-workspace`: 9
- `.aicmd-room-tools`: 12
- `.aicmd-v2-tools`: 14
- `.aicmd-v2-tools-head`: 2
- `.aicmd-v2-tools-grid`: 4
- `.aicmd-v2-tool-btn`: 4
- `.aicmd-room-tools-grid`: 3
- `.aicmd-room-tool-card`: 1
- `.aicmd-room-output-tabs`: 3
- `.aicmd-room-output-tab`: 9
- `.aicmd-room-output-body`: 4

## Authority layers observed

### Layer 1 - Older base tool styling

Selectors without `[data-page="ai-command"]`, including:

- `.aicmd-v2-tools`
- `.aicmd-v2-tools-head`
- `.aicmd-v2-tools-title`
- `.aicmd-v2-tools-subtitle`
- `.aicmd-v2-tools-grid`
- `.aicmd-v2-tool-btn`

This appears to be older generic AI Command / tool panel styling.

### Layer 2 - Page-scoped AI Command tool styling

Selectors scoped under `[data-page="ai-command"]`, including:

- `[data-page="ai-command"] .aicmd-v2-tools`
- `[data-page="ai-command"] .aicmd-v2-tools-title`
- `[data-page="ai-command"] .aicmd-v2-tools-head`
- `[data-page="ai-command"] .aicmd-v2-tools-subtitle`
- `[data-page="ai-command"] .aicmd-v2-tools-count`
- `[data-page="ai-command"] .aicmd-v2-tools-grid`
- `[data-page="ai-command"] .aicmd-v2-tool-btn`

This layer likely overrides the older base layer.

### Layer 3 - Final Room v1 right panel styling

Selectors around the final room layout, including:

- `[data-page="ai-command"] .aicmd-room-output`
- `[data-page="ai-command"] .aicmd-room-output-workspace`
- `[data-page="ai-command"] .aicmd-room-tools`
- `[data-page="ai-command"] .aicmd-room-output-head`
- `[data-page="ai-command"] .aicmd-room-output-tabs`
- `[data-page="ai-command"] .aicmd-room-output-tab`
- `[data-page="ai-command"] .aicmd-room-output-body`
- `[data-page="ai-command"] .aicmd-room-tools-grid`
- `[data-page="ai-command"] .aicmd-room-tool-card`

This is the most relevant authority layer for the current right panel.

### Layer 4 - Responsive and emergency overrides

There are multiple media-query and `!important` sections around:

- max-width 1700px
- max-width 1500px
- max-width 1280px
- max-width 1180px
- max-width 1100px
- max-width 760px

Some of these affect:

- `.aicmd-room-grid`
- `.aicmd-room-output`
- `.aicmd-room-output-workspace`
- `.aicmd-room-tools`
- `.aicmd-room-tools-grid`
- `.aicmd-room-output-tabs`

These are risky to delete without viewport QA.

## Current problem

The right panel does not currently have one clean canonical CSS block.

Instead, it is shaped by:

1. Older `.aicmd-v2-*` tool rules.
2. Page-scoped AI Command overrides.
3. Final Room v1 rules.
4. Multiple responsive overrides.
5. Some `!important` layout patches.

This creates risk that future visual polish will become another override layer.

## Safe consolidation strategy

### Do not delete yet

Do not delete CSS in Pass 3A.

### Pass 3B should be visual only

Pass 3B may add one small final override block for right-panel readability only if needed, but should not attempt full deletion.

### Pass 3C should consolidate

Only after browser QA, Pass 3C can consolidate CSS by:

- Grouping right panel rules.
- Removing proven-dead old selectors.
- Keeping mobile/responsive rules until tested.
- Avoiding changes to JS handlers.

## Recommended Pass 3B

Name:

AI Command Pass 3B - Right Panel Visual Readability Polish

Scope:

- CSS only if possible.
- No JS unless absolutely necessary for class naming.
- No `tool-dock.js`.
- No backend.
- No center chat changes.

Goal:

- Make Output Workspace calmer.
- Make Canonical Tools cards easier to scan.
- Keep right panel official and secondary to center chat.
- Do not add tool duplication to center.

Allowed selectors:

- `[data-page="ai-command"] .aicmd-room-output`
- `[data-page="ai-command"] .aicmd-room-output-workspace`
- `[data-page="ai-command"] .aicmd-room-tools`
- `[data-page="ai-command"] .aicmd-room-output-tabs`
- `[data-page="ai-command"] .aicmd-room-output-tab`
- `[data-page="ai-command"] .aicmd-room-output-body`
- `[data-page="ai-command"] .aicmd-room-tools-grid`
- `[data-page="ai-command"] .aicmd-room-tool-card`
- `[data-page="ai-command"] .aicmd-v2-tool-btn`

Forbidden in Pass 3B:

- No center composer changes.
- No left roster changes.
- No tool-dock.js changes.
- No handler changes.
- No route changes.
- No data/project changes.
- No autonomous execution.

## Browser QA required before any right panel commit

- [ ] Output tabs switch correctly.
- [ ] Empty output state remains readable.
- [ ] Preview output state remains readable.
- [ ] Tool cards remain clickable.
- [ ] Tool cards prepare expected previews.
- [ ] Specialist switching updates tool list.
- [ ] Full Team mode shows team tools.
- [ ] Center chat remains unaffected.
- [ ] Right panel scroll works.
- [ ] No console errors.

## Final recommendation

Proceed to Pass 3B only as a small visual readability polish.

Do not attempt CSS deletion/consolidation yet.

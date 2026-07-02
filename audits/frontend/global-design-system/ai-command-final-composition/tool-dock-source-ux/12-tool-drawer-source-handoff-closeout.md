# AI-COMMAND-GDS-2Z — Tool Drawer Source Handoff Closeout

## Status
Closed.

## Final Commit
`ca930af` — Fix AI Command tool drawer source handoff hydration

## Scope
Closed the Library → AI Command → Tool Drawer source handoff and setup-select hydration flow.

## Root Cause
AI Command v2 opens tools through `data-aicmdv2-tool`, while the Library return path expected old `data-aicmd-tool-dock` buttons. When returning from Library, the drawer shell could reopen directly without going through the full `openToolDrawer(...)` hydration path.

Result:
- Selected source card appeared.
- First 3 setup selects stayed empty:
  - Output Type
  - Source / Input
  - Destination
- `Use in Composer` was not reliable.

## Completed Fixes
- Library return path supports both old tool dock buttons and AI Command v2 tool buttons.
- Tool metadata fallback added.
- `openToolDrawer(...)` supports an explicit tool object.
- `openAiToolDrawerFromMetadata(...)` passes real tool metadata through.
- Select hydration hardened for arrays and delimited strings.
- Tool id detection fixed.
- Invalid media path preview toast suppressed when source handoff itself succeeds.
- Selected source card UX improved:
  - `AI Source`
  - `Change source`
  - `Remove source`

## Verified
- Syntax checks passed:
  - `public/control-center/pages/ai-command/tool-dock.js`
  - `public/control-center/pages/ai-command.js`
  - `public/control-center/pages/library.js`
  - `public/control-center/app.js`
  - `public/control-center/router.js`
  - `public/control-center/api.js`
  - `runtime/orchestrator-service/server.js`
- Git working tree clean.
- No runtime data noise.

## Safety
- No backend change.
- No API change.
- No command execution contract change.
- Library source handoff preserved.
- Tool drawer hydration restored.

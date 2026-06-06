# 10 — Patch 2 Main Source Indicator

Implemented: Patch 2A main-surface selected Library source indicator.

## Changed

- Exported the existing `getSelectedLibrarySource(projectName)` helper from `public/control-center/pages/ai-command/tool-dock.js`.
- Imported that helper in `public/control-center/pages/ai-command.js`.
- Added `renderAiCommandMainSourceIndicator(projectName, escapeHtml)`.
- Mounted one compact `AI Source` indicator in the composer context row.
- Added page-scoped CSS for `.aicmd-main-source-indicator`.

## Behavior

- If no Library source is selected, the helper renders nothing.
- If a Library source is selected, the main AI Command composer context row shows source name and compact type/status metadata.
- Long file paths are not rendered on the main surface.

## Safety

- No selected source storage or bridge logic was duplicated.
- Tool Drawer behavior was not changed.
- Library behavior was not changed.
- `Use in Composer` behavior was not changed.
- No backend/API or command execution behavior changed.

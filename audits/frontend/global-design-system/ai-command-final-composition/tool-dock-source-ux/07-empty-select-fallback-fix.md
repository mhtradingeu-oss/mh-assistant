# AI-COMMAND-GDS-2E — Empty Select Fallback Fix

## Status
Implemented pending browser validation.

## Finding
The Tool Drawer select fields can render empty when the opening button does not provide populated:
- `data-aicmd-tool-dock-outputs`
- `data-aicmd-tool-dock-sources`
- `data-aicmd-tool-dock-destinations`

## Fix
When button metadata is missing, the drawer now falls back to tool metadata/defaults before calling `populateDrawerSelect`.

## Safety
- No backend change.
- No API change.
- No command execution contract change.
- Existing button metadata still wins when present.

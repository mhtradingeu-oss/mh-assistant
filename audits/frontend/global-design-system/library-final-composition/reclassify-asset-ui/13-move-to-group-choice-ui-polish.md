# LIB-FEATURE-5J — Move to Group Choice UI Polish

## Status
Implemented pending browser validation.

## Purpose
Improve the visible Move to group choices after dropdown/details interaction proved unreliable in the Action Panel.

## UX Decision
Use always-visible compact choice buttons with:
- current group badge
- scrollable compact grid
- no native select
- no collapsible details dependency

## Safety
- Backend/API unchanged.
- Metadata-only reclassification unchanged.
- No physical file movement.
- No file_path change.
- CSS limited to Library move-to-group control.

# LIB-FEATURE-5E — Move to Group Dropdown Interaction Fix

## Status
Implemented pending browser validation.

## Problem
The first Move to group dropdown appeared but did not open reliably in the Action Panel.

## Fix
- Moved the selector into a dedicated `library-panel-move-control` block.
- Kept the action button separate as `Move to selected group`.
- Added narrow CSS only for the move-to-group control.
- Did not change backend, API, upload, preview, archive, delete, or source-of-truth behavior.

## Safety
- Metadata-only reclassification remains unchanged.
- No physical file movement.
- No file_path change.

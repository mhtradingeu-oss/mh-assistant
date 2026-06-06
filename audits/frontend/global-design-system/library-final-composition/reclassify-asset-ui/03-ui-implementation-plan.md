# 03 — Reclassify Asset UI Implementation Plan

## Status
Plan only. No runtime UI changes yet.

## Recommended UI
- Add a Reclassify asset button in the selected asset Action Panel near Rename/Archive.
- First implementation uses a controlled browser prompt for canonical asset type.
- Future polish can replace prompt with a modal/select.

## Required Behavior
- Validate selected asset id.
- Validate chosen asset type.
- Call reclassifyProjectAsset.
- Reload project data.
- Re-render Library.
- Show success/error message.
- Preserve upload/preview/archive/delete/source-of-truth behavior.

## Forbidden
- No physical file move.
- No file_path change.
- No broad CSS rewrite.
- No changing existing action data attributes.

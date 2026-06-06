# LIB-FEATURE-5I — Move to Group Always Visible Choices

## Status
Implemented pending browser validation.

## Finding
Runtime diagnostic confirmed:
- Move to group DOM exists.
- Choice buttons exist.
- No overlay blocks the summary.
- Details can toggle programmatically.

However, browser interaction with native details was not reliable enough for this Action Panel.

## Decision
Remove dropdown/details behavior and show Move to group choices directly as visible buttons.

## Safety
- Backend/API unchanged.
- Metadata-only reclassification unchanged.
- No physical file movement.
- No file_path change.
- No broad CSS rewrite.

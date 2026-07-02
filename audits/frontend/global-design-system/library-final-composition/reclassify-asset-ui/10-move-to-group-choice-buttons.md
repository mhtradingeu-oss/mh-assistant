# LIB-FEATURE-5F — Move to Group Choice Buttons

## Status
Implemented pending browser validation.

## Problem
Native dropdown did not open reliably inside the Library Action Panel.

## Fix
Replaced dropdown with a details/summary group chooser using explicit buttons.

## User Experience
- User opens "Move to group".
- User clicks the target group directly.
- No manual typing.
- No native select dependency.

## Safety
- Backend/API contract unchanged.
- Metadata-only reclassification unchanged.
- No physical file movement.
- No file_path change.

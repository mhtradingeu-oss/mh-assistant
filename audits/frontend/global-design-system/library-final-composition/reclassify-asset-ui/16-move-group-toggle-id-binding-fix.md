# LIB-FEATURE-5N — Move Group Toggle ID Binding Fix

## Status
Implemented pending browser validation.

## Finding
Browser diagnostic showed:
- CSS works when checkbox is toggled manually.
- Label click did not toggle the checkbox.
- The likely cause was a static/reused checkbox id.

## Fix
Use a unique checkbox id per selected asset/registry asset and bind the label to that id.

## Safety
- Backend/API unchanged.
- Metadata-only reclassification unchanged.
- No physical file movement.
- No file_path change.

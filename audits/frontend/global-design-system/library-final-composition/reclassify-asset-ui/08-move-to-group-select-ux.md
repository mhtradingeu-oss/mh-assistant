# LIB-FEATURE-5D — Move to Group Select UX

## Status
Implemented pending validation.

## Purpose
Replace the technical prompt-based reclassification UI with a clearer user-facing select control.

## User-Facing Language
- `Move to group`

## Technical Contract Preserved
- Backend route remains classification.
- API client remains reclassifyProjectAsset.
- Persistent field remains asset_type.

## Safety
- No physical file movement.
- No file_path change.
- No broad CSS rewrite.
- Existing buttons preserved.

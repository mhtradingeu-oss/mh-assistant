# LIB-FEATURE-5K — Custom Move to Group Dropdown

## Status
Implemented pending browser validation.

## Reason
Always-visible group choices worked but occupied too much vertical space.

Native select and details were unreliable inside the Library Action Panel, so the final UX uses a custom controlled dropdown:
- Button: Change group
- Hidden/visible choice grid
- Explicit group buttons

## Safety
- Backend/API unchanged.
- Metadata-only reclassification unchanged.
- No physical file movement.
- No file_path change.

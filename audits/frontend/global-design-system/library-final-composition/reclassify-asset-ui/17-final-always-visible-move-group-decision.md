# LIB-FEATURE-5O — Final Move to Group UX Decision

## Status
Finalized pending browser validation.

## Finding
Multiple dropdown approaches were tested inside the Library Action Panel:
- native select
- details/summary
- JS-controlled toggle
- CSS checkbox toggle

They were unreliable in this panel/scroll context.

## Final Decision
Use always-visible compact group choice buttons.

## Reason
This is the only interaction pattern that was confirmed visible and reliable in the Action Panel.

## Safety
- Backend/API unchanged.
- Metadata-only reclassification unchanged.
- No physical file movement.
- No file_path change.
- Existing Library actions preserved.

# LIB-FEATURE-5L — CSS-only Move to Group Dropdown

## Status
Implemented pending browser validation.

## Reason
The JS-controlled custom dropdown rendered correctly but did not open reliably in the Library Action Panel.

## Fix
Use a CSS-only checkbox + label toggle:
- No native select
- No details/summary
- No JS menu-toggle handler
- Group buttons remain explicit and clickable

## Safety
- Backend/API unchanged.
- Metadata-only reclassification unchanged.
- No physical file movement.
- No file_path change.

# LIB-UX-1C — AI Source Action Label Polish

## Status
Implemented pending browser validation.

## UX Decision
Use `Use as AI Source` instead of `Review with AI`.

## Reason
The action sends the selected asset/evidence into the AI review/source workflow. It does not only start a generic review.

## Changed
- Clarified preview helper text.
- Clarified selected asset helper text.
- Renamed user-facing AI source button to `Use as AI Source`.
- Kept existing data attribute and behavior.

## Safety
- No backend change.
- No API change.
- No action contract change.
- `data-library-use-ai-source` preserved.

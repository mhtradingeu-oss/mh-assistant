# AI-COMMAND-GDS-2C — Invalid Media Path Toast Suppression

## Status
Implemented pending browser validation.

## Finding
The visible toast `Could not load asset preview: Invalid media path` comes from the Library protected thumbnail/preview loader, not from the AI Command Tool Dock source card.

## UX Problem
When Library is used as a source handoff into AI Command, a failed preview/thumbnail can surface as a noisy toast even though the source handoff itself still works.

## Fix
For `Invalid media path` preview failures:
- Keep the inline fallback.
- Do not show a global error toast.
- Preserve all other preview error toasts.

## Safety
- No backend change.
- No API change.
- No source handoff change.
- No command execution change.
- Preview fallback behavior remains visible inline.

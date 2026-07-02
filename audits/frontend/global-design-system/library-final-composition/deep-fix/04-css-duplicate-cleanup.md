# LIB-FINAL-5C — CSS Duplicate Cleanup

## Status
Implemented pending validation.

## Purpose
Remove duplicate Library required-card text CSS caused by layered Library polish patches.

## Fixed
- Kept one `[data-page="library"] .library-required-card-foot small` rule.
- Removed duplicate later occurrences.
- Ensured Required Asset CTA highlight targets the real `.library-actions-card`, not stale `.library-intake-card`.

## Safety
- CSS cleanup only.
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Library handlers unchanged.
- Upload/preview/mutation behavior unchanged.

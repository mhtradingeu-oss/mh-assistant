# PHASE 3N.5 — Library Required Assets Cards CSS Polish

## Status
CSS-only polish for Required Assets cards completed.

## Files Changed
- public/control-center/styles/14-page-standard.css

## CSS Scope
All changes are scoped to the Library page using `[data-page="library"]`.

## CSS Selectors Added/Changed
- `[data-page="library"] .library-required-grid`
- `[data-page="library"] .library-required-card`
- `[data-page="library"] .library-required-card-head`
- `[data-page="library"] .library-required-card-head h4`
- `[data-page="library"] .library-required-card p`
- `[data-page="library"] .library-required-why`
- `[data-page="library"] .library-required-card-foot`
- `[data-page="library"] .library-required-card-foot small`
- `[data-page="library"] [data-library-required-action]`
- Existing badges inside required asset cards

## Protected Behavior Preserved
- No JS changes.
- No backend changes.
- No api.js changes.
- No data/projects changes.
- No IDs, data attributes, handlers, API calls, or text generation changed.
- CSS is page-scoped and does not target non-Library pages.

## Validation Results
- node --check public/control-center/pages/library.js: pass
- node --check public/control-center/app.js: pass
- node --check public/control-center/router.js: pass
- node --check public/control-center/api.js: pass
- node --check public/control-center/shared-context.js: pass

## Browser QA Required
Before commit, confirm:
- Required Assets cards are visually cleaner and less crowded.
- Spacing between title, description, badges, and buttons is improved.
- Present vs Needs Review is visually clear.
- Classify/Review buttons are consistent and readable.
- No awkward text clipping.
- Section remains compact and premium.
- Responsive behavior is safe.

## Production Changes
CSS-only. No production logic changed.

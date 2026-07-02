# OPS-FINAL-1A — Operations Overview Route Safety Fix

## Status
Accepted.

## Problem
Operations Overview rendered route buttons with `data-route`, but the existing shared route binding helper listens for `data-ops-route`.

## Runtime Impact
Before this fix, overview buttons could render visually without being captured by `bindRouteButtons`.

## Fix
Changed overview-only route buttons from:

- `data-route`

to:

- `data-ops-route`
- `data-ops-label`

## Scope
Changed runtime file:

- `public/control-center/pages/operations-centers.js`

Documentation:

- `13-operations-overview-render-excerpt.md`
- `14-operations-overview-id-route-signals.txt`
- `15-operations-overview-route-safety-fix.md`

## Safety Confirmation
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Sub-page renderers unchanged.
- Task Center unchanged.
- Queue Center unchanged.
- Job Monitor unchanged.
- Notification Center unchanged.
- Existing `bindRouteButtons` behavior reused instead of adding a new handler.

## Decision
Route safety fix is accepted and should be committed before visual overview polish.

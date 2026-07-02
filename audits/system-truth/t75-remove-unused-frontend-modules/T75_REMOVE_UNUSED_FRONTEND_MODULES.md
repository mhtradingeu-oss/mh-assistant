# T75 — Remove Confirmed Unused Frontend Modules

## Status
Cleanup patch.

## Scope
Remove frontend page modules confirmed unused by T73/T74 source inspection.

## Removed files
- `public/control-center/pages/library/catalog-readiness.js`
- `public/control-center/pages/integrations/layout.js`
- `public/control-center/pages/integrations/state.js`

## Evidence
T73 found:
- No duplicate route groups.
- `library/catalog-readiness.js` as candidate unused.
- `integrations/layout.js` and `integrations/state.js` as string-only referenced.

T74 follow-up confirmed:
- No current source import references in `public/control-center` or `scripts`.
- The only previous references were from historical audit/evidence files.
- The files are not imported by router, app, library, integrations, or active page modules.

## Decision
Remove the three unused modules to reduce dead code, avoid future confusion, and keep the frontend canonical surface clean.

## Safety boundary
This patch does not modify active routed pages or runtime behavior.

## Validation required
- `node --check public/control-center/router.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/pages/library.js`
- `node --check public/control-center/pages/integrations.js`
- Full current-source grep confirms no remaining imports of removed modules.

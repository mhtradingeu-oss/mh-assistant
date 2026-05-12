# Route Role Fallback Implementation Report

Date: 2026-05-12
Branch: architecture/frontend-consolidation-v1
Mode: Safe implementation (minimal production change)

## What changed

A single centralized frontend fallback authority module was added and both runtime entry points now consume it.

- Added centralized module:
  - public/control-center/runtime/authority/route-role-fallback.js
- Updated app fallback usage:
  - public/control-center/app.js
- Updated router fallback usage:
  - public/control-center/router.js

## Files touched

1. public/control-center/runtime/authority/route-role-fallback.js
2. public/control-center/app.js
3. public/control-center/router.js
4. audits/frontend/authority-boundary/route-role-fallback-implementation/ROUTE_ROLE_FALLBACK_IMPLEMENTATION_REPORT.md

## Why behavior is expected to remain identical

- `ACTIVE_ROUTE_ROLES` values are unchanged.
- `DEFAULT_ROUTE_ROLE_ACCESS` route keys and role lists are unchanged.
- `app.js` remains backend-projection-first:
  - Uses projected backend route permissions when present.
  - Uses centralized frontend fallback only when projection is absent.
- `router.js` still checks `routeAccessResolver` first.
- `router.js` still falls back safely when resolver is missing or throws.
- Fallback return shape remains exactly:
  - `{ allowed: boolean, reason: string }`
- Existing reason text patterns were preserved:
  - App path: "Your current role is ..."
  - Router default path: "Default role is ..."

## Validation performed

- Syntax checks for all three production JS files.
- Duplicate constant definition scan in app/router/new module.
- Wiring scan for resolver and fallback integration points.
- Parity script run to verify:
  - 19 routes
  - 9 active roles
  - Access decision shape for all 171 route x role combinations
  - Export parity for roles and route keys

## Parity results

Expected result after implementation:

- `roleOk: true`
- `routesOk: true`
- `roleCount: 9`
- `routeCount: 19`
- `decisionChecks: 171`
- `failures: []`

## Rollback plan

If rollback is needed:

1. Revert these three production files to pre-change state:
   - public/control-center/runtime/authority/route-role-fallback.js (remove)
   - public/control-center/app.js
   - public/control-center/router.js
2. Re-run syntax and parity checks.
3. Confirm duplicate constants are restored only in app/router (original baseline state).

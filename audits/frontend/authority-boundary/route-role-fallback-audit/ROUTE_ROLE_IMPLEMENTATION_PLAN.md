# Route Role Implementation Plan

## Recommended option
Option E (Hybrid)
- Backend projection first
- Single frontend fallback module only when backend projection is absent

Rationale:
- Lowest behavior-change risk
- Preserves compatibility during startup/partial-load states
- Removes duplicate fallback authority definitions
- Keeps backend as primary authority source

## Step-by-step implementation plan (later)
1. Snapshot current route-role maps
- Capture app.js and router.js maps into an audit artifact for exact rollback equivalence.

2. Create a single fallback authority module
- Proposed file: public/control-center/runtime/authority/route-role-fallback.js
- Export:
  - ACTIVE_ROUTE_ROLES
  - DEFAULT_ROUTE_ROLE_ACCESS
  - helper: getFallbackRouteAccess(route, activeRole)

3. Update router.js
- Remove local duplicate ACTIVE_ROUTE_ROLES and DEFAULT_ROUTE_ROLE_ACCESS
- Import fallback helper/module
- Keep getRouteAccess() response contract unchanged

4. Update app.js
- Remove local duplicate ACTIVE_ROUTE_ROLES and DEFAULT_ROUTE_ROLE_ACCESS
- Import fallback helper/module
- resolveRouteAccess(route) remains backend-first:
  - if projected route rule exists -> use it
  - else -> call shared fallback helper

5. Keep behavior contract stable
- No route ID changes
- No role label changes
- No nav structure changes
- No page shell/layout changes

6. Validate parity before commit
- Compare per-route access outcomes for all known roles
- Confirm access-denied rendering parity
- Confirm navigation and hash route behavior unchanged

## Validation commands (post-implementation)
```bash
cd /opt/mh-assistant

# lint/syntax safety for touched frontend files
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/runtime/authority/route-role-fallback.js

# confirm only expected files changed
git status --short

# ensure duplicate map definitions are removed from app/router and exist once in module
rg -n "DEFAULT_ROUTE_ROLE_ACCESS|ACTIVE_ROUTE_ROLES" public/control-center --glob "*.js"

# verify resolver wiring still present
rg -n "setRouteAccessResolver|resolveRouteAccess|getRouteAccess|getDefaultRouteAccess" public/control-center/app.js public/control-center/router.js
```

## Browser QA checklist
1. Load Control Center and verify default route opens without access regression.
2. Switch role using topbar selector and validate allowed/denied behavior for all 19 routes.
3. Verify denied routes show same access-denied view and reason format as baseline.
4. Confirm sidebar route clicks still navigate correctly (no broken hash routing).
5. Refresh with deep-link hash routes and validate route access remains consistent.
6. Confirm no visual/nav changes (labels, ordering, shells remain identical).

## Rollback plan
1. Revert fallback module integration commit only.
2. Restore previous map definitions in app.js and router.js from snapshot artifact.
3. Re-run syntax checks and route-role comparison script.
4. Re-run browser QA checklist to confirm full parity restoration.

## Explicit non-goals
- No backend authority model changes
- No role redesign
- No route redesign/rename
- No page shell or UI redesign
- No Auto Mode changes

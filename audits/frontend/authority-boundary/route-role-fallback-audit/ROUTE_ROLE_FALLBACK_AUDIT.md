# Route Role Fallback Authority Audit

## Scope
- Repository: /opt/mh-assistant
- Branch: architecture/frontend-consolidation-v1
- Mode: Audit only (no production changes)
- Evidence: audits/frontend/authority-boundary/route-role-fallback-audit/ROUTE_ROLE_EVIDENCE.txt

## 1) Exact fallback map locations
Frontend fallback maps are defined in exactly two production files:
- public/control-center/app.js
  - ACTIVE_ROUTE_ROLES
  - DEFAULT_ROUTE_ROLE_ACCESS
  - resolveRouteAccess() uses backend projection first, fallback map second
- public/control-center/router.js
  - ACTIVE_ROUTE_ROLES
  - DEFAULT_ROUTE_ROLE_ACCESS
  - getDefaultRouteAccess()/getRouteAccess() use fallback if resolver absent or throws

No additional fallback map definition was found in other frontend JS files.

## 2) Are app/router fallback maps identical?
Result: yes, currently identical.
- ACTIVE_ROUTE_ROLES: identical (9 roles)
- DEFAULT_ROUTE_ROLE_ACCESS: identical (19 routes)
- App vs Router drift count: 0

## 3) Where fallback maps are used today
### app.js usage path
- resolveRouteAccess(route):
  - reads backend-projected route permissions via getProjectedRoutePermissions({ operations })
  - reads active role via getActiveRole() (local storage -> projection -> default)
  - falls back to DEFAULT_ROUTE_ROLE_ACCESS when backend does not provide explicit rule
- setRouteAccessResolver(resolveRouteAccess) injects this resolver into router

### router.js usage path
- getRouteDefinition(route) -> getRouteAccess(route)
- getRouteAccess(route):
  - uses resolver if present
  - else getDefaultRouteAccess(route) from router-local fallback map
- Access denied route is rendered when access.allowed is false

### not used for
- Sidebar/nav visibility filtering: no direct role-filtered nav rendering path found
- AI team role projection: handled elsewhere; not coupled to fallback maps directly

## 4) Backend projection relationship
Backend authority source is explicit in runtime/orchestrator-service/lib/ops/backbone.js:
- Team model defaults include:
  - active_role
  - role_matrix
  - route_permissions
  - service_model.domains
- buildProjectOperationsPayload() projects team_service_model with route_permissions/active_role/role_matrix

Backend transport path:
- /media-manager/project/:project/operations returns buildProjectOperationsPayload()
- Startup endpoint /media-manager/project/:project/startup returns operations summary placeholder, not full team_service_model (important compatibility gap)

## 5) Frontend consumption of backend projection today
- authority-projection helper:
  - getProjectedRoutePermissions() -> operations.team_service_model.route_permissions
  - getProjectedActiveRole() -> operations.team_service_model.active_role (fallback to state.activeRole)
- app.js resolveRouteAccess() consumes this projection first
- state.js stores operations snapshot in state.data.operations
- shared-context.js focuses on handoff/draft sharing, not role routing authority

## 6) Compatibility debt classification
- Safe compatibility fallback:
  - single in-memory fallback map used when backend route_permissions are absent/unavailable
- Duplicate authority risk:
  - same fallback map duplicated in app.js and router.js
- Frontend-only UX state:
  - current role local storage selector state and role label presentation
- Backend authority projection:
  - team_service_model.active_role/route_permissions/role_matrix from operations payload
- Should be centralized later:
  - fallback map ownership and resolver wiring in one canonical module

## 7) Safest architecture option
Recommended: E (Hybrid)
- Backend projection first
- Single frontend fallback module used only when projection absent

Why E is safest now:
- Preserves current behavior under projection gaps (startup/partial load/offline states)
- Avoids hard break risk from removing fallback entirely
- Removes duplication risk by centralizing fallback map and helper behavior
- Keeps doctrine intact: backend remains primary authority; fallback is documented compatibility guard

## 8) What should happen later (implementation, not now)
- Snapshot current app/router maps
- Create one read-only fallback module under runtime/authority
- Update app.js and router.js to consume that single module
- Keep resolver response shape unchanged ({ allowed, reason })
- Validate route access outcomes and navigation remain unchanged

## 9) What should not be changed
- No backend route redesign
- No role redesign
- No UI/shell redesign
- No route rename
- No Auto Mode behavior change

# P3.2 — Router Ownership Classification

## Current problem

Router ownership is split between:
- router.js
- app.js

This creates:
- duplicated route authority
- duplicated role maps
- duplicated navigation lifecycle
- duplicated browser synchronization
- compatibility debt
- runtime coupling

---

# Canonical target architecture

## router.js owns
- route registration
- navigation lifecycle
- route transitions
- browser hash synchronization
- route rendering dispatch
- route projection hooks

## app.js owns
- runtime bootstrapping
- runtime orchestration
- runtime services
- state hydration
- overlay/runtime startup
- authority projection wiring

## state.js owns
- activeRoute projection
- current route snapshot

---

# Forbidden after P3

app.js must NOT:
- own route authority
- own hashchange lifecycle
- own browser navigation synchronization
- own route access fallback maps
- own navigation dispatch

---

# Current duplicated ownership

## Duplicated role maps
- ACTIVE_ROUTE_ROLES
- DEFAULT_ROUTE_ROLE_ACCESS

## Duplicated navigation lifecycle
- navigateTo usage spread across app.js
- hashchange listeners in app.js

## Duplicated access resolution
- resolveRouteAccess duplicated conceptually

---

# P3 migration direction

Step 1:
Shadow classification only.

Step 2:
Projection-safe router helpers.

Step 3:
Move browser lifecycle ownership into router.js.

Step 4:
Deprecate app.js route ownership.

Step 5:
Stabilize runtime navigation orchestration.

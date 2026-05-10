# P1.13 — Router Projection Shadow Plan

## Goal
Prepare router.js for future backend authority projection without changing route behavior.

## Current state
- app.js now reads route permissions through authority-projection helper.
- router.js still uses DEFAULT_ROUTE_ROLE_ACCESS fallback only.
- backend team_service_model.route_permissions remains canonical authority.

## Rule
Do not source-switch router yet.
Do not change navigation behavior yet.
Do not remove DEFAULT_ROUTE_ROLE_ACCESS yet.

## Risk
router.js controls navigation and blocked route behavior. A premature switch can break page access.

## Recommended next step
Add a router projection compatibility helper only after verifying:
- router can receive operations projection safely
- blocked route UI remains unchanged
- fallback behavior remains identical

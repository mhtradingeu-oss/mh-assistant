# P1.6 — Shadow Projection Validation

## Goal
Validate that backend authority projection can replace frontend compatibility authority maps.

## Rule
No behavior change.
No source switch.
No route enforcement change.

## Compare

### Route permissions
Compare:
- frontend app/router fallback role maps
against:
- operations.team_service_model.route_permissions

### Team roles
Compare:
- frontend AI team definitions
against:
- operations.team_service_model.members
- operations.team_service_model.role_matrix

### Domains
Compare:
- frontend specialist assumptions
against:
- operations.team_service_model.domains

### Handoffs
Compare:
- shared-context transient cache
against:
- operations.handoffs.items

## Pass condition
The helper can safely read backend projections without mutating or enforcing anything.

## Next phase
P1.7 — First read-only integration into Home or AI Command.

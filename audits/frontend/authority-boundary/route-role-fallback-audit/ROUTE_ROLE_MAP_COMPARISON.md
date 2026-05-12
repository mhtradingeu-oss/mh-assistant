# Route Role Map Comparison

## Comparison basis
- app.js: DEFAULT_ROUTE_ROLE_ACCESS
- router.js: DEFAULT_ROUTE_ROLE_ACCESS
- backend: ROUTE_ROLE_ACCESS in runtime/orchestrator-service/lib/ops/backbone.js (projected through team_service_model.route_permissions)

## Role set for ALL_ACTIVE_ROLES
- strategist, writer, designer, video_lead, publisher, ads_operator, analyst, compliance_reviewer, admin

## Route comparison table

| Route | app.js roles | router.js roles | backend route_permissions support | mismatch/drift | comments |
|---|---|---|---|---|---|
| home | strategist, analyst, admin | strategist, analyst, admin | yes | no | aligned |
| setup | ALL_ACTIVE_ROLES | ALL_ACTIVE_ROLES | no | no | frontend-only fallback route |
| library | designer, video_lead, publisher, admin | designer, video_lead, publisher, admin | yes | no | aligned |
| integrations | admin | admin | yes | no | aligned |
| ai-command | ALL_ACTIVE_ROLES | ALL_ACTIVE_ROLES | no | no | frontend fallback only today |
| workflows | ALL_ACTIVE_ROLES | ALL_ACTIVE_ROLES | yes | no | aligned to backend all-roles map |
| campaign-studio | strategist, ads_operator, admin | strategist, ads_operator, admin | yes | no | aligned |
| content-studio | writer, strategist, compliance_reviewer, admin | writer, strategist, compliance_reviewer, admin | yes | no | aligned |
| media-studio | designer, video_lead, compliance_reviewer, admin | designer, video_lead, compliance_reviewer, admin | yes | no | aligned |
| publishing | publisher, compliance_reviewer, admin | publisher, compliance_reviewer, admin | yes | no | aligned |
| ads-manager | ads_operator, strategist, analyst, admin | ads_operator, strategist, analyst, admin | yes | no | aligned |
| insights | analyst, strategist, ads_operator, admin | analyst, strategist, ads_operator, admin | yes | no | aligned |
| research | strategist, analyst, writer, admin | strategist, analyst, writer, admin | yes | no | aligned |
| governance | compliance_reviewer, admin, analyst | compliance_reviewer, admin, analyst | yes | no | aligned |
| settings | admin | admin | yes | no | aligned |
| task-center | ALL_ACTIVE_ROLES | ALL_ACTIVE_ROLES | no | no | frontend fallback only today |
| queue-center | ALL_ACTIVE_ROLES | ALL_ACTIVE_ROLES | no | no | frontend fallback only today |
| job-monitor | ALL_ACTIVE_ROLES | ALL_ACTIVE_ROLES | no | no | frontend fallback only today |
| notification-center | ALL_ACTIVE_ROLES | ALL_ACTIVE_ROLES | no | no | frontend fallback only today |

## Findings summary
- app.js vs router.js map drift: none (exactly identical).
- Backend map currently covers 13 routes.
- 6 routes rely on frontend fallback if backend projection is used as-is:
  - setup
  - ai-command
  - task-center
  - queue-center
  - job-monitor
  - notification-center

## Default behavior comparison
- app.js fallback default role gate uses activeRole (resolved from local storage/projection/default).
- router.js local default fallback uses DEFAULT_ROLE="admin" only when resolver is missing/fails.
- In normal app flow, app.js resolver is set, so router's internal default is mostly a safety net.

# Frontend Source Switch Targets

## app.js
Current:
- local role selector
- local route role fallback

Switch target:
- operations.team_service_model.active_role
- operations.team_service_model.route_permissions

## router.js
Current:
- DEFAULT_ROUTE_ROLE_ACCESS fallback

Switch target:
- route permissions from operations.team_service_model

## ai-command.js
Current:
- static team/mode definitions
- local routing assumptions

Switch target:
- operations.team_service_model.members
- operations.team_service_model.domains
- operations.ai_recommendations
- operations.handoffs

## home.js
Current:
- local AI team cards list

Switch target:
- operations.team_service_model.members
- operations.tasks
- operations.approvals
- operations.notifications

## workflows.js
Current:
- local workflow/approval/auto mode assumptions

Switch target:
- operations.workflow_runs
- operations.approvals
- operations.handoffs
- operations.queue

## publishing.js
Current:
- local approval status logic
- local handoff bridge
- auto mode controls

Switch target:
- operations.governance
- operations.approvals
- operations.handoffs
- operations.publishing / queue

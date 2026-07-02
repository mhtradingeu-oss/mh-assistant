# Authority Projection Fields

## operations.team_service_model

Required frontend fields:
- active_role
- members[]
- role_matrix[]
- route_permissions[]
- domains[]
- escalation_chain

## operations.governance

Required frontend fields:
- policy
- risk_register
- approval_queue
- release_readiness
- publish_guardrails

## operations.approvals

Required frontend fields:
- total
- items[]
- pending count
- escalated count

## operations.handoffs

Required frontend fields:
- items[]
- available handoffs
- source_page
- destination_page
- payload.draft_context
- status

## operations.workflow_runs

Required frontend fields:
- total
- items[]
- status
- route_target
- owner_role
- reviewer_role

## operations.ai_recommendations

Required frontend fields:
- items[]
- route_target
- domain
- status
- reason
- priority

## operations.ai_memory

Required frontend fields:
- scopes
- latest memory snapshot
- project/campaign/channel/content memory references

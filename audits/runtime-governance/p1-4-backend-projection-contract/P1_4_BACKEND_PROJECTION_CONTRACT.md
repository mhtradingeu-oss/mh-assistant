# P1.4 — Backend Projection Contract

## Doctrine
Backend owns authority.
Frontend projects authority.

## Canonical backend projection sources

### 1. Team Service Model
Source:
- operations.team_service_model

Frontend may display:
- active_role
- members
- role_matrix
- route_permissions
- domains
- escalation_chain

Frontend must not redefine:
- role definitions
- route access
- service domain ownership
- action permissions

### 2. Governance Policy
Source:
- operations.governance
- operations.governance.policy
- operations.governance.risk_register
- operations.approvals

Frontend may display:
- pending approvals
- policy flags
- publish guardrails
- reviewer ownership
- risk warnings

Frontend must not decide:
- approval truth
- publish permission
- freeze policy
- escalation authority

### 3. Handoffs
Source:
- operations.handoffs

Frontend may cache:
- last viewed handoff
- draft context
- transient UX bridge

Frontend must not treat cache as durable source.

### 4. Workflows
Source:
- operations.workflow_runs
- operations.queue
- operations.tasks
- operations.events

Frontend may display:
- current run
- step state
- approval gate waiting state
- execution timeline

Frontend must not own final execution authority.

### 5. AI Team
Source:
- operations.team_service_model
- operations.ai_commands
- operations.ai_recommendations
- operations.ai_memory
- operations.handoffs

Frontend may display:
- specialist cards
- suggested prompt
- current ownership
- recommended route

Frontend must not define canonical AI team roles.

## Migration strategy

1. Keep frontend compatibility maps as fallback only.
2. Add backend projection readers.
3. Shadow-compare frontend maps against backend projections.
4. Switch UI source to backend projection.
5. Remove compatibility authority maps after stability.

## Required frontend projection helper

Create a future helper:

public/control-center/runtime/authority-projection.js

Responsibilities:
- read team_service_model safely
- normalize route_permissions for display
- expose active role display
- expose specialist projection list
- expose domain ownership
- expose approval summary
- never mutate backend state
- never enforce durable authority

## Protected rule

No page may invent authority when operations projection exists.

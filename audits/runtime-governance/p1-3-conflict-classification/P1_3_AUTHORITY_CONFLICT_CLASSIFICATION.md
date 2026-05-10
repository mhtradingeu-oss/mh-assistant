# P1.3 — Authority Conflict Classification

## Doctrine
Backend owns authority.
Frontend projects authority.

## Confirmed conflict classes

### 1. AI Team Authority
Frontend currently defines static AI roles and specialist maps.
Backend backbone already defines canonical team roles, service domains, permissions, route permissions, and escalation chains.

Decision:
- Frontend AI team model becomes temporary compatibility/projection.
- Backend team model becomes canonical source.

### 2. Route Access Authority
Frontend currently contains DEFAULT_ROUTE_ROLE_ACCESS and ACTIVE_ROUTE_ROLES.
Backend backbone already exposes route_permissions through team_service_model.

Decision:
- Frontend fallback route access remains temporary only.
- Source switch target is backend route_permissions.

### 3. Workflow / Automation Authority
Frontend currently owns Auto Mode state and approval gates in automation-engine.js.
Backend backbone already owns workflow_runs, approvals, handoffs, queues, governance, and operations state.

Decision:
- Frontend automation stays explicit-user-action only.
- Future source switch moves execution authority to backend runtime.

### 4. Handoff Authority
Frontend shared-context.js caches handoffs locally.
Backend backbone already owns durable handoffs.

Decision:
- Frontend handoff cache remains transient UX bridge only.
- Durable handoffs remain backend authority.

### 5. Governance / Approval Authority
Frontend displays approval requirements and can gate UI actions.
Backend backbone owns governance policy, approval decisions, escalation, and publish guardrails.

Decision:
- Frontend may show warnings and controls.
- Frontend must not become approval source of truth.

## Migration order

1. Backend team projection API confirmation
2. Frontend route access source switch
3. AI team model projection switch
4. Handoff cache downgrade to transient-only
5. Workflow automation runtime source switch
6. Remove compatibility authority maps

## Protected rule
No UX rebuild before authority source switch plan is complete.

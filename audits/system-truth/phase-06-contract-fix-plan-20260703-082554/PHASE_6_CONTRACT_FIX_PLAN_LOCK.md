# PHASE 6 — Contract Fix Plan Lock

## Status
PASS — FIX PLAN READY

## Mode
Plan only.

No production code change.
No backend edit.
No frontend edit.
No route change.
No delete.
No feature implementation.

## Verified

- Phase 6 fix plan evidence was generated.
- Active usage check was captured.
- Canonical replacement options were captured.
- Settings stale hook context was captured.
- Active Governance route context was captured.
- Router context was captured.
- Validation completed with no visible error output.
- Phase 6 created only audit/plan evidence files.

## Key Findings

### business/dashboard.js
No active router/import usage was found for business/dashboard.js.

Classification:
- likely dead legacy/dev file
- no delete authorized yet

### pages/governance/dashboard.js
The active router imports governanceRoute from:
- public/control-center/pages/governance.js

It does not import:
- public/control-center/pages/governance/dashboard.js

Classification:
- likely legacy/dev dashboard file
- no delete authorized yet

### Active Governance Page
The active Governance page already uses canonical api.js helpers:
- createProjectApproval
- decideProjectApproval
- fetchProjectGovernance
- updateProjectGovernancePolicy

This confirms that the active Governance route is not dependent on the stale /api/governance/* endpoints.

### settings.js
settings.js contains stale global hooks:
- window.__AI_CONTROL_CENTER__
- window.__GOVERNANCE_CENTER__

These hooks call missing legacy/dev endpoints:
- /api/ai-control/dashboard
- /api/ai-control/update
- /api/governance/audit
- /api/governance/process
- /api/governance/state

Classification:
- active file with stale global compatibility hooks
- first fix candidate

### ai-backend-connector.js
ai-backend-connector.js defines:
- window.__AI_BACKEND_BRIDGE__

It calls:
- /ai/execute

No backend route exists for /ai/execute.

Classification:
- likely skeleton/runtime bridge
- must verify script loading before patching
- no delete authorized yet

## Fix Strategy Decision

Do not add backend bridge routes first.

Reason:
- legacy endpoints are not canonical
- mutation bridge routes would preserve unsafe/stale API shape
- active Governance already has canonical backend contract

## Recommended First Code Patch

PHASE 7A — Frontend stale endpoint neutralization

Scope:
- frontend only
- likely target: settings.js stale global hooks
- no backend route additions
- no delete
- no CSS changes
- no public alias changes
- no feature expansion

Before patching ai-backend-connector.js, verify whether it is loaded by index.html or imported by runtime.

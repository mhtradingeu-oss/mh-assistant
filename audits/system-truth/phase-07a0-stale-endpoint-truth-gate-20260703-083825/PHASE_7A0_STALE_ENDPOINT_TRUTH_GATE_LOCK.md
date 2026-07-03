# PHASE 7A.0 — Frontend Stale Endpoint Truth Gate Lock

## Status
PASS — PATCH TARGET CONFIRMED

## Mode
Scan only.

No production code change.
No backend edit.
No frontend edit.
No route change.
No delete.
No CSS change.
No feature implementation.

## Verified

- All stale endpoint references were captured.
- Global hook references and consumers were captured.
- Script loading and import usage were checked.
- Settings stale hook region was captured.
- Canonical api.js helper signatures were captured.
- Active route confirmation was captured.
- Validation completed with no visible error output.
- Phase 7A.0 created only audit evidence files.

## Findings

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
- active file
- stale global compatibility hooks
- first code patch target

### Active Governance Route
The active Governance route is:
- public/control-center/pages/governance.js

It uses canonical api.js helpers:
- fetchProjectGovernance
- createProjectApproval
- decideProjectApproval
- updateProjectGovernancePolicy

No patch needed for active Governance route in Phase 7A.

### Dead / Legacy Dashboard Files
The stale endpoint calls in:
- public/control-center/pages/business/dashboard.js
- public/control-center/pages/governance/dashboard.js

appear to be dead/legacy because these files are not imported by router.

No delete authorized.

### ai-backend-connector.js
The stale /ai/execute call exists in:
- public/control-center/runtime/ai-backend-connector.js

But index.html does not load this file directly, and no active import was found.

No patch authorized for ai-backend-connector.js in Phase 7A.

## Patch Decision

Proceed to Phase 7A.1:

Target:
- public/control-center/pages/settings.js only

Action:
- neutralize stale global hooks
- preserve global object names and method names
- return structured safe responses instead of calling missing endpoints

Forbidden:
- no backend route additions
- no public alias changes
- no delete
- no CSS changes
- no feature expansion
- no active governance.js changes

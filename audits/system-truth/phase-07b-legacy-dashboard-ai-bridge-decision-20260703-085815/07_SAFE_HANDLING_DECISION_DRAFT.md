# Phase 7B Safe Handling Decision Draft

## Candidates

### public/control-center/pages/business/dashboard.js
Risk:
- contains stale missing endpoint calls
- appears not routed/imported
- auto-runs initBusinessUI if loaded

Initial classification:
- likely dead legacy/dev dashboard file

Possible handling:
- do not delete first
- either leave with audit note, or neutralize in a future narrow patch if repository policy requires zero stale production references

### public/control-center/pages/governance/dashboard.js
Risk:
- contains stale missing endpoint calls
- appears not routed/imported
- active Governance is public/control-center/pages/governance.js

Initial classification:
- likely dead legacy/dev dashboard file

Possible handling:
- do not delete first
- either leave with audit note, or neutralize in a future narrow patch if repository policy requires zero stale production references

### public/control-center/runtime/ai-backend-connector.js
Risk:
- defines window.__AI_BACKEND_BRIDGE__
- calls missing /ai/execute
- not loaded by index.html in previous scan

Initial classification:
- likely skeleton runtime bridge

Possible handling:
- if not loaded/imported, leave with audit note or neutralize in future patch
- do not add backend /ai/execute route
- canonical AI command route already exists through api.js and backend project-scoped routes

## Recommended policy

No delete.
No backend bridge route.
No broad refactor.

Preferred next code patch only if needed:
- neutralize candidate files so they cannot call missing endpoints even if accidentally loaded
- preserve shape where globals exist
- add clear legacy/skeleton comment

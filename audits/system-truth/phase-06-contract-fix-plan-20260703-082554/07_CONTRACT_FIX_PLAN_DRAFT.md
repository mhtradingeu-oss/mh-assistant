# Phase 6 Contract Fix Plan Draft

## Current Truth

Phase 5C found stale frontend calls to endpoints that do not exist as backend routes:
- /api/governance/state
- /api/governance/audit
- /api/governance/process
- /api/ai-control/dashboard
- /api/ai-control/update
- /ai/execute

Backend governance exists under canonical project-scoped routes:
- /media-manager/project/:project/governance
- /media-manager/project/:project/governance/policy

AI command exists under canonical project-scoped routes:
- /media-manager/project/:project/ai/command
- /media-manager/project/:project/ai/chat
- /media-manager/project/:project/ai/guidance

## Fix Strategy Options

### Option A — Remove or isolate dead legacy files
Use if:
- business/dashboard.js is not imported by router
- governance/dashboard.js is not imported by router
- ai-backend-connector.js is not loaded or is only skeleton

Risk:
- low, if files are truly inactive
- do not delete yet; mark/isolate only after confirmation

### Option B — Replace active stale calls with canonical api.js functions
Use if:
- settings.js hooks are active or exposed globally
- governance page depends on data

Replacement direction:
- governance reads -> fetchProjectGovernance(projectName)
- governance policy reads -> fetchProjectGovernancePolicy(projectName)
- governance policy writes -> updateProjectGovernancePolicy(projectName, payload)
- AI command -> executeProjectAiCommand(projectName, payload)

Risk:
- medium, because it changes runtime behavior
- must be done in a small patch with syntax validation

### Option C — Add backend bridge routes
Use only if:
- old endpoints are required by active UI and cannot be safely replaced yet

Risk:
- high for mutation endpoints
- not recommended as first fix because it preserves legacy API shape

## Recommended First Fix

Do not add backend bridge routes first.

First patch should target frontend only:
1. Confirm inactive/dead files.
2. Remove or neutralize global stale hooks only if unused.
3. Replace active settings/governance usage with canonical api.js helpers if needed.
4. Keep backend untouched.

## Proposed Phase 7A

Phase 7A should be a narrow frontend-only patch:
- no backend route additions
- no public alias changes
- no delete
- no CSS changes
- no feature expansion

Expected target depends on Phase 6 active usage evidence.

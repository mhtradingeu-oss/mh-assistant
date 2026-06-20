# T24 — Integrations Minimal Authority Patch

## Status
Patch applied.

## Target
- `public/control-center/pages/integrations.js`

## Scope
Minimal runtime authority patch for Integrations provider actions.

## Problem
T20-T22B verified that Integrations used backend authority functions for connect, reconnect, disconnect, test, sync, and import.

However, T22B proved that:
- `syncProjectIntegration(...)` was called from `runServerAction(...)`
- `importProjectIntegrationHistory(...)` was called from `runServerAction(...)`
- `testProjectIntegration(...)` was called from `runServerAction(...)`
- `disconnectProjectIntegration(...)` already had explicit confirmation
- `reconnectProjectIntegration(...)` already handled `governance_approval_required`
- `sync` and `import` did not yet have explicit frontend confirmation
- `runServerAction(...)` did not yet handle `governance_approval_required`

## Patch
Added:
- confirmation gate before `sync`
- confirmation gate before `import`
- no confirmation before `test`
- governance approval handling inside `runServerAction(...)`
- project data reload before navigating to Governance
- navigation to Governance when backend returns `governance_approval_required`

## Authority Model After Patch

| Action | Frontend behavior | Backend authority |
|---|---|---|
| test | preflight + backend call | backend-owned |
| sync | confirmation + backend call | backend-owned / governance-aware |
| import | confirmation + backend call | backend-owned / governance-aware |
| disconnect | confirmation + backend call | backend-owned |
| reconnect | backend call + governance handling | backend-owned / governance-aware |

## What Did Not Change
- No CSS changed.
- No backend code changed.
- No data/projects changed.
- No route changed.
- No broad refactor performed.
- No UI redesign performed.

## Result
Integrations provider actions are now safer:
- user confirms backend sync/import jobs before starting them
- backend governance approval responses are surfaced and routed to Governance
- test remains lightweight and preflight-protected

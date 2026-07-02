# T25 — Integrations Runtime Authority Closeout

## Status
Closed.

## Target
- `public/control-center/pages/integrations.js`

## Scope
Closeout for Integrations runtime authority, provider action safety, credential handling, and governance routing after T20-T24.

## Final Decision
Integrations runtime authority is closed for this pass.

No additional runtime/security patch is required at this time.

## Evidence Chain

| Phase | Result |
|---|---|
| T19 | Integrations identified as highest remaining frontend risk candidate |
| T20 | Runtime authority and provider action surface audited |
| T21 | Exact connect/reconnect/disconnect/action paths verified |
| T22B | Sync/import/test backend action block verified |
| T24 | Minimal authority patch applied |

## Verified Authority Model

| Action | Frontend behavior | Backend authority |
|---|---|---|
| connect | validates primary field + backend call | backend-owned |
| reconnect | backend call + governance approval handling | backend-owned / governance-aware |
| disconnect | explicit confirmation + backend call | backend-owned |
| test | preflight + backend test call | backend-owned |
| sync | explicit confirmation + backend sync call | backend-owned / governance-aware |
| import | explicit confirmation + backend import call | backend-owned / governance-aware |

## Patch Summary
T24 added:
- confirmation before sync
- confirmation before import
- governance approval handling inside `runServerAction(...)`
- reload before routing to Governance
- navigation to Governance when backend returns `governance_approval_required`

## Credential Safety
Verified:
- secret fields use password-style input metadata
- existing secret values are not prefilled into frontend fields
- saved credential state is represented as server-side state
- unavailable/unsupported connectors are blocked from backend actions

## What Did Not Change
- No CSS changed.
- No backend code changed.
- No data/projects changed.
- No route changed.
- No broad refactor performed.
- No UI redesign performed.

## Remaining Work
Remaining Integrations work is now UX/product polish, not runtime authority:
- clearer credential setup guidance
- provider readiness matrix
- missing credentials UX
- browser QA for confirm/cancel flows
- polish copy spacing and compacted phrases
- later provider-specific official credential requirements matrix

# PHASE 3AA.3 — Job Monitor Boundary Copy / Deferred Execution Mutation Safety Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AA.2 — Job Monitor Execution / Mutation Safety Audit`
- Previous commit: `8e3c074 Add Job Monitor mutation safety audit`

## Source Truth
Job Monitor is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `jobMonitorRoute`
- id: `job-monitor`

## Purpose
Plan safe copy/label improvements for Job Monitor after mutation boundary audit confirmed:

- Job Monitor itself is read/review/filter/route/AI-guidance.
- Active Job Monitor controls do not mutate job, media, worker, or publishing records.
- Retry/Cancel/Rerun/Delete controls are disabled and deferred.
- Media job create/update mutations exist in Media Studio/API, not active inside Job Monitor.
- Publishing mutations exist in Publishing page/backend, not active inside Job Monitor.
- Worker/scheduler trigger is backend/system-owned and must not be implied by Job Monitor.
- AI actions route/prompt context only.
- Open Job Context is navigation only.

## Copy Risk Areas

### 1. Header and route copy
Risk:
Text like “Track running, completed, and failed execution” may imply execution control.

Recommended direction:
Review running, completed, and failed job state without triggering workers.

### 2. Main View
Risk:
“Execution inventory” may imply execution control.

Recommended direction:
Use “Job state inventory” or “Execution health review”.

### 3. Action Panel
Risk:
“Execution actions” may imply active mutation.

Recommended direction:
Use “Job review actions”.

### 4. Disabled job controls
Risk:
Retry/Cancel/Rerun/Delete are high-risk verbs.

Recommended direction:
- Retry job (disabled: future mutation safety pass).
- Cancel job (disabled: future destructive mutation safety pass).
- Rerun job (disabled: backend worker-control safety pass).
- Delete job (disabled: future destructive mutation safety pass).

### 5. AI Panel
Risk:
AI copy may imply it can execute or mutate jobs.

Recommended direction:
AI receives context/prompt only and cannot retry, cancel, rerun, delete, trigger workers, publish, approve, bypass Governance, or execute backend actions.

### 6. Route metadata
Risk:
Route metadata may imply operational execution authority.

Recommended direction:
Review job health, failures, retry risk, and execution logs across workflows, media, and publishing without silent job mutation.

## Allowed Future Patch Scope
A future patch may change:
- Route metadata copy.
- Section headings.
- Helper copy.
- Panel descriptions.
- Disabled action explanatory copy.
- AI panel safety copy.
- Job route label copy.

A future patch must not change:
- Handlers.
- API calls.
- Backend routes.
- CSS.
- Data files.
- Job mutation logic.
- Media job mutation logic.
- Publishing mutation logic.
- Governance policy behavior.
- Disabled/enabled state.
- Media Studio behavior.
- Publishing page behavior.
- Governance behavior.
- AI behavior.
- Worker/scheduler behavior.

## Required Browser QA After Patch
Check:
- Job Monitor page loads.
- Copy says review/monitor/projection/routing, not silent execution control.
- Refresh remains read-only.
- Retry/Cancel/Rerun/Delete remain disabled.
- AI panel says context/guidance only and no retry/cancel/rerun/delete/worker trigger/publish/approve/backend execution.
- Open Job Context remains routing-only.
- No job mutation occurs.
- No media job mutation occurs.
- No publishing mutation occurs.
- No Governance approval occurs.
- No worker/scheduler trigger occurs.

## Recommended Next Phase
`PHASE 3AA.4 — Job Monitor Copy-Only Deferred Execution Mutation Boundary Safe Patch`

Do not implement until this plan is reviewed and committed.

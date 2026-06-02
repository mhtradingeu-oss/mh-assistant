# PHASE 3AA.2 — Job Monitor / Execution Mutation Action Risk Matrix

## Status
Completed from static evidence review.

No browser mutation was executed in this phase.

## Summary Decision
Job Monitor itself is currently a read/review/filter/route/AI-guidance surface.

Job/media/publishing mutation capability exists elsewhere in the system, but not as active Job Monitor controls.

Confirmed:
- Job Monitor reads live job-monitor payload through `fetchProjectJobMonitor`.
- Job Monitor refresh is read-only.
- Search, focus, kind filter, and selection are local UI/session state.
- Open Job Context is navigation only.
- AI buttons route/prompt context only.
- Retry/Cancel/Rerun/Delete controls are disabled and labelled deferred.
- Backend exposes job-monitor read route.
- Backend exposes media job routes for list/get/create/update.
- Media Studio can create/update media jobs.
- Publishing page owns publishing lifecycle mutations with confirmation prompts.
- Backend/system exposes scheduler worker trigger, which is outside Job Monitor.
- Governance publishing gates affect publishing mutations, not Job Monitor directly.

## Action Matrix

| Action / Flow | Surface | Handler Evidence | Mutation Type | Backend/API? | Ownership Boundary | Confirmation? | Risk | Notes |
|---|---|---|---:|---:|---:|---:|---|---|
| Job Monitor Refresh | Job Monitor | `jobMonitorRefreshBtn`, `jobMonitorRefreshBtnHeader`, `refreshJobMonitor`, `fetchProjectJobMonitor` | Read/fetch only | Yes, GET `/job-monitor` | Job Monitor projection only | No | Low | Refreshes live job monitor projection. No job mutation shown. |
| Job Monitor Search/Filters | Job Monitor | `jobMonitorSearch`, `jobMonitorKind`, focus tabs, session fields | UI/session state only | No | Local page state | No | Low | Filters visible jobs locally and re-renders. |
| Select Job | Job Monitor | `bindOpsSelectionButtons`, `session.selectedKey` | UI/session state only | No | Local page state | No | Low | Selects row/detail view only. |
| Open Job Context | Job Monitor | `renderRouteAction`, `bindRouteButtons`, route target | Navigation only | No | Destination-owned | No | Low | Opens owning context. Destination surface owns any future execution or mutation. |
| Open AI Prompt | Job Monitor | `buildOpsAssistantPrompts("job-monitor")`, `bindOpsAssistantButtons` | Prompt/context only | No backend mutation | AI guidance only | No | Low-medium | AI guidance only. Must not be framed as worker/job execution. |
| Retry job disabled control | Job Monitor | Disabled button `Retry job (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned by Job Monitor | Not applicable | Safe-disabled | Retry would become high-risk if enabled because it may alter job lifecycle. |
| Cancel job disabled control | Job Monitor | Disabled button `Cancel job (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned by Job Monitor | Not applicable | Safe-disabled | Cancel would be high-risk/destructive if enabled. |
| Rerun job disabled control | Job Monitor | Disabled button `Rerun job (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned by Job Monitor | Not applicable | Safe-disabled | Rerun could trigger worker/provider execution if enabled. |
| Delete job disabled control | Job Monitor | Disabled button `Delete job (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not currently owned by Job Monitor | Not applicable | Safe-disabled | Destructive action. Must remain disabled until explicit mutation design. |
| Backend Job Monitor Read Route | Backend | GET `/media-manager/project/:project/job-monitor` and public equivalent | Read/projection | Yes | Backend projection payload | No | Low | Reads job monitor payload from operations snapshot. |
| Media Job Create | Media Studio/API | `createMediaJob`, POST `/media-jobs` | Durable media job mutation | Yes | Media Studio-owned | Needs future confirmation/safety review depending flow | High | Not Job Monitor-owned. Can create durable media job records. |
| Media Job Update | Media Studio/API | `updateMediaJob`, PATCH `/media-jobs/:mediaJobId` | Durable media job mutation | Yes | Media Studio-owned | Needs future confirmation/safety review depending flow | High | Not Job Monitor-owned. Can update durable media job records/status. |
| Publishing Job Mutations | Publishing/API | `reschedulePublishingItem`, `approvePublishingItem`, `publishPublishingItem`, `failPublishingItem` | Durable publishing lifecycle mutation | Yes | Publishing-owned and Governance-gated | Yes | High/Critical | Not Job Monitor-owned. Already audited in Publishing and Queue Center waves. |
| Worker/Scheduler Trigger | Backend/System | POST `/run_scheduler_worker_once` | Worker execution / job lifecycle mutation | Yes | Backend/system-owned | Not Job Monitor UI | Critical | Outside Job Monitor. Can mark jobs running/completed/retryable/failed. Must not be triggered silently from Job Monitor. |
| Governance Publishing Gates | Governance/Backend | `approval_before_publish`, `freeze_publishing` | Policy gate | Yes | Governance-owned/backend-enforced | Confirmation on policy save | Critical control | Affects publishing mutations, not Job Monitor projection directly. |

## Key Findings

### 1. Job Monitor active surface is safe-read/review
Job Monitor does not actively mutate job records. It refreshes, filters, selects, routes, and sends AI context only.

### 2. Job mutation controls are intentionally disabled
Retry, cancel, rerun, and delete are visible but disabled and deferred. They must not be enabled without a dedicated mutation design, confirmation model, backend authority review, and test dataset.

### 3. Media job mutations are real but outside Job Monitor
Media Studio/API can create and update media jobs. Job Monitor may display related execution state but does not own those mutations.

### 4. Publishing mutations are real but outside Job Monitor
Publishing page owns publishing lifecycle mutations and confirmation prompts. Job Monitor must not imply it can publish, retry publishing jobs, or bypass Publishing/Governance.

### 5. Worker/scheduler execution is critical and outside Job Monitor
Backend/system worker routes can alter job lifecycle. Job Monitor must remain a monitor/projection surface unless a future dedicated worker-control safety design is approved.

### 6. Job Monitor copy needs boundary clarity
Terms like “Track running... execution,” “Execution inventory,” “Execution actions,” “Retry job,” “Cancel job,” “Rerun job,” and “Delete job” may imply execution authority. Copy should clarify review/monitoring/routing only.

## Required Decision
Proceed to:
`PHASE 3AA.3 — Job Monitor Boundary Copy / Deferred Execution Mutation Safety Plan`

Reason:
Job Monitor is active-safe, but its copy should be tightened before closeout to clarify:
- Job Monitor reviews execution health and job state.
- Refresh is read-only.
- Open Job Context is routing only.
- AI is guidance/context only.
- Retry/Cancel/Rerun/Delete are disabled future mutation controls.
- Media job mutations remain Media Studio/API-owned.
- Publishing mutations remain Publishing-owned and Governance-gated.
- Worker/scheduler execution remains backend/system-owned.

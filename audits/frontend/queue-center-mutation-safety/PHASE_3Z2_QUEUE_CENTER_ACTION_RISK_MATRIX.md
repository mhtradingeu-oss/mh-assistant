# PHASE 3Z.2 — Queue Center / Publishing Mutation Action Risk Matrix

## Status
Completed from static evidence review.

No browser mutation was executed in this phase.

## Summary Decision
Queue Center itself is currently a read/review/filter/route/AI-guidance surface.

Queue/publishing mutation capability exists in the system, but not as active Queue Center controls.

Confirmed:
- Queue Center reads live queue-center payload through `fetchProjectQueueCenter`.
- Queue Center refresh is read-only.
- Search, focus, status filter, and selection are local UI/session state.
- Open Owner Page is navigation only.
- AI buttons route/prompt context only.
- Retry/Approve/Publish/Remove controls are disabled and labelled deferred.
- Backend exposes queue-center read route.
- Backend exposes publishing mutation routes for schedule, reschedule, ready/approve, publish, and fail.
- Backend publishing mutations are guarded by `assertPublishingMutationAllowed`.
- `freeze_publishing` blocks schedule/reschedule/ready/publish when enabled.
- `approval_before_publish` blocks ready/publish unless the publishing job has an approved or overridden Governance decision.
- Publishing page uses explicit confirmation prompts before backend publishing mutations.

## Action Matrix

| Action / Flow | Surface | Handler Evidence | Mutation Type | Backend/API? | Governance Gate? | Confirmation? | Risk | Notes |
|---|---|---|---:|---:|---:|---:|---|---|
| Queue Center Refresh | Queue Center | `queueCenterRefreshBtn`, `queueCenterRefreshBtnHeader`, `refreshQueueCenter`, `fetchProjectQueueCenter` | Read/fetch only | Yes, GET `/queue-center` | No | No | Low | Refreshes live queue-center projection. No queue or publishing mutation shown. |
| Queue Center Search/Filters | Queue Center | `queueCenterSearch`, `queueCenterStatus`, focus tabs, session fields | UI/session state only | No | No | No | Low | Filters visible queue items locally and re-renders. |
| Select Queue Item | Queue Center | `bindOpsSelectionButtons`, `session.selectedKey` | UI/session state only | No | No | No | Low | Selects row/detail view only. |
| Open Owner Page | Queue Center | `renderRouteAction`, `bindRouteButtons`, route target | Navigation only | No | Destination-owned | No | Low | Opens owning page. Destination surface owns any execution or mutation authority. |
| Open AI Prompt | Queue Center | `buildOpsAssistantPrompts("queue-center")`, `bindOpsAssistantButtons` | Prompt/context only | No backend mutation | No | No | Low-medium | AI guidance only. Must not be framed as approval/publish execution. |
| Retry item disabled control | Queue Center | Disabled button `Retry item (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | Not applicable | Safe-disabled | Retry could become high-risk if enabled because it may alter publishing/job lifecycle. |
| Approve item disabled control | Queue Center | Disabled button `Approve item (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | Not applicable | Safe-disabled | Approval must remain Governance/Publishing-owned. |
| Publish item disabled control | Queue Center | Disabled button `Publish item (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | Not applicable | Safe-disabled | Publishing must remain Publishing-owned and Governance-gated. |
| Remove item disabled control | Queue Center | Disabled button `Remove item (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | Not applicable | Safe-disabled | Potential destructive action. Must remain disabled until explicit mutation design. |
| Backend Queue Center Read Route | Backend | GET `/media-manager/project/:project/queue-center` and public equivalent | Read/projection | Yes | No | No | Low | Reads queue center payload from operations snapshot. |
| Publishing Schedule | Publishing | `publishingScheduleBtn`, `reschedulePublishingItem`, schedule POST route | Durable schedule mutation | Yes | `freeze_publishing` applies | Yes | High | Creates/updates backend publishing schedule. Publishing page uses confirmation. |
| Publishing Reschedule | Publishing | `reschedulePublishingItem`, POST `/publishing/:jobId/reschedule` | Durable schedule mutation | Yes | `freeze_publishing` applies | Yes | High | Updates backend publishing lifecycle/schedule. |
| Publishing Ready/Approve | Publishing | `publishingApproveBtn`, `approvePublishingItem`, POST `/publishing/:jobId/ready` | Durable status mutation to ready | Yes | `freeze_publishing` + `approval_before_publish` | Yes | Critical | Requires approved/overridden Governance decision when approval_before_publish is active. |
| Publishing Publish | Publishing | `data-publishing-action="publish"`, `publishPublishingItem`, POST `/publishing/:jobId/publish` | Durable publish/manual completion record | Yes | `freeze_publishing` + `approval_before_publish` | Yes, final confirmation | Critical | Records manual publish completion. Does not prove external provider publish by itself. |
| Publishing Fail | Publishing | `publishingFailBtn`, `failPublishingItem`, POST `/publishing/:jobId/fail` | Durable failure status/result mutation | Yes | Not approval-sensitive in guard unless status/rules require | Yes | High | Creates failure record and stops item lifecycle. |
| Governance approval_before_publish | Governance/Backend | Governance policy toggle and backend `assertPublishingMutationAllowed` | Policy gate | Yes | It is the gate | Confirmation on policy save | Critical control | Blocks ready/publish unless latest approval status is approved or overridden. |
| Governance freeze_publishing | Governance/Backend | Governance policy toggle and backend `assertPublishingMutationAllowed` | Policy gate | Yes | It is the gate | Confirmation on policy save | Critical control | Blocks schedule/reschedule/ready/publish when active. |

## Key Findings

### 1. Queue Center active surface is safe-read/review
Queue Center does not actively mutate queue items. It refreshes, filters, selects, routes, and sends AI context only.

### 2. Queue mutation controls are intentionally disabled
Retry, approve, publish, and remove are visible but disabled and deferred. They must not be enabled without a dedicated mutation design, confirmation model, and backend authority review.

### 3. Publishing mutations are real and high-risk
Publishing page owns backend publishing mutations:
- schedule
- reschedule
- ready/approve
- publish/manual completion
- fail

These are not Queue Center-owned today.

### 4. Backend Governance gates are real
Backend `assertPublishingMutationAllowed` enforces:
- `freeze_publishing`
- `approval_before_publish`

This is especially important for ready/publish actions.

### 5. Queue Center copy still needs boundary clarity
Terms like “Control queues,” “Queue actions,” “Approve item,” and “Publish item” may imply authority. Queue Center should clarify that it reviews queue pressure and routes items to owning workspaces, while publishing/governance mutations remain destination-owned.

## Required Decision
Proceed to:
`PHASE 3Z.3 — Queue Center Boundary Copy / Deferred Publishing Mutation Safety Plan`

Reason:
Queue Center is active-safe, but its copy should be tightened before closeout to clarify:
- Queue Center reviews queue pressure and queue items.
- Refresh is read-only.
- Open Owner Page is routing only.
- AI is guidance/context only.
- Retry/Approve/Publish/Remove are disabled future mutation controls.
- Publishing execution and Governance approval remain destination-owned and backend-gated.
- Backend publishing mutation routes exist but are not triggered from Queue Center.

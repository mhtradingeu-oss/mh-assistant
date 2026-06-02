# PHASE 3Y.2 — Task Center / Task Mutation Action Risk Matrix

## Status
Completed from static evidence review.

No browser mutation was executed in this phase.

## Summary Decision
Task Center itself is currently a read/review/copy/filter/handoff surface.

Task mutation capability exists in the system, but not as active Task Center controls.

Confirmed:
- Task Center reads live task-center payload through `fetchProjectTaskCenter`.
- Task Center refresh is read-only.
- Search, filters, and selection are local UI/session state.
- Copy actions write to clipboard only.
- Incoming handoff is explicitly review-only.
- Task mutation controls are disabled and labelled deferred.
- Workflows sends review-only task handoffs to Task Center.
- AI Command prepares task drafts/previews and routes task-shaped output to Task Center, but evidence says no backend task creation.
- Media Studio can create a durable backend task through `createProjectTask`.
- Backend supports task listing, task creation, task center read, and task detail read routes.

## Action Matrix

| Action / Flow | Surface | Handler Evidence | Mutation Type | Backend/API? | Confirmation? | Handoff Source? | Risk | Notes |
|---|---|---|---:|---:|---:|---:|---|---|
| Task Center Refresh | Task Center | `taskCenterRefreshBtn`, `taskCenterRefreshBtnRail`, `refreshTaskCenter`, `fetchProjectTaskCenter` | Read/fetch only | Yes, GET `/task-center` | No | No | Low | Refreshes live Task Center data and updates local state projection. No task mutation shown. |
| Task Center Search/Filters | Task Center | `taskCenterSearch`, `taskCenterPriority`, `taskCenterOwner`, `taskCenterSource`, focus buttons | UI/session state only | No | No | No | Low | Filters visible task list locally and re-renders. |
| Select Task | Task Center | `bindOpsSelectionButtons`, `session.selectedKey` | UI/session state only | No | No | No | Low | Selects row/detail view only. |
| Copy Selected Task Summary | Task Center | `taskCenterCopySummaryBtn`, clipboard write | Clipboard only | No | No | No | Low | Copies selected task text. Non-destructive. |
| Copy Incoming Handoff Summary | Task Center | `taskCenterCopyHandoffBtn`, clipboard write | Clipboard only | No | No | Yes | Low | Copies incoming handoff summary. Does not consume or create durable task. |
| Open AI Workspace / Prompt | Task Center | `data-ops-ai-open`, `data-ops-ai-prompt`, `bindOpsAssistantButtons` | Route/prompt only | No backend task mutation | No | Possible context only | Low-medium | Opens AI Command or places prompt. AI does not create task from this evidence. |
| Open Linked Work route | Task Center | `renderRouteAction`, `bindRouteButtons`, `context.navigateTo(route)` | Navigation only | No | No | No | Low | Opens linked route. Destination owns any action authority. |
| Update Status disabled control | Task Center | Disabled button `Update status (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | No | Safe-disabled | Correctly deferred. Do not enable before behavior-approved mutation audit. |
| Reassign Owner disabled control | Task Center | Disabled button `Reassign owner (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | No | Safe-disabled | Correctly deferred. |
| Change Priority disabled control | Task Center | Disabled button `Change priority (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | No | Safe-disabled | Correctly deferred. |
| Update Due Date disabled control | Task Center | Disabled button `Update due date (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | No | Safe-disabled | Correctly deferred. |
| Delete Task disabled control | Task Center | Disabled button `Delete task (deferred: mutation safety pass)` | None; disabled | No active handler shown | Not applicable | No | Safe-disabled | Correctly deferred and destructive. Must remain gated. |
| Media Studio Create Task | Media Studio | `mediaCreateTaskBtn`, `createProjectTask(backendProjectName, payload)` | Durable backend task creation | Yes, POST `/tasks` | No explicit browser confirmation shown in evidence | Linked to media job | High | Real task mutation. Requires controlled QA and copy/confirmation review in Media Studio task flow. |
| Content Studio Task Link/Create | Content Studio | Imports `createProjectTask`, `listProjectTasks`; evidence shows `listProjectTasks` and linked task data | Task read/link context; create import exists but handler not proven in excerpt | List: Yes GET `/tasks`; create not proven active here | Not proven | Content records/tasks | Medium | Needs deeper Content Studio-specific audit before claiming no create path. |
| Workflows Task Review Handoff | Workflows | `workflowSaveTaskBtn`, `wfLightTasksBtn`, `setSharedHandoff`, `navigateTo("task-center")` | Shared review-only handoff | No durable task API shown | No | Yes | Medium-low | Review-only task handoff. Does not create durable task from evidence. |
| AI Command Task Draft/Route | AI Command | Task preview/routing markers; safety text says no backend task creation | Task draft/preview/route only | No backend task creation shown | No | Possible AI context | Medium-low | Routes task-shaped output to Task Center; evidence says review before creating durable tasks. |
| Backend Create Task Route | Backend | `handleCreateTask`, POST `/media-manager/project/:project/tasks` | Durable backend task creation | Yes | Backend route itself has no user-facing confirmation | Any caller | High | Real mutation endpoint. Frontend callers must provide explicit user intent/confirmation where appropriate. |
| Backend Task Center Read Route | Backend | `handleGetTaskCenter`, GET `/media-manager/project/:project/task-center` | Read/projection | Yes | No | No | Low | Builds Task Center payload from operations snapshot. |

## Key Findings

### 1. Task Center active surface is safe-read/review
Task Center currently does not actively mutate task records. Its live data refresh is a GET route, and local controls are UI/session or clipboard only.

### 2. Mutation controls are intentionally disabled
The controls for update status, reassign owner, change priority, update due date, and delete task are disabled and labelled as deferred pending mutation safety pass.

### 3. Incoming task handoff is review-only
Incoming handoff copy explicitly states that no durable task is created automatically. This boundary should be preserved.

### 4. Real task creation exists outside Task Center
Media Studio can create a durable backend task using `createProjectTask`. This is the primary confirmed frontend task mutation path from the evidence.

### 5. Backend task creation route exists
The backend exposes POST `/media-manager/project/:project/tasks` and public equivalent. This is a real durable mutation path.

### 6. Content Studio task creation needs deeper audit
Content Studio imports `createProjectTask`, but evidence preview only confirms task listing and linked task context. A focused Content Studio task mutation audit may be needed later.

### 7. Workflows and AI Command are review/draft oriented for tasks
Workflows creates review-only task handoffs. AI Command creates task drafts/previews and routes to Task Center, with safety copy saying no backend task creation.

## Required Decision
Proceed to:
`PHASE 3Y.3 — Task Center Boundary Copy / Deferred Mutation Safety Plan`

Reason:
Task Center is already mostly safe, but copy should be reviewed to ensure operators clearly understand:
- Task Center reviews durable tasks but does not mutate them silently.
- Incoming handoffs are review-only and do not create tasks automatically.
- Disabled mutation actions are intentionally deferred.
- AI prompts are guidance-only.
- Linked route actions route to owning workspaces.
- Real task creation exists in other surfaces such as Media Studio and must remain explicit.

Likely future safe patch areas:
- Clarify “durable operational tasks” as “review durable operational task records.”
- Clarify “Execution backlog” as “Operational task backlog.”
- Clarify AI panel as guidance-only and no task creation.
- Clarify disabled mutation actions as future controlled workflow.
- Preserve all handlers and backend behavior unless separately approved.

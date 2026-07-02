# PHASE 3X.2 — Workflows Action Risk Matrix

## Status
Completed from static evidence review.

No browser mutation was executed in this phase.

## Summary Decision
Workflows is an execution-adjacent operating surface.

It contains:
- local draft actions
- local/session workflow preparation
- backend workflow run actions
- AI workflow run actions
- shared handoff creation
- optional backend handoff persistence
- Task Center handoff routing
- external event bridge execution path
- automation simulation
- auto-mode controls
- auto approve / auto skip gate controls

Important distinction:
The currently active route surface includes safer copy and visible statements that older runtime execution helpers are preserved in file scope and not activated by the active render surface. However, the preserved helpers still exist and must remain safety-audited because some event paths and handlers can call backend run APIs or automation engine functions.

## Action Matrix

| Action / Button / Trigger | Active Surface? | Handler Evidence | Mutation Type | Backend/API? | Automation Engine? | Confirmation? | Affects Governance/Publishing? | Risk | Notes |
|---|---:|---|---:|---:|---:|---:|---:|---|---|
| Prepare Workflow Package | Preserved execution loop / possibly legacy active helper | `workflowRunBtn`, `workflowRunBtnMain`, `runWorkflow`, `confirmWorkflowBackendRun` | Backend workflow run + local run state | Yes, `runProjectAiWorkflow` or `runProjectWorkflow` | No | Yes | Indirect; may prepare publishing package workflow | High | Confirmation states it records backend workflow output and does not publish/send/CRM. Still backend-mutating. |
| Catalog Prepare | Preserved execution loop | `data-wf-catalog-run` → `runWorkflow` | Backend workflow run + local run state | Yes | No | Yes via `runWorkflow` | Indirect depending workflow route hint | High | Same backend run risk as Prepare Workflow Package. |
| Save Draft | Preserved execution loop / local | `data-wf-catalog-save`, `persistWorkflowDraft`, `saveLocalDraft` | localStorage/local draft | No backend API | No | No | No | Low | Saves local workflow draft only. |
| Load AI Command State | Preserved execution loop | `wfexecLoadAiStateBtn`, `getSharedAiDraft`, `setSharedHandoff`, `persistWorkflowDraft` | Local/session/draft/handoff seed | No durable backend proven | No | No | No direct | Medium-low | Loads AI state into workflow inputs or creates local seed. |
| Send/Refine in AI Command | Preserved execution loop and active render | `pushWorkflowToAiCommand`, `setSharedAiDraft`, `setSharedHandoff`, optional `createProjectHandoff`, `navigateTo("ai-command")` | AI handoff / possible backend handoff persistence | Yes only if `createProjectHandoff` is called | No | No | No direct; AI review only | Medium | Sends context to AI Command. It does not execute workflow by itself. Persistent handoff may write backend handoff record. |
| Prepare Task Handoff | Preserved execution loop | `workflowSaveTaskBtn`, `setSharedHandoff`, `navigateTo("task-center")` | Shared handoff to Task Center | No durable task creation shown in this handler | No | No | No direct | Medium | Review-only task handoff. Does not create durable task in shown handler. |
| Recommend Workflow | Preserved execution loop | `workflowRecommendBtn`, `setSharedAiDraft`, `setSharedHandoff`, `navigateTo("ai-command")` | AI prompt/handoff | No backend API shown | No | No | No direct | Low-medium | Recommendation is sent to AI Command for review. |
| Build Custom Workflow | Preserved execution loop | `workflowBuildCustomBtn`, `setSharedAiDraft`, `setSharedHandoff`, `navigateTo("ai-command")` | AI prompt/handoff | No backend API shown | No | No | No direct | Low-medium | Builds AI prompt only. |
| Full Automation Simulation | Preserved execution loop | `workflowRunFullAutomationBtn`, `runAutomationPlan` | Automation simulation / may prepare handoffs | Possible via automation steps with `createProjectHandoff` context | Yes | Yes | Possible if handoff target is Publishing | High | Confirmation exists. Despite “simulation”, automation engine can navigate/create handoffs/drafts. |
| Step Automation Simulation | Preserved execution loop | `workflowRunStepAutomationBtn`, `runAutomationPlan(singleStep)` | Automation simulation / may prepare handoff | Possible via automation steps | Yes | Yes | Possible | High | Safer than full plan but still can run one automation step. |
| Auto Start | Preserved execution loop | `workflowAutoStartBtn`, `createAutoModeController`, `startAutoMode` | Auto-mode runtime/session state; can run safe steps until approval | Possible depending step type | Yes | Not clearly confirmed in shown evidence | Possible | Critical | Starts Auto Mode. Needs deeper behavior QA and possibly stronger copy before enabled broadly. |
| Auto Pause / Resume / Stop | Preserved execution loop | `pauseAutoMode`, `resumeAutoMode`, `stopAutoMode` | Auto-mode state mutation | No direct backend mutation shown except resume context may continue steps | Yes | No | Possible on resume | Medium-high | Stop/pause are safer; resume can continue automation. |
| Auto Approve Gate | Preserved execution loop | `workflowAutoApproveBtn`, `approveCurrentGate` | Auto-mode gate decision | Possible depending next step | Yes | No explicit confirmation shown | Possible | Critical | Approval wording is sensitive. Must not imply Governance approval. Needs separate audit/copy before trusted use. |
| Auto Skip Gate | Preserved execution loop | `workflowAutoSkipBtn`, `skipCurrentStep` | Auto-mode gate skip | Possible depending next step | Yes | No explicit confirmation shown | Possible | Critical | Skip can bypass an automation gate. Must remain guarded and not confused with Governance bypass. |
| External Event `mh:submit-workflow` | Event bridge | `window.addEventListener("mh:submit-workflow")`, `runProjectAiWorkflow` or `runProjectWorkflow` | Backend workflow run | Yes | No | No visible browser confirmation in event path | Indirect | Critical | External pages/events may trigger backend workflow run. Needs source audit and gate decision. |
| Active render Prepare Current Workflow | Active render surface | `prepareCurrentWorkflow` in active render surface; active UI states “prepare package” | Local prepared package/session prompt | No backend run proven in active render snippet | No | No | Route hints only | Medium-low | Active render appears safer than preserved execution loop. Need deeper line-level proof before patching. |
| Active render Open AI Workspace | Active render surface | `openAiWorkspace`, `setSharedAiDraft`/handoff style routing implied | AI handoff/navigation | No backend mutation proven in active snippet | No | No | No direct | Low-medium | AI review only. |
| Active render Open Task Center / destination routes | Active render surface | `data-wf-open="task-center"`, destination cards | Navigation / route guidance | No backend mutation proven | No | No | No direct | Low | Opens destination route. Destination owns execution authority. |
| Technical Details toggle | Active render surface | `data-wf-tech-focus` / details UI | UI-only | No | No | No | No | Low | Display/focus only. |

## Key Findings

### 1. Backend workflow run routes exist
Confirmed API/backend evidence includes:
- `runProjectWorkflow`
- `runProjectAiWorkflow`
- `/workflows/:workflowId/run`
- `/ai/workflows/:workflowId/run`

These record or execute workflow outputs and are backend mutations.

### 2. External event bridge is critical
`mh:submit-workflow` can trigger backend workflow execution through an event listener path. This is high-risk because the trigger source may be outside the visible Workflows page.

### 3. Active render appears safer than preserved helpers
The active surface includes a technical note saying older runtime execution helpers are preserved in file scope and not activated by the active render surface. This is reassuring, but not enough to skip safety controls because the helpers still exist and some bridge paths may still be registered.

### 4. Automation engine has safety filters but still performs actions
Automation engine safe types include navigation, draft creation, local draft saving, handoff creation, prompt generation, workflow preparation, and publishing draft preparation. It blocks explicit live publish/destructive/external-send/spend/credential actions, but safe actions can still create handoffs or navigate.

### 5. Auto approve / auto skip remain critical
Even if they are automation-engine gates, their labels and function names imply approval/skip behavior. They must not be confused with Governance approval or policy bypass.

### 6. Task Center handoff is review-only in shown handler
The handler creates shared handoff context and navigates to Task Center. No durable task creation is shown in this handler.

### 7. Publishing boundary remains sensitive
Workflows can prepare a publishing package and route to Publishing, but it must not imply external publish or Governance bypass.

## Required Decision
Proceed to:
`PHASE 3X.3 — Workflows Boundary Copy / Automation Safety Plan`

Reason:
Before Browser QA or patching, Workflows language should clearly distinguish:
- active safe preparation surface
- backend workflow run helpers
- local drafts
- AI review handoffs
- Task Center review handoffs
- automation simulation
- auto-mode gates
- publishing package preparation
- Governance-gated execution boundaries

Likely future safe patch areas:
- Rename risky “run/execution” wording to “prepare package” where appropriate.
- Clarify backend workflow run confirmation copy if preserved helper remains reachable.
- Clarify automation simulation can prepare handoffs/drafts.
- Clarify Auto Approve / Auto Skip as automation gate actions, not Governance approval.
- Clarify Task Center handoff as review-only.
- Clarify Publishing package as handoff/preparation, not external publishing.
- Preserve handlers and backend behavior unless separately approved.

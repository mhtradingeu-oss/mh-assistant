# Workflows Behavior Contract

## Status and Scope
- Branch: architecture/frontend-consolidation-v1
- Baseline commits: fdf81ef, c4dee6f, 736b0e9
- Mode: audit and contract only
- No production code changes in this artifact

## Contract Doctrine
- Backend owns operational authority and durable truth.
- Frontend projects backend authority and issues requests.
- Auto Mode must start only from explicit user action.
- Workflow execution must not start from route render or mount.
- Auto Mode gate approval is runtime flow control, not backend governance approval.
- No refactor before contract and shadow-compare acceptance.

## A) Active Mounted Light Route Contract

### Mounted route surface (currently active)
- Exported route template: `workflowsRoute.template` mounts only `#workflowsRoot` inside the workflows page shell.
- Exported route render: `workflowsRoute.render(...)` writes a light UI directly to `#workflowsRoot`.
- Mounted root element: `workflowsRoot`.

### Active controls mounted by current route
- `wfLightPrepareBtn` (Prepare Workflow)
- `wfLightAiBtn` (Send to AI Workspace)
- `wfLightCampaignBtn` (Open Campaign Studio)
- `wfLightTasksBtn` (Open Task Center)
- Inputs/select: `wfLightWorkflowType`, `wfLightProject`, `wfLightCampaign`, `wfLightGoal`

### Active handlers and behavior
1. Prepare Workflow
- Trigger: click `wfLightPrepareBtn`
- Inputs: selected workflow, project, campaign, goal
- Behavior: builds prompt text, writes prompt to global `quickCommandInput` if present, updates `wfLightStatus`, emits user message
- Shared-context writes: none
- Backend/API calls: none

2. Send to AI Workspace
- Trigger: click `wfLightAiBtn`
- Inputs: selected workflow and goal (project/campaign pulled from current state)
- Behavior: builds AI package prompt, writes shared AI draft, seeds global input if present, navigates to `ai-command`
- Shared-context writes: `setSharedAiDraft(projectName, ...)`
- Backend/API calls: none in active light route

3. Open Campaign Studio
- Trigger: click `wfLightCampaignBtn`
- Behavior: `navigateTo("campaign-studio")`
- Shared-context writes: none
- Backend/API calls: none

4. Open Task Center
- Trigger: click `wfLightTasksBtn`
- Behavior: `navigateTo("task-center")`
- Shared-context writes: none
- Backend/API calls: none

### Active shared-context writes in mounted route
- Only `setSharedAiDraft(...)` from Send to AI Workspace
- No mounted `setSharedHandoff(...)` call path in current light route

### Not mounted in active route
- Auto Mode controls are not mounted.
- Durable workflow-run controls are not mounted.
- Legacy execution-loop render/bind/bridge functions are not invoked by current route render.

## B) Legacy/Dormant Heavy Runtime Loop Contract

### Legacy functions present in file
- `renderWorkflowExecutionLoop(...)`: defined, not called by active route
- `bindWorkflowExecutionLoop(...)`: defined, not called by active route
- `registerWorkflowBridge(...)`: defined, not called by active route
- Bridge listener: window `mh:submit-workflow` listener is defined under `registerWorkflowBridge`, dormant until function is called

### Legacy controls defined (dormant unless legacy loop is mounted)
- Manual run: `workflowRunBtn`, `workflowRunBtnMain`
- Automation plan: `workflowRunFullAutomationBtn`, `workflowRunStepAutomationBtn`
- Auto Mode: `workflowAutoStartBtn`, `workflowAutoPauseBtn`, `workflowAutoResumeBtn`, `workflowAutoStopBtn`, `workflowAutoApproveBtn`, `workflowAutoSkipBtn`
- AI push/custom/recommend/task controls: `workflowPushAiBtn`, `workflowPushAiBtnSecondary`, `workflowSaveTaskBtn`, `workflowBuildCustomBtn`, `workflowRecommendBtn`

### Legacy runtime handlers defined
- Manual run workflow: `runWorkflow(...)` inside bind loop, calls `runProjectAiWorkflow || runProjectWorkflow`
- AI-triggered auto-run: bridge event flow with `meta.autoRun`
- Full automation: `runAutomationPlan(plan, ...)`
- Single-step automation: `runAutomationPlan([nextStep], ...)`
- Auto Mode lifecycle: `startAutoMode`, `pauseAutoMode`, `resumeAutoMode`, `stopAutoMode`
- Auto Mode gate controls: `approveCurrentGate`, `skipCurrentStep`
- Durable handoff path: optional `createProjectHandoff(...)` in `pushWorkflowToAiCommand(...)`
- Structured workflow task save: `createProjectTask(...)`

### Dormancy statement
- These behaviors are defined in the module but are currently dormant because active mounted route render does not call legacy renderer/binder/bridge.

## C) Action-by-Action Behavior Contract

## Active light route actions

### Action: Prepare workflow
- State: active
- Trigger: `wfLightPrepareBtn` click
- Inputs: workflow type, project, campaign, goal
- Preconditions: workflows route mounted
- Local state changes: updates `quickCommandInput` value, updates `wfLightStatus`
- Shared-context writes: none
- Backend/API calls: none
- Durable outputs: none
- User-visible output: status text and "Workflow prepared." message
- Error behavior: no explicit error path; silent if global input missing
- Reload behavior: no reload
- Risk level: low
- Contract classification: must preserve

### Action: Send to AI workspace
- State: active
- Trigger: `wfLightAiBtn` click
- Inputs: workflow type, goal, current project/campaign
- Preconditions: workflows route mounted
- Local state changes: optional `quickCommandInput` seed
- Shared-context writes: `setSharedAiDraft`
- Backend/API calls: none
- Durable outputs: none
- User-visible output: route navigation to `ai-command`
- Error behavior: no explicit error handling in mounted path
- Reload behavior: no reload
- Risk level: low to medium (cross-route context coupling)
- Contract classification: must preserve

### Action: Open Campaign Studio
- State: active
- Trigger: `wfLightCampaignBtn` click
- Inputs: none
- Preconditions: workflows route mounted
- Local state changes: none
- Shared-context writes: none
- Backend/API calls: none
- Durable outputs: none
- User-visible output: route navigation
- Error behavior: none
- Reload behavior: no reload
- Risk level: low
- Contract classification: may retire later if route map changes

### Action: Open Task Center
- State: active
- Trigger: `wfLightTasksBtn` click
- Inputs: none
- Preconditions: workflows route mounted
- Local state changes: none
- Shared-context writes: none
- Backend/API calls: none
- Durable outputs: none
- User-visible output: route navigation
- Error behavior: none
- Reload behavior: no reload
- Risk level: low
- Contract classification: may retire later if route map changes

## Legacy runtime actions (currently dormant)

### Action: Manual run workflow
- State: dormant
- Trigger: `workflowRunBtn` or `workflowRunBtnMain` click
- Inputs: selected workflow and validated builder inputs
- Preconditions: project selected; required fields present; legacy loop mounted and bound
- Local state changes: run status/history/output in session map; validation box; local workflows handoff cache write
- Shared-context writes: `setSharedHandoff(project, "workflows", ... )`
- Backend/API calls: `runProjectAiWorkflow || runProjectWorkflow`; `reloadProjectData`
- Durable outputs: backend workflow run record
- User-visible output: success/failure message, updated run panel
- Error behavior: sets failed output summary and error message
- Reload behavior: reloads project data on success
- Risk level: high
- Contract classification: must preserve semantics until explicit retire decision

### Action: AI-triggered auto-run from bridge
- State: dormant
- Trigger: window event `mh:submit-workflow` with `meta.autoRun=true`
- Inputs: event detail message/meta + selected project/session
- Preconditions: `registerWorkflowBridge(...)` called; project selected
- Local state changes: run state transitions and history
- Shared-context writes: none required in bridge path
- Backend/API calls: `runProjectAiWorkflow || runProjectWorkflow`; `reloadProjectData`
- Durable outputs: backend workflow run record
- User-visible output: success/failure message
- Error behavior: marks run failed and surfaces error message
- Reload behavior: reload on success
- Risk level: high
- Contract classification: must preserve until explicit lifecycle decision

### Action: Run full automation plan
- State: dormant
- Trigger: `workflowRunFullAutomationBtn` click + confirm dialog
- Inputs: automation plan from `buildAutomationPlan(getState())`
- Preconditions: non-empty plan; user confirms; legacy loop mounted
- Local state changes: `workflowAutomationState` progress/result/plan/results/cursor
- Shared-context writes: possible via step execution helpers
- Backend/API calls: indirect via plan steps (may call handoff creation through context)
- Durable outputs: mixed, step-dependent
- User-visible output: progress text and completion message
- Error behavior: no-plan message; step status surfaced in result
- Reload behavior: not guaranteed globally
- Risk level: medium
- Contract classification: must preserve semantics if retained

### Action: Run single automation step
- State: dormant
- Trigger: `workflowRunStepAutomationBtn` click + confirm dialog
- Inputs: next plan step
- Preconditions: non-empty plan; user confirms; legacy loop mounted
- Local state changes: cursor increments, progress/result updates
- Shared-context writes: step-dependent
- Backend/API calls: step-dependent, indirect
- Durable outputs: mixed, step-dependent
- User-visible output: step-executed message
- Error behavior: no-plan message
- Reload behavior: none guaranteed
- Risk level: medium
- Contract classification: must preserve semantics if retained

### Action: Start Auto Mode
- State: dormant
- Trigger: `workflowAutoStartBtn` click
- Inputs: automation plan
- Preconditions: explicit user click; legacy loop mounted
- Local state changes: `workflowAutomationEnabled=true`, subscription registration, auto mode state changes
- Shared-context writes: step-dependent
- Backend/API calls: indirect only through step execution
- Durable outputs: mixed, step-dependent
- User-visible output: "Workflow Auto Mode started."
- Error behavior: delegated to auto mode engine/steps
- Reload behavior: none guaranteed
- Risk level: medium
- Contract classification: must preserve explicit-click start rule

### Action: Pause Auto Mode
- State: dormant
- Trigger: `workflowAutoPauseBtn` click
- Inputs: none
- Preconditions: auto mode controller exists
- Local state changes: auto mode paused state
- Shared-context writes: none
- Backend/API calls: none
- Durable outputs: none
- User-visible output: paused message
- Error behavior: minimal
- Reload behavior: none
- Risk level: low
- Contract classification: may retire later

### Action: Resume Auto Mode
- State: dormant
- Trigger: `workflowAutoResumeBtn` click
- Inputs: none
- Preconditions: paused auto mode with available plan
- Local state changes: runtime auto mode state updates
- Shared-context writes: step-dependent after resume
- Backend/API calls: indirect step-dependent
- Durable outputs: mixed
- User-visible output: resumed message
- Error behavior: delegated to engine
- Reload behavior: none guaranteed
- Risk level: medium
- Contract classification: may retain with guardrails

### Action: Stop Auto Mode
- State: dormant
- Trigger: `workflowAutoStopBtn` click
- Inputs: none
- Preconditions: auto mode session exists
- Local state changes: auto mode stopped state
- Shared-context writes: none
- Backend/API calls: none
- Durable outputs: none
- User-visible output: stopped message
- Error behavior: minimal
- Reload behavior: none
- Risk level: low
- Contract classification: may retire later

### Action: Approve Auto Mode gate
- State: dormant
- Trigger: `workflowAutoApproveBtn` click
- Inputs: current gate state
- Preconditions: waiting-approval gate state
- Local state changes: runtime gate advance; possible navigation
- Shared-context writes: none required
- Backend/API calls: none to approvals API
- Durable outputs: none
- User-visible output: approval accepted message
- Error behavior: engine-level
- Reload behavior: none
- Risk level: medium (authority confusion risk)
- Contract classification: must preserve non-governance semantics

### Action: Skip Auto Mode gate
- State: dormant
- Trigger: `workflowAutoSkipBtn` click
- Inputs: current gate state
- Preconditions: waiting-approval gate state
- Local state changes: runtime step skipped
- Shared-context writes: none required
- Backend/API calls: none to approvals API
- Durable outputs: none
- User-visible output: step skipped message
- Error behavior: engine-level
- Reload behavior: none
- Risk level: medium
- Contract classification: must preserve non-governance semantics

### Action: Create handoff
- State: dormant in legacy loop; partial in active route only for AI draft (not durable handoff)
- Trigger: push-to-AI and some automation paths
- Inputs: project, payload, destination
- Preconditions: route path executing handler
- Local state changes: shared-context handoff cache writes
- Shared-context writes: `setSharedHandoff(...)`
- Backend/API calls: optional `createProjectHandoff(...)`
- Durable outputs: only when API call executed successfully
- User-visible output: navigation/message
- Error behavior: optional durable call failures logged with warning
- Reload behavior: none guaranteed
- Risk level: medium
- Contract classification: preserve now; later require explicit durable intent

### Action: Save structured workflow task
- State: dormant
- Trigger: `workflowSaveTaskBtn` click
- Inputs: workflow output and metadata
- Preconditions: run output exists
- Local state changes: none critical
- Shared-context writes: none
- Backend/API calls: `createProjectTask(...)`, then reload
- Durable outputs: backend task record
- User-visible output: success/error message
- Error behavior: explicit showError path
- Reload behavior: reload on success
- Risk level: medium
- Contract classification: preserve backend-authoritative write path

## D) Backend Authority Contract

### Backend durable truth actions
- Workflow run creation and persistence
  - API: `runProjectWorkflow`, `runProjectAiWorkflow`
  - Server routes: `/workflows/:workflowId/run`, `/ai/workflows/:workflowId/run`
  - Backbone durable write: `recordWorkflowRun(...)`
- Handoff durable create/consume
  - API: `createProjectHandoff`, `consumeProjectHandoff`
  - Server routes: `/handoffs`, `/handoffs/:handoffId/consume`
  - Backbone durable write: `createHandoff(...)`, `consumeHandoff(...)`
- Governance approvals durable truth
  - Server routes: `/approvals`, `/approvals/:approvalId/decision`
  - Backbone durable write: `createApproval(...)`, `decideApproval(...)`

### Frontend projection/request-only actions
- Prompt building, route navigation, local status text
- Shared-context cache writes (`setSharedAiDraft`, `setSharedHandoff`)
- Auto Mode controller state and gate state

### Must-not-cross boundary
- Frontend must not become authority for workflow run durability.
- Frontend must not treat shared-context cache as durable handoff truth.
- Frontend Auto Mode gate approval must not be interpreted as backend governance approval.

### Governance approvals vs Auto Mode gates
- Governance approvals: backend durable policy/decision records.
- Auto Mode gates: frontend runtime execution pauses/continues.
- Contract rule: names, labels, and docs must keep these semantics distinct.

## E) Auto Mode Contract

### Required behavior
- Auto Mode start only from explicit user action (click on start control).
- No Auto Mode start from render, mount, or route entry side effects.
- Gate approve/skip are frontend runtime controls only.
- Gate approve/skip must not imply backend governance approval.

### Lifecycle expectations
- Controller/subscription creation should occur only when feature path is intentionally active.
- Subscription replacement guard is required to reduce duplicate observers.
- Route-visit lifecycle must avoid listener accumulation if legacy path is ever re-activated.
- Bridge listener registration should remain idempotent and intentional.

### Current status
- Auto Mode controls are currently dormant because legacy loop is not mounted by active route.

## F) Handoff Contract

### Local cache vs durable handoff
- Shared-context cache (`setSharedHandoff`) is local cross-route convenience, not durable truth.
- Durable handoff exists only after successful backend `createProjectHandoff`.

### Local-only handoff cases
- Any `setSharedHandoff` write without durable API call is local-only and may be lost or diverge.

### Durable handoff cases
- `createProjectHandoff` success establishes durable backend record.
- `consumeProjectHandoff` acknowledges and advances durable handoff lifecycle.

### Orphan and divergence risks
- Local cache handoffs can become orphaned if not durably persisted.
- Optional persistence patterns can create mismatch between local route expectations and backend truth.

### Future durable intent requirement
- Future implementation should require explicit durable intent for ownership-transfer handoffs.
- Durable intent should be visible at action level before backend mutation is issued.

## Preservation Rules Before Any Refactor
- Preserve currently mounted light route behavior as-is.
- Treat legacy runtime loop as dormant until explicit decision is approved.
- Preserve backend authority for workflow runs, durable handoffs, and governance approvals.
- Do not merge Auto Mode gate semantics with backend governance approvals.
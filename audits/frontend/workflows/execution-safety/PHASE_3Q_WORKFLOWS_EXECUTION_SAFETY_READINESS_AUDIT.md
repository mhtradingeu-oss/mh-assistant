# PHASE 3Q — Workflows Execution Safety Readiness Audit

## Executive Summary
The Workflows page is a frontend authority-adjacent surface for workflow planning, preparation, backend workflow run recording/execution, AI handoff, Task Center handoff, and automation simulation.

Publishing is already closed technically and visually. This audit verifies whether Workflows can be closed as-is or needs additional safety work.

Verification found that Workflows already has strong safety language and several confirmation gates, especially for full automation and step-by-step simulation. AI Command routing and Operations/Task Center handoffs are review/context-only. Operations mutation controls are deferred and disabled.

However, the current audit cannot claim that all high-risk execution actions are hard-confirmed. Manual workflow run/prepare paths call `runWorkflow(...)`, which can call backend `runProjectAiWorkflow(...)` or `runProjectWorkflow(...)`. The verification scan did not show a direct `window.confirm` guard before the normal manual workflow run buttons.

Therefore, Workflows should not be closed yet.

## Evidence Map
Files inspected:
- `public/control-center/pages/workflows.js`
- `public/control-center/api.js`
- `public/control-center/shared-context.js`
- `public/control-center/automation-engine.js`
- `public/control-center/pages/ai-command/tool-dock.js`
- `public/control-center/pages/operations-centers.js`

Existing evidence/audits reviewed:
- `audits/frontend/workflows/execution-safety/WORKFLOWS_EXECUTION_SAFETY_UX_SEMANTICS_AUDIT.md`
- `audits/frontend/workflows/execution-safety/01-execution-buttons-handlers.txt`
- `audits/frontend/workflows/execution-safety/02-backend-mutation-terms.txt`
- `audits/frontend/workflows/execution-safety/03-run-state-output-builders.txt`
- `audits/frontend/workflows/execution-safety/04-handoff-routing-task-save.txt`
- `audits/frontend/workflows/execution-safety/05-automation-semantics.txt`
- Workflows runtime ownership and behavior contract audits under `audits/frontend/authority-boundary`.

## Route Responsibility
Workflows is responsible for:
- Preparing workflow packages.
- Collecting workflow inputs.
- Showing readiness and missing requirements.
- Recording/triggering workflow run paths through backend workflow APIs.
- Building workflow outputs and local run state.
- Preparing review-only AI handoffs.
- Preparing Task Center handoff context.
- Supporting automation simulation / guided mode.

Workflows should not be responsible for:
- Executing hidden workflow mutations without user confirmation.
- Bypassing backend authority.
- Publishing, CRM mutation, notification mutation, destructive operations, or external sends.
- Presenting simulations as durable backend execution.
- Creating durable tasks without explicit user intent and backend policy.

Authority classification:
- Workflows projects backend authority.
- Backend APIs remain the source of truth for durable execution and task/handoff persistence.
- Frontend must clearly gate or label any backend mutation path.

## Execution / Mutation Inventory

Observed backend-capable functions:
- `runProjectWorkflow(projectName, workflowId, payload)`
- `runProjectAiWorkflow(projectName, workflowId, payload)`
- `createProjectTask(projectName, payload)`
- `createProjectHandoff(projectName, payload)`

Observed frontend execution paths:
- `runWorkflow(workflowId)` can call `runProjectAiWorkflow || runProjectWorkflow`.
- Manual run buttons call `runWorkflow(...)`.
- Catalog run buttons call `runWorkflow(...)`.
- Recommended workflow start can call `runWorkflow(...)`.

Observed automation paths:
- Full automation simulation uses `runAutomationPlan(...)`.
- Step automation simulation uses `runAutomationPlan(...)`.
- Auto Mode uses `startAutoMode`, `resumeAutoMode`, `approveCurrentGate`, and `skipCurrentStep`.

Observed local-only or review-only paths:
- Save draft.
- Load AI state.
- AI Command handoff.
- Shared context handoff.
- Route buttons.
- UI state/status rendering.

Operations connection:
- Task Center, Queue Center, Job Monitor, Notification Center mutation controls are deferred/disabled.
- Operations copy explicitly says context-only handoff does not approve, publish, or execute backend actions.

## Confirmation / Gating Review

Verified hard confirmations:
- Full automation simulation uses `window.confirm`.
- Step-by-step simulation uses `window.confirm`.

Not verified as hard-confirmed:
- Manual workflow run / prepare path through `runWorkflow(...)`.
- Catalog prepare/run path through `data-wf-catalog-run`.
- Recommended start workflow path if it calls `runWorkflow(...)`.
- Task creation path requires deeper exact-handler verification before claiming safe.
- Handoff persistence through `createProjectHandoff` is async and should be treated as backend-capable, even if review-oriented.

Important correction:
The audit must not claim “all high-risk execution actions are confirmation-gated” until manual backend workflow run paths are hard-confirmed or explicitly proven safe by code and Browser QA.

## Auto Mode Safety Review
The automation engine contains strong safety blocking rules:
- publishing live actions are blocked
- destructive actions are blocked
- overwrite actions are blocked
- final approval requires human decision

Automation simulation paths have hard confirmation.

Auto Mode still requires Browser QA:
- Start
- Pause
- Resume
- Stop
- Approve current gate
- Skip current step

Current decision:
Auto Mode appears designed as guided/safe preparation, but closeout requires Browser QA proof and should not be treated as fully closed without it.

## AI Command / Handoff Review
AI Command tool dock contains explicit review-only / non-execution language:
- no publish
- no send
- no route/save/overwrite/create CRM records
- no run workflows

Workflows tool destinations include workflows/task/handoff routes, but AI Command itself prepares instructions/context. It should not execute backend workflow runs directly.

Required QA:
- Open Workflows from AI Command context.
- Send workflow context to AI.
- Confirm no backend workflow run happens through AI handoff alone.

## Task Center / Operations Connection
Task Center/Operations evidence shows:
- incoming handoffs are review-only
- no durable task is automatically created by handoff display
- mutation actions are deferred and disabled
- operations overview does not execute jobs, mutate tasks, send notifications, or approve workflows

This supports Workflows → Task Center as context/review-first, but durable task creation through `createProjectTask` still needs exact handler verification and Browser QA.

## Queue / Job Monitor Connection
Job Monitor and Queue Center are currently read/review surfaces with mutation controls deferred/disabled in Operations Centers.

The frontend should not claim retry/rerun/cancel/delete capability from these surfaces until a separate mutation safety pass exists.

## Risk Matrix

| Priority | Risk | Evidence / Reason | Recommended Handling |
|---|---|---|---|
| P0 | Hidden frontend-only execution bypass | Not observed | Keep backend authority enforced |
| P1 | Manual workflow run path lacks verified hard confirmation | `runWorkflow(...)` can call backend workflow APIs; normal manual run buttons call it | Add/verify hard confirmation before backend workflow run |
| P1 | Task creation safety not fully proven from current verification | `createProjectTask` exists and Workflows has task handoff controls | Verify handler and add confirm if backend task creation occurs |
| P1 | Handoff persistence can call backend `createProjectHandoff` | Backend-capable async persistence exists | Clarify review-only vs persisted handoff behavior |
| P2 | Execution-heavy labels can confuse users | Existing older audit flagged “Run/Start/Save as Task” semantics | Keep preparation/simulation language or patch labels only if needed |
| P2 | Auto Mode semantics need Browser QA proof | Auto Mode has active controls and gated flow | Browser QA matrix required |
| P3 | Visual polish | Existing visual audits/patches exist | Defer until safety closeout |

## Browser QA Matrix
Required before Workflows closeout:

| Scenario | Required Result |
|---|---|
| Page opens | No fatal error |
| Console | No errors |
| Manual workflow prepare/run cancel | Cancel prevents backend workflow run |
| Manual workflow prepare/run confirm | Confirm allows backend workflow run |
| Catalog prepare/run cancel | Cancel prevents backend workflow run |
| Catalog prepare/run confirm | Confirm allows backend workflow run |
| Recommended workflow start cancel | Cancel prevents backend workflow run |
| Recommended workflow start confirm | Confirm allows backend workflow run |
| Full automation simulation cancel | Cancel prevents simulation |
| Full automation simulation confirm | Simulation proceeds |
| Step automation cancel | Cancel prevents step |
| Step automation confirm | Step proceeds |
| Auto Mode start/pause/resume/stop | No publish/destructive/backend execution beyond allowed safe steps |
| Approve/skip gate | Does not bypass final approval or destructive restrictions |
| AI handoff | Review/context-only; no workflow run |
| Task handoff | Review/context-only unless explicit confirmed backend task creation exists |
| Operations route buttons | Routing only; no mutation |
| Deferred operations actions | Disabled |

## Recommended Decision
**B) Needs safety/copy patch before closeout.**  
**C) Needs Browser QA proof before closeout.**

## Recommended Next Step
Run a targeted Workflows safety patch plan before closeout:
1. Add or verify hard confirmation before any backend workflow run path.
2. Verify `createProjectTask` handler. If it creates a durable task, add hard confirmation or clarify as handoff-only.
3. Verify `createProjectHandoff` persistence behavior and ensure copy is truthful.
4. Preserve Auto Mode safety rules.
5. Run Browser QA matrix.
6. Commit only after QA.
7. Close Workflows safety phase.

## Protected Behavior List
Before any patch:
- Do not change backend APIs.
- Do not change `api.js`.
- Do not change `shared-context.js`.
- Do not change `automation-engine.js`.
- Do not change data/projects.
- Do not add new execution paths.
- Do not weaken existing automation confirmations.
- Do not allow Auto Mode to publish, delete, overwrite, approve final assets, or execute destructive actions.
- Do not change AI Command routing behavior.

## Validation Results
Verification scan completed:
- `git status --short` showed this audit as untracked.
- node syntax checks passed for relevant files.
- No production files were changed by this audit.
- Verification found confirmation for automation simulation paths, but not enough evidence to claim all manual backend workflow run paths are hard-confirmed.

# Workflows Execution Safety & UX Semantics Audit

## Purpose

Audit Workflows execution-like controls before any visual redesign or polish.

The Workflows page is connected and non-empty. However, it contains labels that may imply real execution, including Run Workflow, Run full automation, Start automation, Pause, Resume, Stop, and Save as Task.

This audit determines whether those controls are local/gated/simulated or whether they mutate runtime/backend state.

## Scope

Inspect:

- Execution-like buttons.
- Button handlers.
- Workflow run state.
- Local drafts.
- Backend/API calls.
- Handoff routing.
- Task save semantics.
- Automation mode semantics.
- UX labels that may mislead users.

## Evidence files

- `01-execution-buttons-handlers.txt`
- `02-backend-mutation-terms.txt`
- `03-run-state-output-builders.txt`
- `04-handoff-routing-task-save.txt`
- `05-automation-semantics.txt`

## Questions to answer

- Does Run Workflow call a backend API?
- Does Run full automation call a backend API?
- Does Auto Start trigger actual execution or local simulation?
- Does Save as Task create a real task or only prepare a handoff/draft?
- Is there explicit confirmation before any real execution?
- Are workflow outputs stored locally, shared as handoffs, or sent to backend?
- Are current labels safe and truthful?
- Should labels be renamed to Prepare / Simulate / Build Draft / Prepare Handoff?

## Safety checklist

- [ ] No backend mutation without confirmation.
- [ ] No hidden workflow execution.
- [ ] No automatic task creation without confirmation.
- [ ] No publishing or external action.
- [ ] No CRM/customer/notification mutation.
- [ ] Local draft behavior is clear.
- [ ] Shared handoff behavior is clear.
- [ ] Automation labels do not overpromise real execution.

## UX risk checklist

- [ ] "Run Workflow" is accurate.
- [ ] "Run full automation" is accurate.
- [ ] "Start automation" is accurate.
- [ ] "Save as Task" is accurate.
- [ ] User can distinguish preview/simulation from real execution.
- [ ] User sees where real execution would happen.
- [ ] Empty states explain no real execution has happened.

## Current status

Pending evidence review.

## Recommendation

Do not redesign Workflows until execution safety and label semantics are classified.

## Evidence review result

The scan confirms that Workflows has real execution-like state and automation semantics in the frontend.

Confirmed:

- `runWorkflow(...)` exists.
- Manual run buttons call `runWorkflow(...)`.
- Workflow run state changes to `running`, then `completed` or `failed`.
- Workflow output can be stored in session run state.
- Workflow output can be shared through `setSharedHandoff(...)`.
- Automation controls exist for full automation, step-by-step automation, Auto Mode, pause, resume, stop, approve, and skip.
- Full automation and step automation include `window.confirm(...)` before proceeding.
- Auto Mode can call automation engine helpers such as `startAutoMode(...)`, `resumeAutoMode(...)`, `approveCurrentGate(...)`, and `skipCurrentStep(...)`.

## Safety classification

Current state:

- Manual workflow preparation/run state: technically connected.
- Shared handoff: technically connected.
- Automation: gated partially by confirmation for full/step automation.
- Auto Mode: active frontend automation semantics exist.
- Backend/runtime impact: needs deeper automation-engine audit before claiming fully safe.
- UX labels: too execution-heavy for the current operating-surface vision.

## Main issue

The page uses labels that imply direct execution:

- Run Workflow
- Run
- Run Full Automation
- Run Step-by-Step
- Start Auto Mode From Plan
- Save as Task

These labels are not ideal for a review-first AI operating system where outputs should be prepared, reviewed, routed, and confirmed before execution.

## Required follow-up

Before visual polish, apply a small safety semantics patch:

- Rename execution-heavy labels to preparation/simulation/guided-mode language.
- Keep handlers unchanged.
- Keep backend/runtime behavior unchanged.
- Keep confirmation gates unchanged.
- Clarify empty states and status text.
- Preserve the existing workflow state model.

Recommended label direction:

- `Run Workflow` -> `Prepare Workflow Package`
- `Run` -> `Prepare`
- `Run Full Automation` -> `Simulate Full Automation`
- `Run Step-by-Step` -> `Simulate Next Step`
- `Start Auto Mode From Plan` -> `Start Guided Mode`
- `Save as Task` -> `Prepare Task Handoff`
- `No execution result yet` -> `No prepared package yet`

## Recommendation

Do not proceed to UI/UX polish until a semantics-only safety patch is completed and reviewed in browser.

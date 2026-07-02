# Workflows Pass 1A - Safety Semantics Label Patch

## Summary

This patch reduces execution-heavy language in the Workflows page without changing behavior.

The Workflows page has frontend run state and automation semantics. To align with the AI operating-system vision, labels were changed from execution-first wording to preparation, simulation, and guided-mode wording.

## Files changed

- public/control-center/pages/workflows.js
- audits/frontend/workflows/execution-safety/WORKFLOWS_PASS_1A_SAFETY_SEMANTICS_LABEL_PATCH.md

## What changed

Execution-heavy labels were replaced:

- Run Workflow -> Prepare Workflow Package
- Run -> Prepare
- Run Full Automation -> Simulate Full Automation
- Run Step-by-Step -> Simulate Next Step
- Start Auto Mode From Plan -> Start Guided Mode
- Save as Task -> Prepare Task Handoff
- No execution result yet -> No prepared package yet

System feedback was also adjusted:

- Auto Mode -> Guided Mode
- Automation run -> Automation simulation
- Step executed -> Step simulated

## What did not change

- No handler changes.
- No backend changes.
- No automation engine changes.
- No data model changes.
- No route changes.
- No shared handoff behavior changes.
- No confirmation gates removed.
- No workflow state logic removed.

## Safety decision

This is a semantics-only patch. It reduces misleading execution language while preserving the existing technical behavior for later deep review.

## Browser QA checklist

- [ ] Workflows page opens.
- [ ] Main prepare button says Prepare Workflow Package.
- [ ] Catalog buttons say Prepare.
- [ ] Automation buttons use simulation/guided wording.
- [ ] Save/task button says Prepare Task Handoff.
- [ ] Empty state says No prepared package yet.
- [ ] Existing actions still respond.
- [ ] No console errors.

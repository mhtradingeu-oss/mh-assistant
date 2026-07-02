# Workflows QA and Rollback Contract

## QA Scope
- Validate current active mounted light route behavior.
- Validate that legacy runtime controls remain dormant unless intentionally activated in a future implementation.
- Validate no backend authority drift.

## Browser QA Checklist (Current Active Light Route)

1. Route mount and shell
- Open Workflows route.
- Confirm light shell renders into `#workflowsRoot`.
- Confirm buttons visible: Prepare Workflow, Send to AI Workspace, Open Campaign Studio, Open Task Center.
- Confirm Auto Mode controls are not visible.
- Confirm manual durable run controls are not visible.

2. Prepare workflow behavior
- Set workflow type/project/campaign/goal.
- Click Prepare Workflow.
- Confirm `quickCommandInput` is populated when present.
- Confirm status message updates in route.
- Confirm no backend mutation call occurs.

3. Send to AI workspace behavior
- Click Send to AI Workspace.
- Confirm shared AI draft is staged and route navigates to AI Command.
- Confirm no direct durable handoff mutation call from this light route action.

4. Navigation behaviors
- Click Open Campaign Studio and Open Task Center.
- Confirm route navigation only.
- Confirm no shared-context mutation and no backend mutation from these actions.

5. Stability checks
- Navigate away and back multiple times.
- Confirm no duplicate behavior appears.
- Confirm no latent Auto Mode activation appears on mount.

## Browser QA Checklist (If Legacy Loop Is Intentionally Activated Later)

1. Explicit-start guarantee
- Confirm Auto Mode starts only after explicit start button click.
- Confirm no Auto Mode start on route load/render/mount.

2. Manual and bridge run behavior
- Manual run emits one durable run call only.
- Bridge auto-run emits one durable run call only when bridge is explicitly wired and receives valid event.

3. Gate semantics
- Approve/Skip gate controls update runtime auto mode state only.
- Confirm no backend approval decision endpoint is called by Auto Mode gate controls.

4. Handoff durability semantics
- Confirm local `setSharedHandoff` writes are distinguishable from durable `createProjectHandoff` outcomes.
- Confirm consume flow uses durable consume endpoint where expected.

5. Lifecycle guardrails
- Re-enter route repeatedly and verify no duplicate bridge listener side effects.
- Verify no duplicate auto-mode subscriptions across revisit cycles.

## Validation Commands

```bash
cd /opt/mh-assistant

echo "===== BRANCH ====="
git branch --show-current

echo "===== STATUS ====="
git status --short

echo "===== WORKFLOWS SURFACE MARKERS ====="
rg -n "export const workflowsRoute|renderWorkflowExecutionLoop|bindWorkflowExecutionLoop|registerWorkflowBridge|wfLightPrepareBtn|workflowAutoStartBtn|workflowRunBtn" public/control-center/pages/workflows.js

echo "===== AUTO MODE / AUTOMATION ENGINE ====="
rg -n "startAutoMode|pauseAutoMode|resumeAutoMode|stopAutoMode|approveCurrentGate|skipCurrentStep|runAutomationPlan" public/control-center/automation-engine.js public/control-center/pages/workflows.js

echo "===== DURABLE API / SERVER ROUTES ====="
rg -n "runProjectWorkflow|runProjectAiWorkflow|createProjectHandoff|consumeProjectHandoff" public/control-center/api.js
rg -n "workflows/:workflowId/run|ai/workflows/:workflowId/run|/handoffs|/approvals" runtime/orchestrator-service/server.js

echo "===== SYNTAX CHECK ====="
node --check public/control-center/pages/workflows.js
node --check public/control-center/automation-engine.js
node --check public/control-center/shared-context.js
```

## Rollback Plan

1. Trigger conditions
- Any active-vs-dormant parity drift.
- Any duplicate backend durable mutation.
- Any Auto Mode start from non-explicit action.
- Any authority boundary regression (frontend acting as durable authority).

2. Rollback actions
- Revert only the offending implementation commit(s) using non-destructive, non-interactive git commands.
- Restore behavior to last approved contract baseline.
- Re-run validation commands and browser QA checklist.
- Capture mismatch evidence before reattempt.

3. Recovery acceptance
- All pass criteria restored.
- No duplicate durable calls.
- Active mounted route matches contract.
- Backend authority boundaries unchanged.

## Explicit Non-Goals
- No production refactor in this contract step.
- No backend route or persistence changes.
- No movement of operational authority from backend to frontend.
- No route redesign.
- No automatic activation of dormant legacy execution loop.

## Contract Guardrail Summary
- Audit first, compare second, implement last.
- Preserve active mounted light route behavior until explicit decision approval.
- Treat legacy heavy loop as dormant and controlled by formal decision gate.
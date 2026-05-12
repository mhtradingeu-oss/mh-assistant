# Auto Mode Lifecycle Implementation Plan

## Recommended Next Step
- Recommended: B. Add lifecycle registry documentation only.

Why this is safest now:
- Meets doctrine sequence (Audit -> Confirm -> Decide -> Implement).
- Freezes lifecycle ownership before code changes.
- Avoids accidental behavior drift across active and dormant route surfaces.
- Avoids reactivating Workflows legacy runtime path prematurely.

## Implementation Options Comparison

### A. Audit only, no code change
- Safety: highest immediate safety
- Limitation: no durable ownership artifact for future implementation handoff

### B. Add lifecycle registry documentation only (recommended now)
- Safety: very high
- Value: creates concrete ownership contract without runtime changes

### C. Add tiny lifecycle registry helper module
- Safety: medium
- Risk: introduces runtime coupling before contract acceptance and shadow compare

### D. Add route-unmount teardown hooks
- Safety: medium to low unless fully validated
- Risk: subtle behavior regressions in active pages and dormant legacy paths

### E. Refactor Auto Mode controller ownership
- Safety: lowest in current stage
- Risk: broad behavioral parity and authority-boundary regressions

## Future Lifecycle Registry Contract (Design Only)

For each Auto Mode-capable surface, document:
- `route_id`
- `surface_id`
- `controller_key`
- `subscription_key`
- `create_trigger`
- `start_trigger`
- `stop_trigger`
- `cleanup_trigger`
- `teardown_expected` (yes/no + reason)
- `durable_action_allowed` (none/optional/required)
- `gate_semantics` (runtime-only; never governance)
- `owner_file`
- `risk_class`

Contract rules:
- Auto Mode start must always be explicit user action.
- No start from render/mount/route-entry side effects.
- Gate approve/skip must not call backend governance approval endpoints.
- Every subscription/listener must have documented teardown owner.
- Dormant surfaces must remain dormant unless explicitly activated by decision gate.

## Validation Commands

```bash
cd /opt/mh-assistant

echo "===== BRANCH ====="
git branch --show-current

echo "===== STATUS ====="
git status --short

echo "===== AUTO MODE OWNERSHIP MARKERS ====="
rg -n "autoModeState|createAutoModeController|subscribeAutoMode|startAutoMode|pauseAutoMode|resumeAutoMode|stopAutoMode|approveCurrentGate|skipCurrentStep|approvalRequiredStep|waiting_approval" public/control-center/automation-engine.js public/control-center/pages/publishing.js public/control-center/pages/workflows.js

echo "===== ROUTE CLEANUP HOOK MARKERS ====="
rg -n "activeRouteCleanup|disposeActiveRouteCleanup|renderCurrentPage|return renderResult" public/control-center/app.js

echo "===== WORKFLOWS ACTIVE VS LEGACY MARKERS ====="
rg -n "workflowsRoute|bindWorkflowExecutionLoop|registerWorkflowBridge|workflowAutoStartBtn" public/control-center/pages/workflows.js

echo "===== SHARED CONTEXT MARKERS ====="
rg -n "setSharedAiDraft|setSharedHandoff|getSharedHandoff|handoffCache|aiDraftCache" public/control-center/shared-context.js public/control-center/automation-engine.js

echo "===== SYNTAX CHECK ====="
node --check public/control-center/automation-engine.js
node --check public/control-center/pages/publishing.js
node --check public/control-center/pages/workflows.js
node --check public/control-center/app.js
```

## Browser QA Checklist

1. Publishing Auto Mode start/stop/gate
- Verify start occurs only from explicit Auto Prepare click.
- Verify stop works and does not auto-restart on route revisit.
- Verify approve/skip gate actions do not imply backend governance approval.

2. Workflows active route safety
- Verify active light route has no mounted Auto Mode controls.
- Verify route renders and navigations work without latent Auto Mode execution.

3. Workflows legacy dormancy
- Verify no accidental activation of legacy loop controls.
- Verify no bridge-driven auto-execution in normal active route usage.

4. Repeated navigation stability
- Navigate between routes repeatedly.
- Verify no duplicate progress/toast behavior from stale subscribers.

5. Reload behavior
- During paused/waiting states, reload and verify engine does not auto-start.

## Rollback Plan

1. Trigger rollback if any of the following occurs:
- Auto Mode starts from render/mount.
- Duplicate callbacks/toasts/progress appears after route revisits.
- Gate actions begin calling backend governance approval APIs.
- Dormant Workflows legacy loop is unintentionally reactivated.

2. Rollback actions:
- Revert only the offending implementation commit(s) with non-destructive git commands.
- Restore last approved lifecycle contract baseline.
- Re-run validation commands and browser checklist.

3. Acceptance after rollback:
- Explicit-click start guarantee restored.
- No duplicate lifecycle side effects.
- Active/dormant route status restored.
- Backend authority boundaries unchanged.

## Explicit Non-Goals
- No behavior changes in this step.
- No Auto Mode controller refactor.
- No backend changes.
- No route render changes.
- No reactivation of Workflows legacy loop.
- No Publishing extraction before lifecycle contract approval.
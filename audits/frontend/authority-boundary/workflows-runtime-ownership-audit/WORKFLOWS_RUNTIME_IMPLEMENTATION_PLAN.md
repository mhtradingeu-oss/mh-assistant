# Workflows Runtime Implementation Plan

## Status
- Audit complete.
- No production code changes in this step.

## Recommended Next Step
- B. Create workflows behavior contract.

## Why This Is Safest
- Workflows page contains both:
  - currently mounted light route behavior (prompt prep/navigation), and
  - legacy heavy execution loop with Auto Mode and durable run/handoff integrations.
- Without a behavior contract, extraction/lifecycle work can unintentionally alter which runtime surface is active.
- This preserves doctrine order: Audit -> Confirm -> Decide -> Implement.

## Future Step-by-Step Plan (Implementation Later)

1. Create behavior contract document for Workflows runtime surface.
- Define active route truth (what is mounted today).
- Define legacy runtime loop status (defined but not currently mounted).
- Freeze action semantics for run, handoff, auto mode, and gate controls.

2. Create Workflows shadow-compare plan (after contract).
- Mirror publishing shadow-compare structure for workflows actions.
- Include strict no-duplicate-backend-call rule.
- Include active-vs-legacy route parity checks.

3. Add non-invasive lifecycle registry draft for Auto Mode pages (design only first).
- Identify where controller/subscription/listener are created.
- Identify explicit cleanup expectations for unmount/revisit.
- Do not change behavior yet.

4. Decision gate.
- If contract and shadow-compare are accepted, choose implementation scope:
  - keep active light route only and archive legacy loop, or
  - formally remount legacy loop with explicit lifecycle guardrails.

5. Implementation phase (future, guarded).
- Apply smallest possible changes.
- Never move backend authority into frontend.
- Keep durable run/handoff/approval operations backend-owned.

## Validation Commands (for future implementation checkpoints)

```bash
cd /opt/mh-assistant

# 1) Branch and working tree safety
git branch --show-current
git status --short

# 2) Ensure workflows runtime symbols map remains stable
rg -n "workflowsRoute|bindWorkflowExecutionLoop|registerWorkflowBridge|startAutoMode|runAutomationPlan|createProjectHandoff|runProjectWorkflow|runProjectAiWorkflow" public/control-center/pages/workflows.js public/control-center/automation-engine.js

# 3) Verify API durable endpoints still unchanged
rg -n "runProjectWorkflow|runProjectAiWorkflow|createProjectHandoff|consumeProjectHandoff" public/control-center/api.js
rg -n "workflows/:workflowId/run|ai/workflows/:workflowId/run|/approvals|/handoffs" runtime/orchestrator-service/server.js

# 4) Syntax safety
node --check public/control-center/pages/workflows.js
node --check public/control-center/automation-engine.js
node --check public/control-center/shared-context.js
```

## Browser QA Checklist (future implementation)

1. Open Workflows route and confirm mounted UI matches contract baseline (light shell controls present).
2. Click Prepare Workflow and verify only prompt staging occurs.
3. Click Send to AI Workspace and verify navigation + draft projection only.
4. Confirm no Auto Mode controls are visible in active route unless explicitly intended by contract.
5. If legacy loop is intentionally activated in future, verify:
- Auto Mode starts only on explicit click.
- No auto-run on mount/render.
- Gate approve/skip does not call backend approval decision endpoints.
- Any durable run/handoff call is single-call and backend acknowledged.
6. Navigate away and back repeatedly to detect listener/subscription duplication symptoms.
7. Verify durable handoff/workflow run counts in operations reflect backend truth, not local-only cache artifacts.

## Rollback Plan (future implementation)

1. If parity drifts or lifecycle regressions appear, revert implementation commit(s) only (no destructive git reset).
2. Restore previous workflows runtime behavior contract baseline.
3. Re-run validation commands and browser checklist.
4. Re-open audit with mismatch evidence before retry.

## Explicit Non-Goals
- No production refactor in this audit step.
- No backend route or backbone logic changes.
- No authority model redesign.
- No extraction of helpers before behavior contract and shadow-compare plan are approved.
- No page redesign.

## Decision Summary
- Immediate action: remain audit-only for code.
- Next artifact to create: Workflows behavior contract (option B).
- Follow-up artifact: Workflows shadow-compare plan.
- Only then decide on lifecycle registry/extraction sequence.
# PHASE 3Q.1 — Workflows Safety Patch Plan

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: c9a00f1 Add Workflows execution safety readiness audit

## Purpose
Define the smallest safe patch required before Workflows safety closeout.

## Required Patch Areas

### 1. Backend Workflow Run Confirmation
Add hard confirmation before `runWorkflow(...)` performs backend workflow run through:
- `runProjectAiWorkflow(...)`
- `runProjectWorkflow(...)`

The confirmation must cover:
- `workflowRunBtn`
- `workflowRunBtnMain`
- `wfexecStartRecommendedBtn`
- `data-wf-catalog-run`

### 2. Preserve Existing Automation Confirmations
Do not weaken existing confirmations for:
- full automation simulation
- step-by-step simulation

### 3. Task Creation Verification
Verify the `workflowSaveTaskBtn` path:
- If it creates a durable backend task through `createProjectTask`, add hard confirmation.
- If it only prepares a handoff, preserve review-only copy and no backend mutation.

### 4. Handoff Persistence Clarity
Verify `createProjectHandoff` persistence:
- If it persists backend handoff automatically, ensure copy remains truthful.
- Do not block review-only shared-context handoff.

### 5. Auto Mode Safety Preservation
Do not expand Auto Mode.
Do not allow Auto Mode to publish, delete, overwrite, approve final assets, execute destructive operations, or bypass backend gates.

## Target Files
- public/control-center/pages/workflows.js

## Protected Behavior
- No backend changes.
- No api.js changes.
- No shared-context changes.
- No automation-engine changes.
- No operations-centers changes.
- No ai-command/tool-dock changes.
- No data/projects changes.
- No CSS changes.
- No new execution paths.
- No weakening of existing automation confirmations.

## Browser QA Required After Patch
- Page opens without fatal error.
- No console errors.
- Manual prepare cancel blocks backend workflow run.
- Manual prepare confirm allows backend workflow run.
- Main prepare cancel/confirm.
- Recommended workflow start cancel/confirm.
- Catalog prepare cancel/confirm.
- Save task behavior verified.
- AI handoff remains review-only.
- Full automation cancel/confirm still works.
- Step automation cancel/confirm still works.
- Auto Mode start/pause/resume/stop does not bypass safety rules.
- Approve/skip gate does not bypass final approval or destructive restrictions.

## Decision
Proceed only with targeted frontend safety patch after reviewing exact handler locations.

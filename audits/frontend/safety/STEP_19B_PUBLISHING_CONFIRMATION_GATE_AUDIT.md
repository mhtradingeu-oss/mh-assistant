# STEP 19B - Publishing Confirmation Gate Audit

Date: 2026-05-13
Mode: AUDIT ONLY (documentation-only)
Branch: architecture/frontend-consolidation-v1

## 1. Executive Summary

This audit reviewed Publishing dangerous actions, frontend handler-to-API mapping, and backend policy authority to identify exactly one smallest safe confirmation gate candidate for Step 19C.

Summary outcome:
- Publishing includes multiple backend-controlled and external-effect actions without explicit confirmation gates.
- One smallest safe candidate is selected for Step 19C: `publishPublishingItem` from the queue action path (`action === "publish"`).
- No production code changes were made in this step.

## 2. Publishing Dangerous Action Inventory

High-risk and/or backend-controlled actions in Publishing:
- Save draft/schedule payload to backend (`savePublishingSchedule`)
- Reschedule existing backend job (`reschedulePublishingItem`)
- Approve item for readiness (`approvePublishingItem`)
- Publish item (`publishPublishingItem`) - external-effect class
- Mark item failed (`failPublishingItem`)
- Auto Prepare Publishing (`publishingAutoPrepareBtn` -> auto mode run)
- Auto approve gate (`publishingAutoApproveBtn` -> approval gate accept)
- Auto skip gate (`publishingAutoSkipBtn` -> skip gated step)
- Load workflow output (`publishingLoadHandoffBtn`) - local draft mutation only
- Push AI context (`publishingPushAiBtn`) - context handoff only

## 3. Current Handlers and API Call Mapping

Frontend handler evidence from `public/control-center/pages/publishing.js`:

- Draft persistence path
  - `persistDraft()` calls `savePublishingSchedule(..., buildSchedulePayload(session, "draft"))`
  - Lines: 1323-1325

- Schedule button path
  - Current item: `reschedulePublishingItem`
  - No current item: `savePublishingSchedule`
  - Lines: 1419-1423

- Queue action path (`[data-publishing-action]`)
  - `action === "publish"` -> `publishPublishingItem`
  - `action === "pause"` -> `reschedulePublishingItem(... "draft")`
  - `action === "retry"` -> `reschedulePublishingItem(... "scheduled")`
  - Lines: 1481, 1487, 1493

- Approve button path
  - `publishingApproveBtn` -> `approvePublishingItem`
  - Line: 1519

- Fail button path
  - `publishingFailBtn` -> `failPublishingItem`
  - Line: 1543

- Auto mode and context-only paths
  - `publishingLoadHandoffBtn`: loads handoff into local form/draft only
    - Lines: 1550-1571
  - `publishingPushAiBtn`: builds prompt and navigates to AI Command
    - Lines: 1573-1612
  - `publishingAutoPrepareBtn`: starts auto mode plan
    - Lines: 1614-1648
  - `publishingAutoApproveBtn`: `approveCurrentGate(...)`
    - Lines: 1656-1661
  - `publishingAutoSkipBtn`: `skipCurrentStep(...)`
    - Lines: 1664-1669

## 4. Backend Endpoint and Policy Evidence

API wrappers (`public/control-center/api.js`):
- `savePublishingSchedule`: line 1788
- `reschedulePublishingItem`: line 1801
- `approvePublishingItem`: line 1818
- `publishPublishingItem`: line 1835
- `failPublishingItem`: line 1852

Server endpoints (`runtime/orchestrator-service/server.js`):
- `POST /media-manager/project/:project/publishing/schedule`: line 11818
- `POST /media-manager/project/:project/publishing/:jobId/reschedule`: line 11884
- `POST /media-manager/project/:project/publishing/:jobId/ready`: line 11942
- `POST /media-manager/project/:project/publishing/:jobId/publish`: line 11986
- `POST /media-manager/project/:project/publishing/:jobId/fail`: line 12050

Policy enforcement (`runtime/orchestrator-service/lib/ops/backbone.js`):
- `DEFAULT_POLICY_RULES` includes:
  - `approval_before_publish: true` (line 21)
  - `freeze_publishing: false` (line 26)
- `approval_required_actions` includes `publish` (line 845)
- `execution_policy.auto_execution_requires_rules` and `audit_logging_enabled` (lines 849-850)
- Publish guards:
  - freeze publishing check (line 1344)
  - approval-before-publish enforcement (line 1452)
  - freeze publishing enforcement (line 1460)

## 5. Which Actions Need Confirmation

Needs explicit confirmation before mutation:
- `publishPublishingItem` (external effect; highest impact)
- `approvePublishingItem` (state transition to ready/approved)
- `failPublishingItem` (terminal failure-state mutation)
- `reschedulePublishingItem` when changing operational schedule
- `savePublishingSchedule` when creating first backend scheduled job
- `publishingAutoPrepareBtn` (multi-step automation entry)
- `publishingAutoApproveBtn` and `publishingAutoSkipBtn` (gated execution decisions)

Does not require dangerous-action confirm gate in this phase:
- `publishingLoadHandoffBtn` (local form draft load)
- `publishingPushAiBtn` (context handoff to AI page)

## 6. Which Actions Should Not Be Patched Yet

Hold for later phases (larger scope/risk):
- Auto mode gate controls (`autoPrepare`, `autoApprove`, `autoSkip`) because they require cross-module consistency with workflow automation controller semantics.
- Schedule/create-reschedule confirmations as a bundle, to avoid inconsistent UX between draft/schedule/retry/pause paths.
- Approval and fail confirmations in same patch as publish if scope grows beyond one tiny gate.

## 7. Exact Smallest Safe STEP 19C Candidate

Chosen single candidate:
- Add one confirmation gate only in the existing queue publish branch:
  - File: `public/control-center/pages/publishing.js`
  - Path: `[data-publishing-action]` handler where `action === "publish"`
  - Existing call site: line 1481 (`publishPublishingItem`)

Why this is the smallest safe candidate:
- One branch, one API call, one high-impact external-effect action.
- Minimal blast radius, easiest to validate, no backend contract changes.
- Aligns directly with policy guard intent (`approval_before_publish`, `publish` in required actions).

## 8. Proposed Confirmation Copy For That One Candidate

Proposed Step 19C dialog copy (single candidate only):

Title/body string proposal:
- "Confirm publish action\n\nAction: Publish this item to configured channels now.\nRisk: This can create an external live effect and may be difficult to reverse.\nPolicy: Publish should proceed only when approval and readiness checks are satisfied.\n\nSelect Cancel to keep this item in queue."

Copy intent:
- Mentions action, external-effect risk, policy context, and cancel outcome.

## 9. Why Only One Gate First

- Reduces implementation risk and review overhead.
- Makes behavior impact unambiguous in testing.
- Avoids mixing policy/approval/scheduling/automation confirmation semantics in one patch.
- Establishes reusable confirmation copy pattern with minimal scope.

## 10. Validation Commands and Results

Commands requested and executed:
- `git status --short`
- `node --check public/control-center/pages/publishing.js`
- `node --check public/control-center/api.js`
- `node --check runtime/orchestrator-service/server.js`
- `node --check runtime/orchestrator-service/lib/ops/backbone.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `grep -n "savePublishingSchedule\|reschedulePublishingItem\|approvePublishingItem\|publishPublishingItem\|failPublishingItem\|publishingAutoPrepareBtn\|publishingAutoApproveBtn\|publishingAutoSkipBtn\|publishingPushAiBtn\|publishingLoadHandoffBtn" public/control-center/pages/publishing.js`

Results summary:
- `git status --short`: one untracked file
  - `audits/frontend/safety/STEP_19B_PUBLISHING_CONFIRMATION_GATE_AUDIT.md`
- Syntax checks passed for all specified files (exit 0):
  - `public/control-center/pages/publishing.js`
  - `public/control-center/api.js`
  - `runtime/orchestrator-service/server.js`
  - `runtime/orchestrator-service/lib/ops/backbone.js`
  - `public/control-center/app.js`
  - `public/control-center/router.js`
- Grep output confirmed expected publishing action anchors and handler/button IDs, including:
  - line 928: `publishingPushAiBtn`
  - line 929: `publishingAutoPrepareBtn`
  - line 942: `publishingAutoApproveBtn`
  - lines 1286-1290: `savePublishingSchedule`, `reschedulePublishingItem`, `approvePublishingItem`, `publishPublishingItem`, `failPublishingItem`
  - line 1481: `publishPublishingItem` usage
  - line 1519: `approvePublishingItem` usage
  - line 1543: `failPublishingItem` usage

## 11. Explicit No-Code-Change Statement

Step 19B was audit-only and documentation-only.

No frontend JS production behavior was changed.
No CSS was changed.
No backend files were changed.
No data/projects files were changed.
No handler logic was changed.
No routes were changed.
No IDs/classes/data attributes were changed.
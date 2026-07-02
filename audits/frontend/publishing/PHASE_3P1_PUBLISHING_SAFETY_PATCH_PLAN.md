# PHASE 3P.1 — Publishing Safety Patch Plan

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: 1b67913 Add Publishing safety readiness audit

## Purpose
Define the smallest safe patch needed before Publishing closeout.

## Required Patch Areas

### 1. Backend Approve Confirmation
Add hard confirmation before backend `approvePublishingItem(...)`.

Local draft approval may remain local-only, but copy must remain clear.

### 2. Backend Schedule / Reschedule Confirmation
Add hard confirmation before backend `savePublishingSchedule(...)` and `reschedulePublishingItem(...)`.

Local draft save remains local-only.

### 3. Asset Blocker Guard
Before backend schedule/publish actions, verify whether `assetBlockers.length > 0`.

If blockers are present:
- stop backend mutation
- show a clear message
- do not change local/backend state silently

### 4. Preserve Existing Publish / Fail Confirmation
Do not weaken current `window.confirm` for publish and fail.

### 5. No Backend/API Changes
Patch must be frontend safety-gating only.

## Target Files
- public/control-center/pages/publishing.js

## Protected Behavior
- No backend changes.
- No api.js changes.
- No shared-context changes.
- No automation-engine changes.
- No data/projects changes.
- No new publish execution paths.
- No Auto Mode execution expansion.

## Browser QA Required After Patch
- Schedule cancel/confirm.
- Reschedule cancel/confirm.
- Approve cancel/confirm.
- Publish cancel still blocks.
- Fail cancel still blocks.
- Asset blockers block schedule/publish.
- Local draft remains local-only.
- AI handoff remains review-only.
- Auto prepare does not publish/approve/fail.

## Decision
Proceed only with a targeted frontend safety patch after reviewing exact handler locations.

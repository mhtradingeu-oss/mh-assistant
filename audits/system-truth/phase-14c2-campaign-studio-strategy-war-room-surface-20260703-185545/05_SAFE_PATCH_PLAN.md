# Safe Patch Plan

## Target Production File
- public/control-center/pages/campaign-studio.js

## Patch Type
- Tiny frontend render enhancement.
- No backend/API/router/shared-context/schema/CSS changes.

## Planned Additions
1. Strategy War Room section under the existing command header and before Campaign Basics.
2. Campaign Brief Snapshot card:
   - Objective
   - Audience
   - Offer
   - Channels
   - Budget
   - Timeline
3. Strategy Readiness card with frontend-derived statuses:
   - Brief
   - Audience
   - Offer
   - Channels
   - Assets
   - Handoffs
4. Launch Waves quick snapshot using existing wave values/fallbacks.
5. Team Handoff Packet preview card (static informative rows only):
   - Writer / Content Studio
   - Designer / Media Studio
   - Publisher / Publishing
   - Ads Operator / Ads Manager
   - Workflow / Workflows
6. Safe Next Move + review-only boundary note.
7. Optional static "recommended strategist tools" chips (copy-only) if space allows.

## Non-Changes
- No new buttons with new behavior.
- No handler modifications unless required for null-safe render-only support.
- No changes to save/handoff/approve execution flow.

## Acceptance Check
- Production diff should only include campaign-studio.js.
- All required node --check commands must pass.

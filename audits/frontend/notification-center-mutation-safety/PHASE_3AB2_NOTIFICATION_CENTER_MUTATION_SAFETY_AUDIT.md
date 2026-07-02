# PHASE 3AB.2 — Notification Center Mutation Safety Audit

## Status
Audit-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AB.1 — Notification Center Finalization Truth Audit`
- Previous commit: `7f616d9 Add Notification Center finalization truth audit`

## Source Truth
Notification Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `notificationCenterRoute`
- id: `notification-center`

## Purpose
Audit Notification Center mutation boundaries before any Notification Center patch or closeout.

3AB.1 confirmed Notification Center is not purely read-only:
- It refreshes notification-center projection.
- It filters/selects notifications locally.
- It routes to owning/source pages.
- It uses AI for guidance/context.
- It includes an active `Mark Read` backend mutation when `selectedItem.notification_id` exists.
- It contains disabled/deferred controls for acknowledge/resolve/dismiss/delete.

## Audit Questions
- Is Mark Read constrained to read status only?
- Does Mark Read require confirmation or is it low-risk enough without confirmation?
- Does backend PATCH allow broader notification mutation beyond read status?
- Are acknowledge/resolve/dismiss/delete disabled without handlers?
- Does Notification Center trigger any external send/email/message?
- Does Notification Center bypass Governance, Publishing, Queue Center, Task Center, or Job Monitor boundaries?
- Are AI actions guidance-only?

## Required Output
This phase must produce:
- Notification Center active action evidence.
- Notification API/backend route evidence.
- Cross-page notification/governance/publishing/job/task evidence.
- Action risk matrix.
- Recommended next phase.

## Safety Rules
- No Notification Center code changes.
- No operations-centers code changes.
- No API/backend changes.
- No CSS changes.
- No mutating notification action testing on real data.
- No destructive notification mutation testing.
- Do not enable disabled buttons.
- Do not broaden Mark Read behavior.
- Do not claim full Notification Center mutation safety until evidence is reviewed.

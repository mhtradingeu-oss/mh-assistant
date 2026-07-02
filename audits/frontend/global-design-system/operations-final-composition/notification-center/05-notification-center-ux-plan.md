# OPS-FINAL-5A — Notification Center UX Plan

## Status
Planned.

## Purpose
Improve Notification Center as a focused operational signals, inbox, and governance review surface without changing notification or governance behavior.

## Product Goal
Notification Center should answer:

1. What signals require attention?
2. Which notifications are critical, approvals, provider-related, or inbox items?
3. Which notification is selected?
4. What can be marked read safely?
5. Which Governance approval actions are available?
6. What can AI explain safely without resolving, dismissing, approving, rejecting, publishing, or executing anything automatically?

## Current Runtime Authority
Notification Center is rendered inside:

- `public/control-center/pages/operations-centers.js`

## Allowed Changes
- Improve Notification Center header wording.
- Add GDS classes to the top context ribbon and main sections.
- Improve non-mutating safety language.
- Improve copy around read-state and Governance decision boundaries.
- Improve scanability of selected notification/action/support/AI panels.
- Preserve all filters, table, selected notification, mark-read, governance, refresh, route, and AI prompt contracts.

## Forbidden Changes
- No backend changes.
- No API changes.
- No router changes.
- No notification delete behavior.
- No notification dismiss behavior.
- No notification resolve behavior.
- No mark-read behavior changes.
- No Governance decision behavior changes.
- No approval id changes.
- No filter ID changes.
- No `data-ops-focus` changes.
- No `data-ops-select` changes.
- No `data-ops-ai-*` changes.
- No `data-mark-read` changes.
- No `data-governance-*` changes.
- No route action changes.
- No table logic changes.
- No broad CSS rewrite.

## Required Runtime Contracts
Must preserve:

- `notificationCenterRefreshBtnHeader`
- `notificationCenterRefreshBtn`
- `notificationCenterSearch`
- `notificationCenterSeverity`
- `data-ops-focus`
- `data-ops-select`
- `data-ops-ai-open`
- `data-ops-ai-prompt`
- `data-ops-route`
- `data-mark-read`
- `data-governance-action`
- `data-governance-decision`
- `data-approval-id`

## Validation
- `node --check public/control-center/pages/operations-centers.js`
- Browser QA at:
  - `http://127.0.0.1:3000/control-center/#notification-center`

## Decision
Proceed with a narrow Notification Center shell/clarity patch only.

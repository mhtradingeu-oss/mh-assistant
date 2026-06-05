# OPS-FINAL-5 — Notification Center Audit Summary

## Status
Audit completed.

## Runtime Authority
Notification Center is rendered inside:

- `public/control-center/pages/operations-centers.js`

## Confirmed Runtime Contracts
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

## Current UX State
Notification Center is functionally strong but still needs controlled final UX alignment.

It includes:
- notification metrics
- runtime strip
- focus filters
- search and severity filter
- notification/alert table
- selected notification detail
- action panel
- mark-read read-state action
- governance refresh and decision actions
- provider/approval supporting signals
- AI review panel

## Main Risk
Any broad markup rewrite could break:
- notification filtering
- notification selection
- refresh behavior
- route actions
- AI prompt binding
- read-state updates
- Governance refresh
- Governance approval decisions
- approval id propagation
- provider/approval alert rendering
- error state rendering

## Recommended Strategy
Proceed with a narrow Notification Center GDS shell pass only.

Allowed:
- improve header and section wording
- add GDS classes to top shell/summary where safe
- improve copy around read-state and governance actions
- keep table, filters, selected notification, mark-read, and governance action contracts intact

Forbidden:
- no backend changes
- no API changes
- no router changes
- no notification delete/dismiss/resolve behavior
- no governance decision behavior changes
- no mark-read behavior changes
- no changing filter IDs
- no changing selection attributes
- no moving table logic
- no broad CSS rewrite

## Decision
Proceed to OPS-FINAL-5A Notification Center UX Plan before implementation.

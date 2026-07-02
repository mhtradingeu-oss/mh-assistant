# OPS-FINAL-4 — Job Monitor Audit Summary

## Status
Audit completed.

## Runtime Authority
Job Monitor is rendered inside:

- `public/control-center/pages/operations-centers.js`

## Confirmed Runtime Contracts
Must preserve:

- `jobMonitorRefreshBtnHeader`
- `jobMonitorRefreshBtn`
- `jobMonitorSearch`
- `jobMonitorKind`
- `data-ops-focus`
- `data-ops-select`
- `data-ops-ai-open`
- `data-ops-ai-prompt`
- `data-ops-route`

## Current UX State
Job Monitor is functionally strong but still needs controlled final UX alignment.

It includes:
- job health metrics
- runtime strip
- focus filters
- search and kind filter
- job table
- selected job detail
- action panel
- execution logs
- disabled future mutation actions
- AI review panel

## Main Risk
Any broad markup rewrite could break:
- job filtering
- job selection
- refresh behavior
- route actions
- AI prompt binding
- job health/status rendering
- error state rendering

## Recommended Strategy
Proceed with a narrow Job Monitor GDS shell pass only.

Allowed:
- improve header and section wording
- add GDS classes to top shell/summary where safe
- improve copy around non-mutating job actions
- keep table, filters, logs, and selected item behavior intact

Forbidden:
- no backend changes
- no API changes
- no router changes
- no job retry/cancel/rerun/delete behavior
- no worker execution behavior
- no changing filter IDs
- no changing selection attributes
- no moving table logic
- no broad CSS rewrite

## Decision
Proceed to OPS-FINAL-4A Job Monitor UX Plan before implementation.

# OPS-FINAL-4A — Job Monitor UX Plan

## Status
Planned.

## Purpose
Improve Job Monitor as a focused runtime execution monitoring surface without changing job behavior.

## Product Goal
Job Monitor should answer:

1. What is the current execution health?
2. Which jobs are running, completed, failed, or need review?
3. Which job is selected?
4. Where should the operator route next?
5. What can AI explain safely without retrying, canceling, rerunning, deleting, or triggering workers?

## Current Runtime Authority
Job Monitor is rendered inside:

- `public/control-center/pages/operations-centers.js`

## Allowed Changes
- Improve Job Monitor header wording.
- Add GDS classes to the top context ribbon and main sections.
- Improve non-mutating safety language.
- Improve scanability of selected job/action/log/AI panels.
- Preserve all filters, table, selected job, logs, refresh, route, and AI prompt contracts.

## Forbidden Changes
- No backend changes.
- No API changes.
- No router changes.
- No job retry behavior.
- No job cancel behavior.
- No job rerun behavior.
- No job delete behavior.
- No worker execution behavior.
- No filter ID changes.
- No `data-ops-focus` changes.
- No `data-ops-select` changes.
- No `data-ops-ai-*` changes.
- No route action changes.
- No table logic changes.
- No execution log logic changes.
- No broad CSS rewrite.

## Required Runtime Contracts
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

## Validation
- `node --check public/control-center/pages/operations-centers.js`
- Browser QA at:
  - `http://127.0.0.1:3000/control-center/#job-monitor`

## Decision
Proceed with a narrow Job Monitor shell/clarity patch only.

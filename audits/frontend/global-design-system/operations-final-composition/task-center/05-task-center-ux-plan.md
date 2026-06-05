# OPS-FINAL-2A — Task Center UX Plan

## Status
Planned.

## Purpose
Improve Task Center as a focused operational task review surface without changing task behavior.

## Product Goal
Task Center should answer:

1. How many tasks exist?
2. Which tasks are open, blocked, overdue, or due soon?
3. What should the operator review first?
4. Which task is selected?
5. What can AI explain safely without mutating tasks?

## Current Runtime Authority
Task Center is rendered inside:

- `public/control-center/pages/operations-centers.js`

## Allowed Changes
- Improve Task Center header wording.
- Add GDS classes to the top context ribbon and main sections.
- Improve non-mutating safety language.
- Improve scanability of the selected task/action/AI panels.
- Preserve all filters, table, selected task, copy, refresh, route, and AI prompt contracts.

## Forbidden Changes
- No backend changes.
- No API changes.
- No router changes.
- No task mutation behavior.
- No filter ID changes.
- No `data-ops-focus` changes.
- No `data-ops-select` changes.
- No `data-ops-ai-*` changes.
- No route action changes.
- No table logic changes.
- No broad CSS rewrite.

## Required Runtime Contracts
Must preserve:

- `taskCenterRefreshBtn`
- `taskCenterRefreshBtnRail`
- `taskCenterSearch`
- `taskCenterPriority`
- `taskCenterOwner`
- `taskCenterSource`
- `taskCenterCopySummaryBtn`
- `taskCenterCopyHandoffBtn`
- `taskCenterSummaryBuffer`
- `data-ops-focus`
- `data-ops-select`
- `data-ops-ai-open`
- `data-ops-ai-prompt`
- `data-ops-route`

## Validation
- `node --check public/control-center/pages/operations-centers.js`
- Browser QA at:
  - `http://127.0.0.1:3000/control-center/#task-center`

## Decision
Proceed with a narrow Task Center shell/clarity patch only.

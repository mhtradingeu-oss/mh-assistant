# Governance Decision Queue Polish

## Summary

This pass improves only the Decision queue area inside Governance.

The goal is to make focus tabs, the empty queue table, and queue container easier to scan without changing behavior.

## Files changed

- public/control-center/styles/12-pages.css
- audits/frontend/governance/GOVERNANCE_DECISION_QUEUE_POLISH.md

## What changed

- Decision queue focus tabs are styled as calm, readable filters.
- Active focus state is clearer.
- Queue table wrapper has a calmer card-like container.
- Empty table state is easier to read.
- All CSS is scoped under `[data-page="governance"]`.

## What was intentionally not changed

- No changes to governance.js.
- No changes to backend.
- No changes to data/projects.
- No changes to routes.
- No changes to handlers.
- No changes to API calls.
- No changes to IDs.
- No changes to data attributes.
- No changes to policy controls.
- No changes to Evidence / Intake styling.
- No changes to Publishing styling.

## Browser QA checklist

- [ ] Decision queue tabs are readable.
- [ ] Active tab is clear.
- [ ] Empty table state is visually calm.
- [ ] Focus tab clicks still work.
- [ ] No unrelated page styling changed.

## Recommended next step

After browser QA, either commit this small pass or revert it. Then proceed to Ownership and Governance Actions polish.

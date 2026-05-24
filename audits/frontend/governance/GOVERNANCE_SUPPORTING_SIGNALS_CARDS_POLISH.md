# Governance Supporting Signals Cards Polish

## Summary

This pass improves only the Supporting governance signals section.

The goal is to make governance signal counts and recent activity easier to scan as calm cards without changing page logic.

## Files changed

- public/control-center/styles/12-pages.css
- audits/frontend/governance/GOVERNANCE_SUPPORTING_SIGNALS_CARDS_POLISH.md

## What changed

- Governance signal metrics are displayed as clearer cards.
- Recent activity rows are styled as calm supporting signal items.
- Typography and spacing are improved for readability.
- All CSS is scoped to `[data-page="governance"] [aria-label="Supporting governance signals"]`.

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

- [ ] Supporting signals look like cards.
- [ ] Counts are readable.
- [ ] Recent activity is calmer and easier to scan.
- [ ] Evidence Summary styling remains intact.
- [ ] Incoming Review Context styling remains intact.
- [ ] No unrelated page styling changed.

## Recommended next step

After browser QA, either commit this small pass or revert it. Then proceed to the next focused Governance section.

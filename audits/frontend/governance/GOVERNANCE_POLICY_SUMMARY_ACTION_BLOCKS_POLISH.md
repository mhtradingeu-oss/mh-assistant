# Governance Policy Summary and Action Blocks Polish

## Summary

This pass improves only the remaining raw lower sections in Governance:
- Policy and rule summary
- Active rules
- Approval owners empty state
- Governance actions inner blocks
- Escalation chain inside the action panel

The goal is to finish the lower workspace visually without changing behavior.

## Files changed

- public/control-center/styles/12-pages.css
- audits/frontend/governance/GOVERNANCE_POLICY_SUMMARY_ACTION_BLOCKS_POLISH.md

## What changed

- Policy summary blocks are displayed as clearer cards.
- Active rules now have a readable label/value layout.
- Empty approval owners state is visually explained.
- Open policy signal keeps its existing information but sits inside a clearer block.
- Governance actions inner blocks are calmer and easier to scan.
- Escalation chain inside the action panel is formatted as readable rows.
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
- No changes to policy control behavior.
- No changes to decision queue behavior.
- No changes to Evidence / Intake styling.
- No changes to Publishing styling.

## Browser QA checklist

- [ ] Active rules are readable and not text-clumped.
- [ ] Enabled / Disabled values do not wrap badly.
- [ ] Approval owners empty state is understandable.
- [ ] Editable policy controls still work.
- [ ] Open policy signal remains readable.
- [ ] Governance actions remain usable.
- [ ] Escalation chain is easier to scan.
- [ ] No unrelated page styling changed.

## Recommended next step

After browser QA, commit this together with the ownership/actions polish if both are visually accepted.

## Final section polish notes

A final small CSS-only polish was added after full section review.

It improves:
- Current blockers and Safe execution path inside the executive header
- Approval owners empty-state visibility inside Policy and rule summary

No JavaScript, handlers, routes, backend files, data/projects files, IDs, data attributes, or API calls were changed.

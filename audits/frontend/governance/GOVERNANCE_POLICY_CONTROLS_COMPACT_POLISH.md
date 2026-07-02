# Governance Policy Controls Compact Polish

## Summary

This pass improves only the editable policy controls inside the Governance page.

The goal is to make the policy toggles and owner fields more compact, readable, and professional without changing any behavior.

## Files changed

- public/control-center/styles/12-pages.css
- audits/frontend/governance/GOVERNANCE_POLICY_CONTROLS_COMPACT_POLISH.md

## What changed

- Governance policy toggle rows are displayed in a cleaner two-column label/control layout.
- Oversized toggle visuals are hidden inside Governance only.
- Checkbox inputs are reduced to a compact size.
- Policy owner fields receive calmer spacing and input height.
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
- No changes to approval or destructive behavior.
- No changes to Evidence / Intake styling.
- No changes to Publishing styling.

## Browser QA checklist

- [ ] Editable policy controls are more compact.
- [ ] Checkboxes are not oversized.
- [ ] Labels remain readable.
- [ ] Policy owner fields remain usable.
- [ ] Save Governance Policy still works.
- [ ] Review & Sync Settings Rules still works.
- [ ] Evidence Summary styling remains intact.
- [ ] Incoming Review Context styling remains intact.

## Recommended next step

After browser QA, either commit this small pass or revert it. Do not add broader Governance CSS until this targeted change is verified.

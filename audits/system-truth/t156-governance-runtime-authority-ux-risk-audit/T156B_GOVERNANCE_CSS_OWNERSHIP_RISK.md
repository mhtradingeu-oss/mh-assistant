# T156B — Governance CSS Ownership Risk

## Status
Audit only. No implementation.

## Finding
Governance styling is currently concentrated inside:

- `public/control-center/styles/12-pages.css`

This file is already classified as a legacy/large page CSS zone and should not be expanded casually.

## Risk
Governance has many selectors inside `12-pages.css`, including:
- operating header
- evidence summary
- intake panel
- executive summary
- policy controls
- supporting signal cards
- decision queue
- ownership/action panels
- policy summary blocks
- final section polish

Because these rules are layered in a large legacy file, adding more Governance polish directly into `12-pages.css` increases:
- duplication risk
- cascade risk
- visual regression risk
- hidden override risk
- future extraction difficulty

## Decision
Do not add new Governance CSS to `12-pages.css` in the first Governance implementation pass.

## Preferred Future Strategy
Before any Governance UI polish:
1. Complete runtime/action classification.
2. Browser QA the current Governance page.
3. Decide whether to create a dedicated owner CSS file, for example:
   - `public/control-center/styles/09-governance.css`
   or another approved naming pattern.
4. If a new owner CSS file is introduced, it must be wired deliberately and tested.
5. Avoid deleting old Governance CSS until full route QA confirms no regression.

## Forbidden Until Decided
No `12-pages.css` expansion.
No `14-page-standard.css` expansion.
No random selector cleanup.
No broad CSS deletion.
No behavior or mutation changes.

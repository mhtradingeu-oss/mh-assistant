# T159 — Governance CSS Ownership Decision

## Status
Decision only. No implementation.

## Baseline
- `1b55c4d Define Governance UX contract`

## Purpose
Decide the safe CSS ownership strategy for Governance before any visual polish or refactor.

## Current Truth
Governance is already visually usable, but dense.

Current Governance styling is concentrated in:
- `public/control-center/styles/12-pages.css`

Governance also relies on shared/app styles and standard layout primitives.

## Problem
`12-pages.css` is a large legacy/page CSS zone and has already been classified as a do-not-expand area.

Adding more Governance CSS into `12-pages.css` would increase:
- cascade risk
- duplication risk
- visual regression risk
- hidden override risk
- future extraction difficulty

## Decision
Do not expand:
- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`

For future Governance polish, the preferred strategy is to introduce a dedicated Governance owner CSS file.

## Proposed Owner File
Preferred future owner file:

- `public/control-center/styles/09-governance.css`

## Important Constraint
Do not create or wire this file inside T159.

T159 is a decision-only phase. File creation/wiring must be a separate implementation phase with validation and Browser QA.

## Future Implementation Requirements
Before creating the owner file:
1. Confirm current stylesheet load order.
2. Add the new stylesheet deliberately to `public/control-center/index.html`.
3. Keep initial CSS minimal and page-scoped.
4. Do not delete existing Governance CSS from `12-pages.css`.
5. Use the new owner file only for additive, safe polish.
6. Validate syntax and route loading.
7. Browser QA the Governance route after wiring.

## First Safe Future Patch Candidate
If implementation is approved later, the first patch should be small and focused on one area only:

Option A:
- Governance decision queue readability

Option B:
- Evidence Summary missing-state readability

Option C:
- Governance action grouping / high-risk override emphasis

Do not patch all areas at once.

## Forbidden
No production JS change.
No backend change.
No API change.
No route behavior change.
No data/projects change.
No mutation behavior change.
No provider execution change.
No AI execution change.
No `12-pages.css` expansion.
No `14-page-standard.css` expansion.
No broad CSS deletion.
No random cleanup.

## Recommended Next Phase
Proceed to:

- `T160 — Governance CSS Owner Wiring Plan`

or, if we decide to postpone Governance visual polish:

- `T160 — AI Command Runtime Authority + AI Team UX Audit`

Recommended path:
- Create the Governance CSS owner wiring plan first.
- Then choose whether to implement it or move to AI Command.

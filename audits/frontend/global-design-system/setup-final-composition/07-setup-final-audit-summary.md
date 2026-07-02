# Setup Final UX Composition — Audit Summary

## Status
Audit completed.

## Confirmed Facts
- Setup is an active operational page, not a simple display page.
- Setup owns project foundation fields, local draft handling, backend save, AI guidance, readiness status, and handoff destinations.
- Runtime file:
  - `public/control-center/pages/setup.js`
- Setup reads from:
  - overview
  - readiness
  - integrations
  - assets
  - context
- Setup uses many required IDs and data attributes for runtime behavior.

## High-Risk Runtime Contracts
Must preserve:
- `setupProjectForm`
- `data-setup-field`
- `data-setup-step`
- `data-setup-step-panel`
- `data-setup-open-step`
- `data-setup-jump-field`
- save / draft / reset buttons
- AI helper buttons
- continue to Library / Integrations / Campaign buttons

## UX Problem
Setup is functionally strong but visually dense and wizard-dashboard-like.
It needs clearer hierarchy and better alignment with the new Global Design System without breaking the wizard.

## Design Direction
Setup should become a Foundation Readiness Operating Surface:
- explain what foundation is ready
- show what is missing
- guide the operator to the next safest action
- keep AI assistive, not autonomous
- preserve all forms and handlers

## Recommended Strategy
Do not rewrite Setup markup broadly.

Proceed with:
1. Setup Final UX Composition Plan.
2. Small shell/header/summary improvement.
3. Preserve wizard internals.
4. Browser QA before commit.

## Decision
Proceed to Setup Final UX Composition Plan before implementation.

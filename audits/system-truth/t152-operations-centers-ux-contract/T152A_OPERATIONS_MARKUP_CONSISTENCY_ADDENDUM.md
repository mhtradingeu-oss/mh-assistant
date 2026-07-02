# T152A — Operations Markup Consistency Addendum

## Status
Contract addendum only. No implementation.

## Baseline
- c78f1c9 Close frontend CSS foundation audit

## Finding
The Operations source snapshot shows that some surfaces already use the target operating-surface classes:

- `mhos-os-page`
- `mhos-os-header`
- `mhos-os-layout`
- `mhos-os-main`
- `mhos-os-rail`
- `mhos-os-section`
- `mhos-os-action-panel`
- `mhos-os-ai-panel`

However, Job Monitor and Notification Center include a markup consistency risk:

- `mhos-os-mainmhos-os-section`

Expected normalized class string:

- `mhos-os-main mhos-os-section`

## Risk
If the class separator is missing, CSS targeting `.mhos-os-section` may not apply correctly to those surfaces.

## Decision
Do not patch during T152.

Before T153 implementation, decide whether the smallest safe patch should include:
1. CSS-only polish in `09-operations-centers.css`, or
2. A minimal markup normalization in `operations-centers.js` to restore the missing class separator.

If option 2 is selected, it must be treated as a production JS patch and validated with:
- `node --check public/control-center/pages/operations-centers.js`
- Browser QA for all Operations routes

## Constraint
No behavior change is allowed.
No backend change is allowed.
No route change is allowed.
No action/mutation change is allowed.

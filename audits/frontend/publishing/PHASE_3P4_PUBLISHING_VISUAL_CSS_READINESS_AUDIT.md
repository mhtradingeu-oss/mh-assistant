# PHASE 3P.4 — Publishing Visual / CSS Readiness Audit

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: ee37896 Close Publishing safety phase

## Purpose
Assess whether Publishing needs a CSS/UX polish pass after safety closeout, without changing production code.

## Visual Observations To Verify
- Page is functionally complete.
- No obvious missing primary button after button/handler scan.
- Page is visually dense.
- Queue, Builder, Automation Preview, Readiness, Calendar, Results, Blockers, and Manual Controls compete for attention.
- Local draft actions are safe but may need clearer labels.
- CSS should not be patched without confirming ownership.

## Audit Questions
1. Are Publishing styles inline inside `publishing.js`, global CSS, or both?
2. Which CSS selectors own the current page?
3. Is there duplication or competing CSS?
4. Is the page usable without layout break?
5. Are buttons crowded or ambiguous?
6. Are local-only actions visually distinct enough from backend actions?
7. Is the right column too dense?
8. Is any action hidden below the fold or hard to find?
9. Can a CSS-only polish improve density without changing behavior?
10. Should patch happen now or be deferred to global UI finalization?

## Protected Behavior
- No JS behavior changes.
- No backend/API changes.
- No data changes.
- No safety gate changes.
- No new buttons.
- No text changes unless explicitly approved after audit.

## Decision Options
A) No visual patch needed now; move to next phase.
B) CSS-only density polish needed before Publishing closeout.
C) Copy/label clarity patch needed for local draft actions.
D) Defer to global UI finalization.
E) Deeper screenshot/browser QA required first.

## Recommended Next Step
Review scan evidence and choose one decision before any CSS patch.

# Home Final UX Composition — Density and Balance Audit

## Status
Audit planned after HOME-FINAL-1 acceptance.

## Current State
HOME-FINAL-1 successfully transformed Home into an Executive AI Operating Surface.

## Observed Follow-up
Browser QA showed that the page is significantly clearer, but the lower main column has visible empty vertical space because:
- right rail content is taller than main content
- main details are collapsed by default
- spacing between lower sections may be too generous
- the final Recent Activity section sits low after large whitespace

## Goal
Improve visual balance without changing the information architecture.

## Allowed
- Small CSS/layout density polish.
- Adjust spacing in GDS primitives if safe.
- Add page-specific class only if necessary.
- Keep details collapsed.
- Keep Home composition unchanged unless a small wrapper is needed.

## Forbidden
- No backend changes.
- No API changes.
- No handler changes.
- No route changes.
- No broad CSS rewrite.
- No reverting HOME-FINAL-1 composition.
- No adding technical dashboard blocks back to the first screen.

## Proposed Fix Direction
Prefer a small Home-specific density patch or a safe primitive adjustment:
- reduce excess vertical gap under the main column
- make the right rail sticky or visually contained if appropriate
- allow the Recent Activity panel to sit closer to System Details
- avoid making the first screen crowded again

## Decision
Proceed only after reviewing current CSS selectors and browser layout.

# Setup Final UX Composition — Clarity and Density Audit

## Status
Audit phase after SETUP-FINAL-1 acceptance.

## Current State
SETUP-FINAL-1 improved Setup as a Foundation Readiness Operating Surface while preserving wizard behavior.

## Browser QA Observations
- Header and summary are clearer.
- Setup wizard remains intact.
- Save Setup remains available.
- AI remains assistive only.
- Page is still long and dense because Setup owns many operational controls.
- Dependencies count may confuse users because it includes readiness diagnostics, not only assets/connectors.
- System blockers may show duplicate labels from readiness signals.
- Lower handoff and AI sections are functional but can be more scannable.

## Recommended Safe Fixes
1. Rename or clarify dependency summary:
   - from `Dependencies`
   - to `Readiness signals`
   - hint should explain it includes assets, connectors, and diagnostics.

2. Deduplicate displayed system blocker labels in Setup UI only.
   - Do not change backend data.
   - Do not change readiness source data.
   - Only dedupe render list for visual clarity.

3. Improve lower page scanability later.
   - Do not rewrite handoff layout in this pass unless needed.

## Forbidden
- No backend changes.
- No API changes.
- No router changes.
- No save/draft changes.
- No data contract changes.
- No broad wizard rewrite.
- No removing IDs or data attributes.

## Decision
Proceed with a small clarity patch only if it can be done in `setup.js` without changing runtime contracts.

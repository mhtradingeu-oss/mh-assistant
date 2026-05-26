# PHASE 3P.5 — Publishing CSS Density Polish Plan

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: fa97031 Add Publishing visual CSS readiness audit

## Decision
Proceed with a small CSS-only density polish before moving to the next system phase.

## CSS Ownership Decision
- Use `renderScopedStyles()` inside `public/control-center/pages/publishing.js`.
- Do not edit global `public/control-center/styles/12-pages.css` in this phase.
- Reason: `renderScopedStyles()` owns Publishing internal layout, queue rows, action rows, form actions, cards, and calendar/list spacing.
- Global CSS currently owns command header, workflow strip, readiness summary, automation preview, and past schedule warning.

## Allowed Changes
- CSS-only inside `renderScopedStyles()`.
- Spacing / gap / padding / min-height / line-height / button wrapping.
- Queue row density improvements.
- Action row readability.
- Side column density improvements.

## Forbidden Changes
- No JS behavior changes.
- No backend/API changes.
- No data changes.
- No safety gate changes.
- No button additions/removals.
- No text changes.
- No edits to `12-pages.css` unless a later audit approves it.

## Browser QA Required
- Publishing page opens.
- No console errors.
- Buttons remain visible.
- Queue actions remain accessible.
- Builder actions remain accessible.
- Manual execution controls remain visible.
- Side column remains readable.
- No clipping/overflow.
- Safety confirmations still work.
- Asset blocker guard still works.

## Expected Next Step
Apply a minimal CSS-only patch inside `renderScopedStyles()`.

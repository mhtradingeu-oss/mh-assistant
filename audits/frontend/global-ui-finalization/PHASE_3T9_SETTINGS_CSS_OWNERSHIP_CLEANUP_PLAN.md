# PHASE 3T.9 — Settings CSS Ownership Cleanup Plan

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: d6d88fb Add Settings CSS and AI workforce ownership audit

## Purpose
Create a safe cleanup plan for Settings CSS ownership before any production CSS edit.

## Why This Exists
Phase 3T.8 confirmed Settings is a `hybrid_css_owned` page and that most Settings CSS is owned by `public/control-center/styles/12-pages.css`.

The scan confirmed repeated dense Settings CSS blocks inside `12-pages.css`.

This plan identifies the safest cleanup strategy without changing production CSS yet.

## Evidence Summary

### Block 1 summary
The first Settings block starts around the `SETTINGS OPERATING SURFACE VISUAL BINDING` marker.

It defines the base Settings visual system:

- page surface grid
- workspace grid
- main stack and right rail
- overview, summary, actions, AI assistant, sections
- settings section base cards
- group blocks
- field blocks
- controls and textareas
- choice cards
- checklists and chips
- toggles
- role matrix
- overview and summary cards
- risk panel
- action rows
- toolbar
- AI assistant panel
- responsive behavior

This block acts as the **base visual binding** for Settings.

### Block 2 summary
The second Settings block starts around the `SETTINGS OPERATING SURFACE VISUAL BINDING + DENSITY POLISH` marker.

It overrides and tightens many of the same selectors from Block 1:

- smaller gaps
- reduced padding
- tighter typography
- adjusted grid ratios
- compact fields
- compact toggles
- compact role cards
- compact overview cards
- refined risk panel spacing
- refined action rows and toolbar buttons
- added quick action button treatment
- additional Governance policy block styling inside Settings

This block acts as the **density / compactness polish layer**.

### Duplicated selectors
The scan confirmed repeated selectors for key Settings elements, including:

- `.settings-page-surface`
- `.settings-workspace-grid`
- `.settings-main-stack`
- `.settings-right-rail`
- `.settings-section`
- `.settings-group-grid`
- `.settings-group-block`
- `.settings-group-head`
- `.settings-section-copy`
- `.settings-section-meta`
- `.settings-badge`
- `.settings-fields-grid`
- `.settings-field-block`
- `.settings-field-label`
- `.settings-control`
- `.settings-textarea`
- `.settings-choice-grid`
- `.settings-choice-card`
- `.settings-choice-card-body`
- `.settings-checklist`
- `.settings-chip`
- `.settings-toggle`
- `.settings-toggle-pill`
- `.settings-role-matrix`
- `.settings-role-card`
- `.settings-overview-item`
- `.settings-risk-panel`
- `.settings-actions-buttons`
- `.settings-toolbar`
- `.settings-ai-assistant`

The frequency scan showed high repetition, especially for right rail, workspace grid, toolbar, overview grid, action buttons, controls, choice grid, and AI assistant.

### JS class usage
Settings JS uses the expected Settings classes for:

- page surface
- workspace grid
- main stack
- right rail
- overview
- summary
- actions
- AI assistant
- sections
- grouped sections
- fields
- choice cards
- toggles
- role matrix
- risk panel
- toolbar
- data-settings actions
- AI prompt buttons

This means CSS cleanup must preserve all current class names.

### CSS-only / unused-risk classes
The scan indicates most CSS classes are backed by JS markup.

Some classes are more styling-oriented or shared-context dependent and should be handled carefully:

- `.quick-action-btn`
- `.simple-banner`
- `.governance-policy-block`
- `.governance-rule-list`
- `.governance-rule-item`

These appear intentionally reused inside Settings and should not be removed during the first cleanup pass.

## Canonical Ownership Decision
Settings CSS remains owned by:

- `public/control-center/styles/12-pages.css`

Do not extract Settings CSS into a new file in this phase.

Canonical structure should be:

1. one base Settings block
2. one clearly labeled density/compactness block only if needed
3. no accidental third polish layer
4. no JS changes
5. no route changes

## Cleanup Strategy
Use a conservative CSS-only cleanup later.

The future patch should:

1. Preserve visual behavior.
2. Keep all selectors needed by `settings.js`.
3. Merge exact duplicate rules where safe.
4. Avoid changing spacing or sizing unless already defined by the density layer.
5. Keep the density layer only where it intentionally overrides base values.
6. Add comments that clearly mark:
   - Settings base visual binding
   - Settings density refinement
7. Do not remove Governance-related styling used inside Settings unless verified in browser.
8. Run Browser QA after the patch.

## Decision
**C) Consolidate duplicate selectors in `12-pages.css` with a CSS-only patch.**

No production CSS change should happen in this phase.

## Recommended Next Step
Proceed to:

**PHASE 3T.10 — Settings CSS Cleanup Patch Plan + Browser QA Checklist**

Purpose:
- create an exact patch plan
- define the selectors allowed to merge
- define selectors forbidden to remove
- prepare browser QA checklist before applying any CSS edit

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Do not turn Settings into daily AI execution.
- Preserve Settings as configuration authority only.
- Preserve backend-governed save confirmation.
- Preserve Governance handoff.
- Preserve AI guidance as review-only/context-only.

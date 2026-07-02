# Settings Visual Binding and Form Polish Audit

## Summary
- Audit mode executed with no production code changes.
- The Settings page has adopted outer operating-surface classes (`std-*`, partial `mhos-clean-*`) but most inner Settings classes are markup-only and have no CSS ownership.
- Result: cards and rails look improved, while form groups, fields, toggles, choice cards, and section internals render with generic fallback styles, causing a basic/legacy visual appearance.
- Smallest safe fix is a page-scoped CSS-only patch in `12-pages.css` (or equivalent settings-scoped stylesheet) that binds existing `settings-*` classes to the current global token system.

## Files Inspected
- `public/control-center/pages/settings.js`
- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/styles/15-clean-operating-layer.css`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/00-tokens.css`
- `public/control-center/index.html` (for stylesheet load order verification)

## Current Visual Problem
- The page shell, right rail, and major panels are visually modernized by `std-detail-card`, `std-action-panel`, `std-ai-panel`, `std-main-column`, and `std-right-rail`.
- Inner Settings UI remains visually basic because key selectors in the DOM (group blocks, field blocks, labels, controls, choice cards, toggles, summary grids) are not styled.
- Because missing selectors fall back to base element/component defaults, form controls appear generic and section hierarchy/spacing lacks a modern operating-surface rhythm.

## Selector Ownership Map

### A) New Settings selectors present in markup but not defined in inspected CSS
- `settings-page-surface`
- `settings-workspace-grid`
- `settings-main-stack` (markup present, style effectively inherited from `std-main-column`)
- `settings-right-rail` (markup present, style effectively inherited from `std-right-rail`)
- `settings-section`
- `settings-group-grid`
- `settings-group-block`
- `settings-field-block`
- `settings-field-label`
- `settings-control`
- `settings-textarea`
- `settings-choice-card`
- `settings-toggle`
- `settings-toggle-pill`
- `settings-risk-panel`
- `settings-overview`
- `settings-summary`
- `settings-actions`
- `settings-ai-assistant`

Observation: `rg` scan over `public/control-center/styles` returns no `settings-*` CSS selectors.

### B) Selectors currently driving visible layout/surface on Settings
- From `14-page-standard.css`:
  - `std-main-column`
  - `std-right-rail`
  - `std-detail-card`
  - `std-action-panel`
  - `std-ai-panel`
  - `std-action-row`
  - `std-quick-actions`
- From `15-clean-operating-layer.css` (opt-in and low specificity `:where(...)`):
  - `mhos-clean-stack`
  - `mhos-clean-surface`
- From `08-components-foundation.css` (generic fallback):
  - `.panel`, `.data-card`, `.panel-header`, `.btn`, `.quick-action-btn`
  - `input`, `select`, `textarea` element-level form styling
  - `.simple-list`, `.simple-banner`

### C) Borrowed classes in Settings markup with no matching definitions in inspected CSS
- `governance-rule-list`
- `governance-rule-item`
- `governance-policy-block`

Effect: these blocks render as mostly unstyled containers except for nested content that happens to match other generic classes.

## Why The Page Still Looks Basic
1. Settings class binding gap:
   - The new Settings DOM is rich (`settings-*` classes), but those selectors are not implemented in CSS.
2. Generic fallback dominates:
   - Inputs/selects/textareas are styled only by broad global rules in `08-components-foundation.css`.
   - Without `settings-control`, `settings-toggle`, and `settings-choice-card` definitions, controls look legacy/basic.
3. Outer shell only modernization:
   - `std-*` and partial `mhos-clean-*` improve containers, not inner form composition.
4. Missing local typography hierarchy:
   - Tokens provide typography scale variables, but Settings internals do not bind custom heading/label/meta rhythm to these classes.
5. Missing section/grid structure styles:
   - No styles for `settings-group-grid`, `settings-fields-grid`, `settings-group-block`, etc., so spacing and card rhythm remain default.

## CSS Conflict and Override Findings
- Stylesheet order from `index.html`:
  1. `00-tokens.css`
  2. `08-components-foundation.css`
  3. `12-pages.css`
  4. `14-page-standard.css`
  5. `15-clean-operating-layer.css`
- No direct override conflict found for `settings-*` selectors because they do not exist.
- Actual behavior is fallback, not override:
  - Generic element/component rules from `08-components-foundation.css` define most inner visuals.
  - `std-*` classes shape only major shell/panel surfaces.
  - `mhos-clean-*` uses `:where(...)` (specificity zero), so it does not enforce inner form polish unless explicitly bound by class usage and complementary selectors.
- Result: global visual system is not being overridden; it is only partially applied due to missing Settings-specific bindings.

## Font Styling Source Assessment
- `00-tokens.css` defines typography tokens (size, line-height, weight), not page-specific typographic composition.
- `08-components-foundation.css` and `14-page-standard.css` consume tokens for shared components and standard panels.
- In Settings internals, no page-specific `settings-*` typography selectors exist; therefore text styling is mostly inherited from generic component/element styles.
- Conclusion: typography issue is not token absence; it is missing Settings-specific selector bindings to existing tokenized scales.

## Recommended CSS-Only Patch (Safe, Minimal)

Scope:
- CSS only.
- No JS, backend, data, or inline style changes.
- Page-scoped selectors to avoid cross-page regressions.

Target file:
- `public/control-center/styles/12-pages.css` (preferred for page-specific styling)

Patch strategy:
1. Add a Settings-scoped block rooted at `[data-page="settings"]`.
2. Bind missing layout selectors:
   - `settings-page-surface`, `settings-workspace-grid`, `settings-group-grid`, `settings-fields-grid`.
3. Bind missing section/surface selectors:
   - `settings-section`, `settings-group-block`, `settings-risk-panel`, `settings-summary-grid`.
4. Bind form polish selectors:
   - `settings-field-block`, `settings-field-label`, `settings-control`, `settings-textarea`.
5. Bind interaction controls:
   - `settings-choice-card` (+ checked/focus states)
   - `settings-toggle`, `settings-toggle-pill`, `.settings-toggle-input:checked + .settings-toggle-pill` (or equivalent sibling chain)
6. Bridge borrowed blocks used by Settings markup:
   - `[data-page="settings"] .governance-rule-list`
   - `[data-page="settings"] .governance-rule-item`
   - `[data-page="settings"] .governance-policy-block`
7. Keep visual language tokenized:
   - Use `--surface-*`, `--border-*`, `--text-*`, `--font-size-*`, `--line-height-*`, `--radius-*`, `--space-*`.
8. Preserve existing `std-*` and `mhos-clean-*` behavior:
   - Only additive page-scoped rules, no global selector rewrites.

Suggested minimal selector set for implementation:
- `[data-page="settings"] .settings-workspace-grid`
- `[data-page="settings"] .settings-section`
- `[data-page="settings"] .settings-group-grid`
- `[data-page="settings"] .settings-group-block`
- `[data-page="settings"] .settings-fields-grid`
- `[data-page="settings"] .settings-field-block`
- `[data-page="settings"] .settings-field-label`
- `[data-page="settings"] .settings-control`
- `[data-page="settings"] .settings-textarea`
- `[data-page="settings"] .settings-choice-grid`
- `[data-page="settings"] .settings-choice-card`
- `[data-page="settings"] .settings-toggle`
- `[data-page="settings"] .settings-toggle-pill`
- `[data-page="settings"] .settings-risk-panel`
- `[data-page="settings"] .settings-overview-grid`
- `[data-page="settings"] .settings-summary-grid`
- `[data-page="settings"] .settings-actions-buttons`
- `[data-page="settings"] .settings-ai-assistant`
- `[data-page="settings"] .governance-rule-list`
- `[data-page="settings"] .governance-rule-item`
- `[data-page="settings"] .governance-policy-block`

## Risks
- Low risk when fully page-scoped to `[data-page="settings"]`.
- Medium risk if generic selectors are introduced (could affect Governance/Home/other pages).
- Toggle/radio visual regressions possible if checked/focus states are not explicitly defined and tested.
- Responsive regressions possible on narrow widths if field grids are not collapsed with media queries.

## Browser QA Checklist
1. Open Settings page and verify two-column desktop layout plus right rail spacing.
2. Verify each grouped section has distinct block surfaces, spacing, and readable hierarchy.
3. Verify all input/select/textarea controls use polished field styling (idle, hover, focus, disabled).
4. Verify radio choice cards show selected and focus-visible states.
5. Verify toggle pills animate/transition correctly and reflect checked state accurately.
6. Verify risk panel, summary grid, and governance-like sub-blocks are styled (not plain fallback).
7. Verify action rows and quick actions remain aligned and readable.
8. Verify responsive behavior at ~1280px, ~900px, and ~760px breakpoints.
9. Verify no styling regressions on Governance and Home pages after patch.
10. Run syntax/lint checks for CSS if available.

## Rollback Path
1. Keep the patch isolated in a single Settings-scoped block.
2. If regression occurs, remove or comment only that new block in `12-pages.css`.
3. Re-test Settings and neighboring pages (Governance/Home) to confirm baseline restoration.

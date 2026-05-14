# Global Visual Density and Hierarchy Correction Patch

## Summary

This patch applies a conservative shared CSS-only density correction to the Control Center surface system. It reduces duplicate visual weight between the legacy foundation card layer and the standard-page premium surface layer without deleting selectors, changing markup, or touching page-local JS.

The correction stays focused on shared primitives:

- soften legacy `.card`, `.panel`, and `.data-card` treatment in the foundation layer
- reduce standard-page surface bulk in the later active `std-*` block
- make shared quick actions and standard action groups wrap safely
- slightly lower page-shell header dominance without redesigning page shells

## Changed files

Modified:

- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/14-page-standard.css`

Reviewed but not changed:

- `public/control-center/styles/15-clean-operating-layer.css`

Created:

- `audits/frontend/global-ui/GLOBAL_VISUAL_DENSITY_HIERARCHY_CORRECTION_PATCH.md`

## Audit findings addressed

This patch addresses these findings from the global audit:

- shared panel and card weight was being applied in both foundation and standard layers
- `14-page-standard.css` later active `std-*` surface rules were still visually heavy even where they were the intended owner
- shared quick action buttons were still biased toward nowrap, pill-like behavior
- shared badges and support banners still read too much like mini-cards or primary hierarchy anchors
- page-shell ribbons and standard action groups were stronger than necessary for dense operational pages

This patch does not attempt to solve page-specific missing bindings on AI Command, Publishing, Governance, or Setup.

## Global density corrections made

### Foundation corrections in `08-components-foundation.css`

- reduced shared `.card`, `.panel`, `.data-card`, and related surface padding from `14px` to `13px`
- softened foundation borders from the generic primary border to a lower-contrast explicit rgba border
- replaced the heavier inherited card shadow with a smaller explicit surface shadow
- added a dedicated `.quick-action-btn` override for compact multi-line wrapping behavior
- tightened `.panel-header` alignment and heading scale
- reduced uppercase helper weight and spacing slightly
- compacted `.card-badge` sizing and allowed safe wrapping
- flattened `.simple-banner` into a lighter support surface

### Standard-layer corrections in `14-page-standard.css`

- reduced `.std-context-ribbon` gap, padding, radius, border weight, and shadow depth
- lowered `.std-context-title` weight and scale slightly
- changed `.std-context-description` from forced single-line truncation to normal wrapped body copy
- made `.std-context-btn` compact and wrap-safe instead of pill-like nowrap
- reduced generic `.page .card` and `.page .panel` recovery radius and contrast slightly
- softened the later active `--std-*` surface tokens and shadow variables
- reduced later active `.std-detail-card`, `.std-action-panel`, and `.std-ai-panel` padding and radius
- aligned action and AI hover depth to the lighter shared hover shadow
- added `min-width: 0` where needed for `.std-action-row` and `.std-quick-actions`
- made standard action buttons and quick actions wrap-safe with `white-space: normal` and `overflow-wrap: anywhere`
- reduced standard quick-action button height from `40px` to `36px`

## Typography hierarchy decisions

The patch lowers shared emphasis without redesigning page-specific type systems.

- `.panel-header h3` and related shared headings were reduced from `15px` to `14px` with a controlled line-height
- shared eyebrow/helper labels now use `700` instead of `800` weight and slightly less tracking
- `.card-badge` moved from `11px` / `800` to `10px` / `700`
- `.std-context-title` was reduced from the previous heavier title weight to a slightly calmer title treatment
- `.std-context-description` now behaves like supporting paragraph copy instead of a banner label

## Card/panel hierarchy decisions

The patch keeps page-level surfaces present, but makes nested and section-level surfaces lighter.

- foundation cards and panels still exist and still read as surfaces, but with less depth and slightly tighter spacing
- standard detail, action, and AI panels keep distinct borders and backgrounds, but no longer add the same level of bulk on top of foundation surfaces
- hover states still communicate interactivity, but the action and AI variants now use the lighter shared hover shadow instead of deeper custom values
- generic page recovery cards were not removed, but their radius and contrast were reduced so they do less re-inflation

## Button/action wrapping decisions

The patch favors safe wrapping across shared controls rather than continuing page-local fixes.

- `.quick-action-btn` now supports multi-line content, uses compact vertical padding, and wraps long labels safely
- `.std-context-btn` now uses compact padding, a standard rounded rectangle, and safe wrapping
- `.std-action-row` and `.std-quick-actions` children now allow wrapped text and `overflow-wrap: anywhere`
- responsive flex behavior was extended so standard context actions and quick actions remain usable on narrow widths

## What was intentionally not changed

- no page JS files were modified
- no page markup was modified
- no backend files were modified
- no `data/projects` files were modified
- no `public/control-center/styles/12-pages.css` changes were made
- no `public/control-center/styles/09-operations-centers.css` changes were made
- no `public/control-center/styles/integrations/*.css` changes were made
- no selectors were deleted
- no `!important` rules were added
- no IDs were added
- `public/control-center/styles/15-clean-operating-layer.css` was left unchanged to keep the correction conservative and avoid shifting the opt-in `mhos-clean-*` language during this pass
- no AI Command missing-binding work was attempted
- no Publishing inline CSS work was attempted

## Page-specific follow-ups still required

These follow-ups remain necessary after this shared correction:

- AI Command still needs explicit `aicmd-*` bindings in a dedicated page pass
- Publishing still needs reconciliation of inline CSS into canonical stylesheet ownership in a later page-specific pass
- Setup still needs a dedicated hierarchy pass to reduce stacked equal-weight cards
- Governance still needs dedicated governance selector bindings
- Operations pages should receive a regression review after browser QA to confirm local compacting still wins over the lighter shared layers

## Validation completed

Validation was run after the CSS patch.

Command results:

- `git status --short`: only the two allowed CSS files are modified by this patch; unrelated untracked files already present in the workspace remain untouched
- `node --check public/control-center/app.js`: passed
- `node --check public/control-center/router.js`: passed
- `node --check public/control-center/pages/settings.js`: passed
- `node --check public/control-center/pages/governance.js`: passed
- `node --check public/control-center/pages/setup.js`: passed
- `node --check public/control-center/pages/ai-command.js`: passed
- `node --check public/control-center/pages/publishing.js`: passed
- `node --check public/control-center/pages/operations-centers.js`: passed
- selector grep for `08-components-foundation.css`: confirmed touched selectors remain present and intact
- selector grep for `14-page-standard.css`: confirmed both the early and later `std-*` blocks remain present, with the later active block tuned rather than deleted
- selector grep for `15-clean-operating-layer.css`: confirmed `mhos-clean-*` selectors remain available and unchanged
- forbidden pattern grep: returned existing pre-existing matches in shared CSS, but no new forbidden selectors or `!important` additions were introduced by this patch
- `git diff --stat`: `08-components-foundation.css` and `14-page-standard.css` only; `15-clean-operating-layer.css` unchanged

Diff summary from validation:

- `public/control-center/styles/08-components-foundation.css`: 53 changed lines in the patch diff excerpt
- `public/control-center/styles/14-page-standard.css`: 109 changed lines in the patch diff excerpt
- total diff stat: 108 insertions, 54 deletions across 2 files

## Browser QA checklist

Use browser QA to confirm the shared correction without reopening page-specific scope.

1. Verify shared `.panel` and `.data-card` surfaces feel lighter across Settings, Governance, Job Monitor, Setup, AI Command, and Publishing.
2. Verify page-shell ribbons still read as page context, but no longer overpower the main work surface.
3. Verify `.quick-action-btn` labels wrap correctly at narrow widths and with long copy.
4. Verify `.std-context-btn`, `.std-action-row`, and `.std-quick-actions` remain readable and clickable on mobile widths.
5. Verify `.card-badge` remains legible but no longer dominates hierarchy.
6. Verify `.simple-banner` reads as supporting guidance instead of a small card.
7. Verify Settings still feels stable after the global shared-layer change.
8. Verify Governance still preserves distinction between detail, action, and AI sections.
9. Verify operations-center compactness still wins over the lighter shared panel layer.
10. Verify Setup, AI Command, and Publishing do not visually break even though their page-specific follow-up work remains out of scope.
11. Verify hover and focus states remain visible after shadow reduction.
12. Verify there is no clipped text caused by wrapping changes in shared action buttons.

## Rollback path

Rollback should remain narrow and file-scoped.

- revert only `public/control-center/styles/08-components-foundation.css` if the shared legacy surface layer proves too light
- revert only `public/control-center/styles/14-page-standard.css` if standard-page surfaces or context ribbons regress
- if only action wrapping causes regressions, revert the button/action blocks instead of reverting the full files
- do not revert page-local CSS because no page-local files were changed in this patch

## Explicit no-JS/no-backend/no-data statement

This patch is CSS-only.

- No JS files were modified.
- No backend files were modified.
- No data files were modified.
- No page markup or HTML was modified.
- No behavior changes were intentionally introduced.

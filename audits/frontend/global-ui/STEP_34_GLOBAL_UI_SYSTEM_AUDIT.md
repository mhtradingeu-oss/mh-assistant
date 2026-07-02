# STEP 34 - Global UI System Audit

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: AUDIT ONLY / documentation-only

---

## Executive Summary

This audit confirms the current global UI system is active, modular, and load-order driven from `index.html`, with a clear shell/sidebar/topbar/command/AI-dock structure.

Primary finding:
- The active CSS stack is no longer a single `styles.css` file. Runtime styling is provided by ordered files under `public/control-center/styles/`.

Primary risk:
- CSS ownership boundaries are blurred because globally loaded files (`12-pages.css`, `14-page-standard.css`, `09-operations-centers.css`) contain substantial page-scoped and recovery/override rules, which increases duplication, responsive drift risk, and maintenance entropy.

Decision:
- Do not patch CSS yet.
- Proceed to STEP 35 Final Design Direction and Tokens Plan before any clean-layer implementation.

---

## Files Inspected

Core frontend runtime files:
- `public/control-center/index.html`
- `public/control-center/styles.css` (not present; classified as non-active path)
- `public/control-center/app.js`
- `public/control-center/router.js`
- `public/control-center/ui/page-standard.js`

Active CSS directories/files reviewed:
- `public/control-center/styles/00-tokens.css`
- `public/control-center/styles/01-reset.css`
- `public/control-center/styles/02-layer-system.css`
- `public/control-center/styles/03-app-shell.css`
- `public/control-center/styles/04-command-layer.css`
- `public/control-center/styles/05-ai-layer.css`
- `public/control-center/styles/07-sidebar.css`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/09-operations-centers.css`
- `public/control-center/styles/10-topbar-canonical.css`
- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/13-home-executive.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/styles/integrations/*.css`

Legacy classification scan targets:
- `public/control-center/legacy/*.legacy.css`
- `public/control-center/legacy/*.legacy.js`

---

## Active CSS Stack

Active styles are linked directly in `public/control-center/index.html` in this order:

1. `./styles/00-tokens.css`
2. `./styles/01-reset.css`
3. `./styles/02-layer-system.css`
4. `./styles/03-app-shell.css`
5. `./styles/07-sidebar.css`
6. `./styles/10-topbar-canonical.css`
7. `./styles/04-command-layer.css`
8. `./styles/05-ai-layer.css`
9. `./styles/08-components-foundation.css`
10. `./styles/09-operations-centers.css`
11. `./styles/12-pages.css`
12. `./styles/13-home-executive.css`
13. `./styles/14-page-standard.css`

Important classification:
- `public/control-center/styles.css` is not loaded and is not present as an active runtime stylesheet.
- Runtime JS is loaded by:
  - `./runtime/command-runtime.js`
  - `./app.js` (module)

---

## Legacy CSS/JS Classification

Legacy files found under `public/control-center/legacy/`:
- `06-topbar.legacy.css`
- `09-command-legacy-isolation.legacy.css`
- `11-runtime-safety-overrides.legacy.css`
- `99-legacy-compat.legacy.css`
- `styles.legacy-20260508.css`
- `styles.legacy-full.css`
- `integrations.monolith-20260508.js`
- `page-standard.legacy-20260508.js`

Classification:
- Current runtime active: none of the above are directly linked from `index.html`.
- Operational risk status: retain as legacy reference/fallback until clean-layer validation and rollout complete.
- Removal status: not eligible for deletion at this step.

---

## Current Global Layout Primitives

### Shell
- `03-app-shell.css` defines viewport lock, grid shell, main-shell rows, and workspace scrolling.

### Sidebar
- `07-sidebar.css` defines fixed/sticky desktop sidebar, mobile slide-in behavior, nav groups/items, and sidebar backdrop.

### Topbar/Header
- `10-topbar-canonical.css` defines topbar grid, page context/title, workspace chip, exec action cluster, and compact mobile transforms.

### Workspace/Main
- `03-app-shell.css` defines `.workspace` container behavior, padding, overflow, and scrollbars.

### Cards/Panels
- `08-components-foundation.css` defines shared `.card`, `.panel`, metric/status cards, and panel headers.
- Additional page-level panel overrides appear in `09-operations-centers.css`, `12-pages.css`, and `14-page-standard.css`.

### Buttons
- `08-components-foundation.css` defines base `.btn` plus variants (`primary`, `secondary`, `ghost`, `danger`, `warning`, `sm`).
- Page-level button overrides exist in page-scoped files and component sections.

### Status Badges
- `08-components-foundation.css` defines badge/card-badge primitives with success/warning/danger/neutral variants.

### AI Dock / Command Layer
- `05-ai-layer.css` defines dock shell, toggle, panel, suggestion/actions, and mobile behavior.
- `04-command-layer.css` defines command bar, command backdrop, command toggle states, and mobile command layout.

### Overlays/Loading/Errors
- `02-layer-system.css` defines z-layer tokens and global overlay/message/error/fatal/startup surfaces.
- Includes loading overlay hardening and startup trace/unlock behavior layers.

---

## Current Button/Card/Panel System

System state:
- A strong base component layer exists in `08-components-foundation.css`.
- Later files re-style or override component primitives for page experiences and recovery blocks.

Audit concern:
- Shared primitives and page-specific intent are partially mixed in globally loaded files, making ownership less explicit.

Examples of ownership mixing:
- `14-page-standard.css` includes broad generic recovery rules for `.page .card/.panel` plus large library-specific canonical blocks.
- `09-operations-centers.css` contains extensive per-page panel/button/context refinements for task/queue/job/notification pages.

---

## Typography and Spacing Risks

### Duplicate Font-Size Usage

Risk:
- Frequent direct `font-size` declarations across multiple files (including 8px/9px/11px/12px/13px/14px/15px/24px and rem values) indicate partial token bypass.

Impact:
- Typography rhythm inconsistency between global primitives and page-level overrides.

### Excessive Card/Panel Density and Padding Drift

Risk:
- Core components use one padding/border-radius baseline, while page-level overrides redefine card/panel dimensions and spacing.

Impact:
- Inconsistent perceived density and visual weight between pages.

### Zoom Feeling / Scale Compression

Risk:
- Mixed compact and oversized scales coexist (for example very small helper/kicker values and large metric/headline values) without a single cross-page scale contract.

Impact:
- Some pages can feel over-compressed while others feel enlarged, depending on override layers.

### Inconsistent Button Sizes

Risk:
- Base button heights coexist with route/mobile-specific button transforms and pseudo-label replacements.

Impact:
- Touch target and label consistency can vary by context.

### Repeated Page-Specific Overrides

Risk:
- Many page-scoped overrides are located in globally loaded CSS files.

Impact:
- Harder predictability of final cascade and increased regression risk when touching shared files.

---

## Responsive Risks

1. Multiple breakpoints (1024/980/860/760/480 and route-specific media rules) across files can produce inconsistent transitions.
2. Mobile transformations that replace visible text with pseudo-content (`font-size: 0` + `::after`) can complicate consistency and QA expectations.
3. Mixed fixed/sticky/fixed-overlay behaviors (sidebar, command bar, AI dock, loading/fatal/startup surfaces) increase z-index and interaction-state complexity.

---

## CSS Duplication and Entropy Risks

### Global Rules
- Core global layers are present and functional, but spread across many files.

### Page-Specific Rules in Global Files
- Confirmed extensive `[data-page=...]` blocks and page-specific style logic in globally loaded files.

### Legacy Rules
- Legacy CSS/JS assets remain in repository and should stay until clean-layer rollout is validated.

### Duplicated Selector Behavior
- Shared selectors like `.card`, `.panel`, and hidden-state overlays/backdrops are influenced in multiple files.

### Responsive Override Proliferation
- Repeated media-query adjustments per page increase maintenance load and raise cross-page drift risk.

---

## Preservation Requirements from STEP 33B

The following are mandatory and in scope for all next steps:

1. Preserve IDs.
2. Preserve data attributes.
3. Preserve handlers.
4. Preserve API call paths.
5. Preserve confirmations and safety gates.
6. Preserve backend behavior.
7. Preserve route behavior.
8. Preserve improved copy/provenance wording.
9. Preserve existing data/projects content and schema.

Protected safety-gate examples to retain:
- Publishing publish confirmation.
- Publishing fail confirmation.
- Governance policy save confirmation.
- Settings critical save confirmation.
- Integrations disconnect confirmation.
- Library archive and soft-delete confirmations.

Protected copy/provenance examples to retain:
- Library: `Upload asset to Library`, `Refresh Library scan`, clarified Action/AI labels.
- Publishing: `Send publishing context to AI`, `Publish to configured channels`, `Mark publishing item as failed`.
- Campaign Studio: `Save campaign draft`, `Save campaign plan`, `Send campaign context to AI`, clarified dependency/asset review wording.

---

## Recommended Next Safe Step

Proceed to:
- STEP 35 - Final Design Direction and Tokens Plan

Do not do yet:
- No CSS patching.
- No clean-layer replacement implementation in this step.

Reason:
- A formal visual/token contract is required first to reduce cascade churn, prevent page-by-page drift, and preserve stabilized behavior/copy/safety controls.

---

## Explicit No-Code-Change Statement

This audit makes no production code changes.

No changes to:
- frontend JS
- CSS
- backend
- data/projects
- API behavior
- routes
- handlers
- IDs/classes/data attributes
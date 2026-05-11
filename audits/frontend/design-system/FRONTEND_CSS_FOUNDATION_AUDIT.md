# Frontend CSS Foundation Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only audit — no CSS files modified
Phase: P0 — CSS Foundation & Operating Surface Standard Audit
Reference: audits/frontend/FRONTEND_UX_MASTER_PLAN_2026.md

---

## 1. CSS File Inventory and Load Order

Files are loaded in `public/control-center/index.html` in the following order. Order is significant — later files override earlier files for equivalent specificity.

| # | File | Versioning stamp | Purpose |
|---|---|---|---|
| 1 | `styles/00-tokens.css` | `20260508-tokens-1` | Design tokens: colors, spacing, radius, shadow, typography, transition variables |
| 2 | `styles/01-reset.css` | `20260508-reset-1` | Browser normalization baseline |
| 3 | `styles/02-layer-system.css` | `20260510-loading-overlay-1` | Z-index layer variables, loading overlay, global message/error toasts, startup diagnostics |
| 4 | `styles/03-app-shell.css` | `20260508-shell-1` | Grid layout: `os-layout`, `main-shell`, `.workspace`, `#pageRoot`, `.page` visibility |
| 5 | `styles/07-sidebar.css` | `20260508-sidebar-2` | Sidebar layout, nav items, project switcher, brand |
| 6 | `styles/10-topbar-canonical.css` | `20260508-topbar-canonical-2` | Topbar, page context, workspace chip, exec action cluster |
| 7 | `styles/04-command-layer.css` | `20260508-command-1` | Command bar and backdrop overlay |
| 8 | `styles/05-ai-layer.css` | `20260508-ai-layer-1` | AI dock toggle and panel |
| 9 | `styles/08-components-foundation.css` | `20260508-components-1` | Buttons, inputs, cards, panels, badges, grids, empty/loading states |
| 10 | `styles/12-pages.css` | `20260508-pages-1` | Page-level layout class families for Home, Setup, Library, Content Studio, AI Command |
| 11 | `styles/13-home-executive.css` | `20260508-home-executive-1` | Home executive hero, KPI cards, activity feed, AI team grid |
| 12 | `styles/14-page-standard.css` | `20260510-library-polish-1` | Standard page compact shell (`std-*`), Library workspace polish, interaction safety |

Note: The filename numbering gap between `05-` and `07-` (no `06-`) and between `07-` and `08-` implies that a layer was removed or never created. This should be confirmed before any re-numbering.

Note: Load ordering places `04-command-layer.css` after `07-sidebar.css` and `10-topbar-canonical.css`. This means command-layer rules have higher cascade priority than sidebar and topbar for equivalent specificity. This is intentional for z-index stacking but could cause selector ambiguity if shared class names appear.

---

## 2. Token System Audit (`00-tokens.css`)

### 2.1 Token Categories Confirmed Present

- **Color**: `--bg-primary/secondary/tertiary`, `--surface-1/2/3`, `--border-primary/secondary`, `--text-primary/secondary/muted`, `--accent-primary/secondary/danger/warning/success`
- **Color aliases (two-tier system)**: `--color-bg-0/1`, `--color-surface-0/1/2`, `--color-border-0/1`, `--color-text-0/1/2`, `--color-primary/warning/danger/success`
- **Short aliases**: `--bg`, `--panel`, `--panel-2`, `--border`, `--border-2`, `--text`, `--muted`, `--muted-2`, `--primary`, `--warning`, `--danger`, `--success`
- **Spacing**: `--space-1` (4px) through `--space-8` (40px)
- **Border radius**: `--radius-xs` (6px) through `--radius-xl` (18px)
- **Shadow**: `--shadow-soft`, `--shadow-heavy`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- **Typography**: `--font-size-page` (20px), `--font-size-h2` (18px), `--font-size-h3` (16px), `--font-size-body` (14px), `--font-size-small` (12px)
- **Layout**: `--button-height-md` (38px), `--sidebar-width` (286px), `--shell-topbar-height` (64px)
- **Transition**: `--transition-fast` (160ms), `--transition-base` (220ms), `--transition-slow` (360ms)

### 2.2 Token Gap Risk: Three-Tier Color Naming

The token system maintains three overlapping alias tiers for the same values:
- Tier 1 (named): `--bg-primary`, `--text-primary`, `--accent-primary`
- Tier 2 (semantic): `--color-bg-0`, `--color-text-0`, `--color-primary`
- Tier 3 (short): `--bg`, `--text`, `--primary`

**Risk: Needs Consolidation.** Component files use all three tiers interchangeably. For example, `08-components-foundation.css` uses `--border-primary` (Tier 1) and `--border-secondary` (Tier 1), while `14-page-standard.css` uses raw `rgba()` values in some gradient backgrounds instead of tokens. This creates future maintenance risk if token values change.

**Resolution direction (P0 audit finding, not P0 action):** Future canonical work should adopt one tier and deprecate the other two. Do not change tokens in this pass.

### 2.3 Typography Token Gap

`--font-size-page` (20px) is defined but not confirmed as used in any component. `--font-size-h2` (18px) and `--font-size-h3` (16px) exist, but `13-home-executive.css` uses `clamp(2rem, 4vw, 3rem)` and `clamp(1rem, 2vw, 1.25rem)` raw, bypassing the token system.

**Risk: Needs Consolidation.** Raw `clamp()` font sizes in page-specific files are not traced to tokens.

---

## 3. Component Class Inventory

### 3.1 Button Classes

Defined primarily in `08-components-foundation.css`.

| Class | Type | File | Token-aligned |
|---|---|---|---|
| `.btn` | Base button | 08-components | Yes — uses `--button-height-md`, `--border-primary`, `--radius-md`, `--text-primary` |
| `.quick-action-btn` | Alias for btn-secondary | 08-components | Yes |
| `.std-action-btn` | Standard page action | 08-components | Yes |
| `.std-ai-btn` | AI panel action | 08-components | Yes |
| `.btn-primary` | Accent fill | 08-components | Yes |
| `.btn-secondary` | Bordered neutral | 08-components | Yes |
| `.btn-ghost` | Transparent | 08-components | Yes |
| `.btn-danger` | Red fill | 08-components | Yes |
| `.btn-warning` | Yellow fill | 08-components | Yes |
| `.btn-key-active` | Key-confirmed state | 08-components | Partial — raw `rgba()` |
| `.btn-key-missing` | Key-missing state | 08-components | Partial — raw `rgba()` |
| `.btn-sm` | Small size modifier | 08-components | Yes |
| `.exec-action-btn` | Topbar action variant | 10-topbar-canonical | Partial |
| `.std-context-btn` | Context ribbon button | 14-page-standard | Partial |

**Finding:** Four button aliases (`.quick-action-btn`, `.std-action-btn`, `.std-ai-btn`) are consolidated into the base `.btn` rule in one combined selector — good. The `.exec-action-btn` in `10-topbar-canonical.css` and `.std-context-btn` in `14-page-standard.css` are contextual variants that extend `.btn` by coexisting with it in HTML; this is acceptable but should be documented so future additions follow the same pattern.

### 3.2 Card and Panel Classes

Defined in `08-components-foundation.css`.

| Class | Notes |
|---|---|
| `.card` | Base card surface — token-aligned |
| `.panel` | Same rule set as `.card` — considered a semantic alias |
| `.data-card` | Same rule set |
| `.kpi-card`, `.metric-card`, `.status-card`, `.action-card` | Semantic variants, same base rule |
| `.ai-panel` | Same base rule — AI surface alias |
| `.std-kpi-card`, `.std-status-card`, `.std-side-card` | Standard page card variants |

**Finding:** All card/panel variants share one rule block. This is efficient but means any visual differentiation must come from modifier classes or contextual selectors. Future premium card hierarchy (elevated card, featured card, interactive card) will need its own modifier class, not a new base class.

**Risk: Safe to Keep** — the consolidation is intentional. No duplicate definitions found.

### 3.3 Badge Classes

Defined in `08-components-foundation.css`.

| Class | Tone |
|---|---|
| `.badge` / `.card-badge` | Base — neutral dark |
| `.badge-success` / `.card-badge.success` / `.is-success .badge` | Green |
| `.badge-warning` / `.card-badge.warning` / `.is-warning .badge` | Yellow |
| `.badge-danger` / `.card-badge.danger` / `.is-danger .badge` | Red |
| `.badge-neutral` / `.card-badge.neutral` | Neutral |

**Finding:** There are three parallel naming patterns for the same tonal states: BEM modifier (`.badge-success`), compound class (`.card-badge.success`), and context class (`.is-success .badge`). All three are in one selector group, which works but creates three paths to the same result.

**Risk: Needs Consolidation (future).** Prefer `.badge-success` as canonical; `.is-success .badge` is useful for automatic inheritance but can cause unexpected cascade leakage if `.is-success` is used broadly. Do not consolidate in this pass.

### 3.4 Grid Classes

Defined across `08-components-foundation.css` and `12-pages.css`.

**`08-components-foundation.css` grid families:**
- `.page-grid`, `.dashboard-grid`, `.section-grid`, `.grid-2`, `.setup-layout`, `.home-section-grid`, `.home-main-grid`, `.info-grid`, `.kpi-grid`, `.data-grid`, `.std-kpi-grid`, `.std-status-grid`, `.home-ai-team-grid`

These fall into:
- 2-column (`repeat(2, minmax(0, 1fr))`): `dashboard-grid`, `page-grid`, `section-grid`, `grid-2`, `home-ai-team-grid`
- 3-column (`repeat(3, minmax(0, 1fr))`): `kpi-grid`, `std-kpi-grid`, `std-status-grid`, `info-grid`, `data-grid`

**`12-pages.css` grid families:**
- `.home-kpi-grid`, `.home-status-grid`, `.home-ai-team-grid`, `.library-overview-grid`, `.library-upload-grid`, `.library-required-grid`, `.setup-smart-overview-grid`, `.content-overview-grid` etc. — all `repeat(3, minmax(0, 1fr))`
- `.home-two-column-grid`, `.setup-wizard-layout`, `.library-workspace-grid`, `.content-main` — `1.55fr/1fr` two-column layouts

**Risk: Needs Consolidation.** `home-ai-team-grid` is defined in both `08-components-foundation.css` (2-column) and likely referenced in `12-pages.css` (3-column context). This is a potential duplication conflict. Must be verified in P1 layout work.

### 3.5 Empty and Loading State Classes

Defined in `08-components-foundation.css`:
- `.loading-state`, `.empty-state`, `.empty-box` — confirmed present

Defined in `02-layer-system.css`:
- `.loading-overlay`, `.loading-card`, `.loading-spinner` — full-screen overlay states

**Finding:** Two distinct loading systems exist:
1. **Full-screen overlay** (`02-layer-system.css`): for app-level startup and route-transition blocking states.
2. **Inline loading/empty** (`08-components-foundation.css`): for per-page data states.

**Risk: Safe to Keep** — the two systems serve different scopes. They must not be confused. Page render functions must use `.loading-state` / `.empty-state` for inline states, never the full-screen overlay.

---

## 4. Duplicate and Overlapping Selectors

### 4.1 `.std-page-shell` — Defined in Two Files

| File | Rule |
|---|---|
| `08-components-foundation.css` line ~297 | `display: grid; gap: 18px; min-width: 0;` |
| `14-page-standard.css` line 6 | `display: flex; flex-direction: column; gap: 16px; width: 100%; min-width: 0;` |

**Risk: Needs Consolidation (critical).** `08-components-foundation.css` defines `.std-page-shell` as `display: grid` with `gap: 18px`. `14-page-standard.css` redefines it as `display: flex` with `gap: 16px`. Since `14-page-standard.css` loads after, the flex version wins. The grid definition in `08-components-foundation.css` is effectively overridden and dead.

**Action needed (P0 finding):** The `08-components-foundation.css` definition of `.std-page-shell` should be formally retired. Do not change in this pass — document only.

### 4.2 `.home-exec-hero` — Defined in Two Files

| File | Rule |
|---|---|
| `12-pages.css` line ~25 | Background gradient + border color definition |
| `13-home-executive.css` | Full layout definition: border-radius, padding, background, border, box-shadow |

**Risk: Needs Consolidation.** `12-pages.css` provides a partial early definition; `13-home-executive.css` provides the full definition. Since `13-home-executive.css` loads after, the final value for each conflicting property comes from there. The `12-pages.css` definition is partially overridden.

**Action needed (P0 finding):** Move full `.home-exec-hero` ownership to `13-home-executive.css`; remove the partial definition from `12-pages.css`. Do not change in this pass.

### 4.3 `.home-command-center` — Defined in Two Files

| File | Rule |
|---|---|
| `12-pages.css` | `display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr)` |
| `13-home-executive.css` | `display: flex; flex-direction: column; gap: 24px; width: 100%; min-width: 0` |

**Risk: Needs Consolidation.** Same conflict pattern as `.std-page-shell`. The `12-pages.css` grid definition is overridden by the `13-home-executive.css` flex definition.

### 4.4 `.home-two-column-grid` — Defined in Two Files

| File | Rule |
|---|---|
| `12-pages.css` | `grid-template-columns: minmax(0, 1.55fr) minmax(280px, 1fr)` |
| `14-page-standard.css` | `grid-template-columns: minmax(0, 1fr) minmax(360px, 0.7fr)` |

**Risk: Needs Consolidation (significant).** The two column proportions differ between files. Since `14-page-standard.css` loads last, its rule wins. The `12-pages.css` definition is dead. Page renders using this grid may have been designed against either proportion.

---

## 5. `!important` Usage Audit

`!important` usage is reviewed across all CSS files. A summary by category and justification:

### Category A — Safe: Visibility/display reset patterns

Used in: `01-reset.css`, `02-layer-system.css`, `04-command-layer.css`, `07-sidebar.css`

Pattern:
```css
[hidden] { display: none !important; }
.loading-overlay[hidden] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
```

**Justification:** These are intentional hard resets on hidden/closed overlay states to prevent accidental visibility from cascade interference. This is an accepted pattern for overlay/modal control.

**Risk: Safe to Keep.** These are low-risk because they're applied to state classes, not broad element types.

### Category B — Needs Review: Topbar label truncation

In `10-topbar-canonical.css` lines ~147–161:
```css
padding: 0 !important;
font-size: 0 !important;
padding: 0 12px !important;
font-size: 0 !important;
```

**Risk: Needs Consolidation.** Font-size `!important` for icon-only states in responsive topbar. These are workaround overrides for responsive icon/label hiding. Indicates the topbar responsive logic may have cascade ordering issues that were patched with `!important` rather than restructured.

### Category C — Needs Review: `14-page-standard.css` cascaded override patterns

Lines ~238, ~308, ~323, ~393, ~400–407, ~720–725, ~742, ~765–767, ~784:

Several `!important` clusters in `14-page-standard.css`:
- Deprecated surface hiding (`.std-page-header { display: none !important; }`) — intentional retirement
- Interaction safety overrides (`pointer-events: none !important; pointer-events: auto !important;`) — state management
- Integration card color inheritance (`color: var(--text-primary) !important;`) — specificity override
- AI agent card background fix (`background !important; border !important; border-radius !important; padding !important;`) — specificity override against existing `.card` rule
- Visually hidden utility (`position: absolute !important; width: 1px !important; height: 1px !important;`) — accessibility utility
- Input focus override (`border-color !important`) — specificity override

**Risk: Needs Consolidation.** The AI agent card and integration card `!important` clusters indicate specificity conflicts with `.card` or `.panel` base rules. These should be resolved by specificity restructuring, not `!important` patches, in a future CSS consolidation pass.

---

## 6. Raw Value Usage (Token Bypass)

Areas where raw hex or rgba values are used instead of token variables:

### High frequency raw value usage in `14-page-standard.css`

- Background gradients: `rgba(15, 23, 42, 0.82)`, `rgba(8, 16, 26, 0.92)` — not mapped to `--bg-*` tokens
- Border: `rgba(148, 163, 184, 0.16)` — not mapped to `--border-*` tokens
- Text: `rgba(226, 232, 240, 0.78)` — close to `--text-secondary` but not using the variable
- Chip backgrounds: `rgba(255, 255, 255, 0.045)` — no token equivalent

### High frequency raw value usage in `13-home-executive.css`

- `rgba(255,255,255,0.08)`, `rgba(255,255,255,0.76)`, `rgba(0,0,0,0.22)` — no token equivalents
- Font size `clamp(2rem, 4vw, 3rem)` — bypasses typography token system

### Raw border-radius values

Several files use `18px`, `16px`, `24px` directly rather than `--radius-xl` (18px), `--radius-lg` (14px):
- `14-page-standard.css`: `border-radius: 18px`, `border-radius: 16px`
- `13-home-executive.css`: `border-radius: 24px` (no token equivalent for this value)

**Risk: Needs Consolidation.** The 24px radius has no token. This is a gap in `00-tokens.css`. Future token addition needed: `--radius-2xl: 24px`.

---

## 7. Page-Specific CSS Leakage Risks

### 7.1 `12-pages.css` — Broad Class Scope

`12-pages.css` defines grid and layout classes that mix page-specific names (`library-workspace-grid`, `content-main`) with shared layout names (`home-two-column-grid`, `std-page-shell`). Any page using the class name `.home-two-column-grid` will inherit its definition from `12-pages.css` even if it is not the Home page.

**Risk: Medium.** These class names are specific enough that accidental reuse is unlikely, but they are global and unscoped. A future page that reuses `.grid-2` from `08-components-foundation.css` will behave differently from one using `.home-two-column-grid` from `12-pages.css`, even though both are two-column grids.

### 7.2 `14-page-standard.css` — Library Scoping via Attribute Selector

`14-page-standard.css` contains Library-specific rules scoped with:
```css
[data-page="library"] .library-smart-shell { ... }
[data-page="library"] .library-smart-shell > .card { ... }
```

**Risk: Low.** This scoping is correct — the `[data-page="library"]` attribute selector ensures these rules only apply when the library page is active. This is the correct pattern for page-specific CSS that lives in a shared file. Future page-specific rules should follow this same pattern.

### 7.3 `13-home-executive.css` — Unscoped Home Classes

Home-specific classes (`home-exec-hero`, `home-kpi-grid`, `home-ai-team-grid`, etc.) are defined without page-scoping attribute selectors. They work because the class names are unique to the home page DOM, but they are not protected against name collision.

**Risk: Low-Medium.** No current collision detected. If a future page's template accidentally includes a `home-exec-hero` class, it will receive home styles unintentionally. Recommended future practice: scope home styles to `[data-page="home"]`.

---

## 8. AI Dock / Command Bar / Overlay CSS Interaction Risks

### 8.1 Z-Index Stack

```
--layer-base:    0
--layer-sticky:  30
--layer-sidebar: 100
--layer-topbar:  200
--layer-command: 400
--layer-drawer:  500
--layer-overlay: 600
--layer-modal:   900
--layer-ai:      1200
--layer-toast:   1300
```

**Finding:** The AI dock (`--layer-ai: 1200`) sits above modals (`--layer-modal: 900`) and loading overlay (`--layer-overlay: 600`). This is intentional: the AI dock must remain accessible even during loading states.

**Risk: Safe to Keep** — the layer order is deliberate and follows a logical hierarchy.

### 8.2 Command Bar Interaction

The command bar uses `position: fixed` at `top: calc(var(--shell-topbar-height, 64px) + 10px)` with a fallback value. The fallback (`64px`) matches `--shell-topbar-height` in the token file, so this is safe but adds a redundant hardcode.

**Risk: Low.** If `--shell-topbar-height` is ever changed in `00-tokens.css`, the command bar fallback will drift. Recommended: remove the fallback and rely solely on the token variable.

### 8.3 Loading Overlay Conflict Pattern

`02-layer-system.css` includes a broad rule:
```css
body:not(.is-loading):not(.loading):not(.loading-locked):not(.app-loading):not(.app-locked) .loading-overlay,
body[data-loading-state="idle"] .loading-overlay {
  display: none !important; ...
}
```

This matches five different body class names (`is-loading`, `loading`, `loading-locked`, `app-loading`, `app-locked`) and one data attribute. A page that accidentally adds any of these classes will trigger the loading overlay to appear even without explicit intent.

**Risk: Needs Consolidation.** The multiple class triggers suggest organic growth. Ideally one canonical `[data-loading-state]` attribute should be the single trigger. Do not change in this pass.

---

## 9. Font and Spacing Patterns

### Font Size Usage

| File | Raw values used (partial) |
|---|---|
| `07-sidebar.css` | `19px`, `12px`, `11px` |
| `10-topbar-canonical.css` | `15px`, `12px` — `15px` not in token system |
| `08-components-foundation.css` | `24px`, `15px`, `13px`, `11px` — `15px` not in token system |
| `13-home-executive.css` | `clamp(2rem, 4vw, 3rem)`, `clamp(1rem, 2vw, 1.25rem)`, `1rem`, `2rem` |
| `14-page-standard.css` | `clamp(1rem, 2vw, 1.25rem)`, `0.9rem`, `0.78rem`, `0.72rem`, `0.98rem` |

**Token gaps:**
- `15px` (topbar title, card headings) — no token
- `11px` (labels, badge text) — close to `--font-size-small` (12px) but off by 1px
- `clamp()` values in premium hero and context ribbon — not token-backed

### Spacing Consistency

`--space-1` through `--space-8` covers 4px to 40px. Observed usage includes values like `18px`, `22px`, `28px`, `92px` (workspace bottom padding) that fall outside the defined token steps.

**Risk: Needs Consolidation.** The token ladder has gaps at 18px, 22px, and 28px. These are common values used throughout. Consider adding `--space-4a: 18px`, `--space-5a: 22px`, `--space-6a: 28px` in a future token audit pass.

---

## 10. Deprecated-Looking Layers

### 10.1 Dead selectors in `14-page-standard.css`

```css
.std-page-header,
.std-section-block[data-ui-role="page-power-summary"],
.std-section-block[data-ui-role="current-status"],
.std-main-right {
  display: none !important;
}
```

The comment reads: "Retire old standard-card surfaces if old DOM survives before hard refresh." These selectors exist solely to suppress legacy DOM from appearing. If no current template emits these elements, the rules are dead. If templates were cleaned, these rules are retirement guards.

**Classification: Deprecated Candidate.** After confirming no template emits these elements, these rules can be removed in a future CSS cleanup pass.

### 10.2 `12-pages.css` partial definitions for classes fully owned by `13-home-executive.css`

The `12-pages.css` partial definitions for `.home-exec-hero`, `.home-command-center`, and `.home-two-column-grid` are functionally overridden by later files. They are dead code in the cascade.

**Classification: Deprecated Candidate.** Safe to remove after confirming cascade behavior in a future CSS consolidation pass.

### 10.3 Missing file `06-*.css`

The file numbering jumps from `05-ai-layer.css` to `07-sidebar.css`. A `06-` file was either never created or was removed. The load order is stable without it; the gap is just a naming artifact.

**Classification: Not a risk.** No action needed.

---

## 11. Canonical-Looking Layers (Safe to Keep)

| File | Assessment |
|---|---|
| `00-tokens.css` | Canonical — single source of truth for design tokens. Do not change. |
| `01-reset.css` | Canonical — stable normalization. Do not change. |
| `02-layer-system.css` | Canonical for z-index stack and overlay system. Review loading state triggers in future pass. |
| `03-app-shell.css` | Canonical — grid layout. Stable. |
| `07-sidebar.css` | Canonical for sidebar. Stable. |
| `10-topbar-canonical.css` | Canonical for topbar. Minor: responsive `!important` overrides need future cleanup. |
| `08-components-foundation.css` | Near-canonical for shared components. Contains one dead `.std-page-shell` definition. |

---

## 12. Risk Classification Summary

| Class / Area | Risk Classification |
|---|---|
| `00-tokens.css` | `safe_to_keep` |
| `01-reset.css` | `safe_to_keep` |
| `02-layer-system.css` — z-index variables | `safe_to_keep` |
| `02-layer-system.css` — loading overlay (multiple body-class triggers) | `needs_consolidation` |
| `03-app-shell.css` | `safe_to_keep` |
| `07-sidebar.css` | `safe_to_keep` |
| `10-topbar-canonical.css` — responsive `!important` overrides | `needs_consolidation` |
| `04-command-layer.css` | `safe_to_keep` |
| `05-ai-layer.css` | `safe_to_keep` |
| `08-components-foundation.css` — `.std-page-shell` definition | `deprecated_candidate` |
| `08-components-foundation.css` — card/panel/button/badge rules | `safe_to_keep` |
| `12-pages.css` — `.home-exec-hero` partial | `deprecated_candidate` |
| `12-pages.css` — `.home-command-center` partial | `deprecated_candidate` |
| `12-pages.css` — `.home-two-column-grid` partial | `deprecated_candidate` |
| `12-pages.css` — Library/Content/Setup grid families | `do_not_touch_yet` |
| `13-home-executive.css` | `safe_to_keep` — unscoped, low collision risk currently |
| `14-page-standard.css` — `std-*` compact shell | `safe_to_keep` |
| `14-page-standard.css` — deprecated surface suppressions | `deprecated_candidate` |
| `14-page-standard.css` — `!important` AI/integration card specificity patches | `needs_consolidation` |
| Three-tier color token aliases | `needs_consolidation` |
| Raw `rgba()` values bypassing token system | `needs_consolidation` |
| Missing tokens: 15px font-size, 24px radius | `needs_consolidation` |

---

## 13. Canonical Component State Reference

Confirmed as defined in `08-components-foundation.css`:

| Component | Classes | Status |
|---|---|---|
| Card | `.card`, `.panel`, `.data-card`, `.kpi-card`, `.metric-card`, `.status-card`, `.action-card`, `.ai-panel`, `.std-kpi-card`, `.std-status-card`, `.std-side-card` | Canonical |
| Button | `.btn` + modifiers (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-warning`, `.btn-sm`) | Canonical |
| Badge | `.badge`, `.card-badge` + tone modifiers | Canonical |
| Empty state | `.empty-state`, `.empty-box` | Confirmed present |
| Inline loading | `.loading-state` | Confirmed present |
| Full-screen loading | `.loading-overlay`, `.loading-card`, `.loading-spinner` | In `02-layer-system.css` |
| Grid | Multiple families — needs consolidation (see §4.4) | Partial |
| Input/Textarea | In `08-components-foundation.css` | Canonical |

Not yet defined (gap):
- No canonical **table** class. Pages rendering tabular data use ad-hoc structures.
- No canonical **deferred button** (present but inactive, labeled as coming). Currently disabled buttons use `disabled` attribute only.
- No canonical **right-rail panel** class for Action Panel / AI Panel zones. Library uses `.std-side-card`; other pages use `.card` + positioning.

---

## 14. No-Change Confirmation

This audit is documentation-only.

- No CSS files were modified.
- No JS files were modified.
- No data/projects files were modified.
- No runtime behavior was changed.
- All findings are recorded as inputs to the P1 implementation pass.

---

## 15. Recommended Actions (For Future Passes Only)

| Priority | Action | Pass |
|---|---|---|
| High | Retire `.std-page-shell` definition from `08-components-foundation.css` | P1 CSS cleanup |
| High | Remove partial `.home-exec-hero`, `.home-command-center`, `.home-two-column-grid` from `12-pages.css` | P1 CSS cleanup |
| High | Add canonical table component class | P1 component foundation |
| High | Add canonical right-rail panel class | P1 component foundation |
| Medium | Add missing token `--radius-2xl: 24px` and `--font-size-sm2: 15px` | P1 token pass |
| Medium | Consolidate loading state triggers to single `[data-loading-state]` attribute | P2 |
| Medium | Add page-scoping `[data-page="home"]` to `13-home-executive.css` selectors | P2 |
| Low | Resolve three-tier color token aliases to one canonical tier | P3 |
| Low | Replace responsive topbar `!important` overrides with cascade restructure | P3 |

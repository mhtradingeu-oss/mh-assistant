# Global Visual Density and Hierarchy Audit

## Summary

The current Control Center visual density problem is not caused by a single file. It comes from four overlapping styling systems that all touch panels, cards, actions, and typography:

1. `00-tokens.css` defines relatively compact tokens.
2. `08-components-foundation.css` defines the legacy shared base for `.panel`, `.card`, `.data-card`, `.quick-action-btn`, `.card-badge`, and `.simple-banner`.
3. `14-page-standard.css` re-inflates surfaces globally with stronger gradients, 18px radii, heavier shadows, nowrap context text, and duplicated `std-*` rules.
4. Page-local layers then diverge again:
   - `09-operations-centers.css` compacts operations pages.
   - `12-pages.css` carries older Setup/Home/AI shell rules plus Settings polish.
   - `15-clean-operating-layer.css` introduces cleaner opt-in `mhos-clean-*` primitives.
   - `publishing.js` injects its own inline page CSS outside the shared stylesheet system.

Result: the UI feels inconsistent because some pages are running on the newer `panel + std-* + mhos-clean-*` stack, some pages are still running mostly on legacy `.card`/`.panel` surfaces, and some page classes have little or no audited CSS binding at all.

The strongest global causes of the current visual feel are:

- Shared cards and panels still receive shadows and rounded containers at multiple layers.
- `14-page-standard.css` globally upgrades page surfaces to a premium card style, which increases visual weight even when page-specific CSS later tries to compact things.
- Shared action patterns still bias toward pill-like buttons, nowrap chips, and nested cards.
- Several pages use page-specific class names without a matching shared CSS owner, so they fall back to generic card/button/input styling and feel basic.

## Files Inspected

### Global / shared CSS

- `public/control-center/styles/00-tokens.css`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/09-operations-centers.css`
- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/styles/15-clean-operating-layer.css`
- `public/control-center/styles/13-home-executive.css`

### Integrations CSS

- `public/control-center/styles/integrations/cards.css` (empty)
- `public/control-center/styles/integrations/drawer.css` (empty)
- `public/control-center/styles/integrations/forms.css` (empty)
- `public/control-center/styles/integrations/grid.css` (empty)
- `public/control-center/styles/integrations/layout.css` (empty)
- `public/control-center/styles/integrations/responsive.css` (empty)

### Page ownership inspection only

- `public/control-center/pages/operations-centers.js`
- `public/control-center/pages/setup.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/publishing.js`
- `public/control-center/pages/settings.js`
- `public/control-center/pages/governance.js`

## Current Visual Problem

The product still feels card-heavy, oversized, crowded, and inconsistent because the page system mixes three different surface philosophies:

- Legacy shared foundation: small-to-medium cards with default shadows and rounded borders.
- Standard premium shell: larger, more cinematic context ribbons and `std-*` surfaces with heavier radii and hover depth.
- Clean operating layer: newer `mhos-clean-*` opt-in surfaces with tighter, more operational density.

Those systems are not yet aligned. Some pages apply all three at once, some only one, and some bypass the shared layers completely.

The visual hierarchy is therefore weak in predictable ways:

- Page-level containers and section-level containers are often both styled as equally prominent cards.
- AI/context panels are not visually distinct enough from regular detail panels on several pages.
- Buttons and chips can still behave like fixed pills instead of compact, safe-wrapping operating controls.
- Pages such as AI Command and Publishing are not truly bound to the standard global system, so they regress to basic or one-off styling.

## Global Selector Ownership Map

| Selector / primitive | Primary owner | Secondary / override owner | Audit finding |
| --- | --- | --- | --- |
| `.panel`, `.card`, `.data-card` | `08-components-foundation.css` | `14-page-standard.css` generic page surface recovery | Shared surface is defined twice; page layer visually re-inflates the foundation.
| `.panel-header` | `08-components-foundation.css` | `09-operations-centers.css` page variants | Base header is neutral; operations pages compact it correctly.
| `.panel-kicker` | `08-components-foundation.css` via shared label group | `09-operations-centers.css` executive strip compaction | Compact in ops strip, but otherwise still reads as generic label styling.
| `.simple-banner` | `08-components-foundation.css` | `12-pages.css` Settings-specific override | Global banner is still card-like; Settings improves it locally only.
| `.data-card` | `08-components-foundation.css` | `14-page-standard.css` page surface recovery | Still inherits the heavy card language everywhere.
| `.quick-action-btn` | `08-components-foundation.css` | `12-pages.css` Settings override, `09-operations-centers.css` ops override, `14-page-standard.css` Home/integrations tweaks | Button base still starts as pill-like and nowrap, then gets patched per page.
| `.card-badge` | `08-components-foundation.css` | `09-operations-centers.css` compact badge variants, `14-page-standard.css` integrations size trims | Shared badge base is acceptable but still strongly pill-coded and often duplicated by page-specific status pills.
| `.std-detail-card` | `14-page-standard.css` | duplicated again later in same file | Defined twice with overlapping premium-surface intent.
| `.std-action-panel` | `14-page-standard.css` | duplicated again later in same file | Same duplication pattern; contributes to uncertainty about final owner.
| `.std-ai-panel` | `14-page-standard.css` | duplicated again later in same file | Same duplication pattern; final result is visually heavy rather than clean.
| `.std-action-row` | `14-page-standard.css` | later expanded in same file | Action sizing is duplicated and broadened over time.
| `.std-quick-actions` | `14-page-standard.css` | later mobile rules in same file | Good candidate for a single global density correction.
| `.mhos-clean-surface` | `15-clean-operating-layer.css` | local page composition only | Best current shared primitive for clean operating density.
| `.mhos-clean-header` | `15-clean-operating-layer.css` | none in inspected pages | Available, but not broadly adopted yet.
| `.mhos-clean-btn` | `15-clean-operating-layer.css` | not used by inspected target pages | Cleaner than legacy `.btn`, but adoption is incomplete.
| `.mhos-clean-pill` | `15-clean-operating-layer.css` | not used broadly in inspected target pages | Cleaner than legacy badges/chips, but adoption is incomplete.

## Page-Specific Selector Ownership Map

| Page | Main selectors in markup | Real CSS owner in audited layers | Ownership status |
| --- | --- | --- | --- |
| Job Monitor / Operations Centers | `.panel`, `.panel-header`, `.panel-kicker`, `.quick-action-btn`, `.ops-*`, `.std-context-*`, `.mhos-clean-surface` | `08-components-foundation.css` + `09-operations-centers.css` + `14-page-standard.css` + `15-clean-operating-layer.css` | Mostly shared-system driven; compacted locally, but still inherits heavy shared surface language.
| Setup | `.setup-*`, `.card`, `.setup-input`, `.setup-textarea`, `.setup-smart-*`, `.setup-wizard-*` | Mostly `12-pages.css` legacy page layer + `08-components-foundation.css` + some input handling from `14-page-standard.css` | Heavy page-local dependency; only partial modern binding.
| AI Command | `.aicmd-*`, `.card-badge` | `12-pages.css` only styles `.aicmd-shell` and `.aicmd-operating-strip`; most `aicmd-*` selectors have no audited stylesheet owner | Missing binding for most page structure; major source of basic/native feel.
| Publishing | `.publishing-*`, `.card`, `.setup-input`, `.card-badge` | Inline `<style>` block inside `publishing.js`, plus shared `.card`, `.btn`, `.setup-input` foundations | Not governed by shared CSS files; effectively a page-local legacy subsystem.
| Settings | `.panel`, `.std-detail-card`, `.std-ai-panel`, `.std-action-row`, `.std-quick-actions`, `.mhos-clean-surface`, `.settings-*` | `08-components-foundation.css` + `12-pages.css` Settings polish + `14-page-standard.css` + `15-clean-operating-layer.css` | Best-bound page in inspected set; page-specific polish is explicit and intentional.
| Governance | `.panel`, `.std-detail-card`, `.std-action-panel`, `.std-ai-panel`, `.std-action-row`, `.std-quick-actions`, `.mhos-clean-surface`, `.governance-*` | Shared panel/std/mhos-clean layers, but most `governance-*` selectors do not have dedicated audited CSS ownership | Functionally composed, but still under-bound at page-specific detail layer.

## Duplicated / Overlapping CSS Findings

### High-value overlaps

1. `14-page-standard.css` defines `std-*` surfaces twice.
   - `:where(.std-detail-card)`, `:where(.std-action-panel)`, `:where(.std-ai-panel)`, their hover states, and related text helpers are declared once in the mid-file shared primitive section and then restated in the later “Global Visual System Finalization” section.
   - This does not break rendering outright, but it obscures the true owner and encourages patch stacking.

2. Shared card surfaces are defined in both `08-components-foundation.css` and `14-page-standard.css`.
   - Foundation gives `.card`, `.panel`, `.data-card` a padded gradient card with shadow.
   - `14-page-standard.css` then globally re-styles `.page .card`, `.page .panel`, `article[class*="card"]`, and `div[class*="card"]` with a heavier 18px radius and new background.
   - This is a major reason the UI still feels boxed and card-heavy.

3. Setup inputs are styled in both `08-components-foundation.css`, `12-pages.css`, and `14-page-standard.css`.
   - Base input density starts in foundation.
   - `12-pages.css` raises setup-specific layout and card usage.
   - `14-page-standard.css` adds interaction safety and input click safety, plus some setup input targeting.
   - Ownership is fragmented.

4. `.quick-action-btn` has one global base and several page-local overrides.
   - Foundation sets shared button density and `white-space: nowrap`.
   - Home, Settings, operations pages, and integrations later patch wrapping and size.
   - This selector should be treated as a global primitive that still needs a canonical compact spec.

5. Governance presentation borrows Settings-specific classes.
   - `settings.js` and `governance.js` both use `.governance-policy-block` and `.governance-rule-list`, but the inspected CSS binding appears only under `[data-page="settings"]` in `12-pages.css`.
   - Governance therefore relies heavily on generic panel styling instead of an explicit page-level visual system.

### Legacy overlaps that should stay for now

- `08-components-foundation.css` legacy `.card` / `.panel` / `.data-card` base.
- `14-page-standard.css` generic recovery selectors for old pages.
- `12-pages.css` Setup/Home/AI shell groups.
- `publishing.js` inline publishing styles.

These should not be deleted during the next patch. They are still actively carrying pages that are not fully migrated.

## Card and Panel Density Findings

### Which global selectors control panel/card density?

Primary density owners:

- `00-tokens.css`
  - `--component-padding-md: 14px`
  - `--radius-md: 10px`
  - `--radius-xl: 18px`
  - `--shadow-soft`, `--shadow-md`, `--shadow-heavy`

- `08-components-foundation.css`
  - `.card, .panel, .data-card, ... { padding: 14px; border-radius: var(--radius-md); box-shadow: var(--shadow-soft); }`
  - `.simple-banner { padding: 10px 12px; border-radius: var(--radius-md); }`

- `14-page-standard.css`
  - `.std-context-ribbon { padding: 14px 16px; border-radius: 18px; box-shadow: 0 18px 40px ... }`
  - `.page .card, .page .panel, article[class*="card"], div[class*="card"] { border-radius: 18px; }`
  - `:where(.std-detail-card)`, `:where(.std-action-panel)`, `:where(.std-ai-panel)` all use `padding: var(--space-4)` and 18px radii with hover-depth shadows.

- `15-clean-operating-layer.css`
  - `.mhos-clean-surface { padding: var(--mhos-clean-space-4); border-radius: var(--mhos-clean-radius-md); box-shadow: var(--mhos-clean-shadow-sm); }`
  - This is cleaner and more disciplined than the standard layer, but it still sits on top of `.panel` in current page markup.

### Why pages still feel card-heavy

- Shared `.panel` and `.card` are already cards before page-specific layers begin.
- `14-page-standard.css` upgrades almost every page card into a premium surface, even when the page is supposed to be a compact operating surface.
- Many pages place cards inside cards:
  - Setup overview cards inside larger setup cards.
  - Job Monitor detail cards inside a parent detail surface.
  - Publishing queue rows, impact chips, and calendar rows all become sub-cards.
- Box shadows remain present at both foundation and standard layers, which increases perceived weight.

### Page-specific density observations

- Job Monitor: local ops CSS compacts panels to 11px padding and trims headers, but nested `.ops-detail-card .ops-detail-card` blocks still keep the page feeling compartmentalized.
- Setup: large number of `.card` containers and sub-cards creates stacked-box density even though individual card padding is moderate.
- AI Command: because most `aicmd-*` selectors are unbound, the page falls back to generic card grouping without a strong operating hierarchy.
- Publishing: queue rows, impact chips, overview items, calendar rows, blockers, and cards are all individually boxed; this is the most literal “card-heavy” page in the target set.

## Typography Findings

### Which selectors make typography feel oversized or heavy?

Global and shared drivers:

- `00-tokens.css`
  - `--font-size-page: 20px`
  - `--font-size-metric: 24px`
  - `--font-weight-emphasis: 800`

- `08-components-foundation.css`
  - `.metric-value, .kpi-value, ... { font-size: 24px; font-weight: 800; }`
  - `.card-label, .setup-kicker, .setup-helper { font-weight: 800; letter-spacing: 0.06em; }`
  - `.card-badge { font-weight: 800; }`

- `14-page-standard.css`
  - `.std-context-title { font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 850; }`
  - `.std-context-chip { font-size: 0.78rem; font-weight: 700; }`
  - `.std-panel-title` and `.std-panel-copy` are declared twice with slightly different size strategies.
  - `.std-context-description` defaults to `white-space: nowrap`, so long descriptive text reads like a banner label rather than a comfortable operating paragraph.

- `13-home-executive.css`
  - Home remains intentionally oversized and premium. It is not the main cause of the inspected target page issues, but it demonstrates how far the overall design language can drift upward in radius, spacing, and weight.

### Typography-specific problems by page

- Job Monitor: typography is actually locally compacted; visual heaviness comes more from boxed density than text size.
- Setup: repeated uppercase helper/kicker patterns and multiple `strong` metrics keep every block feeling equally important.
- AI Command: no dedicated text system for `.aicmd-*` layout means hierarchy depends on default headings and generic card internals.
- Publishing: mixed typographic systems (`setup-kicker`, `card-head`, `publishing-status-pill`, plain button text) create inconsistent hierarchy rather than a single oversized scale.

## Button / Chip / Action Findings

### Which selectors make buttons/chips too large or unable to wrap safely?

Global issues:

- `08-components-foundation.css`
  - `.btn, .quick-action-btn, ... { min-height: var(--button-height-md); padding: 0 14px; white-space: nowrap; }`
  - `.card-badge { min-height: 24px; padding: 0 10px; white-space: nowrap; }`
- `14-page-standard.css`
  - `.std-context-btn` stays pill-shaped and nowrap.
  - `.std-context-description` and `.std-context-title` both default to ellipsis/nowrap, weakening responsive hierarchy.
  - `.std-quick-actions > .btn` and `.std-action-row` remain larger premium controls than necessary for dense operating pages.

Pages that patch around the problem:

- Settings explicitly fixes `.quick-action-btn` with `white-space: normal` and `overflow-wrap: anywhere`.
- Operations pages reduce `.quick-action-btn` and compact badges correctly.
- Integrations trims `.quick-action-btn` and `.card-badge` sizes on its own page.

### Action findings

- `quick-action-btn` should be globally redefined as a compact, wrap-safe shared primitive instead of relying on page-local fixes.
- `card-badge` should remain compact, but the next patch should keep badges informational rather than letting them become primary hierarchy anchors.
- `std-action-row` and `std-quick-actions` are good shared primitives and should be globally tuned once, not repeatedly patched by pages.
- `mhos-clean-btn` is a better target state than legacy `.btn`, but the target pages are not using it broadly enough yet.

## Which Pages Depend Mostly on Global CSS?

Pages that mostly depend on shared/global CSS:

- Settings
- Governance
- Task Center / Queue Center / Job Monitor in operations centers

Reason: these pages are built from shared `.panel`, `.panel-header`, `.card-badge`, `.quick-action-btn`, `std-*`, and `mhos-clean-*` primitives, with limited page-specific correction layers.

## Which Pages Still Depend on Page-Specific Legacy CSS?

Pages that still depend on page-specific legacy CSS or non-canonical local styling:

- Setup
  - Mostly `12-pages.css` setup shell and card groups.
- AI Command
  - Mostly page-local `aicmd-*` markup with only partial CSS binding.
- Publishing
  - Own inline `<style>` block inside `publishing.js`.
- Integrations
  - Styling lives in `14-page-standard.css` page-specific section, while the dedicated integrations CSS files are currently empty.

## Which Page-Specific Selectors Are Missing CSS Bindings?

### AI Command missing or effectively missing in the audited CSS files

No audited stylesheet owner was found for most of these selectors:

- `.aicmd-section`
- `.aicmd-overview`
- `.aicmd-section-head`
- `.aicmd-overview-grid`
- `.aicmd-stat`
- `.aicmd-stat-wide`
- `.aicmd-agent-grid`
- `.aicmd-agent-card`
- `.aicmd-agent-meta`
- `.aicmd-btn`
- `.aicmd-btn-primary`
- `.aicmd-btn-secondary`
- `.aicmd-btn-ghost`
- `.aicmd-label`
- `.aicmd-textarea`
- `.aicmd-action-row`
- `.aicmd-draft-state`
- `.aicmd-suggestions`
- `.aicmd-suggestion-card`

Only `.aicmd-shell` and `.aicmd-operating-strip` were found in `12-pages.css`.

### Governance partial / missing dedicated bindings

The following governance selectors appear in markup but do not have a dedicated owner in the inspected style files:

- `.governance-shell`
- `.governance-workspace`
- `.governance-workspace-grid`
- `.governance-actions`
- `.governance-overview-grid`
- `.governance-activity-list`
- `.governance-activity-item`
- `.governance-selected-grid`
- `.governance-selected-item`
- `.governance-focus-tabs`
- `.governance-focus-tab`

Governance therefore leans on generic `.panel`, shared `std-*`, and a few Settings-adjacent selector names.

### Setup partial binding gaps

Setup has broad grouped coverage in `12-pages.css`, but many specific shells/panels are still only indirectly styled through `.card` plus grid groups, including:

- `.setup-smart-steps-panel`
- `.setup-smart-form-panel`
- `.setup-smart-gaps-panel`
- `.setup-smart-validation-panel`
- `.setup-smart-handoff-panel`
- `.setup-smart-step-item`
- `.setup-smart-gap-item`

These are not fully unstyled, but they are not strongly bound to a modern visual hierarchy system either.

### Publishing ownership gap

Publishing selectors are not missing styles, but they are missing shared stylesheet ownership. Their owner is the inline `<style>` block in `publishing.js`, which keeps them outside the audited global/page CSS layer system.

## Which Old Selectors Should Not Be Deleted Yet but Should Be Marked as Legacy?

Keep, but mark as legacy / migration-boundary:

- `.card`
- `.panel`
- `.data-card`
- `.simple-banner`
- `.quick-action-btn`
- `.card-badge`
- `.setup-*` grouped shell classes in `12-pages.css`
- generic page recovery selectors in `14-page-standard.css`:
  - `.page .card`
  - `.page .panel`
  - `article[class*="card"]`
  - `div[class*="card"]`
- Publishing inline `.publishing-*` styles in `publishing.js`
- empty `styles/integrations/*.css` files should remain in place until ownership is deliberately moved out of `14-page-standard.css`

These selectors are still carrying production UI. They should be labeled legacy in planning/docs, not removed in the next density patch.

## Which Shared Primitives Should Be Tuned Globally?

Highest-value global tuning targets:

1. `.panel`, `.card`, `.data-card`
   - Reduce perceived weight by softening default shadow/radius and clarifying when a container is structural vs. a card.

2. `.quick-action-btn`
   - Make wrap-safe, compact, and multi-line friendly globally.

3. `.card-badge`
   - Keep compact and informational; avoid oversized pill treatment.

4. `.simple-banner`
   - Flatten into a lower-emphasis guidance/status strip instead of a mini-card.

5. `:where(.std-detail-card)`, `:where(.std-action-panel)`, `:where(.std-ai-panel)`
   - Consolidate duplicate definitions and reduce premium-card weight.

6. `:where(.std-action-row)` and `:where(.std-quick-actions)`
   - Standardize compact action density globally.

7. `.std-context-ribbon`, `.std-context-title`, `.std-context-description`, `.std-context-chip`, `.std-context-btn`
   - Reduce page-header visual dominance and eliminate unnecessary nowrap/ellipsis behavior where it hurts hierarchy.

8. `mhos-clean-*` adoption primitives
   - Prefer `mhos-clean-surface`, `mhos-clean-btn`, `mhos-clean-pill` as the target compact language for operating pages after the shared correction pass.

## Which Pages Require Their Own Visual Binding Polish After Global Correction?

### High-priority page follow-up

1. AI Command
   - Needs a complete page-specific visual binding pass because most `aicmd-*` selectors are not styled in the audited CSS layers.

2. Publishing
   - Needs extraction or reconciliation of inline page styles into the canonical CSS layer system after the shared primitives are corrected.

3. Setup
   - Needs page-specific hierarchy polish because the structure is still a stack of old `.card` surfaces and partially bound setup selectors.

### Medium-priority page follow-up

4. Governance
   - Needs dedicated governance selector bindings so it is not leaning on Settings-like blocks and generic panel defaults.

5. Job Monitor / operations centers
   - Needs a smaller follow-up pass only after global surface tuning, mainly to reduce nested-card feel and ensure the compact ops system still wins.

### Lower-priority page follow-up

6. Integrations
   - Already more compact than some pages, but ownership should be clarified because dedicated integration CSS files are empty while `14-page-standard.css` carries page-specific integration styling.

## Page-by-Page Visual Risk Table

| Page | Current risk | Why it still feels wrong | After global fix, page follow-up needed? |
| --- | --- | --- | --- |
| Job Monitor | Medium | Compact local ops CSS exists, but nested surfaces and inherited panel/card language still make it feel boxed. | Yes, light follow-up.
| Setup | High | Mostly old card stack, weak panel hierarchy, many page-specific classes only partially bound, native/basic control feel remains. | Yes, strong follow-up.
| AI Command | High | Most `aicmd-*` selectors have no audited CSS owner, so hierarchy is weak and controls/cards feel basic or generic. | Yes, strong follow-up.
| Publishing | High | Entire page uses page-local inline CSS and many separate boxed subcomponents; queue rows and chips read as legacy cards. | Yes, strong follow-up.
| Settings | Low | Best-bound page; local density polish already done and shared primitives are intentionally composed. | Only regression check after global patch.
| Governance | Medium | Uses shared standard/clean primitives, but page-specific governance classes are under-bound and hierarchy is not fully explicit. | Yes, moderate follow-up.
| Integrations | Medium | Compact in parts, but ownership is split and dedicated integration CSS files are empty. | Yes, moderate follow-up later.

## What Should Be Fixed Globally

Global correction should focus on the shared primitives, not page redesign:

1. Consolidate `std-*` selector ownership in `14-page-standard.css`.
   - Remove duplication at the source of truth level in a later implementation patch.

2. Reduce default visual weight of shared surfaces.
   - Lower radius and shadow strength on the shared card/panel language.
   - Separate structural containers from actual emphasis cards.

3. Make shared actions wrap-safe and compact.
   - Fix `.quick-action-btn` and related shared action primitives globally.

4. Lower context-ribbon dominance.
   - Trim `std-context-*` density so the page shell does not compete with the main operating surface.

5. Normalize typography hierarchy.
   - Keep headers readable but reduce repeated 700/800 emphasis across labels, badges, and metrics.

6. Treat `mhos-clean-*` as the target compact operating language.
   - Do not force migration yet, but shape shared corrections toward compatibility with it.

## What Should Be Fixed Page-by-Page

### Setup

- Bind setup panel classes more explicitly after the global pass.
- Replace stacked equal-weight cards with clearer page panel, step panel, field group, and diagnostics hierarchy.
- Normalize input/control styling so the page stops reading as a mix of premium shell and basic form controls.

### AI Command

- Add explicit stylesheet bindings for the missing `aicmd-*` selectors.
- Introduce hierarchy between overview, specialist selection, composer, quick actions, and current AI state.
- Replace generic large stacked sections with a deliberate operator surface.

### Publishing

- Reconcile inline publishing CSS with canonical stylesheet ownership.
- Flatten queue rows, chips, and workflow/readiness blocks so the page stops reading as many independent cards.
- Normalize button hierarchy and contrast with the global action model.

### Governance

- Add explicit governance bindings for page grids, focus tabs, selected-item area, and activity blocks.
- Keep existing shared primitives, but add a thin governance visual binding layer.

### Operations pages

- Keep existing compact ops layout, but trim nested detail cards and ensure the shared global patch does not re-inflate them.

## What Should Not Be Touched Yet

- Do not delete legacy `.panel`, `.card`, `.data-card`, `.quick-action-btn`, `.card-badge`, or `.simple-banner` selectors yet.
- Do not delete Setup page shell selectors from `12-pages.css` yet.
- Do not delete Publishing inline CSS yet.
- Do not delete empty integrations CSS files yet.
- Do not redesign Home as part of the next patch.
- Do not attempt broad page markup changes in the density patch.

## Recommended Next Implementation Patch

### Patch type

Global density and hierarchy correction only.

### Patch scope

Shared CSS only:

- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/styles/15-clean-operating-layer.css`
- optional token-level trims in `public/control-center/styles/00-tokens.css` if needed for consistency

### Patch goals

1. Make shared panels/cards less heavy.
2. Make shared actions and chips compact and wrap-safe.
3. Consolidate `std-*` duplicates into one canonical owner.
4. Reduce page-header/context-ribbon dominance.
5. Leave page markup untouched.

### Deliberately out of scope for that patch

- Publishing page-local rewrite.
- AI Command page-local visual rebuild.
- Setup page-specific hierarchy rewrite.
- Governance dedicated visual binding pass.

### Expected outcome

After the global patch, Settings and Governance should remain stable, operations pages should become slightly lighter, and the remaining page-specific deficiencies on Setup, AI Command, and Publishing will be easier to see and fix in targeted follow-up passes.

## Browser QA Checklist

Run browser QA after the global patch with focus on these checks:

1. Verify page-level surfaces no longer all read as equal-weight cards.
2. Verify `.panel` and `.data-card` feel flatter and less boxed across Settings, Governance, Job Monitor, Setup, AI Command, and Publishing.
3. Verify `.quick-action-btn` wraps safely on narrow widths and long labels.
4. Verify `.card-badge` remains readable but no longer dominates hierarchy.
5. Verify `.simple-banner` reads as supporting guidance, not as another card.
6. Verify `std-context-*` ribbons do not overpower the main work area.
7. Verify Job Monitor still feels compact after any shared panel changes.
8. Verify Settings does not regress after the shared density correction.
9. Verify Governance still preserves distinct detail/action/AI grouping.
10. Verify Setup inputs and buttons do not become visually broken even before Setup-specific follow-up polish.
11. Verify AI Command remains functional and identify which missing bindings still require page polish.
12. Verify Publishing queue rows, filter pills, and workflow cards still render correctly until a dedicated Publishing pass happens.
13. Verify mobile widths do not reintroduce clipped text or unsafe nowrap behavior.
14. Verify hover/focus states remain visible after shadow/radius reductions.

## Rollback / Safety Notes

- Global patch should be CSS-only and avoid page markup changes.
- Because many pages still rely on legacy selectors, reduce visual weight incrementally rather than deleting old rules.
- Keep the first implementation patch limited to shared primitives so regressions are easy to isolate.
- Publishing should be treated as a special risk because it owns inline CSS outside the shared stylesheet system.
- AI Command is a second special risk because many selectors appear unbound; a global patch will not fix its missing hierarchy by itself.
- If a shared change destabilizes Settings or Governance, rollback should target the specific shared primitive change rather than reverting page-local polish.

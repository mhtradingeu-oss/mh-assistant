# Frontend CSS Audit

## Loaded CSS order (index.html)
1. styles/00-tokens.css
2. styles/01-reset.css
3. styles/02-layer-system.css
4. styles/03-app-shell.css
5. styles/07-sidebar.css
6. styles/10-topbar-canonical.css
7. styles/04-command-layer.css
8. styles/05-ai-layer.css
9. styles/08-components-foundation.css
10. styles/09-operations-centers.css
11. styles/12-pages.css
12. styles/13-home-executive.css
13. styles/14-page-standard.css

## Not loaded by index.html
- public/control-center/legacy/*.css (all legacy CSS not linked)
- public/control-center/styles/integrations/*.css (all 0-byte placeholders and not linked)

## Duplication and layout authority overlap
Strong duplication remains between active layered styles and legacy monolith styles.

Requested selector findings:
- .topbar: active in 10-topbar-canonical.css; also heavily present in legacy/styles.legacy-full.css and legacy/06-topbar.legacy.css.
- .sidebar: active in 07-sidebar.css; also in legacy/styles.legacy-full.css and partial rules in 14-page-standard.css.
- .workspace: active in 03-app-shell.css and 14-page-standard.css; also in legacy/styles.legacy-full.css and legacy/99-legacy-compat.legacy.css.
- .page: active in 03-app-shell.css, 12-pages.css, 14-page-standard.css; also extensive legacy definitions.
- .std-page-shell: active in 14-page-standard.css; also in legacy styles.
- .ops-shell: present in 09-operations-centers.css and in legacy styles.
- .governance-shell: active in 09-operations-centers.css/12-pages.css scope plus governance page styling markers; legacy overlap exists.
- .settings: broad class families in 12-pages.css and 14-page-standard.css; legacy overlap by generic card/page selectors.
- .library: large active library sections in 12-pages.css + 14-page-standard.css; duplicate legacy library blocks are extensive.
- .command and command bar classes: active in 04-command-layer.css; duplicated in legacy/styles.legacy-full.css and legacy/09-command-legacy-isolation.legacy.css.
- .ai-dock: defined in active ai-layer stylesheet and legacy monolith variants.
- .loading-overlay: active in layer-system/operations and legacy overlays.
- .card, .btn, .grid: active components-foundation/pages/page-standard plus legacy broad definitions.

## Conflicting responsive risk
- Responsive rules appear in both modern layered files and legacy monolith files for topbar/sidebar/command/page zones.
- Risk is currently mitigated because legacy styles are not linked in index.html.
- If legacy CSS is accidentally linked, layout drift risk is high.

## Page-specific leakage risk
- 14-page-standard.css contains large page-specific blocks (especially library) under [data-page="library"] and generic .page/.card selectors.
- 09-operations-centers.css includes some compatibility selectors targeting both notification-center and notifications aliases.

## Duplicate utility surface
- Utility-like primitives (.card, .btn, .page-grid, shell spacing) exist in multiple active files and legacy monolith.
- Authority currently depends on load order discipline.

## Emergency override signals
Legacy override patch files present:
- 11-runtime-safety-overrides.legacy.css
- 99-legacy-compat.legacy.css
- 09-command-legacy-isolation.legacy.css

## Suggested consolidation sequence (recommendation second)
1. Freeze and document active canonical ownership by layer:
   - tokens/reset/layer-system/app-shell/sidebar/topbar/command/ai/components/pages/page-standard/ops/home
2. Keep legacy CSS excluded from index.html (already true).
3. Move any still-needed compatibility declarations from legacy files into one controlled compatibility layer file under styles/.
4. Split heavy page-specific blocks from 14-page-standard.css into per-page modules only after route ownership freeze.
5. Remove notifications alias selectors after route alias sunset is formally approved.

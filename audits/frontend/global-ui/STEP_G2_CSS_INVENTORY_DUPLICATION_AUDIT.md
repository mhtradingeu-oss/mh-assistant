# STEP G2 — CSS Inventory & Duplication Audit

**Scope:** Control Center CSS only. No code or CSS changes. Audit only.

---

## 1. Active CSS Load Order
- 00-tokens.css
- 01-reset.css
- 02-layer-system.css
- 03-app-shell.css
- 07-sidebar.css
- 10-topbar-canonical.css
- 04-command-layer.css
- 05-ai-layer.css
- 08-components-foundation.css
- 09-operations-centers.css
- 12-pages.css
- 13-home-executive.css
- 14-page-standard.css
- 15-clean-operating-layer.css

## 2. All Active CSS Files
- public/control-center/styles/00-tokens.css
- public/control-center/styles/01-reset.css
- public/control-center/styles/02-layer-system.css
- public/control-center/styles/03-app-shell.css
- public/control-center/styles/04-command-layer.css
- public/control-center/styles/05-ai-layer.css
- public/control-center/styles/07-sidebar.css
- public/control-center/styles/08-components-foundation.css
- public/control-center/styles/09-operations-centers.css
- public/control-center/styles/10-topbar-canonical.css
- public/control-center/styles/12-pages.css
- public/control-center/styles/13-home-executive.css
- public/control-center/styles/14-page-standard.css
- public/control-center/styles/15-clean-operating-layer.css

## 3. Legacy CSS Files Not Currently Loaded
- public/control-center/legacy/styles.legacy-full.css
- public/control-center/legacy/06-topbar.legacy.css
- public/control-center/legacy/99-legacy-compat.legacy.css
- public/control-center/legacy/11-runtime-safety-overrides.legacy.css
- public/control-center/legacy/styles.legacy-20260508.css
- public/control-center/legacy/09-command-legacy-isolation.legacy.css

## 4. Duplicate Selectors (Grouped)
- .sidebar, .sidebar-brand, .sidebar-brand h1, .sidebar-brand p, .brand-badge, .sidebar-project, .nav-group-title, .sidebar-nav, .nav-group, .nav-item, .nav-item:hover, .nav-item.is-active, .sidebar-actions, .sidebar-backdrop, .sidebar-backdrop.is-visible, .sidebar-toggle
  - Found in both active and legacy CSS (risk of overlap)
- .app-shell, .os-layout, .main-shell, .topbar, .topbar-left, .topbar-right
  - Found in both active and legacy CSS
- .page, .page.is-active
  - Found in both active and legacy CSS
- .std-page-shell, .std-smart-strip, .std-smart-strip-copy
  - Found in both active and legacy CSS
- .setup-helper, .setup-form-grid, .setup-field-group, .setup-field-group.is-missing, .setup-field-head, .setup-field-state.is-ready, .setup-field-state.is-missing
  - Found in both active and legacy CSS
- .btn, .btn-primary, .btn-danger, .btn-warning
  - Found in both active and legacy CSS

## 5. Repeated Page-Specific Blocks
- **Library:** [data-page="library"] selectors in 14-page-standard.css
- **Publishing:** .publishing-* selectors in 12-pages.css
- **Governance:** .governance-* selectors in 12-pages.css
- **Settings:** [data-page="setup"] selectors in 12-pages.css
- **Operations:** [data-page="task-center"] selectors in 09-operations-centers.css
- **AI Command:** .aicmd-* selectors in 12-pages.css

## 6. Global Primitives Present
- :root variables in 00-tokens.css
- Reset and box-sizing in 01-reset.css
- Layer/z-index tokens in 02-layer-system.css
- App shell/grid/flex primitives in 03-app-shell.css
- Button, card, panel, badge, chip, and grid classes

## 7. Emergency Patching / Override Layering
- 15-clean-operating-layer.css is opt-in, inert unless page uses mhos-clean-* classes
- 11-runtime-safety-overrides.legacy.css (legacy, not loaded)
- Some !important usage in inline styles (see app.js)

## 8. High-Risk Selectors
- .sidebar, .app-shell, .page, .btn, .card, .panel, .main-shell, .topbar
  - Affect all or most pages if changed
- [data-page] selectors (page-scoped, but risk if misused)

## 9. Recommended CSS Architecture
- **Global primitives:** 00-tokens.css, 01-reset.css, 02-layer-system.css, 03-app-shell.css
- **Page-scoped CSS:** 09-operations-centers.css, 12-pages.css, 13-home-executive.css, 14-page-standard.css
- **Deprecated/legacy quarantine:** All files in public/control-center/legacy/
- **Opt-in clean layer:** 15-clean-operating-layer.css (future migration)

## 10. Safe Cleanup Phases
1. Audit (this step)
2. Freeze (no new CSS/JS changes)
3. Migrate (move to page-scoped and opt-in clean layer)
4. Remove (delete legacy/quarantined CSS)

## 11. Files That Should NOT Be Touched Yet
- All files in public/control-center/legacy/
- 15-clean-operating-layer.css (do not modify, only opt-in)
- 00-tokens.css, 01-reset.css, 02-layer-system.css, 03-app-shell.css (global primitives)
- 12-pages.css, 14-page-standard.css (page structure)

---

See STEP_G2_CSS_SELECTOR_EVIDENCE.txt for raw selector evidence and grep logs for full details.
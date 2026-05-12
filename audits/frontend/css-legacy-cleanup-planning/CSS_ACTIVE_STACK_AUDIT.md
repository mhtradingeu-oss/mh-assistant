# CSS Active Stack Audit

## Scope
- Repository: /opt/mh-assistant
- Branch: architecture/frontend-consolidation-v1
- Mode: Audit/plan only (no production edits)
- Evidence: audits/frontend/css-legacy-cleanup-planning/CSS_LEGACY_EVIDENCE.txt

## 1) CSS loaded today (exact order from index.html)
Active production load order from public/control-center/index.html:
1. ./styles/00-tokens.css?v=20260508-tokens-1
2. ./styles/01-reset.css?v=20260508-reset-1
3. ./styles/02-layer-system.css?v=20260510-loading-overlay-1
4. ./styles/03-app-shell.css?v=20260508-shell-1
5. ./styles/07-sidebar.css?v=20260508-sidebar-2
6. ./styles/10-topbar-canonical.css?v=20260508-topbar-canonical-2
7. ./styles/04-command-layer.css?v=20260508-command-1
8. ./styles/05-ai-layer.css?v=20260508-ai-layer-1
9. ./styles/08-components-foundation.css?v=20260508-components-1
10. ./styles/09-operations-centers.css?v=20260511-task-center-layout-1
11. ./styles/12-pages.css?v=20260508-pages-1
12. ./styles/13-home-executive.css?v=20260508-home-executive-1
13. ./styles/14-page-standard.css?v=20260510-library-polish-1

### Active stack ownership (current authority)
- tokens: styles/00-tokens.css
- reset: styles/01-reset.css
- layer/z-index and global overlays: styles/02-layer-system.css
- app shell and workspace baseline: styles/03-app-shell.css
- sidebar canonical: styles/07-sidebar.css
- topbar canonical: styles/10-topbar-canonical.css
- command layer canonical: styles/04-command-layer.css
- AI dock/layer canonical: styles/05-ai-layer.css
- component primitives (.btn, .card, form controls): styles/08-components-foundation.css
- operations centers route-scoped surfaces: styles/09-operations-centers.css
- broad page-level patterns (home/setup/library/content): styles/12-pages.css
- home executive visual layer: styles/13-home-executive.css
- standard page compatibility/shared compact shell + library-heavy compatibility: styles/14-page-standard.css

### Production-loaded CSS files
Production loaded CSS is exactly the 13 files above, all from public/control-center/styles.

### styles.css status
- public/control-center/styles.css does not exist.
- It is not loaded by index.html.

## 2) CSS not loaded today
### Legacy CSS present but not linked by index.html
- public/control-center/legacy/06-topbar.legacy.css
- public/control-center/legacy/09-command-legacy-isolation.legacy.css
- public/control-center/legacy/11-runtime-safety-overrides.legacy.css
- public/control-center/legacy/99-legacy-compat.legacy.css
- public/control-center/legacy/styles.legacy-20260508.css
- public/control-center/legacy/styles.legacy-full.css

### Integration placeholder CSS (not linked, 0-byte)
- public/control-center/styles/integrations/cards.css
- public/control-center/styles/integrations/drawer.css
- public/control-center/styles/integrations/forms.css
- public/control-center/styles/integrations/grid.css
- public/control-center/styles/integrations/layout.css
- public/control-center/styles/integrations/responsive.css

### Compatibility/old CSS conclusion
- Legacy CSS exists under public/control-center/legacy and is currently safe because it is not linked in index.html.
- Risk remains if legacy files are accidentally relinked later.

## 3) JS legacy files present and load state
### Legacy JS files found
- public/control-center/legacy/integrations.monolith-20260508.js
- public/control-center/legacy/page-standard.legacy-20260508.js

### Load/import state
- No script tags in public/control-center/index.html reference these legacy JS files.
- No references found in active import paths (index/app/router/pages/ui scans for integrations.monolith and page-standard.legacy).

### Related active compatibility JS
- app.js imports ./ui/page-standard.js (active compatibility helper path).
- ui/page-standard.js actively handles .std-page-shell scaffolding when invoked.

### Keep-now safety
- Safe to keep for now as compatibility archive artifacts.
- Do not delete until explicit retirement + rollback plan is approved.

## 6) CSS authority map (canonical ownership)
Current canonical map:
- tokens: styles/00-tokens.css
- reset: styles/01-reset.css
- layer system and global loading/error overlays: styles/02-layer-system.css
- app shell/workspace core: styles/03-app-shell.css
- sidebar: styles/07-sidebar.css
- topbar: styles/10-topbar-canonical.css
- command layer: styles/04-command-layer.css
- AI layer: styles/05-ai-layer.css
- components foundation: styles/08-components-foundation.css
- operations centers: styles/09-operations-centers.css
- page/common styles: styles/12-pages.css
- home executive: styles/13-home-executive.css
- page-standard compatibility and shared compact shell: styles/14-page-standard.css

Authority warning:
- styles/14-page-standard.css currently contains both compatibility shell logic and substantial page-specific/library-specific rules; this is the major authority-blur zone.

## Summary
- Active production CSS authority is the 13-file layered stack in index.html load order.
- Legacy CSS/JS is present but not loaded.
- The largest cleanup-planning target is authority overlap between broad page styles (12) and page-standard compatibility/library-heavy rules (14), while preserving behavior and load order.

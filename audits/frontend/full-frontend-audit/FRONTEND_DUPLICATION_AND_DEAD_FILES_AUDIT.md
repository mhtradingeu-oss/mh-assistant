# Frontend Duplication And Dead Files Audit

## Duplicate and backup candidate files
Detected candidate set:
- public/control-center/legacy/06-topbar.legacy.css
- public/control-center/legacy/09-command-legacy-isolation.legacy.css
- public/control-center/legacy/11-runtime-safety-overrides.legacy.css
- public/control-center/legacy/99-legacy-compat.legacy.css
- public/control-center/legacy/page-standard.legacy-20260508.js
- public/control-center/legacy/styles.legacy-20260508.css
- public/control-center/legacy/styles.legacy-full.css

These appear intentionally archived/compatibility-oriented.

## Empty frontend files
- public/control-center/styles/integrations/cards.css
- public/control-center/styles/integrations/drawer.css
- public/control-center/styles/integrations/forms.css
- public/control-center/styles/integrations/grid.css
- public/control-center/styles/integrations/layout.css
- public/control-center/styles/integrations/responsive.css

## Duplicate basenames
- state.js appears in:
  - public/control-center/state.js
  - public/control-center/pages/integrations/state.js

## Not-loaded CSS/JS in active startup
Not loaded by index.html:
- all public/control-center/legacy/*.css and legacy JS files
- styles/integrations/*.css placeholders

Script-loaded but non-module:
- runtime/command-runtime.js (declared as runtime skeleton, active:false snapshot API)

## Legacy folders and dead-folder signals
- public/control-center/legacy is explicitly legacy.
- public/control-center/pages-core is empty.
- public/control-center/layouts is empty.

## Unreferenced module candidates (from import graph scan)
- public/control-center/ai-team-model.js
- public/control-center/legacy/integrations.monolith-20260508.js
- public/control-center/legacy/page-standard.legacy-20260508.js
- public/control-center/pages/integrations/layout.js
- public/control-center/pages/integrations/state.js
- public/control-center/pages/library/catalog-readiness.js
- public/control-center/runtime/runtime-boundaries.js

## Unsafe-to-leave-in-active-path assessment
- Legacy files under public/control-center/legacy are currently safe if never linked/imported.
- Main risk is accidental relinking during future merges or emergency fixes.
- Empty placeholder CSS files are low runtime risk but high confusion risk.

## Cleanup candidates (later, not now)
1. Formal retire list for legacy css/js set.
2. Ownership decision on ai-team-model.js and runtime-boundaries.js.
3. Decide whether integrations/layout.js and integrations/state.js are planned or stale.
4. Remove or document empty pages-core/layouts directories.
5. Decide whether to keep styles/integrations placeholders or remove after style plan approval.

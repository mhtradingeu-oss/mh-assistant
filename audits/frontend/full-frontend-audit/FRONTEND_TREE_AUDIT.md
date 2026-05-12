# Frontend Tree Audit

## Scope and evidence
- Evidence source: audits/frontend/full-frontend-audit/SCAN_EVIDENCE.txt
- Supporting derived evidence: audits/frontend/full-frontend-audit/derived/*
- Branch audited: architecture/frontend-consolidation-v1

## Actual frontend tree summary
Primary frontend is concentrated in:
- public/control-center

Observed sub-areas:
- Entrypoints: index.html, app.js, router.js
- Runtime: runtime/*
- Pages: pages/*.js and page submodules in pages/home, pages/integrations, pages/library
- Styles: styles/*.css and styles/integrations/*.css
- UI helpers: ui/page-standard.js
- API/state/context: api.js, state.js, shared-context.js, constants.js, asset-library.js
- Legacy: legacy/* (css/js snapshots)

Public directory scan indicates no second active frontend root under public besides control-center.

## Canonical folders (active)
- public/control-center/pages
- public/control-center/styles
- public/control-center/runtime
- public/control-center/ui
- public/control-center/pages/integrations
- public/control-center/pages/library
- public/control-center/pages/home

## Suspected legacy/compatibility folders and files
- public/control-center/legacy
- public/control-center/legacy/styles.legacy-full.css
- public/control-center/legacy/styles.legacy-20260508.css
- public/control-center/legacy/06-topbar.legacy.css
- public/control-center/legacy/09-command-legacy-isolation.legacy.css
- public/control-center/legacy/11-runtime-safety-overrides.legacy.css
- public/control-center/legacy/99-legacy-compat.legacy.css
- public/control-center/legacy/page-standard.legacy-20260508.js
- public/control-center/legacy/integrations.monolith-20260508.js

These are present but not loaded by index.html in current startup path.

## Active vs likely inactive frontend files
Active by startup path:
- index.html loads CSS stack 00..14, runtime/command-runtime.js, app.js
- app.js imports router.js, api.js, state.js, ui/page-standard.js, runtime overlay helpers
- router.js imports all route owners from pages/*.js

Likely inactive in normal route flow (not imported by active module graph):
- public/control-center/legacy/page-standard.legacy-20260508.js
- public/control-center/legacy/integrations.monolith-20260508.js
- public/control-center/ai-team-model.js
- public/control-center/pages/integrations/layout.js
- public/control-center/pages/integrations/state.js
- public/control-center/pages/library/catalog-readiness.js
- public/control-center/runtime/runtime-boundaries.js

Special case:
- public/control-center/runtime/command-runtime.js is not imported by modules but is script-loaded directly from index.html.

## Entrypoint and script loading audit
Current startup load order from index.html:
- Inline script block (pre-module runtime setup)
- runtime/command-runtime.js (classic script)
- app.js (type="module")

Entrypoint authority:
- app.js is effective frontend runtime authority for init, binding, state rendering, and API wiring.
- router.js owns route registry and template routing.

Hidden global markers observed:
- app.js writes and reads several window-scoped keys (control key/runtime/debug/startup and UI cache markers).
- runtime/command-runtime.js exposes window.__MH_COMMAND_RUNTIME__ (declared inactive skeleton).

Duplicated runtime layer signals:
- Standard page compatibility runtime exists in ui/page-standard.js while all active routes currently bypass it via disableStandardLayout.
- Legacy page-standard runtime file remains in legacy path.

Startup race-risk notes:
- app.js init has many listener/timer installs and async startup phases; it includes startup guardrails and timeout-based fallbacks.
- Project loading uses Promise.race timeout fallback, reducing hard-block risk but introducing partial-startup states.

## Duplicate/near-duplicate structure signals
- state.js basename appears twice:
  - public/control-center/state.js
  - public/control-center/pages/integrations/state.js
- Page standard compatibility exists in both:
  - public/control-center/ui/page-standard.js (active)
  - public/control-center/legacy/page-standard.legacy-20260508.js (legacy)
- Large style duplication pattern:
  - Active layered CSS in styles/*.css
  - Legacy monolith CSS in legacy/styles.legacy-full.css and legacy/styles.legacy-20260508.css

## Empty and placeholder folders/files
Empty directories:
- public/control-center/pages-core
- public/control-center/layouts

Empty CSS files (0 bytes):
- public/control-center/styles/integrations/cards.css
- public/control-center/styles/integrations/drawer.css
- public/control-center/styles/integrations/forms.css
- public/control-center/styles/integrations/grid.css
- public/control-center/styles/integrations/layout.css
- public/control-center/styles/integrations/responsive.css

## Files that should not be loaded in production (currently not loaded)
- Entire public/control-center/legacy/* set appears compatibility/archive oriented.
- Empty styles/integrations/*.css files should remain unloaded unless populated intentionally.

## Cleanup candidates (do not delete now)
Priority candidates for later cleanup audit/decision:
- legacy css/js set in public/control-center/legacy
- unreferenced helper modules listed above
- empty pages-core and layouts directories
- empty styles/integrations/*.css placeholders

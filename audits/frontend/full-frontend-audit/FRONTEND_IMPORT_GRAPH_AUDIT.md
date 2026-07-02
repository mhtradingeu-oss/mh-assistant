# Frontend Import Graph Audit

## Import graph summary
- Total JS files under public/control-center: 49
- Total relative imports: 78
- Unresolved relative imports: 0
- Entrypoint path:
  - index.html loads app.js (module) and runtime/command-runtime.js (classic script)
  - app.js imports router.js, api.js, state.js, ui/page-standard.js, runtime helpers
  - router.js imports all page route owners

## Broken/missing imports
- No broken relative import paths detected in the active JS graph scan.

## Orphan/unreferenced module candidates
Candidates from static import graph (not imported by other modules and not app/router entry files):
- public/control-center/ai-team-model.js
- public/control-center/legacy/integrations.monolith-20260508.js
- public/control-center/legacy/page-standard.legacy-20260508.js
- public/control-center/pages/integrations/layout.js
- public/control-center/pages/integrations/state.js
- public/control-center/pages/library/catalog-readiness.js
- public/control-center/runtime/runtime-boundaries.js

Special case:
- public/control-center/runtime/command-runtime.js is script-loaded directly from index.html, so it is active even without import edges.

## Export pressure and potential unused exports
- Export count is high (282), import count is lower (78), indicating helper modules with broad exports.
- High-probability unused export clusters exist in integrations and legacy modules.

## Duplicate helper and abstraction signals
- state.js basename collision:
  - global app state: public/control-center/state.js
  - integrations local state helpers: public/control-center/pages/integrations/state.js
- asString/asObject/asArray utility patterns recur across many files/modules.
- Legacy and active page-standard implementations coexist.

## Module organization consistency
Stable areas:
- library page submodules grouped under pages/library/*.
- integrations page submodules grouped under pages/integrations/*.

Inconsistency signals:
- integrations/layout.js and integrations/state.js appear disconnected from current integrations.js imports.
- catalog-readiness helper under library appears disconnected from current library.js imports.

## Suggested module structure direction
- Keep app/router/page-route ownership unchanged for now.
- Add an explicit module ownership map (active, compatibility, legacy, planned).
- Introduce a no-orphan CI check for page-level submodules after cleanup decisions.
- Retire legacy JS modules only after a compatibility contract is documented.

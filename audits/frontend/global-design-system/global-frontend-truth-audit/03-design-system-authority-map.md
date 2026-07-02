# 03 Design System Authority Map

## Current Authority

### Shell And Route Authority

- `index.html`: global shell, sidebar, topbar, command bar, loading/startup/fatal panels, floating AI dock.
- `router.js`: route registry, route template insertion, active nav, topbar metadata, role access fallback.
- `app.js`: startup, state, API context, protected write handling, route render lifecycle.

### Data And Context Authority

- `api.js`: API client and access-key diagnostics.
- `state.js`: app state container.
- `shared-context.js`: transient cross-page context and handoff caches.
- `runtime/authority/**`: route role and permission projection.
- `runtime/lifecycle/**`: listener lifecycle registry.
- `runtime/command-runtime.js`: global command runtime loaded before `app.js`.

### Page Authority

- `pages/*.js`: page route definitions, page render logic, local session models, event handlers.
- `pages/library/**`: Library action panel, AI panel, command router, session store, listener lifecycle.
- `pages/integrations/**`: Integrations submodules for models, cards, drawers, render helpers.
- `pages/ai-command/tool-dock.js`: AI Command Tool Drawer and Library source interaction logic.

### CSS Authority

Active load order from `index.html`:

- `00-tokens.css`: tokens and theme variables.
- `01-reset.css`: reset.
- `02-layer-system.css`: layers, overlays, startup/loading.
- `03-app-shell.css`: app shell.
- `07-sidebar.css`: sidebar and nav.
- `10-topbar-canonical.css`: topbar.
- `04-command-layer.css`: command bar.
- `05-ai-layer.css`: floating AI dock.
- `08-components-foundation.css`: buttons, cards, panels, badges, forms, shared component primitives, Tool Drawer.
- `mhos-action-primitives.css`: action primitives.
- `09-operations-centers.css`: operations center page CSS.
- `12-pages.css`: large page-specific bundle and legacy page variants.
- `13-home-executive.css`: Home executive surface.
- `14-page-standard.css`: standard page bridge, Library and Integrations selectors, page-specific refinements.
- `15-clean-operating-layer.css`: opt-in clean layer and operating primitives.
- `mhos-workflow-primitives.css`: workflow primitives.
- `mhos-context-primitives.css`: context primitives.
- `mhos-executive-surface-primitives.css`: executive surface primitives.

## Evidence From Existing Audit Contracts

`audits/frontend/global-ui/STEP_G3_FINAL_CSS_ARCHITECTURE_BLUEPRINT.md` defines a layered CSS model and a rule that no selector should exist in more than one active CSS file.

`audits/frontend/global-ui/GLOBAL_FINAL_THEME_AUDIT_AND_DESIGN_CONTRACT.md` confirms:

- Modular CSS is active.
- Layers overlap.
- Too many competing surface systems coexist.
- `14-page-standard.css` is a migration bridge, not final form.
- `15-clean-operating-layer.css` is an opt-in migration target.

## Current Design-System Gaps

1. Page JS owns too much visual structure through page-local class families.
2. `12-pages.css` is very large and contains mixed page concerns.
3. `14-page-standard.css` contains both shared standards and page-specific overrides.
4. `15-clean-operating-layer.css` and newer `mhos-*` primitives are not adopted consistently.
5. Empty `styles/integrations/*.css` files exist, while Integrations styling still lives in broader active CSS files.
6. The same semantic ideas have multiple class families:
   - cards/surfaces: `.card`, `.panel`, `.data-card`, `.mhos-clean-surface`, `.mhos-executive-panel`
   - actions: `.btn`, `.quick-action-btn`, `.std-action-btn`, page-local action buttons
   - chips/badges: `.card-badge`, `.std-context-chip`, `.mhos-os-chip`, page-local status badges
   - AI surfaces: floating dock, page AI panels, Tool Drawer, AI guidance panels

## Recommended Authority Model

Do not introduce a new framework or rewrite.

Future patches should follow this authority:

- Tokens: only `00-tokens.css`.
- Global chrome: `03-app-shell.css`, `07-sidebar.css`, `10-topbar-canonical.css`, `04-command-layer.css`, `05-ai-layer.css`.
- Shared primitives: `08-components-foundation.css`, `mhos-*-primitives.css`, `15-clean-operating-layer.css`.
- Page-specific layout: scoped under `[data-page="..."]` in a controlled page file or existing page bundle.
- Route semantics and handlers: page JS only.

## Reversible Modernization Rule

Every future visual patch should:

- Add or normalize classes without removing behavior.
- Keep route IDs, DOM IDs, data attributes, and handler selectors intact.
- Touch the smallest number of files.
- Include browser QA.
- Record selectors and rollback path before deleting CSS.

## Do Not Touch Without Dedicated Audit

- `data/projects/**`
- backend/API behavior
- command execution behavior
- access-key and protected write behavior
- route IDs and page data attributes
- startup loading/fatal panels
- Library upload, preview, source truth, and asset mutation handlers
- AI Command Tool Drawer source handoff behavior
- Governance durable policy mutation behavior

# T151A — CSS Authority Classification

## Status
Audit only.

## Baseline
- a036f3d Close Operations Centers runtime authority audit

## Purpose
Classify frontend CSS authority before any further page redesign.

## Authority Classification

### Token Authority
- `public/control-center/styles/00-tokens.css`

Owns design variables and should remain the source of truth for colors, spacing, radius, shadows, typography-related tokens, and layer variables where applicable.

### Reset Authority
- `public/control-center/styles/01-reset.css`

Owns browser reset and minimal normalization. Should not receive page-specific design logic.

### Layer / Overlay Authority
- `public/control-center/styles/02-layer-system.css`

Owns overlays, modals, toasts, visibility states, and z-index/layer behavior. Fixed positioning and important declarations here are expected only for global layer control.

### App Shell Authority
- `public/control-center/styles/03-app-shell.css`
- `public/control-center/styles/07-sidebar.css`
- `public/control-center/styles/10-topbar-canonical.css`

Own shell, sidebar, topbar, and page-root behavior. These should not receive page-specific cards/panels unless required for global shell layout.

### Component Foundation
- `public/control-center/styles/08-components-foundation.css`

Owns shared buttons, cards, panels, badges, grids, empty states, modals/drawers, and common UI primitives.

Risk:
This file is broad and already contains legacy shared classes. It should be extended carefully and only for truly global components.

### Page Standard / Compatibility Layer
- `public/control-center/styles/14-page-standard.css`

Owns standard page/context structures and compatibility patches across older/newer page patterns.

Risk:
This file contains many broad selectors, page-specific sections, and important declarations. It should be treated as a compatibility/consolidation layer, not the preferred place for new page-specific redesign.

### Legacy / Page Override Zone
- `public/control-center/styles/12-pages.css`

Owns many page-specific historical overrides.

Risk:
This is a high-risk file for visual entropy. Do not add new broad redesign rules here unless a targeted patch has no safer owner.

### Clean Operating Layer
- `public/control-center/styles/15-clean-operating-layer.css`

Appears to define a cleaner operating layer and should be reviewed as a candidate for future operating-surface normalization, but not expanded until its current scope is confirmed.

### MHOS Operating Surface Primitives
- `public/control-center/styles/mhos-executive-surface-primitives.css`
- `public/control-center/styles/mhos-action-primitives.css`
- `public/control-center/styles/mhos-context-primitives.css`
- `public/control-center/styles/mhos-workflow-primitives.css`

These are the preferred foundation for the next generation of operating surfaces.

Preferred direction:
Use these primitives for future Header / Main View / Action Panel / AI Panel normalization, instead of adding more broad overrides to `12-pages.css` or `14-page-standard.css`.

### Operations Page Owner
- `public/control-center/styles/09-operations-centers.css`

Owns Operations Centers, Task Center, Queue Center, Job Monitor, and Notification Center page-specific layout.

Use only for Operations-specific layout/polish after runtime authority has been closed.

### Integrations Page Owner
- `public/control-center/styles/integrations/*.css`

Owns Integrations-specific cards, drawer, forms, grid, layout, and responsive behavior.

## Design-System Decision
The safest next frontend direction is:

1. Do not expand `12-pages.css` unless unavoidable.
2. Do not add broad selectors to `14-page-standard.css` unless consolidating existing patterns.
3. Prefer MHOS primitives for new operating-surface work.
4. Use page-specific CSS only for page-specific layout.
5. Keep tokens/global components centralized.
6. Any UX upgrade must declare its CSS owner before implementation.

## Required Next Step
T151B should map each major page to its operating-surface readiness:
- Already aligned
- Partially aligned
- Not aligned
- High-risk legacy override surface

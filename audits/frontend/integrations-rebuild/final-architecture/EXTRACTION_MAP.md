# Integration OS Extraction Map

## Goal
Convert integrations.js from monolith page into modular operating system.

## New Runtime Ownership

### index.js
Shell bootstrap + route mount.

### state.js
Session state, drafts, filters, drawer state.

### render.js
Top-level workspace rendering.

### cards.js
Integration cards and metrics rendering.

### drawer.js
Drawer rendering, field rendering, focus control.

### events.js
All DOM events and listeners.

### actions.js
Server actions, sync, test, connect, reconnect.

### diagnostics.js
Warnings, blockers, readiness engine.

### utils.js
Formatting, helpers, scopes, labels, sanitizers.

## CSS Ownership

### layout.css
Workspace structure.

### grid.css
Responsive grids.

### cards.css
Card rendering system.

### drawer.css
Drawer system.

### forms.css
Inputs, focus, typing stability.

### responsive.css
Mobile/tablet/desktop behavior.

## Critical Rules

- No page file above 500 lines.
- No CSS file above 400 lines.
- No inline event logic in render functions.
- No giant card wrappers.
- No nested card-inside-card layouts.
- No duplicated selectors.
- No pointer-events hacks.
- No hidden overlays remaining interactive.

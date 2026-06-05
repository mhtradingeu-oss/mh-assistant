# Active CSS Authority Review

## Status
Completed.

## Confirmed Facts

### Clean working state
The Home P1 micro-polish experiment was saved to stash before starting global UI work.

### Active CSS authority
The active CSS stack is defined by `public/control-center/index.html`, not by all CSS files in the repository.

### Legacy CSS
`public/control-center/legacy/*` exists but must not be treated as current design authority.

### Existing design foundation
The active stack already includes:
- `00-tokens.css`
- `01-reset.css`
- `02-layer-system.css`
- `03-app-shell.css`
- `07-sidebar.css`
- `10-topbar-canonical.css`
- `08-components-foundation.css`
- `mhos-action-primitives.css`
- `mhos-workflow-primitives.css`
- `mhos-context-primitives.css`
- `mhos-executive-surface-primitives.css`

### Active risk areas
The largest active risk areas are:
- `12-pages.css`, especially late AI Team / final polish / density blocks.
- `13-home-executive.css`, because it already contains strong overrides and Home-specific compact rules.
- broad page-specific styling inside active CSS files.

## Design Decision

Do not rewrite global CSS files broadly.

Do not continue Home redesign by adding more local overrides.

The next safe step is to create or refine a small Global Design System v1 primitive layer that:
- uses existing tokens
- avoids `!important`
- avoids legacy selectors
- does not remove existing selectors
- does not change behavior
- can be adopted page by page

## Recommended First Implementation Target

Preferred first target:
`public/control-center/styles/mhos-executive-surface-primitives.css`

Reason:
- already active in `index.html`
- intended as a primitive layer
- cleaner than `12-pages.css`
- safer than patching page-specific files
- aligns with MH-OS operating surface direction

## Next Step

Proceed to:

`STEP GDS-1 — Global Design System v1 Foundation`

Scope:
- additive CSS primitives only
- no JS
- no backend
- no route changes
- no data changes
- no page-specific redesign yet

After GDS-1, apply the primitives to Home through a controlled Home Final UX Composition Pass.

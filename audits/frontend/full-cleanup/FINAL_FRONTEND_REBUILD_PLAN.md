# Final Frontend Rebuild Plan

## Root Cause

The Control Center was loading the new modular CSS, then the full 8,664-line `public/control-center/styles.css`, then more canonical and emergency CSS. That made the final UI depend on cascade order instead of clear ownership. The same runtime surfaces were active in multiple files, so small changes to one layer could revive old topbar, command, AI dock, card, or overlay behavior.

## Active Duplicate Systems Found

- Topbar was active in `styles.css`, `styles/06-topbar.css`, `styles/10-topbar-canonical.css`, and `styles/11-runtime-safety-overrides.css`.
- Command bar/backdrop was active in `styles.css`, `styles/04-command-layer.css`, `styles/09-command-legacy-isolation.css`, and `styles/11-runtime-safety-overrides.css`.
- AI dock was active in `styles.css`, `styles/05-ai-layer.css`, and `styles/11-runtime-safety-overrides.css`.
- Sidebar and mobile backdrop were active in `styles.css`, `styles/07-sidebar.css`, and layer safety rules.
- Cards/buttons/forms were active in `styles.css`, `styles/08-components-foundation.css`, and runtime overrides.
- Loading/startup surfaces had repeated hidden-state rules in `styles.css` and runtime overrides.

## Interaction Blockers Found

- `#commandToggleBtn` was referenced by `app.js` but was missing from `index.html`, so mobile command state could not be reliably opened or closed.
- `openGlobalCommandBar()` added `is-command-open` but did not synchronize the command bar/backdrop `aria-hidden` or `.is-visible` state.
- The command backdrop had hidden-state rules and open-state rules in multiple files, including conflicting `pointer-events`.
- The loading overlay and startup diagnostics had repeated fixed-position safety patches; if an old rule won the cascade, it could steal clicks after startup.
- Library and setup controls needed explicit local stacking/pointer rules because legacy overlays previously overlapped their controls.

## Density Problems Found

- The legacy stylesheet set `--card-min-height: 148px` and repeated large card paddings in later override sections.
- Home KPI cards, library cards, executive launcher cards, and command surfaces had oversized minimum heights.
- Topbar rules alternated between sticky/fixed/relative, 58/64/72/76px heights, flex and grid layouts.
- Command bar rules alternated between sticky inline layout and fixed palette layout.

## DOM / Runtime Mismatches Found

- `app.js` expects `#commandToggleBtn`; the DOM did not render it.
- `app.js` expects command close/open state to synchronize with `#commandBackdrop`, but the backdrop state was partly left to CSS.
- `runtime/command-runtime.js` is a non-active skeleton; production behavior still lives in `app.js`.
- CSS defined old `.topbar-mobile-controls` behavior that had no active DOM owner.

## Files To Keep

- `public/control-center/index.html`
- `public/control-center/app.js`
- `public/control-center/styles.css` as a reduced legacy page compatibility layer only
- `public/control-center/styles/00-tokens.css`
- `public/control-center/styles/01-reset.css`
- `public/control-center/styles/02-layer-system.css`
- `public/control-center/styles/03-app-shell.css`
- `public/control-center/styles/04-command-layer.css`
- `public/control-center/styles/05-ai-layer.css`
- `public/control-center/styles/07-sidebar.css`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/10-topbar-canonical.css`
- `public/control-center/styles/11-runtime-safety-overrides.css`

## Files To Archive Or Deactivate

- `public/control-center/legacy/styles.legacy-full.css`: archive of the full pre-cleanup `styles.css`.
- `public/control-center/styles/06-topbar.css`: kept in the tree but removed from active load order.
- `public/control-center/styles/09-command-legacy-isolation.css`: kept in the tree but removed from active load order.
- `public/control-center/styles/99-legacy-compat.css`: kept inactive; superseded by the reduced `styles.css` compatibility layer.

## Exact CSS Ownership Map

- `00-tokens.css`: design tokens, legacy variable aliases, spacing, radii, color aliases, density variables.
- `01-reset.css`: reset and native element normalization only.
- `02-layer-system.css`: z-index tokens, loading overlay, startup diagnostics, fatal panel, toast/error layers.
- `03-app-shell.css`: viewport, app shell, main shell, workspace scrolling, page root layout.
- `04-command-layer.css`: global command bar, command inputs, command backdrop, command toggle, desktop/mobile command states.
- `05-ai-layer.css`: floating AI dock only.
- `07-sidebar.css`: sidebar, nav, project switcher, sidebar actions, mobile sidebar backdrop.
- `08-components-foundation.css`: buttons, forms, cards, badges, empty/error/loading states, shared page/grid primitives.
- `10-topbar-canonical.css`: only active topbar/header owner.
- `styles.css`: page-specific legacy compatibility only; no shell, topbar, command, sidebar, AI dock, or generic card/button/form ownership.
- `11-runtime-safety-overrides.css`: narrow temporary safety rules for hidden overlays only.

## Final Stylesheet Load Order

1. `./styles/00-tokens.css`
2. `./styles/01-reset.css`
3. `./styles/02-layer-system.css`
4. `./styles/03-app-shell.css`
5. `./styles/04-command-layer.css`
6. `./styles/05-ai-layer.css`
7. `./styles/07-sidebar.css`
8. `./styles/08-components-foundation.css`
9. `./styles.css`
10. `./styles/10-topbar-canonical.css`
11. `./styles/11-runtime-safety-overrides.css`

## Validation Checklist

- `node --check public/control-center/app.js`
- CSS brace balance for `public/control-center/styles.css` and `public/control-center/styles/*.css`
- `git diff --stat`
- `git diff -- public/control-center/index.html | sed -n '1,220p'`
- `grep -n "<link rel=\"stylesheet\"" public/control-center/index.html`
- `grep -Rni "styles.css" public/control-center --line-number`
- Confirm setup inputs can receive focus and typing.
- Confirm library filters, upload, dropdown actions, and grid cards are clickable.
- Confirm command backdrop is inert when closed and closes the command when open.
- Confirm loading/startup diagnostics are hidden/inert after startup.
- Confirm New and AI Workspace controls are visible at desktop and mobile widths.
- Confirm AI dock opens/closes and does not block the page while closed.

## Rollback Strategy

1. Restore `public/control-center/styles.css` from `public/control-center/legacy/styles.legacy-full.css`.
2. Restore the previous `index.html` stylesheet list if any page-specific regression appears.
3. Keep `11-runtime-safety-overrides.css` available as the smallest emergency patch layer while investigating.
4. Re-run the validation checklist before shipping any rollback.

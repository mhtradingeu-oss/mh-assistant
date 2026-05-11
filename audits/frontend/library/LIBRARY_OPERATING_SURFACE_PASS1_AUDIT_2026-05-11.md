# Library Operating Surface Upgrade - Pass 1 Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## Scope and constraints honored
- Audit first.
- No backend changes.
- No changes under data/projects.
- No new global listeners.
- No heavy intelligence added inside render.
- Existing upload, preview, source-of-truth, status, archive, rename, delete, AI extraction, and refresh behavior preserved.

## Current architecture snapshot
- Library route is still orchestrated primarily by public/control-center/pages/library.js.
- Library modules exist and are in use for panel rendering and command envelope handling:
	- action-panel.js
	- ai-panel.js
	- command-router.js
	- projection-adapter.js
	- session-store.js
	- listener-lifecycle.js
	- catalog-readiness.js
- Operating surface currently renders as:
	- Header/overview cards and readiness cards
	- Main workspace (finder grid + preview inspector)
	- Right rail mounts for Action Panel and AI Panel

## Existing strengths
- Behavior coverage is broad and already production-oriented in the current surface:
	- upload and classify
	- protected preview/open flow for media/documents
	- source-of-truth mutation
	- status mutation
	- rename/archive/delete mutation
	- refresh scan
	- AI classify/missing/doc extraction prompts
- Asset selection flow is consistent across grid and inspector refresh.
- Readiness and required-asset summarization is visible and actionable.
- Panel mounts are read-only and currently safe (disabled actions).

## Duplicated UI and action areas
- Actions are duplicated across:
	- Inspector action cluster in preview meta.
	- Finder toolbar quick actions.
	- Action Panel buttons (read-only mount).
- Some handler code paths remain latent or partially disconnected:
	- Handler setup exists for libraryToolbarDeleteBtn, but no such toolbar button is rendered.
	- Handler setup exists for [data-library-select], [data-library-row-select], and [data-library-view-mode], but these selectors are not rendered in the current template path.

## Listener lifecycle risks
- Global listeners are still registered directly from library.js via initializeLibraryGlobalListeners() with a one-time guard.
- Guard prevents duplicate binds, but listeners are not route-disposed.
- Existing listener-lifecycle module exists but is not wired into the route.
- Risk level: medium for long-term maintainability, low for immediate regression given current single-page lifecycle behavior.

## Action panel and AI panel integration status
- Both panels are mounted in the right rail and re-render with selected asset context.
- Both panels are explicitly read-only via disabled state, preventing accidental command activation.
- Command metadata is present in button attributes, which is useful for later wiring without changing panel markup.

## CSS and UX issues observed
- Library styling is spread across both 12-pages.css and 14-page-standard.css, with overlapping selectors.
- Multiple library selectors use !important in 14-page-standard.css, increasing cascade fragility.
- Inline spacing styles were still present in library.js template before this pass, reducing style-system consistency.

## Safe improvement applied in this pass
Type: visual/layout only, read-only panel improvement.

Changes made:
- Added a small right-rail operating-surface heading to clarify structure.
- Wrapped right-rail cards/panels in a dedicated stack container for consistent spacing.
- Replaced inline margin styles with CSS classes for preview meta and panel mounts.
- Added page-scoped CSS classes in 14-page-standard.css for these new layout hooks.

No behavior logic changed:
- No mutation paths changed.
- No API contract changed.
- No listener count increased.
- No backend or data path touched.

## Safe next improvement (recommended)
Step 2 should remain low-risk and focus on structure, not behavior:
- Introduce a route-owned listener mount/dispose adapter that wraps only the current four global listeners.
- Keep all existing handler logic and selectors unchanged.
- Add a small smoke check to verify copy-path, protected link open, and action-dropdown close behavior still works.

## Files touched in this pass
- public/control-center/pages/library.js
- public/control-center/styles/14-page-standard.css
- audits/frontend/library/LIBRARY_OPERATING_SURFACE_PASS1_AUDIT_2026-05-11.md

## Step 2 Applied — Route-owned listener lifecycle

Applied after Pass 1 review:

- Wired `listener-lifecycle.js` into `library.js`.
- Replaced one-time global listener guard with route-owned mount/dispose.
- Preserved the existing Library listener behavior:
  - copy asset path
  - protected media/file link open
  - action dropdown close
  - protected object URL cleanup on beforeunload
- Added route cleanup support in `app.js` so page render cleanup functions are disposed when changing routes.
- No backend behavior changed.
- No API contract changed.
- No `data/projects` files changed.
- No Library mutation paths changed.

Result:
- Listener lifecycle risk reduced from medium to low.
- Remaining Library work should focus on duplicated action surfaces and command-router wiring, not listener ownership.

## Step 3 Pointer — Duplicated action surfaces audit

- Step 3 audit completed:
	- `audits/frontend/library/LIBRARY_STEP_3_DUPLICATED_ACTION_SURFACES_AUDIT.md`
- Scope: duplicated Finder/Inspector/Action Panel/AI Panel actions, command-router usage gaps, dead/latent handlers, and phased consolidation plan.
- Pass type: documentation only; no Library behavior changes.

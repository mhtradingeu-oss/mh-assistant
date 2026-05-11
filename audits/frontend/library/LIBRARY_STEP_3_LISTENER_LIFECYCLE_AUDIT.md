# Library Step 3 — Listener Lifecycle Audit

## Date
2026-05-11

## Status
Read-only listener audit completed.

## Current clean state
- git status was clean before this audit.
- No backend files changed.
- No data/projects files changed.

## Confirmed global listeners in library.js
- window.beforeunload revokes protected object URLs.
- document.click copies asset paths for [data-copy-asset-path].
- document.click intercepts protected media links for a.library-link-btn.
- document.click closes library action dropdowns outside .library-action-menu.

## Current global listener guard
- initializeLibraryGlobalListeners() uses libraryGlobalListenersInitialized to prevent duplicate registration.
- This avoids repeated global listener binding, but does not provide route lifecycle disposal.

## Existing listener lifecycle module
- public/control-center/pages/library/listener-lifecycle.js exists.
- It provides createListenerRegistry() and mountLibraryListeners().
- It is not yet integrated into library.js.

## Current scoped handlers
- bindLibraryWorkspace() contains many onclick/onchange/oninput/onkeydown handlers.
- These are mostly scoped to rendered Library controls.
- They remain high-density and should be decomposed later, but should not be migrated casually.

## Dropzone listeners
- dropZone.addEventListener is guarded by dropZone.dataset.libraryDndBound.
- This reduces duplicate binding risk for the current rendered dropzone.
- No migration is recommended in this pass.

## Risk classification
### P0
None requiring immediate code change after this audit.

### P1
- Global document/window listeners should eventually be moved behind listener-lifecycle.js or a route-owned mount/dispose pattern.
- bindLibraryWorkspace should be decomposed into smaller modules.

### P2
- Toolbar and asset action handlers should eventually route through command-router.js.
- Search debounce timer ownership should be isolated.

## Decision
Do not migrate listeners in the same pass as the read-only Action/AI Panel integration.
Next safe patch should focus only on moving the four global listeners into a lifecycle-owned helper, if it can be done without behavior changes.

## Next recommended step
Create a very small patch:
- import mountLibraryListeners from listener-lifecycle.js
- replace direct global listener registration with a single mounted lifecycle setup
- preserve libraryGlobalListenersInitialized compatibility
- do not touch bindLibraryWorkspace handlers

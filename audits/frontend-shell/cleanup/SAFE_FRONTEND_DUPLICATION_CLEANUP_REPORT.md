# Safe Frontend Duplication Cleanup Report

Date: 2026-05-10  
Branch: `architecture/frontend-consolidation-v1`  
Scope: shell ownership, command diagnostics, overlay diagnostics, AI dock visibility, integration stubs, audit-doc health, and clearly safe listener guards.

## Baseline

Initial worktree status was clean.

Recent frontend shell history:

- `d9f63c1` Add AI dock ownership audit
- `6bfc8f8` Add app runtime coordinator audit
- `bb3f749` Add runtime diagnostics foundation milestone
- `33a0a1a` Use command runtime snapshot in diagnostics
- `a390167` Add command runtime diagnostics snapshot
- `945aaa1` Add command runtime ownership audit
- `470691b` Use overlay runtime snapshot in diagnostics
- `256abec` Add overlay runtime extraction decision
- `4c622c6` Add overlay runtime comparison snapshot
- `ae94da7` Add helper-only overlay runtime module

Baseline syntax checks passed:

- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `node --check public/control-center/state.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/runtime/overlay/overlay-runtime.js`
- `node --check public/control-center/runtime/command-runtime.js`
- `node --check public/control-center/ai-team-model.js`
- all `public/control-center/pages/*.js`
- all `public/control-center/pages/integrations/*.js`

## What Was Found

| Area | Finding | Risk | Safe action now |
|---|---|---:|---|
| Shell ownership | `app.js` still owns responsive shell, sidebar, command bar, AI dock, loading overlay, startup diagnostics, and route coordination. Existing audits say this must remain coordinator-owned until diagnostics mature. | High | Do not extract or rewrite. Only improve diagnostics and idempotent binding guards. |
| Command diagnostics | `runtime/command-runtime.js` exposes a diagnostic snapshot for command bar, command backdrop, and AI dock existence. AI dock open/panel/toggle state is not visible. | Low | Add diagnostics-only AI dock visibility fields. |
| Command listeners | `bindResponsiveUi`, `bindCommandOutsideClose`, `initializeAiDock`, delegated click routing, library global listeners, and integration drawer Escape listener are guarded or replaced safely. `bindCommandInputs` adds `keydown` listeners without a per-element guard. | Low | Add per-element listener guards to command/search inputs only. |
| Escape handlers | Multiple Escape handlers exist for access key modal, sidebar/mobile command, global command close, AI dock, executive launcher, integration drawer, and local page interactions. Most are owner-specific. | Medium | Leave behavior untouched. Do not centralize Escape handling in this checkpoint. |
| Overlay diagnostics | `showLoading`, `hideLoading`, `forceHideLoadingOverlay`, and `unlockStartupUi` contain repeated hidden/inert/aria/display cleanup. Overlay runtime helpers are currently diagnostic/helper-only. | High | Leave overlay mutating behavior untouched. Report duplication only. |
| AI dock ownership | `initializeAiDock` is guarded by `window.__mhAiDockBound` and owns open/close/click/Escape behavior. Diagnostics currently show only AI dock presence. | Low | Add read-only visibility diagnostics, no open/close behavior changes. |
| Sidebar backdrop | Sidebar backdrop lifecycle is only in `bindResponsiveUi`; no duplicate backdrop module is active. | Medium | Leave untouched. |
| Hidden/inert/aria-hidden patterns | Repeated by loading overlay, command bar/backdrop, sidebar backdrop, AI dock panel, startup trace/unlock panels, setup wizard panels, and integration drawer markup. | Medium-High | Leave UX behavior unchanged. Use diagnostics only. |
| Integration module stubs | `public/control-center/pages/integrations/actions.js`, `events.js`, and `index.js` are tracked, zero-byte files. No runtime imports reference them. Current audit docs already identify them as empty P2 cleanup candidates. | Low | Remove the empty files after this report; future extraction can recreate populated modules. |
| Integration imports | `integrations.js` imports several module functions/constants that are not referenced after the import block. | Low | Remove unused imports only. |
| Audit docs | Required docs are readable and complete enough for this checkpoint. No merge-conflict or pasted terminal-output artifacts were found in the required docs. `current-command-runtime-snapshot.txt` is stale compared with the actual command runtime diagnostics file. | Low | Update the stale command runtime snapshot after code changes. |

## Safe To Fix Now

1. Extend command runtime diagnostics with read-only AI dock visibility state:
   - dock exists/open/data-open/class
   - toggle exists/aria-expanded
   - panel exists/hidden/inert/aria-hidden/pointer-events

2. Surface the new AI dock diagnostic fields in the startup runtime trace metadata.

3. Guard command/search `keydown` bindings per element in `bindCommandInputs` so repeated initialization cannot stack duplicate Enter handlers.

4. Remove unused imports from `public/control-center/pages/integrations.js`.

5. Delete zero-byte, unimported integration module stubs:
   - `public/control-center/pages/integrations/actions.js`
   - `public/control-center/pages/integrations/events.js`
   - `public/control-center/pages/integrations/index.js`

6. Refresh the stale command runtime snapshot audit document.

## Must Remain Untouched

- `showLoading` / `hideLoading`
- `forceHideLoadingOverlay`
- `openGlobalCommandBar` / `closeGlobalCommandBarSafe`
- `initializeAiDock` behavior
- `loadProjectData`
- backend runtime and API contracts
- `index.html` shell structure
- visual redesign and CSS deletion
- route metadata, page business logic, and page content strategy
- legacy CSS archive/removal
- centralized Escape handling
- overlay mutating helper replacement

## Files Proposed For Modification

- `audits/frontend-shell/cleanup/SAFE_FRONTEND_DUPLICATION_CLEANUP_REPORT.md`
- `audits/frontend-shell/command-runtime/current-command-runtime-snapshot.txt`
- `public/control-center/app.js`
- `public/control-center/runtime/command-runtime.js`
- `public/control-center/pages/integrations.js`
- `public/control-center/pages/integrations/actions.js`
- `public/control-center/pages/integrations/events.js`
- `public/control-center/pages/integrations/index.js`

## Remaining Risks

- `app.js` remains a large coordinator with multiple shell/runtime responsibilities.
- Overlay cleanup remains duplicated intentionally because mutating overlay replacement is out of scope.
- Several Escape handlers remain global but route/owner-specific; centralization is not safe until ownership is clearer.
- Integration action/event extraction remains unfinished; deleting empty stubs removes misleading files but does not complete modularization.
- Browser smoke validation is still recommended before any future shell consolidation.

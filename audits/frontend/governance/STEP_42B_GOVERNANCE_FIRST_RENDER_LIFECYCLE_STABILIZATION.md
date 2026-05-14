# STEP 42B - Governance First Render Lifecycle Stabilization

## Summary
Applied a minimal lifecycle patch to Governance first render so an unloaded project session no longer paints the full non-loading shell before initial governance data load starts.

## Changed file
- public/control-center/pages/governance.js

## Problem fixed
On first project render, Governance executed `rerender()` before `loadGovernance()`, which allowed a transient render of the full governance shell with neutral/unloaded data. This created a multi-phase visual sequence that could flicker.

## Lifecycle before
1. `governanceRoute.render()` built `projectName`, `session`, and `rerender`.
2. `rerender()` executed immediately.
3. `renderPage()` observed `session.loading === false` and `session.loaded === false`.
4. Full governance shell rendered using empty/fallback summary state.
5. Afterward, `loadGovernance()` started, set `session.loading = true`, and rerendered loading shell.
6. Fetch resolved and final loaded shell rendered.

## Lifecycle after
1. `governanceRoute.render()` builds `projectName`, `session`, and `rerender`.
2. If `projectName && !session.loaded && !session.loading`, it calls `loadGovernance(projectName, session, rerender)` and returns.
3. `loadGovernance()` immediately sets `session.loading = true` and rerenders.
4. First visible project render is deterministic loading shell.
5. Fetch resolves and final loaded shell renders.
6. If session is already loaded, already loading, or no project is selected, normal `rerender()` path remains.

## Preservation confirmation
- Visible copy unchanged.
- Handlers unchanged.
- IDs unchanged.
- Data attributes unchanged.
- API calls unchanged.
- Policy controls unchanged.
- Approval controls unchanged.
- No shell/std/mhos class adoption.
- No redesign.
- No file changes outside governance page implementation.

## Validation completed
Commands run:
- `git status --short`
- `grep -n "session.loading\|session.loaded\|loadGovernance\|rerender\|root.innerHTML\|governanceRoute" public/control-center/pages/governance.js | sed -n '1,260p'`
- `node --check public/control-center/pages/governance.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `git diff -- public/control-center/pages/governance.js | sed -n '1,260p'`

Results:
- Exactly one modified file reported: `public/control-center/pages/governance.js`.
- Grep output confirms lifecycle gate now checks before final rerender in route render.
- `node --check` passed for Governance page, app entry, and router.
- Diff is minimal and isolated to render sequencing in `governanceRoute.render()`.

## Browser QA checklist
- Open Control Center with a selected project and navigate directly to Governance.
- Confirm first visible Governance state is loading shell, not full neutral shell.
- Confirm loaded Governance shell appears after fetch completes.
- Trigger Refresh and confirm refresh behavior remains unchanged.
- Save Governance Policy and confirm behavior/messages remain unchanged.
- Execute an approval decision and confirm queue refresh/handlers unchanged.
- Trigger Request Approval from a non-approval queue item and confirm normal behavior.
- Open Governance AI action and confirm navigation/prompt behavior unchanged.

## Rollback path
- Revert the change in `public/control-center/pages/governance.js` by restoring previous `governanceRoute.render()` ordering (immediate `rerender()` before conditional `loadGovernance()` call).
- Verify with:
  - `node --check public/control-center/pages/governance.js`
  - `git diff -- public/control-center/pages/governance.js`

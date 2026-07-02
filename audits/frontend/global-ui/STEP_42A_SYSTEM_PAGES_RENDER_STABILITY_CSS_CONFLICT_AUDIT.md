# STEP 42A - System Pages Render Stability and CSS Conflict Audit

Date: 2026-05-14
Branch: architecture/frontend-consolidation-v1
Mode: Audit only (documentation-only)

## Executive Summary

System pages were audited for initial-render vs final-render instability before STEP 41G.

Primary finding:
- The strongest instability signal is render lifecycle behavior (template render + immediate page render + async rerender), not a catastrophic CSS-layer collision.

Most significant issue:
- Governance has a render order pattern that can visibly flip states (full shell -> loading shell -> full shell) during first load for a project session.

Secondary findings:
- Settings and Operations centers intentionally rerender after async data fetches. This is expected behavior, but because each rerender uses full `root.innerHTML` replacement, users can perceive visual switching.
- CSS overlap exists between standard shell primitives, operations page rules, and clean layer classes, but current selector specificity and scoping suggest additive styling more than direct conflict.

Recommendation:
- Pause STEP 41G briefly and address a minimal render-lifecycle stabilization guard first (especially Governance first-render sequence). Then proceed with STEP 41G.

## Files Inspected

- `public/control-center/app.js`
- `public/control-center/router.js`
- `public/control-center/ui/page-standard.js`
- `public/control-center/pages/settings.js`
- `public/control-center/pages/governance.js`
- `public/control-center/pages/operations-centers.js`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/styles/15-clean-operating-layer.css`
- `public/control-center/styles/09-operations-centers.css`
- `public/control-center/index.html`

## Pages Inspected

- Settings (`settingsRoute`)
- Governance (`governanceRoute`)
- Task Center (`taskCenterRoute`)
- Queue Center (`queueCenterRoute`)
- Job Monitor (`jobMonitorRoute`)
- Notification Center (`notificationCenterRoute`)

## Initial Render vs Final Render Findings

### Global Route/Render Pipeline

Evidence:
- `navigateTo()` renders route template first (`root.innerHTML = routeDef.template`) in `router.js`.
- Route-change event then calls `renderCurrentPage()` in `app.js`.
- `renderCurrentPage()` calls route `render()` and only applies standard page layout when `disableStandardLayout` is false.

Impact:
- Every route can experience at least a two-step visual sequence: template insertion, then route-specific content render.
- If route render then performs async fetch + rerender, user can see additional state transitions.

### Settings

Evidence:
- `settingsRoute.disableStandardLayout = true`.
- `render()` immediately calls `replacePage()` using session defaults.
- If not loaded, `loadDurableSettings()` sets `session.loading = true`, rerenders, fetches durable data, then rerenders again with merged durable snapshot.

Observed render pattern:
1. Initial full page with default/session-derived values.
2. Syncing state while durable settings fetch runs.
3. Final page with durable values.

Assessment:
- Content changes are expected due to async durable data hydration.
- Full-surface `root.innerHTML` replacement increases visible transition risk.

### Governance

Evidence:
- `governanceRoute.disableStandardLayout = true`.
- `render()` calls `rerender()` before starting `loadGovernance()`.
- `loadGovernance()` sets `session.loading = true` and rerenders, then final rerender after fetch.

Observed render pattern:
1. First rerender with `loaded=false`, `loading=false` (full governance shell with mostly empty/neutral data).
2. Immediate rerender to explicit loading shell (`session.loading && !session.loaded`).
3. Final rerender to loaded governance shell.

Assessment:
- This sequence is a likely unintended visual flicker source and is stronger than normal expected loading transitions.
- Classified as render lifecycle conflict suspected.

### Task Center

Evidence:
- `taskCenterRoute.disableStandardLayout = true`.
- Route render does immediate `renderTaskCenter()` from current state, then async `fetchProjectTaskCenter()` and rerender when live data arrives.

Assessment:
- Expected async refresh behavior.
- Potential visible content change (row count/order/detail), but layout skeleton remains consistent.

### Queue Center / Job Monitor / Notification Center

Evidence:
- All three are `disableStandardLayout = true`.
- Each route renders from current state, sets session loading, fetches live data, and rerenders.

Assessment:
- Expected loading transition behavior.
- Full `root.innerHTML` rerenders can still produce perceived switching under slower responses.

## Layout Ownership Findings

- System pages audited here are custom-owned layout surfaces, not standard wrapper-owned.
- `app.js` only calls `applyStandardPageLayout()` when route does not set `disableStandardLayout`.
- Settings, Governance, Task Center, Queue Center, Job Monitor, and Notification Center all explicitly set `disableStandardLayout: true`.

Conclusion:
- Standard shell wrapping is not being applied to these routes during render.
- Layout shifts on these pages are not caused by `applyStandardPageLayout()` wrapping/unwrapping.

## disableStandardLayout Findings

Confirmed `disableStandardLayout: true` on:
- settingsRoute
- governanceRoute
- taskCenterRoute
- queueCenterRoute
- jobMonitorRoute
- notificationCenterRoute

Implication:
- These pages fully own their DOM composition and rerender behavior.
- Any flicker is likely within page-specific render lifecycle and async refresh mechanics.

## CSS Conflict Findings

### CSS Load Order

From `index.html` stylesheet order (relevant subset):
1. `09-operations-centers.css`
2. `14-page-standard.css`
3. `15-clean-operating-layer.css`

### Potential Overlap Zones

- Operations pages intentionally use mixed class families:
  - `ops-*` classes (09 file, page-scoped selectors)
  - `std-*` utility/context classes (14 file)
  - `mhos-clean-*` classes (15 file)

- `14-page-standard.css` contains broad page/card/panel recovery selectors (for example `.page .panel`, `.page .card`) that can affect all pages including System pages.

- `15-clean-operating-layer.css` uses `:where(...)` namespaced selectors, which are low-specificity and generally safe; they are opt-in and mostly additive.

- `09-operations-centers.css` uses page-scoped selectors with higher specificity (`[data-page="..."] ...`), so Operations-specific geometry should dominate over clean-layer generic primitives where properties overlap.

Assessment:
- No direct hard collision was found in inspected files that alone explains major layout flipping.
- CSS conflict remains possible in edge interactions due to broad `.page .panel` recovery + mixed class usage, but current evidence favors render lifecycle transitions as the primary issue.

## Async Render / Data Replacement Findings

- `router.js` performs full route template replacement with `root.innerHTML` on navigation.
- Settings/Governance/Operations pages then perform additional `root.innerHTML` updates in page render functions.
- Async fetch completion triggers more full-surface rerenders.

Consequence:
- Even expected data hydration can appear as visual state switching because entire route surfaces are re-written instead of patching stable subtrees.

## Risk Classification Per Page

- Settings: expected loading transition, needs browser QA
  - Reason: durable data hydration rerender can visibly change content.

- Governance: render lifecycle conflict suspected, needs browser QA
  - Reason: current first-load sequence likely causes avoidable shell-state flip.

- Task Center: expected loading transition, needs browser QA
  - Reason: state render followed by live fetch rerender.

- Queue Center: expected loading transition, needs browser QA
  - Reason: loading-session rerender pattern after initial render.

- Job Monitor: expected loading transition, needs browser QA
  - Reason: same async rerender pattern.

- Notification Center: expected loading transition, needs browser QA
  - Reason: same async rerender pattern.

No page in this audit is classified as fully stable yet without browser confirmation.

## Recommendation: STEP 41G Pause or Continue

Recommendation: **Pause briefly** before STEP 41G governance additive shell classes patch.

Why:
- Governance currently shows a likely lifecycle ordering issue independent of shell class adoption.
- Proceeding with visual-class adoption first may mask root cause and complicate before/after QA attribution.

## Smallest Safe Fix (Proposed, Not Implemented)

Minimal, low-risk stabilization before STEP 41G:

1. Governance first-render sequencing
- In `governanceRoute.render()`, avoid rendering the full non-loading shell before `loadGovernance()` flips loading state.
- Use one deterministic first state (`loading` when data is not yet loaded) and then render loaded state.

2. Optional follow-up hardening (if needed after QA)
- Reduce full `root.innerHTML` replacement frequency for Settings/Operations by patching only stable subregions after async fetch.
- Keep structure stable while only swapping data content blocks.

## Proposed Next Step

1. Run focused browser QA capture on Settings, Governance, Task Center, Queue Center, Job Monitor, and Notification Center:
   - Capture frame-by-frame transition from route enter to stable state.
   - Confirm whether Governance flips full->loading->full in practice.
2. Apply minimal Governance lifecycle ordering fix only.
3. Re-run same QA script.
4. If stable, proceed with STEP 41G.

## Explicit No-Code-Change Statement

This step made **no production code changes**.

- No CSS edited.
- No JS edited.
- No backend edited.
- No `data/projects` edited.

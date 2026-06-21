# T140 — Insights Runtime Authority Closeout

## Status
Closed — one narrow production patch applied.

## Scope
Runtime authority review of:

- `public/control-center/pages/insights.js`

## Prior audits
- T135 — Fresh Frontend Runtime Risk Rebaseline
- T138 — Insights Exact Action Path Audit
- T139 — Insights Handoff Confirmation Patch

## Finding
T135 identified `insights.js` as the next highest open runtime-risk file after Home.

T138 confirmed that `insights.js` contains real handoff authority paths:

- `setSharedHandoff`
- `createProjectHandoff`
- downstream navigation to AI Command or target routes

Unlike Home, this file was not route-only. It had handoff creation paths without an explicit confirmation guard.

## Exact action classification

### Insights route handoff
Safe after T139.

T139 added confirmation before attaching shared Insights handoff context for route actions.

Cancel now prevents shared handoff attachment and downstream route navigation for project handoff actions.

### Insights AI Command prompt handoff
Safe after T139.

T139 added confirmation before:

- shared AI Command handoff attachment,
- backend `createProjectHandoff`,
- downstream AI Command navigation in project prompt handoff actions.

Cancel now prevents shared handoff attachment, backend handoff creation, and downstream AI Command navigation for project prompt handoff actions.

### Backend handoff persistence
Safe after T139.

`createProjectHandoff` remains asynchronous and destination-owned, but now occurs only after explicit user confirmation.

### AI execution
Safe.

`insights.js` does not call `executeProjectAiCommand`.

The route prepares AI Command review context only. It does not execute AI automatically.

### Publishing / approval
Safe.

`insights.js` does not create approvals and does not publish.

Publishing terms are dashboard/reporting language only.

## T139 patch summary
Added `confirmInsightsAuthorityAction(...)`.

Added confirmation before:

- Insights route shared handoff attachment.
- Insights AI Command shared handoff attachment.
- Insights AI Command backend handoff persistence.
- downstream AI Command navigation in project prompt handoff actions.

## Decision
`public/control-center/pages/insights.js` is safe to close after T139.

All sensitive Insights actions are now either:

- confirmation-gated,
- route-only,
- reporting/read-only,
- destination-owned review handoffs,
- or backend-durable only after explicit user confirmation.

## Changed
Production file changed:

- `public/control-center/pages/insights.js`

Audit files added:

- `audits/system-truth/t138-insights-exact-action-paths/`
- `audits/system-truth/t139-insights-handoff-confirmation-patch/`
- `audits/system-truth/t140-insights-runtime-authority-closeout/`

Script added:

- `scripts/audit/insights-exact-action-paths-t138.mjs`

## Not changed
No redesign.
No CSS changes.
No backend changes.
No route changes.
No data/projects changes.
No publishing behavior added.
No approval behavior added.
No AI execution behavior added.

## Validation
Validated with:

- `node --check scripts/audit/insights-exact-action-paths-t138.mjs`
- `node --check public/control-center/pages/insights.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

## Next step
Continue with the next highest open runtime-risk file from T135.

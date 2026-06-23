# T160 — Governance CSS Owner Wiring Plan

## Status
Plan only. No implementation.

## Baseline
- `77a7393 Decide Governance CSS ownership strategy`

## Purpose
Define the safe plan for introducing a dedicated Governance CSS owner file without changing behavior or expanding legacy CSS.

## Proposed New Owner File
Future implementation may introduce:

- `public/control-center/styles/09-governance.css`

## Proposed Stylesheet Load Position
Current relevant load order:
- `08-components-foundation.css`
- `mhos-action-primitives.css`
- `09-operations-centers.css`
- `12-pages.css`
- `13-home-executive.css`
- `14-page-standard.css`
- `15-clean-operating-layer.css`
- MHOS primitives

Recommended first wiring strategy:
- Add `09-governance.css` after `09-operations-centers.css` and before `12-pages.css`.

Reason:
- Keeps Governance near page-owner CSS files.
- Avoids expanding `12-pages.css`.
- Avoids placing new Governance rules after all legacy layers where it could unintentionally override too much.
- Allows a future gradual owner-file migration.

## Important Constraint
The first implementation should only create and wire the owner file.

It should not:
- move CSS from `12-pages.css`
- delete old Governance CSS
- add large visual changes
- change JS
- change API/backend/routes
- change mutation behavior

## Safe First Implementation Candidate
Future implementation phase:

`T161 — Governance CSS Owner File Wiring`

Expected allowed production files:
- `public/control-center/index.html`
- `public/control-center/styles/09-governance.css`

Expected first CSS content:
- page-scoped file header
- a minimal sentinel rule or no-op page-scoped marker if needed

Example safe scope:
- `[data-page="governance"] { }`

No visual polish should be introduced in the wiring commit unless explicitly approved.

## Validation Required For Wiring
Before commit:
- `node --check public/control-center/pages/governance.js`
- `node --check public/control-center/router.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/api.js`
- `node --check runtime/orchestrator-service/server.js`

Browser QA:
- `http://127.0.0.1:3000/control-center/#governance`

Checks:
- Governance route loads.
- Header visible.
- Decision queue visible.
- Policy controls visible.
- Governance actions visible.
- AI limitation visible.
- No visible regression from adding the stylesheet.
- No behavior change.
- No mutation behavior change.

## Forbidden
No `12-pages.css` expansion.
No `14-page-standard.css` expansion.
No CSS deletion.
No broad refactor.
No JS behavior change.
No backend/API/route change.
No data/projects change.
No mutation behavior change.
No provider execution change.
No AI execution behavior change.

## Decision After Wiring
After the CSS owner file is wired and QA passes, future polish must remain small and focused.

Allowed future first polish candidates:
1. Decision queue readability.
2. Evidence Summary missing-state clarity.
3. Governance action grouping / high-risk override emphasis.

Do not patch all three together.

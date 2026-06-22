# T144 — Setup Runtime Authority Closeout

## Status
Closed — one narrow production patch applied.

## Scope
Runtime authority review of:

- `public/control-center/pages/setup.js`

## Prior audits
- T135 — Fresh Frontend Runtime Risk Rebaseline
- T141 — Setup Exact Action Path Audit
- T142 — Setup Save Confirmation Verify
- T143 — Setup Save Confirmation Patch

## Finding
T141 confirmed that `setup.js` does not create handoffs, does not attach shared handoff context, and does not execute AI.

T142 confirmed that the primary backend Setup save path calls:

- `saveProjectSetup(projectName, payload)`

without an explicit operator confirmation before backend persistence.

## Exact action classification

### Backend Setup save
Safe after T143.

T143 added explicit confirmation before the primary backend Setup save path.

Cancel now prevents backend Setup persistence.

### Local draft save
Safe.

Local draft save remains browser-local and does not mutate backend state.

### AI guidance preparation
Safe.

Setup can prepare local AI guidance prompts and navigate to AI Command.

It does not call `executeProjectAiCommand`, does not create backend AI execution, and does not create shared handoffs.

### Navigation
Safe.

Setup navigation is route-level only and sends the user to destination-owned surfaces such as Library, Integrations, Campaign Studio, Home, and AI Command.

### Handoff / approval / publishing
Safe.

`setup.js` does not call:

- `createProjectHandoff`
- `createProjectApproval`
- `createProjectTask`
- `setSharedHandoff`
- `setSharedAiDraft`

It does not publish, approve, create handoffs, or execute AI.

## T143 patch summary
Added confirmation before backend Setup persistence.

The confirmation clarifies that Save Setup:

- persists backend project foundation data,
- does not publish,
- does not approve,
- does not create handoffs,
- and does not execute AI automatically.

## Decision
`public/control-center/pages/setup.js` is safe to close after T143.

All sensitive Setup actions are now either:

- local-only,
- route-only,
- guidance-only,
- or backend-durable only after explicit confirmation.

## Changed
Production file changed:

- `public/control-center/pages/setup.js`

Audit files added:

- `audits/system-truth/t141-setup-exact-action-paths/`
- `audits/system-truth/t142-setup-save-confirmation-verify/`
- `audits/system-truth/t143-setup-save-confirmation-patch/`
- `audits/system-truth/t144-setup-runtime-authority-closeout/`

Script added:

- `scripts/audit/setup-exact-action-paths-t141.mjs`

## Not changed
No redesign.
No CSS changes.
No backend changes.
No route changes.
No data/projects changes.
No publishing behavior added.
No approval behavior added.
No handoff behavior added.
No AI execution behavior added.

## Validation
Validated with:

- `node --check scripts/audit/setup-exact-action-paths-t141.mjs`
- `node --check public/control-center/pages/setup.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

## Next step
Continue with the next highest open runtime-risk file from T135.

# T114 — Workflows Event Bridge and Handoff Authority Patch

## Status
Patched.

## Scope
Production file changed:

- `public/control-center/pages/workflows.js`

## Why patch was needed
T112/T113 confirmed that most Workflows actions are local/session, shared-context, AI prompt/navigation, or confirmation-gated.

Two authority-sensitive paths still required hardening:

1. `mh:submit-workflow` event bridge
2. automatic durable handoff consumption in `applyDurableWorkflowHandoff`

## Patch 1 — Event bridge confirmation
The `mh:submit-workflow` event bridge can call:

- `runProjectAiWorkflow`
- `runProjectWorkflow`

This may prepare a backend workflow review package and update workflow run history.

Added explicit confirmation before this backend call.

The confirmation clarifies that the action:

- prepares a workflow review package from an external workflow event,
- may call the backend workflow preparation endpoint,
- may update workflow run history,
- does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions,
- can be cancelled to ignore the event.

## Patch 2 — No automatic durable handoff consume
`applyDurableWorkflowHandoff` previously called:

- `consumeProjectHandoff(projectName, handoffId, { actor: "mh-assistant" })`

during automatic handoff application.

This was changed so Workflows restores the context without automatically consuming the durable handoff record.

The handoff lifecycle remains operator-owned and destination-owned rather than silently mutated during render/context hydration.

## Not changed
No redesign.
No CSS changes.
No backend changes.
No route changes.
No data/projects changes.
No new workflow execution controls.
No new task creation controls.

## Validation
Validated with:

- `node --check public/control-center/pages/workflows.js`
- `node --check scripts/audit/workflows-runtime-authority-audit.mjs`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

# Patch 3 — Integrations Control Center Hierarchy Closeout

## Status

Implemented as a narrow terminal-only frontend copy and hierarchy patch.

No CSS, backend/API, router, app runtime, command execution, integration handlers, project data, or route behavior changes were made.

## Touched Files

- `public/control-center/pages/integrations.js`
- `public/control-center/pages/integrations/cards.js`
- `public/control-center/pages/integrations/drawer.js`
- `public/control-center/pages/integrations/render.js`
- `audits/frontend/global-design-system/global-frontend-truth-audit/PATCH_3_INTEGRATIONS_CONTROL_CENTER_HIERARCHY_CLOSEOUT.md`

## Exact Operating Language Changes

The patch reframed Integrations as a connection reliability and source coverage control surface:

- `Required Launch Connectors` → `Required Operating Connectors`
- `Connector Workspace` → `Connector Control Center`
- `Connector workspace` → `Connector control center`
- `Connector workspace is healthy` → `Connector control center is healthy`
- `Diagnostics` → `Reliability Diagnostics`
- `Sync health` → `Sync & Activity Health`
- `Coverage priorities` → `Source Coverage Priorities`
- `Critical gaps` → `Critical connection gaps`
- `Coverage map` → `Operating coverage map`
- `Connection requirements` → `Connector requirements`
- `Open setup` → `Open connector setup`

## Added/Clarified Operating Meaning

The page now communicates more clearly that Integrations is responsible for:

- Connection coverage.
- Connector reliability.
- Sync and activity health.
- Critical connection gaps.
- Safe backend-governed connector actions.
- Source coverage for MH-OS learning and execution.

## Preserved Contracts

The patch preserved:

- Route ID: `integrations`.
- Page root: `data-page="integrations"` and `#integrationsRoot`.
- `disableStandardLayout: true`.
- All `data-integration-*` attributes.
- All existing connect/reconnect/test/sync/import/disconnect handlers.
- All existing drawer behavior.
- All existing diagnostics behavior.
- All existing prompt behavior.
- All existing API calls.
- All existing backend-governed integration mutation behavior.
- All existing project data behavior.

## CSS Decision

No CSS changes were made.

The patch reused existing page structure and classes.

## Validation Commands

```bash
node --check public/control-center/pages/integrations.js
for f in public/control-center/pages/integrations/*.js; do
  [ -f "$f" ] && node --check "$f"
done
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist

Manual QA recommended:

- Open Integrations.
- Confirm the page reads as a Connector Control Center.
- Confirm Required Operating Connectors appears.
- Confirm Reliability Diagnostics appears.
- Confirm Sync & Activity Health appears.
- Confirm Source Coverage Priorities appears.
- Confirm connector cards still open the drawer.
- Confirm connect/reconnect/test/sync/import/disconnect controls still bind.
- Confirm unsupported connectors remain accurately labeled.
- Confirm diagnostics prompts still route to AI Command.
- Confirm no console errors.

## Risks

- Low functional risk because this is copy/hierarchy only.
- Medium UX risk because Integrations has many connector states and drawers; browser QA should confirm all labels still fit.
- No execution authority is added.

## Rollback Path

Revert the touched Integrations files and delete this closeout file.

No backend, API, router, app, CSS, or project data rollback is required.

# Integrations UX Cleanup and Feedback Implementation Plan

## Status
Plan-only checkpoint before implementation.

## Baseline
- b1b72b5 Add Integrations page truth audit
- 589c0fc Add Integrations operating surface plan
- 36493c5 Add Integrations duplicate feedback audit

## Page
Integrations

## Final Role
Integration Control Tower

## Problem confirmed
The Integrations page is functional and modular, but the audit found:
- repeated connector status labels
- repeated action labels
- multiple action phrases for similar states
- diagnostics and coverage may repeat connector-card state
- the setup drawer is the correct execution authority but needs clearer hierarchy
- user feedback should be clearer for setup/test/sync/reconnect actions

## Goal
Make Integrations clearer and more operational without changing backend/API/data behavior.

The page should help users answer:
- what is connected?
- what is missing?
- what is broken?
- what connector should be fixed next?
- where do I act?
- what happened after I clicked?

## Action language standard

### Connector status to action mapping
- Not Connected -> Connect
- Partial -> Complete setup
- Token expired -> Reconnect
- Error -> Fix connection
- Connected -> Sync / Manage

### Avoid competing labels
Avoid mixing:
- Connect
- Connect Website
- Connect with Google
- Quick Connect
- Complete Setup
- Open setup
- Manage Connection
- Reconnect Now
unless the distinction is necessary.

## UI authority rules

### Header / global area
Global actions only:
- Refresh
- Run diagnostics
- Ask AI / Explain gaps

### Connector cards
Cards should be scan/navigation surfaces:
- connector name
- short status
- health/sync summary
- one recommended action
- open setup or sync when safe

Avoid long diagnostics text inside cards.

### Setup drawer
Drawer is the primary action authority:
- selected connector
- status
- required fields
- validation
- connect/test/sync/reconnect
- feedback after action
- close/back behavior

### Diagnostics / coverage
Diagnostics should explain why something needs attention.
Do not repeat the same status already shown on connector cards unless it adds useful detail.

## Feedback requirements
Every important action should explain itself:
- Open setup
- Close drawer
- Test connection
- Connect / Complete setup
- Sync
- Reconnect / Fix connection
- Run diagnostics
- Ask AI / Explain gaps

Feedback should be:
- compact
- user-facing
- non-blocking where possible
- not a backend behavior change

## Allowed production files for later implementation
Use the smallest safe set:
- public/control-center/pages/integrations.js
- public/control-center/pages/integrations/cards.js
- public/control-center/pages/integrations/drawer.js
- public/control-center/pages/integrations/layout.js
- public/control-center/pages/integrations/render.js
- public/control-center/styles/14-page-standard.css
- existing integration CSS file only if required

## Forbidden files
- public/control-center/api.js
- public/control-center/app.js
- public/control-center/index.html
- backend files
- runtime authority files
- data/projects
- legacy files

## Strict constraints
- Do not change backend.
- Do not change API.
- Do not change data/projects.
- Do not rewrite bindIntegrationActions.
- Do not rewrite connector pipeline/model building.
- Do not remove existing data attributes.
- Do not change route behavior.
- Do not add destructive actions.
- Do not relink legacy files.
- Do not create a duplicated CSS layer.

## Implementation stages

### Stage A — Small UX cleanup
- normalize visible action labels
- reduce repeated status text
- make connector cards easier to scan
- keep drawer as execution authority

### Stage B — Feedback patch
- add or reuse message feedback for open setup/test/sync/connect/reconnect/close
- do not change backend execution logic

### Stage C — Drawer polish
- improve drawer hierarchy
- clarify validation and next step
- preserve fields and actions

### Stage D — Validation
Run:
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/integrations/*.js
- node --check public/control-center/app.js
- node scripts/check-control-center-legacy-assets.js

### Stage E — Browser QA
Confirm:
- page loads
- no stuck loading
- connector cards visible
- domain groups visible
- drawer opens
- drawer closes
- fields visible
- test/connect/sync/reconnect actions preserved
- diagnostics visible
- recommendation visible
- feedback appears after actions
- no legacy loaded text
- no console errors

## Non-goals
- No backend integration implementation.
- No OAuth redesign.
- No credential flow rewrite.
- No connector data model refactor.
- No global typography changes.
- No destructive action changes.

## Rollback
If page breaks:
- git checkout -- affected production files
- do not commit
- document failure

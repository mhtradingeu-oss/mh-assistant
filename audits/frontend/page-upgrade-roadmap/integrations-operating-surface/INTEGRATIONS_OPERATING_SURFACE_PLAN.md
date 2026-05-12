# Integrations Operating Surface Implementation Plan

## Status
Plan-only checkpoint before implementation.

## Baseline
Audit committed in:
b1b72b5 Add Integrations page truth audit

## Page
Integrations

## Final Role
Integration Control Tower

## Current truth
The Integrations page already has a modular frontend architecture:
- public/control-center/pages/integrations.js
- public/control-center/pages/integrations/builders.js
- public/control-center/pages/integrations/cards.js
- public/control-center/pages/integrations/diagnostics.js
- public/control-center/pages/integrations/drawer.js
- public/control-center/pages/integrations/layout.js
- public/control-center/pages/integrations/render.js
- public/control-center/pages/integrations/state.js
- public/control-center/pages/integrations/utils.js

The page is a custom operating surface:
- disableStandardLayout: true

## Problem
The page is functionally strong, but before final UX polish we need to define:
- which UI surfaces should be authoritative
- which actions should appear where
- where feedback is missing
- where diagnostics and coverage duplicate connector state
- how the setup drawer should guide users
- how to preserve sensitive integration actions

## Goal
Transform Integrations into:
Integration Control Tower

The page should clearly answer:
- Which connectors are connected?
- Which connectors are missing?
- Which connectors are critical?
- Which connector needs action next?
- Which integrations affect launch readiness?
- What should the user test, sync, connect, or repair?
- What does the AI/system recommend next?

## Non-negotiable constraints
- Do not change backend.
- Do not change API.
- Do not change data/projects.
- Do not change route behavior.
- Do not rewrite bindIntegrationActions.
- Do not rewrite core model pipeline.
- Do not remove existing data attributes.
- Do not relink legacy files.
- Do not create a new duplicated CSS layer.
- Preserve drawer behavior.
- Preserve setup/test/sync/connect/reconnect behavior.
- Preserve validation and diagnostics logic.

## Allowed production files for later implementation
Prefer smallest safe set:
- public/control-center/pages/integrations.js
- public/control-center/pages/integrations/cards.js
- public/control-center/pages/integrations/drawer.js
- public/control-center/pages/integrations/layout.js
- public/control-center/pages/integrations/render.js
- public/control-center/styles/14-page-standard.css
- public/control-center/styles/*.css only if existing integration CSS lives there

## Forbidden files
- public/control-center/api.js
- public/control-center/app.js
- public/control-center/index.html
- backend files
- runtime authority files
- data/projects
- legacy files

## Target Page Structure

### 1. Compact Page Header
Purpose:
- Show page title and current integration readiness.
- Show global utility actions only.

Possible label:
Integration Control Tower

Global actions should be limited to:
- Refresh
- Run diagnostics
- Ask AI / Explain gaps

Do not duplicate connector-specific actions here.

### 2. Integration Readiness Summary
Compact metrics:
- Connected
- Needs setup
- Failed / token expired
- Critical missing
- Coverage score if available

This should be compact and scan-friendly.

### 3. Recommended Next Step
Show one clear recommendation:
- connector needing attention
- why it matters
- safe next action

Example:
"Reconnect Search Console before relying on SEO insights."

### 4. Connector Workspace
Main area:
- domain groups
- connector cards
- status
- health
- sync
- recommended action

Connector cards should avoid repeated full diagnostics text.

### 5. Setup Drawer
The drawer is the main connector action authority.

Drawer should show:
- selected connector
- status
- required fields
- validation
- test/connect/sync/reconnect action
- clear feedback after action
- close/back behavior

### 6. Diagnostics / Activity
Should be compact.
Should not repeat the same status already shown on connector cards unless it adds detail.

### 7. AI / Guidance
If present, AI guidance should focus on:
- what to connect next
- why it matters
- which system capability unlocks
- what risk remains

Do not duplicate action buttons.

## Button Authority Rules

### Global actions
Live in page header/top utility:
- Refresh
- Run diagnostics
- Ask AI about integration gaps

### Connector card actions
Lightweight actions only:
- Open setup
- Sync if connected
- Reconnect if broken
- Test if setup is incomplete

### Drawer actions
Primary authority for selected connector:
- Save / Connect
- Test connection
- Sync
- Reconnect
- Close

### Dangerous or sensitive actions
Must be clearly separated if present:
- disconnect
- revoke
- delete credentials

Do not add destructive actions in this phase.

## Feedback Requirements
Every meaningful action should explain itself:
- Open setup
- Connect
- Test connection
- Sync
- Reconnect
- Close drawer
- Copy / external open if present
- AI explain / recommended next action

Use existing feedback surface if available.
Do not introduce backend behavior.

## UX Cleanup Targets
- Reduce repeated connector status labels.
- Reduce repeated recommended action copy.
- Make connector cards easier to scan.
- Make drawer labels practical and user-facing.
- Avoid internal architecture labels.
- Improve density and spacing without redesigning the whole page.
- Keep typography aligned with Library pilot direction.
- Keep the page visually consistent with MH-OS operating surfaces.

## Implementation stages

### Stage A — Duplicate UI map
Before editing, record:
- repeated labels
- repeated buttons
- repeated status surfaces
- connector card actions
- drawer actions
- diagnostics/action feedback gaps

### Stage B — UI authority decision
Decide where each action belongs:
- header
- connector card
- drawer
- diagnostics
- AI guidance

### Stage C — Safe UX implementation
Only adjust presentation/hierarchy/feedback.
Do not touch core pipeline or backend actions.

### Stage D — Validation
Run:
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/integrations/*.js
- node --check public/control-center/app.js
- node scripts/check-control-center-legacy-assets.js

### Stage E — Browser QA
Confirm:
- Integrations page loads
- no stuck loading
- connector cards visible
- domain groups visible
- drawer opens
- drawer closes
- setup fields visible
- test/connect/sync actions preserved
- diagnostics visible
- recommendation visible
- no console errors
- no legacy loaded text

## Non-goals for first implementation
- No backend integration changes.
- No API changes.
- No credential flow rewrite.
- No OAuth redesign.
- No connector pipeline extraction.
- No destructive action changes.
- No runtime authority changes.
- No global typography changes.

## Rollback
If page breaks:
- git checkout -- affected production files
- do not commit
- document failure

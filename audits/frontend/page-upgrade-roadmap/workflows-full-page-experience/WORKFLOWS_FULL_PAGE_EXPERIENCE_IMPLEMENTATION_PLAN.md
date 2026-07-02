# Workflows Full Page Experience Implementation Plan

## Status
Plan-only checkpoint before implementation.

## Baseline
- 8eee15d Add Workflows full page experience review
- 438cf6f Add Integrations final closeout
- 393df9f Add full page experience upgrade protocol
- 25b451d Add global UI UX system plan

## Page
Workflows

## Target Role
Workflow Automation Control Tower

## Problem Confirmed
The current Workflows page is useful but underpowered as a page experience.

It currently feels closer to:
- workflow prompt preparation
- simple context routing
- basic AI Command handoff

It should become:
- a workflow automation control tower
- a workflow readiness surface
- a run/review/action decision page
- a page that shows the automation power of MH-OS

## Critical Safety Finding
The Workflows file contains richer workflow logic that is not fully rendered in the active route.

Therefore implementation must not accidentally activate, rewrite, or change:
- workflow execution authority
- mutation logic
- auto mode behavior
- backend/API behavior
- runtime workflows
- data persistence behavior

## Goal
Improve the visible page experience only.

The user should immediately understand:
- what Workflows is for
- what can be automated
- what is ready
- what is blocked
- what workflow should be run/prepared next
- where to edit/review workflow context
- what AI can help prepare
- what actions are safe

## Non-Negotiable Constraints
- Do not change backend.
- Do not change API.
- Do not change data/projects.
- Do not change app.js route core.
- Do not rewrite workflow execution logic.
- Do not activate unused execution paths.
- Do not alter auto mode lifecycle.
- Do not change mutation behavior.
- Do not add destructive actions.
- Do not relink legacy files.
- Do not change auth/session/runtime authority.

## Allowed Production Files for Later Implementation
Use the smallest safe set:
- public/control-center/pages/workflows.js
- public/control-center/styles/12-pages.css
- public/control-center/styles/14-page-standard.css only if a workflow section is intentionally added and scoped

## Forbidden Files
- public/control-center/api.js
- public/control-center/app.js
- public/control-center/index.html
- backend files
- runtime files
- data/projects
- public/control-center/legacy files

## Implementation Direction

### 1. Professional Header / Context Bar
The header should explain:
- Workflows prepares and coordinates repeatable operating actions.
- It helps turn campaign, content, publishing, and operational goals into guided execution.

Avoid:
- static overconfident "Ready" labels
- generic page title only
- debug-like counters

### 2. Executive Automation Health Strip
Show compact metrics:
- Draft workflows
- Ready workflows
- Blocked workflows
- Runs / recent activity
- Approvals / pending review
- Automation readiness

Do not duplicate the same metric in multiple sections.

### 3. Next Best Workflow Action
Add one clear recommendation:
- workflow type
- why it matters
- expected impact
- primary safe CTA

Example:
"Prepare Campaign Launch Workflow — combines campaign context, content assets, and publishing readiness into one AI-reviewed action plan."

### 4. Workflow Catalog / Workspace
Create a visible workflow operating workspace:
- workflow type cards/rows
- trigger/context
- readiness
- blocker summary
- last prepared/run status if available
- one primary action

Important:
Use existing workflow definitions/data only.
Do not invent backend states.
Do not activate execution logic.

### 5. Selected Workflow Context Panel
Add or improve selected workflow context:
- selected workflow title
- goal
- required inputs
- readiness
- suggested action
- technical details behind disclosure

This can be implemented as an inline panel or right-side panel depending on existing route structure.

### 6. Progressive Disclosure
Use:
- Why this matters
- Requirements
- Risk details
- Technical details

Do not show long technical explanations by default.
Do not remove information.

### 7. Action Hierarchy
Primary actions:
- Prepare Workflow
- Send to AI Workspace

Secondary actions:
- Open Campaign Studio
- Open Task Center
- Copy prompt/context if already available

Do not present navigation actions as equal to execution actions.

### 8. AI/System Intelligence
Make AI guidance explicit:
- recommended workflow
- why it matters
- what AI will prepare
- what risk remains
- where the user goes next

### 9. Visual / Typography Alignment
Follow the global UI/UX system:
- compact cards
- clear status badges
- strong selected state
- no raw white surfaces
- no duplicated labels
- no noisy action clusters

## Implementation Stages

### Stage A — Safe UX Restructure
- improve header
- add automation health strip
- reduce duplicated counters
- improve purpose copy

### Stage B — Workflow Catalog Surface
- surface existing workflow types as compact cards/rows
- show readiness/status text from existing safe state
- add selected workflow state if already available or safe frontend state only

### Stage C — Context / AI Guidance Panel
- clarify selected workflow requirements
- show AI preparation guidance
- use progressive disclosure

### Stage D — Validation
Run:
- node --check public/control-center/pages/workflows.js
- node --check public/control-center/app.js
- node scripts/check-control-center-legacy-assets.js

### Stage E — Browser QA
Confirm:
- Workflows page loads
- no stuck loading
- header purpose visible
- automation health visible
- next best action visible
- workflow catalog/list visible
- selected workflow context visible
- actions preserved
- no legacy loaded text
- no console errors
- no forbidden files changed

## Non-Goals for First Implementation
- No backend workflow execution change.
- No API integration.
- No real automation engine change.
- No auto mode behavior change.
- No data persistence behavior change.
- No destructive actions.
- No new route wiring.
- No app shell changes.

## Rollback
If page breaks:
- git checkout -- affected production files
- do not commit
- document failure

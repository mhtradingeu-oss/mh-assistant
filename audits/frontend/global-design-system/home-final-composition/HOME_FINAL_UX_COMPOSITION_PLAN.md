# STEP HOME-FINAL-1 — Home Final UX Composition Plan

## Status
Planned.

## Purpose
Recompose Home / Command Center from a dense dashboard into a premium Executive AI Operating Surface using Global Design System v1 primitives.

## Product Goal
Home must answer in the first screen:

1. What is the project status?
2. What is blocking progress?
3. What is the next best action?
4. Which AI specialist should help?
5. Where should the operator go next?

## Current Problem
The current Home page is backend-bound and functional, but visually dense and dashboard-like. It exposes too many system messages and technical states at once.

## Target Experience
Home should feel like:
- executive command brief
- operating system cockpit
- AI-guided decision surface
- calm, premium, understandable workspace

## Target Composition

### 1. Executive Brief
A compact top section showing:
- Project name
- System health
- Project readiness
- Critical blockers
- Primary focus

### 2. Primary Decision Card
One clear next best action:
- human-readable title
- why it matters
- impact
- 2–3 safe actions only

### 3. Attention Cards
Maximum 3 cards:
- Assets
- Integrations
- Readiness gaps

### 4. Operating Path
A simple launch/operation path:
- Setup foundation
- Prepare assets
- Connect platforms
- Build campaign
- Publish/execute

### 5. Recommended AI Specialist
Show one recommended specialist based on the active blocker or next action.
Do not show the full AI Team as a large block in the first screen.

### 6. Collapsed / Secondary Details
Move technical details and system messages into secondary evidence/details sections.

## Allowed Changes
- Change Home markup composition.
- Use existing backend-bound dashboard data.
- Add safe helper functions for display copy.
- Add GDS primitive classes.
- Reduce visible density.
- Improve copy hierarchy.

## Forbidden Changes
- No backend changes.
- No API changes.
- No route changes.
- No mutation behavior changes.
- No fake operational claims.
- No claim that CRM/IVR/live channels are enabled if not enabled.
- No broad CSS rewrite.
- No changes to unrelated pages.

## Target Files
Expected runtime files:
- `public/control-center/pages/home.js`
- possibly `public/control-center/pages/home/render-sections.js`
- avoid editing `13-home-executive.css` unless absolutely necessary
- prefer existing GDS primitives from `mhos-executive-surface-primitives.css`

## Validation
- `node --check public/control-center/pages/home.js`
- `node --check public/control-center/pages/home/render-sections.js`
- browser QA at `http://127.0.0.1:3000/control-center/#home`

## Decision
Proceed to a controlled Home Final UX Composition implementation after this plan is committed or explicitly approved.

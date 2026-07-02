# P1.2 — Frontend Authority Inventory

## Goal
Identify every frontend area that may act as operational authority instead of projection.

## Doctrine
Backend owns operations.
Frontend projects operations.

## Files under review
- public/control-center/ai-team-model.js
- public/control-center/pages/ai-command.js
- public/control-center/pages/workflows.js
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/shared-context.js
- public/control-center/automation-engine.js

## Authority categories
- role definitions
- specialist maps
- route permissions
- approval assumptions
- handoff ownership
- workflow execution authority
- automation authority
- governance assumptions
- local operating state
- routing decisions

## Output
This inventory does not change code.
It classifies frontend logic into:
- Projection only
- Local UI state
- Temporary compatibility
- Duplicate authority
- Must migrate to backend

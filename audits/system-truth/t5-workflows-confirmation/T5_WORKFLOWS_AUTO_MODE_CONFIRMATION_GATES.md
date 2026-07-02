# T5 — Workflows Auto Mode Confirmation Gates

## Status
Safe implementation patch.

## Scope
File changed:
- public/control-center/pages/workflows.js

## What changed
Added explicit `window.confirm(...)` gates before sensitive Auto Mode workflow actions:

- Start Auto Mode
- Resume Auto Mode
- Approve current workflow gate
- Skip current workflow step

## Why
T4 showed that full-plan and single-step simulations already had confirmation gates, but Auto Mode start/resume/approve/skip did not show local confirmation evidence.

## What did not change
- No backend changes
- No CSS changes
- No data/projects changes
- No route changes
- No IDs changed
- No data attributes changed
- No API shape changed
- No execution function removed
- No workflow logic rewritten

## Authority rule
Backend remains the operational authority. Frontend only asks for explicit user confirmation before forwarding the action into the existing workflow automation runtime.

## Validation
Required:
- node --check public/control-center/pages/workflows.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js

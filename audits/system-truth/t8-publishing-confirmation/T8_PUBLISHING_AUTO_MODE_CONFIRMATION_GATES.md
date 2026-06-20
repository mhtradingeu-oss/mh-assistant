# T8 — Publishing Auto Mode Confirmation Gates

## Status
Safe implementation patch.

## Scope
File changed:
- public/control-center/pages/publishing.js

## What changed
Added explicit `window.confirm(...)` gates before sensitive Publishing Auto Mode actions:

- Start Publishing Auto Mode
- Approve current publishing automation gate
- Skip current publishing automation step

## Why
T7 showed that Publishing Auto Mode start/approve/skip did not show local confirmation evidence.

## What did not change
- No backend changes
- No CSS changes
- No data/projects changes
- No route changes
- No IDs changed
- No data attributes changed
- No API shape changed
- No publishing logic rewrite
- No external publishing execution added

## Authority rule
Backend remains the operational authority. Frontend only asks for explicit user confirmation before forwarding the action into the existing publishing automation runtime.

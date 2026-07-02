# P2.1 — Unified Runtime State Layer Audit

## Goal
Map all frontend runtime state sources before consolidation.

## Rule
Audit only.
No refactor.
No behavior change.

## Focus files
- public/control-center/state.js
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/shared-context.js
- public/control-center/runtime/*
- public/control-center/pages/*.js

## Questions
1. What owns active project?
2. What owns active route?
3. What owns active role?
4. What owns overlays?
5. What owns AI handoffs?
6. What owns local drafts?
7. What owns loading/fatal states?
8. What is duplicated?
9. What must become projection-only?

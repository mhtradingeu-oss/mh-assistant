# P2.6 — Selector Shadow Validation

## Goal
Validate that runtime selectors return identical values to previous direct reads.

## Scope
- Home dashboard
- AI Workspace

## Validation rule
Selectors must remain:
- read-only
- projection-safe
- behavior-compatible

## Protected
No router migration.
No workflow migration.
No shared-context migration.
No runtime ownership changes.

## Current selector coverage
- selectCurrentProject
- selectOperationsSnapshot
- selectProjectPayload
- selectActiveRoleProjection
- selectActiveRoute
- selectSystemHealth

## Result expectation
Selectors become canonical frontend read path.

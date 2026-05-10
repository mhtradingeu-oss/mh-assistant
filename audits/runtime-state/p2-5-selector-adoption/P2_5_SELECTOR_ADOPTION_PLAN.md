# P2.5 — Selector Adoption Plan

## Goal
Prepare gradual adoption of read-only runtime state selectors.

## Rule
No behavior change until each page is migrated independently.

## Selectors available
- selectCurrentProject
- selectActiveRoute
- selectOperationsSnapshot
- selectProjectPayload
- selectSystemHealth
- selectActiveRoleProjection

## Migration order
1. Home — already stable, low risk
2. AI Command — projection-aware, medium risk
3. Workflows — high risk, snapshot first
4. Publishing — high risk, snapshot first
5. Library — high DOM/runtime risk, snapshot first
6. Campaign/Content/Media pages — after handoff policy

## Do not migrate yet
- router.js route authority
- automation-engine state
- shared-context lifecycle

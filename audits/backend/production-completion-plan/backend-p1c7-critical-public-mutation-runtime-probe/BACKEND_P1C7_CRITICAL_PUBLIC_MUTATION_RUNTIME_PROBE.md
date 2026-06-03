# BACKEND-P1C.7 — Critical Public Mutation Alias Block Runtime Probe

## Status
Runtime probe evidence phase.

## Purpose
Verify the critical public mutation alias block behavior introduced in BACKEND-P1C.6.

## Expected behavior

### Default mode
When `MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES` is not enabled:
- public aliases remain compatible
- critical public mutation aliases are not blocked
- summary should show blocked: 0

### Block mode
When `MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES=true`:
- critical public mutation aliases are blocked
- summary should show blocked: 18
- server middleware should return HTTP 410 for blocked public alias requests
- canonical non-public routes must remain unaffected

## Safety
No code changes in this phase.
No route removal.
No frontend API helper changes.
No customer mutations added.
No provider execution changed.

## Next phase
BACKEND-P1D — Provider Bridge Risk Audit and Safe Plan

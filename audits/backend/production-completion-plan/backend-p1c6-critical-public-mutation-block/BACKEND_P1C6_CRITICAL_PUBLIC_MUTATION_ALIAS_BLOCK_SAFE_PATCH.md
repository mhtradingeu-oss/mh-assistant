# BACKEND-P1C.6 — Critical Public Mutation Alias Block Safe Patch

## Status
Implemented as flag-gated safe patch.

## Scope
This phase updates the existing `/public` alias middleware to block retired critical public mutation aliases only when the compatibility block flag is enabled.

## Files changed
- runtime/orchestrator-service/server.js
- audits/backend/production-completion-plan/backend-p1c6-critical-public-mutation-block/

## Environment flag
- MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES=true

## Default behavior
Default behavior remains compatible.

If `MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES` is not enabled, public aliases remain allowed.

## Blocked behavior
When the flag is enabled and a critical public mutation alias is requested, the middleware returns:

- HTTP 410
- JSON body:
  - ok: false
  - error: public_alias_retired
  - canonicalRequired: true
  - reason

## Safety
This phase does not remove routes.
This phase does not block canonical routes.
This phase does not block read aliases.
This phase does not block non-critical public aliases.
This phase does not change frontend API helpers.
This phase does not add customer mutations.
This phase does not change provider execution.

## Next phase
BACKEND-P1C.7 — Critical Public Mutation Alias Block Runtime Probe

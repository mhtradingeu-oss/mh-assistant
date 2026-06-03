# BACKEND-P1C.4 — Public Alias Header Runtime Probe

## Status
Runtime probe phase.

## Purpose
Verify that public alias deprecation headers are present on `/public/...` routes without changing route behavior.

## Safety
No route is blocked in this phase.
No alias is removed.
No frontend API helper is changed.
No customer mutation is added.
No provider execution is changed.

## Expected
Public alias responses should include:
- X-MH-Public-Alias
- X-MH-Public-Alias-Status
- X-MH-Public-Alias-Reason
- X-MH-Canonical-Route-Required
- Deprecation

## Next phase
BACKEND-P1C.5 — Critical Public Mutation Alias Block Plan

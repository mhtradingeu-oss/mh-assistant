# BACKEND-P1C.3 — Public Alias Deprecation Headers Safe Patch

## Status
Implemented as non-breaking middleware.

## Scope
This phase wires public alias deprecation headers for `/public/...` routes.

## Files changed
- runtime/orchestrator-service/server.js
- audits/backend/production-completion-plan/backend-p1c3-public-alias-deprecation-headers/

## Safety
This phase does not remove routes.
This phase does not block routes.
This phase does not change frontend API helpers.
This phase does not change provider execution.
This phase does not add customer mutations.
This phase only adds response headers to public alias requests.

## Headers added
- X-MH-Public-Alias
- X-MH-Public-Alias-Status
- X-MH-Public-Alias-Reason
- X-MH-Canonical-Route-Required
- Deprecation

## Validation
- node --check runtime/orchestrator-service/server.js
- node --check runtime/orchestrator-service/lib/security/public-alias-compatibility.js
- node --check scripts/backend/check-public-alias-compatibility.js

## Next phase
BACKEND-P1C.4 — Public Alias Header Runtime Probe

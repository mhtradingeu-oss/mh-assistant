# PHASE 13B.1 — Public Mutation Alias Deprecation Headers / Warning Telemetry Patch Lock

## Status
PATCH APPLIED SAFELY — PUBLIC MUTATION ALIAS VISIBILITY HARDENING COMPLETE

## Scope
Tiny backend compatibility/security patch.

## Production file changed
- runtime/orchestrator-service/server.js

## What changed
Added middleware that detects mutation requests under:

- /public/media-manager/...

for methods:

- POST
- PUT
- PATCH
- DELETE

and adds deprecation/compatibility headers:

- X-MH-Public-Alias: true
- X-MH-Public-Alias-Status: deprecate
- X-MH-Public-Alias-Recommendation: use-canonical-media-manager-route
- X-MH-Public-Alias-Canonical-Prefix: /media-manager

It also emits server-side warning telemetry:

- [MH][public_mutation_alias_deprecated]

## Confirmed Safe
- No public alias route was removed.
- No public alias route was blocked.
- No canonical /media-manager route was changed.
- No frontend file was changed.
- No AI Command file was changed.
- No provider behavior changed.
- No publishing behavior changed.
- No integration behavior changed.
- No write-key semantics changed.
- Existing public alias compatibility middleware remains in place.
- Existing classifyPublicAliasAccess / buildPublicAliasHeaders logic remains in place.

## Validation
- node --check runtime/orchestrator-service/server.js passed.
- node --check runtime/orchestrator-service/lib/security/public-alias-compatibility.js passed.
- node --check runtime/orchestrator-service/lib/security/route-permission-catalog.js passed.
- frontend syntax spot checks passed.
- diff limited to runtime/orchestrator-service/server.js plus audit files.
- canonical routes remain present.
- public aliases remain present.
- deprecation headers and warning telemetry block exist.

## Decision
Lock Phase 13B.1.

## Recommended Next Phase
PHASE 13C — Public Mutation Alias Write-Key Coverage Proof

Mode:
- SCAN / TEST ONLY first
- NO CODE CHANGE

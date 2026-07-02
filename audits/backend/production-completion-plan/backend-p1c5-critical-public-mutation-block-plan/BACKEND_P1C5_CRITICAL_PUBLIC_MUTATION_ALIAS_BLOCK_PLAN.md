# BACKEND-P1C.5 — Critical Public Mutation Alias Block Plan

## Status
Plan-only / decision phase.

## Purpose
Prepare a safe blocking strategy for critical `/public/...` mutation aliases without breaking the frontend or canonical backend routes.

## Current facts
- Public alias compatibility helper exists.
- Public alias deprecation headers are wired for `/public`.
- Runtime/static evidence confirms header middleware is present.
- Public aliases are still allowed.
- No route is blocked yet.

## Critical public mutation aliases
See:
- critical-public-mutation-aliases.txt

## Blocking strategy
Do not delete routes immediately.

Introduce blocking only through:
- `MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES=true`

Default must remain:
- allowed / compatibility mode

## Expected blocked behavior
When flag is enabled:
- critical `/public/...` mutation aliases should return HTTP 410 or HTTP 403.
- response must include structured JSON.
- response must include deprecation/public-alias headers.
- canonical non-public routes must continue to work.

## Recommended status
Use HTTP 410 Gone for retired public aliases.

Reason:
- the canonical route still exists
- the public alias is deprecated/retired
- client should migrate to canonical route

## Required response body
{
  "ok": false,
  "error": "public_alias_retired",
  "message": "This public compatibility route is retired. Use the canonical API route.",
  "canonicalRequired": true
}

## Safety requirements before implementation
- Do not block reads.
- Do not block non-critical aliases.
- Do not block canonical routes.
- Do not change frontend API helpers in this phase.
- Add runtime probe commands.
- Add node validation.
- Commit as safe patch only after verification.

## Implementation target
BACKEND-P1C.6 — Critical Public Mutation Alias Block Safe Patch

## Validation required after implementation
- node --check runtime/orchestrator-service/server.js
- node --check runtime/orchestrator-service/lib/security/public-alias-compatibility.js
- canonical route grep evidence
- public alias blocked probe evidence
- compatibility disabled/enabled behavior evidence

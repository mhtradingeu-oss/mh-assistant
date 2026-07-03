# Phase 13B.1 — Safe Patch Candidate Plan

## Recommended patch type
Tiny backend-only compatibility hardening patch.

## Patch goal
Make public mutation alias usage visible and explicitly deprecated without breaking compatibility.

## Allowed changes

- Use existing `classifyPublicAliasAccess` / `buildPublicAliasHeaders` if already present.
- Add or ensure headers on public alias responses:
  - `X-MH-Public-Alias: true`
  - `X-MH-Public-Alias-Status: deprecate`
  - `X-MH-Public-Alias-Recommendation: use-canonical-route`
- Add server-side warning log for public mutation alias use.
- Add audit docs and verification script.

## Not allowed

- Do not remove public aliases yet.
- Do not block canonical routes.
- Do not change AI Command.
- Do not change frontend pages.
- Do not change provider execution.
- Do not change publishing behavior.
- Do not change integration behavior.
- Do not change write-key semantics blindly.

## Required validation

- node --check runtime/orchestrator-service/server.js
- node --check runtime/orchestrator-service/lib/security/public-alias-compatibility.js
- node --check runtime/orchestrator-service/lib/security/route-permission-catalog.js
- grep proof that canonical routes remain
- grep proof that public aliases remain
- grep proof that public alias headers/warnings exist
- diff limited to intended backend security compatibility files plus audit files

## Follow-up after patch

PHASE 13C:
Public Mutation Alias Write-Key Coverage Proof

PHASE 13D:
Frontend Caller Migration to Canonical Routes, if any public callers are found

PHASE 13E:
Selective Retirement of Tier 1 Public Mutation Aliases

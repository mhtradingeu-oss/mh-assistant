# Phase 13E.1 — Future Selective Retirement Patch Boundary Plan

## Status
PLAN ONLY

This file defines the future patch boundary. It does not authorize code changes now.

## Future patch name

PHASE 13E.1 — Selective Retirement of First Tier 1 Public Mutation Aliases

## Future patch mode

Tiny backend compatibility/security patch.

## Allowed in future 13E.1 only after telemetry window

- Retire a very small number of selected Tier 1 public aliases.
- Prefer first wave:
  - approval decision
  - governance policy
- Return explicit 410 response:
  - ok: false
  - error: public_alias_retired
  - canonicalRequired: true
  - canonicalPrefix: /media-manager
- Keep canonical routes untouched.
- Keep public read aliases untouched.
- Keep non-selected public mutation aliases untouched.
- Add audit proof and route inventory guards.

## Not allowed in future 13E.1

- No broad wildcard block.
- No removal of canonical routes.
- No frontend changes unless a caller is found.
- No AI Command changes.
- No provider execution changes.
- No publishing behavior changes on canonical routes.
- No integration behavior changes on canonical routes.
- No write-key semantic change for canonical routes.
- No retirement of all public aliases at once.

## Required future validation

- route inventory before/after
- canonical route presence proof
- selected public alias 410 proof by static or safe HTTP test
- non-selected public aliases still functional/protected
- frontend public alias zero-use scan
- syntax validation
- no frontend diff unless explicitly planned
- no provider/publishing/integration behavior diff

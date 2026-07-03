# Phase 13B — Decision Record

## Decision
Do not patch immediately.

Use staged public mutation alias hardening.

## Reason
Phase 13A showed broad public mutation aliases but did not prove active frontend public alias callers or AI Command silent execution.

Immediate removal could break compatibility.

## Approved direction

1. Keep canonical routes untouched.
2. Keep public aliases temporarily.
3. Add visibility first:
   - deprecation headers
   - warning telemetry
   - audit proof
4. Prove write-key coverage.
5. Migrate callers if any exist.
6. Retire highest-risk aliases only after zero-use proof.

## Next phase
PHASE 13B.1 — Public Mutation Alias Deprecation Headers / Warning Telemetry Patch

Mode:
- tiny patch
- backend compatibility/security only
- no canonical route change
- no frontend change

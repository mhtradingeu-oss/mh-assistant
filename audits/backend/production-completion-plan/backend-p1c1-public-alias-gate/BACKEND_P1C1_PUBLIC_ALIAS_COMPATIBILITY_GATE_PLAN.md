# BACKEND-P1C.1 Public Alias Compatibility Gate Plan

## Status
Plan-only.

## Summary
- Total public aliases: 75
- Block by default with compatibility flag: 18
- Deprecate write aliases with warning headers: 18
- Deprecate sensitive read aliases with warning headers: 6
- Keep temporarily: 33

## Gate order
1. P1C.2: Block critical public mutation aliases by default behind compatibility flag.
2. P1C.3: Add deprecation headers and telemetry for remaining public write aliases.
3. P1C.4: Add deprecation headers and telemetry for sensitive public read aliases.
4. P1C.5: Remove public aliases after frontend/api consumers migrate to canonical routes.

## Safety decision
Do not remove routes immediately.
Do not break the current frontend.
Introduce compatibility gates first, then migrate callers, then retire aliases.

## Required implementation controls
- Environment flag for public alias compatibility.
- Deprecation headers.
- Audit event for public alias usage.
- Canonical route mapping.
- Tests proving canonical routes still work.
- Tests proving blocked aliases return expected status when compatibility is disabled.

## Next phase
BACKEND-P1C.2 — Public Alias Compatibility Gate Safe Patch

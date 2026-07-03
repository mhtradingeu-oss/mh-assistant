# Phase 13E — Public Mutation Alias Retirement Readiness Criteria

## Status
PLAN ONLY

No route can be retired until all readiness criteria are satisfied.

## Global criteria before any retirement

A public mutation alias is retirement-ready only if all criteria below are true:

1. Canonical `/media-manager/...` route exists and is validated.
2. Frontend direct `/public/media-manager/...` caller scan is zero.
3. API helper layer uses canonical route.
4. AI Command does not call the public alias directly.
5. Phase 13B.1 deprecation headers are already deployed.
6. Warning telemetry has been available for a compatibility window.
7. No telemetry hit for the target public alias during the compatibility window.
8. Unauthorized production behavior is already denied by write-key classification.
9. Authorized canonical route still works.
10. Rollback path is defined before retirement.
11. Retirement patch is limited to selected public aliases only.
12. Syntax and route inventory guards pass before commit.

## Compatibility window recommendation

Minimum compatibility window before selective retirement:

- Local/dev: immediate proof is acceptable for planning only.
- Production/staging: at least 14 days of warning telemetry observation before blocking.
- High-risk external integrations: 30 days recommended if any external callers are possible.

## Required telemetry evidence before retirement

For each candidate alias:

- alias path pattern
- method
- first observed timestamp if any
- last observed timestamp if any
- hit count
- caller metadata if available
- decision: zero-use / active-use / unknown

## Retirement should not happen if

- frontend caller scan finds any `/public/media-manager/...` caller
- telemetry shows active caller
- canonical route is missing
- write-key behavior is unclear
- route belongs to a compatibility surface still used by external scripts
- rollback is not prepared

# Phase 13B — Public Write Alias Retirement Strategy

## Strategy

Use staged retirement, not immediate deletion.

## Stage 1 — Evidence and telemetry

- Add explicit deprecation headers to public mutation alias responses.
- Add warning telemetry or log events when public mutation aliases are used.
- Keep canonical routes unchanged.
- Keep behavior unchanged except headers/logging.

## Stage 2 — Caller migration

- If any frontend public alias callers exist, move them to canonical `/media-manager/...`.
- Re-run direct caller scan.
- Confirm zero direct frontend calls.

## Stage 3 — Protection proof

- Add or run a machine-checkable guard proving every public mutation alias is covered by write-key middleware.
- Verify high-risk aliases separately:
  - publishing publish/ready
  - integration connect/disconnect
  - governance policy
  - approval decision
  - source delete
  - AI workflow run

## Stage 4 — Selective retirement

Only after zero caller proof:
- Return `410 public_alias_retired` for selected Tier 1 public mutation aliases, or
- Block only the highest-risk aliases first.

## Stage 5 — Full retirement

After stable compatibility window:
- Retire remaining public mutation aliases.
- Keep public read aliases only if explicitly needed.
- Document final canonical route map.

## Safest first patch candidate

PHASE 13B.1 should not block routes yet.

Recommended first patch:
- Add deprecation headers and warning telemetry for public mutation aliases.
- Add audit directory proof.
- No route removal.
- No canonical route change.
- No frontend behavior change.

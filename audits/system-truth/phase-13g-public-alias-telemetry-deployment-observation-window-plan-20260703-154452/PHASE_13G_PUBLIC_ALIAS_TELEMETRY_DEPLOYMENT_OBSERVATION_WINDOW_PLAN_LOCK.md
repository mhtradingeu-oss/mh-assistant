# PHASE 13G — Public Alias Telemetry Deployment / Observation Window Plan Lock

## Status
PLAN READY — DEPLOYED OBSERVATION WINDOW REQUIRED BEFORE RETIREMENT

## Mode
Plan only.

No production code change.
No backend edit.
No frontend edit.
No route change.
No CSS change.
No delete.
No implementation.
No public alias retirement.

## Verified

Phase 13G created the deployment/observation plan required before any selective retirement of `/public/media-manager/...` mutation aliases.

Verified:

- Phase 13B.1 telemetry marker remains the required observation marker.
- Required marker: `[MH][public_mutation_alias_deprecated]`.
- Observation locations were defined for local terminal, orchestrator stdout/stderr, PM2, Docker, Docker Compose, systemd/journald, reverse proxy logs, filesystem logs, and platform logs.
- Zero-hit definition was documented.
- Non-zero-hit behavior was documented.
- Observation window policy was documented.
- Future Phase 13H requirements were documented.
- Future Phase 13E.1 retirement gate was documented.
- No production diff exists.
- No backend diff exists.
- No frontend diff exists.

## Decision

Do not retire public mutation aliases now.

Phase 13F proved local zero-hit only. Phase 13G confirms that actual staging/production telemetry observation is required before any retirement.

## Required Before Any Retirement

Before any selective retirement patch:

1. Deploy telemetry patch.
2. Know the running deployed commit.
3. Observe staging/production logs.
4. Search for `[MH][public_mutation_alias_deprecated]`.
5. Search for `/public/media-manager` mutation access traces.
6. Prove zero-hit for selected aliases.
7. Confirm frontend still uses canonical `/media-manager/...` routes.
8. Confirm no compatibility incidents.
9. Prepare rollback.
10. Patch only tiny selected aliases.

## Recommended Observation Window

- 14 days minimum for staging/production.
- 30 days if external callers, scripts, older clients, or partner integrations may exist.

## Next Allowed Phase

PHASE 13H — Public Alias Telemetry Zero-Hit Confirmation

Mode:
- SCAN ONLY
- NO CODE CHANGE

Only after actual observation window evidence exists.

## Not Authorized Now

- No public alias retirement.
- No route deletion.
- No broad wildcard block.
- No frontend change.
- No canonical route change.
- No AI Command change.
- No live execution behavior change.

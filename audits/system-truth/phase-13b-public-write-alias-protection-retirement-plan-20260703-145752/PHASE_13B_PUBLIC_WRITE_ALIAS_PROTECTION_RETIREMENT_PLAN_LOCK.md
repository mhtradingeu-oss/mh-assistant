# PHASE 13B — Public Write Alias Protection / Retirement Plan Lock

## Status
PLAN READY — STAGED HARDENING RECOMMENDED

## Mode
Plan only.

No production code change.
No backend edit.
No frontend edit.
No route change.
No CSS change.
No delete.
No implementation.

## Input Authority

This plan follows:

- Phase 13 — Backend Execution / Provider / Publishing Authority Deep Audit
- Phase 13A — Execution Authority Exact Protection Matrix

## Confirmed

Phase 13B created a safe staged protection / retirement plan for legacy `/public/media-manager/...` mutation aliases.

Confirmed:

- Do not remove public mutation aliases blindly.
- Do not change canonical `/media-manager/...` routes.
- Do not change AI Command.
- Do not change frontend routing.
- Do not introduce live execution.
- Use staged hardening before any selective retirement.

## Main Finding

The main risk is broad legacy `/public/media-manager/...` mutation alias exposure.

The correct next action is not immediate deletion.

The correct next action is staged hardening:

1. Add deprecation headers.
2. Add warning telemetry.
3. Prove write-key coverage.
4. Migrate frontend callers if any are found.
5. Retire selected Tier 1 aliases only after zero-use proof.

## Risk Tiers

### Tier 0
Canonical `/media-manager/...` routes.

Decision:
- Keep untouched.

### Tier 1
Critical public aliases, including:

- publishing publish / ready
- integration connect / reconnect / disconnect
- governance policy
- approval decision
- source delete
- AI workflow run

Decision:
- Do not remove blindly.
- Add visibility first.
- Prove zero frontend usage and write-key coverage before retirement.

### Tier 2
High-risk public aliases, including:

- publishing schedule / reschedule / fail
- integration test / sync / import-history
- workflow run
- task create
- approval create
- handoff create / consume
- source create
- media/content/campaign write aliases

Decision:
- Keep temporarily.
- Add telemetry and deprecation.
- Migrate callers if any exist.
- Retire later after zero-use proof.

### Tier 3
Medium-risk public aliases, including:

- notification read-state patch
- setup/team/template/project metadata writes

Decision:
- Keep temporarily.
- Add telemetry and deprecation.
- Confirm UI confirmation gates where applicable.

## Approved Direction

Staged retirement:

1. Evidence and telemetry
2. Caller migration
3. Protection proof
4. Selective retirement
5. Full retirement later

## Recommended Next Phase

PHASE 13B.1 — Public Mutation Alias Deprecation Headers / Warning Telemetry Patch

Mode:
- tiny patch
- backend compatibility/security only
- no frontend change
- no canonical route change
- no execution behavior change

## Allowed Future Patch Shape

- Add or ensure deprecation headers on public mutation alias responses.
- Add warning telemetry/logging when public mutation aliases are used.
- Keep public aliases functional temporarily.
- Keep canonical routes untouched.
- No route blocking yet.

## Not Allowed In 13B.1

- Do not remove public aliases.
- Do not block canonical routes.
- Do not change AI Command.
- Do not change frontend pages.
- Do not change provider execution.
- Do not change publishing behavior.
- Do not change integration behavior.
- Do not change write-key semantics blindly.

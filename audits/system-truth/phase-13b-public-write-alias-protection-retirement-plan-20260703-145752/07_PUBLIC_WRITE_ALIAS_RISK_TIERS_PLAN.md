# Phase 13B — Public Write Alias Risk Tiers

## Tier 0 — Canonical routes
Canonical `/media-manager/...` mutation routes must remain untouched in the first hardening pass.

Reason:
- They are the intended backend authority routes.
- Hardening should target public compatibility aliases first.
- Breaking canonical routes would risk production functionality.

## Tier 1 — Critical public aliases

These should receive strongest hardening first.

Examples:
- `/public/media-manager/project/:project/publishing/:jobId/publish`
- `/public/media-manager/project/:project/publishing/:jobId/ready`
- `/public/media-manager/project/:project/integrations/:integrationId/connect`
- `/public/media-manager/project/:project/integrations/:integrationId/reconnect`
- `/public/media-manager/project/:project/integrations/:integrationId/disconnect`
- `/public/media-manager/project/:project/governance/policy`
- `/public/media-manager/project/:project/approvals/:approvalId/decision`
- `/public/media-manager/project/:project/sources/:sourceType` DELETE
- `/public/media-manager/project/:project/ai/workflows/:workflowId/run`

Plan:
- Do not remove blindly.
- First prove frontend usage is zero.
- Prove write-key coverage.
- Add warning telemetry.
- Add deprecation/retirement headers.
- Consider blocking only after compatibility proof.

## Tier 2 — High-risk public aliases

Examples:
- publishing schedule/reschedule/fail
- integration test/sync/import-history
- workflow run
- tasks create
- approvals create
- handoffs create/consume
- sources create
- media jobs create/patch
- content/campaign write aliases

Plan:
- Keep temporarily if compatibility unknown.
- Add deprecation headers and telemetry.
- Move callers to canonical routes if any are found.
- Retire later after zero-use evidence.

## Tier 3 — Medium-risk public aliases

Examples:
- notification read-state patch
- setup/team/template/project metadata writes

Plan:
- Keep temporarily.
- Add telemetry and deprecation.
- Confirm UI confirmation gates where applicable.

## Non-goals

- Do not change canonical `/media-manager/...` routes.
- Do not change AI Command.
- Do not change frontend routing.
- Do not remove aliases without proof.
- Do not introduce live execution.

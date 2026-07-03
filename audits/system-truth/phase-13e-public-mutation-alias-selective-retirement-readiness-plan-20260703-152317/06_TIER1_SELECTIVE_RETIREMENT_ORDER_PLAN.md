# Phase 13E — Tier 1 Selective Retirement Order Plan

## Status
PLAN ONLY

No route retirement in this phase.

## Tier 1 candidates

Tier 1 public mutation aliases are the highest-risk public compatibility routes.

### Group A — Governance and approval authority

1. `/public/media-manager/project/:project/approvals/:approvalId/decision`
2. `/public/media-manager/project/:project/governance/policy`

Reason:
- Approval and governance decisions are authority-bearing.
- They should only be performed through canonical controlled routes.

Readiness:
- Strong candidate for first retirement after zero-use telemetry.
- Must verify Operations/Governance pages use canonical helpers only.

### Group B — Publishing finalization

3. `/public/media-manager/project/:project/publishing/:jobId/publish`
4. `/public/media-manager/project/:project/publishing/:jobId/ready`

Reason:
- Publishing readiness/final publish are sensitive execution states.
- Final publishing should remain canonical and governed.

Readiness:
- Strong candidate after proving no external publishing caller uses public alias.
- Keep schedule/reschedule for later Tier 2 unless risk decision changes.

### Group C — Integration credential/control actions

5. `/public/media-manager/project/:project/integrations/:integrationId/connect`
6. `/public/media-manager/project/:project/integrations/:integrationId/reconnect`
7. `/public/media-manager/project/:project/integrations/:integrationId/disconnect`

Reason:
- Connect/reconnect/disconnect affects external account linkage and credentials.

Readiness:
- Candidate after confirming no external setup scripts use public aliases.
- Requires careful rollback because integration onboarding may have legacy references.

### Group D — Source deletion

8. `/public/media-manager/project/:project/sources/:sourceType` DELETE

Reason:
- Source deletion can remove project source-of-truth references.

Readiness:
- Candidate after confirming source-management UI uses canonical route only.

### Group E — AI workflow execution

9. `/public/media-manager/project/:project/ai/workflows/:workflowId/run`

Reason:
- Workflow execution should never be public compatibility accessible long-term.

Readiness:
- Candidate after proving AI Command and Workflows page use canonical helpers only.

## Recommended retirement order

1. Approval decision
2. Governance policy
3. Publishing publish
4. Publishing ready
5. AI workflow run
6. Source delete
7. Integration disconnect
8. Integration reconnect
9. Integration connect

## Why this order

- Start with authority-bearing state changes.
- Then publishing finalization.
- Then workflow execution.
- Then destructive source deletion.
- Then integration lifecycle actions, which may have external compatibility risk.

## Not included in first retirement wave

- publishing schedule/reschedule/fail
- integration test/sync/import-history
- task create
- handoff create/consume
- campaign/content/media writes
- notification patch
- project setup/team/template metadata writes

These remain Tier 2/Tier 3 and require a later plan.

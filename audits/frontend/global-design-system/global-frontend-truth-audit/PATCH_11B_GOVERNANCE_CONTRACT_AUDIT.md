# Patch 11B — Governance Contract Audit

## Status

Audit-only / no production change.

This audit maps the frontend Governance contract into backend-authoritative policy, approval, request, sync, evidence, and AI-review boundaries before any Governance production patch is considered.

## Production Decision

No production code was changed.

Reason:

- Governance loads backend summary data.
- Governance can submit approval decisions.
- Governance can create approval requests.
- Governance can save durable Governance policy rules and approval owners.
- Governance can sync Settings-derived rules into durable Governance policy.
- Governance includes publish guardrails, override controls, escalation paths, evidence intake, and decision notes.
- Any future production change must preserve backend authority and confirmation paths.

## Current Active File

- `public/control-center/pages/governance.js`

## API / Import Contract

Governance imports and uses:

- `fetchProjectGovernance`
- `decideProjectApproval`
- `createProjectApproval`
- `updateProjectGovernancePolicy`

These define the major backend-authoritative paths for the page.

## Read Contract

Governance loads data through:

- `fetchProjectGovernance(projectName, { timeline_limit: 60 })`

The result is stored in:

- `session.summary`

The summary is then projected into:

- executive governance command band
- signal inventory
- policy visibility
- approval owners
- decision queue
- selected decision panel
- evidence summary
- intake panel
- review ownership
- AI preparation prompts

## Refresh Contract

Governance refresh works by:

- setting `session.loaded = false`
- calling `loadGovernance`
- re-rendering the page
- surfacing any load error through `showError`

This is a read/refresh path and should not mutate policy by itself.

## Decision Confirmation Contract

Governance decisions route through:

- `confirmGovernanceDecision(decision)`
- `getDecisionConfirmationMessage(decision)`

Decision messages clarify:

- decisions are backend Governance decisions
- decisions may affect downstream readiness
- decisions do not publish, send, or execute directly
- overrides are high-risk and require source evidence, risk, owner, and reason

## Approval Decision Contract

Approval decision buttons use:

- `data-governance-decision`
- `data-approval-id`

Supported decisions include:

- `approved`
- `rejected`
- `changes_requested`
- `escalated`
- `overridden`

The handler calls:

- `decideProjectApproval(projectName, approvalId, { decision, note, actor: "governance-console", escalate_to })`

This is backend-authoritative and must remain confirmation-gated.

## Approval Request Contract

Governance can create approval requests for selected non-approval governance items using:

- `data-governance-request-approval`
- `data-entity-type`
- `data-entity-id`
- `data-title`
- `data-risk`
- `data-summary`

The handler calls:

- `createProjectApproval(projectName, payload)`

The payload includes:

- entity type
- entity id
- title
- summary
- reviewer
- reviewer role
- requested by
- requested for
- risk level
- source page
- route target

This can add a new approval item to the Governance queue and must remain explicit.

## Policy Controls Contract

Editable policy controls are projected through:

- `data-governance-policy`
- `data-governance-owner`

Policy controls include:

- `approval_before_publish`
- `high_risk_claim_review_required`
- `brand_safety_review_required`
- `auto_escalate_critical_risk`
- `allow_admin_override`
- `freeze_publishing`

Owner controls include:

- `content`
- `media`
- `publishing`

The save action collects these controls and calls:

- `updateProjectGovernancePolicy(projectName, { actor: "governance-console", policy_rules, approval_owners })`

This is durable policy mutation and must remain confirmation-gated.

## Settings Sync Contract

Governance can sync Settings-derived rules through:

- `data-governance-action="sync-settings"`

It reads:

- `getSettingsDraftFromPolicy(session.summary)`

Then maps the draft through:

- `mapSettingsToGovernancePolicy(settingsDraft)`

Then calls:

- `updateProjectGovernancePolicy(projectName, { actor: "governance-console", ...mappedSettingsPolicy })`

This links Settings and Governance authority and must remain explicit and confirmation-gated.

## Decision Queue Contract

Governance builds a unified queue from summary sections:

- `approval_queue`
- `claim_review`
- `brand_safety_review`
- `publish_guardrails`
- `escalation_queue`

Each queue item is normalized into:

- queue kind
- selected key
- title
- summary
- status
- risk
- owner
- created time
- flags
- linked approval when available

Queue filtering and selection are frontend projection only, while approval decisions and request creation are backend-authoritative.

## Evidence / Intake Contract

Governance evidence summary collects and classifies evidence from:

- selected item
- project data
- governance data

Evidence categories include:

- source of truth
- legal
- pricing
- certificate
- proof
- product
- brand
- claim
- media
- content
- library
- other

The intake panel can surface incoming context from:

- AI Team
- Publishing
- Content Studio
- Media Studio
- Workflows
- Operations
- Notifications
- Insights

Evidence/intake display is frontend projection, but it supports backend-governed decision quality.

## AI Boundary Contract

Governance AI actions use:

- `data-governance-open-ai`
- `data-governance-ai-prompt`

The AI path:

- opens AI Command
- writes prompt text into the quick command input
- shows a message

AI does not:

- approve
- reject
- override
- create approval requests
- save policy
- sync Settings rules
- publish
- send
- execute backend mutations

## Backend / Durable Authority Boundary

Backend-authoritative paths:

- `fetchProjectGovernance`
- `decideProjectApproval`
- `createProjectApproval`
- `updateProjectGovernancePolicy`
- approval decision submission
- approval request creation
- policy save
- Settings-derived policy sync
- freeze publishing policy
- admin override policy
- approval owner updates

## Frontend Projection Boundary

Frontend-only / projection paths:

- queue filtering
- queue selection
- readiness display
- signal inventory
- selected decision display
- evidence summary display
- intake panel display
- AI prompt preparation
- focus tabs
- local decision note text before submission

## Data Attribute Inventory

Observed Governance attributes:

- `data-governance-action`
- `data-governance-ai-prompt`
- `data-governance-decision`
- `data-governance-focus`
- `data-governance-open-ai`
- `data-governance-owner`
- `data-governance-policy`
- `data-governance-request-approval`
- `data-governance-select`

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `decideProjectApproval`
2. `createProjectApproval`
3. `updateProjectGovernancePolicy`
4. `fetchProjectGovernance`
5. `confirmGovernanceDecision`
6. `getDecisionConfirmationMessage`
7. `data-governance-decision`
8. `data-governance-request-approval`
9. `data-governance-policy`
10. `data-governance-owner`
11. `data-governance-action="save-policy"`
12. `data-governance-action="sync-settings"`
13. `mapSettingsToGovernancePolicy`
14. `buildDecisionQueue`
15. `renderPolicyControls`
16. approval decision note behavior
17. approval request payload
18. policy owner payload
19. freeze publishing policy
20. admin override policy
21. evidence intake behavior
22. publish guardrail interpretation

## Recommended Future Patch

### Patch 11C — Governance Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- backend authority
- confirmation-required decisions
- AI review-only boundary
- approval request creation
- policy save impact
- Settings sync impact
- publish guardrails not being direct publishing
- overrides requiring evidence and reason

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- handler changes
- API changes
- decision logic changes
- policy save changes
- Settings sync changes
- queue model changes
- evidence model changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/governance.js`
- route ID: `governance`
- `data-page="governance"`
- all `data-governance-*` attributes
- all API calls
- all approval decision behavior
- all approval request behavior
- all policy save behavior
- all Settings sync behavior
- all queue projection behavior
- all evidence/intake behavior
- all AI routing behavior
- all backend/API behavior
- all project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/governance.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future Governance production patch:

- Open Governance.
- Confirm governance summary loads.
- Refresh Governance data.
- Use queue filters.
- Select queue items.
- Confirm selected decision panel updates.
- Confirm AI buttons only route to AI Command.
- Confirm approval decision buttons appear only for approval queue items.
- Submit approval decisions only in a safe test project.
- Confirm decision confirmation appears.
- Create approval request only in a safe test project.
- Confirm policy save confirmation appears.
- Confirm Settings sync confirmation appears.
- Confirm policy controls remain explicit.
- Confirm no publish/send/direct execution action appears.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

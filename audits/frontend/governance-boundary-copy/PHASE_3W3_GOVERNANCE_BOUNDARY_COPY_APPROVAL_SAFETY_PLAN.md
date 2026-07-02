# PHASE 3W.3 — Governance Boundary Copy / Approval Safety Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3W.2 — Governance Approval / Policy Execution Safety Audit`
- Previous commit: `985fdaa Add Governance execution safety audit`

## Purpose
Plan safe copy/label improvements for Governance after execution safety audit confirmed Governance is a backend-authoritative approval and policy surface.

The goal is to prevent operators from confusing:
- UI review actions
- backend approval creation
- backend approval decisions
- high-risk override decisions
- durable governance policy changes
- Settings-to-Governance policy sync
- AI guidance-only handoff
- Publishing hard gates

## Evidence From PHASE 3W.2
Confirmed:
- Governance has UI-only focus/navigation actions.
- Governance creates backend approval requests.
- Governance submits backend approval decisions.
- Governance updates backend governance policy.
- Governance can sync Settings-derived rules into Governance policy.
- Governance AI actions are guidance-only.
- Backend Publishing gates can depend on Governance policy:
  - `freeze_publishing`
  - `approval_before_publish`
  - approved/overridden publishing approval

## Copy Risk Areas

### 1. Request Approval
Risk:
Creates a backend approval request, but current evidence did not show explicit confirmation.

Recommended copy direction:
- Request backend approval review
- Create approval request
- Adds a durable approval queue item
- Does not approve anything by itself

### 2. Submit Approval Decision
Risk:
Records a backend approval decision that may affect downstream readiness.

Recommended copy direction:
- Submit reviewed approval decision
- Records backend decision
- May affect publishing readiness where policy requires approval

### 3. Record Override Decision
Risk:
Critical. Backend publishing gates may accept `overridden` like `approved`.

Recommended copy direction:
- Record high-risk override decision
- Override can unblock downstream gated actions
- Requires evidence, owner, and risk review
- Does not publish by itself

### 4. Save Governance Policy
Risk:
Durable backend policy mutation affecting approvals, publishing, brand safety, overrides, and owners.

Recommended copy direction:
- Save backend Governance policy
- Durable policy update
- Can affect approval-before-publish and freeze-publishing

### 5. Review & Sync Settings Rules
Risk:
Settings-derived rules can overwrite/sync into Governance policy.

Recommended copy direction:
- Review and sync Settings-derived rules
- Updates Governance policy from Settings bridge
- Must be reviewed before sync

### 6. AI Context / AI Prompt Guidance
Risk:
Operator may think AI can approve.

Recommended copy direction:
- AI guidance only
- AI cannot approve or change policy
- Human-reviewed backend decision required

### 7. Publishing Gate Relationship
Risk:
Operator may not realize Governance can hard-gate Publishing.

Recommended copy direction:
- Publishing readiness may be blocked by Governance policy
- `approval_before_publish` and `freeze_publishing` are backend-governed
- Approved or overridden Governance decision may satisfy publishing approval gate

## Allowed Future Patch Scope
A future patch may change:
- Button labels.
- Helper copy.
- Confirmation copy.
- Warning banners.
- Section headings.
- Success messages.

A future patch must not change:
- Handlers.
- API calls.
- Backend routes.
- CSS.
- Data files.
- Approval logic.
- Policy logic.
- Publishing execution behavior.
- AI behavior.

## Required Browser QA After Patch
Check:
- Governance page loads.
- Authority boundary banners remain visible.
- Request Approval is clearly described as approval request creation.
- Approval decision copy says backend decision.
- Override copy is high-risk and evidence/owner/risk-gated.
- Policy save copy clearly says durable backend policy update.
- Settings sync copy clearly says Settings-derived rules sync to Governance policy.
- AI copy clearly says guidance only.
- No backend-mutating action is executed during QA.

## Recommended Next Phase
`PHASE 3W.4 — Governance Copy-Only Approval Boundary Safe Patch`

Do not implement until this plan is reviewed and committed.

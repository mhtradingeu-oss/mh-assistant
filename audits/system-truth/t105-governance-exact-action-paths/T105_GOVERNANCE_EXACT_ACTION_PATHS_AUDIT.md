# T105 — Governance Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing runtime authority paths in:

- `public/control-center/pages/governance.js`

This follows T104, which confirmed Governance contains backend approval, decision, policy, and evidence/source signals.

## Paths to classify

### 1. Governance queue display / refresh
Expected classification:
- Read-only fetch via `fetchProjectGovernance`.
- No confirmation required unless backend mutation occurs.

### 2. Submit Reviewed Approval
Expected classification:
- Backend decision through `decideProjectApproval`.
- Must require confirmation.

### 3. Submit Rejection Decision
Expected classification:
- Backend decision through `decideProjectApproval`.
- Must require confirmation.

### 4. Request Changes Review
Expected classification:
- Backend decision/change request through `decideProjectApproval`.
- Must require confirmation.

### 5. Escalate Review
Expected classification:
- Backend decision/escalation through `decideProjectApproval`.
- Must require confirmation.

### 6. Record High-Risk Override
Expected classification:
- High-risk backend decision through `decideProjectApproval`.
- Must require strong confirmation and clear source/evidence warning.

### 7. Create Approval Request
Expected classification:
- Durable backend queue item through `createProjectApproval`.
- Must require confirmation.

### 8. Governance policy controls
Expected classification:
- Backend policy mutation through `updateProjectGovernancePolicy` or local draft/settings bridge.
- Must require confirmation if durable backend policy changes.

### 9. Ask AI for Guidance / prompts
Expected classification:
- Shared AI context/prompt only.
- Must not approve/reject/change policy.

### 10. Source/evidence intake
Expected classification:
- Display/intake context only unless persisted.
- If durable evidence record is created, must require confirmation.

## Decision Rule
- If approve/reject/escalate/override decisions mutate backend without confirmation, patch.
- If approval request creation mutates backend without confirmation, patch.
- If policy control changes mutate backend without confirmation, patch.
- If AI guidance is shared context only, document and close.
- Do not redesign Governance in this pass.

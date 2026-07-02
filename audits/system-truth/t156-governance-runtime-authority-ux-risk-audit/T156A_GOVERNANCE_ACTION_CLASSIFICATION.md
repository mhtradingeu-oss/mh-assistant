# T156A — Governance Action Classification

## Status
Audit only. No implementation.

## Source Owner
Primary page source:
- `public/control-center/pages/governance.js`

## Risk Level
High.

Governance is a backend-owned decision and approval surface. It is not a simple read-only dashboard.

## Action Classification

### Read / Refresh Actions
Observed:
- `fetchProjectGovernance`
- `loadGovernance`
- `refreshGovernance`

Classification:
- Read/refresh.
- Backend-owned read authority.
- Safe only when it does not mutate decision state.

### Approval Decision Actions
Observed buttons:
- `data-governance-decision="approved"`
- `data-governance-decision="rejected"`
- `data-governance-decision="changes_requested"`
- `data-governance-decision="escalated"`
- `data-governance-decision="overridden"`

Classification:
- Mutation-capable.
- Backend-owned durable Governance decision.
- High-risk.
- Must remain protected by confirmation, backend validation, project context, approval id, and policy gates.

### Approval Request Actions
Observed:
- `data-governance-request-approval="true"`

Classification:
- Mutation-capable.
- Creates a durable Governance queue item.
- Does not directly approve, reject, publish, send, or execute.
- Still requires backend authority and confirmation.

### Policy Actions
Observed:
- `updateProjectGovernancePolicy`

Classification:
- Mutation-capable.
- High-risk configuration/policy write.
- Must remain backend-owned.
- Any UI change must not weaken policy boundaries or imply automatic approval.

## Safety Boundaries
Governance may record approvals, rejections, escalations, changes requested, override decisions, and policy updates.

Governance must not:
- publish directly
- send customer messages directly
- execute providers directly
- bypass policy gates
- bypass backend validation
- bypass approval id / project context checks
- convert AI guidance into direct approval

## UX Risk
Any visual polish must clearly distinguish:
- read-only summary
- pending review
- review notes
- approval request creation
- final decision buttons
- high-risk override action

## Browser QA Required For Future Patch
Required route:
- `http://127.0.0.1:3000/control-center/#governance`

Checks:
- page loads
- approval queue visible
- policy section visible
- decision controls remain explicit
- override remains visibly high-risk
- confirmation behavior unchanged
- no direct publish/send/execute behavior introduced

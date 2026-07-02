# T106 — Governance AI Boundary Audit

## Status
Audit-only. No production files changed.

## Scope
Focused audit of AI-related paths inside:

- `public/control-center/pages/governance.js`

This follows T104/T105, which confirmed Governance is a backend approval, decision, and policy authority surface.

## Question
Does Governance AI guidance remain explanation-only, or can it influence / mutate authority paths?

## Paths to classify

### 1. Open AI button
Expected classification:
- Navigation only to AI Command.
- No decision, policy, approval, or backend mutation.

### 2. Governance AI prompt buttons
Expected classification:
- Save prompt into AI Command / quick command only.
- Navigate to AI Command.
- No `decideProjectApproval`.
- No `createProjectApproval`.
- No `updateProjectGovernancePolicy`.

### 3. Prompt content
Expected classification:
- Must clearly ask for review/explanation/guidance.
- Must not ask AI to approve, reject, override, or change policy directly.

### 4. Decision provenance
Expected classification:
- Backend decisions still require:
  - selected approval item
  - human note/reason
  - confirmation
  - `decideProjectApproval`

### 5. Cross-surface handoff
Expected classification:
- If AI receives governance context, it must be context only.
- No durable backend handoff should be created unless intentionally routed through a reviewed path.

## Decision Rule
- If AI path only prepares prompts / navigates, close without patch.
- If AI path writes backend, creates approval, updates policy, or calls decision functions, patch.
- If prompt language overclaims authority, patch wording only.
- Do not redesign Governance.

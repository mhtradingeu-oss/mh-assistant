# T158 — Governance UX Contract

## Status
Contract only. No implementation.

## Baseline
- `5abe6e1 Close Governance current browser QA`

## Purpose
Define the required Governance operating-surface contract before any future UI, CSS, or structural polish.

Governance is a high-risk backend-owned decision surface. The UI must make authority, risk, evidence, and decision boundaries impossible to misunderstand.

## Page Role
Governance is the canonical surface for:
- approval pressure
- policy authority
- escalation routing
- evidence review
- decision recording
- override visibility
- safe governance handoff

Governance is not:
- a publishing surface
- a sending surface
- a provider execution surface
- an AI auto-approval surface

## Required Operating Surface Structure

### 1. Executive Header
Must show:
- project context
- readiness status
- approval pressure
- highest risk
- authority owner
- AI role boundary

Purpose:
Give a fast understanding of whether human governance action is required.

### 2. Next Best Governance Action
Must show:
- selected or highest-priority governance action
- owner
- risk level
- safe route forward
- links to queue / approval focus / AI guidance

Purpose:
Prevent the page from becoming a passive dashboard.

### 3. Supporting Signals
Must show:
- approval queue count
- policy violations
- claim review
- brand safety
- publish guardrails
- escalations
- recent signal list

Purpose:
Provide context without hiding the active decision.

### 4. Policy and Rule Summary
Must separate:
- read-only active rules
- approval owners
- editable policy controls

Policy writes are mutation-capable and must remain visibly distinct from summary information.

### 5. Decision Queue
Must show:
- pending approvals
- item title
- type
- risk
- owner
- status
- created time

Purpose:
Make selection and decision context clear before any action.

### 6. Selected Decision
Must show:
- selected approval/decision title
- risk
- owner
- status
- linked approval
- evidence summary
- incoming review context
- policy flags
- decision history

Purpose:
Make it impossible to submit a decision without seeing context.

### 7. Governance Actions
Must show:
- authority boundary
- safe execution path
- decision note / rationale field
- refresh action
- policy save action
- reviewed approval action
- rejection action
- change request action
- escalation action
- high-risk override action

High-risk override must never appear as a casual secondary action.

### 8. AI Governance Assistant
Must show:
- explanation-only role
- no approval authority
- no policy change authority
- no override authority
- prompt cards for summarizing, reviewing, and finding governance gaps

AI must help prepare decisions, not make decisions.

## Action Classification Contract

### Read-only / Context Actions
Examples:
- refresh governance data
- focus approvals
- view full queue
- open AI context
- ask AI for guidance

These must not imply backend decision mutation.

### Backend Mutation Actions
Examples:
- submit reviewed approval
- submit rejection decision
- request changes
- escalate review
- record high-risk override
- save backend governance policy
- sync settings-derived rules if it writes backend state

These must remain:
- explicit
- confirmed
- backend validated
- project-scoped
- owner/risk aware
- visually separated from read-only context actions

## Visual Contract

Governance must prioritize:
1. Authority boundary
2. Evidence and source truth
3. Selected decision context
4. Safe action path
5. High-risk override clarity
6. AI limitation clarity

Governance should avoid:
- mixing policy edits with read-only summary
- making approval buttons look like navigation
- hiding override risk
- presenting AI suggestions as final decision authority
- adding more visual layers to `12-pages.css`

## CSS Ownership Contract

Current state:
- Governance CSS is concentrated in `public/control-center/styles/12-pages.css`.

Contract:
- Do not expand `12-pages.css`.
- Do not expand `14-page-standard.css`.
- Do not delete existing Governance CSS yet.
- Any future Governance polish should first decide owner CSS strategy.

Preferred next CSS path:
- create/introduce a dedicated Governance CSS owner file only after a wiring and QA plan is approved.

Potential owner file:
- `public/control-center/styles/09-governance.css`

Final naming must be confirmed before implementation.

## Browser QA Required For Any Patch
Route:
- `http://127.0.0.1:3000/control-center/#governance`

Checks:
- no crash
- no console syntax error
- header visible
- executive summary visible
- decision queue visible
- selected decision visible
- evidence summary visible
- governance actions visible
- policy controls visible
- AI limitation visible
- override remains high-risk
- confirmation behavior unchanged
- no publish/send/execute behavior introduced

## Forbidden Until Next Decision
No production JS change.
No production CSS change.
No backend change.
No API change.
No route change.
No data/projects change.
No mutation behavior change.
No provider execution change.
No AI execution behavior change.
No `12-pages.css` expansion.
No `14-page-standard.css` expansion.

## Recommended Next Phase
Proceed to:

- `T159 — Governance CSS Ownership Decision`

The next phase should decide whether to introduce a dedicated Governance CSS owner file or defer Governance polish and move to AI Command.

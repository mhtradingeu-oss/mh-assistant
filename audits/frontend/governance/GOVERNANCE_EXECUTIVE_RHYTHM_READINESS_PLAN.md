# GOVERNANCE EXECUTIVE RHYTHM READINESS PLAN

**Date:** 2026-05-24  
**Mode:** Readiness / planning only - no implementation  
**Target:** `public/control-center/pages/governance.js`

**References:**
- `audits/frontend/global-ui/SYSTEM_WIDE_EXECUTIVE_SURFACE_CONSISTENCY_AUDIT.md`
- `audits/frontend/governance/GOVERNANCE_FINAL_EXECUTIVE_OPERATING_SURFACE_PASS.md`
- `audits/frontend/home/HOME_EXECUTIVE_BRAIN_SYNTHESIS_REPORT.md`

---

## 1. Purpose

This plan prepares Governance for a controlled executive rhythm convergence pass. The goal is not to redesign the page yet. The goal is to define the safest path for making Governance feel like a calm, authoritative MH-OS executive operating surface while preserving every governance safety, backend authority, approval, policy, escalation, and lifecycle contract.

Governance already contains the right operating ingredients: readiness, policy rules, owners, decision queue, selected decision context, evidence, actions, escalation, audit history, and context-only AI prompts. The next pass should change the attention order, not the authority model.

---

## 2. Current First-Screen Hierarchy

### What Appears First

The loaded Governance render currently begins in this order:

1. Command surface header with project name, status badge, and actions:
   - `Refresh Governance Data`
   - `Open AI Context`
   - `Focus Approvals`
2. System signals panel with six metrics:
   - Approval Queue
   - Policy Violations
   - Claim Review
   - Brand Safety
   - Publish Guardrails
   - Escalations
3. Recent audit timeline snippet.
4. Readiness and blockers panel:
   - Readiness state
   - Decision queue count
   - Approval owner coverage
   - Escalation count
   - Blocker list
   - Next best action
5. Policy/rule summary and decision queue.
6. Selected decision, evidence, intake, ownership, actions, escalation chain, and AI assistant.

### What Dominates Visually

The first visible impression is a generic governance command page plus a metric inventory. The system signals grid is useful, but it currently competes with the readiness and next action surface. Audit history also appears very early, which makes the first screen feel like a status console instead of an executive decision surface.

The visual hierarchy currently emphasizes:

- Availability: Governance is active.
- Inventory: how many governance items exist.
- History: what happened recently.
- Detail: policy and queue data.

It does not yet put the strongest executive question first: **what governance decision or blocker needs attention now?**

### What Should Dominate Instead

The first screen should be led by a fixed executive governance command band:

1. Governance readiness state.
2. Next best governance action.
3. Approval pressure.
4. Escalation state.
5. Highest visible risk severity.
6. Authority owner.
7. Safe next action.
8. AI-safe preparation option.

System metrics, policy rules, queue tables, and audit history should remain visible, but subordinate to that decision rhythm.

---

## 3. Governance Executive Rhythm Assessment

Governance should answer the same executive questions defined by the system-wide audit and Home brain synthesis, translated into governance authority language.

| Question | Current answer quality | Readiness need |
| --- | --- | --- |
| What matters now? | Medium. `buildReadinessSnapshot()` computes `nextBestAction`, but it appears after system signals. | Promote next best governance action into the first executive band. |
| Why is it blocked/risky? | Medium-high. Blockers, risk badges, flags, and evidence exist. | Tie the blocker directly to risk severity and selected decision context. |
| Who owns it? | Medium. Queue owner and approval owners exist, but owner coverage is abstract. | Promote the active authority owner for the current priority. |
| What approval/escalation is required? | High data availability, medium hierarchy. Approvals and escalations are counted and actionable. | Show approval requirement and escalation route as first-screen anchors. |
| What is the safe next action? | Medium. Safe action copy exists in the action panel and readiness panel. | Make the safe next action one explicit primary CTA or route, with authority caveat nearby. |
| What can AI safely prepare? | Medium. AI prompts are contextual and safe, but appear late. | Position AI as an explanation/preparation aid beside the next action, not as a decision maker. |

Readiness conclusion: Governance is ready for a hierarchy convergence pass, but not for behavior changes. The pass should promote already-computed governance state and reuse existing decision/refresh/focus/open-AI handlers.

---

## 4. Governance Overload Map

### Policy Density

Policy density is high in the `Policy visibility` panel. It contains active rules, approval owners, editable policy controls, open policy signal, and Settings bridge state. This is important data, but it is too dense to serve as early executive cognition.

Planning direction:

- Keep policy details intact.
- Move policy into a subordinate "authority model" section after the readiness/action anchor.
- Surface only the active policy consequence in the executive band, such as `Approval before publish: enabled`, `Publishing frozen`, or `High-risk claim review required`.

### Queue Density

The decision queue is structurally useful and should stay central. It includes focus tabs, queue table, risk, owner, status, and created date. The density risk comes from presenting the full queue before the selected decision has a strong executive summary.

Planning direction:

- Keep the queue table and focus tabs.
- Do not change queue item selection behavior.
- Add or promote a compact queue pressure summary above the table.
- Treat the table as inspection, not the first executive answer.

### Duplicated Authority Signals

Authority appears in several places:

- `Readiness and blockers` owner coverage.
- `Policy visibility` approval owners.
- `Selected decision` owner.
- `Review model` ownership and escalation chain.
- `Governance actions` authority boundary.
- Confirmation dialogs for decisions and policy sync.

Planning direction:

- Keep all authority gates and confirmations.
- Consolidate repeated explanatory text into one visible authority boundary near the action surface.
- Use badges or compact labels for repeated safety states, such as `Backend authoritative`, `Review required`, `No publish action`.

### Helper Text Overload

Helper copy is useful but repeated:

- "Operating surface for policy authority..."
- "Use this to understand..."
- "Track enforceable rules..."
- "Prioritize high-risk..."
- "Review risk..."
- "Submit backend-authoritative..."
- "Context-only intelligence handoff..."

Planning direction:

- Keep safety-critical language.
- Shorten non-critical helper copy.
- Replace repeated helper paragraphs with stable canonical labels where possible.

### Escalation Clutter

Escalation appears as:

- System signal metric.
- Readiness count.
- Queue focus.
- Escalation chain.
- Escalation decision action.
- Confirmation-derived `escalate_to`.

Planning direction:

- Separate escalation state from escalation configuration.
- First screen should show whether escalation is active and who it routes to.
- Detailed escalation chain should remain in the action/detail area.

### Audit and History Clutter

Audit history is important for trust, but it currently appears in the second panel and selected decision detail. This can make the top of the page feel archival before it feels decisive.

Planning direction:

- Keep audit history visible.
- Demote global recent timeline below readiness and queue.
- Keep selected item history near selected decision details.

---

## 5. Governance Cognition Anchors

The convergence pass should define these as fixed anchors. They should remain visible, consistently named, and structurally stable.

### Governance Readiness

Meaning: Is Governance clear, attention-required, or blocked?

Source today: `buildReadinessSnapshot().state`.

Target role: primary first-screen status, not a secondary card.

### Next Best Governance Action

Meaning: What governance move should happen next?

Source today: `buildReadinessSnapshot().nextBestAction`.

Target role: primary executive recommendation. It should include the destination or action type: focus approvals, inspect policy violations, review publish guardrails, or review selected approval.

### Escalation State

Meaning: Is a higher-level review active or required?

Source today: `sections.escalation_queue`, `summary.review_model.escalation_chain`, selected queue item kind.

Target role: compact first-screen signal plus detailed chain lower in the action/detail area.

### Approval Pressure

Meaning: How much decision pressure exists?

Source today: `sections.approval_queue`, focus counts, queue items.

Target role: top-level pressure signal beside readiness and risk.

### Authority Owner

Meaning: Who owns the current reviewed decision or policy lane?

Source today: `selectedItem.queue_owner`, `policy.approval_owners`, `summary.review_model.ownership`.

Target role: first-screen active owner for the highest-priority item, with detailed owner model below.

### Risk Severity

Meaning: What is the highest or selected risk level?

Source today: `selectedItem.queue_risk`, queue flags, policy violations, claim flags, brand flags, publish guardrails.

Target role: visible risk badge tied to next best governance action.

### Runtime Governance Continuity

Meaning: What changed, what is still pending, and how does Governance remain in sync after action?

Source today: refresh/load lifecycle, audit timeline, selected history, `refreshGovernance()` after mutations.

Target role: quiet continuity signal. The user should know decisions refresh and validate queue impact, but audit/history should not dominate first screen.

---

## 6. Workflow Visibility Readiness

### Handoffs

Handoff visibility is partial. Governance has an Incoming Review Context panel and selected decision evidence, but shared handoff helpers are referenced through guarded globals rather than explicit imports. This means the UI can imply durable handoff intake while showing `No intake yet`.

Planning direction:

- Treat current handoff intake as informational, not a reliable workflow backbone.
- Do not make handoff intake the central anchor until its data contract is confirmed.
- The convergence pass may visually reserve an intake lane, but it should not imply complete durable routing unless backed by real data.

### Governance Routing

Routing is understandable at a basic level:

- Top actions focus approvals or open AI.
- Queue rows select decisions.
- Non-approval selected items can request approval review.
- Approval items can be approved, rejected, changed, escalated, or overridden.

Risk: routing is action-heavy and not framed as a workflow path.

Planning direction:

- Clarify route order as: intake -> risk/evidence -> owner -> decision -> refresh/validate.
- Use workflow language only for real state movement, not generic buttons.

### Escalation Movement

Escalation movement is understandable in code, but not visually strong. The action handler derives `escalate_to` from the high-risk escalation chain, while the page separately renders the chain. The user sees the chain, but not necessarily the active next escalation destination.

Planning direction:

- First-screen anchor should show active escalation count and next escalation owner when known.
- Detailed chain should remain lower, unchanged in data and behavior.

### Blocked Approvals

Blocked approvals are contextualized through readiness blockers and queue rows. The missing piece is a single selected or highest-priority blocked approval summary at the top.

Planning direction:

- Promote selected/highest-risk approval context into the executive band.
- Keep full queue table for inspection.
- Keep decision note and action buttons in the detailed action panel.

---

## 7. AI Governance Positioning

### What AI Should Explain

AI should be allowed to explain:

- Current governance state.
- Approval pressure.
- Policy pressure.
- Risk severity and likely policy implication.
- Source/evidence gaps.
- Suggested decision path.
- Owner and escalation path.
- Safe review checklist.
- What downstream workspace is affected.
- Why a decision should wait.

### What AI Should Never Do

AI should never:

- Approve, reject, escalate, or override an approval.
- Save governance policy.
- Sync settings rules into governance policy.
- Publish, send, execute, or mutate downstream work.
- Change approval owners.
- Remove policy flags.
- Claim that a risky item is safe without evidence.
- Replace the human decision note or governance confirmation.
- Bypass backend authority.

### How AI Guidance Should Appear

AI guidance should appear as a compact preparation aid near the next action:

- Label: `AI can prepare`.
- Output: summary, rationale draft, evidence checklist, owner/escalation explanation, or policy gap review.
- Boundary: `Guidance only - decisions stay in Governance controls`.

AI should not visually overpower the governance authority surface. The primary action should remain a governance action or queue focus. AI should be secondary, adjacent, and explicitly non-executing.

---

## 8. Primitive Convergence Readiness

### Shared Executive Primitive Candidates

Governance is ready to adopt shared executive primitives in the first-screen command layer:

- `mhos-executive-surface` for the promoted governance command band.
- `mhos-executive-summary-grid` for readiness, approval pressure, escalation, risk, owner, and runtime continuity.
- `mhos-executive-summary-item`, `mhos-executive-metric-label`, `mhos-executive-metric-value`, and `mhos-executive-metric-note` for stable executive signals.
- `mhos-executive-ai-panel` for the compact AI preparation area, if kept subordinate.
- `mhos-executive-action-row` for safe high-level actions such as refresh, focus approvals, or ask AI.

### Shared Context Primitive Candidates

Governance is ready for a cautious context/header adoption:

- `mhos-context-ribbon` for the page-level governance context.
- `mhos-context-main`, `mhos-context-kicker`, `mhos-context-title`, and `mhos-context-description` for project and page identity.
- `mhos-context-chip-row` and `mhos-context-chip` for project, active state, policy mode, and readiness state.

This should be class-additive only and should not change route metadata, disabled standard layout, lifecycle, or page shell behavior.

### Shared Workflow Primitive Candidates

Governance should use workflow primitives selectively:

- `mhos-escalation-lane` is a possible fit for active escalation state.
- `mhos-workflow-chain` can be considered only if the rendered sequence is a true governance path: intake -> evidence -> decision -> escalation/approval -> refresh.
- `mhos-workflow-step` should not be used for generic action buttons.

### Where Governance Should Remain Unique

Governance should intentionally preserve unique local patterns for:

- Decision queue table.
- Selected decision detail.
- Evidence summary and intake panel.
- Policy controls and owner inputs.
- Decision note textarea.
- Backend-authoritative action buttons.
- Confirmation copy.
- Review ownership model.
- Audit timeline and selected history.

These are authority-specific surfaces, not generic executive cards.

---

## 9. Safe Convergence Sequencing

### Safest Order Of Visual Refinement

1. **Documentation and contract checkpoint**
   - Confirm this plan against current Governance authority docs.
   - Reconfirm no behavior changes are allowed in the visual pass.

2. **First-screen hierarchy mapping**
   - Map existing rendered data into a target command band.
   - Do not change data sources or handlers.

3. **Additive context/header primitive adoption**
   - Add shared context classes to the existing command header only.
   - Preserve text, buttons, IDs, and data attributes.

4. **Promote readiness and next best action**
   - Move or visually elevate existing readiness data.
   - Keep `buildReadinessSnapshot()` behavior unchanged unless separately approved.

5. **Compress system signals**
   - Keep all six metrics.
   - Make them secondary to readiness, next action, risk, owner, and escalation.

6. **Clarify selected decision authority**
   - Elevate risk, owner, linked approval, and evidence state.
   - Keep decision controls in the detailed action panel.

7. **AI positioning pass**
   - Make AI a compact guidance/preparation panel.
   - Preserve `data-governance-open-ai` and prompt handoff behavior.

8. **Workflow/escalation visibility pass**
   - Only apply workflow primitives where real movement is represented.
   - Keep escalation chain data unchanged.

9. **Validation pass**
   - Run syntax checks if implementation occurs later.
   - Re-run Governance smoke behavior around load, refresh, focus, selection, approval request, approval decisions, policy save, settings sync, and AI prompt handoff.

### What Must Remain Untouched

No executive rhythm pass should change:

- `fetchProjectGovernance`
- `createProjectApproval`
- `decideProjectApproval`
- `updateProjectGovernancePolicy`
- `loadGovernance`
- `refreshGovernance`
- `ensureSession`
- Session keys: `loaded`, `loading`, `error`, `summary`, `focus`, `selectedKey`
- Any `data-governance-*` attributes
- Approval decision IDs
- Policy input IDs and `data-governance-policy`
- Owner input IDs and `data-governance-owner`
- Decision note textarea ID
- Confirmation dialogs
- Route ID, route metadata, or `disableStandardLayout`

### Rollback-Sensitive Areas

Rollback risk is highest around:

- First-render loading lifecycle.
- `root.innerHTML` rerender cycle.
- Event rebinding in `bindGovernance()`.
- Queue selection and focus state.
- Decision action button placement.
- Policy controls and settings sync controls.
- Confirmation messages.

Any later implementation should be class-additive or markup-reordering-only with a simple revert path.

### Runtime-Sensitive Areas

Runtime-sensitive areas:

- Initial load with selected project.
- Empty/no project state.
- Loading state.
- Error state.
- Refresh state.
- Mutations followed by `refreshGovernance()`.
- AI prompt transfer to AI Command.
- Shared handoff/intake panel behavior.

### Governance Authority-Sensitive Areas

Authority-sensitive areas:

- Approval decision buttons.
- Override decision button.
- Escalation decision button.
- Save Governance Policy.
- Review & Sync Settings Rules.
- Request Approval Review.
- Decision note.
- Policy owner inputs.
- Active rules toggles.
- Evidence and source-of-truth warnings.
- Authority boundary copy.

These areas may be visually clarified, but should not be simplified in a way that hides consequence, owner, risk, or confirmation requirements.

---

## 10. Final Target Identity

Governance should feel calm, serious, authoritative, and operationally precise. It should not feel like a punitive compliance dashboard, and it should not feel like an AI chat workspace. It should feel like the place where MH-OS keeps decisions safe, visible, and accountable.

Operationally, Governance should communicate:

- The current governance state is understood.
- The highest-risk decision is visible.
- The authority owner is clear.
- The required approval or escalation path is clear.
- Evidence and source gaps are visible before action.
- AI can help explain and prepare, but cannot decide.
- Every backend-changing action remains deliberate, confirmed, and auditable.
- After action, the system refreshes and validates impact.

Emotionally, Governance should feel:

- Calm under pressure.
- Trustworthy.
- Non-noisy.
- Executive, not bureaucratic.
- Safe, not slow.
- Operationally alive, not static.

The target identity is: **the MH-OS authority and decision control surface - a calm executive layer for risk, approval, escalation, and safe movement.**

---

## 11. Readiness Decision

Governance is ready for a controlled executive rhythm convergence pass if the next implementation is strictly limited to visual hierarchy, additive primitive classes, and copy compression.

Governance is not ready for behavior refactors, data contract changes, approval workflow changes, or source/handoff redesign as part of the same pass.

Recommended next implementation scope:

1. Promote readiness and next best governance action to the first screen.
2. Add shared context/executive primitives additively.
3. Make approval pressure, escalation state, risk severity, and authority owner fixed anchors.
4. Compress repeated helper copy without removing authority boundary meaning.
5. Keep decision, policy, confirmation, lifecycle, and API behavior untouched.

---

**Planning result:** Readiness plan complete. No JS, CSS, runtime, or data changes are included in this document.

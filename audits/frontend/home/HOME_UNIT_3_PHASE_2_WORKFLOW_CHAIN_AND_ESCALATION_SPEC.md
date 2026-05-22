# MH-OS Home — PHASE 2: Workflow Chain & Escalation Lane Specification

## 1. Workflow Chain Doctrine

**Purpose:**
- The workflow chain operationalizes the AI Workforce, transforming static roles into a living, executive-grade orchestration system.
- It enables seamless, contextual, and intelligent collaboration between AI specialists, ensuring operational continuity and clarity.

**Orchestration Philosophy:**
- The chain is not a BPM tool or flowchart; it is a calm, executive, AI-native sequence of operational responsibility.
- Each step is owned by a specialist, with clear handoff and continuity.
- The chain adapts to context, but always remains readable and deterministic.

**Operational Continuity Philosophy:**
- The chain never breaks; if a step is blocked, escalation overlays ensure continuity and visibility.
- Handoffs are explicit, never implicit; operational state is always clear.

**AI Collaboration Model:**
- Specialists collaborate through explicit, visible handoffs.
- No chatbot or conversational ambiguity; all transitions are operational and contextual.

**Handoff Philosophy:**
- Handoffs are rendered as calm, premium transitions, never as arrows or chaotic lines.
- Ownership of each step and transition is always visible.

## 2. Workflow Chain Structure

**Hierarchy Example:**
- Strategist
- Research
- Governance
- Publisher
- Distribution
- Analytics

**Ownership:**
- Chain: Owned by the orchestration layer.
- Step: Owned by the assigned specialist.
- Transition: Owned by both outgoing and incoming specialists.
- Handoff: Explicit, rendered, and owned by the chain.
- Execution: Owned by the active specialist.
- Continuity: Owned by the orchestration layer; escalations fill gaps.

## 3. Escalation Lane Doctrine

**Philosophy:**
- Escalation is a calm, persistent, executive-grade overlay—not a panic system.
- All operational risks, blockages, and confidence drops are surfaced in the escalation lane.
- Escalations are visible, persistent, and hierarchically organized by severity and type.

**Visibility:**
- Escalations are always visible but never overwhelming.
- The lane is designed for executive scanning, not alert fatigue.

## 4. Escalation Types

**Categories:**
- Governance
- Execution
- Readiness
- Approval
- Integration
- Intelligence
- Workflow Blockage
- Confidence Drop

**Rules:**
- **Rendering:** Escalations are rendered as overlays or lane items, never as popups or modals.
- **Severity:** Severity is visually encoded (e.g., color, icon), but always calm and non-alarming.
- **Persistence:** Escalations persist until resolved or dismissed by explicit action.
- **Dismissal:** Only allowed for resolved or acknowledged items; critical escalations require continuity.
- **Continuity:** Unresolved escalations remain visible and are inherited by subsequent workflow steps.

## 5. Workflow Visualization Rules

- **Sequencing:** Specialists are rendered in operational sequence, not as a graph or node map.
- **Active Handoff:** The current handoff is visually distinct, but not animated with arrows.
- **Waiting State:** Waiting steps are muted but visible.
- **Blocked State:** Blocked steps are overlaid with escalation markers.
- **Escalation Overlay:** Escalations appear as overlays, not as separate flows.
- **Dependency Visualization:** Dependencies are implied by sequence, not explicit lines.

## 6. Motion System Philosophy

- **Ownership:** All workflow and escalation motion is owned by the orchestration layer.
- **Behavior:** Motion is subtle, restrained, and deterministic—never chaotic or distracting.
- **Timing:** Transitions are fast but calm; no jitter or bounce.
- **Orchestration Movement:** Only one active transition at a time; no parallel motion.

## 7. Projection Model

**Fields:**
- `workflowChain`: Ordered array of workflow steps/specialists.
- `activeStep`: Index or ID of the current executing specialist.
- `workflowPressure`: Numeric or qualitative indicator of operational load.
- `escalationState`: Array of active escalations.
- `blockedStep`: Index or ID of blocked step, if any.
- `handoffState`: State of current handoff (pending, in-progress, complete).
- `chainContinuity`: Boolean or enum indicating continuity status.
- `orchestrationSummary`: Text summary of current orchestration state.

**Fallbacks & Safety:**
- If a field is undefined, the chain degrades gracefully (e.g., all steps muted, escalation lane visible).
- No runtime mutation or unsafe fallback logic.
- All projection is read-only and isolated.

## 8. Primitive Ownership

**Primitives:**
- `mhos-workflow-chain`
- `mhos-workflow-step`
- `mhos-workflow-active`
- `mhos-workflow-blocked`
- `mhos-workflow-handoff`
- `mhos-escalation-lane`
- `mhos-escalation-item`
- `mhos-escalation-severity`
- `mhos-orchestration-pressure`

**Nesting & Boundaries:**
- Only allowed nesting: steps inside chain, items inside escalation lane.
- Forbidden: escalation inside workflow step, workflow chain inside escalation lane.
- Ownership: Each primitive is owned by its parent container.
- Responsive: All primitives must collapse/stack gracefully on smaller screens.
- Isolation: No global selectors; all primitives are namespace-isolated.

## 9. Runtime Safety

- No orchestration or escalation mutation at runtime.
- No backend or API mutation.
- No runtime loops or polling.
- No selector collisions with legacy or global CSS.
- No unsafe or uncontrolled motion.
- No uncontrolled rerendering or state churn.

## 10. UX & Cognitive Load

- Information density is optimized for executive scanning.
- Escalation clarity is prioritized; critical items are always visible.
- Workflow is readable at a glance; no dense or ambiguous visuals.
- Prioritization is clear; operational focus is always visible.
- No cognitive overload; calm, premium, operational feel.

## 11. Responsive Strategy

- **Desktop:** Full chain and escalation lane visible side-by-side.
- **Tablet:** Chain and escalation lane stack vertically; collapse less critical steps.
- **Mobile:** Only active step and critical escalations visible; others collapsed into summaries.
- **Collapse Behavior:** Steps and escalations collapse into summaries on small screens.
- **Persistence:** Critical escalations always persist; workflow chain remains visible in summary form.
- **Visibility Rules:** No horizontal scrolling; always vertical stacking.

## 12. Rollout Strategy

- **Order:**
  1. Implement primitives and projection model.
  2. Integrate workflow chain rendering.
  3. Add escalation lane overlay.
  4. Add motion system.
  5. Validate responsive behavior.
  6. QA and validate continuity.
- **Checkpoints:**
  - After each phase, validate with static data and projection-only rendering.
- **Rollback:**
  - At any failure, revert to previous stable phase.
- **QA:**
  - Runtime QA for orchestration and escalation overlays.
  - Executive review for operational clarity.

## 13. Success Criteria

- Workflow chain feels alive, not static.
- Escalation lane is always operational, never alarming.
- AI collaboration is visible and understandable.
- UI avoids chaos, BPM, and flowchart visuals.
- Execution visibility is improved for all users.
- AI handoffs and escalation are clear, calm, and premium.

Workflow Pressure must:
- indicate orchestration tension
- remain calm
- avoid panic indicators
- help prioritize execution
- surface operational load without visual noise

AI continuity ensures:
- orchestration never appears broken
- workflows persist across delays
- escalations preserve operational context
- specialists inherit prior operational state
- users never lose execution awareness

Forbidden patterns:
- chatbot transcript UI
- BPM pipelines
- graph node systems
- infinite scrolling workflow feeds
- flashing escalation alerts
- avatar walls
- engineering dashboard overload
- disconnected AI cards
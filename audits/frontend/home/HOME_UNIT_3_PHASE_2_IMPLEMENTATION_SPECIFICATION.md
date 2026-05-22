# HOME UNIT 3 — PHASE 2 IMPLEMENTATION SPECIFICATION
## Workflow Chain + Escalation Lane

---

### 1. DOM Hierarchy

**Hierarchy:**
- `.mhos-workforce-room`
  - `.mhos-workforce-head`
  - `.mhos-workflow-chain`
    - `.mhos-workflow-step` (multiple)
      - `.mhos-workflow-active` (if active)
      - `.mhos-workflow-blocked` (if blocked)
      - `.mhos-workflow-handoff` (if handoff in progress)
  - `.mhos-escalation-lane`
    - `.mhos-escalation-item` (multiple)
      - `.mhos-escalation-severity`
  - `.mhos-specialist-context-layer`
  - `.mhos-workflow-continuity-layer`

**Ownership & Nesting:**
- `.mhos-workforce-room` owns all direct children.
- `.mhos-workflow-chain` owns all steps and handoff overlays.
- `.mhos-escalation-lane` owns all escalation items.
- Only allowed nesting: steps inside chain, items inside escalation lane.
- Rendering authority: Orchestration layer controls all rendering and collapse.
- Collapse authority: Responsive layer may collapse steps/items for mobile/tablet.

---

### 2. Workflow Rendering Lifecycle

- **Initial Render:**
  - Render full chain, escalation lane, and context/continuity layers from projection data.
- **Active Step Render:**
  - Highlight `.mhos-workflow-active` step; all others are pending or muted.
- **Blocked State Render:**
  - Overlay `.mhos-workflow-blocked` on blocked step; inject escalation marker.
- **Escalation Injection:**
  - Escalation lane overlays are injected as soon as escalation is projected.
- **Handoff Transitions:**
  - `.mhos-workflow-handoff` overlays appear only during explicit handoff state.
- **Continuity Preservation:**
  - If chain continuity is lost, `.mhos-workflow-continuity-layer` overlays the chain.
- **Avoid:**
  - No rerender storms, no uncontrolled chain rebuilds, no motion jitter, no state duplication.

---

### 3. Projection Data Model

**Fields:**
- `workflowChain`: Array of step objects (id, label, specialist, state).
- `activeStep`: Index or id of current active step.
- `blockedStep`: Index or id of blocked step (if any).
- `escalationItems`: Array of escalation objects (id, type, severity, message, persistent).
- `workflowPressure`: Numeric/qualitative indicator of operational load.
- `continuityState`: Enum (ok, degraded, lost).
- `orchestrationSummary`: Text summary of orchestration state.
- `handoffState`: Enum (none, pending, in-progress, complete).

**Fallbacks & Degradation:**
- If any field is undefined, render muted/empty state with escalation lane visible.
- No runtime mutation; all data is projection-only and read-only.
- Graceful degradation: chain and escalation always render, even if empty.
- Runtime isolation: No cross-component state mutation.

---

### 4. Escalation Lane Rendering

- **Hierarchy:**
  - `.mhos-escalation-lane` contains `.mhos-escalation-item` elements, grouped by severity and type.
- **Grouping:**
  - Items grouped by category (governance, execution, etc.) and sorted by severity.
- **Persistence:**
  - Persistent escalations remain until resolved or dismissed.
- **Ordering:**
  - Critical (highest severity) items always appear first.
- **Visibility:**
  - Lane is always visible; critical items are visually distinct but calm.
- **Severity Ownership:**
  - `.mhos-escalation-severity` encodes severity; rendering authority is escalation lane.
- **Dismissal:**
  - Only allowed for resolved/acknowledged items; critical items require continuity.
- **Continuity:**
  - Unresolved escalations persist across workflow transitions.

---

### 5. Primitive Ownership

- `.mhos-workflow-chain`: Orchestration layer owns rendering and state.
- `.mhos-workflow-step`: Owned by workflow chain; no direct escalation or lane logic.
- `.mhos-workflow-active`: Owned by workflow chain; only one active at a time.
- `.mhos-workflow-blocked`: Owned by workflow chain; overlays step if blocked.
- `.mhos-workflow-handoff`: Owned by workflow chain; overlays step during handoff.
- `.mhos-escalation-lane`: Orchestration layer owns rendering and escalation grouping.
- `.mhos-escalation-item`: Owned by escalation lane; no direct workflow logic.
- `.mhos-escalation-severity`: Owned by escalation item; no escalation lane logic.
- `.mhos-orchestration-pressure`: Owned by orchestration layer; read-only indicator.

**Nesting & Isolation:**
- Only allowed nesting: steps in chain, items in lane.
- Forbidden: escalation inside workflow step, chain inside escalation lane.
- Responsive: All primitives must collapse/stack on small screens.
- Selector isolation: All selectors are `.mhos-*` only; no global selectors.
- Duplication prevention: Only one instance of each primitive per context.

---

### 6. Motion Ownership

- All workflow and escalation motion is owned by orchestration layer.
- Activation transitions: Only `.mhos-workflow-active` animates in/out.
- Handoff transitions: Only `.mhos-workflow-handoff` overlays animate.
- Blocked-state transitions: Only `.mhos-workflow-blocked` overlays animate.
- Motion is subtle, deterministic, and performance-safe; no parallel or uncontrolled motion.

---

### 7. Responsive Rendering Rules

- **Desktop:**
  - Full chain and escalation lane visible side-by-side.
- **Tablet:**
  - Chain and escalation lane stack vertically; collapse less critical steps/items.
- **Mobile:**
  - Only active step and critical escalations visible; others collapsed into summaries.
- **Collapse Rules:**
  - Steps/items collapse into summaries on small screens.
- **Escalation Persistence:**
  - Critical escalations always persist; workflow chain remains visible in summary form.
- **Workflow Visibility:**
  - No horizontal scrolling; always vertical stacking.
- **Specialist Continuity:**
  - Active specialist context always visible.

---

### 8. Runtime Safety

- No orchestration or escalation mutation at runtime.
- No backend or API mutation.
- No unsafe rerenders or state churn.
- No selector collisions with legacy/global CSS.
- No runtime ownership overlap (each primitive owned by one layer only).
- No motion flooding or uncontrolled animation.

---

### 9. Accessibility & Cognitive Load

- Executive scanning: All critical workflow/escalation states visible at a glance.
- Workflow readability: Clear sequencing, muted pending, distinct active/blocked.
- Escalation clarity: Severity and type always visible, never alarming.
- Focus hierarchy: Tab order follows workflow chain, then escalation lane.
- Keyboard: All actionable items focusable; handoff/blocked states accessible.
- Screen reader: All primitives have ARIA roles/labels; escalation and workflow states announced.

---

### 10. Rollout Strategy

- **Order:**
  1. Implement primitives and projection model.
  2. Integrate workflow chain rendering.
  3. Add escalation lane overlay.
  4. Add motion system.
  5. Validate responsive behavior.
  6. QA and validate continuity.
- **QA Checkpoints:**
  - After each phase, validate with static data and projection-only rendering.
- **Rollback:**
  - At any failure, revert to previous stable phase.
- **Validation:**
  - Runtime validation for orchestration and escalation overlays.
  - Selector validation for `.mhos-*` isolation.

---

### 11. Success Criteria

- Workflow feels operational and alive, not static.
- Escalation lane is calm, persistent, and always visible.
- Orchestration is readable and understandable at a glance.
- Runtime remains stable; no rerender storms or motion jitter.
- Cognitive load is reduced; executive scanning is easy.
- AI continuity and handoff are always preserved.


Workflow pressure must:
- communicate orchestration load
- preserve executive calm
- avoid panic indicators
- help prioritize execution
- remain visually restrained

AI continuity ensures:
- workflows never feel abandoned
- escalations preserve operational context
- specialists inherit workflow awareness
- orchestration survives delays and interruptions
- execution visibility remains stable

Forbidden patterns:
- BPM diagrams
- chatbot transcript feeds
- infinite workflow scrolling
- flashing escalation alerts
- node graph systems
- avatar walls
- disconnected AI cards
- engineering orchestration visuals
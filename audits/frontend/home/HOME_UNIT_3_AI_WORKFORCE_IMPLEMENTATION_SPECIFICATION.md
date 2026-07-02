# HOME UNIT 3 — AI WORKFORCE IMPLEMENTATION SPECIFICATION

## 1. Surface Ownership Model
- The AI Workforce Surface is rendered by Home, styled by the clean operating layer, and powered by projection-only data.
- Render ownership: Only the workforce surface and its primitives may render workforce content.
- Runtime ownership: No runtime or backend system may mutate the workforce surface; projection-only.
- Orchestration ownership: Only the orchestration layer may provide data; no orchestration logic in the surface.
- Specialist rendering: Only the workforce surface may render specialists; no external injection.
- Escalation rendering: Only the workforce surface may render escalations; no external escalation overlays.
- The surface is always projection-only, orchestration-safe, authority-safe, and workflow-safe.

## 2. DOM Hierarchy Specification
- Hierarchy:
  - Smart Header
  - Executive Health Strip
  - Next Best Action
  - mhos-workforce-room
    - mhos-workforce-flow (active workflow chain)
      - mhos-workforce-chain (step sequence)
        - mhos-specialist (active specialist)
          - mhos-specialist-state
          - mhos-specialist-reasoning
          - mhos-specialist-handoff
          - mhos-specialist-escalation
        - mhos-specialist (secondary/passive)
      - mhos-specialist-thread (collaboration chain)
    - mhos-workforce-focus (focus cues)
    - Escalation Lane (mhos-specialist-escalation)
    - Reasoning Layer (mhos-specialist-reasoning)
    - Workflow Continuity Layer
  - Executive Snapshot
  - Workspace Grid
- Parent/child/expansion/collapse ownership: Only the workforce surface may expand/collapse specialists, chains, or reasoning. No external DOM mutation.

## 3. Workforce Room Rendering Model
- Room render lifecycle: Renders on projection data change only; no uncontrolled rerenders.
- Specialist render lifecycle: Renders on specialist state change; no duplication.
- Escalation render lifecycle: Renders on escalation state change; persists until resolved.
- Reasoning render lifecycle: Renders on demand or when escalation/approval occurs.
- Workflow chain render lifecycle: Renders on workflow state change; no selector collisions or runtime mutation.

## 4. Projection Data Model
- Projection-only data:
  - activeWorkflow
  - activeSpecialist
  - escalationState
  - workflowChain
  - workflowContinuity
  - specialistStates
  - specialistReasoning
  - specialistConfidence
  - specialistAuthority
- Projection boundaries: No direct mutation; fallback to safe defaults if undefined.
- Undefined behavior: Renders as inactive/hidden.
- Safe degradation: If data is missing, surface degrades gracefully (e.g., shows loading or fallback state).

## 5. Specialist Rendering Rules
- Active specialist: Expanded, operational context visible, reasoning available.
- Passive specialist: Condensed, minimal, visible for context.
- Escalation: Visually prioritized, persists until resolved.
- Authority: Subtle, always visible for active/escalated specialists.
- Reasoning: Contextual, expandable, concise.
- Collaboration: Visible through workflow chain, not as chat.
- Visibility: Only relevant specialists visible; no duplication.
- Expansion: Only one active specialist expanded at a time.
- Focus: Visual cues highlight active/escalated specialist.
- Collapse: Inactive specialists collapse into minimal form.

## 6. Workflow Chain Rendering Rules
- Chain hierarchy: mhos-workforce-flow > mhos-workforce-chain > mhos-specialist.
- Chain transitions: Smooth, deterministic, no animation overload.
- Handoff: Rendered as subtle transition, not arrows.
- Dependency: Inline, contextual, not as separate lists.
- Escalation transitions: Highlighted, visually distinct.
- Continuation: Next steps always visible, never hidden.
- Avoids BPM diagrams, arrow overload, flowchart behavior.

## 7. Reasoning Rendering Rules
- Placement: Near relevant specialist or workflow step.
- Expansion: Collapsed by default, expands on demand.
- Collapse: Only one reasoning block expanded at a time.
- Confidence: Subtle, contextual, not dominant.
- Escalation reasoning: Always visible when escalation is present.
- Workflow explanation: Concise, operational, executive-grade.

## 8. Escalation Lane Rules
- Hierarchy: Escalations are visually prioritized above normal workflow.
- Rendering priority: Escalations override normal focus.
- Persistence: Escalations persist until resolved or acknowledged.
- Motion: Subtle, restrained, deterministic.
- Authority: Always visible for escalated items.
- Escalations are visible, controlled, operational, and non-chaotic.

## 9. Motion Ownership Rules
- Motion is owned by the workforce surface only.
- Transition ownership: Only the surface may trigger transitions.
- Activation motion: Smooth expansion for active specialist.
- Workflow motion: Subtle cues for chain progression.
- Escalation motion: Subtle pulse/highlight, no blinking.
- Motion is restrained, deterministic, low-noise, and performance-safe.

## 10. Primitive Ownership Rules
- mhos-workforce-room: Owns the operational room; top-level container.
- mhos-specialist: Renders a specialist; expanded for active, condensed for inactive.
- mhos-specialist-state: Renders state; visually distinct.
- mhos-specialist-reasoning: Renders reasoning; contextual, expandable.
- mhos-specialist-handoff: Renders workflow handoff; subtle transition.
- mhos-specialist-escalation: Renders escalation; visually prioritized.
- mhos-specialist-thread: Renders collaboration chain; not chat.
- mhos-workforce-flow: Renders workflow chain; fluid, connected.
- mhos-workforce-chain: Renders operational sequence; step-based.
- mhos-workforce-focus: Renders focus cues; highlights, expansions.
- Rendering authority: Only the workforce surface may render these primitives.
- Allowed nesting: As per DOM hierarchy; no forbidden nesting.
- Forbidden nesting: No duplicate or recursive primitives.
- Duplication prevention: Only one instance per context.
- Responsive: All primitives adapt to device and context.

## 11. CSS Ownership Rules
- All selectors for workforce surface must live in the clean operating layer CSS file.
- Page scope selectors are forbidden for workforce primitives.
- Global selectors are forbidden.
- Namespace: All selectors must use the mhos-* namespace.
- Duplication prevention: No duplicate selectors or legacy selector reuse.
- Isolation: All selectors are isolated from legacy and other surfaces.

## 12. Responsive Rendering Specification
- Desktop: Full orchestration, all active/secondary specialists visible, workflow chain expanded.
- Tablet: Condensed, active specialists and workflow chain prioritized, secondary specialists collapsible.
- Mobile: Highly condensed, only active/escalated specialists and workflow chain visible, others accessible via expansion.
- Collapse: Inactive/secondary specialists collapse into icons/minimal rows.
- Expansion: Only one active specialist expanded at a time.
- Escalation persistence: Escalations always visible.
- Active specialist persistence: Active specialist always visible.
- Workflow preservation: Chain always visible, even if condensed.

## 13. Runtime Safety Rules
- No orchestration mutation from the surface.
- No backend mutation from the surface.
- No authority mutation from the surface.
- No workflow execution mutation from the surface.
- No unsafe rerender loops.
- No selector collisions.
- No runtime ownership overlap.

## 14. Accessibility & Cognitive Load Rules
- Cognitive load reduction: Only relevant information visible; no overload.
- Information hierarchy: Clear, executive, operational.
- Focus clarity: Visual cues for active/escalated specialists.
- Escalation clarity: Escalations always visible and distinct.
- Reasoning clarity: Concise, contextual, expandable.
- Motion restraint: No distracting or excessive motion.
- Screen reader: All primitives must be accessible and labeled.
- Keyboard: All controls must be keyboard-navigable.

## 15. Migration & Rollout Strategy
- Implementation order: Core primitives (room, flow, chain, specialist, escalation, reasoning) first.
- Rollout checkpoints: After each primitive and major feature.
- Rollback: All changes must be reversible; no destructive migrations.
- QA: Visual, runtime, and selector validation at each checkpoint.
- Runtime validation: Validate projection and orchestration boundaries.
- Selector validation: Validate namespace and isolation.
- Projection validation: Validate data boundaries and fallback.
- Orchestration validation: Validate no mutation from surface.

## 16. Final Success Definition
- Implementation is safe, runtime is stable.
- Workforce feels alive, operational, and AI-native.
- No chatbot or dashboard behavior remains.
- Execution clarity is improved, cognitive overload is reduced.
- All rules above are strictly enforced.

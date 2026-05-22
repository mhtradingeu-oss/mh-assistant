# HOME UNIT 2 IMPLEMENTATION SPEC
## Next Best Action Surface — Decision-Driving Operating Layer

---

### 1. Core Purpose
- **Why it exists:** The Next Best Action surface is the operational guidance center for Home, designed to drive decisive, high-impact action for executive users.
- **Operational problem solved:** Reduces decision fatigue by surfacing the single most important action, contextualized by system state, readiness, and workflow needs.
- **Guidance:** Guides execution by clarifying what matters most, why it matters, and what the downstream impact will be.
- **Difference from dashboards/notifications:** Not a passive summary or alert feed; it is an active, workflow-driving, context-aware operational system.

### 2. Operational Philosophy
- **Workflow-centric:** Focused on what must happen next, not on reporting or listing.
- **Action-oriented:** Surfaces a single, high-priority action, not a list or backlog.
- **Decision-driving:** Designed to move the user forward, not just inform.
- **Operationally intelligent:** Contextualizes action with readiness, blockers, and workflow impact.
- **AI-guided, not AI-spammy:** AI recommendations are precise, relevant, and non-intrusive.
- **User instantly understands:**
  - What matters most
  - Why it matters
  - What is blocked
  - What should happen now
  - What happens after execution

### 3. Exact Visual Hierarchy
- **Visual priority:** Next Best Action is visually dominant after the Executive Health Strip, with clear separation and calm focus.
- **Placement:** Directly below the Executive Health Strip, before any snapshot or dashboard elements.
- **Spacing rhythm:** Tight, executive spacing; no card/block heaviness.
- **Dominant content:** Action title, operational reason, workflow impact.
- **Secondary content:** Readiness, AI context, escalation/approval state, destination, confidence.
- **Escalation visibility:** Clearly visible if present, but not visually overwhelming.
- **Workflow continuity:** Downstream workflow and continuation paths are visible but secondary.
- **Feel:** Important, calm, focused, operational, trustworthy.

### 4. Surface Structure
- **Sections:**
  - Action Title
  - Operational Reason
  - Workflow Impact
  - Readiness Context
  - AI Recommendation Context
  - Execution Continuation
  - Escalation / Approval State
  - Suggested Destination
  - Action Confidence
- **Optional:**
  - Time sensitivity
  - Dependency chain
  - Risk summary

### 5. Information Orchestration Rules
- **Primary:** Action title, reason, impact, readiness, destination.
- **Secondary:** AI context, escalation, workflow continuation, confidence.
- **Immediate:** Only the most important information is always visible.
- **Expandable:** Secondary/contextual info can be expanded on demand.
- **Contextual:** All info is contextual to the current system state.
- **Metric reduction:** Only show metrics that drive action; no overload.
- **Anti-card-wall:** Forbid card stacking, repeated summaries, noisy badges, equal-weight info.

### 6. Typography & Density Rules
- **Hierarchy:**
  - Title: executive, strong, but not oversized.
  - Reason/impact: medium, readable, calm.
  - Meta/context: small, muted, non-distracting.
- **Spacing:** Tight, executive rhythm; no dashboard blockiness.
- **Scan flow:** Guides the eye from action to reason to impact to next step.
- **Goal:** Reduce scanning fatigue, prioritize meaning over metrics.

### 7. AI Guidance Model
- **AI recommendations:** Appear as operational context, not as chat or conversation.
- **AI reasoning:** Shown as a brief, focused explanation of why this action is recommended.
- **Confidence:** Displayed as a subtle indicator, not a badge or score.
- **Escalation:** Clearly shown if present, but not dominant.
- **Workflow reasoning:** AI explains downstream impact, not just the next step.
- **Feel:** Operational, contextual, intelligent, non-intrusive.
- **Avoid:** Chatbot feeling, conversational spam, excessive AI explanations.

### 8. Workflow Continuity Model
- **After execution:** Surface shows what happens next, what dependencies are triggered, and what blockers/approvals remain.
- **Downstream workflow:** Clearly visible but not overwhelming.
- **Dependencies/blockers/approvals:** Shown as part of the action context, not as a separate list.
- **Continuation paths:** Always visible for the next step.

### 9. Interaction Rules
- **Clickable regions:** Only actionable elements (e.g., main action, destination link).
- **Drill-down:** Safe, contextual navigation only; no modal or overlay spam.
- **Navigation:** Always safe; never interrupts workflow.
- **Hover/expansion:** Contextual info expands on hover or click, never by default.
- **Forbidden:** Modal spam, overlay spam, unsafe runtime injection, execution mutation.

### 10. Primitive Requirements
- **Required primitives:**
  - `.mhos-next-action`
  - `.mhos-next-action-title`
  - `.mhos-next-action-reason`
  - `.mhos-next-action-impact`
  - `.mhos-next-action-destination`
  - `.mhos-next-action-confidence`
  - `.mhos-next-action-flow`
  - `.mhos-next-action-escalation`
- **Ownership:** All primitives are owned by the clean operating layer; no legacy selector reuse.
- **Variants:** Only as needed for escalation, confidence, or destination.
- **Responsive:** All primitives must be responsive and compress gracefully.
- **Duplication:** No duplicate primitives on the same page.
- **Isolation:** All selectors are `.mhos-*` only, defined in the clean layer CSS.

### 11. Responsive Operating Logic
- **Desktop/laptop:** Full info visible, tight spacing, no overflow.
- **Tablet:** Info compresses, secondary info collapses, action remains primary.
- **Mobile:** Only primary info visible; expand for context; action always persistent.
- **Overflow prevention:** No horizontal scroll; info compresses or collapses.
- **Action persistence:** Main action always visible.
- **Workflow readability:** Continuity and next steps always clear.

### 12. Runtime & Backend Boundaries
- **Projection-only:** All data is projected from the Home context; no backend mutation.
- **No execution authority:** Surface does not execute actions, only guides.
- **No routing rewrite:** Navigation is contextual and safe.
- **No workflow ownership changes:** Surface does not mutate workflow state.
- **No AI orchestration mutation:** AI is read-only, never triggers backend changes.

### 13. CSS Ownership & Isolation
- **Layer:** All styles live in the clean operating layer CSS file.
- **Namespace:** All selectors are `.mhos-*` only.
- **Anti-duplication:** No legacy selector reuse; no duplicate selectors.
- **Isolation:** Primitives are isolated from legacy and other surfaces.

### 14. Migration Safety Rules
- **Rollback checkpoints:** All changes are isolated and reversible.
- **Responsive QA:** All breakpoints and compressions are tested.
- **Visual regression:** Visual checks ensure no legacy UI is affected.
- **Runtime validation:** All projection logic is validated.
- **Workflow validation:** Action flow and continuity are tested.
- **Hierarchy validation:** Visual and DOM hierarchy matches spec.

### 15. Final Success Definition
- **Proves success if:**
  - Surface drives decisions, not just displays info.
  - Cognitive load is reduced; user knows what to do next.
  - Feels operationally intelligent and AI-native.
  - Workflow continuity is clear and actionable.
  - Surface feels executive-grade, not like a dashboard card.
  - No card/block feeling remains; the surface is the operational center of gravity for Home.

  ## 16. Action Urgency Hierarchy

Next Best Action must support operational urgency levels.

Urgency levels:

### Critical
- execution is blocked
- approvals missing
- operational risk exists

### Immediate
- should happen now
- unlocks workflow continuity
- improves launch readiness

### Recommended
- optimization opportunity
- improves system quality
- improves confidence/readiness

### Informational
- awareness only
- no execution blocking

Urgency must influence:
- visual emphasis
- spacing
- escalation visibility
- workflow prominence

Urgency must NOT create:
- alert fatigue
- notification spam
- visual panic

## 17. Narrative Decision Flow

The surface must guide the user through a decision narrative:

1. What is happening?
2. Why does it matter?
3. What is blocked or at risk?
4. What should happen now?
5. What changes after execution?
6. What becomes available next?

The experience must feel:
- guided
- operational
- executive-grade
- workflow-aware

The user should never feel:
- lost
- overloaded
- forced to interpret metrics manually

## 18. Action Confidence UX Rules

Confidence indicators must remain subtle and contextual.

Confidence should:
- support trust
- support decision-making
- support operational awareness

Confidence must NOT:
- dominate the surface
- behave like a KPI score
- use aggressive visual treatment
- create visual noise

Confidence should feel:
- calm
- advisory
- operationally intelligent

## 19. Execution Continuity Visibility

The surface must clearly communicate:

- what becomes unblocked after execution
- which workflows continue next
- which specialists become active next
- which approvals remain
- which risks are reduced

The goal is to make the system feel:
- operationally connected
- workflow-aware
- execution-driven

The user should understand:
"This action changes the operational state."

---

**End of Implementation Specification.**

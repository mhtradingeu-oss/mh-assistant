# HOME UNIT 1 — EXECUTIVE HEALTH STRIP IMPLEMENTATION SPEC

**Purpose:**
Define the exact implementation specification for the Executive Health Strip, the first visible Executive Operating Surface of MH-OS Home. Documentation only. No code, CSS, or backend changes.

---

## 1. Purpose of Executive Health Strip
- Provides a persistent, high-clarity operational overview for executives
- Surfaces readiness, risk, approvals, AI confidence, and escalation at a glance
- NOT a KPI dashboard: avoids metric overload, focuses on operational clarity
- Reduces decision fatigue by surfacing only what matters now
- Supports executive operations by highlighting readiness, blockers, and urgent needs

## 2. Exact Visual Hierarchy
- Appears immediately below the header, always visible (desktop/laptop)
- Persistent: Health, readiness, risk, approvals, AI confidence, escalation
- Collapses: On mobile/tablet, compresses to summary chips/row
- Visually dominant: Health, readiness, risk
- Secondary: Approvals, AI confidence, escalation
- NEVER appears: KPI walls, low-value metrics, duplicated summaries, noisy badges

## 3. Exact Surface Structure
- **Operational Health:**
  - Purpose: Show overall system health (green/yellow/red)
  - Visual: Leftmost, large indicator
  - Interaction: Hover for detail, no click
  - Priority: Highest
- **Launch Readiness:**
  - Purpose: Show if system is ready for launch/major ops
  - Visual: Prominent chip
  - Interaction: Hover for detail
  - Priority: High
- **Workflow Risk:**
  - Purpose: Show active risks/blockers
  - Visual: Risk chip, color-coded
  - Interaction: Hover for detail
  - Priority: High
- **Pending Approvals:**
  - Purpose: Show count/status of pending approvals
  - Visual: Approval chip
  - Interaction: Click for drill-down
  - Priority: Medium
- **AI Confidence:**
  - Purpose: Show AI certainty/confidence in current state
  - Visual: Confidence chip, subtle
  - Interaction: Hover for detail
  - Priority: Medium
- **Escalation Status:**
  - Purpose: Show if any escalations are active
  - Visual: Escalation chip, alert color if active
  - Interaction: Click for detail
  - Priority: Medium
- **Execution Readiness:**
  - Purpose: Show if system is ready for next execution
  - Visual: Readiness chip
  - Interaction: Hover for detail
  - Priority: Medium

## 4. Primitive Definitions
- **mhos-executive-strip:**
  - Ownership: Global CSS layer
  - Responsive: Collapses to row/chips on mobile
  - Variants: None
  - Forbidden: Page-local overrides
  - Interaction: Contains only defined primitives
  - Duplication: Only one per page
- **mhos-health-indicator:**
  - Ownership: Global CSS layer
  - Responsive: Shrinks on mobile
  - Variants: Green/yellow/red
  - Forbidden: Animation, flashing
  - Interaction: Hover for detail
  - Duplication: None
- **mhos-readiness-chip:**
  - Ownership: Global CSS layer
  - Responsive: Compresses to icon on mobile
  - Variants: Ready/not ready
  - Forbidden: Noisy color
  - Interaction: Hover for detail
  - Duplication: None
- **mhos-risk-indicator:**
  - Ownership: Global CSS layer
  - Responsive: Compresses to icon on mobile
  - Variants: Risk/none
  - Forbidden: Animation
  - Interaction: Hover for detail
  - Duplication: None
- **mhos-approval-state:**
  - Ownership: Global CSS layer
  - Responsive: Compresses to icon on mobile
  - Variants: Pending/approved/rejected
  - Forbidden: Animation
  - Interaction: Click for drill-down
  - Duplication: None
- **mhos-ai-confidence:**
  - Ownership: Global CSS layer
  - Responsive: Compresses to icon on mobile
  - Variants: High/medium/low
  - Forbidden: Animation
  - Interaction: Hover for detail
  - Duplication: None
- **mhos-escalation-indicator:**
  - Ownership: Global CSS layer
  - Responsive: Compresses to icon on mobile
  - Variants: Escalated/none
  - Forbidden: Animation
  - Interaction: Click for detail
  - Duplication: None

## 5. Responsive Operating Logic
- **Desktop/Laptop:** Full strip, all indicators visible, spaced
- **Tablet:** Strip compresses, chips stack or row, summary mode
- **Mobile:** Strip collapses to single row, icons only, summary mode
- **Collapse rules:** Only secondary indicators collapse first
- **Stacking rules:** Chips stack vertically if space constrained
- **Persistence:** Health, readiness, risk always visible
- **Summary compression:** On mobile, show only icons, expand on tap
- **Overflow prevention:** Lower-priority chips collapse into a “More status” disclosure; they must not disappear completely.

## 6. Visual Tone & UX Rules
- Calm, executive-grade color palette
- Modular spacing, clear separation
- Large, readable typography
- Density limits: Never crowded
- No KPI wall, no metric overload
- No flashing, pulsing, or noisy color
- No crowded chips or badges

**Explicitly forbidden:**
- KPI walls
- Equal-weight metrics
- Flashing alerts
- Oversized numbers
- Noisy color usage
- Crowded chips/badges

## 7. Interaction Rules
- **Clickable:** Approval chip, escalation chip
- **Informational only:** Health, readiness, risk, AI confidence
- **Drill-down:** Approval/escalation chips open an existing safe detail panel or navigate/filter to the relevant page. No new modal in Unit 1.
- **Hover:** All chips show detail tooltip
- **Expansion:** Only on click for drill-down
- **Escalation visibility:** Alert color, click for detail
- **Approval visibility:** Count, click for detail

## 8. Runtime & Backend Boundaries
- Projection-only: No authority logic, no execution logic
- No backend mutation
- No routing changes
- No workflow ownership changes
- Only displays current state, never triggers state changes

## 9. CSS Ownership & Isolation
- Owned by global CSS layer (e.g., 15-clean-operating-layer.css)
- Only .mhos-* selectors allowed
- Forbidden: .dashboard, .card, .summary, legacy selectors
- Must be isolated from legacy CSS
- No duplication of strip or primitives
- No legacy inheritance

## 10. Migration Safety Rules
- Rollback checkpoint after strip implementation
- Visual QA at all breakpoints
- Selector duplication checks before/after
- Responsive QA for all devices
- Runtime validation: No event leaks, overlays
- Overlay safety: No overlays triggered by strip

## 11. Implementation Sequence
1. Primitive isolation
2. Strip container (mhos-executive-strip)
3. Health indicator (mhos-health-indicator)
4. Readiness indicator (mhos-readiness-chip)
5. Risk indicator (mhos-risk-indicator)
6. Approval indicator (mhos-approval-state)
7. AI confidence (mhos-ai-confidence)
8. Escalation indicator (mhos-escalation-indicator)
9. Responsive adaptation
10. Final QA

## 12. Final Success Definition
- Strip feels executive-grade, calm, and intelligent
- Does NOT feel like a KPI dashboard
- Improves operational clarity and workflow awareness
- Aligns with MH-OS operating philosophy
- Surfaces only what matters, reduces decision fatigue

---

**This implementation spec must be reviewed and signed by all contributors before migration begins.**

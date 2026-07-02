# HOME FINALIZATION AUDIT & OPERATING SURFACE PLAN

**Purpose:**
Audit the current Home implementation and define the final Executive AI Operating Surface plan for MH-OS. This is a documentation-only audit and planning step. No code, CSS, or backend changes.

---

## 1. Current Home Reality Audit
- **Structure:**
  - Top header
  - Card wall of metrics/summaries
  - Action buttons
  - Recent activity/task list
  - Occasional AI summary panel
- **Layout:**
  - Grid/card wall, equal-weight blocks
  - Large topbar, summary cards, action panel
- **Strengths:**
  - High-level overview
  - Quick access to actions
  - Some workflow/task visibility
- **Weaknesses:**
  - Feels like a dashboard, not an operating surface
  - Card wall anti-pattern, equal-weight blocks
  - Fragmented status, duplicated summaries
  - No clear executive/AI hierarchy
  - No persistent workflow continuity
  - AI presence is minimal or noisy
  - Lacks operational guidance
- **Authority Boundaries:**
  - No clear separation of executive vs. operational info
  - No clear AI vs. human action boundaries
- **AI Usage:**
  - Occasional suggestions, not integrated
  - No visible AI workforce status
- **Workflow Visibility:**
  - Recent tasks, but no workflow continuity or handoff
- **Executive Usefulness:**
  - Lacks guidance, next best action, or operational health

## 2. Final Home Vision — Executive AI Operating Brain
- Guides the user with operational intelligence
- Surfaces next best actions and priorities
- Exposes AI workforce status and recommendations
- Shows workflow continuity and handoffs
- Surfaces operational health and readiness
- Reduces decision fatigue with clarity and calm

## 3. Final Home Surface Structure

**Hierarchy:**
1. Smart Header
   - Purpose: Navigation, context, brand
   - Visual Weight: High, sticky
   - Interaction: Context switch, notifications
   - Responsive: Collapses on mobile
2. Executive Health Strip
   - Purpose: High-level KPIs, operational health
   - Visual Weight: Prominent, always visible
   - Interaction: Drill-down, alerts
   - Responsive: Collapsible, summary on mobile
3. Next Best Action
   - Purpose: Prioritized actions, critical tasks
   - Visual Weight: High, above the fold
   - Interaction: Click to execute, confirm
   - Responsive: Stacks on mobile
4. AI Workforce Surface
   - Purpose: Show AI specialist status, recommendations
   - Visual Weight: Prominent, below actions
   - Interaction: Assign, escalate, collaborate
   - Responsive: Grid/stack adapts
5. Workflow / Task Stream
   - Purpose: Show active workflows, handoffs, approvals
   - Visual Weight: Medium, continuous
   - Interaction: Expand, approve, handoff
   - Responsive: Scrollable, collapses
6. Operational Panels
   - Purpose: Evidence, approvals, summaries
   - Visual Weight: Contextual, secondary
   - Interaction: Expand/collapse, review
   - Responsive: Collapsible
7. AI Guidance Layer
   - Purpose: Contextual AI suggestions, guidance
   - Visual Weight: Subtle, always accessible
   - Interaction: Accept, dismiss, escalate
   - Responsive: Overlay, modal on mobile

## 4. AI Workforce Home Presence
- Visible AI specialists: Executive, Ops, Approval, Escalation
- Status: Online, busy, blocked, idle
- Recommendations: Highlighted, separated from execution
- Blockers: Clearly flagged, escalation visible
- Collaboration: Threaded, handoff indicators
- Escalation: Visual, actionable

## 5. Next Best Action System
- Prioritization: Critical > Recommended > Informational
- Critical: Approvals, escalations, urgent tasks
- Recommended: AI suggestions, workflow steps
- Informational: Status updates, non-blocking
- AI Recommendations: Visually distinct, require confirmation
- Execution Actions: Primary, always accessible

## 6. Workflow Visibility System
- Active workflows: Prominent, always visible
- Blocked workflows: Highlighted, escalation path
- Approvals: Pending, ready, rejected
- Pending handoffs: Owner, next step
- Execution readiness: Status, blockers
- Operational continuity: Timeline, breadcrumbs

## 7. Executive Readability Rules
- Density: Moderate, never crowded
- Spacing: Modular, calm
- Card hierarchy: Executive > Actions > AI > Workflow > Panels
- Typography: Large for executive, readable for all
- Calm interaction: No surprise, no noise
- Anti-dashboard: No card wall, no equal-weight blocks

## 8. What Must Be Removed
- Dashboard card walls
- Duplicated summaries
- Equal-weight blocks
- Low-value metrics
- Noisy AI surfaces
- Oversized panels
- Unclear actions
- Fragmented status indicators

## 9. Reusable Global Primitives Needed
- mhos-header
- mhos-executive-strip
- mhos-workflow-ribbon
- mhos-ai-room
- mhos-action-panel
- mhos-operational-card
- mhos-preview-surface

## 10. Migration Readiness
- Migration risk: Medium (high impact, but isolated)
- Safest rollout: Primitives first, then Home surface
- Browser QA: All breakpoints, all interaction flows
- Rollback: Checkpoint before/after Home migration
- Dependencies: Primitives, AI workforce, preview system
- CSS isolation: Required for Home, no legacy leaks

## 11. Final Success Definition
- Home no longer feels like a dashboard
- Home feels operationally intelligent
- Home feels AI-native
- Home feels executive-grade
- Home feels calm and premium
- Home clearly exposes workflow continuity and AI workforce guidance

## 12. Executive Narrative Flow

The Home page should guide the user through a clear operational narrative.

The user should understand within seconds:
- operational health
- active priorities
- blocked execution
- AI recommendations
- workflow continuity
- urgent approvals
- next execution opportunities

The page should feel:
- guided
- focused
- calm
- operationally intelligent

The experience must reduce:
- decision fatigue
- scanning overload
- dashboard confusion

The Home page should visually answer:
1. What matters most?
2. What is blocked?
3. What should happen next?
4. Which AI specialists are active?
5. Which workflows require attention?
6. What is ready for execution?

## 13. Operational Priority Architecture

The Home surface must establish clear operational hierarchy.

Priority levels:

### Level 1 — Executive Critical
- approvals
- escalations
- blocked workflows
- execution risks

### Level 2 — Next Best Actions
- recommended actions
- workflow continuation
- launch readiness
- AI recommendations

### Level 3 — AI Workforce Visibility
- active specialists
- operational collaboration
- confidence/risk indicators
- escalation ownership

### Level 4 — Workflow Continuity
- active workflows
- handoffs
- pending tasks
- operational timelines

### Level 5 — Supporting Operational Context
- summaries
- evidence
- secondary metrics
- historical context

Lower-priority information must never visually compete with executive-critical information.

## 14. AI Workforce Presence Model for Home

The AI Workforce presence on Home should feel operationally alive.

The Home page should communicate:
- which specialists are active
- what they are working on
- where escalation exists
- what is blocked
- what is waiting approval
- what is execution-ready

The AI presence should not feel:
- noisy
- chat-centric
- gimmicky
- notification-heavy

The AI Workforce surface should prioritize:
- operational clarity
- workflow assistance
- execution guidance
- confidence visibility
- collaboration continuity

## 15. Calm Executive UX Rules

The Home page must feel:
- calm
- focused
- premium
- enterprise-grade
- operationally trustworthy

Avoid:
- dashboard card walls
- equal-weight sections
- noisy alerts
- excessive motion
- oversized metrics
- crowded layouts
- scattered action buttons

The page should prioritize:
- clarity
- operational confidence
- visual breathing room
- intelligent focus
- guided execution

---

**This audit and plan must be reviewed and signed by all contributors before Home migration begins.**

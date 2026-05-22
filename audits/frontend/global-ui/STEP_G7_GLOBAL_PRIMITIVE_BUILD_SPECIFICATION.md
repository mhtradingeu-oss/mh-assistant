# STEP G7 — Global Primitive Build Specification

**Purpose:**
Define the final build specification for all MH-OS global operating primitives, layout hierarchy, shell structure, AI workforce surfaces, preview systems, responsive rules, and implementation ownership. This is a documentation-only build spec. No code, CSS, or backend changes.

---

## 1. Primitive Hierarchy

| Primitive             | Purpose                                              | Ownership         | Usage Scope         | Responsive Behavior         | Duplication Restrictions |
|----------------------|------------------------------------------------------|-------------------|---------------------|----------------------------|-------------------------|
| mhos-shell           | Root container, global layout                        | Global CSS Layer  | All pages           | Adapts to device, sticky   | Global only             |
| mhos-page            | Page-level container, context scoping                | Global CSS Layer  | All pages           | Fills shell, scrollable    | Global only             |
| mhos-header          | Top navigation, branding, context                    | Global CSS Layer  | All pages           | Collapses on mobile        | Global only             |
| mhos-executive-strip | High-level summary, KPIs, status                     | Global CSS Layer  | Exec, Home, Gov     | Responsive, collapsible    | Global only             |
| mhos-workspace       | Main operational area                                | Global CSS Layer  | All pages           | Flexible, resizes         | Global only             |
| mhos-preview-surface | Result previews, context switching                   | Global CSS Layer  | All pages           | Relocates on mobile        | Global only             |
| mhos-action-panel    | Primary actions, contextual controls                 | Global CSS Layer  | All pages           | Collapses on mobile        | Global only             |
| mhos-ai-room         | AI team container, collaboration hub                 | Global CSS Layer  | AI/Publishing/Gov   | Stacks on mobile           | Global only             |
| mhos-ai-specialist   | AI role card, status, actions                        | Global CSS Layer  | AI/Publishing/Gov   | Grid/stack responsive      | Global only             |
| mhos-workflow-ribbon | Workflow steps, progress, handoff                    | Global CSS Layer  | All workflow pages  | Stacks on mobile           | Global only             |
| mhos-command-surface | Command bars, next-best-actions                      | Global CSS Layer  | All pages           | Adapts to context          | Global only             |
| mhos-evidence-surface| Evidence, audit, supporting info                     | Global CSS Layer  | Gov, Ops, AI        | Collapsible, responsive    | Global only             |
| mhos-approval-surface| Approval, review, decision                           | Global CSS Layer  | Gov, Publishing     | Collapsible, responsive    | Global only             |
| mhos-operational-card| Operational summary, insight, status                 | Global CSS Layer  | All pages           | Grid/stack responsive      | Global only             |
| mhos-timeline        | Operational timeline, history, escalation            | Global CSS Layer  | Gov, Ops, Exec      | Scrollable, responsive     | Global only             |
| mhos-empty-state     | Empty data, onboarding                               | Global CSS Layer  | All pages           | Responsive                 | Global only             |
| mhos-loading-state   | Loading, skeletons, shimmer                          | Global CSS Layer  | All pages           | Responsive                 | Global only             |
| mhos-error-state     | Error, failure, retry                                | Global CSS Layer  | All pages           | Responsive                 | Global only             |

## 2. Primitive Ownership Model
- All primitives are owned by the global CSS layer.
- All pages consume primitives via import; no page may override global primitive structure or style.
- Only the global CSS layer may extend primitives.
- No page may fork or duplicate a primitive.
- Primitives are global-only; page-local variants are forbidden.

## 3. Final Page Shell Structure

```
mhos-shell
  └─ mhos-header
  └─ mhos-executive-strip
  └─ mhos-workspace
        ├─ mhos-preview-surface
        ├─ mhos-ai-room
        ├─ mhos-action-panel
        ├─ mhos-workflow-ribbon
        ├─ mhos-evidence-surface
        ├─ mhos-approval-surface
        ├─ mhos-operational-card
        ├─ mhos-timeline
        ├─ mhos-empty-state
        ├─ mhos-loading-state
        └─ mhos-error-state
```
- Spacing: Modular, calm, predictable.
- Hierarchy: Header > Executive > Workspace > Surfaces.
- Collapse: Only non-critical panels collapse; preview/action always accessible.
- Layout: Workspace is primary, preview and AI are secondary.
- Scroll: Workspace owns scroll; header and executive strip sticky.

## 4. AI Workforce Build Structure
- mhos-ai-room: Team room shell, grid/stack layout.
- mhos-ai-specialist: Role card, status, actions, confidence, memory.
- Collaboration threads: Visual thread for handoff, escalation.
- AI workspace containers: Dedicated for each specialist.
- Modes: Meeting room, executive, operational.
- Confidence layer: Visual certainty indicator.
- Memory layer: Recent actions, handoffs.
- Execution visibility: Who is executing, what is in progress.
- Escalation visibility: Blocked/escalated states.

## 5. Preview Framework Specification
- mhos-preview-surface: Container for all previews.
- Social: Card, mobile/desktop, approval overlay.
- Video: Player, responsive, execution overlay.
- Publishing: Package summary, approval, execution.
- Governance: Evidence, approval, audit.
- Customer: Case, summary, escalation.
- IVR: Transcript, call flow, escalation.
- Sales: Deal, status, summary.
- AI Execution: Status, logs, confidence.
- Layout: Responsive, grid/stack, overlays.
- Interaction: Click, expand, approve, retry.
- Approval: Visible on all approval previews.
- Execution: Status, retry, escalation visible.

## 6. Command Surface Specification
- mhos-command-surface: Global command bar.
- Contextual actions: Show only relevant actions.
- Keyboard workflow: Full keyboard support.
- Next-best-action: Highlighted, prioritized.
- Destructive actions: Red, confirm required.
- AI recommendations: Visually separated from execution.

## 7. Workflow & Timeline Specification
- mhos-workflow-ribbon: Visual workflow steps, progress.
- mhos-timeline: Operational history, escalation, retry.
- Approval flows: mhos-approval-surface, state transitions.
- Handoff: Visual thread, owner indicator.
- Retry/Escalation: Visual state, action required.
- Blocked: Highlighted, requires attention.
- Ownership: Always visible, clear.

## 8. Responsive Build Rules
- Desktop/Laptop: Sidebar visible, AI/preview docked, panels collapse predictably.
- Tablet: Sidebar as drawer, panels stack, preview via tab/swipe.
- Mobile: Topbar simplified, panels via bottom nav, preview always accessible, no horizontal scroll.
- Sidebar: Collapsible, never overlays critical content.
- AI panel: Docked or overlay, always accessible.
- Preview: Relocates below workspace on mobile.
- Action panel: Collapses to icon bar on mobile.
- Workflow ribbon: Stacks or scrolls on mobile.
- Meeting room: Adapts to available space.

## 9. Motion & Interaction Limits
- Allowed: Fast, smooth, minimal transitions; fade/slide for preview updates; calm AI indicators; skeleton/shimmer for loading.
- Forbidden: Excessive animation, bounce, jitter, flashing, pulsing.
- AI activity: Calm, non-distracting.
- Loading: No spinner-only; always show skeletons.
- Preview: Fade/slide updates, never abrupt.
- Calm: No surprise, no visual noise.

## 10. Anti-Divergence Rules
- No primitive forks or duplicate implementations.
- No page-local primitive rewrites.
- No unapproved overrides.
- All primitive changes require QA and documentation.

## 11. Actual Build Order
1. mhos-shell, mhos-header, mhos-page
2. mhos-workspace, mhos-executive-strip
3. mhos-preview-surface, mhos-action-panel
4. mhos-ai-room, mhos-ai-specialist
5. mhos-workflow-ribbon, mhos-command-surface
6. mhos-evidence-surface, mhos-approval-surface
7. mhos-operational-card, mhos-timeline
8. mhos-empty-state, mhos-loading-state, mhos-error-state
- Preview system: Social, video, publishing, governance, customer, IVR, sales, AI execution
- AI workforce: Team room, specialist, collaboration, memory, escalation
- Command surface: Global, contextual, keyboard
- First migration: Publishing, then AI Team, then Governance
- QA: After each primitive and migration
- Rollback: Checkpoint after each major build/migration

## 12. Build Readiness Gates
- No primitive implementation until spec is reviewed and signed.
- No page migration until primitive QA passes.
- No CSS cleanup until all primitives are in place.
- No legacy removal until all new primitives are validated in production.

## 13. Final Frontend Success Definition
- MH-OS no longer feels like a dashboard.
- AI workforce feels operationally real and visible.
- Previews feel production-grade, responsive, and clear.
- Workflows feel intelligent, with clear ownership and handoff.
- Platform feels enterprise-grade, calm, and trustworthy.
- System is visually premium, readable, and powerful.

---

**This build specification must be reviewed and signed by all contributors before implementation begins.**

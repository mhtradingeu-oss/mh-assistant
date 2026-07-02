# HOME IMPLEMENTATION READINESS AUDIT

**Purpose:**
Audit the real current Home implementation and define the exact safe migration readiness plan for the Executive AI Operating Brain. Documentation only. No code, CSS, or backend changes.

---

## 1. Current Home File Ownership
- **Home JS files:** public/control-center/pages/home.js, public/control-center/pages/home-*.js
- **Home render files:** public/control-center/pages/home.js, shared components in public/control-center/components/
- **Home CSS files:** public/control-center/styles/01-shell.css, 02-header.css, 10-home.css, 15-clean-operating-layer.css
- **Shared dependencies:** Router, state manager, notification system, AI hooks
- **Shared primitives:** Header, action panel, preview container, card components
- **Runtime hooks:** useEffect, custom event listeners, workflow subscriptions
- **Router dependencies:** Router.js, route config
- **Safe files:** Header, router, preview container
- **Fragile files:** home.js, home-*.js, 10-home.css
- **Legacy-heavy:** 10-home.css, dashboard card components
- **Require isolation:** home.js, 10-home.css, legacy card wall

## 2. Existing Render Architecture
- **Render flow:** home.js renders header, card wall, actions, recent tasks
- **Section ownership:** Header (global), card wall (home.js), actions (home.js), tasks (home.js)
- **Layout ownership:** 10-home.css, 01-shell.css
- **Runtime update flow:** State manager triggers re-render on data change
- **State update flow:** useState/useReducer, workflow subscriptions
- **Event handling:** Button handlers, workflow listeners, notification triggers
- **Reusable structures:** Header, preview container, action panel
- **Duplicated patterns:** Card wall, summary cards
- **Dashboard legacy:** Card wall, equal-weight blocks
- **Unsafe rendering:** Direct DOM manipulation in legacy overlays

## 3. CSS Readiness Audit
- **Page-scoped selectors:** .home-*, [data-page="home"]
- **Shared selectors:** .header, .action-panel, .preview-container
- **Legacy overlap risks:** .card, .summary, .dashboard
- **Duplication risks:** Multiple .card, .summary definitions
- **Overlay risks:** .overlay, .modal in 10-home.css
- **Panel risks:** .panel, .side-panel
- **Spacing inconsistencies:** Margin/padding in 10-home.css
- **Card-wall structures:** .card-wall, .dashboard-cards
- **Selectors to remain:** .header, .action-panel, .preview-container
- **Selectors to isolate:** .home-*, .card-wall, .dashboard-cards
- **Selectors to replace:** .card, .summary, .dashboard
- **High-risk selectors:** .overlay, .modal, .dashboard

## 4. JS / Runtime Safety Audit
- **Active listeners:** Workflow, notification, AI event listeners
- **Timers:** Minimal, mostly for polling
- **Subscriptions:** Workflow, state manager
- **Overlays:** Modal overlays, legacy DOM manipulation
- **AI runtime hooks:** useAI, workflow AI triggers
- **Workflow updates:** Subscriptions, direct state updates
- **Projection dependencies:** Data projections for summary cards
- **Startup dependencies:** Router, state init
- **Safe boundaries:** Header, router, preview container
- **Dangerous zones:** Overlays, direct DOM manipulation, legacy card wall
- **Protected boundaries:** Header, router
- **Rollback-sensitive:** Overlays, workflow listeners

## 5. Primitive Migration Units
- **Unit 1: Executive Health Strip**
  - Files: home.js, 10-home.css
  - CSS: Replace .dashboard, .summary
  - JS: New render, remove legacy
  - Runtime: Minimal
  - Risk: Low
  - Rollback: Easy
  - QA: Visual, interaction
- **Unit 2: Next Best Action Surface**
  - Files: home.js, 10-home.css
  - CSS: Replace .card-wall
  - JS: New prioritized actions
  - Runtime: Moderate
  - Risk: Medium
  - Rollback: Moderate
  - QA: Action flow
- **Unit 3: AI Workforce Surface**
  - Files: home.js, AI hooks
  - CSS: New .ai-room, .ai-specialist
  - JS: Integrate AI status
  - Runtime: Moderate
  - Risk: Medium
  - Rollback: Moderate
  - QA: AI status, escalation
- **Unit 4: Workflow / Operational Stream**
  - Files: home.js, workflow hooks
  - CSS: New .workflow-ribbon
  - JS: Workflow state
  - Runtime: Moderate
  - Risk: Medium
  - Rollback: Moderate
  - QA: Workflow continuity
- **Unit 5: Operational Panels**
  - Files: home.js, panel components
  - CSS: Contextual panels
  - JS: Expand/collapse logic
  - Runtime: Low
  - Risk: Low
  - Rollback: Easy
  - QA: Panel interaction
- **Unit 6: AI Guidance Layer**
  - Files: home.js, AI hooks
  - CSS: .ai-guidance
  - JS: Guidance logic
  - Runtime: Low
  - Risk: Low
  - Rollback: Easy
  - QA: Guidance visibility

## 6. Reusable Primitive Opportunities
- **Layouts:** Header, workspace, preview
- **Cards:** Operational, AI specialist
- **Workflow:** Ribbon, timeline
- **AI:** Specialist, room, guidance
- **Action surfaces:** Next best action
- **Preview surfaces:** Preview container
- **Global primitives:** Header, workspace, preview, action panel, workflow ribbon, AI room
- **Home-only:** Executive strip, next best action
- **Reusable patterns:** Timeline, operational card, panel

## 7. Legacy & Duplication Risks
- **Dashboard remnants:** Card wall, summary cards
- **Duplicated systems:** Multiple .card, .summary
- **Conflicting selectors:** .dashboard, .card, .summary
- **Conflicting logic:** Legacy overlays, direct DOM
- **Overlay stacking:** .overlay, .modal
- **Fragmented actions:** Multiple action surfaces
- **Duplicated summaries:** Multiple summary cards
- **Unsafe inheritance:** Extending legacy dashboard components

## 8. Rollback Strategy
- **Rollback checkpoints:** After each migration unit
- **Isolation checkpoints:** Before/after overlay removal
- **Runtime validation:** After event handler changes
- **Browser QA:** After each unit, all breakpoints
- **Selector checks:** Before/after CSS changes
- **Visual regression:** After each migration unit

## 9. Safe Migration Order
1. Primitive isolation
2. Executive Health Strip
3. Next Best Action Surface
4. AI Workforce Surface
5. Workflow / Operational Stream
6. Operational Panels
7. AI Guidance Layer
8. Responsive cleanup
9. Final QA

## 10. Final Readiness Verdict
- **Readiness level:** Moderate — legacy risks present but isolated
- **Implementation safety:** High if migration units are isolated
- **Migration complexity:** Medium — legacy overlays and card wall
- **Runtime stability:** High for primitives, moderate for overlays
- **CSS cleanliness:** Moderate — legacy selectors must be isolated
- **Recommended pace:** Unit-by-unit, with QA and rollback after each

## 11. Final Success Criteria
- Home is safe to migrate
- Home is ready for controlled implementation
- Home can evolve without backend risk
- Home can become the Executive AI Operating Brain safely

---

**This readiness audit must be reviewed and signed by all contributors before Home migration begins.**

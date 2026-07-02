# STEP G5 — Global Operating Primitives Implementation Plan

**Purpose:**
This plan defines the implementation blueprint for all global operating primitives, interaction systems, AI workforce layouts, preview systems, and execution-ready UI structure for the MH-OS Hybrid AI Operating Environment. No code, CSS, or JS changes are permitted under this contract. Documentation only.

---

## 1. Global Operating Primitives
Reusable primitives to be implemented:
- Page Shell
- Smart Header
- Workspace Container
- Result Preview Container
- AI Team Surface
- Action Panel
- Workflow Ribbon
- Operational Timeline
- Executive Summary Strip
- Approval Surface
- Evidence Surface
- Execution Package Surface
- Operational Cards
- Empty States
- Loading States
- Error States

## 2. Layout Architecture
- **Desktop/Laptop:** Sidebar visible/collapsible, AI panel docked or overlay, preview always visible, panels collapse predictably.
- **Tablet:** Sidebar as drawer, panels stack, preview accessible via tab/swipe.
- **Mobile:** Topbar simplified, panels accessible via bottom nav, preview always accessible, no horizontal scroll.
- **Panel Collapse Rules:** Only non-critical panels collapse; preview and actions remain accessible.
- **Responsive Priorities:** Main workspace and preview prioritized; AI panel and actions always reachable.

## 3. Smart Density System
- Spacing: Consistent, modular, and calm.
- Content Density: Moderate, never crowded or sparse.
- Visual Hierarchy: Clear separation of header, workspace, preview, actions, and AI.
- Information Grouping: Related info grouped visually and spatially.
- Calm Rhythm: Predictable spacing, no abrupt jumps.
- Readability: Minimum 16px font, clear contrast, no micro-text.
- Operational Focus: Key actions and previews always prominent.

## 4. Motion & Interaction System
- Hover: Subtle, never distracting.
- Transitions: Fast, smooth, and minimal.
- AI Activity: Calm indicators, no flashing or pulsing.
- Loading: Skeletons or shimmer, never spinner-only.
- Workflow Movement: Step transitions, clear ownership handoff.
- Approval: Visual confirmation, smooth state change.
- Preview Updates: Fade or slide, never abrupt.
- Motion Limits: No excessive animation; all motion must serve clarity.
- Calm Principles: No jitter, no bounce, no surprise.

## 5. AI Workforce Layout System
- Team Room: Grid or stack of specialist cards.
- Specialist Card: Role, status, confidence, next action.
- Specialist Workspace: Dedicated panel for each AI role.
- Collaboration Threads: Visual thread for AI-to-AI and AI-to-human handoff.
- Confidence Display: Visual indicator of AI certainty.
- Execution Visibility: Show who is executing and what.
- Modes: Meeting Room (collab), Operational (execution), Executive (summary).

## 6. Result Preview Architecture
- Social Preview: .mhos-preview-post
- Video Preview: .mhos-preview-video
- Email Preview: .mhos-preview-email
- Publishing Preview: .mhos-preview-publishing
- Campaign Preview: .mhos-preview-campaign
- Governance Preview: .mhos-preview-governance
- Customer Preview: .mhos-preview-customer
- IVR/Call Preview: .mhos-preview-ivr
- Sales Preview: .mhos-preview-sales
- AI Execution Preview: .mhos-preview-ai-execution
- All previews must be accessible, responsive, and visually clear.

## 7. Operational Workflow Visualization
- Workflow Stages: Visual steps with clear labels.
- Ownership: Show current owner and next handoff.
- Escalation: Highlight escalated or blocked states.
- Execution Status: In progress, done, failed, retry.
- Approval: Pending, approved, rejected, needs review.
- Blocked/Retry: Visual indicators for issues.
- Readiness: Show when ready for next stage.

## 8. Interaction Hierarchy
- Primary Actions: Most prominent, always visible.
- Secondary Actions: Accessible, less prominent.
- Destructive Actions: Red, confirm required.
- AI Suggestions: Clearly marked, not default.
- AI Execution: Distinct from suggestions, requires confirmation.
- Approval: Highlighted, with workflow context.
- Contextual: Only visible when relevant.

## 9. Cross-Page Operational Continuity
- Persistent Context: User, workflow, and AI state persist across pages.
- Workflow Memory: Recent actions and handoffs visible.
- AI Continuity: AI recommendations and ownership persist.
- Operational Breadcrumbs: Show workflow path and related actions.
- Related Evidence: Link evidence to actions and previews.
- Shared Previews: Preview context follows across pages.

## 10. Visual Anti-Patterns
Explicitly forbidden:
- Dashboard card walls
- Equal-weight layouts
- Empty shell spaces
- Logs-first design
- Oversized topbars
- Duplicated panels
- Noisy AI indicators
- Unclear ownership
- Excessive animations
- Unstructured overlays

## 11. Migration Implementation Order
1. Build global primitives (shell, header, workspace, preview, AI, actions)
2. Implement result preview system
3. Build AI workforce layout
4. Migrate Governance page (first)
5. Migrate Publishing, AI Team Command Center, Customer Operations, etc.
6. Browser QA for each migration
7. CSS cleanup after visual QA
8. Rollback checkpoints after each major migration

## 12. Final UX Success Criteria
MH-OS is:
- World-class: Feels premium, modern, and enterprise-ready
- Operationally Intelligent: Surfaces the right info, actions, and previews
- Calm: No visual noise, clear rhythm, readable
- Trustworthy: Clear ownership, audit trails, and evidence
- Execution-Focused: Actions and previews always accessible
- Visually Premium: Consistent, elegant, and accessible
- Enterprise-Grade: Scales to complex workflows and teams
- AI-Native: AI is visible, actionable, and never just chat

## 13. Command Surface System

Define reusable command surfaces for:
- global actions
- workflow actions
- AI actions
- publishing actions
- governance approvals
- escalation actions
- operational shortcuts

Command surfaces should:
- remain contextual
- avoid clutter
- prioritize next-best actions
- support keyboard and power-user workflows
- visually separate AI recommendations from execution actions

## 14. Multi-Workspace Philosophy

MH-OS should support a multi-workspace operational feeling.

Users should feel capable of:
- monitoring workflows
- reviewing previews
- managing approvals
- collaborating with AI specialists
- navigating operational contexts

without losing orientation or context.

Workspaces should support:
- focused mode
- collaborative mode
- executive mode
- review mode
- publishing mode

## 15. Enterprise Readability System

The interface should optimize for long operational sessions.

Requirements:
- readable typography
- visual breathing room
- clear section hierarchy
- low cognitive fatigue
- predictable layouts
- consistent interaction patterns

The interface should remain usable during:
- extended operational reviews
- publishing sessions
- governance approvals
- customer operations monitoring
- multi-agent collaboration

## 16. AI Workforce Scaling Rules

The AI Workforce system must scale gracefully.

The UI should support:
- additional specialists
- grouped teams
- operational departments
- temporary task forces
- escalation chains
- role-based visibility

The experience must remain:
- organized
- calm
- understandable
- operationally focused

even as the workforce expands.

## 17. Operational Focus Modes

MH-OS should support multiple operational focus modes.

Examples:
- Executive Overview
- Workflow Execution
- AI Collaboration
- Publishing Review
- Governance Approval
- Customer Resolution
- Campaign Planning
- Crisis Response

Focus modes should:
- reduce unnecessary distractions
- prioritize relevant actions
- emphasize operational clarity
- preserve workflow continuity

---

**This implementation plan must be reviewed and signed by all contributors before migration begins.**

# STEP G4 — Hybrid AI Operating Environment Design Blueprint

**Purpose:**
This blueprint defines the final UX/UI vision and design system for MH-OS as a Hybrid AI Operating Environment. It is binding for all future redesign, migration, and operating surface work. No code, CSS, or JS changes are permitted under this contract. Documentation only.

---

## 1. Final Product Experience Vision
- When users enter MH-OS, they feel they are in a powerful, calm, and workflow-driven operating environment—not a dashboard.
- The system is not a dashboard: it is an AI-powered business OS where workflows, previews, approvals, and operations are unified.
- The AI Team, workflows, previews, approvals, and operations are seamlessly integrated into one experience, making the user feel in control and supported by AI specialists.

## 2. Hybrid AI Operating Environment Model
- **Smart Header:** Context, status, and navigation at the top.
- **Main Workspace:** The core area for work, content, and operations.
- **Result Preview Surface:** Always-visible or accessible preview of the current work (content, media, campaign, etc.).
- **Action Panel:** Contextual actions, approvals, and workflow steps.
- **AI Team / AI Guidance Panel:** Visible AI specialists, recommendations, and handoff status.
- **Workflow / Handoff Strip:** Shows current workflow stage, handoff, and next actions.
- **Operational Timeline:** Visualizes key events, actions, and history.
- **Evidence / Governance Layer:** Surfaces evidence, governance, and compliance context.

## 3. Visual Reference Principles
- **Meta Business Suite:** Preview and channel readiness (conceptual reference only)
- **TikTok/Instagram:** Post/video preview behavior
- **HubSpot:** Customer and sales operation clarity
- **ClickUp/Linear:** Task/workflow clarity
- **Notion:** Calm structure and readable surfaces
- **Figma/Canva:** Creative preview and approval feeling
- *Do not copy; use only as conceptual inspiration for clarity, calm, and workflow integration.*

## 4. Final Layout Anatomy
- **Desktop/Laptop:**
  - Smart Header always visible
  - Sidebar collapsible, but present
  - Main Workspace centered, with Result Preview and Action Panel visible
  - AI Panel docked right or as overlay
  - Spacing: generous, no crowding; cards and panels have clear separation
  - No horizontal overflow; panels collapse or slide as needed
- **Tablet:**
  - Sidebar collapses to icons or drawer
  - Panels stack vertically if needed
  - Result Preview accessible via tab or swipe
- **Mobile:**
  - Topbar simplified, sidebar as drawer
  - Main Workspace prioritized, panels accessible via bottom nav or swipe
  - Result Preview always accessible, never hidden
  - No zoomed or crowded feeling
- **General:**
  - Page density: moderate, readable
  - Card sizing: responsive, never too small to interact
  - Panel collapse: predictable, never hides critical actions or previews
  - Preview and AI panels always accessible

## 5. Result Preview System
Reusable preview patterns for:
- **Social Post:** .mhos-preview-post
- **Video:** .mhos-preview-video
- **Image:** .mhos-preview-image
- **Email:** .mhos-preview-email
- **Campaign:** .mhos-preview-campaign
- **Publishing Package:** .mhos-preview-publishing
- **Customer Operation:** .mhos-preview-customer
- **IVR/Call Transcript:** .mhos-preview-ivr
- **Sales Opportunity:** .mhos-preview-sales
- **Governance Decision:** .mhos-preview-governance
- All previews must be accessible, visually clear, and support quick review/approval.

## 6. AI Team Experience
- The AI Team is not just chat: it is a visible panel of AI specialists with roles, status, and recommendations.
- Each specialist shows:
  - Role (e.g., Copywriter, Analyst, Compliance)
  - Status (active, idle, reviewing, blocked)
  - Next recommendation or action
  - Handoff ownership and confidence/risk level
  - Action suggestions (with clear distinction between suggestion and execution)
- The user always knows who is suggesting, who is executing, and who is responsible for the next step.

## 7. Page-Specific Final Experience
- **Home Executive Room:** Calm overview, AI Team status, global actions, and recent results.
- **Governance:** Evidence, approvals, workflow stage, and compliance context always visible.
- **Publishing:** Preview-driven, with channel readiness and approval workflow.
- **AI Team Command Center:** All AI specialists visible, with workflow and handoff clarity.
- **Customer Operations:** Customer context, timeline, and AI recommendations.
- **IVR / Call Operations:** Transcript preview, call actions, and AI suggestions.
- **Sales Operations:** Opportunity preview, workflow, and AI guidance.
- **Campaign Studio:** Campaign preview, workflow, and readiness.
- **Content Studio:** Content preview, workflow, and AI suggestions.
- **Media Studio:** Media preview, workflow, and publishing readiness.
- **Library:** Asset preview, taxonomy, and AI-powered search.
- **Insights:** Visual analytics, AI findings, and workflow actions.
- **Research:** Research preview, evidence, and AI recommendations.
- **Integrations:** Integration status, workflow, and evidence.
- **Settings / Setup:** Clear forms, preview of changes, and AI guidance.
- **Operations Centers:** Task/operations workflow, preview, and AI support.

## 8. Showing Backend Power Visually
- Approvals: Visual status, history, and authority
- Routing: Show how tasks and content move through the system
- Recommendations: AI suggestions surfaced contextually
- Learning: Indicate when the system is learning or adapting
- Governance: Evidence and compliance always visible
- Integrations: Status and readiness of integrations
- Execution Packages: Show what will be executed and by whom
- Tasks: Timeline and ownership
- Handoffs: Visual handoff and next owner
- Evidence: Link evidence to actions and decisions
- Publishing Readiness: Visual readiness indicators

## 9. Remove Old Feelings
- No dashboard clutter
- No equal-weight card grids
- No logs-first UI
- No chat-only AI
- No shell-like empty surfaces
- No repeated panels
- No unclear buttons
- No technical labels shown to users

## 10. Implementation Boundaries
- No backend authority changes
- No route changes unless separately approved
- No CSS duplication
- No page rewrite without audit
- No new service unless backend exists or is documented as future need
- Preserve IDs, data attributes, handlers, and API calls

## 11. Migration Roadmap
1. Design primitives
2. Preview primitives
3. AI Team surface
4. First page migration (Governance)
5. Browser QA
6. CSS cleanup
7. Legacy removal

## 12. Launch-Ready Checklist
A page is launch-ready when:
- All required layout elements are present (Smart Header, Main Workspace, Result Preview, Action Panel, AI Panel)
- No dashboard or shell clutter remains
- All previews are accessible and accurate
- AI Team panel is visible and actionable
- Workflow and handoff are clear
- No duplicate selectors or patch blocks
- Browser QA passes on all devices
- Accessibility checks pass
- Stakeholder sign-off is recorded

---

**This blueprint must be reviewed and signed by all contributors before any redesign or migration work begins.**

## Operating Context Persistence
- The system should preserve user context across pages.
- The user should not feel “reset” when navigating.
- Active workflow, selected campaign, selected customer, and current AI session should remain visible and recoverable.
- The UI should always explain:
  - where the user came from
  - what is active now
  - what the next action is

  ## AI Execution Safety UX
- AI suggestions must visually differ from execution actions.
- Dangerous actions require explicit confirmation.
- Approval ownership must always be visible.
- Users must understand:
  - what is simulated
  - what is draft
  - what is scheduled
  - what is live

  ## System State Visibility
- The system should always communicate operational state:
  - syncing
  - generating
  - waiting approval
  - scheduled
  - publishing
  - failed
  - retrying
  - learning
- State visibility should be calm and non-intrusive.

## Intelligent Empty States
- Empty pages should guide the user.
- Empty states should:
  - explain the page
  - suggest next actions
  - suggest AI workflows
  - show examples or templates
- No page should feel “blank” or abandoned.

## Cross-Page Operational Continuity
- Actions started on one page should feel connected across the platform.
- Workflow continuity must remain visible between:
  - AI Team
  - Publishing
  - Governance
  - Customer Operations
  - Sales
  - IVR
  - Campaigns
- Users should always understand:
  - current owner
  - current stage
  - next destination

  ## 13. AI Workforce Experience Model

MH-OS AI Team is not a chatbot layer.
It is a visible operational workforce integrated into the business operating environment.

The user should feel:
- supported by specialists
- guided by operational intelligence
- assisted by coordinated AI workers
- always aware of ownership, workflow stage, and execution status

The AI experience must feel:
- calm
- intelligent
- operational
- collaborative
- trustworthy
- enterprise-grade

---

### 13.1 Team Room Experience

The AI Team should appear as an operational collaboration environment, not a single chat window.

The interface should feel like:
- an executive operations room
- a campaign planning room
- a publishing coordination center
- a business collaboration workspace

The environment must visually communicate:
- active specialists
- current tasks
- workflow ownership
- execution readiness
- approvals
- operational status
- live collaboration

The user should always understand:
- who is working
- what is being worked on
- what is waiting
- what is blocked
- what is ready
- what requires approval

---

### 13.2 AI Specialist Identity

Each AI specialist should have:
- name
- role
- professional profile image/avatar
- operational specialization
- status
- assigned task
- confidence level
- current workflow stage
- recent contribution
- available tools
- permissions scope
- escalation capability

Examples:
- Strategist
- Publisher
- Researcher
- Analyst
- Compliance Officer
- Campaign Manager
- Sales Specialist
- Customer Operations Specialist
- Voice/IVR Specialist
- Media Designer
- Content Writer

AI specialists must feel:
- professional
- calm
- enterprise-grade
- operationally focused

Avoid:
- cartoon assistants
- playful gimmicks
- fake-human simulation
- noisy animations

---

### 13.3 Specialist Workspace

Each AI specialist should have a dedicated operational workspace.

The workspace may include:
- conversation stream
- recommendations
- drafts
- attached files
- previews
- workflow status
- tools panel
- evidence
- execution package
- approval state
- assigned tasks
- contextual memory

The user should be able to:
- talk by text
- use voice interaction
- upload files
- attach references
- request revisions
- ask for explanations
- approve/reject actions
- redirect work to another specialist

---

### 13.4 Cross-Agent Collaboration

AI specialists should visibly collaborate with each other.

The system should support:
- AI-to-AI handoffs
- specialist recommendations
- review requests
- escalation
- approval routing
- operational coordination

Example flow:
- Strategist requests creative revision
- Designer uploads new variants
- Compliance reviews policy risk
- Publisher validates channel readiness
- Analyst predicts performance impact

The user should feel:
- the team is coordinated
- specialists understand their roles
- workflows are connected
- operations are progressing intelligently

---

### 13.5 Presence & Operational States

AI specialists should communicate operational presence.

Examples:
- reviewing
- generating
- analyzing
- blocked
- waiting approval
- escalating
- publishing
- monitoring
- learning
- retrying
- completed

Presence indicators must remain:
- calm
- professional
- non-distracting

Avoid:
- excessive animation
- notification spam
- gaming-style activity indicators

---

### 13.6 AI Safety & Execution Visibility

The user must always understand the difference between:
- suggestion
- draft
- simulation
- approval-ready
- scheduled
- live execution

Dangerous or sensitive actions require:
- visible confirmation
- approval ownership
- execution scope visibility
- governance context
- rollback visibility

The system must clearly communicate:
- what AI is recommending
- what AI is executing
- what requires human approval
- what is already live

---

### 13.7 Tool Visibility & Capability Awareness

Users should visually understand the capabilities of each AI specialist.

Each specialist may expose:
- connected tools
- integrations
- available channels
- workflow permissions
- execution scope
- data access scope
- evidence sources

Examples:
- Publisher → channels/schedulers
- Researcher → web/docs/search
- Analyst → insights/metrics
- Designer → media/brand assets
- Governance → policies/evidence

The UI should communicate power without overwhelming the user.

---

### 13.8 Operational Meeting Modes

The AI Team should support operational session modes.

Examples:
- campaign planning room
- launch readiness review
- governance review
- sales pipeline review
- customer escalation room
- crisis response room
- publishing coordination room

Meeting modes should:
- organize specialists by role
- surface active workflows
- show approvals and blockers
- centralize previews and decisions

---

### 13.9 Cross-Page AI Presence

The AI Team is not isolated to one page.

AI presence should extend across:
- Governance
- Publishing
- Customer Operations
- IVR
- Sales
- Campaigns
- Research
- Media Studio
- Content Studio
- Library
- Insights

The user should always feel:
- continuity
- operational memory
- workflow awareness
- intelligent assistance

---

### 13.10 Human-Centered AI Experience

The AI experience should feel:
- trustworthy
- transparent
- controllable
- collaborative
- operationally intelligent

The goal is not to simulate fake humans.
The goal is to create a world-class AI operational workforce experience.

The interface should prioritize:
- results
- workflows
- previews
- execution clarity
- operational confidence

AI exists to help the user achieve outcomes, not to dominate the interface itself.

---

### 13.11 AI Memory & Operational Continuity

AI specialists should maintain operational continuity across workflows.

The system should preserve:
- active discussions
- workflow context
- assigned ownership
- approvals
- related evidence
- customer history
- campaign state
- publishing readiness

The user should never feel:
- reset between pages
- disconnected from previous actions
- lost inside workflows

The system should always explain:
- what happened
- what changed
- who handled it
- what is next

---

### 13.12 Signature Experience Goal

The MH-OS AI Workforce should become the signature experience of the platform.

The final experience should combine:
- AI orchestration
- operational workflows
- publishing readiness
- governance
- collaboration
- previews
- execution control
- enterprise clarity

The result should feel beyond:
- dashboards
- chatbots
- automation panels

The platform should feel like:
a real AI-powered business operating environment.

### 13.13 Shared Operational Memory

The AI Workforce should maintain visible shared operational memory.

The system should visually communicate:
- active context
- related workflows
- linked campaigns
- customer history
- approvals
- previous decisions
- related evidence
- unresolved blockers

Users should understand:
- what the team knows
- what context is active
- what information is shared across specialists

### 13.14 AI Confidence & Trust Layer

AI specialists should communicate confidence and certainty levels.

The interface may indicate:
- confidence score
- risk level
- approval sensitivity
- evidence strength
- recommendation certainty

The goal is to increase:
- trust
- transparency
- operational confidence

without overwhelming the user with technical metrics.

### 13.15 Executive Override Experience

Users must always retain final operational control.

The interface should clearly support:
- manual override
- escalation
- approval reassignment
- execution cancellation
- rollback
- emergency stop actions

The AI Workforce supports operations,
but human leadership remains authoritative.

### 13.16 Emotional UX Tone

The emotional tone of MH-OS should feel:
- calm
- focused
- intelligent
- premium
- trustworthy
- operationally confident

Avoid:
- noisy dashboards
- excessive alerts
- flashy gaming behavior
- chaotic motion
- overwhelming interfaces

The interface should reduce stress,
increase clarity,
and improve operational confidence.
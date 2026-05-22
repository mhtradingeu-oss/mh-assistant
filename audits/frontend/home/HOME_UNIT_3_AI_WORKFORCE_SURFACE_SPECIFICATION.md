# MH-OS Home — AI Workforce Surface Specification

## 1. Core Philosophy

The AI Workforce exists to operationalize intelligence, transforming MH-OS from a static dashboard or assistant into a living, collaborative execution layer. It is central to MH-OS identity as it embodies a real, specialized, and workflow-aware AI team, not a chatbot, avatar, or sidebar. Unlike chatbot systems, it is not conversationally driven but operationally driven. Unlike dashboard assistants, it is not a passive helper but an active executor. Unlike AI sidebars, it is not an add-on but the core of the operational experience. The AI Workforce is:
- Operational: Drives real execution, not just advice.
- Collaborative: Specialists coordinate, hand off, and escalate.
- Intelligent: Each specialist is context- and workflow-aware.
- Workflow-Aware: Embedded in the flow of work, not parallel to it.
- Specialized: Each role has clear ownership and scope.
- Executive-Grade: Designed for clarity, trust, and enterprise reliability.

## 2. Workforce Structure

The workforce is a team of AI specialists, each with a defined operational domain, ownership, and escalation responsibility. Example specialists:
- Strategist: Owns high-level planning and direction.
- Publisher: Manages content and output delivery.
- Analyst: Interprets data, trends, and performance.
- Governance Lead: Ensures compliance and policy adherence.
- Media Lead: Oversees media assets and campaigns.
- Research Lead: Drives research and insight gathering.
- Customer Operations Lead: Handles customer-facing workflows.
- Sales/IVR Operations Lead: Manages sales and IVR flows.
- Automation Lead: Orchestrates automation and integrations.
- Intelligence Coordinator: Coordinates cross-specialist intelligence.

Ownership: Each specialist owns their operational scope, is responsible for escalation when blocked, and collaborates through defined handoff and escalation protocols. Collaboration is explicit, with visible workflow handoffs and escalation chains.

## 3. Operational State Model

Workforce states include:
- Active: Specialist is executing a task (visually prominent, operationally engaged).
- Waiting: Awaiting input or dependency (dimmed, pending state).
- Escalated: Issue requiring higher authority or human input (highlighted, urgent).
- Reviewing: In review/QA phase (distinct, focused).
- Coordinating: Managing dependencies or multi-specialist flows (linked, connected).
- Blocked: Cannot proceed (alerted, requires action).
- Ready: Available for new tasks (neutral, idle).
- Monitoring: Observing ongoing processes (background, passive).
- Processing: In progress, not yet complete (animated, in-motion).
- Handing Off: Transferring workflow to another specialist (transition state).

Each state has clear visual, operational, escalation, and workflow meanings, ensuring clarity and reducing ambiguity.

## 4. Collaboration Architecture

Specialists interact through explicit workflow handoffs, visible escalation chains, and coordinated dependencies. Handoffs appear as transitions between specialists, escalations as urgent, visually distinct events, and coordination as linked operational flows. Dependencies and approvals are surfaced as part of the workflow, not as chat or notification spam. The experience is alive, coordinated, and workflow-driven, never chaotic or noisy.

## 5. Workforce Layout System

The layout is hierarchical and focus-driven:
- Primary focus: Active specialist(s) are most visible.
- Secondary: Supporting or waiting specialists are visible but less prominent.
- Collaboration chain: Shows the current and historical flow of work.
- Workflow continuity: Ensures the user always sees the next step and responsible specialist.

The surface is calm, premium, and operationally alive, avoiding overload or static card walls.

## 6. AI Identity System

Each specialist has:
- Unique, role-based naming (not generic or cartoonish).
- Profile identity: Operational role, not avatar.
- Confidence: Visual cues for certainty/uncertainty.
- Reasoning: On-demand, concise explanations for actions.
- Authority: Clear display of operational authority and escalation rights.

Specialists feel trustworthy, specialized, contextual, and operational—never gimmicky or robotic.

## 7. Communication Model

Communication is operational, not conversational:
- Messages are concise, actionable, and workflow-focused.
- Operational updates: Status, progress, and outcomes.
- Workflow updates: Handoffs, completions, and dependencies.
- Escalation/approval: Clearly surfaced, not lost in noise.
- Reasoning: Available on demand, not as spam.

Noise is minimized; clarity and operational awareness are maximized.

## 8. Workforce UX Rules

- Information density is optimized for clarity, not overload.
- Visibility: Only relevant specialists and states are shown.
- Expansion: Details expand on demand, not by default.
- Priority: Active/escalated specialists are prioritized.
- Escalation: Always visible and actionable.
- Collaboration: Focused on the current operational chain.

Avoids equal-weight panels, static walls, and endless feeds.

## 9. AI Reasoning Visibility

- Reasoning appears when:
  - Actions are non-obvious
  - Escalations occur
  - Human input is required
- Reasoning is concise, operational, and actionable.
- Confidence is visually indicated.
- Workflow logic is surfaced as needed, not by default.

## 10. Human + AI Coordination Model

- Human interacts via:
  - Approvals
  - Escalations
  - Assignments
  - Review requests
  - Accepting/rejecting AI suggestions
  - Continuing or pausing AI actions
- Human always sees the operational context and can intervene or approve as needed.

## 11. Voice / Chat / Attachment Future Compatibility

- Architecture supports future:
  - Voice interactions
  - Attachments (files, media)
  - Live collaboration (multiple humans/AIs)
  - Meetings and operational rooms
  - Execution sessions
- No implementation yet; primitives and layout are future-compatible.

## 12. Primitive Requirements

Future primitives:
- mhos-workforce-room: Container for operational session.
- mhos-specialist: Individual specialist entity.
- mhos-specialist-state: State indicator for specialist.
- mhos-specialist-reasoning: Reasoning/logic display.
- mhos-specialist-handoff: Workflow handoff indicator.
- mhos-specialist-escalation: Escalation event indicator.
- mhos-specialist-thread: Collaboration thread.
- mhos-specialist-approval: Approval event.
- mhos-workforce-flow: Workflow chain container.
- mhos-workforce-chain: Sequence of operational steps.

Each primitive has clear ownership, isolation, allowed variants, responsive behavior, and anti-duplication rules.

## 13. Responsive Workforce Rules

- Desktop: Full orchestration, all active/secondary specialists visible.
- Tablet: Condensed, prioritized view; active specialists prominent.
- Mobile: Highly condensed, only active/escalated specialists visible; others accessible via expansion.
- Always prioritizes active specialists and workflow continuity.

## 14. Runtime & Backend Boundaries

- Projection-only: No orchestration or authority mutation.
- No workflow execution changes from the surface.
- No routing or unsafe runtime injection.
- Strict separation of projection and execution layers.

## 15. Migration Strategy

- Safe migration sequence:
  - Roll out core primitives (room, specialist, state)
  - Add specialist roles incrementally
  - QA checkpoints after each rollout
  - Rollback safety at each stage
  - Validate workflow and operational continuity

## 16. Final Success Definition

Success is proven when:
- The workforce feels alive, collaborative, and operational
- The experience is intelligent, enterprise-grade, and AI-native
- Execution clarity is improved
- Cognitive load is reduced
- Users trust and rely on the AI Workforce for real operational work

## 17. Workforce Room Architecture

The AI Workforce must feel like a living operational room, not a list of specialists.

The room should visually communicate:
- active coordination
- workflow movement
- operational awareness
- escalation visibility
- execution continuity

The room is:
- the operational brain of MH-OS
- the center of orchestration
- the bridge between execution and intelligence

The room must visually support:
- active specialists
- current operational chain
- blocked flows
- approvals
- escalations
- workflow transitions

The experience should feel:
- alive
- calm
- executive
- intelligent
- coordinated

NOT:
- chat rooms
- social feeds
- avatar walls
- CRM users
- Discord-like channels

## 18. Workforce Focus System

The workforce surface must prioritize operational focus.

At any time:
- one specialist or workflow chain becomes primary
- supporting specialists become secondary
- unrelated specialists reduce visual prominence

Focus priority depends on:
- escalation state
- operational urgency
- workflow ownership
- approval dependency
- execution continuity

The system should guide the user toward:
- the active operational chain
- the current execution bottleneck
- the most important specialist interaction

Avoid:
- equal-weight workforce layouts
- static specialist visibility
- visual overload

## 19. Workforce Narrative Flow

The workforce should present operational progression as a narrative flow.

The user should understand:
- what is happening
- who is handling it
- what changed
- what is blocked
- what escalated
- what continues next

The workforce must visually communicate:
- execution progression
- workflow transitions
- specialist handoffs
- operational consequences

The experience should feel:
- continuous
- coordinated
- alive
- operationally intelligent

## 20. Specialist Continuity Model

Each specialist should maintain operational continuity across sessions.

Specialists should preserve:
- workflow awareness
- operational context
- escalation context
- reasoning continuity
- task ownership continuity

The user should feel:
- the specialist remembers the operational state
- the specialist understands historical workflow context
- the workforce operates continuously, not statelessly

## 21. Workforce Trust Model

The AI Workforce must build operational trust gradually.

Trust is created through:
- workflow clarity
- calm communication
- transparent escalation
- visible reasoning
- execution continuity
- predictable operational behavior

Trust must NOT rely on:
- exaggerated AI language
- excessive confidence claims
- artificial personality gimmicks
- conversational flooding

The workforce should feel:
- reliable
- operational
- accountable
- enterprise-grade

## 22. Workforce Energy System

The workforce must visually communicate operational energy.

Energy reflects:
- execution intensity
- escalation pressure
- operational momentum
- workflow stability
- coordination load

Energy must NOT create:
- visual chaos
- notification overload
- animation spam

The system should feel:
- calm under pressure
- responsive
- operationally alive
- continuously active

Energy should subtly appear through:
- motion restraint
- transition rhythm
- workflow progression
- specialist activation
- escalation emphasis

## 23. AI Authority Hierarchy

The workforce must clearly communicate operational authority hierarchy.

Not all specialists have equal authority.

Authority hierarchy determines:
- escalation ownership
- approval power
- workflow override rights
- governance responsibility
- execution authority

Examples:
- Governance Lead can block publishing
- Strategist can redirect execution priorities
- Intelligence Coordinator can escalate cross-team conflicts
- Automation Lead can pause unsafe execution chains

Authority must feel:
- clear
- predictable
- operational
- enterprise-grade

The user should always understand:
- who owns the decision
- who owns the escalation
- who owns the workflow continuation

## 24. Workforce Failure Behavior

The workforce must fail gracefully under operational stress.

Failure should:
- remain calm
- preserve workflow continuity
- preserve operational clarity
- avoid panic behavior
- avoid notification storms

When failures occur:
- ownership must remain visible
- escalation must remain understandable
- workflow continuation must remain possible
- recovery guidance must remain actionable

The workforce should feel:
- resilient
- stable
- trustworthy
- operationally controlled

NOT:
- broken
- chaotic
- flooded
- silent

## 25. Workforce Temporal Awareness

The workforce must maintain awareness of operational time.

Time awareness includes:
- execution timing
- escalation aging
- workflow delays
- approval latency
- scheduling continuity
- operational urgency progression

The workforce should communicate:
- what is late
- what is waiting
- what is progressing
- what is becoming critical
- what requires immediate intervention

Temporal awareness should feel:
- intelligent
- predictive
- operational
- executive-grade

NOT:
- countdown spam
- alert flooding
- artificial urgency
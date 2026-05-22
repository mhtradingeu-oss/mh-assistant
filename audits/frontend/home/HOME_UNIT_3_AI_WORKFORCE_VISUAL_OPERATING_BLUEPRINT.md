# HOME UNIT 3 — AI WORKFORCE VISUAL OPERATING BLUEPRINT

## 1. Visual Identity Philosophy
- The AI Workforce Surface visually feels operational, calm, executive, intelligent, alive, coordinated, and enterprise-grade.
- Differs from dashboards: No card stacks, no widget grids, no summary panels. The environment is a living operational room, not a static data display.
- Differs from AI chats: No chat bubbles, no conversational feed, no avatar rows. Communication is operational, not conversational.
- Differs from SaaS card systems: No equal-weight cards, no profile galleries, no CRM user layouts. The focus is on workflow, not on people or widgets.

## 2. Workforce Room Layout
- Overall structure: A single, unified operational room.
- Primary orchestration area: Central, dominant, shows the active workflow and responsible specialist(s).
- Secondary specialist visibility: Peripheral, condensed, visible but not dominant.
- Workflow chain area: Horizontally or vertically linked, showing the current operational chain and handoffs.
- Escalation visibility area: Prominent, but not overwhelming; escalations are surfaced near the top or in a reserved escalation lane.
- AI reasoning placement: Contextual, appears near the relevant specialist or workflow step, expandable on demand.
- Collaboration visibility: Linked chains, subtle connection lines, not chat threads.
- Dominant focal areas: Active workflow, escalation, reasoning.
- Passive areas: Waiting specialists, completed steps.
- Contextual areas: Reasoning, approvals, dependencies.

## 3. Workforce Hierarchy Model
- Visual hierarchy: Active specialist(s) are visually dominant, with clear operational context.
- Primary active specialist: Highlighted, expanded, operationally focused.
- Secondary specialists: Condensed, minimal, visible for context.
- Hidden/passive: Collapsed, accessible via expansion, not in main focus.
- Escalation dominance: Escalated specialists or steps override normal hierarchy, visually prioritized.
- Workflow ownership: Always visible; user instantly sees who owns the current operation, what is active, blocked, or escalating.

## 4. Operational Chain Visualization
- Workflow chain: Rendered as a fluid, connected sequence (not arrows everywhere, not a flowchart grid).
- Handoffs: Smooth transitions, subtle motion, clear ownership transfer.
- Escalation transitions: Highlighted, with clear escalation path and authority.
- Execution progression: Progress indicators, step transitions, not BPMN diagrams.
- Dependencies: Inline, contextual, not as separate lists.
- The chain feels fluid, intelligent, operational, and alive.

## 5. Specialist Rendering System
- Appearance: Executive, minimal, operationally branded (not avatars, not cards).
- Focus: Active specialist is expanded, with operational context and reasoning visible.
- Reasoning: Appears contextually, expandable, never as chat.
- Confidence: Subtle indicators, not scores or badges.
- Escalation: Visually distinct, but not alarming.
- Authority: Subtle, clear, operationally visible.
- Profile density: High information density, low visual noise.
- Operational identity: Role and responsibility, not personal profile.
- Active/inactive: Active is expanded, inactive is condensed.
- Collaboration: Visible through workflow chain, not chat or gallery.

## 6. Workforce Motion Philosophy
- Motion: Restrained, premium, operational.
- Transition rhythm: Smooth, not flashy; used for workflow handoffs, escalation, and activation.
- Escalation emphasis: Subtle pulse or highlight, not blinking or shaking.
- Activation: Smooth expansion, not pop-in.
- Workflow continuation: Subtle directional cues, not arrows or bouncing.
- Avoids flashy animations, blinking, excessive movement, or consumer-app motion.

## 7. AI Reasoning Visualization
- Placement: Near the relevant specialist or workflow step.
- Expansion: Collapsed by default, expands on demand.
- Confidence: Subtle, contextual, not dominant.
- Explanation: Concise, executive, operationally actionable.
- Escalation explanation: Always visible when escalation is present.

## 8. Workforce Focus Engine
- Focus transitions: Smooth, visually guides attention to active workflow or escalation.
- Emphasis: Active workflow and escalations are visually prioritized.
- Priority routing: Escalations override normal focus.
- Attention guidance: Subtle cues (highlight, expansion, motion) direct user to what matters now, next, and who is responsible.

## 9. Operational Energy Rendering
- Calm operational energy: Neutral color base, subtle highlights for activity.
- Execution momentum: Progress bars, step transitions, not spinning or bouncing.
- Escalation pressure: Subtle color shift or pulse, not red alerts.
- Workflow stability: Stable layout, no jitter or reflow.
- Feels active but calm, responsive but controlled, intelligent but restrained.

## 10. AI Authority Rendering
- Authority: Subtle icons or color cues, not badges or banners.
- Escalation authority: Highlighted, but not alarming.
- Approval authority: Clearly marked, with operational context.
- Workflow ownership: Always visible, never ambiguous.
- Governance dominance: Subtle, predictable, enterprise-grade.

## 11. Workforce Timeline & Continuity
- Continuity: Progression is visible as a chain, not as a feed.
- History: Key workflow steps are visible, not endless logs.
- Progression: Step indicators, not activity feeds.
- Pending: Pending states are visually distinct, but not noisy.
- Execution aging: Subtle time indicators, not timestamps everywhere.
- Avoids activity feed spam, endless logs, notification timelines.

## 12. Human + AI Operating Experience
- Collaboration: User interacts via clear, contextual controls (approve, escalate, intervene, continue).
- Approval placement: Near relevant workflow step or specialist.
- Escalation placement: Prominent, but not overwhelming.
- Intervention: Clearly visible, actionable.
- Continuation: Controls are contextual, not global.
- User feels guided, informed, empowered, and operationally supported—not controlled, flooded, or disconnected.

## 13. Responsive Workforce Layout
- Desktop: Full orchestration, all active and secondary specialists visible, workflow chain expanded.
- Tablet: Condensed, with active specialists and workflow chain prioritized, secondary specialists collapsible.
- Mobile: Highly condensed, only active/escalated specialists and workflow chain visible, others accessible via expansion.
- Specialist condensation: Inactive/secondary specialists collapse into icons or minimal rows.
- Workflow preservation: Chain always visible, even if condensed.
- Escalation persistence: Escalations always visible, regardless of device.
- Reasoning collapse: Reasoning is collapsed by default, expands on demand.

## 14. Primitive Blueprint
- mhos-workforce-room: Owns the operational room; renders the full environment.
- mhos-specialist: Renders a specialist; expanded for active, condensed for inactive.
- mhos-specialist-state: Renders state (active, waiting, escalated, etc.); visually distinct.
- mhos-specialist-reasoning: Renders reasoning; contextual, expandable.
- mhos-specialist-handoff: Renders workflow handoff; subtle transition.
- mhos-specialist-escalation: Renders escalation; visually prioritized.
- mhos-specialist-thread: Renders collaboration chain; not chat.
- mhos-workforce-flow: Renders workflow chain; fluid, connected.
- mhos-workforce-chain: Renders operational sequence; step-based.
- mhos-workforce-focus: Renders focus cues; highlights, expansions.
- Ownership: Each primitive is owned by the workforce surface, no legacy selector reuse.
- Rendering rules: No duplication, no overlap, clear hierarchy.
- Spacing: Tight, executive, no card/block heaviness.
- Density: High information, low noise.
- Responsive: All primitives adapt to device and context.
- Anti-duplication: No duplicate primitives in the same context.

## 15. Anti-Pattern Protection
- Forbidden: Avatar grids, chatbot feeds, equal-weight AI cards, floating assistants, blinking notifications, noisy AI chatter, consumer-social patterns, Slack/Discord clones, CRM-user layouts, card dashboards, profile galleries, activity feeds, BPMN diagrams, flowchart overload, notification timelines.

## 16. Final Visual Success Definition
- The workforce feels alive, coordinated, intelligent, operational, enterprise-grade, AI-native, trustworthy, and calm under pressure.
- User instantly understands workflow, ownership, escalation, and reasoning.
- No card/dashboard/CRM/chatbot/consumer-social feeling remains.
- The environment is a living operational AI room, not a collection of widgets or profiles.

## 17. Workforce Spatial Psychology

The workforce room must use spatial psychology to communicate operational meaning.

Examples:
- Active workflows occupy more visual gravity.
- Escalations subtly compress surrounding space.
- Stable operations feel spatially calm and balanced.
- Blocked operations create visible tension without visual chaos.
- Workflow continuity creates directional movement through layout spacing.

Spatial behavior should subconsciously guide:
- attention
- urgency
- ownership
- execution continuity
- operational stability

The environment should feel:
- intelligently balanced
- operationally intentional
- psychologically calm under pressure

## 18. Workforce Silence Philosophy

The workforce must intentionally preserve silence during operational stability.

Silence is important for:
- reducing cognitive fatigue
- preserving executive focus
- maintaining operational calm
- preventing AI noise accumulation

The workforce should communicate only when:
- execution changes
- escalation occurs
- approvals are required
- workflow ownership changes
- operational continuity is threatened

Silence should feel:
- intelligent
- confident
- controlled
- trustworthy

NOT:
- inactive
- disconnected
- absent

## 19. Executive Presence System

The workforce room must preserve executive presence at all times.

Executive presence means:
- operational clarity
- calm authority
- intelligent restraint
- workflow visibility
- escalation predictability
- strategic confidence

The environment should feel:
- premium
- controlled
- trustworthy
- high-level
- enterprise-native

The user should feel:
- informed without overload
- guided without pressure
- operationally empowered
- strategically aware
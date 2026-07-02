# Final Frontend Master Vision and Completion Plan

## Product identity

MH Assistant Control Center is an AI Business Operating System.

It must not feel like:
- a dashboard
- an admin panel
- a media manager
- a simple AI chat tool
- a collection of separate pages

It must feel like one intelligent operating system that understands the project, shows the current state, recommends the next action, routes work to the right AI specialist, and helps the user execute.

---

## Final UX promise

The user should feel:

"This system understands my project, knows what is missing, tells me what to do next, gives me the right AI specialist, and helps me execute professionally."

---

## Final UX principle

Every page must answer five questions immediately:

1. What is the current status?
2. What is the highest-impact next action?
3. Which AI specialist owns this area?
4. What tools/actions are available now?
5. Where does the output go next?

---

## International-level frontend principles

### 1. Clarity before complexity
The interface must not show everything at once. It should reveal detail progressively.

Required pattern:
- Summary first
- Key action second
- Details behind tabs, drawers, sections, or expandable panels

### 2. One primary action per screen
Every page should have one obvious primary action.

Examples:
- Home: Review next best action
- Setup: Complete missing project profile
- Library: Upload or approve source-of-truth assets
- Integrations: Connect or fix the most important connector
- AI Command: Ask the right specialist
- Workflows: Run the recommended workflow
- Publishing: Approve or schedule the next package

### 3. AI-native, not AI-decorated
AI must not be only a chat button.

Each page should show:
- relevant AI specialist
- recommended action
- reason
- confidence or evidence where available
- direct button to ask / execute / route

### 4. Trust and governance by design
The user must always know:
- what is approved
- what is pending
- what is risky
- what needs human review
- what AI can suggest but not execute automatically

### 5. Performance-first experience
No page should feel slow because of unnecessary rendering.

Required:
- no heavy loader on first render
- no repeated global listeners
- no unsafe Auto Mode inside render
- no unnecessary rerender loops
- large pages should load data progressively

### 6. Empty states must be useful
Never show only "No data".

Every empty state should explain:
- what is missing
- why it matters
- what the user should do next
- which AI specialist can help

### 7. Mobile and tablet are first-class
Each page must be usable on:
- desktop
- tablet
- mobile

The mobile experience should focus on:
- status
- next action
- AI action
- primary tool

### 8. One visual language
The system must share:
- consistent spacing
- consistent typography
- consistent cards
- consistent action buttons
- consistent AI specialist components
- consistent status badges
- consistent empty states

---

## Final page structure

Each major page should follow:

1. Context Header
2. Status Summary
3. Next Best Action
4. Main Workspace
5. Action Panel
6. AI Specialist Panel
7. Recent Activity / Output / Next Step

---

## Global shell vision

The final shell should support:

### Smart Header
Shows:
- current project
- readiness / health
- active campaign or active workflow
- pending approvals
- global command entry
- AI system status

### Smart Sidebar
Groups pages by operating purpose:

Command:
- Home
- AI Command

Foundation:
- Setup
- Library
- Integrations
- Settings

Operations:
- Workflows
- Campaign Studio
- Content Studio
- Media Studio
- Publishing
- Ads Manager

Intelligence:
- Insights
- Research

Control:
- Governance
- Task Center
- Queue Center
- Job Monitor
- Notifications

### AI Dock / Command Layer
The AI layer should be contextual, not generic.

It should know:
- current page
- current project
- selected campaign / asset / workflow where available
- recommended specialist
- suggested prompt

---

## Final AI team operating model

### Strategist
Owns:
- campaign planning
- positioning
- next best action
- market direction

Pages:
- Home
- Campaign Studio
- Research
- Insights

Tools:
- campaign planner
- positioning audit
- launch readiness review
- strategy handoff

### Content Writer
Owns:
- captions
- product copy
- email copy
- scripts
- landing text

Pages:
- Content Studio
- AI Command
- Campaign Studio

Tools:
- rewrite
- translate
- improve
- generate platform copy
- save to library
- send to media

### Media Director
Owns:
- images
- video briefs
- prompts
- creative assets
- visual quality

Pages:
- Media Studio
- Library
- Campaign Studio

Tools:
- image prompt builder
- video brief builder
- brand safety check
- source asset selector
- send to publishing

### Publisher
Owns:
- publishing queue
- packages
- schedules
- retries
- manual handoff

Pages:
- Publishing
- Operations Centers
- Governance

Tools:
- schedule
- approve package
- retry failed job
- prepare manual publish
- send to queue

### Ads Optimizer
Owns:
- paid growth
- ad packages
- creative testing
- spend efficiency

Pages:
- Ads Manager
- Campaign Studio
- Insights

Tools:
- ad brief builder
- creative variant suggestions
- ROAS review
- campaign package builder

### SEO Analyst
Owns:
- keywords
- website performance
- organic visibility
- search opportunities

Pages:
- Insights
- Research
- Content Studio

Tools:
- keyword plan
- SEO content suggestions
- weak page review
- organic growth plan

### Operations Lead
Owns:
- tasks
- queues
- workflows
- handoffs
- job monitoring

Pages:
- Workflows
- Task Center
- Queue Center
- Job Monitor
- Notifications

Tools:
- workflow run
- task creation
- queue review
- handoff routing
- failure diagnosis

### Compliance Reviewer
Owns:
- claims
- risk
- approvals
- governance rules
- publishing safety

Pages:
- Governance
- Publishing
- Content Studio
- Media Studio

Tools:
- claim review
- approval decision
- risk flags
- policy review
- publish guardrails

---

## Work Journey Pipeline

The system should guide the user through one unified journey:

Idea
→ Plan
→ Create
→ Review
→ Approve
→ Publish
→ Promote
→ Measure
→ Learn

Mapped pages:

- Idea: AI Command / Research
- Plan: Home / Campaign Studio
- Create: Content Studio / Media Studio
- Review: Governance / Library
- Approve: Governance / Publishing
- Publish: Publishing
- Promote: Ads Manager
- Measure: Insights
- Learn: AI Command / Insights

Every page should show where the user is in this journey.

---

## Page completion standard

A page is complete only when it has:

- clear purpose within 5 seconds
- real system data
- no misleading placeholder state
- clear primary action
- contextual AI action
- visible responsible AI specialist
- professional spacing and hierarchy
- no unsafe Auto Mode in render
- no uncontrolled global listener
- no unnecessary rerender loop
- no duplicated UI/business logic
- useful empty state
- useful error state
- mobile/tablet usable layout
- clear next destination

---

## Current status

### Completed or close to final

- Home: improved, extracted render sections, AI Operating Home direction established
- Setup: improved with guidance, save context, info hints
- Library: improved with professional workspace layout and safer listener initialization
- Integrations: strongly modularized into builders, cards, drawer, layout, render, state, utils, diagnostics

### Needs final UX and safety pass

- AI Command: powerful, but needs final AI Team operating model and safe intelligence loading validation
- Workflows: high risk because Auto Mode, runAutomationPlan, and global workflow submit listener still exist
- Publishing: high risk because Auto Mode and startAutoMode still exist
- Campaign Studio: functional but large; needs hierarchy and AI routing polish
- Content Studio: powerful but rerender-heavy
- Media Studio: largest page; powerful but rerender-heavy
- Insights: needs stronger learning/recommendation visibility
- Research: needs clearer research-to-campaign workflow
- Governance: needs clearer policy, approval, and risk UX
- Settings: needs clearer system configuration workspace
- Operations Centers: strong foundation; needs polish and better cross-links

---

## Current known architectural risks

1. app.js owns too many startup and shell responsibilities.
2. Topbar, command bar, AI dock, and overlays still have historical layering.
3. Workflows and Publishing still contain Auto Mode runtime.
4. Media Studio and Content Studio trigger many rerenders.
5. Some deep scan files are currently untracked and should be reviewed before committing or deleting.
6. Authenticated endpoint timing has not been completed because the curl test did not extract the access key.
7. Legacy CSS files contain old versions of page and shell styles and must remain archived, not reactivated.
8. Empty actions.js, events.js, and index.js inside integrations should be handled later only when runtime extraction is ready.

---

## Do not repeat

Do not redo these from scratch:

- Home blueprint
- Startup runtime map
- Command runtime architecture
- Topbar classification
- Integrations modularization
- Library runtime safety audit
- Media Studio runtime audit
- AI Command runtime audit
- Frontend CSS deep scan

Use these audits as source-of-truth inputs.

---

## Execution order

### Phase 0: Governance of the frontend work
1. Decide whether to keep or delete untracked deep-scan artifacts.
2. Commit this final master vision.
3. Use this file as the frontend source of truth.

### Phase 1: Verify completed foundation pages
4. Final browser verification: Home
5. Final browser verification: Setup
6. Final browser verification: Library
7. Final Integrations UX check

### Phase 2: AI operating system experience
8. AI Command final AI Team UX pass
9. Add contextual AI specialist pattern to each major page
10. Standardize empty states and next actions

### Phase 3: Safety isolation
11. Workflows Auto Mode safety isolation
12. Publishing Auto Mode safety isolation
13. Ensure no automation starts automatically from render

### Phase 4: Production workspaces
14. Campaign Studio UX polish
15. Content Studio rerender and UX pass
16. Media Studio staged rerender and UX pass
17. Ads Manager growth workflow polish

### Phase 5: Intelligence and control
18. Insights / Research intelligence visibility polish
19. Governance / Settings clarity polish
20. Operations Centers polish

### Phase 6: Global shell consolidation
21. Topbar final consolidation
22. Command runtime final extraction plan execution
23. AI Dock contextual behavior
24. Sidebar grouping polish
25. Mobile/tablet polish

### Phase 7: Final readiness
26. Performance pass
27. Placeholder audit
28. Duplicate code audit
29. API call audit
30. Final browser test
31. Release readiness checkpoint

---

## Final completion target

The frontend is considered 100% ready only when:

- Every page has a clear AI-native operating purpose
- The user can move from idea to plan to content to media to approval to publishing to ads to insights
- AI specialists are visible and contextual
- No risky automation runs automatically on page render
- No page feels duplicated or disconnected
- Startup is stable
- Mobile layout is usable
- The system feels like one product, not many separate tools
- The product communicates power without overwhelming the user
- The design feels international, premium, and operationally trustworthy


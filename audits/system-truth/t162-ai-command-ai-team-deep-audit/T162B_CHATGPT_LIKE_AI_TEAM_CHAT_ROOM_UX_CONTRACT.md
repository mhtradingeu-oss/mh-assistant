# T162B — ChatGPT-like AI Team Chat Room UX Contract

## Status
Contract document. No implementation.

## Baseline
- `8de623a Wire Governance CSS owner file`

## Purpose
Define the ideal AI Command user experience for a powerful, smart, professional AI Team.

The goal is to make AI Command feel like a natural ChatGPT-style workspace where the user can speak with each specialist as if working with a real team, while still preserving safe workflow boundaries, Governance, and backend-owned execution controls.

## Product Vision
AI Command should become the central AI Business Operating Room.

It should not feel like:
- a static prompt list
- a disconnected tool drawer
- a page full of buttons
- a generic chatbot without workflow

It should feel like:
- one intelligent AI workspace
- multiple specialist chat rooms
- a real team conversation
- clear next actions
- safe handoff to the right workspace
- source-aware and context-aware guidance
- review-first workflow
- no unsafe direct execution

## Core Interface Model

### 1. Unified AI Workspace
The user should enter one main AI workspace and immediately understand:
- which project is active
- which specialist is selected
- what the team can help with
- what context is available
- what the next safest action is

### 2. Specialist Chat Rooms
Each specialist should feel like a real role-based room.

Required behavior:
- user can select a specialist
- selected specialist has role identity
- selected specialist has avatar/initials or visual identity
- selected specialist has clear capabilities
- selected specialist has clear safety boundaries
- selected specialist has suggested prompts
- selected specialist can continue the conversation context
- selected specialist can propose next actions

### 3. Full Team Mode
The user should also be able to ask the full team.

Full Team mode should:
- coordinate multiple specialists
- show who contributes what
- produce a combined recommendation
- identify sequence of work
- route next steps to the right owner
- separate strategy, content, media, compliance, publishing, operations, customer, and sales input

Example:
- Strategist defines the plan
- Writer drafts copy
- Media/Video defines assets
- Compliance checks claims
- Publisher prepares publishing package
- Operations converts to tasks/workflow
- Customer Ops / Sales CRM join when customer or lead impact exists

### 4. Natural Conversation
The chat should feel human and continuous.

Required behavior:
- user asks naturally
- AI responds conversationally
- AI asks clarifying questions when needed
- AI remembers current session context
- AI can summarize what has been decided
- AI can convert conversation into structured output
- AI can explain why a handoff or approval is needed

### 5. ChatGPT-like Composer
The composer should be simple and clear.

Required elements:
- message input
- selected specialist indicator
- send/ask button
- optional prompt chips
- optional source/context selector
- optional destination selector
- clear status when AI is thinking/generating
- clear safety note for non-execution

The composer should not be crowded with technical controls.

### 6. Conversation Output
Responses should be structured but natural.

Each AI response should support:
- direct answer
- reasoning summary
- recommended next action
- output preview
- handoff destination
- risk note
- source/evidence note
- follow-up question when needed

### 7. Output Tabs
AI Command should clearly separate output types:

- Chat Answer
- Draft
- Task Plan
- Workflow Draft
- Handoff Preview
- Governance Package
- Publishing Package
- Customer Reply Draft
- CRM/Sales Draft
- Library Source Context

This separation prevents confusion between advice, draft, and execution.

## Specialist Role Contract

Every specialist must have:

- id
- label
- position
- role summary
- canHelp
- cannotDo
- destinations
- safetyNote
- suggested prompt chips
- output types
- default handoff route
- required source types, if applicable

## Required Specialist Groups

### Core Command Team
- Business Strategist
- Project Manager
- Operations Lead
- Governance / Compliance Reviewer

### Marketing Growth Team
- Campaign Strategist
- Content Writer
- Brand Manager
- Ads Optimizer
- SEO & Insights Analyst

### Creative Production Team
- Creative Director
- Media Designer
- Video Producer
- Publisher

### Customer Revenue Team
- Customer Operations Lead
- Sales / CRM Lead
- E-commerce Manager

### Intelligence + Systems Team
- Research Analyst
- Data / Performance Analyst
- Integration Specialist
- Knowledge / Library Curator
- QA / Release Reviewer

## Current Role Mapping Decision
Existing roles should not be deleted.

Existing roles should be upgraded gradually:
- keep current specialists
- add missing critical specialists in planned phases
- avoid duplicate roles
- merge overlapping roles only after audit

## Human-like Workflow Contract
AI Team should behave like a real working team:

1. Understand request
2. Ask clarifying question if needed
3. Identify best specialist or team chain
4. Produce recommendation or draft
5. Identify missing source/evidence
6. Suggest next action
7. Prepare handoff
8. Request Governance review if risk exists
9. Never claim execution happened unless backend confirms it

## Safety Contract

AI Command must clearly separate:

### Advice
Text-only guidance.

### Draft
Reviewable content that is not published or sent.

### Handoff
A package prepared for another workspace.

### Approval Request
A Governance-bound package requiring review.

### Execution
Backend-owned and confirmation-gated action.

AI Command must not:
- publish directly
- send customer replies directly
- send sales outreach directly
- mutate CRM records directly
- run workflows without confirmation
- approve Governance decisions
- override Governance gates
- execute providers without backend confirmation
- invent unsupported claims
- hide missing evidence

## Governance Integration Contract
AI Command should integrate with Governance by preparing:
- approval packages
- claim review notes
- evidence checklists
- publishing readiness summaries
- override risk summaries
- unresolved issue lists

AI Command must not:
- approve
- reject
- override
- modify policy
- bypass approval gates

## Tool Dock Contract
The Tool Dock should remain preparation-first.

It should help the user choose:
- tool
- output type
- source context
- destination handoff
- language
- tone

It must continue to state that it does not:
- publish
- send
- save
- route externally
- create CRM records
- run workflows
- mutate backend data

## Source and Knowledge Contract
AI Team should prefer grounded outputs.

Source priority:
1. selected Library source
2. project source of truth
3. brand profile
4. product data
5. legal/pricing docs
6. research/proof docs
7. current chat
8. manual input

If evidence is missing, the AI should say what is missing and propose how to collect it.

## Interface Requirements
The final interface should include:

- left/team selector
- main chat room
- specialist identity header
- context/source strip
- output preview panel
- destination handoff panel
- safety/governance status
- next best action
- suggested prompt chips
- tool dock drawer
- recent session/draft restore
- clear empty state

## Pending / Future Features
These should remain planned until provider/backend support is ready:
- voice input
- real-time voice chat
- live external publishing
- direct customer send
- direct CRM mutation
- direct workflow run from AI Command
- automatic provider execution

## Browser QA Requirements
Before any implementation patch:
- AI Command route loads
- specialist selector visible
- selected specialist visible
- chat composer visible
- prompt chips visible
- Tool Dock visible
- source/destination handoff visible
- output preview visible
- safety boundaries visible
- no direct publish/send/CRM/workflow execution appears
- Governance handoff visible where relevant

## Decision
The final AI Command should be built as a ChatGPT-like AI Team workspace, not as a static command page.

Next phase:
- `T162C — AI Command Runtime Authority + Execution Boundary Map`

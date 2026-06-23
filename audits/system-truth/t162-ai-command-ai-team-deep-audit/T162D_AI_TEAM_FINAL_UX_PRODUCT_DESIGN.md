# T162D — AI Team Final UX Product Design

## Status
Product design specification. No implementation.

## Baseline
- `8de623a Wire Governance CSS owner file`

## Purpose
Collect the final product vision for the AI Team experience before implementation.

The goal is to upgrade AI Command into a powerful, smart, human-like AI Team workspace where the user can communicate naturally with each specialist and with the full team.

## Final Product Vision
AI Command should become:

- a ChatGPT-like AI workspace
- a multi-specialist AI Team room
- a real business operating room
- a workflow preparation center
- a governance-aware decision support system
- a safe handoff layer to other workspaces

It should not be:
- a static prompt list
- a disconnected tool drawer
- a simple chatbot
- an unsafe execution surface

## Final UX Layout

### Top Bar
Must show:
- active project
- active AI mode
- selected specialist or team mode
- risk level
- governance state
- source grounding status
- execution lock state

### Left Panel — AI Team Directory
Must show:
- specialist list
- active specialist
- specialist status
- role summary
- current task or last action
- team groups

Recommended groups:
- Core Command Team
- Marketing Growth Team
- Creative Production Team
- Customer Revenue Team
- Intelligence + Systems Team

### Center Panel — Chat Workspace
Must feel like a real conversation.

Must support:
- user messages
- specialist responses
- full team responses
- router/system messages
- handoff messages
- governance notes
- follow-up questions
- session continuation

### Right Panel — Output + Context
Must show:
- draft cards
- strategy cards
- task cards
- workflow cards
- handoff packages
- governance packages
- source/evidence notes
- destination route
- next best action

### Bottom Composer
Must include:
- simple message input
- selected specialist indicator
- ask/send button
- prompt chips
- source/context selector
- destination selector if needed
- safe status text
- no crowded technical controls

## Specialist Chat Room UX
Each specialist should feel like a real working room.

Every specialist needs:
- role identity
- avatar/initials
- position
- what they can help with
- what they cannot do
- suggested prompts
- default output types
- default handoff route
- safety note

The user should be able to:
- chat with one specialist
- switch specialist
- ask the full team
- request handoff
- request output format
- continue previous context

## Full Team Mode
Full Team Mode should coordinate specialists.

Example chain:
- Business Strategist defines business direction.
- Campaign Strategist creates campaign plan.
- Content Writer drafts copy.
- Media Designer prepares creative direction.
- Video Producer prepares video direction.
- Ads Optimizer prepares paid media angle.
- Compliance Reviewer checks risk.
- Publisher prepares publishing package.
- Operations Lead turns it into tasks/workflow.
- Governance receives approval package when needed.

## Human-like Workflow Behavior
The AI Team should behave like a real team:

1. Understand the request.
2. Scan context.
3. Identify missing information.
4. Choose the best specialist or team.
5. Ask clarifying questions if needed.
6. Produce a useful answer or draft.
7. Prepare structured output.
8. Suggest next action.
9. Prepare handoff.
10. Trigger Governance review when risk exists.
11. Never claim execution happened unless backend confirms it.

## Output System
AI Team outputs must be structured into clear types:

- Chat Answer
- Draft
- Campaign Plan
- Content Pack
- Media Brief
- Video Script
- Ads Plan
- SEO / Insights Report
- Customer Reply Draft
- CRM / Sales Draft
- Task Plan
- Workflow Draft
- Handoff Package
- Governance Approval Package
- Library Source Context

## Safety and Governance UX
The interface must always show the difference between:

- advice
- draft
- preview
- handoff
- approval request
- execution

AI Command must not:
- publish directly
- send customer messages directly
- send sales outreach directly
- mutate CRM records directly
- run workflows directly
- approve Governance decisions
- override Governance gates
- execute providers directly
- hide missing evidence

## Required Smart Features
The final AI Team should support:

- automatic specialist selection
- manual specialist switching
- full team mode
- source-aware answers
- Library grounding
- project context awareness
- role-specific prompts
- output type selection
- destination handoff
- governance package preparation
- missing evidence detection
- next best action recommendation
- session/draft restore
- clear empty states

## Missing Critical Specialists To Add Gradually

### MVP-critical
- Business Strategist
- Project Manager
- Brand Manager
- Product / E-commerce Manager
- Research Analyst
- Data / Performance Analyst
- Finance / Pricing Advisor
- Integration Specialist
- QA / Release Reviewer
- Knowledge / Library Curator

### Future-phase
- HR / Hiring Advisor
- Legal Operations Reviewer
- Procurement / Vendor Manager
- Localization / Translation Specialist
- Community Manager
- Partnership Manager
- Automation Engineer
- Prompt / AI Workflow Engineer

## Product Decision
The AI Team must be designed as a professional AI Business Operating System, not as a simple chatbot.

Implementation must proceed in small audited phases.

# AI Team Vision and Routing Contract

## Purpose

This document defines the final AI Team operating vision for MH Assistant / MH-OS.

It is the governing contract before further UI, UX, tools, drawer, routing, or specialist updates.

## Final Product Vision

MH Assistant is not a normal dashboard and not a simple chatbot.

It is an AI Business Operating System where a professional AI Team helps the user:

- understand project context
- plan campaigns
- create content
- prepare media work
- review risks
- create task handoffs
- prepare workflows
- route outputs to owning workspaces
- keep execution safe and review-only until approved by humans

## Core Safety Rule

AI Command does not execute durable business actions.

AI Command may:

- prepare
- review
- suggest
- draft
- summarize
- classify
- route context

AI Command must not automatically:

- create durable tasks
- run workflows
- publish content
- approve governance decisions
- mutate CRM/customer records
- send customer replies
- execute backend operations

Execution belongs to the owning workspace after explicit review and confirmation.

## AI Team Modes

### Solo Specialist Mode

Used when the user knows the type of help needed.

Examples:

- Content Writer for content drafts.
- Operations Lead for task plans and handoffs.
- Media Director for creative direction.
- Publisher for publishing packages.
- Compliance Reviewer for risk review.

### Full Team Mode

Used when the user request is broad, strategic, cross-functional, or unclear.

Full Team produces a coordinated plan or review-ready output.

Full Team does not always route to Workflows.

Routing depends on the detected output type:

- task-like output -> Task Center
- workflow/process-like output -> Workflows
- content-like output -> Content Studio
- media-like output -> Media Studio
- publishing-like output -> Publishing
- campaign-level output -> Campaign Studio or Workflows
- governance/risk output -> Governance
- research/insight output -> Research or Insights

## Specialist Ownership Matrix

### Strategist

Purpose:
- positioning
- campaign direction
- launch strategy
- business planning
- next best action

Primary outputs:
- strategic brief
- campaign brief
- positioning plan
- launch plan

Primary destinations:
- Campaign Studio
- Workflows
- AI Command follow-up

### Content Writer

Purpose:
- captions
- posts
- emails
- blogs
- product copy
- ad copy
- messaging drafts

Primary outputs:
- content draft
- message variants
- CTA flow
- editorial draft

Primary destinations:
- Content Studio
- Publishing when ready

### Media Director

Purpose:
- visual direction
- creative brief
- asset planning
- campaign visuals

Primary outputs:
- media brief
- visual concept
- asset request
- creative direction

Primary destinations:
- Media Studio
- Library
- Publishing when ready

### Video Lead

Purpose:
- reel concepts
- video scripts
- shot lists
- production guidance

Primary outputs:
- reel script
- video concept
- production checklist

Primary destinations:
- Media Studio
- Content Studio

### Publisher

Purpose:
- publishing readiness
- scheduling
- channel payloads
- final review before publishing

Primary outputs:
- publishing package
- channel-ready payload
- publishing checklist

Primary destinations:
- Publishing
- Governance when approval is required

### Ads Optimizer

Purpose:
- paid growth
- ad angles
- campaign performance
- channel targeting

Primary outputs:
- ad plan
- ad copy direction
- audience ideas
- optimization notes

Primary destinations:
- Ads Manager
- Campaign Studio
- Insights

### SEO & Insights Analyst

Purpose:
- search signals
- SEO readiness
- content optimization
- performance insights

Primary outputs:
- SEO checklist
- keyword guidance
- insight summary
- improvement recommendations

Primary destinations:
- Insights
- Content Studio
- Research

### Compliance Reviewer

Purpose:
- safety review
- claim review
- approval risks
- governance readiness

Primary outputs:
- compliance notes
- risk flags
- approval checklist

Primary destinations:
- Governance
- Publishing
- Content Studio review

### Operations Lead

Purpose:
- execution planning
- task handoff
- workflow handoff
- owners, priorities, blockers

Primary outputs:
- task plan
- handoff summary
- workflow draft
- execution checklist

Primary destinations:
- Task Center for task-like outputs
- Workflows for process-like outputs
- Queue Center / Job Monitor where applicable

### Customer Operations Lead

Purpose:
- inbox/customer operations
- customer follow-up plans
- SLA/escalation guidance

Primary outputs:
- customer ops task plan
- follow-up plan
- support handoff

Primary destinations:
- Task Center
- Operations Centers
- Notifications where applicable

### Sales / CRM Lead

Purpose:
- lead follow-up
- CRM planning
- revenue operations
- sales messaging

Primary outputs:
- sales task plan
- CRM follow-up draft
- lead sequence

Primary destinations:
- CRM/Sales surface when available
- Task Center
- Content Studio for sales copy

### Planned Specialists

Admin / Governance:
- policies, approvals, roles, audit control

Researcher:
- market, competitor, source-backed research

Automation Architect:
- workflow blueprints and trigger maps

These specialists should remain visibly planned until connected to actual reliable tools/data.

## Output Type Taxonomy

### Guidance

Advice, explanation, next best action.

Default route:
- stays in AI Command unless user routes manually

### Content Draft

Captions, posts, emails, blogs, copy, scripts.

Default route:
- Content Studio

### Media Brief

Visual direction, video concepts, image prompts, shot lists.

Default route:
- Media Studio

### Campaign Plan

Objective, audience, offer, channels, phases, risks.

Default route:
- Campaign Studio for campaign brief
- Workflows for operating sequence

### Task Plan

Owners, priorities, due dates, blockers, follow-ups, checklists.

Default route:
- Task Center

### Workflow Package

Steps, phases, approvals, sequence, automation plan.

Default route:
- Workflows

### Publishing Package

Channel-ready payload, schedule, final approval checklist.

Default route:
- Publishing

### Governance Review

Risk, claims, permissions, approval need.

Default route:
- Governance

### Research / Insight

Competitor research, market signal, SEO or analytics insight.

Default route:
- Research or Insights

## Routing Decision Tree

1. If the user asks for tasks, owners, priorities, due dates, follow-up, checklist, or backlog:
   route to Task Center.

2. If the user asks for workflow, process, sequence, phases, approvals, automation, or operating loop:
   route to Workflows.

3. If the user asks for captions, emails, blogs, product copy, scripts, or written content:
   route to Content Studio.

4. If the user asks for visuals, video, creative direction, media assets, or production:
   route to Media Studio.

5. If the user asks for publishing, scheduling, channel payloads, or final post package:
   route to Publishing.

6. If the user asks for campaign objective, audience, offer, positioning, or launch strategy:
   route to Campaign Studio or Workflows depending on whether output is brief or operating plan.

7. If the user asks for risk, claims, approvals, privacy, legal/compliance:
   route to Governance.

8. If the user asks for market, competitors, SEO signals, or analytics:
   route to Research or Insights.

9. If unclear:
   keep the result in AI Command and recommend the next best destination instead of guessing.

## Tools and Drawer UX Contract

Tools should not appear as a flat confusing list.

Tools should be grouped as:

### Recommended next action

The single best action for the current output.

Examples:
- Route to Task Center
- Route to Workflows
- Create Content Draft
- Use in Composer
- Prepare Handoff

### Primary tools

Tools that match the selected specialist and output type.

### Secondary tools

Rewrite, translate, improve, check, copy, export.

### Needs source tools

Tools that require Library/source input.

These must show a clear inline state:
- Needs source
- Choose from Library
- Change source type

Avoid repeated toast messages when the state is already visible in the tool card.

### Advanced tools

Hidden or lower priority unless needed.

## Handoff Contract

Every route should carry:

- source_page
- destination_page
- project
- output_type
- title
- summary
- payload
- created_at
- review_status
- safety_note

All handoffs are review-only unless the owning workspace explicitly confirms durable action.

## Page Ownership Contract

### AI Command

Owns:
- chat
- specialist selection
- output preparation
- preview
- routing decision
- shared handoff dispatch

Does not own:
- durable task creation
- workflow execution
- publishing
- CRM mutation
- approval execution

### Task Center

Owns:
- durable tasks
- owners
- priorities
- due dates
- task review
- task handoff intake

### Workflows

Owns:
- operating sequences
- workflow packages
- process reviews
- automation preparation
- workflow continuity

### Content Studio

Owns:
- content drafts
- content improvement
- content records
- content-to-media/publishing handoff

### Media Studio

Owns:
- creative briefs
- media jobs
- visual/video assets
- asset handoffs

### Publishing

Owns:
- final publishing package
- scheduling
- channel payload review
- publishing readiness

### Campaign Studio

Owns:
- campaign brief
- campaign objective
- audience
- offer
- channel plan

### Governance

Owns:
- policy
- approval
- compliance
- claims review
- authority gates

### Research / Insights

Own:
- evidence
- competitor analysis
- SEO/performance signals
- recommendations

## Required User Scenarios

### Scenario 1: I do not know what to do next

Expected:
- Full Team or Strategist response
- diagnosis
- next best action
- safe suggested route

### Scenario 2: Create a campaign plan

Expected:
- Full Team or Strategist
- campaign plan
- route to Workflows or Campaign Studio based on output type

### Scenario 3: Turn this into tasks

Expected:
- Operations Lead
- task plan
- route to Task Center
- review-only intake

### Scenario 4: Write content

Expected:
- Content Writer
- content draft
- route to Content Studio

### Scenario 5: Create visual/video direction

Expected:
- Media Director or Video Lead
- media brief
- route to Media Studio

### Scenario 6: Review claims or risk

Expected:
- Compliance Reviewer
- risk notes
- route to Governance or Publishing review

### Scenario 7: Prepare publishing

Expected:
- Publisher
- publishing package
- route to Publishing

### Scenario 8: Research competitors or market

Expected:
- Researcher or SEO & Insights
- research/insight brief
- route to Research or Insights

## Final UX Requirements

The user must always understand:

- who is working
- what the specialist can do
- where to type
- what the output means
- what the next best action is
- where the result will go
- whether action is review-only or executable
- what requires a source
- what requires approval

## Known Gaps To Audit Before Implementation

- Full Team should not always default to Workflows.
- Tools drawer may need recommended/primary/secondary/source-required grouping.
- Some source-required tools currently rely on toast messaging.
- Home-to-AI handoff is still prompt-based and should later become structured.
- Planned specialists need a clear future connection model.
- Per-specialist tool visibility in roster could be stronger.
- Output type classification should be tested across all scenarios.
- Each destination page must visibly receive and explain incoming handoff context.

## Implementation Principle

Do not implement broad refactors.

Use phased improvements:

1. Audit current code against this contract.
2. Patch route classification only if mismatches are proven.
3. Patch tools drawer grouping only if browser QA shows confusion.
4. Patch labels/copy before layout rewrites.
5. Keep all execution review-only until owning workspace confirms action.

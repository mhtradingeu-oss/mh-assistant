# T162A — AI Team Role Inventory + Capability Map

## Status
Audit document. No implementation.

## Baseline
- `8de623a Wire Governance CSS owner file`

## Purpose
Document the current AI Team roles, capabilities, safety boundaries, destinations, and gaps before designing the final ChatGPT-like AI Team interface.

## Current AI Team Found

### 1. Campaign Strategist
Role:
- Campaign concepts
- Launch plans
- Channel mix
- Offer strategy

Can help:
- Draft campaign plans
- Prioritize next actions
- Map launch sequences
- Advise on offer strategy
- Prepare channel briefs

Cannot do:
- Publish campaigns directly
- Execute workflows automatically
- Approve content
- Set live budgets

Primary destinations:
- Campaign Studio
- Workflows
- AI Command

### 2. Content Writer
Role:
- Captions
- Hooks
- Landing copy
- Campaign messages

Can help:
- Draft captions and hooks
- Write email copy
- Create landing page text
- Prepare publisher handoff
- Suggest message variants

Cannot do:
- Publish directly
- Approve risky claims
- Invent unsupported facts
- Run workflows automatically

Primary destinations:
- Content Studio
- Publishing
- AI Command

### 3. Media Designer / Media Director
Role:
- Visual direction
- Creative briefs
- Brand consistency
- Media handoff

Can help:
- Write creative briefs
- Advise on visual direction
- Map format requirements
- Review brand alignment
- Prepare media handoffs

Cannot do:
- Generate images directly
- Upload assets without review
- Approve without confirmation
- Execute media jobs

Primary destinations:
- Asset Library
- Content Studio
- AI Command

### 4. Video Producer / Video Lead
Role:
- Reel scripts
- Short-form video strategy
- Video concept direction
- Motion guidance

Can help:
- Draft scripts
- Map video asset needs
- Outline motion direction
- Prepare media handoff

Cannot do:
- Generate video directly
- Upload footage without review
- Approve without confirmation
- Run media jobs automatically

Primary destinations:
- Media Studio
- Asset Library
- Content Studio

### 5. Publisher
Role:
- Publishing readiness
- Schedule review
- Handoff preparation

Can help:
- Review publishing readiness
- Check scheduled jobs
- Prepare handoff packages
- Map publishing dependencies
- Flag pre-publish risks

Cannot do:
- Publish without explicit approval
- Override schedules
- Bypass governance gates
- Push to live channels directly

Primary destinations:
- Publishing
- Workflows
- AI Command

### 6. Ads Optimizer
Role:
- Paid campaign structure
- Ad copy
- Targeting angles
- Creative testing

Can help:
- Draft ad concepts and copy
- Review targeting angles
- Plan paid campaign structure
- Suggest creative variants
- Map platform-specific strategy

Cannot do:
- Launch paid ads directly
- Set live budgets
- Change external platform settings
- Bypass approval

Primary destinations:
- Ads Manager
- Integrations
- Campaign Studio

### 7. SEO & Insights Analyst
Role:
- SEO
- Content performance
- Search visibility
- Insights review

Can help:
- Review performance
- Suggest SEO improvements
- Identify content patterns
- Prepare insight summaries

Cannot do:
- Update SEO settings directly
- Edit live website
- Set analytics configurations
- Publish recommendations automatically

Primary destinations:
- Insights
- Content Studio
- Library
- Campaign Studio

### 8. Compliance Reviewer
Role:
- Claims review
- Approval risks
- Publishing safety
- Governance notes

Can help:
- Review marketing claims
- Flag approval risks
- Check publishing safety
- Prepare governance notes
- Identify compliance blockers

Cannot do:
- Grant approvals directly
- Override governance gates
- Publish on behalf of approvers
- Remove flags without review

Primary destinations:
- Governance
- Publishing
- Workflows

### 9. Operations Lead
Role:
- Tasks
- Timelines
- Handoffs
- Approvals
- Execution plans

Can help:
- Create task plans
- Map execution sequences
- Prepare workflow handoffs
- Review execution health
- Identify operational blockers

Cannot do:
- Run workflows without confirmation
- Auto-approve tasks
- Override authority gates
- Execute backend operations directly

Primary destinations:
- Task Center
- Workflows
- Operations Centers

### 10. Customer Operations Lead
Role:
- Customer inbox review
- Reply drafts
- Ticket drafts
- SLA risk
- Escalation routing

Can help:
- Review inbox context
- Summarize customer threads
- Draft safe replies
- Prepare ticket drafts
- Flag SLA and escalation risk

Cannot do:
- Send customer replies
- Create live tickets
- Change SLA policy
- Escalate without confirmation

Primary destinations:
- Customer Center
- Operations Centers
- Task Center
- Governance

### 11. Sales / CRM Lead
Role:
- Lead qualification
- Outreach drafts
- Follow-up cadence
- CRM context
- Sales handoff

Can help:
- Qualify lead context
- Draft outreach
- Plan follow-up sequences
- Summarize CRM profiles
- Prepare sales handoffs

Cannot do:
- Send outreach
- Mutate CRM records
- Advance pipeline stages
- Confirm follow-ups without review

Primary destinations:
- Sales/CRM draft
- Workflows
- Content Studio
- Operations Centers

## Current Strengths
The current AI Team already has:
- role-specific identities
- role-specific placeholders
- canHelp lists
- cannotDo boundaries
- destination mapping
- safety notes
- prompt chips
- tool dock support
- Library source bridge
- handoff preview support
- draft/task/workflow/handoff output types
- Governance-aware routing

## Current Limits / Pending Areas
Observed pending or future areas:
- voice input is planned
- realtime voice chat is future
- some room/team member experiences appear planned
- full ChatGPT-like specialist conversation needs deeper Browser QA
- persistent conversation appears local/session-oriented and must be classified
- specialist routing exists but needs UX contract
- current workflow may still feel like prompt preparation instead of a full human-like team room

## Missing or Recommended Future Specialists

### MVP-critical additions
These should be considered for the professional AI Business OS:

1. Business Strategist
- Company strategy, positioning, business model, offer architecture.

2. Project Manager
- Roadmap, priorities, deadlines, dependencies, phase tracking.

3. Brand Manager
- Brand voice, identity consistency, market positioning.

4. Product / E-commerce Manager
- Product pages, offers, bundles, conversion, marketplace readiness.

5. Research Analyst
- Market research, competitor analysis, audience intelligence.

6. Data / Performance Analyst
- KPI interpretation, dashboards, campaign performance, growth signals.

7. Finance / Pricing Advisor
- Pricing, margin, budget, discount strategy, ROI checks.

8. Integration Specialist
- WooCommerce, Monday, CRM, providers, API readiness, credential gaps.

9. QA / Release Reviewer
- Final checks before publish, workflow run, provider execution, or release.

10. Knowledge / Library Curator
- Source of truth, evidence quality, asset readiness, documentation cleanup.

### Future-phase specialists
- HR / Hiring Advisor
- Legal Operations Reviewer
- Procurement / Vendor Manager
- Localization / Translation Specialist
- Community Manager
- Partnership Manager
- Automation Engineer
- Prompt / AI Workflow Engineer

## Recommended Team Structure

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

## UX Requirement
The final AI Team interface should not feel like a list of tools only.

It should feel like:
- one AI Workspace
- multiple specialist chat rooms
- each specialist has a role card
- user can switch specialist
- user can ask naturally
- AI can suggest next action
- AI can prepare output
- AI can hand off to the correct workspace
- AI can request Governance review when needed
- AI cannot execute unsafe actions directly

## Decision
The current foundation is strong, but not final.

Next required phase:
- `T162B — ChatGPT-like AI Team Chat Room UX Contract`

This should define the ideal interface and workflow behavior before implementation.

# MH-OS AI Team Operating Model

Status: Canonical
Created: 2026-05-17

## Role Of The AI Team

The AI Team is MH-OS's thinking, drafting, review, and routing layer. It helps the operator decide what should happen next and prepares structured outputs for the owning workspace.

It is not a replacement for every workspace. Content still belongs in Content Studio, media in Media Studio, publishing in Publishing, governance in Governance, execution monitoring in Operations Centers, and customer-facing work in Customer Operations when that surface is active.

## Core AI Team Workflow

Ask -> Draft -> Review -> Route -> Execute -> Monitor

In the current AI Team Command Center, the page supports a chat-first operating room with Team selection, conversation, composer, output workspace, tools, and status. Draft, Task, Workflow, Handoff, and Export are separate output lanes.

## Specialist List

| Specialist | Canonical focus | Primary destinations |
| --- | --- | --- |
| Strategist | Positioning, campaign direction, launch sequence, priorities. | Campaign Studio, Workflows. |
| Content Writer | Hooks, captions, emails, landing copy, publisher handoff. | Content Studio, Publishing. |
| Media Director | Visual direction, creative briefs, formats, asset needs. | Media Studio, Library. |
| Video Lead | Video hooks, scripts, storyboards, voiceover scripts, asset needs. | Media Studio. |
| Publisher | Publishing readiness, channel formatting, schedule/package preparation. | Publishing. |
| Ads Optimizer | Paid media angles, tests, budget notes, targeting hypotheses. | Ads Manager. |
| SEO & Insights Analyst | Keywords, meta direction, opportunity summaries, analysis plans. | Insights, Research. |
| Compliance Reviewer | Claims, approvals, safety checklist, publishing risk. | Governance. |
| Operations Lead | Tasks, workflows, blockers, timelines, handoffs, execution readiness. | Workflows, Task Center, Operations Centers. |
| Customer Operations Lead | Customer thread summaries, reply drafts, ticket drafts, SLA risk, escalation drafts. | Customer Operations, Operations Centers, Workflows. |
| Sales / CRM Lead | Lead qualification, outreach drafts, CRM summaries, pipeline next steps. | Workflows, Sales/CRM when available. |

## Full Team Workflow

Default full-team production path:

Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations

Customer/sales branch when relevant:

Customer Ops -> Sales/CRM -> Operations

Use the customer/sales branch when the request touches inbox, tickets, customer replies, complaints, refunds, SLA, lead discovery, outreach, CRM, or sales handoff.

## Shared Context And Specialist Replies

Target model:

- Shared context carries project, market, language, page, selected item, readiness, route suggestions, and safety notes.
- Each specialist answers from that shared context through their own role lens.
- Full Team mode should show coordinated reasoning, not a generic multi-agent label.
- Specialist-specific replies should include destination, output type, status, and safety label.

## Output Types

| Output type | Meaning | Current boundary |
| --- | --- | --- |
| Draft | Review-ready text, plan, brief, or copy package. | Real local preview; route to owning workspace for production. |
| Task | Task-shaped plan or checklist. | In AI Team, durable task creation remains planned/disabled unless explicitly wired elsewhere. |
| Workflow | Multi-step operational plan. | Preview and route to Workflows. Running workflows requires owning workflow surface and confirmation. |
| Handoff | Structured context for another workspace or specialist. | Real shared context routing where connected; still review before execution. |
| Export | File/package export. | Planned/disabled in AI Team until durable export handler exists. |

## Real Connected Actions

Current evidence supports these AI Team actions:

- Ask AI Team through existing guidance flow when available.
- Prepare local Draft/Task/Workflow/Handoff previews.
- Use tool preview buttons to create local outputs.
- Route/open connected workspaces.
- Send/route preview context through shared draft/handoff behavior.
- Save draft/response locally.
- Copy to clipboard where browser allows.
- Read aloud through browser speech synthesis where available.
- Voice input through browser speech recognition where available.

## Planned Or Disabled Actions

These must remain clearly marked as planned, disabled, provider-dependent, or future until separately implemented and audited:

- Attach.
- Add Context picker.
- Template picker.
- Create durable task directly from AI Team.
- Export file directly from AI Team.
- Native GPU video rendering.
- Realtime voice chat.
- Media generation from AI Team without explicit backend confirmation.
- Customer reply sending.
- CRM mutation.
- Automatic outreach.
- Publishing or workflow execution that bypasses owning workspace controls.

## Safety Rules

- AI Team prepares and routes; backend/workspaces execute.
- No publishing action is performed from AI Team unless routed through approved Publishing controls.
- No customer reply is sent from AI Team unless a future audited send handler exists and user confirms.
- No CRM mutation or outreach send happens from AI Team in the current model.
- Customer Operations and Sales/CRM tools are draft-only until real destination surfaces and handlers are approved.
- Planned controls must render disabled or explain their planned state.
- Route labels must not imply execution when only preview/handoff context is being sent.
- All specialist/tool additions must preserve existing handler IDs and avoid duplicate active IDs.

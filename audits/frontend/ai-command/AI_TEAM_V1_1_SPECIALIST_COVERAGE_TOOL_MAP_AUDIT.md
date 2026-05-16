# AI Team Command Center V1.1 Specialist Coverage and Tool Map Audit

Date: 2026-05-16
Branch: architecture/frontend-consolidation-v1
Scope:
- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`

## Executive Summary

The AI Team Command Center Final Room V1 is structurally stable and already communicates the main operating-room flow: choose Solo Specialist or Full Team, ask the team, review output, then route to the owning workspace. Core IDs and handlers are present, planned actions are visibly disabled, and the output workspace separates Draft, Task, Workflow, Handoff, and Export views.

The V1.1 improvement area is not layout. It is professional clarity. The room needs stronger specialist completeness, more explicit tool metadata, clearer next-action language, and better Full Team orchestration copy. The current implementation has strong role coverage, but several details still read as generic or internally staged:
- Specialist cards have name, role summary, and status, but no explicit position/title field.
- Tool cards show purpose and output type, but not the route destination or the real/planned state on each card.
- Customer Operations and Sales / CRM are safely draft-only, but their route labels and Full Team visibility can be clearer.
- Full Team mode currently emphasizes Strategy -> Writer -> Media -> Compliance -> Publisher -> Operations, but does not visibly include the optional Customer Ops -> Sales/CRM -> Operations branch.
- Legacy mode definitions still include `designer` while the operating-room specialist uses `media`; this can misroute older/keyword-classified sessions.

Recommended V1.1 patch: keep the layout, add specialist position metadata, improve specialist summaries for Customer Ops and Sales/CRM, make tool cards state destination and real/planned status, improve Full Team chain/prompt copy, normalize `designer` to `media`, and tighten planned-control helper text.

## Specialist-by-Specialist Review

### Strategist
- Coverage: Strong.
- Role clarity: Clear campaign and priority owner.
- Status: Present as `Ready`.
- Position: Implicit, not explicit.
- Tools: Campaign Angle Generator, Launch Plan, Funnel Mapping, Priority Sort.
- Route fit: Campaign task drafts route to Campaign Studio; guidance routes to Workflows. This is reasonable, although strategic guidance could also be useful in Campaign Studio.
- V1.1 opportunity: Call out decisions, positioning, launch waves, and prioritization more directly.

### Content Writer
- Coverage: Strong.
- Role clarity: Clear owner for hooks, captions, emails, landing copy, and publisher handoff.
- Status: Present.
- Position: Implicit.
- Tools: Hook Generator, Caption Builder, CTA Refiner, Publisher Package.
- Route fit: Content Studio.
- V1.1 opportunity: Tool cards should show that drafts are review-ready copy, not publishing actions.

### Media Director
- Coverage: Strong in Final Room definitions.
- Role clarity: Clear visual direction and asset planning owner.
- Status: Present.
- Position: Implicit.
- Tools: Creative Brief Builder, Format Mapper, Asset Checklist, Visual Direction, Send to Media Studio.
- Route fit: Media Studio.
- Issue: Legacy `MODE_DEFS` still has `designer` for this lane, while Final Room uses `media`. Older classifier output can fall back poorly.
- V1.1 opportunity: Normalize `designer` to `media`.

### Video Lead
- Coverage: Strong.
- Role clarity: Clear owner for video hooks, scripts, storyboards, voiceover, and asset needs.
- Status: Present.
- Position: Implicit.
- Tools: Write Video Hook, Draft Script, Build Storyboard, Prepare Voiceover, Map Video Asset Needs.
- Route fit: Media Studio.
- V1.1 opportunity: Destination should be visible on each tool card.

### Publisher
- Coverage: Strong.
- Role clarity: Clear readiness, schedule, channel formatting, and publishing package owner.
- Status: Present.
- Position: Implicit.
- Tools: Publishing Checklist, Final Packaging, Channel Formatting, Schedule Draft, Open Publishing.
- Route fit: Publishing.
- Safety: Clear and strong. No publishing action is performed from AI Command.
- V1.1 opportunity: Make planned/real distinction visible per tool.

### Ads Optimizer
- Coverage: Strong.
- Role clarity: Clear ad angles, testing, targeting, copy, and budget guidance owner.
- Status: Present.
- Position: Implicit.
- Tools: Ad Angle Generator, Copy Variants, Test Ideas, Budget Notes, Open Ads Manager.
- Route fit: Ads Manager.
- Safety: Clear that no budget updates or launches execute.
- V1.1 opportunity: Add explicit audience hypotheses and budget-note language where shown to user.

### SEO & Insights Analyst
- Coverage: Strong.
- Role clarity: Clear keyword, meta, opportunity, and analysis planning owner.
- Status: Present.
- Position: Implicit.
- Tools: Keyword Intent, Meta Direction, Opportunity Summary, Analysis Plan, Open Insights.
- Route fit: Insights.
- Safety: Clear that no analytics mutation or fake metrics happen.
- V1.1 opportunity: Tool metadata should state that outputs route to Insights.

### Compliance Reviewer
- Coverage: Strong.
- Role clarity: Clear claims, approvals, governance, and publishing-risk owner.
- Status: Present.
- Position: Implicit.
- Tools: Claims Check, Approval Flags, Safety Checklist, Publish Readiness, Open Governance.
- Route fit: Governance.
- Safety: Strong advisory-only language.
- V1.1 opportunity: Full Team chain should visibly include this gate.

### Operations Lead
- Coverage: Strong.
- Role clarity: Clear task, workflow, blockers, timeline, and handoff owner.
- Status: Present.
- Position: Implicit.
- Tools: Timeline Draft, Handoff Routing, Checklist, Blocker Review, Open Workflows / Operations.
- Route fit: Workflows; task output goes to Task Center.
- Safety: Clear that no workflow run or backend task creation executes.
- V1.1 opportunity: Route label for `task-center` is present, but destination availability should be verified in browser QA.

### Customer Operations Lead
- Coverage: Strong and safe.
- Role clarity: Present but summary is shorter than other specialists.
- Status: Present.
- Position: Implicit.
- Tools: Review Unified Inbox, Summarize Customer Thread, Draft Customer Reply, Create Ticket Draft, Check SLA Risk, Prepare Escalation, Customer Profile Snapshot, Route to Support / Sales / Operations.
- Route fit: Current preview route sends non-task output to Workflows and task output to Task Center. That is safe, but the specialist destinations mention Unified Inbox and Operations Centers, which may create ambiguity.
- Safety: Strong. Replies, tickets, SLA changes, and escalations are draft-only.
- V1.1 opportunity: Make "draft-only customer operations" visible in the card summary and route labels.

### Sales / CRM Lead
- Coverage: Strong and safe.
- Role clarity: Present but summary is shorter than other specialists.
- Status: Present.
- Position: Implicit.
- Tools: Lead Qualification, Outreach Draft, Follow-up Sequence, CRM Profile Summary, Pipeline Next Step, Dealer / Salon Outreach, Influencer Lead Plan, Sales Handoff.
- Route fit: Workflows. Safe because CRM mutation is not connected.
- Safety: Strong. Outreach, CRM mutations, follow-ups, and pipeline changes are draft-only.
- V1.1 opportunity: Make CRM/outreach draft-only status visible in the specialist card and tool cards.

## Tool-by-Tool Review

### Strategist Tools
- Campaign Angle Generator: Clear purpose. Output is Draft. Destination is implied, not shown.
- Launch Plan: Clear workflow draft. Destination is Workflows by intent. Needs visible route metadata.
- Funnel Mapping: Clear strategic map. Destination is implied.
- Priority Sort: Strong next-action tool. Output is Task. Needs visible no-task-created status.

### Writer Tools
- Hook Generator: Clear copy draft. German market expectation is explicit.
- Caption Builder: Clear copy package. German platform notes are useful.
- CTA Refiner: Strong role-specific task output. Needs visible route and draft-only state.
- Publisher Package: Strong handoff output. Destination is implied by label, not card metadata.

### Media Director Tools
- Creative Brief Builder: Strong and role-specific.
- Format Mapper: Strong and practical.
- Asset Checklist: Useful task draft. Needs explicit no asset upload/mutation status.
- Visual Direction: Useful but label could imply review of real assets; current prompt keeps it advisory.
- Send to Media Studio: Real route action. It appears connected and is connected through `navigateTo`.

### Video Lead Tools
- Write Video Hook: Clear.
- Draft Script: Clear.
- Build Storyboard: Clear workflow draft.
- Prepare Voiceover: Clear script-only output, but card does not show that no audio is generated.
- Map Video Asset Needs: Clear task draft.

### Publisher Tools
- Publishing Checklist: Strong handoff.
- Final Packaging: Strong handoff.
- Channel Formatting: Clear guidance.
- Schedule Draft: Clear workflow draft; no schedule is created.
- Open Publishing: Real route action. It appears connected and is connected.

### Ads Optimizer Tools
- Ad Angle Generator: Strong.
- Copy Variants: Strong.
- Test Ideas: Strong task draft.
- Budget Notes: Safe guidance. It correctly avoids budget mutation.
- Open Ads Manager: Real route action. It appears connected and is connected.

### SEO & Insights Analyst Tools
- Keyword Intent: Strong.
- Meta Direction: Strong.
- Opportunity Summary: Strong task-shaped analysis.
- Analysis Plan: Strong workflow draft.
- Open Insights: Real route action. It appears connected and is connected.

### Compliance Reviewer Tools
- Claims Check: Strong and safe.
- Approval Flags: Strong task draft.
- Safety Checklist: Strong handoff.
- Publish Readiness: Strong handoff.
- Open Governance: Real route action. It appears connected and is connected.

### Operations Lead Tools
- Timeline Draft: Strong workflow draft.
- Handoff Routing: Strong handoff.
- Checklist: Strong task draft.
- Blocker Review: Strong guidance.
- Open Workflows / Operations: Real route action. It appears connected and is connected.

### Customer Operations Tools
- Review Unified Inbox: Safe because it does not claim real inbox review happened.
- Summarize Customer Thread: Useful when the user provides thread context.
- Draft Customer Reply: Strong and safe.
- Create Ticket Draft: Strong but must remain clearly draft-only.
- Check SLA Risk: Strong but must state runtime data may be missing.
- Prepare Escalation: Strong handoff and safe.
- Customer Profile Snapshot: Useful for international/professional operations.
- Route to Support / Sales / Operations: Useful routing draft, not a real route action. Label can look executable, so it needs explicit draft status.

### Sales / CRM Tools
- Lead Qualification: Strong.
- Outreach Draft: Strong and safe.
- Follow-up Sequence: Strong workflow draft; no follow-up scheduled.
- CRM Profile Summary: Strong and safe.
- Pipeline Next Step: Strong task draft; no stage mutation.
- Dealer / Salon Outreach: Useful international B2B/salon channel tool.
- Influencer Lead Plan: Useful professional growth workflow.
- Sales Handoff: Strong handoff.

### Full Team Tools
- Team Mission Brief: Useful, but should show full sequence ownership.
- Full-Team Workflow: Useful, but current wording omits Customer Ops and Sales/CRM optional branch.
- Cross-Team Blockers: Useful task output.
- Handoff Chain: Useful, but should mention Customer Ops/Sales branch when relevant.
- Open Workflows / Operations: Real route action. It appears connected and is connected.

## Missing Tools

Recommended additions for future V1.2 or later:
- Strategist: Positioning Matrix, Launch Wave Planner, Offer Risk Review.
- Writer: Email Sequence Draft, Localization Review, Landing Section Builder.
- Media Director: Asset Gap Review, Brand Guardrail Check, Prompt Pack Builder.
- Video Lead: Shot List Builder, Voiceover Timing Sheet, Reel Variant Matrix.
- Publisher: Channel QA Pack, Approval Queue Summary, Post-Publish Monitor Plan.
- Ads Optimizer: Audience Hypothesis Map, Creative Test Matrix, Spend Guardrail Review.
- SEO & Insights Analyst: CTR Gap Review, Content Cluster Plan, SERP Evidence Checklist.
- Compliance Reviewer: Evidence Request Builder, Claim Rewrite Assistant, Approval Gate Map.
- Operations Lead: RACI/Handoff Matrix, Dependency Heatmap, First-Action Resolver.
- Customer Operations Lead: SLA Matrix Draft, Refund/Exception Review Draft, Support Macro Draft.
- Sales / CRM Lead: Account Brief Builder, Objection Response Draft, Pipeline Hygiene Review.

## Weak Tools

- Route to Support / Sales / Operations: Useful, but may sound like an execution route. It currently produces a handoff preview, so the card needs to say "draft routing guidance".
- Budget Notes: Safe but could be stronger if it mentions budget guardrails and test allocation.
- Visual Direction: Useful, but should make clear it is a brief/review draft, not asset generation.
- Team Mission Brief and Full-Team Workflow: Need fuller multi-role sequence wording.

## Confusing Labels and Helper Text

- `Use Above`: Functional, but vague. Better label is "Use in Composer" if changed later.
- `Route`: Functional, but could be clearer as "Route Draft" or "Send Context" to avoid implying execution.
- `Create Task`: Correctly disabled, but should say "Planned: Create Task" or have stronger note nearby.
- `Export File`: Correctly disabled, but should say "Planned: Export File" or have stronger note nearby.
- Tool cards: Need explicit "Route: X" and "Status: Draft preview" metadata.
- Full Team card: Needs visible optional Customer Ops -> Sales/CRM -> Operations branch.

## Route Destination Review

- Strategist: Task -> Campaign Studio, other outputs -> Workflows. Acceptable.
- Writer: Content Studio. Correct.
- Media Director: Media Studio. Correct.
- Video Lead: Media Studio. Correct.
- Publisher: Publishing. Correct.
- Ads Optimizer: Ads Manager. Correct.
- SEO & Insights Analyst: Insights. Correct.
- Compliance Reviewer: Governance. Correct.
- Operations Lead: Task -> Task Center, other outputs -> Workflows. Correct if Task Center route exists.
- Customer Operations Lead: Task -> Task Center, other outputs -> Workflows. Safe, but Operations Centers may be more semantically aligned if routing exists.
- Sales / CRM Lead: Workflows. Safe because direct CRM mutation is not connected.
- Legacy issue: `MODE_DEFS` uses `designer` for Media Director while Final Room uses `media`. This should be normalized.

## Full Team Workflow Review

Current Full Team behavior is safe and useful. It uses a `team` mode, packages the request with `mode: "team"`, shows the Full Team chain, and produces team preview outputs through the Operations template. However, the visible workflow reads mostly like a marketing/publishing chain:

Strategist -> Writer -> Media -> Compliance -> Publisher -> Operations

The desired professional system should also show the customer and sales branch when relevant:

Customer Ops -> Sales/CRM -> Operations

Recommended V1.1 copy should make the team feel like a real executive AI workflow:
- Strategist sets priority and launch sequence.
- Writer prepares messaging.
- Media and Video prepare creative direction and production drafts.
- Compliance checks claims and gates.
- Publisher prepares channel package.
- Customer Ops and Sales/CRM contribute when the request touches inbox, tickets, leads, outreach, or CRM.
- Operations turns the result into safe tasks, workflow drafts, and handoffs.

## Real vs Planned Action Review

Real connected actions:
- Ask AI Team: Calls `executeProjectAiGuidance` when available, guidance-only.
- Draft / Task / Workflow / Handoff: Build local preview outputs only.
- Tool preview buttons: Build local preview outputs only.
- Route tools: Navigate to the named workspace.
- Send/Route preview: Writes shared draft/handoff context, then navigates.
- Save Draft/Save response: Saves locally.
- Copy: Uses browser clipboard where available.
- Read Aloud/Read: Uses browser speech synthesis where available.
- Voice: Uses browser speech recognition only when available.

Planned or disabled actions:
- Attach: Disabled, planned backend intake.
- Add Context: Disabled, planned context picker.
- Template: Disabled, planned template picker.
- Create Task: Disabled until durable task handler exists.
- Export File: Disabled until durable export handler exists.
- Native GPU video rendering: Planned.
- Realtime voice chat: Planned.
- Media generation: Planned/provider-dependent.

No button currently appears enabled while only planned, except "Voice" can be enabled even when browser support is absent; its handler safely reports unavailable. The disabled planned actions are honest.

## Browser QA Checklist

- Load AI Command with a selected project and without a selected project.
- Confirm all 11 specialists appear once and can be selected.
- Confirm Solo Specialist and Full Team toggle states persist across rerender.
- Confirm each specialist's tools render and prepare local previews.
- Confirm route tools navigate to the expected workspace.
- Confirm Ask AI Team produces guidance only when the bridge is connected.
- Confirm bridge-unavailable state does not crash and points user to preview tools.
- Confirm Draft, Task, Workflow, Handoff buttons update the right output tab.
- Confirm Export tab is selectable but does not imply file creation.
- Confirm Create Task and Export File remain disabled and visually planned.
- Confirm Customer Ops previews never claim replies/tickets/SLA changes happened.
- Confirm Sales / CRM previews never claim outreach/CRM/pipeline mutations happened.
- Confirm Full Team mode shows marketing/publishing chain and customer/sales branch.
- Confirm no duplicate active IDs in source scan.
- Confirm mobile width keeps output tabs, tool cards, and action buttons readable.

## Exact Recommended Patch List

V1.1 safe patch:
1. Add `designer: "media"` and `media_director: "media"` compatibility aliases.
2. Normalize the Media Director legacy mode definition from `designer` to `media`.
3. Add explicit `position` metadata to every Final Room specialist and render it in the team rail.
4. Strengthen Customer Operations Lead and Sales / CRM Lead summaries, placeholders, and safety copy.
5. Expand Full Team chain and prompt copy to show Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations, plus Customer Ops -> Sales/CRM -> Operations when relevant.
6. Improve `buildSpecialistChatPrompt` for team mode so the backend guidance prompt receives the multi-role workflow expectation.
7. Add helper functions for tool destination and tool real/planned state.
8. Render tool card metadata as Output, Route, and Status.
9. Rename disabled planned controls to "Planned: Create Task" and "Planned: Export File" or strengthen nearby helper text.
10. Improve output workspace helper copy so users understand route saves draft context, not execution.
11. Keep backend, router, app, API, Operations Centers, and project data untouched.

Deferred:
- Do not connect task creation or file export without real handlers.
- Do not add CRM mutation, ticket creation, SLA changes, publishing, ad launch, or media generation.
- Do not change layout architecture.

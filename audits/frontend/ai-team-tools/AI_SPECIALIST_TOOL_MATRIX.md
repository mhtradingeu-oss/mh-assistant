# AI Specialist Tool Matrix

Phase: 1 - tool model and specialist matrix
Date: 2026-05-18
Scope: Project-agnostic AI Team tool model for AI Command / AI Team

## Operating Principles

- AI Command is the command and intelligence layer.
- The Tool Dock is compact and specialist-specific.
- Tools are operations.
- Output types are results.
- The Smart Tool Drawer is metadata-driven and preview-first.
- Library is the source selection and source preview workspace.
- Content Studio owns written draft saving, editing, versioning, and written-content routing.
- Media Studio owns visual, media, video, asset-production, and media-review workflows.
- Publishing owns scheduling, channel packaging, approvals-to-publish, and publishing execution.
- Governance owns approvals, compliance review, policy decisions, and risk gates.
- Workflows owns workflow execution.
- Operations Centers own task, queue, job, notification, and operational monitoring surfaces.
- CRM/Sales actions remain draft/review-only until a dedicated CRM workspace exists.
- AI Command must not directly publish, send email, create CRM records, run workflows, delete files, overwrite files, or mutate backend data.

## Matrix Format

Each specialist entry defines the target model for Phase 3 and later metadata normalization. The lists are intentionally project-agnostic and avoid brand-specific assumptions.

## Content Writer

- specialist_id: `writer`
- display_label: Content Writer
- role: Messaging and written-content specialist for creating, adapting, improving, checking, repurposing, and safely routing written outputs.
- owning_workspace: Content Studio
- related_pages: AI Command, Library, Content Studio, Media Studio, Publishing, Governance, Workflows, Insights
- best_tool_dock_tools: Write, Rewrite, Translate, Improve, Check, Sources, SEO, Repurpose, Send
- output_types: Company Profile, Brand Story, Product Copy, Email, Blog Article, Landing Page, Contract Draft, Presentation Outline, Speech, FAQ, Proposal, Social Post, Ad Copy, Press Release, Customer Reply, SEO Brief, Meta Pack, Content Gap Notes, Media Brief Draft, Publishing Package Draft
- source_types: Current Chat, Composer Text, Selected Text, Last AI Response, Library Asset, Library Folder, Brand Profile, Product Data, Legal / Pricing Documents, Research / Proof Documents, Campaign Notes, Content Studio Draft, Manual Input
- destinations: Chat Preview, Composer, Content Studio, Library, Media Studio Design Brief, Publishing Package, Governance / Compliance Review, Workflows Task Preview, Handoff Preview
- action_types: `prefill`, `guided`, `source_required`, `preview`, `route`
- safety_level: `review_only` by default, `context_only` for Sources, `confirmation_required` for Send / route preparation
- required_drawer_fields: Tool, Output Type, Source / Input, Destination, Language, Tone, Extra Brief when facts or objective are unclear
- optional_drawer_fields: Audience, CTA, Primary Keyword, Secondary Keywords, Market, Channel, Existing Draft, Selected Source Summary, Source Details, Proof Notes, Compliance Notes
- source_requirements: Source is required for product facts, legal wording, pricing, contracts, claims, health/performance language, company profiles, proof-led copy, and any content that must cite or rely on project files.
- destination_rules: Written drafts should route to Content Studio for saving/editing; source selection should open Library; visual brief preparation should route to Media Studio after content review; publishing packages should open Publishing as a draft/review package; compliance questions should route to Governance or Compliance Reviewer; workflow/task outputs should remain previews until Workflows or Operations confirms.
- quality_rules: Preserve factual grounding; never invent claims, certifications, prices, guarantees, statistics, ingredients, legal terms, or proof; keep publishable copy in the selected output language; keep explanations separate from publishable copy when languages differ; structure long-form outputs with clear headings; include SEO metadata only when relevant; mark missing inputs clearly.
- review_only_boundaries: Drafting, rewriting, translating, checking, and routing are review-only inside AI Command. The result may be used in the composer or sent as context to the owning workspace, but not saved or published directly.
- future_backend_capabilities: Template-aware Content Studio draft creation, selected-source content generation, source bundle handoff, Content Studio version creation, compliance review package creation, SEO insight enrichment, media brief handoff.
- what_must_not_execute_from_ai_command: Publish, send email, save final content, overwrite Content Studio drafts, create durable Library records, create approvals, run workflows, send customer replies, or mutate backend records.

## Media Director

- specialist_id: `media`
- display_label: Media Director
- role: Creative direction specialist for visual concepts, asset-aware briefs, image prompts, brand checks, format packs, and production handoffs.
- owning_workspace: Media Studio
- related_pages: AI Command, Library, Media Studio, Content Studio, Publishing, Governance
- best_tool_dock_tools: Create Visual, Edit Asset, Remove BG, Resize, Prompt, Brand Check, Format Pack, Moodboard, Product Shot
- output_types: Visual Brief, Creative Direction, Image Prompt, Edit Brief, Background Removal Brief, Resize Brief, Reframe Brief, Format Pack, Brand Check Report, Moodboard Direction, Product Shot Brief, Asset Checklist, Layout Plan, Publishing-Ready Media Notes
- source_types: Library Asset, Selected Image, Product Image, Logo, Brand Guidelines, Campaign Assets, Content Studio Copy, Current Chat, Manual Visual Brief, Reference Asset, Source-of-Truth Asset
- destinations: Chat Preview, Media Studio, Library, Content Studio Design Notes, Publishing Package, Governance / Brand Review
- action_types: `guided`, `asset_required`, `source_required`, `preview`, `route`
- safety_level: `review_only` for briefs and prompts, `asset_required` for asset operations, `confirmation_required` before any media processing or durable save
- required_drawer_fields: Tool, Output Type, Source / Asset, Destination, Format / Ratio, Language when text appears in visual, Tone / Style, Extra Brief
- optional_drawer_fields: Brand Colors, Typography Notes, Platform, CTA, Safe Text Area, Reference Mood, Negative Constraints, Product Accuracy Notes, Selected Source Summary
- source_requirements: Library should provide selected media assets, brand guidelines, logos, product images, and approved campaign assets. Source is required before asset edit, remove background, resize, brand check, product shot, or format pack work.
- destination_rules: Media production and asset edits must route to Media Studio; Library remains the place to select and preview files; Publishing receives only reviewed media packages; Governance or brand review handles risky claims, regulated visuals, or approval-sensitive assets.
- quality_rules: Preserve product identity; keep brand consistency; define format, composition, visual hierarchy, and platform ratio; avoid unsupported claims in visible text; specify safe zones and accessibility considerations; make prompts clear enough for production review.
- review_only_boundaries: AI Command may prepare a media brief, prompt, or checklist only. No asset processing, generation, deletion, overwrite, upload, or final approval occurs in AI Command.
- future_backend_capabilities: Media Studio prompt handoff, selected-asset transform preview, background removal job draft, resize package draft, brand-check report, Library asset dependency bundle.
- what_must_not_execute_from_ai_command: Generate images, remove backgrounds, resize files, overwrite assets, upload files, approve assets, save to Library, or publish media.

## Video Lead

- specialist_id: `video_lead`
- display_label: Video Lead
- role: Short-form and campaign-video specialist for scripts, hooks, storyboards, shot lists, subtitles, voiceover drafts, scene plans, and video production briefs.
- owning_workspace: Media Studio
- related_pages: AI Command, Library, Media Studio, Content Studio, Publishing, Governance
- best_tool_dock_tools: Script, Storyboard, Hook, Shot List, Subtitles, Resize Video, Voiceover, Scene Plan, B-roll List
- output_types: Video Script, Short-Form Hook Pack, Storyboard, Scene Plan, Shot List, Subtitle Brief, Caption Pack, Voiceover Script, B-roll List, Resize Video Brief, Platform Cutdown Plan, Publishing Video Package Draft
- source_types: Current Chat, Content Studio Copy, Library Video Asset, Library Image Asset, Product Footage, Brand Guidelines, Campaign Brief, Transcript, Existing Script, Manual Input
- destinations: Chat Preview, Media Studio, Library, Content Studio Script Draft, Publishing Package, Governance / Claims Review
- action_types: `guided`, `asset_required`, `source_required`, `preview`, `route`
- safety_level: `review_only` for scripts and plans, `asset_required` for subtitle/resize operations, `confirmation_required` before production or processing
- required_drawer_fields: Tool, Output Type, Source / Asset, Destination, Platform / Format, Language, Tone, Extra Brief
- optional_drawer_fields: Target Duration, Aspect Ratio, Hook Style, CTA, Voice Style, Subtitle Style, Scene Count, Source Details, Selected Source Summary
- source_requirements: Source is required for subtitles, resize, footage-specific storyboards, voiceover based on existing copy, and video packages that reuse approved assets. Library remains the source selection workspace.
- destination_rules: Video production and processing route to Media Studio; scripts may route to Content Studio for written review; Publishing receives only reviewed channel packages; Governance handles claims, regulated wording, or approval-sensitive scripts.
- quality_rules: Lead with hook clarity; keep timing practical; separate voiceover, on-screen text, shot notes, and CTA; preserve brand/product accuracy; avoid unsupported claims; design for platform fit and accessibility.
- review_only_boundaries: AI Command may prepare scripts, shot lists, subtitle briefs, and production prompts only. No video generation, editing, transcription job, subtitle burn-in, or upload occurs in AI Command.
- future_backend_capabilities: Media Studio video brief handoff, subtitle job draft, video resize job draft, storyboard package, voiceover script package, B-roll asset request.
- what_must_not_execute_from_ai_command: Generate video, edit video, resize video, add subtitles, create audio, upload footage, overwrite files, publish video, or run provider jobs.

## Publisher

- specialist_id: `publisher`
- display_label: Publisher
- role: Publishing readiness specialist for channel packaging, schedule drafts, hashtag packs, approval packs, platform fit, and pre-publish risk checks.
- owning_workspace: Publishing
- related_pages: AI Command, Publishing, Content Studio, Media Studio, Library, Governance, Workflows
- best_tool_dock_tools: Publish Check, Channel Pack, Schedule Builder, Hashtag Pack, Approval Pack, Publishing Risk Check, Calendar Slot, Platform Fit
- output_types: Publishing Checklist, Channel Package, Schedule Draft, Hashtag Pack, Approval Pack, Publishing Risk Report, Calendar Slot Recommendation, Platform Fit Review, Caption Finalization Notes, Publishing Handoff Draft
- source_types: Content Studio Draft, Media Studio Job, Library Asset, Approved Media Package, Campaign Brief, Current Chat, Governance Notes, Manual Input
- destinations: Chat Preview, Publishing, Content Studio, Media Studio, Governance, Workflows Handoff
- action_types: `guided`, `source_required`, `preview`, `route`
- safety_level: `review_only` for checks and packages, `confirmation_required` for any route toward Publishing, never `execute` in AI Command
- required_drawer_fields: Tool, Output Type, Source / Package, Destination, Channel, Language, Safety / Approval Status, Extra Brief
- optional_drawer_fields: Preferred Date, Time Window, Asset Checklist, Hashtag Style, Platform Constraints, Campaign, CTA, Source Details
- source_requirements: Publishing packages require reviewed copy and reviewed media or a clear draft-state label. Source should come from Content Studio, Media Studio, Library, or Governance notes.
- destination_rules: Scheduling and publishing stay in Publishing; unresolved claims route to Governance; missing assets route to Library or Media Studio; missing copy routes to Content Studio; multi-step launch operations route to Workflows.
- quality_rules: Check channel fit, copy readiness, asset readiness, approvals, compliance status, format constraints, timing, CTA, and localization. Clearly label blockers before recommending any schedule.
- review_only_boundaries: AI Command may prepare readiness checks, packages, and schedule recommendations only. It cannot schedule, approve, publish, pause, retry, or mark items live.
- future_backend_capabilities: Publishing draft package handoff, schedule suggestion import, approval package draft, channel metadata package, readiness blocker sync.
- what_must_not_execute_from_ai_command: Publish, schedule, reschedule, approve, pause, retry, update publishing queue, send external channel payloads, or bypass Governance.

## Strategist

- specialist_id: `strategist`
- display_label: Strategist
- role: Executive strategy specialist for campaign plans, launch sequencing, audience maps, offers, funnels, positioning, channel mix, and next best action.
- owning_workspace: Campaign Studio
- related_pages: AI Command, Campaign Studio, Content Studio, Media Studio, Publishing, Insights, Workflows, Governance
- best_tool_dock_tools: Campaign Plan, Launch Plan, Audience Map, Offer Builder, Funnel Map, Market Angle, Competitor Positioning, Channel Mix, 90-Day Plan, Next Best Action
- output_types: Campaign Plan, Launch Plan, Audience Map, Offer Brief, Funnel Map, Market Angle Brief, Competitor Positioning Brief, Channel Mix Plan, 90-Day Plan, Next Best Action, Business Brief, Workflow Strategy Draft
- source_types: Current Chat, Campaign Notes, Market Notes, Library Research, Insights Report, Product Data, Customer Signals, Sales Notes, Competitor Notes, Manual Input
- destinations: Chat Preview, Campaign Studio, Content Studio Brief, Media Studio Brief, Publishing Plan, Insights, Workflows, Governance Review
- action_types: `guided`, `source_required`, `preview`, `route`
- safety_level: `review_only` for strategy outputs, `confirmation_required` for handoffs into execution workspaces
- required_drawer_fields: Tool, Output Type, Source / Input, Destination, Market / Audience, Goal, Extra Brief
- optional_drawer_fields: Campaign, Product, Channel, Budget Assumption, Timeline, Competitors, Proof Points, Risk Tolerance, Selected Source Summary
- source_requirements: Strategy can start from current context, but market claims, competitor positioning, audience evidence, and performance-informed plans require selected sources or explicit assumptions.
- destination_rules: Campaign Studio owns strategic campaign setup; Workflows owns execution sequencing; Content Studio, Media Studio, and Publishing receive briefs only after review; Governance receives risk-sensitive strategy or claims.
- quality_rules: Separate goals, assumptions, audience, offer, channels, sequence, dependencies, risks, and next actions; mark unknowns; avoid pretending external market research was performed unless sources are present.
- review_only_boundaries: AI Command may create plans, briefs, and recommended next actions only. It cannot launch campaigns, allocate budgets, change live ad settings, approve assets, or execute workflows.
- future_backend_capabilities: Campaign Studio brief handoff, strategy-to-workflow package, source-backed market brief, Insights-informed recommendation import, 90-day plan draft.
- what_must_not_execute_from_ai_command: Launch campaigns, change budgets, create live campaign records, publish assets, approve plans, run workflows, or mutate integrations.

## Operations Lead

- specialist_id: `operations`
- display_label: Operations Lead
- role: Execution planning specialist for tasks, workflows, handoffs, timelines, checklists, risks, dependencies, owners, and readiness checks.
- owning_workspace: Workflows
- related_pages: AI Command, Workflows, Task Center, Operations Centers, Queue Center, Job Monitor, Notification Center, Content Studio, Media Studio, Publishing, Governance
- best_tool_dock_tools: Task, Workflow, Handoff, Timeline, Checklist, Risk, Dependency Map, Owner Map, Readiness Check
- output_types: Task Draft, Workflow Draft, Handoff Summary, Timeline, Checklist, Risk Review, Dependency Map, Owner Map, Readiness Check, Execution Plan, Blocker Review
- source_types: Current Chat, AI Preview, Content Studio Draft, Media Studio Job, Publishing Package, Governance Note, Operations Snapshot, Task Context, Workflow Context, Manual Input
- destinations: Chat Preview, Workflows, Task Center, Operations Centers, Queue Center, Job Monitor, Notification Center, Governance, Publishing, Content Studio, Media Studio
- action_types: `guided`, `preview`, `route`, `source_required`
- safety_level: `review_only` for plans and previews, `confirmation_required` for workflow/task handoff, never `execute` in AI Command
- required_drawer_fields: Tool, Output Type, Source / Context, Destination, Owner / Role, Priority, Extra Brief
- optional_drawer_fields: Due Date, Dependencies, Risk Level, Campaign, Product, Channel, Acceptance Criteria, Blocking Items, Selected Source Summary
- source_requirements: Workflows and task plans should cite the source context they came from. Operational status, job state, queue state, and readiness checks require current workspace or operations data.
- destination_rules: Workflows owns workflow execution; Task Center owns durable task review; Operations Centers own monitoring; AI Command only prepares drafts or shared context for the owning operations surface.
- quality_rules: Define owner, next step, dependency, priority, risk, blocker, confirmation gate, and destination; separate draft tasks from executable workflows; never imply work was run or completed.
- review_only_boundaries: AI Command may prepare operational plans, checklists, and handoffs only. It cannot create durable tasks, run workflows, approve work, retry jobs, or change queue state.
- future_backend_capabilities: Workflow draft import, task draft import, handoff preview package, readiness checklist sync, dependency graph draft, operations status summarization.
- what_must_not_execute_from_ai_command: Run workflows, create tasks, assign owners in backend, retry jobs, stop jobs, mutate queues, approve work, or mark work complete.

## Compliance Reviewer

- specialist_id: `compliance_reviewer`
- display_label: Compliance Reviewer
- role: Claims, legal wording, privacy, evidence, approval, and governance risk specialist.
- owning_workspace: Governance
- related_pages: AI Command, Governance, Publishing, Content Studio, Media Studio, Library, Workflows
- best_tool_dock_tools: Claims Check, Safe Rewrite, Evidence Needed, GDPR Review, Legal Wording, Risk Level, Approval Notes, Before Publish Gate, Contract Risk Review
- output_types: Claims Risk Report, Safe Rewrite, Evidence Request, GDPR Review, Legal Wording Notes, Risk Level Assessment, Approval Notes, Before Publish Gate Checklist, Contract Risk Review, Compliance Handoff Draft
- source_types: Content Draft, Publishing Package, Contract Draft, Legal Document, Privacy Policy, Product Data, Proof / Research Document, Library Source, Current Chat, Manual Input
- destinations: Chat Preview, Governance, Content Studio Review Notes, Publishing Review, Library Source Request, Workflows Handoff
- action_types: `source_required`, `guided`, `preview`, `route`
- safety_level: `review_only` and `confirmation_required` for approval routing; compliance outputs are advisory unless Governance confirms
- required_drawer_fields: Tool, Output Type, Source / Input, Destination, Risk Area, Language, Extra Brief
- optional_drawer_fields: Jurisdiction / Market, Evidence Standard, Claim Type, Reviewer Role, Approval Deadline, Contract Parties, Selected Source Summary
- source_requirements: Evidence-backed review requires selected source documents, proof, legal copy, privacy wording, product facts, or the draft under review. Unsupported claims must be marked as missing proof.
- destination_rules: Governance owns formal approvals and policy decisions; Content Studio receives safe rewrites and notes; Publishing receives pre-publish risk packages; Library is used to select evidence; Workflows receives approval process drafts.
- quality_rules: Separate risk level, evidence needed, safer wording, unresolved issues, approval owner, and before-publish blockers; do not provide legal finalization; label uncertainty and recommend human review.
- review_only_boundaries: AI Command may flag risks, suggest safer wording, and prepare approval notes only. It cannot approve, reject, clear flags, finalize legal language, or change Governance policy.
- future_backend_capabilities: Governance review package, evidence request handoff, approval note draft, claim-risk sync, before-publish gate package, contract review intake.
- what_must_not_execute_from_ai_command: Approve content, reject content, update policy, create durable approvals, remove flags, finalize legal advice, publish, or bypass Governance.

## Ads Optimizer

- specialist_id: `ads`
- display_label: Ads Optimizer
- role: Paid growth specialist for ad angles, copy, creative tests, A/B plans, audiences, landing-page alignment, budget scenarios, variants, and compliance risk.
- owning_workspace: Ads Manager
- related_pages: AI Command, Ads Manager, Content Studio, Media Studio, Insights, Library, Governance, Campaign Studio
- best_tool_dock_tools: Ad Angle, Ad Copy, Creative Test, A/B Plan, Audience Map, Landing Match, Budget Scenario, Campaign Variant Pack, Compliance Risk
- output_types: Ad Angle Brief, Ad Copy Variants, Creative Test Plan, A/B Plan, Audience Map, Landing Match Review, Budget Scenario, Campaign Variant Pack, Compliance Risk Notes, Paid Campaign Brief
- source_types: Campaign Brief, Product Data, Content Draft, Landing Page Copy, Media Asset, Library Asset, Insights Report, Audience Notes, Performance Signals, Manual Input
- destinations: Chat Preview, Ads Manager, Content Studio, Media Studio, Insights, Governance, Campaign Studio
- action_types: `guided`, `source_required`, `preview`, `route`
- safety_level: `review_only` for copy/plans, `confirmation_required` for any Ads Manager route, never `execute` in AI Command
- required_drawer_fields: Tool, Output Type, Source / Input, Destination, Channel / Platform, Audience, Language, Extra Brief
- optional_drawer_fields: Objective, Budget Scenario, Test Hypothesis, Landing URL / Page Notes, Creative Format, Compliance Sensitivity, Selected Source Summary
- source_requirements: Ad claims, product benefits, audience assertions, landing match reviews, budget assumptions, and performance analysis require sources or must be clearly marked as assumptions.
- destination_rules: Ads Manager owns live campaign work; Content Studio owns ad copy refinement; Media Studio owns creative production; Insights owns performance analysis; Governance handles compliance risk; Campaign Studio owns campaign strategy.
- quality_rules: Separate angle, audience, hook, proof, CTA, variant hypothesis, landing match, and compliance risk; never imply live spend or campaign changes; mark missing performance data.
- review_only_boundaries: AI Command may draft ad copy, testing plans, and recommendations only. It cannot launch ads, change budgets, update audiences, edit campaigns, or access ad accounts.
- future_backend_capabilities: Ads Manager draft import, creative test package, compliance review package, Insights-informed test recommendation, content/media handoff bundle.
- what_must_not_execute_from_ai_command: Launch ads, pause ads, change budget, create audiences, update campaigns, send data to ad platforms, or mutate integrations.

## SEO / Insights Analyst

- specialist_id: `analyst`
- display_label: SEO / Insights Analyst
- role: Search and performance intelligence specialist for keywords, trends, SEO briefs, gaps, metadata, internal links, performance reviews, and reports.
- owning_workspace: Insights
- related_pages: AI Command, Insights, Content Studio, Library, Campaign Studio, Publishing, Workflows
- best_tool_dock_tools: Keywords, Trends, SEO Brief, Content Gap, Meta, Internal Links, Performance Review, Report
- output_types: Keyword Cluster, Trend Brief, SEO Brief, Content Gap Report, Meta Title / Description Pack, Internal Link Plan, Performance Review, Insights Report, Search Intent Map, Blog Outline, FAQ Ideas
- source_types: Topic, Market, Language, Audience, Current Chat, Library Source, Content Draft, Website / Page Notes, Insights Data, Analytics Summary, Search Console Summary, Manual Input
- destinations: Chat Preview, Insights, Content Studio, Library, Campaign Studio, Publishing Notes, Workflows Handoff
- action_types: `guided`, `source_required`, `preview`, `route`
- safety_level: `review_only`, with `source_required` for data-backed claims and performance reports
- required_drawer_fields: Tool, Output Type, Source / Input, Destination, Market, Language, Extra Brief
- optional_drawer_fields: Topic, Primary Keyword, Funnel Stage, Page Type, Timeframe, Competitors, Data Source, Selected Source Summary
- source_requirements: Performance reviews, trends, traffic claims, keyword prioritization, and reports require selected sources or connected data. Without data, output must be labeled as planning guidance or assumptions.
- destination_rules: Insights owns analysis; Content Studio receives SEO briefs and content gaps; Library stores selected research sources; Campaign Studio receives strategic recommendations; Workflows receives recurring report/check workflows.
- quality_rules: Define search intent, audience, keyword groups, page type, metadata, internal link opportunities, evidence level, and next action. Do not invent metrics, rankings, volumes, CTRs, conversions, or trend facts.
- review_only_boundaries: AI Command may prepare briefs, reports, and recommendations only. It cannot update website SEO settings, analytics settings, live metadata, or reporting integrations.
- future_backend_capabilities: Insights report handoff, keyword research enrichment, Search Console / analytics summarization, Content Studio SEO brief import, recurring report workflow draft.
- what_must_not_execute_from_ai_command: Edit live SEO, change metadata, create analytics configurations, alter integrations, publish pages, or fabricate performance data.

## Customer Ops

- specialist_id: `customer_ops`
- display_label: Customer Ops
- role: Customer operations specialist for reply drafts, ticket drafts, SLA risk, thread summaries, escalation drafts, sentiment review, FAQ matching, and refund/return reply drafts.
- owning_workspace: Operations Centers
- related_pages: AI Command, Operations Centers, Task Center, Workflows, Content Studio, Governance, future Unified Inbox
- best_tool_dock_tools: Reply Draft, Ticket Draft, SLA Risk, Thread Summary, Escalation Draft, Sentiment Review, FAQ Match, Refund / Return Reply
- output_types: Reply Draft, Ticket Draft, SLA Risk Review, Thread Summary, Escalation Draft, Sentiment Review, FAQ Match, Refund / Return Reply Draft, Customer Handoff, Support Task Preview
- source_types: Customer Thread, Current Chat, Manual Input, FAQ Source, Policy Document, Order / Case Summary, Support Notes, Library Source, Previous Reply Draft
- destinations: Chat Preview, Operations Centers, Task Center, Workflows, Content Studio FAQ Draft, Governance for Risky Replies, future Unified Inbox
- action_types: `guided`, `source_required`, `preview`, `route`
- safety_level: `review_only` for all customer-facing output, `confirmation_required` for any support/task handoff
- required_drawer_fields: Tool, Output Type, Source / Customer Context, Destination, Language, Tone, Extra Brief
- optional_drawer_fields: Customer Sentiment, SLA Deadline, Issue Type, Policy Source, Escalation Owner, Order / Case Reference, FAQ Match, Selected Source Summary
- source_requirements: Customer replies, refund/return wording, SLA risk, and escalations require the customer thread, policy, FAQ, or case summary. If missing, ask for context instead of drafting a final reply.
- destination_rules: Operations Centers or future Unified Inbox own customer reply review; Task Center owns ticket/task drafts; Governance handles risky policy/legal/refund language; Content Studio may own reusable FAQ content.
- quality_rules: Be empathetic, concise, policy-aware, and clear about next steps; do not promise refunds, replacements, timelines, discounts, or operational actions without source confirmation; flag escalation risk.
- review_only_boundaries: AI Command may draft replies, summarize threads, and prepare ticket fields only. It cannot send replies, create live tickets, change SLA status, issue refunds, or escalate cases.
- future_backend_capabilities: Unified Inbox reply draft import, ticket draft creation preview, FAQ match source bridge, escalation handoff, SLA risk package, customer sentiment summary.
- what_must_not_execute_from_ai_command: Send customer messages, create tickets, update customer records, issue refunds, change order state, escalate live cases, or mutate inbox data.

## Sales / CRM

- specialist_id: `sales_crm`
- display_label: Sales / CRM
- role: Revenue and CRM specialist for lead discovery planning, qualification, outreach drafts, follow-ups, objection handling, lead briefs, email sequences, CRM summaries, and proposals.
- owning_workspace: Future CRM workspace; interim owner is Workflows / Operations Centers
- related_pages: AI Command, Workflows, Operations Centers, Task Center, Content Studio, Governance, future CRM, future Email / Outreach workspace
- best_tool_dock_tools: Find Leads, Qualify, Draft Outreach, Follow Up, Objections, Lead Brief, Email Sequence, CRM Summary, Proposal
- output_types: Lead Search Brief, Lead Qualification, Outreach Draft, Follow-Up Draft, Objection Handling Notes, Lead Brief, Email Sequence, CRM Summary, Proposal Draft, Sales Handoff, Pipeline Next Step Draft
- source_types: Current Chat, Manual Lead Context, CRM Profile Summary, Sales Notes, Customer Context, Product / Offer Data, Library Source, Research Notes, Prior Outreach, Meeting Notes
- destinations: Chat Preview, Workflows, Operations Centers, Task Center, Content Studio, Governance, future CRM, future Email / Outreach workspace
- action_types: `guided`, `source_required`, `preview`, `route`
- safety_level: `review_only` for all sales output, `confirmation_required` before any CRM or outreach handoff
- required_drawer_fields: Tool, Output Type, Source / Lead Context, Destination, Audience / Lead Type, Language, Tone, Extra Brief
- optional_drawer_fields: Offer, Segment, Location, Radius, Company Type, Contact Role, Objection Type, Follow-Up Cadence, Proposal Scope, Selected Source Summary
- source_requirements: Qualification, CRM summaries, outreach personalization, objections, and proposals require lead context, offer/product facts, prior conversation, or explicit assumptions. Lead-finding should be a search brief until a dedicated backend capability exists.
- destination_rules: CRM actions stay draft/review-only until a dedicated CRM workspace exists; Workflows or Operations Centers receive handoff drafts; Content Studio owns polished proposal/copy drafts; Governance handles claims, legal, and outreach risk.
- quality_rules: Separate fit, intent, urgency, offer relevance, missing fields, proof needs, outreach angle, CTA, follow-up cadence, and stop conditions. Do not imply outreach was sent or CRM was updated.
- review_only_boundaries: AI Command may prepare lead briefs, outreach drafts, and handoff notes only. It cannot create CRM records, update pipeline stage, schedule follow-ups, scrape leads, or send outreach.
- future_backend_capabilities: CRM draft import, lead qualification package, outreach sequence draft, proposal draft handoff, lead search workflow draft, CRM summary intake, email/outreach workspace bridge.
- what_must_not_execute_from_ai_command: Find live leads via external services, create CRM records, update CRM fields, advance pipeline stages, send email/outreach, schedule follow-ups, or mutate sales data.

## Cross-Specialist Destination Rules

- Chat Preview: safe for immediate AI Command output.
- Composer: safe for user review and manual editing.
- Library: source selection only from AI Command; durable Library saves happen in owning workspaces.
- Content Studio: written draft review, editing, saving, versioning, and written handoff.
- Media Studio: visual/media production briefs, prompts, review, and provider jobs.
- Publishing: channel packaging, scheduling, approval-to-publish, and live publishing.
- Governance: compliance, approvals, claim risk, policy decisions, and legal-sensitive review.
- Workflows: workflow execution, durable workflow runs, and operational sequencing.
- Operations Centers / Task Center: durable task and operational review surfaces.
- Ads Manager: paid campaign review and execution surface.
- Insights: data-backed reports and SEO/performance analysis.
- CRM / Sales: draft-only until a dedicated CRM workspace exists.

## Shared Safety Model

- `context_only`: Source preparation, source summary, reference gathering, and missing source requests.
- `review_only`: Drafts, briefs, reports, plans, recommendations, checks, and rewrites.
- `confirmation_required`: Any route to an owning workspace where durable state may later be created.
- `execute`: Not allowed from AI Command for these specialist tools.

## Implementation Priority

1. Normalize metadata for all specialists.
2. Clean drawer UX and remove duplicated drawer CSS/unused local preview CSS.
3. Add Library Source Bridge.
4. Complete Content Writer intelligence.
5. Migrate one specialist at a time.
6. Add safe destination-aware routing.
7. Final visual polish and cleanup.

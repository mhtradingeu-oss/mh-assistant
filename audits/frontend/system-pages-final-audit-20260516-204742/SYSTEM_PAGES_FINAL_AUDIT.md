# System Pages Final Audit

Date: 2026-05-16 20:47:42 UTC

Branch: `architecture/frontend-consolidation-v1`

Audit position: AI Team Command Center is treated as the central smart assistant and specialist team. Pages were judged on purpose clarity, actual JS wiring, route validity, handlers, API usage, handoffs, responsive risk, and support for `Observe -> Decide -> Draft -> Review -> Route -> Execute -> Monitor`.

## Executive Findings

1. The system has a much stronger frontend foundation than a placeholder app: Campaign Studio, Content Studio, Media Studio, Publishing, Library, Integrations, Settings, Governance, Workflows, and Operations split pages all contain real handlers and backend/API integration points.
2. The most important broken workflow is route-level: `operations-centers` is referenced by Home and AI Command, but `router.js` registers only `task-center`, `queue-center`, `job-monitor`, and `notification-center`.
3. The most important AI Team gap is handoff consistency. AI Command consumes `quickCommandInput` during render, while several pages rely on shared handoff records that AI Command does not currently apply in render.
4. AI Command itself is polished and powerful, but `research` aliases to `researcher`, and no `researcher` specialist exists. Research should route to Analyst or a real Research specialist should be added.
5. Library is powerful and backend-connected, but it has a concrete source-level pagination hazard: the grid page handler references `nextId` without defining it.
6. Governance is system-connected and professional, but approval decisions and overrides are backend mutations without a confirmation gate.
7. Workflows currently renders a simpler session-preparation surface. Older execution-loop and automation helpers remain in the file and are not mounted, which is a maintenance risk.
8. Operations split pages are well-scoped read/monitor/control surfaces with disabled deferred mutations and live fetchers, but the missing composite route blocks natural discovery.
9. Ads Manager is useful as a planning and readiness page, but it is less complete than the main studios because budget and metric edits are local-only and no durable ad plan is saved.
10. CSS has good responsive coverage, but too much page-specific styling is concentrated in `12-pages.css` plus override layers. This makes layout behavior harder to reason about page by page.

## Page Audits

### Home / Dashboard

- Route ID: `home`
- Files: `public/control-center/pages/home.js`, `public/control-center/styles/13-home-executive.css`, shared styles
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 7
- Responsive readiness score: 8
- Purpose: Executive dashboard for readiness, next best action, activity, and quick routing.
- Purpose clarity: Strong. The user sees project readiness, blockers, AI prompts, and common next actions quickly.
- Main strengths: Next-best-action model, readiness/status cards, AI prompt cards, route buttons to Setup, Library, Integrations, Campaign Studio, and AI Command.
- Main gaps: `homeOpenOperationsBtn` navigates to `operations-centers`, which is not registered.
- Missing connections: Composite operations destination should route to `task-center` or a registered Operations overview.
- Missing actions: No direct "Monitor jobs" or "Open queue" primary action on the operations card.
- Confusing labels: "Open Operations" suggests a real page that currently falls through to "Unknown route".
- Layout risks: Dense dashboard but responsive CSS exists.
- Operating model support: Strong Observe and Decide; Draft via AI; Route mostly works except Operations.
- New design direction fit: Good, but less polished than AI Team room.
- Priority: P1 High
- Recommended safe next patch: Replace `operations-centers` references with a registered route or register an Operations overview route after reporting the route decision.

### Setup

- Route ID: `setup`
- Files: `public/control-center/pages/setup.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 7
- AI Team connection score: 7
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Configure project identity, market, audience, offer, setup completeness, and launch dependencies.
- Purpose clarity: Strong. The wizard structure and readiness panels make setup intent clear.
- Main strengths: Required-field scoring, dependency gaps, business template application, backend save, continuation to Library, Integrations, Campaign Studio, and AI Command.
- Main gaps: Some AI helper buttons are local heuristic draft helpers rather than true AI Team calls.
- Missing connections: Could add "Review setup with System Setup Assistant" as a clear AI Team handoff.
- Missing actions: No direct "Create missing setup tasks" action into Task Center.
- Confusing labels: AI labels should distinguish "local draft help" from central AI Team review.
- Layout risks: Form-heavy, but sectioned and manageable.
- Operating model support: Strong Observe, Decide, Draft; Route to work areas works.
- New design direction fit: Good but should inherit AI Team's clearer specialist framing.
- Priority: P2 Medium
- Recommended safe next patch: Add a standard AI Team prompt handoff label and optional Task Center route for setup gaps.

### AI Command / AI Team Command Center

- Route ID: `ai-command`
- Files: `public/control-center/pages/ai-command.js`
- Current status: Mostly Complete
- UX clarity score: 9
- System power score: 9
- AI Team connection score: 10
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Central specialist team room for asking, drafting, reviewing, routing, and safe execution preparation.
- Purpose clarity: Excellent. Specialist rail, composer, output workspace, status flow, and safety copy make the role obvious.
- Main strengths: Specialist definitions, tool map, response bridge, output preview, route suggestions, safety boundaries, team mode, voice readiness, and durable AI draft persistence.
- Main gaps: `applyDurableAiHandoff()` is defined but not called in the current render flow; render consumes only `quickCommandInput`. `customer_ops` guidance routes to missing `operations-centers`. `research` alias maps to `researcher`, which has no specialist definition.
- Missing connections: Needs a standardized inbound handoff reader for pages that set shared handoff instead of global quick input.
- Missing actions: No registered route for Customer Operations / Operations Centers output destination.
- Confusing labels: "Operations Centers" label exists even though no route exists.
- Layout risks: Strong responsive media queries, but many override blocks in `12-pages.css`.
- Operating model support: Best-in-system support for Ask -> Draft -> Review -> Route -> Monitor.
- New design direction fit: Baseline page.
- Priority: P1 High
- Recommended safe next patch: Standardize inbound AI handoff handling, add `research -> analyst` alias or real Research specialist, and resolve `operations-centers` destination.

### Library / Brand Assets

- Route ID: `library`
- Files: `public/control-center/pages/library.js`, `public/control-center/pages/library/*`
- Current status: Mostly Complete / Risky
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 7
- Responsive readiness score: 7
- Purpose: Smart Asset Library for readiness, upload, classification, preview, status, source-of-truth, archive, and soft delete.
- Purpose clarity: Strong for asset operators. It shows required assets, upload, finder, preview, action panel, and AI panel.
- Main strengths: Backend upload, protected previews, asset status updates, source of truth, archive/delete with confirmations, AI prompts for classify/missing/extract.
- Main gaps: Grid pagination handler references `nextId` without defining it. Several dynamic ID patterns require runtime uniqueness checks. Asset-to-Content/Media/Publishing handoff is less prominent than asset management.
- Missing connections: Should expose "Send selected asset to Media Director", "Review claims with Compliance", and "Use in Content Studio".
- Missing actions: Handoff to Content Studio and Media Studio should be explicit for selected asset.
- Confusing labels: "Extract with AI" should specify review-only extraction and no automatic claim use.
- Layout risks: Complex workspace with right rail and heavy cards; many library styles are in shared `14-page-standard.css` and `12-pages.css`.
- Operating model support: Strong Observe/Review; Draft and Route need clearer destinations.
- New design direction fit: Professional but less calm than AI Team room.
- Priority: P0 Critical for pagination bug; P1 for workflow handoffs
- Recommended safe next patch: Fix undefined `nextId` in grid pagination handler and add selected-asset handoff labels.

### Campaign Studio

- Route ID: `campaign-studio`
- Files: `public/control-center/pages/campaign-studio.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 9
- AI Team connection score: 9
- Page-to-page workflow score: 9
- Responsive readiness score: 8
- Purpose: Campaign planning and execution workspace for launch waves, objectives, channels, readiness, and downstream routing.
- Purpose clarity: Strong. It immediately reads as the campaign command surface.
- Main strengths: Smart overview, readiness, channel planning, campaign persistence, AI prompt bridge, and downstream handoffs to Content, Media, Publishing, Ads, Library, Integrations, and Insights.
- Main gaps: Autosave behavior through `saveProjectCampaign` may be surprising if not clearly indicated.
- Missing connections: Could provide more explicit specialist chips: Strategist, Writer, Ads Optimizer, Publisher.
- Missing actions: "Create launch tasks" to Task Center would complete the route.
- Confusing labels: Save/autosave state should be more explicit.
- Layout risks: Dense but coherent.
- Operating model support: Very strong Decide, Draft, Route.
- New design direction fit: Strong.
- Priority: P2 Medium
- Recommended safe next patch: Clarify save/autosave state and add "Create campaign tasks" route.

### Content Studio

- Route ID: `content-studio`
- Files: `public/control-center/pages/content-studio-workspace.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 5
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Draft, improve, translate/adapt, validate, version, save, and route content.
- Purpose clarity: Strong.
- Main strengths: Composer, content modes, preview, versioning, agent buttons, approvals/tasks/handoffs, save to Library, route to Media and Publishing.
- Main gaps: "Open AI: Send Context to AI Workspace" uses shared handoff and shared draft, but does not set `quickCommandInput`; AI Command's durable handoff reader is not invoked in render, so the AI page can open without the expected prompt.
- Missing connections: Needs reliable Writer, SEO/Insights, Compliance, and Publisher handoff semantics.
- Missing actions: "Review claims with Compliance" and "Create publishing review task" should be first-class.
- Confusing labels: The AI handoff label implies context transfer is complete, but the bridge may not actually populate the AI composer.
- Layout risks: Multi-panel density; source-level duplicate `contentHandoffPanel` appears in conditional branches.
- Operating model support: Strong Draft/Review/Route; AI bridge blocks the strongest flow.
- New design direction fit: Good, but AI Team connection must match central room behavior.
- Priority: P1 High
- Recommended safe next patch: Set `quickCommandInput` or make AI Command consume shared handoff reliably for content handoff buttons.

### Media Studio

- Route ID: `media-studio`
- Files: `public/control-center/pages/media-studio-workspace.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 9
- AI Team connection score: 5
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Generate, review, approve, version, and route image/video/voice/campaign media work.
- Purpose clarity: Strong.
- Main strengths: Multi-format generation, prompt tools, API readiness, queue, output preview, approval/task creation, and publishing handoff.
- Main gaps: AI send buttons use shared handoff/draft without setting `quickCommandInput`; AI Command may open empty. Source-level duplicate IDs `mediaQueuePanel` and `mediaOutputPreviewPanel` are present in alternate branches.
- Missing connections: Needs reliable Media Director, Video Lead, Compliance, and Publisher handoffs.
- Missing actions: "Review with Compliance" should be prominent for generated media.
- Confusing labels: "Generate Output" is guarded by backend readiness, but should remain visibly draft/review oriented.
- Layout risks: Complex right rail and repeated panels; responsive readiness is reasonable but needs screenshot validation.
- Operating model support: Strong Draft/Review/Route; AI bridge gap limits cross-page power.
- New design direction fit: Strong, but denser than AI Team.
- Priority: P1 High
- Recommended safe next patch: Standardize AI handoff bridge and runtime duplicate ID verification for conditional panels.

### Publishing

- Route ID: `publishing`
- Files: `public/control-center/pages/publishing.js`
- Current status: Mostly Complete / Risky
- UX clarity score: 7
- System power score: 8
- AI Team connection score: 5
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Prepare, queue, approve, schedule, publish, fail, and monitor publishing items.
- Purpose clarity: Good. It reads as the execution page.
- Main strengths: Queue, builder, calendar, asset gate, backend schedule/reschedule/approve/publish/fail actions, confirmations for publish/fail.
- Main gaps: AI send uses shared handoff/draft without setting `quickCommandInput`; local "publish" actions can still look close to real publishing unless labels are very clear.
- Missing connections: Needs Publisher, Compliance, and Operations Lead buttons.
- Missing actions: "Send to Queue Center" and "Monitor in Job Monitor" should be direct next steps.
- Confusing labels: "Send publishing context to AI" can fail to carry visible context; local vs backend publishing should be clearer.
- Layout risks: Execution controls are dense and must stay visually separated from draft/local actions.
- Operating model support: Strong Route/Execute/Monitor; AI bridge and action clarity need tightening.
- New design direction fit: Good.
- Priority: P1 High
- Recommended safe next patch: Fix AI bridge and add explicit Queue Center / Job Monitor next actions.

### Workflows

- Route ID: `workflows`
- Files: `public/control-center/pages/workflows.js`
- Current status: Partial / Mostly Complete
- UX clarity score: 7
- System power score: 7
- AI Team connection score: 8
- Page-to-page workflow score: 8
- Responsive readiness score: 7
- Purpose: Prepare and route repeatable workflow packages for campaign, content, media, publishing, reporting, research, and integrations.
- Purpose clarity: Good in the current active simplified surface.
- Main strengths: Workflow catalog, required inputs, package preparation, quick AI bridge, Task Center routing, destination map.
- Main gaps: Older execution-loop helpers remain in file but are not mounted. The dormant `renderWorkflowExecutionLoop()` calls `renderAutomationSection(automationPlan, autoFixPlan, escapeHtml)` even though the function signature includes `autoMode` before `escapeHtml`, so it would render stale auto-mode state if reactivated. `research-competitors` uses `aiModeId: "researcher"` while AI Command lacks a researcher specialist.
- Missing connections: Needs Operations Lead and Full Team labels aligned with AI Command specialists.
- Missing actions: If execution-loop automation is intentionally retired, remove or archive old helper surface in a future cleanup.
- Confusing labels: "Prepare Current Workflow" is safe; old code still includes "Run Workflow" concepts not mounted.
- Layout risks: Current surface is manageable; file-level legacy code raises maintenance risk.
- Operating model support: Strong Decide/Route; Execute mostly deferred.
- New design direction fit: Good but should adopt the AI Team specialist vocabulary.
- Priority: P1 High
- Recommended safe next patch: Map research workflow to `analyst` or add Research specialist; document/remove unmounted legacy execution loop in a scoped cleanup.

### Task Center

- Route ID: `task-center`
- Files: `public/control-center/pages/operations-centers.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Review durable tasks by priority, owner, status, due state, and linked operational entities.
- Purpose clarity: Strong.
- Main strengths: Live fetcher, task filters, selected detail, action panel, route buttons, AI operations prompts, disabled deferred mutations.
- Main gaps: No composite Operations landing route; users must know the split route.
- Missing connections: Good AI prompt buttons, but plain "Open AI" does not preload context.
- Missing actions: Task mutation actions remain deferred.
- Confusing labels: Deferred actions are clearly marked.
- Layout risks: Table width on mobile requires validation, but CSS includes responsive treatment.
- Operating model support: Strong Execute/Monitor.
- New design direction fit: Good.
- Priority: P2 Medium
- Recommended safe next patch: Add route discovery and preloaded AI prompt for selected task.

### Queue Center

- Route ID: `queue-center`
- Files: `public/control-center/pages/operations-centers.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Inspect workflow/content/media/approval/publishing/sync queues and route items to owner pages.
- Purpose clarity: Strong.
- Main strengths: Live fetcher, queue counts, filters, selected detail, route actions, disabled dangerous queue mutations.
- Main gaps: No top-level Operations overview.
- Missing connections: AI prompt buttons work; open-only AI button should preload selected queue context.
- Missing actions: Retry/approve/publish/remove are disabled by design.
- Confusing labels: Deferred labels are clear.
- Layout risks: Table density on mobile.
- Operating model support: Strong Route/Monitor.
- New design direction fit: Good.
- Priority: P2 Medium
- Recommended safe next patch: Add selected item prompt to generic Open AI button.

### Job Monitor

- Route ID: `job-monitor`
- Files: `public/control-center/pages/operations-centers.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Monitor jobs, failures, retries, logs, running state, and execution health.
- Purpose clarity: Strong.
- Main strengths: Live fetcher, job filters, selected details, logs, route action, AI diagnostics prompts.
- Main gaps: Mutation controls remain deferred.
- Missing connections: AI open button should preload selected job/failure context.
- Missing actions: Retry/cancel/restart are disabled until backend safety policy is ready.
- Confusing labels: Deferred action labels are clear.
- Layout risks: Log display and table density need mobile validation.
- Operating model support: Strong Monitor.
- New design direction fit: Good.
- Priority: P2 Medium
- Recommended safe next patch: Add selected job context to Open AI.

### Notification Center

- Route ID: `notification-center`
- Files: `public/control-center/pages/operations-centers.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 8
- Responsive readiness score: 8
- Purpose: Review sync failures, approvals, publish events, provider disconnects, claim risks, and alerts.
- Purpose clarity: Strong.
- Main strengths: Live fetcher, filters, selected detail, route buttons, AI prompts, backend mark-read action.
- Main gaps: Resolve/dismiss/delete actions are deferred.
- Missing connections: Generic Open AI should preload selected notification.
- Missing actions: Acknowledge/resolve/dismiss/delete are disabled by design.
- Confusing labels: Deferred labels are clear.
- Layout risks: Similar table-density risk.
- Operating model support: Strong Monitor/Route.
- New design direction fit: Good.
- Priority: P2 Medium
- Recommended safe next patch: Preload selected notification into AI prompt.

### Integrations

- Route ID: `integrations`
- Files: `public/control-center/pages/integrations.js`, `public/control-center/pages/integrations/*`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 6
- Page-to-page workflow score: 7
- Responsive readiness score: 7
- Purpose: Connector health, setup, testing, sync, imports, disconnects, and launch diagnostics.
- Purpose clarity: Strong.
- Main strengths: Connector model, next best integration action, setup drawer, backend connect/reconnect/test/sync/import/disconnect, unsupported providers marked, disconnect confirmation.
- Main gaps: AI support is mostly diagnostics prompt buttons, not a visible Operations Lead specialist handoff. Empty integrations CSS subfiles suggest planned modular styles are not used.
- Missing connections: Operations Lead, provider-specific specialist, Customer Ops for CRM/email providers.
- Missing actions: Route integration failures directly to Workflows or Task Center.
- Confusing labels: Unsupported connectors say "Open setup"; they should stay visibly planned/backend-unavailable.
- Layout risks: Drawer and dense connector grids need mobile validation.
- Operating model support: Strong Observe/Execute; Route could be stronger.
- New design direction fit: Good.
- Priority: P2 Medium
- Recommended safe next patch: Add "Ask Operations Lead to repair this connector" and route failures to Workflows/Task Center.

### Settings

- Route ID: `settings`
- Files: `public/control-center/pages/settings.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 7
- Page-to-page workflow score: 7
- Responsive readiness score: 7
- Purpose: Configure project defaults, operating modes, AI behavior, publishing rules, approvals, sync, team roles, and governance bridge.
- Purpose clarity: Strong.
- Main strengths: Rich defaults, durable save to team and governance policy, confirmation before save, governance handoff, AI prompts, section summary/risk model.
- Main gaps: Generic Open AI action does not preload context. Render replaces `pageRoot` rather than mounting within the route template, which works but differs from simpler page patterns.
- Missing connections: System Setup Assistant / Operations Lead should be explicit.
- Missing actions: "Create governance review task" could be useful after saving.
- Confusing labels: "Full AI Assist" and automation modes need careful copy so authority is understood.
- Layout risks: Form-heavy and long; needs responsive screenshot pass.
- Operating model support: Strong Decide/Review; route to Governance works.
- New design direction fit: Good.
- Priority: P2 Medium
- Recommended safe next patch: Make generic AI open preload a settings summary prompt.

### Governance

- Route ID: `governance`
- Files: `public/control-center/pages/governance.js`
- Current status: Mostly Complete / Risky
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 7
- Page-to-page workflow score: 7
- Responsive readiness score: 7
- Purpose: Approval queue, policy rules, owners, violations, overrides, escalation, and audit visibility.
- Purpose clarity: Strong.
- Main strengths: Backend governance fetch, policy save, settings sync, approval request creation, approval decisions, AI guidance prompts.
- Main gaps: Approval decisions including override execute backend mutations without a confirmation dialog.
- Missing connections: Compliance Reviewer and Operations Lead labels should be first-class.
- Missing actions: Route selected governance item to Task Center as follow-up task.
- Confusing labels: "Override" needs stronger confirmation and authority copy.
- Layout risks: Dense table plus policy controls in right rail.
- Operating model support: Strong Review/Execute; needs safer decision gate.
- New design direction fit: Good.
- Priority: P1 High
- Recommended safe next patch: Add confirmation dialogs for approval decisions, especially override/escalate/reject.

### Insights

- Route ID: `insights`
- Files: `public/control-center/pages/insights.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 8
- Responsive readiness score: 7
- Purpose: Cross-platform performance, learning, SEO, paid, website, and optimization intelligence.
- Purpose clarity: Strong.
- Main strengths: Platform models, refresh via `fetchProjectInsights`, AI prompts, durable handoff creation, routes to Campaign, Content, Ads, and Publishing.
- Main gaps: Generic Open AI button does not preload context; prompt buttons do.
- Missing connections: SEO/Insights Analyst is clear in AI Command but should be visible on the page.
- Missing actions: "Create optimization workflow" to Workflows should be direct.
- Confusing labels: Route buttons use "Navigate:" prefix, which is accurate but less polished.
- Layout risks: Data tables/cards need responsive validation.
- Operating model support: Strong Observe/Decide/Route.
- New design direction fit: Good.
- Priority: P2 Medium
- Recommended safe next patch: Add "Ask Analyst" primary handoff and Workflows route.

### Research

- Route ID: `research`
- Files: `public/control-center/pages/research.js`
- Current status: Mostly Complete
- UX clarity score: 8
- System power score: 8
- AI Team connection score: 8
- Page-to-page workflow score: 8
- Responsive readiness score: 7
- Purpose: Market, audience, competitor, SEO, opportunity, and research intelligence hub.
- Purpose clarity: Strong.
- Main strengths: Fetches Insights and Learning, builds opportunities/risks/keywords/audience context, routes to Campaign, Content, SEO Workflow, Ads, and AI with persisted handoffs.
- Main gaps: AI mode semantics use analyst/research ideas inconsistently across Workflows and AI Command.
- Missing connections: Either add Research specialist or map research outputs to SEO & Insights Analyst.
- Missing actions: Route research recommendations to Task Center for execution tracking.
- Confusing labels: "SEO Workflow" routes to Workflows but AI mode elsewhere says `researcher`.
- Layout risks: Many sections and cards; mobile scan needed.
- Operating model support: Strong Observe/Decide/Route.
- New design direction fit: Good.
- Priority: P2 Medium, P1 if fixing AI mode consistency
- Recommended safe next patch: Standardize research AI specialist mapping to Analyst or add a Researcher specialist.

### Ads Manager

- Route ID: `ads-manager`
- Files: `public/control-center/pages/ads-manager.js`
- Current status: Partial
- UX clarity score: 7
- System power score: 6
- AI Team connection score: 6
- Page-to-page workflow score: 6
- Responsive readiness score: 7
- Purpose: Paid media readiness, budget planning, pacing metrics, creative mapping, and AI ad prompts.
- Purpose clarity: Good.
- Main strengths: Platform readiness derived from integrations/assets/jobs, budget defaults, performance metric inputs, AI prompts, routes to Publishing and Library.
- Main gaps: Budget and metric edits are local-only. No durable ad plan save, task creation, handoff persistence, or direct route to Campaign/Content.
- Missing connections: Ads Optimizer specialist should be explicit; route to Strategist and Publisher should exist.
- Missing actions: Save ad plan, create ad test task, send creative request to Content/Media.
- Confusing labels: It can look more operational than it is because metric edits do not persist.
- Layout risks: Medium density.
- Operating model support: Observe/Decide only; Draft/Route weaker.
- New design direction fit: Adequate but less powerful than studios.
- Priority: P1 High
- Recommended safe next patch: Add durable ad plan/task/handoff or clearly label as planning-only until backend exists.

### Operations Centers Composite

- Route ID: `operations-centers`
- Files: referenced by `home.js` and `ai-command.js`; not registered in `router.js`
- Current status: Broken / Missing
- UX clarity score: 2
- System power score: 7 if implemented via split pages; 1 as current route
- AI Team connection score: 4
- Page-to-page workflow score: 2
- Responsive readiness score: Not applicable
- Purpose: Intended top-level operations hub for task, queue, job, notification, and Customer Ops paths.
- Purpose clarity: Blocked by missing route.
- Main strengths: Split operations pages exist and are good.
- Main gaps: Composite route is absent; user lands on fallback unknown route.
- Missing connections: Home and AI Command customer ops outputs need valid destinations.
- Missing actions: Operations landing page or route alias.
- Confusing labels: "Operations Centers" appears real in AI Command route labels and Home actions.
- Layout risks: Not applicable until route exists.
- Operating model support: Blocked at navigation.
- New design direction fit: Missing.
- Priority: P0 Critical
- Recommended safe next patch: Register an Operations overview route or change all references to `task-center` with clear labels.

### Customer Operations

- Route ID: Missing / Planned
- Files: tracked indirectly in `ai-command.js`, Integrations CRM/email connectors, recent git history for customer operations backend/read-only routes
- Current status: Planned / Not mounted as a frontend page in current router
- UX clarity score: 3
- System power score: 5
- AI Team connection score: 7
- Page-to-page workflow score: 3
- Responsive readiness score: Not applicable
- Purpose: Customer inbox, reply drafts, ticket drafts, SLA risk, Sales/CRM handoff, and escalation routing.
- Purpose clarity: Present in AI Team but not exposed as a page.
- Main strengths: AI Command has Customer Operations Lead and Sales/CRM Lead specialists with safe draft/review boundaries.
- Main gaps: No registered frontend Customer Ops page in audit target; no live UI route confirmed.
- Missing connections: Customer Ops should route to Task Center and Sales/CRM workflows until real backend actions are connected.
- Missing actions: Review-only inbox/ticket/CRM surfaces.
- Confusing labels: AI Command routes customer ops non-task output to missing `operations-centers`.
- Layout risks: Not applicable.
- Operating model support: Draft/Review possible through AI Team; Execute blocked.
- New design direction fit: AI Team side is strong; page is missing/planned.
- Priority: P1 High after route fix
- Recommended safe next patch: Keep Customer Ops actions draft/review only and route outputs to Task Center or a registered read-only Customer Ops page.

## Source-Level Duplicate ID Scan

Command:

```bash
grep -o 'id="[^"]*"' public/control-center/pages/*.js | sort | uniq -c | sort -nr | sed -n '1,160p'
```

Top findings:

```text
6 public/control-center/pages/media-studio-workspace.js:id="${escapeHtml(item.id)}"
5 public/control-center/pages/publishing.js:id="${escapeHtml(item.id)}"
5 public/control-center/pages/library.js:id="${escapeHtml(asset.id || asset.asset_id || "
5 public/control-center/pages/governance.js:id="${escapeHtml(selectedItem.id)}"
5 public/control-center/pages/governance.js:id="${escapeHtml(item.id)}"
4 public/control-center/pages/settings.js:id="${fieldId}"
3 public/control-center/pages/media-studio-workspace.js:id="${escapeHtml(id)}"
2 public/control-center/pages/setup.js:id="setup-${escapeHtml(name)}"
2 public/control-center/pages/settings.js:id="settings-section-${section.id}"
2 public/control-center/pages/media-studio-workspace.js:id="mediaQueuePanel"
2 public/control-center/pages/media-studio-workspace.js:id="mediaOutputPreviewPanel"
2 public/control-center/pages/content-studio-workspace.js:id="contentHandoffPanel"
2 public/control-center/pages/campaign-studio.js:id="campaign-${escapeHtml(name)}"
```

Interpretation: Most high-count items are dynamic IDs inside repeated data rows or mutually exclusive branches. The source scan still flags Media Studio and Content Studio conditional duplicate panel IDs for runtime verification.

## Route Registration Findings

Registered routes in `router.js`:

- `home`
- `ai-command`
- `workflows`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`
- `campaign-studio`
- `content-studio`
- `media-studio`
- `publishing`
- `ads-manager`
- `insights`
- `research`
- `setup`
- `library`
- `integrations`
- `settings`
- `governance`

Referenced but not registered:

- `operations-centers`

Impact:
- Home "Open Operations" hits fallback unknown route.
- AI Command Customer Operations non-task destination can hit fallback unknown route.
- The workflow model is blocked for the "Monitor/Operations overview" path.

## App Wiring Findings

`app.js` passes a broad render context into routes:

- Fetchers: `fetchProjectInsights`, `fetchProjectLearning`, `fetchProjectOperations`, `fetchProjectTaskCenter`, `fetchProjectQueueCenter`, `fetchProjectJobMonitor`, `fetchProjectNotificationCenter`
- Setup/campaign/workflow: `saveProjectSetup`, `saveProjectCampaign`, `runProjectWorkflow`, `runProjectAiWorkflow`
- AI: `executeProjectAiCommand`
- Integrations: `connectProjectIntegration`, `reconnectProjectIntegration`, `testProjectIntegration`, `syncProjectIntegration`, `importProjectIntegrationHistory`, `disconnectProjectIntegration`
- Operations: `createProjectTask`, `createProjectApproval`, `createProjectHandoff`, `consumeProjectHandoff`, `markProjectNotification`
- Publishing: `savePublishingSchedule`, `reschedulePublishingItem`, `approvePublishingItem`, `publishPublishingItem`, `failPublishingItem`

Direct API imports in pages are common:

- Content Studio directly imports content, task, approval, handoff, and event APIs.
- Media Studio directly imports media generation, task, approval, handoff, and event APIs.
- Library directly imports asset registry/upload/protected-preview APIs.
- Settings and Governance directly import team/governance APIs.

Interpretation: API dependencies exist and are real, but app wiring is not the single source of truth for page dependencies. This is workable but makes audits harder.

## API Dependency Findings

`api.js` includes real functions for:

- Core project loading
- Insights, learning, operations
- Setup and business templates
- Library asset catalog, upload, refresh, status, rename, source-of-truth, archive, soft delete
- Workflows and AI workflow execution
- AI command and AI guidance
- Tasks and approvals
- Governance and policy
- Integrations connect/reconnect/test/sync/import/disconnect
- Publishing schedule/reschedule/approve/publish/fail
- Operations centers fetchers
- Team settings
- Campaign/content/media/handoff/event APIs

Notable gap:
- `fetchProjectOperationsSchema()` exists in API exports but is not passed through app render context.
- Several API functions are not passed to context because pages import them directly.

## CSS/Layout Findings

- Current styles are concentrated in `12-pages.css` (6011 lines), `14-page-standard.css` (2452 lines), `09-operations-centers.css` (1565 lines), plus page foundation files.
- `public/control-center/styles/integrations/*.css` files are present but empty.
- AI Command has many late responsive override blocks in `12-pages.css`, including `!important` rules and repeated breakpoint sections.
- Page-scoped selectors are common (`[data-page="..."]`), which is good, but old polish layers and generic card rules can still collide.
- Responsive rules exist for major surfaces, but screenshot/device validation should be required before declaring production-ready.

## Safe Patch Policy

No source patches were applied in this task. Proposed safe patches are listed in `SAFE_UPGRADE_SEQUENCE.md`.


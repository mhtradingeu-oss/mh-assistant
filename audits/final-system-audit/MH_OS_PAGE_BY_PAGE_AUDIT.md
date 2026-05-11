# MH-OS / MH Assistant Page-by-Page Audit
Date: 2026-05-11
Mode: Read-only repository audit
Doctrine: Backend owns operational authority. Frontend projects operational authority.

Legend:
- Confirmed: verified directly from repository files.
- Assumption: plausible but not fully proven from current repository evidence.

## Home
- Purpose of the page: Executive operating surface for project status, team visibility, activity, and next-step framing.
- Current capabilities: Renders executive intro, AI team cards, activity items, blocker lists, badges, and projected role/team information from state.
- Backend APIs used: Indirect. Depends on app-level overview, readiness, operations, and insights payloads already fetched into state.
- Frontend risks: Local status/tone mapping and recommendation framing still happen in page logic; page relies on shell-level projections rather than a dedicated backend view model.
- UX problems: Strong summary surface, but not yet a standardized operating page with persistent Action Panel and AI Panel.
- Missing smart tools: Durable recommendation provenance, operator ownership lane, and memory/history visibility.
- Missing AI team experience: AI team is visible, but not shown as a live operational graph of ownership, handoffs, and review queues.
- Missing action panel: Confirmed missing as a persistent dedicated lane.
- Missing AI panel: Confirmed missing as a persistent dedicated lane.
- What should be improved before calling it complete: Convert it from a summary dashboard into a stable operating header plus live decision/action surface fed by backend snapshots.
- Current state: Stable enough to use, not final.
- Backend dependency: High via projected state.
- Completion checklist:
  - Remove local decision heuristics where backend projections can replace them.
  - Add persistent Action Panel and AI Panel.
  - Show durable next-best-action provenance and ownership.
- Priority: P2

## Setup
- Purpose of the page: Capture project operating context, business basics, market/language defaults, and readiness-critical setup data.
- Current capabilities: Multi-step setup wizard, completeness scoring, readiness indicators, missing field actions, and project template application.
- Backend APIs used: saveProjectSetup and applyProjectBusinessTemplate through api.js, plus app-level core payload refresh.
- Frontend risks: Heavy local draft persistence via localStorage, dense manual DOM bindings, and page-local completeness logic.
- UX problems: Feels like a setup form flow, not yet the final operating surface.
- Missing smart tools: Stronger AI-assisted completion grounded in existing backend memory and project context.
- Missing AI team experience: Little explicit ownership or role routing beyond the setup task itself.
- Missing action panel: Confirmed missing as a stable persistent lane.
- Missing AI panel: Confirmed missing as a stable persistent lane.
- What should be improved before calling it complete: Standardize the shell pattern, reduce listener density, and shift completion/recommendation logic into backend projections where practical.
- Current state: Functionally useful, architecturally partial.
- Backend dependency: Medium to high.
- Completion checklist:
  - Keep setup persistence backend-backed.
  - Reduce page-local authority and draft assumptions.
  - Add standardized side panels and next-best-action support.
- Priority: P1

## Library
- Purpose of the page: Asset operating surface for upload, review, classification, source-of-truth marking, and downstream readiness.
- Current capabilities: Upload, rename, archive, delete, status changes, source-of-truth actions, protected media retrieval, folder views, document/image preview, and required asset readiness guidance.
- Backend APIs used: uploadProjectAsset, refreshProjectLibrary, renameProjectAsset, archiveProjectAsset, deleteProjectAsset, setProjectAssetSourceOfTruth, updateProjectAssetStatus, fetchProtectedMediaBlob.
- Frontend risks: Very large single page file, multiple document/window listeners, manual overlay creation, many route-render bindings, and local asset/session caches.
- UX problems: Dense and feature-rich, but not yet decomposed into an intentional operating system pattern.
- Missing smart tools: Stronger AI-assisted asset triage, gap resolution, and cross-page handoff intelligence.
- Missing AI team experience: Limited durable owner/reviewer representation relative to backend team model.
- Missing action panel: Confirmed missing as a persistent right-side operational lane.
- Missing AI panel: Confirmed missing as a persistent right-side assistant lane.
- What should be improved before calling it complete: Split into smaller modules, stabilize listener lifecycle ownership, and surface backend readiness and handoff state more directly.
- Current state: Functionally rich, architecturally risky.
- Backend dependency: High.
- Completion checklist:
  - Break out list/grid/upload/review modules.
  - Eliminate stray global listener risk.
  - Align asset actions to a standard Action Panel and AI Panel layout.
- Priority: P0

## Integrations
- Purpose of the page: Control center for provider connection, sync health, diagnostics, and readiness coverage.
- Current capabilities: Connect, reconnect, test, sync, import history, disconnect, diagnostics, recommendation prompts, and grouped provider catalog views.
- Backend APIs used: fetchProjectIntegrationControlCenter, connectProjectIntegration, reconnectProjectIntegration, testProjectIntegration, syncProjectIntegration, importProjectIntegrationHistory, disconnectProjectIntegration.
- Frontend risks: Complex page-local integration catalog and connection form logic; drawer escape handling and many render-time bindings.
- UX problems: Strong catalog but not yet normalized to the final operating surface.
- Missing smart tools: Better AI-guided connector recovery and backend-driven provider support tiering.
- Missing AI team experience: Ownership/escalation exists in backend operations but is not strongly surfaced in-page.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Make supported versus unsupported provider states explicit, project diagnostics more cleanly from backend, and standardize operator actions.
- Current state: Broad and useful, not fully consolidated.
- Backend dependency: High.
- Completion checklist:
  - Preserve backend authority over connector status and auth flows.
  - Surface unsupported-provider state clearly.
  - Add standardized Action Panel and AI Panel.
- Priority: P1

## AI Command
- Purpose of the page: General AI operating surface for prompts, role-based modes, and AI-generated routing/handoff actions.
- Current capabilities: Execute AI commands, route outputs, create drafts, create handoffs, use quick templates, and map prompts to page targets.
- Backend APIs used: executeProjectAiCommand plus projected operations/insights/learning state.
- Frontend risks: Local MODE_DEFS and mode alias tables duplicate backend team/service semantics; page decides a lot about AI role presentation itself.
- UX problems: AI experience is page-local rather than shell-native.
- Missing smart tools: Better durable artifact timeline, memory lane, and recommendation provenance in-page.
- Missing AI team experience: Visible but duplicated; not fully driven by backend team model.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: The page is itself AI-heavy, but a standardized shell AI panel is still missing.
- What should be improved before calling it complete: Replace local mode/team definitions with backend-projected team/service data and standardize output routing into the operating shell.
- Current state: Feature-rich but authority-duplicative.
- Backend dependency: High.
- Completion checklist:
  - Remove canonical team logic from the page.
  - Use backend-projected team/mode data for role selection.
  - Expose AI memory, recommendations, and artifacts more durably.
- Priority: P0

## Workflows
- Purpose of the page: Workflow launch, automation planning, Auto Mode control, and cross-page routing.
- Current capabilities: Run workflow, run AI workflow, build automation plans, start/pause/resume/stop Auto Mode, approve or skip gated steps, create handoffs.
- Backend APIs used: runProjectWorkflow, runProjectAiWorkflow, createProjectHandoff, plus projected operations and shared context.
- Frontend risks: High authority-adjacent orchestration lives in the frontend automation engine and page-local workflow catalog.
- UX problems: Workflow control is powerful but not yet a clean execution console with dedicated action and AI rails.
- Missing smart tools: Better durable execution history and backend-authored automation plan contracts.
- Missing AI team experience: Workflow ownership exists conceptually, but the page still owns too much of the orchestration model.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Push canonical workflow semantics further into backend projections and keep frontend as operator control/view.
- Current state: Powerful, but one of the biggest architecture risks.
- Backend dependency: High, but mixed with frontend orchestration.
- Completion checklist:
  - Reduce local workflow authority.
  - Keep safety gates while moving planning semantics backend-side.
  - Adopt the standard operating layout.
- Priority: P0

## Campaign Studio
- Purpose of the page: Plan campaigns, waves, channels, and downstream routing to content, media, publishing, and ads.
- Current capabilities: Campaign record editing, wave planning, route handoff creation, asset readiness review, and downstream routing shortcuts.
- Backend APIs used: saveProjectCampaign, createProjectHandoff, plus projected state and shared context.
- Frontend risks: Local CAMPAIGN_ROLE_DEFAULTS and page-local routing roles duplicate backend service-domain ownership.
- UX problems: Planning-heavy workspace, but not yet a final operating surface with persistent adjacent decision lanes.
- Missing smart tools: Better AI-assisted planning grounded in backend recommendations and performance signals.
- Missing AI team experience: Ownership hints exist, but durable team workflow is not first-class in the page.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Replace local role defaults with backend projections and show handoff/approval implications more clearly.
- Current state: Usable but not fully aligned.
- Backend dependency: Medium to high.
- Completion checklist:
  - Keep campaign authority in backend records.
  - Reduce local route-role ownership logic.
  - Add standardized action and AI side panels.
- Priority: P1

## Content Studio
- Purpose of the page: Draft, revise, approve, and route content outputs.
- Current capabilities: Save content items, run AI improvements, create approvals, decide approvals, create handoffs, create tasks, and route outputs to media/publishing.
- Backend APIs used: saveProjectContentItem, executeProjectAiCommand, createProjectApproval, decideProjectApproval, createProjectHandoff, createProjectTask, fetchProjectOperations, listProjectApprovals, listProjectContentItems, listProjectEvents, listProjectHandoffs, listProjectTasks.
- Frontend risks: Very large page file, local role defaults, page-local writing agent catalog, local draft persistence, and many route-render bindings.
- UX problems: Dense authoring/review page without final shell-level side-panel consistency.
- Missing smart tools: Persistent AI memory, revision intelligence, and approval rationale surfacing.
- Missing AI team experience: Page-local specialist framing is stronger than durable team visualization.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Modularize composer/review/handoff areas and replace local ownership defaults with backend projections.
- Current state: Broad capability, high regression risk.
- Backend dependency: High.
- Completion checklist:
  - Preserve backend approval and handoff authority.
  - Reduce page-local role and agent duplication.
  - Adopt the standard operating layout.
- Priority: P0

## Media Studio
- Purpose of the page: Generate, review, approve, and route media jobs for downstream publishing.
- Current capabilities: Improve prompts, run brand checks, generate image/video/voice/campaign pack outputs, save media jobs, create approvals, decide approvals, create handoffs, create tasks.
- Backend APIs used: improveMediaPrompt, brandCheckMedia, generateMediaImage, generateMediaVideoBrief, generateMediaVoiceScript, generateMediaCampaignPack, saveProjectMediaJob, createProjectApproval, decideProjectApproval, createProjectHandoff, createProjectTask, fetchProjectOperations, listProjectApprovals, listProjectContentItems, listProjectEvents, listProjectHandoffs, listProjectMediaJobs, listProjectTasks.
- Frontend risks: Largest page module in scope, local SPECIALISTS catalog, page-local role defaults, owner-role-by-mode logic, local draft caches, and large render/binding surface.
- UX problems: Very dense workspace, not yet simplified into the target operating-system pattern.
- Missing smart tools: Better backend-derived readiness, memory, and recommendation surfaces around output variants and approvals.
- Missing AI team experience: Visible specialist framing, but canonical team ownership is not purely projected.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Break the page into feature modules, stop treating the page as the canonical owner of specialist logic, and stabilize render and event boundaries.
- Current state: Feature-rich, highest-risk page.
- Backend dependency: High.
- Completion checklist:
  - Preserve backend job/approval/handoff authority.
  - Move specialist ownership semantics toward backend projections.
  - Standardize layout and interaction boundaries.
- Priority: P0

## Publishing
- Purpose of the page: Prepare publishing queue items, schedule them, and manage ready/published/failed states.
- Current capabilities: Schedule, reschedule, mark ready, publish, fail, review blockers, and hook into Auto Mode/automation guidance.
- Backend APIs used: savePublishingSchedule, reschedulePublishingItem, approvePublishingItem, publishPublishingItem, failPublishingItem, plus projected operations state.
- Frontend risks: Local draft maps, local automation wiring, and page-local orchestration around a safety-critical backend lane.
- UX problems: Useful operational page, but not yet the final execution surface with strong right-side decision lanes.
- Missing smart tools: Better display of approval provenance, publish guardrail reasons, and execution bridge state.
- Missing AI team experience: Publisher/compliance ownership is present conceptually but not strongly visualized.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Keep backend publish guardrails untouched while making the page a projection-first execution console.
- Current state: Safety-critical and only partially consolidated.
- Backend dependency: Very high.
- Completion checklist:
  - Do not reimplement publishing authority in the page.
  - Surface backend approval/policy reasons directly.
  - Add standardized Action Panel and AI Panel.
- Priority: P0

## Ads Manager
- Purpose of the page: Plan paid media direction, budget framing, and prompt-driven next steps for ads work.
- Current capabilities: Platform budget defaults, budget/performance entry, and prompt shortcuts into AI/other pages.
- Backend APIs used: Mostly indirect through projected overview/context state and route prompting; durable ads execution entities are not strongly evident in the current page.
- Frontend risks: More planning-local than durability-driven compared with other pages.
- UX problems: Feels more like a planning widget surface than a final operating lane.
- Missing smart tools: Stronger backend-fed spend, performance, and recommendation linkage.
- Missing AI team experience: Ads operator role exists, but page ownership is not deeply tied to durable backend workflow entities.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Tie the page to durable ads execution/planning records instead of mostly local planning inputs.
- Current state: Present but less mature than the other core execution lanes.
- Backend dependency: Partial.
- Completion checklist:
  - Strengthen backend record usage.
  - Add standard operating layout.
  - Connect recommendations and operator ownership more clearly.
- Priority: P1

## Insights
- Purpose of the page: View insights, performance summaries, and recommendations across channels.
- Current capabilities: Platform views, recommendation lists, refresh state, route actions, and prompt shortcuts.
- Backend APIs used: Indirect state projection of fetchProjectInsights and fetchProjectLearning results loaded by app.js.
- Frontend risks: Mixes interpretation logic with display logic; recommendation narrative is partially local.
- UX problems: Strong reporting surface, but not yet a full operating system lane with action and AI side rails.
- Missing smart tools: Better recommendation provenance, confidence display, and cross-page assignment visibility.
- Missing AI team experience: Analyst and strategist relevance is implicit more than explicit.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Make recommendations visibly backend-derived with timestamps, evidence, and ownership.
- Current state: Useful, not final.
- Backend dependency: High.
- Completion checklist:
  - Surface recommendation provenance and confidence.
  - Add standardized Action Panel and AI Panel.
  - Connect handoffs/tasks more explicitly.
- Priority: P1

## Research
- Purpose of the page: Capture research opportunities, summarize insights, and route work into campaigns, content, workflows, ads, or AI.
- Current capabilities: Opportunity lists, route buttons, prompt actions, and handoff creation.
- Backend APIs used: Mostly projected state plus createProjectHandoff and shared context.
- Frontend risks: Local ACTION_ROUTES and RESEARCH_ROLE_DEFAULTS duplicate backend routing/ownership semantics.
- UX problems: Routing-centric page, but not yet standardized as an operating lane.
- Missing smart tools: Better research memory, recommendation provenance, and durable follow-through tracking.
- Missing AI team experience: Analyst ownership is visible in-page, but not as part of a shared canonical team graph.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Replace local route/destination-role mapping with backend-projected route contracts and durable tasks/handoffs.
- Current state: Useful but still partially frontend-owned in routing semantics.
- Backend dependency: Medium to high.
- Completion checklist:
  - Remove local routing authority.
  - Improve handoff visibility and follow-through.
  - Standardize shell layout.
- Priority: P1

## Governance
- Purpose of the page: Review policy state, approvals, violations, claim review, brand safety, and publish guardrails.
- Current capabilities: Fetch governance summary, create approvals, decide approvals, update governance policy, and display policy sections.
- Backend APIs used: fetchProjectGovernance, createProjectApproval, decideProjectApproval, updateProjectGovernancePolicy.
- Frontend risks: Policy mapping helpers still exist locally, especially around bridging settings-form values into governance policy shape.
- UX problems: Strong backend-backed page, but still not fully integrated with a standard Action Panel and AI Panel shell pattern.
- Missing smart tools: Better escalation guidance and historical override visibility.
- Missing AI team experience: Better than most pages, but escalation chain and ownership graph can be surfaced more explicitly.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Keep backend governance source immutable and reduce frontend policy-shape duplication.
- Current state: One of the most backend-authentic pages, but still not final.
- Backend dependency: Very high.
- Completion checklist:
  - Preserve backend authority over policy and approvals.
  - Reduce frontend transformation duplication.
  - Add standardized side-panel layout and escalation UX.
- Priority: P0

## Settings
- Purpose of the page: Manage team model, operating modes, automation rules, and governance-linked configuration.
- Current capabilities: Fetch/save team model, fetch/update governance policy, render team and operating mode option matrices.
- Backend APIs used: fetchProjectTeam, saveProjectTeam, fetchProjectGovernancePolicy, updateProjectGovernancePolicy.
- Frontend risks: TEAM_ROLE_OPTIONS and TEAM_ROLE_MATRIX are hardcoded locally and can drift from backend team model.
- UX problems: Configuration-heavy page without the final operating-surface conventions.
- Missing smart tools: Better AI-assisted policy explanation and team-model validation against current operations data.
- Missing AI team experience: Ironically high duplication risk here because the team is both configured and locally re-described.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Use backend-projected team/service model directly and reserve the page for editing/inspection, not canonical role description.
- Current state: Important but drift-prone.
- Backend dependency: High.
- Completion checklist:
  - Remove local canonical role matrices.
  - Keep backend as source of truth for team model and policy.
  - Adopt standard operating layout.
- Priority: P0

## Operations Centers
- Purpose of the page: Expose task center, queue center, job monitor, and notification center as operator lanes.
- Current capabilities: Filter/search operational payloads, open related routes, and inspect queue/task/job/notification state.
- Backend APIs used: fetchProjectTaskCenter, fetchProjectQueueCenter, fetchProjectJobMonitor, fetchProjectNotificationCenter, plus full operations snapshot projection.
- Frontend risks: Four operational surfaces in one module and route bindings per render, but less authority duplication than many other pages.
- UX problems: Very close to the final operating-system intent, but still missing a standard persistent side-panel structure.
- Missing smart tools: Better contextual AI assistance tied to the selected operational item.
- Missing AI team experience: Owner/role data exists in payloads, but team flow is not yet narrated strongly.
- Missing action panel: Confirmed missing as a persistent lane.
- Missing AI panel: Confirmed missing as a persistent lane.
- What should be improved before calling it complete: Split per center if needed, standardize layout, and connect operational item selection to contextual AI and action rails.
- Current state: Near the target conceptually, but not yet fully normalized.
- Backend dependency: Very high.
- Completion checklist:
  - Keep centers projection-first.
  - Add contextual action and AI rails.
  - Improve ownership, handoff, and approval drill-in UX.
- Priority: P0

## Summary Priority Order
- P0: Library, AI Command, Workflows, Content Studio, Media Studio, Publishing, Governance, Settings, Operations Centers
- P1: Setup, Integrations, Campaign Studio, Ads Manager, Insights, Research
- P2: Home

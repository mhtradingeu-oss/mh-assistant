# MH-OS Page-by-Page Audit
Date: 2026-05-10
Method: Read-only code audit (no feature work)

Legend:
- Status tags: [CONFIRMED], [ASSUMPTION]
- Priority: P0 (blocker), P1 (high), P2 (medium), Later (defer)

## Home
- Current state: [CONFIRMED] Route exists and renders executive command center framing.
- Capabilities: [CONFIRMED] Next-best-action framing, AI team summary views, route jump actions.
- Backend dependency: [CONFIRMED] Uses projected operations/insight context through app context APIs.
- Problems: [CONFIRMED] Large in-page orchestration and decision mapping still local.
- Missing UX: [CONFIRMED] No persistent dedicated Action Panel + AI Panel split.
- Missing AI tools: [CONFIRMED] Contextual AI prompts exist but not as a persistent assistant lane.
- Missing AI team layer: [PARTIAL] Team visibility exists; deep assignment ownership is still uneven in UI.
- Completion checklist: enforce projection-only decisions, move local logic to backend-fed view models, add persistent side panels.
- Priority: P1

## Setup
- Current state: [CONFIRMED] Strong setup wizard with completeness/readiness UI.
- Capabilities: [CONFIRMED] Step-by-step setup, validation indicators, business template apply.
- Backend dependency: [CONFIRMED] applyProjectBusinessTemplate + setup persistence through API.
- Problems: [CONFIRMED] Significant localStorage draft logic and dense DOM-manual binding.
- Missing UX: [CONFIRMED] Action panel and AI panel patterns are not standardized.
- Missing AI tools: [PARTIAL] AI-assisted fill exists, but no persistent contextual AI copilot lane.
- Missing AI team layer: [CONFIRMED] Minimal role-specific ownership UI.
- Completion checklist: unify with standard operating surface; reduce manual listener density.
- Priority: P1

## Library
- Current state: [CONFIRMED] Asset operations are broad and functionally rich.
- Capabilities: [CONFIRMED] Upload, classify, source-of-truth, rename/archive/delete, protected media retrieval.
- Backend dependency: [CONFIRMED] Direct API imports for all core asset operations.
- Problems: [CONFIRMED] Very large file, global document listeners, local fallback overlays.
- Missing UX: [CONFIRMED] No stable split between main workload and persistent action/AI side rails.
- Missing AI tools: [PARTIAL] AI actions exist but mostly button-triggered, not continuous assistant context.
- Missing AI team layer: [CONFIRMED] AI roles not represented as durable owners/reviewers in UI flow.
- Completion checklist: modularize into list/grid/actions/upload subsystems; enforce listener lifecycle ownership.
- Priority: P0

## Integrations
- Current state: [CONFIRMED] Comprehensive integration catalog and operations controls.
- Capabilities: [CONFIRMED] Connect/reconnect/test/sync/import/disconnect control center.
- Backend dependency: [CONFIRMED] Uses integration runtime endpoints via context API functions.
- Problems: [CONFIRMED] Unsupported providers remain in backend registry (amazon/smtp/mailer/crm).
- Missing UX: [CONFIRMED] High-density UI but no persistent Action Panel + AI Panel parity.
- Missing AI tools: [PARTIAL] AI prompts exist, but contextual AI coaching per integration state is limited.
- Missing AI team layer: [CONFIRMED] Ownership and escalation are more backend-native than UI-native.
- Completion checklist: show provider support tiering clearly; explicit unsupported-state UX.
- Priority: P1

## AI Command
- Current state: [CONFIRMED] Rich AI workspace with multi-role prompts and routing.
- Capabilities: [CONFIRMED] Execute AI command, route suggestions, handoff creation, workflow preparation.
- Backend dependency: [CONFIRMED] executeProjectAiCommand + insights/learning reads; durable AI endpoints exist.
- Problems: [CONFIRMED] Local AI role catalog duplicates backend team authority model.
- Missing UX: [CONFIRMED] AI panel concept is internal to page rather than shell-level standard.
- Missing AI tools: [PARTIAL] Strong prompts and templates, weaker persistent memory/decision trace UX.
- Missing AI team layer: [PARTIAL] Visible but duplicated versus backend team model.
- Completion checklist: replace local role defs with projected team model; unify AI outputs with operations ledger views.
- Priority: P0

## Workflows
- Current state: [CONFIRMED] Workflow catalog and automation controls are active.
- Capabilities: [CONFIRMED] Run workflow/AI workflow, create handoffs, automation plans, auto-mode controls.
- Backend dependency: [CONFIRMED] runProjectWorkflow/runProjectAiWorkflow + createProjectHandoff + insights/learning.
- Problems: [CONFIRMED] High authority-like orchestration in frontend automation runtime.
- Missing UX: [CONFIRMED] No fully separated execution console + side panel architecture.
- Missing AI tools: [PARTIAL] Good plan generation; weak persistent operator audit lane.
- Missing AI team layer: [PARTIAL] Team semantics exist but still partially frontend-owned.
- Completion checklist: move workflow decision authority to backend orchestration projections first.
- Priority: P0

## Campaign Studio
- Current state: [CONFIRMED] Campaign planning and route handoff workflows exist.
- Capabilities: [CONFIRMED] Plan waves/channels/assets and send downstream to content/media/publishing/ads.
- Backend dependency: [CONFIRMED] save/list campaign data, create handoffs, insights/learning reads.
- Problems: [CONFIRMED] Local route-handoff generation logic still substantial.
- Missing UX: [CONFIRMED] Not yet normalized to final operating-surface panels.
- Missing AI tools: [PARTIAL] AI prompts available, but no persistent contextual AI lane.
- Missing AI team layer: [CONFIRMED] Role ownership display is limited.
- Completion checklist: backend-projected route contracts, clearer approval/publish readiness linkage.
- Priority: P1

## Content Studio
- Current state: [CONFIRMED] Broad drafting/versioning/handoff workspace is implemented.
- Capabilities: [CONFIRMED] Draft/save, AI rewrite, approval/handoff to media/publishing, library save.
- Backend dependency: [CONFIRMED] content items, approvals, handoffs, operations, AI command.
- Problems: [CONFIRMED] Large module with local fallback logic and significant orchestration in UI.
- Missing UX: [CONFIRMED] Final operating-surface pattern not complete.
- Missing AI tools: [PARTIAL] Strong task actions, weak persistent assistant lane.
- Missing AI team layer: [PARTIAL] AI agents exist but still page-local constructs.
- Completion checklist: split into composer/review/handoff modules, remove authority-like local branching.
- Priority: P0

## Media Studio
- Current state: [CONFIRMED] Feature-rich media workspace with job lifecycle and approvals.
- Capabilities: [CONFIRMED] Prompt improvement, brand checks, job save, approval flow, publishing handoff.
- Backend dependency: [CONFIRMED] media jobs/content items/approvals/handoffs/operations + media AI APIs.
- Problems: [CONFIRMED] Largest page file; heavy rerender/event wiring risk.
- Missing UX: [CONFIRMED] No persistent action/AI dual-panel shell standard.
- Missing AI tools: [PARTIAL] Rich utilities but fragmented workflow continuity.
- Missing AI team layer: [PARTIAL] Team cards exist, durable role ledger presentation is limited.
- Completion checklist: modular decomposition + stable render boundaries + persistent AI/action lanes.
- Priority: P0

## Publishing
- Current state: [CONFIRMED] Scheduler/approval/publish/fail controls exist.
- Capabilities: [CONFIRMED] Queue management, schedule/reschedule, ready/publish/fail, automation gate hooks.
- Backend dependency: [CONFIRMED] savePublishingSchedule/reschedule/approve/publish/fail + operations state.
- Problems: [CONFIRMED] Local draft map and automation wiring still significant.
- Missing UX: [CONFIRMED] Final control-surface split incomplete.
- Missing AI tools: [PARTIAL] AI push exists but not full contextual assistant lane.
- Missing AI team layer: [CONFIRMED] Limited explicit publisher/compliance assignment UX.
- Completion checklist: keep backend publish guard immutable while simplifying frontend orchestration.
- Priority: P0

## Ads Manager
- Current state: [CONFIRMED] Budget/planning workspace exists.
- Capabilities: [CONFIRMED] Paid planning metrics and AI prompt shortcuts.
- Backend dependency: [PARTIAL CONFIRMED] Mostly context-driven, less direct durable ads runtime operations.
- Problems: [CONFIRMED] Some values remain planning-local rather than backend-backed execution entities.
- Missing UX: [CONFIRMED] Needs operating-surface unification.
- Missing AI tools: [PARTIAL] Prompt shortcuts present; no deep contextual assistant lane.
- Missing AI team layer: [CONFIRMED] Limited durable ads role ownership view.
- Completion checklist: bind to durable ads execution entities before calling complete.
- Priority: P1

## Insights
- Current state: [CONFIRMED] Insight and recommendation views are implemented.
- Capabilities: [CONFIRMED] Platform summaries, recommendations, AI prompt routing, handoff creation.
- Backend dependency: [CONFIRMED] fetchProjectInsights + backend learning payloads.
- Problems: [CONFIRMED] Mixed static guidance and dynamic payload interpretation in frontend.
- Missing UX: [CONFIRMED] Needs persistent Action Panel/AI Panel standard.
- Missing AI tools: [PARTIAL] Route-to-AI exists; contextual follow-through is shallow.
- Missing AI team layer: [CONFIRMED] Team accountability visibility not central.
- Completion checklist: show recommendation provenance + confidence + operator ownership.
- Priority: P1

## Research
- Current state: [CONFIRMED] Research and routing surface exists.
- Capabilities: [CONFIRMED] Opportunity capture, route handoffs, AI prompt generation.
- Backend dependency: [CONFIRMED] insights/learning reads + createProjectHandoff.
- Problems: [CONFIRMED] Considerable local routing logic.
- Missing UX: [CONFIRMED] Incomplete operating-surface side panel standard.
- Missing AI tools: [PARTIAL] Good prompts, weaker persistent assistant memory context.
- Missing AI team layer: [CONFIRMED] Team workflow view is not first-class.
- Completion checklist: align route handoff semantics with backend-first task/approval pathways.
- Priority: P1

## Governance
- Current state: [CONFIRMED] Governance summary + approvals/policy actions are active.
- Capabilities: [CONFIRMED] Fetch governance, create/decide approvals, update policy.
- Backend dependency: [CONFIRMED] fetchProjectGovernance, createProjectApproval, decideProjectApproval, updateProjectGovernancePolicy.
- Problems: [CONFIRMED] Policy mapping helpers still duplicated in frontend transformation layer.
- Missing UX: [CONFIRMED] Governance operating panelization incomplete.
- Missing AI tools: [PARTIAL] AI entry points exist but governance-specific copiloting is limited.
- Missing AI team layer: [PARTIAL] Better than many pages, but escalation chain visualization can improve.
- Completion checklist: keep backend policy source immutable; reduce frontend policy-shape duplication.
- Priority: P0

## Settings
- Current state: [CONFIRMED] Project/ops/team/governance setting controls exist.
- Capabilities: [CONFIRMED] Team fetch/save + governance policy update + mode/rules UI.
- Backend dependency: [CONFIRMED] fetchProjectGovernancePolicy, fetchProjectTeam, saveProjectTeam, updateProjectGovernancePolicy.
- Problems: [CONFIRMED] Extensive local option matrices can drift from backend canonical model.
- Missing UX: [CONFIRMED] Not yet integrated into final 4-panel operating pattern.
- Missing AI tools: [PARTIAL] AI prompts exist but not deeply contextual.
- Missing AI team layer: [PARTIAL] Team UI exists; drift risk due local role constants.
- Completion checklist: project backend role/service model directly; drop frontend hardcoded role schemas.
- Priority: P0

## Operations Centers (Task/Queue/Job Monitor/Notification)
- Current state: [CONFIRMED] Four operations-center routes are implemented in one module.
- Capabilities: [CONFIRMED] Dedicated center payloads, filtering, refresh, route-aware jump actions.
- Backend dependency: [CONFIRMED] task-center, queue-center, job-monitor, notification-center endpoints.
- Problems: [CONFIRMED] Heavy rerender binding per center; route context in one large file.
- Missing UX: [CONFIRMED] Strong near-final operations concept, but still lacks consistent shell-level AI/Action panel structure.
- Missing AI tools: [PARTIAL] AI prompts exist, not persistent panel workflow.
- Missing AI team layer: [PARTIAL] Role/owner data visible in payloads but limited UI narrative.
- Completion checklist: split per center module + align to operating surface standard.
- Priority: P0

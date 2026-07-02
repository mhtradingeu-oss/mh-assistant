# FINAL FRONTEND SYSTEM AUDIT AND COMPLETION ROADMAP

Date: 2026-05-13
Repository: /opt/mh-assistant
Branch: architecture/frontend-consolidation-v1
Mode: AUDIT ONLY

---

## 1) Executive Summary

Current maturity:
- MH-OS frontend is in vNext consolidation stage, not prototype, and not yet final production-grade smart operating system.
- Foundations are strong: authority doctrine, route boundary fallback centralization, lifecycle baseline, page doctrine, action destination doctrine, and major page pilots (Library and Integrations) are in place.
- System still behaves as a mixed operating surface: some pages are premium projection surfaces, while several still carry authority-adjacent mutation controls and uneven UX/safety semantics.

Current stage decision:
- Stage classification: vNext consolidation with selective production-stable islands.
- Production-stable islands: Library, Integrations, Home shell patterns, Operations Centers safe-mode shell.
- Consolidation-needed islands: Workflows, Publishing, Governance, Settings, Content Studio, Media Studio.

Single biggest remaining gap:
- The largest remaining gap is end-to-end action clarity and safe operating continuity across pages:
  User Goal -> Page Context -> AI Guidance -> Workflow Session -> Task/Handoff -> Destination Page -> Tracking -> Result/Next Action
  is partially implemented, but still inconsistent by page and action class.

Safest next phase:
- Phase A hardening closeout focused on one narrow, cross-page control objective:
  standardize authority-adjacent action semantics plus confirmation taxonomy on the highest-risk mutation actions.

---

## 2) Completed Foundation Check

Status legend: Completed / Partial / Missing

- Backend authority doctrine: Completed
  Evidence: frontend master doctrine and backend policy defaults + server enforcement.
- Route authority boundary hardening: Completed
  Evidence: shared fallback module, app/router wired to shared route-role fallback and projection resolver.
- Lifecycle registry foundation: Completed
  Evidence: runtime lifecycle registry created and adopted by app shell + tiny Library lifecycle integration.
- App shell lifecycle integration: Completed
  Evidence: guarded app-shell listeners in lifecycle registry.
- Overlay/AI Dock safety: Partial
  Evidence: overlay runtime helper exists but is explicitly not fully integrated as canonical runtime owner.
- Auto Mode explicit-user-action gating: Partial
  Evidence: Workflows has explicit confirms for major automation actions; additional auto-mode actions still need full consistency.
- Publishing confirmation/provenance/safety copy: Partial
  Evidence: publish/fail confirmation exists; overall authority-adjacent consistency still uneven across pages.
- Page blueprints doctrine: Completed
- Action destination map: Completed
- Frontend master authority: Completed
- Global design foundation primitives: Partial
  Evidence: primitives exist, but adoption is uneven; mhos primitives are heavily concentrated in Workflows.
- Workflows operating loop: Partial-Strong
  Evidence: loop structure present with step model and task/handoff integration, but still mixed with frontend runtime compatibility behavior.
- Integrations operating surface: Completed
- Library operating surface foundation: Completed
- Home executive dashboard: Completed
- Setup guidance and field hints: Completed
- AI Command safe team controls: Partial
  Evidence: strong guidance/control-room behavior and gated plan hints, but backend/frontend role model mismatch remains.
- Operations centers backend projection: Completed (safe-mode)
  Evidence: task/queue/job/notification pages project backend data and keep high-risk mutations deferred.

---

## 3) Backend Authority Reality

Canonical backend authority is present for:
- route permissions and role/service model projection (backbone + operations payload)
- governance and policy rules (including approval_before_publish and freeze_publishing)
- approvals lifecycle
- tasks and handoffs
- workflows and AI execution endpoints
- publishing mutation endpoints
- integration action endpoints
- operations backbone and audit timelines
- AI recommendations and AI memory projections

Confirmed backend enforcement surfaces:
- runtime/orchestrator-service/lib/ops/backbone.js
  - canonical policy defaults and guardrails
  - governance normalization and publish guardrails
- runtime/orchestrator-service/server.js
  - durable mutation endpoints for approvals, policy, publishing, integrations, tasks, handoffs, workflows, AI command execution

Frontend files that still behave like authority-shadow owners (compatibility or perception risk):
- public/control-center/runtime/authority/route-role-fallback.js
  - fallback route-role authority map remains local shadow model.
- public/control-center/app.js
  - local role persistence + fallback permission path + protected write fetch wrapper.
- public/control-center/ai-team-model.js
  - static AI team definitions diverge from backend role IDs/labels.
- public/control-center/shared-context.js
  - transient handoff/draft caches can appear authoritative if not clearly labeled as cache.
- public/control-center/pages/publishing.js
  - local draft/session storage and local status shaping can create perceived durable authority without backend write.
- public/control-center/pages/workflows.js + automation-engine integration
  - strong orchestration logic in frontend compatibility layer; still not full backend-native workflow session authority.

Conclusion:
- Backend remains canonical authority.
- Frontend still contains compatibility and perception-level authority shadows that must be reduced before full premium UX rollout.

---

## 4) Frontend Projection Reality (All Pages)

Scale:
- UX maturity: 1-5
- Authority risk: Low/Medium/High/Critical
- Lifecycle risk: Low/Medium/High
- CSS risk: Low/Medium/High
- User clarity score: 0-100

| Page | Current status | Backend dependency | UX maturity | Authority risk | Lifecycle risk | CSS risk | User clarity | Next action | Redesign ready |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | Executive projection surface, strong snapshot and routing guidance | High read dependency on overview/readiness/operations projection | 4 | Low | Low | Medium | 82 | Add explicit action destination badges for key CTAs | Yes |
| Setup | Guided source-of-truth form with backend save | saveProjectSetup + project reload | 4 | Medium | Medium | Medium | 80 | Add explicit draft vs durable save labeling on all save pathways | Yes |
| Library | Completed operating pilot with action/AI side panels | strong backend asset mutation and catalog dependency | 5 | Medium | Low | Medium | 86 | Standardize dangerous-action copy taxonomy with global pattern | Yes |
| Integrations | Completed control tower with modular architecture | strong backend integration action dependency | 5 | High | Medium | Medium | 84 | Add confirmation coverage for connect/reconnect/disconnect/sync classes | Yes |
| AI Command | Mature guidance workspace with durable command execution bridge | executeProjectAiCommand + insights/learning reads | 4 | High | Medium | Medium | 78 | Align AI team IDs/roles with backend role model; tighten action destination semantics | Partial |
| Workflows | Operating loop exists with steps, auto mode, task/handoff bridging | runProjectWorkflow/runProjectAiWorkflow/createTask/createHandoff | 4 | High | High | Medium | 74 | Consolidate safe execution boundary semantics and workflow session authority model | Partial |
| Campaign Studio | Strong planning and handoff routing surface | saveProjectCampaign + createProjectHandoff | 4 | Medium | Medium | Medium | 76 | Add explicit task/handoff destination feedback after each routed action | Yes |
| Content Studio | Rich workspace with approvals/handoffs/AI generation | saveProjectContentItem + approval/task/handoff + AI command | 3 | High | High | High | 68 | Harden authority labels + confirmation and reduce inline page-level styling | No |
| Media Studio | Rich workspace with approvals/tasks/handoffs/media jobs | saveProjectMediaJob + approval/task/handoff | 3 | High | High | High | 66 | Harden mutation safety semantics and extract style-heavy render blocks | No |
| Publishing | Strong execution center, mixed local+durable behavior, confirmations partly added | schedule/reschedule/approve/publish/fail backend endpoints | 4 | Critical | High | High | 70 | Remove remaining ambiguity between local draft state and backend execution truth | No |
| Ads Manager | Planning and projection workspace (mostly safe) | mostly projection; navigation-driven actions | 3 | Low | Low | Medium | 75 | Add backend-linked task/handoff bridge for paid decisions | Yes |
| Insights | Good read projection and route-to-action handoffs | insights/learning payload + handoff creation | 4 | Medium | Low | Medium | 79 | Add explicit confidence/provenance strips for major recommendation blocks | Yes |
| Research | Good intelligence projection with handoff routing | handoff creation + research projection | 4 | Medium | Medium | Medium | 77 | Add explicit destination/result tracking card for routed findings | Yes |
| Governance | Authority-adjacent control center with direct durable policy/approval mutations | create/decide approvals + update governance policy | 3 | Critical | Medium | Medium | 67 | Confirmation taxonomy + provenance badges + backend rule echo before mutation | No |
| Settings | High-authority durable writer for team/policy bridges | saveProjectTeam + updateProjectGovernancePolicy + handoff | 3 | Critical | Medium | Medium | 69 | Make authority impact explicit per section and add guarded confirmation path | No |
| Task Center | Safe projection surface with refresh/routing and limited mutation | fetch task center + route navigation | 4 | Low | Low | Medium | 81 | Add create-task-from-context bridge with explicit backend trace | Yes |
| Queue Center | Safe projection surface, mutation controls deferred | fetch queue center, route navigation | 4 | Low | Low | Medium | 80 | Keep deferred controls; add destination feedback and owner path clarity | Yes |
| Job Monitor | Safe projection surface, destructive controls deferred | fetch job monitor, route navigation | 4 | Low | Low | Medium | 80 | Add retry/escalation flow only after policy-safe confirmation gate | Yes |
| Notifications | Mostly safe projection with mark-read mutation only | fetch notifications + markProjectNotification | 4 | Medium | Low | Medium | 79 | Add source-of-authority hint on mark-read/update outcomes | Yes |

Projection classification summary:
- Projection-first safe surfaces: Home, Library, Integrations, Insights, Research, Task/Queue/Job/Notifications.
- Mixed projection + local authority-shadow: Setup, AI Command, Workflows, Campaign Studio, Content Studio, Media Studio, Publishing.
- Authority-heavy frontend control surfaces: Governance, Settings, Publishing.

---

## 5) Final User Experience Gap vs Target Model

Target model:
User Goal -> Page Context -> AI Guidance -> Workflow Session -> Task/Handoff -> Destination Page -> Tracking -> Result/Next Action

Current gap assessment:
- Header: Mostly strong and present across upgraded pages; still inconsistent semantic depth.
- Main View: Strong on Library/Integrations/Home; variable on Content/Media/Publishing.
- Action Panel: Strong in upgraded pages and ops centers; still uneven in authority language.
- AI Panel: Present in several pages, but inconsistent depth and role-model alignment.
- Workflow Quick Action: Exists strongly in Workflows; only partially normalized across all pages.
- Task/Handoff path: Present and improving; still inconsistent post-action tracking/feedback loop.
- Technical Details collapsed: Pattern exists, but not consistently applied in all complex pages.
- Next Best Action: Strong in Home and some upgraded surfaces; inconsistent elsewhere.
- Context preservation: Present via state + shared-context caches + handoff routes; still uneven and can feel implicit.
- Feedback after action: Strong in some pages, weak/inconsistent in high-authority pages.
- Destination clarity: Improved but still ambiguous for several authority-adjacent verbs.
- Visual hierarchy: Strong in upgraded surfaces; still varied due page-level bespoke styling.
- Mobile/responsive quality: Shell-level handling exists, but page-by-page density/behavior quality varies.
- Premium dark operating system feel: Partially achieved; not yet fully unified due mixed component and page-style approaches.

Bottom line:
- The architecture is close to final operating shape.
- The major remaining UX delta is consistency of action semantics, destination feedback, and authority legibility across all pages.

---

## 6) CSS / Design System Audit

Current active CSS stack:
- Active linked stack in index: tokens/reset/layer/shell/sidebar/topbar/command/ai/components/operations/pages/home/page-standard.
- Active stack is modular and canonical in intent.

Legacy CSS risk:
- Legacy directory still contains large legacy bundles (including very large full legacy stylesheet files).
- Legacy files are not part of active linked stack but remain latent risk if accidentally reintroduced.

Repeated selector risk:
- High repetition in operations styles (notably notification-center scoped selectors), indicating consolidation opportunities.

Duplicated page polish blocks:
- Inline style blocks detected in page JS:
  - content-studio-workspace.js
  - media-studio-workspace.js
  - publishing.js
- This creates parallel styling behavior and reduces design-system coherence.

Typography consistency:
- Improved versus early baseline, but still page-dependent and not fully systemized.

Spacing consistency:
- Better in upgraded pages; less consistent in complex/styled-in-page surfaces.

Card density:
- Generally strong and executive in upgraded pages.
- Some pages still mix dense cards with inconsistent section rhythm.

Button system:
- Shared btn classes are broadly reused, but action semantics and visual hierarchy are inconsistent in authority-heavy pages.

Panel system:
- Good panel framing in upgraded pages and operations centers.
- Inconsistent panel grammar where heavy inline page styling dominates.

AI panel styling:
- Present but not fully standardized across pages.

Action panel styling:
- Strong in upgraded pages and operations centers; still uneven cross-page semantics.

mhos-* primitive usage:
- Under-adopted across pages.
- Current usage is concentrated heavily in Workflows; most pages do not use mhos primitives directly.

CSS conclusion:
- Design system foundation exists and is usable.
- Full premium consistency requires reducing inline page style blocks and expanding primitive adoption without introducing new theme files.

---

## 7) AI Team Experience Audit

Requested role coverage check:
- strategist
- writer
- designer
- video lead
- publisher
- ads operator
- analyst
- researcher
- compliance reviewer
- system orchestrator

Reality snapshot:
- Backend team model exists in backbone with canonical role IDs and route/service ownership.
- Frontend AI team model exists, but naming/ID mapping differs from backend in multiple roles.
- Settings and AI Command expose role-oriented UX, but role/action/workflow binding is not fully unified.

Role-by-role classification:

| Role | Defined in backend | Visible in frontend | Actionable in UI | Connected to workflow/task/handoff | Missing from UX |
| --- | --- | --- | --- | --- | --- |
| Strategist | Yes | Yes | Yes | Partial | No |
| Writer | Yes | Partial (content_writer naming drift) | Yes | Partial | Partial naming drift |
| Designer | Yes | Partial (media_director naming drift) | Yes | Partial | Partial naming drift |
| Video Lead | Yes | Yes | Yes | Partial | No |
| Publisher | Yes | Yes | Yes | Partial-Strong | No |
| Ads Operator | Yes | Partial (ads_optimizer naming drift) | Yes | Partial | Partial naming drift |
| Analyst | Yes | Partial (seo_insights_analyst naming drift) | Yes | Partial | Partial naming drift |
| Researcher | Partial in backend canonical role list (not exact dedicated role ID) | Yes | Yes | Partial | Backend/frontend model mismatch |
| Compliance Reviewer | Yes | Yes | Yes | Strong | No |
| System Orchestrator | Partial (admin/operations role split) | Partial (operations_lead/admin mixed) | Partial | Partial | Role identity not unified |

AI Team audit conclusion:
- Vision is visible and directionally strong.
- Backend/frontend role taxonomy mismatch is a key blocker to truly international-grade, team-based operating clarity.

---

## 8) Workflow System Audit

Current classification:
- Template list only: No.
- Operating loop: Yes.
- Session-aware: Yes (session state and auto mode state handling).
- Context-aware: Yes (project/context/route-oriented operation).
- Destination-aware: Yes (route suggestions and handoff pathways).
- Task-aware: Yes (task creation hooks exist).
- AI-aware: Yes (AI workflow and AI command bridges exist).
- Backend-safe: Partial (backend endpoints used, but frontend compatibility runtime still carries meaningful orchestration control logic).

Needed to reach final workflow architecture:
- Workflow Template Registry:
  - Exists in practice but needs stronger backend-backed canonical contract and versioning.
- Workflow Session Model:
  - Exists in frontend, needs explicit backend-first session authority and resumability contract.
- Workflow Launcher:
  - Exists, needs normalized destination + confirmation semantics by workflow risk class.
- AI Context Bridge:
  - Exists, needs strict role/model alignment and clearer provenance.
- Task/Handoff Bridge:
  - Exists, needs consistent result tracking feedback and destination ownership confirmation.
- Action Destination Map:
  - Doctrine complete, implementation consistency incomplete.
- Safe Execution Boundary:
  - Partially implemented; needs final confirmation taxonomy and authority labels before broad rollout.

---

## 9) Page-by-Page Final Target Blueprint

Each page entry includes:
purpose, journey, header, main view, action panel, AI panel, workflow action, task/handoff path, data shown, actions allowed, actions forbidden, backend dependency, first safe improvement.

1. Home
- Purpose: executive mission control and next-best-action launcher.
- Journey: detect blockers -> pick guided path -> route to owner page.
- Header: project/readiness/alert summary.
- Main view: blockers, launch snapshot, activity board.
- Action panel: open destination, request AI briefing, refresh project.
- AI panel: executive prompts.
- Workflow action: start blocker triage workflow.
- Task/handoff path: create task from blocker cluster.
- Data shown: readiness, operations, alerts, queue, execution outcomes.
- Allowed: navigation, AI open, workflow/task routing.
- Forbidden: durable authority mutation.
- Backend dependency: high read projection.
- First safe improvement: add destination + authority badges on all primary CTAs.

2. Setup
- Purpose: project foundation and readiness baseline.
- Journey: complete fields -> validate -> save -> route.
- Header: completion and freshness.
- Main view: guided setup sections and hints.
- Action panel: save, AI assist, continue route.
- AI panel: fill missing context.
- Workflow action: setup completion workflow.
- Task/handoff path: create setup dependency tasks.
- Data shown: project profile and readiness dependencies.
- Allowed: draft and backend save.
- Forbidden: governance approval decisions.
- Backend dependency: saveProjectSetup.
- First safe improvement: explicit draft-only vs durable-save labels per action.

3. Library
- Purpose: asset truth and readiness control.
- Journey: upload/select -> classify/review -> route assets.
- Header: asset readiness and context.
- Main view: catalog + details.
- Action panel: upload/status/source/archive/delete.
- AI panel: classification/missing asset guidance.
- Workflow action: asset readiness workflow start.
- Task/handoff path: route to content/media/publishing.
- Data shown: catalog, readiness, metadata.
- Allowed: governed asset mutations.
- Forbidden: direct publish.
- Backend dependency: high.
- First safe improvement: map all dangerous actions to unified confirmation taxonomy.

4. Integrations
- Purpose: connector health and action control tower.
- Journey: inspect health -> connect/test/sync -> route issues.
- Header: status summary and alerts.
- Main view: connector cards and diagnostics.
- Action panel: connect/reconnect/sync/import/test.
- AI panel: diagnostics prompts.
- Workflow action: connector recovery workflow.
- Task/handoff path: create remediation task/handoff.
- Data shown: readiness checks, provider states.
- Allowed: backend integration actions.
- Forbidden: opaque execution semantics.
- Backend dependency: very high.
- First safe improvement: confirmation coverage for all external-effect integration actions.

5. AI Command
- Purpose: AI control room for guided commands and routing.
- Journey: select specialist -> compose command -> receive routed outputs.
- Header: context, readiness, campaign, mode.
- Main view: command composer and response feed.
- Action panel: prepare command and open destination.
- AI panel: specialist cards and recommendations.
- Workflow action: prepare workflow from command.
- Task/handoff path: route durable handoffs.
- Data shown: project context + insights + AI output.
- Allowed: durable AI command execution via backend.
- Forbidden: hidden unsafe execution.
- Backend dependency: high.
- First safe improvement: unify frontend role IDs with backend team-service model IDs.

6. Workflows
- Purpose: orchestrate multi-step execution loop safely.
- Journey: template -> context -> package -> AI review -> task/handoff -> destination -> tracking.
- Header: stage, readiness, mode.
- Main view: step progression and plan controls.
- Action panel: run safe step/full run under policy.
- AI panel: optimization and recommendation route.
- Workflow action: primary page function.
- Task/handoff path: strong, existing.
- Data shown: workflow/session/run outputs.
- Allowed: governed workflow execution and routing.
- Forbidden: implicit unsafe auto execution.
- Backend dependency: high.
- First safe improvement: explicit backend authority and risk-level labels on every run control.

7. Campaign Studio
- Purpose: campaign planning and packaging.
- Journey: define campaign -> save -> handoff to content/media/publishing/ads.
- Header: objective/readiness/channels.
- Main view: plan structure and dependencies.
- Action panel: save, package, route.
- AI panel: strategy prompts.
- Workflow action: start launch workflow.
- Task/handoff path: strong handoff usage.
- Data shown: campaign plan + routing state.
- Allowed: save and route package.
- Forbidden: direct publish/approval authority.
- Backend dependency: medium-high.
- First safe improvement: add post-handoff tracking card with destination status.

8. Content Studio
- Purpose: content production, review, and routing.
- Journey: draft/generate -> review -> approval/handoff.
- Header: objective and draft state.
- Main view: content workspace variants.
- Action panel: save, request approval, route.
- AI panel: rewrite/adaptation prompts.
- Workflow action: content production workflow launch.
- Task/handoff path: exists.
- Data shown: items, approvals, handoffs.
- Allowed: create/update content and route.
- Forbidden: ambiguous publish authority.
- Backend dependency: high.
- First safe improvement: standardize action semantics and confirmation on approval/handoff critical controls.

9. Media Studio
- Purpose: media job planning, review, and publishing routing.
- Journey: build job -> review/approve -> route to publishing.
- Header: job scope/readiness.
- Main view: media jobs and details.
- Action panel: save/request approval/create task/handoff.
- AI panel: prompt optimization and role guidance.
- Workflow action: media production workflow launch.
- Task/handoff path: strong.
- Data shown: media job lifecycle.
- Allowed: durable media job mutation and route.
- Forbidden: direct ungoverned release.
- Backend dependency: high.
- First safe improvement: add explicit risk-grade confirmation for approval and publish-routing transitions.

10. Publishing
- Purpose: governed release preparation and execution.
- Journey: prepare/schedule -> approve/ready -> publish/fail -> track result.
- Header: readiness, approvals, channel targets.
- Main view: queue/calendar/blockers.
- Action panel: schedule/reschedule/approve/publish/fail.
- AI panel: publish guidance.
- Workflow action: publishing readiness flow.
- Task/handoff path: integrated.
- Data shown: publishing jobs + execution outcomes.
- Allowed: backend-governed publish mutations.
- Forbidden: frontend-only publish truth or bypass of policy.
- Backend dependency: critical.
- First safe improvement: explicitly label all local draft states vs backend durable execution states.

11. Ads Manager
- Purpose: paid planning and readiness support.
- Journey: set budgets and pacing -> route to publishing/AI/campaign.
- Header: budget posture and readiness.
- Main view: platform cards and creative mapping.
- Action panel: planning and navigation.
- AI panel: paid optimization prompts.
- Workflow action: paid optimization workflow start.
- Task/handoff path: weak/limited.
- Data shown: integration-based readiness and budget inputs.
- Allowed: planning/projection.
- Forbidden: hidden paid execution mutation.
- Backend dependency: low-medium.
- First safe improvement: add durable task/handoff creation for paid decisions.

12. Insights
- Purpose: sourced intelligence and optimization projection.
- Journey: review signal -> route action/handoff.
- Header: data coverage and time window.
- Main view: trend/recommendation cards.
- Action panel: open destination and route.
- AI panel: interpretation prompts.
- Workflow action: performance improvement workflow.
- Task/handoff path: exists through handoff creation.
- Data shown: insights + learning outputs.
- Allowed: projection and routing.
- Forbidden: unsourced metric authority.
- Backend dependency: medium-high.
- First safe improvement: add confidence/provenance indicators on recommendation groups.

13. Research
- Purpose: intelligence lab for market/competitor inputs.
- Journey: collect findings -> summarize -> handoff.
- Header: scope/freshness context.
- Main view: research records and notes.
- Action panel: save and route findings.
- AI panel: research prompts.
- Workflow action: competitor-response workflow.
- Task/handoff path: present.
- Data shown: research findings and derived actions.
- Allowed: projection and handoff.
- Forbidden: unsourced truth claims as operating fact.
- Backend dependency: medium.
- First safe improvement: destination/result tracker after handoff creation.

14. Governance
- Purpose: approvals, policy checks, and controlled decisions.
- Journey: review evidence -> decide -> track audit trail.
- Header: pending and risk distribution.
- Main view: queue + policy panels.
- Action panel: approve/reject/escalate/save policy.
- AI panel: review assistance only.
- Workflow action: governance review workflow.
- Task/handoff path: compliance follow-up routing.
- Data shown: approvals, policy, violations.
- Allowed: durable governed decisions via backend.
- Forbidden: bypass policy gates.
- Backend dependency: critical.
- First safe improvement: policy-echo confirmation modal with changed keys and impact preview.

15. Settings
- Purpose: configuration and governance/team bridge.
- Journey: review config -> save durable settings -> sync policy.
- Header: context and change scope.
- Main view: grouped settings domains.
- Action panel: save all/review critical/open AI.
- AI panel: suggestions and risk prompts.
- Workflow action: config validation workflow.
- Task/handoff path: partial.
- Data shown: modes/rules/permissions defaults.
- Allowed: durable team and policy updates.
- Forbidden: hidden high-impact mutation.
- Backend dependency: critical.
- First safe improvement: section-level impact labels and confirmation for critical save-all mutations.

16. Task Center
- Purpose: durable task projection and prioritization.
- Journey: filter/select -> route to source page.
- Header: priority and owner summary.
- Main view: task queue + details.
- Action panel: refresh, copy summary, open source.
- AI panel: prioritization prompts.
- Workflow action: blocker-resolution launch.
- Task/handoff path: primary surface.
- Data shown: backend tasks.
- Allowed: safe read + route actions.
- Forbidden: ungoverned destructive mutation.
- Backend dependency: high read.
- First safe improvement: add explicit create-follow-up task with trace.

17. Queue Center
- Purpose: queue pressure and routing projection.
- Journey: inspect queue -> route or escalate.
- Header: queue depth and status mix.
- Main view: queue rows + detail.
- Action panel: safe controls, deferred mutation controls.
- AI panel: bottleneck prompts.
- Workflow action: queue-clearing workflow.
- Task/handoff path: route/escalation guidance.
- Data shown: backend queue state.
- Allowed: safe projection and route.
- Forbidden: deferred dangerous queue mutations.
- Backend dependency: high read.
- First safe improvement: add destination confirmation after route actions.

18. Job Monitor
- Purpose: execution status and escalation projection.
- Journey: inspect failed/running jobs -> escalate.
- Header: running/failed totals.
- Main view: jobs and detail cards.
- Action panel: safe controls, deferred destructive actions.
- AI panel: failure triage prompts.
- Workflow action: failure-recovery workflow.
- Task/handoff path: escalation path.
- Data shown: backend job monitor payload.
- Allowed: read + route.
- Forbidden: destructive job controls until hardening complete.
- Backend dependency: high read.
- First safe improvement: add standardized escalation-to-task flow.

19. Notifications
- Purpose: operational signal inbox.
- Journey: triage signal -> mark/route.
- Header: severity and unread context.
- Main view: notifications and detail.
- Action panel: refresh, mark read, open source; destructive actions deferred.
- AI panel: signal summary prompts.
- Workflow action: incident response workflow trigger.
- Task/handoff path: implied via route and AI.
- Data shown: backend notifications and derived alerts.
- Allowed: mark read and route.
- Forbidden: deferred destructive notification actions.
- Backend dependency: high read + limited write.
- First safe improvement: show backend provenance on mark-read result.

---

## 10) Risk Matrix

### Critical (must fix before any redesign)
- Publishing authority semantics and local-vs-durable truth ambiguity
  Areas: public/control-center/pages/publishing.js, backend publishing endpoints, policy guardrails
  Why: highest external-effect risk and operator trust risk.
- Governance/Settings mutation confirmation and provenance clarity
  Areas: public/control-center/pages/governance.js, public/control-center/pages/settings.js
  Why: direct durable policy and approval state mutation.
- Backend/frontend AI team taxonomy mismatch
  Areas: public/control-center/ai-team-model.js, runtime ops backbone role model projections
  Why: impacts role authority clarity and workflow/task ownership semantics.

### High (must fix before page rollout)
- Workflow safe execution boundary normalization
  Areas: public/control-center/pages/workflows.js, automation runtime compatibility wiring
  Why: orchestration blast radius is broad.
- Confirmation coverage inconsistency for integration and authority-adjacent actions
  Areas: integrations/content/media/governance/settings/workflows high-impact controls
  Why: action ambiguity leads to unsafe operator assumptions.
- CSS-in-JS style islands in complex pages
  Areas: publishing/content/media page inline style blocks
  Why: design system drift and maintenance risk.

### Medium (can fix during rollout)
- mhos primitive adoption inconsistency
  Areas: most pages outside workflows
  Why: slows consistent premium UX convergence.
- Destination/result feedback inconsistency after route/handoff actions
  Areas: campaign/content/media/research/insights and others
  Why: reduces operating-flow clarity.
- Overlay runtime canonicalization incomplete
  Areas: overlay runtime helper integration pattern
  Why: manageable but contributes to lifecycle complexity.

### Low (polish)
- Selector repetition in operations stylesheet
  Areas: styles/09-operations-centers.css
  Why: optimization and maintainability, low immediate safety impact.
- Minor copy inconsistencies across action labels
  Areas: multiple page labels/tooltips/messages
  Why: clarity polish, not immediate authority failure.

---

## 11) Implementation Roadmap

### Phase A - Close Remaining Hardening
- Objective:
  lock authority-adjacent semantics and confirmation taxonomy for highest-risk mutation actions.
- Files likely touched:
  - public/control-center/pages/publishing.js
  - public/control-center/pages/governance.js
  - public/control-center/pages/settings.js
  - public/control-center/pages/integrations.js
  - shared confirmation helper location in frontend runtime/ui layer
- Files forbidden:
  - backend contracts and policy logic in runtime/orchestrator-service (unless separately approved)
  - index.html
  - data/projects
- Validations:
  - node --check for touched page files
  - browser confirmation-flow QA on high-impact actions
  - doctrine compliance check against FRONTEND_MASTER_AUTHORITY and ACTION_DESTINATION_MAP
- Success criteria:
  - all critical mutation controls use explicit action type + destination + risk confirmation semantics
  - no authority bypass or hidden execution behavior
- Commit strategy:
  - small grouped commits by action family (publishing first, then governance/settings, then integrations)

### Phase B - Design System Consolidation
- Objective:
  remove style islands and normalize component primitives.
- Files likely touched:
  - public/control-center/styles/08-components-foundation.css
  - public/control-center/styles/14-page-standard.css
  - targeted page files currently embedding style blocks (content/media/publishing)
- Files forbidden:
  - no new theme file
  - no legacy stylesheet relink
- Validations:
  - visual regression snapshots desktop/mobile
  - selector duplication check and primitive adoption check
- Success criteria:
  - no inline style blocks in major pages
  - higher mhos primitive adoption across pages
- Commit strategy:
  - one page at a time, style extraction only, no behavior drift

### Phase C - Shared Operating Components
- Objective:
  standardize reusable Header/Main/Action/AI/Workflow/Task-Handoff components.
- Files likely touched:
  - public/control-center/ui/page-standard.js
  - shared page helper modules and selected page integrations
- Files forbidden:
  - backend/runtime authority logic changes
- Validations:
  - route-by-route render QA
  - lifecycle listener leak checks
- Success criteria:
  - consistent panel grammar and destination feedback contract across pages
- Commit strategy:
  - component introduction commit, then incremental per-page adoption commits

### Phase D - Page-by-Page UX Rollout
- Objective:
  converge each page to final blueprint while preserving backend authority.
- Files likely touched:
  - page modules under public/control-center/pages/
  - minimal shared styles/helpers
- Files forbidden:
  - backend authority contracts
  - runtime governance policy semantics
- Validations:
  - per-page browser QA checklists
  - action-destination mapping checklist completion
- Success criteria:
  - every page expresses canonical operating model structure and clear next action path
- Commit strategy:
  - one page per commit sequence: audit note -> implementation -> browser QA closeout

### Phase E - AI Team Operating Experience
- Objective:
  align frontend AI team visibility and specialist routing with backend role authority model.
- Files likely touched:
  - public/control-center/ai-team-model.js
  - public/control-center/pages/ai-command.js
  - public/control-center/pages/home.js
  - settings role surfaces as needed
- Files forbidden:
  - no unreviewed backend role model breaking changes
- Validations:
  - role ID parity check frontend vs backend
  - specialist routing sanity checks
- Success criteria:
  - role naming and behavior parity across backend projection and frontend UX
- Commit strategy:
  - parity alignment commit + page integration follow-up commits

### Phase F - Workflow/Task/Handoff Integration
- Objective:
  complete reliable context-preserving flow from workflow output to task/handoff to destination + tracking.
- Files likely touched:
  - workflows and shared context/handoff bridge files
  - destination pages for result tracking feedback
- Files forbidden:
  - no frontend-owned durable authority store introduction
- Validations:
  - end-to-end flow tests across 4-6 representative journeys
- Success criteria:
  - clear result/next-action feedback after every handoff/task route
- Commit strategy:
  - bridge contract commits first, then destination-page adoption commits

### Phase G - Final Browser QA and Release Readiness
- Objective:
  certify full system behavior, safety, and UX coherence.
- Files likely touched:
  - QA docs, audit closeouts, minimal copy fixes only
- Files forbidden:
  - broad refactors or architecture shifts
- Validations:
  - full route matrix QA
  - responsive checks
  - safety confirmation checks
  - governance/publishing authority-path checks
- Success criteria:
  - no critical/high blockers, stable operating flow across all core journeys
- Commit strategy:
  - no large code commits; only tightly scoped fixes from QA findings

---

## 12) Immediate Next Step (Single Safest Implementation Step)

Recommended next single step:
- Implement one shared confirmation + provenance micro-pattern for Governance policy save actions only, and wire it to the existing save flow without changing backend behavior.

Why this is safest:
- very small scope
- high authority value
- easy to validate
- directly reduces critical risk
- does not require broad redesign or refactor

Scope boundary:
- one page (Governance)
- one action family (policy save)
- no backend changes
- no CSS system refactor

Validation for this single step:
- action requires explicit confirmation with changed-policy summary
- result message shows backend-provenance wording
- node --check passes
- browser flow confirms no behavior regression

---

## Final Audit Position

MH-OS frontend is near-final in architecture direction, but not yet final in cross-page safety semantics and operating continuity. The path to a smart, premium, international-grade AI Business Operating System is clear and realistic if hardening-first sequencing is preserved and redesign is applied only after authority, lifecycle, and action-destination boundaries are fully explicit.

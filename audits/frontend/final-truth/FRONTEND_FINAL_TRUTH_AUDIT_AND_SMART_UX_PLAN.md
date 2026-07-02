# MH Assistant Control Center Final Frontend Truth Audit And Smart UX Plan

Date: 2026-05-10  
Branch: `fix/control-center-project-fetch-timeout`  
Scope: `public/control-center/`, selected audit history, and backend capability comparison against `runtime/orchestrator-service/`

## 0. Executive Verdict

The Control Center frontend is not 100% complete as an AI Business / Marketing / Operations Operating System.

It is much stronger than a prototype: it has real pages, real backend routes, real operations centers, a safer automation engine, a modular integrations page, and serious content/media/publishing surfaces. But the user experience still exposes the system as a collection of powerful workbenches rather than one coherent AI operating system.

Realistic completion today:

| Area | Completion | Reason |
|---|---:|---|
| Runtime/backend foundation visible in frontend | 62% | Many APIs are wired, but AI artifacts/recommendations/memory, ad packages, optimization recommendations, and smart suggestions are underexposed. |
| AI Business OS information architecture | 55% | Core routes exist, but sidebar grouping, page contracts, AI team model, and operations/control surfaces are not unified. |
| UX quality and professional polish | 64% | Several pages are useful and substantial, but density, duplicated local patterns, empty states, CSS recovery rules, and inconsistent role models weaken trust. |
| Runtime safety | 67% | Auto Mode is not auto-started and most global listeners are guarded, but large pages still rely on `root.innerHTML`, many inline handlers, heavy `Promise.all` loads, and shared global automation context. |
| Mobile/tablet readiness | 50% | The shell has responsive controls, but heavy workspaces and dense grids need deliberate mobile validation and simplification. |

Overall honest completion: **62%**.

The next phase should not be a rewrite. The right path is a controlled consolidation: shell and information architecture, shared page contract, canonical AI team model, API wrappers for hidden backend power, and then page-by-page upgrades.

## 1. Evidence Read First

Existing audit history confirms this frontend has already moved through cleanup and modularization:

| File | Useful finding |
|---|---|
| `audits/frontend/final-vision/FINAL_FRONTEND_MASTER_VISION_AND_COMPLETION_PLAN.md` | Defines the correct target: AI Business OS, every page answers status, next action, AI specialist, available tools, next workspace. |
| `audits/frontend/final-status/FRONTEND_STATUS_AND_REMAINING_PLAN.md` | Confirms integrations modularization and remaining shell/sidebar/AI command/publishing/CSS/mobile work. |
| `audits/frontend/full-cleanup/FINAL_FRONTEND_REBUILD_PLAN.md` | Historical evidence of monolithic CSS and duplicated shell/topbar/AI dock issues. |
| `audits/frontend/full-cleanup/FRONTEND_CLEANUP_DECISION.md` | Says old root monolithic style should be retired. |
| `audits/frontend/readiness/15-readiness-summary.txt` | Current readiness says root `styles.css` is removed from runtime and canonical modular CSS is active. |
| `audits/frontend/css/FRONTEND_CSS_DEEP_SCAN.md` | Historical deep scan of old duplicated CSS. Still useful as warning, not current truth. |
| `audits/frontend/css/TOPBAR_RULE_CLASSIFICATION.md` | Historical classification of topbar duplication. Current topbar is cleaner but shell complexity remains. |
| `audits/frontend/ux-vision/AI_OPERATING_HOME_BLUEPRINT.md` | Correct target for Home: project state, next action, AI team, work journey, active tasks, intelligence loop. |
| `audits/frontend/STARTUP_RUNTIME_MAP.md` | `app.js` owns too much startup and runtime orchestration. Still true. |
| `audits/frontend/COMMAND_RUNTIME_ARCHITECTURE.md` | Command runtime is palette plus AI entry plus mobile overlay. It still competes with AI dock/page AI panels. |
| `audits/frontend/integrations/integrations-modularization-final-checkpoint.md` | Integrations page split started, but controller remains large and empty module files remain. |
| `audits/frontend/library/library-runtime-safety-audit.txt` | Library has many event and render hotspots. Still true. |
| `audits/frontend/media-studio/media-studio-runtime-audit.txt` | Media workspace has heavy loading and `root.innerHTML` hotspots. Still true. |
| `audits/frontend/ai-command/ai-command-runtime-audit.txt` | AI Command has heavy intelligence loading and durable command areas, but not full AI memory/artifact visibility. |

## 2. Current Frontend Inventory

| Page | File path | Purpose | Current UX quality | Data sources/API usage | Visible backend capabilities | AI/team support | Main actions | Obvious missing UX | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| Home | `public/control-center/pages/home.js` | Executive project command center | B | App state, readiness, assets, integrations, activity, operations, `system-intelligence.js` | Readiness, operations counts, next action, AI/team cards | Good but local to page; team roles close to target | Navigate, ask AI, route to work areas | Work journey is not yet a true operational pipeline; task/queue/job/notification centers are not prominent | Medium | P1 |
| Setup | `public/control-center/pages/setup.js` | Project foundation and business setup | B- | `saveProjectSetup`, `applyProjectBusinessTemplate`, app state | Project setup, template application, missing asset signals | Light contextual guidance, not canonical AI specialist | Edit setup, apply template, save | Needs clearer AI specialist ownership and stronger validation/next workspace routing | Medium | P1 |
| Library | `public/control-center/pages/library.js` | Asset and content library | B | Asset tree/registry, protected media, upload/preview helpers, local managed assets | Asset search, upload, metadata, registry usage | Some smart asset semantics, no canonical specialist | Upload, preview, manage, select assets | Shared upload/preview components missing; trust/source labels need stronger clarity | High | P1 |
| Integrations | `public/control-center/pages/integrations.js` plus `pages/integrations/*.js` | Connector health and action center | B | Integration control center APIs, health/action endpoints | Connect, reconnect, test, sync, import, disconnect | Good recommendations but not tied to global AI team | Manage connectors, run diagnostics/actions | Controller still large; `actions.js`, `events.js`, `index.js` are empty; provider limitations need clearer user-facing guidance | High | P0 |
| AI Command | `public/control-center/pages/ai-command.js` | Central AI command workspace | B- | `executeProjectAiCommand`, insights/learning fetches, operations snapshot, shared handoffs | Command execution, draft planning, partial artifacts from session/learning | Strong but inconsistent roles; missing Publisher, Compliance Reviewer, Video Lead as first-class target roles | Submit command, save drafts, route artifacts | AI command/artifacts/recommendations/memory list endpoints are not directly exposed; global AI dock vs page command is confusing | High | P0 |
| Workflows | `public/control-center/pages/workflows.js` | Workflow planning and automation | B- | Workflow APIs, AI workflow APIs, automation engine, operations/handoffs | Workflow runs, safe Auto Mode prep, workflow catalog | Operations-ish support but not a canonical Operations Lead panel | Start workflow, prepare/run automation plan | Auto Mode ownership shared globally; job monitor linkage should be more explicit | High | P0 |
| Publishing | `public/control-center/pages/publishing.js` | Publishing queue and execution cockpit | B | Publishing queue APIs, schedule/reschedule/ready/publish/fail, automation engine | Queue, scheduling, publishing state, retry/fail paths | Publisher concept present but not canonical | Approve/schedule/publish/fail, Auto Mode assist | Needs stronger safety copy/confirmation model and clearer handoff from content/media/campaign | High | P0 |
| Campaign Studio | `public/control-center/pages/campaign-studio.js` | Campaign planning and routing | B | Campaign save API, insights/learning, shared context, handoffs, assets | Campaign save, handoffs to content/media/publishing/ads/AI | Strategist-like support, but page-specific | Plan/save campaign, create handoffs | Campaign history/list/status is not first-class; route output state is not visible enough | Medium-High | P1 |
| Content Studio | `public/control-center/pages/content-studio-workspace.js` | Copy/content production workspace | B | Content APIs, AI command, tasks, approvals, handoffs, events, operations | Content items, save, AI generation, approvals/tasks/handoffs | Strong writer roles, inconsistent with global team model | Generate, save, assign, approve, handoff | Heavy load and local CSS; output state machine needs shared component | High | P1 |
| Media Studio | `public/control-center/pages/media-studio-workspace.js` | Media generation and production workspace | B | Media APIs, generation, tasks, approvals, handoffs, events, operations | Media jobs, generated assets, provider state, approval/handoff | Strong media specialists, inconsistent role names | Generate, save, approve, handoff | Must connect more clearly to Job Monitor and provider health; heavy page needs progressive loading | High | P1 |
| Ads Manager | `public/control-center/pages/ads-manager.js` | Paid media planning surface | C | Mostly app state: integrations, assets, activity | Limited. Does not expose ad execution package route | Ads Optimizer concept weak/local | Build local plan, inspect platforms | Backend ad package/optimization capability hidden; no durable ad package save; no clear next action to launch/test | Medium | P1 |
| Insights | `public/control-center/pages/insights.js` | Performance and learning loop | B- | `fetchProjectInsights`, activity insights, learning, shared handoffs | Insights, learning summaries, weak signals | Analyst-like support, not canonical | Refresh, create handoff, route to optimize | Optimization recommendation route and AI recommendation memory are not exposed as first-class UI | Medium | P1 |
| Research | `public/control-center/pages/research.js` | Market/audience/competitor research | B- | Insights/learning fetches, app state, shared handoffs | Derived research from insights/learning | Researcher present but mostly local | Refresh, save notes, route recommendations | Needs durable research objects and clearer evidence/source model | Medium | P2 |
| Governance | `public/control-center/pages/governance.js` | Trust, approvals, policy | B | Governance APIs, approvals APIs | Approvals, policy, risk controls | Compliance Reviewer implied but not canonical | Create/decide approvals, update policy | Not wrapped by standard page layout; trust layer not embedded across execution pages | Medium | P1 |
| Settings | `public/control-center/pages/settings.js` | Team and project configuration | B- | Team APIs, governance policy APIs, handoff API through render context | Team model, policy save | Team matrix exists but differs from target model | Save team/settings/policy | Must distinguish durable settings from local form state; validation and recovery need polish | Medium | P2 |
| Task Center | `public/control-center/pages/operations-centers.js` | Operational tasks | B | `fetchProjectTaskCenter` | Tasks, assignments, status | Operations Lead implied | Filter, inspect, route | Should be top-level Control group and use standard context/header | Medium | P1 |
| Queue Center | `public/control-center/pages/operations-centers.js` | Queue visibility | B | `fetchProjectQueueCenter` | Queue items, statuses | Operations Lead implied | Filter, inspect, route | Needs stronger relation to Publishing/Workflows/Media jobs | Medium | P1 |
| Job Monitor | `public/control-center/pages/operations-centers.js` | Job/run monitoring | B | `fetchProjectJobMonitor` | Jobs, workflow/media status | Operations Lead implied | Filter, inspect, route | Must be linked from Media and Workflows as the canonical job surface | Medium | P1 |
| Notifications | `public/control-center/pages/operations-centers.js` | Alerts and notifications | B- | `fetchProjectNotificationCenter`, mark notification API | Notifications, unread state | Operations Lead implied | Mark/read, inspect | Needs clearer action routing and priority grouping | Medium | P1 |

## 3. Page-By-Page Truth Audit

### 3.1 Home

Evidence:

- `public/control-center/pages/home.js` is 872 lines.
- Home route definition starts around `public/control-center/pages/home.js:573`.
- Main render writes `root.innerHTML` around `public/control-center/pages/home.js:596`.
- AI team card definitions live around `public/control-center/pages/home.js:139`.
- Home uses shared sections from `public/control-center/pages/home/render-sections.js`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Partially. Good executive shell, not yet full operating home. |
| Professional enough? | Close, but still dashboard-like in some areas. |
| Shows real system power? | Yes for readiness, next action, integrations/assets/ops summaries. Less so for task/queue/job/notifications. |
| Guides user? | Yes, with next action and route buttons. |
| View / Manage / AI Action? | View and AI Action yes. Manage is route-based, not always explicit. |
| Exposes next best action? | Yes through `system-intelligence.js`. |
| Connects to AI team? | Yes, but model is local and duplicated. |
| Routes output to next workspace? | Partially. It navigates, but does not show output lifecycle. |
| Duplicated code? | Local helpers and AI team model duplicate other pages. |
| Risky patterns? | Standard `root.innerHTML` render; manageable at current size. |
| Empty states? | Better than most. Needs stronger task/queue empty states. |
| Premium/international feel? | Good direction, but needs less dashboard density and clearer work journey. |

Required actions:

- Replace local AI team cards with a shared canonical AI team model.
- Make Task Center, Queue Center, Job Monitor, and Notifications visible as operating system status, not secondary utilities.
- Turn the work journey into a lifecycle: idea -> plan -> content -> media -> approval -> publishing -> ads -> insights.

### 3.2 Setup

Evidence:

- `public/control-center/pages/setup.js` is 1552 lines.
- Required setup fields are defined near `public/control-center/pages/setup.js:3`.
- Wizard steps are defined around `public/control-center/pages/setup.js:20`.
- Route definition starts near `public/control-center/pages/setup.js:1140`.
- Render writes `root.innerHTML` around `public/control-center/pages/setup.js:1205`.
- Many local event handlers use inline `onclick`, `oninput`, `onchange`, and delayed `setTimeout` binding.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Functionally useful, not fully OS-grade. |
| Professional enough? | Good foundation, but form density and feedback can be sharper. |
| Shows real system power? | Shows setup/readiness/templates. Does not fully show how setup unlocks downstream AI workflows. |
| Guides user? | Yes, especially through wizard steps. |
| View / Manage / AI Action? | Manage yes, View yes, AI Action weak. |
| Exposes next best action? | Partially. Missing fields are visible; next workspace less explicit. |
| Connects to AI team? | Weak. Needs Strategist/Researcher/Compliance support depending on section. |
| Routes output to next workspace? | Partially. It should show what setup enables next. |
| Duplicated code? | Local helpers, draft state, handlers. |
| Risky patterns? | Many delayed bindings and inline handlers. |
| Empty states? | Mostly acceptable, but should route to Library/Integrations when setup depends on assets/connectors. |
| Premium/international feel? | Serviceable; needs cleaner step structure and better trust language. |

Required actions:

- Add contextual "setup unlocks" status: content generation, media generation, publishing, ads, insights.
- Move repeated wizard/state helpers to shared utilities only after behavior tests.
- Add AI specialist prompt templates: Strategist for positioning, Researcher for audience, Compliance Reviewer for claims.

### 3.3 Library

Evidence:

- `public/control-center/pages/library.js` is 2658 lines.
- Global listener guard `libraryGlobalListenersInitialized` exists.
- Window/document listeners occur around `public/control-center/pages/library.js:413`, `:422`, `:439`, and `:461`.
- Route definition starts around `public/control-center/pages/library.js:2449`.
- Render writes `root.innerHTML` around `public/control-center/pages/library.js:2502`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Strong asset workspace, not fully integrated as OS library. |
| Professional enough? | Useful, but heavy and technically dense. |
| Shows real system power? | Yes for assets, protected media, upload/preview. |
| Guides user? | Partially. It manages assets well but could explain missing assets and where assets go next. |
| View / Manage / AI Action? | View and Manage yes. AI Action is weak/contextual only. |
| Exposes next best action? | Partial. Missing asset labels exist, but not a full AI-directed next action. |
| Connects to AI team? | Weak. Should map to Media Director, Content Writer, Publisher. |
| Routes output to next workspace? | Partial. Should route selected assets into campaign/content/media/publishing. |
| Duplicated code? | Upload/preview/local metadata helpers are candidates for shared modules. |
| Risky patterns? | High due to global document listeners, object URL handling, many inline handlers, large render. |
| Empty states? | Mixed. Needs smart empty states by asset category. |
| Premium/international feel? | Asset manager quality, not yet premium operating library. |

Required actions:

- Extract upload/preview/source badge components only after snapshot testing.
- Add "asset readiness" by downstream use: campaign, product proof, social, publishing, ads.
- Add AI Media Director action: "turn selected assets into a media brief/package."

### 3.4 Integrations

Evidence:

- `public/control-center/pages/integrations.js` is 1688 lines.
- Modular files exist under `public/control-center/pages/integrations/`.
- `builders.js` is 817 lines, `drawer.js` 370, `cards.js` 323, `render.js` 205.
- `actions.js`, `events.js`, and `index.js` are empty.
- Route definition starts around `public/control-center/pages/integrations.js:1395`.
- Render writes `root.innerHTML` around `public/control-center/pages/integrations.js:1485`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | One of the stronger pages, but modularization is unfinished. |
| Professional enough? | Good. It feels closer to a real control surface. |
| Shows real system power? | Yes: health, connect/reconnect/test/sync/import/disconnect. |
| Guides user? | Yes, especially diagnostics and actions. |
| View / Manage / AI Action? | View and Manage yes. AI Action not fully integrated. |
| Exposes next best action? | Partially through diagnostics/recommendations. |
| Connects to AI team? | Weak. Operations Lead or Publisher/Ads Optimizer should own connector issues. |
| Routes output to next workspace? | Partial. Sync/import results should feed Library, Insights, Publishing. |
| Duplicated code? | Builder/card/status logic should finish moving to modules. |
| Risky patterns? | High due to large controller and many action paths. |
| Empty states? | Better than average, but provider limitations need clearer next action. |
| Premium/international feel? | Good, with some implementation unfinishedness visible to maintainers. |

Required actions:

- Finish modularization: move action dispatch and event binding into `actions.js` and `events.js`.
- Remove or populate empty integration CSS files under `public/control-center/styles/integrations/`.
- Add AI Operations Lead action: "diagnose connection and recommend next step."

### 3.5 AI Command

Evidence:

- `public/control-center/pages/ai-command.js` is 1918 lines.
- `MODE_DEFS` starts near `public/control-center/pages/ai-command.js:14`.
- `AGENT_CARDS` starts around `public/control-center/pages/ai-command.js:119`.
- `ensureIntelligenceLoaded` is around `public/control-center/pages/ai-command.js:870`.
- Heavy insight/learning load uses `Promise.allSettled` around `public/control-center/pages/ai-command.js:899`.
- Durable command submission is around `public/control-center/pages/ai-command.js:974`.
- Route definition starts around `public/control-center/pages/ai-command.js:1602`.
- Render writes `root.innerHTML` around `public/control-center/pages/ai-command.js:1646`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Strong central command start, incomplete as durable AI operations hub. |
| Professional enough? | Good, but role and command model need consolidation. |
| Shows real system power? | Shows command execution and intelligence summaries; hides backend AI lists. |
| Guides user? | Yes, but modes/agents/dock/page panels can blur together. |
| View / Manage / AI Action? | AI Action yes. View partial. Manage of durable AI artifacts weak. |
| Exposes next best action? | Yes through derived intelligence. |
| Connects to AI team? | Yes, but inconsistent with target team. Missing Publisher, Compliance Reviewer, Video Lead as first-class cards. |
| Routes output to next workspace? | Partially through artifacts/handoffs. |
| Duplicated code? | AI roles, prompt templates, draft handling, card rendering. |
| Risky patterns? | Heavy intelligence load after render, large local state, duplicate command/control-room concepts. |
| Empty states? | Better than most, but should expose durable AI memory/artifacts. |
| Premium/international feel? | Close, but central vs contextual AI model needs clarity. |

Required actions:

- Add frontend API wrappers for backend AI list endpoints: `/ai/commands`, `/ai/artifacts`, `/ai/recommendations`, `/ai/memory`.
- Make AI Command the global command center, while page AI panels are contextual dispatchers into it.
- Replace local `AGENT_CARDS` with canonical AI team model.

### 3.6 Workflows

Evidence:

- `public/control-center/pages/workflows.js` is 1951 lines.
- Workflow catalog starts near `public/control-center/pages/workflows.js:25`.
- Window bridge listener uses `mh:submit-workflow` around `public/control-center/pages/workflows.js:1104`.
- Auto Mode controller is created around `public/control-center/pages/workflows.js:1207`.
- Auto Mode subscription starts around `public/control-center/pages/workflows.js:1209`.
- `runAutomationPlan` actions appear around `public/control-center/pages/workflows.js:1625` and `:1654`.
- `startAutoMode` action appears around `public/control-center/pages/workflows.js:1676`.
- Route definition starts around `public/control-center/pages/workflows.js:1725`.
- Render writes `root.innerHTML` around `public/control-center/pages/workflows.js:1763`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Functional, but not fully integrated with job/task control. |
| Professional enough? | Good concept, execution surface needs stronger operational safety. |
| Shows real system power? | Yes for workflow runs and safe automation prep. |
| Guides user? | Partially. Needs clearer run states and next operating surface. |
| View / Manage / AI Action? | All three exist. |
| Exposes next best action? | Partially through workflow recommendations. |
| Connects to AI team? | Weak. Operations Lead should own workflow safety and handoffs. |
| Routes output to next workspace? | Partial. Job Monitor and Task Center should be canonical next views. |
| Duplicated code? | Automation panels overlap with Publishing. |
| Risky patterns? | Shared global Auto Mode controller and event bridge need isolation. |
| Empty states? | Acceptable, but should suggest exact workflow to run. |
| Premium/international feel? | Good foundation, but still tool-like rather than OS-grade. |

Required actions:

- Isolate Auto Mode ownership per page/session.
- Link every run to Job Monitor and Queue Center.
- Add Operations Lead panel with safe/blocked/manual action classification.

### 3.7 Publishing

Evidence:

- `public/control-center/pages/publishing.js` is 1830 lines.
- Scoped styles are rendered from JS around `public/control-center/pages/publishing.js:567`.
- Auto Mode start action appears around `public/control-center/pages/publishing.js:1665`.
- Route definition starts around `public/control-center/pages/publishing.js:1707`.
- Render writes `root.innerHTML` around `public/control-center/pages/publishing.js:1764`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Useful and substantial, safety polish still needed. |
| Professional enough? | Good, but high-stakes actions need clearer trust design. |
| Shows real system power? | Yes: queue, schedule, ready, publish, fail, retry-like states. |
| Guides user? | Yes, but should better explain why an item is or is not ready. |
| View / Manage / AI Action? | All three exist. |
| Exposes next best action? | Yes in places. |
| Connects to AI team? | Publisher role present but not canonical. |
| Routes output to next workspace? | Partial. Should feed Insights after publish and Governance before publish. |
| Duplicated code? | Auto Mode panel overlaps with Workflows. Scoped CSS should move to CSS. |
| Risky patterns? | High due to publishing mutations and automation context, though not auto-started. |
| Empty states? | Good in places: "No queue item is ready..." provides next action. |
| Premium/international feel? | Close. Needs execution-grade confirmation and audit trail. |

Required actions:

- Add explicit safety model: Draft -> Ready -> Scheduled -> Published -> Insight Loop.
- Make Compliance Reviewer and Publisher visible before publish actions.
- Ensure publish actions always show source, destination, owner, and rollback/failure path.

### 3.8 Campaign Studio

Evidence:

- `public/control-center/pages/campaign-studio.js` is 1980 lines.
- Role defaults live around `public/control-center/pages/campaign-studio.js:57`.
- Auto-save timer occurs around `public/control-center/pages/campaign-studio.js:508`.
- Insights/learning load uses `Promise.allSettled` around `public/control-center/pages/campaign-studio.js:1206`.
- Campaign save appears around `public/control-center/pages/campaign-studio.js:1288` and `:1305`.
- Handoffs are created around `public/control-center/pages/campaign-studio.js:1339`.
- Route definition starts around `public/control-center/pages/campaign-studio.js:1448`.
- Render writes `root.innerHTML` around `public/control-center/pages/campaign-studio.js:1531`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Good planning surface, incomplete campaign operating lifecycle. |
| Professional enough? | Good, but dense. |
| Shows real system power? | Yes for planning, insights, handoffs. |
| Guides user? | Yes, especially from strategy to handoffs. |
| View / Manage / AI Action? | All three exist. |
| Exposes next best action? | Partially. |
| Connects to AI team? | Strategist is implied, not canonical. |
| Routes output to next workspace? | Yes, one of the better pages for routing. |
| Duplicated code? | Role defaults, handoff cards, draft/session helpers. |
| Risky patterns? | Auto-save timer and large render state. |
| Empty states? | Mostly acceptable. |
| Premium/international feel? | Good but should show campaign status/history more clearly. |

Required actions:

- Add campaign status strip: Draft, planned, content requested, media requested, approval, publishing, ads, insights.
- Save and show campaign history/list more prominently.
- Move Strategist prompt templates to canonical AI team module.

### 3.9 Content Studio

Evidence:

- `public/control-center/pages/content-studio-workspace.js` is 2335 lines.
- `CONTENT_ROLE_DEFAULTS` starts near `public/control-center/pages/content-studio-workspace.js:53`.
- `WRITING_AGENTS` starts around `public/control-center/pages/content-studio-workspace.js:61`.
- Heavy load uses `Promise.all` around `public/control-center/pages/content-studio-workspace.js:781`.
- Scoped styles are rendered from JS around `public/control-center/pages/content-studio-workspace.js:859`.
- Route definition starts around `public/control-center/pages/content-studio-workspace.js:2247`.
- Render writes `root.innerHTML` around `public/control-center/pages/content-studio-workspace.js:2300`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Powerful, but too much local architecture in one file. |
| Professional enough? | Strong workbench, not yet fully premium workflow surface. |
| Shows real system power? | Yes: content items, generation, approvals, tasks, handoffs, events, operations. |
| Guides user? | Yes, but complexity can obscure next step. |
| View / Manage / AI Action? | All three exist. |
| Exposes next best action? | Partial; should be role/status based. |
| Connects to AI team? | Yes, but local writing agents conflict with global team model. |
| Routes output to next workspace? | Yes, but should be visually standardized. |
| Duplicated code? | Role models, scoped CSS, draft handling, task/approval/handoff cards. |
| Risky patterns? | High due to heavy `Promise.all`, large `root.innerHTML`, inline handlers, local fallback state. |
| Empty states? | Mixed. Needs "create content from campaign" and "ask Content Writer" actions. |
| Premium/international feel? | Good but crowded. Needs task-focused layout. |

Required actions:

- Create shared output lifecycle component for Draft -> AI Draft -> Review -> Approved -> Handoff.
- Move scoped styles to `styles/`.
- Progressive-load secondary data after initial workspace render.

### 3.10 Media Studio

Evidence:

- `public/control-center/pages/media-studio-workspace.js` is 3181 lines.
- `MEDIA_ROLE_DEFAULTS` starts near `public/control-center/pages/media-studio-workspace.js:36`.
- `SPECIALISTS` starts around `public/control-center/pages/media-studio-workspace.js:43`.
- Heavy load uses `Promise.all` around `public/control-center/pages/media-studio-workspace.js:572`.
- Scoped styles are rendered from JS around `public/control-center/pages/media-studio-workspace.js:1226`.
- Route definition starts around `public/control-center/pages/media-studio-workspace.js:3088`.
- Render writes `root.innerHTML` around `public/control-center/pages/media-studio-workspace.js:3142`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Strong capability page, highest frontend complexity. |
| Professional enough? | Impressive but dense. |
| Shows real system power? | Yes: media jobs, generation, providers, approvals, tasks, handoffs. |
| Guides user? | Partially. Provider/job states need clearer user-facing explanation. |
| View / Manage / AI Action? | All three exist. |
| Exposes next best action? | Partial. Should be provider-aware and job-aware. |
| Connects to AI team? | Yes, but local specialists conflict with target model. |
| Routes output to next workspace? | Yes, but should route through Job Monitor and Publishing more clearly. |
| Duplicated code? | Role models, scoped CSS, task/approval/handoff/job cards. |
| Risky patterns? | Very high due to file size, heavy load, generated media, local fallback, many handlers. |
| Empty states? | Mixed. Provider not configured states are important but need more trust language. |
| Premium/international feel? | Powerful, but needs calmer hierarchy and source/job confidence labels. |

Required actions:

- Make Job Monitor the canonical surface for generation status.
- Add provider health from Integrations into the Media header.
- Split rendering into safe modules only after tests: briefs, jobs, approvals, handoffs, provider status.

### 3.11 Ads Manager

Evidence:

- `public/control-center/pages/ads-manager.js` is 616 lines.
- Platform definitions start near `public/control-center/pages/ads-manager.js:3`.
- Route definition starts around `public/control-center/pages/ads-manager.js:286`.
- Render writes `root.innerHTML` around `public/control-center/pages/ads-manager.js:343`.
- No direct imports from `api.js`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | No. It is a planning surface, not an Ads OS surface. |
| Professional enough? | Visually acceptable, capability weak. |
| Shows real system power? | No. Backend ad execution package and optimization capabilities are hidden. |
| Guides user? | Partially. |
| View / Manage / AI Action? | View partial, Manage weak, AI Action weak. |
| Exposes next best action? | Weak. |
| Connects to AI team? | Ads Optimizer should be central but is not. |
| Routes output to next workspace? | Weak. Should connect campaign/media/content to ad package and insights. |
| Duplicated code? | Local platform/budget card patterns. |
| Risky patterns? | Lower runtime risk, higher product truth risk because it may imply ads capability without durable backend action. |
| Empty states? | Too placeholder-like. |
| Premium/international feel? | Not yet. |

Required actions:

- Add API wrapper and UI for backend ad execution package route.
- Add Ads Optimizer panel that creates test matrix, creative package, budget guardrails, and handoff to publishing/insights.
- Clearly label unsupported live ad account execution if only package generation exists.

### 3.12 Insights

Evidence:

- `public/control-center/pages/insights.js` is 1518 lines.
- Platform definitions start near `public/control-center/pages/insights.js:5`.
- Route definition starts around `public/control-center/pages/insights.js:1027`.
- Render writes `root.innerHTML` around `public/control-center/pages/insights.js:1129`.
- Refresh action appears around `public/control-center/pages/insights.js:1422`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Useful but underexposes learning engine and optimization routes. |
| Professional enough? | Good direction. |
| Shows real system power? | Partial. Shows insights/learning summaries but not all optimization capabilities. |
| Guides user? | Yes, through handoffs, but recommendations need stronger prioritization. |
| View / Manage / AI Action? | View yes, AI Action partial, Manage partial. |
| Exposes next best action? | Partial. |
| Connects to AI team? | Analyst implied, not canonical. |
| Routes output to next workspace? | Yes through handoffs. |
| Duplicated code? | Handoff/action routing overlaps Research/Campaign. |
| Risky patterns? | Moderate render/listener complexity. |
| Empty states? | Mixed. Should explain what integrations/data are missing. |
| Premium/international feel? | Good, needs stronger causality and recommendation quality. |

Required actions:

- Expose backend optimization recommendation route.
- Show learning loop: signal -> recommendation -> action -> result.
- Make SEO & Insights Analyst a canonical page specialist.

### 3.13 Research

Evidence:

- `public/control-center/pages/research.js` is 1611 lines.
- Action routes start near `public/control-center/pages/research.js:5`.
- Role defaults start around `public/control-center/pages/research.js:12`.
- Intelligence load uses `Promise.allSettled` around `public/control-center/pages/research.js:679`.
- Route definition starts around `public/control-center/pages/research.js:1101`.
- Render writes `root.innerHTML` around `public/control-center/pages/research.js:1209`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Useful derived research page, not a durable research system. |
| Professional enough? | Good enough for current phase. |
| Shows real system power? | Partial. Uses insights/learning but lacks dedicated research storage/workflows. |
| Guides user? | Yes, but evidence/source confidence should be clearer. |
| View / Manage / AI Action? | View yes, AI Action partial, Manage weak. |
| Exposes next best action? | Partial. |
| Connects to AI team? | Researcher is present but local. |
| Routes output to next workspace? | Yes through shared handoffs. |
| Duplicated code? | Handoff/action routing overlaps Insights. |
| Risky patterns? | Moderate. |
| Empty states? | Should explain missing data sources and route to integrations/setup. |
| Premium/international feel? | Promising, needs evidence-grade design. |

Required actions:

- Add durable research note/recommendation model or clearly label local notes.
- Add source/evidence confidence to each insight.
- Route Researcher outputs into Campaign Studio and Content Studio with visible handoff status.

### 3.14 Governance

Evidence:

- `public/control-center/pages/governance.js` is 1029 lines.
- Main page render helper writes `root.innerHTML` around `public/control-center/pages/governance.js:857`.
- Route definition starts around `public/control-center/pages/governance.js:998`.
- Route render writes `root.innerHTML` around `public/control-center/pages/governance.js:1015`.
- Governance is not included in the standard page required routes in `public/control-center/ui/page-standard.js`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Strong start. |
| Professional enough? | Good, but should feel more central. |
| Shows real system power? | Yes: policy and approval state. |
| Guides user? | Partially. |
| View / Manage / AI Action? | View and Manage yes, AI Action weak. |
| Exposes next best action? | Partial. |
| Connects to AI team? | Compliance Reviewer should own this page, but model is not canonical. |
| Routes output to next workspace? | Partial. Should block/approve Publishing, Content, Media, Ads. |
| Duplicated code? | Approval/status cards overlap Content/Media/Publishing. |
| Risky patterns? | Moderate. |
| Empty states? | Should distinguish "no approvals needed" from "approval system empty/unconfigured." |
| Premium/international feel? | Good, should be more cockpit-like. |

Required actions:

- Add Governance to standard page contract and Control sidebar group.
- Add Compliance Reviewer panel and approval SLA/status summary.
- Embed governance status into Publishing, Content, Media, Ads.

### 3.15 Settings

Evidence:

- `public/control-center/pages/settings.js` is 1933 lines.
- `TEAM_ROLE_MATRIX` starts around `public/control-center/pages/settings.js:65`.
- Durable settings load uses `Promise.allSettled` around `public/control-center/pages/settings.js:1095`.
- Render writes `root.innerHTML` around `public/control-center/pages/settings.js:1732`.
- Route definition starts around `public/control-center/pages/settings.js:1895`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Good configuration surface, not fully clean. |
| Professional enough? | Good but dense. |
| Shows real system power? | Yes for team/policy. |
| Guides user? | Partially. Settings should explain operational impact. |
| View / Manage / AI Action? | View and Manage yes, AI Action weak. |
| Exposes next best action? | Weak. |
| Connects to AI team? | Yes through team matrix, but roles differ from target model. |
| Routes output to next workspace? | Weak. |
| Duplicated code? | Team role model duplicates AI Command/Home/Content/Media. |
| Risky patterns? | Moderate. |
| Empty states? | Needs durable/local state clarity. |
| Premium/international feel? | Good enough, not yet excellent. |

Required actions:

- Make Settings the source of configuration, not the source of AI role definitions.
- Canonicalize role definitions in shared module, with settings editing assignments/preferences.
- Add "what this changes" summaries before save.

### 3.16 Operations Centers

Evidence:

- `public/control-center/pages/operations-centers.js` is 1436 lines.
- Task center route starts around `public/control-center/pages/operations-centers.js:1308`.
- Queue center route starts around `public/control-center/pages/operations-centers.js:1342`.
- Job monitor route starts around `public/control-center/pages/operations-centers.js:1374`.
- Notification center route starts around `public/control-center/pages/operations-centers.js:1406`.
- Renders write `root.innerHTML` around `public/control-center/pages/operations-centers.js:597`, `:758`, `:931`, and `:1166`.

Judgment:

| Question | Answer |
|---|---|
| Complete? | Useful, but under-positioned. |
| Professional enough? | Good operational table/card surfaces. |
| Shows real system power? | Yes: tasks, queues, jobs, notifications. |
| Guides user? | Partially. Needs stronger "what to do now" actions. |
| View / Manage / AI Action? | View yes, Manage partial, AI Action weak. |
| Exposes next best action? | Partial. |
| Connects to AI team? | Operations Lead should own these pages. |
| Routes output to next workspace? | Partial. |
| Duplicated code? | Similar center render/filter/status/card logic. |
| Risky patterns? | Moderate: rerenders with filters and many `root.innerHTML` writes. |
| Empty states? | Better if empty states explain whether system is healthy or disconnected. |
| Premium/international feel? | Good, but should be visible as Control layer. |

Required actions:

- Promote all four routes into final sidebar Control group.
- Add standard page header/status/next action.
- Route Workflows and Media job status here by default.

## 4. Backend Power Vs Frontend Visibility Matrix

| Backend capability | Existing route/function/file | Frontend page that should expose it | Current visibility | Recommended UI surface | Priority |
|---|---|---|---|---|---|
| Full operations snapshot | `runtime/orchestrator-service/lib/ops/backbone.js:3825`, `server.js` operations routes around `10693` | Home, Operations Centers, AI Command | Partially visible | Global operations status strip and Control center summaries | P0 |
| Task center | `server.js` routes around `11262`; `api.js` task helpers around `1487` | Task Center, Home, Content/Media/Publishing | Visible but under-positioned | Control group route plus page-level task chips | P1 |
| Queue center | `server.js` operations center routes around `10693` | Queue Center, Publishing, Workflows | Visible but under-positioned | Queue health panel and per-item action routing | P1 |
| Job monitor | `server.js` operations center routes around `10693` | Job Monitor, Workflows, Media Studio | Visible but not canonical | Job status drawer/card linked from all generating pages | P1 |
| Notifications | `server.js` routes around `11413`; `api.js` mark helper around `2182` | Notifications, Home topbar | Partially visible | Notification center plus topbar unread/action routing | P1 |
| Workflow runs | `server.js` routes around `11012`; `api.js:1440`, `api.js:1457` | Workflows, Job Monitor | Partially visible | Run timeline with job link and human-safe action states | P0 |
| AI command execution | `server.js` AI route around `11218`; `api.js:1474` | AI Command, page AI panels | Visible | Keep central command, add contextual dispatchers | P0 |
| AI command history | `server.js` AI list route around `11218` | AI Command, Home | Hidden | Durable command history panel | P0 |
| AI artifacts | `server.js` AI artifacts route around `11218` | AI Command, Library, Content, Media | Hidden/indirect | Artifact inbox with source, owner, next workspace | P0 |
| AI recommendations | `server.js` AI recommendations route around `11218` | Home, Insights, AI Command | Hidden/indirect | Recommendation queue ranked by impact/risk | P0 |
| AI memory | `server.js` AI memory route around `11218` | AI Command, Settings, Insights | Hidden | Project memory viewer with trust/source labels | P1 |
| Handoffs | `server.js` routes around `11488`; `api.js:2112` | Campaign, Content, Media, Publishing, Ops | Partially visible | Shared handoff component and pipeline state | P1 |
| Events | `server.js` routes around `11511`; `api.js:2124` | Operations Centers, page activity panels | Partially visible | Recent activity timeline shared component | P2 |
| Campaigns | `server.js` routes around `10845`; `api.js:1911` | Campaign Studio, Home | Partially visible | Campaign list/status and lifecycle timeline | P1 |
| Content items | `server.js` routes around `10880`; `api.js:1930` | Content Studio, Library, Publishing | Visible | Shared output lifecycle and source labels | P1 |
| Media jobs | `server.js` routes around `10923`; `api.js:1977` | Media Studio, Job Monitor, Library | Visible but not fully centralized | Media job monitor with provider status | P1 |
| Media generation | `server.js` routes around `21305`; `api.js:2040` | Media Studio | Visible | Keep, add provider/integration readiness panel | P1 |
| Publishing queue and mutations | `server.js` routes around `11757`; `api.js:1751` | Publishing | Visible | Execution cockpit with approval/safety strip | P0 |
| Approvals | `server.js` routes around `11343`; `api.js:1547` | Governance, Content, Media, Publishing | Visible but fragmented | Shared approval gate component | P1 |
| Governance policy | `server.js` routes around `11391`; `api.js:1577` | Governance, Settings, Publishing | Visible | Trust layer embedded into execution pages | P1 |
| Integrations health/actions | `server.js` routes around `11696`; `api.js:1597` | Integrations, Setup, Insights, Publishing | Visible | Keep, complete modularization and AI diagnosis | P0 |
| Insights | `server.js` routes around `11533`; `api.js:1256` | Insights, Home, AI Command | Visible | Signal -> recommendation -> action loop | P1 |
| Learning engine | `runtime/orchestrator-service/lib/insights/learning-engine.js`; `api.js:1267` | Insights, Research, AI Command | Partially visible | Learning memory and confidence/source cards | P1 |
| Optimization recommendations | `server.js` route around `21277` | Insights, Ads Manager, Campaign Studio | Hidden | "Generate optimization plan" action and recommendation queue | P0 |
| Performance summary | `server.js` route around `21258` | Insights, Home | Hidden/indirect | Executive performance summary with source labels | P1 |
| Smart suggestions | `server.js` route around `21485` | Home, AI Command, Insights | Hidden | Next best actions panel backed by server suggestions | P1 |
| Ad execution package | `server.js` route around `9416` | Ads Manager, Campaign Studio | Hidden | Ads package builder with guardrails and export/handoff | P0 |
| Team model | `server.js` routes around `10797`; `api.js:1887` | Settings, Home, AI panels | Visible but inconsistent | Settings edits assignments; shared role model powers UI | P1 |

## 5. UI/UX Deep Audit

### 5.1 What To Keep

- Keep the modular CSS load order in `public/control-center/index.html`; root `styles.css` is not active.
- Keep `public/control-center/styles/00-tokens.css` as the design-token entry point.
- Keep `public/control-center/styles/10-topbar-canonical.css` as the canonical topbar base.
- Keep the standard page wrapper concept in `public/control-center/ui/page-standard.js`.
- Keep operations centers as real routes; they are essential for OS credibility.
- Keep the automation engine safety model in `public/control-center/automation-engine.js`.
- Keep integrations modular files and continue the extraction.
- Keep Home's executive direction and page standardization direction.

### 5.2 What To Remove Or Archive

| Item | File path | Reason | Priority |
|---|---|---|---|
| Empty integration modules if not used soon | `public/control-center/pages/integrations/actions.js`, `events.js`, `index.js` | Empty files signal incomplete architecture. Better to populate or remove. | P2 |
| Empty integration CSS files | `public/control-center/styles/integrations/*.css` | All scanned files are 0 lines. They add confusion to CSS ownership. | P2 |
| Old fallback app placeholders | `public/control-center/app.js` placeholder/error fallback blocks around old section IDs | Generic "No data" and "Unavailable" fallbacks do not match smart OS philosophy. Remove if dead, replace if live. | P1 |
| Hidden legacy standard page areas | `public/control-center/styles/14-page-standard.css` hidden `.std-*` recovery blocks | CSS hides old structure instead of deleting/contracting it. | P1 |
| Page-local AI role definitions | Home, AI Command, Content, Media, Settings, Campaign, Research | Role drift makes AI team feel decorative and inconsistent. | P0 |
| Scoped CSS emitted by JS | Content, Media, Publishing | Makes styling hard to audit and creates hidden local design systems. | P1 |

### 5.3 What To Consolidate

| Pattern | Current files | Recommended shared component/module | Priority |
|---|---|---|---|
| Status badges and normalization | Many pages | `public/control-center/ui/status.js` | P1 |
| Empty states | Many pages | `public/control-center/ui/empty-state.js` | P1 |
| AI team roles and prompt templates | Home, AI Command, Settings, Content, Media, Campaign, Research | `public/control-center/ui/ai-team.js` or `public/control-center/ai-team-model.js` | P0 |
| Handoff cards | Campaign, Content, Media, Insights, Research | `public/control-center/ui/handoffs.js` | P1 |
| Approval gates | Governance, Content, Media, Publishing | `public/control-center/ui/approval-gate.js` | P1 |
| Operations mini status | Home, Workflows, Media, Publishing, Ops Centers | `public/control-center/ui/operations-summary.js` | P1 |
| Asset upload/preview | Library, Media, Content | `public/control-center/ui/asset-picker.js` | P2 |
| Page shell contract | `page-standard.js`, page files | `page-standard.js` plus route metadata in `router.js` | P0 |
| API normalization helpers | Many pages | `public/control-center/utils/data.js` | P1 |

### 5.4 CSS And Layout Findings

| Area | Finding | Evidence | Risk | Recommendation |
|---|---|---|---|---|
| Token palette | Current theme leans dark blue/cyan. | `public/control-center/styles/00-tokens.css` | Medium | Keep premium dark base, but add neutral/status/brand variation so the UI does not become one-note. |
| Radius scale | Tokens include 10/14/18 radius values. | `00-tokens.css`, `08-components-foundation.css`, `14-page-standard.css` | Medium | For future work, reduce default cards to <= 8px unless an established component requires more. |
| Typography | Some CSS uses viewport-scaled font sizing and negative letter spacing. | `public/control-center/styles/14-page-standard.css` | Medium | Remove `vw` font scaling and negative letter spacing during CSS consolidation. |
| Standard page CSS | `14-page-standard.css` is 1255 lines with broad recovery and `!important` rules. | `public/control-center/styles/14-page-standard.css` | High | Convert from recovery layer to deliberate component CSS. |
| Sidebar IA | Current sidebar groups are Primary, Secondary, System. | `public/control-center/index.html` | High | Replace with Command, Foundation, Operations, Intelligence, Control. |
| Command/AI layers | Command bar, AI dock, AI Command page, page panels overlap conceptually. | `index.html`, `app.js`, `ai-command.js`, `page-standard.js` | High | Define single model: global AI dock routes to AI Command; page panels provide contextual prompts. |
| Mobile behavior | Shell has responsive controls, heavy pages not proven. | `app.js:3260+` responsive binding | Medium-High | Run responsive screenshot/pass after consolidation; simplify dense workspaces. |
| Accessibility basics | Buttons exist, but many inline handlers and dynamic cards need focus/aria review. | Many page files | Medium | Add keyboard/focus contract to shared components first. |

## 6. AI Team UX Audit

### 6.1 Current Problem

AI is visible, but the AI team is not yet a coherent product model.

Evidence:

- Home defines near-target AI team cards around `public/control-center/pages/home.js:139`.
- AI Command defines `MODE_DEFS` around `public/control-center/pages/ai-command.js:14` and `AGENT_CARDS` around `:119`.
- Content Studio defines `WRITING_AGENTS` around `public/control-center/pages/content-studio-workspace.js:61`.
- Media Studio defines `SPECIALISTS` around `public/control-center/pages/media-studio-workspace.js:43`.
- Settings defines `TEAM_ROLE_MATRIX` around `public/control-center/pages/settings.js:65`.
- Campaign and Research define their own role defaults.

The result: AI roles look useful page by page, but the product does not feel like one smart team. Users cannot easily learn "who does what" across the OS.

### 6.2 Final Canonical AI Team

| Role | Primary pages | User promise | Backend/action connection |
|---|---|---|---|
| Strategist | Home, Campaign Studio, AI Command | Turns business context into campaign direction and launch decisions. | Campaign save, AI command, handoffs, recommendations. |
| Content Writer | Content Studio, Campaign Studio, Publishing | Writes copy, captions, scripts, product text, emails. | Content item APIs, AI command, approval/handoff APIs. |
| Media Director | Media Studio, Library, Campaign Studio | Directs visuals, brand assets, image quality, media packages. | Media jobs, generation, asset library, approvals. |
| Video Lead | Media Studio, Content Studio, Publishing | Plans short-form/video packages and scripts. | Media jobs, content scripts, publishing queue. |
| Publisher | Publishing, Integrations, Queue Center | Schedules, hands off, retries, and tracks publication. | Publishing APIs, queue center, notifications. |
| Ads Optimizer | Ads Manager, Insights, Campaign Studio | Builds ad test packages and paid-media optimization plans. | Ad package route, optimization recommendations, insights. |
| SEO & Insights Analyst | Insights, Research, Home | Reads weak signals and turns learning into actions. | Insights, learning engine, performance summary, recommendations. |
| Researcher | Research, Setup, Campaign Studio | Finds audience, competitor, market, positioning evidence. | Insights/learning, AI command, durable research future. |
| Compliance Reviewer | Governance, Publishing, Content, Media, Ads | Checks claims, risk, approvals, and safe execution. | Governance policy, approvals, approval gates. |
| Operations Lead | Workflows, Task Center, Queue Center, Job Monitor, Notifications | Keeps work moving safely across queues, jobs, handoffs, alerts. | Operations snapshot, tasks, queues, jobs, notifications, automation engine. |

### 6.3 Recommended AI Component Structure

| Component/module | Purpose | Files to add/change later |
|---|---|---|
| `public/control-center/ai-team-model.js` | Canonical roles, page mapping, default prompt templates, action capabilities. | New shared module. |
| `public/control-center/ui/ai-specialist-panel.js` | Page contextual panel: owner, status, suggested prompt, action buttons. | New shared component. |
| `public/control-center/ui/ai-output-card.js` | Durable AI output card: artifact, recommendation, memory, handoff. | New shared component. |
| `public/control-center/api.js` AI list wrappers | Fetch AI commands, artifacts, recommendations, memory. | Add wrappers without changing existing behavior first. |
| `public/control-center/pages/ai-command.js` | Central command history, memory, artifact inbox. | Replace local role list with shared model. |
| `public/control-center/ui/page-standard.js` | Render AI specialist consistently on standard pages. | Add optional `aiRole` metadata. |

### 6.4 Global AI Command Vs AI Dock Vs Page Panels

Final model:

- **AI Command page**: the central durable AI workspace. It owns command history, artifacts, recommendations, memory, and cross-page dispatch.
- **Global AI dock**: fast access layer. It should open command, accept a quick prompt, and route to page-specific actions. It should not be a second full AI product.
- **Page AI panel**: contextual specialist. It should show "who owns this page", next prompt, safe actions, and where output goes next.

Avoid:

- Separate role definitions per page.
- Different names for the same specialist.
- Page panels that generate untracked local outputs.
- AI dock suggestions that do not map to durable commands, handoffs, or route actions.

## 7. Duplication Audit

| Duplicate pattern | Files involved | Risk | Recommended shared module/component | Extraction priority |
|---|---|---|---|---|
| `asArray`, `asObject`, `asString` helpers | Most pages, integration modules, Home sections | Low individually, high maintenance noise | `public/control-center/utils/data.js` | P1 |
| Status normalization and badge classes | Pages, operations centers, integrations, publishing/content/media | Medium | `public/control-center/ui/status.js` | P1 |
| AI team/role definitions | Home, AI Command, Content, Media, Settings, Campaign, Research | High product inconsistency | `public/control-center/ai-team-model.js` | P0 |
| Empty state markup | Home, Library, Integrations, Operations, Insights, Research, Ads | Medium | `public/control-center/ui/empty-state.js` | P1 |
| Handoff cards/action routing | Campaign, Content, Media, Insights, Research | Medium-High | `public/control-center/ui/handoffs.js` | P1 |
| Approval cards/gates | Governance, Content, Media, Publishing | High because approval safety matters | `public/control-center/ui/approval-gate.js` | P1 |
| Scoped CSS renderers | Content, Media, Publishing | High CSS ownership risk | Move to `public/control-center/styles/` | P1 |
| Draft/session/local state | AI Command, Setup, Workflows, Content, Media, Publishing, Campaign | Medium | `public/control-center/runtime/draft-store.js` | P2 |
| Operations summaries | Home, Workflows, Media, Publishing, Operations Centers | Medium | `public/control-center/ui/operations-summary.js` | P1 |
| Integration status/action builders | `integrations.js`, `pages/integrations/builders.js`, `cards.js`, `drawer.js` | Medium | Finish `actions.js` and `events.js` extraction | P0 |
| App and router route access maps | `public/control-center/app.js:64+`, `public/control-center/router.js` | Medium | Single route metadata source in `router.js` | P1 |
| Page standard metrics/context builders | `page-standard.js` and page-local summaries | Medium | Route metadata plus shared context builder | P1 |

## 8. Runtime Safety Audit

### 8.1 Safe Or Mostly Safe

| Pattern | Evidence | Classification | Notes |
|---|---|---|---|
| Auto Mode does not start on render | `startAutoMode` only appears behind user actions in Workflows and Publishing; automation engine exposes `startAutoMode` around `public/control-center/automation-engine.js:607` | Safe | Matches rule: no Auto Mode starts automatically from page render. |
| Automation blocks dangerous commands | `AUTO_BLOCK_PATTERNS` in `public/control-center/automation-engine.js` | Safe | Good safety foundation. |
| Persisted Auto Mode state pauses after reload | `readPersistedAutoModeState` in `automation-engine.js` | Safe | Prevents accidental continuation. |
| Global click diagnostic guard | `public/control-center/app.js:1186` area | Safe with caveat | Guarded by global flag. |
| Global loading watchdog | `public/control-center/app.js:1675` area | Safe with caveat | Guarded, but should remain startup-only. |
| Global error guards | `public/control-center/app.js:1740` area | Safe with caveat | Guarded by global flag. |

### 8.2 Needs Guard Or Cleanup

| Pattern | Evidence | Classification | Recommendation |
|---|---|---|---|
| Route listener binding | `public/control-center/app.js:3121`, `:3129` | Needs guard | Add explicit guard or lifecycle contract if `init()` can ever rerun. |
| Responsive shell binding | `public/control-center/app.js:3260+`, resize around `:3341`, orientation around `:3348` | Needs cleanup | Guard exists, but this owns too many shell concerns. Split shell runtime later. |
| AI dock listeners | `public/control-center/app.js:3576-3630` | Needs cleanup | Guard exists, but AI dock should route through one AI command model. |
| Page standard `onclick` bindings | `public/control-center/ui/page-standard.js:463`, `:514`, `:519` | Needs cleanup | Acceptable temporarily; shared component should use delegated/action registry. |
| Operations center filter rerenders | `operations-centers.js` multiple roots and filter handlers | Needs guard | Keep, but avoid full re-render on every input where possible. |

### 8.3 Risky

| Pattern | Evidence | Classification | Recommendation |
|---|---|---|---|
| Large `root.innerHTML` pages | AI Command, Content, Media, Library, Workflows, Publishing, Operations | Risky | Keep temporarily, but extract stable components before adding features. |
| Library global listeners | `public/control-center/pages/library.js:413`, `:422`, `:439`, `:461` | Risky | Ensure one install, cleanup on unload, and avoid page-specific global leaks. |
| Heavy initial `Promise.all` loads | Content around `:781`, Media around `:572` | Risky | Render primary workspace first, load secondary ops/approvals/handoffs progressively. |
| Heavy intelligence loads | AI Command around `:870`, Research around `:679`, Campaign around `:1206` | Risky | Ensure all loads are non-blocking and cancellable/ignore stale route. |
| Shared Auto Mode controller | Workflows and Publishing both create/use controller | Risky | Scope automation context to route/session and show owner. |
| Scoped CSS in JS | Content, Media, Publishing | Risky | Move to CSS files to avoid hidden local style systems. |

### 8.4 Must Isolate Before Expanding

| Area | Why | Required isolation |
|---|---|---|
| Publishing execution mutations | High-trust, externally visible actions | Explicit confirmation, approval gate, owner/source/destination summary, durable event result. |
| Auto Mode execution across routes | Shared controller can create confusing ownership | Route-scoped controller and visible "automation owner" state. |
| Media generation jobs | Provider cost/failure/job states matter | Link every generation to Job Monitor and provider health. |
| AI memory/recommendation display | Hidden backend power can confuse if surfaced badly | Use source labels, timestamps, confidence, and "apply to workspace" actions. |

## 9. Empty/Error/Loading State Audit

Search terms included: "No data", "No items yet", "Not selected", "Unknown", "Missing", "Coming soon", "Placeholder", "Unavailable", "Failed", "Error".

| State pattern | Current judgment | Required replacement |
|---|---|---|
| Generic "No data is available yet." | Not acceptable for OS-grade product if user sees it. | Explain missing source and offer action: connect integration, complete setup, ask AI, create first item. |
| "This section is currently unavailable." | Not enough unless followed by reason and recovery. | Show backend unavailable vs not configured vs no permission vs no project selected. |
| Integration "Unavailable" provider support | Acceptable only if it says provider support is not configured. | Add setup/admin action or "coming later" truth label. |
| Media provider not configured/local fallback | Acceptable if clearly labeled. | Add provider health, local mode badge, and link to Integrations. |
| Publishing "No queue item is ready..." | Good. | Keep, standardize this smart empty state pattern. |
| Operations center empty state | Partially acceptable. | Distinguish "healthy empty" from "data not loaded." |
| Ads placeholder/manual inputs | Product risk. | Replace with "ad execution package not built yet" and route to Campaign/Media/Insights. |
| Research missing data | Needs improvement. | Explain missing integrations/learning signals and route to Integrations/Setup. |
| Settings unknown/default values | Needs source clarity. | Mark backend saved vs local draft vs default. |
| AI Command empty history/artifacts | Needs backend wrappers. | Show durable history/artifact empty state with "run first command" and "import recommendation" actions. |

Smart empty state standard:

1. State what is missing.
2. State why it matters.
3. Show the next best action.
4. Offer the responsible AI specialist.
5. Route to the correct workspace.

## 10. Final Product Architecture Recommendation

### 10.1 Final Information Architecture

The frontend should be organized as an operating system with one journey:

Project state -> AI planning -> Foundation -> Production -> Approval -> Publishing/Ads -> Insights -> Learning -> Next action.

### 10.2 Smart Header

Header should show:

- Current project and market.
- Readiness status.
- Active route owner/specialist.
- Global command trigger.
- Notifications count.
- Current operation status: idle, running, blocked, approval needed.

Files:

- `public/control-center/index.html`
- `public/control-center/app.js`
- `public/control-center/styles/03-app-shell.css`
- `public/control-center/styles/10-topbar-canonical.css`

### 10.3 Smart Sidebar Groups

Recommended final sidebar:

**Command**

- Home
- AI Command

**Foundation**

- Setup
- Library
- Integrations
- Settings

**Operations**

- Workflows
- Campaign Studio
- Content Studio
- Media Studio
- Publishing
- Ads Manager

**Intelligence**

- Insights
- Research

**Control**

- Governance
- Task Center
- Queue Center
- Job Monitor
- Notifications

Current routing supports these routes, but `public/control-center/index.html`, `public/control-center/router.js`, `public/control-center/app.js`, and `public/control-center/ui/page-standard.js` need metadata consolidation so grouping and role access are not duplicated.

### 10.4 Global AI Layer

Recommended:

- `AI Command` owns durable command history, artifacts, recommendations, memory.
- Global AI dock opens command and supports quick contextual prompt handoff.
- Page AI panels show specialist, next prompt, and safe actions.

### 10.5 Page AI Panels

Every major page should show:

- Specialist owner.
- Status interpretation.
- Next best prompt.
- Available safe action.
- Output destination.

Examples:

| Page | Specialist | Output goes next |
|---|---|---|
| Home | Strategist + Operations Lead | Highest priority route |
| Setup | Strategist / Researcher / Compliance Reviewer | Campaign, Content, Governance |
| Library | Media Director | Campaign, Media, Publishing |
| Integrations | Operations Lead | Insights, Publishing, Library |
| Campaign Studio | Strategist | Content, Media, Publishing, Ads |
| Content Studio | Content Writer | Governance, Publishing, Library |
| Media Studio | Media Director / Video Lead | Job Monitor, Library, Publishing |
| Publishing | Publisher | Insights, Notifications |
| Ads Manager | Ads Optimizer | Insights, Campaign |
| Insights | SEO & Insights Analyst | Campaign, Content, Ads |
| Research | Researcher | Setup, Campaign, Content |
| Governance | Compliance Reviewer | Approved execution pages |
| Operations Centers | Operations Lead | Source route for item |

### 10.6 Governance And Trust Layer

Trust should not live only on Governance. It must be visible before risky actions:

- Content approval.
- Media generation approval.
- Publishing approval.
- Ads package approval.
- Integration disconnect/reconnect.
- Auto Mode run.

Use shared approval gate component with:

- Policy status.
- Required approver.
- Risk level.
- Audit trail link.
- Safe next action.

### 10.7 Insights/Learning Loop

The frontend should make learning visible:

Signal -> Interpretation -> Recommendation -> Action -> Result -> Memory.

Today this is fragmented across Insights, Research, Home, and AI Command. Add durable AI recommendation/memory visibility and route recommendations into Campaign/Content/Media/Ads/Publishing.

## 11. Implementation Roadmap

### Phase 0: Audit Cleanup And Safety

| Item | Detail |
|---|---|
| Exact files | `audits/frontend/final-truth/FRONTEND_FINAL_TRUTH_AUDIT_AND_SMART_UX_PLAN.md`, then tests only. |
| Goals | Establish truth report, protect current runtime, document no-production-change baseline. |
| Risk | Low. |
| Validation command | `git status --short`; `node --check public/control-center/app.js`; `node --check public/control-center/router.js`; `node --check public/control-center/api.js`; page loop syntax check. |
| Commit boundary | `audit: add final frontend truth audit`. |
| Do not touch | `public/control-center/**`, `runtime/orchestrator-service/**` in this phase. |

### Phase 1: Shell/Header/Sidebar Consolidation

| Item | Detail |
|---|---|
| Exact files | `public/control-center/index.html`, `public/control-center/router.js`, `public/control-center/app.js`, `public/control-center/styles/03-app-shell.css`, `07-sidebar.css`, `10-topbar-canonical.css`. |
| Goals | Rename sidebar groups; centralize route metadata; reduce duplicated route access maps; expose Control group. |
| Risk | Medium because shell affects every route. |
| Validation command | Node checks plus manual route smoke: Home, AI Command, Integrations, Publishing, Task Center. |
| Commit boundary | `frontend: consolidate control center shell navigation`. |
| Do not touch | Page internals except route metadata integration. |

### Phase 2: Shared Components And Design System

| Item | Detail |
|---|---|
| Exact files | `public/control-center/ui/page-standard.js`, new `ui/status.js`, `ui/empty-state.js`, `utils/data.js`, `styles/08-components-foundation.css`, `styles/14-page-standard.css`. |
| Goals | Shared status badges, smart empty states, data helpers, cleaner standard page contract. |
| Risk | Medium-High because repeated page patterns may differ subtly. |
| Validation command | Node checks and visual smoke for Home, Setup, Integrations, Operations Centers. |
| Commit boundary | `frontend: add shared page primitives`. |
| Do not touch | Media/Content internal render refactors until after shared primitives are stable. |

### Phase 3: AI Team Component And Contextual Panels

| Item | Detail |
|---|---|
| Exact files | New `public/control-center/ai-team-model.js`, new `public/control-center/ui/ai-specialist-panel.js`, `pages/home.js`, `pages/ai-command.js`, `pages/settings.js`, `ui/page-standard.js`. |
| Goals | Canonical team roles, page-role mapping, prompt templates, one shared AI specialist panel. |
| Risk | Medium. Product meaning changes, but behavior can stay read-only first. |
| Validation command | Node checks; verify Home and AI Command render. |
| Commit boundary | `frontend: introduce canonical ai team model`. |
| Do not touch | Backend AI command execution behavior. |

### Phase 4: Page-By-Page UX Upgrades

| Item | Detail |
|---|---|
| Exact files | `pages/home.js`, `setup.js`, `library.js`, `integrations.js`, `ads-manager.js`, `insights.js`, `research.js`, `governance.js`, `settings.js`, `operations-centers.js`. |
| Goals | Add status, next action, AI specialist, output destination, smart empty states per page. |
| Risk | Medium. |
| Validation command | Node checks and page route smoke. |
| Commit boundary | One commit per 2-3 related pages. |
| Do not touch | Heavy Content/Media/Campaign internals in same commit. |

### Phase 5: Workflows/Publishing Safety Isolation

| Item | Detail |
|---|---|
| Exact files | `public/control-center/automation-engine.js`, `pages/workflows.js`, `pages/publishing.js`, `pages/operations-centers.js`, `pages/governance.js`. |
| Goals | Route-scoped automation context, explicit owner/status, approval gate before publish, job/queue links. |
| Risk | High because execution actions are sensitive. |
| Validation command | Node checks; manual test: no Auto Mode starts on render; workflow prepare; publishing draft/schedule path. |
| Commit boundary | `frontend: isolate automation and publishing safety states`. |
| Do not touch | Backend mutation semantics unless a frontend bug reveals a server contract problem. |

### Phase 6: Media/Content/Campaign Heavy Page Refactor

| Item | Detail |
|---|---|
| Exact files | `pages/content-studio-workspace.js`, `pages/media-studio-workspace.js`, `pages/campaign-studio.js`, new `ui/handoffs.js`, `ui/approval-gate.js`, `ui/operations-summary.js`, CSS files. |
| Goals | Split rendering safely, remove scoped CSS from JS, progressive-load secondary data, standardize lifecycle cards. |
| Risk | High. These are large, capability-rich pages. |
| Validation command | Node checks; create/save content smoke; media provider unavailable smoke; campaign handoff smoke. |
| Commit boundary | Separate commits: Campaign, Content, Media. |
| Do not touch | Library upload internals in same commit. |

### Phase 7: Insights/Research/Governance Power Visibility

| Item | Detail |
|---|---|
| Exact files | `api.js`, `pages/insights.js`, `pages/research.js`, `pages/governance.js`, `pages/ai-command.js`. |
| Goals | Expose optimization recommendations, performance summary, AI recommendations/memory/artifacts, evidence confidence, compliance reviewer. |
| Risk | Medium-High due to new API surfaces. |
| Validation command | Node checks; API wrapper smoke with unavailable backend handled gracefully. |
| Commit boundary | `frontend: expose durable intelligence and trust signals`. |
| Do not touch | Ads live execution unless backend support is explicit. |

### Phase 8: Performance/Mobile/Accessibility Pass

| Item | Detail |
|---|---|
| Exact files | Shell CSS, page CSS, heavy workspaces, shared components. |
| Goals | Mobile layouts, keyboard focus, aria labels, reduced re-render pressure, loading skeletons. |
| Risk | Medium. |
| Validation command | Node checks; browser smoke on desktop/tablet/mobile widths; accessibility spot check. |
| Commit boundary | `frontend: improve responsive and accessibility polish`. |
| Do not touch | Product behavior or backend contracts. |

### Phase 9: Final Release Readiness

| Item | Detail |
|---|---|
| Exact files | Audit docs, release checklist, all touched frontend files. |
| Goals | Confirm no misleading fake data, no auto-start execution, no unguarded listener regressions, no legacy CSS override, no hidden backend power critical to OS story. |
| Risk | Low-Medium. |
| Validation command | Full node syntax check loop; browser smoke; route smoke; optional Playwright if available. |
| Commit boundary | `frontend: finalize control center release readiness`. |
| Do not touch | Large architectural refactors. |

## 12. Final Judgment

### 12.1 Is The Frontend 100% Complete Now?

No.

It is a credible and increasingly powerful Control Center, but not yet a complete AI Business / Marketing / Operations Operating System.

### 12.2 Realistic Completion

**62% complete** toward the stated vision.

### 12.3 Top 10 Blockers

1. No canonical AI team model. Roles differ across Home, AI Command, Settings, Content, Media, Campaign, and Research.
2. Backend AI command history, artifacts, recommendations, and memory are not directly exposed through frontend API/UI.
3. Ads Manager does not expose ad execution package or optimization backend power.
4. Sidebar IA still uses Primary/Secondary/System instead of Command/Foundation/Operations/Intelligence/Control.
5. `public/control-center/app.js` is 4016 lines and owns too much shell, startup, diagnostics, routing, command, AI dock, and responsive behavior.
6. Heavy pages use large `root.innerHTML` renders with many local handlers.
7. Workflows and Publishing share Auto Mode concepts without enough route-scoped ownership.
8. `public/control-center/styles/14-page-standard.css` is too broad and recovery-like, with hidden legacy structures and `!important` rules.
9. Content/Media/Publishing scoped CSS inside JS weakens design-system control.
10. Empty states are inconsistent and sometimes fail the "what should I do next" standard.

### 12.4 Top 10 Quick Wins

1. Add frontend API wrappers for AI commands, artifacts, recommendations, and memory.
2. Create canonical AI team model as a read-only shared module.
3. Replace sidebar groups with Command/Foundation/Operations/Intelligence/Control.
4. Add Governance and Operations Centers to standard page treatment.
5. Add smart empty state shared component and replace generic "No data" where user-visible.
6. Add source labels: backend, local draft, fallback, provider unavailable.
7. Link Media generation jobs to Job Monitor.
8. Link Publishing queue outcomes to Insights.
9. Populate or remove empty integration module/CSS files.
10. Add a simple operations status strip on Home using existing operations snapshot.

### 12.5 Top 10 Highest-Impact Improvements

1. Make AI Command a durable AI operations hub with history, artifacts, recommendations, and memory.
2. Add page AI specialist panels using one canonical team model.
3. Turn Home into a true operating home with project status, next action, AI team, active tasks, queues, jobs, notifications.
4. Make the work journey visible across pages: idea -> plan -> content -> media -> approval -> publishing -> ads -> insights.
5. Build a shared approval gate across Governance, Content, Media, Publishing, and Ads.
6. Expose ad execution package and optimization recommendations in Ads Manager.
7. Make Operations Lead own workflow/task/queue/job/notification pages.
8. Progressive-load heavy page secondary data to protect initial render.
9. Consolidate CSS and remove broad recovery rules.
10. Add route metadata as a single source of truth for group, owner, status, and AI specialist.

### 12.6 Top 10 Things To Remove Or Archive

1. Empty `public/control-center/pages/integrations/actions.js` if not populated during integration extraction.
2. Empty `public/control-center/pages/integrations/events.js` if not populated during integration extraction.
3. Empty `public/control-center/pages/integrations/index.js` if no barrel export is intended.
4. Empty `public/control-center/styles/integrations/*.css` files unless populated.
5. Page-local AI role constants after shared model lands.
6. Scoped CSS returned from JS render functions after CSS migration.
7. Dead old fallback placeholders in `app.js`.
8. Hidden `.std-*` legacy/recovery CSS if corresponding DOM is gone.
9. Duplicate route access maps in `app.js` once route metadata is centralized.
10. Generic empty-state text without a next action.

### 12.7 Top 10 Backend Powers Not Fully Visible In UI

1. AI command history.
2. AI artifacts.
3. AI recommendations.
4. AI memory.
5. Ad execution package builder.
6. Optimization recommendation generation.
7. Performance summary route.
8. Smart suggestions route.
9. Full operations snapshot as an executive OS layer.
10. Learning engine memory/confidence/source model.

### 12.8 First Safe Implementation Step After This Audit

Create a read-only canonical AI team model and page mapping without changing backend behavior:

- Add `public/control-center/ai-team-model.js`.
- Export the ten target roles, role-to-page mapping, and default prompt templates.
- Update only Home and AI Command first to read role labels/prompts from the shared model.
- Do not change command execution, automation, publishing, content, or media behavior in that commit.
- Validate with the same node syntax checks used for this audit.

This step is safe because it reduces product inconsistency without touching execution paths.


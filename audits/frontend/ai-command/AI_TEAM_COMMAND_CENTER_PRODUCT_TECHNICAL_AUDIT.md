# AI Team Command Center Product and Technical Audit

Scope: MH-OS / MH Assistant on branch `architecture/frontend-consolidation-v1`.
Status: audit only. No production files were modified.

## Executive Summary

MH-OS already has the pieces of an AI Team operating surface, but the current AI Command page is still mostly a preparation shell rather than the final specialist command center. The backend has the authoritative team model, route access rules, approvals, handoffs, AI command records, and media provider scaffolding. The frontend projects that authority, pre-fills prompts, and can safely draft work, but it does not yet present a full specialist profile, team rail, workflow draft, confirmation, or media/attachment control surface.

The critical split is clear:

- Backend owns execution, approvals, routing, and data authority.
- Frontend owns projection, prompting, explanation, drafting, and destination guidance.
- No auto-execution should be introduced in the frontend.
- Existing AI Command helpers include dead or unused UI surfaces that look like they were intended for a richer chat experience, but they are not yet wired into the active route render.

The right next product is not a generic chat page. It is a specialist operating system with solo mode and full team mode, explicit confirmation boundaries, and clearly separated guidance vs draft vs handoff vs execution.

## Current File and Path Findings

### AI Command reality today

- The AI Command route renders an overview, specialist cards, a prompt textarea, quick actions, and simple destination buttons. It does not currently render a real chat workspace, specialist profile panel, task draft panel, or authority panel. See [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js).
- The primary button reads `Prepare Command`, and the handler only prepares a local draft, mirrors the prompt into the global quick command bar, and shows status text. It does not call backend execution from the visible UI. See [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L1776).
- `submitDurableCommand()` exists and calls `executeProjectAiCommand()`, but the current route render does not wire the visible send button to that function. Search surfaced the function definition, but no active call path from the live UI. See [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L981).
- Dead or unused advanced helpers exist in the file: `renderMessageStream`, `renderResultsPanel`, `renderRecentCommands`, and `renderArtifactsPanel`. They are defined, but the live route render does not assemble them into the visible UI. See [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L1397), [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L1436), [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L1454), and [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L1495).
- The page already persists draft state locally, hydrates from shared context, and maps specialist mode metadata into prompt templates. That makes it a strong base for a richer specialist command surface without changing backend behavior first. See [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L433), [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L942), and [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js#L1678).

### Home bridge reality today

- Home is already acting as the executive entry point and project-level AI launcher. It prepares role-specific prompts and navigates to AI Command with context already prefixed into the global input. See [public/control-center/pages/home.js](../../public/control-center/pages/home.js#L982).
- The home AI team cards are role-specific and include explicit instructions such as `Do not execute anything; prepare guidance only.` This is the correct safety pattern for the frontend. See [public/control-center/pages/home.js](../../public/control-center/pages/home.js#L540).
- The Home page already has an AI guidance panel, a next best action flow, and a team status area, so the AI Command page should inherit that operating model rather than compete with it. See [public/control-center/pages/home/render-sections.js](../../public/control-center/pages/home/render-sections.js).

### Authority and routing reality today

- The authority projection helper is explicitly projection-only and states that backend owns operational authority. It forbids frontend from becoming source of truth or owning approvals/workflows. See [public/control-center/runtime/authority/authority-projection.js](../../public/control-center/runtime/authority/authority-projection.js).
- Route access is role-gated in the router and backed by route-role fallback logic. See [public/control-center/router.js](../../public/control-center/router.js).
- Shared context already carries campaign records, AI drafts, and handoffs between pages. That is the correct foundation for specialist context and handoff surfaces. See [public/control-center/shared-context.js](../../public/control-center/shared-context.js).
- The top-level app render path passes execution, task, approval, handoff, and workflow actions into route pages. That means the UI can present drafts and previews, but the backend remains the authority for actual records. See [public/control-center/app.js](../../public/control-center/app.js#L2000).

### Backend command reality today

- The backend exposes `POST /media-manager/project/:project/ai/command` and related AI command listing and artifact endpoints. See [runtime/orchestrator-service/server.js](../../runtime/orchestrator-service/server.js#L11150) and [runtime/orchestrator-service/server.js](../../runtime/orchestrator-service/server.js#L11297).
- The command orchestrator classifies intent, chooses route targets, produces AI command records, creates artifacts, recommendations, memory, tasks, approvals, and handoffs. See [runtime/orchestrator-service/lib/ops/ai-orchestrator.js](../../runtime/orchestrator-service/lib/ops/ai-orchestrator.js).
- The backend team model defines roles, route permissions, service domains, ownership, review roles, handoff paths, and escalation chains. See [runtime/orchestrator-service/lib/ops/backbone.js](../../runtime/orchestrator-service/lib/ops/backbone.js).

### Media reality today

- The frontend API exposes media prompt-improvement, brand-check, image generation, video brief generation, voice script generation, and campaign-pack generation endpoints. See [public/control-center/api.js](../../public/control-center/api.js#L2077).
- The backend contains corresponding `/api/media/*` endpoints. See [runtime/orchestrator-service/server.js](../../runtime/orchestrator-service/server.js#L21453).
- The native media stack exists, but the native image, video, audio, and voice chat runtimes are currently marked `available: false`. See [runtime/orchestrator-service/lib/media/native/native-image-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-image-runtime.js), [runtime/orchestrator-service/lib/media/native/native-video-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-video-runtime.js), [runtime/orchestrator-service/lib/media/native/native-audio-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-audio-runtime.js), and [runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js).
- The provider catalog and readiness layer exist. The OpenAI provider adapter can generate images when configured, but realtime voice is still explicitly not implemented. See [runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js](../../runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js), [runtime/orchestrator-service/lib/media/native/providers/provider-readiness.js](../../runtime/orchestrator-service/lib/media/native/providers/provider-readiness.js), [runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js](../../runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js), and [runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js](../../runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js).

## Existing Capabilities Discovered

- A concrete specialist taxonomy already exists in the backend: Strategist, Writer, Designer, Video Lead, Publisher, Ads Operator, Analyst, Compliance Reviewer, and Admin. See [runtime/orchestrator-service/lib/ops/backbone.js](../../runtime/orchestrator-service/lib/ops/backbone.js).
- The frontend AI Command page already maps to a smaller but related specialist set and has specialist-specific prompt seeds. See [public/control-center/pages/ai-command.js](../../public/control-center/pages/ai-command.js).
- Content Studio, Media Studio, Publishing, Ads Manager, Insights, Governance, and Operations Centers all have purpose-built shells that already point to the right downstream workspaces.
- Workflow catalog entries already map to AI modes and route hints. See [public/control-center/pages/workflows.js](../../public/control-center/pages/workflows.js).
- Content Studio already supports shared handoff intake and backend task/approval/handoff records. See [public/control-center/pages/content-studio-workspace.js](../../public/control-center/pages/content-studio-workspace.js).
- Media Studio already supports image, video, voice, and campaign-pack modes, plus prompt conversion, asset readiness, review, approval, and publishing handoff flows. See [public/control-center/pages/media-studio-workspace.js](../../public/control-center/pages/media-studio-workspace.js).
- Publishing and Governance both already contain explicit safety and approval logic. See [public/control-center/pages/publishing.js](../../public/control-center/pages/publishing.js) and [public/control-center/pages/governance.js](../../public/control-center/pages/governance.js).
- Operations Centers already offer task, queue, job, and notification operational views, which are the correct destination for workflow execution and escalation. See [public/control-center/pages/operations-centers.js](../../public/control-center/pages/operations-centers.js).

## Missing Capabilities

- No specialist profile header with status, permissions, tools, knowledge, and confirmation rules.
- No dedicated team rail or specialist selector that reflects the authoritative backend team model.
- No explicit solo mode versus full team mode toggle.
- No visible role-aware composer with attached context, files, media, and handoff suggestions.
- No voice input control in AI Command.
- No file attachment area in AI Command, even though other workspaces already use asset and handoff context.
- No destination panel that clearly distinguishes destination guidance from actual backend execution.
- No confirmation panel that isolates publish, approve, delete, or workflow-run actions.
- No clear separation of chat guidance, draft task, draft workflow, handoff, backend execution, and human confirmation.
- No integrated chat stream in the active AI Command render.
- No surfaced provenance or response history in the live workspace.
- No frontend media generation state that reflects actual backend readiness versus future connection.

## Per-Specialist Profile and Tools Table

| Specialist | Role purpose | Profile fields | Tools needed | Knowledge needed | Allowed actions | Forbidden actions | Destination pages | Suggested prompt seed | Confirmation requirement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Strategist | Decide campaign direction, launch sequence, and operating priorities. | Title, active role, campaign, market, readiness, risk, mission. | Next best action, campaign map, task drafts, handoff preview, insights summary. | Project overview, readiness, campaign history, blockers, integrations. | Draft strategy, propose routes, create task drafts, ask for research. | Direct publish, approval override, hidden automation, backend execution. | home, campaign-studio, workflows, insights | `Review readiness, blockers, campaign state, and next best action. Give me the highest-impact strategic moves.` | Required for any downstream execution, publish, or approval handoff. |
| Content Writer | Produce channel-native copy and content plan drafts. | Title, active role, content mode, tone, language, target channel. | Copy templates, brief builder, content variants, review request, asset picker. | Brand voice, product facts, campaign brief, source files, prior posts. | Draft copy, propose variants, prepare review handoff. | Approve own release, publish directly, fabricate claims or source truth. | content-studio, workflows, publishing | `Review the current project context and suggest the next best writing actions, messaging angles, and content priorities.` | Required before sending to media or publishing. |
| Media Director | Shape still visuals, asset readiness, and brand-safe creative direction. | Title, visual role, format, product focus, assets, brand rules. | Image brief builder, asset readiness, brand check, file picker, review queue. | Logo, product photos, brand guide, source-of-truth assets. | Draft creative briefs, review asset readiness, route to video or publishing. | Generate fake asset claims, publish without review, bypass brand safety. | media-studio, library, workflows | `Review visual and asset readiness and suggest the next best creative actions.` | Required for claim-sensitive or publish-bound output. |
| Video Lead | Turn strategy into short-form motion plans and shot-by-shot briefs. | Title, video format, hook style, duration, CTA, channel. | Shot list builder, scene planner, voiceover script, frame guidance, review queue. | Video brief, product truth, channel specs, prior creative. | Draft video plans, convert to voice script, route to review. | Auto-publish video, invent production status, bypass compliance. | media-studio, publishing, workflows | `Review the project context and suggest the next best short-form/video actions.` | Required for any publish handoff. |
| Publisher | Prepare final packaging for channel distribution and schedule execution. | Title, channel, publish date, approval state, readiness, dependencies. | Publishing package preview, schedule draft, approval status, queue preview. | Approved content, asset bundle, calendar, channel constraints. | Draft schedule, prepare publish package, request approval. | Push live without approval, skip safety gates, hide missing assets. | publishing, workflows | `Review publishing readiness, scheduled jobs, blockers, and what must be checked before publishing.` | Always required for external release. |
| Ads Optimizer | Improve paid performance, budget allocation, and ad creative direction. | Title, platform mix, budget, pacing, tracking, conversion data. | Budget planner, creative gap view, platform status, experiment drafts. | Integrations, asset coverage, analytics, campaign readiness. | Draft ad experiments, budget suggestions, channel-specific briefs. | Spend money, launch ads, or mutate accounts from the frontend. | ads-manager, campaign-studio, insights | `Review campaign readiness, channels, and paid media opportunities. Suggest next ad actions safely.` | Required before any paid launch decision. |
| SEO and Insights Analyst | Interpret search, performance, and audience data into action. | Title, active datasets, signal health, platform scope, report status. | Trend analysis, ranking view, report draft, recommendation panel, research launch. | Analytics, SEO signals, campaign performance, content history. | Draft reports, surface weak signals, suggest research tasks. | Reframe unsupported metrics as facts, auto-execute changes. | insights, research, home, workflows | `Review readiness, signals, gaps, and recent activity. Tell me what data matters most and what to improve next.` | Required when the output becomes a task, workflow, or escalation. |
| Compliance Reviewer | Guard claims, brand safety, and publish safety. | Title, risk level, policy rules, approvals, escalation path. | Claim review, publish guardrails, policy view, decision panel. | Governance policy, legal docs, brand rules, campaign claims. | Review, request changes, approve or reject within policy. | Release content without review, invent policy, override admin limits. | governance, content-studio, media-studio, publishing | `Review launch blockers, claims, approvals, and publishing safety. Tell me what must be checked before release.` | Always required for risky content, publishing, or brand safety. |
| Operations Lead | Turn intent into tasks, timelines, handoffs, and operational control. | Title, backlog, blockers, task status, workflow stage, escalation status. | Task builder, workflow draft, handoff route, queue view, confirmation panel. | Tasks, approvals, queue items, jobs, handoffs, project state. | Draft tasks, workflows, handoffs, and escalation suggestions. | Run operations automatically from the frontend or hide authority. | workflows, operations centers, governance | `Review tasks, blockers, failed jobs, and execution health. Give me the next operational steps.` | Required for workflow run, publish, approval, or escalation. |

## Individual Specialist Mode Design

A single-specialist mode should feel like a focused operating console, not a generic chat box.

### Required layout

- Specialist profile header with icon, role title, status, route access summary, and confirmation policy.
- Role status pill showing active, idle, awaiting review, blocked, or escalated.
- Main chat or command area with guidance, responses, and traceable drafts.
- Role-aware composer with prompt templates, mode-specific placeholders, and contextual chips.
- Voice input control only as a future connection if the browser or backend supports it.
- File and media attachment area for project assets, source-of-truth files, and local documents.
- Specialist tools panel for routes, actions, and quick drafts.
- Context and knowledge panel for brand, campaign, readiness, files, and previous outputs.
- Draft task and draft workflow preview area that is clearly separate from execution.
- Handoff and destination panel that shows where the work should go next.
- Safety panel showing required reviews, approval boundaries, and whether the output is guidance only.

### Specialist mode rules

- The composer can generate guidance, a draft task, a draft workflow, or a handoff preview, but it must not execute silently.
- Any action that touches publish, approve, delete, or workflow run must show a confirmation gate.
- If the backend does not support a capability, the UI must label it as guidance only or future connection.
- Role-aware suggestions should be generated from the active specialist, the project state, and the backend route model.

## Full Team Mode Design

Full team mode should present the AI specialists as an operating crew with a lead coordinator, not as individual isolated personas.

### Required layout

- Team rail with all specialists, their status, and current ownership.
- Active specialist pane showing who is leading the current work segment.
- Collaboration view showing which roles have already contributed, which are next, and which are waiting on review.
- Team mission banner summarizing the project objective and current operating priority.
- Handoff chain visualization showing the current domain path from strategist to writer or media to publisher, etc.
- Workflow stage strip showing draft, review, approval, handoff, execution, and closed states.
- Ownership matrix showing who owns strategy, copy, media, publishing, analysis, compliance, and operations supervision.
- Team recommendation panel merging signals from multiple specialists into one prioritized plan.
- Escalation flow that routes risk to Compliance Reviewer and Operations Lead, with Admin as the ultimate backend authority.

### Supervision model

- Compliance Reviewer supervises claim, brand, and publish safety.
- Operations Lead supervises task sequencing, readiness, and handoff integrity.
- Admin remains the override and policy owner.
- Frontend may recommend escalation, but backend must decide and enforce.

## Conversation to Task and Workflow Pipeline

This is the core design rule for the final system.

### Pipeline

1. Detect language.
2. Parse intent.
3. Select specialist or full team mode.
4. Bind project context, files, assets, and history.
5. Produce chat guidance or a draft artifact.
6. Optionally shape a task draft.
7. Optionally shape a workflow draft.
8. Optionally shape a handoff draft.
9. Map to a destination page.
10. Determine required context and required confirmation.
11. Only after explicit user confirmation, call backend execution or record creation.

### Output separation

- Chat guidance: explanatory, directional, no authority.
- Draft task: actionable, but not yet created.
- Draft workflow: structured sequence, but not yet run.
- Handoff: destination-bound package, but not yet consumed.
- Backend execution: only after explicit user action and permission check.
- Human confirmation: mandatory for publish, approve, delete, or workflow run.

### Good frontend behavior

- Show what the model suggests.
- Show where it wants to route work.
- Show what files or context it needs.
- Show whether the route is safe now or future connection only.
- Never imply that the frontend has authority it does not have.

## Voice, Image, Video, and Media Capability Classification

| Capability | Current status | Evidence | Classification |
| --- | --- | --- | --- |
| Browser voice input in AI Command | No frontend support found | No voice capture APIs found in the frontend search; AI Command has no microphone or speech control. | Needs UI wiring before any use. |
| Browser voice input in Media Studio | No voice capture APIs found | Media Studio supports voice mode as a prompt and output flow, not microphone capture. See [public/control-center/pages/media-studio-workspace.js](../../public/control-center/pages/media-studio-workspace.js). | Safe UI guidance now, not live capture. |
| Backend voice/audio route or API | Present as prompt/generation endpoints | `POST /api/media/generate-voice-script` exists and the API exposes `generateMediaVoiceScript()`. See [public/control-center/api.js](../../public/control-center/api.js#L2113) and [runtime/orchestrator-service/server.js](../../runtime/orchestrator-service/server.js#L21573). | Available now for guidance and draft generation; backend execution depth still limited. |
| Realtime voice chat | Not implemented | OpenAI adapter returns `not_implemented`; native voice chat runtime is `available: false`. See [runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js](../../runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js) and [runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js). | Do not claim as available. |
| Image generation | Present and partially executable when configured | OpenAI adapter can generate images if API key is present; API exposes `generateMediaImage()`. See [runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js](../../runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js) and [public/control-center/api.js](../../public/control-center/api.js#L2095). | Available now if configured; safe UI guidance still needed. |
| Native image runtime | Scaffold only | `available: false` in native image runtime. See [runtime/orchestrator-service/lib/media/native/native-image-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-image-runtime.js). | Future connection. |
| Video generation | Prompt and brief generation exist, execution is not real in native runtime | API exposes `generateMediaVideoBrief()`, Media Studio supports video mode, but native video runtime is `available: false`. See [public/control-center/api.js](../../public/control-center/api.js#L2104) and [runtime/orchestrator-service/lib/media/native/native-video-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-video-runtime.js). | Safe UI guidance now; backend wiring still needed for actual generation. |
| Voice script generation | Present as prompt/brief generation | Media Studio supports voice mode and voice script conversion, and API exposes `generateMediaVoiceScript()`. See [public/control-center/pages/media-studio-workspace.js](../../public/control-center/pages/media-studio-workspace.js) and [public/control-center/api.js](../../public/control-center/api.js#L2113). | Available now for draft generation. |
| Native audio runtime | Scaffold only | `available: false` in native audio runtime. See [runtime/orchestrator-service/lib/media/native/native-audio-runtime.js](../../runtime/orchestrator-service/lib/media/native/native-audio-runtime.js). | Future connection. |
| Provider readiness | Present | `provider-model-catalog` and `provider-readiness` exist. See [runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js](../../runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js) and [runtime/orchestrator-service/lib/media/native/providers/provider-readiness.js](../../runtime/orchestrator-service/lib/media/native/providers/provider-readiness.js). | Available now as readiness projection. |
| Provider adapters | Partially present | OpenAI adapter is registered; native GPU worker adapter is configured but not actually submitting jobs yet. See [runtime/orchestrator-service/lib/media/native/providers/adapters/provider-adapter-registry.js](../../runtime/orchestrator-service/lib/media/native/providers/adapters/provider-adapter-registry.js) and [runtime/orchestrator-service/lib/media/native/workers/external-gpu-worker-adapter.js](../../runtime/orchestrator-service/lib/media/native/workers/external-gpu-worker-adapter.js). | Backend wiring needed for anything beyond stubs. |
| Media Studio compatibility | Strong | Image, video, voice, campaign-pack modes, prompt conversion, review, approval, and publishing handoff already exist. See [public/control-center/pages/media-studio-workspace.js](../../public/control-center/pages/media-studio-workspace.js). | Safe UI guidance now. |

## Knowledge and File Attachment Layer

### What already exists

- Project overview, readiness, activity, assets, integrations, and operations snapshots are already available in frontend state and backend payloads.
- Shared context already transports AI drafts and handoffs between pages. See [public/control-center/shared-context.js](../../public/control-center/shared-context.js).
- Asset readiness and source-of-truth signals are already used in Home, Content Studio, Media Studio, and Publishing.
- Media Studio already reads asset categories, local library assets, and review state, which makes it a good source for attachment and knowledge surfaces.
- The backend AI memory store exists in the backbone model, including scopes like project, campaign, workflow, channel, audience, and content.

### How a specialist should use knowledge files

- Project profile: current project, market, language, campaign, readiness, and history.
- Brand assets: logos, brand guide, product photography, product video, packaging, and campaign assets.
- Source-of-truth files: legal, pricing, product CSV, approved brand files, and reference assets.
- Uploaded documents: project brief, governance policies, campaign briefs, research notes, and prior outputs.
- Previous outputs: AI command records, artifacts, recommendations, memory snapshots, and handoffs.
- Operations snapshots: tasks, approvals, queue, jobs, notifications, and workflow runs.
- Memory/context: only as projected by backend state, not invented by frontend.

### Specialist knowledge model for future creation

A future specialist should be defined with:

- Profile: id, label, icon, summary, purpose, status, and active project link.
- Role: canonical backend role plus frontend display role.
- Permissions: route permissions, action permissions, review permissions, and confirmation requirements.
- Tools: prompt templates, draft types, attachment types, destinations, and review actions.
- Assigned files: source-of-truth assets, brand docs, product docs, and project-specific references.
- Knowledge base: saved prompts, learned preferences, recommended handoffs, and safety notes.
- Default prompts: guidance-only prompt seed plus specialist-specific task prompt seeds.
- Destination pages: where the specialist can route the work next.
- Workflow responsibilities: what draft states the specialist can create, review, or recommend.
- Safety limits: what the specialist may never execute, bypass, or auto-trigger from the frontend.

## New Specialist Creation Model

The final system should support adding a specialist without rewriting the command center.

### Creation contract

- Define the specialist in backend team model first.
- Add the role to route access and service domain ownership.
- Add the specialist profile to the frontend selector and profile panel.
- Add prompt seeds and default guidance.
- Add allowed tools and disallowed actions.
- Add the destination pages and handoff chain.
- Add file and knowledge attachments relevant to the role.
- Add confirmation rules for publish, approval, delete, and workflow-run actions.

### Example data fields

- `id`
- `label`
- `icon`
- `purpose`
- `best_use`
- `summary`
- `routes`
- `permissions`
- `knowledge_sources`
- `attachment_types`
- `default_prompts`
- `destination_pages`
- `allowed_actions`
- `forbidden_actions`
- `confirmation_policy`
- `escalation_path`

## Final UI Architecture Proposal

### 1. Smart Header

- Project name, market, language, campaign, readiness, and execution mode.
- Global AI team status and the current operational mission.

### 2. Specialist Profile Panel

- Role icon, title, summary, active status, permissions, and current context.

### 3. Team Rail / Specialist Selector

- All specialists visible at once.
- Active specialist highlighted.
- Solo mode and full team mode toggle nearby.

### 4. Main Chat / Workspace

- Real conversation stream with message history, guidance, response cards, and route suggestions.
- No fake execution messages.

### 5. Role-Aware Composer

- Prompt text area.
- Quick prompt seeds.
- Task builder mode.
- Context-aware placeholders.

### 6. Voice Input Control

- Only if actual browser or backend voice input is available.
- Otherwise show guidance-only state.

### 7. Media / File Attachment Area

- Brand assets, source-of-truth files, uploaded docs, campaign files, and reference media.

### 8. Specialist Tools Panel

- Actions, route shortcuts, drafts, and review tools specific to the role.

### 9. Context / Knowledge Panel

- Project data, memory, previous outputs, governance notes, and readiness snapshots.

### 10. Task and Workflow Draft Panel

- Draft task, draft workflow, draft handoff, and a clear distinction from execution.

### 11. Handoff / Destination Panel

- Destination page, owner, review role, and required files.

### 12. Safety / Authority / Confirmation Panel

- What is guidance only.
- What is draft only.
- What requires confirmation.
- What is backend authority only.

### 13. Team Mode / Solo Mode Toggle

- Solo mode for one specialist.
- Team mode for multi-role orchestration and supervision.

## Safe Implementation Phases

### Phase 1

- Strengthen Home to AI Command prompt bridge.
- Add explicit specialist detection and specialist selector/profile.
- Add role-aware prompt composer.
- Add safe suggested prompts.
- Do not change backend execution behavior.

### Phase 2

- Polish the chat workspace.
- Activate message stream only if it is purely presentational and uses existing state.
- Add destination action panel.
- Add task/workflow draft preview UI.

### Phase 3

- Add explicit backend AI command execution only if the user clicks a clearly labeled action.
- Render provenance, command state, and confirmation copy.
- Keep routing and execution on the backend.

### Phase 4

- Add voice input UI only if a real browser or backend voice path is available.
- If not available, keep it guidance-only and clearly labeled future connection.

### Phase 5

- Add image/video/media tool integration surfaces.
- Surface native media provider readiness.
- Add prompt generation and asset review flow.

### Phase 6

- Add edit/create specialist profile model.
- Attach knowledge files to specialists.
- Add full team orchestration view.

## Risks and Do-Not-Touch List

- Do not fake execution.
- Do not add hidden automation.
- Do not create auto mode.
- Do not run workflows without confirmation.
- Do not publish, approve, or delete without confirmation.
- Do not let the frontend become the authority layer.
- Do not imply realtime voice, audio, or video generation if the backend adapter is stubbed or unavailable.
- Do not claim native media runtimes are available when they are explicitly marked unavailable.
- Do not bypass backend route access rules.
- Do not let guidance-only UI mutate authoritative records.

## Validation Checklist

- Confirm AI Command still loads with the current project context.
- Confirm Home can open AI Command with specialist-specific prompt context.
- Confirm specialist selector reflects backend team roles.
- Confirm frontend labels draft-only behavior clearly.
- Confirm workflow and publishing actions remain gated by explicit confirmation.
- Confirm media capability labels match backend readiness.
- Confirm no false authority is projected in the frontend.
- Confirm role access remains consistent with backend route permissions.
- Confirm shared handoff and shared draft state remain intact.

## Recommended First Implementation Pass

1. Make the AI Command page show a real specialist profile header and selector based on the existing backend team model.
2. Convert the current command composer into a role-aware draft composer with safe prompt seeds and explicit draft status.
3. Surface a visible solo/team mode toggle and a confirmation panel that distinguishes guidance from execution.
4. Wire the Home AI team cards and AI Command specialist selector to the same prompt/context contract so the bridge is consistent.
5. Keep backend execution untouched in Phase 1 and only add execution UI once the draft/workflow distinction is fully visible.

## Validation Notes

- No production files were modified during this audit.
- This document is the only file added.
- Phase 1 is safe without backend changes if it stays draft-only and guidance-only.
- Backend/API wiring is required for real execution, realtime voice, and any live media generation claims beyond current readiness scaffolding.

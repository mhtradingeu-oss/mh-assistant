# AI Team Final Readiness Truth Audit

## Executive Verdict

Final decision: **NOT READY** for the stated 100% target.

The AI Command page is no longer just a chat page. It has a credible AI Team Command Center identity, strong specialist framing, a real safety posture, a smart drawer shell, and a Library source bridge that can round-trip a selected asset back into the AI drawer. The page is already useful as an AI planning, drafting, routing, and preparation surface.

It is not yet ready as the final international MH-OS AI Business Operating System team surface. The main blockers are not syntax or basic runtime. They are product truth, information architecture, and authority boundaries:

- There are two visible tool systems: the metadata-rich Smart Tool Dock and the older compact Phase 3.5 tools panel.
- Library sources are attached visually, but the selected source payload is not reliably injected into the composer prompt or AI request context.
- Several frontend specialist identities do not match the backend role model.
- Full Team mode reads as team orchestration, but currently behaves like one coordinated chat/guidance request.
- The dormant durable AI command path can create tasks, workflow runs, approvals, handoffs, artifacts, recommendations, and memory if reconnected without strict confirmation.
- Some guide and source-return UX states can mislead users.
- Admin/Governance, Research, and Automation are not represented cleanly enough for the canonical MH-OS vision.

This is a strong foundation. It should receive a targeted medium patch before the team moves to the next page.

## Readiness Score

Overall readiness: **78 / 100**

Decision band: **NOT READY** for final page lock, but ready for focused remediation.

Score breakdown:

| Area | Score | Truth |
| --- | ---: | --- |
| Page identity | 86 | Clearly says AI Team Command Center and shows project/team/state context. |
| Specialist completeness | 74 | Core specialists exist, but Admin/Governance, Research, Automation, Sales/CRM depth, and backend role alignment are incomplete. |
| Tool metadata completeness | 88 | Rendered Smart Dock tools have required metadata, but the second tool system weakens trust. |
| Smart Tool Drawer | 80 | Strong preparation-only drawer, but source semantics and focus behavior need work. |
| Library source bridge | 72 | Happy path exists; selected source is not yet a true AI source-of-truth payload. |
| Backend power visibility | 70 | Important engines exist but are unevenly surfaced. |
| Safety and authority | 84 | Current mounted flow is mostly Projection + Experience; dormant durable command path must stay guarded. |
| International / enterprise UX | 76 | Good ambition and premium feel, but density, duplication, and mobile/accessibility risk remain. |

## What Was Inspected

Frontend files:

- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`
- `public/control-center/shared-context.js`
- `public/control-center/components/guide-box.js`
- `public/control-center/pages/library.js`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/12-pages.css`
- `public/control-center/app.js`
- `public/control-center/router.js`

Backend/reference files inspected for comparison only:

- `runtime/orchestrator-service/lib/ops/backbone.js`
- `runtime/orchestrator-service/lib/ops/ai-orchestrator.js`
- `runtime/orchestrator-service/lib/insights/learning-engine.js`
- `runtime/orchestrator-service/lib/insights/ingestion-service.js`
- `runtime/orchestrator-service/lib/media/native/README.md`
- `runtime/orchestrator-service/lib/media/native/*`
- `runtime/orchestrator-service/lib/ai/*`
- `runtime/orchestrator-service/lib/customer-operations/*`
- relevant API/server references for AI chat, guidance, command, workflow, handoff, and project endpoints

No app code, CSS, backend code, or `data/projects` files were modified during this audit.

## Page Identity and UX Clarity

What works:

- The mounted page identifies itself clearly as **AI Team Command Center** inside an **AI Operating Room** header (`ai-command.js`, around lines 3462-3463).
- The page shows project, market, language, readiness, mode, and an operating flow: Ask, Draft, Review, Route, Execute, Monitor.
- The left rail supports single specialist selection and Full Team mode.
- Specialist cards explain role, purpose, status, and safety notes.
- The central surface remains familiar as a working composer/conversation, while the right side presents output, next step, confirmation language, and compact tools.
- The page repeatedly tells the user that execution happens in destination workspaces after review/confirmation.

What is incomplete or confusing:

- Full Team mode is framed as a team command mode, but the runtime call is still a single chat request with `specialistId: "team"` and `mode: "team"`. It is not a true multi-specialist orchestration, handoff chain, or workflow.
- The page has too many overlapping concepts: Smart Tool Dock, compact tools panel, preview tabs, draft/task/workflow/handoff buttons, response actions, output routing, and destination buttons.
- The right-hand compact tools panel uses `PHASE35_SPECIALIST_TOOLS`, while the composer Smart Dock uses `TOOL_DOCK_BY_SPECIALIST`. This makes the page feel more powerful, but less truthful and harder to reason about.
- Some controls still read as feature promises rather than current behavior. Examples: Send, Schedule, Workflow, Handoff, Ticket, Lead Brief, Approval Pack.
- Disabled composer tools such as Attach, Context, and Template signal future capability but may frustrate users unless paired with a clearer "coming soon" or destination-specific setup state.
- The current state is visible, but "next best action" is split between readiness, active specialist copy, preview workspace, and tool suggestions. It needs one dominant next action.

Crowding assessment:

- Desktop: ambitious and usable, but dense.
- Tablet: high risk because the three-column operating room collapses and tool surfaces compete.
- Mobile: workable from CSS intent, but likely heavy. The specialist rail, conversation, output workspace, drawer, and Library bridge are a lot for a narrow viewport.

## Specialist Completeness Matrix

Smart Dock metadata audit found 59 rendered specialist tools across the 11 active specialists. The metadata render check found `0 missing` for required fields among rendered tools.

| Specialist id/name | Purpose | Visible tools | Action types | Output types | Source requirements | Destination/workspace targets | Safety level | Backend/system capability represented | Missing / duplicated / unclear | Readiness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: |
| `strategist` / Strategist | Campaign planning, audiences, offer, funnel, priorities. | Campaign Plan, Launch Plan, Audience Map, Offer Builder, Funnel Map, Priority List. | guided, preview. | Briefs, campaign plans, checklists, priorities. | Mostly optional; business/product context helpful. | Campaign Studio, Workflows, AI Command. | review_only. | Campaign planning, recommendations, operations planning. | Strong role. Could expose backend recommendation engine and approval gates more explicitly. | 86 |
| `writer` / Content Writer | Draft, rewrite, translate, improve, SEO, repurpose, route content. | Write, Rewrite, Translate, Improve, Check, Sources, SEO, Repurpose, Send. | guided, preview, source_required, route. | Copy, variants, SEO briefs, routed draft context. | Strong need for Library, brand, product, proof, legal/pricing sources. | Content Studio, AI Command, Library, Publishing, Task, Handoff. | review_only, context_only, confirmation_required. | Content engine, Library source use, routing to content/publishing. | "Send" sounds executable. Selected Library source is not truly embedded in generated prompt. | 84 |
| `media` / Media Director / Designer | Visual briefs, moodboards, image prompts, asset lists, layouts, brand checks. | Visual Brief, Moodboard, Image Prompt, Asset List, Layout, Brand Check. | guided, source_required. | Creative briefs, image prompts, asset lists, layout notes. | Product photos, brand assets, media files, references. | Media Studio. | review_only. | Media engine planning and native media job preparation. | Backend media native layer is mostly job-prep and adapter scaffolding; no heavy rendering guarantee should be implied. | 78 |
| `video_lead` / Video Lead | Reels/scripts/storyboards/shot lists/voiceover/CTA. | Reel Script, Storyboard, Shot List, Voiceover, Video CTA. | guided. | Scripts, storyboards, shot lists, voiceover drafts. | Product/media references helpful, not consistently required. | Media Studio. | review_only. | Video/media planning; native video runtime is not fully connected to real rendering. | Needs clearer distinction between script/storyboard prep and actual video generation. | 76 |
| `publisher` / Publisher | Publish readiness, channel packs, schedules, hashtags, approval packages. | Publish Check, Channel Pack, Schedule, Hashtags, Approval Pack. | preview, guided, source_required. | Publishing packages, schedules, checklists, approval notes. | Channel, content, claim, asset, compliance sources. | Publishing, Governance. | review_only, confirmation_required. | Publishing package preparation, governance gates. | Good safety language. Needs stronger explicit channel integration/status and destination confirmation UI. | 80 |
| `ads` / Ads Operator | Angles, ad copy, targeting, creative tests, landing-page match. | Ad Angle, Ad Copy, Targeting, Creative Test, Landing Match. | guided, source_required. | Ad copy, targeting notes, test plans, landing-page reviews. | Product, audience, landing page, performance data. | Ads Manager. | review_only. | Paid media planning and insights. | Frontend id `ads` does not match backend role id `ads_operator`. Execution capability hidden, which is correct. | 78 |
| `analyst` / Analyst / Insights | SEO, insights, keywords, performance, content gaps. | SEO Brief, Insights, Keywords, Performance, Content Gap. | guided, source_required. | Insight summaries, keyword sets, gap reports. | Analytics, ingestion, Library, performance datasets. | Insights. | review_only. | Learning engine, ingestion service, SEO/paid/commerce/social intelligence. | Backend learning/ingestion power is under-surfaced. Source requirements should distinguish analytics data from Library assets. | 82 |
| `compliance_reviewer` / Compliance Reviewer | Claims, evidence, GDPR, safer rewrites, approval notes. | Claims Check, Safe Rewrite, Evidence, GDPR, Approval Notes. | source_required, guided. | Compliance notes, safer copy, evidence lists, approval notes. | Legal/pricing, claims, proof, policy sources. | Governance. | review_only, confirmation_required. | Governance policy, approval-before-publish doctrine. | No dedicated Admin/Governance owner. Needs stricter source-required behavior before compliance output. | 83 |
| `operations` / Operations | Task plans, workflows, handoffs, timelines, checklists. | Task Plan, Workflow, Handoff, Timeline, Checklist. | guided. | Task plans, workflow drafts, handoff drafts, checklists. | Campaign, project, user/request context. | Workflows. | review_only, confirmation_required. | Operations backbone: tasks, workflows, handoffs. | Frontend role not present as backend `TEAM_ROLE_DEFS` role. Must not imply workflow execution from AI Command. | 78 |
| `customer_ops` / Customer Operations | Reply drafts, ticket preparation, SLA review, summaries. | Reply Draft, Ticket, SLA, Summary. | guided, preview. | Customer replies, ticket drafts, SLA notes, summaries. | Customer conversation, order/account context, policy sources. | Operations Centers. | review_only, confirmation_required. | Customer operations runtime exists, but not directly integrated here. | Needs explicit customer data source requirements and a real destination workspace confirmation pattern. | 69 |
| `sales_crm` / Sales / CRM | Sales pitch, follow-up, objections, lead brief. | Sales Pitch, Follow-up, Objections, Lead Brief. | guided. | Sales notes, follow-up drafts, objection handling, lead briefs. | Lead/account/product/context data. | Workflows. | review_only, confirmation_required. | Partial CRM/sales process projection; backend CRM role is not a first-class match. | Destination is too generic. CRM record creation must remain future/backend-confirmed. | 66 |
| Missing: Researcher | Research, source finding, evidence gathering, market/customer intelligence. | Not active as current specialist. Legacy references exist. | N/A. | N/A. | Research/proof/source docs. | Library, Insights, Content Studio. | Should be review_only/source_required. | Ingestion, learning, Library, market research. | Expected domain is missing from active selector. | 40 |
| Partial: Automation / Workflow specialist | Automation design, workflow templates, execution plans. | Folded into Operations and Full Team. | guided, confirmation_required. | Workflow drafts/checklists/handoffs. | Project operations context. | Workflows. | confirmation_required. | Backbone workflow runs and automation/bridge concepts. | Needs a distinct "Automation Architect" or clearer Operations submode. | 62 |
| Missing/partial: Admin / Governance | Policy, approvals, roles, system controls, audit posture. | Split across Compliance and Operations. | N/A. | N/A. | Governance/policy/integration context. | Governance, Admin, Workflows. | confirmation_required. | Backend has `admin` role and policy rules. | Expected domain missing as active specialist. | 45 |

Specialist truth:

- The 11 active specialists cover the main front-office production loop.
- The system reads like a complete AI business team, but backend identity and frontend identity are not fully harmonized.
- Missing Admin/Governance, Researcher, and Automation clarity are the biggest coverage gaps for an "international smart AI Business Operating System" claim.

## Tool Matrix Audit

What works:

- `TOOL_DOCK_BY_SPECIALIST` is defined in `tool-dock.js` around line 234.
- The rendered Smart Dock tools include the required metadata shape:
  - `id`
  - `label`
  - `description`
  - `actionType`
  - `outputTypes`
  - `sourceTypes`
  - `destinations`
  - `safetyLevel`
  - `frontendOwnerPage`
- The metadata render check found all rendered tools complete:
  - Strategist: 6 tools, 0 missing fields.
  - Writer: 9 tools, 0 missing fields.
  - Media: 6 tools, 0 missing fields.
  - Video Lead: 5 tools, 0 missing fields.
  - Publisher: 5 tools, 0 missing fields.
  - Ads: 5 tools, 0 missing fields.
  - Analyst: 5 tools, 0 missing fields.
  - Compliance Reviewer: 5 tools, 0 missing fields.
  - Operations: 5 tools, 0 missing fields.
  - Customer Operations: 4 tools, 0 missing fields.
  - Sales/CRM: 4 tools, 0 missing fields.
- Team mode renders a curated combined dock from Strategist, Writer, and Operations.
- Safety levels are conservative: review-only, context-only, or confirmation-required.
- Tools do not directly publish, send, create CRM records, or run workflows from the current drawer path.

What is incomplete:

- The metadata-rich tools are not the only tool surface. `PHASE35_SPECIALIST_TOOLS` exists in `ai-command.js` around line 394 and is rendered by `renderPhase35ToolsPanel` around line 3687.
- `PHASE35_SPECIALIST_TOOLS` is less complete and sits in the output panel, creating a second competing tool model.
- Tools do not consistently declare whether the represented backend capability is current, partial, or future.
- Source requirements are metadata, but not enforced. A source-required tool can still prepare a prompt without a real attached source.
- `frontendOwnerPage` points to the intended destination page, but that does not prove the destination has a complete confirmation and execution workflow for that tool.

Tools that may confuse users:

| Tool label/type | Risk | Recommendation |
| --- | --- | --- |
| Send | Implies message send or publishing. | Rename to "Prepare Send-Off" or "Route Draft". |
| Schedule | May imply calendar/publish scheduling. | Rename to "Draft Schedule" unless destination confirmation exists. |
| Workflow | May imply workflow execution. | Rename to "Draft Workflow". |
| Handoff | May imply durable backend handoff creation. | Rename to "Prepare Handoff". |
| Ticket | May imply ticket creation. | Rename to "Draft Ticket". |
| Lead Brief | May imply CRM update or lead record creation. | Rename to "Prepare Lead Brief". |
| Approval Pack / Approval Notes | May imply approval creation. | Keep, but state "package for Governance review". |

Tool execution truth:

- Current visible Smart Drawer path is safe because "Use in Composer" only prepares composer text.
- The right-side output route buttons store transient shared draft/handoff context and navigate to a destination workspace.
- No tool should be treated as executable until the destination workspace confirms and the backend accepts the operation.

## Smart Tool Drawer Audit

What works:

- The drawer is compact and understandable.
- It has a clear preparation-only shape: output type, source/input, destination, language, tone, source details, extra brief, safety, setup summary, and footer actions.
- It includes a safety note that says no publish/send/route/create CRM/run workflow/backend mutation happens from the drawer.
- `Open Library` / `Change Source` routes the user into Library source selection.
- `Use in Composer` inserts a prompt into the composer instead of executing work.
- Footer actions are implemented in the drawer shell and CSS has sticky/padded footer treatment.
- The drawer close path moves focus out of the drawer before applying hidden state, reducing aria-hidden focus warnings.

Problems:

- Source information is still split across:
  - selected source card,
  - source/input select,
  - Source Details field,
  - Setup Summary,
  - generated composer prompt.
- The selected Library source card is shown, but `buildDrawerPrompt` primarily uses source label/details fields. It does not reliably include the selected asset name, file path, source type, or `text_preview`.
- `Remove source` is UI-only. That is acceptable if intentional, but it does not clear the shared source cache, so a rerender/rebind can rehydrate the same source and surprise the user.
- `openToolDrawer` does not set `drawer.dataset.specialistId` or `drawer.dataset.modeId`, so drawer return context can lose specialist/mode fidelity. Tool id survives, which is enough for happy-path reopening.
- Source-required tools do not block or warn strongly enough when no Library source is selected.
- The drawer does not focus the first actionable control on open and does not trap focus. This is an accessibility gap for a modal-style drawer using `aria-modal="true"`.
- Escape-to-close was not found in the inspected drawer logic.

Runtime risk:

- `tryAutoOpenDrawerAfterLibrary(projectName)` runs on bind with `setTimeout(..., 0)`. It clears drawer return context after attempting to reopen, so it should not loop.
- If the user clicks "Back to Drawer" from Library without selecting a source, AI Command can still auto-open the drawer from return context and show a misleading "Source added to drawer" status.
- No syntax failure was found in `tool-dock.js`.

Drawer readiness: **80 / 100**

## Library Source Bridge Audit

Expected flow:

1. AI Drawer opens for a tool.
2. User clicks Open Library / Change Source.
3. AI Command stores source bridge context with `setSharedLibrarySourceBridge`.
4. AI Command stores drawer return context with `setSharedAiDrawerReturn`.
5. User lands in Library Asset Workspace.
6. Library shows a guide box and highlights `libraryAssetWorkspace`.
7. User selects an asset and clicks Use as Source in AI Command.
8. Library calls `setSharedAiSource`.
9. Library navigates back to AI Command.
10. AI Command runs `tryAutoOpenDrawerAfterLibrary`.
11. The same/related drawer opens and `applySharedAiSourceToDrawer` renders the selected source.

What works:

- `setSharedLibrarySourceBridge`, `setSharedAiDrawerReturn`, `getSharedAiDrawerReturn`, `clearSharedAiDrawerReturn`, and `applySharedAiSourceToDrawer` are wired in `tool-dock.js`.
- `tryAutoOpenDrawerAfterLibrary` exists and is called after dock binding.
- Library has `buildAiSourcePayloadFromAsset`, including `text_preview` up to 1200 characters.
- Library changes the button text to "Use as Source in AI Command".
- Library writes both project-specific and default shared AI source caches.
- Library navigates back to AI Command after source selection.
- `libraryAssetWorkspace` exists and guide placement is inline near the Asset Workspace.
- Required grep found no literal references to the known error strings:
  - `activeProjectName is not defined`
  - `escapeHtml is not defined`

Problems:

- `setSharedLibrarySourceBridge` payload does not include `drawerReturnContext`, while Library still checks for `bridgeReturn.drawerReturnContext`. The real return state currently survives through the separate `aiDrawerReturnCache`, not through the source bridge payload. This works, but the code reads like two competing contracts.
- `renderGuideBox` escapes string instructions. Library passes a string containing `<br/><small>...`, so the guide can render literal escaped markup instead of formatted text.
- The guide copy says "Use as Source in Drawer", while the Library button says "Use as Source in AI Command". The terminology should be consistent.
- The selected source rendering is visual and does not become a strong input contract for the AI prompt/request.
- Source details can be overwritten/cleared by Remove source UI, but the global shared source cache remains.
- Back/Dismiss behavior clears the bridge cache but not necessarily drawer return cache, so returning without selecting can still open the drawer.
- The "Source added" status can be shown even when no new source was selected.

Bridge readiness: **72 / 100**

## Backend Capability Visibility

| Backend/system capability | Visible in AI page? | Truth | Recommendation |
| --- | --- | --- | --- |
| Operations backbone / status models | Partially | AI page shows project readiness, specialists, workflow/handoff concepts. Backend has rich status models, policy rules, role matrix, tasks, workflow runs, approvals, handoffs, AI artifacts, recommendations, memory. | Surface only as state and destination readiness. Keep authority in backend/destination pages. |
| Backend role model | Partially | Backend `TEAM_ROLE_DEFS` includes strategist, writer, designer, video_lead, publisher, ads_operator, analyst, compliance_reviewer, admin. Frontend uses media, ads, operations, customer_ops, sales_crm and lacks admin. | Align ids or add a translation layer with explicit future roles. |
| Handoffs | Visible | AI page prepares route/handoff context and destination navigation. Backend can create durable handoffs. | Keep durable creation in destination or explicit confirmation flow. |
| Workflows | Visible | AI page drafts workflows and task plans. Backend can record workflow runs. | Do not run from AI Command. Route to Workflows with confirmation. |
| Governance / approvals | Partially | Compliance and Publisher surface approval packs and claims checks. Backend can create approvals and enforce approval-before-publish policy. | Add Admin/Governance specialist or stronger Governance destination cards. |
| Publishing packages | Partially | Publisher creates channel packs, publish checks, schedule drafts. Actual publishing is not executed here. | Correct. Make "package" language stronger and "publish" language safer. |
| Recommendation engine | Partially | The UI implies next best actions and readiness. Backend has AI recommendations and learning outputs. | Surface recommendation provenance and destination. |
| Learning engine | Partially hidden | Backend learning engine generates patterns, system lessons, and recommendations. AI page does not show this as a distinct intelligence source. | Add "using learning engine" indicators only when data exists. |
| Insights ingestion | Partially | Analyst tools imply performance/SEO/content gaps. Backend ingestion covers social, website, SEO, paid, marketplace, commerce. | Surface available/connected data sources, not generic promises. |
| Paid/media/commerce intelligence | Partially | Ads and Analyst roles cover some of it. Commerce is not clearly present. | Add source badges and commerce-specific analyst outputs when project data supports them. |
| Library source-of-truth | Visible but incomplete | Bridge exists and source card appears. Payload is not a strong AI input. | Treat selected source as structured prompt/request context. |
| CRM/sales/customer operations | Partially/future | Customer operations runtime exists. Sales/CRM frontend role exists but backend role alignment is thin. | Keep as drafts until CRM/ticket destination confirmation is real. |
| Integrations status | Partially | AI context and status strip surface integrations/coverage. | Add "connected/not connected" source-specific cues in drawer for Analyst/Ads/Publisher. |
| Automation engine | Mostly hidden | Workflow/automation concepts appear, but true automation execution is not surfaced. | Keep hidden behind Workflows/Automation destination and confirmation. |
| Native media generation | Partially/future | Media tools prepare prompts/briefs. Backend native media docs say safe foundation and adapters, not full heavy rendering. | Avoid implying direct generation/rendering in AI Command. |

Backend truth:

- The backend is more powerful than the AI page currently reveals in some areas: operations backbone, learning, ingestion, handoffs, approvals.
- The frontend is more ambitious than the backend role model in other areas: customer operations, sales/CRM, operations as specialist, ads/media naming.
- The correct product stance is to show backend power as available capability and destination intelligence, not as direct AI Command execution.

## Safety and Authority Audit

Current mounted AI Command mostly follows the doctrine:

- Frontend is Projection + Experience.
- Backend remains Authority.
- AI Command prepares prompts, drafts, previews, and route context.
- Chat call uses `executeProjectAiChat`.
- The backend chat route is labelled `chat_only_no_operational_side_effects`.
- Destination handoff uses transient shared context and navigation, not direct publish/send/workflow execution.

Positive safety evidence:

- Current Ask flow calls `executeProjectAiChat` around line 4813 with instructions that forbid task/workflow/handoff/approval/publish/customer/CRM execution.
- Preview buttons use local `setPreviewFromConversation` around lines 4933-5005.
- Route/send output path stores shared draft/handoff context around lines 5181-5182 and navigates to the destination.
- Backend `executeChat` declares `side_effects` false around lines 1452-1453.
- Backend `executeGuidance` declares `guidance_only_no_operational_side_effects` around lines 1629-1630.
- Drawer copy says no publish/send/route/create CRM/run workflow/backend mutation from the drawer.

Risks:

- `submitDurableCommand` exists in `ai-command.js` around line 2549 and calls `executeProjectAiCommand` around line 2569. This path can create durable backend records if wired.
- Backend `executeCommand` can create artifacts, recommendations, memory, tasks, workflow runs, approvals, and handoffs (`ai-orchestrator.js`, around lines 1131-1224).
- `applyDurableAiHandoff` can call `consumeProjectHandoff` on page load when a durable handoff id is present (`ai-command.js`, around line 2542). That is a backend mutation from page open behavior and should be treated carefully.
- "Guidance connected" is based on function availability, not provider/API health.
- Source-required tools can generate prompts without actual sources.
- Labels like Send, Ticket, Workflow, Handoff, Schedule, and Approval can imply execution even when current code only prepares or routes.

Authority verdict:

- Current primary user path is safe.
- Dormant or adjacent paths must remain guarded.
- Any future patch that reconnects `executeProjectAiCommand` from AI Command must add explicit confirmation, destination ownership, and backend response review before mutation.

## UX / UI / Accessibility Assessment

| Dimension | Rating | Notes |
| --- | ---: | --- |
| Clarity | 82 | The page identity is clear, but the two tool systems and many action types compete. |
| Density | 70 | Dense for a first-time user. Strong users can handle it; beginners may not. |
| Premium feel | 82 | The operating room concept feels substantial and product-grade. |
| Enterprise readiness | 74 | Good safety language and structure, but source/audit/role alignment gaps remain. |
| Beginner usability | 72 | The page needs one clearer next action and less terminology overlap. |
| Expert power | 80 | Many roles/tools/destinations are available. True execution remains outside page. |
| Mobile/responsive risk | 68 | CSS has responsive rules, but the information architecture is heavy. |
| Accessibility | 70 | Good semantic intent, but drawer focus management/trapping and Escape behavior need work. |
| Action discoverability | 76 | Many actions are discoverable; too many look similar. |
| Trust/safety language | 90 | Safety language is one of the strongest parts. |
| MH-OS vision consistency | 82 | Direction is correct, but backend capability visibility and specialist completeness need tightening. |

Accessibility notes:

- Drawer uses dialog-like semantics and `aria-hidden`; focus is moved out on close.
- Drawer should focus a predictable control on open.
- Drawer should trap focus while open or avoid claiming full modal behavior.
- Escape key close should be added.
- Button labels need more action truth: "Draft", "Prepare", "Route to workspace" instead of execution-like verbs.

Responsive notes:

- `12-pages.css` contains extensive AI Command responsive rules from around line 4729 onward.
- The layout switches from a multi-column operating room to collapsed layouts at narrower widths.
- There are multiple later override blocks and `!important` usage in the AI Command CSS region, which increases maintenance risk.
- Drawer CSS in `08-components-foundation.css` has repeated blocks for the same drawer classes, suggesting accretion.

## Missing Capabilities

Missing or incomplete product capabilities before final readiness:

- Dedicated Admin/Governance specialist.
- Dedicated Researcher specialist or explicit "Research mode" under Analyst.
- Dedicated Automation/Workflow specialist or clearer Operations/Automation split.
- Backend/frontend specialist id alignment.
- True selected-source injection into the AI prompt/request payload.
- Source-required enforcement or visible warning state.
- Clear provider/backend health indicator, not just function availability.
- One canonical tool system.
- Tool capability status: current, partial, destination-owned, future.
- Destination confirmation contracts per workspace.
- Specialist output schemas that match destination workspace needs.
- Internationalization strategy for language/tone/locale beyond prompt copy.
- Accessibility-complete drawer focus behavior.
- Mobile simplification mode.
- Source provenance display in generated output.
- Audit trail for AI-prepared routes after destination confirmation.

## Duplications / Legacy / Confusing Logic

Major duplication:

- `TOOL_DOCK_BY_SPECIALIST` in `tool-dock.js` is the better, metadata-rich tool model.
- `PHASE35_SPECIALIST_TOOLS` in `ai-command.js` is a second compact tool model.
- Both are visible in the mounted page through Smart Dock and `renderPhase35ToolsPanel`.

Legacy/dormant complexity:

- `ai-command.js` contains multiple generations of page logic:
  - `MODE_DEFS`
  - `SPECIALIST_DEFS`
  - `SPECIALIST_SUGGESTED_PROMPTS`
  - `PHASE35_SPECIALIST_TOOLS`
  - `AGENT_CARDS`
  - legacy preview/render functions
  - durable command submission helpers
- Dormant functions increase cognitive load and future regression risk.
- Some old ids remain in legacy structures, such as designer/researcher/seo concepts, while active specialists use media/analyst/customer_ops/sales_crm.

Confusing bridge contract:

- AI Command sets both source bridge context and drawer return context.
- Library looks for `bridgeReturn.drawerReturnContext`, but the current AI Command bridge payload does not include that nested field.
- The return works because drawer return context is stored separately, not because the source bridge payload carries it.

Confusing status:

- Returning from Library without selecting a source can still reopen the drawer and may say "Source added to drawer."

Confusing source semantics:

- The UI says a Library source is selected.
- The prompt generation does not strongly carry selected asset payload/details into the actual AI request.

## Must Fix Before Moving On

1. Collapse the tool experience to one canonical tool system.
   - Keep `TOOL_DOCK_BY_SPECIALIST` as the source of truth.
   - Remove or adapt the compact Phase 3.5 tools panel so it consumes the same metadata.

2. Make selected Library sources real AI context.
   - Include selected source name, type, path/id, source-of-truth flag, and `text_preview` in the generated composer prompt or structured request payload.
   - Show provenance in output setup.

3. Fix source-required behavior.
   - Source-required tools should warn, block, or strongly guide before composer preparation when no source is selected.

4. Fix Library guide rendering.
   - Do not pass HTML tags as escaped string instructions to `renderGuideBox`.
   - Use array instructions or extend the component safely.

5. Fix source return status.
   - Do not say "Source added" unless a source exists.
   - Back to Drawer without source should say "Returned to drawer. No source selected."

6. Clarify Remove source behavior.
   - Either clear the shared source cache for the project/default key or label it as "Hide source from this drawer".

7. Align specialist ids with backend role ids.
   - At minimum map `ads` -> `ads_operator`, `media` -> `designer`, and decide how operations/customer_ops/sales_crm relate to backend authority.

8. Add or explicitly defer missing domains.
   - Admin/Governance, Researcher, and Automation need either active specialists, clear aliases, or visible future-state labels.

9. Protect durable command path.
   - Keep `executeProjectAiCommand` unreachable from AI Command unless a reviewed confirmation and destination-owned mutation contract exists.

10. Replace "connected" health with real readiness.
   - Chat/guidance connected should verify provider/backend readiness or say "Interface ready" rather than "Guidance connected."

## Suggested Improvements

### A) Must fix before moving to next page

- Unify the two tool surfaces.
- Inject selected Library source payload into prompt/request context.
- Fix source-required warnings and no-source return states.
- Fix guide-box escaped markup in Library source bridge.
- Rename execution-like labels to preparation labels.
- Align frontend specialist ids with backend role model or add a mapping layer.

### B) Should fix soon

- Add dedicated Admin/Governance specialist.
- Add Researcher or make Analyst research mode explicit.
- Add Automation Architect or clarify Operations workflow/automation boundaries.
- Add source provenance chips to generated outputs.
- Add destination readiness indicators per tool.
- Add provider/API health check beyond function existence.
- Add drawer focus-on-open, focus trap, and Escape-to-close.
- Add mobile simplification for the AI room.

### C) Nice-to-have later

- Tool templates per market/language.
- Specialist memory summaries.
- Per-specialist recent artifacts.
- Team handoff timeline visualization.
- "Why this specialist?" inline hints.
- User-configurable preferred tone/language per project.
- Source confidence labels.
- Workspace-specific output preview schemas.

### D) Backend/API needed later

- Canonical specialist/role API shared by frontend and backend.
- Tool capability registry API with current/partial/future/destination-owned status.
- Source attachment API for structured AI request context.
- Destination confirmation APIs for publish/send/workflow/ticket/CRM mutations.
- Provider readiness endpoint for AI chat/guidance/media.
- Governance audit event API for AI-prepared and user-confirmed actions.
- Customer/CRM destination contracts for drafts vs records.

### E) UX copy/design improvements

- Rename "Send" to "Route Draft" or "Prepare Send-Off".
- Rename "Workflow" to "Draft Workflow".
- Rename "Handoff" to "Prepare Handoff".
- Rename "Ticket" to "Draft Ticket".
- Rename "Schedule" to "Draft Schedule".
- Use one phrase consistently: "Use as Source in AI Command" or "Use as Source in Drawer".
- Make the primary next action visually dominant.
- Reduce repeated source language in drawer sections.
- Use "Destination workspace" instead of generic "Destination" where confirmation matters.

### F) Specialist/tool additions

- Admin/Governance:
  - Policy check
  - Approval map
  - Role permissions summary
  - Audit note
  - Integration risk review
- Researcher:
  - Source brief
  - Competitor scan draft
  - Proof/evidence map
  - Market insight summary
  - Library research pack
- Automation Architect:
  - Workflow blueprint
  - Trigger map
  - Handoff chain
  - Failure path
  - Approval gate design
- Commerce/Ops analyst:
  - Product performance brief
  - Inventory/content gap
  - Offer intelligence
  - Marketplace issue summary

## Final Recommendation

Final decision: **NOT READY**.

Recommended next phase: **medium targeted patch**, not a full page redesign.

Why medium:

- The visual shell and product direction are good.
- The safety doctrine is mostly right.
- The drawer and Library bridge are close.
- The remaining problems are structural enough that a tiny patch would hide them rather than solve them.
- A full redesign is unnecessary and would waste the strong operating-room foundation already present.

Recommended patch scope:

1. Make `TOOL_DOCK_BY_SPECIALIST` the single canonical tool metadata source.
2. Rework the right-side compact tools panel to read from the same metadata or remove it.
3. Make selected Library source payload part of drawer prompt/request context.
4. Fix Library guide rendering and return-state messaging.
5. Rename unsafe labels.
6. Add missing/future specialist indicators for Admin/Governance, Researcher, and Automation.
7. Add a specialist id mapping layer for backend authority.

Top 10 blockers:

1. Dual tool systems confuse the product truth.
2. Selected Library source is visual more than semantic.
3. Source-required tools are not enforced.
4. Backend/frontend specialist ids do not fully align.
5. Full Team mode is not true team orchestration.
6. Durable command path exists and must remain guarded.
7. Guide box can render escaped HTML.
8. Return without source can produce misleading source-added status.
9. Admin/Governance, Researcher, and Automation coverage is incomplete.
10. Provider/backend health is not truly verified by the UI.

Top 10 improvements:

1. Use one canonical tool registry.
2. Add source provenance to prompts and outputs.
3. Rename action labels to preparation-safe language.
4. Add destination readiness and confirmation status.
5. Add source-required warning/blocking behavior.
6. Add missing specialists or explicit future-state roles.
7. Align frontend specialist ids with backend role definitions.
8. Improve drawer focus and keyboard handling.
9. Simplify mobile IA.
10. Surface learning/ingestion insights only when connected data exists.

Code patch recommended next: **Yes**.

Patch size recommended: **Medium targeted patch**.

## Validation Evidence

Validation commands requested and results:

```bash
git status --short
```

Result before creating this report: no app/backend/data changes were present.

```bash
git log --oneline -12
```

Result:

```text
2ff6d4b Add guided Library source selection with drawer return UX
27ea51f Close out smart drawer QA phase
43f8d64 Clean smart tool drawer UX
8fdc55d Normalize AI specialist tool metadata
36d219e Scan AI specialist tool metadata gaps
c38bbd1 Plan AI Team tooling cleanup
1447540 Plan AI specialist tool matrix
655aae9 Audit AI Team page tooling architecture
96a31ba Make smart tool drawer source ready
feded10 Polish smart tool drawer UX and fallback behavior
a54b4dd Add generic smart tool drawer shell
```

Syntax checks:

```bash
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/shared-context.js
node --check public/control-center/components/guide-box.js
node --check public/control-center/pages/library.js
node --check public/control-center/app.js
node --check public/control-center/router.js
```

Result: all passed with no syntax output.

Tool metadata grep:

```bash
grep -n "TOOL_DOCK_BY_SPECIALIST\|actionType\|outputTypes\|sourceTypes\|destinations\|safetyLevel\|frontendOwnerPage" \
  public/control-center/pages/ai-command/tool-dock.js | sed -n '1,420p'
```

Result: `TOOL_DOCK_BY_SPECIALIST` starts around line 234 and tool metadata includes `actionType`, `outputTypes`, `sourceTypes`, `destinations`, `safetyLevel`, and `frontendOwnerPage` throughout the inspected range.

Metadata render check:

```text
strategist 6 missing 0
writer 9 missing 0
media 6 missing 0
video_lead 5 missing 0
publisher 5 missing 0
ads 5 missing 0
analyst 5 missing 0
compliance_reviewer 5 missing 0
operations 5 missing 0
customer_ops 4 missing 0
sales_crm 4 missing 0
team_rendered_buttons campaign-plan, launch-plan, write, rewrite, task-plan, workflow
```

Bridge grep:

```bash
grep -n "tryAutoOpenDrawerAfterLibrary\|applySharedAiSourceToDrawer\|setSharedAiDrawerReturn\|getSharedAiDrawerReturn\|clearSharedAiDrawerReturn\|setSharedLibrarySourceBridge\|getSharedLibrarySourceBridge\|libraryAssetWorkspace\|librarySourceBridgeGuideBox" \
  public/control-center/pages/ai-command/tool-dock.js \
  public/control-center/pages/library.js \
  public/control-center/shared-context.js | sed -n '1,420p'
```

Key result:

```text
public/control-center/pages/ai-command/tool-dock.js:45:function tryAutoOpenDrawerAfterLibrary(projectName) {
public/control-center/pages/ai-command/tool-dock.js:68:    applySharedAiSourceToDrawer(activeDrawer, projectName);
public/control-center/pages/ai-command/tool-dock.js:131:  setSharedAiDrawerReturn(projectName || "__default__", payload);
public/control-center/pages/ai-command/tool-dock.js:144:export function applySharedAiSourceToDrawer(drawer, projectName = "") {
public/control-center/pages/ai-command/tool-dock.js:1485:      setSharedLibrarySourceBridge(project, payload);
public/control-center/pages/ai-command/tool-dock.js:1499:      setSharedAiDrawerReturn(project, drawerReturnContext);
public/control-center/pages/ai-command/tool-dock.js:1592:  setTimeout(() => tryAutoOpenDrawerAfterLibrary(projectName || "__default__"), 0);
public/control-center/pages/library.js:1921:        const bridgeReturn = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
public/control-center/pages/library.js:2966:        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">
public/control-center/pages/library.js:2971:          ${sourceGuideHtml ? `<div id="librarySourceBridgeGuideBox" class="library-source-guide-inline">${sourceGuideHtml}</div>` : ""}
public/control-center/shared-context.js:84:export function setSharedAiDrawerReturn(projectName, payload) {
public/control-center/shared-context.js:99:export function setSharedLibrarySourceBridge(projectName, bridge) {
```

Runtime-risk grep:

```bash
grep -n "guideBoxMount\|renderDrawerChips\|mhos-tool-drawer-chips\|activeProjectName is not defined\|escapeHtml is not defined\|tryAutoOpenDrawerAfterLibrary(projectName);" \
  public/control-center/pages/ai-command/tool-dock.js \
  public/control-center/pages/library.js \
  public/control-center/styles/08-components-foundation.css \
  public/control-center/styles/12-pages.css || true
```

Result: no output.

Data project safety check:

```bash
git status --short | grep "data/projects" || true
```

Result: no output.

Additional evidence:

- `ai-command.js` defines `PHASE35_SPECIALIST_TOOLS` around line 394 and renders `renderPhase35ToolsPanel` around line 3687.
- `ai-command.js` renders "AI Operating Room" and "AI Team Command Center" around lines 3462-3463.
- `ai-command.js` current Ask flow calls `executeProjectAiChat` around line 4813.
- `ai-command.js` dormant durable command helper calls `executeProjectAiCommand` around line 2569.
- `tool-dock.js` drawer shell starts around line 1067 and `Use in Composer` appears around line 1167.
- `library.js` builds selected source payload around line 11 and includes `text_preview`.
- `library.js` sets shared AI source around lines 1917-1918.
- `guide-box.js` escapes string instructions around lines 11-13.
- `backbone.js` defines default policy/status/team role foundations around lines 20, 46, and 108.
- `ai-orchestrator.js` durable command path can create artifacts, recommendations, memory, tasks, workflow runs, approvals, and handoffs around lines 1131-1224.
- `ai-orchestrator.js` chat/guidance routes declare no-operational-side-effect safety labels around lines 1452 and 1629.

Audit limitation:

- This was a static/code-path audit with syntax validation and targeted metadata rendering. It did not include browser screenshot QA, manual keyboard testing, or live backend provider calls.

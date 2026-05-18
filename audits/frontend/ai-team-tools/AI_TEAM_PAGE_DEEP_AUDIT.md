# AI Team Page Deep Audit

Phase: 0 - audit only
Date: 2026-05-18
Scope: AI Command / AI Team page, tool dock, smart drawer, source and workspace relationships
Baseline commit observed: `96a31ba Make smart tool drawer source ready`

## 0. Scan Log

Required commands were run before this report was written.

- `git status --short`
  - Result: clean worktree before the audit report was added.
- `git log --oneline -15`
  - Latest commits:
    - `96a31ba Make smart tool drawer source ready`
    - `feded10 Polish smart tool drawer UX and fallback behavior`
    - `a54b4dd Add generic smart tool drawer shell`
    - `373a73e Add Content Writer tool metadata`
    - `e879dd9 Plan smart specialist tool drawer framework`
    - `0f015b2 Update Content Writer dock to generic tools`
    - `114d137 Plan Content Writer tool intelligence`
    - `8118fab Show specialist-specific AI tool dock actions`
    - `6d5d203 Add AI Command tool dock prefill launcher`
    - `219cab8 Plan AI Tool Dock design system`
    - `a7a7f4a Clarify content to media design brief handoff`
    - `1ee0f09 Define content to media handoff architecture`
    - `ec57cee Add AI Team tools system blueprint`
- Relevant symbol scans were run across:
  - `public/control-center/pages/ai-command.js`
  - `public/control-center/pages/ai-command/tool-dock.js`
  - `public/control-center/pages/library.js`
  - `public/control-center/shared-context.js`
  - `public/control-center/pages/content-studio-workspace.js`
  - `public/control-center/pages/media-studio-workspace.js`
  - `public/control-center/pages/publishing.js`
  - `public/control-center/pages/governance.js`
  - `public/control-center/pages/workflows.js`
  - `public/control-center/pages/operations-centers.js`
  - `public/control-center/router.js`
  - `public/control-center/app.js`
  - `public/control-center/styles/08-components-foundation.css`
  - `public/control-center/styles/12-pages.css`
  - `audits/frontend/ai-team-tools/`

Sandbox note: the first read-only commands failed before execution with `bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted`. The same read-only scans were rerun with escalation.

## 1. Current AI Command Architecture

AI Command currently has two overlapping AI-team tool systems.

Primary route file:

- `public/control-center/pages/ai-command.js`

Tool dock module:

- `public/control-center/pages/ai-command/tool-dock.js`

Important architecture points:

- `ai-command.js:1` imports `bindAiToolDock` and `renderAiToolDock` from `./ai-command/tool-dock.js`.
- `ai-command.js:28-112` defines older `MODE_DEFS`.
- `ai-command.js:134-279` defines the visible `SPECIALIST_DEFS` used by the AI Team rail.
- `ai-command.js:281-357` defines specialist suggested prompt chips.
- `ai-command.js:394-474` defines the older `PHASE35_SPECIALIST_TOOLS` registry used by the Tools tab.
- `ai-command.js:1222-1548` maps specialists and output types into local preview objects and destination routes.
- `ai-command.js:2223-2460` normalizes inbound handoffs from other workspaces into AI Command.
- `ai-command.js:2494-2545` applies durable/shared AI inbound handoffs.
- `ai-command.js:3540-3813` renders the AI Team rail, profile, conversation header, composer, and new tool dock.
- `ai-command.js:4633-4694` binds specialist selection, team mode, suggested prompts, quick actions, and the new tool dock.
- `ai-command.js:4928-5068` binds Draft, Task, Workflow, Handoff, and the older Tools tab actions.
- `ai-command.js:5168-5292` sends generated response or local preview context to destination workspaces through shared context.

Current behavior:

- Chat sends messages to AI backends through `executeProjectAiChat`, `executeProjectAiGuidance`, or `executeProjectAiCommand` depending on flow.
- Tool dock and drawer are preparation-only and write only to the composer/session.
- The Preview actions can set shared context and navigate to destination workspaces, but do not call backend mutation APIs directly from AI Command.
- Older route tools in the Tools tab can navigate directly to workspaces such as Publishing, Workflows, Media Studio, Ads Manager, Governance, and Insights.

## 2. Current Specialist List And Selection

Visible specialist list comes from `SPECIALIST_DEFS` in `ai-command.js:134-279`.

Current specialists:

| ID | Label | Position | Primary destinations declared |
| --- | --- | --- | --- |
| `strategist` | Strategist | Executive Strategy Lead | Campaign Studio, Workflows, AI Command |
| `writer` | Content Writer | Messaging and Content Lead | Content Studio, Publishing, AI Command |
| `media` | Media Director | Creative Direction Lead | Asset Library, Content Studio, AI Command |
| `video_lead` | Video Lead | Short-Form Video Lead | Asset Library, Content Studio, Media Native |
| `publisher` | Publisher | Publishing Readiness Lead | Publishing, Workflows, AI Command |
| `ads` | Ads Optimizer | Paid Growth Lead | Ads Manager, Integrations, Campaign Studio |
| `analyst` | SEO & Insights Analyst | Search and Insights Lead | Insights, Integrations, Setup |
| `compliance_reviewer` | Compliance Reviewer | Claims and Governance Lead | Workflows, Publishing, Governance |
| `operations` | Operations Lead | Execution and Handoff Lead | Workflows, Operations Centers, AI Command |
| `customer_ops` | Customer Operations Lead | Customer Experience Operations Lead | Unified Inbox, Operations Centers, Integrations |
| `sales_crm` | Sales / CRM Lead | Revenue and CRM Operations Lead | CRM, Workflows, Operations Centers |

Selection flow:

- `renderPhase1TeamRail()` renders each specialist as `data-aicmdv2-specialist`.
- Binding at `ai-command.js:4633-4645` sets `session.modeId` to the clicked specialist id and forces `session.teamMode = "solo"`.
- Team toggle at `ai-command.js:4648-4655` sets `session.teamMode` to `solo` or `team`.
- `getPhase1SpecialistById()` at `ai-command.js:3310-3335` resolves aliases and falls back to Strategist if the requested id is unknown.
- `getAiRoomRoleId()` at `ai-command.js:3337-3341` normalizes role ids.

Selection risk:

- `MODE_ID_ALIASES` maps `research` to `researcher`, but `SPECIALIST_DEFS` does not include `researcher`.
- `AI_INBOUND_SPECIALIST_BY_SOURCE` maps `insights` and `research` to `seo`, but `SPECIALIST_DEFS` uses `analyst`; `normalizeAiInboundSpecialistId()` will fall back when it cannot resolve `seo`.

## 3. Current Tool Dock Render And Bind Flow

Tool dock file:

- `public/control-center/pages/ai-command/tool-dock.js`

Render flow:

- `TOOL_DOCK_BY_SPECIALIST` is defined at `tool-dock.js:25-524`.
- `getSpecialistTools()` at `tool-dock.js:526-528` returns specialist tools or Operations fallback.
- `getDockTools()` at `tool-dock.js:530-539` returns:
  - Team mode: first two Strategy tools, first two Writer tools, first two Operations tools.
  - Solo mode: up to nine tools for the selected specialist.
- `renderAiToolDock()` at `tool-dock.js:668-706` renders:
  - Dock header.
  - One button per tool.
  - Metadata serialized into `data-aicmd-tool-dock-*` attributes.
  - One shared `renderSmartToolDrawerShell()` after the dock.
- `renderPhase1Composer()` calls `renderAiToolDock()` at `ai-command.js:3810`.

Bind flow:

- `bindAiToolDock()` starts at `tool-dock.js:954`.
- `ai-command.js:4683-4694` calls `bindAiToolDock()` with:
  - `root: document`
  - current `session`
  - composer `input`
  - `projectName`
  - `aiContext`
  - `specialistLabel`
  - `persistSessionDraft`
  - `sessionKey`
  - `updateStatus`
- Dock button clicks at `tool-dock.js:1016-1051` read the button template and action type.
- If `actionType !== "prefill"`, `openToolDrawer()` is called.
- If the drawer cannot open or the action is `prefill`, the template is token-replaced and inserted directly into the composer.

Important implementation detail:

- All current metadata is serialized into HTML attributes, not passed as structured JS objects after render.
- This makes the drawer simple and decoupled, but it also limits richer field definitions unless metadata grows carefully.

## 4. Current Smart Drawer Render And Bind Flow

Drawer render:

- `renderSmartToolDrawerShell()` at `tool-dock.js:558-666` renders one generic drawer shell.
- Fields currently rendered:
  - Header icon/title/action owner.
  - Description.
  - Output type select plus hidden/legacy chips.
  - Source/input select plus hidden/legacy chips.
  - Destination select plus hidden/legacy chips.
  - Language select.
  - Tone select.
  - Source details input.
  - Extra brief textarea.
  - Safety text.
  - Setup summary.
  - Static safety note.
  - `Open Library`, `Use in Composer`, `Cancel`.

Drawer open:

- `openToolDrawer()` at `tool-dock.js:913-952`:
  - Stores template and tool id in drawer dataset.
  - Writes icon, title, action/owner, description, and safety.
  - Reads raw outputs/sources/destinations from button attributes.
  - Calls `populateDrawerSelect()` for each select.
  - Calls `renderDrawerChips()` for metadata chips, although CSS hides these chips.
  - Attaches `oninput`/`onchange` listeners to all drawer inputs.
  - Shows drawer and updates status.

Composer prompt:

- `buildSmartToolComposerPrompt()` at `tool-dock.js:812-872` builds a clean instruction from drawer choices.
- It includes:
  - tool title/action
  - output
  - source/input
  - destination
  - language
  - tone
  - source details
  - extra brief
  - SEO-specific rules if output looks SEO-relevant
  - destination safety rule
  - no publish/send/save/route/CRM/workflow execution safety rules
- `Use in Composer` binding at `tool-dock.js:983-1011` writes the prompt to `session.draftMessage`, `session.composerText`, and the textarea.

Open Library behavior:

- `tool-dock.js:973-981` currently updates status and sets `window.location.hash = "#library"`.
- It does not persist the selected pending tool or connect a selected Library asset back to AI Command.

Missing drawer behavior:

- No selected Library source summary.
- No shared source context.
- No Escape key close handler.
- No focus management.
- No source-specific field visibility.
- No destination-specific action behavior.

## 5. Current Tool Metadata Schema

Implemented metadata fields in `tool-dock.js`:

- `id`
- `label`
- `icon`
- `badge`
- `actionType`
- `safetyLevel`
- `frontendOwnerPage`
- `destinations`
- `sourceTypes`
- `outputTypes`
- `template`

Serialization:

- `renderAiToolDock()` writes these fields into `data-aicmd-tool-dock-*` attributes at `tool-dock.js:685-696`.
- Missing fields use fallbacks:
  - `actionType`: `guided`
  - `safetyLevel`: `review_only`
  - `frontendOwnerPage`: `ai-command`
  - `destinations`: `["chat-preview"]`
  - `sourceTypes`: `["current_chat"]`
  - `outputTypes`: `[tool.id || "tool_output"]`

Schema gap versus the planning docs:

- The docs recommend future fields such as `specialistId`, `description`, `requiredInputs`, `optionalInputs`, `assetRequirements`, `defaultTemplate`, `previewTemplate`, `routeTarget`, and `backendCapability`.
- Current code only implements the smaller runtime-safe schema above.

## 6. Current Content Writer Tools And Metadata

Content Writer is the only specialist with full tool metadata.

Current Content Writer tools:

| Tool | Action type | Safety | Owner | Destinations |
| --- | --- | --- | --- | --- |
| Write | `guided` | `review_only` | `content-studio` | chat-preview, content-studio, library, media-studio, publishing, compliance |
| Rewrite | `guided` | `review_only` | `ai-command` | composer, content-studio |
| Translate | `guided` | `review_only` | `content-studio` | composer, content-studio |
| Improve | `guided` | `review_only` | `ai-command` | composer, content-studio |
| Check | `preview` | `review_only` | `ai-command` | preview, content-studio, compliance |
| Sources | `source_required` | `context_only` | `library` | library, ai-command, content-studio |
| SEO | `guided` | `review_only` | `content-studio` | content-studio, insights, library |
| Repurpose | `guided` | `review_only` | `content-studio` | chat-preview, content-studio, publishing |
| Send | `route` | `confirmation_required` | `ai-command` | content-studio, library, media-studio, publishing, compliance, task, handoff |

Content Writer metadata exists at `tool-dock.js:70-188`.

Quality status:

- Names match the intended generic model.
- The tool/output separation is correct.
- The drawer can render every Content Writer tool from metadata.
- Prompt quality is still generic. Only SEO-like outputs receive specialized rules.
- There are no specialized prompt rules for Company Profile, Contract Draft, Product Copy, Blog Article, etc. yet.

## 7. Specialists With Metadata Versus Fallback

Full metadata:

- `writer`

Fallback metadata:

- `strategist`
- `media`
- `video_lead`
- `publisher`
- `ads`
- `analyst`
- `compliance_reviewer`
- `operations`
- `customer_ops`
- `sales_crm`
- team mode combined tools

Fallback behavior:

- These specialists define only `id`, `icon`, `label`, `badge`, and `template`.
- The drawer still works because `renderAiToolDock()` supplies fallback action, safety, owner, destinations, sources, and outputs.
- This means the drawer opens but often shows weak generic values:
  - Destination: Chat Preview.
  - Source: Current Chat.
  - Output: tool id.
  - Owner: AI Command.

Product consequence:

- The current system looks metadata-driven, but only Content Writer is truly metadata-driven.
- Other specialists need real metadata before the drawer can feel specialist-aware.

## 8. Current Drawer UX Issues

Observed issues:

- The drawer renders chip containers under selects, then CSS hides them via `.mhos-tool-drawer .mhos-tool-drawer-chips { display: none; }`.
- The drawer still has numbering in labels (`1. Output type`, `2. Source / input`, etc.), which can feel form-like rather than launcher-like.
- The action/owner line is packed into one string, for example `Guided - Content Studio`; there are no separate badges.
- There is no selected source card or selected source summary.
- `Open Library` is a placeholder navigation and does not bridge a source back.
- There is no `Source Details` auto-fill from Library.
- All fields show for all tools; source-specific or asset-specific tools do not adapt field visibility.
- The drawer does not show required versus optional fields.
- Language options are hardcoded to German, English, Arabic.
- Tone options are hardcoded and generic.
- Output-specific quality rules are mostly absent.
- No Escape key behavior was found.
- No focus trap or focus return was found.
- Drawer footer is sticky, but it may need final collision QA against any floating assistant UI.

Positive points:

- It is preparation-only.
- It has a clear safety note.
- It has no direct save, send, publish, workflow, CRM, or backend mutation button.
- It can already create a good structured composer instruction.

## 9. Current CSS Duplication Risks

Main CSS:

- `public/control-center/styles/08-components-foundation.css:841-1430`

Observed structure:

- `841-985`: Tool dock base styles and responsive behavior.
- `986-1170`: First Smart Tool Drawer block.
- `1173-1253`: Smart Tool Drawer polish pass overriding earlier drawer styles.
- `1256-1329`: Interaction controls and summary styles.
- `1324-1332`: Footer safe-area override for drawer actions.
- `1335-1369`: Source details fields.
- `1372-1388`: "reduce duplication" block.
- `1392-1422`: `.mhos-tool-drawer-local-preview` styles.
- `1425-1430`: source-ready setup overrides.

Duplication risks:

- `.mhos-tool-drawer` is defined in multiple blocks.
- `.mhos-tool-drawer-card` is defined in multiple blocks.
- `.mhos-tool-drawer-head` is defined in multiple blocks.
- `.mhos-tool-drawer-actions` is defined in at least three blocks.
- `.mhos-tool-drawer-summary span` is defined twice.
- `.mhos-tool-drawer-local-preview` CSS exists, but no matching markup was found in `tool-dock.js`.

`12-pages.css`:

- `public/control-center/styles/12-pages.css:250-305` contains Library dropdown and preview styles.
- Only related overlap found is generic `z-index: var(--layer-drawer)` for `.library-action-dropdown`; no duplicate AI drawer block was found there.

Recommendation:

- Do not add new drawer CSS until the existing drawer blocks are consolidated in a later cleanup phase.
- Phase 4 should edit existing selectors in place instead of appending another drawer block.

## 10. Current Relationship With Library

Library files:

- `public/control-center/pages/library.js`
- `public/control-center/pages/library/action-panel.js`
- `public/control-center/pages/library/ai-panel.js`

Current Library selected asset flow:

- `library.js:1504-1511` ensures `session.selectedAssetId` points to an asset in the filtered/all assets list.
- `library.js:1818-1858` renders selected asset preview metadata in `libraryPreviewMeta`.
- `library.js:1847` includes `.library-inspector-path`, which is the safest insertion anchor for a future selected-source button.
- `library.js:1865-1879` mounts `renderLibraryActionPanel()` and `renderLibraryAiPanel()`.
- `action-panel.js:1-95` renders the selected asset Actions card and includes `data-library-command="send-to-ai"`.
- `library.js:2719-2730` binds `sendToAiBtn` to build a generic classify prompt and navigate to AI Command.

Existing Library-to-AI behavior:

- Buttons such as classify, missing, extract selected doc, extract docs, and send-to-AI set `quickCommandInput` and navigate to AI Command.
- There is no shared-context source payload.
- There is no `setSharedAiSource()` function.
- There is no "Use as AI Source" action.

Potential source payload fields available from selected assets:

- `id`
- `asset_id`
- `mutation_id`
- `name`
- `filename`
- `file_path`
- `asset_type`
- `source_label`
- `source_of_truth`
- `text_preview` if present in normalized asset data

Important future anchor:

- Insert source bridge UI after the `.library-inspector-path` line and before `sendToAiBtn` binding, as requested. This is robust because the inspector path block exists in the selected asset metadata template.

## 11. Current Relationship With Content Studio

Content Studio file:

- `public/control-center/pages/content-studio-workspace.js`

Current inbound handoff:

- `content-studio-workspace.js:734-775` builds and reads inbound summaries.
- `getInboundHandoff()` checks shared/backend handoffs for:
  - `content-studio` from `workflows`
  - `content-studio` from `ai-command`
  - any `content-studio` handoff

Current composer:

- `content-studio-workspace.js:1158-1245` renders Content Composer with:
  - project/campaign/product/channel/language/tone/objective/brief/title
  - Generate Draft
  - Improve
  - Translate / Adapt
  - Save Draft
  - Send Design Brief to Media Studio
  - Send to Publishing
  - Open AI: Send Context to AI Workspace

Outbound handoffs:

- `content-studio-workspace.js:1490-1585` builds Media Studio and Publishing handoff payloads.
- `content-studio-workspace.js:1640-1765` saves to Library and sends handoffs through shared context, and may persist with `createProjectHandoff()`.
- `content-studio-workspace.js:2028-2058` sends content context to AI Command through shared context.
- `content-studio-workspace.js:2063-2122` sends to Media Studio or Publishing, then navigates.

Safety boundary:

- Content Studio owns durable save, Library save, and handoff persistence for written content.
- AI Command should prepare and route context only; actual content save/edit/approval belongs here.

## 12. Current Relationship With Media Studio

Media Studio file:

- `public/control-center/pages/media-studio-workspace.js`

Current inbound handoff:

- `media-studio-workspace.js:640-690` reads handoffs for `media-studio` from:
  - Workflows
  - AI Command
  - Content Studio
  - any media-studio handoff
- `media-studio-workspace.js:1760-1810` renders the inbound media/content brief card and "Load Content Design Brief" or "Load Media Brief".

Outbound handoffs:

- `media-studio-workspace.js:2356-2428` builds Publishing handoff payloads.
- `media-studio-workspace.js:2960-2977` sends Media context to AI Command.
- `media-studio-workspace.js:2986-2995` sends to Publishing from the main button.
- `media-studio-workspace.js:3065-3078` supports version-level save draft, send publishing, and save library.
- `media-studio-workspace.js:3137-3165` sets shared handoff to Publishing, optionally persists backend handoff, then navigates.

Safety boundary:

- Media Studio owns media jobs, media draft persistence, media review, Library save, and Publishing handoff.
- AI Command should not run media generation or image/video processing directly.

## 13. Current Relationship With Publishing

Publishing file:

- `public/control-center/pages/publishing.js`

Current inbound handoff:

- `publishing.js:789-820` extracts handoff summary.
- `getPublishingHandoff()` checks handoffs for:
  - `publishing` from `workflows`
  - `publishing` from `ai-command`
  - any `publishing` handoff
- `publishing.js:1115-1158` renders the inbound handoff panel and "Load Workflow Output".

Publishing execution:

- `publishing.js:1280-1535` handles durable scheduling, approval, pause/retry, and publish actions.
- Publish action has an explicit `window.confirm()` before `publishPublishingItem()`.
- Approval calls `approvePublishingItem()`.

Outbound to AI:

- `publishing.js:1560-1625` sends Publishing context to AI Command with `setSharedAiDraft()` and `setSharedHandoff()`.

Safety boundary:

- Publishing owns scheduling, approval, and publishing execution.
- AI Command must not expose direct publish/schedule/approve buttons.

## 14. Current Relationship With Governance

Governance file:

- `public/control-center/pages/governance.js`

Current behavior:

- Governance owns durable approval decisions and policy updates.
- `governance.js:990-1190` shows a Governance AI assistant panel with context-only copy.
- `data-governance-open-ai` only navigates to AI Command.
- `data-governance-ai-prompt` writes a prompt to quick command and navigates to AI Command.

Durable governance actions:

- Approval decisions call `decideProjectApproval()`.
- Approval requests call `createProjectApproval()`.
- Policy saves call `updateProjectGovernancePolicy()` after confirmation.

Gap:

- Governance does not currently use `setSharedHandoff()` for AI Command. It relies on prompt handoff through quick command input.

Safety boundary:

- Governance owns approvals and policy changes.
- AI Command can prepare review prompts only.

## 15. Current Relationship With Workflows / Operations

Workflows file:

- `public/control-center/pages/workflows.js`

Current handoff behavior:

- Imports `getSharedAiDraft`, `getSharedHandoff`, `setSharedAiDraft`, and `setSharedHandoff`.
- `workflows.js:930-966` applies shared workflow handoffs and may consume durable handoffs.
- `workflows.js:1039-1105` sends workflow context to AI Command, optionally persisting a handoff.

Execution behavior:

- Workflows page has real workflow run controls and automation controls.
- `registerWorkflowBridge()` at `workflows.js:1116-1210` listens for `mh:submit-workflow`.
- If `meta.autoRun` is true, it can run `runProjectAiWorkflow` or `runProjectWorkflow`.

AI Command relationship:

- Current AI Command preview and tool paths do not appear to dispatch `mh:submit-workflow`.
- AI Command creates workflow previews and shared handoffs, then navigates.

Operations Centers:

- `operations-centers.js:600-675` shows context-only AI assistant copy in Task Center.
- Copy explicitly states no approval, publishing, or backend execution is performed.
- Operations Centers are the route for task/queue/job/notification review, not AI Command.

Safety boundary:

- Workflows owns workflow runs.
- AI Command must not dispatch workflow auto-run events or set `autoRun` true.

## 16. Current Relationship With CRM / Sales

There is no dedicated CRM route in `router.js`.

Current state:

- `sales_crm` specialist exists in AI Command.
- `SPECIALIST_DEFS` says destinations are CRM, Workflows, Operations Centers.
- `destinationRouteForSpecialist()` currently routes `sales_crm` to `workflows`.
- `tool-dock.js` has Sales / CRM dock tools, but only template-only fallback metadata.
- Operations Centers mention customer/sales routing, but no CRM mutation path was found in the scanned files.

Safety boundary:

- AI Command currently does not mutate CRM records.
- Future CRM destination should be a review-only draft/handoff until an owning CRM workspace exists.

## 17. Old, Duplicated, Or Unused Logic Discovered

Potential cleanup targets:

- `tool-dock.js:1-24` defines `BASE_TOOL_DOCK_TOOLS`; scan found no usage.
- `ai-command.js` keeps both `MODE_DEFS` and `SPECIALIST_DEFS`.
  - `MODE_DEFS` is still used in older/control-room flows, intent scoring, and rendering around `ai-command.js:2746`.
  - It should not be removed casually, but it is a parallel specialist definition source.
- `ai-command.js:394-474` defines `PHASE35_SPECIALIST_TOOLS`, which remains active in the Tools tab.
  - This is a second specialist tool registry separate from `tool-dock.js`.
  - It includes route tools such as Open Publishing, Open Governance, Open Workflows, Open Ads Manager, Open Insights.
- `renderPhase35ToolsPanel()` at `ai-command.js:3687-3718` remains active at `ai-command.js:4513`.
- `tool-dock.js` and `ai-command.js` both have specialist tool concepts, labels, route logic, and safety text.
- CSS for `.mhos-tool-drawer-local-preview` exists at `08-components-foundation.css:1392-1422`, but no drawer markup uses it.
- Drawer chip rendering still exists in JS, but CSS hides chips.
- `AI_INBOUND_SPECIALIST_BY_SOURCE` maps `insights` and `research` to `seo`, while visible specialist id is `analyst`.
- `MODE_ID_ALIASES` maps `research` to `researcher`, but no visible `researcher` specialist exists.

Do not remove these in Phase 0. They need a planned cleanup phase.

## 18. Safety Risks

Current safe areas:

- The new smart drawer does not mutate backend data.
- The new smart drawer does not publish, send, save, route, create CRM records, or run workflows.
- Dock "Use in Composer" only fills local composer state.
- AI Command preview generation is local preview state.
- Shared handoff preparation from AI Command uses in-memory shared context and navigation, not backend persistence.

Risks to address:

- Older Tools tab route actions navigate directly to destination pages without a drawer/review step.
  - This is not backend mutation, but it is less consistent with the desired "review-first route action" model.
- AI Command response and preview "send" actions navigate to destination pages after setting shared context.
  - They are safe if destination pages keep confirmation gates, but the UX should label this as "prepare/open" not "send/route" unless review is explicit.
- Workflows has a bridge that can auto-run if `mh:submit-workflow` is dispatched with `meta.autoRun`.
  - AI Command must never emit that event with `autoRun`.
- Publishing and Governance have real backend mutation APIs in their own pages.
  - AI Command must not import or call those APIs.
- Library has destructive/durable actions in its own action panel.
  - A future AI source bridge must add only source selection, not archive/delete/rename/status changes.
- Content Studio and Media Studio can persist durable handoffs.
  - AI Command should pass preview context only and let these workspaces confirm durable saves.

## 19. Missing Capabilities

Major missing capabilities:

- Metadata for every specialist dock tool.
- Specialist-specific source types, destinations, output types, action types, and safety levels.
- Smart drawer selected Library source summary.
- `setSharedAiSource(projectName, source)`.
- `getSharedAiSource(projectName)`.
- `clearSharedAiSource(projectName)`.
- Library "Use as AI Source" action.
- Drawer auto-fill from selected Library source.
- Source preview truncation/summary support.
- Output-specific prompt quality rules for Content Writer beyond SEO.
- Asset-aware fields for Media Director and Video Lead.
- Compliance-specific evidence and risk fields.
- Sales / CRM safe draft fields.
- Customer Ops reply/ticket/escalation fields.
- Destination-aware safe routing actions that prepare handoffs without execution.
- A canonical single tool registry or clear separation between:
  - compact dock registry
  - advanced Tools tab registry
  - backend capability registry
- Browser QA report for the drawer and Library bridge.

## 20. Recommended Implementation Roadmap

Phase 1 - Tool model and specialist matrix:

- Create the specialist matrix document only.
- Use current scan findings to define id, role, owner workspace, tools, output types, source types, destinations, action types, safety, required fields, related pages, future backend capabilities, and review-only boundaries.

Phase 2 - Cleanup plan:

- Create the cleanup plan document only.
- Identify exact code files for later phases:
  - `tool-dock.js`
  - `shared-context.js`
  - `library.js`
  - possibly `08-components-foundation.css`
- Identify files not to touch:
  - `data/projects/*`
  - backend/API files
  - unrelated route files unless a phase explicitly needs them.

Phase 3 - Normalize tool metadata:

- Keep changes focused in `public/control-center/pages/ai-command/tool-dock.js`.
- Optionally add a small module under `public/control-center/pages/ai-command/` only if it reduces file size and improves maintainability.
- Add metadata to every specialist using the existing runtime schema:
  - `id`
  - `label`
  - `icon`
  - `badge`
  - `actionType`
  - `safetyLevel`
  - `frontendOwnerPage`
  - `destinations`
  - `sourceTypes`
  - `outputTypes`
  - `template`
- Keep fallback behavior.
- Do not touch Library or shared context yet.

Phase 4 - Finalize drawer UX:

- Edit existing drawer markup and CSS in place.
- Remove hidden chip duplication from the runtime path.
- Add selected source summary placeholder, but do not implement bridge until Phase 5.
- Improve hierarchy:
  - header badges
  - owner workspace
  - safety card
  - setup summary
  - sticky footer
- Avoid adding duplicate CSS blocks.

Phase 5 - Library Source Bridge:

- Add `setSharedAiSource`, `getSharedAiSource`, `clearSharedAiSource` to `shared-context.js`.
- Import source functions in `library.js` and `tool-dock.js`.
- In Library, add "Use as AI Source" near the selected asset inspector after `.library-inspector-path`.
- Use selected asset payload:
  - `id`
  - `asset_id`
  - `name`
  - `filename`
  - `file_path`
  - `asset_type`
  - `source_label`
  - `source_of_truth`
  - short `text_preview`
  - `selected_at`
- In AI Command drawer, read selected shared source and show a source summary.
- Auto-fill Source Details.
- Include source reference in composer prompt without huge content.

Phase 6 - Content Writer completion:

- Add professional prompt rules for:
  - Blog Article
  - Contract Draft
  - Company Profile
  - Product Copy
  - Email
  - Landing Page
  - Presentation Outline
  - Speech
  - FAQ
  - Proposal
  - Social Post
  - Ad Copy
- Keep output-specific intelligence inside `tool-dock.js` or a small dedicated module.

Phase 7 - One specialist at a time:

- Migrate Media Director, Video Lead, Publisher, Strategist, Operations Lead, Compliance Reviewer, Ads Optimizer, SEO / Insights Analyst, Customer Ops, and Sales / CRM.
- Each specialist should receive metadata, drawer field behavior, safety rules, and QA before moving to the next.

Phase 8 - Destination-aware safe routing:

- Implement review-first shared handoff drafts:
  - Send to Content Studio
  - Prepare Media Brief
  - Open Publishing Package
  - Send to Compliance Review
  - Create Workflow Draft
  - Prepare CRM Draft
- Do not execute directly.
- Owning workspace must confirm.

Phase 9 - Final cleanup and visual polish:

- Consolidate drawer CSS.
- Remove unused drawer preview CSS if still unused.
- Decide whether `BASE_TOOL_DOCK_TOOLS` should be removed.
- Decide how to reconcile `PHASE35_SPECIALIST_TOOLS` with the new metadata model.
- Fix inbound specialist alias drift (`seo` vs `analyst`, `researcher` fallback).
- Ensure all specialists look consistent and remain review-first.

## 21. Phase 0 Conclusion

The current stable baseline is safe and usable, but the system is only partially metadata-driven.

The new dock/drawer architecture is the right foundation:

- Compact tool dock is in place.
- Generic smart drawer is in place.
- Content Writer metadata is strong enough to prove the model.
- Safety copy is already explicit.
- Library remains the correct source workspace.
- Content Studio and Media Studio already have safe handoff patterns.

The main architectural issue is duplication:

- `tool-dock.js` now owns the compact dock and drawer.
- `ai-command.js` still owns an older specialist tools panel, older route tools, local preview routes, and multiple specialist definition sources.

The safest next move is not a broad rewrite. Normalize metadata in `tool-dock.js`, then improve drawer UX, then add the Library source bridge with exact anchors and shared context.

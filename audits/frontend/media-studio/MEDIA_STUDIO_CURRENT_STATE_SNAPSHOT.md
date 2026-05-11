# Media Studio Current State Snapshot

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation only (no runtime behavior change)
Primary file: public/control-center/pages/media-studio-workspace.js (3215 lines)

## No-Change Scope Confirmation

- Backend unchanged.
- data/projects unchanged.
- media-studio-workspace.js unchanged.
- api.js unchanged.
- app.js unchanged.
- No generation, approval, handoff, task, save, local draft, or session behavior changed.
- No new UI, handlers, or panel wiring added.

## File Size And Major Regions

- 1-26: imports
- 28-87: top-level constants and specialist catalog
- 90-567: helpers, normalization, local draft/library state, session/version structures
- 571-637: workspace load orchestration and backend/local merge
- 638-1229: selection/form lifecycle, prompt and payload builders, library save helpers, readiness helpers
- 1233-2388: render layer (styles, overview, generator, queue, preview, review, readiness, versioning, side panels)
- 2389-3093: event binding and action orchestration
- 3094-3124: publishing handoff send
- 3126-3215: route export and render entry

## Import Map

From ../api.js:
- brandCheckMedia
- createProjectApproval
- createProjectHandoff
- createProjectTask
- decideProjectApproval
- fetchProjectOperations
- generateMediaCampaignPack
- generateMediaImage
- generateMediaVideoBrief
- generateMediaVoiceScript
- improveMediaPrompt
- isAccessKeyFailure
- listProjectApprovals
- listProjectContentItems
- listProjectEvents
- listProjectHandoffs
- listProjectMediaJobs
- listProjectTasks
- saveProjectMediaJob

From ../asset-library.js:
- getAssetNextAction
- renderAssetDependencyRows

From ../shared-context.js:
- getSharedHandoff
- setSharedAiDraft
- setSharedHandoff

## Constants Map

Top-level state/constants:
- mediaStudioSessions: Map() in-memory session container by project key
- MEDIA_LOCAL_DRAFTS_KEY: mh-media-studio-local-drafts-v1
- MEDIA_LIBRARY_LOCAL_ASSETS_KEY: mh-media-library-assets-v1
- MEDIA_MODES: image, video, voice, campaign-pack
- MEDIA_STATUSES: draft, prompt_ready, generating, needs_review, approved, publishing_ready, sent_to_publishing, failed
- MEDIA_PREVIEW_STATES: provider_not_configured, generation_error, prompt_ready, generated, saved_to_library, needs_review, approved, publishing_ready, sent_to_publishing
- OUTPUT_PURPOSES: social post, reel, ad creative, marketplace image, email visual, website banner
- CHANNELS: instagram, facebook, tiktok, youtube, email, amazon, ebay, website
- MEDIA_ASSET_KEYS: logo, brand_guideline, product_photos, product_videos, packaging_images, social_assets, campaign_assets
- MEDIA_ROLE_DEFAULTS:
  - serviceDomain: media
  - designRole: designer
  - videoRole: video_lead
  - reviewRole: compliance_reviewer
  - handoffRole: publisher
- MEDIA_ACCESS_KEY_GUIDANCE: missing/invalid key guidance string
- SPECIALISTS: 6 local specialist cards with purpose/bestUse/suggestedPrompt

## Session And LocalStorage Map

In-memory session:
- mediaStudioSessions map keyed by normalized projectKey
- ensureSession initializes page session state:
  - loaded/loading/error
  - items/contentItems/tasks/approvals/handoffs/events/operations
  - selectedId/mode/form/formSourceId
  - generationOutputs/versioning/validation
  - draftMessage/loadedHandoffId/isCreatingNew

Persistent local storage:
- readDraftMap/writeDraftMap -> MEDIA_LOCAL_DRAFTS_KEY
- readLibraryAssetMap/writeLibraryAssetMap -> MEDIA_LIBRARY_LOCAL_ASSETS_KEY
- loadLocalDrafts/loadLocalLibraryAssets scope by projectKey
- saveLocalDraft keeps up to 30 local drafts per project
- upsertLocalLibraryAsset keeps up to 120 local library assets per project

Cross-page shared context usage:
- getSharedHandoff to import incoming work from workflows/ai/content pages
- setSharedHandoff for publishing/library/ai-command handoff payloads
- setSharedAiDraft for AI command workspace handoff

## Function Registry (Grouped)

### Normalization / Helpers
- asArray (90)
- asObject (94)
- asString (98)
- clean (103)
- titleCase (107)
- toKey (113)
- nowIso (117)
- firstText (121)
- formatDateTime (129)
- formatCount (140)
- projectKey (146)
- getProjectName (150)
- getBackendProjectName (154)
- getAssetData (158)
- normalizeStatus (162)
- statusTone (176)
- statusClass (183)
- safeJsonParse (450)
- normalizeApprovalStatus (908)
- parseStructuredList (1908)
- normalizeMediaUrl (1915)

### Session / Drafts
- readDraftMap (187)
- writeDraftMap (197)
- readLibraryAssetMap (204)
- writeLibraryAssetMap (214)
- loadLocalDrafts (226)
- loadLocalLibraryAssets (230)
- upsertLocalLibraryAsset (234)
- saveLocalDraft (253)
- defaultForm (269)
- ensureSession (460)
- resetForm (711)
- syncSessionForm (726)
- syncFormFromItem (684)
- saveDraftToSession (1129)

### Generation
- requestTypeForMode (489)
- ownerRoleForMode (495)
- buildPromptFromContext (757)
- improvePrompt (770)
- makeBrandSafe (775)
- adaptGerman (780)
- convertImagePromptToVideoBrief (785)
- convertVideoBriefToVoiceover (790)
- generateAllFormats (795)
- buildGenerationRequestPayload (857)
- buildOutputVersionFromGeneration (877)
- validateGenerator (736)

### Approvals / Handoffs / Tasks
- getInboundHandoff (647)
- extractHandoffSummary (657)
- applyInboundHandoff (676)
- buildPublishingHandoff (2315)
- sendPublishingHandoff (3094)
- persistMediaJob (2368)

API-triggering handlers live in bindMediaStudio (2389) for:
- createProjectApproval
- decideProjectApproval
- createProjectTask
- createProjectHandoff

### Library / Save Routing
- buildMediaPayload (812)
- classifyLibraryUsage (915)
- buildLibraryAssetPayload (932)
- findExistingLibrarySave (975)
- saveVersionToLibrary (989)

### Render
- renderScopedStyles (1233)
- renderStatusPill (1559)
- renderOverview (1563)
- renderRecommendation (1585)
- renderField (1623)
- renderGenerator (1648)
- renderPromptBuilder (1701)
- renderWorkflowHandoff (1726)
- renderQueue (1767)
- renderOutputReadinessPanel (1869)
- resolvePreviewMedia (1924)
- renderOutputPreviewPanel (1968)
- renderVersioningPanel (2073)
- renderReviewPanel (2175)
- renderSpecialists (2221)
- renderAssetGate (2252)
- renderApiReadiness (2269)

### Event Binding
- bindMediaStudio (2389)
- Local helper closures inside bindMediaStudio:
  - selected
  - sync
  - applyPrompt
  - generationApiForMode
  - runGenerationAction

Binding surface includes:
- form.oninput
- buttons by id (start/save/generate/improve/brand/german/convert/load/approve/reject/task/send)
- collections by data attributes ([data-media-mode], [data-media-select], [data-media-action], [data-media-version], [data-media-version-action], [data-media-specialist-*])

### Route Export
- export const mediaStudioRoute (3126)
- mediaStudioRoute.render (3140)

## Data Flow (Current)

1. load
- mediaStudioRoute.render calls ensureSession and loadMediaWorkspace when not loaded.
- loadMediaWorkspace performs Promise.allSettled on project media/jobs/tasks/approvals/handoffs/events/operations.

2. normalize
- normalizeMediaItem standardizes backend/local items.
- mergeQueueItems combines backend and local drafts.
- normalizeStatus and related helpers map status variants.

3. render
- root.innerHTML is rebuilt by render* functions composing main and side columns.

4. bind
- bindMediaStudio attaches id- and data-attribute-based handlers after each render.

5. action
- handlers mutate session/form/versioning, optionally call API functions, update drafts/handoffs, and navigate.

6. refresh
- rerender calls mediaStudioRoute.render recursively to project latest session state.

## Current UX Layout

Top:
- Media Overview metrics card
- Smart Recommendation card with quick actions

Main column:
- Media Generator
- Smart Prompt Intelligence
- Media Job Queue
- Output Preview
- Asset Preview / Brand Safety checklist
- Output Readiness State
- Versioning controls

Side column:
- Workflow Handoff
- AI Agent Support (specialists)
- Brand-Safe Assets (asset gate)
- API Readiness

## Risks And Safe Extraction Boundaries

Primary risks (current state):
- Local authority duplication for role defaults and owner mode mapping.
- Large monolith file (3215 lines) increases regression blast radius.
- High bind surface in one function increases accidental behavior drift during refactor.
- Backend optional failure handling mixed with local fallback paths, sensitive to ordering.

Safe extraction boundaries (documentation-level recommendation only):
- Pure helpers only first: string/array/object/status formatting helpers.
- Storage adapters second: draft/library local storage read/write wrappers.
- Payload builders third: buildMediaPayload/buildGenerationRequestPayload/buildPublishingHandoff.
- Keep bindMediaStudio and mediaStudioRoute.render in place until parity tests lock behavior.

Do-not-cross boundaries for now:
- No mutation of action sequencing in bindMediaStudio.
- No change to loadMediaWorkspace Promise.allSettled source list.
- No change to generation/approval/handoff/task routing calls.
- No change to local draft and session key behavior.

# PHASE 3T.16 — Media Studio CSS / Audio-Video Provider Readiness Ownership Audit

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: 5052a6b Add Integrations browser QA readiness decision

## Purpose
Audit Media Studio as the next page-specific ownership target after Settings and Integrations.

Media Studio is important because it owns or supports:
- media generation workspace
- image prompt preparation
- video brief preparation
- voice script preparation
- media provider readiness
- brand safety media checks
- generated media jobs
- future audio/video provider workflows

## Why This Exists
Phase 3T.6A confirmed audio must be split into:
1. voice script / audio direction: Media Studio + AI Command
2. audio generation provider: Media Studio + Integrations
3. realtime voice / IVR / call center: deferred future phase

Before any UI polish, we need to understand Media Studio CSS ownership and whether it can support image/video/audio provider readiness without falsely claiming IVR/call-center execution.

## Evidence Summary

### Media Studio render / route map
Media Studio is an active Control Center workspace and a large page surface.

Current scan indicates the page owns or exposes:
- media command header
- media production center
- prompt generation areas
- image/video/audio preparation flows
- media readiness summaries
- media jobs / queue concepts
- specialist cards for prompt, video, and voice direction
- generated media preview/viewer concepts
- Library/source asset relationships
- Publishing and Operations handoff readiness

The page file is large and should not receive broad UI changes without page-specific ownership planning.

### CSS ownership findings
Media Studio is best classified as:

**hybrid_css_owned / page_specific_owned**

Evidence shows class usage across:
- `media-*`
- `prompt-*`
- `asset-*`
- `video-*`
- `voice-*`
- `provider-*`

The JS class scan includes many active page classes such as:
- `media-production-center`
- `media-command-header`
- `media-generator-form`
- `media-prompt-box`
- `media-readiness-summary`
- `media-specialist-card`
- `media-specialist-grid`
- `media-queue-row`
- `media-viewer-audio`
- `media-viewer-video`
- `media-viewer-image`
- `voice-director`
- `video-strategist`
- `prompt-engineer`
- `provider-backed`

The CSS class scan includes fewer but important layout/readiness/prompt classes, including:
- `media-command-header`
- `media-production-center`
- `media-readiness-summary`
- `media-specialists-compact`
- `media-workflow-strip`
- `media-status-list`
- `prompt-card`
- `prompt-grid`
- `asset-card`

This means JS and CSS are not one-to-one. Do not remove any Media Studio selectors without browser proof.

### Media provider readiness findings
Backend/runtime evidence references:
- media directories and media manager endpoints
- media jobs
- media registry
- media upload and refresh
- `generate_media_from_prompt`
- image prompt
- video script
- scene breakdown
- media generation bridge
- provider readiness / provider_not_configured handling
- media provider layer for image/video/voice script workflows
- generated media job tracking through Operations/Job Monitor surfaces

Media Studio should present media generation as preparation/review unless provider execution is explicitly available and backend-confirmed.

### Audio / voice / IVR boundary findings
The boundary is clear and must be preserved.

Allowed:
- voice script preparation
- audio direction
- voice-over script planning
- audio/media prompt preparation
- provider readiness display

Forbidden unless a future backend/provider phase proves it:
- realtime voice calls
- IVR
- call center execution
- phone calling
- live agent voice operation
- automated customer call handling

Voice script generation is not IVR or Call Center.

### Existing audits/closeouts
Existing evidence is extensive, including:
- `audits/frontend/media-studio/MEDIA_STUDIO_API_SCHEMA.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_CURRENT_STATE_SNAPSHOT.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_FINAL_POLISH_PATCH.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_FINAL_READINESS_TRUTH_AUDIT.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_READINESS_PATCH.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_ROLE_DEFAULTS_SOURCE.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_STEP_1_OPERATING_SURFACE_AUTHORITY_AUDIT.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_STEP_2B_EXTRACTION_READINESS_AUDIT.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_STEP_2C_FORMATTER_EXTRACTION_PLAN.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_UI_UX_CONSOLIDATION_PATCH.md`
- `audits/frontend/media-studio/MEDIA_STUDIO_UI_UX_REDESIGN_PLAN.md`
- `audits/frontend/media-studio/media-studio-runtime-audit.txt`
- `audits/frontend/layout-authority/MEDIA_STUDIO_AUTHORITY_PATCH_AUDIT.md`
- `audits/frontend/ai-command/AI_COMMAND_PHASE_2_5_UX_TOOLING_VOICE_CHAT_READINESS.md`

This confirms Media Studio already has substantial prior work and should be treated carefully.

## Risk Classification

| Risk | Level | Reason |
|---|---|---|
| CSS ownership risk | High | Media Studio has many JS classes and selective CSS coverage |
| Visual regression risk | High | Large page with production center, prompt, specialist, queue, preview, and readiness areas |
| Provider claim risk | High | Media/audio/video provider availability must not be overstated |
| Audio/voice claim risk | Very High | Voice script must not be confused with IVR/call center |
| Execution authority risk | Medium | Media generation/job actions may imply backend execution or job creation |
| Cross-surface dependency risk | High | Media Studio connects to AI Command, Library, Publishing, Integrations, and Operations |

## Decision
**D) Combined small CSS/comment + readiness wording plan.**

Do not implement CSS changes yet.

Do not implement copy changes yet.

Do not redesign Media Studio now.

## Recommended Next Step
Proceed to:

**PHASE 3T.17 — Media Studio Provider Readiness + Audio Boundary Patch Plan**

Purpose:
- read existing Media Studio final readiness and API schema audits
- identify canonical Media Studio ownership
- identify readiness labels that must be preserved
- define forbidden IVR/call-center/audio claims
- prepare Browser QA checklist
- decide whether future patch should be QA-only, copy-only, CSS-comment-only, or both

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Do not claim audio generation provider is live unless evidence proves it.
- Do not claim voice script generation equals IVR/call center.
- Do not claim phone calls, realtime voice, or call center execution are live.
- Preserve Media Studio as media preparation/provider-readiness surface only.
- Preserve AI Command as active AI work surface.
- Preserve Integrations as provider readiness surface.
- Preserve Library as source/asset storage surface.
- Preserve Publishing as scheduling/publish readiness surface.
- Preserve Operations as job/task tracking surface.

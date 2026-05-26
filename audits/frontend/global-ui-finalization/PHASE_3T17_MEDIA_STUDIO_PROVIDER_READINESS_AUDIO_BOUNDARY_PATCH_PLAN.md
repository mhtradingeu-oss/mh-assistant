# PHASE 3T.17 — Media Studio Provider Readiness + Full Media Generation Boundary Plan

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: 80f1f93 Add Media Studio audio video readiness ownership audit

## Purpose
Create a safe plan for Media Studio provider-readiness, full media generation boundaries, and audio/voice wording before any production CSS or text edit.

## Why This Exists
Phase 3T.16 confirmed Media Studio is a high-risk media preparation/provider-readiness surface.

The key question is not only whether Media Studio can prepare scripts. The system must clearly communicate that Media Studio supports a full media workflow:

- image preparation / generation
- video brief / video output handling
- voice script / audio output handling
- campaign-pack / multi-format preparation
- local prompt-ready drafts
- provider-backed generation when connected
- Library save
- Publishing package preparation
- Operations/job handoff

But Media Studio must not overclaim:
- provider-backed generation is only available when backend/provider readiness exists
- provider not connected means prompt/job-ready, not final generated media
- voice script/audio direction is not IVR
- audio output is not realtime phone/call-center execution

## Evidence Summary

### Existing final readiness summary
Existing Media Studio audits confirm the page has prior readiness, UX, API, role, and polish work.

Relevant prior evidence includes:
- `MEDIA_STUDIO_FINAL_READINESS_TRUTH_AUDIT.md`
- `MEDIA_STUDIO_API_SCHEMA.md`
- `MEDIA_STUDIO_CURRENT_STATE_SNAPSHOT.md`
- `MEDIA_STUDIO_READINESS_PATCH.md`
- `MEDIA_STUDIO_FINAL_POLISH_PATCH.md`
- `MEDIA_STUDIO_UI_UX_CONSOLIDATION_PATCH.md`
- `MEDIA_STUDIO_STEP_1_OPERATING_SURFACE_AUTHORITY_AUDIT.md`
- `MEDIA_STUDIO_STEP_2B_EXTRACTION_READINESS_AUDIT.md`
- `MEDIA_STUDIO_STEP_2C_FORMATTER_EXTRACTION_PLAN.md`
- `MEDIA_STUDIO_ROLE_DEFAULTS_SOURCE.md`
- `MEDIA_STUDIO_AUTHORITY_PATCH_AUDIT.md`

This means Media Studio should not be broadly redesigned now.

### Existing API schema / backend summary
Backend/runtime evidence shows support for media manager and media generation workflows:

- media directories
- media registry
- media upload
- media jobs
- media job list/upsert/get endpoints
- media library refresh
- `generate_media_from_prompt`
- image prompt output
- video script / scene breakdown output
- media generation bridge logging
- provider status / provider_not_configured handling
- image/video/audio preview payload handling through `image_url`, `video_url`, and `audio_url`

This supports a full media workflow, but provider-backed output depends on backend/provider readiness.

### Full media generation capability summary
Media Studio is not limited to script writing.

It supports these modes and flows:

- `image`
- `video`
- `voice`
- `campaign-pack`
- local draft / prompt-ready mode
- provider-backed generation mode
- prompt improvement
- brand-safe prompt conversion
- German market adaptation
- image prompt to video brief
- video brief to voiceover script
- generate all formats
- output preview for image/video/audio
- save selected version to Library
- prepare Publishing package
- AI Command review handoff
- media job/task/Operations connection

### Local vs provider-backed boundary
Media Studio has two valid generation paths:

#### 1. Local / prompt-ready path
Used when provider/backend is not connected.

Allowed meaning:
- prompt is ready
- job is ready
- brief is ready
- package is ready for review
- can save draft
- can save to Library as metadata/reference
- can prepare handoff

Forbidden meaning:
- final media was generated
- provider rendered the asset
- audio/video/image file is live
- provider execution happened

#### 2. Provider-backed path
Used only when backend/provider readiness exists.

Allowed meaning:
- provider returned image/video/audio data or URL
- output can be previewed
- version can be reviewed
- output can be saved to Library
- package can be prepared for Publishing

Must remain evidence-based:
- do not claim provider generation succeeded unless payload contains output evidence
- do not claim image/video/audio provider is connected unless readiness says so

### CSS ownership summary
Media Studio is `hybrid_css_owned / page_specific_owned`.

Current ownership includes:
- `public/control-center/pages/media-studio-workspace.js`
- embedded or page-specific media CSS sections
- `public/control-center/styles/12-pages.css`
- shared classes such as media, prompt, asset, queue, viewer, specialist, readiness, and workflow classes

Because JS and CSS class usage are not one-to-one, no selector should be removed without browser proof.

### Media provider readiness summary
The page explicitly checks media generation readiness:

- image generation backend
- video generation backend
- voice/audio generation backend

The page also provides a fallback message:

- `Generator backend not connected yet — prompt/job is ready.`

This is correct and must be preserved.

### Audio/voice boundary summary
Allowed:
- voice script
- voiceover script
- audio direction
- audio preview if `audio_url` exists
- voice generation provider readiness
- voice/audio media job

Forbidden unless a future backend/provider phase proves it:
- IVR
- phone calls
- realtime voice
- call center execution
- automated customer calling
- live AI voice agent

Voice script generation is not IVR or Call Center.

Audio file generation, even if later provider-backed, is not the same as live phone/call-center execution.

### Cross-surface ownership summary
- Media Studio owns media preparation, media prompt/job readiness, output preview, Library save, and Publishing package preparation.
- Integrations owns provider readiness/configuration.
- AI Command owns active AI review, guidance, and assistant work.
- Library owns stored source assets and generated media references.
- Publishing owns schedule/publish readiness.
- Operations owns job/task/queue tracking.
- Governance owns approvals and authority.

## Cleanup Strategy
Use a conservative plan-first approach.

The next phase should not implement a broad redesign.

Possible future patch types:
1. QA-only if Browser QA proves wording and readiness are already clear.
2. Copy-only patch if any label overclaims generation or provider readiness.
3. CSS-comment-only ownership marker patch if ownership needs clarification.
4. Combined copy + CSS-comment patch only if both are necessary.

Do not change backend/API behavior.

Do not change route structure.

Do not remove CSS selectors.

Do not add IVR/call-center wording.

## Decision
**D) Combined small CSS/comment + readiness wording patch plan.**

No production code changes should happen in this phase.

## Recommended Next Step
Proceed to:

**PHASE 3T.18 — Media Studio Full Media Generation Browser QA / Patch Decision**

Purpose:
- verify image, video, voice, and campaign-pack UI paths
- verify provider-not-configured fallback
- verify local prompt/job-ready mode
- verify preview handling for image/video/audio outputs
- verify save to Library and prepare Publishing package remain review/handoff flows
- decide whether no patch, copy-only patch, CSS-comment-only patch, or combined patch is needed

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits in this phase.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Do not claim audio generation provider is live unless evidence proves it.
- Do not claim video/image/audio final output exists unless provider payload proves it.
- Do not claim voice script generation equals IVR/call center.
- Do not claim phone calls, realtime voice, or call center execution are live.
- Preserve local prompt/job-ready fallback.
- Preserve provider-not-configured fallback.
- Preserve Media Studio as media preparation/provider-readiness surface.

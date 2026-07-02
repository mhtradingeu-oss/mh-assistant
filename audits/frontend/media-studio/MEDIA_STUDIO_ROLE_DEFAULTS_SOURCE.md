# Media Studio Role Defaults Source

Date: 2026-05-11
Scope: Current role/default authority sources in Media Studio
Primary source: public/control-center/pages/media-studio-workspace.js

## Current Values: MEDIA_ROLE_DEFAULTS

Defined in media-studio-workspace.js top constants.

- serviceDomain: media
- designRole: designer
- videoRole: video_lead
- reviewRole: compliance_reviewer
- handoffRole: publisher

Usage surface includes:
- owner role fallback in normalizeMediaItem
- review role in media payload, approval request, and library destination role
- handoff role in publishing destination and task handoff role list
- service domain in payload/handoff/task metadata

## Current Values: SPECIALISTS

Defined in media-studio-workspace.js as a local 6-item specialist catalog.

Current IDs:
- visual-director
- video-strategist
- voice-director
- brand-guardian
- prompt-engineer
- publishing-assistant

Current purpose:
- Present specialist guidance cards.
- Inject suggestedPrompt text into local prompt form.
- Optional route to AI Command via shared context handoff.

Operational authority status:
- Presentational/editorial guidance only.
- Not used as backend authorization or policy enforcement.

## ownerRoleForMode Behavior

Function behavior:
- For mode video, returns MEDIA_ROLE_DEFAULTS.videoRole.
- For all other modes, returns MEDIA_ROLE_DEFAULTS.designRole.

Where it influences behavior:
- normalizeMediaItem owner_role fallback.
- buildMediaPayload owner_role.
- buildPublishingHandoff source_role fallback.
- createProjectTask owner/assignee fallback.

## Local Authority Duplication (Current)

Duplicated authority-like elements on frontend:
- MEDIA_ROLE_DEFAULTS (local role/source-domain defaults)
- ownerRoleForMode (mode->owner mapping)
- SPECIALISTS (local specialist taxonomy and prompt templates)

Why this is duplication:
- Doctrine target is backend-owned operational authority with frontend projection.
- Current role defaults and mapping exist locally in Media Studio, not projected from backend operations/team schema.

## Backend-Projection Migration Plan (Future, Not Applied In Step 2A)

Phase 1: Projection read model
- Introduce backend-projected role/mode policy in operations/team payload.
- Keep local constants as fallback-only while projection stabilizes.

Phase 2: Authority switch
- Switch ownerRoleForMode to projection-first lookup.
- Use backend-projected review/handoff/service roles in payload builders.

Phase 3: Local constant downgrade
- Reduce MEDIA_ROLE_DEFAULTS to emergency fallback defaults only.
- Mark fallback use in diagnostics/telemetry when projection missing.

Phase 4: Specialist source strategy
- Keep SPECIALISTS local if remaining purely UX/editorial.
- Optionally allow backend-supplied specialist recommendations as additive data.

## What Must Stay Local (Presentational Only)

Keep local in current architecture:
- Specialist card copy (title, purpose, bestUse, suggestedPrompt) for UX/editorial speed.
- Pure text transformation helpers for prompt drafting.
- Local message text and status display labels.

Constraint:
- Local presentational logic must not become source of backend policy/authorization decisions.

## What Should Move Toward Backend Projection

Target backend-projected authority fields:
- Owner role defaults by media mode.
- Review/handoff role defaults.
- Service-domain policy metadata.
- Allowed transition policy for readiness/approval states.

Reason:
- Ensures consistent authority across surfaces.
- Reduces drift between frontend assumptions and backend governance.

## Step 2A No-Change Confirmation

This artifact is documentation-only.
No runtime code, role behavior, or authority routing was changed.

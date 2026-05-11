# Media Studio API Schema

Date: 2026-05-11
Scope: API functions consumed by Media Studio page only
Source files:
- public/control-center/pages/media-studio-workspace.js
- public/control-center/api.js

## No-Change Confirmation

This document records existing API usage only.
No API signatures, endpoints, methods, payloads, or call ordering were changed.

## Shared API Runtime/Error Pattern (From api.js)

Transport helpers:
- getJson(path, fallbackMessage, timeoutMs, requestOptions)
- sendJson(path, method, body, fallbackMessage, timeoutMs)
- fetchWithTimeout(path, init, timeoutMs)
- parseJson(response, fallbackMessage, requestMeta)

Auth and diagnostics:
- Read/write headers include x-mh-control-key and Authorization when key exists.
- isAccessKeyFailure detects AccessKeyError and related auth messages/status.
- parseJson attaches __mhRequestDiagnostics on successful object payloads.

Error handling pattern used by Media Studio:
- Calls are wrapped in try/catch in load, generate, improve, brand-check, save, approval, task, and handoff flows.
- On backend failure, Media Studio falls back to local draft/handoff paths where applicable.
- On access-key failures, UI guidance message is shown and local-safe fallback is preserved.

## API Functions Used By Media Studio

| API Function | api.js Line | Method | Endpoint | Classification | Payload Purpose | Response Purpose | Media Studio Flow(s) |
|---|---:|---|---|---|---|---|---|
| listProjectMediaJobs | 2028 | GET | /media-manager/project/{project}/media-jobs | Read + Auth | Optional query filters (limit/campaign/content item) | Media job queue data | Initial workspace load (loadMediaWorkspace) |
| listProjectContentItems | 1983 | GET | /media-manager/project/{project}/content-items | Read + Auth | Optional query filters (limit/campaign) | Content item references | Initial workspace load |
| listProjectTasks | 1537 | GET | /media-manager/project/{project}/tasks | Read + Auth | Optional limit | Linked task list | Initial workspace load |
| listProjectApprovals | 1562 | GET | /media-manager/project/{project}/approvals | Read + Auth | Optional limit | Approval queue | Initial workspace load |
| listProjectHandoffs | 2131 | GET | /media-manager/project/{project}/handoffs | Read + Auth | Optional limit/source/destination/status filters | Handoff queue | Initial workspace load, library save dedupe check |
| listProjectEvents | 2192 | GET | /media-manager/project/{project}/events | Read + Auth | Optional limit | Event history | Initial workspace load |
| fetchProjectOperations | 1315 | GET | /media-manager/project/{project}/operations | Read + Auth | Project selector | Capability map for readiness | Initial workspace load, API readiness display |
| improveMediaPrompt | 2077 | POST | /api/media/improve-prompt | Write/Action + Auth | Generation context payload from form | Improved prompt | Prompt improvement action |
| brandCheckMedia | 2086 | POST | /api/media/brand-check | Write/Action + Auth | Generation context payload from form | Brand safety result | Brand-safe prompt action |
| generateMediaImage | 2095 | POST | /api/media/generate-image | Write/Action + Auth | Generation request payload | Image output result payload | Run generation (image mode) |
| generateMediaVideoBrief | 2104 | POST | /api/media/generate-video-brief | Write/Action + Auth | Generation request payload | Video brief/result payload | Run generation (video mode) |
| generateMediaVoiceScript | 2113 | POST | /api/media/generate-voice-script | Write/Action + Auth | Generation request payload | Voice script/result payload | Run generation (voice mode) |
| generateMediaCampaignPack | 2122 | POST | /api/media/generate-campaign-pack | Write/Action + Auth | Generation request payload | Multi-format campaign pack payload | Run generation (campaign-pack mode) |
| saveProjectMediaJob | 2055 | POST/PATCH | /media-manager/project/{project}/media-jobs (+/{id} for PATCH) | Write + Auth | Persist media job payload and version state | Saved/updated media job | Save draft, generation persist, status updates |
| createProjectApproval | 1549 | POST | /media-manager/project/{project}/approvals | Write + Auth | Approval request payload for media_job entity | Created approval record | Request approval action |
| decideProjectApproval | 1574 | POST | /media-manager/project/{project}/approvals/{approvalId}/decision | Write + Auth | Decision payload (approved/rejected + note + actor) | Approval decision result | Approve/reject actions when pending approval exists |
| createProjectTask | 1524 | POST | /media-manager/project/{project}/tasks | Write + Auth | Task payload linked to media_job | Created task result | Create task action |
| createProjectHandoff | 2162 | POST | /media-manager/project/{project}/handoffs | Write + Auth | Handoff payload to library/publishing | Created handoff result | Save to Library, Send to Publishing |

Additional imported helper (non-endpoint API export):
- isAccessKeyFailure (public/control-center/api.js:136): auth-related error classifier used by generation/prompt actions.

## Payload Purpose Details By Flow

Workspace load flow:
- Goal: hydrate queue, dependencies, governance context, and readiness.
- Calls: listProjectMediaJobs, listProjectContentItems, listProjectTasks, listProjectApprovals, listProjectHandoffs, listProjectEvents, fetchProjectOperations.
- Strategy: Promise.allSettled with partial availability tolerated.

Generation flow:
- Goal: submit prompt context and capture provider output.
- Payload producer: buildGenerationRequestPayload in media-studio-workspace.js.
- Calls: generateMediaImage OR generateMediaVideoBrief OR generateMediaVoiceScript OR generateMediaCampaignPack.
- Fallback: provider_not_configured and failures return to prompt_ready/local-safe state.

Prompt intelligence flow:
- improveMediaPrompt and brandCheckMedia called with same generation-context payload.
- On failure/auth issue, local prompt transform fallback is used and draft continuity preserved.

Approval/task/handoff flow:
- createProjectApproval for review request.
- decideProjectApproval for approve/reject resolution.
- createProjectTask for ownership execution.
- createProjectHandoff for downstream library/publishing routing.

Persistence flow:
- saveProjectMediaJob persists media state when backend project is available.
- Local draft persistence remains fallback path when backend is unavailable.

## Read/Write/Auth Classification Summary

- Read endpoints: listProjectMediaJobs, listProjectContentItems, listProjectTasks, listProjectApprovals, listProjectHandoffs, listProjectEvents, fetchProjectOperations.
- Write/action endpoints: improveMediaPrompt, brandCheckMedia, generateMediaImage, generateMediaVideoBrief, generateMediaVoiceScript, generateMediaCampaignPack, saveProjectMediaJob, createProjectApproval, decideProjectApproval, createProjectTask, createProjectHandoff.
- Auth model: key-in-header model via x-mh-control-key and Authorization bearer when key is present.

## Error Handling Summary

- Centralized parse/timeout/auth handling in api.js transport helpers.
- Media Studio uses try/catch around all mutating flows.
- Access-key failures are detected via isAccessKeyFailure and surfaced with MEDIA_ACCESS_KEY_GUIDANCE.
- Fail-safe behavior preserves local drafts/handoffs instead of blocking UI flow.

## No-Change Confirmation

- No endpoints added or removed.
- No method changes.
- No payload schema changes.
- No response-handling behavior changes.
- No runtime code changes performed for this documentation step.

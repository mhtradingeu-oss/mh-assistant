# AI Command Phase 2.5 — UX Polish, Team Tool Coverage, Profile Refinement, and Voice/Chat Readiness Audit

**Date:** 2026-05-15
**Branch:** architecture/frontend-consolidation-v1
**Phase:** 2.5 — UX Polish, Team Tool Coverage, Voice/Chat Readiness
**Mode:** CONTROLLED UX + AUDIT — No backend execution. No voice/chat enabled. No commit.

---

## Summary

Phase 2.5 delivers targeted visual polish to the AI Team Command Center and a thorough readiness audit of chat, voice, and media capabilities. No backend files were modified. No real voice/chat/media execution was enabled. All changes are confined to:

- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`
- `audits/frontend/ai-command/AI_COMMAND_PHASE_2_5_UX_TOOLING_VOICE_CHAT_READINESS.md` (this file)

---

## Files Changed

| File | Change Type | Summary |
|---|---|---|
| `public/control-center/styles/12-pages.css` | UI polish | Added missing `.aicmd-v2-spec-summary` rule; improved active specialist emphasis; added `.aicmd-v2-planned-chip` styles; added profile safety note style; improved preview panel typography classes |
| `public/control-center/pages/ai-command.js` | UI polish | Added safetyNote to profile panel; improved preview panel section headings; extended media/voice/chat capability panel; added planned-feature chips to composer |

---

## Browser QA Issues Addressed

### 1. Team Rail — Text Contrast (FIXED)
**Issue:** Specialist summary text appearing dark/black on dark surface.
**Root cause:** `.aicmd-v2-spec-summary` class was used in HTML template but had **no CSS rule defined**. Text inherited browser default (dark/black) instead of theme color.
**Fix:** Added `.aicmd-v2-spec-summary` with `color: var(--color-text-2)` and overflow truncation. Active state uses `rgba(34, 211, 238, 0.7)` for premium accent.

### 2. Specialist Cards — Active Emphasis (IMPROVED)
**Issue:** Active specialist not visually distinct enough.
**Fix:** Added `.aicmd-v2-spec-btn.is-active .aicmd-v2-spec-name { color: var(--color-primary); }` — active name now glows in primary color, combined with existing left border accent. Not noisy, clearly readable.

### 3. Page Identity — Header (CONFIRMED CLEAR)
**Status:** Header already correctly renders "AI Team Command Center" as `h1.aicmd-v2-title` with eyebrow "MH-OS · AI Team". No global shell change needed. Subtitle correctly reads: "Work with one specialist or your full AI team to turn ideas into guidance, tasks, workflows, content, media, and handoffs."

### 4. Profile Panel Hierarchy (IMPROVED)
**Fix:** Added `safetyNote` rendering to the specialist profile panel. It now shows the specialist's safety rule in a distinct green-tinted section with lock icon, after the destination pages row. This completes the profile hierarchy: Role → Purpose → Can Help → Cannot Do → Destinations → Safety Rule.

### 5. Preview Panel Readability (IMPROVED)
**Fixes:**
- Added `"What the specialist prepared"` heading above the output title (`.aicmd-v2-preview-what-heading` — primary color, uppercase, compact)
- Renamed "Next safe action" → **"What you can do next"** with bolder typography (`.aicmd-v2-preview-next-action`)
- Renamed "Confirmation note" → **"What requires confirmation"** with amber color (`.aicmd-v2-preview-confirmation`) to clearly signal attention
- Safety label retained in green (`.aicmd-v2-preview-safety`)

### 6. Planned Feature Chips in Composer (ADDED)
Added a small `aicmd-v2-planned-row` below the composer hint with honest capability chips:
- ✅ "Read preview available (browser)" — `is-available` style (green)
- "Voice input — planned" — greyed, italic
- "Team chat — requires execution bridge" — greyed, italic
- "Media generation — requires provider/worker" — greyed, italic

---

## Team Rail Polish Notes

| Element | Before | After |
|---|---|---|
| Specialist summary text | No CSS rule → dark/black text | `var(--color-text-2)` muted, truncated with ellipsis |
| Active specialist name | Same white as inactive | `var(--color-primary)` cyan accent |
| Active specialist summary | Same muted as inactive | `rgba(34, 211, 238, 0.7)` subtle cyan |
| Active specialist left border | `3px solid primary` | Unchanged — kept as premium accent |
| Active background | `rgba(34,211,238,0.10)` | Unchanged — subtle, not noisy |

---

## Header / Profile / Preview Polish Notes

### Header
- Eyebrow: `MH-OS · AI Team` — correct, no change needed
- Title: `AI Team Command Center` — correct, premium identity
- Subtitle: Full description present — no change needed
- Meta chips: Project / Specialist / Mode / Status — confirmed readable

### Profile Panel (new safetyNote section)
Each specialist profile now renders a complete hierarchy:
1. Icon + Role name (large, bold)
2. Short purpose (muted, compact)
3. Can help with (→ arrows, green)
4. Cannot do (✗ marks, red)
5. Destination pages (cyan chips)
6. 🔒 Safety rule (green, separated by border)

### Preview Panel (re-labelled sections)
- "What the specialist prepared" — primary color heading
- Output title + summary — unchanged content
- Preview content (bullets) — unchanged
- Suggested steps (ordered list) — unchanged
- "What you can do next" — bold white, clear intent
- "What requires confirmation" — amber warning color
- Safety label — green confirmation

---

## Per-Specialist Tool Coverage

| Specialist | Suggested Prompts | Output Template | Destination | Task/Workflow/Handoff | Media/Voice | Missing |
|---|---|---|---|---|---|---|
| **Strategist** | ✅ 4 prompts | ✅ Campaign brief, priority plan | Campaign Studio, Workflows | ✅ All three | Guidance only | Live market data pull |
| **Content Writer** | ✅ 4 prompts | ✅ Hooks, captions, CTA | Content Studio, Publishing | ✅ Task + Handoff | Voice script: draft-ready | AI copywriting provider wiring |
| **Media Director** | ✅ 4 prompts | ✅ Creative brief, brand direction | Asset Library, Content Studio | ✅ Brief + Handoff | Image prompt: draft-ready | Image generation provider |
| **Video Lead** | ✅ 4 prompts | ✅ Script, storyboard, motion brief | Asset Library, Media Native | ✅ Task + Brief | Video brief: draft-ready; generation: needs GPU worker | GPU worker + video generation provider |
| **Publisher** | ✅ 4 prompts | ✅ Readiness checklist, handoff package | Publishing, Workflows | ✅ Handoff (confirmation required) | N/A | Live publishing queue read |
| **Ads Optimizer** | ✅ 4 prompts | ✅ Ad angles, platform copy, test plan | Ads Manager, Integrations | ✅ Task + Draft | N/A | Platform ad API read |
| **SEO & Insights Analyst** | ✅ 4 prompts | ✅ Signal review, analysis plan | Insights, Integrations | ✅ Task + Guidance | N/A | Live Search Console / GA4 read |
| **Compliance Reviewer** | ✅ 4 prompts | ✅ Risk checklist, governance notes | Workflows, Governance | ✅ Handoff (confirmation required) | N/A | Formal approval authority |
| **Operations Lead** | ✅ 4 prompts | ✅ Task plan, workflow sequence, handoff | Workflows, Task Center | ✅ All three | N/A | Live workflow run trigger |

**Coverage summary:** All 9 specialists have 4 suggested prompts, a specialist-specific output template, a defined destination page, and clear task/workflow/handoff suitability. No specialist is blank or generic.

---

## Chat Readiness Classification

| Capability | Classification | Notes |
|---|---|---|
| Structured prompt/response loop | **Available now** | Works via Prepare Guidance, Draft Task, Draft Workflow, Prepare Handoff |
| Session message history | **Available now** | `session.messages` kept in memory per project session |
| Draft persistence (local) | **Available now** | `localStorage` keyed by project |
| Prefill suggested prompts | **Available now** | Click-to-fill, send manually |
| Copy / Use in composer / Send to destination | **Available now** | All 6 preview actions functional |
| Persistent multi-turn backend chat | **Needs backend/API wiring** | `executeProjectAiCommand` exists; chat accumulation requires backend session |
| Team chat (multiple specialists in one thread) | **Do not implement yet** | Needs execution bridge + backend orchestration |
| Real-time streaming chat | **Do not implement yet** | No SSE/WebSocket from AI provider wired to frontend |

---

## Voice Readiness Classification

| Capability | Classification | Notes |
|---|---|---|
| Read preview aloud (browser SpeechSynthesis) | **Available now** | `previewReadBtn` uses `speechSynthesis` safely; button disabled if API absent |
| Voice script draft (text only) | **Available now (draft)** | Specialist output template produces script text; no audio generated |
| Voice input (SpeechRecognition) | **Safe UI guidance now** | Can add a disabled/planned chip; do not wire microphone without permission flow |
| Backend audio generation (ElevenLabs etc.) | **Needs backend/API/provider wiring** | Would require a `/native-media/generate` call with `media_type: "audio"` and configured provider |
| Realtime voice chat | **Do not implement yet** | Requires WebRTC or WebSocket + AI voice provider + permission flow |
| Native voice runtime | **Do not implement yet** | GPU worker + audio provider + backend routing all required |

---

## Media Readiness Classification

| Capability | Classification | Notes |
|---|---|---|
| Image prompt text (draft) | **Available now (draft)** | Media Director output template generates prompt text |
| Image generation (provider) | **Needs backend/API/provider wiring** | Requires provider configured in integrations (OpenAI, Stability, Replicate) |
| Video brief / script (draft) | **Available now (draft)** | Video Lead template produces script + storyboard text |
| Video generation | **Needs backend/API/provider wiring** | Requires GPU worker and video provider (Runway etc.) |
| Voice script (draft text) | **Available now (draft)** | Writer/Video Lead templates produce script text |
| Voice audio generation | **Needs backend/API/provider wiring** | Requires ElevenLabs or similar |
| Provider readiness check | **Safe UI guidance now** | `isProviderLikelyConfigured()` inspects integration records; shown in capability panel |
| GPU worker dependency | **Do not implement yet** | Native media worker must be connected and healthy before any generation |

---

## What Remains Disabled / Planned

The following features are intentionally **not enabled** in Phase 2.5:

- Real microphone input (SpeechRecognition)
- Real audio/voice output beyond browser TTS
- Image/video generation execution
- Multi-turn backend chat sessions
- Team multi-specialist chat orchestration
- Live ad platform reads
- Live Search Console / GA4 reads from the AI Command composer
- Workflow auto-execution from AI Command

All of these are represented with honest "planned" or "requires connection" labels in the UI.

---

## What Must Wait for Phase 3

| Feature | Phase 3 Requirement |
|---|---|
| Backend AI chat session persistence | Persistent session store in orchestrator; `/ai-command/session` endpoint |
| SpeechRecognition voice input | Permission flow + UI feedback + transcript → composer bridge |
| Media generation execution | Provider configuration check + `native-media/generate` call from AI Command |
| Team chat execution bridge | Backend multi-agent orchestration + response aggregation |
| Realtime streaming responses | SSE or WebSocket from AI provider through orchestrator |
| Formal approval authority | Governance gate integration with human sign-off flow |

---

## Safety Confirmations

- ✅ No backend execution was enabled
- ✅ No real voice chat or microphone was enabled
- ✅ No `SpeechRecognition` was wired
- ✅ No media generation was executed
- ✅ No publishing, approval, delete, archive, sync, or backend mutation
- ✅ No fake execution buttons added (all unready features show "planned" or disabled state)
- ✅ No backend/runtime/data files modified
- ✅ `executeProjectAiCommand` not called from any new code path
- ✅ `submitDurableCommand` not called from any new code path
- ✅ All draft outputs remain local until explicit user action

---

## Validation Results

```
node --check public/control-center/pages/ai-command.js  → OK
node --check public/control-center/app.js               → OK
node --check public/control-center/router.js            → OK
```

CSS check (no unexpected `!important` in modified area):
```
grep -n '!important' public/control-center/styles/12-pages.css
→ (existing !important rules only; none added in Phase 2.5)
```

Files changed:
```
M public/control-center/pages/ai-command.js
M public/control-center/styles/12-pages.css
A audits/frontend/ai-command/AI_COMMAND_PHASE_2_5_UX_TOOLING_VOICE_CHAT_READINESS.md
```

---

## Recommended Phase 3 Plan

### P3.1 — Backend AI Chat Session
- Add `/ai-command/session` endpoint to orchestrator
- Persist multi-turn messages server-side
- Return streaming response via SSE or batched JSON

### P3.2 — Voice Input (SpeechRecognition)
- Add disabled "Voice input" button to composer with permission prompt on click
- Wire `SpeechRecognition` transcript → composer input field
- Provide clear microphone-off / on state

### P3.3 — Media Generation from AI Command
- Allow Media Director and Video Lead to trigger image/video briefs through native media route
- Gate behind provider readiness check (`isProviderLikelyConfigured`)
- Show GPU worker health before any generation attempt

### P3.4 — Team Chat Orchestration
- Design multi-agent response aggregation
- Route each specialist response to a shared session thread
- Display attribution per specialist contribution

### P3.5 — Governance Gate Integration
- Wire Compliance Reviewer handoff to formal approval queue
- Publisher handoff to publishing approval gate
- Show clear "pending approval" status in UI

---

*Phase 2.5 complete. Changes are staged for review. Do not commit automatically.*

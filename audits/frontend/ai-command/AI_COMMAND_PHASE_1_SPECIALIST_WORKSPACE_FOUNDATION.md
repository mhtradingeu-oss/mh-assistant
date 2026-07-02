# AI Command — Phase 1: Specialist Workspace Foundation

**Date:** 2026-05-14
**Branch:** `architecture/frontend-consolidation-v1`
**Status:** IMPLEMENTED — no backend or runtime files changed
**Mode:** Controlled implementation — read-first, understand-first, then build

---

## Summary

Phase 1 establishes the visible foundation of the AI Team Command Center inside
`public/control-center/pages/ai-command.js`. The page now presents as a real
specialist workspace, not a generic chat surface. The Home → AI Command bridge
is consumed and drives the active specialist and composer. Nine specialists are
defined with profile panels, role-aware composer placeholders, and suggested
prompt chips. No backend execution was enabled. The page is fully draft/guidance
only.

---

## Files Changed

| File | Change |
|------|--------|
| `public/control-center/pages/ai-command.js` | Phase 1 specialist defs, profiles, suggested prompts, bridge consumption, new render() function |
| `public/control-center/styles/12-pages.css` | Appended `.aicmd-v2-*` page-scoped CSS block |

**Not changed (confirmed):**
- `public/control-center/app.js`
- `public/control-center/router.js`
- `public/control-center/api.js`
- `public/control-center/state.js`
- `public/control-center/shared-context.js`
- `public/control-center/pages/home.js`
- All `runtime/orchestrator-service/` files
- All `data/` files
- All `runtime/data/` files

---

## Current AI Command Problems Addressed

| Problem (from pre-upgrade audit) | Phase 1 resolution |
|----------------------------------|--------------------|
| Page felt like a generic chat surface | New header, team rail, profile panel, composer branding |
| No specialist profile showing can help / cannot do | SPECIALIST_DEFS with full profile data added |
| No team rail / specialist selector | `.aicmd-v2-team-rail` with 9 clickable specialists |
| No Solo / Full Team toggle | `.aicmd-v2-mode-toggle` with `data-aicmdv2-team-mode` handlers |
| Home bridge prompt dropped in global bar, not composer | Bridge detection + consumption in render() |
| No role-aware placeholder in composer | Each specialist has its own `placeholder` string |
| No suggested prompts per specialist | `SPECIALIST_SUGGESTED_PROMPTS` per role, plus `TEAM_SUGGESTED_PROMPTS` |
| No context & knowledge panel | `renderPhase1ContextPanel()` shows 8 data points with empty states |
| No safety / authority panel | `renderPhase1SafetyPanel()` with 4 operating rules |
| Page title was "AI Workspace" | Header now reads "AI Team Command Center" |
| No visible mode status | Header meta chips: Project / Specialist / Mode / Status |

---

## Home → AI Command Bridge Behavior

When Home's `handleAiRoleClick` fires (user clicks a team card), Home:
1. Sets `quickCommandInput.value` to a specialist role prompt  
   (e.g. `"Act as the Content Writer for [project]. Review… Do not execute anything; prepare guidance only."`)
2. Calls `navigateTo("ai-command")`

When AI Command's `render()` runs:
1. Reads `quickCommandInput.value` (global bar) via `$("quickCommandInput")`
2. Calls `detectSpecialistFromBridgePrompt()` — pattern-matches "Act as the X" to set `session.modeId`
3. Puts the full prompt text into `session.draftMessage` (loaded into composer textarea)
4. Calls `persistSessionDraft()` with hint `"Specialist context loaded from workspace"`
5. Clears `quickCommandInput.value` to prevent re-consumption on subsequent renders
6. The page re-renders with the specialist active, profile visible, and composer pre-filled

**No auto-execution occurs.** The user must explicitly click "Prepare Guidance" or act on the draft.

---

## Active Specialist Detection Behavior

`detectSpecialistFromBridgePrompt(prompt)`:
- Matches `"Act as the Strategist"` → `strategist`
- Matches `"Act as the Content Writer"` → `writer`
- Matches `"Act as the Media Director"` → `media`
- Matches `"Act as the Video Lead"` → `video_lead`
- Matches `"Act as the Publisher"` → `publisher`
- Matches `"Act as the Ads Optimizer"` → `ads`
- Matches `"Act as the SEO"` or `"Insights Analyst"` → `analyst`
- Matches `"Act as the Compliance Reviewer"` → `compliance_reviewer`
- Matches `"Act as the Operations Lead"` → `operations`
- Falls back to `classifyIntent()` keyword scoring for other prompt formats

`getSpecialistById(id)`:
- Checks `MODE_ID_ALIASES` for legacy ID mapping
- Looks up in `SPECIALIST_DEFS` array
- Falls back to Operations Lead entry if not found

---

## Team Rail Behavior

- **9 specialists rendered** in `.aicmd-v2-team-rail`:
  Strategist, Content Writer, Media Director, Video Lead, Publisher,
  Ads Optimizer, SEO & Insights Analyst, Compliance Reviewer, Operations Lead
- Each button shows: icon, role name, status badge ("Active" / "Ready")
- Active specialist has left-border accent glow and highlighted background
- Clicking a specialist:
  - Sets `session.modeId` to the specialist ID
  - Sets `session.teamMode` to `"solo"` (switches from team to solo if needed)
  - Calls `persistSessionDraft()` with specialist label as hint
  - Re-renders the full page (profile, composer placeholder, suggested prompts update)
  - **Does not execute any backend action**

---

## Specialist Profile Structure

Each specialist entry in `SPECIALIST_DEFS` contains:

```js
{
  id: "writer",
  label: "Content Writer",
  icon: "✍️",
  summary: "...",                 // one-line purpose (rail + header)
  placeholder: "...",             // composer textarea placeholder
  canHelp: ["...", "..."],        // what they can help with (5 items)
  cannotDo: ["...", "..."],       // what they cannot do (4 items)
  destinations: ["...", "..."],   // destination pages (3 items)
  safetyNote: "...",              // per-specialist safety note
  status: "Ready"                 // status label for the rail
}
```

Profile panel rendered by `renderPhase1Profile()`:
- Shows: icon, role name, one-line purpose
- Can Help column: 5 bullet items with green arrow prefix
- Cannot Do column: 4 bullet items with red × prefix
- Destination pages row: chips for relevant workspaces

In Full Team mode: shows team mission profile with combined team capabilities and limitations.

---

## Composer Behavior

Rendered by `renderPhase1Composer()`:
- **Placeholder** changes per active specialist (role-specific text)
- In Full Team mode: team-wide placeholder text
- Buttons (all Phase 1 draft/guidance only):
  - **Prepare Guidance** — stages prompt locally, does NOT call backend
  - **Draft Task** — frames a task-structured version of the prompt in the textarea
  - **Prepare Handoff** — frames a handoff summary version of the prompt
  - **Save Draft** — persists to localStorage via `persistSessionDraft()`
  - **Clear** — clears textarea and session draft
- `Ctrl / Cmd + Enter` triggers Prepare Guidance
- Textarea auto-saves on `oninput`

**Backend execution not wired.** `submitDurableCommand` and `executeProjectAiCommand`
are NOT called from any Phase 1 button handler.

---

## Suggested Prompts Behavior

- 4 prompts per specialist defined in `SPECIALIST_SUGGESTED_PROMPTS`
- Full Team mode uses `TEAM_SUGGESTED_PROMPTS` (4 shared prompts)
- Clicking a prompt chip:
  - Sets `session.draftMessage` to the prompt label text
  - Sets textarea value to the same text
  - Calls `persistSessionDraft()` with hint "Suggested prompt loaded"
  - Shows status message: "Suggested prompt loaded into composer. Review it, then use Prepare Guidance."
  - **Does not auto-execute**

---

## Solo / Team Mode Behavior

Toggle rendered by two buttons with `data-aicmdv2-team-mode` attributes:

**Solo Specialist mode:**
- Team rail shows active specialist with accent state
- Profile panel shows single specialist profile
- Composer label shows specialist name
- Suggested prompts show specialist-specific chips
- Mode chip in header shows "Solo Specialist"

**Full Team mode:**
- Team rail buttons still visible (for reference), no active state
- Profile panel shows team mission profile with combined capabilities
- Composer label shows "Full Team"
- Suggested prompts show team-level chips
- Mode chip in header shows "Full Team"
- Team mission banner appears in left rail

**No backend team sessions created.** No durable team workflow runs triggered.

---

## Context & Knowledge Panel Behavior

Rendered by `renderPhase1ContextPanel()`. Shows 8 data points:

| Item | Populated state | Empty state |
|------|----------------|-------------|
| Project profile | Project name | "Not selected yet" |
| Readiness | Score /100 | "No readiness data yet" |
| Approved assets | Count ready | "No approved assets yet" |
| Integrations | X of Y connected | "No integrations connected yet" |
| Operations snapshot | "Available" | "No operations snapshot yet" |
| AI intelligence | "Live intelligence loaded" | "No campaign brief attached yet" |
| Previous AI outputs | Message count | "No recent AI output yet" |
| Active campaign | Campaign name | "No campaign brief attached yet" |

Present items have green-tinted border. Empty items are dimmed and show italic empty state text.
**No data is invented.** All values come from live state or display empty state text.

---

## Safety / Authority Panel Behavior

Rendered by `renderPhase1SafetyPanel()`. Shows 4 operating rules:

1. "Guidance only — no execution happens from this workspace without confirmation."
2. "Drafts are not execution — prepared content stays local until you act on it."
3. "Publishing, approval, and workflow runs require your explicit confirmation in the right workspace."
4. "Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls."

Panel uses a calm green-tinted border to communicate safety without alarm.
Positioned at the bottom of the main content area.

---

## What Remains Draft-Only (Phase 1 Boundary)

| Capability | Phase 1 status |
|------------|---------------|
| `submitDurableCommand()` | Defined in file, NOT wired to any visible button |
| `executeProjectAiCommand()` | Imported from api.js, NOT called in Phase 1 render |
| `renderMessageStream()` | Defined in file, NOT used in Phase 1 render |
| `renderResultsPanel()` | Defined in file, NOT used in Phase 1 render |
| `renderRecentCommands()` | Defined in file, NOT used in Phase 1 render |
| `renderArtifactsPanel()` | Defined in file, NOT used in Phase 1 render |
| `renderControlRoomHeader()` | Defined in file, NOT used in Phase 1 render |
| `renderTeamSelector()` | Defined in file, superseded by Phase 1 team rail |
| `renderCommandComposer()` | Defined in file, superseded by Phase 1 composer |
| `renderSuggestedPromptsSection()` | Defined in file, superseded by Phase 1 prompts |
| Team workflow session creation | Not implemented |
| Voice input | Not implemented |
| Media generation controls | Not implemented |
| File attachment area | Not implemented |
| Auto mode | Not implemented |

---

## What Was Not Changed

- `app.js` — no changes to route handling, event dispatch, or AI command execution
- `router.js` — no changes to route definitions or access controls
- `api.js` — no changes to API contracts or endpoints
- `state.js` — no changes to state shape or selectors
- `shared-context.js` — no changes to shared handoff or draft cache
- `home.js` — no changes; bridge is consumed in ai-command, not home
- All `runtime/orchestrator-service/` files — untouched
- All `data/projects/` files — untouched
- All `runtime/authority/` files — untouched
- No existing CSS classes removed or changed

---

## Backend / API Untouched Confirmation

- No backend files modified
- No API contracts changed
- No new API endpoints called from Phase 1
- `executeProjectAiCommand` is imported but NOT called
- `createProjectHandoff`, `createProjectTask`, `runProjectWorkflow` — NOT called
- No admin/authority mutations triggered

---

## Validation Results

```
node --check public/control-center/pages/ai-command.js  → SYNTAX OK
node --check public/control-center/app.js               → SYNTAX OK
node --check public/control-center/router.js            → SYNTAX OK
grep 'important' 12-pages.css (Phase 1 block)           → no matches
```

---

## Known Follow-Up Phases

### Phase 2 — Live AI Response in the Workspace
- Wire `submitDurableCommand` to the primary composer send button
- Render `renderMessageStream` and `renderResultsPanel` in the main area
- Show conversation history, route suggestions, and task blocks
- Require project to be selected before sending

### Phase 3 — Context Attachment & Handoff Panel
- Add file/asset attachment surface
- Show shared handoff intake from other pages
- Enable Prepare Handoff to write a real handoff record (with confirmation)

### Phase 4 — Full Team Session Orchestration
- Create durable team session via backend
- Route each turn to the appropriate specialist
- Show team conversation stream with labeled specialist turns

### Phase 5 — Voice Input Surface
- Add voice input control (mic button) when platform supports it
- Connect to native voice runtime when available
- All voice actions still require confirmation before backend execution

### Phase 6 — Media Generation Preview
- Show media readiness from native media stack
- Add generation controls for image/video/audio when backend providers are live
- All generation requires explicit user trigger and backend authority

---

*This audit was created as part of Phase 1 delivery. It documents the actual implementation state and does not describe future aspirations as current facts.*

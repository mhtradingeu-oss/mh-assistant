# AI Command — Specialist Workspace Pre-Upgrade Audit

**Date:** 2026-05-14
**Branch:** `architecture/frontend-consolidation-v1`
**Status:** AUDIT ONLY — no production files were changed
**Authored by:** AI audit pass (GitHub Copilot)

---

## 1. Current Page Role

`public/control-center/pages/ai-command.js` is the **AI Workspace** page of MH-OS.

Its registered route ID is `ai-command`.  
Its `meta.title` is `"AI Workspace"` with eyebrow `"AI & Build"`.  
It uses `disableStandardLayout: true`, meaning it owns its full rendering container.

**Current role in the system:**  
It is the generic prompt composition surface. It allows the user to select an AI specialist, write a prompt, save a draft, and copy the command to the global command bar. It does **not** currently execute AI commands autonomously — the "Prepare Command" button copies context to the global bar.

**What Home now expects it to be:**  
Home AI Team cards call `openAiWithPrompt(rolePrompt)` → `setGlobalAiPrompt()` → `navigateTo("ai-command")`. Home now treats AI Command as the **real specialist execution workspace**, arriving with a specialist-prefilled prompt and expecting the user to continue a guided interaction there. This creates a structural gap: the page does not yet receive or display the incoming specialist context in a meaningful way.

---

## 2. Current Render Structure

The `render()` function produces the following section stack inside a single `<div class="aicmd-shell">`:

| # | Section | DOM ID / Class |
|---|---------|----------------|
| 1 | **AI Workspace header** (project, readiness, market, language, campaign, execution mode) | `.aicmd-overview` |
| 2 | **AI specialist selector** — grid of projected agent cards with "Start with X" buttons | `.aicmd-agent-grid` |
| 3 | **Command Composer** — textarea, action row buttons | `#ctrlComposerInput`, `#aiCommandSendBtn` |
| 4 | **Status strip** — live counts (specialist, commands, recommendations, workspace) | `.aicmd-operating-strip` |
| 5 | **Quick Actions** — 4 prompt templates | `.aicmd-suggestions` |
| 6 | **Current AI State** — stat grid (commands, artifacts, recommendations) | `.aicmd-overview-grid` |

**Important structural finding:**  
The file also contains a large set of **render helper functions** that are NEVER called in the current `render()` path:

- `renderControlRoomHeader()` — full Control Room header with intelligence dots
- `renderTeamSelector()` — icon-based team selector tabs (`.ctrl-room-team`)
- `renderCommandComposer()` — richer composer with structured/free mode toggle
- `renderSuggestedPromptsSection()` — prompt grid
- `renderCleanResponse()` — full AI response card renderer
- `renderMessageStream()` — full chat conversation stream
- `renderResultsPanel()` — conversation panel
- `renderRecentCommands()` — command history panel
- `renderArtifactsPanel()` — AI memory / artifacts panel

These functions represent a **prior, more advanced design** that was replaced by the simpler `aicmd-shell` render. They are **ready to be re-enabled** with CSS support. This is the biggest opportunity in the file.

---

## 3. Current Handlers and Buttons

| Button ID | Handler | Action |
|-----------|---------|--------|
| `[data-aicmd-start-agent]` | Inline `onclick` | Sets `session.modeId` + fills `session.draftMessage` with agent's `suggestedPrompt`, re-renders |
| `[data-aicmd-quick-template]` | Inline `onclick` | Fills textarea with template string, persists draft |
| `#ctrlComposerInput` | `oninput` / `onkeydown` | Auto-saves draft; Ctrl+Enter triggers send |
| `#aiCommandSendBtn` | `onclick` | **Copies command to global `quickCommandInput`** bar — does NOT execute AI |
| `#aicmdSaveDraftBtn` | `onclick` | Persists draft to localStorage |
| `#aicmdClearBtn` | `onclick` | Clears draft |
| `#aicmdOpenWorkflowsBtn` | `onclick` | `navigateTo("workflows")` |
| `#aicmdOpenCampaignBtn` | `onclick` | `navigateTo("campaign-studio")` |
| `#aicmdOpenInsightsBtn` | `onclick` | `navigateTo("insights")` |

**Key gap:** The primary action ("Prepare Command") does not call `executeProjectAiCommand`. It only writes to the global bar input. Actual AI execution only happens through the global command bar's `runQuickCommandBtn` which dispatches `mh:submit-ai-command`. This event is **not listened to inside ai-command.js** — the event is dispatched from `app.js#executeQuickCommand()` but there is no handler registered in the page that would process it and show a response.

The large response-rendering infrastructure (`submitDurableCommand`, `renderMessageStream`, etc.) is fully wired internally but never triggered from the current render path.

---

## 4. Current AI Prompt Input/Output Flow

### Input path (how prompts arrive):

1. **From Home AI Team card click:**
   - `home.js#handleAiRoleClick()` → builds a role-specific prompt string
   - Calls `setGlobalAiPrompt($, prompt)` → writes to `#quickCommandInput` (global bar)
   - Calls `navigateTo("ai-command")`
   - The prompt is in the **global bar**, NOT in the AI Command textarea

2. **From Home "Ask Next Action" / quick prompt buttons:**
   - Same path: `openAiWithPrompt(prompt)` → `setGlobalAiPrompt()` → `navigateTo("ai-command")`

3. **From within AI Command:**
   - User types directly in `#ctrlComposerInput`
   - Clicking "Prepare Command" writes `[SpecialistLabel] prompt` to `#quickCommandInput`

4. **From global command bar:**
   - `app.js#executeQuickCommand()` dispatches `mh:submit-ai-command` CustomEvent with `{ message, meta: { source } }`
   - `navigateTo("ai-command")` is called
   - **Gap:** ai-command.js does not listen to `mh:submit-ai-command` — the event fires but nothing handles it on the page

### Output path (current vs. available):
- **Current:** No AI response is displayed. "Prepare Command" only fills the bar.
- **Available (dead code):** `submitDurableCommand()` calls `executeProjectAiCommand()` (backend), appends messages to session, and `renderMessageStream()` renders structured cards. This infrastructure exists but is not wired to any button.

---

## 5. Current Relation to Home AI Team Cards

Home cards trigger the flow: **specialist role → prefill global bar → navigate to AI Command**.

The **mismatch** is:
- Home now expects AI Command to be a real specialist workspace (per the executive upgrade).
- AI Command currently only shows a generic textarea. It does not read the incoming global bar prompt into its own textarea on load.
- The specialist identity is not reflected on arrival — the page renders with the last session's `session.modeId`, not the one Home selected.
- `session.modeId` is set when "Start with X" is clicked inside ai-command, but Home's `handleAiRoleClick()` does not set this — it only writes to the global bar input.

**Available fix path:**  
On page load, ai-command's `render()` could read `$("quickCommandInput")?.value` and use it to pre-fill the textarea and detect the incoming specialist. The `MODE_ID_ALIASES` map and `classifyIntent()` function already exist to handle this.

---

## 6. Current Backend / API Dependencies

The following APIs are available in `context` (passed from `app.js`) and used or available:

| Function | Used Currently | Where |
|----------|---------------|-------|
| `getState()` | ✅ | reads project, market, campaign, readiness, operations |
| `selectCurrentProject()` | ✅ | project name |
| `selectOperationsSnapshot()` | ✅ | ai_commands, ai_artifacts, ai_recommendations |
| `selectProjectPayload()` | ✅ | overview, readiness |
| `reloadProjectData` | ❌ dead code only | `ensureIntelligenceLoaded()` |
| `fetchProjectInsights` | ❌ dead code only | `ensureIntelligenceLoaded()` |
| `fetchProjectLearning` | ❌ dead code only | `ensureIntelligenceLoaded()` |
| `executeProjectAiCommand` | ❌ dead code only | `submitDurableCommand()` |
| `createProjectHandoff` | ❌ dead code only | `syncAiWorkflowBridge()` helper |
| `consumeProjectHandoff` | ❌ dead code only | `applyDurableAiHandoff()` |
| `showMessage` | ✅ | after buttons |
| `navigateTo` | ✅ | navigation buttons |
| `escapeHtml` | ✅ | all render |

**Key finding:** The AI execution path (`executeProjectAiCommand`) is implemented internally but never triggered. The page is one handler wire-up away from being a live AI execution surface.

---

## 7. Current Authority Risks

### Authority boundary — what the page does today:

| Risk | Status | Detail |
|------|--------|--------|
| `executeProjectAiCommand` triggered | ❌ Not active | Safe — button only fills global bar |
| `publish_now` step in auto-plan | ⚠️ Defined | `buildAutoPlanFromCommand()` creates a `publish_now` plan step if prompt contains `publish now\|send external\|paid ads\|final approval`. This step targets "publishing" page but does not execute automatically. |
| `runProjectAiWorkflow` | ❌ Not called | Not wired in current render |
| Handoff consumption | ❌ Not active | `consumeProjectHandoff` is in dead code only |
| localStorage write | ✅ Scoped | Draft saved under `mh-ai-command-local-drafts-v1` per project key — safe |
| Authority projection | ✅ Read-only | `getProjectedTeamMembers()` and `getProjectedActiveRole()` are projection-only per `authority-projection.js` docblock |

### What must stay gated:
- Any future "Run command" button must call `executeProjectAiCommand` only (backend owns execution).
- `publish_now`-type actions must NEVER be triggered automatically. They must require explicit user confirmation.
- `buildAutoPlanFromCommand()` is safe as a draft plan builder — it must NOT be connected to auto-execution.
- The `aiAutoModeUnsubscribe` variable is declared but unused — it signals an unfinished automation listener that must not be silently activated.

---

## 8. Existing Specialist / Team Data Available

### `MODE_DEFS` (8 specialists, defined in file):
`strategist`, `writer`, `designer`, `media`, `ads`, `analyst`, `researcher`, `operations`

Each has: `id`, `label`, `icon`, `summary`, `routeHint` (destination page).

### `AGENT_CARDS` (8 cards with richer data):
Same 8 specialists with: `name`, `purpose`, `bestUse`, `suggestedPrompt`

### `buildProjectedAgentCards(state)`:
Merges `AGENT_CARDS` with `getProjectedTeamMembers(state)` from backend operations projection. If the backend provides team members, those override the static cards. The `active` flag is set for the role matching `getProjectedActiveRole(state)`.

### `MODE_ID_ALIASES`:
Maps legacy/Home role IDs to specialist IDs:
- `executive` → `operations`
- `campaign` → `strategist`
- `content` → `writer`
- `seo` → `analyst`
- `research` → `researcher`

Home's `handleAiRoleClick` uses role IDs: `strategist`, `writer`, `designer`, `video_lead`, `publisher`, `ads_operator`, `analyst`, `compliance_reviewer`, `admin`. Some of these need alias mapping.

---

## 9. Existing Navigation / Handoff / Workflow Patterns

| Pattern | Implementation | Status |
|---------|---------------|--------|
| Specialist → routeHint navigation | Each `MODE_DEFS` entry has `routeHint` | Not yet surfaced in UI |
| Route suggestions in response | `routeSuggestion()` → rendered as buttons with `data-ctrl-route` | In dead code render only |
| Shared AI draft | `setSharedAiDraft()` in `syncAiWorkflowBridge()` | Called from dead code `submitDurableCommand()` |
| Handoff consume | `consumeProjectHandoff()` in `applyDurableAiHandoff()` | Dead code |
| Global bar → page bridge | `quickCommandInput` DOM element | One-way write only; page does not read it on render |
| `mh:submit-ai-command` event | Dispatched by app.js | Not listened to in page |

---

## 10. Proposed Final UI Structure

The final AI Command Specialist Workspace should have the following zones:

### Zone A — Smart Header
- Specialist identity: name, icon, `routeHint` destination pill
- Project context: name, readiness score, campaign, market
- Intelligence status dot (idle / loading / ready / error)
- "Refresh intelligence" action
- If arriving from Home: show "→ Arrived from Executive Command Center" provenance chip

### Zone B — Specialist Selector
- Icon-based tab row (8 specialists) — replaces card grid
- Active specialist highlighted, label shown
- On click: sets `session.modeId`, updates textarea placeholder and suggested prompts
- Reads incoming specialist from global bar on first render

### Zone C — Main Chat / Workspace
- Conversation stream (`renderMessageStream` — re-enable existing code)
- Empty state if no messages: show specialist description + best-use note
- User messages right-aligned, assistant responses left-aligned with specialist icon
- "Recent commands" panel below stream (restore `renderRecentCommands`)

### Zone D — Command Composer
- Textarea with specialist-aware placeholder
- Free text / Structured task toggle (existing `ctrl-mode-toggle` in dead code)
- **"Send to [Specialist]"** button → calls `submitDurableCommand()` (wires AI execution)
- Keyboard: Ctrl+Enter sends
- Draft auto-save to localStorage per project

### Zone E — Context Panel (right sidebar)
- AI Memory & Artifacts panel (`renderArtifactsPanel` — re-enable existing code)
- Readiness blockers list (sourced from `aiContext.criticalGaps`)
- Intelligence coverage summary (`coveredCount / coverageTotal`)

### Zone F — Suggested Prompts
- 4 quick-action cards (existing `QUICK_ACTIONS`)
- Smart recommendation (existing `buildSmartRecommendation()` — dead code)
- Prefill only — not auto-submitted

### Zone G — Action / Destination Panel
- Route suggestion buttons from last response (`routeSuggestions`)
- Navigation shortcuts: Workflows, Campaign Studio, Insights, Publishing
- Routed by `routeHint` from active specialist

### Zone H — Safety / Provenance Panel
- Last command summary
- Command source tag (e.g., "Arrived from Home · Strategist")
- Warning if `publish_now`-type keywords detected: requires explicit approval gate
- Intelligence load state summary

---

## 11. Safe Implementation Plan

### Stage 1 — Bridge Incoming Prompts (no UI redesign)
**Scope:** Wire the Home → AI Command prompt arrival gap.
- On `render()`, read `$("quickCommandInput")?.value` after navigation.
- If value is present and the session has no draftMessage, copy it into `session.draftMessage` and into `#ctrlComposerInput`.
- Use `classifyIntent()` to detect and set `session.modeId` from the incoming prompt.
- Clear the global bar value after consuming it.
- **Risk:** Very low. Pure read from an existing DOM element, session write only.
- **Files touched:** `ai-command.js` only.

### Stage 2 — Wire AI Execution
**Scope:** Connect "Send" button to `submitDurableCommand()`.
- Replace the current `sendBtn.onclick` with a call to `submitDurableCommand()` using `context`.
- Add loading state to the button during the async call.
- Call `aiCommandRoute.render(context)` after completion to show the response.
- Add `mh:submit-ai-command` event listener (registered once via `aiCommandBridgeRegistered` flag).
- **Risk:** Medium. Backend `executeProjectAiCommand` is called. Must not auto-run. Must be explicit user action only.
- **Files touched:** `ai-command.js` only.

### Stage 3 — Restore Conversation UI
**Scope:** Re-enable the dead code render functions.
- Replace the `aicmd-shell` section stack with the Control Room layout using existing `renderControlRoomHeader`, `renderMessageStream`, `renderResultsPanel`, `renderArtifactsPanel`, `renderRecentCommands`.
- Add CSS for `ctrl-room-*` classes in `12-pages.css` or `15-clean-operating-layer.css` (currently these classes only exist in legacy files).
- **Risk:** Medium-high (CSS additions needed). Must be done in one coordinated PR.
- **Files touched:** `ai-command.js`, one CSS file (`12-pages.css` or new `16-ai-command.css`).

### Stage 4 — Specialist Identity on Arrival
**Scope:** Make the page show which specialist was requested and why.
- Display specialist name, icon, purpose, and best-use note when arriving from Home.
- Add a provenance chip: "Requested by Executive Command Center · Strategist".
- Use `applyDurableAiHandoff()` for durable handoff support.
- **Risk:** Low. Visual only, no new API calls.
- **Files touched:** `ai-command.js` only.

### Stage 5 — Smart Header and Context Panel
**Scope:** Full specialist workspace shell using existing render helpers.
- Add Zone E (context panel) with blockers and coverage.
- Add Zone H (provenance/safety panel) with publish-gate warning.
- **Risk:** Low. Read-only from existing state.
- **Files touched:** `ai-command.js`, CSS.

---

## 12. Files Likely Needed

| File | Purpose | Change Type |
|------|---------|-------------|
| `public/control-center/pages/ai-command.js` | Core page JS | Modify — wire Stage 1-5 |
| `public/control-center/styles/12-pages.css` | Page CSS | Modify — add `ctrl-room-*` classes |
| (optional) `public/control-center/styles/16-ai-command.css` | AI Command dedicated CSS | New — if ctrl-room classes are large |
| `public/control-center/shared-context.js` | Handoff context | Read-only — no changes expected |
| `public/control-center/app.js` | App shell | No changes expected |
| `public/control-center/router.js` | Route registry | No changes expected |
| `public/control-center/state.js` | State selectors | No changes expected |
| `public/control-center/pages/home.js` | Home page | **Do not touch** |

---

## 13. Do-Not-Touch List

| File / System | Reason |
|---------------|--------|
| `public/control-center/pages/home.js` | Executive upgrade is finalized; handoff mechanism is correct |
| `public/control-center/app.js` | App shell wires all API functions; no changes needed |
| `public/control-center/router.js` | Route is already registered correctly as `ai-command` |
| `public/control-center/state.js` | Selectors are stable and correct |
| `public/control-center/shared-context.js` | Handoff cache is correct; `setSharedAiDraft` / `getSharedHandoff` are working |
| `runtime/orchestrator-service/` | Backend — all execution authority lives here |
| `data/projects/` | Project data — read-only from frontend |
| `public/control-center/runtime/authority/authority-projection.js` | Authority projection — strictly read-only; must not be extended with enforcement |
| All CSS files except `12-pages.css` | Keep existing visual system stable |
| `QUICK_ACTIONS` constant | Working prompt templates — do not change content |
| `MODE_DEFS` and `AGENT_CARDS` | Stable specialist definitions — update only if backend team model changes |
| `buildAutoPlanFromCommand()` | Must NOT be connected to auto-execution |
| `aiAutoModeUnsubscribe` variable | Inactive — must not be accidentally activated |

---

## 14. Validation Checklist

Before any upgrade commit:

- [ ] `node --check public/control-center/pages/ai-command.js` passes
- [ ] `git diff --stat` shows ONLY `ai-command.js` (and CSS if Stage 3+)
- [ ] Home AI Team card click → navigates to ai-command → specialist name and prompt visible
- [ ] Textarea prefilled with Home-provided prompt on arrival
- [ ] `session.modeId` correctly resolved from incoming prompt via `classifyIntent()`
- [ ] "Send to Specialist" button calls backend (Stage 2+) — verify in Network tab
- [ ] Response card renders in conversation stream — no raw JSON exposed
- [ ] "Prepare Command" (Stage 1 only) still writes to global bar correctly
- [ ] No `publish_now` auto-execution — gated actions require user confirmation
- [ ] Clearing draft removes both textarea and localStorage entry
- [ ] Specialist selector click changes active specialist without full page reload
- [ ] `renderArtifactsPanel` shows artifacts after first real command (Stage 3+)
- [ ] `getProjectedTeamMembers()` data is respected if backend provides team members
- [ ] Authority projection reads remain projection-only (no enforcement code added)
- [ ] No untrusted data rendered without `escapeHtml()`

---

## 15. Recommended Staged Rollout

| Stage | Name | Risk | Breaking? | PR Strategy |
|-------|------|------|-----------|-------------|
| **1** | Bridge Incoming Prompts | Very Low | No | Single commit to `ai-command.js` |
| **2** | Wire AI Execution | Medium | No (additive) | Separate PR, AI execution gated by explicit button |
| **3** | Restore Conversation UI | Medium-High | No (replace shell) | Coordinated with CSS PR, preview in browser before merge |
| **4** | Specialist Identity on Arrival | Low | No | Folded into Stage 3 PR or standalone |
| **5** | Smart Header + Context Panel | Low | No | Final polish PR after Stage 3 is stable |

**Recommended starting point:** Stage 1 — it fixes the most critical UX gap (Home sends prompt → AI Command ignores it) with the least risk.

---

## Summary Table — Risks and Opportunities

| Item | Type | Priority |
|------|------|----------|
| Incoming prompt from Home is not received in textarea | **Gap / Risk** | Critical |
| Specialist identity not set on arrival from Home | **Gap / Risk** | High |
| `mh:submit-ai-command` event not handled in page | **Gap / Risk** | High |
| Full response rendering infrastructure exists but unused | **Opportunity** | High |
| `executeProjectAiCommand` wired in helpers but not triggered | **Opportunity** | High |
| Intelligence loader (`ensureIntelligenceLoaded`) fully implemented but not called | **Opportunity** | Medium |
| `buildSmartRecommendation()` produces dynamic AI suggestion — not surfaced | **Opportunity** | Medium |
| `buildAutoPlanFromCommand()` defines publish-now step — must not auto-execute | **Authority Risk** | High |
| `aiAutoModeUnsubscribe` variable declared but unused — signals unfinished automation | **Authority Risk** | Medium |
| CSS classes (`ctrl-room-*`) in legacy files only — active CSS has only `aicmd-*` | **CSS Debt** | Medium |
| `AGENT_CARDS` and `MODE_DEFS` duplicate specialist data redundantly | **Code Debt** | Low |

---

*Audit complete. No production files were modified during this pass.*

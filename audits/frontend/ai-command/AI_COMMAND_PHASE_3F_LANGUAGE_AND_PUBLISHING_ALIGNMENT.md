# AI Command Phase 3F — Language and Publishing Alignment

**Date:** 2026-05-15  
**Branch:** architecture/frontend-consolidation-v1  
**Phase:** 3F — Conversation Language, Publishing Language, and Market Alignment  

---

## 1. Existing Setup/Settings Language Fields Discovered

### Setup (`public/control-center/pages/setup.js`)
Step: **"Market & Language"** (`id: "market-language"`)  
Fields stored:
- `market` — regional target (e.g., "Germany")
- `language` — default content/publishing language (e.g., "German")
- `currency` — commercial planning default

`SETUP_FIELD_INFO.language`:
> "Sets the default language for content, AI suggestions, and campaign outputs."

**Conclusion:** `setup.language` IS the publishing/output language. This is the correct source of truth.

### Settings (`public/control-center/pages/settings.js`)
No language-specific fields exist. Settings covers governance, team roles, operating modes, and automation rules only.

### State (`public/control-center/state.js`)
Tracks:
- `context.currentMarket` — populated from project load
- `context.currentLanguage` — populated from project load

### AI Context (`buildUnifiedAiContext`)
Exposes:
- `aiContext.market` = `state.context.currentMarket || overview.market`
- `aiContext.language` = `state.context.currentLanguage || overview.language`

---

## 2. Source of Truth Decision

| Concept | Source of Truth | Notes |
|---|---|---|
| **Publishing / output language** | `setup.language` → `aiContext.language` | Already persisted in project data |
| **Market** | `setup.market` → `aiContext.market` | Already persisted in project data |
| **Conversation language** | Auto-detected from request text | Not persisted; ephemeral per request |

**Decision: Option A** — Display discovered values from Setup. No new settings created.  
Persistent language override in AI Team deferred to **Phase 4**.

---

## 3. Files Changed

| File | Change |
|---|---|
| `runtime/orchestrator-service/lib/ops/ai-orchestrator.js` | Language model split, prompt update, payload enrichment |
| `public/control-center/pages/ai-command.js` | Language strip, updated composer signature, enriched payload |
| `audits/frontend/ai-command/AI_COMMAND_PHASE_3F_LANGUAGE_AND_PUBLISHING_ALIGNMENT.md` | This audit |

---

## 4. Conversation vs Publishing Language Model

### Before Phase 3F (broken state)
- Frontend sent a single `language: aiContext.language` (setup publishing language, e.g., "German")
- Backend `inferLanguagePreference` returned that explicit value first — so `Language: German`
- Prompt said both "Language: German" AND "Match the user language exactly / If user writes Arabic, answer Arabic"
- **Contradiction**: model received conflicting instructions with no clear priority

### After Phase 3F

#### `inferConversationLanguage(input)`
- Detects from request text only (Unicode range matching)
- Returns "Arabic", "Cyrillic language", "Chinese", or "user language"
- Never uses explicit fields — purely signal from what the user types

#### `inferOutputLanguage(input)`
- Priority: `outputLanguage` / `output_language` > `marketLanguage` / `market_language` > `language` / `languagePreference` > fallback "user language"
- Returns project/setup publishing language when frontend passes it correctly

#### `inferLanguagePreference(input)`
- Kept as backward-compatible alias for `inferOutputLanguage`
- Other callers (e.g., non-guidance flows) are unaffected

---

## 5. Prompt Changes (`buildGuidancePrompt`)

### Removed
```
Language: ${language}
Match the user language exactly.
If the user writes Arabic, answer Arabic. If the user writes German, answer German.
```

### Added
```
Conversation language (language the user is writing in): ${conversationLanguage}
Output/publishing language (language for publishable content, copy, hooks, captions, scripts): ${outputLanguage}
Market: ${market}                                    ← only if non-empty
Always respond to the user, explain, and interact in ${conversationLanguage}.
Generate all publishable content in ${outputLanguage} because that is the project publishing language.
When the output language differs from the conversation language, label the publishable section clearly.
If the user explicitly requests a different output language, use that language for publishable content instead.
```

### Example prompt block for Arabic user / German publishing project
```
Conversation language (language the user is writing in): Arabic
Output/publishing language (...): German
Market: Germany
Always respond to the user, explain, and interact in Arabic.
Generate all publishable content (hooks, captions, scripts, emails, copy, headlines) in German because that is the project publishing language.
When the output language differs from the conversation language, label the publishable section clearly, for example: "German hooks for the Germany market:".
If the user explicitly requests a different output language, use that language for publishable content instead.
```

---

## 6. Frontend Display Changes

### New: `renderLanguageMarketStrip(aiContext, escapeHtml)`
Renders a compact chip row immediately below the Workspace Composer header:

```
[ You talk: Auto ]  [ We publish: German ]  [ Market: Germany ]
```

- Uses existing `aicmd-v2-planned-chip is-available` classes — no new CSS
- "You talk: Auto" — conversation language is always auto-detected; no stored value
- "We publish" and "Market" — sourced from `aiContext.language` and `aiContext.market` (Setup data)
- Each chip has a `title` attribute with explanation for accessibility

### Updated: `renderPhase1Composer(session, aiContext, escapeHtml)`
- Added `aiContext` as third parameter
- Calls `renderLanguageMarketStrip` inside the composer body

---

## 7. Frontend Payload Changes

### `executeProjectAiGuidance` call (Ask Specialist)

**Before:**
```js
language: aiContext.language || "user language"
```

**After:**
```js
language: aiContext.language || "",
outputLanguage: aiContext.language || "",
market: aiContext.market || "",
marketLanguage: aiContext.language || "",
```

- `outputLanguage` → used by `inferOutputLanguage` as highest-priority explicit override
- `market` → passed into prompt as `Market:` line
- `marketLanguage` → fallback if `outputLanguage` not set
- Empty string (`""`) instead of `"user language"` when not configured — allows backend to fall back cleanly

---

## 8. Backend Payload Enrichment

`guidancePayload.specialist` now includes:
```js
{
  id: specialistId,
  name: specialistName,
  mode: teamMode,
  language,               // backward-compat (= outputLanguage)
  conversationLanguage,   // detected from request text
  outputLanguage,         // project publishing language
  market                  // from input.market
}
```

Same fields added to error payload `guidanceError.payload.specialist`.

`contextSummary` passed to provider now includes:
- `conversation_language`
- `output_language`
- `market`

---

## 9. Safety Confirmation

- No tasks, workflows, handoffs, or approvals created
- No operational authority published or mutated
- No customer-operations files modified
- No `data/projects/*` files modified
- No `runtime/orchestrator-service/server.js` modified
- No `settings.js` or `setup.js` modified
- `executeGuidance` safety label unchanged: `guidance_only_no_operational_side_effects`
- `side_effects` block unchanged: all `false`

---

## 10. Validation

```bash
node --check runtime/orchestrator-service/lib/ops/ai-orchestrator.js  # PASS
node --check public/control-center/pages/ai-command.js               # PASS
node --check public/control-center/api.js                            # PASS
node --check public/control-center/app.js                            # PASS
node --check public/control-center/router.js                         # PASS
```

Safety scan:
```bash
awk '/async executeGuidance\(/,/^    executeWorkflow\(/ {print}' \
  runtime/orchestrator-service/lib/ops/ai-orchestrator.js | \
  grep -E "createTask\(|recordWorkflowRun\(|createApproval\(|createHandoff\(|createAiArtifact\(|upsertAiMemory\(|createAiRecommendation\("
# Result: NO_MUTATOR_CALLS_IN_EXECUTE_GUIDANCE
```

---

## 11. Remaining Follow-ups (Phase 4)

| Item | Status |
|---|---|
| Allow user to override output language inline in AI Team composer | Deferred Phase 4 |
| Add explicit "Output language" field to Settings page | Deferred Phase 4 |
| Persist conversation language preference per user session | Deferred Phase 4 |
| Add "Change language" shortcut link from strip to Setup page | Deferred Phase 4 |
| Detect language from pasted text / voice input | Deferred Phase 4 |
| Support multi-market projects with per-campaign language override | Deferred Phase 4 |

---

## 12. Expected Behavior Example

**User writes (in Arabic):**  
> "اكتب لي 3 Hooks قصيرة لحملة Beard Kit"

**Prompt sent to model:**
```
Conversation language (language the user is writing in): Arabic
Output/publishing language (...): German
Market: Germany
Always respond to the user, explain, and interact in Arabic.
Generate all publishable content ... in German because that is the project publishing language.
When the output language differs from the conversation language, label the publishable section clearly, for example: "German hooks for the Germany market:".
```

**Expected model response:**
```
أكيد، هذه 3 Hooks بالألمانية مناسبة للسوق الألماني:

German hooks for the Germany market:
1. Dein Bart. Deine Regeln. – Beard Kit für echte Männer.
2. Gepflegter Bart in 5 Minuten – Kein Kompromiss.
3. Der Bart macht den Mann – und Beard Kit macht den Bart.

اقتراحي الأفضل هو Hook رقم 1 لأنه يخاطب الهوية الشخصية مباشرة.
```

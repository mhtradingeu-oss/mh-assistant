# Settings Step 2 — Layout-Only Operating Surface Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Layout-only — public/control-center/pages/settings.js
Status: Applied and validated

---

## 1. Summary of Layout-Only Settings Changes

Settings Step 2 replaced all old local Settings shell/label semantics with a clean operating surface. The page now reads as six distinct zones:

| Zone | Rendered By | New Label |
|---|---|---|
| Page header / command center | `renderSettingsOverview` | `Settings command center` |
| System signal bar | `settings-overview-grid` inside overview | `Configuration signals` |
| Main settings form | `SETTINGS_GROUPS` via `renderGroupedSection` | (group titles intact) |
| Right rail summary | `renderSummary` (now activated) | `Settings summary` |
| Action panel | `renderActions` (now activated) | `Settings actions` |
| AI panel | `renderSettingsAssistant` | `Settings AI assistant` |

No behavior was changed. No CSS was modified. No API, backend, data, index, or page-standard files were touched.

---

## 2. Files Changed

| File | Type of Change |
|---|---|
| `public/control-center/pages/settings.js` | Layout-only label rename + structural activation |

---

## 3. Old Labels Removed / Replaced

| Old Label | Location | New Label |
|---|---|---|
| `Settings Overview` | `renderSettingsOverview` panel-kicker | `Settings command center` |
| (no label) | before `settings-overview-grid` | `Configuration signals` (added panel-kicker) |
| `Control Actions` | embedded in `renderSettingsOverview` | Removed from overview; `renderActions` panel-kicker → `Settings actions` |
| `Settings AI Assistant` | `renderSettingsAssistant` panel-kicker | `Settings AI assistant` |
| `Settings AI Assistant` | `renderSettingsAssistant` h3 | `Settings AI assistant` |
| `Settings Summary` | `renderSummary` panel-kicker | `Settings summary` |

All six old labels are gone from the rendered UI. No old label strings remain in settings.js output.

---

## 4. Shell Class Decision

### `settings-shell`

**Decision: Removed.**

`settings-shell` was used in:
- `buildPageMarkup` outer wrapper (`<div class="settings-shell settings-workspace">`)
- `settingsRoute.template` placeholder (`<div class="settings-shell">`)

**Why removed:** No CSS file in `public/control-center/styles/` defines `.settings-shell`. Confirmed by grep across all `.css` files — zero matches. Removing the class has no visual or layout impact. Safe to remove immediately.

### `settings-workspace`

**Decision: Removed.**

`settings-workspace` was used only in `buildPageMarkup` alongside `settings-shell`.

**Why removed:** No CSS file defines `.settings-workspace`. Zero CSS matches confirmed. Safe to remove immediately.

### Replacement class

Both classes replaced with `settings-page-surface` in:
- `buildPageMarkup` outer wrapper
- `settingsRoute.template` placeholder

`settings-page-surface` requires no CSS definition — it acts as a semantic surface identifier, consistent with the operating surface naming convention used across the frontend consolidation branch.

---

## 5. Behavior Preserved Checklist

| Behavior | Status |
|---|---|
| `loadDurableSettings` | ✅ Unchanged — line 1087 |
| `fetchProjectTeam` | ✅ Unchanged — line 1096 |
| `fetchProjectGovernancePolicy` | ✅ Unchanged — line 1097 |
| Durable snapshot extraction | ✅ `extractDurableSettingsSnapshot` untouched |
| Default settings build / merge | ✅ `buildDefaultSettings`, `mergeSettings` untouched |
| Settings form editing | ✅ `bindFormEvents` untouched |
| Checkbox / list handling | ✅ Checklist event handling untouched |
| Section reset | ✅ `data-settings-action="reset-section"` untouched |
| Restore defaults | ✅ `data-settings-action="restore-defaults"` untouched |
| Review critical settings | ✅ `data-settings-action="review-critical"` untouched |
| Save all settings | ✅ `data-settings-action="save-all"` untouched |
| Save / sync into team / governance records | ✅ `saveProjectTeam`, `updateProjectGovernancePolicy` untouched |
| AI workspace open action | ✅ `data-settings-open-ai` + `navigateTo("ai-command")` untouched |
| AI prompt buttons | ✅ `data-settings-ai-prompt` untouched |
| Validation and risk summary behavior | ✅ `collectRisks`, `buildSummary` untouched |
| `data-settings-action` | ✅ All 4 values preserved |
| `data-settings-open-ai` | ✅ Preserved |
| `data-settings-ai-prompt` | ✅ Preserved |
| `data-setting-path` | ✅ All field bindings preserved — lines 1229–1414 |

---

## 6. Loading / Empty / Error / Populated State Confirmation

| State | Behavior | Surface Used |
|---|---|---|
| **Loading** | `loadDurableSettings` triggers `rerender` → `replacePage` → `buildPageMarkup` | `settings-page-surface` |
| **Empty / no project** | `render()` shows `panel panel-span-2 empty-box` — no old shell labels | Neutral panel, no old labels |
| **Error** | `session.error` surface renders via `buildPageMarkup` | `settings-page-surface` |
| **Populated** | Full surface renders via `buildPageMarkup` | `settings-page-surface` |

No state uses the old `settings-shell` or `settings-workspace` classes. All states use the same new surface family.

---

## 7. Confirmation: No Backend / API / Data / Index / Page-Standard Changes

| Guard | Confirmed |
|---|---|
| Backend not modified | ✅ |
| `data/projects` not modified | ✅ — `git status --short data/projects` = clean |
| API functions not changed | ✅ — `api.js` not touched |
| `fetchProjectTeam` not changed | ✅ |
| `fetchProjectGovernancePolicy` not changed | ✅ |
| `saveProjectTeam` not changed | ✅ |
| Governance policy saving / bridge behavior not changed | ✅ |
| Route id not changed | ✅ — `id: "settings"` |
| Response shapes not changed | ✅ |
| No new mutations added | ✅ |
| Governance / Operations unaffected | ✅ — no other page touched |
| `page-standard.js` not modified | ✅ |
| `index.html` load order not changed | ✅ |

---

## 8. Validation Results

### Syntax checks

```
node --check public/control-center/pages/settings.js   → OK
node --check public/control-center/api.js              → OK
node --check public/control-center/app.js              → OK
node --check public/control-center/router.js           → OK
```

### Label grep confirms

Old labels absent:
- `Settings Overview` — 0 matches
- `Control Actions` — 0 matches
- `Settings AI Assistant` — 0 matches
- `Settings Summary` — 0 matches
- `settings-shell` — 0 matches
- `settings-workspace` — 0 matches

New labels present:
- `Settings command center` — line 1507
- `Configuration signals` — line 1513
- `Settings AI assistant` — lines 1559–1560
- `Settings summary` — line 1614
- `Settings actions` — line 1670
- `settings-page-surface` — lines 1688, 1897

Behavior hooks confirmed:
- `loadDurableSettings` — line 1087
- `fetchProjectTeam` — line 1096
- `fetchProjectGovernancePolicy` — line 1097
- `saveProjectTeam` — line 1744
- `navigateTo("ai-command")` — lines 1832, 1844
- All `data-settings-action` / `data-settings-open-ai` / `data-settings-ai-prompt` / `data-setting-path` — present

### Git diff

```
public/control-center/pages/settings.js | 33 ++++++++++++------------------
1 file changed, 14 insertions(+), 19 deletions(-)
```

Settings.js only. No other files changed. `data/projects` clean.

---

## 9. Remaining Work

| Item | Priority | Notes |
|---|---|---|
| `settings-page-surface` CSS definition (if needed) | Low | Currently no CSS needed — surface is a semantic container only. Defer until visual layout pass. |
| Right rail as true right-column layout | Low | `renderSummary` is now rendered but stacks vertically. A CSS grid or flex layout pass (separate step) can move it to a true right rail without changing this JS. |
| `renderSection` function (dead code) | Low | `renderSection` is defined but not called — it was the pre-grouped section renderer. Can be retired in a future dead-code cleanup step. |
| `renderActions` / `renderSummary` visibility during initial `refreshSummary` | Low | `refreshSummary` now updates `.settings-summary` in addition to `.settings-overview` and `.settings-ai-assistant`. Confirm integration in browser after full frontend wiring. |

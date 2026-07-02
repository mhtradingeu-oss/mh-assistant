# Settings Step 1 — UX Contract and Legacy Structure Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Drafted from terminal scan

## 1. Executive Summary

Settings is the highest-priority remaining System page cleanup target.

The page currently uses a local custom layout:

- `settings-shell`
- `settings-workspace`
- `Settings Overview`
- `Control Actions`
- `Settings AI Assistant`
- `Settings Summary`

This creates a layout-authority ambiguity because Settings is part of the Page Standard route model while also rendering a full local shell.

Decision: Settings should be migrated toward the standard operating-surface model, while preserving all durable settings behavior.

Target model:

- Page Header
- System Signal Bar
- Main View
- Right Rail
- Action Panel
- AI Panel

## 2. Current Runtime Structure

Current Settings runtime is owned by:

- `public/control-center/pages/settings.js`

Current shell/template signals:

- `settingsRoute.id = "settings"`
- `data-page="settings"`
- route template renders `<div class="settings-shell"></div>`
- populated render uses `<div class="settings-shell settings-workspace">`

Current local sections:

- Settings Overview
- Settings sections / groups
- Settings Summary
- Control Actions
- Settings AI Assistant

## 3. Current Behavior That Must Be Preserved

Settings behavior must remain unchanged during future layout-only patching.

Must preserve:

- durable settings loading
- `loadDurableSettings`
- `fetchProjectTeam`
- `fetchProjectGovernancePolicy`
- durable snapshot extraction
- default settings build/merge
- settings form editing
- checkbox/list handling
- section reset
- restore defaults
- review critical settings
- save all settings
- save/sync into team/governance records
- AI workspace open action
- AI prompt buttons
- validation and risk summary behavior
- loading, error, empty, and populated states

## 4. Current Action Inventory

Current Settings action attributes include:

- `data-settings-action="save-all"`
- `data-settings-action="restore-defaults"`
- `data-settings-action="review-critical"`
- `data-settings-action="reset-section"`
- `data-settings-open-ai`
- `data-settings-ai-prompt`
- `data-setting-path`

These attributes must not be renamed in the first layout-only patch.

## 5. Current API Usage

Settings currently depends on:

- `fetchProjectTeam(projectName)`
- `fetchProjectGovernancePolicy(projectName)`
- `saveProjectTeam(projectName, payload)`
- governance policy saving/bridge behavior through Settings payload mapping

No API contract should be changed in the layout patch.

## 6. Target Settings Operating Surface

### Page Header

Purpose:

- Identify Settings as the system configuration center.
- Show project context.
- Avoid duplicating local shell headings.

Recommended clean label:

- `Settings command center`

### System Signal Bar

Purpose:

- Show configuration status, risk, critical gaps, saved state, governance/team sync status.

Should replace or absorb the current Settings Overview metrics.

### Main View

Purpose:

- Render all settings groups and fields.
- Preserve current group/section order.
- Preserve form field IDs, data paths, and edit behavior.

### Right Rail

Purpose:

- Render Settings Summary.
- Render risk list.
- Render saved status and critical gaps.

### Action Panel

Purpose:

- Save Settings
- Restore Defaults
- Review Critical Settings
- Reset Section actions where relevant

Current `data-settings-action` values must be preserved.

### AI Panel

Purpose:

- Open AI Workspace
- Settings AI prompts
- AI recommendations based on current configuration risk

Current `data-settings-open-ai` and `data-settings-ai-prompt` must be preserved.

## 7. Mapping From Old Layout To New Zones

| Current Settings Area | Target Zone |
|---|---|
| Settings Overview | Page Header + System Signal Bar |
| Settings groups/fields | Main View |
| Settings Summary | Right Rail |
| Control Actions | Action Panel |
| Settings AI Assistant | AI Panel |
| Risk list | System Signal Bar + Right Rail |
| Saved status | System Signal Bar + Right Rail |

## 8. Loading / Empty / Error / Populated Contract

Future Settings layout-only patch must ensure all states use the same surface family.

Required:

- loading state must not show old `settings-shell` as a separate visual language
- error state must render inside the new Settings operating surface
- empty/default state must use the same shell/zone model
- populated state must use the same zone model
- no old/new visual shift during load

## 9. Page Standard Decision

Settings should remain a standard System page and move toward the standard operating-surface model.

Preferred direction:

- Keep route id: `settings`
- Keep `data-page="settings"`
- Preserve Page Standard compatibility
- Gradually retire custom `settings-shell/settings-workspace` as visual authority
- Do not remove behavior or data attributes

If future implementation proves Page Standard wrapping creates conflicts, an explicit exception must be documented before changing route eligibility.

## 10. Safety Rules For Step 2

Next runtime patch must follow:

- do not modify backend
- do not modify data/projects
- do not change API function names
- do not change endpoint paths
- do not change route id
- do not change response shapes
- do not rename data attributes used by listeners
- do not remove settings actions
- do not change save/sync behavior
- do not change AI navigation behavior
- do not touch unrelated pages
- prefer modifying only `public/control-center/pages/settings.js`
- CSS edits only if strictly required and scoped to Settings

## 11. Step 2 Layout-Only Patch Plan

Step 2 should:

1. Replace visible old labels:
   - `Settings Overview`
   - `Control Actions`
   - `Settings AI Assistant`
   - `Settings Summary`

2. Use clean labels:
   - `Settings command center`
   - `Configuration signals`
   - `Settings workspace`
   - `Settings summary`
   - `Settings actions`
   - `Settings AI assistant`

3. Restructure markup to read as:
   - Header / command center
   - System signal bar
   - Main settings form
   - Right rail summary
   - Action panel
   - AI panel

4. Preserve:
   - `data-settings-action`
   - `data-settings-open-ai`
   - `data-settings-ai-prompt`
   - `data-setting-path`
   - form field IDs
   - current event listeners
   - current load/save/sync behavior

## 12. Do Not Touch Yet

- Do not refactor storage/data mapping.
- Do not rename API wrappers.
- Do not change governance/team payloads.
- Do not remove Settings from REQUIRED_ROUTES.
- Do not change page-standard.js.
- Do not change index.html load order.
- Do not change other pages.

## 13. Validation Plan For Step 2

Run:

- `node --check public/control-center/pages/settings.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- grep for old labels
- grep for required data attributes
- `git status --short data/projects`

## 14. No-Change Confirmation

This Step 1 document is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No route changed.
No Settings behavior changed.

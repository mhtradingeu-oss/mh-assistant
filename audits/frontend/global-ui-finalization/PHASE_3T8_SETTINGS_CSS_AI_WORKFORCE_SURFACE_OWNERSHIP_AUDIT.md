# PHASE 3T.8 — Settings CSS / AI Workforce Configuration Surface Ownership Audit

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: ab10c04 Add page CSS ownership prioritization matrix

## Purpose
Audit Settings as the first page-specific CSS ownership target after 3T.7.

Settings is now confirmed as the correct surface for:
- AI employee/team configuration
- policies
- memory/data rules
- approval owners
- provider preferences
- agent setup defaults
- governance and workflow defaults

## Why This Exists
Phase 3T.6A confirmed Settings owns configuration, while AI Command owns daily AI employee work.

Before any UI polish, we need to understand Settings CSS ownership and whether it can support the Operating Intelligence configuration model without adding new pages.

## Evidence Summary

### Settings render / route map
Settings is an active top-level page.

Key render and behavior anchors include:
- durable settings loading
- grouped settings sections
- settings overview
- settings summary
- settings AI assistant
- settings actions
- form binding through `data-setting-path`
- backend-governed durable save
- AI guidance handoff buttons
- Governance navigation

The page is sizeable but manageable:
- `public/control-center/pages/settings.js` has approximately 2056 lines.

### CSS ownership findings
Settings is best classified as:

**hybrid_css_owned**

The main Settings CSS ownership is inside:
- `public/control-center/styles/12-pages.css`

The scan found dense Settings CSS blocks around:
- `[data-page="settings"] .settings-page-surface`
- `.settings-workspace-grid`
- `.settings-main-stack`
- `.settings-right-rail`
- `.settings-section`
- `.settings-group-grid`
- `.settings-field-block`
- `.settings-control`
- `.settings-choice-card`
- `.settings-toggle`
- `.settings-role-matrix`
- `.settings-overview`
- `.settings-summary`
- `.settings-actions`
- `.settings-ai-assistant`

The scan also indicates repeated Settings styling blocks inside `12-pages.css`, especially around:
- first Settings block approximately `2377–2952`
- second Settings block approximately `2959–3352`

This means Settings should not receive more CSS polish until ownership is cleaned or clearly consolidated.

### AI workforce / policy / memory / provider findings
Settings already supports the Operating Intelligence configuration model.

Current capabilities include:
- AI mode / AI behavior
- action policy
- AI tone / brand tone
- AI creativity / safety balance
- approval-required mode
- approval owners
- team permissions
- team service coverage
- role matrix
- integration access
- defaults access
- publishing approval-before-publish
- sync policy
- alert rules
- safety / claim checks
- legal and policy caution notes
- AI context guidance
- Governance handoff

Settings correctly states that:
- AI provides context and recommendations.
- Durable changes happen only through explicit Settings and Governance actions.
- Backend remains the authority for enforcement.

### Durable authority / safety finding
Settings has a hard confirmation before saving durable team and governance settings.

The confirmation explicitly states:
- the action saves team and governance settings
- settings affect team roles, approval behavior, publishing readiness, brand safety review, and admin override behavior
- the update is backend-governed and durable

This is correct and must be preserved.

### Existing audits/closeouts
Existing Settings-related evidence includes:
- `audits/frontend/settings/SETTINGS_FINAL_OPERATING_SURFACE_QA_CLOSEOUT.md`
- `audits/frontend/settings/SETTINGS_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md`
- `audits/frontend/settings/SETTINGS_STEP_1_UX_CONTRACT.md`
- `audits/frontend/settings/SETTINGS_STEP_2_LAYOUT_PATCH_AUDIT.md`
- `audits/frontend/settings/SETTINGS_VISUAL_BINDING_FORM_POLISH_AUDIT.md`
- `audits/frontend/settings/SETTINGS_VISUAL_BINDING_FORM_POLISH_PATCH.md`
- `audits/frontend/settings/SETTINGS_VISUAL_BINDING_DENSITY_POLISH_PATCH.md`
- `audits/frontend/safety/STEP_21A_SETTINGS_CRITICAL_SAVE_CONFIRMATION_AUDIT.md`
- `audits/frontend/safety/STEP_21C_SETTINGS_CRITICAL_SAVE_QA_CLOSEOUT.md`
- `audits/frontend/layout-authority/SETTINGS_AUTHORITY_PATCH_AUDIT.md`

## Risk Classification

| Risk | Level | Reason |
|---|---|---|
| CSS duplication / overlap | High | Settings has repeated dense blocks in `12-pages.css` |
| Functional mutation risk | Medium | Save action is durable, but confirmation-gated |
| Execution authority risk | Low-Medium | Settings configures execution behavior but does not execute daily AI work |
| Visual regression risk | Medium | Many fields, toggles, role cards, summaries, and AI assistant blocks |
| Product clarity risk | Medium | Settings owns AI workforce config, but should not become AI execution page |

## Decision
**B) Small Settings CSS ownership cleanup plan.**

Do not implement CSS changes yet.

Settings is ready for a targeted ownership cleanup plan, not broad redesign.

## Recommended Next Step
Proceed to:

**PHASE 3T.9 — Settings CSS Ownership Cleanup Plan**

Purpose:
- identify duplicate/repeated Settings CSS blocks inside `12-pages.css`
- decide canonical Settings CSS block
- preserve all current visual behavior
- avoid broad page redesign
- prepare a small CSS-only patch after approval

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Do not turn Settings into daily AI execution.
- Do not create a new AI Employees page.
- Do not create a new Agent Setup page.
- Preserve Settings as configuration authority only.
- Preserve backend-governed save confirmation.
- Preserve Governance handoff.
- Preserve AI guidance as review-only/context-only.

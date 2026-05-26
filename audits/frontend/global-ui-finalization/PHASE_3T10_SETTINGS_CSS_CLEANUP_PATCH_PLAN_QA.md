# PHASE 3T.10 — Settings CSS Cleanup Patch Plan + Browser QA Checklist

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: 68a2d83 Add Settings CSS ownership cleanup plan

## Purpose
Prepare the exact safe patch strategy and Browser QA checklist for a future Settings CSS-only cleanup.

## Why This Exists
Phase 3T.9 decided that Settings CSS should be consolidated inside `public/control-center/styles/12-pages.css`, but no CSS should be edited until exact allowed and forbidden operations are documented.

## Current Ownership
Settings CSS remains owned by:

- `public/control-center/styles/12-pages.css`

Known structure:
- Base block: `SETTINGS OPERATING SURFACE VISUAL BINDING`
- Density block: `SETTINGS OPERATING SURFACE VISUAL BINDING + DENSITY POLISH`

## Patch Strategy
The future patch must be CSS-only.

Allowed:
- merge exact duplicate declarations
- keep final computed values equivalent to current UI
- keep base block for structural defaults
- keep density block only for intentional compact overrides
- add comments separating base and density ownership
- remove accidental redundant declarations only when final computed style is preserved

Forbidden:
- no JS changes
- no HTML/class changes
- no backend/API changes
- no route additions
- no behavior changes
- no broad visual redesign
- no removal of Settings shared selectors without browser proof
- no changing save confirmation, Governance handoff, or AI guidance behavior

## Selectors Allowed For Conservative Review
These selectors may be reviewed for duplicate declarations:

- `.settings-page-surface`
- `.settings-workspace-grid`
- `.settings-main-stack`
- `.settings-right-rail`
- `.settings-section`
- `.settings-group-grid`
- `.settings-group-block`
- `.settings-group-head`
- `.settings-section-copy`
- `.settings-section-meta`
- `.settings-badge`
- `.settings-fields-grid`
- `.settings-field-block`
- `.settings-field-label`
- `.settings-control`
- `.settings-textarea`
- `.settings-choice-grid`
- `.settings-choice-card`
- `.settings-choice-card-body`
- `.settings-checklist`
- `.settings-chip`
- `.settings-toggle`
- `.settings-toggle-pill`
- `.settings-role-matrix`
- `.settings-role-card`
- `.settings-overview-item`
- `.settings-risk-panel`
- `.settings-actions-buttons`
- `.settings-toolbar`
- `.settings-ai-assistant`

## Selectors Forbidden To Remove In First Patch
Do not remove these in the first cleanup patch:

- `.quick-action-btn`
- `.simple-banner`
- `.governance-policy-block`
- `.governance-rule-list`
- `.governance-rule-item`
- `.settings-toggle-input:checked + .settings-toggle-pill`
- `.settings-toggle-input:focus-visible + .settings-toggle-pill`
- `.settings-choice-card input:checked + .settings-choice-card-body`
- responsive media query rules for Settings
- any selector used by `settings.js`

## Browser QA Checklist
After any future CSS cleanup patch, verify:

| Check | Result | Notes |
|---|---|---|
| Settings page opens without fatal error | TODO | |
| No console errors | TODO | |
| Overview cards remain readable | TODO | |
| Main settings sections remain readable | TODO | |
| Right rail remains aligned | TODO | |
| AI assistant panel remains readable | TODO | |
| Summary panel remains readable | TODO | |
| Save actions remain visible | TODO | |
| Role matrix remains readable | TODO | |
| Toggles remain clickable and visually clear | TODO | |
| Select fields remain readable | TODO | |
| Textareas remain readable | TODO | |
| Choice cards remain readable | TODO | |
| Focus-visible remains visible | TODO | |
| Mobile/narrow layout does not overflow | TODO | |
| Save confirmation still appears | TODO | |
| Cancel save prevents mutation | TODO | |
| Confirm save still proceeds | TODO | |
| Governance handoff still works | TODO | |
| AI prompt buttons remain review-only | TODO | |

## Decision
Ready to prepare a future CSS-only cleanup patch, but do not apply it in this phase.

## Recommended Next Step
Proceed to:

**PHASE 3T.11 — Settings CSS Cleanup Patch**

Only after user approval.

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Preserve Settings as configuration authority only.
- Preserve backend-governed save confirmation.
- Preserve Governance handoff.
- Preserve AI guidance as review-only/context-only.

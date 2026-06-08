# Setup International UX Upgrade Closeout

## Status

Complete. Safe implementation only. No commit made.

## Target Page / Files

- Page: Setup / Project Foundation
- Updated: `public/control-center/pages/setup.js`
- Not changed: `public/control-center/styles/12-pages.css`
- Created: `audits/frontend/global-design-system/page-ux-upgrades/SETUP_INTERNATIONAL_UX_UPGRADE_CLOSEOUT.md`

## Audit Basis

- `audits/frontend/global-design-system/global-frontend-truth-audit/SETUP_FOUNDATION_AUTHORITY_CLOSEOUT.md`
- `audits/frontend/global-design-system/global-frontend-truth-audit/GLOBAL_FRONTEND_AUTHORITY_MAP_FINAL_UX_READINESS_CLOSEOUT.md`
- `audits/frontend/global-design-system/final-browser-qa/FINAL_FRONTEND_BROWSER_QA_PLAN.md`
- `audits/frontend/global-design-system/final-browser-qa/FINAL_FRONTEND_BROWSER_QA_REPORT.md`
- `audits/frontend/global-design-system/page-ux-upgrades/setup-evidence/SETUP_PRE_CODEX_EVIDENCE.md`

## UX Issues Found

- Header did not immediately explain Setup as project foundation, backend-governed persistence, and preparation-only authority.
- Local draft, backend Save Setup, template application, and AI guidance needed clearer separation.
- Continue buttons used generic continuation language instead of naming destination ownership.
- Missing information and dependency gaps were grouped too broadly for an international operator to understand quickly.
- Validation copy could be read as a separate validation action even though the button uses the existing Save Setup path.
- AI helper copy needed stronger assurance that suggestions are local or handoff-only until saved through Setup.

## Changes Implemented

- Reframed page metadata and header around "Project Foundation" and "Guided Setup".
- Added a concise authority explainer near the top: Setup saves foundation data only and does not publish, approve, send, execute, upload assets, or connect providers.
- Clarified readiness labels from launch readiness to foundation readiness.
- Updated next-action guidance to distinguish required fields, Library-owned assets, Integrations-owned connectors, and backend Save Setup.
- Clarified local draft messages and AI suggestion messages so local changes are not confused with backend persistence.
- Renamed handoff buttons in visible copy to "Open Library for assets", "Open Integrations for connectors", "Open Campaign Studio for planning", and "Open AI Command for review".
- Improved missing information empty state and dependency gap heading.
- Clarified that "Save Setup and refresh" uses the same backend Save Setup path.
- Clarified business template copy: selection/application loads template defaults and guidance, but does not publish, connect, or execute.
- Clarified AI guidance panel as assistive only and not a backend mutation or execution surface.

## Authority Boundaries Preserved

- Route id `setup` preserved.
- Setup root `data-page="setup"` preserved.
- Existing save handlers and route handlers preserved.
- Existing backend setup save path preserved through `saveProjectSetup`.
- Existing payload behavior preserved through `buildSetupPersistencePayload`.
- Existing local draft functions preserved: `saveSetupDraft`, `loadSetupDraft`, `clearSetupDraft`.
- Existing required field and step logic preserved: `REQUIRED_FIELDS`, `STEP_DEFINITIONS`.
- Existing template controls preserved: `setupBusinessTemplateSelect`, `setupApplyTemplateBtn`.
- Existing route destinations preserved for Library, Integrations, Campaign Studio, Home, and AI Command.
- Existing AI helper behavior preserved as local fill or AI Command prompt preparation.

## Sensitive Items Not Touched

- No backend/API calls changed.
- No `saveProjectSetup` behavior changed.
- No `buildSetupPersistencePayload` behavior changed.
- No local draft storage behavior changed.
- No template apply behavior changed.
- No required field logic changed.
- No step definitions changed.
- No app/router behavior changed.
- No `data/projects` files touched.
- No unrelated pages touched.
- No CSS cleanup or legacy selector removal.
- No autonomous execution added.

## Validation Commands

```bash
node --check public/control-center/pages/setup.js
```

Recommended follow-up validation:

```bash
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff -- public/control-center/pages/setup.js
git status --short
```

## Browser QA Checklist

- Open Setup route and confirm page title/description frame it as Project Foundation.
- Confirm top authority note is visible within the first viewport.
- Confirm Save Setup appears as backend-governed persistence.
- Confirm Save local draft copy is clearly local-only.
- Confirm missing required fields show clear field-level actions.
- Confirm no-required-fields empty state instructs saving backend foundation data.
- Confirm template selection and Apply Template Defaults do not imply publish/connect/execute authority.
- Confirm AI guidance copy says suggestions are assistive only.
- Confirm AI helper buttons still fill local form fields or prepare AI Command prompt only.
- Confirm Continue/Open buttons route to Library, Integrations, Campaign Studio, and AI Command without changing destinations.
- Confirm Home readiness review route remains unchanged where available.
- Confirm no visual overflow on desktop and mobile widths.
- Confirm console has no runtime errors.

## Known Remaining Issues

- Browser QA was not run in this pass.
- Template apply behavior still follows the existing backend/API implementation; this patch only clarifies the visible UX and does not alter that contract.
- No scoped CSS was added, so final visual density should be checked in browser QA before further polish.

## Rollback Path

- Revert only the `public/control-center/pages/setup.js` copy/markup changes from this patch.
- Remove this closeout file if rolling back the upgrade documentation.
- No data migration, backend rollback, CSS rollback, route rollback, or API rollback is required.

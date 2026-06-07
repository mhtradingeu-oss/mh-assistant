# Patch 15 — Setup Foundation / Project Defaults Audit

## Status

Audit-only / no production change.

Setup is a high-impact project foundation surface. It controls local setup drafts, backend setup persistence, project readiness projection, business template selection, AI-assisted field preparation, and routing into Library, Integrations, Campaign Studio, Home, and AI Command.

## Production Decision

No production code was changed.

Reason:

- Setup can save project setup data through `saveProjectSetup`.
- Setup reloads project data after backend save through `reloadProjectData`.
- Setup stores local draft state through browser/local draft behavior.
- Setup patches frontend app state with `setupDraft`.
- Setup can apply AI-generated local field suggestions.
- Setup can apply business template local defaults.
- Setup routes operators to Library, Integrations, Campaign Studio, Home, and AI Command.
- Setup includes readiness, missing fields, missing assets, missing connectors, and critical gaps.
- Any future production change must preserve local-versus-backend boundaries and avoid changing project data behavior blindly.

## Current Active File

- `public/control-center/pages/setup.js`

## Existing Strengths

Confirmed current Setup capabilities:

- Smart Guided Setup route.
- Foundation Readiness header.
- Setup completion tracking.
- Required field completion tracking.
- Readiness signal tracking.
- Validation status.
- Guided setup steps.
- Missing field actions.
- Missing assets and connector visibility.
- Local draft save.
- Local draft reset.
- Backend Save Setup.
- AI-assisted local field drafting.
- AI Command setup context routing.
- Continue to Library.
- Continue to Integrations.
- Continue to Campaign Studio.
- Review readiness through Home.
- Business template panel.
- Business template apply button.
- Form autosave to local draft/state.
- Backend save with reloadProjectData.

## Backend / Durable Save Contract

Setup saves backend data through:

- `saveProjectSetup(projectName, payload)`

The payload is built through:

- `buildSetupPersistencePayload(values)`

After save, Setup calls:

- `clearSetupDraft(projectName)`
- `reloadProjectData(projectName)`

Important behavior:

- Project rename is not currently backend-supported.
- If `project_name` differs from the active project, Setup warns that the name remains local-only until rename support exists.

## Local Draft Contract

Setup supports local draft behavior through:

- `saveSetupDraft`
- `loadSetupDraft`
- `clearSetupDraft`
- `setupDraft` patched into frontend app state

Local draft paths include:

- Save Draft local only
- Reset Draft
- autosave after form input/change
- form state refresh without backend save

Local drafts must not be confused with durable backend setup save.

## AI Assistance Contract

Setup AI actions can fill local form fields and route context to AI Command.

AI actions include:

- positioning suggestion
- audience suggestion
- tone suggestion
- fill missing setup checklist
- AI Command prompt with missing fields

These actions modify local form fields or prepare AI context.

They do not save backend data automatically.

## Business Template Contract

Setup includes a business template selector and Apply Template button.

The template panel can show:

- template type
- requirements
- starter checklist

Template apply behavior must be audited separately before any production change because it may alter form defaults and launch priority expectations.

## Readiness / Validation Contract

Setup computes and displays:

- completion percent
- required fields complete
- missing required fields
- missing assets
- missing connectors
- critical gaps
- readiness status
- validation summary
- next safest setup action
- step-level readiness badges

These are projection and guidance outputs unless saved through backend setup save.

## Routing Contract

Setup can navigate to:

- Library
- Integrations
- Campaign Studio
- Home
- AI Command

These are navigation or context-preparation paths, not execution.

## Data Attribute Inventory

Observed Setup attributes:

- `data-setup-field`
- `data-setup-indicator-for`
- `data-setup-jump-field`
- `data-setup-jump-step`
- `data-setup-open-step`
- `data-setup-step`
- `data-setup-step-note`
- `data-setup-step-panel`

## Button / Handler Inventory

Key button IDs:

- `setupSaveBackendBtn`
- `setupSaveBackendBtnBottom`
- `setupSaveDraftBtn`
- `setupResetDraftBtn`
- `setupValidateNowBtn`
- `setupSmartActionBtn`
- `setupCompleteNowBtn`
- `setupRecommendedStepBtn`
- `setupPrevStepBtn`
- `setupNextStepBtn`
- `setupContinueLibraryBtn`
- `setupContinueIntegrationsBtn`
- `setupContinueCampaignBtn`
- `setupAiCommandBtn`
- `setupAiPositioningBtn`
- `setupAiAudienceBtn`
- `setupAiToneBtn`
- `setupAiFillMissingBtn`
- `setupReviewMissingBtn`
- `setupReviewReadinessBtn`
- `setupApplyTemplateBtn`

These IDs should not be changed without a dedicated implementation patch and browser QA.

## Backend / Durable Authority Boundary

Backend/durable paths:

- backend setup save
- setup persistence payload
- reload project data after save
- clearing local draft after successful backend save

## Frontend / Local Projection Boundary

Frontend/local paths:

- local draft save
- local draft reset
- form autosave
- app state setupDraft patch
- completion/readiness projections
- AI field suggestions
- AI Command prompt preparation
- template local defaults
- step navigation
- route navigation

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `saveProjectSetup`
2. `reloadProjectData`
3. `buildSetupPersistencePayload`
4. `saveSetupDraft`
5. `loadSetupDraft`
6. `clearSetupDraft`
7. `patchState`
8. `form.oninput`
9. `form.onchange`
10. `setupSaveBackendBtn`
11. `setupSaveBackendBtnBottom`
12. `setupSaveDraftBtn`
13. `setupResetDraftBtn`
14. `setupApplyTemplateBtn`
15. `setupAiFillMissingBtn`
16. `setupAiCommandBtn`
17. business template apply behavior
18. project rename warning behavior
19. required field validation
20. readiness and missing dependency calculations
21. continue navigation behavior
22. smart action behavior

## Recommended Future Patch

### Patch 15B — Setup Persistence / Template Contract Audit

Before any production patch, map exact fields and payload behavior:

- setup persistence payload
- local draft payload
- app state `setupDraft`
- backend save behavior
- reload behavior
- template apply behavior
- AI local field fill behavior
- AI Command context payload
- continue route behavior
- readiness calculation inputs
- required fields contract

Allowed scope:

- audit documentation only unless a very narrow copy guard is proven safe

Forbidden:

- no handler changes
- no API changes
- no save behavior changes
- no draft behavior changes
- no template behavior changes
- no AI fill behavior changes
- no route destination changes
- no project rename behavior changes
- no CSS
- no backend
- no data/projects

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/setup.js`
- route ID: `setup`
- `data-page="setup"`
- `#setupRoot`
- all setup data attributes
- all setup button IDs
- all form fields
- all local draft behavior
- all backend save behavior
- all reload behavior
- all AI local field behavior
- all AI Command routing behavior
- all continue route behavior
- all business template behavior
- all readiness calculations
- all backend/API behavior
- all project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/setup.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future Setup production patch:

- Open Setup.
- Confirm form renders.
- Edit fields and confirm typing/focus is stable.
- Confirm completion/readiness badges update.
- Save Draft locally.
- Reset Draft.
- Use AI field helpers.
- Open AI Command with Setup context.
- Continue to Library.
- Continue to Integrations.
- Continue to Campaign Studio.
- Save Setup only in a safe test project.
- Confirm backend save reloads project data.
- Confirm project rename warning remains accurate.
- Apply business template only in a safe test project if behavior is confirmed.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

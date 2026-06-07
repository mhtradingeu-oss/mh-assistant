# Patch 15B — Setup Persistence / Template Contract Audit

## Status

Audit-only / no production change.

This audit maps the Setup persistence, local draft, template, AI fill, readiness, required field, and route handoff contracts before any Setup production patch is considered.

## Production Decision

No production code was changed.

Reason:

- Setup builds and saves backend persistence payloads.
- Setup stores and clears local drafts.
- Setup patches frontend app state with setup draft data.
- Setup can fill local fields through AI helper actions.
- Setup can route context to AI Command.
- Setup can route operators to Library, Integrations, Campaign Studio, and Home.
- Setup contains required field and readiness logic.
- Setup includes business template selection and Apply Template behavior.
- Any future production change must preserve local-versus-backend boundaries, required field contracts, template behavior, and project rename limitations.

## Current Active File

- `public/control-center/pages/setup.js`

## Setup Persistence Contract

Setup builds backend persistence through:

- `buildSetupPersistencePayload(values)`

The persistence payload includes project foundation fields such as:

- `project_name`
- `project_type`
- `website_url`
- `launch_window`
- `brand_name`
- `brand_promise`
- `brand_voice`
- `offer_positioning`
- `visual_identity`
- `market`
- `language`
- `currency`
- `audience_primary`
- `audience_problem`
- `audience_geography`
- `primary_goal`
- `secondary_goal`
- `competitors`
- `differentiation`
- `social_channels`
- `operator_notes`

Setup saves backend data through:

- `saveProjectSetup(projectName, payload)`

After successful backend save, Setup calls:

- `clearSetupDraft(projectName)`
- `reloadProjectData(projectName)`

Project rename remains local-only until project rename support exists.

## Local Draft Contract

Setup supports local draft state through:

- `saveSetupDraft`
- `loadSetupDraft`
- `clearSetupDraft`

Setup also patches app state through:

- `patchState("data", { setupDraft: { project, values, updatedAt } }, { silent: true })`

Local draft behavior includes:

- local Save Draft
- local Reset Draft
- autosave after form input/change
- reload-free dashboard updates

Local drafts are not backend persistence.

## Form Read Contract

Setup reads form values through:

- `readSetupFormValues(form)`

It uses `FormData` and stores string values by field name.

Future changes must preserve field names because field names drive:

- required field validation
- payload building
- readiness calculation
- AI fill behavior
- step assignment
- backend setup payload

## Required Field Contract

Required fields currently include:

- `project_name`
- `project_type`
- `website_url`
- `brand_promise`
- `market`
- `language`
- `currency`
- `audience_primary`
- `primary_goal`
- `competitors`
- `social_channels`

These fields drive completion percent, missing field count, readiness status, smart actions, and recommended step selection.

## Guided Step Contract

Setup uses `STEP_DEFINITIONS` to group fields into wizard steps.

Step logic controls:

- active step
- previous/next navigation
- step badges
- recommended step
- missing field jump buttons
- field focus behavior

The step contract should not be changed without browser QA because it affects interaction stability.

## AI Local Field Contract

Setup AI helper actions include:

- `setupAiPositioningBtn`
- `setupAiAudienceBtn`
- `setupAiToneBtn`
- `setupAiFillMissingBtn`

These actions fill local form fields only and refresh the setup dashboard.

They do not save backend setup automatically.

## AI Command Routing Contract

Setup routes setup context to AI Command through:

- `setupAiCommandBtn`
- `quickCommandInput`
- `navigateTo("ai-command")`

The prompt includes missing setup fields and asks for setup completion guidance.

This is context routing only, not backend mutation.

## Business Template Contract

Setup exposes business template options:

- eCommerce / Products
- Artist / Singer
- Beauty Salon
- Real Estate
- Service Business
- Restaurant / Cafe
- Agency
- Local Business

The template panel includes:

- `setupBusinessTemplateSelect`
- `setupApplyTemplateBtn`
- `setupTemplateStatus`

Template apply behavior must remain explicit and should not silently persist backend project defaults unless separately implemented and approved.

## Continue / Route Contract

Setup can navigate to:

- `library`
- `integrations`
- `campaign-studio`
- `home`
- `ai-command`

These routes are navigation/context-preparation only.

They do not upload assets, connect providers, launch campaigns, or execute publishing.

## Readiness Contract

Setup calculates and displays:

- completion percent
- missing required fields
- required completed count
- readiness score
- readiness status
- missing assets
- missing connectors
- critical gaps
- validation summary
- next safest setup action
- dependency gap count

Readiness is projection/guidance unless saved through backend setup save.

## Button / Handler Inventory

Key IDs and handlers:

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
- `setupBusinessTemplateSelect`

## Data Attribute Inventory

Setup uses:

- `data-setup-field`
- `data-setup-indicator-for`
- `data-setup-jump-field`
- `data-setup-jump-step`
- `data-setup-open-step`
- `data-setup-step`
- `data-setup-step-note`
- `data-setup-step-panel`

These attributes are part of the wizard interaction contract.

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
- field completion projection
- readiness projection
- AI field fill
- AI Command prompt preparation
- template selection
- step navigation
- route navigation

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `buildSetupPersistencePayload`
2. `saveProjectSetup`
3. `reloadProjectData`
4. `saveSetupDraft`
5. `loadSetupDraft`
6. `clearSetupDraft`
7. `patchState`
8. `readSetupFormValues`
9. `REQUIRED_FIELDS`
10. `STEP_DEFINITIONS`
11. `setupSaveBackendBtn`
12. `setupSaveBackendBtnBottom`
13. `setupSaveDraftBtn`
14. `setupResetDraftBtn`
15. `setupApplyTemplateBtn`
16. `setupBusinessTemplateSelect`
17. `setupAiFillMissingBtn`
18. `setupAiCommandBtn`
19. continue route buttons
20. project rename warning behavior
21. required field validation
22. readiness calculations
23. field focus behavior
24. template apply behavior

## Recommended Future Patch

### Patch 15C — Setup Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- local draft versus backend save
- project name local-only rename limitation
- AI field suggestions versus backend persistence
- business template selection versus saved defaults
- readiness projection versus execution readiness
- continue routes as next-step navigation only

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- handler changes
- API changes
- save behavior changes
- draft behavior changes
- template behavior changes
- AI fill behavior changes
- route destination changes
- project rename behavior changes
- required field contract changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/setup.js`
- route ID: `setup`
- `data-page="setup"`
- `#setupRoot`
- all setup button IDs
- all setup data attributes
- all form field names
- all required fields
- all setup steps
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
- Review readiness through Home.
- Save Setup only in a safe test project.
- Confirm backend save reloads project data.
- Confirm project rename warning remains accurate.
- Apply business template only in a safe test project if behavior is confirmed.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

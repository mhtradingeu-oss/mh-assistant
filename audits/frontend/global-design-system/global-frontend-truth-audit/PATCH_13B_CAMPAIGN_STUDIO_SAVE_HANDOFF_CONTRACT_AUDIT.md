# Patch 13B — Campaign Studio Save / Handoff Contract Audit

## Status

Audit-only / no production change.

This audit maps the Campaign Studio save, handoff, intelligence, routing, dependency, and shared campaign bridge contracts before any Campaign Studio production patch is considered.

## Production Decision

No production code was changed.

Reason:

- Campaign Studio can save campaign drafts and planned campaign records.
- Campaign Studio can auto-persist campaign draft state.
- Campaign Studio can create durable handoffs to AI Command and downstream production surfaces.
- Campaign Studio reads live intelligence and learning data.
- Campaign Studio routes dependency review to Integrations, Library, or Insights.
- Campaign Studio has package-generation placeholder behavior.
- Any future production change must preserve save behavior, handoff destinations, payload shape, intelligence hydration, and destination-owned execution boundaries.

## Current Active File

- `public/control-center/pages/campaign-studio.js`

## Campaign Save Contract

Campaign Studio builds campaign records through:

- `buildCampaignRecordPayload(projectName, session)`

The payload includes:

- campaign id
- campaign name
- project name
- status
- source page
- campaign fields
- wave fields
- linked assets placeholder
- updated metadata

Campaign Studio saves records through:

- `saveProjectCampaign(projectName, payload)`

Save Draft uses the default draft payload.

Save Campaign Plan uses the same payload with:

- `status: "planned"`

When the backend returns a campaign id, Campaign Studio updates:

- `session.recordId`
- shared campaign record state

## Scheduled Persistence Contract

Campaign Studio can persist draft state after form input through:

- `scheduleCampaignPersistence(projectName, session, saveProjectCampaign)`

This path is debounced and preserves typing/focus by avoiding rerender on every keystroke.

The scheduled save path can update:

- `session.recordId`
- shared campaign record state

Errors are logged to console and do not block the operator.

## Shared Campaign Bridge Contract

Campaign Studio uses shared context through:

- `getSharedCampaignRecord`
- `setSharedCampaignRecord`
- `syncCampaignStudioBridge`
- `applyAiCampaignHandoff`

This allows campaign state to be reused across pages without requiring a full rerender or route rewrite.

## AI Command Handoff Contract

Campaign Studio sends context to AI Command through:

- `campaignAskAiBtn`
- `setSharedHandoff(projectName, "ai-command", handoff)`
- `createProjectHandoff(projectName, handoff)`
- `navigateTo("ai-command")`

The AI handoff includes:

- source page
- destination page
- prompt
- campaign id
- campaign name
- owner role
- review role
- service domain
- draft context
- linked campaign entity

AI Command receives review/planning context only. It does not publish, approve, send, or execute campaign destinations.

## Destination Route Handoff Contract

Campaign Studio creates route handoffs through:

- `persistCampaignRouteHandoff`

Destination routes include:

- `publishing`
- `content-studio`
- `media-studio`
- `ads-manager`

Each handoff includes:

- source page
- destination page
- source role
- destination role
- source service domain
- destination service domain
- linked campaign entity
- route hint
- campaign id
- campaign name
- draft context
- status available

These are destination-owned handoffs, not direct execution.

## Intelligence Hydration Contract

Campaign Studio loads intelligence through:

- `fetchProjectInsights(projectName)`
- `fetchProjectLearning(projectName)`

Hydration state is stored in:

- `session.intelligence.status`
- `session.intelligence.insights`
- `session.intelligence.learning`
- `session.intelligence.error`

Missing insight/learning responses can fall back to empty generated structures.

Intelligence affects:

- strategy guidance
- channel recommendations
- campaign readiness
- platform signals
- SEO opportunities
- paid signals
- publishing windows
- blocker analysis

## Dependency Routing Contract

Campaign Studio dependency review uses execution readiness to route operators:

- missing integrations → `integrations`
- missing assets → `library`
- otherwise → `insights`

This is navigation and review guidance only.

It does not connect integrations, upload assets, or mutate Insights.

## Package Generation Placeholder Contract

Campaign Studio can increment:

- `session.generatedPackages`

and display:

- “Campaign package drafted in this session. Backend export wiring can be connected next.”

This is a session placeholder and should not be confused with backend export, publishing, or execution.

## Button / Handler Inventory

Key button IDs:

- `campaignRefreshIntelligenceBtn`
- `campaignSaveDraftBtn`
- `campaignBuildPlanBtn`
- `campaignAskAiBtn`
- `campaignOpenContentStudioBtn`
- `campaignOpenMediaStudioBtn`
- `campaignOpenPublishingBtn`
- `campaignOpenAdsManagerBtn`
- `campaignReviewDependenciesBtn`
- `campaignReviewAssetsBtn`
- `campaignGeneratePackageBtn`

These IDs should not be changed without a dedicated implementation patch and browser QA.

## Backend / Durable Authority Boundary

Backend/durable or backend-adjacent paths:

- save campaign draft
- save campaign plan
- scheduled campaign persistence
- create durable handoff
- fetch insights
- fetch learning
- shared campaign record hydration

## Frontend Projection Boundary

Frontend/local paths:

- form editing
- session values
- channel mix display
- readiness display
- missing asset/integration display
- strategy guidance
- package counter
- dependency navigation
- shared handoff bridge
- AI prompt preparation

## Destination Ownership Boundary

Campaign Studio must remain a planning and routing surface.

Destination-owned responsibilities:

- AI Command owns AI review and planning.
- Publishing owns publishing preparation and gates.
- Content Studio owns content production and review.
- Media Studio owns media production and review.
- Ads Manager owns paid growth planning.
- Library owns source and asset readiness.
- Integrations owns connector readiness.
- Insights owns intelligence review.

Campaign Studio must not imply it directly publishes, sends, approves, exports, connects providers, uploads assets, or executes destination behavior.

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `saveProjectCampaign`
2. `buildCampaignRecordPayload`
3. `scheduleCampaignPersistence`
4. `persistCampaignRouteHandoff`
5. `createProjectHandoff`
6. `setSharedHandoff`
7. `setSharedCampaignRecord`
8. `syncCampaignStudioBridge`
9. `applyAiCampaignHandoff`
10. `fetchProjectInsights`
11. `fetchProjectLearning`
12. `startIntelligenceHydration`
13. `campaignSaveDraftBtn`
14. `campaignBuildPlanBtn`
15. `campaignAskAiBtn`
16. destination route buttons
17. dependency routing logic
18. package generation wording
19. intelligence refresh behavior
20. shared campaign record hydration

## Recommended Future Patch

### Patch 13C — Campaign Studio Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- save draft versus save planned campaign
- handoff versus direct execution
- AI review-only boundary
- destination-owned responsibilities
- package draft versus backend export
- dependency review navigation

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- handler changes
- API changes
- save behavior changes
- handoff behavior changes
- intelligence hydration changes
- route destination changes
- package/export behavior changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/campaign-studio.js`
- route ID: `campaign-studio`
- `data-page="campaign-studio"`
- `#campaignStudioRoot`
- all button IDs
- all form fields
- all save behavior
- all scheduled persistence behavior
- all handoff behavior
- all AI routing behavior
- all destination routing behavior
- all intelligence hydration behavior
- all dependency routing behavior
- all package generation behavior
- all backend/API behavior
- all project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/campaign-studio.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future Campaign Studio production patch:

- Open Campaign Studio.
- Confirm campaign form renders.
- Edit campaign fields.
- Confirm typing/focus is not broken.
- Save Draft only in a safe test project.
- Save Campaign Plan only in a safe test project.
- Open AI Command handoff.
- Open Publishing handoff.
- Open Content Studio handoff.
- Open Media Studio handoff.
- Open Ads Manager handoff.
- Review dependencies and confirm routing goes to Integrations, Library, or Insights as expected.
- Refresh Campaign Intelligence.
- Confirm package generation remains session-only unless backend export is explicitly implemented.
- Confirm no publish/send/approve/direct execution action appears.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

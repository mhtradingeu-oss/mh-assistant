# Patch 13 — Campaign Studio Authority / Handoff Surface Audit

## Status

Audit-only / no production change.

Campaign Studio is a high-value planning and handoff surface. It contains campaign draft saving, durable campaign record updates, intelligence hydration, AI handoff, Publishing handoff, Content Studio handoff, Media Studio handoff, Ads Manager handoff, Library dependency routing, and session/package generation behavior.

## Production Decision

No production code was changed.

Reason:

- Campaign Studio can save campaign drafts and planned campaign records.
- Campaign Studio reads live intelligence through Insights and Learning APIs.
- Campaign Studio can create durable handoffs to AI Command and other production destinations.
- Campaign Studio routes campaign context into Publishing, Content Studio, Media Studio, and Ads Manager.
- Campaign Studio can route missing dependency review to Integrations, Library, or Insights.
- Campaign Studio already has strong operating language and should not receive a blind copy/hierarchy patch before handoff/save contract review.

## Current Active File

- `public/control-center/pages/campaign-studio.js`

## Existing Strengths

Confirmed current Campaign Studio capabilities:

- Campaign planning surface.
- Campaign basics and launch waves.
- Channel mix guidance.
- Required asset checks.
- Execution readiness.
- Strategy guidance.
- Missing integration detection.
- Missing asset detection.
- Intelligence hydration from Insights and Learning.
- Save Draft.
- Build Plan.
- AI Command handoff.
- Publishing handoff.
- Content Studio handoff.
- Media Studio handoff.
- Ads Manager handoff.
- Library dependency review.
- Integrations dependency routing.
- Package generation placeholder.
- Shared campaign bridge.

## Authority / Risk Findings

The following require caution before any production change:

### 1. Campaign record save

Campaign Studio can call:

- `saveProjectCampaign`

This can save a campaign draft or planned campaign record.

### 2. Durable campaign planning state

Campaign Studio can update `session.recordId`, set shared campaign record state, and persist campaign route handoffs.

### 3. Handoff creation

Campaign Studio can call:

- `createProjectHandoff`

This creates durable handoffs to AI Command and destination pages.

### 4. Route handoffs

Campaign Studio can route campaign context to:

- `ai-command`
- `publishing`
- `content-studio`
- `media-studio`
- `ads-manager`

These are handoffs, not execution.

### 5. Intelligence hydration

Campaign Studio can fetch:

- `fetchProjectInsights`
- `fetchProjectLearning`

This means the page depends on live intelligence and learning data.

### 6. Dependency routing

Campaign Studio can route operators to:

- `integrations`
- `library`
- `insights`

based on missing integration or asset readiness.

### 7. Package generation placeholder

Campaign Studio can increment generated package state and show that backend export wiring can be connected later.

This should not be confused with actual export, publishing, or execution.

## Backend / Durable Authority Boundary

Backend/durable or backend-adjacent paths include:

- save campaign draft
- save planned campaign record
- create campaign handoff
- fetch project insights
- fetch project learning
- shared campaign record hydration
- persisted campaign route handoff

## Frontend Projection Boundary

Frontend projection/local paths include:

- form editing
- session values
- channel mix display
- readiness display
- missing asset/integration display
- strategy guidance
- package counter
- navigation routing
- shared handoff bridge
- AI prompt preparation

## Handoff Boundary

Campaign Studio handoffs should remain explicit and destination-owned:

- AI Command reviews and plans.
- Publishing owns publishing preparation and gate behavior.
- Content Studio owns content production/review.
- Media Studio owns media production/review.
- Ads Manager owns paid growth planning.
- Library owns source/asset readiness.
- Integrations owns connector readiness.
- Insights owns intelligence review.

Campaign Studio must not imply it publishes, sends, approves, or executes destination-owned behavior directly.

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `saveProjectCampaign`
2. `createProjectHandoff`
3. `fetchProjectInsights`
4. `fetchProjectLearning`
5. `persistCampaignRouteHandoff`
6. `scheduleCampaignPersistence`
7. `setSharedHandoff`
8. `setSharedCampaignRecord`
9. `syncCampaignStudioBridge`
10. `applyAiCampaignHandoff`
11. `buildCampaignRecordPayload`
12. `buildCampaignModel`
13. `startIntelligenceHydration`
14. `campaignSaveDraftBtn`
15. `campaignBuildPlanBtn`
16. `campaignAskAiBtn`
17. `campaignOpenPublishingBtn`
18. `campaignOpenContentStudioBtn`
19. `campaignOpenMediaStudioBtn`
20. `campaignOpenAdsManagerBtn`
21. `campaignReviewDependenciesBtn`
22. intelligence refresh behavior
23. dependency routing behavior
24. package generation wording

## Recommended Future Patch

### Patch 13B — Campaign Studio Save / Handoff Contract Audit

Before any production patch, map exact payloads and handoff destinations:

- campaign save payload
- planned status payload
- AI Command handoff payload
- Publishing handoff payload
- Content Studio handoff payload
- Media Studio handoff payload
- Ads Manager handoff payload
- dependency routing conditions
- intelligence hydration behavior
- shared campaign bridge behavior

Allowed scope:

- audit documentation only unless a very narrow copy guard is proven safe

Forbidden:

- no handler changes
- no API changes
- no save behavior changes
- no handoff behavior changes
- no intelligence hydration changes
- no route destination changes
- no package/export behavior changes
- no CSS
- no backend
- no data/projects

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/campaign-studio.js`
- route ID: `campaign-studio`
- `data-page="campaign-studio"`
- `#campaignStudioRoot`
- all campaign form behavior
- all save behavior
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
- Save Draft only in a safe test project.
- Build Plan only in a safe test project.
- Open AI Command handoff.
- Open Publishing handoff.
- Open Content Studio handoff.
- Open Media Studio handoff.
- Open Ads Manager handoff.
- Review Dependencies and confirm routing goes to Integrations, Library, or Insights as expected.
- Refresh Campaign Intelligence.
- Confirm no publish/send/approve/direct execution action appears.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.

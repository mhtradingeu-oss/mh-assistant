# Campaign Studio Premium Transformation Spec

Date: 2026-05-23

Status: Specification only. No implementation in this pass.

Target route: `campaign-studio`

Primary file: `public/control-center/pages/campaign-studio.js`

Related references:

- `audits/frontend/global-ui/GLOBAL_PREMIUM_PAGE_COMPOSITION_AUDIT.md`
- `audits/frontend/layout-authority/CAMPAIGN_STUDIO_AUTHORITY_PATCH_AUDIT.md`
- `docs/mh-os/MH_OS_PAGE_REGISTRY_AND_WORKFLOW_MAP.md`
- `docs/mh-os/MH_OS_PAGE_TO_AI_TEAM_HANDOFF_CONTRACT.md`

## Objective

Transform Campaign Studio from a form-heavy campaign planning page into the central premium launch command board for MH-OS.

The page should feel:

- premium
- cinematic
- AI-native
- executive
- operationally intelligent
- calm under complexity
- scan-friendly
- route-aware
- safe for production architecture

Campaign Studio should become the page where a user understands the campaign thesis, launch waves, channel strategy, blockers, AI strategist recommendation, and downstream execution path in one composed operating view.

## Non-Goals

Do not:

- change backend logic
- change routing
- change `saveProjectCampaign`
- change `createProjectHandoff`
- remove `disableStandardLayout: true`
- add libraries
- add decorative animation
- start Auto Mode
- add duplicate selectors
- create page-specific hacks outside the Campaign Studio surface
- relink legacy CSS
- change publish, ads, media, content, or workflow authority

Do:

- recompose the existing Campaign Studio information architecture
- preserve all current button IDs and action hooks
- preserve current campaign values and session behavior
- preserve downstream handoff routing
- make AI strategy, launch waves, readiness gates, and route-forward orchestration visually dominant

## Existing Authority Boundary

Campaign Studio is a custom surface route. It intentionally sets:

```js
disableStandardLayout: true
```

This must remain. Campaign Studio owns a complete campaign operating workspace:

- campaign persistence
- campaign readiness and blockers
- downstream handoff routing
- Content Studio handoff
- Media Studio handoff
- Publishing handoff
- Ads Manager handoff
- AI Command handoff

The premium transformation should not wrap Campaign Studio in the shared page standard. It should build a premium internal composition that aligns visually with the global shell while preserving custom route ownership.

## Current Surface Inventory

The current render is powered by `buildCampaignModel(state, session, values)` and exposes these core groups:

- `values`: campaign name, goal, type, market, dates, budget, product, audience, offer, channel plan, waves, asset checklist, execution notes.
- `intelligenceStatus`, `intelligenceError`, `hasLiveIntelligence`.
- `strategyGuidance`: angle, offer, audience, channels, next action.
- `channelMix`: organic, paid, support.
- `waves`: launch/education/conversion wave plans.
- `executionReadiness`: total blockers, missing assets, missing integrations, publishing blockers, ads blockers, tracking blockers, SEO blockers, approval blockers.
- `campaignAssetKeys`, `assetNextAction`, asset dependency rows.
- downstream route buttons for Content, Media, Publishing, Ads, dependencies, Library.
- AI strategist handoff through `campaignAskAiBtn`.
- save/build through `campaignSaveDraftBtn` and `campaignBuildPlanBtn`.

Current internal surface order:

1. Overview card.
2. Campaign Basics form.
3. Product / Audience / Channel Selection form.
4. Wave Planning card.
5. Campaign Outputs / Readiness card.
6. Campaign AI Assistant side card.

## Core Problem

The page has enough intelligence and operational context, but the visual hierarchy still says "fill out a campaign form."

The target must say:

"This is the campaign command board. Here is the thesis, the wave sequence, the launch gates, the strategist recommendation, and the execution pipeline."

## Target Experience Promise

Within the first viewport, the operator should know:

- what campaign is active
- what the campaign is trying to achieve
- whether launch is ready, at risk, or blocked
- what the strategist recommends next
- which wave is active or incomplete
- what gate blocks execution
- where the campaign will go next

The operator should not need to scroll through forms before understanding the campaign state.

## Target Composition

### 1. Campaign Command Header

Purpose: Replace the generic overview card with a cinematic executive campaign header.

Should contain:

- campaign name
- campaign goal
- market
- readiness state
- intelligence state
- open blocker count
- primary action: `Save campaign plan`
- secondary actions: `Save draft`, `Refresh intelligence`

Existing data:

- `values.campaignName`
- `values.campaignGoal`
- `values.market`
- `executionReadiness.status`
- `executionReadiness.total`
- `intelligenceStatus`
- `hasLiveIntelligence`

Existing handlers to preserve:

- `campaignBuildPlanBtn`
- `campaignSaveDraftBtn`
- `campaignRefreshIntelligenceBtn`

Composition rules:

- This surface should visually dominate the first viewport.
- It should not read as a dashboard metric card.
- The core statement should be a campaign operating thesis, not a label row.

Recommended visual language:

- wide, low-height command surface
- one strong campaign title
- quiet metadata chips
- one primary button
- one strategist recommendation teaser

### 2. Launch Thesis Board

Purpose: Show the strategic campaign direction before form details.

Should contain:

- recommended campaign angle
- offer focus
- audience emphasis
- channel emphasis
- recommended next action

Existing data:

- `strategyGuidance.angle`
- `strategyGuidance.offer`
- `strategyGuidance.audience`
- `strategyGuidance.channels`
- `strategyGuidance.nextAction`

Composition rules:

- Present as one cohesive strategy board, not five equal data rows.
- The next action should be visibly stronger than supporting strategy fields.
- Tie the board to the Strategist role.

AI-native requirement:

- Label this as Strategist guidance or Campaign Strategist recommendation.
- Include whether the guidance is live intelligence or draft-assisted.
- Do not imply autonomous execution.

### 3. Wave Timeline

Purpose: Make launch waves the primary campaign planning object.

Should contain:

- wave 1, wave 2, wave 3
- each wave status
- focus
- channels
- role hint
- missing inputs
- supporting asset suggestion

Existing data:

- `waves`
- `values.wave1Name`, `values.wave1Focus`, `values.wave1Channels`
- `values.wave2Name`, `values.wave2Focus`, `values.wave2Channels`
- `values.wave3Name`, `values.wave3Focus`, `values.wave3Channels`

Composition rules:

- Treat waves as a horizontal or stacked timeline, not independent form cards.
- Each wave should show a state: ready, needs input, blocked.
- Wave form fields should be editable inline or in an expanded detail area.
- Missing inputs should be shown as gate chips, not paragraph warnings.

Responsive behavior:

- Desktop: timeline can run horizontally or in a 3-column sequence.
- Tablet/mobile: timeline stacks with active/blocked wave first.

Motion readiness:

- Future motion can move a wave from draft -> ready -> routed.
- No implementation now.

### 4. Channel Mix And Execution Matrix

Purpose: Connect channel recommendations to launch readiness and downstream execution.

Should contain:

- organic recommendations
- paid recommendations
- support recommendations
- connected channel/platform state where available
- recommended budget relevance where available
- route targets for each channel group

Existing data:

- `channelMix.organic`
- `channelMix.paid`
- `channelMix.support`
- `connectedChannels`
- `platformSignals`
- `paidSignals`
- `publishingWindows`
- `seoOpportunities`

Composition rules:

- Do not render three disconnected recommendation boxes as the main experience.
- Present as a decision matrix: channel, confidence, role, blocker, destination.
- Paid channel recommendations should visually connect to Ads Manager.
- Organic/content channels should connect to Content Studio and Publishing.
- Media-dependent channels should connect to Media Studio.

### 5. Launch Readiness Gates

Purpose: Replace long blocker groups with an executive gate system.

Should contain gates for:

- Assets
- Integrations
- Publishing
- Ads
- Tracking
- SEO
- Approvals

Existing data:

- `executionReadiness.missingAssets`
- `executionReadiness.missingIntegrations`
- `executionReadiness.publishingBlockers`
- `executionReadiness.adsBlockers`
- `executionReadiness.trackingBlockers`
- `executionReadiness.seoBlockers`
- `executionReadiness.approvalBlockers`
- `executionReadiness.total`
- `assetNextAction`

Composition rules:

- Gates should read as a pre-flight launch checklist.
- Clear gates should compress.
- Blocked gates should expand or receive visual priority.
- The top blocker should determine the next recommended dependency route.

Safe action rules:

- Dependency routing is navigation/handoff only.
- Do not execute connector repairs, asset mutations, publish actions, or ads actions from this page.

Existing handlers to preserve:

- `campaignReviewDependenciesBtn`
- `campaignReviewAssetsBtn`

### 6. Execution Pipeline

Purpose: Show where the campaign goes next.

Pipeline:

Campaign Studio -> Content Studio -> Media Studio -> Publishing -> Ads Manager

This pipeline should also allow branch routing:

- Content Studio for copy and content package.
- Media Studio for creative, prompt, video, and media packages.
- Publishing for scheduling and final channel payloads.
- Ads Manager for paid strategy and creative test planning.
- Library for required campaign assets.
- AI Command for strategist review.

Existing handlers to preserve:

- `campaignOpenContentStudioBtn`
- `campaignOpenMediaStudioBtn`
- `campaignOpenPublishingBtn`
- `campaignOpenAdsManagerBtn`
- `campaignReviewAssetsBtn`
- `campaignAskAiBtn`

Composition rules:

- Route buttons should feel like an execution pipeline, not a quick-action list.
- Each destination should show what context will be carried.
- Each destination should show whether it is ready, gated, or recommended.

### 7. Campaign Detail Editor

Purpose: Preserve all form inputs without making forms the dominant page identity.

Fields to preserve:

- campaign basics
- dates and budget
- product focus
- product angle
- primary audience
- audience need
- channel plan
- offer headline
- offer detail
- audience stage
- asset checklist
- execution notes
- wave fields

Composition rules:

- Details should sit below the command board or inside expandable/edit sections.
- The first viewport should not be dominated by form rows.
- Required or missing fields should be surfaced through gates and wave states.

Implementation-safe option:

- Keep the same `<form id="campaignStudioForm">`.
- Reorder the form internally.
- Preserve field names and IDs generated by `renderField`.
- Use progressive panels for "Edit Campaign Details", "Edit Audience And Offer", and "Edit Wave Inputs".

## Proposed Page Layout

Desktop structure:

1. Campaign Command Header.
2. Two-column command board:
   - main: Launch Thesis Board + Wave Timeline.
   - rail: Strategist Panel + Launch Readiness Gates.
3. Channel Mix And Execution Matrix.
4. Execution Pipeline.
5. Campaign Detail Editor.
6. Asset Dependency Detail and advanced notes.

Mobile structure:

1. Campaign Command Header.
2. Next action and readiness state.
3. Wave Timeline.
4. Readiness Gates.
5. Execution Pipeline.
6. Campaign Detail Editor.
7. Channel detail and asset dependency detail.

## Visual Hierarchy Rules

Top-level weight order:

1. Campaign name and goal.
2. Readiness and next action.
3. Wave timeline.
4. Strategist recommendation.
5. Launch gates.
6. Execution pipeline.
7. Channel and asset details.
8. Raw form fields.

Avoid:

- equal-weight cards for everything
- generic card labels like "Define" as primary visual language
- dashboard-style metric grids as the main hero
- long repeated `data-row` stacks in the first viewport
- giant form grids before strategy and readiness

Use:

- command surface
- timeline
- gate states
- route pipeline
- compact evidence chips
- progressive details

## AI Operating Requirements

Campaign Studio should expose the Strategist as an operating partner.

Required visible states:

- Strategist recommendation.
- Live intelligence vs draft-assisted state.
- Top reason for the next action.
- Clear "review with AI" action.
- Safe handoff language.

AI safety copy should communicate:

- AI reviews and prepares strategy.
- AI does not launch, publish, approve, or mutate external platforms.
- Execution happens in owning workspaces with confirmation.

Existing AI handoff behavior should remain based on:

- `campaignAskAiBtn`
- `source_page: "campaign-studio"`
- `modeId: "strategist"`
- route suggestions to downstream surfaces

## Data Mapping To New Surfaces

| New surface | Existing source |
| --- | --- |
| Campaign Command Header | `values`, `executionReadiness`, `intelligenceStatus`, `hasLiveIntelligence` |
| Launch Thesis Board | `strategyGuidance` |
| Wave Timeline | `waves`, `values.wave*` |
| Channel Matrix | `channelMix`, `connectedChannels`, `platformSignals`, `paidSignals`, `seoOpportunities` |
| Launch Gates | `executionReadiness`, `assetNextAction`, `missingAssets`, `missingIntegrations` |
| Execution Pipeline | existing route buttons and `CAMPAIGN_ROUTE_ROLES` |
| Strategist Panel | `strategyGuidance`, `hasLiveIntelligence`, existing AI handoff payload |
| Detail Editor | existing `renderField` fields and `campaignStudioForm` |

## Required DOM Preservation

The first implementation should preserve these IDs:

- `campaignStudioRoot`
- `campaignStudioForm`
- `campaignRefreshIntelligenceBtn`
- `campaignSaveDraftBtn`
- `campaignBuildPlanBtn`
- `campaignAskAiBtn`
- `campaignOpenPublishingBtn`
- `campaignReviewAssetsBtn`
- `campaignOpenContentStudioBtn`
- `campaignOpenMediaStudioBtn`
- `campaignOpenAdsManagerBtn`
- `campaignGeneratePackageBtn` if still present in listener wiring
- `campaignReviewDependenciesBtn`

Do not rename existing form field names.

## Interaction Model

### Primary Action

Default primary action:

`Save campaign plan`

Primary action should remain wired to `campaignBuildPlanBtn`.

### Secondary Actions

- Save draft.
- Refresh campaign intelligence.
- Review with AI Strategist.

### Contextual Route Actions

- Send to Content Studio.
- Send to Media Studio.
- Send to Publishing.
- Send to Ads Manager.
- Review campaign assets in Library.
- Review dependencies.

### Gate-Driven Routing

If a gate is blocked:

- asset gate routes to Library.
- integration gate routes to Integrations.
- publishing gate routes to Publishing.
- ads gate routes to Ads Manager.
- tracking gate routes to Integrations or Insights, depending on existing dependency logic.
- SEO gate routes to Research or Insights if existing logic supports it.
- approval gate routes to Governance only if existing route and handoff contract are already in place.

Do not create new routes as part of this transformation.

## CSS Strategy

Use a scoped Campaign Studio composition layer.

Allowed selector direction:

- `[data-page="campaign-studio"] .campaign-command-board`
- `[data-page="campaign-studio"] .campaign-launch-thesis`
- `[data-page="campaign-studio"] .campaign-wave-timeline`
- `[data-page="campaign-studio"] .campaign-readiness-gates`
- `[data-page="campaign-studio"] .campaign-execution-pipeline`
- `[data-page="campaign-studio"] .campaign-detail-editor`

Avoid:

- duplicate `.card` definitions
- global button overrides
- modifying page-standard styles
- broad selectors like `.campaign-card` without page scope if collision risk exists
- inline styles

Reuse:

- global tokens
- existing `.btn`
- existing badge/status tone patterns
- existing form controls
- existing card primitives only where they do not create nested-card clutter

## Motion Readiness

Do not implement motion in the first transformation.

Mark state hooks so future motion can be added for:

- intelligence refreshing -> loaded
- blocker count changing
- wave state changing
- gate blocked -> clear
- campaign plan saved
- handoff prepared
- route destination becoming recommended

Motion should communicate state and direction only. No decorative motion.

## Responsive Requirements

Desktop:

- first viewport must show command header, strategy/next action, and at least part of wave timeline or readiness gates.
- no horizontal overflow.
- pipeline actions must remain visible without wrapping into unreadable buttons.

Tablet:

- command board should become one main column plus compact rail.
- gate states and pipeline should remain above raw form details.

Mobile:

- campaign name, readiness, next action, and primary action must appear before all form details.
- route pipeline should become stacked destination rows.
- form sections should be collapsed or clearly separated.
- touch targets must remain usable.

## Accessibility Requirements

- Keep form labels associated with inputs.
- Preserve semantic button elements.
- Use headings in logical order.
- Gate states should not rely on color alone.
- Timeline steps need text states.
- AI safety state should be visible as text, not only iconography.

## Implementation Phases

### Phase 1: Composition Skeleton

Goal: Reorder existing surfaces into the premium command-board hierarchy.

Work:

- Add Campaign Command Header.
- Add Launch Thesis Board.
- Promote Wave Timeline above raw forms.
- Add Readiness Gates summary.
- Keep existing forms and buttons.

No handler changes.

### Phase 2: Execution Pipeline

Goal: Replace quick-action feel with route-forward orchestration.

Work:

- Recompose existing route buttons into pipeline steps.
- Show carried context per destination.
- Tie gates to recommended routes.

No route changes.

### Phase 3: Detail Editor Compression

Goal: Reduce form-dominant feel.

Work:

- Move campaign basics, audience/offer, and wave fields into progressive editor zones.
- Preserve field IDs/names.
- Surface missing required fields through gates and wave states.

No persistence changes.

### Phase 4: Premium Polish

Goal: Tighten visual rhythm and premium atmosphere.

Work:

- Reduce same-weight cards.
- Normalize spacing and hierarchy.
- Remove visible generic section language.
- Improve empty/loading/error presentation.
- Add future motion state attributes only if useful.

No animation implementation.

## Acceptance Criteria

The transformation is successful when:

- The page still loads on `#campaign-studio`.
- `disableStandardLayout: true` remains.
- Campaign save/build behavior is preserved.
- Downstream handoff routing is preserved.
- Existing button IDs still work.
- Existing form field names and values still persist.
- No backend files are changed.
- No routes are changed.
- No duplicate selectors or global CSS overrides are added.
- First viewport communicates campaign state, readiness, next action, and wave plan.
- Forms no longer dominate the first scan.
- AI Strategist guidance is visible and clearly draft/review only.
- Launch gates are visible and route-safe.
- Execution pipeline makes downstream movement obvious.
- Mobile view has no horizontal overflow.

## Validation Plan

After implementation, run:

```bash
node --check public/control-center/pages/campaign-studio.js
node ../../scripts/verify-control-center-ui.js
```

If CSS is changed, manually verify:

- desktop viewport
- tablet viewport
- mobile viewport
- selected project with partial data
- selected project with no campaign
- partial intelligence failure state
- blocked readiness state
- clear readiness state

Also verify with manual interaction:

- refresh intelligence
- save draft
- save plan
- send to AI Command
- send to Content Studio
- send to Media Studio
- send to Publishing
- send to Ads Manager
- review assets
- review dependencies

## Risks

- Reordering form sections can accidentally break field listener assumptions if IDs or names change.
- Moving buttons can break query selectors if IDs are duplicated or removed.
- Over-compressing forms may hide required inputs.
- Making gates too dominant may overstate authority if they imply automatic fixing.
- Adding local scoped styles inside JS would continue page-in-page styling drift.

Mitigation:

- Preserve IDs.
- Preserve form names.
- Keep buttons as real buttons with current IDs.
- Add CSS in the existing active CSS stack, scoped by `[data-page="campaign-studio"]`.
- Implement in small phases.
- Validate after each phase.

## Final Target Statement

Campaign Studio should become the MH-OS launch command board:

The user sees the campaign thesis, the strategist recommendation, the launch wave sequence, the readiness gates, and the execution pipeline before they see raw form machinery. The page remains safe, route-owned, and backend-compatible, but it feels like an intelligent campaign operating system rather than a campaign setup form.

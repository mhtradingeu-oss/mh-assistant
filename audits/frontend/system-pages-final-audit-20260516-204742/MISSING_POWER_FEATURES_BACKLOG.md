# Missing Power Features Backlog

## AI Handoff Gaps

P0/P1:
- Make AI Command consume durable shared handoffs in active render, or require all sender pages to set `quickCommandInput`.
- Fix Content Studio -> AI Team so Writer context appears in composer.
- Fix Media Studio -> AI Team so Media Director / Video Lead context appears in composer.
- Fix Publishing -> AI Team so Publisher context appears in composer.
- Resolve `researcher` specialist mismatch.
- Make generic Open AI buttons preload page-specific context in Operations, Governance, Settings, Insights, and Research.

## Page Routing Gaps

P0:
- Resolve `operations-centers` missing route.

P1:
- Add Publishing -> Queue Center, Job Monitor, Notification Center routes.
- Add Governance -> Task Center follow-up route.
- Add Ads Manager -> Campaign Studio, Content Studio, Media Studio routes.
- Add Integrations -> Workflows/Task Center repair route.
- Add Library -> Content Studio / Media Studio selected-asset routes.

## UX Clarity Gaps

P1:
- Distinguish local-only planning edits from durable backend saves in Ads Manager.
- Distinguish draft/local publishing actions from backend-governed publish actions in Publishing.
- Add confirmation for Governance decisions.
- Clarify Setup AI helpers as local draft suggestions or central AI Team reviews.

P2:
- Improve route button labels by using action language: "Review with AI Team", "Send to Publisher", "Monitor in Job Monitor".
- Replace generic "Navigate:" labels in Insights with destination actions.

## Tool / Action Gaps

P1:
- Library selected asset should support: Send to Media Director, Use in Content Studio, Review with Compliance.
- Ads Manager should save an ad plan or create tasks/handoffs.
- Governance should create task follow-ups from selected decisions.
- Campaign Studio should create campaign tasks from launch plan.

P2:
- Setup should create setup completion tasks.
- Research should create research execution tasks.
- Operations generic Open AI should be selected-item aware.

## Data / API Wiring Gaps

P1:
- `fetchProjectOperationsSchema()` exists in `api.js` but is not passed through app render context.
- Direct API imports in pages make dependency ownership less visible in `app.js`.
- AI handoff payloads should include a consistent `id` only when they are durable records, or AI Command should accept non-durable shared handoffs.

P2:
- Normalize page handoff payload shape: `source_page`, `destination_page`, `source_role`, `destination_role`, `payload.prompt`, `payload.draft_context.modeId`, `status`.

## Responsive / Layout Gaps

P1:
- Run visual screenshot validation for AI Command, Library, Content, Media, Publishing, Governance, Integrations, and Operations pages at desktop/tablet/mobile.

P2:
- Reduce card density in long pages where right rails and tables compete.
- Verify table scroll behavior in Operations, Governance, Insights.
- Verify drawer behavior in Integrations.
- Verify Library preview/action panel at narrow widths.

## Planned Backend Dependencies

P1:
- Customer Operations page/actions should remain read-only or draft/review until backend actions are explicitly safe.
- Ads Manager durable ad plan and task APIs should be clarified before presenting it as executable.
- Queue retry/approve/publish/remove, Job retry/cancel/restart, and Notification resolve/dismiss/delete are correctly deferred and should remain disabled until mutation safety pass.

## International / Professional Polish

P1:
- Standardize specialist labels and handoff language across all pages.
- Ensure language/market settings are used in AI prompts and page copy where relevant.
- Avoid unsupported action claims: no page should imply publish/send/reply/execute occurred unless backend confirms it.

P2:
- Add localized date/number/currency checks for Settings market/currency.
- Make "German market" helpers configurable by project language/market.
- Tighten copy so every page has one clear primary action and one clear next best action.


# Safe Upgrade Sequence

This sequence avoids mixing backend changes, Customer Operations work, and broad redesigns. Use one commit per page or small related group. Validate after each commit.

## P0 Critical

1. Fix Library pagination runtime hazard.
   - File: `public/control-center/pages/library.js`
   - Scope: Remove the stale `nextId` lookup/message in grid pagination handler or define it safely.
   - Validation: `node --check public/control-center/pages/library.js`; click grid pagination in browser.

2. Resolve `operations-centers` route.
   - Files: `public/control-center/router.js`, `public/control-center/pages/home.js`, `public/control-center/pages/ai-command.js`, optionally `operations-centers.js`
   - Scope options:
     - Add a registered Operations overview route, or
     - Change references to `task-center` with label "Open Task Center".
   - Required before patch: report route decision and confirm desired UX.
   - Validation: click Home "Open Operations"; route Customer Ops output from AI Command.

## P1 High

3. Standardize AI Team handoff bridge.
   - Files: `ai-command.js`, plus sender pages as needed.
   - Scope: Either invoke `applyDurableAiHandoff()` in active AI render and support local shared handoffs, or make all page AI buttons set `quickCommandInput`.
   - Pages to validate first: Content, Media, Publishing, Workflows, Insights, Research, Library, Setup, Home.
   - Validation: each page opens AI Command with the expected prompt and specialist selected.

4. Add Governance decision confirmations.
   - File: `governance.js`
   - Scope: Confirm approve/reject/request changes/escalate/override with item title, risk, backend effect.
   - Validation: `node --check`; manual cancel/confirm path.

5. Fix Research specialist semantics.
   - Files: `ai-command.js`, `workflows.js`
   - Scope option A: map `research` and `researcher` to `analyst`.
   - Scope option B: add Research Specialist with route `research`.
   - Validation: Workflows research handoff opens correct specialist.

6. Clarify Ads Manager durability.
   - File: `ads-manager.js`
   - Scope: Either label as planning-only or add safe durable task/handoff save using existing APIs.
   - Validation: budget/metric behavior is clearly local or saved.

7. Publishing route clarity.
   - File: `publishing.js`
   - Scope: Add "Open Queue Center", "Monitor Job", and "View Notifications" next actions; fix AI handoff if not already solved centrally.
   - Validation: routes work and labels distinguish draft/backend actions.

## P2 Medium

8. Page-specific AI prompt polish.
   - Operations split pages: generic Open AI should preload selected item context.
   - Settings: generic Open AI should preload settings summary.
   - Governance: generic Open AI should preload selected decision context.
   - Insights/Research: primary AI button should name Analyst/Research specialist.

9. Selected asset workflow polish.
   - Library: add selected-asset actions to Content Studio, Media Studio, Compliance/Governance, and AI Team.
   - Validation: selected context carries into destination.

10. Task creation routes.
   - Setup gaps -> Task Center.
   - Campaign launch plan -> Task Center.
   - Governance decision -> Task Center.
   - Research opportunity -> Task Center.

11. Screenshot/responsive validation.
   - Use desktop, tablet, mobile.
   - Pages: AI Command, Library, Content, Media, Publishing, Governance, Integrations, Operations.

## P3 Later

12. CSS modular cleanup.
   - Move page-specific blocks out of `12-pages.css` into scoped files.
   - Decide whether empty `styles/integrations/*.css` files should be populated or removed.

13. Legacy code cleanup.
   - Workflows old execution-loop helpers should be removed, isolated, or reactivated intentionally with tests.

14. Customer Operations read-only UI.
   - Do not touch stashes.
   - Add only after route model is decided.
   - Keep draft/review only until backend actions are explicitly governed.

## Validation After Each Patch

Run at minimum:

```bash
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/pages/<changed-page>.js
git diff --name-only
```

For AI handoff changes, manually verify:

- Source page button click.
- AI Command opens.
- Correct specialist selected.
- Composer contains expected context.
- Route suggestions point to registered routes.


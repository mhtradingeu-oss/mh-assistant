# 08 First Five Patches

## Patch 1: Sidebar Platform Reframe

Goal:

- Make the first visible navigation impression match an AI Business Operating System.

Allowed files:

- `public/control-center/index.html`
- Audit closeout file under `audits/frontend/global-design-system/global-frontend-truth-audit/`

Forbidden files:

- `public/control-center/router.js`
- `public/control-center/app.js`
- `public/control-center/pages/**`
- `public/control-center/api.js`
- `data/projects/**`
- backend/API files

Exact acceptance criteria:

- Only sidebar group labels/order change.
- Route IDs, `data-route`, `data-page`, button IDs, and button text for route names remain valid.
- All 20 active pages remain reachable.
- Active nav state still works.
- Mobile sidebar still opens/closes.

Browser QA checklist:

- Desktop and mobile sidebar render without overflow.
- Navigate to every active page.
- Confirm active nav styling follows route.
- Confirm topbar title updates.
- Confirm command bar and AI dock still work.

Risk level:

- Low functional, medium visual.

## Patch 2: Ads Manager Operating Language And Hierarchy

Goal:

- Make Ads Manager feel like a paid-growth command center instead of a dense card dashboard.

Allowed files:

- `public/control-center/pages/ads-manager.js`
- Existing scoped CSS only if selector evidence shows it is required, likely `public/control-center/styles/12-pages.css` or `14-page-standard.css`
- Audit closeout file

Forbidden files:

- `public/control-center/api.js`
- backend/API files
- publishing/campaign behavior files
- `data/projects/**`

Exact acceptance criteria:

- Remove user-facing "Section 1/4/5/6" style labels.
- Preserve all input IDs: `adsTotalBudgetInput`, `adsDailyBudgetInput`, `adsSpendInput`, `adsCtrInput`, `adsCpcInput`, `adsCpaInput`, `adsRoasInput`.
- Preserve navigation buttons and prompt handlers.
- Add one clear paid-growth next action.
- No budget, pacing, or metric calculation changes.

Browser QA checklist:

- Enter budget, daily budget, spend, CTR/CPC/CPA/ROAS and confirm recalculated UI still updates.
- Open Library and Publishing buttons still navigate.
- Prompt buttons still populate/route as before.
- Mobile layout has no horizontal overflow.

Risk level:

- Low-medium.

## Patch 3: Integrations Control Center Hierarchy

Goal:

- Make Integrations read as the platform connection and reliability layer.

Allowed files:

- `public/control-center/pages/integrations.js`
- `public/control-center/pages/integrations/**` only if needed for render labels
- Existing scoped CSS only with selector evidence
- Audit closeout file

Forbidden files:

- `public/control-center/api.js`
- backend connector routes
- access-key/protected write behavior
- `data/projects/**`

Exact acceptance criteria:

- Preserve connect/reconnect/test/sync/import/disconnect handlers.
- Preserve all integration IDs and `data-integration-*` attributes.
- Header clearly shows connection coverage, critical missing, sync state, and one next action.
- Drawer remains operable.
- Unsupported integrations remain accurately labeled.

Browser QA checklist:

- Open page with connected and unconnected states.
- Open connector drawer.
- Verify connect/test/sync buttons still bind.
- Verify no console errors.
- Verify mobile drawer usability.

Risk level:

- Medium-high because connector UI has many handlers.

## Patch 4: Workflows Operating Path And Destination Map

Goal:

- Make Workflows feel like repeatable operating playbooks that route safely to AI, Campaign, and Task Center.

Allowed files:

- `public/control-center/pages/workflows.js`
- Existing scoped CSS only with selector evidence
- Audit closeout file

Forbidden files:

- API files
- workflow execution backend
- command execution behavior
- `data/projects/**`

Exact acceptance criteria:

- Preserve workflow selection, prepare, AI, Campaign, and Task Center handoff behavior.
- Make review-only and handoff-only boundaries clearer.
- Show one primary next action based on selected workflow state.
- Destination map uses active routes and does not create new routes.

Browser QA checklist:

- Select workflow.
- Prepare current workflow.
- Open AI Workspace.
- Route to Campaign Studio.
- Route to Task Center.
- Confirm no silent execution.

Risk level:

- Medium-high.

## Patch 5: Customer Center Read-Only AI Handoff Clarity

Goal:

- Make Customer Center feel like customer intelligence and safe response operations, while preserving read-only boundaries.

Allowed files:

- `public/control-center/pages/customer-center.js`
- Existing scoped CSS only with selector evidence
- Audit closeout file

Forbidden files:

- customer backend/API behavior
- task/ticket mutation APIs
- notification mutation APIs
- `data/projects/**`

Exact acceptance criteria:

- Preserve read-only behavior.
- Preserve existing window refresh/handler hooks.
- No new send/reply/ticket mutation behavior.
- Add clear AI handoff language: summarize, draft, classify, escalate, but do not send.
- Show customer state, SLA/risk, and next safe action.

Browser QA checklist:

- Load Customer Center.
- Verify existing customer/ticket/SLA display still renders.
- Verify any AI handoff buttons route safely to AI Command or prepare prompt only.
- Confirm no destructive or send action appears.
- Confirm no console errors.

Risk level:

- Medium.

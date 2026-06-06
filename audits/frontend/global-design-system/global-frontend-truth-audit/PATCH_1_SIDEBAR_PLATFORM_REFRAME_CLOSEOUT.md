# Patch 1 Sidebar Platform Reframe Closeout

## Status

Implemented as a narrow `index.html` navigation structure patch.

No framework, CSS, backend/API, router, app runtime, page module, command execution, or project data changes were made.

## Touched Files

- `public/control-center/index.html`
- `audits/frontend/global-design-system/global-frontend-truth-audit/PATCH_1_SIDEBAR_PLATFORM_REFRAME_CLOSEOUT.md`

## Exact Navigation Grouping

Command:

- Home: `data-route="home"`, `data-page="home"`
- AI Command: `data-route="ai-command"`, `data-page="ai-command"`

Source & Setup:

- Setup: `data-route="setup"`, `data-page="setup"`
- Library: `data-route="library"`, `data-page="library"`
- Integrations: `data-route="integrations"`, `data-page="integrations"`

Build:

- Workflows: `data-route="workflows"`, `data-page="workflows"`
- Campaign Studio: `data-route="campaign-studio"`, `data-page="campaign-studio"`
- Content Studio: `data-route="content-studio"`, `data-page="content-studio"`
- Media Studio: `data-route="media-studio"`, `data-page="media-studio"`

Grow & Intelligence:

- Publishing: `data-route="publishing"`, `data-page="publishing"`
- Ads Manager: `data-route="ads-manager"`, `data-page="ads-manager"`
- Insights: `data-route="insights"`, `data-page="insights"`
- Research: `data-route="research"`, `data-page="research"`

Customers:

- Customer Center: `data-route="customer-center"`, `data-page="customer-center"`

Operations:

- Operations Overview: `data-route="operations-centers"`, `data-page="operations-centers"`
- Task Center: `data-route="task-center"`, `data-page="task-center"`
- Queue Center: `data-route="queue-center"`, `data-page="queue-center"`
- Job Monitor: `data-route="job-monitor"`, `data-page="job-monitor"`
- Notifications: `data-route="notification-center"`, `data-page="notification-center"`

Control:

- Governance: `data-route="governance"`, `data-page="governance"`
- Settings: `data-route="settings"`, `data-page="settings"`

## Preserved Contracts

- All route IDs are unchanged.
- All `data-route` values are unchanged.
- All `data-page` values are unchanged.
- All existing nav buttons remain `<button class="nav-item" type="button">`.
- Existing `is-active` default on Home remains.
- No nav click behavior changed.
- No route imports changed.
- No page modules changed.

## CSS Decision

No CSS changes were needed.

The existing `.nav-group`, `.nav-group-title`, and `.nav-item` classes already support the new visible grouping labels and reordered buttons.

## Validation Commands

Required validation:

```bash
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

Expected result:

- Node syntax checks pass.
- Diff includes only `public/control-center/index.html` and this closeout file.
- Git status shows only those two files changed/untracked.

## Browser QA Checklist

Manual QA recommended:

- Open Control Center.
- Confirm sidebar groups render in this order: Command, Source & Setup, Build, Grow & Intelligence, Customers, Operations, Control.
- Navigate to all active pages from the sidebar.
- Confirm active nav state follows the selected route.
- Confirm topbar eyebrow/title/description still update per page.
- Confirm Home remains active on first load.
- Confirm mobile sidebar opens, closes, and scrolls if needed.
- Confirm command bar still opens.
- Confirm floating AI dock still opens.
- Confirm no console errors are introduced.

## Risks

- Low functional risk because the patch only changes visible grouping and item order in existing static sidebar markup.
- Medium visual risk on smaller screens because there are more visible groups than before. Existing sidebar scrolling should handle this, but browser QA should confirm.

## Rollback Path

Revert `public/control-center/index.html` to the previous sidebar group labels and item order, then delete this closeout file.

No backend, API, router, app, page module, CSS, or project data rollback is required.

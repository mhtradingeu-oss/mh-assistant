# 01 Active Navigation And Page Map

## Router Model

`public/control-center/router.js` imports route objects from page modules and registers them in `routeRegistry`.

Route rendering flow:

1. `navigateTo(route)` calls `renderRouteTemplate(route)`.
2. `renderRouteTemplate(route)` gets the route definition, writes `routeDef.template` into `#pageRoot`, updates the topbar, and updates sidebar active state.
3. `app.js` supplies page render context and page render functions perform data binding and handlers.
4. Role access is resolved through `setRouteAccessResolver`, `getProjectedRoutePermissions`, and `getFallbackRouteAccess`.

This is a single-page, route-template architecture. It is not React, Vue, Svelte, or a generated framework.

## Active Sidebar Navigation

Navigation is declared directly in `index.html`.

Primary:

- Home: `home`
- Setup: `setup`
- Library: `library`
- Integrations: `integrations`
- AI Command: `ai-command`
- Workflows: `workflows`
- Publishing: `publishing`
- Insights: `insights`

Secondary:

- Campaign Studio: `campaign-studio`
- Content Studio: `content-studio`
- Media Studio: `media-studio`
- Ads Manager: `ads-manager`
- Research: `research`

Customer:

- Customer Center: `customer-center`

System:

- Operations Overview: `operations-centers`
- Task Center: `task-center`
- Queue Center: `queue-center`
- Job Monitor: `job-monitor`
- Notifications: `notification-center`
- Governance: `governance`
- Settings: `settings`

## Active Route Registry

Observed from `router.js`:

- `home`
- `ai-command`
- `workflows`
- `operations-centers`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`
- `campaign-studio`
- `content-studio`
- `media-studio`
- `publishing`
- `ads-manager`
- `insights`
- `research`
- `setup`
- `library`
- `customer-center`
- `integrations`
- `settings`
- `governance`

## Route Surface Pattern

Most route modules export:

- `id`
- `meta`
- `template`
- optional `disableStandardLayout`
- optional `render(context)`

Many high-value pages use `disableStandardLayout: true` and mount a custom root:

- Home: `#homeExecRoot`
- AI Command: `#ctrlRoomRoot`
- Library: `#libraryRoot`
- Integrations: `#integrationsRoot`
- Campaign Studio: `#campaignStudioRoot`
- Content Studio: `#contentStudioRoot`
- Media Studio: `#mediaStudioRoot`
- Publishing: `#publishingRoot`
- Ads Manager: `#adsManagerRoot`
- Insights: `#insightsRoot`
- Research: `#researchRoot`
- Governance: `.governance-shell`
- Settings: `.settings-page-surface`
- Operations routes: `.ops-shell`

Customer Center currently exposes a getter template that renders immediately with `renderCustomerCenter({})` and also installs window-level refresh/handler hooks.

## Platform Capability Map

Home:

- Executive operating state, readiness, blockers, next best action, AI team entry, operating path.

Setup:

- Project foundation, business template, readiness gaps, AI setup guidance, backend save plus local draft.

Library:

- Source-of-truth assets, upload, classify, readiness gaps, asset workspace, preview, asset actions, AI source bridge.

Integrations:

- Connector control center, platform domains, connection status, sync/test/import/reconnect/disconnect flows.

AI Command:

- AI Team specialists, chat/composer, output workspace, Tool Drawer, source selection, safe routing, review-ready handoffs.

Workflows:

- Repeatable workflow selection, preparation, AI support, task/campaign handoffs, review-only workflow packaging.

Publishing:

- Manual publishing control, queue, readiness, approval gates, schedule/reschedule/approve/publish/fail clients.

Insights:

- Cross-platform intelligence, performance, learning, optimization, recommendations, handoffs.

Campaign Studio:

- Campaign command board, waves, channel mix, required assets, live/draft intelligence, campaign save/handoff.

Content Studio:

- Draft generation, content records, source/provenance, SEO guidance, governance readiness, preview/versioning/routing.

Media Studio:

- Image/video/voice job drafts, prompt packs, creative readiness, provenance, Library saves, media package routing.

Ads Manager:

- Budget planning, platform readiness, pacing, creative mapping, core metrics, ad action prompts.

Research:

- Competitors, audiences, market trends, keywords, risks, opportunities, AI prompts, research handoff.

Customer Center:

- Read-only customer operations, inbox/ticket/SLA visibility, safe AI handoffs.

Operations Overview:

- Routing hub into task, queue, job, notification centers.

Task Center:

- Durable task review without silent task mutation.

Queue Center:

- Operational queue pressure and item routing without silent mutation.

Job Monitor:

- Job health, failures, retry risk, execution logs without silent job mutation.

Notifications:

- Alerts and unread state, with mark-read limited to notification read-state.

Governance:

- Approvals, policy violations, overrides, escalation, publishing gates, audit visibility, backend-governed policy.

Settings:

- Project defaults, AI behavior, publishing rules, approvals, sync behavior, governance.

## Navigation Strategy Finding

The route set is powerful but the sidebar grouping is still closer to "Primary / Secondary / Customer / System" than to an international AI Business Operating System. A safe future patch should only rename/reorder sidebar group labels after browser QA and without changing route IDs.

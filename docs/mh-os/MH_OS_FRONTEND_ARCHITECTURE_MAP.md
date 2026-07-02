# MH-OS Frontend Architecture Map

Status: Canonical
Created: 2026-05-17

## Frontend Identity

The Control Center frontend is the operating surface for MH-OS. It must behave as an operational workspace, AI-guided execution system, and context-aware application shell.

It must not become the backend authority layer. It must not recreate governance, route permissions, team model, approval ownership, workflow authority, or execution authority when backend projections exist.

## Shell Responsibilities

The shell, centered around `public/control-center/app.js`, owns app startup, global state hydration, project context, protected fetch/access-key flow, shell navigation, route-change handling, sidebar/topbar/page title updates, global messages/errors, command bar, AI dock, and projection of backend state into routes.

Shell code is high-risk because it touches many global listeners and route lifecycle behaviors. Shell work must be narrow, audited, and validated.

## Router Responsibilities

`public/control-center/router.js` owns route registration, route rendering, page header updates, access checks, active navigation state, and route-change notification.

The route registry currently includes:

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
- `integrations`
- `settings`
- `governance`

Do not add a route until search confirms it does not already exist.

## API Layer Responsibilities

`public/control-center/api.js` is the frontend API adapter layer. It should contain frontend calls to backend endpoints and preserve backend response contracts.

API changes must not change backend response shapes, weaken protected access, bypass project isolation, or create frontend-only authority. Any write/mutation call requires safety review.

## App / Router / API Relationship

- `app.js` coordinates state and calls route render functions.
- `router.js` maps route IDs to route modules and handles navigation.
- `api.js` wraps backend calls.
- Page modules render page-specific UI from state/context and call API helpers through established patterns.

No page should bypass this structure by creating hidden routes, unmanaged global listeners, or unreviewed direct backend calls.

## Page Ownership

Each page module owns its page render and page-local interactions. It does not own canonical business authority.

A page may own local view state, filters, sort, selection, tabs, local drafts before persistence, rendering of backend-projected data, safe navigation, and AI handoff preparation.

A page must not own canonical team roles, route permissions, governance truth, approval chains, publishing authority, workflow execution authority, CRM/customer reply execution authority, or backend persistence semantics beyond approved API calls.

## CSS Layering Principles

- Shared page patterns use `std-` classes.
- Page-specific classes use a page prefix and are scoped under `[data-page="route-id"]` where practical.
- Do not create generic class names such as `container`, `left`, `right`, or `wrapper` without a clear prefix.
- Do not duplicate an existing class with a different behavior.
- Do not patch layout by adding scattered late overrides unless the override is clearly named and audited.
- Responsive rules must prevent horizontal overflow and preserve assistant/dock bottom clearance.

## Route Registration Principles

Before adding or changing any route:

1. Search `router.js` and `public/control-center/pages/` for an existing route.
2. Search navigation markup for `data-route` and `data-page` references.
3. Confirm no existing composite route already covers the use case.
4. Confirm route access is backend-projected or safely falls back.
5. Add one route and one page concern per commit.
6. Run `node --check` on route, app, API, and touched page files.

## data-page Conventions

Every page root should use its route ID:

```html
<section class="page is-active" data-page="route-id">
```

`data-page` is used for page-scoped rendering, styling, and diagnostics. It must match the route ID unless there is a documented compatibility reason.

## Page Render Ownership

Each route module should export a route definition with `id`, `meta`, `template`, and `render(context)` when dynamic rendering is required.

Render functions should be deterministic projections from current state/context. Heavy intelligence, backend mutation, and new source-of-truth creation do not belong inside render paths.

## No Duplicate Route / Page / File Policy

Never create a second route for an existing page, a second page file for an existing workspace, a second CSS system for an existing shell/page standard, duplicate active DOM IDs, duplicate local role maps when backend projection exists, or duplicate source-of-truth documents outside the canonical docs set.

When the desired page seems missing, search first and document the result. If a route is planned but absent, mark it planned instead of inventing it during an unrelated task.

## Validation Requirements

For frontend-safe documentation or page work, minimum validation is:

```bash
git status --short
git diff --name-only
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/operations-centers.js
node --check public/control-center/router.js
node --check public/control-center/app.js
node --check public/control-center/api.js
node --check runtime/orchestrator-service/server.js
```

For page changes, additionally run `node --check` on every touched page file. For UX/layout changes, perform browser QA at desktop and mobile widths before calling the page final.

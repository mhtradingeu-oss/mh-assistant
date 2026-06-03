# PHASE 3AI.3 — Customer Center Frontend Route Safe Patch

## Status
Patch drafted; pending review and browser QA.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AI.2 — Customer Center Frontend Route Safe Patch Plan`
- Previous commit: `4e7638a Plan Customer Center frontend route safe patch`

## Scope
Add the first Customer Center read-only frontend route.

## Allowed
- Add one route: `customer-center`.
- Add one sidebar group: `CUSTOMER`.
- Add one page file: `public/control-center/pages/customer-center.js`.
- Use existing read-only Customer Operations API helpers.
- Render protected-read guard.
- Render empty states.
- Render disabled future actions with reasons.
- Add minimal route/page documentation.

## Forbidden
- No separate Messages route.
- No separate Calls & IVR route.
- No separate CRM route.
- No POST/PATCH/DELETE customer actions.
- No send reply.
- No CRM mutation.
- No ticket mutation.
- No conversation assignment.
- No call placement.
- No IVR trigger.
- No provider send.
- No auto-reply.

## Patch Contents
Added:
- `public/control-center/pages/customer-center.js`
- `customer-center` route registration
- `CUSTOMER` sidebar group with one `Customer Center` item

## Safety Confirmation
- No Messages route added.
- No Calls & IVR route added.
- No CRM route added.
- No customer mutation helper added.
- No send reply action added.
- No CRM mutation added.
- No ticket mutation added.
- No call/IVR/provider action added.
- Future mutation actions render disabled.

## Router / Sidebar Registration Fix
Registered Customer Center using the actual frontend structure:

Router:
- imported `customerCenterRoute` from `./pages/customer-center.js`
- added `[customerCenterRoute.id]: customerCenterRoute` to `routeRegistry`

Sidebar:
- added one `Customer` nav group
- added one `Customer Center` item:
  - `data-route="customer-center"`
  - `data-page="customer-center"`

No Messages, Calls & IVR, or CRM routes were added.

## Router Template Compatibility Fix
Updated Customer Center route export to match the current router contract.

Reason:
The current router renders `routeDef.template` directly. The first draft exposed `render(context)` instead, causing the route body to render as `undefined`.

Fix:
- Added `meta`.
- Added template getter.
- Kept future refresh/handler helpers available for later app-level wiring.

## Page Visibility Fix
Updated Customer Center template wrapper to match the current router/page visibility contract.

Reason:
The router renders `routeDef.template` directly and existing pages rely on `page is-active`.
The first Customer Center template used `page customer-center-page` without `is-active`, causing the route header/sidebar to load while the page body appeared blank.

Fix:
- changed wrapper from `<main class="page customer-center-page">`
- to `<section class="page is-active customer-center-page">`

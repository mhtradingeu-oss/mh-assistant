# PHASE 3AI.8 — Customer Center Protected-Read UX Enhancement Plan

## Status
Plan-only. No implementation yet.

## Baseline
- Latest closed phase: PHASE 3AI.7 — Customer Center Browser QA Closeout
- Latest pushed commit: 97e4644
- Customer Center route exists and loads.
- Customer Center remains read-only.
- Backend customer operations projections exist.
- No customer POST/PATCH/PUT/DELETE routes are enabled.

## Scope
This phase is limited to protected-read UX enhancement and UI polish inside:

- public/control-center/pages/customer-center.js

## Allowed changes
- Clarify protected-read state copy.
- Improve empty state guidance.
- Improve readiness / locked action explanation.
- Improve Action Panel and AI Panel wording.
- Improve visual hierarchy using existing classes.
- Improve density and grouping without adding new runtime behavior.
- Keep handoff-only actions as guidance/draft actions.

## Forbidden changes
- No backend changes.
- No API helper changes.
- No router changes.
- No sidebar changes.
- No new routes.
- No Messages route.
- No Calls or IVR route.
- No CRM route.
- No send reply action.
- No ticket mutation.
- No CRM mutation.
- No conversation assignment mutation.
- No call placement.
- No IVR trigger.
- No WhatsApp / Instagram / SMS send.
- No POST/PATCH/PUT/DELETE customer operations routes.
- No autonomous customer support execution.

## UX goals
1. Make read-only / protected-read status obvious immediately.
2. Make empty states helpful instead of looking broken.
3. Make all locked future actions explain why they are locked.
4. Make Action Panel clearly handoff-only.
5. Make AI Panel clearly draft/guidance-only.
6. Make the page feel like a safe Customer Operations command surface, not a disabled unfinished page.

## Safety checks required
- node --check public/control-center/pages/customer-center.js
- node --check public/control-center/router.js
- node --check public/control-center/app.js
- node --check public/control-center/api.js
- node --check runtime/orchestrator-service/server.js
- grep must confirm no customer mutation routes.

## Browser QA required
Open:

http://127.0.0.1:3000/control-center/#customer-center

Verify:
- Page loads without crash.
- Protected-read state is clear.
- Empty states are clear.
- Future actions remain disabled.
- Action Panel is handoff-only.
- AI Panel is draft/guidance-only.
- No send/reply/CRM/ticket/call/IVR action is enabled.
- No fatal overlay.

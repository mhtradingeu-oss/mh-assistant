# PHASE 3AI.5 — Customer Center Frontend Polish / Protected-Read UX Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AI.4 — Customer Center Frontend Browser QA / Closeout`
- Previous commit: `7da4f4e Close Customer Center frontend browser QA`

## Purpose
Plan a UX polish pass for Customer Center after the first read-only route landed.

This phase must not add new capabilities.

## Current State
Customer Center v1 exists as:
- one route: `customer-center`
- one sidebar item under `CUSTOMER`
- read-only shell
- empty states
- Action Panel
- AI Panel
- no mutation actions

## Polish Goals
Improve:
- protected-read guard clarity.
- readiness messaging.
- empty-state clarity.
- disabled future-action display.
- panel density.
- safe handoff copy.
- visual hierarchy.

## Protected-Read UX
If the backend returns:
`Protected read routes are disabled until MH_CONTROL_CENTER_WRITE_KEY is configured on the server.`

The page should show:
- clear protected-read banner.
- server setup requirement.
- no fake data.
- no crash.
- no enabled send/mutation actions.
- link/copy hint to configure `MH_CONTROL_CENTER_WRITE_KEY`.

## Readiness Messaging
The page should clearly separate:
- Customer Operations runtime readiness.
- read-only projection readiness.
- external send lock.
- CRM mutation lock.
- voice/IVR lock.
- provider readiness.

## Disabled Actions UX
Disabled actions should be clearer:
- grouped under "Future actions locked".
- each action should show why it is disabled.
- avoid making disabled actions look like primary workflows.
- keep handoff actions visually separate from future mutation actions.

## Empty State UX
Empty states should explain:
- what will appear here.
- why it is empty now.
- the safe next step.
- whether it depends on server key, provider connection, or customer data.

## Safety Invariants
The polish patch must not:
- add new routes.
- add Messages / Calls & IVR / CRM routes.
- add POST/PATCH/DELETE helpers.
- send replies.
- mutate CRM.
- mutate tickets.
- assign conversations.
- place calls.
- trigger IVR.
- send provider messages.
- auto-reply.

## Files Likely To Touch
Preferred:
- `public/control-center/pages/customer-center.js`

Optional only if needed:
- `public/control-center/styles/12-pages.css`

Avoid broad CSS changes.

## Validation Required
- `node --check public/control-center/pages/customer-center.js`
- `node --check public/control-center/router.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/api.js`
- `node --check runtime/orchestrator-service/server.js`

## Browser QA Required
- route loads.
- no blank page.
- protected-read state is clear if key missing.
- empty states are clear.
- disabled future actions are clear.
- no mutation actions are enabled.
- handoff actions remain navigation/context only.

## Recommended Next Phase
`PHASE 3AI.6 — Customer Center Protected-Read UX Safe Patch`

Reason:
This plan defines a narrow polish pass. The next phase may implement copy/layout polish only, without new capabilities.

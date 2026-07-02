# PHASE 3T.14 — Integrations Provider Readiness Patch Plan + Browser QA Checklist

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: 27c440a Add Integrations provider readiness cleanup plan

## Purpose
Prepare the exact safe patch strategy and Browser QA checklist for a future Integrations provider-readiness cleanup.

## Why This Exists
Phase 3T.13 decided Integrations needs a small provider-readiness label/ownership cleanup plan, but no production code should be edited until exact allowed and forbidden operations are documented.

## Current Ownership
Integrations remains owned by:
- `public/control-center/pages/integrations.js`
- `public/control-center/pages/integrations/cards.js`
- `public/control-center/pages/integrations/drawer.js`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/14-page-standard.css`

## Patch Strategy Options

### Option A — QA-only closeout
No production patch. Use browser QA to confirm Integrations is already sufficiently clear.

### Option B — Copy-only readiness clarification
Allowed only if evidence shows unclear wording. Possible copy-only targets:
- provider readiness labels
- unsupported/not configured copy
- CRM/email readiness boundary copy
- audio/voice boundary copy
- sync/reconnect feedback wording

### Option C — CSS comment/ownership clarification only
Allowed only if CSS ownership markers need clarification. No selector/value changes.

### Not allowed in this phase
- No JS behavior changes.
- No backend/API changes.
- No CSS selector removal.
- No route additions.
- No new provider surfaces.
- No provider execution changes.
- No confirmation gate changes unless a separate safety audit approves it.

## Readiness Labels To Preserve
Allowed readiness language:
- connected
- configured
- ready
- not configured
- unsupported
- disconnected
- stale sync
- needs setup
- backend sync
- provider-level sync
- diagnostics
- inspect
- repair connection

Forbidden claims:
- provider is fully automated
- CRM is live
- support desk is live
- email sending is fully connected
- audio engine is live
- voice calls are live
- IVR is live
- call center is live

## Browser QA Checklist

| Check | Result | Notes |
|---|---|---|
| Integrations page opens without fatal error | TODO | |
| No console errors | TODO | |
| Overview metrics remain readable | TODO | |
| Next best integration action remains readable | TODO | |
| Filters/search remain usable | TODO | |
| Connector rows remain readable | TODO | |
| Drawer opens and closes correctly | TODO | |
| Provider status/readiness is visible | TODO | |
| Unsupported/not configured state is clear | TODO | |
| Run backend sync label remains visible | TODO | |
| Sync behavior remains unchanged | TODO | |
| Reconnect integration / Repair integration connection labels remain visible | TODO | |
| Reconnect behavior remains unchanged | TODO | |
| Disconnect confirmation still appears | TODO | |
| Cancel disconnect prevents mutation | TODO | |
| Confirm disconnect proceeds | TODO | |
| Test connection remains inspect-only | TODO | |
| Diagnostics remain inspect-only | TODO | |
| CRM/email readiness does not claim live support/CRM execution | TODO | |
| Audio/voice readiness does not claim IVR/call center | TODO | |
| AI prompts remain review/context-only | TODO | |
| Mobile/narrow layout does not overflow | TODO | |

## Decision
Ready to decide between QA-only, copy-only, CSS-comment-only, or defer after Browser QA.

## Recommended Next Step
Proceed to:

**PHASE 3T.15 — Integrations Browser QA / Readiness Decision**

Purpose:
- run Browser QA
- decide if Integrations needs a patch at all
- if patch is needed, decide exact patch type before implementation

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits in this phase.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Preserve sync/reconnect/disconnect confirmation/provenance protections.
- Preserve provider readiness honesty.

# PHASE 3T.13 — Integrations Provider Readiness + CSS Ownership Cleanup Plan

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: b9e52bb Add Integrations provider readiness ownership audit

## Purpose
Create a safe plan for Integrations provider-readiness and CSS ownership before any production CSS or text edit.

## Why This Exists
Phase 3T.12 confirmed Integrations is a `hybrid_css_owned` provider-readiness surface with high provider-claim risk.

This plan defines what can be cleaned safely and what must be protected.

## Evidence Summary

### Existing final closeout summary
Existing Integrations audits and closeouts show that Integrations has already gone through substantial page work:

- modularization
- layout and render extraction
- runtime scan
- UX cleanup
- final page experience review
- final closeout
- authority patch
- duplicate feedback cleanup

This means Integrations should not be broadly redesigned or restyled now.

### Existing safety/provenance summary
Integrations already has important safety protections:

- Disconnect is confirmation-gated.
- Disconnect QA closeout exists.
- Sync and Reconnect were audited.
- Sync/Reconnect were intentionally not given confirmation gates yet.
- Sync/Reconnect wording/provenance was clarified instead.
- Sync/Reconnect behavior should remain unchanged.
- Test connection and diagnostics are safe/inspect actions.
- Disconnect remains the strongest protected mutation.

These protections must be preserved.

### CSS ownership summary
Integrations is `hybrid_css_owned`.

Current CSS ownership is distributed across:

- `public/control-center/styles/08-components-foundation.css`
  - generic integration list/item primitives
- `public/control-center/styles/14-page-standard.css`
  - main Integrations page/system surface styling
  - integration system overview
  - diagnostics
  - readiness map
  - control rows
  - drawer/details
  - next best action
  - progress steps
  - action rows
- `public/control-center/pages/integrations.js`
  - active markup/class/data-attribute owner

This means first cleanup should not move CSS files or remove selectors.

### JS/CSS class usage summary
The JS uses active page-specific classes such as:

- `integrations-wrapper`
- `integration-system-panel`
- `integration-system-overview`
- `integration-system-metric`
- `integration-system-next-action`
- `integration-system-workspace`
- `integration-system-filters`
- `integration-system-diagnostics`
- `integration-system-readiness-map`
- `integration-ai-grid`
- `integration-control-row`
- `integration-drawer`
- `integration-action`
- `integration-prompt`

The CSS contains many additional classes for cards, rows, drawer states, requirements, progress steps, diagnostics, and older generic integration primitives.

Because JS and CSS are not one-to-one, the first cleanup must not remove CSS classes without browser proof.

### Provider readiness label boundaries
Integrations must represent provider states honestly:

Allowed labels/meanings:
- configured
- connected
- ready
- not configured
- unsupported
- disconnected
- stale sync
- needs setup
- provider-level sync
- backend sync
- diagnostics / inspect

Forbidden claims unless proven by backend/provider evidence:
- live provider execution
- fully automated provider operation
- CRM is live
- support desk is live
- email sending is fully connected
- audio engine is live
- voice calls are live
- IVR / Call Center is live

### CRM/email/audio readiness boundaries

#### CRM / Email
Integrations may show CRM/email readiness and missing setup.

It must not claim:
- CRM records can be mutated
- support tickets can be created
- outreach can be sent
- email provider is live
- customer replies can be sent

unless current backend/provider evidence proves that exact capability and authority.

#### Audio / Voice
Integrations may show audio/media provider readiness.

It must clearly separate:
- voice script generation / audio preparation
from:
- realtime voice
- phone calls
- IVR
- call center

Voice script generation is media/audio preparation only. It is not IVR or Call Center execution.

## Cleanup Strategy
Use a conservative plan-first approach.

The next patch, if approved, should be either:

1. Documentation/QA closeout only, or
2. Copy-only readiness wording clarification, or
3. CSS comment/ownership clarification only.

Do not do broad CSS consolidation yet.

Do not remove CSS selectors.

Do not change JS behavior.

Do not change API calls.

Do not create provider routes.

## Decision
**B) Small provider-readiness label/ownership cleanup plan.**

No production code changes should happen in this phase.

## Recommended Next Step
Proceed to:

**PHASE 3T.14 — Integrations Provider Readiness Patch Plan + Browser QA Checklist**

Purpose:
- define exact wording/readiness labels that must be preserved
- define forbidden claims
- define CSS selectors/classes forbidden to remove
- define Browser QA checks for provider readiness, sync, reconnect, disconnect, diagnostics, and unsupported providers
- decide whether a future patch should be copy-only, CSS-comment-only, or QA-only

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits in this phase.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Do not turn Integrations into daily execution.
- Do not claim unsupported providers are ready.
- Do not claim CRM/email/audio/voice integrations are live unless evidence proves it.
- Do not claim voice script generation equals IVR/call center.
- Preserve sync/reconnect/disconnect confirmation/provenance protections.
- Preserve Connect behavior.
- Preserve Test connection behavior.
- Preserve Diagnostics behavior.

# PHASE 3T.12 — Integrations CSS / Provider Readiness Surface Ownership Audit

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: a7e9a07 Close Settings ownership finalization pass

## Purpose
Audit Integrations as the next page-specific ownership target after Settings.

Integrations is important because it owns or supports:
- provider readiness
- connector health
- sync policy visibility
- CRM/email readiness
- audio/provider readiness
- webhook/integration status
- future Customer Operations readiness signals

## Why This Exists
Phase 3T.6A confirmed Integrations owns provider readiness, while Settings owns configuration and AI Command owns active AI work.

Before any UI polish, we need to understand Integrations CSS ownership and whether it can support CRM/email/audio/provider readiness without adding new pages.

## Evidence Summary

### Integrations render / route map
Integrations is an active Control Center page and a major provider-readiness surface.

The page is sizeable and already has modularization history. Current scan and previous audits indicate Integrations owns or exposes:
- integration cards
- connector readiness
- sync health
- provider status
- readiness summaries
- reconnect/sync semantics
- integration domain grouping
- provider unsupported/configuration warnings
- handoff context for other surfaces

### CSS ownership findings
Integrations is best classified as:

**hybrid_css_owned**

Evidence indicates Integrations uses both page JS structure and shared/global styling layers.

Existing audits show previous work around:
- integrations layout
- integrations render
- integrations runtime scan
- integrations modularization
- integrations final full-page experience
- duplicate feedback cleanup
- operating surface plan
- authority patch

This means Integrations should not receive broad CSS polish blindly. It needs a small ownership/readiness plan before any production CSS change.

### Provider readiness findings
Integrations is the correct surface for provider readiness.

Backend and runtime evidence references:
- provider status
- connector readiness
- sync history
- project connector readiness
- provider_not_configured states
- unsupported command/provider handling
- AI provider configuration
- media provider configuration
- connector health / folder health
- sync failures and provider disconnect alerts

Integrations should show readiness honestly:
- configured
- not configured
- unsupported
- disconnected
- stale sync
- ready
- needs setup

### CRM/email/audio readiness findings
Integrations should own readiness, not execution.

#### CRM / Email
Evidence shows email and CRM-related readiness concepts exist through:
- email queue and campaign email commands
- email readiness evaluation
- prepared email send flow
- email/CRM grouping in insight ingestion readiness
- Mailchimp/CRM/SMTP-style readiness concepts
- Customer Operations future dependency on inbox/tickets/leads/CRM

However, Integrations must not claim CRM or support desk execution unless provider/API evidence proves it.

#### Audio / Voice
Evidence shows media provider and voice script generation concepts exist:
- media provider readiness
- generate voice script API path
- provider_not_configured handling for media
- audio classified as media/voice-script preparation

This is not the same as live IVR, phone, realtime voice, or call center execution. Those remain future/deferred.

### Existing audits/closeouts
Existing Integrations evidence is extensive, including:

- `audits/frontend/integrations/integration-card-model-before-extraction.txt`
- `audits/frontend/integrations/integrations-core-builders-before-extraction.txt`
- `audits/frontend/integrations/integrations-entry.txt`
- `audits/frontend/integrations/integrations-layout.txt`
- `audits/frontend/integrations/integrations-modularization-final-checkpoint.md`
- `audits/frontend/integrations/integrations-render.txt`
- `audits/frontend/integrations/integrations-runtime-scan.txt`
- `audits/frontend/integrations/integrations-tree.txt`
- `audits/frontend/integrations-rebuild/final-architecture/EXTRACTION_MAP.md`
- `audits/frontend/integrations-ux/INTEGRATIONS_UX_AUDIT.txt`
- `audits/frontend/layout-authority/INTEGRATIONS_AUTHORITY_AUDIT.md`
- `audits/frontend/layout-authority/INTEGRATIONS_AUTHORITY_PATCH_AUDIT.md`
- `audits/frontend/page-upgrade-roadmap/integrations-final-closeout/INTEGRATIONS_FINAL_CLOSEOUT.md`
- `audits/frontend/page-upgrade-roadmap/integrations-final-full-page-experience/INTEGRATIONS_FINAL_FULL_PAGE_EXPERIENCE_REVIEW.md`
- `audits/frontend/page-upgrade-roadmap/integrations-page-truth-audit/INTEGRATIONS_PAGE_TRUTH_AUDIT.md`
- `audits/frontend/safety/STEP_22A_INTEGRATIONS_SYNC_RECONNECT_CONFIRMATION_AUDIT.md`
- `audits/frontend/safety/STEP_22C_INTEGRATIONS_DISCONNECT_QA_CLOSEOUT.md`
- `audits/frontend/safety/STEP_23A_INTEGRATIONS_SYNC_RECONNECT_PROVENANCE_AUDIT.md`
- `audits/frontend/safety/STEP_23C_INTEGRATIONS_SYNC_RECONNECT_PROVENANCE_QA_CLOSEOUT.md`

This confirms Integrations already has substantial prior work and should be treated carefully.

## Risk Classification

| Risk | Level | Reason |
|---|---|---|
| CSS ownership risk | High | Integrations has prior layout/rebuild/UX/final audits and likely multiple styling layers |
| Provider claim risk | High | CRM/email/audio/provider states must not be overstated |
| Execution authority risk | Medium | Sync/reconnect/disconnect may imply mutation and must remain confirmation/provenance protected |
| Customer Ops dependency risk | Medium | Customer Operations future surface depends on honest provider readiness |
| Audio/voice claim risk | High | Voice script readiness must not be confused with IVR/call center readiness |
| Visual regression risk | Medium | Integrations page is complex but already has prior closeouts |

## Decision
**B) Small Integrations CSS/provider-readiness ownership cleanup plan.**

Do not implement CSS changes yet.

Do not redesign Integrations now.

Do not add routes or new provider surfaces now.

## Recommended Next Step
Proceed to:

**PHASE 3T.13 — Integrations Provider Readiness + CSS Ownership Cleanup Plan**

Purpose:
- read the existing Integrations final closeout and safety audits
- identify canonical CSS/page ownership
- identify readiness labels that must be preserved
- document CRM/email/audio readiness boundaries
- prepare Browser QA checklist before any CSS or text patch
- preserve sync/reconnect/disconnect confirmation and provenance behavior

## Protected Behavior
- No production changes in this phase.
- No CSS edits in this phase.
- No JS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Do not turn Integrations into daily execution.
- Do not claim unsupported providers are ready.
- Do not claim CRM/email/audio/voice integrations are live unless evidence proves it.
- Do not claim voice script generation equals IVR/call center.
- Preserve Integrations as provider readiness and connector authority only.
- Preserve sync/reconnect/disconnect confirmation/provenance protections.

# PHASE 3T.5 — Customer Operations Evidence Review and Placement Plan

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: e62eddd Add Customer Operations surface decision audit

## Purpose
Review existing Customer Operations evidence and produce a placement plan before any frontend route, page, CSS, or implementation work.

## Why This Exists
Phase 3T.4 confirmed Customer Operations is a real planned/architected capability, but not a confirmed standalone launch-ready frontend page.

This phase reviews prior Customer Operations evidence and decides the safest placement path.

## Evidence Sources
- `audits/customer-operations/AI_CUSTOMER_OPERATIONS_MASTER_ARCHITECTURE.md`
- `audits/customer-operations/AI_CUSTOMER_OPERATIONS_PRE_CREATE_DUPLICATION_AUDIT.md`
- `audits/customer-operations/CUSTOMER_OPERATIONS_INTEGRATION_BRIDGE_DEEP_SCAN.md`
- `audits/customer-operations/CUSTOMER_OPS_PHASE_3_READ_ONLY_READINESS_SNAPSHOT.md`
- `audits/frontend/system-truth-final/evidence/10-operations-customer-ops-evidence.txt`
- Current frontend scan of `ai-command.js`, `tool-dock.js`, `home.js`, `integrations.js`, `operations-centers.js`, `media-studio-workspace.js`, and `api.js`

## Evidence Summary

### Existing Architecture Summary
Customer Operations is already represented as a meaningful operating capability in the system architecture and audit history.

The repository contains multiple Customer Operations audits and evidence files, which confirms this is not a random missing page idea. It is a planned/architected capability that needs correct surface placement.

### Duplication Risk Summary
A standalone Customer Operations page should not be created immediately because:

- AI Command already contains Customer Operations and Sales/CRM specialist logic.
- Operations Centers already owns task, queue, job, notification, and operational review surfaces.
- Integrations already owns CRM/email provider readiness and unsupported backend provider messaging.
- Adding a new page now could duplicate AI Command, Operations Centers, and Integrations responsibilities.

### Integration Bridge Summary
Integrations already exposes Email & CRM as a domain, but CRM backend support is currently marked as not configured.

This means CRM/Support should not be presented as a fully operational live support desk yet. The correct user-facing treatment is readiness, missing integration context, and AI-assisted draft preparation.

### Read-only Readiness Summary
Customer Operations currently works best as a read-only / preparation-only capability:

- review customer or inbox context
- draft replies
- prepare ticket drafts
- flag SLA risk
- summarize customer profile context
- prepare escalation guidance
- prepare sales/CRM handoff notes
- draft outreach and follow-up cadence

It must not claim live execution.

### Current Frontend Confirmation
AI Command confirms strong Customer Operations coverage:

- `Customer Operations Lead`
- `Sales / CRM Lead`
- inbox review
- safe reply drafts
- ticket drafts
- SLA risk
- escalation routing
- lead qualification
- outreach drafts
- follow-up cadence
- CRM profile summaries
- sales handoff notes

AI Command also includes explicit safety boundaries:

- no customer reply sent
- no ticket created
- no SLA changed
- no escalation triggered
- no outreach sent
- no CRM record changed
- no follow-up scheduled
- no pipeline stage advanced

Operations Centers currently does not confirm Customer Operations as an active sub-surface.

Integrations confirms Email & CRM readiness concepts, but backend provider support for CRM/email items is not fully configured.

IVR / Call Center / realtime voice is not launch-ready. Voice functionality is currently better classified as media/AI voice script readiness or browser read/voice input planning, not a live IVR/call center surface.

## Placement Decision

**Recommended Decision: F) Hybrid — Operations sub-surface + AI Command + Integrations readiness.**

Do not create a standalone Customer Operations page now.

The safest future placement is:

1. **AI Command**
   - Owns intelligence, drafting, routing guidance, reply drafts, ticket drafts, CRM summaries, outreach drafts, and safe customer/sales planning.

2. **Operations Centers**
   - Should later receive a Customer Operations sub-surface if evidence and UX contract are approved.
   - This sub-surface should remain review-first initially.

3. **Integrations**
   - Owns CRM/email/support provider readiness.
   - Shows missing provider support and required setup.

4. **Future IVR / Call Center / Voice**
   - Deferred until backend/API/provider evidence is stronger.
   - Do not present as launch-ready.

## UX Contract
Any future Customer Operations surface must show:

- customer/service signal context
- missing CRM/support/inbox integrations
- current readiness state
- next best customer operation action
- responsible AI specialist
- task/workflow/AI handoff path
- execution boundary labels
- read-only vs draft-only vs task creation vs backend-governed mutation

## User-Facing Power Story
Customer Operations should feel powerful without fake claims:

- The system can understand customer/service context when provided.
- The AI Team can review inbox, ticket, support, lead, outreach, and CRM context.
- It can draft replies, ticket notes, customer summaries, escalation guidance, and sales handoffs.
- It can route work toward Operations, Workflows, or future CRM/support surfaces.
- It does not send replies, create live tickets, mutate CRM records, change pipeline state, trigger escalations, or run IVR/calls unless a future backend-governed capability is built and confirmed.

## Final Decision
Customer Operations should remain in the roadmap as a real capability.

Current placement:

- AI Command: active preparation and intelligence surface.
- Integrations: CRM/email readiness surface.
- Operations Centers: future recommended sub-surface.
- Standalone page: not recommended now.
- IVR / Call Center / Voice: deferred future phase.

## Recommended Next Step
Proceed to:

**PHASE 3T.6 — Customer Operations Placement Closeout**

Purpose:
- close Customer Operations placement decision
- add it to the global UI finalization roadmap as a future Operations Centers sub-surface
- avoid route creation until implementation is explicitly approved
- return to global page/CSS ownership prioritization after Customer Ops placement is closed

## Protected Behavior
- No production changes.
- No JS edits.
- No CSS edits.
- No backend/API edits.
- No route additions.
- No data/project edits.
- No fake support/CRM/IVR claims.
- Do not weaken execution authority closeouts.

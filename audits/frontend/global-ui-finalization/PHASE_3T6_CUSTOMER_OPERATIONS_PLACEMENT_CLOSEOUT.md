# PHASE 3T.6 — Customer Operations Placement Closeout

## Status
Closed.

## Baseline
- Previous commit: 02364f6 Add Customer Operations placement plan

## Scope
Closeout for Customer Operations / CRM / Support / Tickets / Inbox / IVR / Call Center / Voice placement decision after Phase 3T.2–3T.5 capability coverage review.

This closeout also references Phase 3T.6A to ensure Customer Operations is not closed in isolation from Settings, AI Employees, Knowledge/Data Stores, Workflows, Agent Setup, Memory/Learning, and Audio/Voice placement.

## Completed Work

### 3T.2 — Capability-to-Frontend Surface Coverage + Power Experience Audit
- Confirmed MH-OS must expose power as an operating experience, not technical modules.
- Defined the user-facing pattern:
  - Capability
  - Surface
  - Context
  - Next Best Action
  - AI Team / Workflow / Task / Handoff
  - Result / Tracking

### 3T.3 — Capability-to-Page Coverage Matrix
- Confirmed current visible primary surfaces:
  - Home
  - Setup
  - Library
  - Integrations
  - AI Command
  - Workflows
  - Campaign Studio
  - Content Studio
  - Media Studio
  - Publishing
  - Ads Manager
  - Insights
  - Research
  - Governance
  - Settings
  - Operations Centers
- Classified Customer Operations / CRM / Support / Tickets / Inbox / IVR / Call Center / Voice as P0 needs-deeper-audit before UI finalization.

### 3T.4 — Customer Operations Surface Decision Audit
- Confirmed Customer Operations is a real planned/architected capability.
- Confirmed no standalone launch-ready Customer Operations route should be claimed yet.
- Confirmed no launch-ready IVR / Call Center / Voice frontend surface should be claimed yet.

### 3T.5 — Customer Operations Evidence Review and Placement Plan
- Confirmed recommended placement:
  - AI Command as active preparation and intelligence surface.
  - Integrations as CRM/email readiness surface.
  - Operations Centers as future recommended Customer Operations sub-surface.
  - Standalone Customer Operations page not recommended now.
  - IVR / Call Center / Voice deferred as future phase.

### 3T.6A — Operating Intelligence / AI Workforce / Knowledge / Audio Surface Audit
- Confirmed adjacent operating layers are covered before final closeout:
  - Settings owns AI employee/team configuration, policies, permissions, memory/data rules, approval owners, and provider preferences.
  - AI Command owns active AI employee answering, collaboration, drafts, and handoffs.
  - Library owns knowledge, data, files, sources, evidence, generated media, and reusable assets.
  - Governance owns approvals, proof, policy, claims, and risk evidence.
  - Workflows owns process preparation and structured operating steps.
  - Operations Centers owns operational tracking and future Customer Operations sub-surface.
  - Integrations owns CRM/email/audio/provider readiness.
  - Media Studio owns voice scripts, audio direction, and media preparation.
- Confirmed Audio Engine must be split into:
  - voice script / audio direction: Media Studio + AI Command
  - audio generation provider: Media Studio + Integrations
  - realtime voice / IVR / call center: deferred future phase

## Final Placement Decision

Use a hybrid placement model:

1. **AI Command**
   - Owns Customer Operations intelligence and preparation:
     - safe reply drafts
     - ticket drafts
     - customer summaries
     - SLA risk review
     - escalation guidance
     - lead qualification
     - outreach drafts
     - CRM profile summaries
     - sales handoff notes

2. **Integrations**
   - Owns CRM/email/support provider readiness:
     - missing CRM setup
     - backend support status
     - connector readiness
     - provider availability

3. **Operations Centers**
   - Future recommended Customer Operations sub-surface:
     - review-first
     - no live sending
     - no CRM mutation
     - no ticket creation until backend authority exists
     - no IVR/call actions until provider/API evidence exists

4. **Standalone Customer Operations Page**
   - Not recommended now.
   - May be reconsidered only after sub-surface maturity and backend/API evidence improve.

5. **IVR / Call Center / Voice**
   - Deferred future phase.
   - Do not present as launch-ready.
   - Current voice capability remains media/AI voice script/browser readiness, not live call center or IVR execution.

## Adjacent Surface Decisions Preserved

| Capability | Placement |
|---|---|
| AI Employee setup | Settings + Setup future wizard |
| AI Employee answering | AI Command |
| Knowledge / Data Stores | Library + Settings |
| Source evidence | Library + Governance |
| Workflow setup | Workflows |
| Workflow execution authority | Workflows + backend confirmations |
| Tasks / queue / jobs | Operations Centers |
| Memory / Learning | Settings + AI Command + Insights |
| Audio scripts | Media Studio + AI Command |
| Audio provider readiness | Integrations + Media Studio |
| Realtime voice / IVR / phone | Deferred future phase |

## Protected Behavior
- No production changes made.
- No route additions.
- No JS/CSS/backend/API/data edits.
- No fake Customer Ops / CRM / IVR / audio / data-store claims.
- No weakening of execution authority closeouts.
- AI Command customer/CRM outputs remain review-ready drafts only.
- No customer replies sent.
- No live tickets created.
- No CRM records mutated.
- No SLA changed.
- No escalation triggered.
- No outreach sent.
- No pipeline stage advanced.
- No IVR/call action triggered.
- No new standalone page until evidence and implementation are explicitly approved.

## UX Contract For Future Customer Operations Surface
Any future Customer Operations sub-surface must show:

- customer/service context
- inbox/support/CRM readiness
- missing integrations
- current readiness state
- next best customer operation action
- responsible AI specialist
- task/workflow/AI handoff path
- execution boundary labels
- review-only vs draft-only vs task creation vs backend-governed mutation

## Decision
Customer Operations placement is closed for the current global UI finalization planning phase, with adjacent AI workforce, knowledge, workflow, settings, and audio placement covered by 3T.6A.

## Next Recommended Phase
Return to:

**Global Page / CSS Ownership Prioritization**

Recommended next phase:
- **PHASE 3T.7 — Page CSS Ownership Prioritization Matrix**

Purpose:
- classify each page as global CSS owned, scoped CSS owned, hybrid, browser-QA-only, or needs page-specific ownership audit
- choose first safe page group for UI finalization
- avoid broad CSS patching
- preserve execution authority, Customer Operations placement, and Operating Intelligence placement decisions

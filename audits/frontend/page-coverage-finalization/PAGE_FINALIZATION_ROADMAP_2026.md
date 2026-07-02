# MH-OS Frontend Page Finalization Roadmap 2026

## Status
Audit-document-only.

This roadmap authorizes no production implementation. It exists to sequence the remaining frontend operating-system readiness work without weakening authority boundaries.

## Non-Negotiable Doctrine
- Backend owns authority.
- Frontend projects authority and creates the operating experience.
- AI surfaces guide, draft, review, preview, and hand off.
- Execution remains destination-owned and confirmation-gated.
- Publishing, workflow runs, approvals, CRM/customer mutations, task creation, deletion, archival, reconnect/sync, and destructive actions must never happen silently from frontend guidance.
- Browser QA is required before closeout.
- Provider readiness must not be claimed unless runtime evidence proves it.

## Current State

Closed:
- Settings
- Integrations
- Media Studio

Functionally closed with notes:
- AI Command

Safety-audited but needs UX closeout:
- Workflows
- Publishing
- Governance
- Task Center
- Queue Center
- Job Monitor
- Notifications

Needs deep finalization:
- Library
- Setup
- Insights
- Campaign Studio
- Content Studio
- Ads Manager
- Research

Needs final confirmation:
- Home

## Readiness Path

### PHASE 3U — Library Finalization

Goal:
Confirm Library as the source evidence/assets authority surface.

Pages covered:
- Library

Required audit:
- ownership and route truth
- upload and asset intake behavior
- selected source behavior
- preview state and missing-asset state
- delete/archive/destructive action risk
- save-to-library paths from other surfaces
- AI Command context handoff
- Media Studio handoff
- Publishing evidence handoff
- Governance proof support
- CSS/density ownership
- browser QA evidence

Closeout condition:
Library can be marked closed only if evidence confirms source/assets ownership, handoff truth, destructive-action safety, and browser-visible UX readiness.

### PHASE 3V — Setup Finalization

Goal:
Confirm Setup as onboarding and readiness projection, not daily execution authority.

Pages covered:
- Setup

Required audit:
- project readiness projection
- setup data completeness
- missing configuration states
- business template readiness
- relationship with Settings
- AI/operations handoff language
- CSS/density review
- browser QA evidence

Closeout condition:
Setup can be closed only if it clearly separates onboarding/readiness from Settings authority and backend execution.

### PHASE 3W — Execution Surface Visual Closeout

Goal:
Finalize visual and UX consistency for surfaces with strong existing safety work.

Pages covered:
- Workflows
- Publishing
- Governance

Required audit:
- confirmation gates remain visible and active
- backend authority remains explicit
- no hidden execution in UI actions
- no live publish/run/approval claims without evidence
- automation language remains safe
- blocker, approval, and readiness states are visually clear
- browser QA evidence

Closeout condition:
These pages can be functionally closed only if UX polish preserves all execution-safety constraints.

### PHASE 3X — Operations System Pages Closeout

Goal:
Confirm operations tracking pages show durable truth without fake completion or silent mutation.

Pages covered:
- Task Center
- Queue Center
- Job Monitor
- Notifications

Likely frontend surface:
- `public/control-center/pages/operations-centers.js`

Required audit:
- route/page split truth
- task intake and handoff visibility
- queue state labels
- job monitor running/completed/failed semantics
- notification source and resolve semantics
- backend authority projection
- action confirmation gates
- browser QA evidence

Closeout condition:
Operations pages can be closed only when they show backend state accurately and avoid implying execution that has not happened.

### PHASE 3Y — Growth, Content, Research, and Insight Surfaces

Goal:
Turn growth/content pages into strong AI-assisted operating spaces while preserving proof, review, and execution boundaries.

Pages covered:
- Campaign Studio
- Content Studio
- Ads Manager
- Research
- Insights
- Home final confirmation, if still needed

Required audit:
- ownership and route truth for each page
- AI guidance/draft/review/handoff boundaries
- Library evidence usage
- Publishing/Governance handoff readiness
- provider readiness truth for Ads Manager
- research/source provenance
- insights data freshness and recommendation provenance
- browser QA evidence for each page

Closeout condition:
Each page must receive its own current closeout decision. Do not bulk-close these pages merely because older audits exist.

### PHASE 3Z — Final Global UX / CSS Consolidation

Goal:
Prepare the Control Center frontend for complete operating-system readiness.

Pages covered:
- All official pages:
  - Home
  - Setup
  - Library
  - Integrations
  - AI Command
  - Workflows
  - Publishing
  - Insights
  - Campaign Studio
  - Content Studio
  - Media Studio
  - Ads Manager
  - Research
  - Task Center
  - Queue Center
  - Job Monitor
  - Notifications
  - Governance
  - Settings

Required audit:
- page shell consistency
- typography and density consistency
- CSS duplication risk review
- responsive behavior
- keyboard/focus basics
- route navigation sanity
- no authority-boundary regressions
- browser QA across representative desktop and mobile viewports

Closeout condition:
The frontend can be called launch-ready only after every page has a documented closeout decision and browser QA evidence.

## Recommended Sequence
1. PHASE 3U.1 — Library Finalization Truth Audit.
2. PHASE 3U.2 — Library Authority / Handoff / Destructive Action Audit.
3. PHASE 3U.3 — Library UX Density and Browser QA Closeout.
4. PHASE 3V — Setup Finalization.
5. PHASE 3W — Workflows / Publishing / Governance Visual Closeout.
6. PHASE 3X — Operations System Pages Closeout.
7. PHASE 3Y — Growth, Content, Research, Insights, and Home Confirmation.
8. PHASE 3Z — Final Global UX / CSS Consolidation.

## Roadmap Decision
The next phase should not implement features. It should audit Library first, because Library is the source evidence/assets surface and the required evidence identifies it as the highest-leverage unfinished page.

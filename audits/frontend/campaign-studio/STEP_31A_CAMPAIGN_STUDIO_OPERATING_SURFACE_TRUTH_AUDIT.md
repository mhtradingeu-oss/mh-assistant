# STEP 31A — Campaign Studio Operating Surface Truth Audit

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: AUDIT ONLY / documentation-only

---

## 1) Executive Summary

This audit reviewed Campaign Studio as the next Operating Surface candidate after Library and Publishing.

Decision:
- Campaign Studio is a valid next Operating Surface target.
- The page is currently implemented as a single file.
- It contains campaign planning, AI context, durable campaign save, handoff routing, dependency review, and downstream workspace routing.
- The next safe step should be copy/provenance clarification only.
- Do not redesign layout or split modules yet.
- No production code was modified in this step.

---

## 2) Files Inspected

Reviewed:
- `public/control-center/pages/campaign-studio.js`
- `public/control-center/api.js`
- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib`
- prior Library and Publishing checkpoints by sequence context

Current Campaign Studio implementation:
- single page file only
- no dedicated `campaign-studio/` module folder identified

---

## 3) Current Page Structure

Campaign Studio currently includes:

- Campaign overview / planning header
- Campaign basics form
- Offer / audience / channel planning fields
- Campaign waves
- Campaign outputs / readiness section
- Campaign AI Assistant side area
- Routing actions to downstream pages
- Dependency and asset review actions
- Intelligence refresh action

Operating Surface equivalents:

### Header Equivalent

Present:
- Campaign Planning Workspace
- Campaign Overview
- active campaign / key readiness data
- toolbar actions

### Main View Equivalent

Present:
- Campaign Basics
- Offer and audience planning
- Wave planning
- Campaign outputs and readiness

### Action Panel Equivalent

Present but distributed:
- toolbar buttons
- AI Assistant side actions
- routing grid actions
- package/dependency actions

### AI Panel Equivalent

Present:
- Campaign AI Assistant
- Send to AI Workspace
- AI/handoff context creation

### Side Context Rail

Present:
- Campaign AI Assistant side area
- route actions to content, media, publishing, ads
- dependency and asset review links

---

## 4) Backend / Durable Action Evidence

Campaign Studio uses backend-backed or durable operations:

- `saveProjectCampaign(...)`
- `createProjectHandoff(...)`
- campaign API routes under `/media-manager/project/:project/campaigns`
- handoff API routes under `/media-manager/project/:project/handoffs`

Observed durable flows:
- save draft / campaign record
- build campaign durable record
- create handoff to AI Command
- create handoff to Publishing
- create handoff to Content Studio
- create handoff to Media Studio
- create handoff to Ads Manager

---

## 5) Current Action Inventory

Observed actions:

### Toolbar / Header Actions
- `Refresh Intelligence`
- `Save Draft`
- `Build Campaign`

### AI / Context Actions
- `Send to AI Workspace`

### Routing / Handoff Actions
- open Content Studio with campaign context
- open Media Studio with campaign context
- open Publishing with campaign context
- open Ads Manager with campaign context

### Review / Utility Actions
- review dependencies
- review assets
- generate package

---

## 6) Risk Classification

### Safe / Navigation

Actions:
- Review Assets
- Navigate to Library
- Open downstream workspace routes when no durable handoff is created

Risk:
- Low

### AI Context

Actions:
- Send to AI Workspace

Risk:
- Context transfer, not execution

Recommended improvement:
- wording should clarify this sends campaign context to AI and opens AI Command.

### Durable / Backend Controlled

Actions:
- Save Draft
- Build Campaign
- route handoffs to Content Studio / Media Studio / Publishing / Ads Manager

Risk:
- These create or update durable campaign/handoff records.

Recommended improvement:
- wording should clarify “shared campaign record” and “handoff with campaign context”.

### Review / Local Session

Actions:
- Generate Package
- Review Dependencies
- Refresh Intelligence

Risk:
- Appears non-destructive, but wording should clarify whether output is local/session, backend, or intelligence refresh.

---

## 7) Current Copy / Provenance Gaps

Current labels are useful but can be clearer:

- `Save Draft`
  - unclear whether local draft or durable campaign save
- `Build Campaign`
  - could sound like autonomous execution
- `Send to AI Workspace`
  - should clarify campaign context transfer
- `Refresh Intelligence`
  - should clarify campaign intelligence refresh
- downstream route buttons
  - should clarify that a campaign handoff/context is attached
- `Generate Package`
  - should clarify whether package is session draft or backend export

---

## 8) Recommended STEP 31B Candidate

Recommended next step:
- Copy-only provenance clarification patch.

Allowed:
- visible labels
- helper copy
- success messages
- no handler changes
- no data attribute / ID changes
- no CSS changes
- no backend changes
- no data/projects changes
- no module split

Suggested copy direction:
- `Save Draft` → `Save campaign draft`
- `Build Campaign` → `Save campaign plan`
- `Send to AI Workspace` → `Send campaign context to AI`
- `Refresh Intelligence` → `Refresh campaign intelligence`
- downstream open actions should clarify `with campaign handoff`
- package generation should clarify `draft package in session`

Do not patch yet:
- campaign persistence logic
- handoff logic
- route behavior
- AI behavior
- CSS/layout
- backend API
- global UI files

---

## 9) Validation Result

Validation commands were run before this audit document:
- `git status --short`
- Campaign Studio file scan
- action / AI / handoff anchor grep
- route / render / bind function grep
- API / backend campaign anchor grep
- `node --check public/control-center/pages/campaign-studio.js`
- `node --check public/control-center/api.js`
- `node --check runtime/orchestrator-service/server.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Result:
- Working tree was clean before audit.
- Syntax checks passed.
- Campaign Studio action and handoff anchors were identified.
- No production code was modified.

---

## 10) Explicit No-Code-Change Statement

This step made no production code changes.

No changes to:
- frontend JS
- CSS
- backend
- data/projects
- API behavior
- routes
- handlers
- IDs/classes/data attributes

# Full Page Experience Upgrade Protocol

## Status
Active protocol for all future page upgrades.

## Purpose
This protocol defines the official MH-OS method for upgrading every page as a complete professional experience, not as isolated visual patches.

## Core Workflow
Every page upgrade must follow:

1. Page Truth Audit
2. Full Page Experience Review
3. Full Page Experience Implementation Plan
4. Safe Frontend-Only Implementation
5. Terminal Validation
6. Browser QA
7. Commit after approval
8. Closeout

## Codex Must First Understand
Before editing any page, Codex must:

- read the full page
- read related modules
- read the Global UI/UX System Plan
- understand the page purpose
- diagnose UX/UI/content/action/feedback problems
- propose the best professional page experience
- define safe files to edit
- define forbidden files

## Allowed Changes
Codex may change:

- frontend layout
- frontend content and labels
- page-scoped CSS
- cards, rows, panels, drawers
- progressive disclosure
- frontend-only feedback
- safe icons or initials where local/supported

## Forbidden Changes
Codex must not change:

- backend
- API behavior
- data/projects
- auth/session
- runtime authority
- route core
- app shell behavior
- sensitive handlers
- destructive action behavior
- connector pipelines
- publishing mutation logic
- workflow execution logic
- legacy relinks
- remote logos or external brand assets

## Global Page Standard
Every major page should aim for:

1. Professional Header / Context Bar
2. Executive Summary / Health Strip
3. Main Workspace
4. Action / Decision Panel or Drawer
5. AI Guidance
6. Feedback Surface

## Progressive Disclosure Standard
Long explanations should be hidden behind:

- More info
- Why this matters
- Technical details
- Requirements
- Setup notes
- Risk details

Do not remove information. Show the decision summary first.

## Button Hierarchy Standard
Use:

- global actions in the header only
- one primary action per item
- quieter secondary actions
- separated dangerous actions

Every meaningful action must show feedback.

## Drawer / Panel Context Standard
Opening a drawer or panel must not make the user lose context:

- keep selected item highlighted
- preserve scroll position where safe
- return focus/context to originating item where safe
- keep close behavior clear

## Required Codex Deliverables

For each full page upgrade, Codex must create:

### PAGE_EXPERIENCE_REVIEW.md

Include:

- page purpose
- current structure
- current pain points
- duplicated text/actions
- user confusion points
- best professional design proposal
- safe implementation scope
- forbidden files
- files planned for editing

### IMPLEMENTATION_REPORT.md

Include:

- files changed
- what changed
- what was preserved
- validation results
- forbidden diff result
- browser QA checklist
- diff stat
- rollback note

## Mandatory Validation

After every implementation:

```bash
node --check public/control-center/pages/<page>.js
node --check public/control-center/pages/<page>/*.js
node --check public/control-center/app.js
node scripts/check-control-center-legacy-assets.js
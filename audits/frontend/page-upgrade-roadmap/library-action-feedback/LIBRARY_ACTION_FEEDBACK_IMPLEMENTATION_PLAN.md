# Library Action Feedback Implementation Plan

## Status
Plan-only checkpoint before implementation.

## Baseline
Audit committed in:
869bd87 Add Library action feedback audit

## Problem
Library actions are functional, but some user interactions are still unclear:
- user may click Classify without knowing what happened
- Preview/selection feedback is not explicit enough
- Review / Extract Docs / Ask AI need clearer routing messages
- mutation actions need success/error clarity
- selected asset context should be confirmed after click
- smart quick actions should guide the user to the next page or AI context safely

## Goal
Every Library action should explain itself.

The page must provide:
- immediate feedback after click
- clear selected asset context
- visible safe message for prompt/routing actions
- visible success/error message for mutation actions
- no auto execution without explicit user action
- no backend/API/data changes

## Allowed production files
- public/control-center/pages/library.js
- public/control-center/pages/library/action-panel.js
- public/control-center/pages/library/ai-panel.js
- public/control-center/styles/14-page-standard.css

## Forbidden files
- public/control-center/api.js
- public/control-center/app.js
- public/control-center/index.html
- backend files
- runtime authority files
- data/projects
- legacy files

## Implementation principles

### 1. Feedback surface
Add or reuse a compact Library feedback surface:
- inline banner
- aria-live region
- status row
- temporary message

It should support:
- info
- success
- warning
- error

### 2. Preview feedback
When an asset is selected or previewed:
- show asset name
- show status/type/source state
- confirm preview opened
- keep visual selected state

Example:
"Preview opened for front.png."

### 3. Classify feedback
When Classify is clicked:
- do not auto-mutate data unless existing handler already does
- show message explaining what happened

Example:
"Classification request prepared. Review the AI suggestion before applying changes."

### 4. Review Missing feedback
When Review Missing is clicked:
- show what will be reviewed
- route/prompt safely if existing flow does that
- no backend mutation unless already implemented

Example:
"Missing asset review prepared. The system will focus on required categories that still need attention."

### 5. Extract Docs feedback
When Extract Docs is clicked:
- explain whether it prepares AI prompt or starts existing flow
- if disabled or unavailable, explain why

Example:
"Document extraction prompt prepared. Review extracted claims before using them."

### 6. AI routing feedback
When Ask AI / AI Workspace actions are used:
- confirm the selected asset/context was passed
- explain next step

Example:
"AI context prepared for front.png. Open AI Command to review recommendations."

### 7. Mutation feedback
For existing mutation actions:
- approve
- needs review
- source of truth
- rename
- archive
- delete

Show success/error messages around existing handlers.
Do not rewrite the handlers.

### 8. Smart next steps
Add safe routing guidance only:
- Use in Campaign Studio
- Send to Media Studio
- Prepare for Publishing
- Review in Governance
- Create Workflow Task

These should be prompt/routing suggestions first, not auto-execution.

## Non-goals
- No backend changes.
- No API changes.
- No data schema changes.
- No automatic classification.
- No bulk approve/archive/delete.
- No AI extraction that writes data.
- No publish/send execution.

## Validation required
Run:
- node --check public/control-center/pages/library.js
- node --check public/control-center/pages/library/*.js
- node --check public/control-center/app.js
- node scripts/check-control-center-legacy-assets.js

## Browser QA
Confirm:
- Library loads
- no stuck loading
- selecting asset shows feedback
- preview shows feedback
- copy path shows feedback
- classify shows feedback
- review missing shows feedback
- extract docs shows feedback or unavailable explanation
- approve/review mutation feedback appears
- source-of-truth feedback appears
- archive/delete feedback appears
- AI routing feedback appears
- no duplicated architecture labels
- no legacy loaded text

## Rollback
If page breaks:
- git checkout -- affected production files
- do not commit
- record failure

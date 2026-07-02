# Integrations Step 2 Context Preservation and Compact Card Plan

## Status
Plan-only checkpoint before implementation.

## Baseline
- 1fcea5f Improve Integrations UX cleanup and feedback
- a481599 Add Integrations step 1 closeout
- 25b451d Add global UI UX system plan

## Page
Integrations

## Step 2 Goal
Upgrade Integrations from a stable Step 1 control tower into a more polished, compact, context-preserving operating surface.

## Why this step exists
Browser review after Step 1 confirmed:
- connector rows/cards are improved but still too large
- text hierarchy still needs tightening
- drawer open/close can make the user lose visual context
- selected connector should remain highlighted after drawer close
- scroll position should be preserved
- deeper explanatory text should move into drawer or diagnostics
- typography and colors should align with the new Global UI/UX System Plan

## Global UI/UX rules applied
This step must follow:
- compact card density
- one primary action per connector
- secondary actions visually quieter
- drawer as execution authority
- no silent clicks
- preserve selected state
- preserve scroll/context after drawer close
- no raw white surfaces
- no page-specific typography drift

## Non-negotiable constraints
- Do not change backend.
- Do not change API.
- Do not change data/projects.
- Do not rewrite bindIntegrationActions.
- Do not rewrite connector model/build pipeline.
- Do not remove existing data attributes.
- Do not change route behavior.
- Do not add destructive actions.
- Do not relink legacy files.
- Do not create duplicated CSS layers.

## Allowed production files for later implementation
Use smallest safe set:
- public/control-center/pages/integrations.js
- public/control-center/pages/integrations/cards.js
- public/control-center/pages/integrations/drawer.js
- public/control-center/styles/14-page-standard.css

Only touch render.js/layout.js if clearly required.

## Implementation intent

### 1. Compact connector rows/cards
Make connector rows smaller and easier to scan:
- shorter card height
- tighter metadata layout
- less paragraph text
- title + status + key metadata + action row
- keep Access needed and Setup method, but compact

### 2. Context preservation
When opening setup drawer:
- selected connector should be visibly highlighted.
- origin connector id should be remembered.

When closing setup drawer:
- selected connector should remain highlighted.
- scroll position should not jump.
- focus/context should return to the originating connector when safe.
- feedback should say which connector drawer was closed.

### 3. Drawer hierarchy
Drawer should show:
1. connector name and status
2. connection requirements
3. fields / validation
4. primary action
5. secondary actions
6. technical/status details

### 4. Text reduction
Cards should not show long explanations.
Move deeper text into:
- drawer
- diagnostics
- AI guidance
- details panel

### 5. Typography/color alignment
Use the Global UI/UX System Plan:
- card title 12.5–14px
- metadata 11–12px
- button text 11–12px
- badges 10–11px
- consistent border/surface/selected state
- no neon overuse

### 6. Feedback
Preserve existing feedback.
Improve if needed:
- setup drawer opened
- setup drawer closed
- connector selected
- test/sync/connect/reconnect action triggered

## Validation required
Run:
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/integrations/*.js
- node --check public/control-center/app.js
- node scripts/check-control-center-legacy-assets.js

## Browser QA required
Confirm:
- page loads
- no stuck loading
- connector rows are more compact
- drawer opens
- drawer closes
- selected connector remains highlighted
- scroll position does not jump badly
- fields visible
- test/connect/sync/reconnect actions preserved
- feedback appears
- no legacy loaded text
- no console errors

## Rollback
If page breaks:
- git checkout -- affected production files
- do not commit
- document failure

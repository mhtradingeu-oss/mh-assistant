# Integrations Step 3 Header and Information Architecture Plan

## Status
Plan-only checkpoint before implementation.

## Baseline
- 3b9065c Improve Integrations context preservation and compact cards
- 25b451d Add global UI UX system plan

## Page
Integrations

## Step 3 Goal
Make Integrations feel like a professional international Integration Control Tower by improving:
- header clarity
- information hierarchy
- progressive disclosure
- provider identity visuals
- sync health readability
- coverage priorities readability
- setup drawer information order

## Problems confirmed by browser review
- Header/overview is still too text-heavy.
- Metrics are shown as long stacked sentences.
- Recommended action needs stronger visual separation.
- Sync Health is still paragraph/list heavy.
- Coverage priorities are still dense.
- Drawer details are useful but need cleaner hierarchy.
- Provider identity can be improved with safe icons/initials.
- More info should be used for long explanations.

## Design direction

### 1. Executive Health Header
Replace long stacked overview text with compact metric cards:
- Total integrations
- Connected
- Missing required
- Failed / disconnected
- Readiness score
- Next action

Each metric should have:
- label
- number/status
- short helper only if needed

### 2. Recommended Next Action Card
One strong card:
- connector name
- why it matters
- primary CTA
- risk badge

Long explanation should move into expandable details.

### 3. Progressive Disclosure
Long explanatory text should be hidden behind:
- More info
- Why this matters
- Technical details
- Requirements

Rules:
- Show summary first.
- Details open only when needed.
- Do not remove data.

### 4. Provider Identity
Safe identity strategy:
- Use provider initials already available (WC, GA, SC, FB, IG, etc.).
- Add category-based generic icons only if already local/safe.
- Do not load remote logos.
- Do not introduce licensed external brand assets.
- If local brand assets exist, audit them first before use.

### 5. Sync Health Section
Convert to compact rows:
- connector
- status badge
- last sync/test
- source/derived indicator

Avoid repeated sentence:
"Derived from the latest connector sync timestamp..."

### 6. Coverage Priorities
Convert long paragraphs into compact priority rows:
- connector
- category
- status
- reason
- recommended next action

### 7. Setup Drawer
Improve drawer readability:
1. Header: connector + status
2. Requirements: access/setup/scope
3. Fields
4. Actions
5. More info / technical details

### 8. Global UI/UX Alignment
Follow:
- typography scale
- compact card density
- button hierarchy
- selected state
- feedback rules
- no raw white surfaces
- no neon overuse

## Constraints
- Do not change backend.
- Do not change API.
- Do not change data/projects.
- Do not rewrite bindIntegrationActions.
- Do not rewrite connector model/build pipeline.
- Do not remove existing data attributes.
- Do not change route behavior.
- Do not add destructive actions.
- Do not load remote logos.
- Do not relink legacy files.
- Do not create duplicated CSS layers.

## Allowed files for later implementation
Use smallest safe set:
- public/control-center/pages/integrations.js
- public/control-center/pages/integrations/cards.js
- public/control-center/pages/integrations/drawer.js
- public/control-center/styles/14-page-standard.css

Only touch render.js/layout.js if absolutely required and documented.

## Validation required
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/integrations/*.js
- node --check public/control-center/app.js
- node scripts/check-control-center-legacy-assets.js

## Browser QA required
Confirm:
- page loads
- header is compact and readable
- next action is clear
- connector rows remain compact
- sync health is scan-friendly
- coverage priorities are scan-friendly
- drawer opens/closes
- context is preserved
- selected connector remains highlighted
- no legacy loaded text
- no console errors

## Next step
Implement Step 3 only after this plan is reviewed and committed.

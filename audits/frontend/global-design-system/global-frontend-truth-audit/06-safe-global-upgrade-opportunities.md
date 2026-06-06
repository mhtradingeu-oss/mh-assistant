# 06 Safe Global Upgrade Opportunities

## Opportunity 1: Sidebar Platform Reframing

Goal:

- Make navigation communicate the AI Business Operating System.

Potential safe change:

- Rename nav groups in `index.html`.
- Keep route IDs and button data attributes unchanged.

Suggested future groups:

- Command: Home, AI Command
- Source & Setup: Setup, Library, Integrations
- Build: Workflows, Campaign Studio, Content Studio, Media Studio
- Grow & Intelligence: Publishing, Ads Manager, Insights, Research
- Customers: Customer Center
- Operations: Operations Overview, Task Center, Queue Center, Job Monitor, Notifications
- Control: Governance, Settings

Risk:

- Low functional risk if labels only.
- Medium visual risk on sidebar height/mobile.

## Opportunity 2: Page Header Contract

Goal:

- One standard non-Home page header pattern.

Potential safe change:

- Add a shared header primitive and adopt page by page.
- Do not change router metadata or page handlers.

Risk:

- Medium due to page-local hero/header CSS.

## Opportunity 3: AI Guidance Panel Standard

Goal:

- Make AI feel like one platform layer across pages.

Standard fields:

- Specialist
- Source context
- Suggested output
- Destination
- Safety boundary

Risk:

- Medium. Must avoid changing command execution or prompts that page handlers depend on.

## Opportunity 4: Source/Provenance Rail Standard

Goal:

- Turn Library handoff/source-of-truth into a global platform feature.

Candidate pages:

- Campaign Studio
- Content Studio
- Media Studio
- Publishing
- Ads Manager
- Research
- Governance
- Customer Center

Risk:

- Medium. Additive visual display only is safe; mutation or source persistence changes are not.

## Opportunity 5: Status Chip And Badge Normalization

Goal:

- Reduce visual noise from many chip/badge families.

Potential safe change:

- Create/standardize one semantic class family and map page-local badges slowly.

Risk:

- Medium-high because badge selectors are scattered across active CSS.

## Opportunity 6: Action Row Normalization

Goal:

- One primary action, restrained secondary actions, wrapping toolbar behavior.

Candidate pages:

- Ads Manager
- Integrations
- Workflows
- Content Studio
- Media Studio
- Settings

Risk:

- Medium. Must preserve button IDs and data attributes.

## Opportunity 7: Remove User-Facing Phase/Section Language

Goal:

- Replace implementation-oriented labels with operating language.

Examples:

- "Section 1" to "Budget"
- "Section 5" to "Creative readiness"
- "Action Prompts" to "Paid Growth Next Actions"

Risk:

- Low if text-only and selectors are unchanged.

## Opportunity 8: Empty CSS Folder Decision

Observation:

- `public/control-center/styles/integrations/*.css` files are currently empty.

Safe plan:

- Do not delete yet.
- Document whether these are placeholders or migration targets.
- If retained, future Integrations CSS should move there only after selector ownership is mapped.

Risk:

- Low documentation risk; medium implementation risk if load order changes.

## Opportunity 9: Browser QA Harness

Goal:

- Create repeatable page-by-page QA checklist before visual changes.

Required checks:

- Desktop, laptop, tablet, mobile.
- No horizontal overflow.
- Sidebar mobile behavior.
- Topbar action cluster.
- Command bar.
- AI dock.
- Route render.
- Primary actions remain clickable.
- No console errors.

Risk:

- Low.

## Opportunity 10: Route Metadata Alignment

Goal:

- Make topbar metadata and page-local titles use consistent product language.

Risk:

- Low for copy only, medium where page titles are also used in prompt/handoff text.

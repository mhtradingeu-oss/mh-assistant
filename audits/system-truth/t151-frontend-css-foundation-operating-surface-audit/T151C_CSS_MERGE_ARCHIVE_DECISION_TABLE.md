# T151C — CSS Merge / Archive / Delete Decision Table

## Status
Decision audit only. No production CSS changes.

## Baseline
- a036f3d Close Operations Centers runtime authority audit

## Purpose
Convert T151/T151A/T151B findings into a safe CSS cleanup direction before any merge, archive, delete, or redesign work.

## Non-Negotiable Rule
No CSS file, selector, or class may be deleted only because a simple scan marks it unused.

Deletion requires:
1. Source usage scan
2. Runtime route verification
3. Browser QA
4. Screenshot proof
5. No visual regression
6. Separate commit

## CSS File Decisions

| File | Decision | Reason | Allowed Next Action |
|---|---|---|---|
| `00-tokens.css` | KEEP / AUTHORITY | Design token source of truth | Extend only through approved token changes |
| `01-reset.css` | KEEP / AUTHORITY | Browser reset | Do not add page styles |
| `02-layer-system.css` | KEEP / AUTHORITY | Overlay/modal/toast/layer authority | Modify only for layer bugs |
| `03-app-shell.css` | KEEP / AUTHORITY | App shell and page root | Modify only for shell layout |
| `04-command-layer.css` | KEEP / SPECIALIZED | Command layer authority | Audit later with AI Command |
| `05-ai-layer.css` | KEEP / SPECIALIZED | AI dock/layer authority | Audit later with AI Command |
| `07-sidebar.css` | KEEP / AUTHORITY | Sidebar navigation | Modify only for sidebar |
| `08-components-foundation.css` | KEEP / COMPONENT AUTHORITY | Shared legacy components | Do not expand broadly; future extraction target |
| `09-operations-centers.css` | KEEP / PAGE OWNER | Operations-specific layout | Allowed only for Operations UX pass |
| `10-topbar-canonical.css` | KEEP / AUTHORITY | Topbar authority | Modify only for topbar |
| `12-pages.css` | ARCHIVE CANDIDATE / DO-NOT-EXPAND | Very large legacy override zone | No new broad rules; gradually extract or replace |
| `13-home-executive.css` | KEEP / PAGE OWNER | Home-specific executive surface | Audit during Home UX standardization |
| `14-page-standard.css` | COMPATIBILITY LAYER / DO-NOT-EXPAND | Standard page layer plus many compatibility overrides | Consolidate carefully; no broad redesign rules |
| `15-clean-operating-layer.css` | MERGE CANDIDATE | Contains clean operating primitives overlapping MHOS primitives | Review before merging into MHOS primitives |
| `mhos-action-primitives.css` | KEEP / FUTURE AUTHORITY | Button/action primitives | Candidate authority for future actions |
| `mhos-context-primitives.css` | KEEP / FUTURE AUTHORITY | Context/header primitives | Candidate authority for context ribbons |
| `mhos-executive-surface-primitives.css` | KEEP / FUTURE AUTHORITY | Operating surface primitives | Preferred foundation for Header/Main/Rail/AI/Action panels |
| `mhos-workflow-primitives.css` | KEEP / FUTURE AUTHORITY | Workflow/orchestration primitives | Candidate authority for workflow/step UI |
| `integrations/*.css` | KEEP / PAGE OWNER | Integrations-specific owner files | Audit during Integrations UX pass |

## Selector-Level Decisions

### Immediate Do-Not-Delete
The following are high-risk and must not be deleted without page-by-page runtime proof:
- `.btn`
- `.btn-primary`
- `.btn-secondary`
- `.btn-ghost`
- `.quick-action-btn`
- `.card`
- `.panel`
- `.page`
- `.is-active`
- `.is-open`
- `.is-visible`
- `.card-badge`
- `.std-context-*`
- `.std-action-*`
- `.std-ai-*`
- `.mhos-*`
- `.ops-*`
- `.library-*`
- `.aicmd-*`

## Merge Direction

### Direction 1 — Actions
Future button/action authority should move toward:
- `mhos-action-primitives.css`

But existing `.btn` should not be removed from old files until all pages are migrated and browser-tested.

### Direction 2 — Operating Surface
Future page layout authority should move toward:
- `mhos-executive-surface-primitives.css`
- `mhos-context-primitives.css`

### Direction 3 — Workflow
Workflow/step/orchestration UI should move toward:
- `mhos-workflow-primitives.css`

### Direction 4 — Legacy Cleanup
`12-pages.css` should become a legacy archive zone:
- Do not expand
- Do not delete all at once
- Extract page-by-page
- Remove only after route-specific Browser QA

### Direction 5 — Page-Specific Ownership
Page-specific layout should stay in page-specific CSS:
- Operations → `09-operations-centers.css`
- Home → `13-home-executive.css`
- Integrations → `integrations/*.css`

## International UX Target
The frontend should converge toward patterns used by modern operating platforms:
- clear page header and mission
- main workspace with data/entity focus
- right-side action/AI rail
- obvious safe next action
- explicit disabled/destructive states
- command/AI guidance separated from execution
- consistent empty/loading/error states
- no hidden mutation behind generic buttons
- no broad CSS overrides per page without ownership

Reference model categories for future UX research:
- Linear / Asana / Monday for task and operations clarity
- HubSpot / Salesforce for CRM and pipeline surfaces
- Zendesk / Intercom for customer operations
- Shopify Admin for commerce/admin clarity
- Notion / Airtable for flexible information surfaces
- Zapier / Make for workflow execution clarity
- Canva / Adobe Express / Runway for creative studio surfaces

## Required Next Step
T151D should create the page-by-page Operating Surface Readiness Map.

Only after T151D can we choose the first safe implementation target.

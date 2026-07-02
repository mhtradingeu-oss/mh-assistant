# Home International UX Upgrade Closeout

## Status

Implemented. Not committed.

## Target Page/Files

- Page: Home / Executive Command Center
- Route id preserved: `home`
- Root preserved: `data-page="home"`
- Updated:
  - `public/control-center/pages/home.js`
  - `public/control-center/pages/home/render-sections.js`
- CSS changed: none

## Audit Basis

- `audits/frontend/global-design-system/global-frontend-truth-audit/GLOBAL_FRONTEND_AUTHORITY_MAP_FINAL_UX_READINESS_CLOSEOUT.md`
- `audits/frontend/global-design-system/final-browser-qa/FINAL_FRONTEND_BROWSER_QA_PLAN.md`
- `audits/frontend/global-design-system/final-browser-qa/FINAL_FRONTEND_BROWSER_QA_REPORT.md`
- `audits/frontend/global-design-system/page-ux-upgrades/home-evidence/HOME_PRE_CODEX_EVIDENCE.md`

## UX Issues Found

- Home already had strong executive dashboard structure, but some labels still felt more technical than executive.
- Primary action language did not clearly explain that Home opens another workspace instead of executing work.
- AI specialist and prompt areas needed stronger safety wording that AI prepares guidance only.
- Action rail included workspace language that could be clearer for international SaaS users.
- Empty states were generic and did not guide the user toward the next safe handoff.
- Required preserved IDs needed alignment in the active rendered markup.

## Changes Implemented

- Reframed the header as an Executive Command Center with a concise project status summary.
- Added concise safety chips and helper copy stating that Home routes or prepares AI guidance only.
- Updated the next best action area to show the destination as a handoff and clarify no approval, publishing, sending, or record changes happen on Home.
- Replaced the active primary button ID with `homePrimaryActionBtn` and wired its existing handler behavior.
- Replaced the asset route button ID with `homeQuickAssetLibraryBtn` while preserving the Library route behavior.
- Simplified the action rail around owning workspaces: Setup, Library, and Campaign Studio.
- Strengthened AI specialist and AI prompt copy so prompts clearly prepare reviewed guidance in AI Command.
- Improved Home helper empty states in pure render helpers.
- Kept all changes copy/render/route-handoff scoped.
- Post-review cleanup reduced repeated visible headings and duplicate attention-card labels without changing handlers, CSS, or backend behavior.
- Post-review cleanup preserved destination ownership in `routeForAction` so integrations, publishing, ads, content, setup, library, campaign, operations, and AI Command still route to their owning pages.

## Authority Boundaries Preserved

- Home remains a projection and routing surface.
- Home still calculates and displays readiness, blockers, next best action, and AI specialist guidance.
- Home still prepares AI prompts through `quickCommandInput`.
- Home still navigates to owning workspaces for work that belongs outside Home.
- Home does not save, approve, publish, send, execute, upload, delete, archive, or mutate backend records.
- Destination pages continue to own destination behavior.

## Sensitive Items Not Touched

- No backend/API calls changed.
- No `data/projects` files touched.
- No app/router behavior changed.
- No AI Command behavior changed.
- No Setup, Library, Campaign Studio, Publishing, Governance, or Operations behavior changed.
- No disabled mutation controls enabled.
- No broad CSS cleanup performed.
- No unrelated pages modified.
- No commit created.

## Validation Commands

- `node --check public/control-center/pages/home.js`
- `node --check public/control-center/pages/home/render-sections.js`

## Browser QA Checklist

- Home opens on route id `home`.
- Home root renders as `data-page="home"`.
- Header communicates project status, readiness, blockers, and next focus within 5 seconds.
- `homePrimaryActionBtn` opens the recommended owning workspace or prepares AI guidance only.
- `homeAskNextActionBtn` prepares an AI explanation prompt through `quickCommandInput`.
- `homeOpenOperationsBtn` opens Operations Centers.
- `homeQuickReviewReadinessBtn` opens Setup.
- `homeQuickAssetLibraryBtn` opens Library.
- `homeQuickStartCampaignBtn` opens Campaign Studio.
- `homeQuickOpenAiBtn`, `homeOpenAiTeamBtn`, `homeOpenFullAiTeamBtn`, and prompt buttons open AI Command or prepare AI guidance only.
- No Home button implies approval, publishing, sending, upload, delete, archive, execution, or backend mutation.
- Empty blocker/activity/AI states remain understandable.
- Desktop and mobile layouts have no text overlap or visual crowding.

## Known Remaining Issues

- Browser QA was not run in this implementation pass.
- The page still depends on existing design-system classes; no Home-specific CSS was added.
- A deeper destination-authority review remains out of scope for this page-specific patch.

## Rollback Path

- Revert the changes in:
  - `public/control-center/pages/home.js`
  - `public/control-center/pages/home/render-sections.js`
  - `audits/frontend/global-design-system/page-ux-upgrades/HOME_INTERNATIONAL_UX_UPGRADE_CLOSEOUT.md`
- No database, backend, project data, or router rollback is required.

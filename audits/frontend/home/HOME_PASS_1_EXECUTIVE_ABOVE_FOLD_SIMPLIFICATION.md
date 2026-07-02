# Home Pass 1 - Executive Above-Fold Simplification

## Summary of what changed

- Removed the standalone Executive Health Strip from the first viewport so it no longer competes with the header and Next Best Action.
- Kept the executive header as the opening state summary.
- Promoted the existing Next Best Action panel directly below the header as the primary action surface.
- Kept the compact executive signal row above the fold with the existing first four capability cards: System Health, Project Readiness, Automation, and Intelligence.
- Moved blockers into a concise Exceptions section immediately after the signal row.
- Moved Operational Readiness, Active Campaign, and Operating State Overview below the primary decision area.
- Left Quick Navigation, AI Guidance, AI workforce content, and Recent Activity lower on the page.
- Added scoped Home CSS for the existing Next Best Action, signal, exception, and secondary AI/workforce surfaces.

## Files changed

- `public/control-center/pages/home.js`
- `public/control-center/styles/13-home-executive.css`
- `audits/frontend/home/HOME_PASS_1_EXECUTIVE_ABOVE_FOLD_SIMPLIFICATION.md`

## What was intentionally not changed

- No backend changes.
- No data/project changes.
- No new APIs.
- No router, state, app, shared context, or runtime changes.
- No new CSS files.
- `buildExecutiveData()` was not changed.
- `selectCurrentProject()`, `selectOperationsSnapshot()`, and authority projection calls were not changed.
- `render-sections.js` was not touched.
- Quick Navigation, AI Guidance, AI workforce content, and Recent Activity were preserved.

## Handler/interaction preservation notes

- Preserved `homeRoute.template`, `homeExecRoot`, and `data-page="home"`.
- Preserved all required handler IDs:
  - `homeNextActionBtn`
  - `homeAskNextActionBtn`
  - `homeOpenOperationsBtn`
  - `homeOpenAiTeamBtn`
  - `homeQuickStartCampaignBtn`
  - `homeQuickUploadAssetBtn`
  - `homeQuickConnectPlatformBtn`
  - `homeQuickReviewReadinessBtn`
  - `homeQuickOpenAiBtn`
  - `homePromptNextBtn`
  - `homePromptReadinessBtn`
  - `homePromptLaunchBtn`
  - `homePromptPlanBtn`
- Preserved `data-role-id` on AI workflow role elements.
- Preserved existing `navigateTo` route names.
- Preserved `setGlobalAiPrompt()`, `openAiWithPrompt()`, and `handleAiRoleClick()`.
- Preserved `escapeHtml` usage in new and moved markup.

## UX improvements made

- The first viewport now follows the requested rhythm: header, one clear next action, compact signals, concise exceptions.
- The removed health strip reduces repeated status/confidence/escalation messaging above the fold.
- The signal row no longer includes an explanatory note that competed with the decision surface.
- Blockers now show only active blocker categories when there are blockers, making the exception section shorter and easier to scan.
- Operational readiness and campaign details remain available, but no longer interrupt the primary decision flow.
- AI workforce and escalation content remains present but is styled as secondary supporting context.
- Mobile CSS keeps the header, signals, actions, and section heads from crowding horizontally.

## Remaining risks

- This pass does not change the underlying data model, so low-quality or overly long recommendation text can still make the Next Best Action panel tall.
- The first four capability cards still come from existing capability order; Active Campaign remains lower because Intelligence is currently the safer first-four existing value.
- AI role workflow items keep their existing structure and handler assumptions; this pass does not repair pre-existing selector mismatches outside the requested simplification.
- Browser QA was not run in this pass; only syntax validation was requested.

## Browser QA checklist

- Home loads without console errors.
- Header appears first and clearly shows project state and system health.
- Next Best Action appears immediately below the header and is visually primary.
- `homeNextActionBtn` opens the computed route.
- `homeAskNextActionBtn` opens AI Command with the explanatory prompt.
- Signal cards remain compact and readable on desktop and mobile.
- Exception section shows active blocker categories only when blockers exist.
- No-blocker state shows a concise clear state.
- Operational Readiness and Active Campaign appear below the primary decision area.
- Quick Navigation buttons still route to setup, campaign studio, library, integrations, operations centers, and AI Command.
- AI prompt buttons still prefill the quick command input.
- AI workforce content remains visible and secondary.
- Recent Activity remains lower on the page.
- No text overlap in mobile or desktop viewports.

## Recommended next step

Run a browser QA pass on Home across a blocker-heavy project and an empty/no-data project, then decide whether Active Campaign should replace Intelligence in the compact signal row.

## Pass 1B browser QA fix

After browser QA, the Home first viewport, Exceptions, Operational Readiness, and secondary navigation were acceptable.

The AI Workforce Room still appeared broken because role cards collapsed into a narrow vertical column with a large empty area beside it.

A CSS-only Pass 1B fix was added to:
- restore the AI workforce role list into a responsive grid
- remove the large empty visual lane
- keep role cards readable and compact
- keep orchestration pressure and escalation indicators secondary
- preserve all IDs, `data-role-id`, handlers, routes, APIs, runtime, backend, and project data

## Pass 1C AI Workforce compact fallback

Pass 1B did not fully fix the AI Workforce Room because the role cards still collapsed into a narrow column with a large empty area.

A stricter CSS-only fallback was added to:
- force the workforce room into a compact block
- display role cards as wrapping compact cards
- remove the large empty visual lane
- keep orchestration pressure and escalation information secondary
- preserve all Home handlers, IDs, `data-role-id`, routes, APIs, backend, runtime, and project data

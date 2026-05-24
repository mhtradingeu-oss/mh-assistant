# Home Simplification Readiness Audit

## Executive conclusion

Home is already intended to be the executive entry point: it summarizes project readiness, system health, blockers, active campaign state, AI guidance, and the next operational route.

The simplification should not be a redesign. The smallest safe move is to preserve the existing data build and handlers, then calm the render hierarchy so the first screen answers one question: "What is happening, what matters, and what should I do next?"

Current Home has the right ingredients, but too many of them compete above the fold. It mixes executive header, health strip, Next Best Action, KPI grid, operational readiness, campaign state, blockers, system board, quick navigation, AI prompts, workforce flow, escalation lane, and activity feed in one dashboard rhythm.

First implementation should change only Home render markup and Home CSS. Do not touch runtime, router, state, API, backend, project data, or handler contracts.

## Current Home strengths

- Home has a clear executive intent through `homeRoute.meta`, `disableStandardLayout`, and the `homeExecRoot` render surface.
- `buildExecutiveData()` already creates useful executive primitives: project name, readiness, connector coverage, system score, blockers, active campaign, next action, AI guidance, activity, and status board.
- Next Best Action exists as a first-class object with recommendation, route, why-it-matters, urgency, impact, continuation, confidence, and escalation summaries.
- Runtime safety is relatively good because render output is escaped and interaction wiring is localized after `root.innerHTML`.
- Existing buttons route to established surfaces through `navigateTo()` rather than inventing new APIs.
- AI prompt buttons are practical: they prefill the global quick command input and route to `ai-command`.
- Role projection is data-derived from authority projection, with fallback roles if projected members are unavailable.

## Current Home problems

- The first viewport contains too many executive summaries: smart header, executive health strip, Next Best Action, and KPI/signal grid.
- The page reads like an operational dashboard instead of a calm entry point because it exposes many metrics before the user has a simple decision frame.
- There are competing visual systems: `home-*` executive cards, `mhos-*` clean surfaces, `executive-signal-*` cards, and generic `card` patterns.
- Several newer `mhos-*` classes are used in Home markup but are not defined in `13-home-executive.css`; only a small amount of Home list/meta styling appears in `12-pages.css`.
- `renderHomeExecutiveIntro()` remains exported from `render-sections.js` but is not used by the current inline Home render, creating duplicate/legacy UI vocabulary.
- The AI guidance area is too dense: prompt grid, workforce room, workflow chain, orchestration pressure, and escalation lane all compete for the same mental job.
- Quick navigation duplicates the routing intent already represented by Next Best Action and header/action surfaces.
- Operating State Overview duplicates signals already shown in the header, health strip, snapshot grid, blocker panel, and Next Best Action metadata.
- Blockers are useful but currently appear as a full dashboard section rather than a concise executive exception area.
- Recent Activity is correctly lower priority, but it still carries dashboard weight as a full card panel.

## Recommended final Home rhythm

1. Executive state: project, one-line status, system health, and status badge.
2. Next Best Action: one clear recommendation, why it matters, destination, and two actions.
3. Key executive signals: at most 3 or 4 compact signals, only if they clarify the decision.
4. Exceptions: blockers/escalations as a concise "needs attention" section.
5. Context below: active campaign and operational readiness.
6. Secondary support: AI guidance, quick navigation, role/workforce context, recent activity.

This keeps Governance's executive rhythm in spirit: state first, decision second, supporting evidence third. It should not copy Governance's exact layout.

## Sections to keep above the fold

- Executive header:
  - Keep project name, one-line summary, system health score, and status badge.
  - Reduce visual drama if needed; it should feel like an operating header, not a hero.
- Next Best Action:
  - Keep immediately after the header.
  - It is the page's most important action surface.
  - Preserve `homeNextActionBtn` and `homeAskNextActionBtn`.
- Minimal executive signal row:
  - Keep only the highest-signal cards if space allows.
  - Recommended: System Health, Project Readiness, Automation/Failures, Active Campaign.
  - Avoid showing the signal row as a heavy dashboard wall.

## Sections to simplify

- Executive Health Strip:
  - Merge its useful data into the header or Next Best Action metadata.
  - It currently repeats status, confidence, escalations, approvals, and summary.
- Snapshot/KPI grid:
  - Keep the data, simplify the presentation.
  - Remove note-like explanatory UI from the main visual path.
- Critical Gaps & Blockers:
  - Keep as exception summary.
  - Collapse visual density by showing top blockers first, not four equal columns by default.
- Operating State Overview:
  - Convert to secondary compact status or remove from the first screen.
  - Its Ready/Missing/Failed/Needs Attention/Completed/Next Step cards duplicate other sections.
- AI Guidance:
  - Keep the purpose clear: AI explains the next action and can prepare a plan.
  - Reduce from a large multi-part panel to a smaller guidance area with prompt actions.
- AI Workforce Room:
  - Treat as secondary context, not primary Home content.
  - Role handoffs can live lower on the page or behind the AI guidance surface.
- Quick Navigation:
  - Keep available, but lower and quieter.
  - It should not compete with Next Best Action as the primary route.

## Sections to move lower

- Active Campaign:
  - Valuable context, but not essential before the user understands current state and next action.
- Operational Readiness:
  - Move below the executive decision area unless the active project is explicitly in launch readiness mode.
- Operating State Overview:
  - Move lower or simplify into a compact secondary block.
- Navigate & Execute:
  - Move below context sections as fallback navigation.
- AI Workforce Room, orchestration pressure, escalation lane:
  - Move lower inside AI guidance or reduce substantially.
- Recent Activity:
  - Keep last or near-last as system pulse/history.

## Interaction and handler safety notes

- Preserve all existing IDs used by handlers:
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
- Preserve `data-role-id` on AI role/workflow elements.
- Preserve classes used by handler selection:
  - `.home-ai-team-card`
  - `.mhos-specialist` if it remains in markup.
- Preserve `setGlobalAiPrompt()`, `openAiWithPrompt()`, and `handleAiRoleClick()` behavior.
- Preserve `navigateTo()` route names currently used by Home.
- Preserve `homeRoute.template`, `homeExecRoot`, and `data-page="home"`.
- Do not remove escaped rendering via `escapeHtml`.
- Do not change `selectCurrentProject()`, `selectOperationsSnapshot()`, or authority projection calls.
- Do not change fallback data behavior; empty states are part of runtime safety.

## Allowed files for first implementation

- `public/control-center/pages/home.js`
- `public/control-center/pages/home/render-sections.js`
- `public/control-center/styles/13-home-executive.css`
- `public/control-center/styles/12-pages.css` only if an existing shared Home selector must be adjusted.

## Forbidden files

- Backend files.
- `data/projects/**`.
- `public/control-center/app.js`.
- Router files.
- `public/control-center/state.js`.
- API/client files.
- Runtime/orchestrator files.
- New API endpoints.
- New CSS files.

## Smallest safe first implementation pass

1. In `home.js`, keep `buildExecutiveData()` unchanged unless a tiny presentational field is already available and safer to reuse.
2. Reorder render output to:
   - header
   - Next Best Action
   - compact signal row
   - concise blockers/exceptions
   - active campaign and operational readiness
   - AI guidance
   - quick navigation
   - recent activity
3. Remove or visually absorb the Executive Health Strip rather than keeping it as a separate above-fold section.
4. Keep all current handler IDs and route buttons somewhere in the DOM, even if moved lower.
5. Reduce Operating State Overview from a 6-card dashboard to a lower secondary summary, or omit it only if its handler-free markup is fully redundant.
6. Reduce AI Guidance to a clearer prompt/action area; move workforce flow and escalation lane lower or make them visually secondary.
7. In `13-home-executive.css`, tune spacing, density, and hierarchy for the existing selectors.
8. Avoid adding new CSS architecture; prefer consolidating existing `home-*` and currently used `mhos-*` selectors.
9. Do not alter `render-sections.js` except to remove unused legacy helper output only if confirmed safe in the implementation pass.

## Browser QA checklist

- Home loads with no console errors.
- First viewport clearly shows project state, system health, and one next action.
- `homeNextActionBtn` opens the computed route and still preloads AI prompt when route is `ai-command`.
- `homeAskNextActionBtn` opens AI Command with the explanatory prompt.
- Quick action buttons still route to setup, campaign studio, library, integrations, operations centers, and AI Command.
- AI prompt buttons still prefill the quick command input.
- AI role/workflow items still open role-specific AI prompts.
- Empty project/no data state still renders readable copy and no broken cards.
- Blocker-heavy state still exposes integrations, assets, failed jobs, and readiness gaps.
- Mobile viewport does not stack so much above the fold that Next Best Action disappears below low-value metrics.
- No text overlaps in header, signal cards, buttons, blocker summaries, or AI prompt cards.

## Recommended next prompt

Implement the smallest safe Home simplification pass from `audits/frontend/home/HOME_SIMPLIFICATION_READINESS_AUDIT.md`.

Rules:
- Modify only `public/control-center/pages/home.js`, `public/control-center/pages/home/render-sections.js` if necessary, and `public/control-center/styles/13-home-executive.css`.
- Do not touch backend, data, runtime, router, state, API, or create new CSS files.
- Preserve all existing handler IDs, `data-role-id`, route names, and AI prompt behavior.
- Keep Home as a calmer executive entry point: state, next action, supporting signals, exceptions, then secondary context.

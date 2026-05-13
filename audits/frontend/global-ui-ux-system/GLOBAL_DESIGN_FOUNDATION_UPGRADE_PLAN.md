# MH-OS Global Design Foundation Upgrade Plan

## Status
Plan-only audit for `architecture/frontend-consolidation-v1`.

No production CSS, JavaScript, backend, API, data, runtime, legacy, or app shell files were edited by this report.

## Reviewed Sources
- `public/control-center/styles/00-tokens.css`
- `public/control-center/styles/01-reset.css`
- `public/control-center/styles/02-layer-system.css`
- `public/control-center/styles/03-app-shell.css`
- `public/control-center/styles/08-components-foundation.css`
- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/ui/page-standard.js`
- `public/control-center/design-system/DESIGN_SYSTEM_ROADMAP.md`
- `audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_PLAN.md`
- `audits/frontend/master-upgrade-protocol/FULL_PAGE_EXPERIENCE_UPGRADE_PROTOCOL.md`

## 1. Current Design System Map

| Area | Current owner | Notes |
| --- | --- | --- |
| Design tokens | `public/control-center/styles/00-tokens.css` | Owns color aliases, surface aliases, spacing scale, radii, shadows, typography size variables, shell dimensions, and transition speeds. This should remain the only token/theme source. |
| Reset baseline | `public/control-center/styles/01-reset.css` | Owns box sizing, body margin, control font inheritance, media max width, and `[hidden]`. It should stay tiny and non-visual. |
| Layering and global runtime surfaces | `public/control-center/styles/02-layer-system.css` | Owns z-index tokens, loading overlay, loading card/spinner, global message/error toasts, fatal error panel, and startup trace/unlock surfaces. |
| App/workspace layout | `public/control-center/styles/03-app-shell.css` | Owns body background/font, app shell grid, sidebar/main workspace layout, scroll behavior, page root sizing, and active page display. |
| Buttons, cards, forms, badges, grids, empty/error/loading states | `public/control-center/styles/08-components-foundation.css` | Primary shared component foundation. It currently defines `.btn`, `.quick-action-btn`, `.std-action-btn`, `.std-ai-btn`, `input/select/textarea`, `.card`, `.panel`, metric/status cards, `.badge`, `.card-badge`, grid utilities, list/state surfaces, modals, and code blocks. |
| Page headers and standard page shell | `public/control-center/styles/14-page-standard.css` plus `public/control-center/ui/page-standard.js` | `page-standard.js` generates `.std-page-shell`, `.std-context-ribbon`, `.std-smart-strip-compact`, metrics, and header actions. `14-page-standard.css` styles those surfaces, but also contains global recovery rules and large Library/Integrations page-scoped sections. |
| Page-specific surfaces | `public/control-center/styles/12-pages.css` | Intended owner for Home, Setup, Library, Content, AI Workspace, and Workflows-specific layout/surface rules. It already contains Workflows `.wfexec-operating-strip`. |
| Roadmap/protocol direction | `DESIGN_SYSTEM_ROADMAP.md`, `GLOBAL_UI_UX_SYSTEM_PLAN.md`, `FULL_PAGE_EXPERIENCE_UPGRADE_PROTOCOL.md` | Establish the design direction: compact operational pages, consistent typography, clear button hierarchy, action/decision rails, AI guidance, feedback, and page-by-page safe implementation. |

Important adjacency: the frontend tree also has page-scoped CSS such as `09-operations-centers.css`, `13-home-executive.css`, and `styles/integrations/*`. These should not be treated as new global foundations; they are page/domain layers.

## 2. Duplication Risks

### Repeated Button Styles
- `08-components-foundation.css` already owns `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-warning`, `.btn-sm`, `.quick-action-btn`, `.std-action-btn`, and `.std-ai-btn`.
- `14-page-standard.css`, `12-pages.css`, `09-operations-centers.css`, and `13-home-executive.css` all add scoped button sizing/shape overrides.
- `workflows.js` renders many `.wfexec-btn`, `.wfexec-btn-primary`, `.wfexec-btn-secondary`, and `.wfexec-btn-ghost` elements, but only the Workflows operating strip is currently styled in the reviewed CSS. Rebuilding Workflows should not create a second button hierarchy.

Risk: button hierarchy drifts by page, with every page inventing primary/secondary/ghost again.

### Repeated Card Styles
- `08-components-foundation.css` owns `.card`, `.panel`, `.data-card`, `.kpi-card`, `.metric-card`, `.status-card`, `.action-card`, `.ai-panel`, and standard side/status cards.
- `14-page-standard.css` redefines `.page .card`, `.page .panel`, `article[class*="card"]`, and `div[class*="card"]` with broader recovery styles.
- `12-pages.css` defines many page-specific card-like classes, including Library, Home, Setup, and Content variants.
- Library and Integrations have additional dense page-specific card rules in `14-page-standard.css`.

Risk: global card changes can unintentionally override Library/Integrations or create double borders/radii/shadows.

### Repeated Headers
- `08-components-foundation.css` still defines `.std-page-header` and `.page-header`.
- `14-page-standard.css` defines the newer `.std-context-ribbon` header and hides old `.std-page-header` surfaces.
- Multiple page modules render custom headers or local section heads.

Risk: old and new header systems coexist, causing inconsistent page openings and forcing override CSS.

### Repeated Page Shells
- `03-app-shell.css` owns the true application layout and workspace scroll container.
- `14-page-standard.css` owns `.std-page-shell`.
- `12-pages.css` owns page roots like `.home-command-center`, `.setup-wizard-shell`, `.library-smart-shell`, `.content-smart-root`, and `.aicmd-shell`.
- `workflows.js` currently opts out of the standard layout with `disableStandardLayout: true` and renders `.wfexec-shell`.

Risk: each page rebuild can duplicate page shell, header, summary strip, action rail, and AI panel patterns.

### Repeated Page-Specific CSS in Global Files
- `14-page-standard.css` currently contains extensive `[data-page="library"]` and `[data-page="integrations"]` CSS.
- `08-components-foundation.css` contains selectors that reference page-specific classes such as setup, library, and home names.
- `12-pages.css` contains the Workflows operating strip, which is acceptable as page-specific, but should not grow into a second global foundation.

Risk: global files become the place for urgent page fixes, making future global changes unsafe.

## 3. Recommended Global Visual Standard

### Typography Scale
Use tokenized, fixed sizes from `00-tokens.css`; do not introduce page-specific random font sizes.

- Eyebrow/badge: 10-11px, uppercase, restrained letter spacing.
- Metadata/helper text: 11-12px.
- Button text: 11.5-13px depending on density.
- Body text: 12-14px.
- Card title: 13-14px.
- Section title: 14-15px.
- Page title: 16-18px for dense operational screens.
- Large metric value: 20-24px, only for KPI values.

Avoid viewport-scaled typography for operational UI. Use responsive layout and wrapping, not `vw`-driven font size.

### Spacing Scale
Keep the existing token rhythm:

- 4px: micro gaps.
- 8px: compact internal row gap.
- 10-12px: dense card padding and control groups.
- 14-16px: standard panel/card padding and section gaps.
- 20-24px: major page group gaps.
- 32-40px: rare high-level separation only.

All future global spacing should map back to `--space-*` tokens or a small alias added to `00-tokens.css`.

### Card Standard
- Default operational card: `1px` token border, subtle dark translucent surface, `--radius-md` or `--radius-lg`, compact padding, no heavy decorative shadow.
- Executive/header card: slightly stronger surface, `--radius-lg`, restrained shadow.
- Metric card: title/label, value, one metadata line, optional tone badge.
- Selected card: border/focus ring accent, not a totally different surface.
- Danger card/zone: separated by border/top divider and danger tone, not just a red button.

Future shared card classes belong in `08-components-foundation.css`. Page-only card placement belongs in `12-pages.css` or a page-scoped file.

### Button Hierarchy
Use the existing `.btn` system as the only global button hierarchy.

- `.btn-primary`: one main action per panel or item group.
- `.btn-secondary`: normal supporting action.
- `.btn-ghost`: low-emphasis utility/routing action.
- `.btn-danger`: destructive action, visually separated.
- `.btn-warning`: caution/repair action.
- `.btn-sm`: compact toolbar/action rail use.

Avoid new button systems such as page-local `*-btn-primary` unless they are thin aliases to `.btn`.

### Input/Form Standard
- Global control base remains `input`, `select`, `textarea`, `.setup-input`, `.setup-textarea`.
- Standard form row: label, control, helper/status line.
- Required/missing state: warning border/background and concise helper.
- Invalid/error state: danger border/background and actionable message.
- Focus state: one tokenized focus ring; no page-specific focus colors.
- Dense filters/toolbars may use compact height, but should not redefine the full input visual language.

### Page Header Standard
Use the `page-standard.js` model:

1. `.std-page-shell`
2. `.std-context-ribbon`
3. Eyebrow, title, description
4. Context metric chips
5. Header actions
6. `.std-smart-strip-compact` for the recommended next move
7. `.std-main-content-slot`

The old `.std-page-header` should remain compatibility-only until every page is migrated and verified.

### Loop/Stepper Component Standard
Create one reusable loop/stepper pattern before rebuilding Workflows:

- Container: compact vertical list or responsive row.
- Step marker: number/check/status icon slot.
- Step body: title, short status, optional detail.
- States: `.is-complete`, `.is-active`, `.is-pending`, `.is-warning`, `.is-danger`.
- Optional action slot per step.

Reusable stepper styling belongs in `08-components-foundation.css`; Workflows-specific sequencing, automation copy, and grid placement belong in `12-pages.css`.

### Status Badge/Chip Standard
Use `.badge`, `.card-badge`, and `.std-context-chip` as the tone foundation.

- Required tones: neutral, success, warning, danger, info.
- Badge text: short noun/adjective, no sentence badges.
- Status colors must use tokens/aliases from `00-tokens.css`.
- Do not create separate Library, Integrations, Workflows, AI, and Operations badge palettes.

### Action Panel Standard
A reusable action panel should follow this order:

1. Selected item summary.
2. Status/readiness.
3. Primary action.
4. Secondary actions.
5. Routing/handoff actions.
6. Danger zone.
7. Technical details in progressive disclosure.

Shared panel primitives belong in `08-components-foundation.css` or `14-page-standard.css` if they are tied to the standard page shell. Page-specific content and placement belong in `12-pages.css` or scoped page CSS.

### AI Guidance Panel Standard
AI guidance should be operational, not decorative:

- Recommended next step.
- Why it matters.
- Remaining risk/gap.
- Suggested destination.
- One Ask/Open AI action where appropriate.

Avoid duplicating every normal action button inside AI guidance. The AI panel should clarify the next decision, not become a second toolbar.

### Empty State Standard
Use one empty-state model:

- Short title.
- One sentence of context.
- Optional primary recovery action.
- Optional secondary route.

Empty/loading/error states should use `.empty-state`, `.empty-box`, `.loading-state`, and `.error-state` rather than page-local equivalents.

### Feedback/Status Surface Standard
- Global transient feedback remains in `02-layer-system.css` via `.global-message` and `.global-error`.
- Inline status surfaces should be shared components in `08-components-foundation.css`.
- Every meaningful action must provide feedback.
- Feedback must distinguish frontend routing/draft preparation from backend success.

### Dark Premium Theme Standard
Keep one dark operating theme in `00-tokens.css`.

- Deep navy background and elevated dark surfaces.
- Cyan/teal accent used sparingly for primary and AI/context cues.
- Success/warning/danger colors consistent across badges, cards, forms, and feedback.
- No raw white strips inside dark operational pages except true document previews.
- No new theme file unless a future explicit requirement proves tokens cannot cover the need.

### Safe Motion/Effects Standard
- Use `--transition-fast`, `--transition-base`, and `--transition-slow`.
- Hover lift should stay subtle, usually `translateY(-1px)`.
- Loading shimmer is acceptable only for loading/skeleton states.
- Add/maintain `prefers-reduced-motion` handling before expanding animation.
- Avoid effects that block clicks, obscure text, or create layered pointer-event bugs.

## 4. Exact Safe Implementation Strategy

### File Responsibilities

| File | Safe future changes |
| --- | --- |
| `00-tokens.css` | Add missing token aliases for typography scale, line-height, font weight, focus ring, status/info colors, component radii, and surface levels. Do not add selectors. Do not create a new theme file. |
| `01-reset.css` | Leave mostly unchanged. Only add browser normalization if a real cross-browser bug is proven. |
| `02-layer-system.css` | Keep z-index, loading, startup, toast, and fatal surfaces here. Add only global feedback/layer primitives here. Do not add page layout or component card styles. |
| `03-app-shell.css` | Keep viewport, shell grid, workspace scroll, and page activation here. Do not tune page cards, headers, or Workflows layout here. |
| `08-components-foundation.css` | Consolidate shared buttons, cards, forms, badges, empty/error/loading states, status chips, action panel primitives, AI guidance primitives, and reusable stepper/loop primitives. New shared components should be opt-in and low-specificity. |
| `14-page-standard.css` | Keep `.std-page-shell`, `.std-context-ribbon`, `.std-smart-strip-compact`, standard header metrics/actions, and page-standard interaction safety here. Do not add more Library, Integrations, or Workflows page-specific styling here. |
| `12-pages.css` | Keep page-specific layout/surface rules here, including Workflows-specific grids, operating strip, catalog/result placement, and page-only density adjustments. Do not define new global button/card/form systems here. |
| `page-standard.js` | Change only standard page shell markup, route copy, and standard header actions when needed. It already contains Workflows route copy, but Workflows currently opts out through `disableStandardLayout: true`. |

### What Must Not Be Changed During Global Foundation Work
- Do not rename existing global classes.
- Do not delete compatibility selectors before all current pages are verified.
- Do not add broad overrides like `.page div[class*="card"]` unless there is a documented emergency.
- Do not increase `!important` usage.
- Do not move Library/Integrations CSS during the first global token/component pass.
- Do not touch route core, API behavior, backend, runtime authority, data, or legacy relinks.

### Avoid Breaking Library and Integrations
Library and Integrations are the highest-risk pages because their current polish depends on scoped CSS in `14-page-standard.css` plus additional page modules.

Safe approach:

1. Add new tokens and shared opt-in component classes first.
2. Preserve all existing Library/Integrations selectors.
3. Avoid changing `.card`, `.panel`, `.btn`, `.card-badge`, and global input defaults until a before/after screenshot pass is ready.
4. Do not alter `[data-page="library"]` or `[data-page="integrations"]` blocks as part of Workflows preparation.
5. When a shared component replaces a Library/Integrations pattern, migrate one pattern at a time with screenshots and rollback notes.

### Validation for Global Changes
For any future implementation pass:

1. Confirm no duplicate global CSS/theme files were created.
2. Confirm forbidden files have no diff.
3. Run JS syntax checks for any touched JS:
   - `node --check public/control-center/ui/page-standard.js`
   - `node --check public/control-center/pages/workflows.js` if Workflows is touched
   - `node --check public/control-center/app.js` only as validation, not editing
4. Run the existing frontend asset/legacy check if available:
   - `node scripts/check-control-center-legacy-assets.js`
5. Use `rg` to check that no new global button/card systems were introduced.
6. Browser QA at desktop and mobile widths for Home, Setup, Library, Integrations, AI Workspace, and Workflows.
7. Specifically verify:
   - Library upload/drop zone still works.
   - Library inspector/action panel still preserves selection.
   - Integrations drawer still opens/closes and preserves context.
   - Standard page header metrics/actions still render.
   - Workflows controls remain clickable.
   - Global messages/errors are visible and not hidden behind overlays.

## 5. Workflows Dependency

### Global Components Workflows Should Use
When Workflows is rebuilt, it should depend on existing/future global foundation pieces:

- Standard page header/shell from `page-standard.js` and `14-page-standard.css`, unless a documented Workflows-specific reason requires opt-out.
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, and `.btn-sm` from `08-components-foundation.css`.
- `.card`/`.panel` for section surfaces.
- `.card-head`/`.panel-header` for section headings.
- `.card-badge`/`.badge` and standard tone classes for readiness/status.
- Global `input`, `select`, `textarea`, `.setup-input`, or future shared form classes for builder inputs.
- `.empty-state`, `.empty-box`, `.loading-state`, and `.error-state` for result/empty/error surfaces.
- Future shared loop/stepper component for automation steps and workflow progress.
- Future shared action panel and AI guidance panel primitives for selected workflow actions and recommendations.

### What Should Remain Page-Specific in `12-pages.css`
Workflows-specific CSS should live in `12-pages.css` unless it becomes clearly reusable:

- `.wfexec-shell` layout.
- Workflows grid layout and left/right workspace composition.
- Workflow overview/stat grid placement.
- Catalog card layout and selected workflow density.
- Execution result layout.
- Automation log/result placement.
- Workflows operating strip.
- Workflows-specific responsive behavior.

If the loop/stepper becomes reusable across Integrations, Publishing, Operations, and Workflows, the base stepper belongs in `08-components-foundation.css`; only Workflows placement stays page-specific.

### What Should Not Be Duplicated Inside `workflows.js`
- No inline `<style>` blocks.
- No new button hierarchy such as standalone `.wfexec-btn-primary` styling.
- No card, panel, badge, input, empty, error, loading, or header CSS encoded in JS.
- No duplicate page header/context ribbon markup if standard layout can safely be enabled.
- No duplicate global feedback/toast mechanism.
- No backend/API/runtime assumptions in UI rebuild code.
- No repeated action buttons with equal visual weight across recommendation, builder, catalog, and result panels.

Current note: `workflows.js` has `disableStandardLayout: true` even though `page-standard.js` includes Workflows route copy/actions. A future Workflows rebuild should deliberately decide whether to remove that opt-out after validation or keep it and reuse the same standard header structure manually.

## 6. Forbidden Files

Do not edit these unless explicitly approved:

- `public/control-center/app.js`
- `public/control-center/api.js`
- `public/control-center/index.html`
- `backend`
- `runtime`
- `data`
- `legacy`

Also avoid editing route core, connector pipelines, publishing mutation logic, workflow execution logic, auth/session logic, and runtime authority during design foundation work.

## 7. Risk Level and Rollback Plan

### Current Report Risk
Low. This report is documentation only.

### Future Implementation Risk
Medium to high, because the global CSS is loaded across many pages and current files contain broad selectors and page-specific recovery rules.

Risk by layer:

- `00-tokens.css`: low to medium. Token additions are safe; token value changes can affect every page.
- `08-components-foundation.css`: medium. Buttons/cards/forms/badges are shared widely.
- `14-page-standard.css`: high. It controls the standard page shell and currently contains Library/Integrations page-specific polish.
- `12-pages.css`: medium. It is page-specific, but affects multiple existing pages.
- `03-app-shell.css` and `02-layer-system.css`: high if changed beyond narrow ownership.

### Rollback Plan
1. Make future implementation as small layer-specific commits, but do not commit without approval.
2. Before implementation, capture `git status --short` and note unrelated existing work.
3. Keep each patch limited to the planned owner file.
4. If a regression appears, revert only the last touched design-foundation file.
5. Do not roll back user/unrelated changes.
6. Preserve Library and Integrations selectors until their pages pass QA.
7. Use browser screenshots/checklists before and after any global card/button/header changes.
8. If a global selector causes unexpected page damage, replace it with an opt-in component class instead of stacking more overrides.

## Recommended Next Step
Before rebuilding Workflows, perform a small no-behavior-change foundation patch:

1. Add missing token aliases to `00-tokens.css`.
2. Add reusable stepper/action-panel/AI-guidance/feedback primitives to `08-components-foundation.css`.
3. Add only Workflows-specific layout selectors to `12-pages.css`.
4. Update Workflows markup to use `.btn`, `.card`/`.panel`, `.card-badge`, global form controls, and shared empty/status surfaces.
5. Decide explicitly whether Workflows should rejoin `page-standard.js` by removing `disableStandardLayout: true` after validation.

No duplicate global CSS files or new theme file should be created.

# PHASE 3P.5 - Publishing CSS Density / Duplication / Ownership Audit

## Executive Summary

Publishing is functionally safe after the 3P safety closeout, but the page remains visually dense. The density pressure is concentrated in the queue rows, queue action buttons, repeated action rows, and stacked main/side card layout. The header, workflow strip, readiness summary, and automation preview are also visually strong, but they are owned by global page CSS and should not be touched in the first density patch.

Recommended decision: **B) CSS-only patch inside `renderScopedStyles()` only.**

No exact `.publishing-*` selector is defined in both `renderScopedStyles()` and global CSS. The ownership boundary is clean enough for a minimal CSS-only polish without editing `12-pages.css`, production JavaScript behavior, backend APIs, or data paths.

## Evidence Map

- Current branch context: `architecture/frontend-consolidation-v1`.
- Current HEAD given by task: `fa97031 Add Publishing visual CSS readiness audit`.
- Existing plan doc: `audits/frontend/publishing/PHASE_3P5_PUBLISHING_CSS_DENSITY_POLISH_PLAN.md` is currently untracked.
- `public/control-center/pages/publishing.js:659` defines `renderScopedStyles()`.
- `public/control-center/pages/publishing.js:662-906` contains the route-scoped Publishing CSS block.
- `public/control-center/pages/publishing.js:1947` injects `renderScopedStyles()` into `publishingRoot`.
- `public/control-center/pages/publishing.js:1-80` renders the command header, workflow strip, and readiness summary markup.
- `public/control-center/pages/publishing.js:1005-1415` renders overview, recommendation, queue, builder, handoff, calendar, result, and asset gate cards.
- `public/control-center/pages/publishing.js:1951-1974` composes the execution center, main column, manual controls, and side column.
- `public/control-center/styles/12-pages.css:514-679` owns the global Publishing command header, workflow strip, readiness summary, spacing helpers, and automation preview.
- `public/control-center/styles/12-pages.css:7644` owns the past schedule warning color.
- `public/control-center/styles/mhos-action-primitives.css:7-28` owns shared `.btn` sizing and wrapping defaults.
- `public/control-center/styles/08-components-foundation.css:205-369` owns shared `.card` and `.card-badge` presentation.
- Safety reference: `audits/frontend/publishing/PHASE_3P3_PUBLISHING_SAFETY_CLOSEOUT.md`.
- Safety QA reference: `audits/frontend/publishing/PHASE_3P2_PUBLISHING_SAFETY_PATCH_QA.md`.
- Runtime authority reference: `audits/frontend/authority-boundary/publishing-runtime-ownership-audit/PUBLISHING_RUNTIME_OWNERSHIP_AUDIT.md`.
- Behavior contract reference: `audits/frontend/authority-boundary/publishing-shadow-compare-contract/PUBLISHING_BEHAVIOR_CONTRACT.md`.

## CSS Ownership Map

### Owned by `renderScopedStyles()` in `publishing.js`

- `.publishing-execution-center`
- `.publishing-execution-grid`
- `.publishing-main-column`
- `.publishing-side-column`
- `.publishing-card`
- `.publishing-overview-grid`
- `.publishing-overview-item`
- `.publishing-overview-item.is-wide`
- `.publishing-impact-row`
- `.publishing-impact-chip`
- `.publishing-action-row`
- `.publishing-form-actions`
- `.publishing-filter-row`
- `.publishing-filter-chip`
- `.publishing-filter-chip.is-active`
- `.publishing-queue-list`
- `.publishing-queue-row`
- `.publishing-queue-row.is-active`
- `.publishing-queue-main`
- `.publishing-queue-title`
- `.publishing-queue-meta`
- `.publishing-queue-actions`
- `.publishing-queue-actions button`
- `.publishing-queue-actions button:disabled`
- `.publishing-queue-actions button[disabled]`
- `.publishing-status-pill`
- `.publishing-status-pill.is-ready`
- `.publishing-status-pill.is-scheduled`
- `.publishing-status-pill.is-published`
- `.publishing-status-pill.is-failed`
- `.publishing-inline-error`
- `.publishing-calendar-list`
- `.publishing-calendar-row`
- `.publishing-calendar-row em`
- `.publishing-blocker-list`
- Desktop media rules for `.publishing-execution-grid`, `.publishing-queue-row`, and `.publishing-queue-actions`.

### Owned by global `12-pages.css`

- `.publishing-command-header`
- `.publishing-command-header-title`
- `.publishing-command-header-context`
- `.publishing-command-header-status`
- `.publishing-command-header-safety`
- `.publishing-command-header-actions`
- `.publishing-command-header-actions .btn`
- `.publishing-workflow-strip`
- `.publishing-workflow-step`
- `.publishing-workflow-step.is-active`
- `.publishing-workflow-step.is-warning`
- `.publishing-workflow-step.is-ready`
- `.publishing-workflow-step.is-missing`
- `.publishing-workflow-step-label`
- `.publishing-readiness-summary`
- `.publishing-readiness-card`
- `.publishing-readiness-card.is-warning`
- `.publishing-readiness-card.is-missing`
- `.publishing-readiness-card-label`
- `.publishing-block-gap`
- `.publishing-inline-gap`
- `.publishing-automation-preview`
- `.publishing-automation-preview summary`
- `.publishing-automation-preview-copy`
- `.publishing-past-schedule-warning`

### Shared global primitives also affecting Publishing

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-warning`, `.btn-sm`
- `.card`, `.card-head`, `.card-badge`
- `.setup-form-grid`, `.setup-field-group`, `.setup-field-head`, `.setup-label`, `.setup-input`, `.setup-textarea`
- `.simple-banner`, `.empty-box`
- `.data-stack`, `.data-row`

### Selectors appearing in both owners

No exact `.publishing-*` selector is defined in both `renderScopedStyles()` and global style files.

The only overlaps are compositional:

- Markup combines scoped layout selectors with global spacing utilities, such as `.publishing-action-row publishing-inline-gap` and `.publishing-calendar-list publishing-block-gap`.
- Publishing buttons inherit global `.btn` styles in major action rows, while queue action buttons use scoped raw button styles.
- Publishing cards inherit global `.card` styles plus scoped `.publishing-card` containment.

If a patch is approved, edit `renderScopedStyles()` for queue, internal card spacing, internal action rows, and the main/side execution grid. Edit `12-pages.css` only for command header, workflow strip, readiness summary, automation preview, or shared Publishing spacing utilities.

## Duplicate / Conflict Candidates

- **No exact duplicate `.publishing-*` ownership conflict found.** A selector-count scan found `.publishing-*` definitions in `publishing.js` and `12-pages.css`, but no same selector defined in both owners.
- **Expected intra-owner variants:** `.publishing-status-pill`, `.publishing-queue-actions`, `.publishing-calendar-row`, `.publishing-command-header`, `.publishing-workflow-step`, and `.publishing-readiness-card` appear multiple times because of child, state, disabled, or media rules. These are not duplication bugs.
- **Queue action styling overlap:** high-level action rows use global `.btn`; queue row action buttons are plain buttons styled by `.publishing-queue-actions button`. This is intentional but creates uneven target sizing and visual hierarchy.
- **Card responsibility overlap:** `.card` owns the card surface; `.publishing-card` currently only adds `min-width: 0` and `overflow: hidden`. This is acceptable. Do not move card primitives into Publishing CSS.
- **Spacing responsibility overlap:** global `.publishing-block-gap` and `.publishing-inline-gap` are used inside Publishing panels that otherwise rely on scoped spacing. This is acceptable but should not be changed globally for a queue-density polish.
- **Header/readiness vs internal cards:** the global command/header/readiness layer and scoped overview/recommendation cards all compete for first-screen attention. This is a design density issue, not a CSS ownership conflict.

## Unused Selector Candidates

No proven unused `.publishing-*` CSS rule was found in the requested source files.

Candidate-only notes:

- `.publishing-section-copy` is used in markup but has no matching CSS rule in the inspected Publishing selectors.
- `.publishing-builder-form` is used in markup but has no matching Publishing-specific CSS rule; it appears to rely on `.setup-form-grid`.
- `.publishing-queue-state` is used in markup but has no matching Publishing-specific CSS rule; it currently acts as an unstyled wrapper around the status pill.
- Data attribute names such as `data-publishing-action`, `data-publishing-id`, `data-publishing-select`, and `data-publishing-filter` are behavior hooks, not unused CSS candidates.

These are not deletion candidates. They should remain untouched unless a later CSS or structural pass explicitly needs them.

## Visual Density Findings

### Queue rows

- Each queue row shows title, metadata, status, and five action buttons.
- On desktop, `.publishing-queue-actions` is forced to `grid-column: 1 / -1`, so every row consumes a second full action line.
- Queue buttons have short padding and no explicit min-height. They are visually compact, but long labels such as "Queue for Manual Publishing" and "Prepare Publishing Package" increase wrapping pressure.
- The dark queue contrast correction is useful and should be preserved.

### Queue action buttons

- Queue actions are visually secondary compared with `.btn` buttons, which is good.
- All queue actions currently have equal visual weight, even though review/schedule/publish/pause/retry have different authority implications.
- CSS cannot distinguish local-only vs backend-backed actions because the row markup does not expose a local/durable class or data attribute. Do not attempt to solve local-vs-backend distinction in CSS-only scope.

### Main/side grid

- Desktop grid begins at `min-width: 980px` with `minmax(0, 1.4fr) minmax(300px, 0.8fr)`.
- The right column minimum of 300px is reasonable for side cards, but the side column becomes dense because handoff, calendar, results, and asset gate can all render together.
- Below 980px, the layout stacks, preserving readability but creating a long page.

### Builder form actions

- Builder fields inherit the setup form grid, which is stable.
- `.publishing-form-actions` uses the same gap/margin pattern as `.publishing-action-row`.
- The primary "Queue for Manual Publishing" action remains visible and visually strong through `.btn-primary`.

### Manual Execution Controls

- The manual controls appear after queue and builder in the main column.
- Both manual buttons are `.btn-secondary`, which keeps them from appearing as an unguarded final publish action.
- They may still feel visually weak because they sit below denser queue/building content, but changing labels, order, or button classes is outside this audit-only and CSS-only scope.

### Automation Preview

- The automation preview is already collapsed with `<details>` and styled globally by `.publishing-automation-preview`.
- It should not be part of the first scoped density patch unless later browser QA shows it causes overflow or focus issues.

### Calendar/result/blocker cards

- The side column cards use scoped list gaps plus shared card/data/banner styles.
- Calendar rows are button-like controls and should retain clear focus/click treatment.
- Result and blocker cards inherit shared banner/data styling; do not introduce Publishing-specific variants unless a later visual QA pass proves a real problem.

### Header/workflow/readiness strips

- These are globally owned and visually dominant.
- They are useful orientation elements after the prior UI/UX consolidation.
- Do not modify them in the first patch. A global UI finalization phase can revisit them if broader page-standard alignment is approved.

## Button / Accessibility Findings

- Shared `.btn` buttons have a defined min-height through `var(--button-height-md)`, but queue action buttons are plain buttons styled only by `.publishing-queue-actions button`.
- Queue action buttons are likely the tightest click targets on the page. They should receive explicit min-height, line-height, focus-visible, and wrapping rules in a future scoped CSS patch.
- `.publishing-filter-chip` has `min-height: 36px`, acceptable for compact filters, but should share a focus-visible treatment with queue and calendar controls.
- `.publishing-calendar-row` is a full-width button but has no explicit min-height or focus-visible rule in the scoped CSS.
- Primary actions are not hidden:
  - Recommendation primary: `publishingPushAiBtn` uses `.btn-primary`.
  - Builder primary: `publishingScheduleBtn` uses `.btn-primary`.
  - Manual controls are secondary by design because they are confirmation/backend governed.
- Queue actions are visually secondary enough, but their density makes them feel busy.
- Local-only and backend actions are not visually distinguishable by CSS because markup does not expose ownership state. Preserve behavior and record this as a future UX/markup decision, not a CSS-only patch item.

## Responsive Layout Findings

- At desktop widths, the grid split is stable and the 300px right rail is not obviously too narrow.
- At widths near the 980px breakpoint, the main column may have limited room for long queue action labels, but queue actions already wrap to a full row.
- Below 980px, the stacked layout avoids side-column squeeze but increases scroll length.
- Header workflow steps are horizontally scrollable through global `.publishing-workflow-strip`, reducing mobile overflow risk.
- Long queue titles and metadata have `overflow-wrap: anywhere`, which is good.
- The largest remaining overflow risk is long button text inside queue/action rows because global `.btn` defaults to `white-space: nowrap` and queue action buttons do not define wrapping behavior.

## Safety Preservation Requirements

Any approved CSS patch must not change:

- Confirmation dialogs for schedule/reschedule, pause, retry, approval, publish, or fail.
- Asset blocker guards before backend schedule, publish, and retry/reschedule.
- Local draft behavior and local-only status transitions.
- AI handoff behavior through shared context.
- Auto Mode start/stop/gated approval/skip behavior.
- Backend mutation paths:
  - `savePublishingSchedule`
  - `reschedulePublishingItem`
  - `approvePublishingItem`
  - `publishPublishingItem`
  - `failPublishingItem`
- IDs used by handlers.
- `data-publishing-*` behavior hooks.
- Button labels, button count, button order, or action semantics.
- Backend, API, router, app shell, shared context, automation engine, or project data files.

## Recommended Decision

**B) CSS-only patch inside `renderScopedStyles()` only.**

Rationale:

- The clean ownership boundary means a scoped patch can address the main density issues without touching global CSS.
- The densest problems are queue rows, queue action controls, internal action rows, calendar rows, and internal grid/list spacing. These are all owned by `renderScopedStyles()`.
- `12-pages.css` owns important global orientation elements. Editing it now would broaden the blast radius and create risk for a phase meant to polish internal Publishing density only.
- Full visual redesign, local-vs-backend visual distinction, and global primitive consolidation should be deferred to a later global UI finalization or markup-approved phase.

## Proposed Patch Scope

Small CSS-only patch, no production JavaScript behavior edits.

Patch only `renderScopedStyles()` in `public/control-center/pages/publishing.js`.

Intent:

- Make queue rows slightly denser without reducing readability.
- Make queue action buttons better click targets while keeping them visually secondary.
- Allow long action labels to wrap cleanly instead of forcing cramped horizontal rows.
- Add visible focus treatment for scoped Publishing interactive controls.
- Slightly tighten internal card/list/action spacing where it reduces scroll burden.
- Preserve all safety and backend semantics.

Do not edit `12-pages.css` in this patch.

Do not remove unused selectors in this patch.

## Selectors To Touch

- `.publishing-execution-center`
  - Intent: slightly tune vertical spacing only if browser QA confirms excessive scroll.
- `.publishing-execution-grid`
  - Intent: keep the current two-column structure; only reduce gap if needed.
- `.publishing-main-column, .publishing-side-column`
  - Intent: slightly reduce internal column gap while preserving clear card separation.
- `.publishing-overview-grid`
  - Intent: consider a modestly smaller minimum tile width if cards wrap too early.
- `.publishing-overview-item, .publishing-impact-chip`
  - Intent: reduce padding slightly while preserving text hierarchy.
- `.publishing-impact-row`
  - Intent: reduce top margin/gap if recommendation chips consume too much first-screen height.
- `.publishing-action-row, .publishing-form-actions`
  - Intent: reduce gap slightly and add stable wrapping behavior for contained `.btn` buttons.
- `.publishing-action-row .btn, .publishing-form-actions .btn`
  - Intent: allow long labels to wrap cleanly, preserve target size, avoid overflow.
- `.publishing-filter-chip`
  - Intent: preserve current min-height, add/align focus-visible behavior if introduced.
- `.publishing-queue-list, .publishing-calendar-list, .publishing-blocker-list`
  - Intent: slightly tune list gap/margin-top only.
- `.publishing-queue-row`
  - Intent: reduce padding/gap modestly and preserve dark contrast.
- `.publishing-queue-main`
  - Intent: add focus-visible treatment with other button-like controls.
- `.publishing-queue-title`
  - Intent: preserve strong title hierarchy; only adjust line-height if rows stay too tall.
- `.publishing-queue-meta`
  - Intent: preserve wrap behavior; only adjust font/line-height if needed.
- `.publishing-queue-actions`
  - Intent: reduce gap and align wrapped actions.
- `.publishing-queue-actions button`
  - Intent: set explicit min-height, line-height, wrapping, and focus-visible behavior while keeping secondary visual weight.
- `.publishing-calendar-row`
  - Intent: add explicit min-height/focus treatment and tune padding/gap modestly.
- `.publishing-calendar-row em`
  - Intent: preserve wrap behavior; only adjust line-height if needed.

## Selectors Not To Touch

- `.publishing-command-header`
- `.publishing-command-header-title`
- `.publishing-command-header-context`
- `.publishing-command-header-status`
- `.publishing-command-header-safety`
- `.publishing-command-header-actions`
- `.publishing-command-header-actions .btn`
- `.publishing-workflow-strip`
- `.publishing-workflow-step`
- `.publishing-workflow-step.is-active`
- `.publishing-workflow-step.is-warning`
- `.publishing-workflow-step.is-ready`
- `.publishing-workflow-step.is-missing`
- `.publishing-workflow-step-label`
- `.publishing-readiness-summary`
- `.publishing-readiness-card`
- `.publishing-readiness-card.is-warning`
- `.publishing-readiness-card.is-missing`
- `.publishing-readiness-card-label`
- `.publishing-block-gap`
- `.publishing-inline-gap`
- `.publishing-automation-preview`
- `.publishing-automation-preview summary`
- `.publishing-automation-preview-copy`
- `.publishing-past-schedule-warning`
- `.publishing-status-pill` and its state color variants, unless browser QA finds a status readability issue.
- `.publishing-inline-error`, unless browser QA finds validation readability issues.
- Global `.btn`, `.card`, `.setup-*`, `.simple-banner`, `.empty-box`, `.data-*`, and standard page primitives.
- Any IDs, `data-publishing-*` hooks, handler code, confirmation messages, API paths, Auto Mode code, shared-context code, or payload builders.

## Browser QA Checklist

Run after any approved future CSS patch:

- Publishing page opens without fatal error.
- No console errors on initial render.
- Header, workflow strip, and readiness summary still render above the execution center.
- Queue rows remain readable on desktop and narrow viewports.
- Queue action buttons remain visible, clickable, and visually secondary.
- Long queue action labels wrap cleanly without clipping.
- Keyboard focus is visible on filter chips, queue row main buttons, queue action buttons, and calendar rows.
- Builder form actions remain visible and the primary queue action is still visually strong.
- Manual Execution Controls remain visible and readable.
- Automation Preview remains collapsed by default and readable when opened.
- Calendar rows do not overflow or clip.
- Result and blocker cards remain readable in the right column and stacked layout.
- No unintended changes to command header, workflow strip, readiness summary, or global button/card styling.
- Confirmation dialogs still appear for backend schedule/reschedule, pause, retry, approval, publish, and fail.
- Asset blocker guards still prevent backend schedule/publish/retry when blockers exist.
- Local draft actions remain local-only.
- AI handoff remains review/context-only.
- Auto Mode does not publish, approve, or fail directly.

## Validation Results

- `git status --short` before creating this audit:
  - `?? audits/frontend/publishing/PHASE_3P5_PUBLISHING_CSS_DENSITY_POLISH_PLAN.md`
- Selector ownership scan:
  - `.publishing-*` selectors in global styles are limited to `public/control-center/styles/12-pages.css`.
  - No exact `.publishing-*` selector is defined in both `renderScopedStyles()` and global style files.
- `node --check public/control-center/pages/publishing.js`: PASS
- `node --check public/control-center/pages/publishing/publishing-payloads.js`: PASS
- `node --check public/control-center/app.js`: PASS
- `node --check public/control-center/router.js`: PASS
- `node --check public/control-center/api.js`: PASS
- `node --check public/control-center/shared-context.js`: PASS
- Expected `git status --short` after creating this audit:
  - `?? audits/frontend/publishing/PHASE_3P5_PUBLISHING_CSS_DENSITY_OWNERSHIP_AUDIT.md`
  - `?? audits/frontend/publishing/PHASE_3P5_PUBLISHING_CSS_DENSITY_POLISH_PLAN.md`

No production files were modified by this audit.

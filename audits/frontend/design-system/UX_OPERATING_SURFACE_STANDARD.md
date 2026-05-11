# UX Operating Surface Standard

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only standard — no code modified
Phase: P0 — CSS Foundation & Operating Surface Standard Audit
Reference: audits/frontend/FRONTEND_UX_MASTER_PLAN_2026.md

---

## 1. Standard Page Anatomy

Every page in MH-OS must move toward the following four-zone layout. This is the canonical operating surface standard. No page is considered complete until it either meets this standard or has a formally documented deferral reason for each zone.

```
┌────────────────────────────────────────────────────────────┐
│  HEADER ZONE                                                │
│  Page title · Eyebrow label · Context ribbon · Status chips│
│  Topbar (global shell — always present)                     │
│  Page-level context ribbon (per-page — std-context-ribbon)  │
├────────────────────────────────────────────────────────────┤
│  MAIN VIEW ZONE                                             │
│  Primary data display: list / grid / table / cards         │
│  Filter · Search · Sort · Pagination controls inline       │
│  Empty state (explicit) · Loading state (explicit)         │
│  Error state (explicit)                                     │
├──────────────────────────────┬─────────────────────────────┤
│  ACTION PANEL ZONE           │  AI PANEL ZONE              │
│  Right-rail intent actions   │  Right-rail AI suggestions  │
│  Safe commands only          │  Read-only contextual data  │
│  Deferred = present + locked │  Deferred = present + quiet │
└──────────────────────────────┴─────────────────────────────┘
```

The two right-rail zones (Action Panel and AI Panel) may be stacked vertically in the right rail, or rendered as separate sections below the Main View on narrow viewports.

---

## 2. Zone Definitions

### 2.1 Header Zone

**Scope:** Page identity and project context.

**Must include:**
- Page title (rendered in the global topbar via `#pageTitle`).
- Eyebrow label: a short uppercase label (e.g., `TASK CENTER`, `LIBRARY`, `MEDIA STUDIO`) that orients the user to which area they are in.
- Page-level context ribbon (`std-context-ribbon`): title, description, status chips, optional context actions.
- Project scope indicator: which project the current data belongs to.

**May include:**
- Status chips (`std-context-chip`) showing operational health or count summaries.
- Header-level safe actions (`std-context-btn`) for non-destructive operations — open, refresh, export. Not for mutation.

**Must not include:**
- Data mutation controls. Buttons that create, update, or delete must live in the Action Panel, not the Header.
- Heavy render logic. The Header must render from cached state, not trigger new data fetches.
- Inline forms. Forms belong in the Main View or a modal, not the Header.
- Placeholder content. If project or page data is absent, Header must show a named empty state, not a blank.

**CSS classes confirmed available:**
- `std-context-ribbon` — outer grid container
- `std-context-main` — left content area
- `std-context-line` — eyebrow + title row
- `std-context-eyebrow` — uppercase teal label
- `std-context-title` — page title (responsive clamp)
- `std-context-description` — subtitle/description
- `std-context-metrics` — chip row
- `std-context-chip`, `.is-success`, `.is-warning`, `.is-danger` — status chips
- `std-context-actions` — right-side action cluster
- `std-context-btn` — header action button (pill shape)
- `std-smart-strip-compact` — AI insight or status strip below ribbon (optional)

---

### 2.2 Main View Zone

**Scope:** Primary operational data display.

**Must include:**
- The primary data the user came to this page to see (task list, queue, asset grid, publishing schedule, etc.).
- Inline filter controls (search input, select dropdowns, sort controls) — always visible, not behind a toggle.
- Explicit empty state: when data is absent, show a named message. Never render a blank container.
- Explicit loading state: when data is being fetched, show a `.loading-state` indicator. Never freeze a stale render.
- Explicit error state: when a fetch fails, show an error message with recovery action. Never silently fail.

**May include:**
- Pagination controls (page number, prev/next) for large data sets.
- Inline search/filter UI that modifies the view state without backend roundtrip.
- View mode toggles (e.g., grid vs. list).
- Selection controls for multi-select patterns (highlight, select-all, clear) — but not action execution.

**Must not include:**
- Authority-bearing controls. Approve, publish, delete, and other authority decisions must not live in the Main View inline. They belong in the Action Panel.
- Uncontrolled event listeners. All event bindings in the Main View must be registered in the route lifecycle and cleaned up on route teardown.
- Heavy synchronous computation. Filtering, sorting, and search must use lightweight in-memory operations on already-fetched data, not synchronous DOM queries.
- Global state mutations. The Main View renders from projected state; it does not write to state directly.

**CSS classes confirmed available:**
- `std-main-content-slot` — wrapper for the primary content area
- `.card`, `.panel`, `.data-card` — content containers
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger` — inline status indicators
- `.empty-state`, `.empty-box` — empty state containers
- `.loading-state` — inline loading indicator
- `.kpi-grid`, `.std-kpi-grid`, `.std-status-grid` — metric grids
- `.toolbar` — filter/action toolbar row

---

### 2.3 Action Panel Zone

**Scope:** User-initiated safe actions on the current page or selected item.

**Must include (if active):**
- A labeled panel heading that identifies what the panel acts on (e.g., "Asset Actions", "Task Actions").
- At least one safe, non-destructive action wired to a command-router intent or a safe API call.

**May include:**
- Multiple safe actions, grouped logically.
- Deferred mutation buttons in disabled/locked state with a tooltip or label explaining why they are deferred (e.g., "Requires mutation safety audit — coming in a later pass").
- Quick access links to related routes (non-authoritative navigation).

**Must not include:**
- Actions that bypass backend authority checks.
- Actions that mutate `data/projects` without explicit authority audit approval.
- Auto-executing actions — every action must be triggered by deliberate user intent.
- Duplicate authority — if an action is already available in the Main View inline, it must not also appear in the Action Panel without a clear reason.

**May be deferred when:**
- The page has not yet undergone a mutation safety pass.
- No safe action has been audited and confirmed for this page.
- The deferred state is explicitly documented in the page's audit file.

When deferred, the Action Panel must still be rendered (as a shell or empty panel), not omitted. This preserves the four-zone layout and signals to the user where future actions will appear.

**CSS classes to use:**
- `std-side-card` — right-rail panel card
- `card-head` — panel header row
- `.btn`, `.std-action-btn` — action buttons
- `.btn:disabled` — deferred action state

---

### 2.4 AI Panel Zone

**Scope:** Contextual AI suggestions and metadata.

**Must include (if active):**
- A labeled panel heading (e.g., "AI Context", "Suggestions").
- At least one contextual read-only output: a suggestion, a metadata field, or a prompt shortcut.

**May include:**
- AI-generated suggestions based on the current page context.
- Read-only metadata about the selected item.
- Pre-composed prompt shortcuts for the AI Command page (navigation intent, not direct execution).
- A link or button to open AI Command with this context pre-loaded.

**Must not include:**
- Autonomous command execution from the panel. No action that triggers a backend operation without explicit user confirmation at the receiving surface.
- Authority decisions. The AI Panel suggests; it does not decide.
- Live streaming or polling loops not owned by the route lifecycle.
- Local authority expansion — the panel must not add command capabilities not supported by the backend API.

**May be deferred when:**
- The AI command routing contract for this page has not been formally defined.
- The page has not yet received its AI Panel planning pass.

When deferred, the AI Panel should be rendered as a quiet shell — a labeled panel that says "AI context coming soon" or equivalent. Not omitted.

**CSS classes to use:**
- `.std-ai-btn` — AI panel action button
- `.ai-panel` — panel container (same base rule as `.card`)
- `card-head` — panel header

---

## 3. Page Completion Definition

A page is complete when all of the following criteria are met and documented in a final page audit:

| # | Criterion | Description |
|---|---|---|
| 1 | Header clear | Context ribbon renders with title, eyebrow, and project scope in all data states |
| 2 | Main View structured | Data display, empty, loading, and error states all handled explicitly |
| 3 | Action Panel present or deferred | Either wired with ≥1 safe action, or rendered as deferred shell with documented reason |
| 4 | AI Panel present or deferred | Either mounted with contextual metadata, or rendered as deferred shell with documented reason |
| 5 | Safe actions only | No mutation commands wired without explicit mutation safety audit on record |
| 6 | No authority duplication | Page does not replicate backend state decisions |
| 7 | No data/projects mutation during UX work | Confirmed by `git status --short data/projects` showing clean |
| 8 | Validation passed | `node --check` passes on all JS files for this page; no console errors in expected operating states |
| 9 | Final page audit committed | Audit document in `audits/frontend/` committed before page is considered done |

---

## 4. Layout Rules

### 4.1 Shell Layout

- The workspace (`#workspace` / `.workspace`) provides the scrollable outer container.
- Each page root uses `.std-page-shell` as its top-level container.
- `.std-page-shell` is a flex column with `gap: 16px`.
- The Header zone sits at the top: `std-context-ribbon` + optional `std-smart-strip-compact`.
- The Main View zone sits in `std-main-content-slot`.
- The Action Panel and AI Panel sit in a right-rail column alongside the Main View, or stacked below on narrow viewports.

### 4.2 Two-Column Layout (Main View + Right Rail)

When both Main View and right rail (Action Panel + AI Panel) are present:

```
┌─────────────────────────────┬─────────────────┐
│  Main View (flex: 1)        │  Right Rail      │
│  minmax(0, 1fr)             │  minmax(280px,   │
│                             │  360px)          │
└─────────────────────────────┴─────────────────┘
```

Use `library-workspace-grid` as the reference implementation (`14-page-standard.css`):
```
grid-template-columns: minmax(260px, 1fr) minmax(340px, 420px)
```

The right rail stacks Action Panel above AI Panel, or uses a tabbed panel if both are fully active.

### 4.3 Responsive Collapse

- Below 980px: context ribbon collapses to single column; action cluster moves to left-aligned.
- Below 760px: context ribbon padding reduced; chip stack goes vertical; action buttons go full-width.
- Below 1024px: sidebar collapses; main layout goes single column.
- At ≤760px, right rail stacks below Main View.

### 4.4 Workspace Bottom Padding

`.workspace` has `padding: 18px 18px 92px`. The 92px bottom accommodates the AI dock toggle button in the bottom-right corner. Pages must not add content that overlaps the dock.

---

## 5. Panel Rules

### 5.1 Action Panel Safety Levels

Every wired action in the Action Panel must be classified at one of four safety levels before being connected:

| Level | Name | Criteria | Example |
|---|---|---|---|
| L1 | `read_only` | Reads data, no side effects | View asset details, refresh data list, copy text |
| L2 | `safe_non_destructive` | Initiates a safe, reversible, non-authority operation | Copy asset path, open preview, navigate to related route |
| L3 | `mutation_requires_audit` | Creates or updates data; requires a mutation safety audit first | Create task, rename asset, update status |
| L4 | `destructive_requires_authority_audit` | Deletes, publishes, approves, or executes with backend authority | Delete asset, approve publishing, execute campaign package |

**Rules:**
- L1 and L2 actions may be wired in a UX layout pass without additional approval, provided they route through the command-router or call read-safe API endpoints.
- L3 actions require a documented mutation safety audit committed to `audits/frontend/` before they are wired.
- L4 actions require a documented authority audit committed to `audits/frontend/` before they are wired. They must never be wired during a layout-only pass.

### 5.2 Disabled / Deferred Button Presentation

Buttons that are deferred must:
- Render as a `<button disabled>` element, not be omitted from the DOM.
- Have a descriptive `aria-label` or tooltip explaining the deferred state.
- Not fire any event when clicked.
- Not imply that the action is available.

Example label pattern: "Archive (requires safety audit)" or "Publish (not yet available)".

### 5.3 Mutation Confirmation

Any L3 or L4 action that is wired must:
- Require at least one explicit user confirmation (a confirm dialog, a typed confirmation, or a secondary confirmation button) before firing.
- Never execute automatically on a single click without confirmation.
- Surface the backend error clearly if the request fails.

---

## 6. AI Panel Rules

### 6.1 Read-Only by Default

All AI Panel content is read-only in the first implementation pass for every page. No AI Panel action may trigger backend execution in an initial pass.

### 6.2 Prompt Shortcuts

If the AI Panel includes prompt shortcut buttons, they must:
- Navigate to AI Command with a pre-composed prompt, not execute the prompt in-panel.
- Use `navigateTo("ai-command")` or an equivalent routing call.
- Not trigger `executeProjectAiCommand` from the panel directly.

### 6.3 No Streaming in First Pass

No AI Panel may initiate a streaming or polling loop in its first implementation pass. Streaming is a future enhancement that requires a dedicated AI streaming safety pass.

### 6.4 Context Payload Scope

The AI Panel may surface:
- Current page name and project name.
- Selected item metadata (title, status, type) from current state.
- A suggested next action as a read-only text suggestion.

It must not surface:
- Backend API keys, credentials, or configuration.
- Raw backend response objects.
- Internal route names or system internals.

---

## 7. Empty / Loading / Error State Standard

### 7.1 Empty State

Every data list or grid must have an explicit empty state. Requirements:

- Container: `.empty-state` or `.empty-box`
- Must include: a heading (what is absent), a description (why and what to do), and optionally a call-to-action (e.g., "Create your first task").
- Must not be: a blank container, a spinner that never resolves, or a `null` render.
- Must render in: zero-item data states, no-project-selected states, and filter-produces-no-results states (with a distinct message for the filtered case).

### 7.2 Loading State

Every data panel that fetches asynchronously must have an explicit loading state:

- Container: `.loading-state` (inline; do not use the full-screen overlay for page-level data loads)
- Must display: a loading indicator (spinner or skeleton) with a text label.
- Must resolve: within the route's data lifecycle; not left spinning indefinitely.
- Full-screen overlay (`.loading-overlay`) is reserved for: initial app startup and explicit full-page blocking transitions. Not for in-page data loads.

### 7.3 Error State

Every data fetch must handle the error case:

- Must render: an error message with a human-readable description.
- Must offer: a retry action or navigation path.
- Must not: silently swallow the error and render an empty list without explanation.
- Must not: expose raw error objects or stack traces in the UI.

---

## 8. Mobile and Responsive Principles

### 8.1 Single Column on Small Viewports

At ≤760px:
- Right rail (Action Panel + AI Panel) moves below Main View.
- Header ribbon collapses to single column.
- Sidebar collapses off-screen (toggle via hamburger).

### 8.2 Touch Target Size

All interactive elements must have a minimum touch target height of 44px on mobile. This is the WCAG 2.1 AA recommendation.

The `.btn` base class has `min-height: var(--button-height-md)` = 38px. On mobile, page-level padding and touch area must be considered to ensure effective target size.

### 8.3 No Horizontal Overflow

`.workspace` has `overflow-x: hidden`. Page content must not generate horizontal overflow. Use `min-width: 0` on flex/grid children to prevent flex-basis overflow.

---

## 9. Accessibility Basics

| Requirement | Implementation |
|---|---|
| Landmarks | `<header role="banner">`, `<nav aria-label="...">`, `<main>`, `<aside>` must be present in the shell |
| Page title | `#pageTitle` must be updated on every route change to reflect the current page |
| Live regions | Global message (`aria-live="polite"`) and error (`aria-live="assertive"`) are in the shell |
| Focus management | Route changes must restore focus to an appropriate element (page title or first heading) |
| Button labels | All icon-only buttons must have `aria-label` |
| Disabled state | Deferred buttons must use `disabled` attribute, not `aria-disabled` alone |
| Color contrast | All text must meet WCAG 2.1 AA minimum contrast against the dark background |
| Keyboard navigation | Tab order must be logical; no keyboard traps in panels |

---

## 10. CSS Class Naming Direction

### 10.1 Canonical Prefixes

| Prefix | Scope | Examples |
|---|---|---|
| `std-` | Shared page standard surface | `std-page-shell`, `std-context-ribbon`, `std-action-btn` |
| `btn-` | Button modifier | `btn-primary`, `btn-danger`, `btn-sm` |
| `badge-` | Badge tone modifier | `badge-success`, `badge-warning` |
| `is-` | State modifier | `is-active`, `is-open`, `is-success`, `is-command-open` |
| `data-page="…"` | Page scope selector | `[data-page="library"]` |
| `data-route="…"` | Route nav selector | `[data-route="home"]` |

### 10.2 Naming Rules for New Classes

- New shared component classes use `std-` prefix.
- New page-specific classes use a page prefix (`ops-`, `pub-`, `ai-`, etc.) and must be scoped with `[data-page="…"]` in CSS.
- No generic names (`left`, `right`, `container`, `wrapper`) without a prefix.
- No class names that duplicate an existing class with different behavior.

### 10.3 Avoid

- Single-character or abbreviation-only class names.
- Class names that encode visual properties (`red-text`, `big-padding`) — use semantic names instead.
- Class names that duplicate a CSS property name verbatim (`flex`, `grid`, `block`).

---

## 11. Do-Not-Break List

These must be preserved absolutely during all UX layout and CSS work:

| System | Rule |
|---|---|
| Backend security | No frontend change may bypass or weaken route-level key enforcement |
| Project isolation | `normalizeProjectSlug`, `resolveProjectPath` must not be affected by frontend changes |
| Route behavior | `router.js` route definitions, navigation guards, and access resolvers must not change |
| Response shapes | API payload contracts must not change |
| `data/projects` | No file mutation during UX work; confirmed by `git status --short data/projects` |
| Publishing guardrails | `assertPublishingMutationAllowed` remains in force; no frontend bypass |
| Local draft behavior | `readDraftMap`/`writeDraftMap` and localStorage draft adapters must not be altered during layout passes |
| Media Studio generation | `bindMediaStudio`, `sendPublishingHandoff`, orchestration surfaces must not be touched |
| Library mutation deferral | Deferred mutation commands remain deferred until explicit mutation safety pass |
| Global loading overlay | `.loading-overlay` visibility logic must not be changed during page layout work |

---

## 12. How Future Page Upgrades Must Proceed

Every page upgrade follows this sequence. No step may be skipped.

### Step 1 — Audit

Document the current state of the target page:
- What routes, data, and API calls does it use?
- What is the current HTML structure? Which zones are present, missing, or incomplete?
- What actions are wired? At what safety level?
- What listeners are registered? Are they route-lifecycle-owned?
- What CSS classes does it use? Are any deprecated or conflicting?

Output: `audits/frontend/[page-name]/[PAGE]_OPERATING_SURFACE_AUDIT.md` committed.

### Step 2 — UX Contract

Define the target state for the page:
- What goes in each zone (Header, Main View, Action Panel, AI Panel)?
- Which actions are immediately wirable (L1/L2) vs. deferred (L3/L4)?
- Which CSS classes will be used for each zone?
- What are the empty, loading, and error states?
- Are there any blockers to the layout pass?

Output: `audits/frontend/[page-name]/[PAGE]_UX_CONTRACT.md` committed.

### Step 3 — Layout-Only Patch

Apply the four-zone layout structure to the page. This step only:
- Introduces `std-page-shell` and `std-context-ribbon` if not present.
- Restructures HTML for zone separation.
- Does not wire new actions.
- Does not change data fetching.
- Does not change CSS files.

Validation: `node --check` on the page JS file; `git status --short data/projects` clean; visual review.

Output: Layout patch committed.

### Step 4 — Panel Shell

Add the Action Panel and AI Panel shells (deferred state):
- Render both panels in their deferred state (disabled buttons, quiet labels).
- Do not wire any action yet.
- Ensure the zone layout is visually complete.

Output: Panel shell patch committed.

### Step 5 — First Safe Action

Wire the first L1 or L2 action in the Action Panel:
- One action per commit.
- Follow the command-router pattern established in Library.
- Validate that the action produces no unintended side effects.
- Confirm `data/projects` is clean after the action.

Output: First action patch committed.

### Step 6 — Final Audit

Document the completed state:
- Confirm all nine page completion criteria are met.
- Confirm all deferred items have documented deferral reasons.
- Confirm validation results.

Output: `audits/frontend/[page-name]/[PAGE]_FINAL_AUDIT.md` committed.

---

## 13. No-Change Confirmation

This document is documentation-only.

- No CSS files were modified.
- No JS files were modified.
- No data/projects files were modified.
- No route behavior was changed.
- All content is a forward-looking standard, not a retroactive code change.

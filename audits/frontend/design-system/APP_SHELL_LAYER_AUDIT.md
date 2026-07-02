# App Shell Layer Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only audit — no files modified
Phase: P0 — CSS Foundation & Operating Surface Standard Audit
Reference: audits/frontend/FRONTEND_UX_MASTER_PLAN_2026.md

---

## 1. Executive Summary

The app shell is the outermost structural layer of MH-OS. It exists in `public/control-center/index.html` and is always present regardless of which page the user is viewing. All pages render inside the shell. The shell owns: global layout grid, sidebar, topbar, command bar, AI dock, loading overlay, global feedback toasts, startup diagnostics, and fatal error recovery.

The shell is a **stable surface**. It must not be modified during page-level UX work. Any required shell changes must be treated as their own dedicated pass with explicit shell audit and approval.

---

## 2. Shell Layer Inventory

The shell is composed of the following layers, in their DOM rendering order within `index.html`:

| # | Layer Name | DOM Element / ID | Class(es) | Z-index Layer | Purpose |
|---|---|---|---|---|---|
| 1 | Sidebar backdrop | `#sidebarBackdrop` | `sidebar-backdrop` | `--layer-sidebar` area | Mobile backdrop when sidebar is open |
| 2 | Global feedback message | `#globalMessage` | `global-message` | `--layer-toast` (1300) | Polite status messages (aria-live="polite") |
| 3 | Global error message | `#globalError` | `global-error` | `--layer-toast` (1300) | Assertive error messages (aria-live="assertive") |
| 4 | Startup step banner | `#startupStepBanner` | `startup-step-banner` | N/A (in-flow) | Shows current startup step during boot |
| 5 | Startup unlock bar | `#startupUnlockBar` | `startup-unlock-bar` | N/A | Escape hatch for stuck startup |
| 6 | Startup trace panel | `#startupTracePanel` | `startup-trace-panel` | N/A | Debug startup event log |
| 7 | Fatal error panel | `#fatalErrorPanel` | `fatal-error-panel` | N/A | Rendered when startup fails fatally; `role="alert"` |
| 8 | Loading overlay | `#loadingOverlay` | `loading-overlay` | `--layer-overlay` (600) | Full-screen blocking loading state |
| 9 | OS Layout grid | (implicit) | `os-layout` | — | Two-column grid: sidebar + main shell |
| 10 | Sidebar | `#sidebarNav` | `sidebar` | `--layer-sidebar` (100) | Navigation, project switcher, brand |
| 11 | Main shell | (implicit) | `main-shell` | — | Vertical stack: topbar + workspace |
| 12 | Topbar | `#topbar` | `topbar` | `--layer-topbar` (200) | Page title, context, workspace chip, command toggle, exec actions |
| 13 | Command backdrop | `#commandBackdrop` | `command-backdrop` | `--layer-command - 1` (399) | Dimming backdrop when command bar is open |
| 14 | Global command bar | `#globalCommandBar` | `command-bar` | `--layer-command` (400) | Floating search and quick command input |
| 15 | Workspace | `#workspace` | `workspace` | — | Scrollable page content area |
| 16 | Page root | `#pageRoot` | (bare div) | — | Container for all page renders |
| 17 | AI dock | `#aiDock` | `ai-dock` | `--layer-ai` (1200) | Fixed bottom-right AI panel toggle |

---

## 3. Layer Detail Audit

### 3.1 Sidebar (`#sidebarNav`, `.sidebar`)

**Position:** Fixed column in the `os-layout` grid. `position: sticky; top: 0; height: 100vh`.
**Z-index:** `--layer-sidebar` (100) — above base content, below topbar.

**Contains:**
- Brand section (`.sidebar-brand`): brand badge, app title, descriptor.
- Project switcher (`.sidebar-project`, `#projectSwitcher`): `<select>` dropdown for project selection.
- Primary navigation (`.sidebar-nav`): three `nav-group` sections — Primary, Secondary, System.
- Sidebar actions (`.sidebar-actions`): Refresh All button, Open AI Workspace button.

**Navigation groups confirmed in DOM:**
- **Primary:** Home, Setup, Library, Integrations, AI Command, Workflows, Publishing, Insights
- **Secondary:** Campaign Studio, Content Studio, Media Studio, Ads Manager, Research
- **System:** Task Center, Queue Center, Job Monitor, Notifications, Governance, Settings

**Interaction risk:**
- The `#projectSwitcher` `<select>` triggers project switching. If this element's `change` event handler is unregistered or its value is manipulated outside the route lifecycle, it could cause phantom project switches.
- **Risk: Low** — event binding is through `app.js` which owns project switching logic.

**Responsive behavior:**
- At ≤1024px: `os-layout` collapses to single column (`grid-template-columns: minmax(0, 1fr)`); sidebar slides off-screen.
- At ≤760px: workspace padding reduces.
- Sidebar toggle is controlled by `#sidebarToggleBtn` in the topbar.

**CSS ownership:** `07-sidebar.css` is the canonical owner. No other CSS file should define `.sidebar` rules.

---

### 3.2 Topbar (`#topbar`, `.topbar`)

**Position:** `position: relative; z-index: var(--layer-topbar)` (200). Part of the `main-shell` grid row.
**Height:** `min-height: 64px` matching `--shell-topbar-height`.

**Contains:**
- Left: sidebar toggle button (`#sidebarToggleBtn`, `.sidebar-toggle`), page context (`.page-context`).
  - Page context: `#pageEyebrow` (`.page-eyebrow`, currently `display: none`), `#pageTitle` (`.page-title`).
- Right: workspace chip (`.workspace-chip`, `#ctxProject`), exec action cluster.
  - Exec actions: command toggle (`#commandToggleBtn`), New button (`#execNewBtn`), AI Workspace button (`#execAskAiBtn`).
- Hidden paragraph: `#pageDescription` (`.page-description`, hidden attribute) — preserved for `app.js`/`page-standard.js` reads.

**Interaction risks:**
- `#pageTitle` and `#pageEyebrow` are updated by `app.js` on every route change. Page-level code that directly sets `document.title` or modifies `#pageTitle` outside the route lifecycle will conflict.
- The `.page-eyebrow` is `display: none` in `10-topbar-canonical.css`. This means even if `#pageEyebrow` is set to a value, it does not render. This is a **current gap**: the eyebrow label standard defined in the UX Operating Surface Standard is not yet surfaced in the topbar.
- **Risk: Medium.** The eyebrow display suppression may need to be toggled on as part of the operating surface standard rollout. This is a future topbar polish item, not a P0 action.
- `#execNewBtn` and `#execAskAiBtn` behavior depends on which route is active. These buttons must not be repurposed by page-level JS.

**CSS ownership:** `10-topbar-canonical.css` is the canonical owner.

---

### 3.3 Workspace (`#workspace`, `.workspace`)

**Position:** Second row of `main-shell` grid. Fills remaining height. `overflow-y: auto; overflow-x: hidden`.
**Bottom padding:** 92px — accounts for AI dock button.

**Contains:** `#pageRoot` and all page renders.

**Interaction risks:**
- Page code that adds `overflow` or `position: fixed` to elements inside the workspace may clip or escape the scroll container. Any fixed-position element inside a page must be scoped to the AI dock / command bar layer, not invented per-page.
- **Risk: Low** — current page code does not add fixed-position elements inside the workspace.
- The workspace `scroll-padding-top: 24px` aids in-page anchor navigation. If a page uses anchor links, this ensures the target is not obscured by any sticky header.

**CSS ownership:** `03-app-shell.css`.

---

### 3.4 Global Command Bar (`#globalCommandBar`, `.command-bar`)

**Position:** `position: fixed; top: calc(var(--shell-topbar-height, 64px) + 10px); left: 50%; z-index: var(--layer-command)` (400).
**Display:** Hidden by default. Shown when `.app-shell.is-command-open` class is added.

**Contains:**
- Search input (`#globalSearch`).
- Quick command input (`#quickCommandInput`).
- Command execute button.

**Command backdrop:** `#commandBackdrop`, `.command-backdrop`, z-index `--layer-command - 1` (399). Dimming layer behind the bar.

**Interaction risks:**
- The command bar uses `z-index: 400`, which sits above sidebar (100) and topbar (200). Any page-level element with `z-index > 400` would overlay the command bar unexpectedly.
- The command bar fallback height uses `64px` hardcoded alongside the token variable. If `--shell-topbar-height` changes, the fallback drifts.
- **Risk: Low** — the bar is modal-like; page code does not interact with it directly.
- `savePromptToQuickCommand()` in `operations-centers.js` directly writes to `#quickCommandInput.value`. This is a deliberate cross-page integration pattern. It must be preserved and not be overridden during page work.

**CSS ownership:** `04-command-layer.css` — canonical.

---

### 3.5 AI Dock (`#aiDock`, `.ai-dock`)

**Position:** `position: fixed; right: 20px; bottom: 20px; z-index: var(--layer-ai)` (1200).
**Display:** Always visible. Toggle panel shows/hides `.ai-dock-panel`.

**Contains:**
- Toggle button (`.ai-dock-toggle`): status dot, label, state text.
- Panel (`.ai-dock-panel`): AI conversation or command interface.

**Interaction risks:**
- Z-index 1200 places the AI dock above modals (900) and loading overlay (600). It is the highest-priority interactive surface in the shell. Page code must not create elements above this layer.
- The `workspace` bottom padding (92px) is sized for the AI dock toggle button. If the dock is removed or repositioned, the workspace padding must be updated.
- **Risk: Low** — the dock is a fixed shell element; page code does not modify it.

**CSS ownership:** `05-ai-layer.css` — canonical.

---

### 3.6 Loading Overlay (`#loadingOverlay`, `.loading-overlay`)

**Position:** `position: fixed; inset: 0; z-index: var(--layer-overlay)` (600).
**Display:** Hidden by default. Shown when `body.is-loading`, `body.loading`, `body.loading-locked`, `body.app-loading`, `body.app-locked`, or `body[data-loading-state]` state is active.

**Contains:**
- Loading card (`.loading-card`): spinner, title (`#loadingTitle`), message (`#loadingText`).

**Visibility triggers (confirmed in `02-layer-system.css`):**
```
body.is-loading
body.loading
body.loading-locked
body.app-loading
body.app-locked
body[data-loading-state] (unless "idle")
```

**Interaction risks:**
- Five separate body class names trigger the overlay. Any page-level JS that accidentally adds one of these classes to `body` will lock the UI behind the loading overlay.
- **Risk: Medium.** This is the most common form of accidental shell state pollution. All page-level JS must be audited for any code that touches `document.body.classList`.
- The loading overlay sits at z-index 600, below the AI dock (1200) and command bar (400 is below 600). This means the AI dock remains accessible during loading. The command bar does not — z-index 400 is below 600.

**CSS ownership:** `02-layer-system.css` — canonical.

---

### 3.7 Fatal Error Panel (`#fatalErrorPanel`, `.fatal-error-panel`)

**Position:** In-flow (not fixed). Rendered with `hidden` attribute by default; revealed only on fatal startup failure.
**ARIA:** `role="alert"`, `aria-live="assertive"`, `aria-hidden="true"` when hidden.

**Contains:**
- Title (`#fatalErrorTitle`).
- Message (`#fatalErrorText`).
- Error details (`#fatalErrorDetails`).
- Startup steps log (`#fatalStartupSteps`).
- Retry button (`#fatalRetryBtn`).
- Set Access Key button (`#fatalAccessKeyBtn`).

**Interaction risks:**
- None during normal operation — this panel only appears on boot failure.
- If a page's JavaScript throws an unhandled error that the startup sequence catches, it could trigger this panel unexpectedly.
- **Risk: Low** during UX work, provided pages do not throw errors during route initialization.

**CSS ownership:** `02-layer-system.css` implicitly; no specific file confirmed. The `.fatal-error-panel` class must not be used by page-level code.

---

### 3.8 Startup Diagnostics (`#startupStepBanner`, `#startupUnlockBar`, `#startupTracePanel`)

**Position:** In-flow. All hidden by default (`hidden` attribute).
**Purpose:** Development and emergency-recovery tooling. Not visible in normal operation.

**Interaction risks:**
- If these elements become visible during production operation, it indicates a startup timing issue, not a page-level problem.
- Page-level code must not touch these elements.

---

### 3.9 Global Feedback (`#globalMessage`, `#globalError`)

**Position:** `position: fixed; right: 16px; bottom: 16px; z-index: var(--layer-toast)` (1300).
**ARIA:** `globalMessage` is `aria-live="polite"`; `globalError` is `aria-live="assertive"`.

**Interaction risks:**
- Pages that call the global message system must use the API provided by `app.js` (`context.showMessage`, `context.showError`), not directly manipulate `#globalMessage.style` or `#globalError.textContent`.
- **Risk: Low** — the API pattern is established.

---

## 4. Layer Priority and Z-Index Order

```
z-index 0        → Base page content (in-flow)
z-index 30       → --layer-sticky (sticky scroll elements)
z-index 100      → --layer-sidebar (sidebar navigation)
z-index 200      → --layer-topbar (topbar header)
z-index 400      → --layer-command (command bar)
z-index 500      → --layer-drawer (future: slide-out drawers)
z-index 600      → --layer-overlay (loading overlay / blocking states)
z-index 900      → --layer-modal (modal dialogs — none currently active)
z-index 1200     → --layer-ai (AI dock toggle and panel)
z-index 1300     → --layer-toast (global message / error toasts)
```

**Unused layers:**
- `--layer-drawer` (500): No drawer component currently exists in the shell. The layer variable is defined but unoccupied.
- `--layer-modal` (900): No modal component currently exists. If modals are introduced in future, they must use this layer.

**Gap risk:**
- The command bar (400) is below the loading overlay (600). This means if the loading overlay is active, the command bar is inaccessible. This is intentional: the loading overlay is a blocking state.
- No page-level element should create a z-index above 30 without being a shell-level surface.

---

## 5. Shell Interaction Risk Matrix

| Layer | Risk of Page Interference | Notes |
|---|---|---|
| Sidebar | Low | Project switcher is the only sensitive control; event-bound in `app.js` |
| Topbar | Medium | `#pageTitle`, `#pageEyebrow` updated by route; page code must not modify |
| Command bar | Low | Fixed/modal; page code only writes to `#quickCommandInput.value` via API |
| AI dock | Low | Fixed; page code must not modify |
| Loading overlay | Medium | Body class pollution risk; page code must avoid `document.body.classList` mutations |
| Global toasts | Low | API-mediated; no direct DOM manipulation risk |
| Fatal error panel | Low | Only visible on boot failure; page code must not trigger |
| Startup diagnostics | Low | Hidden; page code must not interact |
| Workspace | Low | Scroll container; page code may affect scroll position but not structure |

---

## 6. Shell Elements That Must Not Be Modified During Page Work

The following elements are shell-owned and must not be:
- Styled by page-specific CSS.
- Modified by page-level JS outside of the API provided by `app.js` and `page-standard.js`.
- Hidden, removed, or repositioned.

| Element | Owner |
|---|---|
| `#sidebarNav` | `app.js` + `07-sidebar.css` |
| `#topbar`, `#pageTitle`, `#pageEyebrow` | `app.js` + `10-topbar-canonical.css` |
| `#globalCommandBar`, `#commandBackdrop` | `app.js` + `04-command-layer.css` |
| `#aiDock` | `app.js` + `05-ai-layer.css` |
| `#loadingOverlay` | `app.js` + `02-layer-system.css` |
| `#globalMessage`, `#globalError` | `app.js` |
| `#fatalErrorPanel` | `app.js` |
| `#startupStepBanner`, `#startupUnlockBar`, `#startupTracePanel` | `app.js` |

---

## 7. Page Root and Page Lifecycle

### 7.1 `#pageRoot`

All page content renders inside `#pageRoot`. Each page is represented by a `.page` element (or equivalent) that is set to `display: block` when active (`is-active` class) and `display: none` otherwise.

The router in `router.js` manages the `is-active` class and calls each page's render lifecycle. Pages must not:
- Modify other pages' DOM elements.
- Read or write to `#pageRoot` outside of their own render function.
- Persist listeners after their route is deactivated.

### 7.2 Page Visibility Rule

`.page { display: none }` + `.page.is-active { display: block }` is the canonical visibility pattern defined in `03-app-shell.css`. Pages must use this pattern. Do not use `hidden`, `visibility: hidden`, or `opacity: 0` as the primary visibility toggle.

---

## 8. Topbar Eyebrow Gap (Current)

`#pageEyebrow` (`.page-eyebrow`) is set to `display: none` in `10-topbar-canonical.css`. The eyebrow is in the DOM and is updated by route changes in `app.js`, but it is not visible.

The UX Operating Surface Standard defines the eyebrow label as a required part of the Header zone. There is a current gap between the standard and the shell implementation.

**Finding:** The topbar eyebrow suppression is a legacy state. When the P1 Operating Surface work begins, enabling the eyebrow display will be a safe topbar polish action — one that does not touch routing, backend, or data. It must be done as part of a dedicated shell polish pass, not during individual page layout work.

**Classification:** `do_not_touch_yet` — track for P1 shell polish.

---

## 9. Recommendations for Future Shell Cleanup

The following are P1 and P2 shell cleanup items. None are P0 actions. All are documentation findings only.

| Item | Priority | Notes |
|---|---|---|
| Enable topbar eyebrow display | P1 shell polish | Un-suppress `.page-eyebrow`; update `app.js` to set eyebrow text per route |
| Consolidate loading overlay triggers | P2 | Reduce five body classes to one canonical `[data-loading-state]` attribute |
| Remove command bar fallback hardcode | P2 | Replace `64px` fallback with sole reliance on `--shell-topbar-height` token |
| Add canonical drawer layer component | P3 | Define and implement the `.drawer` component using `--layer-drawer` (500) |
| Add canonical modal component | P3 | Define and implement the `.modal` component using `--layer-modal` (900) |
| Add page-scoping to topbar exec buttons | P2 | `#execNewBtn` and `#execAskAiBtn` behavior should be context-aware per active route |

---

## 10. No-Change Confirmation

This audit is documentation-only.

- No HTML files were modified.
- No CSS files were modified.
- No JS files were modified.
- No data/projects files were modified.
- No route behavior was changed.
- All findings are forward-looking inputs for P1 implementation work.

# STEP G3 — Final CSS Architecture Blueprint

**Purpose:**
This blueprint defines the official CSS architecture for MH-OS Control Center. It is binding for all redesign, migration, and operating surface work. No code, CSS, or JS changes are permitted under this contract. Documentation only.

---

## 1. Final Frontend Identity
- **MH-OS is an AI Business Operating System, not a dashboard or shell.**
- All CSS and UI/UX must reinforce this identity.

## 2. Final CSS Layer Model
1. **Tokens:**
   - All color, spacing, radius, font, and z-index primitives in 00-tokens.css
2. **Reset:**
   - Baseline normalization in 01-reset.css
3. **Layer/Z-Index System:**
   - Layer tokens and overlay management in 02-layer-system.css
4. **App Shell:**
   - Viewport, grid, and shell layout in 03-app-shell.css
5. **Navigation/Sidebar:**
   - Sidebar, navigation, and brand in 07-sidebar.css
6. **Topbar/Header:**
   - Topbar and header in 10-topbar-canonical.css
7. **Command/AI Overlay:**
   - Command bar, overlays, and AI dock in 04-command-layer.css, 05-ai-layer.css
8. **Components:**
   - Buttons, cards, panels, chips, badges, grids in 08-components-foundation.css
9. **Operations Surfaces:**
   - Task/operations layouts in 09-operations-centers.css
10. **Page-Specific Surfaces:**
    - All [data-page="..."] scoped CSS in 12-pages.css, 13-home-executive.css, 14-page-standard.css
11. **Clean Operating Layer:**
    - Opt-in, future-proof primitives in 15-clean-operating-layer.css
12. **Deprecated Legacy Quarantine:**
    - All legacy CSS in public/control-center/legacy/

## 3. Rules for CSS Ownership
- **Global:** Only tokens, reset, layer system, app shell, and global primitives.
- **Page-Scoped:** All selectors under [data-page="..."] or page-specific files.
- **Component-Level:** Only for reusable UI primitives (btn, card, panel, chip, badge, etc.).
- **Never Duplicated:** No selector may exist in more than one active CSS file.

## 4. Naming Strategy
- All final global primitives: `mhos-*` prefix (e.g., .mhos-clean-root, .mhos-btn)
- Page-scoped selectors: Only under `[data-page="..."]` or in page CSS files
- No new unscoped page selectors
- No legacy class reuse unless explicitly approved in audit

## 5. Result Preview Design System
Reusable primitives for all preview surfaces:
- `.mhos-preview-post` — Post preview
- `.mhos-preview-image` — Image preview
- `.mhos-preview-video` — Video preview
- `.mhos-preview-email` — Email preview
- `.mhos-preview-campaign` — Campaign preview
- `.mhos-preview-publishing` — Publishing package preview
- `.mhos-preview-customer` — Customer/call/sales preview
- All previews must use global tokens and be accessible

## 6. Operating Surface Layout Model
Every page must visually support:
- **Smart Header**
- **Main Workspace**
- **Result Preview**
- **Action Panel**
- **AI Guidance / AI Team Panel**

## 7. CSS Cleanup Strategy
1. Freeze current CSS (no new selectors outside audit)
2. Build and document global primitives
3. Migrate page by page, using [data-page="..."] and mhos-* only
4. Remove duplicates only after visual QA and audit
5. Quarantine all legacy CSS permanently

## 8. Duplication Prevention Rules
- No selector duplicates across active CSS files
- No patch blocks with same selectors
- No `!important` except for documented emergency overrides
- No CSS change without selector evidence in audit

## 9. Page Migration Order
1. Governance
2. Publishing
3. AI Team Command Center
4. Customer Operations
5. IVR / Sales Operations
6. Content Studio
7. Media Studio
8. Library
9. Home Executive Room
10. Settings / Setup

## 10. Validation Commands
- `git status --short` (no uncommitted noise outside intended files)
- `git diff --stat` (review scope)
- `grep duplicate selectors` (ensure no duplication)
- `node --check` for any touched JS files (when implementation starts)
- Browser QA checklist (all supported browsers, accessibility, and visual regression)

---


## 11. Design Tokens Freeze
- 00-tokens.css is the visual foundation.
- No token may be changed without a token audit.
- Token changes must list affected primitives and affected pages.
- Token changes require browser QA before merge.

## 12. Responsive Standard
- Every migrated page must work on desktop, laptop, tablet, and mobile.
- No horizontal overflow.
- No zoomed feeling.
- No stacked topbar chaos.
- Panels must collapse predictably.
- Result Preview must remain visible or accessible on smaller screens.

## 13. Accessibility Standard
- All interactive elements must have visible focus states.
- Color contrast must remain readable.
- Buttons and controls must be keyboard accessible.
- AI Guidance and Action Panels must not trap focus.
- Preview surfaces must have clear labels and alt text where relevant.

## 14. CSS Removal Rule
- No CSS may be removed only because it “looks unused”.
- Before removal, prove:
   1. selector usage is absent or migrated
   2. browser QA passes
   3. rollback path exists
   4. affected page owner is known
- Legacy CSS remains quarantined until removal is explicitly approved.

**This blueprint must be reviewed and signed by all contributors before any redesign or migration work begins.**

# STEP 41C — Global Shell Primitives CSS Plan

**Date:** 2026-05-14  
**Branch:** architecture/frontend-consolidation-v1  
**Mode:** DOCUMENTATION ONLY / planning-only  
**Status:** Ready for CSS patch implementation (STEP 41D)

---

## Executive Summary

This plan defines the **CSS primitive strategy for global page shell/header adoption** without making any changes to production CSS. It specifies:

- ✅ Which CSS file should hold new global shell primitives
- ✅ The exact list of proposed primitives (8 new classes)
- ✅ Selector safety rules (no global overrides, opt-in only)
- ✅ The relationship between `std-*`, `mhos-clean-*`, and `ops-*` namespaces
- ✅ Acceptance criteria for a future CSS patch
- ✅ Recommendation for STEP 41D (CSS primitives vs. Governance audit)

**Key Decision:**  
New global shell primitives should be added to **`14-page-standard.css`** (not a new file), because:
- It already contains page structure classes (`.std-page-shell`, `.std-context-ribbon`, etc.)
- It's the established home for `.std-*` selectors
- Adding to it requires no index.html changes
- Operations pages can immediately adopt new classes without new stylesheet links

**Safety Guarantee:**  
All new CSS will follow the **`:where()` pattern** from `15-clean-operating-layer.css` where needed, ensuring:
- No specificity conflicts with legacy code
- No unintended cascades or overrides
- All adoption remains opt-in (page must explicitly add the class)

---

## Active CSS Stack Reviewed

### Current CSS Layer Order (index.html)

```html
<link rel="stylesheet" href="./styles/00-tokens.css">                    <!-- Design tokens -->
<link rel="stylesheet" href="./styles/01-reset.css">                    <!-- CSS reset -->
<link rel="stylesheet" href="./styles/02-layer-system.css">             <!-- Loading overlay -->
<link rel="stylesheet" href="./styles/03-app-shell.css">                <!-- App layout shell -->
<link rel="stylesheet" href="./styles/07-sidebar.css">                  <!-- Sidebar nav -->
<link rel="stylesheet" href="./styles/10-topbar-canonical.css">         <!-- Top bar/command -->
<link rel="stylesheet" href="./styles/04-command-layer.css">            <!-- Command palette -->
<link rel="stylesheet" href="./styles/05-ai-layer.css">                 <!-- AI UI layer -->
<link rel="stylesheet" href="./styles/08-components-foundation.css">    <!-- Button, card, panel, badge -->
<link rel="stylesheet" href="./styles/09-operations-centers.css">       <!-- Operations pages (page-specific) -->
<link rel="stylesheet" href="./styles/12-pages.css">                    <!-- Page layouts (generic) -->
<link rel="stylesheet" href="./styles/13-home-executive.css">           <!-- Home page (page-specific) -->
<link rel="stylesheet" href="./styles/14-page-standard.css">            <!-- Page standard shell/ribbon (GLOBAL) -->
<link rel="stylesheet" href="./styles/15-clean-operating-layer.css">    <!-- Clean layer opt-in (GLOBAL) -->
```

**Key Observations:**
1. **14-page-standard.css** loads last (high specificity, intentional)
   - Contains: `.std-page-shell`, `.std-context-ribbon`, `.std-context-*`, etc.
   - Purpose: Global page structure defaults
   - Status: 1,954 lines (large, well-organized)

2. **15-clean-operating-layer.css** loads last (highest priority)
   - Contains: `.mhos-clean-*` classes with `:where()` wrappers
   - Purpose: Opt-in semantic styling layer (no specificity conflicts)
   - Status: 118 lines (small, clean, isolated)

3. **09-operations-centers.css** loads earlier
   - Contains: Operations-specific page styles (`.ops-*`, page-targeted)
   - Purpose: Task Center, Queue Center, Job Monitor, Notification Center layouts
   - Status: 1,565 lines (large, page-specific)

4. **08-components-foundation.css** provides base components
   - Contains: `.btn`, `.card`, `.panel`, `.panel-header`, `.panel-kicker`, `.badge`, etc.
   - Purpose: Shared component primitives (buttons, cards, badges, etc.)

### CSS Architecture Principle

**Layered, Non-Cascading, Opt-In:**
- Foundation layers (tokens, reset, app shell, components) are always active
- Page-specific layers (09-operations-centers.css, 13-home-executive.css) target specific pages
- Global standards (14-page-standard.css) provide defaults and patterns
- Clean layer (15-clean-operating-layer.css) is opt-in (pages must add `.mhos-clean-root`)

---

## Recommended CSS Placement: 14-page-standard.css

### Rationale

**Option A: Add to 14-page-standard.css (RECOMMENDED)**
- ✅ Already contains page structure classes
- ✅ Consistent naming (`.std-*` prefix)
- ✅ No index.html changes needed
- ✅ No new stylesheet load overhead
- ✅ High priority (loads late, can override component defaults if needed)
- ✅ Already 1,954 lines; adding ~200–300 more is manageable

**Option B: Create new 16-final-page-shell.css**
- ❌ Requires index.html modification
- ❌ New stylesheet load (one more network request)
- ❌ Unnecessary separation (still `.std-*` namespace)
- ❌ Adds complexity to CSS loading order

**Option C: Add to 15-clean-operating-layer.css**
- ❌ Clean layer is for opt-in _styling_ (colors, shadows, spacing)
- ❌ New primitives are _structural_ (layout, grid, flex)
- ❌ Would blur the purpose of 15-clean-operating-layer.css
- ❌ Clean layer should stay small and focused

**Decision:** Add new global shell primitives to **14-page-standard.css**

---

## Proposed Primitive List (8 New Classes)

All new classes will follow the `.std-` naming convention and use `:where()` where specificity safety is needed.

### Primitive 1: `.std-main-column`
```css
.std-main-column {
  display: grid;
  gap: var(--space-4);
  min-width: 0;
}
```
**Purpose:** Main content area wrapper (page-specific content: table, form, grid, builder, etc.)  
**Location:** 14-page-standard.css  
**Specificity:** Simple (no `:where()` needed; low specificity)  
**Usage:** All pages after adoption  
**Notes:** Page-specific content inside remains unchanged; layout is set at wrapper level

---

### Primitive 2: `.std-right-rail`
```css
.std-right-rail {
  display: grid;
  gap: var(--space-4);
  min-width: 0;
  width: 100%;
  max-width: 360px;
  align-self: start;
  align-content: start;
}

@media (max-width: 960px) {
  .std-right-rail {
    /* On smaller screens, right-rail becomes drawer/collapsible (page-specific handling) */
    display: none; /* or drawer pattern per page */
  }
}
```
**Purpose:** Right sidebar container for detail, action, AI panels  
**Location:** 14-page-standard.css  
**Specificity:** Simple (no `:where()` needed)  
**Responsive:** md+ (visible), sm/xs (drawer or collapse per page)  
**Usage:** Pages with detail/action/AI patterns (most pages after adoption)  
**Notes:** Page-specific drawer/collapse logic is not defined here (per-page choice)

---

### Primitive 3: `.std-detail-card`
```css
.std-detail-card {
  min-width: 0;
}
```
**Purpose:** Selected item detail panel wrapper  
**Location:** 14-page-standard.css  
**Specificity:** None (just sets min-width for grid children)  
**Usage:** Pages with selectable items (Tasks, Approvals, Assets, etc.)  
**Notes:** Content structure is page-specific; styling comes from `.mhos-clean-surface` (opt-in clean layer)

---

### Primitive 4: `.std-action-panel`
```css
.std-action-panel {
  min-width: 0;
}
```
**Purpose:** Action surface wrapper  
**Location:** 14-page-standard.css  
**Specificity:** None (just sets min-width)  
**Usage:** Pages with state-changing actions  
**Notes:** Button layout and action logic are page-specific; styling from `.mhos-clean-surface`

---

### Primitive 5: `.std-ai-panel`
```css
.std-ai-panel {
  min-width: 0;
}
```
**Purpose:** AI assistance surface wrapper  
**Location:** 14-page-standard.css  
**Specificity:** None (just sets min-width)  
**Usage:** Pages with AI-assisted decision support  
**Notes:** Prompts and AI logic are page-specific; styling from `.mhos-clean-surface`

---

### Primitive 6: `.std-action-row`
```css
.std-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}
```
**Purpose:** Horizontal button row (for action/AI panels)  
**Location:** 14-page-standard.css  
**Specificity:** Simple  
**Usage:** Action panel buttons, AI panel open button  
**Notes:** Button styling already handled by `.btn` component

---

### Primitive 7: `.std-deferred-actions`
```css
.std-deferred-actions {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(122, 169, 205, 0.16);
}
```
**Purpose:** Deferred mutations container (disabled until safety pass)  
**Location:** 14-page-standard.css  
**Specificity:** Simple  
**Usage:** Action panels where mutations exist (Settings, Governance, etc.)  
**Notes:** Visual separation between active and deferred actions

---

### Primitive 8: `.std-quick-actions`
```css
.std-quick-actions {
  display: grid;
  gap: var(--space-3);
}

.std-quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px solid rgba(122, 169, 205, 0.16);
  border-radius: var(--radius-md);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;
}

.std-quick-action-btn:hover {
  border-color: rgba(122, 169, 205, 0.34);
  background: rgba(122, 169, 205, 0.08);
}

.std-quick-action-btn .prompt-title {
  font-weight: 600;
  color: var(--text-primary);
}

.std-quick-action-btn .prompt-meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
```
**Purpose:** Quick prompt buttons container and button styling  
**Location:** 14-page-standard.css  
**Specificity:** Simple (element selectors for inner elements)  
**Usage:** AI panel quick prompts  
**Notes:** Already exists in operations-centers.js; this is the generalized version

---

## Selector Safety Rules

### ✅ Rules That Will Be Enforced

#### Rule 1: No Global Component Overrides
```css
/* ❌ DO NOT DO THIS */
.btn { /* override */ }
.card { /* override */ }
.panel { /* override */ }
.panel-header { /* override */ }
.badge { /* override */ }

/* ✅ DO THIS INSTEAD */
.std-action-row .btn { /* targeting specific context, safe */ }
```
**Why:** Legacy code depends on `.btn`, `.card`, `.panel` behavior; global overrides break existing pages

#### Rule 2: No Global HTML Element Resets
```css
/* ❌ DO NOT DO THIS */
body { /* reset */ }
html { /* reset */ }
:root { /* reset */ }
* { /* reset */ }

/* ✅ ALREADY AVOIDED */
/* Resets are in 01-reset.css, not in new primitives */
```
**Why:** Resets already handled; new CSS should not interfere with foundational layer

#### Rule 3: No ID Selectors
```css
/* ❌ DO NOT DO THIS */
#taskCenterRefreshBtn { /* style */ }
#governanceApprovalQueue { /* style */ }

/* ✅ DO THIS INSTEAD */
.std-action-row button { /* or use class-based selectors */ }
```
**Why:** IDs are for JS handlers; CSS should not couple to specific IDs

#### Rule 4: No Data Attribute Selectors (for styling)
```css
/* ❌ DO NOT DO THIS */
[data-ops-focus="all"] { /* style */ }
[data-page="governance"] { /* style */ }

/* ✅ OK: Page-specific targeting where necessary */
/* But use class-based selectors for new primitives */
```
**Why:** Data attributes are for JS logic; CSS should use classes for styling

#### Rule 5: No Page-Specific Selectors in Primitives
```css
/* ❌ DO NOT DO THIS IN PRIMITIVES */
[data-page="governance"] .std-detail-card { /* override */ }
[data-page="settings"] .std-main-column { /* override */ }

/* ✅ OK: In page-specific CSS files (09-operations-centers.css, etc.) */
[data-page="governance"] .governance-specific-class { /* style */ }
```
**Why:** New primitives should be page-agnostic; page-specific tweaks go in page-specific CSS

#### Rule 6: Prefer Opt-In Namespaced Selectors
```css
/* ✅ GOOD: All primitives are prefixed .std- */
.std-main-column { }
.std-right-rail { }
.std-action-panel { }

/* ✅ GOOD: Clean layer is prefixed .mhos-clean- with :where() */
:where(.mhos-clean-surface) { }

/* ❌ AVOID: Generic names without namespace */
.main-column { /* too generic */ }
.right-rail { /* could collide */ }
```
**Why:** Namespacing prevents collisions and makes intent clear

#### Rule 7: Use `:where()` Only When Specificity Safety Is Needed
```css
/* ✅ GOOD: Simple rules without :where() */
.std-main-column {
  display: grid;
  gap: var(--space-4);
}

/* ✅ GOOD: Complex rules with :where() for specificity safety */
:where(.mhos-clean-surface) {
  padding: var(--mhos-clean-space-4);
  border: 1px solid var(--mhos-clean-surface-border);
  background: linear-gradient(...);
}
```
**Why:** `:where()` eliminates specificity for that rule, preventing cascades and overrides; use judiciously

---

## Relationship with Existing Classes

### `.std-*` Namespace (Page Structure)
- **Home:** `14-page-standard.css`
- **Purpose:** Global page structure and layout primitives
- **Scope:** Applies to all pages after adoption
- **Current Examples:** `.std-page-shell`, `.std-context-ribbon`, `.std-context-eyebrow`, `.std-context-title`, etc.
- **New Additions:** `.std-main-column`, `.std-right-rail`, `.std-detail-card`, `.std-action-panel`, `.std-ai-panel`, `.std-action-row`, `.std-deferred-actions`, `.std-quick-actions`
- **Specificity:** Low (usually 1 class = 100 specificity)

### `.mhos-clean-*` Namespace (Visual Skin / Opt-In Layer)
- **Home:** `15-clean-operating-layer.css`
- **Purpose:** Opt-in semantic styling layer (colors, shadows, spacing, typography)
- **Scope:** Applied only when page opts-in (adds `.mhos-clean-root` to wrapper)
- **Current Examples:** `.mhos-clean-shell`, `.mhos-clean-stack`, `.mhos-clean-surface`, `.mhos-clean-title`, etc.
- **Specificity:** 0 (all rules use `:where()` wrapper)
- **Relationship:** Complements `.std-*` structure; pages use both together

**Example Combined Usage:**
```html
<div class="std-page-shell mhos-clean-root">
  <!-- Page opted-in to both structure (.std-*) and clean styling (.mhos-clean-*) -->
  
  <section class="std-context-ribbon">
    <!-- Structure from std-* -->
  </section>
  
  <div class="std-main-column mhos-clean-stack">
    <!-- Structure: std-main-column -->
    <!-- Visual skin: mhos-clean-stack (grid, gap, spacing) -->
  </div>
  
  <aside class="std-right-rail mhos-clean-stack">
    <!-- Structure: std-right-rail -->
    <!-- Visual skin: mhos-clean-stack -->
    
    <section class="std-detail-card mhos-clean-surface">
      <!-- Structure: std-detail-card -->
      <!-- Visual skin: mhos-clean-surface (padding, border, background) -->
    </section>
    
    <section class="std-action-panel mhos-clean-surface">
      <!-- Structure: std-action-panel -->
      <!-- Visual skin: mhos-clean-surface -->
      <div class="std-action-row">
        <!-- Structure: std-action-row (flex, gap) -->
        <button class="btn btn-primary">Action</button>
        <!-- Button styling from 08-components-foundation.css -->
      </div>
    </section>
  </aside>
</div>
```

### `.ops-*` Namespace (Operations-Specific, Legacy)
- **Home:** `09-operations-centers.css`
- **Purpose:** Task Center, Queue Center, Job Monitor, Notification Center page-specific styles
- **Scope:** `[data-page="task-center"]`, `[data-page="queue-center"]`, etc.
- **Current Examples:** `.ops-shell`, `.ops-workspace`, `.ops-right-rail`, `.ops-detail-card`, `.ops-action-panel`, `.ops-ai-panel`, etc.
- **Future:** After all pages adopt `.std-*`, can consider consolidating `.ops-*` into `.std-*` (post-launch cleanup)
- **No Changes Planned:** For this cycle, `.ops-*` remains as-is; new pages use `.std-*`

### Relationship Matrix

| Namespace | File | Purpose | Specificity | Adoption |
|-----------|------|---------|-------------|----------|
| `.std-*` | 14-page-standard.css | Page structure (layout, grid, gaps) | Low (100) | All pages |
| `.mhos-clean-*` | 15-clean-operating-layer.css | Visual skin (colors, shadows, spacing) | 0 (:where()) | Opt-in (add to root) |
| `.ops-*` | 09-operations-centers.css | Operations-specific (legacy) | Variable | Operations pages only |
| `.btn`, `.card`, `.panel` | 08-components-foundation.css | Base components (buttons, cards, badges) | Variable | All pages (shared) |

---

## Non-Goals (What Will NOT Happen)

### ❌ CSS Cleanup (Not Yet)
- ❌ Do NOT delete legacy `.ops-*` classes
- ❌ Do NOT remove old `.panel`, `.panel-header` styles
- ❌ Do NOT consolidate Operations styles into global yet
- ❌ CSS cleanup happens post-launch (STEP 50+)

**Why:** Legacy code still relies on old classes; removal could break pages during adoption

### ❌ Markup Patch (Not Yet)
- ❌ Do NOT add new classes to pages now
- ❌ Do NOT restructure page markup yet
- ❌ Do NOT change IDs or data attributes
- ❌ Markup adoption happens page-by-page in STEP 41D+ (with per-page audits)

**Why:** Each page adoption is independent; changes are validated page-by-page

### ❌ All-Pages-at-Once Adoption
- ❌ Do NOT apply new primitives to all pages in one patch
- ❌ Do NOT mix multiple pages in one commit
- ❌ Do NOT adopt before page-specific audit (STEP 41D+)

**Why:** Rollback must be per-page; if one page breaks, others are not affected

### ❌ CSS Specificity Wars
- ❌ Do NOT use ID selectors to override things
- ❌ Do NOT use `!important` in new primitives
- ❌ Do NOT use overly specific selectors (e.g., `.std-page-shell > div > section`)

**Why:** Specificity debt makes future maintenance impossible

---

## Acceptance Criteria for STEP 41D CSS Patch

Before any new CSS is added to `14-page-standard.css`, the following must be true:

### ✅ Technical Requirements

- [ ] All 8 proposed primitives are defined with correct selectors
- [ ] No `:where()` used except where specificity safety is critical (document why)
- [ ] All selectors follow naming convention (`.std-*`)
- [ ] No global component overrides (`.btn`, `.card`, `.panel`)
- [ ] No HTML/body/`:root` resets
- [ ] No ID selectors
- [ ] No data attribute selectors (for styling)
- [ ] No page-specific selectors
- [ ] Responsive breakpoint strategy documented (md+ vs. sm/xs)
- [ ] All new rules are `min-width: 0` or use `var(--space-*) tokens` (consistent with design system)

### ✅ Documentation Requirements

- [ ] Each primitive has a comment block explaining purpose
- [ ] Each primitive has usage notes (which pages use it)
- [ ] Responsive behavior is documented
- [ ] Relationship to `.mhos-clean-*` is clear
- [ ] No migration path confusion (`.ops-*` vs. `.std-*`)

### ✅ Testing Requirements

- [ ] CSS loads without errors (browser console check)
- [ ] No console warnings or style conflicts
- [ ] Existing pages (operations, home) still render correctly
- [ ] New classes don't break legacy styling
- [ ] Performance impact is negligible

### ✅ Review Requirements

- [ ] CSS changes reviewed for safety (Rule 1–7)
- [ ] No surprises: all changes match this STEP 41C plan exactly
- [ ] Size budget: additions < 300 lines
- [ ] No specificity regressions

---

## Recommended STEP 41D

After STEP 41C (this plan) is approved, STEP 41D should be one of:

### Option A: Add Global Shell Primitives CSS to 14-page-standard.css (RECOMMENDED)

**Purpose:** Add all 8 new CSS primitives to `14-page-standard.css` without modifying any markup  
**Changes:** CSS only (14-page-standard.css)  
**Impact:** Zero impact (new classes are not used yet)  
**Deliverables:**
- Updated 14-page-standard.css with 8 new primitives
- Documented in comments per acceptance criteria
- Committed separately

**Timeline:** 1 day  
**Rationale:** Get CSS ready for immediate adoption; markup changes come later (STEP 41E+)

**Next After 41D:** STEP 41E (Governance Page Shell Audit with Real Markup Changes)

---

### Option B: Governance Page Shell/Header Audit First

**Purpose:** Audit Governance page in detail; create proof-of-concept markup (do NOT commit); identify any issues with the plan  
**Changes:** Documentation + PoC markup (not committed)  
**Impact:** Zero (nothing committed)  
**Deliverables:**
- Governance audit document (current → target structure)
- PoC HTML markup showing adoption pattern
- Risk assessment for Governance specifically
- Any plan adjustments needed

**Timeline:** 1–2 days  
**Rationale:** Validate adoption plan with a real page before committing CSS

**Next After 41B Option 2:** STEP 41D (Add Global Shell Primitives CSS)  
**Then:** STEP 41E (Governance adoption with real markup)

---

### Recommended Path

**Do STEP 41D (Option A) FIRST:**
1. Add CSS primitives to 14-page-standard.css (safe, zero impact, CSS-only)
2. Commit CSS separately
3. Then STEP 41E: Audit Governance with real markup changes
4. Then STEP 41F+: Page-by-page adoption (Governance → Settings → Integrations → ...)

**Why This Order:**
- ✅ CSS is ready when needed
- ✅ No CSS surprises later
- ✅ Markup adoption can start immediately
- ✅ Per-page audits are faster (CSS already in place)

---

## Explicit No-Code-Change Statement

**This plan is documentation-only.**

✋ **The following have NOT been changed:**
- ❌ No CSS files modified
- ❌ No HTML files modified
- ❌ No JavaScript files modified
- ❌ No markup restructured
- ❌ No index.html changed
- ❌ No existing classes deleted or overridden

**This plan:**
- ✅ Reviews the active CSS stack (00-tokens through 15-clean-operating-layer)
- ✅ Recommends CSS placement (14-page-standard.css)
- ✅ Defines 8 new primitives (with code examples)
- ✅ Establishes selector safety rules (7 rules)
- ✅ Clarifies namespace relationships (`.std-*`, `.mhos-clean-*`, `.ops-*`)
- ✅ Documents non-goals (no cleanup, no all-pages patch, etc.)
- ✅ Sets STEP 41D acceptance criteria (14 checkpoints)
- ✅ Recommends STEP 41D path (CSS first, then Governance audit)

**Next Action:**
STEP 41D will add the 8 primitives to `14-page-standard.css` (CSS-only patch, zero impact). No markup changes until STEP 41E (Governance audit) and STEP 41F+ (page adoptions).

---

**Plan Complete**  
**No CSS changes made.**  
**Ready for STEP 41D — Add Global Shell Primitives CSS to 14-page-standard.css**


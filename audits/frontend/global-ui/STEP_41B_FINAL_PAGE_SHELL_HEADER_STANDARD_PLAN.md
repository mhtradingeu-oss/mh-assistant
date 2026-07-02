# STEP 41B — Final Page Shell/Header Standard Plan

**Date:** 2026-05-14  
**Branch:** architecture/frontend-consolidation-v1  
**Mode:** DOCUMENTATION ONLY / planning-only  
**Status:** Ready for adoption execution (STEP 41C)

---

## Executive Summary

This plan defines the **Final Global Page Shell/Header Standard** that all launch-ready Control Center pages must adopt before final UI redesign. The standard is derived from the Operations pages (Task Center, Queue Center, Job Monitor, Notification Center), which have achieved the target structure through clean-layer adoption (STEP 36–40).

**What This Plan Establishes:**
- ✅ The definitive page structure model (5 required layers, 4 optional patterns)
- ✅ Global CSS primitives and naming strategy (existing + new)
- ✅ Adoption rules that preserve all IDs, data attributes, handlers, and APIs
- ✅ Page-by-page rollout sequence (6 priority pages, then remainder)
- ✅ Launch-ready page criteria and acceptance checklist
- ✅ Risk controls and rollback strategies
- ✅ Recommendation for STEP 41C (either global primitives CSS or first page audit)

**Key Principle:**  
This is an **opt-in structural adoption**, not a breaking change. All production code remains untouched. CSS additions use `:where()` wrappers and opt-in class namespaces. Pages opt into the standard by adopting the wrapper classes and semantic structure; handler logic and APIs remain exactly as they are today.

**Timeline:**
- STEP 41B (this plan): Documentation
- STEP 41C (not yet): Global CSS primitives OR first non-Operations page audit
- STEP 41D+: Sequential page adoption (Governance → Settings → Integrations → Library → Publishing → Campaign Studio)

---

## Final Page Model

All launch-ready Control Center pages must adopt this 5-layer + 4-pattern structure:

### Layer 1: Page Container
```
<section class="page is-active" data-page="{page-id}">
  <div class="std-page-shell">
    ...
  </div>
</section>
```
- **Class:** `std-page-shell` (wrapper for entire page content)
- **Data Attribute:** `data-page="{page-id}"` (preserved, no changes)
- **Purpose:** Single, unified page container
- **Status:** Existing pattern in page-standard.js

---

### Layer 2: Context Ribbon (Header)
```
<section class="std-context-ribbon">
  <div class="std-context-main">
    <div class="std-context-line">
      <span class="std-context-eyebrow">{DOMAIN}</span>
      <h3 class="std-context-title">{Page Title}</h3>
    </div>
    <p class="std-context-description">{Purpose, scope, or current state}</p>
    <div class="std-context-metrics">
      <span class="std-context-chip">{metric}</span>
      <span class="std-context-chip is-warning">{metric}</span>
      <span class="std-context-chip is-danger">{metric}</span>
    </div>
  </div>
  <div class="std-context-actions">
    <span class="card-badge">{Status Badge}</span>
    <button class="btn btn-secondary std-context-btn">{Primary Action}</button>
  </div>
</section>
```

**Components:**
- `.std-context-eyebrow` — Uppercase domain label (e.g., "TASK CENTER", "GOVERNANCE", "LIBRARY")
- `.std-context-title` — Page title (clipped if needed, no text-overflow on wrap)
- `.std-context-description` — 1–2 sentence purpose statement (secondary text)
- `.std-context-metrics` — Live metric chips (total, open, overdue, alerts, etc.)
  - `.std-context-chip` — Neutral badge
  - `.std-context-chip.is-warning` — Warning badge
  - `.std-context-chip.is-danger` — Danger badge
- `.std-context-actions` — Right side: status badge + primary button

**Status:** Existing pattern; defined in `14-page-standard.css`

**Required on:** All launch-ready pages (100% adoption)

---

### Layer 3: Main View / Content Area
```
<div class="std-main-column">
  <!-- Page-specific content: table, grid, form, builder, etc. -->
  <!-- May include: focus tabs, filters, toolbar, content grid/table -->
</div>
```

**Structure:** Page-specific. Each page type has unique content:
- **Operations pages:** Table with focus tabs, search, filters
- **Configuration pages:** Form sections with fields
- **Asset pages:** Grid or list with search
- **Builder pages:** Editor + canvas + controls

**CSS:** Page applies layout and structure (grid/flex). May use:
- `.std-focus-tabs` — Tab navigation (existing pattern in operations)
- `.std-toolbar` — Filter/search bar
- `.std-table` — Table container (existing)
- `.std-grid` — Grid container (page-specific sizing)

**Status:** Mostly existing patterns; may need minor naming consistency

**Required on:** All pages (content varies by page)

---

### Layer 4: Right Rail (Context Navigation)
```
<aside class="std-right-rail">
  <!-- Three stacked panels: detail card, action panel, AI panel -->
</aside>
```

**Sub-Containers:**

#### 4a. Detail Card / Selected Item Panel
```
<section class="std-detail-card mhos-clean-surface">
  <div class="panel-header">
    <div>
      <div class="panel-kicker">{Entity Type}</div>
      <h3>{Item Title or "Select an item"}</h3>
      <p>{Context or instructions}</p>
    </div>
  </div>
  <!-- Page-specific detail rows, metadata, linked entities -->
</section>
```
- **Content:** Selected item review (fields, metadata, linked work)
- **Empty State:** "Select a {entity} to view details"
- **Status:** Existing pattern in operations-centers.js
- **Required on:** Pages with selectable items (Tasks, Governance approvals, Library assets, etc.)

#### 4b. Action Panel
```
<section class="std-action-panel mhos-clean-surface">
  <div class="panel-header">
    <div>
      <div class="panel-kicker">Action Panel</div>
      <h3>Page/Item Actions</h3>
      <p>{Safety explanation or action description}</p>
    </div>
  </div>
  <div class="std-action-row">
    <!-- Active, safe, non-destructive buttons -->
    <button class="btn btn-primary">Primary Action</button>
    <button class="btn btn-secondary">Secondary Action</button>
  </div>
  <div class="std-deferred-actions">
    <!-- Deferred actions with safety explanations (disabled) -->
    <button class="btn btn-ghost" disabled>Mutation Action (deferred: mutation safety pass)</button>
  </div>
</section>
```
- **Content:** Safe actions (refresh, route, copy) + deferred mutations (with explanations)
- **Safety Model:** Active (enabled) vs. Deferred (disabled) with clear explanations
- **Status:** Existing pattern in operations-centers.js
- **Required on:** Pages with state-changing actions

#### 4c. AI Panel
```
<section class="std-ai-panel mhos-clean-surface">
  <div class="panel-header">
    <div>
      <div class="panel-kicker">AI Panel</div>
      <h3>AI Assistant</h3>
      <p>Context-only handoff: opens AI with prompt/context only.</p>
    </div>
  </div>
  <div class="std-action-row">
    <button class="btn btn-secondary" data-ops-ai-open>Open in AI Workspace</button>
  </div>
  <div class="std-quick-actions">
    <!-- Page-specific quick prompt buttons -->
    <button class="std-quick-action-btn" data-ai-prompt="0">
      <span class="prompt-title">{Prompt Label}</span>
      <span class="prompt-meta">{Preview Text}</span>
    </button>
  </div>
</section>
```
- **Content:** AI open button + 3–5 quick prompt buttons (context-aware)
- **Handoff:** Context-only (no approval, publishing, or backend execution)
- **Status:** Existing pattern in operations-centers.js
- **Required on:** Pages that benefit from AI decision support

**Right Rail Stack:**
```
.std-right-rail (flex/grid, column, gap)
  ├─ .std-detail-card (mhos-clean-surface)
  ├─ .std-action-panel (mhos-clean-surface)
  └─ .std-ai-panel (mhos-clean-surface)
```

**Status:** Structure exists in operations; needs naming standardization

**Required on:** Most pages (detail, action, AI patterns)

---

### Layer 5: System Signal / Context Strip (Optional)
```
<section class="std-signal-strip" data-signal-type="runtime|approvals|alerts">
  <!-- Cross-page operational context, system health, next-best-action -->
</section>
```

**Examples:**
- Operations pages show executive runtime signal (jobs, queue, alerts, approvals)
- Home page shows team summary + blockers
- Governance page shows approval queue summary
- Publishing page shows execution status

**Status:** Operations-specific pattern (`.panel ops-executive-strip`)

**Required on:** Pages with cross-system dependencies (optional, recommend on most pages)

---

## Global Primitives Specification

These are the CSS classes and semantic structures that must be globally available for all pages to opt into.

### Existing Primitives (Already Defined)

#### Page Shell Foundation
| Class | File | Status | Purpose |
|-------|------|--------|---------|
| `.std-page-shell` | 14-page-standard.css | ✅ Active | Main page container wrapper |
| `.std-context-ribbon` | 14-page-standard.css | ✅ Active | Header with eyebrow, title, description, metrics |
| `.std-context-main` | 14-page-standard.css | ✅ Active | Left side of ribbon (content) |
| `.std-context-line` | 14-page-standard.css | ✅ Active | Eyebrow + title line |
| `.std-context-eyebrow` | 14-page-standard.css | ✅ Active | Domain label (uppercase, teal) |
| `.std-context-title` | 14-page-standard.css | ✅ Active | Page title (large, bold) |
| `.std-context-description` | 14-page-standard.css | ✅ Active | Purpose/scope text (secondary) |
| `.std-context-metrics` | 14-page-standard.css | ✅ Active | Metric chips container |
| `.std-context-chip` | 14-page-standard.css | ✅ Active | Individual metric badge |
| `.std-context-chip.is-warning` | 14-page-standard.css | ✅ Active | Warning tone |
| `.std-context-chip.is-danger` | 14-page-standard.css | ✅ Active | Danger tone |
| `.std-context-actions` | 14-page-standard.css | ✅ Active | Right side of ribbon (actions) |

#### Clean Layer Semantic Tokens & Primitives
| Class | File | Status | Purpose |
|-------|------|--------|---------|
| `.mhos-clean-root` | 15-clean-operating-layer.css | ✅ Active | Root opt-in class (defines tokens) |
| `.mhos-clean-shell` | 15-clean-operating-layer.css | ✅ Active | Page shell grid layout |
| `.mhos-clean-stack` | 15-clean-operating-layer.css | ✅ Active | Vertical stack layout |
| `.mhos-clean-surface` | 15-clean-operating-layer.css | ✅ Active | Panel surface (padding, border, bg) |
| `.mhos-clean-surface.is-raised` | 15-clean-operating-layer.css | ✅ Active | Elevated surface with shadow |
| `.mhos-clean-title` | 15-clean-operating-layer.css | ✅ Active | Card title typography |
| `.mhos-clean-copy` | 15-clean-operating-layer.css | ✅ Active | Body text typography |
| `.mhos-clean-eyebrow` | 15-clean-operating-layer.css | ✅ Active | Eyebrow typography |
| `.mhos-clean-pill` | 15-clean-operating-layer.css | ✅ Active | Status badge (circular) |
| `.mhos-clean-pill.is-ai` | 15-clean-operating-layer.css | ✅ Active | AI tone pill |
| `.mhos-clean-pill.is-info` | 15-clean-operating-layer.css | ✅ Active | Info tone pill |

#### Operations-Specific Patterns (To Be Generalized)
| Class | File | Current Usage | Proposed Global Name |
|-------|------|---------------|--------------------|
| `.ops-right-rail` | operations-centers.js | Task/Queue/Job/Notification Centers | `.std-right-rail` |
| `.ops-detail-card` | operations-centers.js | Detail panels in all 4 centers | `.std-detail-card` |
| `.ops-action-panel` | operations-centers.js | Action panels in all 4 centers | `.std-action-panel` |
| `.ops-ai-panel` | operations-centers.js | AI panels in all 4 centers | `.std-ai-panel` |
| `.ops-focus-tabs` | operations-centers.js | Tab navigation in all 4 centers | `.std-focus-tabs` |
| `.ops-toolbar` | operations-centers.js | Filter/search bar in all 4 centers | `.std-toolbar` |
| `.panel-header` | multiple | Generic panel header (legacy) | `.std-panel-header` (alias) |
| `.panel-kicker` | multiple | Small label above title (legacy) | `.std-panel-kicker` (alias) |

---

### New Primitives (To Be Defined in STEP 41C)

If STEP 41C is **Global Shell Primitives CSS Plan**, these new classes must be added:

| Class | Purpose | Parent | Used In |
|-------|---------|--------|---------|
| `.std-right-rail` | Right sidebar container | `.std-page-shell` | All pages with detail/action/AI |
| `.std-detail-card` | Selected item panel wrapper | `.std-right-rail` | Pages with selectable items |
| `.std-action-panel` | Action surface wrapper | `.std-right-rail` | Pages with state-changing actions |
| `.std-ai-panel` | AI assistance surface wrapper | `.std-right-rail` | Most pages (optional) |
| `.std-main-column` | Main content area wrapper | `.std-page-shell` | All pages |
| `.std-focus-tabs` | Tab navigation container | `.std-main-column` | Pages with focus/filter tabs |
| `.std-toolbar` | Filter/search bar container | `.std-main-column` | Pages with filters |
| `.std-action-row` | Horizontal button row | `.std-*-panel` | Action/AI panels |
| `.std-deferred-actions` | Deferred mutation actions container | `.std-action-panel` | Pages with mutations |
| `.std-quick-actions` | Quick prompt buttons container | `.std-ai-panel` | AI panels |

---

## Naming Strategy

### Principle: Gradual Unification

**Phase 1 (Existing):**
- Keep existing `.std-context-*` and `.mhos-clean-*` classes (fully standardized)
- Existing code already uses these

**Phase 2 (This Plan):**
- Adopt `.std-right-rail`, `.std-detail-card`, `.std-action-panel`, `.std-ai-panel` across all pages
- These replace page-specific names (`.ops-right-rail` → `.std-right-rail`, etc.)
- Operations pages keep their render functions unchanged; just update class names in HTML

**Phase 3 (Future, Post-Launch):**
- Consider full rename of `.ops-*` → `.std-*` across all operations-specific utilities
- Not in this cycle; focus on structure only

### Naming Convention

**Prefix Strategy:**
- `.std-` = global, cross-page standard pattern
- `.mhos-clean-` = opt-in semantic token/primitive
- `.{page-id}-` = page-specific utilities (preserved, not touched)

**Example: Governance Page Adoption**

```html
<!-- Before -->
<div class="governance-shell">
  <div class="governance-header">
    <h1>Governance</h1>
  </div>
  <div class="governance-main">
    <!-- page-specific content -->
  </div>
  <!-- no right rail -->
</div>

<!-- After (STEP 41D) -->
<div class="std-page-shell mhos-clean-root mhos-clean-shell">
  <section class="std-context-ribbon">
    <div class="std-context-main">
      <div class="std-context-line">
        <span class="std-context-eyebrow">GOVERNANCE</span>
        <h3 class="std-context-title">Governance Console</h3>
      </div>
      <p class="std-context-description">Review approvals, manage policies, and audit compliance.</p>
      <div class="std-context-metrics">
        <span class="std-context-chip"><span>Pending</span><strong>3</strong></span>
        <span class="std-context-chip is-warning"><span>Flagged</span><strong>1</strong></span>
      </div>
    </div>
  </section>
  
  <div class="std-main-column mhos-clean-stack">
    <!-- governance-specific content kept exactly the same -->
  </div>
  
  <aside class="std-right-rail mhos-clean-stack">
    <section class="std-detail-card mhos-clean-surface">
      <!-- selected approval detail -->
    </section>
    <section class="std-action-panel mhos-clean-surface">
      <!-- governance-specific actions -->
    </section>
    <section class="std-ai-panel mhos-clean-surface">
      <!-- AI governance assistant -->
    </section>
  </aside>
</div>
```

**Key:** Only wrapper classes change; page-specific content remains untouched.

---

## Adoption Rules

### Iron-Clad Preservation Requirements

#### ✅ No ID Changes
- All existing element IDs remain exactly as they are
- Example: `#taskCenterRefreshBtn` stays `#taskCenterRefreshBtn`
- Reason: Button event handlers target these IDs; changing them breaks interactivity

#### ✅ No Data Attribute Changes
- All `data-*` attributes remain unchanged
- Example: `data-ops-focus`, `data-ops-route`, `data-integration-action` — all preserved
- Reason: These drive navigation, filtering, and command routing

#### ✅ No Handler Changes
- All `onclick`, `addEventListener`, and event delegation remain unchanged
- Example: `button.onclick = () => { context.navigateTo("governance"); }` — unchanged
- Reason: Handlers depend on specific selectors and execution order

#### ✅ No API / Backend Changes
- All `fetchProjectX`, `saveProjectX`, `updateProjectX` calls remain unchanged
- No new API endpoints introduced
- No database schema changes
- Reason: Backend is stable; API contracts must not be broken

#### ✅ No Copy / Provenance Weakening
- All user-facing text (labels, descriptions, help text) remains unchanged
- No removal of brand voice or operational context
- Reason: Copy is tested and known to be clear and effective

#### ✅ No CSS Cleanup Yet
- Existing `.panel`, `.panel-header`, `.panel-kicker` remain in CSS (do not remove)
- New CSS uses `:where()` wrappers to avoid specificity conflicts
- Reason: Legacy code still uses these; cleanup happens post-launch

#### ✅ No Markup Restructuring
- HTML structure within page-specific content areas remains unchanged
- Only the outer wrapper and right-rail structure are added
- Example: Table rows, form fields, grid items — all stay exactly the same
- Reason: JS selectors and event delegation depend on existing structure

### Adoption Sequence Rule

**No all-pages-at-once patch.** Adoption must happen:
1. One page at a time
2. Each page audited independently (STEP 41C, 41D, 41E, etc.)
3. Each page tested in isolation
4. Each page committed separately
5. Rollback per-page if needed (don't block other pages)

### Testing & Validation Rule

Before a page is accepted as adopting the standard:
- ✅ All IDs and data attributes function correctly
- ✅ All handlers fire and route correctly
- ✅ All API calls execute and return expected data
- ✅ No console errors or warnings
- ✅ Copy/descriptions display correctly
- ✅ Responsive design (xs, sm, md, lg) works
- ✅ Performance metrics (load time, render time) acceptable
- ✅ AI panel prompts are curated and brand-aligned

---

## Page-by-Page Adoption Roadmap

### Phase 1: Configuration & Governance (Priority Tier 1)

#### Page 1: Governance Console
**STEP:** 41D (Future audit)  
**Rationale:** High visibility, clear approval queue, benefit from action/AI separation  
**Estimated Complexity:** Medium (policy toggles + approval cards → context ribbon + main column + right rail)  
**Current State:**
- ❌ No context ribbon
- ❌ No right rail
- ❌ Policy controls inline

**Target State:**
- ✅ Context ribbon (eyebrow: "GOVERNANCE", metrics: pending/flagged/escalated)
- ✅ Main column (policy section + approval queue)
- ✅ Right rail: Detail card (selected approval), Action panel (approve/reject/escalate), AI panel (review assist)

---

#### Page 2: Settings / Configuration Center
**STEP:** 41E (Future audit)  
**Rationale:** Form-heavy, long page; right-rail saves/help would improve UX  
**Estimated Complexity:** High (multiple form sections → context ribbon + form in main + right rail for save/help/AI)  
**Current State:**
- ❌ No context ribbon
- ❌ Form-driven layout, mixed inline controls
- ❌ No right rail

**Target State:**
- ✅ Context ribbon (eyebrow: "CONFIGURATION", metrics: sections complete/warnings)
- ✅ Main column (grouped form sections)
- ✅ Right rail: Save/validation status, Help/AI, Settings summary

---

### Phase 2: Integration & Asset Management (Priority Tier 2)

#### Page 3: Integrations / Platform Connection Center
**STEP:** 41F (Future audit)  
**Rationale:** Currently uses drawer modal; right-rail detail card would be cleaner  
**Estimated Complexity:** High (cards + drawer modal → context ribbon + main column + right rail detail/sync/diagnostics)  
**Current State:**
- ❌ No context ribbon
- ❌ Integration cards inline
- ❌ Drawer modal for details (not right-rail)
- ❌ No AI integration

**Target State:**
- ✅ Context ribbon (eyebrow: "INTEGRATIONS", metrics: connected/syncing/failed)
- ✅ Main column (grouped integration categories)
- ✅ Right rail: Detail card (selected integration config), Action panel (sync/test/disconnect), AI panel (diagnostics assist)

---

#### Page 4: Library / Smart Asset Library
**STEP:** 41G (Future audit)  
**Rationale:** Asset selection + right-rail detail would improve workflow  
**Estimated Complexity:** Medium (upload zone + grid → context ribbon + grid in main + right rail for asset detail/classification)  
**Current State:**
- ❌ No context ribbon
- ❌ Upload zone competes with content
- ❌ No right rail
- ❌ Limited action surface

**Target State:**
- ✅ Context ribbon (eyebrow: "ASSETS", metrics: total/uploaded/source-of-truth)
- ✅ Main column (asset grid/table with categories)
- ✅ Right rail: Asset detail, Classification/tagging actions, AI assist (classification, routing suggestions)

---

### Phase 3: Execution & Publishing (Priority Tier 3)

#### Page 5: Publishing / Execution & Scheduler Control Center
**STEP:** 41H (Future audit)  
**Rationale:** Schedule form inline + queue; right-rail actions would clarify UI  
**Estimated Complexity:** High (form + queue list → context ribbon + main column with schedule form/queue + right rail for detail/approval/actions)  
**Current State:**
- ❌ No context ribbon
- ❌ Form mixed with queue list
- ❌ Auto-mode UI separate (floating)
- ❌ Limited action surface

**Target State:**
- ✅ Context ribbon (eyebrow: "PUBLISHING", metrics: scheduled/ready/published/failed)
- ✅ Main column (schedule form or queue table based on context)
- ✅ Right rail: Job detail card, Approval/routing actions, AI assist (scheduling suggestions, retry logic)

---

#### Page 6: Campaign Studio / Campaign Command Center
**STEP:** 41I (Future audit)  
**Rationale:** Form-driven waves; structure + right rail would improve clarity  
**Estimated Complexity:** High (form sections → context ribbon + builder/form in main + right rail for preview/readiness/AI)  
**Current State:**
- ❌ No context ribbon
- ❌ Form-driven waves (inline sections)
- ❌ No right rail
- ❌ No readiness/blockers panel

**Target State:**
- ✅ Context ribbon (eyebrow: "CAMPAIGNS", metrics: waves/channels/coverage)
- ✅ Main column (wave builder, channel selection)
- ✅ Right rail: Campaign preview/summary, Readiness/blockers (missing assets, approvals pending), AI copilot (optimization suggestions)

---

### Phase 4: Remaining Pages (Standard Tier)

After Phase 1–3, apply standard to:
- Content Studio
- Media Studio
- Workflows
- AI Command (adapt for AI-first workflow)
- Home / Executive Command Center
- Ads Manager
- Insights
- Research

**Adoption Method:** Same audit-per-page approach (STEP 41J, 41K, etc.)

---

## Launch-Ready Page Criteria

Before any page can be considered launch-ready for final UI redesign, it must pass this acceptance checklist:

### ✅ Structural Adoption

- [ ] Page has `.std-page-shell` wrapper
- [ ] Page has `.std-context-ribbon` with:
  - [ ] `.std-context-eyebrow` (domain label, uppercase)
  - [ ] `.std-context-title` (page title)
  - [ ] `.std-context-description` (1–2 sentence purpose)
  - [ ] `.std-context-metrics` with 3–5 live metric chips
  - [ ] `.std-context-actions` with status badge + primary button
- [ ] Page has `.std-main-column` wrapper (page-specific content inside)
- [ ] Page has `.std-right-rail` with:
  - [ ] `.std-detail-card` (if page has selectable items)
  - [ ] `.std-action-panel` (if page has state-changing actions)
  - [ ] `.std-ai-panel` (optional, recommend on most pages)
- [ ] All panels use `.mhos-clean-surface` styling
- [ ] Page has opted-in to clean layer (`.mhos-clean-root` on outer wrapper)

### ✅ Preservation Compliance

- [ ] All existing element IDs unchanged (grep test confirms)
- [ ] All `data-*` attributes unchanged (grep test confirms)
- [ ] All event handlers firing correctly (functional test)
- [ ] All API calls executing and returning correct data (network test)
- [ ] All user-facing copy unchanged (copy audit)
- [ ] Existing markup structure within pages untouched (visual diff)

### ✅ Content & UX

- [ ] Context ribbon copy is accurate and authoritative
- [ ] Metrics are real-time and reflect current state
- [ ] Main column content is scannable and well-organized
- [ ] Detail card shows relevant item metadata
- [ ] Action panel clearly separates active vs. deferred actions
- [ ] AI panel has 3–5 curated, brand-aligned quick prompts
- [ ] All buttons are clickable and disabled states are clear

### ✅ Technical Quality

- [ ] No console errors or warnings
- [ ] No broken links or routes
- [ ] CSS specificity conflicts resolved (`:where()` usage validated)
- [ ] Responsive design tested at xs/sm/md/lg breakpoints
- [ ] Page load time within budget (< 2s for typical data)
- [ ] No performance regressions vs. baseline

### ✅ Accessibility & Copy

- [ ] All new elements have proper ARIA labels
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Color contrast meets WCAG AA (metrics chips, badges)
- [ ] Brand voice in copy remains consistent
- [ ] Error messages and help text are clear and actionable

### ✅ AI Panel (if present)

- [ ] AI open button navigates to AI Workspace with context
- [ ] Quick prompt buttons are relevant to page domain
- [ ] Prompt previews accurately describe the action
- [ ] No approval/publishing/mutation happens via AI panel (context-only handoff)
- [ ] Prompts have been reviewed for brand alignment

---

## Global vs. Page-Specific Boundaries

### ✅ Global Standards (All Pages Must Implement)

1. **Context Ribbon Header**
   - Structure: eyebrow, title, description, metrics, actions
   - CSS: `.std-context-*` classes (fully defined)
   - Content: Page-specific domain, title, metrics
   - Adoption: 100% on all launch-ready pages

2. **Main Column Wrapper**
   - Structure: `.std-main-column` container
   - CSS: Flex/grid layout with gap
   - Content: Page-specific (table, form, grid, builder, etc.)
   - Adoption: 100% on all pages

3. **Right-Rail Container**
   - Structure: `.std-right-rail` with stacked panels
   - CSS: Flex column, consistent sizing/spacing
   - Content: Detail card, action panel, AI panel (page-specific)
   - Adoption: Recommended on all pages with interactive content

4. **Clean Layer Adoption**
   - Root: `.mhos-clean-root` on outer wrapper
   - Shell: `.mhos-clean-shell` on main wrapper
   - Surfaces: `.mhos-clean-surface` on all panels
   - CSS: Defined in 15-clean-operating-layer.css (opt-in)
   - Adoption: 100% on all launch-ready pages

5. **Panel Header Structure**
   - Structure: `.panel-header` with kicker, title, description, badge
   - CSS: Existing pattern (legacy name, keep for now)
   - Content: Page-specific kicker label, title, description
   - Adoption: 100% on all panels

6. **Live Metric Chips**
   - Structure: `.std-context-chip` badges in ribbon and detail cards
   - CSS: Tone-aware styling (neutral, warning, danger)
   - Content: Real-time counts (page-specific metrics)
   - Adoption: 3–5 chips in context ribbon (100%), optional elsewhere

7. **Action/Deferred Safety Model**
   - Structure: Active buttons vs. disabled deferred buttons with explanations
   - CSS: `.std-action-row` and `.std-deferred-actions` containers
   - Content: Page-specific action labels and safety explanations
   - Adoption: Required where mutations exist

### 🎯 Page-Specific (Unique per Page)

1. **Main Column Content Layout**
   - What: Table vs. form vs. grid vs. builder
   - Who decides: Page team
   - Example: Governance = form sections + approval cards; Library = asset grid
   - Rule: Use standard containers (`.std-main-column`) but layout is page-specific

2. **Detail Card Content**
   - What: Selected item metadata (fields, linked entities, history)
   - Who decides: Page team
   - Example: Task detail has owner, due date, priority; Asset detail has type, size, source-of-truth status
   - Rule: Use `.std-detail-card mhos-clean-surface` wrapper; content rows are page-specific

3. **Action Panel Buttons**
   - What: Safe, non-destructive actions (refresh, sync, copy, route)
   - Who decides: Page team
   - Example: Governance = approve/reject/escalate; Library = classify/tag/route
   - Rule: Use `.std-action-panel mhos-clean-surface` wrapper; buttons are page-specific

4. **Deferred Actions**
   - What: Mutations with safety explanations (disabled pending safety pass)
   - Who decides: Page team
   - Example: Task = update status/priority (deferred); Governance = override decision (deferred)
   - Rule: Use `.std-deferred-actions` container; action logic is page-specific

5. **AI Panel Quick Prompts**
   - What: Domain-specific AI assistance prompts (3–5 buttons)
   - Who decides: Page team + AI/operations
   - Example: Governance = review-assist prompts; Publishing = scheduling-assist prompts
   - Rule: Use `.std-ai-panel mhos-clean-surface` wrapper; prompts are page-specific

6. **Focus/Filter Tabs**
   - What: Tab navigation and filter options
   - Who decides: Page team
   - Example: Tasks = focus on All/Open/Blocked/Overdue; Governance = focus on Pending/Approved/Rejected
   - Rule: Use `.std-focus-tabs` container (if needed); tab options are page-specific

7. **Metric Definitions**
   - What: Which metrics appear in context ribbon
   - Who decides: Page team
   - Example: Tasks = Total/Open/Blocked/Overdue/Due Soon; Governance = Pending/Flagged/Escalated
   - Rule: Use `.std-context-chip` styling; metric definitions are page-specific

8. **Page-Specific Utilities & Classes**
   - What: `.governance-*`, `.library-*`, `.publishing-*` etc.
   - Who decides: Page team
   - Rule: Keep all existing page-specific classes; don't touch them

---

## Preservation Rules (Enforcement)

### Rule 1: ID Preservation Test

**Before Adoption:**
```bash
grep -En "id=\"[a-zA-Z0-9-_]+\"" pages/{page}.js | sort > baseline-ids.txt
```

**After Adoption:**
```bash
grep -En "id=\"[a-zA-Z0-9-_]+\"" pages/{page}.js | sort > adopted-ids.txt
diff baseline-ids.txt adopted-ids.txt
# Should show NO differences (only class additions)
```

**Fail Condition:** Any ID added, removed, or renamed → Page adoption blocked

---

### Rule 2: Data Attribute Preservation Test

**Before Adoption:**
```bash
grep -En "data-[a-zA-Z0-9-_]+" pages/{page}.js | sort > baseline-attrs.txt
```

**After Adoption:**
```bash
grep -En "data-[a-zA-Z0-9-_]+" pages/{page}.js | sort > adopted-attrs.txt
diff baseline-attrs.txt adopted-attrs.txt
# Should show NO differences (only attribute values, if dynamic)
```

**Fail Condition:** Any data attribute changed → Page adoption blocked

---

### Rule 3: Handler Execution Test

**Before Adoption:** Functional test of all buttons/links/inputs
- Task: Verify all clicks route correctly
- Verify: All API calls fire with correct payloads
- Verify: All state updates reflect in UI

**After Adoption:** Same functional test
- Should pass with no changes
- If any handler fails → Page adoption blocked

---

### Rule 4: API Contract Validation

**Before Adoption:** Capture all API calls made by the page
```bash
# Example output:
# fetchProjectGovernance(projectName, { timeline_limit: 60 })
# updateProjectGovernancePolicy(projectName, payload)
```

**After Adoption:** Same API calls should be made with same signatures
- If API signature changes → Page adoption blocked
- If new API call added → Requires backend team review

---

### Rule 5: Copy Audit

**Before Adoption:** List all user-facing text in page
- Labels, descriptions, error messages, help text

**After Adoption:** Same copy should exist
- If copy is removed or significantly reworded → Page adoption blocked
- Minor punctuation changes OK

---

### Rule 6: CSS Conflict Test

**After Adoption:** Load page in browser with new CSS
```bash
# Check browser console for:
# - CSS specificity warnings
# - Computed style surprises (unexpected colors, sizing, etc.)
# - Layout shifts or unexpected wrapping
```

**Fail Condition:** 
- Any unexpected visual changes → Investigate CSS conflicts
- Resolve via `:where()` wrappers or specificity adjustments
- Page adoption blocked until resolved

---

## Risk Controls

### Risk 1: Structural Adoption Breaks Event Handlers

**Scenario:** Adding wrapper classes or restructuring layout breaks button click handlers or event delegation.

**Control:**
- Preserve all IDs and data attributes (Rule 1, 2)
- Test all handlers before/after adoption (Rule 3)
- Use `:where()` wrappers to avoid CSS specificity issues
- Page adoption blocked if any handler fails

**Rollback:** Remove adopted classes, revert to original markup

---

### Risk 2: CSS Conflicts Break Layout

**Scenario:** New `.std-*` CSS conflicts with existing `.panel` or page-specific classes, causing layout shifts.

**Control:**
- Use `:where()` in new CSS to minimize specificity
- Test responsive design at all breakpoints
- Use CSS conflict test before adoption (Rule 6)
- Page adoption blocked if any layout issues

**Rollback:** Disable new CSS file; revert layout

---

### Risk 3: Right-Rail Breaks Mobile UX

**Scenario:** Right rail becomes unusable on mobile/tablet screens; pages look broken.

**Control:**
- Define breakpoint strategy (right rail → drawer/collapse on < md)
- Test at xs, sm, md, lg breakpoints
- Set mobile performance budget
- Page adoption blocked if mobile breaks

**Rollback:** Remove right rail on mobile; use drawer pattern

---

### Risk 4: Performance Regression

**Scenario:** Adding right-rail panels, detail cards, AI panels increases page load time or render time.

**Control:**
- Measure baseline metrics (load time, render time, TTI)
- Measure adopted metrics
- Enforce budget: < +10% increase
- Page adoption blocked if performance regresses

**Rollback:** Defer right-rail panels to lazy-load or on-demand

---

### Risk 5: Adoption Sequence Breaks Dependencies

**Scenario:** Adopting Governance before Settings breaks Governance → Settings routing or shared state.

**Control:**
- Adopt pages in sequence (one at a time, not in parallel)
- Test page-to-page navigation before each adoption
- Each page tested in isolation first, then in workflow
- Page adoption blocked if dependencies break

**Rollback:** Revert page adoption; fix dependencies before re-adopting

---

### Risk 6: AI Panel Prompt Confusion

**Scenario:** AI panel quick prompts are poorly written, confusing users or triggering wrong AI actions.

**Control:**
- Curate prompts per page (3–5 prompts, domain-specific)
- Review prompts for brand alignment
- Test AI handoff (context-only, no approval/publishing)
- Page adoption blocked if prompts don't pass review

**Rollback:** Disable AI panel until prompts are curated

---

## Rollback Strategy

**Per-Page Rollback:**

If a page adoption introduces critical issues (handler failures, CSS conflicts, layout breaks, performance regressions), rollback is per-page and does NOT block other pages.

1. Identify issue in adopted page (e.g., Governance)
2. Revert that page's changes (remove adopted classes, wrapper divs)
3. Keep page in pre-standard state
4. Continue adoption of next page (Settings)
5. Return to Governance adoption after issue is resolved

**Staged Rollback:**

If multiple pages have been adopted and a systemic issue is found (e.g., new CSS causes global conflicts):

1. Disable new CSS file (14-page-standard.css or 15-clean-operating-layer.css)
2. Revert all adopted pages to original structure
3. Fix CSS issue
4. Re-adopt pages one by one

**Full Rollback (Worst Case):**

If the adoption plan is fundamentally flawed, rollback is:
1. Remove all adopted classes from all pages
2. Revert to pre-standard markup
3. Declare STEP 41B discovery process incomplete
4. Start a new planning phase (STEP 42B)

---

## Recommended STEP 41C

### Option 1: Global Shell Primitives CSS Plan

**Purpose:** Define and add all new CSS primitives (`.std-right-rail`, `.std-detail-card`, `.std-action-panel`, `.std-ai-panel`) to make them globally available.

**Deliverables:**
1. **New CSS File:** `public/control-center/styles/16-global-page-shell-primitives.css`
   - `.std-page-shell` — Main page container (rename from existing)
   - `.std-main-column` — Main content area
   - `.std-right-rail` — Right sidebar container
   - `.std-detail-card` — Detail panel wrapper
   - `.std-action-panel` — Action surface wrapper
   - `.std-ai-panel` — AI assistance surface wrapper
   - `.std-action-row` — Horizontal button row
   - `.std-deferred-actions` — Deferred mutation container
   - `.std-quick-actions` — Quick prompt buttons container
   - All using `:where()` wrappers, no specificity issues

2. **CSS Breakpoint Strategy** (responsive guidelines)
   - `.std-right-rail` on md+ (visible)
   - `.std-right-rail` on sm/xs (drawer/collapse)
   - Detail card triggers on sm/xs
   - Action panel stays visible (sticky)

3. **Documentation**
   - HTML structure for each primitive
   - CSS class combinations for common layouts
   - Responsive behavior per breakpoint

**Estimate:** 1–2 days to define and document

**Recommendation:** Do this STEP 41C if you want to start adoption immediately (STEP 41D onwards).

---

### Option 2: First Non-Operations Page Shell Audit

**Purpose:** Audit Governance page in detail before global CSS is added, understand exact adoption pattern, and identify any issues early.

**Deliverables:**
1. **Governance Page Audit (STEP 41C)**
   - Inspect current Governance markup and styles
   - Identify all IDs, data attributes, handlers
   - Define target structure (context ribbon + main + right rail)
   - Identify any conflicts or risks
   - Create adoption checklist for Governance only

2. **Proof-of-Concept Markup** (do NOT commit)
   - Show how Governance markup would change
   - Identify new CSS needed
   - Identify potential breakpoints

3. **Risk Assessment**
   - What could break in Governance adoption?
   - What new CSS is truly needed?
   - What handler changes are required (if any)?

**Estimate:** 1–2 days to audit and create PoC

**Recommendation:** Do this STEP 41C if you want to validate the adoption plan before committing to global CSS changes.

---

### Recommendation

**Choose Option 1 (Global Shell Primitives CSS Plan) if:**
- You're confident the plan is sound
- You want to start adoption immediately
- You're ready to define all CSS upfront

**Choose Option 2 (Governance Audit PoC) if:**
- You want to validate the plan with a real page
- You want to identify conflicts/risks early
- You prefer iterative discovery

**Suggested Path:** Option 1 + Option 2 in parallel
- STEP 41C: Global CSS primitives plan + Governance audit
- STEP 41D: Governance adoption with real markup changes
- STEP 41E+: Remaining pages

---

## Explicit No-Code-Change Statement

**This plan is documentation-only.**

✋ **The following have NOT been changed:**
- ❌ No production JavaScript files modified
- ❌ No CSS files edited
- ❌ No backend code touched
- ❌ No markup restructured
- ❌ No IDs or data attributes altered
- ❌ No handlers removed or changed
- ❌ No API calls modified
- ❌ No copy text changed

**This plan:**
- ✅ Defines the final page shell/header standard (structure)
- ✅ Specifies global primitives (CSS classes to be added)
- ✅ Recommends naming strategy (unification roadmap)
- ✅ Provides adoption rules (preservation guarantees)
- ✅ Sequences page-by-page rollout (6-phase plan)
- ✅ Defines launch-ready criteria (acceptance checklist)
- ✅ Establishes preservation rules (enforcement tests)
- ✅ Identifies risks and rollback strategies
- ✅ Recommends STEP 41C (next planning step)

**Next Action:**
STEP 41C will either:
- Define and add global CSS primitives (Option 1), OR
- Audit Governance page with PoC markup (Option 2)

Only after STEP 41C will implementation begin (STEP 41D onwards).

---

**Plan Complete**  
**No production code changes made.**  
**Ready for STEP 41C — Global CSS Primitives Plan OR Governance Audit**


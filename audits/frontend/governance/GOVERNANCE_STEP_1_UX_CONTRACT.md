# Governance Step 1 - UX Contract and Legacy Structure Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Phase: Governance Step 1
Scope: Documentation-only contract (no runtime JS, CSS, backend, or data changes)

## 1. Executive Summary

This contract documents the current Governance page operating surface and establishes the target UX layout before any runtime cleanup or consolidation. Governance is currently excluded from page-standard.js REQUIRED_ROUTES and maintains a local numbered section model. This audit defines the new page-standard zones that will own governance layout in Step 2, establishing authority boundaries before structural changes.

Core outcome:

- Governance must migrate from local numbered sections to standard page-standard zones.
- New zones: Page Header, System Signal Bar, Main View, Right Rail, Action Panel, AI Panel.
- Current API, backend contracts, and behavior remain preserved.
- No mutations or new API calls are introduced.

This step performs no code changes. It is an evidence and authority boundary audit only.

## 2. Current Governance Runtime Structure

### 2.1 Module Overview

File: public/control-center/pages/governance.js

- Page route: governance
- Session storage: governanceSessions Map (in-memory per project)
- Load order in app.js: Not in page-standard.js REQUIRED_ROUTES, rendered independently.
- Layout template: governance-shell + governance-workspace div.

### 2.2 Current Session Model

Session object per project:

```javascript
{
  loaded: false,        // Data fetch completed
  loading: false,       // Fetch in-progress
  error: "",            // Error message if fetch failed
  summary: null,        // Fetched governance summary data
  focus: "all",         // Queue filter: all|approvals|claims|brand|publish|escalations
  selectedKey: ""       // Selected item key from visible queue
}
```

### 2.3 Current Data API Contract

Fetch on load:

- `fetchProjectGovernance(projectName, { timeline_limit: 60 })` returns summary object.

Mutations on action:

- `decideProjectApproval(projectName, approvalId, { decision, note, actor, escalate_to })` - approve/reject decisions.
- `createProjectApproval(...)` - request new approvals (inherited import, not used in this view).
- `updateProjectGovernancePolicy(...)` - save policy (referenced but not shown in audit scope).

## 3. Current Old Numbered Sections Inventory

### 3.1 Section 0: Review Model

Location in renderPage: lines 153-178 (renderReviewOwnership function)

Content:
- Ownership cards mapping (content owner, media owner, campaign owner, etc.)
- Escalation chain (low/medium/high → roles)

Rendering: renderReviewOwnership(summary, escapeHtml) function

Data source: summary.review_model.ownership, summary.review_model.escalation_chain

### 3.2 Section 1: Governance Overview

Location in renderPage: lines 552-578 (main section header + overview grid + activity list)

Content:
- 6 metrics (Approval Queue, Policy Violations, Claim Review, Brand Safety, Publish Guardrails, Escalations)
- Recent activity timeline (4 most recent audit_timeline items)

Rendering: renderMetric(...) for each metric, inline activity list

Data source: summary.sections (approval_queue, policy_violations, claim_review, brand_safety_review, publish_guardrails, escalation_queue), summary.sections.audit_timeline

### 3.3 Section 2: Policy / Rule Summary

Location in renderPage: lines 581-625 (panel with grid layout)

Content:
- Active rules (policy_rules entries)
- Approval owners (approval_owners entries)
- Editable policy controls (renderPolicyControls function)
- Open policy signal (policy_violations flags + settings_bridge status)

Rendering: renderPolicyControls(...) for form controls, inline governance-rule-list

Data source: summary.policy.policy_rules, summary.policy.approval_owners, summary.sections.policy_violations, summary.policy.settings_bridge

### 3.4 Section 3: Approval / Decision Queue

Location in renderPage: lines 626-666 (main section, tabs + table)

Content:
- Focus tabs (all, approvals, claims, brand, publish, escalations)
- Items table (entity, title, status, risk, owner, created)
- Row selection binds selectedKey to session

Rendering: buildDecisionQueue(summary) helper, focus tabs generated from focusCounts, table generation inline

Data source: summary (via buildDecisionQueue), session.focus filter, session.selectedKey

### 3.5 Section 4: Selected Decision Details

Location in renderPage: lines 686-755 (right rail panel in two-column grid)

Content:
- If selectedItem:
  - Item metadata (type, risk, owner, status, entity, created)
  - Policy flags list
  - Linked approval link
  - Decision history (4 most recent)
- If no selection: "No governance item is selected."

Rendering: renderFlagList(...) for flags, conditional badges/metadata

Data source: selectedItem (from visibleQueue based on session.selectedKey)

### 3.6 Section 5: Governance Actions

Location in renderPage: lines 756-820 (right rail panel in two-column grid)

Content:
- Decision note textarea (governanceDecisionNote id)
- Action buttons:
  - Refresh
  - Save Governance Policy
  - Sync Settings Rules (conditional)
  - If selectedItem.queue_kind === "approval": Approve, Reject, Request Changes, Escalate, Override buttons
  - If selectedItem has no linked_approval: Request Approval button

Rendering: renderApprovalCard(...) function used in earlier sections, inline button generation

Data source: selectedItem (for conditional button visibility)

### 3.7 Section 6: Governance AI Assistant

Location in renderPage: lines 830-847 (right rail panel)

Content:
- "Open AI Workspace" button (data-governance-open-ai)
- Quick action prompts list (buildGovernancePrompts helper)
- Each prompt renders as quick-action-btn with label and preview

Rendering: prompts.map(...) loop generation

Data source: buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus))

## 4. Current Loading/Empty/Error/Rerender Paths

### 4.1 Initial Load Trigger

Function: renderGovernance() in route definition (lines 1005-1030)

On route activation:
1. renderCurrentPage() is called for governance route.
2. routeDef.render calls renderGovernance(...).
3. Attaches to root.innerHTML = renderPage(projectName, session, context.escapeHtml).
4. Calls bindGovernance(...) to attach event listeners.

### 4.2 Data Load Trigger

In bindGovernance, when route is active:
- If !session.loaded, call loadGovernance(projectName, session, rerender).
- loadGovernance sets session.loading = true, fetches data, then rerender().

### 4.3 Rerender Path

rerender = () => {
  root.innerHTML = renderPage(...);  // full re-render
  bindGovernance(...);               // re-attach listeners
}

Called after:
- Initial load completes
- Any focus tab clicked
- Any decision/action completes
- Refresh button clicked

### 4.4 Error State

If loadGovernance fails:
- session.error is set to error message.
- rerender() is called.
- renderPage checks session.error and renders error state.
- Error message is displayed in empty-box.

### 4.5 Loading State

While fetchProjectGovernance is pending:
- session.loading = true
- rerender() is called immediately
- renderPage checks session.loading && !session.loaded and renders loading state
- Later, when fetch completes, rerender() is called again with loaded data

### 4.6 Empty State

If no projectName is provided:
- renderPage returns empty-box: "Select a project to review..."

If visibleQueue is empty:
- Queue section renders with count 0, table may be empty

## 5. Current API Usage and Behavior That Must Be Preserved

### 5.1 Fetch Operations

- `fetchProjectGovernance(projectName, { timeline_limit: 60 })` must continue to work.
- Response structure with summary.sections, summary.policy, summary.review_model must be preserved.
- Network errors must continue to set session.error.

### 5.2 Decision Mutations

- `decideProjectApproval(projectName, approvalId, { decision, note, actor, escalate_to })` call must be preserved.
- decision values: "approved", "rejected", "changes_requested", "escalated", "overridden"
- actor will be set to "governance-console"
- escalate_to will be derived from escalation_chain

### 5.3 Refresh Behavior

- refreshGovernance(projectName, session, rerender, showError) must work.
- If error, showError is called with session.error message.

### 5.4 Session State Preservation

- focusedChange (session.focus filter) must persist across renders.
- selectedKey (selected queue item) must persist across renders.
- Decision note textarea content is re-bound but not persisted between refreshes.

### 5.5 Governance Decision Actions

- Approve/Reject/Escalate/Override buttons must call decideProjectApproval.
- Decision note textarea is read and included in call.
- Success message and refresh is expected after each decision.

## 6. Current Actions and Mutation/Status Behavior Classification

### 6.1 Status Retrieval (No Mutation)

- Fetch governance summary on load
- Read session.focus and session.selectedKey
- Render focus tabs with queue item counts
- Render policy rules and owners (read-only display)
- Render activity timeline (read-only display)
- Filter queue by focus value

Classification: **Read-only operations**

### 6.2 UI State Changes (No Mutation)

- Click focus tab → update session.focus → rerender with new filtered queue
- Click queue table row → update session.selectedKey → rerender with new selection

Classification: **In-memory state changes, no backend mutation**

### 6.3 Governance Mutations (Backend Changes)

- Click "Approve/Reject/Escalate/Override" → decideProjectApproval(...) → backend approval status updated
- Click "Save Governance Policy" → updateProjectGovernancePolicy(...) → backend policy rules updated
- Click "Sync Settings Rules" → sync settings into governance policy → backend update
- Click "Request Approval" → createProjectApproval(...) → new approval created in backend

Classification: **Real backend mutations via explicit action buttons**

### 6.4 Navigation Actions

- Click "Open AI Workspace" → navigateTo("ai-command")
- Click "Quick Action" prompts → fill AI Workspace prompt input → navigateTo("ai-command")

Classification: **Route navigation, no governance mutation**

### 6.5 Refresh Actions

- Click "Refresh" button → refreshGovernance(...) → fetch latest summary → rerender

Classification: **Data refresh, no new mutation**

## 7. Target Governance Operating Surface (page-standard Zones)

### 7.1 Page Header Zone

Current source: Section 1 header (Governance workspace for ${projectName})

Target content:
- Project name
- "Governance workspace" eyebrow/kicker
- Brief subtitle about reviewing approvals and policy

Zone mapping:
- std-context-ribbon will hold this
- std-context-title = project name
- std-context-description = governance focus summary

### 7.2 System Signal Bar Zone

Current source: Section 1 metrics grid (Approval Queue, Policy Violations, etc)

Target content:
- 6 metrics rendered as chips/signals
- Live counts updated on refresh

Zone mapping:
- std-context-actions or new std-smart-strip component
- Each metric becomes a displayed chip with value + label

### 7.3 Main View Zone (Left Column)

Current source: Sections 2 + 3 + policy detail content

Target content:
- Policy / Rule Summary section (policy rules, approval owners, policy controls)
- Approval / Decision Queue section (focus tabs + queue table)
- Selected queue item detail when not in two-column layout

Zone mapping:
- std-main-content-slot will hold this content
- Multiple panels arranged vertically
- Flows naturally in responsive design

### 7.4 Right Rail Zone

Current source: Sections 4 + 5 (Selected Decision Details + Governance Actions)

Target content:
- Selected item metadata and flags
- Decision note textarea
- Approve/Reject/etc buttons

Zone mapping:
- std-main-right or new right-rail component
- Panel-based layout
- Collapses to main view on mobile

### 7.5 Action Panel Zone

Current source: Section 5 (Governance Actions buttons)

Target content:
- Primary action buttons (Approve, Reject, Request Approval, Sync Settings, etc)
- Refresh button
- Save Policy button

Zone mapping:
- std-action-panel zone (future std-* primitive to be defined)
- Button grouping with primary/secondary styling
- Sticky or fixed positioning if needed

### 7.6 AI Panel Zone

Current source: Section 6 (Governance AI Assistant)

Target content:
- "Open AI Workspace" button
- Quick action prompts with label/preview

Zone mapping:
- std-ai-panel zone (future std-* primitive to be defined)
- Panel header + prompt buttons
- Navigates to ai-command route on button click

## 8. Mapping From Old Sections to New Zones

| Old Section # | Old Section Name | New Zone | New Zone Type | Content Preserved | Rendering Change |
|---|---|---|---|---|---|
| 0 | Review Model | System Signal Bar (review owners) | Signal display | Ownership chain links | Move into context ribbon or toolbar |
| 1 | Governance Overview | Page Header (title) + System Signal (metrics) | Header + Signal bar | Project name + 6 metrics | Split into ribbon + chip display |
| 2 | Policy / Rule Summary | Main View | Panel section | Policy rules, approval owners, controls | Keep as main panel, add to main content slot |
| 3 | Approval / Decision Queue | Main View | Panel section | Queue tabs, table, focus filtering | Keep as main panel, add to main content slot |
| 4 | Selected Decision Details | Right Rail | Side panel | Metadata, flags, history | Keep as right rail panel |
| 5 | Governance Actions | Action Panel + Right Rail | Action panel + buttons | Buttons, textarea note | Keep buttons in action panel, textarea in rail |
| 6 | Governance AI Assistant | AI Panel | AI zone | Quick prompts, Open AI button | Keep as dedicated AI panel |

## 9. Loading/Initial Render Contract

### 9.1 Initial State (No Project Selected)

- Page renders with empty state message.
- No data fetch triggered.
- Governance zones display welcome/empty state.

### 9.2 On Project Selection

- loadGovernance() is triggered.
- session.loading = true, display loading indicator.
- Fetch summary data.
- On success, rerender with full populated layout.
- On error, display error message in main zone.

### 9.3 Populated State

- All zones display with data.
- Focus filter defaults to "all".
- No item selected initially.
- Quick refresh button available.

### 9.4 After Refresh

- session.loading = true temporarily.
- Summary is re-fetched.
- selected queue item status updated if still in queue.
- Zones re-render with new data.

### 9.5 After Decision Action

- decideProjectApproval() is called.
- Success message shown.
- refreshGovernance() is called automatically.
- Queue is re-fetched, selected item updated or cleared if removed from queue.

## 10. Safety Rules (Non-Negotiable Constraints)

### 10.1 Backend/API Constraints

- No new backend endpoints.
- No API contract changes for fetchProjectGovernance, decideProjectApproval, etc.
- No new mutations beyond existing approve/reject/escalate/override/sync operations.
- Existing error handling and retry logic preserved.

### 10.2 Data/Project Constraints

- No data/projects modifications.
- Governance page must not change project data state.
- Session state is in-memory only, not persisted to backend.

### 10.3 Route/Navigation Constraints

- Governance remains its own route, not folded into another page.
- Navigation to "ai-command" from governance must work.
- Refresh navigation within governance page is allowed.

### 10.4 Rendering Constraints

- No changes to rerender flow or binding logic.
- Session load/loading/error states must function as before.
- Decision action flow must continue to work.

### 10.5 CSS Constraints

- No new CSS selectors beyond page-standard zones.
- No new styled component layer.
- Governance uses existing panel, button, grid, and card styles.

## 11. Step 2 Layout-Only Patch Plan (Deferred)

Step 2A will involve:

1. Update renderPage to output std-page-shell wrapper.
2. Restructure sections into std-context-ribbon (header), std-main-content-slot (main view), std-main-right (right rail).
3. Move Section 0 metadata into std-context-actions toolbar.
4. Move Section 6 AI prompts into std-ai-panel zone.
5. Move Section 5 action buttons into std-action-panel zone.
6. Keep session load/error/rerender flow unchanged.
7. Preserve all data fetch and mutation behavior.
8. Validate no visual regression on all governance actions.

Step 2B will involve:

1. Update CSS for governance-specific styling within new zones.
2. Ensure responsive behavior on mobile (right rail → main view).
3. Test focus tab filtering in new layout.
4. Test queue selection in new layout.

Step 2C will involve:

1. Consider if governance should be added to page-standard.js REQUIRED_ROUTES after new layout is stable.
2. Or keep governance as standalone with its own zone mapping.

## 12. Do-Not-Touch List

- Do not modify runtime JS in governance.js (this step is documentation only).
- Do not modify governance.js API calls or data fetch behavior.
- Do not modify backend governance endpoints.
- Do not modify data/projects.
- Do not change governance route or route registration.
- Do not create new mutations or API calls.
- Do not refactor Governance session model.
- Do not modify CSS selectors in this step.
- Do not delete governance.js or related files.
- Do not modify app.js routing behavior for governance.
- Do not modify Settings runtime in this step.

## 13. Validation Plan

Validation for future cleanup steps will include:

1. **Static validation:**
   - node --check public/control-center/pages/governance.js
   - grep for all data-governance-* selectors present
   - grep for all zone references in Step 2 patch

2. **Behavior validation:**
   - Load governance page without project → empty state works
   - Select project → data loads → metrics display
   - Click focus tab → queue filters correctly
   - Click queue row → item selects and displays in right rail
   - Click Approve/Reject → decision mutation works → refresh happens
   - Click Refresh button → data re-fetches → state updates
   - Click Open AI Workspace → navigation to ai-command works
   - No data/projects changes detected

3. **Layout validation:**
   - Page header zone displays project name and summary
   - System signal zone displays 6 metrics
   - Main view zone displays policies and queue
   - Right rail zone displays selected item details
   - Action panel zone displays action buttons
   - AI panel zone displays AI prompts
   - Mobile responsive: all zones flow vertically

4. **Error handling validation:**
   - Network error on fetch → error message displays in main zone
   - Mutation error on decision → error message shown, no state change
   - Missing project name → empty state displayed

## 14. No-Change Confirmation

This Governance Step 1 artifact is documentation-only.

Confirmed for this step:

- No runtime JS modified in governance.js.
- No runtime JS modified in app.js, router.js, page-standard.js.
- No CSS modified.
- No backend modified.
- No data/projects modified.
- No route registration changes.
- No API contract changes.
- No new mutations or API calls.
- No governance session model refactor.
- No Settings runtime touched.
- Governance behavior remains unchanged.
- All data fetch and decision flow unchanged.

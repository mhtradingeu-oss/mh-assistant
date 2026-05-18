# Phase 4A Smart Tool Drawer UX & CSS Scan

## 1. Current drawer structure

- **Markup:** The drawer is rendered by `renderSmartToolDrawerShell()` in tool-dock.js. It includes:
  - Header (tool label, icon, badge)
  - Description (tool template/summary)
  - Output type select (dropdown)
  - Source type select (dropdown)
  - Destination select (dropdown)
  - Hidden chips row (renderDrawerChips, currently hidden by CSS)
  - Language and tone fields (optional, shown for writer tools)
  - Source details (textarea/input)
  - Extra brief (textarea/input)
  - Safety card (shows safetyLevel, e.g., review_only, confirmation_required)
  - Setup summary (summarizes current drawer selections)
  - Note (optional, e.g., safety or context note)
  - Actions (footer): Use in Composer (primary), Open Library (secondary), Cancel

## 2. Current drawer behavior

- `openToolDrawer()` populates all fields from the clicked tool's metadata (from button data attributes).
- `updateDrawerPromptSummary()` updates the setup summary as fields change.
- "Use in Composer" builds the prompt and writes it to the composer, then closes the drawer.
- "Open Library" navigates to Library, does not preserve selection/context yet.
- Safety labels (review_only, confirmation_required, etc.) are shown in the safety card and affect drawer state.
- Metadata normalization (Phase 3B) now provides full output/source/destination lists for all specialists, so dropdowns are more complete but can be long.

## 3. CSS inventory

### 08-components-foundation.css
- `.mhos-tool-drawer`, `.mhos-tool-drawer[hidden]`, `.mhos-tool-drawer.is-open`, `.mhos-tool-drawer-backdrop`, `.mhos-tool-drawer-card`, `.mhos-tool-drawer-head`, `.mhos-tool-drawer-title-block`, `.mhos-tool-drawer-actions`, `.mhos-tool-drawer-icon`, `.mhos-tool-drawer-kicker`, `.mhos-tool-drawer-description`, `.mhos-tool-drawer-grid`, `.mhos-tool-drawer-section`, `.mhos-tool-drawer-section-label`, `.mhos-tool-drawer-chips`, `.mhos-tool-drawer-chip`, `.mhos-tool-drawer-chip.is-muted`, `.mhos-tool-drawer-safety`, `.mhos-tool-drawer-note`, `.mhos-tool-drawer-actions`, `.mhos-tool-drawer-close`
- `.mhos-tool-dock`, `.mhos-tool-dock-head`, `.mhos-tool-dock-kicker`, `.mhos-tool-dock-copy`, `.mhos-tool-dock-list`, `.mhos-tool-dock-item`, `.mhos-tool-dock-icon`, `.mhos-tool-dock-label`, `.mhos-tool-dock-badge`
- Footer/action classes: `.mhos-action-panel`, `.mhos-action-panel-actions`, `.mhos-destination-actions`, `.quick-action-btn`, `.std-action-btn`
- Patch/override blocks: duplicate `.mhos-tool-drawer*` and `.mhos-tool-dock*` blocks appear at the end of the file (lines 841+, 983+, 986+, 990+, 999+, 1003+, 1010+, 1036+, 1044+, 1049+, 1060+, 1062+, 1074+, 1079+, 1089+, 1096+, 1101+, 1110+, 1118+, 1124+, 1125+, 1135+, 1140+, 1151+, 1158+, 1163+, 1173+, 1177+, 1187+, 1197+, 1202+, 1209+)
- Responsive and safe-area CSS is present for the drawer and footer.
- Hidden chip CSS: `.mhos-tool-drawer-chips` is present but visually hidden.
- Some local preview CSS blocks are present but may be unused.

### 12-pages.css
- No `.mhos-tool-drawer*` or `.mhos-tool-dock*` blocks found.
- Action/footer classes: `.aicmd-v2-action-row`, `.aicmd-v2-preview-actions`, `.aicmd-v2-chat-actions`, `.aicmd-v2-header-actions`, `.aicmd-v2-quick-actions`, `.content-action-row`, `.content-agent-actions`, `.library-action-toolbar`, `.setup-template-actions`, `.setup-smart-handoff-actions`, `.setup-action-group`, `.wfloop-hero-actions`, `.wfloop-safe-actions`, `.settings-actions`, `.settings-actions-buttons`, etc.
- Some action/footer classes are duplicated or patched for different pages.
- Drawer-specific styles are mostly in 08-components-foundation.css, but some action/footer overlap exists.

## 4. UX issues observed or likely

- Dropdowns default to "Choose..." and may feel empty if metadata is missing or not auto-selected.
- Hidden chips row still exists in markup and JS, but is visually hidden.
- Source selection is not yet real (no Library Bridge); only a dropdown, not a true source picker.
- Setup Summary is present but could be clearer or more compact.
- Drawer action/footer may collide with floating assistant bubble on small screens.
- Long output/source/destination lists can make selects unwieldy; compact or grouped presentation may be needed later.
- Selected Library source card is not yet present (planned for Phase 5).

## 5. Cleanup recommendations

- Remove hidden chip markup and `renderDrawerChips` usage if safe.
- Remove unused local preview CSS blocks if present.
- Consolidate duplicate drawer CSS blocks in 08-components-foundation.css.
- Improve setup summary wording for clarity and compactness.
- Optionally auto-select the first output/source/destination where safe, or keep "Choose..." with clearer UX.
- Add a selected source placeholder/card (static UI only, no Library Bridge logic yet).
- Improve drawer footer spacing and safe-area handling.
- Keep Open Library as navigation-only.
- Keep Use in Composer as the primary action.
- Do not add backend, route, or save logic.

## 6. Files to change in Phase 4B

- `public/control-center/pages/ai-command/tool-dock.js`
- `public/control-center/styles/08-components-foundation.css`

Avoid:
- ai-command.js unless a blocker is found
- library.js
- shared-context.js
- data/projects/*
- backend/API

## 7. Risk and rollback plan

- Risks: accidental removal of chip logic that is still referenced, breaking drawer layout, footer overlap on mobile, removing CSS used by other components.
- Validation: browser QA, check all drawer actions, verify selects and summary, check footer on all screen sizes, run node --check, git status, and visual diff.
- Do not commit if any drawer field or action is broken, or if chip logic is still referenced elsewhere.

## 8. Recommended Phase 4B patch plan

A. Remove/disable hidden chips cleanly
B. Remove unused local preview CSS
C. Consolidate drawer CSS in place
D. Add selected source placeholder/card only as static UI
E. Polish footer spacing and summary
F. Validate and browser QA

---

**Validation:**
- git status --short
- wc -l audits/frontend/ai-team-tools/PHASE_4A_DRAWER_UX_CSS_SCAN.md
- grep -n "Current drawer structure\|Current drawer behavior\|CSS inventory\|UX issues\|Cleanup recommendations\|Files to change\|Risk and rollback\|Recommended Phase 4B" audits/frontend/ai-team-tools/PHASE_4A_DRAWER_UX_CSS_SCAN.md | sed -n '1,220p'

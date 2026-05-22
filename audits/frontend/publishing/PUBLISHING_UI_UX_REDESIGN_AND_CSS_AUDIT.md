# Publishing UI/UX Redesign and CSS Audit

## Executive Verdict
Publishing is now safe and authority-gated, but the user experience remains visually dense and traffic-heavy. The current layout, while functionally robust, overwhelms users with too many cards, banners, and repeated controls. A medium-sized UI/UX and CSS consolidation patch is recommended before moving to Governance. The goal: make Publishing premium, simple, and launch-ready—without new features or backend changes.

## Current State After d79d098
- Safety/authority banner and governance hints are present (per PUBLISHING_MINOR_READINESS_PATCH.md).
- All high-risk actions are confirmation-gated and backend-controlled.
- Visual traffic is high: multiple cards, banners, and action rows compete for attention.
- Queue, readiness, blockers, and schedule are repeated in several places.
- Auto Mode and workflow handoff panels add to right-rail overload.

## First-Screen Clarity
- The safety/authority banner is clear but adds to visual traffic.
- The page purpose is stated, but the first screen is crowded: overview, recommendation, queue, and readiness all appear at once.
- Current publishing state and next safe action are visible, but not prioritized.
- Readiness, queue, and approval state are visible, but not visually separated from less critical info.

## Remaining Visual Traffic
- Too many cards and banners above the fold.
- Repeated warnings and action rows (queue, recommendation, builder, manual controls).
- Queue, approval, schedule, and blockers are surfaced in multiple places (main, right rail, banners).
- Auto Mode and workflow handoff are visually prominent, not collapsed by default.
- Blockers/readiness are repeated in both main and right rail.
- Package preview is low in the hierarchy and too technical for most users.

## Recommended Page Architecture
**Header + Main View + Action Panel + AI Panel**

### A. Publishing Command Header
- Page purpose, project/campaign/channel, current package status, approval status, next best action, and safe actions.
- Only one safety/authority banner, merged with the header.

### B. Publishing Workflow Strip
- Visual stepper: Draft → Source → Package → Approval → Schedule → Execution Handoff.
- Compact, horizontally scrollable on mobile.

### C. Compact Readiness Summary
- Chips/cards for: Source, Copy, Media, Channel, Schedule, Governance, Approval.
- Only one blockers/warnings area, not repeated.

### D. Main Workbench
- Focused: package preview, selected queue item, schedule details, channel checklist.
- Collapse/merge redundant cards (e.g., builder + queue item details).

### E. Right Rail
- Only: governance/approval gate, source/provenance, blockers, operations handoff, AI review context.
- Auto Mode and workflow handoff collapsed by default.

## Proposed Above-the-Fold Layout
- [Header] Publishing Command Header (purpose, status, next action, safety/authority)
- [Workflow Strip] Visual stepper (Draft → ... → Execution Handoff)
- [Readiness Summary] Compact chips/cards (all readiness in one place)
- [Main Workbench] Selected queue item, package preview, schedule
- [Right Rail] Governance/approval, blockers, handoff, AI, collapsed Auto Mode

## Proposed Main Workbench
- Selected queue item details (title, channel, schedule, status)
- Package preview (higher, less technical by default)
- Schedule/calendar (inline, not separate card)
- Channel checklist (compact, not repeated)

## Proposed Right Rail
- Governance/approval gate (single, clear panel)
- Source/provenance summary
- Blockers (only if present, not repeated)
- Operations handoff
- AI review context (collapsed by default)
- Auto Mode (collapsed, labeled as "Automation Preview")

## Section-by-Section Treatment
- **Overview/Header:** Merge with safety/authority banner; keep top.
- **Safety/Authority Banner:** Merge into header; do not repeat.
- **Recommendation/Next Action:** Keep, but merge with header as a single "Next Best Action" chip.
- **Queue:** Move to main workbench; show only selected item details by default.
- **Package Preview:** Move higher; simplify for non-technical users.
- **Blockers:** Show only once, in readiness summary or right rail.
- **Asset Gate:** Merge with readiness summary; do not repeat.
- **Schedule/Calendar:** Inline in main workbench; not a separate card.
- **Workflow Handoff:** Move to right rail; collapsed by default.
- **Execution/Log/Status:** Right rail, collapsed unless failed.
- **Auto Mode:** Right rail, collapsed by default, labeled "Automation Preview".
- **Governance/Approval Controls:** Right rail, always visible if needed.
- **AI Context Banner:** Right rail, collapsed by default.

## Safety Language Recommendations
- "Prepare Publishing Package" (for draft/build)
- "Mark Ready for Review" (for approval)
- "Request Approval Review" (for governance)
- "Prepare Governance Review" (for governance handoff)
- "Queue for Manual Publishing" (for schedule)
- "Confirmation Required" (for all high-risk actions)
- "Execution Handoff Prepared" (for final step)
- Avoid "Publish now" or "Send now" in user-facing copy

## CSS Duplication and Cleanup Findings
- Many publishing-specific selectors in 12-pages.css duplicate component/foundation styles in 08-components-foundation.css.
- Banner/card/action-row styles are repeated; consider merging into shared primitives.
- The new `publishing-safety-banner` should become part of a shared alert/banner system.
- Inline styles (e.g., `style="margin-top:8px;"`) should be replaced with utility classes or shared CSS.
- Readiness chips, workflow strip, and queue rows can use global primitives.
- Do not touch legacy or unrelated CSS.

### CSS Cleanup Plan
- Consolidate banners, cards, and action rows into shared primitives.
- Move `publishing-safety-banner` to a global alert/banner system.
- Replace inline styles with utility classes.
- Leave legacy and unrelated CSS untouched.
- Next patch can be mixed JS/CSS, but focus on CSS consolidation first.

## Auto Mode UX Assessment
- Auto Mode is visually too prominent and confusing for most users.
- Collapse by default; label as "Automation Preview".
- Add clear copy: "Automation cannot publish without manual review and approval gates."
- Move lower or to right rail.

## Governance and Approval UX
- Approval and governance gates are present but visually lost in traffic.
- User may not understand why approval is needed or what Governance Review does.
- Make governance/approval a single, always-visible panel in the right rail.
- Add helper copy: "Publishing is always confirmation-gated and backend-controlled."
- Show blockers only when present, not always.

## Operations Integration UX
- Queue center, job monitor, notifications, and execution logs are present but not visually prioritized.
- User may not understand what happens after package is prepared.
- Add a clear "Execution Handoff Prepared" state and summary in the right rail.

## Mobile and Responsive Risks
- Right rail stacks below main, causing long scrolls.
- Too many banners and cards stack vertically.
- Queue/action rows may overflow or wrap awkwardly.
- Table/card overflow risk for readiness and queue.
- Sticky/top content height may push main content too low.
- Solution: collapse non-critical panels by default, use compact chips, and ensure workflow strip is horizontally scrollable.

## Technical Debt Findings
- Some unused helpers and repeated render logic in publishing.js.
- Inline style attributes and repeated action handlers.
- Stale Auto Mode code can be further modularized.
- Repeated IDs risk in queue/action rows.
- Large render blocks make future refactor harder; modularize sections.

## Recommended Next Patch
- Medium-sized UI/UX and CSS consolidation patch.
- Focus: reduce visual traffic, merge redundant cards, consolidate banners, and move to shared CSS primitives.
- Collapse non-critical panels by default.
- No backend or data changes.

## Exact Files To Change Later
- public/control-center/pages/publishing.js
- public/control-center/styles/12-pages.css
- public/control-center/styles/08-components-foundation.css
- (optionally) shared/banner/ or shared/alert/ primitives

## What Not To Touch
- Do not change backend logic, API payloads, or data.
- Do not touch legacy or unrelated CSS.
- Do not add new features or change authority boundaries.
- Do not rename internal status keys or API payload keys.

## Validation Evidence
- All high-risk actions are confirmation-gated and backend-controlled.
- No uncontrolled publishing or backend bypass.
- UI/UX is safe but visually dense; clarity and simplicity are the only blockers.
- See PUBLISHING_FINAL_READINESS_TRUTH_AUDIT.md and PUBLISHING_MINOR_READINESS_PATCH.md for prior validation.

## Final Recommendation
Publishing is safe but not yet visually premium or simple enough for launch. Apply a medium UI/UX and CSS consolidation patch before moving to Governance. Focus on clarity, simplicity, and CSS cleanup—no new features or backend changes.

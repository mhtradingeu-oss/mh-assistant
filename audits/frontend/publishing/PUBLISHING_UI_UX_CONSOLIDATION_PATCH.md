# Publishing UI/UX Consolidation Patch

**Date:** 2026-05-05

## Purpose
Implements the targeted UI/UX and CSS consolidation patch for the Publishing workspace per the final audit and redesign blueprint. This patch:
- Adds a compact Publishing Command Header (with project/campaign/channel, status, approval, next action, safety copy, and top-level actions)
- Adds a Publishing Workflow Strip (visual workflow steps, state, accessible markup)
- Adds a compact Readiness Summary (readiness cards/chips, blockers summary)
- Recomposes the page to place new helpers above the main grid and merges the safety banner into the header
- Collapses Auto Mode visual weight (Automation Preview section, details/summary, utility classes)
- Cleans up inline styles, replacing with publishing-block-gap and publishing-inline-gap utility classes
- Maintains all event binding IDs and backend/handler safety
- Does not mutate backend/data or break any handlers

## Patch Details

### 1. New Helpers
- `renderPublishingCommandHeader`: Renders the new command header with context, status, approval, next action, safety copy, and actions.
- `renderPublishingWorkflowStrip`: Renders the workflow steps as a visual strip with state.
- `renderPublishingReadinessSummary`: Renders readiness cards/chips for Source, Copy, Media, Channel, Schedule, Governance, Approval, and blockers summary.

### 2. Page Composition
- The new helpers are rendered above the main grid, replacing the old safety banner.
- The main grid and all event bindings remain unchanged.

### 3. Automation Preview
- Auto Mode visual is collapsed into a `<details>` section labeled "Automation Preview".
- All inline margin styles for banners and action rows are replaced with `publishing-block-gap` and `publishing-inline-gap` utility classes.

### 4. Safety and Handlers
- All event binding IDs are preserved.
- No backend/data mutation occurs.
- No handler breakage.

### 5. CSS
- Relies on previously added CSS primitives: `publishing-command-header`, `publishing-workflow-strip`, `publishing-readiness-summary`, `publishing-readiness-card`, `publishing-block-gap`, `publishing-inline-gap`, `publishing-automation-preview`.

## Validation
- All requirements from the UI/UX redesign and consolidation audit are met.
- Visual density, workflow clarity, and accessibility are improved.
- No context window or handler errors.

## 2026-05-21: Visual and Schedule Correctness Patch

### Browser QA Issues Fixed
- **Queue Card Contrast:** Fixed a bug where Publish Queue items rendered with a white/light background and unreadable text. All queue cards now use a dark, readable background and text, with improved contrast for disabled/secondary action buttons. (See Publishing UI consolidation visual correction block in 12-pages.css)
- **Past Scheduled Items:** Fixed an issue where past scheduled items appeared as "Upcoming scheduled items" in the Calendar / Timeline Snapshot. The calendar now:
  - Only shows future scheduled items as "Upcoming scheduled items".
  - Clearly labels past scheduled items as "Past scheduled items — reschedule required".
  - If only past scheduled items exist, the panel does not claim "upcoming".
  - If no scheduled items exist, shows "No scheduled window".
- **No backend/data mutation.**
- **No handler or authority changes.**

### Validation
- All visual and schedule state issues confirmed fixed in browser QA.
- No changes to backend, data, or handler logic.
- All changes are display-only and page-scoped.

---

**Patch Author:** GitHub Copilot (GPT-4.1)
**Audit Reference:** PUBLISHING_UI_UX_REDESIGN_AND_CSS_AUDIT.md

## Browser QA Follow-up Fix

After browser QA, the Publish Queue selected item still rendered with a light/white background and low-contrast disabled actions. A page-scoped dark contrast correction was added for queue rows, queue text, and disabled queue action buttons.

The past schedule classification was also verified: old scheduled items are shown as "Past scheduled items — reschedule required" instead of "Upcoming scheduled items".

No backend, payload, data/projects, API, router, or app shell behavior was changed.

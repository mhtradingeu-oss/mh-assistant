# STEP 40A — Notification Center Clean Layer Adoption Candidate Audit
Date: 2026-05-14
Branch: architecture/frontend-consolidation-v1
Mode: AUDIT ONLY / documentation-only

## Executive Summary
Notification Center is the final Operations surface that still matches the shared Operations shell pattern and is structurally suitable for a clean-layer opt-in audit. The surface is isolated inside `renderNotificationCenter`, uses the same wrapper stack as the previously adopted Operations centers, and keeps its behavior anchored to stable IDs, data attributes, and context APIs.

This is a conditional-safe candidate, not a green-light for implementation. The surface still depends on page-scoped CSS in `09-operations-centers.css`, and the Operations visual QA gate remains pending from STEP 38E / STEP 38F / STEP 39D. STEP 40B should only proceed if that QA is accepted or consciously deferred again for this specific final Operations surface.

## Files Inspected
- `public/control-center/pages/operations-centers.js`
- `public/control-center/styles/09-operations-centers.css`
- `public/control-center/styles/15-clean-operating-layer.css`

## Candidate Page / Section
- Page key: `data-page="notification-center"`
- Render entry: `renderNotificationCenter(context, state, projectName)`
- Surface type: Operations center with a main list column, a right rail, a context ribbon, a runtime strip, and AI/action panels.

## Current UI Structure
The Notification Center render builds this hierarchy:
- `section.page.is-active[data-page="notification-center"]`
- `div.ops-shell.ops-workspace`
- `section.std-context-ribbon`
- `renderExecutiveRuntimeStrip(...)`
- `div.ops-layout-grid`
- `article.panel.ops-main-column`
- `aside.ops-right-rail`
- `section.panel.ops-detail-card`
- `section.panel.ops-action-panel`
- `section.panel.ops-ai-panel`

Inside the main column, the page renders:
- focus tabs via `renderOpsFocusTabs(...)`
- search input `#notificationCenterSearch`
- severity selector `#notificationCenterSeverity`
- the notification table via `renderOpsTable(...)`
- row selection via `data-ops-select`

The right rail renders:
- the selected notification detail card
- notification action controls
- deferred mutation controls
- the AI assistant panel with prompt shortcuts

## Action / Handler / API Inventory
Preserve these behaviors unchanged:
- `#notificationCenterRefreshBtnHeader` click handler
- `#notificationCenterRefreshBtn` click handler
- `#notificationCenterSearch` input handler
- `#notificationCenterSeverity` change handler
- row selection through `data-ops-select`
- mark-read action through `data-mark-read`
- AI handoff through `data-ops-ai-open`
- AI prompt shortcuts through `data-ops-ai-prompt`

Preserve these context calls unchanged:
- `context.fetchProjectNotificationCenter(projectName)`
- `context.markProjectNotification(projectName, notificationId, { status: "read", read: true })`
- `context.reloadProjectData?.(projectName)`
- `context.showMessage?.(...)`
- `context.showError?.(...)`

Preserve these page-local behavior branches unchanged:
- session state for focus, severity, search, selectedKey, loading, and error state
- filtering by search and severity
- selected item derivation and rerender flow
- deferred mutation buttons remaining disabled

## Current CSS Dependencies
Notification Center is already styled through page-scoped rules in `09-operations-centers.css`, not through the clean layer stylesheet yet.

Observed dependencies include:
- `.ops-shell` and `.ops-workspace`
- `.ops-layout-grid`
- `.ops-main-column`
- `.ops-right-rail`
- `.panel` and `.panel-header`
- `.std-context-ribbon`
- `.ops-executive-strip`
- `.ops-runtime-signal-grid`
- `.ops-focus-tabs` and `.ops-focus-tab`
- `.ops-toolbar`, `.command-input`, `.sidebar-select`
- `.ops-notification-state`
- `.ops-table`, `.ops-select-link`, `.ops-state-row`
- `.ops-detail-card`, `.ops-action-panel`, `.ops-ai-panel`
- `.ops-mini-list`, `.ops-deferred-list`, `.ops-deferred-action`
- `.quick-actions`, `.quick-action-btn`, `.ops-prompt-title`, `.ops-prompt-meta`

The clean layer stylesheet `15-clean-operating-layer.css` defines reusable `.mhos-clean-*` primitives, but this Notification Center section does not yet opt into them.

## Risk Classification
Classification: medium risk, conditionally safe as a fourth opt-in candidate.

Why this is acceptable for audit:
- the surface follows the same structural shell as the already-adopted Operations centers
- the change can be limited to wrapper/surface classes only
- the behavior-critical IDs, handlers, and context APIs are already isolated and stable

Why it is not low risk:
- the section still depends on page-scoped CSS for layout and component styling
- the page includes both read and mutation pathways, so accidental wrapper drift could affect perceived interaction state
- visual consistency still needs human confirmation before any implementation slice is accepted

## Visual QA Dependency
STEP 38E, STEP 38F, and STEP 39D established that manual visual QA was deferred for prior Operations surfaces. That deferral remains relevant here because Notification Center is the last Operations candidate.

STEP 40B should not proceed unless Operations visual QA is explicitly accepted or consciously deferred again for Notification Center specifically. If QA is not re-confirmed, implementation should stop at audit only.

## Preservation Requirements
Any future patch must preserve all of the following:
- `data-page="notification-center"`
- `#notificationCenterRefreshBtnHeader`
- `#notificationCenterRefreshBtn`
- `#notificationCenterSearch`
- `#notificationCenterSeverity`
- `data-ops-select`
- `data-mark-read`
- `data-ops-ai-open`
- `data-ops-ai-prompt`
- all existing context/API calls
- all current copy about deferred mutation safety
- all current provenance and route-aware messaging
- all existing row-selection and rerender behavior

## Recommended STEP 40B Patch Scope
The smallest safe STEP 40B candidate is a wrapper-only clean-layer opt-in:
- add `.mhos-clean-*` classes only to non-critical wrapper and surface elements
- keep handler wiring unchanged
- keep all IDs and data attributes unchanged
- keep API/backend calls unchanged
- keep copy unchanged
- keep deferred mutation controls deferred
- do not edit `09-operations-centers.css`
- do not edit `15-clean-operating-layer.css`

Recommended surface targets for that smallest patch:
- the top-level shell wrappers
- the layout grid wrappers
- the main column and right rail surfaces
- the primary panel surfaces that frame the content blocks

Do not expand beyond wrappers until visual QA has been accepted for the final Operations surface.

## Explicit No-Code-Change Statement
This STEP 40A checkpoint is documentation-only. No production code was modified, no CSS was edited, no JavaScript was edited, no backend code was edited, and no project data files were edited.
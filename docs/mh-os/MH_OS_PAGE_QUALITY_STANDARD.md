# MH-OS Page Quality Standard

Status: Canonical
Created: 2026-05-17

## Purpose

This standard defines when an MH-OS page can be called ready for page-by-page finalization. A page is not complete simply because it renders. It must behave like an operating surface inside the AI Business Operating System.

## Mandatory Page Criteria

| Criterion | Requirement |
| --- | --- |
| Purpose clarity | The page states and demonstrates what operational job it owns. |
| Primary action | The page exposes the main safe action or the reason the action is deferred. |
| Next best action | The page shows the recommended next step, owner, route, or blocker. |
| AI Team connection | The page can send a structured handoff or contextual prompt to AI Team when useful. |
| Page-to-page workflow | The page clearly routes work to the correct next workspace, operations center, or governance surface. |
| Real vs planned actions | Real, preview-only, disabled, and planned actions are visibly distinct. |
| Status/readiness | The page exposes relevant readiness, health, approval, or completion state. |
| Empty/loading/error states | Empty, loading, filtered-empty, and error states are explicit and recoverable. |
| Responsive readiness | The page works on desktop, laptop, tablet, and mobile without overlap or horizontal overflow. |
| No duplicate IDs/routes/files | The page does not create duplicate DOM IDs, routes, source files, or source-of-truth definitions. |
| Backend mutation safety | No backend mutation is wired without explicit confirmation and an audit trail. |
| International/professional UX | Copy, layout, and flow should support professional international users and avoid local-only assumptions. |

## Canonical Page Structure

Every page moves toward this four-zone structure:

1. Header
2. Workspace / Main View
3. Action Panel
4. AI Panel

A page may defer Action Panel or AI Panel content, but it should render the zone or document the deferral. Omission without explanation is not complete.

## Zone Standards

### Header

Must include page title, operational context, project scope, status/readiness chips where relevant, and no heavy mutation controls.

### Workspace / Main View

Must show the primary data or work object: list, table, editor, schedule, queue, job view, asset grid, approval list, or other core surface.

### Action Panel

Must contain deliberate user actions. Mutating, destructive, publishing, approval, CRM, customer-reply, or execution actions require confirmation and prior safety/authority audit.

### AI Panel

Must be read-only or prompt-routing by default. It can suggest context, summarize selected data, or send a handoff to AI Team. It must not autonomously execute backend work in a first pass.

## Action Safety Levels

| Level | Name | Allowed in layout pass | Examples |
| --- | --- | --- | --- |
| L1 | read_only | Yes | Refresh, inspect, copy text, view details. |
| L2 | safe_non_destructive | Yes | Navigate to route, prepare prompt, open preview. |
| L3 | mutation_requires_audit | No, unless audited | Create task, rename asset, update status, save config. |
| L4 | destructive_or_authority | No, unless audited and confirmed | Delete, publish, approve, execute, send customer reply, mutate CRM. |

## Real Vs Planned Labels

Use plain labels:

- Real: connected to a verified route, handler, API, or browser capability.
- Preview: prepares local or shared context only.
- Draft-only: creates text or structure for review, not a durable mutation.
- Planned: visible future capability with no active handler.
- Disabled: present in UI but not clickable.
- Needs confirmation: available only after explicit user confirmation.

Never make planned work look like completed execution.

## Status And Readiness

Each page should show the states that matter for its domain: setup completeness, asset readiness, integration health, production status, approval status, task/queue/job health, recommendation freshness, or customer-operation readiness when that phase is active.

## Empty, Loading, And Error States

Every data area must have:

- Empty state: what is missing and how to continue.
- Filtered-empty state: no results match the current filter.
- Loading state: visible while data is loading.
- Error state: user-readable error with retry or route option.

Do not render blank panels or stale data without explanation.

## Responsive Readiness

A page must pass basic viewport checks:

- No horizontal overflow.
- Text wraps within containers.
- Right rail stacks below main content on smaller screens.
- Main action controls remain reachable.
- Floating assistant/dock elements do not overlap content.
- Touch targets are large enough on mobile.

## International And Professional UX Standard

Pages should be useful for international project operators. Avoid slang, unexplained abbreviations, and country-specific assumptions unless project context supplies them. Language, market, channel, and region should be treated as context, not hardcoded truth.

## Scoring Model

| Score | Definition | Implementation meaning |
| --- | --- | --- |
| Complete | Meets all mandatory criteria and validation passed. | Can be treated as finalized for current phase. |
| Mostly Complete | Meets core criteria, with only documented low-risk deferrals. | Can be used, but final audit must list follow-ups. |
| Partial | Works for main flow, but missing important panels, safety labels, or state handling. | Needs targeted page work before finalization. |
| Risky | Contains authority duplication, unclear actions, fragile layout, or mutation ambiguity. | Must be audited and fixed before more feature work. |
| Missing | Route/page does not exist or is only represented by another surface. | Create only after search and approval. |
| Placeholder | Exists but does not perform its page responsibility. | Must be upgraded or explicitly deferred. |

## Page Finalization Checklist

Before marking any page final:

- Confirm route ID and page file ownership.
- Confirm no duplicate page, route, file, or active DOM ID.
- Confirm page purpose and primary action are clear.
- Confirm Header, Workspace, Action Panel, and AI Panel are present or explicitly deferred.
- Confirm next best action and page-to-page transitions are visible.
- Confirm AI Team handoff follows the canonical handoff contract.
- Confirm every action is labeled Real, Preview, Draft-only, Planned, Disabled, or Needs confirmation.
- Confirm no L3/L4 action is wired without audit and confirmation.
- Confirm empty, loading, filtered-empty, and error states.
- Confirm responsive layout in representative desktop and mobile widths.
- Run `node --check` on touched JS files.
- Run `git status --short data/projects` after any interactive QA that could mutate data.
- Record final evidence in a page audit before committing page finalization.

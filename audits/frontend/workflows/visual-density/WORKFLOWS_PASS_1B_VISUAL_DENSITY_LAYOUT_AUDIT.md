# Workflows Pass 1B - Visual Density & Layout Audit

## Purpose

Audit Workflows visual density after the safety semantics label patch.

The page is now safer semantically, but browser QA shows the surface is still visually crowded.

## Current browser QA observation

The page currently displays too many operating layers at once:

- Workflow Catalog.
- Active Workflow Session.
- Prepared Package Preview.
- AI Guidance.
- Action Destination Map.
- Technical Details.
- Recent Sessions / Tracking.

This creates visual traffic and makes the main next action harder to identify.

## Audit scope

This audit reviews:

- Main render sections.
- Layout ownership.
- CSS ownership.
- Areas that should remain visible.
- Areas that should become secondary, compact, or collapsible.
- Whether Workflows should follow the same operating-surface pattern as AI Command.

## Evidence files

- `01-render-sections.txt`
- `02-layout-classes.txt`
- `03-css-ownership.txt`

## UX questions

- What is the primary action on the page?
- Should Workflow Catalog remain fully visible or become a compact selector?
- Should Prepared Package Preview dominate the center?
- Should Action Destination Map be collapsed until a package is prepared?
- Should Technical Details be hidden by default?
- Should Recent Sessions be a footer strip instead of a large card?
- Should right panel show only the next destination, not all destinations?
- Should the page use a 3-zone layout:
  - left: workflow list
  - center: active package builder/preview
  - right: next action/destination

## Initial recommendation to validate

Likely direction:

- Keep header compact.
- Keep step rail.
- Left column: compact Workflow Catalog.
- Center: Active Workflow Session + Prepared Package Preview.
- Right column: AI Guidance + one Next Destination.
- Move Technical Details into collapsed disclosure.
- Move Recent Sessions / Tracking into compact bottom strip.
- Reduce repeated labels and cards.

## Safety constraints

Do not change:

- handlers
- automation engine
- backend behavior
- shared handoff behavior
- run state logic
- route behavior

Any future polish should be CSS/markup-light only and should preserve safety semantics.

## Current status

Pending evidence review.

## Evidence review result

Browser QA and code evidence confirm that Workflows is functional but visually overcrowded.

Confirmed layout areas:

- Left column renders the full Workflow Catalog.
- Center renders Active Workflow Session, input context, prepared package preview, and technical details.
- Right column renders AI Guidance, Action Destination Map, multiple destination cards, Technical Details, and Recent Sessions / Tracking.

## Key UX finding

The right side is not supposed to duplicate the left side.

- Left side = workflow/template selection.
- Center = active package preparation and preview.
- Right side = guidance and next destination routing.

The current right panel is technically working, but it shows too many destination cards at once. This makes it feel equal in weight to the left catalog and creates visual traffic.

## Visual density risk

The page currently displays too many cards at once:

- Full catalog list.
- Multiple destination cards.
- Technical details.
- Recent sessions.
- Prepared package preview.
- Guidance card.

This makes the main next action harder to identify.

## Recommended Pass 1C direction

Apply a small visual-density polish without changing handlers or business logic:

- Keep left catalog visible but slightly more compact.
- Keep center as the main operating area.
- Keep AI Guidance visible.
- Make only the primary destination visually dominant.
- Make secondary destination cards quieter or collapsed.
- Keep Technical Details collapsed.
- Make Recent Sessions / Tracking a compact footer strip.
- Do not remove any handlers.
- Do not change backend, automation engine, routing, or shared handoff behavior.

## Acceptance target

After Pass 1C, the page should communicate:

1. Choose workflow.
2. Complete context.
3. Prepare package.
4. Review/reroute safely.

The user should not feel that all panels compete equally.

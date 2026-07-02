# AI Team Tools / Drawer Grouping Findings

## Summary

The tools drawer grouping audit confirms that AI Command already has a powerful tool foundation.

The current implementation includes:

- canonical specialist tools
- Smart Tool Dock
- Smart Tool Drawer
- source selection
- output selection
- destination selection
- safety summary
- Use in Composer action
- Change Source action
- source-required validation
- shared source return support

The main gap is not technical capability.

The main gap is UX organization.

Tools should be easier for the user to understand as a guided operating system rather than a flat list of available actions.

## Confirmed strengths

### 1. Tool inventory is broad

The system includes tools for:

- strategy
- content
- media
- video
- publishing
- ads
- SEO / insights
- compliance
- operations
- customer operations
- sales / CRM

### 2. Tools carry useful metadata

Tools already include important metadata such as:

- frontend owner page
- destinations
- source types
- output types
- action type
- safety level
- template

### 3. Smart Tool Drawer exists

The drawer already supports:

- output selection
- source selection
- destination selection
- language
- tone
- source details
- extra brief
- safety description
- prompt summary
- use in composer

### 4. Source-required protection exists

The system blocks unsafe source-required tools when no valid source is available.

### 5. Review-only safety is visible

The drawer clearly states that it does not publish, send, route, create CRM records, run workflows, or mutate backend data.

## Main gaps

### Gap 1: Flat tool presentation

Tools currently appear mostly as a list/grid.

The AI Team contract requires tools to be grouped as:

- Recommended next action
- Primary tools
- Secondary tools
- Needs source tools
- Advanced tools

Priority: High.

### Gap 2: Recommended action is not dominant enough

The user should see the best next tool/action first based on:

- selected specialist
- team mode
- current output type
- route destination
- source availability

Priority: High.

### Gap 3: Source-required UX can be smoother

Source-required logic exists, but repeated toast messaging can feel disruptive.

Preferred UX:

- show Needs source on the card
- show selected source state in the drawer
- explain missing source inline
- use toast only as a secondary warning after user action

Priority: Medium.

### Gap 4: Two tool surfaces need a clear relationship

AI Command currently has:

- Canonical Tools inside the right-side AI workspace
- Smart Tool Dock / Drawer

This can be acceptable if the UX clearly communicates:

- Canonical Tools = quick specialist actions
- Smart Drawer = guided setup before use in composer

Priority: Medium.

### Gap 5: Avoid creating a third tool system

The code already has sufficient tool infrastructure.

Future patches should enhance existing render/grouping logic rather than adding a new parallel system.

Priority: High.

## Recommended implementation order

### Pass 1: Tool grouping and labels

Add lightweight grouping to existing tool rendering.

Target:

- Recommended
- Primary
- Needs source
- More tools

Scope should be small.

### Pass 2: Source-required card clarity

Make source-required state visible directly on tool cards and drawer.

### Pass 3: Drawer clarity polish

Improve drawer labels and selected source messaging.

### Pass 4: Browser QA

Confirm:

- specialist tools remain clickable
- drawer opens
- source-required tools block safely
- Use in Composer works
- Change Source works
- no backend execution occurs

## Safety decision

No backend execution should be added.

No durable task creation should be added.

No workflow, publishing, CRM, customer, or governance mutation should happen from tools.

Tools remain preparation-only unless the owning workspace explicitly confirms action.

## Current acceptance

The tools foundation is strong enough to continue.

The next correct step is a targeted grouping/label patch, not a tool rewrite.

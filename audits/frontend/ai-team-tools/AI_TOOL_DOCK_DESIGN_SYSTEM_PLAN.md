# AI Tool Dock Design System Plan

## Purpose

Define the final direction for AI Team tools as a modern contextual tool dock, not a crowded side panel.

The dock should feel like a professional Canva-style launcher adapted to MH-OS:

- visible under the chat composer
- icon-first
- fast to understand
- expandable later
- consistent for all specialists
- preview-first and safe
- reusable across AI Command, Content Studio, Media Studio, Library, Campaign Studio, and Publishing

## Current Reality

AI Command already has specialist tools rendered through:

- PHASE35_SPECIALIST_TOOLS
- renderPhase35ToolsPanel()
- data-aicmdv2-tool handlers

These tools currently appear in the Output Workspace side area.

The composer already has a clear chat area:

- aicmd-room-composer
- aicmd-chatgpt-composer
- aicmd-chatgpt-toolbar

Therefore the first tool dock should be placed under the chat composer, not inside the right Output Workspace.

## Final UX Direction

The user should see a small visual dock under the chat box:

Quick tools:

- Rewrite
- Translate
- Improve
- Summarize
- Sources
- Templates
- Create
- Media Brief
- More

Each tool should have:

- icon
- short label
- tooltip / help text
- subtle hover animation
- safe preview behavior
- no backend mutation in v1

## V1 Behavior

V1 must be safe.

Clicking a tool should only prefill the composer or prepare a local preview.

Allowed in V1:

- prefill composer
- create local preview
- switch to preview tab
- show safe status message

Not allowed in V1:

- backend mutation
- publishing
- approval
- workflow execution
- file overwrite
- direct route without user review
- replacing the existing specialist tools panel

## Recommended V1 Tools

### Rewrite

Prefill:
Rewrite the latest response or selected text in a clearer, more professional style.

### Translate

Prefill:
Translate or adapt the selected text for the project target market.

### Improve

Prefill:
Improve this text for clarity, stronger value, and better conversion.

### Summarize

Prefill:
Summarize this content into clear bullet points and next actions.

### Sources

Prefill:
Use selected Library/project sources to prepare a grounded draft.

### Templates

Prefill:
Use a Content Studio template for the requested output.

### Create

Prefill:
Create a structured draft such as company profile, contract draft, speech, presentation outline, blog article, or campaign package.

### Media Brief

Prefill:
Prepare a design brief for Media Studio from the current content or conversation.

### More

Future drawer entry. In V1 this can prefill:
Show available specialist tools and recommend the best next action.

## Visual System

Add reusable global classes:

- mhos-tool-dock
- mhos-tool-dock-head
- mhos-tool-dock-list
- mhos-tool-dock-item
- mhos-tool-dock-icon
- mhos-tool-dock-label
- mhos-tool-dock-help
- mhos-tool-dock-badge

The visual style should be:

- rounded icon tiles
- premium dark surface
- soft cyan / violet glow
- compact spacing
- clear labels
- accessible focus states
- responsive horizontal scroll on small screens

## Placement

First implementation target:

AI Command composer area.

Recommended insertion point:

After the existing ChatGPT-style composer toolbar / composer body, before status and below the text input.

Do not remove the existing specialist tools panel in v1.

## Relationship to Existing Tools

V1 dock is a quick launcher.

The existing specialist tools panel remains the advanced role tools surface until we migrate it safely.

Future phases may move the existing tools panel into:

- More drawer
- Tools tab
- Advanced tools panel
- Specialist tool library

## Implementation Phases

### TD1 — Plan

Create this design system plan.

### TD2 — Global CSS primitives

Add reusable mhos-tool-dock classes to a global component stylesheet.

### TD3 — AI Command dock markup

Add a small dock under the AI Command composer.

### TD4 — Safe click behavior

Clicking dock items should prefill composer text only.

### TD5 — Browser QA

Verify visual placement, responsive behavior, and no duplicate execution.

### TD6 — Advanced tools migration plan

Only after QA, decide whether the existing right-side tools panel becomes Advanced Tools / More drawer.

## Safety Rules

- No backend changes.
- No API changes.
- No data/projects changes.
- No route behavior changes.
- No removal of existing handlers.
- No removal of existing specialist tools.
- No CSS appended randomly without scoped/global design purpose.
- No direct execution from tool dock.

## First Safe Patch Recommendation

The first implementation after this plan should:

1. Add global tool dock CSS.
2. Add dock markup under AI Command composer.
3. Add a small static dock tool registry inside ai-command.js.
4. Bind clicks to composer prefill only.
5. Validate with node --check.
6. Browser QA before commit.

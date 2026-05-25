# AI Team Tools Drawer Duplication Findings

## Summary

The duplication scan confirms that the AI Command tools/drawer system has a strong existing foundation and should not be rebuilt.

The correct direction is to improve the existing surfaces carefully.

## Confirmed JS ownership

The scan confirms there is one primary implementation for each important drawer/tool function:

- validateDrawerSourceRequirement
- renderSmartToolDrawerShell
- renderAiToolDock
- buildSmartToolComposerPrompt
- openToolDrawer
- bindAiToolDock
- canonicalToolNeedsSelectedSource

This means there is no confirmed duplicate JavaScript drawer implementation that should be replaced by a new one.

## Current tool surfaces

AI Command currently has two intentional tool surfaces:

### 1. Right Panel Canonical Tools

Purpose:
- Quick specialist actions.
- Official right-side tools area.
- Attached to the active specialist/team context.

Owner:
- public/control-center/pages/ai-command.js

### 2. Smart Tool Dock / Drawer

Purpose:
- Guided setup before using a tool in the composer.
- Output/source/destination/language/tone selection.
- Source validation.
- Safety review messaging.
- Use in Composer action.

Owner:
- public/control-center/pages/ai-command/tool-dock.js

These surfaces are related but not the same.

They should not be replaced by a third tool system.

## Prior history

Previous AI Command work already reduced tool duplication by removing/suppressing center quick tools and keeping Canonical Tools in the right panel as the official tools area.

Therefore:

- Do not bring back center quick tools.
- Do not add another tool surface.
- Do not duplicate drawer logic in ai-command.js.
- Do not create another drawer component.

## CSS risk

The main duplication risk is CSS layering, not JavaScript.

Existing CSS includes multiple historical layers for:

- mhos-tool-drawer
- mhos-tool-dock
- aicmd-v2-tools
- aicmd-room-tools
- aicmd-room-tools-grid
- aicmd-v2-tool-btn

The safe approach is not to delete broad CSS blocks now.

Instead:

- Use targeted page-scoped final polish only when needed.
- Avoid broad rewrite.
- Avoid unscoped selectors.
- Keep drawer design-system rules in the foundation layer.
- Keep AI Command page-specific polish in 12-pages.css.

## Source-required UX

Source-required functionality exists and should be improved, not rebuilt.

Preferred direction:

- Keep validateDrawerSourceRequirement.
- Make Needs source clearer on cards/drawer.
- Avoid disruptive repeated warnings.
- Keep Change Source workflow.
- Keep selected source display.

## Recommended next implementation

### Safe option

Do a small label/CSS/UX patch that:

- Clarifies Canonical Tools as quick actions.
- Clarifies Smart Drawer as guided setup.
- Adds visible tool state labels such as Recommended, Needs source, Review-only.
- Improves drawer copy/spacing only if browser QA confirms need.

### Avoid

- New tool system.
- New drawer.
- Rebuilding tool-dock.js.
- Moving tools back into center chat.
- Large CSS consolidation before page-level acceptance.

## Final decision

The next implementation should be a small, targeted UX clarity patch.

It should preserve the existing architecture and should not introduce duplicate logic.

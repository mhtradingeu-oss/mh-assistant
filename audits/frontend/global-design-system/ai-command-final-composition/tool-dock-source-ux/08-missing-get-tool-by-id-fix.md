# AI-COMMAND-GDS-2E-FIX — Missing Tool Lookup Fix

## Status
Implemented pending browser validation.

## Problem
The first empty-select fallback patch referenced `getToolById`, but this helper does not exist in `tool-dock.js`.

## Fix
Use a local lookup from `AI_COMMAND_TOOLS`:

`AI_COMMAND_TOOLS.find((item) => item && item.id === toolId)`

## Safety
- No backend change.
- No API change.
- No command execution behavior change.
- Only fixes frontend drawer metadata fallback lookup.

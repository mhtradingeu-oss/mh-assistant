# AI-COMMAND-GDS-2G — Harden Tool Drawer Select Population

## Status
Implemented pending browser validation.

## Problem
Tool Drawer selects could render with zero options when metadata arrived as pipe-delimited strings.

## Fix
`populateDrawerSelect` now supports:
- arrays
- pipe-delimited strings
- comma-delimited strings
- fallback label when no values exist

## Safety
- No backend change.
- No API change.
- No command execution behavior change.
- Only improves select hydration in the drawer.

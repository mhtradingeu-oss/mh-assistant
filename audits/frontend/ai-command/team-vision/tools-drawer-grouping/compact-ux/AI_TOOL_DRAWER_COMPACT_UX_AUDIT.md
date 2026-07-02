# AI Tool Drawer Compact UX Audit

## Purpose

Audit the existing Smart Tool Drawer before applying a compact UX pass.

## Current state

The drawer is technically correct and safe, but visually dense.

It currently exposes many fields at once:

- output type
- source / input
- destination
- language
- tone
- source details
- extra brief
- safety
- setup summary
- safety note
- actions

## UX target

Keep the drawer powerful but reduce first-view complexity.

Recommended structure:

### Always visible

- tool title
- short purpose
- output type
- source/input
- destination
- source warning if needed
- primary actions

### Collapsible / advanced

- language
- tone
- source details
- extra brief
- full safety explanation
- setup summary

## Constraints

No new drawer system.

No backend changes.

No behavior changes unless required for compact UI.

No source validation changes.

No routing changes.

No CSS rewrite.

Use existing drawer markup and styling safely.

## Expected next step

A small compact UX patch that moves non-critical fields into a collapsible Advanced details area and shortens safety copy while preserving review-only semantics.

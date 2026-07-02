# AI Team Tool Surfaces Label Clarity Patch

## Summary

This patch clarifies the relationship between AI Command tool surfaces without changing architecture.

## What changed

### Right Panel Canonical Tools

Renamed visible label from:

- Canonical Tools

To:

- Quick Actions

Clarified that these are fast specialist actions for the current output and remain review-only.

### Smart Tool Dock / Drawer

Clarified visible copy:

- Guided tools
- Guided setup
- Output, source, destination, then use in composer
- Preparation-only composer-ready instruction

## What did not change

- No routing changes.
- No backend changes.
- No execution behavior.
- No new drawer.
- No new tool system.
- No CSS changes.
- No durable task creation.
- No workflow execution.
- No publishing execution.
- No CRM/customer mutation.
- No governance mutation.

## Reason

The duplication scan confirmed that the existing tool architecture is valid.

The correct next step is label clarity, not a rebuild.

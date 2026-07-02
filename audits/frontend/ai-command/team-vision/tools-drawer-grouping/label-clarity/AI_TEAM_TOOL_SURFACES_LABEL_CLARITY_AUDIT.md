# AI Team Tool Surfaces Label Clarity Audit

## Purpose

Audit the visible labels and descriptions for AI Command tool surfaces before applying a small copy-only clarity patch.

## Existing architecture

The duplication scan confirmed:

- Right Panel Canonical Tools are the official quick specialist tools.
- Smart Tool Dock / Drawer is the guided setup system.
- No new tool system should be created.

## Goal

Make the existing surfaces clearer without changing architecture.

## Scope

Allowed:

- Text/label changes.
- Small description updates.
- No behavior changes.
- No CSS changes unless browser QA later proves necessary.

Not allowed:

- New drawer.
- New tool surface.
- Moving tools back to center chat.
- Tool execution changes.
- Backend changes.

# C1-B — Capability Identity Projection Foundation

## Status

Implemented as an additive, read-only compatibility projection.

## Purpose

Normalize current AI Command Tool Dock identifiers into typed capability identities without changing:

- runtime authority;
- provider execution;
- governance;
- workflows;
- routes;
- UI behavior;
- Tool Drawer behavior.

## Architectural position

This is not a new top-level MH-OS layer.

It is a compatibility projection within the existing frontend runtime.

## Authority

The module:

- does not grant permissions;
- does not execute capabilities;
- does not call providers;
- does not create workflows;
- does not bypass governance;
- does not replace backend security.

## Current integration state

Not imported by AI Command or destination pages yet.

This is intentional.

The next phase must shadow-compare existing Tool Dock IDs against this projection before any source switch or Tool Drawer migration.

## Files

- `public/control-center/runtime/capabilities/capability-identity-map.js`
- `public/control-center/runtime/capabilities/capability-identity-map.test.mjs`

## Next phase

C1-C — Tool Dock identity shadow comparison.

No Tool Drawer deletion is permitted before destination parity and context-source migration are proven.

# Canonical Shell Ownership

## Purpose

Define the official ownership boundaries for the MH-OS frontend shell runtime.

This document exists to stop:
- shell duplication
- overlay conflicts
- runtime ownership drift
- legacy runtime expansion
- command system conflicts
- AI dock conflicts
- unstable loading behavior

---

# Official Ownership Model

## index.html

Owns only:
- app shell structure
- root layout mounts
- canonical overlays
- canonical AI mount
- canonical command mount

Must NOT own:
- runtime orchestration
- business logic
- workflow logic
- AI orchestration

## app.js

Acts only as:
- bootstrap coordinator
- runtime initializer
- route coordinator
- shell hydration entry

Must NOT become:
- giant operational runtime
- overlay authority
- command authority
- AI authority
- rendering monolith

## runtime/

Official owner of:
- command runtime
- overlay runtime
- diagnostics runtime
- shell runtime
- AI runtime
- startup runtime

All future runtime systems must be isolated here.

## styles/

Official owner of:
- canonical shell styles
- typography
- spacing
- layering system
- responsive behavior
- command layer
- AI layer

## legacy/

Purpose:
Compatibility isolation only.

Legacy files:
- are not canonical architecture
- must not receive major new systems
- should be gradually isolated or retired safely

---

# Architectural Direction

Target system:

Header
→ Workspace
→ Action Panel
→ AI Panel

Target identity:
AI Business Operating System

NOT:
- dashboard collection
- widget-heavy admin panel
- disconnected workbenches

---

# Current Confirmed Problems

- multiple shell generations
- duplicated command systems
- overlay lifecycle fragmentation
- startup/runtime overlap
- loading overlay conflicts
- topbar duplication
- AI dock fragmentation
- runtime sprawl inside app.js

---

# Stabilization Strategy

Audit
→ Confirm
→ Isolate
→ Consolidate
→ Stabilize
→ Upgrade

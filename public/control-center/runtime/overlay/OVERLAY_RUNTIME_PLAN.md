# Overlay Runtime Consolidation Plan

## Purpose

Centralize overlay lifecycle ownership for the MH-OS frontend.

This layer will eventually own:
- loading overlays
- command backdrops
- sidebar backdrops
- fatal error panels
- startup trace overlays
- modal coordination
- overlay accessibility
- pointer-event safety
- z-index coordination

---

# Current Problems

Confirmed runtime issues:
- fragmented overlay ownership
- duplicated visibility logic
- repeated aria-hidden handling
- repeated pointer-event handling
- direct style mutation in app.js
- hidden overlays trapping clicks
- inconsistent overlay cleanup

---

# Current Overlay Sources

## Canonical candidates
- styles/02-layer-system.css
- styles/04-command-layer.css
- styles/07-sidebar.css
- runtime/command-runtime.js

## High-risk legacy sources
- legacy/styles.legacy-full.css
- legacy/11-runtime-safety-overrides.legacy.css
- legacy/09-command-legacy-isolation.legacy.css

## Runtime-heavy ownership
- app.js
- index.html inline startup recovery

---

# Consolidation Strategy

Phase 1:
- map ownership
- isolate responsibilities
- identify canonical layer

Phase 2:
- extract overlay helpers
- centralize visibility handling
- centralize aria handling

Phase 3:
- unify lifecycle
- remove duplicate overlay logic
- remove legacy overlay conflicts

---

# Rules

- no runtime rewrites yet
- no overlay deletion yet
- no UX redesign yet
- no breaking startup behavior
- no aggressive CSS removal

Goal:
Safe stabilization before shell modernization.

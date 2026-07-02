# TOPBAR CANONICAL ARCHITECTURE

## Goal
Replace the legacy multi-generation header system with a single operational context layer.

---

# Current Problems

## Structural Drift
The current topbar is composed of multiple overlapping generations:
1. legacy sticky dashboard header
2. responsive emergency overrides
3. executive shell layer
4. ultra minimal header layer
5. international compact header layer

Result:
- duplicated rules
- conflicting responsive behavior
- inconsistent spacing
- unstable command integration
- mobile layout conflicts
- hidden controls
- interaction overlap

---

# Canonical Vision

The topbar is NOT a traditional dashboard header.

It is an:

# Operational Context Layer

The layer must communicate:
- current workspace
- current operational objective
- AI execution context
- runtime status
- quick execution actions
- command access
- navigation hierarchy

---

# Canonical Structure

## LEFT — Navigation Context
Contains:
- sidebar toggle
- workspace identity
- page title
- breadcrumb trail

Behavior:
- compress progressively
- never overlap
- preserve navigation clarity

---

## CENTER — AI Operating Layer
Contains:
- global command surface
- AI suggestions
- execution hints
- contextual recommendations

Behavior:
- adaptive width
- command-first interaction
- collapses intelligently on smaller screens

---

## RIGHT — Operational Actions
Contains:
- New
- Ask AI
- Notifications
- Runtime state
- User menu
- Quick actions

Behavior:
- priority-aware visibility
- compact adaptive controls
- mobile-safe spacing

---

# Design Rules

## Never
- stack multiple topbar systems
- redefine topbar repeatedly
- use emergency responsive overrides
- hide critical actions unpredictably

## Always
- use one canonical grid layout
- preserve interaction stability
- preserve command visibility
- keep AI context accessible
- support adaptive collapse

---

# Responsive Strategy

## Desktop
3-column operational layout:
LEFT / CENTER / RIGHT

## Tablet
Compressed command surface.
Reduced context chips.

## Mobile
Priority-based collapse:
- preserve navigation
- preserve command access
- preserve AI actions
- collapse secondary metadata

---

# Extraction Strategy

## Phase 1
Isolate all topbar rules.

## Phase 2
Classify:
- canonical
- legacy
- emergency override
- obsolete

## Phase 3
Move canonical rules into:
public/control-center/styles/10-topbar-canonical.css

## Phase 4
Disable legacy topbar systems incrementally.

---

# Related Systems

Connected systems:
- command layer
- workspace chips
- AI dock
- sidebar
- execution actions
- runtime indicators
- notifications


# CSS EXTRACTION PLAN

## Goal
Transform the legacy Control Center frontend into a modular AI-native operating system UI without breaking runtime behavior.

---

# Current State

## Legacy file
public/control-center/styles.css

Approximate issues:
- duplicated command systems
- duplicated topbar systems
- overlay conflicts
- repeated media queries
- mixed generations of UI
- AI layer mixed with legacy dashboard layer
- unstable z-index hierarchy
- responsive inconsistencies
- interaction trapping risk

---

# Active Modular Layers

## Foundations
- 00-tokens.css
- 01-reset.css
- 02-layer-system.css

## Shell
- 03-app-shell.css
- 04-command-layer.css
- 05-ai-layer.css
- 06-topbar.css
- 07-sidebar.css

## Components
- 08-components-foundation.css

## Isolation
- 09-command-legacy-isolation.css

---

# Extraction Strategy

## Phase A — Stabilization
Goal:
Prevent breakage while introducing canonical layers.

Status:
COMPLETE

Includes:
- overlay protection
- command isolation
- z-index hierarchy
- app shell stabilization

## Phase B — Legacy Mapping
Goal:
Locate duplicated systems and classify ownership.

Targets:
- command-bar
- command-backdrop
- topbar
- sidebar
- workspace
- cards
- forms
- overlays
- modals
- AI dock

Status:
IN PROGRESS

## Phase C — Safe Extraction
Goal:
Move stable rules from styles.css into modular files.

Rules:
- never delete before isolation
- extract smallest safe units
- test after every extraction
- preserve runtime behavior
- preserve mobile behavior

## Phase D — Canonical Design System
Goal:
Unified visual language.

Includes:
- spacing system
- typography system
- interaction system
- motion system
- AI interaction layer
- responsive hierarchy

## Phase E — AI-native UX
Goal:
Transform dashboard UX into operating-system UX.

Includes:
- contextual workspaces
- AI team surfaces
- command-first interactions
- adaptive workflows
- smart recommendations
- role-aware interfaces
- progressive disclosure

---

# Critical Constraints

## Never
- rewrite app.js blindly
- remove legacy systems without mapping
- merge runtime ops into frontend cleanup
- introduce parallel interaction systems

## Always
- isolate first
- stabilize second
- extract third
- redesign fourth

---

# Next Planned Extraction Targets

1. command-bar legacy rules
2. command-backdrop legacy rules
3. topbar duplicated rules
4. sidebar duplicated rules
5. workspace duplicated rules
6. card systems
7. modal systems
8. AI dock duplication

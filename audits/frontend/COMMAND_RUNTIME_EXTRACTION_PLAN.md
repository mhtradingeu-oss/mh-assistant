# COMMAND RUNTIME EXTRACTION PLAN

## Goal
Safely extract the command runtime from app.js into isolated runtime modules without breaking the operating shell.

---

# Why This Extraction Matters

The current command runtime is tightly coupled to:
- responsive shell behavior
- overlays
- topbar behavior
- mobile interaction model
- AI execution entrypoints

As a result:
- UI refactors are risky
- responsive behavior is fragile
- command UX is difficult to evolve
- runtime ownership is unclear

---

# Current Runtime Owner

## Existing mega-controller
bindResponsiveUi()

Current responsibilities:
- sidebar visibility
- command visibility
- mobile shell mode
- overlay lifecycle
- escape handling
- compact mode
- body overflow locking
- runtime state synchronization

This violates:
- separation of concerns
- runtime isolation
- UI ownership boundaries

---

# Canonical Future Runtime Structure

## shell-runtime.js
Owns:
- viewport mode
- shell classes
- responsive shell state
- mobile shell activation

---

## command-runtime.js
Owns:
- command open/close
- command overlay
- command backdrop
- quick command input
- command execution state
- command keyboard shortcuts
- command accessibility states

---

## sidebar-runtime.js
Owns:
- sidebar lifecycle
- sidebar mobile behavior
- sidebar backdrop
- sidebar responsive transitions

---

## topbar-ui.js
Owns:
- topbar rendering
- operational context display
- workspace state rendering
- action rendering
- AI context presentation

NO runtime shell logic.

---

# Safe Extraction Stages

## Stage 1 — Runtime Mapping
Status:
COMPLETE

Documents:
- STARTUP_RUNTIME_MAP.md
- TOPBAR_RUNTIME_DEPENDENCIES.md
- COMMAND_RUNTIME_ARCHITECTURE.md

---

## Stage 2 — Runtime Isolation
Goal:
Create isolated command runtime wrapper without changing behavior.

Initial extraction targets:
- setMobileCommandExpanded()
- openGlobalCommandBar()
- closeGlobalCommandBarSafe()

Rules:
- preserve existing CSS classes
- preserve DOM structure
- preserve overlay behavior
- preserve keyboard handling

---

## Stage 3 — Shell Separation
Goal:
Move viewport/shell logic into shell-runtime.js

Targets:
- syncCompactShellState()
- mobile shell classes
- resize listeners

---

## Stage 4 — Sidebar Separation
Goal:
Extract sidebar runtime ownership.

Targets:
- sidebarToggleBtn
- sidebarBackdrop
- mobile sidebar lifecycle

---

## Stage 5 — Canonical Topbar
Goal:
Create stable AI-native operational header.

Only after:
- runtime isolation
- command separation
- shell separation

---

# Critical Constraints

## Never
- rewrite bindResponsiveUi() in one step
- replace DOM before extraction
- redesign runtime during extraction
- combine visual redesign with runtime migration

## Always
- extract smallest stable units
- preserve runtime behavior
- commit every safe milestone
- isolate before redesign
- keep rollback safety

---

# Immediate Next Technical Goal

Audit:

- setMobileCommandExpanded()
- syncCompactShellState()
- openGlobalCommandBar()
- closeGlobalCommandBarSafe()

before creating:
- public/control-center/runtime/
- command-runtime.js
- shell-runtime.js


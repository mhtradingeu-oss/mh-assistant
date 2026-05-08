# TOPBAR RUNTIME DEPENDENCIES

## Goal
Document all runtime systems currently coupled to the topbar and command layer before canonical extraction.

---

# Current Runtime Coupling

## Topbar HTML Structure

Current structure:
- sidebar toggle
- page context
- workspace chip
- executive action cluster

No actual:
- topbar-center node
- canonical command region
- dedicated AI context region

This indicates partial migration generations exist inside CSS but not inside runtime DOM.

---

# Command Runtime Ownership

## Runtime controller
bindResponsiveUi()

Controls:
- mobile shell
- sidebar state
- command visibility
- command backdrop
- compact shell mode
- interaction locking

---

# Critical Runtime Nodes

## Sidebar
- sidebarToggleBtn
- sidebarBackdrop

## Command System
- globalCommandBar
- commandToggleBtn
- commandBackdrop
- quickCommandInput

## App Shell
- app
- is-mobile-shell
- is-mobile-command-open
- is-command-open

---

# Current Runtime States

## Desktop
Command layer behaves as expanded operational layer.

## Tablet
Responsive transitions partially controlled by CSS and partially by JS.

## Mobile
Command layer becomes collapsible runtime overlay.

---

# Current Architectural Risk

The topbar is not isolated.

It is tightly coupled to:
- command lifecycle
- responsive shell
- overlay system
- AI command execution
- mobile interaction model

This means:
- visual refactors can break runtime behavior
- CSS-only redesign is unsafe
- command extraction must happen before topbar replacement

---

# Safe Refactor Order

## Step 1
Map runtime ownership.

## Step 2
Isolate command runtime.

## Step 3
Create canonical topbar DOM structure.

## Step 4
Move runtime bindings to canonical nodes.

## Step 5
Disable legacy topbar systems incrementally.

---

# Immediate Next Goal

Create:

public/control-center/styles/10-topbar-canonical.css

ONLY after:
- command runtime isolation
- canonical DOM mapping
- runtime ownership audit


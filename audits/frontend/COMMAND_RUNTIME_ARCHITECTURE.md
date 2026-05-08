# COMMAND RUNTIME ARCHITECTURE

## Goal
Document the current command runtime system before extraction and shell decomposition.

---

# Current Reality

The command system is NOT a simple UI component.

It currently acts as:
- command palette
- AI execution entry
- mobile shell overlay
- responsive interaction layer
- runtime state controller

---

# Current Runtime Ownership

## Main runtime controller
bindResponsiveUi()

Current responsibilities:
- sidebar state
- mobile shell
- command open/close
- overlay visibility
- interaction locking
- responsive transitions
- escape handling
- body overflow locking

This creates:
- high coupling
- fragile responsive behavior
- unsafe UI refactors
- mixed ownership boundaries

---

# Command Runtime Nodes

## DOM nodes
- globalCommandBar
- commandBackdrop
- quickCommandInput
- runQuickCommandBtn
- runSearchBtn

## Missing runtime node
- commandToggleBtn

The runtime expects this node but it is not present in current HTML.

This indicates:
- incomplete migration
- legacy runtime leftovers
- runtime/DOM drift

---

# Current Runtime States

## Desktop
Expanded command layer.

## Mobile
Overlay-based command runtime.

## Global command mode
Controlled through:
- is-command-open
- is-mobile-command-open
- is-mobile-shell

---

# Current Architectural Risks

## Risk 1
bindResponsiveUi() owns too many systems.

## Risk 2
Topbar and command runtime are tightly coupled.

## Risk 3
CSS and runtime both control responsive behavior.

## Risk 4
Legacy runtime nodes still exist in JS expectations.

## Risk 5
Overlay lifecycle is distributed across multiple systems.

---

# Required Future Extraction

## shell-runtime.js
Responsibilities:
- viewport state
- shell state
- responsive shell classes

## command-runtime.js
Responsibilities:
- command open/close
- command overlay
- AI command execution
- quick command interactions

## sidebar-runtime.js
Responsibilities:
- sidebar lifecycle
- mobile nav
- sidebar backdrop

## topbar-ui.js
Responsibilities:
- visual topbar rendering
- workspace context
- action rendering
- AI operational context

---

# Safe Refactor Order

## Step 1
Document runtime ownership.

## Step 2
Extract command runtime.

## Step 3
Extract shell runtime.

## Step 4
Create canonical topbar DOM.

## Step 5
Migrate runtime bindings.

## Step 6
Disable legacy command systems incrementally.

---

# Immediate Next Goal

Create:

audits/frontend/COMMAND_RUNTIME_EXTRACTION_PLAN.md

before:
- creating topbar canonical CSS
- replacing topbar DOM
- redesigning command UX


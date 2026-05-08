# COMMAND STATE MATRIX

## Goal
Document all command runtime states before extraction into isolated runtime modules.

---

# Current Runtime Classes

## app-shell classes

### is-command-open
Meaning:
Desktop/global command mode is open.

Effects:
- command backdrop visible
- command layer interactive
- command input focus
- outside-click close enabled

---

### is-mobile-shell
Meaning:
Viewport is currently in compact/mobile shell mode.

Effects:
- mobile runtime behavior enabled
- command runtime becomes collapsible
- sidebar behavior changes

---

### is-mobile-command-open
Meaning:
Mobile command overlay is expanded.

Effects:
- command overlay visible
- command backdrop active
- interaction lock enabled
- escape close enabled

---

## command-bar classes

### is-collapsed
Meaning:
Command UI visually collapsed.

Effects:
- command hidden
- mobile compact mode active

---

# Current Runtime Ownership

## JS controls

Controlled by:
- bindResponsiveUi()
- setMobileCommandExpanded()
- openGlobalCommandBar()
- closeGlobalCommandBarSafe()

---

## CSS controls

Controlled by:
- styles.css legacy systems
- 04-command-layer.css
- 09-command-legacy-isolation.css

---

# Current Architectural Problem

There is NO canonical command state machine.

Instead:
- runtime state is distributed
- CSS and JS both own visibility
- multiple generations coexist
- responsive behavior is duplicated

This creates:
- unstable overlays
- hidden interaction traps
- mobile inconsistencies
- duplicated lifecycle logic

---

# Canonical Future State Model

## Canonical shell states

### shell-desktop
Desktop operational shell.

### shell-tablet
Compact hybrid shell.

### shell-mobile
Mobile runtime shell.

---

## Canonical command states

### command-closed
Command inactive.

### command-inline
Desktop inline command mode.

### command-overlay
Mobile overlay mode.

### command-transitioning
Protected transition state.

---

# Required Future Runtime Ownership

## JS owns
- state transitions
- accessibility
- lifecycle
- focus
- keyboard handling
- overlay activation

## CSS owns
- visual rendering
- animation
- responsive layout
- spacing
- transitions

NOT runtime state.

---

# Immediate Next Goal

Audit:

- setMobileCommandExpanded()
- openGlobalCommandBar()
- closeGlobalCommandBarSafe()

to identify:
- shared state mutations
- duplicate lifecycle behavior
- overlay ownership
- accessibility ownership

before creating:
- runtime/command-runtime.js


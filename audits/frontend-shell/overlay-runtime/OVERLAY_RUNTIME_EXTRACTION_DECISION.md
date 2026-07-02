# Overlay Runtime Extraction Decision

## Current status

The new file:

public/control-center/runtime/overlay/overlay-runtime.js

is currently helper-only.

It is NOT imported by app.js yet.
It does NOT change runtime behavior.
It does NOT alter startup behavior.
It does NOT remove legacy overlay logic.

---

# Why this exists

The current frontend has fragmented overlay ownership across:

- app.js
- index.html inline startup recovery
- styles/02-layer-system.css
- styles/04-command-layer.css
- styles/07-sidebar.css
- legacy overlay safety CSS
- page-local overlays such as Library preview modals and Integrations drawers

This caused historical risks:
- hidden overlays trapping clicks
- loading overlay blocking forms
- command backdrop blocking inputs
- duplicated pointer-events handling
- repeated aria-hidden handling
- inconsistent hidden/inert state

---

# Safe extraction rule

No existing app.js overlay behavior should be replaced until:

1. current app.js overlay functions are snapshotted
2. new helper behavior is compared
3. only one low-risk read-only/helper usage is connected first
4. node syntax checks pass
5. browser smoke check passes

---

# First safe future candidate

The safest first future connection is a read-only diagnostic helper such as:

- getOverlaySnapshot()

Reason:
It does not change visibility.
It does not change DOM state.
It only standardizes diagnostics.

---

# Do NOT connect yet

Do not replace:
- showLoadingOverlay
- hideLoadingOverlay
- forceHideLoadingOverlay
- startup recovery
- fatal error panel behavior
- command backdrop behavior
- sidebar backdrop behavior

until the shell runtime is stabilized and tested.

---

# Decision

Keep overlay-runtime.js as a helper-only module for now.

Next phase:
Use it only for diagnostics or snapshot normalization before replacing any mutating overlay behavior.

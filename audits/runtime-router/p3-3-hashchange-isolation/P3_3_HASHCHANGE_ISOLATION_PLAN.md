# P3.3 — Hashchange Ownership Isolation

## Problem

app.js currently owns browser hashchange listeners.

This creates:
- duplicated navigation lifecycle
- runtime coupling
- navigation synchronization debt
- possible future desync between runtime layers

---

# Canonical target

router.js becomes:
- sole browser hashchange owner
- sole route transition owner

app.js becomes:
- runtime consumer only

---

# Current listeners

## app.js
- navigation sync listener
- syncContext listener

## router.js
- navigateTo lifecycle
- route rendering lifecycle

---

# Migration direction

Step 1:
Audit only.

Step 2:
Extract browser lifecycle helpers.

Step 3:
Move listener ownership into router.js.

Step 4:
Expose runtime-safe route subscription hooks.

Step 5:
Deprecate app.js browser listeners.

---

# Protected

No route rewrite.
No permission rewrite.
No route rendering rewrite.
No state rewrite.
No overlay rewrite.

---

# Goal

Navigation lifecycle isolation without behavior changes.

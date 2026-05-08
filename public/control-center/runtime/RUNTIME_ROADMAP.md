# CONTROL CENTER RUNTIME ROADMAP

## Current State
app.js still owns:
- startup
- routing
- overlays
- command runtime
- AI dock
- responsive shell
- loading lifecycle

---

# Future Runtime Ownership

## shell-runtime.js
- viewport state
- responsive shell
- mobile layout
- shell classes

## overlay-runtime.js
- overlays
- modal lifecycle
- backdrop coordination
- interaction locking

## command-runtime.js
- command palette
- AI command lifecycle
- keyboard handling
- command accessibility

## route-runtime.js
- route lifecycle
- route transitions
- page loading
- route cleanup

---

# Extraction Strategy

1. isolate
2. stabilize
3. extract
4. optimize

Never rewrite runtime blindly.

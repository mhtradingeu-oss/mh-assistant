# Frontend Lifecycle Registry

## Purpose

The **Lifecycle Registry** provides a safe, reusable foundation for managing frontend listeners, timers, and cleanup operations during page transitions.

### Why This Exists

Current challenge:
- Pages have scattered document/window listeners and timers
- Cleanup is manual or implicit on route changes
- Listener density increases with each new feature

This module solves:
- **Centralized cleanup** — single call to remove all listeners/timers for a page
- **Safe removal** — handles edge cases (invalid targets, already-cleaned, errors)
- **Idempotent operations** — cleanup can be called multiple times without issues
- **Error tracking** — collects cleanup errors for debugging
- **Framework-free** — vanilla JavaScript, no dependencies

## Design Principles

### 1. Backend Authority Remains Unchanged
- Backend (orchestrator-service) owns all permission/policy authority
- Frontend lifecycle registry is **transient UX cleanup only**
- This module does **not** affect backend permissions, data, or behavior

### 2. No UI Behavior Changes
- Registry does not create, modify, or delete UI elements
- Registry does not change event handling semantics
- Pages using the registry will behave identically to pages without it

### 3. Transient vs. Persistent
- **Transient:** Listeners, timers, and disposers registered with the registry
- **Persistent:** Data in backend, authority rules, page structure
- Registry manages transient concerns; persistent concerns are unchanged

### 4. Safe by Default
- Invalid targets/handlers return no-op disposers (fail gracefully)
- Cleanup is idempotent (safe to call multiple times)
- Errors during cleanup are caught and stored, not thrown
- After cleanup, registry rejects new active listeners (returns no-ops)

## API

### createLifecycleRegistry(nameOrOptions)

Create a new registry instance.

```javascript
const registry = createLifecycleRegistry('page-library');
// or with options:
const registry = createLifecycleRegistry({ name: 'page-library', debug: true });
```

### registry.addEventListener(target, type, handler, options)

Register an event listener with automatic cleanup.

```javascript
const disposer = registry.addEventListener(document, 'click', handleClick);
// Returns a disposer function for manual cleanup if needed
// disposer();  // remove listener before full cleanup()
```

### registry.addTimeout(callback, delay)

Register a timeout with automatic cleanup.

```javascript
const disposer = registry.addTimeout(() => {
  console.log('5 seconds elapsed');
}, 5000);
```

### registry.addInterval(callback, delay)

Register an interval with automatic cleanup.

```javascript
const disposer = registry.addInterval(() => {
  console.log('polling...');
}, 1000);
```

### registry.addAnimationFrame(callback)

Register an animation frame callback with automatic cleanup.

```javascript
const disposer = registry.addAnimationFrame(() => {
  // render update
});
```

### registry.addDisposer(disposer)

Register a custom disposer function.

```javascript
registry.addDisposer(() => {
  console.log('custom cleanup');
  // close connections, reset state, etc.
});
```

### registry.cleanup()

Remove all listeners, clear all timers, cancel animation frames, and run all disposers.

```javascript
registry.cleanup();  // idempotent, safe to call multiple times
```

### registry.size()

Get count of active items in registry.

```javascript
console.log(registry.size());  // number of listeners + timers + frames + disposers
```

### registry.isCleanedUp()

Check if registry has been cleaned up.

```javascript
if (registry.isCleanedUp()) {
  console.log('already cleaned');
}
```

### registry.getErrors()

Get errors that occurred during cleanup.

```javascript
const errors = registry.getErrors();
errors.forEach(err => {
  console.log(err.phase, err.context, err.error);
});
```

## Usage Pattern

### For Pages

Future pages can use the registry like this:

```javascript
// In page initialization
const pageRegistry = createLifecycleRegistry('page-library');

pageRegistry.addEventListener(document, 'click', handleClick);
pageRegistry.addEventListener(window, 'resize', handleResize);
pageRegistry.addTimeout(() => {
  loadMoreItems();
}, 3000);

pageRegistry.addDisposer(() => {
  // custom cleanup: close connections, save state, etc.
  api.closeConnection();
});

// Later, when page closes or route changes:
pageRegistry.cleanup();  // all listeners removed, timers cleared, disposers run
```

### For Router

The router can call cleanup when transitioning away from a page:

```javascript
// When leaving a page
const pageRegistry = getActivePageRegistry();
if (pageRegistry) {
  pageRegistry.cleanup();
}
```

## Current Status

- ✓ Module created: `lifecycle-registry.js`
- ✓ No production pages integrated yet
- ✓ Ready for future page migrations
- ✓ Foundation only — no breaking changes

## Future Work

Phase 2 will integrate this registry into:
1. app.js (centralize global listeners)
2. Major pages (library.js, integrations.js, workflows.js, publishing.js, etc.)
3. Router cleanup hooks

## Safety Guarantees

- ✓ **Idempotent cleanup** — calling cleanup() multiple times is safe
- ✓ **Graceful degradation** — invalid targets/handlers return no-ops
- ✓ **Error resilience** — errors during cleanup are caught and stored
- ✓ **No state change** — registry does not modify page state or UI
- ✓ **Backend unaffected** — backend authority and data unchanged

## Testing

Syntax validation:
```bash
node --check public/control-center/runtime/lifecycle/lifecycle-registry.js
```

## Related

- [Step 1: Route Authority Boundary](../authority/STEP_1_ROUTE_AUTHORITY_BOUNDARY.md)
- [Step 2: Lifecycle Registry Foundation](../../audits/frontend/lifecycle/STEP_2_LIFECYCLE_REGISTRY_FOUNDATION.md)

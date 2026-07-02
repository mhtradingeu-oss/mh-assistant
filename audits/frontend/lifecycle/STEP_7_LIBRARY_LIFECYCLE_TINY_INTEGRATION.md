# Step 7: Library Lifecycle Tiny Integration

Audit Date: 2026-05-13  
Branch: architecture/frontend-consolidation-v1  
Mode: Safe tiny integration

## Executive Summary

This step performs a minimal Library-only lifecycle plumbing integration.

Outcome:
- Library lifecycle internals now use the shared runtime lifecycle registry.
- Library external mount/unmount behavior is preserved.
- No Library feature behavior was changed.
- No route behavior was changed.
- No CSS, backend, or data/projects changes were made.
- Publishing and Workflows remain deferred.

## Files Inspected

- public/control-center/pages/library.js
- public/control-center/pages/library/listener-lifecycle.js
- public/control-center/runtime/lifecycle/lifecycle-registry.js
- audits/frontend/lifecycle/STEP_6_APP_SHELL_LIFECYCLE_CLOSEOUT_AND_NEXT_DECISION.md

## Exact Production Files Changed

- public/control-center/pages/library/listener-lifecycle.js

No other production files changed.

## Change Summary (Tiny Integration)

### Before
Library used an internal local disposer array in createListenerRegistry:
- add(): validated target/handler, called addEventListener, pushed disposer into array
- disposeAll(): popped and executed local disposers with warning on failure

### After
Library still exports the same API, but internally delegates to shared lifecycle registry:
- createListenerRegistry() now creates createLifecycleRegistry("library-listeners")
- add() now forwards to registry.addEventListener(...)
- disposeAll() now calls registry.cleanup()
- warning behavior remains by logging cleanup errors from registry.getErrors()

## Lifecycle Behavior Preserved

Preserved exactly:
- mountLibraryGlobalListeners still mounts the same beforeunload and document click handlers.
- unmountLibraryGlobalListeners still removes mounted global handlers by calling dispose function.
- mount/unmount call flow in library.js is unchanged.
- no listener count expansion was introduced.
- no listener responsibilities were modified.

Not changed:
- rendered HTML output
- user interactions
- upload, preview, approve, archive, delete, source-of-truth workflows
- route transitions

## Why This Is Safe

- API stability preserved for Library-facing code (createListenerRegistry, mountLibraryListeners).
- Integration is internal plumbing only.
- Existing runtime lifecycle registry safety guarantees now apply:
  - input validation
  - idempotent cleanup
  - error capture
- Backend authority remains unchanged.
- Library remains projection/UX layer.

## Validation Commands

Executed:

```bash
git status --short
node --check public/control-center/runtime/lifecycle/lifecycle-registry.js
node --check public/control-center/pages/library.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/pages/library/listener-lifecycle.js
grep -RIn "createLifecycleRegistry\|createListenerRegistry\|mountLibraryGlobalListeners\|unmountLibraryGlobalListeners" public/control-center/pages/library.js public/control-center/pages/library public/control-center/runtime/lifecycle || true
```

Results:
- all node --check commands passed
- grep confirms createLifecycleRegistry usage in Library lifecycle module
- grep confirms mountLibraryGlobalListeners / unmountLibraryGlobalListeners remain in library.js
- git status shows only intended changes for this step

## Rollback Instructions

If rollback is needed:

1. Revert the Library lifecycle file:
```bash
git checkout -- public/control-center/pages/library/listener-lifecycle.js
```

2. Re-run syntax checks:
```bash
node --check public/control-center/pages/library/listener-lifecycle.js
node --check public/control-center/pages/library.js
```

This restores the prior local-disposer implementation.

## Why Publishing/Workflows Remain Deferred

Publishing remains deferred because:
- auto-mode subscription lifecycle coupling
- render timer sequencing tied to automation state
- higher cleanup ordering risk

Workflows remains deferred because:
- multiple subscribe/unsubscribe paths
- custom window event bridge
- higher blast radius across automation flow

## Browser QA Checklist

Use this checklist after deployment/local run:

- Library page opens without console errors.
- Asset path copy still works.
- Protected asset preview/open still works.
- Action menus close correctly on outside click.
- Drag-and-drop upload still works.
- File picker upload still works.
- Approve/archive/delete/source-of-truth actions still behave identically.
- Navigating away from Library does not leave stale global click behavior.
- Returning to Library does not duplicate handlers (no repeated side effects).

## Explicit No-Change Scope Statement

- No CSS changes
- No backend changes
- No data/projects changes
- No UI redesign
- No route behavior change
- No Publishing changes
- No Workflows changes

## Final Statement

Step 7 completes the planned tiny Library lifecycle integration by reusing the shared lifecycle registry internally while preserving existing Library behavior and boundaries.

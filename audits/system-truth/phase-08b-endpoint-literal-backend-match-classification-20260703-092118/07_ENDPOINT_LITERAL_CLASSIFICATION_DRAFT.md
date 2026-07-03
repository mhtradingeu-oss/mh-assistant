# Phase 8B Endpoint Literal Classification Draft

## Expected likely-safe categories

### api.js helper literals
Expected if backend route exists.

### app.js diagnostic literals
Expected if they are access-key diagnostics and backend route exists.

### app.js endpoint display strings
Expected if used only for messages/status display.

## Risk categories

### NO_MATCH_FOUND
Needs manual review.

### direct active page literals outside api.js/app.js
Needs manual review.

### public alias literals
Needs manual review.

## Phase 8B rule
No patch until exact mismatch is proven.

# PHASE 8A — Direct Fetch Classification Lock

## Status
PASS — DIRECT FETCH CLASSIFICATION COMPLETE

## Mode
Scan only.

No production code change.
No backend edit.
No frontend edit.
No route change.
No delete.
No CSS change.
No feature implementation.

## Verified

- Remaining direct fetch calls were inspected with source context.
- app.js api.js imports were inspected.
- Backend route matches were inspected.
- Validation completed with no visible syntax errors.
- No code patch was made.

## Classification

### api.js: fetchWithTimeout low-level fetch
Classification:
- Expected low-level transport wrapper.

Decision:
- Keep.

Reason:
- getJson/sendJson/sendRawJson depend on this wrapper.
- It centralizes timeout, runtime trace, parse, and error metadata behavior.

### api.js: createMediaManagerProject direct fetch
Classification:
- API helper direct fetch.
- Backend route exists:
  - POST /media-manager/projects

Decision:
- Keep for now.

Reason:
- It is already inside api.js helper layer.
- It uses explicit runtime control headers and custom response/error handling.
- No active page bypass risk.

### api.js: applyProjectBusinessTemplate direct fetch
Classification:
- API helper direct fetch.
- Backend route exists:
  - POST /media-manager/project/:project/apply-template

Decision:
- Keep for now.

Reason:
- It is already inside api.js helper layer.
- Backend route match exists.
- No active page bypass risk.

### app.js: runAccessKeyDiagnosticProbe direct fetch
Classification:
- Intentional diagnostic direct fetch.

Decision:
- Keep.

Reason:
- It tests an explicit key using raw headers and raw status.
- Replacing with fetchProjects() would hide diagnostic status/fallback behavior.

### app.js: access-key test button direct fetch
Classification:
- Intentional access-key test direct fetch.

Decision:
- Keep.

Reason:
- It tests unsaved/input key before runtime key persistence.
- Replacing with fetchProjects() would change behavior and reduce diagnostic accuracy.

## Final Decision

No Phase 8A patch is needed.

The remaining direct fetch calls are classified as:
- expected transport wrapper
- api helper internals with backend route match
- intentional access-key diagnostics

## Next Phase

PHASE 8B — Endpoint Literal Backend Match Classification

Mode:
- scan only

Goal:
- classify endpoint literals in api.js/app.js
- confirm backend route matches
- separate canonical API helper literals from suspicious or obsolete literals

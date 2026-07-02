# Media Projects Read Auth Compatibility Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Compatibility audit before requiring read key for `/media/projects`.

## Compatibility Verdict

Recommendation: `safe_to_protect_now`

Operational conclusion:
- No active Control Center callers, script callers, or live tooling callers of `/media/projects` were found.
- The only found caller is in an archived backup file (`archive/backups/media-manager.html.bak-20260414-150112`) that is not served or executed.
- Adding `/media/projects` to `SENSITIVE_READ_ROUTE_PATTERNS` closes a real gap with zero frontend breakage risk.

## Backend Route Definition

File: `runtime/orchestrator-service/server.js`, line ~9822

```js
app.get('/media/projects', (req, res) => {
  const result = listMediaManagerProjects();
  return res.json({ projects: result.projects });
});
```

- Returns `{ projects: [...] }` — flat array of project names.
- No path parameter, no project scoping.
- Response shape is not changed by this fix.

## Current Read Middleware State

`SENSITIVE_READ_ROUTE_PATTERNS` (before patch):

```js
const SENSITIVE_READ_ROUTE_PATTERNS = [
  /^\/(?:public\/)?media-manager\/projects\/?$/i,   // /media-manager/projects (different path)
  /^\/(?:public\/)?media-manager\/asset-catalog\/?$/i,
  /^\/(?:public\/)?media-manager\/project\//i,
  /^\/(?:public\/)?media-manager\/storage\//i,
  /^\/(?:public\/)?api\//i,
  /^\/media\/(?:tree|registry|file)\//i,            // /media/tree, /media/registry, /media/file — NOT /media/projects
  /^\/generated-output\//i,
  /^\/today\/?$/i,
  /^\/next\/?$/i,
  /^\/products\/?$/i,
  /^\/optimize-product\//i,
  /^\/prepare-product-update\//i
];
```

Gap: `/media/projects` is not matched by any existing pattern.
- `/^\/(?:public\/)?media-manager\/projects\/?$/i` matches `/media-manager/projects`, not `/media/projects`.
- `/^\/media\/(?:tree|registry|file)\//i` matches `/media/tree/`, `/media/registry/`, `/media/file/` but not `/media/projects`.

`isProtectedControlReadRequest(req)`:
- GET-only check.
- Returns true when any `SENSITIVE_READ_ROUTE_PATTERNS` entry matches `req.path`.

`requireProtectedReadKey`:
- 401 on missing key.
- 403 on invalid key.
- Existing response schema unchanged.

## Caller Matrix

| Endpoint | File | Function / Script | Read-key capable helper | Read key header sent | 401/403 handling | Risk if read key required |
| --- | --- | --- | --- | --- | --- | --- |
| `/media/projects` | `archive/backups/media-manager.html.bak-20260414-150112` | `loadProjects()` (archived, not served) | None — raw `fetch('/media/projects')` | No | No | None — file is archived, not active |
| `/media/projects` | `public/control-center/**` | n/a | n/a | n/a | n/a | None — no caller found |
| `/media/projects` | `scripts/**` | n/a | n/a | n/a | n/a | None — no caller found |

## Caller Usage Summary

Exhaustive search across:
- `public/control-center/**` — no matches
- `scripts/**` — no matches
- All workspace files including archived/ignored: one match in `archive/backups/media-manager.html.bak-20260414-150112` (archived backup, not active or served)

The archived caller `loadProjects()` issues a raw `fetch('/media/projects')` with no read key. Because this file is archived and not served, there is no active breakage risk.

## Read-Key Middleware Proposal

Add a single pattern to `SENSITIVE_READ_ROUTE_PATTERNS`:

```js
/^\/media\/projects\/?$/i,
```

This pattern:
- Matches `GET /media/projects` and `GET /media/projects/` exactly.
- Does not match `/media/tree/`, `/media/registry/`, `/media/file/` (covered separately).
- Does not match `/media-manager/projects` (covered separately).
- Does not widen any existing pattern.
- Does not change the route response shape.

Insertion point: after the existing `/^\/media\/(?:tree|registry|file)\//i` entry, keeping legacy media patterns grouped.

## Compatibility Risks

1. **Archived caller** (`media-manager.html.bak`): Issues raw fetch with no read key. Risk: None — file is archived and not served.
2. **Active callers**: None found. Risk: Zero.
3. **Response shape**: Unchanged — `{ projects: [...] }` is preserved.
4. **Middleware ordering**: `requireProtectedReadKey` is already mounted globally before all route definitions. Adding the pattern is sufficient; no mount-point change is needed.

## Backend Change Applied

Minimal patch: added `/^\/media\/projects\/?$/i` to `SENSITIVE_READ_ROUTE_PATTERNS` in `runtime/orchestrator-service/server.js`.

No other code changed. No route handler modified. No response shape modified.

## Final Recommendation

`safe_to_protect_now`

Fix 4 applied:
- `runtime/orchestrator-service/server.js` — `/media/projects` added to `SENSITIVE_READ_ROUTE_PATTERNS`.
- `audits/backend/security/BACKEND_SECURITY_COMPLETION_AUDIT.md` — Fix 4 recorded.

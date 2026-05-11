# API Insights/Learning Read Auth Compatibility Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Compatibility audit before requiring read key for `/api/insights/:project` and `/api/learning/:project`.

## Compatibility Verdict

Recommendation: `safe_to_protect_now`

Operational conclusion:
- No backend auth patch is required in this pass because the existing read middleware already matches both `/api/...` and `/public/api/...` via `SENSITIVE_READ_ROUTE_PATTERNS`.
- Current middleware behavior already enforces read key on:
  - `/api/insights/:project`
  - `/api/learning/:project`
  - `/public/api/insights/:project`
  - `/public/api/learning/:project`

Evidence:
- `runtime/orchestrator-service/server.js` includes `^\/(?:public\/)?api\/` in `SENSITIVE_READ_ROUTE_PATTERNS`.
- `isProtectedControlReadRequest(req)` uses that pattern list for all GET requests.
- Route definitions for insights/learning exist under both `/api/...` and `/public/api/...` and share handlers.

## Backend Middleware Proof

Current middleware chain:
- `SENSITIVE_READ_ROUTE_PATTERNS` includes:
  - `^\/(?:public\/)?api\/`
- `isProtectedControlReadRequest(req)`:
  - GET-only
  - returns true when any sensitive read pattern matches
- `requireProtectedReadKey`:
  - 401 on missing read key
  - 403 on invalid read key
  - existing response schema (unchanged)

Implication:
- `/api/insights/:project` and `/api/learning/:project` are already covered by protected read-key middleware.
- `/public/api/insights/:project` and `/public/api/learning/:project` are also covered.

## Frontend Caller Matrix

| Endpoint | Function name | File | Read-key capable helper | Read key header sent | AccessKeyError behavior | 401/403 handling | Risk if read key required |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/api/insights/:project` | `fetchProjectInsights` | `public/control-center/api.js` | `getJson` (`buildReadHeaders`) | Conditional on stored/runtime control key (`x-mh-control-key`, `Authorization`) | `parseJson` raises `AccessKeyError` for missing-read-key message; otherwise `Error` with `status` diagnostics | Callers generally use `Promise.allSettled` or `.catch` and surface messages safely | Low |
| `/api/learning/:project` | `fetchProjectLearning` | `public/control-center/api.js` | `getJson` (`buildReadHeaders`) | Conditional on stored/runtime control key | Same as above | Same as above | Low |
| `/public/api/insights/:project` | none found in Control Center callers | `public/control-center/**` | n/a | n/a | n/a | n/a | None (no direct caller found) |
| `/public/api/learning/:project` | none found in Control Center callers | `public/control-center/**` | n/a | n/a | n/a | n/a | None (no direct caller found) |

## Caller Usage Summary

Direct/indirect Control Center callers for `fetchProjectInsights` / `fetchProjectLearning`:
- `public/control-center/api.js`
  - `fetchAllCoreProjectData` optional loaders (`insights`, `learning`) use tolerant optional diagnostics and fallbacks.
- `public/control-center/pages/insights.js`
  - Refresh action calls `fetchProjectInsights(projectName)` and handles errors via `.catch` + `showError`.
- `public/control-center/pages/ai-command.js`
  - `ensureIntelligenceLoaded` uses `Promise.allSettled` and degrades to partial/null intelligence with surfaced error text.
- `public/control-center/pages/workflows.js`
  - `ensureWorkflowIntelligenceLoaded` uses `Promise.allSettled` and continues with partial context.
- `public/control-center/pages/campaign-studio.js`
  - `startIntelligenceHydration` uses `Promise.allSettled` and emits non-fatal error messages.
- `public/control-center/pages/research.js`
  - `startResearchHydration` uses `Promise.allSettled` and emits non-fatal error messages.

## Read Header Proof

In `public/control-center/api.js`:
- `buildReadHeaders()` sets both headers when key exists:
  - `x-mh-control-key`
  - `Authorization: Bearer <key>`
- `getJson()` always uses `buildReadHeaders()` for GET calls, including insights/learning wrappers.

## Access-Key Handling Proof

In `public/control-center/api.js`:
- `AccessKeyError` class exists.
- `parseJson` maps missing-read-key responses to `AccessKeyError`.
- Non-OK responses include status/diagnostics on thrown `Error`.

In `public/control-center/app.js`:
- `isAccessKeyStartupError` treats `AccessKeyError`, status `401`, status `403`, and missing-read-key messages as access-key startup failures.
- `handleAccessKeyStartupRecovery` provides key-focused recovery UX.

In page-level intelligence flows:
- Callers use settled/catch patterns that avoid hard crashes and preserve usability when insights/learning calls fail.

## Compatibility Risks

1. If a session has no saved key and backend bypass is disabled, insights/learning requests return 401; callers generally degrade safely with message output.
2. Invalid saved key returns 403; callers surface errors and continue partial rendering in intelligence-heavy pages.
3. The current security completion audit contains a stale statement that `/api/insights/:project` and `/api/learning/:project` are not read-key protected; this should be corrected in a documentation cleanup pass.

## Backend Change Proposal

No behavior change proposed in this pass.

Rationale:
- Existing middleware already enforces read-key auth for both canonical and public insights/learning endpoints.
- Additional regex additions for these specific paths would be redundant and risk unnecessary churn.

## Final Recommendation

`safe_to_protect_now` (already protected by existing middleware)

Action for this pass:
- Audit-only artifact added.
- No backend route/middleware code change applied.

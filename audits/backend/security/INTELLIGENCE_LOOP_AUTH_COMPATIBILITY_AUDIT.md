# Intelligence Loop Auth Compatibility Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Compatibility audit before requiring read/write key middleware for intelligence loop routes:
- `POST /record_execution_feedback`
- `GET /get_performance_summary`
- `POST /generate_optimization_recommendations`
- `GET /get_smart_suggestions`

## Compatibility Verdict

Recommendation: `protect_with_script_adjustment`

Operational conclusion:
- One active script caller (`scripts/verify-intelligence-loop.js`) calls all four routes and sends **no auth key** in its request helper.
- No Control Center callers found for any of these four routes.
- Backend protection can be safely structured; the script must be updated to send the appropriate key header before the backend patch is safe to apply.
- Backend patch is **deferred** this pass per non-negotiable doctrine rule 1 and rule 9.

## Route Matrix

| Route | Method | Purpose | Mutates durable state | Recommended protection |
| --- | --- | --- | --- | --- |
| `/record_execution_feedback` | POST | Appends a performance record to `analytics/performance.json`; triggers `updateIntelligenceLoop` which writes learning/recommendations | **Yes** (appends records, updates learning.json, recommendations.json) | Write key |
| `/get_performance_summary` | GET | Reads `analytics/performance.json` and builds summary. No mutation. | **No** | Read key |
| `/generate_optimization_recommendations` | POST | Calls `updateIntelligenceLoop` with `trigger: 'recommendation_requested'`; writes recommendations to `ai/recommendations.json` | **Yes** (updates recommendations.json) | Write key |
| `/get_smart_suggestions` | GET | Reads performance/learning data and builds suggestions. No mutation. | **No** | Read key |

## Route Definitions (server.js)

### `POST /record_execution_feedback` (~line 21188)
```js
app.post('/record_execution_feedback', (req, res) => {
  const projectName = requireProjectContext(req, { allowFallback: false });
  // validates job_id, channel, metrics
  // calls appendPerformanceRecord → writes analytics/performance.json
  // calls updateIntelligenceLoop → writes ai/learning.json, ai/recommendations.json
  return res.status(201).json({ ok: true, project, total_records, feedback_record, intelligence });
});
```

### `GET /get_performance_summary` (~line 21260)
```js
app.get('/get_performance_summary', (req, res) => {
  const projectName = requireProjectContext(req, { allowFallback: false });
  const summary = buildPerformanceSummary(projectName); // read only
  return res.json({ ok: true, project, summary });
});
```

### `POST /generate_optimization_recommendations` (~line 21279)
```js
app.post('/generate_optimization_recommendations', (req, res) => {
  const projectName = requireProjectContext(req, { allowFallback: false });
  const update = updateIntelligenceLoop(projectName, { trigger: 'recommendation_requested' });
  // writes ai/recommendations.json
  return res.json({ ok: true, project, recommendations, risk_alerts, based_on });
});
```

### `GET /get_smart_suggestions` (~line 21487)
```js
app.get('/get_smart_suggestions', (req, res) => {
  const projectName = requireProjectContext(req, { allowFallback: false });
  const suggestions = buildSmartSuggestions(projectName); // read only
  return res.json({ ok: true, project, suggestions });
});
```

All four routes use `requireProjectContext(req, { allowFallback: false })` — project is required, no fallback, no cross-project leakage.

## Current Middleware State

`SENSITIVE_READ_ROUTE_PATTERNS` does not include any of these four routes.
`LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` does not include any of these four routes.
`isProtectedControlWriteRequest` checks `/^\/(?:public\/)?media-manager\//`, `/^\/api\/media\//i`, and `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` — none match.
`isProtectedControlReadRequest` checks `SENSITIVE_READ_ROUTE_PATTERNS` — none match.

Result: **all four routes are currently unprotected by key middleware**.

## Caller Matrix

| Endpoint | File | Function / Script | Read-key sent | Write-key sent | 401/403 handling | Risk if key required |
| --- | --- | --- | --- | --- | --- | --- |
| `POST /record_execution_feedback` | `scripts/verify-intelligence-loop.js` | `checkRecordFeedback()` | No | No | No — asserts `status === 201`; any non-201 is a test failure | **High** — script would fail with 401 in keyed environments |
| `GET /get_performance_summary` | `scripts/verify-intelligence-loop.js` | `checkPerformanceSummary()` | No | No | No — asserts `response.ok`; 401/403 would be a test failure | **High** — script would fail with 401 in keyed environments |
| `POST /generate_optimization_recommendations` | `scripts/verify-intelligence-loop.js` | `checkRecommendations()` | No | No | No — asserts `response.ok`; 401/403 would be a test failure | **High** — script would fail with 401 in keyed environments |
| `GET /get_smart_suggestions` | `scripts/verify-intelligence-loop.js` | `checkSmartSuggestions()` | No | No | No — asserts `response.ok`; 401/403 would be a test failure | **High** — script would fail with 401 in keyed environments |
| All four | `public/control-center/**` | n/a | n/a | n/a | n/a | None — no Control Center caller found |

## Script Caller Detail

`scripts/verify-intelligence-loop.js`:

- **Guard**: requires `ALLOW_MUTATING_TESTS=1` environment variable or exits with code 1.
- **Execution modes**:
  - **Embedded** (default, no `MH_HOST`): boots `app.listen(0, '127.0.0.1')` using the live server module, inherits process environment.
  - **External** (when `MH_HOST` is set): hits an external host over HTTP.
- **Request helper** (`req(method, url, body)`): only sets `Content-Type: application/json`. **No key header is included in any mode.**
- **Bypass interaction**: if `MH_CONTROL_CENTER_DISABLE_ACCESS_KEY=1` is set in the process environment, the embedded server bypasses all key checks. Without bypass, protected routes return 401 (missing key) or 503 (key env not configured).
- **Failure handling**: checks use `assert()` which throws on non-success status codes; failures propagate to `fail(results, checkName, error.message)` and set `process.exitCode = 1`. No graceful 401/403 recovery exists.

## Data Mutation / Read Classification

| Route | Classification | Files written |
| --- | --- | --- |
| `POST /record_execution_feedback` | **Write** | `data/projects/<project>/analytics/performance.json`, `data/projects/<project>/ai/learning.json`, `data/projects/<project>/ai/recommendations.json` |
| `GET /get_performance_summary` | **Read** | None |
| `POST /generate_optimization_recommendations` | **Write** | `data/projects/<project>/ai/recommendations.json` |
| `GET /get_smart_suggestions` | **Read** | None |

## Backend Middleware Proposal

When the script is updated to send auth keys, apply the following minimal patch:

**Read routes** — add to `SENSITIVE_READ_ROUTE_PATTERNS`:
```js
/^\/get_performance_summary\/?$/i,
/^\/get_smart_suggestions\/?$/i,
```

**Write routes** — add to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`:
```js
/^\/record_execution_feedback\/?$/i,
/^\/generate_optimization_recommendations\/?$/i,
```

These patterns:
- Match only the exact paths, no broader wildcards.
- Do not change route handler logic.
- Do not change response shapes.
- Do not weaken any existing middleware entry.
- Do not affect project isolation or slug validation.

## Compatibility Risks

1. **`scripts/verify-intelligence-loop.js`** (critical): sends no auth key in any mode. In keyed environments without bypass, all four checks would fail with 401. The script must be updated to read `MH_CONTROL_CENTER_WRITE_KEY` from environment and include it as `x-mh-control-key` (or `Authorization: Bearer`) in the request helper before the backend patch is safe.

2. **Embedded server bypass**: when `MH_CONTROL_CENTER_DISABLE_ACCESS_KEY=1` is set, the server bypasses key checks. The script works correctly in bypass mode even without key headers. If the only intended execution context is bypass mode (local dev testing), the script adjustment may be minimal — but this cannot be assumed for production or CI environments.

3. **External host mode** (`MH_HOST` set): no bypass available for an external host. Script would fail with 401 against a keyed production/staging server.

4. **Response shapes**: unchanged by this proposal. No handler code is modified.

## Final Recommendation

`protect_with_script_adjustment`

Action for this pass:
- Audit-only artifact added.
- **No backend route/middleware code changed.**
- Script `scripts/verify-intelligence-loop.js` must be updated to:
  - Read `process.env.MH_CONTROL_CENTER_WRITE_KEY` in the `req()` helper.
  - Include key as `x-mh-control-key` header (and/or `Authorization: Bearer`) when set.
  - Proceed to backend patch after script update and verification.
- Backend patterns to add are fully documented in the proposal above; apply in the next pass after script compatibility is confirmed.

## Script Fix 5A Applied

Date: 2026-05-11

`scripts/verify-intelligence-loop.js` updated:

- `CONTROL_KEY` constant added, resolved in priority order from environment:
  1. `MH_CONTROL_CENTER_WRITE_KEY`
  2. `CONTROL_CENTER_WRITE_KEY`
  3. `MH_CONTROL_KEY`
- `req()` helper now attaches `x-mh-control-key` and `Authorization: Bearer <key>` headers when key is present.
- When no key is present, a non-secret warning is emitted to `stderr` explaining that keyed backends will reject requests and naming the expected env var.
- Startup output now prints `Control key: [set]` or `[not set — set MH_CONTROL_CENTER_WRITE_KEY for keyed backends]`.
- Key is never printed.
- Script remains backward-compatible for local bypass environments (`MH_CONTROL_CENTER_DISABLE_ACCESS_KEY=1`) where no key is configured.
- No backend route or middleware code changed.

Next step (Fix 5B): apply backend middleware patterns once this script update has been verified in the target environment.

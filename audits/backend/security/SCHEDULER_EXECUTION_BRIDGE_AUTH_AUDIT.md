# Scheduler and Execution Bridge Auth Strategy Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Auth strategy for seven scheduler and execution bridge routes. Determines whether each is safe to protect now, requires script adjustment first, or requires a new internal-key design.

---

## 1. Route Matrix

| Route | Method | Purpose | Mutates Durable State | External Provider Calls | Project Context Required | Fallback Allowed |
|---|---|---|---|---|---|---|
| `/execute_publish_package` | POST | Build and log a social publish payload from a campaign package. Returns execution state + payload for human/agent review. | Yes — `writeExecutionBridgeLog` (local JSONL) | No — pure in-process data transform. No social API call. | Yes | No (`allowFallback: false`) |
| `/execute_email_package` | POST | Build and log an email execution payload. Returns subject + HTML body in "pending_execution" state. | Yes — `writeExecutionBridgeLog` | No — pure transform. No email provider call. | Yes | No |
| `/generate_media_from_prompt` | POST | Build a mock media generation plan from a prompt_pack. Returns `mock_output: true` with image prompt, video script, and scene breakdown. | Yes — `writeExecutionBridgeLog` | No — explicitly returns mock output. No AI/image provider call. | Yes | No |
| `/build_ad_execution_package` | POST | Build an ad execution package from a campaign package. Returns ad copy, headline, CTA, audience in "ready_for_review" state. | Yes — `writeExecutionBridgeLog` | No — pure in-process data transform. No ads platform call. | Yes | No |
| `/schedule_execution_job` | POST | Creates a scheduler job record for a future execution. Writes to `data/projects/{project}/execution/scheduler.json`. | Yes — `writeSchedulerJobs`, `writeSchedulerAuditLog` | No — local state only | Yes | No |
| `/scheduler_queue` | GET | Returns all scheduler jobs for a project, bucketed by status (pending, due, running, failed, completed, retryable). | No — read-only | No | Yes | No |
| `/run_scheduler_worker_once` | POST | Locks all due jobs, executes them in-process via `executeJobBridge`, updates job status, writes audit logs, and calls `updateIntelligenceLoop`. | Yes — `writeSchedulerJobs`, `writeSchedulerAuditLog`, `updateIntelligenceLoop` | No — `executeJobBridge` is an in-process function; not an outbound HTTP call | Yes | No |

---

## 2. Caller Matrix

| Route | Active Callers Found | Caller Type | Sends Control Key | Handles 401/403 |
|---|---|---|---|---|
| `/execute_publish_package` | None via HTTP | — | N/A | N/A |
| `/execute_email_package` | None via HTTP | — | N/A | N/A |
| `/generate_media_from_prompt` | None via HTTP (referenced as metadata string in scheduler job records and in `backbone.js` capability constants — not called via HTTP) | — | N/A | N/A |
| `/build_ad_execution_package` | None via HTTP | — | N/A | N/A |
| `/schedule_execution_job` | `scripts/verify-scheduler-automation.js` | Verification script | **No** — `req()` helper sends only `Content-Type: application/json` | No — script would fail on 401/403 |
| `/scheduler_queue` | `scripts/verify-scheduler-automation.js` | Verification script | **No** | No |
| `/run_scheduler_worker_once` | `scripts/verify-scheduler-automation.js` | Verification script | **No** | No |

**Caller search summary:**
- `grep` over `scripts/**` for all seven route names confirmed `verify-scheduler-automation.js` is the only script with HTTP calls to the scheduler routes.
- No script makes HTTP calls to the four execution bridge routes. `backbone.js` in `lib/ops/` lists the route names as metadata strings in a `bridge_actions` array — not as HTTP fetch targets.
- `verify-controlled-semi-auto-dry-run.js` operates directly on the local filesystem (no HTTP calls).
- No calls found in `public/control-center/**`.
- No external workers or cron processes found (no systemd unit files exist in this repository).

**Execution bridge call path:**
The scheduler worker (`/run_scheduler_worker_once`) calls `executeJobBridge(job)` — a bound function from `lib/execution/execution-job-bridge.js`. This is an in-process call, not an HTTP request to the execution bridge routes. The HTTP routes and the in-process bridge function are separate code paths that share the same business logic.

---

## 3. Mutation and External Execution Classification

| Route | Mutation class | External execution risk |
|---|---|---|
| `/execute_publish_package` | Appends execution bridge log (JSONL) | None |
| `/execute_email_package` | Appends execution bridge log (JSONL) | None |
| `/generate_media_from_prompt` | Appends execution bridge log (JSONL) | None — explicitly mock output |
| `/build_ad_execution_package` | Appends execution bridge log (JSONL) | None |
| `/schedule_execution_job` | Writes/overwrites `scheduler.json` (appends job); appends scheduler audit log | None |
| `/scheduler_queue` | None | None |
| `/run_scheduler_worker_once` | Reads + overwrites `scheduler.json`; appends scheduler audit logs; calls `updateIntelligenceLoop` (in-process state update) | None — `executeJobBridge` produces execution-ready payloads but does not deliver to external providers |

---

## 4. Current Controls

| Route | Current protection |
|---|---|
| All 7 routes | Project context required (`requireProjectContext({ allowFallback: false })`) — requests without valid project slug return 400 `PROJECT_CONTEXT_MISSING` |
| All 7 routes | Not matched by `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` — no write-key enforcement |
| `/scheduler_queue` | Not matched by `SENSITIVE_READ_ROUTE_PATTERNS` — no read-key enforcement |
| All 7 routes | Not matched by media-manager or `/api/` patterns |

**Existing middleware anchors:**
- `requireProtectedControlWriteKey` (globally mounted at line 253): applies to POST/PATCH/DELETE matching `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` or media-manager / `/api/media/` paths.
- `requireProtectedReadKey` (globally mounted at line 313): applies to GET matching `SENSITIVE_READ_ROUTE_PATTERNS`.
- Both support `MH_CONTROL_CENTER_DISABLE_ACCESS_KEY=1` bypass (read middleware only) and timing-safe key comparison.

---

## 5. Recommended Auth Model

### Execution bridge routes (4 POST routes)

**Recommendation: `safe_to_protect_now`**

No active HTTP callers exist. These routes build execution payloads in-process and write local audit logs. They do not call external providers. Protecting them with the write key is a pure net-positive security control with zero compatibility risk.

Action: Add all four to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`.

Patterns to add:
```js
/^\/execute_publish_package\/?$/i,
/^\/execute_email_package\/?$/i,
/^\/generate_media_from_prompt\/?$/i,
/^\/build_ad_execution_package\/?$/i,
```

### Scheduler write routes (`/schedule_execution_job`, `/run_scheduler_worker_once`)

**Recommendation: `protect_with_script_adjustment`**

`scripts/verify-scheduler-automation.js` is an active caller and sends no control key. Adding these to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` before the script is updated would immediately break all scheduler automation verification runs.

The script must be updated to resolve the write key from env vars (same pattern as `scripts/verify-intelligence-loop.js` — Fix 5A) and attach `x-mh-control-key` and `Authorization: Bearer <key>` headers in its `req()` helper. Once that script update is committed, the backend patterns can be added safely (a parallel to Fix 5A → 5B).

### Scheduler read route (`/scheduler_queue`)

**Recommendation: `protect_with_script_adjustment`** (same dependency as above)

`scripts/verify-scheduler-automation.js` calls `GET /scheduler_queue` without a key. Add to `SENSITIVE_READ_ROUTE_PATTERNS` only after the script is updated.

Pattern to add once script is compatible:
```js
/^\/scheduler_queue\/?$/i,
```

### No new internal scheduler key required

All routes can use the existing `MH_CONTROL_CENTER_WRITE_KEY` mechanism. No separate "scheduler key" is needed. The in-process `executeJobBridge` call path is not affected by route-level auth changes.

---

## 6. Compatibility Risks

| Risk | Affected routes | Mitigation |
|---|---|---|
| `verify-scheduler-automation.js` has no key in `req()` helper | `/schedule_execution_job`, `/scheduler_queue`, `/run_scheduler_worker_once` | Update script (Fix 8A) before protecting backend (Fix 8B) |
| Future UI use of execution bridge routes (no callers today but routes are named in `backbone.js`) | `/execute_publish_package`, `/execute_email_package`, `/generate_media_from_prompt`, `/build_ad_execution_package` | All Control Center API calls already send `x-mh-control-key` via `buildReadHeaders()`/`buildWriteHeaders()` in `public/control-center/api.js` — no risk |
| `ALLOW_MUTATING_TESTS=1` guard in `verify-scheduler-automation.js` | Scheduler routes only | Guard is unaffected by key addition; both guards remain independent |

---

## 7. Recommendation Summary

| Route group | Verdict | Action this pass |
|---|---|---|
| Execution bridge (4 POST routes) | `safe_to_protect_now` | **Applied** — added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` |
| Scheduler writes (`/schedule_execution_job`, `/run_scheduler_worker_once`) | `protect_with_script_adjustment` | **Deferred** — document and stop |
| Scheduler read (`/scheduler_queue`) | `protect_with_script_adjustment` | **Deferred** — document and stop |

---

## 8. Deferred Fix — Script Adjustment Design (Fix 8A)

When ready, update `scripts/verify-scheduler-automation.js`:

1. Add key resolution at top of script (same pattern as `verify-intelligence-loop.js`):
   ```js
   const CONTROL_KEY = String(
     process.env.MH_CONTROL_CENTER_WRITE_KEY ||
     process.env.CONTROL_CENTER_WRITE_KEY ||
     process.env.MH_CONTROL_KEY ||
     ''
   ).trim();
   if (!CONTROL_KEY) {
     process.stderr.write(
       'Warning: no control key set — set MH_CONTROL_CENTER_WRITE_KEY for keyed backends\n'
     );
   } else {
     process.stdout.write('Control key: [set]\n');
   }
   ```

2. Update the `req()` helper to attach auth headers when key is present:
   ```js
   async function req(method, url, body) {
     const headers = { 'Content-Type': 'application/json' };
     if (CONTROL_KEY) {
       headers['x-mh-control-key'] = CONTROL_KEY;
       headers['Authorization'] = `Bearer ${CONTROL_KEY}`;
     }
     const options = { method, headers };
     if (body !== undefined) options.body = JSON.stringify(body);
     const response = await fetch(`${HOST}${url}`, options);
     let json = null;
     try { json = await response.json(); } catch (_) { json = null; }
     return { status: response.status, ok: response.ok, body: json };
   }
   ```

3. Once this script update is committed (Fix 8A), add the following to the backend (Fix 8B):
   - To `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`:
     ```js
     /^\/schedule_execution_job\/?$/i,
     /^\/run_scheduler_worker_once\/?$/i,
     ```
   - To `SENSITIVE_READ_ROUTE_PATTERNS`:
     ```js
     /^\/scheduler_queue\/?$/i,
     ```

**No new env vars. No new key type. Existing `MH_CONTROL_CENTER_WRITE_KEY` covers all routes.**

---

## 9. Script Fix 8A Applied

Date: 2026-05-11

`scripts/verify-scheduler-automation.js` updated:

- `CONTROL_KEY` constant added — resolves from `MH_CONTROL_CENTER_WRITE_KEY || CONTROL_CENTER_WRITE_KEY || MH_CONTROL_KEY`.
- Startup output: `Control key: [set]` when key is present; warning to stderr when absent explaining that keyed backends will reject with 401.
- `req()` helper updated: attaches `x-mh-control-key` and `Authorization: Bearer <key>` when `CONTROL_KEY` is non-empty. Falls through without headers when key is absent (backward-compatible for bypass environments).
- `ALLOW_MUTATING_TESTS=1` guard behavior unchanged.
- Key is never printed.

**Backend scheduler route enforcement remains deferred — Fix 8B adds backend patterns after this script update.**

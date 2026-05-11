# Backend Security Middleware Completion Audit

Date: 2026-05-11

Branch: `architecture/frontend-consolidation-v1`

Doctrine:

- Backend owns operational authority.
- Frontend projects operational authority.

This audit is documentation-only. No middleware, route behavior, response shape, publishing guardrail, project isolation rule, frontend caller, or `data/projects` file was changed.

## Scope

Used baseline route inventory:

- `audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY.md`
- `audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY_SUMMARY.md`

Inspected:

- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib/security/project-isolation.js`
- `runtime/orchestrator-service/lib/integrations/*.js`
- `runtime/orchestrator-service/lib/integrations/providers/*.js`
- `runtime/orchestrator-service/lib/observability/rate-limit.js`
- `runtime/orchestrator-service/lib/observability/logger.js`
- `runtime/orchestrator-service/lib/media/provider-layer.js`
- `public/control-center/api.js` for caller header context only

## Security Model Summary

The backend currently uses centralized middleware plus route-level guardrails:

- Protected writes are controlled by `requireProtectedControlWriteKey` at `runtime/orchestrator-service/server.js:224`, mounted at `runtime/orchestrator-service/server.js:252`.
- Protected reads are controlled by `requireProtectedReadKey` at `runtime/orchestrator-service/server.js:279`, mounted at `runtime/orchestrator-service/server.js:312`.
- Control key comparison uses `crypto.timingSafeEqual` in `controlWriteKeyMatches`, so the timing-safe comparison remains intact.
- Raw `:project` route segments are validated by `validateRawProjectSlugPathSegment`, `app.param('project')`, and `validateOptionalProjectSlugFields`.
- Filesystem project paths use `normalizeProjectSlug`, `resolvePathWithinRoot`, and `resolveProjectPath` from `runtime/orchestrator-service/lib/security/project-isolation.js`.
- Publishing actions are additionally guarded by `assertPublishingMutationAllowed` at `runtime/orchestrator-service/server.js:13553`.
- Telegram and `/ai`-path routes use in-memory rate limiting through `createInMemoryRateLimiter`.

## Protected Write Middleware Coverage

`isProtectedControlWriteRequest` protects:

- Any `POST`, `PATCH`, or `DELETE` under `/media-manager/...`.
- Any `POST`, `PATCH`, or `DELETE` under `/public/media-manager/...`.
- Legacy protected write routes:
  - `/task`
  - `/ingest`
  - `/backup-and-clone-product/:id`
  - `/apply-prepared-copy-to-clone/:originalId/:cloneId`
  - `/telegram-command`
  - `/media/upload`
  - `/publish-clone/:cloneId`
  - `/replace-original-product/:originalId/:cloneId`
  - `/cleanup-clone/:cloneId`
  - `/publish-blog/:draftId`
  - `/rollback-product/:productId`

The frontend caller context in `public/control-center/api.js` sends write headers through `sendJson` and upload headers through `sendForm`, so current Control Center callers are prepared for protected write routes.

### Protected Mutation Coverage

| Route family | Coverage | Status |
| --- | --- | --- |
| `/media-manager/project/:project/...` mutations | Matched by `/media-manager/` write middleware and `app.param('project')`. | protected |
| `/public/media-manager/project/:project/...` mutations | Matched by `/public/media-manager/` write middleware and `app.param('project')`. | protected |
| `/media/upload` | Matched by legacy write pattern; body project slug is validated by upload storage and handler. | protected |
| Legacy task/ingest/telegram/product mutation routes listed above | Matched by legacy write patterns. | protected |
| Publishing schedule/ready/publish/fail routes | Matched by media-manager write middleware and call `assertPublishingMutationAllowed`. | protected |
| Product publish/replace/blog/rollback routes | Matched by legacy write patterns and call `assertPublishingMutationAllowed` where publish authority is exercised. | protected |

## Protected Read Middleware Coverage

`SENSITIVE_READ_ROUTE_PATTERNS` protects:

- `/media-manager/projects`
- `/public/media-manager/projects`
- `/media-manager/asset-catalog`
- `/public/media-manager/asset-catalog`
- `/media-manager/project/...`
- `/public/media-manager/project/...`
- `/media-manager/storage/...`
- `/public/media-manager/storage/...`
- `/public/api/...`
- `/media/tree/:project`
- `/media/registry/:project`
- `/media/file/:project/:type/:filename`
- `/generated-output/:project/:filename`
- `/today`
- `/next`
- `/products`
- `/optimize-product/:id`
- `/prepare-product-update/:id`

### Sensitive Read Coverage

| Route family | Coverage | Status |
| --- | --- | --- |
| Canonical media-manager project reads | Matched by `/media-manager/project/` read pattern and slug validation. | protected |
| Public media-manager project read aliases | Matched by `/public/media-manager/project/` read pattern and slug validation. | protected |
| `/public/api/insights/:project`, `/public/api/learning/:project` | Matched by `/public/api/` read pattern and raw slug validation. | protected |
| `/api/insights/:project`, `/api/learning/:project` | Read-key protected by the existing `^/(?:public/)?api/` sensitive read middleware pattern and project slug validation. | protected |
| Legacy media file/tree/registry reads | Matched by `/media/(tree|registry|file)/` read pattern and raw slug validation. | protected |
| `/generated-output/:project/:filename` | Matched by `/generated-output/` read pattern and raw slug validation. | protected |
| `/today`, `/next`, product read helpers | Matched by read patterns. | protected |
| `/scheduler_queue`, `/get_performance_summary`, `/get_smart_suggestions` | Require project context but are not matched by read-key middleware. | needs_review |
| `/media/projects` | Not matched by read-key middleware. Lists media-manager projects without project scope. | needs_review |

## Public Route Classification

Routes that appear public by design:

- `GET /health`
- `GET /healthz`
- `GET /readyz`
- `GET /media-manager` and `GET /media-manager/` redirects to Control Center
- Control Center static shell routes
- Static `/public` mount

Important distinction: `/public/media-manager/...` is not public in the auth sense. Despite the path prefix, the aliases are protected by the same centralized read/write middleware as the canonical `/media-manager/...` routes.

## Mutation Route Risk Table

| Route family | Current protection | Risk | Audit status |
| --- | --- | --- | --- |
| Canonical `/media-manager/project/:project/...` writes | Write key; project slug validation. | low to high depending on operation | protected |
| `/public/media-manager/project/:project/...` writes | Write key; project slug validation. | medium compatibility surface | protected |
| Publishing mutations | Write key; project slug validation; `assertPublishingMutationAllowed`. | high | protected |
| Legacy product publish/replace/blog/rollback | Write key; project context; publishing guardrail where publish authority is exercised. | high | protected |
| `/media/upload` | Write key; body project slug validation; 50MB upload limit; project-scoped storage target. | medium | protected |
| `/task`, `/ingest`, `/telegram-command` | Write key; Telegram route is rate-limited. | medium | protected |
| `/execute_publish_package`, `/execute_email_package`, `/generate_media_from_prompt`, `/build_ad_execution_package` | Write-key protected (Fix 8) — added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`. No active HTTP callers existed at time of protection. | high | resolved |
| `/schedule_execution_job`, `/run_scheduler_worker_once`, `/record_execution_feedback`, `/generate_optimization_recommendations` | `/record_execution_feedback` and `/generate_optimization_recommendations` protected (Fix 5B). `/schedule_execution_job` and `/run_scheduler_worker_once` deferred — `verify-scheduler-automation.js` caller has no key support (Fix 8A/8B required). | high | protect_with_script_adjustment |
| `/api/media/*` | Frontend sends write headers, but backend middleware does not require them; may call providers or persist media job output. | high | needs_review |

## Sensitive Read Route Risk Table

| Route family | Current protection | Risk | Audit status |
| --- | --- | --- | --- |
| `/media-manager/project/:project/...` reads | Read key; project slug validation. | low | protected |
| `/public/media-manager/project/:project/...` reads | Read key; project slug validation. | medium compatibility surface | protected |
| `/media/tree/:project`, `/media/registry/:project`, `/media/file/:project/:type/:filename` | Read key; project slug validation; media file query paths constrained to allowed roots. | medium | protected |
| `/generated-output/:project/:filename` | Read key; project slug validation; basename filename check. | medium | protected |
| `/today`, `/next`, product read helpers | Read key. | medium | protected |
| `/api/insights/:project`, `/api/learning/:project` | Read-key protected by the existing `^/(?:public/)?api/` sensitive read pattern and project slug validation. | low | protected |
| `/scheduler_queue`, `/get_performance_summary`, `/get_smart_suggestions` | Project context required; not matched by read-key pattern. | medium | needs_review |
| `/media/projects` | No key apparent; returns project list. | medium | needs_review |

## Scheduler And Execution Bridge Notes

Scheduler and execution bridge routes audit complete — see `audits/backend/security/SCHEDULER_EXECUTION_BRIDGE_AUTH_AUDIT.md`.

**Execution bridge routes** — protected (Fix 8):
- `/execute_publish_package` — added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`
- `/execute_email_package` — added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`
- `/generate_media_from_prompt` — added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`
- `/build_ad_execution_package` — added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`

**Scheduler routes** — deferred (`protect_with_script_adjustment`):
- `/schedule_execution_job` — active caller `scripts/verify-scheduler-automation.js` sends no key; protect after Fix 8A (script update)
- `/scheduler_queue` — same dependency
- `/run_scheduler_worker_once` — same dependency

## `/api/media/*` Notes

The following frontend-used routes are not currently matched by write-key middleware:

- `/api/media/improve-prompt`
- `/api/media/brand-check`
- `/api/media/generate-image`
- `/api/media/generate-video-brief`
- `/api/media/generate-voice-script`
- `/api/media/generate-campaign-pack`

Current controls:

- Frontend `sendJson` sends write headers when a key is available.
- Media provider errors are wrapped by `normalizeOpenAiError` and response error payloads use `sendError`.
- Provider API keys are read from environment and sent only in outbound provider authorization headers.
- Media results may be persisted through `maybePersistMediaGenerationResult` when a project is supplied.

Gaps:

- Backend does not require the write key for `/api/media/*`.
- `shouldApplyAiRateLimit` only matches path segments containing `/ai`; it does not rate-limit `/api/media/*`.

Status: `needs_review`. This is an obvious security concern, but adding mandatory auth or rate limiting is a behavior change and should be handled in a compatibility-aware implementation phase.

## `/public/media-manager/...` Alias Protection

Confirmed protected:

- Write middleware uses `^/(?:public/)?media-manager/`, so `/public/media-manager/...` mutations require the same write key as canonical media-manager mutations.
- Read middleware includes `/public/media-manager/projects`, `/public/media-manager/asset-catalog`, `/public/media-manager/project/...`, and `/public/media-manager/storage/...`.
- Project params in public aliases flow through the same `app.param('project')` slug normalization.

The `/public` static mount is separate from these API aliases and does not make `/public/media-manager/...` API routes public.

## Integration Secret Redaction Notes

Confirmed:

- Integration credentials are encrypted with AES-256-GCM through `applyEncryptedCredentials`.
- `normalizeCredentials` decrypts server-side for provider actions, but `summarizeIntegrationRecord` returns masked credential state instead of raw credentials.
- Sensitive config keys are omitted by `sanitizeIntegrationConfigForClient`.
- Sensitive primary values are masked by `maskPrimaryValueForClient`.
- Logs use `sanitizeValue`, which redacts keys matching secret/token/password/api-key/authorization/credential/cookie.

Needs review:

- `summarizeIntegrationRecord` returns `provider_metadata`, `provider_account`, and `last_sync_summary` as plain objects. Current provider adapters appear to populate these with account/status/business metadata rather than raw credentials, but this relies on provider adapter discipline and should receive explicit schema-level redaction before broader exposure.
- Provider error messages are normalized, but upstream provider messages can still reveal non-secret operational details. Current sanitizer redacts secret-like keys in structured payloads, not arbitrary secret-like substrings inside plain strings.

## Upload And Media Route Notes

Confirmed:

- `/media/upload` is protected by the legacy write-key pattern.
- Upload destination normalizes `req.body.project`, resolves a project-scoped target, and enforces a 50MB file limit.
- `/media/file/:project/:type/:filename` is read-key protected.
- Query-based media file resolution constrains candidates to allowed project media roots and verifies that the target exists and is a file.
- `resolveProjectPath` and `resolvePathWithinRoot` protect project filesystem roots.

Needs review:

- Upload filename sanitization only replaces whitespace in the original filename before prefixing with a timestamp. Destination directory is project-scoped, but filename hardening should be reviewed separately.
- `/media/projects` is now read-key protected (Fix 4 applied).

## AI And Telegram Rate-Limit Notes

Confirmed:

- `/telegram-command` is matched by `applyRouteRateLimit` and also protected by the legacy write-key pattern.
- `/media-manager/project/:project/ai/...` routes are matched by the `/ai` rate-limit predicate and protected by read/write middleware according to method.

Needs review:

- `/api/media/*` routes are AI/provider-backed but do not include `/ai` in the path, so they are not rate-limited by `shouldApplyAiRateLimit`.
- Execution bridge routes that generate media/ad/email/publishing payloads are not rate-limited.

## Fix 1 Applied (Backend Security)

- `/api/media/*` routes are now covered by the in-memory provider/AI route rate limiter via the existing `applyRouteRateLimit` middleware path.
- Authentication for `/api/media/*` remains intentionally deferred to a separate compatibility-aware phase.
- No route response shapes were changed in this fix.

## Fix 2B Applied (Backend Security)

- `/api/media/*` now requires the existing protected write key via centralized `isProtectedControlWriteRequest` middleware matching.
- `/api/media/*` remains covered by the in-memory provider/AI route rate limiter.
- Frontend compatibility for missing/invalid key UX was prepared in Security Fix 2A before this backend enforcement change.
- No route response shapes were changed beyond existing protected-write middleware responses.

## Publishing And Product Guardrails

Confirmed:

- `/media-manager/project/:project/publishing/schedule`
- `/media-manager/project/:project/publishing/:jobId/reschedule`
- `/media-manager/project/:project/publishing/:jobId/ready`
- `/media-manager/project/:project/publishing/:jobId/publish`
- `/media-manager/project/:project/publishing/:jobId/fail`
- The matching `/public/media-manager/.../publishing/...` aliases
- `/publish-clone/:cloneId`
- `/replace-original-product/:originalId/:cloneId`
- `/publish-blog/:draftId`
- `/rollback-product/:productId`

These routes call `assertPublishingMutationAllowed` where publishing authority is exercised. This audit did not modify that function.

Needs review:

- `/cleanup-clone/:cloneId` changes WooCommerce status but does not call `assertPublishingMutationAllowed`. It is write-key protected and may be intentionally cleanup-only, but because it mutates product state it should be explicitly classified in a future product authority pass.
- `/backup-and-clone-product/:id` and `/apply-prepared-copy-to-clone/:originalId/:cloneId` are write-key protected but do not call publishing guardrails. They create/update draft clones rather than publishing; document as product preparation authority.

## Project Isolation Confirmation

Confirmed:

- `normalizeProjectSlug` rejects empty slugs, overlong slugs, path traversal, separators, absolute paths, Windows drive paths, and non `[A-Za-z0-9_-]` values.
- `resolveProjectPath` resolves project roots beneath a configured projects root.
- Raw URL project segments are validated before routes.
- Express `:project` params are normalized before handlers.
- Optional `body.project` and `query.project` values are normalized or rejected before handlers.

Needs review:

- Legacy helpers using `normalizeOptionalProjectSlug` can silently drop an invalid optional project and fall back to default project in routes that allow fallback. This is existing behavior, not changed here, but should be considered during legacy consolidation.


## Fix 3 Documentation Correction Applied

- `/api/insights/:project` and `/api/learning/:project` were re-audited and confirmed already protected by the existing `^/(?:public/)?api/` sensitive read middleware pattern.
- No backend behavior change was required.
- `audits/backend/security/API_INSIGHTS_LEARNING_READ_AUTH_COMPATIBILITY_AUDIT.md` records the caller and middleware compatibility proof.

## Confirmed Guardrails

- Timing-safe key comparison remains intact.
- Protected read and write middleware remain mounted before route definitions.
- `/public/media-manager/...` aliases are protected by the centralized middleware.
- Project isolation and slug validation remain active.
- Integration credentials are encrypted at rest and masked in client summaries.
- Uploads are write-key protected and project-scoped.
- Telegram and `/ai` project routes are rate-limited.
- Publishing guardrails remain enforced on publishing-authority routes.

## Gaps Requiring Future Work

| Area | Gap | Risk | Status |
| --- | --- | --- | --- |
| `/api/media/*` | Write-key protected via centralized middleware and rate-limited (Fix 1 + Fix 2B). | closed | resolved |
| Scheduler and execution bridge | Project context required, but no read/write key middleware match. | high | needs_review |
| Intelligence loop reads/writes | `/record_execution_feedback`, `/get_performance_summary`, `/generate_optimization_recommendations`, `/get_smart_suggestions` protected by read/write key middleware (Fix 5B). Script prepared in Fix 5A. | closed | resolved |
| Canonical insights/learning | `/api/insights/:project` and `/api/learning/:project` are covered by the existing `^/(?:public/)?api/` sensitive read middleware pattern. | closed | resolved |
| `/media/projects` | Read-key protected by adding `/^/media/projects/?$/i` to `SENSITIVE_READ_ROUTE_PATTERNS` (Fix 4). | closed | resolved |
| Integration provider summaries | `redactProviderSummaryObject()` applied to `provider_metadata`, `provider_account`, and `last_sync_summary` before client delivery (Fix 7). Stored records not mutated. | closed | resolved |
| Upload filenames | `sanitizeUploadFilename()` added in Fix 6: `path.basename` applied first (eliminates traversal), followed by extension validation, stem normalization, max-length enforcement, and safe fallback to `upload`. Existing files not moved. Response shape unchanged. | closed | resolved |
| Legacy default-project fallback | Some legacy routes can fall back to default project when explicit project is absent or invalid. | medium | needs_review |

## Fix 4 Applied

- `/media/projects` added to `SENSITIVE_READ_ROUTE_PATTERNS` in `runtime/orchestrator-service/server.js`.
- No active Control Center or script callers exist; the only caller found is in an archived backup file and not served.
- Response shape `{ projects: [...] }` is unchanged.
- `audits/backend/security/MEDIA_PROJECTS_READ_AUTH_COMPATIBILITY_AUDIT.md` records the caller and middleware compatibility proof.

## Fix 5 Status: Complete

- Intelligence loop routes audited (Fix 5 Prep), script compatibility prepared (Fix 5A), backend middleware patterns applied (Fix 5B).
- All four routes are now protected by existing centralized key middleware.
- `audits/backend/security/INTELLIGENCE_LOOP_AUTH_COMPATIBILITY_AUDIT.md` records the full audit trail.

## Fix 5A Applied (Script Compatibility)

- `scripts/verify-intelligence-loop.js` updated to send `x-mh-control-key` and `Authorization: Bearer` headers from environment.
- Key resolved from `MH_CONTROL_CENTER_WRITE_KEY`, `CONTROL_CENTER_WRITE_KEY`, or `MH_CONTROL_KEY` (first non-empty value).
- Warning emitted to stderr when no key is found; script remains backward-compatible with bypass environments.
- Key is never printed.
- No backend route or middleware code changed in this pass.

## Fix 5B Applied (Backend Enforcement)

- `GET /get_performance_summary` and `GET /get_smart_suggestions` added to `SENSITIVE_READ_ROUTE_PATTERNS` — now require read key.
- `POST /record_execution_feedback` and `POST /generate_optimization_recommendations` added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` — now require write key.
- No route handlers modified. No response shapes changed beyond existing protected-key middleware error responses.

## Fix 7 Applied (Integration Summary Redaction)

- `INTEGRATION_SUMMARY_REDACT_PATTERN` regex added to `runtime/orchestrator-service/server.js` covering: `secret`, `token`, `password`, `api_key` / `apiKey` / `api-key`, `authorization`, `credential`, `cookie`, `session`, `bearer`, `client_secret`.
- `redactProviderSummaryObject(obj, depth)` helper added — recursive, replaces values of sensitive-keyed fields with `"[redacted]"`, depth-capped at 5.
- Applied in `summarizeIntegrationRecord` to `provider_metadata`, `provider_account`, and `last_sync_summary` before return.
- Stored encrypted credential records not read or mutated by this helper.
- `credential_state`, `config`, and `primary_value` remain protected by existing `summarizeCredentialState`, `sanitizeIntegrationConfigForClient`, and `maskPrimaryValueForClient` respectively.
- `audits/backend/security/INTEGRATION_SUMMARY_REDACTION_AUDIT.md` records the full audit.

## Fix 8 Applied (Execution Bridge Write Protection)

- Four execution bridge POST routes added to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` in `runtime/orchestrator-service/server.js`:
  - `/^\/execute_publish_package\/?$/i`
  - `/^\/execute_email_package\/?$/i`
  - `/^\/generate_media_from_prompt\/?$/i`
  - `/^\/build_ad_execution_package\/?$/i`
- No active HTTP callers existed for these routes. The scheduler worker uses `executeJobBridge()` in-process — not via HTTP — and is unaffected.
- Scheduler routes (`/schedule_execution_job`, `/scheduler_queue`, `/run_scheduler_worker_once`) deferred: `scripts/verify-scheduler-automation.js` is an active caller with no key support. Fix 8A (script update) must precede Fix 8B (backend patterns).
- `audits/backend/security/SCHEDULER_EXECUTION_BRIDGE_AUTH_AUDIT.md` records the full audit.

## Fix 8A Applied (Scheduler Verifier Key Header Preparation)

- `scripts/verify-scheduler-automation.js` updated to resolve control key from environment (`MH_CONTROL_CENTER_WRITE_KEY || CONTROL_CENTER_WRITE_KEY || MH_CONTROL_KEY`).
- `req()` helper attaches `x-mh-control-key` and `Authorization: Bearer` when key is present; continues without headers when absent (backward-compatible for bypass environments).
- Startup prints `Control key: [set]` or warns to stderr when absent. Key value is never printed.
- No backend middleware added in this pass. Scheduler routes remain unprotected pending Fix 8B.
- Next step: Fix 8B — add `/^\/schedule_execution_job\/?$/i` and `/^\/run_scheduler_worker_once\/?$/i` to `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS` and `/^\/scheduler_queue\/?$/i` to `SENSITIVE_READ_ROUTE_PATTERNS`.

## No-Weakening Confirmation

Security Fix 1, Fix 2B, Fix 3 (documentation correction), Fix 4, Fix 5A, Fix 5B, Fix 6, Fix 7, Fix 8, and Fix 8A were applied without weakening timing-safe comparisons, publishing guardrails, protected key behavior, project isolation, slug validation, frontend behavior, or `data/projects`.

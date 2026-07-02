# Legacy Default-Project Fallback Policy Audit (Fix 9 Prep)

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Audit legacy default-project fallback behavior in backend project resolution paths.

## 1. Scope And Doctrine

- Backend owns operational authority.
- Frontend projects operational authority.
- This pass is audit-only. No backend behavior change is applied here.

## 2. Core Fallback Primitives

### 2.1 Project Resolution Helpers (server)

- `normalizeOptionalProjectSlug(value)` in `runtime/orchestrator-service/server.js`
  - Invalid/unsafe slugs are dropped to empty string.
  - Does not bypass slug validation, but can enable later fallback if caller allows fallback.
- `getPreferredProjectName()` in `runtime/orchestrator-service/server.js`
  - Resolves default project from `MH_DEFAULT_PROJECT`, otherwise first project from registry.
- `resolveRequestProjectName(req, options)` in `runtime/orchestrator-service/server.js`
  - Resolution order: explicit/body/query/params -> message detection -> default project (unless `allowFallback: false`).
- `requireProjectContext(req, options)` in `runtime/orchestrator-service/server.js`
  - Throws `PROJECT_CONTEXT_MISSING` only when resolution is empty.
  - Allows default-project fallback unless caller passes `allowFallback: false`.
- `requireQueueProjectName(projectName)` in `runtime/orchestrator-service/server.js`
  - Uses `normalizeOptionalProjectSlug(projectName) || getPreferredProjectName()`.
  - Used by legacy queue/media helper functions.

### 2.2 Isolation Guardrails (no fallback bypass)

- `normalizeProjectSlug()` and `resolveProjectPath()` in `runtime/orchestrator-service/lib/security/project-isolation.js`
  - Strict slug/path validation remains enforced.
  - No default-project fallback in this module.

### 2.3 Data Resolver Fallback (not project fallback)

- `UnifiedDataPathResolver` in `runtime/orchestrator-service/lib/data/unified-data-path-resolver.js`
  - `legacy_fallback_read` controls storage-root fallback between canonical and legacy data roots.
  - This is data-root compatibility fallback, not default-project identity fallback.

## 3. Fallback Inventory And Classification

| Surface | Location | Fallback behavior | Protected route? | Mutates data? | Compatibility reason | Risk classification | Recommendation |
|---|---|---|---|---|---|---|---|
| Core request resolver | `resolveRequestProjectName` / `requireProjectContext` | Falls back to preferred default project when explicit project is absent/invalid unless `allowFallback: false` | N/A helper | N/A helper | Legacy clients and CLI-style calls without explicit project | medium | needs_review |
| Legacy queue resolver | `requireQueueProjectName` | Falls back to preferred default project when helper caller provides empty/invalid project | N/A helper | mixed (read/write by caller) | Legacy queue helper compatibility | medium | needs_review |
| `GET /today` | `requireProjectContext(req)` | Default-project fallback allowed | Yes (read-key pattern) | No | Legacy convenience endpoint | low | keep_allowed |
| `GET /next` | `requireProjectContext(req)` | Default-project fallback allowed | Yes (read-key pattern) | No | Legacy convenience endpoint | low | keep_allowed |
| `GET /optimize-product/:id` | `resolveRequestProjectName(req)` | Default-project fallback allowed | Yes (read-key pattern) | No (backend write) | Legacy optimization preview UX | medium | require_project_later |
| `GET /prepare-product-update/:id` | `resolveRequestProjectName(req)` | Default-project fallback allowed | Yes (read-key pattern) | No (backend write) | Legacy draft preparation UX | medium | require_project_later |
| `POST /backup-and-clone-product/:id` | `requireProjectContext(req)` | Default-project fallback allowed | Yes (write-key pattern) | Yes | Legacy mutation flow, pre-policy behavior | high | require_project_later |
| `POST /apply-prepared-copy-to-clone/:originalId/:cloneId` | `resolveRequestProjectName(req)` | Default-project fallback allowed | Yes (write-key pattern) | Yes | Legacy mutation flow, pre-policy behavior | high | require_project_later |
| `POST /publish-clone/:cloneId` | `requireProjectContext(req)` | Default-project fallback allowed | Yes (write-key pattern) | Yes | Legacy publish flow compatibility | high | deprecate_later |
| `POST /replace-original-product/:originalId/:cloneId` | `requireProjectContext(req)` | Default-project fallback allowed | Yes (write-key pattern) | Yes | Legacy publish flow compatibility | high | deprecate_later |
| `POST /publish-blog/:draftId` | `requireProjectContext(req)` | Default-project fallback allowed | Yes (write-key pattern) | Yes | Legacy blog publish compatibility | high | deprecate_later |
| `POST /rollback-product/:productId` | `requireProjectContext(req)` | Default-project fallback allowed | Yes (write-key pattern) | Yes | Legacy rollback compatibility | high | deprecate_later |
| `POST /telegram-command` command routing | `resolveRequestProjectName(req, { explicitProject, text })` | Default-project fallback allowed if command text does not supply resolvable project | Yes (write-key pattern + route rate limit) | Mixed, depends on command | Historical command UX with optional project argument | high | deprecate_later |
| Storage root compatibility | `UnifiedDataPathResolver` feature flags | Legacy root fallback read under migration flags | N/A | Mixed | Canonical migration bridge | low | keep_allowed |
| Execution modules | `runtime/orchestrator-service/lib/execution/*` | No default-project fallback; project slug required by caller | N/A | Mixed | Strict project usage in modules | low | should_remain_allowed |

## 4. Key Findings

- No obvious bug found where default-project fallback bypasses slug validation or project isolation.
- Remaining risk is policy/authority ambiguity: invalid or absent explicit project can still map to default project in some legacy routes.
- Highest risk surfaces are mutating legacy routes where fallback can target unintended project scope while still passing auth.
- Security controls remain in place for these routes (read/write key middleware, rate limits where configured, and publishing guardrails where applicable).

## 5. Recommendation Matrix

- keep_allowed:
  - `GET /today`, `GET /next`
  - Storage-root fallback in `UnifiedDataPathResolver` (migration compatibility)
- require_project_later:
  - `GET /optimize-product/:id`
  - `GET /prepare-product-update/:id`
  - `POST /backup-and-clone-product/:id`
  - `POST /apply-prepared-copy-to-clone/:originalId/:cloneId`
- deprecate_later:
  - `POST /publish-clone/:cloneId`
  - `POST /replace-original-product/:originalId/:cloneId`
  - `POST /publish-blog/:draftId`
  - `POST /rollback-product/:productId`
  - `POST /telegram-command` project inference/default behavior
- needs_review:
  - Shared helper behavior in `resolveRequestProjectName` and `requireQueueProjectName` due broad blast radius across legacy surfaces

## 6. Proposed Migration Plan

1. Phase 9A (compat telemetry, no breaking change)
- Add structured telemetry for fallback hits per route/helper call site.
- Include whether fallback was caused by missing project vs invalid project.
- Keep behavior unchanged.

2. Phase 9B (explicit-project soft enforcement)
- For mutating legacy routes, emit deprecation metadata/warnings when fallback is used.
- Document required explicit project contract in runbooks and scripts.

3. Phase 9C (hard requirement for mutating routes)
- Switch targeted mutating routes from fallback-allowed to explicit project required (`allowFallback: false` equivalent behavior at route boundary).
- Keep read-only convenience endpoints (`/today`, `/next`) fallback-allowed if product policy keeps them.

4. Phase 9D (telegram command policy split)
- Require explicit project for mutating telegram commands.
- Optionally keep inferred/default project for read-only commands only.

5. Phase 9E (helper consolidation)
- Replace broad fallback in shared helpers with explicit caller intent.
- Retain strict slug/path validation and existing middleware order.

## 7. Fix 9 Prep Result

- Applied: policy audit and classification only.
- No backend behavior change in this pass.
- Remaining tightening should be handled through the migration/deprecation plan above.

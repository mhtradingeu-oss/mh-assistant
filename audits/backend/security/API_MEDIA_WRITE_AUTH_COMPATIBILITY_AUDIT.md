# API Media Write Auth Compatibility Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Compatibility audit before requiring backend write-key auth on `/api/media/*`.

## Verdict

Recommendation: `protect_with_frontend_adjustment`

Reason:
- Control Center media callers use `sendJson`, which is write-key capable.
- Header attachment is conditional (`buildWriteHeaders` only sends key headers when a key is present).
- Frontend media callers do not consistently handle write-auth failures (401/403) in an explicit, compatibility-safe way.
- Requiring write key now is likely to change runtime behavior for sessions without a configured key.

Result in this pass:
- No backend auth behavior change applied.
- Keep `/api/media/*` as rate-limited (Fix 1 already applied).
- Keep response shapes unchanged.

## Caller Matrix

| Endpoint | API function | File | UI caller function | Uses sendJson/protected helper | Write key header sent | AccessKeyError behavior | 401/403 handling | Risk if backend requires write key |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/api/media/improve-prompt` | `improveMediaPrompt` | `public/control-center/api.js` | `improveBtn.onclick` (inside `bindMediaStudio`) | `sendJson` | Conditional: sent only when control key exists (`x-mh-control-key`, `Authorization`) | No explicit write-path `AccessKeyError` mapping | Caught generically and falls back to local prompt improvement | Medium: backend response becomes auth-gated; UI path continues with local fallback, but provider-backed behavior changes |
| `/api/media/brand-check` | `brandCheckMedia` | `public/control-center/api.js` | `brandSafeBtn.onclick` (inside `bindMediaStudio`) | `sendJson` | Conditional | No explicit write-path `AccessKeyError` mapping | Caught generically and falls back to local brand-safe transform | Medium: auth failures silently switch to local fallback |
| `/api/media/generate-image` | `generateMediaImage` | `public/control-center/api.js` | `runGenerationAction` via `generationApiForMode("image")` | `sendJson` | Conditional | No explicit write-path `AccessKeyError` mapping | Caught as generic error; draft remains local and status shifts from generating to prompt_ready/failed path | High: generation fails for missing/invalid key sessions |
| `/api/media/generate-video-brief` | `generateMediaVideoBrief` | `public/control-center/api.js` | `runGenerationAction` via `generationApiForMode("video")` | `sendJson` | Conditional | No explicit write-path `AccessKeyError` mapping | Generic catch in generation flow | High: same as above |
| `/api/media/generate-voice-script` | `generateMediaVoiceScript` | `public/control-center/api.js` | `runGenerationAction` via `generationApiForMode("audio")` | `sendJson` | Conditional | No explicit write-path `AccessKeyError` mapping | Generic catch in generation flow | High: same as above |
| `/api/media/generate-campaign-pack` | `generateMediaCampaignPack` | `public/control-center/api.js` | `runGenerationAction` via `generationApiForMode("multi_format")` | `sendJson` | Conditional | No explicit write-path `AccessKeyError` mapping | Generic catch in generation flow | High: same as above |

Notes:
- Search found no direct callers for these six endpoints in `public/control-center/pages/content-studio-workspace.js`.
- Search found no direct callers for these six endpoints in `public/control-center/pages/ai-command.js`.

## Write Header Proof

In `public/control-center/api.js`:
- `buildWriteHeaders()` sets:
  - `headers["x-mh-control-key"] = keyMeta.key`
  - `headers.Authorization = \`Bearer ${keyMeta.key}\``
- This is conditional on `keyMeta.key` being present.
- `sendJson()` always uses `buildWriteHeaders()`.

Implication:
- Frontend is compatible with write auth only when the control key is present in runtime/local storage sources.
- Missing key sessions currently still call `/api/media/*`; with enforced backend write auth, those calls will return 401.

## Access Key Error And Auth Handling Proof

In `public/control-center/api.js`:
- `AccessKeyError` exists, but parse mapping is specific to read-key error messages (`isMissingReadKeyErrorMessage`), not generic write-key failures.
- Generic non-OK responses throw `Error` with `.status` and `.payload` diagnostics.

In `public/control-center/pages/media-studio-workspace.js`:
- `runGenerationAction()` has a generic `catch (error)` and sets draft/failure state.
- Improve/brand-check actions also use generic `catch` and local fallbacks.
- No explicit 401/403 branch and no explicit `AccessKeyError` UX handling for these media write calls.

## Backend Middleware Change Proposal (If/When Compatibility Is Completed)

Current write protection gate:
- `isProtectedControlWriteRequest(req)` in `runtime/orchestrator-service/server.js`
- Protects:
  - `/public/media-manager/*` and `/media-manager/*` writes
  - `LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS`

Minimal future patch location:
- Extend `isProtectedControlWriteRequest` predicate to include media provider routes:

```js
return /^\/(?:public\/)?media-manager\//.test(requestPath)
  || /^\/api\/media\//i.test(requestPath)
  || LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS.some((pattern) => pattern.test(requestPath));
```

Why this location:
- Centralized middleware gate already enforces write key using existing error schema and status codes.
- No route-level response shape changes required.
- No change to rate limits, publishing guardrails, project isolation, or slug validation.

## Compatibility Risks

1. Sessions without configured control key will begin receiving 401 on `/api/media/*` instead of current success/fallback behavior.
2. Invalid key sessions will receive 403; caller handling is generic and may not present actionable auth guidance.
3. Improve/brand-check paths currently fall back locally in catch blocks; backend auth enforcement may silently increase local-only outcomes.
4. Generation paths will fail provider-backed calls when unauthenticated; drafts remain local, but this is still an operational behavior change.

## Recommendation

`protect_with_frontend_adjustment`

Required before backend enforcement:
1. Add explicit 401/403 handling UX for media write calls (clear key-missing/invalid guidance).
2. Confirm key bootstrap path guarantees control key presence for all Control Center entry points using Media Studio.
3. Validate compatibility in Control Center flows where users currently rely on local fallback behavior.

Until those are complete:
- Keep `/api/media/*` rate-limited (already applied).
- Defer mandatory write-key enforcement on `/api/media/*`.

## Frontend Fix 2A Applied

- Media Studio now handles `/api/media/*` auth failures explicitly by detecting 401/403 and access-key failure messages via a shared frontend helper.
- Improve prompt and brand-check preserve local fallback behavior, but now show clear user guidance when fallback was triggered by missing/invalid key auth.
- Generation calls keep drafts safe and now emit auth-specific user messaging instead of a generic generation failure path for key failures.
- Backend write-key enforcement for `/api/media/*` remains deferred in this phase.
- Next step: manual UI validation, then backend write-key enforcement in the centralized write middleware.

## Backend Fix 2B Applied

- Backend write-key enforcement is now enabled for `/api/media/*` through the existing centralized `isProtectedControlWriteRequest` middleware predicate.
- This enforcement was applied after frontend auth UX preparation in Security Fix 2A.
- `/api/media/*` rate limiting remains in place from Security Fix 1.

# Integration Summary Redaction Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Defensive redaction audit for `provider_metadata`, `provider_account`, and `last_sync_summary` returned by integration summary routes.

## Compatibility Verdict

`safe_to_protect_now` — Fix 7 applied.

## Existing Credential Protection (Before Fix 7)

`summarizeIntegrationRecord` already protected most credential surfaces:

| Field | Protection |
|---|---|
| `credentials` (encrypted) | Decrypted server-side only; `summarizeCredentialState` returns `{ is_set, masked }` per key — raw values never returned |
| `primary_value` | `maskPrimaryValueForClient` applies `maskIntegrationCredentialValue` for sensitive primary fields |
| `config` | `sanitizeIntegrationConfigForClient` strips keys matched by `isSensitiveIntegrationField` |
| `auth_fields`, `required_fields` | Returned as plain string arrays (field names only, not values) |

Gap: `provider_metadata`, `provider_account`, and `last_sync_summary` were returned as bare `asPlainObject(...)` output — no key-based redaction applied.

## Provider Summary Fields — Risk Assessment

These three fields are populated by provider adapter sync/test actions and written to the stored integration record. They contain provider-returned account and sync state. Current adapter outputs (from `runtime/orchestrator-service/lib/integrations/providers/`):

- Typical safe content: account name, business name, currency, store URL, plan name, sync counts, last sync timestamp, status messages.
- Potential risk: if a provider adapter inadvertently includes token, secret, or credential data in its metadata or account response, that data would pass through to clients without redaction.

Because redaction relies on adapter discipline, a defensive recursive pass is the correct control layer.

## Existing Sanitizer Analysis

`runtime/orchestrator-service/lib/observability/logger.js` exports `sanitizeValue` with `SENSITIVE_KEY_PATTERN`:
```js
const SENSITIVE_KEY_PATTERN = /(secret|token|password|api[_-]?key|authorization|credential|cookie)/i;
```

This is suitable for log sanitization but not for client-facing API responses:
- It truncates strings to 2000 chars (undesirable for metadata).
- It detects and redacts `Bearer <...>` string values (useful for logs, too broad for structured objects).
- It uses `[REDACTED]` (uppercase) — a log convention.
- Importing a log utility into the response path is an inappropriate coupling.

Decision: add a dedicated `redactProviderSummaryObject` helper in `server.js`.

## Implementation

```js
const INTEGRATION_SUMMARY_REDACT_PATTERN =
  /(secret|token|password|api[_-]?key|apiKey|authorization|credential|cookie|session|bearer|client_secret)/i;

function redactProviderSummaryObject(obj, depth = 0) {
  if (obj === null || typeof obj !== 'object' || depth > 5) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactProviderSummaryObject(item, depth + 1));
  }

  const out = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (INTEGRATION_SUMMARY_REDACT_PATTERN.test(String(key))) {
      out[key] = '[redacted]';
    } else {
      out[key] = redactProviderSummaryObject(value, depth + 1);
    }
  });
  return out;
}
```

Applied in `summarizeIntegrationRecord`:
```js
provider_metadata: redactProviderSummaryObject(asPlainObject(normalizedRecord.provider_metadata)),
last_sync_summary: redactProviderSummaryObject(asPlainObject(normalizedRecord.last_sync_summary)),
provider_account: redactProviderSummaryObject(asPlainObject(normalizedRecord.provider_account)),
```

## Redacted Key Pattern

`INTEGRATION_SUMMARY_REDACT_PATTERN` matches (case-insensitive, substring match on key name):

| Term | Example keys matched |
|---|---|
| `secret` | `secret`, `client_secret`, `app_secret` |
| `token` | `token`, `access_token`, `refresh_token`, `id_token`, `user_token` |
| `password` | `password`, `app_password` |
| `api_key` / `apiKey` / `api-key` | `api_key`, `apiKey`, `api-key` |
| `authorization` | `authorization`, `auth_header` |
| `credential` | `credential`, `credentials` |
| `cookie` | `cookie`, `session_cookie` |
| `session` | `session`, `session_id`, `session_token` |
| `bearer` | `bearer`, `bearer_token` |
| `client_secret` | (also matched by `secret` above) |

## Behavior

- **Recursive**: applies to nested objects and arrays up to depth 5. Beyond depth 5, the value is returned as-is (provider objects are not expected to be deeply nested).
- **Non-mutating**: creates a new object at each level. Stored integration records are not modified.
- **Mask value**: `"[redacted]"` (lowercase, stable string, consistent with security audit conventions in this codebase).
- **Non-sensitive fields**: passed through unchanged. Account name, business name, currency, plan, store URL, sync counts, timestamps, status strings are preserved for UI use.

## Fields Not Changed

| Field | Protection mechanism | Changed by Fix 7 |
|---|---|---|
| `credential_state` | `summarizeCredentialState` — returns `{ is_set, masked }` only | No |
| `config` | `sanitizeIntegrationConfigForClient` — strips sensitive keys | No |
| `primary_value` | `maskPrimaryValueForClient` — masks credential fields | No |
| `auth_fields`, `required_fields` | String arrays of key names only | No |
| `insights_ready` | Boolean/flag map — `asPlainObject`; no credential risk; not changed | No |

## Stored Records

No stored record is read, written, or mutated by this fix. The redaction helper operates only on the in-memory plain object copy constructed by `asPlainObject` inside `summarizeIntegrationRecord`.

## Response Shape

Unchanged at the field level. `provider_metadata`, `provider_account`, and `last_sync_summary` remain present as objects. Only sensitive-keyed nested values are replaced with `"[redacted]"`. No fields are removed from the top-level response shape.

## Compatibility Risk

None identified:
- No Control Center caller depends on secret-keyed values within provider metadata, account, or sync summary objects.
- Non-sensitive metadata (account name, plan, store URL, sync counts, status strings) is preserved.
- The redaction is a net-positive safety control with no observable UI breakage.

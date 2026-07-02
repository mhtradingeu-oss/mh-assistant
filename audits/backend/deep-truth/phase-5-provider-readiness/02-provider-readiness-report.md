# Phase 5 — Provider Credential Readiness Check

Generated: 2026-06-04T18:19:20
Branch: architecture/frontend-consolidation-v1
HEAD: 2de827c

## Security
- This report does not print raw secret values.
- It records presence, length, placeholder detection, and sha256 fingerprints only.
- Any key previously pasted into chat must be rotated before production.

## Env files detected

| File | Exists |
|---|---:|
| `.env.local` | true |
| `.env.production` | false |
| `.env` | false |
| `.env.example` | true |

## Integration encryption key

- Fallback key file: `data/system/integration-secret.key.json`
- Exists: `true`
- Size bytes: `273`

## Control key decision

- READ key present: `true`
- WRITE key present: `true`
- READ and WRITE are same value: `true`
- Production recommendation: use different READ and WRITE keys.

## Core required

| Env key | Status | Present | Length | SHA256 stored? |
|---|---|---:|---:|---:|
| `MH_CONTROL_CENTER_READ_KEY` | `present` | true | 50 | yes |
| `MH_CONTROL_CENTER_WRITE_KEY` | `present` | true | 50 | yes |

## Core recommended

| Env key | Status | Present | Length | SHA256 stored? |
|---|---|---:|---:|---:|
| `MH_INTEGRATION_SECRET_KEY` | `missing_optional` | false | 0 | no |
| `OPENAI_API_KEY` | `present` | true | 164 | yes |
| `MH_OPENAI_API_KEY` | `missing_optional` | false | 0 | no |

## Runtime optional

| Env key | Status | Present | Length | SHA256 stored? |
|---|---|---:|---:|---:|
| `PORT` | `missing_optional` | false | 0 | no |
| `NODE_ENV` | `missing_optional` | false | 0 | no |
| `MH_ASSISTANT_ROOT` | `missing_optional` | false | 0 | no |
| `MH_CONTROL_KEY` | `missing_optional` | false | 0 | no |
| `MH_NATIVE_MEDIA_DEFAULT_PROVIDER` | `missing_optional` | false | 0 | no |
| `NATIVE_MEDIA_GPU_WORKER_URL` | `missing_optional` | false | 0 | no |
| `NATIVE_MEDIA_GPU_WORKER_KEY` | `missing_optional` | false | 0 | no |
| `NATIVE_MEDIA_GPU_WORKER_TIMEOUT_MS` | `missing_optional` | false | 0 | no |
| `MH_EMAIL_BRIDGE_URL` | `missing_optional` | false | 0 | no |
| `MH_EMAIL_BRIDGE_TOKEN` | `missing_optional` | false | 0 | no |

## WordPress / WooCommerce

| Env key | Status | Present | Length | SHA256 stored? |
|---|---|---:|---:|---:|
| `WP_BASE_URL` | `missing_optional` | false | 0 | no |
| `WP_USER` | `missing_optional` | false | 0 | no |
| `WP_APP_PASSWORD` | `missing_optional` | false | 0 | no |
| `WC_BASE_URL` | `missing_optional` | false | 0 | no |
| `WC_KEY` | `missing_optional` | false | 0 | no |
| `WC_SECRET` | `missing_optional` | false | 0 | no |

## Social / external providers optional

| Env key | Status | Present | Length | SHA256 stored? |
|---|---|---:|---:|---:|
| `GOOGLE_ACCESS_TOKEN` | `missing_optional` | false | 0 | no |
| `GOOGLE_REFRESH_TOKEN` | `missing_optional` | false | 0 | no |
| `GOOGLE_DEVELOPER_TOKEN` | `missing_optional` | false | 0 | no |
| `META_ACCESS_TOKEN` | `missing_optional` | false | 0 | no |
| `TIKTOK_ACCESS_TOKEN` | `missing_optional` | false | 0 | no |
| `SLACK_BOT_TOKEN` | `missing_optional` | false | 0 | no |
| `TELEGRAM_BOT_TOKEN` | `missing_optional` | false | 0 | no |
| `SHOPIFY_ADMIN_TOKEN` | `missing_optional` | false | 0 | no |
| `EBAY_ACCESS_TOKEN` | `missing_optional` | false | 0 | no |
| `NOTION_ACCESS_TOKEN` | `missing_optional` | false | 0 | no |
| `MAILCHIMP_API_KEY` | `missing_optional` | false | 0 | no |

## Decision

Status: LOCAL READINESS CHECK PASSED for required control keys.

### Blockers

- None for core required keys.

### Warnings

- MH_INTEGRATION_SECRET_KEY is missing_optional
- MH_OPENAI_API_KEY is missing_optional
- READ and WRITE keys are currently identical; separate them for production.

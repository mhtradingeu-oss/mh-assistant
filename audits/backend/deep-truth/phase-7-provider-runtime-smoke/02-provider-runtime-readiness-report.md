# Phase 7 — Provider Runtime Readiness Scanner

Generated: 2026-06-05T16:15:02
Branch: architecture/frontend-consolidation-v1
HEAD: 5077aa2

## Security
- No raw secret values are printed or stored.
- Report includes presence, length, and sha256 fingerprints only.
- Optional providers can remain disabled without blocking backend core readiness.

## Provider Status

| Provider | Status | Enabled detected | Required | Present env count | Missing env count | Smoke test |
|---|---|---:|---:|---:|---:|---|
| `core` | `ready_for_smoke` | true | true | 2 | 0 | health, readyz, protected read endpoints |
| `integration_encryption` | `ready_for_smoke` | true | true | 0 | 1 | token manager key availability |
| `openai` | `ready_for_smoke` | true | true | 2 | 0 | minimal provider auth/model check or app AI route |
| `woocommerce` | `disabled_or_missing_optional` | false | false | 0 | 3 | system status/products count read |
| `wordpress` | `disabled_or_missing_optional` | false | false | 0 | 3 | REST auth/user or posts endpoint |
| `email_bridge` | `disabled_or_missing_optional` | false | false | 0 | 2 | bridge health/auth check |
| `google` | `disabled_or_missing_optional` | false | false | 0 | 3 | account/property validation |
| `meta` | `disabled_or_missing_optional` | false | false | 0 | 1 | page/business/ad account validation |
| `tiktok` | `disabled_or_missing_optional` | false | false | 0 | 1 | account/advertiser validation |
| `slack` | `disabled_or_missing_optional` | false | false | 0 | 1 | auth.test or bot identity |
| `telegram` | `disabled_or_missing_optional` | false | false | 0 | 1 | getMe |
| `shopify` | `disabled_or_missing_optional` | false | false | 0 | 2 | shop identity query |
| `ebay` | `disabled_or_missing_optional` | false | false | 0 | 2 | account privilege endpoint |
| `notion` | `disabled_or_missing_optional` | false | false | 0 | 1 | workspace/user validation |
| `mailchimp` | `disabled_or_missing_optional` | false | false | 0 | 3 | account/audience validation |

## Details

### core

- Decision: required
- Status: `ready_for_smoke`
- Enabled detected: `true`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `MH_CONTROL_CENTER_READ_KEY` | `present` | 50 | yes |
| `MH_CONTROL_CENTER_WRITE_KEY` | `present` | 50 | yes |

### integration_encryption

- Decision: required for saved encrypted integration credentials
- Status: `ready_for_smoke`
- Enabled detected: `true`
- Fallback file: `data/system/integration-secret.key.json`
- Fallback exists: `true`
- Fallback size bytes: `273`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `MH_INTEGRATION_SECRET_KEY` | `missing` | 0 | no |

### openai

- Decision: required if AI enabled
- Status: `ready_for_smoke`
- Enabled detected: `true`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `OPENAI_API_KEY` | `present` | 164 | yes |
| `MH_OPENAI_API_KEY` | `present` | 164 | yes |

### woocommerce

- Decision: enable if ecommerce sync is required
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `WC_BASE_URL` | `missing` | 0 | no |
| `WC_KEY` | `missing` | 0 | no |
| `WC_SECRET` | `missing` | 0 | no |

### wordpress

- Decision: enable if publishing to WordPress is required
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `WP_BASE_URL` | `missing` | 0 | no |
| `WP_USER` | `missing` | 0 | no |
| `WP_APP_PASSWORD` | `missing` | 0 | no |

### email_bridge

- Decision: enable if email send is required
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `MH_EMAIL_BRIDGE_URL` | `missing` | 0 | no |
| `MH_EMAIL_BRIDGE_TOKEN` | `missing` | 0 | no |

### google

- Decision: optional unless Google/YouTube/Ads enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `GOOGLE_ACCESS_TOKEN` | `missing` | 0 | no |
| `GOOGLE_REFRESH_TOKEN` | `missing` | 0 | no |
| `GOOGLE_DEVELOPER_TOKEN` | `missing` | 0 | no |

### meta

- Decision: optional unless Meta channels enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `META_ACCESS_TOKEN` | `missing` | 0 | no |

### tiktok

- Decision: optional unless TikTok enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `TIKTOK_ACCESS_TOKEN` | `missing` | 0 | no |

### slack

- Decision: optional unless Slack notifications enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `SLACK_BOT_TOKEN` | `missing` | 0 | no |

### telegram

- Decision: optional unless Telegram enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `TELEGRAM_BOT_TOKEN` | `missing` | 0 | no |

### shopify

- Decision: optional unless Shopify enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `SHOPIFY_STORE_DOMAIN` | `missing` | 0 | no |
| `SHOPIFY_ADMIN_TOKEN` | `missing` | 0 | no |

### ebay

- Decision: optional unless eBay enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `EBAY_ACCESS_TOKEN` | `missing` | 0 | no |
| `EBAY_SELLER_ID` | `missing` | 0 | no |

### notion

- Decision: optional unless Notion enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `NOTION_ACCESS_TOKEN` | `missing` | 0 | no |

### mailchimp

- Decision: optional unless Mailchimp-like provider enabled
- Status: `disabled_or_missing_optional`
- Enabled detected: `false`

| Env key | Status | Length | SHA256 stored? |
|---|---|---:|---:|
| `MAILCHIMP_API_KEY` | `missing` | 0 | no |
| `MAILCHIMP_SERVER_PREFIX` | `missing` | 0 | no |
| `MAILCHIMP_AUDIENCE_ID` | `missing` | 0 | no |

## Decision

Status: CORE PROVIDER READINESS PASSED. Optional providers must be explicitly enabled or marked disabled before go-live.

- Ready for smoke providers: core, integration_encryption, openai
- Optional disabled/missing providers: woocommerce, wordpress, email_bridge, google, meta, tiktok, slack, telegram, shopify, ebay, notion, mailchimp
- Blockers: none

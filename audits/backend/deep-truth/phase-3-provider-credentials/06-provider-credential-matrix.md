# Phase 3 — Provider Credential Matrix

## Status
Discovery completed.

## Security
- This matrix records credential names only.
- No raw secret values are stored.
- Local `.env.local` must remain ignored by Git.
- `data/system/integration-secret.key.json` exists and is a secret encryption key file. Do not commit it.
- Any key previously pasted into chat must be rotated before production.

## Core Runtime Environment

| Area | Env / File | Purpose | Required for go-live | Notes |
|---|---|---:|---:|---|
| Control API | `MH_CONTROL_CENTER_READ_KEY` | Protected read access | Yes | Use separate value from write key in production |
| Control API | `MH_CONTROL_CENTER_WRITE_KEY` | Protected write/mutation access | Yes | Rotate before production |
| Legacy/compat | `MH_CONTROL_KEY` | Possible compatibility control key | Review | Confirm whether still used |
| Integration encryption | `MH_INTEGRATION_SECRET_KEY` | Encrypt/decrypt provider credentials | Yes | Must be base64 32-byte key if env-based |
| Integration encryption | `data/system/integration-secret.key.json` | Host fallback encryption key | Yes if env missing | Keep stable if preserving old encrypted credentials |
| Runtime root | `MH_ASSISTANT_ROOT` | Data/system root resolution | Optional | Useful in production |
| Server | `PORT` | Service port | Yes | Usually 3000 or production port |
| Runtime | `NODE_ENV` | Runtime mode | Yes | production/staging/local |

## AI / Media Runtime

| Area | Env / Credential | Purpose | Required for go-live | Notes |
|---|---|---:|---:|---|
| OpenAI | `OPENAI_API_KEY` | OpenAI API calls | Yes if OpenAI enabled | External provider key |
| OpenAI | `MH_OPENAI_API_KEY` | MH-specific OpenAI key alias | Review | Confirm preferred env name |
| Native Media | `MH_NATIVE_MEDIA_DEFAULT_PROVIDER` | Select default media provider | Optional | Depends on media stack |
| GPU Worker | `NATIVE_MEDIA_GPU_WORKER_URL` | Remote GPU worker endpoint | Optional | Required only if worker enabled |
| GPU Worker | `NATIVE_MEDIA_GPU_WORKER_KEY` | Worker auth key | Optional | Secret |
| GPU Worker | `NATIVE_MEDIA_GPU_WORKER_TIMEOUT_MS` | Worker timeout | Optional | Config only |

## WordPress / WooCommerce Runtime

| Area | Env / Credential | Purpose | Required for go-live | Notes |
|---|---|---:|---:|---|
| WordPress | `WP_BASE_URL` | WordPress base URL | If WP enabled | External site URL |
| WordPress | `WP_USER` | WordPress username | If WP enabled | Not SSH password |
| WordPress | `WP_APP_PASSWORD` | WordPress application password | If WP enabled | App password from WordPress user profile |
| WooCommerce | `WC_BASE_URL` | WooCommerce base/store URL | If WooCommerce enabled | May map to provider `storeUrl` |
| WooCommerce | `WC_KEY` | WooCommerce consumer key | If WooCommerce enabled | External provider key |
| WooCommerce | `WC_SECRET` | WooCommerce consumer secret | If WooCommerce enabled | External provider secret |

## Email Bridge

| Area | Env / Credential | Purpose | Required for go-live | Notes |
|---|---|---:|---:|---|
| Email bridge | `MH_EMAIL_BRIDGE_URL` | Email bridge endpoint | If email bridge enabled | External/internal bridge URL |
| Email bridge | `MH_EMAIL_BRIDGE_TOKEN` | Email bridge auth token | If email bridge enabled | Secret |

## Integration Providers

| Provider | Required config | Required credentials | Source of credential | Go-live status |
|---|---|---|---|---|
| Website | `url` | none detected | Website URL | Required if website integration enabled |
| WooCommerce | `storeUrl` | `consumerKey`, `consumerSecret` | WooCommerce REST API keys | Required if ecommerce enabled |
| Shopify | `storeDomain` | `adminToken` | Shopify Admin API token | Optional unless Shopify enabled |
| eBay | `sellerId` optional | `accessToken` | eBay OAuth token | Optional unless eBay enabled |
| Google Analytics | `propertyId`, optional `measurementId` | `accessToken` | Google OAuth | Required if GA enabled |
| Google Search Console | `propertyUrl` / `siteDomain` | `accessToken` | Google OAuth | Required if GSC enabled |
| YouTube | `channelId` / `channelUrl` | `accessToken` | Google OAuth | Required if YouTube enabled |
| Google Ads | `customerId`, optional `managerId`, `developerToken` | `accessToken` or `refreshToken`, `developerToken` | Google Ads OAuth + developer token | Required if Ads enabled |
| Google Drive | `folderId` | `accessToken` | Google OAuth | Optional unless Drive enabled |
| Google Tag Manager | `containerId` | `accessToken` | Google OAuth | Optional unless GTM enabled |
| Meta Facebook Page | `pageId` / `pageUrl` | `accessToken` | Meta Graph API token | Required if Facebook enabled |
| Meta Instagram | `businessAccountId` / `profileUrl` | `accessToken` | Meta Graph API token | Required if Instagram enabled |
| Meta Ads | `adAccountId` | `accessToken` | Meta Graph API token | Required if Ads enabled |
| Meta Pixel | `pixelId` | `accessToken` | Meta Graph API token | Optional unless Pixel enabled |
| TikTok Account | `accountId` / `profileUrl` | `accessToken` | TikTok OAuth token | Required if TikTok enabled |
| TikTok Ads | `advertiserId` | `accessToken` | TikTok Business token | Required if TikTok Ads enabled |
| TikTok Pixel | `pixelId`, optional `accountId` | `accessToken` | TikTok Business token | Optional unless Pixel enabled |
| Slack | workspace config | `botToken` | Slack app bot token | Optional unless Slack enabled |
| Telegram | bot config | `botToken` | Telegram BotFather token | Optional unless Telegram enabled |
| Notion | `workspaceName` optional | `accessToken` | Notion integration token/OAuth | Optional unless Notion enabled |
| Webhook | `endpointUrl` / `webhookUrl` | optional `accessToken` | Webhook provider | Optional |
| CRM / external API | `endpointUrl` | optional `accessToken` | External provider | Optional |
| LinkedIn | `companyUrl` optional | `accessToken` | LinkedIn OAuth | Optional unless LinkedIn enabled |
| Mailchimp-like email provider | `audienceId` optional, `serverPrefix` optional | `apiKey` | Provider API key | Optional unless enabled |

## Go-live Credential Decision

### Can generate new locally
- `MH_CONTROL_CENTER_READ_KEY`
- `MH_CONTROL_CENTER_WRITE_KEY`
- `MH_EMAIL_BRIDGE_TOKEN`
- Internal worker keys
- `MH_INTEGRATION_SECRET_KEY` only if you are willing to reconnect/re-enter encrypted provider credentials

### Should preserve from old server if keeping old integrations
- `data/system/integration-secret.key.json`
- `MH_INTEGRATION_SECRET_KEY`
- Any encrypted credentials that depend on the same encryption key

### Must be obtained from external provider dashboards
- OpenAI API key
- WooCommerce keys
- WordPress app password
- Google OAuth tokens/developer token
- Meta access token
- TikTok access token
- Slack bot token
- Telegram bot token
- Shopify admin token
- eBay OAuth token
- Notion token
- Mailchimp/API provider key

## Production Security Requirements
1. Use different READ and WRITE keys in production.
2. Rotate any key that was pasted into chat.
3. Keep `.env.local`, `.env.production`, and all key files out of Git.
4. Store production secrets in a password manager or server secret manager.
5. Preserve integration encryption key if you need to read old encrypted provider credentials.
6. Reconnect providers if encryption key changes.
7. Do not use SSH/server password as any application key.
8. Do not use user login password as API key.
9. WordPress app password is only for WordPress API/SMTP-style access, not server login.

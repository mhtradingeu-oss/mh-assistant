# Phase 4 — Go-Live Credential Checklist

## Status
Template created and checked for raw secret leakage.

## Security Rules
- Do not commit `.env`, `.env.local`, `.env.production`, or real key files.
- `.env.example` and `required-env-template.example` must contain placeholders only.
- Rotate every key that was pasted into chat before production.
- Store real production secrets in a password manager or server secret manager.
- Do not use SSH/server password as an application API key.
- Do not use normal user login password as an API key.

## Internal Keys You Can Generate

| Key | How to create | Notes |
|---|---|---|
| `MH_CONTROL_CENTER_READ_KEY` | `openssl rand -hex 32` | Use for protected read routes |
| `MH_CONTROL_CENTER_WRITE_KEY` | `openssl rand -hex 32` | Use for protected write/mutation routes |
| `MH_EMAIL_BRIDGE_TOKEN` | `openssl rand -hex 32` | Only if email bridge is enabled |
| `NATIVE_MEDIA_GPU_WORKER_KEY` | `openssl rand -hex 32` | Only if GPU worker is enabled |
| `MH_INTEGRATION_SECRET_KEY` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` | Preserve old value if keeping old encrypted integration credentials |

## Keys You Should Preserve From Old Server If Keeping Old Integrations

| Key / File | Why |
|---|---|
| `data/system/integration-secret.key.json` | Decrypts saved integration credentials if env key is missing |
| `MH_INTEGRATION_SECRET_KEY` | Decrypts saved integration credentials if env key is used |
| Existing encrypted integration records | They depend on the same encryption key |

## External Provider Credentials

| Provider | Where to get it | Needed values |
|---|---|---|
| OpenAI | OpenAI dashboard | `OPENAI_API_KEY`, optionally `MH_OPENAI_API_KEY` |
| WordPress | WordPress user profile | `WP_BASE_URL`, `WP_USER`, `WP_APP_PASSWORD` |
| WooCommerce | WooCommerce REST API settings | `WC_BASE_URL`, `WC_KEY`, `WC_SECRET` |
| Google / YouTube / Ads | Google Cloud / OAuth / Google Ads | access token, refresh token, developer token, property/channel/customer IDs |
| Meta / Facebook / Instagram | Meta Developers / Business Manager | access token, page ID, business account ID, ad account ID, pixel ID |
| TikTok | TikTok Developers / Business Center | access token, account ID, advertiser ID, pixel ID |
| Slack | Slack app dashboard | bot token |
| Telegram | BotFather | bot token |
| Shopify | Shopify admin / custom app | store domain, admin token |
| eBay | eBay developer account | OAuth access token, seller ID |
| Notion | Notion integration settings | access token, workspace name |
| Mailchimp-like provider | Provider dashboard | API key, server prefix, audience ID |

## Final Go-Live Checklist

- [ ] `.env.example` contains placeholders only.
- [ ] `required-env-template.example` contains placeholders only.
- [ ] `.env.local` is ignored and not committed.
- [ ] `.env.production` is ignored and not committed.
- [ ] READ and WRITE keys are different in production.
- [ ] Previously exposed control keys are rotated.
- [ ] Integration encryption key decision is documented: preserve old or reconnect providers.
- [ ] OpenAI key is valid.
- [ ] WooCommerce keys are valid.
- [ ] WordPress app password is valid.
- [ ] Social provider tokens are valid or marked not enabled.
- [ ] Email bridge is configured or marked not enabled.
- [ ] Production server loads env before starting the service.
- [ ] `/health` passes.
- [ ] `/readyz` passes.
- [ ] Protected read smoke passes.
- [ ] Critical provider tests pass.

````md
# Phase 6 — Production Go-Live Secret Plan

## Status

Planning phase.

## Purpose

Define the final production secret strategy for MH Assistant / MH-OS go-live without storing or exposing raw secret values in Git, audit files, or chat.

## Current Confirmed Facts

- Backend protected read smoke passed in Phase 2.
- Provider credential requirements were mapped in Phase 3.
- `.env.example` and the required env template were updated in Phase 4.
- Local provider readiness was checked in Phase 5.
- `.env.local` exists locally and is not committed.
- `data/system/integration-secret.key.json` exists locally and can act as the fallback integration encryption key.
- `OPENAI_API_KEY` is present locally.
- `MH_CONTROL_CENTER_READ_KEY` and `MH_CONTROL_CENTER_WRITE_KEY` are present locally.
- Local READ and WRITE keys are currently identical and must be separated for production.

## Secret Categories

### A. Generate New For Production

These can be safely generated fresh for production.

| Secret | Production decision |
|---|---|
| `MH_CONTROL_CENTER_READ_KEY` | Generate a new random value |
| `MH_CONTROL_CENTER_WRITE_KEY` | Generate a new random value different from READ |
| `MH_EMAIL_BRIDGE_TOKEN` | Generate only if email bridge is enabled |
| `NATIVE_MEDIA_GPU_WORKER_KEY` | Generate only if GPU worker is enabled |
| Worker/internal service tokens | Generate per service |

Recommended generation command:

```bash
openssl rand -hex 32
````

### B. Preserve From Old Server If Keeping Existing Encrypted Integrations

These must remain stable if old encrypted provider credentials should keep working.

| Secret/File                               | Production decision                                              |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `data/system/integration-secret.key.json` | Preserve/copy securely if keeping old encrypted credentials      |
| `MH_INTEGRATION_SECRET_KEY`               | Preserve if the old server used env-based integration encryption |
| Existing encrypted integration records    | Preserve with the matching encryption key                        |

Decision rule:

* Preserve the old integration encryption key if existing provider credentials should remain readable.
* Generate a new integration encryption key only if providers will be reconnected or credentials will be re-entered.

### C. Get From Provider Dashboards

These cannot be generated locally as random strings. They must come from external provider accounts.

| Provider                    | Required secret source                                   |
| --------------------------- | -------------------------------------------------------- |
| OpenAI                      | OpenAI dashboard API key                                 |
| WordPress                   | WordPress user application password                      |
| WooCommerce                 | WooCommerce REST API consumer key/secret                 |
| Google / YouTube / Ads      | Google OAuth / Google Cloud / Google Ads developer token |
| Meta / Facebook / Instagram | Meta Business / Developer access token                   |
| TikTok                      | TikTok Developer / Business Center access token          |
| Slack                       | Slack app bot token                                      |
| Telegram                    | BotFather bot token                                      |
| Shopify                     | Shopify custom app admin token                           |
| eBay                        | eBay OAuth token                                         |
| Notion                      | Notion integration token                                 |
| Mailchimp-like provider     | Provider API key                                         |

## Production Environment Minimum

Required for basic backend production start:

```env
PORT=3000
NODE_ENV=production
MH_CONTROL_CENTER_READ_KEY=<new-production-read-key>
MH_CONTROL_CENTER_WRITE_KEY=<new-production-write-key>
OPENAI_API_KEY=<provider-key>
```

Required for integration credential continuity if using env-based encryption:

```env
MH_INTEGRATION_SECRET_KEY=<existing-base64-32-byte-key>
```

Or securely preserve this file if using file-based encryption:

```text
data/system/integration-secret.key.json
```

## Production Readiness Gates

Before declaring backend production-ready:

* [ ] Production `.env` or secret manager contains READ key.
* [ ] Production `.env` or secret manager contains WRITE key.
* [ ] READ and WRITE keys are different.
* [ ] Previously exposed local/chat keys are rotated.
* [ ] OpenAI key is valid.
* [ ] Integration encryption key decision is finalized.
* [ ] WooCommerce is either configured and tested or marked disabled.
* [ ] WordPress publishing is either configured and tested or marked disabled.
* [ ] Social providers are either configured and tested or marked disabled.
* [ ] Email bridge is either configured and tested or marked disabled.
* [ ] Production server starts with environment loaded.
* [ ] `/health` returns OK.
* [ ] `/readyz` returns ready.
* [ ] Protected read smoke passes in production or staging.
* [ ] Critical provider connect/test checks pass.
* [ ] No raw secrets are committed to Git.

## Important Clarifications

* SSH/server password is not an application API key.
* Normal user login password is not an application API key.
* WordPress application password is only for WordPress REST API access.
* WooCommerce consumer key/secret are generated in WooCommerce REST API settings.
* OpenAI, Meta, TikTok, and Google tokens must come from their provider dashboards.
* Local random strings only work for internal MH control/API keys, not external provider credentials.

## Final Decision

Production go-live should not proceed until:

1. Required internal production keys are regenerated.
2. READ and WRITE control keys are separated.
3. Previously exposed local/chat keys are rotated.
4. External provider credentials are collected from official provider dashboards.
5. Integration encryption continuity is decided.
6. Provider checks pass in staging or production.
7. No raw secrets are committed to Git.

```
```

# Phase 7 — Provider Runtime Smoke Plan

## Status

Planning phase.

## Purpose

Define safe runtime smoke tests for production/staging provider readiness without printing or storing raw secret values.

## Baseline

- Phase 2 protected read smoke passed.
- Phase 3 provider credential matrix completed.
- Phase 4 go-live env template completed.
- Phase 5 provider readiness check completed.
- Phase 6 production secret plan completed.

## Smoke Test Rules

- Never print raw secret values.
- Never commit `.env.local`, `.env.production`, `.env`, or provider key files.
- Test only providers marked enabled.
- Optional providers can be marked disabled without blocking backend core readiness.
- Provider tests must report only:
  - present/missing
  - HTTP status
  - provider health state
  - sanitized account/store/project identifiers
  - error class, not secret value
- Any token pasted into chat must be rotated before production.

## Core Runtime Smoke Tests

| Area | Test | Required | Expected result |
|---|---|---:|---|
| Health | `GET /health` | Yes | `status: ok` |
| Readiness | `GET /readyz` | Yes | `ready: true` |
| Protected read | task/operations endpoints | Yes | HTTP 200 + valid JSON |
| Control write | approved safe write route only | Later | Requires governance-aware safe mutation |
| Integration encryption | token manager readiness | Yes | env key or fallback file present |

## Provider Runtime Smoke Matrix

| Provider | Required env / credentials | Smoke test | Go-live gate |
|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` or `MH_OPENAI_API_KEY` | Minimal model/auth check or configured AI route | Required if AI enabled |
| WooCommerce | `WC_BASE_URL`, `WC_KEY`, `WC_SECRET` or integration record credentials | Read system/status or products count | Required if ecommerce enabled |
| WordPress | `WP_BASE_URL`, `WP_USER`, `WP_APP_PASSWORD` | REST auth/user or posts endpoint | Required if publishing enabled |
| Email Bridge | `MH_EMAIL_BRIDGE_URL`, `MH_EMAIL_BRIDGE_TOKEN` | Bridge health/auth check | Required if email send enabled |
| Google | OAuth credentials / integration record | Account/property validation | Optional unless enabled |
| Meta | access token / integration record | Page/account validation | Optional unless enabled |
| TikTok | access token / integration record | Account/advertiser validation | Optional unless enabled |
| Slack | bot token / integration record | auth.test or bot identity | Optional unless enabled |
| Telegram | bot token / integration record | getMe | Optional unless enabled |
| Shopify | admin token / integration record | shop identity query | Optional unless enabled |
| eBay | OAuth token / integration record | privilege/account endpoint | Optional unless enabled |
| Notion | access token / integration record | bot/user/workspace validation | Optional unless enabled |

## Current Local Decision From Phase 5

- Core control keys: present.
- OpenAI key: present.
- Integration fallback file: present.
- WooCommerce env: missing locally.
- WordPress env: missing locally.
- Social provider env values: missing locally.
- Email bridge env: missing locally.
- READ and WRITE keys are identical locally and must be separated in production.

## Required Next Evidence

1. Runtime provider readiness scanner.
2. Sanitized provider availability report.
3. Enabled/disabled provider decision file.
4. Final backend closeout decision.

## Decision

Backend core can continue as verified locally. Provider go-live readiness requires provider-specific runtime smoke tests after production/staging secrets are loaded.

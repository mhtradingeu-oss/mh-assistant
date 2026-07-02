# Ads Manager Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Ads Manager route authority only

## Summary

Ads Manager is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `adsManagerRoute`.

## Why

Ads Manager owns a complete ad-ops workspace:

- adsManagerRoot
- ads-manager-wrapper
- ads-manager-layout
- ads-manager-main
- ads-manager-side
- budget and pacing panels
- platform readiness cards
- creative mapping cards
- AI prompt actions

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/ads-manager.js
- audits/frontend/layout-authority/ADS_MANAGER_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: ads-manager
- data-page="ads-manager"
- adsManagerRoot
- ads-manager-wrapper
- budget / pacing calculations
- platform readiness scoring
- creative mapping
- data-ads-prompt
- AI Command navigation
- Publishing navigation
- Library navigation

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.

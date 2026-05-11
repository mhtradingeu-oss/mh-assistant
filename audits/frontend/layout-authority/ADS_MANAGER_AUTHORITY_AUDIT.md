# Ads Manager Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Ads Manager is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local ad-ops workspace.

Confirmed local surface signals:

- adsManagerRoot
- ads-manager-wrapper
- ads-manager-hero
- ads-manager-layout
- ads-manager-main
- ads-manager-side
- ads-platform-grid
- ads-creative-list
- ads-pacing-grid
- ads-prompt-list

Confirmed behavior complexity:

- budget planning
- daily budget calculation
- spend / pacing status
- platform readiness scoring
- creative mapping
- platform blocker detection
- AI prompt generation
- navigation to AI Command
- navigation to Publishing
- navigation to Library
- data-ads-* action attributes

## Current issue

Ads Manager is currently both:

1. A Page Standard route
2. A full custom ad-ops operating surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Ads Manager should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `adsManagerRoute`

## Non-goals

Do not change:

- route id
- data-page
- budget / pacing behavior
- platform readiness behavior
- creative mapping behavior
- AI prompt behavior
- navigation behavior
- data-ads-* attributes
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- platform readiness scoring
- creative mapping
- budget and pacing summaries
- data-ads-prompt
- navigation to ai-command
- navigation to publishing
- navigation to library
- all ad-op cards and prompt surfaces

## Recommended next patch

Ads Manager Authority Patch:

- add `disableStandardLayout: true` to `adsManagerRoute`
- no CSS edits
- no behavior edits
- validate JS and data/projects

## No-change confirmation

This audit is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.

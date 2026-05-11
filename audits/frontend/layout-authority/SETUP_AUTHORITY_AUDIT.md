# Setup Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Setup is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local setup wizard and source-of-truth workspace.

Confirmed local surface signals:

- setupRoot
- setup-wizard-shell
- setup-wizard-layout
- setup-wizard-sidebar
- setup-wizard-form
- setup-wizard-side-panels
- setup-smart-overview
- setup-smart-steps-panel
- setup-smart-form-panel
- setup-smart-gaps-panel
- setup-smart-validation-panel
- setup-smart-handoff-panel

Confirmed behavior complexity:

- multi-step wizard navigation
- setup step activation
- setup field validation
- required field gap tracking
- local draft persistence
- saveProjectSetup
- business template application
- AI helper actions
- navigation to AI Command
- navigation to Library
- navigation to Integrations
- navigation to Home
- data-setup-* action attributes

## Current issue

Setup is currently both:

1. A Page Standard route
2. A full custom setup wizard operating surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Setup should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `setupRoute`

## Non-goals

Do not change:

- route id
- data-page
- setup wizard behavior
- saveProjectSetup behavior
- draft persistence
- template application
- AI helper behavior
- step navigation
- field validation
- data-setup-* attributes
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- saveProjectSetup
- setup draft persistence
- setup step navigation
- setup required field checks
- setup smart gap actions
- setup AI helper actions
- setup template application
- navigation to ai-command
- navigation to library
- navigation to integrations
- navigation to home
- all data-setup-* attributes

## Recommended next patch

Setup Authority Patch:

- add `disableStandardLayout: true` to `setupRoute`
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

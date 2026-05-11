# Studio Group Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

The Studio group pages are currently Page Standard routes, but they render full local workspace/execution surfaces.

Pages included:

- Media Studio
- Content Studio
- Campaign Studio
- Publishing

## Confirmed issue

These pages are not simple standard content pages. They contain local roots, local workspace layouts, action panels, AI handoffs, publishing/scheduling/approval actions, and page-specific execution flows.

This creates layout authority ambiguity when they remain under Page Standard wrapping.

## Publishing findings

Publishing is a full execution surface.

Confirmed signals:

- `publishingRoot`
- `publishing-execution-center`
- `publishing-execution-grid`
- `publishing-main-column`
- `publishing-side-column`
- `publishing-card`
- queue actions
- schedule builder
- approval actions
- publishing automation state

Confirmed behavior:

- reschedulePublishingItem
- approvePublishingItem
- publishPublishingItem
- publishing local drafts
- publish queue filtering
- schedule / publish / retry / pause actions
- AI Command handoff
- automation prepare / stop / approve / skip

Target model:

- Custom Surface Model

Recommended next patch:

- add `disableStandardLayout: true` to `publishingRoute`

## Content Studio findings

Content Studio is a full content production workspace.

Confirmed behavior signals:

- content item selection
- version actions
- content approval
- send to AI
- send to Media Studio
- send to Publishing
- content record persistence
- data-content-* action attributes

Target model:

- Custom Surface Model candidate

Recommended patch:

- after Publishing, audit/patch Content Studio route authority.

## Campaign Studio findings

Campaign Studio is a full campaign operating workspace.

Confirmed behavior signals:

- campaign persistence
- campaign handoff routing
- downstream navigation to Publishing, Content Studio, Media Studio, Ads Manager
- campaign readiness and blockers
- route handoff creation
- saveProjectCampaign

Target model:

- Custom Surface Model candidate

Recommended patch:

- after Content/Media, audit/patch Campaign Studio route authority.

## Media Studio findings

Media Studio is a full media production workspace.

Confirmed behavior signals:

- media job actions
- media queue selection
- version actions
- specialist actions
- send to Publishing
- save to Library
- data-media-* action attributes

Target model:

- Custom Surface Model candidate

Recommended patch:

- after Publishing/Content, audit/patch Media Studio route authority.

## Recommended patch order

1. Publishing Authority Patch
2. Content Studio Authority Patch
3. Media Studio Authority Patch
4. Campaign Studio Authority Patch

Patch one page at a time.

## Non-goals

Do not change:

- route ids
- data-page values
- API wrappers
- backend behavior
- data/projects
- action data attributes
- persistence behavior
- publishing/scheduling/approval behavior
- handoff behavior
- CSS in authority-only steps

## Safety rules

- One route, one layout authority.
- Add `disableStandardLayout: true` only after the route is documented as Custom Surface Model.
- No CSS edits during authority patches.
- Validate JS after every page.
- Commit one page at a time.

## No-change confirmation

This audit is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.

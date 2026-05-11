# Home + Library Transition QA Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## 1. Executive Summary

Home and Library are both included in Page Standard REQUIRED_ROUTES, but both pages perform local/custom rendering before Page Standard wrapping.

This is not automatically a defect, but it creates a transition risk:

- local page render may create its own visual shell
- page-standard.js then wraps or normalizes the route into std-page-shell
- loading/loaded transitions can produce duplicate headers, visual shift, or nested shell feel

## 2. Home Findings

Home route template:

- data-page="home"
- root mount: homeExecRoot

Home render behavior:

- home.js renders into homeExecRoot
- home.js uses root.innerHTML for custom dashboard content
- page-standard.js applies standard layout afterward because home is in REQUIRED_ROUTES

Risk:

- medium visual transition risk
- verify loading/loaded/empty/error behavior
- verify no duplicate header or command-center feeling

## 3. Library Findings

Library route template:

- data-page="library"
- root mount: libraryRoot

Library render behavior:

- library.js renders into libraryRoot
- library.js creates local library-smart-shell
- library.js has many rerender paths:
  - filtering
  - folder selection
  - preview
  - upload
  - refresh scan
  - action panel
  - AI panel

Risk:

- medium-high visual transition risk
- library-smart-shell may behave as a local shell inside std-page-shell
- verify loading/loaded/empty/error/uploading states
- verify no duplicate header/action/AI panel surfaces

## 4. Page Standard Relationship

page-standard.js includes both routes:

- home
- library

page-standard.js owns:

- std-page-shell
- std-main-content-slot
- std-context-ribbon
- std-smart-strip

Therefore Home and Library should be tested as standard-wrapped custom-render pages.

## 5. Required Visual QA Checklist

### Home

Check:

- first load
- refresh
- no project selected state
- project loaded state
- dashboard empty state
- dashboard populated state
- AI/team cards visible
- no duplicate top header
- no duplicate command center
- no large vertical blank spaces

### Library

Check:

- first load
- empty library
- populated library
- asset selected
- no asset selected
- upload panel
- uploading state
- refresh scan
- preview fallback
- action panel
- AI panel
- no duplicate top header
- no duplicate action surfaces
- no nested shell feeling

## 6. Decision

No runtime patch should be applied yet.

Next step:

- run browser/manual QA or screenshot QA
- if visual duplication exists, patch Home and Library separately
- prioritize Library first if both have issues

## 7. No-Change Confirmation

This audit is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.

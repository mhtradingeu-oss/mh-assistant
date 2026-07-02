# T153B — Operations CSS-only UX Polish Target Plan

## Status
Plan only. No implementation yet.

## Baseline
- 9ca1403 Verify Operations markup normalization

## Scope
Choose the smallest safe CSS-only Operations UX polish target before implementation.

## Allowed File
Future implementation may touch only:

- `public/control-center/styles/09-operations-centers.css`

## Forbidden Files
Do not touch:

- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/pages/operations-centers.js`
- backend files
- route files
- API files
- data/projects files

## Runtime Constraints
No behavior change.
No action behavior change.
No mutation behavior change.
No provider execution change.
No AI execution change.
No backend/API/route change.

## Candidate Polish Areas
The safest CSS-only targets are:

1. Right rail spacing and panel rhythm
   - `.ops-right-rail`
   - `.ops-action-panel`
   - `.ops-ai-panel`

2. Disabled mutation button clarity
   - `.ops-deferred-action`

3. Panel copy readability
   - `.mhos-os-panel-copy`

4. Toolbar density and responsive spacing
   - `.ops-toolbar`

5. Table/empty-state readability
   - `.ops-table`
   - `.empty-box`

## Recommended First Patch
Start with the smallest visible and safest target:

### T153C — Right Rail + Disabled Action Clarity Polish

Allowed selectors:
- `.ops-right-rail .ops-deferred-list`
- `.ops-right-rail .ops-deferred-action`
- `.ops-right-rail .mhos-os-panel-copy`
- existing page-scoped Operations selectors only

Purpose:
- Improve readability of Action Panel and AI Panel.
- Make disabled mutation controls visibly disabled and clearly non-executable.
- Improve right-rail rhythm without changing layout ownership.

## Browser QA Required After Patch
Verify:
- `#operations-centers`
- `#task-center`
- `#queue-center`
- `#job-monitor`
- `#notification-center`

Checks:
- No crash.
- No console syntax error.
- Right rail remains visible.
- Action Panel remains visible.
- AI Panel remains visible.
- Disabled actions remain disabled.
- No action label implies execution.
- Tables and main content remain readable.
- No mobile/responsive layout break.

# Final Page Upgrade Roadmap

## Status
Planning checkpoint before page upgrade implementation.

## Branch
architecture/frontend-consolidation-v1

## Baseline
2cb5f51 Add Control Center legacy asset guard

## Goal
Upgrade Control Center pages into consistent AI Business Operating System surfaces using:
- Header
- Main View
- Action Panel
- AI Panel

## Doctrine
- Audit → Confirm → Decide → Implement.
- Backend owns operational authority.
- Frontend projects operational authority.
- No heavy intelligence in render.
- No Auto Mode start from render/mount.
- No legacy CSS/JS relink.
- One page at a time.
- Small commits with browser QA.

## Completed foundations
- Operations loading/refreshing fixed.
- Route-role fallback authority centralized.
- Publishing runtime ownership audited.
- Publishing shadow-compare contract created.
- Workflows runtime ownership audited.
- Workflows behavior contract created.
- Auto Mode lifecycle audited and contracted.
- Publishing pure helper extraction step 1 completed.
- CSS legacy cleanup planning completed.
- Legacy asset accidental-load guard added.

## Upgrade order

### 1. Library
Purpose:
- First operating-surface pilot.
- Convert asset management into Main View + Action Panel + AI Panel.
- Keep upload/preview/source-of-truth behavior intact.

Allowed:
- UX/layout improvements.
- Small helper/module extraction.
- Action/AI panel skeleton integration if safe.

Not allowed:
- Backend changes.
- Destructive action redesign.
- Asset mutation behavior changes without audit.

### 2. AI Command
Purpose:
- Turn AI Workspace from prompt shell into clearer operating room.
- Must preserve backend projection doctrine.

Requires:
- AI Command authority audit before implementation.

### 3. Integrations
Purpose:
- Continue modular architecture already started.
- Improve connector operating surface.

Allowed:
- UX polish and controlled module extraction.

### 4. Media Studio
Purpose:
- Reduce largest page risk.
- Use extraction-readiness audit before code changes.

### 5. Content Studio
Purpose:
- Improve production workspace.
- Audit first due large file size.

### 6. Campaign Studio
Purpose:
- Improve campaign planning and readiness workflow.
- Avoid runtime execution changes.

### 7. Publishing
Purpose:
- Continue pure-helper extraction only.
- No publish/approve/fail redesign until deeper shadow-compare implementation exists.

### 8. Workflows
Purpose:
- Keep active light route unless explicit decision changes it.
- Do not reactivate legacy heavy loop.

### 9. Governance / Settings
Purpose:
- Polish clean standalone surfaces.
- Avoid authority changes.

### 10. Operations Centers
Purpose:
- Polish only after already-stable scaffold.
- Preserve ops-shell custom ownership.

## First implementation target
Library Page Upgrade Pilot.

## Library pilot success criteria
- Page loads without console errors.
- Existing upload behavior preserved.
- Existing preview behavior preserved.
- Source-of-truth marker behavior preserved.
- No backend changes.
- No data/project mutations beyond normal user actions.
- No legacy CSS/JS relink.
- Browser QA passed.

## Next step
Run Library Page Upgrade Pilot Audit before implementation.

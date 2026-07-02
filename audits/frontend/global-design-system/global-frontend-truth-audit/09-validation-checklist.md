# 09 Validation Checklist

## Required Syntax Validation For This Audit

Run:

```bash
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/pages/library.js
git status --short
```

Expected:

- Node syntax checks pass.
- Git status shows only this audit folder as uncommitted documentation changes.

## General Patch Validation

For every future patch:

```bash
git status --short
git diff --stat
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
```

Add page-specific `node --check` for any touched page JS file.

## Browser QA Baseline

Validate at minimum:

- Home
- Setup
- Library
- Integrations
- AI Command
- Workflows
- Publishing
- Insights
- Campaign Studio
- Content Studio
- Media Studio
- Ads Manager
- Research
- Customer Center
- Operations Overview
- Task Center
- Queue Center
- Job Monitor
- Notifications
- Governance
- Settings

## Global Browser QA Checklist

- App starts without fatal panel.
- Loading overlay clears.
- Sidebar renders.
- Sidebar mobile toggle works.
- Active navigation updates on every route.
- Topbar eyebrow/title updates on every route.
- Project switcher remains usable.
- Command bar opens/closes.
- Quick command still routes to AI behavior.
- Floating AI dock opens/closes.
- No horizontal overflow at desktop, tablet, and mobile widths.
- Text does not overlap controls.
- Buttons wrap instead of overflowing.
- Focus states remain visible.
- Console has no new runtime errors.

## Page-Specific Safety Checklist

Library:

- Upload input still opens file picker.
- Classify/review/extract controls still bind.
- Asset filters still work.
- Preview still updates.
- Source handoff to AI Command still works.

AI Command:

- Specialist selection works.
- Composer works.
- Tool Drawer opens.
- Library source selection and selected source indicator remain intact.
- No command execution behavior changes.

Integrations:

- Drawer opens.
- Connect/test/sync/import/reconnect/disconnect controls bind.
- Unsupported connectors remain labeled.
- No access-key behavior changes.

Publishing:

- Schedule/reschedule/approve/publish/fail controls remain explicit and backend-governed.
- Approval gates remain visible.

Operations:

- Task/Queue/Job/Notifications live fetch still runs when project exists.
- No silent mutation is introduced.

Governance:

- Approval decisions still require backend calls.
- Policy save confirmation remains.
- Settings sync confirmation remains.

Customer:

- Read-only state remains.
- No send/reply/ticket mutation is introduced.

## Rollback Rule

Every future patch must be revertible by reverting its touched files. Avoid cross-page CSS deletions unless selector absence and browser QA are documented.

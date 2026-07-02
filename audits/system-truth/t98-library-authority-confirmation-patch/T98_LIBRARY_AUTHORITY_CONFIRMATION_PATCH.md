# T98 — Library Authority Confirmation Patch

## Status
Patched.

## Scope
Production file changed:

- `public/control-center/pages/library.js`

## Why patch was needed
T97 confirmed that Library contains durable backend asset/source mutations.

Several high-authority paths already had confirmations:

- Reclassify asset
- Archive asset
- Delete asset
- Non-approved status changes

However, the following paths needed explicit confirmation:

- Source of Truth toggle
- Upload assets
- Refresh backend Library scan
- Approved status change

## Patch summary

### Source of Truth
Added confirmation before calling:

- `setProjectAssetSourceOfTruth`

Reason:
Source of Truth affects downstream AI context, claims, publishing readiness, and review decisions.

### Asset status
Changed status confirmation so all status changes, including `approved`, require confirmation before calling:

- `updateProjectAssetStatus`

Reason:
Approved status affects readiness and downstream review/publishing visibility.

### Upload
Added confirmation after file selection and category validation, before calling:

- `uploadProjectAsset`

Reason:
Uploaded files become part of the durable project Library.

### Refresh backend scan
Added confirmation before calling:

- `refreshProjectLibrary`

Reason:
Backend scan refresh may update Library visibility/readiness from backend state.

## Not changed
No redesign.
No backend changes.
No CSS changes.
No routing changes.
No data/projects changes.

## Validation
Use:

- `node --check public/control-center/pages/library.js`
- `node --check scripts/audit/library-runtime-authority-audit.mjs`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

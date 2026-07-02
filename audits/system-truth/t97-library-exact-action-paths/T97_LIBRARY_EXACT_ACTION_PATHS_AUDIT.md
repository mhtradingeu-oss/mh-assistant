# T97 — Library Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing runtime authority paths in:

- `public/control-center/pages/library.js`

This follows T96, which confirmed Library contains backend asset/source APIs and multiple mutation signals.

## Paths to classify

### 1. Refresh Library
Expected classification:
- Backend refresh/list operation.
- Confirm whether read-only refresh or backend re-scan.

### 2. Upload assets
Expected classification:
- Uses `uploadProjectAsset`.
- Must be explicitly operator-triggered.
- Should confirm upload category and files before durable upload.

### 3. Rename asset
Expected classification:
- Uses `renameProjectAsset`.
- Must be confirmed if backend metadata is changed.

### 4. Update asset status
Expected classification:
- Uses `updateProjectAssetStatus`.
- Must classify whether status change requires confirmation.

### 5. Source of Truth toggle
Expected classification:
- Uses `setProjectAssetSourceOfTruth`.
- Must be confirmed because it affects source authority.

### 6. Reclassify asset
Expected classification:
- Uses `reclassifyProjectAsset`.
- Must be confirmed if backend asset type/classification changes.

### 7. Archive asset
Expected classification:
- Uses `archiveProjectAsset`.
- Must be confirmed.

### 8. Delete asset
Expected classification:
- Uses `deleteProjectAsset`.
- Must be confirmed.

### 9. Use as AI Command Source
Expected classification:
- Should use `setSharedAiSource` and clear shared bridge.
- If shared context only, no confirmation required.

### 10. Preview/open/copy/download asset
Expected classification:
- Local/browser/protected media fetch/open only.
- No backend mutation unless tracked.

### 11. AI / action panel buttons
Expected classification:
- Must confirm whether they create backend handoff/task/approval or only prepare local commands.

## Decision Rule
- If upload/delete/archive/source-of-truth/reclassify/rename/status mutations lack confirmation, patch narrowly.
- If AI Command source return is shared context only, document and close that path.
- If action panel delegates to separate files, classify whether separate audit is needed.
- Do not redesign Library in this pass.

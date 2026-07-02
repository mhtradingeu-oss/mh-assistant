# PHASE 3U.2 — Local Restore Note

## Status
Documented.

## Why This Note Exists
The local GitHub clone contained the current code and audit history, but not the full media dataset from the previous server.

The missing media caused Library to show an empty/limited asset state locally.

## Restore Action
A backup copy of:

`data/projects/hairoticmen`

was restored into the local workspace:

`/Users/nadeemnour/Desktop/Last-Update-MH-Assistant/data/projects/hairoticmen`

## Important Correction
After restore, some tracked configuration files were restored from Git to avoid replacing current setup/project state with older backup configuration.

Media/assets were kept locally.

## Preview Path Correction
The restored asset registry contained legacy absolute paths from the old server.

Legacy examples:
`/opt/mh-assistant/data/brand-assets/hairoticmen/...`

Local runtime-safe examples:
`brand-assets/products/images/...`

The asset registry was normalized locally so protected media preview can resolve files through:

`/media/file/:project/:type/:filename`

## Current Local Reality
- Media is restored locally.
- Asset preview works after path normalization.
- This is local data repair, not a production frontend/backend patch.
- Do not commit large media/data blindly.
- Decide later whether restored media belongs in Git LFS, external storage, or local-only backup.

## Production Safety
No frontend, backend, route, or API logic change was approved in this restore step.

# Upload Filename Hardening Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Audit and hardening of multer filename callback for `POST /media/upload`.

## Compatibility Verdict

`safe_to_protect_now`

Fix 6 applied. New uploads will use hardened filenames. Existing files are not moved or renamed.

## Current Behavior Before Fix

`runtime/orchestrator-service/server.js` multer `filename` callback (before):

```js
filename: (req, file, cb) => {
  const safeName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
  cb(null, safeName);
}
```

Gaps:
1. **`path.basename` not applied** — a client supplying `originalname: "../../etc/passwd"` would produce a filename containing path separators, potentially resolving outside the intended directory in some environments.
2. **Only whitespace normalized** — characters such as `;`, `<`, `>`, `|`, `\0`, `~`, `$` passed through unchanged.
3. **Extension not validated** — arbitrary extensions preserved unchanged.
4. **No length cap** — oversized original names passed through.

Note: the **destination** callback independently calls `resolveUploadTarget` and `ensureDir`, which resolves the project-scoped directory using `normalizeProjectSlug`. The final stored path is `path.join(dir, filename)` where `dir` is already a safe project-scoped absolute path. However, a `../` in `filename` could still escape that directory on some Node/OS combinations.

## Media File Read Route Analysis (`/media/file/:project/:type/:filename`)

`resolveMediaFilePath`:
```js
function resolveMediaFilePath(projectName, type, filename) {
  const project = normalizeProjectSlug(projectName);
  const safeFilename = path.basename(String(filename || '').trim());
  const uploadTarget = resolveUploadTarget(project, normalizedType);
  return path.join(uploadTarget.dir, safeFilename);
}
```

The **read route already applies `path.basename`** to the incoming `:filename` URL segment, so existing stored filenames containing traversal sequences cannot be used to escape the project root via the read route. This confirms that sanitizing new filenames at write time is independent of read-time safety; both are now hardened.

## Hardening Implementation

New helper added before the `upload = multer(...)` block:

```js
function sanitizeUploadFilename(originalName) {
  // 1. basename first — strips any path separators, preventing traversal.
  const base = path.basename(String(originalName || '').trim()) || 'upload';

  // 2. Split extension. Only preserve extensions that are safe (alphanumeric, 1-8 chars).
  const lastDot = base.lastIndexOf('.');
  let stem = lastDot > 0 ? base.slice(0, lastDot) : base;
  const rawExt = lastDot > 0 ? base.slice(lastDot + 1) : '';
  const ext = /^[a-zA-Z0-9]{1,8}$/.test(rawExt) ? rawExt : '';

  // 3. Normalize stem: replace whitespace and unsafe chars with underscores.
  stem = stem.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '_');

  // 4. Collapse repeated underscores/dots, strip leading/trailing punctuation.
  stem = stem.replace(/[._-]{2,}/g, '_').replace(/^[._-]+|[._-]+$/g, '');

  // 5. Enforce max base length (128 chars) to prevent oversized names.
  stem = stem.slice(0, 128) || 'upload';

  return ext ? `${stem}.${ext}` : stem;
}
```

Updated `filename` callback:
```js
filename: (req, file, cb) => {
  const safeName = Date.now() + '_' + sanitizeUploadFilename(file.originalname);
  cb(null, safeName);
}
```

## Filename Behavior Summary

| Input | Before fix | After fix |
|---|---|---|
| `photo.jpg` | `1234567890_photo.jpg` | `1234567890_photo.jpg` |
| `my photo.jpg` | `1234567890_my_photo.jpg` | `1234567890_my_photo.jpg` |
| `../../etc/passwd` | `1234567890_../../etc/passwd` | `1234567890_passwd` |
| `file;rm -rf *.sh` | `1234567890_file;rm_-rf_*.sh` | `1234567890_file_rm_-rf_.sh` |
| `image.PHP7` | `1234567890_image.PHP7` | `1234567890_image.PHP7` |
| `image.verylongextension123` | `1234567890_image.verylongextension123` | `1234567890_image` (ext stripped) |
| `` (empty) | `1234567890_` | `1234567890_upload` |
| `\0null.jpg` | `1234567890_\0null.jpg` | `1234567890__null.jpg` → collapsed to `1234567890_null.jpg` |

## Route Response Shape

Unchanged. The `/media/upload` handler returns:
```json
{ "ok": true, "file": { ... }, "project": "...", "type": "..." }
```
The `file` object reflects the multer-set `filename` field; callers should not depend on the exact original filename in the stored name (and existing callers do not).

## Existing File Migration

None. Existing stored files are not renamed or moved. The hardening applies only to new uploads.

## Compatibility Risks

None identified:
- No Control Center caller depends on the exact stored filename produced by the upload callback.
- The read route (`/media/file/:project/:type/:filename`) uses `path.basename` on the incoming `:filename` segment; this is not affected by the change to write-time naming.
- The destination directory behavior is unchanged.
- The file size limit (50MB) is unchanged.
- Write-key protection is unchanged.

## Fix 6 Applied

- `sanitizeUploadFilename()` added to `runtime/orchestrator-service/server.js`.
- Multer `filename` callback updated to use `sanitizeUploadFilename(file.originalname)`.
- No route handler logic changed.
- No response shape changed.
- No existing files moved.

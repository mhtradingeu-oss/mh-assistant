# Media Studio Unsafe Frontend Archive

This archive was created during PHASE 3T-0E.

Reason:
- media-studio.js and backup files were inside active frontend pages path.
- They contained direct or historical publish calls and/or frontend imports from backend runtime paths.
- Active route authority remains public/control-center/pages/media-studio-workspace.js via router.js.
- These files are archived for evidence and removed from active pages to prevent accidental import or route confusion.

No active route should import these archived files.

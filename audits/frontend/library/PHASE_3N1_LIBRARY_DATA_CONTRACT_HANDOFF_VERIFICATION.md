# PHASE 3N.1 — Library Data Contract / Handoff Verification

## 1. Executive Verification Summary
- **Confirmed:**
  - Library uses explicit backend API functions for all asset mutations (upload, approve, archive, delete, rename, source-of-truth).
  - Archive and delete actions have confirm gates.
  - Status change has confirm except for status === approved (bypasses confirm).
  - Library handoff to AI Command and Media Studio is implemented (real, not just UI guidance).
  - Listener lifecycle is managed via mount/unmount, no duplicate registration proven.
  - CSS for Library is present in three files, with selectors scoped but some overlap possible.
- **Needs Qualification:**
  - Source-of-truth mutation does not have a confirm gate (potential P1 risk).
  - No evidence of fake execution, but source-of-truth and status mutation could be triggered without confirm.
  - CSS duplication/visual drift risk is possible but not proven without full Browser QA.
- **Not Proven:**
  - No explicit audit log for destructive actions.
  - No test for duplicate listener registration.

## 2. Exact API Contract Map
| Library Function         | api.js Function                | HTTP Method/Path                                      | Read/Write | Backend Authority | Confirm Required |
|-------------------------|-------------------------------|------------------------------------------------------|------------|------------------|------------------|
| refreshProjectLibrary   | refreshProjectLibrary         | GET /media-manager/project/{projectName}/library/refresh | Read       | Yes              | No               |
| updateProjectAssetStatus| updateProjectAssetStatus      | POST /media-manager/project/{projectName}/asset/status | Write      | Yes              | Conditional (No for approved, Yes otherwise) |
| renameProjectAsset      | renameProjectAsset            | POST /media-manager/project/{projectName}/asset/rename | Write      | Yes              | Prompt           |
| setProjectAssetSourceOfTruth | setProjectAssetSourceOfTruth | POST /media-manager/project/{projectName}/asset/source-of-truth | Write | Yes | No |
| archiveProjectAsset     | archiveProjectAsset           | POST /media-manager/project/{projectName}/asset/archive | Write      | Yes              | Yes              |
| deleteProjectAsset      | deleteProjectAsset            | POST /media-manager/project/{projectName}/asset/delete | Write      | Yes              | Yes              |
| uploadProjectAsset      | uploadProjectAsset            | POST /media-manager/project/{projectName}/asset/upload | Write      | Yes              | Yes (UI prompt)  |

## 3. Action and Confirmation Verification
| Action         | Selector/Data Attribute         | Handler Location                | Backend Call                | Confirm/Prompt | Risk |
|----------------|-------------------------------|---------------------------------|-----------------------------|----------------|------|
| Upload         | #libraryUploadBtn, drop zone  | library.js, action-panel.js     | uploadProjectAsset          | Yes (UI prompt)| P1   |
| Preview        | .library-preview-frame        | library.js                      | None                        | No             | P2   |
| Approve        | data-asset-status-action=approved | library.js, action-panel.js | updateProjectAssetStatus     | No             | P1   |
| Mark for Review| data-asset-status-action=needs_review | library.js, action-panel.js | updateProjectAssetStatus | Yes            | P1   |
| Mark as Source | data-library-source-truth     | library.js, action-panel.js     | setProjectAssetSourceOfTruth| No             | P1   |
| Archive        | data-library-archive          | library.js, action-panel.js     | archiveProjectAsset         | Yes            | P0   |
| Rename         | data-library-rename           | library.js, action-panel.js     | renameProjectAsset          | Prompt         | P1   |
| Delete         | data-library-delete           | library.js, action-panel.js     | deleteProjectAsset          | Yes            | P0   |
| Send to AI     | data-library-command=send-to-ai | library.js, action-panel.js   | None                        | No             | P2   |

## 4. Source-of-Truth Verification
- **Selector:** `data-library-source-truth`
- **Handler:** library.js, action-panel.js
- **API Call:** setProjectAssetSourceOfTruth
- **Confirm Exists:** No confirm/prompt
- **Downstream Risk:** P1 — accidental source-of-truth mutation possible
- **Recommendation:** Add confirm/prompt for source-of-truth mutation

## 5. AI / Media / Publishing Handoff Verification
- **Use as Source in AI Command:** Implemented via `data-library-use-ai-source`, triggers handoff logic
- **send-to-ai flow:** Implemented, triggers AI review prompt
- **Shared source bridge:** Managed in shared-context.js via set/get/clearSharedLibrarySourceBridge
- **Media Studio handoff:** Managed via asset.kind and handoff_id, real backend handoff
- **Publishing-ready filtering/status:** Asset status/readiness is real, not just UI
- **UI Guidance:** All handoff actions are real, not fake

## 6. Listener Lifecycle Verification
- **Global Listener Module:** mountLibraryListeners, unmountLibraryListeners
- **Mount/Unmount Points:** library.js (mountLibraryGlobalListeners/unmountLibraryGlobalListeners)
- **Page-level Event Binding:** All listeners registered once per mount, disposed on unmount
- **Duplicate Listener Risk:** Not proven, but not explicitly tested; recommend Browser QA
- **Recommended Safe Test:** Add test for duplicate listener registration

## 7. CSS Contract Verification
- **Active Selector Files:**
  - public/control-center/styles/08-components-foundation.css
  - public/control-center/styles/12-pages.css
  - public/control-center/styles/14-page-standard.css
- **Overlap/Duplication Risk:** Possible, especially for .library-inspector-ai-source-guide, .library-explainer, .library-grid-card, etc.
- **Do Not Claim No Duplication:** Visual drift risk is P2 unless proven by Browser QA
- **Recommendation:** No new CSS until selector ownership is clarified

## 8. Protected Behavior List
- All backend mutation API calls: uploadProjectAsset, archiveProjectAsset, deleteProjectAsset, renameProjectAsset, setProjectAssetSourceOfTruth, updateProjectAssetStatus
- All selectors: data-library-archive, data-library-delete, data-library-rename, data-library-source-truth, data-asset-status-action
- Listener lifecycle: mountLibraryListeners, unmountLibraryListeners

## 9. Corrected Risk Register
- **P0:** Archive/Delete (destructive, authority)
- **P1:** Source-of-truth mutation (no confirm), status approve (no confirm), handoff/data contract clarity
- **P2:** CSS duplication/visual drift, preview action
- **P3:** Future: audit log for destructive actions, duplicate listener test

## 10. Recommended Next Step
**A. Browser QA proof before patch**
- Confirm no duplicate listeners, no visual drift, and all confirm gates work as intended in the browser.

---

### Validation Results
- `git status --short`: clean
- `node --check public/control-center/pages/library.js`: OK
- `node --check public/control-center/app.js`: OK
- `node --check public/control-center/router.js`: OK
- `node --check public/control-center/api.js`: OK
- `node --check public/control-center/shared-context.js`: OK

No production files changed. Audit documentation only.

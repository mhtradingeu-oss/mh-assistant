# Library International UX Upgrade — Pre-Codex Evidence

## Branch
architecture/frontend-consolidation-v1

## Current HEAD
f586328 Upgrade Setup international UX safely

## Git Status
?? audits/frontend/global-design-system/page-ux-upgrades/library-evidence/

## Syntax Baseline
- node --check public/control-center/pages/library.js: pass if command above had no output
- node --check public/control-center/pages/library/*.js: pass if command above had no output
- node --check app/router/api: pass if command above had no output

## Key Library Contracts
- route id: library
- data page root: data-page="library"
- Library owns source/evidence and asset readiness
- Upload is durable/backend asset creation
- Protected preview uses backend/protected object URL behavior
- Source-of-truth marking is platform-critical metadata
- Asset status/reclassify/rename/archive/delete are authority-sensitive
- AI source handoff prepares context only
- Library source actions must not imply Governance approval, publishing, sending, or execution

## Required Controls / Signals To Preserve
public/control-center/pages/library.js:4:  setSharedAiSource,
public/control-center/pages/library.js:38:  archiveProjectAsset,
public/control-center/pages/library.js:39:  deleteProjectAsset,
public/control-center/pages/library.js:42:  reclassifyProjectAsset,
public/control-center/pages/library.js:43:  renameProjectAsset,
public/control-center/pages/library.js:44:  setProjectAssetSourceOfTruth,
public/control-center/pages/library.js:45:  updateProjectAssetStatus,
public/control-center/pages/library.js:46:  uploadProjectAsset
public/control-center/pages/library.js:392:async function getProtectedAssetObjectUrl(projectName, asset, options = {}) {
public/control-center/pages/library.js:458:  const resolved = await getProtectedAssetObjectUrl(projectName, asset);
public/control-center/pages/library.js:1267:    const resolved = await getProtectedAssetObjectUrl(projectName, asset, {
public/control-center/pages/library.js:1325:    const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {
public/control-center/pages/library.js:1554:  navigateTo,
public/control-center/pages/library.js:1574:      navigateTo,
public/control-center/pages/library.js:1749:        navigateTo,
public/control-center/pages/library.js:1780:        navigateTo,
public/control-center/pages/library.js:1816:        navigateTo,
public/control-center/pages/library.js:1847:        navigateTo,
public/control-center/pages/library.js:1962:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use this asset as an AI source" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as AI Source</button>
public/control-center/pages/library.js:1970:    let useBtns = Array.from(previewMeta.querySelectorAll("[data-library-use-ai-source]"));
public/control-center/pages/library.js:1973:      const gridBtn = gridBody.querySelector("[data-library-use-ai-source]");
public/control-center/pages/library.js:1989:        setSharedAiSource(sourceProjectName, payload);
public/control-center/pages/library.js:1990:        setSharedAiSource("__default__", payload);
public/control-center/pages/library.js:2002:        navigateTo("ai-command");
public/control-center/pages/library.js:2095:          navigateTo,
public/control-center/pages/library.js:2145:          navigateTo,
public/control-center/pages/library.js:2154:      const input = $("quickCommandInput");
public/control-center/pages/library.js:2156:      navigateTo("ai-command");
public/control-center/pages/library.js:2185:        navigateTo,
public/control-center/pages/library.js:2220:        navigateTo,
public/control-center/pages/library.js:2249:        navigateTo,
public/control-center/pages/library.js:2388:        await setProjectAssetSourceOfTruth(activeProjectName, asset.asset_id || asset.id, !asset.source_of_truth);
public/control-center/pages/library.js:2427:        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
public/control-center/pages/library.js:2482:        await reclassifyProjectAsset(
public/control-center/pages/library.js:2530:        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
public/control-center/pages/library.js:2571:        await renameProjectAsset(activeProjectName, assetId, normalized);
public/control-center/pages/library.js:2605:        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
public/control-center/pages/library.js:2867:        navigateTo,
public/control-center/pages/library.js:2877:            const result = await uploadProjectAsset(activeProjectName, assetType, file);
public/control-center/pages/library.js:2950:      const input = $("quickCommandInput");
public/control-center/pages/library.js:2952:      navigateTo("ai-command");
public/control-center/pages/library.js:2960:      const input = $("quickCommandInput");
public/control-center/pages/library.js:2962:      navigateTo("ai-command");
public/control-center/pages/library.js:2975:      const input = $("quickCommandInput");
public/control-center/pages/library.js:2977:      navigateTo("ai-command");
public/control-center/pages/library.js:2989:      const input = $("quickCommandInput");
public/control-center/pages/library.js:2991:      navigateTo("ai-command");
public/control-center/pages/library.js:3004:      const input = $("quickCommandInput");
public/control-center/pages/library.js:3007:      navigateTo("ai-command");
public/control-center/pages/library.js:3029:    navigateTo,
public/control-center/pages/library.js:3069:            navigateTo("ai-command");
public/control-center/pages/library.js:3285:      navigateTo,
public/control-center/pages/library/action-panel.js:70:          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI to review asset</button>

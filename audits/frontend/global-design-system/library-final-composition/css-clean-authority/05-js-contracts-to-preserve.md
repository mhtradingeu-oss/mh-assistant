# 05 — Library JS Contracts To Preserve

Generated: Sat Jun  6 10:41:37 CEST 2026

public/control-center/pages/library.js:488:          const button = event.target.closest?.("[data-copy-asset-path]");
public/control-center/pages/library.js:493:          const value = button.getAttribute("data-copy-asset-path") || "";
public/control-center/pages/library.js:1487:function getLibraryScrollContainer(target) {
public/control-center/pages/library.js:1508:function scrollLibraryTargetIntoView(target, highlightClass = "is-required-action-target") {
public/control-center/pages/library.js:1513:  const scroller = getLibraryScrollContainer(target);
public/control-center/pages/library.js:1535:function bindLibraryWorkspace({
public/control-center/pages/library.js:1555:    bindLibraryWorkspace({
public/control-center/pages/library.js:1702:              data-library-required-action="${escapeHtml(item.action)}"
public/control-center/pages/library.js:1703:              data-library-required-key="${escapeHtml(item.key)}"
public/control-center/pages/library.js:1704:              data-library-upload-type="${escapeHtml(item.uploadType)}"
public/control-center/pages/library.js:1712:  const typeSelect = $("libraryFilterTypeSelect");
public/control-center/pages/library.js:1730:      bindLibraryWorkspace({
public/control-center/pages/library.js:1748:  const statusSelect = $("libraryFilterStatusSelect");
public/control-center/pages/library.js:1761:      bindLibraryWorkspace({
public/control-center/pages/library.js:1779:  const sourceSelect = $("libraryFilterSourceSelect");
public/control-center/pages/library.js:1797:      bindLibraryWorkspace({
public/control-center/pages/library.js:1828:      bindLibraryWorkspace({
public/control-center/pages/library.js:1863:          <article class="library-grid-card${isSelected ? " is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0" aria-label="Select ${escapeHtml(asset.name)}" aria-selected="${isSelected ? "true" : "false"}">
public/control-center/pages/library.js:1885:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="prev"${session.page <= 1 ? " disabled" : ""}>Previous</button>
public/control-center/pages/library.js:1887:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="next"${session.page >= totalPages ? " disabled" : ""}>Next</button>
public/control-center/pages/library.js:2059:  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
public/control-center/pages/library.js:2062:      const action = button.getAttribute("data-library-required-action") || "review";
public/control-center/pages/library.js:2063:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
public/control-center/pages/library.js:2064:      const requiredKey = button.getAttribute("data-library-required-key") || "";
public/control-center/pages/library.js:2068:      const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2089:        bindLibraryWorkspace({
public/control-center/pages/library.js:2110:            const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
public/control-center/pages/library.js:2111:            scrollLibraryTargetIntoView(assetWorkspace);
public/control-center/pages/library.js:2118:          const assetIntake = document.querySelector(".library-actions-card") || document.getElementById("libraryDropZone");
public/control-center/pages/library.js:2119:          const dropZone = document.getElementById("libraryDropZone");
public/control-center/pages/library.js:2120:          scrollLibraryTargetIntoView(assetIntake);
public/control-center/pages/library.js:2139:        bindLibraryWorkspace({
public/control-center/pages/library.js:2179:      bindLibraryWorkspace({
public/control-center/pages/library.js:2214:      bindLibraryWorkspace({
public/control-center/pages/library.js:2243:      bindLibraryWorkspace({
public/control-center/pages/library.js:2261:  const selectableCards = Array.from(document.querySelectorAll("[data-library-grid-select]"));
public/control-center/pages/library.js:2265:      const nextId = card.getAttribute("data-library-grid-select") || "";
public/control-center/pages/library.js:2280:      const nextId = card.getAttribute("data-library-grid-select") || "";
public/control-center/pages/library.js:2293:  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
public/control-center/pages/library.js:2296:      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
public/control-center/pages/library.js:2373:  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
public/control-center/pages/library.js:2383:      const assetId = button.getAttribute("data-library-source-truth") || "";
public/control-center/pages/library.js:2404:  const statusActionButtons = Array.from(document.querySelectorAll("[data-asset-status-action]"));
public/control-center/pages/library.js:2414:      const status = button.getAttribute("data-asset-status-action") || "needs_review";
public/control-center/pages/library.js:2416:      const assetId = button.getAttribute("data-asset-id") || "";
public/control-center/pages/library.js:2443:  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
public/control-center/pages/library.js:2453:      const id = button.getAttribute("data-library-archive") || "";
public/control-center/pages/library.js:2454:      const assetId = button.getAttribute("data-asset-id") || "";
public/control-center/pages/library.js:2477:  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
public/control-center/pages/library.js:2487:      const id = button.getAttribute("data-library-rename") || "";
public/control-center/pages/library.js:2488:      const assetId = button.getAttribute("data-asset-id") || "";
public/control-center/pages/library.js:2518:  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
public/control-center/pages/library.js:2528:      const id = button.getAttribute("data-library-delete") || "";
public/control-center/pages/library.js:2529:      const assetId = button.getAttribute("data-asset-id") || "";
public/control-center/pages/library.js:2574:  const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));
public/control-center/pages/library.js:2577:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
public/control-center/pages/library.js:2579:      const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2587:  const gridPageButtons = Array.from(document.querySelectorAll("[data-library-grid-page]"));
public/control-center/pages/library.js:2593:      const action = button.getAttribute("data-library-grid-page");
public/control-center/pages/library.js:2634:  const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2657:  const dropZone = $("libraryDropZone");
public/control-center/pages/library.js:2784:        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
public/control-center/pages/library.js:2795:      bindLibraryWorkspace({
public/control-center/pages/library.js:3022:        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
public/control-center/pages/library.js:3102:            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
public/control-center/pages/library.js:3110:              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
public/control-center/pages/library.js:3111:              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
public/control-center/pages/library.js:3123:        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">
public/control-center/pages/library.js:3138:                      <button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">
public/control-center/pages/library.js:3153:                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
public/control-center/pages/library.js:3154:                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
public/control-center/pages/library.js:3157:                  <label class="setup-label" for="libraryFilterStatusSelect">Status</label>
public/control-center/pages/library.js:3158:                  <select id="libraryFilterStatusSelect" class="setup-input" aria-label="Filter by status">
public/control-center/pages/library.js:3172:                  <label class="setup-label" for="libraryFilterSourceSelect">Source</label>
public/control-center/pages/library.js:3173:                  <select id="libraryFilterSourceSelect" class="setup-input" aria-label="Filter by source"></select>
public/control-center/pages/library.js:3213:    bindLibraryWorkspace({
public/control-center/pages/library/action-panel.js:59:          <button class="btn btn-secondary" type="button" data-copy-asset-path="${copyPathValue}"${copyDisabledAttr}>Copy asset path</button>
public/control-center/pages/library/action-panel.js:68:      : `<button class="btn btn-secondary" type="button" data-library-source-truth="${selectedAssetId}"${disabledAttr}>${escapePanelHtml(getPanelSourceOfTruth(selectedAsset) ? "Remove source mark" : "Mark as source")}</button>
public/control-center/pages/library/action-panel.js:69:             <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Approve for use</button>
public/control-center/pages/library/action-panel.js:70:             <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Mark for review</button>`}
public/control-center/pages/library/action-panel.js:71:          <button class="btn btn-secondary" type="button" data-library-rename="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Rename asset</button>
public/control-center/pages/library/action-panel.js:72:          <button class="btn btn-secondary" type="button" data-library-archive="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Archive asset</button>
public/control-center/pages/library/action-panel.js:78:        <button class="btn btn-secondary library-danger-action" type="button" data-library-delete="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}" title="Soft-delete this asset after confirmation"${durableDisabledAttr}>Soft-delete asset</button>

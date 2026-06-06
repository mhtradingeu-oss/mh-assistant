# LIB-FINAL-4C — Required Asset Mapping Evidence

Generated: Sat Jun  6 08:51:35 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: e143d34

## Folder / required asset definitions
99:const REQUIRED_ASSET_REQUIREMENTS = [
105:    uploadType: "logo"
112:    uploadType: "brand_guideline"
119:    uploadType: "product_csv"
126:    uploadType: "product_photos"
133:    uploadType: "product_videos"
140:    uploadType: "legal_doc"
147:    uploadType: "partner_docs"
151:const LIBRARY_FOLDERS = [
561:      folderKey: "all_assets",
564:      uploadType: "logo",
600:  const normalized = getSafeAssetType(selectedValue || session.uploadType);
893:  const missingRequiredAssets = requiredGroups.filter((item) => item.status === "missing").length;
902:    missingRequiredAssets,
943:  return REQUIRED_ASSET_REQUIREMENTS.map((requirement) => {
971:  const selectedFolderKey = session.folderKey || "all_assets";
1002:    const folder = LIBRARY_FOLDERS.find((item) => item.key === selectedFolderKey);
1049:  return LIBRARY_FOLDERS.map((folder) => {
1495:  missingRequiredAssets,
1515:      missingRequiredAssets,
1650:            <small>${escapeHtml(`Detected: ${formatCount(item.totalCount)}`)}</small>
1656:              data-library-upload-type="${escapeHtml(item.uploadType)}"
1690:        missingRequiredAssets,
1721:        missingRequiredAssets,
1757:        missingRequiredAssets,
1788:        missingRequiredAssets,
2015:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2019:      session.uploadType = uploadType;
2020:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2021:      if (uploadTypeSelect) uploadTypeSelect.value = uploadType;
2025:      for (const folder of LIBRARY_FOLDERS) {
2026:        if (folder.key === requiredKey || (folder.types && folder.types.includes(uploadType))) {
2033:        session.folderKey = mappedFolder.key;
2034:        session.selectedType = uploadType;
2045:        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
2054:          missingRequiredAssets,
2063:        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
2082:          missingRequiredAssets,
2122:        missingRequiredAssets,
2157:        missingRequiredAssets,
2186:        missingRequiredAssets,
2231:      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
2235:        value: folderKey
2238:          session.folderKey = value;
2509:  const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));
2512:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
2513:      session.uploadType = uploadType;
2514:      const uploadTypeSelect = $("libraryUploadTypeSelect");
2515:      if (uploadTypeSelect) {
2516:        uploadTypeSelect.value = uploadType;
2518:      showMessage?.(`Upload category set to ${uploadType}.`);
2569:  const uploadTypeSelect = $("libraryUploadTypeSelect");
2570:  if (uploadTypeSelect) {
2572:    uploadTypeSelect.innerHTML = catalog.map((item) => {
2575:      return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;
2577:    uploadTypeSelect.value = session.uploadType;
2578:    uploadTypeSelect.onchange = (event) => {
2579:      const uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
2581:      dispatchLibraryCommand("upload-type-change", { uploadType }, {
2582:        "upload-type-change": ({ uploadType: nextUploadType }) => ({
2584:          uploadType: nextUploadType
2588:      session.uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
2738:        missingRequiredAssets,
2833:      if (input) input.value = buildAiPrompt(projectName, "missing", { missing: missingRequiredAssets });
2978:    const missingRequiredAssets = getMissingAssetLabels(assetsData);
3048:                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
3069:                  ${LIBRARY_FOLDERS.map((folder) => {
3071:      const active = (session.folderKey || "all_assets") === folder.key;
3156:      missingRequiredAssets,

## Folder definitions excerpt
              : `Could not open file: ${error.message || "Unknown error."}`;
            alert(message);
          });
        },
        (event) => {
          const root = event.target?.closest?.(".library-workspace");
          if (!root) return;

          if (event.target?.closest?.(".library-action-menu")) {
            return;
          }

          closeAllLibraryActionDropdowns();
        }
      ]
    }
  });
}

function unmountLibraryGlobalListeners() {
  if (!disposeLibraryGlobalListeners) {
    return;
  }

  const dispose = disposeLibraryGlobalListeners;
  disposeLibraryGlobalListeners = null;
  dispose();
}


function ensureLibrarySession(projectName) {
  const key = projectName || "__default__";
  if (!librarySessionStore.has(key)) {
    librarySessionStore.set(key, normalizeLibrarySession({
      selectedCategoryKey: "all",
      selectedAssetId: "",
      searchQuery: "",
      selectedType: "all",
      selectedStatus: "active",
      selectedSource: "all",
      sortBy: "updated_desc",
      folderKey: "all_assets",
      viewMode: "grid",
      page: 1,
      uploadType: "logo",
      uploading: false,
      recentUploads: []
    }));
  }

  const current = librarySessionStore.get(key);
  const normalized = normalizeLibrarySession(current);
  if (current !== normalized) {
    librarySessionStore.set(key, normalized);
  }
  return librarySessionStore.get(key);
}

function dispatchLibraryCommand(command, payload = {}, handlers = {}) {
  const envelope = createLibraryCommand(command, payload);
  return routeLibraryCommand(envelope, handlers);
}

function closeAllLibraryActionDropdowns() {
  Array.from(document.querySelectorAll(".library-action-dropdown.is-open")).forEach((item) => {
    item.classList.remove("is-open");
    item.style.display = "";
  });
}


function getSafeAssetType(value = "") {
  return asString(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

function getUploadAssetType(session, catalog, selectedValue) {
  const normalized = getSafeAssetType(selectedValue || session.uploadType);
  const valid = new Set(asArray(catalog).map((item) => item.asset_type));
  if (!valid.has(normalized)) {
    throw new Error("Choose a valid upload category.");
  }
  return normalized;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCategoryByType(categoryReadiness) {
  const map = new Map();
  asArray(categoryReadiness).forEach((item) => {
    const key = asString(item.asset_type).trim().toLowerCase();
    if (key) map.set(key, item);
  });
  return map;
}

function normalizeReadinessStatus(value = "") {
  const normalized = asString(value).trim().toLowerCase().replace(/\s+/g, "_");
  if (!normalized) return "uploaded";
  if (normalized.includes("approved")) return "approved";
  if (normalized.includes("publishing_ready")) return "publishing_ready";
  if (normalized.includes("sent_to_publishing")) return "sent_to_publishing";
  if (normalized.includes("draft")) return "draft";
  if (normalized.includes("missing")) return "missing";
  if (normalized === "uploaded") return "uploaded";
  if (normalized.includes("needs_review") || normalized.includes("review")) return "needs_review";
  if (normalized.includes("reject")) return "rejected";
  if (normalized.includes("archiv")) return "archived";
  return "uploaded";
}

function toStatusLabel(status = "") {
  const value = normalizeReadinessStatus(status);
  if (value === "approved") return "Approved";
  if (value === "publishing_ready") return "Publishing Ready";
  if (value === "sent_to_publishing") return "Sent to Publishing";

## Required cards render excerpt
      </div>
    `;
  }

  // ...existing code...

  const requiredBox = $("libraryRequiredAssetsGrid");
  if (requiredBox) {
    requiredBox.innerHTML = requiredGroups.map((item) => {
      const tone = item.status === "present" ? "success" : item.status === "missing" ? "danger" : "warning";
      const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";
      const statusLabel = item.status === "present" ? "Present" : item.status === "missing" ? "Missing" : "Needs Review";
      const reasonHint = item.why.length > 84 ? `${item.why.slice(0, 81)}...` : item.why;

      return `
        <article class="library-required-card">
          <div class="library-required-card-head">
            <h4>${escapeHtml(item.label)}</h4>
            <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
          </div>
          <p class="library-required-why">${escapeHtml(reasonHint)}</p>
          <div class="library-required-card-foot">
            <small>${escapeHtml(`Detected: ${formatCount(item.totalCount)}`)}</small>
            <button
              class="btn btn-secondary btn-sm"
              type="button"
              data-library-required-action="${escapeHtml(item.action)}"
              data-library-required-key="${escapeHtml(item.key)}"
              data-library-upload-type="${escapeHtml(item.uploadType)}"
            >${escapeHtml(actionLabel)}</button>
          </div>
        </article>
      `;
    }).join("");
  }

  const typeSelect = $("libraryFilterTypeSelect");
  if (typeSelect) {
    typeSelect.innerHTML = typeOptions.map((option) => `
      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
    `).join("");
    typeSelect.value = session.selectedType || "all";
    typeSelect.removeAttribute("disabled");
    typeSelect.removeAttribute("readonly");
    typeSelect.onchange = (event) => {

## Required action handler excerpt
      : `<div class="empty-box library-upload-empty-state"><strong>No session uploads yet.</strong><span>Choose files, classify them, then upload to add new assets to this Library.</span></div>`;
  }

  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
  requiredActionButtons.forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-library-required-action") || "review";
      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
      const requiredKey = button.getAttribute("data-library-required-key") || "";

      // Always set upload type
      session.uploadType = uploadType;
      const uploadTypeSelect = $("libraryUploadTypeSelect");
      if (uploadTypeSelect) uploadTypeSelect.value = uploadType;

      // Try to find a matching folder/filter for the required asset group
      let mappedFolder = null;
      for (const folder of LIBRARY_FOLDERS) {
        if (folder.key === requiredKey || (folder.types && folder.types.includes(uploadType))) {
          mappedFolder = folder;
          break;
        }
      }

      if (mappedFolder) {
        session.folderKey = mappedFolder.key;
        session.selectedType = uploadType;
        session.page = 1;
        // Focus/scroll asset workspace
        setTimeout(() => {
          const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
          if (assetWorkspace) {
            assetWorkspace.classList.add("is-required-action-target");
            assetWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => assetWorkspace.classList.remove("is-required-action-target"), 2000);
          }
        }, 0);
        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
        bindLibraryWorkspace({
          $,
          projectName,
          session,
          assetsData,
          operations,
          registry,

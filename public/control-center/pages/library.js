import { refreshProjectLibrary, uploadProjectAsset } from "../api.js";
import {
  getAssetCatalog,
  getCanonicalAssetType,
  getCategoryReadinessList,
  getMissingAssetLabels,
  getAssetStatusTone
} from "../asset-library.js";

const librarySessionStore = new Map();

const SMART_CATEGORY_BUCKETS = [
  { key: "logos", label: "Logos", types: ["logo"] },
  { key: "product_images", label: "Product Images", types: ["product_photos", "packaging_images"] },
  { key: "videos", label: "Videos", types: ["product_videos"] },
  { key: "documents", label: "Documents", types: ["brand_guideline", "partner_docs", "testimonials_reviews", "certificates"] },
  { key: "legal", label: "Legal", types: ["legal_doc"] },
  { key: "pricing", label: "Pricing", types: ["pricing_doc", "product_csv"] },
  { key: "campaign_materials", label: "Campaign Materials", types: ["social_assets", "campaign_assets"] }
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function basename(filePath = "") {
  const value = asString(filePath);
  if (!value) return "";
  const parts = value.split("/");
  return parts[parts.length - 1] || value;
}

function getFileExtension(name = "") {
  const value = basename(name);
  const index = value.lastIndexOf(".");
  return index >= 0 ? value.slice(index + 1).toLowerCase() : "";
}

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function isImageExtension(extension = "") {
  return ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(extension);
}

function isVideoExtension(extension = "") {
  return ["mp4", "mov", "webm", "m4v"].includes(extension);
}

function buildPreviewUrl(projectName, asset) {
  if (!projectName) return "";
  const fileName = basename(asset.file_path || asset.filename || "");
  const assetType = asString(asset.asset_type || asset.type || "asset").trim().toLowerCase();
  if (!fileName || !assetType) return "";
  return `/media/file/${encodeURIComponent(projectName)}/${encodeURIComponent(assetType)}/${encodeURIComponent(fileName)}`;
}

function getStoredControlCenterAccessKey() {
  const directKeys = [
    "mh_control_key",
    "mh_control_center_key",
    "MH_CONTROL_CENTER_KEY",
    "control_center_key",
    "mhControlKey",
    "mh_access_key",
    "controlCenterAccessKey"
  ];

  for (const key of directKeys) {
    const value = localStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index) || "";
    const normalized = key.toLowerCase();
    if (
      normalized.includes("control") ||
      normalized.includes("access") ||
      normalized.includes("mh_") ||
      normalized.includes("key")
    ) {
      const value = localStorage.getItem(key);
      if (value && value.trim() && value.trim().length >= 8) {
        return value.trim();
      }
    }
  }

  return "";
}

async function openProtectedLibraryFile(fileUrl, filename) {
  const accessKey = getStoredControlCenterAccessKey();

  if (!accessKey) {
    alert("Missing Control Center access key. Click Control Center Access, paste the key, then Save Key.");
    return;
  }

  let response;
  try {
    response = await fetch(fileUrl, {
      headers: {
        "x-mh-control-key": accessKey
      }
    });
  } catch (error) {
    alert(`Could not open file: ${error.message}`);
    return;
  }

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    alert(`Could not open file: ${response.status} ${message}`);
    return;
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const contentType = response.headers.get("content-type") || "";
  const safeFilename = filename || "download";

  if (
    contentType.startsWith("image/") ||
    contentType.startsWith("video/") ||
    contentType.includes("pdf") ||
    /\.(png|jpg|jpeg|webp|gif|svg|avif|mp4|mov|webm|m4v|pdf)$/i.test(safeFilename)
  ) {
    window.open(objectUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = safeFilename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
}


async function updateLibraryAssetStatus(assetId, status, projectName) {
  const accessKey = getStoredControlCenterAccessKey();

  if (!accessKey) {
    alert("Missing Control Center access key. Click Control Center Access, paste the key, then Save Key.");
    return;
  }

  if (!assetId) {
    alert("Missing asset id.");
    return;
  }

  if (!projectName) {
    alert("Select a project before updating asset status.");
    return;
  }

  const confirmed = status === "approved"
    ? true
    : confirm(`Set this asset status to "${status}"?`);

  if (!confirmed) return;

  let response;
  try {
    response = await fetch(
      `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mh-control-key": accessKey
        },
        body: JSON.stringify({
          status,
          note: `Status changed to ${status} from Control Center Library.`
        })
      }
    );
  } catch (error) {
    alert(`Could not update asset status: ${error.message}`);
    return;
  }

  const payloadText = await response.text();
  let payload = {};
  try {
    payload = payloadText ? JSON.parse(payloadText) : {};
  } catch {
    payload = { raw: payloadText };
  }

  if (!response.ok || !payload.ok) {
    alert(`Could not update asset status: ${response.status} ${payload.error || payloadText}`);
    return;
  }

  const row = document.querySelector(`[data-asset-row-id="${CSS.escape(assetId)}"]`);
  if (row) {
    row.dataset.assetStatus = status;
    const badge = row.querySelector("[data-asset-status-badge]");
    if (badge) {
      badge.textContent = status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
      badge.className = `badge badge-${status === "approved" ? "success" : status === "rejected" ? "danger" : status === "archived" ? "muted" : "warning"}`;
    }
  }

  alert(`Asset status updated to: ${status}`);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-asset-status-action]");
  if (!button) return;

  event.preventDefault();

  updateLibraryAssetStatus(
    button.getAttribute("data-asset-id") || "",
    button.getAttribute("data-asset-status-action") || "needs_review",
    button.getAttribute("data-asset-project") || ""
  );
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest?.("[data-copy-asset-path]");
  if (!button) return;

  event.preventDefault();

  const value = button.getAttribute("data-copy-asset-path") || "";
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    alert("Asset path copied.");
  } catch {
    window.prompt("Copy asset path:", value);
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a.library-link-btn");
  if (!link) return;

  const fileUrl = link.getAttribute("href") || "";
  if (!fileUrl.includes("/media/file/")) return;

  event.preventDefault();

  const filename = decodeURIComponent(fileUrl.split("/").pop() || "download");
  openProtectedLibraryFile(fileUrl, filename);
});

function ensureLibrarySession(projectName) {
  const key = projectName || "__default__";
  if (!librarySessionStore.has(key)) {
    librarySessionStore.set(key, {
      selectedCategoryKey: "all",
      selectedAssetId: "",
      searchQuery: "",
      uploadType: "logo",
      uploading: false,
      recentUploads: []
    });
  }
  return librarySessionStore.get(key);
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

function normalizeAssets(projectName, assetsData, legacyRegistry, categoryByType, catalog) {
  const catalogMap = new Map(asArray(catalog).map((item) => [item.asset_type, item]));

  const registryByPath = new Map();
  const registryByName = new Map();
  asArray(legacyRegistry?.assets).forEach((item) => {
    const localPath = asString(item.local_path || item.file_path).trim();
    const fileName = basename(localPath || item.filename || "");
    if (localPath) registryByPath.set(localPath, item);
    if (fileName) registryByName.set(fileName, item);
  });

  return asArray(assetsData?.assets).map((asset, index) => {
    const canonicalType = getCanonicalAssetType(asset.asset_type, catalog);
    const filePath = asString(asset.file_path).trim();
    const fileName = basename(filePath || asset.file_name || asset.filename || "");
    const extension = getFileExtension(fileName);
    const category = categoryByType.get(canonicalType) || {};
    const catalogItem = catalogMap.get(canonicalType) || {};
    const legacy = registryByPath.get(filePath) || registryByName.get(fileName) || null;
    const usedIn = asArray(category.guidance?.used_in).length
      ? asArray(category.guidance?.used_in)
      : asArray(catalogItem.guidance?.used_in);

    return {
      id: asset.asset_id || asset.id || `asset-${index}`,
      name: fileName || asString(asset.file_name || "Asset"),
      file_path: filePath,
      asset_type: canonicalType || asString(asset.asset_type || "asset"),
      category_label: asString(category.display_label || category.label || catalogItem.display_label || catalogItem.label || canonicalType || asset.asset_type || "Asset"),
      category_status: asString(category.status || "Uploaded"),
      exists: asset.exists !== false,
      source_of_truth: Boolean(asset.source_of_truth || asset.use_as_source_of_truth || legacy?.use_as_source_of_truth),
      used_in: usedIn,
      uploaded_at: asset.created_at || asset.updated_at || null,
      preview_url: buildPreviewUrl(projectName, asset),
      extension,
      is_image: isImageExtension(extension),
      is_video: isVideoExtension(extension)
    };
  });
}

function buildAssetOverview({ assets, categoryReadiness, missingRequiredAssets, recentUploads }) {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const recentlyUploadedByDate = assets.filter((asset) => {
    if (!asset.uploaded_at) return false;
    const ts = new Date(asset.uploaded_at).getTime();
    return Number.isFinite(ts) && ts >= sevenDaysAgo;
  }).length;

  const recentUploadsFromSession = asArray(recentUploads).filter((item) => item.status === "success").length;

  const campaignDependencies = asArray(categoryReadiness).filter((item) => {
    const usedIn = asArray(item.guidance?.used_in).join(" ").toLowerCase();
    return usedIn.includes("campaign") || usedIn.includes("media") || usedIn.includes("publishing");
  });

  const readyForCampaign = campaignDependencies.filter((item) => {
    const status = asString(item.status).toLowerCase();
    return ["uploaded", "approved"].includes(status);
  }).length;

  return {
    totalAssets: assets.length,
    sourceOfTruthAssets: assets.filter((asset) => asset.source_of_truth).length,
    missingRequiredAssets: missingRequiredAssets.length,
    recentlyUploaded: recentlyUploadedByDate + recentUploadsFromSession,
    readyForCampaign,
    readyForCampaignTotal: campaignDependencies.length
  };
}

function bucketStatus(categories) {
  const statuses = categories.map((item) => asString(item.status).toLowerCase());
  if (!statuses.length || statuses.every((value) => value === "missing")) return "Missing";
  if (statuses.includes("needs review")) return "Needs Review";
  if (statuses.includes("uploaded") || statuses.includes("approved")) return "Ready";
  return "Missing";
}

function buildCategoryBuckets(categoryReadiness) {
  const categoryByType = getCategoryByType(categoryReadiness);

  return SMART_CATEGORY_BUCKETS.map((bucket) => {
    const entries = bucket.types
      .map((type) => categoryByType.get(type))
      .filter(Boolean);
    const usedIn = [...new Set(entries.flatMap((entry) => asArray(entry.guidance?.used_in)))];

    return {
      ...bucket,
      status: bucketStatus(entries),
      count: entries.reduce((acc, item) => acc + Number(item.count || 0), 0),
      used_in: usedIn
    };
  });
}

function getFilteredAssets(allAssets, session, bucketMap) {
  const selectedCategoryKey = session.selectedCategoryKey || "all";
  const selectedBucket = bucketMap.get(selectedCategoryKey) || null;
  const allowedTypes = selectedBucket ? new Set(selectedBucket.types) : null;
  const searchValue = asString(session.searchQuery).trim();
  const searchRegex = searchValue ? new RegExp(escapeRegExp(searchValue), "i") : null;

  return allAssets.filter((asset) => {
    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
    const matchesSearch = !searchRegex || searchRegex.test(haystack);
    return matchesBucket && matchesSearch;
  });
}

function buildMissingDetails(categoryReadiness) {
  return asArray(categoryReadiness)
    .filter((item) => asString(item.status).toLowerCase() === "missing" && item.required !== false)
    .map((item) => ({
      asset_type: item.asset_type,
      label: item.display_label || item.label || item.asset_type,
      why: item.guidance?.why_it_matters || "Required to keep campaign planning and execution accurate.",
      used_in: asArray(item.guidance?.used_in)
    }));
}

function renderPreview(asset, escapeHtml) {
  if (!asset) {
    return `<div class="empty-box">Select an asset to preview.</div>`;
  }

  if (asset.is_image && asset.preview_url) {
    return `
      <div class="library-preview-frame">
        <img src="${escapeHtml(asset.preview_url)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">
      </div>
    `;
  }

  if (asset.is_video && asset.preview_url) {
    return `
      <div class="library-preview-frame">
        <video class="library-preview-video" controls src="${escapeHtml(asset.preview_url)}"></video>
      </div>
    `;
  }

  return `
    <div class="library-preview-fallback">
      <div class="library-preview-extension">${escapeHtml((asset.extension || "file").toUpperCase())}</div>
      <div class="library-preview-copy">Preview not available for this file type.</div>
    </div>
  `;
}

function buildAiPrompt(projectName, mode, payload = {}) {
  const project = asString(projectName).trim() || "this project";
  if (mode === "classify") {
    return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
  }
  if (mode === "missing") {
    const missing = asArray(payload.missing).join(", ") || "none";
    return `For ${project}, find the fastest way to close missing required assets: ${missing}. Give a step-by-step upload priority.`;
  }
  const docs = asArray(payload.docs).join(", ") || "no document files selected";
  return `Extract key facts from these library documents for ${project}: ${docs}. Return compliance notes, pricing references, and campaign-usable claims.`;
}

function bindLibraryWorkspace({
  $,
  projectName,
  session,
  assetsData,
  registry,
  categoryReadiness,
  missingRequiredAssets,
  navigateTo,
  reloadProjectData,
  showMessage,
  showError,
  escapeHtml
}) {
  const catalog = getAssetCatalog(assetsData);
  const categoryByType = getCategoryByType(categoryReadiness);
  const allAssets = normalizeAssets(projectName, assetsData, registry, categoryByType, catalog);
  const categoryBuckets = buildCategoryBuckets(categoryReadiness);
  const bucketMap = new Map(categoryBuckets.map((item) => [item.key, item]));
  const filteredAssets = getFilteredAssets(allAssets, session, bucketMap);
  const selectedAssetExists = filteredAssets.some((asset) => asset.id === session.selectedAssetId);
  if (!selectedAssetExists) {
    session.selectedAssetId = filteredAssets[0]?.id || allAssets[0]?.id || "";
  }

  const selectedAsset = allAssets.find((asset) => asset.id === session.selectedAssetId) || null;
  const missingDetails = buildMissingDetails(categoryReadiness);
  const overview = buildAssetOverview({
    assets: allAssets,
    categoryReadiness,
    missingRequiredAssets,
    recentUploads: session.recentUploads
  });

  const overviewBox = $("libraryOverviewCards");
  if (overviewBox) {
    overviewBox.innerHTML = `
      <article class="data-card smart-overview-card">
        <span class="data-label">Total assets</span>
        <strong>${escapeHtml(formatCount(overview.totalAssets))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Source-of-truth assets</span>
        <strong>${escapeHtml(formatCount(overview.sourceOfTruthAssets))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Missing required assets</span>
        <strong>${escapeHtml(formatCount(overview.missingRequiredAssets))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Recently uploaded</span>
        <strong>${escapeHtml(formatCount(overview.recentlyUploaded))}</strong>
      </article>
      <article class="data-card smart-overview-card">
        <span class="data-label">Ready for campaign</span>
        <strong>${escapeHtml(`${formatCount(overview.readyForCampaign)} / ${formatCount(overview.readyForCampaignTotal)}`)}</strong>
      </article>
    `;
  }

  const categoryBox = $("libraryCategoryCards");
  if (categoryBox) {
    categoryBox.innerHTML = categoryBuckets.map((bucket) => {
      const tone = getAssetStatusTone(bucket.status === "Ready" ? "Approved" : bucket.status);
      const activeClass = session.selectedCategoryKey === bucket.key ? "is-active" : "";
      const usedIn = bucket.used_in.length ? bucket.used_in.join(", ") : "Library";

      return `
        <button class="library-category-chip ${tone} ${activeClass}" type="button" data-library-bucket="${escapeHtml(bucket.key)}">
          <div class="library-category-chip-head">
            <span>${escapeHtml(bucket.label)}</span>
            <span class="card-badge ${tone}">${escapeHtml(bucket.status)}</span>
          </div>
          <div class="library-category-chip-meta">${escapeHtml(`${formatCount(bucket.count)} files`)}</div>
          <div class="library-category-chip-used">${escapeHtml(usedIn)}</div>
        </button>
      `;
    }).join("");
  }

  const tableBody = $("libraryAssetTableBody");
  if (tableBody) {
    tableBody.innerHTML = filteredAssets.length
      ? filteredAssets.map((asset) => {
        const tone = getAssetStatusTone(asset.category_status);
        return `
          <tr class="${session.selectedAssetId === asset.id ? "is-active" : ""}">
            <td>${escapeHtml(asset.name)}</td>
            <td>
              <div>${escapeHtml(asset.category_label)}</div>
              <small class="library-table-type">${escapeHtml(asset.asset_type)}</small>
            </td>
            <td><span class="card-badge ${tone}">${escapeHtml(asset.category_status)}</span></td>
            <td>${escapeHtml(asset.used_in.join(", ") || "Library")}</td>
            <td>
              <div class="library-table-actions">
                <button class="btn btn-secondary" type="button" data-library-select="${escapeHtml(asset.id)}">Select</button>
                <div class="library-actions">
                  ${asset.preview_url ? `<a class="btn btn-primary btn-sm library-link-btn" href="${escapeHtml(asset.preview_url)}" target="_blank" rel="noreferrer">Open</a>` : `<button class="btn btn-primary btn-sm" type="button" disabled>Open</button>`}
                  <div class="library-action-menu">
                    <button class="btn btn-secondary btn-sm library-action-toggle" type="button">Actions ▾</button>
                    <div class="library-action-dropdown">
                      <button type="button" data-asset-status-action="approved" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Approve</button>
                      <button type="button" data-asset-status-action="needs_review" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Needs Review</button>
                      <button type="button" data-asset-status-action="rejected" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Reject</button>
                      <button type="button" data-asset-status-action="archived" data-asset-id="${escapeHtml(asset.asset_id || asset.assetId || asset.id || "")}" data-asset-project="${escapeHtml(projectName)}">Archive</button>
                    </div>
                  </div>
                  <button class="btn btn-secondary btn-sm" type="button" data-copy-asset-path="${escapeHtml(asset.file_path || asset.local_path || asset.preview_url || "")}">Copy Path</button>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join("")
      : `<tr><td colspan="5"><div class="empty-box">No assets match this view.</div></td></tr>`;
  }

  const previewVisual = $("libraryPreviewVisual");
  if (previewVisual) {
    previewVisual.innerHTML = renderPreview(selectedAsset, escapeHtml);
  }

  const previewMeta = $("libraryPreviewMeta");
  if (previewMeta) {
    previewMeta.innerHTML = selectedAsset
      ? `
        <div class="data-stack">
          <div class="data-row"><span>Name</span><strong>${escapeHtml(selectedAsset.name)}</strong></div>
          <div class="data-row"><span>Type</span><strong>${escapeHtml(selectedAsset.asset_type)}</strong></div>
          <div class="data-row"><span>Status</span><strong>${escapeHtml(selectedAsset.category_status)}</strong></div>
          <div class="data-row"><span>Source of truth</span><strong>${escapeHtml(selectedAsset.source_of_truth ? "Yes" : "No")}</strong></div>
          <div class="data-row"><span>Uploaded</span><strong>${escapeHtml(formatDate(selectedAsset.uploaded_at))}</strong></div>
          <div class="data-row"><span>Path</span><strong>${escapeHtml(selectedAsset.file_path || "-")}</strong></div>
        </div>
      `
      : `<div class="empty-box">Select an asset to view details.</div>`;
  }

  const missingBox = $("libraryMissingAssetsList");
  if (missingBox) {
    missingBox.innerHTML = missingDetails.length
      ? missingDetails.map((item) => `
        <article class="library-missing-card">
          <div class="library-missing-head">
            <strong>${escapeHtml(item.label)}</strong>
            <button class="btn btn-primary" type="button" data-library-upload-type="${escapeHtml(item.asset_type)}">Upload</button>
          </div>
          <p>${escapeHtml(item.why)}</p>
          <small>${escapeHtml(item.used_in.length ? `Used in: ${item.used_in.join(", ")}` : "Used in: Library")}</small>
        </article>
      `).join("")
      : `<div class="empty-box">All required asset categories are covered.</div>`;
  }

  const uploadSummary = $("libraryUploadSummary");
  if (uploadSummary) {
    uploadSummary.innerHTML = session.recentUploads.length
      ? `
        <ul class="simple-list">
          ${session.recentUploads.slice(0, 5).map((item) => `
            <li>
              <strong>${escapeHtml(item.filename)}</strong>
              <span>${escapeHtml(`${item.asset_type} • ${item.status === "success" ? "Uploaded" : "Failed"}`)}</span>
            </li>
          `).join("")}
        </ul>
      `
      : `<div class="empty-box">No uploads in this session yet.</div>`;
  }

  const categoryButtons = Array.from(document.querySelectorAll("[data-library-bucket]"));
  categoryButtons.forEach((button) => {
    button.onclick = () => {
      session.selectedCategoryKey = button.getAttribute("data-library-bucket") || "all";
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };
  });

  const selectButtons = Array.from(document.querySelectorAll("[data-library-select]"));
  selectButtons.forEach((button) => {
    button.onclick = () => {
      session.selectedAssetId = button.getAttribute("data-library-select") || "";
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };
  });

  const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));
  pickUploadTypeButtons.forEach((button) => {
    button.onclick = () => {
      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
      session.uploadType = uploadType;
      const uploadTypeSelect = $("libraryUploadTypeSelect");
      if (uploadTypeSelect) {
        uploadTypeSelect.value = uploadType;
      }
      showMessage?.(`Upload category set to ${uploadType}.`);
    };
  });

  const searchInput = $("librarySearchInput");
  if (searchInput) {
    searchInput.value = session.searchQuery;
    searchInput.oninput = (event) => {
      session.searchQuery = event.target.value || "";
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });
    };
  }

  const uploadTypeSelect = $("libraryUploadTypeSelect");
  if (uploadTypeSelect) {
    uploadTypeSelect.value = session.uploadType;
    uploadTypeSelect.onchange = (event) => {
      session.uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
    };
  }

  const dropZone = $("libraryDropZone");
  const uploadInput = $("libraryUploadInput");
  if (dropZone && uploadInput) {
    const syncDroppedFilesToInput = (files) => {
      try {
        const transfer = new DataTransfer();
        files.forEach((file) => transfer.items.add(file));
        uploadInput.files = transfer.files;
      } catch (_) {
        // Browser may block synthetic file assignment.
      }
      const names = files.slice(0, 6).map((file) => file.name).join(", ");
      const suffix = files.length > 6 ? ` +${files.length - 6} more` : "";
      const message = files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected: ${names}${suffix}` : "No files selected";
      const info = $("libraryDropInfo");
      if (info) info.textContent = message;
    };

    dropZone.onclick = () => uploadInput.click();
    uploadInput.onchange = () => {
      const files = Array.from(uploadInput.files || []);
      syncDroppedFilesToInput(files);
    };

    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.add("is-drag-active");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.remove("is-drag-active");
      });
    });

    dropZone.addEventListener("drop", (event) => {
      const files = Array.from(event.dataTransfer?.files || []);
      if (!files.length) return;
      syncDroppedFilesToInput(files);
    });
  }

  const uploadBtn = $("libraryUploadBtn");
  if (uploadBtn) {
    uploadBtn.disabled = session.uploading;
    uploadBtn.textContent = session.uploading ? "Uploading..." : "Upload";
    uploadBtn.onclick = async () => {
      if (!projectName) {
        showError?.("Select a project before uploading.");
        return;
      }

      if (session.uploading) return;

      const files = Array.from($("libraryUploadInput")?.files || []);
      if (!files.length) {
        showError?.("Select at least one file to upload.");
        return;
      }

      let assetType = "";
      try {
        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
      } catch (error) {
        showError?.(error.message || "Invalid upload category.");
        return;
      }

      const uploaded = [];
      const failed = [];

      session.uploading = true;
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        registry,
        categoryReadiness,
        missingRequiredAssets,
        navigateTo,
        reloadProjectData,
        showMessage,
        showError,
        escapeHtml
      });

      try {
        for (const file of files) {
          try {
            const result = await uploadProjectAsset(projectName, assetType, file);
            uploaded.push({
              filename: result?.filename || file.name,
              asset_type: assetType,
              status: "success",
              created_at: new Date().toISOString()
            });
          } catch (error) {
            failed.push({
              filename: file.name,
              asset_type: assetType,
              status: "failed",
              error: error.message || "Upload failed",
              created_at: new Date().toISOString()
            });
          }
        }

        session.recentUploads = [...uploaded, ...failed, ...session.recentUploads].slice(0, 20);

        if (uploaded.length && typeof reloadProjectData === "function") {
          await reloadProjectData(projectName);
        }

        const input = $("libraryUploadInput");
        if (input) input.value = "";
        const dropInfo = $("libraryDropInfo");
        if (dropInfo) dropInfo.textContent = "No files selected";

        if (uploaded.length && !failed.length) {
          showMessage?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}.`);
        } else if (uploaded.length && failed.length) {
          showError?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}, ${failed.length} failed.`);
        } else {
          showError?.("Upload failed for all selected files.");
        }
      } finally {
        session.uploading = false;
      }
    };
  }

  const refreshBtn = $("libraryRefreshScanBtn");
  if (refreshBtn) {
    refreshBtn.onclick = async () => {
      if (!projectName) {
        showError?.("Select a project before refreshing.");
        return;
      }
      refreshBtn.disabled = true;
      try {
        await refreshProjectLibrary(projectName);
        await reloadProjectData?.(projectName);
        showMessage?.("Library scan refreshed.");
      } catch (error) {
        showError?.(error.message || "Failed to refresh library scan.");
      } finally {
        refreshBtn.disabled = false;
      }
    };
  }

  const classifyBtn = $("libraryAiClassifyBtn");
  if (classifyBtn) {
    classifyBtn.onclick = () => {
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "classify");
      navigateTo("ai-command");
      showMessage?.("AI classification prompt sent.");
    };
  }

  const missingBtn = $("libraryAiMissingBtn");
  if (missingBtn) {
    missingBtn.onclick = () => {
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "missing", { missing: missingRequiredAssets });
      navigateTo("ai-command");
      showMessage?.("AI missing-assets prompt sent.");
    };
  }

  const extractBtn = $("libraryAiExtractBtn");
  if (extractBtn) {
    extractBtn.onclick = () => {
      const docs = filteredAssets
        .filter((asset) => ["pdf", "doc", "docx", "txt", "md", "csv", "xlsx"].includes(asset.extension))
        .slice(0, 8)
        .map((asset) => asset.name);
      const input = $("quickCommandInput");
      if (input) input.value = buildAiPrompt(projectName, "extract", { docs });
      navigateTo("ai-command");
      showMessage?.("AI document extraction prompt sent.");
    };
  }
}

export const libraryRoute = {
  id: "library",
  meta: {
    eyebrow: "Start",
    title: "Library",
    description: "Smart Asset Library"
  },
  template: `
    <section class="page is-active" data-page="library">
      <div id="libraryRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    navigateTo,
    showMessage,
    showError,
    reloadProjectData
  }) {
    const state = getState();
    const projectName = state.context.currentProject || "";
    const assetsData = asObject(state.data.assets);
    const registry = asObject(state.data.registry);
    const session = ensureLibrarySession(projectName);
    const categoryReadiness = getCategoryReadinessList(assetsData);
    const missingRequiredAssets = getMissingAssetLabels(assetsData);
    const root = $("libraryRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="library-smart-shell">
        <section class="card">
          <div class="card-head">
            <div>
              <div class="setup-kicker">Smart Asset Library</div>
              <h3>${escapeHtml(projectName ? `${projectName} Assets` : "Project Assets")}</h3>
            </div>
            <button id="libraryRefreshScanBtn" class="btn btn-secondary" type="button">Refresh</button>
          </div>
          <div id="libraryOverviewCards" class="library-overview-grid"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Upload Center</h3>
            <span class="card-badge neutral">Drag and drop</span>
          </div>
          <div class="library-upload-grid">
            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
              <strong>Drop files here</strong>
              <span>or click to browse</span>
              <small id="libraryDropInfo">No files selected</small>
              <input id="libraryUploadInput" type="file" multiple hidden>
            </div>
            <div class="library-upload-controls">
              <label class="setup-label" for="libraryUploadTypeSelect">Category</label>
              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
                ${getAssetCatalog(assetsData).map((item) => `
                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
                `).join("")}
              </select>
              <div class="setup-helper">Supported: images, videos, documents, spreadsheets, and archives based on selected category.</div>
              <button id="libraryUploadBtn" class="btn btn-primary" type="button">Upload</button>
            </div>
          </div>
          <div id="libraryUploadSummary" style="margin-top: 12px;"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Asset Categories</h3>
            <span class="card-badge neutral">Readiness</span>
          </div>
          <div class="library-category-chip-grid">
            <button class="library-category-chip neutral is-active" type="button" data-library-bucket="all">
              <div class="library-category-chip-head">
                <span>All Assets</span>
                <span class="card-badge neutral">View</span>
              </div>
              <div class="library-category-chip-meta">All categories</div>
              <div class="library-category-chip-used">Library overview</div>
            </button>
            <div id="libraryCategoryCards" class="library-category-chip-group"></div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Assets</h3>
            <input id="librarySearchInput" class="setup-input" type="text" placeholder="Search by name, type, status, or usage" style="max-width: 320px;">
          </div>
          <div class="library-table-wrap">
            <table class="library-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Used in</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="libraryAssetTableBody"></tbody>
            </table>
          </div>
        </section>

        <div class="library-smart-columns">
          <section class="card">
            <div class="card-head">
              <h3>Preview</h3>
              <span class="card-badge neutral">Selected asset</span>
            </div>
            <div id="libraryPreviewVisual"></div>
            <div id="libraryPreviewMeta" style="margin-top: 12px;"></div>
          </section>

          <section class="card">
            <div class="card-head">
              <h3>Missing Assets</h3>
              <span class="card-badge ${missingRequiredAssets.length ? "warning" : "success"}">${escapeHtml(missingRequiredAssets.length ? `${missingRequiredAssets.length} missing` : "Covered")}</span>
            </div>
            <div id="libraryMissingAssetsList"></div>
          </section>
        </div>

        <section class="card">
          <div class="card-head">
            <h3>AI Asset Assistant</h3>
            <span class="card-badge neutral">Quick actions</span>
          </div>
          <div class="quick-actions library-ai-actions">
            <button id="libraryAiClassifyBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Classify files</span>
              <span class="home-action-meta">Suggest clean category mapping and source-of-truth candidates.</span>
            </button>
            <button id="libraryAiMissingBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Find missing files</span>
              <span class="home-action-meta">Prioritize what to upload next to unblock campaigns.</span>
            </button>
            <button id="libraryAiExtractBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Extract document info</span>
              <span class="home-action-meta">Pull legal, pricing, and campaign facts from docs.</span>
            </button>
          </div>
        </section>
      </div>
    `;

    bindLibraryWorkspace({
      $,
      projectName,
      session,
      assetsData,
      registry,
      categoryReadiness,
      missingRequiredAssets,
      navigateTo,
      reloadProjectData,
      showMessage,
      showError,
      escapeHtml
    });
  }
};

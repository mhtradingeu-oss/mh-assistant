# LIB-FINAL-4 — Required Asset Card Render Source

Generated: Sat Jun  6 08:24:41 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: e143d34

public/control-center/pages/library.js:69:  testimonials_reviews: "Testimonials & Reviews",
public/control-center/pages/library.js:642:  if (value === "needs_review") return "Needs Review";
public/control-center/pages/library.js:700:      merged.readiness_status ||
public/control-center/pages/library.js:806:    status: normalizeReadinessStatus(asset.status || asset.readiness_status || "needs_review"),
public/control-center/pages/library.js:858:          status: libraryAsset.status || libraryAsset.readiness_status || item.status
public/control-center/pages/library.js:892:  const needsReviewAssets = assets.filter((asset) => ["needs_review", "uploaded"].includes(asset.status)).length;
public/control-center/pages/library.js:893:  const missingRequiredAssets = requiredGroups.filter((item) => item.status === "missing").length;
public/control-center/pages/library.js:901:    needsReviewAssets,
public/control-center/pages/library.js:902:    missingRequiredAssets,
public/control-center/pages/library.js:907:      ? `${nextAction.status === "missing" ? "Upload" : "Review"} ${nextAction.label}`
public/control-center/pages/library.js:922:    let status = "Needs Review";
public/control-center/pages/library.js:926:      status = "Needs Review";
public/control-center/pages/library.js:1371:    return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
public/control-center/pages/library.js:1495:  missingRequiredAssets,
public/control-center/pages/library.js:1515:      missingRequiredAssets,
public/control-center/pages/library.js:1567:  const readinessSummary = {
public/control-center/pages/library.js:1571:    needsReviewCount: requiredGroups.filter((item) => item.status === "needs_review").length,
public/control-center/pages/library.js:1572:    readinessScore: requiredGroups.length
public/control-center/pages/library.js:1638:      const actionLabel = item.action === "upload" ? "Upload" : item.action === "review" ? "Review" : "Classify";
public/control-center/pages/library.js:1639:      const statusLabel = item.status === "present" ? "Present" : item.status === "missing" ? "Missing" : "Needs Review";
public/control-center/pages/library.js:1643:        <article class="library-required-card">
public/control-center/pages/library.js:1644:          <div class="library-required-card-head">
public/control-center/pages/library.js:1648:          <p class="library-required-why">${escapeHtml(reasonHint)}</p>
public/control-center/pages/library.js:1649:          <div class="library-required-card-foot">
public/control-center/pages/library.js:1654:              data-library-required-action="${escapeHtml(item.action)}"
public/control-center/pages/library.js:1655:              data-library-required-key="${escapeHtml(item.key)}"
public/control-center/pages/library.js:1690:        missingRequiredAssets,
public/control-center/pages/library.js:1721:        missingRequiredAssets,
public/control-center/pages/library.js:1757:        missingRequiredAssets,
public/control-center/pages/library.js:1788:        missingRequiredAssets,
public/control-center/pages/library.js:1904:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Review Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Review Source in AI Command</button>
public/control-center/pages/library.js:1913:            <div class="data-row"><span>Review Status</span><strong>${escapeHtml(toStatusLabel(selectedAsset.status))}</strong></div>
public/control-center/pages/library.js:1933:      useBtn.textContent = "Use as Review Source in AI Command";
public/control-center/pages/library.js:1934:      useBtn.setAttribute("aria-label", "Use as Review Source in AI Command");
public/control-center/pages/library.js:1973:      readiness: readinessSummary,
public/control-center/pages/library.js:2011:  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
public/control-center/pages/library.js:2014:      const action = button.getAttribute("data-library-required-action") || "review";
public/control-center/pages/library.js:2016:      const requiredKey = button.getAttribute("data-library-required-key") || "";
public/control-center/pages/library.js:2023:      // Try to find a matching folder/filter for the required asset group
public/control-center/pages/library.js:2054:          missingRequiredAssets,
public/control-center/pages/library.js:2082:          missingRequiredAssets,
public/control-center/pages/library.js:2095:      showMessage?.("Classification request prepared. Review AI suggestions before applying changes.");
public/control-center/pages/library.js:2113:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2122:        missingRequiredAssets,
public/control-center/pages/library.js:2148:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2157:        missingRequiredAssets,
public/control-center/pages/library.js:2177:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2186:        missingRequiredAssets,
public/control-center/pages/library.js:2208:      if (_fbCard?.name) showMessage?.(`Selected ${_fbCard.name}. Review status and available actions.`);
public/control-center/pages/library.js:2223:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2359:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness metadata and may affect downstream review/publishing visibility. It does not publish anything.\n\nSelect Cancel to keep the current status.`);
public/control-center/pages/library.js:2738:        missingRequiredAssets,
public/control-center/pages/library.js:2819:  const classifyBtn = $("libraryAiClassifyBtn");
public/control-center/pages/library.js:2825:      showMessage?.("Classification request prepared. Review AI suggestions before applying changes.");
public/control-center/pages/library.js:2833:      if (input) input.value = buildAiPrompt(projectName, "missing", { missing: missingRequiredAssets });
public/control-center/pages/library.js:2850:      showMessage?.("Document extraction prompt prepared. Review extracted claims before use.");
public/control-center/pages/library.js:2864:      showMessage?.("Document extraction prompt prepared. Review extracted claims before use.");
public/control-center/pages/library.js:2978:    const missingRequiredAssets = getMissingAssetLabels(assetsData);
public/control-center/pages/library.js:3009:                ${escapeHtml(`${formatCount(overview.totalAssets || 0)} assets · ${formatCount(overview.sourceOfTruthAssets || 0)} source-of-truth · ${formatCount(overview.needsReviewAssets || 0)} need review · ${formatCount(overview.approvedAssets || 0)} approved · ${String(overview.sourceCoverage || 0)}% source coverage`)}
public/control-center/pages/library.js:3019:            <h3>Required Asset Evidence</h3>
public/control-center/pages/library.js:3020:            <p class="card-subtitle">Track the source files, product data, media, and proof needed for campaign readiness. Review here does not approve, publish, or change asset truth automatically.</p>
public/control-center/pages/library.js:3023:          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
public/control-center/pages/library.js:3029:            <p class="card-subtitle">Upload, classify, and prepare asset candidates. Approval, source-of-truth status, and publishing readiness remain controlled follow-up steps.</p>
public/control-center/pages/library.js:3031:              <button id="libraryAiClassifyBtn" class="btn btn-secondary" type="button">Classify Assets</button>
public/control-center/pages/library.js:3032:              <button id="libraryAiMissingBtn" class="btn btn-secondary" type="button">Review Missing</button>
public/control-center/pages/library.js:3045:              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
public/control-center/pages/library.js:3051:              <div class="setup-helper">Upload and classify for readiness in one step.</div>
public/control-center/pages/library.js:3156:      missingRequiredAssets,
public/control-center/pages/library/action-panel.js:35:          <span>Review Status</span>
public/control-center/pages/library/ai-panel.js:1:export function renderLibraryAiPanel({ readiness = {}, selectedAsset = null, disabled = false } = {}) {
public/control-center/pages/library/ai-panel.js:3:  const missingCountNumber = Number(readiness?.missingCount || 0);
public/control-center/pages/library/ai-panel.js:4:  const readinessScoreValue = readiness?.readinessScore == null ? null : Number(readiness.readinessScore);
public/control-center/pages/library/ai-panel.js:7:  const readinessScore = escapePanelHtml(readinessScoreValue == null || Number.isNaN(readinessScoreValue) ? "n/a" : `${readinessScoreValue}%`);
public/control-center/pages/library/ai-panel.js:8:  const nextBestAction = buildLibraryAiNextBestAction({ readiness, selectedAsset });
public/control-center/pages/library/ai-panel.js:30:          <span>Review Status</span>
public/control-center/pages/library/ai-panel.js:39:          <strong>${readinessScore}</strong>
public/control-center/pages/library/ai-panel.js:63:function buildLibraryAiNextBestAction({ readiness = {}, selectedAsset = null } = {}) {
public/control-center/pages/library/ai-panel.js:64:  const missingCount = Number(readiness?.missingCount || 0);
public/control-center/pages/library/ai-panel.js:88:      description: "This asset is selected but not marked as source-of-truth. Review it before using it across campaigns.",
public/control-center/pages/library/ai-panel.js:95:      title: "Review before production",
public/control-center/pages/library/catalog-readiness.js:31:  const readinessScore = required.length
public/control-center/pages/library/catalog-readiness.js:40:    readinessScore,
public/control-center/pages/library/catalog-readiness.js:46:export function buildLibraryNextBestAction(readiness = {}) {
public/control-center/pages/library/catalog-readiness.js:47:  if (readiness.missingCount > 0) {
public/control-center/pages/library/catalog-readiness.js:52:      reason: `${readiness.missingCount} required asset categories are still missing.`,
public/control-center/pages/library/catalog-readiness.js:60:    label: "Review and approve Library assets",
public/control-center/pages/library/catalog-readiness.js:61:    reason: "Required asset coverage is available. Review quality and source-of-truth status.",

## Render excerpt
              <p class="setup-helper">
                ${escapeHtml(`${formatCount(overview.totalAssets || 0)} assets · ${formatCount(overview.sourceOfTruthAssets || 0)} source-of-truth · ${formatCount(overview.needsReviewAssets || 0)} need review · ${formatCount(overview.approvedAssets || 0)} approved · ${String(overview.sourceCoverage || 0)}% source coverage`)}
              </p>
            </div>
            <button id="libraryRefreshScanBtn" class="btn btn-secondary" type="button">Refresh Library scan</button>
          </div>
          <div id="libraryOverviewCards" class="library-overview-grid"></div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Required Asset Evidence</h3>
            <p class="card-subtitle">Track the source files, product data, media, and proof needed for campaign readiness. Review here does not approve, publish, or change asset truth automatically.</p>
            <span class="card-badge warning">Readiness gaps</span>
          </div>
          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
        </section>

        <section class="card library-actions-card">
          <div class="card-head">
            <h3>Asset Intake</h3>
            <p class="card-subtitle">Upload, classify, and prepare asset candidates. Approval, source-of-truth status, and publishing readiness remain controlled follow-up steps.</p>
            <div class="library-action-toolbar">
              <button id="libraryAiClassifyBtn" class="btn btn-secondary" type="button">Classify Assets</button>
              <button id="libraryAiMissingBtn" class="btn btn-secondary" type="button">Review Missing</button>
              <button id="libraryAiExtractBtn" class="btn btn-secondary" type="button">Extract Docs</button>
            </div>
          </div>
          <div class="library-upload-grid">
            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
              <strong>Upload asset to Library</strong>
              <span>Drop files or click to browse</span>
              <small id="libraryDropInfo">No files selected</small>
              <button id="libraryChooseFilesBtn" class="btn btn-secondary btn-sm" type="button">Choose Files</button>
              <input id="libraryUploadInput" class="library-file-input" type="file" multiple>
            </div>
            <div class="library-upload-controls">
              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
                ${getAssetCatalog(assetsData).map((item) => `
                  <option value="${escapeHtml(item.asset_type)}"${session.uploadType === item.asset_type ? " selected" : ""}>${escapeHtml(item.display_label || item.label)}</option>
                `).join("")}
              </select>
              <div class="setup-helper">Upload and classify for readiness in one step.</div>
              <button id="libraryUploadBtn" class="btn btn-primary" type="button">Upload asset to Library</button>
            </div>
          </div>
          <div id="libraryUploadSummary" class="library-upload-summary"></div>
        </section>

        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">

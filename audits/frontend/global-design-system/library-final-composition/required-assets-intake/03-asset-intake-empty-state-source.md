# LIB-FINAL-4 — Asset Intake Empty State Source

Generated: Sat Jun  6 08:24:41 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: e143d34

public/control-center/pages/library.js:1995:  const uploadSummary = $("libraryUploadSummary");
public/control-center/pages/library.js:2008:      : `<div class="empty-box">No uploads in this session yet. Choose files and upload them to start building the asset library.</div>`;
public/control-center/pages/library.js:2020:      const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2067:        const uploadInput = $("libraryUploadInput");
public/control-center/pages/library.js:2277:    toolbarUpload.onclick = () => $("libraryUploadInput")?.click();
public/control-center/pages/library.js:2514:      const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2569:  const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2592:  const dropZone = $("libraryDropZone");
public/control-center/pages/library.js:2593:  const uploadInput = $("libraryUploadInput");
public/control-center/pages/library.js:2594:  const uploadBtn = $("libraryUploadBtn");
public/control-center/pages/library.js:2606:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:2699:    uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
public/control-center/pages/library.js:2700:    uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:2711:      const files = Array.from($("libraryUploadInput")?.files || []);
public/control-center/pages/library.js:2719:        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
public/control-center/pages/library.js:2774:        const input = $("libraryUploadInput");
public/control-center/pages/library.js:2778:        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
public/control-center/pages/library.js:2779:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:2790:        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
public/control-center/pages/library.js:2791:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:3028:            <h3>Asset Intake</h3>
public/control-center/pages/library.js:3029:            <p class="card-subtitle">Upload, classify, and prepare asset candidates. Approval, source-of-truth status, and publishing readiness remain controlled follow-up steps.</p>
public/control-center/pages/library.js:3037:            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
public/control-center/pages/library.js:3038:              <strong>Upload asset to Library</strong>
public/control-center/pages/library.js:3042:              <input id="libraryUploadInput" class="library-file-input" type="file" multiple>
public/control-center/pages/library.js:3045:              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
public/control-center/pages/library.js:3046:              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
public/control-center/pages/library.js:3052:              <button id="libraryUploadBtn" class="btn btn-primary" type="button">Upload asset to Library</button>
public/control-center/pages/library.js:3055:          <div id="libraryUploadSummary" class="library-upload-summary"></div>

## Intake excerpt
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
            <div class="card-head">
              <h3>Asset Workspace</h3>
            <span class="card-badge neutral">Inspect, filter, and route trusted assets</span>
          </div>
          ${sourceGuideHtml ? `<div id="librarySourceBridgeGuideBox" class="library-source-guide-inline">${sourceGuideHtml}</div>` : ""}
            <div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode || "grid")}">
            <div class="library-workspace-main">
              <div class="library-finder-topbar">
                <div class="library-finder-sidebar-title"></div>
                <div class="library-folder-list">
                  ${LIBRARY_FOLDERS.map((folder) => {
      const count = folderCounts.find((item) => item.key === folder.key)?.count || 0;
      const active = (session.folderKey || "all_assets") === folder.key;
      return `
                      <button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">
                        <span>${escapeHtml(folder.label)}</span>
                        <small>${escapeHtml(formatCount(count))}</small>
                      </button>
                    `;
    }).join("")}
                </div>
              </div>

              <div class="library-finder-toolbar">
                <button id="libraryToolbarUploadBtn" class="btn btn-secondary btn-sm" type="button">Quick Upload</button>
              </div>

              <div class="library-filter-bar">
                <div class="library-filter-field">
                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>

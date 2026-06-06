# 06 — Current Mutation Handlers Excerpt

Generated: Sat Jun  6 11:05:57 CEST 2026

## Source/status/archive/rename/delete handlers
      }

      try {
        await openLibraryAsset(projectName, asset);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : `Could not open file: ${error.message || "Unknown error."}`;
        showError?.(message);
      }
    };
  });

  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
  sourceOfTruthButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before updating source of truth.");
        return;
      }

      const assetId = button.getAttribute("data-library-source-truth") || "";
      const asset = allAssets.find((item) => item.id === assetId);
      if (!asset) {
        showError?.("Asset not found.");
        return;
      }

      try {
        await setProjectAssetSourceOfTruth(activeProjectName, asset.asset_id || asset.id, !asset.source_of_truth);
        session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update source of truth.");
        showError?.(message);
      }
    };
  });

  const statusActionButtons = Array.from(document.querySelectorAll("[data-asset-status-action]"));
  statusActionButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before updating asset status.");
        return;
      }

      const status = button.getAttribute("data-asset-status-action") || "needs_review";
      const id = button.getAttribute("data-library-asset") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness metadata and may affect downstream review/publishing visibility. It does not publish anything.\n\nSelect Cancel to keep the current status.`);
      if (!confirmed) {
        return;
      }

      try {
        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.(`Asset status updated to ${toStatusLabel(status)}.`);
      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);
      }
    };
  });

  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
  archiveButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before archiving assets.");
        return;
      }

      const id = button.getAttribute("data-library-archive") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry. This does not delete the physical file.\n\nSelect Cancel to keep this asset active.`)) {
        return;
      }

      try {
        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
        if (asset?.id) session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset archived.");
      } catch (error) {
        showError?.(error.message || "Failed to archive asset.");
      }
    };
  });

  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
  renameButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before renaming assets.");
        return;
      }

      const id = button.getAttribute("data-library-rename") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!asset || !assetId) {
        showError?.("Asset not found.");
        return;
      }

      const nextName = await promptForTextInput("Rename asset", asset.name || "");
      if (nextName == null) {
        return;
      }

      const normalized = nextName.trim();
      if (!normalized) {
        showError?.("Asset name cannot be empty.");
        return;
      }

      try {
        await renameProjectAsset(activeProjectName, assetId, normalized);
        session.selectedAssetId = asset.id;
        await reloadOrRerender();
        showMessage?.("Asset renamed.");
      } catch (error) {
        showError?.(error.message || "Failed to rename asset.");
      }
    };
  });

  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
  deleteButtons.forEach((button) => {
    button.onclick = async () => {
      closeAllLibraryActionDropdowns();
      const activeProjectName = resolveActiveProjectName();
      if (!activeProjectName) {
        showError?.("Select a project before deleting assets.");
        return;
      }

      const id = button.getAttribute("data-library-delete") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const asset = allAssets.find((item) => item.id === id) || allAssets.find((item) => asString(item.asset_id || item.id) === assetId);

      if (!assetId) {
        showError?.("Missing asset id.");
        return;
      }

      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows. This action does not silently publish, approve, or run workflows.\n\nSelect Cancel to keep this asset available.`)) {
        return;

## Upload handler
          session.page = 1;
        }
      });

      if (librarySearchRenderTimer) {
        window.clearTimeout(librarySearchRenderTimer);
      }

      librarySearchRenderTimer = window.setTimeout(() => {
        rerender();
      }, 1000);
    };
  }

  const uploadTypeSelect = $("libraryUploadTypeSelect");
  if (uploadTypeSelect) {
    const catalog = getAssetCatalog(assetsData);
    uploadTypeSelect.innerHTML = catalog.map((item) => {
      const assetType = item.asset_type;
      const label = getLibraryUploadTypeLabel(assetType);
      return `<option value="${escapeHtml(assetType)}"${session.uploadType === assetType ? " selected" : ""}>${escapeHtml(label)}</option>`;
    }).join("");
    uploadTypeSelect.value = session.uploadType;
    uploadTypeSelect.onchange = (event) => {
      const uploadType = getSafeAssetType(event.target.value || "logo") || "logo";

      dispatchLibraryCommand("upload-type-change", { uploadType }, {
        "upload-type-change": ({ uploadType: nextUploadType }) => ({
          shadow: true,
          uploadType: nextUploadType
        })
      });

      session.uploadType = getSafeAssetType(event.target.value || "logo") || "logo";
    };
  }

  const dropZone = $("libraryDropZone");
  const uploadInput = $("libraryUploadInput");
  const uploadBtn = $("libraryUploadBtn");
  if (dropZone && uploadInput) {
    const updateUploadUiState = () => {
      const files = Array.from(uploadInput.files || []);
      const names = files.slice(0, 6).map((file) => file.name).join(", ");
      const suffix = files.length > 6 ? ` +${files.length - 6} more` : "";
      const message = files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected: ${names}${suffix}` : "No files selected";
      const info = $("libraryDropInfo");
      if (info) info.textContent = message;

      if (uploadBtn) {
        uploadBtn.disabled = session.uploading || files.length === 0;
        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
      }
    };

    const syncDroppedFilesToInput = (files) => {
      try {
        const transfer = new DataTransfer();
        files.forEach((file) => transfer.items.add(file));
        uploadInput.files = transfer.files;
      } catch (_) {
        // Browser may block synthetic file assignment.
      }
      updateUploadUiState();
    };

    dropZone.onclick = (event) => {
      event.preventDefault();
      openLibraryFilePicker();
    };

    dropZone.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        uploadInput.click();
      }
    };
    uploadInput.onchange = () => {
      updateUploadUiState();

      const files = Array.from(uploadInput.files || []);
      if (files.length) {
        showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
      }
    };

    if (!dropZone.dataset.libraryDndBound) {
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

      dropZone.dataset.libraryDndBound = "1";
    }

    const openLibraryFilePicker = () => {
      const picker = document.createElement("input");
      picker.type = "file";
      picker.multiple = true;
      picker.style.position = "fixed";
      picker.style.left = "-9999px";
      picker.style.top = "0";
      document.body.appendChild(picker);

      picker.onchange = () => {
        const files = Array.from(picker.files || []);
        if (files.length) {
          syncDroppedFilesToInput(files);
          showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
        }
        picker.remove();
      };

      picker.click();
    };

    const chooseFilesBtn = $("libraryChooseFilesBtn");
    if (chooseFilesBtn) {
      chooseFilesBtn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLibraryFilePicker();
      };
    }

    updateUploadUiState();
  }

  if (uploadBtn) {
    uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
    uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
    uploadBtn.onclick = async () => {
      const activeProjectName = resolveActiveProjectName();

      if (!activeProjectName) {
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
      let reloadedFromServer = false;

      session.uploading = true;
      bindLibraryWorkspace({
        $,
        projectName,
        session,
        assetsData,
        operations,
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
            const result = await uploadProjectAsset(activeProjectName, assetType, file);
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

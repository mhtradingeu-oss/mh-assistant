# 03 — Reclassify Handler

      } catch (error) {
        const message = error instanceof AccessKeyError
          ? "Missing or invalid Control Center access key. Open Control Center Access and save a valid key."
          : (error.message || "Failed to update asset status.");
        showError?.(message);
      }
    };
  });

  const reclassifyButtons = Array.from(document.querySelectorAll("[data-library-reclassify]"));
  reclassifyButtons.forEach((button) => {
    button.onclick = async () => {
      const id = button.getAttribute("data-library-reclassify") || "";
      const assetId = button.getAttribute("data-asset-id") || "";
      const currentType = String(button.getAttribute("data-current-asset-type") || "").trim().toLowerCase();

      if (!assetId) {
        showError?.("This asset cannot be reclassified because it is not linked to the project registry.");
        return;
      }

      const allowedTypes = Object.keys(LIBRARY_UPLOAD_TYPE_LABELS);
      const normalizedType = String(button.getAttribute("data-target-asset-type") || "").trim().toLowerCase();

      if (!normalizedType) {
        showError?.("Choose a target group before moving this asset.");
        return;
      }

      if (!allowedTypes.includes(normalizedType)) {
        showError?.(`Invalid target group. Allowed: ${allowedTypes.join(", ")}`);
        return;
      }

      if (currentType && normalizedType === currentType) {
        showMessage?.(`Asset is already in ${getLibraryUploadTypeLabel(normalizedType)}.`);
        return;
      }

      const selectedAsset = allAssets.find((asset) => asset.id === id || asset.asset_id === assetId || asset.mutation_id === assetId);
      const assetLabel = selectedAsset?.name || selectedAsset?.filename || assetId;
      const confirmed = window.confirm(
        `Move "${assetLabel}" from ${getLibraryUploadTypeLabel(currentType) || "Unknown"} to ${getLibraryUploadTypeLabel(normalizedType)}?\n\nThis changes the Library group only. It will not move, rename, or edit the physical file.`
      );

      if (!confirmed) {
        return;
      }

      try {
        showMessage?.(`Moving asset to ${getLibraryUploadTypeLabel(normalizedType)}...`);
        await reclassifyProjectAsset(
          activeProjectName,
          assetId,
          normalizedType,
          `Moved from Library action panel to ${normalizedType}. Metadata reclassification only.`
        );

        session.selectedType = normalizedType;
        session.folderKey = "all_assets";
        session.page = 1;

        await reloadProjectData?.();
        showMessage?.(`Asset moved to ${getLibraryUploadTypeLabel(normalizedType)}.`);
        return;
      } catch (error) {
        if (error instanceof AccessKeyError) {
          showError?.("Reclassify requires a valid Control Center write key.");
          return;
        }
        showError?.(error?.message || "Failed to reclassify asset.");
      }
    };
  });

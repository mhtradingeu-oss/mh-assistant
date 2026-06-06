# LIB-FINAL-4C — Workspace Filter Render Evidence

Generated: Sat Jun  6 08:51:35 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: e143d34

557:      selectedType: "all",
971:  const selectedFolderKey = session.folderKey || "all_assets";
974:  const selectedType = session.selectedType || "all";
976:  const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"
994:    if (selectedFolderKey === "all_assets") return true;
995:    if (selectedFolderKey === "source_of_truth") return Boolean(asset.source_of_truth);
996:    if (selectedFolderKey === "archived") return statusValue === "archived";
997:    if (selectedFolderKey === "uploaded_session") {
1002:    const folder = LIBRARY_FOLDERS.find((item) => item.key === selectedFolderKey);
1014:    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
1016:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
1029:    return matchesBucket && matchesFolder && matchesType && matchesStatus && matchesSource && matchesSearch;
1487:function bindLibraryWorkspace({
1550:  session.page = Math.min(Math.max(Number(session.page) || 1, 1), totalPages);
1551:  const pageStart = (session.page - 1) * LIBRARY_PAGE_SIZE;
1664:  const typeSelect = $("libraryFilterTypeSelect");
1667:      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1669:    typeSelect.value = session.selectedType || "all";
1678:          session.selectedType = value;
1679:          session.page = 1;
1710:          session.page = 1;
1746:          session.page = 1;
1777:          session.page = 1;
1837:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="prev"${session.page <= 1 ? " disabled" : ""}>Previous</button>
1838:        <span>Page ${escapeHtml(String(session.page))} / ${escapeHtml(String(totalPages))}</span>
1839:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="next"${session.page >= totalPages ? " disabled" : ""}>Next</button>
2033:        session.folderKey = mappedFolder.key;
2034:        session.selectedType = uploadType;
2035:        session.page = 1;
2228:  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
2231:      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
2238:          session.folderKey = value;
2239:          session.page = 1;
2261:        session.page = 1;
2530:        ? Math.max(1, (Number(session.page) || 1) - 1)
2532:          ? Math.min(totalPages, (Number(session.page) || 1) + 1)
2533:          : Number(session.page) || 1;
2537:          session.page = page;
2555:          session.page = 1;
3071:      const active = (session.folderKey || "all_assets") === folder.key;
3073:                      <button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">
3088:                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
3089:                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>

## Workspace filter excerpt
    return {
      ...requirement,
      status,
      totalCount,
      used_in: [...new Set(entries.flatMap((entry) => asArray(entry.guidance?.used_in || [])))],
      action: status === "missing" ? "upload" : status === "needs_review" ? "review" : "classify"
    };
  });
}

function getFilteredAssets(allAssets, session, bucketMap) {
  const selectedFolderKey = session.folderKey || "all_assets";
  const selectedCategoryKey = session.selectedCategoryKey || "all";
  const selectedBucket = bucketMap.get(selectedCategoryKey) || null;
  const selectedType = session.selectedType || "all";
  const selectedStatus = session.selectedStatus || "active";
  const effectiveSelectedStatus = selectedFolderKey === "archived" && selectedStatus === "active"
    ? "archived"
    : selectedStatus;
  const selectedSource = session.selectedSource || "all";
  const sortBy = session.sortBy || "updated_desc";
  const allowedTypes = selectedBucket ? new Set(selectedBucket.types) : null;
  const searchValue = asString(session.searchQuery).trim();
  const searchRegex = searchValue ? new RegExp(escapeRegExp(searchValue), "i") : null;
  const recentUploadedNames = new Set(
    asArray(session.recentUploads)
      .filter((entry) => entry && entry.status === "success")
      .map((entry) => asString(entry.filename).trim())
      .filter(Boolean)
  );

  const folderMatches = (asset) => {
    const statusValue = normalizeReadinessStatus(asset.status);
    const assetType = asString(asset.asset_type).trim().toLowerCase();
    if (selectedFolderKey === "all_assets") return true;
    if (selectedFolderKey === "source_of_truth") return Boolean(asset.source_of_truth);
    if (selectedFolderKey === "archived") return statusValue === "archived";
    if (selectedFolderKey === "uploaded_session") {
      const filename = asString(asset.filename || basename(asset.file_path || "")).trim();
      return Boolean(filename && recentUploadedNames.has(filename));
    }

    const folder = LIBRARY_FOLDERS.find((item) => item.key === selectedFolderKey);
    if (folder && Array.isArray(folder.types) && folder.types.length) {
      return folder.types.includes(assetType);
    }

    return true;
  };

  const filtered = allAssets.filter((asset) => {
    const isDeleted = Boolean(asset.deleted || asset.is_deleted);
    if (isDeleted) return false;

    const matchesBucket = !allowedTypes || allowedTypes.has(asset.asset_type);
    const matchesFolder = folderMatches(asset);
    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
    const statusValue = normalizeReadinessStatus(asset.status);
    const matchesStatus = effectiveSelectedStatus === "all"
      ? statusValue !== "archived"
      : effectiveSelectedStatus === "active"
        ? statusValue !== "archived"
        : statusValue === effectiveSelectedStatus;
    const matchesSource = selectedSource === "all"
      || (selectedSource === "media-studio" && asset.kind === "managed_media")
      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
    const haystack = `${asset.name} ${asset.asset_type} ${asset.category_label} ${asset.file_path} ${asset.used_in.join(" ")}`;
    const matchesSearch = !searchRegex || searchRegex.test(haystack);
    return matchesBucket && matchesFolder && matchesType && matchesStatus && matchesSource && matchesSearch;
  });

  const toTimestamp = (value) => {
    const ts = new Date(value || 0).getTime();
    return Number.isFinite(ts) ? ts : 0;
  };

  const sorted = [...filtered].sort((left, right) => {
    if (sortBy === "name_asc") return left.name.localeCompare(right.name);
    if (sortBy === "name_desc") return right.name.localeCompare(left.name);
    if (sortBy === "updated_asc") return toTimestamp(left.uploaded_at) - toTimestamp(right.uploaded_at);
    if (sortBy === "status") return toStatusLabel(left.status).localeCompare(toStatusLabel(right.status));
    return toTimestamp(right.uploaded_at) - toTimestamp(left.uploaded_at);
  });

  return sorted;

## Folder buttons excerpt
        }
      });
      const selected = allAssets.find((asset) => asset.id === nextId);
      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
      rerender();
    };
  });

  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
  folderButtons.forEach((button) => {
    button.onclick = () => {
      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";

      dispatchLibraryCommand("set-filter", {
        filter: "folder",
        value: folderKey
      }, {
        "set-filter": ({ value }) => {
          session.folderKey = value;
          session.page = 1;

          if (value === "archived") {
            session.selectedStatus = "archived";
          }
        }
      });

      rerender();
    };

# 02 — Filter Render Area

558:      selectedType: "all",
975:  const selectedType = session.selectedType || "all";
1017:    const matchesType = selectedType === "all" || asset.asset_type === selectedType;
1632:  const typeOptions = [
1713:  const typeSelect = $("libraryFilterTypeSelect");
1715:    typeSelect.innerHTML = typeOptions.map((option) => `
1716:      <option value="${escapeHtml(option.value)}"${session.selectedType === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
1718:    typeSelect.value = session.selectedType || "all";
1722:      dispatchLibraryCommand("set-filter", {
1726:        "set-filter": ({ value }) => {
1727:          session.selectedType = value;
1753:      dispatchLibraryCommand("set-filter", {
1757:        "set-filter": ({ value }) => {
1789:      dispatchLibraryCommand("set-filter", {
1793:        "set-filter": ({ value }) => {
1820:      dispatchLibraryCommand("set-filter", {
1824:        "set-filter": ({ value }) => {
2084:        session.selectedType = isReviewAction ? "all" : uploadType;
2299:      dispatchLibraryCommand("set-filter", {
2303:        "set-filter": ({ value }) => {
2493:        session.selectedType = normalizedType;
2681:      dispatchLibraryCommand("set-filter", {
2685:        "set-filter": ({ value }) => {
3220:                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
3221:                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>

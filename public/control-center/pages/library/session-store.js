const DEFAULT_LIBRARY_SESSION = Object.freeze({
  selectedAssetId: "",
  selectedAssetIds: [],
  searchQuery: "",
  typeFilter: "all",
  statusFilter: "all",
  sourceFilter: "all",
  folderFilter: "all",
  viewMode: "grid",
  page: 1,
  pageSize: 24,
  expandedPanels: Object.freeze({}),
  uploadInProgress: false
});

export function createLibrarySession(overrides = {}) {
  return {
    ...DEFAULT_LIBRARY_SESSION,
    ...overrides,
    expandedPanels: {
      ...DEFAULT_LIBRARY_SESSION.expandedPanels,
      ...(overrides.expandedPanels || {})
    }
  };
}

export function normalizeLibrarySession(session = {}) {
  return createLibrarySession(session);
}

export function updateLibrarySession(session = {}, patch = {}) {
  return normalizeLibrarySession({
    ...session,
    ...patch,
    expandedPanels: {
      ...(session.expandedPanels || {}),
      ...(patch.expandedPanels || {})
    }
  });
}

export function isLibraryTransientKey(key) {
  return Object.prototype.hasOwnProperty.call(DEFAULT_LIBRARY_SESSION, key);
}

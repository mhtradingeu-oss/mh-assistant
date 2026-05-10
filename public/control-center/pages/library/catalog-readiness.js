export function normalizeRequiredCategories(categories = []) {
  if (!Array.isArray(categories)) return [];
  return categories
    .map((item) => {
      if (typeof item === "string") {
        return { id: item, label: item, required: true };
      }

      return {
        id: item?.id || item?.key || item?.slug || "",
        label: item?.label || item?.name || item?.id || "Required asset",
        required: item?.required !== false,
        raw: item
      };
    })
    .filter((item) => item.id);
}

export function summarizeLibraryReadiness({ assets = [], requiredCategories = [] } = {}) {
  const required = normalizeRequiredCategories(requiredCategories);
  const assetList = Array.isArray(assets) ? assets : [];
  const byCategory = new Map();

  assetList.forEach((asset) => {
    const category = asset?.category || asset?.type || "uncategorized";
    byCategory.set(category, (byCategory.get(category) || 0) + 1);
  });

  const missing = required.filter((item) => !byCategory.has(item.id));
  const complete = required.length ? required.length - missing.length : 0;
  const readinessScore = required.length
    ? Math.round((complete / required.length) * 100)
    : 100;

  return {
    totalAssets: assetList.length,
    requiredCount: required.length,
    completeCount: complete,
    missingCount: missing.length,
    readinessScore,
    missing,
    byCategory: Object.fromEntries(byCategory)
  };
}

export function buildLibraryNextBestAction(readiness = {}) {
  if (readiness.missingCount > 0) {
    return {
      actionId: "upload-missing-required-assets",
      severity: "high",
      label: "Upload missing required assets",
      reason: `${readiness.missingCount} required asset categories are still missing.`,
      suggestedRouteOrAction: "library-upload"
    };
  }

  return {
    actionId: "review-library-assets",
    severity: "normal",
    label: "Review and approve Library assets",
    reason: "Required asset coverage is available. Review quality and source-of-truth status.",
    suggestedRouteOrAction: "library-review"
  };
}

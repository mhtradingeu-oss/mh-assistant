/*
  Integrations OS Utilities

  Shared pure helpers only.
  No DOM ownership.
  No runtime side effects.
*/

export function asString(value) {
  if (value == null) return "";
  return String(value);
}

export function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function normalizeText(value) {
  return asString(value).trim().toLowerCase();
}

export function safeIncludes(value, query) {
  return normalizeText(value).includes(normalizeText(query));
}

export function createSlug(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return "Unknown";

  const time = new Date(timestamp).getTime();

  if (!Number.isFinite(time)) {
    return "Unknown";
  }

  const diff = Date.now() - time;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}m ago`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}h ago`;
  }

  return `${Math.floor(diff / day)}d ago`;
}

export function formatStatusLabel(status) {
  const value = normalizeText(status);

  switch (value) {
    case "connected":
      return "Connected";

    case "warning":
      return "Needs Attention";

    case "error":
      return "Connection Error";

    case "syncing":
      return "Syncing";

    default:
      return "Unknown";
  }
}

export function buildIntegrationSearchText(integration) {
  const item = asObject(integration);

  return [
    item.name,
    item.description,
    item.category,
    item.provider,
    item.status
  ]
    .map(normalizeText)
    .join(" ");
}

export function sortByLabel(items, field = "name") {
  return [...asArray(items)].sort((a, b) => {
    const left = normalizeText(a?.[field]);
    const right = normalizeText(b?.[field]);

    return left.localeCompare(right);
  });
}

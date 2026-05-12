const DEFAULT_ROLE = "admin";

const ACTIVE_ROUTE_ROLES = [
  "strategist",
  "writer",
  "designer",
  "video_lead",
  "publisher",
  "ads_operator",
  "analyst",
  "compliance_reviewer",
  "admin"
];

const DEFAULT_ROUTE_ROLE_ACCESS = {
  home: ["strategist", "analyst", "admin"],
  "ai-command": ACTIVE_ROUTE_ROLES,
  "campaign-studio": ["strategist", "ads_operator", "admin"],
  "content-studio": ["writer", "strategist", "compliance_reviewer", "admin"],
  "media-studio": ["designer", "video_lead", "compliance_reviewer", "admin"],
  publishing: ["publisher", "compliance_reviewer", "admin"],
  research: ["strategist", "analyst", "writer", "admin"],
  setup: ACTIVE_ROUTE_ROLES,
  "task-center": ACTIVE_ROUTE_ROLES,
  "queue-center": ACTIVE_ROUTE_ROLES,
  "job-monitor": ACTIVE_ROUTE_ROLES,
  "notification-center": ACTIVE_ROUTE_ROLES,
  governance: ["compliance_reviewer", "admin", "analyst"],
  "ads-manager": ["ads_operator", "strategist", "analyst", "admin"],
  insights: ["analyst", "strategist", "ads_operator", "admin"],
  integrations: ["admin"],
  workflows: ACTIVE_ROUTE_ROLES,
  library: ["designer", "video_lead", "publisher", "admin"],
  settings: ["admin"]
};

function buildBlockedReason(route, allowedRoles, activeRole, useDefaultRoleMessage = false) {
  const rolesStr = allowedRoles.join(", ");
  if (useDefaultRoleMessage) {
    return (
      `Route "${route}" requires one of: [${rolesStr}]. ` +
      `Default role is "${activeRole}". Use the Role selector in the top bar to switch.`
    );
  }

  return (
    `Route "${route}" requires one of: [${rolesStr}]. ` +
    `Your current role is "${activeRole}". ` +
    `Use the Role selector in the top bar to switch roles for internal testing.`
  );
}

function getFallbackRouteAccess(route, activeRole = DEFAULT_ROLE, options = {}) {
  const allowedRoles = DEFAULT_ROUTE_ROLE_ACCESS[route];
  if (!Array.isArray(allowedRoles)) {
    return { allowed: true, reason: "" };
  }

  const normalizedRole = String(activeRole || "").trim().toLowerCase() || DEFAULT_ROLE;
  const allowed = allowedRoles.includes(normalizedRole);
  return {
    allowed,
    reason: allowed
      ? ""
      : buildBlockedReason(route, allowedRoles, normalizedRole, options.useDefaultRoleMessage === true)
  };
}

export {
  ACTIVE_ROUTE_ROLES,
  DEFAULT_ROLE,
  DEFAULT_ROUTE_ROLE_ACCESS,
  getFallbackRouteAccess
};
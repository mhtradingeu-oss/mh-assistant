/**
 * Legacy autonomous business dashboard.
 *
 * This file is intentionally preserved as a non-active legacy artifact.
 * It is not registered by the Control Center router and must not call removed
 * /api/governance/* or /api/ai-control/* endpoints if opened directly.
 *
 * Active runtime authority lives in router-registered pages and canonical api.js
 * project-scoped helpers.
 */

const legacyBusinessDashboardState = {
  ok: false,
  neutralized: true,
  legacy: true,
  page: "business/dashboard",
  message: "Legacy autonomous business dashboard is neutralized. Use active Control Center routes instead.",
  canonicalRoutes: {
    governance: "public/control-center/pages/governance.js",
    aiCommand: "public/control-center/pages/ai-command.js",
    settings: "public/control-center/pages/settings.js"
  }
};

function renderLegacyBusinessDashboardNotice() {
  if (typeof document === "undefined" || !document.body) {
    return legacyBusinessDashboardState;
  }

  document.body.innerHTML = `
    <main style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #fff; min-height: 100vh;">
      <h1>Legacy Business Dashboard Neutralized</h1>
      <p>This inactive legacy dashboard no longer calls removed backend endpoints.</p>
      <pre style="background: #111827; padding: 16px; overflow: auto;">${JSON.stringify(legacyBusinessDashboardState, null, 2)}</pre>
    </main>
  `;

  return legacyBusinessDashboardState;
}

if (typeof window !== "undefined") {
  window.__LEGACY_BUSINESS_DASHBOARD__ = {
    state: legacyBusinessDashboardState,
    render: renderLegacyBusinessDashboardNotice
  };
}

/**
 * Legacy governance dashboard.
 *
 * This file is intentionally preserved as a non-active legacy artifact.
 * The active Governance route is public/control-center/pages/governance.js.
 *
 * This legacy dashboard must not call removed /api/governance/* endpoints if
 * opened directly.
 */

const legacyGovernanceDashboardState = {
  ok: false,
  neutralized: true,
  legacy: true,
  page: "governance/dashboard",
  message: "Legacy governance dashboard is neutralized. Use the active Governance route instead.",
  canonicalRoutes: {
    governance: "public/control-center/pages/governance.js"
  },
  canonicalHelpers: [
    "fetchProjectGovernance(projectName)",
    "createProjectApproval(projectName, payload)",
    "decideProjectApproval(projectName, approvalId, payload)",
    "updateProjectGovernancePolicy(projectName, payload)"
  ]
};

function renderLegacyGovernanceDashboardNotice() {
  if (typeof document === "undefined" || !document.body) {
    return legacyGovernanceDashboardState;
  }

  document.body.innerHTML = `
    <main style="font-family: Arial, sans-serif; padding: 24px; min-height: 100vh;">
      <h1>Legacy Governance Dashboard Neutralized</h1>
      <p>This inactive legacy dashboard no longer calls removed Governance endpoints.</p>
      <pre style="background: #f3f4f6; padding: 16px; overflow: auto;">${JSON.stringify(legacyGovernanceDashboardState, null, 2)}</pre>
    </main>
  `;

  return legacyGovernanceDashboardState;
}

if (typeof window !== "undefined") {
  window.__LEGACY_GOVERNANCE_DASHBOARD__ = {
    state: legacyGovernanceDashboardState,
    render: renderLegacyGovernanceDashboardNotice
  };
}

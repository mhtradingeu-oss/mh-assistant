/*
  Integrations OS Drawer

  Drawer render helpers only.
  No DOM listeners.
  No fetch ownership.
  No global mutations.
*/

import {
  asString
} from "./utils.js";

function esc(value) {
  return asString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderIntegrationField(integrationId, field = {}, value = "", options = {}) {
  const type = field.type || "text";
  const invalidClass = options.invalid ? " is-invalid" : "";

  return `
    <div class="integration-field-group${invalidClass}" data-integration-field-group="${esc(integrationId)}:${esc(field.key)}">
      <div class="integration-field-head">
        <label class="setup-label" for="integration-${esc(integrationId)}-${esc(field.key)}">${esc(field.label)}</label>
        ${options.suggestion ? `<span class="integration-field-chip">Suggested from Setup</span>` : ""}
      </div>
      <input
        id="integration-${esc(integrationId)}-${esc(field.key)}"
        class="setup-input${invalidClass}"
        type="${esc(type)}"
        value="${esc(value)}"
        placeholder="${esc(field.placeholder || "")}"
        autocomplete="${type === "password" ? "new-password" : "off"}"
        aria-invalid="${options.invalid ? "true" : "false"}"
        data-integration-field="${esc(integrationId)}"
        data-field-key="${esc(field.key)}"
      />
      ${options.invalid ? `<div class="integration-field-error">${esc(options.invalidMessage || "Complete this field before continuing.")}</div>` : ""}
      <div class="setup-helper" data-integration-field-helper="${esc(integrationId)}:${esc(field.key)}"></div>
    </div>
  `;
}

export function renderDrawerProgress(card = {}) {
  const missingRequired = Array.isArray(card.missingRequired) ? card.missingRequired : [];
  const stepOneComplete = missingRequired.length === 0;
  const stepTwoComplete = Boolean(card.lastTest) || card.statusLabel === "Connected";
  const stepThreeComplete = card.statusLabel === "Connected";

  const steps = [
    {
      label: "Step 1: Fill required fields",
      state: stepOneComplete ? "complete" : "active",
      meta: stepOneComplete
        ? "Ready for validation."
        : `${missingRequired.length} required field${missingRequired.length === 1 ? "" : "s"} remaining.`
    },
    {
      label: "Step 2: Test connection",
      state: stepTwoComplete ? "complete" : stepOneComplete ? "active" : "pending",
      meta: stepTwoComplete
        ? "Connection test checkpoint recorded."
        : "Run a connection test before activation."
    },
    {
      label: "Step 3: Activate",
      state: stepThreeComplete ? "complete" : stepOneComplete ? "active" : "pending",
      meta: stepThreeComplete
        ? "Provider is active in the Control Center."
        : "Activate once fields and test are complete."
    }
  ];

  return `
    <div class="integration-drawer-progress">
      ${steps.map((step) => `
        <div class="integration-progress-step is-${esc(step.state)}">
          <strong>${esc(step.label)}</strong>
          <span>${esc(step.meta)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getDrawerPrimaryAction(card = {}) {
  if (card.backendSupported === false) {
    return { action: "unavailable", label: "Unavailable" };
  }

  if (card.statusLabel === "Connected") {
    return { action: "manage", label: "Manage Connection" };
  }

  if (["Partial", "Token expired", "Error"].includes(card.statusLabel)) {
    return { action: "reconnect", label: "Reconnect" };
  }

  return { action: "connect", label: `Connect ${card.label || "Integration"}` };
}

function getQuickConnectLabel(card = {}) {
  if (card.quickConnectLabel) {
    return card.quickConnectLabel;
  }

  if (card.oauthSupported || card.authMode === "oauth") {
    return "Quick Connect";
  }

  return "";
}

export function renderIntegrationActionButtons(card = {}) {
  if (card.backendSupported === false) {
    return `<div class="integration-side-note">${esc(card.unavailableReason || "Backend provider support is not configured yet.")}</div>`;
  }

  const primary = getDrawerPrimaryAction(card);
  const quickConnectLabel = getQuickConnectLabel(card);

  return `
    <button class="quick-action-btn quick-action-btn--primary" type="button" data-integration-action="${esc(primary.action)}" data-integration-id="${esc(card.id)}">${esc(primary.label)}</button>
    <button class="quick-action-btn" type="button" data-integration-action="test" data-integration-id="${esc(card.id)}">Test Connection</button>
    ${card.statusLabel === "Connected" ? `<button class="quick-action-btn" type="button" data-integration-action="sync" data-integration-id="${esc(card.id)}">Sync Now</button>` : ""}
    ${quickConnectLabel && card.statusLabel !== "Connected" ? `<div class="integration-quick-connect-note">OAuth-style quick connect is the recommended path for this provider. Manual fields remain available as fallback.</div>` : ""}
  `;
}

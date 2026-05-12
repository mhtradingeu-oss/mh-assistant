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
  return `
    <div class="integration-drawer-progress">
      ${steps.map((step, index) => `
        <div class="integration-progress-step is-${esc(step.state)}">
          <span class="integration-step-num">${index + 1}</span>
          <div class="integration-step-body">
            <strong>${esc(step.label)}</strong>
            <span>${esc(step.meta)}</span>
          </div>
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
    return { action: "manage", label: "Manage" };
  }

  if (card.statusLabel === "Partial") {
    return { action: "connect", label: "Complete setup" };
  }

  if (card.statusLabel === "Token expired") {
    return { action: "reconnect", label: "Reconnect" };
  }

  if (card.statusLabel === "Error") {
    return { action: "reconnect", label: "Fix connection" };
  }

  return { action: "connect", label: "Connect" };
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
    <div class="integration-drawer-action-block integration-drawer-action-block--primary">
      <div class="integration-mini-heading">Primary action</div>
      <button class="quick-action-btn quick-action-btn--primary" type="button" data-integration-action="${esc(primary.action)}" data-integration-id="${esc(card.id)}">${esc(primary.label)}</button>
    </div>
    <div class="integration-drawer-action-block integration-drawer-action-block--secondary">
      <div class="integration-mini-heading">Secondary actions</div>
      <div class="integration-drawer-secondary-actions">
        <button class="quick-action-btn" type="button" data-integration-action="test" data-integration-id="${esc(card.id)}">Test connection</button>
        ${card.statusLabel === "Connected" ? `<button class="quick-action-btn" type="button" data-integration-action="sync" data-integration-id="${esc(card.id)}">Sync</button>` : ""}
      </div>
      ${quickConnectLabel && card.statusLabel !== "Connected" ? `<div class="integration-quick-connect-note">OAuth-style quick connect is recommended for this connector. Manual fields remain available as fallback.</div>` : ""}
    </div>
  `;
  return `
    <div class="integration-drawer-actions-flat">
      <button class="quick-action-btn quick-action-btn--primary" type="button" data-integration-action="${esc(primary.action)}" data-integration-id="${esc(card.id)}">${esc(primary.label)}</button>
      <div class="integration-drawer-secondary-actions">
        <button class="quick-action-btn" type="button" data-integration-action="test" data-integration-id="${esc(card.id)}">Test</button>
        ${card.statusLabel === "Connected" ? `<button class="quick-action-btn" type="button" data-integration-action="sync" data-integration-id="${esc(card.id)}">Sync</button>` : ""}
      </div>
      ${quickConnectLabel && card.statusLabel !== "Connected" ? `<div class="integration-quick-connect-note">OAuth recommended. Manual fields available as fallback.</div>` : ""}
    </div>
  `;
}

function formatDrawerDate(value) {
  if (!value) return "Never";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Never";
  }

  return date.toLocaleString();
}

function titleCaseLocal(value = "") {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function renderIntegrationDetailsPanel(
  card = {},
  session = {},
  options = {}
) {
  const isDrawer = options.mode === "drawer";

  const getFieldValue =
    typeof options.getFieldValue === "function"
      ? options.getFieldValue
      : () => "";

  const requiredFields = card.fields.filter((field) => field.required);
  const optionalFields = card.fields.filter((field) => !field.required);
  const requiredFieldSummary = requiredFields
    .slice(0, 3)
    .map((field) => asString(field.label).trim())
    .filter(Boolean)
    .join(", ");
  const hasOAuthSetup = Boolean(card.quickConnectLabel || card.oauthSupported || card.authMode === "oauth");
  const setupMethod = card.backendSupported === false
    ? "Backend support not configured"
    : hasOAuthSetup
      ? "OAuth recommended"
      : "Manual fields";

  const fields = requiredFields
    .map((field) =>
      renderIntegrationField(
        card.id,
        field,
        getFieldValue(
          session,
          card,
          field,
          card.record,
          card.sourceValue,
          card.suggestedValues[field.key]
        ),
        {
          invalid:
            session.validationIntegrationId === card.id &&
            session.validationFieldKey === field.key,
          invalidMessage: session.validationMessage,
          suggestion:
            card.suggestedValues[field.key] &&
            getFieldValue(
              session,
              card,
              field,
              card.record,
              card.sourceValue,
              card.suggestedValues[field.key]
            ) === card.suggestedValues[field.key]
        }
      )
    )
    .join("");

  const optionalFieldMarkup = optionalFields
    .map((field) =>
      renderIntegrationField(
        card.id,
        field,
        getFieldValue(
          session,
          card,
          field,
          card.record,
          card.sourceValue,
          card.suggestedValues[field.key]
        ),
        {
          suggestion:
            card.suggestedValues[field.key] &&
            getFieldValue(
              session,
              card,
              field,
              card.record,
              card.sourceValue,
              card.suggestedValues[field.key]
            ) === card.suggestedValues[field.key]
        }
      )
    )
    .join("");

  const credentialItems = Object.entries(card.credentialState || {})
    .filter(([, value]) => value?.is_set)
    .map(
      ([key, value]) =>
        `<span class="integration-scope-pill">${esc(
          `${titleCaseLocal(key)}: ${value.masked}`
        )}</span>`
    )
    .join("");

  return `
    <section class="card integration-hub-card${isDrawer ? " integration-hub-card--drawer" : ""}">
      <div class="integration-hub-head">
        <div class="integration-hub-title-wrap">
          <div class="integration-hub-icon">${esc(card.icon)}</div>
          <div>
            <h4>${esc(card.label)}</h4>
            <p>${esc(card.purpose)}</p>
          </div>
        </div>

        <div class="integration-hub-head-actions">
          <span class="card-badge ${esc(card.statusTone)}">${esc(card.statusLabel)}</span>
          ${isDrawer
            ? `<button class="btn btn-secondary integration-drawer-close-btn" type="button" data-integration-drawer-close="close">Close</button>`
            : ""}
        </div>
      </div>

      <div class="integration-hub-intro">
        <div class="integration-hub-why">
          <strong>Connection status</strong>
          <span>${esc(card.healthSummary)}</span>
        </div>

        <div class="integration-hub-why">
          <strong>Connection value</strong>
          <span>${esc(card.sourceValue || "Not set")}</span>
        </div>

        <details class="integration-drawer-expandable">
          <summary class="integration-drawer-expandable-summary">Why this connector matters</summary>
          <div class="integration-drawer-expandable-content">
            <p>${esc(card.whyItMatters)}</p>
            <p><strong>Enables:</strong> ${esc(card.enables)}</p>
          </div>
        </details>
      </div>
      <div class="integration-hub-intro">
        <div class="integration-hub-status-row">
          <span class="integration-hub-status-label">Status</span>
          <span>${esc(card.healthSummary)}</span>
        </div>

        ${asString(card.sourceValue).trim() ? `
        <div class="integration-hub-status-row">
          <span class="integration-hub-status-label">Value</span>
          <span>${esc(card.sourceValue)}</span>
        </div>` : ""}

        <details class="integration-drawer-expandable">
          <summary class="integration-drawer-expandable-summary">Why this matters</summary>
          <div class="integration-drawer-expandable-content">
            <p>${esc(card.whyItMatters)}</p>
            <p><strong>Enables:</strong> ${esc(card.enables)}</p>
          </div>
        </details>
      </div>

      <div class="integration-drawer-requirements">
        <strong>Connection requirements</strong>
        <div class="integration-drawer-requirements-grid">
          <span class="integration-requirement-pill">${esc(
            requiredFieldSummary
              ? `Access needed: ${requiredFieldSummary}${requiredFields.length > 3 ? " +more" : ""}`
              : "Access needed: Setup details below"
          )}</span>
          <span class="integration-requirement-pill">${esc(`Setup method: ${setupMethod}`)}</span>
          ${asString(card.permissionScopeSummary).trim()
            ? `<span class="integration-requirement-pill">${esc(`Permission scope: ${card.permissionScopeSummary}`)}</span>`
            : ""}
        </div>
      </div>

      ${isDrawer ? renderDrawerProgress(card) : ""}

      <div class="integration-hub-grid">
        <div>
          <div class="integration-mini-heading">Fields and validation</div>

          <div class="integration-field-grid">
            ${fields}
          </div>

          ${
            session.validationIntegrationId === card.id &&
            card.missingRequired.length
              ? `<div class="integration-drawer-validation">${esc(
                  `Missing required fields: ${card.missingRequired.join(", ")}`
                )}</div>`
              : ""
          }

          ${
            optionalFieldMarkup
              ? `
                <details class="integration-optional-fields">
                  <summary>Optional fields</summary>

                  <div class="integration-field-grid integration-field-grid--optional">
                    ${optionalFieldMarkup}
                  </div>
                </details>
              `
              : ""
          }

          ${credentialItems ? `<div class="integration-scope-row">${credentialItems}</div>` : ""}

          <div class="integration-side-note">
            Sensitive credentials are stored server-side only.
            Leave password fields blank to keep the current saved value.
          </div>
        </div>
      </div>

      <div class="integration-action-row">
        ${renderIntegrationActionButtons(card)}
      </div>

      <div class="integration-side-panel integration-side-panel--drawer-details">
        <div class="integration-mini-heading">Technical and status details</div>

        <div class="data-stack">
          <div class="data-row"><span>Connection status</span><strong>${esc(card.statusLabel)}</strong></div>
          <div class="data-row"><span>Last test</span><strong>${esc(formatDrawerDate(card.lastTest))}</strong></div>
          <div class="data-row"><span>Last sync</span><strong>${esc(formatDrawerDate(card.lastSync))}</strong></div>
          <div class="data-row"><span>Last import</span><strong>${esc(formatDrawerDate(card.lastImport))}</strong></div>
          <div class="data-row"><span>Health</span><strong>${esc(card.healthSummary)}</strong></div>
        </div>

        <div class="integration-side-note">${esc(card.notes)}</div>

        ${
          card.missingRequired.length
            ? `<div class="integration-side-note">${esc(
                `Missing required fields: ${card.missingRequired.join(", ")}`
              )}</div>`
            : ""
        }
      </div>
      <details class="integration-drawer-tech-details">
        <summary class="integration-drawer-expandable-summary">Technical details</summary>
        <div class="integration-drawer-expandable-content integration-drawer-tech-content">
          <div class="data-stack">
            <div class="data-row"><span>Last test</span><strong>${esc(formatDrawerDate(card.lastTest))}</strong></div>
            <div class="data-row"><span>Last sync</span><strong>${esc(formatDrawerDate(card.lastSync))}</strong></div>
            <div class="data-row"><span>Last import</span><strong>${esc(formatDrawerDate(card.lastImport))}</strong></div>
          </div>
          ${card.notes ? `<div class="integration-side-note">${esc(card.notes)}</div>` : ""}
          ${
            card.missingRequired.length
              ? `<div class="integration-side-note">${esc(
                  `Missing required: ${card.missingRequired.join(", ")}`
                )}</div>`
              : ""
          }
        </div>
      </details>
    </section>
  `;
}

export function renderIntegrationDrawer(card = null, session = {}, options = {}) {
  if (!card || !session.drawerOpen || session.activeDrawerIntegrationId !== card.id) {
    return "";
  }

  const getFieldValue =
    typeof options.getFieldValue === "function"
      ? options.getFieldValue
      : () => "";

  return `
    <div class="integration-drawer-layer is-open" data-integration-drawer-layer>
      <button
        class="integration-drawer-backdrop"
        type="button"
        aria-label="Close setup drawer"
        data-integration-drawer-close="backdrop"
      ></button>

      <aside
        class="integration-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="${esc(card.label)} setup"
        data-integration-drawer
      >
        ${renderIntegrationDetailsPanel(card, session, { mode: "drawer", getFieldValue })}
      </aside>
    </div>
  `;
}

# T20 — Integrations Runtime Authority + Provider Action Safety Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/integrations.js

## Why This Page Is Next
T19 ranked Integrations as the highest remaining risk candidate:
- P0 review
- risk score: 80.1
- authority words: high
- provider actions: reconnect, disconnect, sync, credentials, external systems
- governance approval is expected to own sensitive actions

## Purpose
Verify whether Integrations safely handles provider authority:
- reconnect/repair must be backend-governed
- disconnect must require explicit confirmation
- sync/import/test actions must be routed through backend authority
- missing credentials must be visible but not leaked
- governance approval required responses must navigate to Governance
- frontend must not fake provider connection success

## Summary Counts

| Signal | Count |
|---|---:|
| rendering | 1 |
| reconnect | 24 |
| disconnect | 13 |
| sync | 40 |
| credentials | 87 |
| governance | 15 |
| confirmations | 1 |
| backendActions | 200 |
| navigation | 4 |
| escapeEvidence | 59 |


## High-Level Preliminary Decision
Do not patch yet. T20 only determines whether Integrations needs:
- confirmation patch
- governance approval visibility patch
- provider credential clarity patch
- reconnect/sync authority patch
- or closeout/no patch

## Signal Details

### rendering

| Line | Code |
| --- | --- |
| 1743 | `root.innerHTML = `` |

### reconnect

| Line | Code |
| --- | --- |
| 771 | `function restoreConnectorContext(session) {` |
| 903 | `if (card.statusLabel === "Token expired") return "Reconnect integration";` |
| 904 | `if (card.statusLabel === "Error") return "Repair integration connection";` |
| 916 | `function shouldUseReconnectAction(card) {` |
| 929 | `if (shouldUseReconnectAction(card)) {` |
| 930 | `return { action: "reconnect", label: getSmartConnectLabel(card) };` |
| 1135 | `"WooCommerce Store URL is not saved yet. Run Repair integration connection after governance approval, then test the connection."` |
| 1151 | `"Save or repair this integration before running a connection test. The test uses the saved server-side configuration."` |
| 1201 | `return "Reconnect the saved token before importing or syncing new data.";` |
| 1225 | `label: card.statusLabel === "Error" ? "Repair integration connection" : "Reconnect integration",` |
| 1226 | `action: shouldUseReconnectAction(card) ? "reconnect" : "connect"` |
| 1266 | `reconnectProjectIntegration,` |
| 1472 | `async function persistPrimary(integrationId, reconnect = false) {` |
| 1497 | `if (reconnect) {` |
| 1498 | `await reconnectProjectIntegration(projectName, integrationId, payload);` |
| 1504 | `showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);` |
| 1515 | `if (reconnect && governanceCode === "governance_approval_required") {` |
| 1517 | `showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);` |
| 1612 | `if (action === "reconnect") {` |
| 1658 | `description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."` |
| 1675 | `reconnectProjectIntegration,` |
| 1936 | `reconnectProjectIntegration,` |
| 1953 | `reconnectProjectIntegration,` |
| 1962 | `restoreConnectorContext(session);` |

### disconnect

| Line | Code |
| --- | --- |
| 1270 | `disconnectProjectIntegration,` |
| 1530 | `async function disconnect(integrationId) {` |
| 1538 | `const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);` |
| 1544 | `await disconnectProjectIntegration(projectName, integrationId, {` |
| 1545 | `notes: `${integration.label} disconnected from the Control Center.`` |
| 1548 | `showMessage?.(`${integration.label} disconnected.`);` |
| 1552 | `showError?.(error.message \|\| `Failed to disconnect ${integration.label}.`);` |
| 1616 | `if (action === "disconnect") {` |
| 1617 | `await disconnect(integrationId);` |
| 1679 | `disconnectProjectIntegration` |
| 1769 | `<strong>${escapeHtml(String(overview.failedOrDisconnected))}</strong>` |
| 1940 | `disconnectProjectIntegration,` |
| 1957 | `disconnectProjectIntegration` |

### sync

| Line | Code |
| --- | --- |
| 68 | `purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",` |
| 70 | `enables: "Product sync, order sync, sales signals, and commerce intelligence.",` |
| 88 | `enables: "Product sync, order sync, customer sync, and sales reporting.",` |
| 107 | `enables: "Listing sync, sales signals, performance by product, and marketplace learning.",` |
| 122 | `purpose: "Marketplace listing and commerce signal sync for eBay surfaces.",` |
| 124 | `enables: "Listing sync, order sync, product demand signals, and marketplace coverage.",` |
| 164 | `purpose: "Post, reel, and profile insight sync for Instagram business performance.",` |
| 182 | `purpose: "Video and post insight sync for TikTok creative and audience performance.",` |
| 200 | `purpose: "Video performance and channel insight sync for long-form or short-form YouTube content.",` |
| 346 | `description: "Lifecycle messaging, customer records, contact sync, and email campaign infrastructure.",` |
| 377 | `enables: "Campaign sends, audience sync, templates, and performance reporting.",` |
| 392 | `purpose: "Future-ready newsletter, audience, and campaign sync through Mailchimp.",` |
| 394 | `enables: "Audience sync, campaigns, lists, and newsletter reporting.",` |
| 411 | `purpose: "Customer record sync for lead, customer, and lifecycle intelligence.",` |
| 413 | `enables: "Contact sync, customer sync, lead intelligence, and lifecycle learning.",` |
| 437 | `enables: "Spend sync, campaign import, creative performance, and paid optimization.",` |
| 455 | `enables: "Spend sync, campaign import, keyword performance, and paid optimization.",` |
| 473 | `enables: "Spend sync, campaign import, creative performance, and short-form paid optimization.",` |
| 495 | `purpose: "File sync and shared asset operations through Google Drive.",` |
| 497 | `enables: "Asset sync, doc sync, shared files, and automation inputs.",` |
| 513 | `whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",` |
| 514 | `enables: "Alerts, approvals, sync notifications, and workflow coordination.",` |
| 548 | `enables: "Docs sync, planning sync, task context, and knowledge reuse.",` |
| 565 | `enables: "Workflow automation, triggers, sync jobs, and handoffs.",` |
| 566 | `dataScope: ["Automations", "Triggers", "Sync jobs"],` |
| 583 | `dataScope: ["Custom events", "Payloads", "Sync triggers"],` |
| 927 | `return { action: "sync", label: "Run backend sync" };` |
| 1043 | `write: ["catalog sync", "commerce updates"]` |
| 1057 | `write: ["campaign sends", "audience sync"]` |
| 1195 | `return `${integration.label} is connected and ready for provider-level sync actions.`;` |
| 1218 | `label: "Run backend sync",` |
| 1219 | `action: "sync"` |
| 1538 | `const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);` |
| 1584 | `} else if (type === "sync") {` |
| 1586 | `notes: `${integration.label} sync triggered from the Control Center.`` |
| 1588 | `showMessage?.(`${integration.label} backend sync started.`);` |
| 1658 | `description: "Connect, test, sync, import, reconnect, and control the external platforms that power MH Assistant OS."` |
| 1750 | `<p class="home-section-copy integration-system-purpose">Connect business platforms so MH-OS can sync performance, route safe backend actions, and learn from live operating data.</p>` |
| 1857 | `${selectedCard ? renderSelectedConnectorSummary(selectedCard) : `<div class="empty-box">Select a connector to review setup, sync health, and safe backend actions.</div>`}` |
| 1890 | `<h3>Sync & Activity Health</h3>` |

### credentials

| Line | Code |
| --- | --- |
| 59 | `{ key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },` |
| 72 | `permissionScope: "Store URL + API consumer key/secret",` |
| 76 | `{ key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },` |
| 77 | `{ key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },` |
| 78 | `{ key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }` |
| 90 | `permissionScope: "Store domain + admin access token",` |
| 94 | `{ key: "adminToken", label: "Admin token", placeholder: "shpat_...", type: "password" },` |
| 109 | `permissionScope: "Merchant ID + SP-API credentials",` |
| 113 | `{ key: "sellerUrl", label: "Store URL", placeholder: "https://amazon.com/shops/brand" },` |
| 114 | `{ key: "accessToken", label: "Access token", placeholder: "Amazon access token", type: "password" }` |
| 126 | `permissionScope: "Seller account + OAuth access token",` |
| 130 | `{ key: "storeUrl", label: "Store URL", placeholder: "https://ebay.com/usr/brand" },` |
| 131 | `{ key: "accessToken", label: "Access token", placeholder: "eBay access token", type: "password" }` |
| 150 | `permissionScope: "Page ID + business access token",` |
| 156 | `{ key: "accessToken", label: "Access token", placeholder: "Facebook access token", type: "password" }` |
| 168 | `permissionScope: "Business account ID + Graph API token",` |
| 174 | `{ key: "accessToken", label: "Access token", placeholder: "Instagram access token", type: "password" }` |
| 186 | `permissionScope: "Business account ID + access token",` |
| 192 | `{ key: "accessToken", label: "Access token", placeholder: "TikTok access token", type: "password" }` |
| 204 | `permissionScope: "Channel ID + OAuth token",` |
| 210 | `{ key: "accessToken", label: "Access token", placeholder: "YouTube OAuth token", type: "password" }` |
| 222 | `permissionScope: "Company page ID + OAuth token",` |
| 227 | `{ key: "accessToken", label: "Access token", placeholder: "LinkedIn OAuth token", type: "password" }` |
| 246 | `permissionScope: "Property ID + service account or OAuth token",` |
| 252 | `{ key: "accessToken", label: "Access token", placeholder: "GA4 access token", type: "password" }` |
| 269 | `{ key: "accessToken", label: "Access token", placeholder: "GTM access token", type: "password" }` |
| 281 | `permissionScope: "Pixel ID + business token",` |
| 286 | `{ key: "accessToken", label: "Access token", placeholder: "Meta access token", type: "password" }` |
| 298 | `permissionScope: "Pixel ID + business token",` |
| 303 | `{ key: "accessToken", label: "Access token", placeholder: "TikTok token", type: "password" }` |
| 321 | `{ key: "accessToken", label: "Access token", placeholder: "Search Console token", type: "password" }` |
| 333 | `permissionScope: "Endpoint URL + auth token",` |
| 337 | `{ key: "clientId", label: "Client ID", placeholder: "Analytics client ID" },` |
| 338 | `{ key: "accessToken", label: "Access token", placeholder: "API token", type: "password" }` |
| 379 | `permissionScope: "Provider API key + sender domain",` |
| 383 | `{ key: "apiKey", label: "API key", placeholder: "Mailer API key", type: "password" },` |
| 396 | `permissionScope: "Audience ID + API key",` |
| 400 | `{ key: "apiKey", label: "API key", placeholder: "Mailchimp API key", type: "password" },` |
| 415 | `permissionScope: "CRM account ID + API token",` |
| 419 | `{ key: "apiKey", label: "API key", placeholder: "CRM API key", type: "password" },` |
| 439 | `permissionScope: "Ad account ID + access token",` |
| 445 | `{ key: "accessToken", label: "Access token", placeholder: "Meta ads token", type: "password" }` |
| 457 | `permissionScope: "Customer ID + OAuth token",` |
| 463 | `{ key: "refreshToken", label: "Refresh token", placeholder: "Google Ads refresh token", type: "password" }` |
| 475 | `permissionScope: "Advertiser ID + access token",` |
| 480 | `{ key: "accessToken", label: "Access token", placeholder: "TikTok ads token", type: "password" }` |
| 499 | `permissionScope: "Drive folder ID + OAuth token",` |
| 504 | `{ key: "accessToken", label: "Access token", placeholder: "Drive OAuth token", type: "password" }` |
| 516 | `permissionScope: "Workspace ID + bot token",` |
| 521 | `{ key: "botToken", label: "Bot token", placeholder: "xoxb-...", type: "password" }` |
| 533 | `permissionScope: "Bot token + chat ID",` |
| 538 | `{ key: "botToken", label: "Bot token", placeholder: "Telegram bot token", type: "password" }` |
| 550 | `permissionScope: "Workspace + integration token",` |
| 555 | `{ key: "accessToken", label: "Integration token", placeholder: "Notion token", type: "password" }` |
| 572 | `{ key: "secretKey", label: "Secret key", placeholder: "Automation secret", type: "password" }` |
| 584 | `permissionScope: "Webhook URL + auth secret",` |
| 589 | `{ key: "secretKey", label: "Secret key", placeholder: "Webhook secret", type: "password" }` |
| 878 | `if (isSecretField(field)) return "";` |
| 903 | `if (card.statusLabel === "Token expired") return "Reconnect integration";` |
| 908 | `function hasSavedCredentialState(card) {` |

### governance

| Line | Code |
| --- | --- |
| 513 | `whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",` |
| 514 | `enables: "Alerts, approvals, sync notifications, and workflow coordination.",` |
| 515 | `dataScope: ["Notifications", "Approvals", "Ops alerts"],` |
| 529 | `purpose: "Bot-based operational alerts, approvals, and lightweight workflow execution.",` |
| 530 | `whyItMatters: "Telegram can keep MH Assistant responsive when quick approvals or notifications are needed.",` |
| 531 | `enables: "Alerts, commands, approval handoff, and ops notifications.",` |
| 532 | `dataScope: ["Alerts", "Commands", "Approvals"],` |
| 563 | `purpose: "Automation routing for triggers, syncs, approvals, and external workflow handoffs.",` |
| 588 | `{ key: "eventScope", label: "Event scope", placeholder: "events, approvals, syncs" },` |
| 1135 | `"WooCommerce Store URL is not saved yet. Run Repair integration connection after governance approval, then test the connection."` |
| 1508 | `const governanceCode = String(` |
| 1515 | `if (reconnect && governanceCode === "governance_approval_required") {` |
| 1516 | `const approvalId = asString(error?.payload?.approval?.approval_id);` |
| 1517 | `showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);` |
| 1521 | `navigateTo("governance");` |

### confirmations

| Line | Code |
| --- | --- |
| 1538 | `const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);` |

### backendActions

| Line | Code |
| --- | --- |
| 1 | `import {` |
| 3 | `buildConnectorWorkspaceGroups,` |
| 15 | `CONNECTOR_WORKSPACE_CATEGORIES,` |
| 16 | `getConnectorWorkspaceStatus` |
| 19 | `import { renderIntegrationDrawer } from "./integrations/drawer.js";` |
| 21 | `import {` |
| 22 | `renderConnectorGroup,` |
| 23 | `renderSelectedConnectorSummary` |
| 26 | `import {` |
| 50 | `purpose: "Primary site connection for landing pages, traffic mapping, attribution, and conversion context.",` |
| 51 | `whyItMatters: "Without the website source, MH Assistant cannot connect content and campaign activity to real destination performance.",` |
| 68 | `purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",` |
| 70 | `enables: "Product sync, order sync, sales signals, and commerce intelligence.",` |
| 88 | `enables: "Product sync, order sync, customer sync, and sales reporting.",` |
| 107 | `enables: "Listing sync, sales signals, performance by product, and marketplace learning.",` |
| 122 | `purpose: "Marketplace listing and commerce signal sync for eBay surfaces.",` |
| 124 | `enables: "Listing sync, order sync, product demand signals, and marketplace coverage.",` |
| 164 | `purpose: "Post, reel, and profile insight sync for Instagram business performance.",` |
| 182 | `purpose: "Video and post insight sync for TikTok creative and audience performance.",` |
| 200 | `purpose: "Video performance and channel insight sync for long-form or short-form YouTube content.",` |
| 218 | `purpose: "Future-ready business profile insight and publishing connection for LinkedIn surfaces.",` |
| 329 | `purpose: "Future-ready import endpoint for internal or custom analytics feeds.",` |
| 331 | `enables: "Custom event ingest, proprietary reporting, and historical import.",` |
| 336 | `{ key: "endpointUrl", label: "Endpoint URL", placeholder: "https://api.brand.com/analytics", required: true },` |
| 346 | `description: "Lifecycle messaging, customer records, contact sync, and email campaign infrastructure.",` |
| 377 | `enables: "Campaign sends, audience sync, templates, and performance reporting.",` |
| 392 | `purpose: "Future-ready newsletter, audience, and campaign sync through Mailchimp.",` |
| 394 | `enables: "Audience sync, campaigns, lists, and newsletter reporting.",` |
| 411 | `purpose: "Customer record sync for lead, customer, and lifecycle intelligence.",` |
| 412 | `whyItMatters: "CRM data helps the system connect campaigns to pipeline, customers, and repeat purchase behavior.",` |
| 413 | `enables: "Contact sync, customer sync, lead intelligence, and lifecycle learning.",` |
| 428 | `description: "Paid campaign accounts, spend import, creative performance, and optimization signals.",` |
| 437 | `enables: "Spend sync, campaign import, creative performance, and paid optimization.",` |
| 455 | `enables: "Spend sync, campaign import, keyword performance, and paid optimization.",` |
| 472 | `whyItMatters: "TikTok Ads data helps connect short-form content learning to actual paid outcomes.",` |
| 473 | `enables: "Spend sync, campaign import, creative performance, and short-form paid optimization.",` |
| 495 | `purpose: "File sync and shared asset operations through Google Drive.",` |
| 497 | `enables: "Asset sync, doc sync, shared files, and automation inputs.",` |
| 513 | `whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",` |
| 514 | `enables: "Alerts, approvals, sync notifications, and workflow coordination.",` |
| 548 | `enables: "Docs sync, planning sync, task context, and knowledge reuse.",` |
| 563 | `purpose: "Automation routing for triggers, syncs, approvals, and external workflow handoffs.",` |
| 565 | `enables: "Workflow automation, triggers, sync jobs, and handoffs.",` |
| 566 | `dataScope: ["Automations", "Triggers", "Sync jobs"],` |
| 582 | `enables: "Custom events, syncs, notifications, and system handoffs.",` |
| 583 | `dataScope: ["Custom events", "Payloads", "Sync triggers"],` |
| 588 | `{ key: "eventScope", label: "Event scope", placeholder: "events, approvals, syncs" },` |
| 771 | `function restoreConnectorContext(session) {` |
| 824 | `if (/^https?:\/\//i.test(text)) return text;` |
| 886 | `function getQuickConnectLabel(integration) {` |
| 888 | `return "Connect with Google";` |
| 891 | `return "Connect with Meta";` |
| 894 | `return "Connect with Shopify";` |
| 899 | `function getSmartConnectLabel(card) {` |
| 900 | `if (card.backendSupported === false) return "Open connector setup";` |
| 901 | `if (card.statusLabel === "Connected") return "Manage";` |
| 903 | `if (card.statusLabel === "Token expired") return "Reconnect integration";` |
| 904 | `if (card.statusLabel === "Error") return "Repair integration connection";` |
| 905 | `return getQuickConnectLabel(card) \|\| "Connect";` |
| 916 | `function shouldUseReconnectAction(card) {` |

### navigation

| Line | Code |
| --- | --- |
| 1521 | `navigateTo("governance");` |
| 1632 | `navigateTo("ai-command");` |
| 1652 | `export const integrationsRoute = {` |
| 1750 | `<p class="home-section-copy integration-system-purpose">Connect business platforms so MH-OS can sync performance, route safe backend actions, and learn from live operating data.</p>` |

### escapeEvidence

| Line | Code |
| --- | --- |
| 604 | `function asString(value) {` |
| 610 | `return asString(value)` |
| 624 | `if (Number.isNaN(date.getTime())) return asString(value);` |
| 674 | `const overflowY = asString(style.overflowY).toLowerCase();` |
| 776 | `const targetIntegrationId = asString(session.restoreFocusIntegrationId \|\| session.selectedIntegrationId);` |
| 822 | `const text = asString(value).trim();` |
| 881 | `return asString(record.primary_value \|\| sourceValue \|\| record.config?.[field.key] \|\| suggested);` |
| 883 | `return asString(record.config?.[field.key] \|\| suggested);` |
| 997 | `return asString(source.value);` |
| 1086 | `asString,` |
| 1096 | `return asString(record.primary_value \|\| sourceValue \|\| record.config?.[field.key] \|\| suggestedValue);` |
| 1098 | `return asString(record.config?.[field.key] \|\| suggestedValue);` |
| 1112 | `const configValue = asString(asObject(record.config)[field.key]).trim();` |
| 1118 | `return Boolean(asString(record.primary_value).trim());` |
| 1130 | `const savedStoreUrl = asString(asObject(record.config).storeUrl).trim();` |
| 1157 | `const value = asString(getFieldValue(session, integration, field, record, sourceValue, getSuggestedFieldValue(state, integration, field))).trim();` |
| 1166 | `const value = asString(getFieldValue(session, integration, field, record, sourceValue, getSuggestedFieldValue(state, integration, field))).trim();` |
| 1173 | `const normalized = asString(statusLabel).trim().toLowerCase();` |
| 1187 | `return asString(integration.unavailableReason) \|\| "This integration is unavailable because backend provider support is not configured yet.";` |
| 1190 | `if (asString(record.health_summary).trim()) {` |
| 1191 | `return asString(record.health_summary).trim();` |
| 1204 | `return asString(record.last_error) \|\| "The last action failed. Review the connection inputs and try again.";` |
| 1313 | `if (asString(nextValue).trim()) {` |
| 1320 | `const [integrationId, fieldKey] = asString(helper.getAttribute("data-integration-field-helper")).split(":");` |
| 1327 | `helper.textContent = "";` |
| 1332 | `helper.textContent = "Saved securely on server. Leave blank to keep the current secret.";` |
| 1337 | `helper.textContent = session.validationMessage;` |
| 1341 | `helper.textContent = field.required` |
| 1396 | `asString,` |
| 1423 | `const resolvedValue = asString(getResolvedFieldValue(state, session, integration, field, record, getLegacySourceValue(integration, getLegacySources(state)))).trim();` |
| 1430 | `const draftValue = asString(draft[field.key]).trim();` |
| 1442 | `const primaryValue = asString(getResolvedFieldValue(` |
| 1481 | `const value = asString(payload?.primary_value).trim();` |
| 1516 | `const approvalId = asString(error?.payload?.approval?.approval_id);` |
| 1668 | `escapeHtml,` |
| 1701 | `asString,` |
| 1734 | `asString(controlCenter.summary?.last_global_sync) \|\|` |
| 1752 | `<span class="card-badge ${escapeHtml(attentionTotal \|\| criticalMissingCount ? "warning" : "success")}">${escapeHtml(attentionTotal \|\| criticalMissingCount ? "Action needed" : "Operational")}</span>` |
| 1757 | `<strong>${escapeHtml(String(overview.totalIntegrations))}</strong>` |
| 1761 | `<strong>${escapeHtml(String(overview.connectedIntegrations))}</strong>` |
| 1765 | `<strong>${escapeHtml(String(overview.missingRequired))}</strong>` |
| 1769 | `<strong>${escapeHtml(String(overview.failedOrDisconnected))}</strong>` |
| 1773 | `<strong>${escapeHtml(String(systemScore))}%</strong>` |
| 1781 | `<span class="card-badge ${escapeHtml(aiRec.priorityTone)}">${escapeHtml(aiRec.priorityLabel)}</span>` |
| 1785 | `<div class="integration-next-action-connector-icon" data-integration-initials="${escapeHtml(aiRec.card.icon)}">${escapeHtml(aiRec.card.icon)}</div>` |
| 1787 | `<strong>${escapeHtml(aiRec.card.label)}</strong>` |
| 1788 | `<span>${escapeHtml(aiRec.card.domainTitle)}</span>` |
| 1794 | `<p><strong>Unlocks:</strong> ${escapeHtml(aiRec.card.enables)}</p>` |
| 1795 | `<p><strong>Decision confidence:</strong> ${escapeHtml(aiRec.card.whyItMatters)}</p>` |
| 1796 | `<p><strong>Risk if missing:</strong> ${escapeHtml(aiRec.reasonLabel)} remains unresolved.</p>` |
| 1799 | `<button class="btn btn-primary" type="button" data-integration-select="${escapeHtml(aiRec.card.id)}">Open connector setup</button>` |
| 1817 | `<span class="card-badge ${escapeHtml(filteredCards.length ? "neutral" : "warning")}">${escapeHtml(filteredCards.length ? `${filteredCards.length} visible` : "No matches")}</span>` |
| 1824 | `${Object.entries(CONNECTOR_WORKSPACE_CATEGORIES).map(([id, meta]) => `<option value="${escapeHtml(id)}" ${session.categoryFilter === id ? "selected" : ""}>${escapeHtml(meta.label)}</option>`).join("")}` |
| 1841 | `value="${escapeHtml(session.searchQuery)}"` |
| 1865 | `<span class="card-badge ${escapeHtml(diagnostics.blockers.length ? "danger" : diagnostics.warnings.length ? "warning" : "success")}">${escapeHtml(diagnostics.blockers.length ? "Blockers" : diagnostics.warnings.length ? "Warnings" : "Clear")}</span>` |
| 1882 | `<button class="btn btn-secondary" type="button" data-integration-prompt="prompt" data-integration-prompt-text="${escapeHtml(item.prompt)}">${escapeHtml(item.label)}</button>` |
| 1893 | `<span class="card-badge ${escapeHtml(activityFeed.some((item) => item.source === "real") ? "success" : "neutral")}">${escapeHtml(activityFeed.some((item) => item.source === "real") ? "Live feed" : "Derived feed")}</span>` |
| 1906 | `<span class="card-badge ${escapeHtml(criticalMissingCount \|\| attentionTotal ? "warning" : "success")}">${escapeHtml(criticalMissingCount \|\| attentionTotal ? "Needs review" : "Stable")}</span>` |
| 1946 | `escapeHtml,` |

## Focus Zones

### Imports / backend functions

```js
    1: import {
    2:   buildAISmartRecommendation,
    3:   buildConnectorWorkspaceGroups,
    4:   buildCoverageMap,
    5:   buildCriticalMissing,
    6:   buildDomainModels,
    7:   buildIntegrationActivityFeed,
    8:   buildIntegrationCardModel,
    9:   buildIntegrationOverviewSummary,
   10:   buildLaunchDiagnostics,
   11:   buildLegacyFallbackRecord,
   12:   buildRecommendations,
   13:   buildSectionGroups,
   14:   buildSuggestedValues,
   15:   CONNECTOR_WORKSPACE_CATEGORIES,
   16:   getConnectorWorkspaceStatus
   17: } from "./integrations/builders.js";
   18: 
   19: import { renderIntegrationDrawer } from "./integrations/drawer.js";
   20: 
   21: import {
   22:   renderConnectorGroup,
   23:   renderSelectedConnectorSummary
   24: } from "./integrations/cards.js";
   25: 
   26: import {
   27:   renderAISmartRecommendation as renderAISmartRecommendationModule,
   28:   renderIntegrationActivityFeed,
   29:   renderIntegrationCoverageMap,
   30:   renderIntegrationCriticalMissing,
   31:   renderIntegrationDiagnosticsList,
   32:   renderIntegrationRecommendationsList
   33: } from "./integrations/render.js";
   34: 
   35: const integrationSessions = new Map();
   36: let integrationDrawerEscapeHandler = null;
   37: const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
   38: 
   39: const INTEGRATION_DOMAINS = [
   40:   {
   41:     id: "website-commerce",
   42:     title: "Website & Commerce",
   43:     description: "Commercial infrastructure, storefronts, product data, orders, and conversion-aware commerce signals.",
   44:     integrations: [
   45:       {
   46:         id: "website",
   47:         sourceKey: "website",
   48:         label: "Website",
   49:         icon: "WE",
   50:         purpose: "Primary site connection for landing pages, traffic mapping, attribution, and conversion context.",
   51:         whyItMatters: "Without the website source, MH Assistant cannot connect content and campaign activity to real destination performance.",
   52:         enables: "Landing-page analysis, content-to-site traffic mapping, attribution context, and conversion path learning.",
   53:         dataScope: ["Pages", "Traffic", "Landing pages", "Conversions"],
   54:         permissionScope: "Website endpoint or root domain access",
   55:         critical: true,
   56:         primaryField: "url",
   57:         fields: [
   58:           { key: "url", label: "Website URL", placeholder: "https://brand.com", required: true },
   59:           { key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },
   60:           { key: "webhookUrl", label: "Webhook URL", placeholder: "https://brand.com/webhooks/mh", required: false }
   61:         ]
   62:       },
   63:       {
   64:         id: "woocommerce",
   65:         sourceKey: "ecommerce",
   66:         label: "WooCommerce",
   67:         icon: "WC",
   68:         purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",
   69:         whyItMatters: "Commerce data lets the system learn what content, campaigns, and pages actually influence sales.",
   70:         enables: "Product sync, order sync, sales signals, and commerce intelligence.",
   71:         dataScope: ["Products", "Orders", "Revenue", "Conversions"],
   72:         permissionScope: "Store URL + API consumer key/secret",
   73:         critical: true,
   74:         primaryField: "storeUrl",
   75:         fields: [
   76:           { key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },
   77:           { key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },
   78:           { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }
   79:         ]
   80:       },
   81:       {
```

### Provider catalog / supported ids

```js
    1: import {
    2:   buildAISmartRecommendation,
    3:   buildConnectorWorkspaceGroups,
    4:   buildCoverageMap,
    5:   buildCriticalMissing,
    6:   buildDomainModels,
    7:   buildIntegrationActivityFeed,
    8:   buildIntegrationCardModel,
    9:   buildIntegrationOverviewSummary,
   10:   buildLaunchDiagnostics,
   11:   buildLegacyFallbackRecord,
   12:   buildRecommendations,
   13:   buildSectionGroups,
   14:   buildSuggestedValues,
   15:   CONNECTOR_WORKSPACE_CATEGORIES,
   16:   getConnectorWorkspaceStatus
   17: } from "./integrations/builders.js";
   18: 
   19: import { renderIntegrationDrawer } from "./integrations/drawer.js";
   20: 
   21: import {
   22:   renderConnectorGroup,
   23:   renderSelectedConnectorSummary
   24: } from "./integrations/cards.js";
   25: 
   26: import {
   27:   renderAISmartRecommendation as renderAISmartRecommendationModule,
   28:   renderIntegrationActivityFeed,
   29:   renderIntegrationCoverageMap,
   30:   renderIntegrationCriticalMissing,
   31:   renderIntegrationDiagnosticsList,
   32:   renderIntegrationRecommendationsList
   33: } from "./integrations/render.js";
   34: 
   35: const integrationSessions = new Map();
   36: let integrationDrawerEscapeHandler = null;
   37: const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
   38: 
   39: const INTEGRATION_DOMAINS = [
   40:   {
   41:     id: "website-commerce",
   42:     title: "Website & Commerce",
   43:     description: "Commercial infrastructure, storefronts, product data, orders, and conversion-aware commerce signals.",
   44:     integrations: [
   45:       {
   46:         id: "website",
   47:         sourceKey: "website",
   48:         label: "Website",
   49:         icon: "WE",
   50:         purpose: "Primary site connection for landing pages, traffic mapping, attribution, and conversion context.",
   51:         whyItMatters: "Without the website source, MH Assistant cannot connect content and campaign activity to real destination performance.",
   52:         enables: "Landing-page analysis, content-to-site traffic mapping, attribution context, and conversion path learning.",
   53:         dataScope: ["Pages", "Traffic", "Landing pages", "Conversions"],
   54:         permissionScope: "Website endpoint or root domain access",
   55:         critical: true,
   56:         primaryField: "url",
   57:         fields: [
   58:           { key: "url", label: "Website URL", placeholder: "https://brand.com", required: true },
   59:           { key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },
   60:           { key: "webhookUrl", label: "Webhook URL", placeholder: "https://brand.com/webhooks/mh", required: false }
   61:         ]
   62:       },
   63:       {
   64:         id: "woocommerce",
   65:         sourceKey: "ecommerce",
   66:         label: "WooCommerce",
   67:         icon: "WC",
   68:         purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",
   69:         whyItMatters: "Commerce data lets the system learn what content, campaigns, and pages actually influence sales.",
   70:         enables: "Product sync, order sync, sales signals, and commerce intelligence.",
   71:         dataScope: ["Products", "Orders", "Revenue", "Conversions"],
   72:         permissionScope: "Store URL + API consumer key/secret",
   73:         critical: true,
   74:         primaryField: "storeUrl",
   75:         fields: [
   76:           { key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },
   77:           { key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },
   78:           { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }
   79:         ]
   80:       },
   81:       {
   82:         id: "shopify",
   83:         sourceKey: "shopify",
   84:         label: "Shopify",
   85:         icon: "SH",
   86:         purpose: "Future-ready Shopify storefront integration for products, orders, and sales intelligence.",
   87:         whyItMatters: "Shopify unlocks product catalogs, order flow, and conversion insights for commerce-first projects.",
```

### Credentials form / fields

```js
    1: import {
    2:   buildAISmartRecommendation,
    3:   buildConnectorWorkspaceGroups,
    4:   buildCoverageMap,
    5:   buildCriticalMissing,
    6:   buildDomainModels,
    7:   buildIntegrationActivityFeed,
    8:   buildIntegrationCardModel,
    9:   buildIntegrationOverviewSummary,
   10:   buildLaunchDiagnostics,
   11:   buildLegacyFallbackRecord,
   12:   buildRecommendations,
   13:   buildSectionGroups,
   14:   buildSuggestedValues,
   15:   CONNECTOR_WORKSPACE_CATEGORIES,
   16:   getConnectorWorkspaceStatus
   17: } from "./integrations/builders.js";
   18: 
   19: import { renderIntegrationDrawer } from "./integrations/drawer.js";
   20: 
   21: import {
   22:   renderConnectorGroup,
   23:   renderSelectedConnectorSummary
   24: } from "./integrations/cards.js";
   25: 
   26: import {
   27:   renderAISmartRecommendation as renderAISmartRecommendationModule,
   28:   renderIntegrationActivityFeed,
   29:   renderIntegrationCoverageMap,
   30:   renderIntegrationCriticalMissing,
   31:   renderIntegrationDiagnosticsList,
   32:   renderIntegrationRecommendationsList
   33: } from "./integrations/render.js";
   34: 
   35: const integrationSessions = new Map();
   36: let integrationDrawerEscapeHandler = null;
   37: const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
   38: 
   39: const INTEGRATION_DOMAINS = [
   40:   {
   41:     id: "website-commerce",
   42:     title: "Website & Commerce",
   43:     description: "Commercial infrastructure, storefronts, product data, orders, and conversion-aware commerce signals.",
   44:     integrations: [
   45:       {
   46:         id: "website",
   47:         sourceKey: "website",
   48:         label: "Website",
   49:         icon: "WE",
   50:         purpose: "Primary site connection for landing pages, traffic mapping, attribution, and conversion context.",
   51:         whyItMatters: "Without the website source, MH Assistant cannot connect content and campaign activity to real destination performance.",
   52:         enables: "Landing-page analysis, content-to-site traffic mapping, attribution context, and conversion path learning.",
   53:         dataScope: ["Pages", "Traffic", "Landing pages", "Conversions"],
   54:         permissionScope: "Website endpoint or root domain access",
   55:         critical: true,
   56:         primaryField: "url",
   57:         fields: [
   58:           { key: "url", label: "Website URL", placeholder: "https://brand.com", required: true },
   59:           { key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },
   60:           { key: "webhookUrl", label: "Webhook URL", placeholder: "https://brand.com/webhooks/mh", required: false }
   61:         ]
   62:       },
   63:       {
   64:         id: "woocommerce",
   65:         sourceKey: "ecommerce",
   66:         label: "WooCommerce",
   67:         icon: "WC",
   68:         purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",
   69:         whyItMatters: "Commerce data lets the system learn what content, campaigns, and pages actually influence sales.",
   70:         enables: "Product sync, order sync, sales signals, and commerce intelligence.",
   71:         dataScope: ["Products", "Orders", "Revenue", "Conversions"],
   72:         permissionScope: "Store URL + API consumer key/secret",
   73:         critical: true,
   74:         primaryField: "storeUrl",
   75:         fields: [
   76:           { key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },
   77:           { key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },
   78:           { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }
   79:         ]
   80:       },
   81:       {
   82:         id: "shopify",
   83:         sourceKey: "shopify",
   84:         label: "Shopify",
   85:         icon: "SH",
   86:         purpose: "Future-ready Shopify storefront integration for products, orders, and sales intelligence.",
   87:         whyItMatters: "Shopify unlocks product catalogs, order flow, and conversion insights for commerce-first projects.",
   88:         enables: "Product sync, order sync, customer sync, and sales reporting.",
   89:         dataScope: ["Products", "Orders", "Customers", "Sales"],
   90:         permissionScope: "Store domain + admin access token",
   91:         primaryField: "storeDomain",
   92:         fields: [
   93:           { key: "storeDomain", label: "Store domain", placeholder: "brand.myshopify.com", required: true },
   94:           { key: "adminToken", label: "Admin token", placeholder: "shpat_...", type: "password" },
   95:           { key: "storeId", label: "Store ID", placeholder: "Shopify store ID" }
   96:         ]
   97:       },
   98:       {
   99:         id: "amazon",
  100:         sourceKey: "amazon",
  101:         backendSupported: false,
  102:         unavailableReason: "Backend provider support is not configured yet.",
  103:         label: "Amazon",
  104:         icon: "AM",
  105:         purpose: "Marketplace performance, product-driven commerce signals, and listing intelligence.",
  106:         whyItMatters: "Amazon data gives MH Assistant direct product demand and marketplace sales feedback.",
  107:         enables: "Listing sync, sales signals, performance by product, and marketplace learning.",
  108:         dataScope: ["Listings", "Orders", "Sales", "Marketplace performance"],
  109:         permissionScope: "Merchant ID + SP-API credentials",
  110:         primaryField: "merchantId",
  111:         fields: [
  112:           { key: "merchantId", label: "Merchant ID", placeholder: "Amazon merchant ID", required: true },
  113:           { key: "sellerUrl", label: "Store URL", placeholder: "https://amazon.com/shops/brand" },
  114:           { key: "accessToken", label: "Access token", placeholder: "Amazon access token", type: "password" }
  115:         ]
  116:       },
  117:       {
  118:         id: "ebay",
  119:         sourceKey: "ebay",
  120:         label: "eBay",
  121:         icon: "EB",
  122:         purpose: "Marketplace listing and commerce signal sync for eBay surfaces.",
  123:         whyItMatters: "eBay extends commerce intelligence beyond the owned store and helps the system learn external demand patterns.",
  124:         enables: "Listing sync, order sync, product demand signals, and marketplace coverage.",
  125:         dataScope: ["Listings", "Orders", "Sales", "Marketplace activity"],
  126:         permissionScope: "Seller account + OAuth access token",
  127:         primaryField: "sellerId",
  128:         fields: [
  129:           { key: "sellerId", label: "Seller ID", placeholder: "eBay seller ID", required: true },
  130:           { key: "storeUrl", label: "Store URL", placeholder: "https://ebay.com/usr/brand" },
  131:           { key: "accessToken", label: "Access token", placeholder: "eBay access token", type: "password" }
  132:         ]
  133:       }
  134:     ]
  135:   },
  136:   {
  137:     id: "social",
  138:     title: "Social Platforms",
  139:     description: "Post insights, video performance, engagement, comments, publishing paths, and linked account intelligence.",
```

### Reconnect / repair action

```js
  691:   return null;
  692: }
  693: 
  694: function getIntegrationsScrollTarget() {
  695:   if (typeof window === "undefined" || typeof document === "undefined") {
  696:     return { mode: "window", element: null };
  697:   }
  698: 
  699:   const page = document.querySelector('[data-page="integrations"]');
  700:   const ancestorContainer = findScrollableAncestor(page);
  701: 
  702:   if (ancestorContainer) {
  703:     return { mode: "element", element: ancestorContainer };
  704:   }
  705: 
  706:   const scrollingElement = document.scrollingElement;
  707:   if (scrollingElement instanceof HTMLElement) {
  708:     return { mode: "element", element: scrollingElement };
  709:   }
  710: 
  711:   return { mode: "window", element: null };
  712: }
  713: 
  714: function captureIntegrationsScrollState() {
  715:   const target = getIntegrationsScrollTarget();
  716: 
  717:   if (target.mode === "element" && target.element) {
  718:     return {
  719:       mode: "element",
  720:       top: Number(target.element.scrollTop || 0)
  721:     };
  722:   }
  723: 
  724:   return {
  725:     mode: "window",
  726:     top: Number(window.scrollY || window.pageYOffset || 0)
  727:   };
  728: }
  729: 
  730: function restoreIntegrationsScrollState(scrollState) {
  731:   if (!scrollState || typeof window === "undefined") return;
  732: 
  733:   const safeTop = Math.max(0, Number(scrollState.top || 0));
  734:   const target = getIntegrationsScrollTarget();
  735: 
  736:   if (scrollState.mode === "element" && target.mode === "element" && target.element) {
  737:     target.element.scrollTop = safeTop;
  738:     return;
  739:   }
  740: 
  741:   if (target.mode === "element" && target.element instanceof HTMLElement) {
  742:     target.element.scrollTop = safeTop;
  743:     return;
  744:   }
  745: 
  746:   window.scrollTo({ top: safeTop, behavior: "auto" });
  747: }
  748: 
  749: function openIntegrationDrawer(session, integrationId) {
  750:   session.selectedIntegrationId = integrationId || "";
  751:   session.activeDrawerIntegrationId = integrationId || "";
  752:   session.drawerOpen = Boolean(integrationId);
  753:   session.drawerOriginIntegrationId = integrationId || "";
  754:   session.drawerOriginScrollState = captureIntegrationsScrollState();
  755: }
  756: 
  757: function closeIntegrationDrawer(session) {
  758:   const closedIntegrationId = session.activeDrawerIntegrationId || session.selectedIntegrationId || "";
  759: 
  760:   session.drawerOpen = false;
  761:   session.activeDrawerIntegrationId = "";
  762:   session.selectedIntegrationId = closedIntegrationId || session.selectedIntegrationId;
  763:   session.restoreFocusIntegrationId = closedIntegrationId;
  764:   session.restoreScrollState = session.drawerOriginScrollState || captureIntegrationsScrollState();
  765: 
  766:   session.validationIntegrationId = "";
  767:   session.validationFieldKey = "";
  768:   session.validationMessage = "";
  769: }
  770: 
  771: function restoreConnectorContext(session) {
  772:   if (session.drawerOpen || typeof window === "undefined" || typeof document === "undefined") {
  773:     return;
  774:   }
  775: 
  776:   const targetIntegrationId = asString(session.restoreFocusIntegrationId || session.selectedIntegrationId);
  777:   const restoreState = session.restoreScrollState;
  778: 
  779:   if (!targetIntegrationId && !restoreState) {
  780:     return;
  781:   }
  782: 
  783:   session.restoreFocusIntegrationId = "";
  784:   session.restoreScrollState = null;
  785: 
  786:   window.requestAnimationFrame(() => {
  787:     restoreIntegrationsScrollState(restoreState);
  788: 
  789:     if (!targetIntegrationId) return;
  790: 
  791:     const selector = `[data-integration-select="${targetIntegrationId}"]`;
  792:     const trigger = document.querySelector(selector);
  793: 
  794:     if (trigger instanceof HTMLElement) {
  795:       trigger.focus({ preventScroll: true });
  796:       trigger.scrollIntoView({ block: "nearest", inline: "nearest" });
  797: 
  798:       const row = trigger.closest(".integration-control-row");
  799:       if (row instanceof HTMLElement) {
  800:         row.classList.add("is-selected");
  801:       }
  802:     }
  803:   });
  804: }
  805: 
  806: function setIntegrationValidation(session, integrationId, fieldKey, message) {
  807:   session.validationIntegrationId = integrationId || "";
  808:   session.validationFieldKey = fieldKey || "";
  809:   session.validationMessage = message || "";
  810: }
  811: 
  812: function clearIntegrationValidation(session, integrationId, fieldKey) {
  813:   const sameIntegration = !integrationId || session.validationIntegrationId === integrationId;
  814:   const sameField = !fieldKey || session.validationFieldKey === fieldKey;
  815:   if (!sameIntegration || !sameField) return;
  816:   session.validationIntegrationId = "";
  817:   session.validationFieldKey = "";
  818:   session.validationMessage = "";
  819: }
  820: 
  821: function normalizeSuggestedUrl(value) {
  822:   const text = asString(value).trim();
  823:   if (!text) return "";
  824:   if (/^https?:\/\//i.test(text)) return text;
  825:   return `https://${text}`;
  826: }
  827: 
  828: function getSuggestedHostname(value) {
  829:   const normalized = normalizeSuggestedUrl(value);
  830:   if (!normalized) return "";
  831:   try {
  832:     return new URL(normalized).hostname.replace(/^www\./i, "");
  833:   } catch (_) {
  834:     return "";
  835:   }
  836: }
  837: 
  838: function getProjectSetupOverview(state) {
  839:   return asObject(state.data?.overview?.overview);
  840: }
  841: 
  842: function getSuggestedFieldValue(state, integration, field) {
  843:   const overview = getProjectSetupOverview(state);
  844:   const websiteUrl = normalizeSuggestedUrl(overview.website_url);
  845:   const hostname = getSuggestedHostname(websiteUrl);
  846: 
  847:   if (!websiteUrl && !hostname) return "";
  848: 
  849:   if (integration.id === "website" && field.key === "url") {
  850:     return websiteUrl;
  851:   }
```

### Governance approval path

```js
 1435:       }
 1436: 
 1437:       if (resolvedValue) {
 1438:         config[field.key] = resolvedValue;
 1439:       }
 1440:     });
 1441: 
 1442:     const primaryValue = asString(getResolvedFieldValue(
 1443:       state,
 1444:       session,
 1445:       integration,
 1446:       integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0],
 1447:       record,
 1448:       getLegacySourceValue(integration, getLegacySources(state))
 1449:     )).trim();
 1450: 
 1451:     const accessModel = getIntegrationAccessModel(integration);
 1452: 
 1453:     return {
 1454:       source_key: integration.sourceKey,
 1455:       primary_field: integration.primaryField,
 1456:       primary_value: primaryValue,
 1457:       config,
 1458:       credentials,
 1459:       auth_fields: integration.fields.filter(isSecretField).map((field) => field.key),
 1460:       required_fields: integration.fields.filter((field) => field.required).map((field) => field.key),
 1461:       requires_credentials: requiresCredential(integration),
 1462:       data_scopes: inferScopeKeys(integration),
 1463:       read_scopes: accessModel.read,
 1464:       write_scopes: accessModel.write,
 1465:       connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
 1466:       permission_scope: integration.permissionScope,
 1467:       enables: integration.enables,
 1468:       sync_source_registry: shouldSyncLegacySource(integration)
 1469:     };
 1470:   }
 1471: 
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
```

### Disconnect confirmation

```js
 1458:       credentials,
 1459:       auth_fields: integration.fields.filter(isSecretField).map((field) => field.key),
 1460:       required_fields: integration.fields.filter((field) => field.required).map((field) => field.key),
 1461:       requires_credentials: requiresCredential(integration),
 1462:       data_scopes: inferScopeKeys(integration),
 1463:       read_scopes: accessModel.read,
 1464:       write_scopes: accessModel.write,
 1465:       connection_method: integration.fields.some(isSecretField) ? "oauth_or_key" : "direct_config",
 1466:       permission_scope: integration.permissionScope,
 1467:       enables: integration.enables,
 1468:       sync_source_registry: shouldSyncLegacySource(integration)
 1469:     };
 1470:   }
 1471: 
 1472:   async function persistPrimary(integrationId, reconnect = false) {
 1473:     const integration = getIntegrationById(integrationId);
 1474:     if (!integration) return;
 1475:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1476:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1477:       return;
 1478:     }
 1479:     const payload = buildConnectionPayload(integrationId);
 1480:     const primaryField = integration.fields.find((field) => field.key === integration.primaryField) || integration.fields[0];
 1481:     const value = asString(payload?.primary_value).trim();
 1482: 
 1483:     if (!value) {
 1484:       setIntegrationValidation(
 1485:         session,
 1486:         integrationId,
 1487:         primaryField.key,
 1488:         `Add ${primaryField.label.toLowerCase()} to continue.`
 1489:       );
 1490:       openIntegrationDrawer(session, integrationId);
 1491:       render();
 1492:       showError?.(`Enter ${primaryField.label.toLowerCase()} before connecting ${integration.label}.`);
 1493:       return;
 1494:     }
 1495: 
 1496:     try {
 1497:       if (reconnect) {
 1498:         await reconnectProjectIntegration(projectName, integrationId, payload);
 1499:       } else {
 1500:         await connectProjectIntegration(projectName, integrationId, payload);
 1501:       }
 1502:       clearDraft(session, integrationId);
 1503:       clearIntegrationValidation(session, integrationId);
 1504:       showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
 1505:       await reloadProjectData(projectName);
 1506:       render();
 1507:     } catch (error) {
 1508:       const governanceCode = String(
 1509:         error?.code ||
 1510:         error?.error ||
 1511:         error?.payload?.code ||
 1512:         error?.payload?.error ||
 1513:         ""
 1514:       ).toLowerCase();
 1515:       if (reconnect && governanceCode === "governance_approval_required") {
 1516:         const approvalId = asString(error?.payload?.approval?.approval_id);
 1517:         showMessage?.(`Governance approval requested for ${integration.label}${approvalId ? ` (${approvalId})` : ""}. Review and decide it in Governance before reconnecting.`);
 1518:         try {
 1519:           await reloadProjectData(projectName);
 1520:         } catch (_) {}
 1521:         navigateTo("governance");
 1522:         render();
 1523:         return;
 1524:       }
 1525: 
 1526:       showError?.(error.message || `Failed to connect ${integration.label}.`);
 1527:     }
 1528:   }
 1529: 
 1530:   async function disconnect(integrationId) {
 1531:     const integration = getIntegrationById(integrationId);
 1532:     if (!integration) return;
 1533:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1534:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1535:       return;
 1536:     }
 1537: 
 1538:     const confirmed = window.confirm(`Confirm integration disconnect\n\nAction: Disconnect ${integration.label} from the current project.\nRisk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.\nAuthority: This is a backend-governed integration state update.\n\nSelect Cancel to keep the integration connected.`);
 1539:     if (!confirmed) {
 1540:       return;
 1541:     }
 1542: 
 1543:     try {
 1544:       await disconnectProjectIntegration(projectName, integrationId, {
 1545:         notes: `${integration.label} disconnected from the Control Center.`
 1546:       });
 1547:       clearDraft(session, integrationId);
 1548:       showMessage?.(`${integration.label} disconnected.`);
 1549:       await reloadProjectData(projectName);
 1550:       render();
 1551:     } catch (error) {
 1552:       showError?.(error.message || `Failed to disconnect ${integration.label}.`);
 1553:     }
 1554:   }
 1555: 
 1556:   async function runServerAction(integrationId, type) {
 1557:     const integration = getIntegrationById(integrationId);
 1558:     if (!integration) return;
 1559:     if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1560:       showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
 1561:       return;
 1562:     }
 1563: 
 1564:     const state = getState();
 1565:     const record = getServerRecord(state, integration);
 1566: 
 1567:     if (type === "test") {
 1568:       const preflightIssue = getTestPreflightIssue(integration, record);
 1569:       if (preflightIssue) {
 1570:         setIntegrationValidation(session, integrationId, preflightIssue.fieldKey, preflightIssue.message);
 1571:         openIntegrationDrawer(session, integrationId);
 1572:         render();
 1573:         showError?.(preflightIssue.message);
 1574:         return;
 1575:       }
 1576:     }
 1577: 
 1578:     try {
 1579:       if (type === "test") {
 1580:         await testProjectIntegration(projectName, integrationId, {
 1581:           notes: `${integration.label} connection test passed from the Control Center.`
 1582:         });
 1583:         showMessage?.(`${integration.label} test completed.`);
 1584:       } else if (type === "sync") {
 1585:         await syncProjectIntegration(projectName, integrationId, {
 1586:           notes: `${integration.label} sync triggered from the Control Center.`
 1587:         });
 1588:         showMessage?.(`${integration.label} backend sync started.`);
 1589:       } else if (type === "import") {
 1590:         await importProjectIntegrationHistory(projectName, integrationId, {
 1591:           notes: `${integration.label} historical import triggered from the Control Center.`
 1592:         });
 1593:         showMessage?.(`${integration.label} historical import started.`);
 1594:       }
 1595: 
 1596:       await reloadProjectData(projectName);
 1597:       render();
 1598:     } catch (error) {
 1599:       showError?.(error.message || `Failed to ${type} ${integration.label}.`);
 1600:     }
 1601:   }
 1602: 
 1603:   Array.from(document.querySelectorAll("[data-integration-action]")).forEach((button) => {
 1604:     button.onclick = async () => {
 1605:       const action = button.getAttribute("data-integration-action") || "";
 1606:       const integrationId = button.getAttribute("data-integration-id") || "";
 1607: 
 1608:       if (action === "connect") {
 1609:         await persistPrimary(integrationId, false);
 1610:         return;
 1611:       }
 1612:       if (action === "reconnect") {
 1613:         await persistPrimary(integrationId, true);
 1614:         return;
 1615:       }
 1616:       if (action === "disconnect") {
 1617:         await disconnect(integrationId);
 1618:         return;
```

### Sync / import / test actions

```js
    1: import {
    2:   buildAISmartRecommendation,
    3:   buildConnectorWorkspaceGroups,
    4:   buildCoverageMap,
    5:   buildCriticalMissing,
    6:   buildDomainModels,
    7:   buildIntegrationActivityFeed,
    8:   buildIntegrationCardModel,
    9:   buildIntegrationOverviewSummary,
   10:   buildLaunchDiagnostics,
   11:   buildLegacyFallbackRecord,
   12:   buildRecommendations,
   13:   buildSectionGroups,
   14:   buildSuggestedValues,
   15:   CONNECTOR_WORKSPACE_CATEGORIES,
   16:   getConnectorWorkspaceStatus
   17: } from "./integrations/builders.js";
   18: 
   19: import { renderIntegrationDrawer } from "./integrations/drawer.js";
   20: 
   21: import {
   22:   renderConnectorGroup,
   23:   renderSelectedConnectorSummary
   24: } from "./integrations/cards.js";
   25: 
   26: import {
   27:   renderAISmartRecommendation as renderAISmartRecommendationModule,
   28:   renderIntegrationActivityFeed,
   29:   renderIntegrationCoverageMap,
   30:   renderIntegrationCriticalMissing,
   31:   renderIntegrationDiagnosticsList,
   32:   renderIntegrationRecommendationsList
   33: } from "./integrations/render.js";
   34: 
   35: const integrationSessions = new Map();
   36: let integrationDrawerEscapeHandler = null;
   37: const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
   38: 
   39: const INTEGRATION_DOMAINS = [
   40:   {
   41:     id: "website-commerce",
   42:     title: "Website & Commerce",
   43:     description: "Commercial infrastructure, storefronts, product data, orders, and conversion-aware commerce signals.",
   44:     integrations: [
   45:       {
   46:         id: "website",
   47:         sourceKey: "website",
   48:         label: "Website",
   49:         icon: "WE",
   50:         purpose: "Primary site connection for landing pages, traffic mapping, attribution, and conversion context.",
   51:         whyItMatters: "Without the website source, MH Assistant cannot connect content and campaign activity to real destination performance.",
   52:         enables: "Landing-page analysis, content-to-site traffic mapping, attribution context, and conversion path learning.",
   53:         dataScope: ["Pages", "Traffic", "Landing pages", "Conversions"],
   54:         permissionScope: "Website endpoint or root domain access",
   55:         critical: true,
   56:         primaryField: "url",
   57:         fields: [
   58:           { key: "url", label: "Website URL", placeholder: "https://brand.com", required: true },
   59:           { key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },
   60:           { key: "webhookUrl", label: "Webhook URL", placeholder: "https://brand.com/webhooks/mh", required: false }
   61:         ]
   62:       },
   63:       {
   64:         id: "woocommerce",
   65:         sourceKey: "ecommerce",
   66:         label: "WooCommerce",
   67:         icon: "WC",
   68:         purpose: "Store, product, order, and sales sync for WooCommerce-driven projects.",
   69:         whyItMatters: "Commerce data lets the system learn what content, campaigns, and pages actually influence sales.",
   70:         enables: "Product sync, order sync, sales signals, and commerce intelligence.",
   71:         dataScope: ["Products", "Orders", "Revenue", "Conversions"],
   72:         permissionScope: "Store URL + API consumer key/secret",
   73:         critical: true,
   74:         primaryField: "storeUrl",
   75:         fields: [
   76:           { key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },
   77:           { key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },
   78:           { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }
   79:         ]
   80:       },
   81:       {
   82:         id: "shopify",
   83:         sourceKey: "shopify",
   84:         label: "Shopify",
   85:         icon: "SH",
   86:         purpose: "Future-ready Shopify storefront integration for products, orders, and sales intelligence.",
   87:         whyItMatters: "Shopify unlocks product catalogs, order flow, and conversion insights for commerce-first projects.",
   88:         enables: "Product sync, order sync, customer sync, and sales reporting.",
   89:         dataScope: ["Products", "Orders", "Customers", "Sales"],
   90:         permissionScope: "Store domain + admin access token",
   91:         primaryField: "storeDomain",
   92:         fields: [
   93:           { key: "storeDomain", label: "Store domain", placeholder: "brand.myshopify.com", required: true },
   94:           { key: "adminToken", label: "Admin token", placeholder: "shpat_...", type: "password" },
   95:           { key: "storeId", label: "Store ID", placeholder: "Shopify store ID" }
   96:         ]
   97:       },
   98:       {
   99:         id: "amazon",
  100:         sourceKey: "amazon",
  101:         backendSupported: false,
  102:         unavailableReason: "Backend provider support is not configured yet.",
  103:         label: "Amazon",
  104:         icon: "AM",
  105:         purpose: "Marketplace performance, product-driven commerce signals, and listing intelligence.",
  106:         whyItMatters: "Amazon data gives MH Assistant direct product demand and marketplace sales feedback.",
  107:         enables: "Listing sync, sales signals, performance by product, and marketplace learning.",
  108:         dataScope: ["Listings", "Orders", "Sales", "Marketplace performance"],
  109:         permissionScope: "Merchant ID + SP-API credentials",
  110:         primaryField: "merchantId",
  111:         fields: [
  112:           { key: "merchantId", label: "Merchant ID", placeholder: "Amazon merchant ID", required: true },
  113:           { key: "sellerUrl", label: "Store URL", placeholder: "https://amazon.com/shops/brand" },
  114:           { key: "accessToken", label: "Access token", placeholder: "Amazon access token", type: "password" }
  115:         ]
  116:       },
  117:       {
  118:         id: "ebay",
  119:         sourceKey: "ebay",
  120:         label: "eBay",
  121:         icon: "EB",
  122:         purpose: "Marketplace listing and commerce signal sync for eBay surfaces.",
  123:         whyItMatters: "eBay extends commerce intelligence beyond the owned store and helps the system learn external demand patterns.",
  124:         enables: "Listing sync, order sync, product demand signals, and marketplace coverage.",
  125:         dataScope: ["Listings", "Orders", "Sales", "Marketplace activity"],
  126:         permissionScope: "Seller account + OAuth access token",
  127:         primaryField: "sellerId",
  128:         fields: [
  129:           { key: "sellerId", label: "Seller ID", placeholder: "eBay seller ID", required: true },
  130:           { key: "storeUrl", label: "Store URL", placeholder: "https://ebay.com/usr/brand" },
  131:           { key: "accessToken", label: "Access token", placeholder: "eBay access token", type: "password" }
  132:         ]
  133:       }
  134:     ]
  135:   },
  136:   {
  137:     id: "social",
  138:     title: "Social Platforms",
  139:     description: "Post insights, video performance, engagement, comments, publishing paths, and linked account intelligence.",
  140:     integrations: [
  141:       {
  142:         id: "facebook",
  143:         sourceKey: "facebook",
  144:         label: "Facebook",
  145:         icon: "FB",
  146:         purpose: "Page insights, post performance, engagement, and linked business intelligence.",
  147:         whyItMatters: "Facebook insights help the system understand what posts drive reach, clicks, and downstream action.",
  148:         enables: "Post insights, engagement data, comments, publishing support, and ad account linkage.",
```

### Main render

```js
 1663:     </section>
 1664:   `,
 1665:   render({
 1666:     getState,
 1667:     $,
 1668:     escapeHtml,
 1669:     safeText,
 1670:     navigateTo,
 1671:     showMessage,
 1672:     showError,
 1673:     reloadProjectData,
 1674:     connectProjectIntegration,
 1675:     reconnectProjectIntegration,
 1676:     testProjectIntegration,
 1677:     syncProjectIntegration,
 1678:     importProjectIntegrationHistory,
 1679:     disconnectProjectIntegration
 1680:   }) {
 1681:     const state = getState();
 1682:     const projectName = state.context.currentProject || "";
 1683:     const session = ensureSession(projectName);
 1684:     const domainModels = buildDomainModels(state, session, {
 1685:       domains: INTEGRATION_DOMAINS,
 1686:       buildIntegrationCardModel: (integration, localSession, localState) => buildIntegrationCardModel(
 1687:         integration,
 1688:         localSession,
 1689:         localState,
 1690:         {
 1691:           getLegacySourceValue,
 1692:           getLegacySources,
 1693:           getServerRecord,
 1694:           unsupportedIntegrationIds: UNSUPPORTED_INTEGRATION_IDS,
 1695:           normalizeStatusLabel,
 1696:           getLocalFillCount,
 1697:           getRequiredMissing,
 1698:           getIntegrationAccessModel,
 1699:           asArray,
 1700:           asObject,
 1701:           asString,
 1702:           titleCase,
 1703:           inferScopeKeys,
 1704:           buildSuggestedValues,
 1705:           getSuggestedFieldValue,
 1706:           getHealthSummary
 1707:         }
 1708:       )
 1709:     });
 1710:     const sectionGroups = buildSectionGroups(domainModels);
 1711:     const allCards = domainModels.flatMap((domain) => domain.cards);
 1712:     if (!session.selectedIntegrationId || !allCards.find((card) => card.id === session.selectedIntegrationId)) {
 1713:       session.selectedIntegrationId = allCards[0]?.id || "";
 1714:     }
 1715:     const coverageMap = buildCoverageMap(domainModels);
 1716:     const criticalMissing = buildCriticalMissing(domainModels);
 1717:     const recommendations = buildRecommendations(domainModels, coverageMap);
 1718:     const aiRec = buildAISmartRecommendation(domainModels);
 1719:     const controlCenter = getControlCenterPayload(state);
 1720:     const overview = buildIntegrationOverviewSummary(allCards, recommendations);
 1721:     const diagnostics = buildLaunchDiagnostics(allCards);
 1722:     const connectorGroups = buildConnectorWorkspaceGroups(allCards, session);
 1723:     const filteredCards = connectorGroups.flatMap((group) => group.cards);
 1724:     const selectedCard = filteredCards.find((card) => card.id === session.selectedIntegrationId) || allCards.find((card) => card.id === session.selectedIntegrationId) || filteredCards[0] || allCards[0] || null;
 1725:     const drawerCard = allCards.find((card) => card.id === session.activeDrawerIntegrationId) || selectedCard;
 1726:     const attentionTotal = allCards.filter((card) => ["needs_setup", "failed"].includes(getConnectorWorkspaceStatus(card))).length;
 1727:     const readinessBase = Math.max(allCards.length, 1);
 1728:     const criticalMissingCount = criticalMissing.length;
 1729:     const connectedTotal = allCards.filter((card) => getConnectorWorkspaceStatus(card) === "connected").length;
 1730:     const partialTotal = allCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length;
 1731:     const systemScore = Math.round(((connectedTotal + partialTotal * 0.5) / readinessBase) * 100);
 1732:     const activityFeed = buildIntegrationActivityFeed(controlCenter, allCards);
 1733:     const lastGlobalSync =
 1734:       asString(controlCenter.summary?.last_global_sync) ||
 1735:       allCards
 1736:         .map((card) => card.lastSync)
 1737:         .filter(Boolean)
 1738:         .sort()
 1739:         .reverse()[0] || "";
 1740:     const root = $("integrationsRoot");
 1741:     if (!root) return;
 1742: 
 1743:     root.innerHTML = `
 1744:       <div class="integrations-wrapper integration-system-panel">
 1745:         <section class="card integration-system-overview integration-system-overview--compact">
 1746:           <div class="card-head integration-system-overview-head">
 1747:             <div>
 1748:               <div class="setup-kicker">Integration Control Tower</div>
 1749:               <h3>Executive health</h3>
 1750:               <p class="home-section-copy integration-system-purpose">Connect business platforms so MH-OS can sync performance, route safe backend actions, and learn from live operating data.</p>
 1751:             </div>
 1752:             <span class="card-badge ${escapeHtml(attentionTotal || criticalMissingCount ? "warning" : "success")}">${escapeHtml(attentionTotal || criticalMissingCount ? "Action needed" : "Operational")}</span>
 1753:           </div>
 1754:           <div class="integration-system-overview-grid">
 1755:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1756:               <span class="data-label">Total</span>
 1757:               <strong>${escapeHtml(String(overview.totalIntegrations))}</strong>
 1758:             </div>
 1759:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1760:               <span class="data-label">Connected</span>
 1761:               <strong>${escapeHtml(String(overview.connectedIntegrations))}</strong>
 1762:             </div>
 1763:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1764:               <span class="data-label">Missing</span>
 1765:               <strong>${escapeHtml(String(overview.missingRequired))}</strong>
 1766:             </div>
 1767:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1768:               <span class="data-label">Failed</span>
 1769:               <strong>${escapeHtml(String(overview.failedOrDisconnected))}</strong>
 1770:             </div>
 1771:             <div class="data-card integration-system-metric integration-system-metric--compact">
 1772:               <span class="data-label">Readiness</span>
 1773:               <strong>${escapeHtml(String(systemScore))}%</strong>
 1774:             </div>
 1775:           </div>
 1776: 
 1777:           ${aiRec.card ? `
 1778:             <div class="integration-system-overview-next integration-system-next-action" data-integration-next-action>
 1779:               <div class="integration-system-overview-next-head">
 1780:                 <h4>Next best action</h4>
 1781:                 <span class="card-badge ${escapeHtml(aiRec.priorityTone)}">${escapeHtml(aiRec.priorityLabel)}</span>
 1782:               </div>
 1783:               <div class="integration-next-action-body">
 1784:                 <div class="integration-next-action-connector">
 1785:                   <div class="integration-next-action-connector-icon" data-integration-initials="${escapeHtml(aiRec.card.icon)}">${escapeHtml(aiRec.card.icon)}</div>
 1786:                   <div class="integration-next-action-connector-info">
 1787:                     <strong>${escapeHtml(aiRec.card.label)}</strong>
 1788:                     <span>${escapeHtml(aiRec.card.domainTitle)}</span>
 1789:                   </div>
 1790:                 </div>
 1791:                 <details class="integration-next-action-details">
 1792:                   <summary class="integration-next-action-summary">Why this action now?</summary>
 1793:                   <div class="integration-next-action-why">
 1794:                     <p><strong>Unlocks:</strong> ${escapeHtml(aiRec.card.enables)}</p>
 1795:                     <p><strong>Decision confidence:</strong> ${escapeHtml(aiRec.card.whyItMatters)}</p>
 1796:                     <p><strong>Risk if missing:</strong> ${escapeHtml(aiRec.reasonLabel)} remains unresolved.</p>
 1797:                   </div>
 1798:                 </details>
 1799:                 <button class="btn btn-primary" type="button" data-integration-select="${escapeHtml(aiRec.card.id)}">Open connector setup</button>
 1800:               </div>
 1801:             </div>
 1802:           ` : ""}
 1803:         </section>
 1804:         ${aiRec.card ? "" : renderAISmartRecommendationModule(aiRec)}
 1805: 
 1806: 
 1807: 
 1808:         <section class="integration-system-workspace">
 1809:           <div class="integration-system-workspace-main">
 1810:             <section class="card integration-system-filters">
 1811:               <div class="card-head integration-system-filters-head">
 1812:                 <div>
 1813:                   <div class="setup-kicker">Required Operating Connectors</div>
 1814:                   <h3>Connector Control Center</h3>
 1815:                   <p class="home-section-copy" style="margin:6px 0 0;">Filter by category or status, search providers, and open setup quickly.</p>
 1816:                 </div>
 1817:                 <span class="card-badge ${escapeHtml(filteredCards.length ? "neutral" : "warning")}">${escapeHtml(filteredCards.length ? `${filteredCards.length} visible` : "No matches")}</span>
 1818:               </div>
 1819:               <div class="integration-filter-bar">
 1820:                 <label class="integration-filter-field">
 1821:                   <span class="setup-label">Category</span>
 1822:                   <select data-integration-category-filter>
 1823:                     <option value="all">All categories</option>
```

### Action binding

```js
 1178:   if (normalized === "error") return "Error";
 1179:   if (normalized === "token expired" || normalized === "token_expired") return "Token expired";
 1180:   if (normalized === "not connected" || normalized === "not_connected") return "Not Connected";
 1181: 
 1182:   return fallback;
 1183: }
 1184: 
 1185: function getHealthSummary(statusLabel, record, integration) {
 1186:   if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
 1187:     return asString(integration.unavailableReason) || "This integration is unavailable because backend provider support is not configured yet.";
 1188:   }
 1189: 
 1190:   if (asString(record.health_summary).trim()) {
 1191:     return asString(record.health_summary).trim();
 1192:   }
 1193: 
 1194:   if (statusLabel === "Connected") {
 1195:     return `${integration.label} is connected and ready for provider-level sync actions.`;
 1196:   }
 1197:   if (statusLabel === "Partial") {
 1198:     return "Some required connection details are still missing.";
 1199:   }
 1200:   if (statusLabel === "Token expired") {
 1201:     return "Reconnect the saved token before importing or syncing new data.";
 1202:   }
 1203:   if (statusLabel === "Error") {
 1204:     return asString(record.last_error) || "The last action failed. Review the connection inputs and try again.";
 1205:   }
 1206:   return "This integration has not been configured yet.";
 1207: }
 1208: 
 1209: function getConnectorWorkspaceAction(card) {
 1210:   const statusKey = getConnectorWorkspaceStatus(card);
 1211: 
 1212:   if (card.backendSupported === false) {
 1213:     return { label: "Open connector setup", action: "select" };
 1214:   }
 1215: 
 1216:   if (statusKey === "connected") {
 1217:     return {
 1218:       label: "Run backend sync",
 1219:       action: "sync"
 1220:     };
 1221:   }
 1222: 
 1223:   if (statusKey === "failed") {
 1224:     return {
 1225:       label: card.statusLabel === "Error" ? "Repair integration connection" : "Reconnect integration",
 1226:       action: shouldUseReconnectAction(card) ? "reconnect" : "connect"
 1227:     };
 1228:   }
 1229: 
 1230:   if (statusKey === "needs_setup") {
 1231:     return { label: "Complete setup", action: "select" };
 1232:   }
 1233: 
 1234:   return { label: "Connect", action: "connect" };
 1235: }
 1236: 
 1237: function focusDrawerField(session, card) {
 1238:   if (!session.drawerOpen || !card || typeof window === "undefined") return;
 1239: 
 1240:   const requiredEmptyField = card.fields.find((field) =>
 1241:     field.required && card.missingRequired.includes(field.label)
 1242:   );
 1243:   const fieldKey = session.validationFieldKey || requiredEmptyField?.key || card.fields[0]?.key;
 1244:   if (!fieldKey) return;
 1245: 
 1246:   window.requestAnimationFrame(() => {
 1247:     const input = document.querySelector(`[data-integration-drawer] [data-integration-field="${card.id}"][data-field-key="${fieldKey}"]`);
 1248:     if (input instanceof HTMLElement) {
 1249:       input.scrollIntoView({ block: "center", behavior: "smooth" });
 1250:       input.focus();
 1251:       if (typeof input.select === "function" && input.tagName === "INPUT") {
 1252:         input.select();
 1253:       }
 1254:     }
 1255:   });
 1256: }
 1257: 
 1258: function bindIntegrationActions({
 1259:   getState,
 1260:   $,
 1261:   navigateTo,
 1262:   showMessage,
 1263:   showError,
 1264:   reloadProjectData,
 1265:   connectProjectIntegration,
 1266:   reconnectProjectIntegration,
 1267:   testProjectIntegration,
 1268:   syncProjectIntegration,
 1269:   importProjectIntegrationHistory,
 1270:   disconnectProjectIntegration,
 1271:   projectName,
 1272:   session,
 1273:   render
 1274: }) {
 1275:   Array.from(document.querySelectorAll("[data-integration-select]")).forEach((button) => {
 1276:     button.onclick = () => {
 1277:       const integrationId = button.getAttribute("data-integration-select") || "";
 1278:       const integration = getIntegrationById(integrationId);
 1279:       openIntegrationDrawer(session, integrationId);
 1280:       showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
 1281:       render();
 1282:     };
 1283:   });
 1284: 
 1285:   Array.from(document.querySelectorAll("[data-integration-primary]")).forEach((button) => {
 1286:     button.onclick = async () => {
 1287:       const action = button.getAttribute("data-integration-primary") || "";
 1288:       const integrationId = button.getAttribute("data-integration-id") || "";
 1289:       const integration = getIntegrationById(integrationId);
 1290:       openIntegrationDrawer(session, integrationId);
 1291:       showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
 1292: 
 1293:       if (action === "manage") {
 1294:         render();
 1295:         return;
 1296:       }
 1297: 
 1298:       if (action === "unavailable") {
 1299:         render();
 1300:         return;
 1301:       }
 1302: 
 1303:       render();
 1304:     };
 1305:   });
 1306: 
 1307:   Array.from(document.querySelectorAll("[data-integration-field]")).forEach((input) => {
 1308:     input.oninput = (event) => {
 1309:       const integrationId = input.getAttribute("data-integration-field") || "";
 1310:       const fieldKey = input.getAttribute("data-field-key") || "";
 1311:       const nextValue = event.target.value || "";
 1312:       setFieldValue(session, integrationId, fieldKey, nextValue);
 1313:       if (asString(nextValue).trim()) {
 1314:         clearIntegrationValidation(session, integrationId, fieldKey);
 1315:       }
 1316:     };
 1317:   });
 1318: 
 1319:   Array.from(document.querySelectorAll("[data-integration-field-helper]")).forEach((helper) => {
 1320:     const [integrationId, fieldKey] = asString(helper.getAttribute("data-integration-field-helper")).split(":");
 1321:     const integration = getIntegrationById(integrationId);
 1322:     const state = getState();
 1323:     const record = integration ? getServerRecord(state, integration) : {};
 1324:     const field = integration?.fields?.find((item) => item.key === fieldKey);
 1325: 
 1326:     if (!field) {
 1327:       helper.textContent = "";
 1328:       return;
 1329:     }
 1330: 
 1331:     if (isSecretField(field) && hasSavedServerCredential(record, field.key)) {
 1332:       helper.textContent = "Saved securely on server. Leave blank to keep the current secret.";
 1333:       return;
 1334:     }
 1335: 
 1336:     if (session.validationIntegrationId === integrationId && session.validationFieldKey === fieldKey && session.validationMessage) {
 1337:       helper.textContent = session.validationMessage;
 1338:       return;
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Main render path | Found |
| Escaping evidence | Found |
| Reconnect / repair behavior | Found - requires focused proof |
| Governance approval path | Found |
| Disconnect confirmation | Found |

## Decision Rules
- If reconnect/repair creates or respects governance approval: safe enough, may close or polish.
- If disconnect has explicit confirmation: likely safe, verify exact backend path.
- If sync/import/test actions can mutate state without confirmation or governance: focused patch required.
- If missing credential display is unclear: UX/copy patch only.
- If sensitive provider data is rendered unsafely: safety patch required.
- Do not change CSS in this phase.
- Do not change backend authority in this phase.
- Do not change data/projects.

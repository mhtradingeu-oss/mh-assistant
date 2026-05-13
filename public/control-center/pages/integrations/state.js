/*
  Integrations OS State Layer

  Purpose:
  Own integration page session state only.

  This module is safe to introduce because it does not change runtime behavior yet.
*/

const integrationSessions = new Map();

export function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function asString(value) {
  if (value == null) return "";
  return String(value);
}

export function ensureIntegrationSession(projectName) {
  const key = projectName || "__default__";

  if (!integrationSessions.has(key)) {
    integrationSessions.set(key, {
      drafts: {},
      selectedIntegrationId: "",
      categoryFilter: "all",
      statusFilter: "all",
      searchQuery: "",
      activeDrawerIntegrationId: "",
      drawerOpen: false,
      validationIntegrationId: "",
      validationFieldKey: "",
      validationMessage: ""
    });
  }

  return integrationSessions.get(key);
}

export function openIntegrationDrawer(session, integrationId) {
  session.selectedIntegrationId = integrationId || "";
  session.activeDrawerIntegrationId = integrationId || "";
  session.drawerOpen = Boolean(integrationId);
}

export function closeIntegrationDrawer(session) {
  session.drawerOpen = false;
  session.activeDrawerIntegrationId = "";
  session.validationIntegrationId = "";
  session.validationFieldKey = "";
  session.validationMessage = "";
}

export function setIntegrationValidation(session, integrationId, fieldKey, message) {
  session.validationIntegrationId = integrationId || "";
  session.validationFieldKey = fieldKey || "";
  session.validationMessage = message || "";
}

export function clearIntegrationValidation(session, integrationId, fieldKey) {
  const sameIntegration = !integrationId || session.validationIntegrationId === integrationId;
  const sameField = !fieldKey || session.validationFieldKey === fieldKey;

  if (!sameIntegration || !sameField) return;

  session.validationIntegrationId = "";
  session.validationFieldKey = "";
  session.validationMessage = "";
}

export function ensureIntegrationDraft(session, integrationId) {
  if (!session.drafts[integrationId]) {
    session.drafts[integrationId] = {};
  }

  return session.drafts[integrationId];
}

export function clearIntegrationDraft(session, integrationId) {
  delete session.drafts[integrationId];
}

export function setIntegrationFieldValue(session, integrationId, fieldKey, value) {
  const draft = ensureIntegrationDraft(session, integrationId);
  draft[fieldKey] = value;
}

export function getIntegrationSessionsForDebug() {
  return integrationSessions;
}

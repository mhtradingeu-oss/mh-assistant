'use strict';

const {
  createEscalationContract
} = require('../../contracts/escalation-contract');

const escalations = new Map();

function createEscalation(input = {}) {
  const escalation = createEscalationContract(input);

  if (!escalation.escalation_id) {
    throw new Error('escalation_id is required');
  }

  escalations.set(escalation.escalation_id, escalation);

  return escalation;
}

function getEscalation(escalationId) {
  return escalations.get(String(escalationId || '')) || null;
}

function listEscalations() {
  return Array.from(escalations.values());
}

function updateEscalation(escalationId, updates = {}) {
  const current = getEscalation(escalationId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  escalations.set(current.escalation_id, updated);

  return updated;
}

module.exports = {
  createEscalation,
  getEscalation,
  listEscalations,
  updateEscalation
};

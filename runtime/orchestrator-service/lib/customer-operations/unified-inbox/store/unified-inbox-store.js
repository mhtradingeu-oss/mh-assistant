'use strict';

const {
  createUnifiedInboxContract
} = require('../../contracts/unified-inbox-contract');

const inboxEntries = new Map();

function createInboxEntry(input = {}) {
  const entry = createUnifiedInboxContract(input);

  if (!entry.inbox_id) {
    throw new Error('inbox_id is required');
  }

  inboxEntries.set(entry.inbox_id, entry);

  return entry;
}

function getInboxEntry(inboxId) {
  return inboxEntries.get(String(inboxId || '')) || null;
}

function listInboxEntries() {
  return Array.from(inboxEntries.values());
}

function updateInboxEntry(inboxId, updates = {}) {
  const current = getInboxEntry(inboxId);

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

  inboxEntries.set(current.inbox_id, updated);

  return updated;
}

module.exports = {
  createInboxEntry,
  getInboxEntry,
  listInboxEntries,
  updateInboxEntry
};

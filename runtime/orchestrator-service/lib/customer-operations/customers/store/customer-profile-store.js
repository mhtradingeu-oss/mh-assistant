'use strict';

const {
  createCustomerProfileContract
} = require('../../contracts/customer-profile-contract');

const customers = new Map();

function createCustomerProfile(input = {}) {
  const profile = createCustomerProfileContract(input);

  if (!profile.customer_id) {
    throw new Error('customer_id is required');
  }

  customers.set(profile.customer_id, profile);

  return profile;
}

function getCustomerProfile(customerId) {
  return customers.get(String(customerId || '')) || null;
}

function listCustomerProfiles() {
  return Array.from(customers.values());
}

function updateCustomerProfile(customerId, updates = {}) {
  const current = getCustomerProfile(customerId);

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

  customers.set(current.customer_id, updated);

  return updated;
}

module.exports = {
  createCustomerProfile,
  getCustomerProfile,
  listCustomerProfiles,
  updateCustomerProfile
};

'use strict';

const {
  createSlaPolicyContract
} = require('../../contracts/sla-policy-contract');

const policies = new Map();

function createSlaPolicy(input = {}) {
  const policy = createSlaPolicyContract(input);

  if (!policy.policy_id) {
    throw new Error('policy_id is required');
  }

  policies.set(policy.policy_id, policy);

  return policy;
}

function getSlaPolicy(policyId) {
  return policies.get(String(policyId || '')) || null;
}

function listSlaPolicies() {
  return Array.from(policies.values());
}

function updateSlaPolicy(policyId, updates = {}) {
  const current = getSlaPolicy(policyId);

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

  policies.set(current.policy_id, updated);

  return updated;
}

module.exports = {
  createSlaPolicy,
  getSlaPolicy,
  listSlaPolicies,
  updateSlaPolicy
};

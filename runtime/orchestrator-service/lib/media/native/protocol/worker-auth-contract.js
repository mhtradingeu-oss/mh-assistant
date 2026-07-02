'use strict';

function createWorkerAuthContract(input = {}) {
  return {
    protocol_version: '1.0.0',
    worker_id: String(input.worker_id || ''),
    api_key_present: Boolean(input.api_key),
    scopes: Array.isArray(input.scopes) ? input.scopes : [],
    issued_at: new Date().toISOString()
  };
}

module.exports = {
  createWorkerAuthContract
};

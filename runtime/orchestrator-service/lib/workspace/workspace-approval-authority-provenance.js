"use strict";

const authoritativeProjections = new WeakSet();
const governedCreationRequests = new WeakSet();

function markAuthoritativeProjection(value) {
  authoritativeProjections.add(value);
  return value;
}

function isAuthoritativeProjection(value) {
  return !!value && typeof value === "object" && authoritativeProjections.has(value);
}

function markGovernedCreationRequest(value) {
  governedCreationRequests.add(value);
  return value;
}

function isGovernedCreationRequest(value) {
  return !!value && typeof value === "object" && governedCreationRequests.has(value);
}

module.exports = Object.freeze({
  isAuthoritativeProjection,
  isGovernedCreationRequest,
  markAuthoritativeProjection,
  markGovernedCreationRequest
});

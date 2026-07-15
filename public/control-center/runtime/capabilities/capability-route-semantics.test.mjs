import assert from "node:assert/strict";

import {
  AI_COMMAND_CAPABILITY_IDENTITIES,
  getCapabilityByIdentity
} from "./capability-identity-map.js";

import {
  CAPABILITY_ROUTE_SEMANTIC_OVERRIDES,
  getCapabilityRouteSemantics
} from "./capability-route-semantics.js";

assert.equal(
  Object.keys(CAPABILITY_ROUTE_SEMANTIC_OVERRIDES).length,
  15
);

for (const capability of AI_COMMAND_CAPABILITY_IDENTITIES) {
  const semantics = getCapabilityRouteSemantics(capability);

  assert.ok(semantics);
  assert.equal(semantics.capabilityId, capability.capabilityId);
  assert.ok(Object.isFrozen(semantics));
  assert.ok(Object.isFrozen(semantics.handoffRoutes));
  assert.ok(Object.isFrozen(semantics.consumerRoutes));
}

const research = getCapabilityRouteSemantics(
  getCapabilityByIdentity("research.keyword_analysis")
);

assert.equal(research.surfaceOwnerRoute, "research");
assert.equal(research.primaryExecutionRoute, "research");
assert.ok(research.handoffRoutes.includes("insights"));

const customer = getCapabilityRouteSemantics(
  getCapabilityByIdentity("customer.reply_draft")
);

assert.equal(customer.surfaceOwnerRoute, "operations-centers");
assert.equal(customer.primaryExecutionRoute, null);
assert.equal(customer.resolution, "execution_route_requires_proof");

const priority = getCapabilityRouteSemantics(
  getCapabilityByIdentity("strategy.priority_recommendation")
);

assert.equal(priority.surfaceOwnerRoute, "ai-command");
assert.equal(priority.primaryExecutionRoute, null);
assert.ok(priority.handoffRoutes.includes("campaign-studio"));

const send = getCapabilityRouteSemantics(
  getCapabilityByIdentity("handoff.content")
);

assert.equal(send.surfaceOwnerRoute, "ai-command");
assert.equal(send.primaryExecutionRoute, "workflows");

const matchedDefault = getCapabilityRouteSemantics(
  getCapabilityByIdentity("content.rewrite")
);

assert.equal(matchedDefault.surfaceOwnerRoute, "content-studio");
assert.equal(matchedDefault.primaryExecutionRoute, "content-studio");
assert.equal(
  matchedDefault.resolution,
  "legacy_destination_compatibility_default"
);

console.log(
  "PASS: 59 capability route semantics validated with 15 explicit overrides"
);

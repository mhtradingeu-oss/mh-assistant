import assert from "node:assert/strict";

import {
  AI_COMMAND_CAPABILITY_IDENTITIES,
  CAPABILITY_MIGRATION_DECISIONS,
  getCapabilitiesByLegacyToolId,
  getCapabilityByIdentity,
  listCapabilitiesForDestination,
  listCapabilitiesForSpecialist
} from "./capability-identity-map.js";

assert.ok(AI_COMMAND_CAPABILITY_IDENTITIES.length >= 50);

for (const entry of AI_COMMAND_CAPABILITY_IDENTITIES) {
  assert.ok(entry.legacyToolId);
  assert.match(entry.capabilityId, /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/);
  assert.ok(entry.family);
  assert.ok(entry.specialist);
  assert.ok(entry.destinationRoute);
  assert.ok(entry.surfaceType);
  assert.ok(entry.migrationDecision);
  assert.ok(entry.executionExpectation);
  assert.ok(Object.isFrozen(entry));
}

const capabilityIds = AI_COMMAND_CAPABILITY_IDENTITIES.map((entry) => entry.capabilityId);
assert.equal(new Set(capabilityIds).size, capabilityIds.length);

assert.equal(
  getCapabilityByIdentity("content.rewrite")?.destinationRoute,
  "content-studio"
);

assert.ok(
  getCapabilitiesByLegacyToolId("rewrite")
    .some((entry) => entry.capabilityId === "content.rewrite")
);

assert.ok(listCapabilitiesForSpecialist("writer").length > 0);
assert.ok(listCapabilitiesForDestination("media-studio").length > 0);

assert.equal(
  getCapabilityByIdentity("strategy.priority_recommendation")?.migrationDecision,
  CAPABILITY_MIGRATION_DECISIONS.CONVERT_TO_PROMPT_SUGGESTION
);

console.log(
  `PASS: ${AI_COMMAND_CAPABILITY_IDENTITIES.length} capability identities validated`
);

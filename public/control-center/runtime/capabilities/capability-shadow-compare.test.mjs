import assert from "node:assert/strict";

import {
  clearToolCapabilityShadowObservations,
  compareToolToCapabilityIdentity,
  getToolCapabilityShadowObservations,
  recordToolCapabilityShadowObservation
} from "./capability-shadow-compare.js";

clearToolCapabilityShadowObservations();

const matched = compareToolToCapabilityIdentity({
  tool: {
    id: "rewrite",
    frontendOwnerPage: "content-studio",
    destinations: ["composer", "content-studio"]
  },
  observedSpecialist: "writer"
});

assert.equal(matched.status, "matched");
assert.equal(matched.capabilityId, "content.rewrite");
assert.equal(matched.specialistMatch, true);
assert.equal(matched.destinationMatch, true);
assert.equal(matched.candidateCount, 1);
assert.ok(Object.isFrozen(matched));
assert.ok(Object.isFrozen(matched.observedDestinations));

const specialistMismatch = compareToolToCapabilityIdentity({
  tool: {
    id: "rewrite",
    destinations: ["content-studio"]
  },
  observedSpecialist: "strategist"
});

assert.equal(specialistMismatch.status, "specialist_mismatch");
assert.equal(specialistMismatch.specialistMatch, false);

const destinationMismatch = compareToolToCapabilityIdentity({
  tool: {
    id: "rewrite",
    frontendOwnerPage: "media-studio",
    destinations: ["composer"]
  },
  observedSpecialist: "writer"
});

assert.equal(destinationMismatch.status, "destination_mismatch");
assert.equal(destinationMismatch.specialistMatch, true);
assert.equal(destinationMismatch.destinationMatch, false);

const unresolvedDestination = compareToolToCapabilityIdentity({
  tool: {
    id: "rewrite"
  },
  observedSpecialist: "writer"
});

assert.equal(unresolvedDestination.status, "matched");
assert.equal(unresolvedDestination.specialistMatch, true);
assert.equal(unresolvedDestination.destinationMatch, null);

const unknownSpecialistContext = compareToolToCapabilityIdentity({
  tool: {
    id: "rewrite",
    destinations: ["content-studio"]
  },
  observedSpecialist: ""
});

assert.equal(unknownSpecialistContext.status, "matched");
assert.equal(unknownSpecialistContext.specialistMatch, null);
assert.equal(unknownSpecialistContext.destinationMatch, true);

const unmapped = compareToolToCapabilityIdentity({
  tool: {
    id: "unknown-tool"
  },
  observedSpecialist: "writer"
});

assert.equal(unmapped.status, "unmapped");
assert.equal(unmapped.capabilityId, null);
assert.equal(unmapped.candidateCount, 0);

const missing = compareToolToCapabilityIdentity({
  tool: {},
  observedSpecialist: "writer"
});

assert.equal(missing.status, "missing_tool_id");

recordToolCapabilityShadowObservation({
  tool: {
    id: "rewrite",
    destinations: ["content-studio"]
  },
  observedSpecialist: "writer"
});

recordToolCapabilityShadowObservation({
  tool: {
    id: "translate",
    destinations: ["content-studio"]
  },
  observedSpecialist: "writer"
});

const snapshot = getToolCapabilityShadowObservations();

assert.equal(snapshot.length, 2);
assert.ok(Object.isFrozen(snapshot));
assert.equal(snapshot[0].legacyToolId, "rewrite");
assert.equal(snapshot[1].legacyToolId, "translate");

clearToolCapabilityShadowObservations();
assert.equal(getToolCapabilityShadowObservations().length, 0);

console.log("PASS: capability shadow comparator validated");

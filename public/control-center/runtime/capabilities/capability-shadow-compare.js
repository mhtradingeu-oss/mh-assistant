import {
  getCapabilitiesByLegacyToolId
} from "./capability-identity-map.js";

import {
  getCapabilityRouteSemantics
} from "./capability-route-semantics.js";

const MAX_SHADOW_OBSERVATIONS = 200;
const shadowObservations = new Map();

function normalize(value = "") {
  return String(value || "").trim();
}

function freezeArray(value = []) {
  return Object.freeze(Array.isArray(value) ? [...value] : []);
}

function buildObservationKey(toolId = "", specialistId = "") {
  return `${normalize(toolId)}::${normalize(specialistId) || "__unknown__"}`;
}

/**
 * Build a read-only comparison between active Tool Dock metadata and the
 * additive capability identity projection.
 *
 * This function does not grant authority, change routing, mutate the tool,
 * execute a provider, create a workflow, or affect UI behavior.
 */
export function compareToolToCapabilityIdentity({
  tool = null,
  observedSpecialist = ""
} = {}) {
  const legacyToolId = normalize(tool?.id);
  const rawSpecialist = normalize(observedSpecialist);
  const candidates = legacyToolId
    ? getCapabilitiesByLegacyToolId(legacyToolId)
    : [];

  const candidate = candidates.length === 1 ? candidates[0] : null;
  const routeSemantics = candidate
    ? getCapabilityRouteSemantics(candidate)
    : null;

  const rawDestinations = Array.isArray(tool?.destinations)
    ? tool.destinations.map(normalize).filter(Boolean)
    : [];

  const rawOwnerPage = normalize(tool?.frontendOwnerPage || tool?.owner);

  const specialistMatch = !rawSpecialist || !candidate
    ? null
    : rawSpecialist === candidate.specialist;

  const hasObservedDestination = Boolean(
    rawOwnerPage || rawDestinations.length
  );

  const destinationMatch = !candidate || !hasObservedDestination
    ? null
    : rawOwnerPage === candidate.destinationRoute ||
      rawDestinations.includes(candidate.destinationRoute);

  let status = "matched";

  if (!legacyToolId) {
    status = "missing_tool_id";
  } else if (candidates.length === 0) {
    status = "unmapped";
  } else if (candidates.length > 1) {
    status = "ambiguous";
  } else if (specialistMatch === false) {
    status = "specialist_mismatch";
  } else if (destinationMatch === false) {
    status = "destination_mismatch";
  }

  return Object.freeze({
    status,
    legacyToolId,
    observedSpecialist: rawSpecialist || null,
    projectedSpecialist: candidate?.specialist || null,
    capabilityId: candidate?.capabilityId || null,
    family: candidate?.family || null,
    destinationRoute: candidate?.destinationRoute || null,
    surfaceOwnerRoute: routeSemantics?.surfaceOwnerRoute || null,
    primaryExecutionRoute:
      routeSemantics?.primaryExecutionRoute || null,
    handoffRoutes: freezeArray(routeSemantics?.handoffRoutes || []),
    consumerRoutes: freezeArray(routeSemantics?.consumerRoutes || []),
    routeSemanticResolution:
      routeSemantics?.resolution || null,
    surfaceOwnerMatch:
      !routeSemantics?.surfaceOwnerRoute || !rawOwnerPage
        ? null
        : rawOwnerPage === routeSemantics.surfaceOwnerRoute,
    handoffRouteOverlap:
      !routeSemantics?.handoffRoutes?.length ||
      !rawDestinations.length
        ? null
        : rawDestinations.some((route) =>
            routeSemantics.handoffRoutes.includes(route)
          ),
    surfaceType: candidate?.surfaceType || null,
    migrationDecision: candidate?.migrationDecision || null,
    executionExpectation: candidate?.executionExpectation || null,
    observedOwnerPage: rawOwnerPage || null,
    observedDestinations: freezeArray(rawDestinations),
    specialistMatch,
    destinationMatch,
    candidateCount: candidates.length
  });
}

/**
 * Record a bounded in-memory diagnostic observation.
 *
 * No console output and no persistent storage are used.
 */
export function recordToolCapabilityShadowObservation({
  tool = null,
  observedSpecialist = ""
} = {}) {
  const observation = compareToolToCapabilityIdentity({
    tool,
    observedSpecialist
  });

  const key = buildObservationKey(
    observation.legacyToolId,
    observation.observedSpecialist
  );

  if (shadowObservations.has(key)) {
    shadowObservations.delete(key);
  }

  shadowObservations.set(key, observation);

  while (shadowObservations.size > MAX_SHADOW_OBSERVATIONS) {
    const oldestKey = shadowObservations.keys().next().value;
    shadowObservations.delete(oldestKey);
  }

  return observation;
}

export function getToolCapabilityShadowObservations() {
  return Object.freeze([...shadowObservations.values()]);
}

export function clearToolCapabilityShadowObservations() {
  shadowObservations.clear();
}

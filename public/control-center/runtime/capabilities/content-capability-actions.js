import {
  getCapabilityByIdentity
} from "./capability-identity-map.js";

const normalize = (value = "") =>
  String(value ?? "").trim();

const freezeStrings = (values = []) =>
  Object.freeze(
    [...new Set(
      (Array.isArray(values) ? values : [])
        .map(normalize)
        .filter(Boolean)
    )]
  );

const requireCapabilityIdentity = (capabilityId) => {
  const capability = getCapabilityByIdentity(capabilityId);

  if (!capability) {
    throw new Error(
      `Unknown canonical capability identity: ${capabilityId}`
    );
  }

  return capability;
};

const defineContentAction = ({
  capabilityId,
  legacyToolId,
  label,
  inputFields,
  requiresBackend = true,
  requiresConfirmation = true,
  outputHandling,
  reviewStatus = "needs_review",
  governanceMode = "standard_content_review",
  promptBuilder
}) => {
  const identity = requireCapabilityIdentity(capabilityId);

  if (identity.legacyToolId !== legacyToolId) {
    throw new Error(
      `Legacy Tool ID mismatch for ${capabilityId}: ` +
      `${legacyToolId} !== ${identity.legacyToolId}`
    );
  }

  if (typeof promptBuilder !== "function") {
    throw new TypeError(
      `Content capability ${capabilityId} requires a prompt builder`
    );
  }

  return Object.freeze({
    capabilityId,
    legacyToolId,
    label,
    inputFields: freezeStrings(inputFields),
    requiresBackend: Boolean(requiresBackend),
    requiresConfirmation: Boolean(requiresConfirmation),
    outputHandling,
    reviewStatus,
    governanceMode,
    promptBuilder
  });
};

export const CONTENT_CAPABILITY_OUTPUT_HANDLING = Object.freeze({
  APPEND_REVIEW_VERSION: "append_review_version",
  APPEND_LOCALIZED_VERSION: "append_localized_version",
  APPEND_IMPROVED_VERSION: "append_improved_version"
});

export const CONTENT_CAPABILITY_ACTIONS = Object.freeze({
  "content.create": defineContentAction({
    capabilityId: "content.create",
    legacyToolId: "write",
    label: "Create content",
    inputFields: [
      "brief",
      "mode",
      "language",
      "tone",
      "channel",
      "objective"
    ],
    outputHandling:
      CONTENT_CAPABILITY_OUTPUT_HANDLING.APPEND_REVIEW_VERSION,
    promptBuilder: ({
      projectName = "",
      brief = "",
      mode = "",
      language = "",
      tone = "",
      channel = "",
      objective = "",
      existingPrompt = ""
    } = {}) => {
      const canonicalPrompt = normalize(existingPrompt);

      if (canonicalPrompt) {
        return canonicalPrompt;
      }

      return [
        "Create a production-ready content draft.",
        projectName ? `Project: ${normalize(projectName)}` : "",
        mode ? `Content type: ${normalize(mode)}` : "",
        language ? `Language: ${normalize(language)}` : "",
        tone ? `Tone: ${normalize(tone)}` : "",
        channel ? `Channel: ${normalize(channel)}` : "",
        objective ? `Objective: ${normalize(objective)}` : "",
        "",
        normalize(brief)
      ].filter(Boolean).join("\n");
    }
  }),

  "content.translate": defineContentAction({
    capabilityId: "content.translate",
    legacyToolId: "translate",
    label: "Translate or localize content",
    inputFields: [
      "sourceContent",
      "targetLanguage",
      "brandTone",
      "campaignIntent"
    ],
    outputHandling:
      CONTENT_CAPABILITY_OUTPUT_HANDLING.APPEND_LOCALIZED_VERSION,
    promptBuilder: ({
      sourceContent = "",
      targetLanguage = "",
      brandTone = "",
      campaignIntent = ""
    } = {}) => [
      `Translate and localize the following content into ${
        normalize(targetLanguage) || "the requested language"
      }.`,
      "Preserve meaning, factual claims, brand identity, and campaign intent.",
      brandTone
        ? `Preserve this brand tone: ${normalize(brandTone)}.`
        : "",
      campaignIntent
        ? `Campaign intent: ${normalize(campaignIntent)}.`
        : "",
      "Do not add unsupported claims.",
      "",
      normalize(sourceContent)
    ].filter(Boolean).join("\n")
  }),

  "content.improve": defineContentAction({
    capabilityId: "content.improve",
    legacyToolId: "improve",
    label: "Improve content",
    inputFields: [
      "sourceContent",
      "language",
      "tone",
      "channel",
      "objective"
    ],
    outputHandling:
      CONTENT_CAPABILITY_OUTPUT_HANDLING.APPEND_IMPROVED_VERSION,
    promptBuilder: ({
      sourceContent = "",
      language = "",
      tone = "",
      channel = "",
      objective = ""
    } = {}) => [
      "Improve the following content while preserving its meaning.",
      "Strengthen the opening, clarity, value proposition, flow, and CTA.",
      "Keep claims factual and do not invent evidence.",
      language ? `Language: ${normalize(language)}.` : "",
      tone ? `Tone: ${normalize(tone)}.` : "",
      channel ? `Channel: ${normalize(channel)}.` : "",
      objective ? `Objective: ${normalize(objective)}.` : "",
      "",
      normalize(sourceContent)
    ].filter(Boolean).join("\n")
  })
});

export function getContentCapabilityAction(capabilityId = "") {
  return CONTENT_CAPABILITY_ACTIONS[normalize(capabilityId)] || null;
}

export function listContentCapabilityActions() {
  return Object.freeze(Object.values(CONTENT_CAPABILITY_ACTIONS));
}

export function buildContentCapabilityPrompt(
  capabilityId = "",
  input = {}
) {
  const action = getContentCapabilityAction(capabilityId);

  if (!action) {
    throw new Error(
      `Unsupported Content capability action: ${normalize(capabilityId)}`
    );
  }

  return action.promptBuilder(input);
}

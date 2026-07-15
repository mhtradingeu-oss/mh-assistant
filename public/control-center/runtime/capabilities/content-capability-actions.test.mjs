import assert from "node:assert/strict";

import {
  CONTENT_CAPABILITY_ACTIONS,
  CONTENT_CAPABILITY_OUTPUT_HANDLING,
  buildContentCapabilityPrompt,
  getContentCapabilityAction,
  listContentCapabilityActions
} from "./content-capability-actions.js";

const actions = listContentCapabilityActions();

assert.equal(actions.length, 3);
assert.ok(Object.isFrozen(actions));
assert.ok(Object.isFrozen(CONTENT_CAPABILITY_ACTIONS));

for (const action of actions) {
  assert.ok(action.capabilityId);
  assert.ok(action.legacyToolId);
  assert.ok(action.label);
  assert.ok(action.inputFields.length > 0);
  assert.ok(Object.isFrozen(action));
  assert.ok(Object.isFrozen(action.inputFields));
  assert.equal(typeof action.promptBuilder, "function");
  assert.equal(action.requiresBackend, true);
  assert.equal(action.requiresConfirmation, true);
  assert.equal(action.reviewStatus, "needs_review");
}

const create = getContentCapabilityAction("content.create");

assert.equal(create.legacyToolId, "write");
assert.equal(
  create.outputHandling,
  CONTENT_CAPABILITY_OUTPUT_HANDLING.APPEND_REVIEW_VERSION
);

const createPrompt = buildContentCapabilityPrompt(
  "content.create",
  {
    projectName: "HairoticMen",
    brief: "Create a launch post.",
    mode: "social_post",
    language: "German",
    tone: "Confident",
    channel: "Instagram",
    objective: "Launch awareness"
  }
);

assert.match(createPrompt, /HairoticMen/);
assert.match(createPrompt, /Create a launch post/);
assert.match(createPrompt, /German/);

const existingCreatePrompt = buildContentCapabilityPrompt(
  "content.create",
  {
    existingPrompt: "Existing canonical Content Studio prompt."
  }
);

assert.equal(
  existingCreatePrompt,
  "Existing canonical Content Studio prompt."
);

const translate = getContentCapabilityAction(
  "content.translate"
);

assert.equal(translate.legacyToolId, "translate");
assert.equal(
  translate.outputHandling,
  CONTENT_CAPABILITY_OUTPUT_HANDLING.APPEND_LOCALIZED_VERSION
);

const translatePrompt = buildContentCapabilityPrompt(
  "content.translate",
  {
    sourceContent: "Original launch copy.",
    targetLanguage: "Arabic",
    brandTone: "Premium",
    campaignIntent: "Product launch"
  }
);

assert.match(translatePrompt, /Arabic/);
assert.match(translatePrompt, /Original launch copy/);
assert.match(translatePrompt, /Premium/);

const improve = getContentCapabilityAction(
  "content.improve"
);

assert.equal(improve.legacyToolId, "improve");
assert.equal(
  improve.outputHandling,
  CONTENT_CAPABILITY_OUTPUT_HANDLING.APPEND_IMPROVED_VERSION
);

const improvePrompt = buildContentCapabilityPrompt(
  "content.improve",
  {
    sourceContent: "Weak draft.",
    language: "English",
    tone: "Professional",
    channel: "LinkedIn"
  }
);

assert.match(improvePrompt, /Weak draft/);
assert.match(improvePrompt, /Strengthen the opening/);
assert.match(improvePrompt, /LinkedIn/);

assert.throws(
  () => buildContentCapabilityPrompt("content.unknown", {}),
  /Unsupported Content capability action/
);

console.log(
  "PASS: 3 Content capability action contracts validated"
);

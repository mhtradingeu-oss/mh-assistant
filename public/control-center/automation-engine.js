import { buildSystemIntelligence } from "./system-intelligence.js";
import { setSharedAiDraft, setSharedHandoff } from "./shared-context.js";

const AUTO_MODE_STORAGE_KEY = "mh-auto-mode-state-v1";
const AUTO_MODE_MAX_LOGS = 80;
const AUTO_SAFE_TYPES = new Set([
  "navigate",
  "create_draft",
  "save_local_draft",
  "create_handoff",
  "generate_prompt",
  "prepare_workflow",
  "prepare_publishing_draft"
]);

const AUTO_BLOCK_PATTERNS = [
  { test: /publish\s*now|go\s*live|send\s*live|execute\s*publish|push\s*live/i, reason: "Publishing requires approval and manual confirmation." },
  { test: /\bdelete\b|\bremove\b|\bdestroy\b|\berase\b/i, reason: "Destructive actions are blocked in Auto Mode." },
  { test: /\boverwrite\b|\breplace\b|\btruncate\b/i, reason: "Overwrite actions are blocked in Auto Mode." },
  { test: /disconnect|revoke|unlink/i, reason: "Connection removal is blocked in Auto Mode." },
  { test: /approve\s*final\s*asset|final\s*approval/i, reason: "Final approvals require a human decision." },
  { test: /spend\s*money|charge|billing|payment|purchase/i, reason: "Spending actions require explicit manual approval." },
  { test: /send\s*external|send\s*email|send\s*message|dm\b|sms\b/i, reason: "External sending requires approval." },
  { test: /paid\s*ads|launch\s*ads|ad\s*spend|budget/i, reason: "Paid promotion requires approval." },
  { test: /credential|api\s*key|secret|token|auth/i, reason: "Credential and provider connection actions require approval." }
];

const autoModeListeners = new Set();

const autoModeRuntime = {
  context: {},
  runToken: 0
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function normalizeText(value) {
  return asString(value).trim().toLowerCase();
}

function nowIso() {
  return new Date().toISOString();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildDefaultAutoModeState() {
  return {
    enabled: false,
    mode: "off",
    currentPlan: [],
    currentStepIndex: 0,
    status: "idle",
    logs: [],
    lastRunAt: "",
    approvalRequiredStep: null
  };
}

function normalizeAutoModeState(raw) {
  const parsed = asObject(raw);
  const next = {
    enabled: Boolean(parsed.enabled),
    mode: ["off", "guided", "auto_until_approval"].includes(normalizeText(parsed.mode))
      ? normalizeText(parsed.mode)
      : "off",
    currentPlan: asArray(parsed.currentPlan),
    currentStepIndex: Math.max(0, Number(parsed.currentStepIndex) || 0),
    status: ["idle", "running", "paused", "waiting_approval", "completed", "failed"].includes(normalizeText(parsed.status))
      ? normalizeText(parsed.status)
      : "idle",
    logs: asArray(parsed.logs).slice(-AUTO_MODE_MAX_LOGS),
    lastRunAt: asString(parsed.lastRunAt),
    approvalRequiredStep: parsed.approvalRequiredStep == null ? null : asObject(parsed.approvalRequiredStep)
  };
  return next;
}

function readPersistedAutoModeState() {
  if (typeof window === "undefined") return buildDefaultAutoModeState();
  try {
    const raw = window.sessionStorage?.getItem(AUTO_MODE_STORAGE_KEY);
    if (!raw) return buildDefaultAutoModeState();
    const parsed = JSON.parse(raw);
    const state = normalizeAutoModeState(parsed);
    if (state.status === "running" || state.status === "waiting_approval") {
      state.status = "paused";
      state.enabled = false;
      state.mode = "off";
      state.logs = [
        ...state.logs,
        {
          at: nowIso(),
          level: "warning",
          message: "Auto Mode did not continue after reload. Resume manually if needed."
        }
      ].slice(-AUTO_MODE_MAX_LOGS);
    }
    return state;
  } catch (_) {
    return buildDefaultAutoModeState();
  }
}

function persistAutoModeState(state) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.setItem(AUTO_MODE_STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

let autoModeState = readPersistedAutoModeState();

function pushAutoLog(message, level = "info", extra = {}) {
  autoModeState.logs = [
    ...asArray(autoModeState.logs),
    {
      at: nowIso(),
      level,
      message: asString(message),
      ...asObject(extra)
    }
  ].slice(-AUTO_MODE_MAX_LOGS);
}

function emitAutoModeState() {
  persistAutoModeState(autoModeState);
  const snapshot = clone(autoModeState);
  autoModeListeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (_) {}
  });
}

function resolveControllerContext(override = {}) {
  return {
    ...asObject(autoModeRuntime.context),
    ...asObject(override)
  };
}

function stepActionText(step) {
  return asString(step?.action || step?.type || "step");
}

function stepTextFingerprint(step) {
  return [
    asString(step?.type),
    stepActionText(step),
    asString(step?.targetPage),
    asString(step?.payload?.intent),
    asString(step?.payload?.prompt)
  ].join(" ");
}

function priorityRank(priority) {
  if (priority === "critical") return 3;
  if (priority === "recommended") return 2;
  return 1;
}

function normalizePriority(value) {
  const normalized = normalizeText(value);
  if (["critical", "recommended", "optional"].includes(normalized)) return normalized;
  return "recommended";
}

function defaultPromptForStep(step) {
  return asString(step?.payload?.prompt || step?.payload?.reason || `Prepare ${asString(step?.targetPage || "next action")}`);
}

function createStep({
  type,
  targetPage,
  action,
  payload = {},
  priority = "recommended"
}) {
  return {
    id: `${type}:${targetPage}:${Math.random().toString(36).slice(2, 8)}`,
    type,
    targetPage,
    action,
    payload: asObject(payload),
    priority: normalizePriority(priority)
  };
}

export function isSafeAction(step) {
  const type = normalizeText(step?.type);
  const fingerprint = normalizeText(stepTextFingerprint(step));

  if (!AUTO_SAFE_TYPES.has(type)) return false;

  for (const rule of AUTO_BLOCK_PATTERNS) {
    if (rule.test.test(fingerprint)) return false;
  }

  return true;
}

function gateForStep(step) {
  const type = normalizeText(step?.type);
  const action = stepActionText(step);
  const fingerprint = normalizeText(stepTextFingerprint(step));

  for (const rule of AUTO_BLOCK_PATTERNS) {
    if (rule.test.test(fingerprint)) {
      return {
        required: true,
        reason: rule.reason,
        whatWillHappen: `${action} is not executed automatically. A human must approve the next move.`
      };
    }
  }

  if (type === "prepare_publishing_draft") {
    return { required: false, reason: "", whatWillHappen: "" };
  }

  if (fingerprint.includes("publishing") && /publish/.test(fingerprint)) {
    return {
      required: true,
      reason: "Publishing actions require manual approval before execution.",
      whatWillHappen: "Auto Mode will stop at this step and wait for approval."
    };
  }

  return { required: false, reason: "", whatWillHappen: "" };
}

export function buildAutomationPlan(state) {
  const intelligence = buildSystemIntelligence(state);
  const recommendations = asArray(intelligence.recommendations);

  const steps = recommendations.map((rec) => {
    const targetPage = asString(rec?.targetPage || "ai-command");
    const reason = asString(rec?.reason);
    const prompt = asString(rec?.draftPayload?.prompt || `Plan and execute: ${asString(rec?.title)}`);

    return createStep({
      type: "create_handoff",
      targetPage,
      action: `Prepare ${targetPage} step from system intelligence`,
      payload: {
        recommendationId: asString(rec?.id),
        title: asString(rec?.title),
        reason,
        prompt,
        impactChips: asArray(rec?.impactChips),
        blockerType: asString(rec?.blockerType)
      },
      priority: asString(rec?.priority)
    });
  });

  steps.sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority));
  return steps;
}

export function getAutoFixPlan(state) {
  return buildAutomationPlan(state).filter((step) => step.priority === "critical");
}

export function getAutoFlowPlan(state) {
  const intelligence = buildSystemIntelligence(state);
  const projectName = asString(intelligence.projectName || state?.context?.currentProject || "");

  return [
    createStep({
      type: "create_draft",
      targetPage: "content-studio",
      action: "Create content draft",
      payload: {
        projectName,
        prompt: "Create a conversion-ready content draft from campaign context and current blockers.",
        source: "automation-flow"
      },
      priority: "recommended"
    }),
    createStep({
      type: "create_handoff",
      targetPage: "media-studio",
      action: "Create content-to-media handoff",
      payload: {
        projectName,
        prompt: "Prepare media generation plan from content draft.",
        source_page: "content-studio"
      },
      priority: "recommended"
    }),
    createStep({
      type: "create_handoff",
      targetPage: "library",
      action: "Create media-to-library handoff",
      payload: {
        projectName,
        prompt: "Save approved media as managed library assets.",
        source_page: "media-studio"
      },
      priority: "recommended"
    }),
    createStep({
      type: "create_handoff",
      targetPage: "publishing",
      action: "Create library-to-publishing handoff",
      payload: {
        projectName,
        prompt: "Prepare publishing draft with approved content/media and schedule-safe checklist.",
        source_page: "library"
      },
      priority: "recommended"
    })
  ];
}

export async function runAutomationStep(step, context = {}) {
  const safe = isSafeAction(step);
  if (!safe) {
    return { status: "skipped", reason: "Blocked by safety rules.", step };
  }

  const state = typeof context.getState === "function" ? context.getState() : asObject(context.state);
  const projectName = asString(context.projectName || state?.context?.currentProject || step?.payload?.projectName || "__default__");
  const destination = asString(step?.targetPage || "ai-command");

  try {
    if (normalizeText(step.type) === "navigate") {
      if (typeof context.navigateTo === "function") {
        context.navigateTo(destination);
      }
      return { status: "success", reason: "Navigation completed.", step };
    }

    if (normalizeText(step.type) === "generate_prompt") {
      const prompt = defaultPromptForStep(step);
      setSharedAiDraft(projectName, {
        projectName,
        modeId: "operations",
        lastCommand: prompt,
        lastResponseTitle: asString(step?.payload?.title || "Automation suggestion"),
        routeSuggestions: [{ route: destination, label: destination }],
        updatedAt: new Date().toISOString()
      });
      return { status: "success", reason: "Prompt generated.", step };
    }

    if (normalizeText(step.type) === "save_local_draft") {
      const prompt = defaultPromptForStep(step);
      const localDraft = {
        source_page: "automation-engine",
        destination_page: destination,
        status: "available",
        payload: {
          prompt,
          intent: "save_local_draft",
          automation_step: asObject(step)
        }
      };
      setSharedHandoff(projectName, destination, localDraft);
      return { status: "success", reason: "Local draft prepared.", step };
    }

    if (normalizeText(step.type) === "create_draft") {
      const prompt = defaultPromptForStep(step);
      const draftPayload = {
        source_page: "automation-engine",
        destination_page: destination,
        status: "available",
        payload: {
          prompt,
          draft_context: {
            projectName,
            modeId: "operations",
            lastCommand: prompt,
            lastResponseTitle: asString(step?.payload?.title || "Automation draft")
          },
          automation_step: asObject(step)
        }
      };
      setSharedHandoff(projectName, destination, draftPayload);
      if (typeof context.createProjectHandoff === "function") {
        context.createProjectHandoff(projectName, draftPayload).catch(() => {});
      }
      return { status: "success", reason: "Draft created.", step };
    }

    if (normalizeText(step.type) === "prepare_workflow") {
      const prompt = defaultPromptForStep(step);
      const handoff = {
        source_page: "automation-engine",
        destination_page: "workflows",
        status: "available",
        payload: {
          prompt,
          title: asString(step?.payload?.title || "Prepared workflow draft"),
          reason: asString(step?.payload?.reason || ""),
          automation_step: asObject(step)
        }
      };
      setSharedHandoff(projectName, "workflows", handoff);
      if (typeof context.createProjectHandoff === "function") {
        context.createProjectHandoff(projectName, handoff).catch(() => {});
      }
      return { status: "success", reason: "Workflow draft prepared.", step };
    }

    if (normalizeText(step.type) === "prepare_publishing_draft") {
      const prompt = defaultPromptForStep(step);
      const handoff = {
        source_page: "automation-engine",
        destination_page: "publishing",
        status: "available",
        payload: {
          prompt,
          title: asString(step?.payload?.title || "Prepared publishing draft"),
          reason: asString(step?.payload?.reason || ""),
          intent: "prepare_publishing_draft",
          automation_step: asObject(step)
        }
      };
      setSharedHandoff(projectName, "publishing", handoff);
      if (typeof context.createProjectHandoff === "function") {
        context.createProjectHandoff(projectName, handoff).catch(() => {});
      }
      return { status: "success", reason: "Publishing draft prepared.", step };
    }

    if (normalizeText(step.type) === "create_handoff") {
      const prompt = defaultPromptForStep(step);
      const handoff = {
        source_page: asString(step?.payload?.source_page || "automation-engine"),
        destination_page: destination,
        status: "available",
        payload: {
          prompt,
          recommendation_id: asString(step?.payload?.recommendationId),
          title: asString(step?.payload?.title),
          reason: asString(step?.payload?.reason),
          impact_chips: asArray(step?.payload?.impactChips),
          blocker_type: asString(step?.payload?.blockerType),
          automation_step: asObject(step)
        }
      };

      setSharedHandoff(projectName, destination, handoff);
      if (typeof context.createProjectHandoff === "function") {
        context.createProjectHandoff(projectName, handoff).catch(() => {});
      }
      return { status: "success", reason: "Handoff created.", step };
    }

    return { status: "skipped", reason: "No runnable action for step type.", step };
  } catch (error) {
    return { status: "failed", reason: asString(error?.message || "Step failed."), step };
  }
}

export async function runAutomationPlan(plan, options = {}) {
  const steps = asArray(plan);
  const results = [];

  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    if (!isSafeAction(step)) {
      const blocked = { status: "skipped", reason: "Blocked by safety rules.", step };
      results.push(blocked);
      if (typeof options.onProgress === "function") {
        options.onProgress({ index: index + 1, total: steps.length, step, result: blocked });
      }
      continue;
    }

    const result = await runAutomationStep(step, options.context || {});
    results.push(result);

    if (typeof options.onProgress === "function") {
      options.onProgress({ index: index + 1, total: steps.length, step, result });
    }

    if (result.status === "failed") {
      return {
        status: "failed",
        steps,
        results,
        failedStep: step
      };
    }

    if (options.stopAfterStep === true) {
      return {
        status: "in_progress",
        steps,
        results,
        remaining: steps.slice(index + 1)
      };
    }
  }

  return {
    status: "success",
    steps,
    results
  };
}

async function runAutoModeLoop(options = {}) {
  const steps = asArray(autoModeState.currentPlan);
  const context = resolveControllerContext(options.context);
  const activeToken = autoModeRuntime.runToken;

  while (autoModeState.currentStepIndex < steps.length) {
    if (activeToken !== autoModeRuntime.runToken) return getAutoModeState();
    if (autoModeState.status !== "running") return getAutoModeState();

    const index = autoModeState.currentStepIndex;
    const step = steps[index];
    const gate = gateForStep(step);

    if (gate.required) {
      autoModeState.status = "waiting_approval";
      autoModeState.approvalRequiredStep = {
        index,
        step,
        reason: gate.reason,
        whatWillHappen: gate.whatWillHappen
      };
      pushAutoLog(`Approval required at step ${index + 1}: ${stepActionText(step)}`, "warning", { stepIndex: index });
      emitAutoModeState();
      return getAutoModeState();
    }

    if (!isSafeAction(step)) {
      pushAutoLog(`Skipped blocked step ${index + 1}: ${stepActionText(step)}`, "warning", { stepIndex: index });
      autoModeState.currentStepIndex = index + 1;
      emitAutoModeState();
      continue;
    }

    const result = await runAutomationStep(step, context);
    autoModeState.currentStepIndex = index + 1;
    pushAutoLog(`Step ${index + 1}/${steps.length}: ${stepActionText(step)} (${result.status})`, result.status === "failed" ? "error" : "info", { stepIndex: index });

    if (typeof options.onProgress === "function") {
      options.onProgress({ index: index + 1, total: steps.length, step, result });
    }

    if (result.status === "failed") {
      autoModeState.status = "failed";
      autoModeState.enabled = false;
      autoModeState.mode = "off";
      emitAutoModeState();
      return getAutoModeState();
    }

    if (autoModeState.mode === "guided" && autoModeState.currentStepIndex < steps.length) {
      autoModeState.status = "paused";
      pushAutoLog("Guided mode paused after one step.", "info");
      emitAutoModeState();
      return getAutoModeState();
    }

    emitAutoModeState();
  }

  autoModeState.status = "completed";
  autoModeState.enabled = false;
  autoModeState.mode = "off";
  autoModeState.approvalRequiredStep = null;
  pushAutoLog("Auto Mode completed all safe steps.", "success");
  emitAutoModeState();
  return getAutoModeState();
}

export function createAutoModeController(state, context = {}) {
  autoModeRuntime.context = {
    state,
    ...asObject(context)
  };
  emitAutoModeState();
  return {
    startAutoMode,
    pauseAutoMode,
    resumeAutoMode,
    stopAutoMode,
    approveCurrentGate,
    skipCurrentStep,
    getAutoModeState,
    subscribeAutoMode
  };
}

export async function startAutoMode(plan, options = {}) {
  const steps = asArray(plan).map((step) => ({ ...asObject(step) }));
  const mode = ["guided", "auto_until_approval"].includes(normalizeText(options.mode))
    ? normalizeText(options.mode)
    : "guided";

  autoModeRuntime.runToken += 1;
  autoModeState.enabled = true;
  autoModeState.mode = mode;
  autoModeState.currentPlan = steps;
  autoModeState.currentStepIndex = 0;
  autoModeState.status = "running";
  autoModeState.lastRunAt = nowIso();
  autoModeState.approvalRequiredStep = null;
  pushAutoLog(`Auto Mode started in ${mode} mode with ${steps.length} step(s).`, "info");
  emitAutoModeState();

  if (!steps.length) {
    autoModeState.status = "failed";
    autoModeState.enabled = false;
    autoModeState.mode = "off";
    pushAutoLog("Auto Mode failed: no plan steps provided.", "error");
    emitAutoModeState();
    return getAutoModeState();
  }

  return runAutoModeLoop(options);
}

export function pauseAutoMode() {
  if (autoModeState.status !== "running") return getAutoModeState();
  autoModeRuntime.runToken += 1;
  autoModeState.status = "paused";
  pushAutoLog("Auto Mode paused.", "info");
  emitAutoModeState();
  return getAutoModeState();
}

export async function resumeAutoMode(options = {}) {
  if (!["paused", "idle", "failed"].includes(autoModeState.status)) return getAutoModeState();
  if (!asArray(autoModeState.currentPlan).length) return getAutoModeState();
  if (autoModeState.currentStepIndex >= autoModeState.currentPlan.length) return getAutoModeState();

  autoModeRuntime.runToken += 1;
  autoModeState.enabled = true;
  if (autoModeState.mode === "off") {
    autoModeState.mode = ["guided", "auto_until_approval"].includes(normalizeText(options.mode))
      ? normalizeText(options.mode)
      : "guided";
  }
  autoModeState.status = "running";
  autoModeState.approvalRequiredStep = null;
  pushAutoLog("Auto Mode resumed.", "info");
  emitAutoModeState();
  return runAutoModeLoop(options);
}

export function stopAutoMode() {
  autoModeRuntime.runToken += 1;
  autoModeState.enabled = false;
  autoModeState.mode = "off";
  autoModeState.status = "idle";
  autoModeState.approvalRequiredStep = null;
  pushAutoLog("Auto Mode stopped.", "info");
  emitAutoModeState();
  return getAutoModeState();
}

export async function approveCurrentGate(options = {}) {
  if (autoModeState.status !== "waiting_approval" || !autoModeState.approvalRequiredStep) return getAutoModeState();

  const gate = asObject(autoModeState.approvalRequiredStep);
  const step = asObject(gate.step);
  const targetPage = asString(step.targetPage);
  const context = resolveControllerContext(options.context);

  pushAutoLog(`Approval granted for step ${Number(gate.index) + 1}: ${stepActionText(step)}`, "info", { stepIndex: Number(gate.index) });

  // Approval means proceed manually for guarded actions; never auto-publish or execute destructive actions.
  if (targetPage && typeof context.navigateTo === "function") {
    context.navigateTo(targetPage);
  }

  autoModeState.currentStepIndex = Math.max(0, Number(gate.index) + 1);
  autoModeState.approvalRequiredStep = null;

  if (autoModeState.currentStepIndex >= autoModeState.currentPlan.length) {
    autoModeState.status = "completed";
    autoModeState.enabled = false;
    autoModeState.mode = "off";
    pushAutoLog("Auto Mode completed after approval gate.", "success");
    emitAutoModeState();
    return getAutoModeState();
  }

  autoModeRuntime.runToken += 1;
  autoModeState.status = "running";
  emitAutoModeState();
  return runAutoModeLoop(options);
}

export async function skipCurrentStep(options = {}) {
  if (autoModeState.status !== "waiting_approval" || !autoModeState.approvalRequiredStep) return getAutoModeState();
  const index = Number(autoModeState.approvalRequiredStep.index) || autoModeState.currentStepIndex;
  pushAutoLog(`Skipped step ${index + 1} after approval gate.`, "warning", { stepIndex: index });
  autoModeState.currentStepIndex = Math.max(0, index + 1);
  autoModeState.approvalRequiredStep = null;

  if (autoModeState.currentStepIndex >= autoModeState.currentPlan.length) {
    autoModeState.status = "completed";
    autoModeState.enabled = false;
    autoModeState.mode = "off";
    pushAutoLog("Auto Mode completed after skipping gated step.", "success");
    emitAutoModeState();
    return getAutoModeState();
  }

  autoModeRuntime.runToken += 1;
  autoModeState.status = "running";
  emitAutoModeState();
  return runAutoModeLoop(options);
}

export function getAutoModeState() {
  return clone(autoModeState);
}

export function subscribeAutoMode(listener) {
  if (typeof listener !== "function") return () => {};
  autoModeListeners.add(listener);
  return () => {
    autoModeListeners.delete(listener);
  };
}

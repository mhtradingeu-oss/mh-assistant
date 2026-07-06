/**
 * MEDIA-STUDIO-PHASE-C3A1-SAFE-AI-INTEGRATION-ADAPTERS
 *
 * Safe AI Media integration adapter.
 * This adapter allows Control Center Integrations to save and validate
 * provider credentials for Media Studio providers without executing generation.
 *
 * Important:
 * - No external provider request is made here.
 * - No image/video/audio generation is executed here.
 * - Real generation remains owned by the Media provider layer.
 */

const AI_MEDIA_PROVIDER_LABELS = {
  openai: "OpenAI",
  higgsfield: "Higgsfield",
  kling: "Kling",
  runway: "Runway",
  luma: "Luma",
  "google-ai": "Google AI / Veo",
  bytedance: "ByteDance / Seed",
  recraft: "Recraft",
  elevenlabs: "ElevenLabs",
  minimax: "MiniMax",
  comfyui: "ComfyUI",
  coqui: "Coqui",
  bark: "Bark",
  musicgen: "MusicGen"
};

const ENDPOINT_PROVIDERS = new Set(["comfyui", "coqui", "bark", "musicgen"]);

function normalizeText(value) {
  return String(value || "").trim();
}

function getCredentialValue(ctx = {}, key) {
  const credentials = ctx.credentials && typeof ctx.credentials === "object" ? ctx.credentials : {};
  const config = ctx.config && typeof ctx.config === "object" ? ctx.config : {};
  return normalizeText(credentials[key] || config[key] || ctx.primaryValue);
}

function buildProviderLabel(integrationId) {
  return AI_MEDIA_PROVIDER_LABELS[integrationId] || integrationId || "AI Media Provider";
}

function buildSafeSummary(ctx = {}, action = "connect") {
  const integrationId = normalizeText(ctx.integrationId || ctx.integration_id || ctx.record?.integration_id).toLowerCase();
  const providerLabel = buildProviderLabel(integrationId);
  const requiresEndpoint = ENDPOINT_PROVIDERS.has(integrationId);
  const primaryField = requiresEndpoint ? "endpointUrl" : "apiKey";
  const primaryValue = getCredentialValue(ctx, primaryField);
  const hasPrimaryValue = Boolean(primaryValue);

  return {
    provider: integrationId,
    provider_label: providerLabel,
    action,
    status: hasPrimaryValue ? "connected" : "missing_required_fields",
    readiness: hasPrimaryValue ? "ready_for_safe_configuration" : "needs_configuration",
    generation_enabled: false,
    external_request_performed: false,
    primary_field: primaryField,
    has_primary_value: hasPrimaryValue,
    message: hasPrimaryValue
      ? `${providerLabel} credentials were saved for Media Studio routing. Generation is not executed by this integration adapter.`
      : `${providerLabel} requires ${primaryField} before it can be marked connected.`
  };
}

function assertHasRequiredValue(ctx = {}) {
  const summary = buildSafeSummary(ctx);
  if (!summary.has_primary_value) {
    const error = new Error(summary.message);
    error.status = "missing_required_fields";
    error.summary = summary;
    throw error;
  }
  return summary;
}

function createAiMediaProviderAdapter(options = {}) {
  async function connect(ctx = {}) {
    const summary = assertHasRequiredValue(ctx);
    return {
      ...summary,
      status: "connected",
      action: "connect",
      connected: true
    };
  }

  async function reconnect(ctx = {}) {
    const summary = assertHasRequiredValue(ctx);
    return {
      ...summary,
      status: "connected",
      action: "reconnect",
      connected: true
    };
  }

  async function testConnection(ctx = {}) {
    const summary = assertHasRequiredValue(ctx);
    return {
      ...summary,
      status: "ok",
      action: "test",
      connected: true,
      test_mode: "local_readiness_only"
    };
  }

  async function syncCurrent(ctx = {}) {
    const summary = buildSafeSummary(ctx, "sync");
    return {
      ...summary,
      status: summary.has_primary_value ? "ok" : "missing_required_fields",
      synced: false,
      sync_mode: "metadata_only"
    };
  }

  async function importHistory(ctx = {}) {
    const summary = buildSafeSummary(ctx, "import");
    return {
      ...summary,
      status: summary.has_primary_value ? "ok" : "missing_required_fields",
      imported: false,
      import_mode: "not_applicable"
    };
  }

  return {
    providerType: "ai_media",
    unsupported: false,
    generationEnabled: false,
    externalRequestsEnabled: false,
    connect,
    reconnect,
    testConnection,
    syncCurrent,
    importHistory
  };
}

const AI_MEDIA_INTEGRATION_IDS = Object.keys(AI_MEDIA_PROVIDER_LABELS);

const aiMediaProviderAdapter = {
  ...createAiMediaProviderAdapter(),
  integrationIds: AI_MEDIA_INTEGRATION_IDS
};

module.exports = {
  AI_MEDIA_PROVIDER_LABELS,
  AI_MEDIA_INTEGRATION_IDS,
  aiMediaProviderAdapter,
  createAiMediaProviderAdapter
};

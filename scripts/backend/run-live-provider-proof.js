#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const { buildMatrix } = require("./check-live-provider-readiness");
const woocommerce = require("../../runtime/orchestrator-service/lib/integrations/providers/woocommerce");
const meta = require("../../runtime/orchestrator-service/lib/integrations/providers/meta");
const tiktok = require("../../runtime/orchestrator-service/lib/integrations/providers/tiktok");
const google = require("../../runtime/orchestrator-service/lib/integrations/providers/google");
const shopify = require("../../runtime/orchestrator-service/lib/integrations/providers/shopify");
const ebay = require("../../runtime/orchestrator-service/lib/integrations/providers/ebay");
const { createExternalGpuWorkerAdapter } = require("../../runtime/orchestrator-service/lib/media/native/workers/external-gpu-worker-adapter");

function readEnv(env, keys) {
  for (const key of keys) {
    const value = String(env[key] || "").trim();
    if (value) {
      return value;
    }
  }
  return "";
}

function isSecretKey(key) {
  return /(token|secret|key|password|authorization|api[_-]?key)/i.test(String(key || ""));
}

function sanitize(value, currentKey) {
  if (value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item, currentKey));
  }

  if (typeof value === "object") {
    const out = {};
    for (const [key, inner] of Object.entries(value)) {
      if (isSecretKey(key)) {
        out[key] = "[REDACTED]";
      } else {
        out[key] = sanitize(inner, key);
      }
    }
    return out;
  }

  if (typeof value === "string" && isSecretKey(currentKey)) {
    return "[REDACTED]";
  }

  return value;
}

function buildProviderInputs(env) {
  return {
    openai: {
      apiKey: readEnv(env, ["OPENAI_API_KEY", "MH_OPENAI_API_KEY", "AI_PROVIDER_API_KEY"]),
      baseUrl: readEnv(env, ["OPENAI_BASE_URL"]) || "https://api.openai.com/v1"
    },
    woocommerce: {
      config: {
        storeUrl: readEnv(env, ["WOOCOMMERCE_STORE_URL", "WC_STORE_URL", "WC_BASE_URL"])
      },
      credentials: {
        consumerKey: readEnv(env, ["WOOCOMMERCE_CONSUMER_KEY", "WC_KEY"]),
        consumerSecret: readEnv(env, ["WOOCOMMERCE_CONSUMER_SECRET", "WC_SECRET"])
      }
    },
    meta: {
      integrationId: "facebook",
      config: {
        pageId: readEnv(env, ["META_PAGE_ID", "FACEBOOK_PAGE_ID"]),
        pageUrl: readEnv(env, ["META_PAGE_URL", "FACEBOOK_PAGE_URL"])
      },
      credentials: {
        accessToken: readEnv(env, ["META_ACCESS_TOKEN", "FACEBOOK_ACCESS_TOKEN", "INSTAGRAM_ACCESS_TOKEN"])
      }
    },
    tiktok: {
      integrationId: "tiktok",
      config: {
        accountId: readEnv(env, ["TIKTOK_ACCOUNT_ID"])
      },
      credentials: {
        accessToken: readEnv(env, ["TIKTOK_ACCESS_TOKEN"])
      }
    },
    google: {
      integrationId: "youtube",
      config: {
        channelId: readEnv(env, ["GOOGLE_YOUTUBE_CHANNEL_ID"]),
        channelUrl: readEnv(env, ["GOOGLE_YOUTUBE_CHANNEL_URL"])
      },
      credentials: {
        accessToken: readEnv(env, ["GOOGLE_ACCESS_TOKEN"])
      }
    },
    shopify: {
      config: {
        storeDomain: readEnv(env, ["SHOPIFY_STORE_DOMAIN"])
      },
      credentials: {
        adminToken: readEnv(env, ["SHOPIFY_ADMIN_TOKEN", "SHOPIFY_ACCESS_TOKEN"])
      }
    },
    ebay: {
      config: {
        sellerId: readEnv(env, ["EBAY_SELLER_ID"])
      },
      credentials: {
        accessToken: readEnv(env, ["EBAY_ACCESS_TOKEN"])
      }
    },
    native_gpu_worker: {
      endpoint: readEnv(env, ["NATIVE_MEDIA_GPU_WORKER_URL"]),
      apiKey: readEnv(env, ["NATIVE_MEDIA_GPU_WORKER_KEY"])
    }
  };
}

async function probeOpenAi(input) {
  const baseUrl = String(input.baseUrl || "https://api.openai.com/v1").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/models`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${input.apiKey}`
    }
  });

  let data = {};
  try {
    data = await response.json();
  } catch (_) {
    data = {};
  }

  return {
    http_status: response.status,
    ok: response.ok,
    model_count: Array.isArray(data.data) ? data.data.length : 0,
    status: response.ok ? "connected" : "provider_error"
  };
}

async function probeWooCommerce(input) {
  const result = await woocommerce.connect({
    integrationId: "woocommerce",
    config: input.config,
    credentials: input.credentials,
    primaryValue: input.config.storeUrl
  });

  return {
    status: result.status,
    health: result.health,
    notes: result.notes,
    account: result.account || {}
  };
}

async function probeMeta(input) {
  const result = await meta.connect({
    integrationId: input.integrationId,
    config: input.config,
    credentials: input.credentials,
    primaryValue: input.config.pageUrl
  });

  return {
    status: result.status,
    health: result.health,
    notes: result.notes,
    account: result.account || {}
  };
}

async function probeTikTok(input) {
  const result = await tiktok.connect({
    integrationId: input.integrationId,
    config: input.config,
    credentials: input.credentials,
    primaryValue: input.config.accountId
  });

  return {
    status: result.status,
    health: result.health,
    notes: result.notes,
    account: result.account || {}
  };
}

async function probeGoogle(input) {
  const result = await google.connect({
    integrationId: input.integrationId,
    config: input.config,
    credentials: input.credentials,
    primaryValue: input.config.channelUrl
  });

  return {
    status: result.status,
    health: result.health,
    notes: result.notes,
    account: result.account || {}
  };
}

async function probeShopify(input) {
  const result = await shopify.connect({
    integrationId: "shopify",
    config: input.config,
    credentials: input.credentials,
    primaryValue: input.config.storeDomain
  });

  return {
    status: result.status,
    health: result.health,
    notes: result.notes,
    account: result.account || {}
  };
}

async function probeEbay(input) {
  const result = await ebay.connect({
    integrationId: "ebay",
    config: input.config,
    credentials: input.credentials,
    primaryValue: input.config.sellerId
  });

  return {
    status: result.status,
    health: result.health,
    notes: result.notes,
    account: result.account || {}
  };
}

async function probeNativeGpuWorker(input) {
  const adapter = createExternalGpuWorkerAdapter({
    endpoint: input.endpoint,
    apiKey: input.apiKey
  });

  const response = await adapter.submitJob({
    type: "live_proof_probe",
    project: "local-truth-audit",
    prompt_hash: "p7b-live-proof"
  });

  return {
    status: response.status,
    success: Boolean(response.success),
    response_status: response.response_status,
    worker: response.worker,
    has_api_key: Boolean(input.apiKey)
  };
}

function writeEvidence(outputDir, payload) {
  fs.mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runFile = path.join(outputDir, `live-proof-${timestamp}.json`);
  const latestFile = path.join(outputDir, "latest.json");
  fs.writeFileSync(runFile, JSON.stringify(payload, null, 2));
  fs.writeFileSync(latestFile, JSON.stringify(payload, null, 2));
  return { runFile, latestFile };
}

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  const liveGateEnabled = String(process.env.MH_RUN_LIVE_PROVIDER_PROOF || "") === "1";
  const root = process.cwd();
  const outputDir = path.join(root, "audits/backend/local-truth-audit/live-provider-proof");

  const readiness = buildMatrix(process.env);
  const configuredProviders = readiness.filter((item) => item.can_run_live_probe).map((item) => item.provider);
  const inputs = buildProviderInputs(process.env);

  const summary = {
    checked_at: new Date().toISOString(),
    mode: dryRun ? "dry-run" : "live",
    live_gate_required: true,
    live_gate_env: "MH_RUN_LIVE_PROVIDER_PROOF",
    live_gate_enabled: liveGateEnabled,
    configured_providers: configuredProviders,
    skipped_providers: readiness
      .filter((item) => !item.can_run_live_probe)
      .map((item) => ({ provider: item.provider, reason: "not_configured", missing: item.missing_required_fields })),
    provider_results: []
  };

  if (!dryRun && !liveGateEnabled) {
    summary.live_proof_executed = false;
    summary.message = "live proof not run (set MH_RUN_LIVE_PROVIDER_PROOF=1 to enable live probes)";
    const files = writeEvidence(outputDir, sanitize(summary));
    summary.evidence_files = files;
    console.log(JSON.stringify(sanitize(summary), null, 2));
    return;
  }

  const probes = {
    openai: () => probeOpenAi(inputs.openai),
    woocommerce: () => probeWooCommerce(inputs.woocommerce),
    meta: () => probeMeta(inputs.meta),
    tiktok: () => probeTikTok(inputs.tiktok),
    google: () => probeGoogle(inputs.google),
    shopify: () => probeShopify(inputs.shopify),
    ebay: () => probeEbay(inputs.ebay),
    native_gpu_worker: () => probeNativeGpuWorker(inputs.native_gpu_worker)
  };

  for (const provider of configuredProviders) {
    if (dryRun) {
      summary.provider_results.push({
        provider,
        status: "planned",
        can_run_live_probe: true,
        dry_run: true,
        message: "Dry-run mode: external API call skipped."
      });
      continue;
    }

    const fn = probes[provider];
    if (!fn) {
      summary.provider_results.push({
        provider,
        status: "skipped",
        reason: "probe_not_implemented"
      });
      continue;
    }

    try {
      const probe = await fn();
      summary.provider_results.push({
        provider,
        status: "executed",
        probe
      });
    } catch (error) {
      summary.provider_results.push({
        provider,
        status: "provider_error",
        error: {
          message: String(error && error.message ? error.message : "Unknown provider error"),
          code: String(error && error.code ? error.code : "")
        }
      });
    }
  }

  summary.live_proof_executed = !dryRun;
  summary.message = dryRun
    ? "dry-run complete (no external APIs called)"
    : "live probe execution complete";

  const files = writeEvidence(outputDir, sanitize(summary));
  summary.evidence_files = files;

  console.log(JSON.stringify(sanitize(summary), null, 2));
}

run().catch((error) => {
  const safeError = {
    status: "runner_error",
    message: String(error && error.message ? error.message : "Unknown runner error")
  };
  console.log(JSON.stringify(safeError, null, 2));
  process.exitCode = 0;
});
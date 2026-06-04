#!/usr/bin/env node
"use strict";

function readEnv(env, keys) {
  for (const key of keys) {
    const value = String(env[key] || "").trim();
    if (value) {
      return { key, value };
    }
  }
  return { key: "", value: "" };
}

function buildMatrix(env) {
  const specs = [
    {
      provider: "openai",
      requirements: [
        {
          field: "api_key",
          envKeys: ["OPENAI_API_KEY", "MH_OPENAI_API_KEY", "AI_PROVIDER_API_KEY"]
        }
      ]
    },
    {
      provider: "woocommerce",
      requirements: [
        {
          field: "store_url",
          envKeys: ["WOOCOMMERCE_STORE_URL", "WC_STORE_URL", "WC_BASE_URL"]
        },
        {
          field: "consumer_key",
          envKeys: ["WOOCOMMERCE_CONSUMER_KEY", "WC_KEY"]
        },
        {
          field: "consumer_secret",
          envKeys: ["WOOCOMMERCE_CONSUMER_SECRET", "WC_SECRET"]
        }
      ]
    },
    {
      provider: "meta",
      requirements: [
        {
          field: "access_token",
          envKeys: ["META_ACCESS_TOKEN", "FACEBOOK_ACCESS_TOKEN", "INSTAGRAM_ACCESS_TOKEN"]
        }
      ]
    },
    {
      provider: "tiktok",
      requirements: [
        {
          field: "access_token",
          envKeys: ["TIKTOK_ACCESS_TOKEN"]
        }
      ]
    },
    {
      provider: "google",
      requirements: [
        {
          field: "access_token",
          envKeys: ["GOOGLE_ACCESS_TOKEN"]
        }
      ]
    },
    {
      provider: "shopify",
      requirements: [
        {
          field: "store_domain",
          envKeys: ["SHOPIFY_STORE_DOMAIN"]
        },
        {
          field: "admin_token",
          envKeys: ["SHOPIFY_ADMIN_TOKEN", "SHOPIFY_ACCESS_TOKEN"]
        }
      ]
    },
    {
      provider: "ebay",
      requirements: [
        {
          field: "access_token",
          envKeys: ["EBAY_ACCESS_TOKEN"]
        }
      ]
    },
    {
      provider: "native_gpu_worker",
      requirements: [
        {
          field: "worker_url",
          envKeys: ["NATIVE_MEDIA_GPU_WORKER_URL"]
        }
      ]
    }
  ];

  return specs.map((spec) => {
    const resolved = spec.requirements.map((requirement) => {
      const found = readEnv(env, requirement.envKeys);
      return {
        field: requirement.field,
        configured: Boolean(found.value),
        detected_env_key: found.key,
        accepted_env_keys: requirement.envKeys
      };
    });

    const missing = resolved.filter((item) => !item.configured).map((item) => item.field);
    const configured = missing.length === 0;

    return {
      provider: spec.provider,
      configured,
      status: configured ? "configured" : "not_configured",
      missing_required_fields: missing,
      can_run_live_probe: configured,
      required_fields: resolved.map((item) => ({
        field: item.field,
        configured: item.configured,
        detected_env_key: item.detected_env_key,
        accepted_env_keys: item.accepted_env_keys
      }))
    };
  });
}

function run() {
  const providers = buildMatrix(process.env);
  const summary = {
    checked_at: new Date().toISOString(),
    mode: "env_presence_audit_only",
    total_providers: providers.length,
    configured_providers: providers.filter((item) => item.configured).length,
    providers
  };

  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) {
  run();
}

module.exports = {
  buildMatrix
};
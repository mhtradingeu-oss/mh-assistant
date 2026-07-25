"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { normalizeProjectSlug } = require("../security/project-isolation");

const UNIVERSAL_PROJECT_CONTRACT_SCHEMA_VERSION = 1;
const READINESS_STATES = Object.freeze(["READY", "PARTIAL", "MISSING"]);
const DEFAULT_PROJECTS_ROOT = path.resolve(__dirname, "../../../../data/projects");
const DEFAULT_RUNTIME_ROOT = path.resolve(__dirname, "..");
const DOMAIN_LABELS = Object.freeze({
  identity_scope: "Identity & Scope",
  offerings: "Offerings",
  assets: "Assets",
  knowledge_memory: "Knowledge & Memory",
  ai_team: "AI Team",
  relationships: "Relationships",
  operations: "Operations",
  growth: "Growth",
  commerce: "Commerce",
  integrations: "Integrations",
  intelligence: "Intelligence",
  governance: "Governance",
  runtime: "Runtime",
  readiness: "Readiness",
  learning: "Learning"
});

const OWNER_MAP = deepFreeze({
  identity_scope: {
    authority: "Project Identity and Workspace runtime",
    mutation_owner: "project-identity.js and workspace lifecycle/relationship runtime",
    source_files: ["projects/project-identity.js", "workspace/workspace-runtime.js", "workspace/workspace-relationship-runtime.js"]
  },
  offerings: {
    authority: "Project profile and existing product/offer domain writers",
    mutation_owner: "explicit Project setup, product, and offer mutation paths",
    source_files: ["projects/project-identity.js", "ops/backbone.js"]
  },
  assets: {
    authority: "Project asset registry and Media runtime",
    mutation_owner: "existing asset and native Media writers",
    source_files: ["media/library-engine.js", "media/native/execution/native-runtime-controller.js"]
  },
  knowledge_memory: {
    authority: "Operations Backbone AI memory and source-specific Media knowledge",
    mutation_owner: "Backbone memory upserts and existing domain knowledge writers",
    source_files: ["ops/backbone.js", "media/native/intelligence/media-knowledge-loader.js"]
  },
  ai_team: {
    authority: "Operations Backbone team model",
    mutation_owner: "Operations Backbone team-model mutation path",
    source_files: ["ops/backbone.js", "ops/ai-orchestrator.js"]
  },
  relationships: {
    authority: "Workspace relationship runtime and bounded Customer Operations stores",
    mutation_owner: "Workspace attach/detach/archive functions and concrete customer-domain stores",
    source_files: ["workspace/workspace-relationship-runtime.js", "customer-operations/customer-operations-runtime.js"]
  },
  operations: {
    authority: "Operations Backbone",
    mutation_owner: "Operations Backbone task/workflow/handoff/event functions",
    source_files: ["ops/backbone.js"]
  },
  growth: {
    authority: "Growth domain handlers and Audience OS",
    mutation_owner: "existing campaign, publishing, ads, and audience domain handlers",
    source_files: ["growth/audience-os/audience-template-registry.js", "ops/backbone.js"]
  },
  commerce: {
    authority: "Commerce integration providers and Project product data",
    mutation_owner: "concrete commerce provider handlers and product-domain writers",
    source_files: ["integrations/providers/woocommerce.js", "integrations/providers/shopify.js"]
  },
  integrations: {
    authority: "Integration registry, storage, and concrete provider adapters",
    mutation_owner: "integration adapter manager and provider-specific handlers",
    source_files: ["integrations/provider-registry.js", "integrations/storage.js", "integrations/adapter-manager.js"]
  },
  intelligence: {
    authority: "Execution intelligence and domain insight producers",
    mutation_owner: "intelligence-loop and concrete recommendation/performance writers",
    source_files: ["execution/intelligence-loop.js", "execution/performance-storage.js", "insights/learning-engine.js"]
  },
  governance: {
    authority: "Operations Backbone governance records and installed backend gates",
    mutation_owner: "approval decision functions and protected domain handlers",
    source_files: ["ops/backbone.js", "security/governance-mutation-gate.js"]
  },
  runtime: {
    authority: "Existing Workspace, Project, execution, and domain runtimes",
    mutation_owner: "the installed runtime owner for each exact lifecycle or execution",
    source_files: ["workspace/workspace-runtime.js", "projects/project-identity.js", "execution/execution-job-bridge.js"]
  },
  readiness: {
    authority: "Source-specific backend readiness producers",
    mutation_owner: "underlying domain owners only; readiness is read-only",
    source_files: ["workspace/workspace-projection-drift-inspector.js", "customer-operations/readiness/customer-operations-readiness-snapshot.js", "media/native/providers/provider-readiness.js"]
  },
  learning: {
    authority: "Source-specific learning and recommendation stores",
    mutation_owner: "feedback, intelligence-loop, and domain learning upsert functions",
    source_files: ["execution/learning-patterns.js", "execution/performance-storage.js", "insights/learning-engine.js"]
  }
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (!isObject(value)) return false;
  if (isObject(value.records)) return Object.keys(value.records).length > 0;
  if (isObject(value.sources)) return Object.keys(value.sources).length > 0;
  return Object.keys(value).length > 0;
}

function readJson(projectRoot, relativePath) {
  const filePath = path.join(projectRoot, relativePath);
  try {
    const stat = fs.lstatSync(filePath);
    if (!stat.isFile() || stat.isSymbolicLink()) return { state: "invalid", value: undefined };
    return { state: "present", value: JSON.parse(fs.readFileSync(filePath, "utf8")) };
  } catch (error) {
    return { state: error && error.code === "ENOENT" ? "missing" : "invalid", value: undefined };
  }
}

function jsonEvidence(id, relativePath, predicate, missing) {
  return { id, relativePath, predicate, missing };
}

const DOMAIN_EVIDENCE = deepFreeze({
  identity_scope: [
    jsonEvidence("project_profile", "project.json", hasContent, "Project profile is missing or empty."),
    jsonEvidence("business_scope", "project.json", (value) => isObject(value) && ["project_name", "project_type", "market", "language"].every((key) => typeof value[key] === "string" && value[key].trim()), "Project business scope is incomplete."),
    jsonEvidence("authoritative_identity", "project.json", (value) => isObject(value) && /^prj_[0-9a-f]{32}$/.test(value.project_id || ""), "Authoritative Project ID is missing.")
  ],
  offerings: [
    jsonEvidence("offer_catalog", "brand-assets/content/offers.json", hasContent, "Offer catalog is missing or empty."),
    jsonEvidence("product_catalog", "brand-assets/product-intelligence/products.json", hasContent, "Product catalog is missing or empty.")
  ],
  assets: [
    jsonEvidence("asset_registry", "assets-registry.json", hasContent, "Canonical asset registry has no records."),
    jsonEvidence("media_input_registry", "brand-assets/media-input-registry.json", hasContent, "Media input registry has no records.")
  ],
  knowledge_memory: [
    jsonEvidence("project_ai_memory", "ops/ai-memory.json", hasContent, "Project AI memory has no records."),
    jsonEvidence("media_prompt_context", "brand-assets/prompt-engine-context.json", hasContent, "Media prompt context is missing or empty.")
  ],
  ai_team: [
    jsonEvidence("operations_team", "ops/team.json", (value) => isObject(value) && Array.isArray(value.members) && value.members.length > 0, "Operations team has no members."),
    jsonEvidence("project_team_defaults", "project.json", (value) => isObject(value) && Array.isArray(value.ai_team_defaults) && value.ai_team_defaults.length > 0, "Project AI-team defaults are missing.")
  ],
  relationships: [
    jsonEvidence("workspace_projection", "project.json", (value) => isObject(value) && isObject(value.workspace_projection), "Workspace relationship projection is missing."),
    jsonEvidence("customer_relationship_state", "customer-operations/customers.json", hasContent, "Durable Project customer relationship state is missing.")
  ],
  operations: [
    jsonEvidence("operations_runtime", "ops/system.json", (value) => isObject(value) && value.status === "operational", "Operations runtime is not recorded as operational."),
    jsonEvidence("workflow_runtime", "ops/workflow-runs.json", hasContent, "No durable workflow runs are recorded.")
  ],
  growth: [
    jsonEvidence("campaign_state", "ops/campaigns.json", hasContent, "No campaign state is recorded."),
    jsonEvidence("audience_scope", "project.json", (value) => isObject(value) && typeof value.audience_primary === "string" && value.audience_primary.trim(), "Primary audience scope is missing.")
  ],
  commerce: [
    jsonEvidence("commerce_catalog", "brand-assets/product-intelligence/products.json", hasContent, "Commerce product catalog is missing."),
    jsonEvidence("commerce_connection", "source-of-truth-registry.json", (value) => isObject(value) && isObject(value.sources) && ["woocommerce", "shopify", "ebay"].some((provider) => value.sources[provider] && ["connected", "verified"].includes(value.sources[provider].status)), "No supported commerce provider is connected.")
  ],
  integrations: [
    jsonEvidence("integration_records", "integrations-registry.json", hasContent, "Integration registry has no records."),
    jsonEvidence("source_records", "source-of-truth-registry.json", (value) => isObject(value) && isObject(value.sources) && Object.keys(value.sources).length > 0, "Source-of-truth registry has no sources.")
  ],
  intelligence: [
    jsonEvidence("recommendation_evidence", "ops/ai-recommendations.json", hasContent, "No AI recommendation evidence is recorded."),
    jsonEvidence("performance_evidence", "analytics/performance.json", (value) => isObject(value) && Array.isArray(value.records) && value.records.length > 0, "No performance evidence is recorded.")
  ],
  governance: [
    jsonEvidence("governance_policy", "ops/governance.json", hasContent, "Governance policy is missing or empty."),
    jsonEvidence("approval_evidence", "ops/approvals.json", hasContent, "No durable approval evidence is recorded.")
  ],
  runtime: [
    jsonEvidence("operations_runtime", "ops/system.json", (value) => isObject(value) && value.status === "operational", "Operations runtime is not operational."),
    jsonEvidence("project_identity_runtime", "project.json", (value) => isObject(value) && /^prj_[0-9a-f]{32}$/.test(value.project_id || ""), "Project identity runtime has not assigned an authoritative ID."),
    jsonEvidence("workspace_attachment", "project.json", (value) => isObject(value) && isObject(value.workspace_projection), "Project is not attached to a Workspace projection.")
  ],
  readiness: [
    jsonEvidence("readiness_sources", "source-of-truth-registry.json", hasContent, "Project readiness sources are missing."),
    jsonEvidence("required_sources_complete", "source-of-truth-registry.json", (value) => isObject(value) && isObject(value.required_sources) && Object.keys(value.required_sources).length > 0 && Object.values(value.required_sources).every((source) => source && ["connected", "verified"].includes(source.status)), "One or more required sources are missing or unverified.")
  ],
  learning: [
    jsonEvidence("learning_patterns", "ai/learning.json", (value) => isObject(value) && Array.isArray(value.patterns) && value.patterns.length > 0, "No learned patterns are recorded."),
    jsonEvidence("learning_history", "ai/learning.json", (value) => isObject(value) && Array.isArray(value.history) && value.history.length > 0, "No learning history is recorded.")
  ]
});

function resolveRoot(configuredRoot, fallback, label) {
  const root = configuredRoot === undefined ? fallback : configuredRoot;
  if (typeof root !== "string" || root.trim() === "") throw new TypeError(`${label} must be a non-empty path string`);
  return path.resolve(root);
}

function inspectOwner(owner, runtimeRoot) {
  const sources = owner.source_files.map((relativePath) => ({
    path: relativePath,
    available: isRegularFile(path.join(runtimeRoot, relativePath))
  }));
  return {
    authority: owner.authority,
    mutation_owner: owner.mutation_owner,
    source_files: sources,
    available: sources.every((source) => source.available),
    preserved: true
  };
}

function isRegularFile(filePath) {
  try {
    const stat = fs.lstatSync(filePath);
    return stat.isFile() && !stat.isSymbolicLink();
  } catch {
    return false;
  }
}

function inspectEvidence(projectRoot, descriptor) {
  const loaded = readJson(projectRoot, descriptor.relativePath);
  let detected = false;
  if (loaded.state === "present") {
    try { detected = Boolean(descriptor.predicate(loaded.value)); } catch { detected = false; }
  }
  return {
    id: descriptor.id,
    source: descriptor.relativePath,
    detected,
    state: loaded.state,
    gap: detected ? null : descriptor.missing
  };
}

function readinessFor(owner, evidence) {
  const detected = evidence.filter((item) => item.detected).length;
  if (detected === 0) return "MISSING";
  if (owner.available && detected === evidence.length) return "READY";
  return "PARTIAL";
}

function inspectUniversalProjectContract(projectSlug, options = {}) {
  const project = normalizeProjectSlug(projectSlug);
  const projectsRoot = resolveRoot(options.projectsRoot, DEFAULT_PROJECTS_ROOT, "projectsRoot");
  const runtimeRoot = resolveRoot(options.runtimeRoot, DEFAULT_RUNTIME_ROOT, "runtimeRoot");
  const projectRoot = path.join(projectsRoot, project);
  const domains = Object.keys(OWNER_MAP).map((id) => {
    const owner = inspectOwner(OWNER_MAP[id], runtimeRoot);
    const evidence = DOMAIN_EVIDENCE[id].map((descriptor) => inspectEvidence(projectRoot, descriptor));
    const ownerGaps = owner.source_files
      .filter((source) => !source.available)
      .map((source) => `Runtime owner source is unavailable: ${source.path}`);
    return {
      id,
      name: DOMAIN_LABELS[id],
      status: readinessFor(owner, evidence),
      owner,
      evidence,
      gaps: [...ownerGaps, ...evidence.filter((item) => !item.detected).map((item) => item.gap)]
    };
  });
  const counts = Object.fromEntries(READINESS_STATES.map((state) => [state, domains.filter((domain) => domain.status === state).length]));
  return deepFreeze({
    schema_version: UNIVERSAL_PROJECT_CONTRACT_SCHEMA_VERSION,
    kind: "universal_project_readiness_projection",
    project,
    authoritative: false,
    mutation_authority: "federated_existing_domain_owners",
    creates_runtime: false,
    statuses: READINESS_STATES,
    summary: { total: domains.length, counts },
    domains
  });
}

module.exports = {
  UNIVERSAL_PROJECT_CONTRACT_SCHEMA_VERSION,
  READINESS_STATES,
  OWNER_MAP,
  inspectUniversalProjectContract
};

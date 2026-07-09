import fs from "fs";
import path from "path";
import {
  AI_TEAM_CANONICAL_ROLES,
  AI_TEAM_ROLE_ALIASES,
  AI_TEAM_PAGE_OWNER_MATRIX,
  AI_TEAM_HANDOFF_RULES,
  AI_TEAM_REQUEST_TYPES,
  AI_TEAM_OUTPUT_TYPES,
  AI_TEAM_AUTHORITY_LEVELS
} from "../../public/control-center/runtime/ai-team/ai-team-operating-contract.js";

const failures = [];
const warnings = [];
const notes = [];

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function listJsFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;

  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);

    if (st.isDirectory()) {
      out.push(...listJsFiles(p));
    } else if (p.endsWith(".js")) {
      out.push(p);
    }
  }

  return out;
}

function pass(label) {
  console.log(`PASS - ${label}`);
}

function warn(label, detail = "") {
  warnings.push(`${label}${detail ? `: ${detail}` : ""}`);
  console.log(`WARN - ${label}${detail ? `: ${detail}` : ""}`);
}

function fail(label, detail = "") {
  failures.push(`${label}${detail ? `: ${detail}` : ""}`);
  console.log(`FAIL - ${label}${detail ? `: ${detail}` : ""}`);
}

function note(label, detail = "") {
  notes.push(`${label}${detail ? `: ${detail}` : ""}`);
  console.log(`INFO - ${label}${detail ? `: ${detail}` : ""}`);
}

function assert(label, condition, detail = "") {
  if (condition) pass(label);
  else fail(label, detail);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function safeRegexEscape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasToken(source, token) {
  return new RegExp(`\\b${safeRegexEscape(token)}\\b`).test(source);
}

function extractObjectKeysNear(source, objectName) {
  const index = source.indexOf(objectName);
  if (index < 0) return [];

  const start = source.indexOf("{", index);
  if (start < 0) return [];

  let depth = 0;
  let end = -1;
  let inString = null;
  let escaped = false;

  for (let i = start; i < source.length; i++) {
    const ch = source[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === inString) inString = null;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      inString = ch;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end < 0) return [];

  const body = source.slice(start + 1, end);
  const keys = [];

  for (const match of body.matchAll(/^\s*["']?([a-zA-Z0-9_-]+)["']?\s*:/gm)) {
    keys.push(match[1]);
  }

  return unique(keys);
}

function extractRouterRoutes(routerSource) {
  const routes = [];

  for (const match of routerSource.matchAll(/["']([a-z0-9_-]+)["']\s*:\s*\{/gi)) {
    routes.push(match[1]);
  }

  for (const match of routerSource.matchAll(/case\s+["']([a-z0-9_-]+)["']/gi)) {
    routes.push(match[1]);
  }

  for (const match of routerSource.matchAll(/navigateTo\(\s*["']([a-z0-9_-]+)["']/gi)) {
    routes.push(match[1]);
  }

  return unique(routes);
}

function extractExplicitRouteStrings(source) {
  const routes = [];

  const patterns = [
    /targetPage:\s*["']([a-z0-9_-]+)["']/gi,
    /destination_page:\s*["']([a-z0-9_-]+)["']/gi,
    /destinationPage:\s*["']([a-z0-9_-]+)["']/gi,
    /route:\s*["']([a-z0-9_-]+)["']/gi,
    /page:\s*["']([a-z0-9_-]+)["']/gi,
    /navigateTo\(\s*["']([a-z0-9_-]+)["']/gi
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      routes.push(match[1]);
    }
  }

  return unique(routes);
}

const contractRoleIds = AI_TEAM_CANONICAL_ROLES.map((role) => role.id);
const contractRoleSet = new Set(contractRoleIds);
const contractAliases = Object.keys(AI_TEAM_ROLE_ALIASES);
const contractPageIds = Object.keys(AI_TEAM_PAGE_OWNER_MATRIX);

const files = {
  contract: "public/control-center/runtime/ai-team/ai-team-operating-contract.js",
  aiCommand: "public/control-center/pages/ai-command.js",
  home: "public/control-center/pages/home.js",
  routeRoleFallback: "public/control-center/runtime/authority/route-role-fallback.js",
  authorityProjection: "public/control-center/runtime/authority/authority-projection.js",
  router: "public/control-center/router.js",
  sharedContext: "public/control-center/shared-context.js",
  app: "public/control-center/app.js",
  automationEngine: "public/control-center/automation-engine.js"
};

const src = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const pageFiles = listJsFiles("public/control-center/pages");
const pageSource = pageFiles.map((file) => `\n===== ${file} =====\n${read(file)}`).join("\n");
const runtimeSource = Object.values(src).join("\n") + "\n" + pageSource;

const knownNonPagePrefixes = [
  "open-",
  "draft-",
  "build-",
  "prepare-",
  "map-",
  "write-",
  "check-",
  "create-",
  "generate-",
  "fix-",
  "review-",
  "summarize-",
  "route-",
  "lead-",
  "follow-",
  "sales-",
  "scene-",
  "setup",
  "media",
  "campaign_",
  "openai_",
  "higgsfield_",
  "comfyui_",
  "wan_",
  "hunyuan_",
  "seed_",
  "nano_",
  "google-",
  "meta-",
  "tiktok-"
];

const knownNonPageExact = new Set([
  "performance",
  "content-gap",
  "claims-check",
  "safe-rewrite",
  "evidence",
  "gdpr",
  "approval-notes",
  "task-plan",
  "workflow",
  "handoff",
  "timeline",
  "checklist",
  "reply-draft",
  "ticket",
  "sla",
  "summary",
  "sales-pitch",
  "follow-up",
  "objections",
  "lead-brief",
  "ask",
  "draft",
  "review",
  "route",
  "execute",
  "monitor",
  "task",
  "export",
  "strategy",
  "content",
  "campaign",
  "integration",
  "asset",
  "report",
  "automation",
  "current-project",
  "selected-context",
  "product",
  "team",
  "chat",
  "preview",
  "tools",
  "context",
  "history",
  "lead",
  "publish",
  "output",
  "flow",
  "facebook",
  "instagram",
  "youtube",
  "website",
  "paid",
  "social",
  "linkedin",
  "analytics",
  "ga4",
  "gtm",
  "smtp",
  "mailer",
  "mailchimp",
  "crm",
  "ops",
  "slack",
  "telegram",
  "notion",
  "webhook",
  "openai",
  "kling",
  "runway",
  "luma",
  "recraft",
  "elevenlabs",
  "minimax",
  "comfyui",
  "coqui",
  "bark",
  "musicgen",
  "default",
  "business-basics",
  "brand-identity",
  "market-language",
  "goals",
  "competitors",
  "channels",
  "executive",
  "project",
  "operating",
  "ai",
  "approval",
  "presets",
  "sync",
  "alerts",
  "safety"
]);

function classifyRouteLikeId(id) {
  if (!id) return "empty";
  if (AI_TEAM_PAGE_OWNER_MATRIX[id]) return "contract_page";
  if (contractRoleSet.has(id)) return "role_id";
  if (AI_TEAM_ROLE_ALIASES[id]) return "role_alias";
  if (knownNonPageExact.has(id)) return "known_non_page";

  if (knownNonPagePrefixes.some((prefix) => id.startsWith(prefix))) return "known_non_page";
  if (/Input$/.test(id)) return "input_id";
  if (/Status$/.test(id)) return "status_id";
  if (/^[a-z]+[A-Z]/.test(id)) return "camel_case_id";
  if (/_(image|video|audio|tts|speech|route|open|cloud|local|hybrid|flux|sdxl)$/.test(id)) return "provider_or_mode_id";
  if (/(pixel|ads|drive|console|commerce|channels|tools)$/.test(id)) return "integration_or_channel_id";

  return "unknown_candidate";
}

function printBucket(title, bucket) {
  console.log(title);
  const entries = Object.entries(bucket).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [key, values] of entries) {
    console.log(`- ${key}: ${values.length}${values.length ? ` | ${values.slice(0, 40).join(", ")}` : ""}`);
  }
}

console.log("============================================================");
console.log("AI TEAM CONTRACT CONFORMANCE CHECK — REFINED CLASSIFIER");
console.log("============================================================");
console.log("");

console.log("1) CONTRACT BASELINE");
assert("contract file exists", Boolean(src.contract.trim()));
assert("contract role count is 12", contractRoleIds.length === 12, String(contractRoleIds.length));
assert("contract page owner count >= 20", contractPageIds.length >= 20, String(contractPageIds.length));
assert("contract aliases >= 40", contractAliases.length >= 40, String(contractAliases.length));
assert("contract request types >= 14", AI_TEAM_REQUEST_TYPES.length >= 14, String(AI_TEAM_REQUEST_TYPES.length));
assert("contract output types >= 8", AI_TEAM_OUTPUT_TYPES.length >= 8, String(AI_TEAM_OUTPUT_TYPES.length));
assert("contract authority levels >= 8", AI_TEAM_AUTHORITY_LEVELS.length >= 8, String(AI_TEAM_AUTHORITY_LEVELS.length));
console.log("");

console.log("2) AI COMMAND CONFORMANCE");
assert("AI Command exists", Boolean(src.aiCommand.trim()));
assert("AI Command detector count is 1", (src.aiCommand.match(/function\s+detectSpecialistFromBridgePrompt\s*\(/g) || []).length === 1);
assert("AI Command has local MODE_ID_ALIASES", /MODE_ID_ALIASES/.test(src.aiCommand));
assert("AI Command has local SPECIALIST_DEFS", /SPECIALIST_DEFS/.test(src.aiCommand));

const aiCommandCoveredRoles = contractRoleIds.filter((roleId) => hasToken(src.aiCommand, roleId) || contractAliases.some((alias) => AI_TEAM_ROLE_ALIASES[alias] === roleId && hasToken(src.aiCommand, alias)));
const missingAiCommandRoles = contractRoleIds.filter((roleId) => !aiCommandCoveredRoles.includes(roleId));

note("AI Command covered canonical roles", aiCommandCoveredRoles.join(", "));
if (missingAiCommandRoles.length) warn("AI Command missing role coverage", missingAiCommandRoles.join(", "));
else pass("AI Command covers all canonical roles or aliases");

const aiCommandAliasDrift = contractAliases.filter((alias) => hasToken(src.aiCommand, alias));
note("AI Command alias drift signals", aiCommandAliasDrift.join(", "));

if (aiCommandAliasDrift.includes("admin")) warn("AI Command admin alias still present", "expected until alias normalization integration");
if (aiCommandAliasDrift.includes("media")) warn("AI Command media alias still present", "expected until alias normalization integration");
if (aiCommandAliasDrift.includes("ads")) warn("AI Command ads alias still present", "expected until alias normalization integration");

console.log("");

console.log("3) HOME CONFORMANCE");
assert("Home exists", Boolean(src.home.trim()));
assert("Home has recommended specialist logic", /recommendedSpecialist|pickRecommendedSpecialist/.test(src.home));
assert("Home has data-role-id bridge", /data-role-id/.test(src.home));
assert("Home routes to AI Command", /ai-command/.test(src.home));

const homeCoveredRoles = contractRoleIds.filter((roleId) => hasToken(src.home, roleId) || contractAliases.some((alias) => AI_TEAM_ROLE_ALIASES[alias] === roleId && hasToken(src.home, alias)));
note("Home covered canonical roles", homeCoveredRoles.join(", "));

console.log("");

console.log("4) AUTHORITY ROUTE FALLBACK CONFORMANCE");
assert("route-role-fallback exists", Boolean(src.routeRoleFallback.trim()));
assert("authority-projection exists", Boolean(src.authorityProjection.trim()));

const fallbackCoveredRoles = contractRoleIds.filter((roleId) => hasToken(src.routeRoleFallback, roleId) || contractAliases.some((alias) => AI_TEAM_ROLE_ALIASES[alias] === roleId && hasToken(src.routeRoleFallback, alias)));
note("route-role-fallback covered roles", fallbackCoveredRoles.join(", "));

const fallbackAliases = contractAliases.filter((alias) => hasToken(src.routeRoleFallback, alias));

// M4-2-R2: src.routeRoleFallback is classifier source, not a dedicated runtime file.
// Alias-like tokens such as publishing, insights, research, and governance can be
// valid contract page IDs or domain vocabulary. Warn only on aliases that cannot
// resolve to a canonical role and are not known contract pages.
const fallbackUnresolvedAliases = fallbackAliases.filter((alias) => {
  const canonicalRole = AI_TEAM_ROLE_ALIASES[alias];
  const isKnownRoleAlias = Boolean(canonicalRole && contractRoleIds.includes(canonicalRole));
  const isKnownContractPage = Boolean(AI_TEAM_PAGE_OWNER_MATRIX[alias]);
  return !isKnownRoleAlias && !isKnownContractPage;
});

if (fallbackUnresolvedAliases.length) {
  warn("route-role-fallback uses unresolved aliases", fallbackUnresolvedAliases.join(", "));
} else if (fallbackAliases.length) {
  note("route-role-fallback alias-like values resolved by contract", fallbackAliases.join(", "));
} else {
  pass("route-role-fallback has no role alias drift");
}

console.log("");

console.log("5) REAL ROUTE / ID CLASSIFICATION");

const routerRoutes = extractRouterRoutes(src.router);
const explicitRouteStrings = extractExplicitRouteStrings(runtimeSource);
const routeRoleKeys = extractObjectKeysNear(src.routeRoleFallback, "ROUTE");
const pageOwnerKeys = contractPageIds;

const allRouteLikeIds = unique([
  ...routerRoutes,
  ...explicitRouteStrings,
  ...routeRoleKeys
]);

const buckets = {
  contract_page: [],
  role_id: [],
  role_alias: [],
  known_non_page: [],
  input_id: [],
  status_id: [],
  camel_case_id: [],
  provider_or_mode_id: [],
  integration_or_channel_id: [],
  unknown_candidate: []
};

for (const id of allRouteLikeIds) {
  const bucket = classifyRouteLikeId(id);
  if (!buckets[bucket]) buckets[bucket] = [];
  buckets[bucket].push(id);
}

for (const key of Object.keys(buckets)) {
  buckets[key] = unique(buckets[key]).sort();
}

printBucket("Route-like ID buckets", buckets);

for (const pageId of pageOwnerKeys) {
  const present = hasToken(runtimeSource, pageId);
  if (present) pass(`contract page ${pageId} appears in runtime`);
  else warn(`contract page ${pageId} not found in runtime`, "may be future page or sub-view");
}

for (const id of buckets.unknown_candidate) {
  warn("unknown route candidate missing owner", id);
}

console.log("");

console.log("6) HANDOFF CONFORMANCE");

assert("shared-context exists", Boolean(src.sharedContext.trim()));
assert("shared-context has setSharedHandoff", /setSharedHandoff/.test(src.sharedContext));
assert("shared-context has getSharedHandoff", /getSharedHandoff/.test(src.sharedContext));

const handoffPairs = [];
for (const match of runtimeSource.matchAll(/source_page:\s*["']([a-z0-9_-]+)["'][\s\S]{0,260}?destination_page:\s*["']([a-z0-9_-]+)["']/g)) {
  handoffPairs.push([match[1], match[2]]);
}

const uniqueHandoffPairs = unique(handoffPairs.map(([source, destination]) => `${source}->${destination}`)).sort();
note("explicit handoff pairs", uniqueHandoffPairs.join(", "));

const handoffDrift = [];
for (const pair of uniqueHandoffPairs) {
  const [source, destination] = pair.split("->");
  const allowed = Array.isArray(AI_TEAM_HANDOFF_RULES[source]) && AI_TEAM_HANDOFF_RULES[source].includes(destination);
  if (allowed) pass(`handoff ${source} -> ${destination} conforms`);
  else {
    handoffDrift.push(pair);
    warn(`handoff ${source} -> ${destination} not in contract rules`, "review before enforcing handoffs");
  }
}

console.log("");

console.log("7) REQUEST / OUTPUT VOCABULARY");
const outputRuntimeCoverage = AI_TEAM_OUTPUT_TYPES.filter((type) => hasToken(runtimeSource, type));
const outputMissingRuntime = AI_TEAM_OUTPUT_TYPES.filter((type) => !outputRuntimeCoverage.includes(type));

note("runtime output vocabulary coverage", outputRuntimeCoverage.join(", "));
if (outputMissingRuntime.length) warn("output vocabulary not yet in runtime", outputMissingRuntime.join(", "));
else pass("runtime covers all output vocabulary");

const requestRuntimeCoverage = AI_TEAM_REQUEST_TYPES.filter((type) => hasToken(runtimeSource, type));
const requestMissingRuntime = AI_TEAM_REQUEST_TYPES.filter((type) => !requestRuntimeCoverage.includes(type));

note("runtime request vocabulary coverage", requestRuntimeCoverage.join(", "));
if (requestMissingRuntime.length) warn("request vocabulary not yet in runtime", "expected until intake router integration");
else pass("runtime covers all request vocabulary");

console.log("");

console.log("8) REFINED INTEGRATION READINESS DECISION");

const unknownCandidates = buckets.unknown_candidate.length;
const aliasDriftCount = aiCommandAliasDrift.length + fallbackAliases.length;
const handoffDriftCount = handoffDrift.length;
const hardFailureCount = failures.length;

console.log("METRICS");
console.log(`Failures: ${hardFailureCount}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Unknown route candidates: ${unknownCandidates}`);
console.log(`Alias drift signals: ${aliasDriftCount}`);
console.log(`Handoff drift pairs: ${handoffDriftCount}`);
console.log(`Contract pages: ${contractPageIds.length}`);
console.log(`Contract page hits: ${buckets.contract_page.length}`);
console.log(`Ignored known non-pages: ${buckets.known_non_page.length}`);
console.log(`Ignored providers/modes: ${buckets.provider_or_mode_id.length}`);
console.log(`Ignored integration/channel ids: ${buckets.integration_or_channel_id.length}`);
console.log(`Ignored input/status/camel ids: ${buckets.input_id.length + buckets.status_id.length + buckets.camel_case_id.length}`);

console.log("");

if (hardFailureCount > 0) {
  console.log("VERDICT: FAIL — FIX HARD CONFORMANCE FAILURES FIRST");
  process.exit(1);
}

if (unknownCandidates > 20) {
  console.log("VERDICT: HOLD — ROUTE CLASSIFIER STILL TOO NOISY");
  process.exit(0);
}

if (handoffDriftCount > 0) {
  console.log("VERDICT: HOLD — REVIEW SMALL HANDOFF DRIFT BEFORE ENFORCEMENT");
  process.exit(0);
}

console.log("VERDICT: READY FOR NARROW AI COMMAND ALIAS INTEGRATION CANDIDATE");

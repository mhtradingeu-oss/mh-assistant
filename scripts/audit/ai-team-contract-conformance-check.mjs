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

function sourceLineNumber(source, index) {
  return source.slice(0, Math.max(0, index)).split("\n").length;
}

function sourceContext(source, index, length = 0, radius = 220) {
  const start = Math.max(0, index - radius);
  const end = Math.min(source.length, index + length + radius);
  return source.slice(start, end).replace(/\s+/g, " ").trim();
}

function makeRouteLikeEntry({
  id,
  sourceFile,
  sourceField,
  syntaxContext,
  extractor,
  line,
  routeBearing = false
}) {
  return {
    id: String(id || "").trim(),
    sourceFile: String(sourceFile || ""),
    sourceField: String(sourceField || ""),
    syntaxContext: String(syntaxContext || ""),
    extractor: String(extractor || ""),
    line: Number(line || 0),
    routeBearing: routeBearing === true
  };
}

function uniqueRouteLikeEntries(entries) {
  const seen = new Set();

  return entries.filter((entry) => {
    if (!entry?.id) return false;

    const key = [
      entry.id,
      entry.sourceFile,
      entry.sourceField,
      entry.extractor,
      entry.line
    ].join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractObjectKeyEntries(source, objectName, sourceFile) {
  const declarationPattern = new RegExp(
    `\\b(?:const|let|var)\\s+${safeRegexEscape(objectName)}\\s*=\\s*\\{`
  );

  const declaration = declarationPattern.exec(source);
  if (!declaration) return [];

  const start = source.indexOf("{", declaration.index);
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
  const entries = [];
  const keyPattern = /^\s*["']?([a-zA-Z0-9_-]+)["']?\s*:/gm;

  for (const match of body.matchAll(keyPattern)) {
    const absoluteIndex = start + 1 + match.index;

    entries.push(makeRouteLikeEntry({
      id: match[1],
      sourceFile,
      sourceField: objectName,
      syntaxContext: sourceContext(source, absoluteIndex, match[0].length),
      extractor: "route_role_access",
      line: sourceLineNumber(source, absoluteIndex),
      routeBearing: true
    }));
  }

  return uniqueRouteLikeEntries(entries);
}

function extractRouterEntries(source, sourceFile) {
  const entries = [];

  const patterns = [
    {
      sourceField: "router_map_key",
      pattern: /["']([a-z0-9_-]+)["']\s*:\s*\{/gi
    },
    {
      sourceField: "switch_case",
      pattern: /\bcase\s+["']([a-z0-9_-]+)["']/gi
    },
    {
      sourceField: "navigateTo",
      pattern: /\bnavigateTo\(\s*["']([a-z0-9_-]+)["']/gi
    }
  ];

  for (const { sourceField, pattern } of patterns) {
    for (const match of source.matchAll(pattern)) {
      entries.push(makeRouteLikeEntry({
        id: match[1],
        sourceFile,
        sourceField,
        syntaxContext: sourceContext(source, match.index, match[0].length),
        extractor: "router",
        line: sourceLineNumber(source, match.index),
        routeBearing: true
      }));
    }
  }

  return uniqueRouteLikeEntries(entries);
}

function extractExplicitRouteEntries(source, sourceFile) {
  const entries = [];

  const fieldPatterns = [
    ["targetPage", /(?:^|[,{]\s*)targetPage\s*:\s*["']([a-z0-9_-]+)["']/gim],
    ["destination_page", /(?:^|[,{]\s*)destination_page\s*:\s*["']([a-z0-9_-]+)["']/gim],
    ["destinationPage", /(?:^|[,{]\s*)destinationPage\s*:\s*["']([a-z0-9_-]+)["']/gim],
    ["route", /(?:^|[,{]\s*)route\s*:\s*["']([a-z0-9_-]+)["']/gim],
    ["page", /(?:^|[,{]\s*)page\s*:\s*["']([a-z0-9_-]+)["']/gim]
  ];

  for (const [sourceField, pattern] of fieldPatterns) {
    for (const match of source.matchAll(pattern)) {
      entries.push(makeRouteLikeEntry({
        id: match[1],
        sourceFile,
        sourceField,
        syntaxContext: sourceContext(source, match.index, match[0].length),
        extractor: "explicit_route_field",
        line: sourceLineNumber(source, match.index),
        routeBearing: true
      }));
    }
  }

  for (const match of source.matchAll(/\bnavigateTo\(\s*["']([a-z0-9_-]+)["']/gi)) {
    entries.push(makeRouteLikeEntry({
      id: match[1],
      sourceFile,
      sourceField: "navigateTo",
      syntaxContext: sourceContext(source, match.index, match[0].length),
      extractor: "explicit_navigation_call",
      line: sourceLineNumber(source, match.index),
      routeBearing: true
    }));
  }

  return uniqueRouteLikeEntries(entries);
}

function extractAiCommandDecisionEntries(source, sourceFile) {
  if (sourceFile !== files.aiCommand) return [];

  const brainStart = source.indexOf("const AiCommandBrain");
  const routerStart = source.indexOf("const AiCommandRouter", brainStart);

  if (brainStart < 0 || routerStart < 0 || routerStart <= brainStart) {
    return [];
  }

  const brainBlock = source.slice(brainStart, routerStart);
  const decideMatch = /\bdecide\s*\([^)]*\)\s*\{/.exec(brainBlock);

  if (!decideMatch) return [];

  const decideStart = brainStart + decideMatch.index;
  const decideBlock = source.slice(decideStart, routerStart);
  const entries = [];

  const returnPattern =
    /\breturn\s*\{\s*route\s*:\s*["']([a-z0-9_-]+)["']\s*,\s*action\s*:\s*["']([a-z0-9_-]+)["']\s*\}/gi;

  for (const match of decideBlock.matchAll(returnPattern)) {
    const absoluteIndex = decideStart + match.index;

    entries.push(makeRouteLikeEntry({
      id: match[1],
      sourceFile,
      sourceField: "decision.route",
      syntaxContext: match[0],
      extractor: "ai_command_decision",
      line: sourceLineNumber(source, absoluteIndex),
      routeBearing: false
    }));
  }

  return uniqueRouteLikeEntries(entries);
}

function extractHandoffSourceEntries(source, sourceFile) {
  const entries = [];
  const pattern = /(?:^|[,{]\s*)source_page\s*:\s*["']([a-z0-9_-]+)["']/gim;

  for (const match of source.matchAll(pattern)) {
    entries.push(makeRouteLikeEntry({
      id: match[1],
      sourceFile,
      sourceField: "source_page",
      syntaxContext: sourceContext(source, match.index, match[0].length),
      extractor: "handoff_source",
      line: sourceLineNumber(source, match.index),
      routeBearing: false
    }));
  }

  return uniqueRouteLikeEntries(entries);
}

function extractUiCommandEntries(source, sourceFile) {
  const entries = [];

  if (/\/command-router\.js$/.test(sourceFile)) {
    const commandPattern = /^\s*[A-Z][A-Z0-9_]*\s*:\s*["']([a-z0-9_-]+)["']/gm;

    for (const match of source.matchAll(commandPattern)) {
      entries.push(makeRouteLikeEntry({
        id: match[1],
        sourceFile,
        sourceField: "command_constant",
        syntaxContext: sourceContext(source, match.index, match[0].length),
        extractor: "ui_command_registry",
        line: sourceLineNumber(source, match.index),
        routeBearing: false
      }));
    }
  }

  const dispatchPattern = /\bdispatch[A-Za-z0-9_]*Command\(\s*["']([a-z0-9_-]+)["']/g;

  for (const match of source.matchAll(dispatchPattern)) {
    entries.push(makeRouteLikeEntry({
      id: match[1],
      sourceFile,
      sourceField: "command_dispatch",
      syntaxContext: sourceContext(source, match.index, match[0].length),
      extractor: "ui_command_dispatch",
      line: sourceLineNumber(source, match.index),
      routeBearing: false
    }));
  }

  return uniqueRouteLikeEntries(entries);
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

const runtimeFiles = [
  ...Object.entries(files).map(([sourceKey, sourceFile]) => ({
    sourceKey,
    sourceFile,
    source: src[sourceKey]
  })),
  ...pageFiles.map((sourceFile) => ({
    sourceKey: "page",
    sourceFile,
    source: read(sourceFile)
  }))
];

const pageSource = runtimeFiles
  .filter(({ sourceKey }) => sourceKey === "page")
  .map(({ sourceFile, source }) => `\n===== ${sourceFile} =====\n${source}`)
  .join("\n");

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

function classificationResult(bucket, entry, reason) {
  return {
    bucket,
    entry,
    reason: String(reason || "")
  };
}

function isAiCommandBrainDecision(entry) {
  return (
    entry.sourceFile === files.aiCommand &&
    entry.sourceField === "decision.route" &&
    entry.extractor === "ai_command_decision" &&
    !knownNonPageExact.has(entry.id)
  );
}

function isAiCommandEmptyStateDecision(entry) {
  return (
    entry.sourceFile === files.aiCommand &&
    entry.sourceField === "decision.route" &&
    entry.extractor === "ai_command_decision" &&
    /\baction\s*:\s*["']show_suggestions["']/.test(
      entry.syntaxContext
    )
  );
}

function classifyRouteLikeEntry(entry) {
  const id = entry?.id;

  if (!id) return classificationResult("empty", entry, "empty identifier");

  if (AI_TEAM_PAGE_OWNER_MATRIX[id]) {
    return classificationResult(
      "contract_page",
      entry,
      "canonical AI_TEAM_PAGE_OWNER_MATRIX page"
    );
  }

  if (contractRoleSet.has(id)) {
    return classificationResult(
      "role_id",
      entry,
      "canonical AI team role"
    );
  }

  if (AI_TEAM_ROLE_ALIASES[id]) {
    return classificationResult(
      "role_alias",
      entry,
      "contract AI team role alias"
    );
  }

  if (isAiCommandEmptyStateDecision(entry)) {
    return classificationResult(
      "status_lifecycle_identifier",
      entry,
      "AI Command empty-state lifecycle decision"
    );
  }

  if (isAiCommandBrainDecision(entry)) {
    return classificationResult(
      "internal_ai_decision_route",
      entry,
      "AI Command internal decision branch"
    );
  }

  if (
    entry.extractor === "handoff_source" &&
    Array.isArray(AI_TEAM_HANDOFF_RULES[id])
  ) {
    return classificationResult(
      "subsystem_handoff_source",
      entry,
      "registered AI_TEAM_HANDOFF_RULES source"
    );
  }

  if (
    entry.extractor === "ui_command_registry" ||
    entry.extractor === "ui_command_dispatch"
  ) {
    return classificationResult(
      "ui_action_event",
      entry,
      "explicit UI command registry or dispatcher"
    );
  }

  if (knownNonPageExact.has(id)) {
    return classificationResult(
      "known_non_page",
      entry,
      "known non-page vocabulary"
    );
  }

  if (knownNonPagePrefixes.some((prefix) => id.startsWith(prefix))) {
    return classificationResult(
      "known_non_page",
      entry,
      "known non-page prefix"
    );
  }

  if (/Input$/.test(id)) {
    return classificationResult("input_id", entry, "input identifier");
  }

  if (/Status$/.test(id)) {
    return classificationResult("status_id", entry, "status identifier");
  }

  if (/^[a-z]+[A-Z]/.test(id)) {
    return classificationResult("camel_case_id", entry, "camel-case identifier");
  }

  if (/_(image|video|audio|tts|speech|route|open|cloud|local|hybrid|flux|sdxl)$/.test(id)) {
    return classificationResult(
      "provider_or_mode_id",
      entry,
      "provider or mode identifier"
    );
  }

  if (/(pixel|ads|drive|console|commerce|channels|tools)$/.test(id)) {
    return classificationResult(
      "integration_or_channel_id",
      entry,
      "integration or channel identifier"
    );
  }

  return classificationResult(
    "unknown_candidate",
    entry,
    "no evidence-backed classification"
  );
}

const routeBearingExtractors = new Set([
  "router",
  "explicit_route_field",
  "explicit_navigation_call",
  "route_role_access"
]);

const classificationPriority = [
  "contract_page",
  "role_id",
  "role_alias",
  "status_lifecycle_identifier",
  "internal_ai_decision_route",
  "subsystem_handoff_source",
  "ui_action_event",
  "known_non_page",
  "provider_or_mode_id",
  "integration_or_channel_id",
  "input_id",
  "status_id",
  "camel_case_id",
  "unknown_candidate"
];

function resolveRouteLikeClassifications(id, results) {
  const canonical = results.find((result) =>
    ["contract_page", "role_id", "role_alias"].includes(result.bucket)
  );

  if (canonical) return canonical;

  const unresolvedRouteEvidence = results.find(
    (result) =>
      routeBearingExtractors.has(result.entry?.extractor) &&
      result.bucket === "unknown_candidate"
  );

  if (unresolvedRouteEvidence) {
    return unresolvedRouteEvidence;
  }

  for (const bucket of classificationPriority) {
    const match = results.find((result) => result.bucket === bucket);
    if (match) return match;
  }

  return classificationResult(
    "unknown_candidate",
    makeRouteLikeEntry({ id }),
    "no classification results"
  );
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

const routerEntries = extractRouterEntries(src.router, files.router);

const explicitRouteEntries = runtimeFiles.flatMap(
  ({ sourceFile, source }) =>
    extractExplicitRouteEntries(source, sourceFile)
);

const aiCommandDecisionEntries = extractAiCommandDecisionEntries(
  src.aiCommand,
  files.aiCommand
);

const aiCommandDecisionLines = new Set(
  aiCommandDecisionEntries.map((entry) => entry.line)
);

const filteredExplicitRouteEntries = explicitRouteEntries.filter(
  (entry) =>
    !(
      entry.sourceFile === files.aiCommand &&
      entry.sourceField === "route" &&
      aiCommandDecisionLines.has(entry.line)
    )
);

const handoffSourceEntries = runtimeFiles.flatMap(
  ({ sourceFile, source }) =>
    extractHandoffSourceEntries(source, sourceFile)
);

const uiCommandEntries = runtimeFiles.flatMap(
  ({ sourceFile, source }) =>
    extractUiCommandEntries(source, sourceFile)
);

const routeRoleEntries = extractObjectKeyEntries(
  src.routeRoleFallback,
  "DEFAULT_ROUTE_ROLE_ACCESS",
  files.routeRoleFallback
);

const pageOwnerKeys = contractPageIds;

const allRouteLikeEntries = uniqueRouteLikeEntries([
  ...routerEntries,
  ...filteredExplicitRouteEntries,
  ...aiCommandDecisionEntries,
  ...handoffSourceEntries,
  ...uiCommandEntries,
  ...routeRoleEntries
]);

const resultsById = new Map();

for (const entry of allRouteLikeEntries) {
  const result = classifyRouteLikeEntry(entry);

  if (!resultsById.has(entry.id)) {
    resultsById.set(entry.id, []);
  }

  resultsById.get(entry.id).push(result);
}

const resolvedClassifications = new Map();

for (const [id, results] of resultsById.entries()) {
  resolvedClassifications.set(
    id,
    resolveRouteLikeClassifications(id, results)
  );
}

const buckets = {
  contract_page: [],
  role_id: [],
  role_alias: [],
  known_non_page: [],
  provider_or_mode_id: [],
  integration_or_channel_id: [],
  input_id: [],
  status_id: [],
  camel_case_id: [],
  status_lifecycle_identifier: [],
  internal_ai_decision_route: [],
  ui_action_event: [],
  subsystem_handoff_source: [],
  unknown_candidate: []
};

for (const [id, result] of resolvedClassifications.entries()) {
  if (!buckets[result.bucket]) buckets[result.bucket] = [];
  buckets[result.bucket].push(id);
}

for (const key of Object.keys(buckets)) {
  buckets[key] = unique(buckets[key]).sort();
}

printBucket("Route-like ID buckets", buckets);

const evidenceBuckets = new Set([
  "status_lifecycle_identifier",
  "internal_ai_decision_route",
  "ui_action_event",
  "subsystem_handoff_source"
]);

for (const [id, result] of resolvedClassifications.entries()) {
  if (!evidenceBuckets.has(result.bucket)) continue;

  const entry = result.entry || {};

  note(
    `classified ${result.bucket}`,
    [
      id,
      entry.sourceFile || "unknown source",
      entry.sourceField || "unknown field",
      `line ${entry.line || 0}`,
      entry.extractor || "unknown extractor",
      result.reason || "no reason"
    ].join(" | ")
  );
}

const regressionCases = [
  {
    label: "AI decision extractor classifies internal branch",
    entry: makeRouteLikeEntry({
      id: "future-internal-branch",
      sourceFile: files.aiCommand,
      sourceField: "decision.route",
      syntaxContext:
        'return { route: "future-internal-branch", action: "execute_internal_flow" }',
      extractor: "ai_command_decision"
    }),
    expected: "internal_ai_decision_route"
  },
  {
    label: "AI suggestion decision classifies lifecycle state",
    entry: makeRouteLikeEntry({
      id: "future-empty-state",
      sourceFile: files.aiCommand,
      sourceField: "decision.route",
      syntaxContext:
        'return { route: "future-empty-state", action: "show_suggestions" }',
      extractor: "ai_command_decision"
    }),
    expected: "status_lifecycle_identifier"
  },
  {
    label: "unknown exact route remains unknown",
    entry: makeRouteLikeEntry({
      id: "marketing-dashboard-v2",
      sourceFile: "synthetic/regression.js",
      sourceField: "route",
      syntaxContext: 'route: "marketing-dashboard-v2"',
      extractor: "explicit_route_field",
      routeBearing: true
    }),
    expected: "unknown_candidate"
  },
  {
    label: "unknown exact page remains unknown",
    entry: makeRouteLikeEntry({
      id: "future-operations-v3",
      sourceFile: "synthetic/regression.js",
      sourceField: "page",
      syntaxContext: 'page: "future-operations-v3"',
      extractor: "explicit_route_field",
      routeBearing: true
    }),
    expected: "unknown_candidate"
  },
  {
    label: "unregistered handoff source remains unknown",
    entry: makeRouteLikeEntry({
      id: "unregistered-engine",
      sourceFile: "synthetic/regression.js",
      sourceField: "source_page",
      syntaxContext: 'source_page: "unregistered-engine"',
      extractor: "handoff_source"
    }),
    expected: "unknown_candidate"
  },
  {
    label: "arbitrary uppercase property is not a UI event",
    entry: makeRouteLikeEntry({
      id: "future-page-v3",
      sourceFile: "synthetic/regression.js",
      sourceField: "arbitrary_property",
      syntaxContext: 'SOME_VALUE: "future-page-v3"',
      extractor: "arbitrary_property"
    }),
    expected: "unknown_candidate"
  }
];

for (const regressionCase of regressionCases) {
  const result = classifyRouteLikeEntry(regressionCase.entry);

  assert(
    regressionCase.label,
    result.bucket === regressionCase.expected,
    result.bucket
  );
}

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
const contractPagesAbsentFromRouteEvidence =
  contractPageIds.filter(
    (pageId) => !buckets.contract_page.includes(pageId)
  );

console.log(`Contract pages: ${contractPageIds.length}`);
console.log(
  `Contract pages in route-like evidence: ${buckets.contract_page.length}`
);
console.log(
  `Contract pages absent from route-like evidence: ${
    contractPagesAbsentFromRouteEvidence.length
  }${
    contractPagesAbsentFromRouteEvidence.length
      ? ` | ${contractPagesAbsentFromRouteEvidence.join(", ")}`
      : ""
  }`
);
console.log(`Ignored known non-pages: ${buckets.known_non_page.length}`);
console.log(`Ignored providers/modes: ${buckets.provider_or_mode_id.length}`);
console.log(`Ignored integration/channel ids: ${buckets.integration_or_channel_id.length}`);
console.log(`Ignored input/status/camel ids: ${buckets.input_id.length + buckets.status_id.length + buckets.camel_case_id.length}`);
console.log(`Status/lifecycle identifiers: ${buckets.status_lifecycle_identifier.length}`);
console.log(`Internal AI decision routes: ${buckets.internal_ai_decision_route.length}`);
console.log(`UI action events: ${buckets.ui_action_event.length}`);
console.log(`Subsystem handoff sources: ${buckets.subsystem_handoff_source.length}`);
console.log(`Route-like evidence entries: ${allRouteLikeEntries.length}`);

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

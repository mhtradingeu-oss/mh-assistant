#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "docs/architecture/AUDIENCE_OS_RULES.md",
  "scripts/audit/validate-audience-os-contract.mjs",
  "scripts/audit/audience-os-active-scope-check.mjs",
  "scripts/audit/audience-os-safety-guard.mjs"
];

const CANONICAL_BACKEND_DOMAIN = "runtime/orchestrator-service/lib/growth/audience-os";
const CANONICAL_FRONTEND_PANEL = "public/control-center/pages/ads-manager/audience-os-panel.js";
const CANONICAL_DATA_FILE = "data/projects/hairoticmen/ops/audience-os.json";

const FORBIDDEN_TARGETS = [
  "runtime/orchestrator-service/server.js",
  "runtime/orchestrator-service/lib/media",
  "runtime/orchestrator-service/lib/integrations/providers/tiktok.js",
  "runtime/orchestrator-service/lib/integrations/providers/woocommerce.js",
  "public/control-center/pages/media-studio.js",
  "public/control-center/state",
  "infra"
];

const AUDIENCE_OS_MARKERS = [
  "Audience OS",
  "audience-os",
  "Audience Blueprint Registry",
  "Audience Template Constructor",
  "Audience Rule Engine",
  "Platform Audience Mapper",
  "Audience Governance",
  "ecommerce.tiktok.starter",
  "No platform write without approval"
];

const DUPLICATE_FILENAME_PATTERNS = [
  /audience-builder/i,
  /audience-constructor/i,
  /audience-manager/i,
  /retargeting-engine/i,
  /lookalike-builder/i,
  /segment-builder/i,
  /audiences[.]js$/i,
  /audience-os[.]js$/i
];

const RULES_REQUIRED_TERMS = [
  "platform-aware",
  "manual-first",
  "draft-only",
  "No platform write without approval",
  "No campaign launch from Audience OS",
  "No budget mutation from Audience OS",
  "runtime/orchestrator-service/lib/growth/audience-os/",
  "public/control-center/pages/ads-manager/audience-os-panel.js",
  "ownerRole",
  "ads_operator",
  "strategist",
  "analyst",
  "compliance_reviewer",
  "Provider Execution Gate",
  "Governance Mutation Gate",
  "Phase 3D"
];

function asPosix(value) {
  return String(value || "").split(String.fromCharCode(92)).join("/");
}

function full(filePath) {
  return path.join(ROOT, filePath);
}

function exists(filePath) {
  return fs.existsSync(full(filePath));
}

function isDirectory(filePath) {
  try {
    return fs.statSync(full(filePath)).isDirectory();
  } catch {
    return false;
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(full(filePath), "utf8");
  } catch {
    return "";
  }
}

function walk(filePath, out = []) {
  if (!exists(filePath)) return out;

  const stat = fs.statSync(full(filePath));

  if (stat.isFile()) {
    out.push(asPosix(filePath));
    return out;
  }

  if (!stat.isDirectory()) return out;

  for (const entry of fs.readdirSync(full(filePath), { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    walk(path.join(filePath, entry.name), out);
  }

  return out;
}

function pass(message) {
  console.log(`PASS - ${message}`);
}

function warn(message, details = {}) {
  console.log(`WARN - ${message}`);
  if (Object.keys(details).length) console.log(JSON.stringify(details, null, 2));
}

function fail(message, details = {}) {
  console.log(`FAIL - ${message}`);
  if (Object.keys(details).length) console.log(JSON.stringify(details, null, 2));
  process.exitCode = 1;
}

function info(message, details = {}) {
  console.log(`INFO - ${message}`);
  if (Object.keys(details).length) console.log(JSON.stringify(details, null, 2));
}

function includesInsensitive(text, needle) {
  return text.toLowerCase().includes(String(needle).toLowerCase());
}

function containsAudienceOsMarker(text) {
  return AUDIENCE_OS_MARKERS.some((marker) => includesInsensitive(text, marker));
}

function isCanonicalAudienceOsPath(filePath) {
  const value = asPosix(filePath);
  return (
    value.startsWith(`${CANONICAL_BACKEND_DOMAIN}/`) ||
    value === CANONICAL_FRONTEND_PANEL ||
    value === CANONICAL_DATA_FILE ||
    value.startsWith("scripts/audit/") ||
    value === "docs/architecture/AUDIENCE_OS_RULES.md" ||
    value.startsWith("audits/")
  );
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: ROOT,
    encoding: "utf8"
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status === 0) {
    pass(`script passed: ${scriptPath}`);
  } else {
    fail(`script failed: ${scriptPath}`, { status: result.status });
  }
}

console.log("============================================================");
console.log("AUDIENCE OS UNIFIED SAFETY GUARD");
console.log("============================================================");

console.log("");
console.log("===== REQUIRED FILES =====");

for (const filePath of REQUIRED_FILES) {
  if (exists(filePath)) {
    pass(`required file exists: ${filePath}`);
  } else {
    fail(`required file missing: ${filePath}`);
  }
}

console.log("");
console.log("===== RULES DOC CONTENT =====");

const rulesText = readText("docs/architecture/AUDIENCE_OS_RULES.md");
for (const term of RULES_REQUIRED_TERMS) {
  if (includesInsensitive(rulesText, term)) {
    pass(`rules doc includes: ${term}`);
  } else {
    fail(`rules doc missing: ${term}`);
  }
}

console.log("");
console.log("===== EXISTING AUDIENCE OS VALIDATORS =====");

runNodeScript("scripts/audit/validate-audience-os-contract.mjs");
runNodeScript("scripts/audit/audience-os-active-scope-check.mjs");

console.log("");
console.log("===== FORBIDDEN TARGET MARKER SCAN =====");

for (const target of FORBIDDEN_TARGETS) {
  if (!exists(target)) {
    pass(`forbidden target missing, no issue: ${target}`);
    continue;
  }

  const files = isDirectory(target) ? walk(target) : [target];
  const hits = [];

  for (const filePath of files) {
    const text = readText(filePath);
    if (containsAudienceOsMarker(text)) hits.push(filePath);
  }

  if (hits.length) {
    fail(`Audience OS marker found in forbidden target: ${target}`, { hits });
  } else {
    pass(`no Audience OS marker in forbidden target: ${target}`);
  }
}

console.log("");
console.log("===== STANDALONE PAGE CHECK =====");

const standalonePage = "public/control-center/pages/audience-os.js";
if (exists(standalonePage)) {
  fail("standalone Audience OS page exists before explicit approval", {
    standalonePage
  });
} else {
  pass("no standalone Audience OS page exists");
}

console.log("");
console.log("===== DUPLICATION RISK CHECK =====");

const scanRoots = [
  "runtime/orchestrator-service",
  "public/control-center/pages",
  "data/projects"
];

const duplicateHits = [];

for (const root of scanRoots) {
  for (const filePath of walk(root)) {
    if (isCanonicalAudienceOsPath(filePath)) continue;

    const base = path.basename(filePath);
    const matched = DUPLICATE_FILENAME_PATTERNS.find((pattern) => pattern.test(base));

    if (matched) {
      duplicateHits.push({
        filePath,
        pattern: String(matched)
      });
    }
  }
}

if (duplicateHits.length) {
  fail("potential duplicate Audience OS files found outside canonical paths", {
    duplicateHits
  });
} else {
  pass("no duplicate Audience OS implementation filenames outside canonical paths");
}

console.log("");
console.log("===== FUTURE CANONICAL PATH STATUS =====");

info("canonical backend domain", {
  path: `${CANONICAL_BACKEND_DOMAIN}/`,
  exists: exists(CANONICAL_BACKEND_DOMAIN)
});

info("canonical frontend panel", {
  path: CANONICAL_FRONTEND_PANEL,
  exists: exists(CANONICAL_FRONTEND_PANEL)
});

info("canonical data file", {
  path: CANONICAL_DATA_FILE,
  exists: exists(CANONICAL_DATA_FILE)
});

console.log("");
console.log("===== GIT STATUS RISK REMINDER =====");

const gitStatus = spawnSync("git", ["status", "--short"], {
  cwd: ROOT,
  encoding: "utf8"
});

const forbiddenStatusLines = String(gitStatus.stdout || "")
  .split("\n")
  .filter(Boolean)
  .filter((line) =>
    /runtime\/orchestrator-service\/server[.]js|runtime\/orchestrator-service\/lib\/media\/|public\/control-center\/pages\/media-studio|public\/control-center\/state\/|infra\/|data\/projects\/hairoticmen\/ops\//.test(line)
  );

if (forbiddenStatusLines.length) {
  warn("unrelated forbidden-scope files are dirty or untracked; do not include them in Audience OS commits", {
    forbiddenStatusLines
  });
} else {
  pass("no unrelated forbidden-scope dirty files detected");
}

console.log("");
console.log("===== SAFETY VERDICT =====");

if (process.exitCode) {
  console.log("VERDICT: FAIL - Audience OS safety guard found unsafe architecture drift");
  process.exit(process.exitCode);
}

console.log("VERDICT: PASS - Audience OS unified safety guard passed");

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const ALLOWED_PHASE_3C_FILES = new Set([
  "scripts/audit/validate-audience-os-contract.mjs",
  "scripts/audit/audience-os-active-scope-check.mjs"
]);

const PREFERRED_FUTURE_PATHS = {
  backendDomain: "runtime/orchestrator-service/lib/growth/audience-os/",
  frontendPanel: "public/control-center/pages/ads-manager/audience-os-panel.js",
  dataFile: "data/projects/hairoticmen/ops/audience-os.json"
};

const FORBIDDEN_AUDIENCE_OS_TARGETS = [
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

function rel(filePath) {
  return filePath.replaceAll("\\", "/");
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

function walk(filePath, out = []) {
  if (!exists(filePath)) return out;

  const absolute = full(filePath);
  const stat = fs.statSync(absolute);

  if (stat.isFile()) {
    out.push(rel(filePath));
    return out;
  }

  if (!stat.isDirectory()) return out;

  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    walk(path.join(filePath, entry.name), out);
  }

  return out;
}

function readText(filePath) {
  try {
    return fs.readFileSync(full(filePath), "utf8");
  } catch {
    return "";
  }
}

function fail(message, details = {}) {
  console.log(`FAIL - ${message}`);
  if (Object.keys(details).length) {
    console.log(JSON.stringify(details, null, 2));
  }
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS - ${message}`);
}

function info(message, details = {}) {
  console.log(`INFO - ${message}`);
  if (Object.keys(details).length) {
    console.log(JSON.stringify(details, null, 2));
  }
}

function containsAudienceOsMarker(text) {
  return AUDIENCE_OS_MARKERS.some((marker) =>
    text.toLowerCase().includes(marker.toLowerCase())
  );
}

console.log("============================================================");
console.log("AUDIENCE OS ACTIVE SCOPE CHECK");
console.log("============================================================");

console.log("");
console.log("===== PHASE 3C REQUIRED FILES =====");

for (const filePath of ALLOWED_PHASE_3C_FILES) {
  if (exists(filePath)) {
    pass(`required Phase 3C script exists: ${filePath}`);
  } else {
    fail(`required Phase 3C script missing: ${filePath}`);
  }
}

console.log("");
console.log("===== PREFERRED FUTURE PATHS =====");
for (const [key, value] of Object.entries(PREFERRED_FUTURE_PATHS)) {
  info(`${key}`, { path: value, exists: exists(value) });
}

console.log("");
console.log("===== FORBIDDEN TARGET MARKER SCAN =====");

for (const target of FORBIDDEN_AUDIENCE_OS_TARGETS) {
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
    fail(`Audience OS markers found in forbidden target: ${target}`, { hits });
  } else {
    pass(`no Audience OS markers in forbidden target: ${target}`);
  }
}

console.log("");
console.log("===== STANDALONE PAGE CHECK =====");

const standalonePage = "public/control-center/pages/audience-os.js";
if (exists(standalonePage)) {
  fail("standalone Audience OS page exists before router/page placement approval", {
    standalonePage
  });
} else {
  pass("no standalone Audience OS page exists");
}

console.log("");
console.log("===== CONTRACT DIRECTORY CHECK =====");

const contractDirsRoot = "audits/product-readiness";
if (!exists(contractDirsRoot)) {
  fail("audits/product-readiness directory missing");
} else {
  const dirs = fs
    .readdirSync(full(contractDirsRoot), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => /^23-phase-3b1-audience-os-product-contract-repair-/.test(name))
    .sort();

  if (dirs.length) {
    pass("Audience OS product contract repair directory exists");
    info("latest contract repair directory", { directory: dirs.at(-1) });
  } else {
    fail("Audience OS product contract repair directory missing");
  }
}

console.log("");
console.log("===== SCOPE VERDICT =====");

if (process.exitCode) {
  console.log("VERDICT: FAIL - Audience OS scope guard found unsafe placement");
  process.exit(process.exitCode);
}

console.log("VERDICT: PASS - Audience OS active scope is clean");

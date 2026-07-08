#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

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

function exists(filePath) {
  return fs.existsSync(path.join(ROOT, filePath));
}

function listDirs(dirPath) {
  const full = path.join(ROOT, dirPath);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dirPath, entry.name))
    .sort();
}

function findLatestAudienceContract() {
  const dirs = listDirs("audits/product-readiness")
    .filter((dir) => /23-phase-3b1-audience-os-product-contract-repair-/.test(dir))
    .sort();

  const latestDir = dirs.at(-1);
  if (!latestDir) return null;

  const contractPath = path.join(latestDir, "AUDIENCE_OS_PRODUCT_CONTRACT.md");
  return exists(contractPath) ? contractPath : null;
}

function includesInsensitive(text, needle) {
  return text.toLowerCase().includes(String(needle).toLowerCase());
}

console.log("============================================================");
console.log("AUDIENCE OS CONTRACT VALIDATION");
console.log("============================================================");

const contractPath = findLatestAudienceContract();

if (!contractPath) {
  fail("latest Audience OS product contract was not found");
} else {
  pass("latest Audience OS product contract exists");
  info("contract path", { contractPath });
}

if (process.exitCode) process.exit(process.exitCode);

const contractText = fs.readFileSync(path.join(ROOT, contractPath), "utf8");

const requiredTerms = [
  "Audience OS is a platform-aware",
  "manual-first",
  "draft-only",
  "No platform write without approval",
  "No campaign launch from Audience OS",
  "No budget mutation from Audience OS",
  "Audience Blueprint Registry",
  "Audience Template Constructor",
  "Audience Rule Engine",
  "Platform Audience Mapper",
  "Audience Governance",
  "AI Team Workflow",
  "Operations Lead",
  "Strategist",
  "Ads Operator",
  "Analyst",
  "Researcher",
  "Content Writer",
  "Media Director",
  "Video Lead",
  "Compliance Reviewer",
  "Publisher",
  "runtime/orchestrator-service/lib/growth/audience-os/",
  "Ads Manager as Audience OS section or tab",
  "TikTok",
  "WooCommerce",
  "What Not To Build Yet",
  "Phase 3C",
  "Phase 3D",
  "Platform write adapter only after explicit approval"
];

for (const term of requiredTerms) {
  if (includesInsensitive(contractText, term)) {
    pass(`contract includes: ${term}`);
  } else {
    fail(`contract missing: ${term}`);
  }
}

const forbiddenClaims = [
  "TikTok-only feature",
  "auto-create audiences inside TikTok",
  "campaign launch from Audience OS",
  "budget mutation from Audience OS"
];

console.log("");
console.log("===== FORBIDDEN / RISKY CLAIM CHECK =====");

const allowedNegatedClaims = new Map([
  ["TikTok-only feature", "It is not a TikTok-only feature."],
  ["auto-create audiences inside TikTok", "MVP does not auto-create audiences inside TikTok"],
  ["campaign launch from Audience OS", "No campaign launch from Audience OS"],
  ["budget mutation from Audience OS", "No budget mutation from Audience OS"]
]);

for (const claim of forbiddenClaims) {
  const expectedSafeContext = allowedNegatedClaims.get(claim);
  if (!includesInsensitive(contractText, claim)) {
    pass(`risky claim absent: ${claim}`);
    continue;
  }

  if (expectedSafeContext && includesInsensitive(contractText, expectedSafeContext)) {
    pass(`risky claim appears only as safe negation: ${claim}`);
  } else {
    fail(`risky claim appears without expected safe context: ${claim}`);
  }
}

console.log("");
console.log("===== VALIDATION VERDICT =====");

if (process.exitCode) {
  console.log("VERDICT: FAIL - Audience OS product contract is incomplete or unsafe");
  process.exit(process.exitCode);
}

console.log("VERDICT: PASS - Audience OS product contract is valid");

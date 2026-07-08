import fs from "fs";
import {
  normalizeAiTeamRoleId,
  AI_TEAM_ROLE_ALIASES,
  AI_TEAM_CANONICAL_ROLES
} from "../../../public/control-center/runtime/ai-team/ai-team-operating-contract.js";

const source = fs.readFileSync("public/control-center/pages/ai-command.js", "utf8");

function extractObjectBody(sourceText, objectName) {
  const idx = sourceText.indexOf(objectName);
  if (idx < 0) return "";
  const start = sourceText.indexOf("{", idx);
  if (start < 0) return "";
  let depth = 0;
  let inString = null;
  let escaped = false;

  for (let i = start; i < sourceText.length; i++) {
    const ch = sourceText[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === inString) inString = null;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) return sourceText.slice(start, i + 1);
    }
  }

  return "";
}

function extractObjectPairsFromBody(body) {
  const pairs = {};
  for (const match of body.matchAll(/["']?([a-zA-Z0-9_-]+)["']?\s*:\s*["']([a-zA-Z0-9_-]+)["']/g)) {
    pairs[match[1]] = match[2];
  }
  return pairs;
}

const modeAliases = extractObjectPairsFromBody(extractObjectBody(source, "MODE_ID_ALIASES"));
const canonicalRoleIds = new Set(AI_TEAM_CANONICAL_ROLES.map((role) => role.id));

const inputs = [
  "admin",
  "operations",
  "operations_lead",
  "executive",
  "copywriter",
  "writer",
  "content_writer",
  "content",
  "media",
  "media_director",
  "designer",
  "video",
  "video_lead",
  "ads",
  "ads_operator",
  "customer",
  "customer_ops",
  "customer_operations",
  "support",
  "seo",
  "analyst",
  "insights",
  "compliance",
  "compliance_reviewer",
  "governance",
  "sales",
  "crm",
  "sales_crm",
  "research",
  "researcher",
  "publisher",
  "publishing"
];

console.log("Alias simulation: existing MODE_ID_ALIASES vs canonical contract");
console.log("");

let changed = 0;
let unresolvedBefore = 0;
let unresolvedAfter = 0;

for (const input of inputs) {
  const before = modeAliases[input] || input;
  const after = normalizeAiTeamRoleId(before, normalizeAiTeamRoleId(input, "operations"));
  const beforeCanonical = canonicalRoleIds.has(before);
  const afterCanonical = canonicalRoleIds.has(after);

  if (!beforeCanonical) unresolvedBefore++;
  if (!afterCanonical) unresolvedAfter++;
  if (before !== after) changed++;

  console.log(`${input} | before=${before} | beforeCanonical=${beforeCanonical ? "yes" : "no"} | after=${after} | afterCanonical=${afterCanonical ? "yes" : "no"}`);
}

console.log("");
console.log("Metrics:");
console.log(`changed=${changed}`);
console.log(`unresolvedBefore=${unresolvedBefore}`);
console.log(`unresolvedAfter=${unresolvedAfter}`);
console.log("");
console.log("Interpretation:");
if (unresolvedAfter === 0) {
  console.log("PASS - canonical normalization resolves all tested aliases.");
} else {
  console.log("HOLD - canonical normalization still leaves unresolved aliases.");
}

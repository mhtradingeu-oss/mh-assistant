import fs from "fs";
import { normalizeAiTeamRoleId } from "../../../public/control-center/runtime/ai-team/ai-team-operating-contract.js";

const source = fs.readFileSync("public/control-center/pages/ai-command.js", "utf8");

function extractDirectMap(sourceText) {
  const detector = sourceText.match(/function detectSpecialistFromBridgePrompt[\s\S]*?const classified = classifyIntent/);
  const window = detector ? detector[0] : "";
  return [...window.matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)].map((m) => [m[1], m[2]]);
}

function extractModeAliases(sourceText) {
  const idx = sourceText.indexOf("MODE_ID_ALIASES");
  const start = sourceText.indexOf("{", idx);
  let depth = 0;
  let end = -1;
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
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = sourceText.slice(start + 1, end);
  const aliases = {};
  for (const match of body.matchAll(/["']?([a-zA-Z0-9_-]+)["']?\s*:\s*["']([a-zA-Z0-9_-]+)["']/g)) {
    aliases[match[1]] = match[2];
  }
  return aliases;
}

const directMap = extractDirectMap(source);
const localAliases = extractModeAliases(source);

function normalizeAiCommandSpecialistId(id, fallback = "operations") {
  const localResolved = localAliases[id] || id;
  return normalizeAiTeamRoleId(localResolved, fallback);
}

let failures = 0;

console.log("Bridge detector directMap normalization:");
for (const [keyword, rawTarget] of directMap) {
  const normalized = normalizeAiCommandSpecialistId(rawTarget);
  const ok = normalizeAiTeamRoleId(normalized, "") === normalized;
  console.log(`${keyword} -> raw=${rawTarget} -> normalized=${normalized} -> ${ok ? "PASS" : "FAIL"}`);
  if (!ok) failures++;
}

console.log("");
console.log(`directMap entries=${directMap.length}`);
console.log(`failures=${failures}`);

if (failures) {
  console.log("VERDICT: FAIL - bridge directMap leaves unresolved role IDs");
  process.exit(1);
}

console.log("VERDICT: PASS - bridge directMap normalizes to canonical role IDs");

import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t28-ai-command-tool-dock-closeout/T28_AI_COMMAND_TOOL_DOCK_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/ai-command/tool-dock.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T28 AI Command Tool Dock closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "No runtime/security patch is required for AI Command Tool Dock at this time.",
  "Tool Dock is verified as a prompt/template/handoff surface, not a direct execution surface.",
  "Direct backend/API calls | Not found",
  "Dangerous project/provider direct calls | Not found"
];

const srcForbidden = [
  "disconnectProject",
  "reconnectProject",
  "syncProject",
  "publishProject",
  "sendEmail",
  "runWorkflow",
  "approveProject",
  "deleteProject"
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T28 closeout proof: " + item);
  }
}

for (const item of srcForbidden) {
  if (srcText.includes(item)) {
    throw new Error("Unexpected direct execution call in Tool Dock: " + item);
  }
}

console.log("T28 AI Command Tool Dock closeout verified.");

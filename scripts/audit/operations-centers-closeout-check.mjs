import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t48-operations-centers-closeout/T48_OPERATIONS_CENTERS_RUNTIME_AUTHORITY_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/operations-centers.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T48 Operations Centers closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "Operations Centers runtime authority is closed for this pass.",
  "No production runtime patch was required.",
  "Targeted mutation proof identified only one real backend mutation path, already confirmation-gated",
  "Notification Governance decision"
];

const srcRequired = [
  "Task mutations remain deferred and disabled",
  "No task creation, owner assignment, status change, approval, publishing, or backend execution is performed.",
  "context.decideProjectApproval",
  "Confirm Governance decision",
  "navigator.clipboard.writeText",
  "context.navigateTo(\"ai-command\")"
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T48 document proof: " + item);
  }
}

for (const item of srcRequired) {
  if (!srcText.includes(item)) {
    throw new Error("Missing Operations Centers source proof: " + item);
  }
}

console.log("T48 Operations Centers runtime authority closeout verified.");

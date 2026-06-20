import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t25-integrations-closeout/T25_INTEGRATIONS_RUNTIME_AUTHORITY_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/integrations.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T25 Integrations closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "Integrations runtime authority is closed for this pass.",
  "confirmation before sync",
  "confirmation before import",
  "governance approval handling inside `runServerAction(...)`",
  "No additional runtime/security patch is required at this time."
];

const srcRequired = [
  'if (type === "sync" || type === "import")',
  "Confirm integration ${actionLabel}",
  'governanceCode === "governance_approval_required"',
  'navigateTo("governance")'
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T25 document proof: " + item);
  }
}

for (const item of srcRequired) {
  if (!srcText.includes(item)) {
    throw new Error("Missing T25 source proof: " + item);
  }
}

console.log("T25 Integrations runtime authority closeout verified.");

import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t31-settings-closeout/T31_SETTINGS_RUNTIME_AUTHORITY_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/settings.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T31 Settings closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "Settings runtime authority is closed for this pass.",
  "No runtime/security patch is required at this time.",
  "save-all` is the only verified durable write path",
  "restore-defaults` does not write durable data"
];

const srcRequired = [
  'action === "save-all"',
  "Confirm settings save",
  "saveProjectTeam(session.projectName, teamPayload)",
  "updateProjectGovernancePolicy(session.projectName",
  'action === "restore-defaults"',
  "session.form = clone(session.defaults)",
  "session.dirty = true"
];

const srcForbidden = [
  "publishProject",
  "sendEmail",
  "runWorkflow",
  "syncProject",
  "disconnectProject",
  "reconnectProject",
  "deleteProject",
  "approveProject"
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T31 document proof: " + item);
  }
}

for (const item of srcRequired) {
  if (!srcText.includes(item)) {
    throw new Error("Missing T31 source proof: " + item);
  }
}

for (const item of srcForbidden) {
  if (srcText.includes(item)) {
    throw new Error("Unexpected direct external action in Settings: " + item);
  }
}

console.log("T31 Settings runtime authority closeout verified.");

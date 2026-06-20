import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t37-media-studio-closeout/T37_MEDIA_STUDIO_RUNTIME_AUTHORITY_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/media-studio-workspace.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T37 Media Studio closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "Media Studio runtime authority is closed for this pass.",
  "A minimal authority patch was required and completed.",
  "All sensitive actions now require explicit operator confirmation."
];

const srcRequired = [
  "function confirmMediaAuthorityAction",
  "Confirm media generation",
  "Confirm prompt improvement",
  "Confirm brand safety check",
  "Confirm local media approval mark",
  "Confirm media approval decision",
  "Confirm media approval request",
  "Confirm media revision decision",
  "Confirm media task creation",
  "Confirm publishing handoff"
];

const forbiddenCopy = [
  "mustbe",
  "maycall",
  "calla",
  "Thisdoes",
  "pendingbackend",
  "approvalexists",
  "isunavailable",
  "wasinvoked"
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T37 document proof: " + item);
  }
}

for (const item of srcRequired) {
  if (!srcText.includes(item)) {
    throw new Error("Missing Media Studio source confirmation proof: " + item);
  }
}

for (const item of forbiddenCopy) {
  if (srcText.includes(item)) {
    throw new Error("Compacted copy still present: " + item);
  }
}

console.log("T37 Media Studio runtime authority closeout verified.");

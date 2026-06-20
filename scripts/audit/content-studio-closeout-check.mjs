import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t54-content-studio-closeout/T54_CONTENT_STUDIO_RUNTIME_AUTHORITY_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/content-studio-workspace.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T54 Content Studio closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "Content Studio runtime authority is closed for this pass.",
  "A minimal production patch was required and completed.",
  "saveProjectContentItem",
  "createProjectHandoff",
  "executeProjectAiCommand",
  "confirmContentStudioAuthorityAction"
];

const srcRequired = [
  "function confirmContentStudioAuthorityAction",
  "Save backend content draft",
  "Create Library handoff",
  "Create Content Studio handoff",
  "Generate draft with AI backend",
  "Translate/adapt brief with AI backend",
  "This does not publish, send externally, or approve anything automatically."
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T54 document proof: " + item);
  }
}

for (const item of srcRequired) {
  if (!srcText.includes(item)) {
    throw new Error("Missing Content Studio source proof: " + item);
  }
}

console.log("T54 Content Studio runtime authority closeout verified.");

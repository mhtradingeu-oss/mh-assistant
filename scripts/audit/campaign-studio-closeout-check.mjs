import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t60-campaign-studio-closeout/T60_CAMPAIGN_STUDIO_RUNTIME_AUTHORITY_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/campaign-studio.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T60 Campaign Studio closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "Campaign Studio runtime authority is closed for this pass.",
  "A minimal production patch was required and completed.",
  "saveProjectCampaign",
  "createProjectHandoff",
  "confirmCampaignStudioAuthorityAction",
  "Typing autosave"
];

const srcRequired = [
  "function confirmCampaignStudioAuthorityAction",
  "Create campaign route handoff",
  "Campaign Studio autosave is local/shared-state only",
  "Save backend campaign draft",
  "Save backend campaign plan",
  "Create AI Command campaign handoff",
  "This does not publish, send externally, schedule ads, or approve anything automatically."
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T60 document proof: " + item);
  }
}

for (const item of srcRequired) {
  if (!srcText.includes(item)) {
    throw new Error("Missing Campaign Studio source proof: " + item);
  }
}

if (/setTimeout\(async[\s\S]*?saveProjectCampaign/.test(srcText)) {
  throw new Error("Campaign Studio autosave still appears to call backend saveProjectCampaign.");
}

console.log("T60 Campaign Studio runtime authority closeout verified.");

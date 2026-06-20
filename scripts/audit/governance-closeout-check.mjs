import fs from "fs";
import path from "path";

const root = process.cwd();
const doc = path.join(root, "audits/system-truth/t43-governance-closeout/T43_GOVERNANCE_RUNTIME_AUTHORITY_CLOSEOUT.md");
const src = path.join(root, "public/control-center/pages/governance.js");

if (!fs.existsSync(doc)) {
  throw new Error("Missing T43 Governance closeout document.");
}

const docText = fs.readFileSync(doc, "utf8");
const srcText = fs.readFileSync(src, "utf8");

const docRequired = [
  "Governance runtime authority is closed for this pass.",
  "A minimal authority patch was required and completed.",
  "All sensitive Governance write paths now require explicit operator confirmation."
];

const srcRequired = [
  "confirmGovernanceDecision(decision)",
  "function confirmGovernanceApprovalRequest",
  "confirmGovernanceApprovalRequest({ title, entityType, risk })",
  "await createProjectApproval(projectName",
  "Confirm backend Governance policy save",
  "Sync Settings-derived rules to Governance policy?",
  "await updateProjectGovernancePolicy(projectName"
];

const forbiddenCopy = [
  "Itdoes",
  "review.It",
  "approvalrequest",
  "backendapproval",
  "adurable",
  "Authority:This",
  "SelectCancel",
  "andownership",
  "RecordHigh-Risk",
  "Review&",
  "decisionsshould",
  "revieweddecision",
  "executedirectly",
  "||selectedItem"
];

for (const item of docRequired) {
  if (!docText.includes(item)) {
    throw new Error("Missing T43 document proof: " + item);
  }
}

for (const item of srcRequired) {
  if (!srcText.includes(item)) {
    throw new Error("Missing Governance source proof: " + item);
  }
}

for (const item of forbiddenCopy) {
  if (srcText.includes(item)) {
    throw new Error("Compacted copy still present: " + item);
  }
}

console.log("T43 Governance runtime authority closeout verified.");

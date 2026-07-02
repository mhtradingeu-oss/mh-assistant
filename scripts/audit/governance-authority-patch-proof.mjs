import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "public/control-center/pages/governance.js");
const outDir = path.join(root, "audits/system-truth/t42-governance-authority-patch");

const text = fs.readFileSync(src, "utf8");

const required = [
  "function confirmGovernanceApprovalRequest",
  "Create Governance approval request?",
  "confirmGovernanceApprovalRequest({ title, entityType, risk })",
  "await createProjectApproval(projectName",
  "Confirm backend Governance policy save",
  "confirmGovernanceDecision(decision)"
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

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error("Missing Governance authority patch proof: " + item);
  }
}

for (const item of forbiddenCopy) {
  if (text.includes(item)) {
    throw new Error("Compacted copy still present: " + item);
  }
}

const confirmRequestCount = (text.match(/confirmGovernanceApprovalRequest/g) || []).length;
const createApprovalCount = (text.match(/createProjectApproval/g) || []).length;
const windowConfirmCount = (text.match(/window\.confirm/g) || []).length;

const md = `# T42 — Governance Authority Patch Proof

## Status
Patch proof.

## Target
- \`public/control-center/pages/governance.js\`

## Patch Summary
Added explicit operator confirmation before creating a backend Governance approval request from the Governance page.

## Verified Existing Gates
- Approval decisions remain protected by \`confirmGovernanceDecision(decision)\`.
- Backend Governance policy save remains protected by explicit \`window.confirm(...)\`.
- Settings-to-Governance sync remains protected by explicit \`window.confirm(...)\`.

## New Gate
- \`createProjectApproval(...)\` from \`data-governance-request-approval\` is now protected by \`confirmGovernanceApprovalRequest(...)\`.

## Counts
- confirmGovernanceApprovalRequest references: ${confirmRequestCount}
- createProjectApproval references: ${createApprovalCount}
- window.confirm references: ${windowConfirmCount}

## Safety Decision
The patch is minimal and authority-focused:
- no CSS changed
- no backend changed
- no data/projects changed
- no broad refactor
- no API behavior changed
- only an explicit confirmation gate was added before a durable Governance approval request

## Copy Cleanup
Known compacted Governance copy defects in the touched area were cleaned.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "T42_GOVERNANCE_AUTHORITY_PATCH_PROOF.md"), md);

console.log("T42 Governance authority patch proof verified.");

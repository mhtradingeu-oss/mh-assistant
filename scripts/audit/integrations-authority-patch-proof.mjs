import fs from "fs";
import path from "path";

const root = process.cwd();
const file = path.join(root, "public/control-center/pages/integrations.js");
const text = fs.readFileSync(file, "utf8");

const required = [
  'if (type === "sync" || type === "import")',
  "Confirm integration ${actionLabel}",
  "This action remains backend-governed and may require Governance approval.",
  'governanceCode === "governance_approval_required"',
  'navigateTo("governance")',
  "await reloadProjectData(projectName);",
  "await testProjectIntegration(projectName, integrationId",
  "await syncProjectIntegration(projectName, integrationId",
  "await importProjectIntegrationHistory(projectName, integrationId"
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error("Missing required Integrations authority patch proof: " + item);
  }
}

console.log("T24 Integrations minimal authority patch proof verified.");

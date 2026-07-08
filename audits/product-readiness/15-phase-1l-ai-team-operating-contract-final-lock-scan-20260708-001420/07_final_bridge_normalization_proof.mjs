import fs from "fs";
import { normalizeAiTeamRoleId } from "../../../public/control-center/runtime/ai-team/ai-team-operating-contract.js";

const aiCommand = fs.readFileSync("public/control-center/pages/ai-command.js", "utf8");
const home = fs.readFileSync("public/control-center/pages/home.js", "utf8");

function pass(label, condition) {
  console.log(`${condition ? "PASS" : "FAIL"} - ${label}`);
  return condition ? 0 : 1;
}

let failures = 0;

failures += pass(
  "AI Command imports normalizeAiTeamRoleId",
  aiCommand.includes('import { normalizeAiTeamRoleId } from "../runtime/ai-team/ai-team-operating-contract.js";')
);

failures += pass(
  "AI Command has normalizeAiCommandSpecialistId helper",
  aiCommand.includes("function normalizeAiCommandSpecialistId")
);

failures += pass(
  "AI Command detector uses helper for directMap",
  aiCommand.includes("return normalizeAiCommandSpecialistId(specialistId);")
);

failures += pass(
  "AI Command detector uses helper for classifyIntent fallback",
  aiCommand.includes('return normalizeAiCommandSpecialistId(classified?.modeId, "operations");')
);

failures += pass(
  "Home recommended specialist button uses dynamic label",
  /Ask \$\{escapeHtml\(recommendedSpecialist\?\.name \|\| "Recommended AI"\)\}/.test(home)
);

failures += pass(
  "Home recommended specialist button preserves role id",
  /data-role-id="\$\{escapeHtml\(recommendedSpecialist\.id\)\}"/.test(home)
);

failures += pass(
  "Home still has executive Head Office ask button",
  home.includes("Ask Head Office AI")
);

failures += pass(
  "Home says no execution from Home",
  home.includes("No execution from Home")
);

const aliasCases = {
  admin: "operations",
  operations_lead: "operations",
  executive: "operations",
  copywriter: "writer",
  content_writer: "writer",
  media: "media_director",
  designer: "media_director",
  video: "video_lead",
  ads: "ads_operator",
  customer: "customer_ops",
  customer_operations: "customer_ops",
  support: "customer_ops",
  crm: "sales_crm",
  governance: "compliance_reviewer",
  publishing: "publisher"
};

for (const [input, expected] of Object.entries(aliasCases)) {
  const actual = normalizeAiTeamRoleId(input, "operations");
  failures += pass(`canonical alias ${input} -> ${expected}`, actual === expected);
}

console.log("");
if (failures) {
  console.log(`VERDICT: FAIL - final bridge normalization proof has ${failures} failure(s)`);
  process.exit(1);
}

console.log("VERDICT: PASS - final bridge normalization and Home label proof are locked");

import fs from "fs";
import path from "path";

const root = process.cwd();
const target = path.join(root, "audits/system-truth/t14-library-final-review/T14_LIBRARY_REMAINING_REVIEW_FINAL_AUDIT.md");

if (!fs.existsSync(target)) {
throw new Error("Missing T14 final audit document.");
}

const text = fs.readFileSync(target, "utf8");

const required = [
"No Library safety patch is required at this time.",
"file/drop handler | Verified",
"uploadProjectAsset(activeProjectName, assetType, file)",
"No production code changed."
];

for (const item of required) {
if (!text.includes(item)) {
throw new Error("Missing required T14 closeout proof: " + item);
}
}

console.log("T14 Library final review closeout verified.");

import fs from "fs";
import path from "path";

const root = process.cwd();
const target = path.join(root, "audits/system-truth/t18-ai-command-closeout/T18_AI_COMMAND_RUNTIME_AUTHORITY_CLOSEOUT.md");

if (!fs.existsSync(target)) {
throw new Error("Missing T18 AI Command closeout document.");
}

const text = fs.readFileSync(target, "utf8");

const required = [
"No AI Command runtime/security patch is required at this time.",
"AI Command is verified as a guidance, preview, handoff, and routing surface.",
"Requires approval gate before external publishing actions.",
"No production code changed."
];

for (const item of required) {
if (!text.includes(item)) {
throw new Error("Missing required T18 closeout proof: " + item);
}
}

console.log("T18 AI Command runtime authority closeout verified.");

#!/usr/bin/env bash
set -euo pipefail

cd /opt/mh-assistant

echo "===== AI COMMAND TASK CENTER STATIC PATH CHECK ====="

echo ""
echo "===== SYNTAX VALIDATION ====="
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/pages/operations-centers.js
node --check public/control-center/pages/workflows.js
node --check public/control-center/shared-context.js
node --check public/control-center/app.js
node --check public/control-center/router.js

echo ""
echo "===== REQUIRED AI COMMAND PATHS ====="
grep -n 'destinationRouteForSpecialist' public/control-center/pages/ai-command.js
grep -n 'outputType === "task" ? "task-center"' public/control-center/pages/ai-command.js
grep -n 'setSharedHandoff(projectName || "default", destination' public/control-center/pages/ai-command.js
grep -n 'const languagePlan = getWorkspaceLanguagePlan(aiContext);' public/control-center/pages/ai-command.js

echo ""
echo "===== REQUIRED TASK CENTER PATHS ====="
grep -n 'getSharedHandoff(projectName, "task-center"' public/control-center/pages/operations-centers.js
grep -n 'Incoming Task Handoff' public/control-center/pages/operations-centers.js
grep -n 'taskCenterCopyHandoffBtn' public/control-center/pages/operations-centers.js

echo ""
echo "===== REQUIRED SHARED CONTEXT CONTRACT ====="
grep -n 'export function setSharedHandoff' public/control-center/shared-context.js
grep -n 'export function getSharedHandoff' public/control-center/shared-context.js

echo ""
echo "===== RESULT ====="
echo "Static path check passed."

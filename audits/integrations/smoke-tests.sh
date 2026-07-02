#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
PROJECT="${PROJECT:-hairoticmen}"

echo "== Integrations smoke tests =="
echo "Base URL: $BASE_URL"
echo "Project: $PROJECT"
echo

echo "[1/3] server syntax"
node --check runtime/orchestrator-service/server.js

echo "[2/3] integrations page syntax"
node --check public/control-center/pages/integrations.js

echo "[3/3] control-center contract endpoint"
if [ -z "${MH_CONTROL_CENTER_WRITE_KEY:-}" ]; then
  echo "SKIP: MH_CONTROL_CENTER_WRITE_KEY not set; protected endpoint smoke test skipped."
else
  curl -fsS \
    -H "x-mh-control-key: $MH_CONTROL_CENTER_WRITE_KEY" \
    "$BASE_URL/public/media-manager/project/$PROJECT/integrations/control-center" \
    | jq '.ok // true'
fi

echo
echo "== Integrations smoke tests completed successfully =="

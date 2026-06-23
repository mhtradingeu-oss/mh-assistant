#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/nadeemnour/Desktop/Last-Update-MH-Assistant"
SERVICE_DIR="$ROOT/runtime/orchestrator-service"
PORT="${PORT:-3000}"
WRITE_KEY="${MH_CONTROL_CENTER_WRITE_KEY:-dev-local-key}"

export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
export MH_CONTROL_CENTER_WRITE_KEY="$WRITE_KEY"

echo "===== MH-OS LOCAL CONTROL CENTER RUNNER ====="
echo "Root: $ROOT"
echo "Service: $SERVICE_DIR"
echo "Port: $PORT"
echo "Write key: configured"
echo ""

cd "$ROOT"

echo "===== PRE-CHECK 1: GIT STATUS ====="
git status --short
echo ""

echo "===== PRE-CHECK 2: REQUIRED FILES ====="
test -f "$SERVICE_DIR/server.js"
test -f "$ROOT/public/control-center/app.js"
test -f "$ROOT/public/control-center/router.js"
test -f "$ROOT/public/control-center/pages/customer-center.js"
echo "Required files found."
echo ""

echo "===== PRE-CHECK 3: SYNTAX VALIDATION ====="
node --check "$SERVICE_DIR/server.js"
node --check "$ROOT/public/control-center/app.js"
node --check "$ROOT/public/control-center/router.js"
node --check "$ROOT/public/control-center/api.js"
node --check "$ROOT/public/control-center/pages/customer-center.js"
echo "Syntax validation passed."
echo ""

echo "===== PRE-CHECK 4: PORT STATUS ====="
if lsof -i ":$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is already in use:"
  lsof -i ":$PORT" | sed -n '1,20p'
  echo ""
  echo "No action taken. Stop the existing server manually if you want to restart."
  echo "Example:"
  echo "  kill <PID>"
  exit 1
fi

echo "Port $PORT is free."
echo ""

echo "===== START SERVER ====="
cd "$SERVICE_DIR"
echo "Running: MH_CONTROL_CENTER_WRITE_KEY=$MH_CONTROL_CENTER_WRITE_KEY node server.js"
exec node server.js

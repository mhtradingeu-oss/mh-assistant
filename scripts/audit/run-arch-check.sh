#!/usr/bin/env bash
set -e

echo "🧠 Running Architecture Guard..."

STAGED_FILES="$(git diff --cached --name-only)"

if ! echo "$STAGED_FILES" | grep -qE '^runtime/orchestrator-service/server\.js$'; then
  echo "✅ Architecture Guard: orchestrator not staged, skipping orchestrator purity scan"
  exit 0
fi

node scripts/audit/architecture-guard.js

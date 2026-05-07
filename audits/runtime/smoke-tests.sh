#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
PROJECT="${PROJECT:-hairoticmen}"

echo "== Runtime smoke tests =="
echo "Base URL: $BASE_URL"
echo "Project: $PROJECT"
echo

echo "[1/6] server syntax"
node --check runtime/orchestrator-service/server.js

echo "[2/6] health"
curl -fsS "$BASE_URL/health" | head -c 500
echo
echo

echo "[3/6] scheduler queue"
curl -fsS "$BASE_URL/scheduler_queue?project=$PROJECT" | head -c 1200
echo
echo

echo "[4/6] scheduler worker once"
curl -fsS -X POST "$BASE_URL/run_scheduler_worker_once?project=$PROJECT" \
  -H "Content-Type: application/json" \
  -d '{}' | head -c 1200
echo
echo

echo "[5/6] smart suggestions"
curl -fsS "$BASE_URL/get_smart_suggestions?project=$PROJECT" | head -c 1400
echo
echo

echo "[6/6] optimization recommendations"
curl -fsS -X POST "$BASE_URL/generate_optimization_recommendations?project=$PROJECT" \
  -H "Content-Type: application/json" \
  -d '{}' | head -c 1400
echo
echo

echo "== Smoke tests completed successfully =="

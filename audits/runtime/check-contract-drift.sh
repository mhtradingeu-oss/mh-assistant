#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
PROJECT="${PROJECT:-hairoticmen}"
TMP_DIR="$(mktemp -d)"
CONTRACT_DIR="audits/runtime/contracts"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "== Runtime contract drift check =="
echo "Base URL: $BASE_URL"
echo "Project: $PROJECT"
echo

curl -fsS "$BASE_URL/health" \
  | jq . > "$TMP_DIR/health.json"

curl -fsS "$BASE_URL/scheduler_queue?project=$PROJECT" \
  | jq . > "$TMP_DIR/scheduler_queue.json"

curl -fsS "$BASE_URL/get_smart_suggestions?project=$PROJECT" \
  | jq 'del(.suggestions.generated_at)' \
  > "$TMP_DIR/get_smart_suggestions.json"

curl -fsS -X POST "$BASE_URL/generate_optimization_recommendations?project=$PROJECT" \
  -H "Content-Type: application/json" \
  -d '{}' \
  | jq 'del(.generated_at, .recommendations.generated_at)' \
  > "$TMP_DIR/generate_optimization_recommendations.json"

curl -fsS -X POST "$BASE_URL/run_scheduler_worker_once?project=$PROJECT" \
  -H "Content-Type: application/json" \
  -d '{}' \
  | jq 'del(.worker_id)' \
  > "$TMP_DIR/run_scheduler_worker_once.json"

normalize_contract() {
  local file="$1"
  local src="$2"
  local dest="$3"

  case "$file" in
    get_smart_suggestions.json)
      jq 'del(.suggestions.generated_at)' "$src" > "$dest"
      ;;
    run_scheduler_worker_once.json)
      jq 'del(.worker_id)' "$src" > "$dest"
      ;;
    generate_optimization_recommendations.json)
      jq 'del(.generated_at, .recommendations.generated_at)' "$src" > "$dest"
      ;;
    *)
      jq . "$src" > "$dest"
      ;;
  esac
}

status=0

for file in health.json scheduler_queue.json get_smart_suggestions.json generate_optimization_recommendations.json run_scheduler_worker_once.json; do
  echo "Checking $file"

  if [ ! -f "$CONTRACT_DIR/$file" ]; then
    echo "Missing contract: $CONTRACT_DIR/$file"
    status=1
    continue
  fi

  normalize_contract "$file" "$CONTRACT_DIR/$file" "$TMP_DIR/expected-$file"
  normalize_contract "$file" "$TMP_DIR/$file" "$TMP_DIR/actual-$file"

  if ! diff -u "$TMP_DIR/expected-$file" "$TMP_DIR/actual-$file" > "$TMP_DIR/$file.diff"; then
    echo "DRIFT detected in $file"
    cat "$TMP_DIR/$file.diff"
    status=1
  else
    echo "OK: $file"
  fi

  echo
done

if [ "$status" -ne 0 ]; then
  echo "Contract drift check failed."
  exit "$status"
fi

echo "No contract drift detected."

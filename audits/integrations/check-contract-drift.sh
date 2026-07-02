#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
PROJECT="${PROJECT:-hairoticmen}"

TMP_DIR="$(mktemp -d)"
CONTRACT_DIR="audits/integrations/contracts"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "== Integrations contract drift check =="
echo "Base URL: $BASE_URL"
echo "Project: $PROJECT"
echo

if [ -z "${MH_CONTROL_CENTER_WRITE_KEY:-}" ]; then
  echo "SKIP: MH_CONTROL_CENTER_WRITE_KEY not set."
  echo "Protected integrations contract drift check skipped."
  exit 0
fi

curl -fsS \
  -H "x-mh-control-key: $MH_CONTROL_CENTER_WRITE_KEY" \
  "$BASE_URL/public/media-manager/project/$PROJECT/integrations/control-center" \
  | jq . \
  > "$TMP_DIR/control-center.json"

status=0

echo "Checking control-center.json"

if [ ! -f "$CONTRACT_DIR/control-center.json" ]; then
  echo "Missing contract snapshot."
  status=1
else
  if ! diff -u \
    "$CONTRACT_DIR/control-center.json" \
    "$TMP_DIR/control-center.json" \
    > "$TMP_DIR/control-center.diff"; then

    echo "DRIFT detected in control-center.json"
    cat "$TMP_DIR/control-center.diff"
    status=1
  else
    echo "OK: control-center.json"
  fi
fi

echo

if [ "$status" -ne 0 ]; then
  echo "Integrations contract drift check failed."
  exit 1
fi

echo "No integrations contract drift detected."

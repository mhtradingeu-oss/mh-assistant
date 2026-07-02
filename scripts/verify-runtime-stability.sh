#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_FILE="$ROOT_DIR/runtime/orchestrator-service/server.js"
LOG_DIR="${TMPDIR:-/tmp}/mh-orchestrator-stability"
TEST_PROJECT="${MH_TEST_PROJECT:-${MH_DEFAULT_PROJECT:-phase375smoke}}"
mkdir -p "$LOG_DIR"

if [[ ! -f "$SERVER_FILE" ]]; then
  echo "Server file not found: $SERVER_FILE" >&2
  exit 1
fi

ACTIVE_PID=""

cleanup() {
  if [[ -n "$ACTIVE_PID" ]] && kill -0 "$ACTIVE_PID" 2>/dev/null; then
    kill "$ACTIVE_PID" 2>/dev/null || true
    wait "$ACTIVE_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

wait_for_server() {
  local url="$1"
  local retries="${2:-60}"
  local delay="${3:-0.25}"
  local i

  for ((i = 1; i <= retries; i++)); do
    if curl -sS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
  done

  echo "Server did not become ready at $url" >&2
  return 1
}

http_status() {
  local method="$1"
  local url="$2"
  local body_file="$3"
  shift 3
  curl -sS -X "$method" "$url" -o "$body_file" -w "%{http_code}" "$@"
}

assert_status() {
  local label="$1"
  local expected="$2"
  local actual="$3"
  if [[ "$actual" != "$expected" ]]; then
    echo "[FAIL] $label: expected $expected, got $actual" >&2
    exit 1
  fi
  echo "[PASS] $label: $actual"
}

assert_non_2xx() {
  local label="$1"
  local actual="$2"
  if [[ "$actual" =~ ^2[0-9][0-9]$ ]]; then
    echo "[FAIL] $label: expected non-2xx, got $actual" >&2
    exit 1
  fi
  echo "[PASS] $label: $actual"
}

assert_contains() {
  local label="$1"
  local file="$2"
  local pattern="$3"
  if ! grep -q "$pattern" "$file"; then
    echo "[FAIL] $label: pattern '$pattern' not found in $file" >&2
    echo "Response was:" >&2
    cat "$file" >&2
    exit 1
  fi
  echo "[PASS] $label"
}

start_server() {
  local port="$1"
  local key_env_value="$2"
  local log_file="$3"

  cleanup

  PORT="$port" MH_CONTROL_CENTER_WRITE_KEY="$key_env_value" \
    node "$SERVER_FILE" >"$log_file" 2>&1 &
  ACTIVE_PID="$!"

  wait_for_server "http://127.0.0.1:$port/healthz"
}

echo "== Case 1: Missing write key env =="
CASE1_PORT=39101
CASE1_LOG="$LOG_DIR/case1.log"
CASE1_BODY="$LOG_DIR/case1.body.json"

start_server "$CASE1_PORT" "" "$CASE1_LOG"

code="$(http_status GET "http://127.0.0.1:$CASE1_PORT/healthz" "$CASE1_BODY")"
assert_status "healthz when key missing" "200" "$code"
assert_contains "healthz status" "$CASE1_BODY" '"status":"ok"'

code="$(http_status GET "http://127.0.0.1:$CASE1_PORT/readyz" "$CASE1_BODY")"
assert_status "readyz when key missing" "503" "$code"
assert_contains "readyz missing env marker" "$CASE1_BODY" '"MH_CONTROL_CENTER_WRITE_KEY"'

code="$(http_status POST "http://127.0.0.1:$CASE1_PORT/media-manager/project/$TEST_PROJECT/approvals" "$CASE1_BODY" -H "Content-Type: application/json" -d '{}')"
assert_status "protected write without configured key" "503" "$code"


echo "== Case 2: Write key configured =="
CASE2_PORT=39102
CASE2_LOG="$LOG_DIR/case2.log"
CASE2_BODY="$LOG_DIR/case2.body.json"

start_server "$CASE2_PORT" "test-write-key" "$CASE2_LOG"

code="$(http_status GET "http://127.0.0.1:$CASE2_PORT/readyz" "$CASE2_BODY")"
assert_status "readyz when key configured" "200" "$code"
assert_contains "readyz configured flag" "$CASE2_BODY" '"key_configured":true'

code="$(http_status POST "http://127.0.0.1:$CASE2_PORT/media-manager/project/$TEST_PROJECT/approvals" "$CASE2_BODY" -H "Content-Type: application/json" -d '{}')"
assert_status "protected write without provided key" "401" "$code"

code="$(http_status POST "http://127.0.0.1:$CASE2_PORT/media-manager/project/$TEST_PROJECT/approvals" "$CASE2_BODY" -H "Content-Type: application/json" -H "x-mh-control-key: wrong-key" -d '{}')"
assert_status "protected write with invalid key" "403" "$code"

code="$(http_status POST "http://127.0.0.1:$CASE2_PORT/publish-blog/not-a-real-draft" "$CASE2_BODY" -H "x-mh-control-key: test-write-key" -H "Content-Type: application/json" -d '{}')"
assert_non_2xx "known failure mutation returns non-2xx" "$code"

echo "All runtime stability checks passed."

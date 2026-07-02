"use strict";

function resolve(message) {
  const text = String(message || "").toLowerCase();

  if (
    text.includes("send") ||
    text.includes("publish") ||
    text.includes("launch live") ||
    text.includes("deploy") ||
    text.includes("merge") ||
    text.includes("delete")
  ) return "approval_required";

  if (
    text.includes("prepare") ||
    text.includes("draft") ||
    text.includes("generate")
  ) return "prepare";

  return "analyze";
}

module.exports = { resolve };

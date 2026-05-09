/*
  Integrations OS Builders Layer

  Pure data transformation only.
  No DOM rendering.
  No runtime side effects.
*/

export function summarizeSectionCards(cards = []) {
  const list = Array.isArray(cards) ? cards : [];

  return {
    connected: list.filter((card) => card.statusLabel === "Connected").length,
    notConnected: list.filter((card) => card.statusLabel === "Not Connected").length,
    needsAttention: list.filter((card) =>
      ["Partial", "Token expired", "Error"].includes(card.statusLabel)
    ).length
  };
}

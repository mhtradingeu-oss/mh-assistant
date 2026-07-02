"use strict";

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function firstNumber(...values) {
  for (const value of values) {
    const number = toNumber(value, NaN);
    if (Number.isFinite(number)) return number;
  }
  return 0;
}

class EconomicCore {
  calculateProfit(state = {}) {
    const value = firstNumber(
      state.profit?.value,
      state.profit,
      state.metrics?.profit,
      state.finance?.profit,
      state.revenue?.profit,
      state.revenue
    );

    return {
      value,
      source: "economic_core_profit"
    };
  }

  analyzeIntegration(state = {}) {
    const value = firstNumber(
      state.integration?.value,
      state.integrations?.value,
      state.metrics?.integration_revenue,
      state.metrics?.commerce_revenue,
      state.commerce?.revenue,
      state.ads?.revenue
    );

    return {
      value,
      source: "economic_core_integration"
    };
  }

  collect(state = {}) {
    const profit = this.calculateProfit(state);
    const integration = this.analyzeIntegration(state);
    const total = profit.value + integration.value;

    return {
      profit,
      integration,
      total,
      status: "AGGREGATED_BY_ECONOMIC_CORE"
    };
  }

  decide(revenue = {}) {
    const total = toNumber(revenue.total, 0);

    if (total < 1000) return "GROW_AGGRESSIVE";
    if (total < 5000) return "OPTIMIZE";
    return "SCALE_STABLE";
  }

  analyze(state = {}) {
    const revenue = this.collect(state);

    return {
      revenue,
      decision: this.decide(revenue),
      timestamp: Date.now(),
      status: "ECONOMIC_CORE_ACTIVE"
    };
  }
}

const economicCore = new EconomicCore();

module.exports = economicCore;
module.exports.EconomicCore = EconomicCore;


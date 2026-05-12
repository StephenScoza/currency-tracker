import type { FxHistory, FxLatest, FxPoint, TimeRange } from "../types/fx.js";
import type { FxProvider } from "./FxProvider.js";
import { buildPair } from "../utils/pairs.js";

const rangeToDays: Record<TimeRange, number> = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "1Y": 365,
};

const generateHistory = (): FxPoint[] => {
  const totalDays = 365;
  const today = new Date();
  let rate = 4.92;
  const points: FxPoint[] = [];

  for (let index = totalDays - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    const macroTrend = Math.sin(index / 20) * 0.085;
    const policySwing = Math.cos(index / 48) * 0.047;
    const drift = index > 240 ? 0.001 : index > 120 ? -0.0005 : 0.0011;
    const volatility = Math.sin(index * 1.71) * 0.019 + Math.cos(index * 0.56) * 0.013;
    rate = Math.min(5.76, Math.max(4.64, rate + drift + macroTrend * 0.015 + policySwing * 0.02 + volatility));

    points.push({
      date: date.toISOString(),
      rate: Number(rate.toFixed(4)),
    });
  }

  return points;
};

const historyByPair: Record<string, FxPoint[]> = {
  "usd-brl": generateHistory(),
};

export class MockFxProvider implements FxProvider {
  readonly name = "mock";

  async getLatestRate(pairSymbol: string): Promise<FxLatest> {
    const pair = buildPair(pairSymbol);
    const points = historyByPair[pairSymbol] ?? historyByPair["usd-brl"];
    const rate = points[points.length - 1]?.rate ?? 0;

    return {
      pair,
      rate,
      timestamp: new Date().toISOString(),
      source: this.name,
      previousRate: points[points.length - 2]?.rate ?? rate,
    };
  }

  async getHistoricalRates(pairSymbol: string, range: TimeRange): Promise<FxHistory> {
    const pair = buildPair(pairSymbol);
    const points = historyByPair[pairSymbol] ?? historyByPair["usd-brl"];

    return {
      pair,
      points: points.slice(-rangeToDays[range]),
      range,
      source: this.name,
      updatedAt: new Date().toISOString(),
    };
  }
}

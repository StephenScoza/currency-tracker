import type {
  CurrencyPair,
  FxDashboardData,
  FxHistory,
  FxLatest,
  FxPoint,
  SignalAssessment,
  TimeRange,
} from "../types/currency";
import { buildSignalAssessment } from "../utils/signalEngine";

const pair: CurrencyPair = {
  base: "USD",
  quote: "BRL",
  symbol: "usd-brl",
  displayName: "US Dollar to Brazilian Real",
};

const generateHistoricalRates = (): FxPoint[] => {
  const today = new Date();
  const totalDays = 365;
  const points: FxPoint[] = [];
  let rate = 4.92;

  for (let index = totalDays - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    const seasonality = Math.sin(index / 18) * 0.08;
    const secondaryCycle = Math.cos(index / 43) * 0.05;
    const drift = index > 220 ? 0.0012 : index > 120 ? -0.0004 : 0.0009;
    const shock = Math.sin(index * 1.73) * 0.018 + Math.cos(index * 0.61) * 0.012;
    rate = Math.min(5.74, Math.max(4.65, rate + drift + seasonality * 0.015 + secondaryCycle * 0.02 + shock));

    points.push({
      date: date.toISOString(),
      rate: Number(rate.toFixed(4)),
    });
  }

  return points;
};

const rangeToDays: Record<TimeRange, number> = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "1Y": 365,
};

const allPoints = generateHistoricalRates();

export const createMockUsdBrlLatest = (): FxLatest => {
  const rate = allPoints[allPoints.length - 1]?.rate ?? 0;

  return {
    pair,
    rate,
    timestamp: new Date().toISOString(),
    source: "mock",
    previousRate: allPoints[allPoints.length - 2]?.rate ?? rate,
  };
};

export const createMockUsdBrlHistory = (range: TimeRange): FxHistory => {
  return {
    pair,
    points: allPoints.slice(-rangeToDays[range]),
    range,
    source: "mock",
    updatedAt: new Date().toISOString(),
  };
};

export const createMockUsdBrlSignal = (): SignalAssessment => buildSignalAssessment(allPoints);

export const createMockUsdBrlSeries = (): FxDashboardData => {
  const points = allPoints;
  const currentRate = points[points.length - 1]?.rate ?? 0;
  const previousRate = points[points.length - 2]?.rate ?? currentRate;
  const changeAmount = currentRate - previousRate;

  return {
    pair,
    latest: createMockUsdBrlLatest(),
    history: createMockUsdBrlHistory("1Y"),
    snapshot: {
      currentRate,
      previousRate,
      change: {
        amount: Number(changeAmount.toFixed(4)),
        percentage: Number(((changeAmount / previousRate) * 100).toFixed(2)),
      },
      high: Math.max(...points.map((point) => point.rate)),
      low: Math.min(...points.map((point) => point.rate)),
    },
    signal: createMockUsdBrlSignal(),
    updatedAt: new Date().toISOString(),
  };
};

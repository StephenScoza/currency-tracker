import {
  createMockUsdBrlHistory,
  createMockUsdBrlLatest,
  createMockUsdBrlSeries,
  createMockUsdBrlSignal,
} from "../data/mockUsdBrl";
import type {
  FxDashboardData,
  FxHistory,
  FxLatest,
  SignalAssessment,
  TimeRange,
} from "../types/currency";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:7001";

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`FX request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};

export const getLatestRate = async (pairSymbol: string): Promise<FxLatest> => {
  try {
    const payload = await fetchJson<{ data: FxLatest }>(`/fx/${pairSymbol}/latest`);
    return payload.data;
  } catch (error) {
    if (pairSymbol === "usd-brl") {
      return createMockUsdBrlLatest();
    }

    throw error;
  }
};

export const getHistoricalRates = async (pairSymbol: string, range: TimeRange): Promise<FxHistory> => {
  try {
    const payload = await fetchJson<{ data: FxHistory }>(`/fx/${pairSymbol}/history?range=${range}`);
    return payload.data;
  } catch (error) {
    if (pairSymbol === "usd-brl") {
      return createMockUsdBrlHistory(range);
    }

    throw error;
  }
};

export const getSignal = async (pairSymbol: string): Promise<SignalAssessment> => {
  try {
    const payload = await fetchJson<{ data: SignalAssessment }>(`/fx/${pairSymbol}/signal`);
    return payload.data;
  } catch (error) {
    if (pairSymbol === "usd-brl") {
      return createMockUsdBrlSignal();
    }

    throw error;
  }
};

export const getFxDashboardData = async (
  pairSymbol: string,
  range: TimeRange,
): Promise<FxDashboardData> => {
  try {
    const [latest, history, signal] = await Promise.all([
      getLatestRate(pairSymbol),
      getHistoricalRates(pairSymbol, range),
      getSignal(pairSymbol),
    ]);
    const previousRate = latest.previousRate ?? history.points[history.points.length - 2]?.rate ?? latest.rate;
    const changeAmount = latest.rate - previousRate;

    return {
      pair: latest.pair,
      latest,
      history,
      snapshot: {
        currentRate: latest.rate,
        previousRate,
        change: {
          amount: Number(changeAmount.toFixed(4)),
          percentage: Number(((changeAmount / previousRate) * 100).toFixed(2)),
        },
        high: Math.max(...history.points.map((point) => point.rate)),
        low: Math.min(...history.points.map((point) => point.rate)),
      },
      signal,
      updatedAt: latest.timestamp,
    };
  } catch (error) {
    if (pairSymbol === "usd-brl") {
      return createMockUsdBrlSeries();
    }

    throw error;
  }
};

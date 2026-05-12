import type { FxHistory, FxLatest, SignalAssessment, TimeRange } from "../types/fx.js";
import { MockFxProvider } from "../providers/MockFxProvider.js";
import type { FxProvider } from "../providers/FxProvider.js";
import { TwelveDataFxProvider } from "../providers/TwelveDataFxProvider.js";
import { CacheService } from "./cacheService.js";
import { buildSignalAssessment } from "../utils/signalEngine.js";

const LATEST_TTL_MS = 60 * 1000;
const HISTORY_TTL_MS = 60 * 60 * 1000;

const cacheService = new CacheService();

const getProvider = (): FxProvider => {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (apiKey && apiKey !== "replace-with-your-twelve-data-api-key") {
    return new TwelveDataFxProvider(apiKey);
  }

  return new MockFxProvider();
};
export const getLatestRate = async (pairSymbol: string): Promise<FxLatest> => {
  const cacheKey = `latest:${pairSymbol}`;
  const cached = cacheService.get<FxLatest>(cacheKey);
  if (cached) {
    return cached;
  }

  const provider = getProvider();
  const latest = await provider.getLatestRate(pairSymbol);
  cacheService.set(cacheKey, latest, LATEST_TTL_MS);
  return latest;
};

export const getHistoricalRates = async (
  pairSymbol: string,
  range: TimeRange,
): Promise<FxHistory> => {
  const cacheKey = `history:${pairSymbol}:${range}`;
  const cached = cacheService.get<FxHistory>(cacheKey);
  if (cached) {
    return cached;
  }

  const provider = getProvider();
  const history = await provider.getHistoricalRates(pairSymbol, range);
  cacheService.set(cacheKey, history, HISTORY_TTL_MS);
  return history;
};

export const getSignal = async (pairSymbol: string): Promise<SignalAssessment> => {
  const [history, latest] = await Promise.all([
    getHistoricalRates(pairSymbol, "1Y"),
    getLatestRate(pairSymbol),
  ]);

  const points = history.points.slice();
  if (points.length > 0) {
    points[points.length - 1] = {
      date: latest.timestamp,
      rate: latest.rate,
    };
  }

  return buildSignalAssessment(points);
};

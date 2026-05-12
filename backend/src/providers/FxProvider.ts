import type { FxHistory, FxLatest, TimeRange } from "../types/fx.js";

export interface FxProvider {
  readonly name: string;
  getLatestRate(pairSymbol: string): Promise<FxLatest>;
  getHistoricalRates(pairSymbol: string, range: TimeRange): Promise<FxHistory>;
}

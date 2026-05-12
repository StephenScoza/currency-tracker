import type { FxHistory, FxLatest, TimeRange } from "../types/fx.js";
import type { FxProvider } from "./FxProvider.js";

export class FutureProvider implements FxProvider {
  readonly name = "future-provider";

  async getLatestRate(_pairSymbol: string): Promise<FxLatest> {
    throw new Error("FutureProvider is a placeholder for future provider integrations.");
  }

  async getHistoricalRates(_pairSymbol: string, _range: TimeRange): Promise<FxHistory> {
    throw new Error("FutureProvider is a placeholder for future provider integrations.");
  }
}

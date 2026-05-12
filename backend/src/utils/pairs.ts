import type { CurrencyPair } from "../types/fx.js";

export const buildPair = (pairSymbol: string): CurrencyPair => {
  const normalized = pairSymbol.toLowerCase();
  const [base = "usd", quote = "brl"] = normalized.split("-");

  return {
    base: base.toUpperCase(),
    quote: quote.toUpperCase(),
    symbol: normalized,
    displayName: `${base.toUpperCase()} to ${quote.toUpperCase()}`,
  };
};

export const toTwelveDataSymbol = (pair: CurrencyPair) => `${pair.base}/${pair.quote}`;

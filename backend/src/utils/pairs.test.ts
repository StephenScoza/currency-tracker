import { describe, expect, it } from "vitest";

import { buildPair, toTwelveDataSymbol } from "./pairs.js";

describe("currency pair helpers", () => {
  it("normalizes route pair symbols into reusable currency pair objects", () => {
    expect(buildPair("usd-brl")).toEqual({
      base: "USD",
      quote: "BRL",
      symbol: "usd-brl",
      displayName: "USD to BRL",
    });
  });

  it("formats Twelve Data symbols with a slash separator", () => {
    expect(toTwelveDataSymbol(buildPair("usd-brl"))).toBe("USD/BRL");
  });
});

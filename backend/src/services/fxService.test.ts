import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

const loadFxService = async () => {
  vi.resetModules();
  process.env.FX_CACHE_PERSISTENCE = "false";
  process.env.TWELVE_DATA_API_KEY = "";
  return import("./fxService.js");
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
  process.env = { ...originalEnv };
});

describe("fxService provider orchestration", () => {
  it("falls through to the next configured latest-rate provider when the first provider fails", async () => {
    process.env.FX_LATEST_PROVIDER_PRIORITY = "awesomeapi,exchange-rate-api,mock";
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const requestUrl = String(url);

      if (requestUrl.includes("economia.awesomeapi.com.br")) {
        return new Response("provider unavailable", { status: 503 });
      }

      if (requestUrl.includes("open.er-api.com")) {
        return new Response(
          JSON.stringify({
            result: "success",
            time_last_update_utc: "Wed, 13 May 2026 00:00:00 +0000",
            rates: { BRL: 5.21 },
          }),
          { status: 200 },
        );
      }

      return new Response("unexpected provider", { status: 500 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getLatestRate } = await loadFxService();
    const latest = await getLatestRate("usd-brl");

    expect(latest.source).toBe("exchange-rate-api");
    expect(latest.rate).toBe(5.21);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("derives shorter history ranges from cached 1Y history", async () => {
    process.env.FX_HISTORY_PROVIDER_PRIORITY = "mock";
    const { getHistoricalRates } = await loadFxService();

    const yearly = await getHistoricalRates("usd-brl", "1Y");
    const weekly = await getHistoricalRates("usd-brl", "7D");

    expect(yearly.source).toBe("mock");
    expect(weekly.source).toBe("mock-derived");
    expect(weekly.points).toHaveLength(7);
    expect(weekly.points).toEqual(yearly.points.slice(-7));
  });
});

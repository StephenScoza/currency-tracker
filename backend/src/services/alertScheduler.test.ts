import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FxHistory, FxLatest, SignalAssessment } from "../types/fx.js";

const originalEnv = { ...process.env };
const testDirs: string[] = [];

const createStorageDir = () => {
  const dir = mkdtempSync(path.join(tmpdir(), "reaisify-alerts-"));
  testDirs.push(dir);
  return dir;
};

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  process.env = { ...originalEnv };

  while (testDirs.length > 0) {
    const dir = testDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

const latestFixture: FxLatest = {
  pair: {
    base: "USD",
    quote: "BRL",
    symbol: "usd-brl",
    displayName: "USD to BRL",
  },
  rate: 5.5,
  timestamp: "2026-05-18T12:00:00.000Z",
  source: "test-provider",
};

const historyFixture: FxHistory = {
  pair: latestFixture.pair,
  points: [
    { date: "2026-05-16T00:00:00.000Z", rate: 5.1 },
    { date: "2026-05-17T00:00:00.000Z", rate: 5.3 },
    { date: "2026-05-18T00:00:00.000Z", rate: 5.5 },
  ],
  range: "30D",
  source: "test-history",
  updatedAt: "2026-05-18T12:00:00.000Z",
};

const signalFixture: SignalAssessment = {
  recommendation: "GOOD",
  confidence: 82,
  reasoning: "The current rate is above the target.",
  trendDirection: "UP",
  percentile: 0.82,
  movingAverageGap: 0.1,
  momentum: 0.02,
};

describe("alert scheduler", () => {
  it("sends one notification when an alert crosses above target and avoids duplicate sends", async () => {
    process.env.ALERT_STORAGE_DIR = createStorageDir();
    process.env.DISCORD_WEBHOOK_URL = "";

    vi.doMock("./fxService.js", () => ({
      getLatestRate: vi.fn(async () => latestFixture),
      getHistoricalRates: vi.fn(async () => historyFixture),
      buildSignalFromSeries: vi.fn(() => signalFixture),
    }));

    const { createAlert, listAlerts } = await import("./alertService.js");
    const { listDeliveryLogs } = await import("./discordService.js");
    const { runAlertCheckOnce } = await import("./alertScheduler.js");

    const alert = await createAlert({ pairSymbol: "usd-brl", targetRate: 5.4 }, 5.2);
    expect(alert.lastObservedState).toBe("BELOW");

    await runAlertCheckOnce();
    await runAlertCheckOnce();

    const [updatedAlert] = await listAlerts("usd-brl");
    const deliveries = await listDeliveryLogs(10);

    expect(updatedAlert.lastObservedState).toBe("ABOVE");
    expect(updatedAlert.lastTriggeredRate).toBe(5.5);
    expect(deliveries).toHaveLength(1);
    expect(deliveries[0]).toMatchObject({
      alertId: alert.id,
      destination: "log-only",
      observedRate: 5.5,
      recommendation: "GOOD",
    });
  });
});

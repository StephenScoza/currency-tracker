import { describe, expect, it } from "vitest";

import type { FxPoint } from "../types/currency";
import { buildSignalAssessment } from "./signalEngine";

const point = (index: number, rate: number): FxPoint => ({
  date: `2026-01-${String(index + 1).padStart(2, "0")}`,
  rate,
});

describe("buildSignalAssessment", () => {
  it("recommends converting when the current rate is strong against recent history", () => {
    const points = Array.from({ length: 30 }, (_, index) => point(index, 5 + index * 0.01));

    const signal = buildSignalAssessment(points);

    expect(signal.recommendation).toBe("GOOD");
    expect(signal.trendDirection).toBe("UP");
    expect(signal.percentile).toBe(1);
    expect(signal.movingAverageGap).toBeGreaterThan(0);
    expect(signal.reasoning).toContain("upper quartile");
  });

  it("recommends waiting when the current rate is weak and momentum is falling", () => {
    const points = Array.from({ length: 30 }, (_, index) => point(index, 5.6 - index * 0.02));

    const signal = buildSignalAssessment(points);

    expect(signal.recommendation).toBe("WAIT");
    expect(signal.trendDirection).toBe("DOWN");
    expect(signal.percentile).toBeCloseTo(1 / 30);
    expect(signal.movingAverageGap).toBeLessThan(0);
    expect(signal.reasoning).toContain("below the 40th percentile");
  });
});
